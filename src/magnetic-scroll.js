/* Magnetic scrolling.

   Anything marked `data-magnet` is somewhere the page would rather come to
   rest. When a scroll settles near one, the last short distance is glided so
   the element sits in the middle of the reading area — a section stops where
   it was meant to be looked at, rather than a third of the way up the screen
   with its heading cut off at the top.

   It is a preference, not a snap, and that distinction is the whole design.
   Three things keep it out of the reader's way:

     * ENGAGE — it only pulls when the resting point is already close to a
       magnet. Scroll deliberately to a spot between two of them and you stay
       there, because neither is in range;
     * MIN_TRAVEL — a gesture shorter than this is ignored outright. Someone
       nudging down by a line is being precise, and moving them 200px after
       that is what makes magnetic scrolling feel broken everywhere it is;
     * BACKSTOP — a magnet behind you pulls far less hard than one ahead. The
       reader was going somewhere; hauling them back the way they came reads
       as the page arguing, even when the distance is identical.

   Any new input during the glide cancels it on the spot, so it can always be
   overruled by simply carrying on scrolling.

   Native scroll stays the source of truth — this only ever calls
   window.scrollTo — so it composes with smooth-scroll.js rather than fighting
   it: that module's own easing finishes, scrolling goes quiet, and the magnet
   takes the remainder. Its scroll listener sees these writes as an outside
   party and re-syncs to them, which is exactly right.

   Never runs under reduced motion: this is movement nobody asked for. */

// How long scrolling has to be quiet before the page is considered at rest.
// Long enough to sit out the gap between two trackpad flicks, short enough
// that the glide still feels like part of the same gesture.
const IDLE = 150;
// Below this many pixels of travel, the reader was adjusting rather than
// moving, and adjusting is precisely what must not be overridden.
const MIN_TRAVEL = 96;
// How near a magnet has to be, as a share of the fold, before it pulls at all.
const ENGAGE = 0.3;
// The same, for a magnet behind the direction of travel.
const BACKSTOP = 0.14;
// Under this the remainder is not worth animating.
const DEAD = 8;
const DURATION = 520;

export function initMagneticScroll(selector = "[data-magnet]") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const magnets = [...document.querySelectorAll(selector)];
  if (!magnets.length) return;

  const header = document.querySelector(".site-header");

  let frame = 0;
  let from = 0;
  let to = 0;
  let began = 0;
  let idle = 0;
  // A gesture is in progress that the magnet is allowed to finish. Set by the
  // two coarse inputs only — see the keyboard note below.
  let armed = false;
  let travelledFrom = 0;

  const limit = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const clamp = (value) => Math.min(Math.max(value, 0), limit());

  // Only a header that has actually gone fixed is covering anything; at the
  // top of the page it is in flow and the reading area is the whole fold.
  const headroom = () =>
    header && getComputedStyle(header).position === "fixed"
      ? header.offsetHeight
      : 0;

  /* Where the page would sit with this element centred in the reading area. */
  const restFor = (element) => {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const head = headroom();
    const view = window.innerHeight - head;
    /* Taller than the reading area, so there is no centre to settle on: its
       top goes under the header instead, keeping a little lead above it so
       whatever introduces the element stays in shot. */
    if (rect.height > view) {
      return clamp(top - head - Math.min(120, view * 0.14));
    }
    return clamp(top + rect.height / 2 - head - view / 2);
  };

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  // Eased at both ends. The page is at rest when this starts, so an ease-out
  // alone would set off with a jolt — the one thing a settling movement
  // cannot do without reading as a jump.
  const ease = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (time) => {
    const t = Math.min((time - began) / DURATION, 1);
    window.scrollTo({
      top: from + (to - from) * ease(t),
      // The stylesheet's scroll-behavior: smooth would otherwise put a second
      // easing on top of this one.
      behavior: "instant",
    });
    frame = t < 1 ? window.requestAnimationFrame(step) : 0;
  };

  const settle = () => {
    const rest = window.scrollY;
    const heading = Math.sign(rest - travelledFrom);
    const fold = window.innerHeight;

    let nearest = null;
    let distance = Infinity;
    magnets.forEach((element) => {
      const candidate = restFor(element);
      const gap = Math.abs(candidate - rest);
      if (gap < distance) {
        distance = gap;
        nearest = candidate;
      }
    });
    if (nearest === null || distance < DEAD) return;

    const reach =
      Math.sign(nearest - rest) === -heading ? BACKSTOP : ENGAGE;
    if (distance > fold * reach) return;

    stop();
    from = rest;
    to = nearest;
    began = performance.now();
    frame = window.requestAnimationFrame(step);
  };

  window.addEventListener(
    "scroll",
    () => {
      // Our own glide. Watching for the end of it here would re-enter settle()
      // the moment it finished.
      if (frame) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!armed) return;
        armed = false;
        if (Math.abs(window.scrollY - travelledFrom) < MIN_TRAVEL) return;
        settle();
      }, IDLE);
    },
    { passive: true },
  );

  // Wheel and touch are the two gestures that ask to be somewhere else rather
  // than at an exact position, so they are the two that arm the magnet. Each
  // one also cancels a glide already running: carrying on scrolling is how
  // the reader overrules this, and it has to work on the first tick.
  const arm = () => {
    stop();
    if (armed) return;
    armed = true;
    travelledFrom = window.scrollY;
  };

  // Keyboard and mouse are precise by nature — an arrow key is a line, a
  // scrollbar drag is a position, a click on an anchor is a destination. They
  // cancel the glide and pointedly do not arm a new one.
  const release = (event) => {
    stop();
    /* A touch pointer is the front of the gesture touchstart is about to arm,
       and pointerdown gets there first — disarming here would cancel every
       swipe on a phone before it began. */
    if (event.type === "pointerdown" && event.pointerType !== "mouse") return;
    armed = false;
  };

  window.addEventListener("wheel", arm, { passive: true });
  window.addEventListener("touchstart", arm, { passive: true });
  window.addEventListener("keydown", release);
  window.addEventListener("pointerdown", release);
}
