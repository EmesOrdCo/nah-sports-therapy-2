/* Drawn sequences.

   A row marked `data-drawn-sequence` draws itself as it arrives: the rail runs
   left to right, each node lands as the rail reaches it, and the number, icon
   and label follow just behind. Scroll it away and the whole thing retracts
   the way it came — right end first, back toward the left.

   The timing lives in CSS (see .pilates-approach__steps), which is why this
   file is so short: all it does is decide *when* the row is in and out. Two
   things matter about how it decides.

   ARMING. The hidden state is written as `.is-armed:not(.is-drawn)`, and only
   this module ever adds `.is-armed`. So the row is fully visible in the markup
   as it stands — no JS, no IntersectionObserver, a thrown error on the way in,
   and you still get the finished row rather than an empty band of white. Same
   reasoning as the .pre-reveal dance in main.js.

   HYSTERESIS. Reversible reveals flicker when one boundary controls both
   directions: rest the page with the row's edge on that line and it draws and
   undraws under you. So there are two observers with different boxes — it
   draws once it is properly into the reading area, and only undraws once it
   has left the viewport entirely. Between those two lines nothing happens,
   which is where a reader who is simply reading it tends to sit.

   Never runs under reduced motion: the row is left as authored. */

// How far up from the fold the row has to come before it starts drawing.
const IN_MARGIN = "0px 0px -14% 0px";
// And how far past the edge it has to go before it undraws. Larger than the
// box above, and that difference is the dead band.
const OUT_MARGIN = "0px 0px 10% 0px";

export function initDrawnSequence(selector = "[data-drawn-sequence]") {
  const rows = [...document.querySelectorAll(selector)];
  if (!rows.length) return;
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  let delivered = false;
  const drawIn = new IntersectionObserver(
    (entries) => {
      delivered = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-drawn");
      });
    },
    { threshold: 0, rootMargin: IN_MARGIN },
  );

  const drawOut = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) entry.target.classList.remove("is-drawn");
      });
    },
    { threshold: 0, rootMargin: OUT_MARGIN },
  );

  rows.forEach((row) => {
    row.classList.add("is-armed");
    drawIn.observe(row);
    drawOut.observe(row);
  });

  // Safety net, as in main.js: a working observer always delivers an initial
  // batch for everything it is given, whether or not any of it is on screen.
  // Nothing arrived, so take the row off the hook entirely — un-armed, it is
  // plain finished markup again. Deliberately not keyed on `is-drawn`: a row
  // the reader has not reached yet is undrawn and perfectly healthy.
  window.setTimeout(() => {
    if (delivered) return;
    rows.forEach((row) => row.classList.remove("is-armed"));
  }, 3000);
}
