/* Task End Time v1
   Replaces the task duration input with an explicit end time while preserving duration for existing calculations. */
(function(){
  'use strict';
  if(typeof window.openTask!=='function'||typeof window.modal!=='function')return;

  const minutesOf=value=>{
    const m=String(value||'').match(/^(\d{2}):(\d{2})$/);
    return m?Number(m[1])*60+Number(m[2]):null;
  };
  const timeOf=minutes=>{
    const value=Math.max(0,Math.min(1439,Number(minutes)||0));
    return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;
  };
  const derivedEnd=task=>{
    if(task?.end)return task.end;
    const start=minutesOf(task?.start);
    if(start===null)return '';
    const duration=Math.max(0,Number(task?.duration)||0);
    return timeOf(start+duration);
  };

  window.openTask=function(t=null,preset={}){
    const fields=[
      {name:'title',label:'Продукт / задача',required:true,full:true},
      {name:'projectId',label:'Проект',type:'select',options:[['','Без проекта'],...state.projects.map(p=>[p.id,p.name])]},
      {name:'date',label:'Дата',type:'date'},
      {name:'start',label:'Время начала',type:'time'},
      {name:'end',label:'Время окончания',type:'time'},
      {name:'priority',label:'Категория',type:'select',options:[['current','Текущая'],['priority','Приоритетная'],['urgent','Срочная']]},
      {name:'sphere',label:'Сфера',type:'select',options:[['professional','Профессиональная'],['education','Образовательная'],['personal','Личная']]},
      {name:'role',label:'Роль'},
      {name:'method',label:'Метод'},
      {name:'result',label:'Ожидаемый результат',type:'textarea',full:true},
      {name:'status',label:'Статус',type:'select',options:[['planned','Запланировано'],['doing','В работе'],['review','На проверке'],['done','Выполнено']]}
    ];
    const base={date:todayIso(),start:'09:00',end:'10:00',priority:'current',sphere:'professional',status:'planned'};
    if(t)Object.assign(base,t,{end:derivedEnd(t)});
    Object.assign(base,preset);
    if(preset.start&&!Object.prototype.hasOwnProperty.call(preset,'end')){
      const s=minutesOf(preset.start);
      if(s!==null)base.end=timeOf(s+(Number(t?.duration)||60));
    }
    modal(t?'Редактировать задачу':'Новая задача',fields,o=>{
      const start=minutesOf(o.start),end=minutesOf(o.end);
      if(start!==null&&end!==null&&end<start)throw new Error('Время окончания не может быть раньше времени начала');
      o.duration=start!==null&&end!==null?end-start:0;
      o.done=o.status==='done';
      if(t){Object.assign(t,o);log('task','Изменена задача: '+t.title,t.projectId)}
      else{const nt={id:uid(),...o};state.tasks.push(nt);log('task','Создана задача: '+nt.title,nt.projectId)}
      persist('Задача сохранена');
    },base);
  };
})();
