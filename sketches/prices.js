/* Prices redesign sketches — markup only, no side effects.

   Same shape as heroes.js / variants.js: each entry builds a full page body
   (hero + sections) so a capture reads as a real page rather than a component.
   No CSS imports and no DOM wiring here, so the static exporter can use these
   builders directly. */

/* One canonical fee set. Every variant reorganises these; none invents a
   number or changes one. Copy in `note` is new supporting text, written to fit
   the direction — it is a sketch, not a content decision. */
const SPORTS = [
  {
    length: "Up to 90 minutes",
    mins: "90",
    price: "£130",
    note: "A new or more involved presentation, with time for full assessment.",
    short: "New or complex presentations",
  },
  {
    length: "Standard session, up to 1 hour",
    mins: "60",
    price: "£85",
    note: "The usual appointment — assessment, treatment and what to do next.",
    short: "The usual appointment",
  },
  {
    length: "Up to 30 minutes",
    mins: "30",
    price: "£60",
    note: "A focused follow-up where a shorter session is enough.",
    short: "Focused follow-up",
  },
];

const PILATES = [
  {
    length: "One-to-one, 1 hour",
    price: "£85",
    note: "Built entirely around your posture, goals and history.",
    short: "Individual",
  },
  {
    length: "Duet, shared with a friend or partner",
    price: "£95",
    note: "Two people, one teacher — the fee is for the session.",
    short: "Two people",
  },
  {
    length: "Initial assessment before small group",
    price: "£85",
    note: "A one-to-one hour before your first class.",
    short: "Before your first class",
  },
  {
    length: "Small-group session",
    price: "£22",
    note: "Attentive classes, paid in termly blocks.",
    short: "Per class, termly block",
  },
];

const SURCHARGE =
  "Sunday and Bank Holiday appointments carry a £10 surcharge.";
const BLOCKS =
  "Small-group classes are paid in termly blocks and are non-refundable once your place is reserved.";

const DURATION_COPY = `<p>Most appointments last approximately one hour. A 30-minute session may be recommended where appropriate, while a new or more complex presentation may benefit from up to 90 minutes.</p>
  <p>The recommended duration is discussed before booking. Treatment may occasionally finish earlier to avoid over-treatment.</p>`;

/* ---- Shared page furniture ---- */

const hero = ({ title, intro, dark = false, kicker = "Prices" }) => `
<section class="page-hero sk-hero${dark ? " page-hero--dark" : ""}">
  ${dark ? "" : '<div class="page-hero__visual" aria-hidden="true"><span></span><span></span><span></span><i></i></div>'}
  <div class="section-shell page-hero__inner">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${kicker}</span></nav>
    <h1>${title}</h1>
    <p class="page-hero__intro">${intro}</p>
  </div>
</section>`;

const closer = (
  title = "Not sure which appointment you need?",
) => `<section class="sk-closer"><div class="section-shell sk-closer__inner">
  <h2>${title}</h2>
  <div><p>Describe what you would like help with and Natasha will guide you to the most suitable first appointment — and tell you the fee before you book.</p>
  <a class="sk-button" href="/contact">Send an enquiry <span aria-hidden="true">↗</span></a></div>
</div></section>`;

const duration = (dark = false) => `<section class="sk-duration${dark ? " sk-duration--dark" : ""}"><div class="section-shell sk-duration__grid">
  <h2>Enough time for the work required.</h2>
  <div class="sk-prose">${DURATION_COPY}</div>
</div></section>`;

/* ---- A. Ledger ----------------------------------------------------------
   No cards. A full-width editorial list: marginal heading, hairline rows,
   fees set in the display serif. The quietest, most confident reading of a
   price list — closest to a printed bill of fare. */

const ledgerGroup = (n, name, aside, rows, foot) => `
  <div class="sk-ledger__group">
    <div class="sk-ledger__aside">
      <p class="sk-kicker">${n} — ${name}</p>
      <h2>${aside.title}</h2>
      <p>${aside.copy}</p>
    </div>
    <div class="sk-ledger__rows">
      ${rows
        .map(
          (r) => `<div class="sk-row">
        <span class="sk-row__label">${r.length}<em>${r.note}</em></span>
        <span class="sk-row__fee">${r.price}</span>
      </div>`,
        )
        .join("")}
      <p class="sk-foot">${foot}</p>
    </div>
  </div>`;

const ledger = () => `<section class="sk-ledger"><div class="section-shell">
  ${ledgerGroup(
    "01",
    "Treatment",
    {
      title: "Sports Therapy",
      copy: "Length is chosen around the presentation, and agreed before you book.",
    },
    SPORTS,
    SURCHARGE,
  )}
  ${ledgerGroup(
    "02",
    "Movement",
    {
      title: "Pilates",
      copy: "Individual, duet or small group — every route starts with a one-to-one.",
    },
    PILATES,
    BLOCKS,
  )}
</div></section>`;

/* ---- B. Duration spine --------------------------------------------------
   Reorganised around the question people actually arrive with: how long do I
   need? Time is the spine; the fee hangs off it. Pilates follows as formats,
   because there the variable is who is in the room, not the clock. */

const spine = () => `<section class="sk-spine"><div class="section-shell">
  <header class="sk-head"><p class="sk-kicker">Sports Therapy</p><h2>Priced by the time it takes.</h2>
    <p class="sk-lead">The right length is a clinical decision, not an upsell. Here is what each one is for.</p></header>
  <ol class="sk-spine__list">
    ${SPORTS.slice()
      .reverse()
      .map(
        (r) => `<li>
      <div class="sk-spine__mark"><b>${r.mins}</b><i>min</i></div>
      <div class="sk-spine__body"><h3>${r.short}</h3><p>${r.note}</p></div>
      <div class="sk-spine__fee">${r.price}</div>
    </li>`,
      )
      .join("")}
  </ol>
  <p class="sk-foot sk-foot--wide">${SURCHARGE}</p>

  <header class="sk-head sk-head--second"><p class="sk-kicker">Pilates</p><h2>Priced by who is in the room.</h2></header>
  <ul class="sk-spine__formats">
    ${PILATES.map(
      (r) => `<li><span class="sk-format__name">${r.length}</span><span class="sk-format__fee">${r.price}</span></li>`,
    ).join("")}
  </ul>
  <p class="sk-foot sk-foot--wide">${BLOCKS}</p>
</div></section>`;

/* ---- C. Chooser ---------------------------------------------------------
   Two questions resolve to one number. Removes the comparison table entirely:
   you never see a fee that is not yours. Wired here so the exported file is
   genuinely clickable, not just a picture of an interface. */

const chooser = () => {
  /* `pill` is the short form on the button; `label` is the full appointment
     name in the result panel — using one string for both made the panel read
     as a stutter against the note underneath. */
  const options = JSON.stringify({
    st: SPORTS.map((r) => ({ pill: `${r.mins} min`, label: r.length, price: r.price, note: r.note })),
    pil: PILATES.map((r) => ({ pill: r.short, label: r.length, price: r.price, note: r.note })),
  });
  return `<section class="sk-chooser"><div class="section-shell sk-chooser__grid">
  <div class="sk-chooser__controls">
    <div class="sk-step">
      <p class="sk-kicker">Step one</p><h3>What are you booking?</h3>
      <div class="sk-pills" data-group="service">
        <button type="button" class="sk-pill is-on" data-v="st">Sports Therapy</button>
        <button type="button" class="sk-pill" data-v="pil">Pilates</button>
      </div>
    </div>
    <div class="sk-step">
      <p class="sk-kicker">Step two</p><h3 data-q>How long do you need?</h3>
      <div class="sk-pills sk-pills--wrap" data-group="option"></div>
    </div>
    <p class="sk-foot" data-foot>${SURCHARGE}</p>
  </div>
  <aside class="sk-result">
    <p class="sk-kicker">Your appointment</p>
    <p class="sk-result__label" data-label>Standard session, up to 1 hour</p>
    <p class="sk-result__fee" data-fee>£85</p>
    <p class="sk-result__note" data-note>The usual appointment — assessment, treatment and what to do next.</p>
    <a class="sk-button" href="/contact">Book this appointment <span aria-hidden="true">↗</span></a>
  </aside>
</div>
<script>
(function(){
  var DATA = ${options};
  var FOOT = { st: ${JSON.stringify(SURCHARGE)}, pil: ${JSON.stringify(BLOCKS)} };
  var QUESTION = { st: "How long do you need?", pil: "Which format?" };
  var root = document.currentScript.closest("section");
  var optionBar = root.querySelector('[data-group="option"]');
  var service = "st", index = 1;
  function paint(){
    var set = DATA[service];
    optionBar.innerHTML = set.map(function(o,i){
      return '<button type="button" class="sk-pill' + (i===index?' is-on':'') + '" data-i="'+i+'">'+o.pill+'</button>';
    }).join("");
    var o = set[index];
    root.querySelector("[data-label]").textContent = o.label;
    root.querySelector("[data-fee]").textContent = o.price;
    root.querySelector("[data-note]").textContent = o.note;
    root.querySelector("[data-foot]").textContent = FOOT[service];
    root.querySelector("[data-q]").textContent = QUESTION[service];
  }
  root.querySelector('[data-group="service"]').addEventListener("click", function(e){
    var b = e.target.closest("button"); if(!b) return;
    service = b.dataset.v; index = service === "st" ? 1 : 0;
    this.querySelectorAll("button").forEach(function(x){ x.classList.toggle("is-on", x===b); });
    paint();
  });
  optionBar.addEventListener("click", function(e){
    var b = e.target.closest("button"); if(!b) return;
    index = +b.dataset.i; paint();
  });
  paint();
})();
</script>
</section>`;
};

/* ---- D. Night -----------------------------------------------------------
   Inverts the page. Fees become a statement set in periwinkle on navy, with
   the mark's ring geometry drawn behind. The site already owns this palette
   in its dark bands; this is the one page that uses it wall to wall. */

const nightColumn = (title, rows, foot) => `
  <div class="sk-night__col">
    <h2>${title}</h2>
    ${rows
      .map(
        (r) => `<div class="sk-night__row"><span>${r.length}</span><strong>${r.price}</strong></div>`,
      )
      .join("")}
    <p class="sk-foot">${foot}</p>
  </div>`;

const night = () => `<section class="sk-night">
  <svg class="sk-night__rings" viewBox="0 0 900 900" aria-hidden="true" fill="none">
    <circle cx="450" cy="450" r="430" stroke="currentColor" stroke-width="1"/>
    <circle cx="450" cy="450" r="330" stroke="currentColor" stroke-width="1"/>
    <circle cx="450" cy="450" r="215" stroke="currentColor" stroke-width="1"/>
    <circle cx="450" cy="450" r="96" stroke="currentColor" stroke-width="1"/>
    <path d="M20 450H880M450 20V880" stroke="currentColor" stroke-width="1"/>
  </svg>
  <div class="section-shell sk-night__grid">
    ${nightColumn("Sports Therapy", SPORTS, SURCHARGE)}
    ${nightColumn("Pilates", PILATES, BLOCKS)}
  </div>
</section>`;

/* ---- E. Leader dots -----------------------------------------------------
   An index, not a table. Dot leaders carry the eye from name to fee, numerals
   set large in the serif. Traditional typographic device, unusual on a
   clinic site — reads as considered rather than transactional. */

const dotsGroup = (title, rows, foot) => `
  <div class="sk-dots__group">
    <h2>${title}</h2>
    ${rows
      .map(
        (r) => `<p class="sk-dot"><span class="sk-dot__name">${r.length}</span><span class="sk-dot__lead" aria-hidden="true"></span><span class="sk-dot__fee">${r.price}</span></p>`,
      )
      .join("")}
    <p class="sk-foot">${foot}</p>
  </div>`;

const dots = () => `<section class="sk-dots"><div class="section-shell sk-dots__inner">
  ${dotsGroup("Sports Therapy", SPORTS, SURCHARGE)}
  ${dotsGroup("Pilates", PILATES, BLOCKS)}
</div></section>`;

/* ---- F. Ring badges -----------------------------------------------------
   Takes the concentric-ring motif out of the hero and makes it the layout.
   Each fee sits inside its own drawn circle, so the page is graphic before it
   is textual — the only direction here that would be recognisable at a
   glance from across a room. */

const ringSet = (title, rows, foot, cols) => `
  <div class="sk-rings__set">
    <header class="sk-head"><h2>${title}</h2></header>
    <div class="sk-rings__grid" style="--cols:${cols}">
      ${rows
        .map(
          (r) => `<figure class="sk-ring">
        <span class="sk-ring__cap">${r.short}</span>
        <strong>${r.price}</strong>
        <figcaption>${r.length}</figcaption>
      </figure>`,
        )
        .join("")}
    </div>
    <p class="sk-foot sk-foot--wide">${foot}</p>
  </div>`;

const rings = () => `<section class="sk-rings"><div class="section-shell">
  ${ringSet("Sports Therapy", SPORTS, SURCHARGE, 3)}
  ${ringSet("Pilates", PILATES, BLOCKS, 4)}
</div></section>`;

/* ---- G. Prose and margin ------------------------------------------------
   Refuses the price-list form. The page is an explanation set to a comfortable
   measure, with the fee hung in the margin beside the paragraph that earns it.
   Aimed at someone hesitating over cost rather than comparing options. */

const marginRow = (heading, body, price, sub) => `
  <div class="sk-margin__row">
    <div class="sk-margin__text"><h3>${heading}</h3><p>${body}</p></div>
    <div class="sk-margin__fee"><strong>${price}</strong><span>${sub}</span></div>
  </div>`;

const marginal = () => `<section class="sk-margin"><div class="section-shell sk-margin__inner">
  <header class="sk-head"><p class="sk-kicker">Sports Therapy</p></header>
  ${marginRow(
    "A new or complex presentation",
    "Where the picture is not yet clear, ninety minutes gives room for a full history, a proper assessment and treatment in the same visit, rather than splitting them across two appointments.",
    "£130",
    "up to 90 minutes",
  )}
  ${marginRow(
    "The standard appointment",
    "An hour is what most people need and what most appointments run to: assessment, hands-on treatment, and a clear plan of what to do between now and next time.",
    "£85",
    "up to 1 hour",
  )}
  ${marginRow(
    "A focused follow-up",
    "When the work is already understood and a shorter visit will do it, a thirty-minute session is offered instead. Treatment may finish early to avoid over-treatment.",
    "£60",
    "up to 30 minutes",
  )}
  <p class="sk-foot sk-foot--wide">${SURCHARGE}</p>
  <header class="sk-head sk-head--second"><p class="sk-kicker">Pilates</p></header>
  ${marginRow(
    "One to one, or with someone else",
    "An individual hour is designed entirely around you. A duet shares the hour with a friend or partner — the fee is for the session, not per person.",
    "£85 / £95",
    "individual / duet",
  )}
  ${marginRow(
    "Joining a small group",
    "Every group place begins with a one-to-one assessment, so the class can be adapted to you from the first session. Classes are then paid in termly blocks.",
    "£85 then £22",
    "assessment, then per class",
  )}
  <p class="sk-foot sk-foot--wide">${BLOCKS}</p>
</div></section>`;

/* ---- H. Matrix ----------------------------------------------------------
   Everything on one screen, one alignment, no scrolling between services.
   The plainest option and the fastest to answer "what will this cost me" —
   deliberately unglamorous, in the register of a well-set timetable. */

const matrixRows = (rows, kind) =>
  rows
    .map(
      (r) => `<tr>
    <th scope="row">${r.length}</th>
    <td class="sk-matrix__for">${r.short}</td>
    <td class="sk-matrix__fee">${r.price}</td>
  </tr>`,
    )
    .join("");

const matrix = () => `<section class="sk-matrix"><div class="section-shell">
  <table class="sk-matrix__table">
    <caption class="sk-visually-hidden">NJH appointment fees</caption>
    <thead><tr><th scope="col">Appointment</th><th scope="col">Suited to</th><th scope="col">Fee</th></tr></thead>
    <tbody>
      <tr class="sk-matrix__group"><th colspan="3" scope="colgroup">Sports Therapy</th></tr>
      ${matrixRows(SPORTS)}
      <tr class="sk-matrix__note"><td colspan="3">${SURCHARGE}</td></tr>
      <tr class="sk-matrix__group"><th colspan="3" scope="colgroup">Pilates</th></tr>
      ${matrixRows(PILATES)}
      <tr class="sk-matrix__note"><td colspan="3">${BLOCKS}</td></tr>
    </tbody>
  </table>
</div></section>`;

/* ---- Variant register ---- */

export const VARIANTS = [
  {
    id: "a",
    name: "Ledger",
    note: "Editorial list, no cards. Hairline rows, marginal headings, fees in the display serif.",
    build: () =>
      hero({
        title: "Prices",
        intro:
          "Appointment length is chosen around your needs. New or complex presentations may benefit from more assessment time.",
      }) +
      ledger() +
      duration() +
      closer(),
  },
  {
    id: "b",
    name: "Duration spine",
    note: "Reorganised by time, not service. A vertical scale from 30 to 90 minutes with the fee hung off each mark.",
    build: () =>
      hero({
        title: "How long, and what it costs.",
        intro:
          "The length of your appointment is a clinical decision. This page explains what each length is for, and what it costs.",
      }) +
      spine() +
      closer(),
  },
  {
    id: "c",
    name: "Chooser",
    note: "Two questions resolve to one number. You never see a fee that is not yours. Fully interactive in the exported file.",
    build: () =>
      hero({
        title: "Find your fee in two steps.",
        intro:
          "Tell us what you are booking and how long you need. Everything else stays out of the way.",
      }) +
      chooser() +
      duration() +
      closer(),
  },
  {
    id: "d",
    name: "Night",
    dark: true,
    note: "The page inverted. Periwinkle figures on navy with the mark's ring geometry drawn behind.",
    build: () =>
      hero({
        dark: true,
        title: "Prices",
        intro:
          "Appointment length is chosen around your needs. New or complex presentations may benefit from more assessment time.",
      }) +
      night() +
      /* Dark all the way down — a white band between two navy ones read as a
         gap in the page rather than a change of subject. */
      duration(true) +
      closer(),
  },
  {
    id: "e",
    name: "Leader dots",
    note: "An index rather than a table. Dot leaders carry the eye from appointment to fee.",
    build: () =>
      hero({
        title: "Prices",
        intro:
          "Every appointment length and every class, on one page. The recommended duration is agreed before you book.",
      }) +
      dots() +
      duration() +
      closer(),
  },
  {
    id: "f",
    name: "Ring badges",
    note: "The hero's concentric-ring motif becomes the layout. Graphic before it is textual.",
    build: () =>
      hero({
        title: "Prices",
        intro:
          "Appointment length is chosen around your needs. New or complex presentations may benefit from more assessment time.",
      }) +
      rings() +
      duration() +
      closer(),
  },
  {
    id: "g",
    name: "Prose & margin",
    note: "Not a price list. An explanation set to a reading measure, with fees hung in the margin beside the paragraph that earns them.",
    build: () =>
      hero({
        title: "What an appointment costs, and why.",
        intro:
          "Fees follow the time the work needs. This page explains what each appointment is for before it tells you the number.",
      }) +
      marginal() +
      closer(),
  },
  {
    id: "h",
    name: "Matrix",
    note: "One table, one alignment, everything on a single screen. The fastest possible answer.",
    build: () =>
      hero({
        title: "Prices",
        intro:
          "Every fee on one page. The recommended appointment length is discussed with you before booking.",
      }) +
      matrix() +
      duration() +
      closer(),
  },
];
