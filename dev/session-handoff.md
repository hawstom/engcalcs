# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Six branches may not merge without Tom's all-clear** (all in `protected` in
  `dev/branch-policy.json`; `feature_freeze` is OFF): `feat/label-gang-search`, `feat/zoom-control`,
  `feat/table-editing`, `feat/customer-node`, `feat/menu-button`, `feat/report`.
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
- **Flaky under load, green alone:** `run-progress-harness.js`; `dev/browser-pass/specs/basemap.js` and `firstproject.js`
  tile counts at a 900 ms settle. Pre-existing and unrelated: `scale-publish-harness.js` (2 checks),
  `dev/browser-pass/specs/place.js` (stale "lat/lon project now"; section 17 filechooser order),
  `dev/browser-pass/specs/visibility.js` (stale sub-heading list; "Escape closes it"). Browser-pass specs are not in
  check_all.

## STATE — 2026-09-25, evening

### Master is 017ee4de, pushed with a green suite (Tom has not pulled it)

Merged on his all-clear today: first-project, convert-as, property-venue (his property-venue
bullet was headed feat/table-editing; the Find content made it this branch, recorded in the
all-clear). Sibling sites pushed with the same change: librewaternet.org eef380e, not-epanet.org
a058b5d. **They say the street map shows on the first, empty project, and CLAUDE.md now says so.
Tom should pull all three together**, or the landing pages describe a first visit his server
does not have yet.

### Awaiting his browser pass (each green on its own suite except the expected payload check)

- **8103 `feat/zoom-control`** 43902998: R-263 (one cause fixed: a fit that hid labels kept room
  for them; his exact screenshot NOT reproduced), R-264 (dragged label leapt to 2.2x its leader;
  fixed), R-265 tips in his exact words.
- **8105 `feat/table-editing`**: R-254..R-259, the spreadsheet heading (click selects, ⋮ menu,
  arrow under ⋮, Manage columns applies on OK, move-to-beginning/end, print names the PDF
  `{project}-{table}`). 7f3661a6: duplicate Cancel key removed; the divider harness now hides
  the ⋮ glyph while it measures, since it was reading the glyph as a divider. No Perry pass yet.
- **8113 `feat/customer-node`** 105d9f68: R-267..R-270. Perry's grip-over-junction defect fixed.
- **8114 `feat/menu-button`** eceab3ab: outlined only, R-271. Needs his all-clear; merge master first.
- **8115 `feat/report`** 87e15a16 (new port, needs the Apache reload): Tasks 715/716, Water >
  Reports > Status / Full. Perry's two defects fixed. **SEAM with table-editing:** the Full
  report's print suggests a generic PDF name because the page may not write `document.title`;
  table-editing adds the one reviewed exception (set and restored around print). After
  table-editing merges, route the Full report's print through the same path.
  Adds two localStorage furniture keys, `lpn_statusbox` and `lpn_fullbox`.
- **8090 `feat/label-gang-search`**: unchanged.

### Open with him

1. R-252: he believes SI writes no space before a unit symbol. The SI Brochure and NIST SP 811
   both put a space ("10 mm"); the suffix prefill is always one space, which is right for both.
2. R-253/R-262 answered in the 09-25 evening report; lpn_convas_no_transform reworded to name the
   system, awaiting his ruling. R-260 (Find ID empty) could not be reproduced; asked him to retest.
3. R-235, WaterCAD sample .inp from IOD, as before.

### Translation sprint

Not launched. Master has 2 unread strings and five branches carry new English awaiting his pass;
launch after that pass merges, so one sprint covers them.

## Commands to hand Tom with any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
