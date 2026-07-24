# Snap Tools

Astro 静的サイト（再構築）。本番: https://www.snap-tools.jp/  
オフィス正本: [`is4mu/virtual-office`](https://github.com/is4mu/virtual-office) の `projects/snap-tools/`

## 開発

```bash
npm install
npm run dev
npm run build
npm run preview
```

`main` への push で GitHub Actions が `dist` を GitHub Pages にデプロイする。

## ルート

- `/` `/about/` `/contact/` `/legal/privacy/`
- `/topics/{estimate|delivery|organize|comms|calc}/`
- `/guides/{slug}/`
- `/tools/estimate-letter|delivery-checklist|workdays-buffer/`
