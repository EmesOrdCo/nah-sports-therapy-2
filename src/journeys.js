/* The written client journeys — /client-stories/journeys.
 *
 * The third side of Client Stories. The films on /client-stories are a minute
 * of somebody talking; the wall on /client-stories/reviews is a quote and a
 * name. This is the thing neither of those gives a visitor who is weighing up
 * whether to book: the shape of a course of treatment, start to now. What they
 * came in with, what changed, and what keeps them coming back once the thing
 * that brought them in has settled.
 *
 * A page rather than a section under the films, and for the reason the films
 * and the wall are two pages rather than one stacked page — see the note above
 * storiesSwitch() in site-content.js. Sitting under the film shelf, this was a
 * screenful of reading that somebody who came to watch had not asked for, and
 * it was unreachable from the wall without going through the films first. On
 * its own URL it can be linked to, and the switch offers it from both of the
 * other two.
 *
 * ---- Three beats, always the same three ----
 *
 * Every card carries the same fields in the same order, and the labels are
 * fixed here rather than written per entry:
 *
 *   injury  — what brought them in. The condition, the injury, the ache they
 *             had stopped noticing. Where it came from, if they said.
 *   helped  — what the work has changed. Concrete: a movement they have back,
 *             a thing they can do again, pain that has gone.
 *   enjoy   — what they get out of the sessions themselves. This is the beat
 *             that stops the section reading as a list of before-and-afters —
 *             somebody deciding whether to walk through the door wants to know
 *             what the hour is actually like.
 *
 * A journey with only two of the three is not a journey, it is a review, and
 * the wall on /client-stories/reviews is where a review goes. If a client only
 * gave you two beats, either go back and ask for the third or put what they
 * said on the wall instead. Do not pad the missing one.
 *
 * ---- Names, and nothing else ----
 *
 * The caption is a first name, on its own, exactly as on the reviews wall —
 * see the rule at the top of reviews.js. No condition tag, no occupation, no
 * duration, no village, and no Sports Therapy / Pilates label: the three beats
 * say which of them it was far better than a chip would.
 *
 * ---- Length ----
 *
 * Two or three sentences a beat. The entries run down one column, so length
 * here is length of page: a paragraph a beat turns three stories into a scroll
 * nobody finishes, and the last name on the list is the one that never gets
 * read. Longer than two or three sentences, it wants to be a film.
 *
 * ---- Consent ----
 *
 * Same standing rule as the films: a named client describing an injury is
 * disclosing health information, and nothing goes here without written,
 * specific consent that can be withdrawn. Withdrawal means deleting the entry.
 * The wording is theirs — tidied for spelling and house style, not rewritten
 * into marketing copy.
 *
 * An empty list renders nothing at all. There is no empty section, no
 * placeholder card and no "coming soon" — and no page either, because the
 * routes table stops offering one. See journeysList() and hasJourneys().
 */

/* ============================================================
   PLACEHOLDER ENTRIES — REPLACE BEFORE THIS SECTION GOES LIVE
   ============================================================

   Not one of these is a client. They carry no name and no quoted words for
   exactly the reason the placeholder films next door do not: a first name over
   an invented account of somebody's injury, on a page headed "client stories",
   is a fabricated testimonial — and it is no less fabricated for everyone in
   the building knowing it is a placeholder, because the visitor reading it
   does not know.

   The text in each slot describes the slot. Swap in real journeys and real
   names together, and delete whatever placeholders are left over rather than
   leaving one real client sitting in a row of specimens. Empty is a state this
   section handles.
   ============================================================ */
export const JOURNEYS = [
  {
    name: "First story",
    injury:
      "Placeholder. What brought this client in goes here — the injury or the condition, how long they had had it, and what it was stopping them doing.",
    helped:
      "Placeholder. What has changed since, in their words: the movement they have back, the pain that has gone, the thing they can do again.",
    enjoy:
      "Placeholder. What they get out of the sessions themselves — the part that keeps them coming once the original problem has settled.",
  },
  {
    name: "Second story",
    injury:
      "Placeholder. What brought this client in goes here — the injury or the condition, how long they had had it, and what it was stopping them doing.",
    helped:
      "Placeholder. What has changed since, in their words: the movement they have back, the pain that has gone, the thing they can do again.",
    enjoy:
      "Placeholder. What they get out of the sessions themselves — the part that keeps them coming once the original problem has settled.",
  },
  {
    name: "Third story",
    injury:
      "Placeholder. What brought this client in goes here — the injury or the condition, how long they had had it, and what it was stopping them doing.",
    helped:
      "Placeholder. What has changed since, in their words: the movement they have back, the pain that has gone, the thing they can do again.",
    enjoy:
      "Placeholder. What they get out of the sessions themselves — the part that keeps them coming once the original problem has settled.",
  },
];

/* The shape a real entry takes:
 *
 *   {
 *     name: "Penny",
 *     injury:
 *       "A severely ruptured tendon in my foot, on top of neck and shoulders that ached constantly.",
 *     helped:
 *       "I have the movement back in the foot, and the ache has gone.",
 *     enjoy:
 *       "Every exercise is set for what my body can do that week, so I never leave feeling I have overdone it.",
 *   },
 */

/* The labels over the three beats. One set, used by every card, so a new entry
   cannot quietly invent a fourth heading or word one of these differently.
   Third person and plural throughout: the card is headed with a name, but
   nobody has told us what pronouns that person uses, and "they" is right for
   every client on the shelf. */
const BEATS = [
  ["injury", "What brought them in"],
  ["helped", "How Pilates has helped"],
  ["enjoy", "What they enjoy"],
];

/* Whether there is a section at all. Same job hasFilms() does for the shelf —
   see the note at the top of this file about empty states. */
export const hasJourneys = () => JOURNEYS.length > 0;

/* A <dl> rather than a stack of headings and paragraphs, because that is what
   this is: three terms, each with its description, repeated to the same shape
   on every entry. Each pair is wrapped in a div — permitted in a dl, and it is
   what lets the pair be one grid row, with the label in the rail and the text
   beside it, rather than the browser's default dt/dd indent. */
const beats = (journey) =>
  BEATS.map(
    ([key, label]) => `<div class="journeys__beat">
            <dt>${label}</dt>
            <dd>${journey[key]}</dd>
          </div>`,
  ).join("\n          ");

/* One entry. A heading, then the three beats — no card around it.
 *
 * The bordered card this started as read as a directory of records: three
 * boxes in a row, each the height of its longest neighbour, none of them
 * inviting reading. These are the longest client wording on the site and they
 * should look like it, so an entry is now set as a spread — the name in the
 * serif at display size, the labels in a rail down the left, the words beside
 * them — and one hairline separates it from the next. Whitespace does the
 * containing that a border was doing.
 *
 * That is a trade, not a free win. A single column runs long: this is right
 * for the three or four stories the page is built for and would want
 * revisiting past ten, where a reader wants to scan rather than read.
 *
 * The name is an h2 and the article is labelled by it. Two things follow, and
 * both matter to somebody who is not looking at the page. The stories join the
 * heading outline, so a screen reader's heading list goes "From first session
 * to now" → "Penny" → "Sarah" and each can be jumped to; the only route
 * through was otherwise reading every word in order. And an <article> with no
 * accessible name announces as an unnamed article — three in a row,
 * indistinguishable.
 *
 * h2 because the page's own title is the h1 above it, and there is nothing
 * between the two. The films next door keep a <p> for their names and are
 * right to: those sit in a <figcaption> under the thing they caption, where a
 * heading would be claiming to open a section that does not exist. */
const entry = (journey, index) =>
  `<article class="journeys__entry" data-reveal aria-labelledby="journey-${index}">
        <h2 class="journeys__name" id="journey-${index}">${journey.name}</h2>
        <dl class="journeys__beats">
          ${beats(journey)}
        </dl>
      </article>`;

/* The body of /client-stories/journeys. No heading of its own: the page head
   above it carries the title, the same way the wall of quotes has no second
   title of its own under "In clients' own words".

   Renders nothing at all from an empty list — and with an empty list there is
   no page either, because the routes table stops offering one. See
   hasJourneys() and the note at the top of this file. */
export function journeysList() {
  if (!hasJourneys()) return "";
  return `<section class="journeys" aria-label="Client journeys">
    <div class="section-shell">
      <div class="journeys__list">
        ${JOURNEYS.map((journey, index) => entry(journey, index)).join("\n        ")}
      </div>
    </div>
  </section>`;
}
