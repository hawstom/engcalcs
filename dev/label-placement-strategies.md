# Label placement: strategy catalogue and the R1 self-test (for the builders)

**Builders may read this file.** It goes with Part A of `dev/label-placement-rules.md` and the bench
(`dev/lpn-spike/label-bench/`). Everything here is a suggestion. Tom: *"Don't dictate strategies.
Maybe hint, but don't dictate."* Take any entry, combine entries, change them, or ignore them all.

Why it exists, in his words (2026-10-06): *"We might list known and propounded strategies as
suggestions [...] I would hope that each round of testing would result in a successively better
handful of tested and compared creative strategies and recipes for combining them."* So each round
this catalogue grows by what the builders found, with the numbers.

---

## 1. The golden prize, and how you can score yourself on it

R1's first half, *"Hide a label only because there is no room for it on screen"*, is what Tom calls
*"the golden prize, the end of the rainbow"*. **It is scored, never passed or failed.** Every placer
so far hides some labels where there was room; the score is how often.

You can measure it yourself, on your own output, while you build:

```sh
node dev/lpn-spike/label-bench/run.js --placer <your-placer.js> --room
```

```js
const { roomReport } = require('./dev/lpn-spike/label-bench/room-check.js');
const r = roomReport(scene, layout);
// r.hidden, r.hiddenWithRoom, r.cut, r.cutWithRoom, r.ids.{hiddenWithRoom, cutWithRoom},
// r.spots: {labelId: one free placement found for that label}
```

`room-check.js` also exports `makeIndex`, `addPlacement`, `findSpot` and `smallestRows`, so you may
build with its search, not only measure with it.

**What it checks.** For each hidden label: is there free ground for its smallest form (the one value
the user's drop order keeps longest) within 3 text rows of its owner, on a straight leader tried every
15 degrees and every half row? Free means on screen, over no node, pump or valve symbol, no other
label, no Text object, no page furniture and no pipe (its own pipe excepted), with its leader through
no other node's symbol and across no other leader. For each cut label: is there such ground for the
whole label?

**What it does not see. Read its number as a score, not as the truth:**

- **It asks about one label at a time** against your finished layout. Two hidden labels may both be
  told "room" for the same ground, and only one can have it. Placing one label changes the room for
  the others, so the count is not how many more labels you could show at once.
- It lets a label sit **over another label's leader**, and lets its own leader **run through another
  label's text**. Both are crossings the rules charge for (label on leader is high cost).
- It never puts a label **across a pipe**, though the rules only charge for that; it tries pipe labels
  **level only**, never turned along their pipe (R14); and it never uses the standard hook.
- Its reach, 3 rows, is only this tool's. "Convenient" is not defined, on purpose.

**The judges score R1 with a stricter and finer version of the question that you do not see.** A
placer that learns this tool's blind spots will not gain from them there.

---

## 2. The catalogue

What "measured" means in the right-hand column: what the bench rounds so far showed about the idea,
when anyone tried it. Earlier builders' approaches are described by idea, not by code.

### 2.1 Where to look (candidates)

| ID | Strategy | Source | Measured so far |
|---|---|---|---|
| S1 | **Ranked wedges.** At a node, rank the gaps between its pipes widest first and search the top two (or more), not only the widest | Tom's ranked gap list | On 128 generated networks of 1,000 nodes, for a label hidden although there was room, the widest gap held that room 52-66% of the time and the top two 80-87%. A placer that searches only the widest gap leaves the most room unused |
| S2 | **Standard positions first.** The 8 positions around a point in a preference order (top-right, right, top, bottom, left; or a measured user order, which put straight-top first) | Imhof 1975; Christensen, Marks & Shieber 1995; arXiv 2407.11996 | Used as the first tier by three of four earlier placers |
| S3 | **Rings of straight leaders**, nearest home first, each ring tried only when nearer ones fail | ESRI Maplex ("first attempt to place in an area of free space"); QGIS PAL | Used by all four earlier placers; one built a ring only when a search could still afford it |
| S4 | **Pipe labels along the pipe, either side, sliding from the middle**, level only as the fallback | Imhof's line rules; MapLibre line placement; R14 | The two placers that did this left 6-9% of close-zoom pipe labels level with room to turn; the two that did not, about 78% |
| S5 | **Unwrap a stack to one line, or wrap a line to a stack**, when that uses the ground better | Hint H-a; Tom's Q07 | Two earlier placers, at a small extra cost per change |
| S6 | **A column (gang) hung on its shared edge, growing toward open ground**, its labels ordered by the angle of their owners, so the leaders fan out and never cross (two leaders cross only when the upper label belongs to the lower node) | Hint H-c; Tom's sketch of 2026-09-08, step 4 | Not built by an earlier placer as such |
| S7 | **`spot_prime` and `box_est`**: find the best patch of open ground near the labels that need it (`spot_prime`), size a box for n stacked labels in it (`box_est`), then seat those labels in it by angle (S6) | Tom's sketch of 2026-09-08, below | Never given a full try. Step 1 can start from S1. Tom asked on 2026-09-21 why it had not been: *"I don't understand why we are spending effort on the rings model instead of giving the spot-prime box model a good college try."* |

**S7 in Tom's words** (2026-09-08): *"Geometry awareness might involve (1) identifying a prime
spot_prime of open real estate (n labels could stack here!) near failures or needs, (2) identifying
the estimated box_est extents for the n stacked labels in the spot_prime location, (3) gathering
angles and distances from the middle left point leftward or middle right point rightward of box_est
to the set of n closest failed or needy nodes to these points combined, (4) using the angles to
determine the placement of failed or needy labels inside box_est."* On finding it cheaply: *"a
tile-indexed spot_prime list can be pre-calculated and stored in the form of centroids and extreme
boxes (for fully bounded prime spots) and angles (for edge prime spots). By extreme boxes I mean that
three boxes can be pre-calculated for every bounded spot_prime: Tallest skinny box, widest squat box,
and biggest spot_prime_box_square, where the size of spot_prime_box_square tells us how to limit
skinny and squat dimensions."* And: *"I waved my wand over finding spot-prime; if it's hard, let me
know."*

### 2.2 How to know a spot is free (indexes)

| ID | Strategy | Source | Measured so far |
|---|---|---|---|
| S8 | **Uniform grid of obstacles**, cells about one label high | MapLibre CollisionIndex (30 px cells) | One earlier placer; `room-check.js` itself |
| S9 | **Raster with summed-area tables**: "is this rectangle clear?" in four reads | Luboschik, Schumann & Cords 2008 (particle-based labeling) | Two earlier placers, one with a fixed raster and a second for seated labels |
| S10 | **A trellis with no preprocessing** | Mote 2007 | Not tried |

### 2.3 In what order (the order problem)

| ID | Strategy | Source | Measured so far |
|---|---|---|---|
| S11 | **Smallest form first, then grow** a value at a time in rounds, so every label gets a place before any label gets a second value | Priority-ordered greedy (Christensen et al. 1995); rule G | Three earlier placers. The same plain search placing labels from an empty map showed 78% of labels in this order and 70% when each label took as many values as it could in turn: eight points from the order alone |
| S12 | **Most crowded first** | Common greedy heuristic | All four earlier placers |
| S13 | **Carry last view's spot** when it is still legal; move only when that buys something | Been, Daiches & Yap 2006; MapLibre persistent identity | Three earlier placers. Not a rule (there is no stillness rule); it saves time and churn |
| S14 | **Two-SAT existence check**: in a two-position model, is a full labelling possible before anything is dropped? | Standard result: with two positions per label, each label is one yes/no choice and each conflict a two-term clause, solvable in linear time | Not tried |

### 2.4 Repair after a first layout

| ID | Strategy | Source | Measured so far |
|---|---|---|---|
| S15 | **Room-check repair pass**: after your layout, for each hidden label ask `findSpot` for free ground for its smallest form, seat it, `addPlacement` it so the next label sees it, then let the seated labels grow. Refuse ground under another label's leader and a leader through another label's text, which the plain search allows | The R1 self-test, used as a placer | Bolted onto each of four earlier placers, on 32 networks: more labels on every network, +2 to +7 per 100 asked for, at about one label-on-leader crossing per 100 labels shown. Used alone from an empty map it showed more labels than any of the four, but laid pipe labels level and remembered nothing between zooms. One caution: a repair bolted on from outside must hand your placer its own previous layout as `prev`, or be built inside it |
| S16 | **Eviction**: a hidden label may push one or two blocking neighbours elsewhere, even with fewer values, when that shows more in all | QGIS PAL `chainSearch`; discrete gradient descent (Christensen et al. 1995) | Two earlier placers (one neighbour; up to two) |
| S17 | **Local polish**: each label re-seats itself to cut crossings | Discrete gradient descent | One earlier placer |
| S18 | **Conflict graph, then the three elimination rules, then a heuristic** | Wagner, Wolff, Kapoor & Strijk 2001; maximum independent set (Formann & Wagner 1991) | Not tried |
| S19 | **Simulated annealing, in pauses only** | Christensen et al. 1995; Edmondson, Christensen, Marks & Shieber 1996 | Not tried; seconds, so only in idle time |

### 2.5 Time

| ID | Strategy | Source | Measured so far |
|---|---|---|---|
| S20 | **A per-zoom lookup table built in pauses**: spots kept as offsets from their anchors at a ladder of zooms, checked rather than searched when the view settles | Hint H-b; Been et al. 2006 (a labelling as a function of scale) | One earlier placer; it never took a view over one second |
| S21 | **Anytime layout bounded by time, never by count**: show what is placed, keep improving (R10) | R10 | **Caution, measured:** two earlier placers capped their work per layout, and so hid a few far labels because of how many others there were (R1's second half), which a time bound does not do |

Add your own. The best new ones join this table next round, with their numbers.

---

## 3. What we ask back: your strategy card

With your placer, commit `STRATEGY.md` beside it, at most two pages:

1. **The recipe**: which entries you combined (by ID), in which order of passes, and any strategy of
   your own, described so another builder could build it.
2. **Why**: for each ingredient, what it bought, measured with `run.js --room` on the public scenes
   **with that ingredient switched off** (one row per ingredient: labels shown, values shown, hidden
   with room, crossings, time). Leave each ingredient switchable so the judges can re-run it.
3. **What you tried and dropped**, and why.

The judges re-measure your rows on scenes you have not seen and publish both.

---

## Sources

- Imhof, *Positioning Names on Maps*, The American Cartographer 2 (1975) 128-144.
- Christensen, Marks & Shieber, *An Empirical Study of Algorithms for Point-Feature Label Placement*,
  ACM TOG 14(3) 1995.
- Edmondson, Christensen, Marks & Shieber, *A General Cartographic Labeling Algorithm*, Cartographica
  33(4) 1996.
- Wagner, Wolff, Kapoor & Strijk, *Three Rules Suffice for Good Label Placement*, Algorithmica 2001.
- Formann & Wagner, *A packing problem with applications to lettering of maps*, SoCG 1991.
- Been, Daiches & Yap, *Dynamic Map Labeling*, IEEE TVCG 12(5) 2006.
- Mote, *Fast Point-Feature Label Placement for Dynamic Visualizations*, Information Visualization
  6(4) 2007.
- Luboschik, Schumann & Cords, *Particle-Based Labeling*, IEEE TVCG 14(6) 2008.
- *From Top-Right to User-Right: Perceptual Prioritization of Point-Feature Label Positions*, arXiv
  2407.11996.
- ESRI Maplex placement properties; QGIS PAL; MapLibre Style Spec and Collision Detection notes.
- Penn State GEOG 486, *Label Placement* (restates Imhof's line rules).
