/* Screenshot the pre- and postnatal chapters on /pilates at two window
   heights — a tall one that shows the full 4:5 panel and a short one that
   forces the near-square crop the object-position rules exist for. */

import { chromium } from "playwright-core";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();

for (const chapter of ["prenatal", "postnatal"]) {
  for (const [suffix, viewport] of [
    ["tall", { width: 1440, height: 940 }],
    ["short", { width: 1440, height: 700 }],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await page.goto("http://localhost:5175/pilates", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Scroll to the chapter's own start — block: "center" parks the seam in
    // the middle of the viewport and the next chapter covers half the panel.
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }, chapter);
    // Let reveal-on-scroll transitions finish before the capture.
    await page.waitForTimeout(1200);
    const shot = resolve(here, "out", `${chapter}-${suffix}.png`);
    await page.screenshot({ path: shot });
    console.log(shot);
    await page.close();
  }
}

await browser.close();
