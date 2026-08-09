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

export const REVIEWS = [
  {
    name: "Penny",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "I call Natasha my miracle worker. Not only has she released the muscles in my neck and shoulders so I no longer ache constantly, but she has also given me regained movement in my foot following a severely ruptured tendon.",
  },
  {
    name: "Sarah",
    services: [SPORTS_THERAPY, PILATES],
    quote:
      "After almost 3 months of weekly classes and 3 sports therapy sessions I am amazed at the range of pain free movement I now have.",
  },
  {
    name: "Laura",
    services: [SPORTS_THERAPY],
    quote:
      "Her treatment hugely helped my long standing shoulder injury, increasing my range and ease of movement. I am now able to work better in the gym and play tennis without pain.",
  },
  {
    name: "Tessa",
    services: [PILATES],
    quote:
      "I come away feeling taller, stronger and straighter, sometimes I even have to adjust my rear-view mirror before driving off after a session to accommodate my new found height!",
  },
  {
    name: "Kim",
    services: [SPORTS_THERAPY, PILATES],
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
   *   - Wording is the reviewer's. Spelling and punctuation are corrected to
   *     UK house style and "Pilates" is capitalised; nothing is rewritten.
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
      "What a fantastic Pilates teacher Natasha is. I was a Pilates novice when I first started, and Natasha has been the best teacher I could have asked for. She has watched every movement to ensure I am doing the moves correctly. Nothing is too much trouble, and I have noticed significant improvement in my posture and the aches and pains I would have received daily before. I would highly recommend Natasha. Thank you so much.",
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
    name: "Nadia",
    services: [PILATES],
    quote:
      "Natasha has been amazing. Before starting Pilates I struggled a lot with my core strength and balance. I had a one on one session with Natasha and had tons of really helpful advice. She helped me understand the imbalances in my muscles and how to gain strength and prevent injury. I started Pilates 4 months ago and I can already see and feel a huge difference. Natasha is always kind and welcoming and makes sure that you are doing everything correctly, and creates a really safe and positive environment. Since starting Pilates, I have improved massively in my sport and have been selected for Team GB U17. I would thoroughly recommend Pilates with Natasha to any sports person as it has made a real difference to my performance.",
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
      "I went to Natasha because she specialises in postpartum Pilates. Natasha was fantastic and guided me through specific Pilates exercises to help with my diastasis recti problem that occurred through pregnancy. She knew the very specific movements that would draw my stomach muscles back together (some exercises can make it worse). She was very gentle and patient with me and helped build up my core strength and ability. Thank you Natasha, I no longer suffer from diastasis recti and have my waistline back!",
  },
  /* Posted under the Google handle "MrMEC 1", which is not a name. Same
     situation as the two above, and the same fix: a first name from NJH. */
  {
    name: "Pilates client",
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
