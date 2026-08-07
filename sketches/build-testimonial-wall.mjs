/* Emit self-contained sketches of the three-column testimonial wall, then
   shoot them.

   Same approach as the hero sketches: real webfonts inlined as data URIs and
   the live style.css pulled in whole, so the capture is judged against the
   actual type and colour rather than a fallback serif.

   Unlike the hero sketches these pages move, so the .html files are the real
   deliverable — the .png is only a still for the chat. Open the html to see
   the motion and the hover-to-stop.

   Run: node sketches/build-testimonial-wall.mjs */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright-core";
import { REVIEWS, SPORTS_THERAPY, PILATES } from "../src/reviews.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = resolve(here, "out");
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

const NAV = ["Home", "Pilates", "Sports Therapy", "Clinics", "About", "FAQ", "Testimonials", "Prices"];

const header = `<header class="site-header">
  <a class="wordmark" href="#" aria-label="NJH Sports Therapy and Pilates, home">
    <img class="wordmark__mark" src="${mark}" alt="" width="218" height="198" />
    <span class="wordmark__name">NJH</span>
    <span class="wordmark__descriptor">Sports Therapy<br />&amp; Pilates</span>
  </a>
  <nav class="site-nav" aria-label="Primary navigation">
    ${NAV.map((item) => `<a href="#"${item === "Testimonials" ? ' aria-current="page"' : ""}>${item}</a>`).join("\n    ")}
    <a class="site-nav__contact" href="#contact">Contact</a>
  </nav>
</header>`;

/* Three columns means three buckets, and today there are only two services.
   The reviews tagged with both are the third bucket here — it is the only
   split the existing data supports without inventing a category. If NJH wants
   a different third column the buckets change; the layout does not. */
const only = (service, not) =>
  REVIEWS.filter((r) => r.services.includes(service) && !r.services.includes(not));

const COLUMNS = [
  {
    label: "Sports Therapy",
    direction: "down",
    speed: "48s",
    list: only(SPORTS_THERAPY, PILATES),
  },
  {
    label: "Both",
    direction: "up",
    speed: "56s",
    list: REVIEWS.filter((r) => r.services.length > 1),
  },
  {
    label: "Pilates",
    direction: "down",
    speed: "52s",
    list: only(PILATES, SPORTS_THERAPY),
  },
];

const card = (review) => `<figure class="wall__card">
        <blockquote>&ldquo;${review.quote}&rdquo;</blockquote>
        <figcaption>${review.name}</figcaption>
      </figure>`;

/* The list is emitted twice. The track slides by exactly half its own height,
   so the second copy is sitting where the first started when the keyframe
   wraps and there is no jump to hide. */
const column = (col) => `<div class="wall__col wall__col--${col.direction}" style="--speed:${col.speed}">
    <p class="wall__pin">${col.label}</p>
    <div class="wall__window">
      <div class="wall__track">
        ${[...col.list, ...col.list].map(card).join("\n        ")}
      </div>
    </div>
  </div>`;

const wall = (variant) => `<section class="tiny-hero">
  <div class="tiny-hero__inner">
    <div class="tiny-hero__row">
      <div>
        <p class="section-kicker">Testimonials</p>
        <h1>In clients&rsquo; own words.</h1>
      </div>
      <p class="tiny-hero__intro">What people say after working with Natasha. Hover to stop a column and read.</p>
    </div>
    <div class="tiny-hero__filter">
      <button type="button" class="is-active">All</button>
      <button type="button">Sports Therapy</button>
      <button type="button">Pilates</button>
    </div>
  </div>
</section>
<section class="wall wall--${variant}" aria-label="Client testimonials">
  <div class="wall__inner">
    <div class="wall__head">
      ${COLUMNS.map((c) => `<p class="wall__label">${c.label} <span>${c.list.length}</span></p>`).join("\n      ")}
    </div>
    <div class="wall__grid">
      ${COLUMNS.map(column).join("\n    ")}
    </div>
  </div>
</section>`;

const page = (variant, name) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Testimonial wall — ${name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/testimonial-wall.css")}</style>
<style>body{margin:0}</style>
</head>
<body>
${header}
${wall(variant)}
</body>
</html>`;

const VARIANTS = [
  ["a", "hairline cards, labels above"],
  ["b", "shadowed cards, pinned labels"],
];

mkdirSync(outDir, { recursive: true });

for (const [id, name] of VARIANTS) {
  writeFileSync(resolve(outDir, `testimonial-wall-${id}.html`), page(id, name));
  console.log(`testimonial-wall-${id}.html  ${name}`);
}

/* Shoot a still of each. The columns are mid-animation, so the frame is
   whatever the loop happens to be showing — which is the point. */
const browser = await chromium.launch();
const shot = await browser.newPage({
  viewport: { width: 1440, height: 940 },
  deviceScaleFactor: 2,
});

for (const [id] of VARIANTS) {
  const file = resolve(outDir, `testimonial-wall-${id}.html`);
  await shot.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
  await shot.evaluate(() => document.fonts.ready);
  const png = resolve(outDir, `testimonial-wall-${id}.png`);
  await shot.screenshot({ path: png });
  console.log(png);
}

await browser.close();
