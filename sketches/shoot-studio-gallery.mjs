/* Screenshot the built /studio gallery pages with headless Chromium.

   Run: node sketches/shoot-studio-gallery.mjs  (after build-studio-gallery.mjs)

   Full-page rather than viewport, unlike the hero shoots: the thing being
   judged here is the whole run of the page, and a 1440x900 crop would only
   ever show the hero we already agreed on. Scale is 1 rather than 2 because
   these come out several thousand pixels tall. */

import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");

const WIDTH = 1440;
const HEIGHT = 900;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

const files = readdirSync(outDir)
  .filter((f) => f.startsWith("studio-gallery-") && f.endsWith(".html"))
  .sort();

for (const file of files) {
  await page.goto(pathToFileURL(resolve(outDir, file)).href, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  const shot = resolve(outDir, file.replace(/\.html$/, ".png"));
  await page.screenshot({ path: shot, fullPage: true });
  console.log(shot);
}

await browser.close();
