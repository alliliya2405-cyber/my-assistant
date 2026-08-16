'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  const notify=message=>typeof toast==='function'?toast(message):alert(message);
  const originalSyncHealthTasks=window.syncHealthTasks;
  const BLOCKED_ROUTINE_TITLES=['ходьба','вода','капли в глаза'];
  let areaFilter='all';

  const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
  const isBlockedRoutineTask=task=>BLOCKED_ROUTINE_TITLES.some(name=>normalize(task?.title).includes(name));

  function rememberSkippedHealthTask(task){
    if(!task?.generatedByHealth||!task.healthHabitId||!task.date)return;
    const habit=(state.health||[]).find(h=>h.id===task.healthHabitId);
    if(!habit)return;
    habit.skippedDates=[...new Set([...(habit.skippedDates||[]),task.date])];
  }

  function purgeSkippedHealthTasks(){
    const before=(state.tasks||[]).length;
    const skipped=new Map((state.health||[]).map(h=>[h.id,new Set(h.skippedDates||[])]));
    state.tasks=state.tasks.filter(task=>!(task.generatedByHealth&&task.healthHabitId&&skipped.get(task.healthHabitId)?.has(task.date)));
    return state.tasks.length!==before;
  }

  function purgeBlockedRoutineTasks(){
    const before=(state.tasks||[]).length;
    state.settings=state.settings||{};
    state.settings.blockedRoutineTaskTitles=[...BLOCKED_ROUTINE_TITLES];
    state.tasks=(state.tasks||[]).filter(task=>!isBlockedRoutineTask(task));
    return state.tasks.length!==before;
  }

  function purgeProtectedTasks(){
    const a=purgeSkippedHealthTasks();
    const b=purgeBlockedRoutineTasks();
    return a||b;
  }

  if(typeof originalSyncHealthTasks==='function'){
    window.syncHealthTasks=function(habit,...args){
      const result=originalSyncHealthTasks(habit,...args);
      purgeProtectedTasks();
      return result;
    };
  }
  if(purgeProtectedTasks())persist('Удалены задачи: Ходьба, Вода, Капли в глаза');

  function deleteTask(task){
    if(!task||task.generatedLinked)return false;
    rememberSkippedHealthTask(task);
    state.tasks=state.tasks.filter(item=>item.id!==task.id);
    if(typeof log==='function')log('task','Удалена задача: '+task.title,task.projectId);
    persist('Задача удалена');
    render();
    return true;
  }

  function deleteMany(tasks,contextLabel){
    const all=[...new Map((tasks||[]).filter(Boolean).map(task=>[task.id,task])).values()];
    const deletable=all.filter(task=>!task.generatedLinked),linked=all.length-deletable.length;
    if(!deletable.length){notify(linked?'Связанные задачи удаляются через их источник':'Нет задач для удаления');return;}
    const suffix=linked?` Связанные задачи (${linked}) останутся и удаляются через поручение, совещание или спринт.`:'';
    if(!confirm(`Удалить все показанные задачи ${contextLabel} (${deletable.length})?${suffix}`))return;
    const ids=new Set(deletable.map(task=>task.id));
    deletable.forEach(rememberSkippedHealthTask);
    state.tasks=state.tasks.filter(task=>!ids.has(task.id));
    if(typeof log==='function')log('task',`Массово удалены задачи ${contextLabel}: ${deletable.length}`,'');
    persist(`Удалено задач: ${deletable.length}`);
    render();
  }

  function visibleTasksInGroup(group){
    const ids=[...group.querySelectorAll('[data-toggle-task]')].map(button=>button.dataset.toggleTask).filter(Boolean);
    const seen=new Set();
    return ids.map(id=>(state.tasks||[]).find(task=>task.id===id)).filter(task=>task&&!seen.has(task.id)&&(seen.add(task.id),true));
  }

  function visibleTasksInKanbanColumn(col){
    return [...col.querySelectorAll('.kanban-card:not([hidden])')]
      .map(card=>(state.tasks||[]).find(task=>task.id===taskIdFromNode(card)))
      .filter(Boolean);
  }

  function taskMatchesArea(task){
    if(areaFilter==='all')return true;
    if(areaFilter==='projects')return Boolean(task?.projectId);
    if(areaFilter==='health')return Boolean(task?.generatedByHealth||task?.healthHabitId||normalize(task?.sphere)==='health'||normalize(task?.sphere)==='здоровье');
    if(areaFilter==='education'){
      const sphere=normalize(task?.sphere);
      const p=(state.projects||[]).find(item=>item.id===task?.projectId);
      return sphere==='education'||sphere==='образование'||(p?.areas||[]).some(area=>normalize(area)==='образование');
    }
    return true;
  }

  function taskIdFromNode(node){
    return node.querySelector('[data-toggle-task]')?.dataset.toggleTask||node.dataset.dragTask||'';
  }

  function applyAreaFilter(){
    if(title.textContent.trim()!=='Задачи')return;
    const workspace=content.querySelector('.task-workspace');
    if(!workspace)return;
    workspace.querySelectorAll('.task-group').forEach(group=>{
      let visible=0;
      group.querySelectorAll('.list-row').forEach(row=>{
        const task=(state.tasks||[]).find(item=>item.id===taskIdFromNode(row));
        const show=task&&taskMatchesArea(task);
        row.hidden=!show;
        if(show)visible++;
      });
      const chip=group.querySelector(':scope > h2 .chip');if(chip)chip.textContent=String(visible);
      group.hidden=visible===0;
    });
    workspace.querySelectorAll('.kanban-col').forEach(col=>{
      let visible=0;
      col.querySelectorAll('.kanban-card').forEach(card=>{
        const task=(state.tasks||[]).find(item=>item.id===taskIdFromNode(card));
        const show=task&&taskMatchesArea(task);
        card.hidden=!show;
        if(show)visible++;
      });
      const chip=col.querySelector('.kanban-col-head .chip');if(chip)chip.textContent=String(visible);
      const deleteAll=col.querySelector('[data-delete-kanban-column]');if(deleteAll)deleteAll.hidden=visible===0;
    });
  }

  function ensureAreaFilter(workspace){
    const filters=workspace.querySelector('.task-filters');
    if(!filters||filters.querySelector('#taskAreaFilter'))return;
    const select=document.createElement('select');
    select.id='taskAreaFilter';select.setAttribute('aria-label','Фильтр по области');
    select.innerHTML='<option value="all">Все области</option><option value="projects">По проектам</option><option value="education">Образование</option><option value="health">Здоровье</option>';
    select.value=areaFilter;
    select.onchange=()=>{areaFilter=select.value;applyAreaFilter()};
    filters.append(select);
  }

  function addDeleteButton(container,task){
    if(!task||task.generatedLinked||container.querySelector('[data-safe-delete-task]'))return;
    const button=document.createElement('button');
    button.type='button';button.className='btn danger small';button.dataset.safeDeleteTask=task.id;button.textContent='Удалить';
    button.onclick=event=>{event.stopPropagation();if(confirm(`Удалить задачу «${task.title}»?`))deleteTask(task)};
    container.append(button);
  }

  function addKanbanDeleteAll(col){
    const head=col.querySelector('.kanban-col-head');
    if(!head||head.querySelector('[data-delete-kanban-column]')||!col.querySelector('.kanban-card'))return;
    head.classList.add('kanban-col-head-actions');
    const button=document.createElement('button');
    button.type='button';button.className='btn danger small';button.dataset.deleteKanbanColumn='1';button.textContent='Удалить всё';
    button.onclick=event=>{
      event.stopPropagation();
      const name=head.querySelector('h3')?.textContent.trim()||'в колонке';
      deleteMany(visibleTasksInKanbanColumn(col),`в колонке «${name}»`);
    };
    head.append(button);
  }

  function decorate(){
    if(title.textContent.trim()!=='Задачи')return;
    const workspace=content.querySelector('.task-workspace');
    if(!workspace)return;
    ensureAreaFilter(workspace);

    workspace.querySelectorAll('.task-group .list-row').forEach(row=>{
      const task=(state.tasks||[]).find(item=>item.id===taskIdFromNode(row));
      const actions=row.querySelector(':scope > .actions');
      if(actions)addDeleteButton(actions,task);
    });

    workspace.querySelectorAll('.kanban-card').forEach(card=>{
      const task=(state.tasks||[]).find(item=>item.id===taskIdFromNode(card));
      const actions=card.querySelector('.kanban-actions');
      if(actions)addDeleteButton(actions,task);
    });
    workspace.querySelectorAll('.kanban-col').forEach(addKanbanDeleteAll);

    workspace.querySelectorAll('.task-group').forEach(group=>{
      const heading=group.querySelector(':scope > h2');
      if(!heading||!heading.textContent.trim().startsWith('Позже')||group.querySelector('[data-delete-later-tasks]'))return;
      heading.classList.add('task-group-heading-actions');
      const button=document.createElement('button');button.type='button';button.className='btn danger small';button.dataset.deleteLaterTasks='1';button.textContent='Удалить всё';
      button.onclick=()=>{
        const all=visibleTasksInGroup(group).filter(task=>taskMatchesArea(task));
        deleteMany(all,'из раздела «Позже»');
      };
      heading.append(button);
    });

    applyAreaFilter();
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  content.addEventListener('input',event=>{if(event.target.closest('.task-filters'))schedule()});
  content.addEventListener('change',event=>{if(event.target.closest('.task-filters'))schedule()});
  schedule();
})();
