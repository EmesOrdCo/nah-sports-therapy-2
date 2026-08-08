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

/* ---- The pull to the quote ----
   The first scroll on this page does not just move it a little. Once that
   opening gesture has come to rest, the page carries on down of its own accord
   and settles with the quote centred, so the sentence that speaks to the
   reader is what the page arrives at rather than something they have to go
   looking for.

   It is the only movement on the site the reader does not drive, so it is
   hedged: it fires once, only from the top, only downwards, only if they have
   not already scrolled past the quote under their own steam, and never for
   anyone who has asked for reduced motion. Anything they do during the travel
   ends it on the spot and hands the page straight back. */

// Quiet, in ms, that marks the end of the opening gesture. The weighted
// scroller in smooth-scroll.js keeps emitting scroll events while a flick
// settles, so this is measured from the last of those, not from the wheel.
const SETTLE_QUIET = 140;
// Past this many pixels the page is no longer "at the top" and the reader is
// already somewhere of their own choosing.
const ARM_LIMIT = 160;
// Less than this is a stray pixel of wheel, a bounce, or a focus ring being
// scrolled into view — not somebody setting off down the page.
const MIN_INTENT = 24;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/* Hand-rolled rather than scrollIntoView({ behavior: "smooth" }): the browser's
   own duration is fixed and short, and over the 1,600-odd pixels between the
   top of this page and the quote it reads as a jump cut rather than as travel.
   Writing the position frame by frame also means the wheel handler in
   smooth-scroll.js picks up cleanly from wherever we stopped. */
function glide(to) {
  const from = window.scrollY;
  const distance = to - from;
  const duration = Math.min(1100, Math.max(600, Math.abs(distance) * 0.55));
  const started = performance.now();
  const events = ["wheel", "touchstart", "keydown", "mousedown"];
  let frame = 0;

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    events.forEach((name) => window.removeEventListener(name, stop));
  };

  const step = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    // "instant", or this inherits the stylesheet's scroll-behavior: smooth and
    // puts a second easing on top of the one above.
    window.scrollTo({
      top: from + distance * easeOut(progress),
      behavior: "instant",
    });
    if (progress < 1) frame = window.requestAnimationFrame(step);
    else stop();
  };

  events.forEach((name) =>
    window.addEventListener(name, stop, { passive: true }),
  );
  frame = window.requestAnimationFrame(step);
}

export function init() {
  const quote = document.querySelector(".av-e__opening");
  if (!quote) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // A hash means the reader asked for a particular place on the page. Taking
  // them somewhere else instead is the one thing this must never do.
  if (window.location.hash || window.scrollY > ARM_LIMIT) return;

  const from = window.scrollY;
  let armed = true;
  let timer = 0;

  const disarm = () => {
    armed = false;
    window.clearTimeout(timer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("keydown", disarm);
  };

  /* Space, Page Down and the arrows move the page a deliberate, known amount,
     and tabbing scrolls the next link into view. Carrying on past any of those
     under your own steam is the opposite of what was asked for, so the first
     key stands the whole thing down. */
  window.addEventListener("keydown", disarm, { passive: true });

  const travel = () => {
    if (!armed) return;
    const y = window.scrollY;
    // Still where they started, or gone back up: not the opening scroll, so
    // stay armed and wait for one that is.
    if (y <= from + MIN_INTENT) return;

    const box = quote.getBoundingClientRect();
    const centre = y + box.top + box.height / 2 - window.innerHeight / 2;
    disarm();
    // At it or past it already — a restored scroll position, or a reader who
    // moves faster than this does. Either way, leave them where they are.
    if (y >= centre - 8) return;
    glide(centre);
  };

  function onScroll() {
    if (!armed) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(travel, SETTLE_QUIET);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
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
