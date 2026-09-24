# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Seven branches may not merge without Tom's all-clear** (all in `protected` in
  `dev/branch-policy.json`; `feature_freeze` is OFF): `feat/label-gang-search`, `feat/zoom-control`,
  `feat/convert-as`, `feat/table-editing`, `feat/property-venue`, `feat/label-limit`,
  `feat/offscreen-notice`.
- **Every one of them fails `payload freshness` and only that**, by design: agents never
  regenerate `dev/translation_payloads/`. Regenerate once on the merge commit, then run the suite.
- The all-clear's pin field in `dev/branch-all-clears.json` is **`head`**. Tom can test a preview
  mid-build, so pin to the final head and say so in `pin_note`.
- **Merge master into a branch before merging it to master**, then run the suite on the merge:
  2026-09-23 twice showed a clean merge breaking a harness (the lag harness and Net3's threshold).
- Run `check_all.sh` and headless browser runs under their `flock` locks, and run no more than
  four agent tracks at once. WSL has 12 GB and 4 processors since 2026-09-23.

## RULINGS

- The interface says **Customer**, never Meter.
- Don't expose the word "projection". **Georeferencing** means attaching the world map, not
  converting the coordinate system (`dev/tom-coordinate-vocabulary-2026-09-16.md`).
- We align the streets with the project, never the project with the streets.
- `isLatLonProject()` answers only "are these latitudes and longitudes"; most callers want
  `projectLocatable()`. Do not widen the name back.
- Delete a language key when nothing renders it and nothing checks it, and say which ones.
- **Tell Tom about:** any change to what is stored on a visitor's device; any public claim on the
  landing page; anything needing his testing or approval before a merge.
- Run `git status` at the start of a session and before acting on each of his messages. His own
  edits arrive uncommitted.
- Make his wording changes, not yours. Don't ship something he has questioned.

## TRAPS

- **The Mapbox token is restricted by host.** Allowed hosts include `localhost` and `hawsedc.local`,
  so a new preview port needs nothing; a new hostname does. A token being present is not a token
  being accepted — test with a real tile request.
- **A clean merge can still break the tree** (a rename on one side, an old call on the other). That
  is why the suite runs on the merge commit.
- **`check_all.sh` stamps only a clean tree**, and pre-push refuses an unstamped master commit.
  Commit, then run. Pre-commit refuses a non-merge commit on master.
- **Never `git worktree remove --force`** without reading its `git status` first; it once destroyed
  an agent's uncommitted work.
- **Check that no agent is already working in a worktree before sending another in.**
- **An orphaned probe can hold `/tmp/engcalcs-browser.lock` for hours**, and every browser harness in
  every suite then times out (2026-09-23: a pre-reviewer's hung phone test). Find the holder with
  `for p in /proc/[0-9]*; do ls -l $p/fd 2>/dev/null | grep -q engcalcs-browser.lock && echo $p; done`.
  The divider harness now prints `NOT RUN` when this happens instead of failing silently.
- **An agent's report of "committed" is a claim.** Run `git status` in its worktree before you
  merge; one branch's two harnesses were reported committed and were untracked.
- **A usage limit kills every running agent at once**; only their commits survive. Brief agents to
  commit as they go, and relaunch with "read `git log master..HEAD` first".
- **Preview ports:** `ports.conf`, the loaded Apache config, and the panel's `index.html` must
  agree. The Apache reload needs `sudo`, so hand Tom the commands at the foot of this file.
- **Ask which branch a host is on before explaining what Tom sees.** `dev.hawsedc.com` has sat on
  an old feature branch; `curl` gets a 401 there. Answer about the surface he named.

---

- **A stub harness can pass over the very defect it names.** 2026-09-23 the zoom-control harness
  emptied the document, so "Tom's exact sequence" passed while the real page went blank, and the
  build agent then told us Tom had tested an old build. When a stub cannot reproduce his report,
  send the pre-reviewer to reproduce it in real Chrome before believing either side.
- **Seven agents each queueing `check_all` serialise on one lock for hours**, and an agent that
  hands back while waiting queues duplicates. Count queued runs (`/proc/*/fd` on the lock) before
  launching another track.

## STATE — 2026-09-23, late (session c)

### On master (pushed at ffd1ef87), not yet pulled by him

- Defect fixes, merged on green: print table borders and widths (R-162, R-201); **Zoom to fit from
  a deep zoom** (R-184's real cause: dragged label offsets multiplied by the starting scale;
  `dev/browser-pass/specs/zoomfit.js` plus `zoom-fit-harness.js` section 5); first sort click on a
  column where every row ties (Tag, Part of this network, Shut); copied unit selects drop their id.
- **Task 653 closed**: a unit select no longer rebuilds the project, and no longer clears
  fire-flow results as it used to. **Task 685 closed**: 226 unnamed selects now 0, held by the
  blocking `unit_select_name_check.php`.
- `visibility.js` spec corrected (both failures were a stale spec; Escape closing a box only with
  focus and pointer in it is his 2026-09-19 ruling). `.gitignore` now ignores the node_modules
  SYMLINK, so a worktree's check_all stamps again.
- Tasks 711-713 added from pre-review findings.

### Awaiting his pass (preview ports; every branch merged master and passed its suite)

- **8103 `feat/zoom-control`** 05291ba3: carries the Zoom to fit fix. His R-184 retest.
- **8104 `feat/convert-as`** 8216bbe5: R-185, R-187, R-189 done. Decisions for him: R-188
  (recommend labelling lat/lon "WGS 84 latitude/longitude (EPSG:4326)", since the stored numbers are
  4326 degrees and 3857 means metres); R-190 (keep or drop "These are already lat/lon", which serves
  only a plain `.inp` whose numbers happen to be degrees); whether untouched pre-filled Label
  suffixes should be applied. New strings: `lpn_convas_label_col`, `lpn_convas_label_tip`,
  `lpn_convas_label_depth_na`.
- **8105 `feat/table-editing`** b1da93a8: R-191..R-193. New strings: `lpn_pane_fill_none`,
  `lpn_pane_hide_cols`, `lpn_notes_6_term`, `lpn_notes_6_def`.
- **8106 `feat/property-venue`** 324c217e: R-195, R-197, R-198. "Table to filter" became "Table",
  our word, needs his.
- **8108 `feat/label-limit`** ff7ded9a: R-199 (a)-(g). Perry's blank-customer-box finding fixed.
- **8109 `feat/offscreen-notice`** d4acb740 (Task 647, NEW PORT, needs the Apache reload below):
  Ida's design, a centred "Your network is intact." with Zoom to fit. **Seam with zoom-control**:
  its +/- buttons and keys do not exist on this branch; whichever merges second must check the
  overlay re-evaluates after them (they should reach it through `onZoomChanged()`).
- **8090 `feat/label-gang-search`**: unchanged; he edited the queue, "Still a lot is open."

### Open with him

1. The `%` sign added after his percentile box, which he did not ask for.
2. The label branch's trade-offs and the Restore-defaults button.
3. R-004, R-043, R-062, R-154, R-188, R-190.
4. Net3-Novato has no labeling threshold. Should it have one?

### Translation sprint

Not launched: seven branches are open and he is still ruling on English. Launch after they merge;
by then `detect_english_drift.php` lists about 156 drifted keys.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
