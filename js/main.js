/**
 * Manoj Kumar - Full Stack Developer Portfolio
 * ShadowFox Internship (Beginner Level)
 * Client-Side JavaScript: Theme Switcher, Mobile Navigation, Project Filter,
 * Typing Effect, Active Link Spy, & Comprehensive Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initMobileNav();
  initScrollSpy();
  initProjectFilters();
  initContactFormValidation();
  initBackToTop();
  updateCurrentYear();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light with LocalStorage Persistence)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved theme or check system preference
  const savedTheme = localStorage.getItem('manoj_portfolio_theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('manoj_portfolio_theme', nextTheme);
      showToast(`Switched to ${nextTheme.toUpperCase()} mode 🌓`);
    });
  }
}

/* ==========================================================================
   2. Typing Animation Effect for Hero Subtitle
   ========================================================================== */
function initTypingEffect() {
  const typingTarget = document.getElementById('typing-text');
  if (!typingTarget) return;

  const roles = [
    'Full Stack Developer',
    'Node.js & Express Specialist',
    'RESTful API Engineer',
    'Open Source Contributor',
    'Web3 Smart Contract Explorer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2000;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let timeoutDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      timeoutDelay = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      timeoutDelay = 300;
    }

    setTimeout(type, timeoutDelay);
  }

  type();
}

/* ==========================================================================
   3. Mobile Navigation Drawer & Backdrop
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-footer a');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   4. Scroll Spy & Active Nav Link Highlighter
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function activateLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        drawerLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', activateLink);
}

/* ==========================================================================
   5. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Contact Form Validation with Proper Client-Side Rules
   ========================================================================== */
function initContactFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('user_name');
  const emailInput = document.getElementById('user_email');
  const subjectInput = document.getElementById('user_subject');
  const messageInput = document.getElementById('user_message');
  const charCounter = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-btn');
  const successBanner = document.getElementById('form-success-banner');

  // Live Character Counter for Message
  messageInput.addEventListener('input', () => {
    const currentLength = messageInput.value.length;
    charCounter.textContent = `${currentLength} / 500`;

    if (currentLength > 500) {
      charCounter.style.color = 'var(--danger-color)';
    } else {
      charCounter.style.color = 'var(--text-muted)';
    }
    validateField(messageInput, validateMessage);
  });

  // Real-time blur and input listeners
  nameInput.addEventListener('blur', () => validateField(nameInput, validateName));
  nameInput.addEventListener('input', () => {
    if (nameInput.closest('.form-group').classList.contains('has-error')) {
      validateField(nameInput, validateName);
    }
  });

  emailInput.addEventListener('blur', () => validateField(emailInput, validateEmail));
  emailInput.addEventListener('input', () => {
    if (emailInput.closest('.form-group').classList.contains('has-error')) {
      validateField(emailInput, validateEmail);
    }
  });

  subjectInput.addEventListener('blur', () => validateField(subjectInput, validateSubject));
  subjectInput.addEventListener('input', () => {
    if (subjectInput.closest('.form-group').classList.contains('has-error')) {
      validateField(subjectInput, validateSubject);
    }
  });

  // Validation Rules
  function validateName(val) {
    val = val.trim();
    if (!val) return 'Full Name is required.';
    if (val.length < 2) return 'Name must be at least 2 characters long.';
    if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name should contain only valid letters and spaces.';
    return null;
  }

  function validateEmail(val) {
    val = val.trim();
    if (!val) return 'Email Address is required.';
    // Standard RFC-compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(val)) return 'Please provide a valid email (e.g. name@domain.com).';
    return null;
  }

  function validateSubject(val) {
    val = val.trim();
    if (!val) return 'Subject is required.';
    if (val.length < 3) return 'Subject must be at least 3 characters.';
    return null;
  }

  function validateMessage(val) {
    val = val.trim();
    if (!val) return 'Message is required.';
    if (val.length < 10) return 'Message should be at least 10 characters long.';
    if (val.length > 500) return 'Message exceeds 500 character limit.';
    return null;
  }

  // Generic Field Validator Helper
  function validateField(inputElement, validationFn) {
    const group = inputElement.closest('.form-group');
    const errorDisplay = group.querySelector('.field-error-msg');
    const errorMessage = validationFn(inputElement.value);

    if (errorMessage) {
      group.classList.add('has-error');
      group.classList.remove('is-valid');
      if (errorDisplay) errorDisplay.textContent = errorMessage;
      return false;
    } else {
      group.classList.remove('has-error');
      group.classList.add('is-valid');
      if (errorDisplay) errorDisplay.textContent = '';
      return true;
    }
  }

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, validateName);
    const isEmailValid = validateField(emailInput, validateEmail);
    const isSubjectValid = validateField(subjectInput, validateSubject);
    const isMessageValid = validateField(messageInput, validateMessage);

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (!isFormValid) {
      // Focus first error field
      const firstError = form.querySelector('.form-group.has-error input, .form-group.has-error textarea');
      if (firstError) firstError.focus();
      showToast('⚠️ Please fix the highlighted errors before submitting.');
      return;
    }

    // Submit Simulation
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Show Banner
      if (successBanner) {
        successBanner.style.display = 'flex';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      showToast('🎉 Message sent successfully! Thank you.');

      // Clear Form and Validations
      form.reset();
      charCounter.textContent = '0 / 500';
      document.querySelectorAll('.form-group').forEach(grp => {
        grp.classList.remove('is-valid', 'has-error');
      });

      // Auto hide banner after 8 seconds
      setTimeout(() => {
        if (successBanner) successBanner.style.display = 'none';
      }, 8000);
    }, 1200);
  });
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Utility: Toast Notifications
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ==========================================================================
   9. Footer Year Auto-Update
   ========================================================================== */
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
