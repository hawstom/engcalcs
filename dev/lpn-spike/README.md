# Phase 0.5 spike — headless looped-network solver

Validates `js/lpn-solver.js` (ROADMAP Task 146). Run:

    node dev/lpn-spike/validate.js

48 checks, no network access, no `node_modules`, exits non-zero on failure.

## Files

| Path | Purpose |
|---|---|
| `validate.js` | The harness. Five sections: residuals, closed form, EPANET, suite consistency, scale. |
| `cases.js` | Hand-built networks covering what EPANET's examples do not: emitters, closed links, an unreachable node, a zero-demand network, minor losses, all three friction methods. |
| `reference/Net*.inp` | EPA's own example networks, from the OpenWaterAnalytics/EPANET repository. |
| `reference/ref_Net*.json` | The real EPANET engine's t=0 solution for each. Committed so the harness needs nothing installed. |
| `make_reference.js` | Regenerates those. **Only this file needs `npm i epanet-js`.** |

## Why a WASM EPANET rather than published result tables

`epanet-js` is EPANET's own C engine compiled to WebAssembly, so the reference is the actual
program rather than numbers transcribed from a manual — no typos, and every link and node is covered
instead of the handful a printed table shows.

Two deliberate choices in `make_reference.js`:

- **EPANET's `ACCURACY` is tightened to 1e-8.** At its 1e-3 default the reference carries a visible
  residual of its own: a near-dead-end pipe in Net2 was reported with a flow wrong by more than the
  flow itself, which looked like a 0.404 gpm disagreement and was entirely EPANET stopping early.
  Converged, the same link agrees to 0.00000 gpm.
- **Link status at t=0 is recorded.** Status is boundary data for that instant's hydraulic problem,
  exactly like demands and tank heads. Net3 has a pump closed by `[STATUS]` and links switched by
  controls; evaluating controls is on the scope doc's cut list, so they are read, not computed.

For the same reason the harness takes junction demands and fixed heads from the reference rather than
parsing `[PATTERNS]` and tank levels: those are inputs to the t=0 problem, and what is under test is
the hydraulics, not an `.inp` reader (that is Phase 3).

## What each section proves

1. **Residuals** — continuity and the constitutive head-loss equation, both to ~1e-15. For a network
   with at least one fixed head and monotone head-loss functions the steady-state solution is
   unique, so satisfying the equations *is* being right. This tests the solve.
2. **Closed form** — a parallel-pipe split derived by hand, an emitter solved by independent
   bisection. This tests that the equations being satisfied are the intended ones.
3. **EPANET** — topology, pumps, and scale. Reported alongside EPANET's *own* continuity residual so
   a disagreement can be attributed rather than assumed. Since Task 213 this runs on the *shipped*
   Hazen-Williams constants (they are EPANET's), so it no longer has to isolate constant choice from
   solver error.
4. **Suite consistency** — the head-loss kernel against `branched-network.js`, so `lpn_` cannot
   disagree with the calculator next to it in the menu.
5. **Scale** — 21 nodes (the design target) and 201 nodes (headroom, not a target).
