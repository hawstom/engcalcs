# The custom property on an `lpn_` element

Tom's own specification, 2026-09-12, recorded verbatim in substance because it is a DESIGN and not a
wish. ROADMAP Task 636 is the one-line pointer at this file. Phases 1 and 2 shipped 2026-09-13 and his
eleven numbered revisions of them the same day; all of it is folded into the statements below
rather than appended to them.

## Where it lives

A **Custom properties** heading under `Settings > Assets`, beside ID prefixes and Defaults.

## One line per property, with an expander

**KEY ON LINE ONE, EVERY OTHER DESIGN FIELD UNDER AN EXPANDER** (Tom, 2026-09-13, his own third
option: *"each custom property lists only key on line 1 with an expander to show all other design
fields below it on one line each"*). He offered it beside the popup and asked which fits; the
answer was measured rather than preferred, and it is this one.

**WHAT THE TABLE AND THE POPUP ACTUALLY DID, in Chromium.** The twelve-column summary needed 721 px
for its heading row before a single property was designed, against a Settings content pane of
410 px at the shipped box width on a 1200 px screen and 202 px at 360 px. So the pane scrolled
sideways by 319 px on a PC and 527 px on a phone -- and `dev/browser-pass/specs/labelcols.js` has
asserted since Task 435 that it never does, so that spec was RED the moment a heading row existed.
Worse on the reading side than on the arithmetic: scrolling right to reach the high limit scrolled
the KEY out of view, and the key is the one column deliberately left unabbreviated because it is
the identity the row is filed under. The popup was no better on a phone -- `#lpn_dialog` is 50vw
capped at 360 px, so at 360 px the design form was 180 px wide with a 4 px label column and
2,661 px of content inside a 444 px scroller.

So the pane is now, per property:

- **Line one: the key, in full, and Remove.** Remove is not a design field and does not belong
  under the expander; and removing a property whose key you can already read should not cost
  opening it first. A design with no key yet says so (`lpn_cp_unnamed`), because a blank line is
  indistinguishable from a rendering fault.
- **Under the expander: Key, Label, Applies to, Validate as, Allow or refuse, Restrict characters,
  Fewest characters, Most characters, Low limit, High limit** -- one `.lpn-set-row` each. Key is a
  field as well as the heading because renaming has to live somewhere and a heading is not a text
  box.
- **Nothing is truncated any more, and that is the gain.** A `.lpn-set-row` already collapses to
  one column under the container query at 24rem, so a design field inherits the phone layout that
  was written once for every other row in this box. The old ellipsis rule existed to keep a slice
  from being made in ENGLISH, and not slicing at all is the better answer to the same problem.
- **Every control commits on `change`**, as every other row of the Settings box does. There is no
  OK and nothing is staged -- which is also what the popup broke: it was the only control in the
  whole box that left the box to be edited. **And a commit does NOT rebuild the Settings box**:
  `change` fires on BLUR, so rebuilding would destroy the field just left and the nine after it
  while the browser was moving focus into the next one, and ten fields in a row is exactly where
  somebody tabs. Line one's key text is written in place instead. The ID prefix rows beside this
  one have always committed with `saveToStorage()` alone, for the same reason.
- **Whether a design is open is FURNITURE and is stored nowhere** -- not in `serializeProject()`,
  not in `localStorage`. It lives in `cpOpenKeys` for the life of the page, so that the rebuilds
  that DO happen -- Add and Remove, which change the structure -- put the reader back where they
  were.
- **Add appends a blank design and opens it**, for the reason the popup used to open on a new row.

*(Superseded, recorded so it is not rebuilt by habit: the design SUMMARY TABLE with `Edit` and
`Remove` per row, and `openCustomPropDesign()`, both shipped in phase 2. `lpn_cp_edit_tip` and
`lpn_cp_edit_title` went with them.)*

## Validation

- **Do not validate** -- and `Text` is GONE (revision 7: *"I suppose that the Text validation type
  was really 'Do not validate'. We can remove it. It has no other useful meaning since everything is
  text."*). A document that still states `text` validates as nothing, which is what it always did.
- **Number . and Number ,** (revision 11). Two numeric types told apart by the decimal mark, which
  is this page's answer to regionalization: the separator is SHOWN rather than named, so the option
  reads the same in all 27 languages. The other mark is refused rather than ignored, because a
  `Number ,` design that quietly took `1.5` would read one and a half where the region means one
  thousand five hundred. Low and high limits are read with the same mark. **No Positive type**: his
  own observation is that *"the validator with a refusal of '-' can do 'Positive' also"*.
- **Integer.**
- **Date and time** (revision 6), ONE type and deliberately permissive: *"we simply say 'Date and
  time' and then we internally do our magic to flag any values that do not look to us like any
  possible date and time expression."* It is not a parser and must not become one -- a date is
  written a dozen ways across 27 languages, and a rule tight enough to pick one of them flags four
  hundred correct entries in somebody else's region. So the question asked is the negative one: no
  digit at all, a character no date or time expression uses, or digits with nothing date-shaped or
  time-shaped about them. **THE DOOR LEFT OPEN AND NOT BUILT:** his own next step if this proves too
  loose is to expose the rules as validation regular expressions in Settings, below Design. Nothing
  should harden until he asks for that, because a stricter default and a regexp box answer the same
  complaint and only one of them is his.
- **The case rules**: ALL CAPS, camelCase, PascalCase, snake_case, hyphen-case. **English only
  initially**, which is a stated limit and not an oversight: a case rule is an assertion about an
  alphabet.
- **Restrict characters** -- an allow/refuse set where `@` is any letter and `#` any digit, and
  everything else is listed literally. Kept because it is already a decent rudimentary validator for
  saying "we do not do slashes" (revision 6b).
- **White space must be MID-STRING** (revision 10), and his reason is the user's satisfaction rather
  than ours: a leading or trailing space is invisible on screen and turns up later as two values
  that look identical and sort apart. Held INSIDE the character restriction, because that is where
  the tip states it and because a property nobody restricted is one whose owner has asked us to have
  no opinion about its text.
- **Fewest characters and Most characters** (revision 9: *"Good for dates and datetimes and finding
  empty or partial entries."*). The minimum FLAGS a short value and never pads it. A blank is still
  not a failure, because a blank says the asset states nothing.
- **Low value limit and High value limit.**

## Reach

**Every applicable custom property appears everywhere an ordinary property does**: the Properties
box, multi-element properties, Find and replace, the Tables pane, and Graphs. A custom property that
reaches only the popup is a field nobody can report on, which is most of why one is created.

## Tom's rulings, 2026-09-13

All nine were put to him as a brief and answered. **These are decisions, not notes.**

- **EVERYTHING IS OVERRIDABLE BY A SCENARIO** -- no per-property column, no distinction. His words:
  *"Are we trying to be control freaks? No! Let the people do the things! Why not allow overriding
  anything and everything once we have the system?"* **And the brief that asked the question was
  WRONG on its own example**: it said diameter was not overridable, and `LPN_OVERRIDABLE` has always
  read `link: { diameter: true, roughness: true, k: true, status: true, length: true, ... }`. The
  genuine non-overridable is a junction's ELEVATION, which is survey data. So the "what was built
  versus what a scenario asks" line is real but far narrower than the brief implied, and a
  user-defined property has no business being sorted by it at all.
- **`.inp` carries a comment we read back**, e.g. `;@key=value`. Same answer he gave the projection
  brief for a CRS, which is what keeps one convention rather than two.
- **UNITLESS, and the reason is the useful part**: *"we aren't trying to interpret it. EPANET gave us
  the perfect example with Chemical; it doesn't matter."* EPANET's chemical concentration carries a
  user-typed unit NAME that the engine never computes with, and that is exactly the right shape here.
- **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED, NEVER CLEARED OR REFUSED** -- highlighted red or
  yellow in place. **And he turned the question into a feature:** *"this could be a beautiful
  exploration tool. You change the constraints just to do a bit of data entry error checking."* So
  validation is a QUERY as much as a gate: tighten a limit to find the outliers, then loosen it
  again. Build it so that is cheap and reversible.
- **THE KEY IS NAMESPACED** -- `user.`, `user_` or `custom_` -- so a collision with a built-in field
  is impossible by construction rather than refused by a list that would go stale.
- **Text objects are included.** *"Why not? If we are building it, what's the harm?"*
- **VALIDATION ITSELF IS A CHOICE, which the original spec did not have.** His three options:
  (1) don't validate, (2) validate with what is there, (3) contact the developers for more options or
  a language pack. So `Validate as` gains a "Don't validate" entry, and a value a rule cannot judge
  is refused WITH AN EXPLANATION rather than passed silently -- the escape is choosing not to
  validate, not the rule quietly giving up.
- **No cap; columns are opt-in per view** -- and he wants that regardless: *"The tables need to get
  more and more full-featured, and Choose and drag columns are two of the ways."* That makes column
  selection its own piece of work, not a side effect of this one.
- **Find and replace WRITES a custom property**, through `pushSpecList()`, with validation on every
  bulk-written value.

## Still open after the rulings

- A custom property is MODELLING data, so it rides in `serializeProject()` (CLAUDE.md's
  project-versus-browser rule). The DEFINITIONS and the per-element VALUES are both the project's.
- **The comment convention needs writing down before it is written out.** `;@key=value` is the
  shape, not the spec: where it sits relative to the element's own row, what escapes a `=` or a
  newline in a text value, and what an importer does with a key whose definition the file does not
  carry. Decide it once, in `js/lpn-inp.js`, which is the one file with an opinion about the format.
- **Overridable-everything meets the curve rule at one point.** A scenario overrides WHICH curve a
  pump states, never what a curve contains (Task 586). If a custom property ever holds a reference
  rather than a value, the same line applies -- the reference is the scenario's, the referent is the
  document's.
