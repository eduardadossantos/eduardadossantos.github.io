/**
 * dashboard.js — Gráficos Chart.js, tabela NCM e filtros interativos
 */
(function () {
  'use strict';

  var ncmData = [
    { codigo: 'CMP-0041', componente: 'Eixo Transmissão Ø45', material: 'Aço SAE 1045', ncmAtrib: '8483.40.90', ncmEsp: '8483.40.90', status: 'conforme' },
    { codigo: 'CMP-0087', componente: 'Carcaça Redutora', material: 'Ferro Fundido GG25', ncmAtrib: '8483.40.90', ncmEsp: '8483.40.90', status: 'conforme' },
    { codigo: 'CMP-0112', componente: 'Mancal Rolamento 6205', material: 'Aço Cromado', ncmAtrib: '8482.10.00', ncmEsp: '8482.10.00', status: 'conforme' },
    { codigo: 'CMP-0156', componente: 'Vedação Hidráulica TC', material: 'Borracha NBR', ncmAtrib: '4016.93.00', ncmEsp: '8484.20.00', status: 'divergente' },
    { codigo: 'CMP-0203', componente: 'Flange Acoplamento', material: 'Aço Inox 304', ncmAtrib: '7307.91.00', ncmEsp: '7307.91.00', status: 'conforme' },
    { codigo: 'CMP-0234', componente: 'Tampa Proteção Motor', material: 'Polímero ABS', ncmAtrib: '3926.90.90', ncmEsp: '3926.90.90', status: 'conforme' },
    { codigo: 'CMP-0278', componente: 'Parafuso Allen M12', material: 'Aço Classe 8.8', ncmAtrib: '7318.15.00', ncmEsp: '7318.15.00', status: 'conforme' },
    { codigo: 'CMP-0312', componente: 'Engrenagem Cilíndrica Z36', material: 'Aço SAE 8620', ncmAtrib: '8483.90.00', ncmEsp: '8483.40.90', status: 'revisao' },
    { codigo: 'CMP-0345', componente: 'Cilindro Hidráulico 100x50', material: 'Aço Trefilado', ncmAtrib: '8412.21.10', ncmEsp: '8412.21.10', status: 'conforme' },
    { codigo: 'CMP-0389', componente: 'Sensor Indutivo M18', material: 'Aço/Inox', ncmAtrib: '8536.50.90', ncmEsp: '9031.80.99', status: 'divergente' },
    { codigo: 'CMP-0412', componente: 'Correia Dentada HTD 8M', material: 'Neoprene+Fibra', ncmAtrib: '4010.39.00', ncmEsp: '4010.39.00', status: 'conforme' },
    { codigo: 'CMP-0456', componente: 'Polia Motora Ø200', material: 'Alumínio 6061', ncmAtrib: '8483.50.90', ncmEsp: '8483.50.90', status: 'conforme' },
    { codigo: 'CMP-0489', componente: 'Chaveta Woodruff 808', material: 'Aço SAE 1045', ncmAtrib: '7318.24.00', ncmEsp: '7318.24.00', status: 'conforme' },
    { codigo: 'CMP-0523', componente: 'Retentor Eixo Principal', material: 'Viton + Aço', ncmAtrib: '8484.20.00', ncmEsp: '8484.20.00', status: 'revisao' },
    { codigo: 'CMP-0567', componente: 'Suporte Fixação Base', material: 'Aço Carbono', ncmAtrib: '7308.90.00', ncmEsp: '7308.90.00', status: 'conforme' }
  ];

  var statusLabels = {
    conforme: { text: 'Conforme', class: 'ncm-status--ok' },
    revisao: { text: 'Revisão', class: 'ncm-status--review' },
    divergente: { text: 'Divergente', class: 'ncm-status--error' }
  };

  var filterMap = {
    all: null,
    conforme: 'conforme',
    revisao: 'revisao',
    divergente: 'divergente'
  };

  var currentFilter = 'all';
  var chartConformidade = null;
  var chartEvolucao = null;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function destroyCharts() {
    if (chartConformidade) {
      chartConformidade.destroy();
      chartConformidade = null;
    }
    if (chartEvolucao) {
      chartEvolucao.destroy();
      chartEvolucao = null;
    }
  }

  /* ── Render NCM table ── */
  function renderTable(filter) {
    var tbody = document.getElementById('ncmTableBody');
    if (!tbody) return;

    var statusFilter = filterMap[filter];
    var filtered = statusFilter
      ? ncmData.filter(function (row) { return row.status === statusFilter; })
      : ncmData;

    tbody.innerHTML = filtered.map(function (row) {
      var status = statusLabels[row.status];
      return (
        '<tr data-status="' + row.status + '">' +
          '<td>' + row.codigo + '</td>' +
          '<td>' + row.componente + '</td>' +
          '<td>' + row.material + '</td>' +
          '<td>' + row.ncmAtrib + '</td>' +
          '<td>' + row.ncmEsp + '</td>' +
          '<td><span class="ncm-status ' + status.class + '">' + status.text + '</span></td>' +
        '</tr>'
      );
    }).join('');
  }

  /* ── Filter buttons ── */
  function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = this.getAttribute('data-filter');

        filterBtns.forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        renderTable(currentFilter);
        updateKPIs(currentFilter);
      });
    });
  }

  /* ── Update KPIs based on filter ── */
  function updateKPIs(filter) {
    var statusFilter = filterMap[filter];
    var data = statusFilter
      ? ncmData.filter(function (r) { return r.status === statusFilter; })
      : ncmData;

    var total = filter === 'all' ? 847 : data.length;
    var conformes = filter === 'all' ? 798 : data.filter(function (r) { return r.status === 'conforme'; }).length;
    var revisao = data.filter(function (r) { return r.status === 'revisao'; }).length;
    var divergente = data.filter(function (r) { return r.status === 'divergente'; }).length;

    var elTotal = document.getElementById('kpiTotal');
    var elConf = document.getElementById('kpiConformidade');
    var elRev = document.getElementById('kpiRevisao');
    var elDiv = document.getElementById('kpiDivergente');

    if (elTotal) elTotal.textContent = total;
    if (elConf) elConf.textContent = filter === 'all' ? '94,2%' : Math.round((conformes / data.length) * 100) + '%';
    if (elRev) elRev.textContent = filter === 'all' ? 38 : revisao;
    if (elDiv) elDiv.textContent = filter === 'all' ? 11 : divergente;
  }

  /* ── Chart.js initialization ── */
  function initCharts() {
    if (typeof Chart === 'undefined') return;

    destroyCharts();

    var accentColor = cssVar('--color-accent') || '#1a3d5c';
    var accentLight = cssVar('--color-accent-light') || '#e8eef3';
    var successColor = cssVar('--color-success') || '#2d6a4f';
    var warningColor = cssVar('--color-warning') || '#9a6700';
    var problemColor = cssVar('--color-problem') || '#7d2e2e';
    var textMuted = cssVar('--color-text-muted') || '#5c6670';
    var borderColor = cssVar('--color-border') || '#dde2e8';
    var gridColor = cssVar('--color-bg-muted') || '#eef1f4';

    Chart.defaults.font.family = "'IBM Plex Mono', monospace";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = textMuted;

    /* Bar chart — conformidade por família */
    var ctxBar = document.getElementById('chartConformidade');
    if (ctxBar) {
      chartConformidade = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Transmissão', 'Hidráulica', 'Fixação', 'Vedação', 'Sensores', 'Estrutural'],
          datasets: [
            {
              label: 'Conformes',
              data: [142, 98, 156, 87, 64, 251],
              backgroundColor: successColor,
              borderRadius: 3,
              barPercentage: 0.7
            },
            {
              label: 'Em Revisão',
              data: [8, 12, 5, 9, 3, 1],
              backgroundColor: warningColor,
              borderRadius: 3,
              barPercentage: 0.7
            },
            {
              label: 'Divergentes',
              data: [2, 4, 1, 3, 1, 0],
              backgroundColor: problemColor,
              borderRadius: 3,
              barPercentage: 0.7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, padding: 16, font: { size: 10 } }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              border: { color: borderColor }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: gridColor },
              border: { color: borderColor }
            }
          }
        }
      });
    }

    /* Line chart — evolução de divergências */
    var ctxLine = document.getElementById('chartEvolucao');
    if (ctxLine) {
      chartEvolucao = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Divergências',
              data: [89, 72, 54, 38, 22, 11],
              borderColor: accentColor,
              backgroundColor: accentLight,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: accentColor,
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              border: { color: borderColor }
            },
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              border: { color: borderColor }
            }
          }
        }
      });
    }
  }

  /* ── Init on DOM ready ── */
  function init() {
    renderTable('all');
    initFilters();
    initCharts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('themechange', function () {
    setTimeout(initCharts, 50);
  });
})();
