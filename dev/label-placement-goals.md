# Label placement: the paradigm, the goals and the method

**§1 and §2 are Tom's and they are the specification.** Everything after them is how the goals get
implemented and is subordinate to them. The survey the method stands on — the named GIS algorithms,
what each costs, and which we use — is `dev/label-placement-algorithms.md`. ROADMAP Tasks 393–396 are
the work.

---

## 1. Foundation (Tom, 2026-08-16)

### Definitions

- **label** — presentation of model data on a map
- **model** — mathematical and graphical representation of a physical water system
- **map** — view of the model
- **cartography** — the tradition, school, or discipline we follow for mapping
- **GIS** — the tradition, school, or discipline we follow for digital mapping
- **plane** — two-dimensional space
- **coordinate system** — way to quantify position and distance on a plane
- **unit** — method of expressing distances
- **position** — numerical description of a point location
- **coordinate** — x,y expression of a position
- **origin** — point from where distances to coordinate positions are measured
- **x** — horizontal ordinate distance from origin in given units and direction
- **y** — vertical ordinate distance from origin in given units and direction
- **scale** — ratio of a distance in two coordinate systems. Expressed here cartographically as
  local distance / base distance
- **symbol** — a scalable graphic feature like a reservoir. In GIS may also denote text, but not here
- **text** — a scalable typographic feature like a label or text object

Three more that §2 onward depends on:

- **Text** (capitalised) — an element Label or a user Text object
- **Leader** — a line from a model element to text
- **Link** — a Link line anywhere that is not a symbol

### Coordinate spaces

| space | also known as | units | origin | x | y | scale relative to | scale matters when |
|---|---|---|---|---|---|---|---|
| **Earth** *(not a plane system)* | globe, geoid | degrees | equator and meridian | — | — | — | — |
| **World** | ground, projection, local | length (SI or other) | as defined | right | up | — | — |
| **CSS** | browser screen | css pixel ("pixel") | upper left | right | down | — | — |
| **Model** | project | length | as defined | right | up | world | drawing (user) |
| **Image** | file | pixel | upper left | right | down | model | insert, adjust |
| **View** | window, layout | css pixel | upper left corner of the map canvas | right | down | model | view change, labeling |
| **Paper** | sheet, print | length (SI or other) | lower left of paper or printable area | right | up | — | printing |

**Where the View sits in the code**, since the table's own row cannot say it: the origin is the map
canvas's upper-left corner — `getBoundingClientRect().left/top` on the `<svg>`, so it is the CSS
origin shifted by wherever the canvas has landed in the page. The Model origin then sits at
`(state.tx, state.ty)` inside it, and `state.s` is the View-per-Model scale. `screenToWorld()` is the
one place that arithmetic is written, and `world.setAttribute('transform', translate(tx,ty)
scale(s))` is the one place it is applied.

### Scale and placement

- Every symbol/text object or category has independent scale-dependent placement decisions.
- **Visibility:** there may be a scale (px per length) below which a thing is best not drawn.
- **Fit:** when visible, it may need to be placed or adjusted.

### Conventions

- **Symbols are placed at their map location and never adjusted.**
- **Point labels are placed initially above and to the right of the point symbol.** This agrees with Imhof's
  own ordering for left-to-right scripts, and `DEFAULT_LABEL_OFFSET = {x: 2, y: -2}` already
  implements it.
- **Line labels are placed initially above, alongside the line.**

---

## 2. The goals, in priority order (Tom, 2026-08-16)

1. **User-dragged Leaders pass through their stored endpoint.** They can be stretched longer at the
   same angle.
2. **Labels avoid other Labels.**
3. **Labels avoid Leaders** including their own.
4. **Labels avoid Symbols.**
5. **Leaders avoid Symbols.**
6. **Labels avoid Links.**
7. **Leaders avoid Links.**
8. **Labels minimize distance and consequentially minimize need for leaders.**

Four goals came off the list on 2026-08-16, each for a reason worth keeping:

- **Leaders avoid orthogonality** — folded into the candidate ANGLES. *"Constrain leader angles to be
  at multiples of 15 degrees and not orthogonal. In other words, we don't check oddball angles, so we
  don't look ugly."* An ugly angle is never proposed, so nothing scores it.
- **Leaders agree in angle with each other** — the 15-degree grid already prevents disagreement finer
  than 15 degrees.
- **Labels leave padding for later** — *"redundant with scoring its neighbors."*
- **Labels seek the direction of least congestion** — *"covered by including the neighbors in the
  calculation."* It is the neighbourhood term, not a rank.

**On distance, which is rank 8 and easy to get wrong.** It is not a proxy for association — a leader
does that job. Tom, on a claim that distance only matters because leaders look busy: *"Wrong.
Distance covers a lot of sins. Let it be the proxy; it's easy. Measure it any way you want, but be
consistent, and short wins, but it's a weak ranker."*

**Position is not preserved across edits, but SIDE is preferred and sticky by a margin.** A label
that changes side for a hair's-breadth win changes it for a reason no reader can see, which is the
same argument `LPN_SIDE_SWITCH_MARGIN` already encodes for pipe labels.

### 2.1 The three phases (Tom, 2026-08-16)

**Phase 1 — jump node horizontal.** Node labels are placed initially at the most open side. On check,
if a label conflicts with another label, move it to the other side of the node. If it still
conflicts, drop it, lowest priority first.

**Phase 2 — drop link parts.** Link labels are placed aligned. On check, if a label conflicts, drop
part or all of it per user priorities. User priorities live at the right side of the Labels box,
after the decimals.

**Phase 3 — find node placement.** Use the standard GIS algorithms with the local feature context
model and the conflict graph.

### 2.2 Initial priorities (Tom, 2026-08-16)

**Link — the keep order; a label that will not fit sheds from the END.**

`flow` → `velocity` → `headloss` → `gradient` → `diameter` → `length` → `roughness` → `km` → `id`

So the flow survives longest and `length` sits with the other inputs, before roughness (Tom,
2026-08-16).

**`id` sheds FIRST, and this reverses the first draft.** It shipped never-shed, on the Maplex
key-number argument that an ID is what every other number on the label is attributed by. Tom
overruled it the same day, and he is right for a reason specific to link labels: **a link label lies
along its own pipe, so the drawing already says which pipe the numbers belong to.** The ID is the one
value on that label whose job the label's own position is already doing. The argument does not carry
to node labels, which is why no node ID rank exists at all.

**Node — which whole label gives up its place. Applied in this order, each clause active only when
that field is toggled on.**

| order | field | the label that drops | why not a user choice |
|---|---|---|---|
| 1 | demand | lowest demand | a zero-demand junction's label is genuinely uninformative — not merely mid-range |
| 2 | pressure | least extreme | the interesting pressures are the ends of the range |
| 3 | elevation | most like its neighbours' | elevation is a smooth spatial field, so a node sitting at its neighbours' height is readable off theirs (Tom, 2026-08-16 — this row was drafted as "least extreme" and corrected) |
| 4 | head | most like its neighbours' | same, and for the same reason: a head equal to its neighbours' is recoverable by eye from theirs |

**Between the two classes: LINKS PLACE FIRST, NODES SURVIVE FIRST** (Tom, 2026-08-16: *"node-outranks-
link is about dropping things. For placement, links have priority. But if there's no fit, the link
goes away."*). The two priority columns order within their own class; this is what orders across
them, and it is deliberately **two different orders for two different questions** — which is exactly
the distinction ESRI Maplex draws between *label priority* (who is attempted first) and what
ultimately gets left unplaced. They are not the same question and nothing requires them to agree.

- **Attempt order: links, then nodes.** A link label has the fewest degrees of freedom — it is bound
  to its own pipe — so it should choose while it still can. That is also what ships today, so this
  half is not a change.
- **Survival order: nodes, then links.** When something must go, it is the link. A node label names a
  place; a link label names a thing whose identity the drawing already shows.

**So the pass has a REPAIR STEP, and that is the structural consequence.** It is not enough to place
links and then place nodes: a node boxed in by a link label would drop, which is the wrong one. When
a node label finds no fit, the link label blocking it yields — it sheds a value in Phase 2, and in
Phase 1, where it has nothing to shed, it goes away whole — and the node is retried. Place, then
repair, is QGIS PAL's own shape (`init_sol_falp` then a bounded search), arrived at here from the
requirement rather than from the literature.

**Within a class the ORDER is the user's — that is what the priority column sets. The DIRECTION is
not.** There is
only one direction a cartographer would ever ask for in each row, which is why Tom's own list says
*lowest* for demand, *least extreme* for pressure, and *most like the neighbours* for the two
quantities that vary smoothly across the map. A per-row max/min/least-extreme picker was
considered and declined: four controls per row that a user must reason through to arrive back at the
only sensible setting. The direction table above is one compiled map, so a picker stays purely
additive if a real case for one ever appears.

---

## 3. The method

Placement has **two outcomes, placed and dropped.** Free link labels and dragged labels are scored
against a ring of candidates; node labels are placed by priority-ordered first-fit into two positions
and dropped if neither is clear.

**Dropping is priority-ordered first-fit, which is what MapLibre ships and what QGIS PAL runs as
`init_sol_falp` before any search.** Read globally, "drop the node with the lowest demand" would be a
search; it is not one. Place in rank order and whoever arrives at a full space is by construction the
worse-ranked of the pair, so the drop rule is a **sort key**, not a search.

*Rejected, and worth recording because it will be re-proposed:* scoring a "cannot fit" penalty into
the rank ladder instead of dropping. A ladder with a finite top always places something, so the worst
placement on the drawing becomes indistinguishable from a merely tight one, and no threshold read off
the score can tell them apart.

### 3.1 The three numbers, which are easy to conflate

ESRI Maplex keeps them separate and so must we:

| number | means | where ours lives |
|---|---|---|
| **label priority** | the order labels are *attempted* in, and therefore who gives way | `labelSettings.priority` — the new Labels-box column |
| **label weight** | how much a *placed* label resists being pushed out | not implemented |
| **feature weight** | how much a map feature resists being *covered* | `GOAL_WEIGHT` in `js/lpn-collide.js`, and **only this** |

**`GOAL_WEIGHT` is a feature-weight table. Do not merge the priority column into it.**

### 3.2 Rank sets magnitude — in the scorer

There is no separate weight or lenience table. A goal's position in §2 *is* its weight. Tom,
2026-08-16: *"The ranking includes the lenience. See that pipes are low ranked? That means they
factor least in the score. You can be on a pipe and maybe still win."* An earlier lenience table
(labels 0, leaders 0.2, nodes 0.6, links 1.0) was retired for saying the same thing twice.

**In first-fit the same order is read differently, and this is not a contradiction.** First-fit has
no score to compare, so the ranks become a **hard/soft partition**: Labels, Symbols and Leaders block
a position; Links and distance do not. That preserves "you can be on a pipe and maybe still win"
rather than silently promoting pipes to blockers — and it is independently justified, because a halo
already makes a number legible over a pipe (§3.6).

**Goal 11 is not a rank. It is a term on the score field.** Tom, 2026-08-16: *"Not only consider the
point with lowest score. Also give some algorithmic credit for having neighbors with low scores."*

```
effective(c) = raw(c) + k * mean(raw over c's neighbours)
```

Not circular: neighbours contribute their **raw** scores. One pass, no iteration. It applies to the
ring scorer only — a first-fit's two candidates are equidistant, so `k` has nothing to smooth there.

**Goal 1 is not a score term either. It is a candidate generator.** A label whose leader was dragged
gets its candidates along a RAY from the stored endpoint, not around a ring. A dragged label is never
dropped and never jumps sides.

**Candidate angles comply by construction.** The ring's own angles satisfy the old goal 7, so an
orthogonal placement is never generated rather than generated and then penalised.

### 3.3 The local feature context (Tom, 2026-08-16)

**One record per node, holding everything a placement or drop decision needs that does NOT depend on
the view.** That is the whole point of it: it is invalidated by a model edit or a solve, and by
nothing else — not a zoom, not a pan, not a drag frame. So it is built once and read on every frame,
where today the same quantities are recomputed inside a pass that runs sixty times a second.

It carries two kinds of thing, and both are stable:

- **Geometry, expressed as bearings.** The bearings of the incident links at this node, the resulting
  most-open side, and (for Phase 3) the occupied directions generally. **Bearings are
  scale-invariant; distances are not** — which is the whole reason this is expressed in angles. Every
  label dimension in this editor is a pixel figure divided by the zoom, so an openness measured in
  world distance flips side as you zoom and the label moves for a reason nobody can see.
- **Model data, as the rounded values that are actually printed.** Demand, elevation, head, pressure,
  and the neighbours' mean elevation and head — the inputs to the §2.2 drop comparator. Rounded
  display values rather than raw floats, so the rank agrees with the number on screen and cannot
  wobble on float noise. The neighbour means are exactly why this record has to exist: they are a
  read of the network's topology, not of one node, and recomputing them inside a pass that runs on
  every drag frame would be the most expensive thing in it.

The two live together because they are invalidated together and for the same reasons. Splitting them
would mean two caches with the same lifetime and two chances to forget one.

### 3.4 Placement order

**Priority first, difficulty as the tiebreak.** Difficulty — how much is already within reach — was
the sort key while nothing could be dropped, on the reasoning that a junction in a thicket should
choose while there are still candidates left. Tom, 2026-08-16: *"high order junctions are more
difficult, not more important. Let the easy ones go last."* That is still true and it is still the
tiebreak, but **once dropping is in scope the order decides the victim**, so it cannot be a congestion
heuristic alone. Dragged and Text labels are placed before any of it, because they do not move.

The order must not depend on anything a user changes by clicking, or labels rearrange themselves for
reasons nobody can see.

### 3.5 The fitting cascade

Maplex's Fitting Strategy is the named standard for a label that will not fit — stack → overrun →
reduce font → abbreviate → key-number, in the listed order. We have none of the middle rungs, so ours
is:

```
shed trailing values (per §2.2's link order) → drop the label
```

**The shed step is our own extension to that cascade, not a cartographic standard.** It is available
to us because an undragged link label is one inline row, so shedding a value shortens its RUN — the
extent it occupies along the pipe — and that run is exactly what both the short-segment rule and the
conflict test consume. The two "it does not fit" problems are therefore one cascade with two stopping
conditions, and `linkLabelTooShort()` becomes its terminal rung rather than a separate
all-or-nothing hide.

**Say RUN LENGTH, not width, and SEGMENT, not pipe.** Both corrections are Tom's, 2026-08-16, and
both were hiding a mistake rather than merely reading badly.

- *"Width is meaningless here in intuitive terms."* A label lying along a pipe has a run measured in
  the pipe's own direction, and what it must fit inside is a length in that same direction. "Width"
  invites the reader to picture the perpendicular dimension, which is not the constraint at all.
- *"'segment length', not 'pipe length'."* **This one was a real defect.** An aligned label is
  rotated to the angle of the ONE segment it sits on, so the rest of a bent pipe is not room it can
  use. The rule measured against the whole polyline, so a label near a bend was judged against a
  length it could never occupy: on the shipped example, a 767-unit pipe offering its label a 300-unit
  segment was told it had 767, and a 354-unit label therefore never shed. **Nothing is subtracted
  from the segment either** — taking a node's radius off each end was tried and is wrong, because an
  aligned label passes above a symbol rather than through it, and on a short stub the two radii ate
  the whole segment so no label could return.

**The band between shedding and hiding is the cascade itself, not a fudge factor.** Both rules
measure the same two quantities, which is correct: a label sheds while its run exceeds its segment,
and hides only if even its best single value still does. A 0.76 fraction was briefly inserted between
them to manufacture a band, justified by an invented claim that real pipes are either comfortably
long or hopelessly short. Tom: *"No. Where did you get that idea? That's far from the truth,
especially when lots of values are on display."* There was no evidence for it and it is gone.

**"Trailing" means trailing in the PRIORITY order, not in the row.** Values are drawn in reading
order (id, diameter, length, roughness, km, flow, …) and shed worst-rank-first, and those two orders
disagree — so what survives is an arbitrary *subset* of the row, never a prefix of it. Any arithmetic
that assumes a prefix is wrong in a way that still looks sensible, which is why the width bank sums
segments rather than running a total. Survivors keep reading order: a reader's eye learns a label's
order, and reshuffling what is left would make every shed look like a different kind of label.

**The shed is minimal.** It stops at the first subset that fits. Every value removed past that is
information taken from the reader for nothing, and nothing on screen says it happened.

A dragged label never sheds, for the same reason it never jumps: the user placed it.

**A SHED IS A DECISION ABOUT A RATIO, SO IT BELONGS TO THE ZOOM.** A label's run in world units is
its pixel width over the scale; its segment is a fixed world length. So what fits changes with the
zoom and with nothing else the drawing does — and a shed decided at one zoom and never revisited is
a ratchet. Every re-evaluation therefore starts from the FULL value list, never from what survived
last time, and the zoom path re-runs it (debounced, so a wheel spin costs one pass and not one per
notch). Recomputing from full is what makes UNSHEDDING possible at all.

**There is no repair pass, and its removal is part of the design rather than a tidy-up.** Phase 1
shipped before Phase 2, so a node label with nowhere to go took a blocking link label's ground and
hid it whole — the link had nothing to yield *with*. Now it has: the link label sheds values for the
node label before placement runs, which is the graceful form of the same ruling. Keeping the crude
mechanism alongside the graceful one left two doors to the same situation and a reader could not tell
them apart (Tom, 2026-08-17: *"I am sometimes observing the repair happening, which is confusing."*).
If a node label still cannot fit once link labels have shed, it drops — which is what §2.1 says.

**Status:** both conditions have shipped. What is not settled is how AGGRESSIVE the conflict rule
should be — a link label currently sheds for any node label it touches, including one that was
dropped, and that is deliberately eager so a blocked node label cannot deadlock. ROADMAP Task 404.

**A repeated chain sheds as one link, never per station.** A chain's whole justification is *the same
name said again*; if one station sheds and the next does not, it stops reading as one repeated name.
The shed count is the worst case over stations, and it is computed over the FULL station list — never
the drawn one, which is a function of the view rectangle. Deriving *content* from the view would make
a pipe's printed values change as the user scrolls.

### 3.6 Halos, and the division of labour

**Halos handle label-over-linework. Collision detection handles label-over-label.** No engine lets a
halo excuse a label–label overlap, and this is the independent justification for `labelLink` sitting
at the bottom of the ladder: a haloed number over a pipe is already legible, so the pass should not
spend a good position avoiding one.

Ours is `paint-order: stroke fill` with `stroke-width: 0.2em; stroke-linejoin: round` in
`css/engcalcs.css`. A centred stroke puts 0.1em outside the glyph, against Mapbox's cap of ¼ the font
size — comfortably inside convention, and **this needs no change.** The `em` is load-bearing: it
keeps the halo proportional to the lettering at every text size, which is what
`alignedLabelPlacement()`'s gap arithmetic assumes.

### 3.7 Leaders

A leader attaches at the **vertical centre of the NEAREST text line** — the top line when the anchor
is above the label, the bottom line when it is below — on the box side facing the anchor, through a
short horizontal landing, and is suppressed entirely below a leader tolerance (`leaderThreshold()`,
which is ESRI's leader tolerance under another name).

**NEAREST, not first, and that is a correction of an earlier reading of the standard** (Tom,
2026-08-16: *"those rules about attachment at the top line of text seem to penalize leaders that are
directly above… I suppose we could pretend that the first text line is the first text line that the
leader encounters"*). He is right, and the standard agrees with him rather than with the earlier
draft: ASME Y14.2 §4.9.3 says the horizontal portion meets the centre of the height of the **first or
last** letter of the note, and AutoCAD's own leader styles enumerate *middle of top line* and *middle
of bottom line* as siblings. A rule that always took the top line would drag a leader coming from
below straight up through its own text — the one thing the whole convention exists to prevent.
**"Nearest corner" is still QGIS behaviour and not a drafting standard**, and attaching at the box's
vertical centre — which is what shipped before — points at the middle row of a five-line label rather
than at the label.

**The landing is ONE TEXT HEIGHT, not ISO's 20 × line width.** Tom, 2026-08-16: *"a landing is
wasteful, but pretty… 20 * line width seems like a lot of landing when text size is 12 px or so. I
say we'd be wiser to make landing about one text height."* The arithmetic supports him — our leader
is drawn at a hairline, so 20 × line width lands near 20 px against 12 px text, more than one and a
half times the lettering. It is also inside the standard rather than a departure from it: ISO 128-22
gives the length as 20 × line width **or adapted to the length of the instruction**, and one text
height is that second form. Expressed in `em` for the reason the halo is (§3.6): it must stay right
at every text size.

He also asked that we *"follow the standard first and see what happens."* The way to honour that is
to make the landing length a number in one place, so the ISO figure can be tried against this one
without a rewrite.

The collision pass must model whatever the renderer draws, or it scores a leader that does not exist.

**Phase 1 needs none of this.** Both of its candidate positions sit at the resting offset, well
inside `leaderThreshold()`, so an auto-placed node label never draws a leader at all — Tom,
2026-08-16: *"I want to test Phase 1 and 2 without Phase 3, meaning with no leader scheme."* Leaders
remain only where the user dragged a label there. This section is therefore Phase 3 work, and
recording it now is what keeps it from being re-derived from the standard a third time.

---

## 4. Settled by measurement

Measured in `dev/lpn-spike/collide-harness.js` on a deliberately over-constrained fixture: twenty-five
labels on a 5×5 grid one label-width apart, which is Net3's own situation and has no conflict-free
answer.

- **The reach is set in TEXT HEIGHTS, not pixels.** It was 28 screen pixels, and a 3-line label at
  the default text size is 50 × 38.5 px — the whole search disc fitted inside the label, and four of
  its seventeen candidates sat within the label's own footprint, so no candidate could clear
  anything. Tom: *"There is no such thing [as a legibility cap], or lets say it's more than 5 * the
  label size. Leaders work. That's what they are for."* Now **30 text heights**, inner circle at 6 —
  one number for the whole map (*"A single one is better, I think. I didn't specify per label."*).
- **The near circles carry fewer directions than the far ones.** Tom's rule: **ring 1 multiples of
  45, ring 2 of 30, ring 3 of 15**, which after dropping orthogonals is **4, 8 and 20 directions — 33
  candidates including home.** At the shipped radii the arc between neighbours is 104 px / 77–155 px
  / 86–173 px, near enough constant.
  - **Rings 1 and 2 share no direction, by construction:** a direction on both is a multiple of 45
    and of 30, hence of 90, hence orthogonal, hence already dropped. They interleave rather than
    nest, which samples the plane better. Both are subsets of ring 3. Do not "fix" the gap.
  - On realistically spaced drawings essentially every label lands on the innermost circle and none
    goes beyond it — the reach bounds the search without shaping the answer. 220 labels cost ~50 ms
    sparse and ~95 ms crowded.
- **`k` = 0.25 is the shipped value, and its supporting measurement no longer holds.** It was
  measured against the OLD 17-candidate set; with the reach at 30 text heights the same sweep makes
  k = 0 best on both quantities, which suggests the neighbourhood term was compensating for a
  candidate set too small to reach open space. The value is unchanged pending Tom's ruling, because
  goal 11 is his, and the sweep is printed by `collide-harness.js` on every run. **After Phase 1 it
  governs link and dragged labels only.**
- **All of it is adjustable live under `?debug=labels`** — reach, inner circle, number of circles,
  arc spacing, `k`, zoom-to-fit room, and every rank weight, with a readout of the quality numbers.

**One thing that was not on the list and had to be measured anyway: the clock.** The pass re-runs on
every frame of a drag. Scoring every candidate against every obstacle took **1.5 seconds** on 220
labels, Net3's own count. A uniform grid over the obstacles, queried at each label's own reach, takes
it to a few tens of milliseconds and — the part that matters — makes it linear where the relaxation
was quadratic. The index hands its output through the same distance test the definition uses, because
a 3×3 block of cells is three times the area of the circle it stands in for and feeding that straight
to the scorer cost more than the index saved.

---

## 5. What quality means, and how it is measured

`?debug=labels` is the bench. **It must report the drop and shed counts FIRST**, because with
dropping in scope every other number it prints can be improved by dropping more: a layout that drops
half its labels scores perfectly on overlap pairs and on travel.

| readout | what it catches |
|---|---|
| **dropped** (nodes, links) | the cost of a first-fit that gives up too easily |
| **shed** (values removed) | the Phase 2 quality number |
| **flips under zoom** | pop-in / pop-out — the failure mode dropping introduces |
| **flips under pan** | **must read 0.** A correctness assertion wearing a readout's clothes |
| label-on-label pairs | goal 2, the failure a reader sees |
| label-on-leader | goal 3, the one Tom keeps photographing |
| mean travel | goal 8 |

**"Flips under pan" must be zero and is not today.** `drawnLinkLabelStations()` culls to the current
view rectangle and `placeStationedLabels()` builds obstacles from the result, so every node label's
placement depends on where the user has scrolled to. It is currently invisible because pan perturbs
*positions*. Once it perturbs *visibility*, labels appear and disappear as you scroll — which is
exactly the property Been, Daiches & Yap say an interactive labelling must have (the labelling is a
function of scale alone, never of pan). §3.3's local feature context is the structural answer.

---

## 6. What was replaced, and where it lives now

`relax()` was a **local** method: pairwise separation along the axis of smaller overlap, four passes.
A label knew only what it was touching right now, so there was no term for open space and no
candidate it did not stumble into. Its weights decided *who yields*, not *where anyone goes* — which
is why no adjustment of them could have answered the original complaint about wasted space.

It is gone, and so are the two things it left behind:

- **`capNudges()` was a defect and went with it.** It ran *after* the relaxation and scaled an
  over-long push back along its own vector, frequently landing the label back inside the collision
  the pass had just solved, with nothing re-run. Scoring has no equivalent: its candidates are all
  within reach by construction.
- **Boxes ROTATE.** An aligned pipe label's axis-aligned bounding box is **5.2×** the label's own
  area at 45° for a 100×12 px label, and the ratio grows without limit with its length — every one of
  those empty units was ground a neighbouring label was pushed out of for no reason. Oriented boxes
  via the separating-axis theorem give both the overlap and the depth, and an unrotated box is the
  same code at angle zero.

The pieces: `js/lpn-collide.js` holds the goals as weights, the geometry, the candidate generators
and the two passes; `js/looped-network.js` holds the GATHERING — turning `doc`, the element handles
and the current font size into boxes and segments; `dev/lpn-spike/collide-harness.js` tests the first
without a browser.

`?debug=boxes` draws every box the pass is reasoning about — blue for what was placed, green for what
it had to go round, red for the line obstacles. They are polygons, not rects, because the boxes turn.
