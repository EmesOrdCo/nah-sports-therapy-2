/* The testimonial wall on /testimonials.
 *
 * Three columns drift — the outer two down, the middle up — and all three stop
 * the moment the pointer or the keyboard reaches the band. Stopped, each column
 * is a plain scroll container, so the reader takes over with the wheel, the
 * trackpad, a scrollbar or the arrow keys, and the drift picks up from wherever
 * they left it.
 *
 * The drift itself is in drift-columns.js, which the taping band on
 * /sports-therapy runs on too.
 */

import { driftColumns } from "./drift-columns.js";

export function initVoicesWall() {
  driftColumns(document.querySelector(".voices__columns"), {
    col: ".voices__col",
    view: ".voices__window",
    track: ".voices__track",
    down: "voices__col--down",
    speed: 12,
  });
}
