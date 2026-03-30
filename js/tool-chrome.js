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

  function firstSentence(s) {
    var t = String(s || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    var m = t.match(/^(.+?。)/);
    if (m) return m[1];
    return t;
  }


  var TOOL_MARKETING_COPY = {
    counter: {
      subcopy: "文字数・単語数・行数をリアルタイムで自動カウント。無料・登録不要で今すぐ使えます。",
      recommend: ["記事・レポートの分量を素早く確認したい方", "SNS投稿の文字数制限を事前にチェックしたい方", "空白や改行を含めた細かな集計が必要な方"],
      faq: [
        { q: "単語数は日本語でも正確ですか？", a: "空白区切りの目安です。日本語はスペースが少ないため小さめに出ることがあります。" },
        { q: "入力テキストは送信されますか？", a: "いいえ。集計はブラウザ内で完結します。" },
        { q: "X の表示文字数と一致しますか？", a: "半角換算は目安です。URLや絵文字で差が出る場合があります。" }
      ]
    },
    password: {
      subcopy: "強いパスワードやパスフレーズを即生成。無料・登録不要で、ブラウザだけで安全に使えます。",
      recommend: ["使い回しを避けて強固なパスワードを作りたい方", "長さや文字種を細かく指定したい方", "生成結果をローカルで扱いたい方"],
      faq: [
        { q: "生成したパスワードは保存されますか？", a: "このツール側では保存しません。必要に応じて安全な場所へ保管してください。" },
        { q: "どの長さが推奨ですか？", a: "用途によりますが、長く複雑なほど推測されにくくなります。" },
        { q: "乱数は安全ですか？", a: "対応環境ではブラウザの暗号用乱数を使って生成します。" }
      ]
    },
    wareki: { subcopy: "西暦と和暦をすばやく相互変換。無料・登録不要で、改元年の確認にも便利です。", recommend: ["書類作成で和暦表記を確認したい方", "西暦↔和暦をミスなく変換したい方", "元号の範囲を手早く調べたい方"], faq: [ { q: "いつの時代まで対応していますか？", a: "大宝元年から令和までの範囲を扱います。" }, { q: "公的な証明として使えますか？", a: "表示は目安です。公文書用途では必ず公式情報をご確認ください。" }, { q: "データは外部送信されますか？", a: "いいえ。計算はブラウザ内で行います。" } ] },
    qr: { subcopy: "URL・テキストから高品質なQRコードを即作成。無料・登録不要でPNG保存まで完了。", recommend: ["チラシや資料にQRを載せたい方", "URLをスマホで読み取りやすく共有したい方", "誤り訂正レベルを調整したい方"], faq: [ { q: "作成したQRは保存できますか？", a: "はい。PNG画像として保存できます。" }, { q: "入力内容は送信されますか？", a: "いいえ。生成処理はブラウザ内のみです。" }, { q: "長いURLでも作れますか？", a: "可能ですが、内容が長いほどQRが複雑になります。" } ] },
    base64: { subcopy: "テキストのBase64変換をワンクリック。無料・登録不要でUnicode文字列にも対応。", recommend: ["API連携でBase64文字列を扱う方", "エンコード結果をすぐ確認したい方", "デコードして中身を検証したい方"], faq: [ { q: "日本語は文字化けしませんか？", a: "Unicode対応で変換しますが、入力形式によって差が出る場合があります。" }, { q: "改行入りのBase64も読めますか？", a: "多くは扱えますが、不要文字があると失敗します。" }, { q: "送信は発生しますか？", a: "いいえ。ブラウザ内で完結します。" } ] },
    urlCodec: { subcopy: "URLエンコード/デコードを即変換。無料・登録不要でクエリ作成を時短。", recommend: ["パラメータ付きURLを安全に作りたい方", "文字化けの原因を確認したい方", "エンコード済み文字列を復元したい方"], faq: [ { q: "どの変換方式ですか？", a: "encodeURIComponent/decodeURIComponent相当です。" }, { q: "スペースはどう変換されますか？", a: "%20として扱われます。" }, { q: "外部送信されますか？", a: "いいえ。ローカル処理のみです。" } ] },
    htmlEscape: { subcopy: "HTML特殊文字を安全にエスケープ/解除。無料・登録不要で貼り付け前チェックに最適。", recommend: ["HTMLにテキストを埋め込む開発者", "XSSリスクを避けたい方", "実体参照の確認を手早く行いたい方"], faq: [ { q: "タグはどうなりますか？", a: "エスケープ時は文字列として安全に表示されます。" }, { q: "解除は完全に元に戻りますか？", a: "対象文字は戻せますが、入力内容により差が出る場合があります。" }, { q: "入力内容は保存されますか？", a: "保存・送信は行いません。" } ] },
    jsonFormat: { subcopy: "読みにくいJSONを瞬時に整形。無料・登録不要でエラー箇所の確認もスムーズ。", recommend: ["APIレスポンスを見やすくしたい方", "JSONの構文エラーを確認したい方", "レビュー用に整形済みJSONを共有したい方"], faq: [ { q: "不正なJSONはどうなりますか？", a: "パースエラーとして表示します。" }, { q: "巨大なJSONにも使えますか？", a: "可能ですが、サイズが大きいとブラウザが重くなることがあります。" }, { q: "送信されますか？", a: "いいえ。ブラウザ内だけで処理します。" } ] },
    jsonMinify: { subcopy: "JSONを軽量な1行形式へ圧縮。無料・登録不要で転送・保存コストを削減。", recommend: ["設定ファイルをコンパクト化したい方", "通信量を少しでも抑えたい方", "整形JSONを配信用に最適化したい方"], faq: [ { q: "内容は変わりますか？", a: "データ構造はそのままで空白や改行のみ削減します。" }, { q: "コメント付きJSONは対応しますか？", a: "標準JSONを想定しています。" }, { q: "入力は外部へ送られますか？", a: "送られません。" } ] },
    uuidGen: { subcopy: "UUID v4をまとめて生成。無料・登録不要でID発行作業を一気に効率化。", recommend: ["テストデータ用にIDを大量発行したい方", "重複しにくい識別子が必要な方", "バックエンド実装前にID形式を確認したい方"], faq: [ { q: "生成方式は何ですか？", a: "ランダムなUUID v4を生成します。" }, { q: "重複は起きますか？", a: "理論上ゼロではありませんが、実運用では非常に低確率です。" }, { q: "ログインは必要ですか？", a: "不要です。" } ] },
    sha256: { subcopy: "文字列のSHA-256ハッシュを即計算。無料・登録不要で検証作業を高速化。", recommend: ["ファイルや文字列の整合性確認をしたい方", "API署名の検証前にハッシュを確認したい方", "暗号ハッシュの学習用途で試したい方"], faq: [ { q: "同じ入力なら同じ結果ですか？", a: "はい。常に同じハッシュ値になります。" }, { q: "元の文字列に戻せますか？", a: "いいえ。ハッシュは一方向です。" }, { q: "入力は送信されますか？", a: "いいえ。ブラウザ内で計算します。" } ] },
    caseConvert: { subcopy: "大文字・小文字・タイトルケースを一括変換。無料・登録不要で表記統一を時短。", recommend: ["見出しや識別子の表記を揃えたい方", "英字の変換を大量に行いたい方", "コピー前に体裁を整えたい方"], faq: [ { q: "日本語も変換されますか？", a: "主に英字の大小変換を対象にしています。" }, { q: "タイトルケースは完全ですか？", a: "一般的なルールで変換します。固有名詞は必要に応じて調整してください。" }, { q: "登録は必要ですか？", a: "不要です。" } ] },
    zenkaku: { subcopy: "全角/半角の揺れを一括変換。無料・登録不要で入力統一とデータ整形が簡単。", recommend: ["フォーム入力の表記揺れを揃えたい方", "CSVや台帳の整形をしたい方", "全角英数と半角英数を統一したい方"], faq: [ { q: "どの文字が対象ですか？", a: "主に英数字と一部記号が対象です。" }, { q: "漢字やかなは変換されますか？", a: "変換対象外です。" }, { q: "外部送信されますか？", a: "いいえ。" } ] },
    kataHira: { subcopy: "カタカナ↔ひらがなを即変換。無料・登録不要で表記ゆれチェックを効率化。", recommend: ["文章の読み表記を統一したい方", "SEOキーワードの表記揺れを調整したい方", "校正時にかな表記を揃えたい方"], faq: [ { q: "濁点や拗音も変換できますか？", a: "基本的なかな文字は変換可能です。" }, { q: "漢字は変換されますか？", a: "漢字は対象外です。" }, { q: "利用は無料ですか？", a: "はい。" } ] },
    lineSort: { subcopy: "単語リストを並べ替え＆重複削除。無料・登録不要でキーワード整理が一瞬。", recommend: ["タグやキーワードの重複を消したい方", "辞書順で一覧を整えたい方", "貼り付け前にリストをクリーンアップしたい方"], faq: [ { q: "区切りは何に対応しますか？", a: "空白や改行などで分割して処理できます。" }, { q: "大文字小文字は区別されますか？", a: "基本的に別文字として扱います。" }, { q: "送信はありますか？", a: "ありません。" } ] },
    textDiff: { subcopy: "2つの文章差分を行単位で可視化。無料・登録不要で変更点レビューが速い。", recommend: ["改訂前後の文章を比較したい方", "契約書・仕様書の差分確認をしたい方", "レビュー前に変更行を把握したい方"], faq: [ { q: "単語単位の比較ですか？", a: "このツールは行単位の比較です。" }, { q: "長文でも使えますか？", a: "使えますが、極端に長い場合は表示が重くなることがあります。" }, { q: "データは送信されますか？", a: "送信されません。" } ] },
    maruSuji: { subcopy: "丸数字を一覧から即コピー。無料・登録不要で資料作成の番号装飾を効率化。", recommend: ["手順書・資料の番号を見やすくしたい方", "SNS投稿で装飾文字を使いたい方", "丸数字をまとめて探したい方"], faq: [ { q: "対応フォントがないとどうなりますか？", a: "端末によって一部文字が表示されない場合があります。" }, { q: "クリックでコピーできますか？", a: "はい。ワンクリックでコピーできます。" }, { q: "無料ですか？", a: "はい。" } ] },
    regexTest: { subcopy: "正規表現のヒット箇所をその場で検証。無料・登録不要でパターン調整がはかどる。", recommend: ["複雑な正規表現の挙動を確認したい方", "抽出ルールを本番前に検証したい方", "フラグごとの差を比較したい方"], faq: [ { q: "対応エンジンは？", a: "JavaScriptのRegExp準拠です。" }, { q: "グローバル検索できますか？", a: "フラグ設定で可能です。" }, { q: "入力は保存されますか？", a: "保存しません。" } ] },
    ageCalc: { subcopy: "誕生日から年齢・経過日数を即計算。無料・登録不要で基準日指定にも対応。", recommend: ["満年齢を正確に確認したい方", "契約・申請前に年齢条件をチェックしたい方", "次の誕生日までの日数を把握したい方"], faq: [ { q: "基準日を変更できますか？", a: "はい。任意の日付を指定できます。" }, { q: "うるう年は考慮されますか？", a: "日付計算として考慮します。" }, { q: "入力は外部送信されますか？", a: "いいえ。" } ] },
    bmi: { subcopy: "身長と体重からBMIを即計算。無料・登録不要で体格の目安を手軽に確認。", recommend: ["健康管理でBMIを定期チェックしたい方", "ダイエット計画の参考値を見たい方", "検診前に体格指数を確認したい方"], faq: [ { q: "医療診断に使えますか？", a: "いいえ。あくまで目安としてご利用ください。" }, { q: "小数点も入力できますか？", a: "はい。" }, { q: "データは保存されますか？", a: "保存しません。" } ] },
    percentCalc: { subcopy: "割合・増減・逆算をすぐ計算。無料・登録不要で見積や分析の計算ミスを防止。", recommend: ["割引率や達成率を即計算したい方", "前月比・前年比を手早く出したい方", "パーセント逆算を頻繁に行う方"], faq: [ { q: "逆算にも対応していますか？", a: "はい。元値や割合の逆算ができます。" }, { q: "小数で計算できますか？", a: "可能です。" }, { q: "無料で使えますか？", a: "はい。" } ] },
    loanSim: { subcopy: "ローン返済額をその場でシミュレーション。無料・登録不要で資金計画を見える化。", recommend: ["住宅・自動車ローンの目安を知りたい方", "借入条件を比較したい方", "月々返済のイメージを掴みたい方"], faq: [ { q: "実際の返済額と同じですか？", a: "金融機関条件により異なるため目安としてご利用ください。" }, { q: "ボーナス返済は含められますか？", a: "このシミュレーターは基本条件での概算です。" }, { q: "入力値は送信されますか？", a: "いいえ。" } ] },
    taxJp: { subcopy: "税込・税抜を瞬時に相互計算。無料・登録不要で見積作成をスピードアップ。", recommend: ["見積書・請求書を作成する方", "10%/8%の税率計算を使い分けたい方", "価格表示の確認を効率化したい方"], faq: [ { q: "軽減税率に対応していますか？", a: "8%と10%の切替に対応しています。" }, { q: "端数処理はどうなりますか？", a: "表示上の丸め方は入力条件により調整してください。" }, { q: "無料ですか？", a: "はい。" } ] },
    radixConv: { subcopy: "2〜36進数を相互変換。無料・登録不要で基数変換の検算を手軽に。", recommend: ["2進/16進変換を日常的に使う方", "プログラム実装前に値を検証したい方", "情報系学習で基数変換を練習したい方"], faq: [ { q: "負の数は扱えますか？", a: "入力条件によっては対応範囲外の場合があります。" }, { q: "小数は変換できますか？", a: "このツールは整数変換を想定しています。" }, { q: "送信はありますか？", a: "ありません。" } ] },
    colorConv: { subcopy: "HEX/RGB/HSLをすばやく相互確認。無料・登録不要でデザイン実務を効率化。", recommend: ["デザイン指定の色コードを変換したい方", "CSS入力用にRGB/HSLを確認したい方", "色見本を素早く検証したい方"], faq: [ { q: "短縮HEXにも対応しますか？", a: "入力形式により展開して扱います。" }, { q: "透明度は扱えますか？", a: "主に基本色コード変換を対象にしています。" }, { q: "無料ですか？", a: "はい。" } ] },
    contrast: { subcopy: "2色のコントラスト比を即判定。無料・登録不要でWCAGチェックを簡単に。", recommend: ["UIの可読性を改善したい方", "アクセシビリティ基準を確認したい方", "色選定の根拠を持ちたい方"], faq: [ { q: "AA/AAAの判定ができますか？", a: "はい。WCAG基準の目安を表示します。" }, { q: "背景と文字色の組み合わせ確認に使えますか？", a: "はい。2色を指定して比率を確認できます。" }, { q: "データ送信はありますか？", a: "ありません。" } ] },
    gradientCss: { subcopy: "CSSグラデーションコードを即生成。無料・登録不要で実装コピペまで最短。", recommend: ["背景グラデを素早く作りたい方", "角度や色停止位置を試したい方", "生成したCSSをそのまま貼り付けたい方"], faq: [ { q: "生成コードはそのまま使えますか？", a: "多くのケースでそのまま利用できます。" }, { q: "複数色に対応しますか？", a: "基本構成を中心に、必要に応じて手編集してください。" }, { q: "無料利用できますか？", a: "はい。" } ] },
    lorem: { subcopy: "日本語・英語のダミー文章を即生成。無料・登録不要でレイアウト確認がはかどる。", recommend: ["UIモックで仮テキストが必要な方", "提案資料の体裁確認をしたい方", "本文量の見え方を先に検証したい方"], faq: [ { q: "商用案件でも使えますか？", a: "一般的なダミーテキスト用途としてご利用いただけます。" }, { q: "文章量を調整できますか？", a: "必要量に応じて生成し直してご利用ください。" }, { q: "外部送信されますか？", a: "いいえ。" } ] },
    stopwatch: { subcopy: "ラップ付きストップウォッチをブラウザで即利用。無料・登録不要で作業計測に便利。", recommend: ["作業時間を可視化したい方", "運動や学習の計測をしたい方", "ラップを取りながら進捗管理したい方"], faq: [ { q: "バックグラウンドでも動きますか？", a: "端末状態により更新が遅れる場合があります。" }, { q: "ラップは記録できますか？", a: "はい。" }, { q: "登録は必要ですか？", a: "不要です。" } ] },
    pomodoro: { subcopy: "集中作業向けカウントダウンを即開始。無料・登録不要でポモドーロ運用を簡単に。", recommend: ["25分集中など時間管理を習慣化したい方", "学習・作業を短い単位で回したい方", "ブラウザで軽くタイマーを使いたい方"], faq: [ { q: "時間は自由に設定できますか？", a: "はい。分・秒を指定できます。" }, { q: "前回設定は残りますか？", a: "端末に保存され、再訪時に復元される場合があります。" }, { q: "通知はありますか？", a: "終了時に画面上で知らせます。" } ] },
    countdown: { subcopy: "目標日時までの残り時間をリアルタイム表示。無料・登録不要で締切管理を見える化。", recommend: ["イベントや試験日までの残りを把握したい方", "プロジェクト締切を常に意識したい方", "カウントダウンを共有表示したい方"], faq: [ { q: "タイムゾーンの影響はありますか？", a: "端末の日時設定に基づいて計算します。" }, { q: "過去日時を入れるとどうなりますか？", a: "経過した状態として表示されます。" }, { q: "無料ですか？", a: "はい。" } ] },
    csvView: { subcopy: "CSVを即テーブル表示。無料・登録不要で中身確認と一次チェックを高速化。", recommend: ["CSVの中身をすぐ目視確認したい方", "列ズレを事前に見つけたい方", "軽量ビューアとして使いたい方"], faq: [ { q: "複雑なCSV仕様に対応しますか？", a: "簡易ビューアのため複雑ケースは専用ツールをご利用ください。" }, { q: "大量行でも使えますか？", a: "可能ですが、件数が多いと表示が重くなることがあります。" }, { q: "データは送信されますか？", a: "送信されません。" } ] },
    jwtDecode: { subcopy: "JWTのヘッダー/ペイロードを即デコード。無料・登録不要でトークン確認を時短。", recommend: ["JWTの中身をデバッグしたい方", "認証実装の検証をしたい方", "期限やクレームをすぐ確認したい方"], faq: [ { q: "署名検証もできますか？", a: "このツールは主にデコード表示用です。" }, { q: "機密トークンを入れても大丈夫ですか？", a: "ブラウザ内処理ですが、取り扱いには十分ご注意ください。" }, { q: "無料で使えますか？", a: "はい。" } ] },
    uaParse: { subcopy: "User-Agent文字列を読みやすく確認。無料・登録不要で環境調査をスピード化。", recommend: ["サポート対応で端末情報を把握したい方", "ブラウザ判定ロジックを確認したい方", "UA文字列を手軽に検証したい方"], faq: [ { q: "現在のUAを自動取得できますか？", a: "はい。現在のブラウザ情報を表示できます。" }, { q: "任意文字列も解析できますか？", a: "入力して確認できます。" }, { q: "外部送信されますか？", a: "いいえ。" } ] },
    dpiCalc: { subcopy: "解像度と画面サイズからDPIを即算出。無料・登録不要で表示密度の比較に便利。", recommend: ["ディスプレイ比較をしたい方", "UIスケール設計の参考値が欲しい方", "端末仕様を数値で確認したい方"], faq: [ { q: "DPIとPPIは同じですか？", a: "文脈により使い分けますが、ここでは画面密度の目安として扱います。" }, { q: "正確な実測値ですか？", a: "入力値ベースの計算結果です。" }, { q: "無料利用できますか？", a: "はい。" } ] },
    aspectRatio: { subcopy: "幅と高さからアスペクト比を自動簡約。無料・登録不要で映像・画像制作を効率化。", recommend: ["動画・画像サイズの比率を確認したい方", "デザインカンプの比率を揃えたい方", "最大公約数で比を簡約したい方"], faq: [ { q: "4Kサイズでも使えますか？", a: "はい。整数入力であれば計算できます。" }, { q: "小数は扱えますか？", a: "基本は整数比の簡約を想定しています。" }, { q: "データ送信はありますか？", a: "ありません。" } ] },
    diceRoll: { subcopy: "サイコロを複数同時にロール。無料・登録不要でゲームや抽選の即席乱数に。", recommend: ["TRPGやボードゲームで使いたい方", "ランダムな数決めを手早く行いたい方", "物理ダイスが手元にない方"], faq: [ { q: "何個まで振れますか？", a: "UIで指定できる範囲で複数同時に振れます。" }, { q: "履歴は残りますか？", a: "表示中に確認できる仕様です。" }, { q: "無料ですか？", a: "はい。" } ] },
    randomPick: { subcopy: "候補リストから公平に1件抽選。無料・登録不要で意思決定をすばやく。", recommend: ["ランチや順番をランダムに決めたい方", "候補から1つだけ選びたい方", "CSV候補を使って抽選したい方"], faq: [ { q: "同じ候補が複数あると？", a: "その分だけ当たりやすくなります。" }, { q: "重複なし抽選はできますか？", a: "重複なしが必要ならビンゴ抽選ツールをご利用ください。" }, { q: "入力は送信されますか？", a: "いいえ。" } ] },
    bingo: { subcopy: "重複なしで1つずつ抽選。無料・登録不要でビンゴや抽選会の進行をスムーズに。", recommend: ["イベントで公平に番号抽選したい方", "一度出た候補を除外して引きたい方", "1〜75など範囲指定で抽選したい方"], faq: [ { q: "同じ番号は再度出ますか？", a: "出ません。重複なしで抽選します。" }, { q: "途中で候補を変更できますか？", a: "履歴がある間は整合性のため変更不可です。" }, { q: "無料で使えますか？", a: "はい。" } ] },
    nanoid: { subcopy: "短く扱いやすいランダムIDを即生成。無料・登録不要でトークン作成を高速化。", recommend: ["URLに載せる短いIDが欲しい方", "開発中の仮IDを大量に作りたい方", "UUIDより短い識別子を使いたい方"], faq: [ { q: "文字種は何ですか？", a: "URLセーフな文字セット中心で生成します。" }, { q: "長さは調整できますか？", a: "指定可能な範囲で調整できます。" }, { q: "送信はありますか？", a: "ありません。" } ] },
    subnet: { subcopy: "IPv4サブネット情報を即計算。無料・登録不要でネットワーク設計の確認を時短。", recommend: ["CIDRから利用可能範囲を確認したい方", "ネットワーク/ブロードキャストを検算したい方", "学習用途でサブネット計算を試したい方"], faq: [ { q: "IPv6に対応していますか？", a: "このツールはIPv4計算が中心です。" }, { q: "ホスト数も表示されますか？", a: "はい、目安を表示します。" }, { q: "入力値は送信されますか？", a: "いいえ。" } ] },
    htmlEntity: { subcopy: "HTMLエンティティを即デコード。無料・登録不要で文字参照の確認を簡単に。", recommend: ["&amp; などの実体参照を元文字に戻したい方", "文字化け調査をしたい方", "コピペ前に表記を整えたい方"], faq: [ { q: "数値文字参照にも対応しますか？", a: "一般的な形式を対象にしています。" }, { q: "逆変換はできますか？", a: "主にデコード用途です。必要に応じてエスケープツールを併用してください。" }, { q: "無料で使えますか？", a: "はい。" } ] },
    romanNum: { subcopy: "整数をローマ数字へ即変換。無料・登録不要で資料作成の表記調整を手軽に。", recommend: ["章番号をローマ数字で表記したい方", "教育用途でローマ数字変換を確認したい方", "ドキュメントの見出し体裁を整えたい方"], faq: [ { q: "対応範囲は？", a: "一般的な範囲（1〜3999）を想定しています。" }, { q: "0や負数は変換できますか？", a: "ローマ数字の仕様上、対象外です。" }, { q: "入力は送信されますか？", a: "いいえ。" } ] },
    unitLength: { subcopy: "m・cm・inch・ftなど長さ単位を即換算。無料・登録不要で現場計算を効率化。", recommend: ["海外仕様と国内仕様を行き来する方", "設計・DIYで単位変換が多い方", "換算ミスを減らしたい方"], faq: [ { q: "どの単位に対応しますか？", a: "主要なメートル法・ヤードポンド法に対応します。" }, { q: "小数入力できますか？", a: "はい。" }, { q: "無料利用できますか？", a: "はい。" } ] },
    fuelEconomy: { subcopy: "km/LとL/100kmを即変換。無料・登録不要で車の燃費比較をわかりやすく。", recommend: ["海外と国内で燃費表記を比較したい方", "車種検討で燃費を同条件で見たい方", "試算値をすぐ換算したい方"], faq: [ { q: "mpgにも対応しますか？", a: "このツールはkm/LとL/100kmの相互変換が中心です。" }, { q: "四捨五入はどうなりますか？", a: "表示桁数に応じて丸められます。" }, { q: "入力値は送信されますか？", a: "いいえ。" } ] }
  };

  function buildSubcopy(id, meta) {
    if (meta && meta.subcopy) return meta.subcopy;
    var m = TOOL_MARKETING_COPY[id];
    if (m && m.subcopy) return m.subcopy;
    var short = String((meta && meta.short) || "").trim();
    if (short) return "無料・登録不要。" + short.replace(/。+$/g, "") + "。";
    return "無料・登録不要で使える " + ((meta && meta.title) || id) + " ツールです。";
  }

  function buildRecommend(id, meta) {
    var m = TOOL_MARKETING_COPY[id];
    if (m && Array.isArray(m.recommend) && m.recommend.length >= 3) {
      return m.recommend;
    }
    var title = (meta && meta.title) || id;
    return [
      title + "をすぐ使いたい方",
      title + "を無料で試したい方",
      title + "を登録なしで使いたい方",
    ];
  }

  function buildFaq(id, meta) {
    var m = TOOL_MARKETING_COPY[id];
    if (m && Array.isArray(m.faq) && m.faq.length >= 3) {
      return m.faq;
    }
    var title = (meta && meta.title) || id;
    return [
      { q: title + "は無料で使えますか？", a: "はい。無料です。" },
      { q: title + "は登録が必要ですか？", a: "いいえ。登録不要です。" },
      { q: title + "のデータは送信されますか？", a: "ブラウザ内で処理される設計です。" },
    ];
  }

  function renderAutoSupplement(chrome, id, meta) {
    if (chrome.querySelector(".tool-supplement")) return;

    var article = document.createElement("article");
    article.className = "tool-supplement";
    article.setAttribute("aria-label", "このツールについて");
    var canDo = firstSentence(meta.medium) || meta.short || (meta.title + "をブラウザ上ですぐに使えます。");
    var rec = buildRecommend(id, meta);
    var faq = buildFaq(id, meta);

    var recHtml =
      "<li>" + String(rec[0] || "").trim() + "</li>" +
      "<li>" + String(rec[1] || "").trim() + "</li>" +
      "<li>" + String(rec[2] || "").trim() + "</li>";

    var faqHtml = "";
    for (var i = 0; i < Math.min(3, faq.length); i++) {
      faqHtml +=
        "<dt>" + faq[i].q + "</dt>" +
        "<dd>" + faq[i].a + "</dd>";
    }

    article.innerHTML =
      '<section class="tool-supplement-section">' +
      '<h2 class="tool-supplement-h2">このツールでできること</h2>' +
      '<ul class="tool-supplement-list">' +
      "<li>" + canDo + "</li>" +
      "<li>無料・登録不要で、インストールなしですぐ使えます。</li>" +
      "<li>入力や計算はブラウザ内で完結し、手軽に利用できます。</li>" +
      "</ul></section>" +
      '<section class="tool-supplement-section">' +
      '<h2 class="tool-supplement-h2">使い方</h2>' +
      '<ol class="tool-supplement-ol">' +
      "<li>入力欄や設定項目に内容を入れます。</li>" +
      "<li>結果の表示を確認します。</li>" +
      "<li>必要に応じてコピーして活用します。</li>" +
      "</ol></section>" +
      '<section class="tool-supplement-section">' +
      '<h2 class="tool-supplement-h2">こんな人におすすめ</h2>' +
      '<ul class="tool-supplement-list">' +
      recHtml +
      "</ul></section>" +
      '<section class="tool-supplement-section">' +
      '<h2 class="tool-supplement-h2">よくある質問</h2>' +
      '<dl class="tool-supplement-faq">' +
      faqHtml +
      "</dl></section>";
    chrome.appendChild(article);

    var rel = document.createElement("section");
    rel.className = "tool-related";
    rel.setAttribute("aria-labelledby", "tool-related-heading");
    rel.innerHTML =
      '<h2 id="tool-related-heading" class="tool-related-title">類似ツール</h2>' +
      '<div class="tool-related-grid"></div>';
    chrome.appendChild(rel);

    var grid = rel.querySelector(".tool-related-grid");
    var reg = getRegistry();
    var catMap = window.TOOL_CATEGORY_MAP || {};
    var cat = catMap[id];
    if (!cat) {
      rel.hidden = true;
      return;
    }
    var others = Object.keys(catMap).filter(function (toolId) {
      return toolId !== id && catMap[toolId] === cat;
    });
    var regKeys = others.filter(function (toolId) {
      return reg[toolId] && reg[toolId].href;
    });
    if (regKeys.length === 0) {
      rel.hidden = true;
      return;
    }
    shuffleInPlace(regKeys);
    var pick = regKeys.slice(0, Math.min(2, regKeys.length));
    pick.forEach(function (toolId) {
      var toolMeta = reg[toolId];
      var a = document.createElement("a");
      a.href = toolHref(toolMeta.href);
      a.className = "tool-card";
      appendToolCardBody(a, toolMeta);
      grid.appendChild(a);
    });
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
    } else {
      var autoSub = document.createElement("p");
      autoSub.className = "tool-subcopy";
      autoSub.textContent = buildSubcopy(id, meta);
      chrome.insertBefore(autoSub, panel);
    }
    if (lead) chrome.insertBefore(lead, panel);

    var titleEl = toolbar.querySelector(".tool-toolbar-title");
    titleEl.textContent = meta.title;
    if (meta.documentTitle) {
      document.title = meta.documentTitle;
    } else {
      document.title = meta.title + " 無料ツール｜登録不要で今すぐ使える";
    }

    var favBtn = toolbar.querySelector('[data-action="favorite"]');
    if (getFavorites().indexOf(id) >= 0) {
      favBtn.classList.add("is-favorited");
      favBtn.setAttribute("aria-label", "お気に入りを解除");
    }

    ensureModalLayer();
    renderAutoSupplement(chrome, id, meta);

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
