// Theme toggle. The saved theme is applied before first paint by the inline
// script in src/layouts/Base.astro (src/theme-init.js); this file is deferred.
(function () {
  var root = document.documentElement;

  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function sync() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(isDark()));
    });
  }

  sync();
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('[data-theme-toggle]')) return;
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (err) {}
    sync();
  });
})();
