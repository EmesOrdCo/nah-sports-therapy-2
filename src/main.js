import "./fonts.css";
import "./style.css";
import "./about/about.css";
import { initPageFeatures, renderRoute } from "./site-content.js";
import { observeBase, routePath } from "./base-path.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initFaqJourney } from "./faq/index.js";
import { initContactSelects } from "./contact/index.js";
import { initVoicesWall } from "./voices-wall.js";
import { driftColumns } from "./drift-columns.js";

observeBase();
const routeState = renderRoute();
document.documentElement.classList.add("js");

/* The /testimonials service switch used to live here. It has gone with the
   single-column thread: the wall gives each category its own column, so the
   switch was filtering a layout that had already done the filtering — and
   picking one service left a column standing beside two empty ones. */

const siteLoader = document.querySelector(".site-loader");
if (!routeState.isHome) {
  siteLoader?.remove();
  document.body.classList.remove("is-loading");
}
const loaderStartedAt = performance.now();
const loaderMinimumDuration = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches
  ? 0
  : 2200;

function dismissSiteLoader() {
  if (!siteLoader) {
    document.body.classList.remove("is-loading");
    return;
  }
  const remaining = Math.max(
    0,
    loaderMinimumDuration - (performance.now() - loaderStartedAt),
  );

  window.setTimeout(() => {
    siteLoader.classList.add("is-complete");
    document.body.classList.remove("is-loading");
    window.setTimeout(() => siteLoader.remove(), 700);
  }, remaining);
}

if (document.readyState === "complete") dismissSiteLoader();
else window.addEventListener("load", dismissSiteLoader, { once: true });

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(
  ".home-hero, .page-hero, .pilates-hero, .clinics-hero, .therapy-hero, .cv__hero",
);
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});

navigation?.addEventListener("click", (event) => {
  const submenuButton = event.target.closest(".nav-group__top button");
  if (submenuButton) {
    const group = submenuButton.closest(".nav-group");
    const open = submenuButton.getAttribute("aria-expanded") !== "true";
    navigation.querySelectorAll(".nav-group__top button").forEach((button) => {
      if (button !== submenuButton) {
        button.setAttribute("aria-expanded", "false");
        button.closest(".nav-group")?.classList.remove("is-open");
      }
    });
    submenuButton.setAttribute("aria-expanded", String(open));
    group.classList.toggle("is-open", open);
    return;
  }
  if (!event.target.closest("a")) return;
  menuToggle?.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  menuToggle?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  navigation?.querySelectorAll(".nav-group").forEach((group) => {
    group.classList.remove("is-open");
    group
      .querySelector(".nav-group__top button")
      ?.setAttribute("aria-expanded", "false");
  });
});

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  let observerDelivered = false;
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      observerDelivered = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("pre-reveal");
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    // Fire as soon as any part of the element is within 12% of the viewport
    // bottom, so it is settling as it scrolls into the reading zone rather
    // than animating once it is already in front of you. A percentage
    // threshold would make tall elements (service cards) reveal very late.
    { threshold: 0, rootMargin: "0px 0px 12% 0px" },
  );
  revealItems.forEach((item) => {
    item.classList.add("pre-reveal");
    revealObserver.observe(item);
  });
  // Safety net: a working observer always delivers an initial batch.
  // If nothing arrived, assume it is broken and show everything.
  window.setTimeout(() => {
    if (observerDelivered) return;
    revealItems.forEach((item) => item.classList.remove("pre-reveal"));
  }, 3000);
}

/* Follow the boundary between the home page's story chapters. A chapter stays
   pinned while the next rises over it, so its own bottom edge is parked off at
   the fold and the boundary you see is the arriving chapter's top edge. The CSS
   cuts each pinned pair back to --seam and rounds that cut, which is what puts
   the same corner on both sides of the line and carries it up the screen. */
const storyChapters = [...document.querySelectorAll(".story__chapter")];
if (storyChapters.length && !reducedMotion.matches) {
  let seamQueued = false;
  // The panels park under the header, so --seam is measured down from there
  // rather than from the top of the page: it is an inset into the panel.
  let panelTop = 0;

  const measurePanelTop = () => {
    panelTop =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-scrolled",
        ),
      ) || 0;
  };

  const drawSeams = () => {
    seamQueued = false;
    const fold = window.innerHeight;
    const panel = fold - panelTop;

    storyChapters.forEach((chapter, index) => {
      // Only another chapter climbs over one. What follows the story is an
      // ordinary section that pushes the last photograph up the page instead,
      // so that pair's edges never move and the stylesheet keeps them.
      const arriving = storyChapters[index + 1];
      if (!arriving) return;
      const top = arriving.getBoundingClientRect().top;
      const seam = Math.min(Math.max(top - panelTop, 0), panel);
      chapter.style.setProperty("--seam", `${seam}px`);
      // A seam still at the foot of the panel is nothing arriving yet, and a
      // rounded corner there would just be two notches sitting at the bottom
      // of the screen. Under a pixel of it is the arriving chapter sitting
      // exactly on the fold, off by a subpixel — not a boundary either.
      chapter.style.setProperty(
        "--seam-radius",
        panel - seam > 1 ? "var(--story-radius)" : "0px",
      );
    });
  };

  const queueSeams = () => {
    if (seamQueued) return;
    seamQueued = true;
    window.requestAnimationFrame(drawSeams);
  };

  window.addEventListener("scroll", queueSeams, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measurePanelTop();
      queueSeams();
    },
    { passive: true },
  );
  measurePanelTop();
  drawSeams();
}

/* The drawn S-curve thread that ran behind the quotes went with the single
   column it was threading. Three columns each moving on their own already
   carry the band; a line weaving behind them had nothing left to join up. */
initVoicesWall();

/* The taping band on /sports-therapy runs the same drift: photographs up the
   left, down the right, the copy standing still between them. */
const tapingBand = document.querySelector(".taping-band");
if (tapingBand) {
  const rebuildTaping = driftColumns(tapingBand, {
    col: ".taping-band__col",
    view: ".taping-band__window",
    track: ".taping-band__track",
    down: "taping-band__col--down",
    speed: 15,
  });
  // Photographs are measured, not laid out from text metrics: a track measured
  // before its images have decoded is the wrong height, and the loop wraps
  // mid-shot. Each one that lands asks for a rebuild.
  tapingBand.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", () => rebuildTaping?.(), { once: true });
  });
}

/* Drift the qualifications past on a loop. The four are cloned until the track
   is at least two viewports wide, which is what lets the CSS translate it by
   half its width and land on an identical frame — the loop has no seam and
   there is always another card arriving at the edge. */
const credsTrack = document.querySelector("[data-creds-marquee]");
const credsStrip = credsTrack?.querySelector(".creds__strip");
if (credsTrack && credsStrip && !reducedMotion.matches) {
  const credsSet = [...credsStrip.children];
  // Slow enough to read a card as it goes by.
  const credsSpeed = 42;

  const buildCredsMarquee = () => {
    credsStrip
      .querySelectorAll("[data-creds-clone]")
      .forEach((clone) => clone.remove());

    const setWidth = credsStrip.scrollWidth;
    const trackWidth = credsTrack.clientWidth;
    if (!setWidth || !trackWidth) return;

    // Each half has to cover the window on its own, or the tail of the loop
    // would run out before the head comes back round.
    const copies = Math.max(1, Math.ceil(trackWidth / setWidth));
    for (let pass = 0; pass < copies * 2 - 1; pass += 1) {
      credsSet.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.dataset.credsClone = "";
        clone.setAttribute("aria-hidden", "true");
        // The observer never sees a clone, so it must not be left holding the
        // reveal's opacity: 0.
        clone.removeAttribute("data-reveal");
        clone.classList.remove("pre-reveal");
        clone.classList.add("is-visible");
        // Lazy loading is decided against the viewport, and a clone waiting
        // off to the right may never be judged visible — the originals are
        // already in cache, so there is nothing to defer.
        clone
          .querySelectorAll("img")
          .forEach((image) => image.setAttribute("loading", "eager"));
        credsStrip.append(clone);
      });
    }

    credsStrip.style.setProperty(
      "--creds-duration",
      `${(setWidth * copies) / credsSpeed}s`,
    );
    credsTrack.classList.add("is-drifting");
    // It scrolls itself now, so it is no longer a scroll container to tab into.
    credsTrack.removeAttribute("tabindex");
  };

  buildCredsMarquee();

  let credsViewport = window.innerWidth;
  let credsRebuild = 0;
  window.addEventListener("resize", () => {
    // Rebuilding restarts the loop, so only do it when the width really
    // changed — mobile fires resize whenever the address bar hides — and only
    // once the drag has settled, rather than on every pixel of it.
    if (window.innerWidth === credsViewport) return;
    credsViewport = window.innerWidth;
    window.clearTimeout(credsRebuild);
    credsRebuild = window.setTimeout(buildCredsMarquee, 200);
  });
}

const sectionLinks = [
  ...(navigation?.querySelectorAll('a[href*="#"]') || []),
].filter((link) => {
  const url = new URL(link.href, window.location.href);
  const continuousPath = document.body.classList.contains("is-pilates-page")
    ? "/pilates"
    : document.body.classList.contains("is-studio-page")
      ? "/studio"
      : document.body.classList.contains("is-therapy-page")
        ? "/sports-therapy"
        : "";
  return (
    url.hash &&
    (routePath(url.pathname) === routePath() ||
      (continuousPath && routePath(url.pathname) === continuousPath))
  );
});
const observedSections = sectionLinks
  .map((link) => {
    const hash = new URL(link.href, window.location.href).hash;
    return hash ? document.querySelector(hash) : null;
  })
  .filter(Boolean);

function updateActiveNavigation() {
  const activeSection = observedSections
    .filter((sectionElement) => {
      const bounds = sectionElement.getBoundingClientRect();
      return bounds.top <= window.innerHeight * 0.38 && bounds.bottom > 100;
    })
    .at(-1);

  sectionLinks.forEach((link) => {
    const linkHash = new URL(link.href, window.location.href).hash;
    const active =
      activeSection &&
      linkHash === `#${activeSection.getAttribute("id")}`;
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function updateHeader() {
  siteHeader.classList.toggle(
    "is-scrolled",
    window.scrollY > Math.min((hero?.offsetHeight || 120) * 0.72, 720),
  );
  updateActiveNavigation();
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const legacyPilatesSections = {
  "/individual-pilates": "individual",
  "/small-group-pilates-timetable": "small-group",
  "/blank": "pre-postnatal",
  "/pilates-for-golfers": "golfers",
  "/clinic-policies": "practical",
  "/retreats": "",
};
// Mirrors studioLegacyTargets in site-content.js. "/blank-1" moved across from
// the Pilates list when the studio section moved to /studio.
const legacyStudioSections = {
  "/links": "",
  "/clinics": "",
  "/blank-1": "studio",
};
// Charity work moved from /studio to /about, so its original URL scrolls into
// the About page rather than the studio one.
const legacyAboutSections = {
  "/charity-work": "charity",
};
const legacyTherapySections = {
  "/what-is-what-are-the-benifits": "overview",
  "/treatment": "treatment",
  "/myofascial-release": "myofascial-release",
  "/what-to-expect": "what-to-expect",
  "/kinesiology-taping": "kinesiology-taping",
  "/office-based-sports-massage": "",
};
const initialSection =
  routeState.scrollTarget ||
  legacyPilatesSections[routePath()] ||
  legacyStudioSections[routePath()] ||
  legacyAboutSections[routePath()] ||
  legacyTherapySections[routePath()] ||
  window.location.hash.replace(/^#/, "");
if (initialSection) {
  const scrollToInitialSection = () => {
    const target = document.getElementById(initialSection);
    if (!target) return;
    target.querySelectorAll("[data-reveal]").forEach((item) => {
      item.classList.remove("pre-reveal");
      item.classList.add("is-visible");
    });
    target.scrollIntoView({ behavior: "instant", block: "start" });
    updateHeader();
  };
  window.requestAnimationFrame(scrollToInitialSection);
  window.setTimeout(scrollToInitialSection, 120);
  window.addEventListener(
    "load",
    () => window.requestAnimationFrame(scrollToInitialSection),
    { once: true },
  );
}

initSmoothScroll();
initPageFeatures();
initFaqJourney();
// After initPageFeatures: the contact page's submit listener has to run second
// so it can put focus on a dropdown the shared handler could not reach.
initContactSelects();
