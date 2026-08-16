
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

## 10. Is preference implemented? No. (Tom, 2026-08-16)

> *"My inclination earlier was to suggest that preference has to factor in outside of relax(). I
> assume that's correct now... Now my understanding is 'preference is not implemented'. Is that
> correct?"*

**Correct on both counts.** It cannot live inside `relax()` — that function only ever looks at one
pair of boxes at a time and asks "are these overlapping, and by how much"; it never has two
candidate placements in hand to choose between, which is what a preference is a choice *among*. And
it is not implemented anywhere else either. Today the pass tries to clear **every** overlap
completely, and when it cannot, what you get is not a chosen compromise — it is wherever the last
push happened to leave the label.

**The nearest thing that exists, and it is worth knowing because it is the seed of Task 379:** the
aligned-pipe-label search in `placeStationedLabels()` walks a fixed list of stations outward from
the middle, takes the first one that is clear, and **falls back to the middle if none is**. The
side-flip does the same with two candidates. That is a preference over *positions* — try these in
this order — but there is still no preference over *conflicts*: the fallback accepts whatever
overlap the middle happens to have, without ever asking whether some other blocked station would
have been blocked by something cheaper.

Scoring is exactly that missing step. A candidate's score is a sum of what it costs, so "a pipe is
cheaper to overlap than a symbol" is one number in the table in section 4 rather than a behaviour
that has to be arranged for.
