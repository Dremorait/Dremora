// Theme: follows prefers-color-scheme until the visitor picks one with the toggle.
// Loaded as a tiny blocking script in <head> so the page never flashes the wrong theme.
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (e) {}

  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function sync() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(isDark()));
    });
  }

  document.addEventListener('DOMContentLoaded', sync);
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('[data-theme-toggle]')) return;
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (err) {}
    sync();
  });
})();
