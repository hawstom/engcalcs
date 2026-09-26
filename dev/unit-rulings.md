# Unit rulings — full record

Moved verbatim out of `CLAUDE.md` on 2026-09-23 when that file was compacted. CLAUDE.md keeps the
short rule and points here; this file keeps the reasoning, the quotes and the measurements.

## Unit Sets

A field declares a **named unit family**, never an inline array:

```php
Array('name' => 'd', 'type' => 'number', 'default' => '6', 'units' => 'distance_small', ...)
```

Families live in `lib/Units.lib.php` (`$ec_unit_families`); the two presets, `us` and `si`, map every
family to one unit (`$ec_unit_sets`). `EC_DEFAULT_UNIT_SET` picks what a first-time visitor sees:
US customary only for an English page in a browser whose Accept-Language region is the United
States, SI for every other tag, for a bare `en` and for every other language (`ecDefaultUnitSet()`,
decided on the measured preset clicks and the Search Console countries, 2026-09-08). A request with
no header keeps US for English so the harnesses render what they were anchored on. **The option
order inside a family is a measurement too** -- the unit people switch TO comes first, from the
`units` signal rows; re-measure before re-sorting. Returning visitors are unaffected — the cookie stores each select's option
value, which **is the unit's NAME** (`ft`), never its factor. Conversion factors (`$ec_units`) are
"number of that unit per SI unit": multiply to display, divide to store, and JS reaches one only
through `EngCalcs.unitFactor()`, a lookup on that name. Full rationale: `dev/unit-families.md`.

- **Split a family when two fields want different *defaults*, not different *options*.**
  `distance_small` and `distance_large` offer the identical four units and exist purely to carry
  different defaults (inches for a pipe diameter, feet for a pipe length). Merging them re-creates the
  original defect, where a 1,000 ft main rendered as 12,000 in. Where two families share a list, share
  the PHP variable rather than duplicating it.
- **Which family a field names is a per-page choice**, not a global property of the field name — the
  same concept is `distance_small` on a pipe page and `distance_large` on a channel page. There is no
  page-level override mechanism because the page already chooses.
- **Every family must appear in every preset.** A missing entry silently leaves that field alone.
- **A page's `default` number is in the *displayed* unit**, so a unit-bearing field declares one per
  preset: `'default' => Array('us' => '6', 'si' => '150')`. A scalar is correct only when the value is
  unit-independent. Getting this wrong is silent — a scalar `6` reads as 6 in under `us` and 6 mm
  under `si`. A page seeding sample rows from JS must seed per preset too, keying off
  `EngCalcs.defaultUnitSet`.
- **Keep one page's cross-section geometry in one family.** A pipe page reads diameter, depth, top
  width, wetted perimeter and hydraulic radius all in inches. Mixing them (an 18 in pipe reporting
  `T` = 1.5 ft) is the defect to avoid.
- **Choose defaults that open on a *passing* design.** A page that greets a first-time visitor with a
  warning is worse than one that greets them with a worked example. Verify by running the page's own
  `pageCalculator` against its rendered HTML, not by inspection.
- **`echoUnitSelect()` still accepts a raw array** for backward compatibility, but such a select gets
  no family and is therefore **invisible to the preset buttons**. Never leave a new one that way — 32
  row-table selects were nearly shipped ignoring the presets.

### ONLY THE USER TOUCHES A FILE'S NUMBERS (Tom, 2026-08-16 — absolute)

**A number that came from a file is the user's. We display it, we solve from a COPY, and we write
back exactly what came in.** We never rewrite it, and never round it, in the document.

This is the same rule as "a calculator stores what the user typed", extended to imported files —
and the `.inp` importer was precisely the third conversion site that rule warns about. It stored
every value as `toDisplay(<SI>, <unit>)` after `js/lpn-inp.js` had already normalised to SI, so a
US file made a round trip through two factors that are not exact inverses: **710 ft was stored as
709.9913664 and 150 gpm as 149.98747841154.**

- **Better constants do NOT fix this and it is a mistake to try.** Exact factors still fail in
  doubles — `150 * 0.3048 * (1/0.3048) === 149.99999999999997`, and 26% of a 20,000-value sample
  failed to round-trip bit-identically. **Pass-through is the only fix:** when the display unit
  already equals the unit the file states, the file's own number goes straight through untouched.
- **A unit is a LABEL and a MAGNITUDE, and they have different requirements.** The label is a
  string — always storable and displayable verbatim. The magnitude is a factor, and only a *solve*
  needs it. So an unrecognized unit has three outcomes, and the third is the one to get right:
  recognized → display and solve; unrecognized but never computed with → carry it verbatim, no
  problem; **unrecognized and needed for a solve → open the file, draw it faithfully, refuse to
  solve, and say exactly which unit and why.** Never reject the file, never guess. "We don't
  recognize this unit" is a different message from "we cannot give you answers"; say both.
- **The one legitimate exception is the coordinate origin shift**, and it shows the shape a real
  exception must have: `doc.origin` makes coordinates local so float32 rasterising cannot lose a
  pipe at x ≈ 579,350 (Task 354) or a node at longitude −122 (Task 439). The absolute position is
  unchanged **by construction**, and `dev/lpn-spike/local-origin-harness.js` counts the call sites.
  Reversible, recoverable and guarded — anything claiming to be an exception must be all three.
  - **The two kinds recover the origin differently, and only one stores it.** An XY grid stores
    `origin` in the file. A GEOGRAPHIC document does not: it stores absolute longitude and latitude,
    states `origin` as `{0, 0}`, and DERIVES the frame at load from its own extent, floored onto a
    **1/128° power-of-two grid** so `(x − ox) + ox === x` exactly. Because the file already looked
    like that, the format did not move — no v11, no migration.
  - **Exactness needs nearness to the ORIGIN, not a small model**, which is the trap: an origin on
    the 1/128° grid can sit a degree from a coordinate that is itself a hair from zero, so Sterbenz
    does not save you. Both axes therefore carry the file's own value beside the drawn one
    (`_xsrc`/`_ysrc`), believed only while the drawn number is still the one derived from it.
- **Converting to SOLVE is not an exception**, because it does not touch the document.
- **THE INPUT FILE IS CANONICAL, so nothing of ours can validate it.** Our conversion factors cannot
  check a user's numbers — the only correct property is that they come back out unchanged. Phrasing
  like "verify the examples still hold against the corrected factors" has the relationship backwards
  and is the misunderstanding to watch for.
- **Preserve the TOKEN, not the value.** `parseFloat()` at the point of reading a file throws away
  the text, and no downstream code can reconstruct it: `710.0` can only ever come back as `710`,
  and `1.50` as `1.5`. Keep the exact characters beside the parsed number at the one place text
  becomes number, and store the token.
- **The rule that makes this structural rather than a discipline: a number the user supplied and a
  number we computed are different kinds of thing, and must never occupy the same field.** Once
  they are separate there is no code path that writes to the user's field, so nobody has to
  remember anything. Full design: ROADMAP Task 390 and `dev/unit-paradigm-migration.md`, which maps what of
  the old SI-always paradigm is still un-purged.
- **This is testable and must be tested: import then export is BYTE-IDENTICAL for every value the
  user did not edit.** Not "within tolerance" — identical. That is also the acceptance criterion for
  Task 281 (`.inp` export) — met, and guarded by `dev/lpn-spike/inp-export-harness.js`.

### Coordinate order: system is x,y = lon,lat; PUBLIC is lat,lon

Tom, 2026-08-24, having found a button saying `lon/lat` and a status bar leading with Longitude:
*"It should be lat/lon everywhere... history says Lat/Lon."* **The order follows whoever is
reading.**

- **System order — lon, lat.** x is longitude, y is latitude. Arithmetic, GeoJSON, every projection
  formula. Everything computed, stored, projected or exported. Name such a pair `lonLat` /
  `{lon, lat}`.
- **Public order — lat, lon.** Every place a person reads a pair or types one: the status readout,
  the property popup, the Go-to prompt, prose that names the two. Name such a pair `latLon`.
- **A bare `coords` or `point` is the defect** — it commits to neither, so the next reader guesses.
- **The one longitude-first sentence is the one that PAIRS them with x and y** ("the x and y in this
  file really are a longitude and a latitude"): there the order IS the claim, and reversing it makes
  the sentence false. Three shipped strings do this and are correct.

`coord_order_check.php` enforces both halves and knows the exception; it is blocking, and it catches
the two defects that produced the rule.

### Changing a unit reinterprets the typed number; it does not convert it

1 becomes 1 ft instead of 1 m. Long-standing, deliberate, reviewed and kept. Do not "fix" it.
**This is absolute**, and `lpn_` was the one place that broke it — it stored SI and displayed the
conversion, so every unit switch silently rewrote the whole map. Tom: *"a bad design decision was
made without my knowledge to convert inputs when units are switched. Scrub and ban this."* EPANET
behaves the same way we do, so there is no authority on the other side.

**A calculator stores what the user typed. Conversion happens at the solver, and on results coming
back from it, and nowhere else.** If a third conversion site seems necessary, the design is wrong.

### `lpn_` only: a setting belongs to the PROJECT or to the BROWSER, never to both

**A new project gets the hard-coded defaults, always. If you want otherwise, save a template or copy
a project. Window furniture is not project data and follows the browser.** (Tom, 2026-09-04, closing
Task 584 — his own position, adopted verbatim.)

- **MODELLING data belongs to the PROJECT** and rides in `serializeProject()`: units, friction
  method, new-asset defaults, ID prefixes, colouring, labels, quality. A project records its own
  unit selection and restores it on open, because declarative storage makes a bare number
  meaningless without them — that is this rule stated for its hardest case, and there is
  therefore **no per-browser unit cookie for this page**.
- **FURNITURE belongs to the BROWSER** and is a `localStorage` sibling key that
  `serializeProject()` must never learn about: `lpn_pane`, `lpn_rpane`, `lpn_setbox`,
  `lpn_findbox`, and since 2026-09-08 `lpn_ffbox`, `lpn_energybox`, `lpn_cmpbox`, `lpn_reportbox`. Where a box sits and how wide a pane is is a fact about the SCREEN somebody is
  sitting at, and a colleague opening the file on a laptop must not inherit a 32-inch layout.
  **So opening a project does NOT open its windows as saved, and must not learn to** — furniture
  is already where you left it, across every project, which is why the gap that name suggests
  answers itself.
- **NEVER a "save current settings as default" button.** It creates an invisible global that makes
  two people see different behaviour from the same document, and it can never be inspected, shared
  or versioned. A template is a FILE — visible, nameable, copyable, emailable, diffable. It is the
  same argument this suite already makes about input files. `openNewProjectBox()` states it at the
  one place it would be tempting.
- The hard-coded HW default for the friction method (2026-09-03) is this rule working, not an
  exception to it. Detail, the legacy-document conversion path, and the one case the code does not
  yet meet: `dev/looped-network-calculator-scope.md`.

---

