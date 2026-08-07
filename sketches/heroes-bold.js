/* Hero options for /faq — the adventurous set. Markup only, no side effects.

   The first five treatments were variations on "title, intro, then a device".
   These six each throw that shape away and try something the site has not
   done before.

   Provenance rule holds: framing and questions are ours, every sentence in
   Natasha's voice is verbatim from about/content.js. */

import {
  PRACTICE,
  PULLQUOTES,
  WHAT_TO_WEAR,
  WHERE,
  PORTRAIT,
} from "../src/about/content.js";

const STAGES = [
  "Before you come",
  "On the day",
  "Afterwards",
  "If plans change",
  "Booking",
];

const QUESTIONS = [
  "What happens at my first appointment?",
  "What should I wear?",
  "Do I need to be sporty?",
  "What does it cost?",
  "What if I need to cancel?",
  "What if I'm running late?",
  "Do you treat children?",
  "How do small group Pilates blocks work?",
  "Where will I see you?",
  "How do I book?",
];

const crumbs = (dark = false) =>
  `<nav class="breadcrumbs${dark ? " breadcrumbs--dark" : ""}" aria-label="Breadcrumb">
    <a href="#">Home</a><span aria-hidden="true">/</span><span>FAQ</span>
  </nav>`;

/* Same handover in every option, so the hero is the only variable. */
function firstStation(tone = "") {
  return `<section class="hx-handover ${tone}">
    <div class="section-shell">
      <div class="hx-station">
        <div class="hx-marker" aria-hidden="true"><span>1</span></div>
        <div class="hx-station__head">
          <p class="hx-station__label">Before you come</p>
          <h2>Getting ready</h2>
        </div>
        <dl class="hx-qa">
          <div>
            <dt>What should I wear?</dt>
            <dd>${WHAT_TO_WEAR.map((l) => `<p>${l}</p>`).join("")}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>`;
}

/* --------------------------------------------------------- F · Question wall

   No headline. The ten questions are the hero — set as a block of serif type
   that reads as texture first and as an index second. The one people ask most
   is inked; the rest recede. You arrive already looking at your own question. */
export function wallHero() {
  return `<section class="page-hero page-hero--light hxb-f">
    <div class="section-shell page-hero__inner">
      ${crumbs()}
      <h1 class="sr-only">Frequently asked questions</h1>
      <ul class="hxb-f__wall">
        ${QUESTIONS.map(
          (q, i) => `<li${i === 0 ? ' class="is-lead"' : ""}><a href="#q">${q}</a></li>`,
        ).join("")}
      </ul>
      <p class="hxb-f__foot">Answered in the order you meet them <span aria-hidden="true">&darr;</span></p>
    </div>
  </section>
  ${firstStation()}`;
}

/* ------------------------------------------------------- G · Ask me anything

   An FAQ is a policy document until somebody's face is on it. Her portrait
   holds the right of the hero; the page becomes her answering rather than the
   practice publishing. */
export function portraitHero() {
  return `<section class="page-hero page-hero--light hxb-g">
    <div class="section-shell hxb-g__grid">
      <div class="hxb-g__content">
        ${crumbs()}
        <h1>Ask me anything before you come.</h1>
        <blockquote class="hxb-g__voice">
          <p>${PULLQUOTES.care}</p>
          <footer>Natasha Hadland <span>Sports Therapist &middot; STOTT Pilates</span></footer>
        </blockquote>
        <div class="hxb-g__spine" aria-hidden="true"></div>
      </div>
      <figure class="hxb-g__portrait">
        <img src="/images/natasha-portrait-900.webp" width="900" height="1200" alt="${PORTRAIT.alt}" />
      </figure>
    </div>
  </section>
  ${firstStation("hx-handover--tight")}`;
}

/* -------------------------------------------------------------- H · The room

   The single most reassuring thing you can show somebody who has never been:
   the room they will walk into. Full bleed, scrimmed, with the journey line
   dropping out of the photograph into the page. */
export function roomHero() {
  return `<section class="page-hero hxb-h">
    <div class="hxb-h__media" aria-hidden="true">
      <img src="/images/pilates-studio.webp" width="1200" height="900" alt="" />
    </div>
    <div class="section-shell page-hero__inner">
      ${crumbs(true)}
      <h1>This is the room<br />you&rsquo;ll walk into.</h1>
      <p class="hxb-h__intro">${WHERE[0].lines[0]}. What happens once you are in it &mdash; and everything you might want to know first &mdash; in the order you meet it.</p>
      <div class="hxb-h__spine" aria-hidden="true"></div>
    </div>
  </section>
  ${firstStation("hx-handover--tight")}`;
}

/* ------------------------------------------------------------- I · The route

   Not a contents row — a drawn route. Five stops on a curve that leaves the
   left edge and exits down into the page, labels alternating above and below
   like a trail sign. */
export function routeHero() {
  return `<section class="page-hero page-hero--light hxb-i">
    <div class="section-shell page-hero__inner">
      ${crumbs()}
      <h1>Your first appointment, start to finish</h1>
      <div class="hxb-i__route">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="hxb-i__line" d="M0 108 C 150 108, 190 52, 300 52 C 410 52, 450 140, 600 140 C 750 140, 790 60, 900 60 C 1010 60, 1060 120, 1200 128" />
        </svg>
        <ol class="hxb-i__stops">
          ${STAGES.map(
            (stage, i) => `<li class="hxb-i__stop hxb-i__stop--${i + 1}">
              <span class="hxb-i__dot" aria-hidden="true"></span>
              <a href="#stage-${i + 1}">
                <span class="hxb-i__n">${String(i + 1).padStart(2, "0")}</span>
                <span class="hxb-i__name">${stage}</span>
              </a>
            </li>`,
          ).join("")}
        </ol>
      </div>
    </div>
  </section>
  ${firstStation()}`;
}

/* --------------------------------------------------------- J · The transcript

   The page opens mid-conversation. A question in the visitor's voice, set
   large, and her reply underneath in her own words — so the reader learns the
   format of the whole page from one exchange. */
export function transcriptHero() {
  return `<section class="page-hero page-hero--light hxb-j">
    <div class="section-shell page-hero__inner">
      ${crumbs()}
      <div class="hxb-j__exchange">
        <p class="hxb-j__who">You</p>
        <h1 class="hxb-j__q">&ldquo;Do I need to be sporty?&rdquo;</h1>
        <p class="hxb-j__who hxb-j__who--her">Natasha</p>
        <div class="hxb-j__a">
          <p>${PRACTICE.breadth}</p>
        </div>
      </div>
      <p class="hxb-j__foot">Nine more, in the order you meet them <span aria-hidden="true">&darr;</span></p>
    </div>
  </section>
  ${firstStation()}`;
}

/* ------------------------------------------------------- K · The stages, huge

   The contents row stops being furniture and becomes the display type. Five
   words descending the hero, each one a stage and each one a link. The h1 is
   the journey. */
export function stagesHero() {
  const WORDS = ["Before", "During", "After", "Changes", "Booking"];
  return `<section class="page-hero page-hero--light hxb-k">
    <div class="section-shell page-hero__inner">
      ${crumbs()}
      <h1 class="hxb-k__stack">
        ${WORDS.map(
          (word, i) => `<a href="#stage-${i + 1}" class="hxb-k__word hxb-k__word--${i + 1}">
            <span class="hxb-k__n">${String(i + 1).padStart(2, "0")}</span>${word}
          </a>`,
        ).join("")}
      </h1>
      <p class="hxb-k__foot">Your first appointment, start to finish &mdash; what happens, what to bring, what it costs and what follows.</p>
    </div>
  </section>
  ${firstStation()}`;
}

export const HEROES = [
  { id: "f", name: "Question wall", build: wallHero },
  { id: "g", name: "Ask me anything", build: portraitHero },
  { id: "h", name: "The room", build: roomHero, dark: true },
  { id: "i", name: "The route", build: routeHero },
  { id: "j", name: "The transcript", build: transcriptHero },
  { id: "k", name: "The stages, huge", build: stagesHero },
];
