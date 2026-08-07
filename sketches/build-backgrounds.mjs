/* Shoot every background treatment over the real /faq, /testimonials and
   /prices pages.

   The pages are driven live from the dev server rather than rebuilt here, so
   what the captures show is the shipped layout with a layer added behind it —
   which is exactly the change being proposed. Nothing about the content,
   spacing or components is touched.

   Run: node sketches/build-backgrounds.mjs [port]  */

import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { VARIANTS } from "./backgrounds.js";

const PORT = process.argv[2] || "5175";
const OUT = fileURLToPath(new URL("./out/backgrounds/", import.meta.url));
const PAGES = ["prices", "faq", "testimonials"];

mkdirSync(OUT, { recursive: true });

/* Sections on the light pages paint white, which would sit on top of the layer.
   Making them transparent is the only structural change any of this needs, and
   it is the change that would go into src/ too. The navy CTA and footer keep
   their own background and stay opaque. */
const SHARED_CSS = `
  body { position: relative; background: oklch(100% 0 0); }
  .page-hero, .prices-page, .editorial-section, .voices, .faq-journey,
  .site-header { background: transparent !important; }
  main, .site-footer, .page-cta { position: relative; z-index: 1; }
  .site-header { z-index: 40; }
  .sk-bg {
    position: absolute; top: 0; left: 0; width: 100%;
    z-index: 0; overflow: hidden; pointer-events: none;
  }
  .sk-bg > * { will-change: auto; }
`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

for (const route of PAGES) {
  for (const v of VARIANTS) {
    await page.goto(`http://localhost:${PORT}/${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    /* Settle every scroll-triggered reveal before measuring, or the layer is
       sized to a page that has not finished expanding. */
    await page.evaluate(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.remove("pre-reveal");
        el.classList.add("is-visible");
      });
      const fill = document.querySelector(".faq-journey__spine-fill");
      if (fill) fill.style.transform = "scaleY(1)";
    });

    await page.evaluate(
      ({ sharedCss, css, html }) => {
        const style = document.createElement("style");
        style.textContent = sharedCss + css;
        document.head.append(style);

        const layer = document.createElement("div");
        layer.className = "sk-bg";
        layer.innerHTML = html;
        document.body.prepend(layer);

        /* The layer spans the document, not the viewport, so a full-page
           capture shows the whole treatment rather than one screen of it.
           Stop it above the navy CTA — nothing below that band should be
           carrying a light-page background. */
        const cta = document.querySelector(".page-cta");
        const stop = cta
          ? cta.getBoundingClientRect().top + window.scrollY
          : document.body.scrollHeight;
        layer.style.height = `${stop}px`;
        document.documentElement.style.setProperty("--sk-cta-height", "140px");
      },
      { sharedCss: SHARED_CSS, css: v.css, html: v.html },
    );

    await page.waitForTimeout(450);
    await page.screenshot({ path: `${OUT}${route}-${v.id}.png`, fullPage: true });
    console.log(`${route} · ${v.id} ${v.name}`);
  }
}

console.log(errors.length ? `ERRORS: ${errors.join(" | ")}` : "no page errors");
await browser.close();
