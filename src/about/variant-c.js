import "./variant-c.css";
import {
  NAME,
  PRACTICE,
  PULLQUOTES,
  QUALIFICATIONS,
  CHAPTERS,
  WHERE,
  PORTRAIT,
} from "./content.js";

/* Variant C — The turn.

   The most interesting thing about Natasha is that she did something else
   first. That is a sequence, so the page is a sequence: one rule running
   down the page, her own account of each step hung off it, and her face at
   the far end as the thing the sequence arrives at rather than the thing it
   opens with.

   No years are asserted anywhere — the live site gives none, and a timeline
   that shows dates it does not have is a timeline that lies. The order is
   the only chronology claimed, which is the only one that is sourced. */

export const meta = { label: "Timeline", tone: "light" };

/* Credentials hang off the step that earned them rather than sitting in a
   shelf at the end — "where did that come from" is the question the whole
   page is answering, so the answer belongs next to the question.

   Keyed by CHAPTERS index so re-ordering the chapters cannot silently
   orphan a qualification. All three of the massage/anatomy awards sit on
   the training step: grouping them there is a layout decision, and spacing
   them across earlier steps would imply an order the source does not give.

   `note` is dropped deliberately. The only qualification carrying one is
   the LSSM diploma, and the training chapter already says that same
   sentence in her own words a few lines above. */
const CREDENTIALS_BY_STEP = {
  2: QUALIFICATIONS.slice(0, 3),
  3: QUALIFICATIONS.slice(3, 4),
};

function credentials(index) {
  const awards = CREDENTIALS_BY_STEP[index];
  if (!awards) return "";
  return `<ul class="av-c__creds" aria-label="Qualifications from this step">
    ${awards
      .map(
        (award) => `<li>
          <span class="av-c__cred-name">${award.title}</span>
          <span class="av-c__cred-body">${award.body}</span>
        </li>`,
      )
      .join("")}
  </ul>`;
}

/* The payoff. Lazy because it sits at the bottom of a long scroll, and
   sized to the reading column rather than the viewport — it is a portrait
   at the end of a story, not a hero image. */
function portraitFigure() {
  return `<figure class="av-c__now">
    <img
      class="av-portrait"
      src="${PORTRAIT.portrait900}"
      srcset="${PORTRAIT.portrait540} 540w, ${PORTRAIT.portrait900} 900w"
      sizes="(max-width: 860px) 84vw, 420px"
      width="900"
      height="1200"
      alt="${PORTRAIT.alt}"
      loading="lazy"
      decoding="async"
    />
  </figure>`;
}

function step(chapter, index) {
  const isLast = index === CHAPTERS.length - 1;
  return `<li class="av-c__step" data-reveal>
    <p class="av-c__label">${chapter.label}</p>
    <h3>${chapter.title}</h3>
    <p class="av-c__step-text">${chapter.text}</p>
    ${credentials(index)}
    ${isLast ? portraitFigure() : ""}
  </li>`;
}

export function build() {
  return `
  <section class="av-c__hero">
    <div class="section-shell">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><span>About</span>
      </nav>
      <h1 data-reveal>${NAME}</h1>
      <p class="av-c__lede" data-reveal>${PRACTICE.specialism}</p>
      <p class="av-c__sub" data-reveal>${PRACTICE.breadth}</p>
    </div>
  </section>

  <section class="av-c__sequence" aria-labelledby="av-c-sequence-title">
    <div class="section-shell">
      <h2 id="av-c-sequence-title" data-reveal>How I got here</h2>
      <div class="av-c__track">
        <svg class="av-c__rule" viewBox="0 0 24 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="av-c__rule-line" d="M12 0 V 1000" pathLength="1" />
        </svg>
        <ol class="av-c__steps">
          ${CHAPTERS.map(step).join("")}
        </ol>
      </div>
    </div>
  </section>

  <section class="av-c__coda">
    <div class="section-shell av-c__coda-inner">
      <blockquote class="av-c__pull" data-reveal>
        <p>${PULLQUOTES.passion}</p>
      </blockquote>
      <div class="av-c__coda-prose" data-reveal>
        <p>${PRACTICE.aim}</p>
        <p>${PULLQUOTES.care}</p>
      </div>
    </div>
  </section>

  <section class="av-c__where">
    <div class="section-shell">
      <h2 data-reveal>Where I work</h2>
      <ul class="av-c__where-list">
        ${WHERE.map(
          (place) => `<li data-reveal>
            <a href="${place.href}">
              <h3>${place.name}</h3>
              <p>${place.lines.join("<br />")}</p>
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

/* Draw the rule in step with scroll, following the same shape as the
   testimonial thread in main.js: one rAF-throttled read of the track's own
   rect, one custom property written back. --c-progress runs 0 (undrawn) to
   1 (complete); the stylesheet turns that into the stroke-dashoffset of a
   pathLength="1" path.

   Measuring the track rather than the section keeps the line in step with
   the steps themselves — the section's heading and padding would otherwise
   shift the whole draw earlier than the content it belongs to. */
export function init() {
  const track = document.querySelector(".av-c .av-c__track");
  if (!track) return;

  /* Reduced motion gets the finished line and no scroll listener at all —
     an undrawn line waiting on a handler that never runs would leave the
     sequence looking broken rather than still. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.setProperty("--c-progress", "1");
    return;
  }

  let queued = false;

  const draw = () => {
    queued = false;
    const rect = track.getBoundingClientRect();
    // 0 as the track's top reaches the fold, 1 shortly before its bottom
    // clears it, so the drawn tip stays ahead of what you are reading
    // instead of finishing halfway down.
    const span = Math.max(rect.height * 0.92, 1);
    const travelled = window.innerHeight - rect.top;
    const progress = Math.min(Math.max(travelled / span, 0), 1);
    track.style.setProperty("--c-progress", String(progress));
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
