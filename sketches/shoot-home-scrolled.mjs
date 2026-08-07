/* The header's second state: scrolled past the hero, where it goes back to
   the white fixed bar. Programmatic scrollTo does not always emit a scroll
   event here, so the event is dispatched explicitly.

   Run: node sketches/shoot-home-scrolled.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5181";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2500);
await page.evaluate(() => {
  window.scrollTo({ top: 1500, behavior: "instant" });
  window.dispatchEvent(new Event("scroll"));
});
await page.waitForTimeout(600);
await page.screenshot({ path: "sketches/out/home-live-scrolled.png" });
await browser.close();
console.log("home-live-scrolled.png");
