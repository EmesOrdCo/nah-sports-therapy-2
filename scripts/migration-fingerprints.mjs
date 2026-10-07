import { createHmac } from "node:crypto";

// Temporary migration audit: fingerprints only; never log values.
if (process.env.CONTEXT === "production" && process.env.SITE_ID) {
  const keys = ["MAIL_FROM_NAME", "RESEND_API_KEY", "VITE_CONTACT_FORM_ENDPOINT", "MAIL_FROM"];
  for (const key of keys) {
    const value = process.env[key];
    console.log("MIGRATION_FINGERPRINT " + JSON.stringify({ key, digest: value ? createHmac("sha256", "hosting-migration-8842b52cf76768dacad54f9c5379d143").update(value).digest("hex") : null }));
  }
}
