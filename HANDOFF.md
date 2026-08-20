# Handoff and go-live

Reasoning lives in `GO-LIVE.md`. This is the sheet.

- Everything is in **123-reg**: domain, mailboxes, DNS.
- Never touch **MX**. Never change **nameservers**.
- `ns35/ns36.domaincontrol.com` is a GoDaddy hostname because GoDaddy owns
  123-reg. It does not mean a GoDaddy account exists.
- You only have panel access while she's sitting there. Get delegate access
  before she logs out.

---

## Tonight

- [ ] **Message her.** Sign into 123-reg → DNS management for
      `njhsportstherapy.co.uk` → can she see `@ A 185.230.63.107` and
      `www CNAME pointing.wixdns.net`?
      - **Yes** → one login, no surprises tomorrow.
      - **"External nameservers", no zone** → a GoDaddy account exists after all;
        she needs that login before the meeting.
      - Confirming she can log in is the whole job. Don't ask her to change
        anything.
- [ ] Commit and push `site-content.js`, `style.css`, the three taping images.
      Confirm the deploy goes green.
- [ ] `noindex` the GitHub Pages copy, or retire the workflow.
- [ ] Bring: laptop, phone hotspot, the new Gmail password on paper.

---

## 1. DNS — 123-reg

Do this at minute five. Propagation takes ~2.5 hours.

- [ ] **Screenshot the whole zone.** This is the rollback.
- [ ] Edit both records in place. Don't delete and re-add.

| Host | Type | From | To | TTL |
| --- | --- | --- | --- | --- |
| `@` | `A` | `185.230.63.107` | `75.2.60.5` | 8600 → `600` |
| `www` | `CNAME` | `pointing.wixdns.net` | `njh-therapy-2.netlify.app` | 3600 → `600` |

- [ ] Name field takes `@` and `www`, **not** the full domain. The panel appends
      it. This is the most common mistake.
- [ ] **Don't touch** MX, nameservers, or the wildcard `*`. Her mailboxes are in
      this same panel.
- [ ] Read both records back before moving on. A typo needs her to fix.
- [ ] **Before she logs out: ask for delegate access.** Domains → Manage All →
      delegate access. Otherwise every future DNS change needs another meeting.
      If she says no, agree she's reachable by phone for a week.

Zone was checked beforehand: one `A`, one `CNAME`, no `AAAA`, no `CAA`, no
DNSSEC. Nothing hidden to clean up.

Then in Netlify:

- [ ] Domain management → **Verify DNS configuration**, once.
- [ ] **Expect it to fail all afternoon.** The old TTL is 8600. Normal. Don't
      keep pressing.
- [ ] Certificate and `www` primary are **evening jobs**. Say so out loud.

## 2. Gmail

Needs no login but the Gmail. Runs whatever happened above.

- [ ] Recovery **email** → hers
- [ ] Recovery **phone** → hers
- [ ] Password — **she types it**
- [ ] 2-Step Verification: if it's on your phone, move it or turn it off
- [ ] Security → Your devices → sign out yours
- [ ] Revoke app passwords and third-party app access
- [ ] Check filters and forwarding
- [ ] **She signs in on her own phone before you leave.** New accounts challenge
      on first unfamiliar device.
- [ ] Tell her Resend account emails will land here, and what they are.

## 3. Say out loud

- She owns the domain and the inbox. She is never locked in.
- Changes go through you — agree turnaround and cost. Format: which page, what it
  should say, photos attached.
- **Don't cancel Wix yet.** It's the rollback. Few months, then cancel. Export
  anything living inside Wix first: enquiry history, contacts, bookings, blog.
- Leave a one-pager: domain, email and DNS at 123-reg; site on your Netlify from
  the GitHub repo; mail via Resend; enquiries to the Gmail.

## 4. That evening — where this finishes

Allow 2–3 hours from the record change.

- [ ] Netlify → **Verify DNS configuration**. Should pass now.
- [ ] Wait for the certificate.
- [ ] Check the site on your phone **on mobile data**, not home wifi.
- [ ] Set **`www` as primary**.
- [ ] Send a real enquiry through the live form.
- [ ] Only now, tell her it's live.

---

## Contingencies

### 123-reg won't manage DNS — "external nameservers"

A GoDaddy account exists after all. Do Gmail, the walkthrough, the sign-off.
Leave DNS for whenever she finds that login. Nothing else depends on it.
Re-delegating nameservers back to 123-reg is a last resort — it moves the whole
zone and MX has to be rebuilt by hand. Not in the room.

### Check the records actually saved

Bypasses every cache. Returns the new values the moment they're written.

```bash
dig @ns35.domaincontrol.com njhsportstherapy.co.uk A +short
```

```bash
dig @ns35.domaincontrol.com www.njhsportstherapy.co.uk CNAME +short
```

Expect `75.2.60.5` and `njh-therapy-2.netlify.app`. If you get them, the records
are right and everything else is cache — including Netlify showing red.

### Site doesn't appear

1. Check for the doubled domain: `www.njhsportstherapy.co.uk.njhsportstherapy.co.uk`
2. Run the two commands above

### DNS verifies but the certificate fails

1. Wait 30 minutes. Netlify retries by itself
2. Press **Verify DNS configuration** once. If it fails, stop — repeated failures
   rate-limit you for an hour
3. Still failing: **remove the domain in Netlify, add it back**. Forces fresh
   provisioning, touches no DNS
4. Wait 30 minutes, press Verify once more
5. Still failing: leave it overnight, Netlify keeps retrying
6. Still failing next morning: Netlify support

**Never switch nameservers to fix this.** It works, and it takes her email down.

### "Provisioning a certificate, you cannot change custom domains"

A failed attempt holding a UI lock. Harmless. Clears itself in 5–15 minutes.

### Her email stops

```bash
dig +short MX njhsportstherapy.co.uk
```

Expect `mx0.123-reg.co.uk` (10) and `mx1.123-reg.co.uk` (20). If they're gone the
nameservers were changed — put them back to `ns35`/`ns36.domaincontrol.com`. This
is what the zone screenshot is for.

### Rollback the site

Needs panel access.

| Host | Type | Value |
| --- | --- | --- |
| `@` | `A` | `185.230.63.107` |
| `www` | `CNAME` | `pointing.wixdns.net` |

### The form stops working

It shouldn't — relative endpoint, no origin check, Resend reads neither record.
If it does: Netlify → Functions → `enquiry` → logs. That's the only record an
enquiry existed.

---

## Her questions

**"Will I lose my Google ranking?"** No. `public/_redirects` maps every old Wix
URL. Expect a wobble for a few weeks. Submit the sitemap in Search Console after.

**"How do I change my prices?"** Email you.

**"Does cancelling Wix affect my email?"** No. Mailboxes and domain are both at
123-reg. Wix is two lines of DNS.
