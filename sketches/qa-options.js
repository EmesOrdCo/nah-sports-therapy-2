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
   right. The path is drawn at runtime from the measured node positions — it
   cannot be a static viewBox, because its height is whatever the answers make
   it. See the inline script in build-qa-options.mjs. */
const spine = () => `
<section class="qa qa-a">
  <div class="section-shell">
    <div class="qa-a__rail" data-spine>
      <svg class="qa-a__curve" aria-hidden="true" focusable="false"><path fill="none" /></svg>
      <ol class="qa-a__list">
        ${QA.map(
          (item, i) => `
        <li class="qa-a__item qa-a__item--${i % 2 === 0 ? "right" : "left"}${item.emphasis ? " qa-a__item--end" : ""}">
          <span class="qa-a__node" data-node></span>
          <div class="qa-a__card" data-card>
            <h3 class="qa-a__q">${item.q}</h3>
            <div class="qa-a__a">${paras(item.a)}</div>
          </div>
        </li>`,
        ).join("")}
      </ol>
    </div>
  </div>
</section>`;

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
  {
    id: "a",
    name: "The spine — centre curve, questions left and right",
    build: spine,
  },
  { id: "b", name: "Transcript — one numbered column", build: transcript },
  { id: "c", name: "Sticky question — question holds, answer scrolls", build: sticky },
  { id: "d", name: "Bands — one question per full-width band", build: bands },
  { id: "e", name: "Index and panel — all six listed, answers beside", build: index },
];
