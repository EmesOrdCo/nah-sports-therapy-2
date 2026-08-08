/* The films on /client-stories.
 *
 * Short films of clients saying what brought them in. Short form: portrait,
 * 9:16, under a minute — shot on a phone held upright, which is the way these
 * get made and the way they are watched. The frame is held by the page rather
 * than by the file, so a clip that came off the camera at some other shape is
 * cropped to fit instead of setting the height of the row it is in.
 *
 * The FIRST entry is the lead, and it IS the head of the page: it stands
 * where a title would, on the wave artwork, with its name and line underneath.
 * There is no drawn title over it — see filmsHero() in site-content.js for why
 * a headline and a film saying the same thing is one of them too many.
 * Everything after the first is listed below, most recent first, so the newest
 * film is what the page opens on and the earlier ones stay in reach.
 *
 * That ordering is the whole of the "member of the week" idea, minus the part
 * that breaks. There is no date anywhere: no month, no season, no year. A
 * dated slot is a promise to fill it again next month, and a stale one is
 * worse than none — "March" still sitting there in September tells a visitor
 * the practice stopped paying attention. Put a new film at the top of the list
 * when there is one, and the page is right on the day it goes up and right
 * again eight months later.
 *
 * An empty list renders nothing at all: filmLead() returns "", the switch
 * loses its Films side, and /client-stories falls through to the wall of
 * written quotes. There is never an empty shelf, a placeholder card or a
 * "coming soon".
 *
 * ---- Adding a film ----
 *
 * 1. Put the file in public/videos/films/. Portrait 9:16 (1080×1920 is the
 *    natural phone frame), 40–60 seconds. No music, no burnt-in captions, no
 *    trend audio — one person talking, trimmed at both ends. Natasha does not
 *    have to be on camera or edit anything: three fixed questions from behind
 *    the phone (what brought you here, what were you worried about, what is
 *    different now) and the client does the talking.
 * 2. Put a poster still in public/images/films/ — a frame from the film
 *    itself, so the hand-off when it starts is invisible.
 * 3. Write a .vtt caption file next to the video and point `captions` at it.
 *    Not optional: these are people describing pain and injury, and a visitor
 *    watching without sound is the ordinary case, not the edge one.
 * 4. Add the entry at the TOP of the list below — the top is the lead slot.
 *    `blurb` is the line under the name: what brought them in, in their words
 *    where possible. One sentence.
 *
 * ---- Consent ----
 *
 * A client on camera describing an injury or a condition is disclosing health
 * information. Nothing goes on this shelf without written, specific consent
 * that can be withdrawn, and withdrawal means deleting the entry here and the
 * files it points at. A verbal yes in the studio is not that.
 */

/* ============================================================
   PLACEHOLDER FOOTAGE — REPLACE BEFORE THIS PAGE GOES LIVE
   ============================================================

   Every clip below is Mixkit stock footage (Mixkit Free License: commercial
   use, no attribution required), standing in so the shelf can be designed,
   reviewed and shown to NJH before a single real film has been shot. The
   people in them are actors. They are not clients of this practice and have
   never been through its door.

   Which is why not one of these cards carries a name or a quote. The captions
   describe the slot, not a person. A stranger's face under an invented first
   name, on a page headed "in clients' own words", is a fabricated testimonial
   — and it is no less fabricated for everyone involved knowing it is a
   placeholder, because the visitor reading it does not know.

   So: swap in real films and real names TOGETHER. If a real film arrives for
   one slot, delete the remaining placeholders rather than leaving one genuine
   client sitting in a row of actors. Empty is a state this shelf handles — see
   filmLead(), which renders nothing at all from an empty list.

   The captions each film should end up with are described in the header above.
   ============================================================ */
export const FILMS = [
  {
    name: "Latest film",
    blurb:
      "Placeholder footage. A client film goes here, with their name above and a line about what brought them in.",
    poster: "/images/films/45761.webp",
    sources: [{ src: "/videos/films/45761-portrait.mp4" }],
  },
  {
    name: "Earlier film",
    blurb:
      "Placeholder footage. A client film goes here, with their name above and a line about what brought them in.",
    poster: "/images/films/48547.webp",
    sources: [{ src: "/videos/films/48547-portrait.mp4" }],
  },
  {
    name: "Earlier film",
    blurb:
      "Placeholder footage. A client film goes here, with their name above and a line about what brought them in.",
    poster: "/images/films/45695.webp",
    sources: [{ src: "/videos/films/45695-portrait.mp4" }],
  },
  {
    name: "Earlier film",
    blurb:
      "Placeholder footage. A client film goes here, with their name above and a line about what brought them in.",
    poster: "/images/films/48553.webp",
    sources: [{ src: "/videos/films/48553-portrait.mp4" }],
  },
];

/* The shape a real entry takes, for when the first one is shot. At the top of
 * the list it is the lead; below, it is one of the earlier ones.
 *
 *   {
 *     name: "Penny",
 *     blurb: "Came in after a ruptured tendon, and stayed for the classes.",
 *     poster: "/images/films/penny.webp",
 *     // One file. A minute of 9:16 is small enough that the narrow/wide split
 *     // the studio hero reel carries would be two files to keep in step for
 *     // no saving worth having. `sources` stays an array because a browser
 *     // that refuses one codec should be offered another, not because the
 *     // same film needs cutting twice.
 *     sources: [{ src: "/videos/films/penny.mp4" }],
 *     captions: "/videos/films/penny.en.vtt",
 *   },
 */

/* The page's name, and short on purpose. It was a full display sentence —
   "Meet some of the people who come here" — which at --step-3h ran to two
   lines and pushed the film most of a screen down the page to make room for a
   description of the film. Three words say the same thing above the fold.

   The sentence that used to run under it — "Short films from clients, in their
   own words, what brought them in and what is different now" — has gone
   altogether. It survives as the page's meta description, which is the one
   place a sentence about the page is still doing work. */
export const FILMS_TITLE = "Meet our clients.";

/* Whether there is a films page at all. An empty list is not an empty page
   with a heading over it: the switch drops the Films side, /client-stories
   falls through to the reviews, and nobody meets a page with nothing on it.
   See the routes table. */
export const hasFilms = () => FILMS.length > 0;

const sourceTag = ({ src, type = "video/mp4", media }) =>
  `<source src="${src}" type="${type}"${media ? ` media="${media}"` : ""} />`;

/* preload="none" and no autoplay: nothing is fetched until somebody asks for
   it. A shelf of films that all begin downloading on arrival is several
   megabytes spent on a page whose main content is text.

   `controls` ships in the markup rather than being added by initFilmShelf, so
   the films still play with no JS at all. The overlay button on top of them is
   the part that needs JS, and CSS keeps it hidden until the `js` class the
   boot sequence sets says there is some — and where there is some, that same
   module takes the controls straight back off until they are wanted. */
/* The player itself, which is the same object in the lead slot and in the list
   below it — one 9:16 frame, one poster, one overlay. Only the size around it
   changes, and that is the stylesheet's business rather than this function's:
   two markup shapes for one thing is two things to keep in step. */
const filmFrame = (film, index) => {
  /* The name goes on the button, not just on the caption below it: "Play",
     four times down a page, tells somebody listening to it nothing about which
     film is which. As an aria-label rather than as clipped text inside the
     button, because a visually hidden span is a name computed from contents —
     and something that has to be computed is something that can be missed.
     This is the name, stated. */
  const label = `Play ${film.name}&rsquo;s story`;
  return `<div class="films__frame">
        <video
          class="films__video"
          id="film-${index}"
          poster="${film.poster}"
          preload="none"
          playsinline
          controls
        >
          ${film.sources.map(sourceTag).join("\n          ")}
          ${film.captions ? `<track kind="captions" src="${film.captions}" srclang="en" label="English" default />` : ""}
        </video>
        <button class="films__play" type="button" data-film-play aria-label="${label}" aria-controls="film-${index}">
          <span class="films__play-mark" aria-hidden="true"></span>
        </button>
      </div>`;
};

/* The lead, which is the head of the page rather than the first thing under
   one. site-content.js drops this straight into the hero, so it stands on the
   wave artwork with nothing above it but the crumb and the switch — the film
   IS the title, and a display line saying so over the top of it was two things
   competing for the same job.

   Its name and line sit underneath rather than beside it: centred under a
   centred film, the pair reads as one object. */
export function filmLead() {
  if (!FILMS.length) return "";
  const film = FILMS[0];
  return `<figure class="films__lead" data-reveal>
      ${filmFrame(film, 0)}
      <figcaption class="films__lead-text">
        <p class="films__name">${film.name}</p>
        <p class="films__lead-blurb">${film.blurb}</p>
      </figcaption>
    </figure>`;
}

const earlierFilm = (film, index) =>
  `<figure class="films__card" data-reveal>
      ${filmFrame(film, index)}
      <figcaption class="films__caption">
        <p class="films__name">${film.name}</p>
        <p class="films__blurb">${film.blurb}</p>
      </figcaption>
    </figure>`;

/* Everything after the first, in the order the list is written — newest at the
   top, so a new film goes in at the top and nothing else moves.

   These get a heading where the lead does not: a row of smaller films with
   nothing said about it is a row of unexplained thumbnails, whereas the lead
   is the thing the page opens on and needs no label to say so.

   The heading is deliberately not "Previously" and not a date — see the note
   at the top of this file about what a date does to a page nobody updates for
   eight months. Returns nothing at all when there is only the lead. */
export function filmsMore() {
  const earlier = FILMS.slice(1);
  if (!earlier.length) return "";
  return `<section class="films" aria-label="Earlier client films">
    <div class="section-shell">
      <h2 class="films__more-title" id="films-more">More films</h2>
      <div class="films__shelf" data-count="${Math.min(earlier.length, 4)}" aria-labelledby="films-more">
        ${earlier.map((film, i) => earlierFilm(film, i + 1)).join("\n        ")}
      </div>
    </div>
  </section>`;
}

/* Click the still, the film starts and the overlay gets out of the way. The
   button is a real <button> rather than a click handler on the poster, so it
   is reachable by keyboard and announces what it is going to play — "Play" on
   its own, four times down a shelf, tells a screen reader nothing.

   One film at a time. Two people talking over each other is nobody's idea of
   a testimonial, and on a shelf of stills it is easy to start a second without
   noticing the first is still running. */
export function initFilmShelf() {
  /* Every film on the page, wherever it is standing.

     This has now been scoped wrongly twice — first to .films__shelf, which
     holds only the earlier films, then to .films, which stopped holding the
     lead the moment the lead moved into the head. Both times the symptom was
     the same and it landed on the most important film on the page: no
     listener on its button, and its markup `controls` never taken off, so the
     one film the page is built around was the one wearing a scrubber across
     the poster and doing nothing when clicked.

     The films are the set of .films__video, not the contents of whichever box
     currently happens to hold them. Asking the document for them directly is
     what makes moving one a layout change rather than a bug. */
  const videos = [...document.querySelectorAll(".films__video")];
  if (!videos.length) return;

  /* The markup is the no-JS state, and this is JS taking it over: `controls`
     ships on the element so a player without scripting is still a player, but
     a browser draws that bar over the poster from the moment the page loads —
     so a page of faces arrives wearing four scrubbers and a volume slider
     nobody has asked for yet. Off here, and handed back the moment somebody
     presses play, when a scrubber is exactly what they want. */
  videos.forEach((video) => {
    video.controls = false;
  });

  document.querySelectorAll("[data-film-play]").forEach((button) => {
    button.addEventListener("click", () => {
      const video = button.parentElement.querySelector(".films__video");
      if (!video) return;
      video.controls = true;
      videos.forEach((other) => {
        if (other !== video) other.pause();
      });
      video.play().catch(() => {
        /* Refused — low power mode, a codec the browser will not take. The
           poster is still underneath and the native controls are on the
           element, so the overlay comes off either way and the reader is left
           with a player they can press themselves. */
      });
    });
  });

  /* The overlay is hidden by the card's state rather than by the button, so a
     film that is paused half way through does not get the big play mark thrown
     back over the top of it — the native controls have the pause and the
     scrubber, and covering them the moment somebody pauses to think is
     precisely the wrong moment to do it. Once a film has been started, its
     overlay is gone for the rest of the visit. */
  videos.forEach((video) => {
    video.addEventListener(
      "play",
      () =>
        video
          .closest(".films__card, .films__lead")
          ?.classList.add("is-playing"),
      { once: true },
    );
  });
}
