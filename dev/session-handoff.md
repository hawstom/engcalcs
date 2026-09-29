# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive** (need Tom's all-clear; `feature_freeze` is OFF): `feat/table-tab-keys`
  (8136), `feat/frequency-plot` (8137), `feat/label-placer` (the seam; merges with the chosen placer)
  and `feat/label-gang-search` (bench only; delete once a placer lands). Builder branches `feat/label-placer-a`..`-d` never merge on their own.
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

## STATE — 2026-09-29 (morning)

### Master = see `git log -1 master`, pushed. Production = 9c71d54f (Tom pulled 2026-09-28 morning)

On master since his last pull, all defect/chore tracks merged on green: the four 09-29 all-clear
branches (fill-handle, table-width, selection-set incl. fire-flow column sorting 5fe5c2a7 and Task
742, tables-legend), Time Series fixes, `fix/start-fresh-consent` (Start fresh now also erases
`ec_consent`, `ec_blang`, `ec_seen` through `consent.php`'s `ec_wipe`, so the banner returns --
**a change to what the wipe erases; Tom was told**), `fix/lock-disclosure` (Ask prompt, privacy page
rows, inventory: Ask's initials are kept in the server lock record, never in the browser -- his
"Go ahead and make those disclosure fixes", 09-29), and sprint `2026-09-29-delta` (16 keys + the
Ask prompt in 26 languages). Roadmap: Tasks 739-742 unspliced from the header; 742 closed.
**Remind him to try drag-to-fill on a phone after he pulls** (his ask).

### Awaiting his browser pass (protected; merge on his all-clear only)

- `feat/table-tab-keys`, port 8136 (Task 690): Ctrl+Shift+PageDown/PageUp between tables, no wrap,
  same column else ID, row clamped, a half-typed cell saved first, works from EMPTY tables (Perry's
  blocker, fixed 065d7e81). Adds one English row to `lpn_notes_7_def`, which fails `lang markup
  matches English` in 26 languages until translated after his ruling; that and payload freshness
  are its only failures.
- `feat/frequency-plot`, port 8137 (Task 600 slice 1): bottom-pane Frequency tab, EPANET's curve
  (Fgraph.pas: point i at 100*i/n), Junctions/Pipes, follows the run frame, snapshot kept with
  Recalculate off. Perry: no blockers. 9 new `lpn_freq_*` keys need his English ruling. No Water
  menu row because Task 640's Graphs submenu does not exist. Unverified: reaching the bottom pane
  on a phone (the toolbar hides it at phone width; pre-existing).
- Both ports need his Apache reload (commands at the foot).
- Label placement: pipe 185 is SETTLED -- no room aligned (needs 94.8 px, 57 px free), so level is
  correct under R14 in C and D; Perry's probe was wrong. Fixed probe exists only on branch feat/label-placer
  (commit 5508e0a1, probe-r14.js in its label bench), not on master. Next: his side-by-side of C (8132) and D
  (8133), C first.

### Awaiting his words

- Three English rulings hold sprint 2026-09-29-delta open in friction_check (not in check_all):
  `lpn_goto_on_map` "Go to on map" (proposed "Show on map"; ro/pt/id calqued it ungrammatically),
  `lpn_ff_design_no_selection` "...or set All" (no option is called All; proposed "...or choose
  All other junctions and all pipes."), `lpn_find_shift_hint` (proposed "Shift+click to add or
  remove one."). After his ruling, retranslate those keys in 26 and baseline them.
- Review queue: R-338 and R-351 are `[?]` -- does round 4 (C/D) answer them.
- Lock ID from a copied file (Explorer copy keeps the docId, so two files share one lock): offered
  as Task at 50, not added.

### FIRST JOB NEXT SESSION: the stale translations (drift audit, 09-29)

`detect_english_drift.php` flags 184 keys against a 09-06 baseline. Audited
(`dev/drift-audit-2026-09-29/`): **8 keys are stale in all 26 languages and are real** --
`consent_body` (the consent banner; the translations never say "cookie" nor "records nothing you
type"), `about_body_html` (still says Bitbucket), `install_firefox_body`, `lpn_main_title`,
`lpn_units_length`, `lpn_result_head_tip`, `bpn_demand_tip`, `mtc_d50_mra`. 117 lpn_ keys are stale
in SOME languages (per-key lists in `combined_full.json`); 52 are fresh; 7 are false positives
(apostrophe or reverted edits: re-baseline each with `--update=<key> --reason=...`). Then
`--update --except=$(cat dev/drift-audit-2026-09-29/holdback.txt)` baselines the 52, and a resync
sprint for the 8 (consent first), then the 117 by language, closes it.

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

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
