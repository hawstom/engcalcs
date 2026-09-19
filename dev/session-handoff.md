# Session handoff

**READ THIS BEFORE THE ROADMAP.** RULINGS are permanent. TRAPS are permanent and measured here.
STATE is dated and perishable -- delete a STATE line once you have checked it.

---

## STOP -- read before merging anything

- **`feature_freeze.active` in `dev/branch-policy.json` is the second lock.** Tom's all-clear in
  `dev/branch-all-clears.json` (pin field is **`head`**, not `commit`) does not merge a `protected`
  branch while the freeze stands. Only Tom lifts it. It is currently OFF.
- **`master` is `0d2256fd`, green, PUSHED.** `git log --oneline origin/master..master` is empty.
- **Production is whatever Tom last pulled, and it is not master.** Never say "it is live."
- **`feat/tables-spreadsheet` is built, green on the merge result, and AWAITING HIS TEST** on port
  8096. Nothing else is waiting on an all-clear. See STATE.


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

## STATE -- 2026-09-18 night, perishable

### What landed on master this session (`b7cb5e23` -> `5a9c7fae`, pushed)

- **`isGeoProject` -> `isLatLonProject()`**, 20 files. See RULINGS.
- **The gravity note is gone.** Tom: *"We can't keep showing the gravity message
  `lpn_engine_minor_loss_note` forever. It's just noise. If anything, put it in settings in the tip
  for the choice of whether to use the built-in solver when possible."* Done exactly there.
  **KEY DELETED FROM ALL 27 FILES: `lpn_engine_minor_loss_note`.** The warning CODE
  `minor-loss-gravity-differs` is still raised in `js/lpn-epanet.js` and two harnesses still assert
  it; only the sentence is gone. `engine-note-once-harness.js` was re-pointed at the MANNING note,
  which is the same shape of thing and is still shown -- he did not ask for that one to go.
- **`feat/customer-demands` merged on his all-clear** (*"Nice. Let's call it done, merge it, and
  delete it."*), pinned to `0476f882`; branch, worktree and port 8088 all retired. It carries
  **Offset beside Station in the popup and in the table**, which he had asked for twice: positive is
  to the RIGHT of the pipe looking from its first node toward its second. Keys added:
  `lpn_field_meter_offset`, `lpn_field_meter_offset_tip`.
- **Tasks 692, 686, 626 and 611 closed** -- merged work still sitting open. **689 closed** on the
  tables branch.

### Branches alive

| Branch | Port | State |
|---|---|---|
| `feat/tables-spreadsheet` | 8096 | **BUILT, green on the merge result, AWAITING HIS TEST** |
| `feat/xy-world-map` | 8094 | **caught up with master; the dial clamp and the satellite ruling built.** See the two-step-twos block |
| `feat/label-gang-search` | 8090 | **the classification measurement is built and committed.** No placement change; the choice is his |
| `feat/customer-find-labels` | new | agent running: his customer items, spec REVISED twice -- see below |
| `feat/engine-fetch-wait` | new | agent running: Task 608, the authorized half only |
| `feat/lock-initials-later` | 8095 | needs Task 698; **170 behind master**, and it is what dev.hawsedc.com was sitting on |
| `ida/esc-and-lock-identity` | -- | 1 ahead, untouched this session |
| `tables-interface` | -- | stale, nobody has claimed it |

**`feat/tables-spreadsheet` IS NOT IN `protected` AND SHOULD BE** -- it is a feature umbrella
(spreadsheet editing), and the policy's own rule is that a feature branch joins that list when it is
MADE, not when somebody remembers.

### What is waiting on Tom

- **`feat/tables-spreadsheet`, port 8096.** Ctrl+Z inside a table: **native text undo while a cell
  editor is open (F2, double-click, or a printable character), project undo when it is not**;
  checkboxes and selects always take the project undo. Undo now refreshes the pane, for Task 611's
  reason. **A shipped defect was found while building it**: `var paneTablesCache = null;` sat BELOW
  the block that filled it, so hoisting re-ran it at load and the page held **two sets of six table
  specs** -- the tab strip sorted and displayed one, everything reaching a table by id got the
  other, whose sort was permanently the default, and the Print button reads the second. **Printed
  tables came out in id order however he had sorted the screen.** Fixed here.
- **Task 690's parity check reports 28 gaps, ADVISORY.** One flag makes it a ratchet the day the
  count reaches zero. **Whether the PUMP rows should be columns at all is his call and not a
  defect**: that table's own comment says a pump is a reading rather than an editor, and yet a speed
  and an energy price are scalars. Nothing mechanical can settle it.
- **Task 247 is NOT closed, deliberately.** He cleared the BRANCH, not the task. Its block says
  slices 1-3 are in and *"what is left is his call"*: the label density rule, a customer in Find,
  Slice 4.
- **`feat/xy-world-map` -- the dial defect is FIXED and it was real.** The dial is a 306 px control
  centred on the canvas, and **with the bottom pane open the canvas is not tall enough**: at
  1366x768 with a 300 px pane it slid under the form; at 1280x700 with a 340 px pane the TURN KNOB
  sat behind the toolbar and could not be pressed. **That is the same defect the rectangle's rotate
  handle already had -- the defect the dial was built to escape.** `mapgeoPlaceDial()` now fits
  itself to the canvas rect and shrinks the bar to a 56 px floor rather than sliding out, re-placed
  from `applyMapHeight()`. `dev/lpn-spike/mapgeo-browser-drive.js` drives real Chrome across five
  layouts and fails before the fix.
  - **THE SATELLITE RULING, recorded in the source:** a georeferenced XY project IS locatable **for
    the basemap rows only** (street, satellite, corner teaser, via `basemapChoosable()`); **Go to,
    place-name search and Read DEM stay on the narrow `isLatLonProject()` question**, because each
    needs more than a transform and a row that does nothing is the defect Task 692 closed.
  - **Two judgements, neither acted on:** the dial lands on the right edge overlapping the labels
    legend and is the only wizard control not in the step bar where the reader's eyes already are;
    and **the rectangle's rotate handle is UNREACHABLE at a fitted zoom** (measured twice --
    `elementFromPoint` returns the step bar), so a dead handle is probably worse than none.
- **His three original reports on `feat/xy-world-map`**, for the record: no slider/dial, step 2 still rotates the
  project, satellite refused. **The satellite one is traced**: that branch is 47 commits behind
  master and contains NEITHER half of the Task 692 fix (`ca25f1da`, `19ab3155`). The Mapbox token is
  present, 89 chars, so an absent token is ruled out. **And the branch creates a FOURTH case of Task
  692** -- a plain XY project WITH a world map attached is not lat/lon and is nevertheless locatable
  -- which master's fix cannot know about, because that project kind did not exist when it was
  written.
- **His two new customer items, 2026-09-18: (1) "Add Customer to Find."** and **(2)** labels, *if* we
  label at all -- two fixed positions aligned with the service line, one justified against the link
  and one against the customer dot and beyond it from the link's perspective, **both failing a
  conflict check means the label is dropped**, styled as a link flow label, and *"maybe we have a
  setting for the widest view that attempts to display it."* Revised minutes later: ***"I guess
  **if** we label, we should allow more than just Q."*** The **if** is his own emphasis and is
  load-bearing -- he has not decided that customers should be labelled at all, so the first
  deliverable is what customer labelling IS today and whether anybody ever decided it, and the
  "never" setting must stay one line away.
- **Ida owes an answer**: where does **Revert** live by interface convention? He pushed back twice on
  the position it was given and asked for the convention, not an opinion.
- **Task 698** -- keep initials per browser, name the holder, and say *"We have you listed as ABC.
  If that's wrong, you can change it."*

### One loose end

`git stash list` holds **`stash@{0}` -- "prev run: station column + general table audit + parity
check"**, made on the now-deleted `feat/customer-demands`. Station was rewritten fresh and nothing
else from it landed; the twenty-one-column sweep inside it is the same ground Task 690's derived
check now covers. **It is not needed, but it is the only copy of that attempt outside a perishable
scratchpad.** Drop it deliberately or keep it deliberately -- do not leave it by accident.

---

## What to hand Tom in the same breath as any panel change

```
sudo cp ~/webdev/worktrees/_panel/branch-preview.conf /etc/apache2/sites-available/
sudo apache2ctl configtest && sudo systemctl reload apache2
```
