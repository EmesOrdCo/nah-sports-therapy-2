/* Shared source of truth for every About variant.

   Provenance: all prose here is Natasha's own wording, lifted from the live
   site (njhsportstherapy.co.uk/about and the homepage) and kept in FIRST
   PERSON. Do not paraphrase into brand voice, and do not invent dates, client
   counts or years-in-practice — nothing beyond what is recorded below is
   sourced. If a variant needs a fact that is not in this file, ask first. */

export const NAME = "Natasha Hadland";

export const CONTACT = {
  tel: "07881 821901",
  telHref: "tel:+447881821901",
  email: "natasha@njhsportstherapy.co.uk",
};

/* Verbatim from the current /about page, in her voice. */
export const STORY = [
  "After a ten year career in the Fashion industry, I took a career break to spend time with my young family.",
  "Time away from full time work enabled me to pursue my passion for sports and my interest in human anatomy and physiology. This led to a new and exciting career as a Sports Therapist after completing a Diploma at the London School of Sports Massage, which has been the pioneer and leader in Sport and Remedial Massage training since 1989. My interest in rehabilitation and postural issues then led onto my training as a Certified STOTT Pilates instructor.",
  "I am passionate about improving clients' health, fitness and well being. Through the use of many advanced Soft Tissue techniques and Pilates exercises I can deliver specific and effective treatment for your injury or postural issues. I aim to provide the highest level of professional and personal care to you at all times.",
];

/* Verbatim from the homepage — also first person, and the clearest statement
   of who she actually treats. */
export const PRACTICE = {
  specialism:
    "I specialise in the treatment and prevention of all musculoskeletal injuries.",
  aim: "My aim is to help you become pain free and get you back to fully functioning fitness. Each client is unique. Whatever your goal, whether you are a Sunday stroller or an elite athlete, I will help you every step of the way.",
  breadth:
    "Sports Therapy &amp; Pilates is not just for sports injuries. I treat clients from age 8 to over 80 years of age.",
};

/* Short pull-quotes, all drawn from the sentences above. Use for display type
   — never put a sentence in her mouth that is not in STORY or PRACTICE. */
export const PULLQUOTES = {
  passion: "I am passionate about improving clients' health, fitness and well being.",
  everyStep:
    "Whether you are a Sunday stroller or an elite athlete, I will help you every step of the way.",
  unique: "Each client is unique.",
  ageRange: "I treat clients from age 8 to over 80.",
  care: "I aim to provide the highest level of professional and personal care to you at all times.",
};

/* Exactly as listed on the live site. The fourth line reads "Certified STOTT
   Pilates Instructor / REPS registered Level 3" there; `body` is the awarding
   or registering organisation, `short` is for tight layouts. */
/* `logo` is the awarding body's mark, for the drifting credentials strip — the
   same four cards the home page carries. Width and height are the intrinsic
   pixels of the raster files, so the row does not reflow as they arrive; the
   two SVGs are sized by CSS and have none to give. */
export const QUALIFICATIONS = [
  {
    title: "Diploma in Sport & Remedial Massage",
    short: "Sport & Remedial Massage",
    body: "London School of Sports Massage",
    note: "Pioneer and leader in Sport and Remedial Massage training since 1989.",
    logo: {
      src: "/images/logos/lssm.png",
      alt: "London School of Sports Massage",
      width: 140,
      height: 125,
    },
  },
  {
    title: "BTEC Level 5 Professional Diploma in Clinical Sport & Remedial Massage",
    short: "Clinical Sport & Remedial Massage",
    body: "BTEC Level 5",
    note: "",
    logo: {
      src: "/images/logos/pearson-btec.png",
      alt: "Pearson BTEC",
      width: 800,
      height: 330,
    },
  },
  {
    title: "VTCT Level 3 Diploma in Anatomy, Physiology and Pathology",
    short: "Anatomy, Physiology & Pathology",
    body: "VTCT Level 3",
    note: "",
    logo: { src: "/images/logos/vtct-skills.svg", alt: "VTCT Skills" },
  },
  {
    title: "Certified STOTT Pilates Instructor",
    short: "STOTT Pilates Instructor",
    body: "Merrithew, REPS registered, Level 3",
    note: "",
    logo: { src: "/images/logos/stott-pilates.svg", alt: "STOTT PILATES" },
  },
];

/* Professional bodies. Logos exist at public/images/legacy/ for the first
   three; there is no mark on file for REPS. */
export const AFFILIATIONS = [
  { name: "London School of Sports Massage", logo: "/images/legacy/lssm-mark.gif" },
  { name: "Institute of Sport & Remedial Massage", logo: "/images/legacy/isrm-logo.jpg" },
  { name: "Merrithew STOTT Pilates", logo: "/images/legacy/merrithew-logo.png" },
];

/* The career change, as a sequence. Deliberately unnumbered and undated —
   the live site gives no years, so none are asserted here. */
export const CHAPTERS = [
  {
    label: "Before",
    title: "Ten years in fashion",
    text: "A ten year career in the Fashion industry, then a career break to spend time with my young family.",
  },
  {
    label: "The turn",
    title: "A passion for sport and anatomy",
    text: "Time away from full time work enabled me to pursue my passion for sports and my interest in human anatomy and physiology.",
  },
  {
    label: "Training",
    title: "London School of Sports Massage",
    text: "A Diploma at the London School of Sports Massage, the pioneer and leader in Sport and Remedial Massage training since 1989, led to a new and exciting career as a Sports Therapist.",
  },
  {
    label: "Then",
    title: "Certified STOTT Pilates",
    text: "My interest in rehabilitation and postural issues then led onto my training as a Certified STOTT Pilates instructor.",
  },
  {
    label: "Now",
    title: "Soft tissue and Pilates, together",
    text: "Through the use of many advanced Soft Tissue techniques and Pilates exercises I can deliver specific and effective treatment for your injury or postural issues.",
  },
];

/* Moved here from the Studio page, where it was the closing act and read as
   an afterthought. It is a fact about Natasha rather than about the room, so
   it belongs beside her story. Wording is the client's, unchanged. */
export const CHARITY = {
  heading: "Charity work",
  lead: "NJH Sports Therapy &amp; Pilates is keen to help raise money for charities in the area. Where possible, Natasha donates a Pilates 1:1 or duet voucher as a silent auction or raffle prize.",
  tail: "Please contact Natasha if you would like to discuss this further.",
  cta: "Get in touch",
};

/* Named by village only — the studio is also a private home. See PLACES in
   contact/content.js for the same rule. */
export const WHERE = [
  {
    name: "The Studham studio",
    lines: ["A private studio near Whipsnade"],
    href: "/studio#studio",
  },
];


/* ---------------------------------------------------------------------------
   Practical content — now rendered on /faq rather than here (see faq/faq.js).
   It stays in this file because this is where Natasha's wording lives, and
   splitting her copy across two directories would give it two owners.

   All of this is lifted from the old site's own pages (/what-to-expect and
   /clinic-policies), still in her voice. Two sentences carried typos in the
   original; they are repaired minimally below and the originals are recorded
   here so nothing is silently rewritten:

     "Your goals we are working towards and a treatment plan will be discussed
      which may include home exercises."          (missing clause structure)
     "Every treatment is tailored to the individual clients needs."
                                                  (missing apostrophe)
   ------------------------------------------------------------------------- */

export const FIRST_VISIT = {
  lead: "At your first appointment I will:",
  steps: [
    "Take a brief medical history",
    "Assess your injury or area of pain",
    "Assess your posture, the joint and the surrounding area",
  ],
  after: [
    "We will discuss the goals we are working towards and a treatment plan, which may include home exercises. Every treatment is tailored to the individual client's needs.",
    "Feedback is essential following each treatment to review progression and amend your treatment plan if necessary.",
  ],
};

export const WHAT_TO_WEAR = [
  "If possible please wear loose comfortable clothing or bring shorts with you.",
  "Depending on the location of your injury you may be required to remove some items of clothing.",
  "However, treatment can be done through clothes if you prefer.",
];

/* The best sentence on the entire old site, and the natural hinge between the
   personal half of the page and the practical half. */
export const ATHLETE_QUOTE =
  "You don't have to be an athlete to use NJH Sports Therapy &amp; Pilates. I get as much satisfaction from making a difference to the life of a patient with a disabling condition as I do working with elite sportsmen and women.";

/* Verbatim from /clinic-policies. NOTE: the cancellation wording is confusing
   as written on the live site — it asks for 24 hours notice and then mentions
   a 50% charge under 48 hours. Reproduced faithfully rather than guessed at;
   worth confirming with Natasha before launch. */
export const POLICIES = [
  {
    q: "What if I need to cancel?",
    a: [
      "In accordance with standard practice we regret that a charge will be made for missed Soft Tissue, 1:1 or 2:1 Pilates appointments or non-attendance unless 24 hours notice is given. A 50% charge is required for less than 48 hours notice.",
    ],
  },
  {
    q: "What if I'm running late?",
    a: [
      "If you are late for your 1:1 or 2:1 the session still falls within the scheduled appointment time. If the practitioner misses a scheduled 1:1 appointment, you will receive a free session.",
    ],
  },
  {
    q: "Do you treat children?",
    a: [
      "Patients under 16 years of age must be accompanied by a parent who will be required to sign a parental consent form.",
    ],
  },
  {
    q: "How do small group Pilates blocks work?",
    a: [
      "Small group Pilates blocks are paid for in termly blocks. Once payment is received in advance of the block your place is reserved for the entire block. Please note no refunds will be given.",
    ],
  },
];

/* The welcome film. Natasha's own footage, supplied by NJH ("Use this
   video.MP4", shot June 2022): she opens the studio door, shows the visitor
   in, and speaks to camera from the mat in NJH kit. Portrait 9:16 off a phone
   held upright, 53 seconds — re-encoded from the 21MB original to the same
   720×1280 / ~0.6Mbps norm as the client films, poster taken from the film's
   own first frame so the hand-off when it starts is invisible.

   No `captions` yet, and the rule in films.js applies here too: she is
   speaking throughout, so a .vtt transcribed from the film is a gap to close,
   not a decision. Point `captions` at it when it exists. */
export const WELCOME_FILM = {
  poster: "/images/about-welcome-poster.webp",
  sources: [{ src: "/videos/about-welcome.mp4" }],
  ariaLabel: "Play Natasha&rsquo;s welcome film",
};

/* The portrait. Sourced from the practice's own Facebook page — Natasha in NJH
   kit in front of the muscular-system chart. Square original is 1536px.

   hero* is the same photograph cut for the page's full-bleed hero (August
   2026, from a 447px web thumbnail of this exact frame Harry sent — matched
   to the square by pixel comparison, so the repo's own copy is the source
   rather than the thumbnail). The square is cropped from the bottom to the
   studio hero's 1600:1248 frame, keeping her head and the chart's title,
   then upscaled ×4 with Real-ESRGAN (Upscayl's remacri-4x — high-fidelity-4x
   left painterly artifacts in her hair) from the 1200px copy — the 1536px
   original predates the repo and is not on disk — and cut to the studio
   hero's own 800/1600/2400 ladder. */
export const PORTRAIT = {
  hero800: "/images/about-hero-800.webp",
  hero1600: "/images/about-hero-1600.webp",
  hero2400: "/images/about-hero-2400.webp",
  portrait900: "/images/natasha-portrait-900.webp",
  portrait540: "/images/natasha-portrait-540.webp",
  square1200: "/images/natasha-square-1200.webp",
  wide1400: "/images/natasha-wide-1400.webp",
  alt: "Natasha Hadland in NJH kit, standing in front of an anatomical chart of the muscular system",
};
