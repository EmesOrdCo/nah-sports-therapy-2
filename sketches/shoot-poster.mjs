/* Capture each A4 sheet as a PNG at print proportions, and as a PDF that will
   come out of a home printer at true A4.

   Run: node sketches/shoot-poster.mjs  (after build-poster.mjs) */

import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");

const browser = await chromium.launch();
// 794 x 1123 CSS px is A4 at 96dpi; x2 gives a 1588px-wide image, which is
// plenty for a Facebook post and still readable when zoomed.
const page = await browser.newPage({
  viewport: { width: 794, height: 1123 },
  deviceScaleFactor: 2,
});

const files = readdirSync(outDir)
  .filter((f) => /^poster(-alt-[a-z]-[a-z]+|-l\d\d-[a-z-]+)?\.html$/.test(f))
  .sort();

for (const file of files) {
  await page.goto(pathToFileURL(resolve(outDir, file)).href, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  const base = file.replace(/\.html$/, "");
  await page.screenshot({ path: resolve(outDir, `${base}.png`) });
  await page.pdf({
    path: resolve(outDir, `${base}.pdf`),
    format: "A4",
    printBackground: true,
  });
  console.log(`${base}.png + .pdf`);
}

await browser.close();
