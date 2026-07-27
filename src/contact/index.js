/* Contact page.

   Three arrangements were built for review (variant-a…variant-c). Dan chose
   A — Reassurance — so the switcher, the variant map and the other two modules
   are gone and `/contact` renders A directly. Variant A still owns its whole
   page and scopes its CSS under .cv-a; fold it back into site-content.js as a
   plain page whenever the extra directory stops earning its keep.

   No init hook: variant A's progressive bits are CSS, and the form is a native
   form, so the existing initPageFeatures() submit handler drives it. */

import "./contact.css";

import * as contact from "./variant-a.js";

export function buildContactPage() {
  return {
    metaTitle: "Contact NJH Sports Therapy & Pilates",
    description:
      "Contact Natasha Hadland to discuss Sports Therapy or Pilates appointments in Studham and Berkhamsted.",
    canonical: "/contact",
    tone: contact.meta.tone || "light",
    html: `<div class="contact-variant cv-a">${contact.build()}</div>`,
  };
}
