/* One-off check for the split Reformer shoot: /pilates#reformer takes the
   session frames, /studio#reformer the ones that show the machine's parts.
   Shot at both widths because the corner row is sized off --frame-count and
   the phone is where a long row overruns the plate.

   Run: node sketches/shoot-reformer-split.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5175";
const browser = await chromium.launch();

for (const [label, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  for (const [path, name] of [
    ["/pilates", "pilates"],
    ["/studio", "studio"],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}${path}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator("#reformer").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await page.waitForTimeout(1500);
    await page.locator("#reformer .pilates-gallery").screenshot({
      path: `sketches/out/reformer-${name}-${label}.png`,
    });

    /* Does the row of picks stay inside the plate it laps? */
    const fit = await page.evaluate(() => {
      const gallery = document.querySelector("#reformer .pilates-gallery");
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
    });
    console.log(
      `${name} ${label}: pick ${fit.pick}px, ` +
        `${fit.overrun > 0 ? `OVERRUNS by ${fit.overrun}px` : "inside the plate"}` +
        `${fit.broken ? `, ${fit.broken} BROKEN` : ""}`,
    );
    await page.close();
  }
}

await browser.close();
