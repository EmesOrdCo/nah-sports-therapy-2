/* Screenshot the /about photo hero at three windows: a tall desktop, a short
   desktop (which forces the vertical crop the object-position rule exists
   for), and a phone (which forces the horizontal one). */

import { chromium } from "playwright-core";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();

for (const [suffix, viewport] of [
  ["desktop-tall", { width: 1440, height: 940 }],
  ["desktop-short", { width: 1440, height: 700 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto("http://localhost:5175/about", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const shot = resolve(here, "out", `about-hero-${suffix}.png`);
  await page.screenshot({ path: shot });
  console.log(shot);
  await page.close();
}

await browser.close();
