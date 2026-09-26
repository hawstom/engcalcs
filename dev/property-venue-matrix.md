# The property/venue matrix (ROADMAP Task 708)

Tom, 2026-09-22, testing Task 705: *"Show at all zoom levels does not appear for Text in
multi-properties. Should we do an audit to ensure that all properties are represented in all
venues?"* Yes. This is that audit.

**Read this alongside `dev/scripts/property_venue_check.php`** (which holds the one slice a script
can check) and `dev/scripts/table_column_parity_check.php` (Task 690, which already ratchets the
Popup/Table/Multi triple to zero gaps). This document is the wider audit those two scripts cannot
be; it exists so a future property addition can be checked against a written list rather than
against whichever venues the author happened to think of.

## Venues, and how each was derived

| Venue | How derived |
|---|---|
| **Properties box, single element** | Mechanically, via `table_column_parity_check.php`'s own walk of `renderNodeFields()` / `renderLinkFields()` / `renderLabelFields()` (junction, reservoir, tank, pipe, pump, valve, text). Read by hand for Customer, which has its own popup renderer outside that walk. |
| **Properties box, multi-select** | Mechanically identical to the Tables pane: `multiGroups()` (`js/looped-network.js:45075`) derives its sections from `paneTables()`, so a property absent from a table spec is absent from multi-properties by construction (confirmed by reading `multiGroups()` and `multiRow()`). |
| **Tables pane** | Mechanically, via `table_column_parity_check.php`'s walk of `buildPaneTables()` and its `paneCol*` helpers. |
| **Find** | Read by hand from `findPropDefs()` (`js/looped-network.js:15627`), and mechanically for the one slice `property_venue_check.php` holds (an editable Tables-pane column vs. `findPropDefs()`'s key list, by GROUP -- node/link/customer/text -- not by specific type). |
| **Replace** | Read by hand from `pushSpecList()` (`js/looped-network.js:4725`), `replaceExtraSpecs()` and `customerReplaceSpecs()` (`js/looped-network.js:17517`, `17577`). Not held by any script yet. |
| **Settings symbology (colour by property)** | Read by hand from `COLOR_NODE_FIELDS` / `COLOR_LINK_FIELDS` (`js/looped-network.js:7304`). Not held by any script yet. |
| **Labels (map field printing)** | Read by hand from `nodeFieldDefs()`, `linkFieldDefs()`, `customerFieldDefs()` (`js/looped-network.js:35687`, `35706`, `35746`), and the Text object's own popup fields (Text prints its own words; it is not "labelled" by another field). |
| **`.inp` export** | Read by hand from `js/lpn-inp.js`'s section writers (`[JUNCTIONS]`, `[RESERVOIRS]`, `[TANKS]`, `[PIPES]`, `[PUMPS]`, `[VALVES]`, `[DEMANDS]`, `[STATUS]`, `[TAGS]`, `[REACTIONS]`, `[QUALITY]`, `[SOURCES]`, `[MIXING]`, `[ENERGY]`, `[CURVES]`, `[LABELS]`). |

**Legend:** ✓ present · — absent, no reason found (a candidate gap) · n/a *(reason)* not applicable
by design.

---

## Junction

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a *(identity, not a value to overwrite)* | n/a *(not a quantity)* | ✓ | `[JUNCTIONS]`/`[TAGS]` |
| Coordinates (x, y) | ✓ | — | — | n/a | n/a *(the coordinate IS the position)* | `[COORDINATES]` |
| Active / included | ✓ | — | — | n/a *(boolean, not a colour ramp)* | n/a | n/a *(a scenario concept; Base is always active)* |
| Elevation | ✓ | ✓ | ✓ | ✓ | ✓ | `[JUNCTIONS]` |
| Base demand | ✓ | ✓ | ✓ | ✓ | ✓ | `[JUNCTIONS]`/`[DEMANDS]` |
| Resolved demand (result) | ✓ | n/a *(result)* | n/a *(result)* | ✓ | ✓ | n/a *(computed, not stored)* |
| Demand category description | ✓ | — *(junction only, gated)* | n/a *(a list entry, not a scalar)* | n/a | n/a | `[DEMANDS]` (as a pattern name) |
| Required fire flow | ✓ | ✓ *(junction only)* | ✓ | — | n/a *(design input, not a map quantity)* | n/a *(this suite's own concept, no EPANET section)* |
| Emitter coefficient | ✓ | ✓ *(Task 708)* | ✓ *(Task 708, own `set` -- not `prop` -- so the two-unit conversion runs)* | — | n/a | `[EMITTERS]` |
| Head (result) | ✓ | ✓ | n/a *(result)* | ✓ | ✓ | n/a *(computed)* |
| Pressure (result) | ✓ | ✓ | n/a *(result)* | ✓ | ✓ | n/a *(computed)* |
| Initial quality | ✓ | ✓ *(chemical mode)* | n/a *(not in `pushSpecList`)* | ✓ | ✓ *(chemical mode)* | `[QUALITY]` |
| Source type / quality / pattern | ✓ | — | — | n/a *(categorical / not a colour quantity)* | n/a | `[SOURCES]` |
| Water age / quality (result) | ✓ | ✓ | n/a *(result)* | ✓ | ✓ | n/a *(computed)* |

## Reservoir

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a | n/a | ✓ | `[RESERVOIRS]`/`[TAGS]` |
| Coordinates | ✓ | — | — | n/a | n/a | `[COORDINATES]` |
| Active / included | ✓ | — | — | n/a | n/a | n/a |
| Elevation | ✓ | ✓ *(shared node band)* | ✓ | ✓ | ✓ | `[RESERVOIRS]` (ground reference only; head is the stored number) |
| Head | ✓ | n/a *(no reservoir-specific Find row)* | — | ✓ *(via `head`)* | ✓ | `[RESERVOIRS]` |
| Head pattern | ✓ | — | — | n/a *(a pattern reference, not a number)* | n/a | `[RESERVOIRS]` |
| Pressure (result) | ✓ | ✓ | n/a | ✓ | ✓ | n/a |
| Initial quality | ✓ | ✓ *(chemical mode)* | — | ✓ | ✓ | `[QUALITY]` |
| Source type / quality / pattern | ✓ | — | — | n/a | n/a | `[SOURCES]` |
| Water age / quality (result) | ✓ | ✓ | n/a | ✓ | ✓ | n/a |

## Tank

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a | n/a | ✓ | `[TANKS]`/`[TAGS]` |
| Coordinates | ✓ | — | — | n/a | n/a | `[COORDINATES]` |
| Active / included | ✓ | — | — | n/a | n/a | n/a |
| Elevation | ✓ | ✓ *(shared node band)* | ✓ | ✓ | ✓ | `[TANKS]` |
| Level (current) | ✓ | ✓ *(Task 708)* | ✓ *(Task 708, overridable, `prop: 'level'`)* | — | ✓ *(Task 696, 2026-09-25)* | `[TANKS]` (`InitLvl`) |
| Min / max level | ✓ | ✓ *(Task 708)* | ✓ *(Task 708, base-owned)* | — | — | `[TANKS]` |
| Tank diameter | ✓ | ✓ *(Task 708)* | ✓ *(Task 708, base-owned)* | — | — | `[TANKS]` |
| Mixing model / fraction | ✓ | ✓ *(Task 708, the internal EPANET tokens, via the new `choices` door in `replaceValueOf()`)* | ✓ *(Task 708)* | n/a *(categorical)* | n/a | `[MIXING]` |
| Reaction coefficient (tank) | ✓ | n/a *(no per-type Find row; see pipe's pair for the pattern)* | — | n/a | n/a | `[REACTIONS]` |
| Water surface (result) | ✓ | n/a | n/a | n/a | ✓ | n/a *(computed; `[TANKS]`'s `InitLvl` is the input)* |
| Initial quality | ✓ | ✓ *(chemical mode)* | — | ✓ | ✓ | `[QUALITY]` |
| Source type / quality / pattern | ✓ | — | — | n/a | n/a | `[SOURCES]` |
| Water age / quality (result) | ✓ | ✓ | n/a | ✓ | ✓ | n/a |

## Pipe

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a | n/a | ✓ | `[PIPES]`/`[TAGS]` |
| Endpoints | ✓ | n/a *(a connectivity fact, asked through the "Connection" row instead)* | n/a | n/a | ✓ | `[PIPES]` |
| Active / Closed | ✓ | ✓ *(Task 708, internal key `status`, labelled `lpn_field_closed`/"Closed"; the table's own `closed` checkbox key is a declared exemption in `property_venue_check.php`)* | ✓ *(Task 708, a `<select>` of the translated Open/Closed words, `choices: ['open','closed']` underneath)* | n/a *(boolean)* | ✓ *(Status)* | `[STATUS]` |
| Pipe type | ✓ | n/a *(a type reference; a type's stated diameter/roughness are what Find offers)* | n/a | n/a *(categorical)* | n/a | n/a *(this suite's own concept; exports the resolved diameter/roughness)* |
| Diameter | ✓ | ✓ | ✓ | ✓ | ✓ | `[PIPES]` |
| Length | ✓ | ✓ *(`FIND_EXTRA_LINK_FIELDS`)* | ✓ *(Task 708, own `set` -- not `prop` -- so `lenAuto` is cleared in Base, matching the table's own cell)* | n/a *(declared not colourable, `FIND_EXTRA_LINK_FIELDS`'s own comment)* | ✓ | `[PIPES]` |
| Roughness | ✓ | ✓ *(`FIND_EXTRA_LINK_FIELDS`)* | ✓ | ✓ | ✓ | `[PIPES]` |
| Minor loss, k | ✓ | ✓ *(`FIND_EXTRA_LINK_FIELDS`)* | ✓ | n/a *(declared not colourable)* | ✓ | `[PIPES]` |
| Fittings list | ✓ | n/a *(a list; its total is the k column above)* | n/a | n/a | n/a | n/a *(this suite's own concept; exports the resolved k)* |
| Bulk / wall reaction coefficient | ✓ | ✓ *(`FIND_EXTRA_LINK_FIELDS`, chemical mode)* | ✓ | n/a *(declared not colourable)* | n/a *(no map label carries it; Task 566's own note)* | `[REACTIONS]` |
| Flow, velocity, head loss, gradient (results) | ✓ | ✓ | n/a | ✓ | ✓ | n/a *(computed)* |
| Friction factor, status, quality, reaction rate (results) | ✓ | n/a *(no Find row for these four)* | n/a | ✓ *(friction, status, rate)* | ✓ | n/a *(computed)* |

## Pump

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a | n/a | ✓ | `[PUMPS]`/`[TAGS]` |
| Endpoints | ✓ | n/a | n/a | n/a | ✓ | `[PUMPS]` |
| Active / Closed | ✓ | ✓ *(Task 708, as `status`, the same declared exemption as the pipe's row)* | ✓ *(Task 708)* | n/a | ✓ | `[STATUS]` |
| Pump curve reference | ✓ | n/a *(a curve is a document object, Library-edited, per `dev/lpn-rulings.md`)* | n/a | n/a | n/a | `[PUMPS]`/`[CURVES]` |
| Relative speed | ✓ | ✓ *(Task 708)* | ✓ *(Task 708, base-owned, the same 1-if-blank/zero/negative rule the table cell uses)* | — | — | `[PUMPS]` |
| Speed pattern | ✓ | — | — | n/a | n/a | `[PUMPS]` |
| Efficiency curve reference | ✓ | n/a *(curve object)* | n/a | n/a | n/a | `[ENERGY]`/`[CURVES]` |
| Energy price / pattern | ✓ | ✓ *(Task 708)* | ✓ *(Task 708; the pattern is an id, `str`-flagged and validated against the pattern library, the same shape as a customer's demand pattern)* | — | n/a | `[ENERGY]` |
| Flow, head loss (results) | ✓ | ✓ | n/a | ✓ | ✓ | n/a *(computed)* |

## Valve

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a | n/a | ✓ | `[VALVES]`/`[TAGS]` |
| Endpoints | ✓ | n/a | n/a | n/a | ✓ | `[VALVES]` |
| Active / Closed | ✓ | ✓ *(Task 708, as `status`, the same declared exemption as the pipe's row)* | ✓ *(Task 708)* | n/a | ✓ | `[STATUS]` |
| Valve type | ✓ | n/a *(categorical)* | n/a | n/a | ✓ | `[VALVES]` |
| Setting | ✓ | n/a *(no shared unit across types; `EC_TABLE_PARITY_EXEMPT`'s own reason)* | ✓ *(exempt from the popup-side check by kind, see `lpn_field_valve_setting_*`)* | n/a | ✓ | `[VALVES]` |
| Diameter | ✓ | ✓ *(shared link band)* | ✓ *(TCV only, per `pushSpecList`'s own comment)* | ✓ | ✓ | `[VALVES]` |
| Minor loss, k | ✓ | ✓ *(TCV only, `lpn_field_km` states the rule)* | ✓ | n/a | ✓ | `[VALVES]`/`[STATUS]` |
| Head-loss curve reference (GPV) | ✓ | n/a *(curve object)* | n/a | n/a | n/a | `[VALVES]`/`[CURVES]` |
| Flow, velocity, head loss, gradient (results) | ✓ | ✓ | n/a | ✓ | ✓ | n/a *(computed)* |

## Text

| Property | Popup | Multi-properties | Tables | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|---|---|
| ID | n/a *(a Text has no id reachable from any screen -- `findPropDefs()`'s own comment, Task quoting Tom 2026-08-29)* | n/a | ✓ *(a display key only)* | n/a | n/a | n/a | n/a | n/a |
| Words (the text itself) | ✓ | ✓ | ✓ | ✓ | n/a *(no Replace row; see ranking)* | n/a | n/a *(it IS the label)* | `[LABELS]` |
| Size multiplier | ✓ | ✓ | ✓ | ✓ | — | n/a | n/a | n/a *(`[LABELS]` carries no size column)* |
| Bold | ✓ | ✓ | ✓ | — | — | n/a | n/a | n/a |
| Rotation | ✓ | ✓ | ✓ | — | — | n/a | n/a | n/a |
| Align / valign | ✓ | ✓ | ✓ | — | — | n/a | n/a | n/a *(position is exported; the alignment rule is not)* |
| **Show at all zoom levels** | ✓ | ✓ *(R-174, closed)* | ✓ *(R-174, closed)* | ✓ *(R-174, closed; matched on the numeric 1/0 vocabulary `sizeMult` already used)* | ✓ *(R-174, closed, base-write like size)* | — | n/a | n/a |
| Attached (leader) | ✓ | ✓ | ✓ *(the align/valign columns state the rule instead, per `EC_TABLE_PARITY_EXEMPT`)* | n/a | n/a | n/a | n/a | `[LABELS]` (anchor node/link) |

## Customer

Customers are this suite's own concept layered on a node or pipe (a "meter"); EPANET's `.inp`
format has no section for one at all, so the whole `.inp` column below is n/a by design.

| Property | Popup | Multi-properties | Tables | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|---|---|
| ID | ✓ | ? *(not read; Customer's popup is outside `table_column_parity_check.php`'s walk)* | ✓ | n/a *(no screen shows it, same rule as Text)* | n/a | n/a | ✓ | n/a |
| Description, tag | ✓ | ? | ✓ | ✓ | ✓ | n/a | ✓ | n/a |
| Connected asset | ✓ | ? | ✓ | ✓ | n/a *(read-only, derived from placement)* | n/a | n/a | n/a |
| Demand per service | ✓ | ? | ✓ | ✓ | ✓ | n/a | ✓ | n/a |
| Number of services | ✓ | ? | ✓ | ✓ | ✓ | n/a | ✓ | n/a |
| Total demand (result) | ✓ | ? | ✓ | ✓ | n/a *(result)* | n/a | n/a *(see the note in `customerFieldDefs()`: no separate map label)* | n/a |
| Added to node (result) | ✓ | ? | ✓ | ✓ | n/a *(result)* | n/a | n/a | n/a |
| Station along the pipe | ✓ | ? | ✓ | ✓ | ✓ | n/a | n/a | n/a |
| Offset from the pipe | ✓ | ? | ✓ | ✓ | ✓ | n/a | n/a | n/a |

---

## Ranked gaps: which a visitor would plausibly hit

**1. CLOSED.** Text: "Show at all zoom levels" (Tom's own report) shipped with `feat/zoom-scale-rules`
(R-174), which has merged. It rides `sizeMult`'s existing numeric vocabulary in Find (`equal to 1`
finds a note kept on past the threshold) and has its own base-write spec in `labelReplaceSpecs()`
for Replace.

**2. CLOSED (Task 708).** A closed/inactive pipe, pump or valve is now findable and replaceable
under a new Find/Replace property, internally `status` (`'open'`/`'closed'`, matched
case-insensitively through the new `choices` door in `replaceValueOf()`). It reads and writes the
same `effective(l, 'status')` / `setProp(l, 'status', ...)` seam the table's own `closed` checkbox
does (`paneColClosed()`), under Find's own KEY for it rather than the checkbox's inverted one --
`property_venue_check.php` declares `pipe/closed`, `pump/closed` and `valve/closed` as exemptions
for exactly that key-name mismatch. **Labelled `lpn_field_closed` ("Closed"), not `lpn_result_status`
("Status")** -- pre-review fix: that word already names a different, run-dependent concept
elsewhere on this page (the post-solve/EPS status the colour ramp and the Labels legend show), and
using it here too would put "Status" on two different questions in one panel.

**3. CLOSED (Task 708).** Emitter coefficient (junction) is now findable and replaceable. Its own
`pushSpecList()` entry has no `prop` and goes through `emitterToDisplay()`/`emitterToStore()`
directly in a custom `set`, because `replaceWrite()` calls `setProp()` straight through for any
spec carrying a `prop` -- which would have stored the displayed number raw and skipped the one
two-unit conversion on this page.

**4. CLOSED (Task 708).** Tank level, min/max level, diameter, and mixing model/fraction all have
Find and Replace rows now, gated to `d.type === 'tank'` in `findPropDefs()` exactly as the fire
flow pair is gated to a junction. Mixing model is matched through the same `choices` door as
`status`, against EPANET's own four tokens (`MIXED`/`2COMP`/`FIFO`/`LIFO`), never translated --
the CODE is never translated and never has to be, because nobody now types it (see below).

**A pre-review fix to 2 and 4: a choice property is picked from a `<select>`, never typed.** Tom's
pre-reviewer caught what the first pass of 2 and 4 missed: `status` and `mixingModel` were given
the ordinary text box every other Find/Replace property uses, so a Spanish reader had to type the
English word `cerrado` to find a closed pipe, and a matched row printed the English word `closed`
straight back regardless of the page's language -- and the same failure for `mixingModel`'s four
EPANET tokens. `findChoiceDefs(prop)` is now the one list of `[code, translated label]` pairs a
choice property offers (reusing existing keys throughout: `lpn_result_status_open`/`_closed` for
`status`, and `mixingModel`'s own `paneColMixingModel().choices()` -- the popup's and the table's
own four words, read rather than copied); `findPropIsChoice()`/`renderFindControls()` and
`buildReplaceForm()` render it as a `<select>` in place of the text box, and `findResultRow()`
prints the translated word for a matched value instead of the stored code. The codes themselves
stay English EPANET tokens, unseen and untyped, exactly as a curve's kind is.

**5. CLOSED (Task 708).** Pump relative speed and energy price/pattern are now findable and
replaceable. Speed is base-owned (not in `LPN_OVERRIDABLE`), so its spec carries no `prop` and
writes bare, with the same "blank/zero/negative means 1" rule `paneColPumpSpeed()` states. The
price pattern is an id rather than a quantity, `str`-flagged and validated against
`libPatternsRead()` before it is written, the same shape `customerReplaceSpecs()`'s `custPattern`
already uses.

**6. CLOSED (Task 708).** Length is now writable through Replace as well as findable. Its
`pushSpecList()` entry also has no `prop`: a Base-side write must clear `lenAuto` the way the
table's own length cell does, or the next geometry pass silently re-derives the length from the
drawing and throws the typed value away. Inside a scenario `lenAuto` is never consulted, so
`setProp()` alone is correct there.

**A guard closing gaps 2-6 exposed, fixed alongside them.** "Settings > New assets > Apply these
new-asset values to every existing asset" used to assume every `pushSpecList()` entry with a
map-label toggle also had a `defaultRow()`-seeded `settings.defaults` entry -- true for every
property already in the list. `length` and `status` are shown on the map by default option and
have neither, so without a second gate at that button's own filter, turning either label on and
pressing the button would have pushed `undefined` onto every pipe. Fixed at the one call site
(`pushSpecs.filter(...)`, the "New assets" push in `js/looped-network.js`), not in
`pushFieldShown()` itself, which the scenario push still uses unguarded and correctly (it discards
overrides rather than reading `settings.defaults`).

**7. Coordinates (x, y) are not offered in Find, while a Customer's Station and Offset -- also
positions -- were added to Find on Tom's own request (2026-09-19: *"Bad decision. Put them in."*).**
The asymmetry may be a real distinction (an absolute map coordinate is a different kind of question
than a relative position along a pipe) or may be the same gap under a different name. Ranked lower
because nobody has reported hitting it.

**8. A Text's words have no Replace row**, though every other identity-like property (description,
tag) does. Ranked low: a Text's words are closer to a description than to a design variable, and
Find already supports `contains` on it, which is most of what a bulk edit on free text would need
anyway.

**9. Correct by design, listed so nobody re-proposes them:** results (head, pressure, flow,
velocity, head loss, gradient, friction factor, status text, reaction rate, water age, resolved
demand) are rightly absent from Replace and from `.inp` export -- they are computed, not stored.
Curve references (pump, efficiency, GPV head-loss) are rightly absent from Find and Replace --
`dev/lpn-rulings.md` states a curve is a document object edited only in the Library. Fittings
lists and pipe types are rightly absent from Find/Replace/Symbology/Labels -- they are this
suite's own concepts that resolve to the diameter/roughness/k columns Find already offers, and
offering the raw list would be a second, disagreeing way to ask the same question. A valve's
Setting correctly carries no unit anywhere outside the popup, because the quantity it names is
different per valve type (`EC_TABLE_PARITY_EXEMPT`'s own stated reason).

## What this audit did not reach

- **Customer's Multi-properties venue** is marked `?` throughout: Customer is not one of the three
  render functions `table_column_parity_check.php` walks, so its popup-to-table parity has never
  been mechanically checked, and this audit did not hand-verify it either. A follow-up worth doing
  before ranking any Customer gap further.
- **Per-type Find gating below the group level** (a Find row genuinely scoped to a tank, a pump or
  a valve rather than to "every node" or "every link") does not exist today, so every "—" for a
  subtype-only property in this matrix is also, definitionally, a statement that Find has no
  subtype-specific band at all yet. That is a design question for Tom, not a per-property defect.
