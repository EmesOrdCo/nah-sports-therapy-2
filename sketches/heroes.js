/* Hero options for the /faq journey page — markup only, no side effects.

   Five treatments of the same brief: establish "in order" before the numbered
   spine below it, and reassure somebody who has never been to a clinic.

   Each builder returns the hero plus the first station of the journey, because
   a hero can only be judged against what it hands over to. */

import { PRACTICE, WHAT_TO_WEAR, CONTACT } from "../src/about/content.js";

const STAGES = [
  "Before you come",
  "On the day",
  "Afterwards",
  "If plans change",
  "Booking",
];

const crumbs = `<nav class="breadcrumbs" aria-label="Breadcrumb">
  <a href="#">Home</a><span aria-hidden="true">/</span><span>FAQ</span>
</nav>`;

/* Every option hands over to the same first station, so the comparison is
   about the hero and not about what follows it. */
function firstStation(tone = "") {
  return `<section class="hx-handover ${tone}">
    <div class="section-shell hx-handover__inner">
      <div class="hx-station">
        <div class="hx-marker" aria-hidden="true"><span>1</span></div>
        <div class="hx-station__head">
          <p class="hx-station__label">Before you come</p>
          <h2>Getting ready</h2>
        </div>
        <dl class="hx-qa">
          <div>
            <dt>What should I wear?</dt>
            <dd>${WHAT_TO_WEAR.map((line) => `<p>${line}</p>`).join("")}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>`;
}

/* ---------------------------------------------------------------- A · Spine

   No announcement. The journey line simply starts under the intro and leaves
   the bottom of the hero, so the page is already moving before you scroll. */
export function spineHero() {
  return `<section class="page-hero page-hero--light hx-a">
    <div class="section-shell page-hero__inner">
      ${crumbs}
      <h1>Your first appointment, start to finish</h1>
      <p class="page-hero__intro">What happens, what to bring, what it costs and what follows &mdash; answered in the order you meet them.</p>
      <div class="hx-a__spine" aria-hidden="true"></div>
    </div>
  </section>
  ${firstStation("hx-handover--tight")}`;
}

/* ----------------------------------------------------------- B · Stage strip

   The five stages ruled across the foot of the hero. Doubles as the contents
   index the old page kept in a sidebar. */
export function stripHero() {
  return `<section class="page-hero page-hero--light hx-b">
    <div class="section-shell page-hero__inner">
      ${crumbs}
      <h1>Your first appointment, start to finish</h1>
      <p class="page-hero__intro">What happens, what to bring, what it costs and what follows &mdash; answered in the order you meet them.</p>
      <nav class="hx-b__strip" aria-label="Stages on this page">
        ${STAGES.map(
          (stage, i) => `<a href="#stage-${i + 1}">
            <span class="hx-b__n">${String(i + 1).padStart(2, "0")}</span>
            <span class="hx-b__name">${stage}</span>
          </a>`,
        ).join("")}
      </nav>
    </div>
  </section>
  ${firstStation()}`;
}

/* --------------------------------------------------------- C · Answer first

   The hero is the first answer. Three one-line replies to the three things
   people actually arrive wanting, with the journey underneath. */
export function answerHero() {
  const QUICK = [
    ["What to wear", "Loose, comfortable clothing &mdash; or bring shorts."],
    ["What it costs", "From &pound;60, agreed before you book."],
    ["Do I need to be sporty", "No. Clients range from age 8 to over 80."],
  ];
  return `<section class="page-hero page-hero--light hx-c">
    <div class="section-shell page-hero__inner">
      ${crumbs}
      <h1>Most people want to know three things.</h1>
      <dl class="hx-c__quick">
        ${QUICK.map(
          ([q, a]) => `<div><dt>${q}</dt><dd>${a}</dd></div>`,
        ).join("")}
      </dl>
      <p class="hx-c__more">Everything else, in the order you meet it <span aria-hidden="true">&darr;</span></p>
    </div>
  </section>
  ${firstStation()}`;
}

/* -------------------------------------------------------------- D · Dark run

   Navy hero, the spine emerging in periwinkle and crossing into the white
   page below. Atmospheric rather than informative. */
export function darkHero() {
  return `<section class="page-hero page-hero--dark hx-d">
    <div class="page-hero__visual" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
    <div class="section-shell page-hero__inner">
      ${crumbs}
      <h1>Your first appointment, <em>start to finish</em></h1>
      <p class="page-hero__intro">What happens, what to bring, what it costs and what follows &mdash; answered in the order you meet them.</p>
      <div class="hx-d__spine" aria-hidden="true"></div>
    </div>
  </section>
  ${firstStation("hx-handover--tight")}`;
}

/* ------------------------------------------------------- E · Spine and strip

   A and B together: the line starts in the hero and the stage strip sits on
   it, so the contents row is the first thing the journey passes through. */
export function combinedHero() {
  return `<section class="page-hero page-hero--light hx-e">
    <div class="section-shell page-hero__inner">
      ${crumbs}
      <h1>Your first appointment, start to finish</h1>
      <p class="page-hero__intro">What happens, what to bring, what it costs and what follows &mdash; answered in the order you meet them.</p>
      <nav class="hx-e__strip" aria-label="Stages on this page">
        ${STAGES.map(
          (stage, i) => `<a href="#stage-${i + 1}">
            <span class="hx-e__dot" aria-hidden="true"></span>
            <span class="hx-e__n">${String(i + 1).padStart(2, "0")}</span>
            <span class="hx-e__name">${stage}</span>
          </a>`,
        ).join("")}
      </nav>
      <div class="hx-e__spine" aria-hidden="true"></div>
    </div>
  </section>
  ${firstStation("hx-handover--tight")}`;
}

export const HEROES = [
  { id: "a", name: "The spine starts here", build: spineHero },
  { id: "b", name: "Stage strip", build: stripHero },
  { id: "c", name: "Answer first", build: answerHero },
  { id: "d", name: "Dark run", build: darkHero },
  { id: "e", name: "Spine + strip", build: combinedHero },
];
