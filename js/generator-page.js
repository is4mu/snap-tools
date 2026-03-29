(function () {
  var COPY_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  /** 使用する記号のみ（ハイフン・_、@#、.,、!?、*+、$%&） */
  var SYMBOLS = "-_@#.,!?*+$%&";
  var AMBIGUOUS = "O0oilIL1|";

  /**
   * 弱・中・強の共通基準（推定エントロピー・ビット）。
   * ランダム文字列もパスフレーズも、画面上の「推定エントロピー」と同じ式の値で判定する。
   * 閾値はパスワード用途向けの目安（128ビット級の鍵とは別物）。
   */
  var ENTROPY_BITS_LT_WEAK = 45;
  var ENTROPY_BITS_GTE_STRONG = 72;

  var PASS_LEN_MIN = 8;
  var PASS_LEN_MAX = 32;
  var PHRASE_WORDS_MIN = 3;
  var PHRASE_WORDS_MAX = 10;

  /** パスフレーズ各行の単語（リスト由来の小文字）を保持。表記・区切り変更時は再抽選せずこれを整形する */
  var phraseLinesWords = null;

  function clampInt(n, lo, hi) {
    if (typeof n !== "number" || isNaN(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function wireSliderNumberPair(sliderId, inputId, min, max, onAfterUi) {
    var slider = document.getElementById(sliderId);
    var inp = document.getElementById(inputId);
    if (!slider || !inp) return;

    function afterUi() {
      if (typeof onAfterUi === "function") onAfterUi();
    }

    function commitFromSlider() {
      var v = clampInt(parseInt(slider.value, 10), min, max);
      slider.value = String(v);
      inp.value = String(v);
      slider.setAttribute("aria-valuenow", String(v));
      updateStrengthUi();
      afterUi();
    }

    function commitFromInput() {
      var raw = inp.value.trim();
      if (raw === "" || raw === "-") {
        inp.value = String(clampInt(parseInt(slider.value, 10), min, max));
        updateStrengthUi();
        afterUi();
        return;
      }
      var n = parseInt(raw, 10);
      if (isNaN(n)) {
        inp.value = String(clampInt(parseInt(slider.value, 10), min, max));
        updateStrengthUi();
        afterUi();
        return;
      }
      var v = clampInt(n, min, max);
      slider.value = String(v);
      inp.value = String(v);
      slider.setAttribute("aria-valuenow", String(v));
      updateStrengthUi();
      afterUi();
    }

    slider.addEventListener("input", commitFromSlider);
    slider.addEventListener("change", commitFromSlider);

    inp.addEventListener("input", function () {
      var raw = inp.value.trim();
      if (raw === "" || raw === "-") return;
      var n = parseInt(raw, 10);
      if (isNaN(n)) return;
      if (n < min || n > max) return;
      slider.value = String(n);
      slider.setAttribute("aria-valuenow", String(n));
      updateStrengthUi();
      afterUi();
    });

    inp.addEventListener("change", commitFromInput);
    inp.addEventListener("blur", commitFromInput);
  }

  function log2(x) {
    return Math.log(x) / Math.LN2;
  }

  function getMode() {
    var tabPhrase = document.getElementById("passTabPhrase");
    if (tabPhrase && tabPhrase.getAttribute("aria-selected") === "true") {
      return "phrase";
    }
    return "random";
  }

  function selectPassTab(mode) {
    var isPhrase = mode === "phrase";
    var tabR = document.getElementById("passTabRandom");
    var tabP = document.getElementById("passTabPhrase");
    var panelR = document.getElementById("passPanelRandom");
    var panelP = document.getElementById("passPanelPhrase");
    if (tabR) tabR.setAttribute("aria-selected", isPhrase ? "false" : "true");
    if (tabP) tabP.setAttribute("aria-selected", isPhrase ? "true" : "false");
    if (panelR) panelR.hidden = isPhrase;
    if (panelP) panelP.hidden = !isPhrase;
    syncPhraseSepCustomVisibility();
    updateStrengthUi();
  }

  function stripAmbiguous(pool) {
    if (!pool) return "";
    var out = "";
    for (var i = 0; i < pool.length; i++) {
      if (AMBIGUOUS.indexOf(pool.charAt(i)) === -1) out += pool.charAt(i);
    }
    return out;
  }

  function shuffleArray(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = randomIntBelow(i + 1);
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function randomIntBelow(max) {
    if (max <= 0) return 0;
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      var buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function randomChar(pool) {
    if (!pool || pool.length === 0) return "";
    return pool.charAt(randomIntBelow(pool.length));
  }

  function buildLetterPool(pools, incUpper, incLower) {
    var s = "";
    if (incUpper) s += pools.upper;
    if (incLower) s += pools.lower;
    return s;
  }

  function wordUsesPoolChar(word, pool) {
    if (!word || !pool || pool.length === 0) return false;
    for (var i = 0; i < word.length; i++) {
      if (pool.indexOf(word.charAt(i)) !== -1) return true;
    }
    return false;
  }

  /**
   * 先頭・末尾を英字にする。含めたい単語の範囲 [wStart, wStart+wLen) 外の位置だけとスワップする。
   */
  function ensureLetterEdgesArray(out, wStart, wLen, letterPool) {
    var n = out.length;
    if (n === 0 || !letterPool || letterPool.length === 0) return false;

    var wEnd = wLen > 0 ? wStart + wLen - 1 : -1;

    function isLet(c) {
      return letterPool.indexOf(c) !== -1;
    }

    function insideW(k) {
      return wLen > 0 && k >= wStart && k <= wEnd;
    }

    if (!isLet(out[0])) {
      var j = -1;
      for (var i = 1; i < n; i++) {
        if (insideW(i)) continue;
        if (isLet(out[i])) {
          j = i;
          break;
        }
      }
      if (j < 0) return false;
      var t = out[0];
      out[0] = out[j];
      out[j] = t;
    }

    var last = n - 1;
    if (!isLet(out[last])) {
      var j2 = -1;
      for (var k = last - 1; k >= 0; k--) {
        if (insideW(k)) continue;
        if (isLet(out[k])) {
          j2 = k;
          break;
        }
      }
      if (j2 < 0) return false;
      var t2 = out[last];
      out[last] = out[j2];
      out[j2] = t2;
    }

    return true;
  }

  function getPools(noAmbiguous) {
    var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var digits = "0123456789";
    var symbols = SYMBOLS;

    if (noAmbiguous) {
      upper = stripAmbiguous(upper);
      lower = stripAmbiguous(lower);
      digits = stripAmbiguous(digits);
      symbols = stripAmbiguous(symbols);
    }

    return { upper: upper, lower: lower, digits: digits, symbols: symbols };
  }

  function buildFullPool(pools, incUpper, incLower, incNum, incSym) {
    var s = "";
    if (incUpper) s += pools.upper;
    if (incLower) s += pools.lower;
    if (incNum) s += pools.digits;
    if (incSym) s += pools.symbols;
    return s;
  }

  function strengthLabelFromEntropyBits(bits) {
    if (bits == null || isNaN(bits)) {
      return {
        text: "—",
        cls: "convert-pass-strength-badge--unknown",
        ariaLabel: "強度: 推定エントロピーが算出できないため表示できません",
      };
    }
    if (bits < ENTROPY_BITS_LT_WEAK) {
      return {
        text: "弱",
        cls: "convert-pass-strength-badge--weak",
        ariaLabel: "強度の目安: 弱（推定エントロピー " + ENTROPY_BITS_LT_WEAK + " ビット未満）",
      };
    }
    if (bits < ENTROPY_BITS_GTE_STRONG) {
      return {
        text: "中",
        cls: "convert-pass-strength-badge--mid",
        ariaLabel:
          "強度の目安: 中（推定エントロピー " +
          ENTROPY_BITS_LT_WEAK +
          " ビット以上 " +
          ENTROPY_BITS_GTE_STRONG +
          " ビット未満）",
      };
    }
    return {
      text: "強",
      cls: "convert-pass-strength-badge--strong",
      ariaLabel: "強度の目安: 強（推定エントロピー " + ENTROPY_BITS_GTE_STRONG + " ビット以上）",
    };
  }

  function entropyBitsRandom(o) {
    if (
      !o.incUpper &&
      !o.incLower &&
      !o.incNum &&
      !o.incSym
    ) {
      return null;
    }
    var pools = getPools(o.noAmbiguous);
    var fullPool = buildFullPool(
      pools,
      o.incUpper,
      o.incLower,
      o.incNum,
      o.incSym
    );
    if (fullPool.length === 0) return null;
    return o.length * log2(fullPool.length);
  }

  function entropyBitsPhrase(wordCount) {
    var wl = window.GENERATOR_PASSPHRASE_WORDS;
    if (!wl || !wl.length) return null;
    return wordCount * log2(wl.length);
  }

  function getPhraseSeparator() {
    var sel = document.getElementById("passPhraseSep");
    if (!sel) return "-";
    var v = sel.value;
    if (v === "__custom__") {
      var inp = document.getElementById("passPhraseSepCustom");
      return inp ? inp.value : "-";
    }
    return v;
  }

  function syncPhraseSepCustomVisibility() {
    var sel = document.getElementById("passPhraseSep");
    var wrap = document.getElementById("passPhraseSepCustomWrap");
    var inp = document.getElementById("passPhraseSepCustom");
    if (!sel || !wrap) return;
    var show = sel.value === "__custom__";
    wrap.hidden = !show;
    if (inp) inp.disabled = !show;
  }

  function getCurrentEntropyBits() {
    var mode = getMode();
    if (mode === "phrase") {
      var ws = document.getElementById("passPhraseWordsSlider");
      var w = ws ? parseInt(ws.value, 10) : 5;
      return entropyBitsPhrase(w);
    }
    return entropyBitsRandom(readRandomOptionsOnly());
  }

  function updateEntropyDisplay() {
    var bitsEl = document.getElementById("passEntropyBits");
    var noteEl = document.getElementById("passEntropyNote");
    if (!bitsEl || !noteEl) return;

    var mode = getMode();
    var bits = getCurrentEntropyBits();

    if (bits == null || isNaN(bits)) {
      bitsEl.textContent = "—";
      noteEl.textContent =
        mode === "phrase"
          ? "単語リストを読み込めていません。"
          : "条件を選ぶと表示されます。";
      return;
    }

    bitsEl.textContent = bits.toFixed(1);
    var modeNote =
      mode === "phrase"
        ? "語リストから無作為に選ぶと仮定（区切りは未計上）。"
        : "文字プールから無作為に選ぶと仮定。固定の語句があると実際は低め。";
    noteEl.textContent =
      modeNote +
      " 弱／中／強の目安は約 " +
      ENTROPY_BITS_LT_WEAK +
      "・" +
      ENTROPY_BITS_GTE_STRONG +
      " ビット付近です。";
  }

  function readRandomOptionsOnly() {
    return {
      length: parseInt(document.getElementById("passLengthSlider").value, 10),
      incUpper: document.getElementById("passIncUpper").checked,
      incLower: document.getElementById("passIncLower").checked,
      incNum: document.getElementById("passIncNumbers").checked,
      incSym: document.getElementById("passIncSymbols").checked,
      noAmbiguous: document.getElementById("passNoAmbiguous").checked,
    };
  }

  function updateStrengthUi() {
    var mode = getMode();
    var badge = document.getElementById("passStrengthBadge");

    if (mode === "random") {
      var slider = document.getElementById("passLengthSlider");
      var lenInp = document.getElementById("passLengthInput");
      if (!slider || !lenInp) return;
      var len = clampInt(parseInt(slider.value, 10), PASS_LEN_MIN, PASS_LEN_MAX);
      slider.value = String(len);
      if (document.activeElement !== lenInp) {
        lenInp.value = String(len);
      }
      slider.setAttribute("aria-valuenow", String(len));
      if (badge) {
        var s = strengthLabelFromEntropyBits(getCurrentEntropyBits());
        badge.textContent = s.text;
        badge.className = "convert-pass-strength-badge " + s.cls;
        badge.setAttribute("aria-label", s.ariaLabel);
      }
    } else {
      var pslider = document.getElementById("passPhraseWordsSlider");
      var wordsInp = document.getElementById("passPhraseWordsInput");
      if (!pslider || !wordsInp) return;
      var words = clampInt(
        parseInt(pslider.value, 10),
        PHRASE_WORDS_MIN,
        PHRASE_WORDS_MAX
      );
      pslider.value = String(words);
      if (document.activeElement !== wordsInp) {
        wordsInp.value = String(words);
      }
      pslider.setAttribute("aria-valuenow", String(words));
      if (badge) {
        var ps = strengthLabelFromEntropyBits(getCurrentEntropyBits());
        badge.textContent = ps.text;
        badge.className = "convert-pass-strength-badge " + ps.cls;
        badge.setAttribute("aria-label", ps.ariaLabel);
      }
    }

    updateEntropyDisplay();
  }

  function generateOnePassword(
    length,
    incUpper,
    incLower,
    incNum,
    incSym,
    noAmbiguous,
    edgesLetter,
    mustIncludeRaw
  ) {
    if (edgesLetter && !incUpper && !incLower) {
      return {
        ok: false,
        msg: "先頭と末尾を英字にするには、大文字または小文字を含めてください。",
      };
    }

    var pools = getPools(noAmbiguous);
    var fullPool = buildFullPool(pools, incUpper, incLower, incNum, incSym);
    var letterPool = buildLetterPool(pools, incUpper, incLower);

    if (fullPool.length === 0) {
      return { ok: false, msg: "条件で文字の種類を1つ以上選んでください。" };
    }

    var W = (mustIncludeRaw || "").trim();

    if (W.length > length) {
      return {
        ok: false,
        msg: "「含める単語」が指定の文字数より長いです。",
      };
    }

    if (W.length > 0) {
      for (var ci = 0; ci < W.length; ci++) {
        var cch = W.charAt(ci);
        if (fullPool.indexOf(cch) === -1) {
          return {
            ok: false,
            msg:
              "「含める単語」に、現在の条件では使えない文字が含まれます（" +
              cch +
              "）。",
          };
        }
      }
    }

    var extraNeeded = [];

    if (incUpper && pools.upper.length > 0) {
      if (!wordUsesPoolChar(W, pools.upper)) {
        extraNeeded.push(randomChar(pools.upper));
      }
    } else if (incUpper) {
      return {
        ok: false,
        msg: "大文字を選びましたが、紛らわしい文字除外の結果、利用できる大文字がありません。",
      };
    }

    if (incLower && pools.lower.length > 0) {
      if (!wordUsesPoolChar(W, pools.lower)) {
        extraNeeded.push(randomChar(pools.lower));
      }
    } else if (incLower) {
      return {
        ok: false,
        msg: "小文字を選びましたが、紛らわしい文字除外の結果、利用できる小文字がありません。",
      };
    }

    if (incNum && pools.digits.length > 0) {
      if (!wordUsesPoolChar(W, pools.digits)) {
        extraNeeded.push(randomChar(pools.digits));
      }
    } else if (incNum) {
      return {
        ok: false,
        msg: "数字を選びましたが、紛らわしい文字除外の結果、利用できる数字がありません。",
      };
    }

    if (incSym && pools.symbols.length > 0) {
      if (!wordUsesPoolChar(W, pools.symbols)) {
        extraNeeded.push(randomChar(pools.symbols));
      }
    } else if (incSym) {
      return {
        ok: false,
        msg: "記号を選びましたが、紛らわしい文字除外の結果、利用できる記号がありません。",
      };
    }

    var freeSlots = length - W.length;
    if (extraNeeded.length > freeSlots) {
      return {
        ok: false,
        msg:
          "文字数が足りません。含める単語と条件を満たすには最低 " +
          (W.length + extraNeeded.length) +
          " 文字以上にしてください。",
      };
    }

    var start = W.length === 0 ? 0 : randomIntBelow(length - W.length + 1);
    var out = [];
    for (var z = 0; z < length; z++) {
      out.push(null);
    }

    for (var wi = 0; wi < W.length; wi++) {
      out[start + wi] = W.charAt(wi);
    }

    var freeIdx = [];
    for (var fi = 0; fi < length; fi++) {
      if (out[fi] === null) freeIdx.push(fi);
    }
    shuffleArray(freeIdx);

    for (var ei = 0; ei < extraNeeded.length; ei++) {
      out[freeIdx[ei]] = extraNeeded[ei];
    }

    for (var ri = extraNeeded.length; ri < freeIdx.length; ri++) {
      out[freeIdx[ri]] = randomChar(fullPool);
    }

    var pwd = out.join("");

    if (edgesLetter) {
      var arr = pwd.split("");
      if (!ensureLetterEdgesArray(arr, start, W.length, letterPool)) {
        return {
          ok: false,
          msg:
            "先頭と末尾を英字にできませんでした。文字数・含める単語・条件の組み合わせを見直してください。",
        };
      }
      pwd = arr.join("");
    }

    return { ok: true, value: pwd };
  }

  function applyPhraseWordCase(raw, mode) {
    if (!raw) return raw;
    if (mode === "upper") return raw.toUpperCase();
    if (mode === "lower") return raw.toLowerCase();
    if (mode === "title") {
      return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    }
    return raw;
  }

  function formatPhraseLine(words, phraseCase, sep) {
    var cm = phraseCase || "lower";
    var parts = [];
    for (var i = 0; i < words.length; i++) {
      parts.push(applyPhraseWordCase(words[i], cm));
    }
    return parts.join(sep);
  }

  function phraseStoredMatchesUi() {
    if (!phraseLinesWords || phraseLinesWords.length === 0) return false;
    var batchEl = document.getElementById("passBatchSize");
    var wcEl = document.getElementById("passPhraseWordsSlider");
    var batch = batchEl ? parseInt(batchEl.value, 10) || 1 : 1;
    var wc = wcEl ? parseInt(wcEl.value, 10) : 0;
    if (phraseLinesWords.length !== batch) return false;
    for (var i = 0; i < phraseLinesWords.length; i++) {
      if (!phraseLinesWords[i] || phraseLinesWords[i].length !== wc) return false;
    }
    return true;
  }

  function refreshPhraseDisplayOnly() {
    if (getMode() !== "phrase") return;
    if (phraseStoredMatchesUi()) {
      var o = readOptions();
      var list = [];
      for (var i = 0; i < phraseLinesWords.length; i++) {
        list.push(formatPhraseLine(phraseLinesWords[i], o.phraseCase, o.phraseSep));
      }
      setError("");
      renderResults(list, "phrase");
    } else {
      generatePasswordsPhraseFull(readOptions());
    }
  }

  function generatePasswordsPhraseFull(o) {
    setError("");
    var wl = window.GENERATOR_PASSPHRASE_WORDS;
    if (!wl || wl.length === 0) {
      phraseLinesWords = null;
      setError("単語リストを読み込めていません。ページを再読み込みしてください。");
      renderResults([], "phrase");
      return;
    }
    phraseLinesWords = [];
    var list = [];
    for (var b = 0; b < o.batch; b++) {
      var words = [];
      for (var i = 0; i < o.phraseWords; i++) {
        words.push(wl[randomIntBelow(wl.length)]);
      }
      phraseLinesWords.push(words);
      list.push(formatPhraseLine(words, o.phraseCase, o.phraseSep));
    }
    renderResults(list, "phrase");
  }

  function setError(msg) {
    var el = document.getElementById("passGenError");
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function copyFromField(field) {
    if (!field) return;
    var v = field.value;
    if (!v) return;

    function ok() {
      if (typeof window.showCopyToast === "function") window.showCopyToast();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(v).then(ok).catch(fallback);
    } else {
      fallback();
    }

    function fallback() {
      field.select();
      try {
        if (document.execCommand("copy")) ok();
      } catch (e) {}
    }
  }

  function renderResults(lines, kind) {
    var list = document.getElementById("passResultsList");
    if (!list) return;
    list.innerHTML = "";

    var labelBase =
      kind === "phrase" ? "生成されたパスフレーズ " : "生成されたパスワード ";

    for (var i = 0; i < lines.length; i++) {
      var wrap = document.createElement("div");
      wrap.className = "convert-result convert-result--with-copy convert-pass-result-row";

      var inner = document.createElement("div");
      inner.className = "convert-result-inner";

      var inp = document.createElement("input");
      inp.type = "text";
      inp.readOnly = true;
      inp.className = "convert-pass-output";
      inp.value = lines[i];
      inp.setAttribute("aria-label", labelBase + (i + 1));

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "convert-copy-btn";
      btn.setAttribute(
        "aria-label",
        (kind === "phrase" ? "パスフレーズ " : "パスワード ") + (i + 1) + " をコピー"
      );
      btn.innerHTML = COPY_ICON;

      inner.appendChild(inp);
      inner.appendChild(btn);
      wrap.appendChild(inner);
      list.appendChild(wrap);
    }
  }

  function readOptions() {
    var mode = getMode();
    var base = {
      mode: mode,
      batch: parseInt(document.getElementById("passBatchSize").value, 10) || 1,
    };

    if (mode === "phrase") {
      base.phraseWords = parseInt(
        document.getElementById("passPhraseWordsSlider").value,
        10
      );
      base.phraseSep = getPhraseSeparator();
      var caseChecked = document.querySelector(
        'input[name="passPhraseCase"]:checked'
      );
      base.phraseCase = caseChecked ? caseChecked.value : "title";
      return base;
    }

    base.length = parseInt(document.getElementById("passLengthSlider").value, 10);
    base.incUpper = document.getElementById("passIncUpper").checked;
    base.incLower = document.getElementById("passIncLower").checked;
    base.incNum = document.getElementById("passIncNumbers").checked;
    base.incSym = document.getElementById("passIncSymbols").checked;
    base.noAmbiguous = document.getElementById("passNoAmbiguous").checked;
    base.edgesLetter = document.getElementById("passEdgesLetter").checked;
    var mustEn = document.getElementById("passMustIncludeEnable");
    var mustInp = document.getElementById("passMustInclude");
    base.mustInclude =
      mustEn && mustEn.checked && mustInp ? mustInp.value : "";
    return base;
  }

  function generatePasswords() {
    var o = readOptions();

    if (o.mode === "phrase") {
      generatePasswordsPhraseFull(o);
      return;
    }

    phraseLinesWords = null;

    if (!o.incUpper && !o.incLower && !o.incNum && !o.incSym) {
      setError("条件で文字の種類を1つ以上選んでください。");
      renderResults([], "random");
      return;
    }

    if (o.edgesLetter && !o.incUpper && !o.incLower) {
      setError(
        "先頭と末尾を英字にするには、大文字または小文字を含めてください。"
      );
      renderResults([], "random");
      return;
    }

    setError("");
    var list2 = [];
    var errMsg2 = "";

    for (var b2 = 0; b2 < o.batch; b2++) {
      var r2 = generateOnePassword(
        o.length,
        o.incUpper,
        o.incLower,
        o.incNum,
        o.incSym,
        o.noAmbiguous,
        o.edgesLetter,
        o.mustInclude
      );
      if (!r2.ok) {
        errMsg2 = r2.msg;
        break;
      }
      list2.push(r2.value);
    }

    if (errMsg2) {
      setError(errMsg2);
      renderResults([], "random");
      return;
    }

    renderResults(list2, "random");
  }

  function bindPassTabs() {
    var tabR = document.getElementById("passTabRandom");
    var tabP = document.getElementById("passTabPhrase");
    if (tabR) {
      tabR.addEventListener("click", function () {
        selectPassTab("random");
        generatePasswords();
      });
    }
    if (tabP) {
      tabP.addEventListener("click", function () {
        selectPassTab("phrase");
        generatePasswords();
      });
    }
  }

  function syncMustIncludeVisibility() {
    var cb = document.getElementById("passMustIncludeEnable");
    var wrap = document.getElementById("passMustIncludeWrap");
    var inp = document.getElementById("passMustInclude");
    if (!cb || !wrap || !inp) return;
    var on = cb.checked;
    wrap.hidden = !on;
    inp.disabled = !on;
  }

  function init() {
    var btnGen = document.getElementById("passGenerateBtn");
    var slider = document.getElementById("passLengthSlider");
    var lenInput = document.getElementById("passLengthInput");
    var list = document.getElementById("passResultsList");
    if (!btnGen || !slider || !lenInput) return;

    syncMustIncludeVisibility();

    wireSliderNumberPair(
      "passLengthSlider",
      "passLengthInput",
      PASS_LEN_MIN,
      PASS_LEN_MAX,
      generatePasswords
    );
    wireSliderNumberPair(
      "passPhraseWordsSlider",
      "passPhraseWordsInput",
      PHRASE_WORDS_MIN,
      PHRASE_WORDS_MAX,
      generatePasswords
    );

    bindPassTabs();

    var sepSel = document.getElementById("passPhraseSep");
    var sepCustom = document.getElementById("passPhraseSepCustom");
    var caseRadios = document.querySelectorAll('input[name="passPhraseCase"]');

    selectPassTab("random");

    for (var cr = 0; cr < caseRadios.length; cr++) {
      caseRadios[cr].addEventListener("change", refreshPhraseDisplayOnly);
    }

    if (sepSel) {
      sepSel.addEventListener("change", function () {
        syncPhraseSepCustomVisibility();
        updateEntropyDisplay();
        refreshPhraseDisplayOnly();
      });
    }

    if (sepCustom) {
      sepCustom.addEventListener("input", function () {
        updateEntropyDisplay();
        refreshPhraseDisplayOnly();
      });
    }

    var ids = [
      "passIncUpper",
      "passIncLower",
      "passIncNumbers",
      "passIncSymbols",
      "passNoAmbiguous",
      "passEdgesLetter",
    ];
    for (var k = 0; k < ids.length; k++) {
      var el = document.getElementById(ids[k]);
      if (el) {
        el.addEventListener("change", function () {
          updateStrengthUi();
          generatePasswords();
        });
      }
    }

    var mustEnCb = document.getElementById("passMustIncludeEnable");
    if (mustEnCb) {
      mustEnCb.addEventListener("change", function () {
        syncMustIncludeVisibility();
        updateStrengthUi();
        generatePasswords();
      });
    }

    var must = document.getElementById("passMustInclude");
    if (must) {
      must.addEventListener("input", function () {
        updateStrengthUi();
        generatePasswords();
      });
    }

    var batchSel = document.getElementById("passBatchSize");
    if (batchSel) {
      batchSel.addEventListener("change", generatePasswords);
    }

    btnGen.addEventListener("click", generatePasswords);

    if (list) {
      list.addEventListener("click", function (e) {
        var btn = e.target.closest(".convert-copy-btn");
        if (!btn || !list.contains(btn)) return;
        var row = btn.closest(".convert-result-inner");
        var field = row && row.querySelector(".convert-pass-output");
        copyFromField(field);
      });
    }

    generatePasswords();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
