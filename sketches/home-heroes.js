/* Home hero options — markup only, no side effects.

   Six treatments of the same brief, prompted by the Tillett & Saunders
   reference the client sent: a photographic, full-bleed hero with the header
   sitting on top of it, rather than today's white split with the X-ray.

   Copy is identical in all six on purpose. The only variable being judged is
   the layout, so anything that changes between options is a design decision,
   not a wording one.

   Photography is placeholder stock already in the repo — every one of these
   gets reshot with Natasha's own images before it ships. */

const EYEBROW = "Sports Therapy &amp; Clinical Pilates";

/* Two lines, second one italic — the reference's "Crafting Exceptional /
   Spaces" move, said in NJH's own voice. */
const H1 = `Move freely,<br /><em>recover fully.</em>`;

const INTRO =
  "Hands-on treatment and precise movement with Natasha Hadland, one-to-one in Studham &mdash; so you get back to what you were doing before.";

const PHOTOS = {
  mat: "/images/pilates-mat-stretch.jpg",
  light: "/images/pilates-stretch-light.jpg",
  guidance: "/images/pilates-guidance.jpg",
  reformer: "/images/pilates.jpg",
  clinic: "/images/sports-therapy.jpg",
};

const arrow = `<svg viewBox="0 0 20 12" aria-hidden="true" focusable="false"><path d="M0 6h17M12.5 1 18 6l-5.5 5" /></svg>`;

function cta(light = false) {
  return `<div class="hh-actions">
    <a class="hh-btn hh-btn--solid" href="/contact">Book a session ${arrow}</a>
    <a class="hh-btn ${light ? "hh-btn--outline-dark" : "hh-btn--outline"}" href="#pilates">Explore Pilates</a>
  </div>`;
}

const scroll = (mod = "") => `<div class="hh-scroll ${mod}" aria-hidden="true">
  <span>Scroll</span><i></i>
</div>`;

function photo(src, cls = "hh-photo") {
  return `<img class="${cls}" src="${src}" alt="" width="1400" height="933" />`;
}

/* ------------------------------------------------------------- A · Cinematic

   The reference, translated. Full-bleed photograph, weighted scrim from the
   left so the type always has something to sit on, header floating over it.
   The safest of the six and the one that reads closest to what was sent. */
export const cinematic = {
  id: "a",
  name: "A · Cinematic full-bleed",
  dark: true,
  build: () => `<section class="hh hh-a">
    <div class="hh-media">${photo(PHOTOS.mat)}<div class="hh-scrim"></div></div>
    <div class="hh-inner">
      <p class="hh-eyebrow"><i></i>${EYEBROW}</p>
      <h1 class="hh-title">${H1}</h1>
      <p class="hh-intro">${INTRO}</p>
      ${cta()}
    </div>
    ${scroll()}
  </section>`,
};

/* ---------------------------------------------------------------- B · Centred

   Same photographic idea, symmetrical. Reads more like a destination than a
   service page — quieter, more premium, and it gives the headline the full
   width instead of half of it. Weakest for scanning: the eye has no edge to
   run down. */
export const centred = {
  id: "b",
  name: "B · Centred editorial",
  dark: true,
  build: () => `<section class="hh hh-b">
    <div class="hh-media">${photo(PHOTOS.light)}<div class="hh-scrim"></div></div>
    <div class="hh-inner">
      <p class="hh-eyebrow hh-eyebrow--rules"><i></i>${EYEBROW}<i></i></p>
      <h1 class="hh-title">${H1}</h1>
      <p class="hh-intro">${INTRO}</p>
      ${cta()}
    </div>
    ${scroll()}
  </section>`,
};

/* ------------------------------------------------------------------ C · Split

   Keeps the white brand surface — type on paper, photograph as a full-height
   panel beside it. The header stays opaque, so nothing about the rest of the
   site has to change. Closest in spirit to what is there now, but with a real
   photograph doing the work the X-ray does today. */
export const split = {
  id: "c",
  name: "C · Split — paper + panel",
  dark: false,
  build: () => `<section class="hh hh-c">
    <div class="hh-c__text">
      <p class="hh-eyebrow hh-eyebrow--ink"><i></i>${EYEBROW}</p>
      <h1 class="hh-title">${H1}</h1>
      <p class="hh-intro">${INTRO}</p>
      ${cta(true)}
    </div>
    <div class="hh-c__media">${photo(PHOTOS.guidance)}</div>
  </section>`,
};

/* ------------------------------------------------------------------ D · Inset

   The photograph as a framed plate rather than a background — held inside the
   page gutters with the type laid over its lower half. Feels considered and
   clinic-like, and it stops the header from ever having to sit on a face. */
export const inset = {
  id: "d",
  name: "D · Inset plate",
  dark: false,
  build: () => `<section class="hh hh-d">
    <div class="hh-d__plate">
      ${photo(PHOTOS.mat)}<div class="hh-scrim"></div>
      <div class="hh-inner">
        <p class="hh-eyebrow"><i></i>${EYEBROW}</p>
        <h1 class="hh-title">${H1}</h1>
        <p class="hh-intro">${INTRO}</p>
        ${cta()}
      </div>
      ${scroll("hh-scroll--inset")}
    </div>
  </section>`,
};

/* ------------------------------------------------------------------- E · Card

   Full-bleed photograph, but the words live on a white card that overlaps it.
   Highest contrast of the six and the least dependent on which photograph
   ends up here — a busy or badly lit image cannot hurt the copy. */
export const card = {
  id: "e",
  name: "E · Overlapping card",
  dark: false,
  build: () => `<section class="hh hh-e">
    <div class="hh-media">${photo(PHOTOS.light)}<div class="hh-scrim"></div></div>
    <div class="hh-e__card">
      <p class="hh-eyebrow hh-eyebrow--ink"><i></i>${EYEBROW}</p>
      <h1 class="hh-title">${H1}</h1>
      <p class="hh-intro">${INTRO}</p>
      ${cta(true)}
    </div>
    ${scroll()}
  </section>`,
};

/* --------------------------------------------------------------- F · Duotone

   The photograph pushed through the brand indigo, so any stock frame lands in
   the palette instead of fighting it — useful while the real shoot is
   outstanding. Carries the credentials strip along the bottom edge, which is
   the one piece of proof currently three screens down the page. */
export const duotone = {
  id: "f",
  name: "F · Brand duotone + proof strip",
  dark: true,
  build: () => `<section class="hh hh-f">
    <div class="hh-media">
      ${photo(PHOTOS.reformer)}
      <div class="hh-f__tint"></div>
      <div class="hh-scrim"></div>
    </div>
    <div class="hh-inner">
      <p class="hh-eyebrow"><i></i>${EYEBROW}</p>
      <h1 class="hh-title">${H1}</h1>
      <p class="hh-intro">${INTRO}</p>
      ${cta()}
    </div>
    <ul class="hh-f__proof">
      <li>Certified STOTT Pilates Instructor</li>
      <li>LSSM Soft Tissue Therapist</li>
      <li>BTEC L5 Clinical Soft Tissue Therapy</li>
    </ul>
    ${scroll("hh-scroll--corner")}
  </section>`,
};

export const HOME_HEROES = [cinematic, centred, split, inset, card, duotone];
