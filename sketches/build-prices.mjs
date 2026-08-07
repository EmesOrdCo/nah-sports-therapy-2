/* Emit a self-contained page per prices direction, ready to shoot.

   Self-contained because the captures have to show the real webfonts, and
   because the files then open anywhere — including in a mail to the client —
   without a dev server.

   Run: node sketches/build-prices.mjs */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VARIANTS } from "./prices.js";

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

const mark = `data:image/svg+xml;base64,${b64("public/images/njh-mark.svg")}`;

const header = (dark) => `<header class="site-header${dark ? " site-header--dark" : " is-scrolled"}">
  <a class="wordmark" href="#" aria-label="NJH Sports Therapy and Pilates, home">
    <img class="wordmark__mark" src="${mark}" alt="" width="218" height="198" />
    <span class="wordmark__name">NJH</span>
    <span class="wordmark__descriptor">Sports Therapy<br />&amp; Pilates</span>
  </a>
  <nav class="site-nav">
    <a href="#">Home</a><a href="#">Pilates</a><a href="#">Clinics</a>
    <a href="#">Sports Therapy</a><a href="#">About</a><a href="#">FAQ</a>
    <a href="#">Testimonials</a><a href="#" aria-current="page">Prices</a><a href="#">Contact</a>
  </nav>
</header>`;

const footer = () => `<footer class="sk-footer">
  <div class="section-shell sk-footer__inner">
    <span>NJH</span><span>© 2026 NJH Sports Therapy &amp; Pilates</span>
  </div>
</footer>`;

/* The site header is fixed and the reveal observer never runs in a headless
   full-page capture, so both are neutralised here rather than in prices.css —
   they are properties of the harness, not of any direction. */
const shellCss = `
body{margin:0}
.site-header{position:absolute;top:0;left:0;right:0}
.site-header .site-nav{display:flex;gap:clamp(14px,1.8vw,30px);align-items:center}
.site-header .site-nav a{color:var(--ink);font-size:14px;text-decoration:none}
.site-header .site-nav a[aria-current]{color:var(--brand)}
.site-header--dark{background:none;border-bottom:0}
.site-header--dark .site-nav a{color:var(--on-dark)}
.site-header--dark .site-nav a[aria-current]{color:var(--periwinkle)}
.site-header--dark .wordmark__name,.site-header--dark .wordmark__descriptor{color:var(--on-dark)}
[data-reveal],[data-reveal].pre-reveal{opacity:1;transform:none}
.sk-footer{padding:34px 0;background:var(--navy-deep);color:rgba(242,246,255,.55);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.sk-footer__inner{display:flex;justify-content:space-between}
`;

const page = (v) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Prices — ${v.name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/prices.css")}</style>
<style>${shellCss}</style>
</head>
<body class="is-inner-page">
${header(v.dark)}
<main>${v.build()}</main>
${footer()}
</body>
</html>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const v of VARIANTS) {
  writeFileSync(resolve(root, `sketches/out/prices-${v.id}.html`), page(v));
  console.log(`prices-${v.id}.html  ${v.name}`);
}
