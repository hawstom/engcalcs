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

Five values and nothing between them. Ties are the point: twelve tasks at 75 says "these are the soon
ones" honestly rather than pretending to rank them. *(Replaced a 0–100 free scale on 2026-08-21, when
88 tasks used 19 distinct values and 40 of them sat between 40 and 60. The rejected alternative was to
re-space the fine scale; 45-vs-50 is a distinction nobody can re-derive a month later.)*

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

- 25|574| **What is left of the `.net` slot map: nine slots nothing identifies.**
  **MOSTLY CLOSED 2026-09-03.** The slots were MEASURED, not inferred: the import report prints
  `index: value`, Tom imported his Net3 and read the indices back, and every name was then checked
  against what EPANET itself wrote for the same model (`dev/net-import-study/`). Two independent
  sources agreeing on both index and value is what confirmed it.
  - **Named now:** `[TIMES]` 23-31 (all nine, in order), `[ENERGY]` 32-35 (34 is the optional
    `Global Pattern`, which is what explains the gap), `[REPORT] Status` at 10, the water-quality
    trio 11/12/14 as ONE line, `CheckFreq`/`MaxCheck`/`DampLimit` 36-38, and EPANET 2.2's PDA
    quartet 41-44.
  - **THE DEFECT THIS CLOSES: `[TIMES]` was never written**, so every `.net` ever imported arrived
    with no duration and no timesteps, and an extended-period model silently became a single
    instant. `[ENERGY]` and `[REPORT]` were lost the same way.
  - **Still unnamed and still reported: 16-22, 39, 40** -- `1`, `First` and a run of zeros that
    EPANET's own export of the same model does not state anywhere, so there is nothing to match
    them against. They cost nothing while they are reported, and naming one from a guess is what
    the first attempt did.
  - **THE FIRST ATTEMPT IS WORTH KEEPING IN MIND, because it looked right.** The same values without
    their indices decoded plausibly against EPANET's section order and were WRONG by one, which
    wrote `Duration 0.0` and `HeadError 10` into a converted file. The values were right and the
    offsets were not; a run of repeated zeros cannot be counted by eye. The repair was not more
    care, it was making the file state its own indices.

- 50|575| **The six element symbols, redrawn from Tom's sketch.**
  Prototype published 2026-09-02 and both open questions answered: the junction becomes a shaded
  RING rather than a solid dot, and the menu pipe keeps its end bars with the line stopping at them
  rather than crossing.
  - **The convention Tom stated, which three of six symbols do not follow today:** map NODE symbols
    carry a thematic shaded fill; PUMP and VALVE are solid. Read out of `lib/Icons.lib.php`, the
    junction ships solid with no outline, the valve ships shaded rather than solid, and the pump
    carries no fill at all.
  - **Two shapes change: reservoir becomes a triangle and tank a rectangle.** The argument is
    Tom's own correction about colouring -- a coloured asset floods ENTIRELY, fill and stroke in
    one colour, so no outline survives. Today those two are told apart by a flat top against a
    domed one, which is an OUTLINE difference and exactly what flooding destroys.
  - **The pump diverges between menu and map on purpose, and it is the only symbol that does apart
    from the pipe's bars.** EPANET draws the map pump with a snout as long as the body is wide,
    about 2:1, which is the proportion a reader recognises on a drawing and the wrong one for a menu
    row. Body 10 and snout 10 on the map; body 12 and snout 6.5 in the menu.
  - **Each new silhouette needs its matching opaque backdrop path** (`prependSymbolBackdrop`), or a
    pipe appears to stop short of the shape instead of running behind it.
  - **Separate and undecided: the default map colour.** The map draws linework black; the sketch
    paints it suite blue. That governs every project with colouring OFF, which is most of them.

- 75|578| **Fire flow: the EPS frame and the Run concept, extracted from 530.**
  Everything else in Task 530 shipped and that task is closed. Two phases were never built and are
  kept here so they are not lost in a closed block.
  - **Picking an EPS frame.** The sweep answers one instant. A project with a clock has many, and
    the honest question is which one a fire flow is checked at -- maximum day is the convention, and
    the page has no way to say "run the sweep at hour 14".
  - **The Run concept, in Tom's own sketch (2026-08-27):** *"a Run names a scenario among its
    parameters."* A named Run would carry the scenario, the required flow, the residual and the
    frame together, so a report says what it was a report OF.

- 75|583| **Two EPS sentences left, and one states an unmeasured cause.**
  Tom read `dev/eps-terminology-audit.md` and marked all eight rows; his marks are committed verbatim
  (`9562285a`) and §4 records what came of each. **Five applied 2026-09-04** -- three translated, so
  **78 retranslations are owed** (`lpn_inp_drop_eps`, `lpn_time_no_engine`, `lpn_time_no_period`).
  - **`lpn_energy_over` is SETTLED**, in a second ruling the same day and in his own wording: *For
    extended period simulation of {time}*. The first pass had dropped the duration, which
    `energy-anchor-harness.js` caught as the guarded property it is; he rejected the two-line repair
    and put the duration back inside the sentence. Untranslated, so free. §4 has the one place the
    shipped string departs from his sketch and why (H:MM cannot carry a trailing "hours").
  - **`lpn_time_running` is the one row of eight he left blank.** Unruled, so unchanged, and the
    audit rated it the single best place to name the analysis: it is the progress line.
  - **[H] `lpn_time_run_note` was not a wording question, and answering it found a defect** (§5).
    The behaviour is sound -- the page computes one instant of an EPS project only when the user has
    unchecked *Recalculate automatically* themselves, `autoRunAllowed()` being the whole gate, and
    above `LPN_TIME_SLOW_MS` the page only advises it. **But the sentence asserts a speed the code
    never tests**: `lpnTimeStatusNote()` reads no timing at all, so a user who unchecks the box on a
    fast network is told their network is slow. Replacement in §5, awaiting his word. Translated: 26.

- 75|582| **Pump efficiency curves: the wiring left in `docEnergy()`.**
  The curve is now KEPT and WRITTEN BACK (`doc.inpSections.CURVES`, carried verbatim), and
  `lpnToInp()` emits it as `EF_<pumpid>` with its `EFFIC` row. Anchored by
  `dev/lpn-spike/pump-effic-curve-harness.js`: byte-identical round trip, and EPANET reporting the
  curve's own 62.5% where the same document's global efficiency says 75.
  - **WHAT IS LEFT IS THE WIRING, and it was left because the track that built this could not touch
    `js/looped-network.js`.** `docEnergy()` must add
    `efficCurves: EngCalcs.lpnEfficCurves(doc.inpSections, <project flow unit to m3/s>)` to the
    record it returns; that is the only bridge between the document and the engine writer, and the
    factor is the whole of the flow-axis trap. Until then the page still runs such a pump at the
    global efficiency, which `lpn_energy_curve_note` still correctly discloses.
  - **THAT NOTE BECOMES FALSE THE MOMENT THE LINE LANDS**, so the same commit rewrites
    `lpn_energy_curve_note` in `lib/lang.ec.en.php` (translated: 26) and regenerates the payloads.
  - Fixed on the way: the exporter used to write an `[ENERGY]` row naming a curve it did not write,
    which is an `.inp` EPANET refuses at the door.

- 75|579| **The four EPANET sections still carried and not understood, extracted from 566.**
  Task 566 is closed: water age, source trace, the chemical mode and pump energy all ship, and
  `[QUALITY]`, `[REACTIONS]` and `[ENERGY]` are interpreted. Four sections remain carried verbatim,
  round-tripping byte-identically and named in the import report:
  - **`[SOURCES]` and `[MIXING]`** -- a booster dose at a node and a tank mixing model. The chemical
    mode runs without them: a reservoir's initial quality is held for the whole run, which is enough
    to state a plant residual, and every tank is treated as completely mixed. The import report says
    exactly that. **Tom, 2026-09-04, of that note: *"Why aren't we implementing this instead of
    shipping without it?"*** The honest answer is that neither is blocked -- `[SOURCES]` is four
    fields on a node and `[MIXING]` is a model name and a fraction on a tank, both of which EPANET
    would then honour with no arithmetic of ours -- so this is a priority question and not a
    difficulty one. What is missing is a user who has one, which is the same bar `[RULES]` waits at.
    A booster station is the commoner of the two by a distance.
  - **`[TAGS]`** -- a free-text tag per element. Cheap, and the natural home for Task 247's
    customer/account work.
  - **`[REPORT]`** -- formatting for a `.rpt` this page never requests. **Probably correct to leave
    carried for ever**; say so deliberately rather than leaving it on a list.
  - **`[RULES]`** -- parked on purpose, Task 248.03. A rule's numbers are in the units of the file
    so no factor patches it, and Tom's evidence bar stands: it waits for a user who has one.

- 75|581| **An empty box cannot say "this file states zero" apart from "nothing is set".**
  Found 2026-09-04 while Tom read the refreshed gallery: Net2 states `Fluoride mg/L` with all-zero
  reaction globals, and Net3 states price 0 and demand charge 0, so the examples are faithful and
  the interface still reads as though the numbers were never filled in. **Sparseness is deliberate
  and load-bearing** -- an empty box exports no line and a typed zero exports a line stating zero,
  and those are two different files (Task 553) -- so the fix is not to fill the box. It is to show
  the difference, and the honest question is whether a reader ever needs to see it or only an
  exporter does.

- 100|545| **The list is a file, the marks are data, and both survived a reading.**
  *(The `[H]` came off 2026-09-01. Tom read the list and marked it; his marks were committed
  VERBATIM before anything touched them (`9a15e248`), then transferred — replacements into
  `lib/lang.ec.en.php`, approvals into `dev/english-key-rulings.json`, questions into the session
  report. **Nothing was lost this time, and the mechanism is what stopped it.** What is left is not
  his: it is the next reading, whenever there is one.)*
  - **AND THE GUARD PROTECTING HIS WORK HAD A FALSE POSITIVE THAT WOULD HAVE OUTLIVED IT.**
    `--write` refused even with the file byte-equal to HEAD, because **PHP's `exec()` strips
    trailing whitespace from every line** and only one side of the comparison went through it. One
    of Tom's own lines ended in a space, and that single character made the list permanently
    unregenerable without `--force` — **the false positive firing precisely when the guard matters
    most, since a human writing on a file is exactly what leaves trailing spaces.** Both sides are
    normalised the same way now.
  `dev/new-english-keys.md` is generated by `new_english_keys.php --write`, tracked, grouped by
  feature, carries every string in full, and is kept current by a BLOCKING `--check`. **101 keys
  today, all `lpn_`.** It exists because four batches of new English had been reported to Tom in
  conversation with the words "listed in the task for your ruling", and exactly one batch had
  actually reached the roadmap — he asked *"19 new keys are listed: Where?"* and they were not.
  - **[H] AND THEN THE FILE ATE HIS WORK, WHICH IS THE THING TO FIX BEFORE ASKING HIM AGAIN.**
    Tom, 2026-08-29: *"I did this task. I believe you overwrote my painstaking edits."* He is right
    that they are gone and wrong about who: at the start of the session he suspected, the tree was
    clean, so nothing of his was there to overwrite — it happened one session earlier. **They were
    not recoverable** from any commit, any dangling blob, either stash, or an editor backup. His
    rewordings that DID survive are the ones he also applied to `lib/lang.ec.en.php`, which is not
    generated: `lpn_demand_tip`, `lpn_result_demand_tip`, `lpn_field_demand_pattern_tip`.
  - **THE PROCESS SAID "A RULING IS A SENTENCE IN CONVERSATION, NOT AN EDIT" AND THAT WAS NAIVE.**
    You hand somebody a file of strings to read; they will write on it. **`--write` now REFUSES to
    regenerate a file that has been hand-edited** — it compares what is on disk with what git last
    committed, so ordinary drift from a new English key regenerates freely and a human's marks stop
    it dead, naming the recovery. `--force` exists and the message says not to reach for it.
  - **AND AN APPROVAL IS DATA NOW, WHICH IS THE HALF THAT WAS MISSING** (2026-08-29). He read the
    whole list and marked 92 keys — 81 `OK.`, 11 `Edited.`. The edits went into `lang.ec.en.php` and
    were safe; **the 81 approvals were about to be thrown away by the next regeneration**, handing
    him the same list unmarked. `dev/english-key-rulings.json` keeps them, keyed on the EXACT
    English ruled on, so a ruling lapses by itself when the wording changes and nobody is ever shown
    an approval of a sentence that has since moved. The file now opens with **"11 still to read"**
    rather than a count of everything.
  - **What is left is the reading**, and it is a sitting rather than a trickle. **The sprint is
    downstream of it**: translating a string he then rewords is paid work thrown away, which is the
    mistake sprint 459 recorded when nine agents read a payload that disagreed with the source.
- 100|553| **Demands and Hydraulics options: BUILT, and every option now has a control.**
  *(The `[H]` came off 2026-09-01. The one question it named — does `Accuracy` earn a row — Tom had
  already answered on 2026-08-28 (*"Deprecate our 'Convergence tolerance' to use the EPANET
  setting"*), and his broader 2026-08-29 ruling settled the rest. **The marker outlived the
  question by three days**, which is the same failure 508 and 530 each recorded this week.)*
  Tom, 2026-08-28, of the junction popup: *"The EPANET UX is confusing by breaking out one demand
  (the initial) specially... remove the original Base demand and Demand pattern inputs and leave in
  their place the Demand categories interface."* All four parts shipped the same day.
  - **(1) The table is unconditional.** Task 468 had put row 0 inside it only where a junction
    already had a breakdown, so the commonest junction still met two plain fields — the EPANET
    asymmetry, surviving in the one case nobody looked at. The DOCUMENT did not change.
    Consequences that were not obvious: row 0's delete had always had a row 1 to promote and now
    does not (disabled on a sole row), and the override marker had been carried by the plain field
    that is gone, so a scenario override on a one-demand junction had nowhere to show itself.
  - **(2) "Category" became "Description"**, in the popup heading, the Tables pane and the Find
    property's English alias.
  - **(3) The default pattern moved from the Libraries box to Settings > Hydraulics**, and the rest
    of EPANET's `[OPTIONS]` came with it. **Net3 opens saying Pattern 1 with nobody typing it**,
    which was his acceptance case. **Four options got a row because each changes an ANSWER in both
    engines** — Demand multiplier, Specific gravity, Relative viscosity, Emitter exponent, Maximum
    trials. **Eight are carried, exported and honoured by EPANET but have NO control**, on
    CLAUDE.md's emitter-exponent precedent.
  - **NOTHING IN AN `.inp` IS DISCARDED ANY MORE, 2026-08-30**, which is the third and last time this
    defect had to be fixed. `js/lpn-inp.js` no longer keeps a list of what to CARRY; it keeps
    `INP_SECTIONS_READ`, the list of what it takes APART, and **everything else is carried verbatim
    by default.** That is the safe direction for the case nobody can enumerate — a section another
    program invented now survives a round trip too. `[ENERGY]`, `[QUALITY]`, `[SOURCES]`,
    `[REACTIONS]`, `[MIXING]`, `[TAGS]` and `[REPORT]` live on `doc.inpSections`, beside
    `doc.rules` — which keeps its own field, because one section in two places is two answers.
    - **`[TAGS]` and `[REPORT]` were not even in `REPORTABLE`, so they were dropped in SILENCE.**
      Everything else at least said it was going.
    - None of them reaches the EPANET engine, on the `[RULES]` reason: `lpnToInp` writes LPS and
      METRES always, and EPANET rejects a whole input over one line naming an element it was not
      given. The harness asserts the absence.
    - **THE GALLERY EXAMPLES WERE THE THING TOM ACTUALLY HIT, and they are a category nobody had
      thought about: a STORED PROJECT does not gain a feature the day the importer does.**
      `examples/Net1|2|3.lwn` carried no `qualityOptions` at all. Refreshed **surgically, not by
      regeneration** — Net2 and Net3 carry a backdrop an `.inp` cannot hold and Net1 carries
      hand-placed label offsets, so a re-import would have destroyed both.
    - **[H] AND ONE GAP LEFT OPEN ON PURPOSE, WHICH IS TOM'S CALL:** `settings.hydraulics` was NOT
      added to those examples. Adding `Accuracy 0.001` would loosen the gallery's solve from our
      own `1e-9` — a change to what the examples COMPUTE, not to what they carry.
    - Guards: `dev/lpn-spike/section-carry-harness.js` (130), whose expectation is always the
      original `.inp` and whose read-list is PARSED OUT of `js/lpn-inp.js` rather than restated, so
      it cannot pass after somebody teaches the importer a new section. §6 opens the shipped
      gallery `.lwn` against its own source and was verified to fail on the pre-refresh file.
    - **Four new keys and two rewritten ones; `lpn_inp_drop_quality` and `lpn_inp_report_lead` are
      now FALSE in 26 languages each** and are the resync item. The lead no longer says "here is
      what changed on the way in" — it says nothing is thrown away, and separates kept-but-unused
      from genuinely changed, which is the distinction Tom could not read off the old sentence.
  - **TWO KINDS OF "RESEARCH SAYS OTHERWISE", AND THEY ARE NOT EQUALLY STRONG** (Tom agreed,
    2026-09-01). *"We measured it and it changes nothing"* is a fact about OUR engine — it is what
    justified leaving CheckFreq, MaxCheck and Status without rows. *"The profession has moved on
    from it"* is a fact about PRACTICE, and it is the only one that justifies omitting a control a
    user expects to find. Tom: *"If 'everybody' has deprecated some part of EPANET (probably not
    likely), we shouldn't be a maverick."* **We have no evidence of the second for anything, and
    the day we think we do it is a question for the planning engineer with a citation, not a
    judgement call in a commit message.**
  - **THE RULING IS DISCHARGED, 2026-09-01: every `[OPTIONS]` key now has a control or a MEASURED
    reason not to.** Rows added for Unbalanced (with its conditional trial count), HeadError,
    FlowChange and DampLimit. Three keep no row and the reason is a measurement rather than an
    opinion: **CheckFreq and MaxCheck are inert** — on Net3 at a tight accuracy, values 1/2/100 and
    1/10/200 return heads identical TO THE LAST BIT at all 92 nodes, and likewise on a four-pipe
    loop holding a check valve, which is the shape where status checking is supposed to matter;
    and Status selects what EPANET writes into a `.rpt` this page never asks for. **All three are
    asserted inert, so if one ever stops being inert it has earned its row.**
  - **`Accuracy` was already answered and the answer was Tom's**, 2026-08-28: *"Deprecate our
    'Convergence tolerance' to use the EPANET setting unless you find a strong reason not to."*
    There is ONE row; `solveAccuracy()` reads it for both engines, and the distinction the two-row
    proposal wanted lives in the tip instead — the built-in solver weighs the change against the
    water the network delivers, EPANET against the water it carries.
  - **A SHIPPED DEFECT THIS FOUND, WORTH MORE THAN THE ROWS.** `signatureOf()` in
    `js/lpn-epanet.js` did not include `model.hydraulics`, and nothing pushes an option through a
    setter — so **ANY option change reached a REUSED EPANET session and did nothing, silently, for
    as long as the network's shape held.** That includes rows that had already shipped. Measured:
    fourteen different option sets on one network returning one identical head. Fixed and
    asserted with a line that reproduces the regression.
  - **AND A UNIT BUG OF THE KIND THIS SUITE EXISTS TO PREVENT:** `HeadError` is a head and
    `FlowChange` a flow, both passed to the LPS/metres engine writer UNCONVERTED — a US project's
    `HeadError 0.001` ft reached EPANET as 1 mm. Converted through a new PURE `engineHydraulics()`
    clone that never writes `settings.hydraulics`.
  - **The gallery examples carry `settings.hydraulics` now**, added by hand to Net1/2/3 and Novato
    — the eleven values each `.inp` states. **Measured movement: worst head change 2.5e-7 m, worst
    relative flow change 0.00224%**, the two non-EPA examples exactly zero, every example still
    converging. Below any decimal the page displays, so it was committed rather than escalated.
  - **A wording correction driven by measurement, not by the manual:** the Unbalanced stop choice
    was first labelled from EPANET's documentation, which says it refuses. **Through the toolkit
    it does not refuse — it hands back the last iterate**, so the label says "Stop and report the
    last trial" (Task 573 Wave 0 spelled out what "Stop there" left to inference) and the tip says
    what actually happens.
  - **AND THE `[OPTIONS]` LOOP STOPPED ENUMERATING, 2026-09-02, WHICH IS THE END OF THIS DEFECT
    CLASS.** `Map` and `Hydraulics USE/SAVE` were carried by `75866b60`; the audit that followed
    found the rest, so the reader's branch chain is now the list of what it READS and a final
    `else` carries any remaining line verbatim, `INP_SECTIONS_READ`'s rule one level down. That
    also caught the worst member of the family: **`Demand Model PDA` was matched by the `DEMAND`
    branch, parsed to NaN, fell back to 1, and the exporter then wrote `Demand Multiplier 1` over
    the line the file stated** — an invented value, not a dropped one. `Minimum/Required Pressure`,
    `Pressure Exponent`, `Pressure <unit>` and the obsolete `Segments`/`Verify` were also read
    past. `Emitter Exponent` was the mirror defect, written unconditionally so a file stating none
    gained one; every EPA reference model states it, which is why 1,280 round-tripped tokens never
    saw it. Carrying is not telling, so `demand-model` and `other-options` are two new report
    sentences: a pressure-driven file is solved demand-driven here and says so.
    Guards: `dev/lpn-spike/inp-export-harness.js` §8 and §9 (4,490 checks).
  - **TOM'S RULING, 2026-08-29, AND IT IS BROADER THAN THE QUESTION ASKED:** *"I think that every
    setting from EPANET must be added and implemented unless research says otherwise."* **That
    reverses the emitter-exponent precedent as a default.** The standing shape was carry-and-hide
    unless a setting earns a row; his shape is give-it-a-row unless research says not to. So the
    eight carried-but-controlless `[OPTIONS]` each need either a control or a written reason, and
    the burden of proof has moved. `Accuracy` is no longer the question — it is one instance of it.
    - The reason NOT to give `Accuracy` a row still has to be answered rather than assumed: ours is
      `js/lpn-solver.js`'s own convergence tolerance and EPANET's is a relative flow change summed
      over the network, and **two rows a reader cannot tell apart is worse than one**. Under his
      ruling that is now an argument to make in the tips, not a reason to hide the row.
  - *(the question that ruling answers, kept for its reasoning)*
  - **[H] THE ONE QUESTION FOR TOM: does `Accuracy` earn a row?** It is on his list and it has no
    honest place beside `Convergence tolerance` directly above it — EPANET's is a relative flow
    change summed over the network, ours is `js/lpn-solver.js`'s own, and two rows a reader cannot
    tell apart is worse than one. Options: show both with tips that distinguish them, replace ours
    with EPANET's, or leave it carried-but-hidden as it is now.
  - **(4) The two borders were the suite-wide `table, th, tr, td { border: 1px solid blue }`**, which
    names four elements where these editors reset two. `.lpn-pane-table` has the same unreset frame
    and is deliberately NOT changed: its blue row rules are a data grid's separators and nobody has
    called them wrong.
  - **AND THE IMPORTER STOPPED REWRITING DEMANDS**, which was a standing violation of the
    file-is-canonical rule nobody had noticed: `[OPTIONS] Demand Multiplier` was folded into every
    demand as it was read, so a file stating 189.95 with a multiplier of 2.5 was STORED as 474.875 —
    the user's own characters spent. It is applied at `resolvedDemand()` now, and the engine bridge
    writes the option only on the extended-period path, where EPANET does the multiplying itself.
  - Guards: `dev/lpn-spike/default-pattern-harness.js` (24), `hydraulic-options-harness.js` (60),
    and the two demand harnesses updated. The options harness asserts the PHYSICS, not that a number
    moved: specific gravity raises pressure and leaves flow alone; viscosity acts under
    Darcy-Weisbach and not under Hazen-Williams, measured on a roughness and a velocity where it
    can (the fixture's own 50 gpm sits in the transition zone, where the sign is not a monotone).
  - **A DEFECT THIS FOUND, worth more than the feature:** `libPatterns()` is a getter that ASSIGNS
    (`doc.patterns = doc.patterns || []`), which is right for a writer and wrong for a reader. Read
    from a Settings row — rebuilt on every unit change — it wrote `patterns: []` into a document
    that stated none, and `unit-change-harness.js` caught it as a non-destructive unit switch that
    was not byte-identical. `libPatternsRead()` is the pure half. **Look for the other getters
    shaped like this.**
  - **THE WATER-QUALITY `[OPTIONS]` ARE CARRIED NOW (2026-08-29), and verbatim was the only
    workable shape rather than merely the cheap one.** Net3 states `Quality Trace Lake` and Net1
    `Quality Chlorine mg/L` — not numbers at all — and `String(parseFloat('1.0'))` is `'1'`, so a
    parsed carry could not return the file's own token. They live in their own `qualityOptions`
    bag, NOT in `settings.hydraulics`: that bag is numeric, is read by the Settings rows and by
    the engine bridge, and already has a `tolerance` nearby — a water-quality `tolerance` beside
    it is a trap for the next reader. No Settings row, on the emitter-exponent precedent.
    `dev/lpn-spike/quality-options-harness.js` (24) round-trips Net1/2/3 byte-identically through
    a deliberately dumber second reader, with the original `.inp` as the expectation.
    - `lpn_inp_drop_quality` said the settings *"were left out"* and that went false the moment
      they were carried — the `lpn_inp_drop_rules` regression again, one release later. It now
      describes the SECTIONS, which genuinely are dropped. **Its 26 translations still carry the
      old, false claim** and are a resync item. `lpn_inp_drop_quality_options` is the new
      sentence and awaits Tom's wording.
    - **The getter sweep this task asked for found two live call sites**, not none:
      `buildPatternSection()` read through `libPatterns()` purely to test `.length` — and that is
      a RENDER, so opening the Libraries box wrote `patterns: []` into a document stating none,
      exactly the defect 553 fixed one call site short. `newSavedProfile()` was the second. Both
      now read the pure twin. `fillBreaks()` matches the shape and is deliberately left: storing
      the derived breaks is documented design.

- 100|436| **What a wheel notch costs, and the placement leftovers.**
  **A notch never ran the relayout — it defers to `scheduleReshed()`, 120 ms after the LAST notch.**
  What that one pass costs, in Chromium on the 480-pipe grid `specs/perf.js` builds: 1.3–7.3 s in
  `reshedLinkLabels()` against 0.06–0.24 s in `relayoutLabels()`. So the relayout was never the
  problem; the CONTENT cascade beside it was, running one label at a time — the quadratic Task 440
  fixed in `refreshLabelText()` and left in this path. Batched 2026-08-23: **1,008 forced layouts per
  notch → 9** on a 112-pipe grid, every label keeping the same values, guarded by
  `dev/lpn-spike/zoom-reshed-harness.js`; 44–458 ms in the browser.
  - **`shedAlignedForConflicts()`'s obstacle walk is INDEXED, 2026-08-23.** It was the whole of what
    was left — 0.3–1.8 s per notch in over 9M box-overlap tests. The cascade still runs one label at
    a time and always will (each label placed is an obstacle for the next); what grew with the
    drawing was `boxIsClear()`'s walk. Through `Collide.boxIndex()`: **231 → 7.3 overlap tests per
    label on 112 pipes, 860 → 7.1 on 480** — the per-label rate now flat instead of rising. Every
    placement byte-identical, proved by dumping both passes from separate processes.
    `dev/lpn-spike/aligned-shed-index-harness.js` guards it.
    - **An APPEND-ONLY grid that re-reads the caller's array on each query, not a tree.** The
      difference from Task 472: that index is built once and held, this one absorbs an insert
      between every pair of queries. A grid's insert has no rebalance, and syncing on query meant no
      call site had to be told about the insert.
    - **THIS PASS CONVERGES ACROSS PASSES,** which is a trap for anyone comparing it: it seeds node
      labels as obstacles where the last layout PLACED them, so two identical runs back to back in
      one process already disagree on one label. Compare backends in separate processes.
  - **AND IT IS STILL 2.5–3.3 s END TO END, WHICH THE COUNTS CANNOT SEE.** Measured in Chromium
    AFTER both fixes above, on the same 736-element geographic grid: the block after a zoom runs
    2.5–3.3 s with labels on against **0.5–0.7 s with every label field switched off**, so what is
    left is label work. One run of the identical gesture hit 16.9 s. Forced layouts are held at 9
    per notch and overlap tests at ~7 per label, so the remaining cost is PER-LABEL work no index
    removes — text measurement is the suspect and is unproven. `specs/perf.js` reports the number
    and asserts no bound: the spread is wider than any honest threshold.
  - **AND THAT CONVERGENCE WAS HIDING A DEFECT, FIXED 2026-08-23.** Because the seed lags, a first
    layout sheds link labels for ground the node labels do not take, and the node then takes ground
    under a pipe label using `yields` — which granted the position and never made the holder leave.
    Measured on `Net3-World`: 60 node label rows printed through an aligned pipe label, up to 28 px
    deep, zero node-on-node. `yieldStationedLabels()` hides the yielder; node placements are
    unchanged. Iterating the two passes instead also reaches zero and costs 3x.
    `dev/lpn-spike/node-yield-harness.js`.
  - **Placement leftovers: all three done 2026-08-25.** A background image is carried onto the map
    with the drawing (it moves and resizes; a picture cannot TURN, and Finish says so); Finish is
    undoable — the snapshot is taken at `georefStart()` and pushed only on commit, so Ctrl+Z gives
    back the exact grid the user opened; and `lpnGeorefFromTwoPoints` has a door at last, a button in
    step 2 beside the scale and turn boxes. Step 2 and not step 1 because a pick inverts the live
    transform, which a detached model's compensation makes a lie.
    `dev/lpn-spike/georef-carry-harness.js`, `dev/lpn-spike/georef-twopoint-harness.js`,
    `specs/place.js` §15. **Awaiting Tom's wording only:** the six `lpn_georef_twopt*` strings and
    `lpn_georef_backdrop_unturned`, all shipping on placeholder English.
  - **Held in HEIGHT, not width:** a long north-south journey stretches the model east-west by the
    map's own 1/cos(latitude) — 9% from 20° to 31°. Unavoidable on an unprojected display without an
    anisotropic transform, which `js/lpn-georef.js` refuses by design. `dev/georeferencing.md`.

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
  - **[H] `friction_check.php` NOW EXITS 1 with 16 `refer-to-human` entries awaiting Tom's ruling.**
    That is the escalation mechanism working, and it is not in `check_all.sh` so it blocks no commit —
    **but it blocks the next sprint launch until he rules.** The 16, plus 9 wording proposals and 7
    `$ec_lang_syn` proposals, are in `239-wave0-calcs.json`. **Tom answers in
    `dev/english-friction/239-refer-to-human.md`** (2026-08-23: *"Give me a file or a page where I
    can decide and comment"*) — one `**Tom:**` line per item, blank meaning not yet decided. Each
    answer goes back into the JSON's `disposition` and `resolution`, which is what re-opens the gate.

- 75|479| **[H] One question left: should the suite answer at librewaternet.org/engcalcs/ ?**
  **The landing page and the code half are DONE and LIVE** — `https://librewaternet.org` and
  `/features.html` both serve, `libreepanet.org` 302s to it (Tom, 2026-08-24: *"Keep both, but
  EPANET is silent."*), and `CANONICAL_ORIGIN` became a host→origin whitelist on 2026-08-23 with
  `canonical_origin_check.php` guarding it. The landing page's own repository is
  `~/webdev/librewaternet.org`; see `dev/librewaternet-landing.md`.
  - **DROPPED 2026-08-25 on Tom's ruling:** the `constructionnotesmanager.com/hawsedc/engcalcs`
    redirect. *"It has never been canonical. No redirect is required."*
  - **THE ONE OPEN QUESTION, and it is his.** `librewaternet.org/engcalcs/Looped-Network.php`
    currently 404s, because the planned symlink was never made. Tom, 2026-08-25: *"I forgot what our
    goal was. We wanted lpn to appear at lwn?"*
    - **The recorded goal was yes**, and the reasoning is in `dev/hosting-layout.md`: the 210
      absolute `/engcalcs/…` paths all resolve under `<newdomain>/engcalcs/`, so one symlink serves
      the whole suite under the new domain and **no code changes at all** — which is why the symlink
      beat the refactor.
    - **Nothing is broken while it is absent.** The landing page's buttons point at
      `https://hawsedc.com/engcalcs/…` and work. So this is a positioning choice, not a defect: does
      a visitor who arrives at LibreWaterNet stay on that domain when they start a model, or get
      handed to hawsedc.com?
    - **PARKED 2026-08-25 ON TOM'S RULING:** *"Since I don't have clarity, let's leave it as it is
      for now."* So the suite is NOT mirrored, the landing page keeps handing visitors to
      hawsedc.com, and nothing is broken. The analysis below stands for whenever clarity arrives.
    - **IS THE MIRROR AN SEO PROBLEM? Answer: not a penalty, but AS CONFIGURED TODAY it would split
      the signal, and the fix is one line.** Google's own position
      on duplicate content across domains is that it is not grounds for a penalty, but that
      identical pages must nominate ONE canonical or the engine picks for you and the ranking
      signals divide between the two. **Our whitelist currently maps `librewaternet.org` to
      `https://librewaternet.org`** (`lib/config.inc.php`), so a mirrored suite would serve two
      copies of every page each declaring ITSELF canonical — precisely the split. Three ways out,
      and the choice is Tom's: map `librewaternet.org` to `https://hawsedc.com` so the mirror defers
      and consolidates; leave it self-canonical and accept a divided signal for a marketing gain;
      or do not mirror, and let the landing page keep handing visitors to hawsedc.com as it does
      now. **`canonical_origin_check.php` exists precisely so this is a lookup and not a guess.**
    - If yes, it is `ln -s ~/public_html/hawsedc/engcalcs ~/librewaternet.org/engcalcs` after
      testing `Options +FollowSymLinks` on that host, plus the canonical decision above.

- 25|487| **The suite only works when its URL path is `/engcalcs/`.**
  Measured 2026-08-22: 79 root-anchored `/engcalcs/` occurrences across 18 root `.php` pages plus
  `sw.php` and `consent.php`, and three `Redirect 301` rules in `.htaccess` naming it absolutely.
  **210 counting the JS.**
  - **DEMOTED 25 on 2026-08-23, because this task and `dev/hosting-layout.md` §3 contradicted each
    other and the hosting doc is right.** The refactor is rejected while a symlink does the job:
    serving at `<newdomain>/engcalcs/` needs no code at all, and the count grew 112 → 210 between
    measurements, so the refactor gets more expensive over time, not less. This blocks nothing that
    is planned.
  - **It becomes real only if the suite must be served at a path that is NOT `/engcalcs/`.** Then the
    fix is one derived base-path constant plus a check failing on a new hardcoded prefix — and keep
    root-relative, because root-relative was itself the 2026-08-08 fix for a `../` bug.

- 50|207| **The dilettante path: make replying cost one tap, not five steps.** Full design
  record in **`dev/dilettante-path.md`** — the cost ladder (Rung 0 is a tap with no text), the three
  portable Wikipedia mechanisms, the honesty boundary, the spam design, and the codebase-specific
  notes. Two things to carry without opening it: **the lever is the COST of replying, not the
  visibility of the request** (0.01% is what a link-to-a-form structurally produces, so rewording
  cannot move it), and **planting intentional mistakes to bait corrections is permanently rejected**
  — do not re-propose it.
  **Not blocked, but do not build blind.** Task 206's contact-funnel logging shipped 2026-08-07 and
  starts at zero; read the "Contact funnel" section of `log/lang-log-stats.sh` once both counts are
  out of single digits, and let the clicks-vs-sends split pick which lever this pulls.
  - **AUTHORIZED 2026-09-02** (Tom: *"I would like that! Use our logs to know where to put a low-cost
    grievance link."*) — **and it lands on `lpn_` first**, which is the only calculator with no
    `echoFeedback()` invitation at all. Placement, what one tap sends, and why this needs no consent
    bump: the last section of `dev/dilettante-path.md`. **The log reading came in 2026-09-03 and moved the
    answer**: the diagnostic box is met ~3 times in 10 days, so the link cannot live only there.
    Not blocked any more — what is left is Tom's wording of three or four English strings.
    **BUILD BRIEF FOR A SUBAGENT: `dev/rung0-handoff.md`** (2026-09-03). Its one non-obvious
    finding: the transport already exists — `EngCalcs.logSignal` posts, dedupes and queues offline
    through `log-signal-event.php`, so this adds a detail slug and an affordance, not a channel.

- 75|532| **An English style guide for label wording — Tom says he is writing one by intuition.**
  His own words, 2026-08-25, answering a friction question: *"I would be grateful for a style guide,
  or maybe I am creating it by intuition."* **That sentence is the task**: rulings he has been making
  one at a time for months are consistent with each other, nobody has written them down as rules,
  and so each new one costs a conversation.
  - **This is a HARVEST, not an invention.** The material already exists and is dated and quoted —
    `dev/language-strings.md` (which is about the mechanics of a string, not the voice of a label),
    the closed ledger, `dev/english-friction/*.json`, and `239-refer-to-human.md`. Read them and
    extract the rules he has ALREADY applied rather than proposing a house style from taste.
  - **Some are already stated elsewhere and belong in it by reference, not by copy:** column width is
    king and mid-word wrap is acceptable in a results table; a verdict leads with `✓` or `⚠` and never
    a translated marker word; loss symbols are lowercase `h` and total heads capital `H`; the
    local-loss term is "Minor (local) loss" suite-wide; reuse a WHOLE label, never a fragment.
  - **The open question is what it is FOR.** A guide read by a human is prose; a guide read by a
    check is a script, and CLAUDE.md's own argument is that a rule a machine enforces is worth ten a
    human must remember. **Some of these are checkable** (a verdict string starting with a glyph, a
    label ending in a colon, a sentence in a column heading) and some are irreducibly judgement.
    Sort them into those two piles as you go — that sorting is most of the value.
  - **[H] The voice is his and the guide must quote him rather than paraphrase.** Where a ruling was
    a one-off with no principle behind it, say so instead of inventing the principle.
  - **ONE PRINCIPLE HE HAS ALREADY GIVEN, and it cuts against a plausible-sounding opposite.** Tom,
    2026-08-25, on a claim that abstractions survive machine translation badly so a word should be
    placed where its sentence works without it: *"I would argue the opposite with some nuance, that
    direct, ancient, and earthy metaphors (like 'run') are the most translatable things of all. But
    to know them when you see them may be an art."* **So the rule is not "avoid metaphor" — it is
    that an OLD, CONCRETE, BODILY metaphor travels and an abstract or modern one does not.** Water
    runs; a zone runs; a machine's "runtime" does not travel the same way. His own caveat is part of
    the rule and must survive into the guide: telling them apart is a judgement, so this is one for
    the human pile, not the checkable one.

- 75|531| **Tag the examples: US/SI, design/maintenance, xy/lat-lon.**
  Tom, 2026-08-25: *"Reference 348. Phase 1 can be adding labels, tags, or keywords to the
  examples."* **Task 348 is sub-categories and paging in the gallery, and is deliberately unbuilt at
  seven examples** — the grid is `auto-fit`, so both arrive without a rewrite when the wall stops
  fitting a screen. This is the half worth doing BEFORE that day, because it is what any grouping or
  filter would have to be built on.
  - **The three axes are his**, and each is a fact the example already has rather than an opinion
    somebody must supply: the unit set it opens in, whether it is a design exercise or a maintenance
    one, and whether it is an XY grid or a geographic project. **Two of the three are derivable from
    the file itself** (`units`, and `project.coords`), which is the cheap and non-rotting way to get
    them — a tag nobody has to maintain cannot go stale.
  - **Design vs maintenance is the one that needs a human**, and it is the one that carries real
    meaning for somebody choosing where to start.
  - `dev/scripts/generate_examples.php` builds the manifest and `generate_examples.php --check`
    guards it, so a derived tag belongs there rather than hand-written beside each example.
  - **A tag that is DISPLAYED is a string in 27 languages.** A tag used only to group or filter need
    not be. Decide which before writing any key — this is the difference between a cheap task and a
    sprint.

- 100|508| **Tom's screenshot drop: dozens of captures, indexed and reused.**
  `dev/screenshots/` is gitignored and holds his captures under ordinal names (`0001.png`); the
  convention is in its README. **He captures; AI describes.** One line per file in the tracked
  `dev/screenshots/INDEX.md`, which says what each shows and whether it is publishable — the
  pictures do not survive a clone, what we learned from them does.
  - **Publishable and useful are separate axes.** Publishable is the README's privacy test and
    nothing else; a frame full of defects can still be safe to publish. Use **Not as is** for
    safe-but-stale, or the best phone frame in the drop gets retired as a flat No, which happened.
  - **A row must name the task that superseded it**, or the next reader re-diagnoses a fixed defect
    from a stale picture. Nine frames from one phone session were obsolete by that evening.
  - **THE THREE STALE PLATES ARE RE-SHOT. Tom, 2026-09-01: *"I recently did 0028, 0043, and
    0047"*** — so the Water-glyph and lat-before-lon findings that filled this block are spent, and
    they are deleted rather than archived here. **He also said the icon alone was an insufficient
    reason to re-shoot**, so the frames may still carry other faults.
  - **DONE 2026-09-01, AND THE LESSON IS THE PROCESS, NOT THE PICTURES.** All three were read
    FROM THE PIXELS by AI — `Read` opens a PNG, so nobody had to ask Tom what his own screenshots
    showed. 0028: latitude first, colour keys top-right against the labels legend top-left, nothing
    printing through. 0047: latitude first, and the `--` placeholder is CORRECT rather than a defect
    (a phone has no hover and nothing has been pointed at — Task 550). 0043: the Task 549 fixes are
    visible, and the cut-off result list that AI could not judge is, in Tom's words, *"all that
    would fit"*. Swapped into `librewaternet.org` on his word, commit `10eda9e`.
  - **A RE-SHOOT IS NOT PUBLISHED BY BEING TAKEN, AND THAT IS A CHECK NOW** (2026-09-04).
    `dev/scripts/screenshot_publish_check.php` reads every INDEX row claiming a plate is PUBLISHED
    and compares the md5 it names with the file actually in the sibling repository. All three claims
    match today. **The gap was never Tom's camera; it was that copying the file across is a separate
    act of memory**, and a sentence saying it happened is one nobody re-reads. Advisory by
    construction: the sibling repo is outside this tree and absent on a fresh clone, so the check
    prints that it compared nothing rather than passing in silence.
  - **A THIRD WATER-GLYPH GENERATION LANDED 2026-09-04** — the tower's tank became an elliptical
    bulb — so every frame in the drop, the three published plates included, is one generation
    behind. Recorded in the INDEX header, and **not** a worklist: Tom already ruled that the glyph
    alone does not earn a re-shoot.
  - Feeds Task 504's features list, the LibreWaterNet landing page and its `graphics-plan.md`. The
    sibling repo IS drivable from here (`~/webdev/librewaternet.org` — read its own `CLAUDE.md`
    first).

- 100|509| **Edit mode on the path itself: drag any point, click a waypoint off.**
  **BUILT 2026-08-25.** The Edit button puts the PATH in edit mode: every node the route passes
  through wears a grab handle, and one gesture carries both operations Tom named —
  *"drag any waypoint or not-yet-waypoint on the path including the start and end."*
  - **The difference between "move" and "add" is a NUMBER, not a second gesture.**
    `EngCalcs.lpnProfile.pathHandles()` labels each route node with the stop it is, or −1 and the LEG
    it lies on. A labelled handle's stop is replaced; a −1 is inserted after the stop that begins its
    own leg — deliberately NOT `insertStop()`'s least-added-length, which could put the new stop on a
    different leg from the one under the hand. The ends are handles too, so "change one end" stopped
    being a pull-down.
  - **A DRAG THAT LANDS ON NOTHING PUTS THE PATH BACK AND SAYS SO.** A stop IS a node id, so bare map
    has no commit to make. Dropping the stop was rejected — a slip would be destructive where a click
    already removes deliberately — and so was snapping to the nearest node, which commits a stop
    nobody aimed at. A drop with no route is refused and names both nodes, the chooser's own refusal
    reached by the other gesture.
  - **THE BOX IS SUPERSEDED AFTER ALL, and it is gone (2026-08-28).** It was kept as the
    discoverable form and the pointer-less way through the same two operations. Tom, having used it:
    *"we shouldn't need any interface in the bottom pane other than an Edit button. We have From and
    To: I can see those in the map. We have Nodes on the way: I can see those on the map."* Its
    markup, its four language keys and its two predicates went with it; `profileState.editing` is now
    the whole state, the button toggles it and Escape leaves it, and arming the chooser turns it off
    (the chooser writes a stop list `profileStops()` reads instead of from/to/waypoints).
  - **While it is on, the map drags nothing but a handle** — a handle sits exactly on a junction, so
    without that rule re-routing a path would also move the pipework.
    `dev/lpn-spike/profile-edit-harness.js` (48 checks, fake clock) asserts that one from the drag
    type and from the coordinate.
  - **Open: Tom's own pass** of the pane with no box in it. Three new English keys await his
    wording — `lpn_profile_edit_say`, `_edit_tap`, `_edit_nowhere`.

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

- 75|441| **Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with
  autohide.** Tom raised it 2026-08-18 without asking for it yet. Nothing in the box is designed
  against it — one element, one placement function.

- 25|465| **[H] Reusable pipe and pump TYPES, so editing one edits 400.**
  - **RESEARCHED 2026-08-25 by `utility-planning-engineer`, and its answer is: TWO features, not
    one — which is the thing we would have got wrong.** WaterGEMS separates a **Prototype** (stamps
    starting values onto elements drawn AFTERWARDS, not retroactive) from an **Engineering Library**
    (live-linked, retroactive). This task conflates them. Its recommendation: **leave the full type
    system parked** — at this suite's stated scale the motivating case cannot arise, roughness is a
    function of material AND AGE so even "a PVC type" needs a per-element qualifier, and diameter is
    not shared even in the commercial tools. **Find-and-replace already does better than a library
    on the thing that matters**: it previews an exact change count before writing and goes through
    `setProp()`, where a live-linked library edit propagates with no confirmation step it could
    find documented. **The one slice it does NOT rank low: a live-linked pump CURVE table** — no
    aging wrinkle, no diameter conflation, `curveRef` already copies once, and the Curves panel's
    own code comment names the missing piece (`js/looped-network.js:19466`).
  One "150 mm PVC" definition that 400 pipes point at. A type carries diameter, roughness and minor-loss k; an element names
  a type instead of repeating the numbers. Tom named these beside Patterns/Curves/Controls in Task 462,
  but those are things the document already HOLDS — this is a new indirection through the element model.
  - **It starts at `effective()`, which is the expensive part.** A third resolution layer — override →
    element → type-default — under the one seam the solver, renderer, labels, popups and six pane
    tables all read through. Plus a visible detached-versus-inherited state per property, or a user
    edits a definition and cannot see why nothing moved.
  - **EPANET has no such concept**, so an `.inp` export flattens it and an import can never rebuild it,
    which breaks Task 281's byte-identical round trip for anything typed. Task 390-sized.

- 50|498| **A public roadmap, with epanet-js's Canny board as the worked example.**
  Tom, 2026-08-23: epanet-js runs one at `roadmap.epanetjs.com`, powered by Canny. Noted as an
  example to weigh, not a decision. The thing to weigh is that `dev/ROADMAP.md` is written for us and
  says things a public board should not (measured costs, what Tom is not proud of, who to ask), so a
  public board is a SECOND artifact to keep current, not this one exposed.

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

- 75|185| **Match/Copy properties tool (originated during Task 146).** Tom, 2026-07-30: "In the absence of the
  table editor, some sort of Match or Copy tool would be very cool. Checkboxes (or current visible
  labels) say what properties to copy, top shows (or initial click gives) the Source object then you
  click the Target objects." Same interaction as AutoCAD's MATCHPROP and every GIS attribute-copy
  tool: a toolbar mode, first click sets the source, every later click applies to a target, Escape
  or a mode change ends it. **The good idea in Tom's own phrasing is "or current visible labels"** —
  the Labels panel already IS a per-property checkbox list, already knows which properties are
  interesting to this user right now, and is already on screen; reusing it as the property filter
  means the tool needs no property picker of its own, and what you see on the map is what gets
  copied. Worth a deliberate decision on whether ID is ever copyable (it must not be — IDs are
  unique) and whether geometry is (it must not be — that is a move, not a property copy). This is
  the cheap 80% of Task 186 and should ship long before it.

  **Kept and still liked (Tom, 2026-08-13): "Very nice idea. I love it."** Keep it a click-source-
  then-click-targets tool: that is the right shape when you are drawing 15 pipes and want this one
  to look like that one. Do not grow it into a query tool — search-and-replace is now Task 389 and
  is a better fit for its own job, so the two ship side by side rather than one becoming the other.

- 25|217| **A suite-owned, multilingual Manning's n table, built from primary sources.** Tom,
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

- 25|225.13| **`dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got** (Tom: *"Some
  stuff no longer exists or is renamed"*), before anybody is asked to run that section again.
  Split out of Task 225 when the rest of it closed 2026-08-09 — this piece is a punch-list document
  rewrite against live controls, not a code fix, so it needs a browser pass rather than static
  reading.

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

- 75|247| **Customers: metered demands with account numbers, lumped to the nearest node.**
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
  - **Tom ruled the open questions 2026-08-24 — `dev/customer-demands.md` §7 has all of them.** The
    two that change the build: a meter carries a **Count** (so *forty-two residential services* is
    one symbol), and the attachment point is **user-draggable along its pipe** — a handle on the
    `linkAnchor {link, t}` Task 502 needs anyway, on data we already store. He also asked for a
    **Customer table**, which the pane's generated tab list makes a row rather than a mechanism.

- 100|248.03| **Rule-based controls: the text is CARRIED now; the language is still parked.**
  Simple `[CONTROLS]` shipped 2026-08-18 — the Libraries box adds, edits, validates and deletes them,
  an unreadable sentence is kept and marked rather than discarded, and only a fully understood one
  reaches the engine.
  - **PHASE 1 SHIPPED 2026-08-28: `[RULES]` SURVIVES A ROUND TRIP.** It was in the importer's
    REPORTABLE list, which means it was counted as a difference and then **dropped** — so a file
    whose pumps are driven by rules came back out of the exporter with none. Same rule broken as
    `[OPTIONS]` under Task 553, and the same fix: the lines are kept verbatim on `doc.rules`,
    serialized with the project, and written back in the user's own units, where verbatim text is
    exactly right. `EngCalcs.lpnRuleBlocks()` reads ONE fact out of a rule — the element ids, from
    the single grammar rule that an object keyword is followed by its id — without pretending to
    understand it. `dev/lpn-spike/rules-carry-harness.js` (19).
  - **AND THE MEASUREMENT THAT SAYS WHY THE LANGUAGE CANNOT BE SKIPPED.** Handing the text to the
    EPANET engine was built first, on the obvious argument that this page does not model a rule and
    the engine does. **It is wrong, and silently so.** `js/lpn-epanet.js` writes LPS and METRES
    always; a rule's numbers are in the units of the file the user opened. `IF TANK T1 LEVEL ABOVE
    20` means 20 FEET in a GPM file and arrives beside a tank whose level is 4.572 — so the rule
    never fires, and one that DID fire would fire at the wrong threshold, with every number on
    screen looking reasonable.
    - **Converting them REQUIRES the language**: you cannot scale a rule's numbers without knowing,
      clause by clause, whether the value is a level, a pressure, a flow, a setting or a time. So
      this is not a factor somebody can patch in. **No `[RULES]` section is written into the engine
      input, and the harness asserts the absence and the reason.**
    - The referential filter is built and unused-by-design: EPANET rejects the WHOLE input over one
      rule naming a link it was not given, so `modelRules()` drops such a rule and reports it by
      name. It rides on the model so the day the language lands it is already there.
  - **TWO REGRESSIONS THE HARNESSES CAUGHT WHILE THIS WAS BEING BUILT, AND THEY ARE ONE SHAPE.**
    Both were "I added a capability and silently removed a promise": the line that KEEPS the rule
    text `continue`s past the counter every other section reaches, so `[RULES]` stopped being
    REPORTED as a difference at all (`import-notes-harness.js`); and the import message still read
    *"left out"*, which had become false — a rule is kept and written back now, and a user reading
    that sentence would believe theirs were lost. **Carrying a thing and telling the user about it
    are two jobs.** `lpn_inp_drop_rules` is the new sentence and awaits Tom's wording.
  - **What is left is the language and its editor**, and the evidence bar Tom set for it stands: it
    can wait for a user who has one. The difference is that their file no longer loses it.

- 25|266| **Multi-select (lasso) plus edit-all-selected, as EPANET has.** Tom, 2026-08-10: *"very nice
  for bigger models."* Today's selection model is single-element — `openEditMenu()` already says so
  where it explains why "Select all" is absent. Wants a rubber-band select and one property sheet
  that writes a value to every selected element. **Blocked on Task 415's `selected` property**, which
  is the foundation this was always missing.

- 25|283| **Map label legibility: what remains is the AUTO-HIDE rule.** Tom, 2026-08-11, after
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
  `log-human-view.php` and `log-calc-event.php` record **page and language and nothing else**, so
  there is no device signal anywhere in this project's instrumentation — every touch-target,
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

- 75|570| **The EPANET report gets a box of its own: draggable, sizeable, and one of the family.**
  Tom, 2026-09-02, having just spent a session on the window model: *"EPANET report: How about we
  make that another draggable, sizeable, modal box?"* The engine's own `.rpt` text is read through
  `lpn_time_run_report_tip` today and has no home of its own.
  - **It is the sixth box, so it costs almost nothing structurally** — `makePanelDraggable()` carries
    the drag, the touch gesture and the raise; `addPanelResizeGrip()` the corner; `placePanelForScreen()`
    the opening and the phone fill; `hidePanel()` the close and the tip sweep. A seventh panel cannot
    arrive half-wired, which is the whole point of those seams.
  - **NON-MODAL, settled 2026-09-02.** He wrote "modal" and corrected it when asked: *"I meant
    non-modal. Sorry. Not easy to remember."* So it is the sixth ordinary box and stops nothing —
    which is also what the rest of this session established, that every box must stay movable while
    another is open. **The word is the trap, not the design**: on this page "modal box" has come to
    mean "a proper window", and the one genuinely modal thing here is `#lpn_dialog`.
  - The text is the engine's own and untranslated, which the tip already says. It wants a monospace
    body and its own scroller, and `.lpn-popover-body` already scrolls.

- 75|568| **Standard hydraulic symbols: Tom's research, recorded, not yet a decision.**
  Tom, 2026-09-01, having gone and looked: *"I don't know if we do anything with all of item 2 at
  this time."* So this is a record, and promoting it is his call. **Reservoir:** inverted equilateral
  triangle, pointing down. **Tank:** a rectangle — *"I would go with a horizontal 5:4 rectangle."*
  **Pump:** a circle with an isosceles triangle arrowhead pointing the way the flow goes (upward on a
  menu icon) — *"I would keep what we have or more closely what EPANET has (we never got very close
  to their pump housing depiction)."* **Junction:** a circle far smaller than the others, about half a
  reservoir or tank. The **valve** half of the same research was ruled on immediately and is built —
  a plain bowtie, no decoration — so it is not part of this row.

- 50|569| **The cursor flickers to the default pointer at ~12 px from a node, on a PC.**
  Tom, 2026-09-01: *"As I wander the mouse around the map, it occasionally flickers from pan/drag
  cross to default pointer. If I am painstakingly slow and precise, I can return the mouse to any
  such flicker point and see it dwell as a default pointer. There is nothing at these points apparent
  to me that explains the default pointer except that it almost (!) reliably happens at 12px from the
  point of a node (the 24px diameter)."* Long-recognized, never diagnosed. He rates it *"slightly
  mystifying and annoying"* rather than harmful — *"Did I see what I thought I saw? Why?"*
  - **12 px is not one of the touch numbers**, which is what makes it interesting: `POINTER_REACH_PX`
    is 14 and `TOUCH_REACH_PX` is 24 (closed Task 562), and the default `settings.symbolSize` is 7.
    Something is drawing or hit-testing a ring at a radius nobody declared. A DOM element with no
    cursor rule of its own, sitting between the node and its rivals, is the shape to look for.

- 100|322| **Convert standing advisories into checks, and survey for the ones nobody has named.**
  - **TWO MORE LANDED 2026-09-01 — rows 21 and 26 — and THE ENFORCED COUNT IS 57, not 34.** The
    survey's own table was the stale thing: rows 10, 15, 17, 18 and 20 had shipped on 2026-08-29 and
    still read as "reachable and not yet enforced". Each was re-read against its script before being
    marked; three enforce MORE than their row claimed. What is left is four rows (13, 14, 22, 23),
    and every one states in its own text why it cannot be a blocking `check_all.sh` entry — two are
    advisory at best, two are git hooks, which `check_all.sh` runs before a commit message exists.
    **So the reachable-and-unreached column is effectively empty**, which retires half of what this
    task was.
  - **ROW 26 IS THE ONE TO READ, because reading the RENDERER bought a blind spot.** The row's
    stated risk was that "which strings are verdicts has to be inferred from the key name". It need
    not be: a verdict is what `EngCalcs.writeCheckHTML()` renders as one, which yields 32 keys and
    864 values across 27 files with nothing chosen by name. **But that seam works because the
    renderer supplies the glyph — so for a verdict built BY HAND the glyph is part of the translated
    value and can simply be deleted, and all three original legs reason about a glyph that is
    present.** Found by mutation, not by reading: `'✓ Understood'` → `'OK: Understood'` removed the
    glyph AND added a marker word, and the check said OK. Leg 4 holds the three declared hand-built
    keys, and the declaration is itself guarded — its first draft named `lpn_library_control_warn`,
    which does not exist, and reported OK while guarding nothing.
  - **Row 21 (`calculator_page_check.php`) found nothing on today's tree** — 16 calculators, 16
    documented prefixes, the same 16 — and that is the honest result for a rule nobody had broken.
    It holds four things beyond the row: menu `title=` key ≡ page `$html_desc` key, no duplicate
    prefix, no dead menu link, no unclaimed documented prefix.
  - **SIX MORE LANDED THE SAME DAY — rows 3c, 3d, 11, 12, 16 and 19 — and ROW 12 IS THE ONE TO READ.**
    `storage_inventory_check.php` found **two things on visitors' devices that the inventory whose
    only claim is completeness did not list**: `bpn_sketch_toggles` (`localStorage`, which of five
    fields the Branched-Network sketch shows) and `engcalcs-lpn` (IndexedDB, the `handles` store of
    Task 212 and the `recent` store of Task 258). **Nothing about what is stored was changed** — both
    are now documented on the exemption limbs the file already argues for their siblings, and
    **those two exemption claims are AI's and want Tom's eye**, because that is the legal-flavoured
    judgement the check deliberately never makes.
    - **AND A GAP IT FOUND AND DID NOT CLOSE: `engcalcs-lpn` is not erased by `wipeAllStorage()`**,
      so "all settings" in that button's confirm is not quite true. Changing it is a behaviour
      change, so it is recorded and not done.
    - Cache Storage (`sw.php`'s `engcalcs-assets`) is OUT of the check's scope and its docblock says
      so. Widening it is a scope decision with a legal flavour.
  - **Row 16 found that NO SCRIPT READ `meta.anchor_languages` AT ALL** — the rule that anchors are
    read from the JSON and not restated was, in its entirety, prose. It blocks now, scoped to the two
    current-state documents: 15 lines elsewhere in `dev/*.md` name an anchor set and every one is
    correct as history.
  - **Row 3c's walk finds 0 candidates today and that is the honest number.** The case it was written
    for — `lpn_terrain_menu` and its tip behind two uncalled functions — had already been deleted on
    Tom's ruling. It was verified against a RECONSTRUCTION of that tree, and fixture 1 of
    `key_hygiene_selftest.php` is that shape verbatim: it is the only thing standing between an
    advisory walk and a silent zero. Two conservatisms were measured, not guessed — the dev harnesses
    count as root text (without that, 18 test seams read as corpses) and keys are sought in
    comment-STRIPPED source (a file's own comment naming its deleted key had suppressed a candidate).
  - **AND THE FALSE ALARM THAT COST FOUR AGENTS A DETOUR IS GONE.** `payload freshness` judged by
    MTIME, and neither `git pull` nor a worktree checkout preserves those, so it called all 26
    payloads stale in any freshly checked-out tree. It compares CONTENT now — building the payload IS
    the input list, which also retires an eight-path list that had already missed an include once.
    `touch lib/lang.ec.en.php` no longer fails it, and that is a fixture.
    - Behaviour change worth knowing: `--check --prefix=X` now reports stale, because it builds a
      prefix-filtered `lang.en.json` that does not match the unfiltered one on disk. The mtime
      version ignored the prefix. Unused by `check_all.sh`.
  - **NINE MORE CHECKS LANDED 2026-08-29, taking the enforced count from 34 to 43** — survey rows
    4, 5, 10, 15, 17, 18, 20, 24 and 25, each with a selftest, each blocking, each green on the
    tree it landed on. Two found the same thing row 6 found: **the RULE was wrong.**
    `lib/Language.Settings.php` told a contributor to register a language in a
    `VALID_LANGUAGES` constant that does not exist anywhere in the suite; `$all_language_settings`
    is the sole registry. **That is three prose rules in two sessions found to name a thing that
    is not there, every one of them only by trying to execute it.**
    - **Row 5 is the one that stops the drift recurring.** `check_all.sh` is what RUNS and this
      file's table is what everybody READS, and nothing tied them: **eight checks ran unlisted**,
      and the `php + js syntax` row had silently covered a third pass since the shell check was
      added. Matched on script FILENAME, not on labels, so neither file has to be reworded to
      please the other.
    - Row 25 judges by PROVENANCE rather than by guessing what reads as explanatory: a title
      equal to a tip-shaped `$ec_lang` value blocks, a title that NAMES its destination passes.
      That is what lets `*_main_desc` on the main menu and `LANGNAME` in the switcher through
      while catching the thing that is unreachable on touch.
  - **AND THE RUNNER AUDIT THIS BLOCK ASKED FOR IS DONE — six of seven runners had the shape,
    and TWO were real coverage holes rather than reporting weaknesses.** `social_card_check.php`
    `continue`d silently past a page that renders no `<head>`, so **`consent.php` had never been
    examined at all**; and `validate_epanet.js` ran `.filter(Boolean)` over a typed list of case
    objects, so a case renamed in `cases.js` arrived as `undefined`, was dropped, and the run
    simply got shorter with everything left passing. Neither would ever have shown up as a
    failing run. Both harness runners also died on the FIRST failure under `set -e` and reported
    no total; an empty glob now fails instead of reporting a clean run of nothing. Recorded as
    row 3d and a per-runner table in `dev/enforceable-rules-survey.md`.
  - **DONE 2026-08-29: the six orphan keys were deleted**, 162 strings across 27 files —
    `lpn_settings_scope_project`, `_scope_calculator`, `_computation`, `_map_height_px`,
    `_map_height_tip`, `_colors`. The orphan list is 2 now, and both are the canonical mode names
    `mode_name_check.php` holds every other string to. **Row 3c's reachability walk is still
    unwritten**, so the two dead terrain strings behind a dead reader are still invisible.
  Tom, 2026-08-25: *"322 convert to scripts and include a broad survey for other such
  recommendations."* `check_all.sh` reports these every run and nobody can act on them — and
  CLAUDE.md's own argument is that **a rule a machine enforces is worth roughly ten a human must
  remember.** Every rule here that became a script stopped being violated; every rule that stayed
  prose kept being violated by people who had read it.
  - **THE SURVEY IS DONE, 2026-08-28: `dev/enforceable-rules-survey.md`.** The count CLAUDE.md's
    own "unexecutable half is decoration" line invited and nobody had ever made: **34 rules
    enforced, 27 enforceable and not, 41 permanently prose** — a third, a quarter, two fifths. Its
    conclusion is worth more than the arithmetic: *the prose is not decoration where it carries the
    rules no check can reach; it is decoration where a check was possible and nobody wrote it.* The
    27 are ranked by value/cost, with the false-positive risk stated per row, and rows 4–27 are the
    remaining worklist.
  - **AND THREE LANDED WITH IT, 2026-08-28.** `lang_key_resolve_check.php` (blocking): a literal
    `$ec_lang['typo']` renders as the empty string in all 27 languages with no warning — a token
    scan, so a concatenated key, a variable key and a key in a comment are all invisible to it and a
    false positive is impossible. `unit_family_check.php` (blocking): the four unit-family
    absolutes, every one of which fails with a page that renders and looks right. Both carry a
    selftest, following `stale_claim_selftest.php`: a check whose demotions nothing tests looks
    identical whether it works or has gone blind.
    - **And the english-drift advisory was printing NOTHING.** `check_all.sh` piped its report
      through `grep -q "^CHANGED"`, so the NOTE appeared with no text under it. **93 CHANGED, 79
      NEW, 33 REMOVED and nine ROLE CHANGES had been invisible.** Still advisory, deliberately: a
      fixed URL and a rewritten sentence produce the same hash mismatch, and blocking would push
      the reader toward `--update`, which baselines the drift away.
  - **FOUR MORE LANDED THE SAME DAY, rows 6-9: `page_meta_check.php` and `no_session_check.php`,
    each with a selftest.** Row 6 is the one worth reading, because writing a check found that the
    RULE was wrong: CLAUDE.md said *"call `ecSessionStart()`"* and **that function does not exist** —
    Task 288 removed `PHPSESSID` outright and the helper went with it, so the honest number of
    sessions in this suite is ZERO, not "one, gated". The prose had been sending a future
    contributor to a helper that is not there. Both CLAUDE.md and `dev/cookie-storage-inventory.md`
    are corrected. **That is the survey's whole argument arriving as an instance**: the rule was
    written down, read, and had drifted from the code, and only executing it noticed.
    - `page_meta_check.php` also takes the exempt list out of prose and into the check, where an
      entry naming a page that no longer exists is itself a finding. That list had been measurably
      wrong once already.
  - **AND ROW 27, THE ONE THAT GUARDS WHAT STRANGERS READ.** `public_claim_check.php` denies the
    four sentences that were written, SHIPPED, and struck by Tom personally — *"your phone"* (it is
    always *"a phone"*), *"PC application"*, *"the only third-party request"*, *"no extended-period
    simulation yet"*. Every one reads perfectly reasonably, which is why they come back; two of them
    he caught by eye where no check could.
    - **Scoped to `lang.ec.en.php` and blind to `dev/*.md` on purpose**: all four phrases live in
      `dev/positioning.md` and `CLAUDE.md` inside the rule forbidding them, and a check that reports
      the rule as a violation of itself is a check somebody deletes.
    - **The load-bearing fixture is the SANCTIONED sentence** — *"And although you of course prefer
      working on your PC, it works also on a phone in tall mode."* It holds "your PC" and "a phone",
      one word from two of the denials, so a check that matched the pronoun instead of the noun
      would report the sentence Tom wrote and approved.
    - It is a FLOOR, not a guarantee: it cannot see `~/webdev/librewaternet.org`, which is where
      three of the four actually shipped. `dev/positioning.md` stays the authority.
  - **AND THE CLEAREST INSTANCE THE SURVEY HAS PRODUCED, 2026-08-29: A THIRD OF THE BROWSER PASS
    HAD BEEN DEAD FOR TWO DAYS.** Twelve of thirty-eight sections threw at their first line, because
    `Session._newFromTemplate()` drove `File > New project… > <template>` — the fly-out Task 477
    replaced with the New-project BOX on 2026-08-27. Four more stale references rode along:
    `#lpn_menu_insert` and `#lpn_menu_view` (both retired by Task 543), a row-index into the Water
    menu that assumed nothing would ever be inserted above it, and two tab labels from before the
    examples became `.lwn` files.
    - **THE ALARM EXISTED AND WAS WORSE THAN USELESS.** Every run ended `26/38 sections completed
      <-- SHORT RUN` under a cheerful `849/864 checks passed` — and **that percentage is a fraction
      of what RAN, so it rises as coverage falls.** A number that improves as the suite dies is not
      a metric, it is camouflage. Now a short run is shouted, NAMES the sections that threw, and
      says outright that the percentage above it cannot be trusted.
    - **THE GENERAL LESSON, and it is a survey row nobody has written:** a test runner that can
      SKIP work must report skips as loudly as failures, and its headline must be a fraction of what
      was ASKED FOR, not of what was reached. `check_all.sh` gets this right by counting from a glob;
      `run.js` did not. Worth auditing the other runners for the same shape.
    - Repaired: 38/38 sections, 1059+ checks against 864. `dev/browser-pass/README.md` carries the
      account.
  - **DELIBERATELY LEFT ADVISORY, and the reasoning is the useful part:** `size_budget_check.php`
    entirely (both numbers are judgement, and a ratchet fails a legitimate addition, which is the
    fastest way to teach a team `--no-verify`); both `key_hygiene_check.php` findings (whether a key
    is debt is judgement — whether it EXISTS is not, which is what the new check took); and
    `stale_claim_check.php` (citing a closed task as a record is legitimate).
  - **A ROW THE SURVEY DOES NOT HAVE YET, FOUND BY HAND 2026-08-28 AND WORTH ADDING:**
    `pageconfig_check.php` matches literal `EngCalcs.pageConfig.<key>` reads only, and
    `js/looped-network.js` reads every one of its 838 strings through the one-letter alias `pc` —
    **so the entire `lpn_` page is invisible to the check that exists to guard it.** Diffing
    `pc.<key>` against the block by hand found `lpn_labels_col_drop`: translated into all 26
    languages, never wired, English on every screen. **FIXED THE SAME DAY:** the check reads alias
    declarations now (`= EngCalcs.pageConfig` whose next non-space character is not a dot) and
    `<alias>.<lower_snake_key>` reads. **Its coverage went 107 reads → 743.** The key SHAPE is the
    false-positive defence, and it is load-bearing because this check BLOCKS: an alias's ordinary
    properties have no underscore and every declared key has one. `pageconfig_selftest.php` pins
    both directions, including the shape a first draft got wrong (`el.textContent =
    EngCalcs.pageConfig.x` is a READ, not an alias named `textContent`), and the real defect was
    re-introduced to prove the check catches it.
  - **AND ITS MIRROR, SAME DAY: A DEAD READER HIDES A DEAD KEY.** `key_hygiene_check.php` reports a
    key "rendered by nothing" by looking for a reference to it. Task 542 deleted the terrain menu
    ROW but left `EC.lpnTerrainMenuLabel()` and `EC.lpnTerrainMenuTip()` — which read
    `lpn_terrain_menu` and its tip and are themselves now called by nobody. So two strings live in
    27 language files, reach no screen, and **do not appear in the orphan list**. A reachability
    walk from the page's own entry points is the honest version; a reference count is not.
  - **`js/looped-network.js` is over 20,000 lines**, with `rebuildSettingsFields()` and
    `drawExampleNetwork()` the two obvious extractions. Task 293 established the split-by-PURITY
    pattern and it worked. *(The 9,740 recorded here through 2026-08-23 was less than half the truth
    — an advisory nobody acts on is also an advisory nobody re-reads.)*
  - **DONE 2026-08-26: the stale-claim advisory was 9-for-9 FALSE POSITIVES, and now it is 2.**
    All nine high-ranked lines were legitimate records. **This is the second time it has drifted
    there** — on 2026-08-23 all eleven were, two demotions cut it to seven, and it climbed back.
    Two more demotions (the task is the AGENT of a completed action; a POINTER is not a claim) take
    it to 2. **The standing obligation is not "read the nine", it is demote whatever legitimate
    SHAPE the nine share** — an advisory that is all false positives teaches its reader to skip it,
    which is the prose failure the tool exists to catch, arriving in the tool.
    - **AND THE DEMOTIONS THEMSELVES ARE NOW GUARDED, BLOCKING**
      (`dev/scripts/stale_claim_selftest.php`, 13 fixtures). A demotion trades coverage for a
      shorter list and the tool prints fewer lines either way, whether it got smarter or went
      blind — so the three false claims that actually shipped are pinned as HIGH forever. That
      caught a real hole while being written: `not built yet — see Task 146` is ordinary prose and
      the pointer demotion would have excused it, so the pointer rule is guarded by a
      hard-builtness test and the record rule is not.
  - **DONE 2026-08-25:** `key_hygiene_check.php` learned two more dynamic-key shapes (an interpolated
    build and a prefix test), dropping 14 false orphans from its list — 35 → 21, then → 16 after
    Task 294's deletions. A check that is 40% noise is a check people learn to skip.
  - **DONE 2026-08-23:** `mpf_spreadheet_notice` renamed to `mpf_spreadsheet_notice` across all 27
    lang files in one `rename_lang_key.php` pass.
  - **DONE 2026-08-14:** the js syntax check globs `sw.js` and `js/vendor/` too.

- 25|348| **Sub-categories and paging in the examples gallery.** The grid is `auto-fit`, so both
  arrive without a rewrite. Deliberately not built at six examples; worth doing when the wall stops
  fitting on a screen.

- 25|390| **Finish the unit paradigm migration: a unit is a NAME.**
  And a file's numbers are the user's. Diagnosis, measurements and dependency order: **`dev/unit-paradigm-migration.md`**.
  - **All six steps are DONE** (five 2026-08-16, the reservoir head 2026-08-17). What is left is the
    acceptance criterion, which only `.inp` EXPORT can satisfy.
  - **No choice of constant could have fixed this**: 36.7% of a 20,000 sample fails to round-trip
    bit-identically even with exact factors, worse than the 26% before them; 9.3% of EPA's own
    tokens reformat under `parseFloat` however exact the arithmetic is.
  - The five new unit keys (`u_imgd`, `u_afd`, `u_lpm`, `u_cmh`, `u_cmd`) and `lpn_unit_unknown` are
    in `lang.ec.en.php` only, and fold into the queued sprint.
  - **Acceptance: import then export is BYTE-IDENTICAL for every value the user did not edit.** Also
    Task 281's criterion.

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

- 75|539| **Gang the neighbour labels so their leaders stop crossing.**
  Tom, 2026-08-26, with a screenshot of two node labels whose leaders cross: *"This might be
  forgiveable if it looked difficult or impossible. But when it looks so easy (to a human) to
  resolve, it's embarrassing."* **That is the right test and it is the one to build against** — not
  "are the labels legible" but "would a person looking at this see an obvious fix we missed".
  - **His strategy, and the name is his:** *"can two nearby nodes be labeled as a gang in a
    direction that makes their leaders mutually clear each other's nodes? Maybe we call this the
    gang neighbor nodes strategy."* Three ingredients he lists: **(a)** knowledge of the most-open
    sectors, **(b)** full awareness of the immediate vicinity of the labels, **(c)** parallel
    leaders and/or label stacking.
  - **What makes this different from every previous label pass** is that it optimises a PAIR (or a
    small cluster) rather than one label at a time. `shedAlignedForConflicts()` places one label,
    then treats it as an obstacle for the next — which is why two labels can each be locally
    reasonable and jointly absurd. A gang move has to consider both placements together.
  - **The pieces exist.** `js/lpn-collide.js` is pure weighted-box relaxation with no DOM;
    `js/lpn-geom.js` has leader attachment and arc-length. Task 400 (parked) surveyed the
    optimum-preserving reduction rules and bounded chain search in `dev/label-placement-algorithms.md`
    — **read that before designing, because a crossing pair is exactly the conflict-graph case it
    covers**, and Tom parked it only for lack of real-world feedback. This screenshot is that
    feedback.
  - **Two leaders crossing is a CHEAP thing to detect** — a segment-intersection test on the placed
    pairs — so a first phase could simply find them and report a count, which would say how big the
    problem actually is before anybody optimises anything.
  - Tom, in the same breath: *"I don't want to be forever tweaking this."* So a phase that measures
    before it tunes is the honest opening.
  - **HIS OWN RULE, 2026-08-26, and it is small enough to build:** *"Maybe it's as simple as, if two
    leaders cross or if a label crosses a leader, try stacking their labels."* Two triggers, one
    remedy. **Note the second trigger is the one the first would miss** — a label lying across
    somebody else's leader is just as ugly and is not a crossing of two leaders.
  - **He marked FIVE gangs on one screenshot of Net3-World** (A–E, 2026-08-26), which is the sample
    to build against and the count to beat. Four of the five are pairs of near neighbours whose
    leaders splay apart; one (D) is a cluster near the reservoir where three labels compete for the
    same open sector.
  - So the honest phases are: **count the crossings** (a segment-intersection test, cheap), **try
    the stack on each crossing pair**, and **measure whether the count went down** on that same
    drawing. If it does not, the strategy is wrong and no amount of tuning saves it.


- 50|541| **Clicking a label: should it select the asset for editing?**
  Tom's question, 2026-08-26: *"Node insert and auto-edit mode: When you click on a label, should it
  put you in edit mode?"* **Unanswered on purpose — it is a design question, not a defect.**
  - The argument for: a label IS its asset as far as a reader is concerned, and clicking the thing
    you can see is the whole point of a map.
  - The argument against, and it is the reason this is not obvious: a label is DRAGGABLE, and a
    click that both selects and begins a drag is the collision Task 417 is already about on touch.
    A label also often sits over a DIFFERENT asset than the one it names, so "click what is under
    the pointer" and "click what the label refers to" can disagree.
  - Related and worth reading together: Task 417 (long-press enters Edit mode; the touch radius).

- 50|544| **[H] epanet-js is implicitly claiming to be EPANET, and we have not decided what to do.**
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
  - **HE HAS STARTED, 2026-08-26:** *"I started using that appeal today, and I joined the
    EPANET-USERS listserv to ask about hydrant modeling and more later."* So the sentence is in use
    and there is now a channel to real practitioners. **That listserv is also the place the fire-flow
    questions in Task 530 could be answered by people rather than by search** — the emitter posture,
    and whether anyone models the assembly at all.


- 25|484| **Log which unhandled EPANET features actually arrive in real imports.**
  A server-side count of the import features we do not handle, so Task 483 and its siblings are
  driven by what users really bring rather than by what we imagine. **This is analytics, so the log
  row is gated on `ecAnalyticsConsented()`** — the non-obvious part, and the reason it is not simply
  a counter.

- 5|492| **[H] Rewriting the 986 existing commit messages is NOT recommended.**
  Extracted from Task 388 on close so it is not re-proposed from scratch. It rewrites every SHA,
  forces a push, breaks production's `git pull` deploy, dangles 43 SHA citations in `dev/*.md`, and
  saves no context — **nothing ever loads a commit message.** Alive only as a recorded no.

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

- 75|178| **NOTHING in the suite links to the screenshots page. Fix that first.**
  **CORRECTION, 2026-08-25.** The previous version of this block implied Help already pointed at
  `https://librewaternet.org/screenshots.html`. Tom: *"What points at the live screenshots page? I
  expected Help, but that doesn't."* **He is right and I checked: nothing does.** No `.php` in this
  suite contains the string `librewaternet` outside `lib/config.inc.php`'s canonical whitelist. The
  page is live, annotated and unreachable from the software it depicts.
  - **Phase 1, and it is nearly free: a link from Help.** The pictures exist and are maintained in
    another repository; Help carrying a link costs one string and goes stale only when the page
    does. **[H] Where in Help, and the wording, are Tom's.**
  - **Phase 2 is the original task and is NOT the same thing:** a filmstrip GIF from
    `dev/filmstrip-gif-recipe.md` (the add-pipe / add-junction workflow). A 2026-07-30 proof of
    concept showed it is cheap once set up — the hard part is precise SVG click targeting, not GIF
    assembly — and the POC GIFs were never committed.
  - **They are not substitutes.** A still shows a STATE; only a moving asset shows a GESTURE, and
    "how do I draw a pipe" is a gesture. Doing phase 1 does not retire phase 2.

- 5|181| **Per-element symbol sizing (originated during Task 146).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.

- 50|186| **Make the Tables pane spreadsheet-interoperable.**
  Reworked by Tom 2026-08-25: *"186 reworked to make our Tables spreadsheet-interoperable."* The
  original asked for a whole table-paradigm EDITOR (*"For the future a table-paradigm editor with
  spreadsheet-like copy and paste would be very cool"*, 2026-07-30). **The rework is smaller and
  better aimed: we already HAVE tables — make them talk to a spreadsheet.**
  - **Out means copy and paste that lands correctly**, with the headers, in the units on the strip.
    The pane already builds the rows; what a spreadsheet needs is tab-separated text on the
    clipboard, which is a formatter, not an editor.
  - **In is the harder half and is where the old task's real content survives**: paste parsing,
    per-column unit handling, undo integration, and validation of every pasted cell. **A paste is
    the user typing, so every rule about the user's own numbers applies to it.**
  - **Do the OUT direction first and separately.** It is most of the value — a model that already
    exists in a spreadsheet is the case Tom named, and getting a report out is what a submittal
    needs — and it cannot corrupt anything.
  - Distinct from Task 146.04 (node/link report tables), which is read-only reporting.

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

Evidence base for this whole section: the 2026-07-27 Google Search Console query export — cluster
table, CTRs and the two smaller findings are in `dev/usage-data-log.md`. The headline: **Manning is
won and needs nothing** (position 1, 25% CTR), while the comparable sewer-slope cluster converts at 1%.

## Completed

**Closed IDs live in `dev/roadmap-closed-ids.md`**, one line each so a cited `Task N` still resolves;
the text stays in git. `roadmap_id_check.php` reads both files: an ID is unique across the pair, and
priority 0 means the block is in the ledger and nowhere else.
