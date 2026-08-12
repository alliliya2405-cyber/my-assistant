'use strict';

(() => {
  const title=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  const root=document.getElementById('modalRoot');
  if(!title||!content||!root)return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').trim().toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const stateRef=()=>typeof state!=='undefined'?state:null;
  const registry=()=>typeof teamRegistry==='function'?teamRegistry():[];
  const close=()=>{root.innerHTML=''};
  const save=msg=>{if(typeof persist==='function')persist(msg);else if(typeof render==='function')render()};

  function refsFor(person){
    const ids=person?.memberIds instanceof Set?person.memberIds:new Set(Array.isArray(person?.memberIds)?person.memberIds:[]);
    const nameKey=norm(person?.name),rows=[];
    (stateRef()?.projects||[]).forEach(p=>{
      (p.team||[]).forEach(m=>{if((m.id&&ids.has(m.id))||(!ids.size&&norm(m.name)===nameKey))rows.push({project:p,subproject:null,member:m,team:p.team,label:p.name})});
      (p.subprojects||[]).forEach(sp=>(sp.team||[]).forEach(m=>{if((m.id&&ids.has(m.id))||(!ids.size&&norm(m.name)===nameKey))rows.push({project:p,subproject:sp,member:m,team:sp.team,label:`${p.name} → ${sp.name}`})}));
    });
    return rows;
  }

  function removeRef(ref){
    const i=ref.team.indexOf(ref.member);
    if(i>=0)ref.team.splice(i,1);
  }

  function openManage(person){
    const refs=refsFor(person);
    if(!refs.length){if(typeof toast==='function')toast('У участника нет проектных привязок');return}
    root.innerHTML=`<div class="modal-backdrop"><div class="modal team-manage-modal" role="dialog" aria-modal="true"><div class="modal-header"><div><h2>Участие в проектах</h2><p class="muted">${esc(person.name)}. Удаление привязки не удаляет поручения, протоколы и историю.</p></div><button class="icon-btn" type="button" data-team-remove-close>×</button></div><div class="modal-scroll-area"><section class="team-project-roles">${refs.map((r,i)=>`<div class="team-project-role-row"><div><b>${esc(r.label)}</b><small>${esc(r.member.role||'Роль не указана')}</small></div><button class="btn danger small" type="button" data-unlink-index="${i}">Убрать из проекта</button></div>`).join('')}</section><div class="team-unlinked-note"><b>История сохранится</b><span>Завершённые и открытые поручения останутся в системе и в истории совещаний.</span></div></div><div class="modal-footer"><button class="btn ghost" type="button" data-team-remove-close>Закрыть</button>${refs.length>1?'<button class="btn danger" type="button" data-unlink-all>Убрать из всех проектов</button>':''}</div></div></div>`;
    root.querySelectorAll('[data-team-remove-close]').forEach(x=>x.onclick=close);
    root.querySelectorAll('[data-unlink-index]').forEach(btn=>btn.onclick=()=>{
      const ref=refs[Number(btn.dataset.unlinkIndex)];if(!ref)return;
      if(!confirm(`Убрать ${person.name} из «${ref.label}»?\n\nПоручения и история останутся сохранены.`))return;
      removeRef(ref);
      if(typeof log==='function')log('team',`Участник ${person.name} удалён из ${ref.label}`,ref.project.id);
      close();save('Участник удалён из проекта');
    });
    const all=root.querySelector('[data-unlink-all]');
    if(all)all.onclick=()=>{
      if(!confirm(`Убрать ${person.name} из всех проектов?\n\nПоручения, совещания и история не удаляются.`))return;
      refs.forEach(removeRef);
      if(typeof log==='function')log('team',`Участник ${person.name} удалён из всех проектов`,'');
      close();save('Проектные привязки участника удалены');
    };
  }

  function enhance(){
    if(title.textContent.trim()!=='Команда')return;
    registry().forEach(person=>{
      const refs=refsFor(person);if(!refs.length)return;
      [...content.querySelectorAll('article.card,.card')].forEach(card=>{
        const h=card.querySelector('h2,h3');if(!h||h.textContent.trim()!==person.name)return;
        if(card.querySelector('[data-team-manage-membership]'))return;
        const btn=document.createElement('button');
        btn.type='button';btn.className='btn ghost small';btn.dataset.teamManageMembership=person.name;btn.textContent='Участие в проектах';btn.onclick=()=>openManage(person);
        const edit=card.querySelector('[data-team-edit-card]');
        if(edit)edit.insertAdjacentElement('afterend',btn);else (card.querySelector('header,.toolbar')||card).appendChild(btn);
      });
    });
  }

  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
