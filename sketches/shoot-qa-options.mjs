/* Screenshot the built About Q&A directions with headless Chromium.

   Run: node sketches/shoot-qa-options.mjs  (after build-qa-options.mjs) */

import { chromium } from "playwright-core";
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { SPINES } from "./qa-options.js";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
});

const files = readdirSync(outDir)
  .filter((f) => /^qa-[a-z]\d?\.html$/.test(f))
  .sort();

const strips = [];

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

  /* For the spine treatments, also cut a tall strip down the centre column.
     Whether one line is better than another is a question about the line, and
     a full-page capture answers it at about a tenth of actual size. */
  const rail = await page.evaluate(() => {
    const el = document.querySelector("[data-spine]");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      centre: r.left + r.width / 2 + window.scrollX,
      top: r.top + window.scrollY,
      height: r.height,
    };
  });
  if (rail) {
    const width = 460;
    const strip = resolve(outDir, file.replace(/\.html$/, "-strip.png"));
    // fullPage as well as clip: a clip on its own is taken within the viewport,
    // so a spine taller than the window comes out cut off at ~845px.
    await page.screenshot({
      path: strip,
      fullPage: true,
      clip: {
        x: Math.max(0, Math.round(rail.centre - width / 2)),
        y: Math.round(rail.top),
        width,
        height: Math.round(rail.height),
      },
    });
    const id = file.replace(/^qa-a|\.html$/g, "");
    const treatment = SPINES[Number(id) - 1];
    strips.push({
      file: strip.split("/").pop(),
      label: treatment ? treatment.name.split(" — ")[0] : id,
    });
    console.log(strip);
  }
}

/* Contact sheet — the treatments side by side at actual size, which is the only
   way to judge them against each other. */
if (strips.length) {
  const sheet = `<!doctype html><html><head><meta charset="utf-8" />
<title>Spine treatments — contact sheet</title>
<style>
  body{margin:0;background:#fff;font-family:system-ui,sans-serif;display:flex;align-items:flex-start}
  figure{margin:0;flex:0 0 auto}
  figcaption{padding:14px 0 18px;color:#3C448B;font-size:12px;letter-spacing:.14em;text-transform:uppercase;text-align:center}
  img{display:block;width:460px}
</style></head><body>
${strips.map((s) => `<figure><figcaption>${s.label}</figcaption><img src="${s.file}" alt="" /></figure>`).join("\n")}
</body></html>`;
  const sheetPath = resolve(outDir, "qa-spines-sheet.html");
  writeFileSync(sheetPath, sheet);
  await page.setViewportSize({ width: 460 * strips.length, height: 1200 });
  await page.goto(pathToFileURL(sheetPath).href, { waitUntil: "networkidle" });
  // networkidle fires before the decoded strips have given the <img>s their
  // height, and fullPage measures the document as it stands — without this the
  // sheet comes out cropped to the viewport.
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalHeight > 0),
  );
  const sheetShot = resolve(outDir, "qa-spines-sheet.png");
  await page.screenshot({ path: sheetShot, fullPage: true });
  console.log(sheetShot);
}

await browser.close();
