# Coordinate entry at volume: Declan's review of the projected-CRS proposal

Written 2026-09-11 at Tom's direct request (*"Ask Declan, I guess"*), against
`dev/map-projection-decision.md` (the decision record) and `dev/map-coordinate-mathematics.md` §6
(the arithmetic). I am the seat that enters a network at volume, by keyboard, from a plan set or a
survey file — not the seat that owns the geometry or the projection math. This file answers Tom's
six questions from that seat and nothing more; where the mathematics report has already answered a
question better than I can, I say so and defer to it rather than re-deriving it.

**One thing up front, because it changes how to read everything below:** `dev/map-coordinate-
mathematics.md` §6.2 and §6.4 already looked at "should the document store a projected CRS" and
concluded **no** — a UTM/State-Plane *frame* is forbidden by "only the user touches a file's
numbers" (E,N ↔ lon/lat is a lossy round trip) and is *less accurate* than what `geodesicMeters()`
already delivers (400-980 ppm against ≤2 ppm at 10 km). Its own item 8 is **typed projected-
coordinate ENTRY, never projected STORAGE** — convert on the way in and out, store lon/lat, exactly
as the unit system already does with feet. Tom's proposal in the decision record reads differently
("a document could instead hold easting/northing... the drawing frame would BE that plane") — I
think that tension is real and worth naming rather than picking a side on, since resolving it is a
geometry/architecture call, not a data-entry one. **Everything below assumes item 8's shape (entry
and display only) is the one actually being asked about**, because that is the one my seat can speak
to with authority; if the document itself is to store easting/northing, most of my answer to Q2 and
Q3 (typo detection, zone confusion) still applies, but the "which format is safe to store" half does
not, and that half is not mine to referee.

## Q1 — What do I actually type, and in what proportion

**SPECULATION, but a confident one, informed by the CITED sources below rather than invented.** I do
not have logs of real plan sets to count from — nobody in this repository does, which is itself
worth naming — so this is a professional-practice estimate, not a measurement, and a later
invocation should treat it as such.

For a US water/wastewater utility network entered by a person at a keyboard, in rough order of how
often I would expect to meet each source format:

1. **A CAD drawing schedule or point list, in State Plane feet, NAD83, already in the utility's or
   engineer's local zone** — the majority case for anything with professional survey behind it.
   Civil 3D and most municipal GIS layers in the US are State Plane by default, and the numbers
   arrive as a point list (ID, Northing, Easting, Elevation, Description) exported from the drawing,
   not typed from a screen. **CITED**: GIS Geography's own SPCS overview states plainly that SPCS
   "is most suitable for engineering, public works, and surveying applications" precisely because
   its per-zone distortion is held to 1:10,000 — this is *why* it is the default a US civil
   engineer's software reaches for (https://gisgeography.com/state-plane-coordinate-system-spcs/).
2. **An "arbitrary" or assumed local coordinate system tied to one or two benchmarks**, common on
   older or smaller systems where nobody ever tied the drawing to a real datum — a translation and
   possibly a rotation away from State Plane, with no EPSG code anywhere in the file. This is today's
   `lpn_` grid-project case exactly, and I would expect it for a meaningful fraction of smaller
   utilities' legacy base maps.
3. **Latitude/longitude in decimal degrees**, from a GPS unit, a GIS export, or a KML/GeoJSON file —
   common for newer field data (a valve located with a handheld or phone GPS) and for anything that
   started life in a GIS rather than a CAD drawing.
4. **UTM** — the rarest of the four in US municipal/utility engineering specifically. It is a real
   federal and scientific standard, but it is not what a US civil engineer's own software defaults
   to for a local project; Tom's instinct that "US engineers will want State Plane" matches the
   professional-practice literature, not just intuition — the same GIS Geography source states SPCS
   was expressly designed because a national UTM-style grid was "too high" in distortion (up to
   1:2,500 at a zone edge) for the precision civil engineering and property surveying need
   (https://gisgeography.com/state-plane-coordinate-system-spcs/; corroborated by
   https://www.coordinate-converter.com/utm-vs-state-plane-accuracy).
5. **DMS (degrees-minutes-seconds)** rather than decimal degrees — occasionally, on an older legal
   description or a plat, but decimal has been the practical default for anything digital for long
   enough that I would not expect to meet raw DMS often in a spreadsheet or CAD export.

**The practical upshot for build order:** if only one projected system is going to exist for a
while, State Plane is the one my seat would actually be handed, not UTM — Tom's worry is well
founded from where I sit, not just a hunch.

## Q2 — The cost of getting it wrong at entry

A State Plane easting in most zones is six to seven digits (roughly 200,000–3,000,000+ depending on
the state and its false easting), and a northing is commonly seven digits. A UTM northing in the
northern hemisphere is always seven digits (0–10,000,000 range). Both are long enough that ordinary
keying errors become **plausible-looking wrong answers**, not obviously broken ones:

- **A transposed digit** in the middle of a seven-digit number moves the point by anywhere from a
  few metres to a few kilometres depending on which digit, and the result still looks like a normal
  coordinate — nothing about `2,847,153` versus `2,874,153` reads as wrong on sight.
- **A dropped or doubled digit** shifts the decade and can move a point by an order of magnitude —
  the kind of error that, on a map, places a junction visibly outside the rest of the network, which
  is at least loud *if the person is looking at the map when it happens*. At volume, keying 400 rows
  from a printed schedule into a spreadadsheet or a paste block, nobody is watching the map update
  after each row; the loud signal only fires the moment someone finally looks.
- **A missing false easting/northing** (typing the "local" seven-digit number without the state's
  offset, or vice versa) is the error class I would worry about most, because it produces a number
  that is internally well-formed and only wrong by a constant — every point in the batch is wrong by
  exactly the same amount, so nothing in the batch looks inconsistent with anything else in the
  batch. That is the worst shape of error for a spot-check: a cluster of 400 new junctions that are
  all self-consistent and all off the true network by the same offset would pass a "does this network
  look reasonable" glance and fail only against something external (an aerial photo, an existing
  node, a known benchmark).

**What would catch these, and what the current entry path catches today: nothing, because there is
no typed-coordinate entry path today at all.** I confirmed this from the first invocation of my own
journal and re-confirm it stands (`js/looped-network.js:13240`, `addNode(type, x, y)`; the only
callers that supply live coordinates are the canvas pointer handler and a dev-only test grid). A
node's position is a **read-only span** in the property popup (`coordFields()`,
`js/looped-network.js:25041-25050`) and no Tables-pane column carries X/Y at all. So the honest
answer to "does the current entry path catch a typo class" is that it cannot, because it has no
typed-coordinate entry surface to make a typo IN. Any new coordinate-entry feature — projected or
not — is inheriting a green field here, which is an opportunity as much as a gap: whatever validation
gets designed does not have to retrofit around an existing, permissive text field.

**What I would want a coordinate-entry feature to do, independent of which CRS is offered:**
range-check against the CHOSEN zone's own published false-easting/false-northing bounds (a number
outside a zone's valid range is a hard, loud, buildable check — EPANET-shaped "we cannot use this,
here is why," never a silent accept) and, if a batch of pasted points is being read, flag a point
whose distance from the batch's own centroid is an outlier by an order of magnitude more than its
neighbours — the one thing a per-row range check cannot catch (a whole-batch offset that is
individually valid but collectively wrong).

## Q3 — Zones are the trap: how does a clerk know which one, and is a wrong pick loud or silent

**This is the sharpest risk in the whole proposal, and it is bigger than "two datums."**

- **State Plane has 124 zones today** in the legacy (NAD27/NAD83) system
  (https://gisgeography.com/state-plane-coordinate-system-spcs/), and **the coming SPCS2022 revision
  raises that to 953 zones** across the 48 contiguous states plus Alaska, Hawaii and a Gulf special-
  use zone (https://www.coordinately.org/learn/nsrs-modernization). That is not a typo-scale
  increase — it is nearly an order of magnitude more zones to pick correctly among, at exactly the
  moment the industry is mid-transition.
- **UTM has 60 zones plus a hemisphere flag**, which is a smaller pick but the hemisphere flag is
  its own silent-failure mode: a southern-hemisphere northing minus 10,000,000 looks like a perfectly
  ordinary number in the wrong hemisphere and nothing about it announces the mistake.
- **Two live datums today (NAD27, NAD83) and a third arriving**: NATRF2022 is in public beta now
  (https://beta.ngs.noaa.gov/NATRF2022/) and NGS's own modernization material states the shift from
  NAD83(2011) to NATRF2022 is **3.5–4 feet in Texas alone**
  (https://www.coordinately.org/learn/nsrs-modernization) — big enough to misconnect a pipe to the
  wrong side of a street, small enough to look like ordinary survey noise on a plot.

**How does a data-entry person actually know their zone?** In practice, from the same title block or
project metadata the plan set already carries — a professional drawing states its datum and zone
somewhere on the sheet, and a competent user *should* be reading that, not guessing. **The design
question is not "how do we help someone who does not know their zone" (that is a training problem,
not a UI problem) but "what happens when the number they typed does not match the zone they
picked."** And the honest answer, for both State Plane and UTM alike, is: **usually nothing loud at
all.** A wrong-zone number is still a syntactically valid easting/northing in the *right shape* for
almost any pair of adjacent zones — state plane zones are designed to abut with similar-magnitude
false eastings precisely so the numbers stay convenient, which is the same property that makes a
wrong-zone pick produce a plausible answer rather than a garbage one. The network draws, the pipes
connect to each other consistently, and the whole thing sits some tens to low hundreds of kilometres
from where it belongs on the actual tile/basemap layer underneath — which a person only notices if
they are looking at the basemap, and may not be, for a grid project with no basemap at all.

**The one loud failure mode I can identify with confidence: a zone/datum mismatch large enough to
put the network's centroid off the visible extent of a raster basemap the user has turned on**
(Task 497's satellite/terrain tiles). If the page can compare "does this converted lon/lat sit near
where the last save/import left this project" and flag a jump past some threshold, that is a cheap,
buildable, always-loud check that catches the big misses (wrong zone entirely, wrong datum by more
than a few metres, wrong hemisphere) without needing to understand which zone was intended. It does
**not** catch a fine-grained wrong pick between two adjacent, similarly-scaled zones — that error
stays silent under any check I can propose, and is exactly the shape EPANET-adjacent GIS tools rely
on the operator's own title-block reading to avoid.

## Q4 — Incremental or not: proj4js versus hand-rolled UTM

**Hand-rolled UTM-alone is the trap, and I think the mathematics report already reaches the same
conclusion from a different direction (§6.4's summary table) without using the word "trap."**

The case for proj4js, from where I sit:

- **A hand-rolled UTM implementation is a dead end shaped exactly like Tom's own worry.** Every
  additional CRS — one State Plane zone, let alone a state's several — is a *different projection
  family* (State Plane uses Lambert Conformal Conic in some states and Transverse Mercator in
  others, by zone), not a parameter change on the UTM formula. A hand-rolled UTM function has no
  natural extension point for "and now also Lambert Conformal Conic, and also the handful of oblique
  Mercator zones (Alaska panhandle), and also NATRF2022." Tom's own words — *"I don't know a clean
  way to move incrementally from UTM-only to the whole library"* — are, from what I can see, correct
  about the hand-rolled path specifically, not about the goal in general.
- **proj4js already IS the library**, not a stepping stone to one: it ships EPSG-code-keyed
  definitions for State Plane zones (both NAD27 and NAD83 series), every UTM zone, and thousands of
  others, all through one uniform `proj4(fromDef, toDef, [x,y])` call. Adding "and also zone X" after
  proj4js is wired is a **data problem** (does the zone's `.prj`/EPSG string exist in the bundled
  definition set — nearly always yes for anything in the US) rather than a **code problem**. That is
  the incremental path Tom is asking whether one exists: it exists, and it is proj4js, not a
  UTM-first roadmap.
- **The cost is a real runtime dependency**, which the mathematics report already flags honestly
  (§6, "a page that vendors only the EPANET engine today") — that is a legitimate cost and not mine
  to weigh against the vendoring policy; I raise it so it is counted, not to relitigate it.
- **Day one, for my seat specifically:** a proj4js-backed picker lets a clerk choose "NAD83 / Texas
  Central" from a real, named list (state + zone name, not a bare number) the first time the feature
  ships, which is the only version of this I would trust a volume-entry user to pick correctly
  without a training session — a raw EPSG code or a hand-maintained short list of "UTM zone N" text
  boxes is exactly the wrong-zone risk in Q3, worse, not better, because it hides the state/zone
  NAME that is the one thing the clerk's own plan set actually states. UTM-alone leaves the user
  stuck with no expansion path and a *worse* picker (numbered zones, no names) than proj4js gives for
  free on day one.

**My recommendation: proj4js, not hand-rolled UTM, if this is built at all** — not because it is
bigger (it is), but because UTM-alone is a genuine dead end for the exact reason Tom named, and the
library that replaces it later would have to re-architect the picker, the zone list and the
entry/display conversion seam anyway. Building the smaller thing first does not save the larger
thing's design cost; it spends it twice.

## Q5 — What I would want that nobody has proposed

- **A zone picker that remembers the LAST zone used, per browser, the same way furniture already
  does** (`lpn_pane`, `lpn_rpane` etc. — CLAUDE.md's own furniture-versus-project rule). A clerk
  entering 400 rows from one plan set is entering them all in the same zone; re-picking it every
  session (or worse, every paste) is exactly the "one extra keystroke times four hundred" tax my
  seat exists to name, except here it would be "one extra dropdown per SESSION," which is smaller but
  still worth avoiding for free.
- **Read the CRS off the file itself where the file states one, rather than asking the clerk to
  pick it by hand at all.** A `.prj` sidecar (shapefile convention) or a GeoJSON's own CRS member
  states this outright; even a bare CSV frequently has the zone named in a header row or the
  filename ("MainSt_SPCS_TXCentral.csv"). I am not proposing OCR of a filename — I am saying the
  paste-in and import paths should have a "state it, or offer to detect it from the file" step
  before falling back to "the clerk picks from a list," because the file usually already knows and
  making a person re-state a fact their own document carries is exactly the kind of friction this
  seat is supposed to catch.
- **A paste of a coordinate BLOCK, not one field at a time.** This is really Task 610/186's own
  shape (my wishlist item 1, and the vertex-cell-format spec I delivered 2026-09-09) applied to
  whole-node creation: a clerk with a State-Plane point list wants to paste ID/Northing/Easting/
  Elevation columns straight into a Tables-pane-shaped surface and have 400 junctions appear, not
  type each pair into a dialog 400 times. Whatever CRS work ships should land ON that surface, not
  beside it as a separate one-node-at-a-time dialog — a coordinate-system picker attached to a
  single-node popup solves the wrong volume.
- **A visible, un-editable readout of "what CRS is this document's coordinates entry mode" near
  wherever a number is typed**, the same way a unit suffix already sits beside a diameter field.
  This is cheap (a label, not a control) and is the only thing that would let a clerk NOTICE they
  are about to paste State Plane numbers into a UTM-mode field before doing it, rather than after.

## Q6 — Is this the right priority before 16 September

**Tom says no urgency, and I agree with him from my own seat, more strongly than I expected to
before writing this.** Two independent reasons:

1. **There is no typed-coordinate entry path of ANY kind today** (Q2). A projected-CRS entry mode is
   an enhancement to a feature that does not exist yet. Building "State Plane entry" before "any
   coordinate entry" ships is building the harder, narrower version of the feature before the
   general one — the general one (typed lon/lat or XY, with paste-block support) is itself
   unbuilt and is a bigger, more broadly useful gap for my seat than which CRS the numbers arrive in.
2. **Every item on my own wish list ranks materially higher for volume entry, by my own arithmetic,
   and I said so in writing before this question was asked**: Task 610/186 (paste-created rows,
   including typed X/Y and From/To, closed 2026-09-09 on the vertex-cell format) and the market-
   researcher's CSV/GPX import row remove a per-ELEMENT round trip for 400 rows; a CRS picker, by
   contrast, removes at most a per-SESSION unit-conversion step, the same shape argument I already
   made against the seven-key toolbar binding (fifth invocation, wishlist item 5) — real, but two
   orders of magnitude smaller than a row-creation fix. **If a projected-CRS feature and the
   still-open half of Task 610/186 (typed X/Y, row creation via paste for grid AND geographic
   projects) were competing for the same build slot, I would ask for 610/186 first, unambiguously.**

That said, this is a *development-branch* ask (Tom's own words), not a request to ship by 16
September, so I do not read it as competing with anything on the near-term list at all — it is fine
to design now and build slowly, and proj4js's own shape (Q4) is exactly the kind of decision that is
cheaper to get right before code exists than to redo after UTM-only code ships.

## Summary for the orchestrator

- **What I type, in order of how often**: State Plane feet (most US utility work with real survey
  behind it) > an arbitrary/assumed local system tied to a benchmark > lat/lon decimal degrees (GPS/
  GIS-sourced) > UTM (rarest for this specific industry) > raw DMS (rare, legal descriptions).
  SPECULATION, professional-practice estimate, not measured.
- **Cost of a wrong entry**: silent and plausible far more often than loud, because a transposed
  digit or a missing false-easting/northing still produces a well-formed, in-range-looking number.
  Nothing today catches any of it, because there is no typed-coordinate field at all yet (OBSERVED,
  `js/looped-network.js:13240`, `:25041-25050`).
- **Zones are the trap, confirmed**: 124 State Plane zones today, 953 coming in SPCS2022
  (CITED), two live datums and a third (NATRF2022) already in public beta with a measured 3.5-4 ft
  shift in Texas (CITED). A wrong-zone pick is almost always SILENT, because adjacent zones are
  deliberately similar in magnitude; the one loud check I can propose is a jump-from-last-position
  guard, not zone validation itself.
- **proj4js, not hand-rolled UTM.** UTM-alone cannot extend to State Plane's different projection
  families without a rewrite; proj4js already is the extensible library, at the cost of a real
  runtime dependency the mathematics report already flagged. Recommend building the picker against
  proj4js from day one if this is built at all.
- **What nobody proposed**: remember the last-used zone per browser (furniture, not project data);
  read the CRS off a `.prj`/GeoJSON header before asking the clerk to pick; land any CRS work on the
  paste-a-block surface (Task 610/186), not a single-node dialog; show the active entry CRS beside
  the field the way a unit suffix already does.
- **Priority**: no urgency, and I would rank Task 610/186 and the market-researcher's import row
  above this for volume entry specifically, by roughly the same order-of-magnitude argument I have
  made before about tool-select keys. Fine as a development branch; not a near-term build for my
  seat's own case.

— Declan
