export const themeScript = `
(function() {
  try {
    var storageKey = 'vite-ui-theme';
    var theme = localStorage.getItem(storageKey);
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    if (!theme || theme === 'system') {
      if (supportDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch (e) {}
})();
`
