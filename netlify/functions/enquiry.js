/* Contact form endpoint.

   The form used to post straight to a third-party form service, which meant
   the notification email was written and sent by that service: their template,
   their advert, their sending domain, and — because a filter judges mail on
   who sent it — their spam reputation rather than NJH's. Everything that was
   wrong with those emails came from not owning this step.

   So the form posts here instead. This runs on Netlify, holds the mail API key
   as a real server-side secret (VITE_ variables are inlined into public
   JavaScript and cannot hold one), builds the email from enquiry-email.js, and
   hands it to Resend to send as NJH from NJH's own domain.

   Resend rather than Brevo, which this was first written against: Brevo's free
   plan stamps a "Sent with Brevo" badge on the mail and charges to remove it,
   which is the FormSubmit advert again under another name. Resend's free tier
   adds nothing to the message.

   Resend is one `fetch` and one env var away from being MailerSend, SendGrid or
   anything else: only sendEmail() below knows which service is in use. */

import { buildEnquiryEmail } from "./enquiry-email.js";

/* Reached as /api/enquiry, mapped in netlify.toml rather than declared here
   with a `path` config — the site's catch-all redirect would otherwise race
   this route, and an ordered rule in one file is easier to be sure of than a
   precedence rule between two. */

const DEFAULT_TO = "njhpilates@gmail.com";

/* Long enough for somebody to describe an injury properly, short enough that
   the endpoint is not a free relay for anybody who finds it. */
const LIMITS = { name: 200, email: 320, phone: 60, service: 120, message: 5000 };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/* The client reads `success` out of the body, not just the status code — some
   providers answer 200 to a submission they refused, and the handler was
   written not to trust the code alone. Keeping to that shape here means the
   form works against this function and against a hosted provider without
   knowing which it is talking to. */
const fail = (message, status = 400) =>
  json({ success: "false", message }, status);

function clean(value, max) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

/* Deliberately permissive. The browser has already applied type="email", and
   the cost of the two errors is not symmetric: a junk address wastes one
   moment of Natasha's time, while a real client turned away by a regex that
   dislikes their perfectly valid address is gone for good. */
const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/* Addresses go to Resend as "Display Name <address>" rather than as a pair of
   fields. The name is quoted because a comma or a full stop in it — "Nurse,
   Natasha" — would otherwise be read as the end of one address and the start
   of another, and any quote inside the name is stripped rather than escaped:
   the value came from a public form, and a header is exactly where somebody
   would try to smuggle a second recipient in. */
function address(email, name) {
  if (!name) return email;
  return `"${String(name).replace(/["\\]/g, "")}" <${email}>`;
}

async function sendEmail({ to, bcc, from, fromName, replyTo, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: address(from, fromName),
      to: [to],
      ...(bcc ? { bcc: [bcc] } : {}),
      // Snake case: this is the REST field name, not the SDK's `replyTo`.
      ...(replyTo ? { reply_to: address(replyTo.email, replyTo.name) } : {}),
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    // Read as text: a gateway error in front of the API will not be JSON.
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 500)}`);
  }
}

export default async function handler(req) {
  if (req.method !== "POST") return fail("Method not allowed.", 405);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    // Configuration, not the sender's problem — so it is logged loudly and
    // reported as a server error rather than blamed on the form.
    console.error("Missing RESEND_API_KEY or MAIL_FROM.");
    return fail("Sending is not configured.", 500);
  }

  let form;
  try {
    // A standard Request, so this parses multipart and urlencoded alike and
    // the page can keep posting an ordinary FormData.
    form = await req.formData();
  } catch {
    return fail("Could not read the submitted form.");
  }

  /* The honeypot is answered with success. A bot told it failed will retry,
     vary itself and eventually get through; one told it succeeded goes away.
     Nothing is sent. */
  if (clean(form.get("_gotcha"), 100)) {
    return json({ success: true });
  }

  const name = clean(form.get("name"), LIMITS.name);
  const email = clean(form.get("email"), LIMITS.email);
  const phone = clean(form.get("phone"), LIMITS.phone);
  const service = clean(form.get("service"), LIMITS.service);
  const preferredReply = clean(form.get("preferred reply"), LIMITS.service);
  const message = clean(form.get("message"), LIMITS.message);
  const consent = clean(form.get("consent"), 200);

  if (!name) return fail("Please enter your name.");
  if (!looksLikeEmail(email)) return fail("Please enter a valid email address.");
  if (!message) return fail("Please tell us briefly how we can help.");
  if (!consent) return fail("Please confirm before sending.");

  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date());

  const { html, text } = buildEnquiryEmail({
    name,
    email,
    phone,
    service,
    preferredReply,
    message,
    consent,
    submittedAt,
  });

  /* The page composes a subject carrying the name and service. It is rebuilt
     rather than trusted: it arrives from the browser like everything else, and
     a subject line is a place header injection gets attempted. */
  const subject = ["New enquiry", service, name].filter(Boolean).join(" - ");

  try {
    await sendEmail({
      to: process.env.MAIL_TO || DEFAULT_TO,
      bcc: process.env.MAIL_BCC || null,
      from,
      fromName: process.env.MAIL_FROM_NAME || "NJH Website",
      // Reply-to is the enquirer, so answering the notification answers them.
      replyTo: { email, name },
      subject,
      html,
      text,
    });
  } catch (error) {
    /* Logged in full for Netlify's function log — which, with no form-provider
       dashboard behind this, is the only trace an enquiry ever existed. The
       sender is told plainly it failed so they can phone or email instead. */
    console.error("Enquiry send failed:", error, { name, email, service });
    return fail("Your message could not be sent.", 502);
  }

  return json({ success: true });
}
