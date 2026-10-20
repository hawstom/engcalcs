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

**An ID is permanent and never reused.** Next free: R-421. (R-282 is taken on `feat/label-gang-search`.)

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

- [x] R-075 feat/label-gang-search | I am never going to be happy until I can add 12345678 to the node ID prefix without moving or hiding any of the labels shown. Any such moving or hiding is a blatant bug since adding that string **however** causes no conflicts with anything all the way to Japan. May as well not dodge it, hide it, or paper over it. Find out why it's happening and fix the bad rules. -- feat/label-placer c6ce82b4 ("R-075 rewritten"); his own words, 2026-09-28, on being told the strict test still failed at 67%/66%: *"The test is faulty. Their behavior is gold. See if you can rewrite the test. And we should have a test for link label alignment since that seems to be elusive with all four; actually that indicates a rule flaw. Do we need to examine the rules again?"*
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

### Task 696, the coordinate conversion wizard

- [ ] R-172 -- | (1) In Step 1, a background image gets dragged around with the map (then snaps back on release of drag) instead of always staying with the project. (2) When I finished the Convert coordinates as... wizard on the Elm Street Center example, the world map worked, but the satellite view didn't. (3) I completely missed this until now, but this wizard is out of date with our current CRS paradigm. The first thing it needs to do is ask what coordinate system we are going to. -- folded into Task 696, which stays OPEN at 100 rather than closing, because his point (3) reopens the paradigm -- feat/convert-as 483da66b: (1) fixed on the answered path, Perry measured 0.00 px mid-drag; (2) not reproduced, real satellite tiles draw on localhost (127.0.0.1 is refused by the token), awaiting your pass on 8116

## Round of 2026-09-23b -- two all-clears and the zoom-control pass

- [ ] R-182 feat/convert-as | I didn't review, but I read the menu tip, and I like where it's headed.

## feat/label-gang-search (8090)

- [ ] R-200 feat/label-gang-search | "I edited the file. Still a lot is open."

## Round of 2026-09-24 -- MOD's test, his notes, and his pass over the six preview ports

### Workflow

- [ ] R-234 -- | "Note that this is the second time that you have listed several items under "On master (pushed; you pull when ready)", which is apparently wrong and meaningless. And it's knocking me off my feet."


### feat/label-gang-search (8090)

- [ ] R-313 feat/label-gang-search | "It sounds like this was a good test, and that we were optimizing to a particular case with blinders. This is a very long project."
- [?] R-315 feat/label-gang-search | "It's very sluggish. My browser froze while advancing through EPS time steps. It eventually caught up. But we may want to delay/debounce label placement unless we succeed in making it a lot faster. On the bright side, when labels stop showing, everything speeds up, indicating that, 'Yes, Virginia, maybe off really does mean off'." -- feat/label-gang-search e4bb4f3b: a step rewrites the numbers in place; placement waits 0.6 s after the clock stops and never runs during Play (24 h at 4x: 8-17 s before, ~2.6 s now). The one placement after you stop is ~2.3 s here vs ~0.5 s on master; capping the crossing repair would cut it but changes layouts. Your call
- [x] R-316 feat/label-gang-search | "There is no UI way I know of to zoom to 2x or 3x or to know what x I am zoomed to. Users don't really care about that in an app like this." -- report in his terms (what he sees), never zoom multiples
- [x] R-317 feat/label-gang-search | "There is no way for me to know what used to be missing. Sorry."
- [x] R-318 feat/label-gang-search | **"For the permanent record, a label on a leader always reads as belonging to its node.** You have repeated the misconception about this many times, and it's important that you dispel it so that we are not working to false priorities. Long leaders are only unfavored because they are inefficient and extra ink, which generally is clutter in a weak way. But a stack of labels with long and parallel leaders can be very effective." -- feat/label-gang-search 0d45f03a: your ruling is in dev/lpn-rulings.md and CLAUDE.md; three comments corrected. Two rules to rule on: a crowding tie hides the LONGEST leader first (ink is now its only reason), and a leader may not pass through another node's symbol
- [x] R-319 feat/label-gang-search | "It occurs to me that where there is infinite space east or west, we might want to recognize that infinity and leverage it by using single-line concatenation of properties." -- Task 734 at 50

## Round of 2026-09-27 -- his pass over 8119-8121 and 8090, and the open decisions

### Decisions

- [?] R-338 feat/label-gang-search | R-315: "There appears to be serious breakage afoot with no other explanation than 'Text and symbol sizes got bigger'. Can you do a deeper inquiry into what broke label placement, and why it now takes 5 times as long as before with apparently worse results?" -- feat/label-gang-search bff8a35a: causes found and fixed (see handoff), but never got your pass, and that branch is bench-only now -- the label work moved to feat/label-placer and placers C/D. Does the round-4 placer work (feat/label-placer-c, feat/label-placer-d) answer this, or do you still want the gang-search fix itself verified?
- [x] R-339 feat/label-gang-search | R-318: the longest leader hidden first on a crowding tie: "No." A leader may not pass through another node's symbol: "Yes." -- feat/label-gang-search 8ce9ce7c: tie rule removed (ties broken by element ID only), symbol rule kept; dev/lpn-rulings.md -- confirmed by him 2026-09-27: *"Your R-339 rulings are done: OK."*


### feat/label-gang-search (8090)

- [?] R-351 feat/label-gang-search | "(1) Good. (2) Good. (3) It's instantaneous, unmeasurable for a human. (4) But we know that zooming and placement are broken beyond this. [his screenshot: Novato southwest, a descending gang of labels 185/183/181/179/177 with empty gaps circled between them and leaders running far from their nodes] shows gratuitous spacing, and you know that the delay is far worse than before." -- feat/label-gang-search bff8a35a: gaps closed at your zoom, 3 remain at 1.75x held by the R-075 ID reserve, but never got your pass, and that branch is bench-only now -- the label work moved to feat/label-placer and placers C/D. Does the round-4 placer work answer this, or do you still want your saved Novato southwest view re-checked against the gang-search fix itself?


## Round of 2026-10-02 -- his pass over 8141-8149, the first on jasmine

- [ ] R-370 feat/property-graph | "(1) You may want to check with Mary, but I am pretty sure that the industry term is pump "Head", not "Head gain". (2) And as such, "Hg" can be just "H". (3) Yes, pumps left out of highest head loss." -- build agent renaming on feat/property-graph
- [ ] R-371 feat/criticality | "Proceed with the rest of the task." -- severity order and row tints being built on feat/criticality
- [x] R-372 feat/bentley-interop | "Alt. preview is good. It's of course critical that we have consistent styles throughout the app." -- nothing to build; awaiting his merge word
- [ ] R-374 feat/demand-scaling | "It appears that Find doesn't respect "Selected junctions"." -- build agent reproducing on feat/demand-scaling
- [ ] R-377 -- | (Time series graph, sloping or stepped) "Do both, each as the situation requires." -- built on feat/property-graph with R-370

## Round of 2026-10-03 -- his pass over 8106-8114

- [ ] R-379 feat/property-graph | "Regression: Selecting a pump or pipe (but not a junction or reservoir) opens properties narrow ... and full height from bottom of screen to top of map. And when I move the box, it expands ... and contracts ... automatically. Once I manually size it, it stops acting like that. (2) Other than that, it looks great." -- build agent fixing on feat/property-graph
- [ ] R-380 feat/demand-scaling | "The Time Series graph shows all the selected junctions above 55 psi at 7:00. But Scaling Find says '⚠ At least one junction is below 20 psi even with the scaled demands at zero.'" -- build agent on feat/demand-scaling
- [x] R-381 feat/demand-scaling | "it would be really nice if the tables could filter on the selection." -- Task 757 at 75
- [ ] R-382 feat/keyboard-menu | "What Declan really needs are menu mnemonics ... once in keyboard mode, the mnemonic for all the menus should highlight or underline." -- Ida consulted; building on feat/keyboard-menu

## Round of 2026-10-15 -- his pass over bentley-interop (8116) and text-halo, plus Android

- [ ] R-386 feat/bentley-interop | (1a, run every Fotobi scenario) "'The solver did not converge' feels like a kind of a crash. And I still don't understand the difference between '1-hr drain w pump off' and the other children of EPS Pump off scenario that would make it fail to converge while they don't. I see that it has 24 overrides vs their 23, but I don't know how to see a tidy list of overrides to audit ... that count seems inflated ... I should see the count of only the present overrides, not the inherited overrides. I count 13 diameter overrides, 1 text override, and 2 calculation overrides." Screenshot note on '8-hr drain w pump off': "Solve did not converge. But I see no physical difference from its grandparent scenario." and "Tanks show amber circle on map, but has overrides only in parent, not here." Latest file: ~/tom-files/2026-10-15/Fotobi_US_WGS84.epp -- Task 800 at 100; why it fails to converge still to explain
- [ ] R-387 feat/bentley-interop | (1b, Apply Base values) "(1) I don't think we need this command any more now that we have the circles and the down arrows. And this command is too confusing and dangerous. I can't understand what it's trying to do and not to do. (2) I am not sure that it is meaningful to put a non-base alternative with the Base scenario. Doesn't that violate the idea of a base scenario? It seems to create a certain circularity that we should avoid. What do you and Mary find?" -- Task 801 at 100
  - TGH 2026-10-15, after Mary's findings: "There is nothing truly circular about it. I suppose it shouldn't be forbidden." Then: "Allow and retire. I agree. And I like the 'Merge into parent' command. Good find on Mary's part."
  - TGH 2026-10-15: "Maybe 'Merge upward' and it lets you choose how many steps upward to target the merge (in case you want to skip parent)?"
  - CC proposed: choose the target ancestor by name; if a skipped alternative has its own value for something merged, say so (assets and fields) and leave it untouched. TGH: "Yes. Perfect."
- [ ] R-388 -- | (Accuracy default 0.001) "Yes. And tip says 1e-9, so sync that." -- Task 796
- [ ] R-392 feat/bentley-interop | (1f, Text on a phone) "On a phone, the text opens for editing, but when the on-screen keyboard appears, it closes." -- 2026-10-15 fix/text-edit-phone (merged into bentley-interop): Chrome on Android's zoom onto the field closed it; retest on his phone
- [ ] R-393 feat/text-halo | "It all works. But there is an issue. I didn't know that halo could cover the text or neighbor text. In a pipe label, the halo of the separator comma can hide what's near it, and vice versa."
- [ ] R-394 feat/bentley-interop | (Properties) "The Properties text editor box is initially too narrow, and it won't drag wider. It drags taller (more rows). And I think it should always adjust for its width to fill the properties box width." And: "The Text Properties Size multiplier, on the other hand, is 5 times longer than it ever needs to be. It's like a tinyint." -- 2026-10-15: already built (2c2591d8); the box is the words box that opens when he taps a Text once, not Description; phone width now covered
- [ ] R-397 -- | "Settings search has what appears to be a regression. When I type a search term, the scrollbar doesn't go to the top. So my results appear empty."
- [ ] R-399 master | (Android) "Zoom to fit doesn't work for Basic example SI units on production or on feat/bentley-interop. It zooms out magnitudes wider than it should."
- [ ] R-401 -- | Roadmap requests: "Allow field/reference text in Text using {}. Define/disclose the keys in the User Manual." -- Task 798; "Can we try a UI option branch for everything in the bottom pane to be available also as dockable boxes: (a) Tables and (b) Graphs?" -- Task 799

- [ ] R-402 feat/bentley-interop | (Fotobi convergence, after CC's explanation) "(1) The patterns were intended to be all 0 except the time of use. But since that caused problems, I tried all 0.001 and 0.0001. It seems to me that the solver should be smart enough to handle 0. (2) I can confirm that amber is gone for the child scenarios." -- 2026-10-15 fix/zero-demand-solve: stock EPANET also fails (a full tank with no flow, L11 closing and reopening); the status line now names the tank, pipe and nodes and the two ways out; his word on the three sentences, and on an optional per-tank 'can overflow'
- [ ] R-403 fix/search-zoom-accuracy | (phone) "Zoom to fit on phone: All of the examples fail to Zoom to fit. Of them, Net1 is the closest to right, and Basic is magnitudes from right."
  - TGH 2026-10-15: "Text input width: Good."
- [ ] R-405 feat/text-halo | "I don't think we should be working at all on labels off the screen, do you? The speed cost sounds terrible especially when we have been working hard for weeks to get our labels to place faster. Halos are always by letter, not by string? And is there a better masking model we should be trying? I know that this is turning back the clock a long way for us, but I became aware that our tiny halos were making our text look fuzzy, not clear."
  - CC proposed: set the two-pass fix aside; try one halo for the whole label layer (lettering drawn with no stroke), measured on Net3 and 1,600 labels, with close-up screenshots. TGH 2026-10-15: "Halo renovate: Proceed."
- [ ] R-406 feat/leader-keep | Choices: "1. a. 2. Good. 3. We had a hysteresis rule. Did that get lost? I see that apparently it did. A label should not flip until half of its width is past the flipping point. 4. OK. 5. OK."
- [ ] R-407 feat/bentley-interop | (Merge upward) "(1) It only works for alternatives? I guess that's nice and tidy. (2) Wording '... it inherits them instead of overriding them.' (3) Why can't Morph or a saved view be used in the Base alternative? (4) Wording 'The alternative {name} has no overrides to merge.' (4) Help text: Change, but of course don't translate until later. (5) syn, yes delete them." -- build agent on feat/bentley-interop; (5) is his written permission to delete $ec_lang_syn lpn_scenario_push_values and lpn_scenario_push_tip
- [ ] R-409 feat/bentley-interop | "(1) Peripherally, the Pipes table Vertices column should always be sized based on the heading rule igoring the contents. (2) Peripherally, the Pipes table Velocity, head loss, head loss gradient, and all other applicable results in all tables should respect the Settings, Pipe labels decimals setting even when the result is zero. I am seeing 0 decimals, which is not appropriate in engineering, I think. (3) We need a way to manage the bubble/balloon graph overrides. ... I suppose the only practical way is a right-click on the asset or the graph. Ideas? Leave as is? (4) My comments about the expanded Scenario manager dockable box haven't been implemented, and I don't understand why not." And: "Make the time series bubbles/balloons open by default at their smallest size. I love miniatures, and I hope that our users do too." -- 2026-10-16: (1), (2), (4) and the miniatures built (9b9f74f3); (4) had been written into the handoff and never dispatched; (3) proposal out to him
- [ ] R-410 feat/bentley-interop | (Scenario Manager with its table) "I think we need only one x and one title bar; this is a consolidated box now; I fear that you are still thinking of it as two." -- 2026-10-16 build agent on feat/scenario-box
- [ ] R-412 feat/pattern-axis | "Good, but can the number of steps labeled be sensitive to the available width? They are overlapping each other when narrow." ("Period") "How about 'Step'?" (pattern time ignores Pattern start time) "Yes." -- 2026-10-16 build agent on feat/pattern-axis
- [ ] R-413 feat/bentley-interop | (bubble overrides, right-click remove) "This is not the action I want." (bubbles as rows in List overrides) "This sounds very promising as a general upgrade to List Overrides (which could become 'Manage overrides'), but I don't see any such actions available currently. Do this. I'd love to see it." -- 2026-10-16 build agent on feat/manage-override
- [ ] R-414 feat/bentley-interop | (Elevation in a child scenario) "I like graying it out, though I am inclined to ask why it can't be a Physical override." -- 2026-10-16 agent on fix/elevation-override
- [?] R-415 feat/bentley-interop | (units back to US) "Fotobi." "I don't have a good answer, and I am inclined to just keep observing." -- watching; no steps yet
- [ ] R-418 feat/label-leader | (round 5) "(1) ... Please see issues at /tmp/labels*.png (2) Even so, I think this is a noticeable improvement on what is on production. (3) ... the pipe labels on leaders are costly. I am very happy to learn that the one-line labels are not costly, because they are a great trick that could be leveraged more as you see in the images I shared. (4) The justification helps. Thanks. (5) Leader trade acceptable? I guess not since I can't see it honored anywhere. A cost for no benefit is pointless. Revert." Images copied to dev/label-trials/tom-1020/: a leader running off the screen; one-line labels stacked in a column beside a crowd, each on a leader; "Leaders wanted" on Novato. -- round 6 on the branch
- [ ] R-419 fix/examples-guide | "The re-ordering isn't better. We have to start with Basic mode because that's all a beginner wants to read. Restore the order at production with the headings formatting upgrade." -- round 2 on the branch
- [ ] R-420 feat/theme-tank | "(1) I think there is promise in this direction. But the menus look more like brushed stainless steel buttons than like galvanized steel water tanks; maybe the brightest surface is too white and in general it comes across too shiny, where galvanized steel is usually perceive as a gray. ... with this aspect ratio, the mind says "Tank on hill", which is okay, but with that subconscious messaging, the bottom shading "feels" out of place. Also, I can see horizontal seams and several rivets, but I don't detect (a few or one or two per row?) vertical seams in a brickwork-like pattern. (2) The time series bubbles fit now on all themes." -- round 2 on the branch
