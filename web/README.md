# Dalang Web landing page

`web/index.html` is the marketing landing page for Dalang Web (BACKLOG 200).

- **`dalang.page/`** serves this page (the `web/` folder)
- **`app.dalang.page/`** serves the SPA (Cloudflare Pages building
  `npm run build:web` from the main repo)
- The existing user guide stays at
  `bukanpawkemon.github.io/Campaign-Dashboard/` for now, linked from here,
  and moves under `dalang.page` later

The real domain (`dalang.page` / `https://app.dalang.page`) is already
wired into `index.html`.

Self-contained: inline CSS, one Google Fonts link, and local assets:
`dalang-logo.png`, `itchio-icon.png`, `favicon.png`, and `screenshots/`
(four images copied from the repo's own `screenshots/` folder, used as
selling points). No build step. Drop the whole `web/` folder at the root
of the Cloudflare Pages project (or wherever `dalang.page` is served from).

The screenshots are the shared UI captured in Dalang Desktop; Dalang Web
looks the same. Swap in real web captures when there are some.

Tone and the itch.io CTA match the existing guide site. Draft, not
reviewed.
