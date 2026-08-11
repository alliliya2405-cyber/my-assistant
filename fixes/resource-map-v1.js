'use strict';

(() => {
  const title=document.getElementById('pageTitle'),content=document.getElementById('content');
  if(!title||!content)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=v=>{const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}.${m[2]}.${m[1]}`:(v||'—')};
  const statusLabel=s=>({active:'Активный',assigned:'Назначено',planned:'Запланировано',doing:'В работе',review:'На проверке',done:'Выполнено',paused:'На паузе'}[s]||s||'—');
  const getState=()=>typeof state!=='undefined'?state:null;
  const personKey=v=>String(v||'').trim().toLowerCase();
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
        if(!projectMap.has(key))projectMap.set(key,{name:row.project||'Без проекта',status:row.status||'active',source:row.source||'Проект'});
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
  function render(){
    if(title.textContent.trim()!=='Ресурсная карта')return;
    const people=rows(),open=people.reduce((n,p)=>n+p.open.length,0),overdue=people.reduce((n,p)=>n+p.overdue.length,0),high=people.filter(p=>p.level==='high').length;
    content.innerHTML=`<div class="hero resource-hero"><p class="eyebrow">Ресурсная карта</p><h2>Загрузка команды</h2><p>Один экран показывает, кто в каких проектах участвует, сколько открытых поручений держит и где требуется внимание.</p></div>
    <div class="resource-summary"><div class="card metric"><span>Участников</span><strong>${people.length}</strong></div><div class="card metric"><span>Открытых поручений</span><strong>${open}</strong></div><div class="card metric"><span>Просрочено</span><strong>${overdue}</strong></div><div class="card metric"><span>Высокая загрузка</span><strong>${high}</strong></div></div>
    <section class="card resource-toolbar"><input id="resourceSearch" class="search-input" placeholder="Найти сотрудника или проект"><select id="resourceLoad"><option value="">Вся команда</option><option value="high">Высокая загрузка</option><option value="medium">Средняя загрузка</option><option value="normal">Нормальная загрузка</option></select><label class="form-check"><input class="form-check-input" id="resourceOpenOnly" type="checkbox"><span class="form-check-label">Только с поручениями</span></label></section>
    <div class="resource-grid" id="resourceGrid">${people.map(p=>`<article class="card resource-person" data-load="${p.level}" data-open="${p.open.length}" data-search="${esc((p.name+' '+[...p.projects.values()].map(x=>x.name).join(' ')).toLowerCase())}"><header><div><h2>${esc(p.name)}</h2><div class="item-meta">${esc([...p.roles].join(', ')||'Роль не указана')}</div></div><span class="resource-load resource-load-${p.level}">${p.level==='high'?'Высокая':p.level==='medium'?'Средняя':'Нормальная'} загрузка</span></header><div class="resource-person-metrics"><span><b>${p.active}</b> активных проектов</span><span><b>${p.open.length}</b> открытых поручений</span><span class="${p.overdue.length?'resource-alert':''}"><b>${p.overdue.length}</b> просрочено</span></div>${p.next?`<div class="resource-next"><small>Ближайший срок</small><b>${fmt(p.next.deadline)} · ${esc(p.next.title)}</b></div>`:''}<div class="resource-projects">${[...p.projects.values()].map(r=>`<div><span><b>${esc(r.name)}</b><small>${esc(r.source)}</small></span><span class="chip">${esc(statusLabel(r.status))}</span></div>`).join('')||'<p class="muted">Нет проектов</p>'}</div>${p.open.length?`<details class="resource-assignments"><summary>Открытые поручения · ${p.open.length}</summary>${p.open.map(a=>`<div><b>${esc(a.title)}</b><span>${fmt(a.deadline)} · ${esc(statusLabel(a.status))}</span></div>`).join('')}</details>`:''}</article>`).join('')||'<div class="empty">Команда ещё не заполнена</div>'}</div>`;
    const search=document.getElementById('resourceSearch'),load=document.getElementById('resourceLoad'),only=document.getElementById('resourceOpenOnly');
    const filter=()=>document.querySelectorAll('.resource-person').forEach(card=>{const q=(search.value||'').trim().toLowerCase();card.hidden=!!((q&&!card.dataset.search.includes(q))||(load.value&&card.dataset.load!==load.value)||(only.checked&&Number(card.dataset.open)===0));});
    search.oninput=filter;load.onchange=filter;only.onchange=filter;
  }
  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});};
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
