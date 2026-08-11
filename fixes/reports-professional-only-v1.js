/* Reports: automatic collection must contain professional work only. */
(function(){
  'use strict';
  let activeReportId='';

  function isProfessionalProject(p){
    return !!p && (p.areas||[]).some(a=>String(a).trim().toLowerCase()==='профессиональное');
  }
  function professionalProjectIds(){return new Set((state.projects||[]).filter(isProfessionalProject).map(p=>p.id));}
  function professionalTask(t,projectIds){return String(t.sphere||'').toLowerCase()==='professional' && (!t.projectId || projectIds.has(t.projectId));}
  function linkedToProfessionalProject(item,projectIds){return !!item.projectId && projectIds.has(item.projectId);}

  document.addEventListener('click',function(e){
    const button=e.target.closest('[data-collect-report],[data-collect-current-report]');
    if(!button)return;
    activeReportId=button.dataset.collectReport || state.reports?.[0]?.id || '';
  },true);

  document.addEventListener('submit',function(e){
    const form=e.target,modalEl=form&&form.closest('.modal');
    if(modalEl?.querySelector('h2')?.textContent?.trim()!=='Собрать единый документ')return;
    e.preventDefault();e.stopImmediatePropagation();

    const fd=new FormData(form),employee=String(fd.get('employee')||'').trim(),period=String(fd.get('period')||'').trim();
    const sources=fd.getAll('sources').length?fd.getAll('sources'):['tasks','assignments','meetings','projects'];
    const replace=String(fd.get('replace')||'append'),errorEl=form.querySelector('.form-error');
    if(!/^\d{4}-\d{2}$/.test(period)){if(errorEl)errorEl.textContent='Укажите месяц в формате ГГГГ-ММ';return;}
    const doc=(state.reports||[]).find(d=>d.id===activeReportId);
    if(!doc){if(errorEl)errorEl.textContent='Не удалось определить текущий документ';return;}

    if(replace==='replace')doc.rows=doc.rows.filter(r=>String(r.employee||'').toLowerCase()!==employee.toLowerCase());
    const bucket=new Map();
    const add=(projectName,activity,plan,result,minutes=0)=>{const key=projectName||'Профессиональная деятельность';if(!bucket.has(key))bucket.set(key,{project:key,activities:new Set(),plans:[],results:[],minutes:0});const b=bucket.get(key);if(activity)b.activities.add(activity);if(plan)b.plans.push(plan);if(result)b.results.push(result);b.minutes+=Number(minutes)||0;};
    const pids=professionalProjectIds();

    if(sources.includes('tasks'))state.tasks.filter(t=>String(t.date||'').startsWith(period)&&professionalTask(t,pids)).forEach(t=>add(project(t.projectId)?.name||'Профессиональная деятельность',t.method||t.role||'Работа по проекту',t.title,(doc.type==='report'&&(t.done||t.status==='done'))?(t.result||t.title):'',t.duration));
    if(sources.includes('assignments'))state.assignments.filter(a=>String(a.deadline||'').startsWith(period)&&linkedToProfessionalProject(a,pids)&&(String(a.assignee||'').toLowerCase()===employee.toLowerCase()||employee.toLowerCase()==='я')).forEach(a=>add(project(a.projectId)?.name||'Профессиональная деятельность','Поручение / техническое задание',a.title,(doc.type==='report'&&a.status==='done')?(a.criteria||a.title):'',60));
    if(sources.includes('meetings'))state.meetings.filter(m=>String(m.date||'').startsWith(period)&&(!m.participants||m.participants.toLowerCase().includes(employee.toLowerCase())||employee.toLowerCase()==='я')).forEach(m=>(m.projectIds||[]).filter(id=>pids.has(id)).forEach(id=>add(project(id)?.name||'Профессиональная деятельность','Совещание',m.agenda||m.title,doc.type==='report'?(m.decisions||m.notes||''):'',60)));
    if(sources.includes('projects'))state.projects.filter(isProfessionalProject).forEach(p=>{const active=(p.start||'').slice(0,7)<=period&&(!(p.end)||(p.end||'').slice(0,7)>=period);if(!active)return;add(p.name,'Управление проектом',p.goal||p.meaning,doc.type==='report'?(p.status==='done'?'Проект завершён':'Работа продолжается'):'',0);(p.sprints||[]).filter(sp=>String(sp.start||'').startsWith(period)||String(sp.end||'').startsWith(period)).forEach(sp=>add(p.name,'Спринт',sp.goal||sp.name,doc.type==='report'?(sp.artifact||''):'',0));(p.subprojects||[]).forEach(sub=>(sub.sprints||[]).filter(sp=>String(sp.start||'').startsWith(period)||String(sp.end||'').startsWith(period)).forEach(sp=>add(p.name,`Подпроект: ${sub.name}`,sp.goal||sp.name,doc.type==='report'?(sp.artifact||''):'',0)));});
    /* Reflections are deliberately excluded: they have no professional/personal sphere marker. */

    const total=[...bucket.values()].reduce((sum,b)=>sum+b.minutes,0);
    bucket.forEach(b=>doc.rows.push({id:uid(),employee,project:b.project,activity:[...b.activities].join('\n'),plan:b.plans.filter(Boolean).join('\n'),result:doc.type==='report'?b.results.filter(Boolean).join('\n'):'',time:total&&b.minutes?`${Math.round(b.minutes/total*100)}%`:''}));
    doc.updatedAt=nowStamp();$('#modalRoot').innerHTML='';persist(`Собрано профессиональных строк: ${bucket.size}`);render();
  },true);
})();
