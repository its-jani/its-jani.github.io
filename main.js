// Theme Switcher & System Theme Detection
(function initTheme() {
  const savedTheme = localStorage.getItem('portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeColorMeta(initialTheme);
})();

function updateThemeColorMeta(theme) {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#111115' : '#f8f6f0');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  // Toggle Theme
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio_theme', newTheme);
      updateThemeColorMeta(newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  // Initialize icon state
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeIcon(currentTheme);

  // Mobile Menu Toggle
  if (menuToggleBtn && navLinksContainer) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('is-open');
      menuToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('is-open');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active Navigation on Scroll (Intersection Observer / Scroll Spy)
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Micro-interaction: Smooth Scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        if (targetId === '#home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    });
  });
});
