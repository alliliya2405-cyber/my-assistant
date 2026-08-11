'use strict';

(function () {
  function fixQuotesView() {
    const content = document.querySelector('#content');
    const pageTitle = document.querySelector('#pageTitle');
    if (!content || !pageTitle) return;

    const isQuotes = pageTitle.textContent.trim() === 'Цитаты дня';
    content.classList.toggle('quotes-view', isQuotes);
    if (!isQuotes) return;

    content.querySelectorAll('#quoteList .card, .quote-card').forEach(card => {
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
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixQuotesView();
    });
  };

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();
})();
