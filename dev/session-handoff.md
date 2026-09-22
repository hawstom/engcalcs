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
  in `protected`: `feat/tables-spreadsheet` (8096), `feat/notice-log` (8099),
  `feat/label-gang-search` (8090), `feat/map-menu` (8101). Every one has been through Perry at
  least twice this round. **A session that merges one on its own green build is the 2026-09-13
  failure repeating.**
- **EVERY `check_all.sh` AND EVERY HEADLESS BROWSER RUN GOES THROUGH A LOCK** (adopted 2026-09-22,
  after a freeze forced Tom to kill the session): `flock /tmp/engcalcs-checkall.lock sh
  dev/scripts/check_all.sh` and `flock /tmp/engcalcs-browser.lock node ...`. One at a time on
  this 4-core, 7 GB box. It is slow and it did not freeze once.

## THE LABEL QUESTION: WHERE IT STANDS (Task 539, `feat/label-gang-search`)

**He was right that a lattice blind to label size was a bug (R-108), and on testing the fix he
wrote *"I am incredulous. You made huge progress."*** What is built: a node label first claims
"room to grow" (about six rows of clear space), so text length stops deciding where it goes; gang
columns slide as one; labels slide toward their nodes; a label still far out may leave its own
leader line. **R-075, stated honestly, both halves every time:** adding 12345678 moves and hides
NOTHING at 4x and 8x on Net3 and Net3-World, and at the fit view still moves 5-7 and hides 16-18,
of which 18-19 had nowhere to stay whatever the placer did. **The cost is real: the label pass is
about 2 to 2.5 times master at the fit view**, and it is the GANG REPAIR, fed by room to grow --
not the slide, which measures 2-5% of the pass. The next cheapening is a spatial index for the
repair's trial scoring, which needs no decision from him. **Never report one percentage from a
label harness on a loaded machine**: Perry once read 1.7 s -> 4.9 s off a single wall-clock
sample that measured the machine, not the code.

## THE TWO STEP TWOS: A QUESTION OUTSTANDING WITH TOM

**He reported "step 2 controls still move the project" and it is NOT reproducible in the new
wizard.** Driven in real headless Chrome on his own port: a 20 degree turn leaves `R1` at screen
`18.9999,681.9706` **identical to four decimals**, while all six basemap tile affines change.
`d4bb8a01`'s tile repaint works.

**THERE ARE TWO CONTROLS CALLED "STEP 2" AND THE CODE SAYS HE IS PROBABLY IN THE OLDER ONE.**
`georefStart()` / `GEOREF_STEP_ATTACHED`, reached from **File > Import XY to lat/lon...**, has the
same drag/scale/rotate rectangle, the same "step 2" wording, **no dial at all**, and its
`georefApplyDrag()` -> `georefSetTransform()` -> `georefWrite(t)` **genuinely rewrites every
coordinate, by design, because it is a CONVERSION rather than a placement**. That single cause
explains both of his reports exactly. **ASK HIM WHICH MENU ROW HE PRESSED.** If it was the File row,
the defect is not the arithmetic -- it is that two different operations wear the same words, and one
of them does the thing the standing ruling says we never do.

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

## STATE -- 2026-09-22, perishable

### HIS REVIEW COMMENTS LIVE IN `dev/tom-review-queue.md` AND HE USES IT

Rounds R-126 to R-152 are this session's. **He asked for engagement, not accumulation** (*"Engage
with me on tom-review-queue.md so that it is fully addressed and deleted or used further instead
of going stale"*). Four old rows sit open only because they wait on him: R-004, R-043, R-062 (his
code-review question, answered), R-104 (answered). Put them to him by name for a clear/keep word.

### ON MASTER AND PUSHED. HE HAS PULLED NONE OF IT

- `feat/zoom-symbol-size` (Task 705, on his all-clear): symbols stop growing on the ground past
  the labeling threshold, or past the 10th-percentile link length when none is set; reservoirs and
  tanks exempt; one threshold row in Settings. Four open questions from the build are in the
  final report of 2026-09-22 and not yet asked.
- `fix/example-open` (on his all-clear): the gallery closes on the first click and ignores repeats.
  His 25-second wait did NOT reproduce (2-4 s under load); R-130 stays open for his retry.
- `fix/daily-report-headings`: the rank-by-shopping table now has its heading row (the report
  script's own filter was throwing it away) and a two-line note on what people and page loads
  count. Both require 10+ seconds on the page, so robots are nearly all excluded; there is no robot
  list anywhere in the code. The host needs no reinstall: the cron job fetches master itself.
- Task 703 closed on his word; Task 708 opened (every property in every venue, his question).

### THE FOUR BRANCHES, AND WHAT IS STILL OPEN ON EACH

- **`feat/notice-log`: THE ICON EDIT IS BLOCKED AND IS HIS TO SETTLE.** He likes the drawing he saw
  (*"I like the down arrow glyph"* -- the clock hands made a V). An earlier instruction had already
  redrawn the hands as an L before his words arrived, and the agent's attempt to restore the V was
  refused by Claude Code's own safety classifier as a relayed instruction. **Not worked around.**
  The branch ships the L. It is a one-line revert of the hands in `lib/Icons.lib.php` `history`,
  to be made in a session where he says it himself. Round three landed at `f02da0be`: the
  loading banner waits 1 s before showing and then holds 1.5 s, so it never flashes; engine notes
  are logged; a click that closes the log panel no longer acts on the map.
- **`feat/map-menu`**: Detach keeps a grid placement; nothing can DISCARD one now. His wording
  needed if he wants a discard row. Re-adjust and Scale greyed on lat/lon as well as EPSG (he said
  EPSG only) -- tell him.
- **`feat/tables-spreadsheet`**: a first visit to a table is still a real build (about 0.5 s,
  2.4 s at 4x CPU throttle). Chunked first build is scoped in the agent's report, not started.
- **`feat/label-gang-search`**: above.

### WHAT IS OUTSTANDING WITH HIM

1. **The two "step 2" controls** -- ask which menu row he pressed (section above).
2. **R-062**, how to spend on a deep review against AI slop -- answered in the queue, awaiting him.
3. **Row 3 of Ida's list** -- the 57 raw `alert()`/`confirm()` calls; the sorting is his ruling.
4. **The panel reload** below drops two retired ports; optional, nothing new needs it.

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
