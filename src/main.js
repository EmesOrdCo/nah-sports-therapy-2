import "./fonts.css";
import "./style.css";
import "./about/about.css";
import { initPageFeatures, renderRoute } from "./site-content.js";
import { observeBase, routePath } from "./base-path.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initFaqJourney } from "./faq/index.js";
import { initContactSelects } from "./contact/index.js";
import { initVoicesWall } from "./voices-wall.js";
import { REVIEWS, SERVICE_LABELS } from "./reviews.js";
import { driftColumns } from "./drift-columns.js";

observeBase();
const routeState = renderRoute();
document.documentElement.classList.add("js");
/* index.html carries the home page's markup, so the document is held hidden by
   the inline head script until the route it was actually asked for is in place.
   This runs in the same task as renderRoute() above: nothing paints in between,
   so an inner page's first frame is its own content, never the home page's. */
document.documentElement.classList.remove("is-booting");

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
   left, down the right, the copy standing still between them.

   It does not stop for the pointer. The copy sits between the two columns, so
   every reader who goes near the words crosses the band — and the wall of
   photographs freezing as they arrive to read is the one thing the drift was
   there to avoid. Nothing in the columns is to be read anyway. */
const tapingBand = document.querySelector(".taping-band");
if (tapingBand) {
  const rebuildTaping = driftColumns(tapingBand, {
    col: ".taping-band__col",
    view: ".taping-band__window",
    track: ".taping-band__track",
    down: "taping-band__col--down",
    speed: 15,
    pause: false,
  });
  // Photographs are measured, not laid out from text metrics: a track measured
  // before its images have decoded is the wrong height, and the loop wraps
  // mid-shot. Each one that lands asks for a rebuild.
  tapingBand.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", () => rebuildTaping?.(), { once: true });
  });
}

/* Drift a strip of cards past on a loop. The set is cloned until the front
   half of the track is wider than the window, and the CSS then translates the
   strip by exactly that many card widths — landing on an identical frame, so
   the loop has no seam and there is always another card arriving at the edge.

   The shift is handed to the CSS in pixels rather than left as -50%. A
   percentage is only a whole number of cards if the two halves are exactly
   equal, which quietly stops being true the moment the strip carries padding
   or a flex gap that the repeat does not — and the symptom of being a few
   pixels out is a strip that appears to run out and jump.

   Two strips run this now — the qualifications and the client voices under
   them — so `prefix` names the pair of custom properties each one writes, and
   nothing else about them is shared. */
function initMarquee({ track, strip, speed, prefix }) {
  if (!track || !strip || reducedMotion.matches) return;
  const set = [...strip.children];
  if (!set.length) return;

  /* One repeat measured from the cards themselves. scrollWidth would fold in
     the strip's own padding — which the drifting state then removes — and on
     the first build that inflated figure was enough to talk the loop into one
     copy too few. Each card is a fixed-width block, so its stride is its box
     plus the margin that carries the gutter plus any flex gap the breakpoint
     has added: uniform down the whole repeated stream. */
  const unit = () => {
    const gap = Number.parseFloat(getComputedStyle(strip).columnGap) || 0;
    return set.reduce((total, item) => {
      const style = getComputedStyle(item);
      const margin =
        (Number.parseFloat(style.marginRight) || 0) +
        (Number.parseFloat(style.marginLeft) || 0);
      return total + item.getBoundingClientRect().width + margin + gap;
    }, 0);
  };

  const build = () => {
    strip
      .querySelectorAll("[data-marquee-clone]")
      .forEach((clone) => clone.remove());

    const setWidth = unit();
    const trackWidth = track.clientWidth;
    if (!setWidth || !trackWidth) return;

    /* The front half has to cover the window on its own or its tail runs out
       before the head comes back round. One spare copy beyond that is the
       margin for everything measurement cannot promise — a subpixel card
       width, a scrollbar arriving, a font landing late — and one more set of
       cards is a cheap price for a loop that cannot empty. */
    const copies = Math.ceil(trackWidth / setWidth) + 1;
    for (let pass = 0; pass < copies * 2 - 1; pass += 1) {
      set.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.dataset.marqueeClone = "";
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
        strip.append(clone);
      });
    }

    const shift = setWidth * copies;
    strip.style.setProperty(`--${prefix}-shift`, `${shift}px`);
    strip.style.setProperty(`--${prefix}-duration`, `${shift / speed}s`);
    track.classList.add("is-drifting");
    // It scrolls itself now, so it is no longer a scroll container to tab into.
    track.removeAttribute("tabindex");
  };

  build();

  /* Rebuilding restarts the loop, so it is only worth doing when the width
     really changed — mobile fires resize whenever the address bar hides — and
     only once the drag has settled rather than on every pixel of it.

     Watching the track rather than the window catches the cases a resize
     event does not report at all: a card measured at zero because the section
     was still laying out, or a scrollbar appearing and taking the window in
     with it. Height is ignored, or appending the clones would retrigger this. */
  let width = track.clientWidth;
  let rebuild = 0;
  const queueRebuild = () => {
    const next = track.clientWidth;
    if (Math.abs(next - width) < 1) return;
    width = next;
    window.clearTimeout(rebuild);
    rebuild = window.setTimeout(build, 200);
  };

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(queueRebuild).observe(track);
  }
  window.addEventListener("resize", queueRebuild);
  // A late webfont changes nothing about a fixed-width logo card, but it does
  // reflow a card of text, and either may have been measured at zero before
  // then. Cheap insurance, once.
  document.fonts?.ready.then(() => {
    if (!track.classList.contains("is-drifting")) build();
  });
}

const credsTrack = document.querySelector("[data-creds-marquee]");
initMarquee({
  track: credsTrack,
  strip: credsTrack?.querySelector(".creds__strip"),
  // Slow enough to read a card as it goes by.
  speed: 42,
  prefix: "creds",
});

/* The client voices under the quote panel. The cards are written from
   reviews.js rather than into index.html, so the home page and /testimonials
   cannot drift apart — that file is the single source of truth for a review.
   The shortest ones lead: these cards go past, and a review that needs a
   second look is one the reader loses. The full set is a click away. */
const voiceRunStrip = document.querySelector(".voice-run__strip");
if (voiceRunStrip) {
  const runReviews = REVIEWS.filter((review) => review.quote.length <= 190)
    .slice(0, 9)
    .map((review) => {
      /* The one label reviews.js allows. A reader scanning the run wants to
         know which half of the practice a review is about before they read
         it, and the file already knows. */
      const services = review.services
        .map((service) => SERVICE_LABELS[service])
        .join(" &middot; ");
      return `<li>
        <p class="voice-run__service">${services}</p>
        <blockquote><p>${review.quote}</p></blockquote>
        <cite>${review.name}</cite>
      </li>`;
    })
    .join("");
  voiceRunStrip.innerHTML = runReviews;

  const voiceRunTrack = voiceRunStrip.closest("[data-voice-marquee]");
  initMarquee({
    track: voiceRunTrack,
    strip: voiceRunStrip,
    // Slower than the qualifications: these cards carry a sentence to read,
    // not a logo to recognise.
    speed: 30,
    prefix: "voice-run",
  });
}

/* "See the studio" on the home page: four labels over one photograph. A plain
   tablist — the panels carry [hidden] rather than a transparent-but-present
   state, so only the view you picked is in the accessibility tree, and the
   arriving one animates itself in. Roving tabindex, so the row is one tab stop
   and the arrows move within it. */
const studioTabs = [...document.querySelectorAll(".studio-look__tab")];
if (studioTabs.length) {
  const studioViews = studioTabs.map((tab) =>
    document.getElementById(tab.getAttribute("aria-controls")),
  );

  const showStudioView = (index, { focus = false } = {}) => {
    studioTabs.forEach((tab, position) => {
      const active = position === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      // Only the selected label is a tab stop; the rest are reached with the
      // arrow keys.
      tab.tabIndex = active ? 0 : -1;

      const view = studioViews[position];
      if (!view) return;
      view.hidden = !active;
      view.classList.remove("is-entering");
      if (active) {
        // Restart the animation on a view that was already the last one shown:
        // reading the layout between removing and adding the class is what
        // makes the browser treat it as a new one rather than the same run.
        void view.offsetWidth;
        view.classList.add("is-entering");
      }
    });
    if (focus) studioTabs[index].focus();
  };

  studioTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showStudioView(index));
    tab.addEventListener("keydown", (event) => {
      const step =
        event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? -1
            : 0;
      let next = null;
      if (step) next = (index + step + studioTabs.length) % studioTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = studioTabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      showStudioView(next, { focus: true });
    });
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
