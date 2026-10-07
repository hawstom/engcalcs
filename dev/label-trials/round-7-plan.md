# Label placement, round 7 (plan, 2026-10-06): the golden prize scored, a self-test, and a strategy catalogue

**Builders must not read this file or `dev/label-trials/`.** It is the judges' side. The builders'
copy of §2 (the self-test) and §3 (the strategy catalogue) is `dev/label-placement-strategies.md`,
written 2026-10-07; nothing else here goes to them (§5 says how they receive it without the judges'
files).

**Three launch decisions rest on Tom's own words, read as his direction, not on a separate yes from
him** (the coordinator's reading, 2026-10-07; if he objects, we revise):

1. **Share the self-test with the builders**: his question of 2026-10-06, *"can we share our measuring
   tool with the builders so that they can self-test their strategies in real-time?"*
2. **Hand them the catalogue**: his answer the same day, *"We might list known and propounded
   strategies as suggestions including this one."*
3. **Put `spot_prime` and `box_est` in the catalogue as a suggestion**, no longer held back: his
   comment of 2026-09-21, *"I don't understand why we are spending effort on the rings model instead
   of giving the spot-prime box model a good college try."* (`dev/tom-review-queue.md`, R-103, as
   recorded in `dev/ROADMAP.md`.)

Tasks 741 and 539. Tom's answers to round 6's proposals 2 and 4, 2026-10-06, are quoted in full in
`dev/label-trials/round-6-2026-10-05.md` ("His answers to proposals 2 and 4") and in
`dev/label-placement-rules.md`. In short: R1's first half, *"Hide a label only because there is no
room for it on screen"*, is **"the golden prize, the end of the rainbow. You can't fail builders who
fail it, because they all fail it. You must score them."** And the two-widest-gaps search is **"a
strategy"**: *"We might list known and propounded strategies as suggestions including this one. I
would hope that each round of testing would result in a successively better handful of tested and
compared creative strategies and recipes for combining them."*

§1 answers his four questions. §2 is the self-test he asked about. §3 is the catalogue. §4 is the
protocol, pre-registered in the manner of rounds 5 and 6. §5 is what must happen before launch.

---

## 1. His four questions, answered

The bench's "room" measurer is `dev/lpn-spike/label-bench/judges/room.js`. For one label that a
layout hid, it asks: in that finished layout, is there a free spot within three text rows of the
label's owner where its smallest form (the last value in the user's drop order) would fit? "Free"
means on screen, over no symbol, no other label, no Text object and no pipe, reached by a straight
leader that passes through no other node's symbol and crosses no other leader. It tries 24
directions (every 15 degrees) at 7 distances (every half row). The R1 judge (`judges/r1.js`) runs
it on every hidden label and reports the share that had room.

The prototype and the checks below ran on round 6's 32 bent-and-valved E1 networks (four families,
seeds 61-64, nodes 28 and 44 px apart, five zooms each), extracted again so that their drop order
carries the ID (Tom's yes of 2026-10-06). Code: `dev/label-trials/round-7-pilot/` (`repair.js`,
`run-pilot.js`, `summarise.js`, `draw-room.js`), raw lines in its `raw/`, the table in its
`results.md`. The scenes are in `/home/haws/label-trials-work/r7pilot` (not committed; they
reproduce from the specs).

### 1a. If we can measure it, can we build it?

**Partly, and the pilot shows exactly how far.** A measurer is not automatically a placer, for one
reason: **it judges one label at a time against a layout that is already finished.** Placing a
label changes the room for every label near it. When the measurer says "label 412 had room" and
"label 413 had room", it may be the same patch of ground both times; only one of them can have it.
Which one gets it, and with how many values, is an ordering decision the measurer never makes.

Measured: on the four placers' layouts (four of the networks, first three zooms), **52 to 66% of the
spots the measurer found overlap a spot it found for another hidden label.** So the round-6 figures
("C hides 29% of its hidden labels with room") overstate how many could actually have been shown at
once.

**What a placer built on the measurer looks like** is a repair pass: let any placer lay out the
view; then walk the hidden labels, ask the measurer for a free spot for each, put the label there,
and count it as an obstacle before asking for the next. One pass reaches the end: placements only
add obstacles, so a label refused once is refused again. We built three versions:

- **rich**: each hidden label, in request order, takes the most values that fit.
- **lean**: every hidden label first takes its smallest form (so as many labels as possible come
  back), then each grows in place if it can. Labels before values, as G and R1 say.
- **strict**: lean, but refusing the measurer's two blind spots found in 1c (a label over another
  label's leader, and a leader through another label's text).

And a fourth entrant with no placer underneath at all: **the measurer alone** (empty map, then the
repair pass).

Pooled over the 32 networks and 160 views (`round-7-pilot/results.md`, which also splits by density).
"Hidden with room" is the public measure's share of hidden labels with room for their smallest form;
"along" is the share of pipe labels the setting asks to lie along their pipe that do (R14). Every
entrant shows its most-wanted value on every label it shows (the drop order now holds the ID), so
that column would repeat "labels shown" and is left out.

| entrant | labels shown | values shown | hidden with room | label on leader per 100 shown | Tom-weighted cost per label | along | ms median / max | views over 1 s |
|---|---|---|---|---|---|---|---|---|
| A alone | 68.9% | 40.7% | 34% | 0.2 | 0.070 | 25% | 15 / 470 | 0 |
| A + lean repair | 76.4% | 44.0% | 0% | 8.0 | 0.122 | 22% | 21 / 883 | 0 |
| A + strict repair | 73.5% | 42.9% | 15% | 1.5 | 0.077 | 23% | 24 / 895 | 0 |
| B alone | 64.8% | 38.8% | 40% | 0.0 | 0.066 | 24% | 7 / 57 | 0 |
| B + lean repair | 75.0% | 43.5% | 0% | 6.9 | 0.111 | 20% | 18 / 624 | 0 |
| B + strict repair | 72.6% | 42.3% | 10% | 1.5 | 0.074 | 21% | 16 / 515 | 0 |
| C alone | 69.8% | 46.3% | 21% | 0.0 | 0.105 | 55% | 18 / 189 | 0 |
| C + lean repair | 74.0% | 48.1% | 0% | 4.3 | 0.133 | 52% | 44 / 481 | 0 |
| C + strict repair | 72.3% | 47.4% | 8% | 0.6 | 0.108 | 53% | 42 / 435 | 0 |
| D alone | 66.8% | 43.2% | 38% | 0.0 | 0.063 | 66% | 26 / 203 | 0 |
| D + lean repair | 74.3% | 46.5% | 0% | 7.2 | 0.110 | 60% | 52 / 562 | 0 |
| D + strict repair | 71.7% | 45.4% | 12% | 1.2 | 0.069 | 62% | 60 / 515 | 0 |
| measurer alone, rich order | 69.9% | 50.6% | 0% | 17.5 | 0.150 | 7% | 67 / 2,355 | 13 of 160 |
| measurer alone, lean order | 78.4% | 49.5% | 1% | 14.6 | 0.124 | 8% | 80 / 1,060 | 2 of 160 |
| measurer alone, strict | 75.5% | 48.2% | 11% | 3.6 | 0.047 | 7% | 88 / 1,024 | 1 of 160 |

Paired on the same network: every repair version adds labels to every builder on **32 of 32
networks**: lean +3.9 (C) to +9.5 (B) labels per 100 requested; strict +2.2 (C) to +7.3 (B). The
rich version matches lean on top of a builder (little room is left to fight over) but runs 4 to 11
views per builder over one second, so it is out under R10. No entrant broke N1, N3, N4 or N5; D with
the repair made 3 to 5 invalid placements in 160 views (below).

**What this says, in plain terms.**

1. **Yes, as an ingredient.** Bolted onto any of our four placers, the measurer used as a repair
   pass shows more labels on every network, 2 to 9 more in every 100 asked for. The better the
   placer, the less it adds (C gains least), which is the R1 ranking again from another side.
2. **Its blind spots become the placer's defects.** Used as it stands (lean), it seats labels over
   other labels' leaders and runs leaders through other labels' text: 4 to 8 label-on-leader
   crossings per 100 labels shown, where the builders have almost none. Teaching it those two checks
   (strict) cuts that to 0.6 to 1.5 and keeps about 60% of the gain.
3. **The order problem is real and large.** The same measurer on the same networks shows 69.9% of
   the labels when each label grabs the most values it can, in turn, and 78.4% when every label first
   takes its smallest form and only then grows. Eight and a half points from the order alone.
4. **The surprise: the measurer alone is already a crude placer, and on labels shown it beats all
   four builders** (75.5 to 78.4% against 64.8 to 69.8%), with as many values, and in its strict form
   the lowest weighted crossing cost of any entrant, because it never sets a label across a pipe
   (the builders do so 15 to 32 times per 100 labels shown). What it lacks is everything else the
   rules ask for: it lays pipe labels level (7% along their pipe where the setting asks, against C's
   55% and D's 66%), so R14's judge would fail it; it remembers nothing between zooms (churn about
   4,800 against A's 25); it is the slowest (median 80 to 90 ms, worst views about one second); and
   even strict, 3.6 label-on-leader crossings per 100. How much of its lead comes from ignoring
   R14's turned pipe labels is not measured.
5. **Circular by construction, so read the other columns.** After the lean repair the public measure
   reads 0%: the placer was built from the ruler. The columns that say whether it helped are the ones
   the measurer does not define: labels and values shown, crossings, alignment and time. The strict
   version still reads 8 to 15% "with room": room the public measure counts but that lies under a
   leader or behind another label's text.
6. **A lesson for builders.** D with the repair pass made 3 to 5 invalid placements in 160 views: D
   re-uses its last layout (`prev`), received the repaired one, and re-grew a label the repair had
   seated with a leader D does not draw. A repair pass bolted on from outside must hand the placer its
   own previous layout, or be built inside it.

**So: measuring it does tell us how to build a large part of it.** The measurer, run greedily with
the smallest form first, is the single best ingredient we have for R1's first half. It is not a
whole placer, and the pilot says exactly which parts are missing.

### 1b. How did we learn to measure it?

From Tom correcting a test, and then by reusing that one function three times.

1. **2026-09-28, round 2.** The 12345678 test (R-075, longer node IDs) counted a label as failing if
   it merely *moved*. C and D "failed" by moving two thirds of their labels; master "passed". Tom, on
   the real map: *"The test is faulty. Their behavior is gold. See if you can rewrite the test."*
   His original complaint had been labels hidden or cut **where free space exists within reach**, so
   the test was rewritten to count exactly that, and `room.js` was written to answer "within reach"
   (commit `c6ce82b4`). It was deliberately plain, so that "no room" means "no room a simple search
   finds", never "no cleverer arrangement exists".
2. **2026-09-30, round 5.** The same question became the metric **G, missed room**: of every label
   requested, those hidden although the measurer finds room for the ID row, plus those cut although
   it finds room for the whole label. `room.js` scans every obstacle for every candidate, hopeless at
   3,000 labels, so round 5 rebuilt it over a grid (`round-5-2026-09-29/metrics.js`) and proved the
   two agree label for label (5,684 of 5,684).
3. **2026-10-05, round 6.** Tom's reworded R1 (*"Hide a label only because there is no room for it on
   screen"*) is G's first half in his words, so the R1 judge (`judges/r1.js`, commit `caf38be1`) is
   the same measurer again. Its selftest proves it can tell the difference: a greedy placer that
   hides only where there is no room passes; the same placer capped at 60 labels fails. On
   2026-10-06 the "smallest form" became the last value in the drop order rather than the ID
   (`0885e755`).

So nobody designed a measure of "convenient available space" from a definition; Tom refused one
(*"No. This is micromanagement. This is what we are running this experiment for."*). What we have is
an operational stand-in that grew out of his complaint about one test.

### 1c. How well are we measuring it?

**Well enough to rank placers; not well enough to treat its percentages as the truth.** What it
checks, and what it does not:

| | Checked? | Effect |
|---|---|---|
| Other labels (each row's ink), node symbols, pump and valve symbols, Text objects, page furniture, the screen edge | yes | |
| Pipes under the label | **forbidden outright** | The rules only charge a label on a pipe (medium-low cost). So the measurer misses room a placer may legitimately use: of the labels the four placers actually showed, the measurer would find no room for 10 to 16% even in their smallest form, mostly because the placer had put them across a pipe (52 to 79% of those) or turned along their own pipe (C 31%, D 35%). Under-counts room. |
| Its leader through another node's symbol; its leader across another leader | yes | |
| **The label over another label's leader** | **no** | Ground under a leader counts as free. Over-counts room. |
| **Its leader through another label's text** | **no** | Over-counts room. Of the spots it found on the four placers' layouts, 34 to 58% involve one of these two (label on leader, the rules' second-worst crossing). |
| Two hidden labels claiming the same spot | **no** (one label at a time) | 52-66% of found spots overlap another found spot (1a). Over-counts room. |
| Whether its own spot is a valid placement | **no** | A stack hung straight above or below its node is left-aligned, so a narrow end row can miss the leader: the bench calls that placement invalid, the measurer counts it as room. Rare: before the repair pass was taught to refuse them, it made 1 to 4 per view on downtown networks and none elsewhere. |
| A pipe label turned along its pipe (R14) | **no**, level only | Under-counts room for pipe labels. |
| The standard hook; directions between its 15-degree steps; distances between its half rows | **no** | Under-counts room, a little. |
| Reach | fixed at 3 rows | Our number, not Tom's: he declined to define "convenient". |
| Flow arrows; customer symbols | ignored | Matches the bench's own scoring (arrows are not scored; a label on a customer is free). |

**Checked by eye.** `draw-room.js` drew three crops of placer layouts at 1.5x (C on a grid network,
D on a suburban one, and a close-up), with every hidden label's anchor as a red dot and the
measurer's spot as a red dashed box. The plainly right finds (a P or Q value sitting in clear ground
beside its node, which the placer simply did not try) are the majority. The wrong kind are visible
too: clusters of three or four red boxes stacked on one patch of ground (the overlap problem), and
red leaders drawn straight through another label's text (the leader blind spot).

**Net:** the over-counts and under-counts do not cancel in any known proportion, so read the R1
share as a ranking and a trend, not as "this many labels could have been shown". Round 7 adds a
measure that does not double-count (§4.4, "realizable room").

### 1d. Can we share the measuring tool with the builders?

**Yes, technically easily; the cost is that the score then stops being independent.** The tool is
already a pure function of (scene, layout), the same inputs the bench hands a placer, and it runs in
milliseconds per view through round 5's grid. A builder can call it on its own output inside its
build loop (§2). The repair pass in 1a is exactly what a builder would build first with it, and the
pilot says that alone is worth several labels in a hundred.

The risk is Goodhart's: a builder tuned to the public measure can exploit its blind spots (for
instance, by leaving labels where only ground under a leader is "free"). So the judges keep three
things back (§2): a stricter, finer version of the same search, the realizable-room score, and the
fresh secret scenes. If the public and held-back scores rank the builders the same way, the tool
helped; if not, they built to the tool (H5 in §4.5). Sharing it reveals part of how R1 is judged,
which until now was a judges' secret; it is shared on the reading of his question recorded at the top
of this file.

---

## 2. The self-test tool (built 2026-10-07)

`dev/lpn-spike/label-bench/room-check.js`, public: the grid version of `room.js`
(`round-5-2026-09-29/metrics.js`) as a library builders may read and call, with `makeIndex`,
`addPlacement`, `findSpot` and `smallestRows` exported so they can build with its search, not only
measure. The judges' held-back scores (`judges/room-held.js`) use its index:

```sh
node dev/lpn-spike/label-bench/run.js --placer <your-placer.js> --room     # adds two columns per view
```

```js
const { roomReport } = require('dev/lpn-spike/label-bench/room-check.js');
const r = roomReport(scene, layout);          // in your own loop, on your own output
// r.hidden, r.hiddenWithRoom, r.cut, r.cutWithRoom, r.ids, r.spots: {labelId: placement}   (one label at a time)
```

What builders are told about it, word for word in the handed-over copy: what it checks and what it
does not (the table in 1c, without the numbers); that it asks about one label at a time, so its
count is not what can be shown at once; and that the judges score with a stricter and finer version
they do not see. What the judges keep (`judges/room-held.js`): the held-back search (every 5 degrees,
every quarter row, out to 5 rows; no label over another label's leader, no leader through another
label's text, the boxes exactly as the scorer draws them; level and straight, as the public one); the
realizable-room score (§4.4); the count probe; the 12345678 scenes; and the fresh seeds. The hook and
labels across pipes, first proposed for the held-back search, were left out to keep it one search
with the public one; it is finer, farther and stricter, so on master's Novato layouts it finds room
for 973 of 1,186 hidden labels against the public 989, and realizable room brings back 534.

Selftests: the bench's (`selftest-harness.js`, in check_all) checks that labels hidden in open ground
all have room, a label with no ground on screen has none, the smallest form follows the drop order,
and each of 225 spots it hands back on Net1 and Novato breaks nothing when placed alone. The judges'
(`judges/selftest-harness.js`) checks that `room-check.js` and `judges/r1.js` name the same
hidden-with-room labels on every Novato view of master's layouts, that realizable room never exceeds
the public count, and that it seats its labels together with no break and no label on a leader.

---

## 3. Strategy catalogue (handed to builders as suggestions, never mandates)

Tom's principle stands: *"Don't dictate strategies. Maybe hint, but don't dictate."* Every entry is
an idea a builder may take, combine, change or ignore. Sources are the published literature
already surveyed in `dev/label-placement-algorithms.md` (full references there) and what our own
rounds measured. The builders' copy (`dev/label-placement-strategies.md`) says the same without our
file paths, describes earlier builders by idea rather than by letter, and omits the judges' screenshot
test.

### 3.1 Where to look (candidate generation)

| ID | Strategy | Source | What our rounds measured |
|---|---|---|---|
| S1 | **Ranked wedges.** At a node, rank the gaps between its pipes widest first and search the top two (or more), not only the widest | Tom's ranked gap list (R-079); proposal 4 | Round 6: the widest gap held the free ground 52-66% of the time, the top two 80-87%. Builders put 55-61% of labels in the widest gap (47% by chance); master 79%, and it leaves the most room unused |
| S2 | **Standard positions first.** The 8 positions around a point, in a preference order (top-right, right, top, bottom, left, or a measured user order) | Imhof 1975; Christensen, Marks & Shieber 1995; arXiv 2407.11996 | A, B, D use them as tier 0 |
| S3 | **Rings of straight leaders**, nearest home first, tried only when nearer tiers fail | ESRI Maplex ("first attempt to place in an area of free space"); QGIS PAL candidates | All four builders; A builds a tier only if a search could still afford it |
| S4 | **Pipe labels along the pipe, either side, sliding from the middle**, level only as a fallback | Imhof's line rules (via Penn State GEOG 486); MapLibre line placement; R14 | B and D; at close zoom C and D leave 6-9% level with room (round 5), A and B 77-79% (built before R14) |
| S5 | **Unwrap a stack to one line, or wrap a line to a stack**, when it uses the ground better | Hint H-a; Tom's Q07 | A and D, at a small extra cost |
| S6 | **A column (gang) hung on its shared edge, growing toward open ground**, its labels ordered by the angle of their owners so the leaders fan out and never cross | Hint H-c; Tom 2026-09-27 (a); his 2026-09-08 sketch, step 4 (`dev/label-placement-algorithms.md` §9a) | Not built by any builder as such; the judges' screenshot test `gang-runs-south` |
| S7 | **`spot_prime` and `box_est`**: find the best patch of open ground near the labels that need it, size a box for n stacked labels in it, and seat them by angle (in the catalogue on his 2026-09-21 comment, top of this file) | Tom's sketch of 2026-09-08 (`dev/label-placement-algorithms.md` §9b-9d) | Step 1 measured in round 6 via S1; steps 2-3 never built |

### 3.2 How to know a spot is free (indexes)

| ID | Strategy | Source | Measured |
|---|---|---|---|
| S8 | **Uniform grid of obstacles**, cells about one label high | MapLibre CollisionIndex (30 px cells); round 5's `metrics.js` | B (hashed grid); the measurer itself |
| S9 | **Raster with summed-area tables**: "is this rectangle clear?" in four reads | Luboschik, Schumann & Cords 2008 (particle-based labeling) | A and D; D's two rasters (fixed obstacles, seated labels) |
| S10 | **A trellis with no preprocessing** | Mote 2007 | Not tried |

### 3.3 In what order (the order problem)

| ID | Strategy | Source | Measured |
|---|---|---|---|
| S11 | **Smallest form first, then grow** a value at a time in rounds, so every label gets a place before any label gets a second value | Priority-ordered greedy (Christensen et al. 1995); G and R1 | A, C, D. The pilot (1a): the measurer alone, lean order against rich order, 78.4% labels shown in lean order against 69.9% in rich order |
| S12 | **Most crowded first** | Common greedy heuristic | A, B, C, D |
| S13 | **Carry last view's spot** when it is still legal; move only when that buys something | Been, Daiches & Yap 2006; MapLibre persistent identity | A, C, D. Not a rule (Tom removed the stillness rule); it saves time and churn |
| S14 | **Two-SAT existence check** in a two-position model: is a full labelling possible before anything is dropped? | `dev/label-placement-algorithms.md` §6 | Not tried |

### 3.4 Repair after a first layout

| ID | Strategy | Source | Measured |
|---|---|---|---|
| S15 | **Measurer-driven repair pass**: after placing, ask the room search for a free spot for each hidden label and seat it there, smallest form first, then grow; refuse ground under leaders and leaders through text | This round's pilot (1a) | Bolted onto each of A to D: more labels on 32 of 32 networks, +2.2 (C) to +7.3 (B) per 100 requested in its strict form, at 0.6 to 1.5 label-on-leader crossings per 100 shown. Alone, from an empty map: 75.5% shown, more than any builder, but pipe labels level and no memory between zooms |
| S16 | **Eviction**: a hidden label may push one or two blocking neighbours elsewhere, even with fewer values, when that shows more in all | QGIS PAL `chainSearch`; discrete gradient descent (Christensen et al. 1995) | C (MEND, one neighbour), D (up to two) |
| S17 | **Local polish**: each label re-seats itself to cut crossings | Discrete gradient descent | D |
| S18 | **Conflict graph, then the three elimination rules, then a heuristic** | Wagner, Wolff, Kapoor & Strijk 2001; Formann & Wagner 1991 (maximum independent set) | Not tried by a builder |
| S19 | **Simulated annealing, in idle time only** | Christensen et al. 1995; Edmondson et al. 1996 | Not tried; seconds, so only in a pause |

### 3.5 Time

| ID | Strategy | Source | Measured |
|---|---|---|---|
| S20 | **A per-zoom lookup table built in pauses**: spots kept as offsets from their anchors at a ladder of zooms, checked rather than searched at view time | Hint H-b; Been et al. 2006 (labelling as a function of scale) | B; B never took a view over one second |
| S21 | **Anytime layout bounded by time, not by count**: show what is placed, keep improving (R10) | R10 | **Caution, measured:** C and D's per-layout work budgets made them hide some far labels by count (round 6 H5: 2.5% and 3.3% revived). A budget must not depend on how many labels are asked for |

Builders may add strategies of their own; the best new ones join this table next round with their
numbers.

---

## 4. Protocol (pre-registered)

Committed before any round-7 placer is scored (git history is the timestamp). Changes after
scoring starts are listed as deviations in the results, never edited in silently.

### 4.1 Questions

1. With the self-test in hand and the catalogue as suggestions, does each builder leave less room
   unused than its own round-6 self, without showing fewer labels?
2. Which strategies did each builder combine, and what did each one buy, measured (the strategy
   cards, 4.3)?
3. Does the best builder beat the plain recipe "round 6's C plus the strict repair pass"?
4. Did the builders learn the space, or learn the tool? (Public versus held-back scores.)
5. R10 at 20,000 nodes, and R1's second half (never by count), as in round 6.

### 4.2 Materials

- **Builders: the four existing ones, A to D, continuing** from their round-6 commits in their own
  worktrees (`feat/label-placer-a` to `-d`), so each has a paired before and after. Each receives
  Part A of the rules (with §5's line that R1's first half is scored), the bench, the self-test
  (§2) and the catalogue (§3), and nothing else from the judges' side (§5, "Delivering").
- **Reference entrants** (not builders): the four round-6 placers frozen (A `3483bfd6`, B `c5905432`,
  C `9a790a3e`, D `129b63c4`; copies in `round-7/frozen/`, same sha256 as round 6 scored); **R** = round-6 C plus the strict repair pass (`round-7-pilot/repair.js`,
  mode `strict`); **M** = the measurer alone (empty map plus the strict repair pass). Master is not
  re-run (round 6 and its 2.8 defect stand).
- **Scenes**: fresh secret seeds 71-74. Drop order with the ID in it (Tom, 2026-10-06).

### 4.3 The builder's deliverable: a strategy card

With its placer, each builder commits `STRATEGY.md` beside it (in its own worktree), at most two
pages:

1. The recipe: which catalogue entries it combined (by ID), in which order of passes, and any
   strategy of its own, described so another builder could build it.
2. Why: for each ingredient, what it bought, **measured with the self-test and the bench on the
   public scenes by switching that ingredient off** (an ablation row per ingredient: labels shown,
   values shown, hidden with room, crossings, time).
3. What it tried and dropped, and why.

The judges re-measure every ablation the card claims on the secret scenes and publish both. The
round's result is then a table of recipes, each with its measured ingredients: the "successively
better handful of tested and compared creative strategies and recipes for combining them" Tom asked
for. The catalogue (§3) is updated from it for round 8.

### 4.4 Metrics (per view, summed over a set's views; the set is the unit)

Round 6's, unchanged: breaks (N1, N3, N4, N5, invalid; must be zero), labels shown %, values shown %,
most-wanted value %, crossing costs (leader on leader and label on leader per 100 shown labels;
Tom-weighted cost per label), time per layout (median, max), views over one second, churn, R11 rows
lost on zoom-in, R14 at close zoom, R1 not by count (the count probe on views 1x and 2x).

**R1's first half, scored three ways (the primary outcome of the round):**

- **Public room score**: of the labels hidden, the share for which the public self-test finds room
  for the smallest form (round 6's measure, comparable with it).
- **Realizable room**: labels the judges' strict lean repair pass brings back, per 100 labels
  requested. It does not double-count (each spot is taken before the next label asks) and refuses
  ground under leaders. It answers "how many more labels could this layout have shown at once,
  without moving anything already shown?"
- **Held-back room score**: the public score's question with the judges' stricter, finer search
  (§2), which builders never see.

### 4.5 Design and hypotheses

| Exp. | What | Sets | Entrants |
|---|---|---|---|
| E0 | the public bench (Net1, Net2, Net3, Novato x2, bent-valves) | 6 | all |
| E1 | family (4) x seed (71-74) x density (28, 44 px) x variant (plain, bends and valves), n = 1000 | 64 | all (builders, frozen round 6, R, M) |
| E2 | grid, suburban, downtown at 20,000 nodes, seed 71, 44 px, bends and valves | 3 | builders and frozen round 6 |
| E3 | round 6's 32 bent-and-valved E1 sets (seeds 61-64), as the pilot ran them | 32 | builders, frozen round 6, R |

Hypotheses (paired on the same set; exact two-sided sign test; Holm over the four builders where
stated; 95% bootstrap intervals, 10,000 seeded resamples):

- **H1 (the self-test helps).** Each builder's realizable room falls against its round-6 self on E1
  (Holm p < 0.05), and its labels shown % does not fall by more than one point.
- **H2 (beyond the plain recipe).** At least one builder shows more labels than R on E1 at no more
  label on leader per 100 shown labels.
- **H3 (the strategies are real).** Every ablation a strategy card claims as a gain of at least one
  label in 100 replicates in sign on the secret E1 sets.
- **H4 (R10).** No builder takes more than one second on any E1 or E2 view.
- **H5 (the tool, not the space).** The public and held-back room scores rank the eight placers the
  same way (Kendall tau at least 0.6). If not, the builders learned the tool's blind spots.
- **H6 (never by count).** Each builder revives at most 5% of the far hidden labels beyond its
  control flips.

Analysis as round 6 (`analyse.js`, deterministic, generated tables in the round folder).

---

## 5. Before launch

Done 2026-10-07: the self-test (`room-check.js`, `run.js --room`) and the judges' held-back scores
(`judges/room-held.js`), with selftests in both harnesses; the builders' copy
(`dev/label-placement-strategies.md`) and the bench README's pointer to it; Part A §5's line that R1's
first half is scored; and the runners in `dev/label-trials/round-7/` (`matrix.js`, `extract-all.js`,
`score-one.js`, `score-all.js`, `analyse.js`), smoke-tested on the pilot's networks (E0 and E3 with
C6, R and M: 82 cells, none failed; C6 and R reproduce the pilot's 69.8% and 72.3%).

**Frozen 2026-10-07, before any scoring** (this commit is the protocol's final form): A7 from
`feat/label-placer-a` 2883c033 (sha256 `12e5cad68767`), B7 from 18cac708 (`493406be5439`), C7 from
4dc27ea1 (`2de9fc6470c3`), D7 from 2e5e81c4 (`ca198b8d5cc0`), copied to `round-7/frozen/` with each
builder's `STRATEGY.md`; `matrix.js` scores the copies.

**Known before scoring, stated here so it cannot be read as found after:** the round-6 placers never
drop the ID (they predate Tom's 2026-10-06 yes), so every one of them breaks the drop order on nearly
every cut label and shows bare IDs, about a third the width of the bare values the round-7 placers
show. H1 compares realizable room, not labels shown, partly for this reason, but its labels-shown
condition ("does not fall by more than one point") is confounded by it and will be read with that
in mind. Builder B disclosed reading Part B of the rules (round record, "Disclosure").

Left:

1. (Done above.)
2. **Delivering to builders without the judges.** Do not merge `feat/label-placer` into the builder
   branches: it carries `judges/` (now with `r1.js` and `room-held.js`) and all of
   `dev/label-trials/`, this plan included. Check out only the public paths instead, in each builder
   worktree: `git checkout feat/label-placer -- dev/label-placement-rules.md
   dev/label-placement-strategies.md dev/lpn-spike/label-bench/README.md dev/lpn-spike/label-bench/contract.js
   dev/lpn-spike/label-bench/run.js dev/lpn-spike/label-bench/score.js dev/lpn-spike/label-bench/room-check.js
   dev/lpn-spike/label-bench/selftest-harness.js dev/lpn-spike/label-bench/generator.js
   dev/lpn-spike/label-bench/extract.js dev/lpn-spike/label-bench/scenes dev/lpn-spike/label-bench/master
   js/lpn-label-scene.js`. **The four builder worktrees already hold an old `judges/` directory**
   (from the round-2 merge, last changed in `a01171ea`); remove it there (`git rm -r
   dev/lpn-spike/label-bench/judges`) so it cannot be read.
3. Run order, one worker, on disk: `extract-all.js /home/haws/label-trials-work/r7` (E2's 20,000-node
   networks take about 4 minutes and up to 16 GB each), then `score-all.js` on the same folder, then
   `analyse.js <work>/raw > round-7/results.md`. The E3 scenes can be copied from
   `/home/haws/label-trials-work/r7pilot/scenes` instead of re-extracted.

**Agents and machine time.** Four builder agents (A to D continuing), one per worktree, concurrent;
by rounds 2 to 4 a builder's turn has run a few hours of agent time. Machine time, measured on the
pilot (about 3 seconds per cell on a 1,000-node set with every room measure, one process at a time,
with other suites running): extraction of 48 networks about 6 minutes; E1 and E3 together about
930 cells, so about 50 minutes with one worker, a third of that with three; E2 three 20,000-node
extractions at about 4 minutes each plus 24 cells at one to two minutes; the count probe roughly
doubles the E1 builder cells. **In all, about 2 to 3 hours with one worker, about one hour with three of machine time after the builders
finish**, on jasmine, never in `/tmp`.
