import "./variant-e.css";
import {
  NAME,
  CONTACT,
  STORY,
  PRACTICE,
  PULLQUOTES,
  QUALIFICATIONS,
  WHERE,
  PORTRAIT,
  FIRST_VISIT,
  WHAT_TO_WEAR,
  ATHLETE_QUOTE,
  POLICIES,
  PRICE_SUMMARY,
} from "./content.js";

/* Variant E — In her words.

   An About page that answers your questions. It runs in two halves:

     1. Her — who she is, where she trained, what she treats, why she does it.
        A conversation, with her portrait held beside it.
     2. Practical — what actually happens, what to wear, what it costs, what
        the policies are, where to find her, how to book.

   The hinge between them is the one sentence on the old site that does both
   jobs at once ("You don't have to be an athlete…"): it closes the personal
   half and hands over to the practical one.

   The questions are ours. Every answer is a sentence Natasha already wrote.
   Nothing folds away — an accordion would hide precisely the reassurance a
   first-time client came for. */

export const meta = { label: "Interview", tone: "light" };

/* Answers are assembled by splitting her paragraphs at sentence boundaries
   rather than by retyping the fragments here. It keeps the wording bound to
   content.js — an edit there flows straight through — and it makes it
   structurally impossible for a paraphrase to creep in later. */
function sentences(text) {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

const TRAINING = sentences(STORY[1]);
const CARE = sentences(STORY[2]);
const AIM = sentences(PRACTICE.aim);

function paras(...lines) {
  return lines.map((line) => `<p>${line}</p>`).join("");
}

const slug = (question) =>
  question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* <dl> allows a wrapping <div> around each pair, which is what lets one
   question and its answer reveal and space as a single unit. The id is what
   the practical half's index links to. */
function pair(question, body, modifier = "") {
  return `<div class="av-e__pair${modifier}" id="q-${slug(question)}" data-reveal>
    <dt class="av-e__q">${question}</dt>
    <dd class="av-e__a">${body}</dd>
  </div>`;
}

function placeList() {
  return `<ul class="av-e__places">
    ${WHERE.map(
      (place) => `<li>
        <a href="${place.href}">
          <span class="av-e__place-name">${place.name}</span>
          <span class="av-e__place-lines">${place.lines.join("<br />")}</span>
        </a>
      </li>`,
    ).join("")}
  </ul>`;
}

/* The first-appointment steps are things she does in sequence, but they are
   rendered as a plain marked list rather than big numerals — numbered display
   scaffolding is exactly what the design overhaul stripped out of this site. */
function firstVisitAnswer() {
  return `<p>${FIRST_VISIT.lead}</p>
    <ul class="av-e__steps">
      ${FIRST_VISIT.steps.map((step) => `<li>${step}</li>`).join("")}
    </ul>
    ${paras(...FIRST_VISIT.after)}`;
}

function priceAnswer() {
  return `<ul class="av-e__prices">
      ${PRICE_SUMMARY.rows
        .map(
          (row) =>
            `<li><span>${row.label}</span><strong>${row.value}</strong></li>`,
        )
        .join("")}
    </ul>
    <p class="av-e__price-note">${PRICE_SUMMARY.note}</p>
    <p><a class="av-e__inline-link" href="/prices">See the full price list <span aria-hidden="true">↗</span></a></p>`;
}

function bookingAnswer() {
  return `<p>Call or send a note describing what you would like help with, and Natasha will guide you towards the most suitable first appointment.</p>
    <ul class="av-e__contact">
      <li><a href="${CONTACT.telHref}">${CONTACT.tel}</a></li>
      <li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
    </ul>`;
}

/* Practical questions are declared as data so the skim index and the list
   itself can never drift apart — both are generated from this one array. */
const PRACTICAL = [
  { q: "What happens at my first appointment?", body: firstVisitAnswer() },
  { q: "What should I wear?", body: paras(...WHAT_TO_WEAR) },
  { q: "Do I need to be sporty?", body: paras(PRACTICE.breadth, AIM[1]) },
  { q: "What does it cost?", body: priceAnswer() },
  ...POLICIES.map((policy) => ({ q: policy.q, body: paras(...policy.a) })),
  { q: "Where will I see you?", body: placeList() },
  { q: "How do I book?", body: bookingAnswer() },
];

export function build() {
  return `
  <section class="av-e__interview">
    <div class="section-shell av-e__grid">
      <div class="av-e__aside">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><span>About</span>
        </nav>
        <h1 data-reveal>${NAME}</h1>
        <p class="av-e__framing" data-reveal>
          Sports Therapist and Certified STOTT Pilates instructor, Studham.
          Everything people ask before a first appointment, answered in her own words.
        </p>
        <figure class="av-e__portrait-figure" data-reveal>
          <div class="av-e__portrait">
            <img
              class="av-portrait"
              src="${PORTRAIT.portrait900}"
              srcset="${PORTRAIT.portrait540} 540w, ${PORTRAIT.portrait900} 900w"
              sizes="(max-width: 899px) 100vw, 34vw"
              width="900"
              height="1200"
              alt="${PORTRAIT.alt}"
              loading="eager"
              decoding="async"
            />
          </div>
          <figcaption class="av-e__speaker">
            <span class="av-e__speaker-name">${NAME}</span>
            <span class="av-e__speaker-role">Sports Therapist &middot; Certified STOTT Pilates Instructor</span>
          </figcaption>
        </figure>
      </div>

      <dl class="av-e__qa">
        ${pair("How did you get into this?", paras(STORY[0], TRAINING[0]))}
        ${pair("Where did you train?", paras(TRAINING[1], TRAINING[2]))}
        ${pair("What do you treat?", paras(PRACTICE.specialism))}
        ${pair("What will you actually do?", paras(CARE[1]))}
        ${pair("What are we working towards?", paras(AIM[0], CARE[2]))}
        ${pair("Why do you do it?", paras(PULLQUOTES.passion), " av-e__pair--emphasis")}
      </dl>
    </div>
  </section>

  <section class="av-e__statement">
    <div class="section-shell av-e__statement-grid">
      <blockquote data-reveal><p>${ATHLETE_QUOTE}</p></blockquote>
      <div class="av-e__statement-quals">
        <h2 data-reveal>Qualifications</h2>
        <ul class="av-e__quals">
          ${QUALIFICATIONS.map(
            (q) => `<li data-reveal>
              <span class="av-e__qual-name">${q.title}</span>
              <span class="av-e__qual-body">${q.body}</span>
            </li>`,
          ).join("")}
        </ul>
      </div>
    </div>
  </section>

  <section class="av-e__practical">
    <div class="section-shell av-e__grid av-e__grid--practical">
      <div class="av-e__practical-side">
        <header class="av-e__practical-head" data-reveal>
          <h2>Before your first appointment</h2>
          <p>The practical answers — what happens, what to bring, what it costs.</p>
        </header>

        <nav class="av-e__index" aria-label="Practical questions" data-reveal>
          <ul>
            ${PRACTICAL.map(
              (item) =>
                `<li><a href="#q-${slug(item.q)}">${item.q}</a></li>`,
            ).join("")}
          </ul>
        </nav>
      </div>

      <dl class="av-e__qa av-e__qa--practical">
        ${PRACTICAL.map((item) => pair(item.q, item.body)).join("")}
      </dl>
    </div>
  </section>

  <section class="page-cta">
    <div class="section-shell page-cta__inner" data-reveal>
      <div><h2>Start a conversation with Natasha.</h2></div>
      <div>
        <p>Tell us what you would like help with and we will guide you towards the most suitable first appointment.</p>
        <a class="button-link" href="/contact">Send an enquiry <span>↗</span></a>
      </div>
    </div>
  </section>`;
}
