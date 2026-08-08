/* The spine that runs down the middle of the conversation.

   One drawn line, with a node where each question hangs off it, alternating
   right and left down the page. None of it can be written in advance: the
   height is whatever her answers make it, and the nodes sit wherever the type
   lands. So the whole drawing is measured after layout and written into an
   empty <svg>, and rewritten when the window changes size.

   The stroke is a broad nib rather than an even line — thin where the line runs
   vertically, swelling through each turn, the way a pen held at a fixed angle
   behaves. That is the same hand as the line drawings elsewhere on the site,
   which is what keeps this reading as house style rather than as an effect.
   Because its width is the drawing, it is a filled shape and not a stroke, and
   that is why the reveal below is a clip rather than a stroke-dasharray.

   Everything about how it looks — colour, swing, where the axis sits — is a
   custom property in variant-e.css. This file only measures and draws. */

const NS = "http://www.w3.org/2000/svg";

// The range the stroke travels between, in px. Read together with --spine-amp:
// a heavier nib needs a wider swing or it reads as cramped.
const NIB_THIN = 1.1;
const NIB_THICK = 6.5;

// How far each node's tangent is held vertical before the line is allowed to
// head for the next one. 0.5 is the ceiling: past it the incoming and outgoing
// control points cross over in y, the curve doubles back on itself at the node,
// and the nib — which takes its width from the angle of travel — sees a
// horizontal line exactly where the curve should be at its most vertical.
const TENSION = 0.45;

const NODE_R = 3.5;

// The line starts this far above the first node and runs past the last, so it
// is already travelling when the section begins. Starting level with the first
// node instead would force the whole swing into the few pixels between the top
// of the list and the first question, and come out as a horizontal dash.
const LEAD = 130;

// Where on the screen the drawn head sits. The line is only ever drawn as far
// as the reader has got, and this is what "as far as they have got" means:
// a little above the middle of the window, where the eye actually is.
const HEAD = 0.62;

const CLIP_ID = "av-spine-clip";

/* Layout positions, not painted ones. The pairs carry [data-reveal], so at the
   moment this runs some of them are still translated down by the reveal — a
   getBoundingClientRect would put their nodes wherever the animation had got
   to. offsetTop and offsetLeft ignore transforms and report where the box
   actually sits, which is what the line has to be drawn to.

   Summed up the offsetParent chain rather than read in one go, because those
   offsets are relative to the nearest positioned ancestor and there are two
   between here and the rail: the <dl>, which is positioned to sit over the
   drawing, and each pair itself, which the reveal's transform turns into an
   offsetParent for its own question. Read directly, every question in the
   conversation reports the same handful of pixels from the top of its own pair,
   and the whole spine collapses onto one line. */
function offsetWithin(el, root) {
  let x = 0;
  let y = 0;
  for (let node = el; node && node !== root; node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

function marks(rail, axisX) {
  return [...rail.querySelectorAll("[data-pair]")].map((pair) => {
    const question = pair.querySelector("[data-question]");
    const line =
      parseFloat(getComputedStyle(question).lineHeight) || question.offsetHeight;
    const box = offsetWithin(pair, rail);
    const at = offsetWithin(question, rail);
    const centre = box.x + pair.offsetWidth / 2;
    return {
      // Which side of the axis this pair sits on. Taken from geometry rather
      // than from a class, so the single-column layout on a phone — where every
      // pair is to the right of a spine held at the left margin — needs no
      // special case here at all.
      dir: centre >= axisX ? 1 : -1,
      // The first line of the question, not the middle of the pair: a node has
      // to sit on the cap height or it reads as floating.
      y: at.y + line / 2,
    };
  });
}

function curve(points) {
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const pull = (b.y - a.y) * TENSION;
    d +=
      ` C ${a.x.toFixed(2)} ${(a.y + pull).toFixed(2)},` +
      ` ${b.x.toFixed(2)} ${(b.y - pull).toFixed(2)},` +
      ` ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  }
  return d;
}

/* Walk the curve for position and tangent. Deriving both from the Bézier
   control points would be exact, but this is a drawing and 2px of arc length is
   already finer than the stroke it is describing. */
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
    out.push({ x: at.x, y: at.y, tx: ahead.x - behind.x, ty: ahead.y - behind.y });
  }
  svg.removeChild(probe);
  return out;
}

/* The nib. Width follows the angle of travel — thin along the verticals, broad
   through the turns — normalised against the widest turn on this particular
   curve, so the stroke uses its whole range whether the swing is a phone's or a
   wide monitor's rather than coming out uniformly thin on the narrow one. */
function nib(svg, d) {
  const points = walk(svg, d, 2);
  const lean = points.map((p) => Math.abs(Math.atan2(Math.abs(p.tx), Math.abs(p.ty))));
  const widest = Math.max(...lean) || 1;
  const near = [];
  const far = [];

  points.forEach((p, i) => {
    const half = (NIB_THIN + (NIB_THICK - NIB_THIN) * (lean[i] / widest)) / 2;
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

export function initSpine() {
  const rail = document.querySelector("[data-spine]");
  if (!rail) return;
  const svg = rail.querySelector("[data-spine-draw]");
  const axis = rail.querySelector("[data-spine-axis]");
  if (!svg || !axis) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  let clip = null;
  let top = 0;
  let bottom = 0;
  let frame = 0;

  function draw() {
    const width = rail.offsetWidth;
    const height = rail.offsetHeight;
    const axisX = offsetWithin(axis, rail).x;
    const amp = parseFloat(getComputedStyle(rail).getPropertyValue("--spine-amp")) || 0;

    const found = marks(rail, axisX);
    if (!found.length) return;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    top = found[0].y - LEAD;
    bottom = height;

    const points = [
      { x: axisX, y: top },
      ...found.map((m) => ({ x: axisX + m.dir * amp, y: m.y })),
      { x: axisX, y: bottom },
    ];
    const d = curve(points);

    const nodes = found
      .map(
        (m) =>
          `<circle class="av-e__spine-node" cx="${(axisX + m.dir * amp).toFixed(2)}"` +
          ` cy="${m.y.toFixed(2)}" r="${NODE_R}" />`,
      )
      .join("");

    /* The clip is what draws the line in. A stroke could have been revealed
       with stroke-dasharray, but the nib is a filled shape — it has no stroke
       to dash — so the whole group is clipped to a rectangle that grows down
       the page instead. The nodes sit inside the same clip, which is what makes
       each one appear as the line reaches it rather than waiting there for it.
       The rectangle is over-wide so the swing never clips at its sides. */
    svg.innerHTML =
      `<defs><clipPath id="${CLIP_ID}">` +
      `<rect x="${-width}" y="${top.toFixed(2)}" width="${width * 3}" height="0" />` +
      `</clipPath></defs>` +
      `<g clip-path="url(#${CLIP_ID})">` +
      `<path class="av-e__spine-nib" d="${nib(svg, d)}" />${nodes}</g>`;

    clip = svg.querySelector(`#${CLIP_ID} rect`);
    reveal();
  }

  function reveal() {
    if (!clip) return;
    // Drawn as far as the reader has got. Held to the layout height rather than
    // to the path, so a line that overshoots below the last answer finishes
    // with the section instead of trailing a frame behind it.
    const head = still.matches
      ? bottom
      : window.innerHeight * HEAD - rail.getBoundingClientRect().top;
    clip.setAttribute("height", Math.max(0, Math.min(bottom, head) - top).toFixed(2));
  }

  function onScroll() {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      reveal();
    });
  }

  // The nodes are measured off the first line of each question, so the line is
  // drawn against whatever the fallback face happened to set until the real one
  // arrives. Draw once so there is something there, then again once the webfont
  // has settled the line boxes it was measured from.
  draw();
  if (document.fonts?.ready) document.fonts.ready.then(draw);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", draw);
  still.addEventListener("change", reveal);
}
