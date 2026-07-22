# NJH Sports Therapy & Pilates

A multi-page website experience built with Vite, vanilla JavaScript and Three.js. Page content is selected from the current pathname in `src/site-content.js`, while the existing homepage and visualisation are retained.

## Local development

```sh
npm install
npm run dev
```

Use `npm run build` for a production build and `npm run preview` to inspect it.

## Routes

The site includes the homepage plus dedicated Pilates, clinic, Sports Therapy, About, testimonial, contact and pricing routes. Legacy paths such as `/blank`, `/blank-1`, `/what-is-what-are-the-benifits` and `/price-list` are retained so existing inbound links continue to work. `/price-list` uses `/prices` as its canonical URL.

This is a client-routed Vite site. `public/_redirects` configures Netlify-style static hosting to serve `index.html` for direct route requests. If the production host uses different rewrite syntax, configure an equivalent catch-all rewrite.

## Contact form

The contact form submits to a Formspree-compatible endpoint:

```sh
VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

Set this value in `.env.local` for development and in the deployment provider's environment settings for production. Do not commit `.env.local`. Without an endpoint, the form shows the published NJH email address as a fallback rather than losing an enquiry.

The form includes native validation, accessible status messages, a honeypot field and consent confirmation. Provider-side spam controls should also be enabled.

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
