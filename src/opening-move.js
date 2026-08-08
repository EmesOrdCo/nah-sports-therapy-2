/* The opening move.

   On the pages that have one thing they are actually for — the sentence that
   turns from her to you on /about, the fees on /prices, the reviews on
   /testimonials — the first scroll down the page does not scroll it. It
   carries the reader from the head to that thing and stops there. The weight
   of the gesture makes no difference: the smallest nudge of a wheel and the
   hardest flick of a trackpad make exactly the same journey.

   The way that is done is to take the gesture over rather than to wait it out.
   The first tick of downward wheel is swallowed — stopped dead, before the
   weighted scroller in smooth-scroll.js ever sees it — and the travel starts on
   that tick. Every tick after it is swallowed too, until the travel has
   finished and the reader's hand has come off the wheel, so the tail of a long
   flick cannot carry the page on past where it was going.

   Then it is over. One journey per visit: as that first flick dies down every
   listener comes off, and from that moment the page scrolls exactly as any
   other does — including back up to the head, which is an ordinary scroll and
   is not assisted. It only ever fires from a standstill at the top, so a reader
   who arrives further down the page never meets it. Nobody who has asked for
   reduced motion gets it, and the first key press cancels it — Page Down, the
   arrows and Tab all move a deliberate, known amount, and carrying on past that
   is the opposite of what was asked for.

   Registered from main.js BEFORE initSmoothScroll(), which is what makes
   taking the tick reliable — see the note in swallow(). */

// How near the top counts as standing at the head of the page. Loose enough to
// survive a nudge, a resize or a rounded scroll position, and tight enough that
// halfway down the hero is not "at" it.
const AT_HEAD = 130;
// Under this there is nothing worth travelling: the target is already where the
// reader can see it, and taking the page over to move it a little would be
// interference rather than help.
const MIN_TRAVEL = 40;
// Quiet, in ms, that marks the end of a gesture — the point at which swallowing
// input can stop. A trackpad flick keeps firing for a few hundred ms after the
// fingers lift, so this is measured from the last event of the gesture.
const GESTURE_END = 160;
// The smallest wheel and touch movements worth acting on. Below these it is
// noise: a resting finger on a trackpad, a hand steadying a phone.
const MIN_WHEEL = 4;
const MIN_TOUCH = 6;
// deltaMode 1 reports lines rather than pixels — Firefox on Windows still does.
const LINE = 16;

function wheelDistance(event) {
  if (event.deltaMode === 1) return event.deltaY * LINE;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

// What a tall target has to clear at the top of the window: the header once it
// has gone solid, plus enough that its first line is not tight against the bar.
function headerClear() {
  const bar =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-scrolled",
      ),
    ) || 76;
  return bar + 28;
}

/* Smootherstep. Zero velocity AND zero acceleration at both ends, where an
   ease-out starts at full speed and a plain cubic in-out still has a kink in
   it. This is the whole difference between a page that snaps to its target and
   one that takes off, carries, and comes to rest on it: the motion has to begin
   from nothing and arrive at nothing. */
const glideEase = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/* Hand-rolled rather than scrollIntoView({ behavior: "smooth" }): the browser's
   own duration is fixed and short, and over a thousand-odd pixels it reads as a
   jump cut rather than as travel. Writing the position frame by frame also
   means the wheel handler in smooth-scroll.js picks up cleanly from wherever we
   stopped.

   `done` is called on arrival and on interruption alike, with the position the
   page actually ended at. */
function glide(to, done) {
  const from = window.scrollY;
  const distance = to - from;
  /* A little over a millisecond per pixel. This started at half the figure,
     which put 1,000 pixels away in half a second — not a journey the eye can
     follow; the target simply appeared. Slower than the weighted scroller in
     smooth-scroll.js settles on purpose: that one is answering a hand on the
     wheel, and this is carrying the reader somewhere on its own. */
  const duration = Math.min(1900, Math.max(1150, Math.abs(distance) * 1.25));
  const started = performance.now();
  // Wheel and touch are not in this list: they are being swallowed by the
  // handlers below for the length of the travel, so they cannot interrupt it —
  // which is the whole point of one gesture making one journey. A key press or
  // a hand on the scrollbar still stops it dead.
  const events = ["keydown", "mousedown"];
  let frame = 0;
  // What we last wrote. Anything else moving the page shows up as a mismatch
  // against this and ends the travel — the same trick smooth-scroll.js uses to
  // know its own writes from everyone else's. Without it a travel that has not
  // had a frame yet can wake up later and drag the page back to a target the
  // reader has already left.
  let written = Math.round(from);

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    events.forEach((name) => window.removeEventListener(name, stop));
    done(window.scrollY);
  };

  const step = (now) => {
    if (Math.abs(window.scrollY - written) > 2) return stop();
    const progress = Math.min(1, (now - started) / duration);
    const at = from + distance * glideEase(progress);
    written = Math.round(at);
    // "instant", or this inherits the stylesheet's scroll-behavior: smooth and
    // puts a second easing on top of the one above.
    window.scrollTo({ top: at, behavior: "instant" });
    if (progress < 1) frame = window.requestAnimationFrame(step);
    else stop();
  };

  events.forEach((name) =>
    window.addEventListener(name, stop, { passive: true }),
  );
  frame = window.requestAnimationFrame(step);
}

/* `selector` names the one thing the page is for. Anything shorter than the
   window is centred in it; anything taller — a wall of reviews, a long list —
   is brought up so its head sits under the bar, because centring something
   that overflows the window only hides the start of it. */
export function initOpeningMove(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // A hash means the reader asked for a particular place on the page. Taking
  // them somewhere else instead is the one thing this must never do.
  if (window.location.hash) return;

  // `held` is true from the tick that starts the travel until the travel has
  // finished AND the gesture behind it has died down. While it is true every
  // wheel and touch event is swallowed, so a flick cannot add momentum on top
  // of the journey or run on past the far end of it. `spent` is the once-only
  // latch: the journey is made at most one time per visit, and when the flick
  // that made it dies down the listeners come off altogether.
  let travelling = false;
  let held = false;
  let spent = false;
  let release = 0;

  // Measured every time rather than cached: sections reflow, the window
  // resizes, and a wall of reviews changes height with the column count.
  const station = () => {
    const box = target.getBoundingClientRect();
    const top = window.scrollY + box.top;
    const clear = headerClear();
    const limit = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    /* Room for the whole target and the bar it has to clear, and it is centred;
       otherwise its head goes under the bar. The test allows for one clearance
       rather than two: a block that fills most of the window still reads as
       centred, and demanding a matching gap at the foot would tip things like
       the quote — 626px of an 800px window — into the wrong branch. */
    const wanted =
      box.height + clear <= window.innerHeight
        ? top + box.height / 2 - window.innerHeight / 2
        : top - clear;
    return Math.min(Math.max(wanted, 0), limit);
  };

  // Where this gesture would take us, or null if it is not the journey. Read
  // from the position the page is standing at right now, which is reliable
  // because we never let a qualifying gesture move it first.
  const journey = (direction) => {
    if (spent || direction <= 0) return null;
    const y = window.scrollY;
    const to = station();
    return y <= AT_HEAD && to - y >= MIN_TRAVEL ? to : null;
  };

  // The gesture is over once nothing has come from it for a moment. Until then
  // the input stays swallowed even though the page has stopped moving — and
  // once it is over, if the journey has been made, everything comes off.
  const holdUntilQuiet = () => {
    window.clearTimeout(release);
    release = window.setTimeout(() => {
      if (travelling) return;
      held = false;
      if (spent) off();
    }, GESTURE_END);
  };

  const swallow = (event) => {
    if (event.cancelable) event.preventDefault();
    /* Take the tick away from the weighted scroller in smooth-scroll.js, which
       also listens on window. Capture alone is not enough to be sure of that:
       when an event's target IS window — which is what a dispatched one has —
       capture and bubble listeners on it run in registration order and the
       phase counts for nothing. So this is `immediate`, and this runs before
       initSmoothScroll() so that "registered first" is us. Belt and braces,
       because a single tick leaking through is a page that scrolls twice. */
    event.stopImmediatePropagation();
    event.stopPropagation();
    holdUntilQuiet();
  };

  const depart = (event, to) => {
    swallow(event);
    held = true;
    spent = true;
    travelling = true;
    glide(to, () => {
      travelling = false;
      holdUntilQuiet();
    });
  };

  function onWheel(event) {
    if (event.ctrlKey) return; // pinch zoom
    // Horizontal-dominant gestures are the browser's (back / forward swipe).
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (held) return swallow(event);

    const delta = wheelDistance(event);
    if (Math.abs(delta) < MIN_WHEEL) return;
    const to = journey(delta);
    if (to === null) return; // not the journey — let it scroll normally
    depart(event, to);
  }

  let touchFrom = null;

  function onTouchStart(event) {
    touchFrom = event.touches[0]?.clientY ?? null;
    if (held) swallow(event);
  }

  function onTouchMove(event) {
    if (held) return swallow(event);
    if (touchFrom === null) return;
    // Finger travelling up the screen carries the page down.
    const delta = touchFrom - (event.touches[0]?.clientY ?? touchFrom);
    if (Math.abs(delta) < MIN_TOUCH) return;
    const to = journey(delta);
    if (to === null) {
      touchFrom = null; // this drag is theirs; stop watching it
      return;
    }
    depart(event, to);
  }

  function off() {
    window.clearTimeout(release);
    held = false;
    window.removeEventListener("wheel", onWheel, { capture: true });
    window.removeEventListener("touchstart", onTouchStart, { capture: true });
    window.removeEventListener("touchmove", onTouchMove, { capture: true });
    window.removeEventListener("keydown", off);
  }

  // Capture, and not passive: both are needed to take the tick away from the
  // weighted scroller and from the browser's own scrolling before either acts
  // on it.
  const grab = { capture: true, passive: false };
  window.addEventListener("wheel", onWheel, grab);
  window.addEventListener("touchstart", onTouchStart, grab);
  window.addEventListener("touchmove", onTouchMove, grab);
  window.addEventListener("keydown", off, { passive: true });
}
