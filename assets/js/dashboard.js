/* BRG Financial — Customer-Journey Analytics dashboard (Option C demo)
   Self-contained inline-SVG charts. No external dependencies, renders
   offline. Sample data only — in production this is fed by GA4 /
   GoDaddy / social exports into Looker Studio or Power BI. */
(function () {
  "use strict";

  var PAL = ['#2e5fa3', '#2f8b76', '#c9a227', '#6c6fb5', '#46738f', '#b5533c'];
  var GRID = '#e3e9f2', MUTED = '#5f6b7a', INK = '#33404f';
  var NS = 'http://www.w3.org/2000/svg';

  function el(id) { return document.getElementById(id); }
  function money(n) { return n.toLocaleString('en-US'); }

  /* ---------- Multi-line chart: traffic by source ---------- */
  function lineChart(node, series, labels) {
    var W = 620, H = 300, pad = { t: 16, r: 14, b: 34, l: 40 };
    var maxV = 0;
    series.forEach(function (s) { s.data.forEach(function (v) { if (v > maxV) maxV = v; }); });
    maxV = Math.ceil(maxV / 100) * 100;
    var plotW = W - pad.l - pad.r, plotH = H - pad.t - pad.b;
    var x = function (i) { return pad.l + (plotW * i) / (labels.length - 1); };
    var y = function (v) { return pad.t + plotH - (plotH * v) / maxV; };

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" role="img" aria-label="Traffic by source over time" preserveAspectRatio="xMidYMid meet">';
    // y gridlines + labels
    for (var g = 0; g <= 4; g++) {
      var gv = (maxV / 4) * g, gy = y(gv);
      svg += '<line x1="' + pad.l + '" y1="' + gy + '" x2="' + (W - pad.r) + '" y2="' + gy + '" stroke="' + GRID + '" stroke-width="1"/>';
      svg += '<text x="' + (pad.l - 8) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + gv + '</text>';
    }
    // x labels
    labels.forEach(function (lb, i) {
      svg += '<text x="' + x(i) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + lb + '</text>';
    });
    // series
    series.forEach(function (s, si) {
      var col = PAL[si % PAL.length];
      var d = s.data.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ');
      // area fill
      var area = d + ' L' + x(labels.length - 1).toFixed(1) + ' ' + y(0) + ' L' + x(0).toFixed(1) + ' ' + y(0) + ' Z';
      svg += '<path d="' + area + '" fill="' + col + '" fill-opacity="0.08"/>';
      svg += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
      s.data.forEach(function (v, i) { svg += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="2.6" fill="' + col + '"/>'; });
    });
    svg += '</svg>';

    var legend = '<div class="legend">' + series.map(function (s, si) {
      return '<span class="k"><span class="sw" style="background:' + PAL[si % PAL.length] + '"></span>' + s.label + '</span>';
    }).join('') + '</div>';
    node.innerHTML = svg + legend;
  }

  /* ---------- Donut chart: device mix ---------- */
  function donut(node, data) {
    var W = 300, H = 260, cx = 150, cy = 120, r = 92, rin = 58;
    var total = data.reduce(function (a, d) { return a + d.value; }, 0);
    var ang = -Math.PI / 2;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" role="img" aria-label="Device mix" preserveAspectRatio="xMidYMid meet">';
    data.forEach(function (d, i) {
      var frac = d.value / total, a2 = ang + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang);
      var x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      var xi2 = cx + rin * Math.cos(a2), yi2 = cy + rin * Math.sin(a2);
      var xi1 = cx + rin * Math.cos(ang), yi1 = cy + rin * Math.sin(ang);
      svg += '<path d="M' + x1 + ' ' + y1 + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 +
             ' L' + xi2 + ' ' + yi2 + ' A' + rin + ' ' + rin + ' 0 ' + large + ' 0 ' + xi1 + ' ' + yi1 + ' Z" fill="' + PAL[i % PAL.length] + '"/>';
      ang = a2;
    });
    svg += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="700" fill="' + INK + '" font-family="Fraunces,Georgia,serif">' + data[0].value + '%</text>';
    svg += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="12" fill="' + MUTED + '">mobile</text>';
    svg += '</svg>';
    var legend = '<div class="legend" style="justify-content:center">' + data.map(function (d, i) {
      return '<span class="k"><span class="sw" style="background:' + PAL[i % PAL.length] + '"></span>' + d.label + ' · ' + d.value + '%</span>';
    }).join('') + '</div>';
    node.innerHTML = svg + legend;
  }

  /* ---------- Horizontal bars: leads by channel ---------- */
  function barsH(node, data) {
    var W = 620, rowH = 46, pad = { t: 10, r: 60, l: 200, b: 10 };
    var H = pad.t + pad.b + data.length * rowH;
    var maxV = Math.max.apply(null, data.map(function (d) { return d.value; }));
    var plotW = W - pad.l - pad.r;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" role="img" aria-label="Leads by channel" preserveAspectRatio="xMidYMid meet">';
    data.forEach(function (d, i) {
      var yTop = pad.t + i * rowH, bw = (plotW * d.value) / maxV, by = yTop + 8, bh = rowH - 18;
      svg += '<text x="' + (pad.l - 12) + '" y="' + (by + bh / 2 + 4) + '" text-anchor="end" font-size="12.5" fill="' + INK + '" font-weight="600">' + d.label + '</text>';
      svg += '<rect x="' + pad.l + '" y="' + by + '" width="' + Math.max(bw, 3) + '" height="' + bh + '" rx="6" fill="' + PAL[i % PAL.length] + '"/>';
      svg += '<text x="' + (pad.l + Math.max(bw, 3) + 8) + '" y="' + (by + bh / 2 + 4) + '" font-size="12.5" font-weight="700" fill="' + INK + '">' + d.value + '</text>';
    });
    svg += '</svg>';
    node.innerHTML = svg;
  }

  /* ---------- Render ---------- */
  var months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  if (el('chart-traffic')) lineChart(el('chart-traffic'), [
    { label: 'Organic search', data: [120, 168, 205, 262, 318, 372] },
    { label: 'Blog / content', data: [0, 22, 58, 110, 176, 240] },
    { label: 'LinkedIn', data: [14, 30, 52, 74, 96, 128] },
    { label: 'Direct / referral', data: [40, 44, 51, 55, 60, 66] }
  ], months);

  if (el('chart-device')) donut(el('chart-device'), [
    { label: 'Mobile', value: 61 }, { label: 'Desktop', value: 33 }, { label: 'Tablet', value: 6 }
  ]);

  if (el('chart-leads')) barsH(el('chart-leads'), [
    { label: 'Organic search', value: 17 },
    { label: 'Free guide (lead magnet)', value: 14 },
    { label: 'Blog article', value: 9 },
    { label: 'LinkedIn', value: 6 },
    { label: 'Direct', value: 4 }
  ]);
})();
