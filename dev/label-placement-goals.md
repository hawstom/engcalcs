# Label placement: the goals and the method

**§1 is Tom's, written 2026-08-16, and it is the specification.** Everything after it is how the
goals get implemented and is subordinate to them. ROADMAP Task 379 is the work.

---

## 1. The goals, in priority order (Tom, 2026-08-16)

Definitions:

- **Text** is an element Label or a user Text object
- **Leader** is a line from a model element to text
- **Symbol** is a Node (Junction, Reservoir, or Tank), vertex, or link (Pump or Valve) symbol other
  than a link line
- **Link** is a Link line anywhere that is not a symbol

1. **User-dragged Leaders pass through their stored endpoint.** They can be stretched longer at the
   same angle.
2. **Labels avoid other Labels.**
3. **Labels avoid Leaders** including their own.
4. **Labels avoid Symbols.**
5. **Leaders avoid Symbols.**
6. **Labels avoid Links.**
7. **Leaders avoid orthogonality** (horizontality and verticality). They try to be 10 degrees away
   from orthogonal.
8. **Leaders avoid Links.**
9. **Labels leave padding for later.** A small change nearby should not rearrange the whole map.
10. **Labels minimize distance.**
11. **Labels seek the direction of least congestion.** Directions with the lowest sum aggregate
    candidate score are preferred.

**Deliberately NOT a goal:** keeping auto-placed labels at their initial position or side.

---

## 2. The method

Candidate scoring: for each label, generate candidate placements, score every one, take the best.

**Rank sets magnitude — there is no separate weight table.** A goal's position in §1 *is* its
weight. Tom, 2026-08-16: *"The ranking includes the lenience. See that pipes are low ranked? That
means they factor least in the score. You can be on a pipe and maybe still win."* An earlier
lenience table (labels 0, leaders 0.2, nodes 0.6, links 1.0) was retired for saying the same thing
twice.

**Goal 11 is not a rank. It is a term on the score field.** Tom, 2026-08-16: *"Not only consider the
point with lowest score. Also give some algorithmic credit for having neighbors with low scores."*

```
effective(c) = raw(c) + k * mean(raw over c's neighbours)
```

Not circular: neighbours contribute their **raw** scores. One pass, no iteration. "Favour open
space" stops being a goal to arrange for and becomes a property of the field. It is also expected to
deliver most of goal 9's stability for free, since the minimum of a smoothed field moves less under
a small perturbation than the minimum of a raw one.

**Goal 1 is not a score term either. It is a candidate generator.** A label whose leader was dragged
gets its candidates along a RAY from the stored endpoint, not around a ring.

**Placement order: hardest first.** Tom, 2026-08-16: *"high order junctions are more difficult, not
more important. Let the easy ones go last."* Dragged and Text labels are placed before any of it,
because they do not move at all.

**Candidate angles comply by construction.** Tom: *"Maybe we want to use angles that look good."*
The ring's own angles satisfy goal 7, so an orthogonal placement is never generated — rather than
generated and then penalised.

**There is no failure condition, and do not invent one.** Tom, 2026-08-16: *"we don't have a failure
condition defined. And maybe we don't need one."* The best candidate wins; nothing declares defeat.
Dropping lines (Task 343) and hiding are separate decisions, not a threshold inside this pass.

---

## 3. Settled by measurement

All three were open questions and all three were measured, in
`dev/lpn-spike/collide-harness.js`, on a deliberately over-constrained fixture: twenty-five labels
on a 5×5 grid one label-width apart, which is Net3's own situation and has no conflict-free answer.

- **The candidate set is the thin one, and it stayed thin.** Eight directions at two radii plus the
  current placement — seventeen. Tom, on a proposal to start at 48: *"Not so fast. Let's try it."*
  Measured: a ring four times as dense, scored with the same scorer, could improve the total by
  **0.64 across all twenty-five labels** — where one label lying on another costs 1.0 on its own.
  The extra 130 candidates per label buy about a twentieth of one avoided conflict each.
- **`k` = 0.25, and it is not the value that was guessed.** The first draft shipped 0.5 on the
  reasoning that more smoothing is more stability. Measured over four perturbation sizes, 0.25 is
  the joint minimum of both quantities it was chosen on — 12 changed placements of 96 chances
  against 20 at k = 0 and 30 at k = 0.5, and slightly less residual conflict as well. Past a point a
  smoothed field has broad flat minima and the argmin inside one of them moves freely. The curve is
  not monotone, because a perfect grid makes candidates tie in numbers; that is why this is a
  measurement and not a trend to extrapolate.
- **Goal 9 needs nothing beyond the smoothing.** At the shipped `k` a one-node perturbation moves
  40% fewer labels than at k = 0, which is what "a small change nearby should not rearrange the whole
  map" was asking for.

**One thing that was not on the list and had to be measured anyway: the clock.** The pass re-runs on
every frame of a drag. Scoring every candidate against every obstacle took **1.5 seconds** on 220
labels, Net3's own count. A uniform grid over the obstacles, queried at each label's own reach,
takes it to a few tens of milliseconds and — the part that matters — makes it linear where the
relaxation was quadratic: the old code is faster at 220 labels and slower at 1000. The index hands
its output through the same distance test the definition uses, because a 3×3 block of cells is three
times the area of the circle it stands in for and feeding that straight to the scorer cost more than
the index saved.

---

## 4. What was replaced, and where it lives now

`relax()` was a **local** method: pairwise separation along the axis of smaller overlap, four
passes. A label knew only what it was touching right now, so there was no term for open space and no
candidate it did not stumble into. Its weights decided *who yields*, not *where anyone goes* — which
is why no adjustment of them could have answered the original complaint about wasted space.

It is gone, and so are the two things it left behind:

- **`capNudges()` was a defect and went with it.** It ran *after* the relaxation and scaled an
  over-long push back along its own vector, frequently landing the label back inside the collision
  the pass had just solved, with nothing re-run. Scoring has no equivalent: its candidates are all
  within reach by construction, so there is nothing to correct after the fact.
- **Boxes ROTATE now.** An aligned pipe label's axis-aligned bounding box is **5.2×** the label's own
  area at 45° for a 100×12 px label, and the ratio grows without limit with its length — every one of
  those empty units was ground a neighbouring label was pushed out of for no reason. Oriented boxes
  via the separating-axis theorem give both the overlap and the depth, and an unrotated box is the
  same code at angle zero.

The pieces: `js/lpn-collide.js` holds the goals as weights, the geometry, the candidate generators
and the pass; `js/looped-network.js` holds the GATHERING — turning `doc`, the element handles and
the current font size into boxes and segments; `dev/lpn-spike/collide-harness.js` tests the first
without a browser.

`?debug=boxes` on the page URL draws every box the pass is reasoning about — blue for what was
placed, green for what it had to go round, red for the line obstacles. They are polygons, not rects,
because the boxes turn.
