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

**An ID is permanent and never reused.** Next free: R-202.

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

- [ ] R-162 feat/tables-spreadsheet | Print is not respecting on-screen column widths. -- merged to master 2026-09-23 on his all-clear (R-173)
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
- [ ] R-184 feat/zoom-control | "Bug: When I click twice, then zoom to a window with two map clicks, then click Zoom to Fit, it doesn't work. This presents as a catastrophic loss because my screen is blank. To get Zoom to Fit again, I click on the map again, then click Zoom to Fit. Note that all the worse with this bug, when I fail to get Zoom to Fit and I click the button a second time, it gives me Zoom Window."

### feat/convert-as (8104)

- [ ] R-185 feat/convert-as | "This wizard may be confusing. Let's try changing "This project: Not georeferenced" to "Current: Not georeferenced" and making it plain text, not faded/gray."
- [x] R-186 feat/convert-as | "Satellite works great." -- closes R-172(2)
- [ ] R-187 feat/convert-as | "Let's turn the Round converted values section into two columns, Round converted values and Label (suffix, we can explain in a tip), so that after each of the four dropdowns we allow (and possibly pre-fill from Units) entry of a label suffix (" mm ft gpm L/sec etc)."
- [?] R-188 feat/convert-as | (on EPSG:3857 offered as "lat/lon" while stored numbers are EPSG:4326 degrees) "I don't understand. I can't find the context. Give me more information." -- re-explained in the 2026-09-23c report
- [ ] R-189 feat/convert-as | (the `$ec_lang_syn` for lpn_units_length) "Yes. "Pipe lengths, tank diameters, etc.""
- [?] R-190 feat/convert-as | (the "These are already lat/lon" button) "I don't understand. I can't find the context. Give me more information." -- re-explained in the 2026-09-23c report; the handoff had conflated it with lpn_transform_georefed_btn

### feat/table-editing (8105)

- [ ] R-191 feat/table-editing | Hide this column: "Yes. Works well. Well done. But can we select multiple heading cells to hide multiple columns at once?"
- [ ] R-192 feat/table-editing | "Ctrl+D on Pipes.From or To opens the browser Bookmark editing. It would be nice to have this documented somewhere somehow. I confess that I did not know about Ctrl+D"
- [ ] R-193 feat/table-editing | "Autofill with the little square button is yet to come? At the moment it's non-functioning and non-clickable. If it were gone (once implemented) where autofill is not offered, that would be nice."
- [x] R-194 feat/table-editing | iPhone long-press: "Sorry. I don't have an iPhone to test with." -- untested; noted, not a blocker

### feat/property-venue (8106)

- [ ] R-195 feat/property-venue | Find > Pipes > Shut > equal to > Closed: "(1) Switching away from this leaves "closed" in the Value field. (2) Switching to this doesn't add the selector for the Value field if the value is already something else (doesn't discard what's there)."
- [x] R-196 feat/property-venue | Replace a tank's lowest water depth: "Yes. A little confusing. But powerful enough to justify it."
- [ ] R-197 feat/property-venue | "Table to filter is confusing. (1) Is this offering two options or just one? In other words, is the button offering "Filter in selected table" or "Filter in active table"? (2) I think this would work better on the same line as the Find button like this: [Find][Filter in Table][tables_selector], and change/switch/push tables_selector when What to Search is changed/switched."
- [ ] R-198 feat/property-venue | "This is a little audacious, but I think we also should change/push "Property to change" when "Property" is changed since normally that is what users want, and power users can learn."

### feat/label-limit (8108)

- [ ] R-199 feat/label-limit | "Make the Customer labels and All labels zoom limits settings interfaces identical. (a) Both to have the placeholder "Always show", (not "Always show labels"). (b) Both to say "Show labels when zoomed to this map width or less". (c) Both tips to be similar to the all labels tip, but with the last sentence removed since it's misleading. (d) Both styles to use the ? glyph. (d) Both "ft" to be before the button. (e) All means all, not all except customer. Customer labels can't show alone based on zoom. We should put a qualifier in the Customer label tip that "This has no effect if it is larger than the similar setting for all labels." (f) Ensure that the words "zoom", "show", and "label" are present for filtering. (g) Peripheral issue possibly for roadmap if too hard to address here: can Settings filter work as an AND word search? I think it currently works as an entire string search. "Type a word or multiple words to see settings that mention all of them.""

### feat/label-gang-search (8090)

- [ ] R-200 feat/label-gang-search | "I edited the file. Still a lot is open."

### feat/tables-spreadsheet (on master)

- [ ] R-201 feat/tables-spreadsheet | "Print table puts heading borders only around ID." (and R-162 reopened: "Print table does not respect column widths. It expands to 100% of printable area.")
