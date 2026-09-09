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
example per process because the aligned-shed pass converges across passes (Task 436).

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
he has not specified and the one part to report back on.** His proposal for making it affordable:

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
- **Not settled, and his own flag**: how `spot_prime` is found. Report back before building it.
- **Not stated either way, and now decided**: it is a REPAIR PASS after `shedAlignedForConflicts()`
  and after every other placement, which preserves every measurement in §8. See §10.

---

## 10. What phase two built, and what the two routes measure (Task 539, 2026-09-09)

Both routes are built, both are measured, and they are one function:
`Collide.repairCrossingGangs()` in `js/lpn-collide.js`, called from `runLabelCollisionAvoidance()`
after every other placement pass. `dev/lpn-spike/label-gang-harness.js` runs a shipped example four
times over -- repair off, brute alone, gang alone, both -- and prints the columns side by side;
`dev/lpn-spike/label-crossing-measure.js` is the measurement both label harnesses share, so there is
one sample and not two.

**It is a REPAIR PASS, per §9d.** Nothing that placed a label before it changed, so every number in
§8 is still the "off" column of the table below.

### 10a. The table. Pairs per view, every label field on, solved through EPANET

Each cell is the four views in order: zoom-to-fit, then 2x, 4x and 8x in from it. **Re-measured
2026-09-09 after §11c found the harness reading the first-fit's boxes beside the DOM's repaired
leaders; the numbers that stood here described a drawing that did not exist and understated every
route.**

| drawing | off | brute | gang | both |
|---|---|---|---|---|
| Net3-Novato-CA-World | 7 / 19 / 12 / 5 | 7 / 12 / 8 / 4 | 5 / 10 / 9 / 3 | **5 / 8 / 6 / 2** |
| Net3 (XY) | 15 / 8 / 5 / 1 | 15 / 6 / 4 / 0 | 8 / 7 / 2 / 1 | **8 / 6 / 1 / 0** |
| Net2 | 5 / 0 / 0 / 0 | 4 / 0 / 0 / 0 | 5 / 0 / 0 / 0 | **4 / 0 / 0 / 0** |
| Net1 | 1 / 1 / 0 / 0 | unchanged | unchanged | unchanged |
| Elm-Street-Center | 5 / 3 / 1 / 1 | unchanged | unchanged | unchanged |
| Basic example, either unit set | 0 throughout | 0 | 0 | 0 |

**Five findings, and the third is the one that decided the design:**

1. **The count falls on the drawing Tom marked.** Net3-World at the fit zoom goes 7 pairs to 5, and
   over its four views 43 to 21. Net3 (XY) goes 29 to 15 over its four. That is the comparison §8
   asked for and the strategy passes it. It is not enough for the target §11 records him setting,
   which is why there is a §11.
2. **The two routes fix different drawings, and neither dominates.** At the fit zoom of Net3-World
   the gang route alone takes 7 to 5 and the brute route alone takes 7 to 7; at 2x the brute route
   alone takes 19 to 12 and the gang route alone takes it to 10, and together they reach 8. His
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
   node labels carry `lx`, so they are the user's; the repair declines them all and its five flagged
   pairs stand. That is the correct answer, not a shortfall.
5. **A view CAN come out one pair worse while the drawing comes out better, and the harness is
   written for that even though no measured view does it today.** The zooms are read in sequence and
   `shedAlignedForConflicts()` seeds each pass from where the last layout put things, so a repair at
   one zoom changes what is shed at the next. *(Corrected 2026-09-09: the example that stood here --
   Net3 (XY) under the gang route running 15/8/5/1 to 12/9/3/1, one view up by one -- was the
   §11c measurement defect and not the drawing. The re-measured run has no per-view rise anywhere.)*
   The assertion stays over the four views together, because the mechanism is real and a per-view
   assertion would go red on a change that improved the drawing; the per-view rises are printed
   rather than hidden.

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
- **The measured cost on an idle machine is under 1 ms a pass on the small examples and 19-58 ms on
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
strengthening it.** The pairs that remain after phase two are 5 at the fit zoom of Net3-World and 8
on Net3 (XY); §11 drives all of them to zero by hiding one of each, at 2 to 7 labels a view. **So
what a `spot_prime` search would now buy is not fewer crossings -- there are none -- but fewer
HIDDEN LABELS**, which is a real gain and a much smaller one than the case this section was written
against. Count what a search would actually recover before building it: how many of the labels §11
hides had open ground within reach that the candidate list did not offer. That is the cheap next
measurement, and it is the difference between a feature and a search that finds nothing to do.

---

## 11. What phase three built: the target is ZERO, and the last remedy is hiding (Task 539, 2026-09-09)

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
fit and releases the ground; this says the label lost a crossing and keeps it.

### 11b. The table. Pairs per view and labels hidden to get there, every field on, through EPANET

Each cell is the four views in order: zoom-to-fit, then 2x, 4x and 8x in from it. `off/brute/gang/
both` are §10's columns re-measured (see 11c — they moved); `+shed` is what ships.

| drawing | off | both | **+shed** | labels hidden |
|---|---|---|---|---|
| Net3-Novato-CA-World | 7 / 19 / 12 / 5 | 5 / 8 / 6 / 2 | **0 / 0 / 0 / 0** | 4 / 7 / 6 / 2 |
| Net3 (XY) | 15 / 8 / 5 / 1 | 8 / 6 / 1 / 0 | **0 / 0 / 0 / 0** | 6 / 5 / 1 / 0 |
| Net2 | 5 / 0 / 0 / 0 | 4 / 0 / 0 / 0 | **0 / 0 / 0 / 0** | 3 / 0 / 0 / 0 |
| Net1 | 1 / 1 / 0 / 0 | 1 / 1 / 0 / 0 | **1 / 0 / 0 / 0** | 0 / 1 / 0 / 0 |
| Elm-Street-Center | 5 / 3 / 1 / 1 | 5 / 3 / 1 / 1 | **3 / 2 / 0 / 0** | 2 / 1 / 1 / 1 |
| Basic example, either unit set | 0 throughout | 0 | **0** | 0 |

**Four findings:**

1. **Zero is reached on every measured view of every drawing except where the user's own labels are
   both halves of the pair.** The residuals are named rather than averaged away: Elm-Street-Center
   `n:J11|n:JF-ELM`, `n:J12|n:J13`, `n:J14|n:J4` at the fit zoom and two of those at 2x; Net1
   `n:10|n:11` at the fit zoom. All six labels involved carry `lx` — Elm-Street has 14 hand-placed
   node labels out of 18 and Net1 has 3 out of 11. **That is the user's drawing and we do not
   overrule it.**
2. **The cost is small, and that is the number he needs in order to have ruled well.** The worst view
   on any drawing hides 7 labels, out of 98 drawn there; four of the seven examples hide none at any
   zoom. Hiding thirty labels to remove five crossings would have been a finding against the ruling;
   this is not that.
3. **A hide is worth more than one pair on a crowded view.** Net3-World at 2x clears 8 pairs with 7
   hides and at 4x clears 6 with 6, which is the degree term doing its work; the same view's repair
   moved 20 labels to clear 11 pairs before it.
4. **The cost in time is inside the phase-two budget.** The whole repair-plus-shed is 18-53 ms a pass
   on Net3-World with every field on, against 19-58 ms measured for the repair alone in §10 — the
   shed's own share is small because it runs only where a pair survived. Node with the DOM stub, so
   indicative rather than a browser measurement, and it swings by a factor of four on a loaded
   machine.

### 11c. TWO MEASUREMENT DEFECTS FOUND, and §10's table understated phase two because of one of them

Both were found by the phase-three assertion failing: the model said zero and the drawing said eight.
That is §10's third finding stated as a method — **when the model and the drawing disagree, the
measurement is the first suspect, not the pass.**

- **The harness read the first-fit's boxes beside the DOM's repaired leaders.**
  `repairCrossingGangs()` copies its placement list and replaces the entries it moved, so
  `placeLabelsFirstFit()`'s own result still holds the boxes as they were BEFORE the move — while
  the leaders `label-crossing-measure.js` reads come off the DOM and are the moved ones. Every
  number in §10 was therefore taken on a drawing that does not exist. **Corrected, phase two is
  better than §10 claimed: Net3-World runs 43 → 21 over its four views rather than 43 → 31**, and
  Net3 (XY) 29 → 15 rather than 29 → 23.
- **A Text object was reported as crossing itself.** `staticObstacles()` pushes a Text label's box
  and its own callout line as two unrelated entries, and `labelCrossings()` excludes only a
  placement's OWN leader — so every Text object with a callout counted as a pair, twice per view on
  the Basic examples. Both now carry `textOwner` and `crossingForeigners()` merges them into one
  placement, which is what they are on the map.

### 11d. A TWO-CYCLE IN THE GANG ROUTE, found by asking for stability and NOT the shed's

**Five passes over one untouched view of Net3-World, and the layout alternates A B A B A.** The shed
then hides `{10, 185, 187, 199}` on the odd passes and `{10, 184, 187, 205}` on the even ones. On
screen that is four labels swapping places on every content pass — a zoom step, an edit, a label
toggle — which is the flicker every pass in `js/lpn-collide.js` is written to avoid, and it is worse
than the crossing it replaces.

**It is not the shed's and it shipped with phase two.** Measured with the shed switched off and the
crossing PAIRS listed rather than counted: `off` repeats the same seven pairs five times, `brute`
repeats the same seven, and **`gang` alternates between two sets of five**. The shed is a
deterministic function of the layout it is handed and hides the same NUMBER every pass; what moves
is underneath it.

**The mechanism is Task 436's cross-pass coupling failing to converge.**
`shedAlignedForConflicts()` seeds each pass's obstacles from where the LAST layout put the node
labels, so a gang move changes how many values the pipe labels round it shed, which changes their
box widths, which changes the obstacles the next first-fit sees, which moves the gang back. The
drawn label SET is identical in both states — only the shed values and the node-label sides differ
— which is why nothing caught it: **the crossing count is 5 in both states, and until this the
harness compared counts.**

**Do not fix it by making the shed sticky.** Remembering last pass's victims would hide the symptom
in one pass and leave the labels underneath still swapping. Two candidate fixes, neither built and
neither cheap: seed `shedAlignedForConflicts()` from the node labels' HOME positions rather than
from the last layout, which decouples the two passes and moves every drawing; or damp the gang
route so a re-deal must beat the layout by more than one pair, which trades some of phase two's gain
for stability. **It is a Task 539 item and it is the next thing to take on this task.**

### 11e. The cluster in his screenshot, and what could not be reproduced

He sent Net3-Novato-CA-World at the fit zoom, upper left, around nodes 163/167/173/177/267, and
described labels overlapping each other with leaders through them.

- **The crossings there are gone.** Those ids are exactly where the surviving pairs were:
  `n:187|n:267` at the fit zoom, `n:171|n:173` and `l:213|n:267` at 2x, `n:167|n:169` and
  `l:213|n:267` at 4x, `n:171|n:173` and `l:177|n:161` at 8x. All of them are now 0.
- **The labels-on-top-of-each-other half could NOT be reproduced headlessly, and that is worth
  saying rather than claiming a fix.** `labelCrossings()` answers his two triggers and neither of
  them is label-on-label, so the measurement now takes that count separately —
  `label-crossing-measure.js` returns `overlaps` beside `counts` — and **it is zero on every view of
  every example, before and after this pass.** The most likely reasons the picture differs are that
  the harness renders at a fixed 1400x900 with every label field on, and that the DOM stub's glyph
  advance is nominal rather than a real font metric; a wider window changes the fit scale and
  therefore what sheds. **What he was looking at was the phase-two build, which still had 5 crossing
  pairs at that zoom, and a leader running through a label reads as stacking.** If it still looks
  stacked to him on the shipped build, the next measurement is the overlap count at his own window
  size, not another placement change.

---

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
