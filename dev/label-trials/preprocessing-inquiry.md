# Pre-processing the network for label placement: an inquiry (2026-10-17)

Tom, 2026-10-17: *"We need to continue our project toward inquiry about the hows/methods and
whys/benefits/results of pre-processing the network for label placement efficiency."* Earlier,
2026-10-07: *"I hope that the speed phase may find great rules for pre-modeling (caching of the
physical model)."* And Q03, 2026-09-27: *"If we can pre-cache this in a quality way, I am up for
it."*

**Tags.** MEASURED = a number a script produced today or in a round record, with where. CITED = a
published source; "verified" means I found it by web search on 2026-10-17, "from memory" means not
re-checked today. SPECULATION = mine.

---

## 1. The question in one line

Which parts of a label layout depend only on the network (and the zoom band), not on the exact
view, the text or the other labels, and does computing them once, ahead of time, buy enough speed
or quality to pay for its memory, its load time and its invalidation on every edit?

## 2. What master already pre-processes (MEASURED, master `e8ba2bb6`)

| what | built when | invalidated by | where |
|---|---|---|---|
| per-node context: incident pipe bearings, open arcs, most-open side, rounded values and neighbour means for the drop order | once per model change or solve | an edit or a solve | `buildNodeContext()`, `js/looped-network.js:1726` |
| text widths by (class, size, string) | first measurement | never (a pure function) | `measuredTextWidth()`; 8,140 measurements a switch became 100 once warm (Task 681) |
| the whole layout per wheel notch ("the bank"), rounded outward, final | the first visit to a notch | any label work, settings, canvas size, solve, drawing, counts | Task 681 (c)/(d), `js/looped-network.js:59253`; Novato revisit ~85 to ~13 ms |
| the whole drawing per project tab | leaving a tab | an edit in that tab | Task 680 keep; warm switch back: Net3 geographic 113 ms, n600 127 ms with no label pass (MEASURED today, `switch-cost-browser-harness.js`) |
| a uniform grid over the obstacles | every first-fit call | rebuilt per call | `Collide.grid()`, `js/lpn-collide.js:726` |

So "caching across project switches" and "a per-zoom table" (Tom's H-d) are built. What is not
built: anything that is shared between notches, anything finer than a whole layout, and any
pre-computed conflict structure.

## 3. Where a label pass spends its time today (MEASURED today)

`node --cpu-prof` over `dev/lpn-spike/label-node-symbol-harness.js`: Net3 at 4 zooms and the
600-junction downtown fixture at 5, every pass a full content pass, DOM stub. Summed with
`dev/label-trials/preprocessing/prof-sum.js` and `prof-callers.js`. 4,457 ms inside
`refreshLabelText()`:

| work | ms | share | depends on the view? |
|---|---|---|---|
| narrow-phase collision tests (`boxOverlapDepth` 952 self, `near` 324, segment distance ~260) | ~1,540 | 35% | yes: label against label and obstacle |
| the prediction first-fit (`predictNodeLabelBoxes`) | 823 | 18% | yes |
| scenario-aware setting reads (`settingFor` and its helpers) | 637 | 14% | **no: constant during a pass** |
| node glyph rewrites and measuring | 307 | 7% | text only |
| obstacle building, grid building, candidate generation, open arcs | ~70 | 1.6% | scale only |
| node context | 21 | 0.5% | no (already cached) |

Inclusive figures overlap: `placeLabelsFirstFit` 1,452 ms, `shedAlignedForConflicts` 1,340,
`shedNodeLabelsForCrowding` 1,092, `repairCrossingGangs` 448, `shedCrossingLabels` 252.

In Chromium, the n600 cold switch (1,487 ms, median of 5) splits: `ns:refit` 244, `cl:repair` 81,
`cl:firstFit` 74, `cl:stationed` 20, **`cl:obstacles` 1.3** (MEASURED today, SWITCH_MEASURE=1).

**The first finding is a ceiling.** Building the static obstacles, their index and the candidate
positions is about 2% of the pass on the stub and 0.1% in Chromium. **A pre-built spatial index
alone cannot make master fast.** The time is in testing candidates against each other and in
re-running the first-fit (the prediction, the node-shed rungs). Pre-processing pays only where it
cuts the NUMBER of those tests or re-runs.

## 4. What pre-processing can mean, one method at a time

### 4.1 A spatial index of the static drawing, built once per project

- **Method.** Nodes, pump and valve symbols, pipe segments and Text objects in a grid or R-tree in
  model units, queried at any scale; only labels are inserted per pass. Speed-phase plan P2.
- **Benefit expected.** At most the 1.6% in §3 (MEASURED ceiling). Symbol sizes are fixed in screen
  pixels, so their boxes in model units change with every zoom; only the pipe segments are truly
  scale-free.
- **Cost.** Small memory (one entry per segment); rebuild on every geometry edit.
- **Literature.** Standard practice in production labellers: MapLibre's collision index is a grid
  of the symbols placed so far, checked then inserted one by one (CITED, verified: `collision_index.ts`, maplibre-gl). Mote
  (2007/2008) uses a "trellis" grid of cells a quarter of a label's area and states that it needs
  no pre-processing stage (CITED, verified: arXiv 1209.5765).
- **Verdict.** Not worth a branch on master. Worth it only inside a placer that already spends
  little elsewhere (the builders).

### 4.2 Candidate positions pre-computed per element and per zoom band, with the static conflicts

- **Method.** For each node label's candidate sides (4 corners plus the raster in the widest open
  arc), and for each pipe label's stations, record per zoom notch which candidates are already
  blocked by STATIC obstacles alone (symbols, pipes, Text). The live pass then tests only the
  survivors against other labels. This is the first half of a conflict graph (§4.3), restricted to
  what does not move.
- **Benefit expected.** SPECULATION: on crowded views most candidates of most labels hit a symbol
  or a pipe; skipping them cuts the narrow phase (35%) by a fraction to be measured. It is also
  what the prediction first-fit (18%) re-derives every pass.
- **Cost.** Per notch: labels x candidates bits (n600: about 1,400 labels x 30 candidates, 42,000
  bits, about 5 kB a notch). Built in idle time or on the first visit to a notch. Invalidated by a
  geometry edit near the element (local) or a symbol-size setting (global). Text content does NOT
  invalidate it unless the label's box size changes; a box size change invalidates that label's row.
- **Literature.** The pre-processing/query split for screen maps is Petzold, Gröger and Plümer's
  "reactive conflict graph", built "before a user interacts with the system" and storing each
  potential conflict "by the scale at which they occur" (CITED, verified: Petzold, Gröger and
  Plümer, ICC 2003, and their "Modeling of Conflicts for Screen Map Labeling", ISPRS XX congress).
  Mote's thesis describes that pre-processing as taking several minutes (CITED, verified: arXiv
  1209.5766), and a later survey notes it "does not guarantee that labels do not jump or flicker"
  (CITED, verified: Barth, Niedermann, Nöllenburg and Strash, "Temporal map labeling", arXiv
  1609.06327).
- **Verdict.** The best-founded candidate. Experiment E2 below.

### 4.3 A conflict graph and its reduction rules

- **Method.** One vertex per candidate, an edge per overlap; then Wagner and Wolff's rules: a label
  with a candidate that conflicts with nothing takes it and its other candidates are deleted, and two
  more rules shrink the graph without lowering the best solution, before a heuristic finishes.
- **Benefit expected.** Faster, and a known near-optimal quality on point labels. Master's
  clean-ground-first sweep (rule 1, merged 2026-10-07) already acts like the first rule.
- **Cost.** The graph for labels against labels depends on every label's text and the zoom, so it is
  per pass, not pre-processing, unless restricted to the static half (§4.2).
- **Literature.** Wagner, Wolff, Kapoor and Strijk, "Three rules suffice for good label placement",
  Algorithmica 30(2), 2001 (CITED, verified). Christensen, Marks and Shieber, "An empirical study of
  algorithms for point-feature label placement", ACM TOG 14(3), 1995, the comparison everyone cites
  (CITED, from memory).
- **Verdict.** A placement method, not a pre-processing one. Keep for the speed phase's builders.

### 4.4 Most-open angle and free space per node, scale-free

- **Method.** Bearings of incident pipes and the open arcs between them, widest first (Tom's ranked
  gap list, R-079).
- **Benefit.** Already built and cached (`buildNodeContext()`), 21 ms over 9 passes, 0.5%
  (MEASURED). Round 6 measured that the two widest gaps hold 80-87% of the free ground, yet ordering
  the search by them changed nothing measurable once a search goes all round (phase-1 summary,
  "ranked wedges"; MEASURED).
- **Verdict.** Done. No further gain expected.

### 4.5 Open space as boxes, pre-computed per zoom band (`spot_prime`, `box_est`)

- **Method.** Tom's sketch (`dev/label-placement-algorithms.md` §9b-9d): find patches of open ground
  near the labels that need them, keep the extremes (tallest skinny, widest squat, biggest square),
  and seat a stack there by angle. Speed-phase plan S1-S3: a tile-indexed list built once per
  project and per notch, in model space, surviving pans.
- **Benefit expected.** Speed-phase S1: "the rescue phase [...] at least three times faster with no
  fewer labels" (a hypothesis, not measured). On master the rescue search was taken out for its cost
  (+1.0 label per 100 for 7%), so this would bring back a rescue at a price Tom might accept.
- **Cost.** A free-space decomposition per notch: SPECULATION, comparable to one first-fit to build.
  Invalidated by any label change in the patch, so it is fragile under text edits.
- **Literature.** The slider models (labels sliding along the point or the line instead of a fixed
  set of positions) are van Kreveld, Strijk and Wolff, "Point labeling with sliding labels",
  Computational Geometry 13(1), 1999, and Strijk and van Kreveld's extension to avoid other map
  features (ACM-GIS 1999) (CITED, verified). Particle-based labelling, which fills free space
  outward, is Luboschik, Schumann and Cords (2008) (CITED, from memory).
- **Verdict.** The research question with the most upside and the least evidence. After E2.

### 4.6 Active ranges: decide each label's zoom interval ahead of time

- **Method.** For each label, pre-compute the scale above which it shows (and, for us, above which
  each value shows), so that a zoom is a lookup and a label never pops in and out while zooming
  ("monotonicity"). Tom's `text_size_largest_perfect_fit` (speed-phase P5) is the one-number version:
  above one scale every label's smallest form fits at home.
- **Benefit expected.** Near-zero zoom cost and stability by construction. It answers R11 (zooming in
  brings things back) by design.
- **Cost.** The pre-computation is a sweep over scales. Any edit invalidates its neighbourhood.
  Master's bank is the discrete form of it already, without the monotonicity guarantee.
- **Literature.** Been, Daiches and Yap, "Dynamic map labeling", IEEE InfoVis 2006: "a framework
  that moves all of the selection and placement decisions into the preprocessing phase", each label
  selected in at most one scale interval, its active range (CITED, verified). Been, Nöllenburg, Poon
  and Wolff (2010) show optimising active ranges is NP-hard and give approximations (CITED,
  verified via arXiv 1609.06327). Mapbox GL says its placement "expands on a paper
  by Been and Yap" (CITED, verified, Mapbox blog "Map Label Placement in Mapbox GL").
- **Verdict.** Worth one cheap probe (E3): how many labels' fate at each notch is already decided
  by static obstacles and their own size alone.

### 4.7 Simplifying dense pipe runs

- **Method.** Merge collinear or nearly collinear segments, at a tolerance per notch, before they
  become obstacles.
- **Benefit expected.** Bounded by obstacle building plus segment tests; obstacle building is 1.6%
  (MEASURED). A segment test only fires on a candidate the grid hands it.
- **Verdict.** Low priority on present evidence; revisit if the bench's 20,000-node networks show
  segment tests dominating.

### 4.8 Per-pass constants: read every setting once (found today)

- **Method.** Not geometric. Inside one `refreshLabelText()` call, the answers of `scnSetting()`,
  `scnLabels()` and the scenario's coordinate overrides cannot change, but they are re-resolved
  through the scenario layer thousands of times. A memo, created at the start of the pass and thrown
  away at its end.
- **Benefit.** MEASURED, §6.
- **Cost.** A few hundred entries for one pass; nothing to invalidate across passes.
- **Verdict.** Port first (`port-plan.md` Step 1).

## 5. Pre-registered experiment design

**Networks.** Net3 (fit, 2x, 4x, 8x), Net3 on the world map near Novato (same), the bench's plain
downtown n600 seed 71 (the bench's five zooms, 1x to 4x), `bent-valves-n600-seed7`, and one
generated network of 5,000 nodes from the bench's generator (scaling). Field set: node ID, P, Qb, Z;
link ID, Q, V; "along the pipe" on. Base scenario, plus one scenario with a coordinate override for
every method that reads one.

**Measures, every experiment.**
1. Time per label pass, median of 5, on the DOM stub and in Chromium (`?debug=perf` rows).
2. Labels and values shown per view.
3. Never-rule breaks: N1, N3, N4, N5, counted as `label-node-symbol-harness.js` counts them; must be 0.
4. Sameness: a fingerprint of every label's visibility, offset and row count per view against
   master; for a method claimed to be exact, it must match on every view.
5. Stability between notches: labels that change between consecutive notches and on a control
   (the same view twice), as `vs-production/stability.js` counts them.
6. Its own costs: build time at load, memory (heap delta), and the time to re-validate after one
   edit (an elevation retyped wider; a node moved).

**Hypotheses (stated before running).**

- **E1, per-pass setting memo.** H1a: identical fingerprint on every view. H1b: pass time down by at
  least 5% on n600. *Run today, §6.*
- **E2, static candidate pruning per notch (§4.2).** H2a: identical fingerprint on every view (the
  pruned candidates are exactly those the exact test would refuse for a static obstacle). H2b: at
  least half of all candidate tests are against static obstacles at 1x and 1.5x on n600. H2c: pass
  time down by at least 15% on n600 at 1x to 2x, net of the build on a first visit. H2d: the build on
  a first visit costs less than one first-fit (74 ms on the n600 switch).
- **E3, active-range probe (§4.6).** H3: at 3x and closer on n600 and at 4x and closer on Net3, at
  least 90% of labels have their smallest form clear at home of every static obstacle, so a fast path
  could skip the search for them.

**The one or two worth running first.** E1 (done) and E2. E2 is the only method in §4 aimed at the
35% narrow phase and the 18% prediction pass, and it must be exact, so it cannot disturb the layout
people know. E3 is a count, an hour's work, and tells whether Tom's P5 is worth building.

## 6. E1, run today (MEASURED)

`dev/label-trials/preprocessing/patch-memo.js` applied to a copy of master's page code on disk
(`/home/haws/label-trials-work/preproc/memo/`); `time-and-sig.js` run twice on each, 5 passes per
view; raw lines `dev/label-trials/preprocessing/run-*.jsonl`.

- **H1a holds:** the layout fingerprint is identical on all 13 views (Net3 4, Novato 4, n600 5),
  both runs.
- **H1b holds on n600:** mean of the two runs, ms per pass, master then memo:

| view | n600 1x | 1.5x | 2x | 3x | 4x | Net3 fit | 2x | 4x | 8x | Novato fit | 2x | 4x | 8x |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| master | 779 | 700 | 651 | 509 | 412 | 63 | 69 | 64 | 40 | 64 | 68 | 63 | 40 |
| memo | 745 | 645 | 603 | 464 | 366 | 63 | 67 | 59 | 37 | 58 | 66 | 58 | 35 |
| change | -4% | -8% | -7% | -9% | -11% | 0% | -4% | -8% | -6% | -8% | -4% | -8% | -14% |

- **Smaller than the profile's 14%**, which is expected: the profiler inflates many small calls.
- **Not yet tested:** Chromium; a non-Base scenario; a pass that writes a setting part-way (none is
  known to). Those three are the port's harness (`port-plan.md` Step 1).

## 6a. E2, run 2026-11-06 (MEASURED)

`dev/label-trials/preprocessing/patch-prune.js` applied to copies of master `47338267` page code
(`/home/haws/label-trials-work/preproc/e2/`). **Static** = a node or valve symbol box and a pipe
segment of the first-fit call's input; a Text box, a placed label and a leader are not. The patched
first-fit keeps a table per static set (checksum of the symbols and pipes, so one per notch) of rows
(label id, side, sweep, pad), each guarded by every number its answer depends on. A row holds the
verdict of the static obstacles alone, "pipe under the rows" and "leader through a symbol"; the sweeps
test only the other labels' ground. A side the table calls blocked is skipped before its boxes are built.
`bench-e2.js` (E1's bench plus the first pass of each view and test counters); raw lines
`run-prune-*.jsonl`. A `--verify` copy ran every skipped or cached answer beside the original test over
all 13 views and threw on any difference: none.

| hypothesis | result | numbers |
|---|---|---|
| **H2a** identical fingerprint | **held** | all 13 views, 4 timed runs, the verify copy and both counting copies equal master's |
| **H2b** at least half of tests against static | **failed** | first-fit tests (box, leader, pipe-under-rows, leader-through-symbol, own-pipe) static share on n600: 1x **45.8%**, 1.5x **32.0%**, 2x 24.8%, 3x 20.6%, 4x 21.6%. Net3 1x 63.9%, 2x 44.1%, 4x 30.1% |
| **H2c** pass down 15% on n600 1x-2x, net of build | **failed** | first pass of a view (build included), mean of runs 2-4: 1x **+5.1%**, 1.5x +1.2%, 2x +2.8% (slower). Repeat passes: -10.6%, -2.3%, -3.2% |
| **H2d** build under one first-fit (74 ms) | **failed** | the static-verdict work in a first pass on n600: 1x **473 ms**, 1.5x 265, 2x 133, 3x 51, 4x 24 |

- **Tests removed are real, time saved is not.** Counted in the same patched copy, n600 first-fit tests
  against master: first pass -17.7% (1x), -18.3%, -20.1%; a repeat pass -51.7%, -36.8%, -31.1%. Net3
  and Novato 1x lose 41-43% on the first pass (cross-call hits). But a test against a static symbol is
  a cheap early-out (the distance check rejects most), so the tests removed are the cheap ones; the
  rest of the pass (candidate and box building, the sort, shed rungs, the dynamic tests) is untouched.
- **Hit rate on a first pass is low**: n600 1x 28,773 hits, 244,649 misses, 31,892 guard failures;
  the calls that share a static set give the same label different boxes (a form, a pad, a reach), so
  one row is overwritten by the next call. A row per call would hit more and cost more memory.
- **Where the static tests live.** 98% of the static share is symbol boxes (clear test); pipes enter
  only through "pipe under the rows" (about 2% of tests). Pipes are soft in the clear test, so a pipe
  never blocks, and a table of "blocked by a pipe" is empty. The prune is a symbol-box prune.
- **Noise.** Four interleaved runs of five passes on a shared machine; run 1 ran under load
  (average 7-13) and is in the files but not in the means above. Over all four runs n600 first pass is
  +7.3%, +7.1%, -1.2%, -0.8%, -1.0% (1x to 4x). Differences under about 5% are not resolved.
- **Net3 and Novato** first pass is 3-32% slower at 2x and 4x (a table filled and not read again).

**Verdict: do not port it.** It is exact (H2a) and removes a fifth to half of the tests, and still does
not pay: the first visit is the only one that costs anything (the bank serves revisits in about 13 ms),
and on the first visit it is no faster and slightly slower. A port would also need the table dropped
on any geometry edit near a node, any symbol-size or scale change (a notch is its own table), and a
rebuild per call site; memory is about 11 numbers and a few flags per row (n600: 1,985 rows at 1x,
about 0.3 MB a notch, 5 notches) and is not the obstacle. What would move the 18% prediction and the
35% narrow phase is not skipping static tests but cutting the dynamic ones (D in the counts: label
against label, 55% to 79% of tests on n600) or the re-runs; that is E2's lesson for §4.3 and §4.5.

## 7. Threats to validity

- The DOM stub's character width is nominal; the browser's share of DOM work is larger, so stub
  percentages overstate what a reader saves.
- Two runs of five passes on one shared machine; differences under 5% on Net3 are within noise.
- The profile is of one harness's views; a different field set changes the mix (more values, more
  shedding).
- Every network here was laid out with "along the pipe" on; with it off, pipe labels go to the ring
  pass and the mix changes.
