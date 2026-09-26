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

**An ID is permanent and never reused.** Next free: R-248.

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
- [x] R-144 feat/notice-log | I like the down arrow glyph. -- the clock drawing reads to him as a down arrow / Expand glyph, and he likes it: KEEP IT, do not redraw the hands

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

### feat/property-venue (8106)

- [ ] R-197 feat/property-venue | "Table to filter is confusing. (1) Is this offering two options or just one? In other words, is the button offering "Filter in selected table" or "Filter in active table"? (2) I think this would work better on the same line as the Find button like this: [Find][Filter in Table][tables_selector], and change/switch/push tables_selector when What to Search is changed/switched." -- feat/property-venue 1066860e: one row [Find][Filter in Table] Table [selector]; "Table to filter" shortened to "Table", which is OUR word and needs yours
  - [TGH 2026-09-24: We lost the selector now.]

### feat/label-gang-search (8090)

- [ ] R-200 feat/label-gang-search | "I edited the file. Still a lot is open."

## Round of 2026-09-24 -- MOD's test, his notes, and his pass over the six preview ports

### MOD's first-use test (2026-09-23)

- [ ] R-202 -- | MOD could not find fire flow analysis; he clicked the map, then the toolbar, accidentally invoked New project, and found it under Water. His suggestion: "make the menus (tabs) a color that stands out like on a phone app ... and enlarged, icons too." TGH: "I'm kind of excited to see it either solid blue (very phone-like) or rounded blue outlined for every "button". It seems that the world has left the "menus" paradigm behind. Maybe Ida can comment on that." -- folded into Task 714 phase 1 (Ida: one button base and one accent colour for menu items and toolbar buttons, previewed on a branch). Build the preview branch? -- your go -- feat/menu-button a82d32f5 (port 8114), menus only, solid blue; ?menustyle=outline for the outlined one
  - [TGH 2026-09-25: "I think Ida misunderstood. Every tester so far has been very slow to find the menus, **not the toolbars**. Promoting the menus and toolbar equally is counterproductive. Make me a preview branch, and lets try colors only for now. I lean toward a button look with our thematic blue rounded rectangles, but I leave it to you to surprise me."]
- [x] R-203 -- | "Our hint above the toolbar didn't help him. He suggested maybe a colored light bulb glyph. But I think that is a feeble attempt to rescue an attempt that isn't working." -- Ida agrees: retire the hint, no light bulb; she would delete it when R-202's button style ships. Delete it now instead? -- deleted on master 61fa16f4 (fix/menu-cue)
  - [TGH 2026-09-25: "Delete the toolbar hint. It failed."]
- [ ] R-208 -- | "The default Project1 tab has a path of frustration. If a user tries to attached the world map, it tells him that can't be done without any network. I think that the first-time experience needs to avoid that empty Project1 tab by funneling the user into either opening an example from the gallery or creating a new project ... Or we start the Project1 on WGS84 zoomed to our favorite place ... possibly the exact view we get when we send a search to Mapbox for Downtown Novato Center, Novato, CA." -- feat/first-project 8bfe1454 (port 8112): Project1 opens lat/lon at Downtown Novato with the world map OFF until you attach it (a first visit is not a request for OpenStreetMap tiles). Perry: nothing yet tells a first-time user the map can be attached

### Requests

- [x] R-210 -- | EPANET++: "Ask Mary to do a deep pass through EPANET Help etc to find out if we are missing anything that EPANET has, other than graphs that are already on our roadmap. Before we release as EPANET++, I want to be sure we are not behind EPANET." -- dev/agents/market-researcher/epanet-gap-audit.md: 27 HAVE, 1 PARTIAL, 8 MISSING; top gaps Full Report and Status Report, not yet roadmap tasks -- your call
  - [TGH 2026-09-24: Add. And list for me all the features we are missing.]

### feat/convert-as (8104)

- [ ] R-219 feat/convert-as | R-190 answered: "We have "Ground distance per drawing unit" on Step 2 of Convert as... That can be set to 1 to use project coordinates. Ensure that both 'Import' and 'Convert as ...' state clearly that files with an EPSG coordinate system that simply needs to be referenced/located can be scaled 1:1 in Step 2 of the Convert as... wizard." -- feat/convert-as 0693cb6d: button and its two keys deleted; Import report and the Step 2 Ground distance tip carry the 1:1 note. New strings need your ruling
  -  [TGH 2026-09-24: In the import report, change the coordinate system paragraph as follows: "EPANET files contain no coordinate system, so this file will not initially be georeferenced. To place it on a world map, use Map, World map… To convert its coordinates, use File, Convert as…"]

## Round of 2026-09-25 -- IOD's test, Net3 fire flow, and his pass over the ten branches

### Real-world use (IOD, senior civil engineer; `dev/real-world-reviews.md`)

- [x] R-230 -- | "He said we need to make migration from WaterCAD easy. This means interoperability. This means import WaterCAD files. This means to study the WaterCAD features and interface. Can Mary help with that. Do we need a dedicated WaterCAD expert, or would that be Sue from her previous job? Or is Sue a migrator from WaterCAD? What story do we need to tell, and is it even possible to do this without my buying WaterCAD or getting a demo or watching videos (hopefully not)?" -- Mary and Sue briefed 2026-09-25 -- Mary: dev/agents/market-researcher/watercad-migration.md; Sue: her journal. Both: no WaterCAD-expert seat; one WaterCAD-exported .inp from IOD is the next step

### Fire flow and Net3 Pump 10

- [x] R-231 -- | "Pump 10 is initially closed, making the pressure at node 10 -0.64 psi. But the pump opens at time step 1 ... I see that head and pressure jump at time 1. But the link still shows as closed, and Properties and Tables shows it as closed." -- fix/fireflow-eps -- merged, master f9ebf891
- [x] R-232 -- | "Fire flow analysis says that it works on the current time step, and its results **do** vary. But the static pressure for Junction 10 never matches the map pressure, and it's always significantly lower ... it seems clear to me that the static pressure for all hydrants should match the map." (Elm Street Center matched.) -- fix/fireflow-eps -- merged, master f9ebf891
- [x] R-233 -- | "I think that area selection and multi-selection succeeded fire flow analysis and fire flow analysis does not know how to handle multiple selected hydrants. Check and fix that." -- fix/fireflow-eps -- merged, master f9ebf891

### Workflow

- [ ] R-234 -- | "Note that this is the second time that you have listed several items under "On master (pushed; you pull when ready)", which is apparently wrong and meaningless. And it's knocking me off my feet."

### feat/zoom-control (8103)

- [?] R-235 feat/zoom-control | "Zooming keeps a half-drawn Zoom Window box: I don't know what this means." -- explained back in the 2026-09-25 report
- [ ] R-236 feat/zoom-control | "Zoom to fit pressed before results arrive runs once more when they land: I think this is what I forbade." -- being removed -- feat/zoom-control dc1fa5a9, awaiting your pass

### feat/convert-as (8104)

- [ ] R-237 feat/convert-as | "(1) All coordinate systems must have their unmodified names, and all coordinate systems must be available. (a) Currently WGS 84 (EPSG:4326) is missing from the options. (b) Currently WGS 84 / Pseudo-Mercator (EPSG:3857) has "(no map)" after its name, which I don't understand. (2) Tips at Convert as > Coordinate System > (a) EPSG coordinate system should stay as is, but with the string latitude/longitude removed. (b) Unnamed (local) georeference should stay as is, but end at "map attached." (c) Not georeferenced should stay as is, but add " for now" at the end. (3) The Geographic projection sub-box: (a) Box title should be "Coordinate system". Its tip is non-functional or empty. (b) Tip for Filter by map view should have "coordinate systems" replace "projections". (c) Projection name filter and its tip Should have "projection" replaced with "coordinate system". And let's remove the second sentence. (d) The message at the bottom is nonsense to me. End it after IOGP." -- feat/convert-as 47649c32, awaiting your pass
- [ ] R-238 feat/convert-as | "Units look good except that we really should fix our missing Water depth coverage instead of disabling Water depth here." -- feat/convert-as: tank Water depth is a label now; awaiting your pass

### feat/table-editing (8105)

- [ ] R-239 feat/table-editing | "There is a troublesome conflict between clicking on a column heading text to sort and clicking on a column heading to select. Is there a better way we can do this? ... Is there a conventional glyph and gesture for sort, maybe including a hover revelation?" -- Ida asked
- [ ] R-240 feat/table-editing | "Add "Show all" to the heading right-click menu. Or maybe what we really need is a Manage columns command/box that has checkboxes for Show."
- [ ] R-241 feat/table-editing | "Sorry I can't get a column to drag. I think it's the right thing to have. What I think is wrong is the ability to select the heading text ... Maybe a three dots menu for sorting and hiding. Maybe a grab cursor somewhere for dragging. I honestly don't know."

### feat/property-venue (8106)

- [ ] R-242 feat/property-venue | "I think what is simplest and closest to what we have is a simple "Filter in table" button with a tip 'Hide rows that do not match this query in the Table(s) that match "What to search" above. Nothing is deleted.' What's your advice on that? I think it implies that we filter all tables insofar as we can if "Everything" is selected." -- feat/property-venue b8733c5d, built as you proposed; awaiting your pass

### feat/first-project (8112)

- [ ] R-243 feat/first-project | "Very bad. I hit escape on the gallery, add some nodes, and click Zoom to fit. Nothing appears ... Map, World map, Attach ... It doesn't work. Nothing appears ... this time I zoom a bit; a map appears at Novato, CA. But we need to have this visible on first load behind the gallery. I think we can suppress any disclosure at this time because it is a standard app request instead of a user request; what do you think?" -- feat/first-project f775f0a6: street map on at first load; privacy.php changed; landing page claim needs your ruling
- [ ] R-244 feat/first-project | "The status bar says "WGS 84 / Pseudo-Mercator (EPSG:3857), but the coordinates are lat/lon. Isn't that wrong? Isn't EPSG:3857 meters?" -- feat/first-project: WGS 84 (EPSG:4326)

### Customer

- [ ] R-245 -- | "Red for node-connected Customers is a bad decision. Let's leave it black." -- feat/customer-node cd7640b1, awaiting your pass
- [ ] R-246 -- | "Do we have Customers not allowed to connect directly to nodes? I think it will be happier for users to see Customer connected to a node if that is the case instead of a link at station 0." -- feat/customer-node cd7640b1, awaiting your pass
- [ ] R-247 -- | "Customer symbols appear to be 0.2 * Junction size. It's too small. Let's try 0.25 * Junction size or raise it another `0.05 *` from where it is." -- feat/customer-node cd7640b1, awaiting your pass

### Rulings recorded, nothing to build

- File menu: "Convert as..." stays where it is ("The problem with putting it near open is that implies we are going to go get a file").
- EPANET audit: "Make the reports roadmap tasks before EPANET++. I'd like to know the full list of what we are missing."
- feat/label-limit, feat/offscreen-notice, feat/usage-report, feat/select-on-focus: "Close, merge, and delete branch."
