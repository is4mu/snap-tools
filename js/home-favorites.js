(function () {
  /** 旧ファイル名・旧 data-tool-id からの移行（お気に入りの localStorage） */
  var LEGACY_TOOL_IDS = { date: "wareki", generator: "password" };

  function migrateFavoriteIds() {
    try {
      var key = "snap-tools-favorites";
      var raw = localStorage.getItem(key);
      if (!raw) return;
      var a = JSON.parse(raw);
      if (!Array.isArray(a)) return;
      var next = a.map(function (id) {
        return LEGACY_TOOL_IDS[id] || id;
      });
      var changed = false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== next[i]) {
          changed = true;
          break;
        }
      }
      if (changed) localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {}
  }

  function getRegistry() {
    return window.TOOL_REGISTRY || {};
  }

  function appendToolCardBody(a, meta) {
    var h2 = document.createElement("h2");
    h2.className = "tool-card-title";
    var inner = document.createElement("span");
    inner.className = "tool-card-title-inner";
    if (meta.iconSvg) {
      var iconWrap = document.createElement("span");
      iconWrap.className = "tool-card-icon";
      iconWrap.setAttribute("aria-hidden", "true");
      iconWrap.innerHTML = meta.iconSvg;
      inner.appendChild(iconWrap);
    }
    var titleText = document.createElement("span");
    titleText.className = "tool-card-title-text";
    titleText.textContent = meta.title;
    inner.appendChild(titleText);
    h2.appendChild(inner);

    var p = document.createElement("p");
    p.textContent = meta.short;

    a.appendChild(h2);
    a.appendChild(p);
  }

  function renderHomeToolCards() {
    var main = document.getElementById("home-tool-grid");
    if (!main) return;

    var reg = getRegistry();
    var order = window.TOOL_HOME_ORDER;
    if (!Array.isArray(order) || order.length === 0) {
      order = Object.keys(reg);
    }

    main.innerHTML = "";
    order.forEach(function (id) {
      var meta = reg[id];
      if (!meta || !meta.href) return;

      var a = document.createElement("a");
      a.href = meta.href;
      a.className = "tool-card";

      appendToolCardBody(a, meta);
      main.appendChild(a);
    });
  }

  function getFavorites() {
    try {
      var a = JSON.parse(localStorage.getItem("snap-tools-favorites") || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function render() {
    var section = document.getElementById("favorites-block");
    var grid = document.getElementById("favorites-grid");
    if (!section || !grid) return;

    var ids = getFavorites();
    var reg = getRegistry();
    grid.innerHTML = "";

    ids.forEach(function (id) {
      var meta = reg[id];
      if (!meta) return;
      var a = document.createElement("a");
      a.href = meta.href;
      a.className = "tool-card";
      appendToolCardBody(a, meta);
      grid.appendChild(a);
    });

    if (grid.children.length === 0) {
      section.hidden = true;
    } else {
      section.hidden = false;
    }
  }

  function init() {
    migrateFavoriteIds();
    renderHomeToolCards();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
