/* Mobile layout and anchor-jump checks for /faq. */

import { chromium } from "playwright-core";

const OUT = process.argv[2];
const browser = await chromium.launch();

/* ---- Mobile ---- */
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
await mobile.goto("http://localhost:5175/faq", { waitUntil: "networkidle" });
await mobile.evaluate(() => document.fonts.ready);

const m = await mobile.evaluate(() => {
  const box = (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), w: Math.round(r.width) };
  };
  return {
    docWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    stationColumns: getComputedStyle(document.querySelector(".faq-station"))
      .gridTemplateColumns,
    shell: box(".faq-journey__inner"),
    spine: box(".faq-journey__spine"),
    marker: box(".faq-station__marker"),
    heroSpine: box(".faq-hero__spine"),
  };
});
console.log("mobile", JSON.stringify(m));

await mobile.evaluate(() => window.scrollTo({ top: 560, behavior: "instant" }));
await mobile.waitForTimeout(300);
await mobile.screenshot({ path: `${OUT}/faq-mobile.png` });

/* ---- Anchor jumps ---- The stage strip that used to link these is gone, but
   the #stage-N anchors remain for deep links, so they are driven by hash. */
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto("http://localhost:5175/faq", { waitUntil: "networkidle" });
await desktop.evaluate(() => document.fonts.ready);

for (const n of [3, 5]) {
  await desktop.evaluate((stage) => {
    document.getElementById(`stage-${stage}`).scrollIntoView();
  }, n);
  await desktop.waitForTimeout(900);
  const landed = await desktop.evaluate((stage) => {
    const el = document.getElementById(`stage-${stage}`);
    return Math.round(el.getBoundingClientRect().top);
  }, n);
  // Anything under the 76px fixed header is hidden behind it.
  console.log(`stage-${n} lands at ${landed}px from the top of the viewport`);
}

await browser.close();
