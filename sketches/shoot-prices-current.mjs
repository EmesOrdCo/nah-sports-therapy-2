/* Capture the live /prices page from a running dev server, desktop and mobile.
   Run: node sketches/shoot-prices-current.mjs [port] */
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const port = process.argv[2] ?? "5175";
const browser = await chromium.launch();

const SIZES = [
  ["prices-current.png", 1440, 940],
  ["prices-current-mobile.png", 390, 844],
];

for (const [name, width, height] of SIZES) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  await page.goto(`http://localhost:${port}/prices`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // A full-page capture never scrolls, so the reveal observer never fires and
  // everything below the fold shoots at opacity 0. Settle it by hand.
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.remove("pre-reveal");
      el.classList.add("is-visible");
    });
  });
  await page.waitForTimeout(800);
  const out = resolve(here, `out/${name}`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(out);
  await page.close();
}

await browser.close();
