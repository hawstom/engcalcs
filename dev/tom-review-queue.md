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

**An ID is permanent and never reused.** Next free: R-060.

---

## Round of 2026-09-19 -- his second pass over the five branches

### Workflow and standing answers

- [x] R-001 -- | "Always ensure that my review comments are not lost until they are cleared." -- this file
- [?] R-002 -- | "Can we have a reviewer agent, or are these things unavailable to AI?" -- answered in session; a seat is possible, awaiting his word on whether he wants one
- [x] R-003 -- | "a new preview port needs a new entry in that URL list": No. The list simply contains localhost and hawsedc.local. -- handoff ruling corrected
- [x] R-004 -- | "A name given once for one purpose becomes a standing per-browser label": Confirmed. And we are adding "Not you? Change this" opportunities. -- Task 698 ruled; his answer to handoff decision 9
- [x] R-005 fix/esc-focus-and-recalc | "Escape fix?": Yes. And please don't let Escape close those boxes when the mouse cursor is elsewhere. When I say "only when box is in focus", I mean it in the strongest way possible. Big guards on closing a box. -- fix/esc-focus-and-recalc d9b2be9d -- Escape reaches a box only when focus is genuinely inside it; menus untouched

### feat/customer-find-labels

- [x] R-006 feat/customer-find-labels | "What makes them look labelled is something else": No. They didn't "look labelled". -- his correction of a session's answer; recorded, nothing to build
- [x] R-007 feat/customer-find-labels | "[Customer] Station and offset were deliberately left out [of Find]": Bad decision. Put them in. Very handy for offset or station 0. -- feat/customer-find-labels 4f15643b -- in Find AND writable in Replace
- [x] R-008 feat/customer-find-labels | Didn't I say to trash Account number since they can just make a Custom property for that or anything else? -- feat/customer-find-labels 4f15643b -- the owned Account number field is gone
- [x] R-009 feat/customer-find-labels | Since Customer is a pseudo-node, what if we provide existing properties like Description and Tag instead of Account number? Then we aren't inventing something, and we incur no language debt. -- feat/customer-find-labels 4f15643b -- a customer now carries Description and Tag; an old project's account number is copied into the TAG on open, character for character. HIS CALL: Tag or Description?
- [x] R-010 feat/customer-find-labels | The Customer menu/toolbar tip should indicate Shortcut: 8. And that should be the truth. 8 to start Add Customer. -- feat/customer-find-labels 4f15643b -- 8 already worked and the toolbar tip already said so; the INSERT MENU carried no tip at all, for any of the eight tools. All eight now do
- [x] R-011 feat/customer-find-labels | Reword this alert: "The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation." -- feat/customer-find-labels 4f15643b -- HIS EXACT WORDS, which carry no glyph, so the caution mark came off with the old sentence. One edit to restore it if he wants it
- [x] R-012 feat/customer-find-labels | Reword this property label: "Services at this customer" to "Number of services" (_syn "Number or count of services at this customer point"). -- feat/customer-find-labels 4f15643b -- label and synonym both exactly as he gave them
- [x] R-013 feat/customer-find-labels | Widest view: Add a "Use current view" button like the other one we restored in a different branch. -- feat/customer-find-labels 4f15643b -- same words, same key, same behaviour as the one on feat/label-gang-search, rounding the width UP
- [x] R-014 feat/customer-find-labels | Labels are bigger than node and pipe labels, bad. I don't know where this came from. -- feat/customer-find-labels 4f15643b -- there never was a separate text size; the STACKING is what made them look big. A check now fails the build if anyone adds one
- [x] R-015 feat/customer-find-labels | Can we make labels one-line concats like link labels? -- feat/customer-find-labels 4f15643b -- one line, through the same function link labels use
- [x] R-016 feat/customer-find-labels | I think we need a third separate Customer symbology area in settings so that we can control Customer labels differently than other labels, since we may want only demand or only demand and description. "Customer symbology". I **don't** think we need a separate text size. That's a bug. -- feat/customer-find-labels 4f15643b -- third section, named exactly Customer symbology, no separate text size
- [x] R-017 feat/customer-find-labels | Customer symbols should scale using the Symbol scale setting, but they should just be a lot smaller than a node, like 0.2 to 0.3 as big, maybe 0.25. -- feat/customer-find-labels 4f15643b -- 0.25 of a junction, and it follows Symbol scale, which it had never done

### feat/xy-world-map

- [x] R-018 feat/xy-world-map | "Place approximately", for a new user, this and "Cancel" need to be at the right side of the box. -- feat/xy-world-map 4505b5db -- both at the right edge, search buttons left where they were
- [x] R-019 feat/xy-world-map | Mapbox satellite is connected and working, a little. I am getting huge hesitance to load tiles I need. I see tiles around the edges of my map. Zooming in and out coaxes the tiles slowly to load, but it's a slow and uncertain slog. Frustratingly, it's the area I care about most that disappears when I zoom in, while peripheral tiles keep showing. Can you please debug this? How can we get what we need from Mapbox? -- feat/xy-world-map 4505b5db -- MEASURED: tiles were requested from the WEST EDGE across, so the middle of the screen sat about 35th in a queue of up to 192; and every wheel nudge deleted the whole picture and restarted the queue from that same corner. Centre-out now, and the old picture stays up underneath
- [x] R-020 feat/xy-world-map | The interface is super nice now, and we are really close. Amazing work! -- praise, no action
- [x] R-021 feat/xy-world-map | The rotation slider needs up to be counterclockwise. -- feat/xy-world-map 4505b5db -- up is counterclockwise now. A test had pinned the wrong direction and called it counterclockwise, so nothing caught it
- [x] R-022 feat/xy-world-map | Map submenus a lie: Yes. I see. Let's replace rows two and three (I like their behavior; good call) with "Re-adjust" tip "Return to Step 2 of the map attachment process." -- feat/xy-world-map 4505b5db -- one row, Re-adjust, with his exact tip

### feat/tables-spreadsheet

- [x] R-023 feat/tables-spreadsheet | There is an unexpected blip on the column separator about 2px from the blue top line border. After (right of) the last column, there is an unexpected horizontal gray line aligned with these blips extending about 15 px right of the table. -- feat/tables-spreadsheet f688970a
- [x] R-024 feat/tables-spreadsheet | The heading separators are offset (misaligned) from the column separators about 2px. -- feat/tables-spreadsheet f688970a
- [x] R-025 feat/tables-spreadsheet | The headings vertical and horizontal borders are gray and wider than expected, while the table body borders are as expected. -- feat/tables-spreadsheet f688970a
- [x] R-026 feat/tables-spreadsheet | The blue border at the top is unbalanced by anything. Everything else is gray or black. -- feat/tables-spreadsheet f688970a
- [x] R-027 feat/tables-spreadsheet | The resizing of columns works surprisingly well. Nice. There is only one problem. They are constrained from causing any word breaks or selector truncations, and this may be unwelcome by users. Let's relax that constraint and see how it plays for the public. Let selectors and inputs be truncated and headings be wrapped to the character level. -- feat/tables-spreadsheet f688970a
- [x] R-028 feat/tables-spreadsheet | Ctrl+Z works for mouse copy, but doesn't undo and the undo button doesn't undo. Fix that. -- feat/tables-spreadsheet f688970a
- [x] R-029 feat/tables-spreadsheet | Ctrl+arrows works, but stops at selectors. Make it stop only at blanks/ends. Is an empty checkbox a blank? Let's say no since it's a zero in concept. -- feat/tables-spreadsheet f688970a
- [x] R-030 feat/tables-spreadsheet | Home, End, Ctrl+Home, and Ctrl+End work, but Home and Ctrl+Home take me to column B, not to the ID column A. Fix this. -- feat/tables-spreadsheet f688970a
- [x] R-031 feat/tables-spreadsheet | I said that keyboard navigation should be in Select mode. But that is wrong. Keyboard navigation should be in Entry mode. This difference matters in the appearance of cells, where in Select mode they should be shaded blue and in Entry mode the single current cell should be merely border highlighted. Sorry I was wrong about the persistence of Entry mode. It, not Select, should be the default mode. -- feat/tables-spreadsheet f688970a
- [?] R-032 feat/tables-spreadsheet | I think that there is a fourth mode: Navigation, the part of what I called Entry when no characters are being typed. Check the literature. I will refer to this, but set me straight so we aren't inventing things we shouldn't invent. -- ANSWERED: your fourth mode is real. Excel calls it Ready; W3C calls it navigation mode. dev/tables-spreadsheet-modes.md. His call: rename our Select mode to Ready
- [x] R-033 feat/tables-spreadsheet | When I navigate by arrow keys from cell to cell, the behavior is correct as Navigate mode. But the appearance is as Edit mode in that the contents of each cell are selected as I pass through/over/on it. Instead, a blue border highlight (double-wide inward) should indicate the current cell. Modern spreadsheet practice also provides a dot at lower right of current cell or range/block for Autofill. -- feat/tables-spreadsheet f688970a
- [x] R-034 feat/tables-spreadsheet | In Navigate mode, there should be no blue shading, since that's reserved for Select mode. -- feat/tables-spreadsheet f688970a
- [?] R-035 feat/tables-spreadsheet | When I type into a cell and press Enter, Tab, or Arrow, after a short delay, my entry is reverted, which is bad. -- NOT REPRODUCED in 26 real-browser trials. WHICH TABLE, WHICH COLUMN, and was the project opened from a FILE rather than an example?
- [x] R-036 feat/tables-spreadsheet | In select mode, the current cell should be the **starting** cell, not the **ending** cell. So if I select A1 and B1, then arrow down once, I should be at A2. [copy-down sequence: navigate A1, shift-arrow to B1, Ctrl+C, down arrow to A2, Ctrl+V] -- feat/tables-spreadsheet f688970a
- [x] R-037 feat/tables-spreadsheet | Right-clicking anywhere in a selection should not perturb the selection. But I see it changing the selection to the right-clicked cell. -- feat/tables-spreadsheet f688970a
- [x] R-038 feat/tables-spreadsheet | A selection should highlight cells, not characters. But I see characters highlighting as in Entry mode. -- feat/tables-spreadsheet f688970a
- [x] R-039 feat/tables-spreadsheet | Copy/paste works (and persists) for mouse select. Doesn't work for keyboard select or Navigate (copy current cell). -- feat/tables-spreadsheet f688970a
- [?] R-040 feat/tables-spreadsheet | Doesn't copy across columns. Maybe this is what we want. Don't "fix" for now. Maybe it can be a project Setting (Allow table copy across columns). Make this a Priority 50 question. -- MEASURED: copy and paste ACROSS columns already works both ways. What you saw was probably single-cell Ctrl+C doing nothing (R-039). Please re-test before Task 700 is written on it

### Defects found while reviewing

- [x] R-041 fix/esc-focus-and-recalc | While reviewing feat/tables-spreadsheet, I saw a banner message that when Recalculate is off, the first time step is still calculated. This is bad. Off means off. This could explain the delay I am seeing. With recalculate off and no zooms happening, there should be nothing happening when I change inputs. It should be lightning fast. -- fix/esc-focus-and-recalc d9b2be9d -- MEASURED: the switch was wired only to later time steps and did NOTHING on a project with no duration. Off now means off

### Standing work he named

- [x] R-042 -- | Can you make sure we have a Roadmap task to audit language for lazy duplications where maybe a slight redesign can simplify or eliminate keys?
- [ ] R-043 -- | I still need to test (and admire) label placement, solver bar, etc.
- [x] R-044 -- | The label work is a debugging job he has forbidden papering over, and "let labels look further" is ranked third, behind the switchboard and the sector question. -- carried from the previous session; the three handoff decisions remain his

### Raised by the work, and his to decide

- [?] R-045 feat/xy-world-map | The world-zoom basemap IS mirrored and the cause is measured: at world zoom the easternmost tile touches the 180th meridian, and the arithmetic wraps its right-hand edge round to -180, so one tile is stretched backwards across the whole screen on top of everything else. Its placement width computes as -1,750 where it should be +250. It predates this branch. The fix is small and lives in `js/lpn-georef.js`; it was reported rather than built because he asked for a look, not a build

## Round of 2026-09-19, later -- his third pass

**TWO OF THESE REVERSE WHAT MERGED TO MASTER THE SAME DAY.** R-046 and R-047 undo choices made
inside the recalculate-off fix. He is right and the reasoning is his: OFF MEANS OFF is a rule about
CONSENT, and both of those choices were this repository deciding for him what he must have wanted.

### On master -- the recalculate-off fix overreached

- [ ] R-046 fix/recalc-trust-user | Recalc off Old values: Leave in place stale. Don't clear. Trust the user.
- [ ] R-047 fix/recalc-trust-user | Calculate on open: No. **Off means off**; you say it, but do you believe it? Consent, people! And the industry is used to that.
- [ ] R-049 fix/recalc-trust-user | Escape: What about mouse away and I don't click away, then I press Esc? I want to be very severe against accidental Esc closures of the boxes.

### Process

- [x] R-048 -- | Reviewer: I didn't have in mind a review assistant. I had in mind a pre-reviewer, but I guess you already do the best you can with that. I just want independent review, not self-review, of all work before I see it. This could save me review time. But if you have a vision for a review assistant, that could be helpful too. -- SEAT HIRED: `.claude/agents/pre-reviewer.md`. It reviews work it did not write, on every branch, before he is told the branch is ready, and it REPORTS rather than fixes. **It needs a name from him.**

### feat/customer-find-labels

- [ ] R-050 feat/customer-find-labels | Settings: Let's try changing main heading Visualization to Symbology and its subheadings to Node, Link, Customer, and All.
- [ ] R-051 feat/customer-find-labels | The labels are hiding the service line. They need to be moved away about 1px or 2px or their halo needs to be that much smaller.
- [ ] R-052 feat/customer-find-labels | When a label is beyond the meter, make it middle justified with the meter instead of bottom.
- [ ] R-053 feat/customer-find-labels | Like most of the label placement, I see a mystery. I see a row of labels along the service lines with a few beyond the meter. I see that these would conflict with a link label, but if so, maybe we should calculate the standard location for all to accomodate a link label.
- [ ] R-054 feat/customer-find-labels | As you can see in the image, Customer labels are still a vastly different size than other labels. Fix that.

### feat/xy-world-map

- [ ] R-055 feat/xy-world-map | Why do we throw away satellite tiles? We should have a good-sized cache where we throw away only the oldest, right?
- [ ] R-056 feat/xy-world-map | There are still a few blank tiles that never fill in when I stop zooming. It's as if we decided not to draw these tiles.

### feat/tables-spreadsheet

- [ ] R-057 feat/tables-spreadsheet | Top border is missing.
- [ ] R-058 feat/tables-spreadsheet | Strange missing heading border between Tanks Mixing model and Mixing fraction.
- [ ] R-059 feat/tables-spreadsheet | Some of the columns are now sized too narrow by default. I believe that Description was a single character long. Please fix this in a reasonable way. I thought of making a rule not to divide any word into more than three parts, but that's just an idea.
