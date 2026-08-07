/* Capture the real /faq page from the dev server. */

import { chromium } from "playwright-core";

const OUT = process.argv[2];
const URL = "http://localhost:5175/faq";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const shot = async (name, y) => {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  // One frame for the reveal observer and the spine's rAF to settle.
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/faq-${name}.png` });
};

const geo = await page.evaluate(() => {
  const at = (s) => {
    const el = document.querySelector(s);
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  };
  return {
    height: document.body.scrollHeight,
    s1: at("#stage-1"),
    s2: at("#stage-2"),
    s3: at("#stage-3"),
    s5: at("#stage-5"),
    stations: document.querySelectorAll(".faq-station").length,
    pairs: document.querySelectorAll(".faq-pair").length,
  };
});
console.log(JSON.stringify(geo));

await shot("01-hero", 0);
await shot("02-strip", Math.max(geo.strip - 420, 0));
await shot("03-station1", geo.s1 - 150);
await shot("04-station3", geo.s3 - 150);
await shot("05-station5", geo.s5 - 150);

// Full page, with the line completed and every reveal settled, so the whole
// shape of the page can be read in one image.
await page.evaluate(() => {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.remove("pre-reveal");
    el.classList.add("is-visible");
  });
  const fill = document.querySelector(".faq-journey__spine-fill");
  if (fill) fill.style.transform = "scaleY(1)";
});
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/faq-06-full.png`, fullPage: true });

console.log(errors.length ? `ERRORS: ${errors.join(" | ")}` : "no console errors");
await browser.close();
