# Placer A, round 7: strategy card

File: `js/lpn-placer-a.js`. Every ingredient below has a switch: `PLACER_A_OFF=<id>[,<id>...]`
in the environment of `run.js` turns it off (on the page they are all on). Time budgets:
`PLACER_A_EVICT_MS` (default 250) and `PLACER_A_SOFT_MS` (default 500).

## 1. The recipe, in order of passes

1. **Map the ground**: bucket grid (S8) and a 3 px raster with summed-area tables (S9). Overlaps
   up to 1.45 px count as leading, not ink, just inside the bench's 1.5 px (own: `lead`).
2. **Candidates in tiers** (S2, S3, S1, S5, S4). Tier 0 touches home. For a node, that is the 8
   standard positions plus 2 centred ones. For a pipe label with `along`, it is turned and
   beside the pipe, on either side, close or half a row clear, at stations: the anchor, then the
   middle of the on-screen stretch and out by tenths of it. Level places cost 2 more (R14, under
   a value's 4). On the pipe costs 3.5 more (R7). Without `along` the label is never turned
   (R13). Leaders in tiers 1-4 go into the widest pipe gaps first, then round the compass. A
   leader arriving at the top or bottom lands near a corner, and the rows are justified to that
   side (own: `r5`).
3. **Order.** Hand labels first (N4). Then last view's spots, carried only while legal *and* clean
   (S13, plus own `holdclean`: a carried label that now crosses a pipe or a leader looks again).
   Then pass A: everything else in its smallest form, most crowded first (S11, S12).
4. **Labels before properties.** A label still hidden first gets the fine tier: every 15 degrees,
   every half row, out to 4 rows (S15, built in). Then `far` (own form of S7): straight leaders in
   48 directions, walked out past 4.5 rows. A direction stops at the first node symbol, Text,
   label or leader it would cross. The label takes the first clean open ground, and the shortest
   landing wins. Then eviction (S16): it may move 1 or 2 blockers if each finds another place.
5. **`clean`**: a label sitting across a pipe or leader asks the fine tier for cleaner ground with
   the same rows.
6. **Growth** (S11 rounds, bounded by time: S21). Each round, each label may take back one row.
   It tries growing in place first (own: `inplace`). Otherwise it re-seats, and held labels may
   re-seat too (own: `reseat`, for R11). Coarse rounds come first, then rounds with the fine tier
   (`grow`). A search that failed is not repeated until something near it changes (own: `dirty`,
   stamped 48 px regions).
7. **R14 last pass**: a level `along` label turns if a clean turned spot with the same rows exists.

Pass A is never cut short, so no label is hidden for want of time. Everything after it stops at
the budgets, so a slower machine shows fewer values, not fewer labels. With both budgets at 1 ms,
the worst view takes 106 ms. At half budget there are 7,904 values against 8,014, and the same
labels within 1%.

## 2. Why: each ingredient switched off

`node dev/lpn-spike/label-bench/run.js --placer js/lpn-placer-a.js --room`, public scenes, one
worker, Ryzen 9 5900X. Labels and values are shown out of requested (3,895 and 13,145). Hidden
with room and cut with room come from `room-check.js`. Cost is the bench's ranked crossing cost.
Time is the worst layout in ms. Rows marked * were run before `holdclean` existed; compare them
with the "all, before holdclean" row. Repeated runs vary by about 1%, because growth stops on a
time budget.

| Row | Labels | Values | Hidden w/ room | Cut w/ room | Cost | R14 along / missed | Churn | ms |
|---|---|---|---|---|---|---|---|---|
| **all (final)** | **3429** | **8014** | **72/466** | **72/1802** | **654** | 856 / 54 | 135 | 507 |
| `holdclean` off = all, before holdclean | 3428 | 8116 | 73/467 | 60/1761 | 874 | 835 / 55 | 104 | 509 |
| S13 carry off (with holdclean) | 3418 | 7862 | 67/477 | 81/1850 | 564 | 829 / 64 | 412 | 507 |
| S1 wedges off * | 3428 | 8115 | 73/467 | 60/1761 | 874 | 835 / 55 | 104 | 506 |
| S4 stations off * | 3427 | 7936 | 48/468 | 70/1834 | 870 | 618 / 188 | 92 | 502 |
| S5 other shape off * | 3422 | 7456 | 70/473 | 135/2086 | 831 | 1084 / 65 | 86 | 505 |
| S11 smallest first off * | 3293 | 8431 | 114/602 | 55/1453 | 1332 | 763 / 58 | 103 | 503 |
| S12 crowded first off * | 3440 | 8102 | 46/455 | 68/1797 | 884 | 822 / 61 | 111 | 510 |
| S15 fine repair off * | 3417 | 8075 | 88/478 | 75/1765 | 834 | 842 / 51 | 104 | 505 |
| `far` off * | 3395 | 8038 | 68/500 | 75/1755 | 902 | 819 / 49 | 101 | 504 |
| S16 eviction off * | 3303 | 8042 | 132/592 | 75/1632 | 743 | 807 / 53 | 100 | 507 |
| `clean` off * | 3435 | 8087 | 65/460 | 62/1789 | 973 | 856 / 41 | 119 | 512 |
| `grow` (fine growth) off * | 3427 | 7700 | 76/468 | 130/1939 | 849 | 849 / 71 | 107 | 416 |
| `inplace` off * | 3420 | 8025 | 67/475 | 63/1794 | 886 | 811 / 70 | 116 | 505 |
| `reseat` off * | 3436 | 6787 | 80/459 | 511/2369 | 922 | 1096 / 76 | 115 | 504 |
| `dirty` off * | 3429 | 8125 | 73/466 | 58/1764 | 874 | 837 / 54 | 107 | 504 (time only) |
| `lead` off (tolerance 1.0) * | 3366 | 7861 | 115/529 | 88/1780 | 1041 | 807 / 70 | 105 | 509 |
| `r5` corners off * | 3433 | 8109 | 78/462 | 84/1784 | 916 | 862 / 65 | 106 | 505 |

How to read it:

- **The biggest single gain was `reseat`**, worth 1,300 values. A label held from the last view
  used to be able to grow only where it stood, so zooming in brought back almost nothing. One
  bug hid it: a failed in-place growth re-committed the same spot as a new record, counted as
  "changed", and spun every round.
- **S16 adds 126 labels. S11 adds 136 labels** and costs about 400 values. That is R1's order:
  properties go before labels.
- **`holdclean` cuts crossing cost by 25%** for about 100 values and 30 more churn.
- **S4 is the R14 ingredient**: off, 188 level pipe labels had room to turn.
- **`lead`** buys 63 labels and 250 values. Corner grazes under 1.5 px were blocking spots.
- **S1, `dirty`, and S12 make no measurable difference to quality here.** `dirty` saves time
  only. S12 off is within noise, or slightly better on hidden-with-room. I kept S1 and S12 so the
  judges can re-measure them on unseen scenes.
- **Off the public scenes:** a generated 10,000-node suburban network (6 views up to 1,700
  labels) had no breaks and a worst layout of 509 ms. A close view of the same network took
  17 ms, so the size of the network adds little.

## 3. Tried and dropped

- **A heavier row weight (5, 6, 8 against 4)**: up to +430 values, but crossing cost rose 15-45%,
  because it also cheapens every crossing relative to a value. **A cheaper leader-length cost
  (x0.75, x0.5)**: small gains, cost up 15-25%. Both dropped; the weights are unchanged.
- **Far leaders that may pass under one other label's text**: no gain at all. In the dense core
  the binding limit is N3: almost every straight leader outward meets another node's symbol. 1,689
  of the far walks stopped on a symbol, 3,177 on a label.
- **Unbounded growth loops**: they spun on small re-seats at the same rows. Now only growth
  counts as change.

## What the bench showed about itself

- `room-check.js` treats a pipe label sitting *on its own pipe* as room (its own pipe is
  excepted). Many "cut with room" spots for pipe labels are exactly where R7 says not to be.
- Turning a level pipe label along its pipe at the next zoom (R14) shows nothing more, so the
  churn score counts it. That accounts for most of this placer's churn.
- The README's baseline was recorded with the ID as the first value to go (13 px). Since Tom's
  2026-10-06 ruling, the smallest form is the last value, such as `P=40.67` (46 px), so labels
  shown fell everywhere. Round-6 numbers are not comparable with round-7 numbers.
