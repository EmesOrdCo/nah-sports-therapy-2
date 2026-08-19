/* Capture the casebook on the real /client-stories: desktop closed, mid-turn
   and open, then the flat sheet at phone width. */
import { chromium } from "playwright-core";

const OUT = process.argv[2] || "sketches/out";
const URL = "http://localhost:5193/client-stories";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
});
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(URL, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const geo = await page.evaluate(() => {
  const zone = document.querySelector("[data-story-zone]");
  const scene = document.querySelector("[data-story-scene]");
  const zr = zone.getBoundingClientRect();
  return {
    zoneTop: Math.round(zr.top + window.scrollY),
    travel: Math.round(zr.height - scene.getBoundingClientRect().height - 80),
  };
});
console.log(JSON.stringify(geo));

const shot = async (name, y) => {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/book-${name}.png` });
};

await shot("closed", geo.zoneTop + geo.travel * 0.08);
await shot("mid", geo.zoneTop + geo.travel * 0.5);
await shot("open", geo.zoneTop + geo.travel * 0.97);

const phone = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
phone.on("console", (m) => m.type() === "error" && errors.push(m.text()));
phone.on("pageerror", (e) => errors.push(String(e)));
await phone.goto(URL, { waitUntil: "networkidle" });
await phone.evaluate(() => document.fonts.ready);
await phone.evaluate(() => {
  const sheet = document.querySelector(".story-book");
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.remove("pre-reveal");
    el.classList.add("is-visible");
  });
  sheet.scrollIntoView({ block: "center", behavior: "instant" });
});
await phone.waitForTimeout(600);
await phone.screenshot({ path: `${OUT}/book-mobile.png` });

console.log(errors.length ? `ERRORS: ${errors.join(" | ")}` : "no console errors");
await browser.close();
