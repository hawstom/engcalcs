# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive** (need Tom's all-clear; `feature_freeze` is OFF): `feat/label-placer`
  (the seam; merges with the chosen placer) and `feat/label-gang-search` (bench only; delete once a
  placer lands). Builder branches `feat/label-placer-a`..`-d` never merge on their own.
- **A branch that adds a key fails `payload freshness` and only that**, by design: agents never
  regenerate `dev/translation_payloads/`. Regenerate once on the merge commit, then run the suite.
- The all-clear's pin field in `dev/branch-all-clears.json` is **`head`**. Tom can test a preview
  mid-build, so pin to the final head and say so in `pin_note`.
- **Merge master into a branch before merging it to master**, then run the suite on the merge:
  2026-09-23 twice showed a clean merge breaking a harness (the lag harness and Net3's threshold).
- **Never wrap `run_harnesses.sh` or `check_all.sh` in the browser lock**: each browser harness
  takes that lock itself, so the wrapper deadlocks every one (2026-09-25, 280 s NOT RUN apiece).
  Brief agents to write journals to the scratchpad while a suite runs in the main checkout.
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
- **Never hand him local-dev housekeeping** (worktrees, branches, ports, leaked servers). He has no
  worktrees on production; his commands are `git pull` there and the Apache reload here. If the
  classifier refuses a local cleanup, say so and ask him to allow it, never phrase it as his step.

## TRAPS

- **The Mapbox token is restricted by host.** Allowed hosts include `localhost` and `hawsedc.local`,
  so a new preview port needs nothing; a new hostname does, and `127.0.0.1` is refused (403). A token being present is not a token
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

- **A worktree's `check_all` never stamps**, because its `.git` is a file; a master push needs its
  own run in the main checkout. And never switch the main checkout's branch while its run is queued.
- **The roadmap lags the code.** 2026-09-26 two agents were briefed on Tasks 708 and 696 and found
  both already shipped. Run `git log --oneline --all --grep=<task>` before briefing one.
- **A check whose "before" run reads `master` breaks the merge that fixes it**; pin a SHA.

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
- **Flaky under load, green alone:** `run-progress-harness.js`; `dev/browser-pass/specs/basemap.js` and `firstproject.js`
  tile counts at a 900 ms settle. Pre-existing and unrelated: `scale-publish-harness.js` (2 checks),
  `dev/browser-pass/specs/place.js` (stale "lat/lon project now"; section 17 filechooser order),
  `dev/browser-pass/specs/visibility.js` (stale sub-heading list; "Escape closes it"). Browser-pass specs are not in
  check_all.

## STATE — 2026-09-29 (small hours)

### Master = 0190cad2, pushed. Production = 9c71d54f (Tom pulled 2026-09-28 morning)

a912bcfe was pushed first for his table-editing video. On top of it: `fix/time-series-switch` (Time
Series blank after a project switch and not redrawn on arrival; a Task 680 defect from 09-16, not
a regression), `chore/rulings-0928` and `chore/sprint-0928-delta` (313 lpn_ keys in 26 languages;
the sprint stays OPEN in friction_check until his two English rulings below).

Merged 2026-09-29 on his "Done. Close, merge, and delete branch" for all four: `feat/fill-handle`
(8131), `feat/table-width` (8124: KLmax 0.8 with ceil, word cap 7, Vertices "(Lat/Lon|Lat/Lon|…)",
"No ▾" clipping accepted), `feat/selection-set` (8135: Tables Select/Unselect on map, go-to keeps the
selection, Shift+click in Find, row bars, fire-flow links and sorting, Find always names the kind,
Task 742 design check None/All/Selected, "Zoom in to see labels" notes gone), `fix/tables-legend`
(8134: paste round-trip incl. Text and Customers creating rows, legend top-left default, tank
diameter in length units, scenario switch keeps Properties, Credits follows the brand, Import
libraries brings patterns/controls/rules, draggable non-modal Notes box). He wants master for a
**table-editing video**. **Remind him to try drag-to-fill on a phone after he pulls** (his ask).
Deleted key: `lpn_ff_design_nodes`. New storage: the Notes box position (localStorage, window
furniture; in the inventory) -- he was told.

### Label placement (Task 539)

Round 4 on 8132 (C, `?placer=c`) and 8133 (D, `?placer=d`), both merged with seam a74b3558 (view
stops above the footer; `scene.furniture`). Bench: both 0 breaks, R13 (setting off) 0 turned; close
zoom level-with-room C 6/74, D 6/43; along C 531, D 642; values C 50%, D 54%; cost C 922, D 419.
Perry r4 (before the seam fix): only fault was pipe 185 level at close zoom -- the seam's footer, now
fixed. **Next: a short Perry real-Chrome pass on the merged C/D when the machine is quiet, then his
side-by-side.** His rulings this round (rules Part A/B): R14 "values outrank alignment; alignment
required wherever the same rows fit aligned"; blank time "about a second"; rough-then-tidy (his hint
(b)) measured by D, not shipped: the seam draws only what place() returns. Interviews with named
strategies: `dev/label-placer-interview-{a,b,c,d}.md`; paper notes `dev/paper-notes-label-placement.md`
(on the rulings branch). Mary: showing all labels is an outlier, not a known impossibility; citation
trace (Kakoulis-Tollis 2006, Been et al.) before any novelty claim. Task 741: the infinite map.

### Awaiting him

- 2 English rulings closing the sprint: `lpn_mapgeo_dial_help` (proposed "The middle of each bar
  keeps the fit from step 1, so 1 and 0 mean no change.") and `lpn_lock_requested` ("File, Close
  project" -> "File, Close"). Then friction_check passes and the sprint closes.
- ~30 new English keys from the merges (dev/new-english-keys.md) for the next sprint.
- Task 737 first piece: the per-language collision check (41 today: junction/node in 6 languages,
  minor/junction loss, max allowable head vs pressure rating).
- "Zoom in to see labels" is gone from the examples; nothing else of R-174 changed.
- EPANET++: pages now revalidate (repo 2ff1c58, pushed); he must pull it on the server.
- "Press Calculate to run the simulation" names a button hidden while Recalculate automatically is
  on; wording is his.
- The browser-pass `time` spec has 4 failures on master too (not in check_all); look separately.
- Retired ports 8124/8131/8134/8135 need his Apache reload (commands at the foot).

- `dev/tom-review-queue.md` still lists R-366/R-367/R-075 and the round-2 placer items as open;
  all were answered in conversation 2026-09-28/29. Clear them against this file.

### Traps met 2026-09-28/29

- **A broad `pkill -f check_all.sh` kills every session's run** (an agent did it; master's run died
  with 144). Brief agents: kill only by PID, and only their own.
- **Network drops (EAI_AGAIN) kill agents mid-work**; resume with SendMessage, "git status first".
- **The four gallery FAIL lines in example-open-guard-harness are its own mutation tests**; the
  verdict is the exit code. Read `FAILED:` lines, not raw FAIL lines.
- **Agents writing journals into the main checkout dirty a running suite.** Brief them to the
  scratchpad while a suite runs there.
- **The master pre-commit refuses `--amend` too**: regenerate payloads on a chore branch and merge.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
