export const site = {
  name: 'Snap Tools',
  domain: 'snap-tools.jp',
  url: 'https://www.snap-tools.jp',
  tagline: '個人・少人数の制作／事務を速く片づけるショートカット集',
  description:
    '見積もり・納品・整理・連絡・日数計算。個人・少人数向けの手順ガイドと、すぐ使えるミニ道具。ブラウザで完結します。',
  /** Public client IDs (safe in frontend). From prior production site. */
  gaMeasurementId: 'G-CZZQCPMX5Z',
  adsenseClient: 'ca-pub-4645103012651649',
};

export type TopicId = 'estimate' | 'delivery' | 'organize' | 'comms' | 'calc';

export const topics: {
  id: TopicId;
  slug: string;
  name: string;
  blurb: string;
  tool?: { slug: string; label: string; cta: string };
}[] = [
  {
    id: 'estimate',
    slug: 'estimate',
    name: '見積もり',
    blurb: '見積もり文の型、内訳、修正回数の伝え方。',
    tool: { slug: 'estimate-letter', label: '見積もり文ジェネレータ', cta: '見積もり文を作る' },
  },
  {
    id: 'delivery',
    slug: 'delivery',
    name: '納品',
    blurb: '納品前チェックと、請求・納品メールの書き分け。',
    tool: { slug: 'delivery-checklist', label: '納品チェックリスト', cta: '納品前にチェックする' },
  },
  {
    id: 'organize',
    slug: 'organize',
    name: '整理',
    blurb: '案件フォルダとファイル命名の型。',
  },
  {
    id: 'comms',
    slug: 'comms',
    name: '連絡',
    blurb: '進捗・遅延・ヒアリングの文例。',
  },
  {
    id: 'calc',
    slug: 'calc',
    name: '計算',
    blurb: '作業日数とバッファ、時給換算の目安。',
    tool: { slug: 'workdays-buffer', label: '作業日数／バッファ計算', cta: '作業日数を計算する' },
  },
];

export const featuredGuides = [
  'estimate-letter',
  'delivery-checklist',
  'workdays-buffer',
] as const;

export const tools = [
  {
    id: 'i1',
    slug: 'estimate-letter',
    name: '見積もり文ジェネレータ',
    cta: '見積もり文を作る',
    related: ['estimate-letter', 'estimate-breakdown', 'revision-limits'],
  },
  {
    id: 'i2',
    slug: 'delivery-checklist',
    name: '納品チェックリスト',
    cta: '納品前にチェックする',
    related: ['delivery-checklist', 'invoice-delivery-mail'],
  },
  {
    id: 'i3',
    slug: 'workdays-buffer',
    name: '作業日数／バッファ計算',
    cta: '作業日数を計算する',
    related: ['workdays-buffer', 'hourly-rate-rough'],
  },
] as const;

export const nav = [
  { href: '/topics/estimate/', label: '見積もり' },
  { href: '/topics/delivery/', label: '納品' },
  { href: '/topics/organize/', label: '整理' },
  { href: '/topics/comms/', label: '連絡' },
  { href: '/topics/calc/', label: '計算' },
  { href: '/about/', label: 'About' },
];
