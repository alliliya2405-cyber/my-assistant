'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(!root||typeof document==='undefined')return;
  const title=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  if(!title||!content)return;

  function translateMeta(text){
    return String(text||'')
      .replace(/\bassigned\b/g,api.labelStatus('assigned'))
      .replace(/\bactive\b/g,api.labelStatus('active'))
      .replace(/\bplanned\b/g,api.labelStatus('planned'))
      .replace(/\bpaused\b/g,api.labelStatus('paused'))
      .replace(/\bdoing\b/g,api.labelStatus('doing'))
      .replace(/\breview\b/g,api.labelStatus('review'))
      .replace(/\bdone\b/g,api.labelStatus('done'));
  }

  function sync(){
    if(title.textContent.trim()!=='Команда')return;
    content.querySelectorAll('.team-person-card .chip').forEach(chip=>{
      const raw=chip.textContent.trim();
      const next=api.labelStatus(raw);
      if(next!==raw)chip.textContent=next;
    });
    content.querySelectorAll('.team-person-card .item-meta').forEach(meta=>{
      const raw=meta.textContent;
      const next=translateMeta(raw);
      if(next!==raw)meta.textContent=next;
    });
  }

  let scheduled=false;
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;sync();});
  };
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const labels={
    assigned:'Назначено',
    active:'Активный',
    planned:'Запланировано',
    paused:'На паузе',
    doing:'В работе',
    review:'На проверке',
    done:'Выполнено'
  };
  function labelStatus(value){
    const key=String(value||'').trim().toLowerCase();
    return labels[key]||String(value||'');
  }
  return {labelStatus};
});
