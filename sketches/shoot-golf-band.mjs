/* Capture the "Pilates for golfers" band from this session's dev server, to
   check the golfer backdrop and the scrim over it.

   The in-app preview pane reports innerWidth 0 and paints white, so real
   captures come from here instead.

   Run: node sketches/shoot-golf-band.mjs [port] */

import { chromium } from "playwright-core";

const port = process.argv[2] ?? "5195";
const browser = await chromium.launch();

/* The design width, the point where the split gives up and the scrim goes
   near-solid, and a phone. */
const FRAMES = [
  ["desktop", 1440, 900],
  ["tablet", 900, 1000],
  ["mobile", 390, 844],
];

for (const [name, width, height] of FRAMES) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`http://localhost:${port}/pilates`, {
    waitUntil: "load",
    timeout: 45000,
  });
  await page.waitForTimeout(2500);

  const band = page.locator(".pilates-golf");
  await band.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const measured = await page.evaluate(() => {
    const el = document.querySelector(".pilates-golf__photo");
    const section = document.querySelector(".pilates-golf");
    const copy = document.querySelector(".pilates-golf__content");
    const cs = getComputedStyle(el);
    const r = section.getBoundingClientRect();
    return {
      band: { w: r.width, h: r.height, left: r.left },
      photo: el.getBoundingClientRect().toJSON(),
      copyRight: copy.getBoundingClientRect().right,
      bgPos: cs.backgroundPosition,
      docWidth: document.documentElement.clientWidth,
    };
  });
  console.log(name, JSON.stringify(measured));

  // Viewport rather than element, so the band is seen in the page it sits in
  // and nothing outside it is mistaken for part of it.
  await page.screenshot({ path: `sketches/out/golf-band-${name}.png` });
  console.log(`golf-band-${name}.png`);
  await page.close();
}

await browser.close();
