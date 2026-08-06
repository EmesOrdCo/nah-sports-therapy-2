/* Contact page — content shared by all three variants.

   Single source of truth so the variants differ in arrangement and tone of
   voice, never in fact. Every number and address here is client-verified:
   change them only against something Natasha has confirmed. */

export const BUSINESS = {
  phoneDisplay: "07881 821 901",
  phoneHref: "tel:+447881821901",
  email: "njhsportstherapyandpilates@gmail.com",
};

/* The studio is also a private home, so it is named by village only — no
   street address, postcode or map link. Directions go out with the booking
   confirmation instead. */
export const PLACES = [
  {
    name: "Studham Pilates Studio",
    lines: ["Studham, near Whipsnade"],
    note: "Sports Therapy, individual and small-group Pilates. Full directions are sent when your appointment is confirmed.",
    href: "/pilates#studio",
    linkLabel: "Studio details",
  },
];

/* CURRENTLY UNUSED — held, not dead.

   The three things a nervous first-time client wants to know before they will
   type anything into a form. These were variant A's left rail until Dan asked
   for the headline and call button to take that column instead. Kept here
   because the copy is client-facing and considered: if the page ever wants a
   reassurance strip back (a compact row under the form is the obvious place),
   this is it. Delete outright if that never happens.

   Deliberately not numbered — the overhaul removed 01/02/03 scaffolding. */
export const REASSURANCE = [
  {
    heading: "Natasha replies herself",
    body: "Your enquiry goes straight to Natasha, not to a booking desk. She will usually come back to you within a working day.",
  },
  {
    heading: "You do not need a diagnosis",
    body: "Plenty of people arrive unsure whether they need treatment or movement work. Describing the problem in your own words is enough to start.",
  },
  {
    heading: "Asking is not booking",
    body: "A first message is a conversation. If NJH is not the right fit, Natasha will say so and point you somewhere better.",
  },
];

export const SERVICES = [
  {
    value: "Sports Therapy",
    label: "Sports Therapy",
    hint: "Pain, injury or restricted movement you would like treated hands-on.",
  },
  {
    value: "Pilates",
    label: "Pilates",
    hint: "Individual or small-group movement work, including pre and postnatal.",
  },
  {
    value: "Other / not sure",
    label: "Not sure yet",
    hint: "Describe it in your own words and Natasha will suggest a starting point.",
  },
];

/* No LOCATION_OPTIONS: with Studham the only location, a "preferred location"
   field had nothing to choose between, so the form field was removed. */
export const REPLY_OPTIONS = ["Email", "Phone"];

export const SAFETY_NOTE =
  "Please do not use this form for urgent medical help. Contact NHS 111 or emergency services where appropriate.";

/* Shared form internals. Every variant must keep data-enquiry-form and the
   field names intact — initPageFeatures() in site-content.js binds to them and
   posts the whole FormData to VITE_CONTACT_FORM_ENDPOINT. */
export function honeypotAndSubject() {
  return `<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    <input type="hidden" name="_subject" value="New NJH website enquiry">`;
}

export function consentField() {
  return `<div class="form-field form-field--full form-consent"><label><input type="checkbox" name="consent" required><span>I agree that NJH may use these details to respond to my enquiry.</span></label><span class="form-error">Please confirm before sending.</span></div>`;
}

export function submitRow(label = "Send enquiry") {
  return `<div class="form-submit form-field--full"><button type="submit">${label} <span>↗</span></button><p data-form-status role="status" aria-live="polite"></p></div>`;
}
