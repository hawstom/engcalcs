# The custom property on an `lpn_` element

Tom's own specification, 2026-09-12, recorded verbatim in substance because it is a DESIGN and not a
wish. ROADMAP Task 636 is the one-line pointer at this file. Nothing here is built.

## Where it lives

A **Custom properties** heading under `Settings > Assets`, beside ID prefixes and Defaults.

## The design table

Every custom property is one row. The columns are the property's DESIGN, abbreviated hard, because
the point of the table is to read twenty of them at once:

| Column | Truncation |
|---|---|
| Key | none; no spaces allowed |
| Label | truncated |
| Applies to | prefixes only, e.g. `J,L,R` |
| Validate as | three letters |
| Restrict list | three letters |
| Restrict length | three letters |
| Low value limit | none |
| High value limit | none |

**Maybe no column headings at all** -- Tom's own alternative, and it is the better one to try first:
a single heading over the whole block reading *Design*, carrying the column names in its tip. Eight
headings over eight abbreviated cells is more chrome than content.

## Editing

**Add and remove like demand categories; edit in place like a spreadsheet**, for every design
property. Click a cell and it expands to its full length and shows its tip; unfocused it is
truncated and silent.

- **Property key** -- no spaces.
- **Property label** -- what a reader sees.
- **Applies to** -- a multi-selector over the element types (Junction, Reservoir, Tank, Pipe, Pump,
  Valve, Text).
- **Validate entry as** -- Number, Integer, Text, ALL CAPS, CamelCase, pascalCase, snake_case,
  hyphen-case. **English only initially**, which is a stated limit and not an oversight: a case rule
  is an assertion about an alphabet.
- **Restrict text** -- an allowed/disallowed selector over a character set, where `@` stands for
  alpha and `#` for numeric (`@#.-_`, or `'"\`).
- **Restrict text length**.
- **Low value/text limit** and **High value/text limit**.

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
