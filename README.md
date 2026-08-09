# NJH Sports Therapy & Pilates

A multi-page website experience built with Vite, vanilla JavaScript and Three.js. Page content is selected from the current pathname in `src/site-content.js`, while the existing homepage and visualisation are retained.

## Local development

```sh
npm install
npm run dev
```

Use `npm run build` for a production build and `npm run preview` to inspect it.

## Routes

The site includes the homepage plus continuous Pilates, Clinics and Sports Therapy experiences, alongside About, contact and pricing routes. Their former subpage URLs redirect to matching anchored sections on `/pilates`, `/clinics` and `/sports-therapy`. Other legacy inbound paths remain available, and `/price-list` uses `/prices` as its canonical URL.

This is a client-routed Vite site. `public/_redirects` configures Netlify-style static hosting to serve `index.html` for direct route requests. If the production host uses different rewrite syntax, configure an equivalent catch-all rewrite.

## Contact form

The form posts to the site's own Netlify Function, which composes the notification email and sends it through Resend:

```
contact form → /api/enquiry → Resend → njhpilates@gmail.com
```

```sh
VITE_CONTACT_FORM_ENDPOINT=/api/enquiry
```

Two earlier builds used hosted form services (FormSubmit, then Formspree) and both had the same defect. The notification was written and sent *by that service*, which meant their template (FormSubmit injects a third-party advert into every enquiry), their sending domain, and therefore their spam reputation rather than NJH's. Outlook junked all of it. Nothing in either provider's settings fixes that, because none of it is ours to configure. Owning the send is the fix, and it is also what makes the email look like NJH's.

Resend rather than Brevo, which this was first written against: Brevo's free plan adds a "Sent with Brevo" badge to the message and sells its removal as a paid add-on, which is the FormSubmit advert again wearing a different hat. Resend's free tier is 3,000 emails a month against an expected volume under 100, and it adds nothing to the message.

### How the mail is addressed

- **From** `enquiries@send.njhsportstherapy.co.uk`, a send-only identity, authenticated by SPF and DKIM. There is no mailbox behind it and nobody logs into it.
- **To** `njhpilates@gmail.com`, the working inbox.
- **Reply-to** the enquirer, so answering the notification answers them directly.

The From address is on a **subdomain**, and that is load-bearing rather than cosmetic. NJH's existing mail on the apex domain has its own MX and SPF records, and a second SPF record at the apex, or an edited one, is the standard way to knock a working mailbox offline. Authenticating `send.` puts every record this needs under a name nothing else uses, so the client's existing email cannot be affected by any of it.

### The email template

`netlify/functions/enquiry-email.js` builds the message and is the only file to edit to change how it looks. It is tables and inline styles because Outlook renders through Word; the reasoning is in the file's own header comment.

```sh
npm run email:preview
```

renders it with awkward sample data (long service name, multi-paragraph message, characters that must be escaped, missing phone) and opens it in a browser, so the design loop does not cost a send.

### Configuration

`VITE_CONTACT_FORM_ENDPOINT` is a build-time value inlined into the public bundle, so it holds nothing secret, only the path the form posts to. Set it in `.env.local` for development and in Netlify's environment variables for the deployed site. Without it the form shows the published NJH email address as a fallback rather than losing an enquiry.

Everything the function needs is set in Netlify's UI and read at request time. **None of these may be given a `VITE_` prefix**: that prefix is what tells Vite to inline a value into public JavaScript, and doing it to `RESEND_API_KEY` would publish the key.

| Variable | |
| --- | --- |
| `RESEND_API_KEY` | required: the transactional mail API key, starts `re_` |
| `MAIL_FROM` | required: the send-only From address |
| `MAIL_FROM_NAME` | optional, defaults to "NJH Website" |
| `MAIL_TO` | optional, defaults to the NJH Gmail |
| `MAIL_BCC` | optional archive copy |

Resend is reached in one `fetch` inside `sendEmail()`; swapping to MailerSend, SendGrid or SES is a change to that function and nothing else.

Run the whole thing locally (page, function and send together) with `npm run dev:netlify`, which reads the same variables from `.env.local`. Plain `npm run dev` serves the page but not the function, so the form has nothing to post to.

### Before the domain is verified

A new Resend account is sandboxed: it will only send **from** `onboarding@resend.dev` and only **to** the address the account was opened with. That is enough to exercise the entire path end to end without touching DNS. Going live is then two environment variables (`MAIL_FROM` to the real send-only address, `MAIL_TO` to the NJH Gmail) and no code change at all.

Verifying `send.njhsportstherapy.co.uk` in Resend produces three records to publish at the registrar: an `MX` on the subdomain for bounce handling, a `TXT` SPF record on the subdomain, and a `TXT` DKIM record at `resend._domainkey.send`. Resend re-checks and flips to verified within about ten minutes. None of the three touches the apex domain, so existing mail keeps working throughout.

### There is no submission archive

Nothing stores enquiries: the email is the only record. A notification lost to a spam filter is a lost client, so the Gmail needs a filter that keeps these out of junk, and enquiries should not be deleted before they are answered. Setting `MAIL_BCC` to a second address is the cheapest insurance. Failures are logged to the Netlify function log, which is the only trace that an enquiry was attempted at all.

### Local development

The form endpoint is a function, so plain `npm run dev` cannot serve it: Vite alone has no `/api/enquiry`, and submissions will report a send failure. Run the site through the Netlify CLI (`netlify dev`) to exercise the real path, or point `VITE_CONTACT_FORM_ENDPOINT` at a hosted provider while working on the page itself.

`netlify/functions/enquiry.js` validates and sends; `netlify/functions/enquiry-email.js` builds the HTML. That email is tables and inline styles with hex colours on purpose, because Outlook renders through Word, and the `oklch()` values the site uses mean nothing to a mail client.

The form includes native validation, accessible status messages, a honeypot and consent confirmation. Note that the honeypot is the *only* spam defence here: FormSubmit's captcha is an interstitial page, which a form that never navigates cannot use, so `_captcha` is switched off in `src/contact/content.js`. Changing form provider means renaming the honeypot field to whatever that provider expects. See the comment above `honeypotAndSubject()`.

## Content checks before launch

The redesign uses information published on the existing NJH website as of July 2026. Confirm these details with NJH before launch:

- treatment and Pilates prices;
- small-group class days and times;
- clinic addresses and service availability by location;
- future retreat and workplace-treatment availability;
- cancellation, lateness and block-payment policies;
- qualifications and professional-body naming;
- phone number and email address;
- permission to republish client testimonial excerpts.

Website information is general and does not replace individual medical advice.
