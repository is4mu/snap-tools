(function () {
  var W = window.WarekiConvert;
  if (!W) return;

  var COPY_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function todayParts() {
    var t = new Date();
    return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
  }

  function setGDateInput(el, y, m, d) {
    el.value = y + "-" + pad2(m) + "-" + pad2(d);
  }

  function copyText(text, onSuccess) {
    if (!text) return;
    function done() {
      if (typeof onSuccess === "function") onSuccess();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(done)
        .catch(function () {
          fallbackCopy();
        });
      return;
    }
    fallbackCopy();

    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) done();
      } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function renderError(el, msg) {
    el.classList.add("convert-result--error");
    el.classList.remove("convert-result--with-copy");
    el.textContent = msg;
  }

  function renderOk(el, line) {
    el.classList.remove("convert-result--error");
    el.classList.add("convert-result--with-copy");
    el.textContent = "";
    var inner = document.createElement("div");
    inner.className = "convert-result-inner";
    var p = document.createElement("p");
    p.className = "convert-result-main";
    p.textContent = line;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "convert-copy-btn";
    btn.setAttribute("aria-label", "コピー");
    btn.innerHTML = COPY_ICON;
    inner.appendChild(p);
    inner.appendChild(btn);
    el.appendChild(inner);
  }

  function syncFromGregorian(gInput, outW) {
    var v = gInput.value;
    if (!v) {
      renderError(outW, "日付を選んでください。");
      return;
    }
    var p = v.split("-");
    var y = parseInt(p[0], 10),
      m = parseInt(p[1], 10),
      d = parseInt(p[2], 10);
    var line = W.formatWarekiLine(y, m, d);
    if (!line) {
      renderError(outW, W.oldestStartMessage());
      return;
    }
    renderOk(outW, line);
  }

  function syncFromWareki(wEra, wYear, wMonth, wDay, outG) {
    var era = wEra.value;
    var nen = parseInt(wYear.value, 10);
    var month = parseInt(wMonth.value, 10);
    var day = parseInt(wDay.value, 10);
    if (!era || !nen || nen < 1 || !month || !day) {
      renderError(outG, "元号・年・月・日を入力してください。");
      return;
    }
    var r = W.warekiToGregorian(era, nen, month, day);
    if (r.error) {
      renderError(outG, r.error);
      return;
    }
    var line = W.formatGregorianLine(r.y, r.m, r.d);
    renderOk(outG, line);
  }

  function applyTodayWareki(wEra, wYear, wMonth, wDay) {
    var td = todayParts();
    var w = W.gregorianToWareki(td.y, td.m, td.d);
    if (w) {
      wEra.value = w.era;
      wYear.value = String(w.nen);
      wMonth.value = String(w.m);
      wDay.value = String(w.d);
    }
  }

  /**
   * 元号の開始日から、概ねの日本史区分（参考用・境界は史料で異なる）。
   */
  function periodLabelForEraStart(y, m, d) {
    var t = y * 10000 + m * 100 + d;
    if (t >= 18681023) return "明治以降（近代・現代）";
    if (t >= 16030324) return "江戸時代";
    if (t >= 15730101) return "安土桃山時代";
    if (t >= 13360101) return "室町時代";
    if (t >= 11850101) return "鎌倉時代";
    if (t >= 7940101) return "平安時代";
    if (t >= 7100711) return "奈良時代";
    return "飛鳥時代";
  }

  function fillEraSelect(selectEl) {
    var currentLabel = null;
    var groupEl = null;
    W.ERAS.forEach(function (e) {
      var label = periodLabelForEraStart(e.start[0], e.start[1], e.start[2]);
      if (label !== currentLabel) {
        currentLabel = label;
        groupEl = document.createElement("optgroup");
        groupEl.setAttribute("label", label);
        selectEl.appendChild(groupEl);
      }
      var opt = document.createElement("option");
      opt.value = e.name;
      opt.textContent = e.name;
      groupEl.appendChild(opt);
    });
  }

  function init() {
    var gInput = document.getElementById("gDate");
    var wEra = document.getElementById("wEra");
    var wYear = document.getElementById("wYear");
    var wMonth = document.getElementById("wMonth");
    var wDay = document.getElementById("wDay");
    var outW = document.getElementById("outWareki");
    var outG = document.getElementById("outGregorian");
    var btnToday = document.getElementById("btnToday");
    var btnWarekiToday = document.getElementById("btnWarekiToday");
    var tabG = document.getElementById("tab-g");
    var tabW = document.getElementById("tab-w");
    var panelG = document.getElementById("panel-g");
    var panelW = document.getElementById("panel-w");

    if (!gInput || !wEra) return;

    fillEraSelect(wEra);

    var td = todayParts();
    setGDateInput(gInput, td.y, td.m, td.d);
    applyTodayWareki(wEra, wYear, wMonth, wDay);

    function runG() {
      syncFromGregorian(gInput, outW);
    }
    function runW() {
      syncFromWareki(wEra, wYear, wMonth, wDay, outG);
    }

    runG();
    runW();

    gInput.addEventListener("input", runG);
    gInput.addEventListener("change", runG);

    btnToday.addEventListener("click", function () {
      var t = todayParts();
      setGDateInput(gInput, t.y, t.m, t.d);
      runG();
    });

    if (btnWarekiToday) {
      btnWarekiToday.addEventListener("click", function () {
        var t = todayParts();
        setGDateInput(gInput, t.y, t.m, t.d);
        applyTodayWareki(wEra, wYear, wMonth, wDay);
        runG();
        runW();
      });
    }

    ["input", "change"].forEach(function (ev) {
      wEra.addEventListener(ev, runW);
      wYear.addEventListener(ev, runW);
      wMonth.addEventListener(ev, runW);
      wDay.addEventListener(ev, runW);
    });

    function selectTab(which) {
      var isG = which === "g";
      tabG.setAttribute("aria-selected", isG ? "true" : "false");
      tabW.setAttribute("aria-selected", isG ? "false" : "true");
      panelG.hidden = !isG;
      panelW.hidden = isG;
    }

    tabG.addEventListener("click", function () {
      selectTab("g");
    });
    tabW.addEventListener("click", function () {
      selectTab("w");
    });

    function onCopyClick(e, outEl) {
      var btn = e.target.closest(".convert-copy-btn");
      if (!btn || !outEl.contains(btn)) return;
      var p = outEl.querySelector(".convert-result-main");
      if (p) {
        copyText(p.textContent.trim(), function () {
          if (typeof window.showCopyToast === "function") {
            window.showCopyToast();
          }
        });
      }
    }

    outW.addEventListener("click", function (e) {
      onCopyClick(e, outW);
    });
    outG.addEventListener("click", function (e) {
      onCopyClick(e, outG);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
