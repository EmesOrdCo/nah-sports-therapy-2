/* The NJH A4 summary sheet. One page, print-ready and equally at home as a
   Facebook image.

   Built to a supplied comp rather than invented: white paper, a photograph
   masked with a curved inner edge running off the top and right trims, a teal
   accent taken from the studio kit, tick-marked lists, a tinted figures panel
   and a navy contact bar. Measurements below are the comp's, converted from
   its 1014px width to millimetres at print size.

   Every fact is lifted from the live site: prices from /prices, the timetable
   from /pilates#small-group, concerns from /treatment, qualifications from
   src/about/content.js, contact details from src/contact/content.js. Nothing
   here is invented, and nothing should be edited here without changing it
   there too.

   Image paths are written as ordinary /images/… URLs; build-poster.mjs swaps
   them for data URIs so the sheet is a single file that opens anywhere.

   Run: node sketches/build-poster.mjs && node sketches/shoot-poster.mjs */

export const BUSINESS = {
  name: "NJH",
  descriptor: "Sports Therapy &amp; Pilates",
  person: "Natasha Hadland",
  role: "Sports Therapist &amp; STOTT Pilates Instructor",
  phone: "07881 821 901",
  /* Client-supplied, and the same inbox enquiry notifications already go to
     (DEFAULT_TO in netlify/functions/enquiry.js). The co.uk address this
     replaced was displayed on the site but was not where the form delivered. */
  email: "njhpilates@gmail.com",
  web: "njhsportstherapy.co.uk",
  where: "Studham, near Whipsnade",
};

/* Five lines rather than the site's seven: whiplash folds into the neck entry
   and scar restriction into rehabilitation, so nothing named on /treatment is
   quietly dropped from the sheet. Ampersands, not "and", to hold each to a
   single line in a 78mm column. */
export const THERAPY_CONCERNS = [
  "Recurring postural pain",
  "Lower-back &amp; sciatic-type symptoms",
  "Neck, upper-back &amp; whiplash concerns",
  "Hip, knee, ankle &amp; upper-limb problems",
  "Strains, sprains &amp; tendon pain",
];

export const PILATES_FORMS = [
  "Individual &amp; duet",
  "Reformer",
  "Stability Chair",
  "Small group",
  "Pre &amp; postnatal",
  "Pilates for golfers",
];

export const PRICES_THERAPY = [
  ["Up to 30 minutes", "£60"],
  ["Up to 1 hour", "£85"],
  ["Up to 90 minutes", "£130"],
];

export const PRICES_PILATES = [
  ["Small group", "£22"],
  ["One-to-one, 1 hour", "£85"],
  ["Duet", "£95"],
];

export const TIMETABLE = [
  ["Monday", ["6.30pm"]],
  ["Tuesday", ["8.30am <small>45min</small>", "9.20am", "11.30am"]],
  ["Friday", ["7.30am", "9.30am"]],
];

export const CREDENTIAL_LINE =
  "London School of Sports Massage &nbsp;&middot;&nbsp; BTEC Level 5 Clinical Sport &amp; Remedial Massage &nbsp;&middot;&nbsp; Certified STOTT Pilates Instructor";

/* --------------------------------------------------------------- icon set
   Data URIs rather than inline <svg>, so the markup below stays readable and
   an icon is one declaration wherever it is used. %23 is a literal '#'. */

const TEAL = "%232FB3B7";

const tickIcon =
  `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>` +
  `<circle cx='10' cy='10' r='8.6' fill='none' stroke='${TEAL}' stroke-width='1.3'/>` +
  `<path d='M6.1 10.2 8.9 12.9 14 7.3' fill='none' stroke='${TEAL}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>` +
  `</svg>")`;

/* The contact glyphs sit in a filled disc so they read on the navy bar at
   4.6mm. An outlined circle disappears at that size in print. */
const disc = (glyph) =>
  `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>` +
  `<circle cx='12' cy='12' r='12' fill='%23DDE3F6'/>` +
  glyph +
  `</svg>")`;

const INK = "%231A2150";

const phoneIcon = disc(
  `<path d='M17.4 14.9v1.7a1.2 1.2 0 0 1-1.3 1.2 11.9 11.9 0 0 1-5.2-1.8 11.7 11.7 0 0 1-3.6-3.6A11.9 11.9 0 0 1 5.5 7.2 1.2 1.2 0 0 1 6.7 6h1.7a1.2 1.2 0 0 1 1.2 1c.1.6.2 1.1.4 1.6a1.2 1.2 0 0 1-.3 1.3l-.7.7a9.4 9.4 0 0 0 3.6 3.6l.7-.7a1.2 1.2 0 0 1 1.3-.3c.5.2 1 .3 1.6.4a1.2 1.2 0 0 1 1 1.2z' fill='none' stroke='${INK}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>`,
);

const mailIcon = disc(
  `<rect x='5' y='7' width='14' height='10' rx='1.4' fill='none' stroke='${INK}' stroke-width='1.5'/>` +
    `<path d='M5.4 8 12 12.6 18.6 8' fill='none' stroke='${INK}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>`,
);

const globeIcon = disc(
  `<circle cx='12' cy='12' r='6.6' fill='none' stroke='${INK}' stroke-width='1.5'/>` +
    `<path d='M5.4 12h13.2M12 5.4a13 13 0 0 1 0 13.2 13 13 0 0 1 0-13.2z' fill='none' stroke='${INK}' stroke-width='1.5'/>`,
);

/* ------------------------------------------------------------------ shared */

const FOUNDATION = `
  @page { size: A4; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    background: #6b6f86;
    font-family: "Hanken Grotesk Variable", system-ui, sans-serif;
    font-synthesis: none;
    text-rendering: geometricPrecision;
  }
  .sheet {
    width: 210mm; height: 297mm;
    margin: 0 auto;
    background: #fff;
    position: relative;
    overflow: hidden;
    display: flex; flex-direction: column;
    color: var(--navy);
  }
  @media screen { .sheet { box-shadow: 0 2mm 12mm rgba(0,0,0,.35); } }
  h1, h2, h3 { margin: 0; font-weight: 400; font-family: "STIX Two Text", Georgia, serif; }
  p, ul, figure { margin: 0; }
  ul { padding: 0; list-style: none; }
  b, strong { font-weight: 600; }
  img { display: block; }
  :root {
    /* Sampled from the comp. The teal is the studio kit; everything else is
       the site's indigo family run a shade cooler for print. */
    --navy: #262C63;
    --navy-deep: #151B3F;
    --teal: #2FB3B7;
    --body: #565D75;
    --tint: #EEF1F6;
    --line: rgba(38, 44, 99, .15);
  }
  .label {
    display: block;
    font-size: 7.6pt; letter-spacing: .1em; text-transform: uppercase;
    font-weight: 700; color: var(--teal);
  }
`;

const poster = {
  slug: "poster",
  label: "NJH A4 summary",
  css: `
  /* ------------------------------------------------------------------ hero */
  .hero { position: relative; height: 156mm; padding: 15mm 13mm 0; flex: 0 0 auto; }

  /* The photograph is a shape, not a rectangle: it runs off the top and right
     trims and is cut on the inside by a long, shallow curve down the left and
     a wide sweep across the bottom-left. Radii are TL / TR / BR / BL, the
     horizontal set before the slash and the vertical set after. */
  .hero__photo {
    position: absolute; top: 0; right: 0; width: 104mm; height: 156mm;
    overflow: hidden;
    border-radius: 7mm 0 0 48mm / 88mm 0 0 35mm;
  }
  .hero__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 43% 22%; }
  /* A hairline repeat of the same shape, nudged down and left, so the curve
     carries a faint edge into the white rather than stopping dead. */
  .hero__halo {
    position: absolute; top: -6mm; right: -6mm; width: 110mm; height: 162mm;
    transform: translate(-2.6mm, 2.6mm);
    border-radius: 7mm 0 0 48mm / 92mm 0 0 36mm;
    border: 0.3mm solid rgba(47, 179, 183, .30);
    pointer-events: none;
  }

  .hero__text { position: relative; width: 84mm; height: 100%; display: flex; flex-direction: column; }

  .wordmark { display: flex; align-items: center; gap: 5mm; }
  .wordmark__mark { width: 12.5mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 33pt; letter-spacing: .008em; color: var(--navy); }
  .wordmark__descriptor { font-size: 7.6pt; letter-spacing: .105em; text-transform: uppercase; font-weight: 600; color: var(--navy); margin-top: 2mm; }

  .hero h1 { font-size: 29pt; line-height: 1.15; letter-spacing: -0.018em; color: var(--navy); margin-top: 9mm; }
  .hero__intro { font-size: 10pt; line-height: 1.59; color: var(--body); margin-top: 5mm; width: 66mm; }

  .sig { font-family: "Parisienne", "Snell Roundhand", cursive; font-size: 19pt; line-height: 1;
         color: var(--teal); margin-top: 6mm; }
  .hero__role { font-size: 7pt; line-height: 1.75; letter-spacing: .085em; text-transform: uppercase;
                font-weight: 700; color: var(--navy); margin-top: 4mm; }

  /* -------------------------------------------------------------- services */
  .services { display: grid; grid-template-columns: 1fr 1fr; gap: 0 11mm; padding: 8mm 13mm 0; flex: 0 0 auto; }
  .services > article + article { padding-left: 11mm; border-left: 0.2mm solid var(--line); margin-left: -11mm; }
  .services h2 { font-size: 12.5pt; line-height: 1.32; letter-spacing: -0.01em; margin: 3mm 0 3.4mm; }
  .services > article > p { font-size: 8.8pt; line-height: 1.55; color: var(--body); }

  .ticks { margin-top: 4.6mm; }
  .ticks li { font-size: 8.2pt; line-height: 1.3; color: var(--navy); padding-left: 6mm; position: relative; margin-bottom: 2mm; }
  .ticks li::before {
    content: ""; position: absolute; left: 0; top: 0.15mm;
    width: 3.5mm; height: 3.5mm;
    background: ${tickIcon} no-repeat center / contain;
  }

  /* --------------------------------------------------------------- figures */
  /* One panel, not three cells. The vertical rules were landing hard against
     the fee column. A dot leader runs to the edge of its column by design, so
     any divider there reads as content touching a box edge. The rules are gone
     and the gap between columns does the separating instead. Square corners,
     which the navy bar below already sets the precedent for. */
  .figures {
    margin: auto 12mm 4mm; padding: 5mm 9mm 4mm;
    background: var(--tint);
    display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 0 14mm;
    flex: 0 0 auto;
  }
  .figures .label { font-size: 7.3pt; margin-bottom: 3mm; }

  .row { display: flex; align-items: baseline; gap: 1.4mm; font-size: 8.2pt; line-height: 2.0; }
  .row__lead { flex: 1 1 auto; min-width: 3mm; border-bottom: 0.25mm dotted var(--line); transform: translateY(-0.9mm); }
  .row__fee { flex: 0 0 auto; font-variant-numeric: tabular-nums; font-weight: 700; }

  .tt__row { display: flex; align-items: baseline; gap: 3mm; padding: 0.45mm 0; }
  .tt__day { flex: 0 0 17mm; font-size: 8.2pt; font-weight: 700; }
  .tt__times { display: flex; flex-wrap: wrap; gap: 0 3.6mm; font-size: 8.2pt; line-height: 1.55;
               font-variant-numeric: tabular-nums; color: var(--body); }
  .tt__times small { font-size: 6.6pt; color: var(--teal); font-weight: 600; }

  /* ---------------------------------------------------------------- footer */
  .bar { background: var(--navy-deep); color: #fff; padding: 5mm 12mm 7mm; flex: 0 0 auto; }
  .bar__contacts { display: flex; align-items: center; justify-content: center; }
  .bar__contacts a { display: flex; align-items: center; gap: 3mm; font-size: 8.8pt; line-height: 1.15; color: #fff; text-decoration: none; padding: 0 7mm; }
  .bar__contacts a + a { border-left: 0.2mm solid rgba(255,255,255,.24); }
  .bar__contacts i { flex: 0 0 auto; width: 4.6mm; height: 4.6mm; background-repeat: no-repeat; background-position: center; background-size: contain; }
  .i-phone { background-image: ${phoneIcon}; }
  .i-mail { background-image: ${mailIcon}; }
  .i-web { background-image: ${globeIcon}; }
  .bar__creds { text-align: center; font-size: 6.5pt; line-height: 1.5; color: rgba(255,255,255,.62);
                margin-top: 3.6mm; }
  `,
  html: `<div class="sheet">
    <section class="hero">
      <figure class="hero__photo"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio"></figure>
      <div class="hero__halo" aria-hidden="true"></div>
      <div class="hero__text">
        <div class="wordmark">
          <img class="wordmark__mark" src="/images/njh-mark.svg" alt="" width="218" height="198">
          <div class="wordmark__text">
            <span class="wordmark__name">${BUSINESS.name}</span>
            <span class="wordmark__descriptor">${BUSINESS.descriptor}</span>
          </div>
        </div>
        <h1>Hands-on treatment and precise movement, from one private studio.</h1>
        <p class="hero__intro">Sports Therapy is not only for athletes, and Pilates is not only for the already-strong. Clients at NJH are aged eight to over eighty.</p>
        <p class="sig">${BUSINESS.person}</p>
        <p class="hero__role">${BUSINESS.role}<br>${BUSINESS.where}</p>
      </div>
    </section>

    <section class="services">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>Treatment for musculoskeletal pain, tension and restricted movement, with rehabilitation that keeps the change.</p>
        <ul class="ticks">${THERAPY_CONCERNS.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>Slow, precise, controlled work that strengthens the deep postural muscles, adapted to your starting point.</p>
        <ul class="ticks">${PILATES_FORMS.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>
    </section>

    <section class="figures">
      <section>
        <span class="label">Sports Therapy</span>
        ${PRICES_THERAPY.map(([l, f]) => `<p class="row"><span>${l}</span><span class="row__lead"></span><span class="row__fee">${f}</span></p>`).join("")}
      </section>
      <section>
        <span class="label">Pilates</span>
        ${PRICES_PILATES.map(([l, f]) => `<p class="row"><span>${l}</span><span class="row__lead"></span><span class="row__fee">${f}</span></p>`).join("")}
      </section>
      <section>
        <span class="label">Weekly small-group classes</span>
        ${TIMETABLE.map(
          ([day, times]) =>
            `<div class="tt__row"><span class="tt__day">${day}</span><span class="tt__times">${times
              .map((t) => `<span>${t}</span>`)
              .join("")}</span></div>`,
        ).join("")}
      </section>
    </section>

    <footer class="bar">
      <div class="bar__contacts">
        <a href="tel:+447881821901"><i class="i-phone"></i>${BUSINESS.phone}</a>
        <a href="mailto:${BUSINESS.email}"><i class="i-mail"></i>${BUSINESS.email}</a>
        <a href="https://${BUSINESS.web}"><i class="i-web"></i>${BUSINESS.web}</a>
      </div>
      <p class="bar__creds">${CREDENTIAL_LINE}</p>
    </footer>
  </div>`,
};


/* ======================================================= earlier directions
   The three white sheets that preceded the comp: an editorial broadsheet with
   a corner-bleed photograph, a clinic letterhead with a tinted rail and two
   lapped pictures, and a quiet centred sheet built around an arch. Rebuilt
   here so all four can be compared side by side, and so a change of fact
   (the email address, a price, a class time) lands on every one of them at
   once. They share this file's data and foundation; each brings only its own
   layout. */

/* Extra tokens the three earlier sheets are drawn in. The comp's palette runs
   cooler and carries teal; these are the site's own indigo family. */
const LEGACY_TOKENS = `
  :root {
    --brand: oklch(41.9% 0.117 275);
    --brand-strong: oklch(33.8% 0.122 279);
    --brand-light: oklch(51.5% 0.100 269);
    --periwinkle: oklch(76.7% 0.096 275);
    --ink: oklch(23.2% 0.055 277);
    --ink-soft: oklch(43.5% 0.045 277);
    --alt-line: oklch(23.2% 0.055 277 / 0.16);
    --alt-navy: oklch(21.5% 0.055 277);
    --alt-tint: oklch(97.2% 0.008 275);
    --on-dark: oklch(96.6% 0.010 275);
  }
  .sheet { color: var(--ink); }
  p, ul, dl, dd, figure { margin: 0; }
  .label { font-size: 7.4pt; letter-spacing: .17em; text-transform: uppercase;
           font-weight: 600; color: var(--brand); display: block; }
  .row__fee { color: var(--brand-strong); font-weight: 600; }
`;

const leaders = `
  .row { display: flex; align-items: baseline; gap: 1.2mm; }
  .row__lead { flex: 1 1 auto; min-width: 3mm; border-bottom: 0.25mm dotted var(--alt-line); transform: translateY(-0.9mm); }
  .row__fee { flex: 0 0 auto; font-variant-numeric: tabular-nums; }
`;

const altWordmark = () => `<div class="wordmark">
  <img class="wordmark__mark" src="/images/njh-mark.svg" alt="" width="218" height="198">
  <div class="wordmark__text">
    <span class="wordmark__name">${BUSINESS.name}</span>
    <span class="wordmark__descriptor">${BUSINESS.descriptor}</span>
  </div>
</div>`;

const altPriceRows = (rows) =>
  rows
    .map(
      ([label, fee]) =>
        `<p class="row"><span>${label}</span><span class="row__lead"></span><span class="row__fee">${fee}</span></p>`,
    )
    .join("");

const altTimetable = () =>
  TIMETABLE.map(
    ([day, times]) =>
      `<div class="tt__row"><span class="tt__day">${day}</span><span class="tt__times">${times
        .map((t) => `<span>${t}</span>`)
        .join("")}</span></div>`,
  ).join("");

const altFigures = () => `<section class="figures">
  <section>
    <span class="label">Sports Therapy</span>
    ${altPriceRows(PRICES_THERAPY)}
  </section>
  <section>
    <span class="label">Pilates</span>
    ${altPriceRows(PRICES_PILATES)}
  </section>
  <section class="figures__tt">
    <span class="label">Weekly small-group classes</span>
    ${altTimetable()}
  </section>
</section>`;

/* ------------------------------------------------------- alt A: Broadsheet */

const broadsheet = {
  slug: "poster-alt-a-broadsheet",
  label: "Alt A, Broadsheet",
  css: `
  ${LEGACY_TOKENS}
  ${leaders}
  /* The photograph is one corner of the page rather than a picture on it: it
     runs off the top and right trims and the masthead sits in the white left
     over. */
  .sheet { padding: 0; }
  .gutter { padding: 0 0 0 15mm; }

  .hero { position: relative; min-height: 130mm; padding: 14mm 15mm 8mm; display: flex; flex-direction: column; }
  .hero__photo { position: absolute; top: 0; right: 0; bottom: 0; width: 88mm; overflow: hidden; }
  .hero__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 46% 44%; }
  .hero__text { position: relative; max-width: 104mm; }
  .hero__by { font-size: 8pt; line-height: 1.6; color: var(--ink-soft); margin-top: auto; padding-top: 9mm; position: relative; }
  .hero__by b { color: var(--ink); font-weight: 600; }

  .wordmark { display: flex; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 14mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 23pt; letter-spacing: .01em; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7.6pt; letter-spacing: .17em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 1.5mm; }

  .rule { height: 0; border-top: 0.35mm solid var(--brand-strong); }
  .hero h1 { font-size: 25pt; line-height: 1.07; letter-spacing: -0.028em; color: var(--brand-strong); margin-top: 13mm; }
  .hero__intro { font-size: 9.8pt; line-height: 1.62; color: var(--ink-soft); margin-top: 6mm; }

  .services { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; padding: 7mm 15mm 6mm; }
  .services > article + article { padding-left: 12mm; border-left: 0.2mm solid var(--alt-line); margin-left: -12mm; }
  .services h2 { font-size: 16.5pt; letter-spacing: -0.018em; margin: 3mm 0 3mm; }
  .services > article > p { font-size: 9pt; line-height: 1.6; color: var(--ink-soft); }
  .services ul { margin-top: 4mm; }
  .services li { font-size: 8.6pt; line-height: 1.45; padding-left: 3.8mm; position: relative; margin-bottom: 1.2mm; }
  .services li::before { content: ""; position: absolute; left: 0; top: 1.7mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.28mm solid var(--brand-light); }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.15fr; gap: 0 10mm; padding: 6mm 0 6.5mm; margin: 0 15mm; border-top: 0.2mm solid var(--alt-line); }
  .figures > section + section { padding-left: 10mm; border-left: 0.2mm solid var(--alt-line); margin-left: -10mm; }
  .figures .label { margin-bottom: 3.6mm; }
  .figures .row { font-size: 8.8pt; line-height: 1.6; }
  .tt__row { display: flex; align-items: baseline; gap: 3mm; padding: 1.7mm 0; border-top: 0.2mm solid var(--alt-line); }
  .tt__row:first-of-type { border-top: 0; padding-top: 0; }
  .tt__day { flex: 0 0 18mm; font-size: 8.6pt; font-weight: 600; }
  .tt__times { display: flex; flex-wrap: wrap; gap: 1mm 3.4mm; font-size: 8.6pt; font-variant-numeric: tabular-nums; color: var(--ink-soft); }
  .tt__times small { font-size: 6.8pt; color: var(--brand-light); letter-spacing: .04em; }

  .plate { margin-top: auto; background: var(--alt-navy); color: var(--on-dark); padding: 6.5mm 15mm 7.5mm; }
  .contact { display: flex; gap: 11mm; }
  .contact div { display: flex; flex-direction: column; gap: 1.4mm; }
  .contact span { font-size: 6.8pt; letter-spacing: .15em; text-transform: uppercase; color: oklch(96.6% 0.010 275 / .55); font-weight: 600; }
  .contact b { font-size: 11.5pt; font-weight: 500; white-space: nowrap; }
  .creds { font-size: 6.8pt; line-height: 1.5; color: oklch(96.6% 0.010 275 / .5);
           margin-top: 5.5mm; padding-top: 4mm; border-top: 0.2mm solid oklch(96.6% 0.010 275 / .18); }
  `,
  html: `<div class="sheet">
    <section class="hero">
      <figure class="hero__photo"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio"></figure>
      <div class="hero__text">
        ${altWordmark()}
        <h1>Hands-on treatment and precise movement, from&nbsp;one private studio.</h1>
        <p class="hero__intro">Sports Therapy is not only for athletes, and Pilates is not only for the already-strong. Clients at NJH are aged eight to over eighty.</p>
      </div>
      <p class="hero__by"><b>${BUSINESS.person}</b> &middot; ${BUSINESS.role}<br>${BUSINESS.where}</p>
    </section>
    <div class="gutter"><div class="rule"></div></div>

    <section class="services">
      <article>
        <span class="label">Sports Therapy</span>
        <h2>Assessment-led, hands-on care.</h2>
        <p>Treatment for musculoskeletal pain, tension and restricted movement, with rehabilitation that keeps the change.</p>
        <ul>${THERAPY_CONCERNS.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="label">Clinical Pilates</span>
        <h2>Teaching the body to support itself.</h2>
        <p>Slow, precise, controlled work that strengthens the deep postural muscles, adapted to your starting point.</p>
        <ul>${PILATES_FORMS.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>
    </section>

    ${altFigures()}

    <footer class="plate">
      <div class="contact">
        <div><span>Telephone</span><b>${BUSINESS.phone}</b></div>
        <div><span>Email</span><b>${BUSINESS.email}</b></div>
        <div><span>Online</span><b>${BUSINESS.web}</b></div>
      </div>
      <p class="creds">${CREDENTIAL_LINE}</p>
    </footer>
  </div>`,
};

/* ------------------------------------------------------ alt B: Clinic rail */

const rail = {
  slug: "poster-alt-b-rail",
  label: "Alt B, Clinic rail",
  css: `
  ${LEGACY_TOKENS}
  ${leaders}
  .sheet { flex-direction: row; }
  /* so the lapped photograph can cross into the white column */
  .rail { position: relative; z-index: 2; }

  .rail { flex: 0 0 64mm; background: var(--alt-tint); border-right: 0.3mm solid var(--alt-line);
          padding: 14mm 10mm 0; display: flex; flex-direction: column; }
  .wordmark { display: flex; flex-direction: column; align-items: flex-start; gap: 3.4mm; margin-bottom: 7mm; }
  .wordmark__mark { width: 15mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 6.8pt; letter-spacing: .155em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 2mm; }

  .rail__block { padding: 7mm 0; border-top: 0.2mm solid var(--alt-line); }
  .rail .label { font-size: 6.8pt; letter-spacing: .16em; margin-bottom: 3.4mm; }
  .rail__lines { font-size: 9pt; line-height: 1.6; }
  .rail__lines b { display: block; font-weight: 600; font-size: 11pt; color: var(--brand-strong); margin-bottom: 1.4mm; }
  .rail__lines span { display: block; color: var(--ink-soft); font-size: 8.4pt; }
  .rail__note { font-size: 7.4pt; line-height: 1.5; color: var(--ink-soft); margin-top: 3mm; }
  .tt__row { display: flex; align-items: baseline; gap: 2.5mm; padding: 1.9mm 0; }
  .tt__row + .tt__row { border-top: 0.2mm solid var(--alt-line); }
  .tt__day { flex: 0 0 16mm; font-size: 8.6pt; font-weight: 600; }
  .tt__times { display: flex; flex-wrap: wrap; gap: .8mm 3mm; font-size: 8.6pt; font-variant-numeric: tabular-nums; color: var(--ink-soft); }
  .tt__times small { font-size: 6.6pt; color: var(--brand-light); }

  /* Two photographs, not one: the large one takes the foot of the rail out to
     both trims, and a square is lapped over its shoulder so it breaks the
     rail's edge into the gutter the main column already leaves clear. */
  .rail__shots { position: relative; margin: auto -10mm 0; height: 84mm; }
  .rail__shots img { width: 100%; height: 100%; object-fit: cover; }
  .rail__shots .big { position: absolute; inset: 0; overflow: hidden; }
  .rail__shots .big img { object-position: 38% 46%; }
  .rail__shots .inset { position: absolute; right: -11mm; top: -21mm; width: 42mm; height: 42mm;
                        overflow: hidden; background: #fff; box-shadow: 0 0 0 2.4mm #fff; }

  .main { flex: 1 1 auto; padding: 14mm 15mm 0; display: flex; flex-direction: column; }
  .main__eyebrow { font-size: 7pt; letter-spacing: .18em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-bottom: 4mm; display: block; }
  .main h1 { font-size: 27pt; line-height: 1.07; letter-spacing: -0.026em; color: var(--brand-strong); }
  .main h1 em { font-style: italic; }
  .main__lede { font-size: 9.4pt; line-height: 1.62; color: var(--ink-soft); margin-top: 6mm; }

  .entry { padding: 9mm 0; border-top: 0.2mm solid var(--alt-line); }
  .entry:first-of-type { margin-top: 11mm; border-top-color: var(--brand-strong); border-top-width: 0.35mm; }
  .entry__head { display: flex; align-items: baseline; gap: 4mm; }
  .entry__n { font-family: "STIX Two Text", serif; font-size: 11pt; color: var(--brand-light); }
  .entry h2 { font-size: 17pt; letter-spacing: -0.018em; }
  .entry > p { font-size: 9pt; line-height: 1.6; color: var(--ink-soft); margin-top: 3mm; }
  .entry ul { margin-top: 4.5mm; columns: 2; column-gap: 9mm; }
  .entry li { font-size: 8.6pt; line-height: 1.45; padding-left: 3.8mm; position: relative; margin-bottom: 1.8mm; break-inside: avoid; }
  .entry li::before { content: ""; position: absolute; left: 0; top: 1.7mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; border: 0.28mm solid var(--brand-light); }

  /* The timetable already has the rail to itself, so the shared figures block
     drops its third column here rather than repeating it. */
  .figures { display: grid; grid-template-columns: 1fr 1fr; gap: 0 9mm; margin-top: 5mm; }
  .figures > section:nth-child(2) { padding-left: 9mm; border-left: 0.2mm solid var(--alt-line); margin-left: -9mm; }
  .figures .label { font-size: 6.9pt; letter-spacing: .15em; color: var(--brand-light); margin-bottom: 3mm; }
  .figures .row { font-size: 8.8pt; line-height: 1.95; }
  .figures__tt { display: none; }

  .close { margin: auto -15mm 0; background: var(--alt-navy); color: var(--on-dark);
           padding: 7mm 15mm 8mm; display: flex; align-items: flex-end; justify-content: space-between; gap: 8mm; }
  .close h2 { font-size: 13pt; letter-spacing: -0.012em; line-height: 1.25; max-width: 58mm; }
  .close .cta { text-align: right; }
  .close .cta span { display: block; font-size: 6.6pt; letter-spacing: .16em; text-transform: uppercase; color: var(--periwinkle); font-weight: 600; margin-bottom: 1.8mm; }
  .close .cta b { font-size: 14pt; font-weight: 500; display: block; }
  .close .cta small { font-size: 8.8pt; color: oklch(96.6% 0.010 275 / .7); }
  `,
  html: `<div class="sheet">
    <aside class="rail">
      ${altWordmark()}

      <div class="rail__block">
        <span class="label">Enquiries</span>
        <p class="rail__lines">
          <b>${BUSINESS.phone}</b>
          <span>${BUSINESS.email}</span>
          <span>${BUSINESS.web}</span>
        </p>
      </div>

      <div class="rail__block">
        <span class="label">Where</span>
        <p class="rail__lines"><b>Studham</b><span>near Whipsnade</span></p>
        <p class="rail__note">A private studio, opened 2016. Directions are sent when your appointment is confirmed.</p>
      </div>

      <div class="rail__block">
        <span class="label">Small-group classes</span>
        ${altTimetable()}
        <p class="rail__note">55 minutes unless noted. One-to-one appointments Monday to Friday.</p>
      </div>

      <div class="rail__shots">
        <figure class="big"><img src="/images/natasha-mat-1400.webp" alt="Natasha in the Studham studio"></figure>
        <figure class="inset"><img src="/images/pilates-individual-orb-450.webp" alt="A side plank on the mat"></figure>
      </div>
    </aside>

    <div class="main">
      <span class="main__eyebrow">${BUSINESS.person} &middot; ${BUSINESS.role}</span>
      <h1>Two disciplines, <em>one quiet room.</em></h1>
      <p class="main__lede">Sports Therapy is not only for athletes and Pilates is not only for the already-strong. Clients here are aged eight to over eighty.</p>

      <section class="entry">
        <div class="entry__head"><span class="entry__n">01</span><h2>Sports Therapy</h2></div>
        <p>Assessment-led, hands-on treatment for musculoskeletal pain, tension and restricted movement.</p>
        <ul>${THERAPY_CONCERNS.map((t) => `<li>${t}</li>`).join("")}</ul>
      </section>

      <section class="entry">
        <div class="entry__head"><span class="entry__n">02</span><h2>Clinical Pilates</h2></div>
        <p>Slow, precise, controlled movement to strengthen the deep postural muscles, on the mat, the Reformer and the Stability Chair.</p>
        <ul>${PILATES_FORMS.map((t) => `<li>${t}</li>`).join("")}</ul>
      </section>

      <section class="entry">
        <div class="entry__head"><span class="entry__n">03</span><h2>Prices</h2></div>
        ${altFigures()}
      </section>

      <footer class="close">
        <h2>Not sure where to start? Describe it in your own words.</h2>
        <div class="cta">
          <span>Call or email Natasha</span>
          <b>${BUSINESS.phone}</b>
          <small>${BUSINESS.email}</small>
        </div>
      </footer>
    </div>
  </div>`,
};

/* ------------------------------------------------------------ alt C: Quiet */

const quiet = {
  slug: "poster-alt-c-quiet",
  label: "Alt C, Quiet",
  css: `
  ${LEGACY_TOKENS}
  ${leaders}
  .sheet { padding: 14mm 0 0; text-align: center; }
  .shell { padding: 0 22mm; }

  .wordmark { display: flex; flex-direction: column; align-items: center; gap: 3.4mm; }
  .wordmark__mark { width: 13mm; height: auto; }
  .wordmark__text { display: flex; flex-direction: column; line-height: 1; }
  .wordmark__name { font-family: "STIX Two Text", serif; font-weight: 600; font-size: 22pt; color: var(--brand-strong); }
  .wordmark__descriptor { font-size: 7.2pt; letter-spacing: .2em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); margin-top: 2.2mm; }

  h1 { font-size: 29pt; line-height: 1.08; letter-spacing: -0.028em; color: var(--brand-strong); margin-top: 7mm; }
  h1 em { font-style: italic; }
  .standfirst { font-size: 10pt; line-height: 1.65; color: var(--ink-soft); margin: 6mm auto 0; max-width: 116mm; }

  /* A true semicircular head on a 120mm plate, which is a shape a standing
     portrait sits in and a rectangle is not. */
  .band { width: 120mm; height: 112mm; margin: 7mm auto 0; overflow: hidden; border-radius: 60mm 60mm 2mm 2mm; }
  .band img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; }

  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14mm; padding-top: 8mm; text-align: left; }
  .pair > article + article { padding-left: 14mm; border-left: 0.2mm solid var(--alt-line); margin-left: -14mm; }
  .pair h2 { font-size: 15.5pt; letter-spacing: -0.018em; margin: 2.8mm 0 3mm; }
  .pair p { font-size: 8.8pt; line-height: 1.6; color: var(--ink-soft); }
  .pair .forms { font-size: 8.4pt; line-height: 1.6; color: var(--ink); margin-top: 3mm; }

  .figures { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0 10mm; text-align: left;
             background: var(--alt-tint); margin-top: 7mm; padding: 7mm 22mm; }
  .figures > section + section { padding-left: 10mm; border-left: 0.2mm solid var(--alt-line); margin-left: -10mm; }
  .figures .label { color: var(--brand-light); font-size: 6.9pt; letter-spacing: .15em; margin-bottom: 3.4mm; }
  .figures .row { font-size: 8.8pt; line-height: 1.9; }
  .tt__row { display: flex; align-items: baseline; gap: 3mm; padding: 1.6mm 0; }
  .tt__row + .tt__row { border-top: 0.2mm solid var(--alt-line); }
  .tt__day { flex: 0 0 17mm; font-size: 8.6pt; font-weight: 600; }
  .tt__times { display: flex; flex-wrap: wrap; gap: .8mm 3mm; font-size: 8.6pt; font-variant-numeric: tabular-nums; color: var(--ink-soft); }
  .tt__times small { font-size: 6.6pt; color: var(--brand-light); }

  .sign { margin-top: auto; padding: 7mm 22mm 9mm; }
  .sign__label { font-size: 7pt; letter-spacing: .18em; text-transform: uppercase; font-weight: 600; color: var(--brand-light); }
  .sign__line { font-family: "STIX Two Text", serif; font-size: 16pt; color: var(--brand-strong); margin-top: 4mm; letter-spacing: -0.008em; }
  .sign__line i { font-style: normal; color: var(--alt-line); margin: 0 3.5mm; }
  .sign__where { font-size: 8.2pt; color: var(--ink-soft); margin-top: 3.5mm; }
  `,
  html: `<div class="sheet">
    <div class="shell">
      ${altWordmark()}
      <h1>Hands-on treatment and <em>precise movement.</em></h1>
      <p class="standfirst">Sports Therapy and Clinical Pilates from one private studio in Studham, with Natasha Hadland.</p>
    </div>

    <figure class="band"><img src="/images/natasha-therapy-1011.webp" alt="Natasha Hadland in the Studham studio"></figure>

    <div class="shell">
      <section class="pair">
        <article>
          <span class="label">Sports Therapy</span>
          <h2>Assessment-led, hands-on care.</h2>
          <p>For musculoskeletal pain, tension and restricted movement: postural and lower-back pain, neck and shoulder restriction, strains, sprains and tendon pain.</p>
        </article>
        <article>
          <span class="label">Clinical Pilates</span>
          <h2>Movement that supports itself.</h2>
          <p>Slow, precise work that strengthens the deep postural muscles.</p>
          <p class="forms">${PILATES_FORMS.join(" &middot; ")}</p>
        </article>
      </section>
    </div>

    ${altFigures()}

    <footer class="sign">
      <p class="sign__label">Speak to Natasha</p>
      <p class="sign__line">${BUSINESS.phone}<i>/</i>${BUSINESS.web}</p>
      <p class="sign__where">${BUSINESS.email} &middot; ${BUSINESS.where}</p>
    </footer>
  </div>`,
};

export const FOUNDATION_CSS = FOUNDATION;
export const VARIANTS = [poster, broadsheet, rail, quiet];
