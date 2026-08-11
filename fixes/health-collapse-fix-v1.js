'use strict';

(function () {
  function fixHealthScreen() {
    const grid = document.querySelector('.health-grid');
    if (!grid) return;

    grid.querySelectorAll('.habit').forEach(card => {
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

    const content = grid.closest('#content') || document.querySelector('#content');
    if (content) {
      content.querySelectorAll('button').forEach(button => {
        const text = button.textContent.trim();
        if (text === 'Свернуть все' || text === 'Развернуть все') {
          const controls = button.closest('.global-collapse-controls, .actions');
          if (controls && controls.querySelectorAll('button').length <= 2) controls.remove();
          else button.remove();
        }
      });
    }
  }

  let scheduled = false;
  const scheduleFix = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixHealthScreen();
    });
  };

  const observer = new MutationObserver(scheduleFix);
  observer.observe(document.body, { childList: true, subtree: true });
  scheduleFix();
})();
