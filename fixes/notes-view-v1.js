'use strict';

(function () {
  function fixNotesView() {
    const content = document.querySelector('#content');
    const pageTitle = document.querySelector('#pageTitle');
    if (!content || !pageTitle) return;

    const isNotes = pageTitle.textContent.trim() === 'Заметки';
    content.classList.toggle('notes-view', isNotes);
    if (!isNotes) return;

    content.querySelectorAll('.grid.cols-2 > .card').forEach(card => {
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

    content.querySelectorAll('.global-collapse-controls').forEach(x => x.remove());
    content.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      if (text === 'Свернуть все' || text === 'Развернуть все') button.remove();
    });
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixNotesView();
    });
  };

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();
})();
