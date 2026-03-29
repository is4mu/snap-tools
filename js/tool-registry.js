/**
 * ツール一覧（トップ・ツールバー・お気に入りの単一ソース）。
 * 追加手順: ここに 1 エントリ追加 → TOOL_HOME_ORDER に id → 対応する *.html で data-tool-id を同じ id に。
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
  var ICON_TEXT =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
  var ICON_CALC =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>';
  var ICON_CLOCK =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  var ICON_COLOR =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14 14 0 0 0 0 20"/></svg>';
  var ICON_HASH =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>';
  var ICON_LIST =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
  var ICON_DEV =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/></svg>';

  window.TOOL_REGISTRY = {
    counter: {
      iconSvg: ICON_COUNTER,
      title: "文字数カウント",
      short:
        "文字数・行数・原稿用紙・X 用の半角換算（全角＝2）を一覧表示。長文は投稿単位に分割してコピーできます。",
      long:
        "文章を入力または貼り付けると、レポート風の一覧で次の項目を表示します。\n\n" +
        "【表示項目】\n" +
        "・文字数（空白の有無。改行は文字数に含めません）\n" +
        "・行数（空行の有無）\n" +
        "・原稿用紙換算（改行ごとに文字数÷20 を切り上げて行数、合計行÷20 を切り上げて枚数）\n" +
        "・ポスト（X）用の半角換算\n\n" +
        "半角換算が 280 を超えると「投稿に分割」が現れ、各投稿を個別コピーするか、区切り付きでまとめてコピーできます。分割は半角換算のみで行い、改行は区切りにしません。\n\n" +
        "【プライバシー】\n" +
        "処理はすべてお使いのブラウザ内で行われ、テキストがサーバーに送られることはありません。",
      href: "counter.html",
    },
    password: {
      iconSvg: ICON_PASSWORD,
      title: "パスワード生成",
      short:
        "ランダム文字列またはパスフレーズ（英単語）からパスワードを生成します。推定エントロピーと強度も表示します。\n" + 
        "生成はブラウザ内だけで行われます。",
      long:
        "「ランダム文字列」では文字数スライダーと条件（大文字・小文字・数字・記号・紛らわしい文字除外・先頭末尾を英字にするなど）を指定し、「任意の単語を含む」をオンにすると「含める単語」をそのまま連続で含められます。「パスフレーズ」では EFF の短い英単語リスト（1296語）から単語をつなぎます。いずれも推定エントロピー（理論上の目安・ビット）を表示し、弱・中・強の表示も同じ推定値と共通のビット閾値で判定します。1〜8件を同時生成して行ごとにコピーできます。\n\n" +
        "【セキュリティについて】\n" +
        "乱数には可能な環境でブラウザの暗号用乱数（crypto.getRandomValues）を使います。エントロピー表示は簡略化した計算であり、実際の攻撃耐性を保証するものではありません。最高水準の用途にはパスワードマネージャー等の利用もご検討ください。\n\n" +
        "【プライバシー】\n" +
        "生成結果はサーバーに送信されません。",
      href: "password.html",
    },
    wareki: {
      iconSvg: ICON_WAREKI,
      title: "西暦↔和暦変換",
      short:
        "西暦と和暦（大宝から令和まで）を相互変換。",
      long:
        "西暦（グレゴリオ暦）と日本の元号表記（大宝から令和まで）を、ブラウザ上で相互変換します。\n\n" +
        "【できること】\n" +
        "・西暦の日付を選ぶと、和暦（元号・年・曜日付き）を表示します。\n" +
        "・元号と「年・月・日」を入れると、西暦の日付と曜日を表示します。（元年は「年」に 1 を入力してください）\n\n" +
        "【対応範囲】\n" +
        "大宝元年（701年5月7日）から令和までです。それより前の日付は変換しません。\n" +
        "元号の一覧に付いている「江戸時代」などの区分は、ドロップダウンを探しやすくするための目安であり、史学上の時代区分と一致しない場合があります。\n\n" +
        "【元号データの出典】\n" +
        "元号の開始日・終了日（グレゴリオ暦）は、オープンデータ「Harumi（春海）」に含まれる対照表（gengo_periods.json）に基づいています。\n" +
        "・公開元：Code for History（GitHub 上のプロジェクト Harumi）\n" +
        "・ライセンス：MIT License\n" +
        "・参照先：https://github.com/code4history/Harumi\n" +
        "当サイトは上記データを組み込んで表示しているだけであり、元号の解釈や改元日を独自に定めたり公式見解を表明したりするものではありません。\n\n" +
        "【ご利用上の注意（免責）】\n" +
        "旧暦に基づく改元を西暦に当てる作業は、史料の読み方や対照表の版によって日付が文献と異なることがあります。Harumi のデータも一つの対照表にすぎず、政府の告示・公文書・契約書・学術出版などで用いる公式な基準になるものではありません。裁判・契約・研究の根拠などにそのまま用いないでください。表示は目安・参考としてご利用ください。\n\n" +
        "【プライバシー】\n" +
        "日付の計算はすべてお使いのブラウザ内で行われ、入力内容がサーバーに送られることはありません。",
      href: "wareki.html",
    },
    qr: {
      iconSvg: ICON_QR,
      title: "QRコード作成",
      short:
        "テキストや URL から QR コードを表示し、PNG で保存できます。入力はブラウザ内だけで処理されます。",
      long:
        "内容を入力すると QR コードをプレビューし、PNG 画像として保存できます。\n\n" +
        "【オプション】\n" +
        "・サイズ: ピクセル単位の表示・保存サイズ（200〜400）\n" +
        "・誤り訂正: 高いほど汚れに強いが、同じサイズで扱えるデータ量の上限が下がります（一般的には「中」で十分です）\n\n" +
        "【ライブラリ】\n" +
        "QR 生成に npm パッケージ「qrcode」（MIT）をブラウザ用にバンドルしたものを同サイトから読み込んでいます。\n\n" +
        "【プライバシー】\n" +
        "入力内容はサーバーに送信されません。オフラインでもページとバンドルが読めれば利用できます。",
      href: "qr.html",
    },
    base64: {
      iconSvg: ICON_CODE,
      title: "Base64 エンコード／デコード",
      short: "テキストと Base64 を相互変換（Unicode 対応）。広告・サーバー送信なし。",
      long:
        "入力したテキストを Base64 にエンコードしたり、Base64 文字列をテキストに戻します。\n\n【プライバシー】\n処理はすべてブラウザ内で行われ、内容がサーバーに送られることはありません。",
      href: "base64.html",
    },
    urlCodec: {
      iconSvg: ICON_CODE,
      title: "URL エンコード／デコード",
      short: "encodeURIComponent／decodeURIComponent 相当。クエリやパス用のエスケープに。",
      long:
        "テキストを URL 用にエンコードしたり、エンコード済み文字列を元に戻します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "url-codec.html",
    },
    htmlEscape: {
      iconSvg: ICON_CODE,
      title: "HTML エスケープ／解除",
      short: "HTML 特殊文字のエスケープと簡易的な解除。",
      long:
        "テキストを HTML に安全に埋め込むためのエスケープ、およびエスケープされた文字列の復元を行います。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "html-escape.html",
    },
    jsonFormat: {
      iconSvg: ICON_CODE,
      title: "JSON 整形",
      short: "JSON を検証し、インデント付きで整形表示。",
      long:
        "JSON 文字列をパースし、読みやすい形式で表示します。不正な JSON の場合はエラーメッセージを表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "json-format.html",
    },
    jsonMinify: {
      iconSvg: ICON_CODE,
      title: "JSON 圧縮（minify）",
      short: "JSON を空白のない 1 行に圧縮。",
      long:
        "JSON をパースしてから改めて文字列化し、不要な空白を除いた形式にします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "json-minify.html",
    },
    uuidGen: {
      iconSvg: ICON_HASH,
      title: "UUID 生成",
      short: "UUID v4 を複数件まとめて生成。",
      long:
        "ランダムな UUID（v4）を指定件数生成します。crypto.randomUUID または同等の乱数で生成します。\n\n【プライバシー】\n生成はブラウザ内のみです。",
      href: "uuid-gen.html",
    },
    sha256: {
      iconSvg: ICON_HASH,
      title: "SHA-256 ハッシュ",
      short: "文字列の SHA-256（16 進）を表示。",
      long:
        "入力テキストの SHA-256 ハッシュを Web Crypto API で計算します。\n\n【プライバシー】\n計算はブラウザ内のみです。",
      href: "sha256.html",
    },
    slugify: {
      iconSvg: ICON_TEXT,
      title: "スラッグ生成",
      short: "英数字ベースの URL 用スラッグに正規化。",
      long:
        "テキストを小文字化し、記号をハイフンに置き換えてスラッグ形式にします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "slugify.html",
    },
    caseConvert: {
      iconSvg: ICON_TEXT,
      title: "大文字／小文字変換",
      short: "英字の大文字・小文字・タイトルケースなどに変換。",
      long:
        "選択したモードに応じて英字の大文字・小文字を一括変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "case-convert.html",
    },
    lineSort: {
      iconSvg: ICON_LIST,
      title: "行の並べ替え・重複除去",
      short: "行単位でソート、重複除去、空白トリム。",
      long:
        "改行区切りのテキストを行ごとに並べ替えたり、重複を除いたりします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "line-sort.html",
    },
    textDiff: {
      iconSvg: ICON_LIST,
      title: "テキスト差分（行）",
      short: "2 つのテキストを行単位で簡易比較。",
      long:
        "2 つのテキストを行ごとに比較し、簡易的な差分表示を行います。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "text-diff.html",
    },
    regexTest: {
      iconSvg: ICON_DEV,
      title: "正規表現テスト",
      short: "JavaScript の RegExp でマッチ位置を確認。",
      long:
        "正規表現パターンとフラグを指定し、テキスト内の一致を確認します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "regex-test.html",
    },
    unixTime: {
      iconSvg: ICON_CLOCK,
      title: "UNIX 時刻変換",
      short: "UNIX 秒と日時（ローカル）を相互変換。",
      long:
        "UNIX 時刻（秒）と日時表示を相互に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "unix-time.html",
    },
    ageCalc: {
      iconSvg: ICON_CALC,
      title: "年齢計算",
      short: "誕生日から満年齢と次の誕生日までの日数。",
      long:
        "誕生日を入力すると満年齢と、次の誕生日までのおおよその日数を表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "age-calc.html",
    },
    bmi: {
      iconSvg: ICON_CALC,
      title: "BMI 計算",
      short: "身長・体重から BMI と簡易区分。",
      long:
        "身長（cm）と体重（kg）から BMI を計算します。表示は目安であり医療判断には使えません。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "bmi.html",
    },
    percentCalc: {
      iconSvg: ICON_CALC,
      title: "パーセント計算",
      short: "割合・割合逆算・増減の素早い計算。",
      long:
        "元の値とパーセントから一部の値を求めたり、2 値の比率を求めたりします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "percent-calc.html",
    },
    loanSim: {
      iconSvg: ICON_CALC,
      title: "ローン返済シミュレーション",
      short: "元利均等返済の月額・総額の目安。",
      long:
        "借入額・年利・年数から月々の返済額の目安を計算します。実際の契約とは異なる場合があります。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "loan-sim.html",
    },
    taxJp: {
      iconSvg: ICON_CALC,
      title: "消費税計算（10%／8%）",
      short: "税込・税抜の相互計算（標準・軽減）。",
      long:
        "消費税率 10% または 8%（軽減）を選び、税込・税抜金額を計算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "tax-jp.html",
    },
    radixConv: {
      iconSvg: ICON_CODE,
      title: "進数変換（2〜36）",
      short: "整数を任意の基数同士で変換。",
      long:
        "2〜36 進数の整数表記を相互に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "radix-conv.html",
    },
    colorConv: {
      iconSvg: ICON_COLOR,
      title: "カラーコード変換",
      short: "HEX から RGB・HSL を表示。",
      long:
        "#RRGGBB 形式の色から RGB と HSL の値を求めます。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "color-conv.html",
    },
    contrast: {
      iconSvg: ICON_COLOR,
      title: "コントラスト比（WCAG）",
      short: "2 色の相対コントラスト比を計算。",
      long:
        "前景色と背景色から WCAG 2.1 のコントラスト比の目安を表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "contrast.html",
    },
    gradientCss: {
      iconSvg: ICON_COLOR,
      title: "CSS グラデーション生成",
      short: "線形グラデーションの CSS を生成・コピー。",
      long:
        "角度と 2 色から linear-gradient の CSS を生成します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "gradient-css.html",
    },
    lorem: {
      iconSvg: ICON_TEXT,
      title: "ダミー英文（Lorem）",
      short: "段落数を指定してダミーテキストを生成。",
      long:
        "プレースホルダー用のダミー英文を段落単位で生成します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "lorem.html",
    },
    creditCard: {
      iconSvg: ICON_CALC,
      title: "カード番号チェック（Luhn）",
      short: "チェックディジットの検証のみ（決済・実在確認は不可）。",
      long:
        "カード番号の Luhn アルゴリズムによる形式チェックを行います。有効期限や実在は検証しません。\n\n【プライバシー】\n入力はブラウザ内のみでサーバーに送信されません。",
      href: "credit-card.html",
    },
    zipJp: {
      iconSvg: ICON_TEXT,
      title: "郵便番号フォーマット",
      short: "7 桁を 123-4567 形式に整形。",
      long:
        "数字 7 桁の郵便番号をハイフン付き表記に整形します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "zip-jp.html",
    },
    zenkaku: {
      iconSvg: ICON_TEXT,
      title: "全角／半角変換",
      short: "英数字記号の全角・半角を相互変換。",
      long:
        "半角英数字・記号を全角に、または全角英数字を半角に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "zenkaku.html",
    },
    kataHira: {
      iconSvg: ICON_TEXT,
      title: "カタカナ／ひらがな変換",
      short: "カナとひらがなを相互に変換（簡易）。",
      long:
        "カタカナとひらがなを 1 文字単位で相互変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "kata-hira.html",
    },
    stopwatch: {
      iconSvg: ICON_CLOCK,
      title: "ストップウォッチ",
      short: "シンプルな経過時間計測。",
      long:
        "開始・停止・リセットで経過時間を計測します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "stopwatch.html",
    },
    pomodoro: {
      iconSvg: ICON_CLOCK,
      title: "ポモドーロタイマー",
      short: "集中用のカウントダウン（分を指定可能）。",
      long:
        "指定した分数のカウントダウンタイマーです。終了時にトーストでお知らせします。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "pomodoro.html",
    },
    countdown: {
      iconSvg: ICON_CLOCK,
      title: "日時までの残り時間",
      short: "目標日時までの残りをリアルタイム表示。",
      long:
        "指定した日時までの残り日・時間・分・秒を表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "countdown.html",
    },
    textSplit: {
      iconSvg: ICON_TEXT,
      title: "文字数で分割",
      short: "長文を指定文字数ごとに改行で分割。",
      long:
        "Unicode のコードポイント単位で、指定文字数ごとに改行を入れて分割します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "text-split.html",
    },
    csvView: {
      iconSvg: ICON_LIST,
      title: "CSV 簡易ビューア",
      short: "カンマ区切りを表形式でプレビュー。",
      long:
        "シンプルなカンマ区切りテキストを表として表示します。引用符付き CSV の複雑な仕様は未対応です。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "csv-view.html",
    },
    jwtDecode: {
      iconSvg: ICON_DEV,
      title: "JWT デコード",
      short: "ヘッダーとペイロードを表示（署名は検証しません）。",
      long:
        "JWT をピリオドで分割し、ヘッダーとペイロードを Base64URL デコードして表示します。署名の検証は行いません。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "jwt-decode.html",
    },
    uaParse: {
      iconSvg: ICON_DEV,
      title: "User-Agent 表示",
      short: "ブラウザの UA を表示・貼り付けた文字列を確認。",
      long:
        "現在の User-Agent を表示するほか、任意の文字列を貼り付けて確認できます。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "ua-parse.html",
    },
    dpiCalc: {
      iconSvg: ICON_CALC,
      title: "DPI 計算",
      short: "解像度と対角インチからおおよその DPI。",
      long:
        "横・縦ピクセルと対角インチからディスプレイの DPI の目安を計算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dpi-calc.html",
    },
    aspectRatio: {
      iconSvg: ICON_CALC,
      title: "アスペクト比の簡約",
      short: "幅と高さの比を最大公約数で約分。",
      long:
        "整数の幅・高さからアスペクト比を整数比で表します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "aspect-ratio.html",
    },
    readingTime: {
      iconSvg: ICON_TEXT,
      title: "読了時間の目安",
      short: "文字数から読了分数のざっくり目安。",
      long:
        "空白を除いた文字数と 1 分あたりの文字数から読了時間の目安を出します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "reading-time.html",
    },
    worldClock: {
      iconSvg: ICON_CLOCK,
      title: "世界時計",
      short: "東京・NY・ロンドン・UTC の現在時刻。",
      long:
        "主要タイムゾーンの現在時刻を 1 秒ごとに更新します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "world-clock.html",
    },
    randomPick: {
      iconSvg: ICON_LIST,
      title: "くじ引き・ランダム抽選",
      short: "改行区切りの候補から 1 つを選ぶ。",
      long:
        "候補を 1 行に 1 つずつ入力し、ランダムに 1 つを選びます。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "random-pick.html",
    },
    diceRoll: {
      iconSvg: ICON_CALC,
      title: "サイコロ",
      short: "任意の面数・個数で乱数を振る。",
      long:
        "サイコロの面数と個数を指定して乱数を生成します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "dice-roll.html",
    },
    nanoid: {
      iconSvg: ICON_HASH,
      title: "短い ID 生成（nanoid 風）",
      short: "URL セーフなランダム文字列を生成。",
      long:
        "英数字と一部記号からなるランダムな ID を生成します。\n\n【プライバシー】\n生成はブラウザ内のみです。",
      href: "nanoid.html",
    },
    subnet: {
      iconSvg: ICON_DEV,
      title: "IPv4 サブネット計算",
      short: "CIDR からネットワーク・ブロードキャスト等。",
      long:
        "IPv4 アドレスとプレフィックス長からネットワークアドレスとブロードキャスト、ホスト数の目安を計算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "subnet.html",
    },
    htmlEntity: {
      iconSvg: ICON_CODE,
      title: "HTML エンティティ デコード",
      short: "&amp; 形式の文字列をテキストに戻す。",
      long:
        "HTML エンティティが含まれた文字列をデコードして表示します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "html-entity.html",
    },
    romanNum: {
      iconSvg: ICON_TEXT,
      title: "ローマ数字変換",
      short: "1〜3999 の整数をローマ数字に。",
      long:
        "指定した整数をローマ数字表記に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "roman-num.html",
    },
    unitLength: {
      iconSvg: ICON_CALC,
      title: "長さの単位換算",
      short: "m・cm・mm・km・inch・ft を相互換算。",
      long:
        "メートル法・ヤードポンド法の長さを相互に換算します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "unit-length.html",
    },
    fuelEconomy: {
      iconSvg: ICON_CALC,
      title: "燃費換算（km/L ⇔ L/100km）",
      short: "日本式燃費と欧州式を相互変換。",
      long:
        "km/L と L/100km を相互に変換します。\n\n【プライバシー】\n処理はブラウザ内のみです。",
      href: "fuel-economy.html",
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
    "slugify",
    "caseConvert",
    "lineSort",
    "textDiff",
    "regexTest",
    "unixTime",
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
    "creditCard",
    "zipJp",
    "zenkaku",
    "kataHira",
    "stopwatch",
    "pomodoro",
    "countdown",
    "textSplit",
    "csvView",
    "jwtDecode",
    "uaParse",
    "dpiCalc",
    "aspectRatio",
    "readingTime",
    "worldClock",
    "randomPick",
    "diceRoll",
    "nanoid",
    "subnet",
    "htmlEntity",
    "romanNum",
    "unitLength",
    "fuelEconomy",
  ];
})();
