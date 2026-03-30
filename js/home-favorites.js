(function () {
  /** 旧ファイル名・旧 data-tool-id からの移行（お気に入りの localStorage） */
  var LEGACY_TOOL_IDS = { date: "wareki", generator: "password" };
  /** 削除済みツールの id（お気に入りから取り除く） */
  var REMOVED_TOOL_IDS = { slugify: true };

  function migrateFavoriteIds() {
    try {
      var key = "snap-tools-favorites";
      var raw = localStorage.getItem(key);
      if (!raw) return;
      var a = JSON.parse(raw);
      if (!Array.isArray(a)) return;
      var mapped = a.map(function (id) {
        return LEGACY_TOOL_IDS[id] || id;
      });
      var next = mapped.filter(function (id) {
        return !REMOVED_TOOL_IDS[id];
      });
      if (JSON.stringify(a) === JSON.stringify(next)) return;
      localStorage.setItem(key, JSON.stringify(next));
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

  function normalizeSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function applyHomeSearchFilter() {
    var input = document.getElementById("home-tool-search");
    var main = document.getElementById("home-tool-main");
    var hint = document.getElementById("home-search-hint");
    if (!input || !main) return;

    var q = normalizeSearch(input.value);
    var sections = main.querySelectorAll(".home-tool-category");
    var totalVisible = 0;

    sections.forEach(function (sec) {
      var cards = sec.querySelectorAll(".tool-card");
      var visible = 0;
      cards.forEach(function (card) {
        var hay = card.getAttribute("data-search") || "";
        var show = !q || hay.indexOf(q) !== -1;
        card.hidden = !show;
        if (show) visible++;
      });
      sec.hidden = visible === 0;
      totalVisible += visible;
    });

    if (hint) {
      if (q && totalVisible === 0) {
        hint.hidden = false;
        hint.textContent = "該当するツールがありません。別のキーワードをお試しください。";
      } else if (q) {
        hint.hidden = false;
        hint.textContent = totalVisible + " 件が該当しました。";
      } else {
        hint.hidden = true;
        hint.textContent = "";
      }
    }
  }

  function bindHomeSearch() {
    var input = document.getElementById("home-tool-search");
    if (!input || input.getAttribute("data-search-bound") === "1") return;
    input.setAttribute("data-search-bound", "1");
    input.addEventListener("input", applyHomeSearchFilter);
    input.addEventListener("search", applyHomeSearchFilter);
  }

  function renderHomeToolCards() {
    var main = document.getElementById("home-tool-main");
    if (!main) return;

    var reg = getRegistry();
    var order = window.TOOL_HOME_ORDER;
    if (!Array.isArray(order) || order.length === 0) {
      order = Object.keys(reg);
    }

    var catOrder = window.TOOL_CATEGORY_ORDER;
    var catLabels = window.TOOL_CATEGORY_LABELS || {};
    var catMap = window.TOOL_CATEGORY_MAP || {};

    main.innerHTML = "";

    if (!Array.isArray(catOrder) || catOrder.length === 0) {
      var grid = document.createElement("div");
      grid.className = "tool-grid";
      order.forEach(function (id) {
        var meta = reg[id];
        if (!meta || !meta.href) return;
        var a = document.createElement("a");
        a.href = meta.href;
        a.className = "tool-card";
        a.setAttribute(
          "data-search",
          normalizeSearch(
            meta.title +
              " " +
              meta.short +
              " " +
              (meta.medium || "") +
              " " +
              (meta.searchExtra || "")
          )
        );
        appendToolCardBody(a, meta);
        grid.appendChild(a);
      });
      main.appendChild(grid);
      bindHomeSearch();
      applyHomeSearchFilter();
      return;
    }

    var rendered = {};

    function addCard(grid, id, meta) {
      var a = document.createElement("a");
      a.href = meta.href;
      a.className = "tool-card";
      a.setAttribute(
        "data-search",
        normalizeSearch(
          meta.title +
            " " +
            meta.short +
            " " +
            (meta.medium || "") +
            " " +
            (meta.searchExtra || "")
        )
      );
      appendToolCardBody(a, meta);
      grid.appendChild(a);
      rendered[id] = true;
    }

    catOrder.forEach(function (catId) {
      var section = document.createElement("section");
      section.className = "home-tool-category";
      section.setAttribute("data-category", catId);
      section.id = "home-category-" + catId;

      var h2 = document.createElement("h2");
      h2.className = "home-tool-category-title";
      h2.textContent = catLabels[catId] || catId;

      var grid = document.createElement("div");
      grid.className = "tool-grid home-category-grid";

      var count = 0;
      order.forEach(function (id) {
        if (catMap[id] !== catId) return;
        var meta = reg[id];
        if (!meta || !meta.href) return;
        count++;
        addCard(grid, id, meta);
      });

      section.appendChild(h2);
      section.appendChild(grid);
      if (count === 0) {
        section.hidden = true;
      }
      main.appendChild(section);
    });

    var miscIds = [];
    order.forEach(function (id) {
      if (rendered[id]) return;
      var meta = reg[id];
      if (!meta || !meta.href) return;
      miscIds.push(id);
    });

    if (miscIds.length > 0) {
      var miscSec = document.createElement("section");
      miscSec.className = "home-tool-category";
      miscSec.setAttribute("data-category", "misc");
      miscSec.id = "home-category-misc";
      var miscH2 = document.createElement("h2");
      miscH2.className = "home-tool-category-title";
      miscH2.textContent = "その他";
      var miscGrid = document.createElement("div");
      miscGrid.className = "tool-grid home-category-grid";
      miscIds.forEach(function (id) {
        addCard(miscGrid, id, reg[id]);
      });
      miscSec.appendChild(miscH2);
      miscSec.appendChild(miscGrid);
      main.appendChild(miscSec);
    }

    bindHomeSearch();
    applyHomeSearchFilter();
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
