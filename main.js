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
