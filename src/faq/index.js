/* FAQ page.

   Five arrangements were built for review (see the note in faq.js). The
   journey was chosen: the page owns its own hero, so it is assembled here
   rather than through site-content's page() helper, the same way About is.

   The hero is deliberately provisional — the stage strip and the line that
   starts at its first stop. It is on the list to revisit. */

import { faqBody, initFaqJourney } from "./faq.js";

export function buildFaqPage() {
  return {
    metaTitle: "Frequently Asked Questions | NJH",
    description:
      "What happens at your first NJH appointment, what to wear, what it costs, and the clinic policies on cancellations, lateness and Pilates blocks.",
    canonical: "/faq",
    tone: "light",
    html: faqBody(),
  };
}

export { initFaqJourney };
