# Placer C, round 7: strategy card

`js/lpn-placer-c.js`. IDs are from `dev/label-placement-strategies.md`. Every ingredient below can
be switched off: `PLACER_C_OFF=evict,fine node dev/lpn-spike/label-bench/run.js --placer
js/lpn-placer-c.js --room` (`all` turns every one off); on the page, set
`EngCalcs.lpnPlacerCOff = ['evict']` before the placer is created.

## 1. The recipe

Passes over one view, in order. Ingredients new this round are in **bold**.

1. **Hand-placed labels** first, whole, at the user's point (N4).
2. **KEEP** (S13): a label shown last view tries its old spot and rows first. **HOME**: a kept label
   on a leader, or out of its usual shape, goes back beside its owner when there is room.
3. **Order, `fewest` (new, my own: most-constrained first).** For each label, count how many of its
   first 120 candidate spots are open on the fixed map (symbols, Text, pipes, screen edge) for its
   smallest form. Place the label with the fewest open spots first; the least crowded home breaks
   ties. The counts are the static costs SHOW needs anyway, so they are kept and not judged twice.
   Counting stops once half the soft time bound is spent (the rest count as unconstrained).
4. **SHOW** (S2, S3, S11): every other label in its smallest form, which is now **the last value in
   the user's drop order, with the ID in the order like any other value** (an order that does not
   name the ID drops it first, as the bench's contract does). Candidates: the 8 standard positions
   and the open sectors between pipes (S1), leaders of 4 lengths in 16 directions, pipe labels along
   the pipe on either side sliding from the middle (S4), cheapest first. Never cut short by time.
5. **GROW** (S11) in rounds, one value at a time. **`deepgrow`**: each step looks 3x further down the
   label's candidate list (150 spots, not 50).
6. **MEND / NUDGE** (S16). **`evict`**: the blocker may be a label's leader as well as its text (my
   label on their leader, my leader through their text or across their leader), and up to two
   neighbours may be moved at once; a neighbour moves with its own rows or falls back to its
   smallest form, and the move is kept only if every one of them still shows.
7. **`fine` REPAIR** (S3, S15 built inside): a label still hidden tries rays every 15 degrees at
   every half row out to 4 rows, hung by its end-row middle or by its near corner; then it may evict
   (as in 6) using those rays, and evicted neighbours may rehome on them; then every label grows
   again on them.
8. **`finest`**: a label still hidden tries 72 directions at every quarter row, then evicts on them;
   then every cut label tries to grow on them.
9. **ALIGN** (R14): a pipe label left level where the setting asks for along takes any aligned spot
   now free for the same rows. **Repeats** (R9).

**Time (S21), not switchable because R10 requires it:** past 450 ms a pan or zoom stops improving
(GROW, MEND, REPAIR, FINEST) and returns what it has placed; past 750 ms any search still running
returns its best. A pause (`idle`) is anytime as well: it keeps what it placed instead of throwing it
away when time runs out. Setup and the layout fingerprint look only at what lies near the view.

## 2. Why: each ingredient switched off

`run.js --room` on the six public scene sets (20 views, 3,895 labels, 13,145 values requested), one
process, AMD Ryzen 9 5900X, node 24. Crossings: leader on leader / label on leader / label on pipe /
leader on pipe, then the bench's weighted cost. "Strict" is my own stricter self-test, which also
refuses ground under another label's leader, a leader through another label's text, and a leader
through any part of a node symbol, at 5-degree and quarter-row steps.

| Run | Labels | Values | Hidden with room (strict) | Cut with room | Crossings | Cost | ms median / max |
|---|---|---|---|---|---|---|---|
| Round 6 placer (before) | 3379 | 7262 | 148/516 (18) | 228/2112 | 0/3/741/122 | 1613 | 13 / 73 |
| Everything off | 3080 | 6659 | 210/815 (65) | 235/1887 | 0/0/816/148 | 1780 | 17 / 79 |
| **Round 7, all on** | **3329** | **7898** | **91/566 (6)** | **80/1696** | **0/1/855/258** | **1971** | **133 / 459** |
| `deepgrow` off | 3319 | 7797 | 100/576 (3) | 88/1723 | 0/6/850/253 | 1971 | 142 / 463 |
| `evict` off | 3186 | 7826 | 149/709 (26) | 82/1507 | 0/0/821/230 | 1872 | 108 / 458 |
| `fine` off | 3308 | 7741 | 116/587 (5) | 115/1749 | 0/1/835/231 | 1904 | 138 / 458 |
| `finest` off | 3323 | 7789 | 106/572 (7) | 98/1737 | 0/1/845/257 | 1950 | 61 / 269 |
| `fewest` off | 3285 | 7875 | 85/610 (10) | 102/1659 | 0/4/877/206 | 1972 | 124 / 461 |

The round 6 placer kept the ID and dropped every value first, which the bench now counts as a
drop-order break (2082 of 2112 cut labels). Its smallest form was a 2-to-4-character ID; now it is
a value such as `P=54.11`, three times wider. That is why "everything off" shows 300 fewer labels
than round 6, and why round 7's labels are compared with that row. Against it, round 7 shows 249
more labels and 1,239 more values, and leaves 6 hidden labels with strict room instead of 65. No
N1, N3, N4 or N5 break anywhere. No leader crosses a leader. The extra cost is labels and leaders
on pipes, the two cheapest crossings, from showing more.

`evict` is worth the most labels (+143), `fine` and `finest` the most values. On a generated
5,000-node downtown network and a 20,000-node grid (my own scenes, not committed), every layout
stayed under 480 ms, with or without `idle()`, and had no breaks.

**Read the times with care.** Seven of the 20 views reach the 450 ms soft bound, so on a slower
machine those views do less improving. They do not hide more: SHOW is never cut short.

## 3. Tried and dropped

- **Spending more on SHOW** (120 to 2,000 spots per label): no change. Labels were never hidden
  because SHOW gave up early.
- **A higher cost ceiling for showing a label** (4.4 to 8): +133 labels, but 239 labels laid over
  leaders. Most of what `room-check.js` calls room is ground under another label's leader.
- **Longer reach for `finest`** (7 rows instead of 4): +1 label, +37 values, leaders up to 7.3 label
  heights, twice the time.
- **Capping `finest` growth** at 400 or 1,200 spots per label: lost about 60 values and still hit the
  soft bound.
- **Most crowded first** in place of `fewest`: +120 values, −8 labels, and 50% more hidden labels
  with room under leaders. `fewest` beat it on labels.
- **A value worth more or less crossing** (ROW_GAIN 2.2 or 4.5, from 3.2): each traded values for
  crossings at about the same rate in both directions, so I left it alone.
