(function () {
  async function loadPartial(url, el) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        el.innerHTML = await r.text();
        if (typeof window.syncThemeToggleUi === "function") {
          window.syncThemeToggleUi();
        }
        if (
          el.id === "site-header" &&
          typeof window.applySnapLogoMesh === "function"
        ) {
          window.applySnapLogoMesh();
        }
      }
    } catch (_) {
      /* オフライン等ではヘッダー未表示のまま */
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("site-header");
    if (header && header.dataset.headerPartial) {
      loadPartial(
        "partials/header-" + header.dataset.headerPartial + ".html",
        header
      );
    }
    var footer = document.getElementById("site-footer");
    if (footer && footer.dataset.footerPartial) {
      loadPartial(
        "partials/footer-" + footer.dataset.footerPartial + ".html",
        footer
      );
    }
  });
})();
