/* Background treatments for the three text-only pages — FAQ, Testimonials, Prices.

   Each entry is a page-wide layer that sits behind `main` and in front of the
   white body. Nothing here touches the content: the sketches inject a layer,
   make the light sections transparent so it shows through, and leave the type,
   spacing and components exactly as they ship. That constraint is deliberate —
   a background that only works once the layout is rebuilt is not a background.

   `html` is inserted into the layer; `css` is appended to the page. Both are
   plain strings so the builder can drive the real dev-server pages rather than
   a rebuilt copy of them.

   Colour comes from the site tokens (--brand, --periwinkle, --brand-light) so
   any of these can be lifted into src/ without a palette decision. */

/* Concentric, slightly irregular rings — a pressure map rather than a target.
   Generated rather than hand-authored so the drift accumulates smoothly. */
const contourRings = (count, step, wobble) =>
  Array.from({ length: count }, (_, i) => {
    const r = 60 + i * step;
    const rx = r * (1 + Math.sin(i * 0.7) * wobble);
    const ry = r * (1 - Math.sin(i * 0.45) * wobble * 0.8);
    const rot = i * 2.4;
    return `<ellipse cx="0" cy="0" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${rot.toFixed(1)})" />`;
  }).join("");

/* Dashed arcs with radial spokes — the goniometer a therapist measures range
   of motion with. Centred off-canvas so only the sweep is ever on the page. */
const motionArcs = (count, step) => {
  const arcs = Array.from({ length: count }, (_, i) => {
    const r = 180 + i * step;
    const dash = i % 2 ? "1 14" : "none";
    return `<circle cx="0" cy="0" r="${r}" stroke-dasharray="${dash}" />`;
  }).join("");
  const spokes = Array.from({ length: 9 }, (_, i) => {
    const a = (-70 + i * 17.5) * (Math.PI / 180);
    const r0 = 180;
    const r1 = 180 + count * step;
    return `<line x1="${(Math.cos(a) * r0).toFixed(1)}" y1="${(Math.sin(a) * r0).toFixed(1)}" x2="${(Math.cos(a) * r1).toFixed(1)}" y2="${(Math.sin(a) * r1).toFixed(1)}" />`;
  }).join("");
  return arcs + spokes;
};

/* Grain. feTurbulence at a high base frequency, desaturated and knocked back —
   the same trick a print texture uses, at a weight you read as paper, not noise. */
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="200" height="200" filter="url(%23n)" opacity="0.5"/></svg>`,
)}`;

export const VARIANTS = [
  {
    id: "a",
    name: "Linework watermark",
    blurb:
      "The existing hands drawing, blown up past the page edge and knocked back to a watermark. No new asset, no new visual language — the illustration already on Clinics, used as texture instead of as a picture.",
    html: `
      <img class="sk-a__hands" src="/images/clinics-hands-linework.webp" alt="" />
      <img class="sk-a__figure" src="/images/njh-signature-motion-figure-transparent.png" alt="" />
    `,
    /* Anchored in px, not %. These pages run from 1,900px to 4,100px tall, and
       a percentage anchor puts the drawing in a different place on each one —
       which is how it ended up crossing the price rows on the first pass. */
    css: `
      .sk-a__hands, .sk-a__figure { position: absolute; }
      /* Bled hard off the right edge so the crop reads as deliberate framing
         rather than a picture that happens to be big. */
      .sk-a__hands {
        top: 620px; right: -300px;
        width: 900px;
        opacity: 0.07;
      }
      .sk-a__figure {
        bottom: 40px; left: -180px;
        width: 620px;
        opacity: 0.055;
        transform: scaleX(-1);
      }
    `,
  },

  {
    id: "b",
    name: "Contour field",
    blurb:
      "Concentric irregular rings, like a pressure or heat map over the body. Two soft centres, one warm-side and one cool, drifting off opposite corners. Reads as clinical mapping without drawing anything anatomical.",
    html: `
      <svg class="sk-b__svg sk-b__svg--tr" viewBox="-700 -700 1400 1400" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.1">${contourRings(22, 27, 0.16)}</g>
      </svg>
      <svg class="sk-b__svg sk-b__svg--bl" viewBox="-700 -700 1400 1400" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.1">${contourRings(18, 33, 0.22)}</g>
      </svg>
    `,
    css: `
      .sk-b__svg { position: absolute; color: var(--brand); opacity: 0.16; }
      .sk-b__svg--tr { top: -280px; right: -420px; width: 1180px; }
      .sk-b__svg--bl { bottom: 60px; left: -460px; width: 1080px; color: var(--brand-light); opacity: 0.13; }
    `,
  },

  {
    id: "c",
    name: "Clinical grid",
    blurb:
      "A measured hairline grid with every fifth line weighted, plus a cool wash off the top-right. The most restrained of the set and the one that suits Prices best — it makes the page feel like a record sheet rather than a blank.",
    html: `<div class="sk-c__grid"></div><div class="sk-c__wash"></div>`,
    css: `
      .sk-c__grid {
        position: absolute; inset: 0;
        background-image:
          linear-gradient(to right, oklch(41.9% 0.117 275 / 0.16) 1px, transparent 1px),
          linear-gradient(to bottom, oklch(41.9% 0.117 275 / 0.16) 1px, transparent 1px),
          linear-gradient(to right, oklch(41.9% 0.117 275 / 0.055) 1px, transparent 1px),
          linear-gradient(to bottom, oklch(41.9% 0.117 275 / 0.055) 1px, transparent 1px);
        background-size: 240px 240px, 240px 240px, 48px 48px, 48px 48px;
        background-position: 24px 0;
        /* Fades out down the page so the grid never fights the CTA band. */
        -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 62%, transparent 92%);
        mask-image: linear-gradient(to bottom, #000 0%, #000 62%, transparent 92%);
      }
      .sk-c__wash {
        position: absolute; top: -200px; right: -160px;
        width: 1000px; height: 900px;
        background: radial-gradient(ellipse at 70% 30%, oklch(76.7% 0.096 275 / 0.24), transparent 68%);
      }
    `,
  },

  {
    id: "d",
    name: "Aurora wash",
    blurb:
      "No drawing at all — three very large, very soft periwinkle fields that give the white page depth. The cheapest to ship and the safest to live with, because there is nothing to recognise and nothing to date.",
    html: `<div class="sk-d__f sk-d__f--1"></div><div class="sk-d__f sk-d__f--2"></div><div class="sk-d__f sk-d__f--3"></div>`,
    css: `
      .sk-d__f { position: absolute; border-radius: 50%; filter: blur(90px); }
      .sk-d__f--1 {
        top: -140px; right: -170px; width: 840px; height: 620px;
        background: radial-gradient(circle, oklch(76.7% 0.096 275 / 0.42), transparent 70%);
      }
      .sk-d__f--2 {
        top: 560px; left: -260px; width: 800px; height: 560px;
        background: radial-gradient(circle, oklch(87.7% 0.055 262 / 0.50), transparent 70%);
      }
      .sk-d__f--3 {
        bottom: 120px; right: -120px; width: 700px; height: 500px;
        background: radial-gradient(circle, oklch(51.5% 0.100 269 / 0.22), transparent 70%);
      }
    `,
  },

  {
    id: "e",
    name: "Paper grain and tint bands",
    blurb:
      "Print-shop treatment: a fine grain across the whole page plus a warm off-white band behind the middle section, so the page separates into stages the way a printed sheet does. Everything else stays white.",
    html: `<div class="sk-e__band"></div><div class="sk-e__grain"></div>`,
    css: `
      /* 0.055, not the 0.4 the first pass used. Multiply over a full-page layer
         compounds: anything you can see as a texture greys the whole sheet. */
      .sk-e__grain {
        position: absolute; inset: 0;
        background-image: url("${GRAIN}");
        background-size: 200px 200px;
        opacity: 0.055;
        mix-blend-mode: multiply;
      }
      /* Sits behind the body of the page, stopping short of the hero and the
         navy CTA so both keep their clean edge. */
      .sk-e__band {
        position: absolute; left: 0; right: 0;
        top: 300px; bottom: 100px;
        background: oklch(98.2% 0.004 270);
      }
      .sk-e__band::before, .sk-e__band::after {
        content: ""; position: absolute; left: 0; right: 0; height: 120px;
        background: linear-gradient(oklch(100% 0 0), oklch(98.2% 0.004 270 / 0));
      }
      .sk-e__band::before { top: 0; }
      .sk-e__band::after { bottom: 0; transform: scaleY(-1); }
    `,
  },

  {
    id: "f",
    name: "Range-of-motion arcs",
    blurb:
      "The goniometer sweep — dashed concentric arcs with degree spokes, centred off the page edge. It is the one direction that says what the practice actually measures, and it scales down the page without repeating.",
    html: `
      <svg class="sk-f__svg sk-f__svg--l" viewBox="-100 -900 1100 1800" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.2">${motionArcs(9, 62)}</g>
      </svg>
      <svg class="sk-f__svg sk-f__svg--r" viewBox="-100 -900 1100 1800" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.2">${motionArcs(7, 74)}</g>
      </svg>
    `,
    css: `
      .sk-f__svg { position: absolute; color: var(--brand); opacity: 0.3; }
      .sk-f__svg--l { top: 120px; left: -560px; width: 1120px; }
      .sk-f__svg--r { bottom: 40px; right: -600px; width: 1180px; transform: scaleX(-1); color: var(--brand-light); opacity: 0.26; }
    `,
  },

  {
    id: "g",
    name: "Taping ribbons",
    blurb:
      "Long soft-edged bands crossing the page on the diagonal, borrowed from kinesiology tape. The most decorative option here — good on Testimonials where the cards can take a bit of movement behind them, riskier on Prices.",
    html: `<div class="sk-g__r sk-g__r--1"></div><div class="sk-g__r sk-g__r--2"></div><div class="sk-g__r sk-g__r--3"></div>`,
    css: `
      .sk-g__r {
        position: absolute; left: -20%; width: 140%; height: 190px;
        filter: blur(38px);
      }
      .sk-g__r--1 {
        top: 180px; transform: rotate(-9deg);
        background: linear-gradient(90deg, transparent, oklch(76.7% 0.096 275 / 0.42) 32%, oklch(87.7% 0.055 262 / 0.30) 68%, transparent);
      }
      .sk-g__r--2 {
        top: 820px; height: 150px; transform: rotate(6deg);
        background: linear-gradient(90deg, transparent, oklch(51.5% 0.100 269 / 0.24) 40%, transparent 85%);
      }
      .sk-g__r--3 {
        bottom: 140px; height: 220px; transform: rotate(-5deg);
        background: linear-gradient(90deg, transparent 10%, oklch(87.7% 0.055 262 / 0.48) 55%, transparent);
      }
    `,
  },

  {
    id: "h",
    name: "Dissolved photograph",
    blurb:
      "A real studio photograph anchored to one corner and dissolved almost entirely into the white. It puts the place on the page without a hero image, and it is the only option here that carries warmth rather than line.",
    html: `<div class="sk-h__photo"></div><div class="sk-h__photo sk-h__photo--2"></div>`,
    css: `
      .sk-h__photo {
        position: absolute; top: 0; right: 0;
        width: 780px; height: 820px;
        background: url("/images/pilates-studio.webp") center/cover no-repeat;
        opacity: 0.13;
        filter: grayscale(0.6) contrast(0.85);
        -webkit-mask-image: radial-gradient(ellipse at 82% 18%, #000 6%, transparent 58%);
        mask-image: radial-gradient(ellipse at 82% 18%, #000 6%, transparent 58%);
      }
      /* Second photo goes to the right too. On the left it lands under the
         section headings, and a recognisable figure behind a display line is
         the one thing a background must not do. */
      .sk-h__photo--2 {
        top: auto; bottom: 60px; right: -60px;
        width: 720px; height: 700px;
        background-image: url("/images/pilates-mat-stretch.jpg");
        opacity: 0.11;
        -webkit-mask-image: radial-gradient(ellipse at 78% 76%, #000 5%, transparent 56%);
        mask-image: radial-gradient(ellipse at 78% 76%, #000 5%, transparent 56%);
      }
    `,
  },
];
