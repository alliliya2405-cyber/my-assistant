'use strict';

(function () {
  function fixLeisureView() {
    const content = document.querySelector('#content');
    const pageTitle = document.querySelector('#pageTitle');
    if (!content || !pageTitle) return;

    const isLeisure = pageTitle.textContent.trim() === 'Досуг';
    content.classList.toggle('leisure-view', isLeisure);
    if (!isLeisure) return;

    content.querySelectorAll('.card').forEach(card => {
      card.classList.remove('collapsible-entry', 'global-collapsed');
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

    content.querySelectorAll('.global-collapse-bar, .global-collapse-controls').forEach(x => x.remove());

    content.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      if (text === 'Свернуть все' || text === 'Развернуть все' || text === 'Свернуть' || text === 'Развернуть') {
        button.remove();
      }
    });
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixLeisureView();
    });
  };

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();
})();
