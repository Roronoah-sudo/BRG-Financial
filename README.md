# BRG Financial — Website (Demo Build)

A brand-new, fully responsive website for **BRG Financial**, a fiduciary Registered
Investment Adviser serving Greater Philadelphia (PA & NJ). Built as static
HTML/CSS/JS with **no build step and no framework** — every page is a plain file you
can open, edit, and host directly on GitHub Pages.

This build delivers everything in **Options A, B, and C** from the proposal.

---

## Quick start (view locally)

Just open `index.html` in a browser, or serve the folder:

```bash
# any static server works; here are two options
python3 -m http.server 8080      # then visit http://localhost:8080
# or
npx serve .
```

## Deploy to GitHub Pages (for the demo)

1. Create a new GitHub repository (e.g. `brg-financial-site`).
2. Upload the entire contents of this folder to the repo root
   (so `index.html` sits at the top level).
3. In the repo: **Settings → Pages → Build and deployment**.
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` / `/ (root)` → **Save**
4. Wait ~1 minute. Your demo is live at
   `https://<your-username>.github.io/brg-financial-site/`
5. (Optional) To use the real domain later, add a `CNAME` file containing
   `brgfinancial.net` and point DNS at GitHub Pages — but for the demo the
   github.io URL is enough. When it moves to GoDaddy, the same files upload there.

> A `.nojekyll` file is included so GitHub Pages serves the files as-is.

---

## Page map

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, value props, services, growth stat, insights, lead magnet |
| `services.html` | Services overview + services FAQ |
| `401k-erisa.html` | **Niche SEO page** — 401(k)/403(b)/ERISA for individuals & employers |
| `investment-management.html` | Investment philosophy (tactical/alternatives) |
| `retirement-income.html` | Withdrawal, Social Security, Roth conversions, Monte Carlo |
| `about.html` | About the firm & adviser |
| `faq.html` | Full FAQ with structured data |
| `insights.html` | Blog index (automation-ready) |
| `blog/*.html` | 4 sample articles (advisor cost, Roth vs. traditional, investing in your 20s, small-business 401k) |
| `get-started.html` | **Lead magnet** + interactive compound-growth calculator |
| `contact.html` | Contact page — click-to-call, click-to-email, working form |
| `dashboard.html` | **Customer-journey analytics dashboard** (Option C demo) |
| `disclosures.html` | RIA disclosures & privacy |
| `thank-you.html`, `404.html` | Utility pages |
| `sitemap.xml`, `robots.txt` | SEO plumbing |

Shared assets live in `assets/` (`css/styles.css`, `js/main.js`, `js/dashboard.js`, `img/`).

---

## How each option is delivered

### Option A — Basic overhaul + contact fixes
- Complete, modern, finished visual design (no placeholder "black squares"); real inline SVG icons and a custom logo.
- **Click-to-call** everywhere (`tel:` links) — works on mobile.
- **Click-to-email** everywhere (`mailto:` links).
- **Working contact form** on `contact.html` (see "Wire up the form" below).
- Fully responsive with a mobile nav menu.

### Option B — SEO optimization
- **Niche keywords:** dedicated `401k-erisa.html` targeting 401(k)/403(b)/ERISA (low-competition) plus keyword-rich titles, meta descriptions, and headings throughout.
- **Depth + FAQs:** deep services content and FAQ sections with **FAQ structured data (JSON-LD)** so Google can show rich results.
- **Local SEO:** "Greater Philadelphia · PA & NJ" signals, `FinancialService`/`LocalBusiness` JSON-LD with `areaServed`, and address markup. *(Confirm the exact address/PO box with compliance before publishing — see note below.)*
- **Lead magnet:** gated "10-Minute Investor Starter Guide" email capture on the home and `get-started.html`.
- **AI-search ready:** semantic HTML, clean metadata, Open Graph tags, `sitemap.xml`, and `robots.txt`.

### Option C — Automation & analytics
- **Blog built for automation:** articles are data objects (`POSTS` in the generator) rendered from one template — a monthly AI job appends a new object and regenerates. See "Automated blog" below.
- **Auto cross-posting:** every article has LinkedIn / Facebook / X share buttons and Open Graph tags so posts render nicely when shared.
- **Customer-journey analytics dashboard** (`dashboard.html`): KPIs, traffic-by-source, device mix, leads-by-channel, a visitor→client conversion funnel, ROI-by-channel, and leads-by-state — all self-contained SVG (no external dependencies). Sample data now; wired to live data in production.

---

## Making it real (production notes)

**Wire up the contact & lead forms.** The forms currently use a `mailto:` fallback
(they open the visitor's email app pre-filled). For silent, reliable delivery to
`info@brgfinancial.net`, set each form's `action` to a real endpoint:

- **Formspree** (fastest): create a form, then set
  `action="https://formspree.io/f/XXXX" method="POST"` on the `<form>` and the JS
  fallback steps aside automatically.
- Or use **GoDaddy Websites + Marketing** form/email tools (already on the plan).

**Automated blog.** In `gen.js` (included at the repo root), blog posts live in the `POSTS` array.
The monthly workflow: an AI step drafts a post in Ben's voice → appends an object to
`POSTS` → re-run the generator → the new `blog/<slug>.html`, the insights index, and
`sitemap.xml` all update. Cross-posting to LinkedIn/Facebook can be automated from
the same step.

**Analytics dashboard.** `dashboard.html` uses illustrative data. In production it's
fed by Google Analytics (GA4), the GoDaddy site, and social exports into **Looker
Studio** or **Power BI**, then embedded or linked. The current page shows the exact
layout and metrics.

**Swap in real details.** Advisor name/bio (`SITE.advisor` in the generator), logo,
and the LinkedIn URL are placeholders — easy to replace.

---

## Compliance checklist (for Ben)

This build was made with RIA rules in mind, but please confirm before publishing:

- **No testimonials** are used anywhere (per PA rule). Keep it that way.
- **Wording:** the site frames planning as part of investment management and avoids
  advertising a formal "written financial plan" as a standalone product. Review the
  language on `services.html` and `retirement-income.html`.
- **Address / location:** decide on a home address, PO box, or "Greater Philadelphia"
  branding for the local-SEO markup in the page `<head>` (JSON-LD) and footer.
- **Disclosures:** `disclosures.html` is a template — have it reviewed/approved.
- **Form ADV** link and any required regulatory language.

---

## Editing tips

- Global colors, fonts, and components: `assets/css/styles.css` (CSS variables at the top).
- Site name, phone, email, advisor name: the `SITE` object in `gen.js`.
- Pages are regenerated with `node gen.js` (writes into this folder). You can also
  edit the `.html` files directly if you prefer not to use the generator.

*Built for BRG Financial by Grand Line Analytics.*
