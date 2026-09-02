# Dalang Web landing page

`web/index.html` is the marketing landing page for Dalang Web (BACKLOG 200).

- **`dalang.page/`** serves this page (the `web/` folder, a Cloudflare
  Pages project)
- **`app.dalang.page/`** serves the SPA (Cloudflare Pages building
  `npm run build:web` from the main repo)
- **`guide.dalang.page/`** serves the user guide (the rest of this repo,
  on GitHub Pages via a `CNAME` custom domain), linked from here

The real domain (`dalang.page` / `https://app.dalang.page`) is already
wired into `index.html`.

Self-contained: inline CSS, one Google Fonts link, and local assets:
`dalang-web.svg` (hero), `dalang-wordmark.svg` (header), `dalang-logo.svg`
(spare), `itchio-icon.png`, `favicon.png`, `og-image.png` (the share-card
image, 1200x630, copied from the repo's `images/og-image.png`), and
`screenshots/` (four images copied from the repo's own `screenshots/`
folder, used as selling points). The brand SVGs are the source of truth in
the app repo's `src/assets/brand/`, copied here by hand. No build step.
Drop the whole `web/` folder at the root of the Cloudflare Pages project
(or wherever `dalang.page` is served from).

SEO / GEO files, also served from this folder root:

- `robots.txt` and `sitemap.xml`, pointing at `https://dalang.page/`.
- `404.html`, a branded not-found page. It shows a short message and then
  `<meta http-equiv="refresh">` sends the visitor to `/` after 7 seconds
  (a JS redirect would be blocked by the CSP; the delay keeps it a real
  404 rather than an instant redirect Google would read as a soft 404).
  Cloudflare Pages serves this file with a real 404 status for unknown
  paths **only if** the Pages project is not in "Single Page Application"
  mode. As of the last check `dalang.page` still returned `200` + the home
  page for any unknown path, so if that is still true after this deploy,
  turn off the SPA / catch-all setting for this Pages project in the
  dashboard.
- `index.html` carries a `WebApplication` and a `FAQPage` JSON-LD block,
  Open Graph + Twitter card tags, and a real `<h1>`. The visible FAQ
  section and the `FAQPage` JSON-LD must be kept in sync (Google requires
  the structured-data answers to match the on-page text).

The screenshots are the shared UI captured in Dalang Desktop; Dalang Web
looks the same. Swap in real web captures when there are some.

Tone and the itch.io CTA match the existing guide site. Draft, not
reviewed.
