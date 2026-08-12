'use strict';

(() => {
  const title=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  const root=document.getElementById('modalRoot');
  if(!title||!content||!root)return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').trim().toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const stateRef=()=>typeof state!=='undefined'?state:null;

  function closeModal(){root.innerHTML=''}
  function save(message){if(typeof persist==='function')persist(message);else if(typeof render==='function')render()}

  function allScopes(){
    const s=stateRef();if(!s)return[];
    return (s.projects||[]).flatMap(p=>[
      {key:`project:${p.id}`,project:p,subproject:null,label:p.name},
      ...(p.subprojects||[]).map(sp=>({key:`subproject:${p.id}:${sp.id}`,project:p,subproject:sp,label:`${p.name} → ${sp.name}`}))
    ]);
  }

  function registry(){return typeof teamRegistry==='function'?teamRegistry():[]}

  function memberRefs(person){
    const ids=person?.memberIds instanceof Set?person.memberIds:new Set(Array.isArray(person?.memberIds)?person.memberIds:[]);
    const nameKey=norm(person?.name);
    const rows=[];
    (stateRef()?.projects||[]).forEach(p=>{
      (p.team||[]).forEach(m=>{if((m.id&&ids.has(m.id))||(!ids.size&&norm(m.name)===nameKey))rows.push({project:p,subproject:null,member:m,scope:`project:${p.id}`})});
      (p.subprojects||[]).forEach(sp=>(sp.team||[]).forEach(m=>{if((m.id&&ids.has(m.id))||(!ids.size&&norm(m.name)===nameKey))rows.push({project:p,subproject:sp,member:m,scope:`subproject:${p.id}:${sp.id}`})}));
    });
    return rows;
  }

  function addMemberToScope(scope,data,id){
    if(!scope)return null;
    const member={id:id||(typeof uid==='function'?uid():`${Date.now()}-${Math.random()}`),name:data.name,role:data.role||'',department:data.department||'',contact:data.contact||'',note:data.note||''};
    const team=scope.subproject?scope.subproject.team:scope.project.team;
    if(!Array.isArray(team))return null;
    team.push(member);
    return member;
  }

  function addMemberModal(){
    const scopes=allScopes();
    if(!scopes.length){if(typeof toast==='function')toast('Сначала создайте проект');return}
    root.innerHTML=`<div class="modal-backdrop"><div class="modal team-manage-modal" role="dialog" aria-modal="true"><div class="modal-header"><div><h2>Новый участник команды</h2><p class="muted">Участник добавляется сразу в выбранный проект или подпроект.</p></div><button class="icon-btn" type="button" data-team-close>×</button></div><form id="teamAddForm"><div class="modal-scroll-area"><div class="form-grid"><div class="field full"><label>Имя участника</label><input name="name" required></div><div class="field"><label>Проект / подпроект</label><select name="scope" required>${scopes.map(x=>`<option value="${esc(x.key)}">${esc(x.label)}</option>`).join('')}</select></div><div class="field"><label>Роль в этом проекте</label><input name="role" placeholder="Например: Методист"></div><div class="field"><label>Подразделение</label><input name="department" placeholder="Например: Дошкольный отдел"></div><div class="field"><label>Контакты</label><input name="contact"></div><div class="field full"><label>Комментарий</label><textarea name="note"></textarea></div></div></div><div class="modal-footer"><button class="btn ghost" type="button" data-team-close>Отмена</button><button class="btn primary" type="submit">Добавить участника</button></div></form></div></div>`;
    root.querySelectorAll('[data-team-close]').forEach(x=>x.onclick=closeModal);
    root.querySelector('#teamAddForm').onsubmit=e=>{
      e.preventDefault();
      const fd=new FormData(e.currentTarget),scope=scopes.find(x=>x.key===fd.get('scope'));
      const data={name:String(fd.get('name')||'').trim(),role:String(fd.get('role')||'').trim(),department:String(fd.get('department')||'').trim(),contact:String(fd.get('contact')||'').trim(),note:String(fd.get('note')||'').trim()};
      if(!scope||!data.name)return;
      addMemberToScope(scope,data);
      if(typeof log==='function')log('team',`Добавлен участник: ${data.name}`,scope.project.id);
      closeModal();save('Участник команды добавлен');
    };
  }

  function editMemberModal(person){
    const refs=memberRefs(person),scopes=allScopes();
    if(!scopes.length){if(typeof toast==='function')toast('Сначала создайте проект');return}
    const base=refs[0]?.member||{};
    const linked=new Set(refs.map(r=>r.scope));
    const available=scopes.filter(s=>!linked.has(s.key));
    const fallbackNote=!refs.length?'<div class="team-unlinked-note"><b>Участник пока не привязан к проекту.</b><span>Выберите проект ниже и укажите роль — после сохранения появится полноценная проектная карточка.</span></div>':'';
    root.innerHTML=`<div class="modal-backdrop"><div class="modal team-manage-modal" role="dialog" aria-modal="true"><div class="modal-header"><div><h2>Редактировать участника</h2><p class="muted">Общие данные меняются во всех связанных карточках. Роль задаётся отдельно для каждого проекта.</p></div><button class="icon-btn" type="button" data-team-close>×</button></div><form id="teamEditForm"><div class="modal-scroll-area"><div class="form-grid"><div class="field full"><label>Имя участника</label><input name="name" required value="${esc(person.name)}"></div><div class="field"><label>Подразделение</label><input name="department" value="${esc(person.department||base.department||'')}"></div><div class="field"><label>Контакты</label><input name="contact" value="${esc(person.contact||base.contact||'')}"></div></div>${fallbackNote}<section class="team-project-roles"><h3>Роли по проектам</h3>${refs.map((r,i)=>`<div class="team-project-role-row"><div><b>${esc(r.project.name)}</b><small>${r.subproject?`Подпроект: ${esc(r.subproject.name)}`:'Проект'}</small></div><input name="role-${i}" value="${esc(r.member.role||'')}" placeholder="Роль в проекте"></div>`).join('')||'<p class="muted">Проектных ролей пока нет.</p>'}</section>${available.length?`<section class="team-add-link"><h3>${refs.length?'Добавить ещё одну привязку':'Привязать к проекту'}</h3><div class="form-grid"><div class="field"><label>Проект / подпроект</label><select name="newScope"><option value="">Не добавлять</option>${available.map(x=>`<option value="${esc(x.key)}">${esc(x.label)}</option>`).join('')}</select></div><div class="field"><label>Роль</label><input name="newRole" placeholder="Роль в выбранном проекте"></div></div></section>`:''}</div><div class="modal-footer"><button class="btn ghost" type="button" data-team-close>Отмена</button><button class="btn primary" type="submit">Сохранить</button></div></form></div></div>`;
    root.querySelectorAll('[data-team-close]').forEach(x=>x.onclick=closeModal);
    root.querySelector('#teamEditForm').onsubmit=e=>{
      e.preventDefault();
      const fd=new FormData(e.currentTarget),name=String(fd.get('name')||'').trim(),department=String(fd.get('department')||'').trim(),contact=String(fd.get('contact')||'').trim();
      if(!name)return;
      refs.forEach((r,i)=>{r.member.name=name;r.member.department=department;r.member.contact=contact;r.member.role=String(fd.get(`role-${i}`)||'').trim()});
      const newScopeKey=String(fd.get('newScope')||'');
      const newScope=scopes.find(x=>x.key===newScopeKey);
      if(newScope){
        const existingId=[...(person.memberIds instanceof Set?person.memberIds:new Set(person.memberIds||[]))][0]||base.id||null;
        addMemberToScope(newScope,{name,department,contact,role:String(fd.get('newRole')||'').trim()},existingId);
      }
      if(typeof log==='function')log('team',`Изменён участник: ${name}`,refs[0]?.project?.id||newScope?.project?.id||'');
      closeModal();save(refs.length?'Карточка участника обновлена':'Участник привязан к проекту');
    };
  }

  function actionGroup(card,header){
    let group=card.querySelector('.team-card-actions');
    if(!group){group=document.createElement('div');group.className='team-card-actions';header.appendChild(group)}
    return group;
  }

  function enhance(){
    if(title.textContent.trim()!=='Команда')return;
    if(!content.querySelector('[data-team-add-global]')){
      const bar=document.createElement('div');bar.className='team-manage-toolbar';bar.innerHTML='<button class="btn primary" type="button" data-team-add-global>+ Участник команды</button><span class="muted">Роли редактируются отдельно для каждого проекта.</span>';
      const hero=content.querySelector('.hero');
      if(hero)hero.insertAdjacentElement('afterend',bar);else content.prepend(bar);
      bar.querySelector('[data-team-add-global]').onclick=addMemberModal;
    }
    const people=registry();
    people.forEach(person=>{
      const cards=[...content.querySelectorAll('article.card,.card')].filter(card=>{
        const h=card.querySelector('h2,h3');return h&&h.textContent.trim()===person.name;
      });
      cards.forEach(card=>{
        const header=card.querySelector('header,.toolbar')||card;
        const group=actionGroup(card,header);
        let btn=card.querySelector('[data-team-edit-card]');
        if(!btn){
          btn=document.createElement('button');btn.type='button';btn.className='btn ghost small team-edit-card-btn';btn.dataset.teamEditCard=person.name;btn.textContent='Редактировать карточку';btn.onclick=()=>editMemberModal(person);
        }
        if(btn.parentElement!==group)group.appendChild(btn);
      });
    });
  }

  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
