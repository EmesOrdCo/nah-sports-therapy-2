import "./variant-e.css";
import { initSpine } from "./spine.js";
import { filmFrame } from "../films.js";
import {
  NAME,
  STORY,
  PRACTICE,
  PULLQUOTES,
  QUALIFICATIONS,
  PORTRAIT,
  WELCOME_FILM,
  ATHLETE_QUOTE,
  CHARITY,
} from "./content.js";

/* Variant E — In her words.

   Who she is, where she trained, what she treats, why she does it. An
   introduction and her portrait open the page together — two columns, the
   words held on the shell's left line and the photograph running off the right
   edge of the window — then the marks she trained under drift past, and the
   one sentence from the old site that turns from her to you ("You don't have
   to be an athlete…") stands centred on the page before a word of the
   conversation.

   That sentence used to close the page from inside a navy band, with the
   qualifications listed beside it. The band has gone: the strip carries the
   credentials now, and the sentence carries itself.

   The practical half — what happens, what to wear, what it costs, the clinic
   policies, where to find her, how to book — used to run underneath this and
   now has its own page at /faq. Those are a reference; this is a person. The
   closing block hands over to it.

   The questions are ours. Every answer is a sentence Natasha already wrote.
   Nothing folds away — an accordion would hide precisely the reassurance a
   first-time client came for. */

export const meta = { label: "Interview", tone: "light" };

export function init() {
  initSpine();
}

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
   question and its answer reveal and space as a single unit, and here also what
   lets the pair be placed as one cell of the grid. The id is what the practical
   half's index links to.

   `index` decides the side, and the row is set explicitly rather than left to
   the grid. Auto-placement fills the first free cell, so the second pair asking
   for the left column would land in the row the first pair had already opened:
   questions would sit two abreast, the reader would meet them in pairs instead
   of one at a time, and the spine would have to run dead horizontal between two
   nodes sharing a line. One question per row is the whole premise. */
function pair(question, body, index) {
  const side = index % 2 === 0 ? "right" : "left";
  return `<div class="av-e__pair av-e__pair--${side}" id="q-${slug(question)}"
    style="grid-row: ${index + 1}" data-pair data-reveal>
    <dt class="av-e__q" data-question>${question}</dt>
    <dd class="av-e__a">${body}</dd>
  </div>`;
}

export function build() {
  return `
  <!-- The photo hero the home page and /studio open on, on the studio's own
       component — full bleed behind the transparent header, the weighted
       scrim, a left column of light type. The photograph is the portrait
       this hero used to hold in a two-column grid: Natasha against the
       muscular-system chart, recut from its square to the studio hero's
       frame (see PORTRAIT in content.js for the cut). The breadcrumbs went
       with the columns — neither of the other two photo heroes carries any.

       No aria-hidden on the media, unlike /studio: there the photograph is
       the room the h1 already names, here it is the person the page is
       about, so it keeps its description. -->
  <section class="clinics-hero" aria-labelledby="about-title">
    <div class="clinics-hero__media">
      <img
        class="clinics-hero__still"
        src="${PORTRAIT.hero1600}"
        srcset="${PORTRAIT.hero800} 800w, ${PORTRAIT.hero1600} 1600w, ${PORTRAIT.hero2400} 2400w"
        sizes="100vw"
        width="1600"
        height="1248"
        alt="${PORTRAIT.alt}"
        fetchpriority="high"
      />
      <div class="clinics-hero__scrim" aria-hidden="true"></div>
    </div>
    <div class="clinics-hero__inner">
      <p class="clinics-hero__eyebrow"><i aria-hidden="true"></i>About Natasha</p>
      <h1 id="about-title">Meet Natasha.</h1>
      <div class="clinics-hero__footer">
        <p>
          ${NAME} is a Sports Therapist and Certified STOTT Pilates instructor
          in Studham. Where she trained, what she treats and why she does it.
        </p>
        <a class="pilates-arrow-link" href="/contact">
          Book an appointment <span>&#8599;</span>
        </a>
      </div>
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

  <!-- The welcome film, directly under the sentence that turns from her to
       you: the quote speaks to the reader, and the film is the same gesture
       made physical — Natasha at the studio door, showing you in — before the
       conversation below settles back into her recorded sentences. It stands
       outside the spine rather than as a pair on it: the pairs are questions
       with her sentences for answers, and this answer is a film.

       The frame, the poster overlay and the one-at-a-time playback are the
       client-films component (filmFrame / initFilmShelf in films.js), so a
       film here behaves exactly like a film on /client-stories. Only the
       section around it is this page's: film on the left where the hero put
       the photograph on the right, so the two figures bracket the page's
       opening act between them. -->
  <section class="av-e__film" aria-labelledby="about-film-title">
    <div class="section-shell av-e__film-grid">
      <!-- films__card as well as this page's own class: the "overlay comes
           off once started" rule in style.css is scoped to the shelf's two
           shapes (.films__card / .films__lead), and initFilmShelf hangs the
           is-playing state off whichever of those wraps the video. To the
           player this IS a film card — only the section around it is ours. -->
      <figure class="av-e__film-figure films__card" data-reveal>
        ${filmFrame(WELCOME_FILM, "about")}
      </figure>
      <div class="av-e__film-intro">
        <h2 id="about-film-title" data-reveal>Step inside the studio</h2>
        <p class="av-e__film-lead" data-reveal>
          Under a minute of film: Natasha opens the studio door and shows you
          around, so your first visit already feels familiar.
        </p>
        <a class="pilates-arrow-link" href="/studio" data-reveal>
          Look around the studio <span>&#8599;</span>
        </a>
      </div>
    </div>
  </section>

  <!-- The axis is an empty, zero-width marker rather than anything drawn: it is
       where the stylesheet says the spine runs, and the only thing spine.js
       reads to find out. Which side each question sits on is then worked out
       from whether it lands left or right of that mark, so the single column on
       a phone — spine held at the left margin, every question to the right of
       it — is a change of stylesheet and nothing else. -->
  <section class="av-e__interview">
    <div class="section-shell">
      <div class="av-e__spine" data-spine>
        <span class="av-e__spine-axis" aria-hidden="true" data-spine-axis></span>
        <svg class="av-e__spine-draw" aria-hidden="true" focusable="false" data-spine-draw></svg>
        <dl class="av-e__qa">
          ${pair("How did you get into this?", paras(STORY[0], TRAINING[0]), 0)}
          ${pair("Where did you train?", paras(TRAINING[1], TRAINING[2]), 1)}
          ${pair("What do you treat?", paras(PRACTICE.specialism), 2)}
          ${pair("What will you actually do?", paras(CARE[1]), 3)}
          ${pair("What are we working towards?", paras(AIM[0], CARE[2]), 4)}
          ${pair("Why do you do it?", paras(PULLQUOTES.passion), 5)}
        </dl>
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
        <p class="av-e__cta-aside">Practical questions (what happens at a first appointment, what to wear, what it costs) are answered on the <a href="/faq">FAQ page</a>.</p>
      </div>
    </div>
  </section>`;
}
