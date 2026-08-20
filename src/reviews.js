/* Single source of truth for client reviews.
 *
 * Reviews are shown in one place — the drifting run of quotes on the home page
 * — and read from here. Add a review once, in the order you want it to appear.
 * The wall of quotes that used to stand on /client-stories/reviews has gone;
 * the run on the home page is what is left of it, and it takes the short ones.
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

/* The headliners: the display pull-quotes at the foot of /client-stories,
 * under the shelf of films and inside their band, as the written voices among
 * the spoken ones — one figure each, in this order. See storyQuote() in
 * site-content.js.
 *
 * Kay's five-year ACL recovery stood here until 20 Aug 2026 and now stands in
 * REVIEWS as an ordinary review — NJH asked for Ava's in its place. Nothing
 * about Kay's words changed in the move; only where they are shown.
 *
 * `paragraphs` rather than `quote`, still: the slot renders an ordered set of
 * paragraphs and grows with the words, so a headliner may be one paragraph or
 * four. A consumer that read `quote` off this would run them into one.
 *
 * Wording is the client's, per the standing rule at the head of the Google
 * block below.
 *
 * Same consent rule as the films and the journeys: a named client describing
 * their sport and their selection is disclosing personal information, and
 * withdrawal means deleting this. */
export const FEATURED_REVIEWS = [
  /* `home` marks the one headliner that also stands on the home page, set the
     same way it is set here — see storyQuotes() in site-content.js. NJH asked
     for Ava's there on 20 Aug 2026. It is a flag on the review rather than an
     index or a name matched in main.js so that the choice lives with the data:
     move the flag and the home page follows, and nothing else has to know. */
  {
    name: "Ava D",
    home: true,
    services: [PILATES],
    paragraphs: [
      "Since starting Pilates, I have improved massively in my sport and have been selected for Team GB U17. I would thoroughly recommend Pilates with Natasha to any sports person as it really benefits me and has made a real difference to my performance.",
    ],
  },
  {
    name: "Zoe",
    services: [PILATES],
    paragraphs: [
      "Natasha has helped me understand the imbalances in my muscles and how to gain strength and prevent injury. I started Pilates 4 months ago and I can already see and feel a huge difference. Natasha is always kind and welcoming and makes sure that you are doing everything correctly and creates a really safe and positive environment.",
    ],
  },
  /* Kay's, back where it was. It headlined this page until 20 Aug 2026, spent
     part of that day in the wall as an ordinary review, and now stands third
     in the run — which is what the `paragraphs` shape was always for: not a
     review of a class but the arc of a five-year recovery, and every paragraph
     of it is set.

     Wording is Kay's, untouched through both moves. Two corrections and
     nothing else, made when it was first transcribed: "getting me knee
     stronger" to "my knee", and the comma in "stronger, more resilient".

     Same consent rule as the films and the journeys: a named client describing
     an injury and a surgery is disclosing health information, and withdrawal
     means deleting this. */
  {
    name: "Kay",
    services: [PILATES],
    paragraphs: [
      "Five years ago I suffered an ACL injury and surgery which completely changed the way I moved and exercised. Recovery wasn't just about getting my knee stronger — it was about rebuilding my confidence and trusting my body again.",
      "Natasha has played a huge role in that journey. She has helped me improve my strength, balance, flexibility and stability, especially around my knee and core. Rather than focusing on high impact movements, Natasha has taught me the importance of control, alignment and moving with purpose.",
      "Five years on, I still include Pilates and more recently chair Pilates in my routine. Chair Pilates has added a new dimension to my exercise routine. It's shown me how to build a stronger, more resilient and healthy body for the future.",
    ],
  },
];

export const REVIEWS = [
  /* The old site's testimonials, restored to their full length on 20 Aug 2026.
   *
   * They stood here cut down — sometimes at both ends, sometimes to a slice out
   * of the middle, and never with an ellipsis to show it. Nothing was invented
   * and no two reviews were ever merged; every word was the client's. But a
   * reader saw what looked like a whole review and was reading a third of one,
   * and the reason was not editorial: the home page's drifting run capped a
   * quote at 190 characters, so the testimonials were trimmed to fit a
   * component. The data was shaped to the design.
   *
   * That cap is gone (see main.js) and these are whole again, checked word for
   * word against the old site's own copy, which survives verbatim in
   * legacy-content.js under "/testimonial". If one of these ever needs to be
   * shorter, the answer is a shorter design, not a shorter review.
   *
   * Corrections are spelling and obvious typos only, which is the whole of the
   * licence this file has: "l started" to "I started" (Sarah), "may ability" to
   * "my ability" and "on going" to "ongoing" (Danny), stray spaces before full
   * stops (Jill), and "Pilates" capitalised as a proper noun throughout. */
  {
    name: "Penny",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "I call Natasha my miracle worker. Not only has she released the muscles in my neck and shoulders so I no longer ache constantly, but she has also given me regained movement in my foot following a severely ruptured tendon. I now attend Natasha's beginners Pilates classes and after only a short time can already feel a real difference in my body.",
  },
  {
    name: "Sarah",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "I started Pilates with Natasha initially because I had a problem with my hip. After almost 3 months of weekly classes and 3 sports therapy sessions I am amazed at the range of pain free movement I now have. I have also been much more aware of my posture since Natasha has identified and corrected this and feel generally much more balanced. My core strength and general mobility is improving with every session. I can thoroughly recommend Natasha's classes and feel so much better since I have been going.",
  },
  {
    name: "Laura",
    services: [SPORTS_THERAPY],
    quote:
      "I came to Natasha with sports injuries both having had operations. Her treatment hugely helped my long standing shoulder injury, increasing my range and ease of movement. I am now able to work better in the gym and play tennis without pain. The myofascia work greatly improved my upper body rotation and released the scar tissue on my ankle. Natasha tailored her treatment very specifically to my injuries with good sound anatomical knowledge.",
  },
  /* One testimonial, not two. This stood here as two entries — "Tessa" and an
     unnamed "Pilates group member" — cut from the same block on the old site,
     under its one attribution ("Tessa, 52, teacher"), and the two cuts even
     overlapped on "I come away feeling taller, stronger and straighter". Put
     back together as the one review it always was. */
  {
    name: "Tessa",
    services: [PILATES],
    quote:
      "I attend Natasha's Pilates group. Natasha is a very thoughtful practitioner. She understands her clients' needs and tailors their Pilates exercises to meet those needs. The classes are small in order that clients can have individual attention. I come away feeling taller, stronger and straighter, sometimes I even have to adjust my rear-view mirror before driving off after a session to accommodate my new found height! I would recommend Natasha to anyone.",
  },
  {
    name: "Kim",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "Natasha was recommended to me by a work colleague because I was suffering from lower back pain that began as occasional episodes but had progressed to more chronic in nature. The problem was preventing me from participating in exercise classes, cycling and making a day at my work desk very uncomfortable. A Sports Therapy appointment for Soft Tissue Release provided some initial relief and my postural analysis highlighted how I could improve my posture. Following this I then embarked on a course of Pilates with Natasha. Having been someone who always preferred tough circuit classes, I was amazed at the improvement in my lower back following my first 6 or so classes. My lower back problems have more or less vanished and I am now comfortable at work and able to undertake other forms of exercise. Needless to say, I am now a Pilates convert and continue to attend classes with Natasha as well as to practice at home some of the exercises she has recommended to me.",
  },
  {
    name: "Nicola",
    services: [PILATES],
    quote:
      "Having never done Pilates before, I was a little nervous of what it might entail. However, the small group size and Natasha's clear instructions very much helped, and I would now find it very difficult to miss my weekly class! My general fitness level has really improved. Natasha is an excellent teacher and I would have no hesitation in recommending her.",
  },
  {
    name: "Danny",
    services: [SPORTS_THERAPY],
    quote:
      "I originally contacted Natasha due to ongoing problems with my calves and hamstrings which was affecting my ability to train for and play recreational sport as the muscles were constantly tight. Natasha quickly diagnosed the problems with my legs and through a variety of massage, fascia, and other innovative sports therapy techniques rectified the injury and reversed the long term underlying problems. This combined with a series of dedicated strengthening, stretching and flexibility exercises has allowed me to train harder than I have been able to for years. Natasha also takes the time to ensure you understand the treatment being performed and its intended outcome. I am pleased to say I am now pain free and I would recommend Natasha to anyone.",
  },
  {
    name: "Tom",
    services: [SPORTS_THERAPY],
    quote:
      "Following a muscle strain across my lower back after a particularly strenuous rowing session, Natasha quickly and expertly assessed my symptoms, looking at how my body functioned as a whole to treat the source of pain. Natasha also gave me some great follow up exercises to strengthen my core and improve my range of movement.",
  },
  {
    name: "Jill",
    services: [PILATES],
    quote:
      "Natasha is the best Pilates teacher I have had over many years — very professional and all exercises are personalised to suit. The facilities are excellent and the classes are very enjoyable.",
  },
  /* Was captioned "Long-standing client", on a note claiming this came across
     with no name attached. It did not: the old site signs it "Kristina, 35,
     Investment banker", which is where the rest of this block came from. */
  {
    name: "Kristina",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "I have been seeing Natasha for three years now and she has been amazing. Her sports therapy sessions have been a life-saver when my back and shoulders were particularly bad and she is one of the most knowledgeable and professional therapists I have ever visited. More recently I have been lucky enough to be trained by Natasha in Pilates (both on a 1-1 basis and in her small group classes) and she is again outstanding. Her attention to detail is second to none and she always manages to suit each exercise to everyone's individual needs, while ensuring proper discipline in the Pilates groundwork. Her classes are challenging but also relaxing in her beautiful new studio. She is remarkably flexible in accommodating makeup classes whenever she can, although we always appreciate that this is her doing us a favour rather than a right! All in all, Natasha is fabulous — my life would be a lot more stressful and painful without the hard work that Natasha has put in to helping me and I can't thank her enough for her efforts",
  },

  /* The five the first import left behind, added 20 Aug 2026. They were on the
     old site's testimonials page all along and simply never came across —
     found when the ten above were checked against legacy-content.js.

     Four of the five are Sports Therapy: the old page filed each testimonial
     under the complaint the client arrived with (asthma, an ankle sprain from
     netball, a basketball player's lower back, a pre-event ride), which is the
     kind of caption this file does not carry — the service label is the only
     categorisation, and the quote says the rest.

     Same correction licence as the block above, spelling and obvious typos
     only: "have help me" to "have helped me" (Rosa), "inparticular" to "in
     particular" (Anne), "has really help me" to "has really helped me" (Bode). */
  {
    name: "Rosa",
    services: [PILATES],
    quote:
      "Since meeting and attending the sessions with Natasha I have found her to be dedicated, professional, understanding and attentive. Her small group classes have helped me to gain an understanding of my medical condition and how best to manage this. All within a brand new studio, new equipment and a peaceful village location.",
  },
  {
    name: "Anne",
    services: [SPORTS_THERAPY],
    quote:
      "I suffer from asthma and my breathing is much improved from Natasha's myofascia treatment in particular.",
  },
  {
    name: "Chevonne",
    services: [SPORTS_THERAPY],
    quote:
      "I could barely put any weight on my foot until Natasha worked on it. The following morning, there was lots more mobility and the swelling was reduced. Circulation had begun to be restored. I followed the rehabilitation exercises Natasha suggested which helped further improve the movement and circulation.",
  },
  {
    name: "Bode",
    services: [SPORTS_THERAPY],
    quote:
      "BIG thank you to Natasha. Being a basketball player there is a lot of wear and tear on the body apart from picking up some knocks and bruises. I had tightness in my lower back and explained the discomfort to Natasha. Over the weeks we went through a series of massages and stretches. In addition she also showed me stretches that could improve my posture in the long term. I very much appreciate her expertise, it has really helped me and my team.",
  },
  {
    name: "Millie",
    services: [SPORTS_THERAPY],
    quote:
      "Thanks to Natasha, the tension from training in my quads and calf muscles was greatly relieved in the sessions we had before I did the major event ride.",
  },

  /* From here down: the Google reviews, in the order Google shows them, at
   * their full length — these are the complete texts from behind Google's
   * "More" link, not the collapsed previews.
   *
   * Three standing rules for anything added here:
   *
   *   - Captions are first names, the same as every review above. The
   *     reviewers post under full names on Google; the wall does not.
   *   - The practice's own replies are not carried across. The card is a quote
   *     and a name, and a reply is a second voice the layout has no place for.
   *   - Wording is the reviewer's, VERBATIM. Not corrected, not tidied, not
   *     topped and tailed. This rule was weaker once — it allowed spelling and
   *     punctuation to be pulled to house style — and under it Katherine's
   *     review acquired an opening sentence ("What a fantastic Pilates teacher
   *     Natasha is.") and Caroline's an inserted clause ("Natasha was fantastic
   *     and guided me through..."), both taken from Google's longer rendering
   *     rather than the copy the practice supplied. Corrected 20 Aug 2026 on
   *     Harry's instruction: where the practice's own copy of a review differs
   *     from Google's, the practice's copy is the one that stands.
   *
   *     The single surviving exception is capitalising "Pilates" as a proper
   *     noun. Two entries below also carry a deliberate editorial change, each
   *     noted at the entry: Kay (FEATURED_REVIEW) and the last Kim.
   *
   *     THE HYPHEN SWEEP DID NOT COME IN HERE. On 20 Aug 2026 Natasha asked for
   *     the hyphens out of the site's compound modifiers — "hands-on" to "hands
   *     on", "soft-tissue" to "soft tissue" — and it ran across every page of
   *     NJH's own copy. Reviews were excluded, because a review is quoted, not
   *     styled: "rear-view", "life-saver", "eye-opening" and "spot-on" all
   *     still stand in the wall, spelt the way the client spelt them. A house
   *     style applies to the house's words. If the two ever look inconsistent
   *     on the page, that is what a quotation looks like, and it is correct.
   */
  {
    name: "David",
    services: [PILATES],
    quote:
      "I came to Pilates later in life (!!), and Natasha gave me a couple of one-to-one lessons to help me get started. This gave me the confidence to join one of her regular classes. It has been a real eye-opening experience — in a very good way — and I've started using muscles that have clearly been dormant for a long time!! Natasha has been incredibly helpful, professional, and encouraging throughout, and I'm really enjoying this new experience. Thanks, Natasha!",
  },
  {
    name: "Isabella",
    services: [PILATES],
    quote:
      "This Pilates group helped me immensely with my mobility, flexibility and my strength. As a newbie to Pilates I initially felt apprehensive about first starting, however Natasha made me feel very welcome in the class and supported my every need. Natasha is very attentive, and makes sure that everyone is comfortable and helps to tailor each movement to each person's individual needs. The workout focuses on mobility, strength and flexibility, and I always leave the studio feeling refreshed. Natasha's Pilates class is something I look forward to each week!",
  },
  {
    name: "Niki",
    services: [PILATES],
    quote:
      "I have been doing Pilates with Natasha for many years. She is an excellent teacher who does one to one and small classes. She is attentive and knowledgeable to your individual needs. I have been up and down with back and hip issues and she has been marvellous with me, helping me to maintain and improve. I would highly recommend her if you're looking to improve flexibility and core strength with a more personal instructor.",
  },
  {
    name: "Sudha",
    services: [PILATES],
    quote:
      "I'm so grateful for Natasha's Pilates classes. Her teaching is clear, patient and incredibly attentive — she notices the small details, offers spot-on corrections, and provides options for every level. Both the group classes and 1-to-1s feel supportive and effective, with a welcoming atmosphere that helps you progress safely. A truly unique instructor who cares about each person in the room.",
  },
  {
    name: "Katherine",
    services: [PILATES],
    quote:
      "I was a Pilates novice when I first started, and Natasha has been the best teacher I could have asked for. She has watched every movement to ensure I am doing the moves correctly. Nothing is too much trouble, and I have noticed significant improvement in my posture and the aches and pains I would have received daily before. I would highly recommend Natasha. Thank you so much.",
  },
  {
    name: "Lotte",
    services: [PILATES],
    quote:
      "Natasha is a fantastic Pilates teacher. The classes are small with a lovely atmosphere — guaranteed to leave feeling physically and mentally improved! I would recommend without hesitation.",
  },
  {
    name: "Julia",
    services: [PILATES],
    quote:
      "Natasha is a wonderful Pilates teacher. She is so calming and is very informative and watchful to make sure you are getting the full benefits from her Pilates classes. Her studio is spotlessly clean and comfortable. I can recommend Natasha's Pilates wholeheartedly.",
  },
  {
    name: "Elizabeth",
    services: [PILATES],
    quote:
      "I've been coming to Natasha's small group Pilates classes for over 5 years and they are fantastic — they have made such a difference and I have never felt fitter! Natasha tailors every lesson to the needs of each of us and, as the classes are so small, can easily focus on how we are doing. I can't recommend her highly enough! Thank you, Natasha.",
  },
  {
    name: "Karen",
    services: [PILATES],
    quote:
      "A fantastic Pilates studio with great equipment that made my 1:1 session fun and challenging. Natasha is incredibly knowledgeable and was able to adapt all the Pilates moves to help improve my body strength and spine stability. A very positive experience indeed.",
  },
  {
    name: "Mark",
    services: [PILATES],
    quote:
      "I have been having Pilates instruction from Natasha for about two years on a 1:1 basis. She is a fantastic instructor: I am constantly challenged by the classes which are varied every week and she is always encouraging and motivating. Highly recommended.",
  },
  {
    name: "India",
    services: [SPORTS_THERAPY],
    quote:
      "Before I saw Natasha I had back and shoulder pain and had seen several professionals but nothing was helping. In a few sessions of deep tissue massages Natasha has been able to release tension in my back and neck and got rid of my pain. Highly recommend!",
  },
  {
    name: "Caroline",
    services: [PILATES],
    quote:
      "I went to Natasha because she specialises in postpartum Pilates. She guided me through specific Pilates exercises to help with my diastasis recti problem that occurred through pregnancy. She knew the very specific movements that would draw my stomach muscles back together (some exercises can make it worse). She was very gentle and patient with me and helped build up my core strength and ability. Thank you Natasha, I no longer suffer from diastasis recti and have my waistline back!",
  },
  /* Posted under the Google handle "MrMEC 1", which is not a name. Same
     situation as the two above, and the same fix: a first name from NJH.
     Stood as "Pilates client" until NJH supplied the name on 20 Aug 2026. */
  {
    name: "Sharon",
    services: [PILATES],
    quote:
      "Natasha takes the greatest care in making sure you are working safely and at the correct level. Natasha's classes are friendly and professional, I would recommend her to anyone who wants small class sizes and personal attention.",
  },
  {
    name: "Eileen",
    services: [PILATES],
    quote:
      "We cannot praise Natasha enough. Her classes are fabulous. We always feel so much better after each class. Everyone gets attention to their individual needs and Natasha's patience knows no bounds. The studio is bright and clean and there is sufficient apparatus for everyone.",
  },
  {
    name: "Rob",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "I have had several soft tissue treatments from Natasha, which have been extremely good in relieving pain and discomfort. I also attend her Pilates classes, where she is very attentive to all our different needs, and I'm feeling the benefit from the exercises.",
  },
  {
    name: "Abbi",
    services: [SPORTS_THERAPY],
    quote:
      "Great appointment today — went in very stiff and after Natasha's treatment feel a whole lot better!",
  },
  {
    name: "Mark",
    services: [SPORTS_THERAPY],
    quote:
      "Massive improvement to my long standing shoulder issue after just one session. Thanks Natasha, fabulous!",
  },
  /* Kim's review closes on Google with "I highly recommend NJH Pilates for
     physio and pilates". That last line is dropped here and should stay
     dropped: NJH is a sports therapy practice, and "physio" is short for a
     title only registered physiotherapists may use. A client can call it what
     they like in their own review; the practice's own site repeating it is a
     different thing. Everything up to that point is hers, untouched. */
  {
    name: "Kim",
    services: [SPORTS_THERAPY],
    quote:
      "I asked Natasha if she could help me as I had upper arm and shoulder pain and discomfort, plus some restricted movement. This occurred after a period of intensive training for my first triathlon. After one session of soft tissue work with Natasha, my full range of movement is back and all pain has gone. I'm very grateful to Natasha for getting me ready to tackle my event in just over a week's time.",
  },
];
