# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive, each awaiting Tom's browser pass** (`feature_freeze` is OFF; every one
  is listed in `dev/branch-policy.json`, which until 2026-09-30 named none of them): see STATE below.
  Plus `feat/label-placer` (the seam; round-5 bench), `feat/label-gang-search` (bench only), and
  builders `feat/label-placer-a`..`-d`, which never merge alone.
- **A branch that adds a key fails `payload freshness` and only that**, by design: agents never
  regenerate `dev/translation_payloads/`. Regenerate once on the merge commit, then run the suite.
- The all-clear's pin field in `dev/branch-all-clears.json` is **`head`**. Tom can test a preview
  mid-build, so pin to the final head and say so in `pin_note`.
- **Merge master into a branch before merging it to master**, then run the suite on the merge:
  2026-09-23 twice showed a clean merge breaking a harness (the lag harness and Net3's threshold).
- **Never wrap `run_harnesses.sh` or `check_all.sh` in the browser lock**: each browser harness
  takes that lock itself, so the wrapper deadlocks every one (2026-09-25, 280 s NOT RUN apiece).
  Brief agents to write journals to the scratchpad while a suite runs in the main checkout.
- Since 2026-10-02 (jasmine, 24 threads) `check_all.sh` runs four suites at once in slots, ~8 min
  each; run it with no outer flock. A branch cut before `f9829cee` still uses the single browser lock,
  so its browser harnesses can print `NOT RUN` under load: merge master into it first.

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
- **Preview ports live on jasmine since 2026-10-02**: `~/webdev/worktrees/_panel/ports.conf` lists
  them (pipe rows with what to test), `sh ~/webdev/worktrees/_panel/generate.sh` makes any missing
  worktree, writes one Apache vhost per row and reloads Apache (passwordless via
  `/etc/sudoers.d/previews`; a crontab `@reboot` reruns it). They bind to loopback; Tom reaches them through SSH forwarding, so his browser sees `localhost` (secure
  context, and a host the Mapbox token accepts). A new port needs a new `LocalForward` line on his
  side. Apache honours `.htaccess`; jasmine and production both run PHP 8.5 (2026-10-03).
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

## STATE — 2026-10-03 (evening)

### Master = see `git log -1 master`, pushed. Production = 9c71d54f (Tom pulled 2026-09-28)

Merged 2026-10-03: graph-menu (640), drawing-keep (680), property-arrow-key, fix/undo-label,
bentley-interop (recut as the long-lived 749 branch), then on his word label-cache (681 c/d) and
theme-token (714 phase 1; every CSS colour is now a `var(--ec-*)` token or `chrome_colour_check`
fails). Defect tracks merged on green: fix/status-now (Status report "Tank 1 now filling", his
wording), fix/flow-decimals (Qb/Q 1 decimal US, 2 SI; R-328 reversed by him), fix/label-eviction
(758 closed: zoom pass deterministic, tab keep complete). 600/601/604 promoted to 100 by him.

### Awaiting his browser pass (protected; merge on his all-clear, typed in a session)

Each has a green suite bar the expected `payload freshness`, and is pushed to GitHub. Ask with
AskUserQuestion; the classifier refuses an all-clear lifted from pasted text. Rows in ports.conf say
what to test.
- 8106 `feat/property-graph` (637): box opens at the width where max(1, 5%) rows wrap (his "1 line
  in 20"): pipe ~375, pump ~402 px. No keys changed.
- 8110 `feat/demand-scaling` (754 + criticality 751): his wording and three syn entries written;
  unselected junctions below the minimum are disclosed, never limit the answer. To rule:
  `lpn_ds_outside_below` (CC's wording) and whether his selected heading takes a "?".
- 8112 `feat/keyboard-menu` (748): his four notes built; Perry round 2 found four defects, all
  fixed. A row whose label comes from the project needs `variable: true` (keeps fixed letters
  stable). Other branches' menu rows get letters automatically; a hotkey is `hotkey: 'Mod+Z'`.
- 8108 `feat/profile-file` (604): one row in the Profile tab's down-arrow menu. Perry clean; format
  confirmed against EPANET's Dgraph.pas.
- 8109 `feat/flow-balance` (600): System flow graph, EPANET's Fgraph.pas definition (tanks in
  neither line). Perry's two fixes done. Bottom tab strip wraps to two rows at 1280 px in fr/es/pt/
  tr/ru; 9 px tab padding would fit all (his/Ida's call, not built).
- 8111 `feat/calibration` (601): EPANET's three-page report, per-project, session-only, 42 keys.
  Perry's six fixes done. Changed `lpn_reports_menu_tip` (26 translations now stale).
- 8113 `feat/contour` (600): map layer, Delaunay-linear, reuses node colouring; DEM ground under
  the existing `ec_terrain` gate. Perry's fixes done. Fill limit is `CONTOUR_EDGE_FACTOR = 3`
  (39% of Net3 pipe length bare; 6 covers 95%) — his call.
- `feat/desktop` (756), `feat/label-placer` (539/741): unchanged.

**Merge order and seams:** keyboard-menu first is cheapest (the others' menu rows then just get
letters). flow-balance, contour and calibration each touched the Graphs/Reports menu definition
and `lpn_graphs_menu_tip`; expect small conflicts there and in `dev/new-english-keys.md`
(regenerate, never hand-merge). Regenerate payloads once per merge batch.

### Found 2026-10-03, not yet a task

- **privacy.php's "Ground elevations" row overstates what is sent**: Terrain-RGB requests carry tile
  numbers and the token, not node latitude/longitude; the elevation-fill consent paragraphs 1 and 3
  say the same. Public text: his ruling. Proposed row (contour builder): "The numbers of the map
  tiles that cover your nodes or, for a contour plot over the ground, the area your network covers
  (which says roughly where it is), and your IP address".
- **The suite's psi factor is 0.43353 per ft; EPANET's is 0.4333**, so every pressure reads 0.05%
  above EPANET's report (Perry, calibration review). His call whether to adopt EPANET's.

### Owed translation work

Not run 2026-10-03 on purpose: the owed keys sit mostly on the seven branches above (~100+ keys).
Run one sprint after they merge. Master already owes bentley-interop 13, graph-menu 2, the Redo
Help row (approved: "Ctrl+Y or Ctrl+Shift+Z | Redo the last undone change."; the markup check needs
all 27 at once) and the six Status report "now" strings. Romanian file menu noun/verb pass. Concept
layer: four new terms untranslated. Glossary write-back owed from echo.

### Traps met 2026-10-03

- **A `cmd && merge && ...; setsid check_all &` line starts the suite even when the merge
  conflicts** (the `;` runs on). Start a suite only in its own command, after `git status` is clean.
- **Ctrl+B in his terminal backgrounds CC's running wait**, not the suite. He meant tmux detach.

### Traps met 2026-10-02

- **Ctrl+C in his terminal stops every background agent**, and the harness then refuses SendMessage
  to them. Only his word relaunches them; fresh agents resumed from each branch's commits fine.
- **A merge of master into a branch can fail the new panel guard** on that branch's own undeclared
  show/hide (property-graph's `propGraphSync`): declare it in `panel-touch-harness.js`, do not hide it.
- **Running `new_english_keys.php --write` while a merge is unresolved exits 2 and writes nothing**;
  resolve, commit, then regenerate and commit again.

### Traps met 2026-10-01

- **Two runs per branch queue up when an agent hands back while its run waits, and the classifier
  refuses CC killing a queued waiter.** Brief agents to detach ONE run with a unique log name.
- **`start-fresh-consent-harness.js` flakes under load** ("the banner is showing again"); 11/11 alone.
- **Closing roadmap tasks makes `dev/features.md` stale**: regenerate with `generate_features.php`.

### Traps met 2026-09-30 (night)

- **The machine restarted mid-session** (kernel changed; scratchpad wiped; a master run lost). Every
  agent had committed, so nothing was lost; branches are now also pushed to GitHub as backup.
- **CC force-regenerated `dev/new-english-keys.md` in the main checkout without first checking it for
  his uncommitted edits.** He may have lost an edit. Before ANY `--force`: `git status` and `git diff`
  on that file in that checkout, and harvest first.
- **A long check_all queue gets a background command killed at its time limit.** Start master's run
  detached (`setsid nohup sh -c '...; echo EXIT=$? >> LOG'`) and wait with `dev/scripts/wait_for.sh`.

### Traps met 2026-09-30 (evening)

- **`flock` is not a queue.** With seven suites waiting, master's run waited over two hours while branch
  runs kept winning the lock. Merge master's batch early, before launching branch builds.
- **An agent ran `git stash`/`pop` again** (graph-tab-keys) and applied another branch's stash; it reset
  its own tree and the stash list survived. The rule is in every brief and still broke.
- **A forced `new_english_keys.php --write --force` is safe only when the file equals master's generated
  copy** (`git diff master -- dev/new-english-keys.md` empty). Check that first, every time.
- **Bentley is not ours** (Tom): their scenarios are a tree over alternatives; their criticality and
  on-the-fly analyses run on a copy. He has no WaterCAD.

### Traps met 2026-09-30

- **The auto-mode classifier refuses CC writing an all-clear taken from a pasted message.** Ask him to
  type the merge word in the session itself.
- **The label bench's parallel scorers (3 x node at 3 GB) saturate 4 cores and once filled the 6 GB
  RAM-backed /tmp**; every check_all then took 1-3 hours. Brief the label agent to run on disk
  (`/home/haws/label-trials-work`, 1.1 GB, reproducible) and with one worker while suites queue.
- **His hand edits to `dev/new-english-keys.md` reach master uncommitted-then-committed and fail
  "english rulings harvested" on every branch** until harvested: harvest first thing, and fix a bullet
  that lost its `- ` so the parser reads it.
- **A branch's check_all can go green but for a failure master has already fixed** (the Shift-hint JS
  fallback): read the failure before re-running.

### Traps met 2026-09-29

- **Worktrees had no `dev/browser-pass/node_modules`**, so 10 browser harnesses failed "playwright-core
  is not installed" and read like defects. Symlink the main checkout's into each new worktree.
- **Perry ran `git stash pop`** despite the rule and pulled another session's stash into a worktree;
  a translator edited the main checkout by mistake and reverted it. Put "never stash, never touch the
  main checkout" in EVERY brief, reviewers included.
- **`/engcalcs/` absolute paths work on every host**; only RELATIVE ones break under `/app/`. Do
  not "fix" an absolute `/engcalcs/` path for librewaternet.org.

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

Nothing, normally. His Windows ssh config (`C:\Users\tomha\.ssh\config`, PowerShell's ssh)
forwards 8080, 8100-8139 and 8201-8205. Ports are reusable: give a new branch the lowest number in
8101-8139 that no `ports.conf` row holds. Windows' ssh dies past about 120 forwards, so never grow
that pool past ~60. His WSL tab runs a different ssh that carries no forwards.
