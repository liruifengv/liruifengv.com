function sendThemeChange(themeValue) {
  window.dispatchEvent(new CustomEvent("theme-change", { detail: {themeValue} }));
}

const getThemePreference = () => {
  if (window.localStorage.getItem('theme')) {
    return window.localStorage.getItem('theme');
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

window.onload = ()=> {
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('theme-dark');
  sendThemeChange(getThemePreference());

  // Watch the document element and persist user preference when it changes.
  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.classList.contains('theme-dark');
    sendThemeChange(isDark ? 'dark' : 'light');
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  document.documentElement.classList.add('loaded');
}
