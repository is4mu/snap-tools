(function () {
  function snapRootFromMeta() {
    var m = document.querySelector('meta[name="snap-root"]');
    if (!m) return "";
    return (m.getAttribute("content") || "").trim();
  }

  /**
   * 現在のページからサイトルート（index.html があるディレクトリ）までの相対プレフィックス。
   * 例: text/counter/ なら "../../"、トップなら ""。
   */
  function relativePrefixToSiteRoot() {
    var root = snapRootFromMeta();
    if (!root) {
      var p0 = location.pathname.replace(/\/+$/, "");
      var segments0 = p0.split("/").filter(Boolean);
      if (
        segments0.length &&
        /\.html$/i.test(segments0[segments0.length - 1])
      ) {
        segments0.pop();
      }
      var depth0 = segments0.length;
      if (depth0 <= 0) return "";
      return new Array(depth0 + 1).join("../");
    }
    var r = root.charAt(0) === "/" ? root : "/" + root;
    r = r.replace(/\/+$/, "");
    var rootSeg = r.split("/").filter(Boolean);
    var pathname = location.pathname.replace(/\/+$/, "");
    var segments = pathname.split("/").filter(Boolean);
    if (
      segments.length &&
      /\.html$/i.test(segments[segments.length - 1])
    ) {
      segments.pop();
    }
    var i = 0;
    while (
      i < rootSeg.length &&
      i < segments.length &&
      segments[i] === rootSeg[i]
    ) {
      i++;
    }
    if (i !== rootSeg.length) {
      var depth = segments.length;
      if (depth <= 0) return "";
      return new Array(depth + 1).join("../");
    }
    var remainder = segments.slice(i);
    var d = remainder.length;
    if (d <= 0) return "";
    return new Array(d + 1).join("../");
  }

  /** ルートの index.html（トップ）への href */
  function siteRootIndexHref() {
    var pre = relativePrefixToSiteRoot();
    if (pre !== "") return pre + "index.html";
    var root = snapRootFromMeta();
    if (root) {
      var rr = root.charAt(0) === "/" ? root : "/" + root;
      rr = rr.replace(/\/+$/, "");
      return rr + "/index.html";
    }
    return "index.html";
  }

  /** プライバシーページ（legal/privacy/）への href */
  function siteRootLegalPrivacyHref() {
    var pre = relativePrefixToSiteRoot();
    if (pre !== "") return pre + "legal/privacy/";
    var root = snapRootFromMeta();
    if (root) {
      var rr = root.charAt(0) === "/" ? root : "/" + root;
      rr = rr.replace(/\/+$/, "");
      return rr + "/legal/privacy/";
    }
    return "legal/privacy/";
  }

  function partialUrlForFetch(name) {
    return relativePrefixToSiteRoot() + "partials/" + name + ".html";
  }

  function expandSnapPlaceholders(html) {
    return html
      .replace(/\{\{SNAP_HOME_HREF\}\}/g, siteRootIndexHref())
      .replace(/\{\{SNAP_PRIVACY_HREF\}\}/g, siteRootLegalPrivacyHref());
  }

  async function loadPartial(url, el) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        el.innerHTML = expandSnapPlaceholders(await r.text());
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
        partialUrlForFetch("header-" + header.dataset.headerPartial),
        header
      );
    }
    var footer = document.getElementById("site-footer");
    if (footer && footer.dataset.footerPartial) {
      loadPartial(
        partialUrlForFetch("footer-" + footer.dataset.footerPartial),
        footer
      );
    }
  });
})();
