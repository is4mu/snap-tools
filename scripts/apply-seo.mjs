/**
 * tool-registry から description / canonical / OG / Twitter / JSON-LD を各 index.html に注入し、
 * sitemap.xml（lastmod 付き）を生成する。メタ更新後は本スクリプトを再実行すること。
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SITE_BASE_URL } from "./seo-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const SITE_NAME = "Snap Tools";

function loadRegistry() {
  const code = fs.readFileSync(
    path.join(REPO_ROOT, "js/tool-registry.js"),
    "utf8"
  );
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window.TOOL_REGISTRY || {};
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function truncateDescription(s, max = 160) {
  const oneLine = String(s).replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return oneLine.slice(0, max - 1).trim() + "…";
}

function canonicalUrl(pathSuffix) {
  const p = pathSuffix.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!p) return `${SITE_BASE_URL}/`;
  return `${SITE_BASE_URL}/${p}/`;
}

/** script 内 JSON 用（終端タグ混入を防ぐ） */
function serializeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function buildSeoBlock({
  pageTitle,
  description,
  canonical,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  jsonLd,
}) {
  const esc = escapeAttr;
  const d = esc(description);
  const t = esc(pageTitle);
  const c = esc(canonical);
  const img = esc(ogImage);
  const w = String(ogImageWidth);
  const h = String(ogImageHeight);
  const ld =
    jsonLd != null
      ? `\n    <script type="application/ld+json">${serializeJsonLd(jsonLd)}</script>`
      : "";
  return `    <!-- snap-tools seo -->
    <meta name="description" content="${d}">
    <link rel="canonical" href="${c}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${t}">
    <meta property="og:description" content="${d}">
    <meta property="og:url" content="${c}">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:site_name" content="snap-tools">
    <meta property="og:image" content="${img}">
    <meta property="og:image:width" content="${w}">
    <meta property="og:image:height" content="${h}">
    <meta property="og:image:alt" content="${esc(pageTitle)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${t}">
    <meta name="twitter:description" content="${d}">${ld}
    <!-- /snap-tools seo -->`;
}

const SEO_MARKER_START = "<!-- snap-tools seo -->";
const SEO_MARKER_END = "<!-- /snap-tools seo -->";

function injectOrReplaceSeo(html, block) {
  if (html.includes(SEO_MARKER_START)) {
    const re = /<!-- snap-tools seo -->[\s\S]*?<!-- \/snap-tools seo -->/;
    if (!re.test(html)) {
      throw new Error("Malformed snap-tools seo markers");
    }
    return html.replace(re, block.trim());
  }
  const anchor = '<meta name="snap-root" content="">';
  if (!html.includes(anchor)) {
    throw new Error("Expected snap-root meta not found");
  }
  return html.replace(anchor, `${anchor}\n${block}`);
}

function writeHtmlFile(relPath, block) {
  const full = path.join(REPO_ROOT, relPath);
  let html = fs.readFileSync(full, "utf8");
  html = injectOrReplaceSeo(html, block);
  fs.writeFileSync(full, html, "utf8");
}

const OG_IMAGE_W = 1200;
const OG_IMAGE_H = 630;
const OG_IMAGE = `${SITE_BASE_URL}/img/og-default.png`;

const HOME = {
  path: "index.html",
  pageTitle: "Snap Tools",
  description:
    "Snap Tools はブラウザだけで完結する無料のユーティリティ集。文字数カウント、パスワード生成、日付変換、各種エンコード、QR コードなど、多数の小さなツールを利用できます。",
  canonical: canonicalUrl(""),
};

const PRIVACY = {
  path: "legal/privacy/index.html",
  pageTitle: "プライバシーポリシー | snap-tools",
  description:
    "Snap Tools のプライバシーポリシー。Google アドセンスおよび Google アナリティクスによる Cookie・データの取り扱いについて説明します。",
  canonical: canonicalUrl("legal/privacy"),
};

function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: canonicalUrl(""),
    description: HOME.description,
    inLanguage: "ja",
  };
}

function webPageJsonLd({ name, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage: "ja",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: canonicalUrl(""),
    },
  };
}

function lastmodIsoDate(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  const stat = fs.statSync(full);
  return stat.mtime.toISOString().slice(0, 10);
}

function main() {
  const registry = loadRegistry();
  /** @type {{ loc: string, changefreq: string, priority: string, relFile: string }[]} */
  const urlEntries = [];

  urlEntries.push({
    loc: canonicalUrl(""),
    changefreq: "weekly",
    priority: "1.0",
    relFile: HOME.path,
  });

  writeHtmlFile(
    HOME.path,
    buildSeoBlock({
      pageTitle: HOME.pageTitle,
      description: HOME.description,
      canonical: HOME.canonical,
      ogImage: OG_IMAGE,
      ogImageWidth: OG_IMAGE_W,
      ogImageHeight: OG_IMAGE_H,
      jsonLd: webSiteJsonLd(),
    })
  );

  urlEntries.push({
    loc: PRIVACY.canonical,
    changefreq: "yearly",
    priority: "0.3",
    relFile: PRIVACY.path,
  });

  writeHtmlFile(
    PRIVACY.path,
    buildSeoBlock({
      pageTitle: PRIVACY.pageTitle,
      description: PRIVACY.description,
      canonical: PRIVACY.canonical,
      ogImage: OG_IMAGE,
      ogImageWidth: OG_IMAGE_W,
      ogImageHeight: OG_IMAGE_H,
      jsonLd: webPageJsonLd({
        name: PRIVACY.pageTitle,
        description: PRIVACY.description,
        url: PRIVACY.canonical,
      }),
    })
  );

  for (const id of Object.keys(registry)) {
    const meta = registry[id];
    if (!meta || !meta.href) continue;
    const hrefPath = meta.href.replace(/\/+$/, "");
    const relHtml = path.join(hrefPath, "index.html");
    const full = path.join(REPO_ROOT, relHtml);
    if (!fs.existsSync(full)) {
      console.warn("Missing file for registry entry:", id, relHtml);
      continue;
    }
    const pageTitle = `${meta.title} | snap-tools`;
    const description = truncateDescription(meta.medium || meta.short);
    const canonical = canonicalUrl(hrefPath);
    writeHtmlFile(
      relHtml,
      buildSeoBlock({
        pageTitle,
        description,
        canonical,
        ogImage: OG_IMAGE,
        ogImageWidth: OG_IMAGE_W,
        ogImageHeight: OG_IMAGE_H,
        jsonLd: webPageJsonLd({
          name: pageTitle,
          description,
          url: canonical,
        }),
      })
    );
    urlEntries.push({
      loc: canonical,
      changefreq: "monthly",
      priority: "0.8",
      relFile: relHtml,
    });
  }

  urlEntries.sort((a, b) => a.loc.localeCompare(b.loc));

  const sitemapBody = urlEntries
    .map((u) => {
      const lm = lastmodIsoDate(u.relFile);
      return `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(lm)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapBody}
</urlset>
`;
  fs.writeFileSync(path.join(REPO_ROOT, "sitemap.xml"), sitemap, "utf8");

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(REPO_ROOT, "robots.txt"), robots, "utf8");

  console.log("SEO meta applied and sitemap.xml / robots.txt written.");
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main();
