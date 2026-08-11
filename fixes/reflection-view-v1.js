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

  function fixReflectionView() {
    const content = document.querySelector('#content');
    const pageTitle = document.querySelector('#pageTitle');
    if (!content || !pageTitle) return;

    const isReflection = pageTitle.textContent.trim() === 'Рефлексия';
    content.classList.toggle('reflection-view', isReflection);
    if (!isReflection) return;

    content.querySelectorAll('.card, article.card').forEach(cleanCard);
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

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixReflectionView();
    });
  };

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();
})();
