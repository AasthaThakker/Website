// Theme management module
const ThemeManager = {
  elements: {
    themeToggle: null,
    mobileThemeToggle: null,
    body: null
  },

  init() {
    this.elements.themeToggle = document.getElementById('themeToggle');
    this.elements.mobileThemeToggle = document.getElementById('mobileThemeToggle');
    this.elements.body = document.body;

    this.setInitialTheme();
    this.bindEvents();
  },

  bindEvents() {
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.elements.mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
  },

  setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Remove any existing theme classes
    this.elements.body.classList.remove('light-theme', 'dark-theme');
    this.elements.body.classList.add(`${savedTheme}-theme`);
    this.updateThemeIcon(savedTheme);
  },

  toggleTheme() {
    const isLight = this.elements.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';

    this.elements.body.classList.remove(`${isLight ? 'light' : 'dark'}-theme`);
    this.elements.body.classList.add(`${newTheme}-theme`);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  },

  updateThemeIcon(theme) {
    const toggleElements = [
      { icon: '.light-icon', label: '.light-label' },
      { icon: '.dark-icon', label: '.dark-label' }
    ];
    const mobileToggleElements = [
      { icon: '.mobile-light-icon', label: '.mobile-light-label' },
      { icon: '.mobile-dark-icon', label: '.mobile-dark-label' }
    ];

    const setVisibility = (el, visible) => {
      if (!el) return;
      el.classList.toggle('hidden', !visible);
      el.classList.toggle('visible', visible);
    };

    toggleElements.forEach((el, idx) => {
      const isDark = theme === 'dark';
      setVisibility(this.elements.themeToggle.querySelector(el.icon), idx === +isDark);
      setVisibility(this.elements.themeToggle.querySelector(el.label), idx === +isDark);
    });

    mobileToggleElements.forEach((el, idx) => {
      const isDark = theme === 'dark';
      setVisibility(this.elements.mobileThemeToggle.querySelector(el.icon), idx === +isDark);
      setVisibility(this.elements.mobileThemeToggle.querySelector(el.label), idx === +isDark);
    });
  }
};
