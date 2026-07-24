import "./style.css";
import { initPageFeatures, renderRoute } from "./site-content.js";

const routeState = renderRoute();
document.documentElement.classList.add("js");

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

const palettes = {
  "pre-dawn": {
    label: "Pre-dawn",
    top: "#d91aff",
    bottom: "#0008ff",
    stop: 0.75,
  },
  sunrise: {
    label: "Sunrise",
    top: "#ff29b0",
    bottom: "#9435ed",
    stop: 0.75,
  },
  daytime: {
    label: "Daytime",
    top: "#66c9ff",
    bottom: "#0000db",
    stop: 0.75,
  },
  dusk: {
    label: "Dusk",
    top: "#66c9ff",
    bottom: "#0000ff",
    stop: 0.75,
  },
  sunset: {
    label: "Sunset",
    top: "#f394ff",
    bottom: "#5b24db",
    stop: 0.75,
  },
  night: {
    label: "Night",
    top: "#ffffff",
    bottom: "#ffffff",
    stop: 0.66,
  },
};

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(
  ".fibre-field, .page-hero, .pilates-hero, .clinics-hero, .therapy-hero",
);
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const testimonialSection = document.querySelector("[data-testimonials]");
const testimonialQuotes = [
  ...document.querySelectorAll("[data-testimonial-quote]"),
];
const testimonialNodes = [
  ...document.querySelectorAll("[data-testimonial-node]"),
];
const testimonialPrevious = document.querySelector(
  "[data-testimonial-previous]",
);
const testimonialNext = document.querySelector("[data-testimonial-next]");
const testimonialCount = document.querySelector("[data-testimonial-count]");
const testimonialCurrent = document.querySelector("[data-testimonial-current]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const visualizations = [];
const visualizationCanvases = [
  ...document.querySelectorAll("[data-viz-state]"),
];
if (visualizationCanvases.length) {
  import("./data-viz.js").then(({ DataViz }) => {
    visualizationCanvases.forEach((canvas) => {
      visualizations.push(
        new DataViz(canvas, palettes.daytime, Number(canvas.dataset.vizState)),
      );
    });
  });
}

let activeTestimonial = 0;
let compassRotation = 35;
let testimonialTimer;

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

function stopTestimonialAutoplay() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = undefined;
}

function startTestimonialAutoplay() {
  stopTestimonialAutoplay();
  if (
    reducedMotion.matches ||
    document.hidden ||
    testimonialSection?.matches(":hover") ||
    testimonialSection?.contains(document.activeElement)
  ) {
    return;
  }

  testimonialTimer = window.setInterval(() => {
    updateTestimonial(activeTestimonial + 1, false);
  }, 7500);
}

function updateTestimonial(nextIndex, restartAutoplay = true) {
  if (!testimonialQuotes.length) return;

  const previousIndex = activeTestimonial;
  activeTestimonial =
    (nextIndex + testimonialQuotes.length) % testimonialQuotes.length;

  if (nextIndex !== previousIndex) {
    compassRotation += (nextIndex - previousIndex) * 120;
  }

  testimonialSection?.style.setProperty(
    "--compass-angle",
    `${compassRotation}deg`,
  );

  testimonialQuotes.forEach((quote, index) => {
    const active = index === activeTestimonial;
    quote.classList.remove("is-active");
    quote.hidden = !active;
    if (active) {
      void quote.offsetWidth;
      quote.classList.add("is-active");
    }
  });

  testimonialNodes.forEach((node, index) => {
    const active = index === activeTestimonial;
    node.classList.toggle("is-active", active);
    node.setAttribute("aria-pressed", String(active));
  });

  const currentLabel = String(activeTestimonial + 1).padStart(2, "0");
  if (testimonialCount) testimonialCount.textContent = currentLabel;
  if (testimonialCurrent) testimonialCurrent.textContent = currentLabel;

  if (restartAutoplay) startTestimonialAutoplay();
}

testimonialPrevious?.addEventListener("click", () =>
  updateTestimonial(activeTestimonial - 1),
);
testimonialNext?.addEventListener("click", () =>
  updateTestimonial(activeTestimonial + 1),
);
testimonialNodes.forEach((node, index) => {
  node.addEventListener("click", () => updateTestimonial(index));
});

testimonialSection?.addEventListener("pointerenter", stopTestimonialAutoplay);
testimonialSection?.addEventListener("pointerleave", startTestimonialAutoplay);
testimonialSection?.addEventListener("focusin", stopTestimonialAutoplay);
testimonialSection?.addEventListener("focusout", (event) => {
  if (!testimonialSection.contains(event.relatedTarget)) {
    startTestimonialAutoplay();
  }
});
reducedMotion.addEventListener("change", startTestimonialAutoplay);

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = [
  ...(navigation?.querySelectorAll('a[href*="#"]') || []),
].filter((link) => {
  const url = new URL(link.href, window.location.href);
  const continuousPath = document.body.classList.contains("is-pilates-page")
    ? "/pilates"
    : document.body.classList.contains("is-clinics-page")
      ? "/clinics"
      : document.body.classList.contains("is-therapy-page")
        ? "/sports-therapy"
        : "";
  return (
    url.hash &&
    (url.pathname === window.location.pathname ||
      (continuousPath && url.pathname === continuousPath))
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
  "/blank-1": "studio",
  "/individual-pilates": "individual",
  "/small-group-pilates-timetable": "small-group",
  "/blank": "pre-postnatal",
  "/pilates-for-golfers": "golfers",
  "/clinic-policies": "practical",
  "/retreats": "retreats",
};
const legacyClinicsSections = {
  "/testimonial": "testimonials",
  "/links": "links",
  "/charity-work": "charity",
};
const legacyTherapySections = {
  "/what-is-what-are-the-benifits": "overview",
  "/treatment": "treatment",
  "/myofascial-release": "myofascial-release",
  "/what-to-expect": "what-to-expect",
  "/kinesiology-taping": "kinesiology-taping",
  "/office-based-sports-massage": "workplace",
};
const initialSection =
  routeState.scrollTarget ||
  legacyPilatesSections[window.location.pathname] ||
  legacyClinicsSections[window.location.pathname] ||
  legacyTherapySections[window.location.pathname] ||
  window.location.hash.replace(/^#/, "");
if (initialSection) {
  const scrollToInitialSection = () => {
    const target = document.getElementById(initialSection);
    if (!target) return;
    target
      .querySelectorAll("[data-reveal]")
      .forEach((item) => item.classList.add("is-visible"));
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

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    visualizations.forEach((visualization) => visualization.clock.stop());
    stopTestimonialAutoplay();
  } else {
    visualizations.forEach((visualization) => visualization.clock.start());
    startTestimonialAutoplay();
  }
});

updateTestimonial(0, false);
startTestimonialAutoplay();
initPageFeatures();
