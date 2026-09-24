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

**An ID is permanent and never reused.** Next free: R-230.

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

## Round of 2026-09-21c -- his pass over the reloaded preview panel

### Placement -- the ruling that reframes the whole label job

- [ ] R-108 feat/label-gang-search | (on being told "The spots don't move; the boxes grow into each other" / "Two labels at neighbouring spots collide exactly when their half-widths together exceed the spacing between spots" / "Narrow: spacing wins, every spot stays usable. Wide: the box wins, so a wide label occupies spots it is not standing on") **"Clearly this is a bug. But you say it without batting an eyelash. If you don't understand why it's a bug, ask me. If you do, fix it. I'm just grateful that magically this endless stack happened so that I know it's possible; We just have to find out how it's possible and empower that."** -- HE IS RIGHT AND THE EXPLANATION WAS BEING OFFERED AS A DEFENCE. A placement lattice whose spacing is blind to the size of the thing being placed is a defect, not a constraint, and the narrow case working is the existence proof that a correct layout is available on that drawing. Two halves, both with the build agent: find out how the endless stack is possible and write it down, then make the wide case use the same mechanism. His acceptance test is R-075 unchanged

### The daily mail

- [x] R-121 -- | The "rank by shopping" table is hard to read. Can you add headings? I don't know what the numbers represent. -- ea551c6c
- [x] R-122 -- | I assume that "PAGE LOADS" includes robots. Maybe clarify that "(includes robots)" if so. -- ea551c6c. **His guess was wrong**: this table's rows already require 10+ seconds on the page before counting at all, so it already excludes nearly all robots by behaviour; the mail now says so instead of "(includes robots)"
- [x] R-123 -- | Is "PEOPLE" non-robot (long-dwell) visits? Maybe clarify that. -- ea551c6c. **Also not quite right**: PEOPLE is the consented bucket (accepted the cookie banner, counted once per person per page), unrelated to dwell time; the mail now says that plainly

## Round of 2026-09-22b -- his pass over the six branches

- [ ] R-135 feat/label-gang-search | I am incredulous. You made huge progress. Long strings now barely perturb the endless stacked gang of leaders. Before moving on, I want to pick at this.
- [ ] R-136 feat/label-gang-search | While the results are very good, I still want to push on why additional string length makes any difference at all. The fact that it does leads me to suspect or at least ask for a good insight into our model since, again, there is free space all the way to Japan and beyond. I notice that with 1 character added, there is no significant additional vertical spacing in the gang. But when I add a second character, a noticeable amount of additional gaps appear in the vertical stack. As I add more characters, results oscillate, but the general trend is that the gang's leader trend longer and longer, meaning that the top label of this descending gang is eventually gratuitously 20 text heights away from its node. While I am tempted to rationalize that this is an artifact of keeping the leaders near parallel, that's wrong because with no characters or 1 character, the top label is only gratuitously about 8 text heights below (south of) its node. That said, to say this is partly to quibble since our placements are quite good now, and we really should be focusing on efficiency and performance.
- [ ] R-137 feat/label-gang-search | Moving to a different test case than that notorious southwest area, let's look at the northwest area with three properties turned on and we are zoomed in closer. [his screenshot: labels for nodes 120 and 25x at A, well away from their nodes; empty ground at B, nearer them] A human would have slid the two labels at A toward B, shortening the leaders without any bad effects. Could our algorithm be smart enough not to be gratuitously distant like this?
- [x] R-144 feat/notice-log | I like the down arrow glyph. -- the clock drawing reads to him as a down arrow / Expand glyph, and he likes it: KEEP IT, do not redraw the hands

### feat/tables-spreadsheet

- [x] R-162 feat/tables-spreadsheet | Print is not respecting on-screen column widths. -- merged to master 2026-09-23 on his all-clear (R-173) -- REOPENED AND FIXED AGAIN 2026-09-23c on master (fix/table-print): an untouched table now prints at its on-screen widths, scaled to the page
  - TGH: Reopening.

### feat/label-gang-search

- [ ] R-163 feat/label-gang-search | Things have changed so much that I am disoriented. This may be good to undo.
- [ ] R-164 feat/label-gang-search | I am seeing dropping when I would have preferred to see longer leaders.
- [ ] R-165 feat/label-gang-search | Here is a strange example where (a) we could have had all requested properties and (b) we could have had a shorter leader.

### Calculation and time steps

- [ ] R-171 -- | When I change Base demand in Properties, Demand, Pressure etc. change on the node label, but not in Properties.

### Task 696, the coordinate conversion wizard

- [ ] R-172 -- | (1) In Step 1, a background image gets dragged around with the map (then snaps back on release of drag) instead of always staying with the project. (2) When I finished the Convert coordinates as... wizard on the Elm Street Center example, the world map worked, but the satellite view didn't. (3) I completely missed this until now, but this wizard is out of date with our current CRS paradigm. The first thing it needs to do is ask what coordinate system we are going to. -- folded into Task 696, which stays OPEN at 100 rather than closing, because his point (3) reopens the paradigm

## Round of 2026-09-23b -- two all-clears and the zoom-control pass

- [x] R-179 feat/zoom-control | The + and - glyphs are not centered in their boxes. Fix that.
- [x] R-180 feat/zoom-control | It seems inconsistent for us to use click for selection, but drag for zoom. I think we should have a consistent idiom. Maybe Ida has insight.
- [x] R-181 feat/zoom-control | With Select area, the first time you click, it does not change modes. Changing the first time you click is confusing. I think that it should act like Select area. Click twice in a row to get mode change. -- his 2026-09-23c pass: "Yes" to centred glyphs, click-then-press refits, and two clicks or a drag (R-183)
- [ ] R-182 feat/convert-as | I didn't review, but I read the menu tip, and I like where it's headed.

## Round of 2026-09-23c -- his pass over the six preview ports

### feat/zoom-control (8103)

- [x] R-183 feat/zoom-control | Glyphs centred: "Yes". Press, click the map, press again refits: "Yes". Zoom Window takes two corner clicks or a drag: "Yes".
- [x] R-184 feat/zoom-control | "Bug: When I click twice, then zoom to a window with two map clicks, then click Zoom to Fit, it doesn't work. This presents as a catastrophic loss because my screen is blank. To get Zoom to Fit again, I click on the map again, then click Zoom to Fit. Note that all the worse with this bug, when I fail to get Zoom to Fit and I click the button a second time, it gives me Zoom Window." -- THE CAUSE WAS ZOOM TO FIT ITSELF, NOT ZOOM WINDOW: from a deep zoom it multiplied your dragged label offsets by that zoom (about 5,000 px of phantom label at the ceiling). Fixed on master (fix/zoom-fit-high-scale) and merged into feat/zoom-control; every node now ends on screen from any zoom

### feat/convert-as (8104)

- [x] R-185 feat/convert-as | "This wizard may be confusing. Let's try changing "This project: Not georeferenced" to "Current: Not georeferenced" and making it plain text, not faded/gray." -- feat/convert-as 6b4707ac
- [x] R-186 feat/convert-as | "Satellite works great." -- closes R-172(2)
- [x] R-187 feat/convert-as | "Let's turn the Round converted values section into two columns, Round converted values and Label (suffix, we can explain in a tip), so that after each of the four dropdowns we allow (and possibly pre-fill from Units) entry of a label suffix (" mm ft gpm L/sec etc)." -- feat/convert-as ab6ad007..a562e7c7. Diameter, head and flow suffixes reach the new copy's labels; depth is greyed (no tank-depth label exists: Task 712). YOUR CALL: untouched pre-filled boxes are applied too
- [?] R-188 feat/convert-as | (on EPSG:3857 offered as "lat/lon" while stored numbers are EPSG:4326 degrees) "I don't understand. I can't find the context. Give me more information." -- re-explained in the 2026-09-23c report
- [x] R-189 feat/convert-as | (the `$ec_lang_syn` for lpn_units_length) "Yes. "Pipe lengths, tank diameters, etc."" -- feat/convert-as 6cb06e08
- [?] R-190 feat/convert-as | (the "These are already lat/lon" button) "I don't understand. I can't find the context. Give me more information." -- re-explained in the 2026-09-23c report; the handoff had conflated it with lpn_transform_georefed_btn

### feat/table-editing (8105)

- [x] R-191 feat/table-editing | Hide this column: "Yes. Works well. Well done. But can we select multiple heading cells to hide multiple columns at once?" -- feat/table-editing fd604304: Ctrl/Cmd+click or Shift+click headings, then right-click, Hide these columns
- [x] R-192 feat/table-editing | "Ctrl+D on Pipes.From or To opens the browser Bookmark editing. It would be nice to have this documented somewhere somehow. I confess that I did not know about Ctrl+D" -- feat/table-editing fd604304: Ctrl+D is always claimed in the grid; menu shows Ctrl+C / Ctrl+D; Help > Notes lists the table keys. Mac still reads Ctrl (Task 713)
- [x] R-193 feat/table-editing | "Autofill with the little square button is yet to come? At the moment it's non-functioning and non-clickable. If it were gone (once implemented) where autofill is not offered, that would be nice." -- feat/table-editing fd604304: the square was decoration only; removed. Drag-to-fill is a separate build
- [x] R-194 feat/table-editing | iPhone long-press: "Sorry. I don't have an iPhone to test with." -- untested; noted, not a blocker

### feat/property-venue (8106)

- [x] R-195 feat/property-venue | Find > Pipes > Shut > equal to > Closed: "(1) Switching away from this leaves "closed" in the Value field. (2) Switching to this doesn't add the selector for the Value field if the value is already something else (doesn't discard what's there)." -- feat/property-venue 1066860e
- [x] R-196 feat/property-venue | Replace a tank's lowest water depth: "Yes. A little confusing. But powerful enough to justify it."
- [x] R-197 feat/property-venue | "Table to filter is confusing. (1) Is this offering two options or just one? In other words, is the button offering "Filter in selected table" or "Filter in active table"? (2) I think this would work better on the same line as the Find button like this: [Find][Filter in Table][tables_selector], and change/switch/push tables_selector when What to Search is changed/switched." -- feat/property-venue 1066860e: one row [Find][Filter in Table] Table [selector]; "Table to filter" shortened to "Table", which is OUR word and needs yours
- [x] R-198 feat/property-venue | "This is a little audacious, but I think we also should change/push "Property to change" when "Property" is changed since normally that is what users want, and power users can learn." -- feat/property-venue 1066860e

### feat/label-limit (8108)

- [x] R-199 feat/label-limit | "Make the Customer labels and All labels zoom limits settings interfaces identical. (a) Both to have the placeholder "Always show", (not "Always show labels"). (b) Both to say "Show labels when zoomed to this map width or less". (c) Both tips to be similar to the all labels tip, but with the last sentence removed since it's misleading. (d) Both styles to use the ? glyph. (d) Both "ft" to be before the button. (e) All means all, not all except customer. Customer labels can't show alone based on zoom. We should put a qualifier in the Customer label tip that "This has no effect if it is larger than the similar setting for all labels." (f) Ensure that the words "zoom", "show", and "label" are present for filtering. (g) Peripheral issue possibly for roadmap if too hard to address here: can Settings filter work as an AND word search? I think it currently works as an entire string search. "Type a word or multiple words to see settings that mention all of them."" -- feat/label-limit 9c7e54ab..1bbcae1d: one shared control for both rows; AND-word Settings filter; key lpn_labels_customer_width deleted

### feat/label-gang-search (8090)

- [ ] R-200 feat/label-gang-search | "I edited the file. Still a lot is open."

### feat/tables-spreadsheet (on master)

- [x] R-201 feat/tables-spreadsheet | "Print table puts heading borders only around ID." (and R-162 reopened: "Print table does not respect column widths. It expands to 100% of printable area.") -- fixed on master (fix/table-print): a sticky-header rule was overriding the print borders

## Round of 2026-09-24 -- MOD's test, his notes, and his pass over the six preview ports

### MOD's first-use test (2026-09-23)

- [?] R-202 -- | MOD could not find fire flow analysis; he clicked the map, then the toolbar, accidentally invoked New project, and found it under Water. His suggestion: "make the menus (tabs) a color that stands out like on a phone app ... and enlarged, icons too." TGH: "I'm kind of excited to see it either solid blue (very phone-like) or rounded blue outlined for every "button". It seems that the world has left the "menus" paradigm behind. Maybe Ida can comment on that." -- folded into Task 714 phase 1 (Ida: one button base and one accent colour for menu items and toolbar buttons, previewed on a branch). Build the preview branch? -- your go
- [?] R-203 -- | "Our hint above the toolbar didn't help him. He suggested maybe a colored light bulb glyph. But I think that is a feeble attempt to rescue an attempt that isn't working." -- Ida agrees: retire the hint, no light bulb; she would delete it when R-202's button style ships. Delete it now instead?
- [x] R-204 -- | Settings index pane wider: "on PC we can make the index pane 10% wider. The main pane could be 70% of what it now is ... It has a hard minimum that seems perfectly acceptable to me, and maybe we could use that as the initial default." -- master 61806814: index pane 7.26rem (10% wider), box opens at 70% of its old width; a dragged width is kept
- [x] R-205 -- | "(1) For all examples and new projects, can we set the background image opacity to 0.5? (2) For Net3 Novato (lat/lon) Can we set the all labels zoom limit to 65000 and change the gallery text to "EPANET Net3, lat/lon\nThe EPANET Net3 network converted to lat/lon at Novato, CA with the world map behind it." (3) For the other EPANET projects gallery text, can we replace "sample" with "example"?" -- master 61806814: opacity 0.5 on all seven examples and new projects; Net3 Novato label limit 65000 and your gallery text; "sample" became "example". Net3 Novato now hides labels when more than about 20 km is in view
- [x] R-206 -- | Settings, Quality parameter: "Change "A chemical that reacts" to "A reactive chemical". This is after consulting MOD." -- master 61806814
- [x] R-207 -- | "In Settings and all inputs everywhere that are not spreadsheet mode, he was startled that when he clicked on a text input, he got a cursor instead of the entire contents highlighted ... Expected behavior in Properties, settings, etc, is to highlight the entire contents for immediate overwriting by default. Check this with Ida, but it checks out for me, and it was his natural expectation." -- feat/select-on-focus 11edc1ad (port 8111); Ida confirmed it; textareas and spreadsheet cells excluded
- [x] R-208 -- | "The default Project1 tab has a path of frustration. If a user tries to attached the world map, it tells him that can't be done without any network. I think that the first-time experience needs to avoid that empty Project1 tab by funneling the user into either opening an example from the gallery or creating a new project ... Or we start the Project1 on WGS84 zoomed to our favorite place ... possibly the exact view we get when we send a search to Mapbox for Downtown Novato Center, Novato, CA." -- feat/first-project 8bfe1454 (port 8112): Project1 opens lat/lon at Downtown Novato with the world map OFF until you attach it (a first visit is not a request for OpenStreetMap tiles). Perry: nothing yet tells a first-time user the map can be attached
- [x] R-209 -- | "File, New Project wizard radio 1 "Geographic projection" is not approved wording. It should be "Coordinate system". Also, change "Local, schematic, or custom" to "Local, schematic, or custom coordinate system"." -- master 61806814

### Requests

- [x] R-210 -- | EPANET++: "Ask Mary to do a deep pass through EPANET Help etc to find out if we are missing anything that EPANET has, other than graphs that are already on our roadmap. Before we release as EPANET++, I want to be sure we are not behind EPANET." -- dev/agents/market-researcher/epanet-gap-audit.md: 27 HAVE, 1 PARTIAL, 8 MISSING; top gaps Full Report and Status Report, not yet roadmap tasks -- your call
- [x] R-211 -- | Theming: "Ask Ida to prepare a phased plan for our roadmap to implement/offer theming choices in Settings ... I think that preparing for this and implementing it will force us into some important code discipline." -- dev/theming-plan.md, Task 714 at 75
- [x] R-212 -- | Usage report: "I would like a URL I can visit that gives scripted views of our logs ... phase 1 is to create the URL and the script. It doesn't have to be secret, but we won't publish or link it. How about `engcalcs/spock.php` or `engcalcs/spock-cast.php`?" -- feat/usage-report 5da3e7ae (port 8110): the existing report moved to spock.php, no password, noindex, a chart pair per section; usage-report/ removed
- [x] R-213 -- | File menu: "I think that Convert coordinates as... should be the next row after Save as... There is nothing else about converting, and it's not about importing or exporting. Ask Ida about specifics." -- feat/convert-as 0693cb6d. Ida mildly disagrees (Convert as opens a NEW tab from a file, like Open), but built your way

### His retest of the 2026-09-23c fixes

- [x] R-214 -- | R-184 on master: "The problem is that now Zoom to Fit doesn't account for labels. Not all fits. We are back to week 1 of development. Maybe this works better in feat/zoom-control" -- master 61806814 (fix/zoom-fit-labels): the fit lays labels out at the target zoom, measures them, and refits until every label and leader is on screen
- [x] R-215 -- | R-162/R-201: "Not fixed on master or on feat/table-editing. No heading borders, Widths seem to be trying, but not succeeding (tighter fit on print than on screen), and the print horiz alignments are differen than the on-screen alighments (all centered except ID)." -- master 61806814 (fix/table-print2): measured in real Chrome at Letter and A4; four borders per heading, screen widths at one scale, screen alignment

### feat/zoom-control (8103)

- [x] R-216 feat/zoom-control | "(1) Zooms almost to fit. Only the scale bar obscures a label. (2) Scrolling the map to zoom doesn't reset the Zoom to fit clicks, and this is startling." -- feat/zoom-control c5eea7de: the fit clears scale bar, readouts, +/- and legends; wheel, pinch, + button and keys all reset Zoom to fit, even after it became Zoom Window

### feat/convert-as (8104)

- [x] R-217 feat/convert-as | "(1) Horiz alignment is terrible. Water depth has a glyph that throws it left. All the rounding selectors are misaligned with each other and their label heading. (2) Suffix column. Label it "Suffix" to match its tip." Later: "No Depth glyph, because it's throwing out the alighment unless you can fix that." -- feat/convert-as 0693cb6d: columns measured equal in Chrome, heading "Suffix", no depth glyph
- [x] R-218 feat/convert-as | R-188 answered: label the lat/lon choice "WGS 84 latitude/longitude (EPSG:4326)": "Yes." -- feat/convert-as 0693cb6d
- [x] R-219 feat/convert-as | R-190 answered: "We have "Ground distance per drawing unit" on Step 2 of Convert as... That can be set to 1 to use project coordinates. So I say drop it, but ensure that both 'Import' and 'Convert as ...' state clearly that files with an unreferenced EPSG coordinate system can be scaled 1:1 in Step 2 of the Convert as... wizard." -- feat/convert-as 0693cb6d: button and its two keys deleted; Import report and the Step 2 Ground distance tip carry the 1:1 note. New strings need your ruling
- [x] R-220 feat/convert-as | Untouched pre-filled Label suffixes applied to the new copy: "Yes" -- already the behaviour

### feat/table-editing (8105)

- [x] R-221 feat/table-editing | Hide these columns: "Does not work, only one column hides, and I only like this solution if it's spreadsheet-like. This would mean that entire heading cells or columns highlight and that I can use the mouse to drag through multiple columns in usual Select manner." New strings: "Hide these columns" "I didn't find this.", "Nothing in this selection can be filled down." "I didn't find this." -- feat/table-editing efeaa75a: drag across headings selects whole columns; Hide these columns hides them all. CHANGE: dragging an unselected heading now selects; drag a SELECTED heading to move a column
- [x] R-222 feat/table-editing | Table keyboard shortcuts note: "Not very likely to be read. But should be a readable list instead of a wall of text." -- feat/table-editing efeaa75a: a two-column list
- [x] R-223 feat/table-editing | Ctrl+D notice, menu shortcuts, Help > Notes: yes. The little square gone: "I didn't ask for it to go away. I asked for it to behave as advertised. I guess it's okay." Sorting: "OK on feat/table-editing."

### feat/property-venue (8106)

- [x] R-224 feat/property-venue | "it's not good that we are using different words Shut and Closed. What are the translators supposed to do? EPANET says "Closed". So we purge Shut. I know there was some argument for Shut, but let's follow EPANET." -- feat/property-venue 98613d7f: "Closed" and "Close this pipe..."; Active stays its own property
- [x] R-225 feat/property-venue | "The word "Table" is not needed. We can add a &gt; or " shown" to the "Filter in table" if you want to point to the selector." And on the string: "" shown" or " >". No word "Filter"." Changing Property also sets Property to change: "OK". -- feat/property-venue 98613d7f: [Find] [Filter in table >] [table]

### feat/label-limit (8108)

- [x] R-226 feat/label-limit | Identical rows and blank Customer box: "OK". Settings filter: "OK. But when I filter on "view zoom" or "zoom", I see a bunch of Customer settings that don't match. It seems that they are lumped together with what I am looking for." -- feat/label-limit 4bcf92ab: three Symbology field lists were filtered as one block; now row by row

### feat/offscreen-notice (8109)

- [x] R-227 feat/offscreen-notice | "OK. But there is a problem, this notice is a new style. We need good thematic design, not ad hoc styles. It's pretty, it's creative, and I like it, but we can't be going willy nilly with anything that strikes us at the moment. We have to plan and coordinate these things. This is an app." -- feat/offscreen-notice 291bd4c7: the card wears the existing neutral panel style (Ida); theming phase 1 makes it a token

### Bugs he found on master

- [x] R-228 -- | "My Elms Street Center modification has a customer that is red, and I don't know why or how that happened. Any clues? This is on master branch." -- ANSWERED: a customer is drawn red when its service connection sits exactly on a pipe END node (station 0 or 100%): snapped by a drag within ~14 px, typed 0 or 100, or attached to the node directly. Open its Properties and read "Station along the pipe (%)"; drag it off the node and it turns black. Intended, but nothing on screen says what red means
- [x] R-229 -- | "Customer default prefix should in the Settings.ID prefixes list. And it should default to C, not M." -- master 61806814: Customer row in Settings, ID prefixes, default C; projects already saved with M keep M
