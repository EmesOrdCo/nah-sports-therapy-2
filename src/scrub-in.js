/* Entrances scrubbed against position, rather than fired at a moment.
 *
 * A group's own position on screen is the clock: this writes one 0..1 property
 * per stage, every frame, and the stylesheet spends that number on travel. So
 * there is no moment the animation can fire at and be finished before you look
 * at it.
 *
 * That distinction is the whole reason this exists. The home page's quote band
 * began as an IntersectionObserver at 0.25, which a 620px band satisfies while
 * it is still a 199px strip at the foot of a 900px fold — measured, not
 * guessed — so all 750ms of the run happened below the screen and the band was
 * at rest by the time it was in front of you. Position cannot be early.
 *
 * Stages run back to back: each is a stretch of the group's approach, written
 * as where the group's top sits in the fold at either end. Because one stage's
 * `to` is the next one's `from`, a stage is already pinned at 1 by the time the
 * next leaves 0 — the sequence is a property of the numbers, not of any timer.
 *
 * BOTH ENDS OF A STAGE ARE LOAD-BEARING, and they are bound to a travel
 * distance in the stylesheet that this file cannot see:
 *
 *   - Where the range sits decides whether you are looking at the group while
 *     it moves. The quote band's second attempt ran 0.86 -> 0.3, the band's
 *     whole crossing, and 120px of travel spread over that reads as static.
 *   - How wide it is decides the ratio. Perceptible motion needs both a run
 *     that happens on screen and a pixel of movement you can see per pixel of
 *     scroll.
 *   - How far a panel travels decides whether it stays hidden until its turn.
 *     A panel waiting sits one travel below its resting place, so it is off
 *     screen only while (1 - from) * fold is less than that travel. Get it
 *     wrong and you watch the panel parked in view before it sets off — and,
 *     scrolling back up, parked again after it has handed back. This is why
 *     the stylesheet's travels are in vh: the requirement scales with the
 *     window, so the distance has to as well.
 *
 * The properties are left unset when motion is not wanted, so the stylesheet's
 * own fallback — 1, the resting state — is what paints. Nothing is displaced
 * with no JS, and nothing is displaced under reduced motion.
 */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

/* stages: [{ property, from, to }] — `from` and `to` are where the group's top
   edge sits as a share of the fold at the two ends of that stage's run. */
export function initScrubIn(node, stages) {
  if (!node || REDUCED.matches) return;

  let queued = false;

  const draw = () => {
    queued = false;
    const top = node.getBoundingClientRect().top / window.innerHeight;
    stages.forEach(({ property, from, to }) => {
      node.style.setProperty(
        property,
        clamp01((from - top) / (from - to)).toFixed(4),
      );
    });
  };

  const queue = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(draw);
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  draw();
}
