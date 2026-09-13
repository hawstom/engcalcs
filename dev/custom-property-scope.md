# The custom property on an `lpn_` element

Tom's own specification, 2026-09-12, recorded verbatim in substance because it is a DESIGN and not a
wish. ROADMAP Task 636 is the one-line pointer at this file. Phase 1 shipped 2026-09-13 and his eleven
numbered revisions of it the same day; both are folded into the statements below rather than
appended to them.

## Where it lives

A **Custom properties** heading under `Settings > Assets`, beside ID prefixes and Defaults.

## The design table, and the form that is not it

**THE SETTINGS PANE SHOWS THE DESIGN; A POPUP EDITS IT** (Tom, 2026-09-13, confirming his own
original specification: *"the Custom Property design form must be a popup and ... the Settings pane
can show only truncated forms of the design except for the key. I now confirm that
specification."*). Phase 1 put ten live controls in every pane row and he read it back as the wrong
shape: a row that editable is a form pretending to be a table, and it can be neither wide enough to
type in nor narrow enough to read twenty of.

So the pane is a SUMMARY, one row per property, reading across: Key, Label, Applies to, Validate as,
Allow or refuse, Restrict characters, Fewest characters, Most characters, Low limit, High limit,
then Edit and Remove.

- **Truncation is the stylesheet's, never a `slice()` in code.** A heading cut to three letters is
  cut in ENGLISH, and "Val" is the first three letters of nothing a Turkish or Hindi reader would
  recognise. One ellipsis rule truncates every language in its own words.
- **The key is the one column with no limit on it**, because the key is the identity the row is
  filed under, and it is his stated exception.
- **Headings are back** (his revision 3, reversing phase 1's no-headings alternative), each carrying
  a tip, and **every column tip leads with the name of its own column** (revision 4) because the
  heading above it is the abbreviation.
- **The popup stages nothing and has no OK.** Each control commits on `change`, as every other row
  of the Settings box does; Close only closes.
- **Add and remove like demand categories**, and Add opens the form on the new row: a blank row in a
  summary table says nothing about what the user has just been given.

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
