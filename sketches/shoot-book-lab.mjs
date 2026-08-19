/* Capture the six bindings from the built pages.

   file:// rather than a dev server, because build-book-lab.mjs already inlines
   the fonts and the stylesheet — same reason the charity captures do it.

   Run: node sketches/build-book-lab.mjs && node sketches/shoot-book-lab.mjs */

import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "out");

const pages = readdirSync(out)
  .filter((f) => /^book-[a-f]\.html$|^book-(sheet|turn)\.html$/.test(f))
  .sort();

const browser = await chromium.launch();
const errors = [];

for (const file of pages) {
  const wide = /sheet|turn/.test(file);
  const page = await browser.newPage({
    viewport: { width: wide ? 1500 : 1360, height: 900 },
    deviceScaleFactor: 2,
  });
  page.on("console", (m) => m.type() === "error" && errors.push(`${file}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${file}: ${e}`));
  await page.goto(pathToFileURL(resolve(out, file)).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const png = file.replace(/\.html$/, ".png");
  await page.screenshot({ path: resolve(out, png), fullPage: true });
  console.log(png);
  await page.close();
}

console.log(errors.length ? `ERRORS: ${errors.join(" | ")}` : "no console errors");
await browser.close();
