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

## STATE -- 2026-09-22 (evening), perishable

### ON MASTER AND PUSHED AT `f9f87771`+. HE HAS PULLED NONE OF IT

- **His 125 English rulings and his 17 own rewordings are harvested and applied.** The rulings are
  in `dev/english-key-rulings.json`; the 17 edited strings are in `lib/lang.ec.en.php` in HIS
  words. **Applying them broke `js_fallback_string_check.php`** -- six of those keys carry a
  duplicate English literal inside `js/`, and moving the language file alone drifted them. Fixed
  the same session. **Next time his edits land, run that check before assuming master is green.**
- **27 language keys RETIRED** -- every one `lpn_survey_*`, none ever translated, none rendered by
  anything. `lpn_survey_fmt_*` were dead by his own 2026-09-18 ruling that the format chooser shows
  the bare acronym. **One of the 27 was `lpn_survey_err_no_coords`, which he had reworded by hand
  that same morning** -- he spent attention on a string nothing can display. Tell him when it
  happens; it is the `EC.lpnTerrainFill()` shape again.
- `fix/property-echo`: editing Base demand now updates the Properties box, not just the map label
  and the table. The open popup was never refreshed when the debounced solve landed.
- `fix/time-step-instant`: the time-step selector names ONE instant per row again (`25:00`), not a
  range. **Tom reopened his own R-105 and was right the second time**; Mary confirmed against
  EPANET, epanet-js and Bentley's Time Browser. Elapsed time still climbs past 24:00 and the clock
  reading stays in the tip.
- Tasks 247, 669 and 705 CLOSED on his word; 708 promoted to 100; Task 696 kept OPEN with his
  round-three findings folded in.

### THE FOUR BRANCHES, AND WHAT IS OPEN ON EACH

- **`feat/notice-log`**: the "RIVER" bleed-through and the messages-on-one-line were ONE defect --
  the panel was `display:flex` with no direction and had no background of its own. Both fixed and
  confirmed live by Perry. The tip is off the glyph and `lpn_msglog_tip` is deleted.
  **PERRY FOUND AN UNREQUESTED REGRESSION: dropping the tip also dropped "Messages" out of
  Help > Toolbar key**, because `setIconLabel()` does both jobs. Repair dispatched. **THE GLYPH
  ITSELF IS HIS TO SETTLE** -- Ida says neither the down arrow nor the `+` (the down triangle
  already means "a menu opens below" twice on this page and marks column sort a third time; `+`
  already means "make a new one" twice) and recommends repairing the same clock: a dot at the
  centre and the hands spread wider.
- **`feat/tables-spreadsheet`**: PRINT IS FIXED -- columns kept their em widths while the print
  font stayed at 9pt, so headings shattered one letter per line; the sheet's font now shrinks by
  the same factor. **THE 1px DIVIDER MISALIGNMENT DID NOT REPRODUCE** at device pixel ratios 1,
  1.25, 1.5 and 2, at CSS zoom 80-150%, or with a forced classic scrollbar, measured by geometry
  and by reading painted pixels. **This is the second session that failed to reproduce it. ASK HIM
  for browser, zoom level, Windows display scaling, and whether a scrollbar was showing.**
- **`feat/zoom-scale-rules`** (NEW): his four rulings of 2026-09-22 -- one percentile rule instead
  of two, pipe widths shrinking too, Net3 threshold 30, and the misplaced `ft`.
- **`feat/label-gang-search`**: round four in flight on his three items -- dropping must give way
  to longer leaders, the one label in `_label-mystery.PNG` that both dropped properties and
  travelled too far, and R-136's measured answer on why extra characters lengthen the gang.
  **HE HAS SAID "This may be good to undo." THAT IS HIS CALL AND NOBODY ELSE'S.**

### WHAT IS OUTSTANDING WITH HIM

1. **The Messenger glyph** -- Ida's recommendation against both of his candidates, above.
2. **The 1px table dividers** -- his browser and zoom, above.
3. **The two "step 2" controls** -- still unanswered: which menu row did he press?
4. **A discard row for a grid placement** -- Re-adjust opens step 2 only, so a grid project placed
   in the wrong town has no way back. His wording needed.
5. **His two general points about English**, which he asked to make general only "once we achieve
   mutual understanding": (a) do not say a blank differs from zero, say what a blank is FOR;
   (b) do not write "Leave it at X and Y happens" where the meaning is "Leave it at X to get Y."
   Nothing has been written into `dev/language-strings.md` yet, deliberately.
6. **R-004, R-043, R-062** -- open only because they wait on him.

### THE SPRINT

**NOT LAUNCHED, ON PURPOSE.** 168 keys are untranslated and 88 more wait on the four branches, and
he has authorized a sprint "whenever you deem it prudent." It is not prudent yet: he reworded 17
shipped strings this same day, and the branches will add more. A sprint now buys retranslations of
text whose meaning is still moving. **Launch it when the four branches have merged.**

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
