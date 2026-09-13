# Custom properties on `lpn_` elements

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

## Open, and to be decided before building

- A custom property is MODELLING data, so it rides in `serializeProject()` (CLAUDE.md's
  project-versus-browser rule). The DEFINITIONS and the per-element VALUES are both the project's.
- An `.inp` export has nowhere to put one. EPANET's format has no user-defined attribute, so the
  honest answers are a `;`-comment convention or a reported loss -- never a silent drop
  (CLAUDE.md's import/export rule).
- Validation runs on ENTRY. Nothing decides yet what happens to a value that was legal when it was
  typed and is not after its design is edited.
