# Session handoff

**READ THIS BEFORE THE ROADMAP.** RULINGS are permanent. TRAPS are permanent and measured here.
STATE is dated and perishable -- delete a STATE line once you have checked it.

---

## STOP -- read before merging anything

- **`feature_freeze.active` in `dev/branch-policy.json` is the second lock.** Tom's all-clear in
  `dev/branch-all-clears.json` (pin field is **`head`**, not `commit`) does not merge a `protected`
  branch while the freeze stands. Only Tom lifts it. It is currently OFF.
- **`master` is `b680e213`, green, PUSHED.** `git log --oneline origin/master..master` is empty.
- **Production is whatever Tom last pulled, and it is not master.** Never say "it is live."
- **FIVE FEATURE BRANCHES ARE BUILT AND EVERY ONE AWAITS HIS BROWSER PASS. NONE MAY MERGE.** All
  five are in `protected`. The list, the ports, and the nine decisions that are his rather than
  anybody's to infer, are in STATE below. **A session that merges one of these on its own green
  build is the 2026-09-13 failure repeating.**


---

## THE LABEL QUESTION IS ANSWERED. FOURTEEN COLLISIONS MOVE FIFTY-EIGHT LABELS

**TOM WAS RIGHT TWICE AND TWO SESSIONS RUNNING ANSWERED HIM WRONG.** The answer he was given --
*"when labels are close enough to touch, a wider one genuinely does not fit in a gap a narrower one
fits in"* -- **is withdrawn**. It treats a one-dimensional growth as though it faced a
two-dimensional gap, and it is a restatement wearing an explanation's clothes: "it did not fit" is
not checkable. His own refutation, 2026-09-18: *"Width and height are independent dimensions in an
area of unlimited width. No amount of additions to the string should affect placements."*

**THE MEASUREMENT HE ASKED FOR, AND IT IS EVIDENCE RATHER THAN A SECOND OPINION.**
`dev/lpn-spike/label-width-cause-harness.js` replays the first-fit offline from its own captured
inputs, in the real committing order, **with a full scan instead of the broad-phase grid**, and
re-tests each mover's narrow choice against the obstacle list as it stood when that label was
placed. **It reproduces the real pass 97 of 97 at both widths.** Every blocker is checked for
DIRECTION, not merely contact: a blocker that is not on the side the box grew towards is failed as
unclassified.

| view | moved | grew into a real object, in the direction it grew | following a neighbour | unclassified |
|---|---|---|---|---|
| synthetic crowded | 9 of 13 | 9 | 0 | **0** |
| Net3-World, fit | 58 of 97 | **14** | 44 | **0** |
| Net3-World, 2x | 34 of 97 | **14** | 20 | **0** |

**ONLY 14 LABELS ANYWHERE EVER GROW INTO ANYTHING, AND IT IS THE SAME 14 AT BOTH ZOOMS** -- each a
node symbol past the growing edge, 0.07 to 1.11 label-heights deep. The other 44 (and 20) **never
rejected anything with their own extra width at all**; 63 of those 64 were blocked only by a label
box that had itself moved. **So the earlier answer named the MINORITY mechanism as though it were
the whole of it. Three quarters of what he is looking at is not width, it is queue position.**

**EVERY SUSPECT HIS ARGUMENT PREDICTED MEASURED ZERO**, and each now has its own assertion, so a
regression into any of them turns the build red: no rejection against a viewport or drawing bound
anywhere (his "unlimited width" case); the broad-phase grid contributes nothing; **candidate sets
are identical at both widths on all 97 labels**, so where a label may be OFFERED a place does not
read its text; no height changed; `dataLabelOrigin()` chooses its side on `end.x >= anchor.x` and
reads no width; `cardinalSides()` prunes on the open-arc table and the resting offset, never on the
box; nothing reads box area. The harness's own selftest kills a candidate reach keyed on box width.

**Open ground was already invariant and that result stands**: 12 junctions and a reservoir, prefix
`1=`, prefix `1234=`, suffix `=1234`, and both at once -- **0 of 13 moved, four times over**, all 13
drawn (`label-width-stability-harness.js` part 3, driven through the WHOLE PAGE; part 1 drove the
placement function directly and so never answered the claim he actually makes).

**THE CHOICE NOW IN FRONT OF TOM, AND IT IS WIDER THAN HE WAS TOLD.** Global assignment over a
conflict graph -- placing the whole drawing at once instead of one label at a time -- is still the
thorough answer and is a real rebuild. **But the measurement suggests a cheaper one nobody has
tried: 44 of the 58 movers had their own first choice sitting FREE, so a label that can still have
the place it had could simply keep it.** That damps the cascade without re-deciding anything, and it
is NOT what the three failed damping attempts did -- those changed how a label CHOOSES. Measure it
before claiming it works. The three attempts cost drawn labels (1,742 / 1,729 / 1,751 against the
shipped 1,762 across 28 views of 7 examples); that is evidence about those three, not about the
class, and must not be cited as though it settled the question.

**AND THE REASON HE SAW NO CHANGE WHEN HE TESTED THE BRANCH: NOTHING WAS EVER SHIPPED ON IT.** All
three candidates lost labels, so they were abandoned -- and nobody said so. He spent a browser pass
on a branch with nothing in it and was then told his test was not the problem. **Say "nothing
shipped" out loud the moment it is true.**

---

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

## STATE -- 2026-09-19, after his second browser pass, perishable

### HIS REVIEW COMMENTS NOW LIVE IN A FILE, AND THAT IS THE SESSION'S FIRST OUTPUT

`dev/tom-review-queue.md`, guarded by `review_queue_check.php` + selftest. He asked for it:
*"Always ensure that my review comments are not lost until they are cleared/addressed. These
reviews, while they are enjoyable, nay, even fun, cost me a lot of time and focus."* **Every
`check_all.sh` run now prints the outstanding rows under a NOTE** -- the advisory leg exits
non-zero while anything is open on purpose, because the printing IS the feature. **Quote him in a
row; never paraphrase into our vocabulary.** `[-]` DECLINED is his marker alone.

**45 rows; 39 cleared this session; 6 outstanding, and 5 of those are questions for him.**

### On master and pushed

`chore/review-queue`, `ida/esc-and-lock-identity` (her journal and wish list, conflict resolved by
keeping both sides and renumbering hers to 38 and 39), `declan/vertex-cell-format`, and
**`fix/esc-focus-and-recalc`, which is a DEFECT track and merged on the ordinary rules.** That one
changes behaviour he will notice and has had NO browser pass:

- **Recalculate off now means off, and the switch was worse than his banner said.** Measured
  before any change: with the box unticked, one pipe-roughness edit on Net3 still ran **1 full
  EPANET solve**, and on a document with **no time period at all the switch suppressed nothing
  whatsoever**. It had only ever been wired to the later time steps of a 24-hour run. The gate now
  sits at the single door every edit goes through. Old answers are **cleared** rather than marked
  stale, and the page says so; opening a project still calculates, because opening a file is asking
  for answers. Key `lpn_time_run_note` DELETED from all 27 files; `lpn_manual_results_cleared`
  added. `dev/lpn-spike/manual-recalc-harness.js`, mutation-tested.
- **Escape reaches Properties / Settings / Libraries only when focus is genuinely inside that box.**
  The menus stay page-wide per the 2026-08-13 ruling. Ida's version, not his blunter "never
  closable by Escape" -- all three boxes have a real focusable x, so nobody is stranded.
  `dev/lpn-spike/escape-focus-harness.js`, 18 assertions, mutation-tested.

### FIVE FEATURE BRANCHES ARE BUILT AND EVERY ONE AWAITS HIS BROWSER PASS. NONE MAY MERGE.

Each is in `protected` and needs his all-clear in `dev/branch-all-clears.json` pinned to the exact
head. **Three moved today on his review.** Each of the three fails `payload freshness` and ONLY
that -- expected, and the orchestrator's to regenerate at merge, never a worktree agent's.

| Branch | Head | Port | What he must judge |
|---|---|---|---|
| `feat/tables-spreadsheet` | `f688970a` | 8096 | the new table look, and above all **the width relaxation**, which he asked to try in public rather than decide in advance -- it applies only to a column he has DRAGGED, so an untouched table looks exactly as before |
| `feat/xy-world-map` | `4505b5db` | 8094 | **the satellite tiles, hardest** -- open a satellite view and zoom in a few times -- and whether the rotation slider now feels right |
| `feat/customer-find-labels` | `4f15643b` | 8098 | the one-line customer label at real zoom, a quarter-size dot, the new Customer symbology section, and **opening a project saved before today to confirm his account numbers are sitting in the Tag** |
| `feat/engine-fetch-wait` | `3df1129e` | 8097 | the solver bar, in a private window throttled to Slow 3G. UNTOUCHED today |
| `feat/label-gang-search` | `4d763c56` | 8090 | nothing to look at -- a measurement and a switchboard. UNTOUCHED today |

### THE MEASURED CAUSES, because they are the part worth keeping

- **THE SATELLITE SLOG WAS QUEUE ORDER, NOT MAPBOX.** Tiles were requested **from the west edge
  across, column by column**, so the middle of the screen -- the part he is looking at -- sat about
  **35th in a queue of up to 192**, and arrival time tracked queue position with no relation to
  screen position at all. And **every wheel nudge deleted the whole picture and threw away every
  tile in flight**, restarting from the same corner, which is exactly why "zooming in and out
  coaxed them slowly". Ruled out with evidence: not the token, not permissions, not rate limiting
  (Mapbox's own limit is 100,000 a minute). Now centre-out, and the old picture stays up
  underneath. **Switching street-to-satellite still clears at once, deliberately** -- otherwise OSM
  tiles sit under the Mapbox credit, which is a licensing problem.
  `dev/lpn-spike/basemap-tile-order-harness.js`; the instrument is kept as `basemap-tile-load-probe.js`.
- **THE WORLD-ZOOM MIRROR IS THE 180TH MERIDIAN.** One tile. Its right-hand edge wraps round to
  -180, so its placement width computes as **-1,750 where it should be +250**, and it is stretched
  backwards across the whole screen on top of everything else. It predates the branch. Fix is small
  and in `js/lpn-georef.js`. **Reported, not built -- he asked for a look.** Row R-045.
- **HIS FOURTH SPREADSHEET MODE IS REAL AND HE INVENTED NOTHING.** Excel has shown it for thirty
  years and calls it **Ready**; W3C calls it **navigation mode**. Excel's four are Ready, Enter,
  Edit, Point -- Point is formula-building, which we have none of. Ours map exactly except the
  first. **The real defect is that one word, Select, names both a STATE and a thing selected**,
  which is precisely the confusion his message describes. Recommendation on file, NOT applied:
  rename our first mode to Ready. Costs no translated words -- none of the three names is shown to
  anybody. `dev/tables-spreadsheet-modes.md`.

### WHAT IS OUTSTANDING WITH HIM, and it is short now

1. **R-035, the reverting cell entry, WAS NOT REPRODUCED** -- 26 real-browser trials across five
   element types, every editable column, Enter/Tab/arrow, mouse/arrow/F2/double-click, fast typing,
   a three-second pause so the recalculation fired underneath, and a tab-switch rebuild. **Which
   table, which column, and was the project opened FROM A FILE rather than an example?** That last
   is the one condition that could not be reproduced.
2. **R-040: copy across columns ALREADY WORKS, measured both ways.** What he saw was most likely
   the single-cell Ctrl+C that did nothing at all until today (R-039). Task 700 carries the
   correction; he should re-test before it is written on.
3. **R-032: rename Select mode to Ready?**
4. **R-045: fix the date-line tile?**
5. **R-002: does he want a reviewer seat?** The ledger is the mechanism; a seat would be a reader.
6. **R-009: account numbers went to TAG rather than Description.** A one-line change plus a re-open
   if he wants the other.
7. **R-011: his exact wording carries no caution glyph**, so it came off with the old sentence.
8. **The three label decisions from the last session are UNTOUCHED and still his:** the all-round
   search (hidden labels 22 to 11 across five examples, but 131 labels move), the four corner
   candidates (earn nothing, move 940, and what they buy is taste), and "let labels look further",
   which he ranked third.

### Still true from before

`feat/lock-initials-later` needs Task 698 and is far behind master; it is also what
`dev.hawsedc.com` was checked out on. `git stash list` still holds `stash@{0}` from the deleted
`feat/customer-demands`, superseded by Task 690 -- drop it deliberately or keep it deliberately.

### A TRAP MEASURED AGAIN TODAY

**Five `check_all.sh` runs were going at once**, against the stated cap of about three -- an agent
reported it unprompted. **And an agent sent into the MAIN CHECKOUT dirtied the tree under the
orchestrator**, which silently blocked a push: `check_all.sh` stamps only on a clean tree, so the
stamp was never written and `pre-push` refused a merge that had genuinely passed. **Give every
agent its own worktree, including a documents-only one.**

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
