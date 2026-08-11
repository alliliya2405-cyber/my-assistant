'use strict';
(function(root){
  const api=root.MeetingTaskRecognitionV2||(typeof require==='function'?require('./meeting-task-recognition-v2.js'):null);
  if(!api)return;

  const ACTION_RE=/(?:подготов(?:ить|ьте)|согласовать|проверить|сделать|отправить|разработать|организовать|провести|собрать|создать|написать|обновить|доработать|заполнить|составить|позвонить|связаться|уточнить|назначить|передать|загрузить|проанализировать|представить|оформить|завершить|прислать|пригласить|настроить)/i;
  const ASSIGN_RE=/(?:ответственн(?:ый|ая|ые)|исполнитель|поручено|поручить|долж(?:ен|на|ны)|нужно|необходимо)/i;
  const norm=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[«»"'()]/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const tokens=s=>norm(s).split(/\s+/).filter(Boolean);
  const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const cleanTitle=value=>String(value||'')
    .trim()
    .replace(/^[—–:;,.-]+\s*/,'')
    .replace(/^(?:должен|должна|должны|нужно|необходимо|поручено|поручить)\s+/i,'')
    .replace(/^(?:ответственн(?:ый|ая|ые)|исполнитель)\s*:\s*/i,'')
    .trim()
    .replace(/^[—–:;,.-]+\s*/,'')
    .replace(/^./,c=>c.toUpperCase());

  const splitSource=text=>String(text||'').split(/\n+/).flatMap(line=>{
    const value=line.trim();if(!value)return[];
    if(value.includes('|'))return[value];
    return value.split(/(?<![А-ЯЁA-Z]\.)(?<=[.!?;])\s+/).map(x=>x.trim()).filter(x=>x.length>3);
  });

  function assignmentCue(raw,person,sourceType){
    if(sourceType==='actionItems')return ACTION_RE.test(raw)||ASSIGN_RE.test(raw)||raw.includes('|');
    const surname=tokens(person?.name)[0]||'',source=norm(raw),stem=surname.length>=5?surname.slice(0,Math.max(5,surname.length-2)):surname;
    if(!stem)return false;
    const assigned=new RegExp(`${escRe(stem)}[а-яa-z-]{0,8}\\s+(?:долж|нужно|необходимо|поруч|подготов|соглас|провер|сдел|отправ|разработ|организ|провед|состав|созда|обнов|доработ)`,'i').test(source);
    const label=/(?:ответственн(?:ый|ая)|исполнитель)\s*:/.test(source);
    return label||assigned;
  }

  function findProject(raw,pipeProject,meeting,person,projects=[]){
    const explicitName=String(pipeProject||'').trim().toLowerCase();
    if(explicitName){const exact=projects.find(p=>String(p.name||'').toLowerCase()===explicitName);if(exact)return exact.id}
    const source=norm(raw),mentions=projects.filter(p=>{const name=norm(p.name);return name.length>=4&&source.includes(name)});
    if(mentions.length===1)return mentions[0].id;
    const meetingIds=Array.isArray(meeting.projectIds)?meeting.projectIds.filter(Boolean):[];
    if(meetingIds.length===1)return meetingIds[0];
    const personIds=Array.isArray(person.projectIds)?person.projectIds:[],common=personIds.filter(id=>meetingIds.includes(id));
    return common.length===1?common[0]:'';
  }

  api.extractMeetingTaskCandidates=(meeting,{people=[],projects=[]}={})=>{
    const rows=[],seen=new Set();
    [['actionItems',meeting.actionItems],['decisions',meeting.decisions],['notes',meeting.notes]].forEach(([sourceType,text])=>splitSource(text).forEach(raw=>{
      const pipe=raw.split('|').map(x=>x.trim()),person=api.matchPerson(pipe.length>1?pipe[0]:raw,people);
      if(!person)return;
      if(pipe.length<2&&!assignmentCue(raw,person,sourceType))return;
      if(pipe.length<2&&!ACTION_RE.test(raw)&&!ASSIGN_RE.test(raw))return;
      const title=cleanTitle(api.stripPerson(pipe.length>1?pipe[1]:raw,person.name));
      if(title.length<3)return;
      const key=`${person.id||person.name}|${norm(title)}`;if(seen.has(key))return;seen.add(key);
      rows.push({enabled:true,assigneeId:person.id||'',assignee:person.name||'',title,deadline:api.extractDeadline(pipe[2]||raw,meeting.date||''),projectId:findProject(raw,pipe[3],meeting,person,projects),raw,sourceType});
    }));
    return rows;
  };

  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
