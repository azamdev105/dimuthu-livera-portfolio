(function () {
  'use strict';

  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  const nav = document.getElementById('nav');
  let rafPending = false;

  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      rafPending = false;
    });
  }, { passive: true });

  const indicator = document.getElementById('navIndicator');
  const navLinks = document.querySelectorAll('.nav-link');

  function moveIndicator(linkEl) {
    if (!linkEl || !indicator) return;
    indicator.style.width = linkEl.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + linkEl.offsetLeft + 'px)';
  }

  setTimeout(() => {
    const active = document.querySelector('.nav-link.active');
    if (active) moveIndicator(active);
  }, 0);

  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) moveIndicator(active);
  }, { passive: true });

  function setActiveSection(id) {
    navLinks.forEach(link => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('active', isActive);
      if (isActive) moveIndicator(link);
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  }, {
    threshold: 0.4,
    rootMargin: '-72px 0px 0px 0px'
  });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.style.display = 'block';
    void mobileMenu.offsetHeight;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');

    mobileMenu.addEventListener('transitionend', function hide() {
      if (!menuOpen) mobileMenu.style.display = 'none';
      mobileMenu.removeEventListener('transitionend', hide);
    });
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (menuOpen) closeMenu(); });
  });

  document.addEventListener('click', (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput    = document.getElementById('contactName');
    const emailInput   = document.getElementById('contactEmail');
    const msgInput     = document.getElementById('contactMessage');
    const nameError    = document.getElementById('nameError');
    const emailError   = document.getElementById('emailError');
    const msgError     = document.getElementById('messageError');
    const formReset    = document.getElementById('formReset');
    const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, errorEl, msg) {
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = msg;
    }

    function clearError(input, errorEl) {
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }

    [nameInput, emailInput, msgInput].forEach((input, i) => {
      const errorEl = [nameError, emailError, msgError][i];
      input.addEventListener('input', () => clearError(input, errorEl));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      clearError(nameInput, nameError);
      clearError(emailInput, emailError);
      clearError(msgInput, msgError);

      const name  = nameInput.value.trim();
      const email = emailInput.value.trim();
      const msg   = msgInput.value.trim();

      if (!name) {
        setError(nameInput, nameError, 'Please enter your name.');
        firstInvalid = firstInvalid || nameInput;
      } else if (name.length < 2) {
        setError(nameInput, nameError, 'Name must be at least 2 characters.');
        firstInvalid = firstInvalid || nameInput;
      }

      if (!email) {
        setError(emailInput, emailError, 'Please enter your email.');
        firstInvalid = firstInvalid || emailInput;
      } else if (!emailRegex.test(email)) {
        setError(emailInput, emailError, 'Please enter a valid email address.');
        firstInvalid = firstInvalid || emailInput;
      }

      if (!msg) {
        setError(msgInput, msgError, 'Please write a message.');
        firstInvalid = firstInvalid || msgInput;
      } else if (msg.length < 10) {
        setError(msgInput, msgError, 'Message must be at least 10 characters.');
        firstInvalid = firstInvalid || msgInput;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      contactForm.classList.add('submitted');
    });

    if (formReset) {
      formReset.addEventListener('click', () => {
        contactForm.reset();
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(msgInput, msgError);
        contactForm.classList.remove('submitted');
      });
    }
  }

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = (el.dataset.revealDelay || '0') + 'ms';
      el.classList.add('visible');
      obs.unobserve(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px 150px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

})();
