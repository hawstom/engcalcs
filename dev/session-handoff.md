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

## STATE -- 2026-09-21, perishable

### HIS REVIEW COMMENTS LIVE IN A FILE AND HE USES IT

`dev/tom-review-queue.md`, guarded by `review_queue_check.php`. **Every `check_all.sh` run prints
the outstanding rows under a NOTE** -- the advisory leg exits non-zero while anything is open on
purpose. He has now PRUNED it himself, deleting cleared rows and REOPENING several with dated notes
underneath, which is the file working exactly as intended. **Commit his edits verbatim, under his
own authorship, before touching anything else.**

### PERRY IS THE PRE-REVIEWER AND HE NAMED IT

`.claude/agents/pre-reviewer.md`. It reviews work it did not write, on every branch, BEFORE Tom is
told a branch is ready, and it **reports rather than fixes**. Five outings so far, and it has earned
the seat every time:

- **Its standing check -- "construct the case the author did not" -- has now paid off four times**,
  and always on the SAMPLE rather than on the numbers. A harness concluding a link label never
  blocks, from customers placed at round numbers on a main whose label repeats elsewhere. Four
  monotonic zoom gestures concluding "the wheel is not the cause". A drop rate reported as
  0.8%/0.8% that was the harness's own hardcoded seed 12345 and the best of ten (true spread 0.0% to
  2.4%). **When a report gives one percentage from a harness, ask what seed it is and re-run it.**
- **Its second standing check:** a commit that fixes a VISIBLE thing gets checked by eye and not by
  the machinery beside it. **For any commit touching an `$ec_lang` value, grep for the same string
  as a `pc.x || '...'` fallback in `js/looped-network.js`.** It has caught that twice.
- **And the lesson worth carrying furthest, from a crash it found on 2026-09-21: THE SAME FUNCTION
  IS NOT THE SAME DOOR.** A table and a popup both called one rename function and only one of the
  two callers finished the job. Distrust "it goes through the same door as X" unless somebody has
  driven both callers with real events.

### On master and pushed: `2964ce32`

- **His own edits**, committed under his authorship.
- **His roadmap ruling applied:** eleven closed or deleted (608, 646, 698, 665, 687, 632, 641, 700,
  635, 689, 283), twenty moved, his notes written into 696, 653 and the water-tower trio 645/648/679.
  **Three new: 703 satellite tiles, 704 messaging, 705 zoom rules.** Plus 701 (the panel guard's
  forty invisible sites), 702 (a view window spanning the antipode), 706 (every cell commit saves
  the whole project).
- **ABOUT: "online since 2010", in his words, both edits.** That is a PUBLIC CLAIM, evidenced by his
  own Wayback finding. It changes a string translated into 26 languages, so it is in drift now.
- **`fix/stale-is-a-snapshot`, a defect track, merged on the ordinary rules and NOT yet browser-tested.**
  His principle, in his own words and now in `CLAUDE.md`: ***"Off means Off, but it doesn't mean Hide
  or Delete. It means Snapshot in time."*** An edit now rewrites only its OWN label and moves only
  that one label, instead of recomputing every label on the map and re-running collision avoidance
  -- which was the slowdown he had been complaining about all week. Editing a junction's elevation
  or demand did not update its map label AT ALL before. The Tables pane now hears Properties, a
  direction that was simply missing. Fire flow rings survive an edit and gained a Clear rings button
  (`lpn_ff_clear`, the only new key). **And the audit found a crash nobody had hit**: a junction
  with no demand stated returned `undefined` into `.toFixed()`.

### THE LABEL ANSWER: HE WAS RIGHT, AND THE NUMBER IS 36 OF 97

**`feat/label-gang-search` `4d763c56`+. NOTHING ABOUT THE DRAWING CHANGES -- the shipped default is
byte-identical to what he tested, and the fix is behind `?debug=labels`.** Say that first; he once
spent a browser pass on this branch when every candidate had been abandoned and nobody told him.

His claim was *"adding 12345678 however causes no conflicts with anything all the way to Japan"*.
Replayed on his own Novato drawing, 97 of 97 reproduced:

- **36 of 97 labels vanish and NOT ONE was boxed in.** A node label's whole search is at most 28
  spots, all inside the SINGLE widest gap between that node's own pipes, none more than three
  label-widths out. When those 28 are taken the code writes "nowhere to put it". **"Nowhere in the
  28 places I looked" is not "nowhere."** Re-searched: 18 had room just past the reach, 11 inside
  the window it never sampled finely enough, 7 in a direction it never looks at all. **Genuinely
  enclosed: zero.** That is the blatant bug, and his description of it was exact.
- **60 of 97 move, and only 19 are real collisions** with a node symbol past the edge they grew
  toward. **The other 41 move only because a neighbour moved first** -- placed one at a time in
  importance order, each treating its predecessors as obstacles, nothing ever going back.
  **Nineteen real collisions shove fifty-one labels.**
- **Built and switched off, honestly:** a label whose ordinary spots are taken is set aside and
  rescued afterwards -- widening rings, all the way round, nearest first, hunting the node's gaps
  widest-first -- running LAST so it can shove nobody. **29 rescued, 0 labels that already had a
  place moved. Hiding goes 36 to 0 on his prefix; 79 to 35 across five examples.**
- **WHY IT IS OFF, and this is the decision now with him:** with EVERY label field on it stops being
  a win. A label rescued onto a long leader is then hidden by the CROSSING-LEADER rule instead --
  **14 to 59 hidden over four views for only 7 more drawn** -- and the drawing rearranges. That is
  trading a hide for a hide one rung down. **The rescue and the crossing-leader rule now decide the
  same thing twice in opposite directions, and only the rescue knows the plane is empty.**
- **AND THE DAMPING HE MARKED *Recommended* CANNOT BE BUILT AS WRITTEN.** "Keep the place it had"
  means the PREVIOUS PASS's place, and where a label sits is required to be a pure function of the
  drawing rather than of history.

Also measured for him: the all-round ring costs **about 16% more, roughly 13 ms a view** (1,663 ms
against 1,928 ms over five examples, four views each), and its advantage has shrunk now the search
can widen -- 18 hidden against 10. **The four corners are the CHEAPEST set measured (1,247 ms), but
his caching idea is not sound and he was told so**: whether a corner is free depends on the VIEW and
not the network, because link labels shed values as you zoom, so there is no "zoom at which the
corners stop working" to record. **`spot route` WAS wired all along** and only acts where a gang of
crossing leaders exists; **what was NOT wired to anything he could see is the four number boxes,
which steer the LINK label pass and cannot touch a node label at all** -- an instrument defect in
what he was given, now labelled in two halves. **The ranked gap list is BUILT**: the node's table of
every gap between its pipes was already computed and already survives a zoom, and the code then
threw all but the biggest away.

### FOUR FEATURE BRANCHES AWAIT HIS BROWSER PASS. NONE MAY MERGE.

| Branch | Head | Port | What he must judge |
|---|---|---|---|
| `feat/tables-spreadsheet` | see worktree | 8096 | four modes, the right-click menu, and the two crashes Perry found now fixed |
| `feat/xy-world-map` | `731ab367` | 8094 | **Task 703: he still sees white squares after FOUR measured-and-fixed causes** |
| `feat/customer-find-labels` | see worktree | 8098 | his two label positions, the Symbology header, the service line |
| `feat/label-gang-search` | see worktree | 8090 | **nothing to look at. A measurement and a switchboard** |

`feat/engine-fetch-wait` MERGED (Task 608 closed on his word). `feat/lock-initials-later` needs
nothing now -- Task 698 is closed.

### WHAT IS OUTSTANDING WITH HIM

1. **The label rescue: adopt it, and what to do about the crossing-leader rule** now that two rules
   decide the same thing in opposite directions.
2. **Task 703, the satellite tiles.** Four causes found and fixed and he still sees white squares.
   **The next move is not a fifth cause, it is an instrument HE can run** -- a readout saying, for
   the current view: wanted, requested, arrived, drawn, failed, retried, cached.
3. **Task 705, the zoom rules** -- he asked to DISCUSS, not to be handed a build.
4. **Task 704's cheapest step** (Ida): give `setNotice()` a history and one icon to read it back.
5. **The 1 px heading misalignment:** what browser and zoom level, and was the scrollbar showing?
6. **`sh dev/host/install.sh`** -- one command, fixes the spurious 2:22 AM page-check mail.

### A TRAP MEASURED AGAIN, WORSE THAN EVER

**ELEVEN concurrent `check_all.sh` runs**, against a cap of about three, with several killed at exit
144 -- green-looking output, failing exit code. **And three agents sat in UNBOUNDED WAIT LOOPS with
their work UNCOMMITTED**, watching for a completion marker a killed job would never write. Both are
named defects here (`.claude/hooks/guard-wait-loops.php`, `dev/scripts/wait_for.sh`). **Tell every
agent: commit first, run the suite at most once, and never watch for a marker.**

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
