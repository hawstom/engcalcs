# Label placement: the goals and the numbers, written down before the algorithm changes

Tom, 2026-08-15, on candidate-position scoring: *"This sounds better for us maybe. But only if we
get **straight on our goals and weights**. Maybe you better list those."*

He is right that they have never been written down. What ships today is a relaxation whose four
numbers were chosen here without a stated goal, and one of the two things that went wrong in the
Net3 screenshots was invisible for exactly that reason: nothing said what a leader's box was
*supposed* to represent, so nobody could see that it represented eleven pixels of a one-pixel line.

**This file is for review, not a record of a decision.** Nothing here is settled until Tom rules.

---

## 1. What is a "weight", in one paragraph

A weight is **not** a distance, a priority, or a radius, and it never decides where a label goes.
In today's relaxation it decides only **who gives way when two things overlap**: each box moves a
share of the separation proportional to the *other* box's weight. Two labels at 1 and 1 split a
shove evenly. A label at 1 shoved by a node symbol at 0.5 does two thirds of the moving. Something
immovable absorbs none of it, so the label does all of it.

That is the whole mechanism, and it is worth noticing how little it can express: **there is no way
to say "this is the important label" or "that corner of the map is empty."** Weights answer one
question, asked one pair at a time.

Under candidate scoring the word changes meaning, which is the main reason to write this file. A
weight there is a **penalty in a score** — every candidate placement gets a number, and the label
takes the best one. That *can* express importance, preferred side, distance, and open space,
because they are all just terms added together.

---

## 2. The goals, in priority order

Proposed. The order matters more than any number, because the numbers are chosen to produce it.

1. **A number must be readable.** Text over text is the failure; everything else is a preference.
   A value the reader cannot make out is worse than a value that is missing, because they will
   read it anyway and get it wrong.
2. **A label must be attributable.** The reader must be able to tell whose number it is, at a
   glance, without following a line. This is the goal that caps distance, and it is the one the
   unbounded relaxation violated when it carried labels 300px across Net3.
3. **The map must stay readable as a map.** Labels are annotation; the pipes and nodes are the
   drawing. This is why a label may sit on a pipe (a number over a line still reads) and may not
   sit on a node symbol or another label.
4. **A deliberate placement wins.** A label the user dragged, and a Text label they placed, are
   decisions. Automatic labels move around them, never the reverse.
5. **Stability.** The same drawing at the same zoom must produce the same placement every time,
   and a small change nearby should not rearrange the whole map. (Today's pass is idempotent —
   that part is worth keeping.)
6. **Use the space that is there.** Tom's actual complaint: *"There is lots of free space that is
   being 'wasted' while bad conflicts persist."* This is last in the list not because it is least
   important but because it is the one the current algorithm **cannot express at all**, which is
   the argument for replacing it rather than tuning it.

**What is deliberately NOT a goal:** keeping a label on the side of its node where it started.
Tom, 2026-08-15: *"Jumping sides: Yes! Even epanetjs does this. Why would the initial default be
sacred?"* The default side is a starting guess, not a promise.

---

## 3. The numbers today, and what each one is for

| Number | Value | What it means | Standing |
|---|---|---|---|
| `WEIGHT.pipe` | 0 | A pipe never pushes a label. Pipes are left out of the pass entirely rather than added with a zero. | **Keep.** A number lying on a line still reads. |
| `WEIGHT.node` | 0.5 | A node symbol pushes at half strength: worth stepping off, not worth fleeing. | Keep the *intent*; under scoring it becomes a moderate overlap penalty. |
| `WEIGHT.label` | 1 | Another label pushes at full strength. | **Keep.** Goal 1. |
| `WEIGHT.leader` | 1 | A leader line pushes as hard as a label. | Questionable. A rule through a number is bad, but a leader is one pixel wide and there are hundreds of them. |
| `WEIGHT.manual` | 1000 | A dragged label is immovable *and* very heavy, so "practically immovable" falls out of the same formula. | **Keep.** Goal 4, and it costs no second code path. |
| iterations | 4 | How many times the whole pairwise pass runs. Tom: *"What does 'four times over' mean?"* — this. Each pass separates every overlapping pair a little; four passes let a shove propagate four labels deep and no further. | **Retire with the algorithm.** It is a budget, not a decision. |
| `LPN_NUDGE_CAP_PX` | 28 | How far a label may end up from where it belongs. | **Keep the goal (2), retire the mechanism** — see below. |
| `LEADER_SAMPLE_*` | 3px / 2px / 200 | A leader is chopped into little boxes so one overlap routine handles every obstacle. | Fixed 2026-08-15; these were world units and are now screen pixels. |

**`capNudges()` is the clearest thing wrong with the current design.** It runs *after* the
relaxation has finished, and scales an over-long push back along its own vector. So a capped label
is left at an arbitrary point on the line to an answer — frequently back inside the collision the
pass had just solved — and nothing re-runs. The goal it serves (2) is right; applying it as an
afterthought is not. Under scoring there is no equivalent, because every candidate is within reach
by construction.

---

## 4. What the scoring version would need, and the numbers to argue about

For each label, generate candidates, score each, take the lowest, mark it occupied, move on.

**Candidates:** the eight compass positions around the anchor at two or three radii, plus the
current placement. Twenty or so per label. Cheap: Net3 has 97 nodes.

**Score = sum of penalties.** Every one of these is a number Tom should get to move:

| Term | What it punishes | Starting proposal |
|---|---|---|
| `overlapLabel` | Area overlapping another label, per unit area | 10 — dominant, goal 1 |
| `overlapNode` | Area overlapping a node symbol | 4 |
| `overlapLeader` | Area overlapping a leader line | 2 |
| `overlapManual` | Area overlapping a dragged or Text label | 100 — effectively forbidden, goal 4 |
| `overlapPipe` | — | 0, absent by design |
| `distance` | Screen pixels from the anchor | 0.3/px — this is what replaces the nudge cap |
| `sidePreference` | Using a less-preferred compass position | 0 for the default side, rising to ~5 opposite |
| `offMap` | Any part outside the visible canvas | large |

**And the decision the score cannot make: what to do when the best candidate still collides.**
Three answers, all already on the roadmap, and they are the same decision at three sizes:
drop a line from the label (Task 343), hide the label (Task 377), or accept the overlap. Proposed
order: try dropping lines, then accept a small overlap, then hide.

**The order labels are placed in matters and is itself a weight.** Whoever goes first gets the
best space. Proposal: manual and Text first (they do not move at all), then nodes by degree —
a junction with six pipes is a more important place on the map than a dead end.

---

## 5. How to tell whether it worked

Not by eye, and not by "that looks about right" — the same standard as everywhere else here.

- **Count, on each shipped example at its own fit scale:** labels overlapping another label,
  labels overlapping a node, total distance moved, and labels hidden. The current pass sets the
  baseline; scoring has to beat it on the first two without losing on the last two.
- **`?debug=boxes`** on the page URL draws every box the pass is reasoning about — blue for what
  moves, green for what it must avoid, red for the leader samples. Built 2026-08-15 at Tom's
  request (*"Would it be possible for you to depict these imaginary boxes temporarily?"*), and it
  is how the eleven-pixel leaders would have been caught in the first place.
- **Idempotence**, which costs nothing to assert: running the pass twice must give bit-identical
  placements.

---

## 6. Tom's review of the boxes, 2026-08-15, and what each finding turned out to be

He turned `?debug=boxes` on and came back with four things. Three are right, one is right about the
symptom and wrong about the cause — and that one is the most useful of the four.

### 6.1 "It's far too greedy or wasteful of free space" — RIGHT, and here is the mechanism

Two properties of `relax()`, neither of them written down before:

- **Each pair separates by the WHOLE overlap at once**, plus 0.1. Not a fraction, not a step
  toward a solution. A label overlapping five things in one iteration receives five full
  separations, added together, in that one iteration. That is what he meant by *"relax() is able to
  move things a lot in one pass, which is not what I understood."* It is, and there is no reason it
  should be — a fraction of the overlap per iteration is the usual form and is far calmer.
- **Nothing ever pulls back.** Every term in the pass pushes apart; not one attracts. So a label
  shoved aside on iteration 1 stays shoved on iteration 4 even if whatever crowded it has since
  moved away. **There is no restoring force toward home, and no term at all for "this space is
  free."** Between them, these two are the whole of "wasteful".

### 6.2 "Labels with no conflict are left alone... reset them to home after every zoom inward"

**The fix he proposes is already in force**, which is worth knowing before we spend anything on it.
`runLabelCollisionAvoidance()` zeroes every nudge and re-derives all of them from scratch on every
pass, and a zoom runs a full pass (`onZoomChanged` → `refreshFontSizes` → `relayoutLabels`). No
label carries a nudge across a zoom.

So the waste he is looking at is **not staleness** — it is 6.1, produced fresh at the scale he is
looking at. That matters for the decision in front of us: the cheap fix is unavailable, because it
is already done. What is left is the algorithm.

### 6.3 "If boxes can only be orthogonal rectangles, they are inadequate; can they be rotated?"

**Yes, and they should be.** Today an aligned pipe label — a long thin box at, say, 40° — is handed
to the pass as its axis-aligned bounding box, which for a long diagonal label is close to **twice**
the area of the label itself, all of it empty. The comment in `runLabelCollisionAvoidance()` calls
that "generous, and generous is the right direction to err in for a legibility guard." That was a
defensible call when the alternative was a second geometry path; it is not defensible as the reason
a quarter of the map is unusable.

The standard machinery is an **oriented box tested by the separating-axis theorem** — for two
rectangles it is four axis projections, and it returns not just *whether* they overlap but the
**minimum translation vector**, which is exactly the push the relaxation wants and exactly the
penetration depth a score wants. It is perhaps thirty lines in `lpn-collide.js`, it is pure, and it
is testable without a browser. An unrotated box is the same code with an angle of zero, so there is
no second path.

### 6.4 "Pipes have no model/boxes. They need a model even if their weight is lower"

**Agreed, and this reverses a decision made here, not by him.** The current comment says pipes are
"absent by design" because "a number sitting on a pipe still reads perfectly well." That is true of
*one* number crossing *one* pipe and false in a dense network, where it is the reason labels sit in
the middle of the drawing while the margins are empty — the pass literally cannot see the pipes.

Sampled the same way leaders are, at a low weight, a pipe becomes a mild preference rather than a
prohibition: a label steps off a line when there is somewhere to step, and lies across it when
there is not. That is the behaviour we claimed to have and did not implement.

---

## 7. Map units or screen pixels — the question Tom reopened

He is not persuaded by "the collision pass is about your eye, so use pixels", and his counter is
better than the argument it answers:

> *"Nothing gets saved in screen units. And nothing in screen units is immutable. If a user drags a
> label, it now has fixed map units. Maybe user positioning is the decision-maker that tilts us
> toward map units."*

**The distinction that dissolves most of the disagreement is DECISION versus STORAGE**, and they do
not have to match:

- **Every decision is about the eye and belongs in pixels.** Do these two boxes overlap on screen?
  Is that leader through that number? Is this label too far from its node to be attributable? None
  of those change if the drawing's coordinates are feet instead of metres, and all of them change
  with zoom. The leader-box defect was exactly a decision made in the wrong frame.
- **Everything persisted is a fact about the drawing and belongs in map units** — node positions,
  vertices, lengths. Not in dispute.
- **A collision nudge is persisted NOWHERE.** It is recomputed from zero on every pass, at the
  current scale. So it has no storage question at all, and the "nothing is saved in screen units"
  argument does not reach it.

**Which leaves exactly one genuinely open case: the drag.** And looking at it in that frame turns
up something we should decide deliberately rather than inherit:

- A dragged data label stores a **world** offset (`n.lx`, `n.ly`), while the text itself is sized in
  **screen pixels**. So as you zoom in, the text stays the same size and the gap between the label
  and its node grows in pixels — the label drifts away from what it names, and can cross the leader
  threshold and sprout a line the user never asked for. Zoom out and it collapses onto its node.
  **This is a candidate cause of some of the "far away" labels, independent of the relaxation**, and
  it is the one part of the symptom a drag does *not* fix, because the drag is what set it.
- The fix, if we want it, is to store a data label's drag as a **pixel** offset: it is furniture
  attached to an element, not a location in the drawing.
- **A Text label is the opposite case and should stay in map units.** It is content the user placed
  *in the drawing* — a caption on a district, the way text works in AutoCAD. It should sit where
  they put it and scale with the map, which is what it does now.

So the proposal is not "pixels win" but: **decisions in pixels; the drawing in map units; furniture
attached to an element in pixels; content placed in the drawing in map units.** The one change from
today is the data-label drag offset, and it is the one Tom's own criterion — *"user positioning is
the decision-maker"* — points at, once you notice that the user is positioning two different kinds
of thing.

**Not settled. This is the question to answer before Task 379 is built, because scoring bakes the
answer into every candidate.**

---

## 8. CONFIRMED, from a screenshot: that label was never pushed there

Tom, 2026-08-15, on a `?debug=boxes` capture of node 105 sitting ~370 px from its node at the end
of a long red leader, with two green boxes anywhere near it: *"How can that be possible? How can
this node label have arrived here from its home position with so few pushers?"*

**It cannot, and it did not.** The relaxation cannot put a label more than `LPN_NUDGE_CAP_PX` = 28
screen pixels from its home, at any zoom — `capNudges()` scales every nudge back along its own
vector, and the cap is divided by `state.s`, so it is a genuine screen distance. A label 370 px out
is a label whose **home is there**.

A node label's home is `n.x + n.lx`, and **the only code in the file that writes `n.lx` is the drag
handler** (line ~9127; the only other mentions are the y-flip on load). So:

1. The label was dragged, once, at some earlier zoom.
2. The drag stored a **world** offset — the gap in map units at the scale it was dragged at.
3. Every zoom since has multiplied that gap on screen, because the text is sized in **pixels** while
   the offset is in **map units**. Zoom in 10× and a 37 px drag becomes 370 px.

This is section 7's open question, observed. **It is a defect on its own, independent of Task 379,
and no amount of work on the placement algorithm touches it** — the pass is not involved.

**The falsifiable prediction, which is how to confirm it in one gesture:** zoom OUT and the label
walks back toward its node, in exact proportion to the zoom. Zoom in and it flies out again. A
drag fixes it *at that zoom only*.

**The fix, if Tom rules that way:** store a data label's drag as a pixel offset. It is furniture
attached to an element, not a place in the drawing. Existing documents hold world offsets and would
need a one-time conversion at load — the conversion is exact if we know the scale the drag was made
at, and we do not, so the honest migration is to convert at the scale the document opens at and
accept that a very old drag lands somewhere approximate. A Text label is the opposite case and does
not change: it is content placed in the drawing and stays in map units.
