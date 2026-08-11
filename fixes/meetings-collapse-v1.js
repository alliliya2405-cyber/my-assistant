'use strict';

/* Meetings Collapse v1
   Adds dedicated per-meeting collapse without touching meeting data or handlers. */
(() => {
  const title = document.getElementById('pageTitle');
  const content = document.getElementById('content');
  if (!title || !content) return;

  const isMeetings = () => title.textContent.trim() === 'Совещания';

  function setCollapsed(card, collapsed) {
    card.classList.toggle('meeting-is-collapsed', collapsed);
    const btn = card.querySelector('.meeting-collapse-toggle');
    if (btn) {
      btn.textContent = collapsed ? 'Развернуть' : 'Свернуть';
      btn.setAttribute('aria-expanded', String(!collapsed));
    }
  }

  function enhanceCard(card) {
    if (card.dataset.meetingCollapseReady === '1') return;
    const header = card.querySelector(':scope > .toolbar');
    const actions = header?.querySelector('.actions');
    if (!header || !actions) return;

    card.dataset.meetingCollapseReady = '1';
    const edit = actions.querySelector('[data-edit-meeting]');
    const meetingId = edit?.getAttribute('data-edit-meeting') || '';
    if (meetingId) card.dataset.meetingCollapseId = meetingId;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'btn ghost small meeting-collapse-toggle';
    toggle.textContent = 'Свернуть';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.addEventListener('click', () => setCollapsed(card, !card.classList.contains('meeting-is-collapsed')));
    actions.prepend(toggle);
  }

  function ensureGlobalControls(cards) {
    let controls = content.querySelector('.meeting-collapse-controls');
    if (!cards.length) {
      controls?.remove();
      return;
    }
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'meeting-collapse-controls';
      controls.innerHTML = '<button type="button" class="btn ghost small" data-collapse-all-meetings>Свернуть все</button><button type="button" class="btn ghost small" data-expand-all-meetings>Развернуть все</button>';
      const topToolbar = content.querySelector(':scope > .toolbar:first-child');
      if (topToolbar) topToolbar.insertAdjacentElement('afterend', controls);
      else content.prepend(controls);

      controls.querySelector('[data-collapse-all-meetings]')?.addEventListener('click', () => {
        content.querySelectorAll(':scope > article.card.meeting-card').forEach(card => setCollapsed(card, true));
      });
      controls.querySelector('[data-expand-all-meetings]')?.addEventListener('click', () => {
        content.querySelectorAll(':scope > article.card.meeting-card').forEach(card => setCollapsed(card, false));
      });
    }
  }

  function sync() {
    if (!isMeetings()) return;
    const cards = [...content.querySelectorAll(':scope > article.card')];
    cards.forEach(card => {
      card.classList.add('meeting-card');
      enhanceCard(card);
    });
    ensureGlobalControls(cards);
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
  new MutationObserver(schedule).observe(content, { childList: true, subtree: true });
  schedule();
})();
