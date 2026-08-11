'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.MeetingTaskRecognitionV2=api;
  if(typeof document!=='undefined'){
    try{
      extractMeetingTaskCandidates=function(meeting){
        const people=typeof teamMemberDirectory==='function'?teamMemberDirectory():[];
        const projects=typeof state!=='undefined'&&Array.isArray(state.projects)?state.projects:[];
        const rows=api.extractMeetingTaskCandidates(meeting,{people,projects});
        return rows.map(row=>({...row,id:typeof uid==='function'?uid():`${Date.now()}-${Math.random()}`}));
      };
    }catch(e){console.warn('MeetingTaskRecognitionV2 install failed',e)}
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const ACTION_RE=/(?:подготов(?:ить|ьте)|согласовать|проверить|сделать|отправить|разработать|организовать|провести|собрать|создать|написать|обновить|доработать|заполнить|составить|позвонить|связаться|уточнить|назначить|передать|загрузить|проанализировать|представить|оформить|завершить|прислать|пригласить|настроить)/i;
  const ASSIGN_RE=/(?:ответственн(?:ый|ая|ые)|исполнитель|поручено|поручить|долж(?:ен|на|ны)|нужно|необходимо)/i;
  const norm=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[«»"'()]/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const tokens=s=>norm(s).split(/\s+/).filter(Boolean);
  const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const validDate=(y,m,d)=>{const x=new Date(y,m-1,d,12);return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d};
  const isoDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const parseIso=s=>{const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return null;const y=+m[1],mo=+m[2],d=+m[3];return validDate(y,mo,d)?new Date(y,mo-1,d,12):null};

  function matchPerson(text,people=[]){
    const source=norm(text),sourceTokens=tokens(text);
    const scored=people.map(person=>{
      const pt=tokens(person.name),surname=pt[0]||'';
      if(!surname)return {person,score:0};
      let score=0;
      if(sourceTokens.includes(surname))score+=10;
      else if(surname.length>=5){
        const stem=surname.slice(0,Math.max(5,surname.length-2));
        if(sourceTokens.some(t=>t.startsWith(stem)))score+=6;
      }
      pt.slice(1).forEach(t=>{if(t.length===1&&sourceTokens.includes(t))score+=1;else if(t.length>1&&source.includes(t))score+=1});
      return {person,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    return scored[0]&&(!scored[1]||scored[0].score>scored[1].score)?scored[0].person:null;
  }

  function extractDeadline(text='',fallback=''){
    const base=parseIso(fallback)||new Date();
    const source=String(text||'');
    let m=source.match(/\b(20\d{2})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/);
    if(m){const y=+m[1],mo=+m[2],d=+m[3];if(validDate(y,mo,d))return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
    m=source.match(/\b(?:до|к)?\s*(0?[1-9]|[12]\d|3[01])[./](0?[1-9]|1[0-2])(?:[./](20\d{2}))?\b/i);
    if(m){let y=m[3]?+m[3]:base.getFullYear(),mo=+m[2],d=+m[1];if(!m[3]&&mo<base.getMonth()+1)y++;if(validDate(y,mo,d))return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
    m=source.match(/\b(?:до|к)?\s*(0?[1-9]|[12]\d|3[01])\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(20\d{2}))?/i);
    if(m){const mo=MONTHS.indexOf(m[2].toLowerCase())+1,d=+m[1];let y=m[3]?+m[3]:base.getFullYear();if(!m[3]&&mo<base.getMonth()+1)y++;if(validDate(y,mo,d))return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
    const rel=norm(source);
    if(/\bпослезавтра\b/.test(rel)){const d=new Date(base);d.setDate(d.getDate()+2);return isoDate(d)}
    if(/\bзавтра\b/.test(rel)){const d=new Date(base);d.setDate(d.getDate()+1);return isoDate(d)}
    return parseIso(fallback)?fallback:isoDate(base);
  }

  function stripPerson(text,personName=''){
    let value=String(text||'').trim().replace(/^[-–—•\d.)\s]+/,'');
    const pt=tokens(personName),surname=pt[0]||'';
    if(surname){
      const stem=surname.length>=5?surname.slice(0,Math.max(5,surname.length-2)):surname;
      const rx=new RegExp(`(?:^|\\s|[—–,:-])${escRe(stem)}[а-яa-z-]*(?:\\s+[а-я]\\.\\s*[а-я]\\.?)?`,'i');
      value=value.replace(rx,' ');
    }
    value=value
      .replace(/^(?:ответственн(?:ый|ая|ые)|исполнитель)\s*:\s*/i,'')
      .replace(/^(?:поручено|поручить|долж(?:ен|на|ны)|нужно|необходимо)\s*/i,'')
      .replace(/\s*(?:до|к)?\s*\d{1,2}[./]\d{1,2}(?:[./]20\d{2})?\s*\.?$/i,'')
      .replace(/\s*(?:до|к)?\s*\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+20\d{2})?\s*\.?$/i,'')
      .replace(/\s*\b20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b\s*\.?$/,'')
      .replace(/\s+(?:до|к)\s+(?:завтра|послезавтра)\s*\.?$/i,'')
      .replace(/\s+/g,' ').replace(/^[—–:,-]+\s*/,'').replace(/\s*[—–:,-]+$/,'').trim();
    return value?value.charAt(0).toUpperCase()+value.slice(1):'';
  }

  function assignmentCue(raw,person,sourceType){
    if(sourceType==='actionItems')return ACTION_RE.test(raw)||ASSIGN_RE.test(raw)||raw.includes('|');
    const surname=tokens(person?.name)[0]||'',s=norm(raw),stem=surname.length>=5?surname.slice(0,Math.max(5,surname.length-2)):surname;
    if(!stem)return false;
    const assigned=new RegExp(`${escRe(stem)}[а-яa-z-]{0,8}\\s+(?:долж|нужно|необходимо|поруч|подготов|соглас|провер|сдел|отправ|разработ|организ|провед|состав|созда|обнов|доработ)`,'i').test(s);
    const label=/(?:ответственн(?:ый|ая)|исполнитель)\s*:/.test(s);
    return label||assigned;
  }

  function findProject(raw,pipeProject,meeting,person,projects=[]){
    const explicitName=String(pipeProject||'').trim().toLowerCase();
    if(explicitName){const exact=projects.find(p=>String(p.name||'').toLowerCase()===explicitName);if(exact)return exact.id}
    const source=norm(raw),mentions=projects.filter(p=>{const n=norm(p.name);return n.length>=4&&source.includes(n)});
    if(mentions.length===1)return mentions[0].id;
    const meetingIds=Array.isArray(meeting.projectIds)?meeting.projectIds.filter(Boolean):[];
    if(meetingIds.length===1)return meetingIds[0];
    const personIds=Array.isArray(person.projectIds)?person.projectIds:[],common=personIds.filter(id=>meetingIds.includes(id));
    return common.length===1?common[0]:'';
  }

  function splitSource(text){return String(text||'').split(/\n+|(?<=[.!?;])\s+/).map(x=>x.trim()).filter(x=>x.length>3)}

  function extractMeetingTaskCandidates(meeting,{people=[],projects=[]}={}){
    const rows=[],seen=new Set();
    [['actionItems',meeting.actionItems],['decisions',meeting.decisions],['notes',meeting.notes]].forEach(([sourceType,text])=>splitSource(text).forEach(raw=>{
      const pipe=raw.split('|').map(x=>x.trim()),person=matchPerson(pipe.length>1?pipe[0]:raw,people);
      if(!person)return;
      if(pipe.length<2&&!assignmentCue(raw,person,sourceType))return;
      if(pipe.length<2&&!ACTION_RE.test(raw)&&!ASSIGN_RE.test(raw))return;
      const title=stripPerson(pipe.length>1?pipe[1]:raw,person.name);if(title.length<3)return;
      const key=`${person.id||person.name}|${norm(title)}`;if(seen.has(key))return;seen.add(key);
      rows.push({enabled:true,assigneeId:person.id||'',assignee:person.name||'',title,deadline:extractDeadline(pipe[2]||raw,meeting.date||''),projectId:findProject(raw,pipe[3],meeting,person,projects),raw,sourceType});
    }));
    return rows;
  }

  return {matchPerson,extractDeadline,stripPerson,extractMeetingTaskCandidates};
});
