/* BRG Financial — site interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- Set current year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Compound growth calculator (engagement hook) ---- */
  var calc = document.getElementById('calc');
  if (calc) {
    var money = function (n) {
      return '$' + Math.round(n).toLocaleString('en-US');
    };
    var els = {
      start: document.getElementById('c-start'),
      monthly: document.getElementById('c-monthly'),
      years: document.getElementById('c-years'),
      rate: document.getElementById('c-rate'),
      startV: document.getElementById('c-start-v'),
      monthlyV: document.getElementById('c-monthly-v'),
      yearsV: document.getElementById('c-years-v'),
      rateV: document.getElementById('c-rate-v'),
      out: document.getElementById('c-out'),
      contrib: document.getElementById('c-contrib'),
      growth: document.getElementById('c-growth'),
      delay: document.getElementById('c-delay')
    };
    function fv(start, monthly, years, ratePct) {
      var r = ratePct / 100 / 12;
      var n = years * 12;
      var fvStart = start * Math.pow(1 + r, n);
      var fvSeries = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
      return fvStart + fvSeries;
    }
    function render() {
      var s = +els.start.value, m = +els.monthly.value, y = +els.years.value, rt = +els.rate.value;
      els.startV.textContent = money(s);
      els.monthlyV.textContent = money(m);
      els.yearsV.textContent = y + ' yrs';
      els.rateV.textContent = rt.toFixed(1) + '%';
      var total = fv(s, m, y, rt);
      var contrib = s + m * y * 12;
      els.out.textContent = money(total);
      if (els.contrib) els.contrib.textContent = money(contrib);
      if (els.growth) els.growth.textContent = money(total - contrib);
      // "cost of waiting 5 years"
      if (els.delay && y > 5) {
        var delayed = fv(s, m, y - 5, rt);
        els.delay.textContent = money(total - delayed);
      } else if (els.delay) {
        els.delay.textContent = money(0);
      }
    }
    ['start', 'monthly', 'years', 'rate'].forEach(function (k) {
      els[k].addEventListener('input', render);
    });
    render();
  }

  /* ---- Demo form handling (Option A: routes to email) ----
     For the live site, set the form's action to a real endpoint
     (Formspree/GoDaddy) OR rely on the mailto fallback below. */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      // If no real action endpoint is configured, use mailto fallback.
      var action = form.getAttribute('action') || '';
      if (action.indexOf('http') !== 0) {
        e.preventDefault();
        var to = form.getAttribute('data-to') || 'info@brgfinancial.net';
        var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Website inquiry');
        var body = [];
        form.querySelectorAll('input, textarea, select').forEach(function (f) {
          if (f.name && f.type !== 'submit' && f.value) {
            body.push(f.previousElementSibling && f.previousElementSibling.textContent
              ? f.previousElementSibling.textContent.replace('*', '').trim() + ': ' + f.value
              : f.name + ': ' + f.value);
          }
        });
        var msg = document.querySelector('[data-form-msg="' + form.id + '"]');
        if (msg) { msg.hidden = false; }
        window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + encodeURIComponent(body.join('\n'));
      }
    });
  });

  /* ---- Scroll-reveal animations ---- */
  (function () {
    var sel = '.card, .kpi, .panel-card, .trust .item, .contact-line, .faq details, .leadmag, .stat, .split > *, .hero-card';
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    // section headings too (but not ones living inside cards)
    Array.prototype.slice.call(document.querySelectorAll('main h2')).forEach(function (h) {
      if (!h.closest('.card') && !h.closest('.leadmag')) els.push(h);
    });
    els.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 5) * 70) + 'ms';
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }
  })();

  /* ---- Site search (nav bar) ---- */
  (function () {
    var wrap = document.querySelector('[data-site-search]');
    var input = document.querySelector('[data-site-search-input]');
    var panel = document.querySelector('[data-site-search-results]');
    var dataEl = document.getElementById('site-search-data');
    if (!wrap || !input || !panel || !dataEl) return;

    var index = [];
    try { index = JSON.parse(dataEl.textContent) || []; } catch (e) { index = []; }

    var activeIndex = -1;
    var currentResults = [];

    function score(entry, q) {
      var title = entry.title.toLowerCase();
      var blurb = (entry.blurb || '').toLowerCase();
      var kw = (entry.keywords || '').toLowerCase();
      if (title.indexOf(q) === 0) return 3;
      if (title.indexOf(q) > -1) return 2;
      if (kw.indexOf(q) > -1) return 1.5;
      if (blurb.indexOf(q) > -1) return 1;
      return 0;
    }

    function render(results, query) {
      currentResults = results;
      activeIndex = -1;
      if (!query) { panel.hidden = true; panel.innerHTML = ''; return; }
      if (!results.length) {
        panel.innerHTML = '<div class="r-empty">No matches for “' + query + '”. Try “401(k)”, “Roth”, or “fees”.</div>';
        panel.hidden = false;
        return;
      }
      panel.innerHTML = results.map(function (r) {
        return '<a href="' + r.url + '" role="option"><span class="r-title">' + r.title + '</span><span class="r-blurb">' + r.blurb + '</span></a>';
      }).join('');
      panel.hidden = false;
    }

    function search(query) {
      var q = query.trim().toLowerCase();
      if (!q) { render([], ''); return; }
      var results = index
        .map(function (entry) { return { entry: entry, s: score(entry, q) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 6)
        .map(function (r) { return r.entry; });
      render(results, query);
    }

    var debounceTimer;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var val = input.value;
      debounceTimer = setTimeout(function () { search(val); }, 120);
    });

    input.addEventListener('keydown', function (e) {
      var links = panel.querySelectorAll('a');
      if (e.key === 'ArrowDown') {
        if (!links.length) return;
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, links.length - 1);
        links.forEach(function (a, i) { a.classList.toggle('active', i === activeIndex); });
      } else if (e.key === 'ArrowUp') {
        if (!links.length) return;
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        links.forEach(function (a, i) { a.classList.toggle('active', i === activeIndex); });
      } else if (e.key === 'Enter') {
        if (activeIndex > -1 && currentResults[activeIndex]) {
          window.location.href = currentResults[activeIndex].url;
        } else if (currentResults[0]) {
          window.location.href = currentResults[0].url;
        }
      } else if (e.key === 'Escape') {
        render([], '');
        input.blur();
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) { panel.hidden = true; }
    });
    input.addEventListener('focus', function () {
      if (input.value.trim()) { search(input.value); }
    });
  })();

  /* ---- Lead magnet capture (demo) ---- */
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('http') !== 0) {
        e.preventDefault();
        var wrap = form.closest('[data-lead-wrap]') || form.parentElement;
        var done = wrap.querySelector('[data-lead-done]');
        form.hidden = true;
        if (done) done.hidden = false;
      }
    });
  });

})();
