# Looped Pipe Network Calculator (Map Interface) — Scope

Status: **Phases 0, 0.5, and 1 shipped; Phase 2 mostly shipped. Live as a PREVIEW page** (2026-07-29
on). ROADMAP Task 146 carries the decision log and shipped-phase history; the remaining unbuilt work
is no longer phase-shaped — it is tracked as individually-prioritized child tasks **146.01–146.09**
(plus Task 145) directly in `dev/ROADMAP.md`, reorganized 2026-07-29. Prefix **`lpn_`**; page
`Looped-Network.php`; JS `js/looped-network.js`.

**This calculator is only loosely related to the rest of the suite (Tom, 2026-07-29), and that is a
standing instruction, not an observation.** Much of it is its own strategy: its own UI paradigm (a
drawing surface, not a form), its own persistence (a localStorage document, not the shared cookie),
its own solver, its own page chrome. Where it *does* touch the suite — unit families and the US/SI
preset buttons, the `$ec_lang` key rules, the tooltip conventions, the header and footer — it must
conform exactly. Everywhere else, do not reach for a suite pattern just because one exists, and do
not generalise a decision made here back onto the other twelve calculators without a separate reason.

Sibling of `bpn_` / `Branched-Network.php`, which stays **exactly as shipped** — this is a new page,
not an evolution of that one. The row-table form is genuinely better for a simple series run, and
`bpn_` has 53 keys translated into 26 languages that a UX rewrite would put at risk for no gain.

**Commits go direct to `master`** (Tom, 2026-07-30 cleanup — the per-phase `lpn-solver`/`lpn-labels`
branches used through Phase 2 were an inconsistency with this project's standing no-branching policy,
not a deliberate exception; both were fast-forward-merged and deleted). This doc and the roadmap
entries are planning artifacts and live on `master` as always.

## Purpose and the gap it fills

A pressure/flow calculator for **looped** water networks, where the interface *is* a map you draw on.
The only comparable online tool (LMNO) caps at 9 nodes, is paid, and is form-based rather than
map-centric. EPANET owns the serious end and always will; this is for the person who has a small
network, wants an answer, and does not want to stand up EPANET.

**Target scale: ~10–20 nodes. This is a design decision, not a shortfall (Tom, 2026-07-28.)** An
engineer with a 200-node model would rather crack open EPANET, and 200 nodes is past the comfortable
usability limit of a browser canvas unless we are *very* good at this. **Our strength is the map
interface, not capacity.** 200 nodes appears in this doc only as a headroom check — we must not fall
over — never as the sizing target.

That one decision has more consequences than anything else here, so it is worth being explicit: it
**deletes the hardest part of the solver** (see "Linear solve" below), it sets the spike's
performance gate, and it is the reason a "we could support more" argument should be treated as scope
creep rather than ambition.

## Identity strings

- `lpn_main_menu` = **Looped Pipe Network (Map Interface)**
- `lpn_main_title` = **Free Online Looped Pipe Network Calculator with Map Interface**
- `lpn_main_desc` = **Pressure and Flow in a Looped Pipe Network You Draw on a Map**

**"…on a Map" alone was rejected (Tom, 2026-07-28)** and the reason must survive: it reads as a
*geographic overlay*, which is Phase 4 and may never ship. What distinguishes this calculator from
every form-based tool in the suite is that the interface is a drawing surface. "Map Interface" names
the paradigm; "You Draw" names the action. Do not let a later edit shorten either.

Per CLAUDE.md's identity-vs-explanatory split, the menu and title are identity strings; the
description is explanatory and stays Simple English.

**"EPANET" never appears in a translated string** — a brand name, and transliteration bait in
lower-resource languages. Say "the same gradient method EPANET uses" once, in the Notes prose.

Translation note for whoever runs the sprint: **"interface" is a near-universal loanword** and needs
no guard, but **"draw" is a genuine polysemy trap** — it must be translated as *draw/sketch a
diagram*, never *draw water* or *pull*. The wrong sense is not merely wrong, it is plausible in a
hydraulics context, which is what makes it dangerous. It recurs across the toolbar strings, so it
earns a `glossary.json` entry with an `avoid` array under the polysemy protocol, not a per-label
intent.

## Cut, not deferred

This section exists because scope gravity toward EPANET is the project's biggest risk, and because
the equivalent section in `branched-network-calculator-scope.md` turned out to be that doc's most
valuable page. Everything below is **out permanently**. Reopening any of it requires a new decision
with a new reason, not an appeal to completeness.

- **Extended-period simulation.** Steady state only.
- ~~**Tank.**~~ **REOPENED AND SHIPPED, 2026-08-14 (ROADMAP Task 248).** This is the first entry
  ever to leave this list, and the section above asks for a new decision with a new reason rather
  than an appeal to completeness, so here is both. The reason is not completeness: Tom raised Task
  248 to a GATE on the LibreEPANET.org launch, because tanks/valves/extended-period are exactly what
  Task 296 leaned on when it refused the phrase "web clone of EPANET" — they are the honesty case
  for the name. The decision is his, dated, and about sequencing, not about scope creep.
  What made it cheap enough to be worth doing was Task 243's engine: a tank in a steady-state solve
  is a fixed head at its water surface, which is precisely what EPANET itself solves at t = 0, so
  the original objection ("a tank is a *time-modeling* element") turns out to describe the phases
  that follow rather than this one. The Notes still say so out loud — `lpn_notes_1_def`: *"A tank
  is held at the water level you give it: within one solution it never runs down and never fills."*
  The second payoff was not anticipated and is larger than the first: `.inp` import used to drop
  every tank **and every link touching one**, so a municipal model arrived missing whole branches.
  EPA's own Net1, Net2 and Net3 all have tanks.
- **Water quality**, in every form (age, trace, chlorine decay, multi-species).
- ~~**Active pressure controls — PRV / PSV / FCV.**~~ **REOPENED AND SHIPPED, 2026-08-14 (ROADMAP
  Task 248 phase 2)** — the second entry ever to leave this list, and it left it in a way the
  original entry did not anticipate. The reason for the cut still stands word for word: *their
  open/active/closed status depends on the flow and pressure being solved for, which is a whole
  extra layer of logic.* **We did not write that logic.** ROADMAP Task 313 measured the two engines
  the day before and found EPANET ~9x faster than our own solver at the 21-node target and ~46x at
  201 nodes, so writing a second implementation of status switching would have been slower code for
  a problem the engine we already ship has solved. So:
  - **PRV, PSV and FCV are real elements, and the EPANET engine solves them.** A network holding one
    is routed to EPANET automatically and the status bar says so, without rewriting the user's own
    engine preference — the setting is a preference, the routing is a fact about this network.
    `js/lpn-solver.js` refuses such a network BY NAME (`valve-needs-epanet`) if the engine cannot be
    reached, which is the offline case and the only one a user meets.
  - **TCV works in both engines and needed no numerics at all.** A throttle valve is a minor loss on
    a zero-length link, which is arithmetic the solver already did for every pipe. So the old
    sentence — *a fixed minor-loss valve (a k-value on a pipe) is fine and is in scope* — was
    already describing a TCV; all that changed is that it is now an element with a name and a
    symbol instead of a pipe pretending.
  - **PBV and GPV stay cut.** A GPV's behaviour is a head-loss CURVE and a PBV's is a fixed pressure
    drop; this page has no element for either, and an imported one still arrives as a reported open
    pipe. That is the same exclusion, for the same reason, narrowed to the two types it still fits.
  - `bpn_` is unaffected and still makes the original exclusion.
- **Demand patterns and energy cost.**
- **Sparse linear algebra** — CSR storage, conjugate gradient, fill-reducing orderings, cached
  symbolic factorization. Cut *because of* the 10–20 node target; see below.
- **Any matrix library.** math.js is ~180 KB for a function that is thirty lines here.
- **Being a GIS.** No coordinate reference systems to choose, no reprojection, no datum handling, no
  shapefile or GeoJSON import. The document is flat Cartesian and stays that way; see "Backdrop and
  coordinates". Tiled maps (Phase 4) are a backdrop layer's problem, never the network's.

## Solver

### Global gradient algorithm (Todini), not Hardy Cross

Hardy Cross requires an explicit independent-loop set, pseudo-loops through every pair of fixed-head
sources, and — decisively — an initial flow distribution that *already satisfies continuity at every
node*. In a map editor the user adds a pipe every few seconds, so all of that setup gets re-derived
constantly. GGA needs no loop identification, no spanning tree, and no continuity-satisfying start,
and it converges quadratically (typically 5–12 iterations) where Hardy Cross is linear and can
stall. Record Hardy Cross as the method **not** chosen, with this reason.

### Formulation

Unknowns are link flows `Q` (one per link) and heads `H` at junctions. **Reservoirs are not
unknowns** — they are fixed-head boundaries contributing to the right-hand side only, never a matrix
row. At least one is mandatory, or the system is singular.

Each pipe: `h = H_start − H_end = r·|Q|^(n−1)·Q + m·|Q|·Q`, with `m = k / (2·g·A²)` for minor losses
and derivative `p = ∂h/∂Q = n·r·|Q|^(n−1) + 2·m·|Q|`.

| Method | n | r (SI: Q in m³/s, d in m, L in m) |
|---|---|---|
| Hazen-Williams | 1.852 | `10.667·L / (C^1.852 · d^4.871)` |
| Manning | 2 | `10.294·n²·L / d^5.333` (full pipe, R = d/4) |
| Darcy-Weisbach | 2 | `8·f·L / (π²·g·d⁵)` |

These are algebraically the same as the shipped forms in `js/branched-network.js:86` (Manning) and
`:92` (HW). **Verify numerically against the shipped calculator once**, then leave them alone.

For Darcy-Weisbach, `f` depends on `Q`, so recompute `f` from the previous iteration's flow and treat
it as frozen when forming the derivative — what EPANET does; convergence stays fast.

### Four things that will bite — rewritten 2026-07-29 from what Phase 0.5 actually found

The first two items here replaced what this section originally said. Both original claims were
plausible and both were wrong, which is the whole reason the spike came before the UI.

1. **Guard the GRADIENT, not the flow.** At `Q = 0` with the HW exponent, `dh/dQ → 0`, so
   conductance `1/p → ∞`. The original plan was a flow cutoff (`|Q| < Qmin` → linearize). That is
   *not sufficient*, and EPANET does not do it: a flow cutoff leaves the gradient unbounded just
   above the cutoff, so a link near zero flow gets an enormous conductance and swings wildly.
   **EPANET Net3 reproduces this exactly** — with a flow cutoff, pipe 333 oscillated between 0 and
   −2.28 gpm forever and the network never converged past 6e−5, while every other link had settled.
   The fix is a floor on `dh/dQ`, matching EPANET's `RQtol` default of 1e−6 ft/cfs converted to SI.
   (A tiny `Qmin` still exists, but only to keep zero out of `Q^(b−1)`, the Reynolds number, and the
   emitter derivative — never as a head-loss guard.)
2. **Damping turned out to be unnecessary — and the version first specified here was a bug.** The
   original text called for "a 0.6 relaxation factor once late iterations stall, without which pumps
   and emitters oscillate forever." No such oscillation exists once the gradient floor is in place:
   Net1, Net2, Net3, pumps, emitters and minor losses all converge in 5–16 iterations with no
   relaxation at all. Worse, the relaxation as written multiplied *every flow* by 0.6, which is not
   under-relaxation but arbitrary shrinkage — and since the GGA flow update satisfies continuity
   exactly, it would have destroyed that property every time it fired. **Do not reintroduce damping
   without a network that demonstrably needs it**, and if one appears, write it as
   `Q = Q_old + w·(Q_new − Q_old)`.
3. **Convergence must be normalised by total DEMAND, not by total flow.** Total flow is the wrong
   yardstick twice: it grows with link count, so equal physical accuracy reads differently on a
   bigger network; and when the solution decays toward zero it shrinks *alongside* the change,
   pinning the ratio at a constant. A zero-demand looped network shows this plainly — the relative
   change sits at 1.174 forever while the circulating flow halves every iteration.
4. **Stagnation detection is required, not a nicety.** Newton converges quadratically until it hits
   the roundoff floor of the dense factorization and then stops improving: on the 201-node grid,
   8e−1, 8e−2, 4e−3, 3e−5, 2e−7, 2e−8, then a plateau at ~5e−8 indefinitely. Without a stall check
   the solver spends 100 iterations and 330 ms re-deriving the answer it already had at iteration 6,
   **on every keystroke**. Stalling counts as converged only when the *absolute* change is also
   negligible — otherwise the zero-demand case above stops after 7 iterations and reports a
   circulating 0.04 L/s in a network with no demand at all.
5. **Pump singularity.** With a fitted exponent `b < 1`, `p → ∞` at `Q = 0`. Guarded with `Qmin`.

### Linear solve — dense, deliberately

`A` is a weighted graph Laplacian, assembled by looping links (~25 lines; no incidence matrices), and
is symmetric positive definite given at least one grounded node.

**Use a dense Cholesky (LLᵀ): ~30 lines, nothing to get wrong.** Keep it behind one function,
`solveSPD(A, b)`, so the sparse upgrade stays a local change if the scale assumption ever turns out
wrong.

Measured in Phase 0.5, replacing the estimate that was here before:

| Network | Nodes / links | Iterations | Time per solve |
|---|---|---|---|
| target scale | 21 / 32 | 5 | **0.4 ms** |
| EPANET Net3 | 97 / 119 | 16 | ~5 ms |
| headroom grid | 201 / 371 | 11 | **30 ms** |

The original estimate said the 200-node case would be "a few milliseconds"; that was wrong — it
counted a single factorization and forgot to multiply by the iteration count. 30 ms is still
comfortably inside a debounced edit, so **the decision holds even though the arithmetic did not**.

### Diagnostics run *before* the solve

Never diagnose topology by watching the solver fail. Four checks, four distinct messages:

1. **No fixed head at all** → "Add a reservoir or a tank." (A reservoir carries an elevation AND a
   head as of 2026-07-30, ROADMAP Task 179; a blank head means "the water surface is at this
   reservoir's own elevation". Since Task 248 a **tank** satisfies this check too — see
   `EngCalcs.lpnIsFixedHead`, the one place the two types are declared equivalent.)
2. **A node not connected to any fixed-head source** → BFS/union-find from all reservoirs over open
   links. **Name the specific node IDs and grey them on the map.** This is *the* dominant user error
   in a map editor: a pipe drawn near a junction but not snapped to it.
3. **Zero-conductance component** — reachable but every link closed or zero-diameter.
4. **Converged but implausible** — subatmospheric pressures, velocities outside band. Warnings, not
   failures; render with the existing `EngCalcs.inlineRangeWarnHtml` and `writeCheckHTML`.

The real fix for #2 is **snap-on-create** in the editor: a click within N screen pixels of an
existing node reuses it rather than creating a new one. Design that in on day one.

## Validation (Phase 0.5, done)

`js/lpn-solver.js` plus `dev/lpn-spike/`. Run with `node dev/lpn-spike/validate.js` — no network
access, no `node_modules`, 46 checks, exits non-zero on failure.

**The reference is the real EPANET engine, not transcribed numbers.** `epanet-js` (the EPANET C
engine compiled to WASM) runs EPA's own Net1, Net2 and Net3 and its results are committed to
`dev/lpn-spike/reference/`. `make_reference.js` regenerates them and needs `npm i epanet-js`; nothing
else does. Two things it does deliberately:

- **Tightens EPANET's own `ACCURACY` to 1e−8** before running. At EPANET's default of 1e−3 the
  reference itself carries a visible residual, and a near-dead-end pipe in Net2 was reported with a
  flow off by more than the flow itself — which showed up as a 0.404 gpm "disagreement" that was
  entirely EPANET stopping early. With a converged reference the same link agrees to 0.00000 gpm.
- **Records each link's status at t=0**, because status is boundary data for that instant's problem
  exactly like demands and tank heads. Net3 has a pump closed by `[STATUS]` and links switched by
  controls; evaluating controls is on the cut list, so they are read, not computed.

Four independent kinds of check, because "the solver agrees with itself" is not evidence:

1. **Residuals** — continuity and the constitutive head-loss equation, both to machine precision
   (~1e−15). For a network with at least one fixed head and monotone head-loss functions the
   steady-state solution is unique, so satisfying the equations *is* being right.
2. **Closed form** — a parallel-pipe split derived by hand and an emitter solved by independent
   bisection; both match to 1e−12.
3. **EPANET** — heads within 0.0002 ft and flows within 0.004 gpm on all three networks, run in
   `epanet` constants mode so constant choice is not confounded with solver error. The harness also
   computes EPANET's *own* continuity residual, so any disagreement can be attributed rather than
   assumed.
4. **Suite consistency** — the head-loss kernel is exact to 1e−12 against `branched-network.js` for
   all three methods.

**One finding worth carrying forward: this suite's Hazen-Williams and EPANET's are not the same
equation.** EngCalcs uses `Sf = 7.8828/d^4.8704 · (Q/(0.849 C))^1.852`; EPANET uses
`hL = 4.727 L Q^1.852/(C^1.852 d^4.871)`. Converted to SI the coefficients and the diameter exponent
both differ slightly — about **0.012%** in head loss. `lpn-solver.js` therefore carries both sets and
**defaults to `engcalcs`**: a new page disagreeing with the Hazen-Williams calculator sitting next to
it in the menu is a defect users would actually see, whereas matching EPANET to four decimals is
something only we check.

## Reuse

From `js/branched-network.js`, usable essentially as-is:

- `bpnDwFriction` (`:35-60`) — Swamee-Jain with laminar and transitional branches. Those branches
  matter **far more** here than in a single-pipe calculator, because low-flow links wander into the
  2000 < Re < 4000 band on every iteration.
- The HW / Manning / DW resistance **coefficients** inside `bpnFriction` (`:67-100`) — coefficients
  only. The function's shape (head loss from a known Q) is wrong for GGA, which needs signed head
  *and* derivative.
- `bpnSupplyHead` / `bpnParabolaHead` / `bpnPowerCurveHead` (`:295-345`) — EPANET's 1-point,
  2-point and 3-point pump-curve forms, already written and reasoned about. **The single
  highest-value reuse available.** New work is the analytic derivative and pump-closure logic (treat
  as closed for an iteration when `Q < 0` or head gain would go negative, and report it).
- `EngCalcs.g` (`:18`), the reachability-BFS pattern (`:179-203`), the localStorage try/catch idiom
  (`:466-489`).

From `js/Calculators.lib.js`: `readFormInput` / `writeFormResult` (`:379-399`), `escapeAttr`
(`:406`), `writeCheckHTML` (`:421`), `inlineRangeWarnHtml` (`:439`), `setUnits` (`:544`).

**Shared-library sequencing: write Phase 1 with a private copy, ship it, *then* extract
`js/PipeHydraulics.lib.js`** in a separate behavior-preserving commit, diffing `bpn_`'s output on a
saved network before and after. *(Started 2026-08-05: ROADMAP Task 213 created that file and moved
the Hazen-Williams constants and `hwSlope()` into it, as the constants had to be unified anyway. The
Darcy-Weisbach and Manning kernels are still private copies and follow the same sequencing.)* Extracting during Phase 1 would risk regressing a shipped,
26-language calculator against a page that has no tests yet. **Do not share the solver** — bpn's two
directional sweeps and the GGA have nothing in common; the same principle `bpn_`'s own scope doc
states about `ip_`.

**One exception, done before Phase 1:** `bpnDwFriction` is already the *third* copy of the same
Swamee-Jain function — the comment at `js/branched-network.js:34` says so outright. A fourth is
indefensible. Extract `dwFrictionFactor` alone as a pre-Phase-1 chore and diff its three existing
call sites together.

## Data model and persistence

**Cookies cannot hold a network, and the size cap is not even the main reason.** A cookie is ~4 KB
including name and attributes, *and is transmitted on every single HTTP request to the domain* —
every page, stylesheet, script, and icon. A 200-node network is ~60–80 KB of JSON (~110 B per
junction, ~140 B per pipe), so it would be uploaded repeatedly on a suite whose audience works on bad
connections. Even a 20-node network at ~4 KB is exactly at the cap with nothing to spare.

**localStorage** — ~5 MB, same-origin, never transmitted — is the right home, and is already used for
this class of state (`bpn_sketch_toggles`, `js/branched-network.js:453`). A 20-node network is well
under 1% of budget; dozens of named networks fit comfortably.

Document shape: `{v, app, name, saved, units, settings, view, nodes, links, texts}`. Storage keys
`lpn_index`, `lpn_doc_<id>`, `lpn_ui`. Autosave on a 2-second debounce; wrap every localStorage call
in try/catch (private mode throws).

Rules, stated as rules because each is silently wrong when broken:

- **Every stored value is SI.** `units.preset` records only what the UI *displayed*, so reopening
  under a different preset is a display change and never a data change. This is the most important
  rule in the schema — the same class of silent error as the scalar-default trap in CLAUDE.md.
- **IDs are the join key, never array indices.** Users rename and delete things; index references
  break on the first delete.
- **Results are never stored.** They derive in milliseconds; storing them guarantees stale numbers.
- **`len` is stored and overridable, not derived.** Map geometry is schematic until Task 145 supplies
  real coordinates, so a computed-only length would be a lie. `lenAuto` records whether the user has
  taken control.
  **UI for `lenAuto` — the per-link half is built (Phase 1, 2026-07-29).** Tom's original sketch
  from the Phase 0 spike was a two-level control, not a single toggle. Per-link, in the Pipe
  property popup: an Auto/manual switch for *this* link only — **done**: the Length field pairs
  with an Auto checkbox; typing a value clears it (manual override), re-checking it snaps back to
  the live geometric distance (`linkGeomLength()` in `js/looped-network.js`). **Still not built**:
  the suite-wide half, in the gear/settings panel — a default for new links (auto by default) plus
  bulk operations over existing links, "force all to auto," and some release/disconnect verb for
  the opposite (Tom's own words: "orphan/freeze/disconnect/release all auto lengths") for taking a
  whole network off auto-length at once, e.g. before a `.inp` export where schematic auto-lengths
  would be misleading. Design the exact verb and semantics when the gear panel is actually built
  (Phase 2) — this half is still a placeholder for the idea, not a spec.
  **Auto and manual length are numerically identical, no SI conversion for either (Tom,
  2026-07-30) — this is the AutoCAD "unitless drawing units" convention, deliberately.** Grid/
  canvas coordinates and lengths carry no independent real-world scale in Phase 1; the units
  strip's distance_site selector is a *label* for what one grid unit is declared to mean (a foot,
  a meter, whatever), not a conversion multiplier — 1 grid unit **is** 1 of the selected unit, by
  declaration, the same way an AutoCAD drawing is unitless until the operator says otherwise. This
  is categorically different from Elevation/Demand/Head/Diameter, which are independently *typed*
  real quantities with genuine SI storage and real US⇄SI conversion on unit switch — length is
  *tied to drawn geometry*, so it isn't. A `lenAuto` manual override is therefore just a plain
  number in declared units, not a separately-tracked real-world length; the earlier round's design
  (auto = unitless canvas distance, manual = SI-converted real length) was an unnecessary split
  and has been removed.

- **Pump curve entry — DONE 2026-07-30 (ROADMAP Task 176), built exactly to this sketch.** The
  Pump property popup's field slot is a `<select>`: "Enter points below" (default) shows up to 3
  `[Q,H]` point rows feeding `EngCalcs.lpnPumpFromCurve()`, or any OTHER pump's id, which makes this
  pump copy that pump's curve (`l.curveRef`) instead of using its own points — one slot serves both
  cases, as sketched. Reference resolution is a single hop only (`resolveCurvePoints()` never
  chases a chain), so a reference cycle can't form; a deleted or renamed referenced pump is handled
  by `renameLink()` rewriting every `curveRef` that pointed at the old id, and a reference to a
  since-deleted id simply falls back to the referencing link's own (possibly empty) points.
  **Amended 2026-07-30 (ROADMAP Tasks 179/180):** a new pump gets NO curve at all rather than a
  default design point — a pump does exactly what the curve you entered says, and nothing until you
  enter one (`recomputePumpCurve()` sets `h0 = a = 0`, and the solver's pump branch has an explicit
  no-curve case using the same `gradMin` floor the pipe branch uses, so a curveless pump solves as a
  lossless connection). There is no separate "head gain" quantity anywhere: a pump reports a
  NEGATIVE head loss. The equation and the 1/2/3-point cases are documented in the page's own Notes
  list (`lpn_notes_5`), with a one-line pointer under the popup's curve table.
  `js/looped-network.js`.
- **Versioning:** `v` is a monotonic integer. `v > CURRENT` refuses to load and says so — never
  silently drop unknown fields. `v < CURRENT` runs an ordered chain of pure migrations, keeping a
  `_backup` copy first, because there is no undo in localStorage.
- **IDs restricted to EPANET-legal characters** (no spaces, no quotes), validated on entry. Costs
  nothing now and keeps a future `.inp` exporter a pure function.

## Backdrop and coordinates

**A network is drawn over something, and that something is usually not a map (Tom, 2026-07-28.)**
Nobody uses EPANET without a backdrop, and in practice the backdrop is a plan sheet, a CAD export, or
a local aerial — **never** a Google map or Google aerial, though it could be. This reorders the work:
the valuable, tractable feature is a *user-supplied* backdrop; online tiles are a later, optional
enhancement rather than the foundation.

### The document is flat Cartesian, always

One rule holds the whole design together: **the document's coordinates are a plain flat Cartesian
world system with no projection, no datum, and no units beyond a scale the user sets.** Every element
position, every length, every backdrop registration lives in that system. This is not a simplification
to be regretted later — it is what keeps the calculator honest about being a hydraulic tool that
happens to have a map, rather than a GIS.

Georeferencing, when it arrives, is a property of a **backdrop layer**, never of the network.

### Phase 2: user-supplied backdrop, projection-free

An image (PNG/JPG, and a scanned plan is the common case) placed by **two-point registration**: the
user clicks two points on the image and states the real distance between them, which yields scale,
offset and optionally rotation. This is exactly what EPANET does, and it is deliberately dumb:

- **No projection, no transformation library, no coordinate system to choose.** Two points and a
  distance.
- **No API key, no terms of service, no attribution obligations.**
- **No network connection** — so it survives offline in the PWA, which is a real part of this suite's
  audience. A tile-dependent design would break exactly the field user we care most about.
- Stored as a data URI or an object reference in the document, subject to the localStorage budget —
  a scanned plan can be large, so downscale on import and record the original dimensions.

**The canonical use case, and the canonical test case, is a screenshot with a bar scale on it**
(Tom, 2026-07-29) — commonly a Google Maps screenshot, which is a very different thing from a Google
Maps *integration*: it is a plain image the user already has, with no API, no key, and no terms of
service. It is also the reason two-point registration is the right mechanism rather than a
scale-factor field: **the user clicks the two ends of the bar scale and types what it says.** That is
a single sentence of instruction, it needs no knowledge of projections or units-per-pixel, and it
works identically for a scanned plan sheet, a CAD export, and a phone photo of a drawing on a wall.

Build the spike's backdrop case as a screenshot with a visible bar scale, and make registering it the
acceptance test.

**Built (Task 146 Phase 2, 2026-07-30), ported from the spike, verified with a scripted Playwright
smoke test** (add image, two-point Scale, Position in all three target modes, Escape-cancel, reload
persistence, Undo non-interaction, Remove image, >1600px downscale). Three decisions made during the
port, beyond what the spike/this doc left open:
1. **Backdrop lives outside the undo-snapshotted `doc`** (a top-level `backdrop` var in
   `js/looped-network.js`, alongside `labelSettings`) — `saveUndoSnapshot()` deep-clones `doc` on
   every mutation, keeping up to 20 snapshots, and a multi-hundred-KB-to-multi-MB data URI in there
   would multiply badly. Still persisted to localStorage as a sibling key, just not undo-tracked.
2. **Downscale on import caps the longest side at 1600px** via an offscreen `<canvas>`, PNG output
   (not JPEG, to avoid blurring a scanned plan's thin lines) — the mechanism this section already
   called for; 1600 is the specific number chosen.
3. **Initial placement size** matches the new image's longer side to the current network's own bbox
   extent (a fixed default when the network is empty), aspect-ratio-preserved, rather than an
   arbitrary fixed size — Scale/Position are how the user then registers it precisely.

Also added beyond the spike: a **"Remove image"** menu option (the spike never had a way to remove a
backdrop once added).

**Design consequence for the Phase 0 spike:** the coordinate seam must be able to place and scale a
backdrop image from day one, so the spike includes one. Retrofitting a backdrop into a view layer
that assumed nothing behind the network is the kind of rework this doc exists to prevent.

### The empty canvas

A blank project should not be a blank rectangle. Emblazon placeholder text across it — *"Start by
adding a background image using the toolbar"* — which does three jobs at once: it says what to do
first, it teaches that this calculator is backdrop-first rather than form-first, and it removes the
"is this broken?" moment that an empty drawing surface otherwise produces.

**Decided (Tom, 2026-07-30): a genuinely empty canvas, with a hint (`lpn_empty_hint`) pointing at
both options** — "Add a backdrop or a reservoir (or other element) to start, or use 'Draw example
network.'" This splits the difference the three options below couldn't on paper: it doesn't force a
worked example onto a page whose whole premise is the user's own site (a map-first tool imposing a
stranger's network read as backwards), but "Draw example network" is one click away for anyone who
wants the suite's usual passing-design starting point. Confirmed working well once the backdrop
feature made the choice concrete rather than theoretical. (Original question, for the record: a
genuinely empty canvas, a worked example network per the rest of the suite's convention, or an empty
canvas plus the prompt — decide once the editor exists and can be looked at, not on paper.)

### Phase 4 (Task 145): tiles, and the two traps they bring

If online tiles land, they are **one more backdrop type that happens to arrive pre-registered**. Two
problems appear that the user-supplied backdrop simply does not have, and both are silent:

1. **Projection.** Tiles are Web Mercator; a plan sheet is State Plane, UTM, or a site grid. Mixing
   them is a real coordinate transformation, not a scale factor. **Do not let Web Mercator become the
   document's coordinate system** — that is the failure mode, and it is one-way.
2. **Web Mercator distances are not ground distances.** The scale error is `1/cos(latitude)`: about
   15% at 40°, 30% at 50°, unbounded toward the poles. A pipe length measured naively off a tiled
   backdrop is therefore wrong by far more than any engineering tolerance, silently, while looking
   entirely reasonable on screen. Lengths from tiles must be computed geodesically from lat/lng or
   corrected for latitude — never taken from screen geometry.

Trap 2 is the strongest argument for the existing schema rule that **`len` is stored and overridable,
never derived**. It was written for a different reason (schematic geometry is not real geometry) and
turns out to be exactly the guard this needs.

### Effect on the canvas technology choice

This weakens the Leaflet case rather than strengthening it, which is the opposite of what the Task 145
move suggested on its own. Leaflet's central gift is tile handling; a registered static image is an
`ImageOverlay` in Leaflet and an `<image>` with a transform in SVG — comparably easy either way. So
the spike still decides, and it decides on touch behavior and text rendering as before.

## Suite integration

**The page emits its own `<form id="formInput">`** rather than calling `echoCalculatorForm()`. Its
inputs are a per-element property sheet whose fields change with element type, which the fixed
two-column table cannot express — `Branched-Network.php:11-31` already shows the strain of pushing
against that. Keep the form's **name**: `EngCalcs.submitForm()` and `Cookies.lib.js` hard-code
`document.forms['formInput']`. Also re-emit the `btn-printable` listener, which currently lives
inside `echoCalculatorForm()`'s inline script — skip that function and the print button silently does
nothing.

Two shared-code chores make this clean rather than a copy-paste fork of suite chrome — **ROADMAP
Tasks 174 and 173**, both worth doing on their own merits:

- **`echoUnitsRow()`** extracted from `lib/Calculators.lib.php:172-179`, so the Restore-defaults /
  US / SI row has one home.
- **`EngCalcs.initTips(root)`** replacing the once-only `DOMContentLoaded` tooltip initializer at
  `js/Calculators.lib.js:8-12`. Every tooltip inside a dynamically built property popup would
  otherwise be **dead on touch**.

**Units: a page-wide units strip**, one `echoUnitSelect()` per family, read by every property popup
and map label. This is better than per-row selects for a map page *and* it makes the US/SI preset
buttons work with no new machinery, since `setUnits()` already targets any `select[data-family]`.

Families used: `distance_site` (length, elevation, X/Y), `distance_small` (diameter), `total_head`
(nodal total head — the family exists precisely for EGL/HGL and is water-column-only by design),
`partial_head` (junction pressure, pump head gain), `flow_node`, `flow_total`, `velocity`, and
`roughness` (DW only).

**One new family: `unit_headloss`** (`mpkm`, `ftpkft`, `grade`) — the hydraulic gradient EPANET
reports and the Pipe results need. `slope`'s rise/run is not what an engineer wants in that column.
Note the wrinkle: unit head loss is dimensionless (m/m), so "m per km" and "ft per 1000 ft" carry the
*same* conversion factor — two labels, one number. Add the family to **both** presets; a family
missing from a preset is the exact class of bug the family design removed.

**Emitter coefficient gets no unit select** — its units are flow/head^γ and therefore depend on the
exponent. Label it in text. EPANET has the same wart; do not invent a family that cannot be right.

**RTL:** the chrome flips via `dir="rtl"` for ar/fa/he/ps/ur; **the map must not**. Set `dir="ltr"`
explicitly on the SVG container and any coordinate readout. Two lines, invisible until someone
reports a mirrored network.

**SEO / discovery:** `$html_desc = $ec_lang['lpn_main_desc'];` (reuse, no meta-description key); menu
entry beside `Branched-Network.php`; **add the page to `sw.js`'s precache list** or it will not work
offline; cross-link from Hazen-Williams and Branched Network, following the Task 138 precedent —
Task 144's leading hypothesis is that HW's lost humans arrived with a *network*, and this page is the
destination that hypothesis predicts.

## Translation cost

`bpn_` shipped with 53 keys; `ip_` has 59. This page is bigger: **~85–95 net new keys** after
concept-reuse (toolbar and modes, five element type names, a de-duplicated property vocabulary,
results, gear panel, label toggles, diagnostics, notes, tips). That is **~2,300 strings across 26
Sonnet agents, roughly 1.7× the `bpn_` sprint** — the most expensive translation event since the
category sprints.

Three consequences:

1. **Ship Phase 1 English-only.** CLAUDE.md explicitly allows English as fallback, the page renders
   fine, and a map UI's strings churn for weeks after first ship. **Paying 26× for churn is the
   expensive mistake.** Run the sprint between Phases 2 and 3.
2. **Freeze the English before launching.** A post-sprint edit trips the drift tripwire across 26
   files.
3. **Design to suppress key count.** One shared property vocabulary across element types (an "ID" is
   an "ID"); long explanations in tips rather than separate note keys; resist a short+long pair per
   diagnostic where one string does the job. Trimming 110 keys to 85 saves 650 strings — every key
   is a 26× multiplier.

Reuse candidates: `ws_notes_heading`, `dw_kinematic_viscosity` (+`_short`, `_tip`), `mi_v617`,
`ip_length`, `ip_diameter`, `mphl_total_junction_k_short` (+`_tip`), `bpn_method` / `_hw` / `_dw` /
`_manning`, `bpn_roughness_tip`, `bpn_demand`, `bpn_elev_down`, `mhp_vel_high` / `_low`,
`ip_pressure_high`, `points_data_*`.

**Rule A/B in a JS-built UI:** deliver strings via an `EngCalcs.pageConfig = { key: <?=json_encode(…)?> }`
block as `Branched-Network.php:132-144` does. `plainTextBoundKeys()` derives the plain-text
constraint from the app source and does cover the JS tip route — but that route was found missing
once already, and **this page roughly doubles the suite's JS-delivered tips**, so run
`lang_syntax_validate.php --rule-c` once the page exists rather than assuming. All JS-built tips go
through `escapeAttr` and use the whole-label `.ec-help` / `.ec-tip` nesting.

## Phasing

**Phase 0 — canvas spike. DONE 2026-07-29.** SVG DOM confirmed as the technology — no Leaflet
fallback needed. Full history in `dev/lpn-spike/phase0-acceptance.md`; summary in the ROADMAP Task
146 entry.

**Phase 0.5 — headless solver. DONE 2026-07-29.** `js/lpn-solver.js` + `dev/lpn-spike/`, 46 checks
passing against the real EPANET engine, closed-form cases, and machine-precision residuals. See
"Validation" above.

**Phase 1 — smallest shippable.** Page, prefix, menu entry, `sw.js` entry, English-only strings.
Junction / Pipe / Reservoir / Pump / Text. Toolbar: Select, Pan, Add-each, Delete, Zoom Extent.
Property popup per element. Units strip with working presets. Debounced GGA solve on every edit.
ID + pressure map labels. Single-network localStorage autosave. The four diagnostics. Snap-on-create.
A Notes list stating honestly what the tool does not do.

- **Vertex editing moved IN from Phase 3 — reversed 2026-07-29, on-device Phase 0 finding
  (Tom).** The original plan cut polyline pipes entirely from Phase 1 ("pipes are straight segments
  between nodes... removes the single hardest interaction from the first release"). Seeing the
  canvas spike's one bent pipe next to fourteen straight ones on a real network settled it the other
  way: straight-segment-only pipes are "not a post-deployment option... non-negotiable" — real
  utility routing follows property lines, road crossings, and easements, and a tool that can't
  express a bend around them doesn't match how pipes actually get drawn. This is exactly what
  Phase 0 exists to catch before Phase 1 gets built on the wrong cut. Ships as an editable vertex
  handle in Phase 1, not deferred.
  **Vertex count: arbitrary, not capped — decided 2026-07-29 (Tom: "if it's significantly easier to
  have max 3 vertices per link, do that; otherwise arbitrary; 1 is not enough").** The spike settled
  this empirically: in SVG a polyline's point count doesn't change the render cost, so the only real
  cost is the insert/delete gesture, and that gesture (double-click a segment to add a bend,
  double-click a bend to remove it) is the same effort whether capped at 3 or unbounded — a fixed
  cap would have added special-casing (deciding where uncreated slots start) for no savings. `link`
  carries a `verts: [{x,y}, ...]` array in the spike's data model (0 or more), which is the schema
  Phase 1 should carry forward.
- **Also out:** report tables, element browser, extrema marks, draggable labels and leaders,
  collision avoidance, insets, map-vs-screen text size, valves, tanks, `.inp` export, multiple saved
  networks.
- **One thing argued back onto the list: undo.** Keep the last 20 document snapshots **in memory**
  (not localStorage) and wire Ctrl-Z. ~15 lines given a serializable document, and a map editor
  without it makes users quit.

**Phase 2 — reporting, legibility, and the backdrop.** Node and link report tables, the EPANET-style
element browser list, the gear/settings panel (ID prefixes J/L/P/R, emitter exponent, text size and
its map-vs-screen units toggle, tolerance — see the expanded scope note below), multiple named saved
networks, and the **user-supplied backdrop image with two-point registration** — projection-free,
offline-capable, and the thing that actually makes the map interface useful for real work. **The
translation sprint goes here.**

**The label toggle set with extrema marks is DONE (2026-07-30, branch `lpn-labels`), through two
rounds of Tom's feedback on the first cut.** Every field on a node (ID, elevation, demand, head,
pressure) and a link (ID, diameter, length, flow, velocity, headloss) is independently toggleable via
a new "Labels" toolbar button/popover, each rendering as its own line under the element (multi-line
SVG `<tspan>`s).

- **Pure numbers, color-coded — not "Label: value unit" text (Tom, round 2).** Reusing
  `js/branched-network.js`'s `EngCalcs.bpnFieldColors`/colored-checkbox convention instead of a
  label/unit suffix: `lpnFieldColors` reused bpn's colors where the concept overlapped
  (id/length/diameter/flow/elevation/pressure) and added new ones for demand/head/velocity/headloss.
  The color-coded checkbox in the Labels popover was the only legend.
  - **SUPERSEDED 2026-08-15 by ROADMAP Task 333** (Tom: *"No more label colors"*). The palette is
    gone; a field now says which quantity it is with a per-field **prefix** (`Q`, `V`, `S`, `H`,
    `P`, `E`, `Hl`, `km`, `C`/`n`/`e`) and optional **suffix**, both editable per project in the
    Labels box, separated from the number by one blanket separator that defaults to a space. The
    legend keys on the prefix instead of on a colour swatch. The "pure numbers, not sentences" half
    of the decision stands — a prefix is one or two characters, not a label — but colour is now
    saved for MEANING (Task 327's colour-by-value view) rather than spent on identity, and a prefix
    survives greyscale, a printed sheet and a colour-blind reader.
- **Extrema mark is a tick beside the number, not text-decoration on it (Tom, round 2: "it's not
  such a great idea because it's ambiguous... I don't know if there is something else").** The first
  cut used CSS overline/underline on the number itself; Tom read that as ambiguous and an unfamiliar
  convention. Replaced with a short raised ("high") or lowered ("low") tick line drawn just after the
  number, positioned from the number's own rendered width
  (`tspan.getComputedTextLength()`) — a separate SVG `<line>`, not a text decoration, so it never
  reads as underlining/striking the digits themselves. This is the option Tom guessed would work best
  ("a high or low line after the number"); revisit again if it still doesn't read clearly on-device.
- **Suppressed below 3 members (Tom, round 2), not 2.** With only 1 or 2 values, "the max" and "the
  min" aren't a finding — `fieldExtrema()` now returns nothing until a field has at least 3 defined
  values across the network.
- Ties (2+ elements sharing the extreme) all get marked, not just the first found — unchanged from
  round 1, and still correct under the round-2 rounding-before-comparison rule (comparing un-rounded
  SI values could mark one of two links carrying the same physical flow as "max" and the other "min"
  purely from solver roundoff past the display precision; rounding first is what makes a displayed
  tie read as a tie).
- Persisted as `labelSettings` in the existing localStorage document, deliberately NOT part of the
  undo-snapshotted document (a view preference, not network content, so Ctrl-Z doesn't revert your
  label choices). Defaults reproduce exactly what Phase 1 shipped (node ID+pressure only, plain
  black/no color), so shipping round 1 was a visual no-op until a user opted in.
- Verified on-device-equivalent via a Playwright/Chromium smoke test (drawing the example network,
  toggling every field, confirming extrema/ties/threshold/persistence/undo-independence all behave
  correctly) since no interactive browser was otherwise available in this environment.
- English-only, per the Phase-1 pattern (translation sprint still waits for the string set to settle).

**Two more Tom round-2 asks, also DONE on the same branch:**
- **The example network is now an actual loop.** `drawExampleNetwork()` originally built R1-J1
  (pump) then J1-J2 (one bent pipe) — a tree, with no cycle at all, despite being the example for a
  *looped*-network calculator. Added a second, straight J1-J2 pipe so there are two parallel paths.
- **Rubber-band + first-node highlight while drawing a pipe/pump (Tom: "otherwise there's no
  indication that anything is working").** After the first node is picked in add-pipe/add-pump mode,
  a dashed line now tracks the pointer to the second click, and the picked node gets a thin red ring
  (`.lpn-node-pending`) until the link completes or the tool is switched away. Both are cleared
  together by one function, `setPendingLinkFrom()`, so they can never drift out of sync with each
  other or with the actual pending state.

**Gear/settings panel scope, expanded (Tom, round 2).** In addition to what Phase 2's bullet above
already named, the gear panel is also where a **text format system** and a **symbols/pipes/labels
scale-settings system** belong (Tom asked whether a gear icon was planned at all — yes, this
confirms it and folds these two into its existing scope rather than opening a separate feature).
Not designed in detail yet; do that when Phase 2's gear panel is actually built.

**Gear/settings panel BUILT, first cut (Tom, 2026-07-30), verified with a scripted Playwright smoke
test.** A "Settings" toolbar button opens `#lpn_settings_popup` (`wireSettingsPopup()` in
`js/looped-network.js`), same static-panel pattern as the Labels popover. Persisted like
`labelSettings` — a preference, not network content: NOT undo-tracked, survives "New / Clear"
(fixing a related latent gap found while verifying this — `clearNetwork()` was calling
`localStorage.removeItem()` instead of `saveToStorage()`, which wiped labelSettings/settings out of
storage, not just memory, until some later unrelated mutation happened to re-save). Five of the six
items this section and Phase 2's bullet named are live:
- **ID prefixes** (J/R/L/P/T) — customizable text inputs; changing one only affects IDs generated
  from that point forward, never renames existing elements.
- **Emitter exponent** and **convergence tolerance** — feed `js/lpn-solver.js` via
  `assembleModel()`/`runSolve()`; defaults (0.5, 1e-9) match the solver's own built-in defaults, so
  shipping this was a no-op until a user changes either.
- **Text size**, with a **map units / screen pixels** toggle — 'map' reproduces the original fixed
  `LABEL_FONT_SIZE=2.5` behavior exactly (text scales with zoom, like the network geometry); 'screen'
  keeps text a constant on-screen size regardless of zoom, recomputed on every `zoomAbout()`/
  `zoomExtent()` via `effectiveFontSize()`/`refreshFontSizes()`.
- **Legend position**, the 6-way choice logged below — live via `applyLegendPosition()`.

**Symbols/pipes/labels scale-settings system is BUILT** — see "Built (2026-07-30)" below (legend
position was the concrete shape it took). **Text format system is now partly scoped (Tom, 2026-07-29):
a simple per-label size multiplier is Task 146.03** (`dev/ROADMAP.md`), priority 90. Richer text
formatting (bold, font family, etc.) remains genuinely undesigned beyond that — not deferred for lack
of time, just no concrete ask yet. Design it when there's one.

**Now scoped: an EPANET-style icon toolbar — Task 146.02** (`dev/ROADMAP.md`), priority 95, Tom
2026-07-29. Replaces/supplements the current toolbar with EPANET-style icons for elements and map
symbols, avoiding per-language translation cost the way EPANET's own icon toolbar does. **Must land
before the translation sprint (Task 146.06), which it blocks.**

**Now scoped: a background mask behind labels — merged into Task 146.01** (`dev/ROADMAP.md`),
priority 100, Tom 2026-07-29. A partly-opaque background behind map text so it stays legible over a
busy backdrop or overlapping geometry, plus a setting for how opaque. The backdrop-image feature this
was waiting on shipped 2026-07-29 (`c46260f`), so label-over-backdrop legibility is now a real,
testable problem — no longer hypothetical.

**Legend placement, quick fix now + configurability logged for the gear panel (Tom, round 3,
2026-07-30).** `#lpn_labels_legend` moved from a horizontal row above the canvas to a vertically-
stacked, upper-right overlay ON the map (`Looped-Network.php`, `renderLabelsLegend()` in
`js/looped-network.js`) -- the original placement/orientation read poorly. Upper-right is a fixed
default for now. **Choosing among corners/edges is a gear-panel setting, not built yet**: Tom's own
framing is 6-fold, not 8 -- one of {top, middle, bottom} crossed with one of {left, right}, since a
legend anchored to a true corner vs. a true edge-middle are the only positions that make sense for a
stacked block (no top-center/bottom-center variant the way an 8-fold compass rose would imply). Design
the exact setting shape when the gear panel is actually built (already scoped there per the round-2
note above); this note exists so the placement default isn't mistaken for a settled decision.

**Built (2026-07-30), as the exact 6-fold Tom specified.** `settings.legendPosition` (gear panel),
one of top/middle/bottom x left/right; `applyLegendPosition()` in `js/looped-network.js` sets
`#lpn_labels_legend`'s `top`/`bottom`/`left`/`right`/`transform`, clearing the unused axis each time
so switching positions never leaves a stale offset behind. Default `top-right` reproduces the
original hardcoded CSS exactly.

**Correction (Tom, 2026-07-30): "draggable labels with leaders" below was a data-label/Text-label
mixup from the start.** Text labels (the user-placed `T` elements) already have exactly this —
drag, an auto-flipping leader, an anchor node — shipped in Phase 1/2. What was actually meant, and
is still unbuilt, is **remote/leader placement for DATA labels** (the ID/elevation/demand/flow/etc.
map labels that render fixed beside their node or link): on a short pipe or a crowded cluster of
nodes, the fixed position has nowhere legible to sit, so a data label needs the same drag-to-a-leader
escape hatch a Text label already has. Automating the placement (auto-detecting a cramped spot and
offering a leader) is a nice-to-have; **manual leader placement must exist regardless, and collision
avoidance is the critical piece** — a leader that can land on top of another label/leader defeats the
whole point. **This is now Task 146.01** (`dev/ROADMAP.md`), priority 100 — merged with the
background-mask item above into one unit, per Tom 2026-07-29.

**Phase 3 items, reorganized 2026-07-29 into `dev/ROADMAP.md` child tasks** (no longer phase-shaped;
priority is now visible per item there): remote/leader data-label placement + collision avoidance is
**Task 146.01** (see the correction above; NOT Text labels, which already have this — the Phase 0
label-reset gesture note applies there too, not to Text); map insets for congested areas is
**Task 146.09** (very low priority); a link property is **Task 146.07** — Tom, 2026-07-29: a simple
**Open/Closed** boolean state, explicitly *not* framed as "valve" and *not* modeled via minor-loss
Km abuse, kept as small as possible. The old `.inp` export/import item is **not** carried forward as
written — Tom confirmed 2026-07-29 the actual need behind it is local multi-project save/retrieve
(rotating among several saved `lpn_` networks), which is **Task 146.08**; true EPANET `.inp` file
interop was considered and declined for now. *(Polyline pipe vertex editing, originally slated here,
moved to Phase 1 — see the note above.)*

> **SUPERSEDED 2026-08-11 for the READING half.** The "declined for now" above was reversed on Tom's
> own instruction (*"I think it is wise now for us to stress-test our paradigms by trying to import
> an EPANET file"*), and **File > Import EPANET file (.inp) ships** — `js/lpn-inp.js`, ROADMAP Task
> 196. Two things did NOT change and are worth keeping straight. The cut list below is untouched:
>
> **SUPERSEDED AGAIN, 2026-08-14, for tanks and valves** — both left the cut list in Task 248 and
> both now import as themselves. What is still absent is patterns, water quality, extended-period
> simulation, PBV and GPV valves, and an import that meets one still reports it rather than
> pretending. And import is not persistence: an `.inp`
> lands as an ordinary browser project, Task 146.08's library is still where projects live, and
> nothing writes an `.inp` back yet (that is Task 281).

**Phase 4 — Task 145**, the Google/OSM tiled map and elevation mashup, moved here from `bpn_`. By
this point it is one more backdrop *type*, not a foundation — and it brings the projection and
Web-Mercator-distance traps documented in the Backdrop section. **Confirmed low priority (Tom,
2026-07-29)** — stays at its existing ROADMAP priority of 11; this is a "maybe cool, try it sometime"
item, not a near-term target.

## Abort points

After Phase 0 (one day). After Phase 0.5 (four days). After Phase 1, on instrumentation.

**Nothing before Phase 2 requires a translation sprint, a CDN dependency, an API key, or a change to
any shipped file except `lib/Menus.lib.php`, `sw.js`, and the two shared-code chores.** That property
is what makes the project abortable, and it is a stated architectural constraint — the same way
Task 145's "the core solve never depends on it" is.
