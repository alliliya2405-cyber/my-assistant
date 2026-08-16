'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  const hiddenIds=()=>new Set(state.settings?.hiddenProjectSprintSections||[]);
  const saveHidden=ids=>{
    state.settings=state.settings||{};
    state.settings.hiddenProjectSprintSections=[...ids];
    persist('Настройки проекта сохранены');
  };

  function projectSprintSection(card){
    const details=card.querySelector(':scope > .project-details');
    if(!details)return null;
    return [...details.querySelectorAll(':scope > .project-inner-section')].find(section=>{
      const heading=section.querySelector(':scope > .project-inner-header h3');
      return heading?.textContent.trim().startsWith('Спринты проекта');
    })||null;
  }

  function addRestoreButton(card,pid){
    const controls=card.querySelector('.project-inner-controls');
    if(!controls||controls.querySelector(`[data-restore-project-sprints="${pid}"]`))return;
    const button=document.createElement('button');
    button.type='button';
    button.className='btn ghost small project-sprint-restore';
    button.dataset.restoreProjectSprints=pid;
    button.textContent='+ Вернуть «Спринты проекта»';
    button.onclick=event=>{
      event.stopPropagation();
      const ids=hiddenIds();ids.delete(pid);saveHidden(ids);render();
    };
    controls.append(button);
  }

  function decorate(){
    if(title.textContent.trim()!=='Все проекты')return;
    const hidden=hiddenIds();
    content.querySelectorAll('[data-project-card]').forEach(card=>{
      const pid=card.dataset.projectCard;
      const section=projectSprintSection(card);
      if(!pid||!section)return;

      if(hidden.has(pid)){
        section.remove();
        addRestoreButton(card,pid);
        return;
      }

      const actions=section.querySelector(':scope > .project-inner-header > .actions');
      if(!actions||actions.querySelector('[data-hide-project-sprints]'))return;
      const button=document.createElement('button');
      button.type='button';
      button.className='btn danger small project-sprint-hide';
      button.dataset.hideProjectSprints=pid;
      button.textContent='Удалить блок';
      button.onclick=event=>{
        event.stopPropagation();
        const projectItem=(state.projects||[]).find(project=>project.id===pid);
        const count=projectItem?.sprints?.length||0;
        const detail=count?` В нём сейчас ${count} ${count===1?'спринт':'спринта/спринтов'}; данные не удалятся.`:' Данные проекта не изменятся.';
        if(!confirm(`Убрать блок «Спринты проекта» из карточки проекта?${detail} При необходимости блок можно вернуть.`))return;
        const ids=hiddenIds();ids.add(pid);saveHidden(ids);render();
      };
      actions.prepend(button);
    });
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
