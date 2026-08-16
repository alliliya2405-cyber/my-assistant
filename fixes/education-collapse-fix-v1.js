'use strict';

(function () {
  const content=document.querySelector('#content');
  const title=document.querySelector('#pageTitle');
  if(!content||!title)return;

  const isEducation=()=>title.textContent.trim()==='Образование';
  const settings=()=>{state.settings=state.settings||{};state.settings.educationCollapsedCategories=state.settings.educationCollapsedCategories||{};return state.settings.educationCollapsedCategories};
  const categoryKey=(card,index)=>{
    const heading=card.querySelector('h2,h3,.section-title,.card-title');
    const label=(heading?.textContent||`category-${index}`).trim().replace(/\s+/g,' ');
    return label.toLowerCase();
  };

  function setCollapsed(card,key,collapsed){
    card.classList.toggle('education-category-collapsed',collapsed);
    const body=card.querySelector('.education-category-scroll');
    if(body)body.hidden=collapsed;
    const button=card.querySelector('[data-education-collapse]');
    if(button){
      button.textContent=collapsed?'Развернуть':'Свернуть';
      button.setAttribute('aria-expanded',String(!collapsed));
    }
    settings()[key]=collapsed;
  }

  function ensureGlobalControls(grid){
    if(content.querySelector('.education-category-global-controls'))return;
    const controls=document.createElement('div');
    controls.className='education-category-global-controls';
    controls.innerHTML='<button class="btn ghost small" type="button" data-education-collapse-all>Свернуть все</button><button class="btn ghost small" type="button" data-education-expand-all>Развернуть все</button>';
    grid.insertAdjacentElement('beforebegin',controls);
    controls.querySelector('[data-education-collapse-all]').onclick=()=>{
      grid.querySelectorAll(':scope > .card').forEach((card,index)=>setCollapsed(card,categoryKey(card,index),true));
      persist('Категории образования свернуты');
    };
    controls.querySelector('[data-education-expand-all]').onclick=()=>{
      grid.querySelectorAll(':scope > .card').forEach((card,index)=>setCollapsed(card,categoryKey(card,index),false));
      persist('Категории образования развернуты');
    };
  }

  function enhanceCard(card,index){
    if(card.dataset.educationScrollReady==='1')return;
    card.dataset.educationScrollReady='1';
    card.classList.add('education-category-card');

    const key=categoryKey(card,index);
    let header=card.querySelector(':scope > .section-title, :scope > .card-head, :scope > header');
    if(!header){
      header=document.createElement('div');
      header.className='education-category-header';
      const heading=card.querySelector(':scope > h2, :scope > h3');
      if(heading)header.append(heading);
      card.prepend(header);
    } else header.classList.add('education-category-header');

    let toggle=header.querySelector('[data-education-collapse]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';toggle.className='btn ghost small';toggle.dataset.educationCollapse=key;
      header.append(toggle);
    }

    const body=document.createElement('div');
    body.className='education-category-scroll';
    const movable=[...card.children].filter(node=>node!==header&&!(node.matches&&node.matches('.education-category-scroll')));
    movable.forEach(node=>body.append(node));
    card.append(body);

    toggle.onclick=()=>{
      const next=!card.classList.contains('education-category-collapsed');
      setCollapsed(card,key,next);
      persist(next?'Категория свернута':'Категория развернута');
    };
    setCollapsed(card,key,settings()[key]===true);
  }

  function enhance(){
    if(!isEducation())return;
    const grid=content.querySelector('.life-grid');
    if(!grid)return;
    grid.classList.add('education-life-grid');
    ensureGlobalControls(grid);
    grid.querySelectorAll(':scope > .card').forEach(enhanceCard);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
