# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" — and *only* that, so a blocked or parked task keeps a real priority, however low, and a task set to 0 moves under `## Completed` in the same edit (`php dev/scripts/roadmap_id_check.php` enforces both directions). 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N". A task that is one of several concrete sub-items under a single parent task may instead use a dotted ID, `parent.nn` (e.g. `146.01`) — introduced 2026-07-29 for Task 146's backlog — but it is still a full `Priority|ID|status` bullet like any other task, just grouped under its parent by ID rather than living inside the parent's prose.

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

**`CHECK: YYYY-MM-DD` marks a task waiting on the calendar rather than on work** (Task 155's Search Console wait; Task 202's `zh` n=30). Tom asked 2026-08-05 whether dated tasks should always be priority 100. **No, and the date must never promote the task.** A `CHECK:` date is a **gate, not a deadline**: before it, the work is impossible (attempting it yields nothing); after it, the task simply becomes doable **at whatever priority it already had**. So Task 155 stays at 10 forever if a Search Console look is worth 10 — an arrived date means "you may now do this", never "do this next". *(CC's first draft of this paragraph said to raise the priority when the date arrives. That was wrong, and it smuggled promotion back in after arguing against it; Tom caught it: "Use the real priority, and don't let the date promote it." That is the rule.)* The one genuine exception is a task whose **value decays** — evidence that expires, a real external deadline. That is a change in worth, so change the priority and say why; it is not the date doing the work.

## NEXT SESSION (updated 2026-08-16, and Tom works one arrow per `/clear`)

**Task 390 is finished** (all five steps, 2026-08-16), and so are Tasks 376, 379 and 384. One arrow
is ready.

**Arrow 1 — the TRANSLATION SPRINT.** Delta is **75 keys per language**, all 26 languages: the 47
lpn keys, the 4 Task 337 text-label keys, 18 from Task 384's colour ramp, and 6 from Task 390 step 4
(`u_imgd`, `u_afd`, `u_lpm`, `u_cmh`, `u_cmd`, `lpn_unit_unknown`). Nothing further is queued behind
it, so the sequencing note that held it back is discharged — this is the moment to run it.
Pre-sprint order is in `dev/translation-process.md`: Wave 0 adversarial English pass →
`friction_check.php` → `gloss_ref_check.php` → regenerate payloads → propose to Tom → launch.
`$ec_lang_syn` entries are proposed as a diff and approved in that session, not before. Harness cap:
26 agents means 20 at once and 6 as slots free.

**Fold into Wave 0:** `lpn_inp_drop_units` still says gallons per minute "were assumed". Task 390
step 4 abolished that guess — all ten EPANET keywords are supported and an unknown unit now refuses
the solve by name instead. Rewording it is an English change on a key already translated in 26
languages, so it belongs in the sprint rather than as a quiet edit.

**Blocked on a ruling, and it is one question:** Task 343 (dropping label lines by priority). The
input is ~20 lines, but a control that stores a number nothing reads is worse than none, and
`dev/label-placement-goals.md` §2 rules out a threshold inside the placement pass. **What triggers a
drop** — a residual-score threshold, a count of overlapping neighbours, or a map-width rule like the
one that already hides annotation wholesale? The scoring pass already returns the per-label score
such a threshold would read.

**Also open and unblocked:** Task 388's remainder — `js/looped-network.js` is still 46.9% comment
lines with ~190 blocks of 10+ lines left. Mechanical, and a good filler for a session with spare
room.

**Tom's desk:** Tasks 379 (95), 384 (88), 376 (75), 377 (60) are all `[H]` and all label/colour
work. Nothing above priority 66 moves without him, and 384 (colour ramps) is the real unblocker for
Task 248 (extended-period simulation), because a time series cannot be read as text.

*Delete this block once both arrows have landed; it is a handoff, not a standing plan.*

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
    owned it. (b) 31 open roadmap blocks over the 20-line budget; `roadmap_id_check.php` names them
    in size order, so this is a worklist rather than a search.
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

- 85|390| **Finish the unit paradigm migration: a unit is a NAME, and a file's numbers are the
  user's.** Tom, 2026-08-16: *"You are fighting against a deprecated but not purged paradigm where
  everything was stored in browser and file as SI always... I don't think I authorized that. But it
  was done."* Full diagnosis, measurements and dependency order: **`dev/unit-paradigm-migration.md`**.
  - **DONE — all five steps (2026-08-16).** (1)(2) an `<option>`'s value is the unit's NAME, the
    factor a lookup through `EngCalcs.unitFactors`; `data-unit` is gone; guarded by
    `unit_factor_check.php` §5. (3) the file's own TEXT is kept beside its value in a separate `tok`
    bag, read only through `EngCalcs.lpnNumText()`, which returns a string in every branch so a
    token can never reach arithmetic. (4) a unit we have no factor for is carried verbatim, shown,
    saved back unchanged, and refuses only the SOLVE, by name — and only then did the five missing
    EPANET flow keywords get a selector (`flow_epanet`). (5) a pump's `h0/a/b` are derived at the
    solver handoff, so the unit-switch refit that repaired them is gone.
  - **No choice of constant could have fixed this**: 36.7% of a 20,000 sample fails to round-trip
    bit-identically even with exact factors, worse than the 26% before them. And 9.3% of EPA's own
    tokens reformat under `parseFloat` however exact the arithmetic is.
  - The five new unit keys (`u_imgd`, `u_afd`, `u_lpm`, `u_cmh`, `u_cmd`) and `lpn_unit_unknown` are
    in `lang.ec.en.php` only — an absent key already falls back to English, and a present-and-
    identical one fails `lang_syntax_validate.php`. They fold into the queued sprint.
  - Still open, and each is its own confusion of the same kind: `elev` holds both a user's elevation
    and an imported reservoir's total head.
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

- 60|353| **Find elements by searching for them.** Tom, 2026-08-15. One text input, an "Elements to
  search" pull-down (all / junctions / pipes / …) and a Condition pull-down, roughly the shape of a
  Google Sheets filter. Start there rather than with a query language.
  - The obvious first conditions are contains / equals on an ID, and greater-than / less-than on a
    numeric property (pressure, velocity, diameter, demand). The result wants to select and zoom to
    the element, not just list it.
  - This is the RIGHT answer to "which elements are interesting" — a query the user asked for beats
    a mark the app decided to show. The extrema tie rule (Task 346) was rejected twice for that
    reason; do not reopen it, build this instead.

- 15|355| **Long labels and short pipes — WAIT AND TEST.** Tom, 2026-08-15, after the repeat and
  alignment work landed: *"I think we are good, to tell the truth. Nothing to do, I think."* So
  nothing is scheduled. `linkLabelTooShort()` still hides a short pipe's label all-or-nothing; if
  that ever reads wrong in practice the candidates are Task 343's line-priority drop, shrinking the
  label, letting it overrun, or a leader. Reopen on evidence, not on tidiness.

- 15|294|[H] **Decide the 7 remaining dead language keys, one each.** `menu_main_list`,
  `menu_main_language`, `mi_d50in`, `mpf_spreadheet_notice` (key name is misspelled too),
  `wi_save_and_calculate`, `or_shape`, `contact_title` — rendered by nothing, 27 translated strings
  apiece. Each is either lost content to restore (as Task 290's six Rock Chute notes turned out to
  be) or debt to delete; only Tom can say which. Recorded so far only inside closed Task 290, where
  nothing re-scans it.

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
  - **OPEN — run the adversarial Wave 0 over all 226 `lpn_` keys.** Task 193 already reviewed them,
    so whatever this finds *on top of* a completed review is a direct measurement of the yield, and
    tells Tom whether the pass earns a permanent place. Tom: *"I lean to yes, but let's try it."*
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
- 50|228| **A share affordance at the moment someone names a calculation.** Extracted from Task 215
  when it closed 2026-08-08 — 215 built the *measurement*; this is the unbuilt feature that
  measurement was always pointing at.
  - **The moment someone types a Printable Title is the moment they intend to share.** A "copy a
    link to this calculation" control *there* — attached to something the user already wants — is a
    share mechanism that costs them nothing and needs no plea. It connects to Task 175 (printable)
    and is where the share question from Task 218 lands.
  - **Contrast a footer "tell a colleague" line**, which arrives at a moment of no intent and would
    re-fragment the single invitation Task 205 just consolidated. That is the design this replaces,
    not a fallback for it.
  - **Now measurable before and after.** Task 206 (contact funnel) and Task 215 (named calculations)
    both ship with baselines from 2026-08-08, so this can be attributed instead of argued about —
    which was the stated reason for sequencing it behind them. Give it a clear window of its own
    rather than landing it alongside another change.
  - `EngCalcs.updateUrl()` already maintains a shareable URL, so the mechanism is largely present;
    what is missing is the affordance, its placement, and one honest measure of whether it gets used.
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
- 30|387| **`dev/browser-pass/lib/env.js` silently tests the WRONG TREE from a git worktree, twice
  over.** Found 2026-08-16 by the Task 233 agent, whose first post-fix run reported the identical
  failures because it was reading another checkout's files.
  - **Its port is a constant** (8899), so if another session already has a server bound, `php -S`
    fails to bind *in silence* and the browser is answered by that other server.
  - **Its docroot is the repository's PARENT**, which contains no `engcalcs/` at all when the
    checkout is a worktree under `.claude/worktrees/`.
  - Both faults are invisible from the output: the page loads, the assertions run, the results are
    about somebody else's code. `mi-defaults.js` works around them by starting its own server on an
    OS-assigned port over a temp docroot with a symlink; the fix belongs in `env.js` so `run.js`
    gets it too.

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

- 55|327| **Give the THEMATIC view a one-click control.** The mode itself shipped with Task 384:
  `settings.colorThematic` colours the network by a chosen field and drops every label, as the
  `.lpn-thematic` class on the `<svg>`. What is left is the ergonomics Tom actually named.
  - Today it is three rows inside Settings > Color by value. It should be **one control naming the
    field**, reachable without opening a panel — pressure and velocity are the two that matter.
  - Connects to Task 253 (clean map for screenshots) — a thematic view with no labels IS the clean
    map, arrived at from the other side.

- 35|347| **No project tabs at all until a project is opened.** Tom's strongest form of the examples
  gallery (*"It's not a map until the first project is started or opened?"*), extracted from Task 314
  when it closed. Left out there on grounds worth restating: `init()` guarantees an invariant in as
  many words — *"the library always has exactly one open project, so there is never a state where
  drawing has nowhere to be saved"* — and a tabless boot breaks it everywhere at once (autosave,
  `saveToStorage()`, the scenario container, `renderTabs()`). It is a storage-model change wearing a
  UI change's clothes: it deserves its own `/code-review`. He phrased it as *"possibly"*.

- 20|348| **Sub-categories and paging in the examples gallery.** The grid is `auto-fit`, so both
  arrive without a rewrite. Deliberately not built at six examples; worth doing when the wall stops
  fitting on a screen.

- 55|343| **Priority order for hiding label lines when they do not fit.** Provide an input in the labels box for persistence priority 1–10.

- 55|342| **MTEXT for TEXT OBJECTS — the user's own `doc.labels`, not data labels.** Tom,
  2026-08-14: *"Not mtext labels. Mtext Text objects."* The target is what you place with the Text
  tool (`lb.text`, one centre-anchored `<text>`); generated data labels are out of scope.
  - **Rung 1, explicit line breaks — the whole of what most drawings use.** `\n` in `lb.text`, via
    `setMultilineText()`, edited in a `<textarea>`. Centre the block on `lb.y` so a ONE-line label
    renders pixel-identically to today; that is the whole migration.
  - **Justification belongs HERE, not in Task 332** (Tom, 2026-08-15: *"text alignment is very
    interesting to a user, especially if we allow paragraph text."*). All this task owes it is a row
    in the Text label's property popup — **`lb.align`/`lb.valign` already exist**, shipped by Task
    332 and interpreted in the one place `Geom.labelBoxAt()`. Default centre, so no existing drawing
    changes shape on upgrade.
  - **Rung 2, a wrap WIDTH, is what actually makes it MTEXT** — AutoCAD's defining feature is the
    width box, not the line breaks. SVG does not wrap, so it needs a per-label width plus a greedy
    re-wrap on every font-size change, pure and belonging in `js/lpn-geom.js`. Defer.
  - **Rung 3, per-run rich text, is worth declining** — tspan runs, a saved markup format, and an
    editor for it. `foreignObject` is a trap: HTML-in-SVG breaks export and print fidelity.
  - **THE CONSTRAINT NOBODY WILL THINK OF UNTIL IT BITES: EPANET `[LABELS]` is ONE quoted string per
    line**, so a multi-line Text cannot round-trip. Decide on export (Task 281) whether it becomes N
    labels or one flattened line, where the import (Task 332) can agree with it.

- 55|338| **Say out loud that GEOMETRY IS NOT SCENARIO STATE.** Tom, 2026-08-14: *"For a scenario,
  dragging a node edits the base. Is this bad, good, or an oversight. The good thing is that it's
  obvious."*
  - **GOOD, and deliberate rather than lucky.** `x`/`y` are not in `LPN_OVERRIDABLE`, so a drag is a
    Base write by construction. The reason it is right: **two scenarios of one network must LOOK the
    same, or you cannot compare them.** If geometry were overridable, switching scenarios would move
    the map under the reader — the one thing that makes a side-by-side reading impossible — and every
    scenario would carry a private copy of a drawing nobody meant to fork. Label offsets (`lx`/`ly`)
    are in the same category for the same reason.
  - **It is not an oversight, but it IS undocumented**, and Tom's *"the good thing is that it's
    obvious"* is the whole argument for leaving the behaviour alone and only saying so. The work here
    is a sentence in the scenario UI or Help — not a mechanism.
  - The line to state: **a scenario is a set of HYDRAULIC differences. The drawing is the network's,
    not the scenario's.**

- 60|325| **The sizing PARADIGM: symbol size and text size should be independent.** Tom, 2026-08-14:
  *"I found myself wanting to control symbol size and text size independently instead of having them
  linked."* Today `symbolFactor() = textFactor() × symbolScale`, so symbols are DERIVED from the text
  size with a multiplier to pull them apart.
  - **The link was not arbitrary** — a drawing scales as one thing when the text grows, which is
    right for a 20-node design sketch and wrong for a 97-node imported model where the symbols carry
    the topology and the labels are secondary. Tom has asked for fresh thinking here rather than a
    copy of EPANET.
  - **`textSizeUnits` already offers 'map' vs 'screen'**, and screen units are scale-independent by
    construction. That may be the better DEFAULT for an imported model, and it is worth asking
    whether the map/screen choice and the size are really two settings or one.
  - **What a large model may want is not smaller text but FEWER labels** — at 97 nodes the labels
    are the clutter, and the Labels panel is already built. Weigh that before building anything.
  - **The invisible-import half is CLOSED 2026-08-14** (why the priority dropped 88 → 60):
    `settings.textSize` is in MAP UNITS while every model has its own scale — Net1 spans 60×80 units,
    Net3 spans 37×31, a state-plane model tens of thousands — and `docFromInp()` copied the current
    settings into the new document. Import now derives a size from the model's extent, and
    `effectiveFontSize()`/`symbolFactor()` carry a device-pixel floor.
  - Related and unfiled until Tom rules: a toggle for label background masking, and search within a
    large model.
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
- 15|201| **Scenario UI — build what Task 184 decided.** 184 settled the delta model and 146.08
  shipped the storage, but **nothing in the app can create, name or switch a scenario**, and there is
  no write path for an override: `setOverride()` deliberately does not exist yet, so `effective(el,
  prop)` stays a pure passthrough while Base is the only scenario — which is what makes a missed call
  site fail loudly instead of silently. Until this lands, every scenario-dependent feature is
  unobservable.
  - **The scenario selector**, plus create / rename / delete. Base is a row in the same array, so it
    needs no special case. **Its home is decided: scenario tabs along the BOTTOM strip** (Task 211),
    mirroring project tabs on top — so a tab strip, not a dropdown. 211 reserves the space.
  - **`setOverride(el, prop, value)` and its un-set**, honouring `LPN_OVERRIDABLE`. The key's presence
    IS the override marker, including when the value equals Base's; deleting the key is the undo.
  - **The status-bar override count**, a sum of key counts across the active scenario.
  - **Inherited from 146.08, both unobservable with Base as the only scenario:** the "Create scenario
    geometry variant" toolbar/menu command (Task 192 owns the right-click path), and the "Compare
    with base ID" field — simultaneously the report table's row key, the halo grouping and the
    cleanup handle.
  - **The first drag inside a non-Base scenario needs its one-time notice** (Task 184's "ambient
    state, not modal" decision). `setNotice()` already exists, so the status-bar half is available.
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

- 25|281| **EPANET `.inp` EXPORT — the unbuilt half of Task 196.** Import shipped 2026-08-11; writing
  one did not, and it is the easier direction: `EngCalcs.lpnToInp()` (`js/lpn-epanet.js`) already
  writes a complete `.inp` for the engine toggle, and every element this page models is a strict
  subset of `.inp`.
  - **What is missing is small:** a File menu row and a download, plus two decisions — whether the
    file is written in the PROJECT's units (what a user expects back) rather than the LPS the engine
    adapter hard-codes, and whether coordinates, vertices and text labels go out as
    `[COORDINATES]`/`[VERTICES]`/`[LABELS]`. They should — the drawing is most of the value.
  - **A LABEL'S EXPORTED POINT IS ITS UPPER-LEFT CORNER, not its centre.** EPANET's `[LABELS]`
    coordinates mean the corner (its own documentation says so, and `reanchorImportedLabels()`
    corrects for it on import) while this page anchors text at the centre. Apply the same shift in
    reverse or every label comes back half its own width to the right.
  - **Round-trip is the test to write** — export, re-import, assert the same document;
    `dev/lpn-spike/inp-import-harness.js` is the natural home. **A pump with no curve is the one
    thing that cannot round-trip**, and `lpnToInp()` already substitutes a pipe and warns.
  - **`.inp` ONLY. Never write a `.net`.** Tom asked directly, 2026-08-11 (*"maybe we export only
    .inp?"*) and checked it independently the same day (*"Gemini agrees on all counts. TL;DR: inp is
    the industry standard format."*). `.net` is an undocumented binary serialization of one program's
    object graph; `js/lpn-net.js` reads it as a courtesy, and emitting it would mean shipping a
    format we reverse-engineered as though we knew it was right.
- 30|283| **Map label legibility: what remains is the AUTO-HIDE rule.** Tom, 2026-08-11, after
  studying epanet-js. Label prefixes (`labelPrefixFor()`) and pipe-aligned link labels
  (`alignedLabelAnchor()`) both shipped under Tasks 333 and 329; two pieces are left.
  - **Auto-hide text that does not fit, as a rule we STATE rather than inherit.** Tom leans to two
    separate toggles — *"Auto-hide map-sized text"* (or no toggle, and the answer is always no) and
    *"Auto-hide screen-sized text"* (or no toggle, and the answer is always yes). The asymmetry is
    the point: map-sized text shrinks with the drawing and its absence would be surprising,
    screen-sized text stays put and collides. epanet-js hides NODE labels at one zoom threshold, all
    together and apparently hard-coded — cruder than per-label fit, so beat it rather than copy it.
    Interacts with Tasks 379, 377 and 343, which are the same question at other granularities.
  - **Units as an optional suffix**, for anyone who wants epanet-js's behaviour. Not the default —
    Tom: *"I personally don't see the need for units on a map when they are endlessly redundant. But
    we could offer that."*
  - **Flow direction arrows stay.** epanet-js has none; Tom: *"I like that we do."* Recorded so a
    future tidy-up does not quietly remove them in the name of matching.
- 25|284| **Settings panel: an index pane on the left, content on the right, nothing collapsing.**
  Tom, 2026-08-11, from epanet-js: *"the Settings box has a left 'index' pane and a right 'content'
  pane. When you click a heading in the left pane, the right pane scrolls to your desired heading.
  And the right pane never collapses. This is a very conventional web paradigm."*
  - **Headings AND sub-headings in both panes**, and in the right pane the current heading and
    sub-heading **stick to the top** rather than scrolling away.
  - **This RETIRES the collapsible sections, and that is a real consequence.** `settings.sectionsOpen`
    (`idPrefixes`, `defaults`, `mapDisplay`, `computation`, `files`) exists to persist which accordion
    sections a user left open; with a pane that never collapses there is nothing for it to remember.
    Decide whether it becomes a scroll position or is dropped and left stale the way
    `fileAutosaveSeconds` was.
  - **Check it against a narrow screen before committing.** Two panes side by side is conventional on
    a desktop and is exactly the layout that fails on a narrow one; the index probably has to collapse
    to a drop-down under a breakpoint, which means the design is two designs and should be scoped as
    two. **Do not justify that with "this page is used on phones" — we do not know that** (Tom,
    2026-08-11: *"we don't know whether anybody uses this on a phone"*; Task 285 is why it is still an
    assumption). The narrow-screen case stands on its own.
- 45|286|[H] **EU cookie/ePrivacy compliance.** Phase 1, `privacy.php` and `terms.php` all shipped
  2026-08-12; `dev/cookie-storage-inventory.md` is the record and CLAUDE.md holds the rules a change
  must respect. **What is still OPEN: translating the ten `consent_*`/`privacy_link`/`terms_link`
  keys**, which exist in English precisely so they ride a sprint rather than paying for one. Plus
  Task 287.
  - **Two shapes worth carrying forward.** *Lazy sessions were the work, not the banner* —
    `session_start()` at the top of `base.inc.php` wrote `PHPSESSID` before anything could ask
    anything, and no banner fixes that from the outside. And *when a per-purpose test taints
    something, separate the purposes rather than defending the mixture*: `PHPSESSID`'s
    service-related half moved to `ec_language`, leaving the session one purpose and one honest
    answer.
  - **The trigger is ePrivacy Art 5(3), not GDPR**, tested per purpose and covering `localStorage` as
    much as cookies. **There is no official EU template**, contrary to a reasonable first impression;
    Art 13/14 specify content, not a form. Not legal advice and not from a lawyer.
  - **Tom overruled engineering around the banner**, and the grounds are better than the argument
    they replaced: the user-side cost is already sunk, and avoiding it buys a permanently uncertain
    compliance posture plus permanently degraded numbers, against one click. So the counters keep
    their per-visitor de-duplication.
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
- 11|145| **Google Maps elevation/length helper — MOVED from `bpn_` to `lpn_` (Tom, 2026-07-28).**
  An isolated map mashup that pulls pipe lengths and node elevations into the network, in a separate
  lazy-loaded window. **`bpn_` therefore has no map phase at all now**; nothing should go looking for
  one. Feasibility-gated: investigate cost, key management and terms of service before building.
  - **The core solve never depends on it**, so the whole feature can be aborted at zero cost if it
    proves infeasible or the API terms turn hostile. That constraint matters more here, not less.
  - **Demoted from foundation to one backdrop type among several.** Tom's read: the mashup is very
    cool, but its importance is unproven — in practice a network is drawn over a plan sheet, a CAD
    export or a local aerial, essentially **never** over a Google map. So `lpn_` built the
    projection-free backdrop first and this adds tiles as a *pre-registered* one later, which also
    keeps the offline PWA case working.
  - **Two problems the projection-free backdrop does not have.** (1) Tiles are Web Mercator; a plan
    sheet is State Plane, UTM or a site grid, so mixing them is a coordinate transformation, not a
    scale factor — **do not let Web Mercator become the document's coordinate system**;
    georeferencing is a property of the backdrop layer, not of the network. (2) **Web Mercator
    distances are not ground distances**: scale error is `1/cos(latitude)`, ~15% at 40°, ~30% at 50°,
    unbounded toward the poles. A pipe length measured naively off a tiled backdrop is wrong by more
    than most engineering tolerances, silently, and looks perfectly reasonable on screen. Correct it,
    or compute geodesically from lat/lng. This is the strongest argument for the existing rule that
    **`len` is stored and overridable, never derived.**
- 20|221| **Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.** Delete
  `<prefix>_notes_epanet_term`/`_def` from `Hazen-Williams.php`, `Branched-Network.php`,
  `Looped-Network.php` and all 5 lang files (en, es, pt, fr, tr). A dated "we changed this" note is
  useful for about a year; after that it is archaeology in a user-facing Notes list.

- 40|222| **Position `lpn_` against epanet-js — do not lead with "free EPANET in the browser."**
  **The research and the live ordering are in `dev/positioning.md`** (§3 the order, §4
  screenshot-not-printing, §6 the LibreEPANET gate); this block is not the place to read or edit
  them. Priority dropped 85 → 40 because the thinking is no longer the bottleneck.
  - **What is left as WORK is the content residual from Task 250: `About.php` never names EPANET**,
    so the engine claim Task 243 actually built is invisible on every page. It edits
    `about_body_html`, translated into 26 languages, so it needs its own drift-aware pass.
  - **Two rulings that govern any copy written here.** *Lead with invitation, not comparison* — state
    our own licence, do not narrate theirs, which voluntarily extends Task 296's trademark ban to
    competitors we legally could name. And *design, not management*: the annotated, publishable map is
    the differentiator and it is already built.
  - **The engine claim is a QUALIFICATION, not a headline** (Tom, 2026-08-09): for some agencies "does
    it run the actual EPANET engine?" is a yes/no gate deciding whether we are evaluated at all. Say
    it prominently and make it checkable; just do not spend the blog or video headline on it. Do not
    relitigate.
  - **Mobile is demoted and does not appear in a headline, tagline or list of reasons** (Tom,
    2026-08-14: *"phone is a dead end… I don't want to tout it"*). We keep caring — the touch-trap cap
    stays, phone regressions are still bugs — but the claim is not made.
- 35|266| **Multi-select (lasso) plus edit-all-selected, as EPANET has.** Tom, 2026-08-10: *"very nice
  for bigger models."* Today's selection model is single-element — `openEditMenu()` already says so
  where it explains why "Select all" is absent. Wants a rubber-band select and one property sheet
  that writes a value to every selected element.

- 5|267| **"Save as" the backdrop image.** Tom, 2026-08-10, "very low priority". The image is stored
  as a data URI on `backdrop.href`, so writing it back out is a blob download away.

- 30|298| **Rebrand the navbar's "More" as "Help" and move it beside the Language picker.** Tom,
  2026-08-13: About, Install and Contact sit under it "just fine" as Help, and Walkthroughs now
  joins them. Two edits in `lib/Menus.lib.php` — the `menu_more` value, and moving the `<li>` into
  the right-hand `ms-auto` list ahead of the language dropdown.
  - **Decide it together with Task 244**, which stakes out the same navbar strip for the FLOSS mark.
    Both want the space next to the language menu, and settling them one at a time means moving the
    same item twice.
  - Changing `menu_more`'s English makes 26 translations stale — a resync, not a new key.

- 40|257|[H] **[HUMAN] Find or build the example PROJECTS (plural) for lpn.** Reassigned to Tom at
  his own request, 2026-08-11: *"Let's change this task to a human assignment to create or find some
  EPANET examples."* What is wanted is the CHOICE of networks — which ones teach something, which
  ones look like the work our users do. Handing over the files is enough; the wiring is a small job
  once they exist.
  - **Distinct from Task 254**, which is the one-click *drawing* example a first-time visitor makes
    from an empty canvas. This is a LIBRARY of openable projects — a Projects/tabs feature.
  - **The blocker is gone.** File > Import EPANET file (.inp) shipped 2026-08-11 (Task 196), so an
    example project is now literally an `.inp` we choose, import and save — no converter, no decision
    left. Net1/Net2/Net3 are already in the repo as `dev/lpn-spike/reference/` fixtures, and
    OWA-EPANET is MIT, so they can ship under GPL v3+. Source for more:
    <https://github.com/OpenWaterAnalytics/EPANET/tree/dev/example-networks>.
  - **These are ANALYSIS networks and this suite is a DESIGN tool.** They will make the map look
    serious, but do not let them quietly redefine what the calculator is for — a network with
    reservoirs, pipes and a pump is what shows this calculator doing its job.
  - **Backdrops:** a browser cannot display WMF at all, so Tom's three `.wmf` files still need
    converting (Inkscape opens one and saves SVG). BMP it does read, which makes
    `utility-map-estrellas.bmp` and the Estrellas model the natural first example.
    `20069-WP-Backdrop.wmf` matches none of the three models' `[BACKDROP] FILE` paths, so it appears
    to belong to a fourth model we do not have.
- 30|253| **A clean-map view: hide canvas chrome for screenshots.** Tom, 2026-08-09, wants it
  under the View menu and in the toolbar's View area. **Scope it as "clean map", not "print".**
  His own framing: *"The only thing I care for it to hide at the moment (for map screenshots) is
  the Mode status line... what a true printable version should look like is debatable, which is
  why I prefer just a nice map for a screenshot until we create report tables."* So: one toggle
  that hides `#lpn_mode_hint` (and arguably `#lpn_coords`), nothing else, no print stylesheet
  work, no decisions about what a report contains. Task 175 already holds the real
  printable-version question — do not merge them, and do not let this grow into it.
  - Partly mitigated already: `zoomExtent()` now reserves the overlays' measured height so a fit
    never places content under them. That does not survive a pan, which is why this still exists.

- 35|248| **Extended-period simulation — the last of the three things the EPANET engine unlocked,
  and the GATE on the LibreEPANET.org launch (Tasks 306/307).** Tanks and valves both shipped
  2026-08-14; phase 3, time, is the open one. The engine makes it a mapping-and-UI job rather than a
  numerical one, which is the entire reason it was worth vendoring.
  - **Task 384 (colour coding with a ramp picker) is preparation for this, not decoration** — a
    number per element per timestep cannot be read any other way.
  - **Still substituted with a reported open pipe: PBV and GPV.** A GPV's behaviour is a head-loss
    CURVE and a PBV's a fixed pressure drop, and this page has no element for either.
  - **A valve has THREE states in EPANET, not two:** closed, fully open, and ACTIVE. `EN_INITSTATUS =
    OPEN` opens it fully with its setting IGNORED; `EN_INITSETTING` is what restores active, so
    status is written BEFORE setting. Written the other way a network solves with the valve wide
    open — exactly one k V²/2g of missing head, with flows still agreeing to 2e-10 m³/s.
  - **The gate is about sequencing only, not about our right to the name.** Tom, 2026-08-14: *"we
    have no less technical authority to call ourselves EPANET, more moral authority, and all the
    legal authority since it's all public domain."* There is no node-count limit and the gate must
    never be described as one (`dev/positioning.md` §6).
  - **Raised 20 → 60 then lowered 60 → 35 the same day; the reversal is the instructive part.** Tom:
    *"I have got distracted… I erred in pushing LibreEPANET.org at the expense of scenarios."* A gate
    on a launch nobody is waiting for is not urgent work, and the ruling that survived contact was
    the one with a named user behind it.
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

- 40|244| **Standardize the distinguishing term, and put it in the navbar next to the language menu.**
  Tom, 2026-08-09, on epanet-js labelling itself "Open Source" while shipping FSL. `About.php` is
  done (heading is now "Free Libre Open Source License", plus a "promise, not a price" paragraph).
  Open: **the navbar item** — GitHub mark plus a short word, by the language menu.
  - **"Forever" is out.** Tom, 2026-08-09: *"I don't make promises."* Applies to nav copy generally,
    not just this item. (He kept "now and forever" inside the About.php license paragraph, where it
    describes the GPL's effect rather than pledging his own future conduct.)
  - **"Libre" is back in play.** My objection was that it is insider vocabulary; Tom's counter is
    LibreOffice, which has normalized the word for a decade. Concede the point. Live candidates:
    **"Libre Software"**, **"Freely yours"**, **"Community software"**.
  - The translation caveat still stands and is the tiebreak: "Libre" lands perfectly in
    es/pt/fr/it/ro and as an opaque loan in am/km/my/ur. "Freely yours" translates everywhere.
  **[H] Tom picks the navbar wording before this is built.**

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
- 60|303| **Usage logging: the remaining lower-value questions.** Extracted from Task 200 when it
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
