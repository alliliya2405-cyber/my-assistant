'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(!root||typeof document==='undefined')return;
  try{
    const baseDirectory=typeof teamMemberDirectory==='function'?teamMemberDirectory:null;
    if(!baseDirectory)return;
    teamMemberDirectory=function(){
      const base=baseDirectory();
      const meetings=typeof state!=='undefined'&&Array.isArray(state.meetings)?state.meetings:[];
      return api.enhanceDirectory(base,meetings);
    };
  }catch(e){console.warn('MeetingTeamDirectoryV1 install failed',e)}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const clean=s=>String(s||'').trim();
  const norm=s=>clean(s).toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ' ).trim();
  const letters=s=>(clean(s).match(/[A-Za-zА-Яа-яЁё]/g)||[]).map(x=>x.toLowerCase());
  const initialsOfShort=name=>{
    const value=clean(name);
    if(!value||value.includes(' '))return '';
    const ls=letters(value);
    return ls.length>=2?ls.slice(0,2).join(''):'';
  };
  const initialsOfFull=name=>{
    const parts=clean(name).split(/\s+/).filter(Boolean);
    if(parts.length<2)return '';
    const tail=parts.slice(1).join(' ');
    const ls=letters(tail);
    return ls.length>=2?ls.slice(0,2).join(''):'';
  };
  const participantNames=meeting=>clean(meeting?.participants).split(/[,;\n]+/).map(clean).filter(Boolean);
  function enhanceDirectory(base=[],meetings=[]){
    const rows=(Array.isArray(base)?base:[]).map(x=>({...x,projectIds:[...new Set(Array.isArray(x.projectIds)?x.projectIds:[])]}));
    const byFull=new Map(rows.map((x,i)=>[norm(x.name),i]));
    meetings.forEach(meeting=>participantNames(meeting).forEach(fullName=>{
      const fullKey=norm(fullName);if(!fullKey)return;
      const meetingProjects=[...new Set([...(Array.isArray(meeting.projectIds)?meeting.projectIds:[]),meeting.projectId].filter(Boolean))];
      const existingIndex=byFull.get(fullKey);
      if(existingIndex!==undefined){rows[existingIndex].projectIds=[...new Set([...rows[existingIndex].projectIds,...meetingProjects])];return;}
      const initials=initialsOfFull(fullName);
      const candidates=initials?rows.map((x,i)=>({x,i})).filter(({x})=>initialsOfShort(x.name)===initials):[];
      if(candidates.length===1){
        const {x,i}=candidates[0];
        rows[i]={...x,name:fullName,projectIds:[...new Set([...(x.projectIds||[]),...meetingProjects])]};
        byFull.set(fullKey,i);
        return;
      }
      const id=`meeting-person:${fullKey.replace(/\s+/g,'-')}`;
      rows.push({id,name:fullName,projectIds:meetingProjects});
      byFull.set(fullKey,rows.length-1);
    }));
    return rows;
  }
  return {enhanceDirectory,initialsOfFull,initialsOfShort};
});
