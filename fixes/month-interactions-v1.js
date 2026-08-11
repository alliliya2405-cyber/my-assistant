'use strict';

(function () {
  function fixMonthScreen() {
    const workspace = document.querySelector('.month-workspace');
    if (!workspace) return;

    const calendarCard = workspace.querySelector('.month-calendar-card');
    if (calendarCard) {
      calendarCard.classList.remove('collapsible-entry', 'global-collapsed');
      calendarCard.querySelector(':scope > .global-collapse-bar')?.remove();
      Array.from(calendarCard.children).forEach(child => {
        if (child instanceof HTMLElement) child.hidden = false;
      });
    }

    const status = workspace.querySelector('.month-filter-status');
    if (status) {
      const label = status.querySelector(':scope > span');
      if (label && label.textContent.trim() === 'Все задачи' && !status.querySelector('[data-month-all-tasks]')) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'month-all-tasks-link';
        button.dataset.monthAllTasks = '1';
        button.textContent = 'Все задачи';
        label.replaceWith(button);
      }
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-month-all-tasks]');
    if (!button) return;
    event.preventDefault();
    document.querySelector('[data-route="tasks"]')?.click();
  });

  let scheduled = false;
  const scheduleFix = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixMonthScreen();
    });
  };

  const observer = new MutationObserver(scheduleFix);
  observer.observe(document.body, { childList: true, subtree: true });
  scheduleFix();
})();
