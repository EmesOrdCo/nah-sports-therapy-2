const BUSINESS = {
  phoneDisplay: "07881 821 901",
  phoneHref: "tel:+447881821901",
  email: "njhsportstherapyandpilates@gmail.com",
};

const escapePath = (path) => path.replace(/\/+$/, "") || "/";

const navGroups = [
  { label: "Home", href: "/", links: [] },
  {
    label: "Sports Therapy",
    href: "/what-is-what-are-the-benifits",
    links: [
      ["Overview", "/what-is-what-are-the-benifits"],
      ["Treatment", "/treatment"],
      ["Myofascial Release", "/myofascial-release"],
      ["What to expect", "/what-to-expect"],
      ["Kinesiology Taping", "/kinesiology-taping"],
      ["Workplace massage", "/office-based-sports-massage"],
    ],
  },
  {
    label: "Pilates",
    href: "/pilates",
    links: [
      ["Overview", "/pilates"],
      ["Studham studio", "/blank-1"],
      ["Small-group timetable", "/small-group-pilates-timetable"],
      ["Individual Pilates", "/individual-pilates"],
      ["Pilates for golfers", "/pilates-for-golfers"],
      ["Pre & postnatal Pilates", "/blank"],
      ["Pilates retreats", "/retreats"],
      ["Clinic policies", "/clinic-policies"],
    ],
  },
  {
    label: "Clinics",
    href: "/clinics",
    links: [
      ["Locations", "/clinics"],
      ["Testimonials", "/testimonial"],
      ["Professional links", "/links"],
      ["Charity work", "/charity-work"],
    ],
  },
  { label: "About", href: "/about", links: [] },
  { label: "Contact", href: "/contact", links: [["Prices", "/prices"]] },
];

const crumbs = {
  pilates: ["Pilates", "/pilates"],
  clinics: ["Clinics", "/clinics"],
  therapy: ["Sports Therapy", "/what-is-what-are-the-benifits"],
  contact: ["Contact", "/contact"],
};

function icon(name) {
  const paths = {
    assess:
      '<circle cx="24" cy="24" r="15"/><path d="m35 35 9 9M17 24h14M24 17v14"/>',
    hands:
      '<path d="M8 29c8-9 12-10 17-6l5 4M40 29c-8-9-12-10-17-6l-5 4"/><path d="M6 36c8 5 13 6 19 2l5-4M42 36c-8 5-13 6-19 2l-5-4"/>',
    movement:
      '<path d="M9 33c8-1 11-5 14-14 2-6 8-9 16-6"/><path d="m33 8 7 5-5 7M10 40c8 1 14-1 20-7"/>',
    control:
      '<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="8"/><path d="M24 2v12M24 34v12M2 24h12M34 24h12"/>',
  };
  return `<svg class="line-icon" viewBox="0 0 48 48" aria-hidden="true">${paths[name] || paths.movement}</svg>`;
}

function cards(items, className = "") {
  return `<div class="editorial-cards ${className}">${items
    .map(
      (item, index) => `<article data-reveal>
        <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
        ${item.icon ? icon(item.icon) : ""}
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        ${item.href ? `<a class="text-link" href="${item.href}">Explore <span>→</span></a>` : ""}
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
      <div><p class="section-kicker">Start a conversation</p><h2>${title}</h2></div>
      <div><p>${text}</p><a class="button-link" href="/contact">Send an enquiry <span>↗</span></a></div>
    </div>
  </section>`;
}

function band(title, copy, items) {
  return `<section class="content-band">
    <div class="section-shell content-band__grid">
      <div data-reveal><p class="section-kicker">${copy}</p><h2>${title}</h2></div>
      <div data-reveal>${list(items, "tick-list")}</div>
    </div>
  </section>`;
}

function section(kicker, title, body, modifier = "") {
  return `<section class="editorial-section ${modifier}">
    <div class="section-shell editorial-section__grid">
      <header data-reveal><p class="section-kicker">${kicker}</p><h2>${title}</h2></header>
      <div class="prose" data-reveal>${body}</div>
    </div>
  </section>`;
}

function hero({ eyebrow, title, intro, parent, tone = "light" }) {
  const crumb = parent
    ? `<a href="${parent[1]}">${parent[0]}</a><span aria-hidden="true">/</span>`
    : '<a href="/">Home</a><span aria-hidden="true">/</span>';
  return `<section class="page-hero page-hero--${tone}">
    <div class="page-hero__visual" aria-hidden="true">
      <span></span><span></span><span></span><i></i>
    </div>
    <div class="section-shell page-hero__inner">
      <nav class="breadcrumbs" aria-label="Breadcrumb">${crumb}<span>${eyebrow}</span></nav>
      <p class="section-kicker">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="page-hero__intro">${intro}</p>
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
    title: "Move with<br><em>purpose.</em>",
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
    <header class="section-intro" data-reveal><p class="section-kicker">Ways to practise</p><h2>Choose the setting that<br><em>works for you.</em></h2></header>
    ${cards([
      { title: "Individual Pilates", text: "One-to-one or duet sessions designed around your posture, goals and medical history.", href: "/individual-pilates", icon: "control" },
      { title: "Small groups", text: "Attentive, welcoming classes with an initial one-to-one assessment before joining.", href: "/small-group-pilates-timetable", icon: "movement" },
      { title: "Pre & postnatal", text: "Supportive movement for pregnancy and a careful return after birth.", href: "/blank", icon: "hands" },
      { title: "For golfers", text: "Build rotation, balance, flexibility and control to support your game.", href: "/pilates-for-golfers", icon: "assess" },
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
    title: "Space to focus<br><em>on you.</em>",
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
    { title: "Individual Pilates", text: "Focused sessions adapted to you and your goals.", href: "/individual-pilates", icon: "control" },
    { title: "Small groups", text: "Close guidance in a welcoming small-class setting.", href: "/small-group-pilates-timetable", icon: "movement" },
  ], "editorial-cards--contained")}${cta("Find your place to begin.")}`,
);

const timetable = page(
  {
    title: "Small Group Pilates Timetable | NJH",
    description:
      "Current NJH small-group Pilates timetable and joining information.",
    eyebrow: "Small-group Pilates",
    title: "Move together.<br><em>Stay individual.</em>",
    intro:
      "Small classes give you the energy of practising with others without losing the individual attention that good movement needs.",
    parent: crumbs.pilates,
  },
  `<section class="timetable-section"><div class="section-shell timetable-grid">
    <header data-reveal><p class="section-kicker">Current timetable</p><h2>Weekly sessions</h2><p>Session length is 55 minutes unless noted. Please enquire to confirm current availability before attending.</p></header>
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
    title: "A session designed<br><em>around you.</em>",
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
    title: "Build a body that<br><em>supports your swing.</em>",
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
    title: "Supported movement<br><em>through change.</em>",
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
    title: "Clear expectations.<br><em>Considered care.</em>",
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

const clinics = page(
  {
    title: "Clinic Locations | NJH",
    description:
      "Find NJH Sports Therapy and Pilates locations in Studham and Berkhamsted.",
    eyebrow: "Clinic locations",
    title: "Care, closer<br><em>to home.</em>",
    intro:
      "Appointments are available in Studham and at established Berkhamsted locations. Contact Natasha to confirm the right setting for your session.",
  },
  `<section class="location-section"><div class="section-shell">
    <header class="section-intro" data-reveal><p class="section-kicker">Where to find us</p><h2>Three places.<br><em>One personal approach.</em></h2></header>
    <div class="location-grid">
      <article data-reveal><span>01</span><h3>Studham Pilates Studio</h3><p>Studham, near Whipsnade</p><p>Sports Therapy, individual Pilates and small-group Pilates in a calm private studio.</p><a href="/blank-1" class="text-link">Studio details <span>→</span></a></article>
      <article data-reveal><span>02</span><h3>Berkhamsted Physiotherapy & Sports Injury Clinic</h3><address>36A Lower Kings Road<br>Berkhamsted, Hertfordshire<br>HP4 2AA</address><a href="https://www.google.com/maps/search/?api=1&query=36A+Lower+Kings+Road+Berkhamsted+HP4+2AA" class="text-link" target="_blank" rel="noreferrer">Open map <span>↗</span></a></article>
      <article data-reveal><span>03</span><h3>Sportspace Berkhamsted</h3><address>Lagley Meadow<br>Douglas Gardens<br>Berkhamsted, Hertfordshire<br>HP4 3QQ</address><a href="https://www.google.com/maps/search/?api=1&query=Sportspace+Berkhamsted+HP4+3QQ" class="text-link" target="_blank" rel="noreferrer">Open map <span>↗</span></a></article>
    </div>
  </div></section>
  <section class="contact-strip"><div class="section-shell"><p>For appointments, call Natasha</p><a href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a></div></section>${cta()}`,
);

const partnerLinks = page(
  {
    title: "Professional Links | NJH",
    description: "Training bodies and professional resources connected to NJH.",
    eyebrow: "Professional links",
    title: "Trusted training.<br><em>Useful resources.</em>",
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

const charity = page(
  {
    title: "Charity Work | NJH",
    description:
      "NJH supports local fundraising events with pre- and post-event sports massage.",
    eyebrow: "Charity work",
    title: "Helping movement<br><em>make a difference.</em>",
    intro:
      "NJH is pleased to support local charities and community events where time and availability allow.",
    parent: crumbs.clinics,
  },
  `${section(
    "Community support",
    "Practical care for a good cause.",
    `<p>NJH has helped local fundraising through pre- and post-event sports massage at triathlons, marathons and 10K events.</p>
     <p>If you are organising a charity event and would like to discuss support, please get in touch with the event details, location and expected number of participants.</p>`,
  )}${cta("Planning a charity event?", "Share the details and Natasha will let you know whether NJH can help.")}`,
);

const testimonialData = [
  {
    type: "Sports Therapy & Pilates",
    quote:
      "After almost three months of weekly classes and three Sports Therapy sessions, I was amazed at the range of pain-free movement I had. My core strength and mobility improved with every session.",
    by: "Sarah, manager",
  },
  {
    type: "Pilates",
    quote:
      "The small group size and Natasha's clear instructions made all the difference. My general fitness has really improved and I would now find it difficult to miss my weekly class.",
    by: "Nicola",
  },
  {
    type: "Sports Therapy",
    quote:
      "The treatment hugely helped my long-standing shoulder injury, increasing my range and ease of movement. I can work better in the gym and play tennis without pain.",
    by: "Laura, physiotherapist",
  },
  {
    type: "Pilates",
    quote:
      "Natasha understands her clients' needs and tailors their exercises around them. I come away feeling taller, stronger and straighter.",
    by: "Tessa, teacher",
  },
  {
    type: "Sports Therapy",
    quote:
      "Through a variety of sports therapy techniques and dedicated strengthening and flexibility exercises, I was able to train harder than I had for years.",
    by: "Danny, chartered surveyor",
  },
  {
    type: "Rehabilitation",
    quote:
      "Natasha assessed how my body functioned as a whole, treated the source of pain and gave me useful exercises to strengthen my core and improve movement.",
    by: "Tom, competitive rower",
  },
];

const testimonials = page(
  {
    title: "Client Testimonials | NJH",
    description:
      "Read what NJH Sports Therapy and Pilates clients say about their care and movement.",
    eyebrow: "Testimonials",
    title: "Movement stories,<br><em>in their words.</em>",
    intro:
      "Experiences from people who have used Sports Therapy, Pilates and rehabilitation support with NJH.",
    parent: crumbs.clinics,
    tone: "dark",
  },
  `<section class="testimonial-wall"><div class="section-shell">${testimonialData
    .map(
      (item, index) => `<blockquote data-reveal>
      <span>${String(index + 1).padStart(2, "0")} / ${item.type}</span>
      <p>“${item.quote}”</p><footer>${item.by}</footer>
    </blockquote>`,
    )
    .join("")}</div></section>${cta("Ready to start your own progress?")}`,
);

const therapyHub = page(
  {
    title: "Sports Therapy | NJH",
    description:
      "Assessment-led Sports Therapy for musculoskeletal pain, movement and recovery.",
    eyebrow: "Sports Therapy",
    title: "Understand the problem.<br><em>Move forward.</em>",
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
    <header class="section-intro" data-reveal><p class="section-kicker">Explore your care</p><h2>Know what to<br><em>expect.</em></h2></header>
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
    title: "The right technique<br><em>for the person.</em>",
    intro:
      "Treatment can combine hands-on soft-tissue work, joint mobilisation and carefully chosen exercises according to your assessment.",
    parent: crumbs.therapy,
  },
  `<section class="dual-list-section"><div class="section-shell dual-list">
    <article data-reveal><p class="section-kicker">Techniques</p><h2>Hands-on care</h2>${list([
      "Deep-tissue massage",
      "Muscle energy techniques (MET)",
      "Soft-tissue release (STR)",
      "Deep friction techniques",
      "Neuromuscular techniques (NMT)",
      "Myofascial and connective-tissue work",
      "Positional release",
      "Manual mobilisation for joints and soft tissue",
    ])}</article>
    <article data-reveal><p class="section-kicker">Common concerns</p><h2>What we see</h2>${list([
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
    title: "Working with the body's<br><em>connected tissue.</em>",
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
    title: "A clear start.<br><em>A personal plan.</em>",
    intro:
      "Your first appointment creates time to understand the history, assess the area and agree what progress should look like for you.",
    parent: crumbs.therapy,
  },
  `<section class="process-section"><div class="section-shell process-list">
    <article data-reveal><span>01</span><div>${icon("assess")}<h2>Listen</h2><p>Discuss your medical history, current symptoms, activity and goals.</p></div></article>
    <article data-reveal><span>02</span><div>${icon("movement")}<h2>Assess</h2><p>Look at the area, relevant joints, posture and movement to understand the wider picture.</p></div></article>
    <article data-reveal><span>03</span><div>${icon("hands")}<h2>Plan</h2><p>Agree an individual treatment approach, which may include hands-on care and home exercises.</p></div></article>
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
    title: "Light-touch support<br><em>between sessions.</em>",
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
    title: "Knowledge, attention<br><em>and genuine care.</em>",
    intro:
      "Natasha Hadland brings Sports Therapy and clinical Pilates together to help people understand their bodies and move with greater confidence.",
  },
  `${section(
    "Natasha Hadland",
    "A career shaped by curiosity about movement.",
    `<p>After a ten-year career in fashion and time focused on her young family, Natasha pursued a longstanding interest in sport, anatomy and physiology.</p>
     <p>Training at the London School of Sports Massage led to a new career in Sports Therapy. A growing interest in rehabilitation and postural issues then led to certification as a STOTT Pilates instructor.</p>
     <p>Today, Natasha combines advanced soft-tissue techniques with precise Pilates exercise to provide professional, personal care for injuries, postural concerns and long-term movement goals.</p>`,
  )}
  <section class="qualification-section"><div class="section-shell">
    <header class="section-intro" data-reveal><p class="section-kicker">Qualifications & training</p><h2>Recognised education.<br><em>Continued application.</em></h2></header>
    <ol class="credential-list">
      <li data-reveal><span>01</span><h3>LSSM Diploma in Sport & Remedial Massage</h3></li>
      <li data-reveal><span>02</span><h3>BTEC Level 5 Professional Diploma in Clinical Sport & Remedial Massage</h3></li>
      <li data-reveal><span>03</span><h3>VTCT Level 3 Diploma in Anatomy, Physiology and Pathology</h3></li>
      <li data-reveal><span>04</span><h3>Certified STOTT Pilates Instructor, Level 3</h3></li>
    </ol>
  </div></section>
  ${band("The NJH approach", "What guides every session", [
    "Listen before deciding",
    "Assess the whole movement, not only the sore spot",
    "Explain the plan in clear language",
    "Adapt treatment as your body and confidence change",
  ])}${cta("Start a conversation with Natasha.")}`,
);

const retreats = page(
  {
    title: "Pilates Retreats",
    description:
      "Past NJH Pilates retreats and how to register interest in future retreat dates.",
    eyebrow: "Pilates retreats",
    title: "Time to move,<br><em>rest and reset.</em>",
    intro:
      "NJH retreats have brought Pilates into calm, restorative settings in the UK and Italy.",
    parent: crumbs.pilates,
  },
  `${section(
    "Retreat experiences",
    "Space for unhurried practice.",
    `<p>Previous NJH retreats have combined attentive Pilates with time away from everyday routines, including events at Brooklands Barn and in Italy.</p>
     <p>The dates shown on the former website were for past events and are no longer presented as current availability. Contact Natasha if you would like to register interest in any future retreat.</p>`,
  )}
  ${band("A retreat can offer", "Time away, thoughtfully used", [
    "Longer, unhurried movement sessions",
    "A calm setting away from daily demands",
    "Individual attention within a shared experience",
    "Time to rest and reconnect with your practice",
  ])}${cta(
    "Interested in a future retreat?",
    "Send Natasha a note to register your interest and hear about any new dates.",
  )}`,
);

const workplaceMassage = page(
  {
    title: "Workplace Sports Massage",
    description:
      "On-site Sports Therapy massage appointments for offices and workplace teams.",
    eyebrow: "Workplace massage",
    title: "Treatment that fits<br><em>the working day.</em>",
    intro:
      "Private, on-site soft-tissue appointments for organisations that want to make practical wellbeing support easier to access.",
    parent: crumbs.therapy,
  },
  `${section(
    "On-site appointments",
    "Personal care in the workplace.",
    `<p>Busy schedules can make it difficult to attend a clinic. Where suitable, NJH can provide treatments in a private meeting room or another quiet, appropriate space within the workplace.</p>
     <p>Sessions can help employees address muscular tension or existing concerns without a separate journey during the working day. Availability, room requirements, timings and fees are agreed with the organisation in advance.</p>`,
  )}
  ${cards(
    [
      {
        title: "Private",
        text: "Appointments take place in a quiet, appropriate room supplied by the workplace.",
        icon: "hands",
      },
      {
        title: "Convenient",
        text: "A practical format designed around the working day and agreed appointment slots.",
        icon: "control",
      },
      {
        title: "Tailored",
        text: "Treatment remains individual and assessment-led, even within a workplace programme.",
        icon: "assess",
      },
    ],
    "editorial-cards--contained",
  )}${cta(
    "Discuss workplace appointments.",
    "Share your team size, location and preferred format so Natasha can advise what is practical.",
  )}`,
);

const prices = page(
  {
    title: "Prices | NJH",
    description:
      "Current NJH Sports Therapy and Pilates appointment prices.",
    eyebrow: "Prices",
    title: "Clear pricing.<br><em>Personal care.</em>",
    intro:
      "Appointment length is chosen around your needs. New or complex presentations may benefit from more assessment time.",
    parent: crumbs.contact,
  },
  `<section class="pricing-section"><div class="section-shell pricing-grid">
    <article data-reveal><p class="section-kicker">Sports Therapy</p><h2>Treatment</h2>
      <div class="price-row"><span>Up to 90 minutes</span><strong>£130</strong></div>
      <div class="price-row"><span>Standard session, up to 1 hour</span><strong>£85</strong></div>
      <div class="price-row"><span>Up to 30 minutes</span><strong>£60</strong></div>
      <small>Sunday and Bank Holiday appointments carry a £10 surcharge.</small>
    </article>
    <article data-reveal><p class="section-kicker">Pilates</p><h2>Movement</h2>
      <div class="price-row"><span>One-to-one, 1 hour</span><strong>£85</strong></div>
      <div class="price-row"><span>Duet, shared with a friend or partner</span><strong>£95</strong></div>
      <div class="price-row"><span>Initial assessment before small group</span><strong>£85</strong></div>
      <div class="price-row"><span>Small-group session</span><strong>£21</strong></div>
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

const contact = page(
  {
    title: "Contact NJH Sports Therapy & Pilates",
    description:
      "Contact Natasha Hadland to discuss Sports Therapy or Pilates appointments.",
    eyebrow: "Contact",
    title: "Tell us how you would<br><em>like to move.</em>",
    intro:
      "Share what you would like help with. Natasha will suggest the most suitable place to start.",
    tone: "dark",
  },
  `<section class="contact-page"><div class="section-shell contact-page__grid">
    <aside data-reveal>
      <p class="section-kicker">Contact Natasha</p>
      <h2>A personal reply,<br>without the jargon.</h2>
      <dl>
        <div><dt>Telephone</dt><dd><a href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></dd></div>
        <div><dt>Locations</dt><dd><a href="/clinics">Studham & Berkhamsted</a></dd></div>
      </dl>
      <p class="contact-page__note">Please do not use this form for urgent medical help. Contact NHS 111 or emergency services where appropriate.</p>
    </aside>
    <form class="enquiry-form" data-enquiry-form novalidate data-reveal>
      <div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required><span class="form-error">Please enter your name.</span></div>
      <div class="form-field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="form-error">Please enter a valid email.</span></div>
      <div class="form-field"><label for="phone">Phone <small>optional</small></label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="form-field form-field--full"><label for="service">What can we help with?</label><select id="service" name="service" required><option value="">Choose a service</option><option>Sports Therapy</option><option>Individual Pilates</option><option>Small-group Pilates</option><option>Pre/Postnatal Pilates</option><option>Other / not sure</option></select><span class="form-error">Please choose an option.</span></div>
      <div class="form-field"><label for="location">Preferred location</label><select id="location" name="location"><option>No preference</option><option>Studham</option><option>Berkhamsted</option></select></div>
      <div class="form-field"><label for="contact-method">Preferred reply</label><select id="contact-method" name="preferredContact"><option>Email</option><option>Phone</option></select></div>
      <div class="form-field form-field--full"><label for="message">Message</label><textarea id="message" name="message" rows="6" required></textarea><span class="form-error">Please tell us briefly how we can help.</span></div>
      <div class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
      <input type="hidden" name="_subject" value="New NJH website enquiry">
      <div class="form-field form-field--full form-consent"><label><input type="checkbox" name="consent" required><span>I agree that NJH may use these details to respond to my enquiry.</span></label><span class="form-error">Please confirm before sending.</span></div>
      <div class="form-submit form-field--full"><button type="submit">Send enquiry <span>↗</span></button><p data-form-status role="status" aria-live="polite"></p></div>
    </form>
  </div></section>`,
);

const routes = {
  "/pilates": pilatesHub,
  "/blank-1": studio,
  "/small-group-pilates-timetable": timetable,
  "/individual-pilates": individual,
  "/pilates-for-golfers": golfers,
  "/blank": natal,
  "/clinic-policies": policies,
  "/clinics": clinics,
  "/links": partnerLinks,
  "/charity-work": charity,
  "/testimonial": testimonials,
  "/what-is-what-are-the-benifits": therapyHub,
  "/treatment": treatment,
  "/myofascial-release": fascia,
  "/what-to-expect": expect,
  "/kinesiology-taping": taping,
  "/about": about,
  "/retreats": retreats,
  "/office-based-sports-massage": workplaceMassage,
  "/prices": prices,
  "/price-list": { ...prices, canonical: "/prices" },
  "/contact": contact,
};

function navigationMarkup(path) {
  return navGroups
    .map((group) => {
      const current =
        path === group.href || group.links.some(([, href]) => path === href);
      if (!group.links.length) {
        return `<a href="${group.href}"${current ? ' aria-current="page"' : ""}>${group.label}</a>`;
      }
      return `<div class="nav-group${current ? " is-current" : ""}">
        <div class="nav-group__top">
          <a href="${group.href}"${path === group.href ? ' aria-current="page"' : ""}>${group.label}</a>
          <button type="button" aria-expanded="false" aria-label="Open ${group.label} menu"><span></span></button>
        </div>
        <div class="nav-group__menu">
          ${group.links.map(([label, href]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        </div>
      </div>`;
    })
    .join("");
}

function updateMetadata(route, path) {
  const plainTitle = route?.title
    ?.replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "");
  document.title = plainTitle
    ? plainTitle.startsWith("NJH ")
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

function hydrateShell(path) {
  const navigation = document.querySelector(".site-nav");
  if (navigation) navigation.innerHTML = navigationMarkup(path);

  const footerGrid = document.querySelector(".site-footer__grid");
  if (footerGrid) {
    footerGrid.innerHTML = `<a class="wordmark site-footer__wordmark" href="/" aria-label="NJH home">
      <span class="wordmark__name">NJH</span><span class="wordmark__descriptor">Sports Therapy<br>& Pilates</span>
    </a>
    <div><p class="site-footer__label">Treatment</p><a href="/what-is-what-are-the-benifits">Sports Therapy</a><a href="/treatment">Techniques</a><a href="/what-to-expect">Your appointment</a></div>
    <div><p class="site-footer__label">Movement</p><a href="/pilates">Clinical Pilates</a><a href="/small-group-pilates-timetable">Timetable</a><a href="/prices">Prices</a></div>
    <div><p class="site-footer__label">Practice</p><a href="/about">About Natasha</a><a href="/clinics">Locations</a><a href="/testimonial">Testimonials</a><a href="/contact">Contact</a></div>`;
  }
  const footerBottom = document.querySelector(".site-footer__bottom");
  if (footerBottom) {
    footerBottom.innerHTML =
      "<p>© 2026 NJH Sports Therapy & Pilates</p><p>Website information does not replace individual medical advice.</p>";
  }
}

export function renderRoute() {
  const path = escapePath(window.location.pathname);
  const route = routes[path];
  if (path === "/") {
    return { path, isHome: true };
  }

  hydrateShell(path);
  const main = document.querySelector("main");
  if (route && main) {
    main.innerHTML = route.html;
    document.body.classList.add("is-inner-page");
    document.body.dataset.heroTone = route.tone || "light";
    updateMetadata(route, path);
    return { path, isHome: false, route };
  }

  if (main) {
    main.innerHTML = `${hero({
      eyebrow: "Page not found",
      title: "This path has<br><em>moved.</em>",
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
