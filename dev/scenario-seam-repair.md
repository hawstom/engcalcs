# The scenario write seam: five defects, and the rule that would have caught them

ROADMAP Task 323, 2026-08-14. Fixed the same day it was found.

## What happened

Scenarios (Task 184) and valves (Task 248 phase 2) were built in **parallel worktrees on the same
afternoon**, with **disjoint file territory**, exactly as `CLAUDE.md`'s worktree rule requires. Each
passed its own harness. Together they were broken in five places.

They never touched the same file. What they shared was a **seam**.

`setProp()` is the one write seam for an overridable property: in Base it writes the element (which
*is* the propagation in a delta model), and in a scenario it records an override. Its own comment,
written before any of this, states the failure exactly:

> A call site that writes `el._diameter` directly is therefore not merely impolite: inside a
> scenario it silently edits Base under every other scenario at once.

That is precisely what the valve popup did, on five fields. **The comment predicted the bug in words
and did not prevent it** — which is this repo's recurring finding and the whole argument for turning
a rule into a check.

## Why both harnesses were blind

`scenario-harness.js` is 498 lines, mutation-tested, and genuinely good. It **drives exactly one
field**: junction demand — which happened to be the correctly wired one. `valve-harness.js` is
equally solid and never says "scenario" or "override".

Two well-written harnesses, and the defect lived **in the gap between their vocabularies**. Breadth
across *fields* was missing, not depth within one.

## The five defects

| # | Site | Defect |
|---|---|---|
| 1 | `renderValveFields` | Read via `effective()`, wrote `l._setting` / `_diameter` / `_k` **directly**; passed no `ov`, so a valve was the only element with no scenario UI on any row |
| 2 | `lengthField` | `setProp(l,'length',…)` then `l.lenAuto = false` — a Base-owned flag cleared from inside a scenario, switching **every** scenario off Auto |
| 3 | `setOverride` | `undefined` stored as an override value is **dropped by `JSON.stringify`**, so a blanked override evaporated on the next save, undo or file write |
| 4 | `closedField` | Drew an override marker, then never refreshed it — the box ticked, the marker beside it did not |
| 5 | value-edit path | The three field helpers ended at `scheduleSolve()`; `afterPropertyEdit()` — which refreshes halos, the count, and saves — was never reached on the commonest action on the page |

A sixth finding (that `drawExampleNetwork` could run inside a scenario) was **checked and refuted**:
its only call site goes through `newProject()`, which resets to Base first. Recorded so nobody
re-derives it.

## The fixes, and the two judgement calls

Fixes 1, 2, 4 and 5 are mechanical once the seam is understood. Two needed a decision:

**Blank overrides were fixed at the seam, not the call site.** `setOverride()` now stores `null` for
`undefined`. The asymmetry is the point: in Base, `undefined` means the same thing as absent ("no
head typed"); in an override map, absence means something *different* — "inherit Base". So the
override side needs a sentinel and Base does not. One line covers every future blank-capable field.

**A valve type change writes Base and clears every scenario's `setting` override.** `valveType` is
not in `LPN_OVERRIDABLE`, so a type change is Base-wide by construction, and a setting that belongs
to a type must be too. The part that is easy to miss: the existing comment says a number carried
across a type change is "a valve nobody built" — 60 psi read as a loss coefficient of 60. That is as
true of a *scenario's override* as of Base's own value, and the override would have survived
silently as a stale pressure under a valve that now wants a flow.

## The guard

`dev/scripts/scenario_seam_check.php`, blocking in `check_all.sh`. It fails on any write to an
overridable property that does not go through `setProp()` and is not marked `// base-write: <reason>`.

- **The property list is parsed from `LPN_OVERRIDABLE`, never restated.** A restated list goes stale
  the day someone adds a property — silently, which is the same class of bug the check exists to
  stop. If the parse fails the check **fails**, rather than passing on an empty list; this repo has
  already shipped a check that compared zero strings and printed PASS.
- **Approval is a trailing comment, not a function allowlist.** It survives line drift and renames,
  it puts the justification where the next reader is standing, and adding one is a conscious act
  rather than an accident of which function you happen to be inside.
- 23 legitimate base-writes are marked: construction, `.inp` import, the example networks, the
  documented downstream push, and the Auto-length branch.

Verified by reintroducing the original valve defect — the check names it at the exact line.

## The rule worth carrying

**The worktree rule protects files. Nothing protected the seam.**

When two parallel tracks share a *concept* — a write seam, a resolver, a single source of truth —
disjoint file territory is not enough, and a brief that only assigns files will not save you. Either
sequence the tracks, or name the shared seam explicitly in both briefs and require each to say how
it goes through it.

And the harness lesson: **a harness that exercises one instance of a pattern has tested that
instance, not the pattern.** Ask what vocabulary a harness never uses; that is where its blind spot
is.
