'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  const modalRoot=document.getElementById('modalRoot');
  if(!content||!title)return;

  const notify=message=>typeof toast==='function'?toast(message):alert(message);
  const originalSyncHealthTasks=window.syncHealthTasks;
  const originalSyncLinkedTasks=window.syncLinkedTasks;
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

  function rememberDismissedLinkedTask(task){
    if(!task?.generatedLinked||!task.linkedKey)return;
    state.settings=state.settings||{};
    state.settings.dismissedLinkedTaskKeys=[...new Set([...(state.settings.dismissedLinkedTaskKeys||[]),task.linkedKey])];
  }

  function purgeDismissedLinkedTasks(){
    const dismissed=new Set(state.settings?.dismissedLinkedTaskKeys||[]);
    if(!dismissed.size)return false;
    const before=(state.tasks||[]).length;
    state.tasks=(state.tasks||[]).filter(task=>!(task.generatedLinked&&task.linkedKey&&dismissed.has(task.linkedKey)));
    return state.tasks.length!==before;
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
    const c=purgeDismissedLinkedTasks();
    return a||b||c;
  }

  if(typeof originalSyncHealthTasks==='function'){
    window.syncHealthTasks=function(habit,...args){
      const result=originalSyncHealthTasks(habit,...args);
      purgeProtectedTasks();
      return result;
    };
  }
  if(typeof originalSyncLinkedTasks==='function'){
    window.syncLinkedTasks=function(...args){
      const result=originalSyncLinkedTasks(...args);
      purgeDismissedLinkedTasks();
      return result;
    };
  }
  if(purgeProtectedTasks())persist('Список задач очищен');

  function deleteTask(task){
    if(!task)return false;
    rememberSkippedHealthTask(task);
    rememberDismissedLinkedTask(task);
    state.tasks=state.tasks.filter(item=>item.id!==task.id);
    if(typeof log==='function')log('task','Удалена задача из списка: '+task.title,task.projectId);
    persist(task.generatedLinked?'Связанная задача удалена из списка':'Задача удалена');
    render();
    return true;
  }

  function deleteMany(tasks,contextLabel){
    const all=[...new Map((tasks||[]).filter(Boolean).map(task=>[task.id,task])).values()];
    if(!all.length){notify('Нет задач для удаления');return;}
    const linked=all.filter(task=>task.generatedLinked).length;
    const suffix=linked?` Связанные задачи (${linked}) будут убраны из списка задач, но их исходные поручения, совещания или спринты сохранятся.`:'';
    if(!confirm(`Удалить все показанные задачи ${contextLabel} (${all.length})?${suffix}`))return;
    const ids=new Set(all.map(task=>task.id));
    all.forEach(task=>{rememberSkippedHealthTask(task);rememberDismissedLinkedTask(task)});
    state.tasks=state.tasks.filter(task=>!ids.has(task.id));
    if(typeof log==='function')log('task',`Массово удалены задачи из списка ${contextLabel}: ${all.length}`,'');
    persist(`Удалено задач: ${all.length}`);
    render();
  }

  function taskIdFromNode(node){
    return node.querySelector('[data-toggle-task]')?.dataset.toggleTask||node.dataset.dragTask||'';
  }

  function visibleTasksInGroup(group){
    return [...group.querySelectorAll('.list-row:not([hidden])')]
      .map(row=>(state.tasks||[]).find(task=>task.id===taskIdFromNode(row)))
      .filter(Boolean);
  }

  function visibleTasksInKanbanColumn(col){
    return [...col.querySelectorAll('.kanban-card:not([hidden])')]
      .map(card=>(state.tasks||[]).find(task=>task.id===taskIdFromNode(card)))
      .filter(Boolean);
  }

  function taskMatchesArea(task){
    if(areaFilter==='all')return true;
    if(areaFilter==='projects')return Boolean(task?.projectId);
    if(areaFilter==='health')return !task?.projectId&&Boolean(task?.generatedByHealth||task?.healthHabitId||normalize(task?.sphere)==='health'||normalize(task?.sphere)==='здоровье');
    if(areaFilter==='education'){
      const sphere=normalize(task?.sphere);
      return !task?.projectId&&(task?.linkedSourceType==='education'||sphere==='education'||sphere==='образование');
    }
    return true;
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
      const deleteAll=group.querySelector('[data-delete-list-group]');if(deleteAll)deleteAll.hidden=visible===0;
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
    if(!task||container.querySelector('[data-safe-delete-task]'))return;
    const button=document.createElement('button');
    button.type='button';button.className='btn danger small';button.dataset.safeDeleteTask=task.id;button.textContent='Удалить';
    button.onclick=event=>{
      event.stopPropagation();
      const note=task.generatedLinked?'\n\nИсточник задачи сохранится; удаляется только карточка из списка задач.':'';
      if(confirm(`Удалить задачу «${task.title}»?${note}`))deleteTask(task)
    };
    container.append(button);
  }

  function addListGroupDeleteAll(group){
    const heading=group.querySelector(':scope > h2');
    if(!heading||heading.querySelector('[data-delete-list-group]')||!group.querySelector('.list-row'))return;
    heading.classList.add('task-group-heading-actions');
    const button=document.createElement('button');
    button.type='button';button.className='btn danger small';button.dataset.deleteListGroup='1';button.textContent='Удалить всё';
    button.onclick=event=>{
      event.stopPropagation();
      const label=[...heading.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).map(node=>node.textContent).join(' ').trim()||'раздела';
      deleteMany(visibleTasksInGroup(group),`из раздела «${label}»`);
    };
    heading.append(button);
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

  function explainTaskSource(){
    if(!modalRoot)return;
    const modal=modalRoot.querySelector('.modal');
    if(!modal||modal.querySelector('[data-task-source-explanation]'))return;
    const heading=modal.querySelector('h2,h3');
    const headingText=heading?.textContent?.trim()||'';
    if(!/^(Новая задача|Редактировать задачу)$/.test(headingText))return;
    const note=document.createElement('div');
    note.dataset.taskSourceExplanation='1';
    note.className='hint';
    note.textContent='Источник определяется автоматически: созданная здесь задача — «Обычная задача»; задачи из поручений, совещаний, спринтов и раздела «Образование» получают источник из места создания.';
    heading.insertAdjacentElement('afterend',note);
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
    workspace.querySelectorAll('.task-group').forEach(addListGroupDeleteAll);

    workspace.querySelectorAll('.kanban-card').forEach(card=>{
      const task=(state.tasks||[]).find(item=>item.id===taskIdFromNode(card));
      const actions=card.querySelector('.kanban-actions');
      if(actions)addDeleteButton(actions,task);
    });
    workspace.querySelectorAll('.kanban-col').forEach(addKanbanDeleteAll);

    applyAreaFilter();
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate();explainTaskSource()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  if(modalRoot)new MutationObserver(schedule).observe(modalRoot,{childList:true,subtree:true});
  content.addEventListener('input',event=>{if(event.target.closest('.task-filters'))schedule()});
  content.addEventListener('change',event=>{if(event.target.closest('.task-filters'))schedule()});
  schedule();
})();
