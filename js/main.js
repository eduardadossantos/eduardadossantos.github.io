/**
 * main.js — Navegação, sidebar, scroll spy e reveal
 */
(function () {
  'use strict';

  var sidebar = document.getElementById('sidebar');
  var sidebarOverlay = document.getElementById('sidebarOverlay');
  var menuToggle = document.getElementById('menuToggle');
  var mobileNavMenu = document.getElementById('mobileNavMenu');
  var avatarTrigger = document.getElementById('avatarTrigger');
  var photoLightbox = document.getElementById('photoLightbox');
  var photoFocusReturn = null;
  var navLinks = document.querySelectorAll('.sidebar__link');
  var mobileNavLinks = document.querySelectorAll('.mobile-nav__link[data-section]');
  var sections = document.querySelectorAll('section[id]');
  var revealElements = document.querySelectorAll('.reveal');
  var MOBILE_BP = 960;

  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  function getScrollOffset() {
    if (!isMobile()) return 8;
    var header = document.querySelector('.mobile-header');
    return header ? header.offsetHeight + 8 : 8;
  }

  /* ── Mobile menu ── */
  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('is-visible');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (sidebar.classList.contains('is-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (mobileNavMenu) {
    mobileNavMenu.addEventListener('click', openSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (isMobile()) closeSidebar();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    if (photoLightbox && photoLightbox.classList.contains('is-open')) {
      closePhotoLightbox();
      return;
    }

    if (sidebar && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  /* ── Photo lightbox ── */
  function openPhotoLightbox() {
    if (!photoLightbox) return;

    photoFocusReturn = document.activeElement;
    photoLightbox.classList.add('is-open');
    photoLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var closeBtn = photoLightbox.querySelector('.photo-lightbox__close');
    if (closeBtn) closeBtn.focus();
  }

  function closePhotoLightbox() {
    if (!photoLightbox) return;

    photoLightbox.classList.remove('is-open');
    photoLightbox.setAttribute('aria-hidden', 'true');

    if (sidebar && sidebar.classList.contains('is-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    if (photoFocusReturn && typeof photoFocusReturn.focus === 'function') {
      photoFocusReturn.focus();
    }
    photoFocusReturn = null;
  }

  if (avatarTrigger) {
    avatarTrigger.addEventListener('click', openPhotoLightbox);
  }

  if (photoLightbox) {
    photoLightbox.querySelectorAll('[data-photo-close]').forEach(function (el) {
      el.addEventListener('click', closePhotoLightbox);
    });
  }

  window.addEventListener('resize', function () {
    if (!isMobile()) closeSidebar();
  });

  /* ── Scroll spy ── */
  function setActiveLink(sectionId) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-section') === sectionId);
    });

    mobileNavLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-section') === sectionId);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: isMobile() ? '-20% 0px -55% 0px' : '-35% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ── Reveal on scroll ── */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Smooth scroll com offset ── */
  function scrollToSection(target) {
    var offset = getScrollOffset();
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      scrollToSection(target);
      history.pushState(null, '', targetId);
    });
  });
})();
