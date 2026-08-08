/* Five ways to lay out the six About-page questions.

   The wording is imported from src/about/content.js and split exactly the way
   variant-e.js splits it, so every direction below is showing Natasha's real
   sentences at their real length. Nothing here is lorem, and nothing is
   paraphrased — if an answer looks too long in a direction, that is the
   direction telling you something true.

   Run: node sketches/build-qa-options.mjs && node sketches/shoot-qa-options.mjs */

import { STORY, PRACTICE, PULLQUOTES } from "../src/about/content.js";

const sentences = (text) => text.split(/(?<=\.)\s+/).filter(Boolean);

const TRAINING = sentences(STORY[1]);
const CARE = sentences(STORY[2]);
const AIM = sentences(PRACTICE.aim);

export const QA = [
  { q: "How did you get into this?", a: [STORY[0], TRAINING[0]] },
  { q: "Where did you train?", a: [TRAINING[1], TRAINING[2]] },
  { q: "What do you treat?", a: [PRACTICE.specialism] },
  { q: "What will you actually do?", a: [CARE[1]] },
  { q: "What are we working towards?", a: [AIM[0], CARE[2]] },
  { q: "Why do you do it?", a: [PULLQUOTES.passion], emphasis: true },
];

const paras = (lines) => lines.map((l) => `<p>${l}</p>`).join("");
const num = (i) => String(i + 1).padStart(2, "0");

/* ---- A. The spine ----
   One curve down the centre of the section, questions hanging off it left and
   right. Nothing about the drawing can be known in advance — its height is
   whatever the answers make it and its nodes sit wherever the type lands — so
   the whole thing is written at runtime by the script in build-qa-options.mjs.
   `line`, `node` and `tie` name which routine draws it; everything about how it
   looks (swing, weight, colour) is a custom property in qa-options.css. */
const spine = (treatment) => `
<section class="qa qa-a qa-a--${treatment.id}">
  <div class="section-shell">
    <div class="qa-a__rail" data-spine='${JSON.stringify(treatment.draw)}'>
      <svg class="qa-a__curve" aria-hidden="true" focusable="false"></svg>
      <ol class="qa-a__list">
        ${QA.map(
          (item, i) => `
        <li class="qa-a__item qa-a__item--${i % 2 === 0 ? "right" : "left"}${item.emphasis ? " qa-a__item--end" : ""}" style="grid-row: ${i + 1}">
          <div class="qa-a__card" data-card>
            <h3 class="qa-a__q" data-q>${item.q}</h3>
            <div class="qa-a__a">${paras(item.a)}</div>
          </div>
        </li>`,
        ).join("")}
      </ol>
    </div>
  </div>
</section>`;

/* tension is how far each node's tangent is held vertical before the line is
   allowed to head for the next one. 0.5 is the limit: past it the incoming and
   outgoing control points cross over in y, the curve doubles back on itself at
   the node, and anything that reads the tangent — the nib, the ribs — sees a
   horizontal line where the curve should be at its most vertical. Low is snappy
   and mechanical; 0.5 is as lazy as it can go without kinking. */
export const SPINES = [
  {
    id: "hairline",
    name: "Hairline — one even stroke, fading in and out at the ends",
    draw: { line: "single", node: "dot", tie: true, tension: 0.5, fade: true, r: 3.5 },
  },
  {
    id: "taut",
    name: "Taut — barely leaves centre, open rings for nodes",
    draw: { line: "single", node: "ring", tie: true, tension: 0.4, r: 4 },
  },
  {
    id: "swing",
    name: "Swing — the full gesture, travels further than it falls",
    draw: { line: "single", node: "dot", tie: true, tension: 0.5, fade: true, r: 3 },
  },
  /* Three weights of the same pen. thin/thick is the range the stroke moves
     between, in px; the node dot and the swing grow with it, because a 15px
     ribbon swinging only as far as a hairline did reads as cramped, and a 2.5px
     dot sitting on it disappears. */
  {
    id: "nib-medium",
    name: "Broad nib, medium — a pen you can see",
    draw: { line: "nib", node: "dot", tie: false, tension: 0.45, r: 3.5, nib: [1.1, 6.5] },
  },
  {
    id: "nib-bold",
    name: "Broad nib, bold — the line becomes a mark",
    draw: { line: "nib", node: "dot", tie: false, tension: 0.45, r: 4.5, nib: [1.6, 10] },
  },
  {
    id: "nib-heavy",
    name: "Broad nib, heavy — a brush, punched through at each question",
    draw: { line: "nib", node: "punch", tie: false, tension: 0.45, r: 5, nib: [2.4, 15] },
  },
  {
    id: "vertebrae",
    name: "Vertebrae — ribs struck along the line, long ones at the questions",
    draw: { line: "vertebrae", node: "vertebra", tie: true, tension: 0.46, rib: 34, ribLen: 13, nodeLen: 26 },
  },
  {
    id: "ribbon",
    name: "Ribbon — two hairlines in parallel, an inside and an outside",
    draw: { line: "ribbon", node: "dot", tie: true, tension: 0.5, offset: 2.6, r: 4 },
  },
];

/* ---- B. Transcript ----
   One column, numbered, with a single hairline running the whole section
   instead of restarting under every question. */
const transcript = () => `
<section class="qa qa-b">
  <div class="section-shell">
    <ol class="qa-b__list">
      ${QA.map(
        (item, i) => `
      <li class="qa-b__item${item.emphasis ? " qa-b__item--end" : ""}">
        <span class="qa-b__num" aria-hidden="true">${num(i)}</span>
        <h3 class="qa-b__q">${item.q}</h3>
        <div class="qa-b__a">${paras(item.a)}</div>
      </li>`,
      ).join("")}
    </ol>
  </div>
</section>`;

/* ---- C. Sticky question ----
   The question pins in the left column and holds while its answer scrolls
   past, then hands over to the next. A still capture can only show the
   two-column ledger; the holding is the point. */
const sticky = () => `
<section class="qa qa-c">
  <div class="section-shell">
    <div class="qa-c__list">
      ${QA.map(
        (item, i) => `
      <div class="qa-c__item${item.emphasis ? " qa-c__item--end" : ""}">
        <div class="qa-c__side">
          <div class="qa-c__pin">
            <span class="qa-c__num" aria-hidden="true">${num(i)}</span>
            <h3 class="qa-c__q">${item.q}</h3>
          </div>
        </div>
        <div class="qa-c__a">${paras(item.a)}</div>
      </div>`,
      ).join("")}
    </div>
  </div>
</section>`;

/* ---- D. Bands ----
   Each question gets the full width of the window and alternating ground. */
const bands = () => `
<section class="qa qa-d">
  ${QA.map(
    (item, i) => `
  <div class="qa-d__band${i % 2 === 1 ? " qa-d__band--tint" : ""}${item.emphasis ? " qa-d__band--end" : ""}">
    <div class="section-shell qa-d__inner">
      <div class="qa-d__head">
        <span class="qa-d__num" aria-hidden="true">${num(i)}</span>
        <h3 class="qa-d__q">${item.q}</h3>
      </div>
      <div class="qa-d__a">${paras(item.a)}</div>
    </div>
  </div>`,
  ).join("")}
</section>`;

/* ---- E. Index and panel ----
   Every question listed on the left and held there, answers stacked on the
   right, the index entry marking where you are. */
const index = () => `
<section class="qa qa-e">
  <div class="section-shell qa-e__grid">
    <nav class="qa-e__index" aria-label="Questions">
      <p class="qa-e__index-label">In her words</p>
      <ol>
        ${QA.map(
          (item, i) => `<li${i === 2 ? ' class="is-here"' : ""}><span aria-hidden="true">${num(i)}</span>${item.q}</li>`,
        ).join("")}
      </ol>
    </nav>
    <div class="qa-e__answers">
      ${QA.map(
        (item, i) => `
      <div class="qa-e__item${item.emphasis ? " qa-e__item--end" : ""}${i === 2 ? " is-here" : ""}">
        <h3 class="qa-e__q">${item.q}</h3>
        <div class="qa-e__a">${paras(item.a)}</div>
      </div>`,
      ).join("")}
    </div>
  </div>
</section>`;

export const VARIANTS = [
  ...SPINES.map((t, i) => ({
    id: `a${i + 1}`,
    name: `Spine — ${t.name}`,
    build: () => spine(t),
  })),
  { id: "b", name: "Transcript — one numbered column", build: transcript },
  { id: "c", name: "Sticky question — question holds, answer scrolls", build: sticky },
  { id: "d", name: "Bands — one question per full-width band", build: bands },
  { id: "e", name: "Index and panel — all six listed, answers beside", build: index },
];
