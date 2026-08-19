/* Twenty exploratory directions for the NJH A4 sheet, sharing poster.js's
   data so a change of fact lands everywhere at once. Each variant carries its
   own complete look; they divide roughly into photographic covers (01, 03, 06,
   09, 10, 18), dark sheets (02, 13), typographic and tabular sheets (04, 07,
   12, 14, 19, 20), and structural plays on the comp (05, 08, 11, 15, 16, 17).

   Photography is NJH's own throughout: Natasha's portrait and mat work, the
   machine room, the treatment room, the studio at dusk, and the chair session
   photos already published on /pilates.

   Run: node sketches/build-poster.mjs && node sketches/shoot-poster.mjs */

import {
  BUSINESS,
  THERAPY_CONCERNS,
  PILATES_FORMS,
  PRICES_THERAPY,
  PRICES_PILATES,
  TIMETABLE,
  CREDENTIAL_LINE,
} from "./poster.js";

/* ---------------------------------------------------------------- palettes */

/* The site's own indigo family. */
const SITE = `
  :root {
    --brand: oklch(41.9% 0.117 275);
    --brand-strong: oklch(33.8% 0.122 279);
    --brand-light: oklch(51.5% 0.100 269);
    --periwinkle: oklch(76.7% 0.096 275);
    --ink: oklch(23.2% 0.055 277);
    --ink-soft: oklch(43.5% 0.045 277);
    --hairline: oklch(23.2% 0.055 277 / 0.16);
    --navy-bg: oklch(21.5% 0.055 277);
    --navy-deeper: oklch(17.4% 0.048 275);
    --tint-bg: oklch(97.2% 0.008 275);
    --on-dark: oklch(96.6% 0.010 275);
    --on-dark-soft: oklch(96.6% 0.010 275 / 0.72);
    --on-dark-quiet: oklch(96.6% 0.010 275 / 0.5);
  }
  .sheet { color: var(--ink); }
  .label { display: block; font-size: 7.4pt; letter-spacing: .17em; text-transform: uppercase;
           font-weight: 600; color: var(--brand); }
`;

/* The comp's cooler navy with the studio-kit teal. */
const COMP = `
  :root {
    --brand: #262C63;
    --brand-strong: #1A2150;
    --brand-light: #565D75;
    --periwinkle: #AEB8E8;
    --ink: #262C63;
    --ink-soft: #565D75;
    --hairline: rgba(38, 44, 99, .15);
    --navy-bg: #262C63;
    --navy-deeper: #151B3F;
    --tint-bg: #EEF1F6;
    --teal: #2FB3B7;
    --on-dark: #F4F6FC;
    --on-dark-soft: rgba(244, 246, 252, .74);
    --on-dark-quiet: rgba(244, 246, 252, .5);
  }
  .sheet { color: var(--ink); }
  .label { display: block; font-size: 7.4pt; letter-spacing: .12em; text-transform: uppercase;
           font-weight: 700; color: var(--teal); }
`;

/* ----------------------------------------------------------------- helpers */

const leaders = `
  .row { display: flex; align-items: baseline; gap: 1.4mm; }
  .row__lead { flex: 1 1 auto; min-width: 3mm; border-bottom: 0.25mm dotted var(--hairline); transform: translateY(-0.9mm); }
  .row__fee { flex: 0 0 auto; font-variant-numeric: tabular-nums; font-weight: 600; }
`;

const wordmark = () => `<div class="wordmark">
  <img class="wordmark__mark" src="/images/njh-mark.svg" alt="" width="218" height="198">
  <div class="wordmark__text">
    <span class="wordmark__name">${BUSINESS.name}</span>
    <span class="wordmark__descriptor">${BUSINESS.descriptor}</span>
  </div>
</div>`;

const WORDMARK_CSS = `
  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 13mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 1.6mm; }
`;

const rows = (list) =>
  list
    .map(
      ([label, fee]) =>
        `<p class="row"><span>${label}</span><span class="row__lead"></span><span class="row__fee">${fee}</span></p>`,
    )
    .join("");

const tt = () =>
  TIMETABLE.map(
    ([day, times]) =>
      `<div class="tt__row"><span class="tt__day">${day}</span><span class="tt__times">${times
        .map((x) => `<span>${x}</span>`)
        .join("")}</span></div>`,
  ).join("");

const TT_CSS = `
  .tt__row { display: flex; align-items: baseline; gap: 3mm; padding: 1.4mm 0; }
  .tt__row + .tt__row { border-top: 0.2mm solid var(--hairline); }
  .tt__day { flex: 0 0 17mm; font-size: 8.4pt; font-weight: 600; }
  .tt__times { display: flex; flex-wrap: wrap; gap: .6mm 3.2mm; font-size: 8.4pt; font-variant-numeric: tabular-nums; }
  .tt__times small { font-size: 6.6pt; }
`;

/* The three-table figures strip most sheets close on. */
const figures = () => `<section class="figures">
  <section><span class="label">Sports Therapy</span>${rows(PRICES_THERAPY)}</section>
  <section><span class="label">Pilates</span>${rows(PRICES_PILATES)}</section>
  <section><span class="label">Weekly small-group classes</span>${tt()}</section>
</section>`;

const contactLine = () =>
  `${BUSINESS.phone} &nbsp;&middot;&nbsp; ${BUSINESS.email} &nbsp;&middot;&nbsp; ${BUSINESS.web}`;

/* =========================================================== 01 dusk cover
   The studio at dusk as a full-page cover, everything else on the scrim. The
   one direction built entirely around the best photograph NJH owns. */

const l01 = {
  slug: "poster-l01-dusk-cover",
  label: "L01 Dusk cover",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .sheet { background: var(--navy-deeper); }
  .cover { position: absolute; inset: 0; }
  .cover img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 38%; }
  .cover::after { content: ""; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(21,27,63,.55) 0%, rgba(21,27,63,0) 26%, rgba(21,27,63,0) 40%, rgba(21,27,63,.94) 78%, #151B3F 100%); }

  .top { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 12mm 14mm 0; color: var(--on-dark); }
  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 12mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 21pt; color: #fff; }
  .wordmark__descriptor { font-size: 6.8pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.85); margin-top: 1.5mm; }
  .top__where { font-size: 7.4pt; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.85); text-align: right; line-height: 1.7; }

  .foot { position: relative; margin-top: auto; padding: 0 14mm 9mm; color: var(--on-dark); }
  .foot h1 { font-size: 27pt; line-height: 1.12; letter-spacing: -0.02em; color: #fff; max-width: 150mm; }
  .foot h1 em { font-style: italic; color: var(--teal); }
  .foot__intro { font-size: 9.6pt; line-height: 1.6; color: var(--on-dark-soft); margin-top: 4mm; max-width: 120mm; }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 7mm;
             padding-top: 5.5mm; border-top: 0.25mm solid rgba(255,255,255,.22); }
  .label { color: var(--teal); margin-bottom: 2.6mm; }
  .row { font-size: 8.2pt; line-height: 1.9; color: var(--on-dark-soft); }
  .row__lead { border-bottom-color: rgba(255,255,255,.2); }
  .row__fee { color: #fff; }
  .tt__row + .tt__row { border-top-color: rgba(255,255,255,.14); }
  .tt__day { color: #fff; }
  .tt__times { color: var(--on-dark-soft); }
  .tt__times small { color: var(--teal); }

  .bar { display: flex; justify-content: space-between; align-items: baseline; gap: 6mm; margin-top: 6mm;
         padding-top: 4.5mm; border-top: 0.25mm solid rgba(255,255,255,.22); }
  .bar__contact { font-size: 9pt; color: #fff; font-weight: 500; }
  .bar__person { font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; color: var(--on-dark-quiet); font-weight: 600; }
  `,
  html: `<div class="sheet">
    <figure class="cover"><img src="/images/pilates/studio-dusk-1536.webp" alt="The NJH studio at dusk, doors open to the terrace"></figure>
    <header class="top">
      ${wordmark()}
      <p class="top__where">${BUSINESS.where}<br>Private studio &middot; est. 2016</p>
    </header>
    <footer class="foot">
      <h1>Hands-on treatment and precise movement, from <em>one private studio.</em></h1>
      <p class="foot__intro">Sports Therapy and Clinical Pilates with ${BUSINESS.person}. Not only for athletes, and not only for the already-strong: clients are aged eight to over eighty.</p>
      ${figures()}
      <div class="bar">
        <span class="bar__contact">${contactLine()}</span>
        <span class="bar__person">${BUSINESS.person}</span>
      </div>
    </footer>
  </div>`,
};

/* ============================================================= 02 midnight
   A dark editorial sheet: navy paper, teal accents, the portrait held in a
   circle, figures on a deeper panel. */

const l02 = {
  slug: "poster-l02-midnight",
  label: "L02 Midnight",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .sheet { background: var(--navy-bg); color: var(--on-dark); padding: 13mm 14mm 0; }
  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 12.5mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 21pt; color: #fff; }
  .wordmark__descriptor { font-size: 6.8pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: var(--teal); margin-top: 1.5mm; }

  .hero { display: grid; grid-template-columns: 1fr 58mm; gap: 0 12mm; align-items: center; padding: 10mm 0 9mm; }
  .hero h1 { font-size: 27pt; line-height: 1.13; letter-spacing: -0.02em; color: #fff; }
  .hero h1 em { font-style: italic; color: var(--teal); }
  .hero p { font-size: 9.4pt; line-height: 1.62; color: var(--on-dark-soft); margin-top: 5mm; }
  .sig { font-family: "Parisienne", cursive; font-size: 17pt; color: var(--teal); margin-top: 6mm; }
  .hero__role { font-size: 6.8pt; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; color: var(--on-dark-quiet); margin-top: 2.5mm; line-height: 1.7; }
  .portrait { width: 58mm; height: 58mm; border-radius: 50%; overflow: hidden;
              box-shadow: 0 0 0 0.35mm rgba(47,179,183,.55), 0 0 0 5mm rgba(47,179,183,.10); }
  .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 46% 24%; }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 11mm; padding: 7mm 0; border-top: 0.25mm solid rgba(255,255,255,.18); }
  .duo h2 { font-size: 14.5pt; letter-spacing: -0.014em; color: #fff; margin: 2.4mm 0 2.6mm; }
  .duo > article > p { font-size: 8.8pt; line-height: 1.58; color: var(--on-dark-soft); }
  .duo ul { margin-top: 3.6mm; }
  .duo li { font-size: 8.2pt; line-height: 1.42; color: var(--on-dark); padding-left: 4mm; position: relative; margin-bottom: 1.6mm; }
  .duo li::before { content: ""; position: absolute; left: 0; top: 1.6mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.3mm solid var(--teal); }

  .figures { margin: auto -14mm 0; background: var(--navy-deeper); padding: 7mm 14mm 6mm;
             display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; }
  .figures .label { color: var(--teal); margin-bottom: 3mm; }
  .row { font-size: 8.2pt; line-height: 2; color: var(--on-dark-soft); }
  .row__lead { border-bottom-color: rgba(255,255,255,.18); }
  .row__fee { color: #fff; }
  .tt__row + .tt__row { border-top-color: rgba(255,255,255,.12); }
  .tt__day { color: #fff; }
  .tt__times { color: var(--on-dark-soft); }
  .tt__times small { color: var(--teal); }
  .creds { grid-column: 1 / -1; margin-top: 4mm; padding-top: 3.4mm; border-top: 0.2mm solid rgba(255,255,255,.14);
           display: flex; justify-content: space-between; gap: 6mm; font-size: 6.6pt; color: var(--on-dark-quiet); }
  .creds b { color: var(--on-dark-soft); font-weight: 500; font-size: 8.4pt; }
  `,
  html: `<div class="sheet">
    ${wordmark()}
    <section class="hero">
      <div>
        <h1>Two disciplines, <em>one quiet room.</em></h1>
        <p>Assessment-led Sports Therapy and precise, clinical Pilates from a private studio in Studham. Clients are aged eight to over eighty.</p>
        <p class="sig">${BUSINESS.person}</p>
        <p class="hero__role">${BUSINESS.role}</p>
      </div>
      <figure class="portrait"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland"></figure>
    </section>

    <section class="duo">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>For musculoskeletal pain, tension and restricted movement.</p>
        <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>Slow, precise work on the mat, the Reformer and the Stability Chair.</p>
        <ul>${PILATES_FORMS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
    </section>

    ${figures().replace("</section>\n</section>", `</section>
      <p class="creds"><b>${contactLine()}</b><span>${CREDENTIAL_LINE}</span></p>
    </section>`)}
  </div>`,
};

/* ================================================================ 03 split
   A straight vertical halving: the portrait owns the left half of the page to
   every trim, and the right half is a single calm column of content. */

const l03 = {
  slug: "poster-l03-split",
  label: "L03 Split",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .sheet { flex-direction: row; }
  .half { flex: 0 0 96mm; position: relative; overflow: hidden; }
  .half img { width: 100%; height: 100%; object-fit: cover; object-position: 55% 30%; }
  .half figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 5mm 8mm 6mm;
    background: linear-gradient(180deg, rgba(23,27,58,0), rgba(23,27,58,.82));
    color: var(--on-dark); font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; line-height: 1.8; }

  .col { flex: 1 1 auto; padding: 13mm 11mm 0 11mm; display: flex; flex-direction: column; }
  .col h1 { font-size: 19.5pt; line-height: 1.18; letter-spacing: -0.02em; color: var(--brand-strong); margin-top: 9mm; }
  .col__intro { font-size: 8.8pt; line-height: 1.6; color: var(--ink-soft); margin-top: 4mm; }

  .block { padding: 5.5mm 0; border-top: 0.2mm solid var(--hairline); margin-top: 5.5mm; }
  .block:first-of-type { border-top: 0; }
  .block h2 { font-size: 12.5pt; letter-spacing: -0.012em; margin: 2mm 0 2.4mm; }
  .block p { font-size: 8.2pt; line-height: 1.55; color: var(--ink-soft); }
  .block ul { margin-top: 3mm; }
  .block li { font-size: 8pt; line-height: 1.42; padding-left: 3.6mm; position: relative; margin-bottom: 1.2mm; }
  .block li::before { content: ""; position: absolute; left: 0; top: 1.5mm; width: 1.5mm; height: 1.5mm; border-radius: 50%; border: 0.28mm solid var(--brand-light); }
  .fees { display: grid; grid-template-columns: 1fr 1fr; gap: 0 7mm; margin-top: 3.4mm; }
  .fees .label { font-size: 6.7pt; letter-spacing: .14em; color: var(--brand-light); margin-bottom: 2mm; }
  .row { font-size: 8pt; line-height: 1.85; }
  .row__fee { color: var(--brand-strong); }
  .block .tt__day { flex: 0 0 15mm; font-size: 8pt; }
  .block .tt__times { font-size: 8pt; color: var(--ink-soft); }
  .block .tt__times small { color: var(--brand-light); }

  .close { margin: auto -11mm 0; background: var(--navy-bg); color: var(--on-dark); padding: 5.5mm 11mm 7mm; }
  .close b { display: block; font-size: 10.5pt; font-weight: 500; margin-bottom: 1.6mm; }
  .close span { font-size: 8pt; color: var(--on-dark-soft); display: block; line-height: 1.6; }
  `,
  html: `<div class="sheet">
    <figure class="half">
      <img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio">
      <figcaption>${BUSINESS.person}<br>${BUSINESS.role}</figcaption>
    </figure>
    <div class="col">
      ${wordmark()}
      <h1>Hands-on treatment and precise movement.</h1>
      <p class="col__intro">Sports Therapy and Clinical Pilates from one private studio in ${BUSINESS.where}. Clients are aged eight to over eighty.</p>

      <section class="block">
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led care.</h2>
        <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </section>

      <section class="block">
        <span class="label">Clinical Pilates</span>
        <h2>Mat, Reformer, Stability Chair.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </section>

      <section class="block">
        <span class="label">Prices &amp; classes</span>
        <div class="fees">
          <div><span class="label">Sports Therapy</span>${rows(PRICES_THERAPY)}</div>
          <div><span class="label">Pilates</span>${rows(PRICES_PILATES)}</div>
        </div>
        <div style="margin-top: 3.5mm">${tt()}</div>
      </section>

      <footer class="close">
        <b>${BUSINESS.phone}</b>
        <span>${BUSINESS.email}<br>${BUSINESS.web}</span>
      </footer>
    </div>
  </div>`,
};

/* ========================================================== 04 typographic
   No photograph at all: the headline is the artwork, set enormous, with the
   facts in a wide measured band underneath. */

const l04 = {
  slug: "poster-l04-typographic",
  label: "L04 Typographic",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .sheet { padding: 14mm 16mm 0; }
  .masthead { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 5mm; border-bottom: 0.4mm solid var(--brand-strong); }
  .masthead__meta { text-align: right; font-size: 8pt; line-height: 1.6; color: var(--ink-soft); }
  .masthead__meta b { color: var(--ink); }

  h1 { font-size: 47pt; line-height: 1.04; letter-spacing: -0.033em; color: var(--brand-strong); padding: 12mm 0 0; }
  h1 em { font-style: italic; }
  h1 .soft { color: var(--periwinkle); }
  .standfirst { font-size: 11pt; line-height: 1.62; color: var(--ink-soft); margin-top: 8mm; max-width: 140mm; }

  .lists { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14mm; padding: 10mm 0 0; }
  .lists > div + div { padding-left: 14mm; border-left: 0.2mm solid var(--hairline); margin-left: -14mm; }
  .lists h2 { font-size: 13pt; margin: 2.4mm 0 2mm; }
  .lists p { font-size: 8.8pt; line-height: 1.62; color: var(--ink-soft); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 10mm; margin: auto -16mm 0;
             padding: 7mm 16mm 7mm; background: var(--tint-bg); }
  .figures .label { color: var(--brand-light); margin-bottom: 3mm; }
  .row { font-size: 8.6pt; line-height: 2; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: 0 -16mm; background: var(--navy-bg); color: var(--on-dark); padding: 5.5mm 16mm 7mm;
          display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 10pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    <header class="masthead">
      ${wordmark()}
      <p class="masthead__meta"><b>${BUSINESS.person}</b><br>${BUSINESS.role}<br>${BUSINESS.where}</p>
    </header>

    <h1>Move well.<br>Feel <em>strong.</em><br><span class="soft">Ages eight to eighty.</span></h1>
    <p class="standfirst">Assessment-led Sports Therapy and precise, clinical Pilates from one private studio. Every session starts by listening, and every plan is built around what you want to get back to.</p>

    <section class="lists">
      <div>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
      </div>
      <div>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </div>
    </section>

    ${figures()}

    <footer class="foot">
      <b>${contactLine()}</b>
      <span>${CREDENTIAL_LINE}</span>
    </footer>
  </div>`,
};

/* ================================================================= 05 wave
   The site's line-wave artwork carries the page: one wave under the head, the
   crest above the foot, everything between kept light and centred. */

const l05 = {
  slug: "poster-l05-wave",
  label: "L05 Wave",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  .sheet { padding: 13mm 0 0; text-align: center; }
  .shell { padding: 0 20mm; }
  .wordmark { display: flex; flex-direction: column; align-items: center; gap: 3mm; }
  .wordmark__mark { width: 13mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7pt; letter-spacing: .2em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 2mm; }

  .wave { width: 100%; height: 30mm; object-fit: cover; object-position: 50% 42%; margin-top: 5mm; }
  .wave--foot { height: 24mm; margin: 0; object-position: 50% 60%; transform: scaleX(-1); }

  h1 { font-size: 28pt; line-height: 1.1; letter-spacing: -0.026em; color: var(--brand-strong); margin-top: 3mm; }
  h1 em { font-style: italic; }
  .standfirst { font-size: 9.6pt; line-height: 1.62; color: var(--ink-soft); margin: 5mm auto 0; max-width: 120mm; }

  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14mm; padding-top: 8mm; text-align: left; }
  .pair > article + article { padding-left: 14mm; border-left: 0.2mm solid var(--hairline); margin-left: -14mm; }
  .pair h2 { font-size: 14pt; letter-spacing: -0.014em; margin: 2.6mm 0 2.6mm; }
  .pair p { font-size: 8.7pt; line-height: 1.6; color: var(--ink-soft); }
  .pair ul { margin-top: 3.2mm; }
  .pair li { font-size: 8.2pt; line-height: 1.42; padding-left: 3.6mm; position: relative; margin-bottom: 1.3mm; }
  .pair li::before { content: ""; position: absolute; left: 0; top: 1.5mm; width: 1.5mm; height: 1.5mm; border-radius: 50%; border: 0.28mm solid var(--brand-light); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 10mm; text-align: left;
             padding: 7mm 20mm; margin-top: 7mm; background: var(--tint-bg); }
  .figures .label { color: var(--brand-light); margin-bottom: 2.6mm; }
  .row { font-size: 8.4pt; line-height: 1.9; }
  .row__fee { color: var(--brand-strong); }

  .sign { margin-top: auto; padding: 5mm 20mm 0; }
  .sign b { font-family: "STIX Two Text", serif; font-weight: 400; font-size: 14pt; color: var(--brand-strong); }
  .sign p { font-size: 8pt; color: var(--ink-soft); margin-top: 2mm; }
  `,
  html: `<div class="sheet">
    <div class="shell">
      ${wordmark()}
      <h1>Hands-on treatment and <em>precise movement.</em></h1>
      <p class="standfirst">Sports Therapy and Clinical Pilates with ${BUSINESS.person}, from one private studio in ${BUSINESS.where}.</p>
    </div>
    <img class="wave" src="/images/hero-wave-2400.webp" alt="">
    <div class="shell">
      <section class="pair">
        <article>
          <span class="label">Sports Therapy</span>
          <h2>Assessment-led, hands-on care.</h2>
          <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
        </article>
        <article>
          <span class="label">Clinical Pilates</span>
          <h2>Teaching the body to support itself.</h2>
          <p>Slow, precise, controlled work that strengthens the deep postural muscles.</p>
          <ul>${PILATES_FORMS.slice(0, 4).map((x) => `<li>${x}</li>`).join("")}<li>${PILATES_FORMS[4]}</li><li>${PILATES_FORMS[5]}</li></ul>
        </article>
      </section>
    </div>
    ${figures()}
    <div class="sign">
      <b>${BUSINESS.phone} &middot; ${BUSINESS.web}</b>
      <p>${BUSINESS.email}</p>
    </div>
    <img class="wave wave--foot" src="/images/hero-wave-crest-2400.webp" alt="">
  </div>`,
};

/* ============================================================== 06 duotone
   The machine room run through a navy duotone across the whole top half, the
   headline knocked out of it, the facts on white below. */

const l06 = {
  slug: "poster-l06-duotone",
  label: "L06 Duotone",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  .top { position: relative; height: 150mm; overflow: hidden; background: var(--navy-bg); }
  .top > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%;
               filter: grayscale(1) contrast(1.02) brightness(1.04); opacity: .34; }
  .top::before { content: ""; position: absolute; inset: 0;
                 background: linear-gradient(180deg, rgba(21,27,63,.24), rgba(21,27,63,.66)); }
  .top__inner { position: absolute; inset: 0; padding: 13mm 15mm; display: flex; flex-direction: column; }
  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 12.5mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 21pt; color: #fff; }
  .wordmark__descriptor { font-size: 6.8pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: var(--periwinkle); margin-top: 1.5mm; }
  .top h1 { font-size: 31pt; line-height: 1.1; letter-spacing: -0.024em; color: #fff; margin-top: auto; max-width: 150mm; }
  .top h1 em { font-style: italic; color: var(--periwinkle); }
  .top p { font-size: 9.4pt; line-height: 1.6; color: var(--on-dark-soft); margin-top: 4mm; max-width: 122mm; }

  .body { padding: 11mm 15mm 0; display: flex; flex-direction: column; flex: 1 1 auto; }
  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; }
  .duo > article + article { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .duo h2 { font-size: 13.5pt; letter-spacing: -0.014em; margin: 2.4mm 0 2.4mm; }
  .duo p { font-size: 8.6pt; line-height: 1.58; color: var(--ink-soft); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: auto;
             padding: 6mm 0 7mm; border-top: 0.2mm solid var(--hairline); }
  .figures .label { color: var(--brand-light); margin-bottom: 2.8mm; }
  .row { font-size: 8.4pt; line-height: 1.95; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: 0 -15mm; background: var(--navy-deeper); color: var(--on-dark); padding: 5.5mm 15mm 7mm;
          display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 9.6pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    <section class="top">
      <img src="/images/pilates/room-machines-1536.webp" alt="The NJH studio">
      <div class="top__inner">
        ${wordmark()}
        <h1>One quiet room. <em>Every kind of stronger.</em></h1>
        <p>Sports Therapy and Clinical Pilates with ${BUSINESS.person}, ${BUSINESS.role.toLowerCase()}. ${BUSINESS.where}.</p>
      </div>
    </section>

    <div class="body">
      <section class="duo">
        <article>
          <span class="label">Sports Therapy</span>
          <h2>Assessment-led, hands-on care.</h2>
          <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
        </article>
        <article>
          <span class="label">Clinical Pilates</span>
          <h2>Teaching the body to support itself.</h2>
          <p>${PILATES_FORMS.join(" &middot; ")}</p>
        </article>
      </section>

      ${figures()}

      <footer class="foot">
        <b>${contactLine()}</b>
        <span>${CREDENTIAL_LINE}</span>
      </footer>
    </div>
  </div>`,
};

/* =============================================================== 07 ledger
   The whole sheet as one ruled document: a letterhead, then every fact in a
   single hairline table, like a well-set menu or fixture card. */

const l07 = {
  slug: "poster-l07-ledger",
  label: "L07 Ledger",
  css: `
  ${SITE}
  ${leaders}
  ${WORDMARK_CSS}
  .sheet { padding: 14mm 17mm 0; }
  .masthead { display: flex; justify-content: space-between; align-items: flex-end; }
  .masthead__meta { text-align: right; font-size: 8pt; line-height: 1.6; color: var(--ink-soft); }
  .masthead__meta b { color: var(--ink); }
  .title { margin-top: 8mm; padding: 4mm 0; border-top: 0.5mm solid var(--brand-strong); border-bottom: 0.2mm solid var(--hairline); }
  .title h1 { font-size: 16.5pt; letter-spacing: -0.012em; }
  .title p { font-size: 8.6pt; color: var(--ink-soft); margin-top: 1.6mm; }

  table { width: 100%; border-collapse: collapse; margin-top: 0; }
  th, td { text-align: left; vertical-align: baseline; padding: 2.5mm 0; border-bottom: 0.2mm solid var(--hairline); }
  th { font-size: 6.9pt; letter-spacing: .16em; text-transform: uppercase; font-weight: 600; color: var(--brand); padding-top: 5.5mm; }
  td.item { font-size: 9.2pt; width: 58%; }
  td.detail { font-size: 8.4pt; color: var(--ink-soft); }
  td.fee { font-size: 9.2pt; font-weight: 600; color: var(--brand-strong); text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  tr.sub td { border-bottom: none; padding: 0.8mm 0; }

  .foot { margin: auto -17mm 0; background: var(--navy-bg); color: var(--on-dark); padding: 6mm 17mm 7.5mm; }
  .foot__row { display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 10pt; font-weight: 500; }
  .foot .who { font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; color: var(--on-dark-quiet); font-weight: 600; }
  `,
  html: `<div class="sheet">
    <header class="masthead">
      ${wordmark()}
      <p class="masthead__meta"><b>${BUSINESS.person}</b><br>${BUSINESS.role}<br>${BUSINESS.where} &middot; est. 2016</p>
    </header>

    <div class="title">
      <h1>Services, prices and classes.</h1>
      <p>Everything NJH does, on one page. Enquiries: ${BUSINESS.phone} &middot; ${BUSINESS.email}</p>
    </div>

    <table>
      <tr><th colspan="3">Sports Therapy &nbsp;&mdash;&nbsp; assessment-led, hands-on care</th></tr>
      ${PRICES_THERAPY.map(
        ([l, f], i) =>
          `<tr><td class="item">${l}</td><td class="detail">${["Focused treatment of one area", "The standard appointment", "New or complex presentations"][i]}</td><td class="fee">${f}</td></tr>`,
      ).join("")}
      <tr class="sub"><td colspan="3" class="detail" style="padding-top:2mm">Commonly treated: ${THERAPY_CONCERNS.join(" &middot; ").toLowerCase()}</td></tr>

      <tr><th colspan="3">Clinical Pilates &nbsp;&mdash;&nbsp; mat, Reformer and Stability Chair</th></tr>
      ${PRICES_PILATES.map(
        ([l, f], i) =>
          `<tr><td class="item">${l}</td><td class="detail">${["55 minutes, paid termly", "Tailored entirely to you", "Shared with a friend or partner"][i]}</td><td class="fee">${f}</td></tr>`,
      ).join("")}
      <tr class="sub"><td colspan="3" class="detail" style="padding-top:2mm">${PILATES_FORMS.join(" &middot; ")}</td></tr>

      <tr><th colspan="3">Weekly small-group classes</th></tr>
      ${TIMETABLE.map(
        ([day, times]) =>
          `<tr><td class="item">${day}</td><td class="detail" colspan="2">${times.join(" &nbsp; ")}</td></tr>`,
      ).join("")}
      <tr class="sub"><td colspan="3" class="detail" style="padding-top:2mm">55 minutes unless noted. An initial one-to-one assessment is required before joining a group.</td></tr>
    </table>

    <footer class="foot">
      <div class="foot__row">
        <b>${contactLine()}</b>
        <span class="who">${BUSINESS.person}</span>
      </div>
    </footer>
  </div>`,
};

export const LAB_A = [l01, l02, l03, l04, l05, l06, l07];

/* =============================================================== 08 portal
   The portrait in a full circle dead centre, the page symmetrical around it:
   a formal, invitation-like sheet. */

const l08 = {
  slug: "poster-l08-portal",
  label: "L08 Portal",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  .sheet { padding: 13mm 0 0; text-align: center; }
  .shell { padding: 0 21mm; }
  .wordmark { display: flex; flex-direction: column; align-items: center; gap: 3mm; }
  .wordmark__mark { width: 12.5mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 21pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7pt; letter-spacing: .2em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 2mm; }

  .portal { position: relative; width: 88mm; height: 88mm; margin: 8mm auto 0; }
  .portal img { width: 100%; height: 100%; object-fit: cover; object-position: 46% 24%; border-radius: 50%; }
  .portal::before { content: ""; position: absolute; inset: -4.5mm; border-radius: 50%;
                    border: 0.3mm solid oklch(41.9% 0.117 275 / .3); }
  .portal::after { content: ""; position: absolute; inset: -9mm; border-radius: 50%;
                   border: 0.25mm solid oklch(41.9% 0.117 275 / .14); }

  h1 { font-size: 24pt; line-height: 1.12; letter-spacing: -0.022em; color: var(--brand-strong); margin-top: 10mm; }
  h1 em { font-style: italic; }
  .standfirst { font-size: 9.4pt; line-height: 1.6; color: var(--ink-soft); margin: 4.5mm auto 0; max-width: 118mm; }

  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14mm; padding-top: 7mm; text-align: left; }
  .pair > article + article { padding-left: 14mm; border-left: 0.2mm solid var(--hairline); margin-left: -14mm; }
  .pair h2 { font-size: 12.5pt; margin: 2.2mm 0 2.2mm; }
  .pair p { font-size: 8.4pt; line-height: 1.58; color: var(--ink-soft); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; text-align: left;
             margin-top: 6.5mm; padding: 6mm 21mm; background: var(--tint-bg); }
  .figures .label { color: var(--brand-light); margin-bottom: 2.6mm; }
  .row { font-size: 8.2pt; line-height: 1.85; }
  .row__fee { color: var(--brand-strong); }

  .sign { margin-top: auto; padding: 4.5mm 21mm 6.5mm; }
  .sign b { font-family: "STIX Two Text", serif; font-weight: 400; font-size: 13.5pt; color: var(--brand-strong); }
  .sign p { font-size: 7.8pt; color: var(--ink-soft); margin-top: 1.8mm; }
  `,
  html: `<div class="sheet">
    <div class="shell">
      ${wordmark()}
      <figure class="portal"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland"></figure>
      <h1>Hands-on treatment and <em>precise movement.</em></h1>
      <p class="standfirst">${BUSINESS.person}, ${BUSINESS.role.toLowerCase()}. One private studio in ${BUSINESS.where}; clients aged eight to over eighty.</p>
      <section class="pair">
        <article>
          <span class="label">Sports Therapy</span>
          <h2>Assessment-led care.</h2>
          <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
        </article>
        <article>
          <span class="label">Clinical Pilates</span>
          <h2>Precise movement.</h2>
          <p>${PILATES_FORMS.join(" &middot; ")}</p>
        </article>
      </section>
    </div>
    ${figures()}
    <div class="sign">
      <b>${BUSINESS.phone} &middot; ${BUSINESS.web}</b>
      <p>${BUSINESS.email}</p>
    </div>
  </div>`,
};

/* ============================================================= 09 diagonal
   The photograph clipped on a long diagonal, the content set against the
   slope, a teal rule echoing the cut. */

const l09 = {
  slug: "poster-l09-diagonal",
  label: "L09 Diagonal",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .hero { position: relative; height: 118mm; }
  .hero__photo { position: absolute; inset: 0; overflow: hidden;
                 clip-path: polygon(0 0, 100% 0, 100% 62%, 0 100%); }
  .hero__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 34%; }
  .hero__photo::after { content: ""; position: absolute; inset: 0;
    background: linear-gradient(100deg, rgba(21,27,63,.78) 6%, rgba(21,27,63,.24) 46%, rgba(21,27,63,0) 70%); }
  .hero__inner { position: absolute; inset: 0; padding: 12mm 14mm; color: #fff; }
  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 12mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 20pt; color: #fff; }
  .wordmark__descriptor { font-size: 6.6pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.85); margin-top: 1.4mm; }
  .hero h1 { font-size: 25pt; line-height: 1.12; letter-spacing: -0.02em; margin-top: 9mm; max-width: 96mm; }
  .hero h1 em { font-style: italic; }
  .hero p { font-size: 9pt; line-height: 1.6; color: rgba(255,255,255,.86); margin-top: 3.5mm; max-width: 84mm; }

  .body { padding: 2mm 14mm 0; display: flex; flex-direction: column; flex: 1 1 auto; }
  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; }
  .duo > article + article { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .duo h2 { font-size: 13.5pt; letter-spacing: -0.014em; margin: 2.4mm 0 2.4mm; }
  .duo ul { margin-top: 1mm; }
  .duo li { font-size: 8.4pt; line-height: 1.42; padding-left: 4mm; position: relative; margin-bottom: 1.5mm; }
  .duo li::before { content: ""; position: absolute; left: 0; top: 1.6mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.3mm solid var(--teal); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 6.5mm;
             background: var(--tint-bg); padding: 5.5mm 7mm 5mm; }
  .figures .label { margin-bottom: 2.6mm; }
  .row { font-size: 8.2pt; line-height: 1.9; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: auto -14mm 0; background: var(--navy-deeper); color: var(--on-dark);
          padding: 5.5mm 14mm 7mm; display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 9.6pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    <section class="hero">
      <figure class="hero__photo"><img src="/images/natasha-mat-1400.webp" alt="Natasha in the Studham studio"></figure>
      <div class="hero__inner">
        ${wordmark()}
        <h1>Strong is built <em>slowly, precisely.</em></h1>
        <p>Sports Therapy and Clinical Pilates with ${BUSINESS.person}. ${BUSINESS.where}.</p>
      </div>
    </section>

    <div class="body">
      <section class="duo">
        <article>
          <span class="label">Sports Therapy</span>
          <h2>Assessment-led, hands-on care.</h2>
          <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
        </article>
        <article>
          <span class="label">Clinical Pilates</span>
          <h2>Teaching the body to support itself.</h2>
          <ul>${PILATES_FORMS.map((x) => `<li>${x}</li>`).join("")}</ul>
        </article>
      </section>

      ${figures()}

      <footer class="foot">
        <b>${contactLine()}</b>
        <span>${CREDENTIAL_LINE}</span>
      </footer>
    </div>
  </div>`,
};

/* ============================================================= 10 triptych
   Three tall panels across the top: treatment room, portrait, machine room —
   the practice in one row of pictures. */

const l10 = {
  slug: "poster-l10-triptych",
  label: "L10 Triptych",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .sheet { padding: 12mm 14mm 0; }
  .masthead { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 4.5mm; }
  .masthead__meta { text-align: right; font-size: 8pt; line-height: 1.55; color: var(--ink-soft); }
  .masthead__meta b { color: var(--ink); }

  .strip { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; height: 78mm; }
  .strip figure { overflow: hidden; position: relative; }
  .strip img { width: 100%; height: 100%; object-fit: cover; }
  .strip .mid img { object-position: 46% 22%; }
  .strip .left img { object-position: 40% 60%; }
  .strip .right img { object-position: 50% 62%; }
  .strip figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 8mm 3.5mm 2.6mm;
    background: linear-gradient(180deg, rgba(23,27,58,0), rgba(23,27,58,.78));
    color: var(--on-dark); font-size: 6.4pt; letter-spacing: .13em; text-transform: uppercase; font-weight: 600; }

  h1 { font-size: 23pt; line-height: 1.1; letter-spacing: -0.022em; color: var(--brand-strong); margin-top: 7mm; max-width: 160mm; }
  h1 em { font-style: italic; }
  .standfirst { font-size: 9.2pt; line-height: 1.6; color: var(--ink-soft); margin-top: 4mm; max-width: 150mm; }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; padding-top: 6mm; }
  .duo > div + div { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .duo h2 { font-size: 12.5pt; margin: 2.2mm 0 2mm; }
  .duo p { font-size: 8.4pt; line-height: 1.58; color: var(--ink-soft); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 6mm;
             padding-top: 5.5mm; border-top: 0.2mm solid var(--hairline); }
  .figures .label { color: var(--brand-light); margin-bottom: 2.6mm; }
  .row { font-size: 8.2pt; line-height: 1.9; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: auto -14mm 0; background: var(--navy-bg); color: var(--on-dark); padding: 5.5mm 14mm 7mm;
          display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 9.6pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    <header class="masthead">
      ${wordmark()}
      <p class="masthead__meta"><b>${BUSINESS.person}</b><br>${BUSINESS.role}</p>
    </header>

    <section class="strip">
      <figure class="left"><img src="/images/therapy/couch-window-1000.webp" alt="The treatment room"><figcaption>Sports Therapy</figcaption></figure>
      <figure class="mid"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland"><figcaption>${BUSINESS.person}</figcaption></figure>
      <figure class="right"><img src="/images/pilates/room-machines-1000.webp" alt="The Pilates studio"><figcaption>Clinical Pilates</figcaption></figure>
    </section>

    <h1>One therapist, one room, and a plan built around <em>you.</em></h1>
    <p class="standfirst">Assessment-led Sports Therapy and precise, clinical Pilates in ${BUSINESS.where}. Clients are aged eight to over eighty.</p>

    <section class="duo">
      <div>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led care.</h2>
        <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
      </div>
      <div>
        <span class="label">Clinical Pilates</span>
        <h2>Mat, Reformer, Stability Chair.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </div>
    </section>

    ${figures()}

    <footer class="foot">
      <b>${contactLine()}</b>
      <span>${CREDENTIAL_LINE}</span>
    </footer>
  </div>`,
};

/* ============================================================== 11 capsule
   The comp mirrored and softened: the photograph in a tall capsule on the
   left, type on the right, figures panel and navy bar as the comp has them. */

const l11 = {
  slug: "poster-l11-capsule",
  label: "L11 Capsule",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .hero { display: grid; grid-template-columns: 82mm 1fr; gap: 0 11mm; padding: 12mm 13mm 0; align-items: stretch; height: 148mm; }
  .capsule { border-radius: 41mm; overflow: hidden; position: relative; }
  .capsule img { width: 100%; height: 100%; object-fit: cover; object-position: 46% 30%; }
  .capsule::after { content: ""; position: absolute; inset: 0; border-radius: 41mm;
                    box-shadow: inset 0 0 0 0.35mm rgba(38,44,99,.14); }

  .hero__text { display: flex; flex-direction: column; padding-top: 2mm; }
  .wordmark { display: flex; align-items: center; gap: 3.6mm; }
  .wordmark__mark { width: 12.5mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 24pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; color: var(--brand); margin-top: 1.8mm; }
  .hero h1 { font-size: 23pt; line-height: 1.18; letter-spacing: -0.018em; color: var(--brand); margin-top: 9mm; }
  .hero__intro { font-size: 9.2pt; line-height: 1.6; color: var(--ink-soft); margin-top: 5mm; }
  .sig { font-family: "Parisienne", cursive; font-size: 18pt; color: var(--teal); margin-top: auto; }
  .hero__role { font-size: 6.8pt; letter-spacing: .09em; text-transform: uppercase; font-weight: 700; color: var(--brand); margin-top: 3.5mm; line-height: 1.75; }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 11mm; padding: 7.5mm 13mm 0; }
  .duo > article + article { padding-left: 11mm; border-left: 0.2mm solid var(--hairline); margin-left: -11mm; }
  .duo h2 { font-size: 12.5pt; line-height: 1.3; margin: 2.6mm 0 2.6mm; }
  .duo p { font-size: 8.4pt; line-height: 1.55; color: var(--ink-soft); }

  .figures { margin: auto 12mm 4mm; padding: 5mm 9mm 4mm; background: var(--tint-bg);
             display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 0 12mm; }
  .figures .label { font-size: 7.3pt; margin-bottom: 3mm; }
  .row { font-size: 8.2pt; line-height: 2; }
  .tt__row { padding: 0.5mm 0; }
  .tt__row + .tt__row { border-top: none; }
  .tt__day { flex: 0 0 16mm; font-size: 8.2pt; }
  .tt__times { font-size: 8.2pt; color: var(--ink-soft); }
  .tt__times small { color: var(--teal); font-weight: 600; }

  .bar { background: var(--navy-deeper); color: #fff; padding: 5mm 12mm 6.5mm; text-align: center; }
  .bar b { font-size: 9.4pt; font-weight: 500; }
  .bar p { font-size: 6.5pt; color: rgba(255,255,255,.6); margin-top: 2.6mm; }
  `,
  html: `<div class="sheet">
    <section class="hero">
      <figure class="capsule"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio"></figure>
      <div class="hero__text">
        ${wordmark()}
        <h1>Hands-on treatment and precise movement, from one private studio.</h1>
        <p class="hero__intro">Sports Therapy is not only for athletes, and Pilates is not only for the already-strong. Clients at NJH are aged eight to over eighty.</p>
        <p class="sig">${BUSINESS.person}</p>
        <p class="hero__role">${BUSINESS.role}<br>${BUSINESS.where}</p>
      </div>
    </section>

    <section class="duo">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </article>
    </section>

    ${figures()}

    <footer class="bar">
      <b>${contactLine()}</b>
      <p>${CREDENTIAL_LINE}</p>
    </footer>
  </div>`,
};

/* ============================================================ 12 classical
   Cream paper, centred small caps, double rules, no photograph: the sheet as
   a pharmacy label or a concert bill. */

const l12 = {
  slug: "poster-l12-classical",
  label: "L12 Classical",
  css: `
  ${SITE}
  ${leaders}
  .sheet { background: oklch(97.8% 0.008 90); padding: 15mm 24mm 0; text-align: center; }
  .rule2 { height: 1.3mm; border-top: 0.5mm solid var(--brand-strong); border-bottom: 0.2mm solid var(--brand-strong); }
  .mark { width: 14mm; height: auto; margin: 7mm auto 0; }
  .name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 27pt; color: var(--brand-strong); margin-top: 3.5mm; letter-spacing: .02em; }
  .descriptor { font-size: 8pt; letter-spacing: .34em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 2.6mm; }
  .est { font-size: 7.4pt; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); margin-top: 5mm; }

  h1 { font-size: 15.5pt; line-height: 1.4; letter-spacing: .005em; font-style: italic; color: var(--ink); margin: 6.5mm auto 0; max-width: 128mm; }

  .division { display: flex; align-items: center; gap: 4mm; margin: 7mm 0 4.5mm; }
  .division::before, .division::after { content: ""; flex: 1 1 auto; border-top: 0.2mm solid var(--hairline); }
  .division span { font-size: 7.8pt; letter-spacing: .3em; text-transform: uppercase; font-weight: 600; color: var(--brand); }

  .list { max-width: 122mm; margin: 0 auto; text-align: left; }
  .row { font-size: 9.4pt; line-height: 2.05; font-family: "STIX Two Text", serif; }
  .row__fee { font-family: "Hanken Grotesk Variable", sans-serif; font-size: 8.8pt; }
  .concerns { font-size: 8.2pt; line-height: 1.7; color: var(--ink-soft); max-width: 128mm; margin: 2mm auto 0; }

  .times { max-width: 122mm; margin: 0 auto; text-align: center; font-family: "STIX Two Text", serif; font-size: 9.6pt; line-height: 2; }
  .times b { font-weight: 600; }
  .times small { font-size: 7.4pt; color: var(--ink-soft); }

  .sign { margin-top: auto; padding-bottom: 9mm; }
  .sign .rule2 { margin-bottom: 5.5mm; }
  .sign b { font-family: "STIX Two Text", serif; font-weight: 400; font-size: 13pt; color: var(--brand-strong); letter-spacing: .01em; }
  .sign p { font-size: 7.8pt; color: var(--ink-soft); margin-top: 2.2mm; letter-spacing: .04em; }
  .sign .who { font-size: 7.2pt; letter-spacing: .22em; text-transform: uppercase; font-weight: 600; color: var(--brand); margin-top: 4.5mm; }
  `,
  html: `<div class="sheet">
    <div class="rule2"></div>
    <img class="mark" src="/images/njh-mark.svg" alt="">
    <p class="name">NJH</p>
    <p class="descriptor">Sports Therapy &amp; Pilates</p>
    <p class="est">${BUSINESS.where} &middot; established 2016</p>

    <h1>Hands-on treatment and precise, clinical movement, for clients aged eight to over eighty.</h1>

    <div class="division"><span>Sports Therapy</span></div>
    <div class="list">${rows(PRICES_THERAPY)}</div>
    <p class="concerns">${THERAPY_CONCERNS.join(" &middot; ").toLowerCase()}</p>

    <div class="division"><span>Clinical Pilates</span></div>
    <div class="list">${rows(PRICES_PILATES)}</div>
    <p class="concerns">${PILATES_FORMS.join(" &middot; ").toLowerCase()}</p>

    <div class="division"><span>Weekly classes</span></div>
    <p class="times">${TIMETABLE.map(([d, t]) => `<b>${d}</b> &nbsp;${t.join(" &nbsp; ")}`).join(" &nbsp;&nbsp;&bull;&nbsp;&nbsp; ")}</p>

    <footer class="sign">
      <div class="rule2"></div>
      <b>${BUSINESS.phone} &middot; ${BUSINESS.web}</b>
      <p>${BUSINESS.email}</p>
      <p class="who">${BUSINESS.person} &middot; ${BUSINESS.role}</p>
    </footer>
  </div>`,
};

/* =========================================================== 13 night rail
   The clinic rail turned dark: a navy sidebar on the right holding all the
   practical matter, content on white to its left. */

const l13 = {
  slug: "poster-l13-night-rail",
  label: "L13 Night rail",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .sheet { flex-direction: row; }
  .main { flex: 1 1 auto; padding: 13mm 12mm 0 14mm; display: flex; flex-direction: column; }
  .main h1 { font-size: 24pt; line-height: 1.1; letter-spacing: -0.024em; color: var(--brand-strong); margin-top: 10mm; }
  .main h1 em { font-style: italic; }
  .main__lede { font-size: 9.2pt; line-height: 1.62; color: var(--ink-soft); margin-top: 5mm; }

  .photo { margin: 6mm -12mm 0 -14mm; flex: 1 1 auto; min-height: 50mm; overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 58%; }

  .entry { padding: 5.5mm 0; border-top: 0.2mm solid var(--hairline); }
  .entry:first-of-type { margin-top: 8mm; border-top: 0.35mm solid var(--brand-strong); }
  .entry h2 { font-size: 13pt; letter-spacing: -0.012em; margin: 2mm 0 2.2mm; }
  .entry p { font-size: 8.4pt; line-height: 1.58; color: var(--ink-soft); }

  .rail { flex: 0 0 66mm; background: var(--navy-bg); color: var(--on-dark); padding: 13mm 9mm 0; display: flex; flex-direction: column; }
  .rail .wordmark__name { color: #fff; }
  .rail .wordmark__descriptor { color: var(--periwinkle); }
  .rail .wordmark__mark { filter: brightness(0) invert(1); }
  .rail .label { color: var(--periwinkle); font-size: 6.8pt; letter-spacing: .16em; margin-bottom: 3mm; }
  .rail__block { padding: 6mm 0; border-top: 0.2mm solid rgba(255,255,255,.16); }
  .rail__block:first-of-type { border-top: 0; margin-top: 6mm; }
  .rail__lines b { display: block; font-weight: 600; font-size: 11pt; color: #fff; margin-bottom: 1.2mm; }
  .rail__lines span { display: block; color: var(--on-dark-soft); font-size: 8.2pt; line-height: 1.6; }
  .rail__note { font-size: 7.2pt; line-height: 1.5; color: var(--on-dark-quiet); margin-top: 2.6mm; }
  .row { font-size: 8.2pt; line-height: 1.9; color: var(--on-dark-soft); }
  .row__lead { border-bottom-color: rgba(255,255,255,.2); }
  .row__fee { color: #fff; }
  .tt__row + .tt__row { border-top-color: rgba(255,255,255,.12); }
  .tt__day { color: #fff; font-size: 8.2pt; flex: 0 0 15mm; }
  .tt__times { color: var(--on-dark-soft); font-size: 8.2pt; }
  .tt__times small { color: var(--periwinkle); }
  .rail__foot { margin-top: auto; padding: 5mm 0 8mm; border-top: 0.2mm solid rgba(255,255,255,.16);
                font-size: 6.4rem; }
  .rail__foot p { font-size: 6.6pt; line-height: 1.55; color: var(--on-dark-quiet); }
  `,
  html: `<div class="sheet">
    <div class="main">
      ${wordmark()}
      <h1>Two disciplines, <em>one quiet room.</em></h1>
      <p class="main__lede">Sports Therapy is not only for athletes and Pilates is not only for the already-strong. Clients here are aged eight to over eighty, and every plan starts by listening.</p>

      <section class="entry">
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
      </section>

      <section class="entry">
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </section>

      <figure class="photo"><img src="/images/pilates/room-machines-1536.webp" alt="The NJH studio"></figure>
    </div>

    <aside class="rail">
      ${wordmark()}
      <div class="rail__block">
        <span class="label">Enquiries</span>
        <p class="rail__lines"><b>${BUSINESS.phone}</b><span>${BUSINESS.email}</span><span>${BUSINESS.web}</span></p>
      </div>
      <div class="rail__block">
        <span class="label">Sports Therapy</span>
        ${rows(PRICES_THERAPY)}
      </div>
      <div class="rail__block">
        <span class="label">Pilates</span>
        ${rows(PRICES_PILATES)}
      </div>
      <div class="rail__block">
        <span class="label">Weekly classes</span>
        ${tt()}
        <p class="rail__note">55 minutes unless noted. One-to-one appointments Monday to Friday.</p>
      </div>
      <div class="rail__foot">
        <p>${BUSINESS.person} &middot; ${BUSINESS.role}. ${BUSINESS.where}; directions are sent when your appointment is confirmed.</p>
      </div>
    </aside>
  </div>`,
};

/* ======================================================= 14 timetable hero
   For the school-hall noticeboard: the class timetable is the headline, set
   enormous in the middle of the page. */

const l14 = {
  slug: "poster-l14-timetable-hero",
  label: "L14 Timetable hero",
  css: `
  ${SITE}
  ${leaders}
  ${WORDMARK_CSS}
  .sheet { padding: 13mm 16mm 0; }
  .masthead { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 4mm; border-bottom: 0.35mm solid var(--brand-strong); }
  .masthead__meta { text-align: right; font-size: 8pt; line-height: 1.55; color: var(--ink-soft); }
  .masthead__meta b { color: var(--ink); }

  .kicker { text-align: center; margin-top: 9mm; }
  .kicker .label { font-size: 8pt; letter-spacing: .24em; color: var(--brand); }
  h1 { text-align: center; font-size: 27pt; line-height: 1.1; letter-spacing: -0.024em; color: var(--brand-strong); margin-top: 3mm; }
  h1 em { font-style: italic; }

  .grid { margin-top: 8mm; }
  .day { display: grid; grid-template-columns: 42mm 1fr auto; align-items: baseline; gap: 6mm;
         padding: 5.5mm 2mm; border-top: 0.2mm solid var(--hairline); }
  .day:last-of-type { border-bottom: 0.2mm solid var(--hairline); }
  .day__name { font-family: "STIX Two Text", serif; font-size: 19pt; color: var(--brand-strong); }
  .day__times { font-size: 13pt; font-variant-numeric: tabular-nums; color: var(--ink); display: flex; gap: 8mm; flex-wrap: wrap; }
  .day__times small { font-size: 8pt; color: var(--brand-light); align-self: center; }
  .day__fee { font-size: 9.6pt; color: var(--ink-soft); }
  .day__fee b { color: var(--brand-strong); }

  .smallprint { text-align: center; font-size: 8.4pt; line-height: 1.6; color: var(--ink-soft); margin-top: 5.5mm; }

  .also { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; margin-top: 8mm;
          padding: 6mm 0 0; border-top: 0.2mm solid var(--hairline); }
  .also > div + div { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .also h2 { font-size: 12pt; margin: 2mm 0 2mm; }
  .also p { font-size: 8.2pt; line-height: 1.55; color: var(--ink-soft); }
  .also .row { font-size: 8.4pt; line-height: 1.9; max-width: 64mm; }
  .also .row__fee { color: var(--brand-strong); }

  .foot { margin: auto -16mm 0; background: var(--navy-bg); color: var(--on-dark); padding: 6mm 16mm 7.5mm; text-align: center; }
  .foot b { font-size: 11pt; font-weight: 500; }
  .foot p { font-size: 7.6pt; color: var(--on-dark-soft); margin-top: 2.2mm; }
  `,
  html: `<div class="sheet">
    <header class="masthead">
      ${wordmark()}
      <p class="masthead__meta"><b>${BUSINESS.person}</b><br>${BUSINESS.role}<br>${BUSINESS.where}</p>
    </header>

    <div class="kicker"><span class="label">Small-group Pilates &middot; £22 a class</span></div>
    <h1>The weekly <em>timetable.</em></h1>

    <section class="grid">
      ${TIMETABLE.map(
        ([day, times]) =>
          `<div class="day">
            <span class="day__name">${day}</span>
            <span class="day__times">${times.join(" ")}</span>
            <span class="day__fee"><b>£22</b> a class</span>
          </div>`,
      ).join("")}
    </section>
    <p class="smallprint">Sessions are 55 minutes unless noted. Class sizes are small, so posture and movement get close attention.<br>An initial one-to-one assessment (£85, including postural analysis) is required before joining a group.</p>

    <section class="also">
      <div>
        <span class="label">Also at NJH</span>
        <h2>Sports Therapy.</h2>
        <p>Assessment-led, hands-on treatment for musculoskeletal pain, tension and restricted movement.</p>
        ${rows(PRICES_THERAPY)}
      </div>
      <div>
        <span class="label">One-to-one Pilates</span>
        <h2>Individual &amp; duet.</h2>
        <p>${PILATES_FORMS.slice(1).join(" &middot; ")}</p>
        ${rows(PRICES_PILATES.slice(1))}
      </div>
    </section>

    <footer class="foot">
      <b>${contactLine()}</b>
      <p>Places are limited; please confirm availability before attending.</p>
    </footer>
  </div>`,
};

export const LAB_B = [l08, l09, l10, l11, l12, l13, l14];

/* ================================================================ 15 rings
   The site's drifting rings as the organising device: one ring holds the
   portrait, hairline echoes drift across the page. */

const l15 = {
  slug: "poster-l15-rings",
  label: "L15 Rings",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .sheet { padding: 13mm 15mm 0; }
  .sheet::before { content: ""; position: absolute; left: -30mm; top: 40mm; width: 90mm; height: 90mm;
                   border-radius: 50%; border: 0.25mm solid oklch(41.9% 0.117 275 / .12); }
  .sheet::after { content: ""; position: absolute; right: -24mm; bottom: 52mm; width: 74mm; height: 74mm;
                  border-radius: 50%; border: 0.25mm solid oklch(41.9% 0.117 275 / .10); }

  .hero { display: grid; grid-template-columns: 1fr 74mm; gap: 0 10mm; align-items: center; padding: 8mm 0 8mm; position: relative; }
  .hero h1 { font-size: 26pt; line-height: 1.1; letter-spacing: -0.024em; color: var(--brand-strong); }
  .hero h1 em { font-style: italic; }
  .hero p { font-size: 9.4pt; line-height: 1.62; color: var(--ink-soft); margin-top: 5mm; max-width: 88mm; }
  .hero__who { font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 5mm; line-height: 1.8; }
  .ring { position: relative; width: 74mm; height: 74mm; }
  .ring img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: 46% 24%; }
  .ring::before { content: ""; position: absolute; inset: -3.6mm; border-radius: 50%; border: 0.3mm solid oklch(41.9% 0.117 275 / .35); }
  .ring::after { content: ""; position: absolute; inset: -8mm; border-radius: 50%; border: 0.25mm solid oklch(41.9% 0.117 275 / .15); }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; padding: 6mm 0 0; position: relative; }
  .duo > article + article { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .duo h2 { font-size: 13.5pt; letter-spacing: -0.014em; margin: 2.4mm 0 2.4mm; }
  .duo ul { margin-top: 1.5mm; }
  .duo li { font-size: 8.4pt; line-height: 1.42; padding-left: 4mm; position: relative; margin-bottom: 1.5mm; }
  .duo li::before { content: ""; position: absolute; left: 0; top: 1.6mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.3mm solid var(--brand-light); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 6.5mm;
             padding: 6mm 8mm; background: var(--tint-bg); border-radius: 3mm; position: relative; }
  .figures .label { color: var(--brand-light); margin-bottom: 2.6mm; }
  .row { font-size: 8.2pt; line-height: 1.9; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: auto -15mm 0; background: var(--navy-bg); color: var(--on-dark); padding: 5.5mm 15mm 7mm;
          display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 9.6pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    ${wordmark()}
    <section class="hero">
      <div>
        <h1>Support is a skill. <em>Your body can learn it.</em></h1>
        <p>Assessment-led Sports Therapy and precise, clinical Pilates from one private studio in ${BUSINESS.where}.</p>
        <p class="hero__who">${BUSINESS.person} &middot; ${BUSINESS.role}</p>
      </div>
      <figure class="ring"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland"></figure>
    </section>

    <section class="duo">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <ul>${PILATES_FORMS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
    </section>

    ${figures()}

    <footer class="foot">
      <b>${contactLine()}</b>
      <span>${CREDENTIAL_LINE}</span>
    </footer>
  </div>`,
};

/* ================================================================ 16 bands
   Full-width horizontal bands, each one section: white masthead, photographic
   band, white services, tinted figures, navy close. The page reads top to
   bottom like the site does. */

const l16 = {
  slug: "poster-l16-bands",
  label: "L16 Bands",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .masthead { display: flex; justify-content: space-between; align-items: center; padding: 10mm 15mm; }
  .masthead__meta { text-align: right; font-size: 7.8pt; line-height: 1.55; color: var(--ink-soft); }
  .masthead__meta b { color: var(--ink); }

  .band { position: relative; height: 64mm; overflow: hidden; }
  .band img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; }
  .band__caption { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;
                   padding: 0 15mm; background: linear-gradient(90deg, rgba(23,27,58,.72) 0%, rgba(23,27,58,.28) 55%, rgba(23,27,58,0) 80%); }
  .band__caption h1 { font-size: 24pt; line-height: 1.12; letter-spacing: -0.02em; color: #fff; max-width: 108mm; }
  .band__caption h1 em { font-style: italic; color: var(--periwinkle); }
  .band__caption p { font-size: 8.8pt; color: rgba(255,255,255,.85); margin-top: 3mm; max-width: 96mm; line-height: 1.55; }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; padding: 8mm 15mm; }
  .duo > article + article { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .duo h2 { font-size: 13.5pt; letter-spacing: -0.014em; margin: 2.4mm 0 2.4mm; }
  .duo ul { margin-top: 1.5mm; columns: 1; }
  .duo li { font-size: 8.4pt; line-height: 1.42; padding-left: 4mm; position: relative; margin-bottom: 1.5mm; }
  .duo li::before { content: ""; position: absolute; left: 0; top: 1.6mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.3mm solid var(--brand-light); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; padding: 7mm 15mm; background: var(--tint-bg); }
  .figures .label { color: var(--brand-light); margin-bottom: 2.8mm; }
  .row { font-size: 8.4pt; line-height: 1.95; }
  .row__fee { color: var(--brand-strong); }

  .close { margin-top: auto; background: var(--navy-bg); color: var(--on-dark); padding: 7mm 15mm 8mm;
           display: flex; justify-content: space-between; align-items: center; gap: 8mm; }
  .close h2 { font-size: 13pt; line-height: 1.3; letter-spacing: -0.01em; max-width: 74mm; }
  .close .cta { text-align: right; }
  .close .cta b { display: block; font-size: 12.5pt; font-weight: 500; }
  .close .cta span { font-size: 8pt; color: var(--on-dark-soft); line-height: 1.6; }
  `,
  html: `<div class="sheet">
    <header class="masthead">
      ${wordmark()}
      <p class="masthead__meta"><b>${BUSINESS.person}</b> &middot; ${BUSINESS.role}<br>${BUSINESS.where} &middot; est. 2016</p>
    </header>

    <section class="band">
      <img src="/images/pilates/room-machines-1536.webp" alt="The NJH studio">
      <div class="band__caption">
        <h1>Hands-on treatment and <em>precise movement.</em></h1>
        <p>Sports Therapy and Clinical Pilates from one private studio. Ages eight to over eighty.</p>
      </div>
    </section>

    <section class="duo">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <ul>${PILATES_FORMS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
    </section>

    ${figures()}

    <footer class="close">
      <h2>Not sure where to start? Describe it in your own words.</h2>
      <div class="cta">
        <b>${BUSINESS.phone}</b>
        <span>${BUSINESS.email}<br>${BUSINESS.web}</span>
      </div>
    </footer>
  </div>`,
};

/* ============================================================= 17 teal head
   A flat teal masthead block owning the top third, the wordmark and headline
   knocked out of it; the body stays quiet below. */

const l17 = {
  slug: "poster-l17-teal-head",
  label: "L17 Teal head",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .head { background: var(--teal); color: #fff; padding: 13mm 15mm 10mm; }
  .wordmark { display: flex; align-items: center; gap: 3.6mm; }
  .wordmark__mark { width: 12.5mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: #fff; }
  .wordmark__descriptor { font-size: 7pt; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.88); margin-top: 1.6mm; }
  .head h1 { font-size: 29pt; line-height: 1.1; letter-spacing: -0.024em; margin-top: 9mm; max-width: 158mm; }
  .head h1 em { font-style: italic; color: var(--navy-deeper); }
  .head p { font-size: 9.6pt; line-height: 1.6; color: rgba(255,255,255,.92); margin-top: 4.5mm; max-width: 132mm; }

  .body { padding: 9mm 15mm 0; display: flex; flex-direction: column; flex: 1 1 auto; }
  .duo { display: grid; grid-template-columns: 1fr 58mm; gap: 0 11mm; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 11mm; }
  .cols > article + article { padding-left: 11mm; border-left: 0.2mm solid var(--hairline); margin-left: -11mm; }
  .cols h2 { font-size: 13pt; letter-spacing: -0.014em; margin: 2.4mm 0 2.4mm; }
  .cols ul { margin-top: 1.5mm; }
  .cols li { font-size: 8.3pt; line-height: 1.42; padding-left: 4mm; position: relative; margin-bottom: 1.5mm; }
  .cols li::before { content: ""; position: absolute; left: 0; top: 1.55mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.3mm solid var(--teal); }
  .photo { height: 100%; min-height: 74mm; overflow: hidden; border-radius: 2.5mm; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 46% 26%; }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 7mm;
             padding: 6mm 8mm; background: var(--tint-bg); }
  .figures .label { margin-bottom: 2.8mm; }
  .row { font-size: 8.3pt; line-height: 1.95; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: auto -15mm 0; background: var(--navy-deeper); color: var(--on-dark); padding: 5.5mm 15mm 7mm;
          display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 9.6pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    <header class="head">
      ${wordmark()}
      <h1>Stronger, freer, <em>steadier.</em></h1>
      <p>Sports Therapy and Clinical Pilates with ${BUSINESS.person}, from one private studio in ${BUSINESS.where}. Clients are aged eight to over eighty.</p>
    </header>

    <div class="body">
      <section class="duo">
        <div class="cols">
          <article>
            <span class="label">Sports Therapy</span>
            <h2>Assessment-led care.</h2>
            <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
          </article>
          <article>
            <span class="label">Clinical Pilates</span>
            <h2>Precise movement.</h2>
            <ul>${PILATES_FORMS.map((x) => `<li>${x}</li>`).join("")}</ul>
          </article>
        </div>
        <figure class="photo"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland"></figure>
      </section>

      ${figures()}

      <footer class="foot">
        <b>${contactLine()}</b>
        <span>${CREDENTIAL_LINE}</span>
      </footer>
    </div>
  </div>`,
};

/* ============================================================== 18 gallery
   A film-strip of five square frames from the studio down the left edge, the
   content set beside it like a catalogue page. */

const l18 = {
  slug: "poster-l18-gallery",
  label: "L18 Gallery",
  css: `
  ${SITE}
  ${leaders}
  ${TT_CSS}
  ${WORDMARK_CSS}
  .sheet { flex-direction: row; }
  .strip { flex: 0 0 52mm; display: flex; flex-direction: column; gap: 2.5mm; padding: 0; }
  .strip figure { flex: 1 1 0; overflow: hidden; }
  .strip img { width: 100%; height: 100%; object-fit: cover; }

  .main { flex: 1 1 auto; padding: 13mm 14mm 0 11mm; display: flex; flex-direction: column; }
  .main h1 { font-size: 22pt; line-height: 1.12; letter-spacing: -0.02em; color: var(--brand-strong); margin-top: 8mm; }
  .main h1 em { font-style: italic; }
  .main__lede { font-size: 8.8pt; line-height: 1.6; color: var(--ink-soft); margin-top: 4mm; }

  .entry { padding: 5mm 0; border-top: 0.2mm solid var(--hairline); }
  .entry:first-of-type { margin-top: 6mm; border-top: 0.35mm solid var(--brand-strong); }
  .entry h2 { font-size: 12.5pt; letter-spacing: -0.012em; margin: 1.8mm 0 2mm; }
  .entry p { font-size: 8.3pt; line-height: 1.55; color: var(--ink-soft); }
  .fees { display: grid; grid-template-columns: 1fr 1fr; gap: 0 8mm; margin-top: 3mm; }
  .fees .label { font-size: 6.7pt; letter-spacing: .14em; color: var(--brand-light); margin-bottom: 2mm; }
  .row { font-size: 8.1pt; line-height: 1.8; }
  .row__fee { color: var(--brand-strong); }
  .entry .tt__day { flex: 0 0 15mm; font-size: 8.1pt; }
  .entry .tt__times { font-size: 8.1pt; color: var(--ink-soft); }
  .entry .tt__times small { color: var(--brand-light); }

  .close { margin: auto -14mm 0 -11mm; background: var(--navy-bg); color: var(--on-dark); padding: 5.5mm 14mm 7mm 11mm; }
  .close b { display: block; font-size: 10.5pt; font-weight: 500; margin-bottom: 1.4mm; }
  .close span { font-size: 7.8pt; color: var(--on-dark-soft); display: block; line-height: 1.6; }
  `,
  html: `<div class="sheet">
    <aside class="strip">
      <figure><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland" style="object-position: 46% 20%"></figure>
      <figure><img src="/images/therapy/couch-window-500.webp" alt="The treatment room"></figure>
      <figure><img src="/images/pilates/reformer-room-500.webp" alt="The Reformer"></figure>
      <figure><img src="/images/pilates/chair-guided-500.webp" alt="A guided Stability Chair session"></figure>
      <figure><img src="/images/pilates/studio-dusk-500.webp" alt="The studio at dusk"></figure>
    </aside>

    <div class="main">
      ${wordmark()}
      <h1>Everything NJH does, on <em>one page.</em></h1>
      <p class="main__lede">Sports Therapy and Clinical Pilates with ${BUSINESS.person}, ${BUSINESS.role.toLowerCase()}. ${BUSINESS.where}.</p>

      <section class="entry">
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
      </section>

      <section class="entry">
        <span class="label">Clinical Pilates</span>
        <h2>Mat, Reformer, Stability Chair.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </section>

      <section class="entry">
        <span class="label">Prices</span>
        <div class="fees">
          <div><span class="label">Sports Therapy</span>${rows(PRICES_THERAPY)}</div>
          <div><span class="label">Pilates</span>${rows(PRICES_PILATES)}</div>
        </div>
      </section>

      <section class="entry">
        <span class="label">Weekly small-group classes</span>
        <div style="margin-top: 2.5mm">${tt()}</div>
      </section>

      <footer class="close">
        <b>${BUSINESS.phone}</b>
        <span>${BUSINESS.email} &middot; ${BUSINESS.web}</span>
      </footer>
    </div>
  </div>`,
};

/* ================================================================ 19 stats
   Led by the numbers: four big figures the practice can stand behind, then
   the detail small underneath. */

const l19 = {
  slug: "poster-l19-stats",
  label: "L19 Stats",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .sheet { padding: 13mm 15mm 0; }
  .masthead { display: flex; justify-content: space-between; align-items: flex-end; }
  .wordmark { display: flex; align-items: center; gap: 3.6mm; }
  .wordmark__mark { width: 13mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; color: var(--brand); margin-top: 1.6mm; }
  .masthead__meta { text-align: right; font-size: 7.8pt; line-height: 1.55; color: var(--ink-soft); }
  .masthead__meta b { color: var(--ink); }

  h1 { font-size: 25pt; line-height: 1.12; letter-spacing: -0.02em; color: var(--brand-strong); margin-top: 9mm; max-width: 150mm; }
  h1 em { font-style: italic; }

  .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3.5mm; margin-top: 7mm; }
  .tile { background: var(--tint-bg); padding: 5.5mm 5mm 5mm; }
  .tile b { display: block; font-family: "STIX Two Text", serif; font-weight: 400; font-size: 23pt; color: var(--brand-strong); letter-spacing: -0.01em; }
  .tile b small { font-size: 11pt; }
  .tile span { display: block; font-size: 7.2pt; line-height: 1.5; color: var(--ink-soft); margin-top: 1.8mm; }
  .tile--teal { background: var(--teal); }
  .tile--teal b, .tile--teal span { color: #fff; }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; padding: 7.5mm 0 0; }
  .duo > article + article { padding-left: 12mm; border-left: 0.2mm solid var(--hairline); margin-left: -12mm; }
  .duo h2 { font-size: 13pt; letter-spacing: -0.014em; margin: 2.4mm 0 2.4mm; }
  .duo ul { margin-top: 1.5mm; }
  .duo li { font-size: 8.3pt; line-height: 1.42; padding-left: 4mm; position: relative; margin-bottom: 1.4mm; }
  .duo li::before { content: ""; position: absolute; left: 0; top: 1.55mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.3mm solid var(--teal); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 6.5mm;
             padding-top: 5.5mm; border-top: 0.2mm solid var(--hairline); }
  .figures .label { margin-bottom: 2.8mm; }
  .row { font-size: 8.3pt; line-height: 1.9; }
  .row__fee { color: var(--brand-strong); }

  .foot { margin: auto -15mm 0; background: var(--navy-deeper); color: var(--on-dark); padding: 5.5mm 15mm 7mm;
          display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }
  .foot b { font-size: 9.6pt; font-weight: 500; white-space: nowrap; }
  .foot span { font-size: 6.6pt; color: var(--on-dark-quiet); text-align: right; line-height: 1.5; }
  `,
  html: `<div class="sheet">
    <header class="masthead">
      ${wordmark()}
      <p class="masthead__meta"><b>${BUSINESS.person}</b><br>${BUSINESS.role}<br>${BUSINESS.where}</p>
    </header>

    <h1>One private studio. <em>Every kind of stronger.</em></h1>

    <section class="tiles">
      <div class="tile"><b>2016</b><span>The year the Studham studio opened its doors.</span></div>
      <div class="tile"><b>8&ndash;80<small>+</small></b><span>The ages NJH treats and trains, week in, week out.</span></div>
      <div class="tile--teal tile"><b>&pound;22</b><span>A small-group Pilates class, 55 minutes.</span></div>
      <div class="tile"><b>1:1</b><span>Every plan starts with an individual assessment.</span></div>
    </section>

    <section class="duo">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <ul>${THERAPY_CONCERNS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <ul>${PILATES_FORMS.map((x) => `<li>${x}</li>`).join("")}</ul>
      </article>
    </section>

    ${figures()}

    <footer class="foot">
      <b>${contactLine()}</b>
      <span>${CREDENTIAL_LINE}</span>
    </footer>
  </div>`,
};

/* ============================================================== 20 minimal
   As little as the brief allows: one small photograph, one claim, the facts
   in fine type, and a great deal of air. */

const l20 = {
  slug: "poster-l20-minimal",
  label: "L20 Minimal",
  css: `
  ${SITE}
  ${leaders}
  .sheet { padding: 20mm 30mm 0; text-align: center; }
  .mark { width: 11mm; height: auto; margin: 0 auto; }
  .name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 15pt; color: var(--brand-strong); margin-top: 3mm; letter-spacing: .06em; }
  .descriptor { font-size: 6.6pt; letter-spacing: .34em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 2mm; }

  h1 { font-size: 25pt; line-height: 1.22; letter-spacing: -0.02em; color: var(--brand-strong); margin-top: 15mm; }
  h1 em { font-style: italic; }

  .photo { width: 58mm; height: 58mm; margin: 11mm auto 0; border-radius: 50%; overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 46% 24%; }
  .who { font-size: 7pt; letter-spacing: .22em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 5mm; line-height: 2; }

  .facts { margin-top: 11mm; font-size: 8.8pt; line-height: 2.1; color: var(--ink-soft); }
  .facts b { color: var(--ink); font-weight: 600; }
  .facts .fee { color: var(--brand-strong); font-weight: 600; font-variant-numeric: tabular-nums; }

  .sign { margin-top: auto; padding-bottom: 13mm; }
  .sign::before { content: ""; display: block; width: 16mm; margin: 0 auto 5mm; border-top: 0.3mm solid var(--brand-strong); }
  .sign b { font-family: "STIX Two Text", serif; font-weight: 400; font-size: 13pt; color: var(--brand-strong); }
  .sign p { font-size: 7.8pt; color: var(--ink-soft); margin-top: 2mm; letter-spacing: .03em; }
  `,
  html: `<div class="sheet">
    <img class="mark" src="/images/njh-mark.svg" alt="">
    <p class="name">NJH</p>
    <p class="descriptor">Sports Therapy &amp; Pilates</p>

    <h1>Hands-on treatment.<br><em>Precise movement.</em><br>One private studio.</h1>

    <figure class="photo"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland"></figure>
    <p class="who">${BUSINESS.person}<br>${BUSINESS.role}</p>

    <p class="facts">
      Sports Therapy from <span class="fee">£60</span> &middot; one hour <span class="fee">£85</span> &middot; ninety minutes <span class="fee">£130</span><br>
      Small-group Pilates <span class="fee">£22</span> &middot; one-to-one <span class="fee">£85</span> &middot; duet <span class="fee">£95</span><br>
      Classes: <b>Monday</b> 6.30pm &middot; <b>Tuesday</b> 8.30am, 9.20am, 11.30am &middot; <b>Friday</b> 7.30am, 9.30am
    </p>

    <footer class="sign">
      <b>${BUSINESS.phone} &middot; ${BUSINESS.web}</b>
      <p>${BUSINESS.email} &middot; ${BUSINESS.where}</p>
    </footer>
  </div>`,
};

/* ========================================================= 21 full portrait
   Natasha as the entire page: the portrait runs to all four trims, and every
   word sits on it. Scrims top and bottom keep the type legible while the
   middle of the photograph stays untouched.

   The source is 1011px wide, which is about 110dpi once cropped to A4. Fine
   on screen and at reading distance on a wall; a reprint from the original
   file would be worth it if this direction is chosen. */

const l21 = {
  slug: "poster-l21-full-portrait",
  label: "L21 Full portrait",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .sheet { background: var(--navy-deeper); }
  .cover { position: absolute; inset: 0; }
  .cover img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; }
  .cover::after { content: ""; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(21,27,63,.42) 0%, rgba(21,27,63,0) 18%, rgba(21,27,63,0) 38%, rgba(21,27,63,.62) 55%, rgba(21,27,63,.93) 72%, rgba(21,27,63,.98) 100%); }

  .top { position: relative; display: flex; align-items: flex-start; justify-content: space-between; padding: 12mm 14mm 0; }
  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 12.5mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: #fff; }
  .wordmark__descriptor { font-size: 6.8pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.9); margin-top: 1.5mm; }
  .top__where { font-size: 7.4pt; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.9); text-align: right; line-height: 1.7; }

  .foot { position: relative; margin-top: auto; padding: 0 14mm 8mm; color: var(--on-dark); }
  .sig { font-family: "Parisienne", cursive; font-size: 20pt; color: #fff; text-shadow: 0 0 3mm rgba(21,27,63,.55); }
  .foot h1 { font-size: 26pt; line-height: 1.12; letter-spacing: -0.02em; color: #fff; max-width: 148mm; margin-top: 2mm; }
  .foot h1 em { font-style: italic; color: var(--periwinkle); }
  .foot__intro { font-size: 9.4pt; line-height: 1.6; color: var(--on-dark-soft); margin-top: 3.6mm; max-width: 126mm; }

  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10mm; margin-top: 6mm;
         padding-top: 5mm; border-top: 0.25mm solid rgba(255,255,255,.24); }
  .duo h2 { font-size: 11.5pt; color: #fff; margin: 1.8mm 0 1.6mm; }
  .duo p { font-size: 7.9pt; line-height: 1.55; color: var(--on-dark-soft); }
  .label { color: var(--teal); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0 9mm; margin-top: 5.5mm;
             padding-top: 5mm; border-top: 0.25mm solid rgba(255,255,255,.24); }
  .figures .label { margin-bottom: 2.4mm; }
  .row { font-size: 8pt; line-height: 1.8; color: var(--on-dark-soft); }
  .row__lead { border-bottom-color: rgba(255,255,255,.2); }
  .row__fee { color: #fff; }
  .tt__row { padding: 1mm 0; }
  .tt__row + .tt__row { border-top-color: rgba(255,255,255,.14); }
  .tt__day { color: #fff; font-size: 8pt; }
  .tt__times { color: var(--on-dark-soft); font-size: 8pt; }
  .tt__times small { color: var(--teal); }

  .bar { display: flex; justify-content: space-between; align-items: baseline; gap: 6mm; margin-top: 5.5mm;
         padding-top: 4.5mm; border-top: 0.25mm solid rgba(255,255,255,.24); }
  .bar b { font-size: 9pt; color: #fff; font-weight: 500; }
  .bar span { font-size: 6.8pt; letter-spacing: .08em; text-transform: uppercase; color: var(--on-dark-quiet); font-weight: 600; }
  `,
  html: `<div class="sheet">
    <figure class="cover"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio"></figure>
    <header class="top">
      ${wordmark()}
      <p class="top__where">${BUSINESS.where}<br>Private studio &middot; est. 2016</p>
    </header>
    <footer class="foot">
      <p class="sig">${BUSINESS.person}</p>
      <h1>Hands-on treatment and <em>precise movement.</em></h1>
      <p class="foot__intro">${BUSINESS.role}. Sports Therapy and Clinical Pilates are not only for athletes: clients here are aged eight to over eighty.</p>

      <div class="duo">
        <div>
          <span class="label">Sports Therapy</span>
          <h2>Assessment-led, hands-on care.</h2>
          <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
        </div>
        <div>
          <span class="label">Clinical Pilates</span>
          <h2>Teaching the body to support itself.</h2>
          <p>${PILATES_FORMS.join(" &middot; ")}</p>
        </div>
      </div>

      ${figures()}

      <div class="bar">
        <b>${contactLine()}</b>
        <span>${BUSINESS.person}</span>
      </div>
    </footer>
  </div>`,
};

/* ==================================================== 22 portrait, text right
   L21 mirrored in spirit: the photograph is still the whole page, but the
   words hang down the right-hand side in one column, clear of her figure. She
   stands on the left of the frame; the right is wall and window, which is
   where a column of type can live without covering her.

   Same 1011px-wide source as L21, so the same caveat: fine on screen and on a
   wall, worth re-exporting at full resolution for a print run. */

const l22 = {
  slug: "poster-l22-portrait-right",
  label: "L22 Portrait, text right",
  css: `
  ${COMP}
  ${leaders}
  ${TT_CSS}
  .sheet { background: var(--navy-deeper); }
  /* Her head sits left of centre in the source; pushing the focal point to
     12% keeps her whole figure in the left half of the trim. */
  .cover { position: absolute; inset: 0; }
  .cover img { width: 100%; height: 100%; object-fit: cover; object-position: 12% 18%; }
  /* The scrim is vertical, not horizontal: a right-hand shade wide enough to
     carry the column, deepening toward the foot where the tables sit. */
  .cover::after { content: ""; position: absolute; inset: 0; background:
    linear-gradient(90deg, rgba(21,27,63,0) 34%, rgba(21,27,63,.45) 50%, rgba(21,27,63,.8) 62%, rgba(21,27,63,.84) 100%),
    linear-gradient(180deg, rgba(21,27,63,.22) 0%, rgba(21,27,63,0) 16%, rgba(21,27,63,0) 70%, rgba(21,27,63,.45) 94%); }

  .col { position: relative; margin-left: auto; width: 94mm; height: 297mm;
         padding: 12mm 12mm 9mm 0; display: flex; flex-direction: column; color: #fff;
         font-weight: 500; text-shadow: 0 0.2mm 1.2mm rgba(21,27,63,.6); }

  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 12.5mm; height: auto; filter: brightness(0) invert(1); }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: #fff; }
  .wordmark__descriptor { font-size: 6.8pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.9); margin-top: 1.5mm; }

  .sig { font-family: "Parisienne", cursive; font-size: 19pt; color: #fff; text-shadow: 0 0 3mm rgba(21,27,63,.55); margin-top: 11mm; }
  .col h1 { font-size: 24pt; line-height: 1.15; letter-spacing: -0.018em; color: #fff; margin-top: 2mm; }
  .col h1 em { font-style: italic; color: var(--periwinkle); }
  .col__intro { font-size: 9.4pt; line-height: 1.6; color: rgba(255,255,255,.94); margin-top: 4mm; }

  .block { margin-top: 6mm; padding-top: 5mm; border-top: 0.25mm solid rgba(255,255,255,.3); }
  .label { color: #56D6DA; font-size: 8pt; }
  .block h2 { font-size: 13pt; color: #fff; margin: 2mm 0 1.8mm; }
  .block p { font-size: 8.8pt; line-height: 1.6; color: rgba(255,255,255,.92); }

  .fees { display: grid; grid-template-columns: 1fr 1fr; gap: 0 7mm; margin-top: 3mm; }
  .fees .label { font-size: 7pt; letter-spacing: .1em; margin-bottom: 2mm; }
  .row { font-size: 8.7pt; line-height: 1.85; color: rgba(255,255,255,.94); }
  .row__lead { border-bottom-color: rgba(255,255,255,.3); }
  .row__fee { color: #fff; font-weight: 700; }

  .tt__row { padding: 1.1mm 0; }
  .tt__row + .tt__row { border-top-color: rgba(255,255,255,.2); }
  .tt__day { color: #fff; font-size: 8.7pt; flex: 0 0 16mm; font-weight: 700; }
  .tt__times { color: rgba(255,255,255,.94); font-size: 8.7pt; }
  .tt__times small { color: #56D6DA; }

  .bar { margin-top: auto; padding-top: 4.5mm; border-top: 0.25mm solid rgba(255,255,255,.3); }
  .bar b { display: block; font-size: 13pt; color: #fff; font-weight: 600; }
  .bar span { display: block; font-size: 9pt; color: rgba(255,255,255,.94); line-height: 1.65; margin-top: 1.4mm; }
  .bar .who { font-size: 6.8pt; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.66); font-weight: 600; margin-top: 3.5mm; }
  `,
  html: `<div class="sheet">
    <figure class="cover"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio"></figure>
    <div class="col">
      ${wordmark()}
      <p class="sig">${BUSINESS.person}</p>
      <h1>Hands-on treatment and <em>precise movement.</em></h1>
      <p class="col__intro">Sports Therapy and Clinical Pilates from one private studio in ${BUSINESS.where}. Not only for athletes: clients here are aged eight to over eighty.</p>

      <section class="block">
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>${THERAPY_CONCERNS.join(" &middot; ")}</p>
      </section>

      <section class="block">
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>${PILATES_FORMS.join(" &middot; ")}</p>
      </section>

      <section class="block">
        <span class="label">Prices</span>
        <div class="fees">
          <div><span class="label">Sports Therapy</span>${rows(PRICES_THERAPY)}</div>
          <div><span class="label">Pilates</span>${rows(PRICES_PILATES)}</div>
        </div>
      </section>

      <section class="block">
        <span class="label">Weekly small-group classes</span>
        <div style="margin-top: 2.5mm">${tt()}</div>
      </section>

      <footer class="bar">
        <b>${BUSINESS.phone}</b>
        <span>${BUSINESS.email}<br>${BUSINESS.web}</span>
        <p class="who">${BUSINESS.person} &middot; ${BUSINESS.role}</p>
      </footer>
    </div>
  </div>`,
};

export const LAB_C = [l15, l16, l17, l18, l19, l20, l21, l22];
export const LAB_VARIANTS = [...LAB_A, ...LAB_B, ...LAB_C];
