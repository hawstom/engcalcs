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
its tracking radius.

*(The draft continued "rather than trying fixed candidate positions and testing each for conflicts
after the fact." Tom superseded that on 2026-08-17: the fixed positions stay, and the open-angle
table is what lets a placer skip one without re-examining the model. The settled design is below.)*

---

## What the literature pass found

### It is candidate GENERATION, and the survey's shape is candidate SELECTION

Wagner–Wolff's three rules and QGIS PAL's `reduce()`/`chainSearch()` are defined **over a candidate
set**; nothing in them says where candidates come from. Every method the survey cites simply inherits
the 8-position model (TR, T, TL, L, BL, B, BR, R) by convention. So this idea occupies a slot the
recommended shape leaves empty. **The two are orthogonal and both can ship.** It is not an
alternative to Phase 3, and framing it as one would be a mistake.

It does **not** replace the fixed candidate positions, though — see "the four positions stay fixed"
below, which is the settled design. It prunes them, and it generates candidates only after they run
out.

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
PFLP does not have, and it is what earns us **four** candidate positions where the literature
inherits eight — a reduction we can afford precisely because we know where the links are. That is a legitimate argument that our problem is not
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

### The four positions stay FIXED and CARDINAL; openness is a fast SKIP test

An earlier draft of this file, and of Task 411, said the idea was to "pick each label's home
direction from its own surroundings instead of a fixed top-right." **Tom, 2026-08-17: *"I disagree
strongly about the place of most-open-angle in this step. These quadrants are cardinal and
fixed."*** He is right, and the corrected design is cheaper as well as better:

1. **Four initial positions, in a fixed order: top-right, top-left, bottom-right, bottom-left.**
   Four, not the literature's eight — our narrower business earns the reduction. Top-first is
   Imhof's ascender argument; right-first is convention.
2. **Each position sits ENTIRELY INSIDE its quadrant.** That is the load-bearing constraint: it
   leaves an orthogonal link room to arrive without crossing the label.
3. **A link is never exactly orthogonal, so the quadrant must hold a tolerance.** Tom's estimate:
   30° is not practical, 15° may be, **5–10° is almost essential.** Expose it on the tester panel
   (Task 416) rather than freezing a guess.
4. **The open-angle table is consulted as a REJECTION test, not as a generator.** For the top-right
   candidate, ask the table for any dirty angle between 10° and 80°; if there is one, skip that
   candidate outright. This is a table lookup, not a geometry query — *"this saves us from looking at
   our model again at this moment."*
5. **Raster only after all four are exhausted**, inside the most-open sector.

**Openness wins over preference where they conflict** (Tom: *"if it's emptiest, what else could beat
that?"*) — Imhof's order is the fixed *attempt* order among four legal candidates, not a weight that
argues against an emptier direction later. The earlier draft's worry about "cheerfully choosing
bottom-left" was misplaced; the real risk is churn, which is answered by hysteresis, not preference.

### Exact sectors, not fixed wedges — and labels that advertise their space

Tom, 2026-08-17: *"Our focused cartographic business (nodes and links) lets us do better than 'say, 8
wedges of 45°'… We must (and can!) avail ourselves of the exact, say, 183 (Or 266!) degree fully open
sector that generation gives us."*

Right, and it follows from what makes our case special: incident link bearings are **exact** and
known before any search. Quantising them into 45° buckets throws away precision we were handed for
free, and a 183° opening bucketed to wedges reads as "four wedges clear" when the truth is a single
continuous arc with room to spare. Keep sectors as **arcs (start, end)**, merged.

**The cooperative idea, recorded because it is a real mechanism and not just a turn of phrase:**
*"we can boast to our neighbors about our open sectors. Nudge me! In fact, join me! I have all the
space in the world!"* A label that knows it has a wide open arc can advertise it, so a crowded
neighbour is drawn toward the space rather than each label solving alone. That is attraction added to
a model that today only repels, and it is the piece most likely to fix a jam that pure repulsion
cannot. **Unverified against the literature** — the survey's methods are all repulsion/conflict
based. Worth a search before building.

### The raster, and the oblique-axes trick

Open question Tom named and did not resolve: *"how we weed or seed a raster to be in our
most-open-sector; might it be polar after all instead of rectangular? Might it use a temporary
coordinate system that makes math simple given its bounding axes x-temp and y-temp?"*

A sector is naturally polar — bounded by two angles and a radius — so a polar sample grid needs no
rejection step at all, where a rectangular one samples a square and throws most of it away. That
alone probably decides it.

**On the trick's provenance, which Tom asked about:** *"This trick of 'define your own non-orthogonal
axes to simplify calculations' was taught to me in college. I never learned whether it was standard
or an invention of that professor."* **It is entirely standard** — a change of basis to an oblique
(affine) coordinate system. It is how oriented bounding boxes and rotating calipers work in
computational geometry, how isoparametric elements work in finite-element analysis, and how
crystallographers handle non-cubic lattices. The professor was teaching the standard tool.

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
