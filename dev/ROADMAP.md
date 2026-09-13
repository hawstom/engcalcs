# Roadmap

Open tasks for the EngCalcs hydraulic calculator suite. **Format: `Priority|ID| Description`.** One
flat list, highest priority first, lowest ID first inside a band. `# Reference` at the foot holds the
standing prose that is not a task.

| Priority | Means |
|---|---|
| **100** | **Next.** Being worked, or the thing to pick up on finishing something. |
| **75** | **Soon.** Real, wanted, queued behind Next. |
| **50** | **Someday.** Agreed worth doing; nothing is waiting on it. |
| **25** | **Maybe.** Worth keeping; not obviously worth doing. |
| **5** | **Parked.** Alive only so it is not re-proposed from scratch. |
| **0** | **Closed** — the block moves to `dev/roadmap-closed-ids.md` in the same edit. |

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

- 100|185| **Match/Copy properties tool (originated during Task 146).**
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

- 100|247| **Customers: metered demands with account numbers, lumped to the nearest node.**
  Tom, 2026-08-09, raised and expanded 2026-08-24. epanet-js has demand allocation by customer;
  EPANET does not. **Full design, with the costs priced: `dev/customer-demands.md`.**
  - **Tom's expansion, in his words:** *"expand/envision as a Customer management model where we are
    adding Customer account numbers, and these are meters on the system. Not sure where this is
    headed, but let's at least think that way. And of course I assume that we lump the Customer
    demands additively at their nearest (by length) node. Graphically, I think you pick a point, it
    draws a meter rectangle, and then you pick a pipe and it connects perpendicularly from the meter
    to the pipe."*
  - **Task 468 is a PREREQUISITE, not a sibling** — a Customer is one of its demand rows extended,
    and 247 must not invent a second breakdown structure. Shares the attach-to-a-link-at-a-fraction
    seam with Task 502.
  - **Recommended first slice: an account number on a 468 demand row, no geometry** — it settles the
    `.inp` answer while that is still cheap to change, and spends none of the drawing-surface budget.
  - **The account number is a label on a demand, never a key into anything**, and it is the first
    personal-adjacent data in the suite: it must never reach a log row or a usage statistic.
  - **AND IT IS NOT A CUSTOM PROPERTY, so 636 DOES NOT BLOCK THIS** (Tom, 2026-09-12: *"epanetjs.com
    doesn't really have 'account number'. They just have the asset id, like any node, so it's not
    absolutely necessary to have a custom property to get Customer working."*). This corrects a
    recommendation made the same day that Task 636 land first so an account number could BE a custom
    property. It can, later, and the gain would be real; what is wrong is treating it as the way in.
    An asset id already identifies a meter, exactly as it identifies every other element.
  - **CONCURRENCY: everything here except the shared field seams can run beside 636.** The three
    places they collide are `pushSpecList()` (one source of truth for writable properties, 8
    callers), the Properties popup's `BAND_NODE`/`RESULT_NODE`, and the Tables pane's columns. The
    geometry -- the meter symbol, the perpendicular leader, the `linkAnchor {link, t}` handle, the
    nearest-node lumping -- touches none of them. **Sequence only the field work; let the drawing
    surface proceed.** Also shares the coordinate frame with Task 641, so the lumping arithmetic
    waits on whatever 641 decides about the drawing plane.
  - **Tom ruled the open questions 2026-08-24 — `dev/customer-demands.md` §7 has all of them.** The
    two that change the build: a meter carries a **Count** (so *forty-two residential services* is
    one symbol), and the attachment point is **user-draggable along its pipe** — a handle on the
    `linkAnchor {link, t}` Task 502 needs anyway, on data we already store. He also asked for a
    **Customer table**, which the pane's generated tab list makes a row rather than a mechanism.

- 100|322| **Convert standing advisories into checks, and survey for the ones nobody has named.**
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

- 100|539| **Gang the neighbour labels so their leaders stop crossing.**
  Tom, 2026-08-26, with a screenshot of two node labels whose leaders cross: *"This might be
  forgiveable if it looked difficult or impossible. But when it looks so easy (to a human) to
  resolve, it's embarrassing."* **That is the right test and it is the one to build against** — not
  "are the labels legible" but "would a person looking at this see an obvious fix we missed". The
  strategy and the name are his: *"can two nearby nodes be labeled as a gang in a direction that
  makes their leaders mutually clear each other's nodes?"*
  - **THE TARGET IS ZERO AND THE LAST REMEDY IS HIDING, which is his ruling of 2026-09-09 and
    supersedes the "a comparison needs no absolute target" line that stood here**: *"if there are
    crossing leaders we need to hide one. The count has to get down to 0... not show them if we
    can't show them beautifully."*
  - **ALL THREE PHASES ARE BUILT AND MEASURED; `dev/label-placement-algorithms.md` §8, §10 and §11
    hold the numbers.** Phase two moves (`Collide.repairCrossingGangs()`, both of his routes, both
    shipping); phase three hides one of every pair that survives (`Collide.shedCrossingSurvivors()`).
    **Every measured view of every shipped example is at 0**, at a cost of 38 hidden labels across
    the 28 views -- 1,715 drawn before the shed and 1,677 after -- and none at all on four of the
    seven drawings.
  - **The only pairs left anywhere are ones where BOTH halves are the user's own** -- two on
    Elm-Street-Center at the fit zoom, one at 2x, one on Net1, all hand-placed on both sides. An
    automatic pass may not hide a hand-placed label, so that is the correct outcome and it is named
    by id in the harness.
  - **IT ALSO SHIPPED FLICKERING, AND THAT IS FIXED (§11b).** One untouched view laid out A B A B A
    at an unchanged count, so counting could not see it, and 14 of the 28 views did not settle --
    with the repair switched off as well, so the oscillator was the placement pipeline and not the
    gang route. `predictNodeLabelBoxes()` replaces the shed's memory of the last layout;
    `dev/lpn-spike/label-stability-harness.js` asserts the LAYOUT, the shed's victims and not the
    count. **All 28 views settle on the first pass now, in every repair mode measured.**
  - **A MEASUREMENT DEFECT WAS FOUND AND FIXED WITH IT (§11d):** the harness read the first-fit's
    boxes beside the DOM's repaired leaders, so every number §10 carried described a drawing that
    did not exist and understated phase two.
  - **WHAT IS STILL OPEN IS HIS OWN FLAG, `spot_prime`** (§9b), and it is now a weaker case than it
    was: not one of the five residual pairs is a gang with free labels and open ground, which is the
    only kind a search could fix. His call, on §10c and §11e.

- 100|592| **[AI] Read a surveyed point list: junctions from a CSV or GPX file.**
  **Promoted from the market researcher's wish list, 2026-09-06, ranked first there** (its journal
  and `dev/agents/market-researcher/wishlist.md` §1 hold the citation and the honest size).
  **RAISED TO 75 by Tom the same day**: *"I am excited about this contribution of Market
  Researcher."* The line that said nobody had asked for it is superseded -- he has. It is also the
  row the `data-entry-clerk` moved ABOVE its own item 2 against its earlier ranking, reached from a
  different direction: a mapped file import removes the per-row round trip entirely rather than
  shortening it, which is what "400 pipes from a marked-up plan set" actually needs.
  - **The evidence is a paper trail rather than an inference.** A field survey -- the actual input
    method for the EWB chapters and Peace Corps volunteers this suite most resembles -- produces a
    flat list of id, latitude and longitude, never an `.inp`. EPANET has no path for it either, and
    the researcher found independent Open Water Analytics and Eng-Tips threads asking how, each
    answered with an ad hoc workaround.
  - **The hard parts are built.** Geographic projects already store longitude and latitude and
    already derive their own frame (`dev/geographic-projects.md`); what is missing is one column
    mapping step and one batch of junctions created at their surveyed coordinates. It belongs
    behind the `Settings > New assets` door Task 542 already opened rather than a new one, and the
    coordinate order rule applies on both sides: the FILE is read as whatever its header says, the
    person reads lat,lon.
  - **The one design question is the same one the `.inp` importer already answered:** a row that
    cannot be honoured is reported, never dropped and never guessed at.

- 100|599| **Graph a value against time across an extended-period run.**
  Tom, 2026-09-06: *"We haven't added anything for time series reporting or graphing such as one or
  more nodes' pressure or head across an EPS."* Correct, and it is the gap that costs most: the run
  ships (`js/lpn-time.js`), the frames are already kept, and the only way to read one node across
  them is to scrub the transport and watch a number change.
  - **THE DATA IS ALREADY THERE, WHICH IS WHY THIS RANKS ABOVE THE OTHER PLOTS.** A run holds every
    reporting step; nothing has to be re-solved, re-fetched or stored differently. This is a reader
    over state we already have.
  - **DRAW IT THE WAY THE PROFILE IS DRAWN.** `lpn_profile_*` already owns an axis pair, a unit
    label per axis, a legend and a hand-rolled plot -- no chart library, nothing vendored, and it
    survives `vendor_integrity_check.php` by having nothing to declare. A second plotting idiom on
    this page would be the expensive mistake.
  - **MULTI-SERIES IS THE POINT** (*"one or more nodes' pressure or head"*): one node over time is a
    number, several on one axis is the comparison an operator is actually making.

- 100|611| **Import a library (pipe types, fittings, curves) from another project file.**
  Tom, 2026-09-08: *"If the Libraries have Import buttons that ask for selecting another project
  file, then import anything that is not a name conflict, that probably would be all that's needed."*
  No export function: a project file already is the export. A name conflict is reported and skipped,
  never renamed silently.

- 100|615| **[H] The water icon: keep experimenting, and record the votes.**
  Tom, 2026-09-09: *"Let's keep experimenting including your proof sheet suggestion and working the
  users."* **THE MARK SHIPPED 2026-09-10 and this task now carries only the votes and the one open
  proportion question.** Drawings, measurements and every rejected round: `dev/icon-preview/README.md`
  and `ship-notes.md`. Sheets: `concepts-2026-09-08b.html` (geometry), `concepts-2026-09-09-color.html`
  (color), `render/ship/` and `render/app-icons/` (the shipped proofs).
  - **What ships:** `icons/favicon.svg` (WT-TALL-3, silver on an overcast sky) on librewaternet.org,
    not-epanet.org and the app page; the engraved mono tower as the `lpn_` Water menu icon; and
    `icon-192/512.png` plus `icon.svg` as the installable app icons. Tom: *"Favicon as it stands is
    my one true love."*
  - **THE SHADING FOLLOWS THE SOLID, WHICH IS THE ONE IDEA WORTH KEEPING.** One light above, three
    surfaces: the CYLINDER wall takes a left-right band, the CONE roof a radial highlight from the
    apex, the HEMISPHERE belly a downward darkening from the springline. Round 3c had shaded all
    three as if they were the wall. Tom supplied the correction in three sentences after losing his
    sketch, and they are quoted verbatim in `ship-notes.md` because nothing else corroborates them.
  - **THE L FOR LIBRE IS GONE** (Tom, 2026-09-10: *"The L is gone."*). It cannot sit on this
    geometry: WT-TALL-3's crown is a 1.5-unit cone against WT-WIDE's 3.65-unit dome, and the letter
    fuses into the outline with zero legible pixels at 17 px AND at 32. `render/ship/L-test.png`.
  - **OPEN, AND THE ONLY THING OPEN: the app icon's legs are 21.5% longer relative to the tank than
    the favicon draws them.** A maskable icon must keep its body inside a circle of 80% diameter
    while Tom's own ruling says descenders reach the bottom, and those are mutually exclusive --
    any point on the frame edge is >=12 units from center against a 9.6 safe radius. The body is
    scaled 0.85 and the descenders run to the true edge, so both hold, at that proportion cost.
    It reads as the same mark and is visibly leggier. Shipped on the coordinator's judgement and
    flagged for Tom; the fallbacks are a smaller safe margin or a second shorter-legged tower.
  - **THE VOTES, and they still do not agree, which is the finding.** MAH, lay person, 29: likes
    old-timey. PCW, senior civil engineer, 60+, no EPANET experience: likes `wt-tall-3` -- the
    aspect that shipped. MJH, civil engineering designer and power user, 27: **read `wt-wide-L` as a
    lavatory SINK**, thought that was fine, and preferred it to any old-timey tower. Three people,
    three answers, and one of them did not see a water tower at all. Keep collecting; a fourth
    reader who does not see a tower is the signal that would reopen the drawing.

- 100|616| **[H] Visual feedback: a prompt history in the banner area.**
  MJH, 2026-09-09, having missed the Hide-titles highlight entirely: he suggests **an expandable
  history of prompts in the banner area**, with this one as a banner prompt reading
  *"Titles hidden. Use Settings..."*. Tom: *"Maybe we keep these perspectives in an evolving
  roadmap task for Icon and for Visual feedback."*
  - **THE HIGHLIGHT ITSELF IS NOT THE PROBLEM AND WAS ALREADY LENGTHENED.** It ran for 4 seconds;
    Tom, watching PCW: *"2 minutes can go by very fast when you are shopping or learning."* It is
    120 s now, cleared early by the first press inside the box. MJH still did not see it, which is
    the evidence that a transient mark on a row somebody is not looking at is the wrong instrument.
  - **What the page has today is one `setNotice()` line that is replaced by the next one.** So a
    message that arrives while the reader is looking elsewhere is gone with no trace, and there is
    nowhere to look it up. A history makes every notice recoverable and costs no new storage if it
    lives in memory for the session.
  - Open questions, none decided: whether the history is per session or per project; whether it
    survives a reload (it should not, on the furniture-versus-project rule); and whether a prompt
    can carry an action, which is what would make *"Use Settings..."* a link rather than a
    sentence. Answer those before building.
  - **IT HAPPENED AGAIN WITH A SECOND READER, AND THIS TIME THE NOTICE MATTERED.** Tom testing with
    KDH, 2026-09-10: *"He didn't notice the banner about the DEM server being disconnected. I did.
    But it wasn't up long enough. I suggest a minute or two."* Two readers, two sessions, two
    different notices missed -- MJH's suggestion arriving twice from different directions is the
    finding, not the individual misses.
  - **THE NUMBER IS `STATUS_NOTICE_MS = 8000`** (`js/looped-network.js:34386`), one global timeout.
    **Do not simply raise it**: the same seam carries routine confirmations, and a two-minute
    confirmation is noise where a two-minute FAILURE is a rescue. Duration by severity means
    `setNotice()` takes one and the `seam.notice()` bridge `js/lpn-terrain.js` calls must carry it
    -- a shared write seam, so a designed change and not a constant edit.

- 100|618| **WYSIWYG hit areas: what you can click is what you can see.**
  Tom, 2026-09-09, on the corrected map: *"On the PC with a default cursor, precision is high.
  Ideally, everything would have a hit area that exactly matches what you see aka WYSIWYG ... Of
  course things like text and flow arrows should have a forgiving blob-ish mask rather than being
  stingy or pedantic about 'You didn't click me'."* Then, after using it: *"Spoiler alert, I think
  we may be golden now except for node fat."* **HIS THREE PRIORITIES, IN HIS ORDER:**
  1. **`visiblePainted` for node and link SYMBOLS on a PC** -- *"that's probably non-negotiable."*
     This is the "node fat" item: a junction's hit area is a 12 screen-pixel disc
     (`LPN_NODE_HIT_PX`) around a 7 px drawn dot, and on a pointer device he wants the drawn shape
     itself. `@media (pointer: fine)` is the mechanism; a coarse pointer KEEPS the band, because a
     finger is not a mouse and `dev/toolbar-icons.md`'s 44 px argument still holds there.
     `.lpn-node-symbol, .lpn-link-symbol { pointer-events: none }` has to change for a symbol to be
     hittable at all.
  2. **A link's hit area matches its own drawn width**, with a small floor. *"a lower limit that is
     not very large because WYSIWYG is important; but contextual cursor changes the argument; I
     really like what I see right now, which is no lower limit, though a lower limit of 3px (one
     extra on each side of a 1-px link) might be appreciated."* So: track `--lpn-lw`, floor at 3 px,
     against today's flat 12 (`LPN_LINK_HIT_PX`).
  3. **A text halo of half the line spacing** -- *"just so that a multi-line label or text mouse as
     a single block; for a text size of 10, 3px (2.5) appears to be about right, and for 12px,
     3 px."* The point is to close the gaps BETWEEN rows so a stacked label is one target, not to
     pad the outside. **THIS ONE IS PROBABLY ALREADY DONE.** He first reported *"default pointer
     50 px away from any visible network artifact"* and RETRACTED it the same day -- *"50px label
     halo was an obsolete report. You fixed it, I think."* -- so that reading predates the grab-shape
     work of 2026-09-09 and is evidence of nothing outstanding. His verdict on the shipped behaviour
     is *"in the wild, I think it's already perfect. I get no gap between text lines."* **So start by
     measuring and expect to find nothing to do**; the half-line-spacing figure above is what to
     build only if a gap turns up between rows at some text size.
  - **The two worked examples to read first**, both found and fixed 2026-09-09: `pointer-events:
    visible` hit-testing a stroke perimeter whose undeclared `stroke-width` defaulted to one WORLD
    unit (846 px of false reach on a geographic drawing), and SVG `<text>` hit geometry quantised to
    Blink's 1/64 user unit, which at 8,431 px per unit is a 131.7 px quantum (271 px of false
    reach). `dev/browser-pass/specs/nodehit.js` and `specs/lblhit.js` are the measuring instruments;
    do not build a third.
  - Not decided: whether the link floor should be absolute or a multiple of the drawn width.
  - **CONFIRMED BY A FIRST-TIME READER.** Tom testing with KDH, 2026-09-10: *"He noticed and was
    reassured about grab to default cursor, though he said it was hard to get a pointer. There was a
    good reason. Things on the map are small."* The cursor change is WORKING and was welcomed; the
    difficulty is ACQUISITION, which is the "node fat" item above reached independently.

- 100|638| **Node and link symbology do not offer the chemical properties.**
  Tom, 2026-09-12: *"Add all chemical modeling properties to Settings.Visualization."* Measured the
  same day: `COLOR_NODE_FIELDS` offers ONE quality entry covering all three analyses, and
  `COLOR_LINK_FIELDS` offers none at all -- no quality, no reaction rate -- so a link can never be
  coloured or labelled by anything the quality run produced. `linkFieldDefs()` has the same gap.
  - EPANET colours a link by its average quality, its reaction rate, its friction factor and its
    status; it colours a node by quality and by initial quality. Default to that list
    (CLAUDE.md's EPANET-vocabulary rule) rather than inventing one.
  - **The unit is the trap, not the list.** `colorFieldUnit()` already overrides the declared unit
    with `qualityUnitId()`, which is the one place that knows a source share has no unit; a
    reaction rate is a third unit again. Add a field and that override is what has to learn it.

- 100|627| **[H] An unreadable document leaves a named tab, then autosave destroys it.**
  Reproduced 13/13 by `dev/lpn-spike/blank-map-harness.js`. **A gap BETWEEN two branches:**
  `initLibrary()` returns null when the open project's stored document does not parse, but its
  last act before reading is `if (!indexEntry(library.openId)) { library.openId =
  library.projects[0].id; }` -- so at `init()`'s `else if (!indexEntry(library.openId))` the entry
  EXISTS, and neither branch runs. Nothing applied, nothing created, **nothing thrown**. The tab
  strip renders the name from the index over an empty `doc`.
  - **THE LOSS IS THE AUTOSAVE, NOT THE CORRUPTION.** At the blank-map moment the user's bytes are
    still on disk and are the only copy; `saveToStorage()` then writes the empty
    `serializeProject()` over that key on the solve debounce. Tom saw exactly this state and it
    held: *"The project is still in storage. But the map is blank."*
  - `adoptOrphans()` drops an entry whose key is ABSENT (`getItem(...) !== null`), so a PRESENT
    unparseable key walks past the filter and fails later at `JSON.parse`.
  - **The fix is a third state, not a wider `else`.** Unreadable is not "first visit" -- creating a
    fresh project there overwrites the bytes too. It must refuse to autosave over a document it
    could not read and say so; `setStorageError()` is the existing seam. Never repair silently.
  - **NO KNOWN OCCURRENCE, and it was filed believing it had one.** Tom's 2026-09-10 document
    parses, holds 97 nodes and 119 links, and 677 symbols were in the DOM. **Do not cite this as
    the cause of any incident.**

- 100|628| **[H] A restored view is never checked against the model it must show.**
  Tom, 2026-09-10, after a machine restart: *"Zoom to fit restores it all. It's a zoom mistake!"*
  Full measurement in `dev/lpn-blank-map-incidents.md`. His stored view was
  `{cx: 835.390625, cy: -4957.78125, s: 5.322222222222222}` on a geographic Net3.
  - **THE SCALE ALONE MADE IT INVISIBLE.** `s` is px per degree; at 5.322 that document's
    0.0965 x 0.082 degree extent draws **0.51 x 0.44 px**. Invisible even perfectly centred.
  - **AND THE CENTRE WAS OUTSIDE THE WORLD IN BOTH AXES.** `mercY()` is 0 at the equator and +-180
    at the cut-off, so cy -4957.78 is 27x outside it; `mercLat()` saturates at exactly -90, which
    is the latitude his status bar showed. cx 835.39 is likewise past longitude's +-180.
  - **NOTHING VALIDATES A VIEW ON THE WAY IN.** `applySaved()` installs whatever the document
    states. A view that cannot intersect the model's own extent, or a scale that draws the whole
    network under a pixel, is arithmetically detectable at load -- and the fix is Zoom to fit,
    which is exactly what recovered it by hand.
  - **THE USER CANNOT TELL THIS FROM LOST WORK.** Tom: *"a blank map is equally fatal as a lost
    project. User doesn't know the difference."* Severity is loss-grade whatever the cause.
  - **HOW THE VIEW GOT THERE IS NOT ESTABLISHED** and the specimen is spent -- Zoom to fit
    autosaved the good view over it. It matches neither shipped Net3's saved view, so not a
    straight copy of a sibling tab's; two Net3 examples that differ in frame and are identical in
    node count (97/119) is still the first place to look.

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

- 75|498| **A public roadmap, with epanet-js's Canny board as the worked example.**
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

- 75|608| **[H] The engine's 664 KB is no longer opt-in, and somebody pays for it.**
  Task 605 made EPANET the default, so a first-time visitor now fetches `js/vendor/epanet-js.js`
  on their FIRST SOLVE rather than on opting in. **A blanket precache is the wrong answer and that
  half is settled**: it moves the cost to service-worker install, paid by every visitor to all
  sixteen calculators including people who never open this page.
  - **RESEARCHED 2026-09-06 by `market-researcher`** (its journal carries the citations, and flags
    which numbers are secondary-source and must be re-verified before any public claim leans on
    them). 664 KB floors at roughly **7 s on 3G and 21 s on 2G** before handshake, and in the
    worst-priced data markets a megabyte is a measurable fraction of daily income. The population
    this suite is written for is disproportionately there.
  - **CHEAP AND INDEPENDENT OF THE REST: a percent-done indicator on that first fetch.** Nielsen's
    response-time doctrine is explicit that past ten seconds a wait needs one or the reader leaves,
    and this is a DELIBERATE CLICK rather than a page load, which is the more forgiving case
    provided the wait is legible. Buildable now, needing nobody.
  - **THE THIRD OPTION THE FRAMING MISSED: a connection-aware idle prefetch, on this page only.**
    `navigator.connection.effectiveType` and `.saveData` let the page ask the visitor's own browser
    which cost is smaller, and prefetch after idle unless they are on 2G or have data-saver on.
    **Chromium-only**, so Safari and Firefox get no signal and must fall back to today's behaviour
    rather than to an unconditional prefetch.
  - `[H]` because the trade is Tom's: it is a claim about who this suite is for, not an
    optimisation.
  - **HE ANSWERED 2026-09-08** (numbering it 600, which is the plots task; the words are this one's):
    *"I am open to your ideas. I am also open to putting up a banner 'Loading solver. Results
    delayed momentarily. Continue working.'"* So the percent-done bullet above is authorized, and
    the sentence he wrote is the sentence to use. **"Continue working" is the load-bearing half** --
    it says the page is not frozen, which is the thing a wait most needs to say and the thing a bare
    spinner cannot. The `[H]` stands on the connection-aware prefetch, which he has not ruled on.

- 75|612| **[H] Screenshot 0082 is the centerpiece of any lpn display.**
  Tom, 2026-09-08, having replaced it: *"I consider my replacement to be the quintessential
  expression of the state of this project. I would consider it the current centerpiece of any
  display about lpn."* The file is not in `dev/screenshots/` yet (the folder ends at 0081); once it
  lands, it leads `dev/screenshots/INDEX.md`, the landing page's screenshots, and the social card.

- 75|617| **A basemap the reader can tone down, and a menu of tile styles.**
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

- 75|623| **[H] File loss judged only by people whose files are throwaway.**
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

- 75|624| **[H] The scale fallbacks turn any missed publish into a flooded canvas.**
  Tom, 2026-09-10, with a screenshot: an all-blue map after opening the geographic Net3 example
  beside an existing project. **NOT REPRODUCIBLE by either of us**, and a repro seeded with his own
  exported `localStorage` (both projects, `openId` on the 35 KB Net3) came back GREEN on HEAD --
  2.8% map ink against the ~44% the failure paints, every scale property published. So there is no
  bad commit to bisect to; the window `88b750a0` narrowed on 2026-09-09 is still open, narrower.
  - **THE MECHANISM IS KNOWN AND WRITTEN DOWN** (`dev/browser-pass/specs/mapscale.js`): every stroke
    is screen pixels divided by `state.s` and handed to CSS as a custom property in WORLD units.
    Miss the publish and CSS falls back to `var(--lpn-lw, 0.7)` and `var(--lpn-sym, 1)`, **which are
    world units too** -- 4,535 px of pipe and a 77,745 px grab band at the Net3's 6,479 px per
    degree. `--lpn-map-ink` is `#1a6faf`, and that is the blue in his screenshot: the flood is the
    PIPES.
  - **THE AMPLIFIER IS GONE, 2026-09-10, on Tom's approval.** All five scale fallbacks in
    `css/engcalcs.css` now read 0 -- `--lpn-sym` (19 sites), `--lpn-lw` (5), `--lpn-hit`,
    `--lpn-hit-coarse`, `--lpn-hair` -- joining `--lpn-nhit`, `--lpn-symhit` and
    `--lpn-symhit-coarse`, which already did and are why the principle was not new. A missed publish
    now draws a pipe too thin to see instead of a page that looks destroyed. **There is no value that
    is both visible at 1 px per unit and harmless at 6,479, so do not restore a number**; the reason
    is written at the site. Invisible on the happy path: pipe still 6.000 px, ink 3.6%, 101/101
    across `mapscale`, `geo` and `color`. **The RACE is untouched and still unreproduced.**
  - **A RACE NEEDS A RACE TEST.** Rebuild the repro as a spec that throttles the CPU (CDP
    `Emulation.setCPUThrottlingRate`) so first paint can beat `publishScaleSizes()`; without one,
    this stays unreproducible and the guard only ever measures the happy path.
  - **A 2026-09-10 BLANK MAP WAS FILED HERE AND WAS NOT THIS** -- 677 symbols drawn, healthy
    strokes, a corrupted `view` (Task 628). The misfile was natural, since this task PREDICTED a
    blank map as its own face. **A missed publish cannot move a camera:** check `view` first.

- 75|625| **[H] BUILT: the app page divorced from EngCalcs chrome. Remainder below.**
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

- 75|626| **A refused beacon is retried like an offline one, 20 times.**
  `EngCalcs._sendOrQueue()` (`js/Calculators.lib.js`) queues on `!resp.ok` as well as on a thrown
  fetch. A 4xx is not a connectivity failure -- the server read the payload and refused it -- and
  the flush re-sends `record.params` VERBATIM, so the retry is byte-identical and so is the
  refusal. One malformed beacon becomes 20 rejections: `flushQueue()` runs on every `online` AND
  every `DOMContentLoaded`, so it is one per page load until `_QUEUE_MAX_ATTEMPTS` drops it.
  Original design, shipped with Task 119 (`ce5533df`), never revisited.
  - **THE SYMPTOM IS A CONSOLE ERROR ON A PAGE THAT DID NOTHING WRONG, DAYS LATER**, which costs
    out of all proportion to the lost analytics row. Found 2026-09-10 in the console of a
    work-loss specimen, where the only suite error was a `log-human-view.php` 400 and it took a
    live fetch of both mounts to prove the page in front of us could not have sent it
    (`dev/lpn-blank-map-incidents.md`). **A fossil in the log is worse than a silence:** it is the
    first thing an investigator reaches for.
  - **The fix is one condition; the judgement is where to cut it.** Retry a throw, a 5xx and a
    429; drop a 4xx. That loses one event, which is the right price.
  - Still unanswered: which page ever queued an EMPTY `page`. 400 fires on `$page === ''` alone,
    and the app page emits `cookieName='Looped-Network'` on both mounts. Task 206 fixed this class
    once for `contact.php`; any page loading `js/Calculators.lib.js` that calls neither
    `echoCookieScript()` nor `echoPageNameScript()` still sends an empty name. **That set is
    enumerable and nothing enumerates it** -- a check is the right shape.

- 75|630| **[H] The map shows lat/lon as xy, and that is the problem.**
  Tom, 2026-09-11, testing at high latitude: *"We don't treat them as xy for length calculations.
  But we show them as xy. And that's a problem."* Meridians are drawn parallel where on the ground
  they converge, so a screen rectangle is not a ground rectangle and a true ground square draws as
  a donut segment. **`sec φ - 1` is 19.8% at Phoenix and 100% at 60N** -- about 150x the
  ellipsoidal effect the mathematics report found, which is a different phenomenon and must not be
  offered as an answer to this one.
  - **THE DECISION RECORD IS `dev/map-projection-decision.md`**, including his own architecture --
    store easting/northing in a stated CRS, let the drawing frame BE that plane, and need the
    projection only when talking to tiles and the geocoder -- and the one question that sizes the
    work: proj4js or UTM alone. Measurements: `dev/map-coordinate-review.md` and
    `dev/map-coordinate-mathematics.md`.
  - **A SCALE BAR IS A MITIGATION, NOT THE FIX**, and he corrected me when I said otherwise: it
    makes one number honest at one latitude while the scale varies down the view. Rank it below
    projections.
  - Corrections the mathematics found, each with its own line in that report: the Sterbenz comment
    (wrong twice over), `maxScale()` unclamped by extent (28 px of float32 drift at scope),
    `geo-precision-harness`'s exactness claim (true in Novato, false in Nairobi), and `lenAuto`
    being a PLAN length that does not say so (1.12% at 15% grade).

- 75|634| **Re-shoot the everything-at-once frame; it is the front page's lead.**
  `dev/screenshots/0082.PNG` is published as the LibreWaterNet lead image and as Plate 1 of
  screenshots.html, on Tom's instruction 2026-09-12: *"This quintessence of what we've built is
  still not implemented after multiple reminders from me. Do it. Feature it prominently."* It is
  the right picture and it is older than the software in two visible ways, both fixed by one
  capture: it carries the **EngCalcs navbar the divorce deleted** (Task 625), which is the one
  thing this site is not supposed to advertise, and its **Libraries box has no Fittings section**,
  which Tom spotted himself. Drop the new frame in as `0082` and nothing else changes: the file
  name, the dimensions, the alt text and both captions already fit.

- 75|635| **A Zoom to button on the Properties box.**
  Tom, 2026-09-12. Zooms the map to this element. **Use the My Location / Use Location icon**
  (a circle with quadrant ticks pointing mostly inward) -- which `lib/Icons.lib.php` does not have:
  `position` is a four-way arrow cross and `zoom` is a corner-bracket extents mark, so this needs a
  new icon definition, not a borrow.

- 75|637| **A Graph button on the Properties box.**
  Tom, 2026-09-12. Graphs the time series of the CURRENTLY FOCUSED property of the current element,
  in a new bottom-pane tab named for what it shows -- his example, `L435 Lake Trace`. The tab
  carries a selector for the property to graph and an Export as: image PNG, PDF, comma-separated
  values CSV, spreadsheet ODS. It may carry a time-range selector. Shape and the two unknowns
  (PDF and ODS are formats this suite has never written): `dev/graphs-scope.md`. Task 640 is the
  menu this belongs to and Task 599 is the plot itself.

- 50|146.09| **A key map: the whole project as a thumbnail, with a box round where you are.**
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

- 50|282| **Offer to attach the backdrop an imported `.inp` names.** An `.inp` (and a `.net`) stores
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

- 50|283| **Map label legibility: what remains is the AUTO-HIDE rule.** Tom, 2026-08-11, after
  studying epanet-js. Label prefixes (`labelPrefixFor()`) and pipe-aligned link labels
  (`alignedLabelAnchor()`) both shipped under Tasks 333 and 329; two pieces are left.
  - **Auto-hide text that does not fit, as a rule we STATE rather than inherit.** Tom leans to two
    separate toggles — *"Auto-hide map-sized text"* (or no toggle, and the answer is always no) and
    *"Auto-hide screen-sized text"* (or no toggle, and the answer is always yes). The asymmetry is
    the point: map-sized text shrinks with the drawing and its absence would be surprising,
    screen-sized text stays put and collides. epanet-js hides NODE labels at one zoom threshold, all
    together and apparently hard-coded — cruder than per-label fit, so beat it rather than copy it.
    Interacts with Tasks 379, 377 and 399, which are the same question at other granularities.
  - **Units as an optional suffix**, for anyone who wants epanet-js's behaviour. Not the default —
    Tom: *"I personally don't see the need for units on a map when they are endlessly redundant. But
    we could offer that."*
  - **Flow direction arrows stay.** epanet-js has none; Tom: *"I like that we do."* Recorded so a
    future tidy-up does not quietly remove them in the name of matching.

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

- 50|600| **The three EPANET plots we do not have: contour, frequency, flow balance.**
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

- 50|601| **Calibration files: measured field data, against the model that predicts it.**
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

- 50|604| **Read an EPANET `.PRO` profile file.**
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

- 50|610| **[H] Paste that CREATES table rows: gated on the data-entry clerk's own spec.**
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

- 50|632| **Animation speed control for the transport.**
  Tom, 2026-09-12: *"Animation speed: We should add a control. Put on roadmap."* The transport
  plays a run at one fixed rate today. A long period run crawls and a short one is over before it
  reads.

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
  one row of an abbreviated design table, added and removed like demand categories and edited in
  place like a spreadsheet -- key, label, applies-to, validation, character restriction, length,
  low and high limits. **Every applicable custom property then appears everywhere an ordinary one
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
  - **SINGULAR, in the database tradition** (Tom, 2026-09-12). The branch is `custom-property`, the
    document is `dev/custom-property-scope.md`, and a table is named for the row it holds.
  - **EMBRACE 247 but do NOT gate it.** An account number could be a custom property and the saving
    would be real, but Tom ruled it is not the way in: an asset id already identifies a meter. Land
    the field seams here first -- `pushSpecList()`, the popup bands, the Tables columns -- and 247's
    geometry runs beside them.
  - **AVOID running beside 640.** Graphs must offer a custom property in its selector, so it wants
    this list to exist before it is written rather than to invent a second one.

- 50|639| **Layers: the first heading under Map and page.**
  Tom, 2026-09-12. A Layers sub-heading under `Settings > Map and page`, ABOVE Appearance, with a
  row per layer and the columns On/off, Opacity, Size (default), Color (default), Z.
  - **Phase 1 layers: Text, Symbol, Link, Flow arrow, Background.** Roadmap layers: Contour
    (Task 640) and Customer (Task 247).
  - **Z is RELATIVE**, ranged 0 (default) to roughly 2-10 times the number of layers -- so adding a
    layer never renumbers the others, which is the whole reason it is not an index.
  - A layer setting is MODELLING data by CLAUDE.md's project-versus-browser rule and rides in
    `serializeProject()`; it is not window furniture.

- 50|640| **A Graphs submenu under Water, holding five plots.**
  Tom, 2026-09-12: Time series, Profile, Contour, Frequency, System flow balance -- all in the
  bottom pane except Contour, which is a map layer switched under Layers (Task 639). Profile is
  BUILT and moves under this menu rather than being written again. This row is the menu, the tab
  shape and the export set; the plots themselves are Tasks 599 and 600, which keep their own
  priorities. Full specification: `dev/graphs-scope.md`.

- 50|641| **Choose a real EPSG projection in the new project box.**
  Tom, 2026-09-12. Beside Unprojected XY and WGS 84 / Pseudo-Mercator lat/lon, the full GIS list.
  The status bar then shows the projection name (or *not georeferenced*) beside Northing and
  Easting -- or X and Y, or Lat and Lon -- and the scale.
  - **A PROJECT CANNOT CHANGE ITS PROJECTION**, deliberately, unless an import conversion wizard is
    built: *"We don't want this to be a dabbler action."* The one door is `Open an xy file on the
    map`, which becomes **Open and convert coordinates...**.
  - **CONCURRENCY: this and Task 636 are the safe pair, and they are running now** (Tom, 2026-09-12:
    *"Have projection and custom property proceed at full speed."*). No shared seam was found: this
    branch lives in the coordinate frame, the new-project box and the status bar; 636 lives in the
    Settings box, the Properties popup, Find and the Tables pane. **Task 247 is the one to keep
    away from** -- lumping a meter to its nearest node is arithmetic in the plane this task is
    changing underneath it.
  - **Task 630 is the defect this feature answers** -- the map draws lat/lon as xy, which is 19.8%
    at Phoenix and 100% at 60N. Read `dev/map-projection-decision.md` first: it holds Tom's own
    architecture (store easting/northing in a stated CRS, let the drawing frame BE that plane) and
    the one question that sizes the work, proj4js or UTM alone.

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
