# Cartographic label placement: what the standard methods are

Reference for `dev/label-placement-goals.md`, which is the spec. This file is the survey the spec
stands on: the named algorithms, what each buys, what each costs, and which of them we are using.
Written 2026-08-16, after Tom asked that we check the literature rather than keep inventing.

**One sentence of context that changes how the rest reads:** our pass re-runs on every frame of a
drag, on a drawing that can carry a thousand labels. That budget — tens of milliseconds — is what
picks the method. Christensen, Marks and Shieber's own conclusion is that the right algorithm
*depends on the computational budget available*, so "which is best" has no answer without it.

---

## 1. The pipeline everybody uses

QGIS's PAL engine is the clearest published statement of the shape, and it is the shape to hold in
your head:

```
candidates → costs → obstacles → conflicts → eliminate hard conflicts
           → fast first approximation (init_sol_falp) → bounded local search (chainSearch)
           → solution + THE UNLABELLED SET
```

We have candidates, costs and obstacles. We have no conflict structure, no first approximation, no
bounded search, and — until Tom's 2026-08-16 phases — no unlabelled set. **What we built is the end
of this pipeline without its beginning.**

The two ends are not interchangeable. A scorer with no first approximation cannot be budgeted: it
does the same work whether the drawing is crowded or empty. A first approximation with no search
cannot recover from a bad early commit. The published engines run both.

---

## 2. Point-feature label placement (PFLP)

**Imhof, "Positioning Names on Maps," *The American Cartographer* 2 (1975): 128–144** is the
convention layer everything else sits on. His position preference for left-to-right scripts is
**top-right > right > top > bottom > left**, argued typographically: ascenders are commoner than
descenders in Latin script, so a name set above reads as closer to its point.

`DEFAULT_LABEL_OFFSET = {x: 2, y: -2}` means **top-right is already our home position.** That was not
arrived at from Imhof, but it agrees with him.

**Worth knowing before hard-coding it:** "From Top-Right to User-Right" (arXiv 2407.11996) measured
user preference as **T > B > R > TR > BR ≥ L > TL > BL** — straight-top beat top-right. Not
actionable while we offer two positions; it is the obvious third position when we offer three.

The literature's most common candidate set is the **8-position model** (TR, T, TL, L, BL, B, BR, R),
then 6, then 4.

### The comparison everyone cites

**Christensen, Marks & Shieber, *An Empirical Study of Algorithms for Point-Feature Label Placement*,
ACM TOG 14(3), 1995, 203–232** (MERL TR94-12 is the tech report). It proves PFLP and most of its
variants **NP-hard**, then compares, at four candidate positions per point:

| method | mechanism | cost | ours? |
|---|---|---|---|
| random | pick a position | trivial | no |
| **greedy / priority-ordered first-fit** | sort, place each in the first non-conflicting position | O(n·k) against an index | **Phase 1** |
| Hirsch (1982) continuous gradient descent | push labels along a continuous gradient | slow, mediocre | this is what `relax()` was, and it was retired |
| Zoraster (1990) | integer programming with Lagrangian relaxation | slow | no |
| **discrete gradient descent** | repeatedly move a conflicted label to its best alternative | O(sweeps·n·k) | a capped version is a good post-pass |
| **simulated annealing** | random label→random position, Metropolis acceptance | seconds | idle/settle only |
| exhaustive | quality bound | exponential | benchmark only |

The finding that matters: **simulated annealing buys the best quality and costs seconds; discrete
gradient descent gets close for a fraction of it.** Nobody should reach for annealing inside a drag.

### The best quality-per-millisecond classical method

**Wagner, Wolff, Kapoor & Strijk, "Three Rules Suffice for Good Label Placement," Algorithmica
2001.** Build the conflict graph over *candidates*, then apply three elimination rules that provably
shrink the candidate set **without reducing the size of an optimal solution**, then run a heuristic
on what is left. Measured close to simulated annealing at a small fraction of the cost, and
near-linear once the graph is built.

**This is what our Phase 3 should be**, and it is the reason the conflict graph is not an optional
nicety: the rules are defined on it.

### The interactive branch

- **Mote, *Fast Point-Feature Label Placement for Dynamic Visualizations*, Information Visualization
  6(4), 2007** — a geometric de-confliction "trellis" strategy with **no preprocessing phase**,
  reported at multiple frames per second on tens of thousands of nodes.
- **Luboschik, Schumann & Cords, *Particle-Based Labeling*, IEEE TVCG 14(6), 2008** — fill the image
  with conflict particles where labels must not go, then place by raster query. Real-time.

---

## 3. Production practice

### ESRI Maplex — the vocabulary to steal

Maplex is a vocabulary, not an algorithm; ESRI does not publish the search. But its decomposition is
the best available and users recognise its names. Four property groups, framed as four questions:

- **Label Position** — where does the label go?
- **Fitting Strategy** — what may be done *to* the label to make it fit?
- **Label Density** — remove duplicates, repeat along line, minimum feature size.
- **Conflict Resolution** — who wins a contested space?

**THE THREE NUMBERS, WHICH WE CONFLATE INTO ONE. This is the most clarifying paragraph in the whole
survey.**

| Maplex term | means | ours |
|---|---|---|
| **Label priority** | the order label classes are *attempted* in | **did not exist** — this is Tom's new priority column |
| **Label weight** | how much a placed label resists being pushed out | does not exist |
| **Feature weight** | how much a map feature resists being *covered*, 0–1000, where 0 means "treat as free space" and 1000 means "hard obstacle" | `GOAL_WEIGHT` in `js/lpn-collide.js` — **and it is only this** |

A later reader will be tempted to fold the priority column into `GOAL_WEIGHT`. It is a different
number on a different axis and must not be merged.

Maplex's documented order of operations: *first attempt to place in an area of free space*; if
overlap is unavoidable, choose *the location with the lowest total feature weight*. The Standard (non-
Maplex) engine uses the cruder invariant *"a feature cannot be overlapped by a label with an equal or
lesser weight."*

**The Fitting Strategy cascade is the named standard for a label that will not fit:**

```
stack → feature overrun → font-size reduction → abbreviation → key numbering
```

applied in the listed order, with the engine permitted to permute that order if a different one
places more labels. Our Phase 2 cascade is this one with the rungs we do not have removed —
**shed trailing values → drop the label** — and the shed step is our own extension, not a
cartographic standard. Say so wherever it is documented.

Offsets come as a **Preferred offset** and a **Maximum offset**: honour the preferred one, fall back
within the maximum.

### QGIS PAL

Two phases, candidate generation and optimisation. `pal::Problem` exposes `reduce()`,
`init_sol_falp()` (the fast first approximation) and `chainSearch()` (documented as a very-large-scale
neighbourhood search — discrete gradient descent that moves a *chain* of labels per step, and
naturally *anytime*, so it can be budgeted per frame). `getSolution()` returns the placed set and the
list of unlabelled features.

User-facing: a **Position priority** list for point placement; Parallel (Above/On/Below) vs Curved vs
Horizontal for lines; **repeating label distance**; **label overrun distance**; per-feature **obstacle
factor** (1.0 default, <1 more coverable, >1 less); overlap policy Never / Allow if required / Allow
without penalty; a data-defined **Always show**.

### Mapnik

`placement-type: dummy | simple | list`, and for simple a `placements` string such as
**`"N,S,15,10,8"`** — try north, then south, then retry at 15/10/8 px. That is a position cascade and
a font-reduction cascade in one string, and it is the cleanest published encoding of the idea.
`max-char-angle-delta` defaults to 22.5°; `halo-radius` defaults to 0 with `halo-fill` white.

### MapLibre / Mapbox GL — the proven 60 fps recipe

- **CollisionIndex over a GridIndex with 30 px cells**, chosen by profiling as roughly the smallest
  size at which the collision geometry for 16 px text fits in one cell. Ours is a uniform grid too
  (`grid()` in `js/lpn-collide.js`), sized to the query radius.
- **Point labels collide as rectangles; line labels collide as a series of circles following the
  line**, because circles are unaffected by rotation. We use oriented boxes instead, which is the
  other correct answer and keeps the depth.
- Order is `symbol-sort-key` — lower is placed first. That is label priority under another name.
- `text-variable-anchor` is literally the 4/8-position model exposed as a style property: *an array
  of anchor locations attempted in order*. `text-optional` drops the text but keeps the icon — the
  closest published analogue to dropping *part* of a label.
- **Stability is not solved by a stable optimum.** Each symbol carries a `crossTileID` that persists
  across zoom levels, and opacity is animated between 0 and 1 over `fadeDuration`. Popping is solved
  by fade.

---

## 4. Line features

Imhof's rules, as restated by Penn State GEOG 486: labels follow the line but do not cross
perpendicular lines; **place above the line rather than below**; never upside down; repeat
periodically on a long line, at an interval set by map density.

We follow all of these. `alignedLabelAnchor()` in `js/lpn-geom.js` normalises the reading angle
before offsetting — which is what keeps "above" meaning above after the 180° readability flip — and
`linkLabelStations()` does the repeat.

Engines' knobs: QGIS Parallel/Curved/Horizontal plus repeat distance and overrun distance; Mapnik
`spacing`, `minimum-distance`, `upright`; MapLibre `symbol-placement: line | line-center`,
`symbol-spacing` 250 px, `text-max-angle` 45°. Maplex adds dedicated street, river, contour and
boundary styles.

---

## 5. Leaders and callouts

**The drafting standards attach a leader to a text LINE, not to a corner.**

- **ASME Y14.2 (Line Conventions and Lettering), leader clause §4.9.3:** a leader should be a straight
  inclined line *except for a short horizontal portion extending to the centre of the height of the
  first or last letter* of the note. Leaders shall not cross, shall not be excessively long, and
  shall not be vertical or horizontal.
- **ISO 128-22:1999:** a **reference line** (the horizontal landing) may be added to each leader,
  drawn in a reading direction of the drawing, either a fixed **20 × its line width** or adapted to
  the length of the instruction; text sits above it, clear by at least twice the line thickness.
- **AutoCAD MLEADERSTYLE** calls the landing the *dogleg* and enumerates attachments — "Middle of top
  line", "Middle of multiline text", "Middle of bottom line", "Bottom of top line", and so on.

**The GIS engines do something different.** QGIS callouts offer Simple / Manhattan / Curved / Balloon
and attach at the label's **closest point** or a chosen fixed corner, with no landing and an "offset
from label area". ArcGIS Pro adds a **leader tolerance** — *the minimum distance between the anchor
point and the text at which the leader appears* — below which no leader is drawn at all.

**So "nearest middle-of-text-line corner" is a blend of the two, and only half of it is standard.**
Corner attachment is QGIS behaviour. The defensible synthesis for a network drawing, and what
`dev/label-placement-goals.md` specifies:

> Choose the label-box side facing the node. Run a short horizontal landing whose length is a stated
> multiple of the stroke width. Attach that landing at the vertical centre of the **first** text
> line. Suppress the leader below a leader tolerance.

We already have the tolerance: `leaderThreshold()` in `js/looped-network.js` is ESRI's leader
tolerance under a different name. We have neither the landing nor line attachment — today the leader
meets the box's near vertical edge at the box's *vertical centre*, which on a five-line node label
points at the middle row.

---

## 6. Conflict graphs, exact methods, and stability

| formulation | mechanism | complexity | for us |
|---|---|---|---|
| **Maximum independent set** (Formann & Wagner, SoCG 1991) | vertices = candidates, edges = overlaps, pick the largest non-conflicting set | NP-hard; the 4-position decision problem is NP-hard | the right *model*, never solved exactly per frame |
| **ILP / branch-and-cut** (Verweij & Aardal, ESA 1999) | optimise over the MIS polytope | seconds to minutes | an offline "clean up this layout" button, if ever |
| **2-SAT** | in a **two**-position model each feature is one boolean and each conflict a 2-clause | linear | interesting precisely because Phase 1 *is* a two-position model — a 2-SAT pass could tell us whether a conflict-free labelling exists at all before we drop anything |
| **Wagner–Wolff three rules** | provably optimum-preserving candidate elimination, then a heuristic | near-linear after the graph build | **Phase 3** |

### Keeping a labelling stable while the user navigates

**Been, Daiches & Yap, "Dynamic Map Labeling," IEEE TVCG 12(5), 2006** states the desiderata for
interactive maps. The three that bind us:

1. Labels do not vanish when zooming in, nor appear when zooming out.
2. Labels do not jump — position varies continuously with the view.
3. **The labelling is a function of SCALE ONLY, not of pan position.**

**We violate (3) by construction today.** `drawnLinkLabelStations()` culls to the current view
rectangle and `placeStationedLabels()` builds obstacles from the result, so the obstacle set — and
therefore every node label's placement — depends on where the user has scrolled to. It is currently
invisible because pan perturbs *positions*, which nobody can see. **Once dropping is in scope it
perturbs visibility, and labels will appear and disappear as you scroll.** That is why the bench has
a `flips under pan` readout that must read zero.

**And (1) and (2) are not solved by chasing an exactly stable optimum.** MapLibre's answer is the
practical one: a persistent per-feature identity plus an opacity fade. Ours is the neighbourhood
term `k`, which smooths the score field so its minimum moves less — the same idea, less directly.

The rule of thumb every interactive-labelling paper repeats, and Cesium's declutter roadmap states in
as many words: **do not snap a label into a new place; move it there over several frames.**

---

## 7. Halos and text buffers

- **Mapbox caps text halo width at ¼ of the font size.** That is the closest thing to a numeric
  industry convention.
- **We are inside it.** `css/engcalcs.css` sets `paint-order: stroke fill` with
  `stroke-width: 0.2em; stroke-linejoin: round`. A centred stroke puts **0.1em outside the glyph** —
  well under the cap, with the round join every engine uses. **This item needs no change**, and the
  `em` unit is load-bearing: it keeps the halo proportional to the lettering at every text size, which
  is what `alignedLabelPlacement()`'s gap arithmetic assumes.
- QGIS's buffer adds an "outlined text" variant (uncheck *colour buffer's fill*) — that is the
  knockout/mask form. ESRI's guidance is that a halo should *clean up small pieces of line showing
  between letters while masking as little of the underlying map as possible*.

**The division of labour every engine shares and we never wrote down:**

> **Halos handle label-over-linework. Collision detection handles label-over-label.**

No engine lets a halo excuse a label–label overlap: MapLibre still collides haloed text, Maplex still
weights features. That is the independent justification for `labelLink` sitting at the bottom of our
rank ladder — a pipe behind a haloed number is already legible, so the pass should not spend a good
position avoiding one.

---

## 8. What our own conflict graph actually holds (Task 539, phase one)

Everything above is what other people found. This section is what OUR drawings measure, because Task
539's gang move is the first pass that would optimise a PAIR, and the one thing nobody had was the
size of the problem. Tom, 2026-08-26: *"I don't want to be forever tweaking this."* So the count came
before the remedy.

**The two triggers are his**, same day: *"if two leaders cross or if a label crosses a leader, try
stacking their labels."* `Collide.labelCrossings()` (`js/lpn-collide.js`) is exactly those two over
the DRAWN labels, and `dev/lpn-spike/label-crossing-harness.js` runs it on every shipped example, one
example per process, because a second document loaded into a page that already holds one inherits
its elements' measured widths and its label state. (Until §11 there was a second reason: the shed
seeded node labels from the last layout, so the pass carried state from one layout to the next.)

Flagged pairs at zoom-to-fit and at 2x / 4x / 8x in from it, every label field on, solved through
EPANET:

| example | labels drawn (fit → 8x) | pairs | gangs |
|---|---|---|---|
| Net3-Novato-CA-World | 56 → 175 | 8 / 18 / 10 / 3 | 7 / 15 / 10 / 3 |
| Net3 (XY) | 73 → 188 | 13 / 7 / 5 / 1 | 10 / 5 / 5 / 1 |
| Elm-Street-Center | 39 → 48 | 5 / 3 / 1 / 1 | 4 / 3 / 1 / 1 |
| Net2 | 44 → 81 | 5 / 0 / 0 / 0 | 4 / 0 / 0 / 0 |
| Net1 | 25 → 27 | 1 / 1 / 0 / 0 | 1 / 1 / 0 / 0 |
| Basic example, either unit set | ~20 | 0 throughout | 0 |

**Three findings, and the second is the one that changes the design:**

1. **The size is right for Tom's own reading.** At the fit zoom Net3-World holds exactly five gangs
   made only of node labels — four pairs and one triple — which is the shape he marked on his
   screenshot (A–E, four pairs and one three-label cluster). It is suggestive rather than proof: the
   zoom and label settings behind that screenshot are not recorded.
2. **The second trigger does almost all the work.** Across the 28 measured drawings there are **9
   leader-leader crossings against 76 label-on-leader**. The cheap segment-intersection test — the
   obvious first phase, and the one the task originally proposed on its own — sees about a tenth of
   what a reader sees. A gang move tuned against leader crossings alone would be tuning against the
   rare half.
3. **The count is a fact about a VIEW, not about a drawing.** Net3-World's node-only gangs run 5, 11,
   9, 1 across the four zooms, and Net2 goes from 5 pairs at the fit zoom to none at every zoom in
   from it — as labels spread out, fewer are near enough to conflict, and fewer of them are far
   enough from their node to draw a leader at all. So phase two is judged on one stated view before
   and after, never on "the drawing".

**What phase two therefore knows that it did not:** the graph is small (single figures per view, in
components of two and three), it is dominated by label-over-leader rather than by crossed leaders,
and it is measurable per view — which is what makes "stack the gang and re-measure" a decidable
experiment rather than a matter of taste. No absolute target is needed and none is asserted; the
harness asserts the pure cases and prints the live numbers.

---

## 9. Tom's phase-two sketch, 2026-09-08, verbatim

He raised Task 539 to 100 the same day with a deadline on it (*"If we are going to try to squeeze
this distraction in before 17 Sep, It's now or never. May as well give it a try. If in the process
we need to re-open the dev control knobs, we can."*), and then set out a method at length. It is
recorded here rather than in the roadmap because of its length, and verbatim because it is a
DESIGN and not a preference — a paraphrase would lose the parts that make it buildable.

**He named two routes and asked for both to be tried.** *"For this task, we can try to be smart
about geometry or we can just add another trick to our brute force hunting, where the trick is to
notice overlapping leaders and labels and respond to it by trying successive stacking orders. We
could scientifically try both approaches to see which works better. I intuit that if we are smart
enough about geometry, it would be the better approach or a key to optimizing the brute force
effort."*

**The brute-force route in one line** is §8's crossing detector wired to a retry: where
`Collide.labelCrossings()` flags a pair, try successive stacking orders for that pair and keep the
order with the lowest count. It needs nothing that is not already built, and it is the control the
geometry route is measured against.

### 9a. The geometry route, his four steps, verbatim

*"Geometry awareness might involve (1) identifying a prime spot_prime of open real estate (n labels
could stack here!) near failures or needs, (2) identifying the estimated box_est extents for the n
stacked labels in the spot_prime location, (3) gathering angles and distances from the middle left
point leftward or middle right point rightward of box_est to the set of n closest failed or needy
nodes to these points combined, (4) using the angles to determine the placement of failed or needy
labels inside box_est."*

Step 4 is the whole gang idea made concrete and is worth restating in our own words because it is
easy to miss: **the labels are ordered inside the stack by the ANGLE of the node each one belongs
to**, which is exactly what makes their leaders fan out instead of cross. Two leaders cross when
the upper label belongs to the lower node; sorting the stack by angle is the condition that cannot
happen.

### 9b. Finding `spot_prime`, and his own flag on it

*"I waved my wand over finding spot-prime; if it's hard, let me know."* **So this is the one part
he has not specified and the one part to report back on.** It is BUILT now and section 12 is the
report; what follows is the sketch it was built from. His proposal for making it affordable:

*"the good news is that a tile-indexed spot_prime list can be pre-calculated and stored in the form
of centroids and extreme boxes (for fully bounded prime spots) and angles (for edge prime spots).
By extreme boxes I mean that three boxes can be pre-calculated for every bounded spot_prime:
Tallest skinny box, widest squat box, and biggest spot_prime_box_square, where the size of
spot_prime_box_square tells us how to limit skinny and squat dimensions."*

### 9c. His sizing method, verbatim, and the one number it produces

*"(a) We can precalculate by trial and error (cheap because we do it as the network grows where
possible) the universal text_size_largest_perfect_fit at which a single-line label for every node in
the network can fit either into a spot_prime_box_square or an edge direction (much easier) without
breaking any of our 'perfect world' rules including leaders crossing links or symbols. We could
(phase 2 or by selector) do the same for multiple line node labels, up to 3, 4, or 5 lines) (b)
using the text_size_largest_perfect_fit array, we can calculate the height of a single label, and we
can very roughly guess the length/width of a single label, maybe using current node label settings
for drop order and possibly display (and we could recalculate this when node display settings
change). (c) We set each skinny equal to its length/width and each squat to its height, and from
those we calculate/find/iterate tall and wide, all in advance of zooms, and all only once for the
network."*

**`text_size_largest_perfect_fit` is the interesting object in the whole sketch**: a single scalar
per network at which every label places without breaking a rule. It is a property of the DRAWING
rather than of a view, which is what lets his last clause hold — *"all in advance of zooms, and all
only once for the network"*.

### 9d. What is settled and what is not

- **Settled**: both routes get built and measured against each other; §8's per-view crossing count
  is the measurement; the dev control knobs may be re-opened for the experiment.
- **Was not settled, and was his own flag**: how `spot_prime` is found. Answered by section 12; the
  tile-indexed precomputation and `text_size_largest_perfect_fit` are the two clauses that were
  NOT built, each with a reason there rather than a shrug.
- **Not stated either way, and now decided**: it is a REPAIR PASS after `shedAlignedForConflicts()`
  and after every other placement, which preserves every measurement in §8. See §10.

---

## 10. What phase two built, and what the two routes measure (Task 539, 2026-09-09)

Both routes are built, both are measured, and they are one function:
`Collide.repairCrossingGangs()` in `js/lpn-collide.js`, called from `runLabelCollisionAvoidance()`
after every other placement pass. `dev/lpn-spike/label-gang-harness.js` runs a shipped example five
times over -- repair off, brute alone, gang alone, both, and both plus §11's shed, which is what
ships -- and prints the columns side by side;
`dev/lpn-spike/label-crossing-measure.js` is the measurement both label harnesses share, so there is
one sample and not two.

**It is a REPAIR PASS, per §9d.** Nothing that placed a label before it changed, so every number in
§8 is still the "off" column of the table below.

### 10a. The table. Pairs per view, every label field on, solved through EPANET

Each cell is the four views in order: zoom-to-fit, then 2x, 4x and 8x in from it. **Re-measured
2026-09-09, twice: once after §11d found the harness reading the first-fit's boxes beside the DOM's
repaired leaders, and again after §11b took the shed's memory of the last layout away, which moved
every drawing. Neither earlier set of numbers describes the drawing that ships.**

| drawing | off | brute | gang | both |
|---|---|---|---|---|
| Net3-Novato-CA-World | 7 / 20 / 12 / 5 | 7 / 14 / 8 / 4 | 5 / 12 / 9 / 3 | **5 / 10 / 6 / 2** |
| Net3 (XY) | 14 / 7 / 4 / 1 | 14 / 6 / 2 / 0 | 7 / 6 / 1 / 1 | **7 / 6 / 0 / 0** |
| Net2 | 4 / 1 / 0 / 0 | 3 / 0 / 0 / 0 | 4 / 1 / 0 / 0 | **3 / 0 / 0 / 0** |
| Net1 | 1 / 1 / 0 / 0 | unchanged | unchanged | unchanged |
| Elm-Street-Center | 3 / 2 / 1 / 1 | unchanged | unchanged | unchanged |
| Basic example, either unit set | 0 throughout | 0 | 0 | 0 |
| Net1 | 1 / 1 / 0 / 0 | unchanged | unchanged | unchanged |
| Elm-Street-Center | 3 / 2 / 1 / 1 | unchanged | unchanged | unchanged |
| Basic example, either unit set | 0 throughout | 0 | 0 | 0 |

**Five findings, and the third is the one that decided the design:**

1. **The count falls on the drawing Tom marked.** Net3-World at the fit zoom goes 7 pairs to 5, and
   over its four views 44 to 23. Net3 (XY) goes 26 to 13 over its four. That is the comparison §8
   asked for and the strategy passes it. It is not enough for the target §11 records him setting,
   which is why there is a §11.
2. **The two routes fix different drawings, and neither dominates.** At the fit zoom of Net3-World
   the gang route alone takes 7 to 5 and the brute route alone takes 7 to 7; at 2x the brute route
   alone takes 20 to 14 and the gang route alone takes it to 12, and together they reach 10. His
   intuition that geometry would be "the better approach or a key to optimizing the brute force
   effort" is half-confirmed: on the view he was looking at, geometry is the whole of the gain.
3. **THE MODEL AND THE DRAWING HAVE TO AGREE ABOUT WHAT IS ON THE MAP, and getting that wrong is
   worth more than either route.** The first working version RAISED Net3-World's fit-zoom count from
   7 to 9, because the repair counted pipe labels that `yieldStationedLabels()` was about to hide,
   and moved good labels to clear conflicts no reader would ever see: 11 pairs in the model against
   7 on the screen. Two corrections, in this order, and after both the model reproduces the drawn
   count exactly on every view of Net3-World:
   - a yielding label is on the map only while no node label is standing on it, asked PER TRIAL,
     because a move that lifts a node label off a pipe label reveals it and a revealed label can be
     crossed;
   - `hiddenShort` is written at render time and describes the PREVIOUS layout. Reading it wrote off
     60-odd pipe labels at the 2x zoom that this layout draws, and turned the over-count into an
     under-count.
4. **A hand-placed label is never touched, and that is why Elm-Street does not move.** 14 of its 18
   node labels carry `lx`, so they are the user's; the repair declines them all and its flagged
   pairs stand in every mode. That is the correct answer, not a shortfall.
5. **A view could come out one pair worse while the drawing came out better** -- Net3 (XY) under the
   gang route alone ran 15/8/5/1 to 12/9/3/1, because the zooms are read in sequence and the shed
   seeded each pass from where the last layout put things. The harness asserts no rise over the four
   views together and prints the per-view rises rather than hiding them. **§11b ended that coupling,
   and this section's own table is the re-measurement: no view rises on any example in any mode.**
   The aggregate form is kept anyway, because it is the promise the repair actually makes, and a
   per-view rise coming back is the signal that something upstream is remembering again.

### 10b. What the scorer will not do, and the two costs

- **A trial may not spend a hard overlap to buy a crossing.** A crossed leader is ugly; a number
  printed on a node symbol or on another label is unreadable. Blocked and label-on-label are a
  GATE at the layout's own level, and the crossing count is the ranking inside what that gate
  allows. Ranked the other way round -- crossing first, overlaps as a mere cost -- the repair bought
  back, one gang at a time, exactly what the first-fit had refused.
- **BOTH ROUTES RUN ON EVERY PASS, DRAG FRAMES INCLUDED, and the cheaper split was tried and
  reverted.** Giving a drag frame the gang route alone looks free -- it re-deals slots the first-fit
  already found room for, so it costs a handful of layouts per gang -- but it cannot reproduce a
  side the brute route chose, and `dev/lpn-spike/node-yield-harness.js` failed at once: 34 node
  labels moved between a content pass and the frame after it. That harness holds the ruling that a
  node label's place is a pure function of the drawing, and on screen the same thing is a label
  springing back for the length of a drag and landing again on the way out.
- **The measured cost on an idle machine is 1-3 ms a pass on the small examples and 16-69 ms on
  Net3-World with every field on**, against 25-90 ms for ONE of the four to six
  `placeLabelsFirstFit()` calls that same pass already makes for the shed cascade. The first pass in
  a process runs several times that and is the JIT, not the drawing. Both figures are Node with the
  DOM stub, so they are indicative and not a browser measurement -- and on a loaded machine they
  swing by a factor of four, which is worth knowing before anybody re-measures and panics. Three
  things got the pass there from 2.3 s: score against the gang's own
  neighborhood rather than the whole drawing (exact, because everything a member can reach is
  inside its own radius); cache each label's boxes, its obstacle verdict and its leader length per
  candidate endpoint, since nothing but the gang moves during a search; and put one circle round a
  whole staircase before asking sixteen oriented-box questions about it.
- **The cartesian product is bounded, and the bound is not a truncation.** Every combination while
  there are at most 64 of them, and above that two rounds of one-member-at-a-time. Cutting the
  odometer off at N would vary the first member and never the last, so the third label in a gang of
  three would silently never be tried.

### 10c. `spot_prime` is NOT built, and this is the report he asked for

§9b is unbuilt by design: *"I waved my wand over finding spot-prime; if it's hard, let me know."*
It is hard, but that is not the reason to stop. **The reason to stop is that phase two got its gain
from the half of his sketch that needs no `spot_prime` at all** -- step 4, the angle ordering --
because a gang's existing slots are open ground the first-fit has already found. Everything below is
what a build would have to answer, so the decision is his and not a shrug.

**What finding it would take, and the three things that make it a real build:**

1. **Free space is a per-VIEW quantity, and his "once for the network" is where the sketch and §8
   part company.** §8's third finding is that the crossing count is a fact about a view: link labels
   appear, shed and vanish with the zoom, and a stationed label yields to a node label placed this
   pass. So the obstacle field a `spot_prime` index would describe is not stable across zooms, and a
   tile-indexed precomputation gives an index of the DRAWING, not of the view being labeled. It
   would still be worth having -- it bounds where to look -- but it cannot be the answer on its own.
2. **The search itself is the standard one and is not novel work**: largest empty rectangle over an
   obstacle set, or the raster form Luboschik's particle-based labeling uses (§2), which is closer
   to what this page could afford. His three extreme boxes per spot -- tallest skinny, widest squat,
   biggest square -- are exactly the shape a rectangle search returns, so his framing is right.
3. **`text_size_largest_perfect_fit` is the largest item in the sketch and is separable.** It is a
   search over the whole drawing, at several text sizes, for the size at which every label places
   without breaking a rule. That is a different feature from the gang move -- it is an automatic
   text size -- and it should be judged on its own merits rather than ridden in on this task.

**What the numbers say about whether it is worth it, and phase three weakened the case rather than
strengthening it.** The pairs that remain after phase two are 5 at the fit zoom of Net3-World and 7
on Net3 (XY); §11 drives all of them to zero by hiding one of each, at 2 to 9 labels a view. **So
what a `spot_prime` search would now buy is not fewer crossings -- there are none -- but fewer
HIDDEN LABELS**, which is a real gain and a much smaller one than the case this section was written
against.

**THAT RECOMMENDATION WAS OVERTAKEN, AND §12 IS THE BUILD.** Tom, 2026-09-15: the MODEL is the
asset, and a count already at zero cannot say whether the placement is good. The measurement this
paragraph asked for -- how many hidden labels had open ground the candidate list did not offer --
turned out to be cheaper to take by building the search than by proxying it, and the answer is 6 of
the 44 across the 28 views. §12 has the numbers and the three ways the first build reported
nothing.

---

## 11. Phase three: the target is ZERO, the last remedy is hiding, and the layout must not move (Task 539, 2026-09-09)

Tom, reading §10's table: *"539: If I hear you right, 539 only cleaned up 12 of 43 leader conflicts.
Is that right? If so, we have a long way to go, and my inclination is that if there are crossing
leaders we need to hide one. The count has to get down to 0. We have to know what we are doing here,
and not show them if we can't show them beautifully."*

**That supersedes §10's framing.** Phase two was measured as a comparison against itself; phase three
is measured against an absolute number he set. And the second half of his sentence is the principle:
a hidden label is a deliberate, correct outcome here, not a failure. This page already sheds values
off a label, yields ground between labels, and drops a label it cannot place — hiding is an existing
idiom and this is the terminal rung of a cascade that has run out of rungs.

`Collide.shedCrossingSurvivors()` in `js/lpn-collide.js` is the pass;
`shedCrossingLabels()` in `js/looped-network.js` is the document half of it, running after
`repairCrossingGangs()` and before the holders are written.

### 11a. The hide-selection rule, and why each term is where it is

**It has to be a STATED rule and not array order**, or the same drawing hides a different label on
each redraw and the map flickers as you pan. Worst goes first:

1. **Hideability is a GATE, not a term.** A hand-placed label is the user's own drawing; a Text
   object is the user's own words. If one half of a pair may be hidden and the other may not, the
   automatic one goes whatever the rest of this says. **If NEITHER may be, the pair stands** and is
   reported — overruling the user is not on the ladder.
2. **`rank`: how important the thing the label NAMES is**, lowest kept longest. Reservoir and tank 0,
   pump and valve 1, junction 2, pipe 3. A reader navigates by the fixed-head vessels and there are
   a handful of them; there are hundreds of junctions, and a pipe's flow is the most recoverable
   from its neighbours. The caller supplies it, because what a label names is a fact about the
   document and `js/lpn-collide.js` knows nothing about hydraulics.
3. **Degree, highest first** — how many flagged pairs this label is in. This is the COST side of his
   ruling: hiding a label that is in three crossings buys three, and greedy-by-degree is the standard
   approximation to the minimum vertex cover this problem really is. **It sits below rank on
   purpose**: clearing a cluster of junction labels is worth more than clearing it by hiding the one
   tank in it.
4. **Leader length, longest first** — the weakest attachment left. A label far from what it names is
   the one whose association a reader is least sure of anyway.
5. **The id**, so the order is total. Nothing should reach here; without it, two identical labels
   would be chosen by array order, which is the flicker term 1 exists to avoid.

The rejected ordering, so it is not re-proposed: **degree first.** It hides fewer labels — that is
the whole of its case — and it pays for them by hiding the tank label in a cluster of junctions,
which is the one label on that part of the map a reader was using to orient.

**A HIDDEN LABEL KEEPS ITS RESERVATION, which reads backwards and is what makes the pass stable.**
A stationed pipe label is drawn only while no node label stands on it, so the covered ones are off
the map before this pass starts and cannot be half of a crossing — that much is §10's third finding.
The tempting next step is to let a hide RELEASE the ground, so the pipe label under a hidden node
label comes back; **it was built that way first and it oscillated**, hiding `{185, 199}` and
`{184, 205}` alternately over five passes on an untouched drawing. It is the same ruling
`yieldStationedLabels()` already makes for the same reason, and it is why this hide is its own flag
(`hiddenCrossed`) beside `hiddenDropped` rather than a fifth writer of it: a DROP says nowhere would
fit and releases the ground; this says the label lost a crossing and keeps it. **That oscillation is
NOT the one 11b is about**, and the two were found within a day of each other: this one is the
shed's own, cured by not releasing the ground, and 11b's is in the layout underneath, cured by not
remembering the last one.

### 11b. The layout was NOT STABLE, counting could not see it, and the fix is to predict rather than remember

The shed is a deterministic function of the layout it is handed, so it hides the same number of
labels every pass. **What moved was the layout underneath it.** Five passes over one untouched view
of Net3-World at the fit zoom ran **A B A B A**: four labels traded places on every content pass --
a zoom step, an edit, a label toggle -- and the shed then hid `{10, 185, 187, 199}` on the odd
passes and `{10, 184, 187, 205}` on the even ones. **The crossing count was 5 in both states**, and
every harness in this family counted pairs, so every one of them reported a fixed drawing while the
screen jumped. **A flicker is worse than the crossing it replaces**, which is Tom's own standard for
this task (*"not show them if we can't show them beautifully"*).

**It was never only the gang route and never only Net3-World.** The first diagnosis was the gang
route, because at that one view `off` and `brute` settle and `gang` does not. Measured over all
seven examples at all four zooms, the drawing as it stood was unstable in **14 of the 28 views, 7 of
them true two-cycles** -- and with the repair switched off entirely, Net3-World still failed to
settle on all four of its views. **The oscillator was the placement pipeline itself**; the gang
route added one more cycle at the view somebody happened to be looking at.

**The mechanism was a memory.** `shedAlignedForConflicts()` decides how many values a pipe label
gives up by asking what it would collide with, and the biggest thing it collides with is the node
labels at each end of its pipe. It had to know where those were going before any had been placed, so
it read **where the LAST layout put them**. That closes a loop: a node label moves, the pipe labels
round it shed a different number of values, their boxes change width, the obstacles the next
first-fit sees change, and the node label moves back. Three memories fed it and all three had to go:
the node label positions (`nodeLabelPos()`); `ne.hiddenDropped`, last pass's drops, used to decide
which node labels reserve no ground; and the node labels' own shed CONTENT, because
`unshedNodeLabels()` ran after the shed rather than before it.

**`predictNodeLabelBoxes()` (`js/looped-network.js`) answers the same question from the drawing
alone**: the same `nodeFirstFitSpec()`, in the same drop order, through the same
`placeLabelsFirstFit()`, against the static obstacles plus the stationed pipe labels **at full
content**. The one thing it cannot know is how many values those pipe labels are about to shed --
which is the answer it is being asked for, and the reason a prediction that waited for it would be
the loop again. A predicted DROP reserves nothing. The spec builder moved out of
`runLabelCollisionAvoidance()` and is shared, because two passes asking where a label goes must not
be two opinions about it.

**Two other fixes were built or named and are recorded so they are not re-proposed.**

- **Seeding from the labels' HOME positions** is the cheapest way to break the loop, and it was
  built and measured first. It converges just as completely and it costs labels: **40 fewer of the
  1,695 drawn across the 28 views**, 9 of them on one view of Net3-World and 4 of Net1's 25 at the
  fit zoom, because a home-seeded box reserves ground on the side the label is not going to take and
  pipe labels shed to nothing and hide for it. It also took the fit zoom of Net3-World from 5
  flagged pairs to 8.
- **Making the shed STICKY** -- remembering last pass's victims -- hides the symptom in the shed and
  leaves the labels underneath still swapping.

The prediction costs one more `placeLabelsFirstFit()` and one more `placeStationedLabels()` per
CONTENT pass and none on a drag frame, inside the noise of a pass that runs 420-1,300 ms on
Net3-World under Node with the DOM stub.

`dev/lpn-spike/label-stability-harness.js` holds it. It lays out ONE untouched view five times and
compares the **layout** -- every drawn label, where its first box sits to twelve significant
figures, whether it drew a leader, and which labels the shed hid -- printing the passes as letters,
so `AAAAA` is settled, `ABBBB` is a one-step settle and `ABCBC` is the two-cycle. Two drawings run
by default (Net3-World and Net2, one geographic and one XY, both two-cycling before this);
`--full` is all seven, and a repair mode can be named on the command line.

### 11c. The table. Pairs per view, labels hidden to get there, and whether the view settles

Each cell is the four views in order: zoom-to-fit, then 2x, 4x and 8x in from it. Every label field
on, solved through EPANET, 1400x900. `off` and `both` are §10's first and last columns; `+shed` is
what ships; `hidden` is what the shed hid to get there; `passes` is five layouts of each view.

| drawing | off | both | **+shed** | labels hidden | passes |
|---|---|---|---|---|---|
| Net3-Novato-CA-World | 7 / 20 / 12 / 5 | 5 / 10 / 6 / 2 | **0 / 0 / 0 / 0** | 4 / 9 / 6 / 2 | AAAAA x4 |
| Net3 (XY) | 14 / 7 / 4 / 1 | 7 / 6 / 0 / 0 | **0 / 0 / 0 / 0** | 5 / 5 / 0 / 0 | AAAAA x4 |
| Net2 | 4 / 1 / 0 / 0 | 3 / 0 / 0 / 0 | **0 / 0 / 0 / 0** | 2 / 0 / 0 / 0 | AAAAA x4 |
| Net1 | 1 / 1 / 0 / 0 | 1 / 1 / 0 / 0 | **1 / 0 / 0 / 0** | 0 / 1 / 0 / 0 | AAAAA x4 |
| Elm-Street-Center | 3 / 2 / 1 / 1 | 3 / 2 / 1 / 1 | **2 / 1 / 0 / 0** | 1 / 1 / 1 / 1 | AAAAA x4 |
| Basic example, either unit set | 0 throughout | 0 | **0** | 0 | AAAAA x4 |

**Five findings:**

1. **Zero is reached on every measured view of every drawing except where the user's own labels are
   both halves of the pair.** The residuals are named rather than averaged away: Elm-Street-Center
   `n:J12|n:J13` and `n:J14|n:J4` at the fit zoom, `n:J13|n:J14` at 2x; Net1 `n:10|n:11` at the fit
   zoom. All six labels involved carry `lx` -- Elm-Street has 14 hand-placed node labels out of 18
   and Net1 has 3 out of 11. **That is the user's drawing and we do not overrule it.**
2. **Every view settles on the first pass**, on all seven examples at all four zooms in the shipped
   configuration, and on both Net3s in `off`, `brute`, `gang` and `both` as well -- `off` included,
   which is the point: the pipeline is what was cycling. 56 of 56 stability checks and 64 of 64 in
   the mode sweep. The shed picks the same victims every pass, which is what 11a's stated order
   exists to buy and is now asserted rather than assumed.
3. **The cost is 38 labels across the 28 views, and it is not the number that reads as large.**
   1,715 labels are drawn before the shed and 1,677 after; the worst single view hides 9 of the 101
   it would otherwise draw, and four of the seven examples hide none at any zoom. Hiding thirty
   labels to remove five crossings would have been a finding against the ruling; this is not that.
   (The harness also prints a per-view `hidden/total` against every label in the DOCUMENT -- 168 of
   216 at the fit zoom of Net3-World. **That is not the shed's bill**: most of it is link labels
   this VIEW does not draw, shorter than their own pipe at that scale, which is why the figure falls
   to 40 as you zoom in.)
4. **A hide is worth more than one pair on a crowded view.** Net3-World at 2x clears 10 pairs with 9
   hides and at 4x clears 6 with 6, which is the degree term doing its work; the same view's repair
   moved 18 labels to clear 10 pairs before it.
5. **The stability fix and the target of zero did not fight, and both are better for it.** The
   prediction moved every drawing, so it moved every crossing count: the pairs the shed has to hide
   for fell from 26 to 23 over Net3-World's four views and from 20 to 13 over Net3 (XY)'s, and the
   drawings ended up carrying MORE labels than before either piece of work (1,715 against 1,695 at
   the same point in the pipeline). The whole repair-plus-shed is 16-69 ms a pass on Net3-World with
   every field on -- Node with the DOM stub, indicative rather than a browser measurement, and it
   swings by a factor of four on a loaded machine.

### 11d. TWO MEASUREMENT DEFECTS FOUND, and §10's table understated phase two because of one of them

Both were found by the phase-three assertion failing: the model said zero and the drawing said eight.
That is §10's third finding stated as a method — **when the model and the drawing disagree, the
measurement is the first suspect, not the pass.**

- **The harness read the first-fit's boxes beside the DOM's repaired leaders.**
  `repairCrossingGangs()` copies its placement list and replaces the entries it moved, so
  `placeLabelsFirstFit()`'s own result still holds the boxes as they were BEFORE the move — while
  the leaders `label-crossing-measure.js` reads come off the DOM and are the moved ones. Every
  number in §10 before this was therefore taken on a drawing that does not exist, and phase two is
  better than it claimed.
- **A Text object was reported as crossing itself.** `staticObstacles()` pushes a Text label's box
  and its own callout line as two unrelated entries, and `labelCrossings()` excludes only a
  placement's OWN leader — so every Text object with a callout counted as a pair, twice per view on
  the Basic examples. Both now carry `textOwner` and `crossingForeigners()` merges them into one
  placement, which is what they are on the map.

**And the third instrument defect is the one 11b turned on: counting.** A layout that swaps two
labels keeps its count, and a shed that picks different victims keeps the number it hides. The
family now measures a SIGNATURE for the stability question and a count for the crossing question,
and never uses one for the other.

### 11e. The cluster in his screenshot, what is left, and what could not be reproduced

He sent Net3-Novato-CA-World at the fit zoom, upper left, around nodes 163/167/173/177/267, and
described labels overlapping each other with leaders through them.

- **The crossings there are gone.** Those ids are exactly where the surviving pairs were, and all of
  them are now 0 on every measured view.
- **What is left anywhere is five pairs on the two small drawings, and not one of them is a kind any
  route could fix** (11c, finding 1): four are two hand-placed labels against each other, which
  nothing may move or hide, and Elm-Street's `n:J13|n:J14` at 2x is the same. **A gang with free
  labels and open ground -- the only kind either route, or a `spot_prime` search, could ever
  address -- does not occur in the residual.** That is the count-by-kind §10c asked for, and it is
  why §10c's recommendation stands.
- **The labels-on-top-of-each-other half could NOT be reproduced headlessly, and that is worth
  saying rather than claiming a fix.** `labelCrossings()` answers his two triggers and neither of
  them is label-on-label, so the measurement takes that count separately —
  `label-crossing-measure.js` returns `overlaps` beside `counts` — and **it is zero on every view of
  every example, before and after this pass.** The most likely reasons the picture differs are that
  the harness renders at a fixed 1400x900 with every label field on, and that the DOM stub's glyph
  advance is nominal rather than a real font metric; a wider window changes the fit scale and
  therefore what sheds. **What he was looking at was the phase-two build, which still had 5 crossing
  pairs at that zoom, and a leader running through a label reads as stacking.** If it still looks
  stacked to him on the shipped build, the next measurement is the overlap count at his own window
  size, not another placement change.

---

## 12. Phase four: `spot_prime` is built, and the number it moves is the shed (Task 539, 2026-09-15)

**Tom asked for this branch on a ground that cuts against the ranking argument that had parked it,
and he was right to.** 2026-09-15: *"I would want to get this branch started on the grounds that
having a better network model could improve our performance placing labels."* Section 10c's case
against was that not one of the five residual crossing pairs is a gang with free labels and open
ground, so a search can fix none of them. **That is true and it measures the wrong thing.** Every
measured view is already at 0 crossings, and a count at zero cannot tell you whether the placement
is GOOD -- only that it is not embarrassing. **So the success criterion here is not the crossing
count. It is the labels phase three has to HIDE to reach zero**, which section 10c itself named as
the thing a search would now buy.

`Collide.spotPrime()` in `js/lpn-collide.js` is the search;
`spotStackTrials()` inside `repairCrossingGangs()` is the third trial family that uses it;
`dev/lpn-spike/label-spot-harness.js` holds both.

### 12a. What `spot_prime` turned out to be

It is section 9b's own object, found per GANG rather than per network, and it is the standard search
section 10c predicted it would be -- maximal empty rectangles over an occupancy raster, which is
the affordable form of largest-empty-rectangle and is what Luboschik's particle-based labeling does
(section 2). Nothing in it is novel and nothing in it needed to be.

- **The grid** is capped at 48 cells a side whatever the reach, so a search is a fixed number of
  cells and the cell SIZE grows with the area being asked about. Obstacle boxes are marked through
  the exact oriented test rather than through their bounding range, because an aligned pipe label at
  45 degrees fills a fifth of its own bounding box and marking the rest off would hide the ground
  this pass exists to find.
- **The rectangles** come from `up` heights plus one largest-rectangle-in-histogram scan per row.
- **A spot is a PLACE, not a rectangle**, which is what makes his three extreme boxes the right
  description: tallest skinny, widest squat and biggest square are read off every maximal rectangle
  that CONTAINS the spot's centre. Without that, a run of forty maximal rectangles over one patch of
  empty ground reads as forty spots.
- **Spots come back nearest first**, because a leader is an association: of two spots that both hold
  the stack, the near one says which node it belongs to and the far one asks the reader to follow a
  line.
- **It runs only where the cheap routes have left a crossing standing**, which is his *"near
  failures or needs"* read as a schedule rather than as a place. On the shipped drawings that is a
  minority of gangs, and it is what keeps the pass inside its frame budget.

**THE RASTER ONLY PROPOSES; ADMISSION IS STILL EXACT, and that is the whole safety argument.** A
spot is a suggestion of where to try a stack. Every trial built on one still goes through
`pieceFor()`'s `boxesClearOf()` against the real obstacle list, still has to pass `admissible()`, and
still has to beat the incumbent on the crossing count. So a cell the grid marks free that is not
costs a wasted trial and can never reach the drawing -- which is the reverse of the usual
grid-versus-definition risk, and is why the segment walk may sample rather than supercover.

**Steps 2, 3 and 4 of section 9a are the caller and they went in unchanged.** `need` is step 2 (the
estimated extents of the n stacked labels); the two column EDGES are step 3 in his own words
(*"from the middle left point leftward or middle right point rightward of box_est"*), and it is the
one place this could have been written backwards -- `labelBoxAtEnd()` hangs the text off the endpoint
on the side AWAY from the anchor, so a column standing in a spot to the RIGHT of the gang has its
endpoints on the spot's LEFT edge. Step 4 is `assignByAngle()`, which route (b) already used.

### 12b. Two things were his to decide and the record did not contain a decision

- **The tile-indexed PRECOMPUTATION is deliberately not built** (*"can be pre-calculated ... all in
  advance of zooms, and all only once for the network"*). Section 10c's first finding is why: free
  space is a per-VIEW quantity, so an index of the DRAWING cannot answer the question being asked of
  the VIEW. What makes the search affordable instead is that it is per gang, over the gang's own
  neighborhood, and only where a crossing survived. **If it is ever wanted, it bounds where to look
  and does not replace the look.**
- **`text_size_largest_perfect_fit` is not built either**, on section 10c's own argument: it is an
  automatic text size, which is a different feature, and it should be judged on its own merits
  rather than ridden in on this task.

### 12c. A LEADER ACROSS A PIPE IS A TERM AND NOT A GATE, which was the whole difference

The first build gated a spot trial on the leader breaking none of the perfect-world rules section 9c
names -- *"without breaking any of our 'perfect world' rules including leaders crossing links or
symbols"*. **Measured, that gate refused 54 of the 56 trials the search proposed on Net3-World**: in
a mesh of pipes almost no open ground is reachable without crossing one, so the pass reported dozens
of spots found and nothing tried at all.

`GOAL_WEIGHT` has the answer and has had it since the first-fit was written. **Goal 8, leaders avoid
links, is the second-mildest weight in the whole ladder** -- an absolute gate on it is harsher than
this project's own ranking of it. So the score tuple gained a fifth term, `linkX`, exactly where goal
8 sits: `[crossings, blocked, hits, yielding, linkX, len]`. It is a tiebreak and nothing more, since
no trial that lowers the crossing count can lose to one that does not.

**And the term changes nothing by itself, which is worth knowing before anybody suspects it.**
Measured: the `both` mode -- brute and gang, no spot route -- is byte-identical with and without
`linkX`, on all 28 views. It never breaks a tie the old tuple had not already decided. **The whole
of the gain below is the spot route.**

**The one gate that stayed is goal 5, a leader through somebody else's node symbol**, because that
leader says the wrong thing outright: the reader is told the label belongs to that node.

### 12d. THREE FAILURES THAT REPORTED NOTHING, and all three are fixtures now

Every one of them failed by finding LESS, which is the family of failure this whole task's
measurement lessons are about (section 11d).

1. **A leader starts inside its own node's symbol, always, and a symbol box carries no owner to
   exempt it by.** `staticObstacles()` builds one from the node's radius and nothing else, so
   "passes through no symbol" refused every leader ever drawn: **108 spots found on Net3-World and 0
   trials scored**, with the statistics printing both numbers and nobody reading them together. The
   test that says "this is the symbol I come out of" is the box containing the leader's ANCHOR.
2. **A rectangle cap below the geometric maximum truncated in ROW ORDER.** The histogram scan emits
   at most one rectangle per (row, stack pop), so a grid of side N produces at most N x N; a cap at
   512 over a 48 x 48 grid kept only rectangles from the top sixteen rows. A raster round one
   obstacle in an empty field returned **the band above it and none of the three beside it** -- the
   four bands were all there and three were never emitted. The cap is now N x N, where it cannot
   bind.
3. **The histogram stack held HEIGHTS instead of indices**, so the left edge of a closing bar was
   guessed and came out on the far side of the hole: it emitted a 200 x 120 rectangle straight
   through the obstacle. Plausible output, and only a fixture that knows the field can see it.

**And one that was cost rather than correctness:** the segment walk was not clipped to the grid.
`obstaclesInReach()` admits a segment that passes anywhere near the gang, and a trunk main on Net2
is many times the width of the raster, so walking the whole of it stepped thousands of times through
empty coordinate space to mark a handful of cells -- **221 ms a pass at the fit zoom of Net2 against
26 ms with the spot route off.** Clipped first, the same drawing is within the noise of the other
routes.

### 12e. The numbers, before and after, from the same pass

**Taken 2026-09-15 on this branch, 1400x900, every label field on, solved through EPANET, and BOTH
columns measured on the same tree** -- which section 11d is the reason for: the `both` column here
is not section 11c's, because master has moved since and a comparison across two trees describes a
drawing that does not exist. `both+shed` is the three-phase build as it shipped; `all+shed` is it
plus the spot route. Cells are the four views in order: zoom-to-fit, then 2x, 4x and 8x in from it.

| drawing | crossings, either mode | labels hidden, `both+shed` | labels hidden, **`all+shed`** | labels drawn, `both` -> **`all`** |
|---|---|---|---|---|
| Net3-Novato-CA-World | 0 / 0 / 0 / 0 | 6 / 8 / 5 / 1 | **5 / 7 / 4 / 0** | 56/111/147/187 -> **57/112/150/188** |
| Net3 (XY) | 0 / 0 / 0 / 0 | 7 / 6 / 0 / 0 | **6 / 5 / 0 / 0** | 75/124/174/206 -> **76/125/174/206** |
| Net2 | 0 / 0 / 0 / 0 | 2 / 0 / 0 / 0 | **2 / 0 / 0 / 0** | 50/60/76/81 -> **50/62/76/81** |
| Net1 | 1 / 0 / 0 / 0 | 0 / 0 / 1 / 2 | **0 / 0 / 1 / 2** | 25/27/26/25 -> unchanged |
| Elm-Street-Center | 3 / 1 / 0 / 0 | 1 / 1 / 3 / 1 | **1 / 1 / 3 / 1** | 39/46/45/47 -> unchanged |
| Basic example, either unit set | 0 throughout | 0 | **0** | unchanged |
| **28 views** | **5 pairs, all of them hand-placed on both sides** | **44** | **38** | **1,789 -> 1,799** |

**Five findings:**

1. **The shed is 14% less busy: 44 labels hidden across the 28 views against 38, and 10 more labels
   drawn.** That is the number Tom's own ruling made the cost of zero, and it is the only number this
   phase set out to move.
2. **The crossing count did not move, because it could not: it was 0 and it is 0.** The five pairs
   that stand are the same five, and both halves of each are the user's own hand-placed labels --
   Elm-Street-Center `n:J11|n:JF-ELM`, `n:J12|n:J13`, `n:J12|n:J14` at the fit zoom and
   `n:J13|n:J14` at 2x, Net1 `n:10|n:11` at the fit zoom. An automatic pass may not hide a
   hand-placed label, so that outcome is correct and is asserted by id.
3. **The gain is on the big drawings and nowhere else, and the shape of that is the finding.** The
   two Net3s account for all of it; Net1 and Elm-Street do not move at all, and they are the two
   drawings whose labels are mostly the user's own. A search for open ground pays where there are
   enough labels to be crowded and enough map to be empty.
4. **Every one of the 28 views still settles on the FIRST pass** -- 56 of 56 checks in
   `label-stability-harness.js --full`, `AAAAA` on all of them, the shed picking the same victims
   every time. That was the risk worth naming in advance: a trial family that reaches further has
   more ways to disagree with itself between passes, and it does not, because `spotPrime()` is a
   pure function of the obstacle field it is handed and the field is a pure function of the drawing.
5. **The repair sub-pass roughly doubles and the content pass does not notice.** Back to back on
   Net3-World: 49 ms against 95 ms at the fit zoom, 37 against 90 at 4x. The content pass those sit
   inside runs 600-1,400 ms on the same drawing under Node with the DOM stub, and a five-pass median
   of the whole pass put `all+shed` FASTER than `both+shed` on two of the four views -- which is not
   a speed claim, it is the factor-of-four machine noise section 10b warns about. Both figures are
   Node with the DOM stub and neither is a browser measurement.

**What is not claimed.** Section 11e's other half still stands: the labels-on-top-of-each-other
picture Tom sent could not be reproduced headlessly, the overlap count is 0 on every view before and
after this, and if it still looks stacked to him the next measurement is the overlap count at his own
window size.

---

## 12f. What it COSTS, measured against master, and the developer view (2026-09-16)

Tom, 2026-09-16: *"This is a branch that's not really easy for a user to test... It's one where I
want to see more under the hood. Can you give me a developer's view that has the spot-prime boxes?
Also, can I see a report of the performance change this branch causes?"* Both, below.

### The measurement, and the confound that had to be removed first

**THREE TREES, ONE MACHINE, AND THE FIRST RUN WAS CONTAMINATED BY THE SESSION TAKING IT.** A first
pass ran master, then the branch, then the branch again, while this session was editing files on the
same four cores, and it reported the whole label pass **31% slower on the branch with the spot route
OFF** -- which cannot be true, since that configuration differs from master by one added term. The
run was re-taken **interleaved** (master, branch-off, branch-on, per example, twice round) with
nothing else running. The numbers below are that second run: **7 examples x 4 views, the whole pass
a median of 6 passes, the repair sub-pass the better of 2**, 1400x900, every label field on, solved
through EPANET, Node with the DOM stub. **Not a browser measurement**, and the section 10b warning
about factor-of-four machine noise still applies to any single row.

| summed over 28 views | master | branch, spot route OFF | branch as it ships |
|---|---|---|---|
| whole content+layout pass | 6,012 ms | 6,041 ms (0%) | 6,143 ms (**+2%**) |
| the gang repair sub-pass inside it | 157.6 ms | 207.5 ms (**+32%**) | 362.5 ms (**+130%**) |
| labels hidden | 44 | 44 | **38** |

**Three findings, and the middle one is the one nobody was looking for.**

1. **THE WHOLE PASS DOES NOT MOVE MEASURABLY: +2%, inside the noise.** Per-view swings of -53% and
   +41% appear in both directions on drawings where the repair costs a fraction of a millisecond, so
   the honest reading of the column is "no change I can measure here". The repair is 5-9% of the
   content pass on the big drawings and roughly 10% after this, which is why doubling it disappears.
2. **THE BRANCH COSTS +32% OF THE REPAIR PASS WITH THE SPOT ROUTE SWITCHED OFF**, and that is
   `linkX`. `pieceFor()` computes `leaderLinkCrossings()` for **every** piece of **every** trial of
   **every** route, and it walks the gang's whole local segment list. Section 12c measured that the
   term never changes the outcome in `both` mode -- byte-identical on all 28 views -- so today the
   suite pays a third of the repair pass for a tiebreak that breaks no ties outside the spot route.
   **Computing it lazily, only where a spot trial is being scored, should be free of behaviour
   change and worth about 50 ms across these 28 views.** Not done here: it moves the scoring path,
   and that wants its own stability run.
3. **The spot route itself is the other +98%, and it is paid where the drawings are big.** Net2 and
   the two Net3s carry all of it -- the worst single view is Net3-World at 2x, **33.5 ms to 86.4 ms**
   inside a content pass of about 950 ms -- while Net1, Elm-Street and both Basic examples are
   unchanged to a tenth of a millisecond, because no gang there reaches the search at all.

**What is bought for it is finding 1 of section 12e, re-measured here and unchanged: 44 hidden
labels become 38.**

### The developer view: `?debug=spots`

`drawSpotDebug()` in `js/looped-network.js`. A URL parameter, for the reason `?debug=boxes` is one:
a settings checkbox would be a translated string in 27 files for a tool that reviews one algorithm.
The trace is `null` unless the parameter is typed, so a shipped page pays one regex.

| URL | what it adds |
|---|---|
| `?debug=spots` | the gangs the repair worked on, their two reach rings, every spot found, the three extreme boxes on each, the stack that had to fit, and a readout |
| `?debug=spots,all` | ALSO searches the gangs the cheap routes already cleared -- marked "look only", nothing tried, and a harness fixture asserts the layout is identical either way |
| `?debug=spots,cells` | ALSO shades the occupancy raster the rectangles are read off |
| `?debug=labels,spots` | the placement bench beside it, which is where the hidden-label counts are printed -- **and it now carries a `spot route` checkbox, so the two configurations can be read back to back on the same view** |

**THE OVERLAY IS EMPTY ON A DRAWING THE CHEAP ROUTES CLEARED, AND THAT IS THE HONEST ANSWER.** The
shipped search runs only where a crossing survived them, which on Net1 and Elm-Street is never; the
`,all` switch is there so that "nothing to see" can be told from "nothing found". Measured on
Net3-World with `,all`: 9 to 15 gangs a view, 7 to 11 of them searched on the shipped schedule, 36 to
60 spots found.

The data comes out of `repairCrossingGangs()` as `stats.trace` -- an out-parameter that nothing reads
back, so the picture cannot steer the placement. `spotPrime()` records its occupancy raster **by
reference**, so what is drawn is the array the scan ran over rather than a second one built to look
like it.

---

## 13. Why three field sets look like three different drawings (Tom's screenshots, 2026-09-18)

He sent three pictures of the same view -- node ID only, ID plus Demand, Demand only -- and asked:
*"I can't account for the drastic change. Can you? Here's what I would expect that didn't happen:
(1) if the Demand and ID can't both fit, we would drop one. (2) Demand only and ID only would look
very similar; but I find that all properties other than ID don't stack as well, which makes no
geometric sense."*

**It makes geometric sense, and (1) is a real defect.** Both halves are measured, not argued.
`dev/lpn-spike/label-fieldset-measure.js` is the tool; it is `label-crossing-measure.js` with a
field set as an input, which nothing could supply before -- every figure in sections 8 to 12 was
taken with EVERY FIELD ON, so no recorded number could compare two field sets.

### 13a. The numbers

Net3-Novato-CA-World, 1400x900, solved through EPANET, the shipped route (`all+shed`), at the fit
zoom and three steps in. Geometry is the MEDIAN of each node label's whole footprint -- the union of
its stacked rows, in world units -- because reading the first row alone reports the ID's width for a
label whose demand row is three times wider, which is exactly the misreading being asked about.

| field set | zoom | labels shown | hidden | of | median width | median height | **median area** |
|---|---|---|---|---|---|---|---|
| ID only | fit | 82 | **15** | 97 | 0.00349 | 0.00235 | **8.19e-6** |
| ID + Demand | fit | 52 | **45** | 97 | 0.00931 | 0.00491 | **4.57e-5** |
| Demand only | fit | 56 | **36** | 92 | 0.00902 | 0.00227 | **2.05e-5** |
| ID only | 2x | 94 | 3 | 97 | | | |
| ID + Demand | 2x | 81 | 16 | 97 | | | |
| Demand only | 2x | 83 | 9 | 92 | | | |
| all three | 4x and 8x | | 0 or 1 | | | | |

**THE WHOLE OF (2) IS THE FIRST TWO COLUMNS OF GEOMETRY.** A demand reads `Q=236.01`; an ID on this
drawing is two or three characters. Measured, a demand row is **2.6 times wider** than an ID row.
Label placement is a packing problem, so 2.6 times the width is 2.5 times the area to find room for,
and the drawing hides 36 labels where the ID drawing hides 15. Tom's intuition that the two should
look alike is the one thing here that is simply mistaken: they differ by the only quantity the
packing cares about. **ID plus Demand is worse than either alone for the obvious reason and it is
worth stating, because it is not a subtlety: the box is 2.7 times wider AND two rows tall, so it is
5.6 times the area of the ID label.** Nothing about the placement is behaving oddly.

**One more difference he can see and no code caused: Demand only draws 92 labels, not 97.** Five
junctions have no demand, so their label has nothing in it at all.

### 13b. (1) IS RIGHT, AND THE CODE CANNOT DO IT

*"If the Demand and ID can't both fit, we would drop one."* It does not. `nodeShedRec()` refuses a
shed when `gone >= order.length - 1` -- dropping the LAST ranked value is not a shed, it is the
hide -- and **a node's ID carries no rank at all** (`nodeFieldRank()` answers -Infinity, and
`nodeShedOrder()` leaves unranked lines out of the order entirely). So with ID and Demand switched
on there is exactly ONE ranked value on the label, the cascade has nothing it is allowed to give up,
and the only move left is to hide the label whole.

**Measured, and this is the proof rather than a reading of the source:** `valueShed`, the count of
node labels that gave up a value instead of going whole, is **0 at every zoom for all three of his
field sets**. Switch Pressure on as well -- ID + Pressure + Demand, two ranked values -- and it is
**87 of 97 at the fit zoom**, and the drawing that results is geometrically identical to the ID +
Demand one (same median width, height and area; 48 hidden against 45). The cascade works. It is
simply forbidden to reach the case he is looking at.

**The fix is the one he asked for in the same message**, in the Drop-order respecification: give the
node ID a Drop rank. With ID ranked, ID + Demand is two ranked values and the cascade can drop one
and keep the other, which is his expectation (1) exactly. That is why the missing Node ID Drop
spinner and this question are one item and not two.


## 14. The two boxes in the basins, and the constant that put them there (2026-09-18)

Tom marked two labels sitting in the **Deer Island Basin** and the **Lynwood Stormwater Basin** on
Net3-World with nothing near them. **That is the spot search working exactly as written, and the
basins are the evidence rather than a coincidence**: `spotPrime()` looks for the largest empty
rectangle within reach, and on a geographic drawing the largest empty rectangle is a body of water.

**The number that decided how far it may look was `SPOT.reachFactor`, and it was 2.** Measured on
Net3-World, switching the spot route on more than doubled the longest leader in a view -- 0.01258
degrees to **0.02656**, about **2.3 km of leader** at Novato's latitude, roughly six label widths.
`score()` ranks a trial `[crossings, blocked, hits, yielding, linkX, len]`, so leader LENGTH is the
LAST tiebreak: a spot two reaches out that removes a crossing beats a near one that does not, and
nothing else in the tuple can stop that trade.

**Narrowing it to 1.25 was expected to cost hidden labels and it BUYS them, on both scopes.**

| `reachFactor` | 28 views, labels hidden | labels drawn | Net3-World longest leader |
|---|---|---|---|
| 2 | 38 | 1,757 | 0.02656 |
| **1.25** | **34** | **1,762** | **0.01905** |

Crossings stay at 0 on both, and the four residual pairs are the same hand-placed ones. The reading
is that a spot far out wins its own trial and then stands on ground the labels around it needed, so
the pass pays for it one gang later -- **the search reaching further does not find more, it finds
worse**. 1.25 was the first value tried below 2; 1.5 was also tried (13 hidden on Net3-World's four
views, but a 0.07726 outlier leader at the fit zoom), so this is not a value fitted to a drawing.

**IT IS ALSO PARTLY A SYMPTOM OF THE MISSING THRESHOLD, WHICH IS TOM'S OWN POINT** (section 15).
Lettering is drawn in screen pixels, so a label's size in MAP units grows without bound as the view
widens; the gang reach is derived from label size, and the spot reach is a multiple of the gang
reach. With no widest-view limit there is no bound on any of the three, which is his sentence
*"Without this threshold, we have no limit for outer boxes"* stated as arithmetic. The threshold
caps the largest a box and a leader can ever be; `reachFactor` decides how far out the search goes
inside that cap. Both were needed and neither substitutes for the other.


## 15. Tom's box strategies A and B, measured (2026-09-18)

He asked for findings rather than a build, and the finding is that **strategy A as literally stated
returns nothing on a real drawing, and strategy B is not a relaxation of it but the only version of
it that exists.** `dev/lpn-spike/box-at-node-probe.js` takes every number below: Net3-World, 1400x900,
solved, every label field on, at the fit zoom and two steps in.

> **A:** *"a box-at-node model, where we (iteratively?) draw the open rectangle with the largest area
> possible that touches a node ... (c) we don't have to store a box for every node. If the area is
> too small to be usable, or none are found, we don't store."*

> **B:** *"If we modify the strategy above to allow a box to be away from a node, it complicates our
> search ... I am doing a concept where we allow the box to be two text heights away from a node."*

| | fit zoom | 2x | 4x |
|---|---|---|---|
| nodes searched | 97 | 97 | 97 |
| nodes yielding at least one usable box | **97** | **97** | **97** |
| spots found | 388 | 388 | 388 |
| **boxes that actually TOUCH their node** | **0** | **0** | **0** |
| median gap, node to nearest box edge, in text rows | 0.98 | 1.02 | 0.51 |
| 90th percentile gap, in text rows | 3.92 | 4.57 | 2.54 |
| nodes reached within TWO text rows (strategy B) | 71 | 66 | 82 |
| cost of one search per node | **538 ms** | **673 ms** | **488 ms** |
| cost of ranking 582 boxes by unique area, on top | 21 ms | 2.5 ms | 44 ms |

**Five findings.**

1. **NOT ONE BOX TOUCHES ITS NODE, AT ANY ZOOM, AND THAT IS GEOMETRY RATHER THAN A BUG.** A node's
   own symbol is an obstacle in the occupancy raster -- it has to be, or labels would be drawn over
   junctions -- so the nearest empty rectangle abuts the SYMBOL and not the point. The symbol's
   radius alone is 0.455 of a text row here, and the measured median gap is about one whole row.
   A search for "the largest open rectangle that touches a node" therefore comes back empty on every
   node of a real drawing. **Strategy A needs an offset to exist at all, which is strategy B.**
2. **TWO TEXT ROWS IS THE RIGHT ORDER OF MAGNITUDE AND REACHES ABOUT THREE NODES IN FOUR** -- 66 to
   82 of 97. The rest need more, out to four or five rows at the 90th percentile. His instinct about
   the distance is good; the number is a floor rather than a bound.
3. **THE PRUNING HE HOPED FOR PRUNES NOTHING: every node yields a usable box, 97 of 97, at all three
   zooms.** *"We don't have to store a box for every node"* is true of a sparse drawing and false of
   this one, so the storage saving is not where the affordability comes from.
4. **"MOST UNIQUE AREA" IS CHEAP AND THE SEARCH IS NOT.** 582 kept boxes is 169,000 pairs and costs
   tens of milliseconds; the per-node search costs 500 to 670. Between 5,300 and 33,600 of those
   pairs OVERLAP, which is the same fact the shipped search already answers by collapsing a run of
   maximal rectangles into one PLACE with three extreme boxes: without that collapse, forty
   rectangles over one patch of open ground read as forty spots.
5. **AT NET3 SCALE IT IS NOT AFFORDABLE PER VIEW, AND THAT IS THE ANSWER TO "IS SPOT-PRIME
   WORKABLE".** One search per node is 500-670 ms against about 90 ms for the whole shipped gang
   repair and 600-1,400 ms for the content-and-layout pass it sits inside -- so it would roughly
   double the cost of drawing every frame of a zoom. **What makes the shipped search affordable is
   not the algorithm, which is the same maximal-empty-rectangle scan: it is the SCHEDULE.** It runs
   per gang, over that gang's own neighborhood, and only where a crossing survived the cheap routes
   -- 7 to 11 gangs a view on this drawing rather than 97 nodes.

**And his own precomputation does not rescue it**, for section 10c's reason restated: free space is
a per-VIEW quantity. An index of the DRAWING cannot answer a question about the VIEW, because what
is open depends on how big the lettering is in map units, which depends on the zoom. A precomputed
per-node index would have to be rebuilt on every zoom step, which is the 500 ms above.

**What the measurement suggests instead, if the box-at-node idea is wanted:** keep the per-gang
schedule and change what a spot is ALLOWED to be, which is the one line section 14 already moved.
The evidence there is that the search's problem is not that it looks in the wrong PLACE but that it
is allowed to look too FAR.

## 16. Only the label width changes, and the labels move (Tom's prefix test, 2026-09-18)

Tom's test case, and it is the crispest one this task has had: one drawing, one field (the node ID),
change ONLY that field's **Before** text -- `1=`, then `12=`, then `123=`. Nothing about the drawing,
the zoom or the field set moves; the labels merely get wider, and the placements rearrange.

> *"I say that there is no good reason for a single label of any type to place differently than any
> other type in these images. Width in this case is immaterial because there is no constraint on
> width. I know that the bug is related to width."*

**The labels do move, and here is the number.** Net3-World, node ID alone, every repair route and the
shed on, node labels choosing a different candidate than they did at `1=`:

| prefix | fit zoom | 2x | 4x | 8x |
|---|---|---|---|---|
| `12=`   | 27 | 20 | 2 | 0 |
| `123=`  | 44 | 25 | 4 | 2 |
| `1234=` | 49 | 28 | 8 | 2 |

of 97 node labels. `dev/lpn-spike/label-width-stability-harness.js` holds those as a ratchet.

### 16a. It is NOT the goal ladder, and that was the first answer offered

The diagnosis proposed before anything was measured was `GOAL_WEIGHT`: `distance` is ranked last at
1/64 of `labelLabel`, so proximity could never outrank sub-threshold near-misses with distant
obstacles, and a width change would reshuffle the winner through those. **That ladder decides nothing
here.** Three measurements, each sufficient on its own:

1. **Node labels never reach a score.** They are placed by `placeLabelsFirstFit()`, where a side is
   clear or it is not; `rawScore()`, `effectiveScores()` and `GOAL_WEIGHT` are the ring scorer's, and
   the ring scorer places free link labels and dragged labels.
2. **The divergence is complete with every repair route OFF.** Measured in `off` mode, before
   anything that scores has run: 14 of 97 move at `12=` and 23 at `123=`. Turning the routes on adds
   a few more; it does not create them.
3. **The broad phase is exact.** Replacing `grid().near()` with a full scan of every obstacle
   reproduces the layout to the bit, so nothing is being missed or found by a cell boundary.

### 16b. What it is: a greedy first-fit, and the cascade

The pass was replayed offline from its own captured inputs and reproduces the real layout **97 of 97
labels**, which makes it possible to name a blocker for every change. **Every one is a real box
overlap with a neighbour's label, nearer than one label width.** There is no epsilon noise in it,
and nothing 2 km away votes on anything.

The propagation is the cascade. A label that cannot use any of its four corners falls through to the
polar raster, commits there, and becomes an obstacle for everyone placed after it -- on ground a
later label was going to use from its own doorstep. That label then falls through too. Widen every
label at once and the first such fall happens somewhere else, and the drawing downstream of it
follows.

So the sensitivity tracks how **over-subscribed** the view is, which the table above shows directly:
at the fit zoom 24 of 97 node labels are already dropped and 41 are on raster candidates, and half
the drawing moves; at 8x nothing is dropped, two are on raster candidates, and two labels move.

### 16c. Three fixes were built and measured, and all three cost drawn labels

Against the 28 views of the 7 shipped examples, every field on -- the same measurement the 2x-to-1.25
reach change was made on. Drawn labels, higher is better:

| | drawn | hidden | worst leader |
|---|---|---|---|
| **as it ships** | **1,762** | 774 | 204.0 |
| corners for everyone, then the raster | 1,742 | 794 | 204.0 |
| nearest ring for everyone, then the rest | 1,729 | 807 | 204.0 |
| a resting claim reserved for every unplaced label | 1,751 | 785 | 204.0 |

The first two halve the movement at the fit zoom (17 against 39 at `1234=` in the pure first-fit) and
cost 20 and 33 labels. **The third cost 11 labels and did not reduce the movement at all** -- the
reasoning that it could not drop anybody is wrong: a label that takes a different clear side occupies
different ground, so the outcome is not monotone in anyone's options.

**Nothing cheap is available here.** The width sensitivity is a property of a greedy sequential
first-fit over a view that asks for more ground than it has, and it appears only where labels
genuinely touch. Removing it means a different placement paradigm -- a global assignment over the
conflict graph, section 6's exact methods -- which is Tom's call and not a tuning change.

### 16d. What his threshold default would and would not do for it

At the fit zoom of Net3-World the label box height is **0.61 of the median link length**, so a
threshold at TWICE the median link length does not trip there, nor at any zoom this task measures. It
would take zooming out about 3.3x further than the fit view to reach it. His own reading of it --
*"that's conservatively large"* -- is confirmed by the arithmetic: it is an upper limit against
absurdity, not a remedy for the crowded-view lottery above.


### 16e. Confirmed independently: nothing distant votes, and every blocker is a touch

Section 16b's claim is the one Tom's sentence stands or falls on, so it was re-measured from the
other side, on a second pass that knew nothing about the first. For the FIT view of Net3-World with
the node ID alone, the first-fit's inputs were captured and replayed in its own committing order,
and for every label that chose a different spot at `123=` than at `1=` the sides it gave up were
re-tested against the obstacle set as it stood when that label was placed.

Widening the prefix grows the label box **67%** (0.00349 to 0.00582 degrees wide, 0.00235 tall).
33 of 97 node labels then choose a different spot. Of those 33:

| | |
|---|---|
| moved with a genuinely blocked side they had used before | **32 of 33** |
| the one that did not | `n:River`, moved by the repair pass, not by the first fit |
| depth of the shallowest overlap that blocked one, in label heights | min 0.01, **median 0.22**, max 1.25 |
| distance from the anchor to that blocker, in label widths | min 0.20, **median 0.61**, max 2.22 |
| overlaps shallower than 1% of a label height | 1 |
| blockers further than three label widths away | **0** |

**So there is no epsilon and no distant obstacle anywhere in it.** The typical blocking overlap is a
fifth of a text row deep against a label whose anchor is closer than one label width -- two labels
touching, which is what a placement pass is for. *"Width in this case is immaterial because there is
no constraint on width"* is true of open ground, where part 1 of
`dev/lpn-spike/label-width-stability-harness.js` now asserts the placement is identical at four
widths; it is not true of the fit view of this drawing, where at `123=` the labels are wider apart
than they are spaced.

### 16f. Asserted a second time THROUGH THE WHOLE PAGE, and the control that makes it mean something

Section 16e settles what moves a label in a crowded view. It does not settle Tom's sentence, because
his sentence is about the OPEN area and part 1 of the harness proved the open-area case about
`placeLabelsFirstFit()` alone -- hand-built specs, straight into the placer. Everything he actually
drives sits between him and that call: `nodeFirstFitSpec()`'s candidate set, the value shed, the gang
repair, the crossing shed, and `dataLabelOrigin()`'s choice of which side of the endpoint the text
hangs on. Any of those could have carried a width dependence the placer does not have.

**Part 3 asserts it where he states it.** A 12-junction grid and a reservoir, node ID alone, five
affix settings -- none, `1=`, `1234=`, `=1234`, and both at once -- read through `applySaved()`,
`buildDom()` and `refreshLabelText()`, with each label's offset FROM ITS OWN NODE compared across the
five. **All 13 labels drawn, and 0 of 13 move at any affix.** The reservoir sits on its left side at
every width because a pipe leaves it eastward and the open-arc table prunes the top-right corner --
the same answer five times, which is the point.

**The control is the whole defence of that zero**, and getting it wrong was instructive: the first
version derived the view scale from the node spacing, which reproduces the identical picture, so the
"crowded" fixture was byte-for-byte the open one and the control varied nothing. With the scale held
fixed and only the spacing quartered, the same drawing moves **4 labels at `1=`, 9 at `1234=`, and at
both affixes together 2 labels are hidden outright and two commit more than four node spacings away
on a leader.** That is the cascade of section 16b in miniature, on a drawing small enough to read.

### 16g. The conclusion, and why no fix was shipped

**In open ground the invariant already holds, and now holds under two independent assertions.** No
code change would make it hold any harder.

**A label moves only when something really lies in the direction its text grew, and that is
FOURTEEN labels on Net3-World -- the same fourteen at the fit zoom and at 2x.** Everything else that
moves, 44 labels at the fit zoom and 20 at 2x, moved because a NEIGHBOUR moved first; its own extra
width hit nothing whatsoever. Section 16h is the per-label evidence, and it is what corrects the
sentence this section used to carry. Section 16c measured three contained attempts to damp that
amplification and all three cost drawn labels, including the one whose reasoning said it could not.
**Nothing was shipped on this branch for that reason, which is why Tom saw no change when he tested
it.** Removing the amplification means global assignment over the conflict graph (section 6), which
is a different placement paradigm and his call to make, not a tuning change.

**Two more contained ideas were put and both are already answered by the code, which is worth
recording so they are not proposed a fourth time.** *Order the candidates by something that does not
depend on the box size* -- they already are: the four corners come in a fixed order pruned by the
open-arc table, and the polar raster behind them is generated from `defaultLabelOffset()` and the
reach floor, neither of which reads the text. **The candidate ORDER is already width-invariant; what
width changes is which candidate is CLEAR.** And *test the candidate ANCHOR rather than the whole box
when nothing is nearby* -- where nothing is nearby the whole box is clear anyway, so that changes
nothing in the open case it was aimed at, and where something IS nearby it is the proposal to ignore
the collision, which is text on text.

### 16h. WHAT EACH MOVED LABEL HIT, named one label at a time -- and the sentence this retracts

**Tom contradicted section 16g's conclusion, for the second time on this question, and he was right.**
2026-09-18: *"width and height are independent dimensions in an area of unlimited width. No amount of
additions to the string should affect placements. If you can't see that the following sentence is
nonsense in the context of unlimited width, maybe I need to turn up the effort level."* The sentence
he quoted was this record's own: *"when labels are close enough to touch, a wider one genuinely does
not fit in a gap a narrower one fits in, and there's no way around that without printing text on top
of text."*

**IT IS WITHDRAWN, on two counts.** It conflates a two-dimensional gap with a one-dimensional one: a
box that grows only in width can be blocked only by something lying in the direction it grew, so "it
does not fit in the gap" is a claim about a BOUNDED gap and nothing here had shown the gaps were
bounded. And it is a restatement dressed as an explanation -- "a wider box did not fit" says nothing
a person could check. **The standing rule that a question asked twice makes the CONCLUSION the
suspect is what should have caught it the first time.**

**So the placer was made to say, for every label that moved, which object its wider box hit that its
narrower box did not.** `dev/lpn-spike/label-width-cause-harness.js` replays the first-fit offline
from its own captured inputs, in its own committing order, **with a full scan instead of the
broad-phase grid** -- so the grid is excluded by construction -- and re-tests each mover's narrow
choice against the obstacle list exactly as it stood when that label was placed. The replay
reproduces the real pass **97 of 97** at both widths, which is what makes it evidence rather than a
second opinion.

| view | labels that move | grew into a real object, in the direction it grew | following a neighbour | unclassified |
|---|---|---|---|---|
| synthetic crowded | 9 of 13 | 9 | 0 | **0** |
| Net3-World fit | 58 of 97 | **14** | 44 | **0** |
| Net3-World 2x | 34 of 97 | **14** | 20 | **0** |

**FOURTEEN AT BOTH ZOOMS -- BUT NOT THE SAME FOURTEEN, and that overclaim is corrected here.** It
was written as *"the same fourteen at both zooms"* before anybody had printed the names; asked for
them (*"Name names"*), the lists share only `n:183` and `n:241`. The COUNT is stable and the
membership is not. Only fourteen labels in any one view ever grow into anything. Every one of them was checked for DIRECTION, not merely for contact -- the
harness fails a blocker that is not on the side the box grew towards -- and every one is a node
symbol lying past the growing edge, between 0.07 and 1.11 label-heights deep. **The other 44 and 20
never rejected anything at all with their own extra width**: 63 of those 64 were blocked only by a
label box that had itself moved, and the remaining one found its own first choice freed up by a
neighbour leaving.

**So the earlier answer named the minority mechanism as though it were the whole of it.** Three
quarters of what Tom is looking at is not width at all. It is that the pass places one label at a
time in importance order, so a label pushed off its first choice sits where a later label was going
to stand, and that label is pushed off in turn. Fourteen genuine collisions move fifty-eight labels.

**AND EVERY NAMED SUSPECT MEASURED ZERO**, which is the other half of the answer he is owed. There is
no rejection against a viewport or drawing bound anywhere in it (unlimited width is exactly the case
he names). The broad-phase grid contributes nothing: the full-scan replay reproduces the real pass to
the choice. The candidate set is identical at both widths on all 97 labels, so where a label may be
OFFERED a place does not read its text. No label's height changed. `dataLabelOrigin()` chooses its
side on `end.x >= anchor.x` and reads no width. `cardinalSides()` prunes on the open-arc table and the
resting offset, never on the box. Nothing reads box area. **The harness asserts all of these, and its
selftest kills a candidate reach keyed on the box width while leaving a constant shift of every
candidate uncaught.**

### 16i. THE FOURTEEN, BY NAME

Tom, 2026-09-18: *"Name names. Tell me which nodes had their labels run into something real."* Node
ID alone, `1234=` against no prefix, distances in label-heights. "Past the edge" is how far the
blocker's far side lies beyond the growing edge of the box; "overlap" is how deep the wider box sits
in it. Every one is a node symbol, and every one is on the side the box grew towards -- the harness
fails any blocker that is not.

| Net3-World, fit zoom | side | past the edge | overlap |   | Net3-World, 2x | side | past the edge | overlap |
|---|---|---|---|---|---|---|---|---|
| n:105 | right | 4.61 | 0.666 | | n:107 | right | 5.16 | 0.119 |
| n:115 | right | 2.95 | 1.109 | | n:169 | left  | 4.54 | 0.738 |
| n:117 | right | 4.30 | 0.268 | | n:179 | left  | 4.46 | 0.820 |
| n:121 | right | 5.93 | 0.340 | | n:181 | left  | 4.05 | 0.757 |
| n:127 | right | 4.29 | 0.947 | | n:183 | right | 3.16 | 1.141 |
| n:147 | right | 4.97 | 0.066 | | n:193 | left  | 4.04 | 0.834 |
| n:149 | left  | 4.24 | 0.807 | | n:199 | right | 3.55 | 0.804 |
| n:183 | right | 3.89 | 0.141 | | n:201 | left  | 2.90 | 0.517 |
| n:209 | right | 4.75 | 0.530 | | n:205 | right | 3.76 | 0.023 |
| n:213 | right | 4.16 | 0.208 | | n:207 | right | 3.08 | 0.153 |
| n:215 | right | 4.39 | 0.273 | | n:217 | left  | 4.69 | 0.022 |
| n:241 | right | 4.55 | 0.097 | | n:237 | left  | 5.21 | 0.067 |
| n:251 | right | 3.10 | 0.855 | | n:241 | right | 5.08 | 0.194 |
| n:271 | right | 2.83 | 0.131 | | n:255 | right | 4.33 | 0.952 |

`node dev/lpn-spike/label-width-cause-harness.js` prints this table on every run.

## 16j. THE ROOT DEFECT: A LABEL IS DROPPED WHILE IT STILL HAS ROOM (2026-09-19)

Tom, on being told fourteen collisions move fifty-eight labels: *"But there is infinite space
available. Moving is fine, but dropping is not."* **He is right, and this is the finding the whole
task was missing.**

**THE CANDIDATE SET IS BOUNDED THREE WAYS, AND A LABEL IS DROPPED THE MOMENT THOSE BOUNDS COME UP
EMPTY -- not when the drawing is full.**

| bound | where | what it says |
|---|---|---|
| RADIUS | `nodeFirstFitSpec()` passes `outer = max(3 x the resting offset, 1.5 text heights)` | nothing further than three resting offsets from the node is ever proposed |
| ARC | `cardinalSides()` rasters inside `widestArc(arcs)` | only the SINGLE widest gap between the node's own pipes; every other direction generates no candidate at all |
| COUNT | `polarCandidates()` stops at `max` (24), inner ring first | at most 24 raster points, plus the four corners |

So the whole search is at most 28 points, in one wedge, inside a small disc. `placeLabelsFirstFit()`
then writes `dropped: true` and the label is never drawn.

**MEASURED: NOT ONE DROPPED LABEL ANYWHERE WAS ACTUALLY ENCLOSED.** Each drop was re-searched against
the same obstacle list the pass itself had, relaxing one bound at a time so that whichever regime
first finds room is the bound that did it:

| view | text | dropped | room inside its own window (resolution) | room it never looked toward (arc) | room just past its reach (radius) | **genuinely enclosed** |
|---|---|---|---|---|---|---|
| Net3-World fit | none | 12 of 97 | 6 | 4 | 2 | **0** |
| Net3-World fit | `1234=` | **32 of 97** | 13 | 9 | 10 | **0** |
| Net3-World 2x | none | 1 of 97 | 1 | 0 | 0 | **0** |
| Net3-World 2x | `1234=` | 5 of 97 | 5 | 0 | 0 | **0** |

**Every single one had somewhere to go.** Thirty-two labels vanish from the fit view of his drawing
and the plane they were standing on was not full.

### 16k. WHERE THE BAD THINKING ENTERED, and it is one commit and one sentence

Tom, 2026-09-18: *"the stack of node labels visible with short ID only is quite amazing. I think we
should understand how that was accomplished and then understand what destroyed it... clearly it's
just some bad thinking."* **The history supports him exactly.**

Before `99de871e` (2026-08-16, Task 398, *"Node labels take the first-fit: two sides, then drop, and
links yield"*) **there was no drop at all.** The rule was stated at the top of `js/lpn-collide.js`:

> **THERE IS NO FAILURE CONDITION.** The best candidate wins; nothing declares defeat. Hiding and
> dropping lines are separate decisions, not a threshold in here.

Every node label was placed somewhere, because the ring scorer always returns its best candidate --
`placeLabels()` still does, and writes `dropped: false` unconditionally to this day. **That is the
amazing stack he remembers, and it was not a happy accident: it was a stated design rule.**

**THE SENTENCE THAT REVERSED IT IS STILL IN THE SOURCE, and it is the bad thinking:**

> A first-fit has no score to threshold: a position is clear or it is not, and **"neither side is
> clear" is a fact rather than a judgement.** That is what makes dropping expressible here and not
> there.

**It is not a fact.** It is a fact about a list of at most 28 points inside one wedge within three
resting offsets of the node. The argument silently promoted *"no room in the places I looked"* to
*"no room"*, and there was nothing in the reasoning or in any check to notice the difference -- the
table above is the first time anybody asked the drawing. The reversal was sound about SCORES (a
ladder with a finite top really cannot express defeat) and wrong about the plane.

**And the cost has been paid twice**, because every later measurement in this file is denominated in
drawn labels: section 16c's three damping attempts were rejected at 1,742 / 1,729 / 1,751 against
1,762, differences of 1-2%. Those numbers are counting which labels got the bounded search's scraps.

### 16l. VERDICT ON THE DAMPING PROPOSAL (option b), which Tom marked Recommended

*A settled label keeps its place when that place is still free.* It is aimed at the 44 followers, and
it would reduce visible churn. **But it is the papering-over he warned against, and it should not be
built first**, for three reasons:

1. **It cannot draw a single extra label.** A dropped label never had a place to keep.
2. **It is the third cousin of an attempt already measured.** Section 16c's *"a resting claim reserved
   for every unplaced label"* cost 11 drawn labels and did not reduce the movement at all.
3. **It leaves the cause standing.** The churn is largely DOWNSTREAM of the bounds: a label that
   falls through the bounded raster commits somewhere poor and displaces the next one. Widen the
   search so it lands somewhere good and much of the cascade has nothing to propagate.

**The order is: remove the bounds first, then re-measure the churn, then decide whether damping is
still wanted.** Doing it the other way round tunes the symptom and hides the measurement.

## 17. The labeling threshold's own default, measured (Task 669, 2026-09-18)

Tom, 2026-09-18: *"Widest view: Good. Now we need a default. How about when text height is larger
than twice the median link length? That's conservatively large, I think, but it gives us an upper
limit."* Built as he stated it, in `defaultLabelMaxWidth()`.

**The arithmetic, because the two sides are in different units.** Lettering is drawn in SCREEN
pixels, so its height in MAP units is `textSize / s`, and the number the box holds is a map width,
`minPx / s`. Setting `textSize / s = 2 x medianLink` and eliminating the scale:

    labelMaxWidth = 2 x medianLink x minPx / textSize

The scale cancels, which is the property that makes it usable: reading it at one zoom gives the same
answer as reading it at another, and it carries no number that assumes a size of network.

**What it actually produces**, measured through the page's own code at 1400x900 on the six shipped
examples. `fit` is the view `Zoom to fit` gives; `ratio` is how much further out you must go before
generated annotation stops being drawn:

| example | automatic threshold | fit view | ratio |
|---|---|---|---|
| Net3 | 332 | 64.9 | 5.1x |
| Net3-Novato-CA-World | 0.634 | 0.175 | 3.6x |
| Net2 | 1,312 | 173 | 7.6x |
| Elm Street Center | 12,611 | 1,008 | 12.5x |
| Net1 | 3,273 | 176 | 18.6x |
| Basic example (US) | 108,167 | 1,491 | 72.5x |

**His own reading is right and is if anything an understatement.** On the big examples it takes
three to eight times the fit view to trip; on the small ones, twelve to seventy. It is a guard
against a drawing that is nothing but lettering, not a working setting -- somebody who wants labels
to thin out sooner presses **Use current view**, which is what that button is for. The ratio varies
because `textSize` is a per-project setting and the examples do not agree on one.

**A STORED ZERO IS AN ANSWER AND NOT AN ABSENCE.** Clearing the box writes 0, meaning always show
labels; never having been asked is `null`, and takes the automatic number. Both render as an empty
box, so the placeholder says which one is in force and prints the automatic number rather than
keeping it a secret. `labelMaxWidthInForce()` is the one place the two are told apart, and
`Restore defaults` is the way back from a stored zero to the automatic width.

**It is sampled, not cached, and the cache is what went wrong first.** Keyed on the link count, a
cached answer survived a project switch and `switch-keep-harness.js` found 119 of 216 labels laid
out from the previous document's threshold. A stale threshold is invisible, because the number it
produces is always plausible. The work is bounded instead: at most 512 pipes at an even stride,
exact below that and a good estimate of the median above it.

## Sources

- Imhof, *Positioning Names on Maps*, The American Cartographer 2 (1975) 128–144.
- Christensen, Marks & Shieber, *An Empirical Study of Algorithms for Point-Feature Label Placement*,
  ACM TOG 14(3) 1995 — https://www.eecs.harvard.edu/~shieber/Biblio/Papers/tog-final.pdf
- Edmondson, Christensen, Marks & Shieber, *A General Cartographic Labeling Algorithm*, Cartographica
  33(4) 1996 — https://www.merl.com/publications/docs/TR96-04.pdf (implemented as GRASS `v.label.sa`)
- Wagner, Wolff, Kapoor & Strijk, *Three Rules Suffice for Good Label Placement*, Algorithmica 2001 —
  https://www1.pub.informatik.uni-wuerzburg.de/pub/wolff/pub/wwks-3rsgl-01.pdf
- Formann & Wagner, *A packing problem with applications to lettering of maps*, SoCG 1991.
- Verweij & Aardal, *An Optimisation Algorithm for Maximum Independent Set with Applications in Map
  Labelling*, ESA 1999.
- Been, Daiches & Yap, *Dynamic Map Labeling*, IEEE TVCG 12(5) 2006 —
  https://cs.nyu.edu/~visual/home/pub/infovis06.pdf
- Mote, *Fast Point-Feature Label Placement for Dynamic Visualizations*, Information Visualization
  6(4) 2007.
- Luboschik, Schumann & Cords, *Particle-Based Labeling*, IEEE TVCG 14(6) 2008.
- *From Top-Right to User-Right: Perceptual Prioritization of Point-Feature Label Positions*, arXiv
  2407.11996.
- ESRI: Maplex placement properties; *Weight labels and features*; *Reorder label-fitting strategies*;
  *Set an anchor point position for callouts*; *Polishing Your Halo* (ArcUser).
- QGIS: *Setting a label* (3.44); `pal::Problem` and `QgsCallout` API docs.
- Mapnik TextSymbolizer wiki. MapLibre Style Spec; Mapbox GL Collision Detection wiki.
- ASME Y14.2, *Line Conventions and Lettering* — leader clause. ISO 128-22:1999, leader and reference
  lines. AutoCAD MLEADERSTYLE Content tab.
- Penn State GEOG 486, *Label Placement* (restates Imhof's line rules).
