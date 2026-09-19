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
- [ ] R-042 branch/name | his words, verbatim or near
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

**An ID is permanent and never reused.** Next free: R-045.

---

## Round of 2026-09-19 -- his second pass over the five branches

### Workflow and standing answers

- [x] R-001 -- | "Always ensure that my review comments are not lost until they are cleared." -- this file
- [?] R-002 -- | "Can we have a reviewer agent, or are these things unavailable to AI?" -- answered in session; a seat is possible, awaiting his word on whether he wants one
- [x] R-003 -- | "a new preview port needs a new entry in that URL list": No. The list simply contains localhost and hawsedc.local. -- handoff ruling corrected
- [x] R-004 -- | "A name given once for one purpose becomes a standing per-browser label": Confirmed. And we are adding "Not you? Change this" opportunities. -- Task 698 ruled; his answer to handoff decision 9
- [ ] R-005 fix/esc-focus-and-recalc | "Escape fix?": Yes. And please don't let Escape close those boxes when the mouse cursor is elsewhere. When I say "only when box is in focus", I mean it in the strongest way possible. Big guards on closing a box.

### feat/customer-find-labels

- [x] R-006 feat/customer-find-labels | "What makes them look labelled is something else": No. They didn't "look labelled". -- his correction of a session's answer; recorded, nothing to build
- [ ] R-007 feat/customer-find-labels | "[Customer] Station and offset were deliberately left out [of Find]": Bad decision. Put them in. Very handy for offset or station 0.
- [ ] R-008 feat/customer-find-labels | Didn't I say to trash Account number since they can just make a Custom property for that or anything else?
- [ ] R-009 feat/customer-find-labels | Since Customer is a pseudo-node, what if we provide existing properties like Description and Tag instead of Account number? Then we aren't inventing something, and we incur no language debt.
- [ ] R-010 feat/customer-find-labels | The Customer menu/toolbar tip should indicate Shortcut: 8. And that should be the truth. 8 to start Add Customer.
- [ ] R-011 feat/customer-find-labels | Reword this alert: "The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation."
- [ ] R-012 feat/customer-find-labels | Reword this property label: "Services at this customer" to "Number of services" (_syn "Number or count of services at this customer point").
- [ ] R-013 feat/customer-find-labels | Widest view: Add a "Use current view" button like the other one we restored in a different branch.
- [ ] R-014 feat/customer-find-labels | Labels are bigger than node and pipe labels, bad. I don't know where this came from.
- [ ] R-015 feat/customer-find-labels | Can we make labels one-line concats like link labels?
- [ ] R-016 feat/customer-find-labels | I think we need a third separate Customer symbology area in settings so that we can control Customer labels differently than other labels, since we may want only demand or only demand and description. "Customer symbology". I **don't** think we need a separate text size. That's a bug.
- [ ] R-017 feat/customer-find-labels | Customer symbols should scale using the Symbol scale setting, but they should just be a lot smaller than a node, like 0.2 to 0.3 as big, maybe 0.25.

### feat/xy-world-map

- [ ] R-018 feat/xy-world-map | "Place approximately", for a new user, this and "Cancel" need to be at the right side of the box.
- [ ] R-019 feat/xy-world-map | Mapbox satellite is connected and working, a little. I am getting huge hesitance to load tiles I need. I see tiles around the edges of my map. Zooming in and out coaxes the tiles slowly to load, but it's a slow and uncertain slog. Frustratingly, it's the area I care about most that disappears when I zoom in, while peripheral tiles keep showing. Can you please debug this? How can we get what we need from Mapbox?
- [x] R-020 feat/xy-world-map | The interface is super nice now, and we are really close. Amazing work! -- praise, no action
- [ ] R-021 feat/xy-world-map | The rotation slider needs up to be counterclockwise.
- [ ] R-022 feat/xy-world-map | Map submenus a lie: Yes. I see. Let's replace rows two and three (I like their behavior; good call) with "Re-adjust" tip "Return to Step 2 of the map attachment process."

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

- [ ] R-041 fix/esc-focus-and-recalc | While reviewing feat/tables-spreadsheet, I saw a banner message that when Recalculate is off, the first time step is still calculated. This is bad. Off means off. This could explain the delay I am seeing. With recalculate off and no zooms happening, there should be nothing happening when I change inputs. It should be lightning fast.

### Standing work he named

- [ ] R-042 -- | Can you make sure we have a Roadmap task to audit language for lazy duplications where maybe a slight redesign can simplify or eliminate keys?
- [ ] R-043 -- | I still need to test (and admire) label placement, solver bar, etc.
- [x] R-044 -- | The label work is a debugging job he has forbidden papering over, and "let labels look further" is ranked third, behind the switchboard and the sector question. -- carried from the previous session; the three handoff decisions remain his
