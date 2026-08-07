/* Emit a self-contained page per home-hero option, ready to shoot.

   Same approach as build-heroes.mjs: real webfonts and photographs inlined as
   data URIs, so a capture can never come out in a fallback serif or with a
   missing image, and so the files open anywhere without a dev server.

   Run: node sketches/build-home-heroes.mjs */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import { HOME_HEROES } from "./home-heroes.js";

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
  "Clinics",
  "About",
  "Testimonials",
  "Prices",
];

/* The dark options put the header on the photograph — which is half of what
   the reference is doing — so it loses its white bar and picks up a booking
   pill on the right. The light options keep today's header untouched. */
const header = (dark) => `<header class="site-header${dark ? " site-header--over" : ""}">
  <a class="wordmark" href="#" aria-label="NJH Sports Therapy and Pilates, home">
    <img class="wordmark__mark" src="${mark}" alt="" width="218" height="198" />
    <span class="wordmark__name">NJH</span>
    <span class="wordmark__descriptor">Sports Therapy<br />&amp; Pilates</span>
  </a>
  <nav class="site-nav" aria-label="Primary navigation">
    ${NAV.map((item) => `<a href="#"${item === "Home" ? ' aria-current="page"' : ""}>${item}</a>`).join("\n    ")}
    ${dark ? '<a class="header-cta" href="#contact">Book now</a>' : '<a class="site-nav__contact" href="#contact">Contact</a>'}
  </nav>
</header>`;

const shellCss = `
body{margin:0}
.site-header--over{border-bottom:0;background:none}
/* The mark is a solid indigo SVG; knocking it to white is a sketch shortcut —
   the real build would ship a light variant of the file. */
.site-header--over .wordmark__mark{filter:brightness(0) invert(1)}
.site-header--over .wordmark__name,
.site-header--over .site-nav a{color:var(--on-dark)}
.site-header--over .wordmark__descriptor{border-left-color:rgb(255 255 255 / .34);color:var(--on-dark)}
.site-header--over .site-nav a[aria-current]{color:var(--periwinkle)}
/* The booking pill costs the nav about 150px, so the links close up to pay
   for it. Nine items plus a pill is the real constraint here — trimming the
   nav is a separate conversation, and these captures are about the hero. */
.site-header--over .site-nav{gap:clamp(16px,1.85vw,30px)}
.header-cta{display:inline-flex;min-height:44px;padding:0 22px;align-items:center;margin-left:8px;border-radius:2px;background:var(--brand);color:var(--on-dark);font-size:12px;font-weight:600;letter-spacing:.12em;text-indent:.12em;text-transform:uppercase;text-decoration:none}
.header-cta::after{display:none}
`;

const page = (hero) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Home hero — ${hero.name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/home-heroes.css")}</style>
<style>${shellCss}</style>
</head>
<body>
${header(hero.dark)}
${hero.build()}
</body>
</html>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const hero of HOME_HEROES) {
  writeFileSync(resolve(root, `sketches/out/home-hero-${hero.id}.html`), inlineImages(page(hero)));
  console.log(`home-hero-${hero.id}.html  ${hero.name}`);
}
