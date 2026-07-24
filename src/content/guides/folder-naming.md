---
title: "案件フォルダとファイル命名ルールの決め方"
description: "探す時間を減らすフォルダ構成とファイル命名の型。個人・少人数の制作／事務向け。"
category: organize
pillar: true
relatedGuides:
  - team-folder-template
  - delivery-checklist
relatedTools: []
draft: false
---

## 結論

誰向けか: ファイルが散らばり、探す時間が積み上がっている個人・少人数チーム。

片付くこと: 案件ごとの置き場所と名前の型が決まる。完璧な分類より、**迷わず置ける規則**を優先します。

## フォルダの基本形

```
YYYY-案件名/
  00_admin/
  10_input/
  20_work/
  30_review/
  40_delivery/
```

番号付きにすると並びが安定します。`admin` に見積もり・契約メモ、`delivery` に最終提出物だけを置くと納品時に迷いません。

## ファイル命名の型

`日付_内容_版`（例: `2026-07-24_top_design_v03.fig`）

- 日付は ISO（YYYY-MM-DD）  
- 版は `v01` から通し  
- 最終提出は `final` を末尾に付けるか、`40_delivery` にコピー  

## 運用ルール（短く）

1. 作業中は `20_work` 以外に増やさない  
2. レビュー返却は `30_review` に日付付きで残す  
3. 納品後に作業ファイルを delivery へ混ぜない  

少人数チーム向けの拡張例は [チーム向けフォルダ構成テンプレ](/guides/team-folder-template/) へ。

## FAQ

### クラウドとローカルでルールを分けるべき？

原則同じ名前にします。置き場所だけツールの都合で変えます。

### 古い版は消す？

納品前は残し、納品後に `archive` へ移す運用が安全です。

## 関連

- [少人数チーム向けフォルダ構成テンプレ](/guides/team-folder-template/)
- [納品前チェックリストの作り方](/guides/delivery-checklist/)

