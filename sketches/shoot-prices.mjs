/* Screenshot the built prices directions with headless Chromium.

   The in-app preview pane only paints a thin strip of its viewport, so real
   captures come from here instead.

   Run: node sketches/shoot-prices.mjs  (after build-prices.mjs) */

import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
});

const files = readdirSync(outDir)
  .filter((f) => /^prices-[a-z]\.html$/.test(f))
  .sort();

for (const file of files) {
  await page.goto(pathToFileURL(resolve(outDir, file)).href, {
    waitUntil: "networkidle",
  });
  // font-display is block on the inlined faces, but wait explicitly rather
  // than race them — a fallback-serif capture would misrepresent an option.
  await page.evaluate(() => document.fonts.ready);
  const shot = resolve(outDir, file.replace(/\.html$/, ".png"));
  await page.screenshot({ path: shot, fullPage: true });
  console.log(shot);
}

await browser.close();
