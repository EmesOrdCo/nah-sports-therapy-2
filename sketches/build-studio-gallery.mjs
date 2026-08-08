/* Emit a self-contained page per /studio gallery option, ready to shoot.

   Same approach as build-home-heroes.mjs: real webfonts and photographs
   inlined as data URIs, so a capture can never come out in a fallback serif
   or with a missing image, and so the files open anywhere without a dev
   server.

   Run: node sketches/build-studio-gallery.mjs */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import { STUDIO_GALLERIES } from "./studio-gallery.js";

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

const MIME = { ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

function inlineImages(html) {
  return html.replace(/src="(\/images\/[^"]+)"/g, (whole, url) => {
    const file = resolve(root, `public${url}`);
    if (!existsSync(file)) throw new Error(`missing asset: ${url}`);
    const mime = MIME[extname(url)] ?? "application/octet-stream";
    return `src="data:${mime};base64,${readFileSync(file).toString("base64")}"`;
  });
}

const mark = `data:image/svg+xml;base64,${b64("public/images/njh-mark.svg")}`;

const NAV = [
  "Home",
  "Pilates",
  "Sports Therapy",
  "Studio",
  "About",
  "FAQ",
  "Testimonials",
  "Prices",
  "Contact",
];

/* The header sits on the hero here exactly as it does on the real page, so
   the capture includes the light treatment the video hero already ships. */
const header = () => `<header class="site-header">
  <a class="wordmark" href="#" aria-label="NJH Sports Therapy and Pilates, home">
    <img class="wordmark__mark" src="${mark}" alt="" width="218" height="198" />
    <span class="wordmark__name">NJH</span>
    <span class="wordmark__descriptor">Sports Therapy<br />&amp; Pilates</span>
  </a>
  <nav class="site-nav" aria-label="Primary navigation">
    ${NAV.map((item) => `<a href="#"${item === "Studio" ? ' aria-current="page"' : ""}>${item}</a>`).join("\n    ")}
  </nav>
</header>`;

/* The real page's header rules key off `body:has(.clinics-hero)`, and the
   sketch has a .clinics-hero in it, so the light treatment applies on its
   own. All this adds is the body reset the app normally does. */
const shellCss = `
body{margin:0;background:#fff}
`;

const page = (option) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Studio gallery — ${option.name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/studio-gallery.css")}</style>
<style>${shellCss}</style>
</head>
<body>
${header()}
${option.build()}
</body>
</html>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const option of STUDIO_GALLERIES) {
  writeFileSync(
    resolve(root, `sketches/out/studio-gallery-${option.id}.html`),
    inlineImages(page(option)),
  );
  console.log(`studio-gallery-${option.id}.html  ${option.name}`);
}
