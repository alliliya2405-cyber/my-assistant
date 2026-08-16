'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  let focusFilter='all';
  let overdueFilter='all';
  const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');

  function matchesArea(task,filter){
    if(filter==='all')return true;
    if(filter==='projects')return Boolean(task?.projectId);
    if(filter==='health')return !task?.projectId&&Boolean(task?.generatedByHealth||task?.healthHabitId||normalize(task?.sphere)==='health'||normalize(task?.sphere)==='здоровье');
    if(filter==='education'){
      const sphere=normalize(task?.sphere);
      return !task?.projectId&&(task?.linkedSourceType==='education'||sphere==='education'||sphere==='образование'||sphere==='образовательная');
    }
    return true;
  }

  const options=()=>'<option value="all">Показать все</option><option value="projects">Проекты</option><option value="education">Образование</option><option value="health">Здоровье</option>';
  const sorted=tasks=>tasks.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.start||'99:99').localeCompare(b.start||'99:99')||(a.title||'').localeCompare(b.title||'','ru'));

  function ensureFilter(card,kind,value){
    const head=card?.querySelector('.section-title');
    if(!head)return null;
    const selector=`select[data-home-area-filter="${kind}"]`;
    let select=head.querySelector(selector);
    if(!select){
      select=document.createElement('select');
      select.className='home-area-filter';
      select.dataset.homeAreaFilter=kind;
      select.setAttribute('aria-label',kind==='focus'?'Фильтр задач в фокусе':'Фильтр просроченных задач');
      select.innerHTML=options();
      const oldAction=head.querySelector('[data-dashboard-filter]');
      if(oldAction)oldAction.replaceWith(select);else head.append(select);
      select.addEventListener('change',()=>{
        if(kind==='focus')focusFilter=select.value;else overdueFilter=select.value;
        renderCard(kind);
      });
    }
    select.value=value;
    return select;
  }

  function cardTasks(kind){
    const today=todayIso();
    if(kind==='focus')return state.tasks.filter(t=>t.date===today&&!t.done&&matchesArea(t,focusFilter));
    return state.tasks.filter(t=>!t.done&&t.date&&t.date<today&&matchesArea(t,overdueFilter));
  }

  function renderCard(kind){
    if(title.textContent.trim()!=='Главная')return;
    const card=content.querySelector(kind==='focus'?'.home-today-card':'.home-overdue-card');
    if(!card)return;
    const filter=kind==='focus'?focusFilter:overdueFilter;
    ensureFilter(card,kind,filter);
    const tasks=sorted(cardTasks(kind));
    const count=card.querySelector('.home-count');if(count)count.textContent=String(tasks.length);
    const list=card.querySelector('.list');
    if(list){
      const emptyText=kind==='focus'?'По выбранному фильтру задач на сегодня нет':'По выбранному фильтру просроченных задач нет';
      list.innerHTML=tasks.length?tasks.map(taskRow).join(''):empty(emptyText);
    }
    if(typeof bindPage==='function')bindPage();
  }

  function enhance(){
    if(title.textContent.trim()!=='Главная')return;
    const focus=content.querySelector('.home-today-card');
    const overdue=content.querySelector('.home-overdue-card');
    if(focus){ensureFilter(focus,'focus',focusFilter);renderCard('focus')}
    if(overdue){ensureFilter(overdue,'overdue',overdueFilter);renderCard('overdue')}
  }

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      if(title.textContent.trim()!=='Главная')return;
      const focus=content.querySelector('.home-today-card');
      const overdue=content.querySelector('.home-overdue-card');
      if(focus&&!focus.querySelector('[data-home-area-filter="focus"]'))ensureFilter(focus,'focus',focusFilter);
      if(overdue&&!overdue.querySelector('[data-home-area-filter="overdue"]'))ensureFilter(overdue,'overdue',overdueFilter);
    });
  };

  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(()=>{if(title.textContent.trim()==='Главная')setTimeout(enhance,0)}).observe(title,{childList:true,subtree:true,characterData:true});
  setTimeout(enhance,0);
})();
