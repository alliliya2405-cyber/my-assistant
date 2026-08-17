/* Task Calendar Range v1
   Renders one task across every calendar day in its date range without cloning persisted tasks.
   The task keeps one id/status/source; calendar views receive ephemeral per-day occurrences.
   A task may override start/end time for individual days via dailySchedule[YYYY-MM-DD]. */
(function(root){
  'use strict';

  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''));
  const toDate=value=>{
    if(!validDate(value))return null;
    const [y,m,d]=String(value).split('-').map(Number);
    const out=new Date(y,m-1,d,12,0,0,0);
    return Number.isNaN(out.getTime())?null:out;
  };
  const dateIso=date=>{
    if(!(date instanceof Date)||Number.isNaN(date.getTime()))return '';
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  };
  const addDays=(value,days)=>{
    const date=toDate(value);if(!date)return '';
    date.setDate(date.getDate()+Number(days||0));
    return dateIso(date);
  };
  const taskStartDate=task=>validDate(task?.date)?task.date:'';
  const taskEndDate=task=>validDate(task?.endDate)?task.endDate:taskStartDate(task);
  const normalizeRange=(start,end)=>{
    if(!validDate(start))return ['', ''];
    const safeEnd=validDate(end)&&end>=start?end:start;
    return [start,safeEnd];
  };
  const taskRange=task=>normalizeRange(taskStartDate(task),taskEndDate(task));
  const occursOn=(task,date)=>{
    if(!validDate(date))return false;
    const [start,end]=taskRange(task);
    return !!start&&date>=start&&date<=end;
  };
  const overlaps=(task,start,end)=>{
    if(!validDate(start)||!validDate(end))return false;
    const [taskStart,taskEnd]=taskRange(task);
    return !!taskStart&&taskStart<=end&&taskEnd>=start;
  };
  const minutes=value=>{
    const match=String(value||'').match(/^(\d{2}):(\d{2})$/);
    return match?Number(match[1])*60+Number(match[2]):null;
  };
  const timeOf=value=>{
    const amount=Math.max(0,Math.min(1439,Number(value)||0));
    return `${String(Math.floor(amount/60)).padStart(2,'0')}:${String(amount%60).padStart(2,'0')}`;
  };
  const derivedEnd=task=>{
    if(/^\d{2}:\d{2}$/.test(String(task?.end||'')))return task.end;
    const start=minutes(task?.start);
    if(start===null)return '';
    return timeOf(start+Math.max(0,Number(task?.duration)||0));
  };
  const dayTimes=(task,date)=>{
    const override=task?.dailySchedule&&task.dailySchedule[date];
    const start=String(override?.start||task?.start||'');
    const end=String(override?.end||derivedEnd(task)||'');
    return {start,end};
  };
  const intervalLabel=(task,date)=>{
    const {start,end}=dayTimes(task,date);
    if(start&&end)return `${start}–${end}`;
    return start||end||'';
  };
  const datesBetween=(start,end,limit=370)=>{
    const [safeStart,safeEnd]=normalizeRange(start,end);
    if(!safeStart)return [];
    const out=[];let cursor=safeStart;
    while(cursor&&cursor<=safeEnd&&out.length<limit){out.push(cursor);cursor=addDays(cursor,1)}
    return out;
  };
  const occurrence=(task,date)=>{
    if(!occursOn(task,date))return null;
    const times=dayTimes(task,date);
    return {...task,date,start:intervalLabel(task,date),end:times.end,_calendarOccurrence:true,_calendarOriginalDate:task.date,_calendarOccurrenceDate:date};
  };
  const occurrencesInRange=(tasks,start,end)=>{
    if(!validDate(start)||!validDate(end))return [];
    const out=[];
    (tasks||[]).forEach(task=>{
      if(!overlaps(task,start,end))return;
      const [taskStart,taskEnd]=taskRange(task);
      const first=taskStart<start?start:taskStart;
      const last=taskEnd>end?end:taskEnd;
      datesBetween(first,last).forEach(date=>{const item=occurrence(task,date);if(item)out.push(item)});
    });
    return out;
  };

  const api={validDate,addDays,taskStartDate,taskEndDate,taskRange,occursOn,overlaps,dayTimes,intervalLabel,datesBetween,occurrence,occurrencesInRange};
  root.TaskCalendarRange=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;

  if(typeof document==='undefined'||typeof state==='undefined')return;

  const withOccurrences=(start,end,renderFn)=>{
    const original=state.tasks;
    state.tasks=occurrencesInRange(original,start,end);
    try{return renderFn(original)}finally{state.tasks=original}
  };
  const monthBounds=()=>{
    const y=monthCursor.getFullYear(),m=monthCursor.getMonth();
    return [localDateIso(new Date(y,m,1)),localDateIso(new Date(y,m+1,0))];
  };
  const monthCellBounds=()=>{
    const y=monthCursor.getFullYear(),m=monthCursor.getMonth();
    const first=new Date(y,m,1,12),offset=(first.getDay()+6)%7;
    first.setDate(first.getDate()-offset);
    const last=new Date(first);last.setDate(first.getDate()+41);
    return [localDateIso(first),localDateIso(last)];
  };
  const uniqueInRange=(tasks,start,end)=>tasks.filter(task=>overlaps(task,start,end));
  const patchCount=(holder,selector,value)=>{const node=holder.querySelector(selector);if(node)node.textContent=String(value)};

  if(typeof renderDay==='function'){
    const baseRenderDay=renderDay;
    renderDay=function(){
      const date=localDateIso(dayCursor);
      return withOccurrences(date,date,()=>baseRenderDay());
    };
  }

  if(typeof renderWeek==='function'){
    const baseRenderWeek=renderWeek;
    renderWeek=function(){
      const ds=weekDates(),start=localDateIso(ds[0]),end=localDateIso(ds[6]);
      return withOccurrences(start,end,original=>{
        const html=baseRenderWeek();
        const holder=document.createElement('div');holder.innerHTML=html;
        const unique=uniqueInRange(original,start,end);
        const counts=[unique.length,unique.filter(t=>!t.done).length,unique.filter(t=>t.done).length,unique.filter(t=>!t.done&&(t.priority==='priority'||t.priority==='urgent')).length];
        const summary=holder.querySelector('.week-summary');
        if(summary)[...summary.children].forEach((item,index)=>{const strong=item.querySelector('strong');if(strong&&index<counts.length)strong.textContent=String(counts[index])});
        return holder.innerHTML;
      });
    };
  }

  if(typeof renderMonth==='function'){
    const baseRenderMonth=renderMonth;
    renderMonth=function(){
      const [cellStart,cellEnd]=monthCellBounds(),[monthStart,monthEnd]=monthBounds();
      return withOccurrences(cellStart,cellEnd,original=>{
        const html=baseRenderMonth();
        const holder=document.createElement('div');holder.innerHTML=html;
        const unique=uniqueInRange(original,monthStart,monthEnd);
        patchCount(holder,'[data-month-filter="all"] strong',unique.length);
        patchCount(holder,'[data-month-filter="open"] strong',unique.filter(t=>!t.done).length);
        patchCount(holder,'[data-month-filter="done"] strong',unique.filter(t=>t.done).length);
        patchCount(holder,'[data-month-filter="priority"] strong',unique.filter(t=>!t.done&&(t.priority==='priority'||t.priority==='urgent')).length);
        return holder.innerHTML;
      });
    };
  }

  setTimeout(()=>{
    if(typeof route!=='undefined'&&['day','week','month'].includes(route)&&typeof render==='function')render();
  },0);
})(typeof window!=='undefined'?window:globalThis);
