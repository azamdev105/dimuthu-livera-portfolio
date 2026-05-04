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

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = (el.dataset.revealDelay || '0') + 'ms';
      el.classList.add('visible');
      obs.unobserve(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px 200px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

})();
