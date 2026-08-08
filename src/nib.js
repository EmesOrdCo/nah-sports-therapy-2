/* The drawn line, as a shared hand.

   Two places on the site draw one: the conversation on /about runs a line down
   the page with a node at every question, and /sports-therapy runs one across
   the three steps of "What to expect". They are the same drawing — a curve
   through measured points, stroked with a broad nib — held at ninety degrees
   to each other, so what lives here is everything that does not care which way
   the line is going. Where the points come from, and what reveals them, is the
   caller's business: see about/spine.js and step-wave.js.

   AXIS. Every function below takes `along`, the direction the line mainly
   travels — "y" for a line running down a page, "x" for one running across it.
   It decides two things: which coordinate the curve's tension is measured on,
   and which way the pen is held. A nib is thin along its direction of travel
   and broad across it, so a line that runs down the page is thin on its
   verticals, and one that runs across is thin on its horizontals. Same pen,
   turned to suit the stroke.

   NIB. Because the width changes along the line, the stroke is a filled shape
   rather than a stroke — stroke-width cannot say "broad here, thin there" —
   which is also why callers reveal it with a clip rather than a dasharray. */

export const NS = "http://www.w3.org/2000/svg";

// The range the stroke travels between, in px. Read together with the caller's
// amplitude: a heavier nib needs a wider swing or it reads as cramped.
const THIN = 1.1;
const THICK = 6.5;

// How far each point's tangent is held parallel to the axis before the line is
// allowed to head for the next one. 0.5 is the ceiling: past it the incoming
// and outgoing control points cross over, the curve doubles back on itself at
// the point, and the nib — which takes its width from the angle of travel —
// sees a line square to the axis exactly where the curve should be most
// parallel to it.
const TENSION = 0.45;

/* Layout positions, not painted ones. Callers measure elements that may carry
   a reveal transform at the moment this runs, and a getBoundingClientRect
   would report wherever the animation had got to. offsetTop and offsetLeft
   ignore transforms and give where the box actually sits.

   Summed up the offsetParent chain rather than read in one go, because those
   offsets are relative to the nearest positioned ancestor and there is usually
   more than one between the element and the root being measured against. */
export function offsetWithin(el, root) {
  let x = 0;
  let y = 0;
  for (let node = el; node && node !== root; node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

export function curve(points, along = "y") {
  const axis = along === "x" ? "x" : "y";
  const cross = axis === "x" ? "y" : "x";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const pull = (b[axis] - a[axis]) * TENSION;
    const first = { [axis]: a[axis] + pull, [cross]: a[cross] };
    const second = { [axis]: b[axis] - pull, [cross]: b[cross] };
    d +=
      ` C ${first.x.toFixed(2)} ${first.y.toFixed(2)},` +
      ` ${second.x.toFixed(2)} ${second.y.toFixed(2)},` +
      ` ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  }
  return d;
}

/* Walk the curve for position and tangent. Deriving both from the Bézier
   control points would be exact, but this is a drawing and 2px of arc length
   is already finer than the stroke it is describing. */
function walk(svg, d, step) {
  const probe = document.createElementNS(NS, "path");
  probe.setAttribute("d", d);
  probe.style.visibility = "hidden";
  svg.appendChild(probe);
  const length = probe.getTotalLength();
  const out = [];
  for (let s = 0; s <= length; s += step) {
    const at = probe.getPointAtLength(s);
    const behind = probe.getPointAtLength(Math.max(0, s - 1));
    const ahead = probe.getPointAtLength(Math.min(length, s + 1));
    out.push({
      x: at.x,
      y: at.y,
      tx: ahead.x - behind.x,
      ty: ahead.y - behind.y,
    });
  }
  svg.removeChild(probe);
  return out;
}

/* The nib. Width follows how far the line has turned away from its axis —
   thin where it runs with the axis, broad through the turns — normalised
   against the sharpest turn on this particular curve, so the stroke uses its
   whole range whether the swing is a phone's or a wide monitor's rather than
   coming out uniformly thin on the narrow one.

   That normalisation is why both callers keep every turn on a line roughly as
   sharp as every other. One passage much steeper than the rest sets the scale
   for all of them, and the rest of the drawing collapses towards the thin end:
   an early cut of the step wave dropped into the row from the heading, a turn
   some seven times sharper than its swings, and came out a flat thread with a
   wedge at the entry. If a line here ever needs a genuine hairpin in it, this
   is the function that has to learn about it. */
export function nib(svg, d, along = "y") {
  const points = walk(svg, d, 2);
  const lean = points.map((p) =>
    along === "x"
      ? Math.abs(Math.atan2(Math.abs(p.ty), Math.abs(p.tx)))
      : Math.abs(Math.atan2(Math.abs(p.tx), Math.abs(p.ty))),
  );
  const widest = Math.max(...lean) || 1;
  const near = [];
  const far = [];

  points.forEach((p, i) => {
    const half = (THIN + (THICK - THIN) * (lean[i] / widest)) / 2;
    const length = Math.hypot(p.tx, p.ty) || 1;
    const nx = (-p.ty / length) * half;
    const ny = (p.tx / length) * half;
    near.push([p.x + nx, p.y + ny]);
    far.push([p.x - nx, p.y - ny]);
  });

  const side = (list) =>
    list.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ");
  return `M ${side(near)} L ${side(far.reverse())} Z`;
}
