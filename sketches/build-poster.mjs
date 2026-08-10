/* Emit one self-contained A4 sheet per poster direction.

   Self-contained because these go to the client and then to a printer and a
   Facebook post: webfonts and photographs are inlined so a single .html file
   opens anywhere, prints right, and needs no dev server.

   Run: node sketches/build-poster.mjs */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import { VARIANTS, FOUNDATION_CSS } from "./poster.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = resolve(here, "out");
mkdirSync(outDir, { recursive: true });

const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");

const FONTS = [
  ["STIX Two Text", 400, "normal", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-400-normal.woff2"],
  ["STIX Two Text", 400, "italic", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-400-italic.woff2"],
  ["STIX Two Text", 600, "normal", "node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-600-normal.woff2"],
  ["Hanken Grotesk Variable", "100 900", "normal", "node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2"],
  ["Parisienne", 400, "normal", "node_modules/@fontsource/parisienne/files/parisienne-latin-400-normal.woff2"],
];

const faces = FONTS.map(
  ([family, weight, style, file]) =>
    `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64(file)}) format("woff2");}`,
).join("\n");

const MIME = {
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/* Every /images/… reference in the markup becomes a data URI. One regex rather
   than a token scheme, so the source stays readable as ordinary HTML. */
function inlineImages(html) {
  return html.replace(/"(\/images\/[^"]+)"/g, (whole, url) => {
    const file = `public${url}`;
    const mime = MIME[extname(url).toLowerCase()];
    if (!mime) throw new Error(`No MIME type known for ${url}`);
    return `"data:${mime};base64,${b64(file)}"`;
  });
}

for (const variant of VARIANTS) {
  const page = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>NJH Sports Therapy &amp; Pilates | ${variant.label}</title>
<style>
${faces}
${FOUNDATION_CSS}
${variant.css}
</style>
</head>
<body>
${inlineImages(variant.html)}
</body>
</html>`;
  const file = resolve(outDir, `${variant.slug}.html`);
  writeFileSync(file, page);
  console.log(`${file}  ${(page.length / 1024).toFixed(0)}kb`);
}
