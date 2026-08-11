'use strict';

(function () {
  function cleanCard(card) {
    if (!card || card.closest('.modal')) return;
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
  }

  function removeRouteControls(content) {
    content.querySelectorAll('.global-collapse-controls').forEach(x => x.remove());
    content.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      if (text === 'Свернуть все' || text === 'Развернуть все') {
        const host = button.closest('.global-collapse-controls, .actions');
        if (host && host.querySelectorAll('button').length <= 2) host.remove();
        else button.remove();
      }
    });
  }

  function fixLibraryView() {
    const content = document.querySelector('#content');
    const pageTitle = document.querySelector('#pageTitle');
    if (!content || !pageTitle) return;

    const isLibrary = pageTitle.textContent.trim() === 'Библиотека';
    content.classList.toggle('library-view', isLibrary);
    if (!isLibrary) return;

    content.querySelectorAll('.card, article.card, .grid > .card').forEach(cleanCard);
    removeRouteControls(content);
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixLibraryView();
    });
  };

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();
})();
