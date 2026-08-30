# Utility design and planning engineer — journal

Written by the `utility-planning-engineer` agent, read by its next invocation. Tom and other
agents may read it. Anyone else who writes here signs the line — see the CORRECTION tag.

**Every entry carries one provenance tag.** CITED = external source, named, quotable
later. OBSERVED = this repository, `path:line`, quotable later. SPECULATION = the
agent's own inference, to be re-derived before anyone relies on it. An untagged entry
is a defect. **CORRECTION** marks a line written by someone other than this agent, fixing a
factual error; it is never removed silently.

Newest at the top. Date every entry. Keep an entry to a few lines; if it needs more,
it is a `dev/*.md` and the entry is one line pointing at it.

---

## 2026-08-30 — Task 530 shipped: Tom's three post-ship questions, sourced

`js/looped-network.js:25674` ships `maxVelocity` default 5 ft/s with the comment *"5 ft/s is the
velocity most agencies write into a fire-flow criterion"* (OBSERVED). Tom asked whether that
number is right and whether 10 ft/s (his own guess) would be better. Went and checked.

### Q1 — the 5 ft/s default is low against every FIRE-FLOW-SPECIFIC number I could source; recommend 10 ft/s

**CITED — City of Vacaville, CA, "Fire Flow Information"** (cityofvacaville.gov, search-synthesis
only — the page 403'd on direct fetch, so treat as secondary though the same figure recurred
verbatim across two independent search passes): *"all fire flows are based on a required minimum
residual pressure of 20 psi and a maximum pipe velocity of 10 feet per second."* This is a
fire-flow-condition velocity, stated beside the pressure criterion the way ours is.
**CITED — Rancho California Water District's own design specifications PDF** (pacificpipeline.com
mirror, search-synthesis only, the PDF would not render through either WebFetch or a local reader):
*"during maximum day demand plus fire flow conditions, velocity in distribution pipelines and
service laterals shall be no more than 15 feet per second."*
**CITED, primary text, fetched directly and read in full — San Bernardino County Special
Districts, "Standards for Domestic Water Systems," §1.7.01 (2020 revision,
`specialdistricts.sbcounty.gov`):** *"The velocity of the water in the pipe shall be limited to
8-feet per second maximum, except in hydrant branch lines."* This is the one primary document I
could actually read end to end. Two things matter about it: (a) it is 8 ft/s, not 5 — still above
our shipped default — and (b) it governs sizing for THREE conditions at once (peak hour, peak day
+ fire flow, nighttime replenishment), i.e. it is a general design velocity, not fire-flow-specific,
**and it explicitly EXEMPTS hydrant branch lines from the limit** — the one place a pipe is
expected to carry a fire flow, the standard declines to cap velocity at all. That is direct
evidence the general "5-8 ft/s for normal operation" number and the "what's tolerable for the
duration of a fire" number are different questions, and conflating them is very likely how a 5
ft/s got written into our own comment — 5 ft/s is squarely a NORMAL-operation number (Crane
Technical Paper 410's "reasonable velocities... up to 7 ft/sec," WMWD's 5.0 fps for minimum-hour
demand per search synthesis), not one I found any fire-flow-specific source using.
**CITED — NFPA 14 (standpipes), search-synthesized via a secondary blog, not fetched primary:**
"permits velocities up to 20 ft/s... a mandatory requirement," offered only as the outer bound of
what fire-protection piping standards (as opposed to distribution-main standards) tolerate; NFPA 24
(fire mains) itself carries no mandatory ft/s limit in this same secondary source, only a
non-binding 10 psig velocity-pressure annex note.
**NOT FOUND: a published numeric default for WaterCAD's or InfoWater's fire-flow velocity
constraint.** Both vendors' own help pages (`docs.bentley.com`, `help.autodesk.com`, both fetched
directly) confirm the CONTROL exists — "Velocity Limit... constrains pipes with options for No
Pipes, Connecting Pipes, or Entire Network" (round 4 entry, already on file) — but neither publishes
a shipped default value in the pages I could reach. Say plainly: I did not find it, not "it doesn't
exist."

**Recommendation: raise the default from 5 to 10 ft/s.** Every fire-flow-specific number I could
source clusters 8–15 ft/s (Vacaville 10, Rancho 15, San Bernardino's general-but-branch-exempt 8),
and Tom's own guess sits in the middle of that range rather than at either end. 5 ft/s is not
supported by any fire-flow-specific citation found this pass; it reads like the ordinary
normal-operation design velocity, mis-carried into the fire-flow test. This is a one-constant
change (`js/looped-network.js:25683`) — not proposing it myself, since the code and its comment
are Tom's/the project's to change, but the sourcing supports his instinct over the shipped number.

### Q2 — the one-wide-table market convention is real and confirmed at the vocabulary level, not the pixel level; recommend collapsing our two reports

**CITED, primary text fetched directly, `help.autodesk.com` "Fireflow Run Results" (InfoWater
Pro):** the vendor ships (at least) FOUR separate predefined report shapes — Standard, **Design**,
Extended Time, and Conditions — and the **Design Fireflow Report is already the wide, one-run,
both-halves table** Tom's screenshot resembles: `ID, Capacity Assessment (PASS/FAIL), Total
Demand, Hydrant Available Flow, Critical Node ID for Design Run, Critical Node Pressure at
Available Flow, Critical Node Pressure at Fire Demand, Critical Pressure for Design Run, Hydrant
Design Flow, Hydrant Pressure at Design Flow, Critical Node Pressure at Design Flow, [optional]
Critical Pipe ID / Velocity for Design Run`. That is available-flow AND design-flow, one row, one
run — exactly what our own round-3 finding already recorded the market doing, now with the actual
column list behind it.
**What "Critical Asset" and "Design constraint" MEAN, sourced:** "Critical Node ID for Design Run"
is *"the node within the Critical Node Searching Range with the lowest pressure when the current
nodal junction is loaded with the total demand"* — i.e. not the hydrant under test, but whichever
OTHER junction the fire flow hurts worst. That is our own "collateral effect" concept
(`dev/fireflow-analysis-plan.md`, still on the `fire-flow` branch per Task 530's block) with a
name. "Design constraint" I could not find as a literal InfoWater column header — the nearest is
"Critical Pressure for Design Run" (the minimum pressure the constraint enforces) alongside a
`Capacity Assessment` PASS/FAIL that is itself silent on WHICH constraint bound (pressure vs.
velocity vs. minimum-system-pressure) — so if Tom's screenshot literally reads "Design constraint"
as a named column, **that is likely a newer or third-party UI I could not independently source**;
flag as unconfirmed rather than claim InfoWater's own pages showed it to me.
**CITED — Autodesk's own "One Water Blog," 9 Jan 2026, "Make smarter asset decisions and get
better fire flow insights in InfoWater Pro 2026.2"** (title and existence confirmed by two
independent search passes; the page itself 403'd on direct fetch, so the column-level detail below
is search-synthesis, not primary-read): a **"Criticality Analysis module"** shipped as a technical
preview in January 2026, tied to *"Asset Impact Reporting"* — *"reports that summarize the impact
of each asset in the system, as experienced across all simulated hydrant fire flow conditions."*
This is very likely the actual source of Tom's screenshot — it is recent enough (this month, by
this suite's own clock) that it postdates every InfoWater page this seat had already read as of
the 2026-08-27 round-4 entry, which explains why "Critical Asset" as a literal column wasn't found
in the older help pages. **Not fully confirmed — the exact column layout in the 2026.2 UI is not
something I could read directly** — but the concept (asset-level criticality rolled up across a
whole sweep, not just per-junction) is real, named, and shipped this year.
**Iterations — worth showing, cautiously.** WaterGEMS's own help (search-synthesis via a secondary
mirror of Bentley's Automated Fire Flow Results wiki page) defines it plainly: *"the number of
iterations required to hone in on the fire flow result"* via *"a series of steady-state
analyses."* Ours (`js/lpn-fireflow.js`, `LOSS_ACCOUNTING = 'raw-node'`, OBSERVED, Task 530 block)
is a bisection with a known, bounded solve count per junction — showing it is honest and cheap,
and it is exactly the kind of number an engineer reading a submittal would use to sanity-check
that a run actually converged rather than hit a solver's iteration cap. It is not noise if it is
labelled as "how many trial flows this junction took," which is a fact about the SOLVE, not a
result the engineer is meant to act on directly — same status as our own transparency ruling on
`LOSS_ACCOUNTING` (Task 530 block, OBSERVED).
**A row that fails before an available flow is found:** none of the vendor pages I read describe
this explicitly, but the shape of `Capacity Assessment: FAIL` plus a populated `Total Demand` and
an EMPTY or zeroed `Hydrant Available Flow`/`Hydrant Design Flow` is the only internally
consistent reading of a PASS/FAIL column sitting beside flow columns that can be null — worth
naming as SPECULATION, mine, re-derive before relying on it: a table row should show what WAS
computed (pressure at the tested demand) and blank, not zero, whatever bisection never reached.

**Say plainly: yes, collapse the two reports into one wide table.** The market's own convention
(InfoWater's "Design Fireflow Report") is a single row per junction carrying both halves — exactly
what Task 530's round-3 entry already recorded and what our own engine already computes in one run
at zero extra cost (Task 530 block, "THE DESIGN HALF COSTS ZERO EXTRA SOLVES"). Splitting into two
reports when the underlying computation is already unified is presenting our own architecture to
the reader instead of the answer they came for. **Vocabulary is ours to write, not theirs**
(CLAUDE.md `lpn_` section) — "Critical Asset" reads as ours already under a different name (the
junction the design half most affects), and the constraint that bound (pressure vs. velocity) is
already a value we compute and could simply state in a column rather than name after a market
term I could not confirm at the pixel level.

### Q3 — InfoWater's Domain is real, user-created, and NOT a default "everything starts here" bucket; Tom's Domain1 assumption is not supported by what I could read

**CITED, primary text fetched directly, `help.autodesk.com` Fireflow page (already on file from
round 4):** the Critical Node Searching Range control's fourth choice is literally named "Domain
Nodes," with the note *"The domain option will be available only when a domain has already been
created."* That sentence is the whole finding: a Domain does not pre-exist. There is no
"Domain1" a network starts in — the option is grayed out/absent until the user has made one.
**CITED, search-synthesis of Innovyze's own forum + help pages (`forums.innovyze.com`,
`help.innovyze.com`, both blocked on direct fetch — Confluence/JS-rendered pages returned no text
to WebFetch, so this is secondary):** a Domain is a **user-named, user-created subset of network
elements**, built from one of six sources — *"Map Selection, DB Query, Query Set, Selection Set,
Special Query and/or Network"* — and used for two things: **bulk Group Editing** ("assigning
values globally on the fly") and **scoping an analysis** (the fireflow searching-range option
above, plus a separate "Run Fireflow on Domain Only" checkbox that limits which hydrants get
TESTED, not just which nodes get checked for collateral damage). A **Selection Set** is a flatter,
static sibling — *"essentially just a list of element IDs"* — that a Domain can be built FROM.
**Tom's assumption is corrected, gently: everything is NOT initially in a Domain1.** The
documented behavior is the opposite — nothing is in any domain until a user deliberately builds
one, and the UI's own domain-scoped options are simply unavailable (not "select all," not a
default) in the meantime. This is a meaningful difference from his mental model and worth
recording exactly because he can't check it himself (standing brief).

**My own judgment on whether to build this, ranked LOW, willing to say so plainly:** a Domain is
two things bundled — (1) a NAMED, SAVED selection, and (2) that selection used as a SCOPE for an
analysis or a bulk edit. This suite already has half of (1) — `js/looped-network.js`'s Find panel
has a live query language (OBSERVED, referenced in prior wishlist entries on this page) — and all
of (2) informally, since a fire-flow sweep already takes an explicit node list rather than always
running on the whole document (`js/lpn-fireflow.js`, OBSERVED, "a chosen set of junctions"). What
InfoWater's Domain adds beyond that is exactly the piece Task 530 deliberately left out and named
its reason for leaving out: **"a per-junction requirement... is a table of criteria"** and no named,
reusable, SAVED selection object exists yet to hang such a table off of. So the real gap a Domain
concept would answer here is not "how do I run fire flow on a subset" (already possible) but "how
do I NAME and REUSE a subset across runs, group edits, and reports without re-selecting it every
time" — which is a much smaller, more honest ask than "build Domains." **At this suite's own
stated ~10-20 node target scope** (`dev/looped-network-calculator-scope.md`, OBSERVED, cited
before), a saved-selection-as-a-named-set is a real, if modest, want; a full multi-method
Domain-builder (six creation paths, a Domain Manager dialog, group-edit wiring) is InfoWater-scale
tooling for InfoWater-scale models, and I would not build the general version here. **Ranking my
own find low relative to Task 530's own open items** — it is a nice-to-have that would make a
future named-selection feature (if one is ever wanted) slightly better scoped, not something I'd
put ahead of anything already queued.

---

## 2026-08-29 — Wish-list Row 1 designed: the undesigned piece (override × multiplier) answered

Row 1's own honest gap — "not designed: the UI decision of how it interacts with a node's own
per-node override" — was called in to be built this session. Four questions answered, source and
repo both read.

### Q1 — override then multiply, or multiply then override escapes it?

**CITED — EPANET's own OWA-EPANET Toolkit 2.3 `[OPTIONS]` reference and independent corroboration
(`wateranalytics.org/EPANET/_options_page.html`, and a WebFetch summary of the same toolkit text via
search) state Demand Multiplier scales EVERY node's demand unconditionally: "adjust the values of
baseline demands for all junctions and all demand categories... actual demand = multiplier × base
demand," with no per-node opt-out mechanism named anywhere in the option's own description.** EPANET
itself has no per-node "override that skips the multiplier" concept to test against, because EPANET
has no scenario layer at all — a junction's `[JUNCTIONS]` base demand is just whatever number is in
the file, and the multiplier always acts on it.
**CITED — WNTR's `options.hydraulic.demand_multiplier` behaves identically** (search synthesis of
`usepa.github.io/WNTR/options.html` and the `wntr.metrics.hydraulic` source, not fetched primary this
pass — flag secondary): it scales `junc.demand_timeseries_list` when computing expected demand, a
single scalar in `WaterNetworkOptions`, applied uniformly with no per-junction escape.
**I could not reach WaterGEMS/WaterCAD's own Alternative-vs-peak-factor documentation directly**
(two WebFetch attempts on `docs.bentley.com` and a Bentley community thread both returned only
navigation chrome, no body text) — **flag this half of Q1 as NOT FOUND, not confirmed either way**,
rather than papering over it with the EPANET/WNTR answer by assumption.
**OBSERVED, and this is the load-bearing finding for THIS repo specifically:**
`resolvedDemand()` (`js/looped-network.js:24621-24633`) already answers this exact question for the
override this suite already has. A scenario's per-node `demand` override (`LPN_OVERRIDABLE.node.demand`,
`js/looped-network.js:2315`) is read through `effective(n, 'demand')` — REPLACING Base's row(s) — and
the result is THEN multiplied by both `demandMultiplier(n, t)` (the pattern) and `docDemandMultiplier()`
(the document-wide `[OPTIONS]` multiplier, Task 553): `total * dm` at line 24632, `rows[0].base *
demandMultiplier(n, t) * dm` at line 24625. **There is no escape hatch today. An overridden demand is
multiplied exactly like a Base demand is.** That is precedent already built and shipped, and it agrees
with EPANET's and WNTR's own convention: **override replaces the base value that then gets multiplied,
never the final value that escapes the multiplier.** I found no third convention anywhere in the three
sources I could actually inspect. **A reviewer reading a submittal built on this suite would expect
the multiplier to apply to a scenario's own overridden hydrant demand too** — that is what "max day is
avg-day × 1.8" means as a sentence: everything scales, including the one node someone typed a number
into by hand, unless that number was deliberately typed AS the max-day value already (which is a
different, ordinary case — the user just doesn't ALSO apply the multiplier there, by not creating an
override at all, or by setting a scenario multiplier of 1 and living with the rest hand-edited — not a
mechanism the software needs to build).

### Q2 — is a scenario multiplier a fourth multiplier too many, and should the existing global one become scenario-overridable instead?

**Yes, and yes.** Counted the stack that already exists: (1) base demand, (2) demand-category rows
summed (Task 468), (3) pattern multiplier at time t (per-category, defaulting to the project pattern),
(4) `settings.hydraulics.demandMultiplier` — the EPANET `[OPTIONS]` one, Task 553, **document-global,
one number for the whole project, not scenario-scoped** (confirmed by reading `docDemandMultiplier()`
itself, `js/looped-network.js:24617-24620`, which reads `settings.hydraulics`, never `activeScenario()`).
Adding a NEW, separately-named "scenario demand multiplier" field would be a fifth concept doing work
functionally identical to the fourth. **The honest fix is not a new field — it is making Task 553's
existing multiplier scenario-overridable**, because that is also the more EPANET-faithful shape: EPANET
itself has exactly ONE demand multiplier, one per file, and this suite's own scenario mechanism is
already the tool for "what if this file's numbers were different" (Task 184's whole premise). A
"max day" scenario IS, in EPANET's own terms, a different value of the SAME option in a differently-
configured export — not a second, unrelated knob.
**OBSERVED, and this is the good news: the mechanism this needs already exists, just not wired to this
field.** A scenario is a plain object `{id, name, isBase, overrides}` (`js/looped-network.js:2236`,
`:2511`). `LPN_OVERRIDABLE`/`effective()`/`setOverride()` (`js/looped-network.js:2314-2420`) is the seam
for ELEMENT properties (node/link/label, keyed `ovKey()`) and is the wrong seam for this — a demand
multiplier is not a property of a node or a link, it is a property of the SCENARIO ITSELF. **The clean
design is a scalar field directly on the scenario object** (`scn.demandMultiplier`, alongside
`overrides`), read as: scenario's own value if set, else `settings.hydraulics.demandMultiplier` (today's
document default, effectively what Base already means), else 1. This sidesteps the
`scenario_seam_check.php` write-seam rule entirely rather than fighting it — that guard exists to stop
a scenario write from silently corrupting Base's ELEMENT data, and a scenario-only scalar with its own
storage slot never touches Base at all, cleaner than routing it through `setProp()`. **SPECULATION, my
own design, not yet built or reviewed — re-derive before quoting as decided.**

### Q3 — what must the popup show

**A per-node breakdown of every multiplicative factor is noise, not clarity**, by this suite's own
already-ruled precedent: Tom decided the popup MAY show Base Demand and Demand as the same number
twice on purpose (journal, 2026-08-26 entry on `demandPatternActs`, OBSERVED) because repetition
that carries a meaning is welcome and a synthesized "why these differ" explanation is not needed
per-field. Applying that same instinct here: the node popup needs exactly what it already shows —
**Base Demand** (what's typed, or the override typed in this scenario) and **Demand** (fully
resolved, pattern and multiplier folded in, matching what the solver actually used) — and does NOT
need a third line decomposing "×pattern ×multiplier" per node, which would repeat the SAME scenario-
wide number on every junction's popup for no new information. **What DOES need to be visible, and is
not a node-level fact:** the scenario's own multiplier value, once, somewhere a person reads the
scenario as a whole — the natural home is wherever the scenario is named/selected (a scenario
properties row, parallel to how `settings.hydraulics.demandMultiplier` already has its own Settings
row today, `js/looped-network.js:21119`), not injected into every popup. **SPECULATION, mine, not
reviewed** — the guiding rule I am applying (repetition of the SAME fact across many nodes is noise;
a scenario-level fact belongs at the scenario, not smeared across every element that happens to be
affected by it) is my own inference from the popup precedent, not a separately-sourced UX finding.

### Q4 — Scenario or Run?

**Scenario, cleanly, and Tom's own Task 530 correction settles it rather than leaving it open.**
**CITED, Tom, Task 530 follow-up (recorded in this journal 2026-08-27, Q2):** *"a scenario contains
modeling data that a simulation uses... a run generates an output source"* (paraphrasing InfoWater's
own distinction, which Tom adopted). A demand multiplier is exactly "modeling data a simulation
uses" — it changes WHAT the network's demand configuration is, the same category as a per-node
demand override, which is already scenario data (`LPN_OVERRIDABLE.node.demand`, OBSERVED). It is not
an output, not a solve method, not a time step — it has no business on a not-yet-built Run object,
whose whole job (per the same entry) is to be "a compute event and its stored output," a different
axis entirely. **Cost of guessing wrong, stated plainly:** if this were built against the not-yet-
existing Run concept, it would have nothing to attach to today and would block on unrelated,
unscoped work (Run Manager, ranked by this seat's own wish list as the LAST of five fire-flow phases,
`wishlist.md`, OBSERVED) that Tom has not asked for. Building it on Scenario costs nothing extra now
and is the same shape a future Run would read FROM (a Run names a scenario among its parameters,
per the same quote) — so building it on Scenario is not a guess that a later Run redesign would have
to undo; it is the layer a Run is defined to sit on top of.

### Net answer to row 1

**Do not add a new "scenario demand multiplier" field.** Make the existing Task 553
`settings.hydraulics.demandMultiplier` scenario-overridable via a scalar directly on the scenario
object (not the node/link/label `effective()` seam, which is the wrong door for a document-level
option). Resolution order: node's effective demand (override if the scenario set one, else Base) ×
pattern multiplier × the scenario's own demand multiplier (or the document default if the scenario
did not set one) — exactly the order `resolvedDemand()` already uses for the document-wide multiplier
today, extended by one more level of "does the scenario override this," which is the same pattern
every other overridable quantity on this page already follows. Interface: no per-node breakdown row;
show the scenario's multiplier once, at the scenario, the same way the document default already gets
one Settings row.

---

## 2026-08-26 — Task 530 follow-up: emitter citations upgraded to primary text, and a fourth mechanism (PDA) found and weighed

Same-day re-pass at the orchestrator's request. The prior entry below answered all three of Tom's
questions but flagged several load-bearing claims as "search synthesis, could not fetch the primary
page directly." This pass went back and fetched the primary pages directly. Nothing below overturns
the prior verdict; it hardens the citations and adds one option the prior pass did not surface.

- **CITED, upgraded from secondary to primary — fetched `usepa.github.io/EPANET2.2/3_network_model.html`
  directly this pass.** Verbatim: *"The flow rate through the emitter varies as a function of the
  pressure available at the node: q = C·p^γ."* And, on fire flow specifically: emitters *"can also
  be used to... compute a fire flow at the junction (the flow available at some minimum residual
  pressure). In the latter case one would use a very high value of the discharge coefficient (e.g.,
  100 times the maximum flow expected) and modify the junction's elevation to include the equivalent
  head of the pressure target."* This is now a direct read of the primary EPANET 2.2 manual page, not
  a forum summary — it matches the prior entry's finding word for word and removes the "secondary"
  flag from that claim.
- **CITED, additivity confirmed from the primary toolkit reference — `wateranalytics.org/EPANET`
  (OWA-EPANET Toolkit 2.3, the successor reference to the 2.2 manual, same organization that now
  maintains EPANET).** *"Actual demand reported in the program's results includes both the normal
  demand at the junction plus flow through the emitter,"* and *"Sum of Demand equals the sum of the
  node's consumer demand, emitter flow, and leakage flow."* Also found there, worth carrying forward
  as its own caution: *"The pressure-flow relation at a junction defined by an emitter should not be
  confused with the pressure-demand relation when performing a pressure dependent analysis (PDA)"* —
  the manual itself treats these as two different mechanisms, which is the next finding.
- **CITED, a fourth, EPANET-native mechanism the prior pass did not surface: Pressure Driven Analysis
  (PDA), built into EPANET 2.2 itself** (`codedocs.xyz/OpenWaterAnalytics/EPANET/md_ReleaseNotes2_2.html`;
  `wateranalytics.org/EPANET/_options_page.html`) — an `[OPTIONS]` line, `DEMAND MODEL PDA`, with
  `MINIMUM PRESSURE`, `REQUIRED PRESSURE` and `PRESSURE EXPONENT`: below minimum pressure a node gets
  zero demand, above required pressure it gets full demand, in between demand scales as a power
  function of available pressure — solved as one coupled system, not per-node. **This project already
  runs EPS through this exact engine** (`js/lpn-epanet.js`, `CLAUDE.md` OBSERVED), so PDA is not a
  hypothetical add-on, it is a mode of the vendored solver. **The important limit, also CITED from the
  same page: `MINIMUM PRESSURE`/`REQUIRED PRESSURE`/`PRESSURE EXPONENT` are set once, globally for the
  whole network, not per node** in EPANET 2.2's native implementation — so PDA cannot natively express
  "this node's required fire flow is 1,500 gpm, that one's is 500 gpm" as a pressure target; it can
  only say "every node's target residual is 20 psi," with per-node fire demand still supplied as an
  ordinary per-node demand value (which EPANET already allows per node).
- **CITED, and this closes the question of whether PDA is actually how a full sweep is done today —
  it is not, at least not in the market leader.** Fetched the same WaterCAD Fire Flow Analysis page
  directly this pass (`docs.bentley.com`, GUID-C6BF82B2): *"A complete fire flow analysis can
  comprise hundreds or thousands of individual flow solutions — one for each junction selected for
  the fire flow analysis,"* and *"the program will iteratively assign lesser demands until it finds
  the maximum flow that can be provided while maintaining the pressure constraints."* That is
  per-node bisection under ordinary demand-driven analysis (DDA) — **the page makes no mention of PDA
  anywhere.** So the market-leading tool answers "available flow at every node" the same way our
  branch does (repeated bisection, one full network solve per trial per node), not with one PDA solve
  for the whole system. I raised PDA as a candidate shortcut before finding this; the citation says
  the shortcut is not what the industry actually ships, so I am not recommending it as the sweep
  mechanism — it is worth naming in a design doc as a known alternative with a real limitation (global,
  not per-node, pressure targets), not as the answer.
- **OBSERVED, and this is a real, cheap answer to "what does a full sweep cost," from this repo's own
  measured numbers, not extrapolation.** `dev/fireflow-loss-table.md` (OBSERVED, read this pass)
  already benchmarked one hydrant's bisection search (16 solves) on this branch's own solver: **9
  junctions → 17 ms; 49 junctions → 42 ms; 225 junctions → 498 ms, all at 16 solves per hydrant.**
  A full sweep is that number times the node count: at 225 junctions, 225 × 498 ms ≈ **112 seconds**
  — almost exactly Tom's own expectation, *"a big analysis that could take minutes to run for a big
  system"* (ROADMAP Task 530), independently landing on the same order of magnitude he predicted
  before I found this number. **What I could NOT do:** measure or safely extrapolate to a genuinely
  large system (1,000–2,000 junctions, this seat's own stated scale) — growth from 49→225 junctions
  was worse than linear (12× junctions, only ~5× time... actually 12x time for 4.6x junctions, i.e.
  worse-than-linear), so a straight-line extrapolation to 2,000 nodes would be a guess dressed as a
  number. **Flag as SPECULATION if anyone extrapolates past 225** — re-measure at the actual scale
  before quoting a "minutes at 2,000 nodes" figure to Tom.
- **Net effect on Q1 (the emitter question) and Q2 (the sweep):** no reversal. The emitter mechanism
  is real, documented, and distinct from a fixed demand exactly as Tom suspected; the honest three-way
  menu (raw-node bisection / modelled-assembly bisection / emitter-trick single-solve-per-node) from
  the prior entry stands, now on primary citations rather than search summaries, with PDA added as a
  fourth, real, EPANET-native option that the market leader itself does not use for this job and that
  this project should therefore not reach for as a shortcut either — worth one sentence in a future
  design doc, not a fourth product to build.

---

## 2026-08-26 — Task 530 held to a branch: the emitter question, and whether "model the assembly" is the standard at all

Tom pulled the fire-flow work to branch `fire-flow` pending research, and asked four questions.
Full findings below, in his stated order of how much they decide.

### Q1 — THE EMITTER QUESTION, from EPANET's own docs, not a forum summary

**CITED**, EPANET 2.2 manual/toolkit (usepa.github.io/EPANET2.2/3_network_model.html;
epanet22.readthedocs.io mirrors the same text): an emitter's flow is `q = C·p^γ` — genuinely
**pressure-driven** (γ≈0.5 for a nozzle), and its flow is **ADDITIVE to the junction's normal
demand**, not a substitute for it — confirmed by the results-field definitions themselves: "Actual
Demand" at a junction sums normal demand plus emitter flow, and `SumDemand` sums consumer demand +
emitter flow + leakage (search synthesis of the toolkit's own parameter list; I could not fetch the
toolkit PDF page directly, flag as secondary-but-consistent across three independent mirrors of the
same text). **Tom's doubt is correct on the physics**: an emitter cannot represent a fixed fire-flow
demand, because it is not a demand at all — it is a pressure-dependent orifice. But the same manual
names **fire-flow analysis explicitly as one of three intended emitter uses** (alongside
sprinklers/irrigation and leak simulation), via a specific trick: give the junction a very large
discharge coefficient (documented example: "100 times the maximum flow expected") and raise its
**elevation** by the target residual head, so the emitter equation returns zero flow exactly at the
target pressure and effectively unlimited flow above it — the emitter is not modelling a fixed
demand, it is using its own pressure-sensitivity to let the solver find "how much flow drives this
node down to exactly 20 psi" in one solve instead of an external bisection loop. **Both things Tom
suspected can be true at once, and the practitioner literature says so directly**: an OpenEPANET
forum thread (`openepanet.org/Topic/22362`) has one practitioner asking exactly the emitter question
and a named respondent (Istvan Lippai, who reappears making the same argument in the `/22142` thread
Tom found) answering **"Emitters have many good uses but I do not believe that fire flow computation
is one of them,"** and recommending instead modelling the tee/reducer/valve/nozzle with their own
minor-loss coefficients — component-by-component, the same shape our branch already took. A second
practitioner in the same forum (Arnold Strassers, `/22142`) uses a computed emitter coefficient (543
for a 4½ in nozzle in gpm units) routinely and without caveat. **Read together: the emitter trick is
real, documented in EPANET's own manual, and used by some practitioners as a fast way to get "flow
at 20 psi" in one solve — and a second, credentialed voice in the same community explicitly prefers
modelling the assembly instead, for the same reason our branch already chose it: a component built
from real fittings is auditable and reusable across hydrants; a fitted emitter coefficient is a
black box calibrated to one target pressure.** Neither is wrong; they are different products,
exactly as the task brief guessed. **This project should not present an emitter as "the" way to do
fire flow — it is a legitimate documented shortcut, contested inside the profession itself, and the
branch's assembly approach is the more defensible of the two by at least one named practitioner's
own stated preference**, not merely by nobody-here's rediscovery of component hydraulics.

### Q2 — is raw-node analysis the standard, and does the 20 psi criterion "absorb" the hydrant?

**Partially confirmed, partially not.** **CITED** WaterCAD's own Fire Flow Analysis
(docs.bentley.com, GUID-C6BF82B2) computes fire flow **"at junction locations"** directly — it does
not model a hydrant/lateral assembly as a separate element inside that analysis. That is real
evidence for "raw-node is the market-leading tool's default." But **CITED**, WaterCAD/WaterGEMS's
own separate Hydrant *element* (docs.bentley.com "Hydrant Attributes"/"Hydrants," found in last
pass) DOES carry an optional lateral length/diameter/minor-loss toggle — so the same vendor ships
BOTH a raw-junction fire-flow tool and an optional hydrant-assembly element, and leaves the choice
to the user with no published default for either. **The "20 psi is a fat factor for the unmodelled
hydrant" claim does not hold up against what I found.** **CITED**, the sourced rationale for 20 psi
(National Board of Fire Underwriters origin, carried into NFPA/AWWA) is stated as a
**backflow/negative-pressure safety margin** — preventing sub-atmospheric pressure that could
collapse pipe or draw contamination into the main — not as an allowance for unmodelled hydrant
hardware (industrialmonitordirect.com NFPA/fire-hydraulics summaries; secondary, not the NFPA
primary text, which I could not reach). I found nothing tying the number itself to hydrant-loss
absorption; that piece of Gemini's synthesis looks like a plausible-sounding but uncorroborated
inference, and I say so rather than repeating it. **Independent corroboration of our own K≈5 (3–6
psi) hydrant-loss number, found by a different route than Task 530's AWWA C502 search:** the same
OpenEPANET fire-flow thread (`/22083`) has practitioner Charlie Moore stating **"By allowing 5 psi
loss through the hydrant you are being conservative"** — a working professional's own number lands
inside the range Task 530 derived independently from AWWA C502 QA specs. That is real, if
secondary, confirmation the branch's number is in the right neighborhood.

### Q3 — the whole-system output, and is it one analysis or two

**CITED**, WaterCAD's Fire Flow Analysis does BOTH of Tom's questions **in one run, not two**: it
reports the compliance number (available flow at the target residual) at the tested node/nodes AND
evaluates side effects — "residual pressure at that node, the Minimum Zone Pressure, and, if
applicable, the Minimum System Pressure and maximum velocity" — flagging constraint violations
elsewhere for the user to review, and it runs a baseline no-fire steady state for comparison. **So
Tom's instinct that these are two questions is right in substance (available/required vs.
does-it-break-something-else are conceptually distinct checks with distinct pass/fail criteria), but
the market leader answers both from one solve per tested node**, not two separate analyses/runs —
worth correcting before this becomes "two analyses" in a design doc. Output shapes, all CITED from
the same page: a per-junction results tab, a **tabular report** across selected/all nodes, and a
**colour-coded results-browser map**. That is direct evidence for what a user expects to be handed:
a table AND a map, not one or the other. **On "required fire flow": CITED**, WaterCAD does not
supply an ISO/code-derived number automatically — the user types "needed fire flow" per node/zone.
That matches this project's own standing posture (ask-or-disclose, never invent); a system default
by land-use or ISO table would be new work with its own citation trail, not something the market
leader ships for free either.

### Q4 — the time question: which demand condition, and steady vs. extended-period

**CITED**, convergent across an independent forum synthesis (calichi.com; a compiled OpenEPANET
thread, `/22083`) and general design-standard search results: **US practice adds fire flow to
maximum-day demand, not average-day (too generous) or peak-hour alone (too pessimistic/unrealistic
on top of fire)** — a design-standards search phrase converged on the same "max day + fire" framing
independently of the forum. **CITED**, the same forum thread names real jurisdictional variance:
Germany uses peak-hour demand at the average day of the year; the Netherlands uses maximum hourly
demand of the year; one US practitioner (Kevin Williams) runs "max day peak hour" **as an
extended-period simulation** ("a little conservative, but not unrealistic"), while another treats
fire flow as inherently a **steady-state check at max day** because "fire events require specific
control sets... making it more sensible to simulate fire under steady state condition." **My read:
there is no single settled answer, but max-day-demand-plus-fire is the dominant US convention,
evaluated as a single steady condition by most sources I found, with EPS-at-max-day-peak-hour as a
named, acknowledged-conservative alternative some practitioners run.** Tom's question ("don't we
need to let the user choose the peak hour or time step for an EPS run?") is answered **yes, if fire
flow is offered against an EPS run at all** — the literature is explicit that fire is loaded onto a
*specific, user-chosen* demand condition, never "the EPS as a whole." Given `lpn_`'s EPS already
lets a user scrub to a frame and set a scenario, the natural fit is: fire flow is evaluated at a
frame the user has navigated to (or a named "max day" scenario), not as its own time-stepped
simulation.

### Verdict on the branch's premise, asked for directly

**The branch is not built on a false premise, but it is built on the LESS common of two legitimate
approaches, and Tom's instinct to hold it for a selectable/transparent design was correct.** The
market-leading paid tool defaults to raw-junction fire flow and treats the hydrant assembly as an
optional add-on element with no default coefficients of its own — closer to "the fat factor absorbs
it" in *practice* even though I could not confirm that reasoning in the 20 psi standard's own
history. Our branch's choice to model the barrel/lateral as real pipe segments is the position
argued for by name by at least one credentialed practitioner over the emitter shortcut, and it is
what WaterCAD's own optional Hydrant element also does when a user turns lateral-loss modelling on.
**Recommendation: ship BOTH postures, and say which one a given result used.** Raw-node (fast,
matches the market-leading default, defensible under "20 psi already carries margin") should be the
zero-configuration path; the modelled-assembly path (already built) should be the disclosed,
selectable upgrade Tom asked for — not the only path, and not silently applied. That also resolves
Q3's report cleanly: a single fire-flow run per node, reporting compliance AND system-wide side
effects together (as WaterCAD does), with a visible flag for which hydrant-loss posture produced the
number.

---

## 2026-08-25 — Task 537: my half — how a model moves today, and who may legally hold it

Tom split Task 537 across two seats: the field operator answers whether they even want the file;
this seat answers how sharing actually works and whether "put it on the cloud" clears a utility's
own legal/organizational bar. Full findings below; the short answer is **no, and not for an
architecture reason — for a legal-exposure reason a utility's own counsel would give.**

- **CITED, how the market's own answer works, and what it actually is underneath.** Bentley's
  ProjectWise integration for WaterGEMS is check-out/check-in of a **file** (`*.wtg` +
  `*.wtg.sqlite`), one editor locked at a time, with document history
  (docs.bentley.com, "Working with ProjectWise"). Even the enterprise answer is a governed FILE, not
  a live shared database — ProjectWise is a purchased, administered add-on product, which is itself
  evidence of scale: it exists for utilities and consulting firms large enough to buy and run
  document management, not for a modest system. **I found no citation of ordinary small-utility
  practice below that tier** (a direct "engineers just email the `.inp`" source did not turn up),
  so I say plainly: the file-by-email/shared-drive practice below ProjectWise's tier is my own
  inference from the shape of the market (nothing below the enterprise product, and CAD/GIS
  deliverables at this scale are conventionally exchanged as files) — **flag as SPECULATION, not
  found directly**, though it is consistent with how this suite's own submittal deliverables move
  (a `.inp` or a saved project, attached).
- **CITED — a utility's network model is not hypothetically sensitive; multiple states have already
  legislated that it is.** A summary of state FOIA carve-outs (search synthesis of Kentucky
  §61.878, Pennsylvania's Right-to-Know Law, and a Washington statute, cross-corroborated across
  three independent search results — I could not directly fetch the primary statutory text, Kentucky's
  site returned 403 and the PDF at awwaneb.org, "State FOIA Laws: A Guide to Protecting Sensitive
  Water Security Information," is image-only and did not OCR — **flag as secondary, not read
  primary-source**) states that multiple states exempt from public disclosure "detailed drawings,
  schematics, maps, or specifications of... utility... systems" and infrastructure records that
  "expose vulnerabilities through disclosure of the location, configuration, or security of critical
  systems, including public utility critical systems," **naming water and wastewater explicitly**.
  **CITED, federal layer:** AWIA (2018) risk and resilience assessments are excluded from federal
  FOIA (epa.gov AWIA §2013 material), but **has no automatic exemption from a STATE or local FOIA**
  — so protection is real but jurisdiction-dependent, and a utility's own counsel, not a general
  federal rule, is what actually decides whether a given document may leave the premises.
- **What this means for the cloud-login proposal, stated as the utility's own reason, not an
  architect's:** a small utility's IT/legal review is not being asked "is this vendor's encryption
  good enough" — it is being asked to hand a **complete network topology of a system already
  identified by name in state law as the kind of record whose disclosure could "expose
  vulnerabilities"** to a volunteer project with no SOC 2, no incident-response contract, no data
  processing agreement, and no institutional accountability if it is breached or simply disappears.
  **That is not a close call for a risk-averse public agency, and it is the utility's reason, not
  ours: they would be creating a NEW disclosure/breach liability where none exists today**, because
  today the model lives on one employee's machine and is covered by whatever records-retention and
  device policy already governs that machine — nothing new to defend in an audit. A free, no-login,
  local-only tool is the one shape that never has to answer this question, because it never holds
  the fact pattern the exemption law is written about.
- **The honest scale caveat, so this is not overstated:** the sensitivity above scales with what the
  file actually shows. A subdivision-scale Elm Street Center model (a hydrant, three homes) is not
  the fact pattern any FOIA exemption was written for; a whole-system master-plan model with every
  valve and main is closer to it. **This project's stated mission scope (300 km span,
  `CLAUDE.md`, OBSERVED) sits on the side of the line where the concern is real for at least the
  larger end of its own declared audience**, so the caveat does not make the concern go away, it
  just says it is not uniform across every file this suite will ever hold.
- **Ranking Task 537's no-server shapes from this seat, honestly, and what I would refuse.** (1) **A
  file via the phone's own share sheet** — ranks highest: it is exactly the CAD/GIS deliverable
  pattern utilities already run today under their existing device and records policy, adds no new
  risk surface, and needs nothing built beyond what a browser's native share/save already does.
  (2) **A read-only export** — close second, and arguably the RIGHT default for this specific
  seat: "only the user touches a file's numbers" (`CLAUDE.md`, OBSERVED) already treats an imported
  file as untouchable by us, and an operator who can view but not corrupt the designer's live
  numbers is a smaller failure mode than handing over an editable project. (3) **A URL carrying a
  small model** — ranked third, with a real caveat named rather than glossed: a URL is copyable,
  gets cached in browser/SMS history, and can sync to a personal cloud account (iCloud/Google) the
  utility never vetted — fine for a subdivision-scale extract, a live version of the same exposure
  named above for a full system. (4) **A one-way "publish from the desk to a link"** — the one I
  would flag hardest, and the one to watch for scope creep: it is fine ONLY if "the link" points at
  storage the UTILITY already controls (their own intranet, their own file share); the moment
  "publish" implies a link WE host, it has quietly become the cloud-login proposal in a smaller
  costume, and Task 537's own instruction — say what happens to "nothing you draw is uploaded" as
  the first paragraph — would apply to it exactly as it would to logins. **I would refuse that
  version outright**, for the same reason as logins: it is this project, not the utility, deciding
  to hold the utility's sensitive record.

---

## 2026-08-25 — correction: coefficient availability is not a demand criterion; wish list re-ranked

**CITED — Tom, replying point-by-point to the prior wish-list pass:** *"Lack of coefficients is not
the same as lack of demand. Strip that criterion from our decision matrix."* This is a correction of
a reasoning error in my own prior work, not a stylistic note, and it is recorded here so a later
invocation does not re-import the bad criterion.

- **What I had done wrong, named plainly:** Row 3 of the 2026-08-25 research pass ranked "water age
  only" above chlorine partly BECAUSE age needs no user-supplied reaction coefficient and chlorine
  does — and the same reasoning shaped my Task 530 hydrant-`k` recommendation (favoring "model the
  barrel as a pipe" partly to avoid needing a separately-sourced coefficient). **That conflates two
  different questions: does a user want this, and is a number easy for me to source.** They are
  unrelated. A design engineer wanting chlorine residual reporting is not diminished by the fact
  that the bulk decay coefficient has no textbook default.
- **The corrected rule, going forward:** a missing or hard-to-source coefficient is a DESIGN
  problem — solve it with ask-or-disclose (a user-editable field, no invented default presented as
  fact, the interface states plainly when no default is offered and why) — not a reason to decline
  or downrank a want. This is exactly the shape Task 530 already committed to for the hydrant `k`
  before a sourced number was found, and it should have been generalized then rather than only after
  Tom pointed it out.
- **What actually changed when I re-applied this:** water quality is back in as three separable
  rows (age, source tracing, chlorine/reaction) rather than one narrow age-only row with chlorine
  declined; Task 530's own reasoning about the barrel is reworded so the pipe-segment recommendation
  stands on its hydraulic merits (an undersized waterway is a real hydraulic element) rather than on
  coefficient-avoidance as a design goal in itself.
- **What did NOT change, checked honestly rather than assumed:** re-reading every other row in the
  prior pass (scenario multiplier, comparison table, GeoJSON export, the declined system-wide
  fire-flow and land-use-GIS items, the automated-calibration decline) — none of their reasoning used
  coefficient availability as a criterion. **The stripped criterion only ever touched water quality
  and the hydrant-`k` framing; it did not move any other ranking**, and I say so rather than
  manufacturing movement elsewhere to look more responsive. Full re-ranked list: `wishlist.md`.
- **Also answered this session, recorded there rather than duplicated here:** fire-flow mapping
  reconsidered and promoted into the ranked list (Tom asked me to reconsider, not to comply — the
  case for and against is written out in `wishlist.md` Row 3); land-use-GIS demand allocation moved
  from Declined to Parked per Tom's distinction between the two; rule-based controls answered as an
  operations want, not a design-and-planning one, from evidence (EPANET's own `[RULES]` worked
  examples are pump/tank SCADA logic, not a sizing question).

---

## 2026-08-25 — Task 530 follow-up: the k I said did not exist was hiding under a different name

Tom ruled *"including some k whatsoever is non-negotiable"* and asked for the number to be
researched hard before falling back to reasonable judgment. My same-day entry below said flatly
**"NOT FOUND, and I looked"** for a published k or head-loss curve for a hydrant's internal
waterway. That was too quick — I had searched hydraulics textbooks and manufacturer marketing
copy, not **procurement specifications**, and that is where the number actually lives.

- **CITED — the number, found twice independently.** Two unrelated documents both state:
  *"Friction loss shall not exceed 3.0 psig at 1000 GPM through the hydrant 4-1/2 in. pumper
  nozzle"* — the Bryan/College Station TX joint municipal water design standard, Section 33 12 19
  Fire Hydrants (bcsunited.net, revised 3/2024, explicitly tied to "AWWA C-502 latest revision,"
  tested by an independent lab, PE-attested), and American-Darling/Waterous's own product
  specification sheet for their ALPHA-base hydrants (american-usa.com), independent of each
  other and agreeing to the tenth of a psi. This is a **maximum-allowable QA test limit under
  AWWA C502**, not a textbook K — which is exactly why hydraulics references never carry it and
  manufacturers only ever say "minimizes friction loss" in prose: the actual number lives in
  procurement boilerplate, not in a hydraulics table. **A search summary (unverified against the
  primary text — flag as secondary) said the AWWA C502 baseline itself is 5.0 psi at 1000 gpm and
  that 3.0 psi is a tightened municipal/manufacturer spec** — I could not reach the primary
  standard to confirm 5.0 psi directly; the 3.0 psi ceiling is doubly corroborated and is the
  number I use.
- **This converts to a real K, referenced to the 6 in lateral/shoe pipe** (the standard connection
  size per my prior entry): 3.0 psi = 6.93 ft of head at Q=1000 gpm. In a 6 in pipe, V=11.35 ft/s,
  V²/2g=2.00 ft, so **K ≈ 3.5** for the hydrant's own barrel + main valve + nozzle alone, as a
  worst-case-allowable (conservative-for-design) value — real hydrants that pass QA perform at or
  better than this, so using the ceiling under-states available flow rather than over-stating it,
  which is the right direction to be wrong in a fire-flow tool.
- **CITED, standard-fitting build-up for the rest of the assembly** (tee off the main, lateral
  isolation gate valve, elbow into the riser) — Crane Technical Paper 410's own method,
  K = n·f_T, corroborated independently across simupipe.com, midstreamcalculator.com and a
  general-engineering K-table search: gate valve fully open K≈0.15, flanged 90° elbow K≈0.3–0.5,
  tee flow-through-branch K≈1.0. **Build-up subtotal ≈1.5.** These are widely published,
  textbook-standard values — unlike the hydrant barrel term, this part of the list was never the
  gap.
- **Recommended total: K ≈ 5 (range 3–6), referenced to the lateral pipe's own velocity, and
  labelled honestly in two pieces** — the barrel/valve/nozzle term (~3.5, from a real AWWA C502
  QA ceiling) dominates, and the lateral-fitting build-up (~1.5, from Crane) is the smaller,
  fully-standard remainder. Never present the sum as one measured number; the provenance of each
  half is different and a user should be able to see that.
- **THE ARITHMETIC TOM ASKED FOR, done and corrected once already** (I made a 10x Hazen-Williams
  error on the first pass — a units-mismatched textbook constant I half-remembered — and caught it
  by cross-checking against the velocity form V=1.318·C·R^0.63·S^0.54 and against Darcy-Weisbach;
  all three now agree). At Q=1000 gpm through 6 in C=140 cement-lined DI pipe: **friction loss is
  64.5 ft per 1000 ft** (V=11.35 ft/s, well above any normal design velocity, which is exactly why
  it is large). Against the fixed 6.93 ft hydrant-barrel loss: at a **25 ft lateral** (Addison TX's
  standard), friction = 1.6 ft, **minor loss is 4.3× friction**; at **50 ft** (Northlake/Clyde Hill),
  friction = 3.2 ft, minor loss is **2.2× friction**; at **100 ft** (Prosper TX's outer limit),
  friction = 6.5 ft, **the two are about equal, 1.07:1**. The ratio depends almost entirely on
  lateral length and weakly on flow (∝Q^0.148/L) — checked at 500 gpm too, same conclusion within
  a few percent. **Verdict: across the whole realistic range of lateral lengths found in real
  design standards, minor loss is never smaller than friction loss and is usually 2–4× it.** That
  is a real, quantified, moderate version of Tom's worry — not the 10–40× dominance my first
  (wrong) pass would have reported, which is why the "show your work" instruction mattered here.
- **Q4 — is hose/nozzle analysis past the outlet standard practice for a distribution model?
  NO, clean no, and here is the boundary.** AWWA M31 (required fire flow) and NFPA 291 (rated
  capacity, hydrant flow testing) both define hydrant performance strictly AT THE HYDRANT OUTLET —
  a pitot reading, not a delivered stream. WaterGEMS/WaterCAD's own Hydrant element (docs.bentley.com,
  "Hydrant Attributes" and "Hydrants") stops at exactly the same boundary: it has a
  `Minor Loss Coefficient (Hydrant Lateral)` / diameter / length toggle ("Include Lateral Losses")
  and nothing past the nozzle — **no hose network, no nozzle pressure, no hand-line modeling
  anywhere in the leading commercial tool.** Fire-ground hydraulics (hose friction loss, nozzle
  reaction, pump discharge pressure) is IFSTA/NWCG pump-operator territory with its own manuals and
  its own inputs (hose lay, chosen at the fire scene, not known to the utility's model at design
  time). Carrying the analysis past the outlet would be building a second profession's tool inside
  this one; the option is closed.
- **Corroborating find, not the headline:** WaterGEMS/WaterCAD's own hydrant element ships with
  the identical three fields Tom specified — minor loss coefficient, diameter, length of the
  lateral — **and no published default for any of them**, confirmed by fetching both the WaterCAD
  and HAMMER "Hydrant Attributes" pages directly. Even the market-leading paid tool leaves this to
  the user. That is independent confirmation that "the research is thin" was the correct read of
  the field, not a failure of this agent's first search — the AWWA C502 QA-spec number is the one
  piece of ground truth that exists ANYWHERE, and it was worth the second pass to find it.
- **Library "type" fields (Q5) — minimal set recommended:** make, model, main-valve/waterway
  diameter (4½ or 5¼ in per AWWA C502 — the number that actually constrains flow, distinct from
  the 6 in shoe), outlet configuration (count and size of nozzles), and the k itself (editable,
  defaulting to the ~5 recommendation above, with its two-part source visible). **Deliberately
  left out:** installation year and NFPA 291 colour class — both are per-instance, time-varying
  FACTS ABOUT ONE INSTALLED HYDRANT (age, and a field-tested rated capacity that depends on that
  hydrant's own main pressure on the day it was tested), not properties of a reusable type; baking
  either into a saved type would go stale silently. Lateral diameter/length/roughness stay
  per-instance ad-hoc inputs exactly as Task 530 already scopes them — they are site geometry, not
  hydrant type.
- **What this project's own heads would have gotten wrong:** both Tom's ruling and my own same-day
  entry assumed the honest ending was "no defensible number exists, be reasonable, don't swallow a
  camel." The literature is better than that assumption — there IS a real, twice-corroborated,
  quantified industry number, it is just filed under AWWA C502 QA testing and municipal
  procurement boilerplate rather than under "hydraulics" or "K-factor," which is exactly the kind
  of place nobody inside a hydraulics-calculator codebase would think to search without being
  told the number might not look like a K at all.

---

## 2026-08-25 — market-research pass: wish list grown from one row to four new plus one promoted

Tom, reacting to a one-row wish list: *"I am disappointed that their wish list is not
overwhelmingly long. Increase their research budget."* This entry is the outward-research pass;
full case, citations and honest sizes are in `wishlist.md` — this is the compressed index.

- **Row 1 (ranked highest): a scenario-level demand multiplier.** **CITED** three independent
  published master plans (San Bernardino MWD Section 7, sbmwd.org; City of Squamish 2024 update,
  squamish.ca; City of Astoria, astoria.gov) all structure their hydraulic chapter around the same
  three named conditions — average day, maximum day (+fire), peak hour. **OBSERVED** the one
  bulk-write tool `lpn_` has ("Apply starting values to all elements," `js/looped-network.js:17995`)
  is Base-only and refuses inside a scenario (`:18003`) — so building "max day" over "average day"
  today means hand-editing every junction, which stops being "one line" work well before 20 nodes.
- **Row 2: a scenario comparison table (batch run).** **CITED** Bentley's own WaterGEMS docs
  advertise exactly this — "batch run… results of multiple scenarios in one single application…
  with only 2 clicks" (blog.virtuosity.com, docs.bentley.com) — read as evidence of demand, not of
  quality, per this agent's standing instruction. **OBSERVED** nothing like it exists; results are
  read one scenario at a time, and the closed Task 327 colour-by-value view is one-field-one-scenario
  by explicit design ("two quantities coloured at once is a map with two legends").
- **Row 3: water age only, a narrow crack in the blanket "water quality, in every form" cut.**
  **CITED** EPANET's age analysis "requires no user-defined reaction coefficients… built-in
  zero-order kinetics" (openepanet.org, a ResearchGate-indexed paper on EPANET water age) — unlike
  chlorine decay, it needs no coefficient a design engineer would have to invent, which is the exact
  failure mode that killed a sourced hydrant-barrel `k` in the entry below. **CITED** EPA's own TCR
  distribution white paper and a real small-system case (Eureka, MO, Bartlett & West 2018 report)
  both name oversized fire-flow-driven mains and poor tank turnover as the actual cause of water-age
  complaints — the same failure mode Task 530's lateral work reveals from the demand side. **Thin
  spot, named plainly:** no numeric water-age design standard found (Ten States Standards or
  equivalent) — the guidance is qualitative, so a page reporting age would have no stated pass/fail
  the way pressure and fire flow do.
- **Row 4 (ranked last, honestly): plain WGS84 GeoJSON export of a geographic project.** **CITED**
  real municipal as-built GIS submittal requirements exist and are specific — State Plane CRS,
  Esri geodatabase, utility asset schema (montbelvieu.net "GIS Data Requirements"; New Jersey
  American Water CAD-to-GIS standard) — and I state plainly that a raw WGS84 GeoJSON export does
  NOT satisfy that requirement; it is at best a five-second head start for a utility's own GIS
  person in QGIS, not a submittal. Small to build, small in what it actually solves.
- **Roadmap disagreement, stated once:** Task 468 ("Demand categories on a junction," priority 25
  Maybe) is framed on `dev/ROADMAP.md` purely as import fidelity ("the breakdown the importer
  already flattens"). From this seat it is worth more — several master plans apply *different*
  peaking factors by land-use category, which is exactly what demand categories would carry once a
  scenario multiplier (Row 1) exists. I would move it to at least 50 (Someday) on that second,
  independent reason.
- **Declined, with reasons recorded in `wishlist.md` so they are not re-read from scratch:**
  system-wide fire-flow mapping (needs a calibrated, detailed model at a scale this suite correctly
  declines), land-use/GIS demand allocation (real, but "Being a GIS" is already cut for reasons that
  apply word for word), full as-built GIS export meeting a real spec (same GIS-scope reason),
  automated calibration against field flow tests (folds into Task 530's mechanism, not a
  freestanding win at this scale, **SPECULATION**), chlorine/multi-species water quality (stays cut).
- **What this project's own heads would have gotten wrong:** nobody inside this repo would have
  found the master-plan literature's insistence on the avg-day/max-day/peak-hour triad (Row 1) —
  it is outward evidence about a workflow this project has never had to run, and it is the one
  finding this pass that changed my own ranking mid-research (I expected the comparison table,
  Row 2, to rank first, until three independent master plans converged on the same three scenario
  names and made the multiplier the thing without which the table has nothing to compare).

## 2026-08-25 — Task 530 research: the hydrant lateral assembly, so the wizard can ask or disclose

Tom promoted my Task 530 wish to priority 75 and ruled it must ask-or-disclose diameter, roughness,
`k` and length of a lateral+hydrant add-on, applied ad hoc before reporting fire flow. Findings,
each independently searched, no primary AWWA/NFPA text reached (M17, C502, C503 are all behind the
ANSI store paywall — previews only, same posture as `rc`'s unreachable Robinson paper).

- **CITED** Lateral diameter and length: five US municipal water-system design standards, found
  independently, agree on 6 in (150 mm) minimum lateral diameter and disagree on max length by 4x:
  Addison TX 25 ft max (addisontx.gov, water_system_requirements.pdf), Prosper TX 100 ft max
  (prospertx.gov Water-System-Design-Requirements), Northlake TX 50 ft max / 8 in required beyond 20 ft
  (town.northlake.tx.us Part-IV-Water-and-Wastewater-Lines), Clyde Hill WA 50 ft max / 8 in beyond 50 ft
  (codepublishing.com/WA/ClydeHill/13.08). **A defensible default is 6 in DI, ~25–50 ft** — the
  *diameter* is near-universal across the sample; the *length* is genuinely site-specific (distance
  from main to hydrant location) and no single number is honest as a silent default.
- **CITED** AWWA C502 dry-barrel hydrants: main-valve waterway is 4½ in or 5¼ in (ANSI/AWWA C502-18
  preview, webstore.ansi.org); **the inlet/shoe connection to the lateral is standardized at 6 in
  (150 mm)**, mechanical-joint or flanged per AWWA C111/A21.11 (directindustry.com NAFFCO C502
  listing; multiple manufacturer spec sheets, e.g. mh-valve.com Style 929). **This resolves what
  Tom meant by "a 150 mm barrel": it is the standard hydrant SHOE connection, not the internal
  waterway** — the two numbers differ (150 mm inlet vs 114–133 mm waterway) and a model that only
  represents the inlet pipe size would still overstate capacity, because the internal valve opening
  is the tighter constraint in most hydrants, and older/smaller hydrants in real systems (4 in valve,
  or pre-C502 stock) are tighter still.
- **CITED** NFPA 291 rated-capacity color code, at 20 psi residual: Class AA ≥1,500 gpm (light blue),
  Class A 1,000–1,499 (green), Class B 500–999 (orange), Class C <500 (red) — consistent across
  independent secondary sources (blog.ansi.org NFPA 291-2019 summary; loslunasnm.gov; allfirefighter.com).
  Primary NFPA 291 text not reached (NFPA free-access reading room requires login I did not attempt).
- **CITED** ISO's insurance grading practice caps the fire-flow credit from a single hydrant at
  1,500 gpm regardless of what the main could otherwise deliver, and grades multi-hydrant credit down
  by distance (1,000 gpm within 300 ft, 670 gpm 301–600 ft, 250 gpm 601–1,000 ft) — found independently
  via blog.bentley.com ("Where Did This Equation for Hydrant Flow Test Results Come From?") and an
  eng-tips.com thread quoting the same ISO rule. **This is the standard practitioners already use to
  avoid the exact failure Tom named** — not a k-value cap but a flat ceiling applied to the reported
  number, independent of what the hydraulics alone would say.
- **CITED** Pitot-gauge field flow testing (a DIFFERENT measurement from what a model reports) uses
  Q = 29.83·Cd·d²·√P with Cd = 0.90 (smooth, rounded outlet, most modern hydrants) or 0.80 (square,
  sharp outlet, common on older stock) — consistent across IFSTA/NFPA-sourced summaries
  (industrialmonitordirect.com NFPA 291 explainer; multiple hydrant-flow-calculator sites citing the
  same constant and coefficient pair). **This Cd is NOT the lateral's minor-loss `k`** — it converts a
  pitot reading at a flowing 2½ in outlet to gpm; it has no direct bearing on how our wizard should
  model the barrel, but it is worth knowing the two numbers are unrelated so nobody imports 0.9 as a
  `k` by pattern-match.
- **CITED** One anonymous forum post (eng-tips.com, via search summary, not independently verified) put
  a number on why a 6 in lateral at 1,500 gpm is a rough ceiling: velocity near 17 ft/s through a
  90° turn at the hydrant base at that flow. **I could not reach the original thread to confirm the
  arithmetic myself** (6 in pipe, 1,500 gpm ≈ 17 ft/s is dimensionally close — I did not independently
  recompute it, flag as SPECULATION-adjacent until re-derived) — but the shape of the claim matches
  every design standard above: a 6 in lateral is undersized for 1,500 gpm by any normal design
  velocity limit (5–10 ft/s is the usual range in the same design standards, e.g. Northlake's 8 in
  upsize rule exists for exactly this reason), so the wizard's own hydraulics, given a 6 in lateral,
  will already show a large loss at high flow WITHOUT a separately-sourced k for the hydrant body.
- **CITED** DI pipe Hazen-Williams C: AWWA/DIPRA cite C=140 for cement-lined new ductile iron, aging
  toward ~120 over ~20 years (uni-bell.org "Ductile Iron Pipe's Hazen-Williams Flow Coefficient
  Declines Over Time"; pe.mcwane.com DIPRA hydraulic-savings sheet). For a 20–50 ft lateral this barely
  matters in absolute head loss — C=120 vs C=140 on 50 ft of 6 in pipe at fire flow is a few hundredths
  of a foot either way — so roughness is the cheapest of the four to default.
- **SUPERSEDED 2026-08-25 by the follow-up entry at the head of this file — DO NOT ACT ON THIS
  BULLET.** The number does exist. It is a maximum-allowable friction-loss spec in AWWA C502's QA
  clause (3.0 psi at 1000 gpm through the 4½ in pumper nozzle), quoted verbatim in municipal design
  standards and in manufacturers' own spec sheets, and it works out to **K ≈ 3.5** for the barrel.
  What was wrong here was not the searching but the **filing**: it is indexed under manufacturing QA
  and procurement boilerplate, not under "hydraulics" or "K-factor". Left standing rather than
  deleted because the lesson is the search, and because a later invocation that finds only the
  correction learns nothing about where to look next time.
- ~~**NOT FOUND, and I looked**~~: a published `k` (minor-loss coefficient), equivalent length, or
  head-loss-vs-flow curve for a dry-barrel hydrant's own internal waterway (the AWWA M17 number).
  Every hydrant manufacturer spec sheet I reached (Mueller Super Centurion, M&H 129/929) claims
  qualitatively that its valve geometry "minimizes friction loss" and none published a curve or
  coefficient. AWWA M17 itself (the document that should carry this) is paywalled beyond a preview.
  ~~**This is the one number in Tom's list of four I cannot honestly disclose a sourced default
  for.**~~ — false, see the correction above.
- **SPECULATION, AND NOW PARTLY OVERTAKEN**: this proposed modelling the barrel as a pipe segment
  *instead of* carrying a k. Tom ruled that some k is non-negotiable, and a sourced k was then
  found, so the answer is BOTH — barrel and lateral as pipe, plus a k of about 5. The reasoning
  below is still the right reasoning about why an undersized waterway matters.
- **SPECULATION**, my own, re-derive before relying on it: given the missing k, the wizard is better
  served by modelling the hydrant barrel as a short pipe segment at its actual waterway diameter
  (4½ in or 5¼ in, disclosed, user-editable) in series with the lateral, rather than inventing a k
  for an unmodeled "point" hydrant — the velocity-squared loss through an undersized barrel then
  emerges from the same Hazen-Williams/Darcy-Weisbach machinery already in `js/PipeHydraulics.lib.js`
  and needs no separately-sourced coefficient at all. This also directly produces the number Tom
  wants: a report that a 150 mm-shoe hydrant with a 4½ in waterway cannot pass an enormous flow,
  because the waterway is now a real hydraulic element, not a caveat.

## 2026-08-24 — first invocation: "what glaring priority did we miss?" → nothing glaring

- **ANSWER GIVEN: nothing glaring.** Reasoning and citations below. Also named one real,
  small, honestly-scoped want (automated available-fire-flow bisection) at Maybe priority,
  explicitly flagged as NOT glaring — the manual path already works.
- **CITED** AWWA M31 defines *required fire flow* as the rate at 20 psi residual for a
  specified duration. **CITED** EPANET itself has NO automated fire-flow tool — commercial
  add-ons (WaterCAD, H2Onet) or a free standalone (Optiwater's `FireFlow`, a bisection
  wrapper around an `.inp` file) do it, confirmed across multiple openepanet.org forum
  threads and optiwater.com/fireflow.html. **So a gap here is not a gap against EPANET —
  matches `dev/positioning.md` §2's "never write a completeness claim against EPANET."**
- **OBSERVED** `lpn_`'s scenario mechanism (`js/looped-network.js`, closed Tasks 184/201)
  already lets a user override one node's demand, re-solve (sub-second per
  `dev/looped-network-calculator-scope.md`'s linear-solve table), and read pressure —
  which is the manual version of the bisection FireFlow automates. `ROADMAP Task 512`
  shows Tom doing exactly this in his own Elm Street file today ("two fire-flow
  junctions" as named scenario overrides). **This is why I did not promote it: the
  workflow exists and is fast, only the search-for-the-max-flow step is unautomated.**
- **CITED** Valve-isolation / segment-criticality analysis is a real, published utility
  technique (multiple 2023–2025 journal papers, WNTR's segment tool) but every source I
  found frames it at hundreds-to-thousands-of-pipes scale — it is a technique for finding
  the few valves that matter in a huge graph. **This suite's target scale is 10–20 nodes
  by deliberate decision** (`dev/looped-network-calculator-scope.md`), so at that size a
  criticality analysis has almost nothing to find — a human can see which valve isolates
  which pipe by looking at the map. Declining to build this is scope match, not a miss.
- **CORRECTION (orchestrator, 2026-08-24)** Task 468 is NOT closed — it is open at priority 25
  (`dev/ROADMAP.md:654`, "Demand categories on a junction"). The entry below lists it as closed and
  then as open in the same breath. The reasoning that reached "nothing glaring" does not depend on
  it, but a later invocation must not quote it as shipped.
- **OBSERVED** Checked before answering, so as not to invent a gap already closed: colour-
  by-value/thematic pressure map (Task 327, closed), demand categories (Task 468, closed),
  extended-period simulation including tank fill/drain under patterns (Task 248, closed
  except 248.03 rules), customer demand accounting (Task 247/468, open but designed) all
  already answer pieces of what a naive "system-scale gap" guess would have reached for
  (storage adequacy, multi-scenario demand, spatial pressure survey).
- **SPECULATION** If a later invocation wants a stronger candidate than fire-flow
  automation, the more interesting one is probably **storage tank adequacy under a design
  demand curve** (equalization + fire + emergency storage, Ten States Standards-style) —
  EPS + tank + pattern support all exist, so it may already be buildable as a *reporting*
  layer (read tank level range over a run, compare to a target) rather than new solver
  work. Not researched; re-derive before proposing.
- **OBSERVED** This journal's first-invocation guess (".inp interoperability and large-
  node-count behaviour is probably the strongest contribution from this seat") held up on
  a second look — nothing found this session displaced it, and the roadmap shows .inp
  import/export both already shipped and taken seriously (Task 281, 483 family).

## 2026-08-24 — seat defined

- **OBSERVED** This agent replaced a first draft aimed at a rural water system operator
  (`git log` — commit 95c52d37). That seat was invented and wrong: EngCalcs' people are
  consulting design engineers who serve utilities, not utility staff.
- **CITED** Tom Haws, 2026-08-24, defining this seat: a *"utility design and planning
  engineer (not so unlike Mary and me, but with much bigger fish to fry; Novato/Net3 (on
  the small side!) vs Elm Street Center and Dance Properties)"*. Scale is the perspective.
- **OBSERVED** Fire flow — the point of the one real client report in this project — exists
  in shipped code as a pressure threshold comment (`js/lpn-ramps.js:904`) and otherwise
  almost entirely as a scenario NAME in test fixtures. 3 hits across `lib/`, `js/`, `*.php`.
- **SPECULATION** The strongest contribution from this seat is probably about `.inp`
  interoperability and behaviour at large node counts, not about the calculators. Re-derive
  this before relying on it; it is my first-invocation guess, not a finding.
- **CITED** Tom Haws, same day, on why this seat is unverifiable from inside the project:
  *"Scale is my big and first blind spot. I only know Elm Street Center. I have never worked
  for the City of Novato. I have designed many Elm Street Center projects, but no Novatos."*
  Consequence: CITED matters more in this journal than in any other, because nobody here can
  catch a fluent invention by recognising it.

---

## 2026-08-25 — Task 465 research: reusable pipe/pump TYPES ("editing one edits 400")

Tom asked this seat to research Task 465 before it moves off Maybe. Findings below, then my
recommendation: **leave it parked.** The two mechanisms it would provide already exist here in a
form I judge safer than what the commercial precedent documents.

**1. Does a real utility's model work this way — and is it used, or does it sit idle?**
**CITED**, and the answer splits into two DIFFERENT features the task conflates:
- **"Prototype" (WaterCAD/WaterGEMS)** is a stamp-forward template only — it sets starting values
  for elements drawn AFTER the prototype is set; it is not retroactive
  (docs.bentley.com "Creating Prototypes"; corroborating YouTube "WaterCAD Hacks: Build Models
  Quickly Using Prototypes"). This is functionally what this suite already ships as "Apply
  starting values to all elements" (`js/looped-network.js:18189`, OBSERVED) — Base-only, one
  click, shows a carriers/changing count before writing.
- **"Engineering Library" (WaterGEMS)** is the retroactive one, and it is genuinely live-linked:
  "When you change the properties for an item in an engineering library, those changes affect all
  hydraulic models that use that library item" (docs.bentley.com, "Engineering Libraries", fetched
  2026-08-25). It covers **pipe MATERIAL** (roughness) and **pump curve DEFINITIONS** — not a full
  "pipe type" bundling diameter. A Bentley community thread titled "How can I global edit the pipe
  material and have the roughness update?" (communities.bentley.com/.../10853, title confirmed,
  body did not load — flag as thin/secondary) is real evidence a practitioner asked this exact
  question, which is evidence of DEMAND for the narrow material-roughness case specifically, not
  for a general type system.
- I found no documentation describing a confirmation step, a preview, or a change count before an
  Engineering Library edit propagates. That silence is not proof one doesn't exist, but it is
  notable next to what this suite already built for its own bulk write (see #3).

**2. What would a type actually carry — shared vs. per-element, checked against real material.**
- **Roughness/material: shared, but with a wrinkle the commercial docs surfaced that a naive type
  would get wrong.** C is a function of material AND AGE together — "as metal pipes corrode and
  tuberculate, the effective roughness rises and C falls... unlined cast iron can drop from about
  130 when new to 75 or lower after 40 years... for design use the lower, aged C-value" (search
  synthesis of multiple AWWA-derived roughness tables, cross-checked against
  hydraulic-calculator.com and calcengineer.com "Hazen-Williams Friction Loss: Pipe Sizing per AWWA
  M22" — CITED but secondary, no single primary AWWA table read directly). So "PVC" is not one
  roughness; "PVC installed 1995" is. A type keyed on material alone would need EITHER a type per
  installation era (defeating the "one definition, 400 pipes" pitch) or an install-year override
  living beside it anyway — which is most of the complexity of a type system with none of its
  payoff.
- **Diameter: NOT shared, confirmed by the commercial tools' own scope.** WaterGEMS' pipe material
  library documentation covers roughness coefficient and roughness height, not diameter
  (docs.bentley.com "Engineering Libraries", CITED above) — diameter is a per-link design choice
  from manufactured sizes, exactly as Tom's own framing in the roadmap entry implies.
- **Install year: per-element, confirmed by how utilities actually use it.** GIS/CIP material
  shows utilities track material and installation year as per-pipe asset attributes feeding
  risk-based replacement scoring, e.g. Boston Water and Sewer Commission's CIP, which bases
  replacement priority on GIS/hydraulic-model asset data including age and material per segment
  (bwsc.org CIP documents, CITED). This is exactly Tom's own example in the brief, now confirmed
  from outside.
- **Pump curve: the one place real, unambiguous reuse exists.** WaterGEMS lets a saved pump
  definition (a full curve, not just one property) be assigned to multiple pump elements via
  "Export to Library" (docs.bentley.com "Pump Definitions Dialog Box", CITED) — many pumps of the
  same model genuinely share one curve, with no aging wrinkle equivalent to roughness.
  **OBSERVED, and this is the strongest single finding of this pass:** this suite already has half
  of that mechanism. `js/looped-network.js:19466-19461` (`buildCurveSection`) is a Curves library
  VIEWER whose own comment says why it is read-only: *"a pump's points live on the pump
  (`curvePoints`) and `curveRef` names ANOTHER PUMP whose points it copies, so there is no shared
  definition for a library to hold... Turning this into an editor means giving the document a
  curve table first."* So `curveRef` (copy-once from another pump) already exists; a live-linked
  curve TABLE (edit the definition, every pump referencing it updates) is the one genuinely-missing
  piece, and it is a much smaller, better-precedented ask than a full pipe+pump type system.

**3. What breaks when a type changes.** This suite's own absolute rule — "only the user touches
their numbers" (`CLAUDE.md`, OBSERVED) — is in real tension with a live-linked type, because
editing a type is precisely a system rewriting many elements' stored values from one action, not
the user editing their own element. **OBSERVED**, this suite already solved the adjacent problem
correctly for its existing bulk tools, and better than what I found documented for the commercial
live-linked library: Find-and-Replace (`js/looped-network.js:7658`, "NOTHING IS WRITTEN UNTIL THE
COUNT HAS BEEN SEEN") previews an exact count of elements that would actually change before writing
anything, goes through `setProp()` so a scenario gets an override rather than a Base rewrite, and
is a single undo step. A type-library edit would need the same preview-before-write discipline,
and Task 465's own text already names the deeper cost: a third resolution layer (override →
element → type-default) under the one seam the solver, renderer, labels, popups and six pane
tables all read through (`effective()`), plus a visible detached-vs-inherited state per property —
that is real, not invented, and it is the correct reason this is `[H]`.

**4. Actual pain today, checked against Find-and-Replace rather than assumed.**
**OBSERVED**: Find-and-Replace already does "find every 6-inch pipe, make it 8" or "find every PVC
pipe, set roughness to 150" as a scoped query + preview count + one write
(`js/looped-network.js:7563-7660`). At this suite's stated target scale — **"~10-20 nodes... a
design decision, not a shortfall" with 200 as a headroom check, never a sizing target**
(`dev/looped-network-calculator-scope.md:32-36`, OBSERVED) — the commercial-tool motivating case
("editing one edits 400 pipes") cannot occur: there is no submittal or master-plan network this
suite is built to hold that has 400 pipes of one material in the first place. Find-and-Replace
already answers "I need every pipe currently at C=100 to become C=130" in one operation at this
scale; a type layer would add value only once the SAME reclassification recurs across many
projects over years, which is a maintained-utility-model use case, not a one-off design.

**5. Cost of NOT having it, and who feels it — the honest asymmetry.**
A utility maintaining one growing model for years (Boston-CIP-scale, thousands of segments,
periodic AWWA-standard updates, new construction added continuously) feels the cost of re-editing
material properties by hand repeatedly — real, and exactly the case the Bentley community thread
and the Engineering Library feature both target. **A consultant doing a one-off submittal study,
or this suite's own stated 10-20-node target user, essentially never does** — the network is drawn
once, checked once, and Find-and-Replace already covers the rare reclassification that does occur.
This is the same asymmetry `dev/looped-network-calculator-scope.md` already drew for the whole page
("EPANET owns the serious end and always will"), now confirmed specifically for this task rather
than assumed.

**Recommendation:** leave Task 465 parked at Maybe, and I would rank it LOW on my own list — real,
cited, well-precedented commercial demand, but for a scale this suite has explicitly and repeatedly
declined to be sized for, against an existing pair of tools (Settings push + Find-and-Replace) that
already cover both halves of what a type gives (stamp-forward defaults, scoped bulk rewrite) with a
write-safety discipline (preview-before-write, `setProp()` scenario overrides) I could not confirm
the commercial live-linked library even has. **The one piece I would NOT rank low is a live-linked
CURVE TABLE alone** — `curveRef` already exists as copy-once, external precedent for pump-curve
reuse is unambiguous (no aging wrinkle, no diameter conflation), and the Curves viewer's own code
comment already names exactly what is missing. That is a narrower, better-justified slice of Task
465 than the full pipe+pump type system, and I record it as a candidate SPLIT rather than a reason
to promote 465 whole.

---

## 2026-08-26 — Task 530, round 3: Tom's economics hypothesis ("emitter trick makes the sweep
affordable") tested against what real bulk-sweep tools actually do

Tom's framing: if the market's real product is a one-button whole-system sweep, maybe the
emitter's 1-solve-per-node is *why* that sweep is affordable, and our own choice should follow the
same economics. Went looking for anyone who actually built the sweep, read what they built, and
came back with a clear answer: **the tools that exist did not take that path.**

### Q1 — does anyone run the system-wide sweep with the emitter method?

- **CITED, primary document read directly (not search-summarized) —
  `optiwater.com/wp-content/uploads/2014/03/FireFlow.pdf`, "FireFlow" v2.10, author Elad Salomons,
  7 April 2004, freeware, built specifically as an EPANET-based bulk sweep tool.** This is the
  actual artifact Tom's hypothesis predicts should use emitters — a purpose-built, one-button,
  every-junction fire-flow tool. **It does not use the emitter trick.** Its mechanism, read straight
  off the dialog and manual text: the user sets a `Minimal pressure`, a `Maximal flow`, and a `Flow
  interval` (e.g. 10 gpm), and for every selected junction it steps demand upward by that interval
  from zero, running a full network solve at each step, until either a downstream node violates the
  minimum pressure (reports `Violating_Node` and its pressure) or `Maximal flow` is reached
  ("Maximal flow was reached"). That is a **linear scan, not bisection and not one-shot** — for a
  1,000 gpm ceiling at a 10 gpm interval, up to 100 solves per node, materially MORE expensive than
  either WaterCAD's bisection (~16, per our own measured branch analogy) or the emitter trick (1).
  A real practitioner, building exactly the tool Tom is describing, in 2004, chose the LEAST
  efficient of the three options. That is direct, primary evidence against "the economics push
  toward the emitter trick" as a general law — at least one person who had every reason to care
  about run time did not reach for it.
- **CITED, WNTR's own fire-flow example is not a sweep at all.** `USEPA/WNTR`
  `examples/fire_flow.py` (fetched via GitHub raw, WebFetch-summarized — I read the fetched summary,
  not the raw diff line-by-line, so flag this one notch below the FireFlow.pdf read) adds a **fixed**
  4,000 gpm demand at **one named node** for a time window and compares pressures with/without it,
  using `demand_model = 'PDD'` (WNTR's own pressure-dependent-demand mode, a global exponent curve
  like EPANET's native PDA, not an emitter). It is a single-hydrant demonstration script, not a
  system sweep, and it does not use emitters at all for the fire demand itself.
- **CITED, a real academic precedent for network-wide emitter use exists, but it answers a different
  question from Tom's.** Dhote & Ingle (or similar authors — page did not surface author names to
  me), *"Analysis of water distribution network under pressure-deficient conditions through emitter
  setting,"* Drinking Water Engineering and Science (DWES), Copernicus, 2019
  (`dwes.copernicus.org/articles/12/1/2019/`, fetched directly). Assigns emitter coefficients only
  to nodes a prior demand-driven run flagged as pressure-deficient, then **iterates** (their own
  words: *"Though the proposed approach is an iterative one..."*) — 5 solves in their own worked
  example, versus a competing single-iteration method (SIPDA, Mahmoud et al. 2017) at 3. **This is
  whole-network pressure-deficiency screening under one demand pattern (Tom's Class C below), not
  "how much fire flow is available at this specific hydrant"** — a structurally different question,
  answered with emitters used as a numerical device for PDA, not as a fire-flow-at-a-node search.
  Worth citing because it is the one place in the literature I found emitters actually deployed
  across many nodes in the same solve, and it still needed 5 solves, not 1.
- **Secondary, could not reach the primary source, flag accordingly.** An eng-tips.com thread and
  its search-engine paraphrase describe an H2Onet (Innovyze/Bentley predecessor) bulk run —
  "over 50,000 fire flow analyses... 3 to 4 seconds per analysis on a 136,000-pipe model," verified
  against 900 field tests, using **"an equivalent minor loss in branch lines"** (i.e., a modelled
  nozzle/tee/reducer assembly with a K value, same shape as this branch's own approach) rather than
  the raw elevation-and-huge-C emitter trick. The primary page (eng-tips.com) returned 403 to a
  direct fetch; I have only the search engine's synthesis of it, not the thread text. If true, it is
  a SECOND real-world large-scale tool that reached for the assembly/K-value model rather than the
  emitter trick — but I could not verify wording or method precisely and this is not load-bearing on
  its own.
- **Net finding on Q1: no case found, primary or secondary, of a real tool doing the whole-system
  sweep via the pure emitter (elevation-raise, huge-C) trick.** The two purpose-built bulk tools I
  could examine (FireFlow.pdf primary; H2Onet secondary) both chose more expensive per-node search
  strategies over the cheaper emitter option that was equally available to them (EPANET's emitter
  mechanism predates both). That is evidence the emitter trick's 1-solve saving has not, in practice,
  been the thing that made a sweep affordable for people who actually built one.

### Q2 — is "16 solves per node" a real WaterCAD number, or ours?

**Ours, and I should have been clearer about that the first time.** Re-fetched
`docs.bentley.com` GUID-C6BF82B2 directly this pass: it describes the shape of the search
("iteratively assign lesser demands until it finds the maximum flow... maintaining the pressure
constraints") but **publishes no iteration count**. A `Trials` field does exist in WaterGEMS's
Calculation Options (found by search, not fetched directly this pass — one more notch of caution)
described as *"the maximum number of iterations... for each hydraulic solution"* — that is each
individual steady-state solve's own internal convergence cap (the Newton-type loop inside ONE flow
solution), analogous to our own solver's `tol`/iteration cap, **not** the count of demand-adjustment
trials across a per-node bisection search. **"16" is this branch's own measured bisection count**
(`dev/fireflow-loss-table.md`, OBSERVED), applied by analogy to WaterCAD because the two algorithms'
*shape* matches (start above the answer, iteratively narrow), not because Bentley published 16 or
any other number. Nobody should cite "16" as a WaterCAD figure; it is ours, extrapolated across a
qualitatively similar published shape.

### Q3 — where would the emitter answer actually differ from bisection?

Reasoned from the governing equations (EPANET FAQ language, `q = C·p^γ`, γ≈0.5, elevation raised by
the target head), not measured — **SPECULATION, to be re-derived, not quoted as settled**:

1. **In the converged limit, the two methods answer the same question for ONE node tested alone.**
   As C grows, the residual δh needed to pass any given flow shrinks toward zero, so the converged
   HGL at the tested node approaches the target pressure from above by an amount that vanishes as
   C→∞ — the same physical state a bisection search converges to when it holds the rest of the
   network at normal demand and searches only the tested node's added flow. This is why EPANET's own
   manual can recommend it at all.
2. **The finite discharge coefficient is an INVISIBLE ceiling, and this is the real, nameable
   divergence risk.** EPANET's own worked recommendation is "100× the maximum expected flow," which
   means the practitioner must guess the node's capacity *before* running the analysis meant to
   discover it. Guess low, and the emitter answer silently caps below the true available flow with
   no flag — compare FireFlow.pdf's own dialog (page 3 of the manual, read this pass), which has an
   explicit `Maximal flow` field AND an explicit `"Maximal flow was reached"` message precisely
   because a bisection-style search needs, and states, its own ceiling. **A bisection sweep can say
   out loud "I hit my ceiling, this node is stronger than I checked"; a naive one-shot emitter run
   has no equivalent tell** unless someone separately checks the returned flow against the assumed
   coefficient scale. This is a real, structural cost of the "one solve" design, not a rounding
   error, and it is exactly the kind of finding this seat exists to catch before it ships.
3. **Running every candidate node's emitter SIMULTANEOUSLY, in one single solve for the whole
   system, is a DIFFERENT physical scenario from N separate single-node tests, and would silently
   understate every node's available flow.** Standard fire-flow practice tests one hydrant (or a
   small design-fire group) at a time against background demand, not every hydrant in the system
   flowing at once. Tom's own quote asks for "one solve at every hydrant" (i.e., N solves, one each
   — the 16x-not-16-to-1 reading), so this trap does not apply to what he asked for; but it is the
   natural over-reach of the technique (true O(1) total instead of O(N) at 1-each) and I flag it so
   nobody reaches for it later believing it is the same analysis.
4. **Numerical robustness near pumps, PRVs/PSVs/FCVs and check valves is a real but unmeasured
   risk.** A huge discharge coefficient makes the node's local q-vs-h relation extremely steep;
   during the solver's intermediate iterations (before convergence) this can push trial flows and
   heads outside a pump curve's defined range or cause a control valve to flip state repeatedly. I
   could not find or run a test of this — it is inference from the shape of the equations, flagged
   as a thing to test empirically before trusting an all-node emitter sweep near this branch's own
   valve-routes-to-EPANET-only carve-out (`CLAUDE.md`, OBSERVED, the PRV/PSV/FCV section).

**Net on Q3: no published quantitative comparison found.** This is the one question I could not
settle with a citation, and Tom should be told exactly that rather than given a fabricated number
for how far apart the two methods land.

### Q4 — the failure classes, and one finding of my own worth naming as SPECULATION

Tom's own two: **(A) Isolated/compliance** — can this node deliver its required fire flow at the
minimum residual, holding everything else at normal demand; **(B) System/design** — does drawing
that flow break something else (another node's minimum pressure, a link's design/max velocity).
The literature search (criticality-analysis papers, general search synthesis, not a single
authoritative table I could cite) supports adding a third, genuinely different question that should
not be filed under "fire flow" at all: **(C) baseline service adequacy** — nodes already below their
own minimum service pressure under ordinary (non-fire) demand, which is what the DWES emitter/PDA
paper above is actually screening for, at network-wide scale, in a handful of solves, with no fire
demand involved.

- **(A) needs a per-node search** (bisection today, or a per-node emitter, or FireFlow.pdf's
  stepped scan) — no way around solving repeatedly per node if the deliverable is "how much can
  THIS node take."
- **(C) is cheap and already answered by ordinary hydraulic modelling practice** — one solve (or a
  handful, per the DWES paper) at normal demand, flagging anyone below minimum pressure. Not a fire-
  flow product at all, and should not be priced against fire-flow's per-node cost.
- **(B), reasoned from the mechanics rather than found in the literature — SPECULATION, worth
  flagging because it changes the economics Tom is weighing:** once you know a node's REQUIRED fire
  flow (a stated number, not the "achievable" flow (A) discovers), checking what it breaks elsewhere
  does not need bisection OR an emitter at all — it needs exactly **one ordinary fixed-demand solve**
  per candidate node, adding the required flow as a plain demand at that node and reading every other
  node's pressure and every link's velocity off that same solve. No artificial elements, no
  discharge-coefficient guess, no elevation trick, and it is unambiguous about which flow level is
  being tested (the code-required one, not whatever an emitter happens to settle at). **This makes
  (B) cheaper than either alternative under discussion for (A)**, and decouples the "does this break
  something else" report from the method chosen for "can this node meet its own target" — they can
  ship on different schedules and different mechanisms without one blocking the other. I did not
  find this stated anywhere; it follows directly from EPANET mechanics already cited in this file and
  should be re-derived, not quoted, before it is relied on.

### Verdict on Tom's hypothesis

**It does not survive contact with the evidence, on the narrow claim that the emitter trick is what
makes real bulk sweeps affordable.** The one purpose-built, one-button, every-junction EPANET tool
I could read in full (FireFlow.pdf, 2004) chose a MORE expensive method than either bisection or the
emitter trick, not the cheapest one. The one whole-network emitter application I found in the
literature (DWES 2019) still iterated five times and was answering a different question (baseline
deficiency, not per-node fire-flow capacity). WaterCAD's own documentation, read directly, names
neither emitters nor a solve count, so the "16" this project has been citing is our own branch's
number, not the market leader's. **The narrower, honest version of Tom's economics — 1 solve per
node instead of ~16, still O(N) either way — remains genuinely true and worth having as an option,
exactly as the prior pass concluded**; what does not hold up is the leap from "1 is cheaper than 16"
to "so that is presumably why the tools that exist do full sweeps," because the tools I could
actually inspect did not take that route.

---

## 2026-08-27 — Task 530, round 4: Tom's five questions, all sourced this pass

Tom read the branch's own `dev/fireflow-analysis-plan.md` and asked five things: is "EPS" the
industry word, is Run Manager real and what does it own that a scenario doesn't, is "Design
Fireflow" a real term with a real colour convention, what actually limits a collateral-effect
search, and how would this seat scope development phases. Nothing below reopens anything already
settled on the branch (bisection, raw-node-first, one-run/two-report shape) — those stand.

### Q1 — is "EPS" the industry word for what we call Time? YES, confirmed.

**CITED**, EPANET's own manual (fetched via search synthesis of `epa.gov`/`microimages.com` PDF
mirrors, not the primary PDF directly this pass — flag as secondary though multiple independent
mirrors agree word for word): *"EPANET performs extended period simulation of hydraulic and water
quality behavior... during a simulation period comprised of multiple time steps."* **CITED**,
Bentley's own page title, fetched directly: `docs.bentley.com` "**EPS Fire Flow Analysis Tool**" —
the vendor names the time-stepped mode "EPS" in the UI itself, not merely in prose. Tom is right:
**EPS is the standard term, industry-wide, for a multi-time-step hydraulic run**, distinct from
"steady-state." Our UI calls the same concept "Time" — a plainer, non-jargon word for the same
mechanism (`js/lpn-time.js`, OBSERVED, `CLAUDE.md`). **Not proposing a rename** — that is Tom's
call, and there is a real argument on the other side worth naming so he weighs both: "Time" is
already Simple-English per this suite's own house style (`dev/language-strings.md`, OBSERVED
convention, not re-read this pass), and "EPS" is a three-letter acronym that means nothing to a
first-time visitor outside the trade. If he ever wants the jargon word visible anywhere, the natural
place is a **tooltip/synonym** ("Extended Period Simulation"), not necessarily the label itself.

### Q2 — the Run Manager paradigm: real, and it is a genuinely different axis from a scenario.

**CITED**, InfoWater Pro's own Run Manager documentation (`help-innovyze.atlassian.net`, fetched
directly): the tabs are **Standard, Break, Fireflow, Multi-Fire, SCADA, Hydrant Curve, System
Curve** — Tom's list was accurate, not a guess. Each is a different *simulation type*, not a
different *network configuration*. **CITED, same page, the load-bearing distinction:** *"a scenario
contains modeling data that a simulation uses... a run generates an output source — the stored
results after execution... the most recent simulation run results are referred to as the active
output source."* Runs can be **saved, loaded, and compared independently of scenarios.**
**Answering Tom's structural question directly: a Run Manager is a different axis from our
Scenario concept, not the same one renamed.** A Scenario (`dev/ROADMAP.md` Task 184, OBSERVED) is
network configuration — what demand, what status, what override. A Run, in this paradigm, is a
*compute event and its stored output* — which simulation TYPE ran against that configuration, and
what it produced. One scenario can have many runs against it over time (a Standard run today, a
Fireflow run next week, both against the same "Existing System" scenario) and a run's own results
persist independently of whether the scenario is later edited. **This project has no equivalent of
the second axis at all** — every solve is transient and re-derived on edit (`settings.autoRun`,
OBSERVED, `CLAUDE.md`), nothing is a stored, named, comparable output distinct from "whatever the
live solve currently shows." A fire-flow sweep is the first feature this suite would build for
which that distinction actually matters: it is slow enough (measured ~112 s at 225 junctions,
prior entry) that auto-solve-on-edit is the wrong trigger, and its own result needs to persist and
be browseable after the network is edited again — which the market's answer is a Run object, not a
faster scenario system.

### Q3 — "Design Fireflow" is InfoWater's own real term, confirmed; the colour scheme is NOT confirmed.

**CITED**, Autodesk's own support-article title, fetched via search and corroborated by the phrase
appearing verbatim in a second independent Autodesk article: *"Design Fireflow is excluding some
nodes from the search range in InfoWater Pro."* **"Design Fireflow" is a real, named InfoWater
feature**, not Tom's own coinage or a Gemini paraphrase — this corrects nothing (he used the term
correctly) but is worth having on record since our own branch doc uses the plainer "does it break
something else." **CITED**, the same search surfaced the report's actual verdict language:
*"Capacity Assessment provides 'PASS' or 'FAIL' based on a comparison of the Hydrant Design Flow and
the Total Demand."* **What I could NOT confirm, and say so rather than guessing: no documentation
found describes a three-way green/red/orange colour scheme distinguishing an ordinary FAIL from a
DESIGN FAIL** (collateral damage elsewhere while the tested node itself still passes). I fetched
WaterGEMS's own Fire Flow Analysis page directly for this specifically and it states only that
"elements... will be color coded" in a results browser, with no colour key given in the fetched
text. **Tom's specific three-colour claim (green/red/orange) is plausible and matches how this
suite's own verdict convention already works** (`CLAUDE.md`, OBSERVED, "leading verdict glyph, ✓
pass ⚠ caution") but I did not find it stated in either vendor's documentation — **flag as
unconfirmed, not corrected**, and do not let a later invocation cite this pass as having sourced it.

### Q4 — the collateral-effect search limit: NOT a topological radius or a pressure-drop stop rule. It is a named, user-chosen SCOPE.

**This is the one Tom most wanted sourced, and the finding corrects the shape of his own guess.**
**CITED**, InfoWater Pro's Fireflow help page (`help.autodesk.com`, fetched directly, primary
text): the control is called **"Critical Node Searching Range"**, and it is a **choice among four
named sets**, not an automatic radius or a "stop when drawdown < X" rule: **"Fire Nodes, Entire
Network, Selection Nodes, and Domain Nodes."** *"Fire Nodes"* limits the collateral check to the
node(s) actually being tested; *"Entire Network"* checks everything, every trial; *"Selection
Nodes"* and *"Domain Nodes"* are user-drawn/predefined subsets. **The same shape repeats for
velocity, under a separate control:** *"Velocity Limit... constrains pipes with options for 'No
Pipes, Connecting Pipes (adjacent to each hydrant), or Entire Network.'"* **"Connecting Pipes" is
real and is Tom's own phrase** — but it is one of three fixed choices offered to the user, not a
computed topological radius (not "N pipes away") and not a computed pressure-drop threshold
("stop when drop is less than X"). **I searched specifically for a numeric default (a search-range
distance or node count) and found none published** — the tool asks the user to pick a SET, it does
not compute or default a radius. **What this means for a limiting mechanism here, if this seat's
own inference is wanted: the market's actual cost control is not an algorithm that prunes the
search automatically — it is scope selection handed to the user before the run starts** (test 3
nodes vs. test the whole network), which is a cheaper design problem than an automatic stopping
rule and matches this suite's own instinct toward disclosure over invented cleverness. **SPECULATION**,
mine, re-derive before relying on it: this also explains why nobody publishes a solve-count number
for the collateral half (§3 of the branch doc, "16 is ours, not Bentley's") — if the scope is
user-chosen rather than computed, there is no fixed algorithmic cost to publish, only "however many
nodes you picked times however many are in your search range."

### Q5 — phased development plan, my own scoping, in my order

See the returned report body for the ranked phases; recorded here only what does not fit there.
**Where I would sequence differently from what a market-precedent read might suggest:** I would
NOT build a tabbed Run Manager surface as this project's answer to Q2's real gap. At this suite's
own stated ~10–20 node target scale (`dev/looped-network-calculator-scope.md`, OBSERVED) a 7-tab
run-type chooser is the subdivision-vs-Novato mismatch this seat exists to catch — the actual gap
(a slow analysis needs an explicit trigger and a persisted, named result, not auto-solve) can be
answered by one new concept (a stored, named "Fire Flow Run" result object, browsable after the
network is edited again) attached to the EXISTING Scenario mechanism, not a second top-level UI
paradigm sitting beside it. This is a direct disagreement with treating the Run Manager finding as
"go build one" — it is evidence the STORAGE model needs a new axis, not evidence the INTERFACE
needs seven tabs.
