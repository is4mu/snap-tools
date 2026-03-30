(function () {
  var FAV_KEY = "snap-tools-favorites";

  var ICON_INFO =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
  var ICON_SHARE =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>';
  var ICON_HEART =
    '<svg class="tool-icon-heart" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path class="tool-icon-heart-path" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var ICON_COPY =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  function getRegistry() {
    return window.TOOL_REGISTRY || {};
  }

  function getFavorites() {
    try {
      var a = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function setFavorites(ids) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  function ensureModalLayer() {
    if (document.getElementById("tool-modal-layer")) return;

    var layer = document.createElement("div");
    layer.id = "tool-modal-layer";
    layer.className = "tool-modal-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<div class="tool-modal-backdrop" data-modal-close tabindex="-1"></div>' +
      '<div id="tool-modal-info-wrap" class="tool-modal-card-wrap" hidden>' +
      '<div class="tool-modal-card" role="dialog" aria-modal="true" aria-labelledby="tool-modal-info-title">' +
      '<h2 id="tool-modal-info-title" class="tool-modal-title"></h2>' +
      '<div id="tool-modal-info-body" class="tool-modal-body"></div>' +
      '<button type="button" class="tool-modal-close-btn" data-modal-close>閉じる</button>' +
      "</div></div>" +
      '<div id="tool-modal-share-wrap" class="tool-modal-card-wrap" hidden>' +
      '<div class="tool-modal-card" role="dialog" aria-modal="true" aria-labelledby="tool-modal-share-title">' +
      '<h2 id="tool-modal-share-title" class="tool-modal-title">リンクを共有</h2>' +
      '<p class="tool-modal-hint">次のURLをコピーして共有できます。</p>' +
      '<div class="tool-modal-share-row">' +
      '<input type="text" id="tool-modal-share-url" class="tool-modal-share-input" readonly />' +
      '<button type="button" id="tool-modal-share-copy" class="tool-modal-copy-btn" aria-label="コピー">' +
      ICON_COPY +
      "</button>" +
      "</div>" +
      '<button type="button" class="tool-modal-close-btn" data-modal-close>閉じる</button>' +
      "</div></div>";

    document.body.appendChild(layer);

    layer.addEventListener("click", function (e) {
      if (e.target.closest("[data-modal-close]")) closeModals();
    });

    document.getElementById("tool-modal-share-copy").addEventListener("click", function () {
      var input = document.getElementById("tool-modal-share-url");
      var url = input.value;
      if (!url) return;

      function done() {
        if (typeof window.showCopyToast === "function") {
          window.showCopyToast();
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(fallback);
      } else {
        fallback();
      }

      function fallback() {
        input.select();
        try {
          if (document.execCommand("copy")) done();
        } catch (err) {}
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && layer.classList.contains("is-open")) {
        closeModals();
      }
    });
  }

  function openModals(which) {
    var layer = document.getElementById("tool-modal-layer");
    var infoW = document.getElementById("tool-modal-info-wrap");
    var shareW = document.getElementById("tool-modal-share-wrap");
    if (!layer) return;
    infoW.hidden = which !== "info";
    shareW.hidden = which !== "share";
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
  }

  function closeModals() {
    var layer = document.getElementById("tool-modal-layer");
    if (!layer) return;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.getElementById("tool-modal-info-wrap").hidden = true;
    document.getElementById("tool-modal-share-wrap").hidden = true;
  }

  function buildToolbar(meta) {
    var icon = (meta && meta.iconSvg) || "";
    var wrap = document.createElement("div");
    wrap.className = "tool-toolbar";
    wrap.innerHTML =
      '<div class="tool-toolbar-brand">' +
      '<span class="tool-toolbar-icon" aria-hidden="true">' +
      icon +
      "</span>" +
      '<h1 class="tool-toolbar-title"></h1>' +
      "</div>" +
      '<div class="tool-toolbar-actions">' +
      '<button type="button" class="tool-icon-btn" data-action="info" aria-label="このツールの詳しい説明">' +
      ICON_INFO +
      "</button>" +
      '<button type="button" class="tool-icon-btn tool-icon-btn--favorite" data-action="favorite" aria-label="お気に入りに追加">' +
      ICON_HEART +
      "</button>" +
      '<button type="button" class="tool-icon-btn" data-action="share" aria-label="リンクを共有">' +
      ICON_SHARE +
      "</button>" +
      "</div>";
    return wrap;
  }

  function initChrome() {
    var chrome = document.querySelector(".tool-chrome[data-tool-id]");
    if (!chrome) return;

    var id = chrome.getAttribute("data-tool-id");
    var meta = getRegistry()[id];
    if (!meta) return;

    var panel = chrome.querySelector(".tool-panel");
    if (!panel) return;

    var toolbar = buildToolbar(meta);
    var lead = null;
    if (!meta.suppressLead) {
      lead = document.createElement("p");
      lead.className = "tool-lead";
      lead.textContent = meta.medium || meta.short;
    }

    chrome.insertBefore(toolbar, panel);
    if (meta.subcopy) {
      var sub = document.createElement("p");
      sub.className = "tool-subcopy";
      sub.textContent = meta.subcopy;
      chrome.insertBefore(sub, panel);
    }
    if (lead) chrome.insertBefore(lead, panel);

    var titleEl = toolbar.querySelector(".tool-toolbar-title");
    titleEl.textContent = meta.title;
    if (meta.documentTitle) {
      document.title = meta.documentTitle;
    } else {
      document.title = meta.title + " | snap-tools";
    }

    var favBtn = toolbar.querySelector('[data-action="favorite"]');
    if (getFavorites().indexOf(id) >= 0) {
      favBtn.classList.add("is-favorited");
      favBtn.setAttribute("aria-label", "お気に入りを解除");
    }

    ensureModalLayer();

    toolbar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn || !toolbar.contains(btn)) return;
      var action = btn.getAttribute("data-action");
      if (action === "info") {
        document.getElementById("tool-modal-info-title").textContent =
          meta.title + "について";
        document.getElementById("tool-modal-info-body").textContent = meta.long;
        openModals("info");
      } else if (action === "share") {
        document.getElementById("tool-modal-share-url").value = window.location.href;
        openModals("share");
      } else if (action === "favorite") {
        var list = getFavorites();
        var idx = list.indexOf(id);
        if (idx >= 0) {
          list.splice(idx, 1);
          favBtn.classList.remove("is-favorited");
          favBtn.setAttribute("aria-label", "お気に入りに追加");
        } else {
          list.push(id);
          favBtn.classList.add("is-favorited");
          favBtn.setAttribute("aria-label", "お気に入りを解除");
        }
        setFavorites(list);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChrome);
  } else {
    initChrome();
  }
})();
