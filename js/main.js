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
      'nav.enterPlatform': 'Enter Platform Experience',
      'hero.eyebrow': 'Private enterprise advisory',
      'hero.tagline': 'Operational excellence, engineered with elegance.',
      'hero.ctaPrimary': 'Plan a strategic consultation',
      'hero.ctaSecondary': 'View our work',
      'selector.eyebrow': 'Platform ecosystem',
      'selector.title': 'State-of-the-art multi-platform selector',
      'selector.intro': 'Discover our flagship delivery environments engineered for strategic control, precision execution, and operational dominance.',
      'selector.operisLabel': 'Operis platform',
      'selector.operisText': 'Enterprise-grade orchestration for product acceleration, architecture modernization, and board-level delivery visibility.',
      'selector.operisCta': 'Enter Operis →',
      'selector.astraLabel': 'Astra platform',
      'selector.astraText': 'Operational command layer designed for continuity, elite support response, and precision service governance.',
      'selector.astraCta': 'Enter Astra →',
      'selector.scLabel': 'Ascentra SC consultancy',
      'selector.scText': 'High-consequence strategic counsel for executives managing transformation, portfolio choices, and market power plays.',
      'selector.scCta': 'Enter Consultancy →',
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
      'nav.enterPlatform': 'Ga naar Platform Experience',
      'hero.eyebrow': 'Private enterprise advisory',
      'hero.tagline': 'Operationele excellentie, ontworpen met elegantie.',
      'hero.ctaPrimary': 'Plan een strategisch overleg',
      'hero.ctaSecondary': 'Bekijk ons werk',
      'selector.eyebrow': 'Platform ecosysteem',
      'selector.title': 'State-of-the-art multi-platform selector',
      'selector.intro': 'Ontdek onze toonaangevende platformen voor strategische controle, nauwkeurige uitvoering en operationeel overwicht.',
      'selector.operisLabel': 'Operis platform',
      'selector.operisText': 'Enterprise-grade orchestration voor productversnelling, architectuurmodernisering en board-level leveringsinzicht.',
      'selector.operisCta': 'Naar Operis →',
      'selector.astraLabel': 'Astra platform',
      'selector.astraText': 'Operationele commandolaag voor continuïteit, elite supportrespons en nauwkeurige service-governance.',
      'selector.astraCta': 'Naar Astra →',
      'selector.scLabel': 'Ascentra SC consultancy',
      'selector.scText': 'Strategisch advies voor executives die transformaties, portfolio-keuzes en marktpositie aansturen.',
      'selector.scCta': 'Naar Consultancy →',
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

  document.querySelectorAll('.platform-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
})();
