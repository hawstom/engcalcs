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

## 3. Open — to be settled by measurement, not argument

- **How many candidates.** Start thin: eight compass positions at two radii plus the current
  placement. Densify only if the neighbourhood term turns out to mean nothing at that spacing.
  Tom, 2026-08-16, on a proposal to start at 48: *"Not so fast. Let's try it."*
- **`k`**, the neighbour credit.
- Whether goal 9 needs anything beyond the smoothing.

---

## 4. What is being replaced, and the two things it leaves behind

`relax()` is a **local** method: pairwise separation along the axis of smaller overlap, four passes.
A label knows only what it is touching right now, so there is no term for open space and no
candidate it did not stumble into. Weights there decide *who yields*, not *where anyone goes* —
which is why no adjustment of them could have answered the original complaint about wasted space.

Two things the rewrite must handle:

- **`capNudges()` is a defect that disappears with it.** It runs *after* the relaxation and scales an
  over-long push back along its own vector, frequently landing the label back inside the collision
  the pass had just solved, with nothing re-run. Scoring has no equivalent — its candidates are all
  within reach by construction.
- **Boxes must be able to ROTATE.** An aligned pipe label's axis-aligned bounding box is **5.2×** the
  label's own area at 45° for a 100×12 px label, and the ratio grows without limit with length.
  Oriented boxes via the separating-axis theorem give both the overlap and the push vector in about
  30 lines, pure; an unrotated box is the same code at angle zero.

`?debug=boxes` on the page URL draws every box the pass is reasoning about — blue for what moves,
green for what it must avoid.
