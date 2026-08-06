/* Single source of truth for client reviews.
 *
 * Every page that shows a review reads from here — the homepage thread, the
 * full set on /clinics, and the About page selection. Add a review once and it
 * appears everywhere, correctly attributed.
 *
 * The captions used to be inconsistent: some named a service, some named the
 * injury the client came in with, others gave a job title, a duration or a
 * village. NJH asked for one kind of label, so:
 *
 *   - `services` is the ONLY categorisation, drawn from a fixed set of two.
 *     A review that describes both carries both, and shows under either filter.
 *   - The caption is the client's name and nothing else. No condition, no
 *     occupation, no duration, no location. The quote carries the specifics.
 *
 * Keep it that way. If a new review needs a third kind of label, the label is
 * wrong, not the rule.
 */

export const SPORTS_THERAPY = "sports-therapy";
export const PILATES = "pilates";

export const SERVICE_LABELS = {
  [SPORTS_THERAPY]: "Sports Therapy",
  [PILATES]: "Pilates",
};

/* `featured` marks the five that run on the homepage. Order here is the order
   they appear; the homepage takes the featured ones in this same order. */
export const REVIEWS = [
  {
    name: "Penny",
    services: [SPORTS_THERAPY, PILATES],
    featured: true,
    quote:
      "I call Natasha my miracle worker. Not only has she released the muscles in my neck and shoulders so I no longer ache constantly, but she has also given me regained movement in my foot following a severely ruptured tendon.",
  },
  {
    name: "Sarah",
    services: [SPORTS_THERAPY, PILATES],
    featured: true,
    quote:
      "After almost 3 months of weekly classes and 3 sports therapy sessions I am amazed at the range of pain free movement I now have.",
  },
  {
    name: "Laura",
    services: [SPORTS_THERAPY],
    featured: true,
    quote:
      "Her treatment hugely helped my long standing shoulder injury, increasing my range and ease of movement. I am now able to work better in the gym and play tennis without pain.",
  },
  {
    name: "Tessa",
    services: [PILATES],
    featured: true,
    quote:
      "I come away feeling taller, stronger and straighter, sometimes I even have to adjust my rear-view mirror before driving off after a session to accommodate my new found height!",
  },
  {
    name: "Kim",
    services: [SPORTS_THERAPY, PILATES],
    featured: true,
    quote:
      "My lower back problems have more or less vanished and I am now comfortable at work and able to undertake other forms of exercise.",
  },
  {
    name: "Nicola",
    services: [PILATES],
    quote:
      "My general fitness level has really improved. Natasha is an excellent teacher and I would have no hesitation in recommending her.",
  },
  {
    name: "Danny",
    services: [SPORTS_THERAPY],
    quote:
      "Natasha also takes the time to ensure you understand the treatment being performed and its intended outcome. I am pleased to say I am now pain free and I would recommend Natasha to anyone.",
  },
  {
    name: "Tom",
    services: [SPORTS_THERAPY],
    quote:
      "Natasha quickly and expertly assessed my symptoms, looking at how my body functioned as a whole to treat the source of pain. Natasha also gave me some great follow up exercises to strengthen my core and improve my range of movement.",
  },
  {
    name: "Jill",
    services: [PILATES],
    quote:
      "Natasha is the best Pilates teacher I have had over many years — very professional and all exercises are personalised to suit. The facilities are excellent and the classes are very enjoyable.",
  },
  /* These two came across from the old About page with no name attached. The
     caption rule wants a name, so they need one from NJH or they should be
     dropped — names are not something to invent. */
  {
    name: "Long-standing client",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "Her attention to detail is second to none and she always manages to suit each exercise to everyone's individual needs, while ensuring proper discipline in the pilates groundwork.",
  },
  {
    name: "Pilates group member",
    services: [PILATES],
    quote:
      "She understands her clients' needs and tailors their Pilates exercises to meet those needs. I come away feeling taller, stronger and straighter.",
  },
];

export const FEATURED = REVIEWS.filter((review) => review.featured);

export function reviewsFor(filter) {
  if (!filter || filter === "all") return REVIEWS;
  return REVIEWS.filter((review) => review.services.includes(filter));
}

export function countFor(filter) {
  return reviewsFor(filter).length;
}

/* The three-beat stagger is positional, so it has to be recalculated from the
   filtered list. Hiding items in place would leave two right-aligned quotes
   next to each other and the composition falls apart. */
const OFFSETS = ["", " voices__item--right", " voices__item--indent"];

export function voicesItems(list, { revealed = false } = {}) {
  return list
    .map(
      (review, index) =>
        `<figure class="voices__item${OFFSETS[index % OFFSETS.length]}${
          revealed ? " is-visible" : ""
        }" data-reveal>
          <blockquote>&ldquo;${review.quote}&rdquo;</blockquote>
          <figcaption>${review.name}</figcaption>
        </figure>`,
    )
    .join("");
}

/* Toggle 3 — the switch is set in the display serif at quote size, under the
   section title. Active state reuses the underline the main nav draws. */
export function voicesSwitch() {
  const options = [
    ["all", "All"],
    [SPORTS_THERAPY, SERVICE_LABELS[SPORTS_THERAPY]],
    [PILATES, SERVICE_LABELS[PILATES]],
  ];

  return `<div class="voices__switch" role="group" aria-label="Filter reviews by service">
    ${options
      .map(
        ([value, label], index) =>
          `<button type="button" class="voices__switch-btn${
            index === 0 ? " is-active" : ""
          }" data-review-filter="${value}" aria-pressed="${index === 0}">${label}</button>`,
      )
      .join("")}
  </div>
  <hr class="voices__switch-rule">`;
}
