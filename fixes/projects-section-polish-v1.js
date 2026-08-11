'use strict';

(() => {
  const title = document.getElementById('pageTitle');
  const content = document.getElementById('content');
  if (!title || !content) return;

  const routeMap = {
    'Все проекты': 'route-projects',
    'Совещания': 'route-meetings',
    'Команда': 'route-team',
    'Ресурсная карта': 'route-resources',
    'Отчёты': 'route-reports'
  };
  const routeClasses = Object.values(routeMap);

  function openWorkCards() {
    const active = routeClasses.find(name => document.body.classList.contains(name));
    if (!active || active === 'route-projects') return;

    content.querySelectorAll('.global-collapse-controls,.global-collapse-bar').forEach(el => el.remove());
    content.querySelectorAll('.collapsible-entry,.global-collapsed,.universal-scroll-area').forEach(el => {
      el.classList.remove('collapsible-entry','global-collapsed','universal-scroll-area');
      el.removeAttribute('data-collapse-ready');
      if (el instanceof HTMLElement) {
        el.style.removeProperty('max-height');
        el.style.removeProperty('height');
        el.style.removeProperty('overflow');
      }
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          child.hidden = false;
          child.style.removeProperty('display');
        }
      });
    });

    if (active === 'route-meetings') {
      content.querySelectorAll(':scope > article.card').forEach(card => card.classList.add('meeting-card'));
    }
  }

  function sync() {
    routeClasses.forEach(name => document.body.classList.remove(name));
    const cls = routeMap[title.textContent.trim()];
    if (cls) document.body.classList.add(cls);
    requestAnimationFrame(openWorkCards);
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sync();
    });
  };

  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
