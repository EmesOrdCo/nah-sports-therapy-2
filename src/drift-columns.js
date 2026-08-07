/* Columns that drift past on a loop, and stop the moment you reach for them.
 *
 * Two bands use this: the testimonial wall on /testimonials and the taping
 * band on /sports-therapy. Both are the same mechanism — a fixed-height
 * window per column, the list inside it cloned until it is taller than the
 * window, and a position that wraps by exactly one copy so the loop has no
 * seam.
 *
 * The drift moves scrollTop rather than animating a transform. A translated
 * track and a native scroll position are two separate offsets: pausing one and
 * handing the reader the other means converting between them, and any error in
 * the conversion is a jump at the exact moment somebody has decided to look.
 * Driving scrollTop means pausing IS the handover — there is nothing to
 * convert.
 */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");
/* A third of a phone screen is not a column. Below this a band is its lists at
   full height and the page scrolls them, which is also the no-JS baseline — so
   there is nothing for this file to do. */
const NARROW = window.matchMedia("(max-width: 900px)");

/* `parts` names the pieces inside the band: the columns, the window each one
   drifts inside, the track holding the list, and the class that marks a column
   as running downwards. Speed is per column, in pixels a second, via
   data-drift-speed. */
export function driftColumns(band, parts) {
  if (!band) return;

  const columns = [...band.querySelectorAll(parts.col)].map((el) => ({
    el,
    view: el.querySelector(parts.view),
    track: el.querySelector(parts.track),
    speed: Number(el.dataset.driftSpeed) || parts.speed || 12,
    step: el.classList.contains(parts.down) ? -1 : 1,
    // Height of one copy of the list, and the distance the loop wraps by.
    span: 0,
    // Our own position, kept in floats. scrollTop is the rendered version of
    // it; reading it back every frame would round the drift to a standstill at
    // these speeds.
    at: 0,
  }));

  if (!columns.length) return;
  if (columns.some((column) => !column.view || !column.track)) return;

  let paused = false;
  let frame = 0;
  let previous = 0;

  /* Wrapped into the middle band, so a reader who takes over has a full copy of
     runway in each direction before the column reaches its end. Every copy is
     identical, so moving by a whole span never changes a pixel. */
  const wrap = (column) => {
    const { span } = column;
    if (!span) return;
    while (column.at >= span * 2) column.at -= span;
    while (column.at < span) column.at += span;
  };

  const clear = (column) => {
    column.track
      .querySelectorAll("[data-drift-clone]")
      .forEach((clone) => clone.remove());
  };

  const build = () => {
    band.classList.remove("is-drifting");
    columns.forEach(clear);
    if (NARROW.matches || REDUCED.matches) return false;

    // Measured before the band takes its height, while each track still stands
    // at the full height of its own list.
    const spans = columns.map(
      (column) => column.track.getBoundingClientRect().height,
    );
    if (spans.some((span) => span < 1)) return false;

    band.classList.add("is-drifting");

    columns.forEach((column, index) => {
      const span = spans[index];
      const height = column.view.clientHeight;
      // Enough copies to fill the window, plus the two spans of runway the
      // wrap above works within, plus one so the last copy is never the one on
      // screen when the wrap happens.
      const copies = Math.ceil(height / span) + 3;
      const items = [...column.track.children];

      for (let pass = 1; pass < copies; pass += 1) {
        items.forEach((item) => {
          const clone = item.cloneNode(true);
          clone.dataset.driftClone = "";
          // The same quotes, or the same photographs, over and over again is
          // not something to read out.
          clone.setAttribute("aria-hidden", "true");
          // Lazy loading is decided against the viewport, and a clone waiting
          // below the fold may never be judged visible — the originals are
          // already in cache, so there is nothing to defer.
          clone
            .querySelectorAll("img")
            .forEach((image) => image.setAttribute("loading", "eager"));
          column.track.append(clone);
        });
      }

      column.span = span;
      column.at = span * 1.5;
      column.view.scrollTop = column.at;
    });

    return true;
  };

  const tick = (now) => {
    frame = window.requestAnimationFrame(tick);
    // First frame after a pause carries the whole paused interval. Skipping it
    // costs one frame of drift and saves a jump of however long they read for.
    const elapsed = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    if (paused || !elapsed) return;

    columns.forEach((column) => {
      column.at += column.speed * column.step * elapsed;
      wrap(column);
      column.view.scrollTop = column.at;
    });
  };

  const hold = () => {
    paused = true;
  };

  const release = () => {
    if (!paused) return;
    paused = false;
    previous = 0;
    // Wherever the reader left each column is where the drift starts again.
    columns.forEach((column) => {
      column.at = column.view.scrollTop;
    });
  };

  const start = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    paused = false;
    if (!build()) return;
    frame = window.requestAnimationFrame(tick);
  };

  /* Hovering one column stops them all. Stopping only the one under the
     pointer leaves the others moving in the corner of your eye at the exact
     moment you have decided to look at something. */
  band.addEventListener("pointerenter", hold);
  band.addEventListener("pointerleave", release);
  band.addEventListener("focusin", hold);
  band.addEventListener("focusout", release);

  let queued = false;
  const queueRebuild = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      start();
    });
  };

  window.addEventListener("resize", queueRebuild, { passive: true });
  REDUCED.addEventListener("change", queueRebuild);
  NARROW.addEventListener("change", queueRebuild);

  start();
  // Quotes are set in the display serif, and photographs arrive at their own
  // pace. Measured against the fallback font, or before an image has decoded,
  // the copies come out the wrong height and the loop wraps mid-item.
  document.fonts?.ready.then(queueRebuild);
  return queueRebuild;
}
