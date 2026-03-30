# snap-tools

## GitHub Pages と URL（`.html` を付けない）

ツールは **`カテゴリ名/ツール名/index.html`**（例: [`text/counter/index.html`](text/counter/index.html)）として置き、公開 URL は `…/text/counter/` のようになります。プライバシーポリシーは [`legal/privacy/index.html`](legal/privacy/index.html)（`…/legal/privacy/`）です。

カテゴリ名は [`js/tool-registry.js`](js/tool-registry.js) の `TOOL_CATEGORY_MAP` と対応します（`text`, `encode`, `security`, `datetime`, `calc`, `design`, `dev`, `random`）。

## サイトルート `snap-root`

全ページの `<head>` に次があります（本番は **カスタムドメイン直下**のため空文字です）。

```html
<meta name="snap-root" content="">
```

- **GitHub Pages のプロジェクトサイト**（`https://<user>.github.io/snap-tools/`）だけで試す場合は、`content` を **`/snap-tools`**（先頭スラッシュ、末尾スラッシュなし）にするとパス計算が合います。
- **カスタムドメインでドメイン直下**（本番の `https://www.snap-tools.jp/` など）では `content` を **空文字** `""` に揃えてください。
- `snap-root` は [`js/partials-loader.js`](js/partials-loader.js) のパーシャル取得 URL と、トップ（`index.html`）・プライバシーへのリンク（`{{SNAP_HOME_HREF}}` / `{{SNAP_PRIVACY_HREF}}`）の算出に使われます。パーシャルは現在のパスからの**相対 URL**で取得するため、リポジトリ直下で `python -m http.server` を起動したときもヘッダーが表示されます（例: `http://localhost:8000/text/counter/`）。

## ツール追加手順

[`js/tool-registry.js`](js/tool-registry.js) のコメント（`TOOL_REGISTRY`・`TOOL_HOME_ORDER`・`TOOL_CATEGORY_MAP`）に従い、該当カテゴリフォルダの下に `ツール名/index.html` を追加してください。

## SEO（メタ・サイトマップ）

- 公開 URL のオリジンは [`scripts/seo-config.mjs`](scripts/seo-config.mjs) の `SITE_BASE_URL`（カスタムドメインへ変えたらここを更新）です。
- レジストリやトップ／プライバシーの説明文を変えたあと、次を実行すると、各ページの `<!-- snap-tools seo -->` ブロック（description・canonical・OG/Twitter・JSON-LD）・[`sitemap.xml`](sitemap.xml)（`lastmod` 付き）・[`robots.txt`](robots.txt) が再生成されます。

```bash
npm run seo:apply
```

（同等: `node scripts/apply-seo.mjs`）

- **OG 画像**（1200×630）を差し替える場合: [`img/og-default.png`](img/og-default.png) を編集したあと再デプロイ。同サイズで作り直す場合は `npm run og:image`（要 [Pillow](https://pypi.org/project/pillow/)）で再生成できます。
- **Google Search Console**（手動・デプロイ後）:
  1. [Search Console](https://search.google.com/search-console) でプロパティを追加し、所有権を確認する。
  2. 「サイトマップ」で `https://www.snap-tools.jp/sitemap.xml` を送信する（`SITE_BASE_URL` と一致させる）。
  3. 「ページ」「検索パフォーマンス」でインデックス状況を確認する。
