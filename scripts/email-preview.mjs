/* Renders the enquiry email to a file and opens it, without sending anything.

   The email HTML is the part of this feature most likely to be fiddled with,
   and it is the part with the slowest feedback loop: change a padding value,
   submit the form, wait for the send, find the mail, look at it. This collapses
   that to one command, so the send is only spent on the questions a browser
   cannot answer — does Outlook honour it, does it land in junk.

   It imports the same buildEnquiryEmail() the function uses, so there is no
   second copy of the template to drift out of step.

   Run: npm run email:preview */

import { writeFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { buildEnquiryEmail } from "../netlify/functions/enquiry-email.js";

/* Deliberately awkward sample data rather than tidy placeholders: a long
   service name, a two-paragraph message, an apostrophe and an angle bracket to
   prove the escaping, and an empty phone number to exercise the "Not given"
   branch. A template only ever looks right against its easy case. */
const SAMPLE = {
  name: "Rebecca O'Sullivan-Hartley",
  email: "rebecca.osullivan@example.com",
  phone: "",
  service: "Sports & Remedial Massage Therapy",
  preferredReply: "Either is fine",
  message:
    "I've had pain in my right shoulder for about three months now — it started " +
    "after a fall while running and hasn't really settled. It's worst first thing " +
    "in the morning and when I reach overhead.\n\nI've tried resting it and some " +
    "stretches I found online <b>with no real change</b>. I'm hoping to get back " +
    "to running before the spring. Are evening appointments possible?",
  consent: "I agree to be contacted about my enquiry",
  submittedAt: new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date()),
};

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "..", "email-preview.html");

const { html, text } = buildEnquiryEmail(SAMPLE);

writeFileSync(target, html, "utf8");

console.log("\n--- plain text alternative ---\n");
console.log(text);
console.log(`\nWrote ${target}`);

/* Opened rather than merely written: the whole point is the shortened loop,
   and a path printed to a terminal is one more step. Failure to open is not an
   error — the file is written either way, and the path is above. */
if (!process.argv.includes("--no-open")) {
  execFile("open", [target], () => {});
}
