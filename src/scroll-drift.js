/* Photographs that drift as the page scrolls.
 *
 * Marked up rather than hard-coded, because the four places this runs are four
 * different shapes and only the arithmetic is shared:
 *
 *   data-drift              a group. Its box is the clock: every layer inside
 *                           reads one position, so the parts of one figure move
 *                           in step instead of each on its own schedule.
 *   data-drift-lag="0.07"   a layer that travels WITH the page, by that share
 *                           of its own height at the extremes.
 *   data-drift-lead="0.07"  the same, against.
 *
 * Two layers pulling apart is what reads as depth; one layer moving alone reads
 * as a bug in the layout. So groups come in pairs wherever there are two things
 * to move — plate against inset, left photograph against right — and where
 * there is only one, it is a full-bleed backdrop with the copy sitting still on
 * top of it, which is the same trick with the page itself as the other layer.
 *
 * WHAT MOVES IS NOT THE FRAME. In every case but the lapped inset, the frame
 * stays exactly where the grid put it and the picture drifts INSIDE it, which
 * is why the stylesheet scales these images up first: the overspill is the
 * runway, and the frame is already overflow:hidden, so nothing shows outside
 * it. Sliding whole figures instead would open a gap above or below at every
 * scroll position and shove each section's spacing around while the reader
 * watched.
 *
 * The share is a share on purpose. A fixed pixel count is two different effects
 * on a 493px desktop plate and a 245px phone one — imperceptible on the first,
 * and more runway than the scale-up provides on the second, which shows the
 * frame's empty edge.
 *
 * There is deliberately no default share. The number is not a matter of taste,
 * it is bounded by how much overspill that particular component's CSS provides
 * — 2.5% against the gallery plate's 1.06 scale, and no more. A default would
 * be right for one component and would quietly overrun the next one it was
 * used on.
 */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Position of a group in its pass across the viewport: -1 as it comes up past
   the bottom edge, 0 when its middle meets the middle of the screen, +1 as it
   leaves the top. Measured centre-to-centre so a tall group and a short one hit
   0 at the same moment. */
function passage(rect) {
  const middle = rect.top + rect.height / 2;
  const span = (window.innerHeight + rect.height) / 2;
  if (span <= 0) return 0;
  return Math.max(-1, Math.min(1, (window.innerHeight / 2 - middle) / span));
}

/* A layer is one moving thing: the node, how far it goes, and which way.
   Anything without a readable share is dropped rather than defaulted — see the
   note at the top about why there is no fallback number. */
function readLayer(node) {
  const lead = node.hasAttribute("data-drift-lead");
  const share = Number(lead ? node.dataset.driftLead : node.dataset.driftLag);
  if (!Number.isFinite(share) || share <= 0) return null;
  return { node, share, direction: lead ? -1 : 1 };
}

export function initScrollDrift(selector = "[data-drift]") {
  // Movement nobody asked for, so it does not happen when it is not wanted.
  if (REDUCED.matches) return;

  const groups = [...document.querySelectorAll(selector)]
    .map((el) => ({
      el,
      layers: [...el.querySelectorAll("[data-drift-lag], [data-drift-lead]")]
        .map(readLayer)
        .filter(Boolean),
    }))
    .filter((group) => group.layers.length);

  if (!groups.length) return;

  let frame = 0;

  const draw = () => {
    frame = 0;

    /* Read every rect, then write every offset. Interleaving them makes the
       browser flush layout once per element instead of once per frame.

       Every group is measured, including the ones nowhere near the screen.
       Skipping those looks like the obvious saving and is the one thing that
       would make this visible: passage() is already clamped to ±1 long before a
       group is within a fold of the viewport, so an untouched group is not
       cheap-and-correct, it is wrong by the full travel and snaps to true on
       the frame it comes into range.

       Heights come from offsetHeight rather than the rect, because the rect of
       a scaled element is its SCALED height: a plate would measure 1.16x and so
       travel 1.16x as far as the slack that scale bought — a travel budget
       paying for itself out of its own overspend, and a hairline of empty frame
       at the extremes. The layout height is what the shares are written
       against. */
    const measured = groups.map((group) => ({
      group,
      at: passage(group.el.getBoundingClientRect()),
      heights: group.layers.map((layer) => layer.node.offsetHeight),
    }));

    measured.forEach(({ group, at, heights }) => {
      group.layers.forEach((layer, index) => {
        /* A lagging layer is pushed back down as its frame rises, so it appears
           to travel slower than everything around it. That lag is the depth. A
           leading one is the same bargain in the other direction.

           `translate` rather than `transform`, so this composes with the scale
           the stylesheet holds instead of overwriting it. They are separate
           properties, applied translate-then-scale, which is also the order
           that keeps this offset in layout pixels — inside a `transform` list
           the translation would be scaled along with everything else and these
           numbers would quietly mean something other than what they say. */
        const y = at * layer.direction * heights[index] * layer.share;
        layer.node.style.translate = `0 ${y.toFixed(2)}px`;
      });
    });
  };

  const queue = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(draw);
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });

  /* Photographs arrive at their own pace, and a layer measured before its image
     has decoded is measured at whatever height the width/height attributes
     imply against a different aspect ratio. A layer may be an image itself or
     merely contain one. */
  groups.forEach((group) => {
    group.layers.forEach(({ node }) => {
      const images =
        node.tagName === "IMG" ? [node] : [...node.querySelectorAll("img")];
      images.forEach((image) => {
        if (!image.complete)
          image.addEventListener("load", queue, { once: true });
      });
    });
  });

  /* Marks the group as driven. The stylesheet hangs the scale-up and the
     will-change off this rather than off [data-drift], so a browser that never
     runs this file — reduced motion, or no JS at all — gets the photographs
     uncropped and is not asked to promote layers to their own compositor tiles
     for an effect it is not going to show.

     Not "is-drifting": the home page's looping quote run owns that name, and
     two mechanisms answering to one class is a trap for whoever greps next.

     Set before the first draw so the class and the offsets land together. */
  groups.forEach((group) => group.el.classList.add("is-adrift"));
  draw();

  /* Someone can turn reduced motion on while the page is open. Put everything
     back where the stylesheet would have had it. */
  REDUCED.addEventListener("change", (event) => {
    if (!event.matches) return;
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
    window.cancelAnimationFrame(frame);
    groups.forEach((group) => {
      group.el.classList.remove("is-adrift");
      group.layers.forEach(({ node }) => {
        node.style.translate = "";
      });
    });
  });
}
