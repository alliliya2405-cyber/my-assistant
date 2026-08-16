'use strict';

(() => {
  const title=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  if(!title||!content)return;

  const collapsed=new Map();
  const norm=v=>String(v||'').trim();

  function isEducation(){return norm(title.textContent)==='Образование'}

  function categoryTitle(card){
    const candidates=[...card.querySelectorAll('h2,h3,h4,strong,b')];
    return candidates.find(el=>norm(el.textContent))||null;
  }

  function headerFor(card,titleNode,addButton){
    if(addButton){
      let node=addButton.parentElement;
      while(node&&node!==card){
        if(node.contains(titleNode))return node;
        node=node.parentElement;
      }
    }
    const direct=[...card.children].find(el=>el.contains(titleNode));
    return direct||titleNode;
  }

  function applyCard(card){
    const titleNode=categoryTitle(card);
    if(!titleNode)return;
    const key=norm(titleNode.textContent);
    if(!key)return;

    card.classList.add('education-category-card');
    card.dataset.educationCategory=key;

    const addButton=[...card.querySelectorAll('button')].find(btn=>/\+?\s*запись/i.test(norm(btn.textContent)));
    const header=headerFor(card,titleNode,addButton);
    if(header instanceof HTMLElement)header.classList.add('education-category-header');

    let toggle=card.querySelector('[data-education-category-toggle]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='btn ghost small education-category-toggle';
      toggle.dataset.educationCategoryToggle=key;
      toggle.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        collapsed.set(key,!collapsed.get(key));
        applyCard(card);
      });
      if(addButton) addButton.insertAdjacentElement('afterend',toggle);
      else if(header instanceof HTMLElement) header.appendChild(toggle);
      else card.prepend(toggle);
    }

    const direct=[...card.children];
    direct.forEach(child=>{
      if(child===header||child===toggle||child.contains(toggle)||child.contains(titleNode)||child.contains(addButton)){
        child.classList.remove('education-category-body-part');
      }else{
        child.classList.add('education-category-body-part');
      }
    });

    const isCollapsed=collapsed.get(key)===true;
    card.classList.toggle('education-category-collapsed',isCollapsed);
    card.classList.toggle('education-category-expanded',!isCollapsed);
    toggle.textContent=isCollapsed?'Развернуть':'Свернуть';
    toggle.setAttribute('aria-expanded',String(!isCollapsed));
    toggle.setAttribute('aria-label',`${isCollapsed?'Развернуть':'Свернуть'} категорию ${key}`);
    card.querySelectorAll(':scope > .education-category-body-part').forEach(part=>{part.hidden=isCollapsed});
  }

  function ensureGlobalControls(grid){
    let bar=content.querySelector('.education-global-collapse-controls');
    if(!bar){
      bar=document.createElement('div');
      bar.className='education-global-collapse-controls';
      bar.innerHTML='<button type="button" class="btn ghost small" data-education-collapse-all>Свернуть все</button><button type="button" class="btn ghost small" data-education-expand-all>Развернуть все</button>';
      grid.insertAdjacentElement('beforebegin',bar);
      bar.querySelector('[data-education-collapse-all]').addEventListener('click',()=>{
        grid.querySelectorAll(':scope > .card').forEach(card=>{const node=categoryTitle(card);if(node)collapsed.set(norm(node.textContent),true)});
        enhance();
      });
      bar.querySelector('[data-education-expand-all]').addEventListener('click',()=>{
        grid.querySelectorAll(':scope > .card').forEach(card=>{const node=categoryTitle(card);if(node)collapsed.set(norm(node.textContent),false)});
        enhance();
      });
    }
  }

  function enhance(){
    if(!isEducation())return;
    const grid=content.querySelector('.life-grid');
    if(!grid)return;
    grid.classList.add('education-life-grid');
    ensureGlobalControls(grid);
    grid.querySelectorAll(':scope > .card').forEach(applyCard);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
