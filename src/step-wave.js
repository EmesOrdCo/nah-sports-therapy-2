/* The line that runs across "What to expect".

   The same drawn line as the conversation on /about, turned on its side: it
   arrives from off the left margin level with the heading, dives into the row,
   and threads the three steps with a node at each one before running off the
   right. The pen is in nib.js; this file says where the points are, when the
   line draws, and what the drawing is allowed to bring with it.

   WHY THE LINE OWNS THE STAGGER. The steps used to rise on fixed delays —
   0, 130, 260ms — which is a guess at how long a line takes to get from 01 to
   03. Now each delay is measured off the drawing itself: the node's distance
   along the path, as a fraction of the whole, times how long the draw takes.
   A step's text arrives because the line reached it, not because a number in a
   stylesheet happened to match. Those delays are the only thing this module
   tells the type — the reveal itself is still the site-wide [data-reveal] in
   main.js, so nothing here can leave a step invisible.

   WHEN IT DOES NOT RUN. Below ~960px the row wraps to two columns and then to
   one, and three nodes strung across a line stop describing anything. Rather
   than test a breakpoint, the module checks whether the three steps are still
   sitting on one line and stands down if they are not: the drawing is emptied,
   the measured delays are dropped, and the group falls back to the vertical
   rule and the plain nth-child stagger it has in CSS. Same when the reader
   prefers reduced motion, in which case the line is simply already drawn. */

import { curve, nib, offsetWithin } from "./nib.js";

// This line runs across the page, which is what the pen is held to suit.
const ALONG = "x";

const NODE_R = 3.5;

/* How far past the edge of the window the line runs before it stops. It is a
   line crossing the page, so both ends have to leave the frame — anything less
   and it reads as a shape that finished early, which is what a first cut of
   this did: the exit was measured from the last node rather than from the
   window, and on a wide screen that put the end of the line inside 03's own
   column, trailing off in the middle of the paragraph.

   Small, because everything before the left edge and after the right is drawn
   but never seen, and the reveal still has to travel it. */
const EDGE = 40;

// How long the full draw takes, and how long a step's text waits after the
// line has passed its node. The lag is what stops the type landing exactly on
// the node and reading as one event rather than as cause and effect.
const DRAW_MS = 1150;
const TEXT_LAG_MS = 90;

// Nodes are meant to sit on one line. Two steps whose tops differ by more than
// this are on separate rows, and the drawing is off.
const ROW_TOLERANCE = 8;

/* The exponent on the sweep's ease-out. Gentle, and deliberately not the
   --ease-out-quart the steps' own transition uses: that curve is right for a
   20px move over 600ms and wrong for a line crossing 1500px, where it spends
   the first quarter of its time covering two thirds of the distance. Under it
   the whole row was released inside the first 370ms and the line then crawled
   the rest — a pen drawing a stroke barely decelerates until the end of it.

   Both the sweep and the delays read this, and time() inverts it, so the two
   cannot drift apart whatever it is set to. */
const EASE = 1.6;

const CLIP_ID = "st-wave-clip";

// How far up from the fold the row has to come before the line starts.
const IN_MARGIN = "0px 0px -12% 0px";

export function initStepWave(selector = "[data-step-wave]") {
  const group = document.querySelector(selector);
  if (!group) return;
  const svg = group.querySelector("[data-step-wave-draw]");
  const marks = [...group.querySelectorAll("[data-step-wave-node]")];
  if (!svg || marks.length < 2) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  let clip = null;
  let span = 0;
  let started = 0;
  let frame = 0;
  let drawn = false;
  let watching = false;

  /* One row or not. Read off the boxes rather than off a media query, so a
     layout change anywhere above this — a longer heading, a narrower shell —
     is answered without a second place to keep in step. */
  function inOneRow() {
    const tops = marks.map((mark) => offsetWithin(mark, group).y);
    return Math.max(...tops) - Math.min(...tops) <= ROW_TOLERANCE;
  }

  function standDown() {
    svg.innerHTML = "";
    clip = null;
    group.classList.remove("has-wave");
    marks.forEach((mark) => {
      mark.parentElement.style.removeProperty("--at");
      mark.parentElement.style.removeProperty("--lift");
    });
  }

  function draw() {
    if (!inOneRow()) {
      standDown();
      return;
    }

    const width = group.offsetWidth;
    const height = group.offsetHeight;
    const amp =
      parseFloat(getComputedStyle(group).getPropertyValue("--wave-amp")) || 0;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    /* The nodes alternate above and below the line's axis, the way the
       conversation's alternate left and right of it. The axis is wherever the
       placeholders sit in the flow, so the room the swing needs is reserved in
       CSS by the placeholder's own margins and never has to be guessed here. */
    const axisY = offsetWithin(marks[0], group).y + marks[0].offsetHeight / 2;
    const nodes = marks.map((mark, index) => ({
      x: offsetWithin(mark, group).x + mark.offsetWidth / 2,
      y: axisY + (index % 2 ? amp : -amp),
    }));

    /* The line either side of the row. It is one wave, so rather than bolt an
       entry and an exit onto the three nodes, the whole thing is generated as
       the same series the nodes are part of: a point every half-gap, on the
       axis between nodes and at full amplitude on them, carried on past both
       ends until it is out of the window. At even steps that series lands
       exactly on the nodes, which is what keeps the run-in and the run-out at
       the pitch the row holds — and the pitch has to stay constant, because
       the nib takes its scale from the sharpest turn on the curve and one
       steeper passage drags every other turn towards the thin end. An early
       cut entered by dropping from the heading into the row, seven times
       sharper than any swing, and came out a 1.75px thread with a wedge on
       the left. */
    const gap = (nodes[nodes.length - 1].x - nodes[0].x) / (nodes.length - 1);

    /* How many more turns each side before the line is out of the window,
       counted from the outermost node rather than from the edge of the row —
       the turns are spaced off the nodes, so the nodes are what they have to
       be measured from. Getting that wrong is what left the line finishing
       inside 03's paragraph. A rect is right here where offsetWithin is right
       for the nodes: this asks where the row sits in the window, not where a
       node sits in the row. */
    const box = group.getBoundingClientRect();
    const view = document.documentElement.clientWidth;
    const before = Math.ceil(
      Math.max(0, box.left + nodes[0].x + EDGE) / gap,
    );
    const after = Math.ceil(
      Math.max(0, view + EDGE - (box.left + nodes[nodes.length - 1].x)) / gap,
    );

    /* Turning points only, never the axis crossings between them. curve()
       holds every point's tangent parallel to the axis before letting the line
       away, which is exactly right at a crest and exactly wrong halfway down
       one: a version of this that seeded the crossings too flattened each
       swing into a plateau and took the whole line to a 1.25px thread. The
       crossings are the curve's own business. */
    const swing = (turn) => axisY + (((turn % 2) + 2) % 2 ? amp : -amp);
    const points = [];
    for (let turn = -before; turn <= nodes.length - 1 + after; turn++) {
      points.push({ x: nodes[0].x + turn * gap, y: swing(turn) });
    }
    const d = curve(points, ALONG);

    /* The reveal only sweeps the part of the line anyone can see. The path runs
       a whole turn past the window at each end — it has to, or the curvature at
       the ends would be invented rather than continued — but sweeping all of
       that would spend the first fifth of the draw off the left of the screen
       and finish the last fifth off the right, so the line would appear to
       arrive late and stop early. */
    const from = Math.max(points[0].x, -box.left - EDGE);
    const to = Math.min(points[points.length - 1].x, view - box.left + EDGE);

    /* Carry the steps with the line. Each one is shifted by exactly its node's
       offset from the axis, which lands the placeholder on the node it stands
       for and takes the number, title and copy with it — so 01 and 03 ride up
       and 02 sits down, and the row follows the swing instead of the line
       passing behind three things pinned to a baseline.

       A transform rather than a margin, deliberately: it moves nothing in
       layout, so the positions measured above stay the positions drawn to and
       the two can never chase each other. See --lift in style.css, which folds
       it into the reveal's own transform. */
    marks.forEach((mark, index) => {
      const lift = index % 2 ? amp : -amp;
      mark.parentElement.style.setProperty("--lift", `${lift}px`);
    });

    const circles = nodes
      .map(
        (node) =>
          `<circle class="st-wave__node" cx="${node.x.toFixed(2)}"` +
          ` cy="${node.y.toFixed(2)}" r="${NODE_R}" />`,
      )
      .join("");

    /* The clip is what draws the line in. A stroke could have been revealed
       with stroke-dasharray, but the nib is a filled shape — it has no stroke
       to dash — so the whole group is clipped to a rectangle that grows across
       the row instead. The nodes sit inside the same clip, which is what makes
       each one appear as the line reaches it rather than waiting there for it.
       The rectangle is over-tall so the swing never clips above or below. */
    svg.innerHTML =
      `<defs><clipPath id="${CLIP_ID}">` +
      `<rect x="${from.toFixed(2)}" y="${-height}" width="0" height="${height * 3}" />` +
      `</clipPath></defs>` +
      `<g clip-path="url(#${CLIP_ID})">` +
      `<path class="st-wave__nib" d="${nib(svg, d, ALONG)}" />${circles}</g>`;

    clip = svg.querySelector(`#${CLIP_ID} rect`);
    span = to - from;
    group.classList.add("has-wave");
    time(nodes, from);
  }

  /* When the line reaches each node, which is when that step's text is let go.

     The reveal is a rectangle widening in x, so a node's moment is decided by
     how far across the sweep it sits — not by how much arc the line has
     covered getting there, which is what an earlier cut of this measured and
     which is a different number. And the sweep is eased, so the fraction has
     to be run back through the inverse of that easing: at the halfway point in
     x the draw is only a fifth of the way through its time. */
  function time(nodes, from) {
    marks.forEach((mark, index) => {
      const across = (nodes[index].x - from) / span;
      const held = Math.min(1, Math.max(0, across));
      const at = Math.round((1 - Math.pow(1 - held, 1 / EASE)) * DRAW_MS);
      mark.parentElement.style.setProperty("--at", `${at + TEXT_LAG_MS}ms`);
    });
  }

  function paint(now) {
    frame = 0;
    if (!clip) return;
    if (!started) started = now;
    const through = Math.min(1, (now - started) / DRAW_MS);
    const eased = 1 - Math.pow(1 - through, EASE);
    clip.setAttribute("width", (span * eased).toFixed(1));
    if (through < 1) frame = window.requestAnimationFrame(paint);
  }

  function start() {
    drawn = true;
    if (!clip) return;
    if (still.matches) {
      clip.setAttribute("width", span);
      return;
    }
    started = 0;
    if (!frame) frame = window.requestAnimationFrame(paint);
  }

  function watch() {
    if (watching || drawn) return;
    if (still.matches || !("IntersectionObserver" in window)) {
      start();
      return;
    }
    watching = true;
    let delivered = false;
    const observer = new IntersectionObserver(
      (entries, self) => {
        delivered = true;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          self.disconnect();
          start();
        });
      },
      { threshold: 0, rootMargin: IN_MARGIN },
    );
    observer.observe(group);

    // Safety net, as in drawn-sequence.js: a working observer always delivers
    // an initial batch for what it is given, on screen or not. Nothing came, so
    // put the line up rather than leave the row with a gap where it should be.
    window.setTimeout(() => {
      if (delivered) return;
      observer.disconnect();
      start();
    }, 3000);
  }

  /* Redrawing rewrites the clip, so a line the reader has already watched draw
     has to be put straight back to full — otherwise a resize, or the webfont
     settling, wipes it off the page mid-section. */
  function redraw() {
    draw();
    if (clip && drawn) clip.setAttribute("width", span);
  }

  draw();
  // The nodes are measured off boxes the webfont has not settled yet, so draw
  // once so there is something there, then again once it has.
  if (document.fonts?.ready) document.fonts.ready.then(redraw);
  watch();

  window.addEventListener("resize", redraw);
  still.addEventListener("change", redraw);
}
