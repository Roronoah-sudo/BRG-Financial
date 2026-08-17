/* ============================================================
   BRG Financial — static site generator
   Outputs plain HTML/CSS/JS to /root/work/brg-site (GitHub Pages ready)
   ============================================================ */
const fs = require('fs');
const path = require('path');
const OUT = '/root/work/brg-site';

const SITE = {
  name: 'BRG Financial',
  legal: 'BRG Financial LLC',
  url: 'https://brgfinancial.net',
  phone: '484-368-2477',
  tel: '+14843682477',
  email: 'info@brgfinancial.net',
  area: 'Greater Philadelphia · PA & NJ',
  reach: 'Serving clients nationwide',
  advisor: 'Benjamin R. Gialloreto',
  advisorShort: 'Ben',
  advisorRole: 'Principal & Investment Adviser Representative'
};

/* ---------- Inline SVG icons ---------- */
const I = {
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  pin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  chart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-4 4"/></svg>',
  seed: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M12 20c0-6 0-9 4-13"/><path d="M12 14C7 14 4 11 4 6c5 0 8 3 8 8z"/></svg>',
  briefcase: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  compass: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  scale: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 6a3 3 0 0 0 6 0z"/><path d="m19 7-3 6a3 3 0 0 0 6 0z"/><path d="M7 21h10"/></svg>',
  layers: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
  clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  spark: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  chevron: '<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H9z"/></svg>',
  facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5-6.6L5.3 22H2l8.1-9.3L1.5 2h6.9l4.5 6 5.2-6zm-2.4 18h1.9L7.6 4H5.6z"/></svg>',
  link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
};

const LOGO = `<svg class="mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#101012"/><path d="M13 34V14h9.2c3.9 0 6.3 1.9 6.3 5.1 0 2.2-1.2 3.7-3.2 4.4 2.5.5 4 2.2 4 4.8 0 3.5-2.6 5.7-6.8 5.7H13z" fill="#fff"/><path d="M17.7 22.2h3.7c1.7 0 2.7-.8 2.7-2.2 0-1.4-1-2.1-2.7-2.1h-3.7v4.3zm0 8.1h4c1.9 0 2.9-.8 2.9-2.4 0-1.5-1.1-2.4-3-2.4h-3.9v4.8z" fill="#101012"/><path d="M31 34l4.8-10L31 14h4.3l2.7 6.4 2.7-6.4H45l-4.8 10L45 34h-4.4l-2.8-6.6L35 34h-4z" fill="#c9a227"/></svg>`;

/* ---------- Navigation ---------- */
const NAV = [
  { href: 'services.html', label: 'Services' },
  { href: '401k-erisa.html', label: '401(k) & ERISA' },
  { href: 'insights.html', label: 'Insights' },
  { href: 'about.html', label: 'About' },
  { href: 'contact.html', label: 'Contact' }
];

function nav(active, prefix) {
  const links = NAV.map(n =>
    `<li><a href="${prefix}${n.href}"${active === n.href ? ' class="active" aria-current="page"' : ''}>${n.label}</a></li>`
  ).join('');
  return `
  <div class="topbar">
    <div class="container">
      <span class="pill">${I.pin} ${SITE.area}</span>
      <span style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        <a class="pill" href="tel:${SITE.tel}">${I.phone} ${SITE.phone}</a>
        <a class="pill" href="mailto:${SITE.email}">${I.mail} ${SITE.email}</a>
      </span>
    </div>
  </div>
  <div class="container">
    <nav class="nav" aria-label="Primary">
      <a class="brand" href="${prefix}index.html" aria-label="${SITE.name} home">
        ${LOGO}
        <span class="name">${SITE.name}<small>Registered Investment Adviser</small></span>
      </a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span></button>
      <ul class="nav-links" id="nav-links">${links}</ul>
      <div class="nav-cta desk">
        <a class="btn btn--ghost" href="tel:${SITE.tel}">${I.phone} Call</a>
        <a class="btn btn--primary" href="${prefix}get-started.html">Free Investor Guide</a>
      </div>
    </nav>
  </div>`;
}

function footer(prefix) {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">
          <div class="name">${SITE.name}</div>
          <p style="margin-top:.6rem;max-width:34ch">Fee-based investment management and retirement guidance for individuals, families, and business retirement plans. Headquartered in ${SITE.area} — serving clients nationwide.</p>
          <p style="margin-top:.4rem"><a href="tel:${SITE.tel}">${SITE.phone}</a><br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
        </div>
        <div>
          <h4>Services</h4>
          <ul class="foot-links">
            <li><a href="${prefix}services.html">Overview</a></li>
            <li><a href="${prefix}401k-erisa.html">401(k) &amp; ERISA</a></li>
            <li><a href="${prefix}investment-management.html">Investment Management</a></li>
            <li><a href="${prefix}retirement-income.html">Retirement Income</a></li>
          </ul>
        </div>
        <div>
          <h4>Learn</h4>
          <ul class="foot-links">
            <li><a href="${prefix}insights.html">Insights &amp; Articles</a></li>
            <li><a href="${prefix}faq.html">FAQ</a></li>
            <li><a href="${prefix}get-started.html">Free Investor Guide</a></li>
            <li><a href="${prefix}about.html">About Ben</a></li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul class="foot-links">
            <li><a href="${prefix}contact.html">Book an intro call</a></li>
            <li><a href="https://www.linkedin.com/" rel="noopener">LinkedIn</a></li>
            <li><a href="${prefix}disclosures.html">Disclosures &amp; Form ADV</a></li>
          </ul>
        </div>
      </div>
      <div class="disclosure">
        <p><strong>Important disclosures.</strong> ${SITE.legal} is a Registered Investment Adviser. Registered in Pennsylvania and New Jersey; may transact business in other states where registered or exempt. Content on this site is for informational and educational purposes only and does not constitute investment, legal, or tax advice, an offer, or a solicitation to buy or sell any security. Investing involves risk, including the possible loss of principal; past performance and any projections are not a guarantee of future results. Figures shown in calculators and illustrations are hypothetical and for education only. In accordance with applicable regulations, this site does not publish client testimonials or endorsements.</p>
      </div>
      <div class="foot-bottom">
        <span>&copy; <span data-year>2026</span> ${SITE.legal}. All rights reserved.</span>
        <span><a href="${prefix}disclosures.html">Disclosures</a> · <a href="${prefix}disclosures.html#privacy">Privacy</a> · <a href="${prefix}sitemap.xml">Sitemap</a></span>
      </div>
    </div>
  </footer>`;
}

/* ---------- Base layout ---------- */
function layout(o) {
  const prefix = o.prefix || '';
  const canonical = SITE.url + '/' + (o.slug || '');
  const desc = o.description;
  const title = o.title;
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": SITE.name,
    "url": SITE.url,
    "telephone": SITE.phone,
    "email": SITE.email,
    "areaServed": ["Philadelphia", "Pennsylvania", "New Jersey", "United States"],
    "address": { "@type": "PostalAddress", "addressRegion": "PA", "addressLocality": "Greater Philadelphia", "addressCountry": "US" },
    "priceRange": "Fee-based",
    "description": "Fee-based Registered Investment Adviser headquartered in Greater Philadelphia (PA & NJ), serving clients nationwide with 401(k)/ERISA plan guidance, investment management, and retirement income strategies.",
    "sameAs": ["https://www.linkedin.com/"]
  };
  const lds = [orgLd].concat(o.jsonld || []);
  const ldScript = lds.map(l => `<script type="application/ld+json">${JSON.stringify(l)}</script>`).join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#0b0b0c">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE.url}/assets/img/og-cover.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${prefix}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}assets/css/styles.css">
  ${ldScript}
  ${o.head || ''}
</head>
<body${o.bodyClass ? ` class="${o.bodyClass}"` : ''}>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">${nav(o.active, prefix)}</header>
  <main id="main">
${o.main}
  </main>
  ${footer(prefix)}
  <script src="${prefix}assets/js/main.js" defer></script>
  ${o.scripts || ''}
</body>
</html>`;
}

/* ---------- Reusable partials ---------- */
function pagehead(eyebrow, h1, sub, prefix, crumb) {
  return `
  <section class="pagehead">
    <div class="container">
      ${crumb ? `<div class="crumb"><a href="${prefix}index.html">Home</a> › ${crumb}</div>` : ''}
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="mb-0">${h1}</h1>
      ${sub ? `<p class="lead measure" style="margin-top:.8rem">${sub}</p>` : ''}
    </div>
  </section>`;
}

function ctaBand(prefix) {
  return `
  <section class="section section--navy">
    <div class="container center measure" style="margin-inline:auto">
      <p class="eyebrow">Let's talk</p>
      <h2 style="color:#fff">A 20-minute intro call, no pressure and no cost</h2>
      <p style="color:#d8d4c6">See whether we're a fit, get a straight answer about your situation, and leave with something useful either way.</p>
      <div class="hero-cta" style="justify-content:center;margin-top:1.2rem">
        <a class="btn btn--primary btn--lg" href="${prefix}contact.html">Book an intro call ${I.arrow}</a>
        <a class="btn btn--light btn--lg" href="tel:${SITE.tel}">${I.phone} ${SITE.phone}</a>
      </div>
    </div>
  </section>`;
}

function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(q => ({
      "@type": "Question", "name": q.q,
      "acceptedAnswer": { "@type": "Answer", "text": q.a.replace(/<[^>]+>/g, '') }
    }))
  };
}
function faqBlock(items) {
  return `<div class="faq">` + items.map(q => `
    <details>
      <summary>${q.q} ${I.chevron}</summary>
      <div class="ans">${q.a}</div>
    </details>`).join('') + `</div>`;
}

/* ============================================================
   BLOG DATA  (Option C: automation-ready — posts are data objects
   that a monthly job/AI pipeline appends to. Rendering is templated.)
   ============================================================ */
const POSTS = [
  {
    slug: 'start-investing-in-your-20s',
    cat: 'Getting Started',
    title: 'The Real Cost of Waiting: Why Investing in Your 20s Changes Everything',
    date: '2026-08-01', dateLabel: 'August 1, 2026', read: '6 min',
    excerpt: 'A dollar invested at 25 does work a dollar invested at 35 simply can’t catch up to. Here’s the math, in plain English, and what to actually do about it.',
    tags: ['compounding', 'young investors', '401(k)'],
    body: `
      <p>If you take one idea from this article, make it this: <strong>time in the market is the single biggest advantage a young investor has</strong>, and it’s the one you can never get back. Not stock picking. Not timing. Time.</p>
      <h2>The 10-year head start</h2>
      <p>Imagine two people who each invest $400 a month and earn about 8% a year on average. The only difference is when they start.</p>
      <ul>
        <li><strong>Avery starts at 25</strong> and invests for 40 years.</li>
        <li><strong>Jordan starts at 35</strong> and invests for 30 years — same monthly amount.</li>
      </ul>
      <p>Avery contributes only $48,000 more over their life, but ends up with <em>roughly double</em> the balance at 65. That gap isn’t extra saving — it’s compounding doing the heavy lifting on the first ten years of contributions.</p>
      <blockquote>The first decade you invest is worth more than the last two combined. That’s why “start now, adjust later” beats “wait until I have it figured out.”</blockquote>
      <h2>You need less than you think to begin</h2>
      <p>A common myth is that investing is for people who are already wealthy. In reality, the most powerful move for someone in their 20s is small and boring: capture your full employer 401(k) match, automate a modest monthly contribution, and let it run.</p>
      <h3>A simple first-year checklist</h3>
      <ul>
        <li>Contribute at least enough to your 401(k) to get the full employer match — it’s an immediate return you won’t find anywhere else.</li>
        <li>Build a small cash cushion (a few months of expenses) in a high-yield account before taking on more risk.</li>
        <li>Automate contributions so the decision is made once, not every month.</li>
        <li>Choose a diversified, low-cost core and avoid tinkering.</li>
      </ul>
      <h2>Where a fiduciary adviser fits</h2>
      <p>Early on, the plan is simple and you can do a lot yourself. As your income grows, decisions get more nuanced — Roth versus traditional, how aggressive to be, how to layer in other accounts. That’s where working with a fiduciary who is legally obligated to act in your interest starts to earn its keep.</p>
      <p><em>Try the numbers for your own situation with our <a href="../get-started.html">free growth calculator and investor guide</a>.</em></p>`
  },
  {
    slug: 'how-much-does-a-financial-advisor-cost',
    cat: 'Fees & Value',
    title: 'How Much Does a Financial Advisor Actually Cost? A Plain-English Breakdown',
    date: '2026-07-15', dateLabel: 'July 15, 2026', read: '7 min',
    excerpt: 'Percentage-of-assets, flat, hourly, commission — the fee models explained, plus the questions that reveal what you’re really paying.',
    tags: ['fees', 'fiduciary', 'transparency'],
    body: `
      <p>“How much does this cost?” should be the easiest question an adviser answers — and it’s a fair one to ask on the first call. Here’s how the common models work so you can compare honestly.</p>
      <h2>The main fee models</h2>
      <h3>1. Percentage of assets under management (AUM)</h3>
      <p>You pay an annual percentage of what the adviser manages for you — often around 1% a year, sometimes less as balances grow. It’s transparent and scales with your portfolio, which keeps incentives aligned: the adviser does better when you do.</p>
      <h3>2. Flat or retainer fees</h3>
      <p>A set annual or project fee regardless of portfolio size. This can make sense for specific, well-defined work.</p>
      <h3>3. Hourly</h3>
      <p>You pay for time, like an attorney. Good for one-off questions; less suited to ongoing management.</p>
      <h3>4. Commission-based</h3>
      <p>The “adviser” is paid by product providers when you buy certain products. This is where conflicts of interest can hide — which is exactly why the fiduciary standard matters.</p>
      <h2>Fee-based vs. commission — and why “fiduciary” is the word to listen for</h2>
      <p>A <strong>fiduciary</strong> is legally required to put your interests first. A Registered Investment Adviser like BRG Financial operates under that standard. Always ask directly: “Are you a fiduciary 100% of the time?”</p>
      <h2>Five questions that reveal the true cost</h2>
      <ul>
        <li>Are you a fiduciary at all times, and will you put that in writing?</li>
        <li>How exactly are you paid — and are there any commissions or third-party payments?</li>
        <li>What are the all-in costs, including underlying fund expenses?</li>
        <li>What do I get for the fee — planning, tax-aware guidance, ongoing management?</li>
        <li>Can you show me a sample of how you’d report performance to me?</li>
      </ul>
      <p>Cost only means something next to value. The right question isn’t “what’s the cheapest?” — it’s “what am I getting, and is it worth it?”</p>
      <p><em>Want a straight answer for your situation? <a href="../contact.html">Book a no-cost intro call.</a></em></p>`
  },
  {
    slug: 'roth-vs-traditional',
    cat: 'Retirement',
    title: 'Roth vs. Traditional: Which Account Wins for You?',
    date: '2026-07-01', dateLabel: 'July 1, 2026', read: '6 min',
    excerpt: 'The decision comes down to one question about your tax rate — today versus in retirement. Here’s how to think it through.',
    tags: ['Roth', 'tax planning', '401(k)', 'IRA'],
    body: `
      <p>Roth or traditional? It’s one of the most common questions we hear, and the honest answer is: it depends on your tax rate now versus later. Let’s make that concrete.</p>
      <h2>The core difference</h2>
      <ul>
        <li><strong>Traditional:</strong> contributions may be pre-tax now; you pay ordinary income tax when you withdraw in retirement.</li>
        <li><strong>Roth:</strong> you contribute after-tax dollars now; qualified withdrawals in retirement are tax-free.</li>
      </ul>
      <p>So the whole decision hinges on a single comparison: <strong>is your tax rate likely to be higher today or in retirement?</strong></p>
      <h2>When Roth tends to win</h2>
      <ul>
        <li>You’re early in your career and in a lower bracket than you expect later.</li>
        <li>You value tax-free flexibility and no required minimum distributions on Roth IRAs.</li>
        <li>You had a low-income year — a great time to consider Roth contributions or conversions.</li>
      </ul>
      <h2>When traditional tends to win</h2>
      <ul>
        <li>You’re in your peak earning years and expect a lower rate in retirement.</li>
        <li>The up-front deduction meaningfully lowers this year’s tax bill.</li>
      </ul>
      <blockquote>Many people benefit from having some of both — “tax diversification” gives you levers to pull in retirement, no matter what tax rates do.</blockquote>
      <h2>The move people forget: the low-income-year conversion</h2>
      <p>A year with unusually low income — a career break, starting a business — can be an ideal window to convert traditional dollars to Roth at a low tax cost. It’s a classic example of retirement tax planning: pay less tax when you’re in a position to.</p>
      <p><em>This is general education, not tax advice — your situation is specific. <a href="../contact.html">Let’s talk through yours.</a></em></p>`
  },
  {
    slug: 'small-business-401k-guide',
    cat: '401(k) & ERISA',
    title: 'Offering a 401(k) at Your Small Business: A Straightforward Guide',
    date: '2026-06-15', dateLabel: 'June 15, 2026', read: '8 min',
    excerpt: 'A retirement plan can attract talent and cut your tax bill — without the administrative headache you’re picturing. Here’s how it actually works.',
    tags: ['small business', '401(k)', 'ERISA', 'employers'],
    body: `
      <p>If you run a growing business, offering a retirement plan can help you attract and keep good people — and there are meaningful tax advantages for the business and its owners. The catch most owners worry about is complexity. Handled well, it doesn’t have to be.</p>
      <h2>Why offer a plan at all?</h2>
      <ul>
        <li><strong>Talent:</strong> a 401(k) is table stakes for many candidates comparing offers.</li>
        <li><strong>Tax efficiency:</strong> employer contributions are generally deductible, and tax credits may offset start-up costs for new plans.</li>
        <li><strong>Owner savings:</strong> a plan lets owners contribute meaningfully toward their own retirement in a tax-advantaged way.</li>
      </ul>
      <h2>Your responsibilities as a plan sponsor (ERISA basics)</h2>
      <p>When you sponsor a plan, you take on a <strong>fiduciary duty</strong> under ERISA to run it in the best interest of participants. In practice that means prudent investment options, reasonable fees, and clear documentation. A plan adviser helps you meet those duties instead of guessing at them.</p>
      <h3>What we help with</h3>
      <ul>
        <li>Designing the plan (match structure, eligibility, vesting) around your goals.</li>
        <li>Building and monitoring a prudent, low-cost investment lineup.</li>
        <li>Documenting a fiduciary process so you’re covered if questions arise.</li>
        <li>Educating your team so they actually use the benefit — which is the whole point.</li>
      </ul>
      <h2>403(b) plans for nonprofits</h2>
      <p>If you’re a nonprofit or educational employer, a 403(b) plays a similar role with its own rules. The same principles apply: prudent options, reasonable costs, and a documented process.</p>
      <p><em>Curious what a plan would look like for your business? <a href="../401k-erisa.html">See our 401(k) &amp; ERISA services</a> or <a href="../contact.html">book a call.</a></em></p>`
  }
];

function postCard(p, prefix) {
  return `
    <a class="card card--link post-card" href="${prefix}blog/${p.slug}.html">
      <span class="cat">${p.cat}</span>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <span class="meta">${p.dateLabel} · ${p.read} read</span>
    </a>`;
}

/* ============================================================
   PAGES
   ============================================================ */
const pages = [];

/* ---------- HOME ---------- */
pages.push({
  file: 'index.html', slug: '', active: '', prefix: '',
  title: 'BRG Financial | Fee-Based Investment & 401(k) Advice in Greater Philadelphia',
  description: 'BRG Financial is a fiduciary Registered Investment Adviser headquartered in Greater Philadelphia (PA & NJ), serving clients nationwide. 401(k)/ERISA guidance, investment management, and retirement income strategies.',
  main: `
  <section class="hero hero--fx">
    <div class="orb orb--1"></div><div class="orb orb--2"></div><div class="orb orb--3"></div>
    <div class="container">
      <div class="hero-grid">
        <div>
          <p class="eyebrow" style="color:#e6c766">Fiduciary · Fee-based · Greater Philadelphia</p>
          <h1>Grow your money with an adviser who <span class="grad-text">actually explains it.</span></h1>
          <p class="lead">BRG Financial is a fiduciary Registered Investment Adviser headquartered in Greater Philadelphia — helping individuals, families, and business owners nationwide invest with a real strategy, not a cookie-cutter script.</p>
          <div class="hero-badges">
            <span class="chip">${I.shield} Fiduciary, 100% of the time</span>
            <span class="chip">${I.seed} 401(k) &amp; ERISA specialist</span>
            <span class="chip">${I.chart} Active, tactical management</span>
          </div>
          <div class="hero-cta">
            <a class="btn btn--primary btn--lg" href="get-started.html">Get the free investor guide ${I.arrow}</a>
            <a class="btn btn--light btn--lg" href="tel:${SITE.tel}">${I.phone} ${SITE.phone}</a>
          </div>
        </div>
        <div class="hero-card glass">
          <p class="badge-soft">The 10-year head start</p>
          <h3 style="margin:.5rem 0 .2rem">Same $400/month. Different start.</h3>
          <svg viewBox="0 0 340 200" width="100%" role="img" aria-label="Growth comparison: starting at 25 versus 35" style="margin:.4rem 0 .2rem">
            <line x1="18" y1="175" x2="326" y2="175" stroke="#e3e9f2" stroke-width="1.5"/>
            <line x1="18" y1="120" x2="326" y2="120" stroke="#eef2f8" stroke-width="1"/>
            <line x1="18" y1="65" x2="326" y2="65" stroke="#eef2f8" stroke-width="1"/>
            <path class="draw d2" pathLength="1" d="M18 175 C 130 172, 240 152, 322 104" fill="none" stroke="#3a3a3e" stroke-width="3" stroke-linecap="round"/>
            <path class="draw" pathLength="1" d="M18 175 C 110 168, 210 118, 322 26" fill="none" stroke="#c9a227" stroke-width="3.4" stroke-linecap="round"/>
            <circle class="dot-pop" cx="322" cy="26" r="5" fill="#c9a227"/>
            <circle class="dot-pop" cx="322" cy="104" r="5" fill="#3a3a3e"/>
            <text class="dot-pop" x="316" y="18" text-anchor="end" font-size="13" font-weight="700" fill="#b8901f">$1.4M · start at 25</text>
            <text class="dot-pop" x="316" y="96" text-anchor="end" font-size="13" font-weight="700" fill="#55524b">$600k · start at 35</text>
            <text x="18" y="192" font-size="10.5" fill="#8a97a8">age 25</text>
            <text x="326" y="192" text-anchor="end" font-size="10.5" fill="#8a97a8">age 65</text>
          </svg>
          <p class="calc-note">Hypothetical, for illustration only — 8% avg. annual return. <a href="get-started.html">Run your own numbers &rsaquo;</a></p>
        </div>
      </div>
    </div>
    <div class="hero-skyline" aria-hidden="true"><svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice">
      <rect x="410" y="58" width="3" height="36" fill="#0b0b0c"/>
      <rect x="549" y="66" width="4" height="30" fill="#0b0b0c"/>
      <rect x="682" y="94" width="3" height="30" fill="#0b0b0c"/>
      <rect x="1088" y="140" width="3" height="34" fill="#0b0b0c"/>
      <path fill="#0b0b0c" d="M0 300 L0 235 H50 V210 H80 V235 H108 V180 H160 V235 H185 V200 H225 V240 H255 V160 H310 V240 H335 V205 H370 V240 H392 V130 L412 92 L432 130 V245 H460 V210 H492 V245 H520 V96 H584 V245 H610 V225 H648 V245 H668 V150 L684 122 L700 150 V245 H730 V205 H768 V245 H800 V180 H852 V245 H878 V215 H916 V245 H944 V170 H992 V245 H1016 V225 H1052 V245 H1080 V186 H1096 V172 H1112 V186 H1144 V245 H1170 V220 H1206 V245 H1230 V195 H1274 V245 H1298 V225 H1330 V245 H1356 V210 H1392 V245 H1440 V235 L1440 300 Z"/>
      <g fill="#c9a227" opacity=".55">
        <rect x="530" y="120" width="5" height="4"/><rect x="545" y="140" width="5" height="4"/><rect x="562" y="112" width="5" height="4"/><rect x="552" y="170" width="5" height="4"/><rect x="536" y="195" width="5" height="4"/>
        <rect x="400" y="150" width="4" height="4"/><rect x="416" y="176" width="4" height="4"/><rect x="408" y="205" width="4" height="4"/>
        <rect x="270" y="180" width="4" height="4"/><rect x="288" y="205" width="4" height="4"/>
        <rect x="676" y="168" width="4" height="4"/><rect x="688" y="192" width="4" height="4"/>
        <rect x="956" y="190" width="4" height="4"/><rect x="972" y="212" width="4" height="4"/>
        <rect x="1240" y="212" width="4" height="4"/><rect x="1090" y="200" width="4" height="4"/>
      </g>
    </svg></div>
  </section>

  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      ${(() => { const items = ['401(k) &amp; ERISA Plans','Investment Management','Retirement Income','Roth Conversions','Fiduciary Advice','Tax-Aware Strategy','Greater Philadelphia HQ · Serving Clients Nationwide']; const row = items.map(t => `<span><i class="dia">✦</i>${t}</span>`).join(''); return row + row; })()}
    </div>
  </div>

  <section class="trust">
    <div class="container">
      <div class="item">${I.shield}<div class="ic" style="display:none"></div><div><strong>Fiduciary duty</strong><span>Legally required to act in your interest</span></div></div>
      <div class="item">${I.pin}<div><strong>Greater Philadelphia HQ</strong><span>Serving clients nationwide</span></div></div>
      <div class="item">${I.scale}<div><strong>Transparent, fee-based</strong><span>No hidden commissions</span></div></div>
      <div class="item">${I.spark}<div><strong>Real strategy</strong><span>Not an off-the-shelf model</span></div></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="center measure" style="margin-inline:auto">
        <p class="eyebrow">How we help</p>
        <h2>Advice that meets you where you are</h2>
        <p class="lead">Whether you’re opening your first 401(k) or managing a windfall, the plan is built around your situation — and explained in language that makes sense.</p>
      </div>
      <div class="grid grid-3" style="margin-top:2.2rem">
        <a class="card card--link" href="401k-erisa.html"><div class="ic-box">${I.seed}</div><h3>401(k) &amp; ERISA</h3><p>Plan guidance for employees, and full sponsor support for business owners offering 401(k) and 403(b) plans.</p><span class="more">Explore ${I.arrow}</span></a>
        <a class="card card--link" href="investment-management.html"><div class="ic-box">${I.chart}</div><h3>Investment Management</h3><p>Active, tactical portfolios — growth tilts, alternatives, and selective positions — built to be efficient, not generic.</p><span class="more">Explore ${I.arrow}</span></a>
        <a class="card card--link" href="retirement-income.html"><div class="ic-box">${I.compass}</div><h3>Retirement Income</h3><p>Withdrawal strategy, Social Security timing, and tax-aware moves like Roth conversions, modeled for your future.</p><span class="more">Explore ${I.arrow}</span></a>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container split">
      <div>
        <p class="eyebrow">Why BRG</p>
        <h2>Not a script. A strategy.</h2>
        <p>Plenty of advisers put you in a handful of index funds, call it a day, and act like they’ve done you a favor. That’s fine — you could do that yourself. Our approach is more deliberate.</p>
        <ul class="checklist">
          <li>Growth-tilted equity exposure, not just a default allocation.</li>
          <li>Alternatives — precious metals, infrastructure, and more — to make portfolios more efficient.</li>
          <li>Tactical positions when the opportunity is there, strategic discipline the rest of the time.</li>
          <li>Optional individual stock sleeve for clients who want it.</li>
        </ul>
        <a class="btn btn--navy" href="investment-management.html">How we invest ${I.arrow}</a>
      </div>
      <div class="media">
        <div class="card" style="padding:0;overflow:hidden">
          <div style="background:var(--navy-800);color:#fff;padding:22px 24px"><p class="eyebrow" style="color:var(--gold-500);margin-bottom:.3rem">The BRG difference</p><h3 style="color:#fff;margin:0">Built to be efficient</h3></div>
          <div style="padding:22px 24px">
            <div class="grid grid-2" style="gap:14px">
              <div class="stat"><div class="num">Fiduciary</div><div class="lbl">Always, in writing</div></div>
              <div class="stat"><div class="num">PA &amp; NJ</div><div class="lbl">Plus other states on request</div></div>
              <div class="stat"><div class="num">Tax-aware</div><div class="lbl">Roth conversions &amp; more</div></div>
              <div class="stat"><div class="num">Hands-on</div><div class="lbl">You talk to Ben, not a call center</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap;margin-bottom:1.4rem">
        <div><p class="eyebrow">Insights</p><h2 class="mb-0">Straight talk on money</h2></div>
        <a class="btn btn--ghost" href="insights.html">All articles ${I.arrow}</a>
      </div>
      <div class="grid grid-3">${POSTS.slice(0, 3).map(p => postCard(p, '')).join('')}</div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      <div class="leadmag" data-lead-wrap>
        <div class="split" style="align-items:center">
          <div>
            <span class="badge-soft">Free download</span>
            <h2 style="margin-top:.6rem">The 10-Minute Investor Starter Guide</h2>
            <p style="color:#c8d7ec">The 5 things that actually matter when you’re getting started — and the myths that keep people on the sidelines. No jargon, no sales pitch.</p>
            <div data-lead-done hidden><p class="notice" style="background:#e7f4ee;border-color:#bfe3cf;color:#245c42">✓ Check your inbox — your guide is on the way. Talk soon!</p></div>
            <form data-lead id="home-lead" action="#" data-lead-wrap>
              <div class="form-row">
                <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address">
                <button class="btn btn--primary" type="submit">Send me the guide</button>
              </div>
              <p class="calc-note" style="color:#a8a396;margin-top:.6rem">We’ll never sell your info. Unsubscribe anytime.</p>
            </form>
          </div>
          <div class="media">
            <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:22px">
              <ul class="checklist" style="margin:0">
                <li style="color:#f1ede0">Start with the match — free money first</li>
                <li style="color:#f1ede0">Automate so the decision is made once</li>
                <li style="color:#f1ede0">Roth vs. traditional, decoded</li>
                <li style="color:#f1ede0">What you can safely ignore</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand('')}`,
  jsonld: [{
    "@context": "https://schema.org", "@type": "WebSite", "name": SITE.name, "url": SITE.url,
    "potentialAction": { "@type": "SearchAction", "target": SITE.url + "/insights.html?q={q}", "query-input": "required name=q" }
  }]
});

/* ---------- SERVICES OVERVIEW ---------- */
pages.push({
  file: 'services.html', slug: 'services.html', active: 'services.html', prefix: '',
  title: 'Services | Investment Management, 401(k) & Retirement | BRG Financial',
  description: 'Fee-based investment management, 401(k) & ERISA plan guidance, and retirement income strategies — headquartered in Greater Philadelphia, serving clients nationwide.',
  main: `
  ${pagehead('What we do', 'Services built around your goals, not a product shelf', 'Everything here is delivered under a fiduciary standard and explained in plain language. No formal cookie-cutter package — just the work your situation actually calls for.', '', 'Services')}
  <section class="section">
    <div class="container">
      <div class="grid grid-3">
        <a class="card card--link" href="401k-erisa.html"><div class="ic-box">${I.seed}</div><h3>401(k) &amp; ERISA</h3><p>Guidance for employees rolling over or optimizing a 401(k), and end-to-end support for employers sponsoring 401(k) and 403(b) plans.</p><span class="more">Learn more ${I.arrow}</span></a>
        <a class="card card--link" href="investment-management.html"><div class="ic-box">${I.chart}</div><h3>Investment Management</h3><p>Actively managed, tactical portfolios with growth tilts and alternatives — designed to keep returns elevated while managing risk.</p><span class="more">Learn more ${I.arrow}</span></a>
        <a class="card card--link" href="retirement-income.html"><div class="ic-box">${I.compass}</div><h3>Retirement Income</h3><p>Withdrawal sequencing, Social Security strategy, and tax-aware planning modeled through retirement.</p><span class="more">Learn more ${I.arrow}</span></a>
        <div class="card"><div class="ic-box">${I.scale}</div><h3>Tax-Aware Investing</h3><p>Roth conversions in low-income years, asset location, and coordination with your accountant to keep more of what you earn.</p></div>
        <div class="card"><div class="ic-box">${I.briefcase}</div><h3>Rollovers &amp; Consolidation</h3><p>Roll an old 401(k) into an IRA and bring scattered accounts under one clear, managed strategy.</p></div>
        <div class="card"><div class="ic-box">${I.layers}</div><h3>Portfolio Reviews</h3><p>A second opinion on what you hold today — costs, risk, and whether it still fits where you’re headed.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container measure center" style="margin-inline:auto">
      <p class="eyebrow">A quick, important note</p>
      <h2>How we do planning</h2>
      <p class="lead">We do the planning work — budgets, projections, withdrawal and Social Security strategy, Monte Carlo modeling, solvency to age 100 — as part of managing your money. It’s hands-on and specific to you, and it’s built to answer the questions that matter: are you on track, and what needs to change?</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="center measure" style="margin-inline:auto"><p class="eyebrow">Common questions</p><h2>Before you reach out</h2></div>
      <div style="margin-top:1.6rem">${faqBlock(SERVICE_FAQ())}</div>
    </div>
  </section>
  ${ctaBand('')}`,
  jsonld: [faqSchema(SERVICE_FAQ())]
});

function SERVICE_FAQ() {
  return [
    { q: 'How much does working with BRG Financial cost?', a: '<p>We’re fee-based and transparent. Investment management is typically billed as a percentage of the assets we manage for you, and we’ll always put our fiduciary commitment in writing. There are no hidden commissions. On an intro call we’ll walk through exactly what you’d pay and what’s included.</p>' },
    { q: 'Is there a minimum to get started?', a: '<p>We work with clients at different stages, from those just beginning to invest to those managing a significant windfall. The best first step is a short call so we can point you in the right direction — even if that’s “keep doing what you’re doing for now.”</p>' },
    { q: 'Are you a fiduciary?', a: '<p>Yes — 100% of the time. As a Registered Investment Adviser we’re legally obligated to act in your best interest, and we’re happy to state that in writing.</p>' },
    { q: 'Which states can you work with clients in?', a: '<p>We’re headquartered in Greater Philadelphia and registered in Pennsylvania and New Jersey — and we’re able to work with clients nationwide. If you’re in another state, just ask and we’ll confirm the details for your state.</p>' },
    { q: 'Do you provide a formal written financial plan?', a: '<p>Our planning is done as an integrated part of managing your money — detailed projections, tax-aware strategy, and scenario modeling specific to you — rather than sold as a separate written-plan product. You’ll always understand where you stand and what the plan is.</p>' }
  ];
}

/* ---------- 401k / ERISA (niche SEO page) ---------- */
pages.push({
  file: '401k-erisa.html', slug: '401k-erisa.html', active: '401k-erisa.html', prefix: '',
  title: '401(k), 403(b) & ERISA Plan Services | BRG Financial (PA & NJ)',
  description: 'ERISA 401(k) and 403(b) plan guidance for employees and employers — Greater Philadelphia HQ, serving clients nationwide. Rollovers, plan design, fiduciary support, and low-cost investment lineups.',
  main: `
  ${pagehead('Our specialty', '401(k), 403(b) &amp; ERISA plan services', 'A less crowded, deeply important corner of financial services — and one we know well. Whether you’re an employee with an old 401(k) or a business owner sponsoring a plan, here’s how we help.', '', '401(k) &amp; ERISA')}

  <section class="section">
    <div class="container split">
      <div>
        <h2>For individuals &amp; employees</h2>
        <p>Job changes leave a trail of old retirement accounts. We help you make sense of them and put them to work.</p>
        <ul class="checklist">
          <li><strong>401(k) rollovers</strong> into an IRA we manage — consolidating old accounts into one clear strategy.</li>
          <li><strong>Contribution strategy:</strong> capturing your full employer match and choosing Roth vs. traditional deliberately.</li>
          <li><strong>Investment selection</strong> inside your current plan’s menu, if a rollover isn’t right yet.</li>
          <li><strong>Coordination</strong> of your 401(k) with your broader retirement picture.</li>
        </ul>
        <a class="btn btn--navy" href="contact.html">Talk about your 401(k) ${I.arrow}</a>
      </div>
      <div class="media">
        <div class="card">
          <h3>Rolling over an old 401(k)?</h3>
          <p class="mb-0" style="color:var(--muted)">A quick sense of what we look at together:</p>
          <ul class="checklist" style="margin-top:1rem">
            <li>Fees you’re paying now vs. alternatives</li>
            <li>Whether to consolidate or keep separate</li>
            <li>Tax implications of any move</li>
            <li>How it fits your target retirement date</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container split split--reverse">
      <div>
        <h2>For employers &amp; plan sponsors</h2>
        <p>Offering a retirement plan helps you attract talent and can reduce the business’s tax bill — but sponsoring one makes you an <strong>ERISA fiduciary</strong>. We help you meet that duty with a documented, prudent process.</p>
        <ul class="checklist">
          <li><strong>Plan design</strong> — match structure, eligibility, and vesting tuned to your goals.</li>
          <li><strong>Prudent investment lineup</strong> that’s diversified and low-cost.</li>
          <li><strong>Fiduciary documentation</strong> so your process is defensible.</li>
          <li><strong>Employee education</strong> so your team actually uses the benefit.</li>
          <li><strong>403(b) plans</strong> for nonprofit and educational employers.</li>
        </ul>
        <a class="btn btn--navy" href="contact.html">Explore a plan for your business ${I.arrow}</a>
      </div>
      <div class="media">
        <div class="card" style="background:var(--navy-800);color:#e6e1d3;border:none">
          <p class="eyebrow" style="color:var(--gold-500)">Why it matters</p>
          <h3 style="color:#fff">The fiduciary duty is real</h3>
          <p style="color:#d8d4c6">Under ERISA, running a plan “well enough” isn’t the standard — acting in participants’ best interest with a documented process is. We make that manageable instead of intimidating.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="center measure" style="margin-inline:auto"><p class="eyebrow">401(k) &amp; ERISA FAQ</p><h2>Questions we hear a lot</h2></div>
      <div style="margin-top:1.6rem">${faqBlock(K401_FAQ())}</div>
    </div>
  </section>
  ${ctaBand('')}`,
  jsonld: [faqSchema(K401_FAQ()), {
    "@context": "https://schema.org", "@type": "Service", "serviceType": "401(k) and ERISA retirement plan advisory",
    "provider": { "@type": "FinancialService", "name": SITE.name }, "areaServed": ["Pennsylvania", "New Jersey", "Philadelphia"]
  }]
});

function K401_FAQ() {
  return [
    { q: 'Should I roll over my old 401(k) into an IRA?', a: '<p>It depends on the fees and investment options in your old plan versus an IRA, the tax implications, and your goals. Often consolidating into a managed IRA gives you more control and a clearer strategy — but not always. We’ll look at the specifics with you before recommending anything.</p>' },
    { q: 'What is an ERISA fiduciary, and am I one?', a: '<p>If you sponsor a retirement plan for your business, you generally take on a fiduciary duty under ERISA to run the plan in participants’ best interest — prudent investments, reasonable fees, and a documented process. We help you meet that responsibility.</p>' },
    { q: 'How much does it cost a small business to offer a 401(k)?', a: '<p>Costs have come down significantly, and tax credits may offset start-up expenses for new plans. Employer contributions are generally tax-deductible. We’ll help you weigh the real numbers against the benefits for your business and your own retirement savings.</p>' },
    { q: 'What’s the difference between a 401(k) and a 403(b)?', a: '<p>They’re similar tax-advantaged retirement plans, but 403(b) plans are for nonprofit and educational employers and have their own rules. The core principles — prudent options, reasonable costs, documented process — are the same.</p>' }
  ];
}

/* ---------- INVESTMENT MANAGEMENT ---------- */
pages.push({
  file: 'investment-management.html', slug: 'investment-management.html', active: '', prefix: '',
  title: 'Investment Management | Active, Tactical Portfolios | BRG Financial',
  description: 'Actively managed, tactical investment portfolios with growth tilts and alternatives — built to be efficient. Fiduciary, fee-based, headquartered in Greater Philadelphia — clients nationwide.',
  main: `
  ${pagehead('How we invest', 'Active, tactical, and built to be efficient', 'We use low-cost building blocks — but how we assemble them is where the strategy lives. Here’s the philosophy in plain terms.', '', 'Investment Management')}
  <section class="section">
    <div class="container split">
      <div>
        <h2>Beyond the default allocation</h2>
        <p>Many advisers hand you a standard mix of index funds and call it strategy. We use index funds too — they’re efficient — but we make deliberate choices about how your money is positioned.</p>
        <ul class="checklist">
          <li><strong>Growth-tilted equities</strong> where it fits your risk profile, rather than a one-size default.</li>
          <li><strong>Alternatives</strong> — exposure to areas like precious metals and infrastructure — to diversify and improve efficiency.</li>
          <li><strong>Tactical positions</strong> when the opportunity is compelling, balanced by strategic discipline.</li>
          <li><strong>Optional individual-stock sleeve</strong> for clients who want a portion actively selected.</li>
        </ul>
      </div>
      <div class="media">
        <div class="card">
          <p class="eyebrow">The goal</p>
          <h3>A more efficient portfolio</h3>
          <p style="color:var(--muted)">Efficiency means seeking strong returns for the risk you take — not chasing the hottest thing, and not settling for a generic model that ignores your situation.</p>
          <div class="grid grid-2" style="gap:12px;margin-top:1rem">
            <div class="pill">Risk-aware</div><div class="pill">Tax-aware</div>
            <div class="pill">Diversified</div><div class="pill">Reviewed regularly</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--soft">
    <div class="container measure center" style="margin-inline:auto">
      <p class="eyebrow">Risk, honestly</p>
      <h2>We manage risk — we don’t pretend it away</h2>
      <p class="lead">When markets are strong, disciplined management can add real value. When everyone is selling, the job is to limit the damage. We build portfolios with that reality in mind and model a range of outcomes so you’re not surprised.</p>
      <p class="calc-note">All investing involves risk, including possible loss of principal. Nothing here is a promise of performance.</p>
    </div>
  </section>
  ${ctaBand('')}`
});

/* ---------- RETIREMENT INCOME ---------- */
pages.push({
  file: 'retirement-income.html', slug: 'retirement-income.html', active: '', prefix: '',
  title: 'Retirement Income & Tax-Aware Strategy | BRG Financial',
  description: 'Withdrawal sequencing, Social Security timing, and Roth conversion strategy modeled through retirement. Fiduciary, fee-based — Greater Philadelphia HQ, clients nationwide.',
  main: `
  ${pagehead('Planning for the years that count', 'Turn savings into a paycheck that lasts', 'Accumulating is one job; drawing it down wisely is another. We model your retirement in detail so decisions are grounded in numbers, not guesses.', '', 'Retirement Income')}
  <section class="section">
    <div class="container">
      <div class="grid grid-3">
        <div class="card"><div class="ic-box">${I.compass}</div><h3>Withdrawal strategy</h3><p>Which accounts to draw from and in what order — sequencing that can stretch how long your money lasts.</p></div>
        <div class="card"><div class="ic-box">${I.clock}</div><h3>Social Security timing</h3><p>When to claim can be worth tens of thousands over a retirement. We model the trade-offs for your situation.</p></div>
        <div class="card"><div class="ic-box">${I.scale}</div><h3>Roth conversions</h3><p>Low-income years can be an ideal window to convert at a lower tax cost — classic retirement tax planning.</p></div>
        <div class="card"><div class="ic-box">${I.chart}</div><h3>Monte Carlo modeling</h3><p>We randomize market outcomes to stress-test your plan and show solvency levels through age 90, 95, and 100.</p></div>
        <div class="card"><div class="ic-box">${I.layers}</div><h3>Scenario planning</h3><p>Windfall, home sale, a big change in spending — we project how each path plays out before you commit.</p></div>
        <div class="card"><div class="ic-box">${I.shield}</div><h3>Ongoing adjustments</h3><p>Your plan isn’t static. We revisit it as markets, taxes, and your life change.</p></div>
      </div>
    </div>
  </section>
  <section class="section section--soft">
    <div class="container measure center" style="margin-inline:auto">
      <p class="eyebrow">Straight answers</p>
      <h2>The best plan is the honest one</h2>
      <p class="lead">A good adviser tells you what you need to hear, not just what feels good. If a goal doesn’t fit the math, you’ll know — with enough time to do something about it.</p>
    </div>
  </section>
  ${ctaBand('')}`
});

/* ---------- ABOUT ---------- */
pages.push({
  file: 'about.html', slug: 'about.html', active: 'about.html', prefix: '',
  title: 'About BRG Financial | A Fiduciary Adviser in Greater Philadelphia',
  description: 'Meet BRG Financial — an independent, fiduciary Registered Investment Adviser headquartered in Greater Philadelphia, serving clients nationwide with hands-on, transparent investment management.',
  main: `
  ${pagehead('About', 'An independent adviser in your corner', '', '', 'About')}
  <section class="section">
    <div class="container split">
      <div>
        <h2>Why BRG Financial exists</h2>
        <p>Too much of the industry runs on scripts and sales quotas. BRG Financial was built to be the opposite: an independent, fiduciary practice where you talk to the person actually managing your money, and where the strategy is tailored — not pulled off a shelf.</p>
        <p>We serve individuals and families building wealth, people navigating a windfall or a major transition, and business owners who want to offer a retirement plan the right way. The common thread is a preference for straight talk and a real plan.</p>
        <p>As a Registered Investment Adviser, we’re held to a fiduciary standard — legally obligated to act in your best interest, full stop.</p>
        <a class="btn btn--navy" href="contact.html">Introduce yourself ${I.arrow}</a>
      </div>
      <div class="media">
        <div class="card">
          <div style="display:flex;gap:16px;align-items:center;margin-bottom:1rem">
            <div style="width:64px;height:64px;border-radius:50%;background:var(--navy-700);color:#fff;display:grid;place-items:center;font-family:var(--font-serif);font-size:1.5rem">B</div>
            <div><h3 class="mb-0">${SITE.advisor}</h3><p class="mb-0" style="color:var(--muted);font-size:.9rem">${SITE.advisorRole}</p></div>
          </div>
          <p style="color:var(--muted)">Ben leads BRG Financial’s investment management and retirement work, combining a disciplined, tactical approach with a genuine commitment to educating clients along the way.</p>
          <ul class="checklist" style="margin-top:.6rem">
            <li>Fiduciary, fee-based</li>
            <li>Greater Philadelphia HQ · clients nationwide</li>
            <li>Specialty in 401(k) &amp; ERISA</li>
          </ul>
          <p class="calc-note">Bio blurb is placeholder copy — easy to swap for Ben’s full background and credentials.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--soft">
    <div class="container">
      <div class="center measure" style="margin-inline:auto"><p class="eyebrow">What guides us</p><h2>Principles, not a pitch</h2></div>
      <div class="grid grid-3" style="margin-top:1.6rem">
        <div class="card"><div class="ic-box">${I.shield}</div><h3>Fiduciary first</h3><p>Your interest comes first, always, and we’ll put it in writing.</p></div>
        <div class="card"><div class="ic-box">${I.scale}</div><h3>Transparent</h3><p>Clear, fee-based pricing. You always know what you’re paying and why.</p></div>
        <div class="card"><div class="ic-box">${I.spark}</div><h3>Educational</h3><p>We explain the “why” so you can make confident decisions.</p></div>
      </div>
    </div>
  </section>
  ${ctaBand('')}`
});

/* ---------- FAQ ---------- */
const ALL_FAQ = [
  { q: 'What does it cost to work with BRG Financial?', a: '<p>We’re fee-based and transparent — investment management is typically a percentage of assets we manage for you, always under a fiduciary commitment we’ll put in writing. No hidden commissions. We’ll walk through exact numbers on an intro call.</p>' },
  { q: 'Are you a fiduciary?', a: '<p>Yes, 100% of the time. As a Registered Investment Adviser we’re legally required to act in your best interest.</p>' },
  { q: 'Is there an account minimum?', a: '<p>We work with clients at a range of stages. The best first step is a short, no-cost call to see where you stand and whether we’re a fit.</p>' },
  { q: 'What states can you serve clients in?', a: '<p>We’re headquartered in Greater Philadelphia and registered in Pennsylvania and New Jersey — and we’re able to work with clients nationwide. Just ask and we’ll confirm the details for your state.</p>' },
  { q: 'Should I roll over my old 401(k)?', a: '<p>Sometimes yes, sometimes no — it depends on fees, options, taxes, and your goals. We’ll review the specifics before recommending anything. See our <a href="401k-erisa.html">401(k) &amp; ERISA services</a>.</p>' },
  { q: 'What’s the difference between Roth and traditional?', a: '<p>Traditional is generally pre-tax now and taxed at withdrawal; Roth is after-tax now and tax-free later. Which wins depends on your tax rate today versus in retirement. We break it down in <a href="blog/roth-vs-traditional.html">this article</a>.</p>' },
  { q: 'Do you offer a formal written financial plan?', a: '<p>We do the planning work — projections, tax strategy, scenario and Monte Carlo modeling — as an integrated part of managing your money, tailored to you, rather than as a separate written-plan product.</p>' },
  { q: 'How is my money actually invested?', a: '<p>In diversified, low-cost building blocks, assembled with intent — growth tilts, alternatives, and optional individual positions — to be efficient for your risk level. More on our <a href="investment-management.html">investment approach</a>.</p>' }
];
pages.push({
  file: 'faq.html', slug: 'faq.html', active: '', prefix: '',
  title: 'Frequently Asked Questions | BRG Financial',
  description: 'Answers on fees, fiduciary duty, account minimums, 401(k) rollovers, Roth vs. traditional, and how BRG Financial invests. Greater Philadelphia HQ — serving clients nationwide.',
  main: `
  ${pagehead('Answers', 'Frequently asked questions', 'Straightforward answers to what people ask most. Still curious? A quick call is the fastest way to a real answer.', '', 'FAQ')}
  <section class="section"><div class="container">${faqBlock(ALL_FAQ)}</div></section>
  ${ctaBand('')}`,
  jsonld: [faqSchema(ALL_FAQ)]
});

/* ---------- INSIGHTS (blog index) ---------- */
pages.push({
  file: 'insights.html', slug: 'insights.html', active: 'insights.html', prefix: '',
  title: 'Insights & Articles | BRG Financial',
  description: 'Plain-English articles on investing, 401(k)s, Roth vs. traditional, advisor fees, and retirement — published regularly by BRG Financial.',
  main: `
  ${pagehead('Insights', 'Straight talk on money', 'Practical, jargon-free articles on investing and retirement. New pieces published regularly — and shared to LinkedIn and Facebook as they go live.', '', 'Insights')}
  <section class="section">
    <div class="container">
      <p class="autobadge" style="margin-bottom:1.2rem">${I.spark} Fresh articles published monthly</p>
      <div class="grid grid-3">${POSTS.map(p => postCard(p, '')).join('')}</div>
    </div>
  </section>
  <section class="section section--soft">
    <div class="container measure center" style="margin-inline:auto">
      <p class="eyebrow">Never miss one</p>
      <h2>Get new articles in your inbox</h2>
      <div class="leadmag" data-lead-wrap style="text-align:left;margin-top:1.2rem">
        <div data-lead-done hidden><p class="notice" style="background:#e7f4ee;border-color:#bfe3cf;color:#245c42">✓ You’re subscribed — thanks!</p></div>
        <form data-lead id="blog-lead" action="#">
          <div class="form-row"><input type="email" name="email" required placeholder="you@email.com" aria-label="Email"><button class="btn btn--primary" type="submit">Subscribe</button></div>
        </form>
      </div>
    </div>
  </section>`,
  jsonld: [{
    "@context": "https://schema.org", "@type": "Blog", "name": "BRG Financial Insights", "url": SITE.url + "/insights.html",
    "blogPost": POSTS.map(p => ({ "@type": "BlogPosting", "headline": p.title, "datePublished": p.date, "url": SITE.url + "/blog/" + p.slug + ".html" }))
  }]
});

/* ---------- BLOG POSTS ---------- */
POSTS.forEach((p, idx) => {
  const others = POSTS.filter(x => x.slug !== p.slug).slice(0, 2);
  const shareUrl = encodeURIComponent(SITE.url + '/blog/' + p.slug + '.html');
  const shareText = encodeURIComponent(p.title);
  pages.push({
    file: 'blog/' + p.slug + '.html', slug: 'blog/' + p.slug + '.html', active: 'insights.html', prefix: '../',
    title: p.title + ' | BRG Financial',
    description: p.excerpt.replace(/"/g, "'"),
    main: `
    <article>
      <div class="post-hero">
        <div class="container article">
          <div class="crumb"><a href="../index.html">Home</a> › <a href="../insights.html">Insights</a> › ${p.cat}</div>
          <span class="cat" style="color:var(--blue-600);font-weight:700;text-transform:uppercase;font-size:.76rem;letter-spacing:.08em">${p.cat}</span>
          <h1 style="margin:.3rem 0 .5rem">${p.title}</h1>
          <p class="meta" style="color:var(--muted)">By ${SITE.advisor} · ${p.dateLabel} · ${p.read} read</p>
        </div>
      </div>
      <div class="section">
        <div class="container article">
          ${p.body}
          <div>${p.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
          <div class="share">
            <span style="font-weight:650;color:var(--ink)">Share:</span>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">${I.linkedin}</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" aria-label="Share on Facebook">${I.facebook}</a>
            <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}" target="_blank" rel="noopener" aria-label="Share on X">${I.x}</a>
          </div>
          <div class="notice" style="margin-top:1.4rem">This article is general education, not individualized investment, tax, or legal advice. <a href="../contact.html">Let’s talk about your specific situation.</a></div>
        </div>
      </div>
      <div class="section section--soft">
        <div class="container">
          <h2 class="center" style="margin-bottom:1.4rem">Keep reading</h2>
          <div class="grid grid-2" style="max-width:820px;margin-inline:auto">${others.map(o => postCard(o, '../')).join('')}</div>
        </div>
      </div>
    </article>`,
    jsonld: [{
      "@context": "https://schema.org", "@type": "BlogPosting", "headline": p.title,
      "datePublished": p.date, "dateModified": p.date, "author": { "@type": "Person", "name": SITE.advisor },
      "publisher": { "@type": "Organization", "name": SITE.name }, "description": p.excerpt.replace(/<[^>]+>/g, ''),
      "mainEntityOfPage": SITE.url + "/blog/" + p.slug + ".html", "keywords": p.tags.join(', ')
    }]
  });
});

/* ---------- GET STARTED (lead magnet + calculator) ---------- */
pages.push({
  file: 'get-started.html', slug: 'get-started.html', active: '', prefix: '',
  title: 'Free Investor Guide + Growth Calculator | BRG Financial',
  description: 'Download BRG Financial’s free 10-Minute Investor Starter Guide and use the compound-growth calculator to see the cost of waiting. Greater Philadelphia HQ — serving clients nationwide.',
  main: `
  ${pagehead('Start here', 'See what your money could do — then get the guide', 'Play with the numbers below, then grab the free starter guide. No cost, no obligation, no jargon.', '', 'Get Started')}
  <section class="section">
    <div class="container">
      <div id="calc" class="calc">
        <div class="panel">
          <h3 style="margin-top:0">Compound Growth Calculator</h3>
          <p style="color:var(--muted);font-size:.92rem">Drag the sliders to see how consistent investing can grow over time.</p>
          <div class="field"><label>Starting amount <span class="val" id="c-start-v">$5,000</span></label><input type="range" id="c-start" min="0" max="100000" step="1000" value="5000"></div>
          <div class="field"><label>Monthly contribution <span class="val" id="c-monthly-v">$400</span></label><input type="range" id="c-monthly" min="0" max="3000" step="50" value="400"></div>
          <div class="field"><label>Years invested <span class="val" id="c-years-v">30 yrs</span></label><input type="range" id="c-years" min="1" max="45" step="1" value="30"></div>
          <div class="field"><label>Average annual return <span class="val" id="c-rate-v">8.0%</span></label><input type="range" id="c-rate" min="1" max="12" step="0.5" value="8"></div>
        </div>
        <div class="panel" style="display:flex;flex-direction:column;justify-content:center;background:var(--navy-800);color:#e6e1d3;border:none">
          <div class="calc-result">
            <p class="eyebrow" style="color:var(--gold-500)">Projected value</p>
            <div class="big" id="c-out" style="color:#fff">$0</div>
          </div>
          <div class="grid grid-2" style="gap:12px;margin-top:1rem">
            <div style="background:rgba(255,255,255,.08);border-radius:10px;padding:12px;text-align:center"><div style="font-size:.78rem;color:#a8a396">You put in</div><div id="c-contrib" style="font-family:var(--font-serif);font-size:1.3rem;color:#fff">$0</div></div>
            <div style="background:rgba(255,255,255,.08);border-radius:10px;padding:12px;text-align:center"><div style="font-size:.78rem;color:#a8a396">Growth</div><div id="c-growth" style="font-family:var(--font-serif);font-size:1.3rem;color:var(--gold-500)">$0</div></div>
          </div>
          <p style="margin-top:1rem;font-size:.86rem;color:#d8d4c6">Waiting 5 years to start could cost you about <strong id="c-delay" style="color:#fff">$0</strong> in ending value.</p>
          <p class="calc-note" style="color:#a8a396">Hypothetical illustration only; not a prediction. Actual returns vary and you can lose money.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      <div class="leadmag" data-lead-wrap>
        <div class="split" style="align-items:center">
          <div>
            <span class="badge-soft">Free PDF</span>
            <h2 style="margin-top:.6rem">The 10-Minute Investor Starter Guide</h2>
            <p style="color:#c8d7ec">Everything you actually need to begin — and the myths you can ignore. Enter your email and it’s yours.</p>
            <div data-lead-done hidden><p class="notice" style="background:#e7f4ee;border-color:#bfe3cf;color:#245c42">✓ Your guide is on the way — check your inbox!</p></div>
            <form data-lead id="gs-lead" action="#">
              <div class="field" style="margin-top:.6rem"><label style="color:#f1ede0">First name</label><input type="text" name="first_name" placeholder="First name"></div>
              <div class="form-row"><input type="email" name="email" required placeholder="you@email.com" aria-label="Email"><button class="btn btn--primary" type="submit">Send my guide</button></div>
              <p class="calc-note" style="color:#a8a396;margin-top:.6rem">We’ll never sell your info. Unsubscribe anytime.</p>
            </form>
          </div>
          <div class="media">
            <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:22px">
              <h4 style="color:#fff">Inside the guide</h4>
              <ul class="checklist" style="margin:.6rem 0 0">
                <li style="color:#f1ede0">The 5 moves that matter most</li>
                <li style="color:#f1ede0">How much you really need to start</li>
                <li style="color:#f1ede0">Roth vs. traditional in one page</li>
                <li style="color:#f1ede0">A simple first-year checklist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  ${ctaBand('')}`
});

/* ---------- CONTACT ---------- */
pages.push({
  file: 'contact.html', slug: 'contact.html', active: 'contact.html', prefix: '',
  title: 'Contact BRG Financial | Book a No-Cost Intro Call',
  description: 'Get in touch with BRG Financial. Call, email, or send a message to book a no-cost 20-minute intro call. Greater Philadelphia HQ — serving clients nationwide.',
  main: `
  ${pagehead('Contact', 'Let’s talk', 'Book a no-cost, 20-minute intro call. Tap to call or email directly, or send the form and we’ll get right back to you.', '', 'Contact')}
  <section class="section">
    <div class="container contact-grid">
      <div>
        <h2 style="margin-top:0">Reach us directly</h2>
        <div class="contact-line"><div class="ic">${I.phone}</div><div><div style="font-size:.82rem;color:var(--muted)">Call or text</div><a href="tel:${SITE.tel}">${SITE.phone}</a></div></div>
        <div class="contact-line"><div class="ic">${I.mail}</div><div><div style="font-size:.82rem;color:var(--muted)">Email</div><a href="mailto:${SITE.email}">${SITE.email}</a></div></div>
        <div class="contact-line"><div class="ic">${I.pin}</div><div><div style="font-size:.82rem;color:var(--muted)">Serving</div><strong style="color:var(--ink)">Headquartered in ${SITE.area} — clients nationwide</strong></div></div>
        <div class="contact-line" style="border-bottom:none"><div class="ic">${I.clock}</div><div><div style="font-size:.82rem;color:var(--muted)">Response time</div><strong style="color:var(--ink)">Usually within one business day</strong></div></div>
        <div class="notice" style="margin-top:1.4rem">Prefer LinkedIn? <a href="https://www.linkedin.com/" rel="noopener">Connect with Ben ${I.arrow}</a></div>
      </div>
      <div>
        <div class="card">
          <h3 style="margin-top:0">Send a message</h3>
          <p data-form-msg="contact-form" hidden class="notice" style="background:#e7f4ee;border-color:#bfe3cf;color:#245c42">Opening your email app to send — or reach us directly above.</p>
          <form id="contact-form" data-demo data-to="${SITE.email}" data-subject="Website inquiry from BRG Financial" action="#" method="post">
            <div class="field"><label for="cf-name">Name <span class="req">*</span></label><input id="cf-name" name="name" type="text" required></div>
            <div class="field"><label for="cf-email">Email <span class="req">*</span></label><input id="cf-email" name="email" type="email" required></div>
            <div class="field"><label for="cf-phone">Phone</label><input id="cf-phone" name="phone" type="tel"></div>
            <div class="field"><label for="cf-topic">I’m interested in</label>
              <select id="cf-topic" name="topic">
                <option>Investment management</option>
                <option>401(k) / rollover help</option>
                <option>A retirement plan for my business</option>
                <option>Retirement income planning</option>
                <option>Just exploring / other</option>
              </select>
            </div>
            <div class="field"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" rows="4" placeholder="A sentence about what you’re looking for..."></textarea></div>
            <button class="btn btn--primary btn--block" type="submit">Send message ${I.arrow}</button>
            <p class="form-note" style="margin-top:.8rem">By sending, you agree to be contacted about your inquiry. This form is for general contact only — please don’t include account numbers or sensitive personal information.</p>
          </form>
        </div>
      </div>
    </div>
  </section>`,
  scripts: '',
  jsonld: [{
    "@context": "https://schema.org", "@type": "ContactPage", "name": "Contact BRG Financial", "url": SITE.url + "/contact.html"
  }]
});

/* ---------- THANK YOU ---------- */
pages.push({
  file: 'thank-you.html', slug: 'thank-you.html', active: '', prefix: '',
  title: 'Thank You | BRG Financial',
  description: 'Thanks for reaching out to BRG Financial. We’ll be in touch shortly.',
  head: '<meta name="robots" content="noindex,follow">',
  main: `
  <section class="section" style="min-height:52vh;display:grid;place-items:center">
    <div class="container center measure" style="margin-inline:auto">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--green-050);color:var(--green-600);display:grid;place-items:center;margin:0 auto 1rem">${I.check}</div>
      <h1>Thanks — we got it.</h1>
      <p class="lead">We’ll be in touch within one business day. In the meantime, grab the free investor guide or read a few articles.</p>
      <div class="hero-cta" style="justify-content:center"><a class="btn btn--primary" href="get-started.html">Get the guide</a><a class="btn btn--ghost" href="insights.html">Read insights</a></div>
    </div>
  </section>`
});

/* ---------- DASHBOARD (Option C analytics demo) ---------- */
pages.push({
  file: 'dashboard.html', slug: 'dashboard.html', active: '', prefix: '',
  title: 'Marketing Analytics Dashboard (Demo) | BRG Financial',
  description: 'Sample customer-journey analytics dashboard for BRG Financial — traffic sources, lead channels, conversion funnel, and ROI by channel.',
  head: '<meta name="robots" content="noindex,nofollow">',
  main: `
  <section class="dash-head">
    <div class="container">
      <div><h1>Marketing &amp; Customer-Journey Analytics</h1><div class="who">BRG Financial · demo data · last 30 days vs. prior period</div></div>
      <div class="pill-row"><span class="pill" style="background:#fff">Aug 2026</span><a class="btn btn--primary" href="contact.html">This is a demo ${I.arrow}</a></div>
    </div>
  </section>
  <div class="section section--tight" style="background:var(--bg-soft)">
    <div class="container" style="display:grid;gap:18px">
      <div class="notice">Sample dashboard for illustration. In production this pulls live data from Google Analytics, your GoDaddy site, and social channels into a Looker Studio or Power BI view — refreshed automatically.</div>

      <div class="kpi-row">
        <div class="kpi"><div class="lbl">${I.chart} Website visitors</div><div class="num">806</div><div class="delta up">▲ 34% vs. prior</div></div>
        <div class="kpi"><div class="lbl">${I.spark} New leads</div><div class="num">50</div><div class="delta up">▲ 61% vs. prior</div></div>
        <div class="kpi"><div class="lbl">${I.scale} Lead conversion</div><div class="num">6.2%</div><div class="delta up">▲ 1.4 pts</div></div>
        <div class="kpi"><div class="lbl">${I.briefcase} Est. pipeline value</div><div class="num">$2.4M</div><div class="delta up">▲ 28%</div></div>
      </div>

      <div class="dash-grid">
        <div class="panel-card">
          <h3>Traffic by source</h3>
          <p class="sub">Sessions per month — organic and content are compounding</p>
          <div style="min-height:300px" id="chart-traffic"></div>
        </div>
        <div class="panel-card">
          <h3>Device mix</h3>
          <p class="sub">Most visitors are on mobile — why click-to-call matters</p>
          <div style="min-height:300px" id="chart-device"></div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="panel-card">
          <h3>Leads by channel</h3>
          <p class="sub">Where the last 30 days of leads came from</p>
          <div style="min-height:280px" id="chart-leads"></div>
        </div>
        <div class="panel-card">
          <h3>Conversion funnel</h3>
          <p class="sub">Visitor → lead → booked call → client</p>
          <div style="margin-top:1rem">
            <div class="funnel-row"><span class="flabel">Visitors</span><div class="funnel-bar" style="width:100%;background:#1e1e21">806</div></div>
            <div class="funnel-row"><span class="flabel">Engaged (2+ pages)</span><div class="funnel-bar" style="width:64%;background:#44403a">516</div></div>
            <div class="funnel-row"><span class="flabel">Leads captured</span><div class="funnel-bar" style="width:31%;background:#c9a227">50</div></div>
            <div class="funnel-row"><span class="flabel">Booked intro call</span><div class="funnel-bar" style="width:14%;background:#8a6d1a">18</div></div>
            <div class="funnel-row"><span class="flabel">Became client</span><div class="funnel-bar" style="width:5%;background:#9a4a35">4</div></div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <h3>ROI by channel</h3>
        <p class="sub">Spend, leads, and cost per lead across marketing streams</p>
        <div style="overflow-x:auto">
        <table class="data">
          <thead><tr><th>Channel</th><th class="num">Spend</th><th class="num">Leads</th><th class="num">Cost / lead</th><th class="num">Clients</th><th>Trend</th></tr></thead>
          <tbody>
            <tr><td>Organic search (SEO)</td><td class="num">$0</td><td class="num">17</td><td class="num">$0</td><td class="num">2</td><td><span class="up">▲ strong</span></td></tr>
            <tr><td>Free guide (lead magnet)</td><td class="num">$0</td><td class="num">14</td><td class="num">$0</td><td class="num">1</td><td><span class="up">▲ growing</span></td></tr>
            <tr><td>Blog / content</td><td class="num">$0</td><td class="num">9</td><td class="num">$0</td><td class="num">1</td><td><span class="up">▲ growing</span></td></tr>
            <tr><td>LinkedIn (organic)</td><td class="num">$0</td><td class="num">6</td><td class="num">$0</td><td class="num">0</td><td><span class="up">▲ steady</span></td></tr>
            <tr><td>Direct / referral</td><td class="num">$0</td><td class="num">4</td><td class="num">$0</td><td class="num">0</td><td>— flat</td></tr>
          </tbody>
        </table>
        </div>
        <p class="calc-note" style="margin-top:.8rem">Low-cost/no-cost-first strategy: every lead this period came from unpaid channels. Paid keywords can be layered in later and measured the same way.</p>
      </div>

      <div class="panel-card">
        <h3>Leads by state</h3>
        <p class="sub">Where interest is coming from — informs where to focus</p>
        <div style="overflow-x:auto">
        <table class="data">
          <thead><tr><th>State</th><th class="num">Visitors</th><th class="num">Leads</th><th class="num">Share</th></tr></thead>
          <tbody>
            <tr><td>Pennsylvania</td><td class="num">468</td><td class="num">31</td><td class="num">62%</td></tr>
            <tr><td>New Jersey</td><td class="num">212</td><td class="num">13</td><td class="num">26%</td></tr>
            <tr><td>Texas</td><td class="num">61</td><td class="num">3</td><td class="num">6%</td></tr>
            <tr><td>Other</td><td class="num">65</td><td class="num">3</td><td class="num">6%</td></tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>`,
  scripts: '<script src="assets/js/dashboard.js" defer></script>'
});

/* ---------- DISCLOSURES ---------- */
pages.push({
  file: 'disclosures.html', slug: 'disclosures.html', active: '', prefix: '',
  title: 'Disclosures & Privacy | BRG Financial',
  description: 'Regulatory disclosures, Form ADV information, and privacy policy for BRG Financial, a Registered Investment Adviser.',
  head: '<meta name="robots" content="noindex,follow">',
  main: `
  ${pagehead('Legal', 'Disclosures &amp; Privacy', '', '', 'Disclosures')}
  <section class="section"><div class="container article">
    <h2>Regulatory disclosure</h2>
    <p>${SITE.legal} (“BRG Financial”) is a Registered Investment Adviser. Registration does not imply a certain level of skill or training. BRG Financial is registered in Pennsylvania and New Jersey and may transact business in other states where it is registered or exempt from registration.</p>
    <p>The information on this website is provided for general informational and educational purposes only and should not be construed as personalized investment, legal, or tax advice, nor as an offer or solicitation to buy or sell any security. Advice is provided only pursuant to a written advisory agreement.</p>
    <h2>Investment risk</h2>
    <p>All investing involves risk, including the possible loss of principal. Diversification and strategy do not ensure a profit or protect against loss. Past performance is not indicative of future results. Any calculators, projections, or illustrations shown are hypothetical, rely on assumptions that may not reflect actual conditions, and are provided solely for educational purposes.</p>
    <h2>Testimonials</h2>
    <p>Consistent with applicable regulations, this website does not publish client testimonials or endorsements.</p>
    <h2>Form ADV</h2>
    <p>Our Form ADV Part 2 (firm brochure) and relationship disclosures are available on request and via the SEC’s Investment Adviser Public Disclosure website. Please contact us at <a href="mailto:${SITE.email}">${SITE.email}</a> for a copy.</p>
    <h2 id="privacy">Privacy policy</h2>
    <p>We collect only the information you choose to provide (such as your name and email through our forms) and information automatically collected for website analytics. We do not sell your personal information. Contact-form submissions are used solely to respond to your inquiry. For questions about your data, email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
    <p class="calc-note">This page is a demo template. Final disclosure and privacy language should be reviewed and approved by the firm’s compliance process before publication.</p>
  </div></section>`
});

/* ---------- 404 ---------- */
pages.push({
  file: '404.html', slug: '404.html', active: '', prefix: '',
  title: 'Page Not Found | BRG Financial',
  description: 'The page you were looking for could not be found.',
  head: '<meta name="robots" content="noindex,follow">',
  main: `
  <section class="section" style="min-height:56vh;display:grid;place-items:center">
    <div class="container center measure" style="margin-inline:auto">
      <p class="eyebrow">404</p>
      <h1>We couldn’t find that page</h1>
      <p class="lead">It may have moved. Try one of these instead:</p>
      <div class="hero-cta" style="justify-content:center"><a class="btn btn--primary" href="index.html">Home</a><a class="btn btn--ghost" href="services.html">Services</a><a class="btn btn--ghost" href="contact.html">Contact</a></div>
    </div>
  </section>`
});

/* ============================================================
   WRITE FILES
   ============================================================ */
pages.forEach(pg => {
  const html = layout(pg);
  const full = path.join(OUT, pg.file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
});

/* ---- sitemap.xml ---- */
const sm = pages
  .filter(p => !/(thank-you|dashboard|disclosures|404)/.test(p.file))
  .map(p => `  <url><loc>${SITE.url}/${p.slug}</loc><changefreq>monthly</changefreq></url>`).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm}\n</urlset>\n`);

/* ---- robots.txt ---- */
fs.writeFileSync(path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /dashboard.html\nDisallow: /thank-you.html\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

/* ---- favicon.svg + og placeholder note ---- */
fs.writeFileSync(path.join(OUT, 'assets/img/favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#101012"/><path d="M13 34V14h9.2c3.9 0 6.3 1.9 6.3 5.1 0 2.2-1.2 3.7-3.2 4.4 2.5.5 4 2.2 4 4.8 0 3.5-2.6 5.7-6.8 5.7H13z" fill="#fff"/><path d="M31 34l4.8-10L31 14h4.3l2.7 6.4 2.7-6.4H45l-4.8 10L45 34h-4.4l-2.8-6.6L35 34h-4z" fill="#c9a227"/></svg>`);

/* ---- CNAME hint (commented usage in README) ---- */
console.log('Generated ' + pages.length + ' HTML pages + sitemap/robots/favicon.');
