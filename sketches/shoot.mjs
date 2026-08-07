/* Screenshot the built hero pages with headless Chromium.

   The in-app preview pane only paints a thin strip of its viewport, so real
   captures come from here instead.

   Run: node sketches/shoot.mjs  (after build-heroes.mjs) */

import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");

const WIDTH = 1440;
const HEIGHT = 940;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});

/* Only the hero pages. out/ is shared with other sketch runs, and globbing
   every .html in here would re-shoot somebody else's captures at this
   script's viewport. */
const files = readdirSync(outDir)
  .filter((f) => f.startsWith("hero-") && f.endsWith(".html"))
  .sort();

for (const file of files) {
  await page.goto(pathToFileURL(resolve(outDir, file)).href, {
    waitUntil: "networkidle",
  });
  // The inlined faces are font-display:block, but wait explicitly rather than
  // race them — a fallback-serif capture would misrepresent every option.
  await page.evaluate(() => document.fonts.ready);
  const shot = resolve(outDir, file.replace(/\.html$/, ".png"));
  await page.screenshot({ path: shot });
  console.log(shot);
}

await browser.close();
