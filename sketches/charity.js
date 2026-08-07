/* Charity-section redesign sketches — markup only, no side effects.

   Same shape as prices.js / heroes.js: each entry builds the tail of the
   preceding white studio section, the charity section itself, and nothing
   else — the builder adds the real navy footer underneath, because the
   navy-on-navy stack with the footer is half of why the current section
   reads as an afterthought.

   Design only. The copy is frozen: same heading, same two paragraphs, same
   call to action, in the same order. No variant adds, cuts or rewords a
   single line. */

const COPY = {
  heading: "Charity work",
  lead: "NJH Sports Therapy &amp; Pilates is keen to help raise money for charities in the area. Where possible, Natasha donates a Pilates 1:1 or duet voucher as a silent auction or raffle prize.",
  tail: "Please contact Natasha if you would like to discuss this further.",
  cta: "Get in touch",
};

/* The last few inches of the studio section, so every capture shows the
   handover from the white band above rather than a section floating alone. */
const preceding = () => `<section class="sk-prev">
  <div class="section-shell">
    <h3 class="sk-prev__label">Inside the studio</h3>
    <div class="sk-prev__frame"></div>
    <div class="sk-prev__meta">
      <span>01<i>/</i>04</span>
      <span>Light, private and considered</span>
    </div>
  </div>
</section>`;

/* The orbit motif from .pilates-orbit, drawn as a contained figure rather
   than bled off a corner. Deliberately off-centre and cut by one diagonal:
   concentric-with-crosshairs reads as a target, which is the wrong note
   entirely for this section. */
const rings = (className) => `<div class="${className}" aria-hidden="true">
  <svg viewBox="0 0 400 400" role="presentation" focusable="false">
    <circle cx="200" cy="200" r="196" />
    <circle cx="214" cy="188" r="150" />
    <circle cx="232" cy="172" r="98" />
    <ellipse cx="200" cy="212" rx="212" ry="46" />
    <line x1="46" y1="308" x2="356" y2="94" />
  </svg>
</div>`;

const VARIANTS = [
  /* ---------------------------------------------------------------
     Baseline — exactly what is on the site today, captured so the
     directions are judged against it rather than from memory.
     --------------------------------------------------------------- */
  {
    id: "current",
    name: "Current — live section",
    dark: true,
    build: () => `${preceding()}
    <section class="clinics-charity" id="charity" aria-labelledby="charity-title">
      <div class="pilates-orbit clinics-charity__orbit" aria-hidden="true"><span></span><i></i></div>
      <div class="section-shell clinics-charity__grid">
        <div><h2 id="charity-title">${COPY.heading}</h2></div>
        <div>
          <p>${COPY.lead}</p>
          <p>${COPY.tail}</p>
          <a class="button-link" href="/contact">${COPY.cta} <span>↗</span></a>
        </div>
      </div>
    </section>`,
  },

  /* ---------------------------------------------------------------
     A — Centred notice. One axis, ring halo centred behind the type.
     The current grid strands the heading alone in a wide left column
     with align-items:end; centring makes the same words read as a
     deliberate closing statement.
     --------------------------------------------------------------- */
  {
    id: "a",
    name: "A · Centred notice",
    dark: true,
    build: () => `${preceding()}
    <section class="ch-a" id="charity" aria-labelledby="charity-title">
      ${rings("ch-a__rings")}
      <div class="section-shell ch-a__inner">
        <span class="ch-a__rule" aria-hidden="true"></span>
        <h2 id="charity-title">${COPY.heading}</h2>
        <p class="ch-a__lead">${COPY.lead}</p>
        <p class="ch-a__tail">${COPY.tail}</p>
        <a class="button-link" href="/contact">${COPY.cta} <span>↗</span></a>
      </div>
    </section>`,
  },

  /* ---------------------------------------------------------------
     B — Statement. The first paragraph carries the section at display
     scale in the serif; the heading steps down to a label beside it.
     Weight without a word added.
     --------------------------------------------------------------- */
  {
    id: "b",
    name: "B · Statement",
    dark: true,
    build: () => `${preceding()}
    <section class="ch-b" id="charity" aria-labelledby="charity-title">
      <div class="section-shell ch-b__inner">
        <div class="ch-b__head">
          <h2 id="charity-title">${COPY.heading}</h2>
        </div>
        <p class="ch-b__lead">${COPY.lead}</p>
        <div class="ch-b__foot">
          <p>${COPY.tail}</p>
          <a class="button-link" href="/contact">${COPY.cta} <span>↗</span></a>
        </div>
      </div>
    </section>`,
  },

  /* ---------------------------------------------------------------
     C — Inset panel on white. Comes off the navy entirely, so it no
     longer merges into the footer, and is contained as a panel so it
     reads as a considered aside rather than a leftover band.
     --------------------------------------------------------------- */
  {
    id: "c",
    name: "C · Inset panel, white",
    dark: false,
    build: () => `${preceding()}
    <section class="ch-c" id="charity" aria-labelledby="charity-title">
      <div class="section-shell">
        <div class="ch-c__panel">
          <div class="ch-c__head">
            <h2 id="charity-title">${COPY.heading}</h2>
          </div>
          <div class="ch-c__body">
            <p class="ch-c__lead">${COPY.lead}</p>
            <p class="ch-c__tail">${COPY.tail}</p>
            <a class="pilates-arrow-link" href="/contact">${COPY.cta} <span>↗</span></a>
          </div>
        </div>
      </div>
    </section>`,
  },

  /* ---------------------------------------------------------------
     D — Figure and column. Keeps the two-column idea but gives the
     second column something to hold: the ring geometry drawn as a
     contained figure, sized and aligned, instead of a graphic falling
     off the bottom-right corner.
     --------------------------------------------------------------- */
  {
    id: "d",
    name: "D · Figure and column",
    dark: true,
    build: () => `${preceding()}
    <section class="ch-d" id="charity" aria-labelledby="charity-title">
      <div class="section-shell ch-d__grid">
        <div class="ch-d__content">
          <h2 id="charity-title">${COPY.heading}</h2>
          <p class="ch-d__lead">${COPY.lead}</p>
          <p class="ch-d__tail">${COPY.tail}</p>
          <a class="button-link" href="/contact">${COPY.cta} <span>↗</span></a>
        </div>
        <figure class="ch-d__figure">${rings("ch-d__rings")}</figure>
      </div>
    </section>`,
  },

  /* ---------------------------------------------------------------
     E — Closing ledger. A low ruled band on white: label, copy, action,
     divided by hairlines. Smallest footprint of the six, and the one
     that most clearly says "closing note" rather than "section".
     --------------------------------------------------------------- */
  {
    id: "e",
    name: "E · Closing ledger, white",
    dark: false,
    build: () => `${preceding()}
    <section class="ch-e" id="charity" aria-labelledby="charity-title">
      <div class="section-shell ch-e__grid">
        <h2 id="charity-title">${COPY.heading}</h2>
        <div class="ch-e__body">
          <p class="ch-e__lead">${COPY.lead}</p>
          <p class="ch-e__tail">${COPY.tail}</p>
        </div>
        <a class="pilates-arrow-link ch-e__cta" href="/contact">${COPY.cta} <span>↗</span></a>
      </div>
    </section>`,
  },

  /* ---------------------------------------------------------------
     F — Display heading. "Charity work" set at the scale the heroes use,
     across the top, with the copy stepped in beneath it. Stacked rather
     than side by side: two columns at this type size leave a dead corner
     wherever the shorter one ends.
     --------------------------------------------------------------- */
  {
    id: "f",
    name: "F · Display heading",
    dark: true,
    build: () => `${preceding()}
    <section class="ch-f" id="charity" aria-labelledby="charity-title">
      <div class="section-shell ch-f__inner">
        <h2 id="charity-title">Charity <em>work</em></h2>
        <div class="ch-f__body">
          <p class="ch-f__lead">${COPY.lead}</p>
          <div class="ch-f__foot">
            <p class="ch-f__tail">${COPY.tail}</p>
            <a class="button-link" href="/contact">${COPY.cta} <span>↗</span></a>
          </div>
        </div>
      </div>
    </section>`,
  },
];

export { VARIANTS, COPY };
