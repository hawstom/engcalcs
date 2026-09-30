# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive, each awaiting Tom's browser pass** (`feature_freeze` is OFF):
  `feat/table-tab-keys` 8136 (Task 690; he wrote "close, merge, and delete" in a PASTED list, and the
  classifier refused CC recording that as an all-clear, so it waits for his word typed in a session),
  `feat/frequency-plot` 8137, `feat/help-menu` 8138, `feat/fireflow-scope` 8139, `feat/pane-height`
  8140, `feat/property-graph` 8141, plus `feat/label-placer` (the seam; round-5 bench) and
  `feat/label-gang-search` (bench only). Builder branches `feat/label-placer-a`..`-d` never merge alone.
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

## STATE — 2026-09-30

### Master = see `git log -1 master`, pushed (b722037e + this handoff). Production = 9c71d54f (Tom pulled 2026-09-28)

Merged and pushed 09-29/30: roadmap reshuffle (99 tier retired, ten tasks to 100; 697 and 724 closed;
239 and 322 closed on CC's evaluation; 743-747 added); sprint `2026-09-29-echo` (the 125 drift-audit
keys resynced in every stale language, incl. `consent_body` in 26 -- no consent version bump, wording
only -- plus his Shift-hint English and his `$ec_lang_syn` for `lpn_goto_on_map`, and "Show on map"
in 16 languages that had "Go to map"); Task 711 (`fix/new-project-view`); Task 737's concept layer
(`chore/term-concept`, `dev/term-concepts.md`). Drift baseline re-set 2026-09-30: CHANGED none.
**Remind him to try drag-to-fill on a phone after he pulls** (his ask, still open).

### Awaiting his browser pass (protected; merge on his all-clear, typed by him in a session)

- 8136 `feat/table-tab-keys` (Task 690): needs master merged in again (roadmap conflict: take master's
  side) and `lpn_notes_7_def`'s new row translated in 26 before master can go green.
- 8137 `feat/frequency-plot`: now fills the pane (a CSS selector lacked `#lpn_freq_chart`). Its own
  harvest of his rulings will conflict with master's: take master's side of `dev/english-key-rulings.json`,
  the delta friction file and `dev/new-english-keys.md`, then regenerate.
- 8138 `feat/help-menu` (745, 718): Perry READY; corner-resize of the new box unverified headless.
  New furniture key `lpn_hotkeysbox` (told Tom). Last full run was queued when this was written.
- 8139 `feat/fireflow-scope` (746): Perry READY; five `lpn_ff_*` keys deleted in 27 files.
- 8140 `feat/pane-height` (744): map reserve 160 -> 32 px. Green but for the since-fixed fallback.
- 8141 `feat/property-graph` (637): graph at the foot of Properties; also caps Properties to the room
  below it on a phone (every Properties box, not only graphed ones). Green but payload freshness.
- All six new ports need his Apache reload (commands at the foot).

### Awaiting his words -- https://claude.ai/artifact/J5Vb4829NzQYnwFWuHBkRm (answers in its db, `answers/*`)

Label rules from round 5 (the round-5 record lives only on branch `feat/label-placer`, in its label-trials folder), Task 738
(Declan vs Ida), Task 699 merges (`dev/key-duplication-audit-2026-09-30.md`), Head vs HGL (737), Help
menu labels and where Notes goes, the copied-file lock (747), keyboard menus. Read the answers with
ArtifactData `list` on collection `answers` before anything else. Review queue R-338/R-351 still `[?]`.

### Owed translation work

New English waiting on branches (translate on each merge): help-menu 6 keys, fireflow-scope 4 new +
2 changed, frequency-plot 9, property-graph 1, table-tab-keys `lpn_notes_7_def`. The concept layer's
four new terms (label-sym-sally, label-user-tessa, label-long-dora, hydraulic-head) have empty
translations. Glossary write-back owed
from echo: "Chemical" is a literal EPANET token in `lpn_quality_chemical_name_tip`; Bef./Aft. read as
prefix/suffix; `lpn_goto_on_map` = show on map.

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

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
