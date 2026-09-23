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
| Emitter coefficient | ✓ | — | — | — | n/a | `[EMITTERS]` |
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
| Level (current) | ✓ | — | — | — | — | `[TANKS]` (`InitLvl`) |
| Min / max level | ✓ | — | — | — | — | `[TANKS]` |
| Tank diameter | ✓ | — | — | — | — | `[TANKS]` |
| Mixing model / fraction | ✓ | — | — | n/a *(categorical)* | n/a | `[MIXING]` |
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
| Active / Shut | ✓ | — | — | n/a *(boolean)* | ✓ *(Status)* | `[STATUS]` |
| Pipe type | ✓ | n/a *(a type reference; a type's stated diameter/roughness are what Find offers)* | n/a | n/a *(categorical)* | n/a | n/a *(this suite's own concept; exports the resolved diameter/roughness)* |
| Diameter | ✓ | ✓ | ✓ | ✓ | ✓ | `[PIPES]` |
| Length | ✓ | ✓ *(`FIND_EXTRA_LINK_FIELDS`)* | — | n/a *(declared not colourable, `FIND_EXTRA_LINK_FIELDS`'s own comment)* | ✓ | `[PIPES]` |
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
| Active / Shut | ✓ | — | — | n/a | ✓ | `[STATUS]` |
| Pump curve reference | ✓ | n/a *(a curve is a document object, Library-edited, per `dev/lpn-rulings.md`)* | n/a | n/a | n/a | `[PUMPS]`/`[CURVES]` |
| Relative speed | ✓ | — | — | — | — | `[PUMPS]` |
| Speed pattern | ✓ | — | — | n/a | n/a | `[PUMPS]` |
| Efficiency curve reference | ✓ | n/a *(curve object)* | n/a | n/a | n/a | `[ENERGY]`/`[CURVES]` |
| Energy price / pattern | ✓ | — | — | — | n/a | `[ENERGY]` |
| Flow, head loss (results) | ✓ | ✓ | n/a | ✓ | ✓ | n/a *(computed)* |

## Valve

| Property | Popup / Table / Multi | Find | Replace | Symbology | Labels | `.inp` |
|---|---|---|---|---|---|---|
| ID, tag, description | ✓ | ✓ | tag/desc ✓, ID n/a | n/a | ✓ | `[VALVES]`/`[TAGS]` |
| Endpoints | ✓ | n/a | n/a | n/a | ✓ | `[VALVES]` |
| Active / Shut | ✓ | — | — | n/a | ✓ | `[STATUS]` |
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
| **Show at all zoom levels** | ✓ | **— (in flight on `feat/zoom-scale-rules`, R-174)** | **— (in flight on `feat/zoom-scale-rules`, R-174)** | **— (in flight, per the branch's own scope)** | — | n/a | n/a | n/a |
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

**1. Text: "Show at all zoom levels" absent from Multi-properties, Tables and Find (Tom's own
report).** In flight on the unmerged `feat/zoom-scale-rules` branch (R-174), which
`table_column_parity_check.php`'s `EC_TABLE_PARITY_EXEMPT` already names and refuses to let the
check go green without. Once that branch merges this row disappears from the matrix.

**2. A closed/inactive pipe, pump or valve cannot be found or bulk-replaced.** "Active"/"Shut" is
editable in every asset's own table and printed on the map as Status, but there is no Find row for
it at all, on any element. *"Find every closed valve"* is a plausible question with no answer on
this page today. Ranked high: it is exactly the shape of the gap Tom asked the audit to catch, on
a property every table already carries.

**3. Emitter coefficient (junction) is not findable or replaceable.** It is a per-junction fire
protection input with its own table column and popup row, and Find offers `demandCategory` and
`fireFlow` at the same junction-only gate but skips this one. Plausibly an oversight rather than a
decision -- nothing in `findPropDefs()` argues against it the way the reaction pair's or roughness's
comments do for their own exclusions.

**4. Tank level, min/max level, diameter, and mixing model/fraction have no Find or Replace row
at all.** A tank is the one node type with several of its own scalar inputs, and none of them are
reachable outside the popup and the table. *"Find every tank under 20 ft diameter"* has no answer.
Ranked above the pump/valve gaps below because these are plain numbers with an obvious comparison,
not a curve reference or a categorical choice.

**5. Pump relative speed and energy price/pattern are not findable or replaceable.** Same shape as
#4 -- ordinary numbers, no Find row, no argument on record for the omission.

**6. Length is findable but not writable through Replace.** `FIND_EXTRA_LINK_FIELDS` explicitly
adds it to Find; `pushSpecList()` does not carry it, so *"find every 500 ft run, set it to 520"*
finds the run and cannot make the edit. Everything else `FIND_EXTRA_LINK_FIELDS` adds (`km`,
`bulkCoeff`, `wallCoeff`) IS in `pushSpecList()` -- length looks like the one left out rather than a
decision.

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
