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

  /* ---- Brand name glow: bold + glow every "BRG Financial" mention ---- */
  (function () {
    var RE = /BRG Financial|BRG FINANCIAL/g;
    var SKIP = { SCRIPT: 1, STYLE: 1, TITLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || (node.nodeValue.indexOf('BRG Financial') === -1 && node.nodeValue.indexOf('BRG FINANCIAL') === -1)) {
          return NodeFilter.FILTER_REJECT;
        }
        var p = node.parentNode;
        if (!p || SKIP[p.nodeName] || (p.classList && p.classList.contains('brand-glow'))) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) { nodes.push(n); }
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var frag = document.createDocumentFragment();
      var lastIndex = 0;
      var match;
      RE.lastIndex = 0;
      while ((match = RE.exec(text))) {
        if (match.index > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        var strong = document.createElement('strong');
        strong.className = 'brand-glow';
        strong.textContent = match[0];
        frag.appendChild(strong);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    });
  })();

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

  /* ---- Site search (icon toggle -> full-width drawer) ---- */
  (function () {
    var toggle = document.querySelector('[data-site-search-toggle]');
    var overlay = document.querySelector('[data-site-search]');
    var input = document.querySelector('[data-site-search-input]');
    var panel = document.querySelector('[data-site-search-results]');
    var closeBtn = document.querySelector('[data-site-search-close]');
    var dataEl = document.getElementById('site-search-data');
    if (!toggle || !overlay || !input || !panel || !dataEl) return;

    var index = [];
    try { index = JSON.parse(dataEl.textContent) || []; } catch (e) { index = []; }

    var activeIndex = -1;
    var currentResults = [];

    function openOverlay() {
      overlay.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      setTimeout(function () { input.focus(); }, 10);
    }
    function closeOverlay() {
      overlay.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      input.value = '';
      panel.hidden = true;
      panel.innerHTML = '';
    }
    toggle.addEventListener('click', function () {
      if (overlay.hidden) { openOverlay(); } else { closeOverlay(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) { closeOverlay(); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!overlay.hidden && !overlay.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        closeOverlay();
      }
    });

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
      }
    });
  })();

  /* ---- Account type glossary (click a pill -> definition modal) ---- */
  (function () {
    var pills = document.querySelectorAll('[data-acct-term]');
    var backdrop = document.querySelector('[data-acct-modal]');
    if (!pills.length || !backdrop) return;
    var titleEl = backdrop.querySelector('[data-acct-modal-title]');
    var bodyEl = backdrop.querySelector('[data-acct-modal-body]');
    var closeBtn = backdrop.querySelector('[data-acct-modal-close]');
    var lastFocused = null;

    var DEFS = {
      'Individual': 'A brokerage account owned and taxed in one person’s name.',
      'Joint': 'A brokerage account owned by two or more people — often spouses or family members — with shared access.',
      'Trust': 'An account held in the name of a trust, managed according to its trust agreement for the benefit of its beneficiaries.',
      'Traditional IRA': 'A tax-advantaged retirement account funded with pre-tax or deductible contributions; withdrawals in retirement are taxed as income.',
      'Roth IRA': 'A retirement account funded with after-tax dollars — qualified withdrawals in retirement are tax-free.',
      'Rollover IRA': 'An IRA that holds funds rolled over from an old employer 401(k) or similar workplace plan.',
      'SEP IRA': 'A retirement account for self-employed individuals and small business owners, funded with employer contributions.',
      'SIMPLE IRA': 'A retirement plan for small businesses (100 or fewer employees) with simplified administration and required employer contributions.',
      'Beneficiary IRA': 'An IRA inherited from a deceased account owner, with its own distribution rules for the beneficiary.',
      'Beneficiary Roth IRA': 'An inherited Roth IRA, passed to a beneficiary with its own required distribution rules.',
      'Solo 401(k)': 'A 401(k) for self-employed individuals or business owners with no full-time employees other than a spouse, allowing higher contribution limits.',
      'Roth Solo 401(k)': 'A Solo 401(k) funded with after-tax dollars, so qualified withdrawals in retirement are tax-free.',
      'Retirement Trust': 'A trust structured to hold and direct retirement assets according to the account owner’s wishes.',
      'UTMA': 'A custodial account (Uniform Transfers to Minors Act) held for a minor’s benefit and managed by a custodian until they reach the age of majority.',
      'UGMA': 'A custodial account (Uniform Gifts to Minors Act), similar to a UTMA, used to hold gifted assets for a minor until adulthood.',
      'Minor IRA': 'A traditional IRA opened for a minor with earned income, managed by a custodian until they come of age.',
      'Minor Roth IRA': 'A Roth IRA opened for a minor with earned income — contributions grow tax-free, a powerful head start given decades of compounding ahead.',
      'Sole Proprietorship': 'An investment account for an unincorporated business owned and run by one person.',
      'Single-Member LLC': 'An account for a limited liability company with one owner, combining liability protection with simple tax treatment.',
      'C Corporation': 'An account for a business structured as a C-corp — a separate legal and tax-paying entity from its owners.',
      'LLC (taxed as C-Corp)': 'An LLC that has elected to be taxed as a C-corporation rather than under its default tax treatment.',
      'S Corporation': 'An account for a business structured as an S-corp, which passes income through to shareholders to avoid corporate-level tax.',
      'LLC (taxed as S-Corp)': 'An LLC that has elected S-corporation tax treatment, often to reduce self-employment taxes.',
      'Partnership': 'An account for a business owned by two or more partners who share profits, losses, and liability.',
      'LLC (taxed as Partnership)': 'A multi-member LLC taxed under partnership rules — the default treatment for LLCs with more than one owner.',
      'Non-Profit Organization': 'An account for a tax-exempt organization, such as a 501(c)(3), operating for charitable, educational, or other exempt purposes.'
    };

    function openModal(term) {
      var def = DEFS[term] || 'Ask us and we’ll walk you through how this account works.';
      titleEl.textContent = term;
      bodyEl.textContent = def;
      lastFocused = document.activeElement;
      backdrop.hidden = false;
      closeBtn.focus();
    }
    function closeModal() {
      backdrop.hidden = true;
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    pills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-acct-term'));
      });
    });
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !backdrop.hidden) closeModal();
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
