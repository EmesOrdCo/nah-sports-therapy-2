/* Screenshot the built home-hero pages with headless Chromium.

   Run: node sketches/shoot-home-heroes.mjs  (after build-home-heroes.mjs) */

import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");

/* 1440x900 is the frame the current home hero was judged in, so the options
   are comparable against the before shot. */
const WIDTH = 1440;
const HEIGHT = 900;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});

const files = readdirSync(outDir)
  .filter((f) => f.startsWith("home-hero-") && f.endsWith(".html"))
  .sort();

for (const file of files) {
  await page.goto(pathToFileURL(resolve(outDir, file)).href, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  const shot = resolve(outDir, file.replace(/\.html$/, ".png"));
  await page.screenshot({ path: shot });
  console.log(shot);
}

await browser.close();
