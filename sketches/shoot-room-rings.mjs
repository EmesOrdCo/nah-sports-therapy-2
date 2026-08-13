/* One-off check for the room-rings photograph joining the home page's
   Pilates chapter gallery: step the gallery to the new sixth slide.

   Run: node sketches/shoot-room-rings.mjs [port] [dot] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5175";
const dot = process.argv[3] ?? "1";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2000);
await page.locator("#pilates").scrollIntoViewIfNeeded();
await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
await page.waitForTimeout(800);
await page.locator(`#pilates [data-gallery-go="${dot}"]`).click({ force: true });
await page.waitForTimeout(1200);
await page.locator("#pilates").screenshot({
  path: "sketches/out/room-rings-home.png",
});
await browser.close();
console.log("room-rings-home.png");
