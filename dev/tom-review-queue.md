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

**An ID is permanent and never reused.** Next free: R-070.

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

- [ ] R-046 fix/recalc-trust-user | Recalc off Old values: Leave in place stale. Don't clear. Trust the user. -- fix/recalc-trust-user 313a8656 -- stale numbers stay exactly where they are, and the page says nothing about them. Key `lpn_manual_results_cleared` DELETED
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

- [ ] R-066 feat/xy-world-map | The date-line tile mirror: *"I will have to trust you."* Ours to build, with a regression check, since he will not be the one who sees it come back. -- feat/xy-world-map 731ab367 -- **AND THE DIAGNOSIS IT WAS HANDED WAS WRONG IN ONE IMPORTANT WAY: it is not the date-line tile at all.** The tear sits at the ANTIPODE OF THE TRANSFORM'S ORIGIN. At step 1 the origin starts at 0,0, whose antipode IS the date line, which is why it looked like a date-line defect and showed only there. The cause is one function asking *which way round the world is this longitude nearer* -- the right question for one POINT and the wrong one for the two ENDS OF AN EDGE, which can land on opposite branches. Measured before and after at three places and two zooms: -1,750 becomes +250; -1,666.7 becomes +238.1; -1,062.4 becomes +354.1. A negative width IS a picture drawn backwards. The regression check grades against a width derived a DIFFERENT way rather than restating the fix, and is mutation-tested
  - I would like you to try to show this problem to me unless it has been fixed. If it has been fixed, please delete this.
