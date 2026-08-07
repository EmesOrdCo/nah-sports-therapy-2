/* Screenshot the built charity directions with headless Chromium, then stack
   them into one contact sheet for comparison.

   Run: node sketches/shoot-charity.mjs  (after build-charity.mjs) */

import { chromium } from "playwright-core";
import { readdirSync, writeFileSync } from "node:fs";
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
  .filter((f) => /^charity-[a-z]+\.html$/.test(f))
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

/* Contact sheet — the six directions stacked at 1440 wide, so they can be
   scrolled in one view rather than opened one file at a time. */
const sheet = `<!doctype html><html><head><meta charset="utf-8" />
<title>Charity directions — contact sheet</title>
<style>
  body{margin:0;background:#0d1226;font-family:system-ui,sans-serif}
  img{display:block;width:1440px;margin:0 auto}
  hr{height:26px;margin:0;border:0;background:#0d1226}
</style></head><body>
${files.map((f) => `<img src="${f.replace(/\.html$/, ".png")}" alt="" /><hr />`).join("\n")}
</body></html>`;
writeFileSync(resolve(outDir, "charity-contact-sheet.html"), sheet);

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(pathToFileURL(resolve(outDir, "charity-contact-sheet.html")).href, {
  waitUntil: "networkidle",
});
const sheetShot = resolve(outDir, "charity-contact-sheet.png");
await page.screenshot({ path: sheetShot, fullPage: true });
console.log(sheetShot);

await browser.close();
