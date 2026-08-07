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

   Who she is, where she trained, what she treats, why she does it. An
   introduction and her portrait open the page together — two columns, the
   words held on the shell's left line and the photograph running off the right
   edge of the window — and the conversation runs beneath them, closing on the
   one sentence from the old site that turns from her to you ("You don't have to
   be an athlete…").

   That sentence ("You don't have to be an athlete…") now opens the page as a
   display quote between the credentials strip and the first question, rather
   than closing it from inside the navy band. The band it came out of carries
   the qualifications on their own.

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
  <section class="av-e__hero">
    <div class="section-shell av-e__hero-grid">
      <div class="av-e__intro">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><span>About</span>
        </nav>
        <h1 data-reveal>Meet<br />Natasha</h1>
        <span class="av-e__intro-rule" aria-hidden="true" data-reveal></span>
        <p class="av-e__framing" data-reveal>
          ${NAME} is a Sports Therapist and Certified STOTT Pilates instructor
          in Studham. Where she trained, what she treats and why she does it —
          in her own words.
        </p>
        <a class="av-e__intro-cta" href="/contact" data-reveal>
          Book an appointment <span aria-hidden="true">&#8599;</span>
        </a>
      </div>

      <figure class="av-e__portrait-figure" data-reveal>
        <div class="av-e__portrait">
          <img
            class="av-portrait"
            src="${PORTRAIT.portrait900}"
            srcset="${PORTRAIT.portrait540} 540w, ${PORTRAIT.portrait900} 900w"
            sizes="(max-width: 899px) 100vw, 52vw"
            width="900"
            height="1200"
            alt="${PORTRAIT.alt}"
            loading="eager"
            decoding="async"
          />
        </div>
      </figure>
    </div>
  </section>

  <!-- The same drifting credentials strip the home page carries, on the same
       .creds component and picked up by the same [data-creds-marquee] in
       main.js. The cards are built from QUALIFICATIONS rather than retyped, so
       the awarding bodies here and the list on the navy band below can never
       disagree with each other. -->
  <section class="creds section-shell" aria-labelledby="about-creds-title">
    <h2 class="creds__title" id="about-creds-title">Qualifications &amp; training</h2>
    <!-- tabindex is for the no-JS / reduced-motion fallback, where this is a
         plain swipe track and none of the cards are focusable. The marquee
         removes it once it takes over the scrolling. -->
    <div class="creds__track" data-creds-marquee tabindex="0">
      <ul class="creds__strip">
        ${QUALIFICATIONS.map(
          (q) => `<li data-reveal>
            <img
              src="${q.logo.src}"
              alt="${q.logo.alt}"
              ${q.logo.width ? `width="${q.logo.width}" height="${q.logo.height}"` : ""}
              loading="lazy"
            />
            <span>${q.short}</span>
          </li>`,
        ).join("")}
      </ul>
    </div>
  </section>

  <!-- The one sentence on the page that turns from her to you. It used to
       close the page from inside the navy band; standing on the paper before
       the questions, it sets the terms for everything she says after it. -->
  <section class="av-e__opening">
    <div class="section-shell">
      <figure class="av-e__opening-quote" data-reveal>
        <blockquote><p>${ATHLETE_QUOTE}</p></blockquote>
        <figcaption><span aria-hidden="true"></span>${NAME}</figcaption>
      </figure>
    </div>
  </section>

  <section class="av-e__interview">
    <div class="section-shell">
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

  <!-- The record: the strip under the hero is the marks, this is what they
       are. Both are built from QUALIFICATIONS, so they cannot disagree. -->
  <section class="av-e__statement" aria-labelledby="quals-title">
    <div class="section-shell av-e__statement-grid">
      <h2 id="quals-title" data-reveal>Qualifications</h2>
      <ul class="av-e__quals">
        ${QUALIFICATIONS.map(
          (q) => `<li data-reveal>
            <span class="av-e__qual-name">${q.title}</span>
            <span class="av-e__qual-body">${q.body}</span>
          </li>`,
        ).join("")}
      </ul>
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
