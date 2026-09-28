# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive** (need Tom's all-clear; `feature_freeze` is OFF): `feat/label-gang-search`,
  `feat/ctrl-enter`, `feat/table-width`, `feat/epanet-plus-plus`, `feat/water-tower`.
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

## STATE — 2026-09-27 (night)

### Production is 83bf02d5 (Tom pulled 2026-09-26). Master 1a458e62 is ahead of it

Unpulled on master: everything listed 09-27 evening, plus today symbology-label and quality-settings
(his all-clears), the mode-button Esc fix (R-353) and a harness fix. **R-348: remind him to test
symbology on dev once he pulls.**

### Awaiting his browser pass or ruling

- **8124 `feat/table-width`** (R-354, R-356) -- his width rule, centred ID, vertices `n/e|n/e`.
  5ce78416. Perry found headings breaking mid-word anywhere; fixed (real font measurement, a soft
  hyphen at the rule's own split, `anywhere` back to dragged columns only). Green; not cleared.
- **8123 `feat/ctrl-enter`** d6558eb4 -- he asked for endorsement; Mary and Ida both endorse
  (their journals 2026-09-27). Needs his merge word.
- **`feat/epanet-plus-plus`** 1ca95ff5 (Task 697 B1, no preview port: the brand shows only on
  that Host) -- the app served as EPANET++ at epanet-plus-plus.org/app/, own canonical. Green.
  Held for RELEASE, per his "A for development. Release as B1." Host steps in the plan §6.
- **8126 EPANET++ landing site** (Option A), `~/webdev/epanet-plus-plus.org` and
  `~/webdev/epanetpp.org`: new local repos, NO GitHub remote yet (ask him). Every claim needs his
  reading; the agent's list of claims beyond his hero copy is in the 09-27 report.
- **`feat/water-tower`** (Tasks 679/648/645): comparison page
  `dev/icon-preview/larger-tower-2026-09-27.html` on that branch (dev/ is not web-served; open
  the file). Nothing shipped changes until he picks.
- **Label placement (R-357..R-359): the branch is PAUSED for the interview**
  https://claude.ai/artifact/PyZpPyHbpACHsu7fHVZEZJ -- read answers with ArtifactData list
  `answers`, write them into a scope doc, then build per his Q01 answer. Do NOT keep repairing
  feat/label-gang-search. His images never arrived (R-358).

### Translation sprint

Held: 48 English strings on master await his ruling (`dev/new-english-keys.md`). Sprint after he
rules them and ctrl-enter/table-width land.

### Traps met 2026-09-27 (night)

- **A subagent deleted `~/.claude/hooks/chime.busy`** (it read the memory note meant for the
  orchestrator) and he heard the chime early. Brief every agent never to touch it; re-check it
  after each agent reports.
- **A harness written on master can break on a merged feature's new defaults**: property-echo
  compared a flow label to 0.05 after symbology made gpm labels whole numbers. Fixed; the lesson is
  to run the suite on the merge commit before pushing, which caught it.
- `example-open-guard-harness.js` prints FAIL lines for its deliberate mutations; those are
  expected. Read its exit code, not its FAIL lines.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
