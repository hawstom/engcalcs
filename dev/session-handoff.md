# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive** (need Tom's all-clear; `feature_freeze` is OFF): `feat/table-width`,
  `feat/fill-handle`, `feat/label-placer` (the seam; merges with the chosen placer), and
  `feat/label-gang-search` (bench only now; delete once a placer lands). Builder branches
  `feat/label-placer-a`, `-b`, `-c`, `-d` never merge on their own.
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

## STATE — 2026-09-28 (evening)

### Production = master 9c71d54f (Tom pulled 2026-09-28 morning)

Master is ahead, pushed through 3f7e7bae, with 329bf07a (R-369) and this handoff merged after it:
Ctrl+Enter (Task 690), his 49 English rulings harvested, label rules round 2 + bench round 2,
Wave 0 of the next sprint, roadmap closures 610/645/648/679, R-369. **R-348: remind him to test
symbology on dev once he pulls.**

### Label placement rebuild (Task 539) -- the live thread

- Rules: `dev/label-placement-rules.md`. **Round 2 Part A (§1-§5) is his markup of 2026-09-28**, word
  for word; Part B records what he deleted (S3, W2, no-churn R12) and why they stay deleted.
  Page from round 1: https://claude.ai/artifact/HBdFNppA44NuwHjeKsi43N
- Bench round 2 (on master): churn replaces "unforced" (a move that shows more is not churn), plus
  reported R5/R7/R9/R11 scores. Judges' secret tests in `dev/lpn-spike/label-bench/judges/`; builders
  must never be told about them. **The bench's `score.js` carries his numeric crossing weights and
  was on the builders' reading list**, so "order only" leaked in both rounds. Move the weights into
  `dev/lpn-spike/label-bench/judges/` before any round 3.
- Round 2 pair, built from Part A only: **C (8132, `?placer=c`)** 79% labels / 49% values, 0 breaks,
  no leader-on-leader; **D (8133, `?placer=d`)** 77% / 54%, 0 breaks, crossing cost below master's.
  Master 45% / 25%. Both pass his two screenshot tests; **both FAIL R-075 again** (long IDs move 67% C,
  66% D; round 1 61%/52%; master 13%). Without a stillness rule nothing asks them to hold, so R-075
  is now a question for him: is it a rule he wants in Part A, or stays secret?
- Perry found and we fixed, before he looks: both placer files never registered in
  `EngCalcs.lpnPlacers`, so `?placer=` silently showed master's labels (the bench cannot see this;
  the seam harness now fails such a file); and a hard wheel flick froze the map ~27 s (every notch
  ran a layout; seam a5131fc4 defers to the settle; worst freeze now 0.3-0.6 s).
- **Next: his side-by-side of C and D** (8132/8133; round 1 still on 8129/8130), then the choice, then
  the winner is wired in (undo its `EC_UNREFERENCED_MODULES` line) and merged with the seam.

### Awaiting his browser pass or ruling

- **8124 `feat/table-width`** f57dedf5: R-366 (measured ~11% print shortfall, headroom only on
  columns at risk, numeric ones included; wrap kept as the fallback so nothing overlaps) and R-367
  (print read EPANET's stored word, FIFO, instead of the label, in every language: a bug, fixed).
  Perry READY.
- **8131 `feat/fill-handle`** 76716393 (+433b86f4): drag-to-fill in the tables. Perry READY with real
  mouse and touch; up/left drags and filtered tables were proven only in the stub harness.
- **2 English strings** (Ctrl+Enter): `lpn_pane_ctrlenter_filled` "Filled {n} cells. {skipped} were
  not changed." and the new Ctrl+Enter row in `lpn_notes_7_def`.
- **6 `$ec_lang_syn` proposals from Wave 0** (`dev/english-friction/2026-09-28-delta.json`, each entry's
  `resolution` holds the exact line). AI may not write them without his written yes. **The sprint is
  blocked on them** (`friction_check.php --sprint=2026-09-28-delta` fails while they are
  refer-to-human); on his yes, write them, mark the entries `intent`, regenerate payloads, launch.
- **R-190**: answered back (the button was retired by R-219).
- **R-369's design**: he agreed. There is no "push scenario to Base" action; say so if he asks.

### EPANET++ is live (Option A), 2026-09-28

epanet-plus-plus.org serves the landing site, epanetpp.org 301s to it; both are clones in their
docroots (`~/addon_html/...`), ignored by the home-folder repo like the other two sites. Search
Console property added. `advisors.html` is on the server but noindex, out of sitemap and nav, until
three more advisors are filled (Tom's card is his own words and his "Tom-surveying" photo).

### Translation sprint (sprint id `2026-09-28-delta`)

311 ruled `lpn_` keys wait; Wave 0 done (9 findings: 2 English fixes and 1 glossary term applied,
6 synonym notes to him). Authorized by his standing "Proceed with a translation sprint whenever
you deem it prudent"; 26 Sonnet agents, 20 at once then 6.

### Traps met 2026-09-28

- **The auto-mode permission classifier refused a green merge to master ("Merge Without Review"),
  killing another agent's stray processes, and once a plain `git status`.** It cannot see our
  merge-on-green rule. Quote Tom's words when retrying; never route the refused action through an
  agent. He asked whether updates caused it; the honest answer is "probably a stricter classifier,
  not our repo".
- **A fresh worktree lacks `dev/browser-pass/node_modules`**, so browser harnesses fail as
  "playwright-core is not installed". Link it: `ln -s <main>/dev/browser-pass/node_modules
  dev/browser-pass/node_modules` in each new worktree before its suite.
- **Closing a roadmap task changes `dev/features.md`**: run `php dev/scripts/generate_features.php`
  with the closure, or master's suite fails "features list fresh".
- **Keep `~/.claude/hooks/chime.busy` until NOTHING is outstanding** -- no agent, no background run,
  no scheduled wakeup. Removing it at a report while notifications could still arrive made every
  later turn chime (his "chimes noise I can't account for").
- **A subagent will write "P.E.", "Founder" and reasons he never gave** into copy about him. Read
  every sentence about Tom before it ships.

- **A placer can score perfectly on the bench and do nothing on the page.** The bench require()s the
  file; the page looks in `EngCalcs.lpnPlacers`. Always have a real-Chrome pass before a placer
  goes to him.
- **A resumed agent that "waits" hands back instead.** Tell it to block with
  `timeout 580 bash -c 'until grep -qE "All blocking checks pass|BLOCKING FAILURES" <log>; do sleep 20; done'`.
- **Perry wrote its journal into the main checkout once** despite a scratchpad brief; check
  `git status` in the main checkout after every pre-review.
- **Killing a stale queued check_all is refused by the classifier** ("Interfere With Workloads");
  let it run out rather than edit under it.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
