'use strict';
(() => {
  const content=document.getElementById('content');
  if(!content)return;
  const norm=v=>String(v||'').trim().toLowerCase().replace(/ё/g,'е');
  function allMembers(){
    if(typeof state==='undefined')return[];
    const out=[];
    (state.projects||[]).forEach(project=>{
      (project.team||[]).forEach(member=>out.push({project,subproject:null,member}));
      (project.subprojects||[]).forEach(subproject=>(subproject.team||[]).forEach(member=>out.push({project,subproject,member})));
    });
    return out;
  }
  function edit(ref){
    if(typeof modal!=='function')return;
    const m=ref.member;
    modal('Изменить участника',[
      {name:'name',label:'Имя участника',required:true,full:true},
      {name:'role',label:'Роль'},
      {name:'department',label:'Подразделение'},
      {name:'contact',label:'Контакты'},
      {name:'note',label:'Комментарий',type:'textarea',full:true}
    ],o=>{
      Object.assign(m,o);
      if(typeof log==='function')log('team',`Изменён участник: ${m.name}`,ref.project.id);
      if(typeof persist==='function')persist('Участник команды обновлён');
    },{name:m.name||'',role:m.role||'',department:m.department||'',contact:m.contact||'',note:m.note||''});
  }
  function enhance(){
    const members=allMembers();
    if(!members.length)return;
    const candidates=[...content.querySelectorAll('b,strong,h2,h3,h4')];
    members.forEach(ref=>{
      const node=candidates.find(el=>norm(el.textContent)===norm(ref.member.name));
      if(!node||node.dataset.projectTeamEditBound==='1')return;
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn ghost small';
      btn.textContent='Изменить';
      btn.style.marginLeft='10px';
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();edit(ref)};
      node.insertAdjacentElement('afterend',btn);
      node.dataset.projectTeamEditBound='1';
    });
  }
  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
