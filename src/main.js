import "./fonts.css";
import "./style.css";
import "./about/about.css";
import { initPageFeatures, renderRoute } from "./site-content.js";
import { observeBase, routePath } from "./base-path.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initScrollDrift } from "./scroll-drift.js";
import { initScrubIn } from "./scrub-in.js";
import { initDrawnSequence } from "./drawn-sequence.js";
import { initStepWave } from "./step-wave.js";
import { initFaqJourney } from "./faq/index.js";
import { initAboutPage } from "./about/index.js";
import { initOpeningMove } from "./opening-move.js";
import { initContactSelects } from "./contact/index.js";
import { initVoicesWall } from "./voices-wall.js";
import { initFilmShelf } from "./films.js";
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

/* The /client-stories service switch used to live here. It has gone with the
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

/* The fascia map on /sports-therapy counts itself in — the centre first, then
   the six labels in the order they are numbered — and a count is only worth
   running if you are watching it happen. That is why it is not on the shared
   reveal above: the site-wide trigger fires 12% BELOW the fold, which is the
   right moment for a paragraph settling into place and the wrong one here.
   The sequence takes about 1.2s end to end, so fired from down there it was
   over, and the diagram at rest, before any of it had reached the screen.

   This one waits until the figure's top edge is at mid-screen. By then the
   centre of the map is fully in view and only its bottom row is still below
   the fold — which arrives last anyway, by which point the scroll has carried
   it up. Measured off the top edge rather than a share of the element, so it
   does not change meaning when the map stacks tall on a phone: a threshold of
   0.6 on a figure taller than the window can never be met, and the six would
   simply never arrive.

   Everything is gated the same way the shared reveal is — .pre-reveal is only
   ever added on the branch that goes on to observe, so no JS, no observer or
   reduced motion all leave the map at rest and visible. */
const fasciaMap = document.querySelector(".fascia-map");
if (fasciaMap && !reducedMotion.matches && "IntersectionObserver" in window) {
  let fasciaDelivered = false;
  const fasciaObserver = new IntersectionObserver(
    (entries, observer) => {
      fasciaDelivered = true;
      if (!entries.some((entry) => entry.isIntersecting)) return;
      fasciaMap.classList.remove("pre-reveal");
      observer.disconnect();
    },
    { threshold: 0, rootMargin: "0px 0px -50% 0px" },
  );
  fasciaMap.classList.add("pre-reveal");
  fasciaObserver.observe(fasciaMap);
  // Same safety net as the shared reveal, and the same reasoning: a working
  // observer always delivers an initial batch, so silence means it is broken.
  window.setTimeout(() => {
    if (fasciaDelivered) return;
    fasciaMap.classList.remove("pre-reveal");
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
  // Last figures written per chapter, so an unchanged frame writes nothing.
  const seams = new Map();
  const opens = new Map();

  const measurePanelTop = () => {
    panelTop =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-scrolled",
        ),
      ) || 0;
  };

  /* How far the boundary has to lift off the foot of the panel before the
     corner is fully round, in px. The corner used to be a straight switch —
     nothing at all until the seam was a pixel clear of the bottom, then the
     whole radius — so it appeared at full size inside a single frame, right at
     the handover between one chapter and the next. That pop is exactly the
     moment a reader is looking at the boundary. Grown over this distance
     instead, the corner opens as the arriving chapter's edge leaves the fold.
     Wide enough to take a few frames at reading pace, short enough that the
     corner is fully itself long before the boundary is anywhere near the
     middle of the screen. */
  const RADIUS_RAMP = 40;

  const drawSeams = () => {
    seamQueued = false;
    /* Floored, because it is the far end of the clamp below: a fold shorter
       than the header — a collapsed or hidden window — would otherwise clamp
       the seam to a NEGATIVE inset and cut the panels the wrong way. */
    const panel = Math.max(window.innerHeight - panelTop, 0);

    /* Read every edge, then write every seam. Interleaving the two makes the
       browser flush layout once per chapter instead of once per frame — the
       same trap scroll-drift.js calls out, and the reason it measures its
       groups in one pass before it moves any of them.

       Only another chapter climbs over one. What follows the story is an
       ordinary section that pushes the last photograph up the page instead, so
       that pair's edges never move and the stylesheet keeps them. */
    const edges = storyChapters.map((chapter, index) =>
      storyChapters[index + 1]
        ? storyChapters[index + 1].getBoundingClientRect().top
        : null,
    );

    storyChapters.forEach((chapter, index) => {
      const top = edges[index];
      if (top === null) return;

      /* Whole pixels. This figure is a cut across two panels the size of the
         screen, one of them a full-bleed photograph, and every distinct value
         is a fresh clip for both of them — so the seven decimal places this
         used to carry bought a repaint on every frame of every scroll for a
         boundary that had not visibly moved. Rounded, a frame that shifts the
         line by less than a pixel writes nothing at all, which is most frames
         while the page is easing to rest. */
      const seam = Math.round(Math.min(Math.max(top - panelTop, 0), panel));
      // A seam still at the foot of the panel is nothing arriving yet, and a
      // rounded corner there would just be two notches sitting at the bottom
      // of the screen. The stylesheet spends this 0..1 on --story-radius.
      const open = Math.min((panel - seam) / RADIUS_RAMP, 1).toFixed(2);

      if (seams.get(chapter) !== seam) {
        seams.set(chapter, seam);
        chapter.style.setProperty("--seam", `${seam}px`);
      }
      if (opens.get(chapter) !== open) {
        opens.set(chapter, open);
        chapter.style.setProperty("--seam-open", open);
      }
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
  /* Marks the chapters whose cut actually travels — every one but the last,
     which has nothing climbing over it and so keeps a clip that never changes.
     The stylesheet hangs those panels' compositor layers off this, so a
     chapter that never moves, and every chapter under reduced motion or with
     no JS at all, is left as ordinary paint rather than being handed two
     screen-sized tiles to hold for a boundary that will not move. Set before
     the first draw so the class and the seams land together. */
  storyChapters
    .slice(0, -1)
    .forEach((chapter) => chapter.classList.add("is-seamed"));

  measurePanelTop();
  drawSeams();
}

/* The drawn S-curve thread that ran behind the quotes went with the single
   column it was threading. Three columns each moving on their own already
   carry the band; a line weaving behind them had nothing left to join up. */
initVoicesWall();

/* The film shelf above that wall, when /client-stories has one. No-ops while
   films.js has no films in it, which is the state it ships in. */
initFilmShelf();

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
   reviews.js rather than into index.html, so the home page and /client-stories
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

/* The quote band under the studio flies up as you scroll down to it and sinks
   back as you scroll away, one half leading the other. Scrubbed
   against the band's own position rather than fired at a moment — see
   scrub-in.js for why, and for what makes each of these four numbers
   load-bearing.

   A stretch of the band's approach each: the photograph sets off just after
   the navy and is still going long after it has landed, so the pair reads as
   one leading and one following. Written as where the band's top sits in the
   fold rather than as a split of one run, because each boundary has to agree
   with a travel distance in the stylesheet, and that is far easier to read
   side by side:

     navy   starts at 1.00  ->  travels 10vh, needs more than 0
     photo  starts at 0.92  ->  travels 20vh, needs more than 8

   TWO NUMBERS DECIDE WHETHER THIS READS AS MOVEMENT OR AS A JUMP, and they
   pull against each other:

     - The RANGE, (from - to), is how much scrolling the entrance is spread
       over, and so how many frames you get to see it in. Weighted scrolling
       hands a flick about 44px on its biggest frame and a hard one about
       100px, so a range has to be worth a few hundred pixels before the run
       is more than two or three frames long.
     - The SPEED is 1 + travel/range, because the band is climbing the screen
       at 1px per px of scroll while the panel climbs out of it. A panel
       moving much faster than the page it sits in stutters against
       everything around it however smooth its own arithmetic is.

   The band was tuned the other way first — 0.88 -> 0.72 against 14vh — and
   both went wrong together: a 16vh range is 115px, which a normal flick
   crosses in six frames and a hard one in three, and 14vh of travel over it
   put the navy on screen at 1.88x page speed. Shortening a range to make the
   motion perceptible at reading pace is also what makes it a jump at flick
   pace; the fix is the opposite move, a long range with a short travel.
   These figures span 216px and 410px at a 720px fold — nine and fourteen
   frames of a normal flick, against six and eleven — and hold both panels
   near 1.33x.

   Starting the navy at 1.00 — the band's top edge exactly on the bottom of
   the screen — is what buys the short travel. A panel waiting its turn sits
   one travel below its resting place and has to clear the bottom of the
   screen, so a later start needs a deeper displacement to stay hidden, and a
   deeper displacement is speed. Earliest start, shortest travel, longest run.

   The CSS reads both properties, and swaps which of the pair they drive on a
   phone, where the photograph is the half stacked on top. */
initScrubIn(document.querySelector(".voice-panel__card"), [
  { property: "--voice-in", from: 1.0, to: 0.7 },
  { property: "--voice-in-late", from: 0.92, to: 0.35 },
]);

/* The pair of cards under "What sports therapy helps with" arrives the same
   way, and for the same reason: they are a two-panel band on a page of static
   ones, so the quote band's entrance is the one they should share. Outcomes
   leads and the navy conditions card comes up behind it — see .st-pair, which
   is where the 14vh and 20vh these fractions are paired with actually live.

   The quote band's own range does not transfer, though: the band is a strip,
   and this pair is two full-height cards. Run to the band's 0.3 and the navy
   card is still climbing when its own foot is already off the bottom of the
   screen — you scroll a fold and a half past the heading before the row is at
   rest. So the run is pulled up the fold: it starts as the pair's top edge
   crosses the bottom of the screen and is finished by the time that edge is at
   mid-screen, with the whole row in front of you.

     outcomes   starts at 1.00  ->  travels 14vh, needs more than 0
     conditions starts at 0.86  ->  travels 20vh, needs more than 14

   Pulling the run up shortens it, so the travels come down with it to hold the
   ratio of movement to scroll: the navy card still moves about three quarters
   of a pixel per pixel of scroll, as it did before. */
initScrubIn(document.querySelector(".st-pair"), [
  { property: "--pair-in", from: 1.0, to: 0.86 },
  { property: "--pair-in-late", from: 0.86, to: 0.6 },
]);

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
  // "/clinic-policies" left this map when the practical details section moved
  // to /faq. It does not need an entry in a new one: the route carries
  // scrollTarget: "practical" from site-content, and routeState.scrollTarget
  // is read before any of these maps below.
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

/* The opening move: on these three routes the first scroll down carries the
   reader from the head of the page to the thing the page is for, and stops
   there. One entry per route, naming that thing — see opening-move.js.

   BEFORE initSmoothScroll(): the move takes a qualifying wheel tick out of
   circulation entirely, and when an event's target is window itself the
   listeners run in registration order rather than capture-then-bubble, so
   being registered first is what makes stopping the tick reliable.

   Not armed at all when the route has already asked for a section:
   /charity-work and the legacy anchors land the reader somewhere deliberate,
   and this would set off from under them. */
const openingMoveTargets = {
  "/about": ".av-e__opening", // the quote that turns from her to you
  "/prices": ".prices-page", // the fees
  "/price-list": ".prices-page",
  /* Whichever of the two a page actually opens with. A selector list matches
     in document order, not in the order it is written, so this is the film
     shelf on the films side and the wall of quotes on the reviews side — and
     with no films at all, /client-stories is the wall and this still finds it.
     The switch above them is not a target: it is one row of two links, and
     carrying the reader to it would stop them short of the thing they came
     for. */
  /* The lead film, which on this page is the head — so the one scroll centres
     it in the window rather than carrying the reader anywhere. With no films
     the route is the wall of quotes instead, and .films-hero__lead is not
     there to match. Not ".films": that is now only the EARLIER films, and
     travelling to it would carry the reader straight past the lead. */
  "/client-stories": ".films__lead, .voices",
  "/client-stories/reviews": ".voices",
  "/client-stories/journeys": ".journeys",
  "/testimonials": ".voices",
};
if (!initialSection) {
  const opening = openingMoveTargets[routePath()];
  if (opening) initOpeningMove(opening);
}

initAboutPage();
initSmoothScroll();
/* Only ever reads the window's scroll position, so it follows whatever moved
   it. No-ops wherever nothing is marked data-drift, which today is /studio's
   three media columns. */
initScrollDrift();
initDrawnSequence();
/* After initDrawnSequence, and for the same reason it runs where it does: the
   line is measured off boxes that [data-reveal] may still be transforming, so
   it reads offsetTop rather than a rect and has to run once the markup is in
   place. No-ops on every page without a [data-step-wave] group, which today is
   all of them but /sports-therapy. */
initStepWave();
initPageFeatures();
initFaqJourney();
// After initPageFeatures: the contact page's submit listener has to run second
// so it can put focus on a dropdown the shared handler could not reach.
initContactSelects();

/* The hairline under each section title on /sports-therapy and /pilates is
   also the page's progress bar: its brand-coloured lead is short on the first
   title and full on the last, so a reader who has scrolled to the fourth of
   six sections sees a rule four-sixths filled. One bar per section rather
   than one bar for the page — the reader is never looking at more than one of
   them, and the fraction is legible in the section they are actually in.
   See .title-rule in the stylesheet for how the two colours are painted.
   No-ops on every page that has no section titles marked, which today is all
   of them but those two.

   The step is the title's ORDINAL among the page's titles, not its measured
   offset. Both say "further down the page" — the titles are in document order
   — but an ordinal needs no measuring, so it cannot be thrown by a late font
   or an image that lands after this runs, and it does not have to be redone
   on resize. It also guarantees the two ends: first title short, last title
   full, whatever the sections between them turn out to be worth in pixels.

   The floor is 14% rather than 0 so the first rule still reads as a rule with
   a coloured start, the same as every other one on the page. At 0 the opening
   section would be the only title on the site under a plain hairline, which
   looks like the treatment failing rather than like a bar at its beginning. */
const titleRules = [...document.querySelectorAll(".title-rule")];
if (titleRules.length > 1) {
  const FLOOR = 0.14;
  const last = titleRules.length - 1;
  titleRules.forEach((rule, index) => {
    const filled = FLOOR + (1 - FLOOR) * (index / last);
    rule.style.setProperty("--title-rule-lead", `${(filled * 100).toFixed(2)}%`);
  });
}
