/* Emit a self-contained page per charity-section direction, ready to shoot.

   Self-contained because the captures have to show the real webfonts, and
   because the files then open anywhere — including in a mail to the client —
   without a dev server.

   Run: node sketches/build-charity.mjs */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VARIANTS } from "./charity.js";

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

/* The real footer, because the point of contention is partly how the section
   hands over to it — a navy band sitting straight on a navy-deep footer. */
const footer = () => `<footer class="site-footer">
  <div class="section-shell site-footer__grid">
    <a class="wordmark site-footer__wordmark" href="#" aria-label="NJH home">
      <img class="wordmark__mark" src="${mark}" alt="" width="218" height="198" />
      <span class="wordmark__name">NJH</span>
      <span class="wordmark__descriptor">Sports Therapy<br />&amp; Pilates</span>
    </a>
    <div><p class="site-footer__label">Treatment</p><a href="#">Sports Therapy</a><a href="#">Techniques</a><a href="#">Your appointment</a></div>
    <div><p class="site-footer__label">Movement</p><a href="#">Clinical Pilates</a><a href="#">Timetable</a><a href="#">Practical details</a></div>
    <div><p class="site-footer__label">Practice</p><a href="#">About Natasha</a><a href="#">FAQ</a><a href="#">Locations</a><a href="#">Testimonials</a><a href="#">Prices</a><a href="#">Contact</a></div>
  </div>
  <div class="section-shell site-footer__bottom">
    <p>© 2026 NJH Sports Therapy &amp; Pilates</p>
    <p>Website information does not replace individual medical advice.</p>
  </div>
</footer>`;

/* A caption strip above each capture, so a contact sheet of six is readable
   without cross-referencing filenames. */
const slug = (v) => `<div class="sk-slug"><b>${v.id.toUpperCase()}</b><span>${v.name}</span></div>`;

/* The reveal observer never runs in a headless capture, so [data-reveal] is
   neutralised here rather than in charity.css — that is a property of the
   harness, not of any direction. */
const shellCss = `
body{margin:0}
[data-reveal],[data-reveal].pre-reveal{opacity:1;transform:none}
.sk-slug{display:flex;gap:14px;align-items:baseline;padding:14px var(--page-gutter);background:var(--navy-deep);color:rgba(242,246,255,.62);font-family:var(--font-sans);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.sk-slug b{color:#fff}
`;

const page = (v) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Charity — ${v.name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/charity.css")}</style>
<style>${shellCss}</style>
</head>
<body class="is-inner-page">
${slug(v)}
<main>${v.build()}</main>
${footer()}
</body>
</html>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const v of VARIANTS) {
  writeFileSync(resolve(root, `sketches/out/charity-${v.id}.html`), page(v));
  console.log(`charity-${v.id}.html  ${v.name}`);
}
