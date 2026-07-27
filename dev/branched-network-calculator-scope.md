# Branched (Distributary) Pipe Network Calculator — Scope

Status: **Phase 1 core built 2026-07-23** (`Branched-Network.php`, `js/branched-network.js`, `bpn_`
keys in all 27 lang files, menu entry in the pipe head-loss group). Springboard off
Irrigation-Pressure (`ip_`) but built fresh — do not extract or degrade `ip`. Prefix: **`bpn_`**.
Shipped identity: menu "Branched Pipe Network"; title "Free Online Branched Pipe Network Pressure
Calculator (No Loops)".

**Built:** parent-pointer topology, two-pass fixed-demand solve, series-by-default degradation (first
line has no upstream input — labeled "Source"), live Manning/HW/DW switching (method-irrelevant inputs
auto-hidden), fixed k-value minor losses, elevations, **1–3-point supply curve** (source head read at
the design flow using the standard pump-curve equations: 1 pt = flat reservoir, 2 pt = parabola
`H = H0 - a·Q²` (vertex at zero flow), 3 pt = EPANET power law `H = H0 - a·Q^b` with b fitted; only
point 1's head is required, its flow defaults to 0 = the static head), and the tall SVG **Network Diagram** with per-cell toggles (ID · Length · Diameter ·
Flow · Elevation · Pressure, each colour-coded, persisted in localStorage).

**Built (added 2026-07-24):** **excessive-pressure reporting** — an optional max. allowable head
(pipe pressure rating) input; each line's downstream pressure is flagged inline when it exceeds that
rating (and when it goes subatmospheric). Deliberately **no "break pressure tank" terminology
anywhere in the UI or code** (Tom, 2026-07-24): the tool reports excessive pressure and stops there.
It does not recommend, size, or place tanks, so naming a remedy it does not compute would overstate
what it does. Also **global demand multiplier** — one knob scaling every line demand for a peak-hour
or future-growth run.

**Cut, not deferred (Tom, 2026-07-24):** the demand-multiplier **system-curve plot** with
supply-curve overlay. Nice to have, but there is no place for it on the page, and the supply curve
itself already does the load-bearing work (source head is read at the design flow). Do not
reintroduce it without a fresh reason. Phase 2 (Google Maps helper) and Phase 3 (loops) unchanged
below.

## Purpose

A quick, easy pressure/flow calculator for **distributary (dendritic / tree) pipe networks** —
a source feeding a main that splits downstream into branches delivering fixed demands. Fills the
niche where **EPANET is overkill** (no loops, no iteration) and where engineers are daunted by
EPANET's machinery for a simple branched system.

## In scope

- Distributary tree topology (each line has exactly one upstream line).
- Fixed demands per line (point demand at the line's downstream end and/or distributed outflow
  along the line, as `ip` already does).
- Friction-method switching, live: **Manning / Hazen-Williams / Darcy-Weisbach**.
- Minor (local) losses via fixed k-values (a valve as a k-value is fine).
- Elevation-aware head (elevations are plain overridable inputs).
- **System curve**: sweep a demand multiplier, plot required source head vs. total flow; overlay
  a pump curve to find the operating point.
- Topology sanity sketch (see Sketch rules).

## Out of scope

- **Looped networks** — not in Phase 1/2, and excluding them is *why* this tool is simpler (EPANET
  owns them: iteration + a map for sanity). Reconsider only **after** we're expert at the Google Maps
  mashup (loops genuinely need a map to stay sane), **or** if users request it — see Phase 3.
- **Active pressure controls (PRV / PSV)** — out. They impose pressure constraints whose
  active/open/closed status is flow-and-pressure dependent, which forces iteration and destroys the
  clean single-pass solve. A *fixed* minor-loss valve (k-value) is allowed; active controls are not.

## Data model — line records, parent-pointer only

Each **line** is one record. No node table, no node numbers (the downstream end of a line *is* a
node; we compute data there). Fields (draft):

| Field | Meaning |
|-------|---------|
| `id` | Line identifier (user-facing). |
| `upstream` | ID of the parent (upstream) line. **Defaults to the previous line (N−1)** — see degradation. Root line's upstream = the source boundary. |
| `length` | Pipe length (or from map helper, Phase 2). |
| `diameter` | Pipe inside diameter. |
| `roughness` | Manning n / HW C / DW ε, per active method. |
| `k_minor` | Sum of local-loss coefficients on this line. |
| `demand` | Fixed flow delivered by this line (point at downstream end and/or distributed). |
| `elev_down` | Elevation of the line's downstream end (overridable; map helper Phase 2). |

Topology needs **only the `upstream` pointer** — no child adjacency. Each line pushes its own
demand up its ancestor chain via that pointer.

## Solve — two directional sweeps, no iteration

1. **Flows, bottom → top.** Accumulate: each line's flow = its own demand + all descendant demands
   (each line adds its demand to every ancestor via the parent pointer). Parent-pointer only.
2. **Pressures/heads, top → bottom.** Each line's downstream head = its parent's downstream head −
   this line's loss (friction by active method + minor + elevation change). Root's upstream head =
   the source boundary (reservoir level or pump head).

Fixed demands ⇒ this is exact in one pass each direction; no Hardy-Cross, no convergence loop.

## Graceful degradation — series is the default

`upstream` **defaults to the previous line (N−1)**. A user who enters lines and specifies no
topology gets a plain **series pipeline** for free; branching is opt-in by overriding `upstream`.
This unifies the earlier "generic series multi-reach with method-switch" idea as the zero-override
special case of this one tool. One tool: series by default, branch by exception.

## Method switching

Live toggle among Manning / Hazen-Williams / Darcy-Weisbach; the `roughness` field is interpreted
per the active method. (Reuse existing per-method label/UX patterns from `mpf_`/`hw_`/`dw_` where
clean.)

## System curve / pump matching

Re-run the one-pass solve across a range of demand multipliers → trace source-head vs. total-flow.
Optional pump-curve overlay marks the operating point. In-authority, and something EPANET does only
heavily.

## Sketch rules — "Tall," topology sanity only (HEC-1 \*DIAGRAM role)

Orientation: **source at top, flow downward** (depth = vertical, the free scrollable axis).

1. **Series runs squash to one column** — a line with a single, sibling-less child stacks straight
   down in the same column.
2. **Widen only at branches** — multiple children open new columns to the right, siblings side by
   side, with a short horizontal shoulder connector.
3. **Reclaim lanes aggressively** — a finished subtree frees its columns for the next sibling;
   width = peak simultaneous breadth, never total leaf count. Height is free; never trade it to
   save width.
4. **Each cell = line ID**, optionally with **length** as an input-review aid (the one datum worth
   showing — you can eyeball a run's length against the topology to catch a mis-entry). **No results**
   (P/Q) in the sketch — those are outputs, not a wiring sanity check. **Diameter off by default**
   (a uniform-diameter tree just repeats one boring number); reconsider if a real case wants it.

Example (`1→2→3` series, `2` also branches to `4→5`):

```
      [S]
       │
      [1]
       │
      [2]
      ┌┴┐
    [3] [4]
         │
        [5]
```

5. **Toggleable cell data (checkboxes atop the sketch).** A row of checkboxes lets the user turn
   per-cell fields on/off — simple case: **Length, Diameter**; tempting extras: **Q, downstream P**.
   Default stays minimal (ID + optionally Length) so the sketch is a clean wiring check out of the
   box; richness is opt-in. This *resolves* the "no results in a sanity sketch" tension — results
   appear only when the user asks.
   - **Handling arbitrary expansion without runaway:** decouple cell *content* from *layout*. Each
     cell is a small key/value stack, **one row per enabled field, fixed field order** (ID, Length,
     Diameter, Q, P…), **units shown once** in the checkbox label / legend, never per cell. On every
     toggle: **re-measure cells → re-pack the grid** (column width = widest cell in that column).
     The SVG is regenerated from the grid algorithm anyway, so re-layout on toggle is cheap; adding a
     field just grows cells down the free vertical axis. Nothing is hardcoded to a cell size.
   - **The spectrum (north star):** the checkboxes slide the *one* sketch from "wiring sanity check"
     (default) to "spatial results view" (all on). At full expansion it becomes a results table with
     spatial context — nice for seeing values in place, but **not** a replacement for the real results
     table when the user wants to *scan* numbers. Don't try to make it one.

Render as SVG for suite consistency (grid: row = depth, col = reclaimed lane); the layout *is* this
grid algorithm. Core job: confirm the parent pointers are wired correctly — a sanity check first,
optionally a spatial data view second.

## Phasing

- **Phase 1** — the calculator above, fully self-contained, no external dependencies: line records,
  parent-pointer topology, two-pass solve, series-by-default degradation, method switching, minor
  losses, elevations as manual inputs, system curve, tall topology sketch.
- **Phase 2 (feasibility-gated) — Google Maps elevation/length helper.** Isolated in a **separate
  helper window/page**, lazy-loaded, that writes coordinates → lengths (haversine, free) and
  elevations (Elevation API, keyed/metered) back into the main form. The core solve never depends on
  it, so it can be aborted with zero cost to Phase 1. Quarantines the paradigm departure (keyed
  external API, Google Cloud billing/quota) to one optional surface.
- **Phase 3 (conditional, uncommitted) — looped networks.** Considered only once Phase 2 has made us
  expert at the map mashup (loops need a map to stay sane) **or** if users ask for it. Brings back
  iteration (Hardy-Cross et al.); do not start it before the map is solid.

> **Tracking note (2026-07-27):** Phases 2 and 3 are now **ROADMAP Tasks 145 and 146**, extracted
> because Task 137 closed and unbuilt phases parked inside a completed block never resurface during
> prioritization. The phase descriptions above remain the design spec; the roadmap tasks carry the
> priority and the gate. Task 146 also notes that Phase 3's gate is an **OR** — the "users ask"
> branch may be satisfied independently of the map work by Task 144's Hazen-Williams finding, in
> which case "do not start it before the map is solid" no longer binds.

## Honesty / framing

- Distributary/branched only; **no loops** — state plainly so users don't expect EPANET behavior.
- **No active pressure controls** — a fixed k-value valve is a loss, not a controller; say so.

## Translation / labels

Reuse where clean: `ws_notes_heading` (Notes), `dw_kinematic_viscosity` (for DW),
`mpf_velocity`, existing flow/Q and per-method roughness labels. Estimate new `bpn_` keys once the
input set is final; keep the delta small for the eventual sprint.

## Resolved questions

All three original open questions are settled — none remain.

- **Distributed-outflow model — settled 2026-07-24 (Tom): point demand only, at the downstream end
  of each line.** Do not carry over `ip`'s along-the-line outflow. A line delivers its demand at its
  downstream node; model a distributed draw by splitting the run into more lines.
- **Identity string / menu name** — settled by shipping: menu "Branched Pipe Network"; title "Free
  Online Branched Pipe Network Pressure Calculator (No Loops)".
- **Sketch medium** — settled by shipping: SVG with the grid algorithm, per-cell toggles persisted
  in localStorage.
