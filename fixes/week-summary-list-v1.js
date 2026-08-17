'use strict';

(() => {
  let selectedFilter='all';
  let listRequested=false;

  const labels={all:'Все задачи недели',open:'Оставшиеся задачи недели',done:'Выполненные задачи недели',priority:'Приоритетные задачи недели'};
  const matches=(task,filter)=>filter==='open'?!task.done:filter==='done'?task.done:filter==='priority'?!task.done&&(task.priority==='priority'||task.priority==='urgent'):true;
  const projectName=id=>state.projects.find(p=>p.id===id)?.name||'Без проекта';
  const sphereName=value=>({professional:'Профессиональное',education:'Образовательное',personal:'Личное'}[String(value||'').toLowerCase()]||'');
  const overlaps=(task,start,end)=>typeof window.TaskCalendarRange?.overlaps==='function'?window.TaskCalendarRange.overlaps(task,start,end):task.date>=start&&task.date<=end;
  const endDate=task=>typeof window.TaskCalendarRange?.taskEndDate==='function'?window.TaskCalendarRange.taskEndDate(task):(task.endDate||task.date||'');
  const timeLabel=task=>typeof window.TaskCalendarRange?.intervalLabel==='function'?window.TaskCalendarRange.intervalLabel(task,task.date):[task.start,task.end].filter(Boolean).join('–');

  function bounds(){
    if(typeof weekDates!=='function')return ['', ''];
    const ds=weekDates();
    return [localDateIso(ds[0]),localDateIso(ds[6])];
  }

  function tasksForWeek(){
    const [start,end]=bounds();
    return (state.tasks||[]).filter(t=>overlaps(t,start,end)&&matches(t,selectedFilter)).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.start||'99:99').localeCompare(b.start||'99:99')||(a.title||'').localeCompare(b.title||'','ru'));
  }

  function row(task){
    const finish=endDate(task),dateRange=finish&&finish!==task.date?`${fmt(task.date)} — ${fmt(finish)}`:fmt(task.date);
    const meta=[dateRange,timeLabel(task),projectName(task.projectId),sphereName(task.sphere)].filter(Boolean).join(' · ');
    return `<article class="week-summary-list-row ${task.done?'done':''}"><div class="week-summary-list-main"><b>${esc(task.title)}</b><div class="item-meta">${esc(meta)}</div>${task.result?`<div class="week-summary-list-result"><strong>Результат:</strong> ${esc(task.result)}</div>`:''}</div><div class="actions"><button type="button" class="btn ghost small" data-week-list-edit="${task.id}">Изменить</button><button type="button" class="btn primary small" data-week-list-done="${task.id}">${task.done?'Вернуть':'Готово'}</button></div></article>`;
  }

  function decorateSummary(){
    const summary=document.querySelector('.week-summary');if(!summary)return;
    const filters=['all','open','done','priority'];
    [...summary.children].forEach((item,index)=>{const filter=filters[index];if(!filter)return;item.dataset.weekSummaryFilter=filter;item.setAttribute('role','button');item.setAttribute('tabindex','0');item.setAttribute('aria-pressed',String(listRequested&&selectedFilter===filter));item.classList.toggle('active',listRequested&&selectedFilter===filter)});
  }

  function renderList(){
    const workspace=document.querySelector('.week-workspace');if(!workspace)return;
    decorateSummary();
    const old=workspace.querySelector('[data-week-summary-list]');if(!listRequested){old?.remove();return;}
    const tasks=tasksForWeek(),section=old||document.createElement('section'),[start]=bounds();
    section.className='card week-summary-list';section.dataset.weekSummaryList='1';
    section.innerHTML=`<header class="week-summary-list-head"><div><p class="eyebrow">Список недели</p><h3>${labels[selectedFilter]||labels.all}</h3></div><div class="week-summary-list-head-actions"><span class="chip">${tasks.length}</span><button type="button" class="btn primary small" data-week-list-add data-date="${start}" data-start="09:00">+ Добавить</button><button type="button" class="btn ghost small" data-week-list-close>Скрыть список</button></div></header><div class="week-summary-list-body">${tasks.length?tasks.map(row).join(''):`<div class="week-summary-list-empty">По выбранному фильтру задач на этой неделе нет</div>`}</div>`;
    if(!old)workspace.querySelector('.week-summary')?.insertAdjacentElement('afterend',section);decorateSummary();
  }

  function activateFilter(filter){selectedFilter=filter||'all';listRequested=true;renderList()}
  document.addEventListener('click',event=>{
    const summaryItem=event.target.closest('.week-summary [data-week-summary-filter]');if(summaryItem){event.preventDefault();activateFilter(summaryItem.dataset.weekSummaryFilter);return}
    const close=event.target.closest('[data-week-list-close]');if(close){event.preventDefault();event.stopPropagation();listRequested=false;close.closest('[data-week-summary-list]')?.remove();decorateSummary();return}
    const add=event.target.closest('[data-week-list-add]');if(add){event.preventDefault();event.stopPropagation();if(typeof openTask==='function')openTask(null,{date:add.dataset.date||bounds()[0],start:add.dataset.start||'09:00'});return}
    const edit=event.target.closest('[data-week-list-edit]');if(edit){const task=(state.tasks||[]).find(t=>t.id===edit.dataset.weekListEdit);if(task&&typeof openTask==='function')openTask(task);return}
    const done=event.target.closest('[data-week-list-done]');if(done){const task=(state.tasks||[]).find(t=>t.id===done.dataset.weekListDone);if(!task)return;task.done=!task.done;task.status=task.done?'done':'planned';if(typeof log==='function')log('task',(task.done?'Выполнена задача: ':'Возвращена задача: ')+task.title,task.projectId);persist(task.done?'Задача выполнена':'Задача возвращена в работу');render();requestAnimationFrame(()=>requestAnimationFrame(renderList))}
  },true);
  document.addEventListener('keydown',event=>{const item=event.target.closest?.('.week-summary [data-week-summary-filter]');if(!item||!['Enter',' '].includes(event.key))return;event.preventDefault();activateFilter(item.dataset.weekSummaryFilter)});

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorateSummary();if(listRequested)renderList()})};
  new MutationObserver(schedule).observe(document.getElementById('content')||document.body,{childList:true,subtree:true});schedule();
})();
