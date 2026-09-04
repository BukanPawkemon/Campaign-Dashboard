# Dalang, a D&D Campaign Manager for Dungeon Masters

**Dalang** is a Dungeons & Dragons campaign manager and session tool for
Dungeon Masters. Prep the world and house rules, a location hierarchy with
encounters and treasure, an NPC roster, and a job board; run the session
with a live battle map (grid, tokens, initiative, fog of war); hand players
one read-only link that shows the current scene with no sign-in; and keep a
permanent event log. It also suits play-by-post and games run over Discord
or Telegram.

It is **local-first and free**. Dalang Desktop stores everything in a file
on your own machine, makes no network calls, and works fully offline.
Dalang Web is the same app in a browser, with a free account, and a
campaign moves between the two in either direction.

## Links

| | |
|---|---|
| Landing page | <https://dalang.page> |
| Dalang Web (browser app, free beta) | <https://app.dalang.page> |
| User guide | <https://guide.dalang.page> |
| Dalang Desktop (Windows, pay what you want) | <https://bukanpawkemon.itch.io/dalang-campaign-dashboard> |
| Community | <https://discord.gg/Q7CKz9Sbw> |

## How Dalang compares

Roll20 and Foundry VTT are virtual tabletops built around running the
tactical fight online. World Anvil and Kanka are worldbuilding wikis with
deep interlinked lore but no battle map. Dalang sits between them:
connected campaign prep, a light live battle map, and a one-link player
view, local-first and free. Full comparison:
<https://guide.dalang.page/compare.html>

## This repository

This repo is the source of the **user guide** (`guide.dalang.page`) and the
**landing page** (`dalang.page/`), both published via GitHub Pages. It is a
static, no-build-step site:

- `index.html` is the guide home, one `.html` file per feature
  (`npc.html`, `dice-roller.html`, and so on)
- `faq.html` and `compare.html` are the FAQ and comparison pages
- `assets/style.css` is the shared stylesheet
- `assets/nav.js` holds the shared nav and footer as two small custom
  elements (`<site-nav>` / `<site-footer>`), so the chrome is not
  hand-copied into every page
- `web/` is the separate landing page served at `dalang.page/`
- `screenshots/` are from a throwaway demo campaign (Guild Founding), not
  real campaign content

Dalang is made by one independent developer and is not affiliated with or
endorsed by Wizards of the Coast. See
<https://guide.dalang.page/legal.html> for licensing and SRD attribution.
