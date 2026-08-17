# "Most-open angle(s)" — Tom's brainstorm, checked against the literature

Tom's idea, recorded 2026-08-16; the literature pass he asked for was run 2026-08-17 against
`dev/label-placement-algorithms.md`. **Verdict: it composes with the survey's recommended shape
rather than competing with it, it is partly known and partly not, and it is NOT gated on Task 400
Phase 3.** That last point is the one that changes what we would do.

## Definitions

1. **Obstacle** is a node, vertex, text, or fixed/user label.
2. For efficiency, divide the universe into square regions of maximum size so that every node only
   has to evaluate obstacles in its own region and its 8 neighbors.
3. A node's obstacle **tracking radius** is the average distance to the nearest node or vertex on
   links connecting to it. For simplicity/speed this can be evaluated as a "square" radius at build
   time — compare x and y of universal or regional candidate obstacles independently against the
   criterion extrema using `>`/`<`, instead of a polar/circle formula.

## Idea

The local-context data for a node or a fixed/user label/text could determine its **most-open
angle(s)**, combining (a) the angles of its connecting links and (b) the angles to obstacles within
its tracking radius. A label placer would then prefer the direction with the least competition
around that anchor, rather than trying fixed candidate positions (top-right, straight-top, …) and
testing each for conflicts after the fact.

---

## What the literature pass found

### It is candidate GENERATION, and the survey's shape is candidate SELECTION

Wagner–Wolff's three rules and QGIS PAL's `reduce()`/`chainSearch()` are defined **over a candidate
set**; nothing in them says where candidates come from. Every method the survey cites simply inherits
the 8-position model (TR, T, TL, L, BL, B, BR, R) by convention. So this idea occupies a slot the
recommended shape leaves empty: it replaces a fixed, anchor-independent candidate set with an
anchor-specific one. **The two are orthogonal and both can ship.** It is not an alternative to Phase
3, and framing it as one would be a mistake.

### Partly known — and the closest published relatives are these three

- **ESRI Maplex's stated order of operations is this policy verbatim**: *first attempt to place in
  an area of free space*; only if overlap is unavoidable, *choose the location with the lowest total
  feature weight*. ESRI does not publish the search, so we get the policy and not the mechanism —
  but the policy is the industry default, not a novelty.
- **Luboschik, Schumann & Cords, *Particle-Based Labeling* (IEEE TVCG 14(6), 2008)** is the nearest
  published *mechanism*: fill the image with conflict particles where labels must not go, then place
  by raster query. Same instinct — read the occupancy around the anchor, place into the gap — done in
  raster space rather than angular space, and reported real-time.
- **Angular reasoning is already standard for LINE features** (Mapnik's `max-char-angle-delta`,
  default 22.5°), just not for point anchors.

**What the survey does not contain**: an angular-sector free-direction heuristic for point features,
named and evaluated as such. Tom's specific formulation — combine incident link bearings with
obstacle bearings inside a per-anchor radius to get a preferred direction — is not in the cited
literature.

### THE SYNTHESIS, and it is better than either source on its own

Tom, 2026-08-17, on being shown Luboschik's raster method: *"Raster is a viable option for candidate
generation and selection. But… we know something the general case doesn't know, that angle matters a
lot here. So whether unrelated candidate obstacles get swept up in our angle determination or not,
we do need to identify good and bad angular sectors, because no amount of nudging etc will get us
out of the bad ones, and there's no need to waste time on raster points there either. The combined
insight/rule may be to spend time only on raster points in good directions/angles."*

**Sectors PRUNE; raster REFINES inside what survives.** The two are a pipeline, not a choice:

1. Score angular sectors at the anchor from incident link bearings and nearby obstacle bearings.
   Cheap, view-independent, and it is the step that uses what we know and cartography does not.
2. Discard the bad sectors outright. **A bad sector cannot be escaped by local search** — relaxation,
   nudging and chain search all move a label *within* the region they start in, so effort spent
   raster-sampling a blocked direction is effort that could never have paid.
3. Raster/particle-sample only inside the surviving sectors for the exact position.

This also answers the Task 400 relaxation note properly: a nudge pass is not "of limited value until
labels start in open territory" — it is **downstream of sector selection by construction**, and the
sector step is what puts labels in open territory for it.

### The part that is genuinely ours, and why it is stronger here than in cartography

A cartographic point is **bare**. A network junction is not: every node knows the bearing of every
pipe meeting it, for free, before any obstacle search runs. Tom's term (a) is information generic
PFLP does not have, which is the real reason the inherited 8-position model is a poor fit for this
drawing and not merely an unexamined default. That is a legitimate argument that our problem is not
generic PFLP, and it is the strongest single point in the brainstorm.

### The constraint the pass surfaces: obstacle choice decides view-independence

Been, Daiches & Yap (*Dynamic Map Labeling*, IEEE TVCG 12(5), 2006) require a labelling not to churn
under pan and zoom, and Task 400 already names the view-independent conflict graph as its gate.

- Tom's **tracking radius is world-space by construction** (a mean distance along incident links), so
  it is view-independent and *better behaved than the relaxation it would feed*.
- But the **obstacle set as written is not.** "Text and fixed/user labels" have screen-dependent
  extents — a Text label's world width is 1/zoom, the same fact Task 403 is about — so including
  their boxes makes the chosen angle a function of zoom.
- **Fix: score openness against view-independent obstacles only** (node positions, link vertices,
  Text *anchors* — not label boxes). Label boxes stay where they belong, in the conflict/collision
  pass downstream.

### Openness WINS. Imhof is a tie-break with a small weight, and nothing more

An earlier draft of this file argued that a pure openness rule "will cheerfully put a label
bottom-left because bottom-left happened to be emptiest," as though that were a defect. **Tom,
2026-08-17: *"I disagree strongly… if it's emptiest, what else could beat that?"* He is right, and
the earlier framing overstated the case.** Imhof's TR > R > T > B > L and arXiv 2407.11996's
measured T > B > R > TR describe preference **among positions that are otherwise equally good** —
they are typographic and habitual, not legibility-critical. An empty direction beats a preferred
crowded one every time, and no cartographic source claims otherwise.

**The one real caution, and it is NOT about direction preference:** a drawing whose labels sit in
different directions for reasons a reader cannot see looks arbitrary. That argues for **hysteresis,
not for a preference weight** — do not flip a label's direction for a hair's difference in openness;
do flip it for a real one. A visible reason is what makes varied placement read as considered rather
than random, and "this side was open" is visible. So: **openness decides; preference breaks a true
tie; a threshold stops churn.**

### Tom's point 2 needs no research: it is standard, and we already do it

MapLibre's CollisionIndex is a uniform GridIndex profiled to 30 px cells; `grid()` in
`js/lpn-collide.js` is the same structure sized to the query radius. The square-vs-circle radius
shortcut is likewise standard practice for the same profiling reason. **Point 2 is confirmed, not
open.**

## What this changes

- **It is not gated on Phase 3, and its priority need not follow Task 400's lowered 15.** Phase 1
  (priority-ordered first-fit) is shipped, and its home position is the fixed
  `DEFAULT_LABEL_OFFSET = {x: 2, y: -2}`. Swapping that one constant for a per-anchor open direction
  is a small, independently testable change against already-shipped code — a much cheaper experiment
  than the conflict graph.
- **It supplies the precondition Task 400's relaxation note already assumes.** That note says a
  nudge pass is "of limited value until labels start in generally open territory (outward from
  congestion)." Most-open-angle *is* that starting step, so recording it as a Phase 3 sub-bullet had
  the dependency backwards.
- **Open question left for a build, not for more reading**: how many sectors. The literature's
  candidate counts are 8, then 6, then 4; a continuous angle has no published evaluation for point
  features and would need its own measurement here.
