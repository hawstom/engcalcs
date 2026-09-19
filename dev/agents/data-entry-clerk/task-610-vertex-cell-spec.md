# Task 610 — the pipe-vertex cell format, and my read on the other two conditions

Written by Declan (data-entry-clerk), 2026-09-09, at Tom's direct request via the orchestrator:
*"pipe vertices need a stated cell format, which the `data-entry-clerk` must specify... before
anything is built."* This file is the deliverable. Provenance tags follow the usual rule; an
untagged line is a defect.

---

## 1. The pipe-vertex cell format

### 1.1 What one cell contains

**One flat, single-separator list of numbers, no nesting punctuation:**

```
n1/n2/n3/n4/…
```

Read two numbers at a time, in order, as one vertex each: `(n1,n2)` is the first bend from the
`From` node, `(n3,n4)` the second, and so on to the `To` node. An **empty cell means a straight
pipe** — `l.verts = []` — which is already every pipe's default (**OBSERVED**
`js/looped-network.js:15722`, `addLink()`: `verts: (verts || []).map(...)`, defaulting to `[]`).

Example, a pipe with two bends, geographic project:

```
40.7128/-74.0060/40.7135/-74.0071
```

Same pipe, XY-grid project (feet):

```
1245.3/892.1/1247.9/895.4
```

### 1.2 Why ONE separator character and not a nested pair/list scheme

I considered, then rejected, a WKT-shaped nested format (`lat,lon; lat,lon` — comma inside a
point, semicolon between points; **CITED**, OGC's own grammar: *"a linestring text is... point,
comma, point (repeated)... coordinates within each point are separated by spaces"* —
[Wikipedia, Well-known text representation of geometry](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)).
Two things rule it out here, and both are specific to how a paste actually reaches this page,
not to WKT itself:

- **The comma-and-semicolon nested scheme collides with this page's own whitespace-fallback
  parser.** **OBSERVED** `js/looped-network.js:29060-29071`, `libPasteCells()` — the function the
  journal already expects paste-IN to reuse — splits a pasted line on a real tab **only if one is
  present**; a line with **no tab at all** falls back to `t.split(/[\s,;]+/)`. That regex is
  whitespace, comma, **and** semicolon. A clerk who selects and copies **only the vertices
  column** from their own spreadsheet (a completely ordinary thing to do — "let me just paste in
  the bends for these ten pipes") produces a paste with zero tab characters, and a WKT-shaped
  cell would be shredded into a dozen false columns by the exact parser meant to read it. This is
  not a hypothetical edge case; it is the single most likely way a vertex-only paste actually
  arrives, and it is the one I would have missed if I had not read `libPasteCells()` before
  proposing punctuation.
- **A comma-decimal locale is not a live risk here, which removes WKT's own reason to prefer
  comma.** **OBSERVED** `js/looped-network.js:13409`, `paneParseCellText()`: every existing pane
  cell parses a typed number with bare `+t` (JS's `Number()`), which only ever accepts a period
  as the decimal mark — a European `40,7128` already fails on every OTHER column in this table
  today, silently, as `NaN`. So there is no live European-locale ambiguity for a comma to protect
  against, and no reason to spend a second symbol keeping it clear of decimal points.

Given that constraint (must avoid `[\s,;]+`, and must avoid `-`, since a bare hyphen collides
with the sign of a negative longitude or a west-of-origin coordinate — `"40.7-74.0"` is
genuinely ambiguous between two positive-looking numbers and one number with an internal minus),
the remaining ordinary, unshifted US-QWERTY punctuation is narrow: `` ` = [ ] \ ' / ``. I picked
`/` for three reasons, in order: it needs no Shift key (cost: 400 pipes × however many bends is
real, and Shift-chords are exactly the "one extra keystroke × 400" tax my seat exists to name);
it cannot be mistaken for a decimal point, a sign, or a thousands separator in any locale I could
find; and it is the one candidate that already reads as a coordinate pair to a human glancing at
it — "lat/lon" is a phrase people already say out loud.

**The even-count self-check is not incidental — it is the format's whole error story.** A parser
reading this cell splits on `/`, requires the token count to be even, and parses every token with
the SAME rule every other numeric cell in this table already uses
(`js/looped-network.js:13409`, `isFinite(+t)`). An odd count, or any one non-numeric token,
fails the cell as a whole; there is no code path in which three of four numbers "take" and the
fourth is silently dropped. This is deliberate: a pipe geometry is one object, and a bend
half-read is worse than a bend refused, because a half-read polyline still SOLVES and draws —
wrong, quietly.

### 1.3 A cell the parser cannot read

**Refuse the whole cell, exactly the way every other cell in this table already refuses today.**
**OBSERVED** `js/looped-network.js:13978-13984`, `paneWriteCellText()`: `paneParseCellText()`
returns `{ok:false}` on a bad value, the caller returns `false`, and `panePasteAt()`
(`:14009-14043`) counts that as `refused` and reports the count in the notice string
(`lpn_pane_pasted`, *"Pasted {n} cells. {skipped} were not changed."*). The vertex column needs
no new failure UI — it needs the SAME contract: an odd token count, a non-numeric token, or a
token that fails `isFinite()` is a refused cell, the pipe's existing `verts` (or the empty
default, on a freshly created row — see §2) is left untouched, and the row is counted among
`refused` in the existing notice. **Never partially apply a vertex list** — no "first two bends
landed, the third was garbage, so the pipe now has one bend" state. All 4 (or 6, or 8...)
numbers commit together or none do.

### 1.4 Coordinate order: the CELL is public, so it is lat,lon — never lon,lat

**OBSERVED** CLAUDE.md, "Coordinate order: system is x,y = lon,lat; PUBLIC is lat,lon" —
*"System order — lon, lat... Everything computed, stored, projected or exported... Public
order — lat, lon. Every place a person reads a pair or types one."* A spreadsheet cell a clerk
types into, or reads back off a printed sheet against a marked-up plan, is exactly the "person
reads/types a pair" case the rule already names, so a geographic project's vertex cell is
**lat/lon/lat/lon/…**, never lon/lat, even though `l.verts[i]` is stored internally as
`{x, y}` where `x` IS longitude (Mercator-projected) and `y` IS latitude (**OBSERVED**
`js/looped-network.js:3641-3648`, `outwardX()`/`outwardY()`/`inwardX()`/`inwardY()`, and
`addLink()`'s `verts` construction at `:15720-15722` storing raw `{x,y}`). **This is a
deliberate divergence from WKT's own axis order** (WKT states x before y, which for a geographic
CRS is conventionally lon before lat) — I am citing WKT for its PUNCTUATION, not adopting its
axis order, because CLAUDE.md's public/system split overrides it for anything a person reads or
types, and a vertex cell is squarely that.

For an **XY-grid project** there is no lon/lat at all — `l.verts[i].x`/`.y` are the project's own
plan coordinates (feet or metres, whatever the project's distance unit is), and the cell is
simply **x/y/x/y/…** in that native order; there is no public/system split to apply because
there is no second, machine-only representation to diverge from.

**The column header must state which**, matching the same per-project labeling Tom's own
condition #2 already asks for on the Junction table (see §2): `"Bends (lat/lon/lat/lon/…)"` on a
geographic project, `"Bends (x/y/x/y/…)"` on an XY-grid one. A clerk reading the header should
never have to open the popup or guess.

### 1.5 What the cell writes into the document, and the projection round-trip

**On a geographic project, a pasted vertex needs the SAME source-token preservation the `.inp`
importer already gives an imported one, and for the same reason.** **OBSERVED**
`js/lpn-inp.js:1163-1174` — every vertex read from a `.inp` file's `[VERTICES]` section carries
`mergeTok(vt, 'x', r[1], vt.x)` / `mergeTok(vt, 'y', r[2], vt.y)`, the `_xsrc`/`_ysrc` markers
CLAUDE.md's own "ONLY THE USER TOUCHES A FILE'S NUMBERS" section names directly: *"Both axes...
carry the file's own value beside the drawn one (`_xsrc`/`_ysrc`), believed only while the drawn
number is still the one derived from it."* CLAUDE.md states this rule for a **file**, but a
pasted spreadsheet cell is the same class of thing by the rule's own test — *"a number that came
from a file is the user's"* — a number the clerk typed into their own spreadsheet and pasted in
is exactly as much theirs as a number EPANET wrote into a `.inp` file. The mechanism it protects
against is not a rounding nuisance here — `Geom.mercY`/`Geom.mercLat` is a genuine nonlinear
projection, and CLAUDE.md already measures its own residual: *"`mercLat(mercY(lat))` fails to
round-trip... for 69.8% of latitudes"* (CLAUDE.md, `lpn_` section, "THE FILE IS NEVER
PROJECTED"). A typed `40.7128` that is immediately projected to internal `y` and never marked
with `_ysrc` will, on the NEXT open-and-resave, come back out as something like `40.71279998…`
— not because anyone touched it, but because the page forgot which number was the user's. **Every
vertex a paste creates or overwrites on a geographic project should call the same
`mergeTok()`-shaped marking the `.inp` path already uses**, keyed on the freshly `inwardX()`/
`inwardY()`-converted point. On an XY-grid project there is no projection step at all — `x`/`y`
store the pasted numbers directly, no `_xsrc`/`_ysrc` needed, matching how every other pane cell
already stores a plain float today (**OBSERVED** `js/looped-network.js:13410`,
`paneParseCellText()`'s plain `+t`).

### 1.6 What it costs to type and to edit, which is the part only this seat answers

**Typing a new pipe with two bends, cell contents from scratch:** eight keystrokes for the
digits of each number plus three `/` — no shift key anywhere in the separator, no quote
characters, no parentheses. Compare to the WKT-shaped alternative (comma+space between
ordinates, semicolon+space between points): the same digits plus five punctuation characters
(comma, space, semicolon, space — twice), two of which (`;`) need Shift on a US layout. At two
bends that is roughly a 40% larger keystroke count for punctuation alone, and it is punctuation
that also happens to be the exact set the fallback parser shreds on (§1.2) — the "nicer-looking"
format is strictly worse on both axes my seat measures: keystrokes, and round-trip safety.

**Editing one bend of an existing pipe (the realistic case at volume — a clerk correcting one
coordinate a surveyor re-shot, not retyping the whole pipe):** the cell holds the WHOLE vertex
list as one string, so editing bend 2 of 3 means entering the cell (double-click or F2 per the
pane's own edit-mode convention, `js/looped-network.js:13655-13663`), navigating the caret past
`n1/n2/` to reach `n3`, retyping it, and leaving the rest of the string untouched. **This is a
real, non-zero cost this format does not remove** — a per-vertex column scheme (one column per
bend index) would let a clerk Tab directly into "bend 2, ordinate 1" the way they already Tab
into Elevation or Demand — but a per-vertex-index column scheme cannot exist here at all, because
the column count would have to be the MAXIMUM bend count across every pipe in the table, and a
network with one 12-bend pipe among 400 straight ones would force 24 empty columns onto every
other row. **I am naming this trade-off rather than hiding it**: the single-cell format is the
right one for CREATING and BULK-CHECKING geometry (typing or pasting a whole pipe's shape in one
motion, and reading it back on one screen), and it is measurably worse than a column-per-field
scheme for SURGICAL edits to one bend of one pipe deep in an existing network. I do not think
that trade-off is close enough to reconsider — the volume case ("400 pipes from a marked-up plan
set") is the CREATE case, not the surgical-edit case — but a future session revisiting this
should know the trade was made on purpose and which way it went.

**One more real cost: a bend count that is wrong is invisible until read closely.** A pipe pasted
with three bends when the plan set drew four does not fail to parse — it parses cleanly as a
shorter, still-valid pipe. Nothing in §1.3's refuse-or-commit contract catches a MISSING vertex,
only a MALFORMED one. I have no format-level fix for this (neither would a nested-punctuation
scheme, nor a per-column scheme) — it is a proofreading cost inherent to any free-form geometry
list, and the honest thing to do is name it rather than imply the even-count self-check catches
more than it does.

### 1.7 Recap, so a builder can implement this from this section alone

- Cell = `n1/n2/n3/n4/…`, one `/` between every number, no other punctuation.
- Empty cell = no bends (`verts: []`), already every pipe's default.
- Odd token count, or any non-numeric token (`isFinite(+t)` false) → refuse the WHOLE cell,
  counted in the pane's existing `refused` tally (`js/looped-network.js:14009-14043`); the pipe's
  prior verts (or empty default on a new row) are left untouched.
- Pair the tokens `(1,2), (3,4), (5,6)…` in order from `From` toward `To`.
- **Geographic project:** pair is `(lat, lon)`, public order, per CLAUDE.md's coordinate-order
  rule. Convert with `inwardX()`/`inwardY()` on write, `outwardX()`/`outwardY()` on read/copy-out
  (`js/looped-network.js:3641-3648`). Mark each written vertex with `_xsrc`/`_ysrc` the same way
  `js/lpn-inp.js:1163-1174`'s `mergeTok()` already does for a `.inp`-imported vertex.
- **XY-grid project:** pair is `(x, y)` in the project's own plan units, stored directly, no
  projection, no source-token marking.
- Column header states the order and the punctuation explicitly, per project type — see §2 for
  why this must match the Junction table's own new columns.

---

## 2. Tom's other two conditions, from this seat

### 2.1 The Junction table gains the project's location coordinates as columns

**DONE — re-verified 2026-09-19, superseding the "still true today" claim below, which is now
stale.** **OBSERVED** `js/looped-network.js:17097`, `paneColCoord(slot)`: two coordinate columns
(`key: 'axis1'`/`'axis2'`) now exist on every node table, wired through the same
`setNodeCoordAxis()` seam the property popup uses (Task 674, closed), headed by a function —
`axisNames().first`/`.second` — so the label follows the project kind (lat/lon, northing/easting
or x/y) exactly as §1.4 of this spec asked for. This closed under Task 674, independently of Task
610, and my own wishlist item 7/9 (journal, eighth and tenth invocations) tracked its shipping and
placement. **Nothing further is owed here** — condition 2.1 of Tom's three is satisfied, verified
by reading `paneColCoord()` itself rather than by trusting the earlier claim below.

Original text, kept for the record of what was open when this spec was written 2026-09-09:
*"Endorsed without reservation — this closes the oldest, largest gap I found in this seat's very
first invocation."* **OBSERVED**, journal, 2026-09-04: *"A placed node's position is read-only
forever, in every surface I found... there is no field anywhere to type a coordinate into, for a
new node or an existing one."* That was true on 2026-09-09; it is not true now. This condition was
the single highest-leverage piece of Task 610 for the "400 pipes from a marked-up plan set" case
specifically, because until a node's position is a typeable cell, the vertex format in §1 has
nothing to attach to — a pipe's bends are meaningless without its endpoints having real
coordinates. That gap is closed; what remains open in Task 610 is §1 (the vertex cell format
itself, now supplemented by §4 below) and §2.2 (paste-that-creates, still unbuilt — confirmed this
session: no `paneColVerts`/"Bends (" column exists anywhere in `js/looped-network.js`, and
`panePasteAt()`'s own comment, re-read at its current location, still says *"IT CANNOT GROW THE
TABLE"*).

One thing to carry over from §1.4 rather than re-decide separately: the SAME per-project header
convention (lat/lon for geographic, x/y for XY-grid) should govern these columns too, so a clerk
reads one coordinate convention on the whole page rather than two. `js/looped-network.js` already
has the conversion functions this needs (`outwardX`/`outwardY`/`inwardX`/`inwardY`,
`:3641-3648`); nothing new needs to be invented for the Junction columns beyond wiring them into
`paneCols()` the way `paneColElev()` already wires elevation.

### 2.2 A paste that ADDS is refused unless every row carries a validating, non-duplicating ID, and a link row names two existing nodes

**The refusal itself is right; the moment it fires is the part I was asked to answer, and I
recommend the opposite of "row 340 of 400."**

**Validate the ENTIRE pasted block before writing ANYTHING, and refuse the WHOLE paste — not just
the offending rows — if any row fails.** Two reasons, both from this seat:

- **A partial commit is a worse failure than a full refusal, for row-CREATING paste specifically,
  in a way it is not for the scalar paste that already ships.** `panePasteAt()`
  (`js/looped-network.js:14009-14043`) already reports "refused" cells on today's scalar,
  edit-only paste, and that is fine there because a refused scalar cell is INERT — the pipe it
  belongs to still exists, still solves, still draws, just with its old diameter. A refused
  ROW-CREATION is not inert in the same way: if row 1–339 of a 400-row Junctions paste create real
  nodes and row 340 is refused for a duplicate ID, the clerk now has a half-built network, no
  clean way to tell which 61 of 400 rows did NOT land without diffing 400 rows against the map by
  eye, and — worse — if the SAME paste operation's Pipes rows reference node IDs from the
  un-created tail, those pipe rows fail too, for a DIFFERENT reason (dangling endpoint) that reads
  to the clerk as a second, unrelated error. A clerk who has just typed or exported 400 rows from
  a plan set should get ONE outcome per paste: it landed, whole, or it did not land at all and
  here is exactly which rows to fix.
- **This is arithmetically who my seat exists to protect.** Catching an error before commit costs
  the clerk: read the report, fix N flagged rows in their own spreadsheet, paste again — a few
  minutes regardless of N. Catching it mid-commit costs: figure out which rows are already IN the
  model (no diff tool exists for this today — confirmed by re-reading the Tables pane this
  session, there is no "recently added" filter), manually reconstruct which 61 of 400 still need
  entering, re-paste ONLY those without re-triggering the ones that already landed (which the
  duplicate-ID refusal would now itself block, since they are no longer duplicates once they
  exist) — a genuinely bad afternoon, and the exact shape of friction my seat's whole argument is
  built to name and avoid.

**Concretely:** run the full ID-uniqueness and (for link rows) both-endpoints-exist check as a
dry pass over every row in the pasted block BEFORE `saveUndoSnapshot()` or any write. If every row
passes, commit all of them in the one undo step the paste already uses
(`js/looped-network.js:14019`, `saveUndoSnapshot()` already wraps the whole paste — this needs no
new undo mechanism, only a validation pass ahead of the existing write loop). If any row fails,
write nothing, and report EVERY failing row and its reason in one notice — not just the count
(today's `lpn_pane_pasted` notice, *"Pasted {n} cells. {skipped} were not changed"*, is a count;
a row-creating refusal needs row IDENTITY, e.g. which pasted ID collided with which existing one,
or which pasted From/To named a node that does not exist — a clerk fixing a spreadsheet needs to
know WHICH cell, not how many).

**One ordering note worth stating in the eventual tip or notice, not just in this spec:** condition
2.2's own wording ("a link row names two existing nodes") means the realistic two-step workflow is
paste Junctions first (creating every node with its ID and, per §2.1, its coordinates), THEN
switch to the Pipes tab and paste rows whose From/To reference those now-existing IDs. A clerk who
pastes Pipes first, before any Junctions exist, will see every row refused for a dangling
endpoint — correct behaviour, but the failure message should say so plainly ("node J-14 does not
exist in this project yet — paste the Junctions tab first") rather than a bare "unknown node"
that leaves the clerk to work out the ordering themselves.

**I do not think this condition is too strict, and I would not soften it.** An ID-collision or a
dangling-endpoint paste that silently renamed, merged, or dropped a row would be exactly the kind
of "helpful default" my seat's own framing warns about — right for a beginner protecting against
one mistake, and a real hazard at 400 rows where a silent rename could merge two intended nodes
the way the existing 14px pointer-snap already can (journal, first invocation, "Snap-on-create can
silently merge two intended nodes"). A hard, whole-paste refusal with a precise report is cheap at
volume (one re-paste) and the alternative (silent merge or partial commit) is expensive and, worse,
invisible until a solve or a report reads wrong days later.

---

## 3. Ctrl+Shift+PageUp/PageDn to the next table

**Worth its keystroke, and I would ship it, but only after the pieces ranked above it in my own
wishlist's shipping order** (range copy, arrow-key navigation, paste-onto-existing-rows,
Home/End — journal, fourth invocation, 2026-09-06). Tom's own words already rank it "lower
priority, but very cool" and I agree with his own ranking, for the same reason I gave the digit
tool-keys their modest placement in Task 595: it saves one gesture per TABLE SWITCH, not per row,
and a full pass through this seat's own workflow (Junctions, then Pipes, then whichever of
Pumps/Valves/Reservoirs/Tanks the network actually uses) is at most five or six switches per
project, not per element.

**Tab order:** this must be a chord bound globally (gated on `isTextEntry()`, the file's own
existing guard — `js/looped-network.js:8330`/`:29055`-area, already used for Delete and Ctrl+Z),
never a stop in the ordinary Tab sequence — Ctrl+Shift+PageUp/PageDn is a MODIFIER chord, not a
bare key, so it cannot collide with typing the way a bare digit could, and it needs no
`isTextEntry()` exemption logic beyond what already exists. **What it should NOT do is reset the
new tab's selection to cell A1.** Each of the six table tabs already needs its own scoped
`{anchorRow, anchorCol, focusRow, focusCol}` state for the range-selection work ranked above this
(journal, fourth invocation: "scoped per table-tab, since switching tabs is switching data sets
entirely") — Ctrl+Shift+PageDn should restore whatever selection that tab last held, the same way
switching a browser tab does not reset your scroll position on the page you left. A clerk
alternating between the Junctions and Pipes tabs to cross-check a bend against its endpoint's
elevation should land back exactly where they left off, not have to re-navigate every time.

---

## 4. Re-verification, 2026-09-19: the five candidates the orchestrator asked me to rank explicitly, against real sources

§1 already picked the in-cell delimited list and rejected WKT on two grounds specific to this
codebase (the whitespace-fallback parser, and the absence of a live locale reason to prefer a
comma). This section adds the two candidates I had not previously ranked by name — a separate
vertex table keyed on the pipe ID, and a WKB/hex blob — and grounds "leave vertices out of paste
entirely" as the measured status quo rather than a silent default. **Line numbers cited in §1–3
above have drifted since 2026-09-09** (the file has grown substantially; `libPasteCells()` moved
from `~29060` to `36866`, `panePasteAt()` from `~14009` to `18550`, etc.) — I re-grepped every
function named in §1–3 this session and confirmed **all of them still exist with the same
signature and the same behaviour described**, so nothing in §1's design is invalidated by the
drift, only the line numbers are stale. I am not re-citing every one individually below; treat
§1–3's line numbers as approximate and the function names as the durable identifier.

### Ranked

1. **In-cell delimited flat list (`n1/n2/n3/n4/…`) — RECOMMENDED, unchanged from §1.**

2. **A separate vertex table keyed on the pipe ID — the strongest alternative, and I want to name
   why it is not my pick even though it is a real contender.** **OBSERVED** `js/lpn-inp.js:1263`
   (import) and `:3209` (export, `section('VERTICES', verts)`): **EPANET's own `[VERTICES]`
   section already IS this shape** — one row per vertex, `LinkID X-coord Y-coord`, order implicit
   from row sequence, no nesting punctuation at all — and `js/lpn-inp.js` already reads and writes
   it, vertex-by-vertex, each carrying its own `mergeTok()`-marked source token
   (`js/lpn-inp.js:1268-1273`). So a separate table is not a hypothetical; it is the format this
   page already round-trips through a real file today. **What rules it out for the PASTE surface
   specifically, not for the document model:** it does not fit a "400 pipes, one row per pipe"
   spreadsheet paste at all — a clerk's plan-set spreadsheet has one row per PIPE (ID, from, to,
   diameter, length, roughness, bends), and a separate vertex table would need a SECOND paste, into
   a SEVENTH tab, of a variable number of rows per pipe keyed by an ID the clerk would have to
   repeat on every vertex row by hand (`P-104, P-104, P-104, P-204, …`) — the exact repeated-key
   tedium a flat per-pipe list avoids entirely. It is the right shape for a FILE format (order
   implicit, no width limit, machine-written) and the wrong shape for a CELL a person fills in by
   hand once per pipe. If Task 610 ever needs a true internal representation beyond `l.verts[]` — it
   does not, today — the `[VERTICES]` shape is already what the document model uses internally, so
   there is no representational mismatch, only a paste-ergonomics one.

3. **WKT `LINESTRING(...)` — rejected, per §1.2, on two grounds already sourced there (OGC grammar,
   `libPasteCells()`'s whitespace/comma/semicolon fallback).** One further piece of evidence, found
   this session and worth adding: **CITED** — QGIS, the one general-purpose GIS tool with an actual
   attribute table, does **not** support typing or pasting a WKT string into an ordinary attribute
   cell to set geometry; doing so needs a dedicated third-party plugin ("Plain Geometry Editor,"
   "Geom From Attribute" — plugins.qgis.org, both found this session) layered on top of the native
   Vertex Editor tool, which is pointer-based. That a mature GIS product needs a bolted-on plugin to
   let WKT-in-a-cell set geometry at all is corroborating evidence that this is not an established
   spreadsheet-paste convention anywhere, not only a bad fit for `lpn_`'s own parser.

4. **WKB/hex blob — rejected outright, no serious consideration.** A WKB blob is a binary
   serialization meant for database interchange (e.g., PostGIS's `ST_GeomFromWKB`), never
   typed or read by a person; I found no source anywhere — not EPANET, not QGIS, not ArcGIS,
   not a single spreadsheet workflow — that treats it as a human data-entry format. It fails every
   test this seat measures by: it is not typeable, not readable on a printed sheet, not
   correctable by eye, and it is the opposite of what "400 pipes from a marked-up plan set" needs.
   Naming it only because the task asked for it to be considered explicitly.

5. **Leave vertices out of paste entirely — the measured status quo, not a null option.** This is
   what Task 186 already shipped and what Task 610 exists to move past: every straight pipe (no
   bends) already pastes and creates cleanly under §1's own empty-cell rule with no vertex column
   at all, so "leave vertices out" is not a gap for the majority of a typical distribution network
   (most pipes are drawn straight or nearly so between two junctions). **OBSERVED** — I have not
   measured this repo's own bend frequency (no sample project to draw the statistic from), so I am
   not claiming a percentage; I am stating the honest floor: shipping row-creation with NO vertex
   column at all is a real, smaller, sequenceable slice of Task 610 (create every pipe straight,
   then a clerk drags in the handful of bends that survey called for by pointer, same as any other
   today), and would let Task 610 ship for its highest-volume case (straight pipes) without §1's
   design being finished. I would not RECOMMEND stopping there — a plan set with genuine bends
   (a main following a curved street) is exactly the case this seat exists to speed up — but if
   Task 610 needs to ship in two slices for any reason, "rows without bends first, bends via §1
   second" is the honest, safe way to cut it, and is worth stating to whoever schedules the build.

### What the task's four "row 300" questions get, restated against the shipped code, re-verified this session

- **Malformed pair:** refuse the whole cell (§1.3), unchanged — `paneParseCellText()`'s
  `isFinite()` rule and `panePasteAt()`'s `refused` tally both still exist and behave as described.
- **Blank cell:** no vertices (`verts: []`), unchanged — this is still every pipe's construction
  default (`js/looped-network.js:20755`, `verts: (verts || []).map(...)`, re-confirmed this
  session at its current line).
- **Character ceiling before Excel/LibreOffice mangles it:** **CITED** — Microsoft's own
  "Excel specifications and limits" page states a cell holds at most 32,767 characters, with only
  the first 1,024 displayed inside the cell itself (the rest is visible only in the formula bar)
  (support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3).
  At the format in §1 (`n1/n2/…`, roughly 9–12 characters per coordinate including the separator),
  1,024 characters holds on the order of 40–50 vertices before the cell's IN-CELL display truncates
  visually — the full value is still stored and still pastes/copies correctly past that point, so
  this is a readability ceiling for a clerk eyeballing the sheet, not a data-loss ceiling. No
  pipe in an ordinary utility network plausibly needs 40+ bends; this is not a real constraint on
  the format, only a fact worth stating if it is ever asked.
- **Coordinates in the cell — table's display units and CS, or something else:** table's display
  units and the project's own coordinate order, unchanged from §1.4 — lat/lon (public order) for a
  geographic project, x/y (project's own plan units) for an XY-grid project, never SI and never a
  second unit system. Re-affirmed against `paneColCoord()`'s own per-project `axisNames()` pattern
  (§2.1 above), which now exists and uses the identical per-project-kind labeling rule.
- **What round-trips:** copy OUT then paste back IN must be byte-identical, per CLAUDE.md's
  absolute rule ("a number that came from a file is the user's... we display it, we solve from a
  COPY, and we write back exactly what came in"). **OBSERVED** `js/lpn-inp.js:215`
  (`mergeTok()`), still present and unchanged in shape this session: the same source-token
  preservation mechanism the `.inp` importer uses for a file-imported vertex must be applied to a
  pasted one on a geographic project, so a typed `40.7128` comes back out as `40.7128`, never as
  a projection residual like `40.71279998…` (CLAUDE.md's own measured 69.8% non-round-trip rate
  for `mercLat(mercY(lat))`, cited in §1.5). This is unbuilt — there is no vertex column yet to
  apply it to — but the mechanism it must reuse is confirmed still present and unchanged.

## Provenance summary

Every code citation above is OBSERVED with a line number, re-read this session rather than
carried from memory (§1–3's numbers were re-read 2026-09-09; §4 re-verified all of them this
session, 2026-09-19, and notes where they moved). The WKT grammar quote and its source are CITED.
The Excel character-limit figures (§4) are CITED to Microsoft's own specifications page, found
this session. The QGIS plugin evidence (§4) is CITED to plugins.qgis.org, found this session. The
EPANET `[VERTICES]` shape (§4) is OBSERVED directly from `js/lpn-inp.js`'s own import/export code,
which is this repository's working implementation of that section — I did not additionally fetch
EPANET's own file-format manual this session because the repo's own reader/writer is the more
precise and more relevant source for what the format actually is. The projection-residual figure
(69.8%) and the file-import token-preservation rule are OBSERVED from CLAUDE.md's own text, quoted
rather than paraphrased. Nothing in this file is SPECULATION presented as settled — where I made a
design call with no external precedent (the single-`/`-separator choice, the whole-block-refuse
recommendation), I said so and gave the reasoning rather than citing an authority that does not
exist for it.
