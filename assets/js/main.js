// Navigation management module
const NavigationManager = {
  elements: {
    sections: null,
    mobileMenuToggle: null,
    mobileMenu: null,
    contactForm: null
  },

  init() {
    this.elements.sections = document.querySelectorAll('main > section');
    this.elements.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.elements.mobileMenu = document.getElementById('mobileMenu');
    this.elements.contactForm = document.getElementById('contactForm');

    this.bindEvents();
    this.showSection('home');
    this.setCurrentYear();
  },

  bindEvents() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (!href || !href.startsWith('#')) return; // skip if no proper href
        const targetId = href.substring(1);
        this.showSection(targetId);
        this.elements.mobileMenu.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Mobile menu toggle
    this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.elements.mobileMenuToggle.contains(e.target) && !this.elements.mobileMenu.contains(e.target)) {
        this.elements.mobileMenu.classList.add('hidden');
      }
    });
  },

  showSection(targetId) {
    this.elements.sections.forEach(section => {
      if (section.id === targetId) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  },

  toggleMobileMenu() {
    this.elements.mobileMenu.classList.toggle('hidden');
  },

  setCurrentYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
  },

  showStatusMessage(message, colorClass) {
    let statusMessage = document.getElementById('statusMessage');
    if (!statusMessage) {
      statusMessage = document.createElement('div');
      statusMessage.id = 'statusMessage';
      statusMessage.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-transform duration-300 transform-gpu z-[100]';
      document.body.appendChild(statusMessage);
    }
    statusMessage.textContent = message;
    statusMessage.className = `fixed bottom-4 left-1/2 -translate-x-1/2 py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-transform duration-300 transform-gpu z-[100] ${colorClass}`;
    statusMessage.style.transform = 'translate(-50%, 0)';
    setTimeout(() => {
      statusMessage.style.transform = 'translate(-50%, 100px)';
    }, 3000);
  }
};

// Quick access functions for tiles
const app = {
  showLatestPost() {
    BlogManager.showLatestPost();
  },

  showNextEvent() {
    NavigationManager.showSection('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showCurrentProject() {
    NavigationManager.showSection('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showContact() {
    NavigationManager.showSection('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  closePost() {
    BlogManager.closePost();
  }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavigationManager.init();
  BlogManager.init();
  BackgroundAnimation.init();
});
