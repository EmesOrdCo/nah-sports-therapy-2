# Go-live runbook

Everything for the client meeting, in order. Tested as far as it can be tested
without DNS: the function, the template, the Resend credentials and the honeypot
all work: a real enquiry was sent and received. What is untested is anything
involving the domain.

---

## Where this stands, 9 August 2026

**The form works and delivers to `njhpilates@gmail.com`.** A real enquiry sent
from `https://njh-therapy-2.netlify.app/contact` arrived in that inbox, not Spam.

It gets there without any DNS at all, by a deliberate shortcut. The client has
not produced the GoDaddy login, so `send.njhsportstherapy.co.uk` cannot be
verified, so Resend's sandbox rule applies: **an unverified account delivers only
to the address it was opened with.** The account was therefore opened with
`njhpilates@gmail.com` — the destination NJH actually wants — which turns that
restriction into the answer instead of the obstacle.

| | Now | After verification |
| --- | --- | --- |
| Resend account | opened with `njhpilates@gmail.com` | unchanged |
| `MAIL_FROM` | `onboarding@resend.dev` | `enquiries@send.njhsportstherapy.co.uk` |
| `MAIL_TO` | `njhpilates@gmail.com` | unchanged |
| Domain | unverified, no DNS needed | verified |

What this costs: mail is sent from `onboarding@resend.dev`, a shared Resend
address, so it carries none of NJH's own authentication. It reached the inbox on
test, but that is Resend's reputation holding it up rather than NJH's, and it can
change without warning. **Part A below is still the destination, not an
alternative.** It is deferred on GoDaddy access, nothing else.

What this does *not* cost: the site cutover in Part B does not disturb it. That
changes the apex `A` and `www`; Resend reads neither. The form keeps working
through the cutover with no action at all.

---

## 0. Deployed and tested, nothing to do

Merged, pushed to `EmesOrdCo/nah-sports-therapy-2`, and live on
`https://njh-therapy-2.netlify.app`. Verified against the deployed site, not
locally:

| Check | Result |
| --- | --- |
| `/api/enquiry` reaches the function | `GET` → 405, the function's own reply |
| A full enquiry sends | `{"success":true}`, email received |
| Honeypot | success returned, nothing sent |
| Bad email / no consent / no message / no name | each rejected with its own message |
| Endpoint baked into the bundle | `/api/enquiry`, fallback branch eliminated |

Two things had to be fixed to get there, both worth knowing if it breaks again:

- **Secrets scanning failed the build** on four environment variables that are
  public by design. `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` now names them.
  `RESEND_API_KEY` is deliberately still scanned. In the Netlify UI, only
  `RESEND_API_KEY` should have "Contains secret values" ticked.
- **The `/api/enquiry` rule did nothing in `netlify.toml`.** Netlify reads
  `public/_redirects` first, so its `/*` catch-all matched the endpoint before
  the toml was consulted: the form returned the HTML page with a 200, which the
  client-side handler reads as success. It reported "your enquiry has been sent"
  and sent nothing. All redirect rules now live in `_redirects`, in order.

**If the form ever silently succeeds without an email arriving, check the
redirect ordering first.** That failure looks exactly like a working form.

---

## What is already known about the domain

Read from public DNS, so no client access was needed. Saves asking.

| | |
| --- | --- |
| **DNS host** | **GoDaddy**, `ns35/36.domaincontrol.com` |
| **Website** | Wix, apex `A` → `185.230.63.107`, `www` → `wixdns.net` |
| **Email** | **123-reg**, `mx0/mx1.123-reg.co.uk` |
| **SPF** | none |
| **DMARC** | none |
| **Wildcard** | `*` A record → a legacy host, harmless |

Three things follow from this:

- **Ask for the GoDaddy login, not Wix.** Wix runs the site, GoDaddy holds DNS.
  People routinely bring the wrong one and the meeting stalls.
- **Mail is at 123-reg, separate from both.** Nothing done today touches it.
- **No DMARC** means no inherited policy to fight, and **no SPF** means no
  existing record to conflict with. Both risks are off the table.

---

## What to get from the client

- [ ] **GoDaddy account login** (with access to DNS management). Asked for and not
      yet received, which is the only thing blocking Part A
- [x] Enquiries go to `njhpilates@gmail.com` — confirmed and working
- [ ] Confirm they understand **the Wix site stops being visible** when the apex
      is repointed. This is the visible, alarming step, better agreed than sprung
- [ ] Whether anything else uses the domain that is not the website or email
      (booking system, newsletter tool, anything that sends as `@njhsportstherapy.co.uk`)

**Screenshot the whole GoDaddy DNS zone before changing anything.** It is the
rollback.

---

## Where the records go

**Every record in this document is typed into GoDaddy.** Nowhere else.

DNS records live wherever the domain's nameservers point, and those are
`ns35/36.domaincontrol.com`, GoDaddy. Resend and Netlify each *generate* records
for you to copy in; neither of them hosts the zone. Wix is not involved at all:
it is not hosting the DNS, it is only the current destination of the apex `A`
record, and it stops being that when the record is repointed.

> GoDaddy holds the address book. Resend and Netlify hand you entries to write
> into it. Wix is just the address currently on one line of it.

---

## Part A: email sending

**Blocked on the GoDaddy login, and not urgent.** The form already delivers, per
the section at the top. This is what replaces `onboarding@resend.dev` with NJH's
own authenticated sending identity, and it is worth doing whenever access
arrives: the current arrangement rents somebody else's reputation.

Do it in the account opened with `njhpilates@gmail.com`. Adding the domain there
lifts the sandbox, so nothing about the recipient has to change afterwards.

1. Resend → **Add domain** → `send.njhsportstherapy.co.uk`

   The subdomain matters. NJH's live mail runs off the apex, and a second or
   edited SPF record there is the standard way to take a working mailbox down.
   Everything below lands under `send.`, which nothing else uses.

2. In GoDaddy, add the three records Resend gives you:

   | Type | Name | Value |
   | --- | --- | --- |
   | `MX` | `send` | (from Resend, priority 10) |
   | `TXT` | `send` | `v=spf1 include:amazonses.com ~all` |
   | `TXT` | `resend._domainkey.send` | (long `p=…` key from Resend) |

   GoDaddy appends the domain automatically, so enter `send`, not
   `send.njhsportstherapy.co.uk`, or you get `send.njhsportstherapy.co.uk.njhsportstherapy.co.uk`.

3. Wait for Resend to show **Verified** (~10 min, sometimes faster).

4. Netlify → Environment variables → change **one**:

   - `MAIL_FROM` → `enquiries@send.njhsportstherapy.co.uk`

   `MAIL_TO` is already `njhpilates@gmail.com` and stays there. Leave
   `RESEND_API_KEY`, `MAIL_FROM_NAME` and `VITE_CONTACT_FORM_ENDPOINT` alone.

5. **Redeploy.** Environment variables do not apply to an existing deploy.

6. Submit the real form. Confirm it arrives in the client's Gmail (**check Spam**)
   and that hitting reply addresses the enquirer, not NJH.

---

## Part B: site cutover

7. Netlify → Domain management → add `njhsportstherapy.co.uk`, follow the records
   it gives (apex `A` or `ALIAS`, plus `www` `CNAME`).

8. In GoDaddy, change the apex `A` off the Wix IP and repoint `www`.

> **Do not switch nameservers to Netlify DNS.** It is the option Netlify pushes
> hardest, and it moves the *entire* zone, including the 123-reg MX records.
> The client's email stops that afternoon. Add the individual A/CNAME records and
> leave the nameservers at GoDaddy.

9. **Do not touch the MX records at any point.** They are the client's mailbox.

---

## The GitHub Pages copy

`https://emesordco.github.io/nah-sports-therapy-2/` is a second public copy of
the site, and **its contact form cannot work**. Pages is static hosting, so there
is no `/api/enquiry` on it. The form correctly shows NJH's email address instead,
and `VITE_CONTACT_FORM_ENDPOINT` is deliberately left unset in that workflow so it
keeps doing so: setting it would give a form that looks live, posts into a 404,
and loses the enquiry.

**Test on the `.netlify.app` URL, never on Pages.**

After cutover there will be three public copies: Pages, `.netlify.app` and the
real domain. Google can index the Pages one, and a client who finds it will
report the form as broken. Worth retiring the workflow, or adding a `noindex`,
once the domain is live. Not urgent for the meeting.

---

## Rollback

- **Site wrong?** Put the apex `A` back to `185.230.63.107` and `www` back to
  `pointing.wixdns.net`. Wix returns.
- **Email not arriving?** Set `MAIL_FROM` back to `onboarding@resend.dev`,
  redeploy. With `MAIL_TO` at `njhpilates@gmail.com` that is the known-good
  state, and it is the one delivering today. Do not change `MAIL_TO`: while the
  domain is unverified, that address is the *only* one Resend will deliver to,
  and pointing it anywhere else is what produces a 403 and a failed form.
- **Anything unclear?** Netlify → Functions → `enquiry` → the logs carry the full
  error. With no form-provider dashboard behind this, they are the only record
  that an enquiry existed.

---

## Worth raising, not urgent

The domain has **no SPF and no DMARC record at all**, so mail sent from the
client's own 123-reg mailboxes is unauthenticated and more likely to be junked.
That is a separate job from this one, and a fair thing to quote for.

---

## Editing the email later

`netlify/functions/enquiry-email.js` is the template and the only file to change.

```sh
npm run email:preview
```

renders it with awkward sample data and opens it in a browser, so the design loop
costs no sends. It is tables and inline styles because Outlook renders through
Word. The reasoning is in the file's header comment.
