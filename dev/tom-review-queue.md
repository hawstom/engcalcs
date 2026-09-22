# Tom's review queue

**EVERY LINE HERE IS SOMETHING TOM TYPED AFTER A BROWSER PASS, AND IT STAYS UNTIL IT IS CLEARED.**
His instruction, 2026-09-19: *"Always ensure that my review comments are not lost until they are
cleared/addressed. These reviews, while they are enjoyable, nay, even fun, cost me a lot of time and
focus."*

A browser pass is the one thing in this project nothing can automate and nobody else can do. It is
also the input most easily lost: it arrives as prose in one message, gets partly acted on by one
session, and the remainder lives only in that session's context. Three of his items had already been
answered by a session that then dropped the rest. **This file is where they live instead.**

## Format

```
- [x] R-042 branch/name | his words, verbatim or near -- Task 699 added at priority 75
```

- `[ ]` OPEN -- nobody has acted on it.
- `[x]` DONE -- shipped. Append `-- <sha or branch>` so the change is findable.
- `[?]` ANSWERED-BACK -- it needs something from Tom before anybody can act. Append the question.
- `[-]` DECLINED -- with the reason, in one line. **Only Tom declines his own item**; an AI writing
  this marker without his word is the failure this file exists to stop.

**Quote him. Do not paraphrase into our vocabulary** -- the handoff's own trap list says so, and a
paraphrase is how "put station and offset in Find" becomes "improve Find". `review_queue_check.php`
reads this file, prints every OPEN row, and fails only on a malformed one; deciding an item is
judgement and does not belong to a script.

**An ID is permanent and never reused.** Next free: R-126.

---

## Round of 2026-09-19 -- his second pass over the five branches

### Workflow and standing answers

- [ ] R-004 -- | "A name given once for one purpose becomes a standing per-browser label": Confirmed. And we are adding "Not you? Change this" opportunities. -- Task 698 ruled; his answer to handoff decision 9
  - TGH testing 2026-09-18 22:01 UTC · 37f05c7e: (1) The banner message about "We asked your colleague to close the file" disappeared too fast and unrecoverable "Help! What did I miss!" We need a better messaging system. We talked about the QGIS system. Maybe open a feature branch for Error and notice messaging system.

### feat/customer-find-labels

- [x] R-011 feat/customer-find-labels | Reword this alert: "The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation." -- feat/customer-find-labels 4f15643b -- HIS EXACT WORDS, which carry no glyph, so the caution mark came off with the old sentence. One edit to restore it if he wants it
  - Restore the glyph.
  - DONE f299377c: the value leads with the caution glyph again and carries no marker word, which is the convention. `customer-harness.js` asserts the INVARIANT -- one glyph, leading, with text after it -- rather than pinning his sentence as a literal
- [x] R-013 feat/customer-find-labels | Widest view: Add a "Use current view" button like the other one we restored in a different branch. -- feat/customer-find-labels 4f15643b -- same words, same key, same behaviour as the one on feat/label-gang-search, rounding the width UP
  - I can't find this in this branch.
  - 2026-09-21: "'Use current view' button of 'Widest view that attempts to display customer labels' uses height (I think), not width. Then it's applied as advertised, to width. So it appears not to work."
  - DONE: the button was there and he is right about both halves. It captured `mapSpan('min')`, which on a landscape window is the HEIGHT (1,000 ft on a 2,000 ft view), and in WORLD units, which on a geographic project are DEGREES (0.005 against the 2,880 ft the box is read as). It now captures the same quantity the gate compares against. `dev/lpn-spike/customer-view-capture-harness.js`

### feat/xy-world-map

- [x] R-019 feat/xy-world-map | Mapbox satellite is connected and working, a little. I am getting huge hesitance to load tiles I need. I see tiles around the edges of my map. Zooming in and out coaxes the tiles slowly to load, but it's a slow and uncertain slog. Frustratingly, it's the area I care about most that disappears when I zoom in, while peripheral tiles keep showing. Can you please debug this? How can we get what we need from Mapbox? -- feat/xy-world-map 4505b5db -- MEASURED: tiles were requested from the WEST EDGE across, so the middle of the screen sat about 35th in a queue of up to 192; and every wheel nudge deleted the whole picture and restarted the queue from that same corner. Centre-out now, and the old picture stays up underneath -- **CLOSED BY HIM 2026-09-21: *"?debug=tiles: I think we are good now."*** Five measured causes in all, and the readout is on master
  - TGH 2026-09-19 23:55 UTC · 731ab367: Still missing some tiles. Usable, but frustrating. Not good for my reputation. I pasted an image in chat.
  - INSTRUMENT, not a fifth guess: add `?debug=tiles` to the page URL and a panel in the lower right says, for the view on screen, how many tiles were wanted, came from the cache, were requested, arrived, were drawn, failed, were retried and are still outstanding -- and names every failure with the answer the network gave. Please read it off the screen where you see the white squares and tell us the numbers.

### feat/tables-spreadsheet

- [x] R-032 feat/tables-spreadsheet | I think that there is a fourth mode: Navigation, the part of what I called Entry when no characters are being typed. Check the literature. I will refer to this, but set me straight so we aren't inventing things we shouldn't invent. -- ANSWERED: your fourth mode is real. Excel calls it Ready; W3C calls it navigation mode. dev/tables-spreadsheet-modes.md. His call: rename our Select mode to Ready -- ANSWERED BY HIM: *"There is another mode, and it is Select. So there are four modes. Call them what you want: Ready/Navigate, Enter/Entry, Edit, Select."* See R-063
- [x] R-035 feat/tables-spreadsheet | When I type into any cell after any Undo and press Enter, Tab, or Arrow, my entry is reverted, which is bad. -- **SHIPPED**, feat/tables-spreadsheet `23a57157`. An Undo makes a fresh copy of the network and every cell on screen still pointed at the discarded one. **He confirmed it 2026-09-21: *"Successful: Entry is fast and undo works."***
- [x] R-037 feat/tables-spreadsheet | Right-clicking anywhere in a selection should not perturb the selection. But I see it changing the selection to the right-clicked cell. -- feat/tables-spreadsheet f688970a
- [x] R-038 feat/tables-spreadsheet | A selection should highlight cells, not characters. But I see characters highlighting as in Entry mode when selecting by mouse. -- feat/tables-spreadsheet f688970a -- **SHIPPED**, feat/tables-spreadsheet `4fc86c07` + `4cfbd343` + `03ffb466`. Three commits because the first fix OVERREACHED -- it blocked the browser press on every cell including the one being typed in, so the mouse could no longer place the caret. Perry found that; it is repaired and mutation-tested four ways. He did not re-report it on his 2026-09-21 pass
  - TGH: Still manifesting 2026-09-20 00:39 UTC · abf10dc1

### Defects found while reviewing


### Standing work he named

- [ ] R-043 -- | I still need to test (and admire) label placement, solver bar, etc.
- [x] R-044 -- | The label work is a debugging job he has forbidden papering over, and "let labels look further" is ranked third, behind the switchboard and the sector question. -- carried from the previous session; the three handoff decisions remain his

### Raised by the work, and his to decide

- [x] R-045 feat/xy-world-map | The world-zoom basemap IS mirrored and the cause is measured: at world zoom the easternmost tile touches the 180th meridian, and the arithmetic wraps its right-hand edge round to -180, so one tile is stretched backwards across the whole screen on top of everything else. Its placement width computes as -1,750 where it should be +250. It predates this branch. The fix is small and lives in `js/lpn-georef.js`; it was reported rather than built because he asked for a look, not a build -- HIS RULING: *"Sorry. I will have to trust you. Hopefully it is done right so that it does not manifest later. If you really want me to see it, hold my hand and take me there."* So it is OURS TO BUILD, and it must come with a regression check so it cannot come back unseen. See R-066

### On master -- the recalculate-off fix overreached

- [x] R-046 fix/recalc-trust-user | **ALL THREE OF HIS NOTES ARE SHIPPED, on master at `2d718fd4` (`fix/stale-is-a-snapshot`), and he has not pulled it yet.** An edit now rewrites only its OWN label and moves only that one label; Tables hears Properties, a direction that was simply missing; every stale result stays put in Tables, Properties, the status bar and the run report; and the fire flow rings survive an edit and gained the Clear button he asked for (`lpn_ff_clear`). Recalc off Old values: Leave in place stale. Don't clear. Trust the user. -- fix/recalc-trust-user 313a8656 -- stale numbers stay exactly where they are, and the page says nothing about them. Key `lpn_manual_results_cleared` DELETED
  - Any input we edit must be reflected wherever it shows, Table, Properties, and map labels. We can make an exception to label placement passes for this label update, and we can have tunnel vision on only the label we change.
  - Tables and Properties—*everything*—should show the stale results while user continues to work. Keep on showing and let user decide when to recalculate. Off means Off, but it doesn't mean Hide or Delete. It means Snapshot in time.
  - CC asked TGH: "Fire flow rings still clear themselves on edit and still say so. That predates today and has its own sentence in 27 languages. It left it alone rather than quietly extend your ruling. Want it to follow "leave it stale" too?" TGH: Yes. The reason I am saying Yes to everything is that if we clear these things prematurely, it robs the user of an important point of reference. It's important to leave some value in the model when we have it. That said, for fire flow rings, we could provide a button in that box to clear the rings.

### Process

- [x] R-048 -- | Reviewer: I didn't have in mind a review assistant. I had in mind a pre-reviewer, but I guess you already do the best you can with that. I just want independent review, not self-review, of all work before I see it. This could save me review time. But if you have a vision for a review assistant, that could be helpful too. -- SEAT HIRED: `.claude/agents/pre-reviewer.md`. It reviews work it did not write, on every branch, before he is told the branch is ready, and it REPORTS rather than fixes. **It needs a name from him.**
  - TGH: Perry the pre-reviewer.

### feat/customer-find-labels

- [x] R-051 feat/customer-find-labels | The labels are hiding the service line. They need to be moved away about 1px or 2px or their halo needs to be that much smaller. -- feat/customer-find-labels ffd11548 -- the LABEL moved, not the halo, because the halo style is shared by every label on the page. Clearance was EXACTLY ZERO and is now about 1.4 px. CONFIRMED by the pre-reviewer, mutation-tested independently
  - (1) The labels are not taking into account the width of the service line. So at close zoom, they are on the service line. (2) The service line is fixed map width. It should be a lesser multiple of the link width or always just 1 px until we get to the zoom where everything stops growing (see 2026-09-21 request about new zoom rules), at which point it shrinks below 1px. 
  - DONE 64344765: (1) the label's clearance now adds the service line's own half drawn width at the current zoom, so it is not a constant. (2) the line is `max(0.5 x link width, 1 px)` on SCREEN at every zoom -- his floor, capped so a service is never as heavy as the main it hangs off -- at a 1 px pipe a 1 px floor drew them equal, and the Settings box accepted a typed 0.5 against its own declared minimum, which drew the service THICKER. Both fixed. The third clause, shrinking BELOW a pixel, waits on Task 705 and is his to discuss. `dev/lpn-spike/customer-view-capture-harness.js` section 4
- [x] R-053 feat/customer-find-labels | Like most of the label placement, I see a mystery. I see a row of labels along the service lines with a few beyond the meter. I see that these would conflict with a link label, but if so, maybe we should calculate the standard location for all to accomodate a link label. -- **YOU WERE RIGHT AND THE BRANCH SAID YOU WERE WRONG.** A first answer concluded the blocker is never a link label; the pre-reviewer found its test drawing put customers at round numbers while a long pipe REPEATS its label at two other points, so the case was never tested. One customer placed at a repeat point: `DROPPED -- first blocked by label of L1`. **A link label does block, and when it does the customer label disappears entirely rather than moving.** Back with the build agent
  - TGH: 2026-09-19 Still need to "calculate the standard location for all to accomodate a link label" as above so nothing has to dodge a link label.
  - DONE a84da469: position 1 reserves the room a link label could occupy IN ADVANCE, whether or not one falls at that station, so no customer label dodges one. `customer-label-cause-harness.js` stands its customers ON the repeat stations, which the first fixture never did: 0 of 28 dropped, 0 of 6 blockers a link label. The ordinary-street drop rate is now **0.0% to 1.6% per side, median 0.8%, pooled 0.8% of 2,500 services across ten seeds** -- reported as a RANGE because one seed of it is not the rate; an earlier note here quoted a single draw. The two sides are the same now, which is itself the result: the pipe-label side used to be the worse one

### feat/xy-world-map

- [x] R-056 feat/xy-world-map | There are still a few blank tiles that never fill in when I stop zooming. It's as if we decided not to draw these tiles. -- feat/xy-world-map 448533f6 -- MEASURED: the wheel is NOT the cause; four burst gestures at four speeds produced zero blanks. **A tile whose request FAILED was never asked for again.** With 33 of 105 knocked out and a perfect network restored, all 33 were still blank after 30 seconds and 18.8% of the map was white; only a gesture needing different tiles ever repaired it. His own phrase was the lead: "as if we decided not to draw these tiles" -- we did. Three retries now, widening, then stop. 100% filled after fifteen seconds with no gesture -- **CLOSED BY HIM 2026-09-21 together with R-019: *"I think we are good now."***
  - This is still happening 2026-09-19. See 2026-09-21 chat.

### feat/tables-spreadsheet


## Round of 2026-09-19, fourth pass

### feat/tables-spreadsheet

- [x] R-065 feat/tables-spreadsheet | There is still an unbelievable delay when speed-entering a column. It's not huge. It's small. But it's unbelievable because nothing else should be happening. There's no recalculation, no reformatting, etc. And this worries me very deeply because it is a sign of pervasive bad coding. -- **CLOSED.** His own follow-up: *"This is getting better. It is fast enough for me now. But is it fast enough for Declan?"* Declan answered YES with numbers (R-080). What he found on the way is Task 706, now built and closed
  - TGH: This is getting better. It's fast enough for me now. But is it fast enough for Declan?

### The one that is bigger than a branch

- [?] R-062 -- | I want your advice about how I can spend some significant resources to do a deep code review to ensure we don't have a code base full of AI techno-slop.
  - **ADVICE, 2026-09-21, and it is a plan rather than a product recommendation.** The tool already exists and **only you can start it**: `/code-review ultra` launches a multi-agent cloud review of the current branch, or `/code-review ultra <PR#>` for a GitHub pull request. It is billed. No AI here can launch it, and none should pretend to.
  - **DO NOT POINT IT AT THE WHOLE TREE.** `js/looped-network.js` alone is tens of thousands of lines; a review of everything at once returns a list nobody acts on, and an unactioned list is worse than no review because it reads as a clean bill of health afterwards. **One area per run, on a branch, with the findings worked before the next run.**
  - **THE ORDER I WOULD SPEND IT IN, highest value first, with the reason:**
    1. **`js/looped-network.js`'s write seams** -- `setProp()`, `afterPropertyEdit()`, `updateNode()`, the save path. Every expensive defect this project has had lived at a seam two callers disagreed about, and the free tier cannot see design.
    2. **The unit and conversion boundary** -- `js/Calculators.lib.js`'s three seams and `EngCalcs.unitFactor()`. Silent, wrong by a factor, and only for half the world.
    3. **The solver and the EPANET bridge** -- `lpn-solver.js`, `lpn-epanet.js`. Numerically checked against EPANET already, so what a review buys here is structure rather than correctness. Lowest of the three.
  - **AND THE CHEAPER THING FIRST, because it costs nothing and would change what the paid review finds:** the 41 rules in `CLAUDE.md` that no check holds (`dev/enforceable-rules-survey.md`, 75 enforced, 4 holdable, 41 permanently prose). Every rule that became a script stopped being violated. A paid review that finds violations of rules a script could have held is money spent on a problem with a free fix.
  - **What it will NOT tell you:** whether the FEATURE is finished. That is still only you. Perry covers the middle ground for free, on every branch, and has earned it five rounds running.

### feat/xy-world-map

  - I would like you to try to show this problem to me unless it has been fixed. If it has been fixed, please delete this.

## Round of 2026-09-21 -- after two days of his own testing

- [x] R-070 -- | Site check: why am I getting this? I thought I was getting only an email at 8:00 every day. -- **ANSWERED, and the failure is spurious.** Two different cron jobs. The 8:00 one is the DAILY REPORT (22:00 CDT on the server, which is 20:00 in Phoenix). The 2:22 AM one is the PAGE CHECK (04:20 CDT = 02:20 Phoenix), and **it mails only when something is wrong** -- so receiving it at all means a failure. The failure is `https://librewaternet.org/tools/build-chrome.php HTTP 403`, and **403 is the correct and desired state**: that directory is the remote-execution exposure closed on 2026-09-18. **The server's copies of the check config are STALE.** This repository excludes the whole `/tools/` directory and asserts it unreachable in `check.mustblock`; the server's `~/check.exclude` names only `build-features.php` and its `~/check.mustblock` names neither. `host_script_parity_check.php` reports both as DIFFERS. One command from him fixes it
- [x] R-071 -- | About: add the fact that HawsEDC Engineering Calculators have been offered freely online since 2010 (established via the Internet Archive Wayback Machine). -- the Mission paragraph now opens *"HawsEDC Engineering Calculators have been online since 2010."*
- [x] R-072 -- | About: revise to "The website that serves it is offered freely today and since 2010; if one day it cannot be, the software is still yours to run." -- his exact sentence, in place
- [x] R-073 -- | Reviewer's name: "Perry the pre-reviewer." -- `.claude/agents/pre-reviewer.md` and the roster
- [x] R-074 -- | Roadmap: eleven closed or deleted, twenty moved, his notes on 696, 653 and the water tower added, three new tasks opened (703 satellite tiles, 704 messaging, 705 zoom rules)
- [ ] R-075 feat/label-gang-search | I am never going to be happy until I can add 12345678 to the node ID prefix without moving or hiding any of the labels shown. Any such moving or hiding is a blatant bug since adding that string **however** causes no conflicts with anything all the way to Japan. May as well not dodge it, hide it, or paper over it. Find out why it's happening and fix the bad rules.
- [ ] R-076 feat/label-gang-search | Switching to the all-round search halves the vanished labels: yes, but at what performance cost? My hope is to move as much as possible of our calculation burden to a pre-calculated model that applies across zooms, so nodes have a lookup table for where they can expect an optimal place for their label at a range of zooms.
- [ ] R-077 feat/label-gang-search | The four corner positions: I assume they are relatively cheap, and that we can record the zoom at which they are no longer effective (and clear that when Symbology or Appearance is changed?).
- [ ] R-078 feat/label-gang-search | Based on the switchboard, I guess spot route is not yet programmed since it doesn't do anything. I can't get anything to work except the checkboxes; from those it looks like corners and ring combined are producing nice results.
- [ ] R-079 feat/label-gang-search | "Publishing those gaps as a ranked list instead of a single winner is a change where it's consumed, not a new model." Do that? Or we already did?
- [x] R-080 -- | Is it fast enough for Declan? -- **HIS ANSWER IS YES.** About 10 ms of work behind one committed cell on a 400-element network, against the fastest pace a person can sustain (a quarter to a third of a second a row) -- 3 to 4% overhead, which does not register. **And the cost is PER CELL COMMIT, never per keystroke**: nothing fires while you type. He also refused to let a performance win read as the bigger story -- his top item is still Task 610, paste that CREATES rows, *"because the network has to exist first"*. What he found on the way is Task 706
- [x] R-081 -- | WaterModels.jl: what is it and what can we do with it? -- **MARY'S ANSWER IS "NOTHING", CLEANLY.** It is **not a file format**: it is a Julia package from Los Alamos, DOE-funded, doing OPTIMIZATION on water networks (best pump schedule, best pipe design under a budget) rather than simulation. It READS EPANET `.inp`, which we already read and write byte-identically, so it unlocks nothing there; its own JSON is a private wire format for a math solver and **nothing outside its own sibling packages reads it**. Modified BSD, LANL-ANSI, 77 stars, last push April 2025, research-paced. **No utility adoption found anywhere** -- every result naming it was itself a national-lab paper. Not an importer, not a dependency, not a citation on `dev/positioning.md`, which is for tools our users actually choose between. The one idea she kept, as speculation only, is its named *candidate, not-yet-built pipe* state, which `lpn_` has no equivalent of
- [x] R-082 feat/tables-spreadsheet | **PERRY FOUND A CRASH, not Tom.** Open a node's Properties, then rename that same node in the table below it: the page throws. The table's rename calls the same FUNCTION as Properties but not the same DOOR -- Properties updates the popup's own id before refreshing, the table does not, so the popup re-renders by an id that no longer exists. Back with the build agent -- **SHIPPED**, feat/tables-spreadsheet `10f1277e`, with the exact steps asserted in `pane-review-harness.js`
- [x] R-083 feat/tables-spreadsheet | **PERRY FOUND A SECOND ONE.** Delete on a selection that includes the ID column fires one blocking dialog PER ROW -- three rows, three dialogs; dozens of rows, dozens of dialogs before the page is usable. No data is lost. Back with the build agent -- **SHIPPED**, feat/tables-spreadsheet `10f1277e`. One question for the whole selection

## Round of 2026-09-21b -- his list after the branch previews

### Production and the host

- [x] R-084 -- | "Note that the command you gave me is invalid. Please ssh into production, clean up (git status is dirty), and do what you need to do for this `cd ~/webdev/hawsedc.com/engcalcs && sh dev/host/install.sh`" -- **HE WAS RIGHT AND THE COMMAND COULD NOT HAVE WORKED.** `~/webdev/...` is a path on HIS machine and does not exist on the server; and `install.sh` did not copy `check.mustblock` at all, which is the file the R-070 fix lives in. Both fixed: the installer now installs it, and it was run on the host out of `~/tgh/engcalcs-report` (the report checkout, which is the one allowed to pull -- production may never fetch). `~/check.exclude` and `~/check.mustblock` were both stale and are now current; `sh ~/check.sh` exits 0 and silent. **Neither production checkout was dirty:** `~/addon_html/hawsedc.com/engcalcs` is clean on master at 2751faba and `~/dev_html/hawsedc.com/engcalcs` is clean on feat/lock-initials-later at 37f05c7e

### feat/tables-spreadsheet -- his fourth round

- [x] R-085 feat/tables-spreadsheet | Left and right arrows get stuck at selectors **unless** I first skip over them with Ctrl; interesting. -- **SHIPPED**, feat/tables-spreadsheet. The cursor lands on the pull-down itself now rather than the cell around it, which nothing had made able to hold focus, so it fell off the table entirely. Ctrl escaped it because Ctrl+arrow runs straight through
- [x] R-086 feat/tables-spreadsheet | (a) We have a gratuitous space waster at ID where the goto map icon (nice unsolicited touch!) is a line break below the ID number. Put on same line, and possibly in a separate column (exreme left or transcendent left of the table) to keep the paradigm pure. (b) But I should point out that the right-click menu may upstage this feature, and also (c) an interesting possibility that when we right-click on a support column (like From and To) that contains an asset, we can Show on map that asset instead of the row's asset. -- **SHIPPED**, feat/tables-spreadsheet. (a) on one line; (c) built, and it falls back cleanly on a dangling link id or a customer with no link. (b) is his own observation and nothing was built from it: moving the pin to its own leftmost column changes the column model, so that is his call
- [x] R-087 feat/tables-spreadsheet | When I right-click on a cell near the bottom of the screen, the right-click menu goes off the bottom of the screen. Oops. Fix that. -- **SHIPPED**, feat/tables-spreadsheet. It flips above the pointer rather than sliding under it, on both axes, and clamps only when the menu is taller than the window. All four edges asserted
- [x] R-088 feat/tables-spreadsheet | Whole-cell near vs left/top. Spreadsheet software chooses a paradigm for where—near or left/top—to maintain exactly a whole cell when arrowing past the edge of the screen. (a) What we have seems to be a split opinion, with sometimes whole cell at the top and sometimes at the bottom when I am arrowing down; we need to choose and do what we do well; and my vote is whole cell at top. (b) When I arrow down to the bottom of the screen and past the bottom whole visible cell, the next down movement brings exactly a whole cell to the bottom, then the next down movement jumps my cursor to the top of the view, which is disorienting and needs to be fixed. The cursor (active cell) needs to stay near the direction I am moving. This bug doesn't happen when moving up, and it seems that we are closer to the whole-cell-at-top paradigm, for what it's worth. -- **SHIPPED**, feat/tables-spreadsheet. There were two rules, one per direction; there is one now, and the scroll always rests on a row boundary. **He is still seeing a 0 to 3 px variation at the heading, which is his 2026-09-21 item (4) and is back with the build agent**
- [x] R-089 feat/tables-spreadsheet | It might be nice to develop the tab paradigm of the tables list across the top of the bottom pane. Currently, all the non-active tables are undecorated plain text, which doesn't really say "I'm an inactive tab." -- **SHIPPED**, feat/tables-spreadsheet. A hairline, a light ground and two rounded top corners: the least that reads as a card behind the front one, not a raised button, which would read as a second toolbar

### feat/customer-find-labels

- [x] R-090 feat/customer-find-labels | "Use current view" button of "Widest view that attempts to display customer labels" uses height (I think), not width. Then it's applied as advertised, to width. So it appears not to work. -- **SHIPPED**, feat/customer-find-labels `bd620e4f`, merged to master on his all-clear. He was right on both halves: it captured the SMALLER of window width and height, and on a map project wrote raw degrees where the gate reads feet, out by about 576,000x

### The branches he asked about

- [x] R-091 feat/xy-world-map | Why is this branch still present? The task has been closed. Merge, delete, and update? -- **MERGED ON HIS ALL-CLEAR AND DELETED**, master `fe9f2106`; Task 646 closed
- [x] R-092 feat/lock-initials-later | Done except for the messenger system, right? Was anything changed that I should review? Merge, delete, and update so that we can move on to the messenger task? -- **MERGED ON HIS ALL-CLEAR AND DELETED**, master `83ce8391`; Task 698 closed. The one thing he named as not done, the messaging system, is Task 704 on its own branch
- [x] R-093 feat/engine-fetch-wait | Why is this branch still present? Is there something to do? Or merge, delete, and update? -- **MERGED ON HIS ALL-CLEAR AND DELETED**, master `97c27380`; Task 608 was already closed on his word, and the previous handoff had wrongly said this branch was merged, which is why he kept seeing it

### About

- [x] R-094 -- | About, Mission paragraph 1 sentence 1: Revise to "...offered freely online since 2010." -- it now reads *"HawsEDC Engineering Calculators have been offered freely online since 2010."* **A PUBLIC CLAIM, and the string is in drift in 26 languages**
- [x] R-095 -- | About, License paragraph 2: Remove everything but the last sentence. -- the paragraph is now the single sentence *"The website that serves it is offered freely today and since 2010; if one day it cannot be, the software is still yours to run."* Four sentences deleted, including *"There is no paid tier"* and the promise-about-the-software sentence

### Roadmap

- [x] R-096 -- | 610: Promote to 100. -- done, with his reason recorded on the task
- [x] R-097 -- | 706: "I think this would be cheap enough to fix that we should fix it without waiting for measurement... My intuition is that we would always just save the entry at hand and only save the whole project... when there is a pause. See Off Means Off." -- promoted to 100 and his intuition written in as the design. The browser measurement is no longer a gate

### Research

- [x] R-098 -- | Messaging / Messenger: I think I agree with Ida. Proceed. -- Task 704 is being built
- [x] R-099 -- | WaterModels.jl: Mary's report accepted.
- [x] R-100 -- | Perry's crashes: Grateful. Nice.

### Placement -- his three questions, which are questions and not builds

- [x] R-101 feat/label-gang-search | Given your explanation, how do all those labels get stacked when narrow? What is it about being single and narrow that uniquely makes/lets them stack neatly and endlessly? -- **ANSWERED, AND HE RULED ON THE ANSWER 2026-09-21: *"Clearly this is a bug."*** See R-108
  - **ANSWERED 2026-09-21, and the answer is one sentence: the SPOTS do not move, the BOXES grow into each other.** Measured, not argued: the candidate set is identical at both widths on all 97 labels, so where a label may be offered a place never reads its text. Those spots sit at a fixed geometric spacing around the node -- its own gaps between its pipes, plus a resting offset -- and that spacing knows nothing about how long the string is. **So two labels at neighbouring spots collide exactly when their two half-widths together exceed the spacing between the spots.** Narrow: the spacing wins, every spot stays usable, and they stack as far as you like -- that is the "endlessly" you are seeing, and it is not a special talent of narrow labels, it is the ordinary case. Wide: the box wins, so taking one spot POISONS its neighbours, one label knocks out several, and the next label has to go somewhere else -- which is the 41-of-60 cascade. **It is not that a wide label fails to fit a gap; it is that a wide label occupies spots it is not standing on.**
  - **What would settle it beyond argument, and it is cheap:** a histogram of spot spacing against box width on your own drawing. Say the word and it gets measured rather than reasoned.
- [x] R-102 feat/label-gang-search | "Nineteen real collisions shove fifty-one labels": You say nineteen real collisions. But if there were dozens neatly stacked while short-stringed (ID alone), then there are zero real collisions. This is the mystery I will not let rest. You say nineteen while I say zero. -- **ANSWERED, AND HE WAS RIGHT.** Nineteen counted labels that TOUCHED a node symbol; zero is the count that HAD to move, and his is the question that decides what gets built
  - **ANSWERED 2026-09-21: YOU AND THE NUMBER ARE ANSWERING TWO DIFFERENT QUESTIONS, AND YOURS IS THE ONE THAT MATTERS.** Nineteen is the count of labels whose grown edge OVERLAPPED a node symbol on the side it grew towards -- 0.07 to 1.11 label-heights deep, a drawn circle, a real object. That fact is right and "zero" is wrong as stated. **But touching something is not a reason to move.** A label only has to move if, having touched something, the search cannot find it another place -- and the other measurement says the search gives up after 28 spots inside one gap while 36 of 97 had room just outside it. **So the number of labels that HAD TO move is zero, which is your answer, and it is the one that decides what gets built.** Nineteen is a weaker fact wearing a stronger word, and calling them "real collisions" made it sound like a justification. It was not one. You have now asked this three times; the rule here is that a repeated question means the rule is the suspect, and it was.
- [x] R-103 feat/label-gang-search | The fix is built: OK. But I don't understand why we are spending effort on the rings model instead of giving the spot-prime box model a good college try. -- **ANSWERED, and the answer cost something to admit:** only step 4 of his four-step sketch was ever built, and nobody ever reported back on the one part he flagged himself. Task 539 carries it; the work is R-108
  - **ANSWERED 2026-09-21, and the honest answer is that nobody gave it one.** `dev/label-placement-algorithms.md` §9d records the reason and it is not a good one: of your four steps, step 4 -- ordering a stack by the angle of the node each label belongs to -- was built and shipped as the gang route. Steps 1 to 3, finding the prime open ground and sizing `box_est` in it, were NOT, because the file says *"Not settled, and his own flag: how `spot_prime` is found. Report back before building it"* -- and nobody ever reported back. You had written *"I waved my wand over finding spot-prime; if it's hard, let me know."* **You were never told either way.** The rings work got the effort because it was reachable, which is a reason about us and not about the two models.
  - **AND THE RAW MATERIAL IS ALREADY THERE, which is R-079's answer too:** the node's table of every gap between its pipes is already computed and already survives a zoom, and the code then throws all but the biggest away. Publishing it as a RANKED LIST instead of a single winner is a change where it is consumed, not a new model -- **so it is not built yet, and it is the first step of your spot_prime hunt rather than a separate errand.**

### Off means Off

- [?] R-104 -- | If Off means Snapshot, does this help Declan's speed? Is "Save whole project" related to Automatic Recalculate?
  - **ANSWERED 2026-09-21. They are two different clocks, and the honest answer to the second question is NO.** Automatic Recalculate governs the SOLVE. The whole-project save is the STORE, and it runs on every committed cell whether that switch is on or off -- so turning it off buys nothing at all against Task 706. That is exactly why 706 had to be its own fix, and it is being built now to your own intuition: write the one entry at hand immediately, defer the whole-project write to a pause.
  - **But Off-means-Snapshot DID help the speed, by a different route, and that is worth separating.** Before it, one edit recomputed every label on the map and re-ran collision avoidance across the whole drawing. Now an edit rewrites its OWN label and moves only that one. That was the slowness you had been complaining about all week, and it is on master already.
  - **And the two ARE related in design, which is what your "See Off Means Off" was pointing at:** do the cheap local thing now, do the expensive whole-model thing at a pause. Same rule, two places.

### Misc, from his own browser passes

- [x] R-105 -- | **SHIPPED on master (`faf7216b` + `a10e5894`).** A step now reads `24:00 - 25:00` and keeps climbing past a day; nothing wraps, however many days the run covers. **The clock reading did not vanish, it moved into the row's tip** -- the old label was `elapsed  ·  clock`, two readings of ONE instant, which you read as a range and were right to. | The time step selector on the toolbar (need the transport) lists time ranges. Starting at 24:00, the step end time is normalized back to clock time instead of staying at run time. So we get 24:00 - 0:00. Fix it to say 24:00 - 25:00, and fix all subsequent steps.
- [x] R-106 -- | **SHIPPED on master (`faf7216b`), all nine, for a NEW project only** -- a saved project that had customized its own suffix or decimal keeps exactly what it had. | Initial values: Settings.Symbology.Node.Source share.After = '%' and Decimal = 0; Water age.After = ' hr'; Initial quality.After = ' mg/L'; Concentration.After = ' mg/L'; Average source share.After = '%' and Decimal = 0; Link.Average water age.After = ' hr'; Node.Average concentration.After = ' mg/L'
- [x] R-107 -- | **SHIPPED on master (`faf7216b`).** It is a row in a pipe's Properties just after Head loss gradient, and a column in the Pipes table, both reading the same number Settings > Symbology > Link already reads. | Reaction rate does not appear in Properties or Tables. I see it only in Settings.Symbology.Link.

## Round of 2026-09-21c -- his pass over the reloaded preview panel

### Placement -- the ruling that reframes the whole label job

- [ ] R-108 feat/label-gang-search | (on being told "The spots don't move; the boxes grow into each other" / "Two labels at neighbouring spots collide exactly when their half-widths together exceed the spacing between spots" / "Narrow: spacing wins, every spot stays usable. Wide: the box wins, so a wide label occupies spots it is not standing on") **"Clearly this is a bug. But you say it without batting an eyelash. If you don't understand why it's a bug, ask me. If you do, fix it. I'm just grateful that magically this endless stack happened so that I know it's possible; We just have to find out how it's possible and empower that."** -- HE IS RIGHT AND THE EXPLANATION WAS BEING OFFERED AS A DEFENCE. A placement lattice whose spacing is blind to the size of the thing being placed is a defect, not a constraint, and the narrow case working is the existence proof that a correct layout is available on that drawing. Two halves, both with the build agent: find out how the endless stack is possible and write it down, then make the wide case use the same mechanism. His acceptance test is R-075 unchanged

### feat/tables-spreadsheet -- his fifth pass

- [ ] R-109 feat/tables-spreadsheet | The page loads with the current table blank. I have to switch away and back to see that table.
- [ ] R-110 feat/tables-spreadsheet | Sometimes the column widths are unreasonable. For example, Pumps.Date installed, width = 1em; Pumps.Pump head curve, width = 2 em (due to selector?); Pump.Price pattern, width = 3em (due to selector?)
- [ ] R-111 feat/tables-spreadsheet | Switching to Junctions the first time and some subsequent times delayed about 3 seconds or more. This is the worst issue I found.
- [ ] R-112 feat/tables-spreadsheet | There is a slight calculation error that makes the top border of the top cell row not quite coincide with the bottom border of the headings, and vary in that from about 0px to 3px (maybe 2px), as I arrow up or down.
- [ ] R-113 feat/tables-spreadsheet | Switching tables (tabs) leaves the tab selected instead of the currently highlighted cell.
- [x] R-114 feat/tables-spreadsheet | Successful: Entry is fast and undo works. -- **HIS OWN PASS**, and it closes R-035. Nothing to do; it is asserted so it cannot regress
- [ ] R-115 feat/tables-spreadsheet | If right-click "Show on map" is "Select on map" instead of just "Go to" or "Zoom to" (which is what I expected), then we should label it "Zoom & select".

### feat/notice-log -- his four

- [ ] R-116 feat/notice-log | This will need some finesse before it's done.
- [ ] R-117 feat/notice-log | For now, I know that the button/glyph must be where the messages appear, and it must appear and possibly highlight while a message displays. -- **IDA CONFIRMS THIS IS A DEFECT AND NOT A PREFERENCE**: the messages render top-left, on top of the mode line, and the glyph was put in the bottom-left footer strip. She says she should have caught it before he did -- 349e706e moved the glyph but LEFT #lpn_map_notice positioned against the map's own corner, so the notice covered the glyph and its highlight for the whole time a message showed (Perry's review, 2026-09-22, caught by screenshot, not by the harness). Reopened. A second commit moves #lpn_map_notice itself into #lpn_map_overlay_tl_col with `inset-inline-start:0`, and a new browser-pass probe (dev/browser-pass/specs/msglogpos.js) asserts the glyph's box and the notice's box never intersect and stay adjacent, in en and ar at 1280 and 390 -- mutation-tested against the exact original defect
- [ ] R-118 feat/notice-log | Possibly the messages and the glyph need to be coincident with the mode message at the top of the map so that we see something like [his screenshot: one top-of-map strip carrying a circled glyph then "Mode: Select. Click an asset or a label to see..."]. -- **IDA: YES, MERGE THEM, AND IT REMOVES A ROW RATHER THAN ADDING ONE.** But never put the message text and the mode sentence on the SAME LINE: keep them stacked in one top-left column with the notice covering the mode line as it already does, and anchor the glyph at that column's fixed left edge so it survives both states -- 349e706e got the ROW right (glyph fixed left, column stacking mode hint/notice/diagnostic) but the notice inside the column was still positioned against the wrong ancestor, so in RTL (?lang=ar) the glyph sat at the physical right while the notice stayed pinned to the physical left -- disconnected by most of the viewport width, not merely uncovered. Reopened alongside R-117; same fix, same probe (msglogpos.js asserts a small gap between the two boxes, not just non-overlap, specifically because that RTL disconnect does not intersect and would pass a weaker check)
- [ ] R-119 feat/notice-log | The i info glyph doesn't seem quite right to me. Is it what Ida recommended? How about a + expand glyph or a history glyph? Show me something creative. We need to evolve on this. -- **IT WAS NOT HERS AND SHE SAYS IT IS WRONG**: the circled-i already names five other rows on this page (Welcome, Privacy, Terms, About, Reports), every one a reference fact about the software, where this is a personal growing feed. **Her recommendation is a PLAIN CLOCK FACE, no surrounding arrow**, drawn new in `lib/Icons.lib.php` as `history`. She argues AGAINST the circular arrow (already means Revert and Restore on this page, the opposite job), against a bell (imports an unread-and-urgent category this page's two severities do not have), and against his `+` (means "create" everywhere else, and is close to this suite's own `new` glyph) -- 26a68dc3 drew the icon with both hands within about 20 degrees of straight up, which Perry read at real button size as a chevron or checkmark, not a clock (the two strokes fuse into one bent line). Reopened. Redrawn as a right angle -- hour hand straight up, minute hand straight right -- and a static geometry assertion added to dev/lpn-spike/notice-log-harness.js (one hand axis-aligned to vertical, the other to horizontal), mutation-tested against the original shape. Four candidates re-shown in the scratchpad with the corrected clock

### Map menu

- [x] R-120 -- | World map: The menu is context-sensitive. I don't know if that's good. But it is. I found what I was looking for. -- **FOUND IT.** The row is offered only on a plain grid project, which is why it was not on the map he was looking at. **His "I don't know if that's good" is left standing as his own open question about context-sensitive menus generally**, not closed by this row

### The daily mail

- [ ] R-121 -- | The "rank by shopping" table is hard to read. Can you add headings? I don't know what the numbers represent.
- [ ] R-122 -- | I assume that "PAGE LOADS" includes robots. Maybe clarify that "(includes robots)" if so.
- [ ] R-123 -- | Is "PEOPLE" non-robot (long-dwell) visits? Maybe clarify that.

### Production

- [x] R-124 -- | There is a git repository on `~/`. Its git status is dirty. Clean up that one. -- **DONE AND PUSHED**, host commit `9565205`. It is a DIFFERENT repository -- `constructionnotesmanager.com` on Bitbucket, with the home directory as its working tree -- and this session had made it dirty by installing the cron scripts. Committed: the three updated scripts, the two new ones (`check.mustblock`, `daily-report-cron.sh`), and a cPanel reshuffle of `public_html/.htaccess`. Ignored rather than tracked: `tgh*`, which holds the engcalcs mirror clone and the report checkout (separate repositories; tracking one file of them makes two repositories disagree about who owns it) and `daily-report.last`, a runtime marker like `check.last`. The two `.before-install` backups were deleted
- [x] R-125 -- | dev: I will checkout master and pull that one. Thanks. -- his call, nothing owed
