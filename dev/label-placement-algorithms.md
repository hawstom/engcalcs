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
