'use strict';

(function () {
  function fixMonthScreen() {
    const workspace = document.querySelector('.month-workspace');
    if (!workspace) return;

    const calendarCard = workspace.querySelector('.month-calendar-card');
    if (calendarCard) {
      calendarCard.classList.remove('collapsible-entry', 'global-collapsed');
      calendarCard.querySelectorAll('.global-collapse-bar').forEach(x => x.remove());
      calendarCard.style.removeProperty('max-height');
      calendarCard.style.removeProperty('height');
      calendarCard.style.removeProperty('overflow');
      Array.from(calendarCard.children).forEach(child => {
        if (child instanceof HTMLElement) {
          child.hidden = false;
          child.style.removeProperty('display');
        }
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
        button.setAttribute('aria-label', 'Открыть раздел со всеми задачами');
        label.replaceWith(button);
      }
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-month-all-tasks]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    route = 'tasks';
    sessionStorage.setItem('myAssistant.route', route);
    document.body.classList.remove('menu-open');
    render();
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
