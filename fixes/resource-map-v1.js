'use strict';

(() => {
  const title=document.getElementById('pageTitle'),content=document.getElementById('content');
  if(!title||!content)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=v=>{const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}.${m[2]}.${m[1]}`:(v||'—')};
  const statusLabel=s=>({active:'Активный',assigned:'Назначено',planned:'Запланировано',doing:'В работе',review:'На проверке',done:'Выполнено',paused:'На паузе'}[s]||s||'—');
  const getState=()=>window.state||null;
  const personKey=v=>String(v||'').trim().toLowerCase();
  function projectMembers(p){return [...(p.team||[]),...(p.subprojects||[]).flatMap(sp=>(sp.team||[]).map(m=>({...m,source:`Подпроект: ${sp.name}`})))];}
  function rows(){
    const s=getState();if(!s)return[];const map=new Map();
    const ensure=name=>{const key=personKey(name);if(!key)return null;if(!map.has(key))map.set(key,{name:String(name).trim(),roles:new Set(),projects:new Map(),assignments:[]});return map.get(key)};
    (s.projects||[]).forEach(p=>projectMembers(p).forEach(m=>{const x=ensure(m.name);if(!x)return;if(m.role)x.roles.add(m.role);x.projects.set(p.id,{name:p.name,status:p.status||'active',source:m.source||'Проект'});}));
    (s.assignments||[]).forEach(a=>{const x=ensure(a.assignee);if(!x)return;x.assignments.push(a);if(a.projectId){const p=(s.projects||[]).find(p=>p.id===a.projectId);if(p&&!x.projects.has(p.id))x.projects.set(p.id,{name:p.name,status:p.status||a.status||'active',source:'Поручение'});}});
    return [...map.values()].map(x=>{
      const open=x.assignments.filter(a=>a.status!=='done');
      const overdue=open.filter(a=>a.deadline&&a.deadline<new Date().toISOString().slice(0,10));
      const dated=open.filter(a=>a.deadline).sort((a,b)=>a.deadline.localeCompare(b.deadline));
      const active=[...x.projects.values()].filter(p=>p.status==='active').length;
      const score=active*2+open.length+overdue.length*2;
      const level=score>=8?'high':score>=4?'medium':'normal';
      return {...x,open,overdue,next:dated[0]||null,active,score,level};
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
