(function () {
  var X_LIMIT = 280;

  /** 原稿用紙: 1 行あたり 20 文字、1 枚 20 行（いずれも切り上げ） */
  var GENKO_CHARS_PER_ROW = 20;
  var GENKO_ROWS_PER_SHEET = 20;

  function isWhitespaceChar(ch) {
    if (ch === "\u3000") return true;
    return /^\s$/u.test(ch);
  }

  function isFullWidthChar(ch) {
    if (ch === "\u3000") return true;
    if (isWhitespaceChar(ch)) return false;
    var cp = ch.codePointAt(0);
    if (cp < 0x80) return false;
    if (cp >= 0xff61 && cp <= 0xff9f) return false;
    if (cp >= 0xff01 && cp <= 0xff5e) return true;
    if (cp >= 0x3040 && cp <= 0x309f) return true;
    if (cp >= 0x30a0 && cp <= 0x30ff) return true;
    if (cp >= 0x4e00 && cp <= 0x9fff) return true;
    if (cp >= 0x3400 && cp <= 0x4dbf) return true;
    if (cp >= 0x3001 && cp <= 0x303f) return true;
    if (cp >= 0x31f0 && cp <= 0x31ff) return true;
    return true;
  }

  function isHalfWidthChar(ch) {
    if (ch === "\u3000") return false;
    if (isWhitespaceChar(ch)) return true;
    var cp = ch.codePointAt(0);
    if (cp >= 0x21 && cp <= 0x7e) return true;
    if (cp >= 0xff61 && cp <= 0xff9f) return true;
    return false;
  }

  /** X 用: 半角換算（全角相当 2、半角・改行・タブ等の空白 1） */
  function xWeightForCodePoint(ch) {
    if (ch === "\u3000") return 2;
    if (isWhitespaceChar(ch)) return 1;
    if (isFullWidthChar(ch)) return 2;
    if (isHalfWidthChar(ch)) return 1;
    return 2;
  }

  function stringXWeight(s) {
    var t = 0;
    for (var i = 0; i < s.length; ) {
      var cp = s.codePointAt(i);
      var w = cp > 0xffff ? 2 : 1;
      var unit = s.slice(i, i + w);
      t += xWeightForCodePoint(unit);
      i += w;
    }
    return t;
  }

  function stripAllWhitespace(str) {
    var out = "";
    for (var i = 0; i < str.length; ) {
      var code = str.codePointAt(i);
      var w = code > 0xffff ? 2 : 1;
      var unit = str.slice(i, i + w);
      if (!isWhitespaceChar(unit)) out += unit;
      i += w;
    }
    return out;
  }

  function lineStats(text) {
    if (!text) return { withEmpty: 0, withoutEmpty: 0 };
    var lines = text.split(/\r\n|\r|\n/);
    var withE = lines.length;
    var withoutE = 0;
    for (var k = 0; k < lines.length; k++) {
      if (lines[k].trim().length > 0) withoutE++;
    }
    return { withEmpty: withE, withoutEmpty: withoutE };
  }

  function graphemeCount(s) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      var seg = new Intl.Segmenter("ja", { granularity: "grapheme" });
      return Array.from(seg.segment(s)).length;
    }
    return Array.from(s).length;
  }

  /** 文字数カウント用: 改行を除いた文字列 */
  function removeNewlines(str) {
    return str.replace(/\r\n|\r|\n/g, "");
  }

  /** 実文字数 n（コードポイント単位）から、その行が占める原稿行数 */
  function genkoRowsForLineCharCount(n) {
    if (n < 1) return 0;
    return Math.ceil(n / GENKO_CHARS_PER_ROW);
  }

  function countGenkoRows(text) {
    if (!text || text.replace(/\r\n|\r|\n/g, "").length === 0) return 0;
    var lines = text.split(/\r\n|\r|\n/);
    var totalRows = 0;
    for (var li = 0; li < lines.length; li++) {
      var n = Array.from(lines[li]).length;
      if (n === 0) continue;
      totalRows += genkoRowsForLineCharCount(n);
    }
    return totalRows;
  }

  /** 半角換算 limit 以下になるようコードポイント単位で分割（末尾が \n なら最後のかけに付与） */
  function splitLongSegment(seg, limit) {
    var trailNl = seg.endsWith("\n");
    var core = trailNl ? seg.slice(0, -1) : seg;
    if (stringXWeight(core) <= limit) {
      return [seg];
    }
    var out = [];
    var buf = "";
    var w = 0;
    for (var i = 0; i < core.length; ) {
      var cp = core.codePointAt(i);
      var uw = cp > 0xffff ? 2 : 1;
      var unit = core.slice(i, i + uw);
      var cw = xWeightForCodePoint(unit);
      if (w + cw > limit && buf) {
        out.push(buf);
        buf = unit;
        w = cw;
      } else {
        buf += unit;
        w += cw;
      }
      i += uw;
    }
    if (buf) out.push(buf);
    if (trailNl && out.length) out[out.length - 1] += "\n";
    return out;
  }

  /** 半角換算 limit 以下の文字列の配列（連結すると元テキストと一致。改行は分割境界にしない） */
  function packPostsForX(text, limit) {
    if (!text) return [];
    if (stringXWeight(text) <= limit) return [text];
    return splitLongSegment(text, limit);
  }

  function joinPostsWithMarkers(posts) {
    var n = posts.length;
    if (n === 0) return "";
    var out = posts[0];
    for (var i = 1; i < n; i++) {
      out +=
        "\n\n― 投稿 " +
        (i + 1) +
        " / " +
        n +
        " ―\n\n" +
        posts[i];
    }
    return out;
  }

  function copyText(v, toastMsg) {
    function done() {
      if (typeof window.showCopyToast === "function") {
        window.showCopyToast(toastMsg || "コピーしました");
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(v).then(done).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = v;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) done();
      } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function computeStats(text) {
    var noNl = removeNewlines(text);
    var noWsNoNl = stripAllWhitespace(noNl);
    var lines = lineStats(text);
    var genkoRows = countGenkoRows(text);
    var genko =
      genkoRows <= 0 ? 0 : Math.ceil(genkoRows / GENKO_ROWS_PER_SHEET);
    var xw = stringXWeight(text);
    var posts = packPostsForX(text, X_LIMIT);
    return {
      charsInc: graphemeCount(noNl),
      charsExc: graphemeCount(noWsNoNl),
      lineWithEmpty: lines.withEmpty,
      lineWithoutEmpty: lines.withoutEmpty,
      genko: genko,
      genkoRows: genkoRows,
      xWeight: xw,
      xRemain: X_LIMIT - xw,
      xPosts: posts,
    };
  }

  function setText(id, s) {
    var el = document.getElementById(id);
    if (el) el.textContent = s;
  }

  function renderXSplit(st) {
    var wrap = document.getElementById("counterXSplitWrap");
    var list = document.getElementById("counterXSplitList");
    var lead = document.getElementById("counterXSplitLead");
    if (!wrap || !list) return;

    var needSplit = st.xWeight > X_LIMIT && st.xPosts.length > 0;
    wrap.hidden = !needSplit;
    var allBtn = document.getElementById("counterXCopyAll");
    if (!needSplit) {
      list.innerHTML = "";
      if (allBtn) allBtn.onclick = null;
      return;
    }

    var n = st.xPosts.length;
    if (lead) {
      lead.textContent =
        "半角換算 " +
        st.xWeight +
        " のため、" +
        n +
        " 投稿に分けています（各枠は " +
        X_LIMIT +
        " 以下・改行は区切りにしません）。X に貼り付ける順にコピーしてください。";
    }

    list.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var w = stringXWeight(st.xPosts[i]);
      var li = document.createElement("li");
      li.className = "counter-x-split-item";

      var head = document.createElement("div");
      head.className = "counter-x-split-item-head";
      var title = document.createElement("span");
      title.className = "counter-x-split-item-title";
      title.textContent = "投稿 " + (i + 1) + " / " + n;
      var sub = document.createElement("span");
      sub.className = "counter-x-split-item-sub";
      sub.textContent = "換算 " + w;
      head.appendChild(title);
      head.appendChild(sub);

      var ta = document.createElement("textarea");
      ta.className = "counter-x-split-ta";
      ta.readOnly = true;
      ta.rows = Math.min(12, Math.max(3, st.xPosts[i].split("\n").length + 1));
      ta.value = st.xPosts[i];
      ta.setAttribute("aria-label", "投稿 " + (i + 1) + " の本文");

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "counter-x-split-copy";
      btn.textContent = "コピー";
      (function (idx) {
        btn.addEventListener("click", function () {
          copyText(
            st.xPosts[idx],
            "投稿 " + (idx + 1) + " をコピーしました"
          );
        });
      })(i);

      li.appendChild(head);
      li.appendChild(ta);
      li.appendChild(btn);
      list.appendChild(li);
    }

    if (allBtn) {
      allBtn.onclick = function () {
        copyText(
          joinPostsWithMarkers(st.xPosts),
          "まとめてコピーしました（区切り付き）"
        );
      };
    }
  }

  function update() {
    var ta = document.getElementById("inputText");
    if (!ta) return;
    var text = ta.value;
    var st = computeStats(text);

    setText("counterCharsInc", String(st.charsInc));
    setText("counterCharsExc", String(st.charsExc));
    setText("counterLineInc", String(st.lineWithEmpty));
    setText("counterLineExc", String(st.lineWithoutEmpty));
    setText("counterGenko", String(st.genko));
    setText("counterGenkoRows", String(st.genkoRows));
    setText("counterXWeight", String(st.xWeight));
    setText("counterXLimit", String(X_LIMIT));

    var remainEl = document.getElementById("counterXRemain");
    var rowX = document.getElementById("counterXRow");
    if (remainEl) {
      if (st.xWeight <= X_LIMIT) {
        remainEl.textContent = "残り " + st.xRemain + "（半角換算）";
      } else {
        remainEl.textContent =
          st.xWeight - X_LIMIT + " オーバー（半角換算）・分割 " + st.xPosts.length + " 件";
      }
    }
    if (rowX) {
      rowX.classList.toggle("counter-report-row--warn", st.xWeight > X_LIMIT);
    }

    renderXSplit(st);
  }

  function init() {
    var ta = document.getElementById("inputText");
    if (!ta) return;
    ta.addEventListener("input", update);
    ta.addEventListener("paste", function () {
      requestAnimationFrame(update);
    });
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
