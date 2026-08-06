import "./variant-a.css";
import {
  BUSINESS,
  PLACES,
  SERVICES,
  REPLY_OPTIONS,
  SAFETY_NOTE,
  honeypotAndSubject,
  consentField,
  submitRow,
} from "./content.js";

/* Variant A — Reassurance.

   One field, no separate hero band. The headline, the line under it and the
   call button sit in the left column directly beside the form, so on a laptop
   the whole page — the ask and the means of asking — is visible at once, and
   on a phone the form is one short scroll away rather than a full screen down.

   DOM order is intro → form → details, which is the right reading order on a
   phone. On desktop the details are placed back under the intro in column one
   by explicit grid placement, so nobody has to scroll past three addresses to
   reach the form. */

export const meta = { label: "Reassurance", tone: "light" };

function callStrip() {
  return `<div class="cv-a__call">
    <a class="cv-a__call-btn" href="${BUSINESS.phoneHref}">
      <span class="cv-a__call-label">Call Natasha</span>
      <span class="cv-a__call-number">${BUSINESS.phoneDisplay}</span>
    </a>
    <p class="cv-a__call-alt">Prefer to write? Use the form.</p>
  </div>`;
}

/* No Telephone row: the call button carries the number a few hundred pixels
   above this, and printing it twice reads as a mistake. */
function details() {
  return `<div class="cv-a__details" data-reveal>
    <h3>Email</h3>
    <p class="cv-a__email">
      <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>
    </p>
    <h3>Where</h3>
    <ul class="cv-a__places">
      ${PLACES.map(
        (place) => `<li>
          <strong>${place.name}</strong>
          <span>${place.lines.join(", ")}</span>
        </li>`,
      ).join("")}
    </ul>
    <p class="cv-a__safety">${SAFETY_NOTE}</p>
  </div>`;
}

function form() {
  return `<form class="enquiry-form cv-a__form" data-enquiry-form novalidate data-reveal>
    <h2 class="cv-a__form-title">Send an enquiry</h2>
    <div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required><span class="form-error">Please enter your name.</span></div>
    <div class="form-field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="form-error">Please enter a valid email.</span></div>
    <div class="form-field"><label for="phone">Phone <small>optional</small></label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="form-field"><label for="service">What can we help with?</label><select id="service" name="service" required><option value="">Choose a service</option>${SERVICES.map((s) => `<option value="${s.value}">${s.label}</option>`).join("")}</select><span class="form-error">Please choose an option.</span></div>
    <div class="form-field"><label for="contact-method">Preferred reply</label><select id="contact-method" name="preferredContact">${REPLY_OPTIONS.map((o) => `<option>${o}</option>`).join("")}</select></div>
    <div class="form-field form-field--full"><label for="message">In your own words</label><textarea id="message" name="message" rows="6" required placeholder="What would you like help with, and how long has it been going on?"></textarea><span class="form-error">Please tell us briefly how we can help.</span></div>
    ${honeypotAndSubject()}
    ${consentField()}
    ${submitRow()}
  </form>`;
}

export function build() {
  return `
  <section class="cv-a__main">
    <div class="section-shell cv-a__grid">
      <div class="cv-a__intro">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><span>Contact</span>
        </nav>
        <h1>Talk to Natasha.</h1>
        <p class="cv-a__lede">Get in touch to ask a question, discuss what you need or arrange an appointment.</p>
        ${callStrip()}
      </div>

      ${form()}
      ${details()}
    </div>
  </section>`;
}
