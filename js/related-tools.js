(function () {
  function relativePrefixToSiteRoot() {
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

  function toolHref(metaHref) {
    var pre = relativePrefixToSiteRoot();
    return pre + metaHref;
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

  function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function initRelatedTools(container, currentId) {
    if (!container) return;
    var reg = window.TOOL_REGISTRY || {};
    var catMap = window.TOOL_CATEGORY_MAP || {};
    var cat = catMap[currentId];
    if (!cat) return;

    var others = Object.keys(catMap).filter(function (id) {
      return id !== currentId && catMap[id] === cat;
    });
    var regKeys = others.filter(function (id) {
      return reg[id] && reg[id].href;
    });
    if (regKeys.length === 0) {
      var sec = container.closest(".tool-related");
      if (sec) sec.hidden = true;
      return;
    }

    shuffleInPlace(regKeys);
    var pick = regKeys.slice(0, Math.min(2, regKeys.length));

    container.innerHTML = "";
    pick.forEach(function (id) {
      var meta = reg[id];
      var a = document.createElement("a");
      a.href = toolHref(meta.href);
      a.className = "tool-card";
      appendToolCardBody(a, meta);
      container.appendChild(a);
    });
  }

  function boot() {
    var chrome = document.querySelector(".tool-chrome[data-tool-id]");
    var grid = document.getElementById("relatedToolsGrid");
    if (!chrome || !grid) return;
    initRelatedTools(grid, chrome.getAttribute("data-tool-id"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
