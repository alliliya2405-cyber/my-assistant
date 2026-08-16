'use strict';

(() => {
  const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
  const canonicalSphere=value=>{
    const v=normalize(value);
    if(['professional','профессиональное','профессиональная','projects','проекты'].includes(v))return 'professional';
    if(['education','educational','образование','образовательное','образовательная'].includes(v))return 'education';
    if(['personal','личное','личная','health','здоровье','leisure','досуг'].includes(v))return 'personal';
    return value||'';
  };

  function isHealthTask(task){
    return Boolean(task?.generatedByHealth||task?.healthHabitId||['health','здоровье'].includes(normalize(task?.sphere)));
  }
  function isLeisureTask(task){
    const source=normalize(task?.linkedSourceType||task?.sourceType||task?.source||'');
    return source==='leisure'||source==='досуг'||Boolean(task?.leisureId);
  }
  function migrate(){
    let changed=false;
    (state.tasks||[]).forEach(task=>{
      let next=canonicalSphere(task.sphere);
      if(isHealthTask(task)||isLeisureTask(task))next='personal';
      if(next&&task.sphere!==next){task.sphere=next;changed=true;}
    });
    if(changed&&typeof persist==='function')persist('Сферы задач приведены к единому формату');
  }

  window.taskSphereCanonical=canonicalSphere;
  window.taskMatchesCanonicalArea=(task,area)=>{
    if(area==='all')return true;
    const sphere=canonicalSphere(task?.sphere);
    if(area==='professional')return Boolean(task?.projectId)||sphere==='professional';
    if(area==='education')return task?.linkedSourceType==='education'||sphere==='education';
    if(area==='personal')return isHealthTask(task)||isLeisureTask(task)||sphere==='personal';
    return true;
  };

  migrate();
})();
