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

**An ID is permanent and never reused.** Next free: R-369. (R-282 is taken on `feat/label-gang-search`.)

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

- [x] R-171 -- | When I change Base demand in Properties, Demand, Pressure etc. change on the node label, but not in Properties. -- already shipped as Task 708, 1dbc095b (2026-09-22); dev/lpn-spike/property-echo-harness.js now also covers a pipe's Flow/Velocity/Head loss (same seam) and confirms the multi-select box carries no result column to go stale.

### Task 696, the coordinate conversion wizard

- [ ] R-172 -- | (1) In Step 1, a background image gets dragged around with the map (then snaps back on release of drag) instead of always staying with the project. (2) When I finished the Convert coordinates as... wizard on the Elm Street Center example, the world map worked, but the satellite view didn't. (3) I completely missed this until now, but this wizard is out of date with our current CRS paradigm. The first thing it needs to do is ask what coordinate system we are going to. -- folded into Task 696, which stays OPEN at 100 rather than closing, because his point (3) reopens the paradigm -- feat/convert-as 483da66b: (1) fixed on the answered path, Perry measured 0.00 px mid-drag; (2) not reproduced, real satellite tiles draw on localhost (127.0.0.1 is refused by the token), awaiting your pass on 8116

## Round of 2026-09-23b -- two all-clears and the zoom-control pass

- [ ] R-182 feat/convert-as | I didn't review, but I read the menu tip, and I like where it's headed.

## Round of 2026-09-23c -- his pass over the six preview ports

### feat/convert-as (8104)

- [?] R-190 feat/convert-as | (the "These are already lat/lon" button) "I don't understand. I can't find the context. Give me more information." -- re-explained in the 2026-09-23c report; the handoff had conflated it with lpn_transform_georefed_btn
  - [TGH: Give me a file and line number.]
  - CC 2026-09-28: it no longer exists. It was `lpn_georef_asdeg_btn`, `lib/lang.ec.en.php` line 1230, in Map, World map, Attach, step 2; your R-219 (2026-09-24) retired it and commit 6778bae1 deleted it. What replaced it is the Ground distance tip, `lib/lang.ec.en.php:1383` ("Type 1 to use a file's own numbers unchanged"). Nothing to do unless you want the button back.

## feat/label-gang-search (8090)

- [ ] R-200 feat/label-gang-search | "I edited the file. Still a lot is open."

## Round of 2026-09-24 -- MOD's test, his notes, and his pass over the six preview ports

### Workflow

- [ ] R-234 -- | "Note that this is the second time that you have listed several items under "On master (pushed; you pull when ready)", which is apparently wrong and meaningless. And it's knocking me off my feet."


### feat/label-gang-search (8090)

- [ ] R-313 feat/label-gang-search | "It sounds like this was a good test, and that we were optimizing to a particular case with blinders. This is a very long project."
- [x] R-314 feat/label-gang-search | "All examples need appropriate Link and Node Before, After, Decimals, and Drop." -- feat/symbology-label 060abb3c: the seven examples no longer store their own label settings, so each opens on your table; awaiting your pass
- [?] R-315 feat/label-gang-search | "It's very sluggish. My browser froze while advancing through EPS time steps. It eventually caught up. But we may want to delay/debounce label placement unless we succeed in making it a lot faster. On the bright side, when labels stop showing, everything speeds up, indicating that, 'Yes, Virginia, maybe off really does mean off'." -- feat/label-gang-search e4bb4f3b: a step rewrites the numbers in place; placement waits 0.6 s after the clock stops and never runs during Play (24 h at 4x: 8-17 s before, ~2.6 s now). The one placement after you stop is ~2.3 s here vs ~0.5 s on master; capping the crossing repair would cut it but changes layouts. Your call
- [x] R-316 feat/label-gang-search | "There is no UI way I know of to zoom to 2x or 3x or to know what x I am zoomed to. Users don't really care about that in an app like this." -- report in his terms (what he sees), never zoom multiples
- [x] R-317 feat/label-gang-search | "There is no way for me to know what used to be missing. Sorry."
- [x] R-318 feat/label-gang-search | **"For the permanent record, a label on a leader always reads as belonging to its node.** You have repeated the misconception about this many times, and it's important that you dispel it so that we are not working to false priorities. Long leaders are only unfavored because they are inefficient and extra ink, which generally is clutter in a weak way. But a stack of labels with long and parallel leaders can be very effective." -- feat/label-gang-search 0d45f03a: your ruling is in dev/lpn-rulings.md and CLAUDE.md; three comments corrected. Two rules to rule on: a crowding tie hides the LONGEST leader first (ink is now its only reason), and a leader may not pass through another node's symbol
- [x] R-319 feat/label-gang-search | "It occurs to me that where there is infinite space east or west, we might want to recognize that infinity and leverage it by using single-line concatenation of properties." -- Task 734 at 50

## Round of 2026-09-27 -- his pass over 8119-8121 and 8090, and the open decisions

### Decisions

- [ ] R-338 feat/label-gang-search | R-315: "There appears to be serious breakage afoot with no other explanation than 'Text and symbol sizes got bigger'. Can you do a deeper inquiry into what broke label placement, and why it now takes 5 times as long as before with apparently worse results?" -- feat/label-gang-search bff8a35a: causes found and fixed (see handoff); awaiting your pass
- [ ] R-339 feat/label-gang-search | R-318: the longest leader hidden first on a crowding tie: "No." A leader may not pass through another node's symbol: "Yes." -- feat/label-gang-search 8ce9ce7c: tie rule removed (ties broken by element ID only), symbol rule kept; dev/lpn-rulings.md


### feat/symbology-label (8120)

- [ ] R-348 feat/symbology-label | "(6) Remind me to test on dev once this is merged and pushed. (7) It's a lot, and it's messy, but let's see if we can make it work."

### feat/label-gang-search (8090)

- [ ] R-351 feat/label-gang-search | "(1) Good. (2) Good. (3) It's instantaneous, unmeasurable for a human. (4) But we know that zooming and placement are broken beyond this. [his screenshot: Novato southwest, a descending gang of labels 185/183/181/179/177 with empty gaps circled between them and leaders running far from their nodes] shows gratuitous spacing, and you know that the delay is far worse than before." -- feat/label-gang-search bff8a35a: gaps closed at your zoom, 3 remain at 1.75x held by the R-075 ID reserve; awaiting your pass

## Round of 2026-09-27b -- his pass over 8120, 8121, 8090, 8123 and Task 697

- [ ] R-354 -- | "Where did we get the N/E/N/E/N/E format for the vertices list in Tables? That is not very readable. Couldn't we do something different that's multi-lingual compatible? N E | N E | N E or N{n}E{e}N{n}E{e}N{n}E{e} or N{n}E{e} N{n}E{e} N{n}E{e} or something like that?" -- feat/table-width 6f3ca7fa: n/e|n/e (a space would split a pasted cell into columns); the old form still pastes; awaiting your pass on 8124
- [ ] R-356 -- | "4.1. We need an audit of initial Table column widths. I am issuing a rule here. Set initial table column width to hold the greater (max) of (a) the known, present, current contents of the column not counting "No...." selectors or (b) the heading's longest word not counting units, with any word 8 characters or longer split into two parts for the purposes of this calculation. 4.2. Let's try making the ID column of every table centered horizontally; it's not printing beautifully yet. But the rest of the table with the aforementioned rules is beautiful." -- feat/table-width 6f3ca7fa, your rule as written; awaiting your pass on 8124
- [ ] R-357 feat/label-gang-search | On the three gaps held for a longer ID: "I reject this false dichotomy. There is infinite free space westward. No vertical space is needed for a longer id. Think or try harder. There are some flaws in our logic." -- written into dev/label-placement-rules.md (S2; the one goal), draft for his review
- [ ] R-358 feat/label-gang-search | "Speed is noticeably better. But results are terrible. See images." (no images reached the session) -- images arrived 2026-09-27 (C:\Users\tomha\Desktop\2.PNG, 3.PNG), kept in dev/screenshots/ and described in dev/label-placement-rules.md §5 as secret tests
- [ ] R-359 feat/label-gang-search | "The purpose of this branch is to rebuild our label placement system from the ground up with all constraints and strategies torn down and re-imagined in hopes of **improving speed** and **improving results**. We have devolved into a mud-wrestle with the status quo, and it is not likely to end well. Maybe we need to ask a couple of independent agents to build us a label placement system. Maybe we need to pause for a while and go metaphorically to plan mode. Let's sit on the couch and discuss this for a while to hone our priorities. Maybe you need to interview me at length before we proceed. ... (1) Use available space: Unused free space is very embarrassing; humans and all life don't do that; in real life, habitats get used. (2) Leaders are okay, but see rule 1: Leader length, even heroic leader length, is a legitimate and non-embarrassing solution to bona fide scarcity of space. As leaders grow longer, the imperative to make them parallel grows both naturally (keep them from crossing) and aesthetically (if they are almost parallel, maybe (weakly) they can be made exactly parallel). (3) Standardize labels, but see rule 1: Any given label can be single-line concatenated or multi-line as required to use available space." -- interview published this session -- written into dev/label-placement-rules.md (S2; the one goal), draft for his review
- [ ] R-360 feat/ctrl-enter | "It works. But where did this come from other than from Declan? Can Mary and Ida endorse this feature? I don't want to implement it without wide endorsement." -- Mary and Ida both endorse (their journals, 2026-09-27): Excel and Google Sheets bind this exact gesture; nothing found in WaterGEMS/EPANET either way; merge?

## Round of 2026-09-28 -- his pass over the two clean-room placers (8129 = A, 8130 = B)

- [ ] R-362 feat/label-placer-a | "Didn't use leaders a lot. That may have been a good strategy. Liked unwrapping labels. That's a good habit and maybe a good new rule. Showed lots of pipe information and less property dropping. Frankly, it's so successful that it's a lot to look at. It fails to eventually add dropped link properties on zoom in. That's a failure. I guess we have to add that as a rule. Putting them off the view resets them. It tends to put link labels gratuitously on pipes. I think it saves time by not revisiting things. But the default is beside the pipe. We failed to give a rule for repeating pipe labels. We have to build our rule set. It didn't align labels to their leader, and that is an extremely basic rule of making a leader. [...] every settings change should work in a way that is aligned and justified to the leader side, but I am seeing something like center jutification. So we need to teach it in our rules. My attitude is that anything non-controversial, we should specify in our rules, but things like open sector or open box caching are experimental, and we don't share them or specify them. Overall, I think it has some solid ideas, and this can help us refine our specs, which is the best we could have hoped for. You may want to interview it about its main methods and any network real estate modeling." [his screenshot, local only: dev/screenshots/label-placer-2026-09-28-184-centred.png, node 184's label centred on its leader] -- interview sent 2026-09-28, answers in dev/label-placer-interview-a.md
- [ ] R-363 feat/label-placer-b | "This also shows more pipe labels than I recall being in master. Also doesn't recover labels or properties on zoom in. We definitely need a rule for that. Doesn't align with pipes even when zoomed far in. Keeps what it had gratuitously long. Not embarrasing. Acceptable if it could eventually or occasionally reexamine things, like A. But lacks A's effective affinity for unwrapping. Aligns labels properly to their leader! Reluctanct to extend a leader to minimize property drops on a neighbor. And lacks A's propensity to unwrap, so this causes more properties to be dropped." -- interview sent 2026-09-28, answers in dev/label-placer-interview-b.md
- [ ] R-364 -- | "I suggest that we improve our rules based on what we learned. A did well by unwrapping node labels, so that could be a hint. B did better at recovering on zoom in, so possibly less embarrassing. I'd like to test them more, but I am not sure whether we should instead edit our rules and hit the reset button hoping to capture magic again by evolution." -- recommended 2026-09-28: interview both, write the non-controversial lessons into the rules, then a fresh clean-room pair (round 2)


## Round of 2026-09-28 -- his pass on 8124 and his merge word on 8123

- [x] R-365 feat/ctrl-enter | "your all-clear to merge Ctrl+Enter: Approved." -- all-clear pinned in dev/branch-all-clears.json
- [ ] R-366 feat/table-width | "Printing seems to always take a little more room than on-screen. Therefore a column whose values fit fine on-screen may wrap in the print. This happened to Latitude, Longitude, and Date installed (long value strings). Research how to avoid surprises like this and ensure that the width decisions account for this if it's an unavoidable fact of browser printing."
- [ ] R-367 feat/table-width | "Mixing model prints a different value than appears on-screen. I am led to wonder, if the short terms are good enough for a printout, why they aren't good enough for the UI. And if they aren't good enough for the UI, are they good enough for the printout? And what is done in translations?"
- [x] R-368 feat/table-width | "Everything else was nice."
