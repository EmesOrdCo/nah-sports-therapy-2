import "./variant-d.css";
import {
  NAME,
  STORY,
  PRACTICE,
  PULLQUOTES,
  QUALIFICATIONS,
  AFFILIATIONS,
  WHERE,
  VOICES,
  PORTRAIT,
} from "./content.js";

/* Variant D — Credentials.

   Written for the person reading this with an injury and a browser tab open on
   three other therapists. They are not yet interested in a career change out of
   fashion; they want to know "will she know what to do with me, and am I the
   kind of person she treats". So the page answers those two questions first —
   what she treats, then who she treats, then the paper that backs it — and only
   afterwards tells her story. Biography is the reward for trust, not the price
   of it. */

export const meta = { label: "Credentials", tone: "light" };

/* Every mark referenced by AFFILIATIONS was checked against
   public/images/legacy/ on 27 July 2026: all three are present, and all three
   happen to be 70px tall, which is why the strip can lock them to a shared
   height rather than a shared box. The set is explicit rather than assumed so
   that an affiliation added later with no mark on file — REPS, which
   content.js notes has none — degrades to a text lockup instead of rendering
   a broken image on the one section of the page whose whole job is looking
   credible. */
const MARKS_ON_FILE = new Map([
  ["/images/legacy/lssm-mark.gif", { width: 79, height: 70 }],
  ["/images/legacy/isrm-logo.jpg", { width: 110, height: 70 }],
  ["/images/legacy/merrithew-logo.png", { width: 416, height: 70 }],
]);

function affiliation(body) {
  const mark = MARKS_ON_FILE.get(body.logo);

  if (!mark) {
    return `<li class="av-d__mark av-d__mark--text" data-reveal>
      <span>${body.name}</span>
    </li>`;
  }

  /* alt is empty on purpose: the organisation's name sits in the adjacent
     span, so describing the logo as well would read it out twice. */
  return `<li class="av-d__mark" data-reveal>
    <img
      src="${body.logo}"
      width="${mark.width}"
      height="${mark.height}"
      alt=""
      loading="lazy"
      decoding="async"
    />
    <span>${body.name}</span>
  </li>`;
}

export function build() {
  return `
  <section class="av-d__hero">
    <div class="section-shell">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><span>About</span>
      </nav>
      <h1 data-reveal>${PRACTICE.specialism}</h1>
      <p class="av-d__hero-sub" data-reveal>${PULLQUOTES.care}</p>
      <p class="av-d__signature" data-reveal>${NAME}</p>
    </div>
  </section>

  <!-- The single dark band on the page, spent on the one sentence most likely
       to stop a hesitant reader leaving: she treats people like you. -->
  <section class="av-d__breadth">
    <div class="section-shell av-d__breadth-grid">
      <p class="av-d__breadth-line" data-reveal>${PRACTICE.breadth}</p>
      <p class="av-d__breadth-note" data-reveal>${PULLQUOTES.everyStep}</p>
    </div>
  </section>

  <section class="av-d__quals">
    <div class="section-shell">
      <h2 class="av-d__title" data-reveal>Qualifications &amp; training</h2>
      <ul class="av-d__qual-list">
        ${QUALIFICATIONS.map(
          (q) => `<li class="av-d__qual" data-reveal>
            <h3>${q.title}</h3>
            <div class="av-d__qual-meta">
              <p class="av-d__awarding">${q.body}</p>
              ${q.note ? `<p class="av-d__note">${q.note}</p>` : ""}
            </div>
          </li>`,
        ).join("")}
      </ul>
    </div>
  </section>

  <section class="av-d__affil">
    <div class="section-shell">
      <h2 class="av-d__title" data-reveal>Professional bodies</h2>
      <ul class="av-d__mark-list">
        ${AFFILIATIONS.map(affiliation).join("")}
      </ul>
    </div>
  </section>

  <section class="av-d__story">
    <div class="section-shell av-d__story-grid">
      <figure class="av-d__portrait" data-reveal>
        <img
          class="av-portrait"
          src="${PORTRAIT.portrait900}"
          srcset="${PORTRAIT.portrait540} 540w, ${PORTRAIT.portrait900} 900w"
          sizes="(max-width: 900px) 220px, 30vw"
          width="900"
          height="1200"
          alt="${PORTRAIT.alt}"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div class="av-d__prose" data-reveal>
        <h2 class="av-d__title">How I got here</h2>
        <p>${STORY[0]}</p>
        <p>${STORY[1]}</p>
        <p>${STORY[2]}</p>
        <p>${PRACTICE.aim}</p>
      </div>
    </div>
  </section>

  <!-- Three voices rather than four, chosen so that each speaks to a different
       kind of client — an injury, one-to-one Pilates teaching, a group class —
       instead of three people praising the same thing. -->
  <section class="av-d__voices">
    <div class="section-shell">
      <ul class="av-d__voice-list">
        ${[VOICES[0], VOICES[1], VOICES[3]]
          .map(
            (voice) => `<li data-reveal>
              <figure>
                <blockquote><p>${voice.quote}</p></blockquote>
                <figcaption>${voice.name}<span>${voice.role}</span></figcaption>
              </figure>
            </li>`,
          )
          .join("")}
      </ul>
    </div>
  </section>

  <section class="av-d__where">
    <div class="section-shell">
      <h2 class="av-d__title" data-reveal>Where I work</h2>
      <ul class="av-d__where-list">
        ${WHERE.map(
          (place) => `<li data-reveal>
            <a href="${place.href}">
              <span class="av-d__where-copy">
                <span class="av-d__where-name">${place.name}</span>
                <span class="av-d__where-lines">${place.lines.join("<br />")}</span>
              </span>
              <span class="av-d__where-arrow" aria-hidden="true">↗</span>
            </a>
          </li>`,
        ).join("")}
      </ul>
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
