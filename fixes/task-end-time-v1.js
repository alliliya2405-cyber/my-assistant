/* Task End Time v2
   Uses explicit start/end dates and start/end times while preserving duration compatibility.
   If the user does not edit the end date, it follows the start date automatically.
   Multi-day tasks can override working hours for individual calendar days. */
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
  const taskEndDate=task=>task?.endDate||task?.date||todayIso();
  const cloneSchedule=value=>{
    try{return JSON.parse(JSON.stringify(value||{}))}catch{return{}}
  };
  const rangeDates=(start,end)=>{
    if(typeof window.TaskCalendarRange?.datesBetween==='function')return window.TaskCalendarRange.datesBetween(start,end);
    if(!start||!end||end<start)return [];
    const out=[],cursor=new Date(`${start}T12:00:00`),last=new Date(`${end}T12:00:00`);
    while(cursor<=last&&out.length<370){out.push(localDateIso(cursor));cursor.setDate(cursor.getDate()+1)}
    return out;
  };

  window.openTask=function(t=null,preset={}){
    const fields=[
      {name:'title',label:'Продукт / задача',required:true,full:true},
      {name:'projectId',label:'Проект',type:'select',options:[['','Без проекта'],...state.projects.map(p=>[p.id,p.name])]},
      {name:'date',label:'Дата начала',type:'date'},
      {name:'endDate',label:'Дата окончания',type:'date'},
      {name:'start',label:'Время начала',type:'time'},
      {name:'end',label:'Время окончания',type:'time'},
      {name:'priority',label:'Категория',type:'select',options:[['current','Текущая'],['priority','Приоритетная'],['urgent','Срочная']]},
      {name:'sphere',label:'Сфера',type:'select',options:[['professional','Профессиональное'],['education','Образовательное'],['personal','Личное']]},
      {name:'role',label:'Роль'},
      {name:'method',label:'Метод'},
      {name:'result',label:'Ожидаемый результат',type:'textarea',full:true},
      {name:'status',label:'Статус',type:'select',options:[['planned','Запланировано'],['doing','В работе'],['review','На проверке'],['done','Выполнено']]}
    ];
    const base={date:todayIso(),endDate:todayIso(),start:'09:00',end:'10:00',priority:'current',sphere:'professional',status:'planned'};
    if(t)Object.assign(base,t,{endDate:taskEndDate(t),end:derivedEnd(t),sphere:typeof window.taskSphereCanonical==='function'?window.taskSphereCanonical(t.sphere):t.sphere});
    Object.assign(base,preset);
    if(preset.date&&!Object.prototype.hasOwnProperty.call(preset,'endDate'))base.endDate=preset.date;
    if(preset.start&&!Object.prototype.hasOwnProperty.call(preset,'end')){
      const s=minutesOf(preset.start);
      if(s!==null)base.end=timeOf(s+(Number(t?.duration)||60));
    }

    let draftSchedule=cloneSchedule(t?.dailySchedule);
    let scheduleRead=()=>({schedule:{},error:''});

    modal(t?'Редактировать задачу':'Новая задача',fields,o=>{
      if(!o.endDate)o.endDate=o.date;
      if(o.date&&o.endDate&&o.endDate<o.date)throw new Error('Дата окончания не может быть раньше даты начала');
      const start=minutesOf(o.start),end=minutesOf(o.end);
      if(start!==null&&end!==null&&end<start)throw new Error('Время окончания не может быть раньше времени начала');
      const scheduleResult=scheduleRead();
      if(scheduleResult.error)throw new Error(scheduleResult.error);
      o.dailySchedule=scheduleResult.schedule;
      o.duration=start!==null&&end!==null?end-start:Math.max(0,Number(t?.duration)||0);
      o.sphere=typeof window.taskSphereCanonical==='function'?window.taskSphereCanonical(o.sphere):o.sphere;
      o.done=o.status==='done';
      if(t){Object.assign(t,o);log('task','Изменена задача: '+t.title,t.projectId)}
      else{const nt={id:uid(),...o};state.tasks.push(nt);log('task','Создана задача: '+nt.title,nt.projectId)}
      persist('Задача сохранена');
    },base);

    const form=document.getElementById('modalForm');
    const startDate=form?.elements?.date;
    const endDate=form?.elements?.endDate;
    const startTime=form?.elements?.start;
    const endTime=form?.elements?.end;
    const grid=form?.querySelector('.form-grid');
    if(!form||!startDate||!endDate||!startTime||!endTime||!grid)return;

    let endDateEdited=!!(t?.endDate||Object.prototype.hasOwnProperty.call(preset,'endDate'));
    const host=document.createElement('section');
    host.className='task-daily-schedule field full';
    host.setAttribute('aria-label','Расписание задачи по дням');
    grid.append(host);

    const defaultTimes=()=>({start:startTime.value||'',end:endTime.value||''});
    const currentDates=()=>rangeDates(startDate.value,endDate.value||startDate.value);
    const trimScheduleToRange=()=>{
      const allowed=new Set(currentDates());
      Object.keys(draftSchedule).forEach(date=>{if(!allowed.has(date))delete draftSchedule[date]});
    };
    const displayDate=date=>typeof fmt==='function'?fmt(date):date;

    function renderSchedule(){
      trimScheduleToRange();
      const dates=currentDates(),defaults=defaultTimes();
      if(dates.length<=1){host.hidden=true;host.innerHTML='';return}
      host.hidden=false;
      host.innerHTML=`<div class="task-daily-schedule-head"><div><strong>Расписание по дням</strong><p>По умолчанию используется ${esc(defaults.start||'—')}–${esc(defaults.end||'—')}. При необходимости измените часы отдельного дня.</p></div><span class="chip">${dates.length} дней</span></div><div class="task-daily-schedule-list">${dates.map(date=>{
        const override=draftSchedule[date]||{},s=override.start||defaults.start,e=override.end||defaults.end;
        return `<div class="task-daily-schedule-row" data-task-schedule-row="${date}"><span class="task-daily-schedule-date">${esc(displayDate(date))}</span><label>Начало<input type="time" data-task-schedule-start="${date}" value="${esc(s)}"></label><label>Окончание<input type="time" data-task-schedule-end="${date}" value="${esc(e)}"></label><button type="button" class="btn ghost small" data-task-schedule-reset="${date}" ${override.start||override.end?'':'disabled'}>По умолчанию</button></div>`;
      }).join('')}</div>`;
    }

    const syncOverride=date=>{
      const row=host.querySelector(`[data-task-schedule-row="${date}"]`);if(!row)return;
      const s=row.querySelector('[data-task-schedule-start]')?.value||'';
      const e=row.querySelector('[data-task-schedule-end]')?.value||'';
      const defaults=defaultTimes();
      if(s===defaults.start&&e===defaults.end)delete draftSchedule[date];
      else draftSchedule[date]={start:s,end:e};
      const reset=row.querySelector('[data-task-schedule-reset]');if(reset)reset.disabled=!draftSchedule[date];
    };

    host.addEventListener('input',event=>{
      const input=event.target.closest('[data-task-schedule-start],[data-task-schedule-end]');
      if(input)syncOverride(input.dataset.taskScheduleStart||input.dataset.taskScheduleEnd);
    });
    host.addEventListener('click',event=>{
      const reset=event.target.closest('[data-task-schedule-reset]');if(!reset)return;
      event.preventDefault();delete draftSchedule[reset.dataset.taskScheduleReset];renderSchedule();
    });

    scheduleRead=()=>{
      const schedule={};
      for(const date of currentDates()){
        const row=host.querySelector(`[data-task-schedule-row="${date}"]`);
        const defaults=defaultTimes();
        const s=row?.querySelector('[data-task-schedule-start]')?.value||draftSchedule[date]?.start||defaults.start;
        const e=row?.querySelector('[data-task-schedule-end]')?.value||draftSchedule[date]?.end||defaults.end;
        const sm=minutesOf(s),em=minutesOf(e);
        if(sm!==null&&em!==null&&em<sm)return {schedule:{},error:`В расписании на ${displayDate(date)} время окончания раньше времени начала`};
        if(s!==defaults.start||e!==defaults.end)schedule[date]={start:s,end:e};
      }
      return {schedule,error:''};
    };

    endDate.addEventListener('input',()=>{endDateEdited=true;renderSchedule()});
    startDate.addEventListener('input',()=>{if(!endDateEdited)endDate.value=startDate.value;renderSchedule()});
    startTime.addEventListener('input',renderSchedule);
    endTime.addEventListener('input',renderSchedule);
    renderSchedule();
  };
})();
