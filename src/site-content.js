import { legacyPages } from "./legacy-content.js";
import { buildAboutPage } from "./about/index.js";
import { buildContactPage } from "./contact/index.js";
import { buildFaqPage } from "./faq/index.js";
import { routePath } from "./base-path.js";
import { voicesColumns } from "./reviews.js";
import { filmLead, filmsMore, hasFilms, FILMS_TITLE } from "./films.js";
import { journeysList, hasJourneys } from "./journeys.js";

const BUSINESS = {
  phoneDisplay: "07881 821 901",
  phoneHref: "tel:+447881821901",
  email: "natasha@njhsportstherapy.co.uk",
};

const escapePath = (path) => path.replace(/\/+$/, "") || "/";

const navGroups = [
  { label: "Home", href: "/", links: [] },
  {
    label: "Pilates",
    href: "/pilates",
    links: [
      ["Overview", "/pilates#overview"],
      ["Individual Pilates", "/pilates#individual"],
      ["Reformer Pilates", "/pilates#reformer"],
      ["Stability Chair", "/pilates#stability-chair"],
      ["Small-group timetable", "/pilates#small-group"],
      ["Pre & postnatal Pilates", "/pilates#pre-postnatal"],
      ["Pilates for golfers", "/pilates#golfers"],
      // "Practical details" was the last item here, pointing at a section of
      // this page. That section now closes /faq, and this submenu is a table
      // of contents for /pilates — every other item is an anchor into the page
      // it drops from — so the entry is not kept here pointing off-page. The
      // footer's Movement column carries /faq#practical instead, and FAQ is a
      // top-level nav item in its own right.
    ],
  },
  {
    label: "Sports Therapy",
    href: "/sports-therapy",
    links: [
      ["Overview", "/sports-therapy#overview"],
      ["What to expect", "/sports-therapy#what-to-expect"],
      ["Myofascial Release", "/sports-therapy#myofascial-release"],
      ["Treatment", "/sports-therapy#treatment"],
      ["Kinesiology Taping", "/sports-therapy#kinesiology-taping"],
      ["Appointments", "/sports-therapy#practical"],
    ],
  },
  // Renamed from "Clinics". There is one studio, not a set of clinics, and the
  // studio copy that used to sit inside /pilates now lives here — so the page
  // is named for the room it is entirely about.
  // No submenu: the studio is one short page, so a dropdown of anchors into it
  // was more chrome than the page has content.
  { label: "Studio", href: "/studio", links: [] },
  { label: "About", href: "/about", links: [] },
  // The practical questions used to sit under Natasha's story on /about. They
  // are a reference, not a biography, so they have their own page — and the
  // people who need them arrive looking for them rather than for her.
  { label: "FAQ", href: "/faq", links: [] },
  // Reviews used to run as a band on the homepage and again inside Clinics.
  // They now have one page of their own, so there is a single place to read
  // them and a single place to add one.
  // Named "Client Stories" rather than "Testimonials": a testimonial is
  // somebody vouching for a service, and what the page is growing into — short
  // films of clients saying what brought them in — is a different thing and a
  // more interesting one. The old URL still works; see the routes table.
  { label: "Client Stories", href: "/client-stories", links: [] },
  // Every fee on the site lives here — the service pages describe the work and
  // link across rather than carrying figures that then need updating in five
  // places.
  { label: "Prices", href: "/prices", links: [] },
  { label: "Contact", href: "/contact", links: [] },
];

const crumbs = {
  pilates: ["Pilates", "/pilates"],
  clinics: ["Studio", "/studio"],
  therapy: ["Sports Therapy", "/sports-therapy"],
  contact: ["Contact", "/contact"],
};

function cards(items, className = "") {
  return `<div class="editorial-cards ${className}">${items
    .map(
      (item) => `<article data-reveal>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        ${item.href ? `<a class="text-link" href="${item.href}">${item.linkLabel || "Explore"} <span>→</span></a>` : ""}
      </article>`,
    )
    .join("")}</div>`;
}

function list(items, className = "") {
  return `<ul class="clean-list ${className}">${items
    .map((item) => `<li>${item}</li>`)
    .join("")}</ul>`;
}

function cta(
  title = "Not sure where to start?",
  text = "Tell us what you would like help with and we will guide you towards the most suitable first appointment.",
) {
  return `<section class="page-cta">
    <div class="section-shell page-cta__inner" data-reveal>
      <div><h2>${title}</h2></div>
      <div><p>${text}</p><a class="button-link" href="/contact">Send an enquiry <span>↗</span></a></div>
    </div>
  </section>`;
}

function band(title, copy, items) {
  return `<section class="content-band">
    <div class="section-shell content-band__grid">
      <div data-reveal><h2>${title}</h2><p class="section-lead">${copy}</p></div>
      <div data-reveal>${list(items, "tick-list")}</div>
    </div>
  </section>`;
}

function section(kicker, title, body, modifier = "") {
  return `<section class="editorial-section ${modifier}">
    <div class="section-shell editorial-section__grid">
      <header class="section-head" data-reveal><h2>${title}</h2></header>
      <div class="prose" data-reveal>${body}</div>
    </div>
  </section>`;
}

function hero({
  eyebrow,
  title,
  intro,
  parent,
  tone = "light",
  media,
  compact,
  ornament,
  wave,
}) {
  const crumb = parent
    ? `<a href="${parent[1]}">${parent[0]}</a><span aria-hidden="true">/</span>`
    : '<a href="/">Home</a><span aria-hidden="true">/</span>';
  const inner = `<nav class="breadcrumbs" aria-label="Breadcrumb">${crumb}<span>${eyebrow}</span></nav>
      <h1>${title}</h1>
      ${intro ? `<p class="page-hero__intro">${intro}</p>` : ""}`;
  /* wave: true takes the artwork /client-stories opens with; a string names one
     of the others — see --wave-art on .page-hero--wave. Only the compact head
     carries it, which is the only head it has been drawn against. */
  const waveClass = wave
    ? ` page-hero--wave${typeof wave === "string" ? ` page-hero--wave-${wave}` : ""}`
    : "";
  /* A page whose whole job is to hand you a wall of quotes cannot spend a
     screen and a half introducing itself. --compact drops the display size to
     --step-3h, puts the intro alongside the heading and loses the drifting rings,
     so the quotes are already in view when the page opens. */
  if (compact) {
    return `<section class="page-hero page-hero--${tone} page-hero--compact${waveClass}">
    ${wave ? '<div class="page-hero__wave" aria-hidden="true"></div>' : ""}
    <div class="section-shell page-hero__inner">
      ${inner}
      ${ornament ? '<div class="page-hero__ornament" aria-hidden="true"></div>' : ""}
    </div>
  </section>`;
  }
  if (media) {
    return `<section class="page-hero page-hero--${tone} page-hero--media">
    <div class="section-shell page-hero__inner">
      <div class="page-hero__content">
        ${inner}
      </div>
      <figure class="page-hero__media page-hero__media--figure"><object class="page-hero__figure" type="image/svg+xml" data="${media.src}" aria-label="${media.alt}" tabindex="-1"></object></figure>
    </div>
  </section>`;
  }
  return `<section class="page-hero page-hero--${tone}">
    <div class="page-hero__visual" aria-hidden="true">
      <span></span><span></span><span></span><i></i>
    </div>
    <div class="section-shell page-hero__inner">
      ${inner}
    </div>
  </section>`;
}

function page(config, body) {
  return { ...config, html: `${hero(config)}${body}` };
}

const pilatesHub = page(
  {
    description:
      "Precise, individual Pilates in Studham to improve posture, control, strength and confidence.",
    eyebrow: "Clinical Pilates",
    title: "Pilates that teaches your body to support itself.",
    intro:
      "Slow, precise and thoughtfully progressed movement—adapted to your body, your starting point and the way you want to move.",
  },
  `${section(
    "A considered approach",
    "Awareness is the greatest agent for change.",
    `<p>Pilates develops the deep postural muscles that support and stabilise the body. At NJH, exercises are chosen and adapted around the individual—not imposed as a one-size-fits-all sequence.</p>
     <p>The aim is to help you understand your posture, improve strength and movement around your joints, release unnecessary tension and support a healthy back.</p>`,
  )}
  <section class="card-section"><div class="section-shell">
    <header class="section-intro" data-reveal><h2>Ways to practise</h2></header>
    ${cards([
      { title: "Individual Pilates", text: "One-to-one or duet sessions designed around your posture, goals and medical history.", href: "/pilates#individual", icon: "control" },
      { title: "Small groups", text: "Attentive, welcoming classes with an initial one-to-one assessment before joining.", href: "/pilates#small-group", icon: "movement" },
      { title: "Pre & postnatal", text: "Supportive movement for pregnancy and a careful return after birth.", href: "/pilates#pre-postnatal", icon: "hands" },
      { title: "For golfers", text: "Build rotation, balance, flexibility and control to support your game.", href: "/pilates#golfers", icon: "assess" },
    ])}
  </div></section>
  ${band("Control. Strength. Balance.", "What Pilates can develop", [
    "A clearer understanding of posture and movement",
    "Core strength, stability and muscular balance",
    "Improved joint range and movement confidence",
    "A sustainable practice that progresses with you",
  ])}${cta()}`,
);

const studio = page(
  {
    title: "Studham Pilates Studio | NJH",
    description:
      "A tranquil private Sports Therapy and Pilates studio in Studham, near Whipsnade.",
    eyebrow: "Studham studio",
    title: "The Studham studio",
    intro:
      "A light, calm and private studio in Studham, near Whipsnade, created for attentive treatment and purposeful movement.",
    parent: crumbs.pilates,
  },
  `${section(
    "The studio",
    "A calm setting for personal care.",
    `<p>The NJH studio opened in 2016 as a dedicated place to step away from daily demands and focus on your movement and wellbeing.</p>
     <p>It hosts Sports Therapy appointments, individual Pilates and small-group Pilates. The setting is private and relaxed, with the space and equipment needed to tailor each session.</p>
     <div class="inline-contact"><span>Discuss your needs</span><a href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a></div>`,
  )}
  ${cards([
    { title: "Sports Therapy", text: "Assessment-led, hands-on care and practical rehabilitation.", href: "/what-is-what-are-the-benifits", icon: "hands" },
    { title: "Individual Pilates", text: "Focused sessions adapted to you and your goals.", href: "/pilates#individual", icon: "control" },
    { title: "Small groups", text: "Close guidance in a welcoming small-class setting.", href: "/pilates#small-group", icon: "movement" },
  ], "editorial-cards--contained")}${cta("Find your place to begin.")}`,
);

const timetable = page(
  {
    title: "Small Group Pilates Timetable | NJH",
    description:
      "Current NJH small-group Pilates timetable and joining information.",
    eyebrow: "Small-group Pilates",
    title: "Small group Pilates, kept personal",
    intro:
      "Small classes give you the energy of practising with others without losing the individual attention that good movement needs.",
    parent: crumbs.pilates,
  },
  `<section class="timetable-section"><div class="section-shell timetable-grid">
    <header data-reveal><h2>Weekly timetable</h2><p>Session length is 55 minutes unless noted. Please enquire to confirm current availability before attending.</p></header>
    <div class="timetable" data-reveal>
      <div><strong>Monday</strong><span>6:30pm</span></div>
      <div><strong>Tuesday</strong><span>8:30am <small>45 minutes</small></span><span>9:20am</span><span>11:30am</span></div>
      <div><strong>Friday</strong><span>7:30am</span><span>9:30am</span></div>
    </div>
  </div></section>
  ${section(
    "Before joining",
    "Start with a one-to-one assessment.",
    `<p>An initial individual assessment, including postural analysis, is required before joining a small-group class. This gives Natasha the context to guide and adapt your exercises safely and effectively.</p>
     <p>Classes are deliberately small so posture, control and movement can be observed and corrected where needed.</p>
     <a class="text-link" href="/prices">View current prices <span>→</span></a>`,
    "editorial-section--tint",
  )}${cta("Ask about class availability.")}`,
);

const individual = page(
  {
    title: "Individual Pilates | NJH",
    description:
      "Private one-to-one and duet Pilates sessions tailored to your needs.",
    eyebrow: "Individual Pilates",
    title: "Individual Pilates sessions",
    intro:
      "One-to-one Pilates—or a duet session with a friend—shaped around your posture, health, confidence and objectives.",
    parent: crumbs.pilates,
  },
  `${section(
    "Private sessions",
    "More attention. Clearer progression.",
    `<p>Individual sessions create time to understand how you move and to choose exercises that meet you where you are. The format can support general strength and posture or work alongside specific issues such as osteoporosis, frozen shoulder, and neck, knee or lower-back concerns.</p>
     <p>Each session focuses on restoring muscular balance and building movement you can use confidently beyond the studio. Private one-hour sessions are available Monday to Friday.</p>`,
  )}
  ${band("What your session can include", "Tailored to your goals", [
    "Postural and movement observation",
    "Mat and equipment-based Pilates",
    "Exercises adapted to your needs",
    "A clear plan for development and progression",
  ])}${cta("Discuss an individual session.")}`,
);

const golfers = page(
  {
    title: "Pilates for Golfers | NJH",
    description:
      "Pilates for golfers to support balance, rotation, flexibility and control.",
    eyebrow: "Pilates for golfers",
    title: "Pilates for golfers",
    intro:
      "Golf asks the legs, hips, spine, shoulders and arms to coordinate under load. Pilates can develop the control behind that movement.",
    parent: crumbs.pilates,
  },
  `${section(
    "Movement for golf",
    "The swing starts at the centre.",
    `<p>Like many shots in golf, Pilates movement is organised from the centre of the body. Better trunk control can support hip rotation, shoulder mobility and back stability.</p>
     <p>Sessions focus on movement quality rather than forcing range. They can be taken individually, in a small group, or with your own group of friends.</p>`,
  )}
  ${cards([
    { title: "Balance", text: "Develop control through stance and weight transfer.", icon: "control" },
    { title: "Rotation", text: "Explore useful movement through the hips, spine and shoulders.", icon: "movement" },
    { title: "Resilience", text: "Build strength and awareness to support regular play.", icon: "assess" },
  ], "editorial-cards--contained")}${cta("Talk about Pilates for your game.")}`,
);

const natal = page(
  {
    title: "Pre & Postnatal Pilates | NJH",
    description:
      "Individual and small-group Pilates during pregnancy and after birth.",
    eyebrow: "Pre & postnatal Pilates",
    title: "Pre- and postnatal Pilates",
    intro:
      "Considered, adaptable Pilates during pregnancy and after birth, offered individually or with your own small group.",
    parent: crumbs.pilates,
  },
  `<section class="split-feature"><div class="section-shell split-feature__grid">
    <article data-reveal><span>01</span><h2>During pregnancy</h2>${list([
      "Maintain comfortable, appropriate activity",
      "Support posture as your body changes",
      "Develop pelvic-floor awareness",
      "Release unwanted tension",
    ])}</article>
    <article data-reveal><span>02</span><h2>After birth</h2><p>Sessions can begin after your six-week GP check, or typically 8–12 weeks following a caesarean birth, subject to individual medical advice.</p>${list([
      "Reconnect with abdominal strength",
      "Rebuild movement confidence gradually",
      "Adapt around concerns such as diastasis recti",
      "Progress at a pace that feels right for you",
    ])}</article>
  </div></section>
  ${section(
    "Session options",
    "Individual or your own small group.",
    `<p>Practise one-to-one or with your own group of antenatal or postnatal friends. Groups are capped at seven so everyone can receive close attention and correction where needed.</p>
     <p>Always discuss new or changing symptoms with your GP, midwife or relevant healthcare professional before exercise.</p>`,
    "editorial-section--tint",
  )}${cta("Discuss what feels right for you.")}`,
);

const policies = page(
  {
    title: "Clinic Policies | NJH",
    description:
      "NJH appointment, cancellation and small-group Pilates policies.",
    eyebrow: "Clinic policies",
    title: "What to expect",
    intro:
      "Practical information to help appointments and classes run smoothly for everyone.",
    parent: crumbs.pilates,
  },
  `<section class="policy-section"><div class="section-shell policy-list">
    <article data-reveal><span>01</span><div><h2>Clients under 16</h2><p>A parent or guardian must accompany clients under 16 and will be asked to sign a parental consent form.</p></div></article>
    <article data-reveal><span>02</span><div><h2>Changes and cancellations</h2><p>Missed Sports Therapy, one-to-one or duet Pilates appointments are chargeable unless at least 24 hours' notice is provided. A 50% charge applies where less than 48 hours' notice is given.</p></div></article>
    <article data-reveal><span>03</span><div><h2>Arriving late</h2><p>Your appointment still finishes at its scheduled time. If the practitioner misses a scheduled individual appointment, you will receive a replacement session at no charge.</p></div></article>
    <article data-reveal><span>04</span><div><h2>Small-group blocks</h2><p>Small-group Pilates is paid in termly blocks. Once payment is received, your place is reserved for the block and fees are non-refundable.</p></div></article>
  </div></section>${cta("Have a question about a policy?")}`,
);

const therapyHub = page(
  {
    title: "Sports Therapy | NJH",
    description:
      "Assessment-led Sports Therapy for musculoskeletal pain, movement and recovery.",
    eyebrow: "Sports Therapy",
    title: "Sports Therapy at NJH",
    intro:
      "Personal assessment, hands-on soft-tissue techniques and practical rehabilitation for musculoskeletal pain, restriction and recovery.",
  },
  `${section(
    "What is Sports Therapy?",
    "Care built around the whole picture.",
    `<p>Sports Therapy is not only for athletes. It can help people of different ages and activity levels understand and manage musculoskeletal pain, tension and movement restriction.</p>
     <p>Your care starts with listening and assessment. Hands-on techniques may be used where appropriate, alongside movement and exercises that help you build confidence beyond the treatment room.</p>`,
  )}
  <section class="card-section"><div class="section-shell">${cards([
    { title: "Assess", text: "Understand your history, symptoms, posture and movement.", icon: "assess" },
    { title: "Treat", text: "Use appropriate hands-on techniques to address sensitive or restricted tissue.", icon: "hands" },
    { title: "Rebuild", text: "Develop useful strength, mobility and confidence through a clear plan.", icon: "movement" },
  ])}</div></section>
  ${band("How treatment may help", "Potential benefits", [
    "Reduce muscular tension and support pain management",
    "Improve flexibility and comfortable range of movement",
    "Support rehabilitation after injury or surgery",
    "Improve postural awareness and movement confidence",
    "Support training, recovery and return to activity",
  ])}
  <section class="pathway-section"><div class="section-shell">
    <header class="section-intro" data-reveal><h2>Know what to expect</h2></header>
    ${cards([
      { title: "Treatment techniques", text: "See the approaches that may be combined in your session.", href: "/treatment" },
      { title: "Your first appointment", text: "Understand assessment, clothing and treatment planning.", href: "/what-to-expect" },
      { title: "Myofascial release", text: "Learn about slower, sustained work with fascial tissue.", href: "/myofascial-release" },
      { title: "Kinesiology taping", text: "Explore taping for symptom, swelling and postural support.", href: "/kinesiology-taping" },
    ])}
  </div></section>${cta()}`,
);

const treatment = page(
  {
    title: "Sports Therapy Treatment | NJH",
    description:
      "Sports Therapy techniques and common musculoskeletal concerns treated at NJH.",
    eyebrow: "Treatment",
    title: "Treatment techniques",
    intro:
      "Treatment can combine hands-on soft-tissue work, joint mobilisation and carefully chosen exercises according to your assessment.",
    parent: crumbs.therapy,
  },
  `<section class="dual-list-section"><div class="section-shell dual-list">
    <article data-reveal><h2>Techniques</h2>${list([
      "Deep-tissue massage",
      "Muscle energy techniques (MET)",
      "Soft-tissue release (STR)",
      "Deep friction techniques",
      "Neuromuscular techniques (NMT)",
      "Myofascial and connective-tissue work",
      "Positional release",
      "Manual mobilisation for joints and soft tissue",
    ])}</article>
    <article data-reveal><h2>Common concerns</h2>${list([
      "Recurring postural pain",
      "Lower-back and sciatic-type symptoms",
      "Upper-back, neck and whiplash concerns",
      "Hip, groin, knee, ankle and upper-limb problems",
      "Muscular strains and ligament sprains",
      "Tendon pain and joint stiffness",
      "Soft-tissue rehabilitation",
      "Scar restriction before or after surgery",
    ])}</article>
  </div></section>
  ${section(
    "Beyond the appointment",
    "Treatment continues through movement.",
    `<p>Hands-on work is often paired with exercises to stretch, strengthen or improve control. Your home plan is kept practical so it can support the effects of treatment and fit into daily life.</p><p>NJH welcomes professional referrals from GPs, consultants, physiotherapists, osteopaths and podiatrists.</p>`,
    "editorial-section--tint",
  )}${cta()}`,
);

const fascia = page(
  {
    title: "Myofascial Release | NJH",
    description:
      "Learn what fascia is, how myofascial release feels and when it may be useful.",
    eyebrow: "Myofascial release",
    title: "Myofascial release",
    intro:
      "A slow, hands-on approach intended to reduce restriction and help soft tissue move more comfortably.",
    parent: crumbs.therapy,
  },
  `${section(
    "Understanding fascia",
    "A continuous support network.",
    `<p>Fascia is strong, flexible connective tissue that surrounds muscles and other structures throughout the body. In a healthy state it moves and adapts, contributing to posture, mobility and the transfer of load.</p>
     <p>After injury, inflammation, surgery or long-held posture, areas can feel less pliable or restricted. Because fascia is continuous, tension in one area may influence how another area feels or moves.</p>`,
  )}
  ${section(
    "The treatment",
    "Slow pressure. Useful feedback.",
    `<p>Myofascial release uses sustained touch or pressure to work with restricted tissue. Pressure can range from very gentle to deeper, but should remain within your tolerance. You may feel warmth or a gradual stretch.</p>
     <p>Your feedback is important throughout. Treatment may include areas beyond the site of symptoms when assessment suggests they could be contributing to the overall pattern.</p>`,
    "editorial-section--tint",
  )}
  ${band("It may be considered for", "Common applications", [
    "Lower-back pain and postural discomfort",
    "Neck stiffness, headaches and shoulder restriction",
    "Sports injuries and recurring muscular tension",
    "Scar tissue and restricted movement",
    "Supporting easier breathing where muscular tension contributes",
  ])}${cta()}`,
);

const expect = page(
  {
    title: "What to Expect | NJH",
    description:
      "What happens at your first NJH Sports Therapy appointment and what to wear.",
    eyebrow: "Your appointment",
    title: "Your first appointment",
    intro:
      "Your first appointment creates time to understand the history, assess the area and agree what progress should look like for you.",
    parent: crumbs.therapy,
  },
  `<section class="process-section"><div class="section-shell process-list">
    <article data-reveal><span>01</span><div><h2>Listen</h2><p>Discuss your medical history, current symptoms, activity and goals.</p></div></article>
    <article data-reveal><span>02</span><div><h2>Assess</h2><p>Look at the area, relevant joints, posture and movement to understand the wider picture.</p></div></article>
    <article data-reveal><span>03</span><div><h2>Plan</h2><p>Agree an individual treatment approach, which may include hands-on care and home exercises.</p></div></article>
  </div></section>
  ${section(
    "What to wear",
    "Comfortable and practical.",
    `<p>Wear loose, comfortable clothing and bring shorts if possible. Depending on the area being assessed, you may be asked to remove some clothing, but treatment can be carried out through clothing if you prefer.</p>
     <p>Feedback at each appointment helps review progress and adjust your plan. You remain in control and can ask questions or pause treatment at any time.</p>`,
    "editorial-section--tint",
  )}${cta("Book your first conversation.")}`,
);

const taping = page(
  {
    title: "Kinesiology Taping | NJH",
    description:
      "Kinesiology taping for symptom, swelling, posture and movement support.",
    eyebrow: "Kinesiology taping",
    title: "Kinesiology taping",
    intro:
      "Taping may be used alongside treatment—or as a short standalone appointment—to support comfort, awareness and movement.",
    parent: crumbs.therapy,
  },
  `<section class="card-section"><div class="section-shell">${cards([
    { title: "Symptom support", text: "Applied to support a painful muscle or joint without rigid restriction.", icon: "hands" },
    { title: "Swelling support", text: "Specific applications may help manage acute or persistent swelling.", icon: "movement" },
    { title: "Postural awareness", text: "A tactile cue for shoulder, thoracic, pelvic or lower-limb positioning.", icon: "assess" },
    { title: "Movement support", text: "Applied to complement flexibility, balance and confident movement.", icon: "control" },
  ])}</div></section>
  ${section(
    "At your appointment",
    "Part of treatment or a focused visit.",
    `<p>Taping can be included within a Sports Therapy appointment or booked as a standalone session of approximately 15–20 minutes.</p><p>Your skin and suitability will be checked before application, and you will be given guidance on wear time and removal.</p>`,
    "editorial-section--tint",
  )}${cta("Ask whether taping may suit you.")}`,
);

const about = page(
  {
    title: "About Natasha Hadland | NJH",
    description:
      "Meet Natasha Hadland, Sports Therapist and certified STOTT Pilates instructor.",
    eyebrow: "About NJH",
    title: "The person behind NJH.",
    intro:
      "Natasha Hadland brings Sports Therapy and clinical Pilates together to help people understand their bodies and move with greater confidence.",
    media: {
      src: "/images/about-book-animated.svg",
      alt: "Line drawing of an open anatomy book",
    },
  },
  `${section(
    "Natasha Hadland",
    "A career shaped by curiosity about movement.",
    `<p>After a ten-year career in fashion and time focused on her young family, Natasha pursued a longstanding interest in sport, anatomy and physiology.</p>
     <p>Training at the London School of Sports Massage led to a new career in Sports Therapy. A growing interest in rehabilitation and postural issues then led to certification as a STOTT Pilates instructor.</p>
     <p>Today, Natasha combines advanced soft-tissue techniques with precise Pilates exercise to provide professional, personal care for injuries, postural concerns and long-term movement goals.</p>`,
  )}
  <section class="qualification-section"><div class="section-shell">
    <header class="section-intro" data-reveal><h2>Qualifications &amp; training</h2></header>
    <ol class="credential-list">
      <li data-reveal><h3>LSSM Diploma in Sport & Remedial Massage</h3></li>
      <li data-reveal><h3>BTEC Level 5 Professional Diploma in Clinical Sport & Remedial Massage</h3></li>
      <li data-reveal><h3>VTCT Level 3 Diploma in Anatomy, Physiology and Pathology</h3></li>
      <li data-reveal><h3>Certified STOTT Pilates Instructor, Level 3</h3></li>
    </ol>
  </div></section>
  ${band("The NJH approach", "What guides every session", [
    "Listen before deciding",
    "Assess the whole movement, not only the sore spot",
    "Explain the plan in clear language",
    "Adapt treatment as your body and confidence change",
  ])}${cta("Start a conversation with Natasha.")}`,
);

/* Client stories have one home. They used to run as a five-quote band on the
   homepage and again in full inside Clinics, which meant two places to keep in
   step and a set of reviews buried under a page about locations.

   The staggered single-column thread they arrived as is now a wall: a column
   per category, the outer two drifting down and the middle one up, all three
   stopping the moment you reach for one. The hero is compact for the same
   reason the wall exists — the quotes are the page, so they open in view.

   Client stories are now two pages rather than one: the films on
   /client-stories and this wall on /client-stories/reviews. They were stacked
   at first, the shelf sitting on top of the wall, and the reason they are not
   is that a page has one job. Somebody who came to watch a film had a screen
   and a half of quotes underneath it they had not asked for; somebody who came
   to read had to get past four videos to reach the reading. Two pages, and the
   switch below hands you the other one.

   Both heads are compact, and for the same reason in each case: the thing the
   page is for — the films, the quotes — should be in view when it opens rather
   than a screen down from a title. */

/* The switch between the sides, on every one of them. Links to real URLs rather
   than buttons over hidden panels: each side is a page that can be sent to
   somebody, opened in a new tab, found by a search engine and read with no JS
   at all. A tab strip made of buttons is none of those things.

   `current` names the side being shown. aria-current marks it, and the CSS
   reads the same attribute, so there is one source of truth for which way the
   switch is thrown rather than a class that can disagree with it.

   The sides are assembled from what actually exists rather than written out:
   the wall of quotes is always there, and the films and the journeys each
   appear only if their list has anything in it. Two consequences worth having.
   A switch left with one side renders nothing at all — one side is not a
   switch, it is a label — so emptying FILMS or JOURNEYS quietly removes a tab
   rather than leaving a link to a page with nothing on it. And adding a fourth
   side later is a line in this array, not an edit to three pages.

   `bare` drops the section-shell, for the one place this is dropped inside
   another shell — the films head — where a second one would gutter the gutter. */
function storiesSwitch(current, { bare = false } = {}) {
  const sides = [
    hasFilms() && ["/client-stories", "Films", "films"],
    ["/client-stories/reviews", "Written reviews", "reviews"],
    hasJourneys() && ["/client-stories/journeys", "Journeys", "journeys"],
  ].filter(Boolean);
  if (sides.length < 2) return "";
  return `<nav class="stories-switch" aria-label="Client stories">
    <div class="${bare ? "" : "section-shell "}stories-switch__inner">
      ${sides
        .map(
          ([href, label, name]) =>
            `<a href="${href}"${current === name ? ' aria-current="page"' : ""}>${label}</a>`,
        )
        .join("\n      ")}
    </div>
  </nav>`;
}

/* The films head: a short line, the film, then the switch.

   The title is three words rather than a sentence. A full display line saying
   what the film below it is about is a description of a video sitting on top
   of the video — and at --step-3h over two lines it pushed the film most of a
   screen down to make room for itself. Short, it names the page and gets out
   of the way, and the film is still the thing you see first.

   The switch sits UNDER the film rather than over it. Above, it was a control
   standing between the head and the thing the page is for; below, the film
   opens the page and the offer of the other side arrives once you have seen
   what is on this one.

   Assembled here rather than through hero(): that helper builds a head around
   a title, and this one is built around a video. /about and /faq own their
   heads for the same reason. */
function filmsHero() {
  return `<section class="page-hero page-hero--light page-hero--compact page-hero--wave films-hero">
    <div class="page-hero__wave" aria-hidden="true"></div>
    <div class="section-shell page-hero__inner">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Client Stories</span></nav>
      <h1>${FILMS_TITLE}</h1>
      ${filmLead()}
      ${storiesSwitch("films", { bare: true })}
    </div>
  </section>`;
}

/* Not through page(), because that prepends hero() — and this page's head is
   filmsHero() above. Everything else in the object is what page() would have
   spread out of the config anyway: renderRoute reads canonical, description,
   metaTitle and tone off the route. */
const clientFilms = {
  metaTitle: "Client Stories | NJH",
  description:
    "Short films from NJH Sports Therapy and Pilates clients on what brought them in.",
  canonical: "/client-stories",
  eyebrow: "Client Stories",
  tone: "light",
  html: `${filmsHero()}
  ${filmsMore()}
  ${cta(
    "Would you like to be next?",
    "Tell Natasha what you would like help with and she will guide you towards the right place to start.",
  )}`,
};

const clientReviews = page(
  {
    metaTitle: "Client Reviews | NJH",
    description:
      "Reviews from NJH Sports Therapy and Pilates clients, by service.",
    canonical: "/client-stories/reviews",
    eyebrow: "Client Stories",
    compact: true,
    /* The full stop under the title, before the wall starts. /prices shares
       this head and does not take it: that page runs straight into a list of
       dot leaders, where another horizontal rule is one rule too many. */
    ornament: true,
    /* The line-wave behind the title. See .page-hero__wave. */
    wave: true,
    title: "In clients&rsquo; own words.",
  },
  `${storiesSwitch("reviews")}
  <section class="voices" aria-label="Client reviews">
    <div class="section-shell">
      <div class="voices__columns">
      ${voicesColumns()}
      </div>
    </div>
  </section>
  ${cta(
    "Would you like to be next?",
    "Tell Natasha what you would like help with and she will guide you towards the right place to start.",
  )}`,
);

/* The third side. Same compact head as the wall next door and for the same
   reason: the thing the page is for should be in view when it opens rather
   than a screen down from a title.

   The title says what the three beats on every card do, so the cards need no
   heading of their own — see journeysList(). "Journeys" on the switch and a
   sentence here: the tab has room for one word, the page has room to say what
   the word means. */
const clientJourneys = page(
  {
    metaTitle: "Client Journeys | NJH",
    description:
      "How NJH Pilates clients started, what has changed, and what they get out of their sessions.",
    canonical: "/client-stories/journeys",
    eyebrow: "Client Stories",
    compact: true,
    ornament: true,
    wave: true,
    title: "From first session to now.",
  },
  `${storiesSwitch("journeys")}
  ${journeysList()}
  ${cta(
    "Would you like to be next?",
    "Tell Natasha what you would like help with and she will guide you towards the right place to start.",
  )}`,
);

const prices = page(
  {
    title: "Prices | NJH",
    description:
      "Current NJH Sports Therapy and Pilates appointment prices.",
    eyebrow: "Prices",
    title: "Prices",
    intro:
      "Appointment length is chosen around your needs. New or complex presentations may benefit from more assessment time.",
    /* Same reasoning as /client-stories: the fees are the page. At the full
       hero height the first figure sat below the fold. */
    compact: true,
    /* The line-wave, in the other cut of it. /client-stories keeps the first. */
    wave: "crest",
  },
  /* Two columns carried by dot leaders from appointment to fee. Every string
     below is the one that was already here — the appointment lengths are
     reordered cheapest first, and nothing is added or dropped. */
  `<section class="prices-page"><div class="section-shell prices-grid">
    <div class="prices-group" data-reveal>
      <h2 class="prices-group__title">Sports Therapy</h2>
      <p class="prices-row"><span class="prices-row__label">Up to 30 minutes</span><span class="prices-row__lead"></span><span class="prices-row__fee">£60</span></p>
      <p class="prices-row"><span class="prices-row__label">Standard session, up to 1 hour</span><span class="prices-row__lead"></span><span class="prices-row__fee">£85</span></p>
      <p class="prices-row"><span class="prices-row__label">Up to 90 minutes</span><span class="prices-row__lead"></span><span class="prices-row__fee">£130</span></p>
      <p class="prices-note">Sunday and Bank Holiday appointments carry a £10 surcharge.</p>
      <a class="text-link" href="/sports-therapy">What treatment involves <span>→</span></a>
    </div>
    <div class="prices-group" data-reveal>
      <h2 class="prices-group__title">Pilates</h2>
      <p class="prices-row"><span class="prices-row__label">Small-group session</span><span class="prices-row__lead"></span><span class="prices-row__fee">£22</span></p>
      <p class="prices-row"><span class="prices-row__label">One-to-one, 1 hour</span><span class="prices-row__lead"></span><span class="prices-row__fee">£85</span></p>
      <p class="prices-row"><span class="prices-row__label">Initial assessment before small group</span><span class="prices-row__lead"></span><span class="prices-row__fee">£85</span></p>
      <p class="prices-row"><span class="prices-row__label">Duet, shared with a friend or partner</span><span class="prices-row__lead"></span><span class="prices-row__fee">£95</span></p>
      <p class="prices-note">Small-group classes are paid in termly blocks and are non-refundable once your place is reserved.</p>
      <a class="text-link" href="/pilates">How Pilates sessions run <span>→</span></a>
    </div>
  </div></section>
  ${section(
    "Appointment duration",
    "Enough time for the work required.",
    `<p>Most appointments last approximately one hour. A 30-minute session may be recommended where appropriate, while a new or more complex presentation may benefit from up to 90 minutes.</p><p>The recommended duration will be discussed before booking. Treatment may occasionally finish earlier to avoid over-treatment.</p>`,
    "editorial-section--tint editorial-section--middle",
  )}${cta("Discuss the right appointment length.")}`,
);

/* Pull a photograph off a legacy page by index. Nothing designed calls this any
   more — the last two callers were the pre- and postnatal cards, which are now
   story chapters carrying their own <img> — but the archived retreats block in
   archive/retreats.js depends on it, so it stays for whoever restores that.

   `attrs` is a raw attribute string, for the callers that need to mark the
   image itself rather than the figure around it — scroll drift moves the
   picture inside its frame, so the attribute has to land on the <img>. Written
   in by the call site, never by anything a visitor can reach. */
function legacyImage(path, index, className = "", attrs = "") {
  const image = legacyPages[path]?.images?.[index];
  if (!image) return "";
  return `<img class="${className}" ${attrs} src="${image.src}" alt="${escapeContent(image.alt)}" loading="${path === "/pilates" && index === 1 ? "eager" : "lazy"}">`;
}

function buildPilatesContinuousPage() {
  return {
    title: "NJH Pilates",
    description:
      "Individual and small-group Pilates in Studham, including pre and postnatal Pilates and Pilates for golfers.",
    canonical: "/pilates",
    html: `<div class="pilates-longform">
      <section class="pilates-hero" id="overview" aria-labelledby="pilates-title">
        <div class="section-shell pilates-hero__grid">
          <div class="pilates-hero__content">
            <h1 id="pilates-title">Pilates in Studham, shaped around you.</h1>
            <p class="pilates-hero__intro">Pilates uses slow, precise, controlled exercises to strengthen deep postural muscles, in turn stabilising and supporting the body.</p>
            <a class="pilates-arrow-link" href="#approach">Discover the approach <span>↓</span></a>
          </div>
          <figure class="pilates-hero__media pilates-hero__media--figure"><object class="pilates-hero__figure" type="image/svg+xml" data="/images/pilates-teaser-animated.svg" aria-label="Line drawing of a client holding the Pilates teaser position within measured rings" tabindex="-1"></object></figure>
        </div>
      </section>

      <section class="pilates-approach" id="approach" aria-labelledby="approach-title">
        <div class="section-shell">
          <header class="pilates-approach__head" data-reveal>
            <h2 id="approach-title">&ldquo;In 10 sessions you will feel the difference. In 20, you will see the difference. And in 30, you&rsquo;ll be on your way to having a whole new body.&rdquo;</h2>
            <p class="pilates-approach__cite">Joseph Hubertus Pilates</p>
            <p class="pilates-approach__intro">The benefits of Pilates are understanding how to correct poor posture, improve strength and range of movement around the joint, and promote and maintain a healthy back.</p>
          </header>
          <!-- The rail draws itself left to right on the way in and retracts
               the same way on the way out — see drawn-sequence.js. Each step
               carries its own index so the delays are arithmetic rather than
               a stack of nth-child rules, and --steps-last lets the exit run
               back the other way. Adding or removing a step means changing
               these two numbers and nothing else.

               pathLength="1" on every shape in the icons normalises their
               lengths, so one stroke-dashoffset animation draws all of them
               at the same rate whatever their real geometry. -->
          <ol class="pilates-approach__steps" style="--steps-last: 3" data-drawn-sequence>
            <li class="pilates-approach__step" style="--step-index: 0">
              <span class="pilates-approach__num">01</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle pathLength="1" cx="12" cy="4.2" r="2.1"/><path pathLength="1" d="M12 6.5v7"/><path pathLength="1" d="M8.5 9.2h7"/><path pathLength="1" d="M12 13.5 9.2 21"/><path pathLength="1" d="M12 13.5 14.8 21"/></svg></span>
              <strong>Improve posture</strong>
            </li>
            <li class="pilates-approach__step" style="--step-index: 1">
              <span class="pilates-approach__num">02</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M12 3 5 5.8v4.7c0 4.3 3 6.7 7 8.2 4-1.5 7-3.9 7-8.2V5.8L12 3Z"/><path pathLength="1" d="M9.2 11.4 11.3 13.6 15 9.4"/></svg></span>
              <strong>Core strength &amp; stability</strong>
            </li>
            <li class="pilates-approach__step" style="--step-index: 2">
              <span class="pilates-approach__num">03</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M3 8.5c2.5-2.6 5.5-2.6 8 0s5.5 2.6 8 0"/><path pathLength="1" d="M3 14.5c2.5-2.6 5.5-2.6 8 0s5.5 2.6 8 0"/></svg></span>
              <strong>Release unwanted tension</strong>
            </li>
            <li class="pilates-approach__step" style="--step-index: 3">
              <span class="pilates-approach__num">04</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M4 10.5h16"/><path pathLength="1" d="M12 10.5V19"/><path pathLength="1" d="M8.5 19h7"/><path pathLength="1" d="M12 10.5 9 5h6l-3 5.5Z"/></svg></span>
              <strong>Restore balance to muscles around the joint</strong>
            </li>
          </ol>
        </div>
      </section>

      <!-- "The Studham studio" moved to /studio, which is now the one page
           about the room. -->

      <section class="pilates-feature pilates-feature--individual" id="individual" aria-labelledby="individual-title">
        <div class="section-shell pilates-feature__grid">
          <div class="pilates-orbit-figure" data-reveal>
            <div class="hero-orb hero-orb--inline">
              <img class="hero-orb__photo" src="/images/pilates-duet-orb.webp" srcset="/images/pilates-duet-orb-450.webp 450w, /images/pilates-duet-orb.webp 900w" sizes="(max-width: 960px) 78vw, 34vw" alt="Two clients working through a teaser with a ball in a duet session" width="900" height="900" loading="lazy">
              <svg class="hero-orb__rings" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <circle class="hero-orb__ring hero-orb__ring--faint" cx="50" cy="50" r="49.3" />
                <circle class="hero-orb__ring" cx="50" cy="50" r="45.6" />
                <circle class="hero-orb__ring hero-orb__ring--inner" cx="50" cy="50" r="40.4" />
                <g class="hero-orb__ticks">
                  <line x1="50" y1="0.7" x2="50" y2="5.6" />
                  <line x1="99.3" y1="50" x2="94.4" y2="50" />
                  <line x1="50" y1="99.3" x2="50" y2="94.4" />
                  <line x1="0.7" y1="50" x2="5.6" y2="50" />
                </g>
                <!-- Three nodes on the r=45.6 ring, 120° apart: top, then
                     clockwise to lower-right and lower-left. -->
                <circle class="hero-orb__node" cx="50" cy="4.4" r="1.5" />
                <circle class="hero-orb__node" cx="89.49" cy="72.8" r="1.5" />
                <circle class="hero-orb__node" cx="10.51" cy="72.8" r="1.5" />
              </svg>
            </div>
            <dl class="pilates-orbit-facts">
              <div class="pilates-orbit-fact pilates-orbit-fact--format"><dt>Format</dt><dd>One-to-one or duet</dd></div>
              <div class="pilates-orbit-fact pilates-orbit-fact--length"><dt>Length</dt><dd>One hour</dd></div>
              <div class="pilates-orbit-fact pilates-orbit-fact--available"><dt>Available</dt><dd>Monday to Friday</dd></div>
            </dl>
          </div>
          <div class="pilates-feature__content" data-reveal>
            ${eyebrow("Pilates")}<h2 id="individual-title" class="title-rule">Individual Pilates</h2>
            <p class="pilates-feature__lead">One-to-one Pilates—or a duet session with a friend—tailored to suit your needs and objectives.</p>
            <p>Your session focuses on restoring muscular balance, with specific exercises designed for your posture type or medical conditions such as osteoporosis, frozen shoulder, and neck, knee or lower-back issues.</p>
            <a class="pilates-arrow-link" href="#contact">Discuss your requirements <span>→</span></a>
          </div>
        </div>
      </section>

      <!-- Reformer and Stability Chair. Individual Pilates above says what a
           private session is; these two say what each machine is *for* — what
           it does for you and who it suits. Deliberately no description of the
           hardware here: /studio#reformer and /studio#stability-chair carry
           that, and the two pages should not read as one text printed twice.
           They alternate sides so the run from #individual to #small-group has
           a rhythm rather than three left-hand figures in a column.

           Every photograph here is Pexels stock, free for commercial use with
           no attribution required — placeholders for Studham. Swapping them is
           the six files under public/images/pilates and nothing else. -->
      <section class="pilates-feature pilates-feature--equipment" id="reformer" aria-labelledby="reformer-title">
        <div class="section-shell pilates-feature__grid">
          <div class="pilates-feature__content" data-reveal>
            ${eyebrow("Pilates")}<h2 id="reformer-title" class="title-rule">Reformer Pilates</h2>
            <p class="pilates-feature__lead">Spring-assisted work, adjusted to what your body will do today rather than what it ought to do.</p>
            <p>Because the springs carry part of the load, you can move through a full, controlled range before you have the strength to do it unaided — a forgiving way back into exercise after a lay-off, and a way to keep working around a joint that is stiff or sore.</p>
            <p>Most people come for posture and deep core control, for hips, shoulders and lower backs gone tight at a desk, and for the steadiness that comes with both. It works upwards too: once the control holds, the springs load it.</p>
            <dl class="pilates-facts">
              <div><dt>Good for</dt><dd>Posture and core control, joint mobility, returning to exercise</dd></div>
              <div><dt>Format</dt><dd>One-to-one</dd></div>
            </dl>
            <a class="pilates-arrow-link" href="#contact">Ask about a Reformer session <span>→</span></a>
          </div>
          <div class="pilates-feature__media" data-reveal data-drift>
            <figure class="pilates-feature__shot">
              <img data-drift-lag="0.07" src="/images/pilates/reformer-25596677.webp" srcset="/images/pilates/reformer-25596677-700.webp 700w, /images/pilates/reformer-25596677.webp 1400w" sizes="(max-width: 960px) 92vw, 52vw" alt="A client lying on the Reformer carriage, working through an exercise with the straps" width="1400" height="933" loading="lazy">
            </figure>
            <figure class="pilates-feature__shot pilates-feature__shot--inset" data-drift-lead="0.2">
              <img src="/images/pilates/reformer-detail-25596680.webp" alt="Closer view of the Reformer carriage, straps and springs during a session" width="640" height="640" loading="lazy">
            </figure>
          </div>
        </div>
      </section>

      <section class="pilates-feature pilates-feature--equipment" id="stability-chair" aria-labelledby="chair-title">
        <div class="section-shell pilates-feature__grid pilates-feature__grid--media-first">
          <div class="pilates-feature__content" data-reveal>
            ${eyebrow("Pilates")}<h2 id="chair-title" class="title-rule">Stability Chair</h2>
            <p class="pilates-feature__lead">Upright work that builds the strength and balance you actually use standing up.</p>
            <p>It works you in the positions ordinary days are made of — seated, standing, on one leg — so what you gain transfers straight to stairs, lifting and getting up off the floor. There is nothing to lean on, which is why it is so good for balance and for confidence on your feet.</p>
            <p>It is precise, too: a short range under controlled resistance builds strength around one joint at a time, which suits a knee, hip, ankle or shoulder that has been weak or guarded. It usually comes once mat and Reformer work have laid the groundwork.</p>
            <dl class="pilates-facts">
              <div><dt>Good for</dt><dd>Balance, strength around a single joint, everyday upright movement</dd></div>
              <div><dt>Format</dt><dd>One-to-one or 2:1</dd></div>
            </dl>
            <a class="pilates-arrow-link" href="#contact">Ask about a Chair session <span>→</span></a>
          </div>
          <div class="pilates-feature__media" data-reveal data-drift>
            <figure class="pilates-feature__shot">
              <img data-drift-lag="0.07" src="/images/pilates/stability-chair-5473893.webp" srcset="/images/pilates/stability-chair-5473893-700.webp 700w, /images/pilates/stability-chair-5473893.webp 1400w" sizes="(max-width: 960px) 92vw, 52vw" alt="A client holding a supported position along the top of the Stability Chair" width="1400" height="933" loading="lazy">
            </figure>
            <figure class="pilates-feature__shot pilates-feature__shot--inset" data-drift-lead="0.2">
              <img src="/images/pilates/stability-chair-standing-5473901.webp" alt="A client working the Stability Chair pedal from a standing position, hands on the seat" width="640" height="640" loading="lazy">
            </figure>
          </div>
        </div>
      </section>

      <section class="pilates-feature pilates-feature--group" id="small-group" aria-labelledby="group-title">
        <!-- Heading and standfirst now sit in a narrow left column behind an
             accent rule, with the timetable card beside them rather than
             underneath. Same words, same rows — the day names have picked up
             an initial in a ring, which is decoration drawn from the name. -->
        <div class="section-shell pilates-group__grid">
          <header class="pilates-section-heading pilates-group__intro" data-reveal>
            ${eyebrow("Pilates")}<h2 id="group-title" class="title-rule">Small group Pilates</h2>
            <p>Class sizes are small to ensure close attention to posture and movement during each exercise where necessary. Sessions focus on precise, controlled movement to improve your joint range of movement and help you feel stronger.</p>
            <p class="pilates-group__note">Sessions are 55 minutes unless noted. An initial one-to-one assessment including postural analysis is required before joining Small Group Pilates.</p>
          </header>
          <div class="pilates-timetable" data-reveal>
            <div class="pilates-detail-label"><span>Weekly timetable</span><small>Confirm availability before booking</small></div>
            <div class="pilates-timetable__table">
              <div class="pilates-timetable__row"><div class="pilates-timetable__day"><strong>Monday</strong></div><p><span>6.30pm</span></p></div>
              <div class="pilates-timetable__row"><div class="pilates-timetable__day"><strong>Tuesday</strong></div><p><span>8.30am <small>45 min</small></span><span>9.20am</span><span>11.30am</span></p></div>
              <div class="pilates-timetable__row"><div class="pilates-timetable__day"><strong>Friday</strong></div><p><span>7.30am</span><span>9.30am</span></p></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Prenatal and postnatal now run as the home page's story chapters do:
           a full-height pair each, copy pinned one side and the photograph the
           other, the second rising up and covering the first. Same markup and
           the same .story rules — main.js picks up every .story__chapter on the
           page, so the seam that follows the boundary works here untouched.
           The side-by-side card grid it replaces put two half-width thumbnails
           on one row; these are two chapters of one story, and read better told
           one after the other. -->
      <section class="story" id="pre-postnatal" aria-label="Pre- and postnatal Pilates">
        <article class="story__chapter" id="prenatal">
          <div class="story__copy">
            <div class="story__copy-inner" data-reveal>
              <p class="story__index" aria-hidden="true">01</p>
              <h2>Prenatal Pilates</h2>
              <p class="story__lede">
                Low-impact, closely watched movement through pregnancy, adapted
                each trimester as your body changes shape around you.
              </p>
              <ul class="story__list">
                <li><strong>Maintain</strong> Fitness held through pregnancy</li>
                <li><strong>Support</strong> Posture as your centre of gravity shifts</li>
                <li><strong>Strengthen</strong> Pelvic floor work, and tension released</li>
              </ul>
              <a class="text-link" href="/contact"
                >Ask about prenatal Pilates <span>&#8594;</span></a
              >
            </div>
          </div>
          <figure class="story__media">
            <img
              src="/images/natal/prenatal-7155356.webp"
              alt="A pregnant client holding a supported squat against an exercise ball"
              width="1200"
              height="1500"
              loading="lazy"
            />
          </figure>
        </article>

        <article class="story__chapter" id="postnatal">
          <div class="story__copy">
            <div class="story__copy-inner" data-reveal>
              <p class="story__index" aria-hidden="true">02</p>
              <h2>Postnatal Pilates</h2>
              <p class="story__lede">
                A careful return after birth, from the six-week GP check &mdash;
                or eight to twelve weeks following a Caesarean section.
              </p>
              <ul class="story__list">
                <li><strong>Restore</strong> Abdominal strength after birth</li>
                <li><strong>Strengthen</strong> The pelvic floor, from the ground up</li>
                <li><strong>Progress</strong> Conditions such as diastasis recti</li>
              </ul>
              <a class="text-link" href="/contact"
                >Ask about postnatal Pilates <span>&#8594;</span></a
              >
            </div>
          </div>
          <figure class="story__media">
            <img
              src="/images/natal/postnatal-3094222.webp"
              alt="A client on a mat after birth, holding her child above her on straight legs"
              width="1200"
              height="1500"
              loading="lazy"
            />
          </figure>
        </article>
      </section>

      <!-- The one thing that belongs to both chapters rather than either, so it
           sits under the pair. It is also what carries the last chapter up the
           page instead of climbing over it — see .story__chapter:last-child. -->
      <section class="natal-note" aria-label="Pre- and postnatal group sizes">
        <div class="section-shell">
          <p data-reveal>Available individually or for your own small group of NCT, prenatal or postnatal friends. Maximum 1:7 to ensure close attention and correction when necessary.</p>
        </div>
      </section>

      <!-- The two stock shots (anatomy diagram, swing sequence) are gone. The
           section now carries a single photograph behind the copy, with a navy
           wash that is near-solid on the left so the text stays legible and
           clears to the right so the picture reads. -->
      <section class="pilates-golf" id="golfers" aria-labelledby="golf-title" data-drift>
        <!-- The only single-layer group on the site. It works because the copy
             on top of it does not move: the backdrop drifts against the page
             itself, which is the other half of the pair everywhere else. The
             stylesheet overhangs it past the band under .is-adrift so there is
             somewhere to drift to. -->
        <div class="pilates-golf__backdrop" aria-hidden="true" data-drift-lag="0.07"></div>
        <div class="section-shell pilates-golf__grid">
          <div class="pilates-golf__content" data-reveal>
            ${eyebrow("Pilates")}<h2 id="golf-title" class="title-rule">Pilates for golfers</h2>
            <p>For a golfer, muscle imbalances can affect the legs, hips, arms, shoulders and lower back. Pilates is based on movement from the centre of the body, as are most shots in golf.</p>
            <p>Core strength can improve hip rotation, range of motion in the shoulders and back stability, leading to improved performance.</p>
            <ul class="pilates-golf__benefits"><li>Improve balance and flexibility</li><li>Strengthen your core to avoid injury</li><li>Work on overall breathing and focus</li></ul>
          </div>
        </div>
      </section>

      <!-- The "Practical details" section that used to sit here — a four-row
           accordion of clinic policies — has moved whole to the foot of /faq,
           unchanged, where somebody looking for the terms goes to find them.
           See practicalDetails() in faq/faq.js. /pilates now runs from the
           work straight into its closing card. -->

      <!-- Same closing shape as the foot of /sports-therapy: one bordered card
           on a tinted band, actions in a row. Copy is unchanged. -->
      <div class="st-section st-section--tint">
        <div class="section-shell">
          <section class="st-card" id="contact" aria-labelledby="pilates-contact-title" data-reveal>
            ${eyebrow("Pilates")}<h2 id="pilates-contact-title" class="title-rule">Find the right place to begin.</h2>
            <p>For further details or to discuss your specific requirements, contact Natasha Hadland.</p>
            <div class="st-card__actions">
              <a class="pilates-arrow-link" href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay} <span>↗</span></a>
              <a class="button-link button-link--ink" href="/contact">Send an enquiry <span>↗</span></a>
            </div>
          </section>
        </div>
      </div>
    </div>`,
  };
}

const pilatesContinuous = buildPilatesContinuousPage();

/* Was /clinics. There has only ever been one location, and the studio copy
   that used to sit halfway down /pilates now lives here, so the page is named
   for its subject rather than for a set of clinics that does not exist. */
function buildStudioContinuousPage() {
  return {
    title: "NJH Studio",
    description:
      "The NJH Sports Therapy and Pilates studio in Studham, near Whipsnade.",
    canonical: "/studio",
    html: `<div class="clinics-longform">
      <!-- The hero is footage of a room rather than a drawing of a treatment,
           because the room is what the page is about. The clip is stock, not
           Studham — swap public/videos/studio-tour.mp4 (and the still beside
           it, which is frame one of that same clip) the day there is footage
           of the real studio, and nothing else here has to change.

           The still is the real fallback: it is what shows before the clip
           buffers, when reduced motion is asked for, and if the file is
           missing — so the hero is never a black rectangle. It is taken from
           the clip's first frame so the hand-off is invisible; a photograph
           of a different room would cross-fade like a bug. -->
      <section class="clinics-hero" id="overview" aria-labelledby="clinics-title">
        <div class="clinics-hero__media" aria-hidden="true">
          <img class="clinics-hero__still" src="/images/studio-hero-still-1600.webp" alt="" width="1600" height="900" fetchpriority="high" />
          <video class="clinics-hero__reel" data-studio-reel muted loop playsinline preload="none" disablepictureinpicture tabindex="-1">
            <!-- media on <source> is read once, when the element picks a file,
                 and never re-evaluated on resize. That is the wrong behaviour
                 for a responsive image and exactly the right one here: the
                 narrow file exists so a phone on mobile data is not made to
                 fetch 2.9MB of background loop, and a phone does not become a
                 desktop mid-visit. -->
            <source src="/videos/studio-tour-900.mp4" type="video/mp4" media="(max-width: 700px)" />
            <source src="/videos/studio-tour.mp4" type="video/mp4" />
          </video>
          <div class="clinics-hero__scrim"></div>
        </div>
        <div class="clinics-hero__inner">
          <p class="clinics-hero__eyebrow"><i aria-hidden="true"></i>Studham studio</p>
          <h1 id="clinics-title">The NJH clinic in Studham.</h1>
          <div class="clinics-hero__footer">
            <p>Professional, personal Sports Therapy and Pilates care from one private studio in Studham, near Whipsnade.</p>
            <a class="pilates-arrow-link" href="${BUSINESS.phoneHref}">Appointments · ${BUSINESS.phoneDisplay} <span>↗</span></a>
          </div>
        </div>
      </section>

      <!-- The room, told the same way as the two machines below it: one wide
           plate of the space with a second photograph lapped over its corner,
           and the copy beside it rather than under a rule.

           It used to be a full-width heading, a column of prose, then a
           four-photograph carousel under a second heading — a different shape
           from anything else on the page, and the only interactive component
           on the site that asked the reader to press a button to see the room.
           Four photographs of one small studio was three more than the point
           needed, and three of them could only be reached by clicking. Two
           show it, and both are on screen at once.

           Media-first here so the run down the page alternates: the room's
           plate sits left, the Reformer's right, the Chair's left again. -->
      <section class="pilates-feature pilates-feature--equipment" id="studio" aria-labelledby="studio-title">
        <div class="section-shell pilates-feature__grid pilates-feature__grid--media-first">
          <div class="pilates-feature__content" data-reveal>
            <h2 id="studio-title">The Studham studio</h2>
            <p class="pilates-feature__lead">Sports Therapy, individual Pilates and small-group Pilates, all in one private studio.</p>
            <p>After working in physio clinics for many years, January 2016 saw the launch of the NJH Sports Therapy and Pilates Studio. This tranquil, light and airy space provides the perfect place to switch off and focus on you.</p>
            <p>Whether it is to receive Soft Tissue Release with a Sports Therapy appointment, Individual or Small Group Pilates sessions, this is a place to restore muscular wellbeing and improve posture.</p>
            <!-- The room was described as having "the space and equipment
                 needed" without ever saying what the equipment is. It is named
                 here, and the two sections below show it. Deliberately not
                 linked in the prose: the site has no inline link style, and
                 .text-link is a standalone component (inline-flex, 44px tall)
                 that breaks the leading of the column it lands in. The arrow
                 link under this column carries the reader instead. -->
            <p>Alongside the mat work, the studio is equipped with a Reformer, worked one-to-one, and a Stability Chair, which takes one-to-one or 2:1 sessions.</p>
            <!-- The directions line was the tail of the opening paragraph,
                 where the one fact a visitor actually needs sat behind three
                 clauses about what the studio offers. It is a fact, so it goes
                 where the facts go. -->
            <dl class="pilates-facts">
              <div><dt>Where</dt><dd>Studham, near Whipsnade</dd></div>
              <div><dt>Directions</dt><dd>Sent when your appointment is confirmed</dd></div>
            </dl>
            <a class="pilates-arrow-link" href="#reformer">See what is in the room <span>→</span></a>
          </div>
          <div class="pilates-feature__media" data-reveal data-drift>
            <figure class="pilates-feature__shot">
              <img data-drift-lag="0.07" src="/images/legacy/pilates-studio-4.jpg" alt="The studio looking towards the window, with the treatment couch, the mat space and the exercise balls all in one room" width="1600" height="1200" loading="lazy">
            </figure>
            <figure class="pilates-feature__shot pilates-feature__shot--inset" data-drift-lead="0.2">
              <img src="/images/legacy/pilates-studio-1.jpg" alt="The studio entrance, with the garden door, coat hooks and the balls and rollers stacked beyond" width="1600" height="1200" loading="lazy">
            </figure>
          </div>
        </div>
      </section>

      <!-- The two machines, after the room they stand in — same layout, so the
           page reads as three views of one place rather than a place and then
           a catalogue.

           /pilates already carries a Reformer and a Stability Chair section;
           these are not those. There the question is "what would this do for
           me" — benefits, who it suits, format and length. Here it is "what is
           this object" — how the thing is built, how it is worked, what
           adjusts, where it stands. Benefits belong to /pilates and are kept
           out of here on purpose; the arrow link carries anyone who has
           stopped reading about the room and started thinking about booking.

           Same classes as /pilates on purpose. .pilates-feature--equipment is
           the site's layout for a long, low machine — landscape plate, square
           inset lapped over one corner, alternating sides — and a second
           dialect of it here would only drift. The prefix is a misnomer at
           this point, as .clinics- is on this page; both are older names the
           rest of the stylesheet still answers to.

           Photographs are the same six Pexels files /pilates uses. Swapping
           them for Studham is public/images/pilates and nothing else. -->
      <section class="pilates-feature pilates-feature--equipment" id="reformer" aria-labelledby="studio-reformer-title">
        <div class="section-shell pilates-feature__grid">
          <div class="pilates-feature__content" data-reveal>
            <h2 id="studio-reformer-title">The Reformer</h2>
            <p class="pilates-feature__lead">A padded carriage running on rails inside a long timber frame, drawn back and forth against a bank of springs.</p>
            <p>You lie, sit, kneel or stand on it, moving the carriage against the footbar or the ropes and straps at the far end. The springs clip on and off underneath: how many are on decides how much of the movement the frame gives you and how much you carry yourself.</p>
            <p>Footbar, ropes, headrest and shoulder rests all reposition, and the springs change in seconds — which is what lets one machine hold a whole hour of different work. It stands at the studio's far end, under the windows, with the mat space kept clear beside it.</p>
            <dl class="pilates-facts">
              <div><dt>What it is</dt><dd>Sprung carriage on rails, with footbar, ropes and straps</dd></div>
              <div><dt>Adjusts</dt><dd>Spring tension, footbar, rope length, headrest</dd></div>
            </dl>
            <a class="pilates-arrow-link" href="/pilates#reformer">How a Reformer session runs <span>→</span></a>
          </div>
          <div class="pilates-feature__media" data-reveal data-drift>
            <figure class="pilates-feature__shot">
              <img data-drift-lag="0.07" src="/images/pilates/reformer-25596677.webp" srcset="/images/pilates/reformer-25596677-700.webp 700w, /images/pilates/reformer-25596677.webp 1400w" sizes="(max-width: 960px) 92vw, 52vw" alt="A client lying on the Reformer carriage, working through an exercise with the straps" width="1400" height="933" loading="lazy">
            </figure>
            <figure class="pilates-feature__shot pilates-feature__shot--inset" data-drift-lead="0.2">
              <img src="/images/pilates/reformer-detail-25596680.webp" alt="Closer view of the Reformer carriage, straps and springs during a session" width="640" height="640" loading="lazy">
            </figure>
          </div>
        </div>
      </section>

      <section class="pilates-feature pilates-feature--equipment" id="stability-chair" aria-labelledby="studio-chair-title">
        <div class="section-shell pilates-feature__grid pilates-feature__grid--media-first">
          <div class="pilates-feature__content" data-reveal>
            <h2 id="studio-chair-title">The Stability Chair</h2>
            <p class="pilates-feature__lead">A padded box, roughly the size of a low stool, with a sprung pedal hinged along one side.</p>
            <p>The pedal is the whole machine. Springs hook onto a bracket at different heights, setting how heavily it resists across a short arc, and you press it with a foot or a hand — sitting on the seat, standing beside it or lying across it.</p>
            <p>There is nothing else to it: no rails, no ropes, no rest position built into the frame. Whatever holds you up is your own position, which is why the plainest machine in the room is the demanding one.</p>
            <dl class="pilates-facts">
              <div><dt>What it is</dt><dd>Padded box seat with a hinged, spring-loaded pedal</dd></div>
              <div><dt>Adjusts</dt><dd>Spring position and number, which sets the pedal's resistance</dd></div>
            </dl>
            <a class="pilates-arrow-link" href="/pilates#stability-chair">How a Chair session runs <span>→</span></a>
          </div>
          <div class="pilates-feature__media" data-reveal data-drift>
            <figure class="pilates-feature__shot">
              <img data-drift-lag="0.07" src="/images/pilates/stability-chair-5473893.webp" srcset="/images/pilates/stability-chair-5473893-700.webp 700w, /images/pilates/stability-chair-5473893.webp 1400w" sizes="(max-width: 960px) 92vw, 52vw" alt="A client holding a supported position along the top of the Stability Chair" width="1400" height="933" loading="lazy">
            </figure>
            <figure class="pilates-feature__shot pilates-feature__shot--inset" data-drift-lead="0.2">
              <img src="/images/pilates/stability-chair-standing-5473901.webp" alt="A client working the Stability Chair pedal from a standing position, hands on the seat" width="640" height="640" loading="lazy">
            </figure>
          </div>
        </div>
      </section>

      <!-- The page used to stop dead on the last carousel photograph. With two
           more sections after it the drop is longer, so it closes the way
           /pilates and /sports-therapy close — the same st-card on tint. -->
      <div class="st-section st-section--tint">
        <div class="section-shell">
          <section class="st-card" id="visit" aria-labelledby="studio-contact-title" data-reveal>
            <h2 id="studio-contact-title">Come and see the room.</h2>
            <p>For directions, availability, or to talk through which of the two would suit you, contact Natasha Hadland.</p>
            <div class="st-card__actions">
              <a class="pilates-arrow-link" href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay} <span>↗</span></a>
              <a class="button-link button-link--ink" href="/contact">Send an enquiry <span>↗</span></a>
            </div>
          </section>
        </div>
      </div>

    </div>`,
  };
}

/* ============================================================
   Sports Therapy page — three arrangement variants (A/B/C)
   behind a review toggle. Same copy, colours, fonts and images
   throughout; only the arrangement differs.
   ============================================================ */

const THERAPY = {
  techniques: [
    "Deep tissue massage",
    "Muscle energy techniques (MET)",
    "Soft Tissue Release (STR)",
    "Deep friction techniques",
    "Neuro Muscular Technique (NMT)",
    "Connective tissue and myofascial work",
    "Positional Release (PR)",
    "Manual mobilisation for joints and soft tissue",
  ],
  injuries: [
    "Recurring postural pain",
    "Lower-back pain and sciatica",
    "Upper-back, neck, headache and whiplash concerns",
    "Thoracic tightness and acute or chronic pain",
    "Hip, groin, knee, ankle and upper-limb problems",
    "Soft-tissue rehabilitation and joint stiffness",
    "Muscular strains, ligament sprains and tendonitis",
    "Scar restriction before and after surgery",
  ],
  outcomes: [
    "Improve posture",
    "Reduce tension and pain",
    "Improve flexibility",
    "Improve joint range of movement",
    "Support recovery",
    "Release restriction of scar tissue",
  ],
  conditions: [
    "Frozen shoulder",
    "Repetitive strain injury",
    "Tension headaches",
    "Migraines and sinusitis",
    "Pregnancy-related issues",
    "Carpal tunnel syndrome",
  ],
  fascia: [
    "Lower-back pain and headaches",
    "Neck stiffness and shoulder injuries",
    "Sports injuries and postural pain",
    "Muscle spasms and recurring restriction",
    "Post-surgical scar tissue, including after breast cancer surgery",
    "Improved joint movement and breathing",
  ],
  steps: [
    ["Listen", "Take a brief medical history and understand your goals."],
    [
      "Assess",
      "Assess the injury or painful area, posture, joint and surrounding tissue.",
    ],
    [
      "Plan",
      "Discuss a treatment plan, which may include practical home exercises.",
    ],
  ],
  taping: [
    "Symptom reduction",
    "Oedema control",
    "Postural control",
    "Power taping",
  ],
};

/* Ruled rows — the divider-line list motif, now inside a card so the group
   still reads as a contained object rather than text loose on the page. */
/* The split variant flows down one CSS column and back up the next, and CSS
   cannot see where that break falls — so the item that starts the second
   column is tagged here. It is the only way to drop the rule above the top
   row of each column and leave the ones between rows alone. */
const rows = (items, modifier = "") => {
  const split = modifier.includes("st-rows--split");
  const colBreak = split ? Math.ceil(items.length / 2) : -1;
  return `<ul class="st-rows${modifier ? ` ${modifier}` : ""}">${items
    .map(
      (item, i) =>
        `<li${split && (i === 0 || i === colBreak) ? ' class="is-col-top"' : ""}>${item}</li>`,
    )
    .join("")}</ul>`;
};

/* A function declaration rather than a const arrow, and deliberately so: this
   is now called from buildPilatesContinuousPage(), which runs some 260 lines
   ABOVE this point. A const is in its temporal dead zone until the line that
   declares it executes, so that call threw "Cannot access 'eyebrow' before
   initialization" — and because it threw while this module was still being
   evaluated, nothing downstream of it existed either: every route on the site
   fell back to the home page markup. A declaration hoists, so it is callable
   from anywhere in the module regardless of where the two ends up sitting. */
function eyebrow(text) {
  return `<span class="st-eyebrow">${text}</span>`;
}

/* Hero and contact are shared by all three variants — the hero is signed
   off, so only its responsive type was touched (see .therapy-hero h1). */
const therapyHero = () => `<section class="therapy-hero" id="overview" aria-labelledby="therapy-title">
  <div class="section-shell therapy-hero__grid">
    <div class="therapy-hero__content"><h1 id="therapy-title">Find what’s driving the pain, then treat it and rebuild.</h1><p>Sports Therapy provides relief from musculoskeletal pain and dysfunction through the use of various massage and soft-tissue techniques.</p><a class="pilates-arrow-link" href="#treatment">Explore treatment <span>↓</span></a></div>
    <figure class="therapy-hero__media therapy-hero__media--figure"><object class="therapy-hero__figure" type="image/svg+xml" data="/images/njh-signature-motion-figure-animated.svg" aria-label="Animated line drawing of a figure within orbiting rings" tabindex="-1"></object></figure>
  </div>
</section>`;

/* The fascia diagram — the six things myofascial release helps with, set
   around a centre that states the idea holding them together. The list used to
   be a ruled card identical to the two above it, so the section's one genuinely
   different claim (fascia is one continuous material, so a restriction here
   shows up there) arrived looking like every other list on the page.

   Split three and three so the centre has a column either side. The numbers
   are the diagram's own ordering, not part of the sentences, so the chips are
   hidden from assistive tech and the <ol> carries the sequence instead — the
   right-hand list continues from 04 via start.

   Six is what the layout is drawn for: three rows a side, with the middle row
   pointing straight at the centre. A seventh item would need the split and the
   wire angles in .fascia-map__node revisited. */
const fasciaMapColumn = (items, side, start) =>
  `<ol class="fascia-map__nodes fascia-map__nodes--${side}"${start ? ` start="${start}"` : ""}>
          ${items
            .map(
              (item, index) =>
                `<li class="fascia-map__node" style="--row:${index}"><b aria-hidden="true">0${(start || 1) + index}</b><span>${item}</span></li>`,
            )
            .join("\n          ")}
        </ol>`;

/* The centre used to be three wavy lines drawn in periwinkle — a glyph doing
   the same job as the sentence under it, and doing it worse. It is a
   photograph now: two hands working a back, cropped square and filling the
   circle, with the claim set over it.

   The img comes before the claim in source order so the paragraph paints on
   top without either one needing a z-index it would then have to defend.

   Pexels stock (photo 37719642), free for commercial use, no attribution
   required — same licence as the taping band's six. */
/* No [data-reveal]: the map runs its own entrance off its own trigger, and the
   shared one fires too early for a sequence this long to be seen. main.js
   picks it up by class — see the .fascia-map block there. */
const fasciaMap = (items) =>
  `<figure class="fascia-map">
        ${fasciaMapColumn(items.slice(0, 3), "left")}
        <div class="fascia-map__core">
          <img class="fascia-map__shot" src="/images/fascia-37719642.webp" alt="" width="800" height="800" loading="lazy" decoding="async">
          <p class="fascia-map__claim">Fascia connects everything.</p>
        </div>
        ${fasciaMapColumn(items.slice(3), "right", 4)}
      </figure>`;

/* Photographs for the taping band — Pexels stock, free for commercial use with
   no attribution required, resized to 900px wide and 4:5 to match the frame.

   All six are one shoot: Maksim Goncharenok's kinesio-tape series, the same
   white seamless, the same practitioner in the same white coat, the same
   black/pink tape. That is the point of them. The band ran on six photographs
   from four different shoots before this — a warm domestic treatment room, a
   moody grey close-up, an orange gym floor — and drifting them past each other
   in two columns put the mismatch side by side, which is where it showed.
   Anything added here has to come from the same series, or the band goes back
   to looking like a search result.

   Ordered so neither column runs three wide shots together: each one steps
   close, wide, mid. Swapping any of them is these two lists and nothing else —
   the band clones whatever it is given, so the count can change too. */
const TAPING_SHOTS_LEFT = [
  "/images/taping/taping-6094040.webp",
  "/images/taping/taping-6094057.webp",
  "/images/taping/taping-6094056.webp",
];
const TAPING_SHOTS_RIGHT = [
  "/images/taping/taping-6094397.webp",
  "/images/taping/taping-6094334.webp",
  "/images/taping/taping-6094047.webp",
];

/* The band is decorative — the column beside it carries every word — so the
   photographs are hidden from assistive tech rather than captioned six times
   over, and the drift stops on hover or focus (see drift-columns.js). */
const tapingColumn = (shots, direction, speed) =>
  `<div class="taping-band__col taping-band__col--${direction}" data-drift-speed="${speed}" aria-hidden="true">
        <div class="taping-band__window">
          <div class="taping-band__track">
            ${shots
              .map(
                (src) =>
                  `<figure class="taping-band__shot"><img src="${src}" alt="" loading="lazy"></figure>`,
              )
              .join("\n            ")}
          </div>
        </div>
      </div>`;

/* ---------- Variant A — card grid ---------- */

function therapyVariantA() {
  const { techniques, injuries, outcomes, conditions, fascia, steps, taping } =
    THERAPY;
  return `
  <section class="st-section st-section--tint st-section--act" id="approach" aria-labelledby="therapy-benefits-title">
    <div class="section-shell">
      <header class="st-head title-rule" data-reveal><div class="st-head__title">${eyebrow("Sports therapy")}<h2 id="therapy-benefits-title">What sports therapy helps with</h2></div></header>
      <div class="st-grid st-grid--2 st-pair">
        <article class="st-card st-pair__panel">${eyebrow("Outcomes")}<h3>What improves</h3>${rows(outcomes)}</article>
        <article class="st-card st-card--navy st-pair__panel">${eyebrow("Conditions")}<h3>What it eases</h3>${rows(conditions, "st-rows--onDark")}</article>
      </div>
    </div>
  </section>

  <section class="st-section st-section--tint" id="what-to-expect" aria-labelledby="expect-title">
    <div class="section-shell">
      <div class="st-ruled" data-step-wave>
        <svg class="st-wave" aria-hidden="true" focusable="false" data-step-wave-draw></svg>
        <header class="st-head title-rule" data-reveal><div class="st-head__title">${eyebrow("Sports therapy")}<h2 id="expect-title">What to expect</h2></div></header>
        <div class="st-steps">
          ${steps
            .map(
              ([title, body], index) =>
                `<article class="st-step" data-reveal><b>0${index + 1}</b><i class="st-step__node" data-step-wave-node></i><h3>${title}</h3><p>${body}</p></article>`,
            )
            .join("")}
        </div>
      </div>
      <aside class="st-note st-note--rule" data-reveal>${eyebrow("What to wear")}<p>Wear loose, comfortable clothing or bring shorts where possible. Depending on the location of your injury, you may be asked to remove some clothing; treatment can be carried out through clothes if you prefer.</p></aside>
    </div>
  </section>

  <section class="st-section st-section--dark st-section--act" id="myofascial-release" aria-labelledby="fascia-title">
    <div class="section-shell">
      <header class="st-head title-rule" data-reveal><div class="st-head__title">${eyebrow("Sports therapy")}<h2 id="fascia-title">Myofascial release</h2></div></header>
      <div class="st-grid st-grid--2 st-grid--fascia">
        <div class="fascia-prose" data-reveal><p>Fascia is strong, flexible tissue surrounding muscles and bones. It spans the whole body as one connected material.</p><p>In a healthy state, fascia is relaxed and supports posture, range of movement and flexibility. Physical trauma, inflammation, surgery or habitual poor posture can make it tight and restricted.</p><p>Myofascial Release uses slow, sustained pressure to relax deep tissue, improve movement and reduce tension. Pressure can range from very gentle touch to deeper work and should never be beyond your tolerance.</p></div>
        ${fasciaMap(fascia)}
      </div>
    </div>
  </section>

  <section class="st-section" id="treatment" aria-labelledby="treatment-title">
    <div class="section-shell">
      <header class="st-head title-rule" data-reveal><div class="st-head__title">${eyebrow("Sports therapy")}<h2 id="treatment-title">Treatment techniques</h2></div></header>
      <div class="st-index">
        <section class="st-index__group" data-reveal aria-labelledby="treatment-delivery-title">
          <div class="st-index__label">${eyebrow("Hands-on techniques")}<h3 id="treatment-delivery-title">How treatment is delivered</h3></div>
          ${rows(techniques, "st-rows--split")}
        </section>
        <section class="st-index__group" data-reveal aria-labelledby="treatment-concerns-title">
          <div class="st-index__label">${eyebrow("Common concerns")}<h3 id="treatment-concerns-title">What people come in with</h3></div>
          ${rows(injuries, "st-rows--split")}
        </section>
      </div>
      <aside class="st-note st-note--rule" data-reveal><p>Professional referrals are welcomed from GPs, consultants, physiotherapists, osteopaths and podiatrists.</p></aside>
    </div>
  </section>

  <section class="st-section st-section--flush" id="kinesiology-taping" aria-labelledby="taping-title">
    <div class="taping-band">
      ${tapingColumn(TAPING_SHOTS_LEFT, "up", 16)}
      <div class="taping-band__content" data-reveal>
        ${eyebrow("Taping")}
        <h2 id="taping-title" class="title-rule">Kinesiology taping</h2>
        <p>Taping can aid pain relief, reduce swelling and support postural awareness. It can be included in an appointment or booked as a standalone 15–20 minute session.</p>
        ${rows(taping)}
      </div>
      ${tapingColumn(TAPING_SHOTS_RIGHT, "down", 14)}
    </div>
  </section>

  <div class="st-section st-section--tint st-section--act">
    <div class="section-shell">
      <section class="st-card" id="practical" aria-labelledby="therapy-practical-title" data-reveal>${eyebrow("Appointments")}<h2 id="therapy-practical-title" class="title-rule">Booking an appointment</h2><p>Appointment length is selected around the complexity of the presentation — 30 minutes where that is enough, up to 90 for a new or more involved case. The recommended duration is discussed before booking.</p><p class="st-footnote">Fees for every appointment length are listed on one page.</p><div class="st-card__actions"><a class="pilates-arrow-link" href="/prices">View prices <span>→</span></a><a class="button-link button-link--ink" href="/contact">Send an enquiry <span>↗</span></a></div></section>
    </div>
  </div>`;
}

function buildSportsTherapyContinuousPage() {
  return {
    title: "NJH Sports Therapy",
    description:
      "Sports Therapy, soft-tissue treatment, myofascial release and kinesiology taping with NJH.",
    canonical: "/sports-therapy",
    html: `<div class="therapy-longform">
      ${therapyHero()}
      ${therapyVariantA()}
    </div>`,
  };
}

const studioContinuous = buildStudioContinuousPage();
const sportsTherapyContinuous = buildSportsTherapyContinuousPage();
// Built once rather than inline in `routes`, so /charity-work can spread the
// same page object with a scroll target instead of rebuilding the markup.
const aboutContinuous = buildAboutPage();

function escapeContent(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatLegacyText(value) {
  return escapeContent(value)
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noreferrer">$1</a>',
    )
    .replace(
      /\b07881\s?821\s?901\b/g,
      '<a href="tel:+447881821901">$&</a>',
    )
    .replaceAll("\n", "<br>");
}

function renderLegacyCopy(data) {
  const headings = new Set(data.headings || []);
  const blocks = data.copy.trim().split(/\n{2,}/);
  const firstLine = blocks[0].split("\n")[0];
  const heroTitle = data.heroTitle || firstLine;

  if (firstLine === heroTitle) {
    const remaining = blocks[0].split("\n").slice(1).join("\n").trim();
    if (remaining) blocks[0] = remaining;
    else blocks.shift();
  }

  const content = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (headings.has(trimmed)) {
        return `<h2>${formatLegacyText(trimmed)}</h2>`;
      }

      const lines = trimmed.split("\n");
      const bulletLines = lines.filter((line) =>
        /^(?:•|- |\*)/.test(line.trim()),
      );
      if (bulletLines.length === lines.length) {
        return `<ul>${lines
          .map((line) =>
            line
              .trim()
              .replace(/^•\s*/, "")
              .replace(/^-\s+/, "")
              .replace(/^\*\s*/, ""),
          )
          .map((line) => `<li>${formatLegacyText(line)}</li>`)
          .join("")}</ul>`;
      }

      return `<p>${formatLegacyText(trimmed)}</p>`;
    })
    .join("\n");
  const media = (data.images || [])
    .map(
      (image) =>
        `<img src="${image.src}" alt="${escapeContent(image.alt)}" loading="lazy">`,
    )
    .join("");

  return {
    heroTitle,
    html: `<section class="legacy-content">
      <div class="section-shell legacy-content__inner">
        ${
          data.historical
            ? '<p class="legacy-content__notice">Historical event information</p>'
            : ""
        }
        ${media ? `<figure class="legacy-content__media legacy-content__media--${data.images.length}">${media}</figure>` : ""}
        <div class="legacy-copy" data-reveal>${content}</div>
      </div>
    </section>`,
  };
}

function createLegacyPage(path, data) {
  const rendered = renderLegacyCopy(data);
  const parent = data.parent ? crumbs[data.parent] : undefined;
  const heroConfig = {
    title: rendered.heroTitle,
    description: `${rendered.heroTitle} information from NJH Sports Therapy & Pilates.`,
    eyebrow: rendered.heroTitle,
    intro: "",
    parent,
  };
  const legacyPage = page(heroConfig, rendered.html);
  if (path === "/price-list") legacyPage.canonical = "/prices";
  return legacyPage;
}

const pilatesLegacyTargets = {
  // "/blank-1" was the old studio page and now belongs to studioLegacyTargets,
  // since the studio section left /pilates.
  "/individual-pilates": "individual",
  "/small-group-pilates-timetable": "small-group",
  "/blank": "pre-postnatal",
  "/pilates-for-golfers": "golfers",
  // Retreat content is archived, so there is no section to land on — the key
  // stays so /retreats keeps resolving to /pilates instead of falling through
  // to the legacy retreat page.
  "/retreats": "",
};

const studioLegacyTargets = {
  // Professional links were removed from the page — key retained for the same
  // reason as "/retreats" above, so /links keeps resolving to /studio rather
  // than falling through to the legacy links page.
  "/links": "",
  // The page was published at /clinics before it was renamed; the old URL keeps
  // resolving here rather than 404ing for anyone holding a link to it.
  "/clinics": "",
  // The studio copy used to live on /pilates, so the old deep link lands on the
  // section that now carries it.
  "/blank-1": "studio",
};

const therapyLegacyTargets = {
  "/what-is-what-are-the-benifits": "overview",
  "/treatment": "treatment",
  "/myofascial-release": "myofascial-release",
  "/what-to-expect": "what-to-expect",
  "/kinesiology-taping": "kinesiology-taping",
  // Workplace massage was removed — key retained for the same reason as
  // "/retreats" above, so the legacy page is not resurrected.
  "/office-based-sports-massage": "",
};

/* Built once and shared by /faq and the legacy /clinic-policies route, so the
   two URLs render the same object rather than two builds of the same page. */
const faq = buildFaqPage();

const routes = {
  "/pilates": pilatesContinuous,
  ...Object.fromEntries(
    Object.entries(pilatesLegacyTargets).map(([path, scrollTarget]) => [
      path,
      { ...pilatesContinuous, scrollTarget },
    ]),
  ),
  "/studio": studioContinuous,
  ...Object.fromEntries(
    Object.entries(studioLegacyTargets).map(([path, scrollTarget]) => [
      path,
      { ...studioContinuous, scrollTarget },
    ]),
  ),
  "/sports-therapy": sportsTherapyContinuous,
  ...Object.fromEntries(
    Object.entries(therapyLegacyTargets).map(([path, scrollTarget]) => [
      path,
      { ...sportsTherapyContinuous, scrollTarget },
    ]),
  ),
  "/about": aboutContinuous,
  // Charity work used to be its own page on the old site, and then a section at
  // the foot of /studio. It now sits on /about, so the original URL follows it
  // there rather than landing on a section that no longer exists.
  "/charity-work": { ...aboutContinuous, scrollTarget: "charity" },
  // The FAQ owns its own hero, so it is assembled by its module rather than
  // through page() — same arrangement as About.
  "/faq": faq,
  // The old site's /clinic-policies page. The "Practical details" section it
  // used to land on has moved from /pilates to the foot of /faq, so the legacy
  // URL follows it and still opens on the policies themselves. renderRoute
  // hands scrollTarget to main.js, which scrolls there before first paint.
  "/clinic-policies": { ...faq, scrollTarget: "practical" },
  /* The films side, and the nav's destination — unless there are no films, in
     which case there is no films page to send anybody to and this is the
     reviews. That is the whole of what an empty FILMS list does to the site:
     the switch disappears, this address shows the wall, and the reviews keep
     their own URL underneath. Nobody lands on a heading with nothing under it. */
  "/client-stories": hasFilms() ? clientFilms : { ...clientReviews },
  "/client-stories/reviews": clientReviews,
  /* The journeys, on the same terms the films are on: no entry at all when the
     list is empty, so the address 404s to the SPA fallback rather than serving
     a head with nothing under it — and the switch has already stopped offering
     it, so nothing on the site links here. See hasJourneys(). */
  ...(hasJourneys() ? { "/client-stories/journeys": clientJourneys } : {}),
  /* The wall was called Testimonials until the films arrived and it became one
     of two sides. Both old URLs are the reviews — that is what somebody
     following a link to /testimonials came for — so they land there rather
     than on the films. The redirects in public/_redirects do it at the edge;
     these entries answer if one is reached without going past them (a direct
     hit on the SPA fallback, or the dev server). They spread the page rather
     than aliasing the object, so the canonical they carry is
     /client-stories/reviews: the same arrangement /price-list has, and what
     keeps two URLs from competing for one page in search. The singular is the
     old site's spelling of it. */
  "/testimonials": { ...clientReviews },
  "/testimonial": { ...clientReviews },
  "/prices": prices,
  "/price-list": { ...prices, canonical: "/prices" },
  "/contact": buildContactPage(),
};

Object.entries(legacyPages).forEach(([path, data]) => {
  // Designed routes always win — legacy content only fills gaps.
  if (
    routes[path] ||
    path === "/pilates" ||
    path in pilatesLegacyTargets ||
    path === "/studio" ||
    path in studioLegacyTargets ||
    path in therapyLegacyTargets
  ) {
    return;
  }
  routes[path] = createLegacyPage(path, data);
});

function navigationMarkup(path) {
  // Legacy and aliased URLs (/price-list, /individual-pilates, /testimonial…)
  // carry the canonical of the page they actually render, so matching on that
  // rather than the raw path marks the nav item on every route into a page.
  const here = routes[path]?.canonical || path;
  return navGroups
    .map((group) => {
      const current =
        here === group.href ||
        /* And anything nested under it: /client-stories/reviews is the reviews
           side of Client Stories, not a page of its own somewhere else, so the
           nav item stays marked while you are on either side of the switch.
           Guarded against "/" , which every path is nested under. */
        (group.href !== "/" && here.startsWith(`${group.href}/`)) ||
        group.links.some(([, href]) => here === href.split("#")[0]);
      if (!group.links.length) {
        return `<a href="${group.href}"${current ? ' aria-current="page"' : ""}>${group.label}</a>`;
      }
      return `<div class="nav-group${current ? " is-current" : ""}">
        <div class="nav-group__top">
          <a href="${group.href}"${current ? ' aria-current="page"' : ""}>${group.label}</a>
          <button type="button" aria-expanded="false" aria-label="Open ${group.label} menu"><span></span></button>
        </div>
        <div class="nav-group__menu">
          ${group.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
      </div>`;
    })
    .join("");
}

function updateMetadata(route, path) {
  // metaTitle is the document/SEO title; title is the on-page <h1>. Pages that
  // only set title keep using it for both.
  const plainTitle = (route?.metaTitle ?? route?.title)
    ?.replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "");
  document.title = plainTitle
    ? plainTitle.includes("NJH")
      ? plainTitle
      : `${plainTitle} | NJH`
    : "NJH Sports Therapy & Pilates";
  const description = document.querySelector('meta[name="description"]');
  if (description && route?.description) {
    description.setAttribute("content", route.description);
  }
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = `https://www.njhsportstherapy.co.uk${route?.canonical || path}`;
}

function hydrateNavigation(path) {
  const navigation = document.querySelector(".site-nav");
  if (navigation) navigation.innerHTML = navigationMarkup(path);
}

function hydrateShell(path) {
  hydrateNavigation(path);
  const footerGrid = document.querySelector(".site-footer__grid");
  if (footerGrid) {
    footerGrid.innerHTML = `<a class="wordmark site-footer__wordmark" href="/" aria-label="NJH home">
      <span class="wordmark__name">NJH</span><span class="wordmark__descriptor">Sports Therapy<br>& Pilates</span>
    </a>
    <div><p class="site-footer__label">Treatment</p><a href="/sports-therapy">Sports Therapy</a><a href="/sports-therapy#treatment">Techniques</a><a href="/sports-therapy#what-to-expect">Your appointment</a></div>
    <div><p class="site-footer__label">Movement</p><a href="/pilates">Clinical Pilates</a><a href="/pilates#small-group">Timetable</a><a href="/faq#practical">Practical details</a></div>
    <div><p class="site-footer__label">Practice</p><a href="/about">About Natasha</a><a href="/faq">FAQ</a><a href="/studio">Studio</a><a href="/client-stories">Client Stories</a><a href="/prices">Prices</a><a href="/contact">Contact</a></div>`;
  }
  const footerBottom = document.querySelector(".site-footer__bottom");
  if (footerBottom) {
    footerBottom.innerHTML =
      "<p>© 2026 NJH Sports Therapy & Pilates</p><p>Website information does not replace individual medical advice.</p>";
  }
}

export function renderRoute() {
  const path = escapePath(routePath());
  const route = routes[path];
  if (path === "/") {
    document.body.classList.add("has-expanded-nav");
    hydrateNavigation(path);
    return { path, isHome: true };
  }

  hydrateShell(path);
  const main = document.querySelector("main");
  if (route && main) {
    main.innerHTML = route.html;
    document.body.classList.add("is-inner-page");
    if (route.canonical === "/pilates") {
      document.body.classList.add("is-pilates-page");
    }
    if (route.canonical === "/studio") {
      document.body.classList.add("is-studio-page");
    }
    if (route.canonical === "/sports-therapy") {
      document.body.classList.add("is-therapy-page");
    }
    document.body.dataset.heroTone = route.tone || "light";
    updateMetadata(route, path);
    return {
      path,
      isHome: false,
      route,
      scrollTarget: route.scrollTarget || "",
    };
  }

  if (main) {
    main.innerHTML = `${hero({
      eyebrow: "Page not found",
      title: "This page has moved.",
      intro:
        "The page you requested could not be found. Use the navigation or return to the homepage.",
    })}${cta("Let us help you find the right page.")}`;
  }
  document.body.classList.add("is-inner-page");
  updateMetadata(
    {
      title: "Page not found | NJH",
      description: "The requested NJH page could not be found.",
    },
    path,
  );
  return { path, isHome: false };
}

/* The looping walkthrough behind the /studio hero.

   The clip is not in the markup's load path — the <video> ships preload="none"
   — so nothing is fetched until this decides to fetch it. Asked for reduced
   motion, it never is: the poster still under it is the hero, and a few MB of
   footage is not downloaded to sit paused on the first frame.

   It also only runs while the hero is on screen. A muted background loop
   decoding for the whole length of the page is a laptop fan for no reason. */
function initStudioReel() {
  const reel = document.querySelector("[data-studio-reel]");
  if (!reel) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Set on the element as well as in markup: autoplay policies read the
  // property, and a muted attribute that arrived via innerHTML is worth not
  // relying on.
  reel.muted = true;
  reel.playsInline = true;

  // Only reveal the video once it can actually play. Until then — and for
  // good if the file is missing or the codec is refused — the still shows.
  reel.addEventListener(
    "canplay",
    () => reel.classList.add("is-ready"),
    { once: true },
  );

  reel.preload = "auto";
  reel.load();

  if (!("IntersectionObserver" in window)) {
    reel.play().catch(() => {});
    return;
  }

  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (low power mode, data saver). The
          // still is already behind it, so a rejected promise needs no
          // handling beyond not throwing.
          reel.play().catch(() => {});
        } else {
          reel.pause();
        }
      });
    },
    { threshold: 0.05 },
  ).observe(reel);
}

export function initPageFeatures() {
  // Ahead of the form guard: /studio carries the hero reel and no enquiry
  // form. (initStudioCarousel lived here too, until the carousel was replaced
  // by the two photographs now standing in the room section.)
  initStudioReel();

  const form = document.querySelector("[data-enquiry-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      status.textContent = "Please check the highlighted fields.";
      form.querySelector(":invalid")?.focus();
      return;
    }

    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
    if (!endpoint) {
      status.innerHTML = `Online sending is not configured yet. Please email <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>.`;
      return;
    }

    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    status.textContent = "Sending your enquiry…";

    /* The subject line is the only part of the notification Natasha sees
       before opening it, and on a phone it is most of what she gets. A fixed
       "New NJH website enquiry" wastes that: a screenful of identical subjects
       cannot be triaged, and a Pilates question and an acute injury want
       different reply times. Writing who and what into it makes the inbox
       sortable and searchable by name months later.

       Composed here rather than in the markup because it needs the values,
       and written back into the existing hidden field so the FormData below
       picks it up unchanged. Falls back to the static value if either field
       is missing — no page should lose its send over a subject line. */
    const subjectField = form.querySelector('input[name="_subject"]');
    if (subjectField) {
      const who = form.querySelector("#name")?.value.trim();
      const what = form.querySelector("#service")?.value;
      const parts = ["New enquiry", what, who].filter(Boolean);
      if (parts.length > 1) subjectField.value = parts.join(" — ");
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");

      /* Some providers answer 200 to submissions they have refused and report
         the refusal only in the body — FormSubmit does exactly this for an
         address whose form has not been activated, and a blocked origin reads
         the same way. Trusting the status code alone would thank somebody for
         an enquiry that was never delivered, and on this site that is a lost
         client. Formspree signals failure in the status code and so never
         trips this, but the check costs nothing and outlives the provider.

         A body that will not parse is treated as sent: the request did come
         back 200, and inventing a failure has its own cost. Only an explicit
         "false" counts as a refusal. */
      const result = await response.json().catch(() => null);
      if (result && String(result.success) === "false") {
        throw new Error(result.message || "Form submission rejected");
      }

      form.reset();
      form.classList.remove("was-validated");
      status.textContent =
        "Thank you. Your enquiry has been sent and Natasha will be in touch.";
    } catch {
      status.innerHTML = `Your message could not be sent. Please try again or email <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>.`;
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  });
}
