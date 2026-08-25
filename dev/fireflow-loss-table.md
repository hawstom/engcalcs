# Can a hydrant carry a pre-computed q-vs-loss table? — the answer, with the measurements

Tom, 2026-08-25: *"I believe that a library hydrant can be saved with a pre-calculated q vs loss
table on save. We don't need to calculate at every point. Can EPANET take a loss table? Or can we
inject the ad-hoc hydrant into the physical model?"*

Two questions. The short answers, in order: **EPANET can take one, and we already read and write
the element that carries it. The saving is not real and the measurement says so. The second half of
his question describes what the engine already does.**

---

## 1. Can EPANET take a head-loss-versus-flow table for a link? — YES, it is called a GPV

A **General Purpose Valve** is exactly this element. Its "setting" is not a number at all: it is the
NAME of a curve in `[CURVES]`, and the curve's points are (flow, head loss). EPANET interpolates
**linearly** between the points, so a curved relation is a polyline and the shape between points is
whatever the points say.

What this repo already does with one, all shipped under Task 248:

| Direction | File | Behaviour |
|---|---|---|
| Import | `js/lpn-inp.js` | A `[VALVES]` GPV row arrives as a real valve with `curvePoints` read from `[CURVES]` under the name in its sixth column. A GPV naming a curve the file does not contain still arrives as a valve, with no points, and is reported (`gpv-curve-missing`) |
| Export | `js/lpn-inp.js` | Writes the points back as `G_<id>` and names it in the setting column. A GPV with no points goes out as an open TCV and is reported (`gpv-no-curve-as-open`) |
| Engine | `js/lpn-epanet.js` | Same two rules for the in-memory `.inp`. **A GPV's points are part of `signatureOf()`**, because EPANET refuses to be controlled through the API for one at all — error 207, *"attempt to control CV/GPV link"* — so `pushValues()` skips it and a changed curve forces a full rebuild rather than silently answering with the previous curve |
| Our own solver | `js/lpn-solver.js` | **Cannot solve one.** `EngCalcs.lpnValveIsNative` returns false for everything but a TCV, so a GPV is an EPANET-only element and a network holding one routes to EPANET automatically |

So the format is not the obstacle. The obstacle is the last row.

## 2. Would the table save anything? — NO. Measured.

The saving a table could offer is the arithmetic of the assembly's own two links. Everything else in
a fire-flow search is the **network** solve, and a table cannot remove that: the answer is the flow
at which a critical node still holds its residual, and that pressure is a property of the whole
network at that flow. The bisection has to solve the network ~16 times whatever the hydrant is made
of.

Measured on this branch (Node, `EngCalcs.lpnSolve`, Hazen-Williams, `tol` 1e-8, best of 400 runs, the
same total demand delivered both ways so only the two extra links differ):

| Network | Demand at the junction | Same demand through the assembly | Delta |
|---|---|---|---|
| 49 junctions / 85 links | 0.584 ms, 5 iterations | 0.613 ms, 5 iterations | **+0.029 ms (+4.9%)** |
| 225 junctions / 421 links | 20.315 ms, 5 iterations | 19.171 ms, 5 iterations | **below run-to-run noise** |

The iteration count is identical either way — the assembly does not make the solve harder, it makes
it two links longer. A whole search costs 17 ms at 9 junctions, 42 ms at 49 and 498 ms at 225, all
at 16 solves.

**So the ceiling on what a table could save is a fraction of 4.9% of one solve** — a table would
replace two links with one interpolated link, not with nothing — against a search whose cost is the
other 95% and rises with the network. At 225 junctions the whole assembly is already unmeasurable.
There is nothing here to optimise.

And the table is not free either. Two costs it would add:

- **It would make the search EPANET-only.** A GPV is not native, so a hydrant carrying its loss as a
  curve could not be searched by the built-in solver at all — a capability the assembly has today.
  Teaching our own solver a piecewise-linear link means writing the interpolation *and its
  derivative*, because the global gradient algorithm needs dh/dq per link. That is real numerics
  bought to save 0.03 ms.
- **The table would have to be regenerated whenever anything about the assembly changed** — and the
  lateral length has no default and must be asked, per hydrant, precisely because five agency
  standards span 25–100 ft. A stored table is a cached derived value with a staleness problem; a
  stored `k` and diameter are inputs and cannot go stale.

## 3. "Can we inject the ad-hoc hydrant into the physical model?" — that is what it already does

`EngCalcs.lpnFireFlowBuild()` injects the hydrant into the physical model: two junctions and two
pipes in series off the named node —

```
[hydrant node on the main] --lateral (carries the k)--> [base] --barrel--> [outlet, carries the demand]
```

— built onto a **copy**, so the user's document, asset list, saved file and `.inp` export never see
it. That boundary is Tom's own ruling on the ad-hoc add-on and it is asserted (the input model is
byte-identical after a search). Injection is the design, and it is the reason the assembly can be
disclosed quantity by quantity: every number in it is an input a person can read and change, not a
coefficient baked into a curve.

## 4. What a saved library hydrant should carry

**Dimensions and a `k`, not a table** — which is what Task 530's research already concluded (2d):
make, model, waterway diameter (4½ or 5¼ in), outlet configuration, and the `k` itself, editable,
defaulting to ~5, with its source visible. Deliberately not in the type: installation year and NFPA
291 colour class (per-instance facts that go stale), and the lateral's diameter, length and
roughness (per-instance ad-hoc inputs).

The one merit a table genuinely has is worth recording, because it is the same concern as Tom's
first correction: **a (flow, head loss) table is reference-velocity-free.** It is metres against
m3/s and cannot be mis-referenced by being applied at the wrong diameter, which is exactly the
failure mode a `k` has. That is an argument about *safety*, not speed, and it is answered instead by
naming the reference velocity in the coefficient itself — `js/lpn-fireflow.js` now does that in the
variable names, in the result record (`assembly.k.referencedTo`), and in
`dev/lpn-spike/fireflow-harness.js`, which asserts the 3.16x separation a re-referencing edit would
produce.

**The one case that would justify storing points:** a manufacturer publishing a MEASURED
flow-versus-loss curve for a specific hydrant model. That is data we do not have and cannot derive —
the AWWA C502 number in the code is a QA *ceiling*, not a measurement — and if it existed it would
belong in the library type as points, replacing the barrel piece of the `k` for that model and
saying so. Even then it would be converted to a `k` at the lateral's velocity for the solve, not
handed to EPANET as a GPV, for the two reasons in §2.
