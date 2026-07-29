# Looped Pipe Network Calculator (Map Interface) — Scope

Status: **scoped 2026-07-28, not started.** ROADMAP Task 146, with spikes as Tasks 171 (canvas) and
172 (solver). Prefix **`lpn_`**; page `Looped-Network.php`; JS `js/looped-network.js`.

Sibling of `bpn_` / `Branched-Network.php`, which stays **exactly as shipped** — this is a new page,
not an evolution of that one. The row-table form is genuinely better for a simple series run, and
`bpn_` has 53 keys translated into 26 languages that a UX rewrite would put at risk for no gain.

**All build work happens on a dedicated git branch** so it never blocks other work on `master`. This
doc and the roadmap entries are planning artifacts and live on `master`.

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
- **Tank.** Tom's own read, and it is correct: a tank is a *time-modeling* element and this is a
  steady-state tool. Say so in the user-facing Notes rather than leaving it as an implied gap.
- **Water quality**, in every form (age, trace, chlorine decay, multi-species).
- **Active pressure controls — PRV / PSV / FCV.** Their open/active/closed status depends on the
  flow and pressure being solved for, which is a whole extra layer of logic. A *fixed* minor-loss
  valve (a k-value on a pipe) is fine and is in scope. This matches the same exclusion `bpn_` made,
  for the same reason.
- **Demand patterns and energy cost.**
- **Sparse linear algebra** — CSR storage, conjugate gradient, fill-reducing orderings, cached
  symbolic factorization. Cut *because of* the 10–20 node target; see below.
- **Any matrix library.** math.js is ~180 KB for a function that is thirty lines here.

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

### Three things that will bite, listed because they are easy to miss

1. **Zero-flow linearization is mandatory, not a corner case.** At `Q = 0` with the HW exponent,
   `p → 0` and `1/p → ∞`. That is not an edge case — it is the state of a freshly drawn network on
   iteration 1. Below `Qmin = 1e-8 m³/s`, linearize: `h = r·Qmin^(n−1)·Q`, `p = r·Qmin^(n−1)`. Two
   lines, and it is the difference between "solver works" and "NaN on the default network." Note
   `bpnFriction` sidesteps this entirely with an early `q === 0` return — correct for a direct
   solve, useless here.
2. **Damping.** When the relative change still exceeds 0.1 after ~10 iterations, apply a 0.6
   relaxation factor to the flow update. Three lines, and without it networks with pumps or emitters
   oscillate indefinitely.
3. **Pump singularity.** With a fitted exponent `b < 1`, `p → ∞` at `Q = 0`. Same `Qmin` guard.

### Linear solve — dense, deliberately

`A` is a weighted graph Laplacian, assembled by looping links (~25 lines; no incidence matrices), and
is symmetric positive definite given at least one grounded node.

**Use a dense Cholesky (LLᵀ): ~30 lines, microseconds, nothing to get wrong.** A 20×20 factorization
is ~2,700 flops. Even the 200-node headroom case is ~2.7 M flops — a few milliseconds, still
comfortably inside a debounced edit. Keep it behind one function, `solveSPD(A, b)`, so the sparse
upgrade stays a local change if the scale assumption ever turns out wrong.

### Diagnostics run *before* the solve

Never diagnose topology by watching the solver fail. Four checks, four distinct messages:

1. **No reservoir at all** → "Add a reservoir or fixed-head source."
2. **A node not connected to any fixed-head source** → BFS/union-find from all reservoirs over open
   links. **Name the specific node IDs and grey them on the map.** This is *the* dominant user error
   in a map editor: a pipe drawn near a junction but not snapped to it.
3. **Zero-conductance component** — reachable but every link closed or zero-diameter.
4. **Converged but implausible** — subatmospheric pressures, velocities outside band. Warnings, not
   failures; render with the existing `EngCalcs.inlineRangeWarnHtml` and `writeCheckHTML`.

The real fix for #2 is **snap-on-create** in the editor: a click within N screen pixels of an
existing node reuses it rather than creating a new one. Design that in on day one.

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
saved network before and after. Extracting during Phase 1 would risk regressing a shipped,
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
- **Versioning:** `v` is a monotonic integer. `v > CURRENT` refuses to load and says so — never
  silently drop unknown fields. `v < CURRENT` runs an ordered chain of pure migrations, keeping a
  `_backup` copy first, because there is no undo in localStorage.
- **IDs restricted to EPANET-legal characters** (no spaces, no quotes), validated on entry. Costs
  nothing now and keeps a future `.inp` exporter a pure function.

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

**Phase 0 (Task 171) — canvas spike, 1 day, throwaway.** Settles the technology empirically. See the
roadmap entry for the full acceptance criteria. Canvas technology is **deliberately uncommitted**
until this runs (Tom's call).

**Phase 0.5 (Task 172) — headless solver, 2–3 days, independent of Phase 0**, validated against
published EPANET Net1/Net2 output.

**Phase 1 — smallest shippable.** Page, prefix, menu entry, `sw.js` entry, English-only strings.
Junction / Pipe / Reservoir / Pump / Text. Toolbar: Select, Pan, Add-each, Delete, Zoom Extent.
Property popup per element. Units strip with working presets. Debounced GGA solve on every edit.
ID + pressure map labels. Single-network localStorage autosave. The four diagnostics. Snap-on-create.
A Notes list stating honestly what the tool does not do.

- **Biggest cut: vertex editing.** Pipes are straight segments between nodes with a stored,
  overridable length. That removes the single hardest interaction from the first release, and `vx`
  stays in the schema so adding it later is a pure addition.
- **Also out:** report tables, element browser, extrema marks, draggable labels and leaders,
  collision avoidance, insets, map-vs-screen text size, valves, tanks, `.inp` export, multiple saved
  networks.
- **One thing argued back onto the list: undo.** Keep the last 20 document snapshots **in memory**
  (not localStorage) and wire Ctrl-Z. ~15 lines given a serializable document, and a map editor
  without it makes users quit.

**Phase 2 — reporting and legibility.** Node and link report tables, the EPANET-style element browser
list, the full label toggle set with extrema over/underline marks, the gear/settings panel (ID
prefixes J/L/P/R, emitter exponent, text size and its map-vs-screen units toggle, tolerance),
multiple named saved networks. **The translation sprint goes here.**

**Phase 3 — polish and reach.** Polyline pipes with vertex editing; draggable labels with leaders and
collision avoidance; map insets for congested areas; `.inp` export/import; **valves as a link
property (status + setting), not a fifth element type** — Tom's instinct matches EPANET's own data
model.

**Phase 4 — Task 145**, the Google/OSM map and elevation mashup, moved here from `bpn_`.

## Abort points

After Phase 0 (one day). After Phase 0.5 (four days). After Phase 1, on instrumentation.

**Nothing before Phase 2 requires a translation sprint, a CDN dependency, an API key, or a change to
any shipped file except `lib/Menus.lib.php`, `sw.js`, and the two shared-code chores.** That property
is what makes the project abortable, and it is a stated architectural constraint — the same way
Task 145's "the core solve never depends on it" is.
