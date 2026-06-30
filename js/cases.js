/**
 * cases.js — Filtro por categoria nos estudos de caso
 */
(function () {
  'use strict';

  var filterBtns = document.querySelectorAll('.case-filter');
  var caseCards = document.querySelectorAll('.case-card[data-category]');
  var emptyMsg = document.getElementById('casesEmpty');

  if (!filterBtns.length || !caseCards.length) return;

  function applyFilter(category) {
    var visibleCount = 0;

    caseCards.forEach(function (card) {
      var show = category === 'all' || card.getAttribute('data-category') === category;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCount++;
    });

    if (emptyMsg) {
      emptyMsg.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = this.getAttribute('data-case-filter');

      filterBtns.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      applyFilter(category);
    });
  });
})();
