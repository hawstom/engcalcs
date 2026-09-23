# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Six branches may not merge without Tom's all-clear** (all in `protected` in
  `dev/branch-policy.json`; `feature_freeze` is OFF): `feat/label-gang-search`, `feat/zoom-control`,
  `feat/convert-as`, `feat/table-editing`, `feat/property-venue`, `feat/label-limit`.
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

## STATE — 2026-09-23, evening

### On master (pushed), not yet pulled by him

- Merged on his all-clear: `feat/tables-spreadsheet`, `feat/notice-log` (Tasks 704 and 691 closed;
  the 57-dialog audit is Task 710), `feat/zoom-scale-rules` (R-174: Text "Show at all zoom levels"
  off by default, in multi-properties, Tables and Find/Replace).
- Task 653 half fixed: no Settings select is rebuilt under the hand; Quality 3-5x faster. Unit
  selects still redraw the whole project (left in 653).
- Task 708's audit: `dev/property-venue-matrix.md` and the advisory `property_venue_check.php`.
- Settings undo stays out, on his word (709 closed). A spent migration that duplicated two keys in
  27 files when rerun is deleted.

### Awaiting his pass (preview ports)

- **8103 `feat/zoom-control`** (682): ready. R-179..R-181 built, and Perry's round-2 finding (a map
  click did not reset the twice-in-a-row rule) fixed at `83eeb139`.
- **8104 `feat/convert-as`** (696): ready. He liked the menu tip (R-182). Open question for him:
  the chooser offers EPSG:3857 as "lat/lon", per his own 2026-09-16 tip, while the stored numbers
  are EPSG:4326 degrees. The `$ec_lang_syn` for `lpn_units_length` still says "Pipe lengths and
  map coordinates" and needs his word. The "These are already lat/lon" button he called obsolete
  is still there. R-172(2), satellite after the wizard, needs his eye on a real host.
- **8105 `feat/table-editing`** (690): ready. Hidden columns ride in the existing `lpn_panecols`
  browser key. His call: Declan's design also had a visible column-chooser button; only the
  right-click shipped. An iPhone long-press on a heading needs a real phone.
- **8106 `feat/property-venue`** (708): ready. Shut and mixing model are chosen from a list in
  the reader's language.
- **One solve per change is on master** (653): a fast network runs the whole period once per edit,
  a slow one still shows the first step first. The "only the first time step" sentence it had been
  weighed against was never his; he struck it 2026-09-23 (the one sensible case is while the EPANET
  engine loads for a new browser). It also cancels a run an edit has made stale.
- **8108 `feat/label-limit`** (his 2026-09-23 question): 0 in the labels width row means never show,
  blank means always, like the customer row; the Thematic map checkbox is retired and a project that
  had it opens with 0. Ready; Perry's two findings fixed at `c949316e`.
- **8090 `feat/label-gang-search`**: unchanged; R-075..R-165 are his.

### Open with him

1. The `%` sign added after his percentile box, which he did not ask for.
2. The label branch's trade-offs and the Restore-defaults button.
3. R-004, R-043, R-062, R-154.
4. Net3-Novato has no labeling threshold, so nothing hides there at any zoom. Should it have one?
   (Net3's 30 is his own R-169 number; a new project starts blank, meaning always.)

### Known and not yet fixed

- `dev/browser-pass/specs/visibility.js` fails two checks on master too (outside `check_all`): its
  Settings sub-heading list lacks `lpn_set_sub_custLbl`/`lpn_set_sub_customProps`, and "Escape
  closes it". `settings-select-lag-harness.js` has failed once under a full suite's load and passes
  alone; watch it.

### Translation sprint

Not launched: six branches are open and he is still ruling on English. Launch after they merge.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
