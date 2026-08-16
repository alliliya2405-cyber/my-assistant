'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  const isEducationScreen=()=>title.textContent.trim()==='Образование';
  const educationGroups=()=>state.education||{};
  const entryById=(key,id)=>(educationGroups()[key]||[]).find(item=>item.id===id)||null;
  const dateLabel=value=>value?(typeof fmt==='function'?fmt(value):value):'—';

  function openEducationEntry(item=null,key='courses'){
    if(typeof modal!=='function')return;
    const fields=[
      {name:'title',label:'Название',required:true,full:true},
      {name:'startDate',label:'Дата начала',type:'date'},
      {name:'endDate',label:'Дата завершения',type:'date'},
      {name:'note',label:'Заметка / результат',type:'textarea',full:true}
    ];
    const initial=item?{
      ...item,
      startDate:item.startDate||item.date||'',
      endDate:item.endDate||''
    }:{title:'',startDate:todayIso(),endDate:'',note:''};

    modal(item?'Редактировать запись образования':'Новая запись образования',fields,values=>{
      const startDate=values.startDate||'';
      const endDate=values.endDate||'';
      if(startDate&&endDate&&endDate<startDate){
        if(typeof toast==='function')toast('Дата завершения не может быть раньше даты начала');
        throw new Error('education-date-range');
      }
      const next={...values,startDate,endDate,date:startDate};
      if(item)Object.assign(item,next);
      else{
        educationGroups()[key]=educationGroups()[key]||[];
        educationGroups()[key].push({id:uid(),done:false,...next});
      }
      if(typeof syncLinkedTasks==='function')syncLinkedTasks();
      persist('Запись образования сохранена');
      render();
    },initial);
  }

  function decorateEducationDates(){
    if(!isEducationScreen())return;
    content.querySelectorAll('.life-grid .list-row').forEach(row=>{
      const edit=row.querySelector('[data-edit-life][data-life-type="education"]');
      if(!edit)return;
      const item=entryById(edit.dataset.lifeKey,edit.dataset.editLife);
      if(!item)return;
      let box=row.querySelector('.education-date-range');
      if(!box){
        box=document.createElement('div');
        box.className='education-date-range';
        const meta=row.querySelector('.item-meta');
        if(meta)meta.insertAdjacentElement('beforebegin',box);
        else row.querySelector(':scope > div')?.append(box);
      }
      box.textContent=`Начало: ${dateLabel(item.startDate||item.date)} · Завершение: ${dateLabel(item.endDate)}`;
      const meta=row.querySelector('.item-meta');
      if(meta){
        meta.textContent=item.note||'';
        meta.hidden=!item.note;
      }
    });
  }

  content.addEventListener('click',event=>{
    const add=event.target.closest('[data-add-life="education"]');
    if(add&&isEducationScreen()){
      event.preventDefault();event.stopImmediatePropagation();
      openEducationEntry(null,add.dataset.lifeKey||'courses');
      return;
    }
    const edit=event.target.closest('[data-edit-life][data-life-type="education"]');
    if(edit&&isEducationScreen()){
      event.preventDefault();event.stopImmediatePropagation();
      const item=entryById(edit.dataset.lifeKey,edit.dataset.editLife);
      if(item)openEducationEntry(item,edit.dataset.lifeKey);
    }
  },true);

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;decorateEducationDates()});
  };
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
