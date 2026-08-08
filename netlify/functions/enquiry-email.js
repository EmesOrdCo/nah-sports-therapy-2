/* The enquiry notification email.

   Written by hand rather than taken from a form provider's template, which is
   the whole reason this function exists: FormSubmit put a third-party advert
   in the middle of every enquiry, and no provider setting removed it.

   Email HTML is not web HTML. This is tables and inline styles on purpose —
   Outlook renders through Word, which has no flexbox, no grid, and drops most
   of a <style> block. Brand colours are hex because oklch(), which the site
   itself uses, is understood by roughly no mail client. The values below are
   the resolved equivalents of --navy, --ink, --ink-soft and --periwinkle.

   No images. A logo would have to be a remote URL, which most clients block
   until the reader clicks "show images" — and a broken logo above the client's
   name is worse than clean type. The masthead is text.

   The layout answers what Natasha does with this email: see who it is from and
   what they want, decide whether it is urgent, and reply. So name, service and
   message come first at full size, and the administrative fields sit under
   them in a quieter block. */

const NAVY = "#131632";
const INK = "#171a37";
const INK_SOFT = "#4b4f6a";
const PERIWINKLE = "#a1aff1";
const RULE = "#e3e5ef";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/* Every value here came from a public form, so it is untrusted and goes
   nowhere near the HTML without escaping. The consequence of skipping this is
   not a broken layout — it is that anyone on the internet can put markup, or a
   link of their choosing, into an email that arrives looking like it came from
   NJH's own website. */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Newlines are the one piece of formatting somebody typing into a textarea
   actually uses — paragraph breaks in a description of an injury carry
   meaning. Escaping first, then introducing <br>, keeps that without giving
   anything else through. */
function paragraphs(value) {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:${INK};">${block.replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

function detailRow(label, value) {
  if (!value) return "";
  return `<tr>
      <td style="padding:0 0 10px;font-family:${FONT};font-size:13px;line-height:1.4;color:${INK_SOFT};width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:0 0 10px;font-family:${FONT};font-size:14px;line-height:1.4;color:${INK};vertical-align:top;">${value}</td>
    </tr>`;
}

export function buildEnquiryEmail(fields) {
  const {
    name = "",
    email = "",
    phone = "",
    service = "",
    preferredReply = "",
    message = "",
    consent = "",
    submittedAt = "",
  } = fields;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  /* mailto: and tel: so Natasha can act from the email on a phone without
     copying anything out. Reply-to is set on the message itself as well —
     this is for the case where she wants to start a fresh thread. */
  const emailLink = email
    ? `<a href="mailto:${encodeURI(email)}" style="color:${NAVY};text-decoration:underline;">${safeEmail}</a>`
    : "";
  const phoneLink = phone
    ? `<a href="tel:${encodeURI(String(phone).replace(/\s+/g, ""))}" style="color:${NAVY};text-decoration:underline;">${escapeHtml(phone)}</a>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f9;">
<!-- Shown in the inbox list under the subject, before the email is opened. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safeName}${service ? ` — ${escapeHtml(service)}` : ""}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f5f9;padding:24px 12px;">
<tr><td align="center">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:4px;overflow:hidden;">

  <tr>
    <td style="background:${NAVY};padding:22px 28px;">
      <div style="font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;">NJH Sports Therapy &amp; Pilates</div>
      <div style="font-family:${FONT};font-size:13px;color:${PERIWINKLE};padding-top:4px;">New enquiry from the website</div>
    </td>
  </tr>

  <tr>
    <td style="padding:28px 28px 8px;">
      <div style="font-family:${FONT};font-size:22px;font-weight:700;color:${INK};line-height:1.3;">${safeName || "Someone"}</div>
      ${service ? `<div style="font-family:${FONT};font-size:15px;color:${INK_SOFT};padding-top:6px;">${escapeHtml(service)}</div>` : ""}
    </td>
  </tr>

  <tr>
    <td style="padding:14px 28px 4px;font-family:${FONT};">
      ${paragraphs(message) || `<p style="margin:0;font-size:15px;color:${INK_SOFT};font-style:italic;">No message was included.</p>`}
    </td>
  </tr>

  <tr>
    <td style="padding:10px 28px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};padding-top:18px;">
        <tr><td style="height:18px;line-height:18px;font-size:0;">&nbsp;</td></tr>
        ${detailRow("Email", emailLink)}
        ${detailRow("Phone", phoneLink || `<span style="color:${INK_SOFT};">Not given</span>`)}
        ${detailRow("Preferred reply", escapeHtml(preferredReply))}
        ${detailRow("Consent", escapeHtml(consent))}
        ${detailRow("Received", escapeHtml(submittedAt))}
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:22px 28px 26px;">
      <a href="mailto:${encodeURI(email)}?subject=${encodeURIComponent(`Re: your enquiry to NJH Sports Therapy & Pilates`)}"
         style="display:inline-block;background:${NAVY};color:#ffffff;font-family:${FONT};font-size:15px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:3px;">Reply to ${safeName || "this enquiry"}</a>
    </td>
  </tr>

  <tr>
    <td style="background:#fafbfd;border-top:1px solid ${RULE};padding:16px 28px;font-family:${FONT};font-size:12px;line-height:1.5;color:${INK_SOFT};">
      Sent by the contact form on the NJH website. Replying to this email goes straight to ${safeName || "the sender"}.
    </td>
  </tr>

</table>

</td></tr>
</table>
</body>
</html>`;

  /* A plain-text alternative is not decoration. A message with no text part
     scores worse with spam filters, and this address is already fighting to
     stay out of junk. */
  const text = [
    `New enquiry from the NJH website`,
    ``,
    `Name:            ${name}`,
    `Service:         ${service}`,
    `Email:           ${email}`,
    `Phone:           ${phone || "Not given"}`,
    `Preferred reply: ${preferredReply}`,
    `Consent:         ${consent}`,
    `Received:        ${submittedAt}`,
    ``,
    `Message:`,
    message || "(none)",
    ``,
    `Reply to this email to answer ${name || "the sender"} directly.`,
  ].join("\n");

  return { html, text };
}
