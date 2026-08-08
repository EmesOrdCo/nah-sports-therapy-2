/* Emit a self-contained page per About Q&A direction, ready to shoot.

   Self-contained for the same reason the charity sketches are: the captures
   have to show the real webfonts, and the files then open anywhere — including
   in a mail to the client — without a dev server.

   Run: node sketches/build-qa-options.mjs */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VARIANTS } from "./qa-options.js";

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

/* A caption strip above each capture, so a contact sheet of five is readable
   without cross-referencing filenames. */
const slug = (v) =>
  `<div class="sk-slug"><b>${v.id.toUpperCase()}</b><span>${v.name}</span></div>`;

const shellCss = `
body{margin:0;background:var(--paper)}
[data-reveal],[data-reveal].pre-reveal{opacity:1;transform:none}
.sk-slug{display:flex;gap:14px;align-items:baseline;padding:14px var(--page-gutter);background:var(--navy-deep);color:rgba(242,246,255,.62);font-family:var(--font-sans);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.sk-slug b{color:#fff}
`;

/* The spine cannot be a static path: its height is whatever the answers make
   it, and the nodes it passes through are wherever the type lands. So it is
   measured and written after layout, and rewritten on resize. On the real page
   this same routine would also hold the draw-in — stroke-dasharray set to the
   path length, dashoffset driven by scroll progress through the section. */
const spineScript = `
(function () {
  var rail = document.querySelector("[data-spine]");
  if (!rail) return;
  var svg = rail.querySelector(".qa-a__curve");
  var path = svg.querySelector("path");

  function draw() {
    var box = rail.getBoundingClientRect();
    var w = box.width;
    var h = box.height;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);

    var centre = w / 2;
    var points = [].map.call(rail.querySelectorAll("[data-node]"), function (node) {
      var n = node.getBoundingClientRect();
      return { x: n.left - box.left + n.width / 2, y: n.top - box.top + n.height / 2 };
    });
    points.unshift({ x: centre, y: 0 });
    points.push({ x: centre, y: h });

    // Vertical tangents at every node, so the line reads as one drawn stroke
    // rather than as a chain of arcs.
    var d = "M " + points[0].x + " " + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1];
      var b = points[i];
      var pull = (b.y - a.y) * 0.5;
      d += " C " + a.x + " " + (a.y + pull) + ", " + b.x + " " + (b.y - pull) + ", " + b.x + " " + b.y;
    }
    path.setAttribute("d", d);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  draw();
  window.addEventListener("resize", draw);
})();
`;

const page = (v) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>About Q&amp;A — ${v.name} | NJH</title>
<style>${faces}</style>
<style>${read("src/style.css")}</style>
<style>${read("sketches/qa-options.css")}</style>
<style>${shellCss}</style>
</head>
<body class="is-inner-page">
${slug(v)}
<main>${v.build()}</main>
<script>${spineScript}</script>
</body>
</html>`;

mkdirSync(resolve(root, "sketches/out"), { recursive: true });

for (const v of VARIANTS) {
  writeFileSync(resolve(root, `sketches/out/qa-${v.id}.html`), page(v));
  console.log(`qa-${v.id}.html  ${v.name}`);
}
