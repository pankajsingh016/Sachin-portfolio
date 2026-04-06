/**
 * Renders pages/excel_data.html from data/excel-data.json (loaded by theme-loader).
 */
(function () {
  'use strict';

  function escapeHtml(s) {
    if (s == null) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  function isSpendBar(bg) {
    const b = String(bg || '').toLowerCase().replace(/\s/g, '');
    return b === '#2a2a2e' || b.includes('2a2a2e');
  }

  function renderHeader(h) {
    const meta = (h.meta || [])
      .map(
        (m) =>
          '<div class="excel-cs-meta-item"><strong>' +
          escapeHtml(m.label) +
          '</strong>' +
          escapeHtml(m.value) +
          '</div>'
      )
      .join('');
    return (
      '<div class="excel-cs-header excel-reveal">' +
      '<div class="excel-cs-eyebrow">' +
      escapeHtml(h.eyebrow) +
      '</div>' +
      '<h1 class="excel-cs-title">' +
      (h.titleHtml || '') +
      '</h1>' +
      '<p class="excel-cs-sub">' +
      escapeHtml(h.intro) +
      '</p>' +
      '<div class="excel-cs-meta">' +
      meta +
      '</div></div>'
    );
  }

  function renderMetricsBoxes(boxes) {
    const inner = (boxes || [])
      .map((b) => {
        const neg =
          b.change && String(b.change).trim().startsWith('↓') ? ' neg' : '';
        return (
          '<div class="excel-hm-box">' +
          '<div class="excel-hm-label">' +
          escapeHtml(b.label) +
          '</div>' +
          '<div class="excel-hm-val">' +
          escapeHtml(b.value) +
          '</div>' +
          '<div class="excel-hm-change' +
          neg +
          '">' +
          escapeHtml(b.change) +
          '</div>' +
          '<div class="excel-hm-base">' +
          escapeHtml(b.base) +
          '</div></div>'
        );
      })
      .join('');
    return '<div class="excel-hero-metrics excel-reveal">' + inner + '</div>';
  }

  function renderJourney(j) {
    const steps = (j.steps || [])
      .map((s) => {
        return (
          '<div class="excel-journey-step ' +
          escapeHtml(s.stepClass) +
          '">' +
          '<div class="excel-js-dot">' +
          escapeHtml(s.dot) +
          '</div>' +
          '<div class="excel-js-month">' +
          escapeHtml(s.month) +
          '</div>' +
          '<div class="excel-js-rev">' +
          escapeHtml(s.rev) +
          '</div>' +
          '<div class="excel-js-tag">' +
          escapeHtml(s.tag) +
          '</div>' +
          '<div><span class="excel-js-badge ' +
          escapeHtml(s.badgeClass) +
          '">' +
          escapeHtml(s.badge) +
          '</span></div></div>'
        );
      })
      .join('');
    return (
      '<div class="excel-journey-section excel-reveal">' +
      '<div class="excel-sec-label">' +
      escapeHtml(j.sectionLabel) +
      '</div>' +
      '<div class="excel-journey-grid">' +
      steps +
      '</div></div>'
    );
  }

  function renderChannelAugust(c) {
    const rows = (c.rows || [])
      .map((r) => {
        const color = r.color ? escapeHtml(r.color) : 'var(--accent)';
        return (
          '<div class="excel-ch-row">' +
          '<div class="excel-ch-head"><span class="excel-ch-name">' +
          escapeHtml(r.name) +
          '</span><span class="excel-ch-val">' +
          escapeHtml(r.val) +
          '</span></div>' +
          '<div class="excel-ch-bar-wrap"><div class="excel-ch-bar" style="width:0%;background:' +
          color +
          '" data-w="' +
          escapeHtml(r.w) +
          '"></div></div>' +
          '<div class="excel-ch-bar-meta"><span>' +
          escapeHtml(r.left) +
          '</span><span>' +
          escapeHtml(r.right) +
          '</span></div></div>'
        );
      })
      .join('');
    return (
      '<div class="excel-col-panel">' +
      '<div class="excel-sec-label">' +
      escapeHtml(c.sectionLabel) +
      '</div>' +
      '<div class="excel-channel-bars">' +
      rows +
      '</div>' +
      '<div class="excel-channel-totals">' +
      '<div class="excel-channel-totals-row">' +
      '<span class="excel-channel-totals-k">' +
      escapeHtml(c.totalRevenueLabel) +
      '</span>' +
      '<span class="excel-channel-totals-rev">' +
      escapeHtml(c.totalRevenue) +
      '</span></div>' +
      '<div class="excel-channel-totals-row">' +
      '<span class="excel-channel-totals-k">' +
      escapeHtml(c.totalSpendLabel) +
      '</span>' +
      '<span class="excel-channel-totals-spend">' +
      escapeHtml(c.totalSpend) +
      '</span></div></div></div>'
    );
  }

  function renderMonthlyTable(mt) {
    const cols = (mt.columns || [])
      .map((col) => '<th>' + escapeHtml(col) + '</th>')
      .join('');
    const body = (mt.rows || [])
      .map((r) => {
        return (
          '<tr>' +
          '<td><div class="excel-td-month">' +
          escapeHtml(r.month) +
          '</div><div class="' +
          escapeHtml(r.subClass) +
          '">' +
          escapeHtml(r.sub) +
          '</div></td>' +
          '<td class="excel-td-rev">' +
          escapeHtml(r.rev) +
          '</td>' +
          '<td class="excel-td-num">' +
          escapeHtml(r.spend) +
          '</td>' +
          '<td class="excel-td-num">' +
          escapeHtml(r.orders) +
          '</td>' +
          '<td class="excel-td-num">' +
          escapeHtml(r.cpa) +
          '</td>' +
          '<td class="excel-td-roas ' +
          escapeHtml(r.roasClass) +
          '">' +
          escapeHtml(r.roas) +
          '</td></tr>'
        );
      })
      .join('');
    return (
      '<div class="excel-col-panel">' +
      '<div class="excel-sec-label">' +
      escapeHtml(mt.sectionLabel) +
      '</div>' +
      '<table class="excel-metrics-table"><thead><tr>' +
      cols +
      '</tr></thead><tbody>' +
      body +
      '</tbody></table>' +
      '<div class="excel-table-note">' +
      escapeHtml(mt.note) +
      '</div></div>'
    );
  }

  function renderChartBarFill(bar) {
    const bg = bar.bg || '#2a2a2e';
    const tip = escapeHtml(bar.tip);
    const h = escapeHtml(bar.h);
    const radius = isSpendBar(bg) ? '' : ' border-radius:3px 3px 0 0;';
    return (
      '<div class="excel-bar-fill" style="height:0;background:' +
      bg +
      ';min-height:' +
      (isSpendBar(bg) ? '4px' : '0') +
      ';' +
      radius +
      '" data-h="' +
      h +
      '"><div class="excel-bar-tip">' +
      tip +
      '</div></div>'
    );
  }

  function renderChartMonth(m) {
    const bars = m.bars || [];
    let inner = '';
    if (bars.length === 1) {
      const b0 = bars[0];
      inner =
        '<div class="excel-bar-stack" style="height:100%">' +
        '<div style="height:calc(100% - ' +
        escapeHtml(b0.h) +
        ')"></div>' +
        renderChartBarFill(b0) +
        '</div>';
    } else {
      inner =
        '<div class="excel-bar-group-inner">' +
        bars.map(renderChartBarFill).join('') +
        '</div>';
    }
    return (
      '<div class="excel-bar-group">' +
      inner +
      '<div class="excel-bar-label">' +
      escapeHtml(m.label) +
      '</div></div>'
    );
  }

  function renderChart(ch) {
    const groups = (ch.months || []).map(renderChartMonth).join('');
    return (
      '<div class="excel-chart-section excel-reveal">' +
      '<div class="excel-sec-label">' +
      escapeHtml(ch.sectionLabel) +
      '</div>' +
      '<div class="excel-chart-wrap">' +
      '<div class="excel-chart-bars">' +
      groups +
      '</div>' +
      '<div class="excel-chart-legend">' +
      '<div class="excel-legend-item"><div class="excel-legend-dot" style="background:var(--accent)"></div>' +
      escapeHtml(ch.legendRevenue) +
      '</div>' +
      '<div class="excel-legend-item"><div class="excel-legend-dot" style="background:' +
      '#2a2a2e;border:1px solid #444"></div>' +
      escapeHtml(ch.legendSpend) +
      '</div></div></div></div>'
    );
  }

  function renderGeoRow(row) {
    return (
      '<tr>' +
      '<td class="excel-geo-rank">' +
      escapeHtml(row[0]) +
      '</td>' +
      '<td class="excel-geo-name">' +
      escapeHtml(row[1]) +
      '</td>' +
      '<td class="excel-geo-orders">' +
      escapeHtml(row[2]) +
      '</td>' +
      '<td class="excel-geo-val">' +
      escapeHtml(row[3]) +
      '</td></tr>'
    );
  }

  function renderGeoTable(title, rows) {
    const body = (rows || []).map(renderGeoRow).join('');
    return (
      '<div>' +
      '<div class="excel-geo-table-title">' +
      escapeHtml(title) +
      '</div>' +
      '<table class="excel-geo-table">' +
      '<tr><th>#</th><th>' +
      (title.indexOf('Cities') >= 0 ? 'City' : 'State') +
      '</th><th style="text-align:right">Orders</th><th style="text-align:right">Revenue</th></tr>' +
      body +
      '</table></div>'
    );
  }

  function renderGeo(g) {
    return (
      '<div class="excel-geo-section excel-reveal">' +
      '<div class="excel-sec-label">' +
      escapeHtml(g.sectionLabel) +
      '</div>' +
      '<div class="excel-geo-grid">' +
      renderGeoTable(g.citiesTitle, g.cities) +
      renderGeoTable(g.statesTitle, g.states) +
      '</div></div>'
    );
  }

  function renderTimeline(tl) {
    const cards = (tl.cards || [])
      .map((c) => {
        const items = (c.items || [])
          .map(
            (text) =>
              '<div class="excel-tl-item"><div class="excel-tl-dot"></div><span>' +
              escapeHtml(text) +
              '</span></div>'
          )
          .join('');
        return (
          '<div class="excel-tl-card">' +
          '<div class="excel-tl-phase">' +
          escapeHtml(c.phase) +
          '</div>' +
          '<div class="excel-tl-title">' +
          escapeHtml(c.title) +
          '</div>' +
          '<div class="excel-tl-items">' +
          items +
          '</div></div>'
        );
      })
      .join('');
    return (
      '<div class="excel-timeline-section excel-reveal">' +
      '<div class="excel-sec-label">' +
      escapeHtml(tl.sectionLabel) +
      '</div>' +
      '<div class="excel-tl-grid">' +
      cards +
      '</div></div>'
    );
  }

  function renderInsights(items) {
    const inner = (items || [])
      .map(
        (x) =>
          '<div class="excel-insight-box">' +
          '<div class="excel-ib-icon">' +
          escapeHtml(x.icon) +
          '</div>' +
          '<div class="excel-ib-title">' +
          escapeHtml(x.title) +
          '</div>' +
          '<div class="excel-ib-desc">' +
          escapeHtml(x.desc) +
          '</div></div>'
      )
      .join('');
    return '<div class="excel-insight-row excel-reveal">' + inner + '</div>';
  }

  function renderFooter(f) {
    return (
      '<div class="excel-cs-footer excel-reveal">' +
      '<p>' +
      (f.lineHtml || '') +
      '</p>' +
      '<p><em class="excel-footer-quote">' +
      (f.quoteHtml || '') +
      '</em></p></div>'
    );
  }

  function animateBarsIn(el) {
    el.querySelectorAll('.excel-ch-bar[data-w]').forEach((b) => {
      setTimeout(() => {
        b.style.width = b.getAttribute('data-w') || '';
      }, 200);
    });
    el.querySelectorAll('.excel-bar-fill[data-h]').forEach((b) => {
      setTimeout(() => {
        b.style.height = b.getAttribute('data-h') || '';
      }, 300);
    });
  }

  function bindBarTips(root) {
    root.querySelectorAll('.excel-bar-fill').forEach((b) => {
      b.addEventListener('mouseenter', () => {
        const tip = b.querySelector('.excel-bar-tip');
        if (tip) tip.style.opacity = '1';
      });
      b.addEventListener('mouseleave', () => {
        const tip = b.querySelector('.excel-bar-tip');
        if (tip) tip.style.opacity = '0';
      });
    });
  }

  function initRevealAndBars(root) {
    const reveals = root.querySelectorAll('.excel-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('excel-visible');
            animateBarsIn(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveals.forEach((r) => io.observe(r));
    window.addEventListener('load', () => {
      root.querySelectorAll('.excel-ch-bar[data-w]').forEach((b) => {
        if (b.closest('.excel-reveal.excel-visible')) {
          b.style.width = b.getAttribute('data-w') || '';
        }
      });
    });
    bindBarTips(root);
  }

  function renderExcelPage(data) {
    const bl = data.backLink || {};
    const backHref = escapeHtml(bl.href || '../index.html#cases');
    const backText = escapeHtml(bl.label || 'Portfolio');
    const backIc =
      '<span class="excel-back__ic" aria-hidden="true">' +
      '<svg class="excel-back__svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></span>';
    const back =
      '<a class="excel-back" href="' +
      backHref +
      '" aria-label="Back to portfolio">' +
      '<span class="excel-back__inner">' +
      backIc +
      '<span class="excel-back__text">' +
      backText +
      '</span></span></a>';

    const parts = [
      back,
      renderHeader(data.header || {}),
      renderMetricsBoxes(data.metricsBoxes),
      renderJourney(data.journey || {}),
      '<div class="excel-two-col excel-reveal">' +
        renderChannelAugust(data.channelAugust || {}) +
        renderMonthlyTable(data.monthlyTable || {}) +
        '</div>',
      renderChart(data.chart || {}),
      renderGeo(data.geo || {}),
      renderTimeline(data.timeline || {}),
      renderInsights(data.insights),
      renderFooter(data.footer || {}),
    ];

    return parts.join('');
  }

  window.initExcelDataPage = function (data) {
    if (!data) return;
    if (data.documentTitle) document.title = data.documentTitle;
    const mount = document.getElementById('excel-page-root');
    if (!mount) return;
    mount.innerHTML = renderExcelPage(data);
    mount.removeAttribute('aria-busy');
    initRevealAndBars(mount);
  };
})();
