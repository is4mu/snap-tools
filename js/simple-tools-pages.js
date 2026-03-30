/**
 * シンプル系ツールの UI 初期化（data-tool-id に対応）。
 * tool-chrome.js の後に読み込むこと。
 */
(function () {
  function copyText(s) {
    if (s == null || s === "") return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(String(s)).then(function () {
        if (typeof window.showCopyToast === "function") window.showCopyToast();
      });
    } else {
      var ta = document.createElement("textarea");
      ta.value = String(s);
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy") && typeof window.showCopyToast === "function") {
          window.showCopyToast();
        }
      } catch (e) {}
      document.body.removeChild(ta);
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

  T.slugify = function (root) {
    root.innerHTML =
      '<p class="convert-hint">URL 用スラッグ（英小文字・ハイフン）に変換します。</p>' +
      '<textarea class="simple-tool-textarea" id="slin" placeholder="タイトルや日本語"></textarea>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="slgo">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="slcp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="slout"></pre>';
    root.querySelector("#slgo").addEventListener("click", function () {
      var s = root.querySelector("#slin").value;
      s = s.normalize("NFKC").toLowerCase().trim();
      s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (!s) s = "slug";
      root.querySelector("#slout").textContent = s;
    });
    root.querySelector("#slcp").addEventListener("click", function () {
      copyText(root.querySelector("#slout").textContent);
    });
  };

  T.caseConvert = function (root) {
    root.innerHTML =
      '<p class="convert-hint">大文字・小文字・先頭のみ大文字などに一括変換します。</p>' +
      '<textarea class="simple-tool-textarea" id="ccin"></textarea>' +
      '<div class="simple-tool-row">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">モード</span>' +
      '<select class="simple-tool-select" id="ccmode">' +
      '<option value="u">大文字 (UPPER)</option>' +
      '<option value="l">小文字 (lower)</option>' +
      '<option value="t">先頭だけ大文字 (Title)</option>' +
      '<option value="s">文ごと先頭 (Sentence)</option></select></label></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="ccgo">変換</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="cccp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="ccout"></pre>';
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
    root.querySelector("#ccgo").addEventListener("click", function () {
      var v = root.querySelector("#ccin").value;
      var m = root.querySelector("#ccmode").value;
      var o = v;
      if (m === "u") o = v.toUpperCase();
      else if (m === "l") o = v.toLowerCase();
      else if (m === "t") o = titleCase(v);
      else if (m === "s") o = sentenceCase(v.toLowerCase());
      root.querySelector("#ccout").textContent = o;
    });
    root.querySelector("#cccp").addEventListener("click", function () {
      copyText(root.querySelector("#ccout").textContent);
    });
  };

  T.lineSort = function (root) {
    root.innerHTML =
      '<p class="convert-hint">行の並べ替え・重複除去・空行の扱いを選べます。</p>' +
      '<textarea class="simple-tool-textarea" id="lsin"></textarea>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">順序</span>' +
      '<select class="simple-tool-select" id="lsorder">' +
      '<option value="asc">昇順 (A→Z)</option>' +
      '<option value="desc">降順</option></select></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">オプション</span>' +
      '<select class="simple-tool-select" id="lsopt">' +
      '<option value="">なし</option>' +
      '<option value="uniq">重複行を除去</option>' +
      '<option value="trim">前後空白を除去してから処理</option></select></label></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="lsgo">実行</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="lscp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="lsout"></pre>';
    root.querySelector("#lsgo").addEventListener("click", function () {
      var raw = root.querySelector("#lsin").value;
      var opt = root.querySelector("#lsopt").value;
      var lines = raw.split(/\r?\n/);
      if (opt === "trim") lines = lines.map(function (l) { return l.trim(); });
      if (opt === "uniq") {
        var seen = {};
        lines = lines.filter(function (l) {
          if (seen[l]) return false;
          seen[l] = true;
          return true;
        });
      }
      lines.sort(function (a, b) {
        var o = root.querySelector("#lsorder").value;
        if (o === "asc") return a.localeCompare(b, "ja");
        return b.localeCompare(a, "ja");
      });
      root.querySelector("#lsout").textContent = lines.join("\n");
    });
    root.querySelector("#lscp").addEventListener("click", function () {
      copyText(root.querySelector("#lsout").textContent);
    });
  };

  T.textDiff = function (root) {
    root.innerHTML =
      '<p class="convert-hint">行単位の簡易差分（一致／削除／追加）を表示します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<div class="simple-tool-field"><span class="simple-tool-label">テキスト A</span>' +
      '<textarea class="simple-tool-textarea" id="tda" style="min-height:6rem"></textarea></div>' +
      '<div class="simple-tool-field"><span class="simple-tool-label">テキスト B</span>' +
      '<textarea class="simple-tool-textarea" id="tdb" style="min-height:6rem"></textarea></div></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="tdgo">比較</button></div>' +
      '<pre class="simple-tool-output" id="tdout"></pre>';
    root.querySelector("#tdgo").addEventListener("click", function () {
      var a = root.querySelector("#tda").value.split(/\r?\n/);
      var b = root.querySelector("#tdb").value.split(/\r?\n/);
      var max = Math.max(a.length, b.length);
      var out = [];
      for (var i = 0; i < max; i++) {
        var la = a[i];
        var lb = b[i];
        if (la === lb) out.push("  " + (la == null ? "" : la));
        else {
          if (la !== undefined) out.push("- " + la);
          if (lb !== undefined) out.push("+ " + lb);
        }
      }
      root.querySelector("#tdout").textContent = out.join("\n") || "(差分なし)";
    });
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

  T.unixTime = function (root) {
    root.innerHTML =
      '<p class="convert-hint">UNIX 時刻（秒）と日時を相互変換します（ローカル時刻で表示）。</p>' +
      '<div class="convert-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="u" aria-selected="true">秒 → 日時</button>' +
      '<button type="button" class="convert-tab" data-tab="d" aria-selected="false">日時 → 秒</button></div>' +
      '<div data-tabpanel="u" class="convert-tabpanel simple-tool-stack">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">UNIX 秒</span>' +
      '<input type="text" class="simple-tool-input" id="utx" inputmode="numeric" placeholder="1700000000"/></label>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="utgo">変換</button></div>' +
      '<pre class="simple-tool-output" id="utout"></pre></div>' +
      '<div data-tabpanel="d" class="convert-tabpanel simple-tool-stack" hidden>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">日時（ローカル）</span>' +
      '<input type="datetime-local" class="simple-tool-input" id="utdt"/></label>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="utgo2">変換</button></div>' +
      '<pre class="simple-tool-output" id="utout2"></pre></div>';
    bindTabs(root, ".convert-tab");
    root.querySelector("#utgo").addEventListener("click", function () {
      var s = parseFloat(root.querySelector("#utx").value);
      if (isNaN(s)) {
        root.querySelector("#utout").textContent = "数値を入力してください";
        return;
      }
      var d = new Date(s * 1000);
      root.querySelector("#utout").textContent =
        d.toLocaleString("ja-JP") + "\nISO: " + d.toISOString();
    });
    root.querySelector("#utgo2").addEventListener("click", function () {
      var v = root.querySelector("#utdt").value;
      if (!v) {
        root.querySelector("#utout2").textContent = "日時を選んでください";
        return;
      }
      var ms = new Date(v).getTime();
      root.querySelector("#utout2").textContent = "UNIX 秒: " + Math.floor(ms / 1000);
    });
  };

  T.ageCalc = function (root) {
    root.innerHTML =
      '<p class="convert-hint">誕生日から満年齢と次の誕生日までの日数を計算します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">誕生日</span>' +
      '<input type="date" class="simple-tool-input" id="agd"/></label>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="aggo">計算</button></div>' +
      '<pre class="simple-tool-output" id="agout"></pre>';
    root.querySelector("#aggo").addEventListener("click", function () {
      var v = root.querySelector("#agd").value;
      if (!v) return;
      var b = new Date(v + "T00:00:00");
      var now = new Date();
      var y = now.getFullYear() - b.getFullYear();
      var m = now.getMonth() - b.getMonth();
      var d = now.getDate() - b.getDate();
      if (m < 0 || (m === 0 && d < 0)) y--;
      var next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
      if (next < now) next.setFullYear(next.getFullYear() + 1);
      var days = Math.ceil((next - now) / 86400000);
      root.querySelector("#agout").textContent =
        "満 " + y + " 歳\n次の誕生日まで: 約 " + days + " 日";
    });
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
      '<p class="convert-hint">#RRGGBB 形式から RGB と HSL を表示します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">HEX</span>' +
      '<input type="text" class="simple-tool-input" id="cin" placeholder="#3b82f6"/></label>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="cgo">変換</button></div>' +
      '<pre class="simple-tool-output" id="cout"></pre>' +
      '<div id="csw" style="height:48px;border-radius:8px;border:1px solid var(--tp-border);margin-top:8px"></div>';
    function hexToRgb(h) {
      var m = h.replace(/^#/, "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (!m) return null;
      return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    }
    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h;
      var s;
      var l = (max + min) / 2;
      if (max === min) h = s = 0;
      else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          default:
            h = ((r - g) / d + 4) / 6;
        }
      }
      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
    root.querySelector("#cgo").addEventListener("click", function () {
      var rgb = hexToRgb(root.querySelector("#cin").value.trim());
      if (!rgb) {
        root.querySelector("#cout").textContent = "有効な #RRGGBB を入力してください";
        return;
      }
      var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      root.querySelector("#cout").textContent =
        "rgb(" + rgb.join(", ") + ")\nhsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
      root.querySelector("#csw").style.background =
        "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    });
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
      '<p class="convert-hint">線形グラデーションの CSS を生成します。</p>' +
      '<div class="simple-tool-grid2">' +
      '<label class="simple-tool-field"><span class="simple-tool-label">角度 (deg)</span>' +
      '<input type="number" class="simple-tool-input" id="gd" value="135"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">色1</span>' +
      '<input type="text" class="simple-tool-input" id="g1" value="#6366f1"/></label>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">色2</span>' +
      '<input type="text" class="simple-tool-input" id="g2" value="#ec4899"/></label></div>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="ggo">生成</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="gcp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="gout"></pre>' +
      '<div id="gprev" style="height:72px;border-radius:10px;border:1px solid var(--tp-border)"></div>';
    function upd() {
      var deg = root.querySelector("#gd").value || "90";
      var a = root.querySelector("#g1").value;
      var b = root.querySelector("#g2").value;
      var css = "linear-gradient(" + deg + "deg, " + a + ", " + b + ")";
      root.querySelector("#gout").textContent = "background: " + css + ";";
      root.querySelector("#gprev").style.background = css;
    }
    root.querySelector("#ggo").addEventListener("click", upd);
    root.querySelector("#gcp").addEventListener("click", function () {
      copyText(root.querySelector("#gout").textContent);
    });
    upd();
  };

  T.lorem = function (root) {
    var base =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    root.innerHTML =
      '<p class="convert-hint">ダミー英文を段落単位で生成します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">段落数</span>' +
      '<input type="number" class="simple-tool-input" id="lm" min="1" max="20" value="3"/></label>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="lmgo">生成</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="lmcp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="lmout" style="min-height:8rem"></pre>';
    root.querySelector("#lmgo").addEventListener("click", function () {
      var n = Math.min(20, Math.max(1, parseInt(root.querySelector("#lm").value, 10) || 3));
      var paras = [];
      for (var i = 0; i < n; i++) paras.push(base + " [段落 " + (i + 1) + "]");
      root.querySelector("#lmout").textContent = paras.join("\n\n");
    });
    root.querySelector("#lmcp").addEventListener("click", function () {
      copyText(root.querySelector("#lmout").textContent);
    });
  };

  T.creditCard = function (root) {
    root.innerHTML =
      '<p class="convert-hint">カード番号のチェックディジット（Luhn）を検証します。番号は送信されません。</p>' +
      '<input type="text" class="simple-tool-input" id="ccn" inputmode="numeric" placeholder="数字のみ（スペース可）" style="margin-bottom:12px"/>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="ccgo">検証</button></div>' +
      '<pre class="simple-tool-output" id="ccout"></pre>';
    function luhn(num) {
      var arr = num.split("").reverse().map(function (x) { return parseInt(x, 10); });
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        var n = arr[i];
        if (i % 2 === 1) {
          n *= 2;
          if (n > 9) n -= 9;
        }
        sum += n;
      }
      return sum % 10 === 0;
    }
    root.querySelector("#ccgo").addEventListener("click", function () {
      var raw = root.querySelector("#ccn").value.replace(/\D/g, "");
      if (raw.length < 12) {
        root.querySelector("#ccout").textContent = "桁数が足りません";
        return;
      }
      root.querySelector("#ccout").textContent = luhn(raw) ? "Luhn: 有効な形式です" : "Luhn: 無効です";
    });
  };

  T.zipJp = function (root) {
    root.innerHTML =
      '<p class="convert-hint">7 桁の郵便番号を 123-4567 形式に整形します。</p>' +
      '<input type="text" class="simple-tool-input" id="zp" inputmode="numeric" placeholder="1234567 または 123-4567"/>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="zpgo">整形</button></div>' +
      '<pre class="simple-tool-output" id="zpout"></pre>';
    root.querySelector("#zpgo").addEventListener("click", function () {
      var d = root.querySelector("#zp").value.replace(/\D/g, "");
      if (d.length !== 7) {
        root.querySelector("#zpout").textContent = "7 桁の数字を入力してください";
        return;
      }
      root.querySelector("#zpout").textContent = d.slice(0, 3) + "-" + d.slice(3);
    });
  };

  T.zenkaku = function (root) {
    root.innerHTML =
      '<p class="convert-hint">半角英数字・記号を全角に、全角英数字を半角に変換できます。</p>' +
      '<div class="convert-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="z" aria-selected="true">→ 全角</button>' +
      '<button type="button" class="convert-tab" data-tab="h" aria-selected="false">→ 半角</button></div>' +
      '<div data-tabpanel="z" class="convert-tabpanel simple-tool-stack">' +
      '<textarea class="simple-tool-textarea" id="zk1"></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="zkgo1">変換</button></div>' +
      '<pre class="simple-tool-output" id="zkout1"></pre></div>' +
      '<div data-tabpanel="h" class="convert-tabpanel simple-tool-stack" hidden>' +
      '<textarea class="simple-tool-textarea" id="zk2"></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="zkgo2">変換</button></div>' +
      '<pre class="simple-tool-output" id="zkout2"></pre></div>';
    bindTabs(root, ".convert-tab");
    function toZen(s) {
      return s.replace(/[!-~]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
      }).replace(/ /g, "\u3000");
    }
    function toHan(s) {
      return s.replace(/\u3000/g, " ").replace(/[\uff01-\uff5e]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
      });
    }
    root.querySelector("#zkgo1").addEventListener("click", function () {
      root.querySelector("#zkout1").textContent = toZen(root.querySelector("#zk1").value);
    });
    root.querySelector("#zkgo2").addEventListener("click", function () {
      root.querySelector("#zkout2").textContent = toHan(root.querySelector("#zk2").value);
    });
  };

  T.kataHira = function (root) {
    root.innerHTML =
      '<p class="convert-hint">カタカナとひらがなを相互変換します（簡易・1 文字単位）。</p>' +
      '<div class="convert-tabs" role="tablist">' +
      '<button type="button" class="convert-tab" data-tab="h" aria-selected="true">→ ひらがな</button>' +
      '<button type="button" class="convert-tab" data-tab="k" aria-selected="false">→ カタカナ</button></div>' +
      '<div data-tabpanel="h" class="convert-tabpanel simple-tool-stack">' +
      '<textarea class="simple-tool-textarea" id="kh1"></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="khgo1">変換</button></div>' +
      '<pre class="simple-tool-output" id="khout1"></pre></div>' +
      '<div data-tabpanel="k" class="convert-tabpanel simple-tool-stack" hidden>' +
      '<textarea class="simple-tool-textarea" id="kh2"></textarea>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="khgo2">変換</button></div>' +
      '<pre class="simple-tool-output" id="khout2"></pre></div>';
    bindTabs(root, ".convert-tab");
    root.querySelector("#khgo1").addEventListener("click", function () {
      var s = root.querySelector("#kh1").value;
      s = s.replace(/[\u30a1-\u30f6]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0x60);
      });
      root.querySelector("#khout1").textContent = s;
    });
    root.querySelector("#khgo2").addEventListener("click", function () {
      var s = root.querySelector("#kh2").value;
      s = s.replace(/[\u3041-\u3096]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) + 0x60);
      });
      root.querySelector("#khout2").textContent = s;
    });
  };

  T.stopwatch = function (root) {
    root.innerHTML =
      '<p class="convert-hint">シンプルなストップウォッチです。</p>' +
      '<p class="simple-tool-pill simple-tool-live" id="swd" style="font-size:1.5rem;padding:12px">00:00:00.000</p>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="sws">開始 / 停止</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="swr">リセット</button></div>' +
      '<pre class="simple-tool-output" id="swl" style="max-height:10rem;overflow:auto"></pre>';
    var t0 = 0;
    var acc = 0;
    var id = null;
    var running = false;
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
    function tick() {
      var now = Date.now();
      var ms = acc + (running ? now - t0 : 0);
      root.querySelector("#swd").textContent = fmt(ms);
      if (running) id = requestAnimationFrame(tick);
    }
    root.querySelector("#sws").addEventListener("click", function () {
      if (!running) {
        running = true;
        t0 = Date.now();
        tick();
      } else {
        running = false;
        acc += Date.now() - t0;
        if (id) cancelAnimationFrame(id);
        id = null;
        root.querySelector("#swd").textContent = fmt(acc);
      }
    });
    root.querySelector("#swr").addEventListener("click", function () {
      running = false;
      acc = 0;
      if (id) cancelAnimationFrame(id);
      id = null;
      root.querySelector("#swd").textContent = fmt(0);
    });
  };

  T.pomodoro = function (root) {
    root.innerHTML =
      '<p class="convert-hint">25 分の集中タイマー（開始でカウントダウン）。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">分</span>' +
      '<input type="number" class="simple-tool-input" id="pm" min="1" max="120" value="25"/></label>' +
      '<p class="simple-tool-pill simple-tool-live" id="pomd" style="font-size:1.75rem;padding:14px">25:00</p>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="pstart">開始</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="pstop">停止</button></div>';
    var left = 0;
    var timer = null;
    function show() {
      var m = Math.floor(left / 60);
      var s = left % 60;
      root.querySelector("#pomd").textContent =
        ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
    }
    root.querySelector("#pstart").addEventListener("click", function () {
      var min = parseInt(root.querySelector("#pm").value, 10) || 25;
      left = min * 60;
      show();
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        left--;
        show();
        if (left <= 0) {
          clearInterval(timer);
          timer = null;
          root.querySelector("#pomd").textContent = "終了";
        }
      }, 1000);
    });
    root.querySelector("#pstop").addEventListener("click", function () {
      if (timer) clearInterval(timer);
      timer = null;
    });
  };

  T.countdown = function (root) {
    root.innerHTML =
      '<p class="convert-hint">指定日時までの残り時間を表示します。</p>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">目標日時（ローカル）</span>' +
      '<input type="datetime-local" class="simple-tool-input" id="cdt"/></label>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="cdgo">表示</button></div>' +
      '<pre class="simple-tool-output" id="cdout"></pre>';
    var iv = null;
    root.querySelector("#cdgo").addEventListener("click", function () {
      if (iv) clearInterval(iv);
      function upd() {
        var t = new Date(root.querySelector("#cdt").value).getTime();
        var now = Date.now();
        var d = t - now;
        if (isNaN(d)) {
          root.querySelector("#cdout").textContent = "日時を設定してください";
          return;
        }
        if (d <= 0) {
          root.querySelector("#cdout").textContent = "その日時は過去です";
          return;
        }
        var day = Math.floor(d / 86400000);
        var h = Math.floor((d % 86400000) / 3600000);
        var m = Math.floor((d % 3600000) / 60000);
        var s = Math.floor((d % 60000) / 1000);
        root.querySelector("#cdout").textContent =
          "残り: " + day + " 日 " + h + " 時間 " + m + " 分 " + s + " 秒";
      }
      upd();
      iv = setInterval(upd, 1000);
    });
  };

  T.textSplit = function (root) {
    root.innerHTML =
      '<p class="convert-hint">長文を指定文字数ごとに改行で区切ります（Unicode コードポイント単位）。</p>' +
      '<textarea class="simple-tool-textarea" id="tsin"></textarea>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">1 行あたり最大文字数</span>' +
      '<input type="number" class="simple-tool-input" id="tsn" min="1" value="280"/></label>' +
      '<div class="simple-tool-actions">' +
      '<button type="button" class="convert-submit-btn" id="tsgo">分割</button>' +
      '<button type="button" class="convert-submit-btn convert-submit-btn--secondary" id="tscp">コピー</button></div>' +
      '<pre class="simple-tool-output" id="tsout"></pre>';
    root.querySelector("#tsgo").addEventListener("click", function () {
      var s = root.querySelector("#tsin").value;
      var n = parseInt(root.querySelector("#tsn").value, 10) || 40;
      var arr = [];
      for (var i = 0; i < s.length; i += n) {
        arr.push(s.slice(i, i + n));
      }
      root.querySelector("#tsout").textContent = arr.join("\n");
    });
    root.querySelector("#tscp").addEventListener("click", function () {
      copyText(root.querySelector("#tsout").textContent);
    });
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

  T.readingTime = function (root) {
    root.innerHTML =
      '<p class="convert-hint">文字数からざっくり読了時間を表示します（日本語向けに 1 分あたり 500〜700 字の目安）。</p>' +
      '<textarea class="simple-tool-textarea" id="rtin"></textarea>' +
      '<label class="simple-tool-field"><span class="simple-tool-label">1 分あたりの文字数</span>' +
      '<input type="number" class="simple-tool-input" id="rtsp" value="600" min="100" max="2000"/></label>' +
      '<div class="simple-tool-actions"><button type="button" class="convert-submit-btn" id="rtgo">計算</button></div>' +
      '<pre class="simple-tool-output" id="rtout"></pre>';
    root.querySelector("#rtgo").addEventListener("click", function () {
      var s = root.querySelector("#rtin").value.replace(/\s/g, "");
      var n = s.length;
      var sp = parseInt(root.querySelector("#rtsp").value, 10) || 600;
      var min = n / sp;
      root.querySelector("#rtout").textContent =
        "文字数（空白除く）: " +
        n +
        "\n読了目安: 約 " +
        (Math.ceil(min * 10) / 10) +
        " 分";
    });
  };

  T.worldClock = function (root) {
    root.innerHTML =
      '<p class="convert-hint">主要都市の現在時刻を表示します（ブラウザの Intl を利用）。</p>' +
      '<pre class="simple-tool-output" id="wcout" style="min-height:8rem"></pre>';
    var zones = [
      ["東京", "Asia/Tokyo"],
      ["ニューヨーク", "America/New_York"],
      ["ロンドン", "Europe/London"],
      ["UTC", "UTC"],
    ];
    function upd() {
      var now = new Date();
      var lines = zones.map(function (z) {
        var s = new Intl.DateTimeFormat("ja-JP", {
          timeZone: z[1],
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(now);
        return z[0] + ": " + s;
      });
      root.querySelector("#wcout").textContent = lines.join("\n");
    }
    upd();
    setInterval(upd, 1000);
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
