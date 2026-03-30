/**
 * ツール一覧（トップ・ツールバー・お気に入りの単一ソース）。
 * 各エントリの説明: short＝トップのカード、medium＝ツールページのリード、long＝詳細モーダル。
 * searchExtra（任意）: トップの絞り込み検索用のみ。タイトルに無い表記（ひらがな読み・英語など）を空白区切りで。
 * 追加手順: エントリ追加 → TOOL_HOME_ORDER に id → TOOL_CATEGORY_MAP にカテゴリ → カテゴリ名/ツール名/index.html で data-tool-id を同じ id に。
 */
(function () {
  var ICON_COUNTER =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>';
  var ICON_PASSWORD =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var ICON_WAREKI =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  var ICON_QR =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/></svg>';
  var ICON_CODE =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
  var ICON_CONVERT =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13"/><polyline points="15 6 17 8 15 10"/><path d="M20 16H7"/><polyline points="9 14 7 16 9 18"/></svg>';
  var ICON_TEXT =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
  var ICON_MARUSUJI =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>' +
    '<text x="12" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor" font-family="\'Noto Sans JP\', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial">1</text>' +
    "</svg>";
  var ICON_CALC =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>';
  var ICON_CLOCK =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  var ICON_TIMER =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10 2h4"/>' +
    '<path d="M12 14v-4"/>' +
    '<path d="M19 6l-1.5 1.5"/>' +
    '<circle cx="12" cy="14" r="8"/>' +
    "</svg>";
  var ICON_COLOR =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14 14 0 0 0 0 20"/></svg>';
  var ICON_HASH =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>';
  var ICON_LIST =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
  var ICON_BINGO =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  var ICON_DICE =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/></svg>';
  var ICON_DEV =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/></svg>';

  window.TOOL_REGISTRY = {
    counter: {
      iconSvg: ICON_COUNTER,
      title: "文字数カウント",
      searchExtra: "もじすうかうんと もじ moji character count",
      short: "文字数・行数・原稿用紙・X 換算を一覧。長文は投稿分割も可。",
      medium:
        "入力した文章の文字数・行数・原稿用紙換算、X（ポスト）用の半角換算（全角＝2）をまとめて表示します。半角換算が 280 を超えると投稿単位に分割してコピーできます。処理はすべてブラウザ内で完結します。",
      long:
        "文章を入力または貼り付けると、文字数や行数などをその場で集計して一覧表示します。\n\n" +
        "【基本の使い方】\n" +
        "1) 入力欄に文章を貼り付け\n" +
        "2) 右側のレポート（一覧）で数値を確認\n" +
        "3) 必要なら「投稿に分割」からコピー\n\n" +
        "【表示項目】\n" +
        "・文字数: 空白を含める/含めないを切替できます（改行は文字数に含めません）\n" +
        "・行数: 空行を含める/含めないを切替できます\n" +
        "・原稿用紙換算: 20字×20行の目安で枚数を計算します\n" +
        "・X（ポスト）用の半角換算: 全角=2、半角=1 として概算します\n\n" +
        "【投稿に分割（X など）】\n" +
        "半角換算が 280 を超えると「投稿に分割」が表示されます。\n" +
        "・各投稿ごとにコピーできます\n" +
        "・分割は半角換算を基準に行います（改行は分割の区切りにしません）\n\n" +
        "【注意】\n" +
        "・半角換算は「投稿可能文字数」を厳密に再現するものではなく、あくまで目安です（URL 等の扱いはサービス側仕様に依存します）。\n\n" +
        "【プライバシー】\n" +
        "処理はすべてお使いのブラウザ内で行われ、テキストがサーバーに送られることはありません。",
      href: "text/counter/",
    },
    password: {
      iconSvg: ICON_PASSWORD,
      title: "パスワード生成",
      searchExtra: "ぱすわーど password generator パスフレーズ ランダム",
      short: "ランダム文字列・パスフレーズ（英単語）で生成。エントロピー表示付き。",
      medium:
        "文字種や長さを指定したランダム文字列、または EFF の短い英単語リストによるパスフレーズが生成できます。推定エントロピーと強度も表示し、1〜8 件を同時生成できます。乱数はブラウザ内だけで完結し、サーバーに送信されません。",
      long:
        "「ランダム文字列」では文字数スライダーと条件（大文字・小文字・数字・記号・紛らわしい文字除外・先頭末尾を英字にするなど）を指定し、「任意の単語を含む」をオンにすると「含める単語」をそのまま連続で含められます。「パスフレーズ」では EFF の短い英単語リスト（1296語）から単語をつなぎます。いずれも推定エントロピー（理論上の目安・ビット）を表示し、弱・中・強の表示も同じ推定値と共通のビット閾値で判定します。1〜8件を同時生成して行ごとにコピーできます。\n\n" +
        "【セキュリティについて】\n" +
        "乱数には可能な環境でブラウザの暗号用乱数（crypto.getRandomValues）を使います。エントロピー表示は簡略化した計算であり、実際の攻撃耐性を保証するものではありません。最高水準の用途にはパスワードマネージャー等の利用もご検討ください。\n\n" +
        "【プライバシー】\n" +
        "生成結果はサーバーに送信されません。",
      href: "security/password/",
    },
    wareki: {
      iconSvg: ICON_WAREKI,
      title: "西暦↔和暦変換",
      searchExtra: "せいれき われき げんごう 元号 グレゴリオ gengo",
      short: "西暦と和暦（大宝〜令和）を相互変換。",
      medium:
        "西暦（グレゴリオ暦）と日本の元号表記の相互変換をブラウザ上で行います。対応は大宝元年（701年5月7日）から令和まで。元号データは Harumi（春海）等のオープンデータに基づきますが、公文書・契約の公式基準とは限りません。",
      long:
        "西暦（グレゴリオ暦）と日本の元号表記（大宝〜令和）を相互に変換します。\n\n" +
        "【基本の使い方】\n" +
        "・西暦→和暦: 西暦の日付を選ぶと、和暦（元号・年・曜日）を表示します\n" +
        "・和暦→西暦: 元号を選び、年/月/日を入力すると、西暦の日付と曜日を表示します\n" +
        "  ※元年は「年」に 1 を入力してください\n\n" +
        "【対応範囲】\n" +
        "大宝元年（701年5月7日）から令和までです。それより前の日付は変換しません。\n" +
        "ドロップダウン内の「江戸時代」などの区分は、探しやすくするための目安です。\n\n" +
        "【注意（免責）】\n" +
        "・改元日は旧暦に基づくため、対照表の版や史料によって差が出る場合があります。\n" +
        "・公文書/契約/裁判/研究の根拠となる公式基準を保証するものではありません。表示は目安としてご利用ください。\n\n" +
        "【元号データの出典】\n" +
        "元号の開始日・終了日（グレゴリオ暦）は、オープンデータ「Harumi（春海）」の対照表（gengo_periods.json）に基づいています。\n" +
        "・公開元: Code for History（GitHub）\n" +
        "・ライセンス: MIT License\n" +
        "・参照先: https://github.com/code4history/Harumi\n\n" +
        "【プライバシー】\n" +
        "日付の計算はすべてお使いのブラウザ内で行われ、入力内容がサーバーに送られることはありません。",
      href: "datetime/wareki/",
    },
    qr: {
      iconSvg: ICON_QR,
      title: "QRコード作成",
      searchExtra: "きゅーあーる qr code 二次元 バーコード",
      short: "テキストや URL から QR を表示・PNG 保存。",
      medium:
        "入力内容から QR コードを生成し、プレビューと PNG 保存ができます。サイズ・誤り訂正を選べます。入力はブラウザ内だけで処理され、サーバーに送信されません。",
      long:
        "内容を入力すると QR コードをプレビューし、PNG 画像として保存できます。\n\n" +
        "【オプション】\n" +
        "・サイズ: ピクセル単位の表示・保存サイズ（200〜400）\n" +
        "・誤り訂正: 高いほど汚れに強いが、同じサイズで扱えるデータ量の上限が下がります（一般的には「中」で十分です）\n\n" +
        "【ライブラリ】\n" +
        "QR 生成に npm パッケージ「qrcode」（MIT）をブラウザ用にバンドルしたものを同サイトから読み込んでいます。\n\n" +
        "【プライバシー】\n" +
        "入力内容はサーバーに送信されません。オフラインでもページとバンドルが読めれば利用できます。",
      href: "design/qr/",
    },
    base64: {
      iconSvg: ICON_CODE,
      title: "Base64 エンコード／デコード",
      searchExtra: "べーすろくじゅうよん base64 encode decode",
      short: "テキストと Base64 を相互変換（Unicode 対応）。",
      medium:
        "テキストを Base64 にエンコードし、逆に Base64 文字列をテキストに戻します。Unicode に対応。広告なし、処理はブラウザ内のみでサーバーに送信されません。",
      long:
        "入力したテキストを Base64 にエンコードしたり、Base64 文字列をテキストに戻します。\n\n【プライバシー】\n処理はすべてブラウザ内で行われ、内容がサーバーに送られることはありません。",
      href: "encode/base64/",
    },
    urlCodec: {
      iconSvg: ICON_CODE,
      title: "URL エンコード／デコード",
      searchExtra: "ゆーあーるえる percent encodeURIComponent decodeURIComponent",
      short: "URL 用のエンコード／デコード（encodeURIComponent 相当）。",
      medium:
        "encodeURIComponent／decodeURIComponent 相当の変換を行います。クエリやパスに渡す文字列のエスケープ・復元に利用できます。処理はブラウザ内のみです。",
      long:
        "テキストを URL 用にエンコードしたり、エンコード済み文字列を元に戻します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "encode/url-codec/",
    },
    htmlEscape: {
      iconSvg: ICON_CODE,
      title: "HTML エスケープ／解除",
      searchExtra: "えすけーぷ escape unescape タグ",
      short: "HTML 特殊文字のエスケープと簡易的な解除。",
      medium:
        "テキストを HTML に安全に埋め込むためのエスケープ、およびエスケープ済み文字列の復元を行います。処理はブラウザ内のみです。",
      long:
        "テキストを HTML に安全に埋め込むためのエスケープ、およびエスケープされた文字列の復元を行います。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "encode/html-escape/",
    },
    jsonFormat: {
      iconSvg: ICON_CODE,
      title: "JSON 整形",
      searchExtra: "じぇいそん pretty print フォーマット validate",
      short: "JSON を検証し、整形して表示。",
      medium:
        "JSON 文字列をパースしてインデント付きで読みやすく表示します。不正な JSON の場合はエラーメッセージを返します。処理はブラウザ内のみです。",
      long:
        "JSON 文字列をパースし、読みやすい形式で表示します。不正な JSON の場合はエラーメッセージを表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "encode/json-format/",
    },
    jsonMinify: {
      iconSvg: ICON_CODE,
      title: "JSON 圧縮（minify）",
      searchExtra: "じぇいそん minify 圧縮 1行",
      short: "JSON を空白のない 1 行に圧縮。",
      medium:
        "JSON をパースしてから改めて文字列化し、不要な空白を除いた形式にします。処理はブラウザ内のみです。",
      long:
        "JSON をパースしてから改めて文字列化し、不要な空白を除いた形式にします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "encode/json-minify/",
    },
    uuidGen: {
      iconSvg: ICON_HASH,
      title: "UUID 生成",
      searchExtra: "ゆうゆーあいでぃー guid v4 識別子",
      short: "UUID v4 を複数件まとめて生成。",
      medium:
        "ランダムな UUID（v4）を指定件数生成します。crypto.randomUUID または同等の乱数源を使用します。生成はブラウザ内のみです。",
      long:
        "ランダムな UUID（v4）を指定件数生成します。crypto.randomUUID または同等の乱数で生成します。\n\n【プライバシー】\n生成はブラウザ内のみです。",
      href: "security/uuid-gen/",
    },
    sha256: {
      iconSvg: ICON_HASH,
      title: "SHA-256 ハッシュ",
      searchExtra: "しゃはっしゅ sha256 hash ダイジェスト",
      short: "文字列の SHA-256（16 進）を表示。",
      medium:
        "入力テキストの SHA-256 を Web Crypto API で計算し、16 進文字列で表示します。計算はブラウザ内のみです。",
      long:
        "入力テキストの SHA-256 ハッシュを Web Crypto API で計算します。\n\n【プライバシー】\n計算はブラウザ内のみです。",
      href: "security/sha256/",
    },
    caseConvert: {
      iconSvg: ICON_CONVERT,
      title: "大文字／小文字変換",
      searchExtra: "おおもじ こもじ upper lower title case",
      short: "英字の大文字・小文字・タイトルケースなどに変換。",
      medium:
        "選択したモードに応じて英字の大文字・小文字を一括変換します。処理はブラウザ内のみです。",
      long:
        "英字の大文字/小文字をまとめて変換します。文章の見た目を揃えたいときや、識別子の正規化に便利です。\n\n" +
        "【基本の使い方】\n" +
        "1) 変換したいテキストを貼り付け\n" +
        "2) 変換モードを選択\n" +
        "3) 結果をコピー\n\n" +
        "【変換モードの例】\n" +
        "・UPPER: すべて大文字（例: hello → HELLO）\n" +
        "・lower: すべて小文字（例: Hello → hello）\n" +
        "・Title Case: 単語の先頭だけ大文字（見出し用）\n\n" +
        "【注意】\n" +
        "・言語/ロケールによっては大小変換の規則が複雑です（例: トルコ語 i/I）。本ツールは一般的な変換の目安としてご利用ください。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "text/case-convert/",
    },
    lineSort: {
      iconSvg: ICON_LIST,
      title: "単語の並べ替え・重複除去",
      searchExtra: "ぎょう そーと じゅうふく 重複 unique sort",
      short: "単語をソート、重複除去、空白トリム。",
      medium:
        "区切り（空白・改行など）で分割した単語を並べ替えたり、重複を除いたり、前後の空白をトリムできます。処理はブラウザ内のみです。",
      long:
        "単語や行のリストを「並べ替え」「重複除去」「前後空白の整理」などで整形します。タグ一覧やキーワードの掃除に便利です。\n\n" +
        "【基本の使い方】\n" +
        "1) 入力欄に単語/行を貼り付け\n" +
        "2) 区切り（改行・空白など）を選択\n" +
        "3) 並べ替え/重複除去などの操作を実行\n" +
        "4) 出力をコピー\n\n" +
        "【できること（代表例）】\n" +
        "・昇順/降順でソート\n" +
        "・重複を除去（同じ単語を 1 つに）\n" +
        "・各要素の前後の空白をトリム\n\n" +
        "【注意】\n" +
        "・大文字/小文字の扱い、全角/半角の違いは「別の文字」として扱われます。必要に応じて他の変換ツールと組み合わせてください。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "text/line-sort/",
    },
    textDiff: {
      iconSvg: ICON_LIST,
      title: "テキスト差分（行）",
      searchExtra: "さぶん diff 比較 compare",
      short: "2 つのテキストを行単位で簡易比較。",
      medium:
        "2 つのテキストを行ごとに比較し、簡易的な差分表示を行います。処理はブラウザ内のみです。",
      long:
        "2 つのテキスト（改訂前／改訂後）を行単位で比較し、Unified（git diff 風）の形式で差分を表示します。文章の追記・削除で行番号がずれても、できるだけ対応する行を見つけて比較します。\n\n" +
        "【基本の使い方】\n" +
        "1) 左の「テキスト A（元）」に改訂前、右の「テキスト B（改訂）」に改訂後を貼り付け\n" +
        "2) 「比較」を押す\n" +
        "3) 結果の `+`（追加）/ `-`（削除）/ 空白（同一）を見て確認\n\n" +
        "【表示の読み方（Unified）】\n" +
        "・`+ 行` : B に追加された行（A には無い）\n" +
        "・`- 行` : A から削除された行（B には無い）\n" +
        "・`  行` : A と B で同じ行\n\n" +
        "【オプション】\n" +
        "・前後の空白を無視（trim）: 行の先頭・末尾の空白だけが違う場合は同一として扱いやすくします。\n" +
        "・連続空白を正規化: 全角スペースを半角に寄せ、連続する空白/タブを 1 つにします（見た目の体裁だけの差を減らします）。\n" +
        "・空行を無視: 空行の増減を差分から除外します（段落の体裁調整で差分が増えすぎるのを防ぎます）。\n" +
        "・コンテキスト: 差分ブロック（変更箇所）の前後に、変更なし行を何行表示するかを指定します。0 にすると変更行のみを表示します。\n\n" +
        "【便利機能】\n" +
        "・前の差分／次の差分: 変更箇所（差分ブロック）へ順番に移動します。\n" +
        "・変更なし部分の折りたたみ: 長文でも変更箇所だけ追いやすくするため、変更のない範囲を省略表示し、必要なところだけ展開できます。\n" +
        "・差分をコピー: 表示中の差分（差分ブロック中心）を Unified 形式でコピーします。\n" +
        "・diff.txt: 差分をテキストファイルとして保存します。\n\n" +
        "【注意】\n" +
        "・比較は「行単位」です。1 行の中の文字レベル（単語単位など）の差分は表示しません。\n" +
        "・改行コード（LF/CRLF）や空白の違いが差分として出ることがあります。見た目だけの差を減らしたい場合はオプションをご利用ください。\n" +
        "・非常に長い文章（数千行など）では、端末性能により処理やスクロールが重くなる場合があります。\n\n" +
        "【プライバシー】\n" +
        "処理はすべてお使いのブラウザ内で行われ、テキストがサーバーに送られることはありません。",
      href: "text/text-diff/",
    },
    regexTest: {
      iconSvg: ICON_DEV,
      title: "正規表現テスト",
      searchExtra: "せいきひょうげん regexp れじぇっくす pattern",
      short: "JavaScript の RegExp でマッチ位置を確認。",
      medium:
        "正規表現パターンとフラグを指定し、テキスト内の一致を確認します。処理はブラウザ内のみです。",
      long:
        "正規表現パターンとフラグを指定し、テキスト内の一致を確認します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dev/regex-test/",
    },
    ageCalc: {
      iconSvg: ICON_CALC,
      title: "年齢計算",
      searchExtra: "ねんれい まんねんれい たんじょうび 誕生日 きじゅんび 基準日 せいざ 星座 かんし 干支 ろくじゅっかんし",
      short: "満年齢（歳・ヶ月）・経過日数・星座・六十干支などを一覧（リアルタイム）。",
      medium:
        "誕生日と基準日（任意）から満年齢（歳とヶ月）・経過日数・次の誕生日まで・星座・年の六十干支を一覧表示します。入力に合わせてその場で更新されます。処理はブラウザ内のみです。",
      long:
        "誕生日と基準日（任意）から、年齢や経過日数などをまとめて一覧表示します。入力に合わせてリアルタイムに更新されます。\n\n" +
        "【基本の使い方】\n" +
        "1) 誕生日を入力\n" +
        "2) 基準日を必要に応じて指定（未指定なら「今日」を基準）\n" +
        "3) 右側の一覧で結果を確認\n\n" +
        "【表示内容（代表例）】\n" +
        "・満年齢（歳・ヶ月）\n" +
        "・生まれてからの経過日数\n" +
        "・次の誕生日までの日数\n" +
        "・星座（簡易）\n" +
        "・年の六十干支（簡易）\n\n" +
        "【注意】\n" +
        "・満年齢や「ヶ月」の数え方は定義が複数あります。本ツールの表示は一般的な目安としてご利用ください。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "datetime/age-calc/",
    },
    bmi: {
      iconSvg: ICON_CALC,
      title: "BMI 計算",
      searchExtra: "びーえむあい たいしつちすう 体格指数 body mass",
      short: "身長・体重から BMI と簡易区分。",
      medium:
        "身長（cm）と体重（kg）から BMI を計算し、簡易的な区分を表示します。医療判断には使えません。処理はブラウザ内のみです。",
      long:
        "身長（cm）と体重（kg）から BMI を計算します。表示は目安であり医療判断には使えません。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/bmi/",
    },
    percentCalc: {
      iconSvg: ICON_CALC,
      title: "パーセント計算",
      searchExtra: "ぱーせんと わりあい わりびき 割引 増減",
      short: "割合・割合逆算・増減の素早い計算。",
      medium:
        "元の値とパーセントから一部の値を求めたり、2 値の比率を求めたりできます。処理はブラウザ内のみです。",
      long:
        "元の値とパーセントから一部の値を求めたり、2 値の比率を求めたりします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/percent-calc/",
    },
    loanSim: {
      iconSvg: ICON_CALC,
      title: "ローン返済シミュレーション",
      searchExtra: "ろーん へんさい げんりきんとう 月々 シミュ",
      short: "元利均等返済の月額・総額の目安。",
      medium:
        "借入額・年利・年数から月々の返済額の目安を計算します。実際の契約とは異なる場合があります。処理はブラウザ内のみです。",
      long:
        "借入額・年利・年数から月々の返済額の目安を計算します。実際の契約とは異なる場合があります。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/loan-sim/",
    },
    taxJp: {
      iconSvg: ICON_CALC,
      title: "消費税計算（10%／8%）",
      searchExtra: "しょうひぜい ぜいこみ ぜいぬき 税込 税抜 軽減税率",
      short: "税込・税抜の相互計算（標準 10%／軽減 8%）。",
      medium:
        "消費税率 10% または 8%（軽減）を選び、税込・税抜金額を計算します。処理はブラウザ内のみです。",
      long:
        "消費税率 10% または 8%（軽減）を選び、税込・税抜金額を計算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/tax-jp/",
    },
    radixConv: {
      iconSvg: ICON_CODE,
      title: "進数変換（2〜36）",
      searchExtra: "しんすう にしん じゅうろくしん binary hex octal 基数",
      short: "整数を 2〜36 進数の任意の基数同士で変換。",
      medium:
        "2〜36 進数の整数表記を相互に変換します。処理はブラウザ内のみです。",
      long:
        "2〜36 進数の整数表記を相互に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/radix-conv/",
    },
    colorConv: {
      iconSvg: ICON_COLOR,
      title: "カラーコード変換",
      searchExtra: "からー hex rgb hsl 色 変換",
      short: "HEX から RGB・HSL を表示。",
      medium:
        "#RRGGBB 形式の色から RGB と HSL の値を求めます。処理はブラウザ内のみです。",
      long:
        "#RRGGBB 形式の色から RGB と HSL の値を求めます。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "design/color-conv/",
    },
    contrast: {
      iconSvg: ICON_COLOR,
      title: "コントラスト比（WCAG）",
      searchExtra: "こんとらすと contrast accessibility アクセシビリティ AA AAA",
      short: "2 色の相対コントラスト比（WCAG）を計算。",
      medium:
        "前景色と背景色から WCAG 2.1 のコントラスト比の目安を表示します。処理はブラウザ内のみです。",
      long:
        "前景色と背景色から WCAG 2.1 のコントラスト比の目安を表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "design/contrast/",
    },
    gradientCss: {
      iconSvg: ICON_COLOR,
      title: "CSS グラデーション生成",
      searchExtra: "ぐらで linear-gradient 線形グラデ background",
      short: "線形グラデーションの CSS を生成・コピー。",
      medium:
        "角度と 2 色から linear-gradient の CSS を生成します。処理はブラウザ内のみです。",
      long:
        "角度と 2 色から linear-gradient の CSS を生成します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "design/gradient-css/",
    },
    lorem: {
      iconSvg: ICON_TEXT,
      title: "ダミー文章",
      searchExtra: "ろれむ ipsum だみー プレースホルダー 仮 lorem ダミー文",
      short: "日本語・英語のダミー文章を表示・コピー。",
      medium:
        "日本語・英語のダミー文章を表示し、ワンクリックでコピーできます。処理はブラウザ内のみです。",
      long:
        "デザインやレイアウト確認用のダミー文章（日本語/英語）を表示し、ワンクリックでコピーできます。\n\n" +
        "【基本の使い方】\n" +
        "1) 文章の種類（日本語/英語）を選択\n" +
        "2) 必要な量を表示\n" +
        "3) コピーして、原稿・UI・資料などに貼り付け\n\n" +
        "【用途の例】\n" +
        "・Web ページやアプリの文章量の見積り\n" +
        "・フォント/行間/段落の見え方チェック\n" +
        "・デモ用の仮テキスト\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "text/lorem/",
    },
    zenkaku: {
      iconSvg: ICON_CONVERT,
      title: "全角／半角変換",
      searchExtra: "ぜんかく はんかく zenkaku hankaku 英数字",
      short: "英数字・記号の全角・半角を相互変換。",
      medium:
        "半角英数字・記号を全角に、または全角英数字を半角に変換します。処理はブラウザ内のみです。",
      long:
        "半角/全角の英数字・一部記号を相互に変換します。フォーム入力や表記ゆれ（例: １２３ と 123）を揃えたいときに便利です。\n\n" +
        "【基本の使い方】\n" +
        "1) テキストを貼り付け\n" +
        "2) 変換方向（全角→半角 / 半角→全角）を選択\n" +
        "3) 変換結果をコピー\n\n" +
        "【注意】\n" +
        "・すべての記号/文字が変換対象になるわけではありません（文字種によっては変換されないものがあります）。\n" +
        "・日本語（ひらがな/カタカナ/漢字）自体は変換しません。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "text/zenkaku/",
    },
    kataHira: {
      iconSvg: ICON_CONVERT,
      title: "カタカナ／ひらがな変換",
      searchExtra: "かたかな ひらがな かな 変換",
      short: "カタカナとひらがなを相互に変換（簡易）。",
      medium:
        "カタカナとひらがなを 1 文字単位で相互変換します。処理はブラウザ内のみです。",
      long:
        "カタカナとひらがなを 1 文字単位で相互変換します。読みの統一や、表記の揃え（例: ひらがなに寄せる）に便利です。\n\n" +
        "【基本の使い方】\n" +
        "1) テキストを貼り付け\n" +
        "2) 変換方向（カタカナ→ひらがな / ひらがな→カタカナ）を選択\n" +
        "3) 変換結果をコピー\n\n" +
        "【注意】\n" +
        "・変換は文字単位の簡易変換です。語彙や文脈に応じた表記（例: 外来語の表記ゆれ）を自動で調整するものではありません。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "text/kata-hira/",
    },
    maruSuji: {
      iconSvg: ICON_MARUSUJI,
      title: "丸数字",
      searchExtra: "まるすうじ 丸付き数字 丸囲み数字 まるいち circled numbers",
      short: "丸数字（①〜など）を一覧表示し、クリックでコピー。数字で絞り込みも可。",
      medium:
        "丸数字（①〜㊿、⓪/⓿、黒丸数字、二重丸数字、装飾系など）を一覧表示し、クリックでコピーできます。入力欄の数字で絞り込みもできます。処理はブラウザ内のみです。",
      long:
        "丸数字（丸付き数字・丸囲み数字）を一覧表示し、クリックでコピーできます。資料作成や手順書の番号付けに便利です。\n\n" +
        "【基本の使い方】\n" +
        "1) 一覧から欲しい丸数字を探す\n" +
        "2) 文字をクリックするとコピーされます\n\n" +
        "【絞り込み（先頭一致）】\n" +
        "上部の入力欄に数字を入れると、番号が先頭一致するものだけを表示します。\n" +
        "例: 5 → 5 と 50、1 → 1/10/11/…/19\n\n" +
        "【収録】\n" +
        "・丸数字（①〜㊿、⓪）\n" +
        "・黒丸数字（❶〜、⓿）\n" +
        "・二重丸数字（⓵〜）\n" +
        "・装飾系の丸数字（➀/➊ など）\n\n" +
        "【注意】\n" +
        "・端末やフォントによっては、一部の文字が見えにくい/表示できない場合があります。\n\n" +
        "【プライバシー】\n" +
        "処理はすべてお使いのブラウザ内で行われ、入力内容がサーバーに送られることはありません。",
      href: "text/maru-suuji/",
    },
    stopwatch: {
      iconSvg: ICON_TIMER,
      title: "ストップウォッチ",
      searchExtra: "すとっぷうぉっち けいそく たいまー 秒表",
      short: "シンプルな経過時間計測。",
      medium:
        "開始・停止・リセットで経過時間を計測します。処理はブラウザ内のみです。",
      long:
        "開始・停止・リセットで経過時間を計測します。ラップ計測にも対応しています。\n\n" +
        "【基本の使い方】\n" +
        "1) 「開始」で計測スタート\n" +
        "2) 必要に応じて「ラップ」で区切りを記録\n" +
        "3) 「停止」で一時停止\n" +
        "4) 「リセット」で初期化\n\n" +
        "【注意】\n" +
        "・ブラウザ/端末の省電力状態、タブの非アクティブ化などで表示更新が間引かれる場合があります（計測値はできるだけ正確になるよう設計していますが、厳密計測用途には専用機器をご利用ください）。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "datetime/stopwatch/",
    },
    pomodoro: {
      iconSvg: ICON_TIMER,
      title: "カウントダウンタイマー",
      searchExtra:
        "かうんとだうん たいまー ぽもどーろ 集中 25分 作業 きゅうけい",
      short: "分・秒を指定してカウントダウン（表示を直接編集可能）。",
      medium:
        "指定した分数のカウントダウンタイマーです。終了時にトーストでお知らせします。最後に確定した時間は端末に保存され、リセットで復元できます。処理はブラウザ内のみです。",
      long:
        "指定した時間（分・秒）のカウントダウンタイマーです。表示の数字を直接編集でき、終了時にトーストでお知らせします。\n\n" +
        "【基本の使い方】\n" +
        "1) 分・秒を設定（表示をクリックして直接編集）\n" +
        "2) 「開始」でカウントダウン\n" +
        "3) 「停止」で一時停止\n" +
        "4) 「リセット」で最後に確定した時間に戻す\n\n" +
        "【使いどころ】\n" +
        "・作業時間/休憩時間の区切り\n" +
        "・勉強、料理、会議のタイムキープ\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。最後に確定した時間は端末の localStorage に保存されます。",
      href: "datetime/pomodoro/",
    },
    countdown: {
      iconSvg: ICON_CLOCK,
      title: "日時までの残り時間",
      searchExtra: "のこりじかん カウントダウン あと 残り",
      short: "目標日時までの残りをリアルタイム表示。",
      medium:
        "指定した日時までの残り日・時間・分・秒を表示します。処理はブラウザ内のみです。",
      long:
        "指定した日時までの残り日・時間・分・秒をリアルタイム表示します。\n\n" +
        "【基本の使い方】\n" +
        "1) 目標の日時を選択\n" +
        "2) 残り時間が自動で更新されます\n\n" +
        "【注意】\n" +
        "・表示は端末のタイムゾーン設定に依存します。\n" +
        "・スリープ中などは更新が止まり、復帰時に再計算されます。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "datetime/countdown/",
    },
    csvView: {
      iconSvg: ICON_LIST,
      title: "CSV 簡易ビューア",
      searchExtra: "しーぶいー かんま 表 プレビュー 表計算",
      short: "カンマ区切りを表形式でプレビュー。",
      medium:
        "シンプルなカンマ区切りテキストを表として表示します。引用符付き CSV の複雑な仕様は未対応です。処理はブラウザ内のみです。",
      long:
        "シンプルなカンマ区切りテキストを表として表示します。引用符付き CSV の複雑な仕様は未対応です。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dev/csv-view/",
    },
    jwtDecode: {
      iconSvg: ICON_DEV,
      title: "JWT デコード",
      searchExtra: "じぇいだぶりゅーてぃー token bearer トークン ぺいろーど",
      short: "JWT のヘッダーとペイロードを表示（署名は検証しない）。",
      medium:
        "JWT をピリオドで分割し、ヘッダーとペイロードを Base64URL デコードして表示します。署名の検証は行いません。処理はブラウザ内のみです。",
      long:
        "JWT をピリオドで分割し、ヘッダーとペイロードを Base64URL デコードして表示します。署名の検証は行いません。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dev/jwt-decode/",
    },
    uaParse: {
      iconSvg: ICON_DEV,
      title: "User-Agent 表示",
      searchExtra: "ゆーざーえーじぇんと ブラウザ 環境 UA",
      short: "ブラウザの User-Agent を表示。任意の文字列も確認可。",
      medium:
        "現在の User-Agent を表示するほか、任意の文字列を貼り付けて確認できます。処理はブラウザ内のみです。",
      long:
        "現在の User-Agent を表示するほか、任意の文字列を貼り付けて確認できます。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dev/ua-parse/",
    },
    dpiCalc: {
      iconSvg: ICON_CALC,
      title: "DPI 計算",
      searchExtra: "でぴーあい ppi 解像度 ピクセル密度 モニタ",
      short: "解像度と対角インチからおおよその DPI。",
      medium:
        "横・縦ピクセルと対角インチからディスプレイの DPI の目安を計算します。処理はブラウザ内のみです。",
      long:
        "横・縦ピクセルと対角インチからディスプレイの DPI の目安を計算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/dpi-calc/",
    },
    aspectRatio: {
      iconSvg: ICON_CALC,
      title: "アスペクト比の簡約",
      searchExtra: "あすぺくと ひ 16:9 よこたて gcd",
      short: "幅と高さの比を最大公約数で約分。",
      medium:
        "整数の幅・高さからアスペクト比を整数比で表します。処理はブラウザ内のみです。",
      long:
        "整数の幅・高さからアスペクト比を整数比で表します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/aspect-ratio/",
    },
    randomPick: {
      iconSvg: ICON_LIST,
      title: "くじ引き・ランダム抽選",
      searchExtra: "くじ ちゅうせん らんだむ あみだ 抽選",
      short: "カンマ区切りまたは CSV の候補から 1 つを選ぶ。",
      medium:
        "候補をカンマ区切りで入力するか、CSV ファイルを読み込み、ランダムに 1 つを選びます。処理はブラウザ内のみです。",
      long:
        "候補リストからランダムに 1 つを選びます。抽選や順番決めに使えます。\n\n" +
        "【基本の使い方】\n" +
        "1) 候補を入力（カンマ区切り、または改行区切り）\n" +
        "   例: A,B,C  /  りんご\\nみかん\\nぶどう\n" +
        "2) 必要なら CSV を読み込み（候補が多いとき）\n" +
        "3) 「抽選」で 1 つを表示\n" +
        "4) 結果をコピー\n\n" +
        "【注意】\n" +
        "・同じ候補が複数回入っていると、その分だけ当たりやすくなります（重み付けとして利用できます）。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "random/random-pick/",
    },
    bingo: {
      iconSvg: ICON_BINGO,
      title: "ビンゴ抽選",
      searchExtra: "びんご 75 番号 重複なし 抽選",
      short: "候補から重複なく 1 つずつ抽選（数字の範囲にも対応）。",
      medium:
        "カンマ区切りまたは CSV の候補を用意し、出たものは二度と出ない抽選を行います。整数の範囲（例: 1〜75）を一括で候補に流し込めます。履歴がある間は候補の変更はできません（リセットで再開）。処理はブラウザ内のみです。",
      long:
        "候補の中から、重複なしで 1 つずつ抽選します（ビンゴや抽選会向け）。\n\n" +
        "【基本の使い方】\n" +
        "1) 候補を入力（カンマ区切り、または CSV）\n" +
        "2) 「抽選」を押すと、未出の候補から 1 つ出ます\n" +
        "3) 繰り返すと、同じ候補は二度と出ません\n" +
        "4) 「リセット」で最初からやり直し\n\n" +
        "【数字の範囲（例: 1〜75）】\n" +
        "整数の範囲を指定して候補を一括生成できます。\n\n" +
        "【注意】\n" +
        "・履歴が残っている間は、抽選の整合性を保つため候補の変更はできません（リセットで再開）。\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "random/bingo/",
    },
    diceRoll: {
      iconSvg: ICON_DICE,
      title: "サイコロ",
      searchExtra: "さいころ だいす dice 乱数 振る",
      short: "6 面サイコロを個数指定で振る。",
      medium:
        "6 面のサイコロを、個数を変えて乱数で振ります。処理はブラウザ内のみです。",
      long:
        "6 面サイコロを好きな個数だけ振り、出目と合計を表示します。\n\n" +
        "【基本の使い方】\n" +
        "1) サイコロの個数を指定\n" +
        "2) 「振る」で出目を表示\n" +
        "3) 必要に応じて履歴を確認/コピー\n\n" +
        "【用途の例】\n" +
        "・TRPG/ボードゲーム\n" +
        "・簡単な乱数確認\n\n" +
        "【プライバシー】\n" +
        "処理はブラウザ内のみです。",
      href: "random/dice-roll/",
    },
    nanoid: {
      iconSvg: ICON_HASH,
      title: "短い ID 生成（nanoid 風）",
      searchExtra: "なのいど nanoid 短いid らんだむ トークン",
      short: "URL セーフなランダム文字列（短い ID）を生成。",
      medium:
        "英数字と一部記号からなるランダムな ID を生成します。生成はブラウザ内のみです。",
      long:
        "英数字と一部記号からなるランダムな ID を生成します。\n\n【プライバシー】\n生成はブラウザ内のみです。",
      href: "security/nanoid/",
    },
    subnet: {
      iconSvg: ICON_DEV,
      title: "IPv4 サブネット計算",
      searchExtra: "さぶねっと cidr ねっとわーく プレフィックス ホスト数",
      short: "IPv4 の CIDR からネットワーク・ブロードキャスト等。",
      medium:
        "IPv4 アドレスとプレフィックス長からネットワークアドレスとブロードキャスト、ホスト数の目安を計算します。処理はブラウザ内のみです。",
      long:
        "IPv4 アドレスとプレフィックス長からネットワークアドレスとブロードキャスト、ホスト数の目安を計算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dev/subnet/",
    },
    htmlEntity: {
      iconSvg: ICON_CODE,
      title: "HTML エンティティ デコード",
      searchExtra: "えんてぃてぃ &amp; decode 実体参照 デコード",
      short: "HTML 実体参照をテキストに戻す。",
      medium:
        "HTML エンティティが含まれた文字列をデコードして表示します。処理はブラウザ内のみです。",
      long:
        "HTML エンティティが含まれた文字列をデコードして表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "encode/html-entity/",
    },
    romanNum: {
      iconSvg: ICON_TEXT,
      title: "ローマ数字変換",
      searchExtra: "ろーますうじ Ⅰ Ⅴ Ⅹ roman numerals",
      short: "1〜3999 の整数をローマ数字に変換。",
      medium:
        "指定した整数をローマ数字表記に変換します。処理はブラウザ内のみです。",
      long:
        "指定した整数をローマ数字表記に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/roman-num/",
    },
    unitLength: {
      iconSvg: ICON_CALC,
      title: "長さの単位換算",
      searchExtra: "ながさ メートル インチ フィート ヤード マイル 換算",
      short: "m・cm・mm・km・inch・ft を相互換算。",
      medium:
        "メートル法・ヤードポンド法の長さを相互に換算します。処理はブラウザ内のみです。",
      long:
        "メートル法・ヤードポンド法の長さを相互に換算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/unit-length/",
    },
    fuelEconomy: {
      iconSvg: ICON_CALC,
      title: "燃費換算（km/L ⇔ L/100km）",
      searchExtra: "ねんぴ mpg キロリットル りっとる 欧州 日本",
      short: "日本式（km/L）と欧州式（L/100km）を相互変換。",
      medium:
        "km/L と L/100km を相互に変換します。処理はブラウザ内のみです。",
      long:
        "km/L と L/100km を相互に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "calc/fuel-economy/",
    },
  };

  /** トップページのツールカード表示順（id は TOOL_REGISTRY のキー＝data-tool-id） */
  window.TOOL_HOME_ORDER = [
    "counter",
    "password",
    "wareki",
    "qr",
    "base64",
    "urlCodec",
    "htmlEscape",
    "jsonFormat",
    "jsonMinify",
    "uuidGen",
    "sha256",
    "caseConvert",
    "zenkaku",
    "kataHira",
    "lineSort",
    "textDiff",
    "maruSuji",
    "regexTest",
    "ageCalc",
    "bmi",
    "percentCalc",
    "loanSim",
    "taxJp",
    "radixConv",
    "colorConv",
    "contrast",
    "gradientCss",
    "lorem",
    "stopwatch",
    "pomodoro",
    "countdown",
    "csvView",
    "jwtDecode",
    "uaParse",
    "dpiCalc",
    "aspectRatio",
    "diceRoll",
    "randomPick",
    "bingo",
    "nanoid",
    "subnet",
    "htmlEntity",
    "romanNum",
    "unitLength",
    "fuelEconomy",
  ];

  /** トップページのカテゴリ表示順 */
  window.TOOL_CATEGORY_ORDER = [
    "text",
    "datetime",
    "calc",
    "random",
    "design",
    "security",
    "encode",
    "dev",
  ];

  window.TOOL_CATEGORY_LABELS = {
    text: "テキスト・文章",
    encode: "エンコード・データ形式",
    security: "セキュリティ・ID",
    datetime: "日付・時刻",
    calc: "計算・単位",
    design: "デザイン・メディア",
    dev: "開発者向け",
    random: "抽選・乱数",
  };

  /**
   * 各ツールのカテゴリ（新規ツール追加時はここにも 1 行追加）。
   * キーは TOOL_REGISTRY / TOOL_HOME_ORDER の id と一致させる。
   */
  window.TOOL_CATEGORY_MAP = {
    counter: "text",
    password: "security",
    wareki: "datetime",
    qr: "design",
    base64: "encode",
    urlCodec: "encode",
    htmlEscape: "encode",
    jsonFormat: "encode",
    jsonMinify: "encode",
    uuidGen: "security",
    sha256: "security",
    caseConvert: "text",
    lineSort: "text",
    textDiff: "text",
    regexTest: "dev",
    ageCalc: "datetime",
    bmi: "calc",
    percentCalc: "calc",
    loanSim: "calc",
    taxJp: "calc",
    radixConv: "calc",
    colorConv: "design",
    contrast: "design",
    gradientCss: "design",
    lorem: "text",
    zenkaku: "text",
    kataHira: "text",
    maruSuji: "text",
    stopwatch: "datetime",
    pomodoro: "datetime",
    countdown: "datetime",
    csvView: "dev",
    jwtDecode: "dev",
    uaParse: "dev",
    dpiCalc: "calc",
    aspectRatio: "calc",
    randomPick: "random",
    bingo: "random",
    diceRoll: "random",
    nanoid: "security",
    subnet: "dev",
    htmlEntity: "encode",
    romanNum: "calc",
    unitLength: "calc",
    fuelEconomy: "calc",
  };
})();
