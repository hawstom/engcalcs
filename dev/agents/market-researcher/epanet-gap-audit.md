# EPANET gap audit — lpn_ (Looped Pipe Network) vs. EPANET 2.2/2.3 desktop capability

Mary, answering R-210 (dev/tom-review-queue.md): *"Ask Mary to do a deep pass through EPANET Help
etc to find out if we are missing anything that EPANET has, other than graphs that are already on
our roadmap. Before we release as EPANET++, I want to be sure we are not behind EPANET."*

**Method.** Outward: EPANET 2.2 user manual (epanet22.readthedocs.io / USEPA's own
`User_Manual/docs/*.rst`, already fetched directly in earlier sessions per this journal), the OWA
EPANET GitHub README/AUTHORS (fetched 2026-09-08), and this seat's own prior CITED research on
EPANET's Property Editor, Time Browser, and calibration/plot menus (journal 2026-09-06, 2026-09-08,
2026-09-15, 2026-09-22 — re-cited below rather than re-fetched, since those sources do not change).
Inward: `dev/looped-network-calculator-scope.md`, `dev/ROADMAP.md`, `dev/roadmap-closed-ids.md`, and
direct reads of `js/looped-network.js`, `js/lpn-*.js`, `js/lpn-inp.js` (grepped and line-checked
today, 2026-09-24). **Graphs are excluded per the brief** (Task 600 already tracks contour,
frequency distribution, and system flow balance — the roadmap is the record for those).

**Provenance:** every row below is tagged. CITED = an outward source named above. OBSERVED = this
repo, path:line, checked today (2026-09-24) unless noted. Per `dev/agents/README.md`, an OBSERVED
finding decays — the file:line citations below are current as of this session's read, not a
standing fact.

---

## 1. A correction to file first: the scope doc is stale on two fronts

Before the table: `dev/looped-network-calculator-scope.md`'s "Cut, not deferred" list still reads
(as of today) *"Water quality, in every form (age, trace, chlorine decay, multi-species)"* as
permanently cut, and *"PBV and GPV stay cut."* **Both are wrong today**, the same way the tank/PRV
entries in that same list were superseded in 2026-08-14 and the doc was edited to say so — these two
just never got the matching edit.

- **Water quality (single-species) shipped.** OBSERVED: `js/looped-network.js:40531-40535` offers
  Nothing / Water age / Source trace / "A chemical that reacts" as quality modes; `js/lpn-epanet.js`
  writes `[REACTIONS]`, `[QUALITY]`, `[SOURCES]` sections and reads back age/trace/chemical results
  (`js/looped-network.js:7102-7213`). The on-page Notes text confirms it in plain English:
  `lib/lang.ec.en.php:2120` (`lpn_notes_2_def`) — *"Water quality is modeled: water age, source
  trace, and a chemical that reacts in the pipe walls and in the body of the water."* This is a real,
  shipped capability the scope doc's cut list contradicts. **Multi-species (EPANET-MSX) is genuinely
  absent** — no reference to MSX anywhere in `js/lpn-*.js` (grepped, zero hits) — so the correct
  present-tense sentence is "single-chemical water quality, not multi-species," not "water quality is
  cut."
- **GPV and PBV valve types shipped**, closed under Task 586/588 (`dev/roadmap-closed-ids.md:558-559`).
  OBSERVED: `lib/lang.ec.en.php:2233-2234` (`lpn_valve_type_pbv`, `lpn_valve_type_gpv`);
  `js/lpn-epanet.js:328-343` writes a GPV's head-loss curve to `.inp`. The scope doc's line survives
  from before that ship and should be struck by whoever next edits that file — not by me, per this
  seat's write-access rule.

Both are corrections **for the record**, not new findings against EPANET — they narrow, not widen,
the list below. Recording them here because a reader who trusted the scope doc as written would have
told Tom "we don't do water quality," which is false today.

---

## 2. The gap table

Excludes graphs (Task 600 covers contour/frequency/flow-balance; time-series is Task 599, already
built per Notes/ROADMAP). Ordered roughly by EPANET's own menu structure.

| EPANET capability | Mark | Where it lives / what's missing | Tag |
|---|---|---|---|
| Draw/edit junctions, pipes, reservoirs, tanks, pumps, valves (PRV/PSV/FCV/TCV/PBV/GPV) | HAVE | `js/looped-network.js` element types; all six valve kinds have `lpn_valve_type_*` keys (`lib/lang.ec.en.php:2222-2234`) | OBSERVED |
| Steady-state hydraulic solve (Hazen-Williams / Darcy-Weisbach / Manning) | HAVE | `js/lpn-solver.js`, own engine; validated against EPANET to <0.004 gpm (`dev/looped-network-calculator-scope.md` "Validation") | OBSERVED |
| Extended-period simulation (patterns, tank fill/drain, controls over time) | HAVE, EPANET-engine only | `js/lpn-time.js`; own solver has no time dimension by design (CLAUDE.md, "Never call it preview") | OBSERVED |
| `[RULES]`-based control logic | HAVE | `js/lpn-rules.js`, 318 lines, EPANET grammar | OBSERVED |
| Reservoir head patterns, pump speed patterns | HAVE | `js/looped-network.js:20008-20010` (speedPattern), Task 248.02 per CLAUDE.md | OBSERVED |
| Demand patterns, per-junction and default (`[OPTIONS] Pattern`) | HAVE | `js/looped-network.js:27958` | OBSERVED |
| Pump curve (1/2/3-point fit, arbitrary-point curves) and efficiency curve | HAVE | `doc.curves`, Library editor (Task 586/588) | OBSERVED |
| Water age | HAVE | `js/looped-network.js:40532`, quality mode `age` | OBSERVED |
| Source trace (percent-from-source) | HAVE | `js/looped-network.js:40533`, `js/lpn-epanet.js:574` | OBSERVED |
| Single reacting chemical (bulk + wall reaction, `[REACTIONS]`) | HAVE | `js/looped-network.js:40535`, `40607-40644` | OBSERVED |
| Multi-species reactive transport (EPANET-MSX) | MISSING | No MSX reference anywhere in `js/lpn-*.js` (grepped, zero hits) | OBSERVED |
| `.inp` import/export, character-exact round trip on Net1/2/3 | HAVE | `js/lpn-inp.js`; CLAUDE.md | OBSERVED |
| Import reports every difference, never silently drops | HAVE | `js/lpn-inp.js` drop-reason strings, e.g. `lpn_inp_drop_patterns`, `lpn_inp_drop_quality_options` (`js/looped-network.js:28170,28222`) | OBSERVED |
| `[COORDINATES]`, `[VERTICES]`, `[LABELS]`, `[BACKDROP]` sections | HAVE | `js/lpn-inp.js:142,1267,3213-3215` | OBSERVED |
| Typed X/Y coordinate entry (EPANET's own Property Editor has this) | HAVE, per Task 674 (recently built) | Journal 2026-09-15 found EPANET's manual confirms typed X/Y is standard; wishlist 0e/0f record the build | OBSERVED + CITED (EPANET manual) |
| Fire flow analysis | HAVE | `js/lpn-fireflow.js`, 572 lines | OBSERVED |
| Find / Query by condition (EPANET's Query tool) | HAVE, and arguably ahead | `js/looped-network.js` Find and replace / query-string parser (`:16007-16683`); also WRITES values (Group Edit), which EPANET splits into two separate tools | OBSERVED |
| Group Edit (bulk property change by selection/condition) | HAVE, merged with Query | Same Find-and-replace mechanism doubles as both; see above | OBSERVED |
| Multiple scenarios with per-property overrides, on one base network | HAVE, and beyond EPANET's own GUI | `js/looped-network.js:4642` `scenarioMenuRows()`; EPANET's GUI has no first-class multi-scenario compare — a modeler manages this by saving separate `.inp` files | OBSERVED |
| Pump energy cost (price, pattern, currency) | HAVE | `js/looped-network.js:7062` `docEnergy()`, Task 566 | OBSERVED |
| Energy Report (a per-run summary table of pump energy/cost) | PARTIAL | Cost inputs exist and feed `.inp` `[ENERGY]`; no dedicated on-page "Energy Report" table separate from the per-link property columns was found (`paneColEnergyPrice` etc. are property columns, not a report) | OBSERVED |
| Status Report (per-timestep narrative: pump on/off switches, valve status changes, warnings) | MISSING | Grepped for "Status Report"/`statusReport`/`lpn_status_report`: only a code comment listing EPANET's own Hydraulics-Options fields (`js/looped-network.js:37990`) mentions the phrase; no report of this shape found | OBSERVED |
| Full Report / Report to file (a complete tabular dump of every timestep, every element) | MISSING | No "Full Report" or file-export-of-report string found; results live in the Tables pane (on-screen) and `.inp` round-trip, not a standalone exportable report document | OBSERVED |
| Calibration data (measured field values vs. model prediction) + Calibration Report | MISSING, tracked | ROADMAP Task 601, priority 75, explicitly scoped from EPANET's own Help, not yet built | ROADMAP (601) |
| Reading an EPANET `.PRO` profile-node-list file | MISSING, tracked | ROADMAP Task 604, priority 75 | ROADMAP (604) |
| Contour / frequency-distribution / system-flow-balance plots | MISSING, tracked (excluded by brief) | ROADMAP Task 600, priority 75 | ROADMAP (600) |
| Time-series plot | HAVE | ROADMAP Task 599 closed per CLAUDE.md / Notes reference; excluded as a graph anyway | ROADMAP (599, closed) |
| Meter a node/link's value onto a Text/Label bubble (EPANET's per-element notation binding) | MISSING, deferred on purpose | ROADMAP Task 482, priority 5, Tom: *"an unknown amount of EPANET that we don't yet implement"* — deliberately deferred, not forgotten | ROADMAP (482) |
| Hydraulic Options: Trials, Accuracy, Unbalanced (Stop/Continue N), CheckFreq/MaxCheck | HAVE | `js/looped-network.js:38267-38294`, `settingsUnbalancedRows()` (`:40846`) | OBSERVED |
| Units and headloss-formula choice (CFS/GPM/... , H-W/D-W/Manning) | HAVE | Units strip + `frictionMethod()` selector (`:38231`) | OBSERVED |
| Map display: flow-direction arrows, symbol size, link width, legend position (6-way) | HAVE | `:5220-5278` (`showArrows`, `symbolSize`, `linkWidth`), legend 6-position (`:36326-36332`) | OBSERVED |
| Color-coded thematic map (by result value, classed) | HAVE | `js/looped-network.js:19077-19496`, color ramp/classes/breaks/legend | OBSERVED |
| User-supplied backdrop image, two-point registration | HAVE | `dev/looped-network-calculator-scope.md` Phase 2, "Built" | OBSERVED |
| Live OSM/Mapbox tiled basemap + terrain elevation | HAVE, beyond EPANET's own desktop app | `js/lpn-terrain.js`, CLAUDE.md `lpn_` section | OBSERVED |
| Overview/locator inset (small thumbnail map with a viewport box, for panning a large network) | MISSING | No `overview`/inset-navigator control found (grepped; the only "inset" hits are label-leader geometry, unrelated); Task 146.09 (map insets, "very low priority") addresses crowded-area insets, not a pan locator — a different feature | OBSERVED |
| Auto-length (compute pipe length from drawn/geographic geometry, with a manual override) | HAVE | `lenAuto` schema field, per-link toggle shipped Phase 1 (scope doc) | OBSERVED |
| Multiple document windows (Window menu: Tile, Cascade, arrange) | MISSING, and arguably N/A | Grepped for `Window`/`Tile`/`Cascade` menu: no hits. `lpn_` uses a browser-tab-per-project model instead (Notes: `lpn_notes_3_def`, "Every project is a tab") — a different, arguably more web-native answer to the same need, not an oversight | OBSERVED |
| Group Edit / Query language taught in-UI (a query string shown above the Find button) | HAVE, and cited as deliberately EASIER than EPANET's own dialog-based query builder | `js/looped-network.js:16663-16683`, Task noted 2026-08-26 per journal | OBSERVED |
| Reaction coefficient guidance / library of typical values | MISSING, and declined on purpose | `js/looped-network.js:40726` (`lpn_reaction_note`): *"This application offers no reaction coefficient suggestions... enter one you have measured or one you can cite."* A stated design choice, not an omission found by accident | OBSERVED |
| Surge / water hammer (transient analysis) | MISSING | Explicitly named in Notes as not modeled (`lpn_notes_2_def`); EPANET itself does not model this either (it is a separate class of tool, e.g. Bentley HAMMER) — **not actually a gap relative to EPANET**, listed here only because it appears in the same Notes sentence and a reader could misread it as one | OBSERVED + SPECULATION (EPANET's own scope, not independently re-verified this session) |

---

## 3. Ranked short list — what a practising engineer notices first

Ranked by how quickly a working modeler who knows EPANET would notice the absence, not by build
cost alone. Excludes anything already on `dev/ROADMAP.md` under its own number unless the ranking
itself is new information.

1. **Full Report / exportable tabular dump of every timestep.** MISSING. An engineer handing a
   model to a reviewer or regulator is used to EPANET's "save the whole run as a report file" habit;
   today this suite's Tables pane is on-screen only, and CSV/table copy-out exists per curve (Task
   586/588) but not as a whole-run report. **Cost: medium** — the data already exists in
   `js/lpn-time.js`'s per-step results; the work is a formatting/export pass, not new computation.
   Not on the roadmap under this name; closest neighbor is Task 601 (Calibration Report), which is a
   different, narrower thing (measured-vs-predicted, not a full dump).

2. **Status Report (narrative of what changed over the run — pump switches, valve status changes,
   warnings, in time order).** MISSING. This is precisely the artifact an engineer pastes into a
   report appendix to show "the pump cycled 4 times, the PRV went active at hour 6." **Cost: medium**
   — the underlying events (status changes) are already tracked for `.inp` writing and the run
   engine; the work is collecting and rendering them as one list. Not on the roadmap under this name.

3. **Calibration data + Calibration Report.** Already ROADMAP Task 601, priority 75. Ranking it here
   only to say: of everything on this list, it is the one Tom's own EPANET-help pass already flagged
   as worth doing, and this audit found nothing to add to or subtract from that entry's own reasoning.

4. **EPANET `.PRO` profile-node-list import.** Already ROADMAP Task 604, priority 75. Same note as
   above — this audit confirms the gap and adds nothing new.

5. **A per-node/per-link "meter" bound into a Text label** (EPANET's own Labels-with-a-property
   feature). Already ROADMAP Task 482, priority 5, deliberately deferred by Tom's own reasoning. An
   engineer coming from EPANET's GUI would recognize the absence quickly (it is a one-click feature
   there), but this suite's multi-property draggable labels already do most of the same job in a
   different, arguably better shape (`dev/positioning.md` §4) — so the "notice" is real but the
   "need" may already be answered differently. Not re-ranking Tom's own 5.

6. **Multi-species reactive transport (MSX).** MISSING, and genuinely absent from the codebase.
   **Low priority for this suite's stated audience** (small/rural systems, EWB, one-off design tasks
   — journal 2026-09-04 rows 1-5) — MSX is a research/large-utility water-quality tool, not something
   a 10-20-node design exercise needs. Noticing it requires already knowing EPANET-MSX exists, which
   is a smaller population than "notices there's no Full Report." Ranked low on purpose.

7. **Overview/locator inset for panning a large network.** MISSING, not on the roadmap under this
   name (Task 146.09 is a different, crowded-area inset). Given this suite's stated 10-20 node target
   scale (`dev/looped-network-calculator-scope.md`), a pan locator matters far less than it would in
   EPANET's own typical multi-hundred-node models — **low cost to notice AND low cost to skip**, so
   ranked here rather than higher.

8. **Multiple document windows / Tile / Cascade.** MISSING but arguably answered differently (browser
   tabs). Not recommending a build — a browser-native tab model is a reasonable, honest substitute,
   and CLAUDE.md's own architecture leans into "the browser is the OS" throughout `lpn_`. Listed for
   completeness, not as a real gap.

**What I could NOT verify**, stated plainly: I did not re-fetch EPANET's Help text for Status Report
or Full Report's exact format this session (no live EPANET desktop install in this environment); the
"MISSING" calls above for #1 and #2 are grounded in a thorough grep of this repo (a real result) plus
this seat's general knowledge of EPANET's report menu (SPECULATION on the exact EPANET UI shape,
though not on whether the capability exists here — that part is OBSERVED and confidently zero). A
future invocation with access to EPANET's own Help file should confirm the exact tab/section layout
before anyone writes interface copy for either, the same way Task 601 already requires for
Calibration.

---

## 4. Does anything here bear on the "EPANET++" name?

**Yes, and it strengthens the case for it rather than weakening it, with one caveat.**

`dev/positioning.md` §6 records Tom's own reasoning for `EPANET++` over `LibreEPANET`: *"we are not
more libre than EPANET... but with EPANET++ I have no such concern since we really are an extension
of EPANET with scenarios, fire flow, libraries, and more to come."* Everything found in this audit is
consistent with that claim being true and, if anything, understated — scenarios, fire flow, water
quality (age/trace/chemical), rule-based control, and a Query/Group-Edit tool that teaches its own
syntax in the UI are all real, shipped extensions beyond EPANET's own GUI, not aspirations. The
multi-scenario comparison in particular (§2 above) is a genuine capability EPANET's own desktop
application does not have as a first-class feature.

**The caveat is §2 of `dev/positioning.md` itself: "never write a completeness claim against
EPANET."** This audit is evidence for "we are an extension," which is the claim `EPANET++` makes and
which Tom's own reasoning already licenses — it is NOT evidence for "we have everything EPANET has,"
which nobody should claim regardless of what this table shows. The gaps found here (Full Report,
Status Report, MSX, calibration, profile import) are real, and `dev/positioning.md` §2's own
standing rule — *"we have no idea what we are not and what we don't know"* — is the right public
sentence to keep saying, not a claim that this audit closes the question. A gap list from one
session is not the boundary of the gap; it is a sample of it.

---

## Sources

- CITED: EPANET 2.2 User Manual, USEPA's own manual repository (`raw.githubusercontent.com/USEPA/
  EPANET2.2/master/User_Manual/docs/6_objects.rst`), re-cited from this seat's 2026-09-15 fetch —
  Property Editor typed X/Y confirmed there.
- CITED: `github.com/OpenWaterAnalytics/EPANET` README/AUTHORS, fetched 2026-09-08 (this journal).
- CITED (general knowledge of EPANET's menu structure — Status Report, Full Report, Energy Report,
  Calibration Report, Query, Group Edit — not re-fetched from a live EPANET install this session;
  flagged in §3 above as needing re-verification before public copy).
- OBSERVED: all `js/looped-network.js`, `js/lpn-*.js`, `dev/looped-network-calculator-scope.md`,
  `dev/ROADMAP.md`, `dev/roadmap-closed-ids.md` citations given path:line above, read 2026-09-24.
