/* One image with all six home-hero options plus the current hero, for sending
   to the client in a single file rather than seven attachments.

   Run: node sketches/contact-sheet-home-heroes.mjs
   (after build-home-heroes.mjs and shoot-home-heroes.mjs) */

import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { HOME_HEROES } from "./home-heroes.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = resolve(here, "out");

const b64 = (p) => readFileSync(p).toString("base64");
const shot = (file) => {
  const p = resolve(outDir, file);
  if (!existsSync(p)) throw new Error(`missing capture: ${file} — run shoot-home-heroes.mjs first`);
  return `data:image/png;base64,${b64(p)}`;
};

const FONTS = [
  ["STIX Two Text", 600, "normal", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-600-normal.woff2"],
  ["Hanken Grotesk Variable", "100 900", "normal", "node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2"],
];

const faces = FONTS.map(
  ([family, weight, style, file]) =>
    `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64(resolve(root, file))}) format("woff2");}`,
).join("\n");

const NOTES = {
  a: "Closest to the reference. Scrim weighted left so type always has ground.",
  b: "Symmetrical. Quieter and more premium; harder to scan.",
  c: "Keeps today's white surface. Header and the rest of the site unchanged.",
  d: "Photograph as a framed plate. Header never sits on a face.",
  e: "Copy on a white card — never depends on the photograph behind it.",
  f: "Stock pushed through the brand indigo. Carries proof at the fold.",
};

const tiles = [
  `<figure class="tile tile--now">
     <img src="${shot("home-hero-current.png")}" alt="" />
     <figcaption><b>Now</b><span>Today's home hero &mdash; white split with the X&#8209;ray.</span></figcaption>
   </figure>`,
  ...HOME_HEROES.map(
    (h) => `<figure class="tile">
     <img src="${shot(`home-hero-${h.id}.png`)}" alt="" />
     <figcaption><b>${h.name}</b><span>${NOTES[h.id]}</span></figcaption>
   </figure>`,
  ),
].join("\n");

const TILE = 940;

const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8" />
<style>${faces}</style>
<style>
  :root{--ink:#1b1c3a;--soft:#5b5f7d;--line:#e2e3ee}
  *{box-sizing:border-box}
  body{margin:0;padding:56px;background:#f6f6fa;color:var(--ink);
       font-family:"Hanken Grotesk Variable",system-ui,sans-serif}
  h1{margin:0 0 6px;font-family:"STIX Two Text",serif;font-size:40px;font-weight:600;letter-spacing:-.03em}
  .lede{max-width:76ch;margin:0 0 44px;color:var(--soft);font-size:16px;line-height:1.6}
  .grid{display:grid;gap:44px 40px;grid-template-columns:repeat(2,${TILE}px)}
  .tile{margin:0}
  .tile img{display:block;width:100%;border:1px solid var(--line);background:#fff}
  .tile--now img{opacity:.62}
  figcaption{display:grid;gap:3px;padding-top:12px}
  figcaption b{font-size:15px;font-weight:600;letter-spacing:.01em}
  figcaption span{color:var(--soft);font-size:14px;line-height:1.5}
</style></head>
<body>
  <h1>Home hero &mdash; six directions</h1>
  <p class="lede">All six carry identical copy so the only variable is the layout. Photography is placeholder stock already in the repo and gets replaced with Natasha's own images before anything ships.</p>
  <div class="grid">${tiles}</div>
</body></html>`;

const file = resolve(outDir, "home-hero-contact-sheet.html");
writeFileSync(file, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: TILE * 2 + 40 + 112, height: 1200 } });
await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = resolve(outDir, "home-hero-contact-sheet.png");
await page.screenshot({ path: png, fullPage: true });
await browser.close();
console.log(png);
