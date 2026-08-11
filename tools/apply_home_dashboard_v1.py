from pathlib import Path

app=Path('app.js')
text=app.read_text(encoding='utf-8')
start=text.find('function renderDashboard(){')
end=text.find('\n\nfunction calendarTaskCard',start)
if start<0 or end<0:
    raise SystemExit('renderDashboard boundaries not found; refusing to patch')
old=text[start:end]
if old.count('function renderDashboard()')!=1:
    raise SystemExit('Unexpected dashboard block; refusing to patch')

new=r'''function renderDashboard(){
  const todayKey=todayIso();
  const today=state.tasks.filter(t=>t.date===todayKey&&!t.done).sort((a,b)=>(a.start||'99:99').localeCompare(b.start||'99:99'));
  const overdue=state.tasks.filter(t=>!t.done&&t.date&&t.date<todayKey).sort((a,b)=>a.date.localeCompare(b.date));
  const futureMeetings=state.meetings.filter(m=>m.date>=todayKey).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  const nextMeeting=futureMeetings[0];
  const activeProjects=state.projects.map(p=>{
    const tasks=state.tasks.filter(t=>t.projectId===p.id),open=tasks.filter(t=>!t.done);
    return {project:p,open:open.length,total:tasks.length,progress:tasks.length?Math.round(tasks.filter(t=>t.done).length/tasks.length*100):0}
  }).filter(x=>x.open>0).sort((a,b)=>b.open-a.open).slice(0,3);
  const q=quoteOfDay();
  const dateLabel=new Date(todayKey+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
  const summary=today.length?`${today.length} ${today.length===1?'задача':'задачи'} на сегодня`:'На сегодня нет незавершённых задач';
  return `<section class="home-today-head">
    <div><p class="eyebrow">${esc(dateLabel)}</p><h2>Ваш день</h2><p>${summary}${overdue.length?` · ${overdue.length} просрочено`:''}</p></div>
    <button class="btn primary" data-add-task>+ Добавить задачу</button>
  </section>
  <div class="home-dashboard-grid">
    <section class="card home-today-card">
      <div class="section-title"><div><p class="eyebrow">В фокусе</p><h2>Сегодня <span class="home-count">${today.length}</span></h2></div><button class="btn ghost small" data-dashboard-filter="today">Все задачи дня</button></div>
      <div class="list">${today.slice(0,6).map(taskRow).join('')||empty('На сегодня всё разобрано')}</div>
    </section>
    <section class="card home-overdue-card">
      <div class="section-title"><div><p class="eyebrow">Не потерять</p><h2>Просрочено <span class="home-count">${overdue.length}</span></h2></div>${overdue.length?'<button class="btn ghost small" data-dashboard-filter="overdue">Показать все</button>':''}</div>
      <div class="list">${overdue.slice(0,5).map(taskRow).join('')||empty('Просроченных задач нет')}</div>
    </section>
  </div>
  <div class="home-secondary-grid">
    <section class="card home-next-card">
      <div class="section-title"><div><p class="eyebrow">По времени</p><h2>Ближайшее</h2></div><button class="btn ghost small" data-route-meetings>Совещания</button></div>
      ${nextMeeting?`<div class="home-meeting"><strong>${esc(nextMeeting.title)}</strong><span>${fmt(nextMeeting.date)} ${esc(nextMeeting.time||'')}</span>${nextMeeting.projectIds?.length?`<small>${nextMeeting.projectIds.map(id=>project(id)?.name).filter(Boolean).map(esc).join(' · ')}</small>`:''}</div>`:empty('Ближайших совещаний нет')}
      ${futureMeetings.length>1?`<p class="home-note">Ещё запланировано: ${futureMeetings.length-1}</p>`:''}
    </section>
    <section class="card home-projects-card">
      <div class="section-title"><div><p class="eyebrow">Продолжить</p><h2>Активные проекты</h2></div></div>
      <div class="home-project-list">${activeProjects.map(x=>`<div class="home-project-row"><div><strong>${esc(x.project.name)}</strong><span>${x.open} открытых задач</span></div><div class="home-project-progress"><span>${x.progress}%</span>${bar(x.progress)}</div></div>`).join('')||empty('Нет проектов с открытыми задачами')}</div>
    </section>
  </div>
  ${q?`<section class="card home-quote"><div><p class="eyebrow">Мысль дня</p><blockquote>“${esc(q.text)}”</blockquote><span>${esc(q.author||'Автор не указан')}</span></div><button class="btn ghost small" data-route-quotes>Все цитаты</button></section>`:''}`
}'''
app.write_text(text[:start]+new+text[end:],encoding='utf-8')

styles=Path('styles.css')
css=styles.read_text(encoding='utf-8')
marker='/* Home Dashboard v1 */'
if marker in css:
    raise SystemExit('Home Dashboard CSS already exists')
css += r'''

/* Home Dashboard v1 */
.home-today-head{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 22px;margin-bottom:18px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(135deg,#fff,#f5f3ff);box-shadow:var(--shadow)}.home-today-head h2{margin:3px 0 5px;font-size:28px}.home-today-head p:last-child{margin:0;color:var(--muted)}.home-dashboard-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(340px,.85fr);gap:18px}.home-dashboard-grid .section-title,.home-secondary-grid .section-title{margin:0 0 14px}.home-dashboard-grid .section-title h2,.home-secondary-grid .section-title h2{margin:2px 0 0}.home-count{display:inline-grid;place-items:center;min-width:30px;height:30px;padding:0 9px;border-radius:999px;background:#eef1f7;color:#475569;font-size:14px;vertical-align:middle}.home-overdue-card{border-color:#efe5dc;background:linear-gradient(180deg,#fff,#fffdfa)}.home-secondary-grid{display:grid;grid-template-columns:minmax(300px,.8fr) minmax(0,1.2fr);gap:18px;margin-top:18px}.home-meeting{display:grid;gap:7px;padding:16px;border-radius:14px;background:#f7f7fb}.home-meeting strong{font-size:17px}.home-meeting span,.home-meeting small,.home-note{color:var(--muted)}.home-note{margin:12px 0 0;font-size:13px}.home-project-list{display:grid;gap:10px}.home-project-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(130px,190px);align-items:center;gap:18px;padding:12px 0;border-bottom:1px solid var(--line)}.home-project-row:last-child{border-bottom:0}.home-project-row>div:first-child{display:grid;gap:4px}.home-project-row span{font-size:13px;color:var(--muted)}.home-project-progress{display:grid;gap:6px}.home-project-progress>span{text-align:right}.home-quote{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:18px;padding:16px 20px;background:#faf9ff}.home-quote blockquote{margin:5px 0 7px;font-size:17px;line-height:1.45}.home-quote>div>span{font-size:13px;color:var(--muted)}
@media(max-width:1100px){.home-dashboard-grid,.home-secondary-grid{grid-template-columns:1fr}.home-project-row{grid-template-columns:1fr minmax(120px,180px)}}
@media(max-width:680px){.home-today-head,.home-quote{align-items:flex-start;flex-direction:column}.home-today-head .btn,.home-quote .btn{width:100%}.home-project-row{grid-template-columns:1fr}.home-project-progress>span{text-align:left}}
'''
styles.write_text(css,encoding='utf-8')

index=Path('index.html')
html=index.read_text(encoding='utf-8')
if html.count('styles.css?v=18')!=1 or html.count('app.js?v=20')!=1:
    raise SystemExit('Unexpected cache versions; refusing to patch')
index.write_text(html.replace('styles.css?v=18','styles.css?v=19',1).replace('app.js?v=20','app.js?v=21',1),encoding='utf-8')
