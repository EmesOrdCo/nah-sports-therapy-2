/* Capture the real /testimonials page from the real app.

   The other scripts in here build standalone sketch pages. This one runs the
   site itself: it starts Vite programmatically on an ephemeral port, shoots the
   page at three widths and two moments in the loop, and shuts the server down
   again. Nothing is left running.

   Run: node sketches/shoot-testimonials.mjs */

import { chromium } from "playwright-core";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "out");
const root = resolve(here, "..");

const server = await createServer({ root, server: { port: 0 } });
await server.listen();
const { port } = server.httpServer.address();
const url = `http://localhost:${port}/testimonials`;

const browser = await chromium.launch();

const SHOTS = [
  { id: "desktop", width: 1440, height: 940 },
  { id: "laptop", width: 1180, height: 800 },
  { id: "mobile", width: 390, height: 844, full: true },
];

for (const shot of SHOTS) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 2,
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const file = resolve(outDir, `testimonials-${shot.id}.png`);
  await page.screenshot({ path: file, fullPage: Boolean(shot.full) });
  console.log(file);

  /* On desktop, prove the three things a still cannot: that the columns move,
     that the band stops under the pointer, and that a stopped column then
     answers the wheel. Read straight off the windows' scroll positions, which
     is what the drift moves. */
  if (shot.id === "desktop") {
    const read = () =>
      page.$$eval(".voices__window", (views) =>
        views.map((view) => Math.round(view.scrollTop)),
      );

    const first = await read();
    await page.waitForTimeout(1800);
    const second = await read();
    console.log(
      "drifts down/up/down:",
      second[0] < first[0] && second[1] > first[1] && second[2] < first[2],
    );

    const middle = (await page.$$(".voices__window"))[1];
    const box = await middle.boundingBox();
    await page.mouse.move(
      Math.round(box.x + box.width / 2),
      Math.round(box.y + box.height / 2),
    );
    await page.waitForTimeout(300);
    const held = await read();
    await page.waitForTimeout(1400);
    console.log("stops on hover:     ", JSON.stringify(held) === JSON.stringify(await read()));

    const pageBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(400);
    const scrolled = await read();
    console.log(
      "hands over to wheel:",
      scrolled[1] > held[1] &&
        scrolled[0] === held[0] &&
        (await page.evaluate(() => window.scrollY)) === pageBefore,
    );

    await page.screenshot({ path: resolve(outDir, "testimonials-hovered.png") });
  }

  await page.close();
}

await browser.close();
await server.close();
