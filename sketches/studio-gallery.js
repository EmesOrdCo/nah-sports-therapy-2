/* /studio as a gallery page — four arrangements, markup only.

   The brief: the page's subject is a room, so the room should be the page.
   Everything below the video hero is currently three paragraphs and a
   four-photo carousel that hides three of its four photographs behind a
   click. These four options all replace that.

   A hard constraint runs through every one of them. There are four studio
   photographs in the repo and they are the same empty room shot from four
   near-identical positions — same floor, same framed print, same gym balls,
   the camera moved a few feet between frames. (natasha-treatment.webp is not
   the studio at all; it is an outdoor charity event.) So a gallery here has
   perhaps three distinguishable views to work with, not a dozen.

   That is why none of these is a contact-sheet grid. Three of the four are
   built to make few pictures feel deliberate rather than thin; the fourth
   (C) is deliberately built for a shoot that has not happened, so the
   difference between "what we can ship now" and "what a morning with a
   photographer buys" is visible side by side rather than argued about.

   Copy is identical in all four. The only variable being judged is the
   arrangement. */

const PLATES = [
  {
    src: "/images/legacy/pilates-studio-main.jpg",
    alt: "The Studham studio looking towards the window",
    title: "The room",
    note: "Sprung wooden floor, north light, nothing in the middle of it.",
  },
  {
    src: "/images/legacy/pilates-studio-3.jpg",
    alt: "The studio's far wall and window",
    title: "Room to move",
    note: "Laid out for one person at a time, or a group of four.",
  },
  {
    src: "/images/legacy/pilates-studio-4.jpg",
    alt: "Treatment couch and mats in the studio",
    title: "Where treatment happens",
    note: "The couch for Sports Therapy, the mats for Pilates, one room.",
  },
  {
    src: "/images/legacy/pilates-studio-1.jpg",
    alt: "The entrance side of the studio",
    title: "The way in",
    note: "Private, and never shared with another appointment.",
  },
];

const EYEBROW = "Studham studio";
const H1 = "The NJH clinic in Studham.";
const LEDE =
  "Professional, personal Sports Therapy and Pilates care from one private studio in Studham, near Whipsnade.";

const INTRO_TITLE = "One room, since 2016.";
const INTRO_BODY =
  "After years working in physio clinics, January 2016 saw the launch of the NJH Sports Therapy and Pilates Studio &mdash; a tranquil, light and airy space to switch off and focus on you.";

/* The hero. It was "minus the <video>" while the page still opened on the
   stock loop; the slot is a photograph now, so this is simply it. */
function hero() {
  return `<section class="clinics-hero" aria-labelledby="sg-title">
    <div class="clinics-hero__media" aria-hidden="true">
      <img class="clinics-hero__still" src="/images/studio-hero-1600.webp" alt="" width="1600" height="1248" />
      <div class="clinics-hero__scrim"></div>
    </div>
    <div class="clinics-hero__inner">
      <p class="clinics-hero__eyebrow"><i aria-hidden="true"></i>${EYEBROW}</p>
      <h1 id="sg-title">${H1}</h1>
      <div class="clinics-hero__footer">
        <p>${LEDE}</p>
        <a class="pilates-arrow-link" href="https://wa.me/message/MDDF72Z4L7GFF1">Appointments &middot; WhatsApp <span>&#8599;</span></a>
      </div>
    </div>
  </section>`;
}

/* Every option closes on the same block. The page currently ends on the
   carousel with no way to act on any of it, which is the single clearest
   fault in what is there now — so no option is allowed to repeat it. */
function foot() {
  return `<section class="sg-foot">
    <div class="sg-foot__shell">
      <div class="sg-foot__col">
        <p class="sg-label">Finding it</p>
        <p>Studham, near Whipsnade. Full directions are sent when your appointment is confirmed.</p>
      </div>
      <div class="sg-foot__col">
        <p class="sg-label">In the studio</p>
        <p>Sports Therapy from &pound;60. Individual and small-group Pilates, Monday to Friday.</p>
      </div>
      <div class="sg-foot__col sg-foot__col--act">
        <p class="sg-label">Book</p>
        <a class="sg-cta" href="https://wa.me/message/MDDF72Z4L7GFF1">Message on WhatsApp</a>
        <a class="sg-textlink" href="/contact">Send an enquiry <span>&#8594;</span></a>
      </div>
    </div>
  </section>`;
}

function intro(mod = "") {
  return `<section class="sg-intro ${mod}">
    <div class="sg-intro__shell">
      <h2>${INTRO_TITLE}</h2>
      <p>${INTRO_BODY}</p>
    </div>
  </section>`;
}

const num = (i) => String(i + 1).padStart(2, "0");

/* --------------------------------------------------------------- A · Plates

   The gallery-wall reading. Each photograph is hung — generous white all
   round it, a number and a caption beneath, a hairline between plates. It is
   the option that most obviously survives having only four pictures, because
   white space is doing as much work as the images and four plates at this
   size is a full page.

   The alternating indent is the only rhythm; nothing crops, nothing bleeds. */
const A = {
  id: "a",
  name: "Plates",
  build: () => `${hero()}${intro()}
  <section class="sg-plates">
    ${PLATES.map(
      (p, i) => `<figure class="sg-plate ${i % 2 ? "sg-plate--right" : ""}">
      <img src="${p.src}" alt="${p.alt}" width="1600" height="1200" />
      <figcaption>
        <span class="sg-num">${num(i)}</span>
        <span class="sg-plate__title">${p.title}</span>
        <span class="sg-plate__note">${p.note}</span>
      </figcaption>
    </figure>`,
    ).join("\n    ")}
  </section>${foot()}`,
};

/* ------------------------------------------------------- B · Full-bleed sequence

   The hero's own register, carried down the page. Each photograph runs edge
   to edge at a fixed band height, the caption sits inside the frame on a
   scrim, and the side alternates so the eye is walked left-right-left.

   The one that reads most like the video. Also the one that flatters these
   particular photographs least: full-bleed means a hard crop, and four shots
   of one room, cropped to a band, start to look like the same shot. */
const B = {
  id: "b",
  name: "Full-bleed sequence",
  build: () => `${hero()}${intro("sg-intro--tight")}
  <section class="sg-bleed">
    ${PLATES.map(
      (p, i) => `<figure class="sg-band ${i % 2 ? "sg-band--right" : ""}">
      <img src="${p.src}" alt="${p.alt}" width="1600" height="1200" />
      <figcaption>
        <span class="sg-num">${num(i)}</span>
        <span class="sg-band__title">${p.title}</span>
        <span class="sg-band__note">${p.note}</span>
      </figcaption>
    </figure>`,
    ).join("\n    ")}
  </section>${foot()}`,
};

/* ------------------------------------------------------------ C · Lead and grid

   Built for photographs that do not exist yet. One large lead image, then a
   two-up, then a three-up of details — the arrangement every architecture
   practice uses, and it needs six distinct frames to work: a wide, a couple
   of mid shots, and three close details (the couch, the reformer straps,
   light on the floor).

   Shown here with what is in the repo, which is why it repeats. That
   repetition is the point of including it: this is the option a morning with
   a photographer unlocks, and the capture shows exactly what it costs to
   choose it before then. */
const C = {
  id: "c",
  name: "Lead and grid",
  build: () => `${hero()}${intro()}
  <section class="sg-grid">
    <figure class="sg-grid__lead">
      <img src="${PLATES[0].src}" alt="${PLATES[0].alt}" width="1600" height="1200" />
      <figcaption><span class="sg-num">01</span>${PLATES[0].title}</figcaption>
    </figure>
    <div class="sg-grid__pair">
      ${[1, 2]
        .map(
          (n, i) => `<figure>
        <img src="${PLATES[n].src}" alt="${PLATES[n].alt}" width="1600" height="1200" />
        <figcaption><span class="sg-num">${num(i + 1)}</span>${PLATES[n].title}</figcaption>
      </figure>`,
        )
        .join("\n      ")}
    </div>
    <div class="sg-grid__trio">
      ${[3, 0, 1]
        .map(
          (n, i) => `<figure>
        <img src="${PLATES[n].src}" alt="${PLATES[n].alt}" width="1600" height="1200" />
        <figcaption><span class="sg-num">${num(i + 3)}</span>${PLATES[n].title}</figcaption>
      </figure>`,
        )
        .join("\n      ")}
    </div>
  </section>${foot()}`,
};

/* ------------------------------------------------------- D · Sticky index

   A left column that stays put while the photographs scroll past it on the
   right. The column carries the numbered index of what you are looking at,
   so the captions never have to interrupt the pictures.

   Handles a short gallery better than any of the others — the index makes
   four plates feel like a considered set rather than all there was — and it
   is the only one with somewhere obvious to put more later. Costs the most
   to build, and the two columns have to become one on a phone. */
const D = {
  id: "d",
  name: "Sticky index",
  build: () => `${hero()}
  <section class="sg-index">
    <div class="sg-index__rail">
      <div class="sg-index__sticky">
        <h2>${INTRO_TITLE}</h2>
        <p class="sg-index__body">${INTRO_BODY}</p>
        <ol class="sg-index__list">
          ${PLATES.map(
            (p, i) =>
              `<li${i === 0 ? ' class="is-current"' : ""}><span class="sg-num">${num(i)}</span>${p.title}</li>`,
          ).join("\n          ")}
        </ol>
      </div>
    </div>
    <div class="sg-index__stream">
      ${PLATES.map(
        (p) => `<figure>
        <img src="${p.src}" alt="${p.alt}" width="1600" height="1200" />
        <figcaption>${p.note}</figcaption>
      </figure>`,
      ).join("\n      ")}
    </div>
  </section>${foot()}`,
};

export const STUDIO_GALLERIES = [A, B, C, D];
