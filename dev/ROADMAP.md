# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" — and *only* that, so a blocked or parked task keeps a real priority, however low, and a task set to 0 moves under `## Completed` in the same edit (`php dev/scripts/roadmap_id_check.php` enforces both directions). 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N". A task that is one of several concrete sub-items under a single parent task may instead use a dotted ID, `parent.nn` (e.g. `146.01`) — introduced 2026-07-29 for Task 146's backlog — but it is still a full `Priority|ID|status` bullet like any other task, just grouped under its parent by ID rather than living inside the parent's prose.

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

**`CHECK: YYYY-MM-DD` marks a task waiting on the calendar rather than on work** (Task 155's Search Console wait; Task 202's `zh` n=30). Tom asked 2026-08-05 whether dated tasks should always be priority 100. **No, and the date must never promote the task.** A `CHECK:` date is a **gate, not a deadline**: before it, the work is impossible (attempting it yields nothing); after it, the task simply becomes doable **at whatever priority it already had**. So Task 155 stays at 10 forever if a Search Console look is worth 10 — an arrived date means "you may now do this", never "do this next". *(CC's first draft of this paragraph said to raise the priority when the date arrives. That was wrong, and it smuggled promotion back in after arguing against it; Tom caught it: "Use the real priority, and don't let the date promote it." That is the rule.)* The one genuine exception is a task whose **value decays** — evidence that expires, a real external deadline. That is a change in worth, so change the priority and say why; it is not the date doing the work.

## LENGTH DISCIPLINE (Tom, 2026-08-05) — read this before writing a task

**Tom's complaint, verbatim and correct:** *"We are getting huge, and now apparently gratuitous, roadmap bloat. Task 219 could have been a single line: 'Add lpn to Related links on hw, bpn, and ip.'"* He was right. This file went **1,720 → 5,634 lines in nine days** (2026-07-27 → 2026-08-05, a 3.3× growth), and Task 219 was written at 44 lines for what is a three-line PHP edit plus one real blocker. It is now 9.

**The default is 1–3 lines.** Most tasks are a sentence. Write the sentence and stop.

**The one test that decides whether a line may be added: would a competent person, reading the short version, DO SOMETHING DIFFERENT if this line were there?** If not, cut it. That test kills, specifically:
- Reasoning that leads to the obvious action. If the action is obvious, the reasoning is decoration.
- Restating the request, then agreeing with it, then explaining why it is a good idea.
- Rejected alternatives nobody proposed.
- Explaining what a thing is, when the reader can open the file and see.

**Expansion is EARNED, and only by these four:** (a) a decision with a real rejected alternative, so it is not relitigated; (b) a measured number, so it is not re-measured; (c) a non-obvious constraint or blocker; (d) a correction of something previously recorded wrong here. Task 213's ratio table and Task 219's identity-string blocker earn their lines. Almost nothing else does.

**Hard cap ~15 lines.** Past that, the content is a `dev/*.md` document and the task is one line pointing at it. `dev/` already holds a dozen such docs; that is the mechanism, use it.

**On close, COMPRESS — do not just set priority to 0 and move the block.** A closed task is ≤5 lines: what changed, where it lives, and any finding a future reader needs. The narrative of how it got built is not that. (Standing offenders as of 2026-08-05: Task 195 at 296 lines, 140 at 252, 211 at 218, 203 at 198. Mean task block is 26 lines and median is 13, so these are 8–20× typical.)

**This is a real cost, not tidiness.** The file is loaded into context to answer almost any question about this project; every gratuitous line is paid for repeatedly, by both humans and AI, forever.

# Tasks

## Calculator Improvements

- 60|388| **The documentation is written as a transcript of revision, not as current state.**
  The habit is that a correction is APPENDED, never SUBSTITUTED. The rule: when a decision is
  superseded, delete the superseded reasoning — keep the conclusion and the one rejected alternative
  that would otherwise be re-proposed.
  - **DONE, roadmap half (2026-08-16):** 11,871 lines across ROADMAP + archive → 3,265, then the
    archive itself dropped to a 321-line ID ledger on Tom's ruling. Its text is in git.
  - **DONE, CLAUDE.md (2026-08-16):** 1,213 lines / 100 KB → 560 / 36 KB (**36%**). Rules a script
    enforces are now one table row naming the script. Deep reference moved to
    `dev/language-strings.md`, `dev/testing-notes.md`, `dev/translation-process.md`.
  - **DONE, commit messages (2026-08-16):** subject-only by default, ≤72 chars, body only when a
    reader would act differently, ≤40 words. Measured: Tom's oldest 300 commits had no body 68% of
    the time (median 84 words); the AI era wrote one on 99 of the last 100 (median 297 words).
  - **STILL OPEN.** (a) `js/looped-network.js` at 47% comment lines — the sibling `js/lpn-*.js`
    files were done 2026-08-16, but `looped-network.js` was held back because a concurrent track
    owned it. (b) DONE 2026-08-18: the last over-budget open roadmap blocks are compacted;
    `roadmap_id_check.php` names any new one in size order, so this stays a worklist not a search.
  - **Rewriting the 986 existing commit messages is NOT recommended** and needs Tom's ruling: it
    rewrites every SHA, forces a push, breaks production's `git pull`, dangles 43 SHA citations in
    `dev/*.md`, and saves no context — nothing ever loads a commit message.

- 55|378| **[H] Give the seven harnesses a network some other way, and delete
  `drawExampleNetwork()`.** The 289-line code-drawn ring main lost its last user-facing caller when
  Task 375's follow-up removed the File > New "From examples" rows, but seven harnesses still build
  their network from it — closed-link, gradient-label, id-prefix, friction-method, label-affix,
  readout-sign and example-network. So it ships to every visitor as dead weight for the benefit of
  the test suite, which is worth saying out loud rather than leaving to be rediscovered.
  - **The obvious replacement is the gallery file it was copied into.** `examples/Basic-example-US-
    units-lpn.json` is the same network; a fixture that reads it through `acceptImportedText()` +
    `applySaved()` would also be testing the path a real user takes, which the code path never was.
  - The care needed is that those harnesses assert solved pressures and specific IDs. Migrate one
    first and diff its output against the current run before touching the other six.

- 10|391| **[H] Evaluate `// @ts-check` with JSDoc branded types — a joint decision, not a
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

- 25|390| **Finish the unit paradigm migration: a unit is a NAME, and a file's numbers are the
  user's.** Diagnosis, measurements and dependency order: **`dev/unit-paradigm-migration.md`**.
  - **All six steps are DONE** (five 2026-08-16, the reservoir head 2026-08-17). What is left is the
    acceptance criterion, which only `.inp` EXPORT can satisfy.
  - **No choice of constant could have fixed this**: 36.7% of a 20,000 sample fails to round-trip
    bit-identically even with exact factors, worse than the 26% before them; 9.3% of EPA's own
    tokens reformat under `parseFloat` however exact the arithmetic is.
  - The five new unit keys (`u_imgd`, `u_afd`, `u_lpm`, `u_cmh`, `u_cmd`) and `lpn_unit_unknown` are
    in `lang.ec.en.php` only, and fold into the queued sprint.
  - **Acceptance: import then export is BYTE-IDENTICAL for every value the user did not edit.** Also
    Task 281's criterion.
- 60|389| **Search and replace inputs across the network — WANTED, and no longer gated on network
  size.** Tom, 2026-08-16: *"I would like search and replace embraced more explicitly."* That
  reverses this file's earlier position, which said find-and-replace was a big-network tool we
  should not borrow for a design tool. The reversal is deliberate: a designer re-roughening every
  PVC pipe, or bumping every 6-inch main to 8-inch after a fire-flow run, is doing DESIGN, not
  management — the operation is just as native to 15 pipes as to 4,000.
  - Pairs with Task 353 (find elements by searching): **353 is the query, 389 is the query plus a
    write.** Build 353's selector first and let 389 reuse it rather than growing a second one.
  - Must preview before it writes — "37 pipes will change" with the ability to cancel — and must be
    one undo step, not 37.
  - Goes through `setProp()` like every other property write, or it edits BASE from inside a
    scenario. That seam has already produced five user-reachable defects; `scenario_seam_check.php`
    guards it.
  - Distinct from Task 185 (Match/Copy properties), which stays a click-source-then-click-targets
    tool. Both ship; neither replaces the other.

- 15|355| **Long labels and short pipes — WAIT AND TEST.** Tom, 2026-08-15, after the repeat and
  alignment work landed: *"I think we are good, to tell the truth. Nothing to do, I think."* So
  nothing is scheduled. `linkLabelTooShort()` still hides a short pipe's label all-or-nothing; if
  that ever reads wrong in practice Task 399 now covers it — the label sheds values instead of
  vanishing whole, and `linkLabelTooShort()` becomes the last rung rather than the only one.
  - **Shedding itself confirmed compact/stingy and liked, 2026-08-17** — Tom's word, reviewing
    production at commit `22db1f9` after Task 404 closed. See Task 404's close note.

- 45|408| **Label leader dragging: an optional snap to 15°/30°/45° angle increments, user's choice.**
  Tom, 2026-08-17. A toggle or picker for the increment, not a forced snap — free dragging must stay
  available for whoever wants it.
  - **Open question, same day: magnet-style (soft pull toward the nearest increment, override-able by
    continuing to drag past it) instead of constrained (hard-locks to the grid of angles) snapping.**
    Tom named this as the more modern UX but flagged he does not know what's available to build it
    with. Not researched yet — this repo has no drag/snap library today (`js/looped-network.js`'s own
    pointer handlers do all dragging by hand), so the real choice is between a small hand-rolled
    magnet threshold (a few lines: snap only within N° of an increment, free otherwise) versus pulling
    in a library, which needs its own evaluation against this codebase's no-dependencies-shipped-to-
    visitors norm (`js/vendor/` today holds only the EPANET engine). Decide the mechanism before
    scoping the toggle above.

- 15|294|[H] **Decide the 7 remaining dead language keys, one each.** `menu_main_list`,
  `menu_main_language`, `mi_d50in`, `mpf_spreadheet_notice` (key name is misspelled too),
  `wi_save_and_calculate`, `or_shape`, `contact_title` — rendered by nothing, 27 translated strings
  apiece. Each is either lost content to restore (as Task 290's six Rock Chute notes turned out to
  be) or debt to delete; only Tom can say which. Recorded so far only inside closed Task 290, where
  nothing re-scans it.

- 65|438| **The next sprint: resync the drifted English and translate 2026-08-18's new keys.** Needs
  Tom's explicit authorization before launch — a sprint is 26 paid agents, 20 concurrent.
  - **What is in it:** Task 405's four resync keys; `menu_more` ("More" → "Help"); the four GeoMap/XY
    re-wordings (`lpn_new_geo_us/si`, `lpn_new_blank_us/si`); and roughly thirty new keys from the
    placement tool, Go-to-coordinate, clean map, the `.inp` clock and the share affordance.
  - **Gate: the adversarial Wave 0 over the NEW and CHANGED strings only** —
    `dev/english-friction/438-wave0.json`. `friction_check.php --sprint=438` must exit 0, along with
    `gloss_ref_check.php` and `generate_translation_payloads.php --check`.
  - Close it with `detect_english_drift.php --baseline-new`, or the new keys stay `NEW` forever.

- 60|239| **The English-friction loop: run the mechanized Wave 0 and measure its yield.** The
  mechanism shipped 2026-08-08 and is wired into CLAUDE.md and the sprint checklist — an adversarial
  English pass asking *"list every plausible reading; more than one means rewrite"*, both waves
  writing to `dev/english-friction/<sprint>.json`, with `friction_check.php` blocking sprint *launch*
  on wave-0 findings and sprint *close* on translator findings.
  - **Why it exists: `lpn_` HAD a Wave 0 and it did not work.** Task 193 reviewed all 226 English keys
    and rewrote 51, and the sprint still shipped "Zoom to fit", "Map display and sizes" and "Restore
    defaults" — all three caught later by Tom reading the *Spanish*. Wave 0 was not skipped; it was
    not falsifiable. A fluent reader resolves ambiguity automatically and invisibly, so the fix had to
    be a different QUESTION, not more diligence.
  - **`refer-to-human` deliberately does NOT close the gate.** Escalating is not resolving, and an
    escalation that silently closed would rebuild the exact hole this replaces.
  - **DONE, and the yield is measured.** `dev/english-friction/239-wave0-lpn.json`: run over all 225
    `lpn_` strings AFTER Task 193 had reviewed the same keys and rewritten 51, it found **36 more —
    6 high, 22 medium, 8 low — and 26 English strings were rewritten.** That is the number Tom asked
    for ("I lean to yes, but let's try it"): falsification finds a further 16% of the key set on top
    of a completed review. It earns its permanent place.
  - **OPEN — add the suggestion-box instruction to the standard agent prompt template**, so it is not
    re-typed per sprint and cannot be forgotten.
- 30|234| **Canal Seepage must prove its worth or go (Tom, 2026-08-08: "in my crosshairs").** After
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

- 5|175| **A real printable version, suite-wide.** Raised by Tom, 2026-07-30, while reviewing the
  `lpn_` map page: the suite's only print affordance today is `d-print-none` hiding chrome
  (toolbar, unit-select row, nav) so `Ctrl+P` on the bare page reads a little cleaner — there is no
  actual "printable view" (clean pagination, a results summary, a static rendering of an SVG
  canvas like `lpn_`'s map). Not designed yet — Tom's own fallback today is a screenshot, which
  works but produces something the reader can't page through or reflow. Whoever picks this up
  should figure out what "printable" should even mean per calculator type (a two-column input/
  result form vs. a map/canvas page are different problems) before building anything.
- 25|144| **Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.**
  HW draws 580 confirmed humans (18% human-of-reach, the suite'''s second-biggest front door) but only
  11% of them calculate, against a 51–67% band on six comparable pages — ~517 lost humans per period.
  - **Do not guess a fix.** The decisive step is one observation: pull the HW page'''s own Search
    Console query export and segment it (the doc says exactly how). Reference-lookup queries mean a
    C-value table on the page; calculator queries mean a real UX leak.
  - **Do not promote Task 146 on the 11% number alone** — it does not yet distinguish a leak from
    satisfied reference demand, because `human` counts anyone who dwells 10 s without typing.
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

- 15|202| **`zh` converts at ~15% where its peers convert at 50–75% — PARKED until n=30, with a
  pre-registered threshold.** Everything cheap has been eliminated: **not bots** (arrival pattern is
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
- 5|181| **Per-element symbol sizing (originated during Task 146).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.
- 20|322| **Standing advisories worth converting rather than re-reading.** `check_all.sh` reports
  these every run and nobody can act on them.
  - **`js/looped-network.js` is 9,740 lines**, with `rebuildSettingsFields()` at 507 and
    `drawExampleNetwork()` at 290. Task 293 established the split-by-PURITY pattern and it worked;
    these two are the obvious next extractions.
  - **`mpf_spreadheet_notice`** — misspelled, and `_notice` against the suite's seven `_note`. It is
    one of the dead keys parked in Task 294 awaiting Tom's ruling; whatever he rules,
    `rename_lang_key.php` fixes the spelling in one command.
  - **The js syntax check globs `js/*.js` only**, so `sw.js` at the repo root and `js/vendor/` are
    never syntax-checked. Given Task 318 lives entirely in `sw.js`, that is a gap worth one
    character of glob. **DONE 2026-08-14** — glob widened; the rest of this task stands.

- 5|347| **No project tabs at all until a project is opened.** Tom's strongest form of the examples
  gallery (*"It's not a map until the first project is started or opened?"*), extracted from Task 314
  when it closed. Left out there on grounds worth restating: `init()` guarantees an invariant in as
  many words — *"the library always has exactly one open project, so there is never a state where
  drawing has nowhere to be saved"* — and a tabless boot breaks it everywhere at once (autosave,
  `saveToStorage()`, the scenario container, `renderTabs()`). It is a storage-model change wearing a
  UI change's clothes: it deserves its own `/code-review`. He phrased it as *"possibly"*.

- 20|348| **Sub-categories and paging in the examples gallery.** The grid is `auto-fit`, so both
  arrive without a rewrite. Deliberately not built at six examples; worth doing when the wall stops
  fitting on a screen.

- 70|405| **Resync four English strings the sprint itself earned.** Sprint 397 closed at zero drift and
  zero delta; these four were edited AFTER that baseline, so `detect_english_drift.php` now flags them
  and 26 translations render the superseded text. Small, well-defined resync — one agent per language
  over four keys, or fold into the next sprint.
  - `lpn_settings_readability_bias` — **five languages raised it independently** (de, tr, it, he, bn),
    which is this project's own threshold for an English-source defect. "Turned around" is rotated-to-
    an-angle or flipped-180 in English, and only the second is what the setting does.
  - `lpn_field_text_match_pipe` — three languages (it, uk, bg). It is a button that sets the angle once,
    and "Match pipe angle" reads equally well as a toggle that keeps following.
  - `lpn_examples_size` and `lpn_ex_net3_desc` — **both were factually wrong**, found by two agents
    asking what a number counted. `{nodes}` is every node, not junctions; Net3 has 92 junctions, 3
    tanks and 2 reservoirs, not "97 junctions, two tanks and a river source". Nothing in the build
    compares prose against a network, so only a reader could have caught these.
  - **BLOCKED ON TOM'S AUTHORIZATION, not on work.** It is a translation sprint, and a sprint spawns
    paid agents; CLAUDE.md forbids inferring that from a general "proceed". The English is already
    edited, so the whole remaining task is the 26 renderings.

- 15|400| **Phase 3 — bounded local search on the residue. LOWERED 60→15, Tom 2026-08-17: "Phases 1
  and 2 are good enough for GIS mode or management mode. Phase 3 may be helpful for report mode."**
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
- 35|185| **Match/Copy properties tool (originated during Task 146).** Tom, 2026-07-30: "In the absence of the
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

- 8|186| **Table-paradigm editor with spreadsheet copy/paste (originated during Task 146).** Tom, 2026-07-30:
  "For the future a table-paradigm editor with spreadsheet-like copy and paste would be very cool."
  A grid of nodes and a grid of links, editable in place, with clipboard paste from a spreadsheet —
  what EPANET's own Data Browser tables and every serious package's tabular view provide, and the
  fastest way to build or bulk-correct a model that already exists in a spreadsheet. Distinct from
  Task 146.04 (node/link report tables), which is read-only reporting: this one is an editor and
  needs paste parsing, per-column unit handling, undo integration, and validation of every pasted
  cell. Large; parked deliberately behind Task 185, which gets most of the practical benefit for a
  fraction of the work.
- 20|146.04| **Node/link report tables (Task 146 child).** Tabular results view.
- 20|146.05| **EPANET-style element browser (Task 146 child).** List/select elements from a panel
  rather than only the canvas. **If this lists TEXT elements** (EPANET's own Browser does have a
  Labels category), restore the Text row to the Settings panel's ID-prefixes list — it was removed
  2026-07-30 because a text element's ID is unreachable from every screen in the app, making the
  control visibly inert. `settings.idPrefixes.T` and `nextId.T` were both kept, so restoring it is
  one array entry in `rebuildSettingsFields()`. That row is only worth having once a text ID is
  something the user can actually see.
- 15|191| **Junction emitters — surface the pressure-dependent demand the solver already has
  (originated during Task 146).** Raised 2026-07-30 when Tom asked of the Settings panel's "Emitter exponent"
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
- 15|194| **Touch gesture model: one finger scrolls the page, two fingers pan the map (originated
  during Task 146).** Raised by Tom, 2026-07-31, after the canvas-fills-the-phone lock-up: *"It didn't occur
  to me to try to scroll with two fingers. That's just an idea. It looks like it occurred to you
  too."* The height cap in `applyMapHeight()` already prevents the trap, so this is an improvement,
  not a fix — it removes the underlying conflict instead of bounding it.
  - **The gesture is the inverse of the first phrasing.** Two-finger *scroll* is a trackpad idiom;
    on a touchscreen two fingers means pinch-zoom. The convention to copy is Google Maps embeds and
    Leaflet: **one finger scrolls the page, two fingers pan the map**, with a "use two fingers to
    move the map" hint on the first one-finger background drag.
  - **Shape:** `touch-action: pan-y` on `#lpn_canvas` instead of `none`; the app keeps claiming (and
    `preventDefault()`ing) touches that START on an element, so node/vertex drags, taps and the
    drawing modes are untouched; only BACKGROUND panning moves to two fingers.
  - **Risk to respect:** every drawing gesture on this page is a one-finger touch, so this reworks
    the layer they all sit on. Not a tweak. If it lands, keep the height cap anyway — it costs
    nothing and is the belt to this braces.
- 20|225.13| **`dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got** (Tom: *"Some
  stuff no longer exists or is renamed"*), before anybody is asked to run that section again.
  Split out of Task 225 when the rest of it closed 2026-08-09 — this piece is a punch-list document
  rewrite against live controls, not a code fix, so it needs a browser pass rather than static
  reading.

- 30|283| **Map label legibility: what remains is the AUTO-HIDE rule.** Tom, 2026-08-11, after
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
- 60|284| **Settings panel: an index pane on the left, content on the right, nothing collapsing.**
  **RAISED 25 -> 60 (Tom, 2026-08-18): everything EPANET keeps in View > Options and Project >
  Defaults belongs under our Settings, in this two-pane index paradigm, replacing the collapse
  paradigm entirely.** *"No need ever to collapse; just scroll/jump to your section."* That makes
  this the container Time analysis needs, not a tidy-up. It sits in Task 434's three-pane frame.
  Tom, 2026-08-11, from epanet-js: *"the Settings box has a left 'index' pane and a right 'content'
  pane. When you click a heading in the left pane, the right pane scrolls to your desired heading.
  And the right pane never collapses. This is a very conventional web paradigm."*
  - Headings AND sub-headings in both panes; in the right pane the current heading and sub-heading
    stick to the top rather than scrolling away.
  - **Retiring the collapsible sections strands `settings.sectionsOpen`** (`idPrefixes`, `defaults`,
    `mapDisplay`, `computation`, `files`). Decide whether it becomes a scroll position or is dropped
    and left stale the way `fileAutosaveSeconds` was.
  - **Narrow screen is a second design, so scope it as two.** The index probably collapses to a
    drop-down under a breakpoint. Argue it on its own merits, never from phone use — Task 285.
- 20|285| **We do not know what devices anybody uses this on, and several decisions have quietly
  assumed an answer.** Tom, 2026-08-11: *"we don't know whether anybody uses this on a phone."*
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
- 15|282| **Offer to attach the backdrop an imported `.inp` names.** An `.inp` (and a `.net`) stores
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

- 5|146.09| **Map insets for congested areas of a drawing (Task 146 child).** Very low priority.
- 15|178| **Build a real filmstrip-GIF Help asset from `dev/filmstrip-gif-recipe.md`** (e.g. the
  add-pipe / add-junction workflow). A 2026-07-30 proof of concept showed this is cheap once set up;
  the recipe records the ~30 minutes of trial and error, of which the hard part is precise SVG click
  targeting, not GIF assembly. The POC GIFs were never committed.
- 85|145| **GEOGRAPHIC PROJECTS: a project declares grid or geographic before anything is drawn, the
  same way it declares units.** Scope, the three places "geo is just another unit" stops holding, the
  basemap, the unprojected display and the projection seam: **`dev/geographic-projects.md`**.
  - **DONE, slices 1-3:** the declaration and degrees at every user boundary; the OpenStreetMap
    raster basemap; and the placement tool (File > Convert XY project to GeoMap…), plus a globe-wide
    zoom floor and Go to latitude, longitude. Terms are Tom's: **GeoMap** and **XY**. Detail, and a
    proposed `$ec_lang_syn` diff still awaiting his approval: **`dev/georeferencing.md`**.
  - **NEXT: the projection seam, and it is its own task-sized piece of work.** The cheap version — an
    internal Mercator frame with a lon/lat file — redefines `doc.nodes[].x` under `js/lpn-inp.js` and
    the `.inp` exporter, so it must be sequenced AFTER them, not run beside them.
  - **Web Mercator must NOT become the document's coordinate system**, and its distances are not
    ground distances (`1/cos(latitude)`: ~15% at 40°, ~30% at 50°). This is the strongest argument for
    the standing rule that **`len` is stored and overridable, never derived.**
- 25|436| **Placement tool follow-ups (Task 145's tool, `dev/georeferencing.md` §5).** Three known
  limits, none of them urgent: a BACKGROUND IMAGE is not carried onto the map, so a site plan behind a
  placed model ends up in the wrong place; the two-control-point path (`lpnGeorefFromTwoPoints`, built
  and tested) has no interface, and is the accurate route for a user who has real coordinates for two
  points on their drawing; and Finish is not undoable — Cancel is the way back during placement, and
  after Finish it is closing without saving.

- 40|437| **[H] Search the GeoMap by place name — needs Tom's ruling, not a design.** Tom, 2026-08-18:
  *"We need either the ability to zoom out to the globe or to search by name or to go to lat/lon."*
  The first and third shipped the same day; this one is the only one that costs something.
  - **It needs a GEOCODER, which would be a second third-party host.** `dev/geographic-projects.md`
    §4 says the tile server is the only host this page talks to, and `dev/browser-pass/specs/
    basemap.js` asserts it. Nominatim is the free option and its usage policy requires an identifying
    User-Agent and no heavy use; a paid one means a key, which means a billing account.
  - The privacy cost is real and specific: a search sends **what the user typed** to that host, where
    a tile request only ever sends where they are looking.
  - Cheaper alternatives that need no host, if the answer is no: paste a coordinate (built), paste an
    OpenStreetMap or Google Maps URL and read the lat/lon out of it (no request at all), or import a
    file that already carries coordinates.

- 20|221| **Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.** Delete
  `<prefix>_notes_epanet_term`/`_def` from `Hazen-Williams.php`, `Branched-Network.php`,
  `Looped-Network.php` and all 5 lang files (en, es, pt, fr, tr). A dated "we changed this" note is
  useful for about a year; after that it is archaeology in a user-facing Notes list.

- 30|416| **The tester control panel: move it, prune it, and make it the request channel.** Tom,
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

- 30|421| **A notice the user needs is overwritten by the next solve diagnostic.** Opening a file that
  is already open says so in the status line, and the message is gone before it can be read — the
  solve that follows writes "Add a reservoir or a tank" over it. `dev/browser-pass/specs/files.js`
  fails on exactly this ("and says why"), and has since before 2026-08-17.
  - The fix is a rule about the status line, not about this one message: a notice the user's ACTION
    produced should outlive a diagnostic the document produces, or be shown somewhere that is not
    the same one line.

- 55|418| **The first project of a first visit is marked dirty with nobody having touched it**, so its
  tab wears a permanent asterisk. Found by the Task 414 browser-pass repair, 2026-08-17, and it is
  Tom's 2026-08-15 "the initial project gets an unwarranted asterisk" -- the stamp was moved and is
  still too early.
  - **Measured:** `lpn_index` is written at boot with a `savedSig` and no `dirty`; within ~200 ms the
    first autosave finds a different signature and sets `dirty: true`. It never clears until a save.
  - **Cause is boot ORDER, not the signature:** the branch stamps the baseline inline
    (`savedSig: docSignature()`) and only then runs `seedDefaultInputs()`, which fills
    `settings.defaults` -- and `docSignature()` covers those. Stamp after the seeding.
  - Written up at the top of `dev/browser-pass/specs/boot.js`. No knowingly-red spec was added.

- 25|417| **Long-press on an element should enter Edit mode, exactly as a click does.** Tom,
  2026-08-17. The guard that switches to Edit mode on click does not fire when a long press begins a
  drag, so a touch user who presses and drags is editing an element the page does not think is
  selected for editing. Same guard, second trigger. See Task 192 for why long-press is the touch
  equivalent generally.

- 35|266| **Multi-select (lasso) plus edit-all-selected, as EPANET has.** Tom, 2026-08-10: *"very nice
  for bigger models."* Today's selection model is single-element — `openEditMenu()` already says so
  where it explains why "Select all" is absent. Wants a rubber-band select and one property sheet
  that writes a value to every selected element. **Blocked on Task 415's `selected` property**, which
  is the foundation this was always missing.

- 5|267| **"Save as" the backdrop image.** Tom, 2026-08-10, "very low priority". The image is stored
  as a data URI on `backdrop.href`, so writing it back out is a blob download away.

- 35|248| **Extended-period simulation — the last of the three things the EPANET engine unlocked,
  and the GATE on the LibreEPANET.org launch (Tasks 306/307).** Tanks and valves shipped 2026-08-14;
  PBV and GPV 2026-08-17. Time is the open one, and the engine makes it a mapping-and-UI job rather
  than a numerical one.
  - **THE FOUR EPANET CONCEPTS IT NEEDS ARE CHILDREN, in build order** (Tom, 2026-08-17): 248.01 time
    settings, 248.02 patterns, 248.03 controls, 248.04 curves. Each is testable on its own, and a
    pattern with no clock cannot be demonstrated at all.
  - **Task 384's colour ramp is preparation for this, not decoration** — a number per element per
    timestep cannot be read any other way.
  - **A valve has THREE states in EPANET, not two:** closed, fully open, and ACTIVE. `EN_INITSTATUS =
    OPEN` opens it fully with its setting IGNORED; `EN_INITSETTING` restores active, so status is
    written BEFORE setting. Written the other way a network solves with the valve wide open — exactly
    one k V²/2g of missing head, with flows still agreeing to 2e-10 m³/s.
  - **The gate is about sequencing only, not our right to the name.** No node-count limit; never
    describe the gate as one (`dev/positioning.md` §6). Tom, 2026-08-14: *"we have no less technical
    authority to call ourselves EPANET, more moral authority, and all the legal authority since it's
    all public domain."*
- 45|434| **The BOTTOM pane shipped 2026-08-18; what is left of this task is the RIGHT one, and Tom
  has not settled it.** `#lpn_pane` is docked below the canvas in normal flow, resizable by its top
  grip, remembering height/open/tab per browser in `lpn_pane`. Tabs: **Profile** (moved out of its
  floating popup, and now full-height) and **Junctions** (sortable, editing through `setProp()`).
  Find and the pane toggle sit in a new right-edge toolbar group. Harness
  `dev/lpn-spike/pane-harness.js` (57) and `dev/browser-pass/specs/profile.js`.
  - **The pane is in normal FLOW, and that is the whole mechanism.** `flowBelowMap()` measures
    `body.bottom - svg.bottom`, so the map gives up exactly the pane's height *by measurement* — the
    pane never writes a canvas height and never touches `serializeProject()`.
  - **NO LEFT PANE, ever** (Tom: "Don't copy the epanetjs left pane"). **Settings and the Labels box
    stay separate pull-downs** and the harness asserts they are not tabs.
  - **OPEN: the RIGHT pane** — asset properties plus map visibility/style tabs. Tom: our properties
    box "is acceptable", a pane is "predictable and easily toggleable, but I hate to just be a
    copycat, though good is good". That is not a decision yet, and Tasks 427 and 284 are the two that
    want it. The tab registry leaves room.
  - **OPEN, and it needs Tom:** the toolbar toggle opens the pane on whatever tab you left it on, so
    it does not mean "profile". If Task 433's *"reached from a toolbar button"* meant one button per
    tab, that is a per-tab toggle set rather than one pane toggle. Likewise Find is a button opening a
    a floating panel, not a live type-an-ID box sitting IN the toolbar strip.
  - Pipes/Pumps/Valves tabs are a few lines each in the registry, and are not built.

- 50|433| **Profile: the last piece is the CHOOSER.** Tom, 2026-08-18: *"Amazing. Now we just need a
  good UI."* Two of the three are done — the route is drawn on the map, and the panel is now the
  full-height Profile tab of Task 434's bottom pane.
  - **The chooser should be the Google Maps gesture EPANET uses:** click the starting node, hover
    along the path, click to add a waypoint, double-click to end. Not two pull-downs.

- 55|427| **Colour by value: one dropdown is not the idiom.** Tom, 2026-08-18: he sees the beauty of
  one control, "but it's not the expectation". EPANET and epanet-js both give NODES and LINKS a
  dropdown each, in a right-side pane.
  - **And once a field is chosen the picker is poorly documented** for anyone who opens the project
    later. Candidate home: the bottom of the map, rightward, under or replacing the legend title.
  - **Clicking the LEGEND should open Settings > Color by value.** The legend is where a reader is
    already looking when they want to change it.

- 50|429| **A ramp picker and a ranges picker, EPANET's shape.** Tom, 2026-08-18, on what he wants
  next: a **Ramp** dropdown of dozens of single-line ramps in two categories, Continuous and
  Divergent; above it a single **Ranges** dropdown choosing among 5 calculation modes and a number of
  breaks, reading closed as e.g. `Ranges: 7 Pretty breaks`.
  - *"If Classes isn't standard, I would call it Breaks, Tiers, or Quantity, and I would list it
    first on the closed dropdown."*
  - epanet-js also offers a single Label per symbology; **our Labels model is better and stays.**

- 50|428| **Thematic mode must not hide TEXT.** Tom, 2026-08-18: *"Turning off Text on 'no labels' is
  unexpected."* A Text object is a note the user placed, not a generated label, and the two are
  already different things everywhere else (Tasks 342, 407).
  - **And the right home for a blanket hide is the Labels box, as "Temporarily hide all"** — which
    would leave Text visible, because Text is not a label. Unticking every field there is already an
    adequate interface; the thematic mode should not be a second one.

- 50|425| **The unit-change question, in Tom's own words.** He rewrote it 2026-08-18; use this
  wording rather than paraphrasing it, and add the CANCEL the first cut lacked.
  - Title: *This unit decides what your inputs mean*. Then *cfs is the unit of what you enter for*
    and the field names **one per line**, not a comma list.
  - Then *Options for units change*: **Non-destructive** — leaves every input as it is and
    reinterprets it in the new unit. **Destructive** — rewrites every input with a mathematical
    conversion so the physical characteristics of the network stay very close to the same within
    conversion tolerances; loses the original inputs.
  - Buttons: **Non-destructive · Destructive · Cancel**.
  - **Open, and worth doing:** back the original inputs up before a Destructive change, or offer to.
    An undo snapshot is already taken; whether that is enough is the question.

- 45|426| **The SI and US preset buttons give no clue what they do.** Tom, 2026-08-18. They change
  every unit at once, which under Task 422's rule is a reinterpretation of the whole document. Label
  them *Non-destructive (doesn't rewrite inputs)* — or whatever wording Task 425 settles on, so the
  two agree.

- 45|424| **The units strip is too wide.** Tom, 2026-08-18: wrap each selector onto two lines (label
  above control) plus the group heading, to hold the Settings box to a sensible width.
  - He notes the current width *"reminds me of the two-pane paradigm"* — which is Task 284, and is
    the direction he wants anyway; this is the narrow version until that lands.

- 40|432| **A window scrollbar should not exist on this page.** Tom, 2026-08-18: *"Our bottom controls
  bar should be the hard bottom of the page."* The map is a full-window drawing surface; anything
  that scrolls the WINDOW moves the whole application.
  - **A CSS fix landed 2026-08-18 and is UNVERIFIED in a browser.** The overflow was the `form`'s
    `margin-bottom: 1px`, which collapses out of body's box and into the document's scroll height —
    no measurement inside `flowBelowMap()` can ever see it. Now zeroed, and `html` is
    `overflow: hidden`, both scoped by `html:has(#lpn_canvas)` so the other 15 calculators still
    scroll. **Deliberate cost:** below `LPN_MAP_MIN` (80px) what used to be scroll-reachable is now
    clipped, so on a very short window `#lpn_map_footer` is unreachable. That is what "hard bottom"
    means, but it is a real change.

- 35|435| **The Labels panel's column headings sit too far right.** Tom, 2026-08-18: still misaligned
  after the earlier pass. A CSS fix in `.lpn-labels-*`; the columns are the decimals, priority and
  affix spinners.
  - **A CSS fix landed 2026-08-18 and is UNVERIFIED in a browser.** The cause was a font size, not a
    width: Bootstrap's Reboot makes controls inherit `1rem` while `columnHeadings()` sets the heading
    row to `0.85em`, so every heading was ~15% narrower than the control it names and the leftmost
    flex item absorbed the whole shortfall (~38px at "Before", ~11px at "Priority"). The panel is now
    anchored at `1rem` with the four column widths restated in `rem`. Look at both the Node and Link
    lists, including the node ID row, which uses two spacers instead of spinners.

- 45|248.01| **Time settings (Task 248 child) — the smallest of the four and the one everything else
  reads.** Duration, hydraulic time step, pattern time step, pattern start time, report time step,
  start clock time. EPANET's `[TIMES]`, which the importer already reports as dropped.
  - Do this FIRST. A pattern with no clock to run against cannot be demonstrated, and a control with
    no clock cannot be tested.

- 45|248.02| **Patterns (Task 248 child) — a named multiplier series, and the boundary conditions
  that read one.** Tom, 2026-08-17 named the uses, and they are wider than demand:
  demands and supplies, **reservoir heads** (a river or source level that varies), **pump schedules**
  (on/off or a speed multiplier), water-quality source concentrations, and **electricity pricing**.
  - EPANET's `[PATTERNS]` is a list of multipliers per pattern time step; a junction, a reservoir, a
    pump and a source each name one. The importer reports every one of these as dropped today
    (`demand-pattern`, `head-pattern`), so the import side already knows where they attach.
  - **Water quality is NOT in scope and cannot be scoped by Tom** — 2026-08-17: *"I don't know
    anything about water quality modeling including diffusivity and bulk/wall reactions."* Build the
    pattern mechanism so a WQ source could read one later; do not build WQ on the strength of it.
  - **THE EXPORT HALF IS DONE (2026-08-18).** `[PATTERNS]`, `[CONTROLS]`, `[TIMES]`, `[OPTIONS]
    Pattern` and the `[JUNCTIONS]` pattern column are all written back, each value as its own text —
    Net3 exports at 1,229 of 1,229 tokens byte-identical. What is left here is the UI and the run.


- 40|248.03| **Controls (Task 248 child) — simple and rule-based.** Turning pumps, pipes and valves
  on and off, and changing a setting, on tank level, on time, or on a node pressure. EPANET's
  `[CONTROLS]` (simple) and `[RULES]` (rule-based).
  - Simple controls first: they are four sentence shapes and they cover the great majority of real
    models. Rule-based is a language, and it can wait for evidence that a user has one.
  - The `active` property (Task 184/407) is already how a link is switched off in a scenario, so a
    control writes through a mechanism that exists; what is new is that it fires from a CONDITION.

- 25|248.04| **Curves (Task 248 child) — probably NEVER a separate interface.** Tom, 2026-08-17:
  *"We may be able to avoid curves as a separate interface indefinitely by reporting them and
  referring to them by the name of their owner node."* A pump curve is already edited on the pump
  (`curvePoints`, `curveRef`), and a tank volume curve belongs to its tank.
  - So this task is a REPORT and a NAME, not an editor: a curve is named for the element that owns
    it, and a `[CURVES]` section is read and written under that name. Reopen the editor question
    only if a real file arrives whose curve is shared in a way an owner name cannot express.

- 10|410| **Animation: a time-frame slider (time display, play, pause, speed) once Task 248 lands.**
  Tom, 2026-08-17, naming the EPANET/HEC-RAS convention as the shape to copy. Same "constantly
  desirable, fit in when there's time" tier as Tasks 327 and 409.

- 1|306| **LibreEPANET.org: the rebranded site variant. BLOCKED on Task 248.** Tom bought the domain
  2026-08-14; it 302-redirects to `Looped-Network.php?lang=en` until the gate clears. Priority 1, not
  0: 0 means completed and this is blocked.
  - Tom's spec: EPANET engine on by default, a custom navbar without HawsEDC and the Hydraulics menu,
    no page title or description, Notes moved under More, and navbar + lpn menus + map filling the tab.
  - **It is a VARIANT, not a fork — do not start by copying the page.** The name ruling and the gate
    are in `dev/positioning.md` §6; the build costing, including the hosting answer that avoids the
    112-path refactor and the `CANONICAL_ORIGIN` whitelist trap, is §6.1.
- 1|307|[H] **LibreEPANET.org front-door copy. BLOCKED on Task 248.** Holds the approved register so
  the wording is not re-derived later. Tom, 2026-08-14: **"Join us in building LibreEPANET, for the
  community and by the community, today."** Or some such — the *shape* is the ruling, not the exact
  words: an invitation to build, not a pitch to switch, and no comparison to anyone.
  - **Do not import the reasoning from `dev/positioning.md` into the copy.** That file exists so the
    page does not have to make the argument.
  - The one comparative fact licensed for public use is our own licence (GPL v3+, no tier that can
    be revoked) — stated as a fact about us, never as a claim about them. `dev/positioning.md` §2.
  - **[H] Tom approves the final wording.**
  - **Courtesy note to OpenWaterAnalytics before launch**, in the register of
    `dev/outreach-owa-post.md` — a real question, not an announcement. The name is legally safe
    (EPANET is public domain) but names run on community norms, and the note is cheap insurance.

- 30|246| **Give `lpn_` a real file identity: `.lpn` extension and standard file-toolbar icons.**
  Tom, 2026-08-09, from the epanet-js UX read. JSON inside, `.lpn` outside; new/open/save/save-as
  icons on the toolbar. Cheap, and it is what makes a saved network feel like a document.

- 20|247| **Demand allocation by customer (epanet-js has it, EPANET does not).** Tom, 2026-08-09.
  Assign named demands to a junction and sum them, rather than typing one lumped figure. Genuinely
  fits the irrigation/rural-water audience. Below Task 184 (scenarios), which epanet-js charges for
  and Tom therefore wants raised.

- 30|217| **A suite-owned, multilingual Manning's n table, built from primary sources.** Tom,
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
- 30|218| **Find advisors and proteges — a standing, nagged commitment, not a task that completes.**
  Tom, 2026-08-05: *"I still need help knowing where to try to connect with advisors and proteges;
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
- 15|303| **Usage logging: the remaining lower-value questions.** Extracted from Task 200 when it
  closed 2026-08-14, so they survive the close rather than being buried in a DONE block nobody
  re-reads. All three are cheap and none of them decides anything on its own; take one when a
  specific question makes it worth the wiring.
  - **Time-to-first-calc** — separates a page that is confusing from one that is merely long.
  - **Print / copy-link use**, as a proxy for work somebody intends to keep. Note this overlaps
    Task 215's named-calculation signal, which already measures intent-to-share more directly, so
    check whether the title log has already answered the question before building it.
  - **Intra-site path** — which calculator is the entry point and where people go next. The most
    expensive of the three, because a path needs an ordering the logs deliberately cannot express
    without a per-visit identifier we will not store.

- 4|114| **Reservoir / detention routing calculator (Modified Puls) — full scope in
  `dev/detention-routing-scope.md`.** A time-stepping engine, which is the real departure from the
  suite's steady-state weir and orifice calculators. **Hydrology stays out of scope** — the user
  brings the flood, the tool routes it; do not add a Rational Method or a curve number. Daunting
  (Tom's word) and bigger than Task 137 — do 137 first.

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

- 2|116| **Solar water pumping sizing.** Sizes a solar-PV-powered pump system for irrigation or
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
- 1|118| **Solar water pasteurization / SODIS exposure calculator.** SODIS (WHO/EAWAG-endorsed: clear
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

## Discoverability (Search Reach)

Evidence base for this whole section: the 2026-07-27 Google Search Console query export — cluster
table, CTRs and the two smaller findings are in `dev/usage-data-log.md`. The headline: **Manning is
won and needs nothing** (position 1, 25% CTR), while the comparable sewer-slope cluster converts at 1%.

- 60|269| **ASU Engineers Without Borders answered, and asked to meet.** Tom, 2026-08-10 — a human
  reply to outreach, and he has replied gratefully. This is the first real conversation this suite's
  mission has earned; prepare for the meeting and record what comes of it. Not a search-reach task,
  but it lives here because it is the same goal reached by a better road.

- 10|155|[H] **Deploy and verify the Task 149 search-index fix — deployed, awaiting Search Console
  confirmation.** Steps 1–5 (sitemap uploaded, `robots.txt` Sitemap line, sitemap submitted in
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
- 12|158| **`sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.**
  The query export shows real non-English demand for content `sewslope.php` already has (`pendiente
  mínima tubería pvc sanitaria`, `kanalizasyon eğim tablosu`, `tabela de inclinação de esgoto`).
  Task 151 half-mitigated it with mm diameters and mm/m + percent slope columns, so a metric engineer
  in any language can read the *numbers*; the prose is what remains.
  - **These are PARENT-SITE pages** — no `$ec_lang`, no language switcher, no payload generator, no
    drift tripwire. Decide the shape first: three static translated copies (es/tr/pt) may beat
    building language infrastructure for two documents.
  - **Do not assume this is worth doing.** Task 151 found these queries already *rank*, so the CTR
    problem may be snippet quality (now fixed) rather than language.

## New Calculators (Mission Expansion)

No candidate is open. **Score any new candidate on four axes before proposing it** (Tom, 2026-07-14):
availability (a genuine gap raises priority, a saturated market lowers it even for strong mission
fit), technology emergence, field/NGO demand, and real search evidence. A 2026-07-14 pass overturned
intuitions both ways — rainwater harvesting was saturated; VIP latrine sizing, handpump selection and
check dams were genuine gaps. Every "no calculator found" verdict is a web-search signal, not a
verified global negative. Researched and deprioritized as well-served: **chlorination dosing** (CAWST
itself publishes one) and **pond/reservoir evaporation** (6+ free, several using FAO-56).

## Completed

**Closed IDs live in `dev/roadmap-closed-ids.md`**, one line each so a cited `Task N` still resolves;
the text stays in git. `roadmap_id_check.php` reads both files: an ID is unique across the pair, and
priority 0 means the block is in the ledger and nowhere else.
