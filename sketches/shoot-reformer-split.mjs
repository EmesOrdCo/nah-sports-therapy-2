/* One-off check for the three ways of working on /pilates and the Reformer
   split with /studio: each gallery's frames load, and the corner row of picks
   stays inside the plate it laps at both widths. The phone is where a long row
   overruns, because --pick-size bottoms out at its floor there.

   Run: node sketches/shoot-reformer-split.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5175";
const browser = await chromium.launch();

const sections = [
  ["/pilates", "#mat", "mat"],
  ["/pilates", "#reformer", "pilates-reformer"],
  ["/pilates", "#stability-chair", "pilates-chair"],
  ["/studio", "#reformer", "studio-reformer"],
];

for (const [label, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  for (const [path, anchor, name] of sections) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}${path}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(anchor).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await page.waitForTimeout(1200);
    await page.locator(`${anchor} .pilates-gallery`).screenshot({
      path: `sketches/out/gallery-${name}-${label}.png`,
    });

    const fit = await page.evaluate((sel) => {
      const gallery = document.querySelector(`${sel} .pilates-gallery`);
      const picks = [...gallery.querySelectorAll(".pilates-gallery__pick")];
      const row = picks.reduce(
        (span, pick) => {
          const box = pick.getBoundingClientRect();
          return { left: Math.min(span.left, box.left), right: Math.max(span.right, box.right) };
        },
        { left: Infinity, right: -Infinity },
      );
      const plate = gallery.getBoundingClientRect();
      return {
        overrun: Math.round(Math.max(plate.left - row.left, row.right - plate.right)),
        pick: Math.round(picks[0].getBoundingClientRect().width),
        broken: [...gallery.querySelectorAll("img")].filter((i) => !i.naturalWidth).length,
      };
    }, anchor);
    console.log(
      `${name} ${label}: pick ${fit.pick}px, ` +
        `${fit.overrun > 0 ? `OVERRUNS by ${fit.overrun}px` : "inside the plate"}` +
        `${fit.broken ? `, ${fit.broken} BROKEN` : ""}`,
    );
    await page.close();
  }
}

await browser.close();
