# Placer B, round 7: strategy card

Placer: `js/lpn-placer-b.js`. All numbers are `node dev/lpn-spike/label-bench/run.js --placer
js/lpn-placer-b.js --room` on the six public scene sets (20 views, 3,895 labels and 13,145 values
asked for), one worker, AMD Ryzen 9 5900X, node 24. Switch any ingredient off with
`LPN_PLACER_B_OFF=name[,name]` (or `create({off: [...]})`), and a dropped one back on with
`LPN_PLACER_B_ON=name`.

## 1. The recipe

Candidates (where a label may go):

- **S2** eight spots touching the node symbol, weighted by **S1** (`wedge`: open gaps between pipes
  first).
- **edgehang**, after the self-test's own search used to build with (**S15** geometry, not as a
  repair pass): a straight leader from the anchor every 15 degrees and every half row out to 3 rows,
  the block hung by the edge the leader reaches (R5). Every row set uses it.
- **S3** rings around the block (`rings`), for a label's smallest form only.
- **S5/H-a** `unwrap`: a node label's rows as one line, touching and on edge-hung leaders.
- **S4** `along`: a pipe label the setting asks to turn lies along its pipe, either side, in the
  scene's reading window, sliding over the pipe's ON-SCREEN stretch, turned to the leg it sits
  beside. Then level beside the pipe, then level on a leader. A label not asked is never turned.
- `reach`: the 3-row, 15-degree reach above. Without it, 4 rings of 7 px in 12 directions.

Order of passes:

1. Hand-placed labels and Text (N4). 2. **S13** `keep`: last view's spot while it is clean. 3.
**S20** `table`: the idle-time zoom table's spots. 4. **S11** `smallfirst` + **S12** `crowd`: every
other label at its smallest (the last value in the drop order, the ID a value like any other).
5. Climb: each label tries one bigger row set at a time and stops at the first that fits nowhere;
`relocate` lets a kept label move to show more; `rekeep` grows first the labels that lost their
spot. 6. **S16** `evict` and `leaderevict`: a hidden label may move one neighbour in its way.
7. The `cleanfirst` sweep. 8. **S17** `polish` rounds near freed ground. Bounded by **S21** time
(700 ms), never by a count.

Our own ingredients, described so another builder could build them:

- **cleanfirst**: every pass before the last accepts only spots that cross nothing but the label's
  own pipe (cost cap 0.13). A final sweep lets a still-hidden label cross one pipe (cap 0.35).
  Labels take clean ground first, and a crossing goes only to a label that would otherwise hide.
- **leaderevict**: eviction counts as "in the way" a neighbour whose LEADER the candidate would lie
  on or cross, or whose text the candidate's leader would cross, not only one whose text overlaps.
  This is aimed at where the self-test finds "room": 147 of 173 of its spots in my layouts lay on
  another label's leader.
- **raster**: a 4 px count raster of hard boxes that cover whole cells. A candidate whose rows, inset
  2 px, meet a counted cell surely overlaps by more than 1.4 px, so it is refused before its geometry
  is built. Same layout, about three times faster. A second raster of symbols and Text alone lets
  eviction skip spots no move could free.
- **memo**: a climb that found nothing is not retried until a move frees ground within reach of the
  label. This is for speed.
- **Tolerances as the bench's**: overlap 1.4 px (the bench forgives 1.5), N3 with a 1.4 px inset, and
  ends 1.4 px apart forgiven. Pump and valve symbols are not N3; a leader across one costs what its
  pipe would. Worth +12 labels, and hidden with room down from 127 to 114, once found.

## 2. Why: each ingredient switched off

| Run | Labels | Values | Hidden with room | Cut with room | Cost | ms med / max | R14 along (missed) | Churn |
|---|---|---|---|---|---|---|---|---|
| **round 7 recipe** | **3307** | **7452** | **107/588** | **143/1875** | **308** | **62 / 333** | **995 (69)** | **198** |
| keep off | 3319 | 7341 | 102/576 | 140/1884 | 314 | 59 / 282 | 999 (45) | 355 |
| table off | 3294 | 7500 | 102/601 | 116/1826 | 299 | 81 / 584 | 997 (62) | 188 |
| crowd off | 3273 | 7392 | 80/622 | 153/1824 | 317 | 57 / 337 | 1075 (58) | 177 |
| smallfirst off | 3216 | 7429 | 109/679 | 175/1728 | 358 | 59 / 304 | 932 (82) | 163 |
| wedge off | 3303 | 7513 | 112/592 | 156/1835 | 315 | 52 / 216 | 1013 (59) | 172 |
| reach off | 3084 | 6430 | 277/811 | 365/1966 | 492 | 82 / 357 | 1125 (51) | 162 |
| along off | 3282 | 7430 | 118/613 | 149/1804 | 282 | 67 / 288 | 606 (293) | 233 |
| relocate off | 3299 | 6819 | 108/596 | 381/2071 | 340 | 38 / 366 | 1112 (60) | 175 |
| evict off | 3226 | 7392 | 149/669 | 148/1786 | 258 | 38 / 253 | 1001 (61) | 182 |
| leaderevict off | 3291 | 7439 | 112/604 | 138/1860 | 305 | 56 / 245 | 993 (70) | 200 |
| polish off | 3306 | 7358 | 109/589 | 170/1916 | 266 | 51 / 217 | 995 (78) | 202 |
| memo off | 3307 | 7465 | 107/588 | 136/1873 | 318 | 60 / 276 | 987 (73) | 196 |
| rekeep off | 3308 | 7440 | 113/587 | 139/1882 | 307 | 57 / 246 | 999 (73) | 195 |
| unwrap off | 3306 | 6810 | 111/589 | 181/2134 | 314 | 54 / 277 | 1021 (71) | 173 |
| raster off | 3306 | 7463 | 112/589 | 140/1852 | 316 | 178 / 703 | 995 (62) | 200 |
| cleanfirst off | 3328 | 7633 | 93/567 | 119/1825 | 1082 | 49 / 291 | 908 (47) | 150 |
| edgehang off | 3278 | 7025 | 78/617 | 281/2069 | 391 | 50 / 188 | 1131 (75) | 162 |
| rings off | 3290 | 7504 | 87/605 | 143/1817 | 334 | 52 / 238 | 1015 (69) | 170 |

Cost is the bench's rank-weighted crossing sum. N1, N3, N4 and N5 are zero on every row. With the
recipe there are no leader-on-leader or label-on-leader crossings: 144 labels lie on a pipe and 22
leaders cross one. R13 (setting off) leaves 0/724 turned. Two runs of the recipe gave identical
numbers. The largest gains come from `reach`, `edgehang`, `unwrap` and `relocate`, which add values,
and from `evict`, `smallfirst` and `crowd`, which add labels. `cleanfirst` trades 21 labels and 181
values for 3.5 times less crossing cost. `wedge` and `rings` come out about neutral on these scenes:
each trades a few labels against a few values.

Before and after, on the same scenes. At round start, B kept the ID as the last value, against the
drop order (2335/2382 out of order). Fixing only that gave 2849 labels, 5409 values, 573/1046 hidden
with room, cost 789 and 22 ms max. The unfixed round-6 B gave 3242 labels (mostly bare IDs), 6146
values, 301/653 hidden with room, cost 632, R14 at close zoom 70% level with room, and R13 232
still turned.

## 3. Tried and dropped

- **S15 as a repair pass after the layout** (`repair`, off by default; `LPN_PLACER_B_ON=repair`):
  3291 labels, -16. The sweep and eviction already ask every hidden label again; the extra pass
  only re-orders the greedy. Its geometry lives on as `edgehang`.
- **farreach** (off by default): a last sweep with leaders out to 6 rows (R1: nearness is given up
  first). +7 labels (3314), +12 ms median. Left off because the gain is that small.
- **Rings for every row set as well as edge-hung leaders**: 122 ms median and 628 max, with 15
  fewer labels and 224 fewer values than rings for the smallest form only.
- **Half the directions on the two nearest rings**: -8 labels, so reverted.
- **One cost cap of 0.6 (two pipes), as in round 6**: cost 1249 against 1144 at 0.35, with fewer
  values. Then `cleanfirst` replaced the single cap.
- **Not tried**: S7 `spot_prime`/`box_est` (the hidden labels left are in truly crowded ground: a
  6-row reach found 7 more), S14, S18 and S19.
