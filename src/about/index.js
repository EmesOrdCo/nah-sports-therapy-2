/* About page.

   Five arrangements were built for review (variant-a…variant-e). Dan chose
   E — the interview — so the switcher, the variant map and the other four
   modules are gone and `/about` renders E directly. Variant E still owns its
   whole page and scopes its CSS under .av-e; fold it back into site-content.js
   as a plain page whenever the extra directory stops earning its keep. */

import * as about from "./variant-e.js";

export function buildAboutPage() {
  return {
    title: "About Natasha Hadland | NJH",
    description:
      "Meet Natasha Hadland — Sports Therapist and Certified STOTT Pilates instructor, treating clients from age 8 to over 80 at the Studham studio.",
    canonical: "/about",
    tone: about.meta.tone || "light",
    html: `<div class="about-variant av-e">${about.build()}</div>`,
  };
}

/* One init hook, for the drawn spine down the conversation. Everything else on
   the page is CSS — the fades are the site's own IntersectionObserver, the
   portrait's edges are a mask — and the travel from the hero to the quote is
   the site-wide opening move, wired up per route in main.js. A no-op on every
   other route. */
export function initAboutPage() {
  about.init();
}
