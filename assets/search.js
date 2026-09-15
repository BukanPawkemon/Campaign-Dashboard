// Client-side search for the Dalang user guide. A small command-palette
// style overlay, opened with Cmd/Ctrl+K, the "/" key, or the Search
// button in the top bar.
//
// No build step and no server. The search index is built in the browser
// the first time it is needed: every guide page listed in the sidebar is
// fetched, its headings and text pulled out, and the result kept in
// sessionStorage for the rest of the visit. The current page is read
// straight from the DOM instead of being re-fetched.
//
// Loaded once per page by assets/nav.js.
(function () {
  "use strict";

  var CACHE_KEY = "dalang-guide-search-v1";
  var index = null; // array of records once built
  var building = null; // in-flight Promise while the index builds
  var lastFocus = null;
  var overlay, input, listEl, statusEl;
  var results = [];
  var activeIndex = 0;
  var queryTimer = null;

  function currentFile() {
    var name = location.pathname.split("/").pop();
    return name || "index.html";
  }

  // The rendered sidebar lists every guide page, so use it as the set of
  // pages to index. That way this never drifts from the real navigation.
  function pageLinks() {
    var seen = {};
    var out = [];
    document.querySelectorAll(".toc ol a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (/^https?:/i.test(href) || href.indexOf(".html") === -1) return;
      href = href.split("#")[0].split("?")[0];
      if (!href || seen[href]) return;
      seen[href] = true;
      out.push({ href: href, label: (a.textContent || "").trim() });
    });
    if (!seen["index.html"]) out.unshift({ href: "index.html", label: "Home" });
    return out;
  }

  function clean(str) {
    return (str || "").replace(/\s+/g, " ").trim();
  }

  function recordsFromDoc(doc, page, into) {
    var main = doc.querySelector("main");
    if (!main) return;

    var lede = main.querySelector(".lede");
    var h1 = main.querySelector("h1");
    into.push({
      href: page.href,
      anchor: "",
      page: page.label,
      title: page.label || clean(h1 && h1.textContent) || page.href,
      body: clean(lede && lede.textContent).slice(0, 400),
      kind: "page"
    });

    main.querySelectorAll("h2, h3, summary").forEach(function (h) {
      var title = clean(h.textContent);
      if (!title) return;

      var anchor = h.id || "";
      if (!anchor) {
        var holder = h.closest("[id]");
        if (holder && holder !== main) anchor = holder.id;
      }

      var body = "";
      if (h.tagName === "SUMMARY") {
        var parent = h.parentElement;
        body = clean(parent && parent.textContent);
        if (body.indexOf(title) === 0) body = body.slice(title.length);
      } else {
        var node = h.nextElementSibling;
        var guard = 0;
        while (node && !/^H[1-4]$/.test(node.tagName) && guard < 14) {
          body += " " + clean(node.textContent);
          node = node.nextElementSibling;
          guard++;
        }
      }

      into.push({
        href: page.href,
        anchor: anchor,
        page: page.label,
        title: title,
        body: clean(body).slice(0, 700),
        kind: "section"
      });
    });
  }

  function buildIndex() {
    if (index) return Promise.resolve(index);
    if (building) return building;

    try {
      var cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        index = JSON.parse(cached);
        return Promise.resolve(index);
      }
    } catch (e) {
      /* private mode or full storage, fall through and build in memory */
    }

    var pages = pageLinks();
    var records = [];
    var here = currentFile();

    building = Promise.all(
      pages.map(function (page) {
        var work =
          page.href === here
            ? Promise.resolve(document)
            : fetch(page.href)
                .then(function (r) {
                  if (!r.ok) throw new Error(r.status);
                  return r.text();
                })
                .then(function (html) {
                  return new DOMParser().parseFromString(html, "text/html");
                });
        return work
          .then(function (doc) {
            recordsFromDoc(doc, page, records);
          })
          .catch(function () {
            /* skip a page that failed to load */
          });
      })
    ).then(function () {
      index = records;
      building = null;
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(records));
      } catch (e) {
        /* over quota, keep the in-memory copy */
      }
      return index;
    });

    return building;
  }

  function scoreRecord(rec, terms, phrase) {
    var title = rec.title.toLowerCase();
    var body = rec.body.toLowerCase();
    var page = rec.page.toLowerCase();
    var total = 0;

    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var inTitle = title.indexOf(term) !== -1;
      var inBody = body.indexOf(term) !== -1;
      var inPage = page.indexOf(term) !== -1;
      if (!inTitle && !inBody && !inPage) return -1; // every term must appear somewhere
      if (inTitle) total += 9;
      if (inBody) total += 2;
      if (inPage) total += 1;
      if (title.indexOf(term) === 0) total += 4;
    }

    if (title === phrase) total += 25;
    else if (title.indexOf(phrase) === 0) total += 12;
    else if (title.indexOf(phrase) !== -1) total += 6;
    if (rec.kind === "page") total += 1;
    return total;
  }

  function runSearch(raw) {
    var phrase = raw.trim().toLowerCase();
    if (!phrase || !index) return [];
    var terms = phrase.split(/\s+/).filter(Boolean);
    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var s = scoreRecord(index[i], terms, phrase);
      if (s > 0) scored.push([s, index[i]]);
    }
    scored.sort(function (a, b) {
      return b[0] - a[0];
    });
    return scored.slice(0, 30).map(function (pair) {
      return pair[1];
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlight(text, phrase) {
    var safe = escapeHtml(text);
    var terms = phrase.trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return safe;
    var re = new RegExp(
      "(" +
        terms
          .map(function (t) {
            return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          })
          .join("|") +
        ")",
      "ig"
    );
    return safe.replace(re, "<mark>$1</mark>");
  }

  function snippet(rec, phrase) {
    if (!rec.body) return "";
    var body = rec.body;
    var term = phrase.trim().split(/\s+/)[0].toLowerCase();
    var at = body.toLowerCase().indexOf(term);
    if (at > 60) body = "…" + body.slice(at - 40);
    return body.slice(0, 150);
  }

  function targetHref(rec) {
    return rec.href + (rec.anchor ? "#" + rec.anchor : "");
  }

  function renderResults(phrase) {
    listEl.innerHTML = "";
    if (!phrase.trim()) {
      statusEl.textContent = index
        ? "Type to search every page of the guide."
        : "Type to search. The index builds on the first search.";
      return;
    }
    if (!index) {
      statusEl.textContent = "Building the search index…";
      return;
    }
    if (!results.length) {
      statusEl.textContent = 'No matches for "' + phrase.trim() + '".';
      return;
    }
    statusEl.textContent =
      results.length + (results.length === 1 ? " result" : " results");

    results.forEach(function (rec, i) {
      var li = document.createElement("li");
      li.className = "gs-result" + (i === activeIndex ? " is-active" : "");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      li.id = "gs-result-" + i;

      var a = document.createElement("a");
      a.href = targetHref(rec);
      a.tabIndex = -1;
      a.innerHTML =
        '<span class="gs-result-title">' +
        highlight(rec.title, phrase) +
        "</span>" +
        '<span class="gs-result-page">' +
        escapeHtml(rec.page) +
        "</span>" +
        (rec.kind === "section" && snippet(rec, phrase)
          ? '<span class="gs-result-snippet">' +
            highlight(snippet(rec, phrase), phrase) +
            "</span>"
          : "");

      a.addEventListener("click", function (e) {
        e.preventDefault();
        go(rec);
      });
      li.appendChild(a);
      li.addEventListener("mousemove", function () {
        if (activeIndex !== i) {
          activeIndex = i;
          paintActive();
        }
      });
      listEl.appendChild(li);
    });
  }

  function paintActive() {
    var items = listEl.querySelectorAll(".gs-result");
    items.forEach(function (el, i) {
      var on = i === activeIndex;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
      if (on) el.scrollIntoView({ block: "nearest" });
    });
    input.setAttribute(
      "aria-activedescendant",
      items[activeIndex] ? "gs-result-" + activeIndex : ""
    );
  }

  function refresh() {
    var phrase = input.value;
    results = runSearch(phrase);
    activeIndex = 0;
    renderResults(phrase);
    paintActive();
  }

  function go(rec) {
    var here = currentFile();
    close();
    if (rec.href === here) {
      if (rec.anchor) {
        location.hash = rec.anchor;
        openDetailsFor(rec.anchor);
        var el = document.getElementById(rec.anchor);
        if (el) el.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      location.href = targetHref(rec);
    }
  }

  function openDetailsFor(id) {
    var el = document.getElementById(id);
    var d = el && el.closest("details");
    if (d) d.open = true;
  }

  function open() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    document.body.classList.add("gs-lock");
    input.value = "";
    results = [];
    renderResults("");
    input.focus();
    buildIndex().then(function () {
      if (overlay.classList.contains("is-open")) refresh();
    });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("gs-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function isOpen() {
    return overlay && overlay.classList.contains("is-open");
  }

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "gs-overlay";
    overlay.innerHTML =
      '<div class="gs-panel" role="dialog" aria-modal="true" aria-label="Search the guide">' +
      '<div class="gs-input-row">' +
      '<svg class="gs-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input class="gs-input" type="text" role="combobox" aria-expanded="true" aria-controls="gs-results" aria-autocomplete="list" placeholder="Search the guide" autocomplete="off" spellcheck="false" />' +
      '<kbd class="gs-esc">Esc</kbd>' +
      "</div>" +
      '<ul class="gs-results" id="gs-results" role="listbox"></ul>' +
      '<div class="gs-status" aria-live="polite"></div>' +
      "</div>";

    input = overlay.querySelector(".gs-input");
    listEl = overlay.querySelector(".gs-results");
    statusEl = overlay.querySelector(".gs-status");

    overlay.addEventListener("mousedown", function (e) {
      if (e.target === overlay) close();
    });

    input.addEventListener("input", function () {
      clearTimeout(queryTimer);
      queryTimer = setTimeout(refresh, 90);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (results.length) {
          activeIndex = (activeIndex + 1) % results.length;
          paintActive();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (results.length) {
          activeIndex = (activeIndex - 1 + results.length) % results.length;
          paintActive();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIndex]) go(results[activeIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    });

    document.body.appendChild(overlay);
  }

  function typingInField(el) {
    if (!el) return false;
    var tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    );
  }

  function wireShortcuts() {
    document.addEventListener("keydown", function (e) {
      var mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        isOpen() ? close() : open();
        return;
      }
      if (e.key === "Escape" && isOpen()) {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "/" && !mod && !e.altKey && !isOpen() && !typingInField(e.target)) {
        e.preventDefault();
        open();
      }
    });

    document.querySelectorAll("[data-guide-search]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
    });
  }

  // Open a collapsed answer when the page is loaded or navigated straight
  // to one of its ids (a shared link, or a search result on this page).
  function openDetailsFromHash() {
    if (location.hash.length > 1) openDetailsFor(location.hash.slice(1));
  }

  function init() {
    buildOverlay();
    wireShortcuts();
    openDetailsFromHash();
    window.addEventListener("hashchange", openDetailsFromHash);

    // Warm the index once per visit, a few seconds after the first page
    // settles, so the first Cmd/Ctrl+K is instant. Guarded so it runs on
    // one page per session, not every page.
    try {
      if (
        !sessionStorage.getItem(CACHE_KEY) &&
        !sessionStorage.getItem(CACHE_KEY + "-warm")
      ) {
        sessionStorage.setItem(CACHE_KEY + "-warm", "1");
        setTimeout(buildIndex, 4000);
      }
    } catch (e) {
      /* no storage, skip warming */
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
