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

**An ID is permanent and never reused.** Next free: R-182.

---

## Round of 2026-09-19 -- his second pass over the five branches

### Workflow and standing answers

- [ ] R-004 -- | "A name given once for one purpose becomes a standing per-browser label": Confirmed. And we are adding "Not you? Change this" opportunities. -- Task 698 ruled; his answer to handoff decision 9
  - TGH testing 2026-09-18 22:01 UTC · 37f05c7e: (1) The banner message about "We asked your colleague to close the file" disappeared too fast and unrecoverable "Help! What did I miss!" We need a better messaging system. We talked about the QGIS system. Maybe open a feature branch for Error and notice messaging system.
  - TGH 2026-09-22 I hope to test later.

### Standing work he named

- [ ] R-043 -- | I still need to test (and admire) label placement, solver bar, etc.
- [x] R-044 -- | The label work is a debugging job he has forbidden papering over, and "let labels look further" is ranked third, behind the switchboard and the sector question. -- carried from the previous session; the three handoff decisions remain his

## Round of 2026-09-21 -- after two days of his own testing

- [x] R-070 -- | Site check: why am I getting this? I thought I was getting only an email at 8:00 every day. -- **ANSWERED, and the failure is spurious.** Two different cron jobs. The 8:00 one is the DAILY REPORT (22:00 CDT on the server, which is 20:00 in Phoenix). The 2:22 AM one is the PAGE CHECK (04:20 CDT = 02:20 Phoenix), and **it mails only when something is wrong** -- so receiving it at all means a failure. The failure is `https://librewaternet.org/tools/build-chrome.php HTTP 403`, and **403 is the correct and desired state**: that directory is the remote-execution exposure closed on 2026-09-18. **The server's copies of the check config are STALE.** This repository excludes the whole `/tools/` directory and asserts it unreachable in `check.mustblock`; the server's `~/check.exclude` names only `build-features.php` and its `~/check.mustblock` names neither. `host_script_parity_check.php` reports both as DIFFERS. One command from him fixes it
- [ ] R-075 feat/label-gang-search | I am never going to be happy until I can add 12345678 to the node ID prefix without moving or hiding any of the labels shown. Any such moving or hiding is a blatant bug since adding that string **however** causes no conflicts with anything all the way to Japan. May as well not dodge it, hide it, or paper over it. Find out why it's happening and fix the bad rules.
- [ ] R-076 feat/label-gang-search | Switching to the all-round search halves the vanished labels: yes, but at what performance cost? My hope is to move as much as possible of our calculation burden to a pre-calculated model that applies across zooms, so nodes have a lookup table for where they can expect an optimal place for their label at a range of zooms.
- [ ] R-077 feat/label-gang-search | The four corner positions: I assume they are relatively cheap, and that we can record the zoom at which they are no longer effective (and clear that when Symbology or Appearance is changed?).
- [ ] R-078 feat/label-gang-search | Based on the switchboard, I guess spot route is not yet programmed since it doesn't do anything. I can't get anything to work except the checkboxes; from those it looks like corners and ring combined are producing nice results.
- [ ] R-079 feat/label-gang-search | "Publishing those gaps as a ranked list instead of a single winner is a change where it's consumed, not a new model." Do that? Or we already did?

## Round of 2026-09-21b -- his list after the branch previews

### Misc, from his own browser passes

- [x] R-105 fix/time-step-instant | "R-105: I opened this (unchecked). I think I made a mistake, and these are not ranges, they are times. Please ask Mary to check this and then, if I was wrong, change the selector to have only one time per option." -- Mary confirmed: every comparable tool (EPANET's own Browser Time, epanet-js's step model, WaterGEMS/SewerGEMS's Time Browser) names one instant per step, never a range. A row now reads a single elapsed time (`25:00`, still climbing past 24:00, never wrapping to the wall clock); the clock reading stays in the row's tip, also as one instant.

## Round of 2026-09-21c -- his pass over the reloaded preview panel

### Placement -- the ruling that reframes the whole label job

- [ ] R-108 feat/label-gang-search | (on being told "The spots don't move; the boxes grow into each other" / "Two labels at neighbouring spots collide exactly when their half-widths together exceed the spacing between spots" / "Narrow: spacing wins, every spot stays usable. Wide: the box wins, so a wide label occupies spots it is not standing on") **"Clearly this is a bug. But you say it without batting an eyelash. If you don't understand why it's a bug, ask me. If you do, fix it. I'm just grateful that magically this endless stack happened so that I know it's possible; We just have to find out how it's possible and empower that."** -- HE IS RIGHT AND THE EXPLANATION WAS BEING OFFERED AS A DEFENCE. A placement lattice whose spacing is blind to the size of the thing being placed is a defect, not a constraint, and the narrow case working is the existence proof that a correct layout is available on that drawing. Two halves, both with the build agent: find out how the endless stack is possible and write it down, then make the wide case use the same mechanism. His acceptance test is R-075 unchanged

### feat/tables-spreadsheet -- his fifth pass

- [x] R-110 feat/tables-spreadsheet | Sometimes the column widths are unreasonable. For example, Pumps.Date installed, width = 1em; Pumps.Pump head curve, width = 2 em (due to selector?); Pump.Price pattern, width = 3em (due to selector?) -- merged to master 2026-09-23 on his all-clear (R-173)

### feat/notice-log -- his four

- [x] R-116 feat/notice-log | This will need some finesse before it's done. -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-117 feat/notice-log | For now, I know that the button/glyph must be where the messages appear, and it must appear and possibly highlight while a message displays. -- **IDA CONFIRMS THIS IS A DEFECT AND NOT A PREFERENCE**: the messages render top-left, on top of the mode line, and the glyph was put in the bottom-left footer strip. She says she should have caught it before he did -- 349e706e moved the glyph but LEFT #lpn_map_notice positioned against the map's own corner, so the notice covered the glyph and its highlight for the whole time a message showed (Perry's review, 2026-09-22, caught by screenshot, not by the harness). Reopened. A second commit moves #lpn_map_notice itself into #lpn_map_overlay_tl_col with `inset-inline-start:0`, and a new browser-pass probe (dev/browser-pass/specs/msglogpos.js) asserts the glyph's box and the notice's box never intersect and stay adjacent, in en and ar at 1280 and 390 -- mutation-tested against the exact original defect -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-118 feat/notice-log | Possibly the messages and the glyph need to be coincident with the mode message at the top of the map so that we see something like [his screenshot: one top-of-map strip carrying a circled glyph then "Mode: Select. Click an asset or a label to see..."]. -- **IDA: YES, MERGE THEM, AND IT REMOVES A ROW RATHER THAN ADDING ONE.** But never put the message text and the mode sentence on the SAME LINE: keep them stacked in one top-left column with the notice covering the mode line as it already does, and anchor the glyph at that column's fixed left edge so it survives both states -- 349e706e got the ROW right (glyph fixed left, column stacking mode hint/notice/diagnostic) but the notice inside the column was still positioned against the wrong ancestor, so in RTL (?lang=ar) the glyph sat at the physical right while the notice stayed pinned to the physical left -- disconnected by most of the viewport width, not merely uncovered. Reopened alongside R-117; same fix, same probe (msglogpos.js asserts a small gap between the two boxes, not just non-overlap, specifically because that RTL disconnect does not intersect and would pass a weaker check) -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-119 feat/notice-log | The i info glyph doesn't seem quite right to me. Is it what Ida recommended? How about a + expand glyph or a history glyph? Show me something creative. We need to evolve on this. -- **IT WAS NOT HERS AND SHE SAYS IT IS WRONG**: the circled-i already names five other rows on this page (Welcome, Privacy, Terms, About, Reports), every one a reference fact about the software, where this is a personal growing feed. **Her recommendation is a PLAIN CLOCK FACE, no surrounding arrow**, drawn new in `lib/Icons.lib.php` as `history`. She argues AGAINST the circular arrow (already means Revert and Restore on this page, the opposite job), against a bell (imports an unread-and-urgent category this page's two severities do not have), and against his `+` (means "create" everywhere else, and is close to this suite's own `new` glyph) -- 26a68dc3 drew the icon with both hands within about 20 degrees of straight up, which Perry read at real button size as a chevron or checkmark, not a clock (the two strokes fuse into one bent line). Reopened. Redrawn as a right angle -- hour hand straight up, minute hand straight right -- and a static geometry assertion added to dev/lpn-spike/notice-log-harness.js (one hand axis-aligned to vertical, the other to horizontal), mutation-tested against the original shape. Four candidates re-shown in the scratchpad with the corrected clock -- merged 2026-09-23 on his all-clear (R-177/R-178)

### The daily mail

- [x] R-121 -- | The "rank by shopping" table is hard to read. Can you add headings? I don't know what the numbers represent. -- ea551c6c
- [x] R-122 -- | I assume that "PAGE LOADS" includes robots. Maybe clarify that "(includes robots)" if so. -- ea551c6c. **His guess was wrong**: this table's rows already require 10+ seconds on the page before counting at all, so it already excludes nearly all robots by behaviour; the mail now says so instead of "(includes robots)"
- [x] R-123 -- | Is "PEOPLE" non-robot (long-dwell) visits? Maybe clarify that. -- ea551c6c. **Also not quite right**: PEOPLE is the consented bucket (accepted the cookie banner, counted once per person per page), unrelated to dwell time; the mail now says that plainly

## Round of 2026-09-22 -- the same pass, resent after Claude froze

### Map menu

- [x] R-126 feat/map-menu | Keep all rows visible always. But disable what's not applicable. (1) Maybe 'World map...' should be enabled for all projects. Even an EPSG project should have the option to detach and reattach the world map, I think. But when they attach, they don't have to do the wizard. And for EPSG projects, Re-adjust and Scale should be disabled unless there's user demand to expose them. (2) I think we can retire the Hide/Show street map and satellite images rows. Detach and attach provide the same functionality. (3) Hide map readouts was a print prep command. But it isn't very useful any more. Let's remove it. -- **SUPERSEDES his R-120 question** about whether a context-sensitive menu is good: his answer is always visible, disabled when not applicable
- [x] R-127 feat/map-menu | That got tidy. Only three rows left. Zoom to fit, Background image, and World map.
- [x] R-128 feat/map-menu | georeference xy: I don't see this work merged to master. The map menu should have parallel Background image and attach world map rows. But I don't see that. -- **IT DID MERGE** (`feat/xy-world-map`, on his all-clear of 2026-09-21); the World map row was offered only on a plain grid project, so it was not on the map he was looking at. R-126 makes it always visible, which answers this by construction

## Round of 2026-09-22b -- his pass over the six branches

- [ ] R-135 feat/label-gang-search | I am incredulous. You made huge progress. Long strings now barely perturb the endless stacked gang of leaders. Before moving on, I want to pick at this.
- [ ] R-136 feat/label-gang-search | While the results are very good, I still want to push on why additional string length makes any difference at all. The fact that it does leads me to suspect or at least ask for a good insight into our model since, again, there is free space all the way to Japan and beyond. I notice that with 1 character added, there is no significant additional vertical spacing in the gang. But when I add a second character, a noticeable amount of additional gaps appear in the vertical stack. As I add more characters, results oscillate, but the general trend is that the gang's leader trend longer and longer, meaning that the top label of this descending gang is eventually gratuitously 20 text heights away from its node. While I am tempted to rationalize that this is an artifact of keeping the leaders near parallel, that's wrong because with no characters or 1 character, the top label is only gratuitously about 8 text heights below (south of) its node. That said, to say this is partly to quibble since our placements are quite good now, and we really should be focusing on efficiency and performance.
- [ ] R-137 feat/label-gang-search | Moving to a different test case than that notorious southwest area, let's look at the northwest area with three properties turned on and we are zoomed in closer. [his screenshot: labels for nodes 120 and 25x at A, well away from their nodes; empty ground at B, nearer them] A human would have slid the two labels at A toward B, shortening the leaders without any bad effects. Could our algorithm be smart enough not to be gratuitously distant like this?
- [x] R-144 feat/notice-log | I like the down arrow glyph. -- the clock drawing reads to him as a down arrow / Expand glyph, and he likes it: KEEP IT, do not redraw the hands

## Round of 2026-09-22c -- his pass after the map-menu, zoom and Messenger work

### feat/map-menu -- CLEARED AND MERGED

- [x] R-153 feat/map-menu | I believe this is done now. Great decisions and great execution. Merge and delete branch. -- merged to master 2026-09-22 on this all-clear; R-126, R-127 and R-128 go with it
- [?] R-154 feat/map-menu | You asked "Nothing can now throw a grid placement away and start the wizard over. Do you want a row for that, and in what words?" I am not clear on what can't be done. Can you more carefully describe the case and the missing functionality? -- **DESCRIBED FOR HIM.** Re-adjust opens the wizard's STEP 2 only, on the placement already on file, so it can nudge, turn and scale a grid drawing but can never reopen step 1, which is the "where in the world is this" question. A grid project placed in the wrong town therefore has no way back: Detach keeps the placement, Attach puts the same one back, and only the session's own undo can throw it away. The missing thing is one row meaning "forget this placement and ask me where it is again." His wording needed
- [x] R-155 feat/map-menu | Let's synchronize our terminology: EPSG, unnamed (local) georeference, and not georeferenced. If I am thinking straight, we now have only those three cases. lat/lon is now a deprecated label since it merely refers to one of hundreds of EPSG CRSes. -- **HE IS THINKING STRAIGHT AND THOSE ARE THE THREE.** Adopted
- [x] R-156 feat/map-menu | You asked "I greyed Re-adjust and Scale on lat/lon projects as well as EPSG. You only said EPSG." Does this question go away if we get precise about terms? Is lat/lon just a type of EPSG, or did you mean something else? -- **YES, IT GOES AWAY.** lat/lon is EPSG:4326, so greying both is ONE rule, not two, and the code already draws the line where he wants it

### feat/notice-log -- "Messenger"

- [x] R-157 feat/notice-log | I discovered what is appearing behind the glyph. It is the text "RIVER" from the model. I consider that a bug, but I don't know what kind of bug. It's a Text object, not a label. -- 80bc539e on feat/notice-log: the button was 80% opaque, so map Text showed through; now solid white
- [?] R-158 feat/notice-log | I like the down arrow or a + better than the clock. What does Ida say? -- **SHE SAYS NEITHER, AND SHE CHECKED THIS PAGE RATHER THAN ARGUING FROM TASTE.** A down triangle already means "a menu opens below" twice on this page (the pane tab caret and the project tab caret) and marks a table column's sort direction a third time; the `+` already means "make a new one" twice (New scenario, New saved path) and the message log makes nothing. Her recommendation is to repair the same clock rather than replace it: a dot at the center and the two hands spread further apart, which is what made it read as a bent arrow. His call
- [x] R-159 feat/notice-log | We are getting closer. But the simultaneous messages on open and the "Newest first" help text appear on one line instead of on three. This is a bug. -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-160 feat/notice-log | I don't think we need a tip on the down arrow glyph. I think it's more trouble than help. -- already so on feat/notice-log: no tip, only a screen-reader name

### feat/tables-spreadsheet

- [x] R-161 feat/tables-spreadsheet | Some of the column and heading divider vertical borders are misaligned by 1 px. -- merged to master 2026-09-23 on his all-clear (R-173)
- [x] R-162 feat/tables-spreadsheet | Print is not respecting on-screen column widths. -- merged to master 2026-09-23 on his all-clear (R-173)

### feat/label-gang-search

- [ ] R-163 feat/label-gang-search | Things have changed so much that I am disoriented. This may be good to undo.
- [ ] R-164 feat/label-gang-search | I am seeing dropping when I would have preferred to see longer leaders.
- [ ] R-165 feat/label-gang-search | Here is a strange example where (a) we could have had all requested properties and (b) we could have had a shorter leader.

### Zoom and scaling -- his four rulings and one defect

- [x] R-166 -- | On the Novato example, junctions already draw smaller at the opening view. Is that right? -- his own answer: "Junctions are about half as large as pumps, reservoirs, and tanks. Yes. That is intentional." Nothing to do
- [x] R-167 -- | I am torn. 10th %-ile and "same as label limit" were competing ideas for this limit; I'd prefer not to have two rules. I like 10th %-ile a lot, probably better than piggybacking on the labels limit. Let's try a new setting for %-ile: "Prevent nodes from scaling larger than __ times the length of the __ percentile pipe" where we set the defaults at 0.5 and 20% for now. And remove the piggyback limit. -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-168 -- | Should pipe widths shrink past the threshold too? Today they don't. Yes. Everything shrinks except reservoirs and tanks. -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-169 -- | Should Net3 get a threshold back? Its "Zoom in to see labels" note is untrue without one. Yes. 30 -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-170 -- | I found a little peripheral bug. "ft" is in the wrong place. It should be before the button. -- merged 2026-09-23 on his all-clear (R-177/R-178)

### Calculation and time steps

- [ ] R-171 -- | When I change Base demand in Properties, Demand, Pressure etc. change on the node label, but not in Properties.

### Task 696, the coordinate conversion wizard

- [ ] R-172 -- | (1) In Step 1, a background image gets dragged around with the map (then snaps back on release of drag) instead of always staying with the project. (2) When I finished the Convert coordinates as... wizard on the Elm Street Center example, the world map worked, but the satellite view didn't. (3) I completely missed this until now, but this wizard is out of date with our current CRS paradigm. The first thing it needs to do is ask what coordinate system we are going to. -- folded into Task 696, which stays OPEN at 100 rather than closing, because his point (3) reopens the paradigm

## Round of 2026-09-23 -- his rulings on three branches and Settings undo

- [x] R-173 feat/tables-spreadsheet | Done. Merge and delete branch. -- merged to master 2026-09-23; R-110, R-161 and R-162 go with it
- [x] R-174 feat/zoom-scale-rules | (Text, Show at all zoom levels) This property should be off for all but the largest text object in our examples and for all projects with no previous settings. This property should appear in multi-properties, Tables, and Find/Replace. -- merged 2026-09-23 on his all-clear (R-177/R-178)
- [x] R-175 feat/notice-log | (Messenger) I liked the down arrow that was initially used for the messenger. I don't like the one we have now. I don't recommend heroics to make it unique. Something very much like a selector (probably perfect) or a tab menu is fine. -- 80bc539e on feat/notice-log: a plain filled down triangle, the same shape as the tab-menu carets
- [x] R-176 -- | (Settings Undo) Ida is right and wrong. Right that it does not edit the network. Wrong that it doesn't not do anything you can see at the moment you make it, for over half the settings including Symbology, most of Appearance, and Calculation when recalculate is on. We can leave it as is. -- Task 709 closed; Settings stay out of undo

## Round of 2026-09-23b -- two all-clears and the zoom-control pass

- [x] R-177 feat/notice-log | Done. Close, merge, and delete branch. -- merged to master 2026-09-23
- [x] R-178 feat/zoom-scale-rules | Done. Close, merge, and delete branch. -- merged to master 2026-09-23
- [ ] R-179 feat/zoom-control | The + and - glyphs are not centered in their boxes. Fix that.
- [ ] R-180 feat/zoom-control | It seems inconsistent for us to use click for selection, but drag for zoom. I think we should have a consistent idiom. Maybe Ida has insight.
- [ ] R-181 feat/zoom-control | With Select area, the first time you click, it does not change modes. Changing the first time you click is confusing. I think that it should act like Select area. Click twice in a row to get mode change.
