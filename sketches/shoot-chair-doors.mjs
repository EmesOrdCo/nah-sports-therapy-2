/* One-off check for the re-cut chair-doors photograph: the home page's
   Pilates chapter with its gallery stepped to the Stability Chair slide.

   Run: node sketches/shoot-chair-doors.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5175";
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
await page.locator('#pilates [data-gallery-go="2"]').click({ force: true });
await page.waitForTimeout(1200);
await page.locator("#pilates").screenshot({
  path: "sketches/out/chair-doors-recut.png",
});
await browser.close();
console.log("chair-doors-recut.png");
