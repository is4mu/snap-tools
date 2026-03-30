/**
 * シンプル系ツールの UI 初期化（data-tool-id に対応）。
 * tool-chrome.js の後に読み込むこと。
 */
(function () {
  function copyText(s) {
    if (s == null || s === "") return;
    function done() {
      if (typeof window.showCopyToast === "function") window.showCopyToast();
    }
    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = String(s);
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "0";
      ta.style.top = "0";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      try {
        if (document.execCommand("copy")) done();
      } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(String(s)).then(done).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function bindTabs(root, tabSelector, panelAttr) {
    var tabs = root.querySelectorAll(tabSelector);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var k = t.getAttribute("data-tab");
        tabs.forEach(function (x) {
          x.setAttribute("aria-selected", x === t ? "true" : "false");
        });
        root.querySelectorAll("[data-tabpanel]").forEach(function (p) {
          p.hidden = p.getAttribute("data-tabpanel") !== k;
        });
      });
    });
  }

  var T = {};

  T.base64 = function (root) {
    root.innerHTML =
      '<p class="convert-hint">Unicode 対応の Base64 変換。処理はブラウザ内のみです。</p>' +
      '<div class="convert-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="e" aria-selected="true">エンコード</button>' +
      '<button type="button" class="convert-tab" data-tab="d" aria-selected="false">デコード</button></div>' +
      '<div data-tabpanel="e" class="convert-tabpanel simple-tool-stack">' +
      '<textarea class="simple-tool-textarea" id="b64in" placeholder="テキスト"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="b64go">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="b64cp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="b64out"></pre></div>' +
      '<div data-tabpanel="d" class="convert-tabpanel simple-tool-stack" hidden>' +
      '<textarea class="simple-tool-textarea" id="b64in2" placeholder="Base64 文字列"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="b64go2">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="b64cp2">コピー</button></div>' +
      '<pre class="simple-tool-output" id="b64out2"></pre></div>';
    bindTabs(root, ".convert-tab");
    function enc(s) {
      return btoa(unescape(encodeURIComponent(s)));
    }
    function dec(s) {
      return decodeURIComponent(escape(atob(String(s).replace(/\s+/g, ""))));
    }
    root.querySelector("#b64go").addEventListener("click", function () {
      try {
        root.querySelector("#b64out").textContent = enc(root.querySelector("#b64in").value);
      } catch (e) {
        root.querySelector("#b64out").textContent = "エラー: " + e.message;
      }
    });
    root.querySelector("#b64go2").addEventListener("click", function () {
      try {
        root.querySelector("#b64out2").textContent = dec(root.querySelector("#b64in2").value);
      } catch (e) {
        root.querySelector("#b64out2").textContent = "エラー: " + e.message;
      }
    });
    root.querySelector("#b64cp").addEventListener("click", function () {
      copyText(root.querySelector("#b64out").textContent);
    });
    root.querySelector("#b64cp2").addEventListener("click", function () {
      copyText(root.querySelector("#b64out2").textContent);
    });
  };

  T.urlCodec = function (root) {
    root.innerHTML =
      '<p class="convert-hint">encodeURIComponent / decodeURIComponent を利用します。</p>' +
      '<div class="convert-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="e" aria-selected="true">エンコード</button>' +
      '<button type="button" class="convert-tab" data-tab="d" aria-selected="false">デコード</button></div>' +
      '<div data-tabpanel="e" class="convert-tabpanel simple-tool-stack">' +
      '<textarea class="simple-tool-textarea" id="u64in"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="u64go">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="u64cp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="u64out"></pre></div>' +
      '<div data-tabpanel="d" class="convert-tabpanel simple-tool-stack" hidden>' +
      '<textarea class="simple-tool-textarea" id="u64in2"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="u64go2">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="u64cp2">コピー</button></div>' +
      '<pre class="simple-tool-output" id="u64out2"></pre></div>';
    bindTabs(root, ".convert-tab");
    root.querySelector("#u64go").addEventListener("click", function () {
      try {
        root.querySelector("#u64out").textContent = encodeURIComponent(
          root.querySelector("#u64in").value
        );
      } catch (e) {
        root.querySelector("#u64out").textContent = "エラー: " + e.message;
      }
    });
    root.querySelector("#u64go2").addEventListener("click", function () {
      try {
        root.querySelector("#u64out2").textContent = decodeURIComponent(
          root.querySelector("#u64in2").value.replace(/\+/g, " ")
        );
      } catch (e) {
        root.querySelector("#u64out2").textContent = "エラー: " + e.message;
      }
    });
    root.querySelector("#u64cp").addEventListener("click", function () {
      copyText(root.querySelector("#u64out").textContent);
    });
    root.querySelector("#u64cp2").addEventListener("click", function () {
      copyText(root.querySelector("#u64out2").textContent);
    });
  };

  T.htmlEscape = function (root) {
    root.innerHTML =
      '<p class="convert-hint">HTML 特殊文字のエスケープ／テキストからの復元（簡易）です。</p>' +
      '<div class="convert-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="e" aria-selected="true">エスケープ</button>' +
      '<button type="button" class="convert-tab" data-tab="d" aria-selected="false">アンエスケープ</button></div>' +
      '<div data-tabpanel="e" class="convert-tabpanel simple-tool-stack">' +
      '<textarea class="simple-tool-textarea" id="hein"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="hego">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="hecp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="heout"></pre></div>' +
      '<div data-tabpanel="d" class="convert-tabpanel simple-tool-stack" hidden>' +
      '<textarea class="simple-tool-textarea" id="hein2"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="hego2">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="hecp2">コピー</button></div>' +
      '<pre class="simple-tool-output" id="heout2"></pre></div>';
    bindTabs(root, ".convert-tab");
    function escHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    function unescHtml(s) {
      var d = document.createElement("textarea");
      d.innerHTML = s;
      return d.value;
    }
    root.querySelector("#hego").addEventListener("click", function () {
      root.querySelector("#heout").textContent = escHtml(root.querySelector("#hein").value);
    });
    root.querySelector("#hego2").addEventListener("click", function () {
      root.querySelector("#heout2").textContent = unescHtml(root.querySelector("#hein2").value);
    });
    root.querySelector("#hecp").addEventListener("click", function () {
      copyText(root.querySelector("#heout").textContent);
    });
    root.querySelector("#hecp2").addEventListener("click", function () {
      copyText(root.querySelector("#heout2").textContent);
    });
  };

  T.jsonFormat = function (root) {
    root.innerHTML =
      '<p class="convert-hint">JSON を整形（pretty print）します。検証に失敗した場合はエラーを表示します。</p>' +
      '<textarea class="simple-tool-textarea" id="jfin" placeholder="{ } 形式の JSON"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="jfgo">整形</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="jfcp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="jfout"></pre>';
    root.querySelector("#jfgo").addEventListener("click", function () {
      try {
        var o = JSON.parse(root.querySelector("#jfin").value);
        root.querySelector("#jfout").textContent = JSON.stringify(o, null, 2);
      } catch (e) {
        root.querySelector("#jfout").textContent = "JSON エラー: " + e.message;
      }
    });
    root.querySelector("#jfcp").addEventListener("click", function () {
      copyText(root.querySelector("#jfout").textContent);
    });
  };

  T.jsonMinify = function (root) {
    root.innerHTML =
      '<p class="convert-hint">JSON を 1 行に圧縮します。</p>' +
      '<textarea class="simple-tool-textarea" id="jmin"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="jmgo">圧縮</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="jmcp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="jmout"></pre>';
    root.querySelector("#jmgo").addEventListener("click", function () {
      try {
        var o = JSON.parse(root.querySelector("#jmin").value);
        root.querySelector("#jmout").textContent = JSON.stringify(o);
      } catch (e) {
        root.querySelector("#jmout").textContent = "JSON エラー: " + e.message;
      }
    });
    root.querySelector("#jmcp").addEventListener("click", function () {
      copyText(root.querySelector("#jmout").textContent);
    });
  };

  T.uuidGen = function (root) {
    root.innerHTML =
      '<p class="convert-hint">UUID v4 をブラウザの乱数で生成します。</p>' +
      '<div class="simple-tool-row">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">生成件数</span>' +
      '<input type="number" class="simple-tool-input" id="uuidn" min="1" max="50" value="5"/></label></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="uuidgo">生成</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="uuidcp">すべてコピー</button></div>' +
      '<pre class="simple-tool-output" id="uuidout"></pre>';
    function genOne() {
      if (crypto.randomUUID) return crypto.randomUUID();
      var b = new Uint8Array(16);
      crypto.getRandomValues(b);
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var h = Array.prototype.map
        .call(b, function (x) {
          return ("0" + x.toString(16)).slice(-2);
        })
        .join("");
      return (
        h.slice(0, 8) +
        "-" +
        h.slice(8, 12) +
        "-" +
        h.slice(12, 16) +
        "-" +
        h.slice(16, 20) +
        "-" +
        h.slice(20)
      );
    }
    root.querySelector("#uuidgo").addEventListener("click", function () {
      var n = Math.min(50, Math.max(1, parseInt(root.querySelector("#uuidn").value, 10) || 1));
      var lines = [];
      for (var i = 0; i < n; i++) lines.push(genOne());
      root.querySelector("#uuidout").textContent = lines.join("\n");
    });
    root.querySelector("#uuidcp").addEventListener("click", function () {
      copyText(root.querySelector("#uuidout").textContent);
    });
  };

  T.sha256 = function (root) {
    root.innerHTML =
      '<p class="convert-hint">入力文字列の SHA-256（16進）を表示します。Web Crypto API を使用します。</p>' +
      '<textarea class="simple-tool-textarea" id="shain" placeholder="テキスト"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="shago">ハッシュ</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="shacp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="shaout"></pre><p class="simple-tool-note" id="shaerr" hidden></p>';
    root.querySelector("#shago").addEventListener("click", function () {
      var err = root.querySelector("#shaerr");
      err.hidden = true;
      var txt = root.querySelector("#shain").value;
      if (!crypto.subtle) {
        err.textContent = "この環境では Web Crypto が使えません。";
        err.hidden = false;
        return;
      }
      var enc = new TextEncoder();
      crypto.subtle.digest("SHA-256", enc.encode(txt)).then(function (buf) {
        var h = Array.prototype.map
          .call(new Uint8Array(buf), function (b) {
            return ("0" + b.toString(16)).slice(-2);
          })
          .join("");
        root.querySelector("#shaout").textContent = h;
      });
    });
    root.querySelector("#shacp").addEventListener("click", function () {
      copyText(root.querySelector("#shaout").textContent);
    });
  };

  T.caseConvert = function (root) {
    root.innerHTML =
      '<div class="case-convert-result">' +
      '<div class="case-convert-result-toolbar">' +
      '<button type="button" class="simple-tool-icon-btn case-convert-copy" id="cccp" aria-label="結果をコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
      '<pre class="simple-tool-output case-convert-output" id="ccout"></pre></div>' +
      '<textarea class="simple-tool-textarea" id="ccin" placeholder="ここにテキストを入力"></textarea>' +
      '<fieldset class="convert-pass-fieldset convert-pass-fieldset--phrase-options case-convert-opt-fieldset">' +
      '<legend class="convert-pass-fieldset-legend">オプション</legend>' +
      '<div class="convert-pass-phrase-case">' +
      '<span class="convert-ymd-lbl" id="ccModeHeading">表記</span>' +
      '<div class="convert-pass-phrase-case-row case-convert-mode-row" role="radiogroup" aria-labelledby="ccModeHeading">' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="ccmode" value="u" checked id="ccmodeU" aria-label="ABC（すべて大文字）">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">ABC</span></label>' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="ccmode" value="l" id="ccmodeL" aria-label="abc（すべて小文字）">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">abc</span></label>' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="ccmode" value="t" id="ccmodeT" aria-label="Abc（単語の先頭のみ大文字）">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">Abc</span></label>' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="ccmode" value="s" id="ccmodeS" aria-label="Abc def.（文の先頭のみ大文字）">' +
      '<span class="convert-pass-opt-short convert-pass-opt-short--sentence" aria-hidden="true">Abc def.</span></label>' +
      "</div></div></fieldset>";
    function titleCase(s) {
      return s.replace(/\w\S*/g, function (t) {
        return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
      });
    }
    function sentenceCase(s) {
      return s.replace(/(^\s*\w|[.!?]\s+\w)/g, function (m) {
        return m.toUpperCase();
      });
    }
    function refresh() {
      var v = root.querySelector("#ccin").value;
      var checked = root.querySelector('input[name="ccmode"]:checked');
      var m = checked ? checked.value : "u";
      var o = v;
      if (m === "u") o = v.toUpperCase();
      else if (m === "l") o = v.toLowerCase();
      else if (m === "t") o = titleCase(v);
      else if (m === "s") o = sentenceCase(v.toLowerCase());
      root.querySelector("#ccout").textContent = o;
    }
    root.querySelector("#ccin").addEventListener("input", refresh);
    root.querySelector(".case-convert-mode-row").addEventListener("change", refresh);
    root.querySelector("#cccp").addEventListener("click", function () {
      var t = root.querySelector("#ccout").textContent;
      if (t === "") {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(t);
    });
    refresh();
  };

  T.lineSort = function (root) {
    root.innerHTML =
      '<div class="case-convert-result">' +
      '<div class="case-convert-result-toolbar">' +
      '<button type="button" class="simple-tool-icon-btn case-convert-copy" id="lscp" aria-label="結果をコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
      '<pre class="simple-tool-output case-convert-output" id="lsout"></pre></div>' +
      '<textarea class="simple-tool-textarea" id="lsin" placeholder="ここにテキストを入力"></textarea>' +
      '<fieldset class="convert-pass-fieldset convert-pass-fieldset--phrase-options case-convert-opt-fieldset">' +
      '<legend class="convert-pass-fieldset-legend">オプション</legend>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">区切り</span>' +
      '<select class="simple-tool-select" id="lsdelim">' +
      '<option value="comma" selected>カンマ (,)</option>' +
      '<option value="ws">空白（スペース・改行・タブ）</option>' +
      '<option value="nl">改行</option>' +
      '<option value="tab">タブ</option>' +
      "</select></label>" +
      '<label class="simple-tool-field"><span class="simple-tool-label">順序</span>' +
      '<select class="simple-tool-select" id="lsorder">' +
      '<option value="asc">昇順 (A→Z)</option>' +
      '<option value="desc">降順</option></select></label>' +
      '<div class="simple-tool-field"><span class="simple-tool-label">処理</span>' +
      '<div class="convert-pass-phrase-case-row" style="gap:.5rem;justify-content:flex-start">' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="checkbox" id="lsuniq" aria-label="重複の除去">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">重複の除去</span></label>' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="checkbox" id="lstrim" aria-label="前後の空白を除去">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">前後の空白を除去</span></label>' +
      "</div></div></div></fieldset>";

    function compute() {
      var raw = root.querySelector("#lsin").value || "";
      var doTrim = !!root.querySelector("#lstrim").checked;
      var doUniq = !!root.querySelector("#lsuniq").checked;
      var order = root.querySelector("#lsorder").value || "asc";
      var delim = root.querySelector("#lsdelim").value || "comma";

      var src = raw;
      if (doTrim) src = src.trim();
      var words;
      if (src === "") words = [];
      else if (delim === "comma") words = src.split(",");
      else if (delim === "nl") words = src.split(/\r?\n/);
      else if (delim === "tab") words = src.split("\t");
      else words = src.split(/\s+/);
      if (doTrim) {
        words = words
          .map(function (w) {
            return w.trim();
          })
          .filter(function (w) {
            return w !== "";
          });
      } else {
        words = words.filter(function (w) {
          return w !== "";
        });
      }

      if (doUniq) {
        var seen = {};
        words = words.filter(function (w) {
          if (seen[w]) return false;
          seen[w] = true;
          return true;
        });
      }

      words.sort(function (a, b) {
        if (order === "asc") return a.localeCompare(b, "ja");
        return b.localeCompare(a, "ja");
      });

      var outDelim = ",";
      if (delim === "nl") outDelim = "\n";
      else if (delim === "tab") outDelim = "\t";
      else if (delim === "ws") outDelim = " ";
      return words.join(outDelim);
    }

    function refresh() {
      root.querySelector("#lsout").textContent = compute();
    }

    root.querySelector("#lsin").addEventListener("input", refresh);
    root
      .querySelector("#lsdelim")
      .addEventListener("change", refresh);
    root
      .querySelector("#lsorder")
      .addEventListener("change", refresh);
    root
      .querySelector("#lsuniq")
      .addEventListener("change", refresh);
    root
      .querySelector("#lstrim")
      .addEventListener("change", refresh);

    root.querySelector("#lscp").addEventListener("click", function () {
      var t = root.querySelector("#lsout").textContent;
      if (t === "") {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(t);
    });

    refresh();
  };

  T.textDiff = function (root) {
    root.innerHTML =
      '<p class="convert-hint">行単位の差分（Unified / git diff 風）を表示します。挿入・削除で行番号がズレても追従します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<div class="simple-tool-field"><span class="simple-tool-label">テキスト A（元）</span>' +
      '<textarea class="simple-tool-textarea" id="tda" style="min-height:8rem" placeholder="元の文章（改訂前）"></textarea></div>' +
      '<div class="simple-tool-field"><span class="simple-tool-label">テキスト B（改訂）</span>' +
      '<textarea class="simple-tool-textarea" id="tdb" style="min-height:8rem" placeholder="改訂後の文章"></textarea></div></div>' +
      '<div class="simple-tool-row text-diff-options">' +
      '<label class="simple-tool-check"><input type="checkbox" id="tdTrim" checked> 前後の空白を無視（trim）</label>' +
      '<label class="simple-tool-check"><input type="checkbox" id="tdNormWs" checked> 連続空白を正規化</label>' +
      '<label class="simple-tool-check"><input type="checkbox" id="tdIgnoreBlank"> 空行を無視</label>' +
      '<label class="simple-tool-field text-diff-ctx"><span class="simple-tool-label">コンテキスト</span>' +
      '<input type="number" class="simple-tool-input" id="tdCtx" min="0" max="50" value="3" inputmode="numeric"></label>' +
      "</div>" +
      '<div class="simple-tool-actions text-diff-actions">' +
      '<button type="button" class="convert-submit-btn" id="tdgo">比較</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="tdPrev" disabled>前の差分</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="tdNext" disabled>次の差分</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="tdCopy" disabled>差分をコピー</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="tdDl" disabled>diff.txt</button>' +
      "</div>" +
      '<div class="simple-tool-note text-diff-summary" id="tdSummary" aria-live="polite">—</div>' +
      '<div class="simple-tool-output text-diff-out" id="tdout" role="region" aria-label="差分結果"></div>';

    var $a = root.querySelector("#tda");
    var $b = root.querySelector("#tdb");
    var $trim = root.querySelector("#tdTrim");
    var $normWs = root.querySelector("#tdNormWs");
    var $ignoreBlank = root.querySelector("#tdIgnoreBlank");
    var $ctx = root.querySelector("#tdCtx");
    var $out = root.querySelector("#tdout");
    var $summary = root.querySelector("#tdSummary");
    var $prev = root.querySelector("#tdPrev");
    var $next = root.querySelector("#tdNext");
    var $copy = root.querySelector("#tdCopy");
    var $dl = root.querySelector("#tdDl");

    function escHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function clampInt(n, min, max, fallback) {
      var x = parseInt(n, 10);
      if (isNaN(x)) x = fallback;
      if (x < min) x = min;
      if (x > max) x = max;
      return x;
    }

    function normalizeLine(s, opts) {
      var t = String(s == null ? "" : s);
      if (opts.normWs) {
        t = t.replace(/\u3000/g, " ");
        t = t.replace(/[ \t]+/g, " ");
      }
      if (opts.trim) t = t.trim();
      return t;
    }

    function toLines(text, opts) {
      var rawLines = String(text || "").split(/\r?\n/);
      var items = rawLines.map(function (raw) {
        var norm = normalizeLine(raw, opts);
        return { raw: raw, norm: norm, blank: norm === "" };
      });
      if (opts.ignoreBlank) items = items.filter(function (x) { return !x.blank; });
      return items;
    }

    // Myers diff for sequences of strings (exact match). Returns {trace}.
    function myersDiff(a, b) {
      var N = a.length;
      var M = b.length;
      var max = N + M;

      function get(map, k) {
        return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : -1e9;
      }

      var v = {};
      v[1] = 0;
      var trace = [];

      for (var d = 0; d <= max; d++) {
        var vNew = {};
        for (var k = -d; k <= d; k += 2) {
          var x;
          if (k === -d || (k !== d && get(v, k - 1) < get(v, k + 1))) {
            x = get(v, k + 1);
          } else {
            x = get(v, k - 1) + 1;
          }
          var y = x - k;
          while (x < N && y < M && a[x] === b[y]) {
            x++;
            y++;
          }
          vNew[k] = x;
          if (x >= N && y >= M) {
            trace.push(vNew);
            return { trace: trace };
          }
        }
        trace.push(vNew);
        v = vNew;
      }
      return { trace: trace };
    }

    function backtrackMyers(a, b, trace) {
      function get(map, k) {
        return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : -1e9;
      }

      var x = a.length;
      var y = b.length;
      var ops = [];

      for (var d = trace.length - 1; d > 0; d--) {
        var v = trace[d];
        var prev = trace[d - 1];
        var k = x - y;
        var prevK;

        if (k === -d || (k !== d && get(prev, k - 1) < get(prev, k + 1))) {
          prevK = k + 1;
        } else {
          prevK = k - 1;
        }

        var prevX = get(prev, prevK);
        var prevY = prevX - prevK;

        while (x > prevX && y > prevY) {
          ops.push({ t: "eq", a: a[x - 1] });
          x--;
          y--;
        }

        // Now we are at the start of the "snake" for this d.
        if (x === prevX) {
          ops.push({ t: "ins", b: b[y - 1] });
          y--;
        } else {
          ops.push({ t: "del", a: a[x - 1] });
          x--;
        }
      }

      while (x > 0 && y > 0) {
        if (a[x - 1] === b[y - 1]) {
          ops.push({ t: "eq", a: a[x - 1] });
          x--;
          y--;
        } else {
          break;
        }
      }
      while (x > 0) {
        ops.push({ t: "del", a: a[x - 1] });
        x--;
      }
      while (y > 0) {
        ops.push({ t: "ins", b: b[y - 1] });
        y--;
      }

      ops.reverse();
      return ops;
    }

    function computeOps(aItems, bItems) {
      var aKeys = aItems.map(function (x) { return x.norm; });
      var bKeys = bItems.map(function (x) { return x.norm; });
      var res = myersDiff(aKeys, bKeys);
      var opsKeys = backtrackMyers(aKeys, bKeys, res.trace);

      var ai = 0;
      var bi = 0;
      var ops = [];
      for (var i = 0; i < opsKeys.length; i++) {
        var op = opsKeys[i];
        if (op.t === "eq") {
          ops.push({ t: "eq", line: aItems[ai].raw });
          ai++;
          bi++;
        } else if (op.t === "del") {
          ops.push({ t: "del", line: aItems[ai].raw });
          ai++;
        } else {
          ops.push({ t: "ins", line: bItems[bi].raw });
          bi++;
        }
      }
      return ops;
    }

    function buildHunks(ops, ctx) {
      var hunks = [];
      var i = 0;
      while (i < ops.length) {
        while (i < ops.length && ops[i].t === "eq") i++;
        if (i >= ops.length) break;
        var start = Math.max(0, i - ctx);
        var end = i;
        while (end < ops.length && ops[end].t !== "eq") end++;
        var endWithCtx = Math.min(ops.length, end + ctx);
        hunks.push({ start: start, end: endWithCtx });
        i = endWithCtx;
      }
      // merge overlapping
      if (hunks.length <= 1) return hunks;
      var merged = [hunks[0]];
      for (var h = 1; h < hunks.length; h++) {
        var last = merged[merged.length - 1];
        var cur = hunks[h];
        if (cur.start <= last.end) last.end = Math.max(last.end, cur.end);
        else merged.push(cur);
      }
      return merged;
    }

    function unifiedTextFromHunks(ops, hunks) {
      if (!hunks.length) return "";
      var lines = [];
      for (var h = 0; h < hunks.length; h++) {
        if (h > 0) lines.push("");
        var seg = ops.slice(hunks[h].start, hunks[h].end);
        for (var i = 0; i < seg.length; i++) {
          var op = seg[i];
          if (op.t === "eq") lines.push("  " + op.line);
          else if (op.t === "del") lines.push("- " + op.line);
          else lines.push("+ " + op.line);
        }
      }
      return lines.join("\n");
    }

    function setButtonsEnabled(hasDiff) {
      $prev.disabled = !hasDiff;
      $next.disabled = !hasDiff;
      $copy.disabled = !hasDiff;
      $dl.disabled = !hasDiff;
    }

    var state = { hunks: [], currentHunk: -1, diffText: "" };

    function scrollToHunk(idx) {
      if (idx < 0 || idx >= state.hunks.length) return;
      var el = $out.querySelector('[data-hunk-index="' + idx + '"]');
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      state.currentHunk = idx;
    }

    function render(ops, hunks) {
      if (!hunks.length) {
        $out.innerHTML = '<div class="text-diff-empty">(差分なし)</div>';
        state.hunks = [];
        state.currentHunk = -1;
        state.diffText = "";
        setButtonsEnabled(false);
        return;
      }

      var html = [];
      var pos = 0;
      for (var h = 0; h < hunks.length; h++) {
        var hk = hunks[h];
        if (pos < hk.start) {
          var skipped = hk.start - pos;
          html.push(
            '<button type="button" class="text-diff-fold" data-fold-from="' +
              pos +
              '" data-fold-to="' +
              hk.start +
              '">… 変更なし ' +
              skipped +
              " 行 …（展開）</button>"
          );
        }
        html.push('<div class="text-diff-hunk" data-hunk-index="' + h + '"></div>');
        for (var i = hk.start; i < hk.end; i++) {
          var op = ops[i];
          var cls = op.t === "eq" ? "eq" : op.t === "del" ? "del" : "ins";
          var prefix = op.t === "eq" ? "&nbsp;" : op.t === "del" ? "-" : "+";
          html.push(
            '<div class="text-diff-line text-diff-line--' +
              cls +
              '"><span class="text-diff-prefix">' +
              prefix +
              '</span><span class="text-diff-content">' +
              escHtml(op.line) +
              "</span></div>"
          );
        }
        pos = hk.end;
      }
      if (pos < ops.length) {
        var skippedTail = ops.length - pos;
        html.push(
          '<button type="button" class="text-diff-fold" data-fold-from="' +
            pos +
            '" data-fold-to="' +
            ops.length +
            '">… 変更なし ' +
            skippedTail +
            " 行 …（展開）</button>"
        );
      }

      $out.innerHTML = html.join("");

      // fold expand
      $out.querySelectorAll(".text-diff-fold").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var from = clampInt(btn.getAttribute("data-fold-from"), 0, ops.length, 0);
          var to = clampInt(btn.getAttribute("data-fold-to"), 0, ops.length, 0);
          var frag = [];
          for (var i = from; i < to; i++) {
            var op = ops[i];
            var prefix = op.t === "eq" ? "&nbsp;" : op.t === "del" ? "-" : "+";
            frag.push(
              '<div class="text-diff-line text-diff-line--eq"><span class="text-diff-prefix">' +
                prefix +
                '</span><span class="text-diff-content">' +
                escHtml(op.line) +
                "</span></div>"
            );
          }
          var wrap = document.createElement("div");
          wrap.innerHTML = frag.join("");
          btn.replaceWith.apply(btn, Array.prototype.slice.call(wrap.childNodes));
        });
      });

      state.hunks = hunks;
      state.currentHunk = 0;
      setButtonsEnabled(true);
      scrollToHunk(0);
    }

    function computeAndRender() {
      var opts = {
        trim: !!$trim.checked,
        normWs: !!$normWs.checked,
        ignoreBlank: !!$ignoreBlank.checked,
      };
      var ctx = clampInt($ctx.value, 0, 50, 3);
      $ctx.value = String(ctx);

      var aItems = toLines($a.value, opts);
      var bItems = toLines($b.value, opts);

      var t0 = Date.now();
      var ops = computeOps(aItems, bItems);
      var hunks = buildHunks(ops, ctx);
      var diffText = unifiedTextFromHunks(ops, hunks);

      var adds = 0;
      var dels = 0;
      var eqs = 0;
      for (var i = 0; i < ops.length; i++) {
        if (ops[i].t === "ins") adds++;
        else if (ops[i].t === "del") dels++;
        else eqs++;
      }
      var ms = Date.now() - t0;
      $summary.textContent =
        "追加 " +
        adds +
        " 行 / 削除 " +
        dels +
        " 行 / 一致 " +
        eqs +
        " 行 / 差分ブロック " +
        hunks.length +
        " / " +
        ms +
        "ms";

      state.diffText = diffText;
      render(ops, hunks);
    }

    root.querySelector("#tdgo").addEventListener("click", computeAndRender);
    $prev.addEventListener("click", function () {
      if (!state.hunks.length) return;
      var nextIdx = Math.max(0, (state.currentHunk < 0 ? 0 : state.currentHunk) - 1);
      scrollToHunk(nextIdx);
    });
    $next.addEventListener("click", function () {
      if (!state.hunks.length) return;
      var nextIdx = Math.min(state.hunks.length - 1, (state.currentHunk < 0 ? 0 : state.currentHunk) + 1);
      scrollToHunk(nextIdx);
    });
    $copy.addEventListener("click", function () {
      if (!state.diffText) {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(state.diffText);
    });
    $dl.addEventListener("click", function () {
      if (!state.diffText) return;
      try {
        var blob = new Blob([state.diffText], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "diff.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      } catch (e) {}
    });

    setButtonsEnabled(false);
    $summary.textContent = "—";
  };

  T.regexTest = function (root) {
    root.innerHTML =
      '<p class="convert-hint">正規表現を試します。フラグ例: g, i, m（例: gi）</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">パターン</span>' +
      '<input type="text" class="simple-tool-input" id="rxp" placeholder="\\d+"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">フラグ</span>' +
      '<input type="text" class="simple-tool-input" id="rxf" placeholder="g"/></label></div>' +
      '<textarea class="simple-tool-textarea" id="rxt" placeholder="検索対象テキスト"></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="rxgo">実行</button></div>' +
      '<pre class="simple-tool-output" id="rxout"></pre>';
    root.querySelector("#rxgo").addEventListener("click", function () {
      var p = root.querySelector("#rxp").value;
      var f = root.querySelector("#rxf").value || "g";
      var t = root.querySelector("#rxt").value;
      try {
        var re = new RegExp(p, f);
        var m;
        var lines = [];
        var all = t.match(re);
        if (all) lines.push("一致数: " + all.length + (f.indexOf("g") >= 0 ? "" : "（g なしは先頭のみ）"));
        var i = 0;
        if (f.indexOf("g") >= 0) {
          while ((m = re.exec(t)) !== null) {
            lines.push(
              "[" +
                i++ +
                "] " +
                JSON.stringify(m[0]) +
                " @ " +
                m.index +
                (m.length > 1 ? " groups: " + JSON.stringify(m.slice(1)) : "")
            );
            if (m[0] === "") re.lastIndex++;
          }
        } else {
          m = re.exec(t);
          if (m) lines.push(JSON.stringify(m[0]) + " @ " + m.index);
          else lines.push("一致なし");
        }
        root.querySelector("#rxout").textContent = lines.join("\n") || "一致なし";
      } catch (e) {
        root.querySelector("#rxout").textContent = "エラー: " + e.message;
      }
    });
  };

  T.ageCalc = function (root) {
    var wk = ["日", "月", "火", "水", "木", "金", "土"];
    var kanshi = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    var juuni = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

    function parseYmd(s) {
      var p = (s || "").split("-");
      if (p.length !== 3) return null;
      var y = parseInt(p[0], 10);
      var mo = parseInt(p[1], 10) - 1;
      var d = parseInt(p[2], 10);
      if (isNaN(y) || isNaN(mo) || isNaN(d)) return null;
      return new Date(y, mo, d);
    }

    function dateOnlyMs(d) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }

    /** 西暦年の年干支（元旦基準の簡易。立春基準とは異なる場合あり） */
    function yearKanshi(y) {
      var k = (y - 4 + 1200000) % 60;
      return kanshi[k % 10] + juuni[k % 12];
    }

    /** 一般的な黄道十二星座（日付区分。時刻・境界の細部は未考慮） */
    function westernZodiac(month0, day) {
      if ((month0 === 11 && day >= 22) || (month0 === 0 && day <= 19)) return "山羊座";
      if ((month0 === 0 && day >= 20) || (month0 === 1 && day <= 18)) return "水瓶座";
      if ((month0 === 1 && day >= 19) || (month0 === 2 && day <= 20)) return "魚座";
      if ((month0 === 2 && day >= 21) || (month0 === 3 && day <= 19)) return "牡羊座";
      if ((month0 === 3 && day >= 20) || (month0 === 4 && day <= 20)) return "牡牛座";
      if ((month0 === 4 && day >= 21) || (month0 === 5 && day <= 21)) return "双子座";
      if ((month0 === 5 && day >= 22) || (month0 === 6 && day <= 22)) return "蟹座";
      if ((month0 === 6 && day >= 23) || (month0 === 7 && day <= 22)) return "獅子座";
      if ((month0 === 7 && day >= 23) || (month0 === 8 && day <= 22)) return "乙女座";
      if ((month0 === 8 && day >= 23) || (month0 === 9 && day <= 22)) return "天秤座";
      if ((month0 === 9 && day >= 23) || (month0 === 10 && day <= 22)) return "蠍座";
      if ((month0 === 10 && day >= 23) || (month0 === 11 && day <= 21)) return "射手座";
      return "—";
    }

    function monthsSinceDateOnly(dFrom, dTo) {
      var months =
        (dTo.getFullYear() - dFrom.getFullYear()) * 12 + (dTo.getMonth() - dFrom.getMonth());
      if (dTo.getDate() < dFrom.getDate()) months--;
      return months;
    }

    root.innerHTML =
      '<div class="simple-tool-stack age-calc-tool">' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">誕生日</span>' +
      '<input type="date" class="simple-tool-input" id="agd" autocomplete="bday"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">基準日</span>' +
      '<input type="date" class="simple-tool-input" id="agr" aria-describedby="agrhint"/>' +
      '<span class="simple-tool-note" id="agrhint">空欄のときは今日（端末の日付）</span></label></div>' +
      '<div class="counter-report" id="agReport" aria-live="polite">' +
      '<section class="counter-report-section">' +
      '<h2 class="counter-report-heading">年齢</h2>' +
      '<dl class="counter-report-dl">' +
      '<div class="counter-report-row"><dt>満年齢</dt><dd class="counter-report-dd--age">' +
      '<span class="counter-report-num" id="agAgeY">—</span><span class="counter-report-unit"> 歳 </span>' +
      '<span class="counter-report-num" id="agAgeM">—</span><span class="counter-report-unit"> ヶ月</span></dd></div>' +
      '</dl></section>' +
      '<section class="counter-report-section">' +
      '<h2 class="counter-report-heading">日数・次の誕生日</h2>' +
      '<dl class="counter-report-dl">' +
      '<div class="counter-report-row"><dt>生まれてからの日数</dt><dd><span class="counter-report-num" id="agLived">—</span><span class="counter-report-unit"> 日</span></dd></div>' +
      '<div class="counter-report-row"><dt>次の誕生日まで</dt><dd><span class="counter-report-num" id="agUntil">—</span><span class="counter-report-unit"> 日</span></dd></div>' +
      '<div class="counter-report-row"><dt>次の誕生日</dt><dd><span class="simple-tool-live" id="agNextDate">—</span></dd></div>' +
      '</dl></section>' +
      '<section class="counter-report-section">' +
      '<h2 class="counter-report-heading">日付から分かること（目安）</h2>' +
      '<dl class="counter-report-dl">' +
      '<div class="counter-report-row"><dt>誕生日の曜日</dt><dd><span id="agBirthDow">—</span></dd></div>' +
      '<div class="counter-report-row"><dt>黄道上の星座（日付区分）</dt><dd><span id="agZodiac">—</span></dd></div>' +
      '<div class="counter-report-row"><dt>生まれた年の六十干支（年柱・簡易）</dt><dd><span id="agKanshi">—</span></dd></div>' +
      '</dl>' +
      '<p class="counter-report-note">六十干支の年柱は西暦の元旦基準の簡易表現です（立春を境とする場合や日柱・時柱とは異なります）。星座も日付のみの区分で、境界の時刻は考慮しません。2/29 生まれは環境によって日付解釈がずれることがあります。</p>' +
      '</section></div></div>';

    function refresh() {
      var birthStr = root.querySelector("#agd").value;
      var refStr = root.querySelector("#agr").value;
      var $ageY = root.querySelector("#agAgeY");
      var $ageM = root.querySelector("#agAgeM");
      var $lived = root.querySelector("#agLived");
      var $until = root.querySelector("#agUntil");
      var $nextDate = root.querySelector("#agNextDate");
      var $birthDow = root.querySelector("#agBirthDow");
      var $zodiac = root.querySelector("#agZodiac");
      var $kanshi = root.querySelector("#agKanshi");

      if (!birthStr) {
        $ageY.textContent = "—";
        $ageM.textContent = "—";
        $lived.textContent = "—";
        $until.textContent = "—";
        $nextDate.textContent = "—";
        $birthDow.textContent = "—";
        $zodiac.textContent = "—";
        $kanshi.textContent = "—";
        return;
      }

      var b = parseYmd(birthStr);
      if (!b || isNaN(b.getTime())) {
        $ageY.textContent = "—";
        $ageM.textContent = "—";
        $lived.textContent = "—";
        $until.textContent = "—";
        $nextDate.textContent = "—";
        $birthDow.textContent = "—";
        $zodiac.textContent = "—";
        $kanshi.textContent = "—";
        return;
      }

      var ref;
      if (!refStr) {
        var tn = new Date();
        ref = new Date(tn.getFullYear(), tn.getMonth(), tn.getDate());
      } else {
        ref = parseYmd(refStr);
        if (!ref || isNaN(ref.getTime())) {
          var tf = new Date();
          ref = new Date(tf.getFullYear(), tf.getMonth(), tf.getDate());
        } else {
          ref = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
        }
      }

      var refMs = dateOnlyMs(ref);
      var birthMs = dateOnlyMs(b);
      $birthDow.textContent = wk[b.getDay()] + "曜日";
      $zodiac.textContent = westernZodiac(b.getMonth(), b.getDate());
      $kanshi.textContent = yearKanshi(b.getFullYear());

      if (refMs < birthMs) {
        $ageY.textContent = "—";
        $ageM.textContent = "—";
        $lived.textContent = "—";
        $until.textContent = "—";
        $nextDate.textContent = "基準日が誕生日より前です";
        return;
      }

      var y = ref.getFullYear() - b.getFullYear();
      var m = ref.getMonth() - b.getMonth();
      var d = ref.getDate() - b.getDate();
      if (m < 0 || (m === 0 && d < 0)) y--;

      var lastBd = new Date(ref.getFullYear(), b.getMonth(), b.getDate());
      if (lastBd.getTime() > refMs) lastBd.setFullYear(lastBd.getFullYear() - 1);
      var ageMo = monthsSinceDateOnly(lastBd, ref);

      var livedDays = Math.round((refMs - birthMs) / 86400000);

      var next = new Date(ref.getFullYear(), b.getMonth(), b.getDate());
      if (next.getTime() < refMs) next.setFullYear(next.getFullYear() + 1);
      var untilDays = Math.round((next.getTime() - refMs) / 86400000);

      $ageY.textContent = String(y);
      $ageM.textContent = String(ageMo);
      $lived.textContent = livedDays.toLocaleString("ja-JP");
      $until.textContent = untilDays.toLocaleString("ja-JP");
      $nextDate.textContent =
        next.getFullYear() +
        "年" +
        (next.getMonth() + 1) +
        "月" +
        next.getDate() +
        "日（" +
        wk[next.getDay()] +
        "）";
    }

    root.querySelector("#agd").addEventListener("input", refresh);
    root.querySelector("#agd").addEventListener("change", refresh);
    root.querySelector("#agr").addEventListener("input", refresh);
    root.querySelector("#agr").addEventListener("change", refresh);
    refresh();
  };

  T.bmi = function (root) {
    root.innerHTML =
      '<p class="convert-hint">身長（cm）と体重（kg）から BMI を算出します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">身長 (cm)</span>' +
      '<input type="number" class="simple-tool-input" id="bmic" min="1" step="0.1" placeholder="170"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">体重 (kg)</span>' +
      '<input type="number" class="simple-tool-input" id="bmiw" min="1" step="0.1" placeholder="65"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="bmigo">計算</button></div>' +
      '<pre class="simple-tool-output" id="bmiout"></pre><p class="simple-tool-note">表示は目安です。医療判断には使わないでください。</p>';
    root.querySelector("#bmigo").addEventListener("click", function () {
      var h = parseFloat(root.querySelector("#bmic").value, 10) / 100;
      var w = parseFloat(root.querySelector("#bmiw").value, 10);
      if (!h || !w) {
        root.querySelector("#bmiout").textContent = "数値を入力してください";
        return;
      }
      var bmi = w / (h * h);
      var cat =
        bmi < 18.5 ? "低体重" : bmi < 25 ? "普通" : bmi < 30 ? "肥満(1度)" : "肥満(2度以上)";
      root.querySelector("#bmiout").textContent =
        "BMI: " + bmi.toFixed(1) + "\n目安区分: " + cat + "（WHO 系の簡易区分）";
    });
  };

  T.percentCalc = function (root) {
    root.innerHTML =
      '<p class="convert-hint">割合・値引き・増減率の素早い計算です。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">元の値</span>' +
      '<input type="number" class="simple-tool-input" id="p1" step="any"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">パーセント (%)</span>' +
      '<input type="number" class="simple-tool-input" id="p2" step="any"/></label></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="pgo1">「p%」の値</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="pgo2">A は B の何%</button></div>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">比較用 B（2つ目のボタン用）</span>' +
      '<input type="number" class="simple-tool-input" id="p3" step="any"/></label>' +
      '<pre class="simple-tool-output" id="pout"></pre>';
    root.querySelector("#pgo1").addEventListener("click", function () {
      var a = parseFloat(root.querySelector("#p1").value, 10);
      var p = parseFloat(root.querySelector("#p2").value, 10);
      if (isNaN(a) || isNaN(p)) {
        root.querySelector("#pout").textContent = "数値を入力してください";
        return;
      }
      root.querySelector("#pout").textContent =
        (a * p) / 100 + "（" + a + " の " + p + "%）\n" +
        "増加後: " + (a * (1 + p / 100)) + "\n" +
        "減少後: " + (a * (1 - p / 100));
    });
    root.querySelector("#pgo2").addEventListener("click", function () {
      var a = parseFloat(root.querySelector("#p1").value, 10);
      var b = parseFloat(root.querySelector("#p3").value, 10);
      if (isNaN(a) || isNaN(b) || b === 0) {
        root.querySelector("#pout").textContent = "A と B を入力してください（B≠0）";
        return;
      }
      root.querySelector("#pout").textContent =
        (a / b) * 100 + "%（A が B の割合）\n変化率: " + (((a - b) / b) * 100).toFixed(2) + "%";
    });
  };

  T.loanSim = function (root) {
    root.innerHTML =
      '<p class="convert-hint">元利均等返済の月額の目安（簡易シミュレーション）。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">借入額（円）</span>' +
      '<input type="number" class="simple-tool-input" id="lp" min="1"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">年利（%）</span>' +
      '<input type="number" class="simple-tool-input" id="lr" min="0" step="0.01" placeholder="1.5"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">返済年数</span>' +
      '<input type="number" class="simple-tool-input" id="ly" min="1" value="35"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="lgo">計算</button></div>' +
      '<pre class="simple-tool-output" id="lout"></pre><p class="simple-tool-note">実際の契約条件・端数処理とは異なる場合があります。</p>';
    root.querySelector("#lgo").addEventListener("click", function () {
      var P = parseFloat(root.querySelector("#lp").value);
      var annual = parseFloat(root.querySelector("#lr").value) / 100;
      var years = parseInt(root.querySelector("#ly").value, 10);
      if (!P || years < 1) {
        root.querySelector("#lout").textContent = "値を確認してください";
        return;
      }
      var n = years * 12;
      var r = annual / 12;
      var pay;
      if (r === 0) pay = P / n;
      else pay = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      var total = pay * n;
      root.querySelector("#lout").textContent =
        "月額目安: " +
        Math.round(pay).toLocaleString("ja-JP") +
        " 円\n総返済額目安: " +
        Math.round(total).toLocaleString("ja-JP") +
        " 円";
    });
  };

  T.taxJp = function (root) {
    root.innerHTML =
      '<p class="convert-hint">消費税 10% / 8%（軽減）の税込・税抜を相互計算します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">税率</span>' +
      '<select class="simple-tool-select" id="txr"><option value="0.1">10%</option><option value="0.08">8%（軽減）</option></select></label>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">税抜金額</span>' +
      '<input type="number" class="simple-tool-input" id="txe" step="1"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">税込金額</span>' +
      '<input type="number" class="simple-tool-input" id="txi" step="1"/></label></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="txgo1">税抜→税込</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="txgo2">税込→税抜</button></div>' +
      '<pre class="simple-tool-output" id="txout"></pre>';
    root.querySelector("#txgo1").addEventListener("click", function () {
      var r = parseFloat(root.querySelector("#txr").value);
      var e = parseFloat(root.querySelector("#txe").value);
      if (isNaN(e)) return;
      root.querySelector("#txout").textContent =
        "税込: " + Math.round(e * (1 + r)).toLocaleString("ja-JP") + " 円";
    });
    root.querySelector("#txgo2").addEventListener("click", function () {
      var r = parseFloat(root.querySelector("#txr").value);
      var i = parseFloat(root.querySelector("#txi").value);
      if (isNaN(i)) return;
      root.querySelector("#txout").textContent =
        "税抜: " + Math.round(i / (1 + r)).toLocaleString("ja-JP") + " 円";
    });
  };

  T.radixConv = function (root) {
    root.innerHTML =
      '<p class="convert-hint">2〜36 進数の整数を相互変換します。</p>' +
      '<textarea class="simple-tool-textarea" id="rxin" placeholder="例: FF や 1010"></textarea>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">入力の基数</span>' +
      '<input type="number" class="simple-tool-input" id="rxb1" min="2" max="36" value="10"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">出力の基数</span>' +
      '<input type="number" class="simple-tool-input" id="rxb2" min="2" max="36" value="16"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="rxgo">変換</button></div>' +
      '<pre class="simple-tool-output" id="rxout"></pre>';
    root.querySelector("#rxgo").addEventListener("click", function () {
      var s = root.querySelector("#rxin").value.trim();
      var b1 = parseInt(root.querySelector("#rxb1").value, 10);
      var b2 = parseInt(root.querySelector("#rxb2").value, 10);
      try {
        var n = parseInt(s, b1);
        if (isNaN(n)) throw new Error("解釈できません");
        root.querySelector("#rxout").textContent = n.toString(b2);
      } catch (e) {
        root.querySelector("#rxout").textContent = e.message;
      }
    });
  };

  T.colorConv = function (root) {
    root.innerHTML =
      '<div class="color-conv-tool">' +
      '<div class="color-conv-preview-wrap">' +
      '<div class="simple-tool-field color-conv-hex-field">' +
      '<label class="simple-tool-label" for="ccHex">カラーコード（HEX）</label>' +
      '<div class="color-conv-hex-row">' +
      '<input type="text" class="simple-tool-input" id="ccHex" placeholder="#6c4b4b" inputmode="text"/>' +
      '<label class="color-conv-picker-only" id="ccPickerWrap" title="カラーピッカーで色を選択">' +
      '<input type="color" class="color-conv-picker-native" id="ccPicker" aria-label="カラーピッカーで色を選択"/>' +
      "</label>" +
      "</div></div></div>" +
      '<div class="color-conv-tabs-wrap">' +
      '<div class="convert-tabs color-conv-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="rgb" aria-selected="true">RGB</button>' +
      '<button type="button" class="convert-tab" data-tab="hsl" aria-selected="false">HSL</button>' +
      '<button type="button" class="convert-tab" data-tab="cmyk" aria-selected="false">CMYK</button>' +
      '<button type="button" class="convert-tab" data-tab="lab" aria-selected="false">Lab</button>' +
      "</div>" +
      '<div data-tabpanel="rgb" class="convert-tabpanel simple-tool-stack color-conv-tabpanel">' +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">R</span>' +
      '<input type="range" class="color-conv-range" id="ccR" min="0" max="255" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccRN" min="0" max="255" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">G</span>' +
      '<input type="range" class="color-conv-range" id="ccG" min="0" max="255" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccGN" min="0" max="255" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">B</span>' +
      '<input type="range" class="color-conv-range" id="ccB" min="0" max="255" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccBN" min="0" max="255" step="1" inputmode="numeric"/>' +
      "</div></div>" +
      '<div data-tabpanel="hsl" class="convert-tabpanel simple-tool-stack color-conv-tabpanel" hidden>' +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">H (°)</span>' +
      '<input type="range" class="color-conv-range" id="ccH" min="0" max="360" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccHN" min="0" max="360" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">S (%)</span>' +
      '<input type="range" class="color-conv-range" id="ccS" min="0" max="100" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccSN" min="0" max="100" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">L (%)</span>' +
      '<input type="range" class="color-conv-range" id="ccL" min="0" max="100" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccLN" min="0" max="100" step="1" inputmode="numeric"/>' +
      "</div></div>" +
      '<div data-tabpanel="cmyk" class="convert-tabpanel simple-tool-stack color-conv-tabpanel" hidden>' +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">C (%)</span>' +
      '<input type="range" class="color-conv-range" id="ccC" min="0" max="100" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccCN" min="0" max="100" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">M (%)</span>' +
      '<input type="range" class="color-conv-range" id="ccM" min="0" max="100" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccMN" min="0" max="100" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">Y (%)</span>' +
      '<input type="range" class="color-conv-range" id="ccY" min="0" max="100" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccYN" min="0" max="100" step="1" inputmode="numeric"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">K (%)</span>' +
      '<input type="range" class="color-conv-range" id="ccK" min="0" max="100" step="1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccKN" min="0" max="100" step="1" inputmode="numeric"/>' +
      "</div></div>" +
      '<div data-tabpanel="lab" class="convert-tabpanel simple-tool-stack color-conv-tabpanel" hidden>' +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">L*</span>' +
      '<input type="range" class="color-conv-range" id="ccLabL" min="0" max="100" step="0.1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccLabLN" min="0" max="100" step="0.1" inputmode="decimal"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">a*</span>' +
      '<input type="range" class="color-conv-range" id="ccLabA" min="-128" max="127" step="0.1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccLabAN" min="-128" max="127" step="0.1" inputmode="decimal"/>' +
      "</div>" +
      '<div class="color-conv-slider-row">' +
      '<span class="color-conv-slider-name">b*</span>' +
      '<input type="range" class="color-conv-range" id="ccLabB" min="-128" max="127" step="0.1"/>' +
      '<input type="number" class="simple-tool-input color-conv-num" id="ccLabBN" min="-128" max="127" step="0.1" inputmode="decimal"/>' +
      "</div></div>" +
      "</div>" +
      '<p class="simple-tool-note" id="ccError" aria-live="polite"></p>' +
      "</div>";

    var $ = function (sel) {
      return root.querySelector(sel);
    };
    var els = {
      hex: $("#ccHex"),
      pickerWrap: $("#ccPickerWrap"),
      picker: $("#ccPicker"),
      r: $("#ccR"),
      g: $("#ccG"),
      b: $("#ccB"),
      h: $("#ccH"),
      s: $("#ccS"),
      l: $("#ccL"),
      c: $("#ccC"),
      m: $("#ccM"),
      y: $("#ccY"),
      k: $("#ccK"),
      labL: $("#ccLabL"),
      labA: $("#ccLabA"),
      labB: $("#ccLabB"),
      rN: $("#ccRN"),
      gN: $("#ccGN"),
      bN: $("#ccBN"),
      hN: $("#ccHN"),
      sN: $("#ccSN"),
      lN: $("#ccLN"),
      cN: $("#ccCN"),
      mN: $("#ccMN"),
      yN: $("#ccYN"),
      kN: $("#ccKN"),
      labLN: $("#ccLabLN"),
      labAN: $("#ccLabAN"),
      labBN: $("#ccLabBN"),
      error: $("#ccError"),
    };
    var syncing = false;

    function clamp(n, min, max) {
      return Math.min(max, Math.max(min, n));
    }
    function round(n, d) {
      var p = Math.pow(10, d || 0);
      return Math.round(n * p) / p;
    }
    function mod360(n) {
      var x = n % 360;
      return x < 0 ? x + 360 : x;
    }
    function readNumber(el) {
      var v = parseFloat(el.value);
      return isNaN(v) ? null : v;
    }
    function parseHex(hex) {
      var s = String(hex || "").trim().replace(/^#/, "");
      if (/^[0-9a-f]{3}$/i.test(s)) {
        s = s
          .split("")
          .map(function (ch) {
            return ch + ch;
          })
          .join("");
      }
      if (!/^[0-9a-f]{6}$/i.test(s)) return null;
      return {
        r: parseInt(s.slice(0, 2), 16),
        g: parseInt(s.slice(2, 4), 16),
        b: parseInt(s.slice(4, 6), 16),
      };
    }
    function rgbToHex(rgb) {
      function h(v) {
        return clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
      }
      return "#" + h(rgb.r) + h(rgb.g) + h(rgb.b);
    }
    function rgbToHsl(rgb) {
      var r = rgb.r / 255;
      var g = rgb.g / 255;
      var b = rgb.b / 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h = 0;
      var s = 0;
      var l = (max + min) / 2;
      if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        else if (max === g) h = ((b - r) / d + 2) * 60;
        else h = ((r - g) / d + 4) * 60;
      }
      return { h: mod360(h), s: s * 100, l: l * 100 };
    }
    function hslToRgb(hsl) {
      var h = mod360(hsl.h) / 360;
      var s = clamp(hsl.s, 0, 100) / 100;
      var l = clamp(hsl.l, 0, 100) / 100;
      var r;
      var g;
      var b;
      if (s === 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        function hue2rgb(t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }
        r = hue2rgb(h + 1 / 3);
        g = hue2rgb(h);
        b = hue2rgb(h - 1 / 3);
      }
      return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
    }
    function rgbToCmyk(rgb) {
      var r = clamp(rgb.r, 0, 255) / 255;
      var g = clamp(rgb.g, 0, 255) / 255;
      var b = clamp(rgb.b, 0, 255) / 255;
      var k = 1 - Math.max(r, g, b);
      if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
      return {
        c: ((1 - r - k) / (1 - k)) * 100,
        m: ((1 - g - k) / (1 - k)) * 100,
        y: ((1 - b - k) / (1 - k)) * 100,
        k: k * 100,
      };
    }
    function cmykToRgb(cmyk) {
      var c = clamp(cmyk.c, 0, 100) / 100;
      var m = clamp(cmyk.m, 0, 100) / 100;
      var y = clamp(cmyk.y, 0, 100) / 100;
      var k = clamp(cmyk.k, 0, 100) / 100;
      return {
        r: round(255 * (1 - c) * (1 - k)),
        g: round(255 * (1 - m) * (1 - k)),
        b: round(255 * (1 - y) * (1 - k)),
      };
    }
    function rgbToXyz(rgb) {
      function pivot(v) {
        v /= 255;
        return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
      }
      var r = pivot(rgb.r);
      var g = pivot(rgb.g);
      var b = pivot(rgb.b);
      return {
        x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
        y: r * 0.2126729 + g * 0.7151522 + b * 0.072175,
        z: r * 0.0193339 + g * 0.119192 + b * 0.9503041,
      };
    }
    function xyzToLab(xyz) {
      var xr = xyz.x / 0.95047;
      var yr = xyz.y / 1.0;
      var zr = xyz.z / 1.08883;
      function f(t) {
        return t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;
      }
      var fx = f(xr);
      var fy = f(yr);
      var fz = f(zr);
      return {
        l: 116 * fy - 16,
        a: 500 * (fx - fy),
        b: 200 * (fy - fz),
      };
    }
    function labToXyz(lab) {
      var fy = (lab.l + 16) / 116;
      var fx = fy + lab.a / 500;
      var fz = fy - lab.b / 200;
      function invF(t) {
        var t3 = t * t * t;
        return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
      }
      return {
        x: 0.95047 * invF(fx),
        y: 1.0 * invF(fy),
        z: 1.08883 * invF(fz),
      };
    }
    function xyzToRgb(xyz) {
      var r = xyz.x * 3.2404542 + xyz.y * -1.5371385 + xyz.z * -0.4985314;
      var g = xyz.x * -0.969266 + xyz.y * 1.8760108 + xyz.z * 0.041556;
      var b = xyz.x * 0.0556434 + xyz.y * -0.2040259 + xyz.z * 1.0572252;
      function gamma(v) {
        return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
      }
      return {
        r: round(clamp(gamma(r), 0, 1) * 255),
        g: round(clamp(gamma(g), 0, 1) * 255),
        b: round(clamp(gamma(b), 0, 1) * 255),
      };
    }
    function rgbToLab(rgb) {
      return xyzToLab(rgbToXyz(rgb));
    }
    function labToRgb(lab) {
      return xyzToRgb(labToXyz(lab));
    }
    function setError(msg) {
      els.error.textContent = msg || "";
    }
    function renderFromRgb(rgb) {
      syncing = true;
      try {
        var rgbSafe = {
          r: clamp(Math.round(rgb.r), 0, 255),
          g: clamp(Math.round(rgb.g), 0, 255),
          b: clamp(Math.round(rgb.b), 0, 255),
        };
        var hex = rgbToHex(rgbSafe);
        var hsl = rgbToHsl(rgbSafe);
        var cmyk = rgbToCmyk(rgbSafe);
        var lab = rgbToLab(rgbSafe);

        els.r.value = String(rgbSafe.r);
        els.g.value = String(rgbSafe.g);
        els.b.value = String(rgbSafe.b);
        els.rN.value = String(rgbSafe.r);
        els.gN.value = String(rgbSafe.g);
        els.bN.value = String(rgbSafe.b);
        els.hex.value = hex;
        els.picker.value = hex;
        els.pickerWrap.style.backgroundColor = hex;
        els.h.value = String(Math.round(hsl.h));
        els.s.value = String(Math.round(hsl.s));
        els.l.value = String(Math.round(hsl.l));
        els.hN.value = String(Math.round(hsl.h));
        els.sN.value = String(Math.round(hsl.s));
        els.lN.value = String(Math.round(hsl.l));
        els.c.value = String(Math.round(cmyk.c));
        els.m.value = String(Math.round(cmyk.m));
        els.y.value = String(Math.round(cmyk.y));
        els.k.value = String(Math.round(cmyk.k));
        els.cN.value = String(Math.round(cmyk.c));
        els.mN.value = String(Math.round(cmyk.m));
        els.yN.value = String(Math.round(cmyk.y));
        els.kN.value = String(Math.round(cmyk.k));
        var labL = clamp(round(lab.l, 1), 0, 100);
        var labA = clamp(round(lab.a, 1), -128, 127);
        var labB = clamp(round(lab.b, 1), -128, 127);
        els.labL.value = String(labL);
        els.labA.value = String(labA);
        els.labB.value = String(labB);
        els.labLN.value = String(labL);
        els.labAN.value = String(labA);
        els.labBN.value = String(labB);
        setError("");
      } finally {
        syncing = false;
      }
    }
    function updateFromHex() {
      if (syncing) return;
      var rgb = parseHex(els.hex.value);
      if (!rgb) {
        setError("有効なHEX形式を入力してください（例: #6c4b4b / #abc）");
        return;
      }
      renderFromRgb(rgb);
    }
    function updateFromRgb() {
      if (syncing) return;
      var r = readNumber(els.r);
      var g = readNumber(els.g);
      var b = readNumber(els.b);
      if (r == null || g == null || b == null) {
        setError("RGBは数値で入力してください。");
        return;
      }
      renderFromRgb({ r: r, g: g, b: b });
    }
    function updateFromHsl() {
      if (syncing) return;
      var h = readNumber(els.h);
      var s = readNumber(els.s);
      var l = readNumber(els.l);
      if (h == null || s == null || l == null) {
        setError("HSLは数値で入力してください。");
        return;
      }
      renderFromRgb(hslToRgb({ h: h, s: s, l: l }));
    }
    function updateFromCmyk() {
      if (syncing) return;
      var c = readNumber(els.c);
      var m = readNumber(els.m);
      var y = readNumber(els.y);
      var k = readNumber(els.k);
      if (c == null || m == null || y == null || k == null) {
        setError("CMYKは数値で入力してください。");
        return;
      }
      renderFromRgb(cmykToRgb({ c: c, m: m, y: y, k: k }));
    }
    function updateFromLab() {
      if (syncing) return;
      var l = readNumber(els.labL);
      var a = readNumber(els.labA);
      var b = readNumber(els.labB);
      if (l == null || a == null || b == null) {
        setError("Labは数値で入力してください。");
        return;
      }
      renderFromRgb(
        labToRgb({
          l: clamp(l, 0, 100),
          a: clamp(a, -128, 127),
          b: clamp(b, -128, 127),
        })
      );
    }

    [els.hex].forEach(function (el) {
      el.addEventListener("change", updateFromHex);
      el.addEventListener("blur", updateFromHex);
    });
    function bindRange(el, fn) {
      el.addEventListener("input", fn);
      el.addEventListener("change", fn);
    }
    function bindRangeAndNumber(rangeEl, numEl, fn) {
      bindRange(rangeEl, function () {
        if (!syncing) numEl.value = rangeEl.value;
        fn();
      });
      numEl.addEventListener("input", function () {
        if (!syncing) rangeEl.value = numEl.value;
        fn();
      });
      numEl.addEventListener("change", function () {
        if (!syncing) rangeEl.value = numEl.value;
        fn();
      });
    }
    bindRangeAndNumber(els.r, els.rN, updateFromRgb);
    bindRangeAndNumber(els.g, els.gN, updateFromRgb);
    bindRangeAndNumber(els.b, els.bN, updateFromRgb);
    bindRangeAndNumber(els.h, els.hN, updateFromHsl);
    bindRangeAndNumber(els.s, els.sN, updateFromHsl);
    bindRangeAndNumber(els.l, els.lN, updateFromHsl);
    bindRangeAndNumber(els.c, els.cN, updateFromCmyk);
    bindRangeAndNumber(els.m, els.mN, updateFromCmyk);
    bindRangeAndNumber(els.y, els.yN, updateFromCmyk);
    bindRangeAndNumber(els.k, els.kN, updateFromCmyk);
    bindRangeAndNumber(els.labL, els.labLN, updateFromLab);
    bindRangeAndNumber(els.labA, els.labAN, updateFromLab);
    bindRangeAndNumber(els.labB, els.labBN, updateFromLab);
    bindTabs(root, ".convert-tab");
    els.picker.addEventListener("input", function () {
      if (syncing) return;
      var rgb = parseHex(els.picker.value);
      if (rgb) renderFromRgb(rgb);
    });

    renderFromRgb({ r: 108, g: 75, b: 75 });
  };

  T.contrast = function (root) {
    root.innerHTML =
      '<p class="convert-hint">2 色の相対輝度から WCAG 2.1 のコントラスト比を計算します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">前景 #RRGGBB</span>' +
      '<input type="text" class="simple-tool-input" id="cf" placeholder="#000000"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">背景 #RRGGBB</span>' +
      '<input type="text" class="simple-tool-input" id="cb" placeholder="#ffffff"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="ctgo">計算</button></div>' +
      '<pre class="simple-tool-output" id="ctout"></pre>';
    function lum(hex) {
      var m = hex.replace(/^#/, "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (!m) return null;
      var rgb = [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
      var a = rgb.map(function (v) {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }
    root.querySelector("#ctgo").addEventListener("click", function () {
      var L1 = lum(root.querySelector("#cf").value.trim());
      var L2 = lum(root.querySelector("#cb").value.trim());
      if (L1 == null || L2 == null) {
        root.querySelector("#ctout").textContent = "色の形式を確認してください";
        return;
      }
      var lighter = Math.max(L1, L2);
      var darker = Math.min(L1, L2);
      var ratio = (lighter + 0.05) / (darker + 0.05);
      root.querySelector("#ctout").textContent =
        "コントラスト比: " +
        ratio.toFixed(2) +
        ":1\n" +
        "AA 大文字: " +
        (ratio >= 3 ? "達成" : "未達") +
        " / AA 本文: " +
        (ratio >= 4.5 ? "達成" : "未達") +
        " / AAA 本文: " +
        (ratio >= 7 ? "達成" : "未達");
    });
  };

  T.gradientCss = function (root) {
    root.innerHTML =
      '<div id="gprev" class="gradient-css-preview" aria-label="グラデーション結果"></div>' +
      '<div class="case-convert-result gradient-css-code-wrap">' +
      '<div class="case-convert-result-toolbar">' +
      '<button type="button" class="simple-tool-icon-btn case-convert-copy" id="gcp" aria-label="CSSコードをコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
      '<pre class="simple-tool-output case-convert-output gradient-css-code" id="gout"></pre></div>' +
      '<div class="simple-tool-row gradient-css-controls">' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">色1</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="g1w" title="色1を選択">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="g1" value="#6366f1" aria-label="色1"></label></div>' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">色2</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="g2w" title="色2を選択">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="g2" value="#ec4899" aria-label="色2"></label></div>' +
      '<label class="simple-tool-field gradient-css-field"><span class="simple-tool-label">角度 (deg)</span>' +
      '<input type="number" class="simple-tool-input" id="gd" value="135" min="0" max="360" step="1" aria-label="角度"></label>' +
      '<div class="gradient-css-random-wrap">' +
      '<button type="button" class="simple-tool-icon-btn gradient-css-random-btn" id="grand" aria-label="色と角度を一括ランダム" title="ランダム">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 2v6h-6"/><path d="M3 11a8 8 0 0 1 13.66-5.66L21 9"/><path d="M3 22v-6h6"/><path d="M21 13a8 8 0 0 1-13.66 5.66L3 15"/></svg></button>' +
      "</div></div>";
    function randomHex() {
      var n = Math.floor(Math.random() * 16777216);
      return "#" + n.toString(16).padStart(6, "0");
    }
    function randomizeAll() {
      root.querySelector("#g1").value = randomHex();
      root.querySelector("#g2").value = randomHex();
      root.querySelector("#gd").value = String(Math.floor(Math.random() * 361));
      upd();
    }
    function upd() {
      var degNum = parseInt(root.querySelector("#gd").value, 10);
      if (!Number.isFinite(degNum)) degNum = 90;
      degNum = ((degNum % 360) + 360) % 360;
      root.querySelector("#gd").value = String(degNum);
      var a = root.querySelector("#g1").value;
      var b = root.querySelector("#g2").value;
      var css = "linear-gradient(" + degNum + "deg, " + a + ", " + b + ")";
      root.querySelector("#g1w").style.backgroundColor = a;
      root.querySelector("#g2w").style.backgroundColor = b;
      root.querySelector("#gout").textContent = "background: " + css + ";";
      root.querySelector("#gprev").style.background = css;
    }
    root.querySelector("#g1").addEventListener("input", upd);
    root.querySelector("#g2").addEventListener("input", upd);
    root.querySelector("#gd").addEventListener("input", upd);
    root.querySelector("#grand").addEventListener("click", randomizeAll);
    root.querySelector("#gcp").addEventListener("click", function () {
      copyText(root.querySelector("#gout").textContent);
    });
    upd();
  };

  T.meshGradientCss = function (root) {
    var BLOBS = [
      { at: "22% 28%", op: 0.55, fade: "52%" },
      { at: "78% 24%", op: 0.52, fade: "50%" },
      { at: "72% 76%", op: 0.5, fade: "50%" },
      { at: "18% 78%", op: 0.48, fade: "46%" },
    ];
    root.innerHTML =
      '<div id="mgprev" class="gradient-css-preview" aria-label="メッシュ風グラデーション結果"></div>' +
      '<div class="case-convert-result gradient-css-code-wrap">' +
      '<div class="case-convert-result-toolbar">' +
      '<button type="button" class="simple-tool-icon-btn case-convert-copy" id="mgcp" aria-label="CSSコードをコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
      '<pre class="simple-tool-output case-convert-output gradient-css-code" id="mgout"></pre></div>' +
      '<div class="simple-tool-row gradient-css-controls mesh-gradient-controls">' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">下地</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="mgbw" title="下地色">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="mgb" value="#0f172a" aria-label="下地色"></label></div>' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">色1</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="mg1w" title="色1">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="mg1" value="#6366f1" aria-label="色1"></label></div>' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">色2</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="mg2w" title="色2">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="mg2" value="#ec4899" aria-label="色2"></label></div>' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">色3</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="mg3w" title="色3">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="mg3" value="#22d3ee" aria-label="色3"></label></div>' +
      '<div class="simple-tool-field gradient-css-field"><span class="simple-tool-label">色4</span>' +
      '<label class="color-conv-picker-only gradient-css-picker" id="mg4w" title="色4">' +
      '<input type="color" class="color-conv-picker-native gradient-css-color-input" id="mg4" value="#fbbf24" aria-label="色4"></label></div>' +
      '<div class="gradient-css-random-wrap">' +
      '<button type="button" class="simple-tool-icon-btn gradient-css-random-btn" id="mgrnd" aria-label="色を一括ランダム" title="ランダム">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 2v6h-6"/><path d="M3 11a8 8 0 0 1 13.66-5.66L21 9"/><path d="M3 22v-6h6"/><path d="M21 13a8 8 0 0 1-13.66 5.66L3 15"/></svg></button>' +
      "</div></div>";
    function hexToRgb(hex) {
      var m = String(hex)
        .replace(/^#/, "")
        .match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (!m) return { r: 0, g: 0, b: 0 };
      return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
    }
    function rgbaFromHex(hex, a) {
      var o = hexToRgb(hex);
      return "rgba(" + o.r + ", " + o.g + ", " + o.b + ", " + a + ")";
    }
    function randomHex() {
      var n = Math.floor(Math.random() * 16777216);
      return "#" + n.toString(16).padStart(6, "0");
    }
    function randomizeAll() {
      root.querySelector("#mgb").value = randomHex();
      root.querySelector("#mg1").value = randomHex();
      root.querySelector("#mg2").value = randomHex();
      root.querySelector("#mg3").value = randomHex();
      root.querySelector("#mg4").value = randomHex();
      upd();
    }
    function upd() {
      var base = root.querySelector("#mgb").value;
      var cols = [
        root.querySelector("#mg1").value,
        root.querySelector("#mg2").value,
        root.querySelector("#mg3").value,
        root.querySelector("#mg4").value,
      ];
      var layers = [];
      var lines = [];
      for (var i = 0; i < BLOBS.length; i++) {
        var b = BLOBS[i];
        var inner = rgbaFromHex(cols[i], b.op);
        var layer =
          "radial-gradient(circle at " + b.at + ", " + inner + " 0%, transparent " + b.fade + ")";
        layers.push(layer);
        lines.push("  " + layer + (i < BLOBS.length - 1 ? "," : ""));
      }
      var cssBlock =
        "background-color: " +
        base +
        ";\n" +
        "background-image:\n" +
        lines.join("\n") +
        ";\n" +
        "background-repeat: no-repeat;\n" +
        "background-size: cover;";
      root.querySelector("#mgout").textContent = cssBlock;
      var prev = root.querySelector("#mgprev");
      prev.style.backgroundColor = base;
      prev.style.backgroundImage = layers.join(", ");
      prev.style.backgroundRepeat = "no-repeat";
      prev.style.backgroundSize = "cover";
      root.querySelector("#mgbw").style.backgroundColor = base;
      root.querySelector("#mg1w").style.backgroundColor = cols[0];
      root.querySelector("#mg2w").style.backgroundColor = cols[1];
      root.querySelector("#mg3w").style.backgroundColor = cols[2];
      root.querySelector("#mg4w").style.backgroundColor = cols[3];
    }
    ["#mgb", "#mg1", "#mg2", "#mg3", "#mg4"].forEach(function (sel) {
      root.querySelector(sel).addEventListener("input", upd);
    });
    root.querySelector("#mgrnd").addEventListener("click", randomizeAll);
    root.querySelector("#mgcp").addEventListener("click", function () {
      copyText(root.querySelector("#mgout").textContent);
    });
    upd();
  };

  T.lorem = function (root) {
    var ja =
      "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。\n" +
      "またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。";
    var en =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    root.innerHTML =
      '<div class="simple-tool-stack">' +
      '<div class="case-convert-result" style="margin-bottom:12px">' +
      '<div class="case-convert-result-toolbar">' +
      '<span style="margin-right:auto" aria-hidden="true"></span>' +
      '<button type="button" class="simple-tool-icon-btn" id="lmcpJa" aria-label="日本語ダミー文章をコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>' +
      "</div>" +
      '<pre class="simple-tool-output case-convert-output" id="lmoutJa" style="white-space:pre-wrap"></pre>' +
      "</div>" +
      '<div class="case-convert-result">' +
      '<div class="case-convert-result-toolbar">' +
      '<span style="margin-right:auto" aria-hidden="true"></span>' +
      '<button type="button" class="simple-tool-icon-btn" id="lmcpEn" aria-label="英語ダミー文章をコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>' +
      "</div>" +
      '<pre class="simple-tool-output case-convert-output" id="lmoutEn" style="white-space:pre-wrap"></pre>' +
      "</div>" +
      "</div>";
    root.querySelector("#lmoutJa").textContent = ja;
    root.querySelector("#lmoutEn").textContent = en;
    root.querySelector("#lmcpJa").classList.add("case-convert-copy");
    root.querySelector("#lmcpEn").classList.add("case-convert-copy");
    root.querySelector("#lmcpJa").addEventListener("click", function () {
      var t = root.querySelector("#lmoutJa").textContent;
      if (t === "") {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(t);
    });
    root.querySelector("#lmcpEn").addEventListener("click", function () {
      var t = root.querySelector("#lmoutEn").textContent;
      if (t === "") {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(t);
    });
  };

  T.zenkaku = function (root) {
    root.innerHTML =
      '<p class="convert-hint">半角英数字・記号を全角に、または全角英数字を半角に変換します（ブラウザ内処理）。</p>' +
      '<div class="case-convert-result">' +
      '<div class="case-convert-result-toolbar">' +
      '<button type="button" class="simple-tool-icon-btn case-convert-copy" id="zkcp" aria-label="結果をコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
      '<pre class="simple-tool-output case-convert-output" id="zkout"></pre></div>' +
      '<textarea class="simple-tool-textarea" id="zkin" placeholder="ここにテキストを入力"></textarea>' +
      '<fieldset class="convert-pass-fieldset convert-pass-fieldset--phrase-options case-convert-opt-fieldset">' +
      '<legend class="convert-pass-fieldset-legend">オプション</legend>' +
      '<div class="convert-pass-phrase-case">' +
      '<span class="convert-ymd-lbl" id="zkModeHeading">変換先</span>' +
      '<div class="convert-pass-phrase-case-row zenkaku-mode-row" role="radiogroup" aria-labelledby="zkModeHeading">' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="zkmode" value="z" checked id="zkmodeZ" aria-label="全角に変換">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">全角</span></label>' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="zkmode" value="h" id="zkmodeH" aria-label="半角に変換">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">半角</span></label>' +
      "</div></div></fieldset>";
    var halfKana = "｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ";
    var fullKana = "。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜";
    function toZen(s) {
      var out = s.replace(/\u3000/g, "\u3000");
      out = out.replace(/ /g, "\u3000").replace(/[!-~]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
      });
      out = out.replace(/[\uff61-\uff9f]/g, function (ch) {
        var i = halfKana.indexOf(ch);
        return i >= 0 ? fullKana.charAt(i) : ch;
      });
      out = out.replace(/([カ-トハ-ホ])゛/g, function (m, p1) {
        var map = {
          "カ": "ガ", "キ": "ギ", "ク": "グ", "ケ": "ゲ", "コ": "ゴ",
          "サ": "ザ", "シ": "ジ", "ス": "ズ", "セ": "ゼ", "ソ": "ゾ",
          "タ": "ダ", "チ": "ヂ", "ツ": "ヅ", "テ": "デ", "ト": "ド",
          "ハ": "バ", "ヒ": "ビ", "フ": "ブ", "ヘ": "ベ", "ホ": "ボ"
        };
        return map[p1] || m;
      }).replace(/([ハ-ホ])゜/g, function (m, p1) {
        var map = { "ハ": "パ", "ヒ": "ピ", "フ": "プ", "ヘ": "ペ", "ホ": "ポ" };
        return map[p1] || m;
      }).replace(/ウ゛/g, "ヴ");
      return out;
    }
    function toHan(s) {
      var out = (s || "").replace(/\u3000/g, " ").replace(/[\uff01-\uff5e]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
      });
      out = out.replace(/[。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン]/g, function (ch) {
        var i = fullKana.indexOf(ch);
        return i >= 0 ? halfKana.charAt(i) : ch;
      });
      out = out.replace(/[ガギグゲゴザジズゼゾダヂヅデドバビブベボ]/g, function (ch) {
        var map = {
          "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
          "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
          "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
          "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ"
        };
        return map[ch] || ch;
      }).replace(/[パピプペポ]/g, function (ch) {
        var map = { "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ" };
        return map[ch] || ch;
      }).replace(/ヴ/g, "ｳﾞ");
      return out;
    }
    function refresh() {
      var v = root.querySelector("#zkin").value || "";
      var checked = root.querySelector('input[name="zkmode"]:checked');
      var m = checked ? checked.value : "z";
      root.querySelector("#zkout").textContent = m === "h" ? toHan(v) : toZen(v);
    }
    root.querySelector("#zkin").addEventListener("input", refresh);
    root.querySelector(".zenkaku-mode-row").addEventListener("change", refresh);
    root.querySelector("#zkcp").addEventListener("click", function () {
      var t = root.querySelector("#zkout").textContent;
      if (t === "") {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(t);
    });
    refresh();
  };

  T.kataHira = function (root) {
    root.innerHTML =
      '<p class="convert-hint">ひらがなとカタカナを相互変換します（簡易・1 文字単位、ブラウザ内処理）。</p>' +
      '<div class="case-convert-result">' +
      '<div class="case-convert-result-toolbar">' +
      '<button type="button" class="simple-tool-icon-btn case-convert-copy" id="khcp" aria-label="結果をコピー" title="コピー">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
      '<pre class="simple-tool-output case-convert-output" id="khout"></pre></div>' +
      '<textarea class="simple-tool-textarea" id="khin" placeholder="ここにテキストを入力"></textarea>' +
      '<fieldset class="convert-pass-fieldset convert-pass-fieldset--phrase-options case-convert-opt-fieldset">' +
      '<legend class="convert-pass-fieldset-legend">オプション</legend>' +
      '<div class="convert-pass-phrase-case">' +
      '<span class="convert-ymd-lbl" id="khModeHeading">変換先</span>' +
      '<div class="convert-pass-phrase-case-row katahira-mode-row" role="radiogroup" aria-labelledby="khModeHeading">' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="khmode" value="h" checked id="khmodeH" aria-label="ひらがなに変換">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">ひらがな</span></label>' +
      '<label class="convert-pass-option convert-pass-option--cond">' +
      '<input type="radio" name="khmode" value="k" id="khmodeK" aria-label="カタカナに変換">' +
      '<span class="convert-pass-opt-short" aria-hidden="true">カタカナ</span></label>' +
      "</div></div></fieldset>";

    function toHira(s) {
      return (s || "").replace(/[\u30a1-\u30f6]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0x60);
      });
    }
    function toKata(s) {
      return (s || "").replace(/[\u3041-\u3096]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) + 0x60);
      });
    }
    function refresh() {
      var v = root.querySelector("#khin").value || "";
      var checked = root.querySelector('input[name="khmode"]:checked');
      var m = checked ? checked.value : "h";
      root.querySelector("#khout").textContent = m === "k" ? toKata(v) : toHira(v);
    }
    root.querySelector("#khin").addEventListener("input", refresh);
    root.querySelector(".katahira-mode-row").addEventListener("change", refresh);
    root.querySelector("#khcp").addEventListener("click", function () {
      var t = root.querySelector("#khout").textContent;
      if (t === "") {
        if (typeof window.showCopyToast === "function") window.showCopyToast("コピーする内容がありません");
        return;
      }
      copyText(t);
    });
    refresh();
  };

  T.stopwatch = function (root) {
    root.innerHTML =
      '<div class="stopwatch-tool simple-tool-stack">' +
      '<p class="stopwatch-display simple-tool-live" id="swd">00:00:00.000</p>' +
      '<div class="simple-tool-actions stopwatch-actions-primary">' +
      '<button type="button" class="convert-submit-btn" id="sws" aria-pressed="false">開始</button></div>' +
      '<div class="simple-tool-actions stopwatch-actions-secondary">' +
      '<button type="button" class="convert-submit-btn" id="swlap" disabled>ラップ</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="swr">リセット</button></div>' +
      '<pre class="simple-tool-output stopwatch-laps" id="swl"></pre></div>';
    var t0 = 0;
    var acc = 0;
    var id = null;
    var running = false;
    var laps = [];
    var lapBtn = root.querySelector("#swlap");
    var lapsEl = root.querySelector("#swl");
    var swsBtn = root.querySelector("#sws");
    function fmt(ms) {
      if (ms < 0) ms = 0;
      var h = Math.floor(ms / 3600000);
      var m = Math.floor((ms % 3600000) / 60000);
      var s = Math.floor((ms % 60000) / 1000);
      var x = ms % 1000;
      function z(n, l) {
        return ("000" + n).slice(-l);
      }
      return z(h, 2) + ":" + z(m, 2) + ":" + z(s, 2) + "." + z(x, 3);
    }
    function elapsedMs() {
      return acc + (running ? Date.now() - t0 : 0);
    }
    function renderLaps() {
      if (!laps.length) {
        lapsEl.textContent = "";
        return;
      }
      var lines = [];
      var prev = 0;
      for (var i = 0; i < laps.length; i++) {
        var t = laps[i];
        var split = t - prev;
        prev = t;
        lines.push("#" + (i + 1) + "  " + fmt(t) + "  (+" + fmt(split) + ")");
      }
      lapsEl.textContent = lines.join("\n");
    }
    function tick() {
      var ms = elapsedMs();
      root.querySelector("#swd").textContent = fmt(ms);
      if (running) id = requestAnimationFrame(tick);
    }
    function toggleStartStop() {
      if (!running) {
        running = true;
        t0 = Date.now();
        lapBtn.disabled = false;
        swsBtn.textContent = "停止";
        swsBtn.setAttribute("aria-pressed", "true");
        tick();
      } else {
        running = false;
        acc += Date.now() - t0;
        if (id) cancelAnimationFrame(id);
        id = null;
        root.querySelector("#swd").textContent = fmt(acc);
        lapBtn.disabled = true;
        swsBtn.textContent = "開始";
        swsBtn.setAttribute("aria-pressed", "false");
      }
    }
    root.querySelector("#sws").addEventListener("click", toggleStartStop);
    function onStopwatchSpaceKey(e) {
      if (e.code !== "Space" && e.key !== " ") return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (e.repeat) return;
      var target = e.target;
      if (target && target.closest) {
        if (target.closest("input, textarea, select, [contenteditable=\"true\"]")) return;
        if (target.closest("a[href]")) return;
        var b = target.closest("button");
        if (b && b.id !== "sws") return;
      }
      e.preventDefault();
      toggleStartStop();
    }
    document.addEventListener("keydown", onStopwatchSpaceKey);
    root.querySelector("#swlap").addEventListener("click", function () {
      if (!running) return;
      laps.push(elapsedMs());
      renderLaps();
    });
    root.querySelector("#swr").addEventListener("click", function () {
      running = false;
      acc = 0;
      laps = [];
      if (id) cancelAnimationFrame(id);
      id = null;
      root.querySelector("#swd").textContent = fmt(0);
      lapBtn.disabled = true;
      swsBtn.textContent = "開始";
      swsBtn.setAttribute("aria-pressed", "false");
      renderLaps();
    });
  };

  T.pomodoro = function (root) {
    root.innerHTML =
      '<div class="stopwatch-tool simple-tool-stack">' +
      '<div class="stopwatch-display simple-tool-live countdown-timer-display countdown-timer-display--stopped" id="pomdWrap">' +
      '<div id="pomdEdit" class="countdown-timer-edit">' +
      '<input type="text" class="countdown-timer-digit-input countdown-timer-digit-input--mm" id="pomMm" maxlength="3" value="25" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="分"/>' +
      '<span class="countdown-timer-sep" aria-hidden="true">:</span>' +
      '<input type="text" class="countdown-timer-digit-input countdown-timer-digit-input--ss" id="pomSs" maxlength="2" value="00" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="秒"/>' +
      "</div>" +
      '<div id="pomdRun" class="countdown-timer-run countdown-timer-edit" hidden>' +
      '<span id="pomRmMm" class="countdown-timer-run-digits countdown-timer-run-digits--mm">25</span>' +
      '<span class="countdown-timer-sep" aria-hidden="true">:</span>' +
      '<span id="pomRmSs" class="countdown-timer-run-digits countdown-timer-run-digits--ss">00</span></div></div>' +
      '<div class="simple-tool-actions stopwatch-actions-primary">' +
      '<button type="button" class="convert-submit-btn" id="pws" aria-pressed="false" title="スペースキーでも開始・停止できます">開始</button></div>' +
      '<div class="simple-tool-actions countdown-timer-actions-reset">' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="pwr">リセット</button></div></div>';
    var POM_PRESET_KEY = "snap-tools:countdown-timer:preset-sec";
    var left = 25 * 60;
    var timer = null;
    var running = false;
    var mmEl = root.querySelector("#pomMm");
    var ssEl = root.querySelector("#pomSs");
    var editEl = root.querySelector("#pomdEdit");
    var runEl = root.querySelector("#pomdRun");
    var wrapEl = root.querySelector("#pomdWrap");
    var btnEl = root.querySelector("#pws");
    var mmRun = root.querySelector("#pomRmMm");
    var ssRun = root.querySelector("#pomRmSs");
    function loadPresetSec() {
      try {
        var raw = localStorage.getItem(POM_PRESET_KEY);
        if (raw == null) return null;
        var sec = parseInt(raw, 10);
        if (isNaN(sec) || sec < 1 || sec > 120 * 60) return null;
        return sec;
      } catch (e) {
        return null;
      }
    }
    function persistPresetSec(sec) {
      try {
        if (sec >= 1 && sec <= 120 * 60) {
          localStorage.setItem(POM_PRESET_KEY, String(sec));
        }
      } catch (e) {}
    }
    function pad2(n) {
      return ("0" + n).slice(-2);
    }
    function padMm(m) {
      if (m >= 100) return String(m);
      return pad2(m);
    }
    function readSecondsFromInputs() {
      var mm = parseInt(String(mmEl.value).replace(/\D/g, ""), 10);
      var ss = parseInt(String(ssEl.value).replace(/\D/g, ""), 10);
      if (isNaN(mm) || mm < 0) mm = 0;
      if (isNaN(ss) || ss < 0) ss = 0;
      if (mm > 120) mm = 120;
      if (ss > 59) ss = 59;
      mmEl.value = padMm(mm);
      ssEl.value = pad2(ss);
      return mm * 60 + ss;
    }
    function syncInputsFromLeft() {
      var m = Math.floor(left / 60);
      var s = left % 60;
      mmEl.value = padMm(m);
      ssEl.value = pad2(s);
    }
    function formatInputsOnBlur() {
      var sec = readSecondsFromInputs();
      if (!running && sec >= 1) persistPresetSec(sec);
    }
    function setMode(isRunning) {
      running = isRunning;
      if (isRunning) {
        editEl.hidden = true;
        runEl.hidden = false;
        wrapEl.classList.remove("countdown-timer-display--stopped");
        wrapEl.classList.add("countdown-timer-display--running");
        btnEl.textContent = "停止";
        btnEl.setAttribute("aria-pressed", "true");
      } else {
        editEl.hidden = false;
        runEl.hidden = true;
        wrapEl.classList.remove("countdown-timer-display--running");
        wrapEl.classList.add("countdown-timer-display--stopped");
        btnEl.textContent = "開始";
        btnEl.setAttribute("aria-pressed", "false");
      }
    }
    function showRunText() {
      var m = Math.floor(left / 60);
      var s = left % 60;
      mmRun.textContent = padMm(m);
      ssRun.textContent = pad2(s);
    }
    function stopInterval() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function toggle() {
      if (running) {
        stopInterval();
        setMode(false);
        syncInputsFromLeft();
        return;
      }
      left = readSecondsFromInputs();
      if (left <= 0) {
        if (typeof window.showCopyToast === "function") {
          window.showCopyToast("1 秒以上に設定してください");
        }
        return;
      }
      persistPresetSec(left);
      setMode(true);
      showRunText();
      stopInterval();
      timer = setInterval(function () {
        left--;
        if (left <= 0) {
          stopInterval();
          left = 0;
          showRunText();
          setMode(false);
          syncInputsFromLeft();
          if (typeof window.showCopyToast === "function") {
            window.showCopyToast("時間になりました");
          }
          return;
        }
        showRunText();
      }, 1000);
    }
    mmEl.addEventListener("blur", formatInputsOnBlur);
    ssEl.addEventListener("blur", formatInputsOnBlur);
    btnEl.addEventListener("click", toggle);
    root.querySelector("#pwr").addEventListener("click", function () {
      stopInterval();
      setMode(false);
      var sec = loadPresetSec();
      if (sec == null || sec < 1) sec = 25 * 60;
      left = sec;
      syncInputsFromLeft();
      showRunText();
    });
    (function initPreset() {
      var sec = loadPresetSec();
      if (sec != null && sec >= 1) {
        left = sec;
        syncInputsFromLeft();
        showRunText();
      }
    })();
    function onPomodoroSpaceKey(e) {
      if (e.code !== "Space" && e.key !== " ") return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (e.repeat) return;
      var target = e.target;
      if (target && target.closest) {
        if (target.closest("input, textarea, select, [contenteditable=\"true\"]")) return;
        if (target.closest("a[href]")) return;
        var b = target.closest("button");
        if (b && b.id !== "pws") return;
      }
      e.preventDefault();
      toggle();
    }
    document.addEventListener("keydown", onPomodoroSpaceKey);
  };

  T.countdown = function (root) {
    var CD_STORAGE_KEY = "snap-tools:countdown:datetime-local";
    root.innerHTML =
      '<div class="stopwatch-tool simple-tool-stack">' +
      '<div class="stopwatch-display simple-tool-live countdown-date-remaining" id="cdRemaining" aria-live="polite">' +
      '<table class="countdown-date-remaining__table" role="presentation">' +
      "<tbody>" +
      "<tr>" +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--day" id="cdTdD" hidden><span id="cdVd">0</span></td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--sep" id="cdTdDSep" hidden aria-hidden="true">:</td>' +
      '<td class="countdown-date-remaining__td"><span id="cdVh">--</span></td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--sep" aria-hidden="true">:</td>' +
      '<td class="countdown-date-remaining__td"><span id="cdVm">--</span></td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--sep" aria-hidden="true">:</td>' +
      '<td class="countdown-date-remaining__td"><span id="cdVs">--</span></td>' +
      "</tr>" +
      "<tr>" +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--unit countdown-date-remaining__td--day" id="cdTdDU" hidden>日</td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--sep" id="cdTdDSepU" hidden aria-hidden="true"></td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--unit">時</td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--sep"></td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--unit">分</td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--sep"></td>' +
      '<td class="countdown-date-remaining__td countdown-date-remaining__td--unit">秒</td>' +
      "</tr>" +
      "</tbody></table></div>" +
      '<label class="simple-tool-field"><span class="simple-tool-label">目標日時（ローカル）</span>' +
      '<input type="datetime-local" class="simple-tool-input" id="cdt"/></label></div>';
    var timer = null;
    var inputEl = root.querySelector("#cdt");
    var elD = root.querySelector("#cdVd");
    var elH = root.querySelector("#cdVh");
    var elM = root.querySelector("#cdVm");
    var elS = root.querySelector("#cdVs");
    var tdD = root.querySelector("#cdTdD");
    var tdDSep = root.querySelector("#cdTdDSep");
    var tdDU = root.querySelector("#cdTdDU");
    var tdDSepU = root.querySelector("#cdTdDSepU");
    function z(n, l) {
      return ("000" + n).slice(-l);
    }
    function setDayVisible(show) {
      tdD.hidden = !show;
      tdDSep.hidden = !show;
      tdDU.hidden = !show;
      tdDSepU.hidden = !show;
    }
    function setPlaceholder() {
      setDayVisible(false);
      elH.textContent = "--";
      elM.textContent = "--";
      elS.textContent = "--";
    }
    function applyDisplay(totalSec) {
      if (totalSec < 0) totalSec = 0;
      var day = Math.floor(totalSec / 86400);
      var rest = totalSec % 86400;
      var h = Math.floor(rest / 3600);
      var m = Math.floor((rest % 3600) / 60);
      var s = rest % 60;
      setDayVisible(day > 0);
      if (day > 0) elD.textContent = String(day);
      elH.textContent = z(h, 2);
      elM.textContent = z(m, 2);
      elS.textContent = z(s, 2);
    }
    function applyFromState() {
      var raw = inputEl.value;
      if (!raw) {
        setPlaceholder();
        return false;
      }
      var target = new Date(raw).getTime();
      if (isNaN(target)) {
        setPlaceholder();
        return false;
      }
      var secLeft = Math.floor((target - Date.now()) / 1000);
      if (secLeft <= 0) {
        applyDisplay(0);
        return false;
      }
      applyDisplay(secLeft);
      return true;
    }
    function stopTick() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function schedule() {
      stopTick();
      if (!applyFromState()) return;
      timer = setInterval(function () {
        if (!applyFromState()) stopTick();
      }, 1000);
    }
    function loadSavedTarget() {
      try {
        var raw = localStorage.getItem(CD_STORAGE_KEY);
        if (raw == null || raw === "") return;
        inputEl.value = raw;
      } catch (e) {}
    }
    function persistTarget(val) {
      try {
        if (val) localStorage.setItem(CD_STORAGE_KEY, val);
        else localStorage.removeItem(CD_STORAGE_KEY);
      } catch (e) {}
    }
    loadSavedTarget();
    inputEl.addEventListener("input", function () {
      persistTarget(inputEl.value);
      schedule();
    });
    inputEl.addEventListener("change", function () {
      persistTarget(inputEl.value);
      schedule();
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) schedule();
    });
    schedule();
  };

  T.csvView = function (root) {
    root.innerHTML =
      '<p class="convert-hint">カンマ区切りを簡易テーブル表示します（引用符の複雑な CSV は未対応）。</p>' +
      '<textarea class="simple-tool-textarea" id="csvin" placeholder="a,b,c"></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="csvgo">表示</button></div>' +
      '<div class="simple-tool-output" id="csvwrap" style="overflow:auto;padding:0;border:none;background:transparent"></div>';
    root.querySelector("#csvgo").addEventListener("click", function () {
      var lines = root.querySelector("#csvin").value.split(/\r?\n/).filter(function (l) {
        return l.length > 0;
      });
      var table = document.createElement("table");
      table.style.cssText = "width:100%;border-collapse:collapse;font-size:0.85rem";
      lines.forEach(function (line) {
        var tr = document.createElement("tr");
        line.split(",").forEach(function (cell) {
          var td = document.createElement("td");
          td.textContent = cell.trim();
          td.style.cssText = "border:1px solid var(--tp-border);padding:6px 8px";
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      var w = root.querySelector("#csvwrap");
      w.innerHTML = "";
      w.appendChild(table);
    });
  };

  T.jwtDecode = function (root) {
    root.innerHTML =
      '<p class="convert-hint">JWT のヘッダーとペイロードを Base64URL デコードして表示します（署名は検証しません）。</p>' +
      '<textarea class="simple-tool-textarea" id="jwtin" placeholder="eyJ..."></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="jwtgo">デコード</button></div>' +
      '<pre class="simple-tool-output" id="jwtout"></pre>';
    function b64url(s) {
      s = s.replace(/-/g, "+").replace(/_/g, "/");
      while (s.length % 4) s += "=";
      return decodeURIComponent(escape(atob(s)));
    }
    root.querySelector("#jwtgo").addEventListener("click", function () {
      var p = root.querySelector("#jwtin").value.trim().split(".");
      if (p.length < 2) {
        root.querySelector("#jwtout").textContent = "JWT 形式を確認してください";
        return;
      }
      try {
        var head = JSON.stringify(JSON.parse(b64url(p[0])), null, 2);
        var body = JSON.stringify(JSON.parse(b64url(p[1])), null, 2);
        root.querySelector("#jwtout").textContent = "【Header】\n" + head + "\n\n【Payload】\n" + body;
      } catch (e) {
        root.querySelector("#jwtout").textContent = "デコード失敗: " + e.message;
      }
    });
  };

  T.uaParse = function (root) {
    root.innerHTML =
      '<p class="convert-hint">ブラウザの User-Agent 文字列を表示します。下欄に別の UA を貼り付けても解析できます。</p>' +
      '<textarea class="simple-tool-textarea" id="uain" style="min-height:4rem"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="uago">現在の UA を入れる</button></div>' +
      '<pre class="simple-tool-output" id="uaout"></pre>';
    root.querySelector("#uago").addEventListener("click", function () {
      root.querySelector("#uain").value = navigator.userAgent;
    });
    root.querySelector("#uain").addEventListener("input", function () {
      root.querySelector("#uaout").textContent = root.querySelector("#uain").value;
    });
    root.querySelector("#uago").click();
  };

  T.dpiCalc = function (root) {
    root.innerHTML =
      '<p class="convert-hint">ピクセル数とインチ長から DPI を計算します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">横ピクセル</span>' +
      '<input type="number" class="simple-tool-input" id="dpx" min="1"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">縦ピクセル</span>' +
      '<input type="number" class="simple-tool-input" id="dpy" min="1"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">対角インチ</span>' +
      '<input type="number" class="simple-tool-input" id="din" min="0.1" step="0.1" placeholder="13.3"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="dpgo">計算</button></div>' +
      '<pre class="simple-tool-output" id="dpout"></pre>';
    root.querySelector("#dpgo").addEventListener("click", function () {
      var w = parseFloat(root.querySelector("#dpx").value, 10);
      var h = parseFloat(root.querySelector("#dpy").value, 10);
      var inch = parseFloat(root.querySelector("#din").value, 10);
      if (!w || !h || !inch) {
        root.querySelector("#dpout").textContent = "値を入力してください";
        return;
      }
      var diagPx = Math.sqrt(w * w + h * h);
      var dpi = diagPx / inch;
      root.querySelector("#dpout").textContent =
        "対角ピクセル: " +
        diagPx.toFixed(0) +
        "\nおおよその DPI: " +
        dpi.toFixed(1);
    });
  };

  T.aspectRatio = function (root) {
    root.innerHTML =
      '<p class="convert-hint">幅・高さの比率を最大公約数で簡約します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">幅</span>' +
      '<input type="number" class="simple-tool-input" id="arw" min="1"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">高さ</span>' +
      '<input type="number" class="simple-tool-input" id="arh" min="1"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="argo">簡約</button></div>' +
      '<pre class="simple-tool-output" id="arout"></pre>';
    function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    }
    root.querySelector("#argo").addEventListener("click", function () {
      var w = parseInt(root.querySelector("#arw").value, 10);
      var h = parseInt(root.querySelector("#arh").value, 10);
      if (!w || !h) return;
      var g = gcd(w, h);
      root.querySelector("#arout").textContent = w / g + " : " + h / g;
    });
  };

  T.randomPick = function (root) {
    function parseCSVLine(line) {
      var result = [];
      var cur = "";
      var inQuotes = false;
      for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (inQuotes) {
          if (c === '"') {
            if (line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            cur += c;
          }
        } else {
          if (c === '"') {
            inQuotes = true;
          } else if (c === ",") {
            result.push(cur.trim());
            cur = "";
          } else {
            cur += c;
          }
        }
      }
      result.push(cur.trim());
      return result;
    }
    function flattenCsvText(s) {
      var parts = [];
      var lines = s.split(/\r?\n/);
      for (var li = 0; li < lines.length; li++) {
        var line = lines[li];
        if (!line.trim()) continue;
        var cells = parseCSVLine(line);
        for (var ci = 0; ci < cells.length; ci++) {
          if (cells[ci]) parts.push(cells[ci]);
        }
      }
      return parts;
    }
    var defaultList = "大吉,中吉,小吉,吉,凶,大凶";
    var pickHistory = [];
    var MAX_PICK_HISTORY = 50;
    var uploadIconSvg =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="17 8 12 3 7 8"/>' +
      '<line x1="12" y1="3" x2="12" y2="15"/>' +
      "</svg>";
    root.innerHTML =
      '<pre class="simple-tool-output random-pick-output" id="rpout">結果はここに表示されます</pre>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="rpgo">抽選</button></div>' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.5rem">' +
      '<p class="convert-hint" style="flex:1;margin:0">カンマ区切りの候補から 1 つをランダムに選びます。CSV からも読み込めます。</p>' +
      '<label id="rpCsvBtn" class="simple-tool-icon-btn" title="CSV を読み込む" aria-label="CSV を読み込む">' +
      '<input type="file" id="rpcsv" accept=".csv,text/csv,text/plain" style="display:none" />' +
      uploadIconSvg +
      "</label></div>" +
      '<textarea class="simple-tool-textarea" id="rpin" placeholder="例: 大吉,中吉,小吉">' +
      defaultList +
      "</textarea>" +
      '<div class="dice-roll-history">' +
      '<div class="dice-roll-history-head">' +
      '<span class="simple-tool-label">履歴</span>' +
      '<button type="button" class="simple-tool-icon-btn" id="rpHistReset" aria-label="履歴をリセット" title="履歴をリセット">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      "<path d=\"M3 6h18\"/><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"/><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"/><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"/></svg>" +
      "</button></div>" +
      '<p class="dice-roll-history-empty" id="rpHistEmpty">まだありません</p>' +
      '<ul class="dice-roll-history-list" id="rpHistList" hidden></ul></div>';
    var ta = root.querySelector("#rpin");
    var out = root.querySelector("#rpout");
    function renderPickHistory() {
      var listEl = root.querySelector("#rpHistList");
      var emptyEl = root.querySelector("#rpHistEmpty");
      if (!listEl || !emptyEl) return;
      if (!pickHistory.length) {
        listEl.innerHTML = "";
        listEl.hidden = true;
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = "";
      pickHistory.forEach(function (entry) {
        var li = document.createElement("li");
        li.className = "dice-roll-history-item";
        li.textContent = entry.text;
        listEl.appendChild(li);
      });
    }
    function pushPickHistory(text) {
      pickHistory.unshift({ text: text });
      if (pickHistory.length > MAX_PICK_HISTORY) {
        pickHistory.length = MAX_PICK_HISTORY;
      }
      renderPickHistory();
    }
    var SPIN_MS = 600;
    var SPIN_TICK_MS = 48;
    var spinIntervalId = null;
    var spinTimeoutId = null;
    var isPicking = false;
    function stopPickSpin() {
      if (spinIntervalId !== null) {
        clearInterval(spinIntervalId);
        spinIntervalId = null;
      }
      if (spinTimeoutId !== null) {
        clearTimeout(spinTimeoutId);
        spinTimeoutId = null;
      }
    }
    function setPickingUi(picking) {
      isPicking = picking;
      root.querySelector("#rpgo").disabled = picking;
      root.querySelector("#rpHistReset").disabled = picking;
      ta.disabled = picking;
      var csvLab = root.querySelector("#rpCsvBtn");
      if (csvLab) {
        csvLab.classList.toggle("simple-tool-icon-btn--disabled", picking);
      }
      out.classList.toggle("random-pick-output--spinning", picking);
    }
    function pickRandomTick(lines) {
      var j = Math.floor(Math.random() * lines.length);
      out.textContent = lines[j];
    }
    function runPick() {
      if (isPicking) return;
      var lines = flattenCsvText(ta.value);
      if (!lines.length) {
        out.textContent = "候補を入力してください";
        return;
      }
      var finalIdx = Math.floor(Math.random() * lines.length);
      var picked = lines[finalIdx];
      stopPickSpin();
      setPickingUi(true);
      spinIntervalId = setInterval(function () {
        pickRandomTick(lines);
      }, SPIN_TICK_MS);
      spinTimeoutId = setTimeout(function () {
        stopPickSpin();
        out.textContent = picked;
        pushPickHistory(picked);
        setPickingUi(false);
      }, SPIN_MS);
    }
    root.querySelector("#rpgo").addEventListener("click", runPick);
    root.querySelector("#rpHistReset").addEventListener("click", function () {
      if (isPicking) return;
      pickHistory = [];
      renderPickHistory();
    });
    root.querySelector("#rpcsv").addEventListener("change", function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var text = String(reader.result || "");
        ta.value = flattenCsvText(text).join(",");
        ev.target.value = "";
      };
      reader.onerror = function () {
        out.textContent = "ファイルの読み込みに失敗しました";
        ev.target.value = "";
      };
      reader.readAsText(f);
    });

    var useSpaceToPick =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    function randomPickSpaceFocusOk(el) {
      if (!el) return false;
      if (el === document.body || el === document.documentElement) return true;
      return root.contains(el);
    }
    function randomPickSpaceInputOk(el) {
      if (!el || el.isContentEditable) return false;
      var tag = el.tagName;
      if (tag === "TEXTAREA" || tag === "SELECT") return false;
      if (tag === "INPUT") {
        var t = el.type;
        return t === "range";
      }
      return true;
    }
    function onRandomPickKeydown(e) {
      if (e.code !== "Space" && e.key !== " ") return;
      if (!useSpaceToPick) return;
      if (!randomPickSpaceFocusOk(e.target)) return;
      if (!randomPickSpaceInputOk(e.target)) return;
      if (isPicking) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      runPick();
    }
    if (useSpaceToPick) {
      window.addEventListener("keydown", onRandomPickKeydown, { passive: false });
    }
  };

  T.bingo = function (root) {
    function parseCSVLine(line) {
      var result = [];
      var cur = "";
      var inQuotes = false;
      for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (inQuotes) {
          if (c === '"') {
            if (line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            cur += c;
          }
        } else {
          if (c === '"') {
            inQuotes = true;
          } else if (c === ",") {
            result.push(cur.trim());
            cur = "";
          } else {
            cur += c;
          }
        }
      }
      result.push(cur.trim());
      return result;
    }
    function flattenCsvText(s) {
      var parts = [];
      var lines = s.split(/\r?\n/);
      for (var li = 0; li < lines.length; li++) {
        var line = lines[li];
        if (!line.trim()) continue;
        var cells = parseCSVLine(line);
        for (var ci = 0; ci < cells.length; ci++) {
          if (cells[ci]) parts.push(cells[ci]);
        }
      }
      return parts;
    }
    var RANGE_MAX = 5000;
    var defaultList = (function () {
      var a = [];
      for (var di = 1; di <= 99; di++) {
        a.push(String(di));
      }
      return a.join(",");
    })();
    var remainingPool = [];
    var pickHistory = [];
    var MAX_PICK_HISTORY = 50;
    var uploadIconSvg =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="17 8 12 3 7 8"/>' +
      '<line x1="12" y1="3" x2="12" y2="15"/>' +
      "</svg>";
    root.innerHTML =
      '<pre class="simple-tool-output random-pick-output" id="bgout">結果はここに表示されます</pre>' +
      '<p class="bingo-stats" id="bgStats" aria-live="polite"></p>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="bggo">抽選</button></div>' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.5rem">' +
      '<p class="convert-hint" style="flex:1;margin:0">カンマ区切りの候補から、出たものと重複しないように 1 つずつ選びます。CSV からも読み込めます。</p>' +
      '<label id="bgCsvBtn" class="simple-tool-icon-btn" title="CSV を読み込む" aria-label="CSV を読み込む">' +
      '<input type="file" id="bgcsv" accept=".csv,text/csv,text/plain" style="display:none" />' +
      uploadIconSvg +
      "</label></div>" +
      '<textarea class="simple-tool-textarea" id="bgin" placeholder="例: 1,2,3...">' +
      defaultList +
      "</textarea>" +
      '<fieldset class="convert-pass-fieldset bingo-range-fieldset" id="bgRangeOpt">' +
      '<legend class="convert-pass-fieldset-legend">オプション</legend>' +
      '<p class="convert-pass-field-hint bingo-range-hint">範囲の整数をまとめて候補に流し込みます。</p>' +
      '<div class="convert-pass-conditions-row bingo-range-line">' +
      '<input type="number" class="simple-tool-input bingo-range-num" id="bgfrom" inputmode="numeric" placeholder="開始" />' +
      '<span class="bingo-range-sep">〜</span>' +
      '<input type="number" class="simple-tool-input bingo-range-num" id="bgto" inputmode="numeric" placeholder="終了" />' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary bingo-range-load" id="bgload">読み込み</button>' +
      "</div></fieldset>" +
      '<div class="dice-roll-history">' +
      '<div class="dice-roll-history-head">' +
      '<span class="simple-tool-label">履歴</span>' +
      '<button type="button" class="simple-tool-icon-btn" id="bgHistReset" aria-label="履歴をリセット" title="履歴をリセット">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      "<path d=\"M3 6h18\"/><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"/><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"/><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"/></svg>" +
      "</button></div>" +
      '<p class="dice-roll-history-empty" id="bgHistEmpty">まだありません</p>' +
      '<ul class="dice-roll-history-list" id="bgHistList" hidden></ul></div>';
    var ta = root.querySelector("#bgin");
    var out = root.querySelector("#bgout");
    var fromIn = root.querySelector("#bgfrom");
    var toIn = root.querySelector("#bgto");
    var loadBtn = root.querySelector("#bgload");
    var csvLab = root.querySelector("#bgCsvBtn");
    function renderStats() {
      var st = root.querySelector("#bgStats");
      if (!st) return;
      var picked = pickHistory.length;
      var rem = remainingPool.length;
      var total = picked + rem;
      st.textContent =
        "抽選済み " +
        picked +
        " 件 · 残り " +
        rem +
        " 件" +
        (total > 0 ? "（全 " + total + " 件）" : "");
    }
    function refillPoolFromTextarea() {
      remainingPool = flattenCsvText(ta.value).slice();
      renderStats();
    }
    function renderPickHistory() {
      var listEl = root.querySelector("#bgHistList");
      var emptyEl = root.querySelector("#bgHistEmpty");
      if (!listEl || !emptyEl) return;
      if (!pickHistory.length) {
        listEl.innerHTML = "";
        listEl.hidden = true;
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = "";
      pickHistory.forEach(function (entry) {
        var li = document.createElement("li");
        li.className = "dice-roll-history-item";
        li.textContent = entry.text;
        listEl.appendChild(li);
      });
    }
    function pushPickHistory(text) {
      pickHistory.unshift({ text: text });
      if (pickHistory.length > MAX_PICK_HISTORY) {
        pickHistory.length = MAX_PICK_HISTORY;
      }
      renderPickHistory();
      syncCandidateControls();
      renderStats();
    }
    var SPIN_MS = 600;
    var SPIN_TICK_MS = 48;
    var spinIntervalId = null;
    var spinTimeoutId = null;
    var isPicking = false;
    function stopPickSpin() {
      if (spinIntervalId !== null) {
        clearInterval(spinIntervalId);
        spinIntervalId = null;
      }
      if (spinTimeoutId !== null) {
        clearTimeout(spinTimeoutId);
        spinTimeoutId = null;
      }
    }
    function syncCandidateControls() {
      var locked = pickHistory.length > 0;
      ta.disabled = locked || isPicking;
      fromIn.disabled = locked || isPicking;
      toIn.disabled = locked || isPicking;
      loadBtn.disabled = locked || isPicking;
      var rangeFs = root.querySelector("#bgRangeOpt");
      if (rangeFs) {
        rangeFs.hidden = locked;
      }
      if (csvLab) {
        csvLab.classList.toggle("simple-tool-icon-btn--disabled", locked || isPicking);
      }
    }
    function setPickingUi(picking) {
      isPicking = picking;
      root.querySelector("#bggo").disabled = picking;
      root.querySelector("#bgHistReset").disabled = picking;
      syncCandidateControls();
      out.classList.toggle("random-pick-output--spinning", picking);
    }
    function pickRandomTick(pool) {
      if (!pool.length) return;
      var j = Math.floor(Math.random() * pool.length);
      out.textContent = pool[j];
    }
    function runPick() {
      if (isPicking) return;
      if (pickHistory.length === 0) {
        refillPoolFromTextarea();
      }
      if (!remainingPool.length) {
        out.textContent = "候補がありません";
        return;
      }
      var idx = Math.floor(Math.random() * remainingPool.length);
      var picked = remainingPool[idx];
      stopPickSpin();
      setPickingUi(true);
      spinIntervalId = setInterval(function () {
        pickRandomTick(remainingPool);
      }, SPIN_TICK_MS);
      spinTimeoutId = setTimeout(function () {
        stopPickSpin();
        remainingPool.splice(idx, 1);
        out.textContent = picked;
        pushPickHistory(picked);
        setPickingUi(false);
      }, SPIN_MS);
    }
    root.querySelector("#bggo").addEventListener("click", runPick);
    root.querySelector("#bgHistReset").addEventListener("click", function () {
      if (isPicking) return;
      pickHistory = [];
      renderPickHistory();
      refillPoolFromTextarea();
      syncCandidateControls();
    });
    root.querySelector("#bgload").addEventListener("click", function () {
      if (pickHistory.length > 0) return;
      var a = parseInt(String(fromIn.value).trim(), 10);
      var b = parseInt(String(toIn.value).trim(), 10);
      if (isNaN(a) || isNaN(b)) {
        out.textContent = "範囲は整数で入力してください";
        return;
      }
      var lo = Math.min(a, b);
      var hi = Math.max(a, b);
      if (hi - lo + 1 > RANGE_MAX) {
        out.textContent = "一度に読み込めるのは " + RANGE_MAX + " 件までです";
        return;
      }
      var parts = [];
      for (var n = lo; n <= hi; n++) {
        parts.push(String(n));
      }
      ta.value = parts.join(",");
      refillPoolFromTextarea();
    });
    ta.addEventListener("input", function () {
      if (pickHistory.length > 0) return;
      refillPoolFromTextarea();
    });
    root.querySelector("#bgcsv").addEventListener("change", function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var text = String(reader.result || "");
        ta.value = flattenCsvText(text).join(",");
        refillPoolFromTextarea();
        ev.target.value = "";
      };
      reader.onerror = function () {
        out.textContent = "ファイルの読み込みに失敗しました";
        ev.target.value = "";
      };
      reader.readAsText(f);
    });
    refillPoolFromTextarea();
    syncCandidateControls();

    var useSpaceToPick =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    function bingoSpaceFocusOk(el) {
      if (!el) return false;
      if (el === document.body || el === document.documentElement) return true;
      return root.contains(el);
    }
    function bingoSpaceInputOk(el) {
      if (!el || el.isContentEditable) return false;
      var tag = el.tagName;
      if (tag === "TEXTAREA" || tag === "SELECT") return false;
      if (tag === "INPUT") {
        var t = el.type;
        return t === "range";
      }
      return true;
    }
    function onBingoKeydown(e) {
      if (e.code !== "Space" && e.key !== " ") return;
      if (!useSpaceToPick) return;
      if (!bingoSpaceFocusOk(e.target)) return;
      if (!bingoSpaceInputOk(e.target)) return;
      if (isPicking) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      runPick();
    }
    if (useSpaceToPick) {
      window.addEventListener("keydown", onBingoKeydown, { passive: false });
    }
  };

  T.diceRoll = function (root) {
    var SIDES = 6;
    var SPIN_MS = 600;
    var pipMasks = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    function clampCount(v) {
      var n = parseInt(String(v), 10);
      if (isNaN(n)) return 3;
      return Math.min(50, Math.max(1, n));
    }
    function faceHtml(v, faceClassExtra) {
      var m = pipMasks[v] || [];
      var parts = [];
      for (var i = 0; i < 9; i++) {
        var pip =
          m.indexOf(i) >= 0
            ? '<span class="dice-pip' +
              (v === 1 ? " dice-pip--one" : "") +
              '"></span>'
            : "";
        parts.push('<div class="dice-cell">' + pip + "</div>");
      }
      var cls = "dice-face" + (faceClassExtra ? " " + faceClassExtra : "");
      return (
        '<div class="' +
        cls +
        '" role="img" aria-label="出目 ' +
        v +
        '">' +
        parts.join("") +
        "</div>"
      );
    }
    function render(rolls, hideSum) {
      var html = rolls.map(faceHtml).join("");
      var sumLine;
      if (hideSum) {
        sumLine = '<p class="dice-roll-sum dice-roll-sum--pending">合計: —</p>';
      } else {
        var sum = rolls.reduce(function (a, b) {
          return a + b;
        }, 0);
        sumLine = '<p class="dice-roll-sum">合計: ' + sum + "</p>";
      }
      root.querySelector("#dout").innerHTML =
        '<div class="dice-roll-dice">' +
        html +
        "</div>" +
        sumLine;
    }
    function randomRolls(n) {
      var rolls = [];
      for (var i = 0; i < n; i++) {
        rolls.push(Math.floor(Math.random() * SIDES) + 1);
      }
      return rolls;
    }
    var spinIntervalId = null;
    var spinTimeoutId = null;
    var isRolling = false;
    var rollHistory = [];
    var MAX_ROLL_HISTORY = 50;
    function stopSpin() {
      if (spinIntervalId !== null) {
        clearInterval(spinIntervalId);
        spinIntervalId = null;
      }
      if (spinTimeoutId !== null) {
        clearTimeout(spinTimeoutId);
        spinTimeoutId = null;
      }
    }
    function setRollingUi(rolling) {
      isRolling = rolling;
      var btn = root.querySelector("#dgo");
      var rng = root.querySelector("#dn");
      var num = root.querySelector("#dnn");
      var rst = root.querySelector("#diceHistReset");
      btn.disabled = rolling;
      rng.disabled = rolling;
      num.disabled = rolling;
      if (rst) rst.disabled = rolling;
      root.querySelector("#dout").classList.toggle("dice-roll-board--spinning", rolling);
    }
    function renderHistory() {
      var listEl = root.querySelector("#diceHistList");
      var emptyEl = root.querySelector("#diceHistEmpty");
      if (!listEl || !emptyEl) return;
      if (!rollHistory.length) {
        listEl.innerHTML = "";
        listEl.hidden = true;
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = rollHistory
        .map(function (entry) {
          var s = entry.rolls.reduce(function (a, b) {
            return a + b;
          }, 0);
          var dice = entry.rolls
            .map(function (r) {
              return faceHtml(r, "dice-face--sm");
            })
            .join("");
          return (
            "<li class=\"dice-roll-history-item\">" +
            '<div class="dice-roll-history-row">' +
            '<div class="dice-roll-history-dice">' +
            dice +
            "</div>" +
            '<span class="dice-roll-history-sum">（' +
            s +
            "）</span>" +
            "</div></li>"
          );
        })
        .join("");
    }
    function pushHistory(rolls) {
      rollHistory.unshift({ rolls: rolls.slice() });
      if (rollHistory.length > MAX_ROLL_HISTORY) {
        rollHistory.length = MAX_ROLL_HISTORY;
      }
      renderHistory();
    }
    function syncCountFromSlider() {
      var v = clampCount(root.querySelector("#dn").value);
      root.querySelector("#dn").value = v;
      root.querySelector("#dnn").value = v;
    }
    function syncCountFromInput() {
      var dnn = root.querySelector("#dnn");
      var raw = dnn.value.trim();
      var v =
        raw === "" || raw === "-"
          ? clampCount(root.querySelector("#dn").value)
          : clampCount(raw);
      root.querySelector("#dn").value = v;
      dnn.value = v;
      return v;
    }
    function roll(animated) {
      var n = syncCountFromInput();
      var finalRolls = randomRolls(n);
      if (!animated) {
        stopSpin();
        render(finalRolls, false);
        return;
      }
      stopSpin();
      setRollingUi(true);
      spinIntervalId = setInterval(function () {
        render(randomRolls(n), true);
      }, 48);
      spinTimeoutId = setTimeout(function () {
        stopSpin();
        render(finalRolls, false);
        pushHistory(finalRolls);
        setRollingUi(false);
      }, SPIN_MS);
    }
    root.innerHTML =
      '<div class="dice-roll-board" id="dout"></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="dgo">振る</button></div>' +
      '<div class="dice-roll-options">' +
      '<label class="simple-tool-field dice-roll-count">' +
      '<span class="simple-tool-label">個数</span>' +
      '<div class="dice-roll-count-row">' +
      '<input type="range" class="dice-roll-range" id="dn" min="1" max="50" value="3"/>' +
      '<input type="number" class="simple-tool-input dice-roll-count-input" id="dnn" min="1" max="50" value="3" inputmode="numeric"/>' +
      "</div></label></div>" +
      '<div class="dice-roll-history">' +
      '<div class="dice-roll-history-head">' +
      '<span class="simple-tool-label">履歴</span>' +
      '<button type="button" class="simple-tool-icon-btn" id="diceHistReset" aria-label="履歴をリセット" title="履歴をリセット">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      "<path d=\"M3 6h18\"/><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"/><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"/><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"/></svg>" +
      "</button>" +
      "</div>" +
      '<p class="dice-roll-history-empty" id="diceHistEmpty">まだありません</p>' +
      '<ul class="dice-roll-history-list" id="diceHistList" hidden></ul>' +
      "</div>";
    root.querySelector("#dn").addEventListener("input", syncCountFromSlider);
    root.querySelector("#dnn").addEventListener("input", function () {
      var raw = root.querySelector("#dnn").value;
      if (raw === "" || raw === "-") return;
      syncCountFromInput();
    });
    root.querySelector("#dnn").addEventListener("blur", syncCountFromInput);
    root.querySelector("#dgo").addEventListener("click", function () {
      roll(true);
    });
    root.querySelector("#diceHistReset").addEventListener("click", function () {
      if (isRolling) return;
      rollHistory.length = 0;
      renderHistory();
    });
    roll(false);
    renderHistory();

    var useSpaceToRoll =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    function diceRollSpaceFocusOk(el) {
      if (!el) return false;
      if (el === document.body || el === document.documentElement) return true;
      return root.contains(el);
    }
    function diceRollSpaceInputOk(el) {
      if (!el || el.isContentEditable) return false;
      var tag = el.tagName;
      if (tag === "TEXTAREA" || tag === "SELECT") return false;
      if (tag === "INPUT") {
        var t = el.type;
        return t === "range";
      }
      return true;
    }
    function onDiceRollKeydown(e) {
      if (e.code !== "Space" && e.key !== " ") return;
      if (!useSpaceToRoll) return;
      if (!diceRollSpaceFocusOk(e.target)) return;
      if (!diceRollSpaceInputOk(e.target)) return;
      if (isRolling) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      roll(true);
    }
    if (useSpaceToRoll) {
      window.addEventListener("keydown", onDiceRollKeydown, { passive: false });
    }
  };

  T.nanoid = function (root) {
    root.innerHTML =
      '<p class="convert-hint">URL セーフな短い ID を乱数で生成します（nanoid 風・簡易）。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">文字数</span>' +
      '<input type="number" class="simple-tool-input" id="nn" min="4" max="64" value="21"/></label>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="ngo">生成</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="ncp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="nout"></pre>';
    var alphabet = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    root.querySelector("#ngo").addEventListener("click", function () {
      var len = Math.min(64, Math.max(4, parseInt(root.querySelector("#nn").value, 10) || 21));
      var bytes = new Uint8Array(len);
      crypto.getRandomValues(bytes);
      var s = "";
      for (var i = 0; i < len; i++) {
        s += alphabet[bytes[i] % alphabet.length];
      }
      root.querySelector("#nout").textContent = s;
    });
    root.querySelector("#ncp").addEventListener("click", function () {
      copyText(root.querySelector("#nout").textContent);
    });
  };

  T.subnet = function (root) {
    root.innerHTML =
      '<p class="convert-hint">IPv4 アドレスと CIDR からネットワークアドレス等を計算します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">IPv4</span>' +
      '<input type="text" class="simple-tool-input" id="sip" placeholder="192.168.1.10"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">プレフィックス</span>' +
      '<input type="number" class="simple-tool-input" id="sc" min="0" max="32" value="24"/></label></div>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="sgo">計算</button></div>' +
      '<pre class="simple-tool-output" id="sout"></pre>';
    function ipToInt(s) {
      var p = s.split(".").map(function (x) { return parseInt(x, 10); });
      if (p.length !== 4 || p.some(function (n) { return n < 0 || n > 255; })) return null;
      return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
    }
    function intToIp(n) {
      return [
        (n >>> 24) & 255,
        (n >>> 16) & 255,
        (n >>> 8) & 255,
        n & 255,
      ].join(".");
    }
    root.querySelector("#sgo").addEventListener("click", function () {
      var ip = ipToInt(root.querySelector("#sip").value.trim());
      var c = parseInt(root.querySelector("#sc").value, 10);
      if (ip == null || c < 0 || c > 32) {
        root.querySelector("#sout").textContent = "入力を確認してください";
        return;
      }
      if (c === 0) {
        root.querySelector("#sout").textContent = "/0 はこのツールでは扱いません（/1〜/32 を指定してください）";
        return;
      }
      var mask = (-1 << (32 - c)) >>> 0;
      var net = (ip & mask) >>> 0;
      var hostMask = (0xffffffff ^ mask) >>> 0;
      var bcast = (net | hostMask) >>> 0;
      var hosts = c >= 31 ? 0 : Math.pow(2, 32 - c) - 2;
      root.querySelector("#sout").textContent =
        "ネットワーク: " +
        intToIp(net) +
        "/" +
        c +
        "\nブロードキャスト: " +
        intToIp(bcast) +
        "\n利用可能ホスト数（目安）: " +
        hosts;
    });
  };

  T.htmlEntity = function (root) {
    root.innerHTML =
      '<p class="convert-hint">HTML エンティティをデコードします（textarea + ブラウザの変換）。</p>' +
      '<textarea class="simple-tool-textarea" id="he2in" placeholder="&amp;lt;div&amp;gt;"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="he2go">デコード</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="he2cp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="he2out"></pre>';
    root.querySelector("#he2go").addEventListener("click", function () {
      var d = document.createElement("textarea");
      d.innerHTML = root.querySelector("#he2in").value;
      root.querySelector("#he2out").textContent = d.value;
    });
    root.querySelector("#he2cp").addEventListener("click", function () {
      copyText(root.querySelector("#he2out").textContent);
    });
  };

  T.romanNum = function (root) {
    root.innerHTML =
      '<p class="convert-hint">1〜3999 の整数をローマ数字に変換します。</p>' +
      '<input type="number" class="simple-tool-input" id="rn" min="1" max="3999" value="2026"/>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="rngo">変換</button></div>' +
      '<pre class="simple-tool-output" id="rnout"></pre>';
    var vals = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];
    root.querySelector("#rngo").addEventListener("click", function () {
      var n = parseInt(root.querySelector("#rn").value, 10);
      if (n < 1 || n > 3999) {
        root.querySelector("#rnout").textContent = "1〜3999 を指定してください";
        return;
      }
      var s = "";
      var x = n;
      for (var i = 0; i < vals.length; i++) {
        while (x >= vals[i][0]) {
          s += vals[i][1];
          x -= vals[i][0];
        }
      }
      root.querySelector("#rnout").textContent = s;
    });
  };

  T.unitLength = function (root) {
    root.innerHTML =
      '<p class="convert-hint">メートル基準で長さを相互換算します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">値</span>' +
      '<input type="number" class="simple-tool-input" id="uv" step="any"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">単位</span>' +
      '<select class="simple-tool-select" id="uu">' +
      '<option value="m">m</option><option value="cm">cm</option><option value="mm">mm</option>' +
      '<option value="km">km</option><option value="in">inch</option><option value="ft">ft</option></select></label>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="ugo">換算</button></div>' +
      '<pre class="simple-tool-output" id="uout"></pre>';
    root.querySelector("#ugo").addEventListener("click", function () {
      var v = parseFloat(root.querySelector("#uv").value, 10);
      var u = root.querySelector("#uu").value;
      if (isNaN(v)) return;
      var m;
      if (u === "m") m = v;
      else if (u === "cm") m = v / 100;
      else if (u === "mm") m = v / 1000;
      else if (u === "km") m = v * 1000;
      else if (u === "in") m = v * 0.0254;
      else if (u === "ft") m = v * 0.3048;
      root.querySelector("#uout").textContent =
        (m * 1000).toFixed(3) +
        " mm\n" +
        (m * 100).toFixed(4) +
        " cm\n" +
        m.toFixed(6) +
        " m\n" +
        (m / 1000).toFixed(9) +
        " km\n" +
        (m / 0.0254).toFixed(6) +
        " inch\n" +
        (m / 0.3048).toFixed(6) +
        " ft";
    });
  };

  T.fuelEconomy = function (root) {
    root.innerHTML =
      '<p class="convert-hint">km/L と L/100km を相互変換します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">km/L</span>' +
      '<input type="number" class="simple-tool-input" id="f1" step="any" placeholder="15"/></label>' +
      '<p class="simple-tool-note">または</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">L/100km</span>' +
      '<input type="number" class="simple-tool-input" id="f2" step="any" placeholder="6.7"/></label>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="fgo1">km/L → L/100km</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="fgo2">L/100km → km/L</button></div>' +
      '<pre class="simple-tool-output" id="fout"></pre>';
    root.querySelector("#fgo1").addEventListener("click", function () {
      var k = parseFloat(root.querySelector("#f1").value, 10);
      if (!k || k <= 0) {
        root.querySelector("#fout").textContent = "正の数を入力してください";
        return;
      }
      root.querySelector("#fout").textContent = "L/100km: " + (100 / k).toFixed(3);
    });
    root.querySelector("#fgo2").addEventListener("click", function () {
      var l = parseFloat(root.querySelector("#f2").value, 10);
      if (!l || l <= 0) {
        root.querySelector("#fout").textContent = "正の数を入力してください";
        return;
      }
      root.querySelector("#fout").textContent = "km/L: " + (100 / l).toFixed(3);
    });
  };

  T.maruSuji = function (root) {
    root.innerHTML =
      '<div class="simple-tool-stack maru-suuji-tool">' +
      '<div class="simple-tool-row simple-tool-row--top">' +
      '<label class="simple-tool-field maru-suuji-filter">' +
      '<span class="simple-tool-label">数字で絞り込み</span>' +
      '<input type="text" inputmode="numeric" pattern="[0-9]*" class="simple-tool-input" id="msFilter" placeholder="例: 1" autocomplete="off" />' +
      "</label></div>" +
      '<p class="simple-tool-note" id="msStatus" role="status" aria-live="polite"></p>' +
      '<div class="maru-suuji-sections" id="msSections"></div>' +
      "</div>";

    function ch(cp) {
      try {
        return String.fromCodePoint(cp);
      } catch (e) {
        return "";
      }
    }

    function hex(cp) {
      return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
    }

    function addRange(out, group, startCp, endCp, startNum) {
      var n = startNum;
      for (var cp = startCp; cp <= endCp; cp++) {
        out.push({
          group: group,
          num: String(n),
          char: ch(cp),
          code: hex(cp),
        });
        n++;
      }
    }

    function buildItems() {
      var items = [];

      // ⓪ (U+24EA)
      items.push({ group: "丸数字", num: "0", char: ch(0x24ea), code: hex(0x24ea) });
      // ①..⑳ (U+2460..U+2473) = 1..20
      addRange(items, "丸数字", 0x2460, 0x2473, 1);
      // ㉑..㉟ (U+3251..U+325F) = 21..35
      addRange(items, "丸数字", 0x3251, 0x325f, 21);
      // ㊱..㊿ (U+32B1..U+32BF) = 36..50
      addRange(items, "丸数字", 0x32b1, 0x32bf, 36);

      // 🄋 (U+1F10B) 0, ➀..➉ (U+2780..U+2789) = 1..10
      items.push({
        group: "装飾（白丸）",
        num: "0",
        char: ch(0x1f10b),
        code: hex(0x1f10b),
      });
      addRange(items, "装飾（白丸）", 0x2780, 0x2789, 1);

      // ⓿ (U+24FF)
      items.push({ group: "黒丸数字", num: "0", char: ch(0x24ff), code: hex(0x24ff) });
      // ❶..❿ (U+2776..U+277F) = 1..10
      addRange(items, "黒丸数字", 0x2776, 0x277f, 1);
      // ⓫..⓴ (U+24EB..U+24F4) = 11..20
      addRange(items, "黒丸数字", 0x24eb, 0x24f4, 11);

      // 🄌 (U+1F10C) 0, ➊..➓ (U+278A..U+2793) = 1..10
      items.push({
        group: "装飾（黒丸）",
        num: "0",
        char: ch(0x1f10c),
        code: hex(0x1f10c),
      });
      addRange(items, "装飾（黒丸）", 0x278a, 0x2793, 1);

      // ⓵..⓾ (U+24F5..U+24FE) = 1..10
      addRange(items, "二重丸数字", 0x24f5, 0x24fe, 1);

      // 合成用丸 (U+20DD)
      items.push({
        group: "合成（囲い文字）",
        num: "◌⃝",
        char: ch(0x20dd),
        code: hex(0x20dd),
      });

      // 文字が空のものは除外（環境依存）
      return items.filter(function (x) {
        return x.char && x.char.length > 0;
      });
    }

    var all = buildItems();
    var sectionsEl = root.querySelector("#msSections");
    var filterEl = root.querySelector("#msFilter");
    var statusEl = root.querySelector("#msStatus");

    function normalizeFilter(s) {
      if (!s) return "";
      var m = String(s).match(/\d+/g);
      return m ? m.join("") : "";
    }

    function itemsFor(q) {
      if (!q) return all;
      return all.filter(function (x) {
        // 「◌⃝」のような特殊行は「0〜9 の絞り込み」からは外す
        if (!/^\d+$/.test(x.num)) return false;
        return x.num.indexOf(q) === 0;
      });
    }

    function groupBy(items) {
      var map = {};
      items.forEach(function (x) {
        var k = x.group || "その他";
        if (!map[k]) map[k] = [];
        map[k].push(x);
      });
      return map;
    }

    function render(q) {
      var shown = itemsFor(q);
      var grouped = groupBy(shown);
      var groups = Object.keys(grouped);
      sectionsEl.innerHTML = "";

      if (q) {
        statusEl.textContent =
          shown.length + " 件を表示中（絞り込み: " + q + "）";
      } else {
        statusEl.textContent = all.length + " 件を表示中";
      }

      if (shown.length === 0) {
        sectionsEl.innerHTML =
          '<p class="simple-tool-note">該当する丸数字が見つかりませんでした。</p>';
        return;
      }

      groups.forEach(function (g) {
        var h = document.createElement("section");
        h.className = "maru-suuji-section";
        var title = document.createElement("h3");
        title.className = "maru-suuji-title";
        title.textContent = g;
        h.appendChild(title);

        var grid = document.createElement("div");
        grid.className = "maru-suuji-grid";

        grouped[g].forEach(function (x) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "maru-suuji-item";
          btn.setAttribute(
            "aria-label",
            x.group +
              " " +
              x.num +
              "（" +
              x.code +
              "）をコピー"
          );
          btn.dataset.copy = x.char;

          var a = document.createElement("span");
          a.className = "maru-suuji-char";
          a.textContent = x.char;

          var b = document.createElement("span");
          b.className = "maru-suuji-meta";
          b.textContent = (x.num && /^\d+$/.test(x.num) ? x.num + " " : "") + x.code;

          btn.appendChild(a);
          btn.appendChild(b);
          grid.appendChild(btn);
        });

        h.appendChild(grid);
        sectionsEl.appendChild(h);
      });
    }

    function currentQuery() {
      return normalizeFilter(filterEl.value);
    }

    filterEl.addEventListener("input", function () {
      render(currentQuery());
    });

    sectionsEl.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== sectionsEl) {
        if (t && t.classList && t.classList.contains("maru-suuji-item")) break;
        t = t.parentNode;
      }
      if (!t || t === sectionsEl) return;
      copyText(t.dataset.copy || "");
    });

    render("");
  };

  function run() {
    var chrome = document.querySelector(".tool-chrome[data-tool-id]");
    if (!chrome) return;
    var id = chrome.getAttribute("data-tool-id");
    if (!T[id]) return;
    var panel = chrome.querySelector(".tool-panel");
    if (!panel) return;
    T[id](panel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
