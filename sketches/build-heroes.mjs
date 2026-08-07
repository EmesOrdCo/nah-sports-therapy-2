/* Emit a self-contained page per hero option, ready to shoot.

   Self-contained because the screenshots have to show the real webfonts, and
   because the resulting files open anywhere without a dev server. Photographs
   referenced as /images/… are rewritten to data URIs on the way out.

   Run: node sketches/build-heroes.mjs */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import { HEROES as PLAIN } from "./heroes.js";
import { HEROES as BOLD } from "./heroes-bold.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");

const FONTS = [
  ["STIX Two Text", 400, "normal", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-400-normal.woff2"],
  ["STIX Two Text", 400, "italic", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-400-italic.woff2"],
  ["STIX Two Text", 600, "normal", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-600-normal.woff2"],
  ["Hanken Grotesk Variable", "100 900", "normal", "node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2"],
];

const faces = FONTS.map(
  ([family, weight, style, file]) =>
    `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64(file)}) format("woff2");}`,
).join("\n");

const MIME = { ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" };

/* Any src="/images/…" in a hero becomes a data URI, so a capture can never
   silently come out with a missing photograph. */
function inlineImages(html) {
  return html.replace(/src="(\/images\/[^"]+)"/g, (whole, url) => {
    const file = resolve(root, `public${url}`);
    if (!existsSync(file)) throw new Error(`missing asset: ${url}`);
    const mime = MIME[extname(url)] ?? "application/octet-stream";
    return `src="data:${mime};base64,${readFileSync(file).toString("base64")}"`;
  });
}

const mark = `data:image/svg+xml;base64,${b64("public/images/njh-mark.svg")}`;

/* Over a dark hero the header must stay transparent — the scrolled state
   paints a white bar, which buries the wordmark. */
const header = (dark) => `<header class="site-header${dark ? " site-header--dark" : " is-scrolled"}">
  <a class="wordmark" href="#" aria-label="NJH Sports Therapy and Pilates, home">
    <img class="wordmark__mark" src="${mark}" alt="" width="218" height="198" />
    <span class="wordmark__name">NJH</span>
    <span class="wordmark__descriptor">Sports Therapy<br />&amp; Pilates</span>
  </a>
  <nav class="site-nav">
    <a href="#">Home</a><a href="#">Pilates</a><a href="#">Clinics</a>
    <a href="#">Sports Therapy</a><a href="#">About</a>
    <a href="#" aria-current="page">FAQ</a><a href="#">Testimonials</a>
    <a href="#">Prices</a><a href="#">Contact</a>
  </nav>
</header>`;

const shellCss = `
.site-header{position:absolute;top:0;left:0;right:0}
.site-header .site-nav{display:flex;gap:clamp(14px,1.8vw,30px);align-items:center}
.site-header .site-nav a{color:var(--ink);font-size:14px;text-decoration:none}
.site-header .site-nav a[aria-current]{color:var(--brand)}
.site-header--dark{background:none;border-bottom:0}
.site-header--dark .site-nav a{color:var(--on-dark)}
.site-header--dark .site-nav a[aria-current]{color:var(--periwinkle)}
.site-header--dark .wordmark__name,.site-header--dark .wordmark__descriptor{color:var(--on-dark)}
body{margin:0}
`;

const page = (hero) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>FAQ hero — ${hero.name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/heroes.css")}</style>
<style>${read("sketches/heroes-bold.css")}</style>
<style>${shellCss}</style>
</head>
<body class="is-inner-page">
${header(hero.dark)}
${hero.build()}
</body>
</html>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const hero of [...PLAIN, ...BOLD]) {
  writeFileSync(resolve(root, `sketches/out/hero-${hero.id}.html`), inlineImages(page(hero)));
  console.log(`hero-${hero.id}.html  ${hero.name}`);
}
