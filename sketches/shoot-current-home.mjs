/* Capture the live home hero from this session's dev server.

   The in-app preview pane only paints a thin strip of its viewport, so real
   captures come from here instead.

   Run: node sketches/shoot-current-home.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5181";
const browser = await chromium.launch();

/* Desktop, a short laptop, and a phone — the three the hero has distinct
   rules for. */
const FRAMES = [
  ["desktop", 1440, 900],
  ["short", 1440, 700],
  ["mobile", 390, 844],
];

for (const [name, width, height] of FRAMES) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // The loader holds the hero behind it for a beat after load.
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `sketches/out/home-live-${name}.png` });
  await page.close();
  console.log(`home-live-${name}.png`);
}

await browser.close();
