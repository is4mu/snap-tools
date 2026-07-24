# Snap Tools（再構築 / ST-105）

Astro 静的サイト。正本の仕様・原稿・計画は [`is4mu/virtual-office`](https://github.com/is4mu/virtual-office) の `projects/snap-tools/`。

## 重要

- **このブランチはプレビュー用。** `main`（現行 GitHub Pages / 旧ツール集）へのマージ＝本番相当のため、公開承認と owner-actions があるまでマージしない。
- AdSense / GA ID は未埋め込み。`AdSlot` はプレースホルダのみ。
- 旧ツール集の移植はしない。

## 開発

```bash
npm install
npm run dev
npm run build
npm run preview
```

## ルート

- `/` `/about/` `/contact/` `/legal/privacy/`
- `/topics/{estimate|delivery|organize|comms|calc}/`
- `/guides/{slug}/`（12本）
- `/tools/estimate-letter|delivery-checklist|workdays-buffer/`

## マイルストーン対応

| 段階 | 内容 |
|------|------|
| M0 | Astro 骨格・トークン・Header/Footer |
| M1 | ページ型＋ AdSlot ＋ topics/guides |
| M2 | I1–I3 |
| M3 | 静的必須ページ・sitemap・robots・404 |
| M4 | A-009 原稿流し込み・内部リンク |
