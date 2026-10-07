# Label placement, phase 1 summary (rounds 1-7, 2026-09-27 to 2026-10-07): the state of the art for phase 2

**Builders must not read `dev/label-trials/`.** This file is the judges' write-up. At the start of
phase 2, §2 and §3 (the strategies and the recipe, with their measured worth) replace the catalogue in
`dev/label-placement-strategies.md`; nothing else here goes to the builders.

Tom, 2026-10-06 (his earlier draft of his answer to round 6's proposal 4): *"Maybe we eventually close
phase 1 of this study, write up the most promising strategies, compile a list of a dozen or so
strategies, and offer them as state of the art to the next Phase of builders."* This is that write-up.
It is also the core of a paper: the problem, the bench, and what measured best (§5).

---

## 1. What phase 1 was

**The problem.** Label every node and pipe of a water network map, at any zoom, on any size of
network, so that nothing is written over a symbol or another label (N1), no leader crosses a node
(N3), hand-placed labels stay put (N4), and Text objects stay clear (N5). The goal is Tom's G: *"Use
convenient available space effectively, and drop properties, then labels, when all else fails."* The
prize is R1's first half, *"Hide a label only because there is no room for it on screen"*: *"the
golden prize, the end of the rainbow"*, scored, never passed or failed.

**The method.** Four builder agents (A to D) built placers in a clean room from the rules (Part A)
and a neutral bench (`dev/lpn-spike/label-bench/`): a pure function of one view in, label positions
out. Judges scored them on scenes the builders never saw, with tests the builders did not know
(rounds 5-7 pre-registered their hypotheses). Seven rounds: the rules were rewritten from Tom's
markup (rounds 1-3), a generator of networks of any size and shape was built (round 5), bent pipes,
valves and 20,000-node networks were added (round 6), and in round 7 the builders were given the
judges' room measure as a self-test and a catalogue of strategies.

**Where it ended.** On 64 fresh secret networks of 1,000 nodes, at five zooms each, the four round-7
placers show 78-79% of the labels asked for and 50-52% of the values, with no break of N1-N5 anywhere
in 5,060 views, none slower than 0.72 s, and about one label in 200 that a strict search could still
have added without moving anything. The shipped page's placer (round 6's "master") showed 47% of the
labels on comparable networks and wrote labels over valve symbols.

| | labels shown | values shown | room left (held-back measure) | still addable per 100 | breaks |
|---|---|---|---|---|---|
| shipped page (round 6, its own scenes) | 47% | 33% | n/a | n/a | 124 of 128 sets |
| best of round 6 (C) | 72% | 48% | 14% of hidden | 1.7 | none |
| round 7, range of the four | 78-79% | 50-52% | 5-7% of hidden | 0.4-0.6 | none |

---

## 2. The dozen strategies, with their measured worth

"Bought" is what switching the ingredient off cost, measured by its builder on the public scenes
(its strategy card) and re-measured by the judges on 8 secret sets (round 7, H3: every claim of a
label in 100 replicated in sign). Labels and values are per 100 asked for.

| # | Strategy | Who built it | Bought (secret sets) | Bought (public, card) |
|---|---|---|---|---|
| 1 | **Smallest form first, then grow.** Every label gets a place in its smallest form (the value the drop order keeps longest) before any label gets a second value; then grow in rounds, one value at a time | A, B, C, D | A +8.8 labels, B +2.9, D +3.0; values about unchanged | A +136 labels, B +91, D +133 |
| 2 | **Eviction.** A hidden label may move one or two neighbours that block it, by their text or by their leader, if each still shows | A, B, C, D | D +7.3 labels, C +3.5, B +1.8, A +0.5 | D +245, C +143, B +81, A +126 |
| 3 | **Dense rescue search.** For a label still hidden, rays every 15 degrees at every half row out to 3-4 rows (the self-test's own search, built in), refusing ground under leaders and leaders through text; evict again with these spots | B, C, D (A: a fine tier) | D +6.4 labels (+4.9 for the eviction on it), B +3.3 | D +203, B +223 |
| 4 | **A clock, never a count.** Stop improving at a time bound (450-700 ms); never cap the work by how many labels there are | A, B, C, D | D with its old count cap: -10.5 labels, -6.3 values; the cap also hides labels by count (R1's second half) | D +239 labels |
| 5 | **Clean ground first.** Every pass but the last accepts only spots that cross nothing; a final sweep lets a still-hidden label cross one pipe | B | not re-measured (a crossing ingredient) | 3.5 times less crossing cost for 21 fewer labels |
| 6 | **Match the bench's tolerances, or tighten clearance only for a label that would otherwise hide** | A, B, D | D +2.8 labels, +2.0 values; A +1.5, +1.2 | D +85, A +63, B +12 |
| 7 | **Pipe labels along the pipe**, at stations along its on-screen stretch, turned to the leg they sit beside, then a last pass that turns any level label that now has room (R14) | A, B, C, D | not re-measured (an R14 ingredient) | D: level-with-room 539 to 50; A: 188 to 54 |
| 8 | **Other layout**: a stack unwrapped to one line, or a line wrapped to a stack, when it fits better | A, B, D | not re-measured | values +640 (B), +660 (A), +930 (D) |
| 9 | **Kept labels may move to grow.** A label carried from the last view may re-seat to show more values, not only grow in place | A, B | not re-measured | values +1,230 (A), +630 (B) |
| 10 | **Carry the last view's spot while legal and clean.** Hold a label where it was unless it now crosses a pipe or a leader | A, B, C, D | not re-measured (a stability ingredient) | churn: D 402 to 247, B 355 to 198; A's "clean" check cut crossing cost by a quarter |
| 11 | **Most constrained first.** Seat first the label with the fewest open spots on the fixed map | C | C +1.1 labels (7 of 8 sets) | C +44 labels |
| 12 | **A coarse raster in front of the exact tests.** A few-pixel grid of covered cells refuses most candidates before any geometry is built | A, B, D | not re-measured (speed) | B: three times faster, same layout |

**Measured and found not to pay, once a dense search exists:**

- **Ranked wedges** (search a node's two widest pipe gaps first; Tom's ranked gap list, Task 539's
  `spot_prime` step 1). Round 6 showed the top two gaps hold 80-87% of the free ground, but three
  builders found that ordering by them changed nothing measurable (A: no difference; D: +1 label, -18
  values; B: neutral), because a search all round the node finds the same ground. Ranked wedges are
  worth having only for a placer that cannot afford to search all round.
- **A repair pass bolted on after the layout** (B tried it: 16 fewer labels). Built in (strategy 3) it
  pays; bolted on it only reorders the greedy.
- **Longer leaders** (out to 6-7 rows): +1 to +7 labels for twice the time (B, C).

**Never tried, still open:** `spot_prime` and `box_est`, Tom's box model (finding the best patch of
open ground near the labels that need it and seating a stack there by angle). A's `far` leaders are
the nearest anyone came (34 labels on the public scenes). B's reason for not trying it: the labels
still hidden are in ground so crowded that a 6-row reach found 7 more. It remains the obvious
candidate for phase 2, now aimed at the crowded cores where everything else stops.

---

## 3. The recipe all four converged on

Tom, on defining "convenient available space" (2026-10-06): *"If they all converge on a rule like
this, let's stand amazed. If not, let's hold our peace."* They did not converge on a definition, but
they did converge, independently, on one recipe:

1. Hand-placed labels at the user's point.
2. Last view's spots, kept while legal and clean.
3. **Every other label in its smallest form**, most crowded or most constrained first.
4. **A dense search** for the labels still hidden, and **eviction** of one or two neighbours.
5. **Grow** in rounds, a value at a time, letting kept labels move to grow.
6. A last pass for pipe labels along their pipes (R14).
7. All of it after the first pass on a **clock**, never a count.

Where they differ is the flavour: A grows hardest (most values), B refuses crossings hardest (cleanest
map), C searches widest (least room left by the strict measure), D aligns pipe labels best and is the
fastest. Each difference is a choice of weights, not of structure.

---

## 4. What phase 1 learned about measuring

- **Measuring "room" is easy only one label at a time.** The judges' measure asks, for one hidden
  label in a finished map, whether there is a gap near it. Every builder found that most of what it
  calls room is ground under another label's leader or on a pipe label's own pipe; the stricter
  measures (refusing that ground, and seating labels one after another so no gap is counted twice)
  say the real room left is a small fraction of the headline. Tom asked whether the bench is
  *"emergent ability or a delusion"*: it is a real ruler and a real ingredient, and its headline
  number overstated room several times over (round 7 record, 2.7).
- **Our own generator was the largest single source of error.** Round 5's "bent pipes" pointed at the
  corner of the screen for a whole round; the bench now refuses a scene with a non-numeric point.
- **Defaults leak into results.** Changing what an unnamed ID means in the drop order changed every
  placer's numbers by 5-12 labels in 100 and turned the shipped default into bare values with no ID
  (round 7 record, 2.9). Tom, 2026-10-07: *"I repeat 'No' about keeping ID last. If user doesn't want
  it last, don't force that on them just because it's small."* The drop order is the user's; a placer
  never forces the ID last (R1 (3)). The narrower ID showing more labels is not a reason to move it.
- **Known bench defects to fix before phase 2** are listed in the round 7 record, 2.8.

---

## 5. For a paper

The contribution: a neutral bench for interactive network-map labelling with a published contract
and secret scenes, a generator of networks of any size and shape with bends and valves, a pre-
registered protocol, and the finding that independent builders given the judges' own room measure
converged on one recipe (§3) that leaves under 1% of labels addable, at under 0.75 s per layout on
20,000-node networks. The negative results (ranked wedges, bolt-on repair) and the measuring lessons
(§4) belong in it as much as the recipe. The references are in `dev/label-placement-strategies.md`.
