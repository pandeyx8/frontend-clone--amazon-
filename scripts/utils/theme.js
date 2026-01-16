(function(){
  const STORAGE_KEY = 'theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function applyTheme(theme){
    const t = theme === DARK ? DARK : LIGHT;
    document.documentElement.setAttribute('data-theme', t);
    document.body.setAttribute('data-theme', t);
    updateToggleLabel(t);
  }

  function toggleTheme(){
    const current = document.body.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  function updateToggleLabel(theme){
    const toggles = document.querySelectorAll('.js-theme-toggle');
    toggles.forEach(btn => {
      btn.textContent = theme === DARK ? '☀️' : '🌙';
      btn.setAttribute('aria-pressed', theme === DARK ? 'true' : 'false');
      btn.title = theme === DARK ? 'Switch to light mode' : 'Switch to dark mode';
    });
  }

  function init(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved){
      applyTheme(saved);
    } else {
      // prefer system setting
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? DARK : LIGHT);
    }

    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.js-theme-toggle');
      if(toggle){
        toggleTheme();
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
