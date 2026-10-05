**BUILDERS MUST NOT READ THIS DIRECTORY.** It holds the judges' secret tests (dev/label-placement-rules.md §5; Tom, Q11: *"a secret surprise test that we don't want them to build to"*).

# Judges' tests

```sh
node dev/lpn-spike/label-bench/judges/judge.js --placer <path>
node dev/lpn-spike/label-bench/judges/judge.js --placer dev/lpn-spike/label-bench/placers/master-replay.js   # the baseline
```

- **R-075, the 12345678 test.** `scenes/novato-*-12345678.json` are the public Novato sets
  extracted again with `12345678` as the node ID prefix (`extract.js --judges`). Of the labels the
  plain layout showed, the judge counts how many the long-ID layout **hid, or cut values from,
  where free ground within 3 text rows could have held them whole** in that same layout
  (`room.js`: on screen, over no symbol, label, Text or pipe, on a straight leader through no other
  node and across no other leader). Moves are counted and reported, never failed. Reported, not
  asserted.

  **Why it was rewritten (2026-09-28).** It used to count a label as failing if it merely moved,
  so round 2's C and D "failed" by moving two thirds of their labels while master "passed" at 13%.
  Tom, on the real map: *"The test is faulty. Their behavior is gold. See if you can rewrite the
  test."* A label that re-seats to make room for a longer ID and still shows as much is doing what
  G asks; what his original complaint named was a label hidden or cut **where free space exists
  within reach**, so that is all it counts against a placer now.
- **R14, along the pipe** (Tom, 2026-09-28: *"When there is space available, honor the setting
  about aligning labels to pipes"*). Over every public scene, of the shown pipe labels the setting
  asks to lie along their pipe, at most 5% may be drawn otherwise where an aligned spot beside the
  pipe was free (`score.js` `alignedRoom()`, which the public bench also reports). A named
  assertion. Master misses none. And at close zoom (4x and closer), of the pipe labels still level,
  at most 5% may have had room to lie along their pipe with the same rows: Tom's actual complaint
  (*"at any close zoom whatsoever, pipe labels stayed horizontal"*, 2026-09-28). With it, **R13 on a settings change**: the setting switched off
  at the same view (with `prev` the layout made with it on) leaves no pipe label turned. Both
  round-3 placers kept 106/240 and 108/250 turned, which is what Tom's pre-reviewer saw on the page.
- **Tom's crossing weights** (`weights.js`, his Q05 numbers). The public bench counts each crossing
  by its rank in his order; the judge reports the cost weighted with his numbers. They lived in
  `score.js` through round 2, where every builder could read them.
- **Tom's two screenshots of 2026-09-27** (`dev/screenshots/label-couch-2026-09-27-*.png` in the
  main checkout; untracked, never copied here), as named assertions on `novato-seq` at 2x and
  2.5x, the two steps that bracket the screenshots' scale:
  - `overwrite-185-183`: 185's label is not written over 183's.
  - `gang-runs-south`: of labels 184, 163, 265, 183, 169, 179, 177, 271, no leader longer than 6
    text rows, none off the screen, at most two hung more than 3 rows south of their node, and
    every stacked one west of its node right-aligned (rule S2).

  The thresholds are constants at the top of `judge.js`; a judge who changes one says so.
- **R1, Tom's sentence of 2026-10-05** (*"Hide a label only because there is no room for it on
  screen. Never hide it because of how many labels are already showing."*), `r1.js`, over every view
  of the Novato sets. **No room:** labels hidden although free ground within 3 rows (`room.js`) could
  hold their ID row; reported. **Not by count:** the same view laid out again with the labels of
  one half of the screen not asked for (nodes and pipes all still there), each half in turn; a label
  more than a quarter of the screen beyond the cut has exactly the room it had, so one hidden in the
  full layout and shown in the half one was hidden by count. Asserted: at most 5% come back, beyond
  the flips of a control run that changes nothing. The selftest proves it: a greedy placer that
  hides only where there is no room passes, the same placer capped at 60 labels fails both halves.
  Master's replay cannot place a scene it was not recorded on, so only the first half is measured
  for it; round 5's ID-length result (the same share shown for 3- and 9-character IDs) is the
  evidence there.
- `master/` holds the shipped page's layouts of the prefixed scenes, for `placers/master-replay.js`.
- `selftest-harness.js` (in `check_all.sh`) proves the three measure what they say, and that no
  file a builder reads states Tom's numeric weights.
