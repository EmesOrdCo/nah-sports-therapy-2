/* Emit one self-contained page per binding, plus a contact sheet of all six.

   Self-contained for the same reason the charity and Q&A sketches are: the
   captures have to show the real webfonts, and the files then open anywhere —
   including in a mail — without a dev server.

   Each page shows the binding in the two states that matter: shut (what the
   reader meets first) and open (what they came for). The contact sheet puts
   all six shut states side by side, which is the only way to judge a binding.

   Run: node sketches/build-book-lab.mjs */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VARIANTS, book } from "./book-lab.js";

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

/* The band the books stand on. Deliberately the site's own off-white rather
   than a studio grey — a binding that only works on a neutral backdrop is not
   a binding that works on /client-stories. */
const shellCss = `
body{margin:0;background:#fff;color:#241f3f;font-family:var(--font-sans)}
.sk-slug{display:flex;gap:16px;align-items:baseline;padding:15px 40px;background:#14122c;color:rgba(242,246,255,.6);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.sk-slug b{color:#fff;letter-spacing:.2em}
.sk-slug i{font-style:normal;letter-spacing:.04em;text-transform:none;font-size:12px;opacity:.75}
.sk-stage{display:flex;align-items:center;justify-content:center;gap:70px;padding:96px 56px 104px;background:#fbfaf8}
.sk-stage--tight{gap:40px;flex-wrap:wrap;padding:80px 40px}
.sk-cap{margin:0 0 10px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8a869c;text-align:center}
.sk-cell{display:flex;flex-direction:column;align-items:center}
.sk-shut{display:flex;justify-content:center;margin-inline:calc(var(--bk-w) * -0.245)}
`;

const slug = (v) =>
  `<div class="sk-slug"><b>${v.id.toUpperCase()}</b><span>${v.name}</span><i>${v.note}</i></div>`;

const page = (title, body) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/book-lab.css")}</style>
<style>${shellCss}</style>
</head>
<body>
${body}
</body>
</html>`;

/* Shut and open at the two sizes each state wants: the closed book is half a
   spread wide, so it gets the smaller frame. */
const shut = (v, w) =>
  `<div class="sk-shut" style="--bk-w:${w}px">${book(v, 0)}</div>`;

const pair = (v) => `
<div class="sk-stage">
  <div class="sk-cell">
    <p class="sk-cap">Shut</p>
    ${shut(v, 780)}
  </div>
  <div class="sk-cell">
    <p class="sk-cap">Open</p>
    <div style="--bk-w:720px">${book(v, 1)}</div>
  </div>
</div>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const v of VARIANTS) {
  writeFileSync(
    resolve(root, `sketches/out/book-${v.id}.html`),
    page(`Casebook — ${v.name}`, `${slug(v)}${pair(v)}`),
  );
  console.log(`book-${v.id}.html  ${v.name}`);
}

/* The contact sheet: six shut books in a grid, which is how you actually pick
   a binding — the open spread is nearly identical across all six. */
const sheet = `
<div class="sk-slug"><b>Casebook</b><span>Six bindings</span><i>shut, as the reader first meets it</i></div>
<div class="sk-stage sk-stage--tight">
  ${VARIANTS.map(
    (v) => `<div class="sk-cell">
    ${shut(v, 640)}
    <p class="sk-cap" style="margin:40px 0 0">${v.id.toUpperCase()} &middot; ${v.name}</p>
  </div>`,
  ).join("\n  ")}
</div>`;

writeFileSync(resolve(root, "sketches/out/book-sheet.html"), page("Casebook — six bindings", sheet));
console.log("book-sheet.html  contact sheet");

/* And the spreads. The construction is shared, so what changes between these
   six is only the paper, the edges and the ink — which is exactly the question
   the sheet of covers cannot answer. */
const spreads = `
<div class="sk-slug"><b>Casebook</b><span>Six bindings</span><i>open, which is what the reader came for</i></div>
<div class="sk-stage sk-stage--tight">
  ${VARIANTS.map(
    (v) => `<div class="sk-cell">
    <div style="--bk-w:660px">${book(v, 1)}</div>
    <p class="sk-cap" style="margin:38px 0 0">${v.id.toUpperCase()} &middot; ${v.name}</p>
  </div>`,
  ).join("\n  ")}
</div>`;

writeFileSync(resolve(root, "sketches/out/book-spreads.html"), page("Casebook — six spreads", spreads));
console.log("book-spreads.html  the spreads");

/* Mid-turn, one binding, so the opening itself can be judged. */
const turn = `
<div class="sk-slug"><b>Turn</b><span>${VARIANTS[0].name}</span><i>the cover coming over</i></div>
<div class="sk-stage sk-stage--tight">
  ${[0, 0.34, 0.62, 1]
    .map(
      (o) => `<div class="sk-cell">
    <div style="--bk-w:560px">${book(VARIANTS[0], o)}</div>
    <p class="sk-cap" style="margin:42px 0 0">opening ${o}</p>
  </div>`,
    )
    .join("\n  ")}
</div>`;

writeFileSync(resolve(root, "sketches/out/book-turn.html"), page("Casebook — the turn", turn));
console.log("book-turn.html   the turn");
