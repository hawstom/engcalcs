# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Ten branches may not merge without Tom's all-clear** (all in `protected` in
  `dev/branch-policy.json`; `feature_freeze` is OFF): `feat/label-gang-search`, `feat/zoom-control`,
  `feat/convert-as`, `feat/table-editing`, `feat/property-venue`, `feat/label-limit`,
  `feat/offscreen-notice`, `feat/usage-report`, `feat/select-on-focus`, `feat/first-project`.
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

- **`git stash` is ONE stack shared by every worktree.** 2026-09-24 one agent's `stash pop` took
  another worktree's entry. Never stash while agents are live; brief them so.
- **Ten check_all runs queued at once took four hours to drain** (2026-09-24, ~20 min each). A
  run's pass is judged on the tree at its END, so an agent that edits while queued re-queues.
  Stagger build tracks rather than launching seven together.
- **The browser-pass harness leaks its `php -S` server when killed**; 14 from 09-23 were still
  running on 09-24. `ps -eo pid,ppid,lstart,args | grep 'S 127.0.0.1'`, kill those whose parent is 1/449.
- **Flaky under load, green alone:** `run-progress-harness.js`; `specs/basemap.js`/`firstproject.js`
  tile counts at a 900 ms settle. Pre-existing and unrelated: `scale-publish-harness.js` (2 checks),
  `specs/place.js` (stale "lat/lon project now"; section 17 filechooser order),
  `specs/visibility.js` (stale sub-heading list; "Escape closes it"). Browser-pass specs are not in
  check_all.

## STATE — 2026-09-24

### On master, pushed at 61806814 (not yet pulled by him)

Print table measured in real Chrome (R-215); Zoom to fit lays labels out at the target zoom and
refits (R-214); MOD's small fixes R-204, R-205, R-206, R-209, R-229. Payloads regenerated there.
Mary's EPANET gap audit (`dev/agents/market-researcher/epanet-gap-audit.md`); Ida's
`dev/theming-plan.md` and Task 714; the lpn scope doc's "cut" list un-struck for what shipped.

### Awaiting his pass (every one green on its own check_all; none has master's 61806814 yet)

Merge master into each before it merges, and run the suite on that merge. Panel descriptions in
`~/webdev/worktrees/_panel/ports.conf` carry his test steps. Ports 8109-8112 need the Apache reload.

- **8103 `feat/zoom-control`** c5eea7de: R-216. Two rulings for him: a zoom keeps a half-drawn
  Zoom Window box; a Zoom to fit pressed before results arrive re-runs once when they land (<8 s,
  only if the view is untouched), which he may read as the forbidden refit-after-solve.
- **8104 `feat/convert-as`** 0693cb6d: R-213, R-217..R-219. Strings to rule on: `lpn_convas_label_col`
  "Suffix", `lpn_crs_latlon_display`, `lpn_convas_epsg_tip`, `lpn_georef_scale_tip`,
  `lpn_inp_report_no_crs`. Perry: the 1:1 note is a paragraph in Import but only a tip in Convert as.
- **8105 `feat/table-editing`** efeaa75a: R-221, R-222. **Dragging an unselected heading now selects
  columns; a column moves only by dragging a SELECTED heading** (Perry: he approved plain
  drag-to-move on 2026-09-18). Changed string `lpn_notes_6_def` (a list).
- **8106 `feat/property-venue`** 98613d7f: "Closed", "Filter in table >".
- **8108 `feat/label-limit`** 4bcf92ab: Settings filter row by row.
- **8109 `feat/offscreen-notice`** 291bd4c7: neutral panel style. Seam with zoom-control still stands.
- **8110 `feat/usage-report`** 5da3e7ae: `spock.php`, no password. Production needs nothing but a pull.
- **8111 `feat/select-on-focus`** 11edc1ad: `js/Calculators.lib.js`, every calculator page.
- **8112 `feat/first-project`** 8bfe1454: first-visit Project1 at Novato, basemap off. Perry: nothing
  tells a newcomer the map can be attached. Its builder wrongly removed Tom's 65000 label limit;
  restored in 8bfe1454.
- **8090 `feat/label-gang-search`**: unchanged.

### Open with him

1. R-202/R-203 (preview the one-button style? delete the menu hint now?), and R-188..R-190 closed.
2. Mary's Full Report and Status Report: roadmap tasks before EPANET++?
3. The `%` sign after his percentile box; the label branch's trade-offs; R-004, R-043, R-062, R-154.

### Translation sprint

Not launched: ten branches are open and new English waits on his rulings.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
