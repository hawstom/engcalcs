# Placer D, round 7: strategy card

`js/lpn-placer-d.js`. IDs are from `dev/label-placement-strategies.md`; D-n are my own.

## 1. The recipe

Passes, in order, on one view:

1. **Hand-placed labels** at the user's point (N4).
2. **S11 + S12 + S13**: every other label seated in its **smallest form**, most crowded first, last
   view's shown labels first on a zoom-in. Candidates are S2 (standard positions touching the
   owner, then each row beside it) and S3 (straight leaders in 8 directions at 1, 2.2 and 3.8 rows,
   or the standard hook where steep), S4 for pipe labels (beside the pipe, along it where the
   setting asks, sliding up to 0.3 of the on-screen stretch either way), S5 (the other layout at a
   small premium), and last view's spot carried with a bonus (S13). Free space is S9 (summed-area
   tables of the fixed world) plus a count raster of seated labels.
3. **D-1, drop order with the ID as a value.** Levels drop fields in the user's order; a scene
   that does not list `id` drops it first. So the smallest form is the last value, often a bare
   `P=…` or `Q=…` (Tom, 2026-10-06).
4. Each label **grows** a row at a time (G); **S16 eviction** (up to two neighbours, each keeping
   its rows or giving up one, only when the total shown rises); **S17 polish**.
5. **D-2, rescue (S3 made dense, S15 built in).** Each label still hidden searches every 15 degrees,
   every half row out to 4 rows, with the block hung either by the middle of its nearest row or by
   its corner; a pipe label also tries beside its pipe out to 0.45 of the stretch. This is the
   self-test's search, built inside the placer with its own collision index, and it refuses what
   the self-test lets through (label on a leader, leader through text, leader on leader).
6. **D-3, tight clearance.** My labels keep 8 px across and 3 px up and down from each other. In
   the rescue, a label that would otherwise be hidden or cut may stand at 3 px and 1.5 px instead
   (a second raster stamped at that clearance keeps it fast).
7. **D-4, rescue eviction**: S16 again for the still-hidden, with the dense places for the label
   and for the neighbours it moves.
8. Grow again with the dense places, at the usual clearance and then at the tight one.
9. **D-5, along fix (R14)**: a pipe label still level where the setting asks for along tries the
   along places at the tight clearance, evicting if it must. **D-6, bent-pipe check**: an along
   place on a bent pipe must lie along the leg it sits nearest (within 4 degrees), and each
   on-screen leg's middle is offered. **D-7, sticky-along**: a level place is never carried over
   from last view for a label the setting turns (R14 outranks stillness).
10. **S21, clock budget**: every improving pass stops at 650 ms from the start of the layout;
    never a work count. **S20/H-b, warm**: the opening view is laid out in the opening pause.

Switch any off: `PLACER_D_OFF=rescue,tight node dev/lpn-spike/label-bench/run.js --placer js/lpn-placer-d.js --room`
(or `EngCalcs.lpnPlacerD.off = ['rescue']` before `create()`). Names: `order sticky stickyalong
crowd smallfirst evict polish along altlayout rescue rescueevict alongfix bendcheck tight timebound
warm`.

## 2. Why: each ingredient switched off

Public scenes (20 views, 3,895 labels, 13,145 values asked for), one worker, AMD Ryzen 9 5900X,
2026-10-07. "Hidden w/ room" and "cut w/ room" are `room-check.js`. Crossings: leader on leader and
label on leader were 0 in every row; the column gives label on pipe / leader on pipe, then the
bench's ranked cost. R14 miss: pipe labels left level that had room along (all views, then 4x and
closer). No row breaks N1, N3, N4 or N5. Time is the worst view; it varies about +-30% between runs
on this shared machine (all on: 270 to 430 ms across six runs).

| Row | Labels | Values | Hidden w/ room | Cut w/ room | Crossings, cost | R14 miss | Churn | Max ms |
|---|---|---|---|---|---|---|---|---|
| Round 6 placer | 3348 | 7346 | 278/547 | 342/1967 | 231/149, 611 | 100 (8) | 194 | 65 |
| **Round 7, all on** | **3277** | **7717** | **151/618** | **143/1709** | 455/190, 1100 | **50 (2)** | 247 | 430 |
| off: order (D-1) | 3526 | 8152 | 107/369 | 138/1888 | 351/162, 864 | 46 (3) | 264 | 347 |
| off: sticky (S13) | 3254 | 7796 | 144/641 | 103/1631 | 458/181, 1097 | 39 (2) | 402 | 495 |
| off: stickyalong (D-7) | 3275 | 7757 | 149/620 | 134/1687 | 433/187, 1053 | 70 (6) | 189 | 338 |
| off: crowd (S12) | 3249 | 7620 | 116/646 | 149/1715 | 401/191, 993 | 69 (7) | 214 | 342 |
| off: smallfirst (S11) | 3144 | 7973 | 178/751 | 84/1346 | 601/278, 1480 | 42 (3) | 231 | 374 |
| off: evict (S16) | 3032 | 7358 | 289/863 | 176/1514 | 331/194, 856 | 47 (3) | 199 | 266 |
| off: polish (S17) | 3272 | 7721 | 146/623 | 137/1700 | 424/168, 1016 | 61 (3) | 253 | 372 |
| off: along (S4) | 3284 | 7910 | 163/611 | 90/1620 | 605/239, 1449 | 539 (68) | 165 | 219 |
| off: altlayout (S5) | 3271 | 6784 | 174/624 | 192/2130 | 424/180, 1028 | 65 (6) | 206 | 249 |
| off: rescue (D-2) | 3074 | 7033 | 388/821 | 285/1733 | 322/148, 792 | 90 (10) | 203 | 146 |
| off: rescueevict (D-4) | 3115 | 7543 | 236/780 | 151/1557 | 378/165, 921 | 53 (2) | 226 | 405 |
| off: alongfix (D-5) | 3274 | 7700 | 154/621 | 141/1722 | 456/190, 1102 | 90 (11) | 247 | 283 |
| off: bendcheck (D-6) | 3273 | 7711 | 151/622 | 139/1714 | 459/189, 1107 | 64 (2) | 244 | 334 |
| off: tight (D-3) | 3192 | 7457 | 233/703 | 193/1694 | 386/157, 929 | 97 (6) | 242 | 210 |
| off: timebound (S21) | 3038 | 6900 | 433/857 | 261/1713 | 320/169, 809 | 89 (10) | 220 | 103 |
| off: warm (S20) | 3276 | 7619 | 155/619 | 142/1734 | 442/193, 1077 | 69 (3) | 236 | 653 |

Reading it:

- **D-1 costs labels on purpose.** Round 6 kept the ID to the last and broke the drop order on
  1,931 labels; with the ID dropped first the smallest form is a wider value, so fewer fit (3526 to
  3277 labels at the same recipe). The other rows are measured with D-1 on.
- **The rescue (D-2, D-3, D-4) is where R1 moved**: with all three, 203 more labels and 684 more
  values than without the rescue, and hidden with room falls from 388 to 151. By my own stricter
  version of the self-test (no label on a leader, no leader through text) it falls from 104 to 22.
- **S21 matters**: round 6's work cap of 18,000 tests, kept as `timebound` off, stops the repair
  early on the dense views and hides 239 labels that the clock budget shows, which is R1's second
  half failing.
- **S11 and S12** buy labels at the cost of values, as G asks. **S13** buys stillness (churn 247
  against 402). **D-7** trades a little churn for R14 (70 to 50 missed). **S17** is near neutral
  on counts and lowers R14 misses.
- The cost: label-on-pipe crossings roughly double, because labels now sit in crowded ground that
  round 6 left empty, and the worst view takes several times longer.

## 3. Tried and dropped

- **S1, ranked wedges** to order the dense directions: +1 label, -18 values. No gain.
- **Moving a leadered neighbour for R14** (a label whose leader an along place would cover counted
  as a blocker): 1 R14 miss fewer. No gain.
- **Fewest-places-first rescue order** (most constrained first): +1 label. Noise.
- **Dense search without keeping the candidates** (each place tested as made): the same layouts,
  but slower, because the kept lists are reused across five passes.
- **Dense rings as lazy tiers**: no faster, since a failed growth tries every ring anyway.
- **Half the dense directions for multi-row levels**: 20% faster, but -26 labels and -150 values.
- **No clearance at all in the rescue** (0 px): about 55 more labels, but two labels' rows then sit at
  the line pitch and read as one stack. 3 px and 1.5 px is the compromise; 0 px vertical I refused.

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
