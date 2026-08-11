/* Search View v1
   Adds a route-local class without changing search logic. */
(() => {
  const content = document.getElementById('content');
  const title = document.getElementById('pageTitle');
  if (!content || !title) return;

  const sync = () => {
    const isSearch = title.textContent.trim() === 'Поиск';
    content.classList.toggle('search-view', isSearch);
  };

  new MutationObserver(sync).observe(title, { childList: true, subtree: true, characterData: true });
  new MutationObserver(sync).observe(content, { childList: true, subtree: false });
  sync();
})();
