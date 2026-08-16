'use strict';
(() => {
  const content=document.getElementById('content');
  if(!content)return;
  const norm=v=>String(v||'').trim().toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ');
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
  function nameNodes(){
    const rows=[];
    const walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const text=norm(node.nodeValue);return text?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    let node;while((node=walker.nextNode()))rows.push(node);
    return rows;
  }
  function enhance(){
    const members=allMembers();if(!members.length)return;
    const texts=nameNodes();
    members.forEach(ref=>{
      const textNode=texts.find(n=>norm(n.nodeValue)===norm(ref.member.name));
      if(!textNode)return;
      const host=textNode.parentElement;if(!host||host.dataset.projectTeamEditBound==='1')return;
      const btn=document.createElement('button');btn.type='button';btn.className='btn ghost small';btn.textContent='Изменить';btn.style.marginLeft='10px';
      btn.dataset.projectTeamEdit='1';
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();edit(ref)};
      host.insertAdjacentElement('afterend',btn);host.dataset.projectTeamEditBound='1';
    });
  }
  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
