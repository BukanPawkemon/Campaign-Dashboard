// Click-to-zoom lightbox for screenshots. Applies to every <img> inside a
// <figure> (screenshots), not standalone images like the brand marks on the
// Philosophy page. Shared across every page via one
// <script src="assets/lightbox.js" defer></script>, same pattern as nav.js.
(function () {
  var ZOOM_STEPS = [1, 1.5, 2, 2.75, 3.5];
  var zoomIndex = 0;
  var overlay, imgEl, toolbar;

  function applyZoom() {
    imgEl.style.transform = "scale(" + ZOOM_STEPS[zoomIndex] + ")";
    overlay.classList.toggle("is-zoomed", zoomIndex > 0);
  }
  function zoomIn() {
    if (zoomIndex < ZOOM_STEPS.length - 1) {
      zoomIndex++;
      applyZoom();
    }
  }
  function zoomOut() {
    if (zoomIndex > 0) {
      zoomIndex--;
      applyZoom();
    }
  }
  function resetZoom() {
    zoomIndex = 0;
    overlay.scrollTop = 0;
    overlay.scrollLeft = 0;
    applyZoom();
  }
  function open(src, alt) {
    zoomIndex = 0;
    imgEl.src = src;
    imgEl.alt = alt || "";
    imgEl.style.transform = "scale(1)";
    overlay.hidden = false;
    overlay.classList.remove("is-zoomed");
    document.body.classList.add("lightbox-open");
  }
  function close() {
    overlay.hidden = true;
    imgEl.src = "";
    document.body.classList.remove("lightbox-open");
  }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.hidden = true;

    imgEl = document.createElement("img");
    imgEl.className = "lightbox-img";
    imgEl.alt = "";

    toolbar = document.createElement("div");
    toolbar.className = "lightbox-toolbar";
    toolbar.innerHTML =
      '<button type="button" data-action="out" aria-label="Zoom out">&minus;</button>' +
      '<button type="button" data-action="reset" aria-label="Reset zoom">Reset</button>' +
      '<button type="button" data-action="in" aria-label="Zoom in">&plus;</button>' +
      '<button type="button" data-action="close" aria-label="Close">&times; Close</button>';

    overlay.appendChild(imgEl);
    overlay.appendChild(toolbar);
    document.body.appendChild(overlay);

    toolbar.addEventListener("click", function (e) {
      var action = e.target.getAttribute("data-action");
      if (!action) return;
      if (action === "in") zoomIn();
      else if (action === "out") zoomOut();
      else if (action === "reset") resetZoom();
      else if (action === "close") close();
    });

    // Click the dark backdrop (not the image or toolbar) to close.
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (overlay.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
    });
  }

  function init() {
    build();
    var images = document.querySelectorAll("figure img");
    images.forEach(function (img) {
      img.classList.add("lightbox-trigger");
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Click to zoom: " + (img.alt || "screenshot"));
      img.addEventListener("click", function () {
        open(img.src, img.alt);
      });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(img.src, img.alt);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
