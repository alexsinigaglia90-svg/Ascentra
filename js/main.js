(function () {
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.platform': 'Platform',
      'nav.sc': 'SC Consultancy',
      'nav.dev': 'Development',
      'nav.ops': 'Operational Support',
      'nav.work': 'Our Work',
      'nav.login': 'Client log in',
      'nav.contact': 'Contact',
      'hero.eyebrow': 'Private enterprise advisory',
      'hero.tagline': 'Operational excellence, engineered with elegance.',
      'hero.ctaPrimary': 'Plan a strategic consultation',
      'hero.ctaSecondary': 'View our work',
      'footer': '© Ascentra. Private advisory and enterprise delivery.'
    },
    nl: {
      'nav.home': 'Home',
      'nav.platform': 'Platform',
      'nav.sc': 'SC Consultancy',
      'nav.dev': 'Development',
      'nav.ops': 'Operationele Ondersteuning',
      'nav.work': 'Ons Werk',
      'nav.login': 'Client login',
      'nav.contact': 'Contact',
      'hero.eyebrow': 'Private enterprise advisory',
      'hero.tagline': 'Operationele excellentie, ontworpen met elegantie.',
      'hero.ctaPrimary': 'Plan een strategisch overleg',
      'hero.ctaSecondary': 'Bekijk ons werk',
      'footer': '© Ascentra. Private advisory en enterprise delivery.'
    }
  };

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });

  function setActive(selector, key, value) {
    document.querySelectorAll(selector).forEach((button) => {
      button.classList.toggle('is-active', button.dataset[key] === value);
    });
  }

  function applyLanguage(lang) {
    const table = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (table[key]) el.textContent = table[key];
    });
    localStorage.setItem('ascentraLang', lang);
    setActive('.ui-lang', 'lang', lang);
  }

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem('ascentraTheme', theme);
    setActive('.ui-theme', 'theme', theme);
  }

  function applyPalette(palette) {
    document.body.dataset.palette = palette;
    localStorage.setItem('ascentraPalette', palette);
    setActive('.ui-palette', 'palette', palette);
  }

  const savedLang = localStorage.getItem('ascentraLang') || 'en';
  const savedTheme = localStorage.getItem('ascentraTheme') || 'dark';
  const savedPalette = localStorage.getItem('ascentraPalette') || 'royal';

  document.querySelectorAll('.ui-lang').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
  document.querySelectorAll('.ui-theme').forEach((button) => button.addEventListener('click', () => applyTheme(button.dataset.theme)));
  document.querySelectorAll('.ui-palette').forEach((button) => button.addEventListener('click', () => applyPalette(button.dataset.palette)));

  applyLanguage(savedLang);
  applyTheme(savedTheme);
  applyPalette(savedPalette);

  const splash = document.getElementById('splashscreen');
  if (splash) {
    document.body.classList.add('splash-active');
    requestAnimationFrame(() => splash.classList.add('show'));
    setTimeout(() => {
      splash.classList.add('hide');
      document.body.classList.remove('splash-active');
    }, 1800);
  }
})();
