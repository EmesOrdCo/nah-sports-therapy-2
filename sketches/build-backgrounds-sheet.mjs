/* Assemble the background captures into one browsable sheet, plus a single
   PNG grid for a quick side-by-side.

   Run after build-backgrounds.mjs:  node sketches/build-backgrounds-sheet.mjs */

import { chromium } from "playwright-core";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { VARIANTS } from "./backgrounds.js";

const OUT = fileURLToPath(new URL("./out/backgrounds/", import.meta.url));
const root = fileURLToPath(new URL("../", import.meta.url));
const b64 = (p) => readFileSync(root + p).toString("base64");

const FONTS = [
  ["STIX Two Text", 400, "normal", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-400-normal.woff2"],
  ["Hanken Grotesk Variable", "100 900", "normal", "node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2"],
];
const faces = FONTS.map(
  ([family, weight, style, file]) =>
    `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64(file)}) format("woff2");}`,
).join("\n");

const PAGES = [
  ["prices", "Prices"],
  ["testimonials", "Testimonials"],
  ["faq", "FAQ"],
];

const card = (v, route) => `
  <figure class="card">
    <a href="${route}-${v.id}.png" target="_blank"><img src="${route}-${v.id}.png" alt="" loading="lazy" /></a>
    <figcaption><span class="tag">${v.id.toUpperCase()}</span> ${v.name}</figcaption>
  </figure>`;

const html = `<!doctype html>
<meta charset="utf-8" />
<title>NJH — background treatments</title>
<style>
${faces}
:root {
  --ink: #23223f; --soft: #55597a; --line: #e3e5ee; --brand: #3c448b;
  --serif: "STIX Two Text", Georgia, serif;
  --sans: "Hanken Grotesk Variable", system-ui, sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; padding: 64px 5vw 120px; font-family: var(--sans); color: var(--ink); background: #fbfbfd; }
h1 { font-family: var(--serif); font-size: 42px; font-weight: 400; margin: 0 0 8px; }
.lede { color: var(--soft); max-width: 62ch; line-height: 1.6; margin: 0 0 56px; }
h2 { font-family: var(--serif); font-weight: 400; font-size: 30px; margin: 72px 0 4px; }
h2 + p { color: var(--soft); margin: 0 0 28px; font-size: 15px; }
.key { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); margin-bottom: 40px; }
.key div { border-left: 2px solid var(--brand); padding: 2px 0 2px 16px; }
.key h3 { font-size: 15px; margin: 0 0 6px; letter-spacing: 0.01em; }
.key p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--soft); }
.grid { display: grid; gap: 28px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.card { margin: 0; }
.card img { width: 100%; display: block; border: 1px solid var(--line); border-radius: 6px; background: #fff; }
figcaption { font-size: 13px; color: var(--soft); margin-top: 10px; }
.tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; color: var(--brand); border: 1px solid var(--line); border-radius: 3px; padding: 2px 5px; margin-right: 6px; }
</style>
<h1>Background treatments</h1>
<p class="lede">Eight directions, each shot over the live FAQ, Testimonials and Prices pages. Nothing about the content, type or spacing has been changed — every one of these is a layer added behind the existing layout, so any of them could ship without touching the pages themselves. Click a capture to open it full size.</p>

<div class="key">
${VARIANTS.map((v) => `<div><h3>${v.id.toUpperCase()} · ${v.name}</h3><p>${v.blurb}</p></div>`).join("\n")}
</div>

${PAGES.map(
  ([route, label]) => `
<h2>${label}</h2>
<p>All eight treatments over the live /${route} page.</p>
<div class="grid">${VARIANTS.map((v) => card(v, route)).join("")}</div>`,
).join("\n")}
`;

writeFileSync(`${OUT}index.html`, html);
console.log("sheet →", `${OUT}index.html`);

/* A single PNG of the eight over Prices, cropped to the top of the page, for
   the case where the whole set has to read in one glance. */
const browser = await chromium.launch();
/* Short viewport on purpose — fullPage takes the taller of viewport and
   content, and a tall one leaves a band of dead paper under the last row. */
const page = await browser.newPage({ viewport: { width: 1600, height: 600 } });

const strip = `<!doctype html><meta charset="utf-8"><style>
${faces}
body { margin: 0; padding: 30px; background: #fbfbfd; font-family: "Hanken Grotesk Variable", sans-serif;
       display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px; }
figure { margin: 0; }
.shot { height: 380px; overflow: hidden; border: 1px solid #e3e5ee; border-radius: 5px; background: #fff; }
.shot img { width: 100%; display: block; }
figcaption { font-size: 12px; color: #55597a; margin-top: 8px; }
b { color: #3c448b; letter-spacing: 0.1em; font-size: 10px; }
</style>
${VARIANTS.map(
  (v) => `<figure><div class="shot"><img src="data:image/png;base64,${readFileSync(`${OUT}prices-${v.id}.png`).toString("base64")}" /></div>
  <figcaption><b>${v.id.toUpperCase()}</b> &nbsp;${v.name}</figcaption></figure>`,
).join("")}`;

await page.setContent(strip, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${OUT}contact-sheet.png`, fullPage: true });
console.log("contact sheet →", `${OUT}contact-sheet.png`);

await browser.close();
