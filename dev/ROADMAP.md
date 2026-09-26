# Roadmap

Open tasks for the EngCalcs hydraulic calculator suite. **Format: `Priority|ID| Description`.** One
flat list, highest priority first, lowest ID first inside a band. `# Reference` at the foot holds the
standing prose that is not a task.

| Priority | Means |
|---|---|
| **100** | **Next.** Being worked, or the thing to pick up on finishing something. |
| **99** | **Next, second rank.** In Next, not being worked this week. Narrows what 100 means. |
| **75** | **Soon.** Real, wanted, queued behind Next. |
| **50** | **Someday.** Agreed worth doing; nothing is waiting on it. |
| **25** | **Maybe.** Worth keeping; not obviously worth doing. |
| **5** | **Parked.** Alive only so it is not re-proposed from scratch. |
| **0** | **Closed** — the block moves to `dev/roadmap-closed-ids.md` in the same edit. |

**99 IS TOM'S OWN SIXTH TIER, ADDED 2026-09-23** (*"Demote to 99 (to narrow our priorities)"*). It
is NOT the retired 95: 95 was a dated holding pen for work parked past one event, where 99 is a
permanent second rank INSIDE Next, so that "what am I working on" has a short answer and nothing
falls out of Next to be forgotten. Both live under one heading below.

**NO TASK MAY SIT AT ANY OTHER NUMBER** (Tom, 2026-09-12: *"the system has been completely lost.
Restore it... No tasks are allowed at any other priority tiers."*). **Five values again: the
temporary 95 tier is RETIRED.** It existed to park work deferred past EWB, and branch work needs no
parking -- with master the production line, a task in flight on its own branch ships when it is
merged and not before, so a dated holding pen answers a question nobody has any more (Tom,
2026-09-12: *"empty the tier into branch or branches"*). Its two tasks, 627 and 628, went to 100 and
to branches of their own. `roadmap_id_check.php` FAILS on
one now, because this rule was prose for three weeks and drifted anyway -- seven tasks had settled at
30, 40, 60 and 70 by the day he read the file, and the header itself had been spliced in half by an
edit that inserted five tasks into the middle of its opening sentence, taking the table above with it.
Prose could not hold either failure; a check holds both.

Ties are the point: twelve tasks at 75 says "these are the soon ones" honestly rather than pretending
to rank them. *(Replaced a 0–100 free scale on 2026-08-21, when 88 tasks used 19 distinct values and
40 of them sat between 40 and 60. The rejected alternative was to re-space the fine scale; 45-vs-50 is
a distinction nobody can re-derive a month later.)*

**Every task OPENS with an executive-summary title of 4–12 words** — the first bolded run of the
description, after any marker or actor tag. The exact rule, and why that range, is in
`dev/scripts/roadmap_lib.php`; `roadmap_id_check.php` reports the ones outside it (advisory while
the backlog catches up). Anything longer belongs in the body. `dev/roadmap-index.md` is those
titles alone, the whole backlog in one screen — generated, never hand-edited.

**ID is permanent** — never reused, never changed, unrelated to priority. Cite one as "Task N". A
sub-item under a parent may use a dotted ID (`146.01`) and is still a full bullet.

**A marker says what a task is WAITING ON. It never changes the priority**, because worth and
reachability are different questions.

- **`WAIT: sprint`** — needs Tom to authorize a paid translation sprint. No AI may launch one. It does
  not block anyone else; work around it.
- **`CHECK: YYYY-MM-DD`** — a gate, not a deadline. Before the date the work yields nothing; after it
  the task is doable *at the priority it already had*. Only a task whose value DECAYS gets its priority
  changed, and then say why.

**Actor tags:** `[CC]` Claude Code, `[CP]` Copilot, `[H]` needs a human decision, `[CC→CP]` / `[CP→CC]`
a split task. Untagged = actor-agnostic. Lifecycle: `cross-platform-planning.md` §2.2.2.

**Length: 1–3 lines, hard cap ~15.** One test for adding a line — *would a competent person reading
the short version DO SOMETHING DIFFERENT if it were there?* Expansion is earned by a decision with a
real rejected alternative, a measured number, a non-obvious blocker, or a correction. Past the cap the
content is a `dev/*.md` and the task is one line pointing at it. Compress on close, do not just move
the block.

# Tasks

## 100 and 99 — Next.

- 25|672| **The placement wizard degrades and then crashes after a few pans.**
  **DROPPED TO 25 BY TOM, 2026-09-15: *"This is not manifesting. If it does, I will report."*** Kept
  rather than closed because the instrument built for it is the valuable part and should not be
  rediscovered.
  - **`?debug=perf` SHIPPED FOR THIS.** It prints, per settle, the wall time of each part of
    `georefSetTransform()`, the tile count, the compensation transform, the view scale and Chrome's
    heap. One run on a machine that actually fails answers what three headless reproductions could
    not, so if he reports it again that is the first ask and not a fourth reproduction attempt.
  - **THREE HEADLESS REPRODUCTIONS FAILED and that is itself the finding**: a flat 384 elements, a
    flat heap and 10-25 ms per settle on the real Elm Street Center file, through both search
    branches and through Finish. The cost is in something node does not do -- tile fetch and decode,
    SVG rasterisation under the compensation transform, or the 1.7 MB backdrop data URI.
  - Ruled out by reading, each with its evidence: basemap tiles do not accumulate; the tooltip
    re-init sites are off the settle path; the label collision grid is bounded since Task 668.
- 99|680| **Keep a project's drawing instead of rebuilding it on every tab switch.**
  **PHASE 1 SHIPPED 2026-09-16: the solve and the label layout are kept, and the switch is 38%
  faster.** Measured in real Chrome on the geographic Net3 at his own zoom: **636 ms to 395 ms
  median**, `lblPlace` 210 ms and `fontSizes` 65 ms gone entirely, **label passes 1 -> 0 and label
  measurements 737 -> 0**. What is left is the element building -- `nodes` 77-128 ms and `links`
  125-226 ms -- which is the rest of this task.
  - **THE KEEP IS PINNED TO THE BYTES ON DISK.** `storedSignature()` hashes what `saveToStorage()
    wrote`, on both sides of the switch. A first version hashed `serializeProject()` at each end and
    **never matched once on a real drawing**: the same document through `JSON.stringify` and back
    through `applySaved()` is the same data in a different key order.
  - **AND IT FOUND A STANDING DEFECT, which is the finding to keep:** a plain rebuild does not
    reproduce the layout it had. Measured with the keep switched off, **214 of 216 labels move on a
    switch away and back**, same document, same zoom, same settings. So labels have always jumped on
    a tab switch; the keep is the only thing that holds them still, and the cause is still unknown.
    `dev/lpn-spike/switch-keep-harness.js` asserts both halves.
  - The remaining phase is the big one: several drawings alive at once, `nodeEls`/`linkEls`/
    `labelEls` and the four layers stop being singletons. Memory measured at ~2 MB for Net3-Novato.

  Tom, 2026-09-16, on a five-second switch into a geographic Net3: *"why aren't we storing these
  things when we switch away?"*
  - **THREE THINGS COULD BE KEPT AND ONLY TWO ARE.** The DOCUMENT is in `localStorage`, and the VIEW
    is already kept per tab in memory (`tabViews`, keyed on the project id) -- so the precedent for
    per-tab retention exists and is two lines long. What is thrown away is the DRAWING and the SOLVE:
    `buildDom()` empties four layers and rebuilds every shape, and `refreshAllFromDocument()` sets
    `lastSolveResult = null` on the way in. Nothing decided that; the library and its tabs were built
    on machinery that had only ever held one document.
  - **THE PRICE OF KEEPING IT IS MEASURED AND IT IS SMALL** (real Chrome, 2026-09-16, driven over the
    DevTools protocol): **Net3-Novato's whole drawing is 1,931 shapes and about 2 MB of heap**;
    Net1's is 317 shapes and about 1 MB. Five big projects open at once is on the order of 10 MB.
    **Note the two counts are different questions**: a switch CREATES about 8,400 elements and KEEPS
    1,931, because the label pass builds and discards rows as it goes.
  - **THE PRICE OF NOT KEEPING IT, on his machine:** `buildDom` 3,389 ms of a 4,628 ms switch. Split
    inside it, measured here at 6x this machine's speed and identical in shape: label pass 56%,
    building the pipes 29%, the nodes 14%.
  - **WHAT IT COSTS TO BUILD is not the memory, it is that one drawing becomes several**: four layers
    and three element indexes (`nodeEls`, `linkEls`, `labelEls`) are singletons today, and every path
    that walks "the" drawing has to learn which one it means. A hidden subtree still costs style
    work, so the retained ones want `display:none` rather than visibility.
  - **A SMALLER FIRST STEP THAT IS ALMOST FREE: keep the SOLVE.** A result belongs to a document, the
    document has not changed while you were away, and the signature machinery that answers "has this
    changed" already exists for the dirty asterisk. That alone does not fix the delay -- Tom
    measured that turning auto-run off changes nothing -- but it is waste with a cheap remedy.

- 99|681| **Economize the label layout: it is half the cost of a project switch.**
  Tom, 2026-09-16: *"if laying out the labels takes 2 sec, we have to figure out how to economize."*
  - **THE NUMBER IS HIS: the label pass is 56% of `buildDom`**, which is about 1.9 s of his 4.6 s
    switch into a geographic Net3 with every field on. Here, on a machine 6x faster, the same pass is
    306 ms.
  - **THE MEASURING IS ALREADY FIXED AND IS NOT WHAT IS LEFT.** `measuredTextWidth()` banks every answer
    on (class, size, string): 8,140 browser measurements a switch became 100 once warm. What remains
    is composing the rows, the first-fit, the ring pass, the gang repair and the shed -- arithmetic
    and DOM writes, not layout reads.
  - **(a) IS DONE, 2026-09-16.** The pass ran at the outgoing project's zoom and was superseded by
    the view restore moments later; `buildDom()` now defers it and `refreshAllFromDocument()` runs
    it once, after the camera is where it belongs. With Task 680's keep on top, a switch runs the
    pass ZERO times.
    (b) `dev/label-placement-algorithms.md` section 1 says the published engines run a cheap first
    approximation before any search, and we have the search without it. (c) A label whose content
    and scale have not changed since the last pass could keep its placement, which is the same
    "keep what you already worked out" argument as Task 680.
  - **(d) TOM'S OWN PROPOSAL, 2026-09-17: bank the answer PER ZOOM LEVEL.** *"We should be able to
    save label position and shedding state for every node at every zoom level. And I assume that
    that would give us almost instantaneous zooming."* It is (c) with a key, and the key is the
    hard part. **It does NOT require Task 683's snapping and must not be built as though it does**
    (Franco, 2026-09-17): key the cache on a ROUNDED BUCKET of the continuous scale and let the view
    go on tracking the fingers exactly. What still needs his seat is the reading question -- banked
    positions do not slide as you pinch, they JUMP between buckets, and the moment that is likeliest
    to happen is the last half-second before a tap, which is the worst instant for a label to
    relocate in a tight cluster.
    - **TOM RULED IT AFTER 680's SECOND HALF, 2026-09-17, and gave the design rule that matters:**
      *"What we need to be vigilant for is unnecessary passes. We have to be aware of whether the
      pre-placements are final or not. I would agitate for using the next more zoomed out (larger
      text) bucket and not revisiting it. And of course the buckets should correlate to the PC mouse
      zoom levels."* **Round OUTWARD, never to nearest**, and treat a bucket's answer as final rather
      than as a first guess to refine -- a refinement pass is the cost this whole task exists to
      remove. Bucket boundaries follow the wheel's own notches (Task 683), **as a cache key and never
      as a view snap** (Task 683 rules the view out).
  - **(e) AND A PLACEMENT DELAY WHILE THE WHEEL IS STILL TURNING.** Tom, same day: *"if a person is
    scrolling fast, there is no label placement recalculation until they stop. Maybe this is already
    done, because the truth is that zoom performance is not terrible on Net3."* **Check before
    building** -- `scheduleReshed()` is already deferred and `onZoomChanged()` already skips the
    whole pipeline while annotation is hidden, so some of this exists. Measure what a fast wheel
    burst actually costs before adding a second timer.
  - Read with `dev/label-placement-algorithms.md` section 12 and `?debug=perf`, which now prints
    `labelPass` inside `buildDom` and a label-measurement count.

- 100|682| **Zoom on a PC with no wheel, and from the keyboard.**
  Tom, 2026-09-17: *"How would a person zoom on a PC without a mouse wheel or, for that matter,
  with a keyboard (if that's not too much to ask). Interesting question, nonetheless."*
  - **THIS IS TASK 674's DEFECT IN ANOTHER CONSTRUCT and that is why it is at 75 rather than 25.**
    674 exists because a coordinate could be entered by gesture and by nothing else. Zoom may be
    the same shape: a trackpad, a trackball, a presentation remote and a keyboard-only user all
    arrive at a drawing surface whose only documented zoom is a wheel. **Establish first whether
    that is true** -- read `js/looped-network.js` rather than assuming, and say where you did not
    look.
  - **IT IS TRUE, AND IT WAS MEASURED RATHER THAN ASSUMED (Ida, 2026-09-17).** The zoom function has
    exactly TWO callers in the whole of `js/looped-network.js`: the wheel (`:26699`) and the
    two-finger pinch (`:27387`). The only non-gesture control is **Zoom to fit** (`:25343`), which is
    a reset, not an increment -- press it twice and the second press does nothing. The page's only
    keydown bindings outside a text field are Ctrl+Z and the 1-9 tool picker. **So a keyboard-only
    visitor, or anyone with a wheel-less mouse, can reach "fit" and nothing else.**
  - **EPANET ITSELF ANSWERS THIS WITH TWO ORDINARY BUTTONS, Zoom In and Zoom Out**, and documents no
    wheel and no keyboard shortcut. That is the model: not a new idiom, the one our own reference
    application already uses. Full citations in `dev/agents/interface-designer/journal.md`.
  - **TOM'S OWN DESIGN FOR THE TOOLBAR HALF, 2026-09-17, and it is cheaper than either option he
    was offered:** *"Make the Zoom to Fit toolbar button do double duty like the select area button.
    Give it a little triangle indicator. The second time you click it, it changes to Zoom Window.
    And/or we put + and - on the map in a way that Ida tells us to do it."* **So the toolbar does not
    grow a button** -- an existing one gains a mode, through a disclosure idiom this page already
    has. That is the answer to his own standing worry about four lines of chrome.
  - **AND IDA ANSWERED THE HALF HE GAVE HER: + AND - STACKED VERTICALLY, TOP-RIGHT.** She read all
    four map corners before placing it, and corrected an assumption that one was empty -- top-left is
    a growing stack of status messages, bottom-left holds seven things already, and bottom-right
    carries the tile attribution, which is a legal requirement and cannot be crowded. **Top-right is
    the only calm corner**, and it is also where Mapbox puts its own zoom buttons. Styled like the
    scale bar and the legend, so no new visual language; **hidden entirely at the 640px breakpoint**,
    because fingers pinch.
    - **IT IS NOT A FIFTH LINE OF CHROME, and she argued that rather than asserting it**: the four
      bars Tom named are things a reader must get past before doing anything, while this is a small
      tool found by somebody already looking at the map -- the same family as the scale bar, which
      nobody has complained about.
    - **THE TWO HALVES COMPLETE EACH OTHER RATHER THAN COMPETING.** Zoom to Fit resets; Zoom Window
      drags a box to zoom IN. **Neither gives a one-click zoom OUT**, and the + / - pair is the only
      thing that does.
    - **THE KEYS ARE PLAIN `+` AND `-`, NEVER Ctrl.** Every browser has claimed Ctrl+plus for its own
      page zoom and taking it would surprise people. The "not while somebody is typing" guard the
      other shortcuts already use is there to reuse.

- 50|683| **The wheel zoom increment, snapping having been ruled out.**
  Tom, 2026-09-17: *"There are a limited number of zoom levels. Even on a phone, zoom level
  snapping could be enforced, though that might be anti-idiomatic."* And: *"An argument could be
  made that our mouse wheel zoom increment is too small."*
  - **HE NAMED THE RISK HIMSELF and it is the whole question.** This page is two idioms at once: a
    slippy map, which snaps to integer tile zooms, and a CAD drawing surface, which never snaps.
    Deciding which governs is the task; the arithmetic is an afternoon.
  - **IT BLOCKS TASK 681(d)**, because banking a label layout per zoom level presumes there are
    levels to bank against.
  - **SNAPPING IS RULED OUT BY TOM, 2026-09-17** (*"Close it. No snapping."*), on the two seats'
    evidence below. **What remains open is only the INCREMENT.** Do not re-propose snapping the view;
    if a future task needs discrete levels, it needs them as a CACHE KEY, which is Task 681(d) and is
    a different thing.
  - **BOTH SEATS SAID DO NOT SNAP, and they agreed with Tom's own worry** (Ida and Franco,
    2026-09-17, journals under `dev/agents/`). Franco's is the reason that decides it: he pinches to
    line the drawing up against the ground he is standing on, and a view that snaps after he lifts
    his fingers **jumps away from the spot he just placed it on**. Ida's is the desktop half -- the
    raster argument for snapping is one the tile provider already answers by resampling, so snapping
    would cost the drawing half something real to fix nothing.
  - **THE INCREMENT IS A SEPARATE QUESTION AND HIS INSTINCT HAS SUPPORT.** The wheel is a factor of
    **1.1, ten percent a notch** (`js/looped-network.js:26699`). AutoCAD defaults to 60% and its own
    users who turn it down for fine control land near 15-20%; QGIS's zoom tool is 200% a click. Ours
    is below that entire range. Nobody has filed a friction report about it, so this is evidence
    rather than a defect.
  - **AND IT DOES NOT BLOCK TASK 681(d) AFTER ALL, WHICH IS THE USEFUL FINDING.** Franco: a label
    cache can be keyed on a ROUNDED BUCKET of the continuous scale while the view still tracks the
    fingers exactly. **Building it as "the view snaps to the cache keys" is the easy way to arrive
    there by accident**, and it is the shape that breaks the finger tracking he depends on. Build the
    key and the view as two separate things from the start.

- 100|690| **Spreadsheet editing in the tables: the long project nobody has opened.**
  **FIRST BRANCH MERGED 2026-09-23 on his all-clear** (`feat/tables-spreadsheet`: modes, copy/paste,
  undo, widths, print). Still open under this umbrella: paste that creates rows (610), column hide,
  fill-down, multi-cell selection.
  **RAISED TO 100 BY TOM, 2026-09-18: *"Raise to 100 and open a branch. This is important."***
  Tom, 2026-09-17: *"I wonder why I don't see a spreadsheet editing branch. That's a major long term
  project we should be working on in the roadmap if not on a branch."* He is right that it is not
  tracked: Task 186 is the tables interface and Task 610 is paste that CREATES rows, and neither is
  the general capability.
  - **THIS IS AN UMBRELLA, NOT A TASK, and it should not be started as one.** What belongs under it:
    undo inside the table (Task 689), paste that creates rows (610, gated on Declan's spec), column
    hide (Declan's own named fix, with a design in his journal), fill-down, multi-cell selection, and
    whatever `tables-interface` already holds.
  - **`tables-interface` IS RETIRED, 2026-09-21, AND EVERYTHING IT HELD IS THE FOUR BULLETS BELOW.**
    It was one commit off master, made 2026-09-14, holding nothing but a roadmap block -- and that
    block numbered itself **666**, which was closed the same day for an unrelated lock defect, so
    the branch could not have passed `roadmap_id_check.php` and could never have merged. It sat for
    a week. The work itself is live on `feat/tables-spreadsheet`; only the reasoning was stranded,
    and it is salvaged here rather than deleted with the branch.
    - Tom, 2026-09-14: *"Tables spreadsheet editing: Copy/paste doesn't work right. We need a
      tables-interface branch that may be a long-term tweaking project to include column-widths,
      copy/paste, etc."*
    - **COPY AND PASTE IS THE DEFECT; THE REST IS THE PROGRAMME.** Fix it first rather than let it
      wait on the long work -- a broken paste is the `data-entry-clerk`'s whole day. Also named the
      same day: user-resizable columns, headings that do not wrap, columns too wide.
    - **THE TABLE IS AN EDITOR OF THE DOCUMENT, NOT A GRID**, and that shapes all of it. Cells write
      through `setProp()` (`scenario_seam_check.php`), a blank is a STATE not a zero where a column
      declares `blank`, and `multiGroups()` builds the multi-properties box from these same specs.
      **So a paste is a batch of validated property writes under one undo snapshot; getting that
      wrong is silent inside a scenario.**
    - **Shares the bottom pane's tab strip** with anything else that writes it, so name that seam in
      any brief or sequence the tracks.

- 50|694| **Export a map animation as an animated picture.**
  Tom, 2026-09-18: *"It would be very fun to export a map animation to a gif. And I bet it would not
  be hard for you. That could be another export item for the file menu. And if we get a lot of export
  and import items, we can put them in submenus."* And: *"With EWB finished, we can just enjoy
  ourselves building cool things for a while."*
  - The extended-period run already draws every frame, and the transport already steps them, so the
    frames exist -- what is missing is capturing them and writing a file.
  - **THE SUBMENU HALF IS THE PART THAT IS ALREADY EARNED.** The File menu now carries Open, Import
    EPANET, Export EPANET, Import libraries and the xy-on-map row, and he could not find Export
    EPANET at all (Task 685's sibling complaint, 2026-09-17). Grouping imports and exports is worth
    doing whether or not the animation is.
  - **NO THIRD-PARTY REQUEST AND NO VENDORED LIBRARY WITHOUT A DECISION.** The suite makes exactly
    four outside requests, all on this page, all opt-in; `vendor_integrity_check.php` governs anything
    added to `js/vendor/`. Encoding in the browser with no new dependency is the shape to aim for.

- 50|695| **The daily status mail has columns with no headings.**
  Tom, 2026-09-18, of the nightly report: *"Headings for this would help"*, quoting a table whose
  columns he had to guess at -- he wrote them as `??? ????`. The two numbers are almost certainly
  the two consent buckets, which is exactly the pair CLAUDE.md forbids summing, so a reader guessing
  at them is the failure this is about.
  - `log/lang-log-stats.sh` builds it and `dev/host/` holds the deployed copy;
    `log_format_selftest.php` pins its output shape, so the headings go in with the test.
  - **NAME WHAT EACH COLUMN COUNTS, NOT JUST WHAT IT IS.** One column counts PEOPLE (consented,
    deduplicated) and the other counts PAGE LOADS (everyone else, undeduplicated). A heading that
    says only "visits" would be worse than none.

- 100|696| **File, Convert coordinates as: a working menu item, as a new project.**
  **TOM HAS ASKED FOR THIS REPEATEDLY AND IT HAS NEVER HAD A TASK OF ITS OWN**, 2026-09-18: *"You
  have reminded me about this goal, and I have asked you repeatedly about this goal, and yet I don't
  find it in the road map. We need a working menu item to convert coordinates as a new project. We
  should be able to finish this promptly."*
  - **HE IS RIGHT AND THE CAUSE IS WHERE IT WAS FILED.** The design is complete and has been since
    2026-09-15, but it lives as leg (f) of Task 667, whose title is *"Tom's reflections on saving,
    locking and who can see your work"* -- so a search for the thing finds nothing and the index
    shows a title about file locking. **A design buried under an unrelated title is a design nobody
    can find, which is this file's own length rule working in reverse.** Extracted here; 667(f) now
    points at this.
  - **HIS DESIGN, IN HIS OWN WORDS AND IN THREE STEPS:** *"(1) the row becomes File, Convert
    coordinates as...; (2) it offers a file picker OR makes a duplicate tab named `Copy of
    {project_name}`; (3) the redesigned conversion wizard runs."*
  - **"CONVERT" IS THE HONEST WORD AND THIS REVERSES WHAT THIS REPO HAD WRITTEN DOWN.** Tom: *"let's
    not fool ourselves, conversion of all coordinates is happening."* He is right and the code agrees:
    `georefWrite()` re-derives every stored point. **The rule we actually hold is never convert IN
    PLACE**, and a Save-as does not -- the original file is untouched. That is why this belongs to the
    **File, Save as...** family, beside Task 688's *Convert units as...*.
  - **WHAT WE BUILT WAS AN "OPEN AS", WHICH IS WHY NO NAME FOR IT EVER READ CORRECTLY.** The shipped
    row is `Open xy file on map…`, which opens a FILE; he wants a row that converts THIS project.
    That is the whole of the redesign, and it is his diagnosis: *"we've been neglecting to use a
    standard paradigm because our design is wrong."*
  - **IT BELONGS ON `feat/xy-world-map`**, which now holds every piece of the coordinate work, and it
    is the exception path there: `dev/tom-coordinate-vocabulary-2026-09-16.md` rules that converting
    is *"no longer the default way to georeference"* -- the default is the Custom georeference wizard
    that changes no coordinate at all. **This is the dabbler action, offered because we already built
    and debugged the wizard, and not recommended in most situations.**
  - **REOPENED BY TOM 2026-09-21: THE PARADIGM IS OBSOLETE AND THE WORDING IS NOT HIS.** *"Needs
    some work on a feature branch with Branch review. Its paradigm is obsolete."*
    - **(1) IT STARTS WITH COORDINATE SYSTEM SELECTION**, not with what it starts with now. And:
      *"the wording of this is not what I carefully edited. You claimed to have found in transcripts
      and documented my en edits about Projection and CRS, but I can't find them implemented
      anywhere."* **GO AND FIND THOSE EDITS AND IMPLEMENT THEM, or say plainly that they cannot be
      found** -- `dev/tom-coordinate-vocabulary-2026-09-16.md` is where they were recorded, and the
      standing rulings there are that we no longer expose the word *projection*, and that
      georeferencing means attaching the world map rather than converting a coordinate system.
      Claiming to have documented his edits and then not implementing them is the failure to own
      here.
  - **HIS THIRD ROUND, 2026-09-22, AND POINT (3) IS THE ONE THAT MATTERS:** *"I completely missed
    this until now, but this wizard is out of date with our current CRS paradigm. The first thing it
    needs to do is ask what coordinate system we are going to. And I am vaguely recalling that we
    possibly already worked on this. Do what you can or let me know if you want me to try to give you
    detailed specs. I think we already went down this road. (a) Project and units (maybe this one menu
    row as 'Convert as...' can handle both units and coordinates), (b) step 1 (if CRS changed),
    (c) step 2 (if CRS changed)."* **So he is proposing ONE menu row, `Convert as...`, carrying both
    the unit conversion of Task 688 and the coordinate conversion of this task**, with the placement
    steps shown only when the CRS actually changed. That merges this task with 688 at the interface,
    and the answer owed him is whether that is right.
  - **AND TWO DEFECTS HE FOUND IN WHAT SHIPPED:** *"(1) In Step 1, a background image gets dragged
    around with the map (then snaps back on release of drag) instead of always staying with the
    project. (2) When I finished the Convert coordinates as... wizard on the Elm Street Center
    example, the world map worked, but the satellite view didn't."*
    - **(2) A PROJECT THAT ALREADY HAS A WORLD MAP ATTACHED ALREADY KNOWS WHERE IT IS.** His words:
      *"If a project already has an attached World map (custom or unnamed georeference), the next
      step (placement step 1) uses our current georeferencing. In fact, we could just convert the
      project to their selected CRS without further question. But we step them through Steps 1 and 2
      in case they want to make any changes."* So the steps stay, and they open ALREADY ANSWERED
      from the existing attachment rather than asking again from nothing.
  - **TOM MERGED 688 AND 693 INTO THIS ONE, 2026-09-23** (*"Combine: 693 and 688 with 696 as a
    single wizard"*), and his shape for the merged row is: *"(a) Project and units (maybe this one
    menu row as 'Convert as...' can handle both units and coordinates), (b) step 1 (if CRS changed),
    (c) step 2 (if CRS changed)."* **So there is ONE menu row, `File, Convert as...`, and the
    placement steps appear only when the coordinate system actually changed.** Units alone is then
    the cheap path through the same door, which is what made the two separate rows look wrong to him.
  - **AND THE DEFECT THAT PROMPTED IT, WHICH IS THE BUG TO FIX FIRST** (his words, 2026-09-23): the
    wizard *"is out of date with our current CRS paradigm, because for a 'lat/lon' (EPSG?) project,
    it exits with the message 'This project is already on lat/lon'"*. That refusal is
    `mapgeoStart()`'s `lpn_georef_on_map`, and under his own settled vocabulary it is simply wrong:
    lat/lon is EPSG:4326, one coordinate system among hundreds, so "you are already on lat/lon" is
    not a reason to refuse to convert TO something else. **The first thing the wizard must ask is
    which coordinate system we are going to.**
  - **HE SUSPECTS HE MET THIS IN HIS OWN WORDING PASS** (*"I think I pressed the problem here in my
    lang edits"*) -- and he did: `lpn_crs_unplaceable` and `lpn_crs_unplaceable_mark` are the two
    keys he answered with *"Please explain to me what this is in response to."* Answer those when
    this is built; they are the same paradigm gap seen from the string side.

### ABSORBED: Task 688, File, Convert units as (his agreement on file)

    Tom, 2026-09-17: *"We start the project in US units so that we can intuit the values. Before we
    are done, we want to convert to SI for the community."* Put to him that this collides with a rule
    he set himself; he read the reconciliation and answered *"File, Convert units as...: I agree."*
    - **THE BAN IS NOT TOUCHED AND MUST NOT BE.** *"A bad design decision was made without my
      knowledge to convert inputs when units are switched. Scrub and ban this."* That forbids a UNIT
      SELECTOR silently rewriting typed numbers, and it stays absolute: changing a unit reinterprets
      the number, 1 becomes 1 ft instead of 1 m, and EPANET behaves the same way so there is no
      authority on the other side.
    - **WHAT MAKES THIS DIFFERENT IS THE SAVE-AS SHAPE, WHICH IS HIS OWN DESIGN FROM TASK 667(f).**
      There he ruled, of coordinates: *"let's not fool ourselves, conversion of all coordinates is
      happening"*, and the rule the project actually holds is **never convert IN PLACE**. A Save-as
      does not: the original project is untouched and a new one is produced. So this row joins the
      **File, Save as...** family beside **File, Convert coordinates as...**, and the two should look
      and behave alike -- a file picker, or a duplicate tab named for the original.
    - **THE UNIT IS A DISPLAY FACT, WHICH IS WHY THIS IS CHEAPER THAN IT SOUNDS.** A calculator stores
      what the user typed and converts at the solver; the `lpn_` page records its own unit selection in
      the project because declarative storage makes a bare number meaningless without it. So a
      conversion rewrites the stored numbers AND the recorded selection together, once, deliberately.
    - **THE TRAP IS THE ONE TASK 390 ALREADY NAMES:** exact factors still fail in doubles --
      `150 * 0.3048 * (1/0.3048) === 149.99999999999997` -- so a converted project must never claim to
      be reversible. Converting back is a second conversion, not an undo. Say so in the interface.
    - **OPEN, AND NOT ASKED YET:** whether a community actually wants a converted project or the
      original plus a report. That is Sue's seat and Tom has not been asked to spend time on it.
    - **Include a question about rounding for the most obvious candidates**: Diameter, Depth, Demand and Flow, Head. For each ask user to select their specified rounding as a selector including nearest 100, 10, 1, 0.1, 0.01, 0.001.

### ABSORBED: Task 693, Separate Length and Map coordinates units

    Tom, 2026-09-18: *"I think we may have an obsolete paradigm leading to a bad label on our units.
    Length says 'Length and map coordinates'. But I think that is only true for a non-EPSG project.
    Obviously lat/lon is not a length unit. So obviously when the map unit is lat/lon, this unit label
    is a lie."* The string is `lpn_units_length` (`lib/lang.ec.en.php:1016`).
    - **HE IS RIGHT AND THE CAUSE IS THAT ONE SETTING USED TO ANSWER TWO QUESTIONS.** When every
      project was a local grid, the length unit WAS the coordinate unit and one label was honest. A
      geographic project reads coordinates in degrees and an EPSG project reads them in the plane's own
      unit, which need not be the one pipes are measured in.
    - **HIS OWN PROPOSAL, and it needs deciding before anything is built:** *"Should the lang say
      'Length'? And we have a separate 'Map coordinates' unit input that is disabled and autofilled for
      an EPSG CRS?"* That is one honest label plus one derived, read-only field, which matches how the
      rest of this page treats a number it knows rather than one the user states.
    - **DO NOT BUILD IT AS A CONVERSION.** Changing a unit reinterprets the typed number and does not
      convert it, and only the user touches a file's numbers. A read-only Map coordinates field is a
      DISPLAY of what the coordinate system already says, never an input that rewrites anything.
    - Read with Task 688: this is the same paradigm gap arriving from the display side rather than the
      Save-as side.
- 100|715| **Full Report: every element at every time step, as one exportable document.**
  Tom, 2026-09-25: *"Make the reports roadmap tasks before EPANET++."* EPANET's Report > Full, the
  gap Mary ranked first (`dev/agents/market-researcher/epanet-gap-audit.md` §3.1). The per-step
  results already exist in `js/lpn-time.js`; the work is layout and export. Before Task 697.
- 100|716| **Status Report: what switched, when, in time order.**
  EPANET's Report > Status: pump starts and stops, valve status changes, tanks filling or emptying,
  warnings, per time step. Mary's second-ranked gap (same audit, §3.2). Read with the Net3 Pump 10
  status defect (R-231), which is the same event stream. Before Task 697.
- 100|697| **EPANET++ as a competing front door, on its own two domains.**
  Tom, 2026-09-18: *"Create competitor or A/B testing web sites to deliver lpn as EPANET++. They are
  called epanet-plus-plus.org and epanetpp.org, and they are canonical to themselves."*
  - **BOTH DOMAINS ALREADY EXIST ON THE ACCOUNT** -- `~/addon_html/epanet-plus-plus.org` and
    `~/addon_html/epanetpp.org` were both seen there on 2026-09-17.
  - **"CANONICAL TO THEMSELVES" IS THE WHOLE TECHNICAL REQUIREMENT AND IT IS NOW CHEAP.** As of
    2026-09-18 the canonical origin is a PER-PAGE declaration in `lib/Canonical.lib.php` rather than
    one global constant, so a third and fourth front door is a declaration rather than a rewrite.
    **But read the Search Console lesson first:** every calculator page had been nominating
    librewaternet.org, a three-week-old domain at position 34, while hawsedc.com earned 7,575 clicks
    a quarter at position 9.7. **A page can nominate only ONE canonical address**, so a genuine A/B
    test of two front doors is not two canonicals over one page -- decide what each site actually
    serves before writing a line.
  - **AND THE NAME IS A PUBLIC CLAIM, WHICH IS THE PART THAT NEEDS CARE.** `dev/positioning.md` is the
    authority for every public claim, `public_claim_check.php` holds four sentences Tom has already
    struck, and `dev/not-epanet.org` exists as a sibling site with its own claim rules. **"EPANET++"
    asserts a relationship to EPANET** -- read `dev/positioning.md` and the `not-epanet.org` CLAIMS
    file before drafting a word of it, and expect the completeness question (never a completeness
    claim against EPANET) to be the first one asked.
  - At 50 because he framed it as A/B testing rather than as next. Promoting it is his call.
  - **Tasks 715 and 716 (Full and Status Report) come first** (Tom, 2026-09-25).

- 99|679| **Narrower strokes on the About mark, and more pixels used.**
  Tom, 2026-09-15: *"The icon is golden, but I might like to see Help, About a little more
  photo-realistic since there are many more pixels. First item of business, narrower strokes on
  the outlines."*
  - **A NEW TASK, NOT A REOPENING.** Task 615 is CLOSED on his own *"mark 615 complete"* and a
    closed block is never re-scanned, so the unbuilt phase is extracted here as the length rule
    requires. What shipped is the favicon and the mark; what he wants now is a rendering of it at
    the size Help, About actually has room for.
  - **HIS FIRST ITEM OF BUSINESS IS THE STROKE WIDTH**, and only that. A favicon needs heavy
    outlines to survive 16 px; the About box is showing the same geometry at many times that, where
    the same strokes read as a cartoon. So this is a SIZE-DEPENDENT rendering, not a redesign.
  - **DO NOT RE-OPEN THE GEOMETRY.** Tom on the favicon: *"my one true love."* The shading rule the
    whole mark follows -- one light above, three surfaces, and the shading follows the SOLID -- is
    in `ship-notes.md`, and `dev/icon-preview/gen-about-icon.js` is the generator.
  - **ANSWERED 2026-09-17: BOTH, SHOWN SIDE BY SIDE.** He chose *"Show me both and I will pick"*,
    so the deliverable is a comparison and not a build. **And he added the detail that decides what
    "more surfaces" means here:** *"possibly more realistic leg thicknesses and catwalk rendering,
    where a catwalk consists of a robust deck plus a handrail above it."* A catwalk is therefore TWO
    elements, not a line -- that is the drawing note, and it is his, not ours.
  - **Part of the one water-tower piece of work with Tasks 645 and 648** (Tom, 2026-09-21).
- 99|676| **Watch the sites, and send a derived weekly report.**
  Tom, 2026-09-15: *"mistakes like the site outages and merging difficult development branches to
  master before proper vetting can no longer be the matter of course."* Plan, the corrected
  diagnosis, and the things deliberately NOT to do: `dev/reputation-and-practice.md`.
  - **PHASES 1, 1a AND 2 ARE CLOSED, and phase 1 closed by DISCOVERY rather than by building.** The
    uptime watch already existed on the host and the plan could not see it, because the watch was
    not in this repository. It is now, in `dev/host/`. **That is the finding worth keeping: a
    diagnosis written from inside one tree could not see a working machine one directory outside
    it.**
  - **PHASE 2 IS A HEARTBEAT, NOT A SUMMARY** -- `dev/scripts/daily_report.sh`, 20:00 daily on
    Tom's own offer of the faster cadence. The alarm is silent on success, so a healthy site and a
    dead cron are the same silence; the report arriving is what separates them.
  - **`sendmail` EXITED 0 DURING ALL 22,907 BOUNCES**, so an exit code was never evidence of
    delivery. Phase 1a is proven at the far end, with Tom confirming receipt unprompted.
  - **TWO OF THAT LIST ARE CLOSED AND ONE WAS A MISREADING (2026-09-17).**
    - **GitHub branch protection is DECLINED and is not an ask any more.** Tom, 2026-09-16: *"I'm
      sorry. I can't bring myself to do that."* His call, and the gap it would have closed is narrow
      -- a clone or another machine with no hooks -- which `hook_install_check.php` already reports
      on every suite run. **A gate he works around would be worse than none**, which is this
      project's own rule. Do not re-propose it.
    - **THE SIBLING PRE-PUSH IS BUILT AND INSTALLED IN BOTH REPOSITORIES.** Verified 2026-09-17:
      `~/webdev/librewaternet.org/.git/hooks/pre-push` and the same in `~/webdev/not-epanet.org`
      refuse a push unless `sh check.sh` passes, and both pass today with nothing unpushed. It runs
      the suite rather than reading a stamp, deliberately: `check.sh` is under two seconds there, so
      running it is cheaper than the machinery for not running it.
    - **"THE ACCOUNT IS AT 96% DISK" WAS A MISREADING OF WHOSE DISK.** Measured on the host
      2026-09-17: `/dev/md125` is 7.0 TB at 95% with 372 GB free, and that is the SHARED filesystem
      every tenant sits on. **This account uses 6.3 GB of it and has no quota**, of which 2.3 GB is
      cPanel's own `~/tmp/analog` stats cache and 1.9 GB is archived access logs. So clearing the
      22,907 bounces (13 MB of mail in total) frees nothing that matters and is not urgent. **The
      risk is real and is not ours to fix**: if the shared volume fills, the site goes down whoever
      filled it. Worth knowing; not worth a task.
  - **STILL OPEN:** whether the nightly 622 pages also want six URLs every fifteen minutes (a cost
    question about a shared host, and nobody has been asked); then the portable kit.
  - **AND THE RELEASE QUESTION IS ANSWERED IN PRACTICE, NOT ONLY ON PAPER.** `release/ewb` is cut
    from `81792180`, the SHA Tom had deployed, and pushed. CLAUDE.md's Git Workflow carries the
    procedure and the correction of the 2026-09-13 advice that a clean release could not be
    extracted.

- 50|675| **A labelled grid, with the significant digits picked out.**
  Tom, 2026-09-15: a grid in Settings with *"options for density and opacity"*, labelled *"at the
  lower and left map edges aligned with each grid line"*, showing three significant digits large
  with *"the leading and trailing digits smaller. The first significant digit is the first digit
  that changes at all across the map."*
  - **THE TYPOGRAPHY IS THE IDEA, NOT A FLOURISH.** A state-plane northing is 1304070 and seven
    digits at every gridline is a wall of ink in which the three that differ between one line and
    the next are invisible. Picking those three out is what makes a grid readable at survey
    coordinates, and it is the same observation Task 354 made about float32: the interesting part
    of these numbers is the tail.
  - The rule is derivable rather than a setting: the first significant digit is the first that
    CHANGES across the visible extent, so it falls out of the extent and the grid spacing. Three
    digits large is Tom's number.
  - `gridLayer` already exists in the layer stack and nothing has ever drawn into it.
  - Priority 50 rather than 100 on its own merits: it is a reading aid for a coordinate system
    Task 674 would let people type into, so 674 lands first and may change what this needs.

- 50|667| **Tom's reflections on saving, locking and who can see your work.**
  **DROPPED TO 50 BY TOM, 2026-09-18.** Its urgent leg shipped -- (b), asking for initials only when
  a colleague wants in, is built on `feat/lock-initials-later` -- and (f) was extracted to Task 696
  because he could not find it here. What is left is (c) a cloud save, (d2) an in-app connector and
  (e) concurrent editing, all of which he parked himself.
  Written down 2026-09-14 from a testing exchange with JHB, at Tom's instruction ("For roadmap,
  not now"). **Not one task -- four, deliberately kept together because they are one
  conversation**, and the first is the cheapest and the most urgent.
  - **(a) TWO TESTERS IN A ROW HAVE ASKED WHETHER THEY "CHANGED THE WEB SITE".** Tom: *"I can
    argue that they were not sophisticated enough. Or we can make at least some small
    clarification."* His own proposal is the gallery heading: **"Open your own copy of an
    example,"** which the page already says in smaller print beneath it. Cheap, and the second
    report is the evidence the first was not an outlier. **DONE 2026-09-14** -- the heading is
    now his sentence, and Task 666 (the shared example docId, closed the same day) was very
    likely the real cause for at least one of the two reports: this wording is the belt and
    that fix is the braces.
  - **(b) ASK FOR INITIALS LATER -- ONLY WHEN A COLLEAGUE ACTUALLY WANTS IN.** Tom's design, in
    his words: save the lock with NO initials; when a mate opens the file, tell them *"This file
    appears to be in use. To avoid data loss, choose carefully from the following options"* and
    offer **Cancel / Open read-only / Request lock / Break lock**. Only **Request lock** asks for
    initials, and uses them to tell the holder that ABC wants it. That inverts today's order, where
    the page asks a lone user for a name nobody will ever read -- and Tom's own worry is that
    asking up front *"is too evocative of a login or registration"*, on a site with no login and no
    account. Break lock exists today as "take over"; Cancel and Open read-only exist; **Request
    lock is genuinely new and needs a back channel the broker does not have.**
    - **HE RESTATED IT 2026-09-17 AND ADDED THE READOUT, which is the part that was missing.** The
      dialog states three ages, not one: *"This file has been in use for X hours, was last saved Y,
      and was last edited Z. We can ask the locking user to close the file for you."* Then
      **Ask, Break lock, Open read-only, Cancel** -- "Ask" is what (b) above calls Request lock, and
      his shorter word is the one to ship.
    - **AND HE CONCEDED THE TRADE RATHER THAN DENYING IT**: *"Of course saving initials with the
      lock is better. But asking user A for their initials the first time they save a file is a bit
      startling, not to mention easily confused with a login or account registration."* So the
      design knowingly gives up a nicer message to the second user in order not to ask the first
      user for a name on a site that has no accounts. Do not re-propose asking up front as an
      improvement; it is the rejected alternative.
  - **(c) A CLOUD SAVE OPTION, WHICH MEANS A LOGIN.** Parked at the top of nothing: the suite has
    no login, no user table and no session by construction (`no_session_check.php` blocks at
    zero), and reversing that is a consent-version bump, a rewritten banner and 26 retranslations
    before a line of it is useful. Record the want; do not cost it here.
  - **(d) CONNECT TO THE USER'S OWN CLOUD DRIVE -- ANSWERED, AND IT IS MOSTLY ALREADY TRUE.**
    Tom asked *"maybe there's a provider that does that"*; the market researcher checked and the
    answer is that this page ALREADY does it by accident of the API it uses. `showOpenFilePicker()`
    / `showSaveFilePicker()` see a synced Drive, OneDrive or Dropbox folder as an ordinary OS
    folder, so saving into the cloud works today with no account of ours, no new third-party
    request and no consent gate. **Tom, 2026-09-15: he is doing exactly this already, and so is the
    Filipino engineer who filed this project's first real-world report.**
  - **(d2) AN IN-APP CONNECTOR IS A SEPARATE, PAID THING AND IS PARKED.** Tom: *"some people prefer
    to manage their cloud drives using the browser interface. For those, a connection might be
    nice. But I say this can be Someday or Maybe until there is more demand."* The cost is why:
    a Drive Picker or Dropbox Chooser needs no server secret (`drive.file` is a non-sensitive
    scope), but each is **a NEW third-party request with its own consent gate and its own paragraph
    in `privacy.php`, one build per provider** -- against a folder-sync route that is free and
    provider-agnostic. Revisit on demand, not on interest.
  - **(f) EXTRACTED TO TASK 696 ON 2026-09-18** because Tom could not find it here, and he was
    right: a coordinate-conversion menu item filed under a task about file locking is unfindable.
    The full design is there. What follows is kept only so a reader of this block is not left
    wondering.
  - **(f) THE CONVERSION IS A "SAVE AS" AND THE MENU SHOULD SAY SO** (Tom, 2026-09-15, and this
    supersedes the wording argument that preceded it). His diagnosis is that the naming fight was
    a symptom: *"we've been neglecting to use a standard paradigm because our design is wrong."*
    The row participates in the **File, Save as…** family, except that what we built is an
    "Open as", which is why no name for it read correctly. **His redesign, in three steps:**
    (1) the row becomes **File, Convert coordinates as…**; (2) it offers a file picker OR makes a
    duplicate tab named `Copy of {project_name}`; (3) the redesigned conversion wizard runs.
    - **AND "CONVERT" IS THE HONEST WORD, which reverses what this repo had written down.** Tom:
      *"let's not fool ourselves, conversion of all coordinates is happening."* He is right and
      the code agrees -- `georefWrite()` re-derives every stored point, and
      `georefSetTransform()`'s own comment says "nothing but the coordinates changes", which
      concedes that the coordinates DO. The rule we actually hold is **never convert IN PLACE**,
      and a Save-as shape does not: the original file is untouched. The three past lessons
      reconciled in his words: we learned not to convert in place, and this does not; we dropped
      the word "convert", but the operation always was one; and we must be able to reproject
      BETWEEN projections, not only from unprojected to projected.
    - **THIS IS PROJECTION-BRANCH WORK, not master's**, on his instruction. The interim English on
      master is his: `Open xy file on map…`, which is what the shipped translations already say.

  - **(e) CONCURRENT EDITING, THE GOOGLE DOCS SHAPE.** Tom already priced it himself in the
    exchange: *"That would be a huge project with lots of questions to answer."* Recorded so the
    want is not lost, parked because he parked it.

- 50|664| **A link's status colours correctly and its legend prints numbers.**
  Left open when Task 638 closed 2026-09-13. `status` is CATEGORICAL and this page's colour system
  is a break-based numeric ramp, so status enters as 1 open / 0 closed. **The map reads correctly**
  -- closed links land in the bottom band, as EPANET's own Status view draws them -- and the words
  are one tick away as a label. **The LEGEND is what is wrong**: it prints numeric bands where it
  should print the two words.
  - **THE FIX MEANS CHANGING THE FIELD-DEFINITION SHAPE**, which is why it was not done: Task 636
    was in flight beside it feeding the same structures, and changing the shape under a concurrent
    track is the seam collision this project has already paid five defects for. That constraint is
    gone now; both have landed.
  - The shape question is real and worth answering once: a field definition is `[key, label]` and a
    colour map is `{key: unitId}`, neither of which can say "this quantity is a small set of named
    states". Whatever carries that will also serve any future categorical field.
  - Weigh against doing nothing: a legend reading 0 and 1 beside a map that is visibly right is a
    blemish, not a wrong answer, and this page has wrong answers to fix first.

- 50|649| **Retire the nested repository: serve the suite by Alias at both mounts.**
  Tom asked on 2026-09-13 how the repositories and the web deployment should be organized, guessing
  that *"we want web under repository, or in other words, the repositories fully transcendent of web
  sites."* **He is right and it is already built** -- three repositories that ARE their own document
  root. The one anomaly left is that `engcalcs` sits INSIDE the `hawsedc.com` repository, kept out of
  it by a single `.gitignore` line. Full analysis, the three options and the costs:
  `dev/git-organization-recommendation.md`.
  - **THE ARGUMENT IS NOT TIDINESS. THE CURRENT ASYMMETRY HAS ALREADY SHIPPED TWO DEFECTS.**
    librewaternet reaches the suite by Alias plus a rewrite; hawsedc reaches it by filesystem
    nesting. The HTML is byte-identical at both, so nothing here can see the difference -- which is
    exactly the root cause recorded for `nav_link_absolute_check.php` (1,275 relative nav links,
    dead at `/app/`, a third of the navbar broken at the front door until Tom clicked it) and
    `js_page_url_check.php` (the same defect in a second construct, found three days later). Alias
    at BOTH mounts makes "this suite is served at more than one address" the visible shape of the
    tree instead of a surprise. **A check finds a defect; a structure prevents the class.**
  - **A SUBMODULE IS THE TEXTBOOK ANSWER AND IS REJECTED**, so nobody re-proposes it: the two do not
    version together (the suite serves two domains on its own schedule), and it would turn Tom's
    deploy from `git pull` into `git pull && git submodule update --init --recursive`. A deploy step
    somebody can forget is a deploy step somebody will forget.
  - **NOT BEFORE THE 17 SEPTEMBER DEMONSTRATION.** The risk is a live 500: `Options -Indexes` needs
    `AllowOverride Options`, and where that grant is missing Apache fails closed for every request
    under `/engcalcs/`. The benefit compounds over months; do it on a quiet day.
  - `hawsedc.com/engcalcs/` is the indexed address and does not move. An Alias is transparent to the
    URL, so the risk is a configuration error, not a design flaw.
  - Meanwhile `nested_repo_boundary_check.php` (advisory) holds the line, and the worktree layout
    simplifies as a side effect: `worktrees/<branch>` Aliased, with no stand-in parent directory
    whose only job is to make `/engcalcs/...` resolve.

- 75|648| **The About icon's outlines are too heavy for its scale.**
  Tom, 2026-09-13, closing out the icon work: *"the About icon has outlines unduly heavy for its
  scale, and it can be adjusted to look right (appropriate stroke width) for that scale, which could
  open up additional detail on the roof and belly shading and the legs and catwalk."*
  - The reward is the second half of that sentence: a correct stroke weight BUYS detail rather than
    only fixing a blemish, because what is currently crowding the drawing out is the outline itself.
  - `dev/icon-preview/gen-about-icon.js` is the generator; the shading rule the whole mark follows
    is in `ship-notes.md` (one light above, three surfaces, and the shading follows the SOLID).
    Do not re-open the geometry: Tom on the favicon, *"my one true love."*
  - **Part of the one water-tower piece of work with Tasks 645 and 679** (Tom, 2026-09-21).
- 25|185| **Match/Copy properties tool (originated during Task 146).**
  **DROPPED TO 50 BY TOM, 2026-09-17** (*"Task 185: Demote to 50"*), which supersedes the
  promotion below rather than cancelling its reasoning: the feature is still wanted, nothing is
  waiting on it.
  **RAISED TO 100 BY TOM, 2026-09-07.** The earlier gate -- 100 with Task 186, and only once all of
  the EPANET file is implemented -- is superseded by his own promotion, exactly as Task 186's was.
  - **THE PREMISE IT WAS CONCEIVED UNDER IS GONE, AND HE KEPT IT ANYWAY.** Tom, 2026-09-06: *"This
    was conceived 'in the absence of the table editor'. But now we have a table editor.
    Nevertheless, this could be a very cool visual feature if done right."* So it is no longer the
    cheap stand-in for Task 186 -- the line below calling it "the cheap 80% of Task 186" is
    superseded -- it is a POINTING tool that a table cannot replace, wanted for what it is.
  - **HIS SPEC, VERBATIM AND IN HIS OWN NUMBERING** (2026-09-06):
    1. Invoke it -- **under the Edit menu, and maybe on the toolbar with a nice icon**.
    2. Get prompted to select the source asset to copy from.
    3. **A specialised properties box for the source asset opens**, with recommended or previous
       (remembered by the BROWSER) checkboxes ticked for the properties to copy.
    4. Click Copy.
    5. (a) Click other assets **of the same type** to receive the designated properties.
       (b) Optional or future: click in space to start a **polygon window selection** of every asset
       fully inside the drawn polygon, documented in the tip on the Copy button. While drawing,
       **right-click to choose Finish as polygon or Finish as fence**.
    6. The properties are copied to all indicated assets, **as a SINGLE undo operation**.
  - **"Previous (by browser)" is the project/browser split doing its work, not an exception to it**:
    which boxes were ticked last time is furniture -- a fact about the person, not the document --
    so it is a `localStorage` sibling key and `serializeProject()` must never learn about it.
    `lpn_furniture_check.php` will require it to be declared.
  - **Same type only, in step 5a, and that is load-bearing**: a pump's properties are not a pipe's,
    and a tool that silently skips non-matching clicks teaches nothing. Say why the click did
    nothing.
  - Two things a decision is owed on before building: **ID is never copyable** (IDs are unique) and
    **geometry is never copyable** (that is a move, not a property copy).
  - Original phrasing, kept because the good idea is in it. Tom, 2026-07-30: "In the absence of the
  table editor, some sort of Match or Copy tool would be very cool. Checkboxes (or current visible
  labels) say what properties to copy, top shows (or initial click gives) the Source object then you
  click the Target objects." Same interaction as AutoCAD's MATCHPROP and every GIS attribute-copy
  tool: a toolbar mode, first click sets the source, every later click applies to a target, Escape
  or a mode change ends it. **The good idea in Tom's own phrasing is "or current visible labels"** —
  the Labels panel already IS a per-property checkbox list, already knows which properties are
  interesting to this user right now, and is already on screen; reusing it as the property filter
  means the tool needs no property picker of its own, and what you see on the map is what gets
  copied.

  **Kept and still liked (Tom, 2026-08-13): "Very nice idea. I love it."** Keep it a click-source-
  then-click-targets tool: that is the right shape when you are drawing 15 pipes and want this one
  to look like that one. Do not grow it into a query tool — search-and-replace is now Task 389 and
  is a better fit for its own job, so the two ship side by side rather than one becoming the other.

- 75|322| **Convert standing advisories into checks, and survey for the ones nobody has named.**
  Tom, 2026-08-25: *"322 convert to scripts and include a broad survey for other such
  recommendations."* Record, ranked list, per-runner audit: `dev/enforceable-rules-survey.md`.
  - **HALF A IS DONE.** 78 enforced, 4 left (rows 13, 14, 22, 23), each stating why no blocking
    `check_all.sh` entry can hold it. Three landed rows found the RULE wrong, not the code.
  - **HALF B IS OPEN AND ITS METHOD IS NOT RE-READING.** Re-reading `CLAUDE.md` cannot find a rule
    nobody wrote down. Row 32 came from COUNTING a construct and asking what writing it 892 times
    assumes; rows 35-38, 40-44, 48-50 and 54-56 came the same way and none from re-reading.
  - **A RATCHET AT ZERO IS THE FINDING.** A rule followed and enforced by nothing is invisible to
    every audit that looks for defects. Where the tree HAD violated one it had usually decided the
    question twice in opposite directions (rows 38, 44, 49) -- an unwritten rule from outside.
  - **2026-09-09 gave rows 54-56:** 4 of 28 JS physical constants were rounded decimals, one of them
    carried in `dev/session-handoff.md` as an open question rather than as a defect; 199 harnesses
    pin English wording, so a rewording costs a red build in a file about hydraulics; and 28 of the
    29 keys reaching the tip helpers' `title=""` were unbound by rule B.
  - **WHEN THE ANSWER IS NO, SAY SO IN A ROW** -- 34, 39, 45-47, 51-53 are measured negatives.

- 99|539| **Gang the neighbour labels so their leaders stop crossing.**
  **DROPPED TO 75 BY TOM, 2026-09-17** (*"Task 539: Demote to 75"*). Built on
  `feat/label-gang-search`, port 8090, and **he has notes on it he has not yet been able to
  write up** -- so the branch waits on his reading, not on more building.
  Tom, 2026-08-26, on a screenshot of two crossing leaders: *"when it looks so easy (to a human) to
  resolve, it's embarrassing."* All three phases are built and measured; every measured view of
  every shipped example is at **0 crossings**, at a cost of 38 hidden labels across 28 views.
  Numbers, both of his routes, the flicker repair and the measurement defect found with it:
  `dev/label-placement-algorithms.md` §8-§11d.
  - **START THE BRANCH. Tom, 2026-09-15: *"I would want to get this branch started on the grounds
    that having a better network model could improve our performance placing labels."*** That is a
    better reason than the one `spot_prime` was parked on, and it supersedes it. The case against
    was that none of the five residual pairs is a gang with free labels and open ground, so a search
    could fix none of them -- true, and it measures the wrong thing. **His argument is that the
    MODEL is the asset**, not this week's crossing count: a count already at zero cannot show
    whether the placement is GOOD, only that it is not embarrassing.
  - **The five pairs left anywhere have BOTH halves hand-placed by the user, and an automatic pass
    may not hide a hand-placed label.** That bounds what the branch may touch; they are named by id
    in the harness.
  - **HIS SPOT_PRIME MODEL WAS NEVER GIVEN A COLLEGE TRY, AND HE ASKED WHY ON 2026-09-21**: *"I
    don't understand why we are spending effort on the rings model instead of giving the spot-prime
    box model a good college try."* **The honest answer is that of his four steps only step 4 was
    built** -- ordering a stack by the angle of the node each label belongs to, which shipped as the
    gang route. Steps 1 to 3, finding the prime open ground and sizing `box_est` in it, were not,
    because `dev/label-placement-algorithms.md` §9d says *"Not settled, and his own flag: how
    `spot_prime` is found. Report back before building it"* -- **and nobody ever reported back**,
    though he had written *"I waved my wand over finding spot-prime; if it's hard, let me know."*
    The rings work got the effort because it was reachable. That is a reason about us, not about
    the two models.
  - **THE FIRST STEP IS CHEAP AND IS ALREADY HALF PRESENT (his R-079):** the node's table of every
    gap between its pipes is already computed and already survives a zoom, and the code then throws
    all but the biggest away. **Publishing it as a RANKED LIST instead of a single winner is a
    change where it is consumed, not a new model.** Not built yet, and it is step 1 of the
    spot_prime hunt rather than a separate errand. Do that, then report back on how spot_prime is
    found, which is the thing he asked to be told.
  - `dev/lpn-spike/label-stability-harness.js` asserts the LAYOUT and the shed's victims rather than
    the count, so a model change that oscillates is caught instead of averaged away -- which is how
    the A B A B A flicker got through the first time. §9b is `spot_prime`; §10c and §11e are his.

- 75|239| **The English-friction loop: run the mechanized Wave 0 and measure its yield.** The
  mechanism shipped 2026-08-08 — an adversarial English pass asking *"list every plausible reading;
  more than one means rewrite"*, both waves writing to `dev/english-friction/<sprint>.json`, with
  `friction_check.php` blocking sprint *launch* on wave-0 findings and sprint *close* on translator
  findings. `refer-to-human` deliberately does NOT close the gate; escalating is not resolving.
  - **Why it exists: `lpn_` HAD a Wave 0 and it did not work.** Task 193 reviewed all 226 English keys
    and rewrote 51, and the sprint still shipped "Zoom to fit", "Map display and sizes" and "Restore
    defaults" — all three caught later by Tom reading the *Spanish*. Wave 0 was not skipped; it was
    not falsifiable. The fix had to be a different QUESTION, not more diligence.
  - **THE YIELD IS MEASURED TWICE NOW, AND IT DEPENDS ENTIRELY ON HOW SETTLED THE ENGLISH IS.**
    `lpn_`, freshly-written feature UI: 36 findings on 225 keys, **26 rewrites (11.6%)**.
    The fifteen non-lpn calculators, mature label sets already through a completed review
    (`239-wave0-calcs.json`): 35 findings on 415 keys, **6 rewrites (1.4%)**, dismissal rate 37%
    against a 9.8% historical wave-0 rate. **Budget a Wave 0 at the `lpn_` rate for NEW English only.**
    One of the six was still a real catch — `mphl_hgl_egl_tip` would have produced a false sentence in
    26 languages.
  - **DONE — `wave0_keyset.php` assembles the pass set and pre-filters keys that already carry a
    non-empty `$ec_lang_syn`** (104 of 582 non-lpn keys, 17.9%). Replayed on `239-wave0-calcs.json`:
    9 of 35 findings skipped, dismissal rate 37% → 23% (the prediction was ~21%). **It also skips
    one confirmed rewrite, `mtc_note_1`** — so the skipped set is enumerable (`--skipped`) and is a
    cheaper second look, never a key ruled correct. `--measure=<sprint>` redoes the arithmetic.
  - **DONE — the suggestion box now ships inside every payload** as `suggestion_box`, extracted by
    the generator from the one canonical block in `dev/translation-process.md`. No longer retyped
    per sprint; the generator fails hard if that block goes missing.
  - **[H] The escalation gate works, and it is down to ONE entry (2026-09-06).** `friction_check.php`
    exits 1 on any `open` or `refer-to-human` finding; it is not in `check_all.sh`, so it blocks no
    commit and blocks every sprint launch. `239-wave0-calcs.json`'s 16 are all dispositioned, and
    what remains is **`lpn_scncmp_at` in `584-wave0.json`** — Tom asked *"I need more context. Where
    is this used?"*, which is answered in that entry's `resolution` (one cell of Water, Scenario
    comparison), so the gate is waiting on his ruling and on nothing else.
  - **AND HE ANSWERS IN `dev/new-english-keys.md` NOW, not in a second file.** The open findings are
    printed into that list's own "Questions from the translators" section, under the same
    `@@ NEEDS RULING` flag as everything else, and `harvest_english_rulings.php --apply` carries his
    answer back into the JSON's `human_answer`. Two lists was one list somebody forgets;
    `239-refer-to-human.md` is the superseded route and is kept only as the record of its sprint.

- 75|441| **Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with
  autohide.** Tom raised it 2026-08-18 without asking for it yet. Nothing in the box is designed
  against it — one element, one placement function.

- 50|498| **A public roadmap, with epanet-js's Canny board as the worked example.**
  Tom, 2026-08-23: epanet-js runs one at `roadmap.epanetjs.com`, powered by Canny. Noted as an
  example to weigh, not a decision. The thing to weigh is that `dev/ROADMAP.md` is written for us and
  says things a public board should not (measured costs, what Tom is not proud of, who to ask), so a
  public board is a SECOND artifact to keep current, not this one exposed.

- 75|578| **Fire flow: the EPS frame and the Run concept, extracted from 530.**
  Everything else in Task 530 shipped and that task is closed. Two phases were never built and are
  kept here so they are not lost in a closed block.
  - **Picking an EPS frame.** The sweep answers one instant. A project with a clock has many, and
    the honest question is which one a fire flow is checked at -- maximum day is the convention, and
    the page has no way to say "run the sweep at hour 14".
  - **The Run concept, in Tom's own sketch (2026-08-27):** *"a Run names a scenario among its
    parameters."* A named Run would carry the scenario, the required flow, the residual and the
    frame together, so a report says what it was a report OF.

- 75|617| **More map view options, the opacity one having shipped.**
  **RETITLED BY TOM, 2026-09-18: *"Edit and retitle the task to remove 'A basemap the reader can
  tone down'. That is already provided by Settings background opacity. Focus the task on other map
  view options."*** Half of what this asked for exists; what is left is the menu of tile styles and
  whatever else belongs beside it.
  Tom, 2026-09-09: *"Let's make a task to play with some additional selectors for the user including
  some that are understated such as you suggest. FWIW, we are non-commercial."* Full costing of every
  route, with named services and their terms: `dev/basemap-styling-options.md`.
  - **START WITH A CSS FILTER, because it is free in every sense that matters here.**
    `grayscale(60%) contrast(0.9)` on the tile layer is a display-time transform: nothing new is
    fetched, nothing cached, nothing redistributed, no new host, no consent gate, no `privacy.php`
    paragraph. Attribution is separate DOM, so the credit stays bright while the map recedes. No
    authority was found either way on whether a filter touches the OSM tile policy, whose concerns
    are serving, caching, bulk download and visible attribution.
  - **Second cheapest is a Mapbox Studio raster style on the token already declared** -- same host
    as satellite and terrain, so it is a peer of the existing satellite row rather than a fifth
    purpose: no new gate, no new cookie, ~3 keys.
  - **A NEW TILE HOST IS THE EXPENSIVE ONE and the non-commercial point does not settle it.** Every
    free tier is framed non-commercial AND reserves classification, and nobody has asked any of them
    whether a free GPL public tool qualifies. Price under this suite's own rule: a new gate cookie,
    a version constant, a `wipeAllStorage()` hook, a `privacy.php` paragraph, the "four third-party
    requests" count becoming five in three files at once, and ~5 English keys, so ~130 translated
    strings. `consent_body` is NOT touched; each feature asks its own question.
  - **MapLibre GL JS is not worth it**: ~750 KB gzipped, a WebGL dependency under
    `vendor_integrity_check.php`, and a second canvas with its own projection state fighting the one
    opinion about Mercator that `js/looped-network.js` owns.

- 75|623| **File loss judged only by people whose files are throwaway.**
  **TOM, 2026-09-18: *"I don't see anything actionable. Describe better or remove the task."* He is
  right and the [H] tag is struck: this was never a decision waiting on him, it was a STANDING
  BIAS with no next step written down.** The one actionable thing in it, stated plainly: **nobody
  who has tested this page has had anything to lose.** So the ask is a test by somebody with a real
  file -- his own EWB work is the nearest candidate -- and until that happens there is nothing to
  build. If that reads as not worth keeping, remove it; it is a reminder, not a task.
  Tom, 2026-09-10, after a reload appeared to break the project he had open: *"I am merely testing
  examples. But I also am trying to take file loss seriously in a way that I had not sufficiently
  done previously ... I have been oblivious to file loss because everything is throwaway."*
  - **THE MECHANISMS EXIST AND SOME ARE TESTED, which is why this is a blind spot and not a hole.**
    `beforeunload` prompts on a dirty file project; closing a browser-only one says *"it is gone for
    good"*; `writeOpenProjectToFile()` refuses with no handle and when read-only, so it can never
    write our older copy over a colleague's newer file; `dev/lpn-spike/handle-restore-harness.js`
    asserts the reconnect/pending/drop table. **What has never happened is somebody running these
    paths with something to lose** -- the scale blind spot's shape, in another subject.
  - **WHAT HE HIT WAS BY DESIGN AND THE STRING IS WHAT MISLEADS.** A reload cannot carry the
    browser's write PERMISSION, so the handle returns `'prompt'`, the project warns
    `lpn_file_needs_reopen`, ONE CLICK restores it, and a reload never writes the file. That string
    says *"the connection to that file has been lost"* -- loss, rather than a permission the browser
    drops on purpose. Cheapest item here, and it made a working page look broken.
  - **THE ONE REAL GAP: the post-reload window.** While a handle is pending, edits autosave to
    `localStorage` and the disk file silently falls behind, with nothing stating the divergence.
  - **THE EXPOSURE IS BOUNDED, which is the answer to "has this been happening all along?"**
    `dev/usage-data-log.md`'s REPEAT USE instrument fires when a browser left WORK behind -- on this
    page, a saved project DOCUMENT. Looped-Network: **20 people shopped, 4 returned to their work**.
    So the population that ever had a project to lose is order 20 in the measured window, and the 4
    who came back FOUND it -- the row exists because the document was still there. Consenting
    visitors only, so it is a sample and bounds the exposure rather than proving nothing was lost.
  - **NEXT IS A SCENARIO LIST, NOT A FIX.** Enumerate how work is lost -- reload without
    reconnecting, close without saving, storage evicted, quota exceeded mid-autosave, two tabs,
    denied permission, a file moved under us -- rule each ACCEPTABLE or DEFECT, then build.
  - **OCCURRENCES ARE RECORDED IN `dev/lpn-blank-map-incidents.md`, one dated entry each.** A second
    one was reported 2026-09-10 and is UNCLASSIFIED: the console showed no `looped-network.js`
    error at all, so an uncaught exception during `init()` is excluded for that occurrence, and no
    storage state was captured before the tab was closed. `dev/scripts/lpn-forensics.js` is the
    read-only console paste that answers the scenario list in one go -- run it on the next
    specimen BEFORE closing the tab.

- 50|625| **The app page divorce: what is left is one unanswered question.**
  **TOM, 2026-09-18: *"I don't see anything actionable."* Correct -- the build shipped on 2026-09-11
  and this row has been carrying its own history rather than a next step.** Dropped to 50 and the
  [H] struck. **The only thing genuinely open is whether the app page should carry any link back to
  the suite's other calculators**, which nobody has asked him and which costs nothing to leave as it
  is. Everything else here is the record of a finished job and belongs in the closed ledger the day
  he says so.
  **SHIPPED AND DEPLOYED 2026-09-11.** `echoHeader("EngCalcsApp", ...)` suppresses the suite navbar
  and the H1/welcome block, keeping the CSS and JS. **NO H1 at all**, on Tom's ruling
  (*"app.epanetjs.com has no h1 ... this is not a storefront page"*, verified). Install and the
  Language picker MOVED rather than went; the other 15 calculators are untouched. The Hydraulics
  menu and all eight "See also" lines now read LibreWaterNet.org, same tab, and
  `Looped-Network.php` is declared in `EC_MENU_EXEMPT_CALCULATORS` -- that check's premise, "no
  visitor can reach it", is false for the page that IS librewaternet.org's front door.
  - **THE MENU BAR IS SETTLED. DO NOT REOPEN IT.** The far-left tower went link -> Mac-style menu
    -> link in one day and Tom called it (*"we are chasing our tail"*). It is a LINK, tipped
    "Welcome page, LibreWaterNet.org"; Help holds the commands. Three citable reasons, not
    remembered ones: macOS has TWO slots (Apple menu, and a separate bold app-name menu holding
    About) and we merged them; VS Code puts About in HELP on Windows and Linux; and two of three
    testers never found the menu bar at all. These users are on Windows. Full citations:
    `dev/help-menu-mastermind.md` §9. **Not EPANET did NOT come back with Help's other rows** --
    that ruling was written before not-epanet.org was retired, and the harness asserts its absence.
  - **STILL OPEN AND HIS:** the About box's words are written but `About.php` (the SUITE's about,
    for the other 15 calculators) still says what it always did. Ida's remaining items are the
    responsive merge above ~1750 px and her first-visit cue's real-world verdict -- the cue is
    BUILT, hidden below 640 px on his instruction, and unvalidated by eye.
  - Measurements behind all of it: `dev/chrome-audit.md`,
    `dev/app-chrome-postdivorce-recommendations.md`, `dev/help-menu-mastermind.md`.

- 75|637| **A Graph button on the Properties box.**
  Tom, 2026-09-12. Graphs the time series of the CURRENTLY FOCUSED property of the current element,
  in a new bottom-pane tab named for what it shows -- his example, `L435 Lake Trace`. The tab
  carries a selector for the property to graph and an Export as: image PNG, PDF, comma-separated
  values CSV, spreadsheet ODS. It may carry a time-range selector. Shape and the two unknowns
  (PDF and ODS are formats this suite has never written): `dev/graphs-scope.md`. Task 640 is the
  menu this belongs to and Task 599 is the plot itself.

- 50|643| **The camel behind grid-to-ground: slope distance and a length adjustment.**
  Tom, 2026-09-13, answering the projection brief's question about grid versus ground length:
  *"this is straining at a gnat while we are swallowing the camel of slope distance, pipe dips, pipe
  depth, some of which are trivial, but all of which are usually much more of a factor than grid to
  ground."* **This task is the camel**, and Task 641 is gated on it in one respect: ground length is
  computed there but **nothing about length accuracy is claimed in public until this exists.**
  - Two candidate controls, neither decided: a **project-wide setting to use slope distance for
    automatic lengths** (we have elevations, so the arithmetic is free), and a **length adjustment
    for unmapped bends** -- *"length factor"* or *"length increment"* -- at asset level, project
    level, or both.
  - **WHO DECIDES IS NAMED AND IT IS NOT US:** *"Only Sue knows. Or only our human connections
    know."* Ask the `utility-planning-engineer` seat and a real surveyor before choosing between a
    factor and an increment; the difference matters to whoever has to defend a length in a report.

- 75|645| **The app icon's legs are leggier than the favicon's.**
  Left open when Task 615 closed 2026-09-13, and flagged for Tom rather than decided. The app
  icon's legs are **21.5% longer relative to the tank** than `icons/favicon.svg` draws them.
  - **THE TWO RULES ARE MUTUALLY EXCLUSIVE AND THAT IS WHY IT IS OPEN.** A maskable icon must keep
    its body inside a circle of 80% diameter; Tom's own ruling says descenders reach the bottom.
    Any point on the frame edge is >=12 units from center against a 9.6 safe radius. The body is
    scaled 0.85 and the descenders run to the true edge, so both rules hold, at that proportion cost.
  - Shipped on the coordinator's judgement. It reads as the same mark and is visibly leggier.
    The fallbacks are a smaller safe margin or a second shorter-legged tower drawn for the maskable
    pair alone. `dev/icon-preview/ship-notes.md` has every measured distance.
  - **NOT urgent and possibly not worth doing:** Tom on the favicon, *"Favicon as it stands is my
    one true love."* Only the app icon is in question, and only when installed.
  - **TOM 2026-09-21 TIES 645, 648 AND 679 INTO ONE PIECE OF WORK: the beauty of the LARGER water
    tower.** *"promote to 75 and cross reference mutually and with 679 as a single task to work on
    the beauty of the larger versions of the water tower icon. The app has a shortcut icon and a
    splash screen icon that could be really beautiful, as can the Help, About icon. We want to
    achieve more beauty and nostalgia for that small-town iconic water tower 'My home town water
    tower', with realistic legs, catwalk, and maybe even seams and rivets for the installed app
    splash screen."*
    - **THE BRIEF IS NOSTALGIA, NOT FIDELITY**, and the phrase to design against is his own: *my
      home town water tower*. Legs, catwalk, and at the largest size seams and rivets.
    - **SIZE IS THE WHOLE POINT.** The small icon must stay legible at 16 px and is a different
      drawing from the splash screen, which can carry detail. Do not let one drawing be scaled to
      serve both -- that is what makes the big one look empty.
    - See also Task 648 and Task 679.
- 50|146.09| **An inset overview map: the whole project, with a box round where you are.**
  Reworked by Tom 2026-08-25, and it is a different feature from the one this ID used to hold:
  *"146.09 reworked as a key/overview map inset like many games where the entire project is depicted
  as a thumbnail with the current window box placed on it for 'Where am I?'"*
  - **The question it answers is orientation, not detail** — "where am I in this drawing", asked by
    somebody zoomed in far enough to have lost the shape of the whole. That is a different question
    from the old version of this task, which was insets that MAGNIFY congested areas.
  - The pieces exist: `bbox()` gives the whole extent, `currentView()` gives the visible rectangle in
    world units, and the drawing is already a `<g>` that can be rendered at another scale. The work
    is a small always-on overlay, a viewport box, and — probably — click-to-go-there.
  - **It is a natural companion to the phone work**, where the screen is small enough that being lost
    is easy, and it is exactly the moment the label passes are already hiding text.

- 50|217| **A suite-owned, multilingual Manning's n table, built from primary sources.** Tom,
  2026-08-05: *"No collision, but I am not into ownership/maintenance. If there is any viable way to
  outsource, I prefer it. But if we can add multilingual value with an n table, I'm game. Let's just
  be careful and intentional."*
  - **The case.** `Manning-Pipe-Flow.php` and `Manning-Trap.php` both send the roughness input off
    site to `engineeringtoolbox.com/mannings-roughness-d_799.html` — English only, ours to lose, on
    the two calculators carrying the great majority of our humans. In 26 languages it is a search
    front door rather than a leak. **Gate it on Task 216's number**; build the instrument first.
  - **The maintenance worry has an answer: freeze it.** Chow 1959, USGS WSP 2339 and FHWA HDS-5 are
    static data that have not moved in decades. What creates maintenance is editorial ambition —
    photographs, user submissions, regional variants, a "suggest a value" form. Ship none of that.
    **The honest cost is TRANSLATION**: a lot of short material names, so scope it against Task 203.
  - **DO THE COVERAGE COMPARISON FIRST, not at review time** (Tom: *"I would want to confirm that our
    table is similar to the one I selected long ago to link."*). Two obligations that point in
    opposite directions and both must hold: match the linked table's COVERAGE material for material,
    but CROSS-CHECK its values against primary sources rather than copying them — reproducing a
    published table verbatim is a copyright question, compiling from cited primaries is not. **A
    disagreement is a finding to record, not a number to quietly overwrite.**
  - **If the tables come out essentially identical, that is a legitimate reason NOT to build it.** The
    case rests on multilingual reach and on owning the reference, not on the existing one being wrong.

- 50|218| **Find advisors and proteges: a standing, nagged commitment.**
  Not a task that completes. Tom, 2026-08-05: *"I still need help knowing where to try to connect with advisors and proteges;
  this is not my strength. r/civilengineering is mostly frivolous talk."* And the same day: *"This is
  not my strength or passion. I'll want you to hold my hand and push me to 'eat my veggies.' I may
  have to get in my car and go to lunch. I will need pushing."* **So the nagging is authorized and
  requested.** Raise this unprompted when it has gone quiet and propose ONE concrete action with a
  name and a date — "email this chapter's faculty advisor this week", never "you should network more".
  - **ADVISORS AND PROTEGES ARE TWO DIFFERENT LISTS AND NO VENUE SERVES BOTH**, and conflating them
    is probably why Tom said he did not understand this item. Every proposed action must say which of
    the two it is aimed at. **Venues, expected returns, and what is still unverified:
    `dev/outreach-venues.md`.**
  - **ACTION LOG.**
    - 2026-08-05 — OWA Q&A post SENT (advisor side); text and venue facts in
      `dev/outreach-owa-post.md`. Quiet room — weeks of silence is the expected case, not a failure.
    - 2026-08-05 — EWB-ASU contact form SUBMITTED (protege side). Submission not confirmed; Tom:
      *"I think it's submitted. The form acts a little weird."* **CHECK: 2026-08-19.** If silent by
      then the backstop is email, not a drive: **Jared Schoepf, `jjschoep@asu.edu`**, who directs
      EPICS — a larger and more durable protege pool than one club, and a faculty contact persists
      across years while student officers turn over every May.
    - 2026-08-11 — EWB-ASU ANSWERED (protege side). The form did submit; the Jared Schoepf backstop
      was not needed and stays on the shelf. Details and next step in Task 269.
    - 2026-09-02 — **THREE REPLIES IN ONE DAY, from individual outreach Tom sent himself.** EWB
      Phoenix Professional invited a talk and offered an EWB-USA introduction (protege side, Task
      269); EWB-ASU restated it is forming a team (protege side, Task 269); **Francisco Bobadilla
      answered on the advisor side** — the first one this item has ever produced.
      **What Francisco asked for is a demand reading, and it lands on shipped features:** scenarios
      and fire flow *"the same way as WaterCAd does it"*, both of which exist (Task 530's sweep
      shipped 2026-08-29). He said he will test and send ideas. **Ask for that list if it does not
      arrive** — a colleague who will answer is worth more than the whole usage instrument on the
      question of why somebody wanted the page.

- 50|221| **Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.** Delete
  `<prefix>_notes_epanet_term`/`_def` from `Hazen-Williams.php`, `Branched-Network.php`,
  `Looped-Network.php` and all 5 lang files (en, es, pt, fr, tr). A dated "we changed this" note is
  useful for about a year; after that it is archaeology in a user-facing Notes list.

- 50|234| **Canal Seepage must prove its worth or go.** Tom, 2026-08-08: *"in my crosshairs"*. After
  Task 232 removed `Irrigation.php`, `cs_` is the remaining page Tom is not proud of — his standing
  position is that it was AI momentum rather than a real need, and it is already under a
  do-not-promote (never propose it for links, outreach, or feature work).
  **The 2026-07-27 numbers are the case against it:** reach 1,746, confirmed humans **6**, used
  **0** — a 0% conversion, tied with Orifice-Drain-Time for the worst in the suite.
  **Decide with one more data point, not on feeling:** pull `cs_` again in the next usage snapshot.
  If humans are still single digits and `used` is still 0, remove it the way 232 was removed — page,
  `sw.js` line, and all `cs_` keys across 27 files, which is the larger prize since `cs_` is a much
  bigger key set than `irr_`'s 17. If it has real users, it stays and the embarrassment is a quality
  problem to fix rather than a deletion to make.
  **One caution 232 did not have:** `Canal-Seepage.php` is linked from the Hydraulics menu, so unlike
  `Irrigation.php` it has a real in-site path. Check what that contributes before assuming the
  numbers mean nobody wants it.

- 50|269| **Both EWB chapters answered, and Phoenix invited a talk.**
  Tom, 2026-08-10 — human replies to outreach, and he has replied gratefully. This is the first real
  conversation this suite's mission has earned; prepare and record what comes of it. Not a
  search-reach task, but it lives here because it is the same goal reached by a better road.
  - **EWB-ASU is theirs to move.** Ahadu Tsotaselassie Assegued, 2026-08-11: *"we'll keep you posted
    once we set our team up."* Waiting on a student team forming, so nudge in the fall, do not chase.
  - **EWB Phoenix Professional is OURS to move, and it has a cadence.** Dane Whitmer, PE, 2026-09-02:
    *"I would love for you to come to our meetings and share about your software"* — 3rd Thursday
    monthly, ACEC office downtown Phoenix, virtual option, plus an offered introduction to EWB-USA.
    **The action is to pick a month and call him**, and the introduction is the larger prize: EWB-USA
    reaches every chapter at once, which is the same leverage a faculty advisor has over a club.

- 75|282| **Offer to attach the backdrop an imported `.inp` names.** An `.inp` (and a `.net`) stores
  only a PATH to its background picture, never the picture. The import reports the file name and
  tells the user to add it with Map, Backdrop; it could instead offer a picker right there, seeded
  with that name, and set the map extent from the file's own `[BACKDROP] DIMENSIONS` so the image
  lands registered rather than needing the two-point scale gesture. Low priority — a user who wants
  the picture already knows where it is, and Map, Backdrop already works.
  - **Worth more than it was, 2026-08-11.** The models Tom is collecting name BMP backdrops, which
    browsers can actually display, so "the file it names is one you could hand over right now" has
    gone from hypothetical to the common case. The registration half is the valuable half: an
    `[BACKDROP] DIMENSIONS` record places the image in the model's own coordinates exactly, which
    is strictly better than the two-point scale gesture a human would otherwise perform by eye.

- 50|285| **We do not know what devices anybody uses this on.**
  Several decisions have quietly assumed an answer. Tom, 2026-08-11: *"we don't know whether anybody uses this on a phone."*
  **Instrumented 2026-09-08, not yet read:** `log-human-view.php` and `log-calc-event.php` carry
  `pointer: coarse|fine|''` as a fifth column and the report prints it as its own DEVICE tier. Every
  row on file predates it; the first reading is the next weekly report. Close this once one has been
  read into `dev/usage-data-log.md`. Until then the sentence below still describes the record.
  Before that date the two writers recorded **page and language and nothing else**, so
  there was no device signal anywhere in this project's instrumentation — every touch-target,
  breakpoint and two-pane-layout argument ever made here has rested on a guess.
  - **Not a small guess.** "Touch-friendly" is load-bearing in the suite's own conventions (the
    whole-label `.ec-help` tap-target rule exists for it) and Task 284's layout hinges on it. All of
    it may well be right; none of it is measured.
  - **The cheapest honest signal is a COARSE one, and it should stay coarse.** A full user-agent
    string is fingerprinting-grade data on a suite that offers a logging opt-out and takes it
    seriously. One bucket per event — `pointer: coarse|fine` from a media query, or a viewport-width
    band — answers the question without identifying anybody, and is a one-field addition to the
    existing beacon.
  - **Decide what the answer would CHANGE before collecting it.** "Almost nobody" means we stop
    paying for phone-shaped compromises on `lpn_` specifically, which is a real design freedom rather
    than a disappointment; "a third of them" makes several open tasks much more urgent.
  - Add the reading to `dev/usage-data-log.md` as its own tier, not folded into reach/shopping/using.

- 50|544| **[H] epanet-js is implicitly claiming to be EPANET, and we have now decided.**
  **THE ANSWER ARRIVED 2026-09-06 and it is Task 591**: we do not fight fire with fire, we build a
  site whose subject is our own dependence and our own gratitude, and we let that stand as the
  contrast. Nothing here is a grievance and the school of thought that said "do what they do" is
  not the one taken. What is LEFT in this row is only the thing it originally recorded: that the
  behaviour was observed, and that `dev/positioning.md` remains the authority for every sentence.
  Tom, 2026-08-26, and he calls it socially difficult: *"epanetjs is legally, but unethically,
  implicitly claiming to be epanet. For example, they have a Youtube video posted with the title
  'Fire flow analysis with EPANET'. We need to note this because one school of thought says that we
  should fight fire with fire. Our school of thought may be contrary. But we aren't going anywhere
  without users, and apparently the name EPANET is gold."*
  - **This is recorded rather than acted on, deliberately.** `dev/positioning.md` is the authority
    for every public claim and it leads with the invitation, not the comparison. Nothing here
    changes that without Tom saying so.
  - **He is considering help:** *"Maybe I need to get human advisers. But a marketing specialist
    agent might not hurt."* A marketing seat would have to carry outside evidence, like every other
    seat (`dev/agents/README.md`), not just an opinion about names.
  - **AND HE HAS WRITTEN THE POSITIONING SENTENCE HIMSELF**, which is the most useful thing in this
    block: *"Semi-retired senior water engineer with a body of established software and online
    calculators seeks radical volunteer engagement."* That is a personals ad, it is honest, it says
    who is asking and what for, and it does not mention anybody else's product.
  - **AND HE IS CONSIDERING LEANING INTO IT, 2026-09-05, which is a different school from the one
    this block was opened in.** Tom: *"I have been considering leaning into the 'Not EPANET' brand,
    maybe with a NotEPANET.org domain and maybe with 'Not EPANET' and 'The Un-EPANET' in video and
    blog titles. That feels deeply honest and quietly rebuking of name dropping while all the while
    invoking the EPANET name for SEO."* **He has registered `NotEPANET.org` and `Not-EPANET.org`.**
    Nothing is built or claimed on either yet, and `dev/positioning.md` is still the authority for
    every public sentence -- a brand that names somebody else's product is exactly the kind of claim
    that file exists to gate. The market-researcher seat is the one to ask what "Not X" branding
    actually earns, and whether it reads as honest or as trading on the name to anyone but us.
  - **HE HAS STARTED, 2026-08-26:** *"I started using that appeal today, and I joined the
    EPANET-USERS listserv to ask about hydrant modeling and more later."* So the sentence is in use
    and there is now a channel to real practitioners. **That listserv is also the place the fire-flow
    questions in Task 530 could be answered by people rather than by search** — the emitter posture,
    and whether anyone models the assembly at all.

- 75|600| **The three EPANET plots we do not have: contour, frequency, flow balance.**
  Tom, 2026-09-06, surveying EPANET's plot menu: *"time series, profile, contour (very cool),
  frequency distribution ... and system flow balance."* **We already have PROFILE** (`lpn_profile_*`)
  and time series is Task 599, so this row is the remaining three.
  - **CONTOUR is the one he starred and is also the one with a real unknown**: it interpolates a
    nodal value over the plane between nodes, so it needs a decision about what happens where there
    are no nodes -- a pressure contour across a river a main crosses is drawn over nothing.
  - **FREQUENCY DISTRIBUTION is nearly free** and would be the first slice: a histogram of one
    property over one element type is a sort and a bucket count, no interpolation and no geometry.
  - **SYSTEM FLOW BALANCE -- AND HIS READING OF IT IS RIGHT, but confirm it against EPANET's own
    help before writing a word of interface.** He guessed *"produced comes from reservoirs and
    negative demands and consumed is positive demands"*; that matches how the engine accounts for
    it, and a tank is the third term, swinging between the two as it fills and drains. Getting the
    definition wrong here is a number a user would believe.

- 75|601| **Calibration files: measured field data, against the model that predicts it.**
  Tom, 2026-09-06: *"EPANET allows calibration files (measured system data) and offers a Calibration
  Report with three tabbed pages. See EPANET help. Very interesting to be aware of."*
  - **THIS IS THE FIRST FEATURE THAT BRINGS IN DATA FROM OUTSIDE THE MODEL**, which is why it is
    filed at 50 rather than as an afterthought to the plots: every number on this page today is
    either typed or derived, and a calibration file is neither. It has its own format, its own
    units question, and its own answer to what happens when a measurement names a node that is not
    in the network.
  - **READ EPANET'S HELP FIRST AND COPY THE REPORT'S SHAPE.** Three tabbed pages is a design that
    has been in front of users for twenty years; we have no evidence that beats it, and CLAUDE.md's
    default-to-EPANET rule applies to the vocabulary as much as to the layout.
  - Depends on nothing, but it is worth far more once Task 599 exists: a measured series and a
    computed series belong on one axis, and that axis is the time-series plot.

- 75|604| **Read an EPANET `.PRO` profile file.**
  It is the only route a profile can arrive by, and it falls out of closing Task 574. **A profile is in NO `.net` and no `.inp`** -- EPANET's Graph
  Selection dialog writes its node list to a separate `.PRO` text file through an ordinary save
  dialog, and nothing anywhere records the path, not even an MRU entry. So a user who has built a
  profile in EPANET cannot bring it here by opening their project, and never will be able to.
  - The format is small: an identifier line, then one node ID per line. The work is the
    reconciliation -- what happens when a listed ID is not in this network -- and that answer is
    already written for the calibration files of Task 601.
  - Worth far more once Task 603 lands: an imported profile that cannot name its own nodes is a
    line on an axis.
  - **IT GETS A MINUSCULE SLICE OF THE INTERFACE, on Tom's ruling of 2026-09-06:** *"Creating a
    profile is so easy now using the Google paradigm that I don't think there is much value in
    importing a `.pro` file. If we do it, it needs to take up miniscule space in the UX/UI, hidden
    deep under some menu or in the profile tab down arrow."* So the acceptance bar is a row in an
    existing menu, never a control on the profile panel itself.

- 99|610| **[H] Paste that CREATES table rows: gated on the data-entry clerk's own spec.**
  **TOM PROMOTED THIS TO 100 ON 2026-09-21**, in the same breath as refusing to let Declan's
  performance win read as the bigger story: it is his top item *"because the network has to exist
  first."*
  Split out of Task 186 at its close (2026-09-08). Tom, the same day: *"Why would we want a paste
  that creates rows? ... I thought that the reasoning for not doing that was very good"*, then,
  having read the clerk's wish list, *"I am sympathetic."* His conditions, which are the whole
  task: the Junction table gains the project's location coordinates (xy, or lat,lon) as columns;
  a paste that ADDS is refused unless every row carries an ID that validates as non-duplicating,
  and a link row names two existing nodes; and pipe vertices need a stated cell format, which the
  `data-entry-clerk` must specify (*"there is no point in our guessing it"*) before anything is
  built. Ctrl+Shift+PageUp/PageDn to the next table (*"lower priority, but very cool"*) rides here.

- 50|614| **The sewer-slope cluster is the largest demand we do not convert.**
  Raised by Tom, 2026-09-08. Measured twice, 2026-07-27 and 2026-09-07, and unmoved: sewer, drainage
  and slope queries with no "manning" in them are 190 queries, 3,557 impressions, 60 clicks —
  **1.7% CTR against Manning's 27.9%** — and the biggest single loss is *"4 inch sewer pipe minimum
  slope in mm"* at 505 impressions, 3 clicks, position 6 (`dev/usage-data-log.md`).
  - **IT IS NOT A CONTENT GAP.** `sewslope.php` has answered that exact query since Task 151: 4 in /
    100 mm reads 8.4 mm/m and 0.84% in Table 1, in the units asked for. We rank 3–10 and are not
    clicked, so more table answers what is already answered. Task 158 is these same two pages on the
    language question, which is a different one.
  - **DIAGNOSE BEFORE BUILDING: three hypotheses, three answers.** Position 3–10 is not enough for a
    table query; or the SERP answers it itself by featured snippet or AI overview, so the click is
    not on offer, CTR is the wrong target and doing nothing is correct; or the title does not use
    the searcher's words (the H1 is "Minimum Sanitary Sewer Slopes"). Reading the live SERP for
    those queries decides which, and `market-researcher` is the seat that can look.
  - **The page is in no repository** — `~/webdev/hawsedc.subset/` is a hand-kept subset, not a
    checkout — so an edit ships by hand, and clicks split across `hawsedc.com` and `www.hawsedc.com`.

- 50|620| **[H] A changed icon never reaches a returning visitor.**
  The precache cannot invalidate it. Found 2026-09-10, the day the water tower shipped: it appeared instantly on librewaternet.org and
  not-epanet.org and NOT on the app. Tom: *"I see it at LWN and NOT, but not at lpn."* Ctrl+F5 fixed
  it for him, which no ordinary visitor will do.
  - **The cause is a deliberate design with one uncovered case.** `CACHE_VERSION` was removed on
    purpose (`lib/ServiceWorker.lib.php`) and invalidation rides entirely on `?v=<filemtime>` in the
    URL, so a changed file changes its own cache key and nothing has to be remembered. But
    `ecSwAssetUrl()` deliberately puts no query on an image, because `<link rel="icon">` and
    `manifest.json` name icons without one -- and `ecSwAssetFiles()` precaches
    `icons/*.{svg,png,ico}` anyway. **An icon is therefore the one precached asset whose content can
    change while its cache key cannot.** JS and CSS are fine; this is not a general cache bug.
  - Two candidate fixes, and the second is probably right: bust `?v=` onto icon URLs at BOTH ends
    (the pages and `ecSwAssetUrl()`, which `sw_manifest_check.php` already holds identical), or make
    the generated worker's own bytes change when any precached asset's mtime does, so `install` re-runs
    and `addAll` overwrites. The second fixes every icon at once and touches no public URL; check
    whether `addAll` would then be served from the HTTP cache anyway.
  - Nothing is broken today -- the icon on disk is correct and a new visitor sees it. This is about
    the NEXT icon change, and about anything else precached that is named without a query.

- 50|622| **[H] A refused terrain lookup is reported as an unreachable one.**
  The message says "You may be offline" when we reached the service and it refused us. Found 2026-09-10 while diagnosing KDH's report that DEM and satellite were down at
  librewaternet.org/app. They were: the Mapbox token is URL-restricted to hawsedc.com, so every
  tile and every elevation lookup from the other host returns **403 Forbidden**. Measured against
  the live endpoints -- hawsedc.com 200, www.hawsedc.com 200, librewaternet.org 403,
  not-epanet.org 403; OSM 200 everywhere, which is why the street map kept working.
  - **The account fix is Tom's and is outside this repo** (Mapbox → Tokens → URL restrictions).
    Nothing here needs to change for the outage itself.
  - **The DEFECT here is the message.** `lpn_terrain_failed` reads *"We could not reach the terrain
    service, so no elevation was changed. You may be offline."* We reached it; it refused us, and
    the sentence sends the reader to look at their own connection. `js/lpn-terrain.js:492` already
    throws `{kind: 'http', status: res.status}`, so a 4xx is distinguishable from a network error
    with no new plumbing -- only the message is missing. Refused and unreachable want different
    sentences, and only one of them mentions being offline.
  - Same class as the favicon 404 and the `ea-php56` default: **a second host does not inherit the
    first host's external configuration, and nothing inside this repository can see it.**

- 50|629| **[H] GUARDED: a geographic project opening on the XY default view, in pixels.**
  **THE SEAM IS FIXED AND THE ROOT IS NOT REMOVED.** `applyView()` refuses a geographic camera
  showing no pixel of the Earth (`viewIsReachable()`); `false` already meant "nothing usable", so
  `restoreViewOrFit()` fits instead -- what Tom did by hand. **A damaged file HEALS**, the fit
  being what the next save records. `dev/lpn-spike/bad-view-harness.js` drives his own file,
  13/13, red on all five measured symptoms when the guard is removed.
  - **THE ROOT IS CLOSED 2026-09-11: `pendingView` HAD NO OWNER.** It was a module-level variable
    that `applySaved()` set for one document and `restoreViewOrFit()` handed to whichever project
    opened next -- across projects and across FRAMES, a grid view being pixels where a geographic
    one is degrees. **That is Task 624's original report in one line**, *"the geographic Net3
    example beside an existing project"*. A view now carries the project it was read for
    (`pendingViewFor`) and the frame it was made in (`v.frame`), and is refused anywhere else;
    a tab's remembered view is also discarded when its project changes frame under it, which
    `georefFinish()` does without closing anything. **Stamped rather than sequenced, because the
    leak is a missing OWNER and not a missing call** -- nobody found the path, and a stamp cannot
    be got wrong by a path nobody has found.
  - **THE GUARD TESTS LONGITUDE ONLY**, and that is a stated limit: Mercator x IS longitude so
    `outwardX()` is exact, while `outwardY()` runs through `mercLat()` and pins at the cut-off,
    losing the magnitude a y test needs. The mismatch always writes both axes from one line, so
    longitude sees every case of it -- but a y-only bad view would pass.
  - **IT WAS FIRST WRITTEN CALLING `cartesianY()` AND `local-origin-harness.js` CAUGHT IT**, which
    is the argument for that census. The `outwardX()` count moved 19 -> 20 with a reason.
  - The three exact identities that named it, the live capture and Tom's own file:
    `dev/lpn-blank-map-incidents.md`. **Also Task 624's original report** -- one bug, two faces.

- 50|631| **Four things Tom hit while testing, none of them urgent.**
  2026-09-11, in one message. Recorded together because each is small and none blocks the others.
  - **THE LABEL-ZOOM SETTING MAY HAVE BEEN CUT TOO FAST.** *"We removed the 'Show labels when
    zoomed closer than [__]' Setting along with its 'Use current zoom'. But maybe that was hasty.
    Obviously we don't want to show labels at the entire world view."* A geographic project can now
    open on the whole world, where every label is on top of every other. **Cutting the zoom from
    GO TO was right and is not reopened** (his, 2026-09-11: *"That's a different use case than map
    search."*) -- a reader who types a coordinate is asking to be moved, not rescaled.
  - **PLACE SEARCH PICKS ITS OWN ZOOM AND SHOULD NOT.** *"If Mapbox or OSM returns a zoom level
    with place name searches, we should use that zoom level ... This is embarrassing."* Nominatim
    returns a `boundingbox` on every result, which is better than a zoom: fit it. Check what
    `js/lpn-search.js` currently does with it before writing anything.
  - **[Use DEM] BELONGS IN THE GROUP PROPERTIES BOX** (his: *"It would be really cool"*). Task 542
    put elevation behind two deliberate doors and warned against a third; a group-properties button
    is the same gesture as the Find-and-replace one, on a set the user has already chosen, so it
    is arguably the second door rather than a third. Judge it against 542 before building.
  - **COORDINATE READOUT AT EXTREME LATITUDE** is Task 630's, and is noted here only so a reader
    of this block is not left thinking it was forgotten.

- 50|633| **The project tab strip, and whether it could collapse into the toolbar.**
  Tom, 2026-09-12, reasoned himself to the status quo in one paragraph and it is recorded so
  nobody reopens it cold: *"Maybe we don't need the Project tabs bar ... it could be a powerful
  idea to gain another chrome bar's worth of map height ... We also would be pressed to show the
  current project/file name somewhere, and I don't know where unless before the mode message,
  which is not standard convention. The tab paradigm is ubiquitous. What we have now is highly
  standard. I think I talked myself into the status quo."* **The value named is high (one whole
  bar of map height) and the blocker named is real (nowhere standard to put the current file
  name), so this is open rather than closed.** Anything that reopens it has to answer the file
  name question first. He suggested the interface designer could noodle it.

- 50|636| **A custom properties UI, designed in a table.**
  Tom, 2026-09-12, in full: a Custom properties heading under `Settings > Assets`, every property
  one row of an abbreviated design table, added and removed like demand categories -- key, label,
  applies-to, validation, character restriction, length, low and high limits. **The pane SHOWS a
  truncated design and a POPUP edits it** (his revision 5 of eleven, 2026-09-13, confirming his own
  original specification and reversing what phase 1 built). **Every applicable custom property then appears everywhere an ordinary one
  does**: Properties, multi-properties, Find, Tables, Graphs. His whole specification, and the
  three things to decide before building (`.inp` has nowhere to put one):
  `dev/custom-property-scope.md`.
  - **ALL NINE DESIGN QUESTIONS ARE ANSWERED (Tom, 2026-09-13)** and the answers are in the scope
    document. The three that change the build: **everything is overridable by a scenario**, with no
    per-property distinction (*"Let the people do the things!"*); the key is **NAMESPACED**
    (`user_`/`custom_`) so a collision with a built-in field is impossible rather than refused; and
    a value that breaks its own design is **FLAGGED IN PLACE, never cleared** -- which he turned
    into a feature, *"a beautiful exploration tool. You change the constraints just to do a bit of
    data entry error checking."* `Validate as` also gains a **Don't validate** entry, which the
    original spec did not have.
  - **PHASE 1 AND HIS ELEVEN NUMBERED REVISIONS OF IT BOTH SHIPPED 2026-09-13.** What is left is
    Graphs, the `.inp` `;@key=value` comment convention, and the validation-regexp door revision 6
    deliberately left shut. The revisions are folded into `dev/custom-property-scope.md`.
  - **SINGULAR, in the database tradition** (Tom, 2026-09-12). The branch is `custom-property`, the
    document is `dev/custom-property-scope.md`, and a table is named for the row it holds.
  - **EMBRACE 247 but do NOT gate it.** An account number could be a custom property and the saving
    would be real, but Tom ruled it is not the way in: an asset id already identifies a meter. Land
    the field seams here first -- `pushSpecList()`, the popup bands, the Tables columns -- and 247's
    geometry runs beside them.
  - **AVOID running beside 640.** Graphs must offer a custom property in its selector, so it wants
    this list to exist before it is written rather than to invent a second one.

- 75|639| **Layers: the first heading under Map and page.**
  Tom, 2026-09-12. A Layers sub-heading under `Settings > Map and page`, ABOVE Appearance, with a
  row per layer and the columns On/off, Opacity, Size (default), Color (default), Z.
  - **Phase 1 layers: Text, Symbol, Link, Flow arrow, Background.** Roadmap layers: Contour
    (Task 640) and Customer (Task 247).
  - **Z is RELATIVE**, ranged 0 (default) to roughly 2-10 times the number of layers -- so adding a
    layer never renumbers the others, which is the whole reason it is not an index.
  - A layer setting is MODELLING data by CLAUDE.md's project-versus-browser rule and rides in
    `serializeProject()`; it is not window furniture.

- 75|640| **Graphs: the umbrella, a submenu under Water holding five plots.**
  **THE UMBRELLA, ON TOM'S WORD, 2026-09-15** (*"640 would make a nice umbrella"*). He asked whether
  there was an overall graphing project and there was not -- there were four unrelated rows. This is
  now the one place the programme is described, and the menu is where every plot surfaces, which is
  what makes it the right parent rather than 599 or 600.
  - **THE FIVE PLOTS:** Time series, Profile, Contour, Frequency, System flow balance. All in the
    bottom pane except **Contour, which is a map layer** switched under Layers (Task 639) -- it
    draws over the network rather than beside it, so it is not a tab.
  - **PROFILE IS BUILT** and MOVES under this menu rather than being written again. It already owns
    an axis pair, a unit label per axis, a legend and a hand-rolled plot with nothing vendored, so
    it is also the drawing idiom every other plot must reuse. **A second plotting idiom on this page
    would be the expensive mistake.**
  - **THE CHILDREN, which keep their own priorities and are not absorbed:**
    - **Task 599, time series against an extended-period run** -- priority 100, and being built on
      `feat/time-series-graph`. Ranks above the rest because the data is already there: a run holds
      every reporting step and nothing has to be re-solved.
    - **Task 600, the three EPANET plots we do not have** -- contour, frequency, flow balance.
    - **Task 637, a Graph button on the Properties box** -- the other door into the same plots,
      reached from the element rather than from the menu.
  - This row itself is the MENU, the tab shape and the export set. Full specification:
    `dev/graphs-scope.md`.

- 25|144| **Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.**
  **The 11% outlier does not reproduce and the fix it was waiting for already shipped** (2026-07-28,
  `9c47608f`, one day after the snapshot). The 2026-08-21 report gives HW 58% use-of-shopping, ordinary
  beside MPF 78% and DW 56%; P(X ≥ 7 | n = 12) = 8.6e-5 against the old rate. **The two causes are
  confounded** — the defaults changed AND the report began reading the consented bucket only — so do
  not claim the defaults fixed it.
  - **The Search Console route this task used to call decisive is superseded.** That export covers 16
    clicks against 580 counted humans; Google organic cannot characterize this audience. What settles
    it is one run of the rebuilt `log/lang-log-stats.sh` over HW and the band pages, same window and
    same bucket, long enough that the denominator is not marked `~`.

- 25|225.13| **`dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got** (Tom: *"Some
  stuff no longer exists or is renamed"*), before anybody is asked to run that section again.
  Split out of Task 225 when the rest of it closed 2026-08-09 — this piece is a punch-list document
  rewrite against live controls, not a code fix, so it needs a browser pass rather than static
  reading.

- 25|303| **Usage logging: the remaining lower-value questions.**
  **NOT obsolete, and 50 overstates it** — Tom asked which on 2026-08-25. The questions are still
  real and still cheap; what is true is that **none of them decides anything on its own**, which is
  the definition of Maybe rather than Someday. Take one when a specific question makes it worth the
  wiring. Extracted from Task 200 when it closed 2026-08-14 so they survive the close.
  - **Time-to-first-calc** — separates a page that is confusing from one that is merely long.
  - **Print / copy-link use**, as a proxy for work somebody intends to keep. Overlaps Task 215's
    named-calculation signal, which measures intent-to-share more directly — check whether the title
    log has already answered the question before building it.
  - **Intra-site path** — which calculator is the entry point and where people go next. The most
    expensive of the three, because a path needs an ordering the logs deliberately cannot express
    without a per-visit identifier we will not store.
  - **Whatever is added is analytics and is gated on `ecAnalyticsConsented()`**, and a new log writer
    must call `ecLogBucketSuffix()`.

- 25|348| **Sub-categories and paging in the examples gallery.** The grid is `auto-fit`, so both
  arrive without a rewrite. Deliberately not built at six examples; worth doing when the wall stops
  fitting on a screen.

- 25|416| **The tester control panel: move it, prune it, repurpose it.** Make it the request channel. Tom,
  2026-08-17: *"I am not using it much because it seems like mostly noise."* Today it is
  `?debug=labels`, built by `buildLabelBench()`.
  - **Move to the LEFT edge** (away from Settings and Labels), **prune the obsolete numbers**, and
    give it an untranslated title — it is a tester surface, never shown to a visitor.
  - **Its real job is a channel for "please try this and tell me what you see" requests**, one tweak
    at a time, not a permanent dashboard. Task 411's off-orthogonal tolerance is next onto it.
  - **A STOP-AFTER-STEP control, which is what "solo" has to become for a pipeline** (Tom,
    2026-08-17, a vocal arranger: *"the equivalent of 'mute' and 'solo' buttons for certain
    'voices'"*, then *"Only solo or all"*). Placement is judged through every pass at once today,
    which is why it feels blind.
  - **Solo-in-isolation is incoherent here**: each pass consumes the previous one's output, so
    "relaxation alone" has nothing to relax. The honest control is **cumulative** — apply steps 1..N
    and draw. One stepper (Next / Back / All), not N checkboxes.
  - **The steps, named for what a reader sees on the map, not for functions:** 1 node labels placed
    at their offsets · 2 pipe (link) labels placed along their pipes · 3 labels turned to lie along
    the pipe · 4 labels pushed apart where they collide · 5 values dropped from a crowded label
    (shedding) · 6 labels hidden because the zoom is too far out · 7 leader lines drawn.
  - Stopping at N answers "did my change help?" — the answer is two drawings at the same step.

- 25|487| **The suite only works when its URL path is `/engcalcs/`.**
  A rejected refactor, kept so it is not re-proposed. Measured 2026-08-22: 79 root-anchored
  `/engcalcs/` occurrences across 18 root `.php` pages plus `sw.php` and `consent.php`, three
  `Redirect 301` rules in `.htaccess`, **210 counting the JS**, up from 112 -- it gets dearer.
  - **Task 479 closed 2026-09-08 WITHOUT it.** `librewaternet.org/app/` is a rewrite onto
    `Looped-Network.php` and a symlink makes `/engcalcs/` answer on that host too, so every
    absolute path resolves; the canonical, the worker scope and the web app manifest all derive
    from declarations (`ecCanonicalPaths()`, `ecSwMounts()`) rather than from a base path.
  - **It becomes real only if the suite must be served at a path that is NOT `/engcalcs/` with no
    `/engcalcs/` beside it.** Then the fix is one derived base-path constant plus a check failing
    on a new hardcoded prefix, and keep root-relative: root-relative was itself the 2026-08-08 fix
    for a `../` bug. `dev/hosting-layout.md` §3 is the record.

- 25|607| **A moving picture of drawing a pipe -- Task 178's phase 2, extracted on close.**
  A filmstrip GIF from `dev/filmstrip-gif-recipe.md` of the add-pipe / add-junction workflow. A
  2026-07-30 proof of concept showed it is cheap once set up -- the hard part is precise SVG click
  targeting, not GIF assembly -- and the POC GIFs were never committed.
  - **A still shows a STATE; only a moving asset shows a GESTURE**, and "how do I draw a pipe" is a
    gesture. That is why closing 178 on the Help link did not retire this.

- 25|613| **[H] "Note" instead of "Text" for the free-text map object.**
  Tom, 2026-09-08: *"Maybe it doesn't matter or we should wait for user demand or a population we
  can poll."* Waiting for that population. Renaming touches every `lpn_text_*` key in 27 languages,
  so it is not done on a hunch. EPANET calls the same object a Label, which we already declined.

- 25|619| **[H] The map cursor reverts to an arrow on Chrome at fractional display scaling.**
  Tom, 2026-09-10, on Windows at 125%: *"Stop mouse, then move about 1px down. Cursor changes to
  default."* Reproducible for him at will, gone at 100%, different distances at 150%, absent on a
  second laptop. Chrome 152.0.7977.83.
  - **IT IS NOT IN THE DOM, AND THAT IS THE FINDING.** A live logger polling
    `elementFromPoint` + `getComputedStyle` on every animation frame caught **none** of ten
    deliberate changes -- while catching an ordinary console-to-map transition in the same session,
    which is the control proving it was firing. `elementFromPoint` returns the same element and the
    computed cursor stays `grab` at the pixel and the instant the arrow is painted. **Chrome is
    drawing a cursor that disagrees with its own computed style.**
  - **A SECOND SYMPTOM ON THE SAME MACHINE, AND IT IS OUTSIDE THE PAGE ALTOGETHER** (Tom,
    2026-09-14): *"File Save cursor is lost"*, clarified as *"only within the extents of the file
    picker. Not before, after, or outside."* **THE PICKER IS A NATIVE WINDOWS DIALOG** --
    `window.showSaveFilePicker()`, its own OS window -- so no stylesheet, class or script of ours
    can set, hide or restore a cursor inside it. This is not a variant of the map symptom below
    and must not be used as a repro for it: there the arrow replaces the map's own cursor INSIDE
    the page, here the pointer is missing over a window the page does not own.
    - **It is filed here because the machine is the common factor.** Chrome on Windows, one
      laptop, a cursor Chrome paints wrongly in two unrelated surfaces. The control that would
      settle it is the same shape as the epanetjs.com one that settled the map symptom: open a
      save dialog from ANY other site and see whether the pointer vanishes there too. If it does,
      both symptoms are the browser and neither is ours.
    - A first pass recorded this as a deterministic trigger for the map bug. That was wrong and is
      struck: the report said *lost*, and it was read as *reverted to an arrow*.
  - **AND IT REPRODUCES ON epanetjs.com's MAP, which settles it** (Tom, 2026-09-10: *"It does the
    same thing at the epanetjs.com map. They don't have a default cursor on their map, but it
    changes to one anyway."*). A different site, a different codebase, a different rendering stack,
    and the same behaviour on the same browser at the same display scale. **No shared cause is
    possible except Chrome.** That one observation is worth more than every sweep below it, and it
    cost him a single visit to another page. Reach for it earlier next time: when a defect will not
    reproduce in the harness, ask whether somebody else's page shows it too.
  - **THE FRACTIONAL-RATIO HYPOTHESIS IS ALSO REFUTED, BY MEASUREMENT.** A sweep at device pixel
    ratios 1 / 1.25 / 1.5 / 2, walking ONE DEVICE PIXEL at a time on eight bearings from a junction,
    a reservoir and a pump, found **zero phantoms and zero slits at every ratio** on the Basic
    example; on geographic Net3 the few one-pixel runs were the DECLARED 2 px symbol slop and were
    **most numerous at ratio 1**, the opposite of the prediction. Hidden labels answered **0 of
    108,009** probes over their own boxes. The mechanism rules it out too: `elementFromPoint` is
    what the cursor resolves from and Blink computes it in CSS-relative LayoutUnits, so the ratio is
    not in that arithmetic.
  - **AND THAT NAMES WHY NO HEADLESS TEST CAN EVER REACH THIS.** A Windows mouse delivers its
    position in PHYSICAL device pixels and Chrome divides by the scale factor before the page sees
    anything; Playwright injects through CDP in CSS pixels, so that division never happens in the
    harness. **If the artefact lives in that input path it is unreachable from here by construction**
    -- which is consistent with everything: it needs a real mouse, a real Windows scale factor, and
    it happens on somebody else's site too.
  - Also searched and clean: 1.4 M samples at 1 px across XY Basic, XY Net3 and geographic Net3 at
    four zooms in Chromium AND Firefox; 1.6 M more at 0.25 px; radial walks at 0.2 px out to 700 px.
    Every hit shape measured constant in screen pixels across zooms, so nothing of ours is stale or
    scale-dependent. It reproduces with the **network deleted**, so no drawn object is involved.
  - **WE ALREADY HAD PRIOR EVIDENCE AND NOBODY CONNECTED IT.** `nudgeCursor()` in
    `js/looped-network.js` reasserts the cursor every 200 ms during the backdrop wizard, and its own
    comment says it "works around a real Chrome cursor-caching quirk". Same defect class, found
    independently, months earlier.
  - **NOT RECOMMENDED: a map-wide nudge.** The wizard's version lasts seconds; doing it for the
    session means forcing a style recalculation several times a second on the page's hot path, to
    buy a cursor glyph for the subset of visitors at fractional scaling. A narrower version -- nudge
    only while the pointer is moving over the canvas -- is the option if he ever wants one.
  - Priority 25 because it is cosmetic and not ours. **Recorded so it is not hunted again**: it cost
    a full evening of hand-testing and four wrong hypotheses of mine before the logger settled it.
    `dev/browser-pass/specs/nodehit.js` carries the phantom/slit sweep and a live mutation, so a
    real geometry regression would still be caught.

- 25|621| **[H] A command search: KDH went looking for one.**
  Tom testing with KDH, 2026-09-10: *"In searching for fire flow, he said, 'I need to do some kind
  of search.'"* The Settings search already exists and Tom is happy with it; this is that idea
  widened to every command.
  - **TOM NAMED THE OBSTACLE HIMSELF AND IT IS THE WHOLE TASK:** *"The main obstacle is the need for
    a UI location, which in turn is another thing to find. So it may not be practical."* A search
    box that has to be found is a menu with extra steps. The escape from that is a KEY rather than a
    location -- the industry idiom is Ctrl+K / slash -- but a keystroke is invisible to exactly the
    first-time reader who needed the search, so a discoverable affordance and an undiscoverable one
    are both half an answer.
  - Filed as a maybe-someday on his own framing. Decide the location question before any code.

- 5|616| **Visual feedback: a prompt history in the banner area.**
  **PARKED 2026-09-13 at Tom's word** (*"Whew. Put it at priority 5."*), and the parking is not
  indifference -- it is what two independent readings concluded. **The interface designer seat
  says the task has the WRONG SHAPE**: the highlight ran 4 s, then 120 s, and MJH missed it both
  times, which is inattentional blindness rather than a duration failure, and a history in the
  banner area is a FIFTH chrome band on a page whose diagnosed defect is that readers do not see
  the four it has. Her citations (Simons and Chabris; NN/g on banner blindness; Material's snackbar
  spec; WCAG 4.1.3) are in `dev/agents/interface-designer/journal.md`.
  - **THE ONE REAL DEFECT UNDERNEATH WAS A MISCLASSIFICATION, NOT AN ABSENCE.** The DEM-disconnect
    notice KDH missed was reporting a CONDITION and expired on an 8 s clock while the condition was
    still true. The page already owns the persist-until-cleared pattern (`noteMapUnmeasurable()`,
    `#lpn_lock_banner`); that notice was not using it. Fixing that needs no new interface and no new
    strings, and it is the one case where a miss actually mattered.
  - **TOM'S ANSWERS ARE ON RECORD** should this ever come back, from the 2026-09-13 interview:
    history survives a reload and is kept per project; three duration classes, with the lower limit
    raised to about 10 s (*"10, 30, 90?"*); a notice carries no button or link (*"A banner message
    is a banner message. Whatever it says, it says."*); everything goes in the history. He also said
    *"I am not completely sold on this project."*
  - **IT WOULD COST A NEW `localStorage` KEY** on his own answers (survives reload), so it needs the
    exemption test before anybody builds it. That is the first question, not the last.

- 5|114| **Reservoir / detention routing calculator (Modified Puls) — full scope in
  `dev/detention-routing-scope.md`.** A time-stepping engine, which is the real departure from the
  suite's steady-state weir and orifice calculators. **Hydrology stays out of scope** — the user
  brings the flood, the tool routes it; do not add a Rational Method or a curve number. Daunting
  (Tom's word) and bigger than Task 137 — do 137 first.

- 5|116| **Solar water pumping sizing.** Sizes a solar-PV-powered pump system for irrigation or
  domestic supply: hydraulic power required (`P_h = ρgQH`, same physics already used throughout
  `dw_`/`hw_`/`mphl_`/`mhp_`) → electrical power via pump + system efficiency → PV array size (Wp)
  via daily peak-sun-hours and a derating factor. Efficient to build: total dynamic head's
  friction-loss component can literally reuse the existing `dw_`/`hw_` engine. **Research finding,
  2026-07-14**: this is the clearest technology-emergence signal of any candidate researched — strong
  2025 momentum (20%+ annual growth in Kenya solar pump installs, new carbon-financing/payment-plan
  models cutting upfront cost ~30%, panel costs still falling), and strong/growing demand in
  Sub-Saharan Africa smallholder irrigation specifically. But the availability axis is only
  moderate, not a clean gap: many free generic solar-pump calculators already exist (TDH, sun-hours,
  array wattage). Differentiation angle if built: tune specifically for low-resource context (cheap
  AC/DC submersible pumps common in Africa, NGO-typical borehole depths) rather than duplicate the
  generic tools. Inputs: target flow rate, static lift, pipe run (for friction-loss reuse), daily
  peak sun hours (needs a cited irradiance data source, not guessed values), pump efficiency, system
  derating factor (~0.75–0.85 typical, needs a cited source before shipping as a default). Candidate
  prefix `swp_` — not yet claimed.

- 5|117| **Pico-hydro / hydrokinetic (damless, in-stream) turbine feasibility.** Natural extension
  of the existing `mhp_` calculator for very low-head remote sites where a conventional
  penstock/head arrangement isn't available. **Research finding, 2026-07-14**: strong
  technology-emergence signal — market projected $4.9M (2023) → $29M (2030) at ~29% CAGR; a 2025
  Ethiopia study found pico/mini-hydro LCOE ($0.09–0.16/kWh) beating both solar mini-grids and
  diesel. Genuine availability gap (only a generic hydroelectric-power calculator found, not tuned
  for pico/ultra-low-head or damless in-stream siting) — but promoted from backlog only to "moderate"
  because the audience fit is narrower than the water-focused candidates above (site-dependent on
  perennial-stream availability, and it's a power calculator, not a water one, so it sits one step
  further from the suite's hydraulic-engineering core). Candidate prefix `phk_` — not yet claimed.

- 5|118| **Solar water pasteurization / SODIS exposure calculator.** SODIS (WHO/EAWAG-endorsed: clear
  PET bottles, 6 hr sunny / 2 days cloudy, <30 NTU turbidity ceiling) and solar pasteurization (heat
  to the WAPI 65°C threshold, `Q = mcΔT` plus collector efficiency). Candidate prefix `swt_`.
  - **Downgraded from the original proposal, 2026-07-14.** A real availability gap exists — no public
    calculator found, only academic models and the rule of thumb from SKAT/EAWAG manuals — but the
    value-add is thin, because field workers already solve this with the heuristic itself. Kept
    because the mission fit is exactly Tom's stated interest; **if built it must beat the rule of
    thumb**, e.g. by combining site-specific insolation, cloud cover and turbidity.
  - **Safety-critical defaults:** the turbidity threshold, exposure-time table and collector
    efficiencies must cite WHO/EAWAG/CAWST primary sources before shipping, never placeholders — a
    wrong default could tell someone unsafe water is safe.

- 5|155|[H] **The Task 149 search-index fix awaits Search Console confirmation.**
  Deployed already. Steps 1–5 (sitemap uploaded, `robots.txt` Sitemap line, sitemap submitted in
  Search Console, code pushed, one canonical origin) were all done and verified live 2026-07-28 — do
  not re-verify them by hand. Only the wait is left, which is why the priority dropped 50 → 10.
  - **CHECK: 2026-09-01.** `site:hawsedc.com inurl:lang=es` should start returning results, and the
    Task 149 diagnostic query `calculo de canales trapezoidal online` (position 2.8, 0% CTR) should
    begin converting — the cleanest single tell, because it already ranks and only the snippet
    language was wrong. **If it has not moved**, read Google's own hreflang report (it names
    reciprocity failures explicitly) and check whether the `?lang=xx` URLs are indexed at all versus
    indexed-and-not-ranked; those are different problems with different fixes. If still ambiguous,
    re-date rather than close.
  - **The origin 301 lives in the PARENT site's `.htaccess`, and `engcalcs/.htaccess` reaches
    through it only because that file defines no rewrite directives of its own.** Anyone adding a
    `RewriteRule` there later will silently break the 301 for every calculator — add
    `RewriteOptions inherit` if that day comes.
  - Its motive was not SEO: `lib/Language.lib.php` sets its cookies `'secure' => true`, so a visitor
    arriving on plain `http://` lost language persistence entirely. HSTS was deliberately NOT bundled
    in — browsers cache the policy for its full max-age and it cannot be recalled.
  - **Task 150 (meta descriptions) is unblocked by this** — it was sequenced behind 149 on the
    reasoning that descriptions on unindexed URLs buy nothing.

- 5|158| **`sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.**
  The query export shows real non-English demand for content `sewslope.php` already has (`pendiente
  mínima tubería pvc sanitaria`, `kanalizasyon eğim tablosu`, `tabela de inclinação de esgoto`).
  Task 151 half-mitigated it with mm diameters and mm/m + percent slope columns, so a metric engineer
  in any language can read the *numbers*; the prose is what remains.
  - **These are PARENT-SITE pages** — no `$ec_lang`, no language switcher, no payload generator, no
    drift tripwire. Decide the shape first: three static translated copies (es/tr/pt) may beat
    building language infrastructure for two documents.
  - **Do not assume this is worth doing.** Task 151 found these queries already *rank*, so the CTR
    problem may be snippet quality (now fixed) rather than language.

- 5|175| **A real printable version, suite-wide.** Raised by Tom, 2026-07-30, while reviewing the
  `lpn_` map page: the suite's only print affordance today is `d-print-none` hiding chrome
  (toolbar, unit-select row, nav) so `Ctrl+P` on the bare page reads a little cleaner — there is no
  actual "printable view" (clean pagination, a results summary, a static rendering of an SVG
  canvas like `lpn_`'s map). Not designed yet — Tom's own fallback today is a screenshot, which
  works but produces something the reader can't page through or reflow. Whoever picks this up
  should figure out what "printable" should even mean per calculator type (a two-column input/
  result form vs. a map/canvas page are different problems) before building anything.

- 5|181| **Per-element symbol sizing (originated during Task 146).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.

- 5|191| **Junction emitters: surface the pressure-dependent demand already solved.**
  Originated during Task 146. Raised 2026-07-30 when Tom asked of the Settings panel's "Emitter exponent"
  row: *"Do we have emitters? Do we do something with this?"* The honest answer was **no** — that
  control was removed in the same session (see the note in `rebuildSettingsFields()`), because:
  - **`js/lpn-solver.js` fully implements emitters** — `qe = K·ΔH^n` with the matching Jacobian
    term and a guarded derivative as ΔH → 0 — but **nothing in the app ever sets a junction's
    `emitter`**. There is no field in the junction popup and no import path, so `emitter > 0` never
    passes and the exponent adjusted nothing. A real capability, already paid for, with no way in.
  - **What to build:** an emitter coefficient K on the junction popup, beside Demand. Then the
    exponent row returns to Settings and finally means something. `settings.emitterExponent` and the
    language key `lpn_settings_emitter_exponent` were both left in place for exactly that, so
    restoring the control is one line in `Looped-Network.php` and one in `rebuildSettingsFields()`.
  - **Why it fits this suite rather than being analysis creep:** an emitter is how you model a
    sprinkler or a leak, and sizing an emitter to get the flow you want is a design question, not an
    analysis one. `ip_` (Irrigation Pressure) already puts irrigation users in this suite. The
    design-tool framing matters — fixed demands stay the default; an emitter is opt-in per junction.
  - **Open:** whether demand and emitter can coexist on one junction (EPANET allows both, summing
    them). Probably yes, but it needs a label that makes the sum legible rather than surprising.

- 5|192| **Right-click / long-press context-menu system. PARKED at 5, 2026-08-13** (Tom: *"I am not
  currently seeing the need for this"*). Not declined — the day something wants a context menu it
  should be built the robust way described here rather than smuggled in. But the action that raised
  it (Task 184's scenario variant) is itself parked, so this is a mechanism with no live caller. Do
  not build it on the strength of "every app has right-click." Tom, 2026-07-30, when it was raised:
  *"if we add right-click, it should be built out robustly. It's a habit that, once taught or
  discovered, we should leverage."*
  - **Every clickable class gets a menu** — node, link, vertex, label, backdrop, empty canvas. A menu
    missing on some objects is exactly what teaches users to stop trying.
  - **Long-press is the touch equivalent, and every item stays reachable without it.** That is the
    reason for two entry paths — reachability, not redundancy.
  - **Do not hijack right-click inside form fields**; the popup's text inputs must keep native
    copy/paste. **Disable-with-reason rather than hide**, so the vocabulary stays learnable.

- 5|202| **`zh` converts at ~15% where its peers convert at 50–75%.**
  PARKED until n=30, with a pre-registered threshold. Everything cheap has been eliminated: **not bots** (arrival pattern is
  more human-shaped than `es`), **not missing strings** (`lang_parity_check` reports only `lpn_`
  gaps; all `mpf_` keys present, unit tokens translated, `EC_DEFAULT_UNIT_SET` correctly SI), **not a
  wrong promise in search** (`mpf_main_title` = 免费在线曼宁管流计算器, unambiguously a calculator, and
  Tom read and back-translated the page and found nothing). The bot hypothesis was CC's, argued as
  more likely than a defect, and it was wrong.
  - **PRE-REGISTERED TEST — this is the point of the entry.** The original finding's weakness was the
    look-elsewhere effect: `zh` was the worst of 11 languages, so its raw p-value overstated the case.
    Naming the threshold in advance removes that penalty. Against the peer rate p = 0.60: at n = 30,
    **real if using ≤ 13, noise if using ≥ 16** (expected 18 if `zh` behaves like its peers, 4–5 if it
    is truly ~15%). Earlier checkpoints: n = 20 → real if ≤ 7; n = 25 → real if ≤ 10.
  - **Priority 15 on purpose** — not because it stopped mattering, but because **no amount of work now
    improves the answer** and the log accrues at zero cost. Re-read when `zh` passes 30 views.
  - **Do not re-score `zh`'s QUALITY in either direction before then.**

- 5|267| **"Save as" the backdrop image.** Tom, 2026-08-10, "very low priority". The image is stored
  as a data URI on `backdrop.href`, so writing it back out is a blob download away.

- 5|391| **[H] Evaluate `// @ts-check` with JSDoc branded types — a joint decision, not a
  proposal.** Tom, 2026-08-16, on the unit paradigm work: *"this would be a little easier if JS were
  a strongly typed language."* True for the half that cost the most: **which KIND of number is
  this** is a type question, and Task 390's rule — a number the user supplied and a number we
  computed must never occupy the same field — is exactly `UserValue<Feet>` vs `Computed<SI>`. Prose
  is the weakest enforcement available for it. It would also catch `"710" * 2`, the standing hazard
  in Task 390 step 3.
  - **The honest limit, so this is not oversold: types would NOT have caught the worst defect here.**
    `number * number` is well-typed and still loses 36.7% of round trips; four different feet were
    all valid `number`s; `acft` at three significant figures type-checked fine. Floating-point
    identity is invisible to every mainstream type system. Types shorten the diagnosis a lot and the
    fix a little.
  - **Cheap path if it is ever worth it: no file becomes `.ts`.** `// @ts-check` plus JSDoc
    annotations gives branded types in place, and the Node harnesses already provide a
    build-adjacent place to run a checker.
  - Evaluate together before any of it — this is on the roadmap as a possibility, not a plan.

- 5|400| **Phase 3: bounded local search on the label residue.**
  Tom, 2026-08-17, lowering it 60→15: *"Phases 1 and 2 are good enough for GIS mode or management
  mode. Phase 3 may be helpful for report mode."*
  Parked for real-world feedback from Tom's colleague Mary (Philippines) rather than scheduled work;
  an event gate, not a `CHECK:` date.
  - Wagner & Wolff's three optimum-preserving reduction rules on an explicit conflict graph, then a
    bounded chain search, in QGIS PAL's shape. Survey: `dev/label-placement-algorithms.md`. Needs
    Tasks 398 and 399.
  - **The view-independent conflict graph is the gate, not a loose end.** The rules are defined on
    it, and today the graph differs at every zoom and every pan.
  - Straight-top as a third candidate position belongs here: measured (arXiv 2407.11996) as
    preferred over Imhof's top-right.
  - **A relaxation/nudge pass may belong in the strategy** (Tom, 2026-08-17) — check how the
    literature sequences it against the reduction rules. Of limited value until labels start in open
    territory, so it follows rather than precedes the rest of Phase 3.
  - **"Most-open angle(s)" is Task 411, not this task** — candidate *generation*, orthogonal to the
    reduction rules, and the "start in open territory" precondition the relaxation bullet assumes.
    Literature pass done 2026-08-17: `dev/most-open-angle-brainstorm.md`.

- 5|482| **EPANET's vocabulary collides with ours, and we are keeping ours.** Tom, 2026-08-21, from
  a session with EPANET: what we call **Labels** EPANET calls **Notation/Annotation**, and what
  EPANET calls **Labels** is what we call **Text** objects.
  - **RULED: stay our course, at priority 5.** Tom's reasoning, and it is the argument to re-read
    before anyone reopens this: *"Annotation probably has no specific meaning, and various software
    apps have used terms like Results Field, Map Output, or Results Variable. And for Label (Text
    object), the same holds true, with most using the word 'Text' as part of their terminology, such
    as Drawing Text, Free Text Decoration, Map Graphic Text, Map Note, Text Annotation."* **There is
    no industry standard to defer to here**, so EPANET's words carry no more authority than ours, and
    a rename would cost a 26-language key family plus the vocabulary inside saved projects.
  - **Recorded so NEW strings do not drift.** The decision is cheap now and expensive later: every
    string written in the other vocabulary adds to the rename we have just declined.
  - **A real feature gap found the same day, and it is separate: EPANET can METER a node or link.**
    A Text/Label is associated with an element, and EPANET puts that element's one selected notation
    property under the text you typed, in a pale yellow bubble. **Our labels already carry MULTIPLE
    properties and drag freely** (`dev/positioning.md` §4), so copying it wholesale is scope gravity.
  - **DEFERRED ON PURPOSE, and that is the position, not indecision** (Tom, 2026-08-22). Change is
    inevitable and refactoring is a value, because foresight is never perfect; overvaluing the past
    is as much a weakness as ignoring it; listen to users; there is an unknown depth of possible
    correction, so the aim is to act rightly now rather than lock the decision early. Tom: *"there is
    an unknown amount of EPANET that we don't yet implement."*

- 5|492| **[H] Rewriting the 986 existing commit messages is NOT recommended.**
  Extracted from Task 388 on close so it is not re-proposed from scratch. It rewrites every SHA,
  forces a push, breaks production's `git pull` deploy, dangles 43 SHA citations in `dev/*.md`, and
  saves no context — **nothing ever loads a commit message.** Alive only as a recorded no.

- 5|537| **[H] PARKED. Both seats say a phone reaching a PC's model is a want that mostly is not there.**
  Tom parked it 2026-08-26 (*"Compact and park. 5"*) after asking whether file access was the field
  operator's blocker. Researched from both seats, separately, and they converged.
  - **The field operator:** every field-facing tool they could source runs on a **GIS asset graph
    plus a work-order system**, never a hydraulic solver — Esri's Utility Isolation Trace already
    answers "what does closing this valve isolate", and asset CONDITION is a GIS/CMMS record. The
    exception is real but narrow: the smallest agencies still on paper tie cards, for whom our map
    competes with nothing.
  - **The planning engineer:** "cloud behind a login" is a thing a small agency's counsel cannot
    approve — a complete network topology is the document type several states legislate as sensitive
    infrastructure information, and a volunteer project has no SOC2, no incident-response contract
    and no DPA. **So "nothing you draw is uploaded" is not merely a privacy nicety: it is the one
    posture that never asks a utility's lawyer a question they must refuse.**
  - **If it is ever revived, the shape both ranked first** is a read-only, one-way link or export
    with storage the UTILITY controls — *"the moment 'the link' is something we host, it has become
    the cloud-login proposal in a smaller costume."* Full record in both agents' journals.

- 75|699| **Audit the language keys for lazy duplications.**
  Tom, 2026-09-19: *"can you make sure we have a Roadmap task to audit language for lazy
  duplications where maybe a slight redesign can simplify or eliminate keys?"* He asked for it in
  the same breath as deciding a customer takes the EXISTING Description and Tag rather than an
  owned Account number -- which is the pattern in one instance: a new field invented where an
  existing one would have done costs 26 translations and a key that must be maintained forever.
  - **THE AUDIT IS THE CHEAP HALF AND THE REDESIGN IS THE POINT.** A near-duplicate pair is not
    automatically debt -- `dev/label-normalization-decision.md` already rules that a shared concept
    lives under ONE owning calculator's key and others borrow it, and that reuse stops at whole
    labels. What this task adds is looking for the cases where a small INTERFACE change removes the
    need for a key at all, rather than merging two keys that genuinely say different things.
  - `key_hygiene_check.php` already names keys nothing renders and names that drifted from their
    siblings; start from its output rather than from a fresh read of 27 files.
  - **Cost is the argument for doing it and also for doing it carefully:** one deleted key is 26
    translations never bought; one wrongly merged key is a wrong word on a control in 26 languages.

- 75|710| **Audit the 57 raw alert and confirm dialogs.**
  Left from the message log (Task 704, closed 2026-09-23): Ida's third item. Sort which must genuinely
  block and which are only information and belong in the log, which Tom's *"USER MUST HAVE CONTROL
  OVER MESSAGES"* argues for. Keep severity at the two colours the banner already uses.
- 75|711| **A pan is lost when File, New project opens beside it.**
  Found by the pre-reviewer 2026-09-23 while testing Task 647: New project and Open example never
  call `rememberCurrentView()` for the tab being left, so switching back refits it and the pan is
  gone. A tab opened from the gallery and switched to once keeps its view correctly.
- 50|712| **Tank water depth as a map label field.**
  Convert as has a Label suffix box for depth that is disabled because `level` is not in
  `nodeFieldDefs()`. Measured 2026-09-23 at eight sites, including the dense label priority table
  and both label passes, so it is a label feature, not a wizard fix.
- 50|713| **Say Cmd, not Ctrl, to a Mac reader.**
  The tables' right-click accelerators and Help > Notes say Ctrl+C / Ctrl+D on every platform
  (feat/table-editing). The keys already accept Cmd; only the words are wrong on a Mac.
- 75|701| **The panel guard is blind to forty sites, and the bottom panel is one.**
  Found 2026-09-19 while answering Tom's *"why would the run progress bar do anything to the bottom
  panel?"* -- the answer was that it does not, and the guard that said otherwise turned out to have
  a hole of its own.
  - **`dev/lpn-spike/panel-touch-harness.js` only recognises a show or a hide written as a plain
    `'block'`, `'flex'` or `'none'`.** About FORTY places in `js/looped-network.js` write it as a
    choice instead -- `open ? 'flex' : 'none'` -- and every one is invisible to it.
  - **The bottom panel is one of them.** Only `applyPaneLayout()` opens and closes it today, **by
    discipline and not because anything checks**, so a second door added next month would not be
    noticed. That is precisely the arrangement `dev/scenario-seam-repair.md` exists because of: two
    tracks wrote element properties, only one went through the single write seam, and five
    user-reachable defects followed.
  - **NOT slipped into the branch that found it**, deliberately: it is roughly forty new
    declarations and several genuine judgement calls about what counts as a panel, on a branch Tom
    has already passed in the browser. The limitation is now written at the top of the harness so it
    no longer implies coverage it does not have.

- 75|714| **Theming: colour tokens first, then a Light/Dark choice in Settings.**
  Tom, 2026-09-24 (R-211): *"preparing for this and implementing it will force us into some
  important code discipline."* Ida's phased plan: `dev/theming-plan.md`. Phase 1 declares semantic
  colour tokens, folds the nine separate box styles onto them, and adds a check refusing a new
  hard-coded chrome colour; phases 2-3 are a dark token set and the Settings row (a browser setting).
  - **MOD's phone-like buttons (R-202) belong inside phase 1**: one button base for menu items and
    toolbar buttons, one accent colour, previewed on a branch. Retire the menu hint (R-203) once it ships.

- 100|708| **Every property in every venue: an audit, then a check.**
  Tom, 2026-09-22, testing Task 705: *"Show at all zoom levels does not appear for Text in
  multi-properties. Should we do an audit to ensure that all properties are represented in all
  venues?"* Yes. Venues: the Properties box (single and multi-select), the Tables pane, Find and
  replace, Settings symbology, labels, `.inp` export. Produce the element-by-venue matrix first, then
  hold it with a check so a new property cannot ship in one venue only. Task 690 already asks the
  popup-vs-table half.
  - **AUDIT SHIPPED 2026-09-23:** `dev/property-venue-matrix.md` (8 element types x 8 venues) and
    `property_venue_check.php` (advisory, 42 table columns with no Find row). Top gaps a user would
    hit: Active/Closed not findable on any link; emitter coefficient; a tank's levels, diameter and
    mixing; pump speed and energy price; pipe length findable but not replaceable. Filling them is
    the next step, a branch of its own; Text's allZoom is in flight on `feat/zoom-scale-rules`.
- 50|702| **A view window cannot describe a span across the far side of the world.**
  Found 2026-09-19 alongside the mirrored-basemap fix (R-066), and **reported as unsettled rather
  than as a defect, which is the point of the row.**
  - The view's longitude window is built from the MIN and MAX of wrapped longitudes, and that pair
    cannot describe a window spanning the antipode of the transform's origin -- the same branch
    problem the mirror fix solved one layer down.
  - **Measured in a probe: a world-wide view after a Go to asked for only 4 of 8 tile columns.**
  - **It is NOT known what a user actually sees**, because a headless camera is not a real fitted
    view, and the agent that found it declined to claim a defect it could not measure. That is the
    correct call and the reason this is its own row: it needs its own measurement, in a real
    browser, before anybody decides whether there is anything to fix.
  - The mission scope is a 300 km system span (`dev/geographic-projects.md` §2b), so a drawing that
    genuinely straddles the antipode is not a real case. **The reachable case is the WIZARD's
    world-wide first screen**, which every geographic project passes through.

- 50|707| **Five minutes of a real browser on the Task 706 repair.** The Performance tab open, ten
  cells typed down a column of the biggest real project. The repair shipped on Tom's ruling without
  waiting for a measurement; every number behind it is a stand-in
  (`dev/lpn-spike/save-entry-at-hand-harness.js` says exactly what its stub cannot see -- the
  browser's own write, and the real cost of a style invalidation). This is what replaces the floor
  with a number.

- 75|718| **File menu: Recents just above Exit, and an Import submenu.**
  Tom, 2026-09-25, from WaterCAD: *"File menu: Recents just above Exit"* and *"We have three import
  items. It's probably time for an Import sub-menu."*
- 75|724| **Re-verify: Edit, Find, Everything, ID, "is empty" reportedly matched Lake and River.**
  Tom: those reservoir IDs are not empty. NOT REPRODUCED on the merged 2026-09-25 build: a headless
  run against Net3-Novato-CA-World (`findMatches()` with scope `all`, prop `id`, op `empty`) returns
  only the two Text labels (which correctly have no id), never the reservoirs. Likely already fixed
  by this branch's own R-197/R-224/R-225 rework of Find/Filter. Ask Tom to retest on the current
  build before spending more time; if it recurs, get the exact network and dropdown values.
- 50|717| **EPANET-MSX, multi-species water quality.**
  Tom, 2026-09-25: *"Multi-species MSX: Add it priority 50. I don't understand it, but we can learn.
  Thank you, Mary!"* From Mary's `dev/agents/market-researcher/epanet-gap-audit.md`.
- 50|719| **Draw a chain: junction, pipe, junction, pipe, until Escape.**
  Tom, 2026-09-25, from WaterCAD: *"a Junction and Pipe toolbar command that adds Junction, Pipe,
  Junction, Pipe, etc until escape."*
- 50|720| **Background layers from a GIS server.**
  Tom, 2026-09-25, on WaterCAD's background layers: *"This seems like a GIS REST server offering."*
  A fifth third-party service is a new paragraph in `privacy.php` (CLAUDE.md).
- 50|721| **Scenarios as layered alternatives, with ready-made scenarios.**
  Tom, 2026-09-25: *"I like the layered scenario alternatives paradigm. I am comfortable with it from
  HEC-RAS, but it could be threatening to new users. What seems very welcoming is the set of
  pre-configured scenarios and the ironclad rule that you are always editing only the specific data
  layers (Alternatives) mapped to that Active Scenario."* Read against our scenario model first.
- 50|722| **Change and revision tracking.**
  Tom, 2026-09-25, from WaterCAD: *"I like change/revision tracking very cool."*
- 25|723| **WaterCAD's element list, against ours.**
  Tom, 2026-09-25, listing WaterCAD's elements: Pipe, Junction, Hydrant, Tank, Reservoir, Customer,
  SCADA, Pump, Pump Station, Variable Speed Pump Battery, PRV, PSV, PBV, FCV, TCV, GPV, Isolation
  valve, Spot Elevation, Turbine, Periodic Head-flow, Air Valve, Hydropneumatic Tank. Which of these
  a migrating user misses first is Mary's and Sue's question (`watercad-migration.md`).

# Reference

Standing prose that is not a task. It was the body of the old category sections.

## New Calculators (Mission Expansion)

No candidate is open. **Score any new candidate on four axes before proposing it** (Tom, 2026-07-14):
availability (a genuine gap raises priority, a saturated market lowers it even for strong mission
fit), technology emergence, field/NGO demand, and real search evidence. A 2026-07-14 pass overturned
intuitions both ways — rainwater harvesting was saturated; VIP latrine sizing, handpump selection and
check dams were genuine gaps. Every "no calculator found" verdict is a web-search signal, not a
verified global negative. Researched and deprioritized as well-served: **chlorination dosing** (CAWST
itself publishes one) and **pond/reservoir evaporation** (6+ free, several using FAO-56).

## Energy for Water

Tom, 2026-07-14: *"I have lifelong focus on water and energy development for humanity... we can dip
our toe into energy (including heat), which is a strong interest of mine (instead of, say,
structural)."* Not scope creep — a second, equally central professional focus, which is why it gets
its own section. `mhp_` (Micro-Hydro Power) is the anchor; everything below either extends it or
opens the *consumption* side. Same 4-axis scoring as New Calculators.

**Candidates backlog.** *Biogas digester sizing* — well-served, 7+ free calculators including several
for the small fixed-dome design (KENPRO, ITCPH). *Solar still (basin-type) sizing* — a real gap, but
weak adoption: the literature is mostly 1970s–80s IRC/Practical Action, and yields are low against
SODIS or biosand. *Passive/evaporative cooling* — not yet run through the 4-axis pass; it belongs
here rather than under water conveyance because evaporative cooling consumes water.

## Discoverability (Search Reach)

Evidence base for this whole section: the Google Search Console query exports of 2026-07-27 and
2026-09-07 — cluster tables, CTRs and the smaller findings are in `dev/usage-data-log.md`. The
headline: **Manning is won and needs nothing** (position 1, 25% then 27.9% CTR), while the comparable
sewer-slope cluster converts at 1%, and at 1.7% on the second export. That non-conversion is
**Task 614**; Tasks 155 and 158 are the other open search-reach ones.

## Completed

**Closed IDs live in `dev/roadmap-closed-ids.md`**, one line each so a cited `Task N` still resolves;
the text stays in git. `roadmap_id_check.php` reads both files: an ID is unique across the pair, and
priority 0 means the block is in the ledger and nowhere else.
