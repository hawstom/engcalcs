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

### Standing rule, added 2026-08-25 — coefficient availability is NOT a ranking criterion

Tom, reading a pass that had ranked water quality down and shaped the hydrant-lateral work partly
on "we cannot honestly default a chlorine reaction coefficient": *"Lack of coefficients is not the
same as lack of demand. Strip that criterion from our decision matrix."* He is right and it was a
reasoning error, not a style note — **whether a number is easy to source says nothing about
whether a user wants the feature.** Where a coefficient really is hard to source, that is a
disclosure/default problem to solve in the design (the pattern Task 530 already set: ask-or-
disclose, never silently invent, never silently omit), not a reason to rank the want itself lower.
**Every future row and re-rank in this file must not use "we lack a clean coefficient" as a reason
to decline or downrank.** Full correction: journal, 2026-08-25.

---

## My order (2026-08-25 pass, re-ranked after Tom's reply)

**Whether these were "really wanted," plainly, per Tom's question:** the four rows added in the
2026-08-25 research pass (demand multiplier, comparison table, fire-flow mapping, water quality)
were all **found by outward research** — I read published master plans and vendor documentation
and asked "what does that literature say a design-and-planning engineer needs," not "what have I
personally wanted." That is the honest answer to *"I assume... they didn't really want them
much."* The one row that carries something closer to a persisting want is the promoted item below
(Task 530, fire flow at a single hydrant) — it traces back to this seat's first-invocation reading
that fire flow is *"the point of the one real client report in this project"*
(`js/lpn-ramps.js:904`, journal 2026-08-24), which is closer to a standing interest than a single
literature find. Rank order below still reflects fit-to-scale judgment after the research, not
enthusiasm.

### 1. A scenario-level demand multiplier, so avg-day/max-day/peak-hour is one number, not one edit per node

Tom: *"Nice."* Unchanged from the prior pass.

- **What:** a single scalar a scenario can carry — "all base demands × 1.8" — resolved at solve
  time the same way a demand pattern already is (`demandMultiplier()`, `js/looped-network.js:21157`),
  but as one project-level knob per scenario rather than a per-node override.
- **CITED, and this is the strongest sourcing in this pass — the SAME three scenario names recur
  across every published water master plan I read, independently:** average day, maximum day (or
  max day + fire), and peak/maximum hour. San Bernardino Municipal Water District's master plan,
  Section 7 (sbmwd.org, "Hydraulic Model Development") lists exactly this triad as the standard
  model-run set; the City of Squamish 2024 Water Master Plan Update (squamish.ca) and the City of
  Astoria Water System Master Plan (astoria.gov) both structure their whole hydraulic chapter
  around the same three conditions plus fire flow.
- **OBSERVED gap:** `lpn_`'s one bulk-write tool, "Apply starting values to all elements"
  (`js/looped-network.js:17995`), is explicitly **Base-only and refuses inside a scenario**
  (`js/looped-network.js:18003`). So today there is no way to build "max day" as an overlay on
  "average day" without hand-editing every junction's demand in the new scenario — survivable at
  10 nodes, real friction at 20.
- **Roadmap disagreement, unchanged:** `dev/ROADMAP.md` Task 468 ("Demand categories on a
  junction," priority 25) is framed as import fidelity. From this seat, several master plans apply
  *different* peaking factors by land-use category, which is the natural home for a per-category
  version of this multiplier once it exists. I would move Task 468 to at least 50 (Someday) on that
  second, independent reason.
- **Size:** believed small-to-medium — the multiplier arithmetic already exists
  (`patternMultiplier`/`demandMultiplier`), so this is mainly a new scenario-level input field and
  the UI decision of how it interacts with a node's own per-node override in that scenario. Not
  designed; re-derive before quoting.

### 2. A scenario comparison table — run every scenario, one summary row each

Tom: *"Nice."* Unchanged from the prior pass.

- **What:** solve every named scenario in the project (already sub-second each, per
  `dev/looped-network-calculator-scope.md`'s own performance table) and show one row per scenario:
  minimum pressure and where, maximum velocity and where, pass/fail against a stated threshold.
- **CITED** as a real commercial feature, evidence of demand rather than of quality: Bentley's own
  WaterGEMS documentation advertises a **batch run** that computes "all your scenarios
  consecutively with only 2 clicks… get the results of multiple scenarios in one single application
  and file" (blog.virtuosity.com, "Saving Time and Money with WaterGEMS' Scenario Management";
  docs.bentley.com, "Understanding Scenarios and Alternatives").
- **OBSERVED:** nothing like it exists; results are read one scenario at a time, and the thematic
  colour-by-value view (closed Task 327) colours one field of one scenario at a time by explicit
  design.
- **Size:** believed small — a loop over existing scenario names and the existing solve, feeding a
  new summary row into the existing print-table mechanism. Not designed.

### 3. System-wide "available fire flow" mapping — RECONSIDERED, honest case for and against

Tom: *"Reconsider system-wide fire flow mapping. I say we add it at 25 or 50."* I had declined
this in the prior pass on a scale-mismatch argument borrowed from valve-isolation criticality
analysis. On reconsideration, **that borrowed argument does not transfer cleanly, and I was too
quick to decline it.** Here is the honest case both ways.

- **CITED, it is real and it is NOT a large-utility-only deliverable.** Multiple published water
  system master plans include an available-fire-flow map or table as a standard appendix — the
  Nibley City, Utah Culinary Water Master Plan (nibleycity.gov, April 2020; Nibley is a town of a
  few thousand people, the small end of the size range this literature covers) lists "Existing
  System Hydraulic Model Results" and "Available Fire Flow" maps as named appendices alongside a
  hydraulic-model-junctions map. A search summary (not independently verified against the primary
  PDF — the document returned 403 to a direct fetch, flag as secondary) states available-fire-flow
  maps are a standard master-plan deliverable "based on hydraulic models at each node" across
  multiple municipalities of varying size. This is evidence the deliverable itself is not scale-
  gated the way I originally argued.
- **Why my prior decline was the wrong argument, said plainly:** I declined it by analogy to valve-
  segment criticality analysis — "a technique built to search a huge graph for the few things worth
  finding, applied to a small network where a human can already see the whole thing." That analogy
  does not hold here. Available fire flow at a node is NOT visually obvious from the map the way
  "which valve isolates which pipe" is — it depends on the whole network's hydraulics under a
  stressed demand, which is exactly what a solver is for regardless of network size. The genuine
  scale question is a different, narrower one: is this new WORK, or an aggregation of work already
  promoted?
- **OBSERVED, and this is the real finding:** Task 530 (promoted below, priority 75) already builds
  the mechanism — an automated available-fire-flow bisection search at one hydrant, using the
  scenario/solve machinery this page already has. "Every node" is a loop over that same bisection,
  reported as a table or a colour-by-value map (Task 327's mechanism, already shipped) rather than
  a second solver or a second technique. **That materially changes the size estimate from my prior
  pass** — this is not a new capability, it is Task 530 run N times and displayed as a table.
- **What it still needs that this suite genuinely does not have, said honestly:** calibration.
  Every fire-flow-map source I found treats model calibration against field flow tests as
  established best practice for confidence in the numbers (a search summary on calibration
  practice, not a primary standard — flag as secondary, consistent with the calibration-practice
  citation already in this file's Declined section below). **This is not a blocker** — Task 530
  itself was promoted without demanding calibration, and an uncalibrated available-fire-flow number
  is still the number a design engineer works from before a field test exists (that is precisely
  what a NEW development's design engineer — this seat's actual client per the roadmap's own
  framing — is doing: sizing mains for a system that has not been built and tested yet). The
  caveat belongs in the interface ("modeled, not field-verified" — the same honesty Task 530
  already commits to), not in a decision to withhold the feature.
- **Reconsidered rank:** I now rank this ABOVE water quality, immediately after the two scenario
  rows, because it reuses Task 530's own machinery directly and produces a real, cited master-plan
  exhibit rather than a new results dimension. If promoted, I would suggest **priority 50** on
  Tom's own scale, sequenced strictly after Task 530 ships (it has nothing to loop over otherwise) —
  not 25, because it is genuinely additive work (a table/map view, a "run all nodes" control) on
  top of a task that has not landed yet, not a same-day companion to it.
- **Size:** believed small-to-medium given Task 530 exists first — a loop, a table, and reuse of
  the existing colour-by-value map mechanism (Task 327) rather than new hydraulics. Not designed.
- **UPDATE 2026-08-26, and it changes the shape of this row, not the rank.** Tom held Task 530 to
  branch `fire-flow` pending research (journal, 2026-08-26). **CITED**, WaterCAD's own Fire Flow
  Analysis (docs.bentley.com GUID-C6BF82B2) already does most of what this row asks for, in one
  pass: it runs at a single node, a selection, or **all nodes**, reports available flow at the
  target residual AND flags system-wide side effects (other node pressures, max velocity) in the
  same solve, and outputs both a tabular report and a colour-coded map. That is direct market
  evidence this row is real and shaped correctly (table + map, one run per node, compliance and
  side-effect together) — but also that the market leader defaults to **raw-node** fire flow, not
  a modelled hydrant assembly (full finding: journal, 2026-08-26 Q2). If Task 530 ships with a
  raw-node option, this row's "run Task 530 N times" plan is unaffected either way — a raw-node
  bisection is the same loop, just against the junction directly instead of through a modelled
  lateral.

### 4. Water quality — split into small, separable pieces, per Tom's instruction

Tom: *"We don't need to be guidance experts to provide water aging and even quality calculations.
I think we should add quality to our roadmap no lower than 25, possibly split into small tasks
like age, chlorine, and whatever EPANET does or the engineer wants. Don't tell the engineer 'We
don't do quality.'"* This replaces the prior pass's single narrow "water age only" row. **The
"no coefficient" reasoning that shaped that prior row is now understood to be about DESIGN, not
about DEMAND** (see the standing rule above) — chlorine is back in as a proposal, with its
coefficient problem named as a disclosure task, not a reason to decline.

**CITED, what EPANET's quality engine actually offers** (usepa.github.io EPANET 2.2 manual,
Network Modeling chapter, fetched 2026-08-25 — page content returned via a fetch-and-summarize
tool, not read from the primary HTML directly; treat the exact wording as secondary, the three-way
structure as reliable since it is corroborated by the manual's own table of contents structure):
three distinct modes — (a) **water age**, zero user input beyond turning it on, water enters at
age zero and simply accumulates time; (b) **source tracing**, "what percent of water reaching any
node... had its origin at a particular node," explicitly **non-reacting and needing no reaction
coefficient** either — internally EPANET just treats the source as a constant 100-concentration
tracer; (c) **chemical/reaction tracking** (chlorine being the practical case), which needs bulk
and wall reaction rate coefficients per pipe or globally.

**4a. Water age.** Unchanged case from the prior pass, kept as its own row rather than folded into
one "quality" row:

- **CITED** age analysis needs no user-defined coefficients — EPANET's own zero-order kinetics
  (openepanet.org "Water age analysis" thread; a ResearchGate-indexed paper "Understanding Water
  Age in Distribution Systems with EPANET"), and the EPANET manual fetch above corroborates this
  independently. **This fact is now recorded as a reason the ENGINEERING TASK is cheap, not as a
  reason age is more wanted than chlorine** — per the standing rule.
- **CITED, why it matters at this suite's target scale:** EPA's own TCR distribution white paper
  names oversized fire-flow-driven mains as a cause of long retention time; a real small-system
  case (City of Eureka, MO, Bartlett & West 2018 report) names "oversized watermains and
  ineffective tank mixing" as the identified cause of a real utility's water-age complaints
  (epa.gov TCR whitepaper; eureka.mo.us). This is the same failure mode Task 530's lateral work
  reveals from the demand side, at a scale (one dominant oversized loop) where a small system feels
  it more, not less, than a 2,000-node one.
- **Not found / thin, unchanged:** no numeric water-age design standard (a Ten States Standards-
  style bright line) — the guidance is qualitative, so a page reporting age would have no stated
  pass/fail the way pressure and fire flow do. Real gap, named plainly rather than papered over.
- **Size:** medium — a new results dimension (a node/tank quantity in time units, its own colour
  ramp), riding on the EPS + tank + EPANET-bridge infrastructure that already exists
  (`js/lpn-time.js`, closed Task 248). Not designed.

**4b. Source tracing — a new find this pass, not in the prior list.**

- **What:** report, for a chosen source node (a reservoir or a specific junction), what percent of
  the water reaching every other node in a run originated there. EPANET's own third quality mode,
  per the manual fetch above, and — like age — **needs no reaction coefficient at all.**
- **Why a design-and-planning engineer would want this, reasoned from the seat, not yet
  literature-confirmed — SPECULATION, flagged as such:** a utility with two treatment sources, an
  interconnection with a neighboring system, or a new well feeding an existing pressure zone has a
  real, recurring question — "how much of the water at this customer's tap actually comes from the
  new source, and does that change taste, hardness, or disinfectant residual downstream." That is a
  master-plan-adjacent question (siting a new source, evaluating an interconnection) but I did not
  find a citation naming source tracing specifically as a master-plan deliverable the way I found
  one for fire-flow maps — this row is weaker-sourced than 4a and 4c and I say so rather than
  dressing it up.
- **Size:** believed small once age (4a) exists — same "one tracer species, EPS-driven" plumbing,
  different `WQTYPE`. Not designed.

**4c. Chlorine / reaction-based quality (bulk and wall decay) — the piece the prior pass declined, now proposed.**

- **What:** EPANET's chemical/reaction mode — a residual (chlorine being the practical case) that
  decays via a bulk rate coefficient and, optionally, a wall rate coefficient, reported at nodes and
  in tanks over an EPS run.
- **CITED, why the coefficient genuinely is hard, and why that is a DESIGN problem, not a demand
  problem (the exact distinction the standing rule now requires):** published sources agree "there
  is no standard test to measure the chlorine bulk decay coefficient" and that without site
  calibration data engineers rely on bottle testing rather than a textbook default (search-summary
  synthesis of multiple sources, flag as secondary pending a primary read: academia.edu "Factors
  which control bulk chlorine decay rates"; ScienceDirect "Evaluation of suitable chlorine bulk-
  decay models"). Reported field values in the literature I found span roughly an order of
  magnitude (~0.04 to ~2.0 day⁻¹ equivalent, across different studies and pipe ages/materials) — a
  single silent default would be dishonest the way a silent hydrant `k` would have been.
- **The right shape, borrowed directly from the pattern this project already ruled for Task 530:**
  ask-or-disclose. A bulk/wall coefficient field, editable, with no invented default presented as
  fact — either the user supplies a value from their own bottle test or system knowledge, or the
  page states plainly that no default is offered and why, the same posture Task 530 takes toward
  the hydrant-barrel `k` before its own AWWA C502 number was found. **This is a real, solvable
  interface problem, not a reason to leave chlorine off the roadmap** — which is exactly the
  correction Tom's rule asks for.
- **Size:** medium-to-large, the largest of the three quality rows — a genuinely new class of input
  (per-pipe or global reaction coefficients, quality units, a wall-reaction toggle) plus the same
  new results dimension age needs. Believed larger than 4a and 4b combined; not designed.

### 5. GeoJSON export of a geographic project

Tom: *"I agree not important."* Kept, unchanged case, ranked last among the built rows for the
reason already stated — small to build, answers a smaller slice of a real need (a true as-built
GIS submittal wants State Plane, a geodatabase, and an asset schema this suite has correctly
declined to become) than the rows above answer of theirs.

- **CITED, the real-world need this gestures at:** montbelvieu.net "GIS Data Requirements" and New
  Jersey American Water's CAD-to-GIS standard document both specify a projected CRS and a
  geodatabase/schema a plain WGS84 GeoJSON does not satisfy.
- **Size:** believed small — the data already exists in the document's own coordinate system; this
  is serialization, not new geometry. Not designed.

---

## Rule-based controls — a fair challenge answered, not proposed as a row

Tom: *"What about Rule-based controls? Engineer doesn't care?"* I had never mentioned them; that
silence deserved the challenge. Answered from evidence, not politeness, and the answer is: **this
is an operations want, not a design-and-planning want, and I do not propose it.**

- **OBSERVED** `[RULES]` is already tracked as ROADMAP Task 248.03, open at priority 25, and its
  own entry records the reason it is parked: *"rule-based is a language, and it can wait for
  evidence that a user has one"* — simple `[CONTROLS]` already ship. I am not disagreeing with
  that parking; I am adding an independent reason from this seat.
- **CITED, what a rule actually encodes:** the canonical EPANET `[RULES]` examples are time-of-day
  and tank-level pump-switching logic — *"IF TANK 1 LEVEL ABOVE 32 THEN PUMP 1 STATUS IS CLOSED"*,
  with a second rule for the reverse, and a documented use case of changing a pump's trigger level
  by time of day (multiple corroborating summaries of the EPANET manual's own worked examples,
  cross-checked against a scribd-hosted primary excerpt titled "Epanet Rule Based Control
  Examples"). That is **operational control logic** — the thing a SCADA system or an operator
  actually runs a pump station by — not a design question about pipe sizing, storage adequacy, or
  fire flow.
- **A design-and-planning engineer's own deliverable does not need to REPRODUCE that logic to
  answer a design question.** A tank's simple fill/drain behavior under a fixed trigger
  (`[CONTROLS]`, already shipped) is enough to check whether a proposed tank has adequate
  equalization and fire storage under a design demand curve — the actual master-plan question. The
  finer question rule-based controls answer — "will THIS SPECIFIC multi-condition operating
  strategy keep the tank in range" — is a pump-station operations question, asked by whoever
  programs the SCADA logic, not by whoever sizes the main or the tank. I did not find a citation
  placing rule-based control DESIGN inside a master plan or CIP deliverable, and I looked; I found
  it inside pump-operation OPTIMIZATION research (ResearchGate/ASCE papers on rule-based pump
  scheduling), which is an operations-and-energy discipline, not a planning one.
- **Honest hedge:** if a later invocation finds a master plan that actually specifies rule-based
  logic as part of its recommended CIP (rather than leaving it to the utility's own SCADA
  integrator), that would overturn this answer and should be recorded as a correction, not folded
  in quietly.

---

## The seat Tom is filling, not me — one paragraph, as asked

Tom: *"I agree with hiring a retired field operator or maintenance inspector testing the map on
their phone."* That is his hire, not mine, but one thing from this vantage point may inform the
brief: a field operator's map use is almost certainly **read-heavy and location-anchored** in a way
this design-and-planning seat's own use is not — they are standing at a specific valve or hydrant
in the field wanting to confirm "which one is this, what's on the other side of this closed valve,"
not editing demands or comparing scenarios. If that seat finds the map hard to use, the complaint is
more likely to be about finding and reading ONE element fast (search, zoom-to, property popup
legibility outdoors in sunlight) than about anything on this wish list, which is almost entirely
about the office-side planning workflow (scenarios, batch reporting, quality). **SPECULATION,
entirely my own inference from the difference in the two seats' jobs — re-derive before relying on
it, and defer to whatever that seat actually reports once hired.**

---

## Not a row — an answer against a task, not a want

### Task 537 (field-access sharing): my ranking of the no-server shapes, and my one flat refusal

This is not something I am asking to build for my own seat's sake — it answers Tom's Task 537
question from the utility-holding-the-model side. Full citations: journal, 2026-08-25. **Order, my
own:** (1) a file via the phone's own share sheet, (2) a read-only export, (3) a URL carrying a
small model (fine at subdivision scale, name the browser/SMS-cache exposure at full-system scale),
(4) a one-way "publish to a link" **only if the link is the utility's own storage.** **I would
refuse:** any shape, including a "publish" link, where the storage is OURS rather than the
utility's own — that is the cloud-login proposal in a smaller costume, and the reason is the
utility's own legal exposure (state FOIA infrastructure-record exemptions naming water systems
explicitly), not this project's architecture preference.

---

## Promoted

### Automated available-fire-flow search at a hydrant — PROMOTED to ROADMAP Task 530, 2026-08-25

Full original case and re-derived sizing: see the 2026-08-24 and 2026-08-25 journal entries. Tom
promoted this directly to priority 75 on first read, above where I had ranked it, and the follow-up
research on the hydrant lateral assembly (diameter, roughness, `k`, length) is recorded there.
Ranking this against the rest of the list is now moot; kept here so a later invocation does not
re-propose it as new. **Row 3 above (system-wide fire-flow mapping) is its natural sequel and
depends on it.**

---

## Parked (not declined) — value granted, not building it now

Per Tom, 2026-08-25: *"Land-use GIS demand allocation is low value, but we are parking it at least?"*
— **parked, not declined.** The distinction matters: a declined row needed a reason found against
it; a parked row is one Tom already grants has some value but is not prioritizing now.

- **Land-use/GIS-based demand allocation** (intersecting parcel or land-use polygons with the
  network to derive node demands automatically). Real and central to how master plans are actually
  built at the utility's own scale (proceedings.esri.com "Water Demand Allocation Using GIS";
  Autodesk InfoWater Pro's "Demand Allocation Manager" documentation). **Parked reason, Tom's own:**
  low value relative to this suite's effort, not zero value — and it is GIS work by definition,
  which `dev/looped-network-calculator-scope.md` cuts outright for reasons (no CRS, no shapefile
  import) that apply here word for word. If that scope cut is ever revisited, this is the row that
  would follow it.

---

## Declined, or found and set aside — researched this pass, not proposed as rows

Per the standing rule, a declined candidate is recorded with the reason and never deleted, so the
same paper does not get re-read from scratch by a later invocation. **Note: system-wide fire-flow
mapping and land-use GIS allocation, formerly listed here, moved out 2026-08-25** — the first is
now Row 3 above (reconsidered), the second is Parked above (per Tom's instruction), not declined.

- **Reusable pipe/pump TYPES, ROADMAP Task 465 — researched at Tom's request 2026-08-25, and I rank
  it LOW, not a row to promote.** Full case: journal, 2026-08-25 entry "Task 465 research." Short
  version: commercial precedent splits into two features the task conflates — a non-retroactive
  "Prototype" (stamp-forward, which `js/looped-network.js:18189`'s "Apply starting values to all
  elements" already does) and a retroactive, live-linked "Engineering Library" (`docs.bentley.com`
  "Engineering Libraries", CITED — narrower than a full pipe type: pipe MATERIAL/roughness and
  pump curve DEFINITIONS, never diameter, which stays per-link in the commercial tools too).
  Roughness genuinely needs an install-year qualifier to be honest (aging/tuberculation lowers C —
  CITED, AWWA-derived roughness tables), which erodes the "one definition, 400 pipes" pitch for
  the property most people would reach for first. At this suite's own stated target
  (`dev/looped-network-calculator-scope.md:32`, "~10-20 nodes... a design decision, not a
  shortfall," 200 as headroom only), the motivating case ("edit one, 400 pipes change") cannot
  occur, and Find-and-Replace (`js/looped-network.js:7563-7660`, OBSERVED) already does the scoped
  bulk rewrite with a preview-count-before-write discipline I could not confirm the commercial
  live-linked library even has. **One narrower slice is NOT low, and is worth a later invocation's
  attention if this is ever revisited: a live-linked pump CURVE TABLE alone.** `curveRef`
  (copy-once from another pump) already exists, the Curves library panel is already a read-only
  viewer of exactly this data and its own comment names the missing piece
  (`js/looped-network.js:19466`, OBSERVED), and pump-curve reuse is the one place the commercial
  precedent is unambiguous (no aging wrinkle, no diameter conflation) — CITED,
  `docs.bentley.com` "Pump Definitions Dialog Box", "Export to Library." That is a candidate split
  of 465, not a promotion of 465 whole.

- **As-built GIS export meeting a real municipal submittal spec** (State Plane, geodatabase,
  utility-specific attribute schema). See Row 5 above — the narrow WGS84-GeoJSON version is
  proposed; the full version is declined for the GIS-scope reason.
- **Automated model calibration against field hydrant-flow-test data** (adjusting Hazen-Williams C
  network-wide to match measured static/residual pressures — sbmwd.org Section 7 describes this as
  standard master-plan practice). At this suite's target scale the mechanism is already the same
  one Task 530 builds: create a scenario, set the hydrant demand to the test flow, compare the
  solved pressure to the field reading, adjust roughness by hand. **SPECULATION, my own:**
  automating the adjustment loop itself is a small win layered on Task 530 rather than a
  freestanding feature; not enough on its own to earn a row, and I did not find a citation
  suggesting utilities at our target scale automate this step rather than doing it by hand once
  or twice per calibration cycle.
