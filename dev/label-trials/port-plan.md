# Label placement: what to port from the bench to master, and in what order (2026-10-17)

Tom, 2026-10-17: *"We need to figure out what and how to merge the current best findings from our
label placement project to improve our performance and results."*

**Tags.** MEASURED = a number a script produced, with where. CLAIMED = a builder's own number on its
strategy card (public scenes, its own runs), not replicated by the judges. SPECULATION = mine.
"Per 100 asked" = labels shown per 100 labels the settings ask for.

The bench lives on `feat/label-placer` (2,346 commits behind master; read with `git show
feat/label-placer:<path>`). It will never merge as it is. Everything below is a new small branch from
master.

---

## 1. What the bench has proven, and against what

### 1.1 The headline (MEASURED)

Round 7, 64 secret generated networks of 1,000 nodes, 5 zooms each, 320 views
(`feat/label-placer:dev/label-trials/vs-production/results.md`):

| | labels shown | values shown | N1 overlaps | N3 leaders through nodes | median / worst ms | views over 1 s |
|---|---|---|---|---|---|---|
| master `8c88e689` (2026-10-07) | 37.7% | 25.7% | 294 | 725 | 1,525 / 3,875 | 226 of 320 |
| A7 (most labels) | 78.8% | 52.1% | 0 | 0 | 161 / 553 | 0 |
| B7 (cleanest) | 78.7% | 49.8% | 0 | 0 | 76 / 713 | 0 |
| D7 (fastest) | 77.8% | 50.3% | 0 | 0 | 61 / 657 | 0 |
| A7 on master's own (wider) text | 71.7% | 46.2% | 0 | 0 | 265 / 590 | 0 |

Master's time is its whole label pass on the DOM stub; the builders' is `place()` alone, so the time
gap is overstated (same file, §7).

### 1.2 Where the gap is: pipe labels (MEASURED today)

`dev/label-trials/preprocessing/kind-share-bench.js`, A7 rerun on the 8 crowded
seed-71 sets (28 px, all four families, plain and bent-and-valved) against master's recorded
layouts of the same sets (`/home/haws/label-trials-work/vsprod/out-mast/master/`):

| zoom | pipe labels shown, master | pipe labels shown, A7 | node labels shown, master | node labels shown, A7 |
|---|---|---|---|---|
| 1x | 1.7% | 37.7% | 35.2% | 63.1% |
| 1.5x | 6.9% | 85.9% | 81.2% | 97.4% |
| 2x | 17.4% | 100% | 97.8% | 99.9% |
| 3x | 50.0% | 100% | 99.8% | 100% |
| 4x | 74.2% | 100% | 100% | 100% |
| all | 11.3% | 65.2% | 62.5% | 80.8% |

Pipe labels are 61% of the labels asked. **Of the 40-point gap between master and A7 on these sets,
33 points are pipe labels.** From 2x in, master already shows its node labels; it does not show its
pipe labels. (Caveat: A7 ran on production's scenes, master on master's, whose text is a little
wider; §1.1's last row puts that at about 7 points of the 40.)

**Why master hides them (MEASURED today on master `e8ba2bb6`,**
`dev/label-trials/preprocessing/hide-reasons.js`, DOM stub, node fields ID, P, Qb, Z, link fields ID, Q, V, "along
the pipe" on): pipe labels touching the view, and the flag that hid each.

| network, zoom | pipe labels | shown | too short for its segment | shed to nothing, still crowded | yielded to a node label |
|---|---|---|---|---|---|
| Net3, fit | 119 | 1 | 106 | 8 | 4 |
| Net3, 2x | 119 | 16 | 65 | 26 | 11 |
| Net3, 4x | 82 | 34 | 22 | 16 | 10 |
| Novato, fit | 119 | 3 | 106 | 5 | 5 |
| Novato, 2x | 119 | 15 | 66 | 25 | 12 |
| n600 downtown, 1x | 801 | 72 | 360 | 276 | 88 |
| n600 downtown, 2x | 343 | 106 | 29 | 148 | 54 |
| n600 downtown, 4x | 101 | 83 | 0 | 4 | 13 |

"Blocked" (no clear station) and "crossed" are 0-6 everywhere. **The two exits that empty master's
map are the short-segment hide and the crowded hide, and both hide a label that never tried a spot
off its pipe.** The builders place such a label level, beside its pipe, with a leader if needed
(R14: *"Values outrank alignment"*; R1: give up nearness to home before the label).

### 1.3 What each bench ingredient bought (MEASURED on secret sets unless marked)

From `feat/label-placer:dev/label-trials/phase-1-summary.md` §2 and round 7 H3 (8 secret sets,
one density; switching the ingredient off):

| ingredient | labels per 100 asked | values | time | tag |
|---|---|---|---|---|
| smallest form first, then grow | A +8.8, B +2.9, D +3.0 (8 of 8 sets) | about unchanged | not measured | MEASURED |
| a clock, not a count | D with its old count cap: -10.5 | -6.3 | (the clock is the cost) | MEASURED |
| eviction of 1-2 neighbours | D +7.3, C +3.5, B +1.8, A +0.5 | | | MEASURED (inside a builder) |
| dense rescue search | D +6.4, B +3.3 | | | MEASURED (inside a builder) |
| tighten clearance only for a label that would otherwise hide | D +2.8, A +1.5 | D +2.0, A +1.2 | | MEASURED |
| most constrained first | C +1.1 (7 of 8 sets) | | | MEASURED |
| clean ground first | 21 fewer labels for 3.5x less crossing cost | | | CLAIMED (B's card) |
| coarse raster before exact tests | same layout | | B: 62 vs 178 ms median | CLAIMED (B's card, `round-7/frozen/STRATEGY-b.md`) |
| pipe labels along, then a last pass turning level ones that have room | D: level-with-room 539 to 50 | | | CLAIMED |

**Measured against nothing, found not to pay:** ranked wedges (no measurable change), a repair pass
bolted on after the layout (B: -16 labels), longer leaders (+1 to +7 labels for twice the time).

### 1.4 What has already been ported, and what it bought on master (MEASURED)

Tom agreed D09 on 2026-10-07: rules 1-3 as three defect branches; stability a criterion of low
weight. Numbers from the code comments and the handoff commit `130a3558`, 64 sets, 320 views:

| port | result on master | pass time | fate |
|---|---|---|---|
| valve and pump symbols as obstacles (`9ce21702`) | labels over valves 2,578 to 44 | | merged |
| no pipe label over a node symbol (`fe5c3d57`) | master's 204 such overlaps to 0 | | merged |
| rule 1, clean ground first (`821e3006`) | labels shown 38.2 to 38.3; labels on a pipe 32.4 to 23.9 per 100 shown; leaders through a node 697 to 407 | +8% | merged |
| rule 2, rescue search | 38.3 to 39.3 per 100 asked | +7% | **taken out**, Tom: *"Too expensive. Don't keep it."* |
| rule 3, eviction (one neighbour) | +0.24 per 100 asked | +11% | not ported |
| perf, same layout (`0ddd192d`, `2ece408d`, `dbf677a8`) | Novato all fields 254 to 98 ms; n600 switch 3.2 to 1.3 s | | merged |

**His price, from that day: a rule must buy a large gain per percent of pass time.** Rules 2 and 3
failed it because, inside master's chain, the dropped node labels they rescue are few: node labels
are not where master loses (§1.2).

### 1.5 What phase 1 cost

Seven rounds in 11 days (2026-09-27 to 10-07); 28-63 commits per builder branch, 46 on the seam.
Round 7 alone: 1,012 cells, 5,060 views, about 2.5 hours on jasmine, one worker. The master
extractions for the production report are about 1.5 s per 1,000-node view on the stub. (MEASURED,
from the round records.)

---

## 2. The port plan

Order is by Tom's price: the cheapest gain per percent of pass time first, and time bought back
before time is spent. Each step is one branch from master, its own harness, and Tom's browser pass
where the picture changes. None changes a rule.

### Step 0. Bring the rules up to date on master (docs only; no risk)

Master's `dev/label-placement-rules.md` lacks every answer Tom gave on the bench branch: R1's new
head, R1 (3) on the ID, R10's scale sentence and one-second bound, R14, R15, the repeat spacing
("Master"), and the round 5, 6 and 7 answers. ROADMAP Task 741 still says "five rule proposals
await his ruling"; all five were answered (§3). Branch `docs/label-rules-sync`: copy the bench
branch's Part A, Part B additions and his answers, verbatim; fix Task 741's line.

### Step 1. Read each setting once per label pass (`perf/label-settings-memo`)

Not a bench finding; found today (`preprocessing-inquiry.md` §3). Scenario-aware setting lookups
(`settingFor()` behind `scnSetting()`, `scnLabels()` and `coordOverridesOf()`) are asked thousands
of times a pass for answers that cannot change during it.

- **MEASURED:** layout fingerprint identical on all 13 views (Net3, Novato, n600); pass time n600
  -4% at 1x to -11% at 4x, Net3 0-8%, Novato 4-14% (two runs of five, DOM stub; small sample).
- **Harness:** the fingerprint comparison of `dev/label-trials/preprocessing/time-and-sig.js`, plus a run in a
  non-Base scenario with a coordinate override and a scenario label setting (not yet tested; that
  is the seam this touches).
- **Risk to the known layout:** none by construction; the risk is a stale read if a setting is
  written mid-pass. The memo lives only inside one `refreshLabelText()` call.

### Step 2. Loosen clearance only for a label that would otherwise hide (`fix/label-last-pad`)

Bench ingredient 6 (D +2.8 labels, +2.0 values per 100; A +1.5, +1.2: MEASURED inside builders).
The handoff already points at it: *"Bigger gains sit in bench rule 6 (looser pad for would-be-hidden
labels)."* On master: in `placeLabelsFirstFit()`'s last sweep, a label still waiting tries its sides
once more with `pad` 0 instead of 0.35 of a font size. Only labels that would hide move, so the
rest of the drawing is unchanged by construction.

- **Expected:** SPECULATION, +0.5 to +2 node labels per 100 asked at 1x on n600, near 0 on Net3 at
  2x and closer (its node labels already show, §1.2); one extra sweep over waiting labels only, a
  few percent of `cl:firstFit` (74 ms on the n600 switch).
- **Harness:** a count of labels shown and of N1 breaks on Net3, Novato and n600, before and after;
  the stability harness for the labels that were already shown.
- **Risk:** low. Labels come closer to one another, never onto one another.

### Step 3. A pipe label that cannot lie along its pipe is placed level beside it (`fix/pipe-label-level`)

**The big one, and it is a picture Tom has not seen on master.** Where today a pipe label is hidden
as too short for its segment, or as still crowded after shedding (§1.2), it first enters the
existing free-label search (`Collide.placeLabels()`, the ring pass master already runs for dragged
and level link labels) as a level label, smallest form first, beside its pipe. It hides only if that
finds nothing. The aligned slide and its shed stay as they are and run first, so every pipe label
that fits along today is drawn exactly as today.

- **Expected:** the ceiling is the hidden counts in §1.2: Net3 at 2x 102 of 119 hidden, n600 at 2x
  231 of 343. On the bench's crowded sets A7 shows 100% of pipe labels from 2x in where master shows
  17-74%. SPECULATION: on n600 at 2x, pipe labels shown from 106 toward 250-300; labels per 100
  asked on the 64 sets from 38 toward 55-65. Time: more labels in the ring pass; the ring pass is
  small today (not among the top rows of the n600 switch), so SPECULATION +10 to +25% pass time,
  which is why Step 1 comes first.
- **Harness:** `pipe-label-level-harness.js`: pipe labels shown per view on Net3, Novato and n600 at
  the five zooms; zero N1 and N3 (`label-node-symbol-harness.js`'s count); R14 at close zoom (a level
  label with room to lie along, under 5%, the judges' limit); labels already along unchanged.
- **Risk:** high visibility. Pipe labels appear level, some with leaders, on views that today show
  bare pipes. It adds a rung before §3.5's hide in `dev/label-placement-goals.md`; the hide stays the
  terminal exit, so Tom's 2026-08-17 *"Fully shedded links need to hide if they are still in
  conflict"* still holds. **Needs his browser pass and his word.**

### Step 4. Smallest form first, then grow, for node labels (`feat/label-grow`)

Bench ingredient 1, all four builders independently; +2.9 to +8.8 labels per 100 asked with values
unchanged (MEASURED inside builders). On master it replaces the shrink loop
(`unshedNodeLabels()` then `shedNodeLabelsForCrowding()`), which is also the largest single cost
left in a switch: `ns:refit` 244 ms of the n600 switch's 1,487 ms (MEASURED today,
`switch-cost-browser-harness.js`, SWITCH_MEASURE=1, Chromium, median of 5).

- **Expected:** SPECULATION, +2 to +5 node labels per 100 asked at 1x and 1.5x on n600, about 0 on
  Net3 and Novato from 2x in; time could fall (one first-fit and growth rounds instead of a full
  re-fit per rung) or rise; measure.
- **Harness:** labels and values shown per view, the stability harness, `node-yield-harness.js`
  (pure function of the drawing), `zoom-pass-determinism-harness.js`.
- **Risk:** high. `shedAlignedForConflicts()` and `predictNodeLabelBoxes()` assume full node
  content; which value a crowded label keeps changes. Do it after Step 3, because Step 3 changes the
  ground node labels grow into.

### Step 5. A static raster in front of the exact tests (`perf/label-raster`)

Bench ingredient 12 (CLAIMED: same layout, three times faster in B). The narrow phase
(`boxOverlapDepth()`, `near()`, the segment tests) is about a third of master's pass by profile
(`preprocessing-inquiry.md` §3). Run it as the inquiry's experiment E2 first; port if E2 holds.

### Not to port, and why

| finding | why not |
|---|---|
| a clock instead of a count (ingredient 4) | Breaks master's pure-function invariant (`node-yield-harness.js`) and its stillness: the same view twice changed 13.9 labels in 100 for A7, 44.0 for D7, 0.00 for production (`vs-production/results.md`). Port only as "converge, then stop", the clock a safety cap. |
| lay out the window, not the network | Pan stability: production changed 0.00 labels per 100 on a 10% pan, A7 3.95, D7 18.4. Master's bank per wheel notch already makes revisits about 13 ms. |
| rescue search (rule 2) | Tom, 2026-10-07: *"Too expensive. Don't keep it."* |
| eviction (rule 3) | +0.24 per 100 for +11% on master. |
| carry the last view's spot | Same invariant as the clock; master's bank already holds still. |
| ranked wedges, bolt-on repair, longer leaders | Measured not to pay (§1.3). |
| forcing the ID last because it is narrow | Tom, 2026-10-07: *"I repeat 'No' about keeping ID last."* |
| a whole builder through the `?placer=` seam | Not until Tom picks one side by side; the seam (`js/lpn-label-scene.js`, 180 lines) would be re-cut from master then. |
| `spot_prime` (`feat/label-gang-search`) | Never given a full trial ("hide six fewer labels" on its own branch); research for the speed phase, not a port. |

---

## 3. What awaits Tom

**The five round-5 proposals do not await him; all five were answered** (recorded on the bench
branch's `dev/label-placement-rules.md`, "Round 5 proposals, his answers"):

1. R10 scale sentence: yes. 2. The bound after a zoom settles: *"one second"*. 3. R11 "never hides a
row that was showing": no. 4. Define "convenient available space": *"No. This is micromanagement."*
5. Dropped for lack of room, never by count: reworded and accepted, *"Yes. This seems so obvious as
to be trivial."*

**What does await him:**

- **Step 3's picture**, on a preview port, before it merges: pipe labels level beside their pipes
  where today they hide.
- **The extra decimal** (`vs-production` report §2): *"Master prints one more decimal on some values,
  so its labels are wider [...] The extra decimal costs 4-7 labels in 100 on a crowded map, whoever
  places them; that is a formatting decision worth putting to Tom on its own."* I find no record that
  it was put to him.
- **Task 681's open call**: *"the node shed's re-fits (~250 ms on n600, ~74 ms on Net3); cheaper
  means re-fitting only each rung's affected area, which changes the layout."* Step 4 may answer it
  differently.
- **`k` = 0.25** (`dev/label-placement-goals.md` §4): *"The value is unchanged pending Tom's ruling,
  because goal 11 is his."*

## 4. Threats to validity

- The DOM stub uses a nominal character width, not the real font; the browser run of Step 1 is still
  to do.
- §1.2's A7 and master columns ran on scenes that differ in text width (master's is wider).
- The 13-view fingerprint covers Base only, three networks, one field set.
- Gains measured inside a builder (§1.3) will be smaller inside master's chain, as rules 2 and 3
  showed.
