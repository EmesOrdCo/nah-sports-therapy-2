/* Six ways to bind the client story on /client-stories.
 *
 * The book that ships today is a good diagram of a book: two cream rectangles,
 * a flat indigo lid, one hairline frame. What it is missing is everything that
 * makes a book read as an OBJECT rather than a shape — thickness, a spine, the
 * squares the boards stand proud by, the wedge of leaf edges under each page,
 * the cylinder the paper makes as it dives into the gutter, and a light source
 * that agrees with itself across all of it.
 *
 * So every direction here is built on the same construction (see book-lab.css)
 * and they differ only in what the book is BOUND IN. The text is Kay's, at its
 * real length, set the way a book sets text — justified, indented, running
 * heads, folios — because half of what says "book" is the typography and not
 * the leather.
 *
 * Run: node sketches/build-book-lab.mjs && node sketches/shoot-book-lab.mjs */

import { FEATURED_REVIEW } from "../src/reviews.js";

const { name, paragraphs } = FEATURED_REVIEW;

/* The same deal the live storyBook() does: everything but the last paragraph
   on the left, the last one plus the signature on the right. */
const SPLIT = Math.max(1, paragraphs.length - 1);
const LEFT = paragraphs.slice(0, SPLIT);
const RIGHT = paragraphs.slice(SPLIT);

const copy = (text, i) =>
  `<p class="bk__copy${i === 0 ? " bk__copy--open" : ""}">${text}</p>`;

/* ---- The construction ----

   One markup for all six. The furniture that only some bindings own — a paper
   label, an elastic strap, sewn signatures, raised spine bands — is passed in
   per variant and dropped into the two slots that need it.

   Layer order is depth order, front to back: the flap (front board + left
   page) sits at z=0, the leaves just behind it, the back board at the far
   face, and the spine is a real panel standing on edge between them. --o is
   the opening, 0 shut and 1 open, exactly as story-book.js writes it. */
export const book = (v, o) => `
<div class="bk bk--${v.id}" style="--o:${o}">
  <div class="bk__floor" aria-hidden="true"></div>
  <div class="bk__book">

    <div class="bk__board bk__board--back" aria-hidden="true"></div>
    <div class="bk__spine" aria-hidden="true">
      ${v.spine === "bands" ? '<span class="bk__band"></span><span class="bk__band"></span><span class="bk__band"></span>' : ""}
      ${v.spine === "sewn" ? '<span class="bk__stitch"></span>' : ""}
      <span class="bk__spine-title">A client&rsquo;s story</span>
      <span class="bk__headband" aria-hidden="true"></span>
      <span class="bk__tailband" aria-hidden="true"></span>
    </div>

    <div class="bk__block bk__block--right" aria-hidden="true"></div>
    <div class="bk__fore" aria-hidden="true"></div>

    <div class="bk__leaf bk__leaf--right">
      <div class="bk__type">
        <p class="bk__running" aria-hidden="true">${name}</p>
        ${RIGHT.map((t) => copy(t, -1)).join("\n        ")}
        <p class="bk__sig">${name}</p>
      </div>
      <span class="bk__folio" aria-hidden="true">ii</span>
      <span class="bk__curve" aria-hidden="true"></span>
    </div>

    <div class="bk__flap">
      <div class="bk__board bk__board--front" aria-hidden="true"></div>
      <div class="bk__cover" aria-hidden="true">
        ${v.cover}
      </div>

      <div class="bk__leaf bk__leaf--left">
        <div class="bk__block bk__block--left" aria-hidden="true"></div>
        <div class="bk__type">
          <p class="bk__running" aria-hidden="true">A client&rsquo;s story</p>
          ${LEFT.map(copy).join("\n        ")}
        </div>
        <span class="bk__folio" aria-hidden="true">i</span>
        <span class="bk__curve" aria-hidden="true"></span>
      </div>
    </div>

    <span class="bk__notch" aria-hidden="true"></span>
    <span class="bk__taildip" aria-hidden="true"></span>
    <span class="bk__ribbon" aria-hidden="true"></span>
    ${v.strap ? '<span class="bk__strap" aria-hidden="true"></span>' : ""}
  </div>
</div>`;

/* ---- What goes on the front board ----

   Three shapes recur, because three shapes is what a bound book actually
   offers: type struck straight into the cloth, type inside a tooled frame, or
   type on a label stuck to the board. */

const stamped = ({ frame = true, rule = true } = {}) => `
  ${frame ? '<span class="bk__tool" aria-hidden="true"></span>' : ""}
  <span class="bk__stamp">
    <span class="bk__stamp-eyebrow">NJH &middot; Sports therapy &amp; Pilates</span>
    <span class="bk__stamp-title">A client&rsquo;s<br />story</span>
    ${rule ? '<span class="bk__stamp-rule"></span>' : ""}
    <span class="bk__stamp-name">${name}</span>
  </span>`;

const labelled = () => `
  <span class="bk__label">
    <span class="bk__label-eyebrow">NJH &middot; Sports therapy &amp; Pilates</span>
    <span class="bk__label-title">A client&rsquo;s story</span>
    <span class="bk__label-rule"></span>
    <span class="bk__label-name">${name}</span>
  </span>`;

export const VARIANTS = [
  {
    id: "a",
    name: "Cloth &amp; gilt",
    note: "Indigo buckram, gold foil, gilded page edges",
    spine: "flat",
    cover: stamped(),
  },
  {
    id: "b",
    name: "Blind-tooled indigo",
    note: "The same binding with nothing metallic on it — every mark pressed into the cloth",
    spine: "flat",
    cover: stamped(),
  },
  {
    id: "c",
    name: "Quarter-bound",
    note: "Cloth spine and corners, linen boards, a printed label",
    spine: "flat",
    cover: labelled(),
  },
  {
    id: "d",
    name: "The notebook",
    note: "Soft covers, sewn signatures, an elastic strap",
    spine: "sewn",
    cover: stamped({ frame: false }),
    strap: true,
  },
  {
    id: "e",
    name: "Modern press",
    note: "No texture, no tooling — one foil rule and the title, large",
    spine: "flat",
    cover: stamped({ frame: false, rule: false }),
  },
  {
    id: "f",
    name: "Half-leather",
    note: "Raised bands on the spine, blind panels, marbled boards",
    spine: "bands",
    cover: stamped(),
  },
];
