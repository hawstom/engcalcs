# Label placement: the goals and the numbers, written down before the algorithm changes

Tom, 2026-08-15, on candidate-position scoring: *"This sounds better for us maybe. But only if we
get **straight on our goals and weights**. Maybe you better list those."*

He is right that they have never been written down. What ships today is a relaxation whose numbers
were chosen here without a stated goal, and one of the two things that went wrong in the Net3
screenshots was invisible for exactly that reason: nothing said what a leader's box was *supposed*
to represent, so nobody could see that it represented eleven pixels of a one-pixel line.

**This file is for review, not a record of a decision.** Nothing here is settled until Tom rules.

**Sections 1–6 were deleted by accident on 2026-08-15** and restored 2026-08-16. The commit that
added §9 replaced the whole file instead of appending to it, and nothing noticed because §9 reads
perfectly well on its own — while §10, the ROADMAP's Task 379 block, and `js/lpn-collide.js` all
went on pointing at §4, §6 and §7. They are back below, with §3's numbers brought up to what
actually ships and §7/§8 folded into §9, which supersedes both.

---

## 1. What is a "weight", in one paragraph

A weight is **not** a distance, a priority, or a radius, and it never decides where a label goes.
In today's relaxation it decides only **who gives way when two things overlap**: each box moves a
share of the separation proportional to the *other* box's weight. Two labels at 1 and 1 split a
shove evenly. Something immovable absorbs none of it, so the label does all of it — and against an
immovable obstacle the weight is read as INSISTENCE instead: how much of the overlap must be gone
when the iteration ends. 1 clears it completely.

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
   drawing.
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

Updated 2026-08-16 to what `js/lpn-collide.js` and `js/looped-network.js` actually contain. The
fractional weights the original table defended are gone — see §3.1.

| Number | Value | What it means | Standing |
|---|---|---|---|
| `WEIGHT.pipe` | 1 | A pipe is a line obstacle like any other and the pass clears the whole overlap. | Keep as a WEIGHT. The "a number on a line still reads" argument is a LENIENCE and lives in §4. |
| `WEIGHT.node` | 1 | A node symbol, likewise. | Same. |
| `WEIGHT.label` | 1 | Another label. | **Keep.** Goal 1. |
| `WEIGHT.leader` | 1 | A leader line. Leaders are tested as SEGMENTS now, not as a chain of sample boxes. | **Keep.** |
| `WEIGHT.manual` | 1000 | A dragged label is immovable *and* very heavy, so "practically immovable" falls out of the same formula. | **Keep.** Goal 4, and it costs no second code path. |
| iterations | 4 | How many times the whole pairwise pass runs. Each pass separates every overlapping pair; four passes let a shove propagate four labels deep and no further. | **Retire with the algorithm.** It is a budget, not a decision. |
| `LPN_NUDGE_CAP_PX` | 28 | How far a label may end up from where it belongs. | **Keep the goal (2), retire the mechanism** — see below. |

### 3.1 Why every weight is 1

Tom, 2026-08-15: *"Obviously you mistook pipe avoidance preference for weight. Right? ... Pipes and
nodes are both weight 1."* Correct. Under insistence, a weight answers "how much of this overlap
must be gone", and for every real obstacle the honest answer is "all of it". A fraction there does
not say "prefer to sit on a pipe rather than on a symbol" — it says "always leave part of this
overlap uncleared, even when the label had somewhere perfectly good to go", which is why labels sat
on pipes with open space beside them.

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

### 4.1 LENIENCE — Tom's numbers, 2026-08-16

> *"Conflict lenience: I assign these tentative lenience values: labels=0, leaders = 0.2,
> nodes=0.6, links=1.0"*

**Lenience is how forgiving we are about a kind of collision when they cannot all be avoided** —
high lenience means easy to accept. It is a property of the ALTERNATIVES, not of the obstacle: it
needs one placement to compare against another, which is why it cannot live in `relax()` and does
not exist anywhere in the code today (§10).

The score wants the inverse — a penalty — so the table below is `1 − lenience`, and the
tentative numbers are Tom's:

| Overlapping… | Lenience (Tom) | Penalty = 1 − lenience | Reading |
|---|---|---|---|
| another label | 0.0 | **1.0** | Text over text. Never acceptable; goal 1. |
| a leader line | 0.2 | **0.8** | A rule drawn through a number is nearly as bad as text on text. |
| a node symbol | 0.6 | **0.4** | Worth stepping off when there is somewhere to step. |
| a pipe | 1.0 | **0.0** | A number lying across a line still reads. Free. |

Two things worth saying out loud before anyone builds on these:

- **A leader is stricter than a node symbol here, and that is deliberate.** A symbol is a small
  filled dot a number can sit beside; a leader is a long line that crosses the number's stroke
  weight at some arbitrary angle. Anyone tempted to "fix" the ordering should read this row first.
- **Pipes at 0 does not restore the old `WEIGHT.pipe = 0`.** The pass still clears a pipe overlap
  when it can (weight 1, §3.1); lenience 1.0 only says that if some candidate has to lose, losing
  to a pipe is the free one. That distinction is exactly the one the fractional weights collapsed.

### 4.2 The rest of the score

Every one of these is a number Tom should get to move. The overlap terms are the §4.1 penalties
multiplied by the overlapping AREA, so a graze costs less than a burial.

| Term | What it punishes | Starting proposal |
|---|---|---|
| `overlapLabel` | Area overlapping another label, per unit area | 1.0 (§4.1) |
| `overlapLeader` | Area overlapping a leader line | 0.8 (§4.1) |
| `overlapNode` | Area overlapping a node symbol | 0.4 (§4.1) |
| `overlapPipe` | Area overlapping a pipe | 0.0 (§4.1) |
| `overlapManual` | Area overlapping a dragged or Text label | 100 — effectively forbidden, goal 4 |
| `distance` | Screen pixels from the anchor | 0.3/px — this is what replaces the nudge cap |
| `sidePreference` | Using a less-preferred compass position | 0 for the default side, rising to ~5 opposite |
| `offMap` | Any part outside the visible canvas | large |

**Scale matters and is not yet settled.** The overlap terms are per unit area, `distance` is per
pixel, and nothing here says how many square pixels of overlap are worth one pixel of travel. That
ratio is the one number that decides whether the pass looks calm or twitchy, and it should be
measured against the §5 counts rather than guessed.

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
to the pass as its axis-aligned bounding box. Tom on the size of that waste: *"No. It's far more
than twice."* He is right — for a 100×12 px label at 45° the AABB is **5.2×** the label's own area,
and the ratio grows without limit with length.

The standard machinery is an **oriented box tested by the separating-axis theorem** — for two
rectangles it is four axis projections, and it returns not just *whether* they overlap but the
**minimum translation vector**, which is exactly the push the relaxation wants and exactly the
penetration depth a score wants. It is perhaps thirty lines in `lpn-collide.js`, it is pure, and it
is testable without a browser. An unrotated box is the same code with an angle of zero, so there is
no second path.

### 6.4 "Pipes have no model/boxes. They need a model even if their weight is lower"

**Agreed, and this reversed a decision made here, not by him.** Pipes are now segment obstacles at
weight 1, tested by the same `pushOffSegments()` the leaders use. What he called "even if their
weight is lower" is the LENIENCE of §4.1, which the relaxation still cannot express.

---

## 7–8. Superseded

Section 7 asked map units or screen pixels for a dragged label's stored offset, and section 8
claimed a screenshot proved a dragged label drifts with zoom. **Both are closed by §9**: Tom ruled
that storing the leader endpoint in map coordinates is correct, and the far-flung label was one he
had dragged there by accident. Kept as a heading so the ROADMAP's references resolve.

---

## 9. Tom's rulings, 2026-08-15 — section 7 is CLOSED and section 8 was a wild goose chase

**The storage frame is settled, against what section 7 proposed:**

> *"A user-dragged label should remember only the map coordinates of its leader's endpoint. Nothing
> about the text itself is remembered. This behavior seems correct to me."*

That is what the code already does — `n.lx`/`n.ly` are the endpoint in map units and the text hangs
off it — and his five zoom screenshots show it behaving correctly at four scales. **So there is no
pixel-offset change, section 7's "furniture in pixels" conclusion is withdrawn, and Task 380 is
closed as not-a-defect.** The label in the earlier screenshot was one he had dragged by accident:
*"I accidentally dragged it? To there? OK. I reset it, and that fixed it. What a wild goose chase."*

**But the accident was ours to prevent, and that part is real.** His rule for it is exact:

> *"Store the user's leader endpoint and hold it constant. If you extend it, don't overwrite it.
> Your extension is temporary."*

The collision nudge is our extension. The drag seeded its offset from `nodeLabelPos()` — base **plus**
the live nudge — and the first pixel of movement wrote that to `n.lx`. So a stray jiggle on a crowded
label froze it at wherever the automatic pass happened to have put it, permanently, and handed the
pass one more immovable weight-1000 obstacle. **Fixed with a 3px movement threshold on the three
label drags** (`LABEL_DRAG_TYPES` / `LABEL_DRAG_SLOP_PX`); a deliberate drag clears it in the first
frame and feels identical.

**And one paragraph in the earlier write-up was simply wrong.** It said a drifting dragged label
"sprouts a leader nobody asked for". Tom: *"This is nonsense. A label you drag already has a leader.
The entire paragraph reads like slop."* Correct — a dragged label is past the leader threshold by
construction. Struck.

**Halos (Task 376) change the damage, not the placement.** Tom: *"The real world effect of all of
this changes significantly if we implement halos on the text. But I suppose it wouldn't change our
crazy placements."* Exactly so — a halo makes an overlap readable; it does not make a placement good,
and every count in section 5 stays the measure.

---

## 10. Is lenience implemented? No. (Tom, 2026-08-16)

> *"My inclination earlier was to suggest that preference has to factor in outside of relax(). I
> assume that's correct now... Now my understanding is 'preference is not implemented'. Is that
> correct?"*

**The word is LENIENCE, not preference** — Tom's correction in the next breath, and it is the
better one: a preference sounds like a wish about where a label should go, while lenience says
plainly how forgiving we are about a particular kind of collision. **Mind the direction, because it
is the reverse of the number he first gave**: a pipe is the MOST lenient obstacle on the map (a
number lying across a line still reads) and a node symbol among the least, so high lenience means
easy to accept. A score penalty is lenience inverted.

**Correct on both counts.** It cannot live inside `relax()` — that function only ever looks at one
pair of boxes at a time and asks "are these overlapping, and by how much"; it never has two
candidate placements in hand to choose between, which is what a lenience ranking is applied *across*. And
it is not implemented anywhere else either. Today the pass tries to clear **every** overlap
completely, and when it cannot, what you get is not a chosen compromise — it is wherever the last
push happened to leave the label.

**The nearest thing that exists, and it is worth knowing because it is the seed of Task 379:** the
aligned-pipe-label search in `placeStationedLabels()` walks a fixed list of stations outward from
the middle, takes the first one that is clear, and **falls back to the middle if none is**. The
side-flip does the same with two candidates. That is a preference over *positions* — try these in
this order — but there is still no LENIENCE over *conflicts*: the fallback accepts whatever
overlap the middle happens to have, without ever asking whether some other blocked station would
have been blocked by something cheaper.

Scoring is exactly that missing step. A candidate's score is a sum of what it costs, so "a pipe is
cheaper to overlap than a symbol" is one number in the table in §4.1 rather than a behaviour that
has to be arranged for. **His tentative numbers are now in that table** and are what Task 379
should be built against.

## §8 The replacement algorithm, moved here from ROADMAP Task 379 (2026-08-16)

**The diagnosis: `relax()` is a LOCAL method.** Pairwise separation along the axis of smaller
overlap, four passes; a label knows only what it is touching now. There is no term for open space
and no candidate it did not stumble into, so **no tuning of the weights will give it that** —
weights decide who yields, not where anyone goes.

**Candidate scoring is the standard cartographic answer and is simpler than what is here.** Generate
N placements per label (eight compass positions at two or three radii, plus the current one), score
by overlap area against everything already placed plus small penalties for distance from the anchor
and for less preferred positions, take the best, mark it occupied. Open space wins by construction.
Deterministic, idempotent, bounded — and it composes with Task 377: if the best candidate still
overlaps, hide the label rather than place it badly.

**`capNudges()` is a defect in the meantime and disappears with the rewrite.** It runs after the
relaxation and can drop a label back inside the collision it had just solved, with nothing re-run.
Scoring has no equivalent, because its candidates are all within reach to begin with.

**Boxes must be able to ROTATE.** An aligned pipe label's axis-aligned bounding box is **5.2×** the
label's own area at 45° for a 100×12 px label, and the ratio grows without limit with length.
Oriented boxes via the separating-axis theorem give both the overlap and the push vector in about 30
lines, pure, and an unrotated box is the same code at angle zero.

**`?debug=boxes` draws the boxes** in the colour of what they are. A URL parameter rather than a
settings row, which would be a translated string in 27 files for a tool that reviews one algorithm.
The default side is not sacred — scoring may put a label anywhere around its anchor.

**Order of work: 379, then 343 (dropping lines by priority), then 377 (hide) as the last resort.**
All three are the same decision — what to do when there is not room — at three granularities.
