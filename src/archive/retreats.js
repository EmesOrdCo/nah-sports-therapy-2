/* ARCHIVED — not imported, not built, not rendered.
 *
 * Retreat content was pulled from the live site in August 2026. Kept here so it
 * can be restored if NJH runs retreats again, rather than being recovered from
 * git history.
 *
 * To restore, put each block back where the header comment says, then:
 *   - re-add ["Pilates retreats", "/pilates#retreats"] to the Pilates navGroup
 *     in site-content.js;
 *   - repoint "/retreats" to "retreats" in pilatesLegacyTargets (site-content.js)
 *     and legacyPilatesSections (main.js);
 *   - restore /retreats  /pilates#retreats  301 in public/_redirects.
 *
 * The poster images are still in public/images/legacy/ (retreat-arundel.jpeg,
 * retreat-italy.jpeg) and the source copy is still in legacy-content.js under
 * "/retreats" — that entry is inert because "/retreats" remains a key in
 * pilatesLegacyTargets, which suppresses the legacy page builder.
 */

/* ---------------------------------------------------------------------------
 * 1. Standalone retreats page.
 *    Was src/site-content.js, defined alongside the other page() consts.
 *    Note: this const was already unreferenced — no route ever pointed at it.
 *    Depends on the page(), section(), band() and cta() helpers.
 * ------------------------------------------------------------------------ */
export const retreats = page(
  {
    title: "Pilates Retreats",
    description:
      "Past NJH Pilates retreats and how to register interest in future retreat dates.",
    eyebrow: "Pilates retreats",
    title: "Pilates retreats",
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

/* ---------------------------------------------------------------------------
 * 2. "Retreats archive" section from the continuous /pilates page.
 *    Was src/site-content.js, between the #practical and #contact sections.
 *    Depends on the legacyImage() helper.
 * ------------------------------------------------------------------------ */
export const retreatsSection = `
      <section class="pilates-retreats" id="retreats" aria-labelledby="retreats-title">
        <div class="section-shell">
          <header class="pilates-section-heading pilates-section-heading--split" data-reveal>
            <h2 id="retreats-title">Retreats archive</h2>
            <p>Previous NJH Pilates retreats in Sussex and Italy. These events took place in 2020 and 2021 and are shown as part of the NJH archive.</p>
          </header>
          <div class="pilates-retreats__grid">
            <article data-reveal>
              <figure>${'${legacyImage("/retreats", 0)}'}</figure>
              <span>Arundel · January 2020</span>
              <h3>Brooklands Barn, Sussex</h3>
              <p>A restored 19th-century barn with an indoor pool, outdoor barrel sauna, Pilates studio and treatment rooms. The retreat included two nights, meals and four Small Group Pilates sessions.</p>
            </article>
            <article data-reveal>
              <figure>${'${legacyImage("/retreats", 1)}'}</figure>
              <span>Casperia · June 2021</span>
              <h3>Forani Palace, Italy</h3>
              <p>A 15th-century palazzo with daily Small Group Pilates, an outdoor pool, indoor cave studio and outdoor Pilates platform.</p>
            </article>
          </div>
        </div>
      </section>
`;
