'use strict';

(() => {
  const title=document.getElementById('pageTitle'),content=document.getElementById('content'),modalRoot=document.getElementById('modalRoot');
  if(!title||!content)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=v=>{const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}.${m[2]}.${m[1]}`:(v||'—')};
  const statusLabel=s=>({active:'Активный',assigned:'Назначено',planned:'Запланировано',doing:'В работе',review:'На проверке',done:'Выполнено',paused:'На паузе'}[s]||s||'—');
  const getState=()=>typeof state!=='undefined'?state:null;
  const personKey=v=>String(v||'').trim().toLowerCase();
  const projectName=id=>getState()?.projects?.find(p=>p.id===id)?.name||'Без проекта';
  const save=msg=>{if(typeof persist==='function')persist(msg);else if(typeof render==='function')render()};
  const closeModal=()=>{if(modalRoot)modalRoot.innerHTML=''};

  function rows(){
    const s=getState();if(!s)return[];
    const registry=typeof teamRegistry==='function'?teamRegistry():[];
    const allAssignments=Array.isArray(s.assignments)?s.assignments:[];
    return registry.map(person=>{
      const memberIds=person.memberIds instanceof Set?person.memberIds:new Set(Array.isArray(person.memberIds)?person.memberIds:[]);
      const assignments=allAssignments.filter(a=>(a.assigneeId&&memberIds.has(a.assigneeId))||personKey(a.assignee)===personKey(person.name));
      const projectMap=new Map();
      (Array.isArray(person.projects)?person.projects:[]).forEach(row=>{
        const key=row.projectId||`${row.project||''}|${row.source||''}`;
        const real=row.projectId?(s.projects||[]).find(p=>p.id===row.projectId):null;
        if(!projectMap.has(key))projectMap.set(key,{id:row.projectId||'',name:row.project||real?.name||'Без проекта',status:real?.status||row.status||'active',source:row.source||'Проект'});
      });
      const open=assignments.filter(a=>a.status!=='done');
      const today=typeof todayIso==='function'?todayIso():new Date().toISOString().slice(0,10);
      const overdue=open.filter(a=>a.deadline&&a.deadline<today);
      const dated=open.filter(a=>a.deadline).sort((a,b)=>a.deadline.localeCompare(b.deadline));
      const active=[...projectMap.values()].filter(p=>p.status==='active').length;
      const score=active*2+open.length+overdue.length*2;
      const level=score>=8?'high':score>=4?'medium':'normal';
      return {name:person.name,roles:person.roles instanceof Set?person.roles:new Set(person.roles||[]),projects:projectMap,assignments,open,overdue,next:dated[0]||null,active,score,level};
    }).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ru'));
  }

  function assignmentRows(items,{showPerson=false,closable=false}={}){
    if(!items.length)return '<div class="empty">Нет данных</div>';
    return `<div class="resource-detail-list">${items.map(x=>{
      const a=x.assignment||x,person=x.person||'';
      return `<div class="resource-detail-row"><div><b>${esc(a.title||'Поручение')}</b><span>${showPerson&&person?`${esc(person)} · `:''}${esc(projectName(a.projectId))} · ${fmt(a.deadline)} · ${esc(statusLabel(a.status))}</span></div>${closable&&a.status!=='done'?`<button class="btn primary small" type="button" data-resource-close-assignment="${esc(a.id)}">Закрыть поручение</button>`:''}</div>`;
    }).join('')}</div>`;
  }

  function openDetail(titleText,body){
    if(!modalRoot)return;
    modalRoot.innerHTML=`<div class="modal-backdrop"><div class="modal resource-detail-modal" role="dialog" aria-modal="true"><div class="modal-header"><h2>${esc(titleText)}</h2><button class="icon-btn" type="button" data-resource-modal-close>×</button></div><div class="modal-scroll-area">${body}</div><div class="modal-footer"><button class="btn ghost" type="button" data-resource-modal-close>Закрыть</button></div></div></div>`;
    modalRoot.querySelectorAll('[data-resource-modal-close]').forEach(btn=>btn.onclick=closeModal);
    modalRoot.querySelectorAll('[data-resource-close-assignment]').forEach(btn=>btn.onclick=()=>closeAssignment(btn.dataset.resourceCloseAssignment));
  }

  function closeAssignment(id){
    const s=getState(),a=(s?.assignments||[]).find(x=>String(x.id)===String(id));
    if(!a)return;
    if(!confirm(`Закрыть поручение «${a.title||'Без названия'}»?\n\nОно останется в истории со статусом «Выполнено».`))return;
    a.status='done';
    a.completedAt=typeof nowStamp==='function'?nowStamp():new Date().toISOString();
    if(typeof log==='function')log('assignment',`Закрыто поручение: ${a.title||'Без названия'}`,a.projectId||'');
    closeModal();
    save('Поручение закрыто');
    setTimeout(render,0);
  }

  function bindDetails(people){
    content.querySelectorAll('[data-resource-summary]').forEach(btn=>btn.onclick=()=>{
      const type=btn.dataset.resourceSummary;
      if(type==='people')openDetail('Участники команды',`<div class="resource-detail-list">${people.map(p=>`<div class="resource-detail-row"><div><b>${esc(p.name)}</b><span>${esc([...p.roles].join(', ')||'Роль не указана')}</span></div><span class="chip">${p.open.length} поруч.</span></div>`).join('')}</div>`);
      if(type==='open')openDetail('Все открытые поручения',assignmentRows(people.flatMap(p=>p.open.map(a=>({assignment:a,person:p.name}))),{showPerson:true,closable:true}));
      if(type==='overdue')openDetail('Просроченные поручения',assignmentRows(people.flatMap(p=>p.overdue.map(a=>({assignment:a,person:p.name}))),{showPerson:true,closable:true}));
      if(type==='high')openDetail('Высокая загрузка',`<div class="resource-detail-list">${people.filter(p=>p.level==='high').map(p=>`<div class="resource-detail-row"><div><b>${esc(p.name)}</b><span>${p.active} активных проектов · ${p.open.length} открытых · ${p.overdue.length} просрочено</span></div></div>`).join('')||'<div class="empty">Сотрудников с высокой загрузкой нет</div>'}</div>`);
    });
    content.querySelectorAll('[data-resource-person-metric]').forEach(btn=>btn.onclick=()=>{
      const person=people.find(p=>p.name===btn.dataset.personName);if(!person)return;
      const type=btn.dataset.resourcePersonMetric;
      if(type==='projects')openDetail(`${person.name} — активные проекты`,`<div class="resource-detail-list">${[...person.projects.values()].filter(p=>p.status==='active').map(p=>`<div class="resource-detail-row"><div><b>${esc(p.name)}</b><span>${esc(p.source)} · ${esc(statusLabel(p.status))}</span></div></div>`).join('')||'<div class="empty">Активных проектов нет</div>'}</div>`);
      if(type==='open')openDetail(`${person.name} — открытые поручения`,assignmentRows(person.open,{closable:true}));
      if(type==='overdue')openDetail(`${person.name} — просрочено`,assignmentRows(person.overdue,{closable:true}));
    });
    content.querySelectorAll('[data-resource-close-assignment]').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();closeAssignment(btn.dataset.resourceCloseAssignment)});
  }

  function render(){
    if(title.textContent.trim()!=='Ресурсная карта')return;
    const people=rows(),open=people.reduce((n,p)=>n+p.open.length,0),overdue=people.reduce((n,p)=>n+p.overdue.length,0),high=people.filter(p=>p.level==='high').length;
    content.innerHTML=`<div class="hero resource-hero"><p class="eyebrow">Ресурсная карта</p><h2>Загрузка команды</h2><p>Один экран показывает, кто в каких проектах участвует, сколько открытых поручений держит и где требуется внимание.</p></div>
    <div class="resource-summary"><button class="card metric resource-metric-btn" type="button" data-resource-summary="people"><span>Участников</span><strong>${people.length}</strong><small>Нажмите для деталей</small></button><button class="card metric resource-metric-btn" type="button" data-resource-summary="open"><span>Открытых поручений</span><strong>${open}</strong><small>Нажмите для деталей</small></button><button class="card metric resource-metric-btn" type="button" data-resource-summary="overdue"><span>Просрочено</span><strong>${overdue}</strong><small>Нажмите для деталей</small></button><button class="card metric resource-metric-btn" type="button" data-resource-summary="high"><span>Высокая загрузка</span><strong>${high}</strong><small>Нажмите для деталей</small></button></div>
    <section class="card resource-toolbar"><input id="resourceSearch" class="search-input" placeholder="Найти сотрудника или проект"><select id="resourceLoad"><option value="">Вся команда</option><option value="high">Высокая загрузка</option><option value="medium">Средняя загрузка</option><option value="normal">Нормальная загрузка</option></select><label class="form-check"><input class="form-check-input" id="resourceOpenOnly" type="checkbox"><span class="form-check-label">Только с поручениями</span></label></section>
    <div class="resource-grid" id="resourceGrid">${people.map(p=>`<article class="card resource-person" data-load="${p.level}" data-open="${p.open.length}" data-search="${esc((p.name+' '+[...p.projects.values()].map(x=>x.name).join(' ')).toLowerCase())}"><header><div><h2>${esc(p.name)}</h2><div class="item-meta">${esc([...p.roles].join(', ')||'Роль не указана')}</div></div><span class="resource-load resource-load-${p.level}">${p.level==='high'?'Высокая':p.level==='medium'?'Средняя':'Нормальная'} загрузка</span></header><div class="resource-person-metrics"><button type="button" data-resource-person-metric="projects" data-person-name="${esc(p.name)}"><b>${p.active}</b> активных проектов<small>Открыть</small></button><button type="button" data-resource-person-metric="open" data-person-name="${esc(p.name)}"><b>${p.open.length}</b> открытых поручений<small>Открыть</small></button><button type="button" data-resource-person-metric="overdue" data-person-name="${esc(p.name)}" class="${p.overdue.length?'resource-alert':''}"><b>${p.overdue.length}</b> просрочено<small>Открыть</small></button></div>${p.next?`<div class="resource-next"><small>Ближайший срок</small><b>${fmt(p.next.deadline)} · ${esc(p.next.title)}</b></div>`:''}<div class="resource-projects">${[...p.projects.values()].map(r=>`<div><span><b>${esc(r.name)}</b><small>${esc(r.source)}</small></span><span class="chip">${esc(statusLabel(r.status))}</span></div>`).join('')||'<p class="muted">Нет проектов</p>'}</div>${p.open.length?`<details class="resource-assignments"><summary>Открытые поручения · ${p.open.length}</summary>${p.open.map(a=>`<div class="resource-assignment-row"><span><b>${esc(a.title)}</b><small>${fmt(a.deadline)} · ${esc(statusLabel(a.status))}</small></span><button class="btn ghost small" type="button" data-resource-close-assignment="${esc(a.id)}">Закрыть</button></div>`).join('')}</details>`:''}</article>`).join('')||'<div class="empty">Команда ещё не заполнена</div>'}</div>`;
    const search=document.getElementById('resourceSearch'),load=document.getElementById('resourceLoad'),only=document.getElementById('resourceOpenOnly');
    const filter=()=>document.querySelectorAll('.resource-person').forEach(card=>{const q=(search.value||'').trim().toLowerCase();card.hidden=!!((q&&!card.dataset.search.includes(q))||(load.value&&card.dataset.load!==load.value)||(only.checked&&Number(card.dataset.open)===0));});
    search.oninput=filter;load.onchange=filter;only.onchange=filter;
    bindDetails(people);
  }
  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});};
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
