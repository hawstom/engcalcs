# Session handoff

**READ THIS BEFORE THE ROADMAP.** RULINGS are permanent. TRAPS are permanent and measured here.
STATE is dated and perishable -- delete a STATE line once you have checked it.

---

## STOP -- read before merging anything

- **`feature_freeze.active` in `dev/branch-policy.json` is the second lock.** Tom's all-clear in
  `dev/branch-all-clears.json` (pin field is **`head`**, not `commit`) does not merge a `protected`
  branch while the freeze stands. Only Tom lifts it. It is currently OFF.
- **`master` is `51768b2d`, green, PUSHED.** `git log --oneline origin/master..master` is empty.
- **Production is whatever Tom last pulled, and it is not master.** Never say "it is live." On
  2026-09-21 production (`~/addon_html/hawsedc.com/engcalcs` on the `jconstru` host) was clean on
  master at **`2751faba`**, which is a long way behind. Everything below that says "on master" is
  therefore something he has NOT yet seen.
- **FOUR FEATURE BRANCHES ARE BUILT AND EVERY ONE AWAITS HIS BROWSER PASS. NONE MAY MERGE.** All
  four are in `protected`: `feat/tables-spreadsheet` (8096), `feat/customer-find-labels` (8098),
  `feat/label-gang-search` (8090), `feat/notice-log` (8099, new). **A session that merges one of
  these on its own green build is the 2026-09-13 failure repeating.**
- **THE APACHE CONFIG FOR THE PREVIEW PANEL IS AHEAD OF THE LOADED ONE.** Three ports were retired
  and one added on 2026-09-21, so Tom must run the two commands at the foot of this file before
  8099 answers. `diff ~/webdev/worktrees/_panel/branch-preview.conf
  /etc/apache2/sites-available/branch-preview.conf` settles whether it is still needed.

---

## THE LABEL QUESTION: HE WAS RIGHT, AND HE HAS NOW ASKED THREE TIMES

**HIS OWN WORDS, 2026-09-21: *"This is the mystery I will not let rest. You say nineteen while I
say zero."*** He is right, and the three answers he was given before were each a weaker fact
wearing a stronger word. The trap list below says a repeated question means the RULE is the
suspect. This is that trap, resolved rather than survived. **The full answers are in
`dev/tom-review-queue.md` rows R-101 to R-103 and on ROADMAP Task 539; do not re-derive them.**

The three things worth carrying:

- **THE SPOTS DO NOT MOVE; THE BOXES GROW INTO EACH OTHER.** The candidate set is identical at
  both widths on all 97 labels, so where a label may be OFFERED a place never reads its text. The
  spots sit at a fixed geometric spacing around the node. Two labels at neighbouring spots collide
  exactly when their half-widths together exceed that spacing -- so a narrow label stacks endlessly
  because the spacing wins, and a wide one **occupies spots it is not standing on**.
- **NINETEEN IS THE COUNT THAT TOUCHED SOMETHING. ZERO IS THE COUNT THAT HAD TO MOVE, AND HIS IS
  THE ONE THAT DECIDES WHAT GETS BUILT.** 36 of 97 labels vanish and not one was boxed in: the
  search gives up after 28 spots inside one gap while there was room just outside it.
- **HIS `spot_prime` MODEL WAS NEVER TRIED, AND THAT IS OWNED NOW.** Only step 4 of his four-step
  sketch was built. `dev/label-placement-algorithms.md` §9d says *"report back before building
  it"* about the one part he flagged himself -- and nobody ever did, though he had written *"if
  it's hard, let me know."* **The first step is cheap and half present:** the node's ranked table
  of gaps between its pipes is already computed and already survives a zoom, and the code throws
  all but the biggest away (his R-079).

**AND SAY "NOTHING SHIPPED" OUT LOUD THE MOMENT IT IS TRUE.** He once spent a browser pass on
`feat/label-gang-search` when every candidate had been abandoned and nobody told him. The shipped
default on that branch is still byte-identical to what he tested; the rescue is behind
`?debug=labels`. Lead with that sentence, every time.

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

## STATE -- 2026-09-21b, perishable

### HIS REVIEW COMMENTS LIVE IN A FILE AND HE USES IT

`dev/tom-review-queue.md`, guarded by `review_queue_check.php`. **Every `check_all.sh` run prints
the outstanding rows under a NOTE.** He prunes it himself and REOPENS rows with dated notes
underneath, which is the file working as intended. **On 2026-09-21 he wrote *"I can't see that my
edits were addressed. Please address them"* -- the sub-bullets under a row are as much his input as
the row, and a session that reads only the row text misses half of what he said.** Commit his edits
verbatim, under his own authorship, before touching anything else.

### PERRY EARNED THE SEAT THREE MORE TIMES ON 2026-09-21

He reviewed three branches and found a real defect on two of them, both of which would have cost
Tom a browser pass:

- **On `feat/tables-spreadsheet`, a regression WORSE than the defect it came from.** The R-038 fix
  blocked the browser's own mouse press on every table cell, to stop character-dragging while
  extending a cell range -- including **inside the one cell being typed in**, so the mouse could no
  longer place the caret or select a substring. On the page where Tom types four hundred numbers at
  a sitting. The shipped harness could not see it because every press it fired was in Ready mode
  and it never once entered Edit mode. Fixed, four mutations killed.
- **On `feat/customer-find-labels`, a number reported as if it were the answer.** A drop rate given
  as 0.8%/0.8% was one seed; his own sweep of ten gave 0.4% to 2.4%, the build agent's own re-sweep
  gave 0.0% to 1.6%. **This is the SECOND time this exact harness has done it.** Also a reachable
  defect: the service line was as heavy as the main at a 1 px link width and heavier below it, and
  the Settings box's `min="1"` is advice to a spinner and nothing at all to a typed entry.
- **His standing check that keeps paying: construct the case the author did not.** It is always the
  SAMPLE, never the numbers. And: **when a report gives one percentage from a harness, ask what
  seed it is and re-run it.** Put that sentence in every build brief.

### ON MASTER AND PUSHED: `51768b2d`. HE HAS PULLED NONE OF IT

- **His four rulings applied:** About Mission now opens *"HawsEDC Engineering Calculators have been
  offered freely online since 2010"* and the License paragraph 2 is now his single sentence alone
  (**both are PUBLIC CLAIMS and both strings are in drift in 26 languages**); Task 610 promoted to
  100; Task 706 promoted to 100 with his intuition written in as the design.
- **Three branches merged on his all-clears and deleted:** `feat/engine-fetch-wait` (Task 608 was
  already closed on his word; **the previous handoff said it had MERGED and it had not**, which is
  why he found it still on the panel), `feat/lock-initials-later` (Task 698), and
  `feat/xy-world-map` (Task 646). Each has a pinned entry in `dev/branch-all-clears.json` whose
  `pin_note` names the commits that landed AFTER he cleared it.
- **Task 706 CLOSED.** A committed cell writes nothing to storage; the whole-project write is
  deferred 300 ms, the number this page already means by "a pause". Every deliberate save flushes
  it, and three page-going-away doors do too. The scenario scan marks the one element edited
  instead of walking all 560. Measured 34-54 ms a cell down to **3-4 ms**. **Task 707 is open for
  the five minutes of a real browser that turns a stand-in into a real number.**
- **His nine misc items shipped:** a time step now reads `24:00 - 25:00` and never wraps, with the
  clock reading moved into the row's TIP rather than deleted; the nine symbology suffix and decimal
  defaults, for a NEW project only; and reaction rate in Properties and in the Pipes table.
- **The four questions he asked are ANSWERED IN THE QUEUE** (R-101 to R-104), not in a lost chat
  message. The two that cost something to admit: **only step 4 of his `spot_prime` sketch was ever
  built**, and nobody ever reported back on the one part he flagged; and his "zero real collisions"
  is the right answer to the question that decides what gets built, while "nineteen" answered a
  weaker one. Task 539 carries both.

### THE HOST IS FIXED AND HIS COMMAND WAS GENUINELY INVALID

He was right twice. `~/webdev/...` is a path on HIS machine and does not exist on the server, and
**`dev/host/install.sh` did not install `check.mustblock` at all** -- the file the R-070 fix lives
in. Both fixed. Installed from `~/tgh/engcalcs-report`, which is the checkout allowed to pull;
**production may never fetch**, because a fetch rewrites `packed-refs` and the About box dates its
build line from that. `sh ~/check.sh` now exits 0 and silent, so the spurious 2:22 AM mail is done.
**Neither production checkout was dirty.** `~/dev_html/...` is still on `feat/lock-initials-later`,
which no longer exists as a branch -- ask him what he wants that host on.

### FOUR FEATURE BRANCHES AWAIT HIS BROWSER PASS

| Branch | Port | What he must judge |
|---|---|---|
| `feat/tables-spreadsheet` | 8096 | nine items of his own, including the scroll paradigm and the mouse-caret repair |
| `feat/customer-find-labels` | 8098 | the Use current view button (it was out by a factor of 576,000 on a map project), the service line, the reserved link-label room |
| `feat/label-gang-search` | 8090 | **nothing to look at.** A measurement and a switchboard. Say that FIRST |
| `feat/notice-log` | 8099 | the message log: one icon in the bottom-left strip, "Recent messages", last 30, in memory only |

### WHAT IS OUTSTANDING WITH HIM

1. **Task 703, the satellite tiles.** The instrument is built and is ON MASTER: he types
   `?debug=tiles` on the page and gets wanted / from cache / requested / arrived / drawn / failed /
   retried / still outstanding for the current view, with every failure named and its byte count.
   **A number that sits at "still outstanding" and does not move is the reading that names it.**
   A fifth cause was also found and fixed on the way. He has not run it yet.
2. **Task 705, the zoom rules** -- he asked to DISCUSS, not to be handed a build. Two things now
   wait on it: the service line shrinking below a pixel, and R-051(2)'s last clause.
3. **The two "step 2" controls.** Still unanswered and still the same question: **ask him which
   menu row he pressed.** One of them rewrites every coordinate by design.
4. **R-062**, his own: how to spend real resources on a deep code review against AI techno-slop.
5. **The 1 px heading misalignment:** re-measured 2026-09-22 against his own screenshot, in real
   Chromium (not the DOM stub) on Elm Street's and Net3's own tables. `getBoundingClientRect` shows
   0px difference between every thead/tbody column boundary at device pixel ratios 1, 1.25, 1.5, 2;
   at CSS zoom 80-150%; and with a vertical scrollbar forced (many rows, `scrollTop` 0/100/400).
   Pixel-level crops of the rendered PNG at 8x also show a continuous, unbroken divider line through
   the heading and every row below it. **Still not reproduced. The standing question is unchanged:
   what browser and zoom level, and was the scrollbar showing?** -- add whether Windows display
   scaling was in play, since that is the one variable this environment cannot exercise (Linux
   headless Chromium's scrollbar reserves no layout width even with classic scrollbars forced).
6. **Row 3 of Ida's list** -- the 57 raw `alert()`/`confirm()` calls. Deliberately not started. The
   first pass is a page of prose sorting them into must-block / could-be-a-notice / merely-informs,
   and that sorting is HIS ruling to make, not an agent's.

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
