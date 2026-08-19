/* Contact page — content shared by all three variants.

   Single source of truth so the variants differ in arrangement and tone of
   voice, never in fact. Every number and address here is client-verified:
   change them only against something Natasha has confirmed. */

export const BUSINESS = {
  phoneDisplay: "07881 821 901",
  phoneHref: "tel:+447881821901",
  /* Client-supplied, and the same inbox enquiry notifications already go to
     (DEFAULT_TO in netlify/functions/enquiry.js). The co.uk address this
     replaced was displayed on the site but was not where the form delivered. */
  email: "njhpilates@gmail.com",
};

/* The studio is also a private home, so it is named by village only — no
   street address, postcode or map link. Directions go out with the booking
   confirmation instead. */
export const PLACES = [
  {
    name: "Studham Pilates Studio",
    lines: ["Studham, near Whipsnade"],
    note: "Sports Therapy, individual and small-group Pilates. Full directions are sent when your appointment is confirmed.",
    href: "/studio#studio",
    linkLabel: "Studio details",
  },
];

/* The three things a nervous first-time client wants to know before they will
   type anything into a form. These were variant A's left rail, were held
   unused through the two-door rebuild, and are now the third column beside the
   form. The order is the order they are read in — it runs from what happens
   next, to what you need before you write, to what writing commits you to.

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
   posts the whole FormData to VITE_CONTACT_FORM_ENDPOINT.

   The underscore-prefixed fields are the form provider's, and their names are
   the whole of their behaviour: `_gotcha` is the honeypot and `_subject` sets
   the notification's subject line, which the submit handler overwrites per
   enquiry so the inbox can be triaged on the subject alone.

   These names are Formspree's. FormSubmit — used briefly while the endpoint
   was being proved out — calls the same honeypot `_honey`, and a provider swap
   that forgets to rename it does not error: the field is simply accepted,
   ignored, and the form goes unprotected while still looking correct. Whatever
   provider is in VITE_CONTACT_FORM_ENDPOINT, check the honeypot's name against
   its documentation, and submit a bot-shaped request to prove it. */
export function honeypotAndSubject() {
  return `<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    <input type="hidden" name="_subject" value="New NJH website enquiry">`;
}

/* The checkbox carries an explicit value because an unset one submits as the
   literal "on", and "consent: on" is not a record of anything — least of all
   on a health form, where what was agreed to may matter later. The value says
   what was agreed, so the notification email is the evidence. */
export function consentField() {
  return `<div class="form-field form-field--full form-consent"><label><input type="checkbox" name="consent" value="Yes, agreed NJH may use these details to reply" required><span>I agree that NJH may use these details to respond to my enquiry.</span></label><span class="form-error">Please confirm before sending.</span></div>`;
}

export function submitRow(label = "Send enquiry") {
  return `<div class="form-submit form-field--full"><button type="submit">${label} <span>↗</span></button><p data-form-status role="status" aria-live="polite"></p></div>`;
}
