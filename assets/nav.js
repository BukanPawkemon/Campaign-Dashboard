// Shared site chrome for the Dalang - Campaign Dashboard user guide.
// Two custom elements, <site-nav current="key"> and <site-footer>, so the
// same nav/footer markup doesn't have to be hand-copied into every page.
// No shadow DOM on purpose, so assets/style.css applies normally.
(function () {
  var TOP_LEVEL = [
    { key: "home", href: "index.html", label: "Home" },
    { key: "getting-started", href: "getting-started.html", label: "Getting Started" },
  ];

  var PAGES = [
    { group: "About", items: [
      { key: "philosophy", href: "philosophy.html", label: "Philosophy" },
      { key: "background", href: "background.html", label: "Background" },
      { key: "legal", href: "legal.html", label: "Legal & Sources" },
    ] },
    { group: "Preparation", items: [
      { key: "story", href: "story.html", label: "Story" },
      { key: "gameplay", href: "gameplay.html", label: "Gameplay" },
      { key: "campaign-prep", href: "campaign-prep.html", label: "Campaign Prep" },
      { key: "maps", href: "maps.html", label: "Setting Up a Map" },
      { key: "npc", href: "npc.html", label: "NPC" },
      { key: "job-board", href: "job-board.html", label: "Job Board / Quest" },
      { key: "players", href: "players.html", label: "Players" },
    ] },
    { group: "Running a Session", items: [
      { key: "running-a-session", href: "running-a-session.html", label: "Running a Live Session" },
      { key: "player-window", href: "player-window.html", label: "The Player Window" },
      { key: "event-log", href: "event-log.html", label: "Event Log" },
    ] },
    { group: "Reference", items: [
      { key: "compendium", href: "compendium.html", label: "Compendium" },
      { key: "dice-roller", href: "dice-roller.html", label: "Dice Roller" },
    ] },
    { group: "Settings", items: [
      { key: "campaign-settings", href: "campaign-settings.html", label: "Campaign Settings" },
      { key: "player-guide", href: "player-guide.html", label: "Player Guide" },
      { key: "library", href: "library.html", label: "Library" },
    ] },
    { group: "Dalang Web", items: [
      { key: "dalang-web", href: "dalang-web.html", label: "Using Dalang Web" },
    ] },
    { group: "Get the App", items: [
      { key: "download", href: "download.html", label: "Download" },
    ] },
  ];

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Sticky top bar across every guide page: brand back to the landing
  // page, plus a Sign in call to action for Dalang Web. Injected once from
  // whichever <site-nav> mounts first, so individual pages don't each have
  // to include it.
  function injectTopbar() {
    if (document.querySelector(".site-topbar")) return;
    var bar = document.createElement("div");
    bar.className = "site-topbar";
    bar.innerHTML =
      '<a class="site-topbar-brand" href="https://dalang.page/" aria-label="Dalang home">'
      + '<img src="images/dalang-logo.png" alt="Dalang" /></a>'
      + '<nav class="site-topbar-nav">'
      + '<a href="https://dalang.page/">dalang.page</a>'
      + '<a class="site-topbar-cta" href="https://app.dalang.page/">Sign in</a>'
      + '</nav>';
    document.body.prepend(bar);
  }

  class SiteNav extends HTMLElement {
    connectedCallback() {
      injectTopbar();
      var current = this.getAttribute("current") || "";
      var html = '<a class="brand-link" href="index.html" aria-label="Dalang - Campaign Dashboard, home">'
        + '<div class="brand"><img src="images/dalang-logo.png" alt="Dalang - Campaign Dashboard" /></div>'
        + '</a>'
        + '<div class="brand-sub">User Guide</div>'
        + '<ol>';
      TOP_LEVEL.forEach(function (item) {
        var cls = item.key === current ? ' class="active"' : '';
        html += '<li><a href="' + item.href + '"' + cls + '>' + escapeHtml(item.label) + '</a></li>';
      });
      PAGES.forEach(function (group) {
        html += '<li class="group-label">' + escapeHtml(group.group) + '</li>';
        group.items.forEach(function (item) {
          var cls = item.key === current ? ' class="active"' : '';
          html += '<li><a href="' + item.href + '"' + cls + '>' + escapeHtml(item.label) + '</a></li>';
        });
      });
      html += '</ol>';
      this.setAttribute("aria-label", "Site navigation");
      this.classList.add("toc");
      this.innerHTML = html;
    }
  }

  var DISCORD_ICON = '<svg class="discord-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">'
    + '<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.522 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>'
    + '</svg>';

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<div class="footer-cta">'
        + '<div><strong>Dalang Web</strong> runs all of this from a browser, free during the beta, '
        + 'with a live read-only link for your players.</div>'
        + '<a class="footer-cta-btn" href="https://app.dalang.page/">Create a free account</a>'
        + '</div>'
        + '<div class="footer-links">Dalang, Campaign Dashboard User Guide &middot; '
        + '<a href="index.html">Home</a> &middot; '
        + '<a href="https://dalang.page/">dalang.page</a> &middot; '
        + '<a href="download.html">Download</a> &middot; '
        + '<a href="https://github.com/BukanPawkemon/Campaign-Dashboard">GitHub</a> &middot; '
        + '<a href="https://discord.gg/Q7CKz9Sbw" class="discord-link">' + DISCORD_ICON + ' Discord</a></div>';
    }
  }

  if (!customElements.get("site-nav")) customElements.define("site-nav", SiteNav);
  if (!customElements.get("site-footer")) customElements.define("site-footer", SiteFooter);
})();
