'use strict';

(() => {
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;

  const isEducationScreen=()=>title.textContent.trim()==='Образование';
  const isSearchScreen=()=>title.textContent.trim()==='Поиск';
  const educationGroups=()=>state.education||{};
  const entryById=(key,id)=>(educationGroups()[key]||[]).find(item=>item.id===id)||null;
  const dateLabel=value=>value?(typeof fmt==='function'?fmt(value):value):'—';
  const normalize=value=>String(value||'').trim().toLowerCase();
  const educationEntries=()=>Object.entries(educationGroups()).flatMap(([key,items])=>(items||[]).map(item=>({key,item})));

  function openEducationEntry(item=null,key='courses'){
    if(typeof modal!=='function')return;
    const fields=[
      {name:'title',label:'Название',required:true,full:true},
      {name:'startDate',label:'Дата начала',type:'date'},
      {name:'endDate',label:'Дата завершения',type:'date'},
      {name:'note',label:'Краткая заметка / результат',type:'textarea',full:true},
      {name:'writingNote',label:'Мышление письмом',type:'textarea',full:true,hint:'Фиксируйте мысли, вопросы, выводы и идеи. Текст можно будет найти через общий поиск по ключевым словам.'}
    ];
    const initial=item?{
      ...item,
      startDate:item.startDate||item.date||'',
      endDate:item.endDate||'',
      writingNote:item.writingNote||''
    }:{title:'',startDate:todayIso(),endDate:'',note:'',writingNote:''};

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

  function openWritingNote(item,key){
    if(!item||typeof modal!=='function')return;
    modal(`Заметка · ${item.title}`,[
      {name:'writingNote',label:'Мышление письмом',type:'textarea',full:true,hint:'Пишите свободно. Все слова из этой заметки участвуют в общем поиске.'}
    ],values=>{
      item.writingNote=values.writingNote||'';
      persist('Заметка образования сохранена');
      render();
    },{writingNote:item.writingNote||''});
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

      let writing=row.querySelector('.education-writing-note');
      if(!writing){
        writing=document.createElement('div');
        writing.className='education-writing-note';
        box.insertAdjacentElement('afterend',writing);
      }
      writing.innerHTML=item.writingNote?`<span>Мышление письмом</span><p>${esc(item.writingNote)}</p>`:'<span>Мышление письмом</span><p class="muted">Заметок пока нет</p>';

      const actions=row.querySelector(':scope > .actions');
      if(actions&&!actions.querySelector('[data-education-note]')){
        const button=document.createElement('button');
        button.type='button';button.className='btn ghost small';button.dataset.educationNote=item.id;button.dataset.lifeKey=edit.dataset.lifeKey;button.textContent=item.writingNote?'Заметка':'Добавить заметку';
        actions.insertBefore(button,actions.firstChild);
      }
    });
  }

  function appendEducationSearchResults(){
    if(!isSearchScreen())return;
    const input=content.querySelector('.search-input');
    const target=content.querySelector('#searchResults');
    if(!input||!target)return;
    const q=normalize(input.value);
    target.querySelectorAll('[data-education-search-result]').forEach(node=>node.remove());
    if(!q)return;
    const rows=educationEntries().filter(({item})=>normalize([item.title,item.note,item.writingNote].join(' ')).includes(q));
    rows.forEach(({key,item})=>{
      const button=document.createElement('button');
      button.type='button';button.className='list-row search-result education-search-result';button.dataset.educationSearchResult=item.id;button.dataset.lifeKey=key;
      const excerpt=item.writingNote||item.note||'';
      button.innerHTML=`<div><span class="chip">Образование</span><div class="item-title">${esc(item.title)}</div><div class="item-meta">${esc(excerpt)}</div></div><span aria-hidden="true">→</span>`;
      target.append(button);
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
      return;
    }
    const note=event.target.closest('[data-education-note]');
    if(note&&isEducationScreen()){
      event.preventDefault();event.stopImmediatePropagation();
      const item=entryById(note.dataset.lifeKey,note.dataset.educationNote);
      if(item)openWritingNote(item,note.dataset.lifeKey);
      return;
    }
    const result=event.target.closest('[data-education-search-result]');
    if(result&&isSearchScreen()){
      event.preventDefault();event.stopImmediatePropagation();
      const itemId=result.dataset.educationSearchResult,key=result.dataset.lifeKey;
      route='education';sessionStorage.setItem('myAssistant.route',route);render();
      requestAnimationFrame(()=>{
        const edit=content.querySelector(`[data-edit-life="${itemId}"][data-life-key="${key}"]`);
        const row=edit?.closest('.list-row');
        row?.scrollIntoView({behavior:'smooth',block:'center'});
        row?.classList.add('education-search-highlight');
        setTimeout(()=>row?.classList.remove('education-search-highlight'),2200);
      });
    }
  },true);

  content.addEventListener('input',event=>{
    if(isSearchScreen()&&event.target.matches('.search-input'))setTimeout(appendEducationSearchResults,0);
  },true);

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      decorateEducationDates();
      if(isSearchScreen())appendEducationSearchResults();
    });
  };
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  schedule();
})();
