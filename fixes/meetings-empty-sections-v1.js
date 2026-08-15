'use strict';

/* Meetings Empty Sections v1
   Marks visually empty meeting detail sections without changing meeting data or handlers. */
(() => {
  const title = document.getElementById('pageTitle');
  const content = document.getElementById('content');
  if (!title || !content) return;

  const isMeetings = () => title.textContent.trim() === 'Совещания';

  function isEmptySection(section) {
    const clone = section.cloneNode(true);
    clone.querySelectorAll('b').forEach(node => node.remove());
    const value = clone.textContent.replace(/\s+/g, ' ').trim();
    return value === '' || value === '—' || value === '-';
  }

  function sync() {
    if (!isMeetings()) return;
    content.querySelectorAll(':scope > article.card.meeting-card > p').forEach(section => {
      section.classList.toggle('meeting-empty-section', isEmptySection(section));
    });
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

  new MutationObserver(schedule).observe(title, { childList: true, subtree: true, characterData: true });
  new MutationObserver(schedule).observe(content, { childList: true, subtree: true, characterData: true });
  schedule();
})();
