import { createHmac } from "node:crypto";
import net from "node:net";
import tls from "node:tls";

// Temporary migration verification: output one-way fingerprints only.
// No protected secret values leave the original hosting environment.
if (process.env.CONTEXT === "production" && process.env.SITE_ID) {
  const salt = "hosting-migration-8842b52cf76768dacad54f9c5379d143";
  const keys = ["RESEND_API_KEY"];
  for (const key of keys) {
    const value = process.env[key];
    console.log("MIGRATION_FINGERPRINT " + JSON.stringify({ key, digest: value ? createHmac("sha256", salt).update(value).digest("hex") : null }));
  }
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const certificate = await new Promise((resolve, reject) => {
        const socket = net.connect(Number(url.port || 5432), url.hostname);
        socket.setTimeout(8000, () => socket.destroy(new Error("Certificate probe timed out")));
        socket.once("error", reject);
        socket.once("connect", () => {
          const request = Buffer.alloc(8);
          request.writeInt32BE(8, 0); request.writeInt32BE(80877103, 4);
          socket.write(request);
        });
        socket.once("data", (response) => {
          if (response[0] !== 83) { socket.destroy(); reject(new Error("Database did not offer TLS")); return; }
          // Public certificate inspection only; no database credentials are sent.
          const secure = tls.connect({ socket, servername: url.hostname, rejectUnauthorized: false }, () => {
            const peer = secure.getPeerCertificate();
            resolve({ fingerprint: peer.fingerprint256, certificate: peer.raw?.toString("base64"), subject: peer.subject?.CN, validTo: peer.valid_to });
            secure.end();
          });
          secure.once("error", reject);
        });
      });
      console.log("MIGRATION_DATABASE_CERT " + JSON.stringify(certificate));
    } catch (error) { console.log("MIGRATION_DATABASE_CERT unavailable: " + error.name); }
  }
}
