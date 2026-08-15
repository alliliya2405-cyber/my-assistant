/* Home Daily Focus v1: add stable visual hooks without changing dashboard data or actions. */
(function(){
  'use strict';
  const content=document.getElementById('content');
  const pageTitle=document.getElementById('pageTitle');
  if(!content||!pageTitle)return;

  const text=el=>String(el?.textContent||'').trim();
  const cardFor=el=>el?.closest('.card')||el?.closest('section')||el?.parentElement;

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
  }

  new MutationObserver(mark).observe(content,{childList:true,subtree:true});
  new MutationObserver(mark).observe(pageTitle,{childList:true,subtree:true,characterData:true});
  mark();
})();
