'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  const notify=message=>typeof toast==='function'?toast(message):alert(message);
  const originalSyncHealthTasks=window.syncHealthTasks;

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

  if(typeof originalSyncHealthTasks==='function'){
    window.syncHealthTasks=function(habit,...args){
      const result=originalSyncHealthTasks(habit,...args);
      purgeSkippedHealthTasks();
      return result;
    };
  }
  if(purgeSkippedHealthTasks())persist();

  function deleteTask(task){
    if(!task||task.generatedLinked)return false;
    rememberSkippedHealthTask(task);
    state.tasks=state.tasks.filter(item=>item.id!==task.id);
    if(typeof log==='function')log('task','Удалена задача: '+task.title,task.projectId);
    persist('Задача удалена');
    render();
    return true;
  }

  function visibleTasksInGroup(group){
    const ids=[...group.querySelectorAll('[data-toggle-task]')].map(button=>button.dataset.toggleTask).filter(Boolean);
    const seen=new Set();
    return ids.map(id=>(state.tasks||[]).find(task=>task.id===id)).filter(task=>task&&!seen.has(task.id)&&(seen.add(task.id),true));
  }

  function decorate(){
    if(title.textContent.trim()!=='Задачи')return;
    const workspace=content.querySelector('.task-workspace');
    if(!workspace)return;

    workspace.querySelectorAll('.task-group .list-row').forEach(row=>{
      const toggle=row.querySelector('[data-toggle-task]');
      const id=toggle?.dataset.toggleTask;
      const task=(state.tasks||[]).find(item=>item.id===id);
      const actions=row.querySelector(':scope > .actions');
      if(!task||!actions||task.generatedLinked||actions.querySelector('[data-safe-delete-task]'))return;
      const button=document.createElement('button');
      button.type='button';button.className='btn danger small';button.dataset.safeDeleteTask=task.id;button.textContent='Удалить';
      button.onclick=event=>{event.stopPropagation();if(confirm(`Удалить задачу «${task.title}»?`))deleteTask(task)};
      actions.append(button);
    });

    workspace.querySelectorAll('.task-group').forEach(group=>{
      const heading=group.querySelector(':scope > h2');
      if(!heading||!heading.textContent.trim().startsWith('Позже')||group.querySelector('[data-delete-later-tasks]'))return;
      heading.classList.add('task-group-heading-actions');
      const button=document.createElement('button');button.type='button';button.className='btn danger small';button.dataset.deleteLaterTasks='1';button.textContent='Удалить всё';
      button.onclick=()=>{
        const all=visibleTasksInGroup(group),deletable=all.filter(task=>!task.generatedLinked),linked=all.length-deletable.length;
        if(!deletable.length){notify(linked?'Связанные задачи удаляются через их источник':'В разделе «Позже» нет задач для удаления');return;}
        const suffix=linked?` Связанные задачи (${linked}) останутся и удаляются через поручение, совещание или спринт.`:'';
        if(!confirm(`Удалить все показанные задачи из раздела «Позже» (${deletable.length})?${suffix}`))return;
        const ids=new Set(deletable.map(task=>task.id));
        deletable.forEach(rememberSkippedHealthTask);
        state.tasks=state.tasks.filter(task=>!ids.has(task.id));
        if(typeof log==='function')log('task',`Удалены задачи из раздела «Позже»: ${deletable.length}`,'');
        persist(`Удалено задач: ${deletable.length}`);render();
      };
      heading.append(button);
    });
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
