/* More section final polish v1
   Route-local UI cleanup only. No data or business-logic changes. */
(() => {
  const title = document.getElementById('pageTitle');
  const content = document.getElementById('content');
  if (!title || !content) return;

  const routeClasses = ['route-history', 'route-templates', 'route-calendar'];

  const uncollapse = root => {
    root.querySelectorAll('.timeline-item, article.card, section.card, .grid > .card, .content > .card').forEach(card => {
      if (card.closest('.modal')) return;
      card.classList.remove('collapsible-entry', 'global-collapsed', 'universal-scroll-area');
      card.removeAttribute('data-collapse-ready');
      card.querySelectorAll('.global-collapse-bar').forEach(x => x.remove());
      card.style.removeProperty('max-height');
      card.style.removeProperty('height');
      card.style.removeProperty('overflow');
      Array.from(card.children).forEach(child => {
        if (child instanceof HTMLElement) {
          child.hidden = false;
          child.style.removeProperty('display');
        }
      });
    });

    root.querySelectorAll('.global-collapse-controls').forEach(x => x.remove());
    root.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      if (text !== 'Свернуть все' && text !== 'Развернуть все') return;
      const host = button.closest('.global-collapse-controls, .actions');
      if (host && host.querySelectorAll('button').length <= 2) host.remove();
      else button.remove();
    });
  };

  const sync = () => {
    const text = title.textContent.trim();
    routeClasses.forEach(name => document.body.classList.remove(name));
    const isHistory = text === 'Хронология';
    const isTemplates = text === 'Настройки и шаблоны';
    const isCalendar = text === 'Обмен календарём';
    if (isHistory) document.body.classList.add('route-history');
    if (isTemplates) document.body.classList.add('route-templates');
    if (isCalendar) document.body.classList.add('route-calendar');
    if (isHistory || isTemplates || isCalendar) uncollapse(content);
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sync();
    });
  };

  new MutationObserver(schedule).observe(title, { childList: true, subtree: true, characterData: true });
  new MutationObserver(schedule).observe(content, { childList: true, subtree: true });
  schedule();
})();
