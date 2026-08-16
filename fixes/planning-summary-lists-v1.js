'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  let weekFilter=null;
  let monthFilter=null;
  const labels={all:'Все задачи',open:'Осталось',done:'Выполнено',priority:'Важное'};

  const isoFromRu=value=>{
    const m=String(value||'').match(/(\d{2})\.(\d{2})\.(\d{4})/);
    return m?`${m[3]}-${m[2]}-${m[1]}`:'';
  };
  const filtered=(tasks,key)=>{
    if(key==='open')return tasks.filter(t=>!t.done);
    if(key==='done')return tasks.filter(t=>t.done);
    if(key==='priority')return tasks.filter(t=>!t.done&&(t.priority==='priority'||t.priority==='urgent'));
    return tasks;
  };
  const sorted=tasks=>tasks.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.start||'99:99').localeCompare(b.start||'99:99')||(a.title||'').localeCompare(b.title||'','ru'));

  function weekTasks(){
    const heading=content.querySelector('.week-title h2');
    if(!heading)return [];
    const dates=[...heading.textContent.matchAll(/\d{2}\.\d{2}\.\d{4}/g)].map(x=>isoFromRu(x[0]));
    if(dates.length<2)return [];
    return state.tasks.filter(t=>t.date&&t.date>=dates[0]&&t.date<=dates[1]);
  }

  function monthTasks(){
    const dates=[...content.querySelectorAll('.month-cell:not(.dim)[data-month-day]')].map(x=>x.dataset.monthDay).filter(Boolean).sort();
    if(!dates.length)return [];
    return state.tasks.filter(t=>t.date&&t.date>=dates[0]&&t.date<=dates[dates.length-1]);
  }

  function listHtml(tasks){
    if(!tasks.length)return '<div class="planning-summary-empty">По выбранному показателю задач нет</div>';
    if(typeof taskRow==='function')return `<div class="list planning-summary-task-list">${sorted(tasks).map(taskRow).join('')}</div>`;
    return `<div class="planning-summary-task-list">${sorted(tasks).map(t=>`<button class="planning-summary-fallback" type="button" data-edit-task="${t.id}"><b>${esc(t.title)}</b><span>${fmt(t.date)}${t.start?` · ${esc(t.start)}`:''}</span></button>`).join('')}</div>`;
  }

  function showPanel(kind,key){
    const summary=content.querySelector(kind==='week'?'.week-summary':'.month-summary');
    if(!summary)return;
    let panel=content.querySelector(`.planning-summary-list-panel[data-kind="${kind}"]`);
    if(!panel){
      panel=document.createElement('section');
      panel.className='card planning-summary-list-panel';
      panel.dataset.kind=kind;
      summary.insertAdjacentElement('afterend',panel);
    }
    const source=kind==='week'?weekTasks():monthTasks();
    const rows=filtered(source,key);
    panel.innerHTML=`<header class="planning-summary-list-head"><div><p class="eyebrow">${kind==='week'?'Задачи недели':'Задачи месяца'}</p><h3>${labels[key]||labels.all} <span class="chip">${rows.length}</span></h3></div><button class="btn ghost small" type="button" data-close-planning-summary="${kind}">Скрыть список</button></header>${listHtml(rows)}`;
    panel.hidden=false;
    if(typeof bindPage==='function')bindPage();
  }

  function decorateWeek(){
    if(title.textContent.trim()!=='Неделя')return;
    const summary=content.querySelector('.week-summary');
    if(!summary)return;
    const keys=['all','open','done','priority'];
    [...summary.children].forEach((metric,index)=>{
      const key=keys[index];if(!key)return;
      metric.classList.add('planning-summary-clickable');
      metric.dataset.weekSummaryFilter=key;
      metric.setAttribute('role','button');metric.tabIndex=0;
      metric.setAttribute('aria-label',`Показать списком: ${labels[key]}`);
    });
    if(weekFilter)showPanel('week',weekFilter);
  }

  function decorateMonth(){
    if(title.textContent.trim()!=='Месяц')return;
    content.querySelectorAll('[data-month-filter]').forEach(button=>button.classList.add('planning-summary-clickable'));
    if(monthFilter)showPanel('month',monthFilter);
  }

  function decorate(){decorateWeek();decorateMonth()}

  content.addEventListener('click',event=>{
    const week=event.target.closest('[data-week-summary-filter]');
    if(week){weekFilter=week.dataset.weekSummaryFilter||'all';showPanel('week',weekFilter);return;}
    const month=event.target.closest('.month-summary [data-month-filter]');
    if(month){monthFilter=month.dataset.monthFilter||'all';setTimeout(()=>showPanel('month',monthFilter),0);return;}
    const close=event.target.closest('[data-close-planning-summary]');
    if(close){
      const kind=close.dataset.closePlanningSummary;
      if(kind==='week')weekFilter=null;else monthFilter=null;
      content.querySelector(`.planning-summary-list-panel[data-kind="${kind}"]`)?.remove();
    }
  },true);

  content.addEventListener('keydown',event=>{
    const metric=event.target.closest('[data-week-summary-filter]');
    if(metric&&(event.key==='Enter'||event.key===' ')){
      event.preventDefault();weekFilter=metric.dataset.weekSummaryFilter||'all';showPanel('week',weekFilter);
    }
  });

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
