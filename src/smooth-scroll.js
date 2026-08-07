/* Weighted scrolling.

   The wheel is intercepted and turned into a target position; every frame the
   real scroll position eases a fraction of the way there. A flick then carries
   past the input and settles, instead of the page landing dead on the pixel
   the trackpad asked for.

   Native scroll stays the source of truth — we only ever call window.scrollTo,
   never transform a wrapper — so sticky headings, the reveal observer and the
   testimonial thread all keep measuring real geometry, and the scrollbar keeps
   telling the truth.

   Left alone on purpose: touch (the platform's own momentum beats anything we
   can fake, and preventing touchmove costs the rubber-band), keyboard and
   anchor jumps (those stay on the CSS scroll-behavior: smooth already in
   style.css), and anyone who has asked for reduced motion. */

// Fraction of the remaining distance eaten per 60fps frame. Lower is heavier:
// 0.06 takes about three quarters of a second to come to rest, so a flick
// carries well past the input. Below roughly 0.04 it stops reading as weight
// and starts reading as the page ignoring you.
const SETTLE = 0.06;
// Below this many pixels the eye cannot see the remainder, so snap and idle.
const REST = 0.4;
// deltaMode 1 reports lines, not pixels — Firefox on Windows still does this.
const LINE = 16;
const FRAME = 1000 / 60;

function wheelDistance(event) {
  if (event.deltaMode === 1) return event.deltaY * LINE;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

export function initSmoothScroll() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return;
  }

  let target = window.scrollY;
  let current = target;
  // What we last wrote. Anything else on the page moving the scroll position
  // shows up as a mismatch against this, and hands control back.
  let applied = Math.round(current);
  let frame = 0;
  let lastTime = 0;

  const limit = () =>
    Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );

  const clamp = (value) => Math.min(Math.max(value, 0), limit());

  const apply = (value) => {
    applied = Math.round(value);
    // The two-argument scrollTo inherits scroll-behavior: smooth from the
    // stylesheet, which would put a second easing on top of this one.
    window.scrollTo({ top: value, behavior: "instant" });
  };

  const step = (time) => {
    // A backgrounded tab hands back one enormous delta; without the cap the
    // page would teleport on return.
    const elapsed = Math.min(time - lastTime, 64);
    lastTime = time;

    const distance = target - current;
    if (Math.abs(distance) < REST) {
      current = target;
      frame = 0;
      apply(current);
      return;
    }

    // Frame-rate independent easing, so 60Hz, 120Hz and 144Hz all settle in
    // the same wall-clock time rather than the fast panel feeling twitchy.
    current += distance * (1 - Math.pow(1 - SETTLE, elapsed / FRAME));
    apply(current);
    frame = window.requestAnimationFrame(step);
  };

  const start = () => {
    if (frame) return;
    lastTime = performance.now();
    frame = window.requestAnimationFrame(step);
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) return; // pinch zoom
      // Horizontal-dominant gestures are the browser's (back / forward swipe).
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target.closest?.("[data-native-scroll]")) return;
      if (document.body.classList.contains("is-loading")) return;

      event.preventDefault();
      target = clamp(target + wheelDistance(event));
      start();
    },
    { passive: false },
  );

  window.addEventListener(
    "scroll",
    () => {
      // Our own write, mid-animation: ignore it.
      if (frame && Math.abs(window.scrollY - applied) <= 2) return;
      // Anything else — scrollbar drag, keyboard, an anchor jump, a focus
      // ring being scrolled into view — wins outright and resets the easing.
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      target = current = window.scrollY;
      applied = Math.round(current);
    },
    { passive: true },
  );

  window.addEventListener(
    "resize",
    () => {
      target = clamp(target);
    },
    { passive: true },
  );
}
