/* Home Daily Focus v1: dashboard hierarchy + compact upcoming meetings + quick actions. */
(function(){
  'use strict';
  const content=document.getElementById('content');
  const pageTitle=document.getElementById('pageTitle');
  if(!content||!pageTitle)return;

  const text=el=>String(el?.textContent||'').trim();
  const cardFor=el=>el?.closest('.card')||el?.closest('section')||el?.parentElement;

  function homeMeetingActions(m){
    return `<div class="home-item-actions"><button class="btn ghost small" type="button" data-home-edit-meeting="${m.id}">Изменить</button><button class="btn primary small" type="button" data-home-done-meeting="${m.id}">Готово</button></div>`;
  }

  function renderUpcomingMeetings(){
    if(text(pageTitle)!=='Главная')return;
    const card=content.querySelector('.home-next-card');
    if(!card)return;
    const today=typeof todayIso==='function'?todayIso():new Date().toISOString().slice(0,10);
    const meetings=(state.meetings||[]).filter(m=>m.date&&m.date>=today&&!m.completed).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.time||'99:99').localeCompare(b.time||'99:99'));
    const existing=card.querySelector('.home-meeting-list');
    const signature=meetings.map(m=>`${m.id}:${m.date}:${m.time||''}:${m.title}`).join('|');
    if(existing&&existing.dataset.signature===signature)return;
    card.querySelector('.home-meeting')?.remove();
    card.querySelector('.home-note')?.remove();
    existing?.remove();
    card.querySelector('.home-meeting-empty')?.remove();
    if(!meetings.length){
      const emptyBox=document.createElement('div');
      emptyBox.className='empty home-meeting-empty';
      emptyBox.textContent='Ближайших совещаний нет';
      card.append(emptyBox);
      return;
    }
    const list=document.createElement('div');
    list.className='home-meeting-list';
    list.dataset.signature=signature;
    list.innerHTML=meetings.map(m=>{
      const projects=(m.projectIds||[]).map(id=>typeof project==='function'?project(id)?.name:'').filter(Boolean);
      return `<div class="home-meeting" data-home-meeting-id="${m.id}"><div class="home-meeting-main"><strong title="${esc(m.title)}">${esc(m.title)}</strong><span>${fmt(m.date)} ${esc(m.time||'')}</span>${projects.length?`<small>${projects.map(esc).join(' · ')}</small>`:''}</div>${homeMeetingActions(m)}</div>`;
    }).join('');
    card.append(list);
  }

  function enhanceActiveProjects(){
    if(text(pageTitle)!=='Главная')return;
    const list=content.querySelector('.home-project-list');
    if(!list)return;
    const rows=[...list.querySelectorAll('.home-project-row')];
    rows.forEach(row=>{
      const name=text(row.querySelector('strong'));
      const p=(state.projects||[]).find(x=>String(x.name||'')===name);
      if(!p)return;
      if(p.status==='done'){
        row.remove();
        return;
      }
      if(row.querySelector('.home-item-actions'))return;
      const actions=document.createElement('div');
      actions.className='home-item-actions home-project-actions';
      actions.innerHTML=`<button class="btn ghost small" type="button" data-home-edit-project="${p.id}">Изменить</button><button class="btn primary small" type="button" data-home-done-project="${p.id}">Готово</button>`;
      row.append(actions);
    });
    if(!list.querySelector('.home-project-row')&&!list.querySelector('.empty')){
      list.innerHTML='<div class="empty">Нет активных проектов с открытыми задачами</div>';
    }
  }

  function bindHomeActions(){
    content.querySelectorAll('[data-home-edit-meeting]').forEach(btn=>{
      if(btn.dataset.boundHomeAction)return;
      btn.dataset.boundHomeAction='1';
      btn.addEventListener('click',e=>{e.stopPropagation();const m=(state.meetings||[]).find(x=>x.id===btn.dataset.homeEditMeeting);if(m&&typeof openMeeting==='function')openMeeting(m)});
    });
    content.querySelectorAll('[data-home-done-meeting]').forEach(btn=>{
      if(btn.dataset.boundHomeAction)return;
      btn.dataset.boundHomeAction='1';
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const m=(state.meetings||[]).find(x=>x.id===btn.dataset.homeDoneMeeting);if(!m)return;
        if(!confirm(`Отметить совещание «${m.title}» как завершённое?`))return;
        m.completed=true;m.completedAt=typeof nowStamp==='function'?nowStamp():new Date().toISOString();
        if(typeof log==='function')log('meeting','Завершено совещание: '+m.title);
        if(typeof persist==='function')persist('Совещание завершено');
        if(typeof render==='function')render();
      });
    });
    content.querySelectorAll('[data-home-edit-project]').forEach(btn=>{
      if(btn.dataset.boundHomeAction)return;
      btn.dataset.boundHomeAction='1';
      btn.addEventListener('click',e=>{e.stopPropagation();const p=typeof project==='function'?project(btn.dataset.homeEditProject):(state.projects||[]).find(x=>x.id===btn.dataset.homeEditProject);if(p&&typeof openProject==='function')openProject(p)});
    });
    content.querySelectorAll('[data-home-done-project]').forEach(btn=>{
      if(btn.dataset.boundHomeAction)return;
      btn.dataset.boundHomeAction='1';
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const p=typeof project==='function'?project(btn.dataset.homeDoneProject):(state.projects||[]).find(x=>x.id===btn.dataset.homeDoneProject);if(!p)return;
        if(!confirm(`Отметить проект «${p.name}» как завершённый? Задачи проекта останутся в системе.`))return;
        p.status='done';p.updatedAt=typeof nowStamp==='function'?nowStamp():new Date().toISOString();
        if(typeof log==='function')log('project','Завершён проект: '+p.name,p.id);
        if(typeof persist==='function')persist('Проект завершён');
        if(typeof render==='function')render();
      });
    });
  }

  function mark(){
    const isHome=text(pageTitle)==='Главная';
    document.body.classList.toggle('route-home',isHome);
    if(!isHome)return;

    content.querySelectorAll('.home-day-hero,.home-today-panel,.home-overdue-panel,.home-upcoming-panel,.home-projects-panel,.home-quote-panel')
      .forEach(el=>el.classList.remove('home-day-hero','home-today-panel','home-overdue-panel','home-upcoming-panel','home-projects-panel','home-quote-panel'));

    [...content.querySelectorAll('h1,h2,h3')].forEach(head=>{
      const label=text(head);
      const card=cardFor(head); if(!card)return;
      if(label==='Ваш день')card.classList.add('home-day-hero');
      else if(label.startsWith('Сегодня'))card.classList.add('home-today-panel');
      else if(label.startsWith('Просрочено'))card.classList.add('home-overdue-panel');
      else if(label==='Ближайшее')card.classList.add('home-upcoming-panel');
      else if(label==='Активные проекты')card.classList.add('home-projects-panel');
    });

    [...content.querySelectorAll('*')].forEach(el=>{
      if(text(el)==='МЫСЛЬ ДНЯ' || text(el)==='Мысль дня'){
        const card=cardFor(el); if(card)card.classList.add('home-quote-panel');
      }
    });
    renderUpcomingMeetings();
    enhanceActiveProjects();
    bindHomeActions();
  }

  let scheduled=false;
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;mark()});
  };
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(pageTitle,{childList:true,subtree:true,characterData:true});
  mark();
})();
