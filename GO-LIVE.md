# Go-live runbook

Everything for the client meeting, in order. Tested as far as it can be tested
without DNS: the function, the template, the Resend credentials and the honeypot
all work — a real enquiry was sent and received. What is untested is the browser
→ function hop on the deployed site, and anything involving the domain.

---

## 0. Before the meeting — REQUIRED

**The contact form code is not on any remote yet.** It is committed locally on
the branch `contact-form-resend`, and neither GitHub repo has `netlify.toml` or
the `netlify/` directory. Until this is pushed and deployed, the five Netlify
environment variables have nothing to read them, and the form posts into the
catch-all redirect and fails without an error.

```sh
git checkout main
git merge contact-form-resend
git push njh2 main          # confirm which remote Netlify builds from
```

Then in Netlify: **Deploys → Trigger deploy → Clear cache and deploy site.**

**Then test it before the meeting.** Submit the real form on the `.netlify.app`
URL. It should arrive at `emesordco@gmail.com` — that is the sandbox target and
proves the whole chain end to end. If this does not work, nothing tomorrow will.

---

## What is already known about the domain

Read from public DNS, so no client access was needed. Saves asking.

| | |
| --- | --- |
| **DNS host** | **GoDaddy** — `ns35/36.domaincontrol.com` |
| **Website** | Wix — apex `A` → `185.230.63.107`, `www` → `wixdns.net` |
| **Email** | **123-reg** — `mx0/mx1.123-reg.co.uk` |
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

- [ ] **GoDaddy account login** (with access to DNS management)
- [ ] Confirm enquiries should go to `njhsportstherapyandpilates@gmail.com`
- [ ] Confirm they understand **the Wix site stops being visible** when the apex
      is repointed — this is the visible, alarming step, better agreed than sprung
- [ ] Whether anything else uses the domain that is not the website or email
      (booking system, newsletter tool, anything that sends as `@njhsportstherapy.co.uk`)

**Screenshot the whole GoDaddy DNS zone before changing anything.** It is the
rollback.

---

## Part A — email sending

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

   GoDaddy appends the domain automatically — enter `send`, not
   `send.njhsportstherapy.co.uk`, or you get `send.njhsportstherapy.co.uk.njhsportstherapy.co.uk`.

3. Wait for Resend to show **Verified** (~10 min, sometimes faster).

4. Netlify → Environment variables → change **two**:

   - `MAIL_FROM` → `enquiries@send.njhsportstherapy.co.uk`
   - `MAIL_TO` → `njhsportstherapyandpilates@gmail.com`

   Leave `RESEND_API_KEY`, `MAIL_FROM_NAME` and `VITE_CONTACT_FORM_ENDPOINT` alone.

5. **Redeploy.** Environment variables do not apply to an existing deploy.

6. Submit the real form. Confirm it arrives in the client's Gmail — **check Spam**
   — and that hitting reply addresses the enquirer, not NJH.

---

## Part B — site cutover

7. Netlify → Domain management → add `njhsportstherapy.co.uk`, follow the records
   it gives (apex `A` or `ALIAS`, plus `www` `CNAME`).

8. In GoDaddy, change the apex `A` off the Wix IP and repoint `www`.

> **Do not switch nameservers to Netlify DNS.** It is the option Netlify pushes
> hardest, and it moves the *entire* zone — including the 123-reg MX records.
> The client's email stops that afternoon. Add the individual A/CNAME records and
> leave the nameservers at GoDaddy.

9. **Do not touch the MX records at any point.** They are the client's mailbox.

---

## Rollback

- **Site wrong?** Put the apex `A` back to `185.230.63.107` and `www` back to
  `pointing.wixdns.net`. Wix returns.
- **Email not arriving?** Set `MAIL_FROM` back to `onboarding@resend.dev` and
  `MAIL_TO` to `emesordco@gmail.com`, redeploy. That is the known-good state.
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
Word — the reasoning is in the file's header comment.
