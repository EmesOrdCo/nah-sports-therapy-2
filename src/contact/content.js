/* Contact page — content shared by all three variants.

   Single source of truth so the variants differ in arrangement and tone of
   voice, never in fact. Every number and address here is client-verified:
   change them only against something Natasha has confirmed. */

export const BUSINESS = {
  /* Client-supplied, and the same inbox enquiry notifications already go to
     (DEFAULT_TO in netlify/functions/enquiry.js). The co.uk address this
     replaced was displayed on the site but was not where the form delivered. */
  email: "njhpilates@gmail.com",
  /* Natasha's WhatsApp Business short link, generated in her app under
     Settings, Business tools, Short link, and the only public route to her
     phone from 21 Aug 2026. It opens a chat with her without her number
     appearing in the URL, which is the entire point of it: the mobile was
     being harvested off this page and she was getting spam calls, so it is
     no longer printed anywhere on the site or in the structured data.

     Do not "improve" this into wa.me/<number> or a tel: link. Either would
     republish the number and undo the change. If the link ever needs
     regenerating it comes from Natasha's phone, not from the number.

     The same link is held in src/site-content.js and src/about/content.js
     for the pages built from those files. All three move together. */
  whatsappHref: "https://wa.me/message/MDDF72Z4L7GFF1",
};

/* The studio is also a private home, so it is named by village only — no
   street address, postcode or map link. Directions go out with the booking
   confirmation instead. */
export const PLACES = [
  {
    name: "Studham Pilates Studio",
    lines: ["Studham, near Whipsnade"],
    note: "Sports Therapy, individual and small group Pilates. Full directions are sent when your appointment is confirmed.",
    href: "/studio#studio",
    linkLabel: "Studio details",
  },
];

/* Natasha's own line, and the reason for it is hers too: email is not checked
   every day and is hardest of all to check between clients, so the fast route
   during clinic hours is WhatsApp. The reason stays here and off the page —
   "I don't always check emails" reads as an apology next to the promise of a
   reply within a working day, and undercuts it. What a client needs is the
   quicker door, not the account of why.

   One constant because the sentence now runs twice: under the phone number in
   the hero, where somebody who came for the number is already looking, and
   under "Natasha replies herself" further down. Two copies of a sentence is
   one of them going stale.

   It was briefly a filled tile in the language of the hero doors, which was
   louder than this page wants to be — reverted at Harry's request. Her
   sentence stays whole, "please" included, which the tile's two-line setting
   had cost it. */
/* The first hero tile. It carried the phone number until 21 Aug 2026; with
   the number gone the tile is the WhatsApp door itself, and it is a plain
   link again like the enquiry tile beside it.

   The note under it is cut from Natasha's own sentence below rather than
   written fresh, so the page says the same thing in both places in her
   vocabulary. Her sentence survives whole in the reassurance column, where
   there is room for it. */
export const WHATSAPP_DOOR = {
  label: "WhatsApp Natasha",
  note: "Speedy replies during clinic time.",
  href: BUSINESS.whatsappHref,
};

export const WHATSAPP_NOTE = {
  before: "For speedy replies during clinic time, please",
  label: "WhatsApp directly",
  href: BUSINESS.whatsappHref,
};

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
    /* A line of its own under the body rather than folded into it: it is the
       one thing in this column that can be acted on, and a link buried
       mid-paragraph in a reassurance panel is one nobody taps. */
    action: WHATSAPP_NOTE,
  },
  {
    heading: "You do not need a diagnosis",
    body: "Plenty of people arrive unsure whether they need treatment or movement work. Describing the problem in your own words is enough to start.",
  },
  {
    /* Natasha's wording, and the third item is hers verbatim bar the standing
       correction — punctuation and spelling to house style, never a rewrite:
       the comma after "needs", and "cross referral" for "cross Referral".
       (It read "cross-referral" between those two corrections; the hyphen went
       on 20 Aug 2026 with the site-wide sweep — see the note in reviews.js.)

       Note for anyone editing the site's other referral copy: this is the only
       place the word runs outward. The three "professional referrals are
       welcomed from GPs, consultants…" lines on /sports-therapy mean people
       sent TO NJH. Same word, opposite direction, and the two should not be
       made to sound like one sentence about one thing. */
    heading: "Asking is not booking",
    body: "A first message is a conversation. If NJH is not quite the right fit for your specific needs, Natasha will suggest an alternative cross referral.",
  },
];

export const SERVICES = [
  {
    value: "Sports Therapy",
    label: "Sports Therapy",
    hint: "Pain, injury or restricted movement you would like treated hands on.",
  },
  {
    value: "Pilates",
    label: "Pilates",
    hint: "Individual or small group movement work, including pre and postnatal.",
  },
  {
    value: "Other / not sure",
    label: "Not sure yet",
    hint: "Describe it in your own words and Natasha will suggest a starting point.",
  },
];

/* No LOCATION_OPTIONS: with Studham the only location, a "preferred location"
   field had nothing to choose between, so the form field was removed. */
/* Phone first, and first is the default: the select carries no empty prompt,
   so whichever option leads is what an untouched form submits. NJH asked for
   the phone to lead — a call is the reply most people here want, and the one
   that settles an enquiry in a minute rather than a thread. */
/* Exported as its own constant because two things key off this exact string:
   the option itself, and the phone field's requirement — bindPhoneRequirement()
   in page.js makes the number mandatory when this is what is chosen. Reword the
   option here and the link holds; write "Phone" a second time in page.js and a
   later rewording quietly makes the number optional again. */
export const REPLY_BY_PHONE = "Phone";

export const REPLY_OPTIONS = [REPLY_BY_PHONE, "Email"];

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
