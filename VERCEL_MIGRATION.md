# NJH on Vercel

The Vercel build runs `BASE_PATH=/ npm run build`, so assets and deep links stay at the domain root. The enquiry handler and its email template are reused through `/api/enquiry`. Existing 301 redirects are preserved, and non-API routes retain the SPA fallback. Vercel test hostnames receive `X-Robots-Tag: noindex`; the customer domain does not.

## Before changing DNS

- Copy the current Netlify runtime settings to this Vercel project: `RESEND_API_KEY`, `MAIL_FROM`, and any configured `MAIL_TO`, `MAIL_BCC`, `MAIL_FROM_NAME`.
- Verify an enquiry reaches the intended mailbox and a provider failure remains visible to the sender. Use a designated test recipient for testing.
- Run `npm run test:migration` and verify `/pilates`, `/studio`, `/client-stories`, old-page redirects, images and the contact form on the Vercel deployment.
- Connect this repository to the new Vercel project for ongoing builds after the migration change is merged.
- Add both `njhsportstherapy.co.uk` and `www.njhsportstherapy.co.uk`, retaining www as the primary hostname. Validate HTTPS before switching traffic.
- Ask the domain owner to update only the website A/CNAME records to the exact targets shown in Vercel. Preserve MX, TXT and email records. No registrar transfer is needed.
- Keep the Netlify deployment available until DNS caches expire and the Vercel site is verified; rollback restores the previous DNS targets.

No DNS changes or live enquiries were made by the migration tests. The test suite uses an in-process mock mail service.
