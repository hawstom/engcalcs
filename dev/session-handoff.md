# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Three feature branches await Tom's browser pass and may not merge without his all-clear:**
  `feat/notice-log`, `feat/label-gang-search`, `feat/zoom-scale-rules`.
  All are in `protected` in `dev/branch-policy.json`. `feature_freeze` is currently OFF.
- The all-clear's pin field in `dev/branch-all-clears.json` is **`head`**. Tom can test a preview
  mid-build, so pin to the final head and say so in `pin_note`.
- Run `check_all.sh` and headless browser runs under their `flock` locks, and run no more than
  four agent tracks at once. WSL has 12 GB and 4 processors since 2026-09-23 (it was 7 GB, and six queued tracks on 2026-09-22 took an hour).

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

## STATE — 2026-09-23

### On master, not yet pulled

- **Undo now works for Properties fields and Tables cells**, fixed at the seven shared field
  builders. Settings stay out of undo on his word (Task 709 closed).
- `run_harnesses.sh` runs three at a time (`ENGCALCS_HARNESS_JOBS=1` restores serial); the 11
  browser harnesses still run alone.
- **Priority 99 is a real tier**, a second rank inside Next.
- Tasks 688 and 693 are folded into 696 (`File, Convert as...`, units and coordinates together).
- Re-adjust opens at step 1 and keeps the placement.
- The time-step tip shows `Day 2, 01:00`; the day changes at midnight on the clock.
- `dev/language-strings.md` has his ruling against "Do X and Y happens" for a conditional.

### The branches awaiting his pass

- **`feat/label-gang-search`:** dropping labels is now the last resort. Two trade-offs are his to
  weigh: with every node field on, 26 labels hidden instead of 14, and the crowded view is about 50%
  slower. The unrequested "Restore label defaults" button is the easiest thing to withdraw.
- **`feat/zoom-scale-rules`:** his shrinking problem did not reproduce after `d039bb13`; ask him to
  hard-reload and look again before hunting.
- **`feat/notice-log`:** the bleed-through and one-line messages were one defect, fixed. "Messages"
  is deliberately not in Help > Toolbar key.

### Open with him

2. The `%` sign added after his percentile box, which he did not ask for.
3. The label branch's trade-offs and the Restore-defaults button.
5. R-004, R-043, R-062.

### Translation sprint

Not launched: he is still rewording strings, and four branches are open. Launch after they merge.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
