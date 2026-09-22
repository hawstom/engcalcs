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

**An ID is permanent and never reused.** Next free: R-108.

---

## Round of 2026-09-19 -- his second pass over the five branches

### Workflow and standing answers

- [ ] R-004 -- | "A name given once for one purpose becomes a standing per-browser label": Confirmed. And we are adding "Not you? Change this" opportunities. -- Task 698 ruled; his answer to handoff decision 9
  - TGH testing 2026-09-18 22:01 UTC · 37f05c7e: (1) The banner message about "We asked your colleague to close the file" disappeared too fast and unrecoverable "Help! What did I miss!" We need a better messaging system. We talked about the QGIS system. Maybe open a feature branch for Error and notice messaging system.

### feat/customer-find-labels

- [ ] R-011 feat/customer-find-labels | Reword this alert: "The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation." -- feat/customer-find-labels 4f15643b -- HIS EXACT WORDS, which carry no glyph, so the caution mark came off with the old sentence. One edit to restore it if he wants it
  - Restore the glyph.
- [ ] R-013 feat/customer-find-labels | Widest view: Add a "Use current view" button like the other one we restored in a different branch. -- feat/customer-find-labels 4f15643b -- same words, same key, same behaviour as the one on feat/label-gang-search, rounding the width UP
  - I can't find this in this branch.

### feat/xy-world-map

- [ ] R-019 feat/xy-world-map | Mapbox satellite is connected and working, a little. I am getting huge hesitance to load tiles I need. I see tiles around the edges of my map. Zooming in and out coaxes the tiles slowly to load, but it's a slow and uncertain slog. Frustratingly, it's the area I care about most that disappears when I zoom in, while peripheral tiles keep showing. Can you please debug this? How can we get what we need from Mapbox? -- feat/xy-world-map 4505b5db -- MEASURED: tiles were requested from the WEST EDGE across, so the middle of the screen sat about 35th in a queue of up to 192; and every wheel nudge deleted the whole picture and restarted the queue from that same corner. Centre-out now, and the old picture stays up underneath
  - TGH 2026-09-19 23:55 UTC · 731ab367: Still missing some tiles. Usable, but frustrating. Not good for my reputation. I pasted an image in chat.
  - INSTRUMENT, not a fifth guess: add `?debug=tiles` to the page URL and a panel in the lower right says, for the view on screen, how many tiles were wanted, came from the cache, were requested, arrived, were drawn, failed, were retried and are still outstanding -- and names every failure with the answer the network gave. Please read it off the screen where you see the white squares and tell us the numbers.

### feat/tables-spreadsheet

- [x] R-032 feat/tables-spreadsheet | I think that there is a fourth mode: Navigation, the part of what I called Entry when no characters are being typed. Check the literature. I will refer to this, but set me straight so we aren't inventing things we shouldn't invent. -- ANSWERED: your fourth mode is real. Excel calls it Ready; W3C calls it navigation mode. dev/tables-spreadsheet-modes.md. His call: rename our Select mode to Ready -- ANSWERED BY HIM: *"There is another mode, and it is Select. So there are four modes. Call them what you want: Ready/Navigate, Enter/Entry, Edit, Select."* See R-063
- [ ] R-035 feat/tables-spreadsheet | When I type into any cell after any Undo and press Enter, Tab, or Arrow, my entry is reverted, which is bad.
- [x] R-037 feat/tables-spreadsheet | Right-clicking anywhere in a selection should not perturb the selection. But I see it changing the selection to the right-clicked cell. -- feat/tables-spreadsheet f688970a
- [ ] R-038 feat/tables-spreadsheet | A selection should highlight cells, not characters. But I see characters highlighting as in Entry mode when selecting by mouse. -- feat/tables-spreadsheet f688970a
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

- [ ] R-051 feat/customer-find-labels | The labels are hiding the service line. They need to be moved away about 1px or 2px or their halo needs to be that much smaller. -- feat/customer-find-labels ffd11548 -- the LABEL moved, not the halo, because the halo style is shared by every label on the page. Clearance was EXACTLY ZERO and is now about 1.4 px. CONFIRMED by the pre-reviewer, mutation-tested independently
  - (1) The labels are not taking into account the width of the service line. So at close zoom, they are on the service line. (2) The service line is fixed map width. It should be a lesser multiple of the link width or always just 1 px until we get to the zoom where everything stops growing (see 2026-09-21 request about new zoom rules), at which point it shrinks below 1px. 
- [ ] R-053 feat/customer-find-labels | Like most of the label placement, I see a mystery. I see a row of labels along the service lines with a few beyond the meter. I see that these would conflict with a link label, but if so, maybe we should calculate the standard location for all to accomodate a link label. -- **YOU WERE RIGHT AND THE BRANCH SAID YOU WERE WRONG.** A first answer concluded the blocker is never a link label; the pre-reviewer found its test drawing put customers at round numbers while a long pipe REPEATS its label at two other points, so the case was never tested. One customer placed at a repeat point: `DROPPED -- first blocked by label of L1`. **A link label does block, and when it does the customer label disappears entirely rather than moving.** Back with the build agent
  - TGH: 2026-09-19 Still need to "calculate the standard location for all to accomodate a link label" as above so nothing has to dodge a link label.

### feat/xy-world-map

- [ ] R-056 feat/xy-world-map | There are still a few blank tiles that never fill in when I stop zooming. It's as if we decided not to draw these tiles. -- feat/xy-world-map 448533f6 -- MEASURED: the wheel is NOT the cause; four burst gestures at four speeds produced zero blanks. **A tile whose request FAILED was never asked for again.** With 33 of 105 knocked out and a perfect network restored, all 33 were still blank after 30 seconds and 18.8% of the map was white; only a gesture needing different tiles ever repaired it. His own phrase was the lead: "as if we decided not to draw these tiles" -- we did. Three retries now, widening, then stop. 100% filled after fifteen seconds with no gesture
  - This is still happening 2026-09-19. See 2026-09-21 chat.

### feat/tables-spreadsheet


## Round of 2026-09-19, fourth pass

### feat/tables-spreadsheet

- [ ] R-065 feat/tables-spreadsheet | There is still an unbelievable delay when speed-entering a column. It's not huge. It's small. But it's unbelievable because nothing else should be happening. There's no recalculation, no reformatting, etc. And this worries me very deeply because it is a sign of pervasive bad coding.
  - TGH: This is getting better. It's fast enough for me now. But is it fast enough for Declan?

### The one that is bigger than a branch

- [?] R-062 -- | I want your advice about how I can spend some significant resources to do a deep code review to ensure we don't have a code base full of AI techno-slop.

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
- [ ] R-082 feat/tables-spreadsheet | **PERRY FOUND A CRASH, not Tom.** Open a node's Properties, then rename that same node in the table below it: the page throws. The table's rename calls the same FUNCTION as Properties but not the same DOOR -- Properties updates the popup's own id before refreshing, the table does not, so the popup re-renders by an id that no longer exists. Back with the build agent
- [ ] R-083 feat/tables-spreadsheet | **PERRY FOUND A SECOND ONE.** Delete on a selection that includes the ID column fires one blocking dialog PER ROW -- three rows, three dialogs; dozens of rows, dozens of dialogs before the page is usable. No data is lost. Back with the build agent

## Round of 2026-09-21b -- his list after the branch previews

### Production and the host

- [x] R-084 -- | "Note that the command you gave me is invalid. Please ssh into production, clean up (git status is dirty), and do what you need to do for this `cd ~/webdev/hawsedc.com/engcalcs && sh dev/host/install.sh`" -- **HE WAS RIGHT AND THE COMMAND COULD NOT HAVE WORKED.** `~/webdev/...` is a path on HIS machine and does not exist on the server; and `install.sh` did not copy `check.mustblock` at all, which is the file the R-070 fix lives in. Both fixed: the installer now installs it, and it was run on the host out of `~/tgh/engcalcs-report` (the report checkout, which is the one allowed to pull -- production may never fetch). `~/check.exclude` and `~/check.mustblock` were both stale and are now current; `sh ~/check.sh` exits 0 and silent. **Neither production checkout was dirty:** `~/addon_html/hawsedc.com/engcalcs` is clean on master at 2751faba and `~/dev_html/hawsedc.com/engcalcs` is clean on feat/lock-initials-later at 37f05c7e

### feat/tables-spreadsheet -- his fourth round

- [ ] R-085 feat/tables-spreadsheet | Left and right arrows get stuck at selectors **unless** I first skip over them with Ctrl; interesting.
- [ ] R-086 feat/tables-spreadsheet | (a) We have a gratuitous space waster at ID where the goto map icon (nice unsolicited touch!) is a line break below the ID number. Put on same line, and possibly in a separate column (exreme left or transcendent left of the table) to keep the paradigm pure. (b) But I should point out that the right-click menu may upstage this feature, and also (c) an interesting possibility that when we right-click on a support column (like From and To) that contains an asset, we can Show on map that asset instead of the row's asset.
- [ ] R-087 feat/tables-spreadsheet | When I right-click on a cell near the bottom of the screen, the right-click menu goes off the bottom of the screen. Oops. Fix that.
- [ ] R-088 feat/tables-spreadsheet | Whole-cell near vs left/top. Spreadsheet software chooses a paradigm for where—near or left/top—to maintain exactly a whole cell when arrowing past the edge of the screen. (a) What we have seems to be a split opinion, with sometimes whole cell at the top and sometimes at the bottom when I am arrowing down; we need to choose and do what we do well; and my vote is whole cell at top. (b) When I arrow down to the bottom of the screen and past the bottom whole visible cell, the next down movement brings exactly a whole cell to the bottom, then the next down movement jumps my cursor to the top of the view, which is disorienting and needs to be fixed. The cursor (active cell) needs to stay near the direction I am moving. This bug doesn't happen when moving up, and it seems that we are closer to the whole-cell-at-top paradigm, for what it's worth.
- [ ] R-089 feat/tables-spreadsheet | It might be nice to develop the tab paradigm of the tables list across the top of the bottom pane. Currently, all the non-active tables are undecorated plain text, which doesn't really say "I'm an inactive tab."

### feat/customer-find-labels

- [ ] R-090 feat/customer-find-labels | "Use current view" button of "Widest view that attempts to display customer labels" uses height (I think), not width. Then it's applied as advertised, to width. So it appears not to work.

### The branches he asked about

- [ ] R-091 feat/xy-world-map | Why is this branch still present? The task has been closed. Merge, delete, and update?
- [ ] R-092 feat/lock-initials-later | Done except for the messenger system, right? Was anything changed that I should review? Merge, delete, and update so that we can move on to the messenger task?
- [ ] R-093 feat/engine-fetch-wait | Why is this branch still present? Is there something to do? Or merge, delete, and update?

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

- [?] R-101 feat/label-gang-search | Given your explanation, how do all those labels get stacked when narrow? What is it about being single and narrow that uniquely makes/lets them stack neatly and endlessly?
- [?] R-102 feat/label-gang-search | "Nineteen real collisions shove fifty-one labels": You say nineteen real collisions. But if there were dozens neatly stacked while short-stringed (ID alone), then there are zero real collisions. This is the mystery I will not let rest. You say nineteen while I say zero.
- [?] R-103 feat/label-gang-search | The fix is built: OK. But I don't understand why we are spending effort on the rings model instead of giving the spot-prime box model a good college try.

### Off means Off

- [?] R-104 -- | If Off means Snapshot, does this help Declan's speed? Is "Save whole project" related to Automatic Recalculate?

### Misc, from his own browser passes

- [ ] R-105 -- | The time step selector on the toolbar (need the transport) lists time ranges. Starting at 24:00, the step end time is normalized back to clock time instead of staying at run time. So we get 24:00 - 0:00. Fix it to say 24:00 - 25:00, and fix all subsequent steps.
- [ ] R-106 -- | Initial values: Settings.Symbology.Node.Source share.After = '%' and Decimal = 0; Water age.After = ' hr'; Initial quality.After = ' mg/L'; Concentration.After = ' mg/L'; Average source share.After = '%' and Decimal = 0; Link.Average water age.After = ' hr'; Node.Average concentration.After = ' mg/L'
- [ ] R-107 -- | Reaction rate does not appear in Properties or Tables. I see it only in Settings.Symbology.Link.
