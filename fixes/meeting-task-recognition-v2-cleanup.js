'use strict';
(function(root){
  const api=root.MeetingTaskRecognitionV2||(typeof require==='function'?require('./meeting-task-recognition-v2.js'):null);
  if(!api)return;
  const base=api.extractMeetingTaskCandidates.bind(api);
  const cleanTitle=value=>String(value||'')
    .replace(/^(?:должен|должна|должны|нужно|необходимо|поручено|поручить)\s+/i,'')
    .replace(/^(?:ответственн(?:ый|ая|ые)|исполнитель)\s*:\s*/i,'')
    .trim()
    .replace(/^./,c=>c.toUpperCase());
  api.extractMeetingTaskCandidates=(meeting,context)=>base(meeting,context).map(row=>({...row,title:cleanTitle(row.title)})).filter(row=>row.title.length>=3);
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
