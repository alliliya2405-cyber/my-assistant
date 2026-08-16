'use strict';

(() => {
  const content=document.getElementById('content');
  if(!content)return;

  const STORAGE_KEY='educationCollapseState.v2';
  const norm=v=>String(v||'').trim();
  const readState=()=>{
    try{return JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'{}')||{}}catch{return{}}
  };
  const writeState=state=>{try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
  let collapsedState=readState();

  function educationGrid(){
    return [...content.querySelectorAll('.life-grid')].find(grid=>grid.querySelector('[data-add-life="education"]'))||null;
  }

  function educationHero(){
    const grid=educationGrid();
    if(!grid)return null;
    let node=grid.previousElementSibling;
    while(node){
      if(node.classList?.contains('hero'))return node;
      node=node.previousElementSibling;
    }
    return content.querySelector('.hero');
  }

  function categoryCards(grid){
    return [...grid.querySelectorAll(':scope > .card')].filter(card=>card.querySelector('[data-add-life="education"]'));
  }

  function cardKey(card){
    return card.querySelector('[data-add-life="education"]')?.dataset.lifeKey||'';
  }

  function cardLabel(card){
    return norm(card.querySelector(':scope > .toolbar h3,.toolbar h3,h3')?.textContent)||'категорию';
  }

  function isCollapsed(card){
    const key=cardKey(card);
    return !!(key&&collapsedState[key]===true);
  }

  function syncScrollbarIndicator(body,collapsed){
    if(!body)return;
    body.classList.remove('education-category-static-thumb');
    if(collapsed)return;
    requestAnimationFrame(()=>{
      if(body.hidden||!body.isConnected)return;
      const hasNativeOverflow=body.scrollHeight>body.clientHeight+1;
      body.classList.toggle('education-category-static-thumb',!hasNativeOverflow);
    });
  }

  function setCollapsed(card,value){
    const key=cardKey(card);
    if(!key)return;
    collapsedState={...collapsedState,[key]:!!value};
    writeState(collapsedState);
    syncCard(card);
  }

  function ensureToggle(card,toolbar,addButton){
    let toggle=toolbar.querySelector('[data-education-category-toggle]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='btn ghost small education-category-toggle';
      toggle.dataset.educationCategoryToggle=cardKey(card);
      addButton.insertAdjacentElement('afterend',toggle);
    }
    return toggle;
  }

  function syncCard(card){
    const toolbar=card.querySelector(':scope > .toolbar')||card.querySelector('.toolbar');
    const body=card.querySelector(':scope > .list')||card.querySelector('.list');
    const addButton=card.querySelector('[data-add-life="education"]');
    if(!toolbar||!body||!addButton||!cardKey(card))return;

    card.classList.add('education-category-card');
    toolbar.classList.add('education-category-header');
    body.classList.add('education-category-body');

    const toggle=ensureToggle(card,toolbar,addButton);
    const collapsed=isCollapsed(card);
    card.classList.toggle('education-category-collapsed',collapsed);
    card.classList.toggle('education-category-expanded',!collapsed);
    body.hidden=collapsed;
    body.setAttribute('aria-hidden',String(collapsed));
    toggle.textContent=collapsed?'Развернуть':'Свернуть';
    toggle.setAttribute('aria-expanded',String(!collapsed));
    toggle.setAttribute('aria-controls',`education-body-${cardKey(card)}`);
    toggle.setAttribute('aria-label',`${collapsed?'Развернуть':'Свернуть'} категорию ${cardLabel(card)}`);
    body.id=`education-body-${cardKey(card)}`;
    syncScrollbarIndicator(body,collapsed);
  }

  function ensureGlobalControls(){
    const hero=educationHero();
    if(!hero)return;
    let bar=hero.querySelector('.education-global-collapse-controls');
    if(!bar){
      bar=document.createElement('div');
      bar.className='education-global-collapse-controls';
      bar.innerHTML='<button type="button" class="btn ghost small" data-education-collapse-all>Свернуть все</button><button type="button" class="btn ghost small" data-education-expand-all>Развернуть все</button>';
      hero.appendChild(bar);
    }
  }

  function syncAll(){
    const grid=educationGrid();
    if(!grid)return;
    grid.classList.add('education-life-grid');
    ensureGlobalControls();
    categoryCards(grid).forEach(syncCard);
  }

  content.addEventListener('click',event=>{
    const toggle=event.target.closest('[data-education-category-toggle]');
    if(toggle){
      const card=toggle.closest('.education-category-card,.card');
      if(card?.querySelector('[data-add-life="education"]')){
        event.preventDefault();event.stopPropagation();
        setCollapsed(card,!isCollapsed(card));
      }
      return;
    }

    const collapseAll=event.target.closest('[data-education-collapse-all]');
    const expandAll=event.target.closest('[data-education-expand-all]');
    if(collapseAll||expandAll){
      const grid=educationGrid();
      if(!grid)return;
      event.preventDefault();event.stopPropagation();
      const next=!!collapseAll;
      const state={...collapsedState};
      categoryCards(grid).forEach(card=>{const key=cardKey(card);if(key)state[key]=next});
      collapsedState=state;writeState(collapsedState);
      categoryCards(grid).forEach(syncCard);
    }
  },true);

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;syncAll()});
  };
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  window.addEventListener('resize',schedule,{passive:true});
  schedule();
})();
