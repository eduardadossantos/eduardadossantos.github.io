/**
 * theme.js — Modo escuro com persistência em localStorage
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-theme-v2';
  var html = document.documentElement;
  var metaTheme = document.getElementById('metaThemeColor');

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, save) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }

    if (save !== false) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) { /* ignore */ }
    }

    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0d1117' : '#1a3d5c');
    }

    document.querySelectorAll('.theme-toggle__label').forEach(function (label) {
      label.textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
    });

    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    var isDark = html.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || getSystemTheme();
    applyTheme(theme, false);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  function bindToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  }

  initTheme();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }

  window.portfolioTheme = { toggle: toggleTheme, apply: applyTheme };
})();
