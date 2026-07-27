import "./variant-b.css";
import {
  NAME,
  STORY,
  PRACTICE,
  QUALIFICATIONS,
  WHERE,
  PORTRAIT,
} from "./content.js";

/* Variant B — The letter.

   The same facts as A, arranged as a first-person long-read: serif body copy at
   a book measure, a portrait small enough to be an inset rather than a hero,
   and the credentials demoted to a note in the margin. The bet is that for a
   sole practitioner, being read the whole way through beats being presented —
   so nothing on the page is allowed to compete with the prose. No cards, no
   tinted bands, three hairlines in total. */

export const meta = { label: "Letter", tone: "light" };

/* Evidence that a real person wrote this, not the headline. From 720px up it
   floats into the prose; below that a float this size would strand the text at
   roughly 25 characters a line, so it sits as a small block above it instead. */
function portraitFigure() {
  return `<figure class="av-b__portrait">
    <img
      class="av-portrait"
      src="${PORTRAIT.portrait540}"
      srcset="${PORTRAIT.portrait540} 540w, ${PORTRAIT.portrait900} 900w"
      sizes="(max-width: 720px) 220px, 240px"
      width="900"
      height="1200"
      alt="${PORTRAIT.alt}"
      loading="eager"
      decoding="async"
    />
  </figure>`;
}

/* Signed with her first name, derived from NAME so the page can never end up
   with two spellings of it. */
const firstName = NAME.split(" ")[0];

export function build() {
  return `
  <section class="av-b__letter">
    <div class="section-shell">
      <div class="av-b__sheet">
        <header class="av-b__head">
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span>About</span>
          </nav>
          <h1 data-reveal>${NAME}</h1>
          <p class="av-b__lede" data-reveal>${PRACTICE.specialism}</p>
        </header>

        <div class="av-b__body av-b__prose" data-reveal>
          ${portraitFigure()}
          <p>${STORY[0]}</p>
          <p>${STORY[1]}</p>
          <p>${PRACTICE.aim}</p>
        </div>

        <div class="av-b__coda">
          <p class="av-b__line" data-reveal>${PRACTICE.breadth}</p>
          <div class="av-b__prose" data-reveal>
            <p>${STORY[2]}</p>
          </div>
          <p class="av-b__signoff" data-reveal>
            <span class="av-b__signoff-name">${firstName}</span>
            <span class="av-b__signoff-full">${NAME}</span>
          </p>
        </div>

        <aside class="av-b__aside" data-reveal>
          <h2>Qualifications</h2>
          <ul class="av-b__qual-list">
            ${QUALIFICATIONS.map(
              (q) => `<li>
                <h3>${q.title}</h3>
                <p>${q.body}</p>
              </li>`,
            ).join("")}
          </ul>
        </aside>
      </div>
    </div>
  </section>

  <section class="av-b__where">
    <div class="section-shell">
      <div class="av-b__where-inner">
        <h2 data-reveal>Where I work</h2>
        <ul class="av-b__where-list">
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
