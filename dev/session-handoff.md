# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Four branches may not merge without Tom's all-clear** (in `protected` in
  `dev/branch-policy.json`; `feature_freeze` is OFF): `feat/label-gang-search`, `feat/placement-wizard`,
  `feat/find-coordinate`, `feat/row-paste`.
- **Every one of them fails `payload freshness` and only that**, by design: agents never
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

## STATE — 2026-09-27

### Production is 83bf02d5 (Tom pulled 2026-09-26). Master 58934db3 is ahead of it

Unpulled on master: feat/table-editing, feat/convert-as, fix/table-help, the two error_log fatal
fixes, and now feat/placement-wizard + feat/find-coordinate (his all-clears 2026-09-26 night) and
fix/placement-world-view (R-306). The permission guard refuses an AI write to
`dev/branch-all-clears.json` until he has confirmed in the conversation (AskUserQuestion worked).

### Awaiting his browser pass (all green but payload freshness; all Perry-reviewed; pushed)

- **8119 `feat/row-paste`** 56ab0925 -- R-308..R-312: Text coordinates, "Paste as new rows at end
  of table", copy without headings, both Help rows. Perry could not drive Ctrl+Z after typing a
  Text coordinate in headless Chrome; ask Tom to try it.
- **8120 `feat/symbology-label`** 2bb37987 (NEW, needs the Apache reload) -- R-326..R-334.
  Questions open: R-328 Sue's decimals, R-331 Use units default for blank-After rows, whether a
  new project should stop inheriting the open project's label settings (`newProject()`), an "All"
  index entry kept beyond his five. Deleted keys: lpn_settings_sym_node, lpn_settings_sym_link.
  Seams: it rewrote label-order functions in js/looped-network.js that feat/label-gang-search also
  touches, and its concentration row must read the quality branch's `qualityLabel()` -- merge the
  first of the two, then merge master into the other and run its harnesses.
- **8121 `feat/quality-settings`** 43d22a0f (NEW, needs the Apache reload) -- R-321..R-324. Its
  last check_all was queued when handed back; rerun on the merge before asking for the all-clear.
- **8090 `feat/label-gang-search`** d8afdd5f -- R-315 stepping fixed; R-315 and R-318 carry his
  decisions (repair budget; two leader rules). Perry: the harness no longer checks the settle pass
  after Play stops.

### Open with him

- R-336 / Task 697: Mary votes epanet-plus-plus.org canonical.
- R-235 (WaterCAD sample .inp from IOD).

### Translation sprint

Not launched. Wait until row-paste, symbology-label and quality-settings merge, then one sprint
covers them with table-editing and placement-wizard (already on master).

### Traps met 2026-09-26/27

- **A fresh worktree has no `dev/browser-pass/node_modules`**, so four browser harnesses fail with
  "playwright-core is not installed". Symlink it from the main checkout when creating a worktree.
- **Give each agent a unique scratchpad log name**; one agent's check_all log overwrote another's.
- `example-open-guard-harness.js` fails 2 of 18 under load and passes alone.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
