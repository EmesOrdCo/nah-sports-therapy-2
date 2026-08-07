import "./variant-e.css";
import {
  NAME,
  STORY,
  PRACTICE,
  PULLQUOTES,
  QUALIFICATIONS,
  PORTRAIT,
  ATHLETE_QUOTE,
  CHARITY,
} from "./content.js";

/* Variant E — In her words.

   Who she is, where she trained, what she treats, why she does it. A
   conversation, with her portrait held beside it, closing on the one sentence
   from the old site that turns from her to you ("You don't have to be an
   athlete…").

   The practical half — what happens, what to wear, what it costs, the clinic
   policies, where to find her, how to book — used to run underneath this and
   now has its own page at /faq. Those are a reference; this is a person. The
   closing block hands over to it.

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
          Where she trained, what she treats and why she does it — in her own words.
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

  <section class="av-e__charity" id="charity" aria-labelledby="charity-title">
    <div class="section-shell">
      <div class="av-e__charity-panel" data-reveal>
        <h2 id="charity-title">${CHARITY.heading}</h2>
        <div class="av-e__charity-body">
          <p class="av-e__charity-lead">${CHARITY.lead}</p>
          <p class="av-e__charity-tail">${CHARITY.tail}</p>
          <a class="pilates-arrow-link" href="/contact">${CHARITY.cta} <span>&#8599;</span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="page-cta">
    <div class="section-shell page-cta__inner" data-reveal>
      <div><h2>Start a conversation with Natasha.</h2></div>
      <div>
        <p>Tell us what you would like help with and we will guide you towards the most suitable first appointment.</p>
        <a class="button-link" href="/contact">Send an enquiry <span>↗</span></a>
        <p class="av-e__cta-aside">Practical questions — what happens at a first appointment, what to wear, what it costs — are answered on the <a href="/faq">FAQ page</a>.</p>
      </div>
    </div>
  </section>`;
}
