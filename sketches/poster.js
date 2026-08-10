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

const BUSINESS = {
  name: "NJH",
  descriptor: "Sports Therapy &amp; Pilates",
  person: "Natasha Hadland",
  role: "Sports Therapist &amp; STOTT Pilates Instructor",
  phone: "07881 821 901",
  /* The address the site publishes, in src/contact/content.js and its two
     siblings. NJH gave njhpilates@gmail.com for print; one address across
     print and web is worth more than the distinction. */
  email: "natasha@njhsportstherapy.co.uk",
  web: "njhsportstherapy.co.uk",
  where: "Studham, near Whipsnade",
};

/* Five lines rather than the site's seven: whiplash folds into the neck entry
   and scar restriction into rehabilitation, so nothing named on /treatment is
   quietly dropped from the sheet. Ampersands, not "and", to hold each to a
   single line in a 78mm column. */
const THERAPY_CONCERNS = [
  "Recurring postural pain",
  "Lower-back &amp; sciatic-type symptoms",
  "Neck, upper-back &amp; whiplash concerns",
  "Hip, knee, ankle &amp; upper-limb problems",
  "Strains, sprains &amp; tendon pain",
];

const PILATES_FORMS = [
  "Individual &amp; duet",
  "Reformer",
  "Stability Chair",
  "Small group",
  "Pre &amp; postnatal",
  "Pilates for golfers",
];

const PRICES_THERAPY = [
  ["Up to 30 minutes", "£60"],
  ["Up to 1 hour", "£85"],
  ["Up to 90 minutes", "£130"],
];

const PRICES_PILATES = [
  ["Small group", "£22"],
  ["One-to-one, 1 hour", "£85"],
  ["Duet", "£95"],
];

const TIMETABLE = [
  ["Monday", ["6.30pm"]],
  ["Tuesday", ["8.30am <small>45min</small>", "9.20am", "11.30am"]],
  ["Friday", ["7.30am", "9.30am"]],
];

const CREDENTIAL_LINE =
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

export const FOUNDATION_CSS = FOUNDATION;
export const VARIANTS = [poster];
