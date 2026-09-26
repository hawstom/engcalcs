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

**An ID is permanent and never reused.** Next free: R-282.

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

- [ ] R-075 feat/label-gang-search | I am never going to be happy until I can add 12345678 to the node ID prefix without moving or hiding any of the labels shown. Any such moving or hiding is a blatant bug since adding that string **however** causes no conflicts with anything all the way to Japan. May as well not dodge it, hide it, or paper over it. Find out why it's happening and fix the bad rules.
- [ ] R-076 feat/label-gang-search | Switching to the all-round search halves the vanished labels: yes, but at what performance cost? My hope is to move as much as possible of our calculation burden to a pre-calculated model that applies across zooms, so nodes have a lookup table for where they can expect an optimal place for their label at a range of zooms.
- [ ] R-077 feat/label-gang-search | The four corner positions: I assume they are relatively cheap, and that we can record the zoom at which they are no longer effective (and clear that when Symbology or Appearance is changed?).
- [ ] R-078 feat/label-gang-search | Based on the switchboard, I guess spot route is not yet programmed since it doesn't do anything. I can't get anything to work except the checkboxes; from those it looks like corners and ring combined are producing nice results.
- [ ] R-079 feat/label-gang-search | "Publishing those gaps as a ranked list instead of a single winner is a change where it's consumed, not a new model." Do that? Or we already did?

## Round of 2026-09-21c -- his pass over the reloaded preview panel

### Placement -- the ruling that reframes the whole label job

- [ ] R-108 feat/label-gang-search | (on being told "The spots don't move; the boxes grow into each other" / "Two labels at neighbouring spots collide exactly when their half-widths together exceed the spacing between spots" / "Narrow: spacing wins, every spot stays usable. Wide: the box wins, so a wide label occupies spots it is not standing on") **"Clearly this is a bug. But you say it without batting an eyelash. If you don't understand why it's a bug, ask me. If you do, fix it. I'm just grateful that magically this endless stack happened so that I know it's possible; We just have to find out how it's possible and empower that."** -- HE IS RIGHT AND THE EXPLANATION WAS BEING OFFERED AS A DEFENCE. A placement lattice whose spacing is blind to the size of the thing being placed is a defect, not a constraint, and the narrow case working is the existence proof that a correct layout is available on that drawing. Two halves, both with the build agent: find out how the endless stack is possible and write it down, then make the wide case use the same mechanism. His acceptance test is R-075 unchanged

## Round of 2026-09-22b -- his pass over the six branches

- [ ] R-135 feat/label-gang-search | I am incredulous. You made huge progress. Long strings now barely perturb the endless stacked gang of leaders. Before moving on, I want to pick at this.
- [ ] R-136 feat/label-gang-search | While the results are very good, I still want to push on why additional string length makes any difference at all. The fact that it does leads me to suspect or at least ask for a good insight into our model since, again, there is free space all the way to Japan and beyond. I notice that with 1 character added, there is no significant additional vertical spacing in the gang. But when I add a second character, a noticeable amount of additional gaps appear in the vertical stack. As I add more characters, results oscillate, but the general trend is that the gang's leader trend longer and longer, meaning that the top label of this descending gang is eventually gratuitously 20 text heights away from its node. While I am tempted to rationalize that this is an artifact of keeping the leaders near parallel, that's wrong because with no characters or 1 character, the top label is only gratuitously about 8 text heights below (south of) its node. That said, to say this is partly to quibble since our placements are quite good now, and we really should be focusing on efficiency and performance.
- [ ] R-137 feat/label-gang-search | Moving to a different test case than that notorious southwest area, let's look at the northwest area with three properties turned on and we are zoomed in closer. [his screenshot: labels for nodes 120 and 25x at A, well away from their nodes; empty ground at B, nearer them] A human would have slid the two labels at A toward B, shortening the leaders without any bad effects. Could our algorithm be smart enough not to be gratuitously distant like this?

### feat/label-gang-search

- [ ] R-163 feat/label-gang-search | Things have changed so much that I am disoriented. This may be good to undo.
- [ ] R-164 feat/label-gang-search | I am seeing dropping when I would have preferred to see longer leaders.
- [ ] R-165 feat/label-gang-search | Here is a strange example where (a) we could have had all requested properties and (b) we could have had a shorter leader.

### Calculation and time steps

- [ ] R-171 -- | When I change Base demand in Properties, Demand, Pressure etc. change on the node label, but not in Properties.

### Task 696, the coordinate conversion wizard

- [ ] R-172 -- | (1) In Step 1, a background image gets dragged around with the map (then snaps back on release of drag) instead of always staying with the project. (2) When I finished the Convert coordinates as... wizard on the Elm Street Center example, the world map worked, but the satellite view didn't. (3) I completely missed this until now, but this wizard is out of date with our current CRS paradigm. The first thing it needs to do is ask what coordinate system we are going to. -- folded into Task 696, which stays OPEN at 100 rather than closing, because his point (3) reopens the paradigm

## Round of 2026-09-23b -- two all-clears and the zoom-control pass

- [ ] R-182 feat/convert-as | I didn't review, but I read the menu tip, and I like where it's headed.

## Round of 2026-09-23c -- his pass over the six preview ports

### feat/convert-as (8104)

- [?] R-190 feat/convert-as | (the "These are already lat/lon" button) "I don't understand. I can't find the context. Give me more information." -- re-explained in the 2026-09-23c report; the handoff had conflated it with lpn_transform_georefed_btn
  - [TGH: Sorry I still don't understand. Where is this?]

### feat/table-editing (8105)

- [ ] R-193 feat/table-editing | "Autofill with the little square button is yet to come? At the moment it's non-functioning and non-clickable. If it were gone (once implemented) where autofill is not offered, that would be nice." -- feat/table-editing fd604304: the square was decoration only; removed. Drag-to-fill is a separate build

### feat/label-gang-search (8090)

- [ ] R-200 feat/label-gang-search | "I edited the file. Still a lot is open."

## Round of 2026-09-24 -- MOD's test, his notes, and his pass over the six preview ports

### MOD's first-use test (2026-09-23)

- [ ] R-202 -- | MOD could not find fire flow analysis; he clicked the map, then the toolbar, accidentally invoked New project, and found it under Water. His suggestion: "make the menus (tabs) a color that stands out like on a phone app ... and enlarged, icons too." TGH: "I'm kind of excited to see it either solid blue (very phone-like) or rounded blue outlined for every "button". It seems that the world has left the "menus" paradigm behind. Maybe Ida can comment on that." -- folded into Task 714 phase 1 (Ida: one button base and one accent colour for menu items and toolbar buttons, previewed on a branch). Build the preview branch? -- your go -- feat/menu-button a82d32f5 (port 8114), menus only, solid blue; ?menustyle=outline for the outlined one
  - [TGH 2026-09-25: "I think Ida misunderstood. Every tester so far has been very slow to find the menus, **not the toolbars**. Promoting the menus and toolbar equally is counterproductive. Make me a preview branch, and lets try colors only for now. I lean toward a button look with our thematic blue rounded rectangles, but I leave it to you to surprise me."]
- [x] R-208 -- | "The default Project1 tab has a path of frustration. If a user tries to attached the world map, it tells him that can't be done without any network. I think that the first-time experience needs to avoid that empty Project1 tab by funneling the user into either opening an example from the gallery or creating a new project ... Or we start the Project1 on WGS84 zoomed to our favorite place ... possibly the exact view we get when we send a search to Mapbox for Downtown Novato Center, Novato, CA." -- feat/first-project 8bfe1454 (port 8112): Project1 opens lat/lon at Downtown Novato with the world map OFF until you attach it (a first visit is not a request for OpenStreetMap tiles). Perry: nothing yet tells a first-time user the map can be attached -- merged, master 017ee4de

### feat/convert-as (8104)

- [x] R-219 feat/convert-as | R-190 answered: "We have "Ground distance per drawing unit" on Step 2 of Convert as... That can be set to 1 to use project coordinates. Ensure that both 'Import' and 'Convert as ...' state clearly that files with an EPSG coordinate system that simply needs to be referenced/located can be scaled 1:1 in Step 2 of the Convert as... wizard." -- feat/convert-as 0693cb6d: button and its two keys deleted; Import report and the Step 2 Ground distance tip carry the 1:1 note. New strings need your ruling -- merged, master 017ee4de
  -  [TGH 2026-09-24: In the import report, change the coordinate system paragraph as follows: "EPANET files contain no coordinate system, so this file will not initially be georeferenced. To place it on a world map, use Map, World map… To convert its coordinates, use File, Convert as…"]

## Round of 2026-09-25 -- IOD's test, Net3 fire flow, and his pass over the ten branches

### Real-world use (IOD, senior civil engineer; `dev/real-world-reviews.md`)

- [x] R-230 -- | "He said we need to make migration from WaterCAD easy. This means interoperability. This means import WaterCAD files. This means to study the WaterCAD features and interface. Can Mary help with that. Do we need a dedicated WaterCAD expert, or would that be Sue from her previous job? Or is Sue a migrator from WaterCAD? What story do we need to tell, and is it even possible to do this without my buying WaterCAD or getting a demo or watching videos (hopefully not)?" -- Mary and Sue briefed 2026-09-25 -- Mary: dev/agents/market-researcher/watercad-migration.md; Sue: her journal. Both: no WaterCAD-expert seat; one WaterCAD-exported .inp from IOD is the next step

### Workflow

- [ ] R-234 -- | "Note that this is the second time that you have listed several items under "On master (pushed; you pull when ready)", which is apparently wrong and meaningless. And it's knocking me off my feet."

### feat/zoom-control (8103)

- [?] R-235 feat/zoom-control | "Zooming keeps a half-drawn Zoom Window box: I don't know what this means." -- explained back in the 2026-09-25 report
- [ ] R-236 feat/zoom-control | "Zoom to fit pressed before results arrive runs once more when they land: I think this is what I forbade." -- being removed -- feat/zoom-control dc1fa5a9, awaiting your pass

### feat/convert-as (8104)

- [x] R-237 feat/convert-as | "(1) All coordinate systems must have their unmodified names, and all coordinate systems must be available. (a) Currently WGS 84 (EPSG:4326) is missing from the options. (b) Currently WGS 84 / Pseudo-Mercator (EPSG:3857) has "(no map)" after its name, which I don't understand. (2) Tips at Convert as > Coordinate System > (a) EPSG coordinate system should stay as is, but with the string latitude/longitude removed. (b) Unnamed (local) georeference should stay as is, but end at "map attached." (c) Not georeferenced should stay as is, but add " for now" at the end. (3) The Geographic projection sub-box: (a) Box title should be "Coordinate system". Its tip is non-functional or empty. (b) Tip for Filter by map view should have "coordinate systems" replace "projections". (c) Projection name filter and its tip Should have "projection" replaced with "coordinate system". And let's remove the second sentence. (d) The message at the bottom is nonsense to me. End it after IOGP." -- feat/convert-as 47649c32, awaiting your pass -- merged, master 017ee4de
- [x] R-238 feat/convert-as | "Units look good except that we really should fix our missing Water depth coverage instead of disabling Water depth here." -- feat/convert-as: tank Water depth is a label now; awaiting your pass -- merged, master 017ee4de

### feat/table-editing (8105)

- [ ] R-239 feat/table-editing | "There is a troublesome conflict between clicking on a column heading text to sort and clicking on a column heading to select. Is there a better way we can do this? ... Is there a conventional glyph and gesture for sort, maybe including a hover revelation?" -- Ida asked
- [ ] R-240 feat/table-editing | "Add "Show all" to the heading right-click menu. Or maybe what we really need is a Manage columns command/box that has checkboxes for Show."
- [ ] R-241 feat/table-editing | "Sorry I can't get a column to drag. I think it's the right thing to have. What I think is wrong is the ability to select the heading text ... Maybe a three dots menu for sorting and hiding. Maybe a grab cursor somewhere for dragging. I honestly don't know."

### feat/property-venue (8106)

- [x] R-242 feat/property-venue | "I think what is simplest and closest to what we have is a simple "Filter in table" button with a tip 'Hide rows that do not match this query in the Table(s) that match "What to search" above. Nothing is deleted.' What's your advice on that? I think it implies that we filter all tables insofar as we can if "Everything" is selected." -- feat/property-venue b8733c5d, built as you proposed; awaiting your pass -- merged, master 017ee4de

### feat/first-project (8112)

- [x] R-243 feat/first-project | "Very bad. I hit escape on the gallery, add some nodes, and click Zoom to fit. Nothing appears ... Map, World map, Attach ... It doesn't work. Nothing appears ... this time I zoom a bit; a map appears at Novato, CA. But we need to have this visible on first load behind the gallery. I think we can suppress any disclosure at this time because it is a standard app request instead of a user request; what do you think?" -- feat/first-project f775f0a6: street map on at first load; privacy.php changed; landing page claim needs your ruling -- merged, master 017ee4de
- [x] R-244 feat/first-project | "The status bar says "WGS 84 / Pseudo-Mercator (EPSG:3857), but the coordinates are lat/lon. Isn't that wrong? Isn't EPSG:3857 meters?" -- feat/first-project: WGS 84 (EPSG:4326) -- merged, master 017ee4de

### Customer

- [ ] R-245 -- | "Red for node-connected Customers is a bad decision. Let's leave it black." -- feat/customer-node cd7640b1, awaiting your pass
- [ ] R-246 -- | "Do we have Customers not allowed to connect directly to nodes? I think it will be happier for users to see Customer connected to a node if that is the case instead of a link at station 0." -- feat/customer-node cd7640b1, awaiting your pass
- [ ] R-247 -- | "Customer symbols appear to be 0.2 * Junction size. It's too small. Let's try 0.25 * Junction size or raise it another `0.05 *` from where it is." -- feat/customer-node cd7640b1, awaiting your pass

## Round of 2026-09-25, second pass -- his pass over the preview ports

### Workflow

- [x] R-248 -- | "You told me 'After you pull, run: ... git worktree remove ../../worktrees/...' That is partly misinformed since there is no such path at the production server, and there are no worktrees there. This bad advice has happened before. What can I do to prevent it? Am I giving you too much? As for the worktrees, of course you can clean them up on local dev." -- worktrees removed on local dev 2026-09-25; the handoff now says local housekeeping is never handed to him

### feat/first-project (8112)

- [x] R-249 feat/first-project | "On the gallery welcome, end it 'Or start here'. With that, we can close, merge, and delete the branch. Nice work." -- feat/first-project 8aa04872 -- merged, master 017ee4de
- [x] R-250 -- | Decision: "Street map on at first load: Yes." -- landing pages and CLAUDE.md reworded to match -- street map on; librewaternet.org eef380e, not-epanet.org a058b5d, privacy.php and CLAUDE.md say so

### feat/convert-as (8104)

- [x] R-251 feat/convert-as | "For Water depth, initial default prefix can be 'Y='. With that, we can close, merge, and delete the branch. Nice work!" -- merged, master 017ee4de
- [x] R-252 feat/convert-as | On lpn_convas_label_tip: "Did we prefill with a space? I believe that SI uses no space and US uses a space." -- the prefill is always one space. The SI Brochure and NIST SP 811 both put a space between number and unit symbol ("10 mm"), so one space is right for SI and US alike. Keep it?
  - [TGH 2026-09-26: "OK." One space stays.]
- [?] R-253 feat/convert-as | On lpn_convas_no_transform: "I need context. I don't know what this is trying to say, what was found, and what's the failure. What, specifically, is 'that coordinate system'?" -- it fires when a chosen EPSG system has no transform in this page's catalogue; reworded to name it: "This page has no coordinate transform for {crs}, ..." -- merged, awaiting your ruling

### feat/table-editing (8105)

- [ ] R-254 feat/table-editing | "We aren't where we need to be yet, and I think we are still searching for a paradigm for the headings. Did Ida give any help? I envision (a) No selectable text; there is only one selection possible of and one cursor for a heading (except the vertical dots menu), and that is the entire cell. Instead, the only thing selectable is the text, and that's misleading since these are immutable headings analogous to a spreadsheet A, B, C, etc. (b) A menu glyph, likely three vertical dots or whatever you recommend, possibly with Ida's advice." -- feat/table-editing: whole cell is one target, click selects the column, ⋮ glyph opens the menu; awaiting your pass
- [ ] R-255 feat/table-editing | "We currently have a problem with a sort arrow in the middle of the cell conflicting with the heading text. I suppose that should go." -- feat/table-editing: mid-cell arrow removed
- [ ] R-256 feat/table-editing | "We currently have schizophrenia about sorting. Is it with a menu or by clicking on an arrow? I think that an arrow could be fine if we fixed (1)(a). I am not sure where the arrow would/should go. Maybe just below the menu." -- feat/table-editing: sort from the ⋮ menu; the sorted column shows an arrow under the ⋮ that reverses it
- [ ] R-257 feat/table-editing | "I like the Manage columns box, but it's not working very well. (a) It's sluggish, possibly because it waits for the table to respond in real time, where it could (should?) do nothing until OK. (b) I love it for Show/hide. But I am not sure it's the right solution for column order ... (i) Highlight a group of columns honoring Ctrl and Shift, then use move up, move down, move to beginning, and move to end buttons outside the list to move the entire selection. This is solid and efficient. (ii) Drag with mouse. This looks more cool, but is probably harder to program, and probably would make Declan less happy than (i)." -- feat/table-editing: Manage columns applies only on OK; select rows with Ctrl/Shift; Move up, Move down, Move to beginning, Move to end outside the list
- [x] R-258 feat/table-editing | "Ctrl+Space on a cell works, but I can't figure out how it would be useful." -- kept: it is the keyboard way to do what clicking a heading now does (select the column, then Ctrl+C, Ctrl+D or hide), as in Excel and Google Sheets. Drop it?
  - [TGH 2026-09-26: "Let's remove it and park it in our roadmap. 'More trouble to debug than the feature is worth.'" -- removed on feat/table-editing; parked as Task 730]
- [ ] R-259 feat/table-editing | "make the Print table PDF name more useful, like {project}-{table}.pdf" -- feat/table-editing: Print table suggests {project}-{table}.pdf

### feat/property-venue (8106) -- his heading said feat/table-editing; the Find content is this branch

- [x] R-260 feat/property-venue | "I found a curiosity. Edit, Find, Everyting, ID, empty finds Junctions Lake and River. But those IDs are not empty. Fix or put in roadmap." -- not reproduced on the merged code: Everything, ID, is empty finds only Text items on Net3-Novato. Which project was open? A retest after you pull would settle it
  - [TGH 2026-09-26: "You are right. It found text 'LAKE' and 'RIVER'. My bad." -- they are Text items with no ID; nothing to fix]
- [x] R-261 feat/property-venue | "It works! We can close, merge, and delete the branch. Nice work." -- merged, master 017ee4de
- [x] R-262 feat/property-venue | On lpn_find_filter_none, rewritten to "This query doesn't apply to any table.": "Is this even possible?" -- yes, rarely: a typed query naming a node-only and a link-only property together fits no single table
  - [TGH 2026-09-26: "OK."]

### feat/zoom-control (8103)

- [ ] R-263 feat/zoom-control | "Some label placements cause Zoom to Fit to leave too much padding." [his screenshot: Novato, labels pulled out by leaders; about a third of the width wasted on each side] -- feat/zoom-control 43902998: one cause fixed (a fit that hid labels kept room for them); your exact screenshot not reproduced, see the report
- [ ] R-264 feat/zoom-control | "A possibly related bug makes labels being dragged jump double distance (twice as far at the cursor location) at unpredictable locations as they are being dragged away. What's predictable is that the label is twice as far as the cursor. What's unpredictable is at what point they jump from being at the cursor to being twice as distant." -- feat/zoom-control 43902998: the dragged label leapt to 2.2x its leader; fixed
- [ ] R-265 feat/zoom-control | "The + and - button tips both have their action repeated. Use this form: 'Zoom in. Shortcut: +'." -- feat/zoom-control 43902998: exactly your words
- [x] R-266 feat/zoom-control | "The zoom window can be very nice for some users. ... 'Don't zoom again after results' seems to work fine." -- nothing to build

### feat/customer-node (8113)

- [ ] R-267 feat/customer-node | "Customer zindex is higher than Junction. Fix that. Make it just less than link?" -- feat/customer-node 105d9f68: customers draw under links and junctions; a click on the junction under a selected customer's grip opens the junction
- [ ] R-268 feat/customer-node | "We didn't account for vertices. If we are in the no-perp region outside a vertex, we need to connect at the vertex. And we need to allow dragging a customer to this region while intelligently tracking onto the vertex while appropriate. (Currently the Customer is banned/prohibited from this region.)" -- feat/customer-node 105d9f68: outside a bend the customer connects at the bend, and a drag tracks onto it and off again
- [ ] R-269 feat/customer-node | "At the risk of being boring, let's [set] the Text size and Symbol size=12 and the Link line thickness=4 for all example projects. This will be more usable for shoppers." -- feat/customer-node 105d9f68: all 7 examples
- [ ] R-270 feat/customer-node | "Change the language 'Link line thickness' to 'Link line width'." -- feat/customer-node 105d9f68

### feat/menu-button (8114)

- [ ] R-271 feat/menu-button | "I love the outlined version, and they are reminiscent of diazo prints (blueprints). I agree with leaving the toolbar black. I thought we were deprecating the tip 'Start with the menus...'." -- feat/menu-button eceab3ab: outlined only; the cue was already deleted on master and is gone from the branch after merging master

### Fire flow

- [x] R-272 -- | "Remember that I am testing locally almost always. I am not pulling to test. ... We can close, merge, and delete the branch." -- fix/fireflow-eps was already merged (f9ebf891); branch and worktree deleted 2026-09-25

### WaterCAD and EPANET, his notes

- [x] R-273 -- | WaterCAD: "File menu: Recents just above Exit." "We have three import items. It's probably time for an Import sub-menu." "Background layers: This seems like a GIS REST server offering." "One quality of life feature they have that we could add is a Junction and Pipe toolbar command that adds Junction, Pipe, Junction, Pipe, etc until escape." "I like the layered scenario alternatives paradigm ... What seems very welcoming is the set of pre-configured scenarios and the ironclad rule that you are always editing only the specific data layers (Alternatives) mapped to that Active Scenario." "I like change/revision tracking very cool." -- Tasks 718-723
- [x] R-274 -- | EPANET: "Inset map: Correction, that is our task 146.09. Ensure that it includes the key words 'inset' and 'overview'." "Multi-species MSX: Add it priority 50. I don't understand it, but we can learn. Thank you, Mary!" -- 146.09 retitled "An inset overview map"; Task 717 at 50

## Round of 2026-09-26 -- merges, and feat/table-editing's third and fourth passes

- [x] R-275 -- | "8103 zoom-control: Merge", "8113 customer-node: Merge. Nice!", "8114 menu-button: Merge.", "8115 reports: Merge. Very nice. And the file name was good." -- merged; production 83bf02d5
- [x] R-276 -- | "Can you copy the 'Zoom in to see labels' text from the ungeoreferenced Net3 to the lat/lon Net3? Remove the 'Zoom to see labels' text from the Net2 example." -- master 3a4bb054, fccaaa67
- [ ] R-277 feat/table-editing | "(1) The headings text is still acting like text ... (a) No hover shading, (b) No cursor change. (2) Sorting still feels schizophrenic. Either the dots or the arrow, not both ... Possibly the arrow and the menu can take up zero space and appear with 100% opacity over any heading text on hover. (3) ... remove the sort rows from the column menu. (4) Remove the itemized Show {column} rows ... Leave only Hide this, Show all, and Manage." -- feat/table-editing acdbe7f8, awaiting your pass
- [ ] R-278 feat/table-editing | "I still see special highlighting on the text." [his screenshot: a box round 'Longitude'] -- 410ddadc: the ring is on the whole cell
- [ ] R-279 feat/table-editing | "The shortcuts note is really good ... 'See Help, Notes for keyboard shortcuts.'" at the end of the table tab tips -- 410ddadc
- [ ] R-280 feat/table-editing | "Dragging a column: (1) This is unusably sluggish. (2) I lose the grab cursor ... so drag is blind. (3) The grab cursor is a pointer on the heading text." -- 410ddadc: a ghost follows the pointer, a marker shows the landing, the grabbing cursor holds page-wide; per-move cost measured at 0.02 ms, so the sluggish feel was the missing feedback
- [x] R-281 feat/table-editing | "This is a long-haul feature. Spreadsheet editing is not a caprice." Stay the course: click selects, drag moves. -- recorded in the handoff

### Rulings recorded, nothing to build

- File menu: "Convert as..." stays where it is ("The problem with putting it near open is that implies we are going to go get a file").
- EPANET audit: "Make the reports roadmap tasks before EPANET++. I'd like to know the full list of what we are missing."
- feat/label-limit, feat/offscreen-notice, feat/usage-report, feat/select-on-focus: "Close, merge, and delete branch."
- Strings: "The selected junctions"; "{n} selected elements are not junctions, so they were not tested." -- "OK."
