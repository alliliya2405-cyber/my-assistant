'use strict';

/* Month Controls Fix v1
   UI-only post-render guard for the month view.
   It does not read or mutate user data. */
(function(){
  if(typeof render!=='function')return;

  const baseRender=render;

  function fixMonthUi(){
    const workspace=document.querySelector('.month-workspace');
    if(!workspace)return;

    const calendar=workspace.querySelector('.month-calendar-card');
    if(calendar){
      calendar.classList.remove('collapsible-entry','global-collapsed');
      calendar.style.maxHeight='';
      calendar.style.height='';
      calendar.style.overflow='';
      calendar.querySelectorAll('.global-collapse-bar').forEach(x=>x.remove());
      [...calendar.children].forEach(x=>{x.hidden=false;x.style.removeProperty('display')});
    }

    const status=workspace.querySelector('.month-filter-status');
    if(status){
      const active=typeof monthTaskFilter==='string'?monthTaskFilter:'all';
      if(active==='all'){
        status.innerHTML='<span class="month-filter-current">Показано: все задачи</span>';
      }else{
        status.innerHTML='<span class="month-filter-current">Показан выбранный фильтр</span><button type="button" class="month-filter-reset">Показать все задачи</button>';
        status.querySelector('.month-filter-reset')?.addEventListener('click',()=>{
          monthTaskFilter='all';
          render();
        });
      }
    }
  }

  render=function(...args){
    const result=baseRender(...args);
    fixMonthUi();
    return result;
  };

  fixMonthUi();
})();
