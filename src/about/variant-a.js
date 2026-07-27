import "./variant-a.css";
import {
  NAME,
  STORY,
  PRACTICE,
  PULLQUOTES,
  QUALIFICATIONS,
  WHERE,
  VOICES,
  PORTRAIT,
} from "./content.js";

/* Variant A — Portrait editorial.

   The straight answer to "who is this person": her face and her name at full
   size, then her own account of how she got here, then the credentials that
   back it. Nothing clever about the order — it is the order a nervous new
   client reads in. */

export const meta = { label: "Portrait", tone: "light" };

function portraitFigure() {
  return `<figure class="av-a__portrait" data-reveal>
    <img
      class="av-portrait"
      src="${PORTRAIT.portrait900}"
      srcset="${PORTRAIT.portrait540} 540w, ${PORTRAIT.portrait900} 900w"
      sizes="(max-width: 900px) 100vw, 42vw"
      width="900"
      height="1200"
      alt="${PORTRAIT.alt}"
      loading="eager"
      decoding="async"
    />
  </figure>`;
}

export function build() {
  return `
  <section class="av-a__hero">
    <div class="section-shell av-a__hero-grid">
      <div class="av-a__hero-copy">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><span>About</span>
        </nav>
        <h1 data-reveal>${NAME}</h1>
        <p class="av-a__lede" data-reveal>${PRACTICE.specialism}</p>
        <p class="av-a__sub" data-reveal>${PRACTICE.breadth}</p>
      </div>
      ${portraitFigure()}
    </div>
  </section>

  <section class="av-a__story">
    <div class="section-shell av-a__story-grid">
      <div class="av-a__prose" data-reveal>
        <p>${STORY[0]}</p>
        <p>${STORY[1]}</p>
      </div>
      <blockquote class="av-a__pull" data-reveal>
        <p>${PULLQUOTES.passion}</p>
      </blockquote>
      <div class="av-a__prose" data-reveal>
        <p>${STORY[2]}</p>
        <p>${PRACTICE.aim}</p>
      </div>
    </div>
  </section>

  <section class="av-a__quals">
    <div class="section-shell">
      <h2 data-reveal>Qualifications &amp; training</h2>
      <ul class="av-a__qual-list">
        ${QUALIFICATIONS.map(
          (q) => `<li data-reveal>
            <h3>${q.title}</h3>
            <p class="av-a__awarding">${q.body}</p>
            ${q.note ? `<p class="av-a__note">${q.note}</p>` : ""}
          </li>`,
        ).join("")}
      </ul>
    </div>
  </section>

  <section class="av-a__where">
    <div class="section-shell">
      <h2 data-reveal>Where I work</h2>
      <ul class="av-a__where-list">
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

  <section class="av-a__voices">
    <div class="section-shell av-a__voices-grid">
      ${VOICES.slice(0, 2)
        .map(
          (voice) => `<figure data-reveal>
            <blockquote><p>${voice.quote}</p></blockquote>
            <figcaption>${voice.name}<span>${voice.role}</span></figcaption>
          </figure>`,
        )
        .join("")}
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
