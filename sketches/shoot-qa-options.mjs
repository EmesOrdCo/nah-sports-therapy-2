/* Screenshot the built About Q&A directions with headless Chromium.

   Run: node sketches/shoot-qa-options.mjs  (after build-qa-options.mjs) */

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
  .filter((f) => /^qa-[a-z]\.html$/.test(f))
  .sort();

for (const file of files) {
  await page.goto(pathToFileURL(resolve(outDir, file)).href, {
    waitUntil: "networkidle",
  });
  // font-display is block on the inlined faces, but wait explicitly rather
  // than race them — a fallback-serif capture would misrepresent an option.
  await page.evaluate(() => document.fonts.ready);
  // The spine is written from measured positions; give it a frame to land
  // after the fonts have settled the line boxes it measures.
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
  const shot = resolve(outDir, file.replace(/\.html$/, ".png"));
  await page.screenshot({ path: shot, fullPage: true });
  console.log(shot);
}

await browser.close();
