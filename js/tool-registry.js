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
  };

  /** トップページのツールカード表示順（id は TOOL_REGISTRY のキー＝data-tool-id） */
  window.TOOL_HOME_ORDER = ["counter", "password", "wareki", "qr"];
})();
