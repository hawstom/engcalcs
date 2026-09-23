# Session handoff

**READ THIS BEFORE THE ROADMAP.** RULINGS are permanent. TRAPS are permanent and measured here.
STATE is dated and perishable -- delete a STATE line once you have checked it.

---

## STOP -- read before merging anything

- **`feature_freeze.active` in `dev/branch-policy.json` is the second lock.** Tom's all-clear in
  `dev/branch-all-clears.json` (pin field is **`head`**) does not merge a `protected` branch while
  the freeze stands. Only Tom lifts it. It is currently OFF.
- **Production is whatever Tom last pulled, and it is not master.** Never say "it is live."
- **FOUR FEATURE BRANCHES AWAIT HIS BROWSER PASS. NONE MAY MERGE WITHOUT HIS ALL-CLEAR.** All are
  in `protected`: `feat/tables-spreadsheet`, `feat/notice-log`, `feat/label-gang-search`, and
  **`feat/zoom-scale-rules`, which is new on 2026-09-22.** `feat/map-menu` MERGED and its branch and
  worktree are gone -- he cleared it in his own words (*"Merge and delete branch"*).
  **A session that merges one on its own green build is the 2026-09-13 failure repeating.**
- **EVERY `check_all.sh` AND EVERY HEADLESS BROWSER RUN GOES THROUGH A LOCK:** `flock
  /tmp/engcalcs-checkall.lock sh dev/scripts/check_all.sh` and `flock /tmp/engcalcs-browser.lock
  node ...`. **AND THE LOCK IS NOT A LICENCE TO DISPATCH SIX AGENTS** -- on 2026-09-22 six worktrees
  queued on it at once and the head run held it for **65 minutes**, against a normal few. The lock
  kept the box alive and made every agent slow; two of them handed back saying honestly that they
  had never seen the suite run. **Three tracks at a time is the real number.**

## RULINGS -- permanent

- **THE MAPBOX TOKEN IS URL-RESTRICTED, AND THAT IS WHY SATELLITE NEVER WORKED LOCALLY** (measured
  2026-09-19, and Tom fixed it the same night by adding the local origins to the token's allowed URL
  list: *"URL list fixed it."*). **The lesson outlives the fix: a token being PRESENT is not a token
  being ACCEPTED.** Two rounds were spent saying "the token is present, so that is ruled out" while
  checking only that the string existed. The measurement that settled it was fetching a real tile
  with the real token and varying nothing but the `Referer`: `https://hawsedc.com/` 200,
  `https://librewaternet.org/` 200, and **403 from `hawsedc.local`, `localhost:8094` and
  `localhost:8096` alike** -- satellite AND Terrain-RGB. Street map is unaffected because
  OpenStreetMap tiles need no token, which is exactly why the symptom read as "map but not
  satellite". **CORRECTED BY TOM, 2026-09-19: A NEW PREVIEW PORT NEEDS NOTHING.** He was told each new
  port needs its own entry; his answer: *"No. The list simply contains localhost and
  hawsedc.local."* An allowed-URL entry is a HOST, and every preview port lives on one of those two
  hosts already. **A new HOSTNAME would need an entry; a new port never does.** The 403s measured
  above were from before he fixed the list, not evidence about ports.

- **"Production is not master. Say it again and again."** (2026-09-12)
- **A branch names its capability, in the singular.** (2026-09-12)
- **Tom's all-clear is required to merge a `protected` branch. Green is not done.** (2026-09-13)
- **The interface says Customer, never Meter.**
- **"We no longer want to expose the word 'projection'."** (`dev/tom-coordinate-vocabulary-2026-09-16.md`)
- **"Georeferencing means to attach the world map, not to convert your coordinate system."** (same file)
- **We align the streets with the project, never the project with the streets.** (2026-09-18) The
  project's coordinates are the user's data and nothing of ours moves them.
- **`isGeoProject` IS NOW `isLatLonProject()`, AND THE RENAME SHIPPED 2026-09-18.** It answers only
  "are these coordinates latitudes and longitudes". The question most callers actually want is
  `projectLocatable()`. Five defects came from the confusion; the comment at the definition names
  all five and says not to widen the name back.
- **Delete a language key when nothing renders it and nothing checks it, and say which ones.**
- **Push the sibling sites (`~/webdev/librewaternet.org`, `~/webdev/not-epanet.org`) like this one.**
- **Notify Tom of three things, always:** (a) anything changing what is stored on a visitor's
  device, because it rewrites the consent banner and re-asks everybody; (b) a public claim on the
  landing page; (c) anything needing his testing or approval before a merge to master.
- **Run `git status` at the top of every session and before acting on each of his messages** -- his
  standing approval, 2026-09-18: *"Sure. Sounds like a good practice. Can't hurt."* His own edits
  arrive UNCOMMITTED.

---

## TRAPS -- permanent, each one measured here

- **A CLEAN MERGE CAN STILL BREAK THE TREE, AND THIS IS WHY `check_all` RUNS ON THE MERGE RESULT.**
  2026-09-18: `feat/customer-demands` was written before `isGeoProject` was renamed and called the
  old name in two places; master had renamed it. **Different lines, so git merged both sides
  cleanly and reported no conflict** -- and four harnesses died on an undefined function. Neither
  branch was broken on its own. **A green branch is not evidence about the merge.**
- **NEVER FORCE-REMOVE A WORKTREE.** On 2026-09-18 a cleanup loop ran `git worktree remove --force`
  on `feat/tables-spreadsheet` without reading `git status` first. **Three uncommitted files from a
  rate-limited agent were destroyed permanently.** Check status, commit or stash, then remove.
- **TWO AGENTS IN ONE WORKTREE SILENTLY OVERWRITE EACH OTHER.** 2026-09-18: a new agent was sent
  into `feat-customer-demands` while a predecessor from an earlier session was still working there.
  It noticed only by watching file MTIMES, and stood down rather than fight it. **Before
  dispatching an agent to an existing worktree, check whether one is already in it** -- `pgrep -af
  check_all` prints the directory, and the worktree's own `git status` and mtimes are the other tell.
- **`&& echo "merged"` REPORTS A SUCCESS THE MERGE DID NOT HAVE.** Read the merge's own output.
- **NO MORE THAN ABOUT THREE CONCURRENT `check_all.sh` RUNS.** 2026-09-18 saw up to **twelve** at
  once across four agents; runs that normally take minutes took 25+, and two were killed at exit
  144 -- green-looking output, failing exit code. This machine has 7 GB. **Stagger the agents.**
- **A PREVIEW PORT DOES NOT PROVE A DEPLOY, AND THE PANEL'S OWN HTML IS A THIRD THING THAT GOES
  STALE.** On 2026-09-18 port 8096 answered 200 while the panel still read "worktree missing",
  because `generate.sh` had not been re-run since the worktree was recreated. **Three things must
  agree: `ports.conf`, the Apache config actually loaded, and `index.html`.** `ss -ltn` settles the
  second.
- **THE APACHE RELOAD NEEDS `sudo` AND AN AGENT CANNOT RUN IT.** Retiring or adding a port means
  handing Tom the commands at the foot of this file IN THE SAME MESSAGE. Check first whether it is
  even needed:
  `diff ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/branch-preview.conf`.
- **VERIFY WHICH BRANCH A HOST IS ON BEFORE EXPLAINING WHAT TOM SEES.** 2026-09-18: he reported a
  merged feature missing from `dev.hawsedc.com` and was told "it is on master, look in the File
  menu" -- while **dev was checked out on `feat/lock-initials-later`, 170 commits behind master,
  which does not contain the merge at all.** A `git pull` there pulls that branch. `curl` cannot
  settle it: dev answers 401. **Ask him what `git status` prints on the host.** And do not reach for
  a host explanation FIRST when he has named a different surface -- he named the Branch previews
  panel once and was answered about dev anyway, which he called *"lazy misreading of my message."*
- **`check_all.sh` stamps `.git/check-all-passed` ONLY ON A CLEAN TREE**, and `pre-push` refuses an
  unstamped commit. Commit first, then run the suite. **The pre-commit hook also REFUSES a
  non-merge commit on master**, which is working as designed: move the work to a branch.
- **A USAGE LIMIT KILLS EVERY RUNNING AGENT AT ONCE, AND ONLY WHAT THEY COMMITTED SURVIVES.**
  2026-09-22: four agents died mid-work on one 429; their commits were intact and their reports
  were gone. Brief every agent to commit as each piece lands, and relaunch a dead one with "read
  `git log master..HEAD` first" rather than the original brief.
- **A PREVIEW PORT SERVES THE WORKTREE AS IT STANDS, SO TOM CAN TEST MID-BUILD.** He did, on
  2026-09-22, and cleared a branch whose agent committed three more times after he looked. Pin the
  all-clear to the final head and SAY so in `pin_note`.
- **DO NOT GUESS A CAUSE. MEASURE IT.** The DEM defect was mis-diagnosed four times before anyone
  measured. On 2026-09-18 a stale service worker was the leading theory for a control missing from
  port 8094; **Tom hard-reloaded and it was still missing**, so the theory was wrong and an evening
  had gone into it.
- **DO NOT SHIP SOMETHING TOM HAS QUESTIONED.**
- **MAKE HIS WORDING CHANGES, NOT YOURS.**
- **A REPEATED QUESTION MEANS THE RULE IS THE SUSPECT.** He is not assertive and will not fight a
  confident session. Re-argue from scratch and say which parts of the original reasoning do not
  address what he is asking. **The label question above is this trap in progress, at three rounds.**
- **HE DOES NOT READ CODE.** Translate an agent's report into his language; never forward its
  vocabulary.

---

## STATE -- 2026-09-23, perishable

### ON MASTER AND PUSHED AT `ae1a0b0d`. HE HAS PULLED NONE OF IT

- **UNDO WAS BROKEN FOR ALMOST EVERY PROPERTY FIELD, and he found it with a throwaway test case**
  (*"When I change Base demand, Ctrl+Z or the Undo button don't put it back"*). It was not Base
  demand: **no plain number, text or dropdown field in the Properties popup took an undo snapshot
  at all** -- elevation, tank levels, reservoir head, diameter, roughness, minor-loss k, reaction
  coefficients, valve type -- nor did typing into a single Tables cell. Every other kind of edit
  did, which is why it had never been noticed. Fixed at the seven shared field builders, so ~55
  sites were repaired at once. `dev/undo-audit.md` is the full inventory; **the Settings panel's
  own edits are still not undoable and that is his product call, not a defect to fix quietly.**
- **THE HARNESSES RUN THREE AT A TIME NOW** (`run_harnesses.sh`). 241 harnesses ran strictly
  serially on a four-core box, which is the phase every other worker waits behind. Measured on 24
  pure-node harnesses while three other suites were running: **80 s serial against 50 s**. The 11
  that drive a real browser still run alone, DERIVED from their source rather than a typed list.
  `ENGCALCS_HARNESS_JOBS=1` restores the old behaviour exactly. 241/241 pass either way.
- **99 IS A REAL TIER NOW**, on his instruction (*"Demote to 99 (to narrow our priorities)"*), and
  `roadmap_id_check.php` enforces it. Next went from 21 tasks to 9 at 100 and 7 at 99. **It is not
  the retired 95**: 95 was a dated holding pen, 99 is a permanent second rank inside Next.
- **Tasks 688 and 693 are FOLDED INTO 696** on his word -- one `File, Convert as...` row carrying
  both units and coordinates, with the placement steps shown only when the CRS actually changed.
- **Re-adjust opens at STEP 1 now**, keeping the placement. That closes the "nothing can reach step
  1 twice" gap without a Discard row; he chose it himself (*"I think that is kind"*).
- The time-step tip names the day: `Day 2, 01:00`. **The day boundary is midnight on the clock, not
  24 elapsed hours**, and the harness asserts exactly that on a 06:00 start.
- `dev/language-strings.md` carries his new ruling against **"Do X and Y happens"** where the
  meaning is conditional. Write *"Do X to get Y"* or *"If you do X, Y happens"*.

### THE FOUR BRANCHES -- ALL FOUR NOW AWAIT HIS BROWSER PASS

- **`feat/tables-spreadsheet`: THE 1px DIVIDER IS REPRODUCED AND FIXED, and the earlier "not
  reproduced" line here was STALE.** Two sessions failed on it because they measured with
  `getBoundingClientRect`, which reports 0px difference every time. **The cause is Chromium's
  sticky heading row**: the heading's dividers are painted as a shadow inside a sticky compositing
  layer and the body's as an ordinary border, and under OS display scaling the two round to
  different physical pixels. His own detail -- Windows at 125% -- is what cracked it; **the
  scrollbar turned out to be a red herring**. The new harness reads actual SCREENSHOT PIXELS, which
  is the only thing that could have seen it. Print widths are fixed too.
- **`feat/label-gang-search`: dropping is now the LAST resort, not an early one.** On his own case:
  labels showing fewer properties than asked 51 -> 18, labels not drawn 8 -> 5, property rows on
  screen 408 -> 524. **Two costs he must weigh and only he can:** with EVERY node field on, 12 more
  labels are hidden than before (14 -> 26), and the crowded view is about half again slower. One
  unrequested control arrived on this branch and is the cheapest thing to withdraw: a **"Restore
  label defaults"** button in the Labels box.
- **`feat/zoom-scale-rules`: his "something is going wrong with the shrinking" DID NOT REPRODUCE.**
  Measured in real Chrome on three examples over a 90,000-to-1 zoom sweep: the node-to-pipe ratio
  is constant to 0.1-0.5% everywhere. The fix he is describing landed the same day he looked
  (`d039bb13`), so **ask him to hard-reload and look again on this branch** before anyone hunts
  further. The ratio is now a standing assertion, mutation-tested.
- **`feat/notice-log`**: the RIVER bleed-through and the one-line messages were ONE defect. The tip
  is gone, and **"Messages" is deliberately NOT in Help > Toolbar key** on his own ruling -- that
  button is in the map overlay, not the toolbar, so the row would have named a place it is not.

### WHAT IS OUTSTANDING WITH HIM

1. **The Messenger glyph.** He said *"I cave"* while making the better argument -- that every down
   arrow on this page means "see more", which is cohesion rather than confusion. **He was not
   overruled; he was told so.** Nothing has been redrawn.
2. **The `%` sign** added after his percentile box, which was not in his sentence.
3. **The label branch's two costs** above, and whether the Restore-defaults button stays.
4. **Settings-panel undo**, from `dev/undo-audit.md`.
5. **R-004, R-043, R-062** -- open only because they wait on him.

### THE SPRINT

**STILL NOT LAUNCHED, AND THE REASON HAS NOT CHANGED.** He is rewording shipped strings on most
browser passes, and four branches are still open. Launch it when they have merged.

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
