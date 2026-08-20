import "./faq.css";
import {
  CONTACT,
  FIRST_VISIT,
  POLICIES,
  PRACTICE,
  WHAT_TO_WEAR,
  WHERE,
} from "../about/content.js";

/* Frequently asked questions — the journey.

   This was the second half of the About page: the practical questions a
   first-time client asks before booking. About is now Natasha's own story and
   nothing else; everything procedural lives here.

   The page is ordered by the day rather than by topic. Five stations —
   before you come, on the day, afterwards, if plans change, booking — strung
   on a line that inks in as you scroll. Somebody arriving nervous reads the
   answers in the order they will actually meet them, and the two questions
   that used to be buried in the middle of a flat list (what to wear, whether
   you need to be sporty) are now the first things on the page.

   The copy still comes from about/content.js. That file remains the single
   source of truth for her wording (it is all lifted verbatim from the old
   site), so an edit there flows through to this page. Do not retype the
   sentences here, and do not paraphrase them into brand voice. The questions
   are ours; every answer is a sentence she already wrote.

   Nothing folds away — an accordion would hide precisely the reassurance
   somebody came to this page for. */

const STAGES = [
  "Before you come",
  "On the day",
  "Afterwards",
  "If plans change",
  "Booking",
];

function paras(...lines) {
  return lines.map((line) => `<p>${line}</p>`).join("");
}

const slug = (question) =>
  question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* Answers are assembled by splitting her paragraphs at sentence boundaries
   rather than by retyping the fragments here, which makes it structurally
   impossible for a paraphrase to creep in later. */
function sentences(text) {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

const AIM = sentences(PRACTICE.aim);

/* The first-appointment steps are things she does in sequence, but they are
   rendered as a plain marked list rather than big numerals — numbered display
   scaffolding is exactly what the design overhaul stripped out of this site,
   and the station numbers are already doing that job one level up. */
function firstVisitAnswer() {
  return `<p>${FIRST_VISIT.lead}</p>
    <ul class="faq-steps">
      ${FIRST_VISIT.steps.map((step) => `<li>${step}</li>`).join("")}
    </ul>`;
}

/* No figures here — every fee on the site lives on /prices, so this answers
   the question in shape (what the fee depends on) and hands over to the one
   page that carries the numbers. */
function priceAnswer() {
  return `<p>It depends on the appointment: how long we need, and whether it is Sports Therapy, one to one Pilates, a duet or a small group class. The recommended length is agreed before you book, so you always know the fee in advance.</p>
    <p><a class="faq-inline-link" href="/prices">See the full price list <span aria-hidden="true">&#8599;</span></a></p>`;
}

function bookingAnswer() {
  return `<p>Call or send a note describing what you would like help with, and Natasha will guide you towards the most suitable first appointment.</p>
    <ul class="faq-contact">
      <li><a href="${CONTACT.telHref}">${CONTACT.tel}</a></li>
      <li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
    </ul>`;
}

function placeList() {
  return `<ul class="faq-places">
    ${WHERE.map(
      (place) => `<li>
        <a href="${place.href}">
          <span class="faq-place-name">${place.name}</span>
          <span class="faq-place-lines">${place.lines.join("<br />")}</span>
        </a>
      </li>`,
    ).join("")}
  </ul>`;
}

/* The stations are declared as data so the hero strip and the page itself can
   never drift apart — both are generated from this one array.

   Note where the first-appointment copy now sits. It used to be one long
   answer: what she does, then what follows. Split across "on the day" and
   "afterwards" it stops being a wall and starts being a sequence, and the
   two sentences that were doing the least work at the bottom of that answer
   become questions of their own. */
const STATIONS = [
  {
    label: STAGES[0],
    title: "Getting ready",
    items: [
      { q: "What should I wear?", a: paras(...WHAT_TO_WEAR) },
      { q: "Do I need to be sporty?", a: paras(PRACTICE.breadth, AIM[1]) },
      { q: "What does it cost?", a: priceAnswer() },
      { q: POLICIES[2].q, a: paras(...POLICIES[2].a) },
    ],
  },
  {
    label: STAGES[1],
    title: "The appointment itself",
    items: [
      { q: "What happens at my first appointment?", a: firstVisitAnswer() },
      { q: POLICIES[1].q, a: paras(...POLICIES[1].a) },
    ],
  },
  {
    label: STAGES[2],
    title: "What happens next",
    items: [
      { q: "What do we do with the assessment?", a: paras(FIRST_VISIT.after[0]) },
      { q: "How will we know it is working?", a: paras(FIRST_VISIT.after[1]) },
    ],
  },
  {
    label: STAGES[3],
    title: "Cancelling and rescheduling",
    items: [
      { q: POLICIES[0].q, a: paras(...POLICIES[0].a) },
      { q: POLICIES[3].q, a: paras(...POLICIES[3].a) },
    ],
  },
  {
    label: STAGES[4],
    title: "Where to find Natasha",
    items: [
      { q: "Where will I see you?", a: placeList() },
      { q: "How do I book?", a: bookingAnswer() },
    ],
  },
];

/* The hero. Crumb, title, intro, and then the journey line, which starts here
   and runs the length of the page. The stage strip that used to index the five
   stations from up here is gone; the stations index themselves as you pass.

   The line-wave behind the title is the one /client-stories carries, taken
   verbatim — same classes, same artwork, so the two heads are one thing kept
   in one place. Only where it sits is this page's business, because this head
   has an intro and a drop line under the title where that one has neither;
   see .faq-hero .page-hero__wave. */
function faqHero() {
  return `<section class="page-hero page-hero--light page-hero--wave faq-hero">
    <div class="page-hero__wave" aria-hidden="true"></div>
    <div class="section-shell page-hero__inner">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><span>FAQ</span>
      </nav>
      <h1>Your first appointment, start to finish</h1>
      <p class="page-hero__intro">What happens, what to bring, what it costs and what follows.</p>
      <div class="faq-hero__spine" aria-hidden="true"></div>
    </div>
  </section>`;
}

/* <dl> allows a wrapping <div> around each pair, which is what lets one
   question and its answer reveal and space as a single unit. */
function pair(question, body) {
  return `<div class="faq-pair" id="q-${slug(question)}">
    <dt class="faq-q">${question}</dt>
    <dd class="faq-a">${body}</dd>
  </div>`;
}

function station(item, index) {
  return `<section class="faq-station" id="stage-${index + 1}" data-reveal aria-labelledby="stage-${index + 1}-title">
    <div class="faq-station__marker" aria-hidden="true"><span>${index + 1}</span></div>
    <div class="faq-station__head">
      <p class="faq-station__label">${item.label}</p>
      <h2 id="stage-${index + 1}-title">${item.title}</h2>
    </div>
    <dl class="faq-station__qa">
      ${item.items.map((entry) => pair(entry.q, entry.a)).join("")}
    </dl>
  </section>`;
}

/* Practical details — carried over whole from the foot of /pilates, where it
   sat as the last section before the closing card. Same heading, same four
   rows, same wording; only the class prefix changed, from pilates- to faq-,
   and the rules came across to faq.css with it.

   It stays an accordion, which makes it the one thing on this page that folds
   away — the note at the top of this file says nothing here hides, and this
   section is the exception, kept because it came over unchanged.

   Two things to know before editing it. All four policies are also answered
   inside the stations above, in Natasha's fuller wording; the rows below are
   the condensed version /pilates carried. And the copy here is typed into this
   function, where every other answer on the page is read from
   about/content.js — so editing POLICIES there will not change these four
   rows, and editing these will not change the stations. */
function practicalDetails() {
  return `<section class="faq-practical" id="practical" aria-labelledby="practical-title">
    <div class="section-shell">
      <header class="faq-practical__head" data-reveal>
        <h2 id="practical-title">Practical details</h2>
      </header>
      <div class="faq-practical__grid">
        <article data-reveal>
          <span>Clinic policies</span>
          <details><summary>Appointments and cancellation <b>+</b></summary><p>A charge is made for missed Soft Tissue, 1:1 or 2:1 Pilates appointments or non-attendance unless 24 hours notice is given. A 50% charge is required for less than 48 hours notice.</p></details>
          <details><summary>Late arrival <b>+</b></summary><p>If you are late for your 1:1 or 2:1, the session still falls within the scheduled appointment time. If the practitioner misses a scheduled 1:1 appointment, you will not be charged for this session.</p></details>
          <details><summary>Small Group blocks <b>+</b></summary><p>Small Group Pilates blocks are paid for in termly blocks. Once payment is received, your place is reserved for the entire block and no refunds are given.</p></details>
          <details><summary>Clients under 16 <b>+</b></summary><p>Clients under 16 must be accompanied by a parent who will be required to sign a parental consent form.</p></details>
        </article>
      </div>
    </div>
  </section>`;
}

/* The closing band is written out here rather than borrowed from
   site-content's cta() helper, because this page owns its whole document —
   same arrangement as About. Keep it in step with .page-cta if that changes. */
function faqCta() {
  return `<section class="page-cta">
    <div class="section-shell page-cta__inner" data-reveal>
      <div><h2>Still have a question?</h2></div>
      <div>
        <p>Ask Natasha directly and she will guide you towards the most suitable first appointment.</p>
        <a class="button-link" href="/contact">Send an enquiry <span>&#8599;</span></a>
      </div>
    </div>
  </section>`;
}

export function faqBody() {
  return `${faqHero()}
  <div class="faq-journey">
    <div class="section-shell faq-journey__inner">
      <div class="faq-journey__spine" aria-hidden="true">
        <i class="faq-journey__spine-fill"></i>
      </div>
      ${STATIONS.map(station).join("")}
    </div>
  </div>
  ${practicalDetails()}
  ${faqCta()}`;
}

/* The line is drawn from scroll position rather than from an IntersectionObserver
   because it has to track continuously, not switch at a threshold. Same
   approach as the testimonials thread in main.js — native scroll stays the
   source of truth and we only read geometry from it. */
export function initFaqJourney() {
  const fill = document.querySelector(".faq-journey__spine-fill");
  if (!fill) return;

  const track = document.querySelector(".faq-journey__spine");
  const inner = document.querySelector(".faq-journey__inner");
  const last = document.querySelector(".faq-station:last-of-type .faq-station__marker");
  if (!track || !inner || !last) return;

  /* The journey ends at the last stop, not at the foot of the column. The
     stylesheet runs the track to the bottom so it is still a line without
     JavaScript; here it is trimmed to the final marker, which is both where
     the line should stop and the distance the fill is measured against. */
  const trim = () => {
    const end =
      last.getBoundingClientRect().top - inner.getBoundingClientRect().top;
    track.style.height = `${Math.max(end, 0)}px`;
    track.style.bottom = "auto";
    return end;
  };

  // Anyone who has asked for reduced motion gets the finished line, not a
  // line that never arrives.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    trim();
    fill.style.transform = "scaleY(1)";
    return;
  }

  let queued = false;

  const draw = () => {
    queued = false;
    const end = trim();
    const travelled =
      window.innerHeight * 0.62 - inner.getBoundingClientRect().top;
    const progress = Math.min(Math.max(travelled / Math.max(end, 1), 0), 1);
    fill.style.transform = `scaleY(${progress})`;
  };

  const queue = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(draw);
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  draw();
}
