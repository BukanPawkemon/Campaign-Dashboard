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
      { key: "library", href: "library.html", label: "Library" },
    ] },
    { group: "Get the App", items: [
      { key: "download", href: "download.html", label: "Download" },
    ] },
  ];

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  class SiteNav extends HTMLElement {
    connectedCallback() {
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

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = 'Dalang, Campaign Dashboard User Guide &middot; '
        + '<a href="index.html">Home</a> &middot; '
        + '<a href="download.html">Download the demo</a> &middot; '
        + '<a href="https://github.com/BukanPokemon/Campaign-Dashboard">GitHub</a>';
    }
  }

  if (!customElements.get("site-nav")) customElements.define("site-nav", SiteNav);
  if (!customElements.get("site-footer")) customElements.define("site-footer", SiteFooter);
})();
