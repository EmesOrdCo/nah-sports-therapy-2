import { legacyPages } from "./legacy-content.js";
import { buildAboutPage } from "./about/index.js";
import { buildContactPage } from "./contact/index.js";
import { routePath } from "./base-path.js";
import { REVIEWS, voicesItems, voicesSwitch } from "./reviews.js";

const BUSINESS = {
  phoneDisplay: "07881 821 901",
  phoneHref: "tel:+447881821901",
  email: "njhsportstherapyandpilates@gmail.com",
};

const escapePath = (path) => path.replace(/\/+$/, "") || "/";

const navGroups = [
  { label: "Home", href: "/", links: [] },
  {
    label: "Pilates",
    href: "/pilates",
    links: [
      ["Overview", "/pilates#overview"],
      ["Studham studio", "/pilates#studio"],
      ["Individual Pilates", "/pilates#individual"],
      ["Small-group timetable", "/pilates#small-group"],
      ["Pre & postnatal Pilates", "/pilates#pre-postnatal"],
      ["Pilates for golfers", "/pilates#golfers"],
      ["Practical details", "/pilates#practical"],
    ],
  },
  {
    label: "Clinics",
    href: "/clinics",
    links: [
      ["Locations", "/clinics#locations"],
      ["Testimonials", "/clinics#testimonials"],
      ["Professional links", "/clinics#links"],
      ["Charity work", "/clinics#charity"],
    ],
  },
  {
    label: "Sports Therapy",
    href: "/sports-therapy",
    links: [
      ["Overview", "/sports-therapy#overview"],
      ["Treatment", "/sports-therapy#treatment"],
      ["Myofascial Release", "/sports-therapy#myofascial-release"],
      ["What to expect", "/sports-therapy#what-to-expect"],
      ["Kinesiology Taping", "/sports-therapy#kinesiology-taping"],
      ["Treatment prices", "/sports-therapy#practical"],
    ],
  },
  { label: "About", href: "/about", links: [] },
  { label: "Contact", href: "/contact", links: [["Prices", "/prices"]] },
];

const crumbs = {
  pilates: ["Pilates", "/pilates"],
  clinics: ["Clinics", "/clinics"],
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

function hero({ eyebrow, title, intro, parent, tone = "light", media }) {
  const crumb = parent
    ? `<a href="${parent[1]}">${parent[0]}</a><span aria-hidden="true">/</span>`
    : '<a href="/">Home</a><span aria-hidden="true">/</span>';
  const inner = `<nav class="breadcrumbs" aria-label="Breadcrumb">${crumb}<span>${eyebrow}</span></nav>
      <h1>${title}</h1>
      ${intro ? `<p class="page-hero__intro">${intro}</p>` : ""}`;
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

const partnerLinks = page(
  {
    title: "Professional Links | NJH",
    description: "Training bodies and professional resources connected to NJH.",
    eyebrow: "Professional links",
    title: "Professional links",
    intro:
      "Organisations connected to Natasha's professional training in Sports Therapy, soft-tissue work and Pilates.",
    parent: crumbs.clinics,
  },
  `<section class="resource-section"><div class="section-shell resource-list">
    <a href="https://www.lssm.com/" target="_blank" rel="noreferrer" data-reveal><span>01</span><div><h2>London School of Sports Massage</h2><p>Professional training in sport and remedial massage.</p></div><b>↗</b></a>
    <a href="https://www.theisrm.com/" target="_blank" rel="noreferrer" data-reveal><span>02</span><div><h2>Institute for Soft Tissue Therapists</h2><p>Professional membership and standards for soft-tissue practice.</p></div><b>↗</b></a>
    <a href="https://www.merrithew.com/stott-pilates" target="_blank" rel="noreferrer" data-reveal><span>03</span><div><h2>Merrithew — STOTT PILATES</h2><p>Contemporary Pilates education and equipment.</p></div><b>↗</b></a>
  </div></section>${cta()}`,
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

const prices = page(
  {
    title: "Prices | NJH",
    description:
      "Current NJH Sports Therapy and Pilates appointment prices.",
    eyebrow: "Prices",
    title: "Prices",
    intro:
      "Appointment length is chosen around your needs. New or complex presentations may benefit from more assessment time.",
    parent: crumbs.contact,
  },
  `<section class="pricing-section"><div class="section-shell pricing-grid">
    <article data-reveal><h2>Sports Therapy</h2>
      <div class="price-row"><span>Up to 90 minutes</span><strong>£130</strong></div>
      <div class="price-row"><span>Standard session, up to 1 hour</span><strong>£85</strong></div>
      <div class="price-row"><span>Up to 30 minutes</span><strong>£60</strong></div>
      <small>Sunday and Bank Holiday appointments carry a £10 surcharge.</small>
    </article>
    <article data-reveal><h2>Pilates</h2>
      <div class="price-row"><span>One-to-one, 1 hour</span><strong>£85</strong></div>
      <div class="price-row"><span>Duet, shared with a friend or partner</span><strong>£95</strong></div>
      <div class="price-row"><span>Initial assessment before small group</span><strong>£85</strong></div>
      <div class="price-row"><span>Small-group session</span><strong>£22</strong></div>
      <small>Small-group classes are paid in termly blocks and are non-refundable once your place is reserved.</small>
    </article>
  </div></section>
  ${section(
    "Appointment duration",
    "Enough time for the work required.",
    `<p>Most appointments last approximately one hour. A 30-minute session may be recommended where appropriate, while a new or more complex presentation may benefit from up to 90 minutes.</p><p>The recommended duration will be discussed before booking. Treatment may occasionally finish earlier to avoid over-treatment.</p>`,
    "editorial-section--tint",
  )}${cta("Discuss the right appointment length.")}`,
);

function legacyImage(path, index, className = "") {
  const image = legacyPages[path]?.images?.[index];
  if (!image) return "";
  return `<img class="${className}" src="${image.src}" alt="${escapeContent(image.alt)}" loading="${path === "/pilates" && index === 1 ? "eager" : "lazy"}">`;
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
          <nav class="pilates-section-index" aria-label="On this page">
            <a href="#studio"><span>01</span> Studio</a>
            <a href="#individual"><span>02</span> Individual</a>
            <a href="#small-group"><span>03</span> Small groups</a>
            <a href="#pre-postnatal"><span>04</span> Pre/Postnatal</a>
            <a href="#golfers"><span>05</span> Golfers</a>
          </nav>
        </div>
      </section>

      <section class="pilates-approach" id="approach" aria-labelledby="approach-title">
        <div class="section-shell">
          <header class="pilates-approach__head" data-reveal>
            <h2 id="approach-title">Awareness is the greatest agent for change.</h2>
            <p class="pilates-approach__intro">The benefits of Pilates are understanding how to correct poor posture, improve strength and range of movement around the joint, and promote and maintain a healthy back.</p>
          </header>
          <ol class="pilates-approach__steps" data-reveal>
            <li class="pilates-approach__step">
              <span class="pilates-approach__num">01</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.2" r="2.1"/><path d="M12 6.5v7"/><path d="M8.5 9.2h7"/><path d="M12 13.5 9.2 21"/><path d="M12 13.5 14.8 21"/></svg></span>
              <strong>Improve posture</strong>
            </li>
            <li class="pilates-approach__step">
              <span class="pilates-approach__num">02</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 5.8v4.7c0 4.3 3 6.7 7 8.2 4-1.5 7-3.9 7-8.2V5.8L12 3Z"/><path d="M9.2 11.4 11.3 13.6 15 9.4"/></svg></span>
              <strong>Core strength &amp; stability</strong>
            </li>
            <li class="pilates-approach__step">
              <span class="pilates-approach__num">03</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5c2.5-2.6 5.5-2.6 8 0s5.5 2.6 8 0"/><path d="M3 14.5c2.5-2.6 5.5-2.6 8 0s5.5 2.6 8 0"/></svg></span>
              <strong>Release unwanted tension</strong>
            </li>
            <li class="pilates-approach__step">
              <span class="pilates-approach__num">04</span>
              <span class="pilates-approach__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5h16"/><path d="M12 10.5V19"/><path d="M8.5 19h7"/><path d="M12 10.5 9 5h6l-3 5.5Z"/></svg></span>
              <strong>Restore balance to muscles around the joint</strong>
            </li>
          </ol>
          <figure class="pilates-approach__quote" data-reveal>
            <blockquote>&ldquo;In 10 sessions you will feel the difference. In 20, you will see the difference. And in 30, you&rsquo;ll be on your way to having a whole new body.&rdquo;</blockquote>
            <figcaption>Joseph Hubertus Pilates</figcaption>
          </figure>
          <p class="pilates-approach__credential-label" data-reveal>STOTT Pilates trained</p>
        </div>
      </section>

      <section class="pilates-studio" id="studio" aria-labelledby="studio-title">
        <div class="section-shell pilates-studio__grid">
          <div class="pilates-studio__copy" data-reveal>
            <h2 id="studio-title">The Studham studio</h2>
            <p>After working in physio clinics for many years, January 2016 saw the launch of the NJH Sports Therapy and Pilates Studio. This tranquil, light and airy space provides the perfect place to switch off and focus on you.</p>
            <p>Whether it is to receive Soft Tissue Release with a Sports Therapy appointment, Individual or Small Group Pilates sessions, this is a place to restore muscular wellbeing and improve posture.</p>
            <a class="pilates-arrow-link" href="${BUSINESS.phoneHref}">Call ${BUSINESS.phoneDisplay} <span>&#8599;</span></a>
          </div>
          <figure class="pilates-studio__shot" data-reveal>
            <img src="/images/pilates-studio.webp" alt="The NJH Pilates studio in Studham" width="1200" height="900" loading="lazy">
            <figcaption>Light, private, considered &middot; Studham, near Whipsnade</figcaption>
          </figure>
        </div>
      </section>

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
                <circle class="hero-orb__node" cx="50" cy="4.4" r="1.5" />
                <circle class="hero-orb__node" cx="95.6" cy="50" r="1.5" />
              </svg>
            </div>
            <dl class="pilates-orbit-facts">
              <div class="pilates-orbit-fact pilates-orbit-fact--format"><dt>Format</dt><dd>One-to-one or duet</dd></div>
              <div class="pilates-orbit-fact pilates-orbit-fact--length"><dt>Length</dt><dd>One hour</dd></div>
              <div class="pilates-orbit-fact pilates-orbit-fact--available"><dt>Available</dt><dd>Monday to Friday</dd></div>
            </dl>
          </div>
          <div class="pilates-feature__content" data-reveal>
            <h2 id="individual-title">Individual Pilates</h2>
            <p class="pilates-feature__lead">One-to-one Pilates—or a duet session with a friend—tailored to suit your needs and objectives.</p>
            <p>Your session focuses on restoring muscular balance, with specific exercises designed for your posture type or medical conditions such as osteoporosis, frozen shoulder, and neck, knee or lower-back issues.</p>
            <a class="pilates-arrow-link" href="#contact">Discuss your requirements <span>→</span></a>
          </div>
        </div>
      </section>

      <section class="pilates-feature pilates-feature--group" id="small-group" aria-labelledby="group-title">
        <div class="pilates-orbit pilates-orbit--group" aria-hidden="true"><span></span><i></i></div>
        <div class="section-shell">
          <header class="pilates-section-heading pilates-section-heading--split" data-reveal>
            <h2 id="group-title">Small group Pilates</h2>
            <p>Class sizes are small to ensure close attention to posture and movement during each exercise where necessary. Sessions focus on precise, controlled movement to improve your joint range of movement and help you feel stronger.</p>
          </header>
          <div class="pilates-group-layout">
            <figure class="pilates-group-shot" data-reveal>
              <img src="/images/legacy/pilates-studio-4.jpg" alt="The light, airy NJH studio in Studham" loading="lazy">
              <figcaption>Close attention to posture, in a small group</figcaption>
            </figure>
            <div class="pilates-timetable" data-reveal>
              <div class="pilates-detail-label"><span>Weekly timetable</span><small>Confirm availability before booking</small></div>
              <div class="pilates-timetable__row"><strong>Monday</strong><p><span>6.30pm</span></p></div>
              <div class="pilates-timetable__row"><strong>Tuesday</strong><p><span>8.30am <small>45 min</small></span><span>9.20am</span><span>11.30am</span></p></div>
              <div class="pilates-timetable__row"><strong>Friday</strong><p><span>7.30am</span><span>9.30am</span></p></div>
              <p class="pilates-timetable__note">Sessions are 55 minutes unless noted. An initial one-to-one assessment including postural analysis is required before joining Small Group Pilates.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="pilates-dual" id="pre-postnatal" aria-labelledby="natal-title">
        <div class="section-shell">
          <header class="pilates-section-heading" data-reveal>
            <h2 id="natal-title">Pre- and postnatal Pilates</h2>
          </header>
          <div class="pilates-dual__grid">
            <article data-reveal>
              <figure>${legacyImage("/blank", 0)}</figure>
              <span>Prenatal</span>
              <h3>During pregnancy</h3>
              <ul><li>Maintain fitness during pregnancy</li><li>Improve posture</li><li>Strengthen the pelvic floor</li><li>Release tension</li></ul>
            </article>
            <article data-reveal>
              <figure>${legacyImage("/blank", 1)}</figure>
              <span>Postnatal</span>
              <h3>After birth</h3>
              <p>After the six-week GP check, or 8–12 weeks following a Caesarean section.</p>
              <ul><li>Restore abdominal strength after birth</li><li>Strengthen the pelvic floor</li><li>Improve conditions such as diastasis recti</li></ul>
            </article>
          </div>
          <p class="pilates-dual__note" data-reveal>Available individually or for your own small group of NCT, prenatal or postnatal friends. Maximum 1:7 to ensure close attention and correction when necessary.</p>
        </div>
      </section>

      <section class="pilates-golf" id="golfers" aria-labelledby="golf-title">
        <div class="section-shell pilates-golf__grid">
          <div class="pilates-golf__content" data-reveal>
            <h2 id="golf-title">Pilates for golfers</h2>
            <p>For a golfer, muscle imbalances can affect the legs, hips, arms, shoulders and lower back. Pilates is based on movement from the centre of the body, as are most shots in golf.</p>
            <p>Core strength can improve hip rotation, range of motion in the shoulders and back stability, leading to improved performance.</p>
            <ul class="pilates-golf__benefits"><li>Improve balance and flexibility</li><li>Strengthen your core to avoid injury</li><li>Work on overall breathing and focus</li></ul>
          </div>
          <div class="pilates-golf__media" data-reveal>
            <figure class="pilates-golf__anatomy">${legacyImage("/pilates-for-golfers", 0)}<figcaption>Anatomy of the movement</figcaption></figure>
            <figure class="pilates-golf__swing">${legacyImage("/pilates-for-golfers", 1)}<figcaption>The swing sequence</figcaption></figure>
          </div>
        </div>
      </section>

      <section class="pilates-practical" id="practical" aria-labelledby="practical-title">
        <div class="section-shell">
          <header class="pilates-section-heading pilates-section-heading--split" data-reveal>
            <h2 id="practical-title">Prices &amp; practical details</h2>
            <p>Timetable, prices and policies should be confirmed when booking.</p>
          </header>
          <div class="pilates-practical__grid">
            <article data-reveal>
              <span>Pilates charges</span>
              <div class="pilates-price"><p>One-to-one Pilates</p><strong>£85</strong></div>
              <div class="pilates-price"><p>Duet with a friend or partner</p><strong>£95</strong></div>
              <div class="pilates-price"><p>Initial 1:1 before Small Group Pilates</p><strong>£85</strong></div>
              <div class="pilates-price"><p>Small Group Pilates session</p><strong>£22</strong></div>
              <small>Small Group sessions are paid for in termly blocks.</small>
            </article>
            <article data-reveal>
              <span>Clinic policies</span>
              <details><summary>Appointments and cancellation <b>+</b></summary><p>A charge is made for missed Soft Tissue, 1:1 or 2:1 Pilates appointments or non-attendance unless 24 hours notice is given. A 50% charge is required for less than 48 hours notice.</p></details>
              <details><summary>Late arrival <b>+</b></summary><p>If you are late for your 1:1 or 2:1, the session still falls within the scheduled appointment time. If the practitioner misses a scheduled 1:1 appointment, you will receive a free session.</p></details>
              <details><summary>Small Group blocks <b>+</b></summary><p>Small Group Pilates blocks are paid for in termly blocks. Once payment is received, your place is reserved for the entire block and no refunds are given.</p></details>
              <details><summary>Clients under 16 <b>+</b></summary><p>Clients under 16 must be accompanied by a parent who will be required to sign a parental consent form.</p></details>
            </article>
          </div>
        </div>
      </section>

      <section class="pilates-contact" id="contact" aria-labelledby="pilates-contact-title">
        <div class="pilates-orbit pilates-orbit--contact" aria-hidden="true"><span></span><i></i></div>
        <div class="section-shell pilates-contact__grid">
          <div data-reveal><h2 id="pilates-contact-title">Find the right place to begin.</h2></div>
          <div data-reveal><p>For further details or to discuss your specific requirements, contact Natasha Hadland.</p><a class="button-link" href="/contact">Send an enquiry <span>↗</span></a><a class="pilates-contact__phone" href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a></div>
        </div>
      </section>
    </div>`,
  };
}

const pilatesContinuous = buildPilatesContinuousPage();

function buildClinicsContinuousPage() {
  return {
    title: "NJH Clinics",
    description:
      "The NJH Sports Therapy and Pilates studio in Studham, plus client testimonials, professional links and charity work.",
    canonical: "/clinics",
    html: `<div class="clinics-longform">
      <section class="clinics-hero" id="overview" aria-labelledby="clinics-title">
        <div class="section-shell clinics-hero__inner">
          <div class="clinics-hero__grid">
            <div class="clinics-hero__content">
              <h1 id="clinics-title">The NJH clinic in Studham.</h1>
              <div class="clinics-hero__footer">
                <p>Professional, personal Sports Therapy and Pilates care from one private studio in Studham, near Whipsnade.</p>
                <a class="pilates-arrow-link" href="${BUSINESS.phoneHref}">Appointments · ${BUSINESS.phoneDisplay} <span>↗</span></a>
              </div>
            </div>
            <figure class="clinics-hero__media clinics-hero__media--figure">
              <object class="clinics-hero__figure" type="image/svg+xml" data="/images/clinics-hands-animated.svg" aria-label="Line drawing of hands-on soft tissue treatment to the shoulder within measured rings" tabindex="-1"></object>
            </figure>
          </div>
        </div>
      </section>

      <section class="clinics-locations" id="locations" aria-label="Clinic location">
        <div class="section-shell">
          <ol class="clinic-list">
            <li data-reveal>
              <h2>The Studham studio</h2>
              <address>Studham, near Whipsnade</address>
            </li>
          </ol>
          <p class="clinic-list__note">Sports Therapy, individual Pilates and small-group Pilates, all in one private studio. Full directions are sent when your appointment is confirmed. <a href="/pilates#studio">Studio details</a></p>
        </div>
      </section>

      <section class="voices voices--filterable" id="testimonials" aria-labelledby="clinics-testimonials-title">
        <svg class="voices__thread" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="voices__thread-line" d="M58 0 C 32 92, 30 182, 56 272 C 82 362, 80 452, 46 542 C 18 626, 22 716, 54 802 C 78 866, 76 936, 60 1000" pathLength="1" />
        </svg>
        <div class="voices__inner">
          <h2 class="voices__title" id="clinics-testimonials-title">In clients&rsquo; own words</h2>
          ${voicesSwitch()}
          <div class="voices__list" data-review-list>${voicesItems(REVIEWS)}</div>
        </div>
      </section>

      <section class="clinics-links" id="links" aria-labelledby="links-title">
        <div class="section-shell">
          <header class="pilates-section-heading pilates-section-heading--split" data-reveal><h2 id="links-title">Professional links</h2><p>Organisations connected to Natasha’s training in Sports Therapy and Pilates.</p></header>
          <div class="clinics-links__grid">
            <article data-reveal><span>01</span><figure>${legacyImage("/links", 0)}</figure><h3>London School of Sports Massage</h3></article>
            <article data-reveal><span>02</span><figure>${legacyImage("/links", 1)}</figure><h3>Institute of Sport &amp; Remedial Massage</h3></article>
            <a href="http://www.merrithew.com/stott-pilates/about" target="_blank" rel="noreferrer" data-reveal><span>03</span><figure>${legacyImage("/links", 2)}</figure><h3>Merrithew · STOTT Pilates</h3><b>↗</b></a>
          </div>
        </div>
      </section>

      <section class="clinics-charity" id="charity" aria-labelledby="charity-title">
        <div class="pilates-orbit clinics-charity__orbit" aria-hidden="true"><span></span><i></i></div>
        <div class="section-shell clinics-charity__grid">
          <div data-reveal><h2 id="charity-title">Charity work</h2></div>
          <div data-reveal><p>NJH Sports Therapy &amp; Pilates is keen to help raise money for charities in the area. Where possible, Natasha donates a Pilates 1:1 or duet voucher as a silent auction or raffle prize.</p><p>Please contact Natasha if you would like to discuss this further.</p><a class="button-link" href="/contact">Get in touch <span>↗</span></a></div>
        </div>
      </section>
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
  prices: [
    ["Up to 30 minutes", "£60", false],
    ["Standard · up to 1 hour", "£85", true],
    ["Up to 90 minutes", "£130", false],
  ],
};

/* Ruled rows — the divider-line list motif, now inside a card so the group
   still reads as a contained object rather than text loose on the page. */
const rows = (items, modifier = "") =>
  `<ul class="st-rows${modifier ? ` ${modifier}` : ""}">${items
    .map((item) => `<li>${item}</li>`)
    .join("")}</ul>`;

const eyebrow = (text) => `<span class="st-eyebrow">${text}</span>`;

/* Hero and contact are shared by all three variants — the hero is signed
   off, so only its responsive type was touched (see .therapy-hero h1). */
const therapyHero = () => `<section class="therapy-hero" id="overview" aria-labelledby="therapy-title">
  <div class="section-shell therapy-hero__grid">
    <div class="therapy-hero__content"><h1 id="therapy-title">Find what’s driving the pain, then treat it and rebuild.</h1><p>Sports Therapy provides relief from musculoskeletal pain and dysfunction through the use of various massage and soft-tissue techniques.</p><a class="pilates-arrow-link" href="#treatment">Explore treatment <span>↓</span></a></div>
    <figure class="therapy-hero__media therapy-hero__media--figure"><object class="therapy-hero__figure" type="image/svg+xml" data="/images/njh-signature-motion-figure-animated.svg" aria-label="Animated line drawing of a figure within orbiting rings" tabindex="-1"></object></figure>
  </div>
  <nav class="section-shell therapy-index" aria-label="On this page"><a href="#treatment"><span>01</span>Treatment</a><a href="#myofascial-release"><span>02</span>Myofascial release</a><a href="#what-to-expect"><span>03</span>What to expect</a><a href="#kinesiology-taping"><span>04</span>Taping</a></nav>
</section>`;

const therapyContact = () => `<section class="pilates-contact therapy-contact" id="contact" aria-labelledby="therapy-contact-title"><div class="pilates-orbit pilates-orbit--contact" aria-hidden="true"><span></span><i></i></div><div class="section-shell pilates-contact__grid"><div data-reveal><h2 id="therapy-contact-title">Tell us what you’d like to move beyond.</h2></div><div data-reveal><p>Whatever your injury or postural pain, contact Natasha to discuss the right place to begin.</p><a class="button-link" href="/contact">Send an enquiry <span>↗</span></a><a class="pilates-contact__phone" href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a></div></div></section>`;

const tapingFigure = () =>
  `<figure class="st-taping-figure" data-reveal>${legacyImage("/kinesiology-taping", 0)}<figcaption>Examples of kinesiology taping</figcaption></figure>`;

/* ---------- Variant A — card grid ---------- */

function therapyVariantA() {
  const { techniques, injuries, outcomes, conditions, fascia, steps, taping, prices } =
    THERAPY;
  return `
  <section class="st-section st-section--tint" id="approach" aria-labelledby="therapy-benefits-title">
    <div class="section-shell">
      <header class="st-head" data-reveal><h2 id="therapy-benefits-title">What sports therapy helps with</h2><p>Advanced techniques can help alleviate symptoms associated with a range of conditions.</p></header>
      <div class="st-grid st-grid--2">
        <article class="st-card" data-reveal>${eyebrow("Outcomes")}<h3>What improves</h3>${rows(outcomes)}</article>
        <article class="st-card" data-reveal>${eyebrow("Conditions")}<h3>What it eases</h3>${rows(conditions)}</article>
      </div>
    </div>
  </section>

  <section class="st-section" id="treatment" aria-labelledby="treatment-title">
    <div class="section-shell">
      <header class="st-head" data-reveal><h2 id="treatment-title">Treatment techniques</h2><p>Techniques are often combined with exercises to stretch and strengthen muscles at home.</p></header>
      <div class="st-grid st-grid--2">
        <article class="st-card" data-reveal>${eyebrow("Hands-on techniques")}<h3>How treatment is delivered</h3>${rows(techniques)}</article>
        <article class="st-card" data-reveal>${eyebrow("Common concerns")}<h3>What people come in with</h3>${rows(injuries)}</article>
      </div>
      <aside class="st-note" data-reveal><p>Professional referrals are welcomed from GPs, consultants, physiotherapists, osteopaths and podiatrists.</p></aside>
    </div>
  </section>

  <section class="st-section st-section--dark" id="myofascial-release" aria-labelledby="fascia-title">
    <div class="therapy-fascia__threads" aria-hidden="true"></div>
    <div class="section-shell">
      <header class="st-head" data-reveal><h2 id="fascia-title">Myofascial release</h2><p>Fascia is strong, flexible tissue surrounding muscles and bones. It spans the whole body as one connected material.</p></header>
      <div class="st-grid st-grid--2">
        <article class="st-card st-card--onDark" data-reveal><p>In a healthy state, fascia is relaxed and supports posture, range of movement and flexibility. Physical trauma, inflammation, surgery or habitual poor posture can make it tight and restricted.</p><p>Myofascial Release uses slow, sustained pressure to relax deep tissue, improve movement and reduce tension. Pressure can range from very gentle touch to deeper work and should never be beyond your tolerance.</p></article>
        <article class="st-card st-card--onDark" data-reveal>${eyebrow("Where it helps")}${rows(fascia, "st-rows--onDark")}</article>
      </div>
    </div>
  </section>

  <section class="st-section st-section--tint" id="what-to-expect" aria-labelledby="expect-title">
    <div class="section-shell">
      <header class="st-head" data-reveal><h2 id="expect-title">What to expect</h2><p>Every treatment is tailored to the individual client’s needs and reviewed through feedback.</p></header>
      <div class="st-grid st-grid--3">
        ${steps
          .map(
            ([title, body], index) =>
              `<article class="st-card st-card--step" data-reveal><b>0${index + 1}</b><h3>${title}</h3><p>${body}</p></article>`,
          )
          .join("")}
      </div>
      <aside class="st-note st-note--dark" data-reveal>${eyebrow("What to wear")}<p>Wear loose, comfortable clothing or bring shorts where possible. Depending on the location of your injury, you may be asked to remove some clothing; treatment can be carried out through clothes if you prefer.</p></aside>
    </div>
  </section>

  <section class="st-section" id="kinesiology-taping" aria-labelledby="taping-title">
    <div class="section-shell st-split">
      ${tapingFigure()}
      <div class="st-card" data-reveal><h2 id="taping-title">Kinesiology taping</h2><p>Taping can aid pain relief, reduce swelling and support postural awareness. It can be included in an appointment or booked as a standalone 15–20 minute session.</p>${rows(taping)}</div>
    </div>
  </section>

  <div class="st-section st-section--tint">
    <div class="section-shell">
      <section class="st-card" id="practical" aria-labelledby="therapy-practical-title" data-reveal>${eyebrow("Appointments")}<h2 id="therapy-practical-title">Treatment prices</h2><p>Appointment length is selected around the complexity of the presentation.</p><ul class="st-rows st-rows--price">${prices
        .map(
          ([label, amount, featured]) =>
            `<li${featured ? ' class="is-featured"' : ""}><span>${label}</span><strong>${amount}</strong></li>`,
        )
        .join("")}</ul><p class="st-footnote">Sunday and Bank Holiday appointments carry an additional £10 surcharge. Confirm current prices when booking.</p></section>
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
      ${therapyContact()}
    </div>`,
  };
}

const clinicsContinuous = buildClinicsContinuousPage();
const sportsTherapyContinuous = buildSportsTherapyContinuousPage();

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
  "/blank-1": "studio",
  "/individual-pilates": "individual",
  "/small-group-pilates-timetable": "small-group",
  "/blank": "pre-postnatal",
  "/pilates-for-golfers": "golfers",
  "/clinic-policies": "practical",
  // Retreat content is archived, so there is no section to land on — the key
  // stays so /retreats keeps resolving to /pilates instead of falling through
  // to the legacy retreat page.
  "/retreats": "",
};

const clinicsLegacyTargets = {
  "/testimonial": "testimonials",
  "/links": "links",
  "/charity-work": "charity",
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

const routes = {
  "/pilates": pilatesContinuous,
  ...Object.fromEntries(
    Object.entries(pilatesLegacyTargets).map(([path, scrollTarget]) => [
      path,
      { ...pilatesContinuous, scrollTarget },
    ]),
  ),
  "/clinics": clinicsContinuous,
  ...Object.fromEntries(
    Object.entries(clinicsLegacyTargets).map(([path, scrollTarget]) => [
      path,
      { ...clinicsContinuous, scrollTarget },
    ]),
  ),
  "/sports-therapy": sportsTherapyContinuous,
  ...Object.fromEntries(
    Object.entries(therapyLegacyTargets).map(([path, scrollTarget]) => [
      path,
      { ...sportsTherapyContinuous, scrollTarget },
    ]),
  ),
  "/about": buildAboutPage(),
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
    path === "/clinics" ||
    path in clinicsLegacyTargets ||
    path in therapyLegacyTargets
  ) {
    return;
  }
  routes[path] = createLegacyPage(path, data);
});

function navigationMarkup(path) {
  return navGroups
    .map((group) => {
      const current =
        path === group.href ||
        (group.href === "/pilates" && path in pilatesLegacyTargets) ||
        (group.href === "/clinics" && path in clinicsLegacyTargets) ||
        (group.href === "/sports-therapy" && path in therapyLegacyTargets) ||
        group.links.some(([, href]) => path === href.split("#")[0]);
      if (!group.links.length) {
        return `<a href="${group.href}"${current ? ' aria-current="page"' : ""}>${group.label}</a>`;
      }
      return `<div class="nav-group${current ? " is-current" : ""}">
        <div class="nav-group__top">
          <a href="${group.href}"${path === group.href ? ' aria-current="page"' : ""}>${group.label}</a>
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
    <div><p class="site-footer__label">Movement</p><a href="/pilates">Clinical Pilates</a><a href="/pilates#small-group">Timetable</a><a href="/pilates#practical">Pilates prices</a></div>
    <div><p class="site-footer__label">Practice</p><a href="/about">About Natasha</a><a href="/clinics">Locations</a><a href="/clinics#testimonials">Testimonials</a><a href="/contact">Contact</a></div>`;
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
    if (route.canonical === "/clinics") {
      document.body.classList.add("is-clinics-page");
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

export function initPageFeatures() {
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");
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
