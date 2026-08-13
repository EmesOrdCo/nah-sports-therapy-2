/* One-off check for the room gallery on /studio growing to four frames:
   the section as it lands, then each of the two new photographs traded
   into the plate — Mark's machines-in-place shot and the terrace at dusk.

   Run: node sketches/shoot-studio-room-gallery.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5175";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await page.goto(`http://localhost:${port}/studio`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2000);
await page.locator("#studio").scrollIntoViewIfNeeded();
await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
await page.waitForTimeout(1200);
await page.locator("#studio").screenshot({
  path: "sketches/out/studio-room-gallery.png",
});

const picks = page.locator("#studio [data-gallery-pick]");
await picks.nth(1).click({ force: true });
await page.waitForTimeout(1200);
await page.locator("#studio").screenshot({
  path: "sketches/out/studio-room-gallery-machines.png",
});

// room-machines is on the plate now, so the dusk frame is the last pick still.
await picks.nth(2).click({ force: true });
await page.waitForTimeout(1200);
await page.locator("#studio").screenshot({
  path: "sketches/out/studio-room-gallery-dusk.png",
});

await browser.close();
console.log("studio-room-gallery{,-machines,-dusk}.png");
