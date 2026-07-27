/* About page.

   Five arrangements were built for review (variant-a…variant-e). Dan chose
   E — the interview — and the review switcher is gone, so `/about` now renders
   E directly. variant-a…variant-d are still on disk for reference but are no
   longer imported, which keeps them out of the bundle; delete them once E is
   folded back into site-content.js as a plain page. */

import * as about from "./variant-e.js";

export function buildAboutPage() {
  return {
    title: "About Natasha Hadland | NJH",
    description:
      "Meet Natasha Hadland — Sports Therapist and Certified STOTT Pilates instructor, treating clients from age 8 to over 80 in Studham and Berkhamsted.",
    canonical: "/about",
    tone: about.meta.tone || "light",
    html: `<div class="about-variant av-e">${about.build()}</div>`,
  };
}

/* No init hook: the page is entirely CSS — the standing columns are
   position:sticky and the fades are the site's own IntersectionObserver. If a
   future change needs JS here, add an init() to the variant module and call it
   from main.js alongside initPageFeatures(). */
