'use strict';
(() => {
  const content=document.getElementById('content');
  const root=document.getElementById('modalRoot');
  if(!content||!root)return;
  const norm=v=>String(v||'').trim().toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const refsFor=name=>{
    const key=norm(name),rows=[];
    (state.projects||[]).forEach(p=>{
      (p.team||[]).forEach(m=>{if(norm(m.name)===key)rows.push({project:p,subproject:null,member:m})});
      (p.subprojects||[]).forEach(sp=>(sp.team||[]).forEach(m=>{if(norm(m.name)===key)rows.push({project:p,subproject:sp,member:m})}));
    });
    return rows;
  };
  function openEditor(name){
    const refs=refsFor(name);if(!refs.length)return;
    const base=refs[0].member;
    root.innerHTML=`<div class="modal-backdrop"><div class="modal team-manage-modal" role="dialog" aria-modal="true"><div class="modal-header"><div><h2>Редактировать участника</h2><p class="muted">Общие данные применяются ко всем связанным карточкам. Роль редактируется отдельно по каждому проекту и подпроекту.</p></div><button class="icon-btn" type="button" data-project-team-close>×</button></div><form id="projectTeamEditForm"><div class="modal-scroll-area"><div class="form-grid"><div class="field full"><label>Имя участника</label><input name="name" required value="${esc(base.name)}"></div><div class="field"><label>Подразделение</label><input name="department" value="${esc(base.department||'')}"></div><div class="field"><label>Контакты</label><input name="contact" value="${esc(base.contact||'')}"></div></div><section class="team-project-roles"><h3>Роли по проектам</h3>${refs.map((r,i)=>`<div class="team-project-role-row"><div><b>${esc(r.project.name)}</b><small>${r.subproject?`Подпроект: ${esc(r.subproject.name)}`:'Проект'}</small></div><input name="role-${i}" value="${esc(r.member.role||'')}" placeholder="Роль"></div>`).join('')}</section></div><div class="modal-footer"><button class="btn ghost" type="button" data-project-team-close>Отмена</button><button class="btn primary" type="submit">Сохранить</button></div></form></div></div>`;
    root.querySelectorAll('[data-project-team-close]').forEach(b=>b.onclick=()=>root.innerHTML='');
    root.querySelector('#projectTeamEditForm').onsubmit=e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget);const newName=String(fd.get('name')||'').trim();if(!newName)return;
      refs.forEach((r,i)=>{r.member.name=newName;r.member.department=String(fd.get('department')||'').trim();r.member.contact=String(fd.get('contact')||'').trim();r.member.role=String(fd.get(`role-${i}`)||'').trim()});
      root.innerHTML='';if(typeof persist==='function')persist('Карточка участника обновлена');
    };
  }
  function enhance(){
    const names=new Set((state.projects||[]).flatMap(p=>[...(p.team||[]),...(p.subprojects||[]).flatMap(sp=>sp.team||[])]).map(m=>norm(m.name)).filter(Boolean));
    [...content.querySelectorAll('h2,h3,h4,h5,strong,b')].forEach(node=>{
      const key=norm(node.textContent);if(!names.has(key)||node.parentElement?.querySelector(':scope > [data-project-team-edit]'))return;
      const btn=document.createElement('button');btn.type='button';btn.className='btn ghost small';btn.dataset.projectTeamEdit=node.textContent.trim();btn.textContent='Изменить';btn.style.marginLeft='10px';btn.onclick=e=>{e.preventDefault();e.stopPropagation();openEditor(btn.dataset.projectTeamEdit)};
      node.insertAdjacentElement('afterend',btn);
    });
  }
  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});schedule();
})();
