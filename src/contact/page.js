import "./page.css";
import {
  BUSINESS,
  PLACES,
  SERVICES,
  REPLY_OPTIONS,
  REPLY_BY_PHONE,
  WHATSAPP_DOOR,
  WHATSAPP_NOTE,
  REASSURANCE,
  SAFETY_NOTE,
  honeypotAndSubject,
  consentField,
  submitRow,
} from "./content.js";

/* Contact — photographic hero, then the form in three columns.

   The page opens on a treatment photograph with the choice laid over it: a
   filled tile carrying the WhatsApp link and a white one carrying the enquiry,
   side by side, so somebody who only wants to message never has to read past
   it. Under the photograph the ground returns to --navy — the same dark band
   the Sports Therapy page uses and the same navy the footer deepens into — and
   carries the short fields, the message, and the three things a first-time
   client wants to know before they will type anything into a form.

   Nothing is said in new words. Every string is one that was already in
   content.js: the call button's label and number are the first tile, the
   form's heading and the line that sat under the call button are the second,
   and the third column is REASSURANCE, which was written for this page and
   held unused since the first build. The sentence that used to be the
   message box's placeholder is now visible above it — same words, but a hint
   nobody loses the moment they start typing.

   The photograph is the Studham studio itself. */

export const meta = { label: "Two doors", tone: "dark" };

/* NJH's own photograph of the Studham studio (public/images/legacy/
   pilates-studio-3.jpg, re-encoded at 1600 and 800). It replaced a stock
   close-up of a leg massage, which read as a spa rather than a clinic and
   showed hands that were not Natasha's on a page headed "Talk to Natasha".

   This is the room you are getting in touch to come to, which is the one thing
   a contact page can usefully show — and it earns its alt text instead of the
   empty alt an anonymous stock photo had to carry. It suits the frame too: the
   left of the picture is plain wall, so white type sits over it cleanly. */
const HERO = {
  wide: "/images/contact-hero-1600.webp",
  narrow: "/images/contact-hero-800.webp",
  alt: "The NJH studio in Studham, a light, empty room with a wooden floor",
};

/* Stroke glyphs rather than a webfont: four icons is not worth a request, and
   currentColor lets each one take the colour of the tile it sits in.

   No phone glyph any more — the tile it belonged to is a WhatsApp door now
   and takes the speech bubble. A WhatsApp brand mark would be plainer still,
   but it is Meta's asset and every other glyph here is house linework. */
const ICONS = {
  mail: '<path d="M3.2 6.4h17.6v11.2H3.2z"/><path d="m3.6 7 8.4 5.8L20.4 7"/>',
  person:
    '<circle cx="12" cy="8.2" r="3.3"/><path d="M5.6 19.4a6.4 6.4 0 0 1 12.8 0"/>',
  pencil:
    '<path d="m14.9 5.3 3.8 3.8L9.4 18.4l-4.6.8.8-4.6Z"/><path d="m13.2 7 3.8 3.8"/>',
  speech:
    '<path d="M4 5.6h16v9.2h-9.3L6.6 18v-3.2H4Z"/><path d="M8 9.2h8M8 11.8h5"/>',
};

function icon(name) {
  return `<svg class="cv__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}

/* The second tile's heading is the form's accessible name — see the form's
   aria-labelledby. A heading inside a link is valid and keeps the words to a
   single instance; the icon is decorative, the link text carries the meaning. */
function hero() {
  return `<section class="cv__hero">
    <div class="cv__hero-media">
      <img
        src="${HERO.wide}"
        srcset="${HERO.narrow} 800w, ${HERO.wide} 1600w"
        sizes="100vw"
        width="1600"
        height="1200"
        alt="${HERO.alt}"
        loading="eager"
        decoding="async"
      />
    </div>

    <div class="section-shell cv__hero-inner">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><span>Contact</span>
      </nav>
      <h1>Talk to Natasha.</h1>
      <p class="cv__lede">Get in touch to ask a question, discuss what you need or arrange an appointment.</p>

      <div class="cv__doors">
        ${/* One link again. While this tile carried the phone number it also
              carried the WhatsApp sentence, and two links meant it could not
              itself be an anchor — it was a div with the number stretched over
              it by a pseudo-element. With the number gone there is one
              destination, so the tile is a plain link like the one beside it
              and the pseudo-element hack went with it. */ ""}
        <a class="cv__door cv__door--call" href="${WHATSAPP_DOOR.href}" data-reveal>
          <span class="cv__door-icon">${icon("speech")}</span>
          <span class="cv__door-value">${WHATSAPP_DOOR.label}</span>
          <span class="cv__door-note">${WHATSAPP_DOOR.note}</span>
        </a>
        <a class="cv__door cv__door--write" href="#enquiry" data-reveal>
          <span class="cv__door-icon">${icon("mail")}</span>
          <h2 class="cv__door-value" id="enquiry-title">Send an enquiry</h2>
          <span class="cv__door-note">Prefer to write? Use the form.</span>
        </a>
      </div>
    </div>
  </section>`;
}

/* A real <select>, wrapped. initContactSelects() builds the custom control
   around it and hides it; until then — and for anyone without JavaScript —
   this is the native field, so the value still reaches FormData and `required`
   is still enforced by the browser. The wrapper is the only thing added here:
   the enhancement has to have somewhere to put the trigger and the list. */
function selectField({ id, name, label, options, required, error }) {
  return `<div class="form-field">
    <label for="${id}">${label}</label>
    <div class="cv-select" data-select>
      <select id="${id}" name="${name}"${required ? " required" : ""}>${options}</select>
    </div>
    ${error ? `<span class="form-error">${error}</span>` : ""}
  </div>`;
}

function form() {
  return `<form class="enquiry-form cv__form" id="enquiry" aria-labelledby="enquiry-title" data-enquiry-form novalidate data-reveal>
    <div class="cv__fields">
      <div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required><span class="form-error">Please enter your name.</span></div>
      <div class="form-field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="form-error">Please enter a valid email.</span></div>
      ${/* "optional" is true only while the reply is coming by email, so the
            marker is hidden rather than written into the label for good, and
            the field carries an error line it can show when it is not. See
            bindPhoneRequirement(). */ ""}
      <div class="form-field"><label for="phone">Phone <small data-phone-optional>optional</small></label><input id="phone" name="phone" type="tel" autocomplete="tel"><span class="form-error">Please enter a number Natasha can call you on.</span></div>
      ${selectField({
        id: "service",
        name: "service",
        label: "What can we help with?",
        required: true,
        error: "Please choose an option.",
        options: `<option value="">Choose a service</option>${SERVICES.map((s) => `<option value="${s.value}">${s.label}</option>`).join("")}`,
      })}
      ${/* Field names are the labels in the notification email — the provider
            prints the name attribute verbatim — so they read as English rather
            than as camelCase. "name" and "email" stay lowercase and unchanged:
            the reply-to address is picked out of a field called "email", and
            renaming it would quietly cost Natasha the ability to hit reply. */ ""}
      ${selectField({
        id: "contact-method",
        name: "preferred reply",
        label: "Preferred reply",
        options: REPLY_OPTIONS.map((o) => `<option>${o}</option>`).join(""),
      })}
    </div>

    <div class="cv__compose">
      <div class="form-field form-field--full cv__message">
        <label for="message">In your own words</label>
        <p class="cv__hint" id="message-hint">What would you like help with, and how long has it been going on?</p>
        <textarea id="message" name="message" rows="4" required aria-describedby="message-hint"></textarea>
        <span class="form-error">Please tell us briefly how we can help.</span>
      </div>
      ${honeypotAndSubject()}
      ${consentField()}
      ${submitRow()}
    </div>
  </form>`;
}

/* `action` is optional and only the first item carries one — the WhatsApp
   line. The anchor is the two words that say what tapping does, not the whole
   sentence: a link named "For speedy replies during clinic time, please
   WhatsApp directly" is a mouthful in a list of links read out on its own,
   and "WhatsApp directly" is not. */
function assurances() {
  return `<ul class="cv__assurances" data-reveal>
    ${REASSURANCE.map(
      (item, index) => `<li class="cv__assurance">
        <span class="cv__assurance-icon">${icon(["person", "pencil", "speech"][index])}</span>
        <div>
          <h3>${item.heading}</h3>
          <p>${item.body}</p>
          ${
            item.action
              ? `<p class="cv__assurance-action">${item.action.before} <a href="${item.action.href}">${item.action.label}</a>.</p>`
              : ""
          }
        </div>
      </li>`,
    ).join("")}
  </ul>`;
}

/* No Telephone row: the first tile carries the number at the top of the page,
   and printing it twice reads as a mistake. */
function details() {
  return `<div class="cv__details" data-reveal>
    <div class="cv__detail">
      <h3>Email</h3>
      <p class="cv__email">
        <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>
      </p>
    </div>
    <div class="cv__detail">
      <h3>Where</h3>
      <ul class="cv__places">
        ${PLACES.map(
          (place) => `<li>
            <strong>${place.name}</strong>
            <span>${place.lines.join(", ")}</span>
          </li>`,
        ).join("")}
      </ul>
    </div>
    <p class="cv__safety">${SAFETY_NOTE}</p>
  </div>`;
}

export function build() {
  return `
  ${hero()}

  <section class="cv__body">
    <div class="section-shell">
      <div class="cv__body-grid">
        ${form()}
        ${assurances()}
      </div>
      ${details()}
    </div>
  </section>`;
}

/* ---- Custom select ----

   A styled button and a listbox, built over the native <select> rather than
   instead of it. The <select> stays in the form and stays the value: choosing
   an option writes to it and fires `change`, so FormData, `required` and the
   existing submit handler in site-content.js all carry on seeing an ordinary
   form control. Nothing here needs to know that the handler exists.

   Once built, the native field goes display:none, which takes it out of the
   accessibility tree and out of the tab order in one move — no aria-hidden on
   something still focusable. The one thing display:none costs is the shared
   handler's `form.querySelector(":invalid").focus()`, which lands on nothing
   when the missing field is a select; the submit listener at the bottom of
   this file puts that focus on the trigger instead.

   Keyboard follows the APG select-only combobox: focus stays on the button and
   the active option is named by aria-activedescendant, so there is no second
   focus to lose track of. */

const KEY_OPENS = ["Enter", " ", "ArrowDown", "ArrowUp"];

function chevron() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "cv-select__chevron");
  svg.setAttribute("viewBox", "0 0 12 8");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    '<path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
  return svg;
}

function enhanceSelect(wrap, triggerFor) {
  const native = wrap.querySelector("select");
  if (!native) return;

  const field = wrap.closest(".form-field");
  const label = field?.querySelector("label");
  const base = `cv-select-${native.id || native.name}`;
  const triggerId = `${base}-trigger`;
  const listId = `${base}-list`;
  const options = [...native.options];

  const valueText = document.createElement("span");
  valueText.className = "cv-select__value";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.id = triggerId;
  trigger.className = "cv-select__trigger";
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", listId);
  trigger.append(valueText, chevron());

  if (label) {
    label.id = label.id || `${base}-label`;
    // Clicking the label should land on the control the eye is looking at.
    label.htmlFor = triggerId;
    trigger.setAttribute("aria-labelledby", `${label.id} ${triggerId}`);
  }

  const list = document.createElement("ul");
  list.className = "cv-select__list";
  list.id = listId;
  list.hidden = true;
  list.setAttribute("role", "listbox");
  if (label) list.setAttribute("aria-labelledby", label.id);

  const items = options.map((option, index) => {
    const item = document.createElement("li");
    item.id = `${listId}-${index}`;
    item.className = "cv-select__option";
    item.setAttribute("role", "option");
    item.textContent = option.textContent;
    // The empty first entry is a prompt, not a choice — it reads as one.
    if (!option.value) item.classList.add("cv-select__option--empty");
    item.addEventListener("click", () => commit(index));
    list.append(item);
    return item;
  });

  let open = false;
  let active = Math.max(native.selectedIndex, 0);
  let typed = "";
  let typedAt = 0;

  const paint = () => {
    const chosen = options[native.selectedIndex];
    valueText.textContent = chosen ? chosen.textContent : "";
    valueText.classList.toggle(
      "cv-select__value--empty",
      !chosen || !chosen.value,
    );
    items.forEach((item, index) => {
      const selected = index === native.selectedIndex;
      item.setAttribute("aria-selected", String(selected));
      item.classList.toggle("is-selected", selected);
      item.classList.toggle("is-active", open && index === active);
    });
    trigger.setAttribute("aria-activedescendant", open ? items[active].id : "");
  };

  const setActive = (index) => {
    active = Math.min(Math.max(index, 0), items.length - 1);
    paint();
    items[active].scrollIntoView({ block: "nearest" });
  };

  function openList() {
    if (open) return;
    open = true;
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    wrap.classList.add("is-open");
    /* A four-option list near the foot of a phone screen would otherwise open
       into the keyboard. Measured after unhiding, because a hidden list has
       no height to measure. */
    const room =
      window.innerHeight -
      trigger.getBoundingClientRect().bottom -
      list.offsetHeight;
    wrap.classList.toggle("cv-select--up", room < 8);
    setActive(Math.max(native.selectedIndex, 0));
  }

  function closeList({ focus = true } = {}) {
    if (!open) return;
    open = false;
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    wrap.classList.remove("is-open", "cv-select--up");
    paint();
    if (focus) trigger.focus();
  }

  function commit(index) {
    native.selectedIndex = index;
    // The form's own listeners — and any validation styling keyed off the
    // select — should not be able to tell this came from a button.
    native.dispatchEvent(new Event("change", { bubbles: true }));
    closeList();
    paint();
  }

  /* Native selects jump to the option you start typing. Losing that on a
     custom control is the thing people notice first. */
  function typeahead(key) {
    const now = performance.now();
    typed = now - typedAt > 800 ? key : typed + key;
    typedAt = now;
    const from = typed.length === 1 ? active + 1 : active;
    const order = items.map((_, i) => (from + i) % items.length);
    const hit = order.find((i) =>
      items[i].textContent.toLowerCase().startsWith(typed.toLowerCase()),
    );
    if (hit === undefined) return;
    if (open) setActive(hit);
    else commit(hit);
  }

  trigger.addEventListener("click", () => (open ? closeList() : openList()));

  trigger.addEventListener("keydown", (event) => {
    if (!open) {
      if (KEY_OPENS.includes(event.key)) {
        event.preventDefault();
        openList();
        if (event.key === "ArrowUp") setActive(native.selectedIndex - 1);
      } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        typeahead(event.key);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive(active + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive(active - 1);
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(items.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(active);
        break;
      case "Escape":
        event.preventDefault();
        closeList();
        break;
      case "Tab":
        // Tab commits what is highlighted and gets out of the way, the way a
        // native select does. Focus must not come back to the trigger here.
        commit(active);
        closeList({ focus: false });
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          typeahead(event.key);
        }
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (open && !wrap.contains(event.target)) closeList({ focus: false });
  });

  // Anything that sets the value from outside — form.reset() after a
  // successful send, most of all — has to show up on the trigger.
  native.addEventListener("change", paint);

  wrap.append(trigger, list);
  wrap.classList.add("is-enhanced");
  triggerFor.set(native, trigger);
  paint();
}

/* ---- Phone required when the reply is meant to come by phone ----

   The number is optional on a form whose one required contact route is the
   email address — until somebody asks to be rung, at which point an enquiry
   with no number in it is one Natasha cannot answer the way it was asked to
   be answered. Preferred reply now defaults to Phone (see REPLY_OPTIONS), so
   this is the ordinary path through the form rather than a corner of it.

   Done by setting `required` on the native input, which is the whole of it:
   the submit handler in site-content.js validates with form.checkValidity()
   and the stylesheet paints :invalid, so both pick this up with no other
   change. The "optional" marker in the label goes while it is required —
   a field labelled optional that refuses to submit empty is worse than an
   unlabelled one.

   Bound to `change` on the native select, so it hears the enhanced dropdown
   too: commit() writes to the select and dispatches `change`. The same event
   is what carries a form.reset() back here — see the reset handler below,
   which republishes it once the browser has cleared the controls.

   Runs before the early return above it: the requirement is the form's, not
   the custom dropdown's, and it must hold on a page where the enhancement
   never ran. */
function bindPhoneRequirement() {
  const reply = document.querySelector('select[name="preferred reply"]');
  const phone = document.querySelector("#phone");
  if (!reply || !phone) return;

  const optional = document.querySelector("[data-phone-optional]");

  const sync = () => {
    const wanted = reply.value === REPLY_BY_PHONE;
    phone.required = wanted;
    if (optional) optional.hidden = wanted;
  };

  reply.addEventListener("change", sync);
  sync();
}

export function initContactSelects() {
  bindPhoneRequirement();

  const wraps = [...document.querySelectorAll("[data-select]")];
  if (!wraps.length) return;

  const triggerFor = new Map();
  wraps.forEach((wrap) => enhanceSelect(wrap, triggerFor));

  const form = document.querySelector("[data-enquiry-form]");
  if (!form) return;

  /* Registered after the shared submit handler, so this runs second: that one
     has already asked the browser to focus the first invalid field and been
     ignored, because a display:none select cannot take focus. */
  form.addEventListener("submit", () => {
    const trigger = triggerFor.get(form.querySelector(":invalid"));
    if (trigger) trigger.focus();
  });

  /* form.reset() does not fire `change` on the controls it clears, and the
     reset event is dispatched before the clearing happens — so the repaint has
     to be deferred to see it. A microtask is the smallest wait that works:
     reset() is synchronous, so this runs the instant it returns. A frame would
     also do it, until the send completes in a backgrounded tab and rAF stops
     being called. */
  form.addEventListener("reset", () => {
    queueMicrotask(() =>
      triggerFor.forEach((_, native) =>
        native.dispatchEvent(new Event("change", { bubbles: true })),
      ),
    );
  });
}
