# Session handoff

**READ THIS BEFORE THE ROADMAP.** RULINGS are permanent. TRAPS are permanent and measured here.
STATE is dated and perishable -- delete a STATE line once you have checked it.

---

## STOP -- read before merging anything

- **`feature_freeze.active` in `dev/branch-policy.json` is the second lock.** Tom's all-clear in
  `dev/branch-all-clears.json` (pin field is **`head`**, not `commit`) does not merge a `protected`
  branch while the freeze stands. Only Tom lifts it. It is currently OFF.
- **`master` is `5a9c7fae`, green, PUSHED.** `git log --oneline origin/master..master` is empty.
- **Production is whatever Tom last pulled, and it is not master.** Never say "it is live."
- **`feat/tables-spreadsheet` is built, green on the merge result, and AWAITING HIS TEST** on port
  8096. Nothing else is waiting on an all-clear. See STATE.

---

## THE OPEN QUESTION HE HAS NOW ASKED THREE TIMES: LABEL PLACEMENT AND STRING LENGTH

**HE IS RIGHT AND TWO SESSIONS RUNNING HAVE ANSWERED HIM WRONG.** His claim, 2026-09-18:

> *"Width and height are independent dimensions in an area of unlimited width. No amount of
> additions to the string should affect placements."*

and, of the sentence he was handed back:

> *"If you can't see that the following sentence is nonsense in the context of unlimited width,
> maybe I need to turn up the effort level. 'When labels are close enough to touch, a wider one
> genuinely does not fit in a gap a narrower one fits in, and there's no way around that without
> printing text on top of text.'"*

**THAT SENTENCE IS NONSENSE AND HE IS RIGHT ABOUT WHY.** It conflates a two-dimensional gap with a
one-dimensional one. A box that grows ONLY IN WIDTH can be blocked only by something lying in the
direction it grew. "It does not fit in the gap" smuggles in a BOUNDED gap that was never
demonstrated to exist. It is the symptom restated, wearing an explanation's clothes.

**WHAT IS MEASURED AND NOT IN DISPUTE:**

- **Open ground: his invariant already holds.** 12 junctions and a reservoir, real document, real
  refresh, node ID alone: prefix `1=`, prefix `1234=`, suffix `=1234`, and both at once -- **0 of 13
  labels moved, four times over**, all 13 drawn. `dev/lpn-spike/label-width-stability-harness.js`
  part 3 asserts it through the WHOLE PAGE, which part 1 did not: part 1 drove the placement
  function directly with hand-built specs, so it never answered the claim Tom actually makes, which
  is about typing into the Before box on a drawing.
- **The crowded control moves, so the measurement can still see movement**: the same drawing at a
  quarter of the spacing moves 4 labels at `1=`, 9 at `1234=`, 9 at `=1234`, and at both affixes 2
  are hidden outright.
- Node labels are placed by an **unscored greedy first-fit** (`placeLabelsFirstFit()`). `GOAL_WEIGHT`
  in `js/lpn-collide.js` belongs to the ring scorer and decides nothing here -- an earlier session
  blamed it wrongly. Candidate endpoints come from `defaultLabelOffset()` and a reach floor and
  **neither reads the text**, so candidate ORDER is already width-invariant.

**THE MEASUREMENT THAT IS OWED, AND WHICH WAS RUNNING WHEN THIS WAS WRITTEN:** for every label that
moved in the crowded fixture, **name the specific thing its WIDER box overlapped that its NARROWER
box did not**, then classify each. A real object sitting where the extra characters landed is
physics, and his principle is satisfied by it. **Anything else is a defect and is what he has been
pointing at**: a rejection against a viewport edge or drawing bound (unlimited width is exactly his
case), a quantised raster or grid cell a wider box straddles one more of, a reach or leader rule
keyed on box SIZE rather than on distance, a shed or score reading box AREA or width as a proxy for
cost, a text-side chooser flipping on a width threshold, a candidate pruned by the open-arc table
using the box rather than the direction. **Report it as a count: of the movers, how many hit
something real in the direction of growth, and how many did not.** A non-zero second number is a
CONTAINED fix, and would also make the standing "it is a paradigm change, your call" answer wrong.

**Three contained damping attempts were built and measured previously and all three cost drawn
labels** -- 1,742 / 1,729 / 1,751 against the shipped 1,762 across 28 views of 7 examples. That is
evidence about THOSE THREE attempts, not about the class. Do not cite it as though it settled his
question.

**AND THE REASON HE SAW NO CHANGE WHEN HE TESTED THE BRANCH: NOTHING WAS EVER SHIPPED ON IT.** All
three candidates lost labels, so they were abandoned -- and nobody said so. He spent a browser pass
on a branch with nothing in it and was then told his test was not the problem. **Say "nothing
shipped" out loud the moment it is true.**

---

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
| `feat/xy-world-map` | 8094 | agent running: three of his defects; **47 behind master** |
| `feat/label-gang-search` | 8090 | agent running: the classification measurement above |
| `feat/customer-find-labels` | new | agent running: his two new customer items |
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
- **His three reports on `feat/xy-world-map`**, all open: no slider/dial, step 2 still rotates the
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
