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
   path length, dashoffset driven by scroll progress through the section.

   Six line treatments share one curve. The curve is a chain of cubics with a
   vertical tangent at every node, which is what stops it reading as a string of
   separate arcs; `tension` is how far that tangent is held before the segment
   heads for the next node. Everything past that — even stroke, tapered nib,
   ribs, parallel pair — is a way of dressing the same path, and each one reads
   its weight and colour from custom properties so the treatments differ in CSS
   and not in here. */
const spineScript = `
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var rail = document.querySelector("[data-spine]");
  if (!rail) return;
  var svg = rail.querySelector(".qa-a__curve");
  var cfg = JSON.parse(rail.getAttribute("data-spine"));
  var css = getComputedStyle(rail.closest(".qa-a"));
  var amp = parseFloat(css.getPropertyValue("--qa-amp")) || 46;

  function anchors(box) {
    return [].map.call(rail.querySelectorAll("[data-card]"), function (card) {
      var q = card.querySelector("[data-q]");
      var cr = card.getBoundingClientRect();
      var qr = q.getBoundingClientRect();
      // The first line of the question, not the middle of the card: the node
      // has to sit on the cap height or it reads as floating.
      var lh = parseFloat(getComputedStyle(q).lineHeight) || qr.height;
      var right = card.parentNode.classList.contains("qa-a__item--right");
      return {
        dir: right ? 1 : -1,
        y: qr.top - box.top + lh / 2,
        near: right ? cr.left - box.left : cr.right - box.left,
      };
    });
  }

  function curve(points) {
    var d = "M " + points[0].x.toFixed(2) + " " + points[0].y.toFixed(2);
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1];
      var b = points[i];
      var pull = (b.y - a.y) * cfg.tension;
      d +=
        " C " + a.x.toFixed(2) + " " + (a.y + pull).toFixed(2) +
        ", " + b.x.toFixed(2) + " " + (b.y - pull).toFixed(2) +
        ", " + b.x.toFixed(2) + " " + b.y.toFixed(2);
    }
    return d;
  }

  /* Walk the path for position and tangent. Cheaper than deriving them from the
     Bézier control points, and exact enough at a 2px step. */
  function walk(d, step) {
    var probe = document.createElementNS(NS, "path");
    probe.setAttribute("d", d);
    probe.style.visibility = "hidden";
    svg.appendChild(probe);
    var len = probe.getTotalLength();
    var out = [];
    for (var s = 0; s <= len; s += step) {
      var p = probe.getPointAtLength(s);
      var back = probe.getPointAtLength(Math.max(0, s - 1));
      var fwd = probe.getPointAtLength(Math.min(len, s + 1));
      out.push({ x: p.x, y: p.y, tx: fwd.x - back.x, ty: fwd.y - back.y, s: s });
    }
    out.len = len;
    svg.removeChild(probe);
    return out;
  }

  var el = function (name, attrs) {
    var s = "<" + name;
    for (var k in attrs) s += " " + k + '="' + attrs[k] + '"';
    return s + " />";
  };

  /* A pen held at a fixed angle: thin where the line runs with the nib, broad
     where it runs across it. Normalised against the widest turn on this
     particular curve, so a taut spine and a swinging one both use the full
     range of the stroke rather than one of them coming out uniformly thin. */
  function nib(d) {
    var pts = walk(d, 2);
    var lean = pts.map(function (p) {
      return Math.abs(Math.atan2(Math.abs(p.tx), Math.abs(p.ty)));
    });
    var most = Math.max.apply(null, lean) || 1;
    var thin = cfg.nib[0];
    var thick = cfg.nib[1];
    var left = [];
    var right = [];
    pts.forEach(function (p, i) {
      var half = (thin + (thick - thin) * (lean[i] / most)) / 2;
      var m = Math.sqrt(p.tx * p.tx + p.ty * p.ty) || 1;
      var nx = (-p.ty / m) * half;
      var ny = (p.tx / m) * half;
      left.push([p.x + nx, p.y + ny]);
      right.push([p.x - nx, p.y - ny]);
    });
    var seg = function (list) {
      return list
        .map(function (q) {
          return q[0].toFixed(2) + " " + q[1].toFixed(2);
        })
        .join(" L ");
    };
    return "M " + seg(left) + " L " + seg(right.reverse()) + " Z";
  }

  /* Ribs struck perpendicular to the line, skipping the stretch either side of
     a question so a short rib never sits on top of a long one. */
  function ribs(d, nodeYs) {
    var out = "";
    walk(d, cfg.rib).forEach(function (p) {
      var clear = nodeYs.every(function (y) {
        return Math.abs(p.y - y) > cfg.rib * 1.2;
      });
      if (!clear) return;
      var m = Math.sqrt(p.tx * p.tx + p.ty * p.ty) || 1;
      var nx = (-p.ty / m) * (cfg.ribLen / 2);
      var ny = (p.tx / m) * (cfg.ribLen / 2);
      out += el("line", {
        class: "qa-a__rib",
        x1: (p.x + nx).toFixed(2),
        y1: (p.y + ny).toFixed(2),
        x2: (p.x - nx).toFixed(2),
        y2: (p.y - ny).toFixed(2),
      });
    });
    return out;
  }

  function draw() {
    var box = rail.getBoundingClientRect();
    var w = box.width;
    var h = box.height;
    var centre = w / 2;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.innerHTML = "";

    var marks = anchors(box);
    // The line starts well above the first node and runs past the last, so it
    // is already travelling when the section begins. Starting level with the
    // first node instead would force the whole swing into the ~20px between the
    // rail top and the first question, and come out as a horizontal dash. The
    // SVG overflows visibly, so the overshoot draws into the section's padding.
    var points = [{ x: centre, y: marks[0].y - 130 }]
      .concat(
        marks.map(function (m) {
          return { x: centre + m.dir * amp, y: m.y };
        }),
      )
      .concat([{ x: centre, y: h }]);

    var d = curve(points);
    var out = "";

    // Fading both ends means the line neither begins nor ends on the paper —
    // it is already travelling when the section starts.
    if (cfg.fade) {
      out +=
        '<defs><linearGradient id="qa-fade" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" style="stop-color:var(--qa-line)" stop-opacity="0" />' +
        '<stop offset="0.07" style="stop-color:var(--qa-line)" stop-opacity="1" />' +
        '<stop offset="0.93" style="stop-color:var(--qa-line)" stop-opacity="1" />' +
        '<stop offset="1" style="stop-color:var(--qa-line)" stop-opacity="0" />' +
        "</linearGradient></defs>";
    }

    var paint = cfg.fade ? { stroke: "url(#qa-fade)" } : {};

    if (cfg.line === "nib") {
      out += el("path", { class: "qa-a__nib", d: nib(d) });
    } else if (cfg.line === "ribbon") {
      // Offsetting the whole path by a couple of pixels either side reads as
      // one ribbon; two separately generated curves would drift apart on the
      // turns and read as two lines. The offset has to hold at the ends too —
      // tapering it to nothing there closes the ribbon into a lens.
      [-1, 1].forEach(function (side) {
        var shifted = points.map(function (p) {
          return { x: p.x + side * cfg.offset, y: p.y };
        });
        out += el("path", Object.assign({ class: "qa-a__line", d: curve(shifted) }, paint));
      });
    } else {
      out += el("path", Object.assign({ class: "qa-a__line", d: d }, paint));
      if (cfg.line === "vertebrae") {
        out += ribs(
          d,
          marks.map(function (m) {
            return m.y;
          }),
        );
      }
    }

    marks.forEach(function (m, i) {
      var x = centre + m.dir * amp;
      if (cfg.tie) {
        out += el("line", {
          class: "qa-a__tie",
          x1: (x + m.dir * (cfg.r || 4)).toFixed(2),
          y1: m.y.toFixed(2),
          x2: (m.near - m.dir * 9).toFixed(2),
          y2: m.y.toFixed(2),
        });
      }
      if (cfg.node === "dot") {
        out += el("circle", { class: "qa-a__dot", cx: x.toFixed(2), cy: m.y.toFixed(2), r: cfg.r });
      } else if (cfg.node === "punch") {
        out += el("circle", { class: "qa-a__punch", cx: x.toFixed(2), cy: m.y.toFixed(2), r: cfg.r });
      } else if (cfg.node === "ring") {
        out += el("circle", { class: "qa-a__ring", cx: x.toFixed(2), cy: m.y.toFixed(2), r: cfg.r });
      } else if (cfg.node === "vertebra") {
        // Struck square across the line rather than perpendicular to it: at a
        // node the curve is vertical anyway, and square reads as a landmark.
        var half = cfg.nodeLen / 2;
        out += el("line", {
          class: "qa-a__vertebra",
          x1: (x - half).toFixed(2),
          y1: m.y.toFixed(2),
          x2: (x + half).toFixed(2),
          y2: m.y.toFixed(2),
        });
      }
    });

    svg.innerHTML = out;
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
