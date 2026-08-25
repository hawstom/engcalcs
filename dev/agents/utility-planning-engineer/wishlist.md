# Wish list — utility design and planning engineer

**What this is: what I would build next, in MY order.** Not the roadmap, and not a neutral
hopper. Tom, 2026-08-24: *"We all have our pet priorities, and the utility engineer should have
theirs. Maybe they have their own roadmap or (wish list, heh)."*

`dev/ROADMAP.md` holds work that has been decided on, in Tom's order. This holds what I want, in
mine. **Where the two orders disagree, say so and say why — that disagreement is the point of
having me.** A wish list that quietly matches the roadmap has told nobody anything.

The rules that keep it honest:

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is me guessing, which
  is the one thing I must not do quietly — go find the source, or tag the row SPECULATION and say
  so plainly.
- **Rank honestly, including against myself.** Something I found is not thereby important. Say
  when a want is small, or narrow, or mostly mine. Be willing to rank my own discovery low.
- **State the case once and do not campaign.** I am allowed to want things this project has
  decided not to build; I am not allowed to keep re-litigating them. A declined row moves down
  with Tom's reason attached and is never deleted, so a later invocation reading the same paper
  does not re-propose it from scratch.
- **A known-but-unbuilt item is not a miss.** Tom: *"it's not really a gap if it's on our radar."*
  Deepening something already listed counts as a contribution; ranking it is still useful.

**2026-08-25 — Tom's note that this list read as a formality, and the fix:** *"I am disappointed
that their wish list is not overwhelmingly long. Increase their research budget."* This entry
carries the first pass at that instruction — outward research, not introspection. Four rows below
are new; a fifth is already promoted. Rank is honest, not padded: I looked hard for more and
stopped where the sourcing stopped, not where the row count felt satisfying.

---

## My order (2026-08-25 pass)

### 1. A scenario-level demand multiplier, so avg-day/max-day/peak-hour is one number, not one edit per node

- **What:** a single scalar a scenario can carry — "all base demands × 1.8" — resolved at solve
  time the same way a demand pattern already is (`demandMultiplier()`, `js/looped-network.js:21157`),
  but as one project-level knob per scenario rather than a per-node override.
- **CITED, and this is the strongest sourcing in this pass — the SAME three scenario names recur
  across every published water master plan I read, independently:** average day, maximum day (or
  max day + fire), and peak/maximum hour. San Bernardino Municipal Water District's master plan,
  Section 7 (sbmwd.org, "Hydraulic Model Development") lists exactly this triad as the standard
  model-run set; the City of Squamish 2024 Water Master Plan Update (squamish.ca) and the City of
  Astoria Water System Master Plan (astoria.gov) both structure their whole hydraulic chapter
  around the same three conditions plus fire flow. This is not a stylistic habit of one firm — it
  is the field's standard vocabulary for "what conditions must a distribution system be checked
  under," the way AWWA M31 defines required fire flow.
- **OBSERVED gap, checked before writing this row:** `lpn_` scenarios already support create /
  rename / delete / switch and a per-element override (`js/looped-network.js:2522` onward, closed
  Task 201), but the ONE bulk-write tool this page has — "Apply starting values to all elements"
  (`js/looped-network.js:17995`) — is explicitly **Base-only and refuses inside a scenario**
  (`js/looped-network.js:18003`: *"This applies your starting values to the drawing itself"*). So
  today there is no way to build "max day" as an overlay on "average day" without hand-editing
  every junction's demand in the new scenario — survivable at 10 nodes, real friction at 20, and
  it destroys the very thing scenarios exist to keep: one drawing, several conditions read off it.
- **Why this ranks above the others below:** it is the most universal deliverable in the published
  literature I found — every master plan I read runs these three conditions, none skip it — and it
  sits exactly at this page's target scale (10–20 nodes) rather than needing GIS or calibration
  infrastructure this suite has correctly declined to become.
- **Roadmap disagreement, and it is a real one:** `dev/ROADMAP.md` carries Task 468 ("Demand
  categories on a junction") at priority 25 (Maybe), described there as "the breakdown the
  importer already flattens" — framed as a data-fidelity fix for `.inp` import. **From this seat
  it is worth more than that framing suggests.** Several master-plan documents I found apply
  *different* peaking factors by land-use category (residential vs. irrigation vs. commercial),
  not one system-wide number — Task 468's categories are the natural home for a *per-category*
  version of this same multiplier, once it exists. I would move Task 468 to at least 50 (Someday)
  on that basis, not because import fidelity is unimportant, but because the design-and-planning
  use of demand categories is a second, independent reason to want it that the current roadmap
  text does not name.
- **Size:** believed small-to-medium — the multiplier arithmetic already exists
  (`patternMultiplier`/`demandMultiplier`), so this is mainly a new scenario-level input field and
  the UI decision of how it interacts with a node that ALSO carries its own per-node override in
  that scenario (multiply-then-override, or override-wins — a real design choice, not answered
  here). Not designed; re-derive before quoting.

### 2. A scenario comparison table — run every scenario, one summary row each

- **What:** solve every named scenario in the project (already sub-second each, per
  `dev/looped-network-calculator-scope.md`'s own performance table) and show one row per scenario:
  minimum pressure and where, maximum velocity and where, pass/fail against a stated threshold.
- **CITED** as a real commercial feature, which is evidence of demand rather than of quality
  (per this agent's standing instruction): Bentley's own WaterGEMS documentation advertises
  "Scenario Management" allowing "an unlimited number of variations… analyze and recall," with a
  **batch run** that computes "all your scenarios consecutively with only 2 clicks… get the
  results of multiple scenarios in one single application and file" (blog.virtuosity.com,
  "Saving Time and Money with WaterGEMS' Scenario Management"; docs.bentley.com, "Understanding
  Scenarios and Alternatives"). That is precisely the workflow a master-plan report needs to
  produce its own standard exhibit: pressure and velocity compliance across avg-day / max-day /
  max-day-plus-fire / peak-hour, side by side.
- **OBSERVED:** nothing like this exists today. Per-scenario results are read one scenario at a
  time off the map or a per-pane table (`js/looped-network.js:7919` onward, "Print table"), and the
  thematic colour-by-value view (closed Task 327) colours one field of one scenario at a time by
  design — *"two quantities coloured at once is a map with two legends"* (closed-ledger entry for
  Task 327) — which is the right call for a map, but it is not a report.
- **Relationship to Row 1:** this row has value even without the demand multiplier — a user who
  hand-built three scenarios today still cannot see them side by side — but the two compound: a
  cheap multiplier plus a cheap comparison table is most of a master-plan hydraulic-chapter table
  in two features instead of a manual process.
- **Size:** believed small — a loop over existing scenario names and the existing solve, feeding a
  new summary row into the existing print-table mechanism. Not designed.

### 3. Water age, and water age only — a narrow, sourced case against the blanket water-quality cut

- **What:** report water age (EPANET's `WQTYPE AGE`) at nodes and, especially, in tanks, riding on
  the EPS + tank + EPANET-bridge infrastructure that already exists (`js/lpn-time.js`, closed Task
  248). Not chlorine decay, not trace, not multi-species — those stay cut, and this row says why
  the line can be drawn narrower than the current blanket exclusion draws it.
- **CITED, why age and not chlorine:** age analysis in EPANET "requires no user-defined reaction
  coefficients and operates automatically based on… built-in zero-order kinetics" — water entering
  the network starts at age zero and simply ages one second per second (multiple independent
  summaries of EPANET's own quality engine, cross-checked: openepanet.org "Water age analysis"
  thread; a ResearchGate-indexed paper "Understanding Water Age in Distribution Systems with
  EPANET"). Chlorine decay needs bulk and wall reaction coefficients that a NEW development's
  design engineer — this seat's actual client — usually does not have and cannot honestly default;
  age needs none of that, so the "we'd have to invent a number" objection that correctly kills a
  hydrant-barrel `k` (see this journal, 2026-08-25 entry) does not apply here.
- **CITED, why this matters at exactly the scale this suite targets:** EPA's own TCR distribution
  white paper states plainly that "oversized watermains" driven by fire-flow and land-development
  codes "dramatically reduc[e] water flow velocity and increas[e] water retention time," and a
  real small-system case (City of Eureka, MO, Bartlett & West Water Quality Evaluation Report,
  2018) names "oversized watermains and ineffective tank mixing" as the identified cause of
  customer water-quality complaints (epa.gov TCR whitepaper "Effects of Water Age on Distribution
  System Water Quality"; eureka.mo.us). **This is the same failure mode the fire-flow-lateral work
  (Task 530) is built to reveal from the other direction** — a main sized for fire flow that
  almost never carries fire flow is exactly what ages water, and a system at our 10–20 node target
  scale is exactly where one oversized loop can dominate the whole network's turnover, unlike a
  2,000-node system where it is diluted.
- **Against the scope doc's "Water quality, in every form" cut:** that line was written before
  tank + EPS shipped (2026-08-14/18). The objection an all-forms cut correctly makes — reaction
  kinetics, calibration, source tracing are all real added complexity — does not describe age,
  which needs none of it. This is offered as a candidate for the same kind of narrow reopening
  tank and PRV/PSV/FCV already got, with a new, stated reason, per the scope doc's own rule that
  reopening a cut item needs a reason and not an appeal to completeness.
- **Not found / thin:** I did not find a design-standard document (Ten States Standards or
  equivalent) stating a numeric water-age target the way fire-flow standards state gpm and psi —
  the practitioner guidance I found (AWWA/EPA) is qualitative ("minimize," "avoid oversizing")
  rather than a bright-line number. A page that reported age with no stated criterion to check it
  against would be informative but not a pass/fail the way pressure and fire flow are. That gap is
  real and I flag it rather than paper over it.
- **Size:** believed medium, not small — this is a genuinely new results dimension (a fourth
  per-node/tank quantity, its own unit — time, not distance or flow — plausibly its own colour
  ramp), not a report layered on existing numbers the way Rows 1 and 2 are. Not designed.

### 4. GeoJSON export of a geographic project — small, and honestly insufficient alone

- **What:** serialize a geographic project's nodes and pipes to a GeoJSON `FeatureCollection`
  (points and linestrings in WGS84 lon/lat), which the document already stores natively per
  `dev/geographic-projects.md`'s Mercator/lon-lat design — no reprojection, no CRS choice, no new
  "being a GIS" surface, because the one coordinate system the document has IS the one the export
  would use.
- **CITED, the real-world need this gestures at:** developer as-built submittal standards commonly
  require GIS deliverables before a utility accepts new water mains — one municipal GIS-data
  requirements document found in this search calls for "ESRI GIS Feature Class within a
  Geodatabase," with water lines, hydrants, valves and service connections, GPS-accuracy
  attribution, and a **named State Plane coordinate system** (montbelvieu.net "GIS Data
  Requirements"; similar language independently in New Jersey American Water's CAD-to-GIS standard
  document, amwater.com).
- **Honest limit, stated plainly rather than left implicit:** what I am proposing does NOT satisfy
  that requirement. A real as-built submittal wants a State Plane (or similar projected) CRS, a
  geodatabase or shapefile container, and an attribute schema matching the receiving utility's own
  asset model — all of which this suite has correctly and deliberately declined to become
  (`dev/looped-network-calculator-scope.md`: *"Being a GIS… no coordinate reference systems to
  choose, no reprojection, no datum handling, no shapefile or GeoJSON import"*). A plain WGS84
  GeoJSON is at best a starting point a utility's own GIS person reprojects in a free tool (QGIS)
  in under a minute — genuinely useful to that person, not a submittal by itself.
- **Why it ranks last:** it is small and safe to build, but it answers a smaller slice of the real
  need than Rows 1–3 answer of theirs, and I would rather say that once than let the row imply more
  than it is.
- **Size:** believed small — the data already exists in the right coordinate system; this is
  serialization, not new geometry. Not designed.

---

## Promoted

### Automated available-fire-flow search at a hydrant — PROMOTED to ROADMAP Task 530, 2026-08-25

Full original case and re-derived sizing: see the 2026-08-24 and 2026-08-25 journal entries. Tom
promoted this directly to priority 75 on first read, above where I had ranked it, and the follow-up
research on the hydrant lateral assembly (diameter, roughness, `k`, length) is recorded there.
Ranking this against the rest of the list is now moot; kept here so a later invocation does not
re-propose it as new.

---

## Declined, or found and set aside — researched this pass, not proposed as rows

Per the standing rule, a declined candidate is recorded with the reason and never deleted, so the
same paper does not get re-read from scratch by a later invocation.

- **System-wide "available fire flow at every hydrant" map/report.** Real published technique
  (blog.bentley.com and multiple utility fire-flow-study pages), but every source describing it
  frames it as requiring "a very detailed (all-pipes including fire hydrant branches) and
  well-verified (calibrated)" model — hundreds to thousands of pipes. This is the same scale
  mismatch this agent already found and declined for criticality analysis (journal, 2026-08-24):
  a technique built to search a huge graph for the few things worth finding, applied to a 10–20
  node network where a human can already see the whole thing. **SPECULATION, my own:** the
  single-hydrant version (Task 530) is the right-sized cousin of this idea and is already promoted.
- **Land-use/GIS-based demand allocation** (intersecting parcel or land-use polygons with the
  network to derive node demands automatically). Real and central to how master plans are actually
  built at the utility's own scale (proceedings.esri.com "Water Demand Allocation Using GIS";
  Autodesk InfoWater Pro's "Demand Allocation Manager" documentation) — but it is GIS work by
  definition, and `dev/looped-network-calculator-scope.md` cuts "Being a GIS" outright, for reasons
  (no CRS, no shapefile import) that apply here word for word. Declined on the project's own
  standing scope decision, not on my own judgment of value.
- **As-built GIS export meeting a real municipal submittal spec** (State Plane, geodatabase,
  utility-specific attribute schema). See Row 4 above — the narrow WGS84-GeoJSON version is
  proposed; the full version is declined for the same GIS-scope reason.
- **Automated model calibration against field hydrant-flow-test data** (adjusting Hazen-Williams C
  network-wide to match measured static/residual pressures — sbmwd.org Section 7 describes this as
  standard master-plan practice). At this suite's target scale the mechanism is already the same
  one Task 530 builds: create a scenario, set the hydrant demand to the test flow, compare the
  solved pressure to the field reading, adjust roughness by hand. **SPECULATION, my own:**
  automating the adjustment loop itself is a small win layered on Task 530 rather than a
  freestanding feature; not enough on its own to earn a row, and I did not find a citation
  suggesting utilities at our target scale automate this step rather than doing it by hand once
  or twice per calibration cycle.
- **Chlorine residual / multi-species water quality**, still cut, per the reasoning in Row 3 above
  — the "cut, not deferred" line in the scope doc still correctly describes these, only age is
  proposed as a narrow exception.
