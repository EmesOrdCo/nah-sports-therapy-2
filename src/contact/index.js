/* Contact page.

   Three arrangements were built for review (variant-a…variant-c). Dan chose
   A — Reassurance — and the other two went; A was then rebuilt as the two-door
   navy page that lives in page.js, which is why there is no variant switcher
   and no variant map left. The page owns its whole route and scopes its CSS
   under .cv; fold it back into site-content.js as a plain page whenever the
   extra directory stops earning its keep.

   The form stays a native form — the existing initPageFeatures() submit
   handler drives it — and the one init hook here only builds the custom
   dropdowns over the two native selects, which keep working without it. */

import * as contact from "./page.js";

export { initContactSelects } from "./page.js";

export function buildContactPage() {
  return {
    metaTitle: "Contact NJH Sports Therapy & Pilates",
    description:
      "Contact Natasha Hadland to discuss Sports Therapy or Pilates appointments at the Studham studio.",
    canonical: "/contact",
    tone: contact.meta.tone || "light",
    html: `<div class="cv">${contact.build()}</div>`,
  };
}
