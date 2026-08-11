/* More section final polish v1
   Route markers only. No data or business-logic changes. */
(() => {
  const title = document.getElementById('pageTitle');
  const content = document.getElementById('content');
  if (!title || !content) return;

  const routeClasses = ['route-history', 'route-templates', 'route-calendar'];

  const sync = () => {
    const text = title.textContent.trim();
    routeClasses.forEach(name => document.body.classList.remove(name));
    if (text === 'Хронология') document.body.classList.add('route-history');
    if (text === 'Настройки и шаблоны') document.body.classList.add('route-templates');
    if (text === 'Обмен календарём') document.body.classList.add('route-calendar');
  };

  new MutationObserver(sync).observe(title, { childList: true, subtree: true, characterData: true });
  new MutationObserver(sync).observe(content, { childList: true, subtree: false });
  sync();
})();
