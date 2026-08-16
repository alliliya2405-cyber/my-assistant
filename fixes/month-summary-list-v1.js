'use strict';

(() => {
  let listRequested=false;

  const labels={
    all:'Все задачи месяца',
    open:'Оставшиеся задачи месяца',
    done:'Выполненные задачи месяца',
    priority:'Важные задачи месяца'
  };

  const matches=(task,filter)=>filter==='open'?!task.done:filter==='done'?task.done:filter==='priority'?!task.done&&(task.priority==='priority'||task.priority==='urgent'):true;
  const projectName=id=>state.projects.find(p=>p.id===id)?.name||'Без проекта';
  const sphereName=value=>({professional:'Профессиональное',education:'Образовательное',personal:'Личное'}[String(value||'').toLowerCase()]||'');

  function monthBounds(){
    const y=monthCursor.getFullYear(),m=monthCursor.getMonth();
    return [localDateIso(new Date(y,m,1)),localDateIso(new Date(y,m+1,0))];
  }

  function tasksForMonth(){
    const [start,end]=monthBounds();
    return state.tasks
      .filter(t=>t.date>=start&&t.date<=end&&matches(t,monthTaskFilter))
      .slice()
      .sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.start||'99:99').localeCompare(b.start||'99:99')||(a.title||'').localeCompare(b.title||'','ru'));
  }

  function row(task){
    const meta=[fmt(task.date),task.start||'',projectName(task.projectId),sphereName(task.sphere)].filter(Boolean).join(' · ');
    return `<article class="month-summary-list-row ${task.done?'done':''}">
      <div class="month-summary-list-main">
        <b>${esc(task.title)}</b>
        <div class="item-meta">${esc(meta)}</div>
        ${task.result?`<div class="month-summary-list-result"><strong>Результат:</strong> ${esc(task.result)}</div>`:''}
      </div>
      <div class="actions">
        <button type="button" class="btn ghost small" data-month-list-edit="${task.id}">Изменить</button>
        <button type="button" class="btn primary small" data-month-list-done="${task.id}">${task.done?'Вернуть':'Готово'}</button>
      </div>
    </article>`;
  }

  function renderSummaryList(){
    const workspace=document.querySelector('.month-workspace');
    if(!workspace)return;
    const old=workspace.querySelector('[data-month-summary-list]');
    if(!listRequested){old?.remove();return;}

    const tasks=tasksForMonth();
    const section=old||document.createElement('section');
    section.className='card month-summary-list';
    section.dataset.monthSummaryList='1';
    const addDate=monthSelectedDate||monthBounds()[0];
    const markup=`<header class="month-summary-list-head">
      <div><p class="eyebrow">Список месяца</p><h3>${labels[monthTaskFilter]||labels.all}</h3></div>
      <div class="month-summary-list-head-actions">
        <span class="chip">${tasks.length}</span>
        <button type="button" class="btn primary small" data-slot-date="${addDate}" data-slot-hour="9">+ Добавить</button>
        <button type="button" class="btn ghost small" data-month-list-close>Скрыть список</button>
      </div>
    </header>
    <div class="month-summary-list-body">${tasks.length?tasks.map(row).join(''):`<div class="month-summary-list-empty">По выбранному фильтру задач в этом месяце нет</div>`}</div>`;
    if(section.innerHTML!==markup)section.innerHTML=markup;
    if(!old){
      const status=workspace.querySelector('.month-filter-status');
      (status||workspace.querySelector('.month-summary'))?.insertAdjacentElement('afterend',section);
    }
  }

  document.addEventListener('click',event=>{
    const close=event.target.closest('[data-month-list-close]');
    if(close){
      event.preventDefault();
      event.stopPropagation();
      listRequested=false;
      close.closest('[data-month-summary-list]')?.remove();
      return;
    }

    const filter=event.target.closest('.month-workspace [data-month-filter]');
    if(filter&&filter.closest('.month-summary')){
      listRequested=true;
      requestAnimationFrame(()=>requestAnimationFrame(renderSummaryList));
      return;
    }

    const edit=event.target.closest('[data-month-list-edit]');
    if(edit){
      const task=state.tasks.find(t=>t.id===edit.dataset.monthListEdit);
      if(task&&typeof openTask==='function')openTask(task);
      return;
    }

    const done=event.target.closest('[data-month-list-done]');
    if(done){
      const task=state.tasks.find(t=>t.id===done.dataset.monthListDone);
      if(!task)return;
      task.done=!task.done;
      task.status=task.done?'done':'planned';
      if(typeof log==='function')log('task',(task.done?'Выполнена задача: ':'Возвращена задача: ')+task.title,task.projectId);
      persist(task.done?'Задача выполнена':'Задача возвращена в работу');
      render();
      requestAnimationFrame(()=>requestAnimationFrame(renderSummaryList));
    }
  },true);

  let queued=false;
  const schedule=mutations=>{
    if(mutations?.length&&mutations.every(m=>m.target instanceof Element&&m.target.closest('[data-month-summary-list]')))return;
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;renderSummaryList()});
  };
  new MutationObserver(schedule).observe(document.getElementById('content')||document.body,{childList:true,subtree:true});
})();
