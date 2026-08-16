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
