'use strict';

(() => {
  const title=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  if(!title||!content)return;

  const key='reportsWorkflowCollapsed.v1';
  const read=()=>{try{return new Set(JSON.parse(localStorage.getItem(key)||'[]'))}catch{return new Set()}};
  const write=set=>localStorage.setItem(key,JSON.stringify([...set]));

  function reportId(card,index){
    const btn=card.querySelector('[data-edit-report],[data-add-report-row],[data-collect-report],[data-export-report],[data-delete-report]');
    return btn?.getAttribute('data-edit-report')||btn?.getAttribute('data-add-report-row')||btn?.getAttribute('data-collect-report')||btn?.getAttribute('data-export-report')||btn?.getAttribute('data-delete-report')||`report-${index}`;
  }

  function decorate(){
    if(title.textContent.trim()!=='Отчёты')return;
    const sourceList=content.querySelector('.report-source-list');
    if(sourceList){
      [...sourceList.querySelectorAll('.chip')].forEach(chip=>{if(chip.textContent.trim()==='Рефлексия')chip.remove()});
      const first=sourceList.querySelector('span');
      if(first)first.textContent='Источники профессиональной автоматической сборки:';
    }

    const list=content.querySelector('.reports-list');
    if(!list)return;
    if(!content.querySelector('.report-list-controls')){
      const controls=document.createElement('div');
      controls.className='toolbar report-list-controls';
      controls.innerHTML='<div><b>Документы</b><div class="item-meta">Открывайте только тот отчёт или план, с которым работаете сейчас.</div></div><div class="actions"><button class="btn ghost small" type="button" data-collapse-reports>Свернуть все</button><button class="btn ghost small" type="button" data-expand-reports>Развернуть все</button></div>';
      list.before(controls);
      controls.querySelector('[data-collapse-reports]').onclick=()=>{const collapsed=new Set();list.querySelectorAll('.report-card').forEach((card,i)=>{collapsed.add(reportId(card,i));setCollapsed(card,true)});write(collapsed)};
      controls.querySelector('[data-expand-reports]').onclick=()=>{list.querySelectorAll('.report-card').forEach(card=>setCollapsed(card,false));write(new Set())};
    }

    const collapsed=read();
    list.querySelectorAll('.report-card').forEach((card,index)=>{
      if(card.dataset.reportWorkflowReady)return;
      card.dataset.reportWorkflowReady='1';
      const id=reportId(card,index),head=card.querySelector('.report-card-header');
      if(!head)return;
      const rows=card.querySelectorAll('.report-table tbody tr').length;
      const people=card.querySelectorAll('.report-employee').length;
      const meta=head.querySelector('.item-meta');
      if(meta&&!head.querySelector('.report-workflow-counts')){
        const counts=document.createElement('div');
        counts.className='report-workflow-counts';
        counts.innerHTML=`<span>${people} сотрудник${people===1?'':'а'}</span><span>${rows} строк${rows===1?'а':rows>1&&rows<5?'и':''}</span>`;
        meta.after(counts);
      }
      if(!head.querySelector('[data-toggle-report-card]')){
        const toggle=document.createElement('button');
        toggle.type='button';toggle.className='btn ghost small report-card-toggle';toggle.setAttribute('data-toggle-report-card',id);
        const actions=head.querySelector('.report-actions');
        actions?.prepend(toggle);
        toggle.onclick=()=>{const set=read(),next=!card.classList.contains('report-collapsed');setCollapsed(card,next);next?set.add(id):set.delete(id);write(set)};
      }
      setCollapsed(card,collapsed.has(id)||index>0&&!collapsed.size);
    });
  }

  function setCollapsed(card,value){
    card.classList.toggle('report-collapsed',value);
    const head=card.querySelector('.report-card-header');
    const toggle=head?.querySelector('[data-toggle-report-card]');
    if(toggle){toggle.textContent=value?'Развернуть':'Свернуть';toggle.setAttribute('aria-expanded',String(!value))}
    [...card.children].forEach(child=>{if(child!==head)child.hidden=value});
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
