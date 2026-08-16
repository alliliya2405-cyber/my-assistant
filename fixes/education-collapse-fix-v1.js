'use strict';

(() => {
  const content=document.getElementById('content');
  if(!content)return;

  const collapsed=new Map();
  const norm=v=>String(v||'').trim();

  function educationGrid(){
    const grids=[...content.querySelectorAll('.life-grid')];
    return grids.find(grid=>grid.querySelector('[data-add-life="education"]'))||null;
  }

  function categoryCards(grid){
    return [...grid.querySelectorAll(':scope > .card')].filter(card=>card.querySelector('[data-add-life="education"]'));
  }

  function cardKey(card){
    const button=card.querySelector('[data-add-life="education"]');
    return button?.dataset.lifeKey||norm(card.querySelector('.toolbar h3,h3')?.textContent)||String([...card.parentElement.children].indexOf(card));
  }

  function cardLabel(card){
    return norm(card.querySelector('.toolbar h3,h3')?.textContent)||'категорию';
  }

  function applyCard(card){
    const key=cardKey(card);
    const label=cardLabel(card);
    const toolbar=card.querySelector(':scope > .toolbar')||card.querySelector('.toolbar');
    const body=card.querySelector(':scope > .list')||card.querySelector('.list');
    const addButton=card.querySelector('[data-add-life="education"]');
    if(!toolbar||!body||!addButton)return;

    card.classList.add('education-category-card');
    toolbar.classList.add('education-category-header');
    body.classList.add('education-category-body');

    let toggle=toolbar.querySelector('[data-education-category-toggle]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='btn ghost small education-category-toggle';
      toggle.dataset.educationCategoryToggle=key;
      addButton.insertAdjacentElement('afterend',toggle);
      toggle.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        collapsed.set(key,!collapsed.get(key));
        applyCard(card);
      });
    }

    const isCollapsed=collapsed.get(key)===true;
    card.classList.toggle('education-category-collapsed',isCollapsed);
    card.classList.toggle('education-category-expanded',!isCollapsed);
    body.hidden=isCollapsed;
    toggle.textContent=isCollapsed?'Развернуть':'Свернуть';
    toggle.setAttribute('aria-expanded',String(!isCollapsed));
    toggle.setAttribute('aria-label',`${isCollapsed?'Развернуть':'Свернуть'} категорию ${label}`);
  }

  function ensureGlobalControls(grid){
    let bar=grid.previousElementSibling;
    if(!bar?.classList?.contains('education-global-collapse-controls')){
      bar=document.createElement('div');
      bar.className='education-global-collapse-controls';
      bar.innerHTML='<button type="button" class="btn ghost small" data-education-collapse-all>Свернуть все</button><button type="button" class="btn ghost small" data-education-expand-all>Развернуть все</button>';
      grid.insertAdjacentElement('beforebegin',bar);
      bar.querySelector('[data-education-collapse-all]').addEventListener('click',()=>{
        categoryCards(grid).forEach(card=>collapsed.set(cardKey(card),true));
        enhance();
      });
      bar.querySelector('[data-education-expand-all]').addEventListener('click',()=>{
        categoryCards(grid).forEach(card=>collapsed.set(cardKey(card),false));
        enhance();
      });
    }
  }

  function enhance(){
    const grid=educationGrid();
    if(!grid)return;
    grid.classList.add('education-life-grid');
    ensureGlobalControls(grid);
    categoryCards(grid).forEach(applyCard);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
