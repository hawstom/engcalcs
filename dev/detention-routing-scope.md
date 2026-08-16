# Reservoir / detention routing calculator (Modified Puls) — scope

Scope record for ROADMAP Task 114. Nothing is built. Candidate prefix `rr_` / `route_` / `cd_` — not
yet claimed.

## Why this shape, and what it replaced

Re-scoped 2026-07-23 by Tom. The original "check-dam *spillway sizing*" framing collapsed: a spillway
is a weir (`wfs_`/`wfi_`) plus rock lining (`rc_`) plus freeboard arithmetic — no new engine, and
largely subsumed by calculators the suite already has.

The genuinely distinct, in-authority calculator is **storage-indication (Modified Puls) reservoir
routing**: a *time-stepping* engine rather than a steady-state one. **Time is the real departure**
from the weir and orifice calculators.

## Scope

1. **A composite outlet stage-discharge curve** from multiple orifices + weirs, reusing the `or_` and
   `wfs_` device equations, summed by stage.
2. **A stage-storage curve** — user input, or simple geometry.
3. **Modified Puls routing** of an inflow hydrograph through it. Build the `2S/Δt + O` vs `O` curve
   once and table-lookup per step; no per-step iteration.

## Inflow is a deliberate punt-ladder, NOT rainfall-runoff

Three options: a user table (bring your own hydrograph), the SCS dimensionless unit hydrograph, and
the SCS triangular. **The synthetic options are shape generators from a user-supplied peak Qp and
time-to-peak Tp**, so the tool never does hydrology.

- **Explicitly NO curve number, rainfall, area, or runoff volume.** CN is rainfall → runoff-volume,
  which is the punted half. The SCS input set is exactly `{Qpeak, Tp, peak-factor shape}` — two
  numbers that scale the dimensionless UH, plus a shape selector.
- **Take Tp (time-to-peak) or lag directly, never Tc.** The Tc → Tp conversion embeds its own SCS
  assumption (Tp ≈ 0.67·Tc) that a user could swallow unknowingly; taking Tp keeps the tool a pure
  shape-scaler.

### Prefer "bring-your-own-*flood*" over "bring-your-own-*peak*" (Tom, 2026-07-23)

Routing is governed by flood **volume and duration**, not peak. So the user-table path is the
*preferred* one, and the synthetic peak-based options get concise, non-pedantic guidance:

- a full hydrograph beats a peak;
- a synthesized one also fixes a duration and volume that must match the storm;
- **test several durations** — the storm that drives the highest stage is often not the
  highest-peak storm.

SCS may well be the global default (used widely, including India), but its US-calibrated **peak factor
484** and Type II rainfall are not region-neutral. **Expose the peak factor** with a one-line note so
arid/flat (≈300) or steep (≈600) watersheds can adjust.

## Hydrology is explicitly out of scope

Computing the design peak — Rational Method, TR-55, PMP/PMF, regional regression, StreamStats — is
truly hard, empirical, and regional. The user brings Qp/Tc: the same boundary Tom has deliberately
kept for his whole career (he has intentionally never shipped a Rational Method calc). This is a clean
modular boundary, not a flaw.

**The design principle that resolves that career-long reluctance: the tool holds no opinion about
storms.** It routes the flood the local engineer brings and flags its own assumptions, so it never has
to model Indian-monsoon or African-convective floods it has no intuition for.

## Output: the hydrograph plot IS the primary result

Plot inflow AND routed outflow, plus each outlet component's own hydrograph — layers: inflow · total
routed outflow · per-device discharge (each orifice, each weir), all **checkbox-toggleable** (the same
toggle-layers UX as Task 137's sketch). This shows *when each device kicks in*, e.g. the emergency weir
waking up as stage tops its crest. Mark peak attenuation, and ideally max stage.

For a router the plot is the primary result, which is distinct from Task 137's topology-only sanity
sketch.

## Reference links for the SCS peak-factor tip

English-only note, per the link+tip convention.

- Readable primary: Learn Hydrology Studio, "NRCS Unit Hydrograph Peak Factors" —
  `learn.hydrologystudio.com/hydrology-studio/knowledge-base/nrcs-unit-hydrograph-peak-factors/`
- Authoritative alternate: HEC-HMS Technical Reference, "SCS Unit Hydrograph Model" (USACE)
- Spec-time depth on the 3/8–5/8 volume-split assumption behind PRF 484: Wanielista et al.,
  "Revisit of NRCS Unit Hydrograph Procedures"

## Audience and sequencing

The audience is **broader than the original NGO framing** — detention-pond and stormwater routing is
mainstream civil practice, paid tools (HydroCAD, PondPack) dominate, and honest free web routers are
rare.

**Daunting (Tom's word), and bigger than Task 137 — do 137 first.** No internet mashup for hydrology.
