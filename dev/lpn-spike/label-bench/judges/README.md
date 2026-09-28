**BUILDERS MUST NOT READ THIS DIRECTORY.** It holds the judges' secret tests (dev/label-placement-rules.md §5; Tom, Q11: *"a secret surprise test that we don't want them to build to"*).

# Judges' tests

```sh
node dev/lpn-spike/label-bench/judges/judge.js --placer <path>
node dev/lpn-spike/label-bench/judges/judge.js --placer dev/lpn-spike/label-bench/placers/master-replay.js   # the baseline
```

- **R-075, the 12345678 test.** `scenes/novato-*-12345678.json` are the public Novato sets
  extracted again with `12345678` as the node ID prefix (`extract.js --judges`). The judge counts,
  of the labels the plain layout showed, how many the prefixed layout moved (neither the edge the
  label hangs on nor its row held within 1 px), hid, or cut values from. Reported, not asserted.
- **Tom's two screenshots of 2026-09-27** (`dev/screenshots/label-couch-2026-09-27-*.png` in the
  main checkout; untracked, never copied here), as named assertions on `novato-seq` at 2x and
  2.5x, the two steps that bracket the screenshots' scale:
  - `overwrite-185-183`: 185's label is not written over 183's.
  - `gang-runs-south`: of labels 184, 163, 265, 183, 169, 179, 177, 271, no leader longer than 6
    text rows, none off the screen, at most two hung more than 3 rows south of their node, and
    every stacked one west of its node right-aligned (rule S2).

  The thresholds are constants at the top of `judge.js`; a judge who changes one says so.
- `master/` holds the shipped page's layouts of the prefixed scenes, for `placers/master-replay.js`.
