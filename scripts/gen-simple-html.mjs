import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const pages = [
  ["base64.html", "base64"],
  ["url-codec.html", "urlCodec"],
  ["html-escape.html", "htmlEscape"],
  ["json-format.html", "jsonFormat"],
  ["json-minify.html", "jsonMinify"],
  ["uuid-gen.html", "uuidGen"],
  ["sha256.html", "sha256"],
  ["slugify.html", "slugify"],
  ["case-convert.html", "caseConvert"],
  ["line-sort.html", "lineSort"],
  ["text-diff.html", "textDiff"],
  ["regex-test.html", "regexTest"],
  ["unix-time.html", "unixTime"],
  ["age-calc.html", "ageCalc"],
  ["bmi.html", "bmi"],
  ["percent-calc.html", "percentCalc"],
  ["loan-sim.html", "loanSim"],
  ["tax-jp.html", "taxJp"],
  ["radix-conv.html", "radixConv"],
  ["color-conv.html", "colorConv"],
  ["contrast.html", "contrast"],
  ["gradient-css.html", "gradientCss"],
  ["lorem.html", "lorem"],
  ["credit-card.html", "creditCard"],
  ["zip-jp.html", "zipJp"],
  ["zenkaku.html", "zenkaku"],
  ["kata-hira.html", "kataHira"],
  ["stopwatch.html", "stopwatch"],
  ["pomodoro.html", "pomodoro"],
  ["countdown.html", "countdown"],
  ["text-split.html", "textSplit"],
  ["csv-view.html", "csvView"],
  ["jwt-decode.html", "jwtDecode"],
  ["ua-parse.html", "uaParse"],
  ["dpi-calc.html", "dpiCalc"],
  ["aspect-ratio.html", "aspectRatio"],
  ["reading-time.html", "readingTime"],
  ["world-clock.html", "worldClock"],
  ["random-pick.html", "randomPick"],
  ["dice-roll.html", "diceRoll"],
  ["nanoid.html", "nanoid"],
  ["subnet.html", "subnet"],
  ["html-entity.html", "htmlEntity"],
  ["roman-num.html", "romanNum"],
  ["unit-length.html", "unitLength"],
  ["fuel-economy.html", "fuelEconomy"],
];

function htmlFor(id) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>snap-tools</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="js/tool-theme-init.js"></script>
    <link rel="stylesheet" href="css/site.css">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CZZQCPMX5Z"></script>
    <script src="js/gtag-config.js"></script>
</head>
<body class="page-tool tool-page">

<header id="site-header" class="site-header--tool" data-header-partial="tool"></header>

<div class="tool-chrome" data-tool-id="${id}">
    <div class="tool-panel simple-tool convert-tool"></div>
</div>

<script src="js/tool-registry.js"></script>
<script src="js/logo-mesh.js"></script>
<script src="js/partials-loader.js"></script>
<script src="js/tool-theme.js"></script>
<script src="js/copy-toast.js"></script>
<script src="js/tool-chrome.js"></script>
<script src="js/simple-tools-pages.js"></script>
</body>
</html>
`;
}

for (const [file, id] of pages) {
  fs.writeFileSync(path.join(root, file), htmlFor(id), "utf8");
}

console.log("Wrote", pages.length, "HTML files.");
