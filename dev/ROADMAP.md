# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" — and *only* that, so a blocked or parked task keeps a real priority, however low, and a task set to 0 moves under `## Completed` in the same edit (`php dev/scripts/roadmap_id_check.php` enforces both directions). 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N". A task that is one of several concrete sub-items under a single parent task may instead use a dotted ID, `parent.nn` (e.g. `146.01`) — introduced 2026-07-29 for Task 146's backlog — but it is still a full `Priority|ID|status` bullet like any other task, just grouped under its parent by ID rather than living inside the parent's prose.

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

**`CHECK: YYYY-MM-DD` marks a task waiting on the calendar rather than on work** (Task 155's Search Console wait; Task 202's `zh` n=30). Tom asked 2026-08-05 whether dated tasks should always be priority 100. **No, and the date must never promote the task.** A `CHECK:` date is a **gate, not a deadline**: before it, the work is impossible (attempting it yields nothing); after it, the task simply becomes doable **at whatever priority it already had**. So Task 155 stays at 10 forever if a Search Console look is worth 10 — an arrived date means "you may now do this", never "do this next". *(CC's first draft of this paragraph said to raise the priority when the date arrives. That was wrong, and it smuggled promotion back in after arguing against it; Tom caught it: "Use the real priority, and don't let the date promote it." That is the rule.)* The one genuine exception is a task whose **value decays** — evidence that expires, a real external deadline. That is a change in worth, so change the priority and say why; it is not the date doing the work.

## NEXT SESSION (updated 2026-08-16, and Tom works one arrow per `/clear`)

**The next arrow is a TRANSLATION SPRINT**, covering the whole labels era in one pass. The delta as
of 2026-08-16 is **47 keys per language**, all `lpn`, in all 26 languages. Pre-sprint order is in
`dev/translation-process.md`: Wave 0 adversarial English pass → `friction_check.php` →
`gloss_ref_check.php` → regenerate payloads → propose to Tom → launch. `$ec_lang_syn` entries are
proposed as a diff and approved in that session, not before. Note the harness concurrency cap:
26 agents means 20 at once and 6 as slots free.

**Then Task 248 (extended-period simulation)** — the LibreEPANET.org gate, and big enough to want a
session of its own with nothing else in it.

*Delete this block once the sprint has landed; it is a handoff, not a standing plan.*

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

- 88|384| **[H] Colour coding, with a colour-ramp picker — the preparation Task 248 (extended-period
  simulation) actually needs.** Tom, 2026-08-15: *"I think that a major preparation for modeling
  across time is adding color coding, which requires a color ramp picker UX. EPANET and HEC-RAS,
  both public domain software both have solid color picker systems. I would think that you could
  borrow something. epanetjs also has something, and maybe you can investigate whether it's libre."*
  - **Why it is preparation and not decoration:** a time series has to be READ somehow, and a number
    per element per timestep cannot be. Colour is how every one of these programs shows a field
    changing — pressure, velocity, chlorine, age — and it is the only readout that survives a
    network being redrawn 24 times. Building EPS first and colour after would ship a simulation
    nobody can see.
  - It also relieves the label problem this file is full of: a map coloured by pressure needs far
    fewer numbers on it, which is the cheapest possible answer to "there is not room for all these
    labels" (Tasks 379, 377, 343).
  - **Sources, in the order worth checking.** EPANET 2.2 is US EPA work in the **public domain** —
    its ramp defaults and its interval-editing dialog can be copied outright, and matching what a
    water engineer already knows is worth more here than a nicer design. HEC-RAS is USACE, also
    public domain. **epanetjs must be checked before anything is taken** — read its LICENSE rather
    than assuming, and if it is copyleft, take the IDEA and not the code.
  - The UX is the interesting part, not the colouring: which variable, how many intervals, the
    break values, and whether the ramp is absolute or relative to the current timestep — EPANET's
    answer to the last one is a per-variable setting and is worth reading before we invent ours.


- 95|379| **[H] Replace the label relaxation with candidate-position scoring, which is
  the part that can see open space.** Tom, 2026-08-15: *"There is lots of free space that is being
  'wasted' while bad conflicts persist. The relaxation needs to understand the concept of most-open
  space and gravitate toward it."* **`dev/label-placement-goals.md` is the review document** — the
  six goals in priority order, every shipped number with a keep/retire verdict, §6 Tom's box review,
  §7 the map-units-or-pixels question. Nothing in it is settled until he rules.
  - **The diagnosis: `relax()` is a LOCAL method.** Pairwise separation along the axis of smaller
    overlap, four passes; a label knows only what it is touching now. There is no term for open
    space and no candidate it did not stumble into, so **no tuning of the weights will give it that**
    — weights decide who yields, not where anyone goes.
  - **Candidate scoring is the standard cartographic answer and is simpler than what is here**:
    generate N placements per label (eight compass positions at two or three radii, plus the
    current one), score by overlap area against everything placed, plus small penalties for distance
    from the anchor and for less preferred positions, take the best, mark it occupied. Open space
    wins by construction. Deterministic, idempotent, bounded, and it composes with Task 377 — if the
    best candidate still overlaps, hide the label rather than place it badly.
  - **`capNudges()` is a defect in the meantime and disappears with the rewrite**: it runs after the
    relaxation and can drop a label back inside the collision it had just solved, with nothing
    re-run. Scoring has no equivalent — its candidates are all within reach to begin with.
  - **Boxes must be able to ROTATE.** An aligned pipe label's AABB is **5.2x** the label's own area
    at 45° for a 100x12 px label, and the ratio grows without limit with length. Oriented boxes via
    the separating-axis theorem give both the overlap and the push vector in ~30 lines, pure, and an
    unrotated box is the same code at angle zero.
  - **`?debug=boxes` draws the boxes** in the colour of what they are. A URL parameter rather than a
    settings row, which would be a translated string in 27 files for a tool that reviews one
    algorithm. The default side is not sacred — scoring may put a label anywhere around its anchor.
  - Order of work: 379, then 343 (dropping lines by priority), then 377 (hide) as the last resort.
    All three are the same decision — what to do when there is not room — at three granularities.

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

- 75|376| **[H] Replace the label MASK RECT with a text halo, the way epanetjs does it.** Tom,
  2026-08-15, reporting on their build: *"They have a very small hide/mask/patch buffer that follows
  strokes of text and merges together where characters are close; this is very desirable instead of
  a box."*
  - **It is one CSS declaration and it deletes an element.** `paint-order: stroke fill` with a white
    stroke on the text draws exactly that: a halo that follows the glyphs and merges between close
    characters. `--lpn-hair` already exists to size it in screen pixels.
  - **What it deletes is the interesting part.** No mask rect means no mask element per label, no
    `MASK_PAD`, no gap arithmetic to keep a mask off its own pipe (Task 367), no rotation to keep in
    step with the text, no mask left behind when a label is hidden — Tom's *"mask without a label"*
    class of defect stops existing rather than being fixed. Three of this file's tasks are mask
    geometry.
  - The one thing to check before committing: a halo over a dark backdrop reads differently from a
    75%-white box, and the box was there for aerial photographs.

- 60|377| **[H] Do labels need to move at all? epanetjs does not drag them.** Tom, same message:
  *"epanetjs does not autodrag junction labels; this may be a good idea. Where labels conflict, they
  hide the one on the right; since they allow only one label, conflicts are much fewer... User cannot
  drag labels, but this is not harmful."*
  - The alternative to a relaxation is a RULE: on conflict, hide one, deterministically. It cannot
    fling a label across the map (Task 371), needs no cap, no leader, and no nudge — and the whole
    apparatus this suite has spent days on becomes one comparison.
  - Against it: we deliberately allow several values per label, which multiplies conflicts, and
    hiding a value is worse than moving it when the value is why the map is open. Task 343's
    line-priority dropping is the same idea one level down and may be the better half of it.
  - Worth measuring before choosing: how many labels does the relaxation actually rescue on Net3,
    versus how many it merely moves?

- 80|372| **Settings and Labels popovers need a UX pass — they can open taller than the screen and
  cover their own button.** Tom, 2026-08-15: *"Settings box opens, if its expanded options are too
  long, too tall for the screen, and its top extends to cover its button. I think we need to focus
  on optimizing the UX for Settings and Labels now or in a high-priority task."*
  - Two separate faults in one report: the popover has no height cap and no scroll of its own, and
  its placement can put it OVER the control that opened it — which is the one place a user is
  guaranteed to be looking, and the one they will click again to dismiss it.
  - The Notes popover already has the answer to half of it (`lpn-popover-body`, which scrolls);
  Settings and Labels do not use it. Placement needs to flip below/above and clamp to the viewport.
  - Worth doing as one pass over all the popovers rather than per box, since they share
  `openPopupAt()` and will drift apart otherwise.
  - A third fault in the same family, Tom the same day: *"When Labels or Settings are open, clicking
  in the top row of the menu bar does not close them. Clicking anywhere else outside them does close
  them."* The dismissal handler in `wireTabs()` treats a menubar click as "inside", because the
  menubar's own handlers call `stopPropagation()` to keep their menus from closing themselves — so
  the click never reaches the dismissal at all.

- 60|353| **Find elements by searching for them.** Tom, 2026-08-15. One text input, an "Elements to
  search" pull-down (all / junctions / pipes / …) and a Condition pull-down, roughly the shape of a
  Google Sheets filter. Start there rather than with a query language.
  - The obvious first conditions are contains / equals on an ID, and greater-than / less-than on a
    numeric property (pressure, velocity, diameter, demand). The result wants to select and zoom to
    the element, not just list it.
  - Interacts with Task 346 (an extrema mark shared by a dozen tied elements): both are ways of
    asking "which elements are interesting", and a search that can answer "velocity > 5" makes the
    mark's job smaller.

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


- 60|239| **The English-friction loop: mechanize Wave 0, and give every translator a suggestion box.**
  Built 2026-08-08 out of Tom's diagnosis after the 146.06 sprint. **The mechanism exists and is
  wired in; what remains is running it and measuring the yield** (see the open sub-items).
  - **The finding that started it: `lpn_` HAD a Wave 0 and it did not work.** Task 193 reviewed all
    226 English keys and rewrote 51, and the sprint still shipped "Zoom to fit", "Map display and
    sizes" and "Restore defaults" — all three caught later by Tom reading the *Spanish*. **Wave 0
    was not skipped; Wave 0 was not falsifiable.** A review asks "is this string good?", and read
    alone in English by a fluent reader all three answer yes. Fluency resolves ambiguity
    automatically and invisibly, which makes a fluent English reader structurally blind to exactly
    this class. That is why the fix is a different *question*, not more diligence.
  - **Wave 0 mechanized** = an adversarial pass that asks "list every plausible reading; more than
    one means rewrite." One agent, English only, changed strings only — against 4–26 translation
    agents, so the cost is noise. Now checklist item 0 in CLAUDE.md.
  - **Wave 1 made structural.** It was always "intended to feed back to English" and never did,
    because "feeds back" had no artifact and no gate. Both waves now write to one file per sprint,
    `dev/english-friction/<sprint>.json`, and `dev/scripts/friction_check.php` fails while anything
    is unanswered — blocking sprint *launch* on wave-0 findings and sprint *close* on translator
    findings. Verified in all three states: pass, open, malformed.
  - **The ombudsman rule (Tom).** Every translator, every wave, files grievances; the sprint ends by
    resolving them or referring them to the human. `refer-to-human` deliberately does NOT close the
    gate — escalating is not resolving, and an escalation that silently closed would rebuild the
    exact hole this replaces. A closed entry must carry a `resolution` or the log is malformed.
  - **The routing rule** that tells you where a finding goes, now in CLAUDE.md: *does an English
    reader also stumble?* Yes → fix the English (one edit, all 27 languages). No, but a translator
    can't recover the concept → `$ec_lang_intent`. Recurs across labels → glossary.
  - **`$ec_lang_intent` restored to its original design.** Tom: *"CC has misunderstood _intent from
    the beginning. _intent is not for me or for you to describe anything. It is for synonyms or
    alternate expressions."* Two accreted rules were retired: "intent is reserved for
    jargon/transliteration risk" (which made every *plain* label ineligible for the one channel that
    would have fixed it — and all three of this sprint's worst labels were plain), and **Task 132's
    standing pre-authorization for AI to trim intents into `gloss:` pointers**, which was deleting
    the synonym payload that is the channel's whole purpose. There are now no standing carve-outs on
    intent. The AI bar stays as-is for now (Tom: *"I agree for now. Maybe we lift it later"*), with
    the working pattern recorded: AI proposes a diff, human approves, then AI writes.
  - **Positive guidance over negative.** Tom: *"we do ourselves a disservice by relying on 'Avoid'
    instead of providing the correct intent."* `avoid` is now for genuine polysemy traps only, never
    a substitute for saying plainly what a label means.
  - **Shipped alongside:** `lpn_settings_map_display` → "Map appearance" (tr needed no change — it
    had already chosen *görünümü*, "appearance", unprompted); intents written for `calc_defaults`,
    `lpn_tool_zoom_extent`, `lpn_settings_map_display`; `lpn_settings_restore_btn` merged into the
    incumbent `calc_defaults` (26 languages vs 4), retiring 4 translations.
  - **OPEN — run the adversarial Wave 0 over all 226 `lpn_` keys.** Task 193 already reviewed them,
    so whatever this finds *on top of* a completed review is a direct measurement of the yield, and
    tells Tom whether the pass earns a permanent place. Tom, on making it standing: *"I lean to yes,
    but let's try it."*
  - **OPEN — add the suggestion-box instruction to the standard agent prompt template**, so it is
    not re-typed per sprint and cannot be forgotten.


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
- 25|144| **Diagnose the Hazen-Williams conversion leak.** Per the 2026-07-27 usage snapshot
  (`dev/usage-data-log.md`), HW draws 580 confirmed-human views — the suite's second-biggest genuine
  front door, at 18% human-of-reach vs Darcy-Weisbach's 4% — but only 11% of those humans ever
  calculate, against a 51–67% band on six comparable pages (and DW's 37% on a structurally identical
  page). That is ~517 lost humans per period, roughly 5× more than exist on every page below
  Manning-Trap combined, making it the largest single UX prize in the suite. Instrumentation is
  shared and identical across pages, so this is real behavior, not a measurement artifact. Traffic is
  well-targeted, which deepens the puzzle: per Tom, English users dominate and search "Hazen Williams"
  by name, so these are people who wanted *this* calculator. Cause unknown — worth checking whether
  the default inputs read as "already answered" (suppressing the user-triggered recalc that `used`
  requires), whether the form's units/roughness defaults mismatch what a searcher arrives with, or
  whether the page answers the question without interaction. Do not guess a fix; instrument or
  observe first.
  **Tom's leading hypothesis (2026-07-27) — the page may be too small for the job.** People searching
  "Hazen-Williams" may simply not be satisfied by a *single-line* calculator. They arrive with a
  *network* to solve and find one pipe segment. What they may actually be hoping for is `bpn_`
  (branched networks — Task 137, now shipped) or, against all their fears, a **simple Hardy Cross
  looped-network calculator** — the Phase 3 idea in Task 137, envisioned as following the Google Maps
  mashup (Phase 2). On this reading HW is not broken at all; it is just **not enough for their needs**,
  and the 89% who leave are being driven yet again to EPANET or (gasp) WATERCAD. Two things follow.
  First, it makes the Task 138 HW→BPN link a partial test of the hypothesis, and cheap to observe:
  if BPN's human count climbs while HW's conversion stays flat, the leak is scope, not usability.
  Second, it reframes Phase 3 from "conditional, uncommitted" toward **evidence-backed** — 517 lost
  humans per period is exactly the "or users ask" trigger that gate was waiting for, arriving as
  behavior rather than as a request. **Phase 3 is now Task 146** (extracted from 137's closed block
  2026-07-27); a confirmed finding here promotes it. Weigh this against the mundane usability causes above before
  committing; a scope explanation is more flattering to the suite than a defect explanation, which is
  precisely why it deserves evidence and not assumption.
  **CC analysis 2026-07-28 (source read, no fix attempted — task is below the priority cutoff).**
  Tom raised five candidate causes; four die on one filter. **`Hazen-Williams.php`,
  `Darcy-Weisbach.php` and `Manning-Pipe-Head-Loss.php` are structurally near-identical** — verified
  by reading all three: same inputs (`q`=1, `d`=1, `l`=1000, `km`=2.0, `egl1`=0), same SI-first unit
  lists, same EGL/HGL result rows, same tips. They differ only in the roughness input (C vs e+ν vs n)
  and DW's extra Reynolds/regime/f rows. **Anything identical across pages cannot explain why HW sits
  at 11% while its twins sit at 37% and 58%.** That kills, as *page-design* explanations: (1)
  pressure-vs-head — every head field on all three already offers psi/kPa/bar/mH2O, so pressure is
  available today and the elevation gap is shared; (3) EGL-vs-HGL input; (4) too much on the page.
  Questions (2) top-down-vs-bottom-up and (5) US defaults survive **only as audience-composition
  differences, not page differences** — the same metric-first defaults hurt more if HW's audience
  skews more US than DW's. Note `MPF` converts at **67% with those identical metric defaults**, which
  is strong evidence they are not independently fatal. Separately: the `in` unit set already maps to
  in/gpm/psi/ft²/ftps, so "US defaults" needs no new unit work — only a decision about the *initial*
  selection, which today is simply the first entry in each `units` array.
  **The task's measurement claim is a non sequitur and should not be relied on.** "Instrumentation is
  shared and identical across pages, so this is real behavior, not a measurement artifact" — identical
  instrumentation does not imply identical *traffic composition*. Read what the two tiers actually
  require (`js/Calculators.lib.js`): **`human` = JS executed + session ≥10s old. Nothing else.**
  `used` = a *user-triggered recalculation* ≥10s after load. So any visitor that renders JS and dwells
  but never types — a JS-rendering AI/preview crawler, or **a person reading the page for reference** —
  inflates `human` and deflates `%used` simultaneously. **HW is precisely the page with the anomalous
  numerator: 18% human-of-reach against 3–5% for its structural twins.** One traffic-composition cause
  explains both anomalies at once; no UX fix would ever move it.
  **Sixth hypothesis, not previously on the list, and it fits the data better than the others:
  "Hazen-Williams" names a *formula*, not a task.** People search it to look up the **equation or the
  C coefficient**, not necessarily to compute — and the page links out to a C-value table. Those
  visits are *satisfied*, not lost, and would be miscounted as a leak by construction. (DW is also a
  formula name but draws 4% human-of-reach, i.e. it is not pulling that reference crowd at scale.)
  **Cheapest decisive next step, and it is observation not guessing:** pull the **HW page's own query
  export** from Search Console — the same source that produced the sewer-slope query data in Task 151.
  If the queries are `hazen williams c values` / `formula` / `equation`, this is reference demand and
  the right response is to put a C-value table *on the page* (turning a bounce into a satisfied visit,
  possibly into a calculation) — not a network solver. If they are `hazen williams calculator` /
  `pipe pressure loss calculator`, it is a real UX leak and Task 146 gets its evidence. **Do not
  promote Task 146 on the strength of the 11% number alone** — that number does not yet distinguish
  the two.
  **Tom's correction, 2026-07-28 — the three pages do not share an audience, so the "identical pages"
  filter above is weaker than CC presented it.** Tom's domain model: **`mphl_` is a storm drain and
  culvert calculator, `hw_` is a waterline calculator, and `dw_` is what engineers outside the US
  use.** That is correct, and it changes the weighting: identical page design does not license
  expecting identical conversion, because the same default can be neutral for one audience and
  disqualifying for another. CC's filter was valid only in its narrow form — *any* explanation must
  run through an audience difference — but CC ranked the audience-difference survivors (Tom's Q2 and
  Q5) as weak when this domain model makes them the **leading** candidates.
  **Why HW is the page where SI-first defaults cost the most.** Hazen-Williams is empirical,
  water-only, and its user base is unusually unit-monolingual: US municipal water distribution (AWWA)
  and **NFPA 13 fire-sprinkler hydraulics, which mandates Hazen-Williams by name**, both work
  natively and almost exclusively in **gpm, psi, inches, feet**. So the arriving visitor's expected
  input set is the `in` unit set, and the page opens on `m3ps`/`m`/`mh2o`. Worse than the units is the
  **scale**: the default q = 1 m³/s is **15,850 gpm** through a 1 m (39") main — a city transmission
  line — when a typical arrival wants a 6" main at 400 gpm. Every field is wrong *and* off by a
  factor of ~40. A DW visitor, being metric already, changes numbers; an HW visitor must change four
  unit dropdowns *and* four numbers before the page says anything true. The `C` default of 100 ("old
  pipe") compounds it — new-main practice is 130–140, NFPA wants 120 (steel) or 150 (CPVC).
  **A page difference CC missed by comparing HW only to DW/MPHL and not to the pages that convert:
  `Manning-Pipe-Flow.php` and `Manning-Trap.php` are the only two calculators in the suite with an
  inverse solver** (`solverControlHtml`), and they are the two highest converters (67%, 61%). HW, DW,
  MPHL, IP and Orifice have none. This is Tom's Q2 (top-down vs bottom-up) as a concrete, checkable
  asymmetry: a waterline designer's actual job is *sizing* — given flow, length and allowable loss,
  find the diameter — which matches the suite's own design-not-analysis principle, and HW offers only
  the forward direction. **It is not a complete explanation** — MI/MPHL/WFS/WFI convert at 51–59%
  with no solver — but it is the one structural difference between HW and the 67% page, and it was
  absent from the five hypotheses.
  **Q3 (EGL-vs-HGL input) is now Task 167**, extracted 2026-07-28 — the "identical pages" filter that
  dismissed it does not survive Tom's correction that the three pages have different audiences.
  **What to ask the query export, given the domain model.** Segment HW's queries for: (a) fire
  protection (`sprinkler`, `NFPA`, `fire flow`, `friction loss psi`) — a large US audience with rigid
  unit expectations; (b) unit words (`gpm`, `psi`, `inch`) — direct confirmation of Q5; (c) sizing
  intent (`pipe size for`, `water main sizing`) — direct confirmation of Q2; (d) `c factor` /
  `c value` — the reference-lookup reading, which Tom does not buy and which this export can settle
  either way; (e) Spanish/Portuguese (`pérdida de carga`, `perda de carga`) — Hazen-Williams is also
  standard practice in Latin America, so a non-US metric segment may be present and would argue
  *against* flipping defaults wholesale.
  **Cheap candidate intervention, if the export supports Q5:** default `Hazen-Williams.php` to the
  `in` unit set with a realistic waterline scale (e.g. 6", 400 gpm, 1000 ft, C = 130). This needs
  **no new translation** — the unit sets already exist and defaults are numbers — making it the
  cheapest testable change on the board. Do not ship it before the export; per-page default divergence
  is a real cost and (e) could argue against it.
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
  pre-registered threshold.** Everything cheap has been eliminated; what remains is a decision that
  data will make for free.
  - **Not bots.** The arrival-pattern check (built for exactly this) shows `zh` at 13 views over 6
    days, burst 1 — more human-shaped than `es` at 8 days, burst 2. **The bot hypothesis was CC's**,
    argued as more likely than a defect, and it was wrong.
  - **Not missing strings.** `lang_parity_check --lang=zh` reports 159 missing, every one of them
    `lpn_` (English-only by design). All `mpf_` keys present, unit tokens translated,
    `EC_DEFAULT_UNIT_SET` correctly gives `zh` SI.
  - **Not a wrong promise in search.** `mpf_main_title` = 免费在线曼宁管流计算器 — unambiguously a
    calculator. And Tom read the page, and back-translated it, and found nothing.
  - **PRE-REGISTERED TEST — this is the point of the entry.** The original finding's weakness was the
    look-elsewhere effect: `zh` was the worst of 11 languages, so its raw p-value overstated the
    case. Naming it in advance removes that penalty. Against the peer rate p = 0.60: at n = 30,
    **real if using ≤ 13, noise if using ≥ 16** (expected 18 if `zh` behaves like its peers, 4–5 if
    it is truly ~15%). Earlier checkpoints: n = 20 → real if ≤ 7; n = 25 → real if ≤ 10.
  - **Priority 15 on purpose.** Not because it stopped mattering — a genuine 15% on a language we
    have already paid to translate would matter a lot — but because **no amount of work now improves
    the answer**, and the log accrues at zero cost. Re-read it when `zh` passes 30 views.
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

- 55|327| **A THEMATIC view: colour the network BY VALUE, as an explicit mode.** Tom, 2026-08-14, on
  EPANET: *"it's practically an act of Congress to get a pipe to show as black while showing values
  from the model on the map… this makes some sense if you consider a huge model zoomed far out where
  you just want to see a bunch of colours indicating high and low values… in their paradigm, the map
  seems to be a high level gradient view of the system."*
  - **We do not have EPANET's problem, and that is the point.** Our pipes are already dark (`#557`),
    and `lpnFieldColors` encodes **WHICH QUANTITY a number is**, not how much — a different axis
    entirely. So the fix EPANET users want is our default, and what we lack is the thing their
    default is good at.
  - **So build the gradient view as a MODE, not as a default.** Two honest products: a DRAWING (dark
    linework, labels, what you plot) and a THEMATIC MAP (colour ramp by a chosen field, no labels,
    what you read at a glance across 97 nodes). EPANET's mistake is not having colour — it is having
    only one mode and making the other one hard.
  - Toggling it should be one control naming the field, not a colour picker. Pressure and velocity
    are the two that matter; a ramp needs a legend, which the Labels panel already has a home for.
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

- 62|346| **An extrema mark shared by a dozen tied elements is noise.** Elm Street prints `Q=0.00`
  on thirteen zero-demand junctions and a closed pipe, and every one of them is marked "lowest".
  The existing guard only covers the degenerate case where max and min are the same value.
  - Options, cheapest first: skip a mark when more than N elements tie for it; skip zero
    specifically (a zero demand is "no demand", not "the smallest demand"); or mark only the
    smallest NON-ZERO value.
  - Found 2026-08-15 while pooling demand with flow (Task 333). Not fixed there because it is a
    different question — what a mark MEANS, rather than which values it compares.

- 55|343| **Priority order for hiding label lines when they do not fit.** The other half of Task
  333: with prefixes shipped, any SUBSET of a stack is self-describing, so dropping a line is now
  safe. Interacts with Task 331's visibility threshold and Task 329's aligned labels, where a
  rotated label has the least room.

- 55|342| **MTEXT for TEXT OBJECTS — the user's own `doc.labels`, not data labels.** Tom,
  2026-08-14, correcting my first reading: *"Not mtext labels. Mtext Text objects."* So the target
  is the thing you place with the Text tool (`lb.text`, one centre-anchored `<text>`), and node/link
  data labels are explicitly out of scope — those are generated, one value per line, and already
  multi-line.
  - **Rung 1, explicit line breaks — half a day, and it is the whole of what most drawings use.**
    `\n` in `lb.text`, rendered through `setMultilineText()`, edited in a `<textarea>` (the backdrop
    world-file field already is one). Centre the block on `lb.y` so a ONE-line label renders
    pixel-identically to today — that is the whole migration.
  - **JUSTIFICATION IS A USER CONTROL AND BELONGS HERE, NOT IN TASK 332** (Tom, 2026-08-15:
    *"text alignment is very interesting to a user, especially if we allow paragraph text. But maybe
    we wrap alignment selection in with the paragraph text task."* — and he is right that a two-line
    note makes it visible where a one-line callout hides it). So: `lb.align` gets its row in the
    Text label's property popup here, left/centre/right.
  - **`lb.align` ALREADY EXISTS — Task 332 shipped it 2026-08-15, storage and renderer both**, plus
    `lb.valign` for the other axis (together they are AutoCAD's MTEXT attachment point, which is why
    the pair is the right shape). `Geom.labelBoxAt()` is the one place either is interpreted. So all
    this task owes alignment is the row in the popup; nothing about it has to be migrated.
  - Ship centre as the default either way: it is what every existing label already is, so no drawing
    changes shape on upgrade.
  - **Rung 2, a wrap WIDTH — about a day, and it is what actually makes it MTEXT.** AutoCAD's
    defining feature is the width box, not the line breaks. SVG does not wrap, so it needs a
    per-label width plus a greedy re-wrap on every font-size change; the wrap itself is pure and
    belongs in `js/lpn-geom.js` with a harness. Defer until asked — rung 1 covers the common case
    and a width handle is more UI than it looks.
  - **Rung 3, per-run rich text — the expensive one, and worth declining.** Bold/italic/colour
    WITHIN one label means tspan runs, a markup format in the saved document, and an editor for it.
    `foreignObject` is the tempting shortcut and is a trap: HTML-in-SVG breaks the export and print
    fidelity Tasks 175/253 exist for. Per-LABEL Bold (Task 337, already higher) buys most of it.
  - **THE CONSTRAINT NOBODY WILL THINK OF UNTIL IT BITES: EPANET `[LABELS]` is ONE quoted string
    per line.** A multi-line Text cannot round-trip. Decide on export (Task 281) whether it becomes
    N labels or one line with the breaks flattened to spaces, and say so where the import (Task 332)
    can agree with it.

- 66|337| **Text label properties: Bold, and Rotate-to-match-a-pipe with a flip toggle.** Tom,
  2026-08-14: *"For text labels properties, it would be nice to allow Bold and Rotation to match a
  pipe with a toggle to rotate opposite the initial result."*
  - Bold is a per-label `lb.bold`, the sibling of the existing `lb.sizeMult`, and is the easy half.
  - **Rotation should CAPTURE an angle, not hold a live reference to a pipe.** Matching "a pipe"
    would need the Text label to know which link it belongs to — a relationship Text labels do not
    have and should not grow, since a street name or a title block is not about one pipe. Take the
    angle from the nearest link at the moment the user asks, store the NUMBER, and the label is then
    independent of everything that happens to that pipe afterwards.
  - **The flip toggle is then just +180°**, which is precisely why Tom asked for it in the same
    breath: `alignedLabelAnchor()`'s readability normalisation picks the side that reads left-to-
    right, and on a near-vertical pipe either choice is defensible. A capture-then-adjust control is
    honest about that; an automatic rule that is right 70% of the time is not.
  - **Tom confirmed the stored-number design and widened the input** (2026-08-14: *"Rotation as
    number. Yes. It's just a helper/convenience, not a link. We can let them enter a number also or
    pick among 0, 30, 45, 60, 90, etc also"*). So matching a pipe is a CONVENIENCE that fills the
    box, and the box is the actual control: free numeric entry plus a short preset list. That
    ordering matters — a control whose only input is "match a pipe" is unusable on a label near no
    pipe, and a preset list is what people reach for nine times in ten.
  - Same shape as the leader endpoint in Task 328: **capture the user's intent once as a number, then
    stop deriving it.** Third place today that pattern has been the answer.

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

- 60|325| **A successful import can render INVISIBLE, and the sizing paradigm is why.** Tom, 2026-08-14,
  after Net3 imported correctly and showed nothing: *"the text size for Net3.inp was so small (0.2)
  that nothing was visible even though the import was successful."* An import that works and looks
  broken is worse than one that fails, because there is nothing to act on.
  - **The cause is that `settings.textSize` is in MAP UNITS while every model has its own coordinate
    scale.** Measured: Net1 spans 60x80 units, Net3 spans **37x31**, and a real survey model in state
    plane spans tens of thousands. `docFromInp()` copies the CURRENT settings into the new document,
    so whatever text size the last project needed is inherited by a model it means nothing for.
    There is no size that is right for all three, and no warning when it is wrong.
  - **PARTLY CLOSED 2026-08-14**: the import now derives a starting size from the model's extent,
    and `effectiveFontSize()`/`symbolFactor()` carry a floor in device pixels, so a correct drawing
    can no longer be invisible. What remains here is superseded by Task 326 — lowered 88 -> 60.
  - **Fix the import first**: derive an initial text size from the model's own extent (roughly
    1/40th of the diagonal reads about right across Net1, Net3 and a state-plane model), so any
    imported network is legible on arrival. Cheap, contained, and it removes the failure mode where
    a correct import looks like a broken one.
  - **THE REAL QUESTION IS THE PARADIGM, and Tom has asked for fresh thinking rather than a copy of
    EPANET.** Today `symbolFactor() = textFactor() x symbolScale`: symbols are DERIVED from the text
    size, with a multiplier to pull them apart. He wants them independent: *"I found myself wanting
    to control symbol size and text size independently instead of having them linked."*
    - The link was not arbitrary -- it exists so a drawing scales as one thing when the text grows,
      which is right for a 20-node design sketch and wrong for a 97-node imported model where the
      symbols carry the topology and the labels are secondary.
    - **`textSizeUnits` already offers 'map' vs 'screen'**, and screen units are scale-independent by
      construction. That may be the better DEFAULT for an imported model, and it is worth asking
      whether the map/screen choice and the size are really two settings or one.
    - Worth weighing before building: at 97 nodes the labels are the clutter, so what a large model
      wants may not be smaller text but FEWER labels -- which is the Labels panel, already built.
      Tom's own "maintenance / GIS-style viewing" note points the same way.
  - Related and unfiled until Tom rules: a toggle for label background masking, and search within a
    large model.

- 5|192| **Right-click / long-press context-menu system (originated during Task 146).** Raised by Tom,
  2026-07-30, when "Create scenario geometry variant" (Task 184) was proposed as a right-click
  action: the calculator has **no right-click capability at all today**, so that action cannot
  quietly introduce one. Tom: *"if we add right-click, it should be built out robustly. It's a habit
  that, once taught or discovered, we should leverage."* Hence a task of its own, and hence 146.08
  ships its command on the toolbar/menu path only — this is not a blocker for it.

  **PARKED at 5, 2026-08-13 (Tom: "I am not currently seeing the need for this").** Not declined —
  the reasoning below is still sound, and the day something wants a context menu it should be built
  the robust way this task describes rather than smuggled in. But nothing currently wants one: the
  action that raised it (Task 184's scenario variant) is itself parked, so this is a mechanism with
  no live caller. Do not build it on the strength of "every app has right-click."
  - **Every clickable class gets a menu** — node, link, vertex, label, backdrop, empty canvas. A menu
    missing on some objects is exactly what teaches users to stop trying.
  - **Long-press is the touch equivalent, and every item stays reachable without it.** This page runs
    on phones; a right-click-only action is an action that does not exist for half the users. That is
    the real reason for Tom's two entry paths — reachability, not redundancy.
  - **Do not hijack right-click inside form fields.** Suppress the native menu only where we replace
    it; the popup's text inputs must keep native copy/paste.
  - **Disable-with-reason rather than hide**, where practical, so the vocabulary stays learnable.
  - Menu contents are contextual to the clicked object (and later to the selection, if multi-select
    lands). Escape closes.
- 15|201| **Scenario UI — build what Task 184 decided (originated during Task 146).** Created 2026-08-03 while
  closing 146.08. Task 184 settled the delta model and 146.08 shipped the storage for it, but
  **nothing in the app can create, name, or switch a scenario**, and there is no write path for an
  override — `setOverride()` deliberately does not exist yet (`effective(el, prop)` is a pure
  passthrough while Base is the only scenario, which is what makes a missed call site fail loudly
  instead of silently). Until this lands, every scenario-dependent feature is unobservable, which is
  exactly why the two bullets below could not be built inside 146.08.
  - **The scenario selector**, plus create / rename / delete. Base is a row in the same array, so the
    selector needs no special case — see Task 184.
  - **`setOverride(el, prop, value)` and its un-set**, honouring `LPN_OVERRIDABLE`. The key's presence
    IS the override marker, including when the value equals Base's; deleting the key is the undo.
  - **The status-bar override count**, a sum of key counts across the active scenario.
  - **INHERITED FROM 146.08** (moved here 2026-08-03, verbatim, because both are unobservable with
    Base as the only scenario):
    - **"Create scenario geometry variant"** — the toolbar/menu command specified in Task 184. Task
      192 owns the right-click path; the toolbar/menu path belongs here.
    - **The "Compare with base ID" field** — the string group key specified in Task 184;
      simultaneously the report table's row key, the halo grouping, and the cleanup handle.
  - **Do not start before Task 195.** Tom set 195 to priority 90 on 2026-08-03; this sits at the same
    priority as its own decision record (184) deliberately, so the two move together.
  - **The selector's home is now decided: scenario tabs along the BOTTOM strip** (Task 211,
    2026-08-04), mirroring project tabs on top — the conventional file-tabs-top / part-tabs-bottom
    split. 211 reserves the space; this task builds the contents. That settles "the scenario
    selector" above as a tab strip rather than a dropdown.
  - **The first drag inside a non-Base scenario needs its one-time notice** (Task 184's
    "ambient state, not modal" decision). Note `setNotice()` now exists in `js/looped-network.js` —
    built for Task 193's delete narration — so the status-bar half of that is already available.

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

  **Kept and still liked (Tom, 2026-08-13): "Very nice idea. I love it."** With a sharp observation
  about why EPANET does not have one: **EPANET/epanet-js would reach for SEARCH AND REPLACE instead,
  because they are aimed at MANAGEMENT of a huge existing network, where we are aimed at DESIGN.**
  Find-and-replace is the right tool when you have 4,000 pipes and need every PVC one re-roughened;
  click-the-source-then-click-the-targets is the right tool when you are drawing 15 pipes and want
  this one to look like that one. **Do not "improve" this into a search-and-replace** — that would
  be borrowing a big-network tool for a small-network job and is the same scope gravity toward
  EPANET that Task 146's scope doc warns about. If a find-and-replace is ever genuinely wanted, it
  is a separate task with a separate justification, not this one grown up.

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


- 25|281| **EPANET `.inp` EXPORT — the unbuilt half of Task 196.** Import shipped 2026-08-11;
  writing an `.inp` did not. It is the much easier direction and most of it already exists:
  `EngCalcs.lpnToInp()` (js/lpn-epanet.js, Task 243) writes a complete `.inp` for the EPANET engine
  toggle today, and every element this page models is a strict subset of what `.inp` can express,
  so nothing needs a lossy projection.
  - **What is actually missing is small:** a File menu row and a download, plus deciding whether
    the file is written in the PROJECT's units (which is what a user would expect back) rather than
    the LPS the engine adapter hard-codes for its own convenience, and whether coordinates,
    vertices and text labels go out as `[COORDINATES]`/`[VERTICES]`/`[LABELS]` (they should — the
    drawing is most of the value, and dropping it makes the export a downgrade).
  - **Round-trip is the test to write:** export a project, re-import it, and assert the same
    document comes back. `dev/lpn-spike/inp-import-harness.js` is the natural home.
  - **A pump with no curve is the one thing that cannot round-trip** — `lpnToInp()` already turns
    it into a short, wide, smooth pipe and warns, because EPANET has no such element.
  - **`.inp` ONLY. Never write a `.net`** (Tom asked the question directly, 2026-08-11: *"maybe we
    export only .inp?"* — yes, and he checked it independently the same day: *"Gemini agrees on all
    counts. TL;DR: inp is the industry standard format."*). `.inp` is documented, is text, is opened natively by EPANET, and is
    read by every other tool in this space. `.net` is an undocumented binary serialization of one
    program's internal object graph; `js/lpn-net.js` reads it as a courtesy to users whose Save
    button makes one, and emitting it would be a different thing entirely — shipping a format we
    reverse-engineered, as though we knew it was right.
  - **A LABEL'S EXPORTED POINT IS ITS UPPER-LEFT CORNER, not its centre.** EPANET's `[LABELS]`
    coordinates mean the corner (its own documentation says so, and the import corrects for it —
    see `reanchorImportedLabels()`), while this page anchors text at the centre. The export has to
    apply the same shift in reverse or every label comes back half its own width to the right.

- 30|283| **Map label legibility: prefixes instead of colours, pipe-aligned link labels, and an
  auto-hide rule.** Tom, 2026-08-11, after studying how epanet-js does it. Four separable pieces;
  they are one task because they are one question — how do the numbers on the map read — but any of
  them can ship alone.

  1. **Label PREFIXES, not units, and not colours alone.** epanet-js suffixes every label with its
     unit and offers no way to turn that off. Tom: *"I personally don't see the need for units on a
     map when they are endlessly redundant. But we could offer that."* His preference is the other
     end of the label: a prefix, `P=` or `Pressure=`, `Q=` or `Flow=`, set in a **Settings > Label
     prefixes** section — so a user picks between nothing, a short symbol, or a full word.
     - **This is also the answer to a limit we already chose not to have.** epanet-js shows ONE
       field at a time; `lpn_` shows several at once and Tom wants to keep that. Several fields at
       once is what makes them need telling apart, and today that job is done entirely by COLOUR
       (`lpnFieldColors` plus the checkbox legend). A prefix does it better: it survives a
       screenshot, a black-and-white print, and a colour-blind reader, none of which a hue does.
       **Keep the legend either way** (`Q` Flow, `P` Pressure, …) — a prefix still has to be
       introduced once.
     - Optional units-as-suffix stays available as a setting for anyone who wants epanet-js's
       behaviour; it is just not the default.
  2. **Link labels drawn ALONG the pipe.** epanet-js sets a pipe's label on the pipe itself, rotated
     to its bearing, repeated from zero to several times per segment at a hard-coded view-based
     spacing whenever it fits. Two observations from Tom, both worth keeping:
     - **Which SIDE it picks is not decipherable** — not always top, not always left or right as
       seen from the high-head node, not the least congested side. *"I suppose we could choose
       anything we want, but I wonder why they aren't always top."* So: choose deliberately, and
       "always top" is the candidate to beat.
     - **Their flip rule has no readability bias.** Text is rotated to avoid being upside-down, with
       the decision angle at exactly 90 degrees. A bias (flip only past ~100 degrees, say) keeps a
       near-vertical run of labels from alternating direction pipe by pipe.
  3. **Auto-hide text that does not fit, as a rule we state rather than inherit.** epanet-js's
     labels are a constant on-screen size — which `lpn_` already offers as `textSizeUnits:
     'screen'` — and it hides what will not fit. We have no such rule at any size. Tom's proposal,
     and he leans to it being **two separate toggles**: *"Auto-hide map-sized text"* (or no toggle
     and the answer is always no) and *"Auto-hide screen-sized text"* (or no toggle and the answer
     is always yes). The asymmetry is the point: map-sized text shrinks with the drawing and its
     absence would be surprising, screen-sized text stays put and collides.
     - epanet-js hides NODE labels at a single zoom threshold, all of them together, and it looks
       hard-coded. That is a cruder rule than per-label fit, and worth beating rather than copying.
  4. **Flow direction arrows stay.** epanet-js has none. Tom: *"I like that we do."* Recorded so a
     future tidy-up does not quietly remove them in the name of matching.

  **Node labels need no work here** — Tom's reading is that epanet-js orients and places them much
  as `lpn_` already does. This task is about link labels, prefixes, and the hiding rule.

- 25|284| **Settings panel: an index pane on the left, content on the right, nothing collapsing.**
  Tom, 2026-08-11, from epanet-js: *"the Settings box has a left 'index' pane and a right 'content'
  pane. When you click a heading in the left pane, the right pane scrolls to your desired heading.
  And the right pane never collapses. This is a very conventional web paradigm."*
  - **Headings AND sub-headings in both panes**, and in the right pane the current heading and
    sub-heading **stick to the top** rather than scrolling away — so there is always a heading at
    the top of the content, with its sub-heading under it where one applies.
  - **This RETIRES the collapsible sections, and that is a real consequence, not a detail.**
    `settings.sectionsOpen` (`idPrefixes`, `defaults`, `mapDisplay`, `computation`, `files`) exists
    to persist which accordion sections a user left open; with a content pane that never collapses
    there is nothing for it to remember. Decide whether it becomes a scroll position, or is simply
    dropped and left as a stale key the way `fileAutosaveSeconds` was.
  - **Check it against a narrow screen before committing.** Two panes side by side is conventional
    on a desktop and is exactly the layout that fails on a narrow one. The index probably has to
    collapse to a drop-down under a breakpoint — fine, but it means the design is two designs and
    should be scoped as two.
  - **DO NOT justify that with "this page is used on phones". WE DO NOT KNOW THAT** (Tom,
    2026-08-11: *"we don't know whether anybody uses this on a phone"*). The first draft of this
    task asserted it as fact; it is an assumption, and Task 285 is the reason it is still one. The
    narrow-screen case stands on its own — a layout that breaks when the window is small is worth
    avoiding whether or not anyone has yet opened it that way — and that is the whole argument.

- 45|286|[H] **EU cookie/ePrivacy compliance, and a privacy page this site did not have.**
  **Phase 1, `privacy.php` and `terms.php` all shipped 2026-08-12; `dev/cookie-storage-inventory.md`
  is the record** — every cookie, every `localStorage` key, every log, and which ones fail the test.
  The rules a change must respect are in CLAUDE.md, not here.
  - **What is still OPEN:** translating the ten `consent_*`/`privacy_link`/`terms_link` keys, which
    exist in English precisely so they ride a sprint rather than paying for one. Plus Task 287.
  - **Two shapes worth carrying forward.** *Lazy sessions were the work, not the banner* —
    `session_start()` at the top of `base.inc.php` wrote `PHPSESSID` before anything could ask
    anything, and no banner fixes that from the outside. And *when a per-purpose test taints
    something, separate the purposes rather than defending the mixture*: `PHPSESSID`'s
    service-related half moved to `ec_language`, leaving the session one purpose and one honest answer.
  - **Consented and unconsented rows are two buckets and are never summed** — consent governs
    STORAGE, and storage is what de-duplication needs, not counting. Summing turns every count into a
    mixture of people and page loads.
  - **The trigger is ePrivacy Art 5(3), not GDPR**, tested *per purpose* and covering `localStorage`
    as much as cookies. **There is no official EU template**, contrary to a reasonable first
    impression; Art 13/14 specify content, not a form. Not legal advice and not from a lawyer.
  - **Tom overruled engineering around the banner** and the grounds are better than the argument they
    replaced: the user-side cost is already sunk, and avoiding it buys a permanently uncertain
    compliance posture plus permanently degraded numbers, against one click. So the counters keep
    their per-visitor de-duplication.

- 20|285| **We do not know what devices anybody uses this on, and several decisions have quietly
  assumed an answer.** Tom, 2026-08-11: *"we don't know whether anybody uses this on a phone."* He
  is right, and it is worth being precise about why: `log-human-view.php` and `log-calc-event.php`
  record **page and language and nothing else**. There is no device signal anywhere in this
  project's instrumentation, so every touch-target, breakpoint and two-pane-layout argument ever
  made here has rested on a guess.
  - **This is not a small guess.** "Touch-friendly" is load-bearing in CLAUDE.md's own conventions
    (the whole-label `.ec-help` tap-target rule exists for it), Task 284's layout hinges on it, and
    `lpn_`'s map editor was designed around finger-precision limits. All of that may well be right.
    None of it is measured.
  - **The cheapest honest signal is a COARSE one, and it should stay coarse.** A full user-agent
    string is fingerprinting-grade data on a suite that already offers a logging opt-out (Task 210)
    and takes that seriously. One bucket per event — `pointer: coarse|fine` from a media query, or a
    viewport-width band — answers "does anyone use this on a phone" without identifying anybody, and
    is a one-field addition to the existing beacon.
  - **Decide what the answer would CHANGE before collecting it.** If the answer is "almost nobody",
    the honest consequence is to stop paying for phone-shaped compromises on `lpn_` specifically —
    which is a real design freedom, not a disappointment. If it is "a third of them", several
    open tasks get a lot more urgent. Either way it is worth more than the guess it replaces.
  - Add the reading to `dev/usage-data-log.md` as its own tier when it exists, not folded into
    reach/shopping/using — it answers a different question from all three.

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
- 15|178| **Cheap filmstrip-GIF recipe for Help-menu docs (handoff, 2026-07-30).** A proof of
  concept (drag-a-label-and-reset, add/drag/delete-a-vertex) showed this is genuinely cheap to
  produce once set up — the fiddly part is precise SVG click targeting, not GIF assembly. Recipe,
  so a future session doesn't re-derive it:
  1. **Dev server: `hawsedc.local` is Tom's own reliable local dev server** — use it directly
     (`http://hawsedc.local/engcalcs/<page>.php`) rather than guessing a docroot/port. In a sandboxed
     agent container, `hawsedc.local` may not resolve via `/etc/hosts` (it can point at a docker
     gateway IP unreachable from inside the sandbox) — if so, launch Chromium with
     `--host-resolver-rules=MAP hawsedc.local 127.0.0.1` (confirmed `127.0.0.1` reaches the real
     Apache vhost by Host header via `curl -H "Host: hawsedc.local"`) rather than editing
     `/etc/hosts`, which needs root this environment doesn't have non-interactively.
  2. **Drive it with Playwright + headless Chromium**, not a hand-rolled CDP client — `npm install
     playwright` then `npx playwright install chromium` (no `--with-deps`; that needs
     passwordless `sudo`, which this environment doesn't have — the plain chromium download works
     without it and was already cached at `~/.cache/ms-playwright` in this container).
  3. **Click targeting is the real difficulty, not GIF assembly.** A bounding-box CENTER on a
     multi-line `<text>` or a thin polyline routinely misses the actual painted pixels (an
     inter-line gap, or empty space beside a 0.5-world-unit stroke) — `elementFromPoint()` then
     returns some unrelated element (or the page background) and the click silently no-ops. Use
     `element.getPointAtLength(totalLength * frac)` transformed through `getScreenCTM()` for a
     point GUARANTEED to be on a path's own paint (pipes, links); for a multi-line label, a point at
     `(bboxCenterX, bboxTop + smallOffset)` (first line's own baseline) is far more reliable than the
     vertical center. Verify blind — don't assume a `dblclick()`/drag "worked" from lack of a thrown
     error; re-read the actual DOM/bounding-box state after the action (this is what caught the
     label-reset click landing on the wrong element in the first POC pass).
  4. **GIF assembly, pure JS, no native deps:** `gifencoder`/the `canvas` package need `node-gyp` +
     system `cairo` and failed to build in this container (no passwordless `sudo` for
     `--with-deps`-style system installs). `npm install omggif pngjs quantize` instead — decode
     screenshots with `pngjs`, build ONE shared color palette across all frames with `quantize` (a
     per-frame palette flickers colors frame to frame), write frames with `omggif`'s `GifWriter`.
     Delay unit is centiseconds (`100`-`200` for a 1-2s/frame filmstrip, not a smooth-video rate).
  5. **Screenshot the canvas element directly** (`page.locator('#lpn_canvas').screenshot()`), not
     the full viewport — the page's own chrome (toolbar, unit row) pushes the SVG below the fold at
     a normal viewport height, and a full-page screenshot then needs cropping anyway.
  Proof-of-concept GIFs and the driver script are not committed (they lived in the session
  scratchpad); this task is the recipe so the ~30 minutes of trial-and-error solving steps 1 and 3
  isn't repeated. A real Help-menu asset (e.g. the add-pipe/add-junction workflow) is still to be
  built from this recipe, not just the two POC demos.
- 11|145| **Google Maps elevation/length helper — MOVED from `bpn_` to `lpn_` (Tom, 2026-07-28).**
  Was "Google Maps elevation/length helper for `bpn_`", extracted from Task 137 "Phase 2" on
  2026-07-27. Tom's reason for the move, recorded because it is a genuine prioritization signal and
  not a technicality: he cannot get excited about the mashup on the branched calculator, and would
  rather break it in on the map-centric page — which is where it belongs, since that page already
  has a view layer, coordinates, and a reason to know where things are. **`bpn_` therefore has no map
  phase at all now**; nothing should go looking for one.
  An isolated map mashup that pulls pipe lengths and node elevations into the network, in a
  **separate lazy-loaded window**, keeping the hard architectural constraint from the original spec —
  **the core solve never depends on it**, so the whole feature can be aborted at zero cost if it
  proves infeasible or the API terms turn hostile. That constraint matters *more* here, not less.
  Feasibility-gated: investigate cost, key management, and terms of service before building. Note it
  is no longer a prerequisite for Task 146 in either direction — Task 146 is now how we get the map
  expertise, rather than something waiting on it.

  **Demoted from foundation to one backdrop type among several (Tom, 2026-07-28).** Tom's own read:
  the mashup is very cool and gets cooler with time, but its importance is unproven — and in real
  practice a network is drawn over a plan sheet, a CAD export, or a local aerial, essentially **never**
  over a Google map or Google aerial. So Task 146 builds a **projection-free user-supplied backdrop**
  first (see its Backdrop note), and this task adds tiles as a *pre-registered* backdrop later. That
  ordering also means the offline PWA case keeps working, which a tile-dependent design would break.

  **Two real problems this task must solve, neither of which the projection-free backdrop has:**
  1. **Projection.** Tiles are Web Mercator; a plan sheet is State Plane, UTM, or a site grid.
     Mixing them means an actual coordinate transformation, not a scale factor. **Do not let Web
     Mercator become the document's coordinate system** — the document stays flat Cartesian, and
     georeferencing is a property of the *backdrop layer*, not of the network.
  2. **Web Mercator distances are not ground distances.** Scale error is `1/cos(latitude)`: ~15% at
     40°, ~30% at 50°, and unbounded toward the poles. A pipe length measured naively off a tiled
     backdrop is therefore *wrong by more than most engineering tolerances*, silently, and in a way
     that looks perfectly reasonable on screen. Any length derived from tiles must be corrected, or
     computed geodesically from lat/lng rather than from screen geometry. This is the strongest
     argument for the existing rule that **`len` is stored and overridable, never derived**.

- 20|221| **Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.** Delete
  `<prefix>_notes_epanet_term`/`_def` from `Hazen-Williams.php`, `Branched-Network.php`,
  `Looped-Network.php` and all 5 lang files (en, es, pt, fr, tr). A dated "we changed this" note is
  useful for about a year; after that it is archaeology in a user-facing Notes list.

- 40|222| **Position `lpn_` against epanet-js — do not lead with "free EPANET in the
  browser."** **The research and the live ordering are in `dev/positioning.md`** (§3 the order, §4
  screenshot-not-printing, §6 the LibreEPANET gate); this block is not the place to read or edit
  them. Priority dropped 85 → 40 because the thinking is no longer the bottleneck.
  - **What is left as WORK is the content residual from Task 250: `About.php` never names EPANET**,
    so the engine claim Task 243 actually built is invisible on every page. It edits
    `about_body_html`, translated into 26 languages, so it needs its own drift-aware pass.
  - **Two rulings that govern any copy written here.** *Lead with invitation, not comparison* — state
    our own licence, do not narrate theirs, which voluntarily extends Task 296's trademark ban to
    competitors we legally could name. And *design, not management*: the annotated, publishable map
    is the differentiator and it is already built.
  - **The engine claim is a QUALIFICATION, not a headline** (Tom, 2026-08-09, overruling a broader
    version of this task): for some agencies "does it run the actual EPANET engine?" is a yes/no gate
    that decides whether we are evaluated at all. Say it prominently and make it checkable; just do
    not spend the blog/video headline on it. Do not relitigate.
  - **Mobile is demoted and does not appear in a headline, tagline, or list of reasons** (Tom,
    2026-08-14: *"phone is a dead end… I don't want to tout it"*). We keep caring — the touch-trap
    cap stays, phone regressions are still bugs — but the claim is not made.




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

- 40|257|[H] **[HUMAN] Find or build the example PROJECTS (plural) for lpn.** **Reassigned to Tom,
  2026-08-11, at his own request: *"Let's change this task to a human assignment to create or find
  some EPANET examples."*** What is wanted is the CHOICE of networks — which ones teach something,
  which ones look like the work our users do — and that is a judgement call, not a build. Handing
  over the files is enough; the wiring is a small job once they exist.
  - Original framing, kept because it still holds. Tom, 2026-08-09, while Task 254 was in flight:
    *"some example projects would also be nice, but that's another task for another day, and I
    suppose it's up to me to prepare those. Maybe I can get something from EPANET, I hope."* He then
    found the source: <https://github.com/OpenWaterAnalytics/EPANET/tree/dev/example-networks>.
  - **Distinct from Task 254**, which is the one-click *drawing* example a first-time visitor makes
    from an empty canvas. This is a LIBRARY of openable projects — Net1/Net2/Net3 and friends —
    which is a Projects/tabs feature, not a toolbar button.
  - **THE BLOCKER IS GONE (Task 196, 2026-08-11).** This used to say "we deliberately have no
    `.inp` importer" and asked whether to bake examples into our own JSON or build a real reader.
    Option (b) happened: File > Import EPANET file (.inp) ships, and it has been run over EPA's
    Net1/Net2/Net3 and three real production models. So an example project is now literally an
    `.inp` file we choose, import, and save — no converter, no decision left.
  - **Net1/Net2/Net3 import but do not solve as themselves**, because all three are built on TANKS,
    which this page cuts. They are a poor first choice for that reason, not a good one. A network
    with reservoirs, pipes and a pump is what shows this calculator doing its job.
  - **We already have Net1/Net2/Net3 in the repo** as `dev/lpn-spike/reference/` fixtures, so the
    first example costs no download and no network access.
  - **Licensing is clean** — OWA-EPANET is MIT, so its example networks can ship under GPL v3+.
  - **Backdrops, 2026-08-11.** Tom first supplied three `.wmf` files; **a browser cannot display
    WMF at all**, so those still need converting to SVG or PNG (Inkscape opens a `.wmf` and saves
    SVG directly). He then found the missing `utility-map-estrellas.bmp`, and **BMP is a format
    browsers do read**, so the Estrellas model is the one that can be shown on its own backdrop
    today, start to finish — and that makes it the natural first example project.
    - **His colleague appears to have moved from WMF to BMP, which is good news for us**: it makes
      every future model he collects usable without a conversion step.
    - **BMP arrives ENORMOUS, and that is now handled** — the one he sent is 640 x 782 and 1.5 MB,
      because BMP is uncompressed. `downscaleImage()` used to pass an under-cap image through
      untouched, so it would have gone into localStorage as a ~1.96 MB data URI out of a ~5 MB
      budget; it now re-encodes and keeps whichever is smaller, which makes that picture ~67 KB.
    - Still loose: `20069-WP-Backdrop.wmf` matches none of the three models' `[BACKDROP] FILE`
      paths, so it appears to belong to a fourth model we do not have.
  - **These are ANALYSIS networks and this suite is a DESIGN tool.** They will make the map look
    serious, but do not let them quietly redefine what the calculator is for.

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


- 35|248| **What the EPANET toggle actually unlocks: tanks, valves, extended-period simulation.**
  Task 243 shipped the engine and the toggle. The engine makes each of these a mapping-and-UI job
  rather than a numerical one, which is the entire reason it was worth vendoring.

  **PHASE 2, VALVES: DONE 2026-08-14.** Five EPANET valve types, and the phase turned on a
  decision that Task 313 had made the day before rather than on any numerics of our own.
  - **TCV works in BOTH engines and cost no numerics.** A throttle valve is a minor loss on a
    zero-length link, which `js/lpn-solver.js` already computed for every pipe. `EngCalcs.lpnLinkK`
    is the one place that says a TCV's loss is its SETTING and not its `k` — EPANET ignores the
    [VALVES] minor-loss column for a TCV, measured 2026-08-11, so the page offers no `k` box on one.
  - **PRV / PSV / FCV solve through EPANET ONLY, and that is a measurement, not a shortfall.**
    Their status is re-decided inside the iteration; writing that a second time would have been
    slower code (Task 313: EPANET 0.05 ms against our 0.43 ms at 21 nodes) for a solved problem.
  - **A network holding one is ROUTED to EPANET automatically, and the status bar says so.** The
    stored `engine` setting is NOT rewritten — the setting is a preference, the routing is a fact
    about this network, so deleting the valve puts the page straight back on the chosen engine.
    Silent routing was the alternative and was rejected: a user who ticked "built-in solver" and
    got a different one has been lied to.
  - **Offline, the native engine refuses BY NAME.** `valve-needs-epanet` carries the valve ids into
    `lpn_diag_valve_needs_epanet`, which is the whole reason this page writes its own diagnostics
    instead of surfacing EPANET's numbered errors. A second diagnostic, `valve-on-fixed-head`,
    catches EPANET's own placement rule (input error 219) for BOTH engines, because it is a fact
    about the drawing rather than about who solves it.
  - **PBV and GPV are still substituted with a reported open pipe.** A GPV's behaviour is a
    head-loss CURVE and a PBV's a fixed pressure drop, and this page has no element for either.
    Offering a GPV in the type list with nowhere to enter its curve would be a control that does
    nothing.
  - **THE SETTING IS THE TRAP, and it is narrower and sharper than the tank diameter was.** A
    valve's setting is a PRESSURE (PRV/PSV), a FLOW (FCV) or a bare LOSS COEFFICIENT (TCV) — three
    quantities in one column — while its DIAMETER follows the PIPE convention (millimetres), the
    opposite of the tank diameter three sections earlier in the same file. `valve-harness.js` was
    mutation-tested against four deliberate breaks and **corrected its own premise**: the diameter
    turns out to be visible to `validate_epanet.js` after all (a TCV's loss is k V²/2g, so velocity
    carries it), but an ACTIVE valve's setting is invisible to every engine comparison there can
    be — those types never reach the comparison, because the native solver refuses them by design.
  - `lpn_notes_2_def` no longer says control valves are unmodelled; it says which engine works them
    out. 20 English keys are new or edited and need a translation sprint.
  - **THE MERGE INTO TASK 313 WAS BROKEN, AND ONLY THE MERGED TREE COULD SHOW IT.** Valves and the
    persistent EPANET session were built in separate worktrees the same afternoon; each was green in
    its own. Together, `pushValues()` had no valve case, so a valve fell through to the pipe branch —
    where `setPipeData()` is not valid on a valve index — and the setting was never pushed at all.
    - **The ORDER inside the fix is load-bearing and is the durable finding. A valve has THREE
      states in EPANET, not two:** closed, fully open, and ACTIVE. Writing `EN_INITSTATUS = OPEN`
      puts it fully open with its setting IGNORED, because "open" means something different for a
      valve than for a pipe, where it only means not closed; `EN_INITSETTING` is what restores
      active. So status is written BEFORE setting, and the shared status line skips valves. Written
      the other way the network solved with the valve wide open: **exactly one k V²/2g of missing
      head, 0.271 m, with flows still agreeing to 2e-10 m³/s** — a plausible number in a plausible
      place.
    - `signatureOf()` also had to learn `valveType`: EPANET fixes a link's type when the file is
      read, and the setting means a different quantity per type, so a retype must reopen.
    - `session-harness.js` gained a setting edit, a retype and a closure. The closure needed a
      network that SURVIVES it — the shared TCV case is a series run, so closing the valve isolates
      the demand and tests the diagnostic instead of the push.
    - **This is the whole case for the merge rule in CLAUDE.md**: a check that passed in two
      worktrees separately has not been run on the thing that ships.

  **PHASE 1, TANKS: DONE 2026-08-14.** A third node type, in both engines, in the `.inp` reader and
  writer, on the map, in the popup and in the settings. Phase 3 (extended-period) is still open, so
  the gate on Tasks 306/307 has NOT cleared.
  - **A tank is a fixed head at its water surface, and that is not a simplification** — it is what
    EPANET solves at t = 0 of an extended-period run, before it integrates any level forward.
    `EngCalcs.lpnIsFixedHead` is the one place the equivalence with a reservoir is declared; the
    difference between the two types is entirely about what happens NEXT, which is phase 3.
    `cases.tankCase` runs both engines over a two-tank network and they agree to 1.1e-5 m.
  - **The bigger payoff was the IMPORTER, and it was not the reason the phase was scoped.** Until
    now `.inp` import dropped every tank *and every link touching one* — honest handling of a
    missing element, but it meant a municipal model arrived missing whole branches, and tanks are in
    the majority of real models. EPA's own Net1/Net2/Net3 all have them.
  - **THE DIAMETER IS THE TRAP AND NO SOLVE CAN SEE IT.** In an `.inp` a PIPE diameter is in
    millimetres and a TANK diameter is in metres — same word, two units, three sections apart in one
    file. Writing `diameter * 1000` on purpose leaves `validate_epanet.js` green to the last digit,
    because a steady-state solve never reads a tank diameter. `dev/lpn-spike/tank-harness.js` exists
    for exactly that class and round-trips the text; it was mutation-tested against that break
    before being trusted. Do not let `cases.tankCase` stand in for it.
  - **Text's ID letter moved from `T` to `X`** so EPANET's tanks can be T1, T2. A text element's ID
    is unreachable from every screen, so nothing a user can see changed; old documents are not
    migrated and do not need to be, because `mintId()` now refuses to reissue an id that is taken.
  - `lpn_notes_1_def` says out loud that a tank is held at its level and neither runs down nor
    fills. A tank that never empties is not a tank anybody has met, so leaving that unsaid would
    have been the dishonest part of shipping this phase.

  **RAISED 20 → 60 on 2026-08-14, and it is now a GATE, not just a feature.** Tom's ruling is that
  the LibreEPANET.org launch (Tasks 306 and 307) waits until these three ship: they are exactly what
  Task 296 relied on when it refused *"web clone of EPANET"*, so they are the whole of the honesty
  case for the name. **Nothing else is missing** — there is no node-count limit and the gate must
  never be described as one (`dev/positioning.md` §6).

  **THEN LOWERED 60 → 35 THE SAME DAY, and the reversal is the instructive part.** Tom: *"I have got
  distracted… I erred in pushing LibreEPANET.org at the expense of scenarios."* The gate is still a
  gate — nothing about the honesty case changed — but **a gate on a launch nobody is waiting for is
  not urgent work.** Phase 1 (tanks) shipped; phases 2 and 3 continue behind Task 184. Read this
  pair of moves together the next time a positioning task and a user-facing one compete: the ruling
  that survived contact was the one with a named user behind it.

  Two things this does NOT mean:
  - **It is not a doubt about our right to the name.** Tom, 2026-08-14: *"we have no less technical
    authority to call ourselves EPANET, more moral authority, and all the legal authority since it's
    all public domain."* The gate is about sequencing only.
  - **The old "do NOT start until someone asks" instruction is retired by this raise.** Someone has
    now asked, and it is Tom. (Task 243's conclusion that the toggle was the cheap 90% and these are
    the expensive 10% remains true as a *cost* estimate — it is the priority that changed, not the
    arithmetic.)

- 1|306| **LibreEPANET.org: the rebranded site variant. BLOCKED on Task 248.** Tom bought
  the domain 2026-08-14; it 302-redirects to `Looped-Network.php?lang=en` until the gate clears.
  Rationale, the name ruling and the gate are in `dev/positioning.md` §6. Priority 1, not 0: 0 means
  completed and this is blocked. Tom's spec: EPANET engine on by default, a custom navbar without
  HawsEDC and the Hydraulics menu, no page title/description, Notes moved under More, and navbar +
  lpn menus + map filling the tab.
  **It is a VARIANT, not a fork — do not start by copying the page.** Costed 2026-08-14:
  - **The cheapest hosting answer avoids the path refactor entirely.** 112 hardcoded `/engcalcs/`
    paths, plus `sw.js` and `manifest.json` scoped there; a vhost with `Alias /engcalcs` at this
    directory and a rewrite of `/` to `Looped-Network.php` resolves every asset unchanged. Prefer
    that over an `EC_BASE` refactor. `echoHeader()`'s `"normal"` branch already gives a chrome-free
    header.
  - **`CANONICAL_ORIGIN` is hardcoded and must NOT be derived from `HTTP_HOST`.** A second domain
    needs a host → variant WHITELIST, or it reintroduces the canonical-poisoning hole that constant
    exists to prevent.
  - **Two consequences to ANSWER, not discover.** The 678 KB engine is lazily imported *because* it
    is off by default, so on-by-default makes every visit pay it — which cuts against the
    low-bandwidth case. And `lpn_settings_engine_epanet_tip` currently argues *against* EPANET, which
    on a LibreEPANET page is the page arguing with itself; it is translated into 26 languages, so it
    is a resync, not a free edit.
  - **A full-viewport map is a JS change** (`effectiveMapHeight()`, no CSS height rule exists), and
    its `innerHeight * 0.72` cap is load-bearing: `#lpn_canvas` has `touch-action:none`, so a canvas
    taller than the viewport swallows every touch. Answer that trap; do not delete the cap.
  - **Treat any parent-site dependency as this task's problem by default** — a different domain is
    exactly the condition that exposes them, as `/hawsedc.css` did in August 2026.

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

- 30|217| **A suite-owned, multilingual Manning's n table, built from primary sources.** Raised by
  Tom, 2026-08-05, and accepted as mid-priority with a caution: *"No collision, but I am not into
  ownership/maintenance. If there is any viable way to outsource, I prefer it. But if we can add
  multilingual value with an n table, I'm game. Let's just be careful and intentional."*
  - **The case.** `Manning-Pipe-Flow.php` and `Manning-Trap.php` both send the roughness input off
    site to `engineeringtoolbox.com/mannings-roughness-d_799.html` — English only, ours to lose, and
    on the two calculators that carry the great majority of our humans. Every one of those users
    needs an n value; it is the single most-needed reference in the suite. In 26 languages it is a
    genuine search front door rather than a leak, and it is content nobody else is publishing
    multilingually.
  - **Gate it on Task 216's number**, which is what that beacon exists to produce. Build the
    instrument first.
  - **The maintenance worry is the real design constraint, and it has an answer: freeze it.** An n
    table sourced from primary references (Chow 1959; USGS WSP 2339 / Arcement & Schneider; FHWA
    HDS-5) is *static data* — those values have not moved in decades and will not. Build it once,
    cite each row, and it needs no ongoing ownership. What creates maintenance is editorial
    ambition: photographs, user submissions, regional variants, a "suggest a value" form. Ship none
    of that.
  - **Translation cost is the honest cost**, not maintenance: a table of material names is a lot of
    short strings. Scope it against the Task 203 cross before committing — the core four (es, pt,
    fr, tr) plus identity strings may be the whole sensible first version.
  - **Careful about the citation boundary.** Reproducing a published table verbatim is a copyright
    question; a table of physical constants compiled from multiple cited primary sources is not.
    Compile and cite, do not copy one source's layout and selection.
  - **THE CURRENTLY LINKED TABLE IS THE COVERAGE BENCHMARK — Tom, 2026-08-05:** *"I would want to
    confirm that our table is similar to the one I selected long ago to link."* Right, and this is
    the acceptance criterion for the whole task, so do it FIRST rather than at review time. The
    `engineeringtoolbox.com/mannings-roughness-d_799.html` link was a deliberate editorial choice
    that has served users for years; it is the de facto spec for what a visitor arriving at this
    reference expects to find. Concretely:
    - **Match its COVERAGE**, material for material. A visitor who has clicked that link before and
      cannot find their material on ours has been given a worse page, however well cited ours is.
      Inventory it, and treat anything it covers that we do not as a gap to close or to justify.
    - **CROSS-CHECK the values, do not copy them.** These two obligations point in opposite
      directions and both must hold: same coverage (so users find their material), independent
      primary sourcing (so we are not reproducing someone's table). Compile ours from Chow / USGS /
      HDS-5, then compare against the linked table row by row.
    - **A DISAGREEMENT IS A FINDING, not a number to quietly overwrite.** Where our primary sources
      and the linked table differ, investigate and record which is right and why, in the task or in
      `dev/`. That divergence log is genuinely useful content — it is the kind of thing a careful
      engineer wants and neither table currently offers — and it is also the honest justification
      for publishing our own at all.
    - **If the tables come out essentially identical, that is a legitimate reason NOT to build it.**
      Say so out loud rather than proceeding on sunk scoping effort. The case for our own table rests
      on multilingual reach and on owning the reference, not on the existing one being wrong; if
      Task 216's beacon shows the non-English click volume is thin, identical content plus no reach
      argument means the honest answer is to keep the link.

- 30|218| **Find advisors and proteges — a standing, nagged commitment, not a task that completes.**
  Raised by Tom, 2026-08-05: *"I still need help knowing where to try to connect with advisors and
  proteges; this is not my strength. r/civilengineering is mostly frivolous talk."* He is right about
  the subreddit — it is a venting-and-memes room and the people he wants are not posting there.
  - **Tom's explicit standing instruction, 2026-08-05:** *"This is not my strength or passion. I'll
    want you to hold my hand and push me to 'eat my veggies.' I may have to get in my car and go to
    lunch. I will need pushing."* **So the nagging is authorized and requested.** Whoever picks up
    this roadmap should raise this item unprompted when it has gone quiet, propose ONE concrete next
    action with a name and a date attached, and not accept a vague "sometime". A generic "you should
    network more" is worthless; "email this chapter's faculty advisor this week" is the unit of work.
  - **The pattern that works:** go where people are already doing the specific work these
    calculators serve, not where the profession socializes.
  - **ADVISORS AND PROTEGES ARE TWO DIFFERENT LISTS AND NO VENUE SERVES BOTH — Tom said plainly on
    2026-08-05 that he did not understand this item, and conflating the two is probably why.** An
    *advisor* here means someone with numerical/hydraulic depth who will answer a hard question six
    months from now; that is a peer relationship, earned by asking good technical questions in a
    developer community, and OWA is where it lives. A *protege* means someone learning to build
    tools like these, who needs a person willing to teach; that only ever comes from a room with
    students in it — EWB chapters, a classroom, a practitioner network. **Never plan one action
    hoping it produces both.** Every concrete next action proposed under this task must say which of
    the two it is aimed at.
  - **Set expectations honestly, or this item keeps disappointing.** A good OWA post yields two or
    three technically serious people who now know the project exists. It does not yield a mentor,
    and it will not yield a protege at all. That is still worth having — but "I posted and nothing
    happened" is the predictable failure mode if the expected return was never stated.
  - **For advisors (numerical / hydraulic depth):**
    - **Open Water Analytics** — the EPANET / WNTR open-source community. Highest-fit venue on this
      list: these are exactly the people who know why 4.727 vs 0.849 matters, and Task 213 gives a
      concrete, well-posed opening contribution to lead with rather than an introduction.
      **VERIFIED LIVE 2026-08-05, with the entry point corrected:** `OpenWaterAnalytics/EPANET` on
      GitHub is active (405 stars, 249 forks, 42 open issues, 4 open PRs, documented contribution
      path). The **old Discourse forum at `community.wateranalytics.org` no longer answers on
      HTTPS** (it times out entirely) and repo-level Discussions are **disabled**
      (`has_discussions: false`). The live venue is **org-level GitHub Discussions**,
      `https://github.com/orgs/OpenWaterAnalytics/discussions`, category **Q&A**. An earlier version
      of this task said "forum", and then "repo Discussions"; both were wrong.
      **A POST IS DRAFTED AND READY TO SEND: `dev/outreach-owa-post.md`** (2026-08-05), with the
      venue facts, the exact title and body, and what to do with a reply. Tom sends it; there is no
      account on this machine and no automated path, deliberately.
      **But temper the expectation — it is a QUIET room.** Org Discussions holds roughly eight
      threads in total. The codebase is active (last push 2026-07-23, 46 open issues, 405 stars) and
      the maintainers are real, but the discussion surface is not busy: a reply may take weeks or
      may never come, and **that is the expected case rather than a failure**. The activity is in
      Issues, where this question does not belong. So: worth one evening, not a substitute for the
      other venues, and **it must not block Task 213** — the EPANET source is public and readable if
      no answer arrives.
    - **ASCE EWRI** Hydraulics & Waterways technical committees, and the **Arizona Section** locally.
      Committee work is where senior people are actually reachable; conference floors are not.
    - **epanet-js's founding partners — Optimatics, Affinity Water, AtkinsRéalis. DEFERRED, not
      dropped** (Tom raised it 2026-08-14; recorded in `dev/positioning.md` §7). Each put $50,000
      into epanet-js.
      - **The honest angle, if ever taken:** not "switch to us" but a governance argument a funder
        can act on — they paid so that a free EPANET in the browser would *exist*, and a licence
        that cannot be revoked serves that goal more durably than one that is FSL today. A point
        about permanence, not about features.
      - **Why it waits, and why it ranks below everything above it:** they are sunk-cost sponsors of
        a competitor, so a cold approach is low-yield and risks reading as poaching — against the
        invitation-not-comparison rule. And we have nothing distinct to show them until the Task 248
        gate clears. **Revisit then, not before.**
  - **ACTION LOG.**
    - **2026-08-05 — OWA Q&A post SENT** (advisor side). Text and venue facts:
      `dev/outreach-owa-post.md`. Quiet room; silence is the expected case for weeks.
    - **2026-08-05 — EWB-ASU contact form SUBMITTED** (protege side), same day, at Tom's own
      insistence. Submission NOT confirmed — *"I think it's submitted. The form acts a little
      weird."* **CHECK: 2026-08-19.** If silent by then, the backstop is email, not a drive: **Jared
      Schoepf, `jjschoep@asu.edu`** — listed publicly in the Fulton Schools directory, and he
      directs **EPICS** (Engineering Projects in Community Service), a for-credit program of
      community-project student teams. That is a larger and more durable protege pool than one club,
      and a faculty contact persists across years while student officers turn over every May.
      Tom offered to hand-deliver a folded note to the Student Services Building; **advised against**
      — a paper note to a student-org office is the likeliest of the three to be lost.
  - **For proteges, and for mission fit:**
    - **Engineers Without Borders USA student chapters** — the strongest single match. Students who
      need free tools, work in exactly the low-resource-language regions this suite translates for,
      and want mentoring. Chapters have faculty advisors, so one contact reaches a cohort per year.
    - **RWSN (Rural Water Supply Network)** and the **SuSanA forum** — large, active practitioner
      communities in rural water supply and sanitation, heavily non-English, doing gravity-fed pipe
      networks, canal seepage and well work. The calculator list reads like their daily problems.
    - **A guest lecture or evening section at ASU or Mesa CC.** Proteges self-identify in a classroom
      in a way they never do online.
  - **Verify each venue is still live before acting** — these were named from knowledge, not checked
    against the current web.
  - **The unglamorous prerequisite:** the best pool is the several thousand humans already using the
    suite, and until 2026-08-07 we could neither see nor reach any of them. Seeing them was
    **Task 206**, now shipped; reaching them is still this item's own problem, so it is no longer
    blocked — only unstarted.

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


- 4|114| **Reservoir / detention routing calculator (Modified Puls).** Re-scoped 2026-07-23 (Tom):
  the original "check-dam *spillway sizing*" framing collapsed — a spillway is a weir (`wfs_`/`wfi_`)
  plus rock lining (`rc_`) plus freeboard arithmetic, i.e. no new engine and largely subsumed by
  existing calculators. The genuinely distinct, in-authority calculator is **storage-indication
  (Modified Puls) reservoir routing** — a *time-stepping* engine, not a steady-state weir; time is
  the real departure from the weir/orifice calcs. Scope: (a) a **composite outlet** stage-discharge
  curve from **multiple orifices + weirs** (reuses `or_` and `wfs_` device equations, summed by
  stage); (b) a **stage-storage** curve (user input / simple geometry); (c) **Modified Puls routing**
  of an inflow hydrograph through it (build the 2S/Δt+O vs O curve once, table-lookup per step — no
  per-step iteration). **Inflow is a deliberate punt-ladder, NOT rainfall-runoff:** user-table (bring
  your own hydrograph), SCS dimensionless UH, and SCS triangular — the synthetic options are *shape
  generators from a user-supplied peak Qp and time-to-peak Tp*, so the tool never does hydrology.
  **Explicitly NO curve number / rainfall / area / runoff-volume** — CN is rainfall→runoff-volume,
  the punted hydrology; the SCS input set is exactly **{Qpeak, Tp, peak-factor shape}** — two numbers
  that scale the dimensionless UH plus a shape selector. **Take Tp (time-to-peak) or lag directly, not
  Tc** — the Tc→Tp conversion embeds its own SCS assumption (Tp≈0.67·Tc) a user could swallow
  unknowingly; taking Tp keeps the tool a pure shape-scaler. **Plot inflow AND routed outflow, plus each outlet
  component's own hydrograph** — layers: inflow · total routed outflow · per-device discharge (each
  orifice, each weir), all **checkbox-toggleable** (same toggle-layers UX as Task 137's sketch). Shows
  *when each device kicks in* (e.g. the emergency weir waking up as stage tops its crest); mark peak
  attenuation, ideally max stage. For a router the hydrograph plot *is* the primary result, distinct
  from Task 137's topology-only sanity sketch.
  **Hydrology is explicitly out of scope** — computing the design peak (Rational Method, TR-55,
  PMP/PMF, regional regression, StreamStats) is truly hard, empirical, and regional; the user brings
  Qp/Tc, the same boundary Tom has deliberately kept for his whole career (he has intentionally never
  shipped a Rational Method calc). This is a clean modular boundary, not a flaw. **Inflow philosophy
  (Tom, 2026-07-23): prefer "bring-your-own-*flood*" over "bring-your-own-*peak*."** Routing is
  governed by flood *volume and duration*, not peak — so the user-table (full hydrograph) is the
  *preferred* path, and the synthetic peak-based options get concise, non-pedantic guidance: a full
  hydrograph beats a peak; a synthesized one also fixes a duration/volume that must match the storm;
  and **test several durations** (critical-duration warning — the storm that drives the highest stage
  is often not the highest-peak storm). SCS may well be the global default (used widely incl. India),
  but its US-calibrated **peak factor 484** / Type II rainfall are not region-neutral — **expose the
  peak factor** with a one-line note so arid/flat (≈300) or steep (≈600) watersheds adjust. The
  design principle that resolves Tom's career-long reluctance: **the tool holds no opinion about
  storms** — it routes the flood the local engineer brings and flags its own assumptions, so it never
  has to model Indian-monsoon or African-convective floods it has no intuition for. **Candidate
  peak-factor reference link** (for the SCS tip, English-only note per link+tip convention): Learn
  Hydrology Studio "NRCS Unit Hydrograph Peak Factors"
  (learn.hydrologystudio.com/hydrology-studio/knowledge-base/nrcs-unit-hydrograph-peak-factors/) as
  the readable primary, HEC-HMS Technical Reference "SCS Unit Hydrograph Model" (USACE) as the
  authoritative alternate; Wanielista et al. "Revisit of NRCS Unit Hydrograph Procedures" for spec-time
  depth on the 3/8–5/8 volume-split assumption behind PRF 484. **Audience is broader
  than the original NGO framing** — detention-pond/stormwater routing is mainstream civil practice;
  paid tools (HydroCAD, PondPack) dominate, honest free web routers are rare. **Daunting (Tom's word),
  bigger than Task 137 — do 137 first.** No internet mashup for hydrology. Candidate prefix
  `rr_`/`route_`/`cd_` — not yet claimed. Full spec: TBD when Tom is ready.

**Candidates backlog — researched, deprioritized (well-served, no clear gap found):**
- **Chlorination dosing for small/community water systems** — well-served; multiple free calculators
  exist, including one CAWST itself publishes ("Chlorine Dose Calculator: Batch Chlorination," tied
  to the Modified Horrocks Test) — the sector's own reference org already ships this.
- **Pond/reservoir evaporation loss** — saturated; 6+ free calculators found, several using the
  FAO-56 Penman-Monteith standard. Demand is real but generic (farms/pools broadly), not specifically
  low-resource/humanitarian.

## Energy for Water

Tom, 2026-07-14: "I have lifelong focus on water and energy development for humanity... we can dip
our toe into energy (including heat), which is a strong interest of mine (instead of, say,
structural)." Tom is a civil engineer — this is not scope creep from the hydraulic-calculator
identity, it's a second, equally central professional focus, so it gets its own section rather than
being folded into "New Calculators" as stretch/candidate material. The suite already has one
foundational calculator here: `mhp_` (Micro-Hydro Power) — everything below either extends that
anchor or opens the *consumption* side (using energy to move/treat/purify water) rather than only
the *generation* side `mhp_` already covers. Same 4-axis prioritization framework as the New
Calculators section above; see that section's header for the methodology and honest-caveat note.

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
- 1|118| **Solar water pasteurization / SODIS exposure calculator.** Two closely related low-cost
  heat/UV water-treatment methods — SODIS (WHO/EAWAG-endorsed: clear PET bottles, 6 hr sunny/2 days
  cloudy exposure, <30 NTU turbidity ceiling) and solar pasteurization (heat to the WAPI 65°C
  threshold via solar cooker/collector, `Q = mcΔT` + collector efficiency). **Research finding,
  2026-07-14, downgraded from the original proposal**: a real availability gap exists (no public
  calculator tool found, only academic models and the standard rule-of-thumb from SKAT/EAWAG
  manuals) — but the value-add of building a calculator is thin, because field workers already solve
  this with the simple heuristic itself; a calculator risks over-engineering a problem that doesn't
  need one. Kept on the roadmap rather than cut, since the underlying mission fit (safe drinking
  water via heat) is exactly Tom's stated interest — but if built, it needs to add real value beyond
  the rule of thumb (e.g. genuinely combining site-specific insolation/cloud-cover/turbidity into a
  more precise output) to be worth the build. **Safety-critical numeric defaults**: turbidity
  threshold, exposure-time table, and collector-efficiency values must cite actual WHO/EAWAG/CAWST
  primary sources before shipping, not placeholders — a wrong default could tell someone unsafe water
  is safe. Candidate prefix `swt_`.

**Candidates backlog — researched, deprioritized (well-served or weak adoption):**
- **Biogas digester sizing** — well-served; 7+ free calculators found, several specifically for the
  small/household fixed-dome design common in low-resource deployments (KENPRO, ITCPH).
- **Solar still (basin-type) sizing** — a real gap exists (no calculator found), but weak real-world
  adoption signal: search surfaces mostly 1970s–80s IRC/Practical Action literature, suggesting this
  is a legacy/niche technology rather than an active field practice; production rates (liters/day per
  m²) are low compared to SODIS/biosand filtration.

**Candidates backlog — not yet researched:**
- **Passive/evaporative cooling calculator** — direct answer to Tom's original "shading/temperature
  management" framing; evaporative cooling is inherently a water-consuming thermal process, so it
  belongs in this section rather than as a stretch off the water-conveyance identity. Not yet run
  through the 4-axis research pass.

## Discoverability (Search Reach)

- 60|269| **ASU Engineers Without Borders answered, and asked to meet.** Tom, 2026-08-10 — a human
  reply to outreach, and he has replied gratefully. This is the first real conversation this suite's
  mission has earned; prepare for the meeting and record what comes of it. Not a search-reach task,
  but it lives here because it is the same goal reached by a better road.

Evidence base for this whole section: the 2026-07-27 Google Search Console export (`dev/Queries.csv`,
999 queries, 5,621 impressions, 565 clicks — a temporary file, not committed; the numbers below are
the durable record). Aggregate by cluster:

| Cluster | Queries | Impressions | Clicks | CTR |
|---|---|---|---|---|
| Manning | 196 | 1,468 | 366 | **25%** |
| Sewer / drainage | 188 | 1,007 | 11 | **1.1%** |
| Slope / grade / fall | 169 | 946 | 5 | **0.5%** |
| Hazen-Williams | 54 | 305 | 16 | 5% |
| Channel / trapezoid | 51 | 377 | 18 | 5% |
| Darcy / friction factor | 41 | 128 | 1 | 0.8% |
| Weir | 19 | 91 | 6 | 7% |
| Culvert | 11 | 66 | 2 | 3% |
| Peaking factor / Harmon | 11 | 62 | 1 | 1.6% |
| Orifice | 11 | 21 | 0 | 0% |

The headline: **Manning is won and needs nothing** (position 1, 25% CTR). The sewer-slope cluster is
comparable in size and converts at 1%. Two smaller findings worth keeping: 55 queries are
LLM-retrieval-shaped (`… source`, `… authoritative source`, `… engineering reference`, `… pdf`), all
circling one question — *is Manning valid for full/pressurized pipe, and is R = D/4?* — 118
impressions, zero clicks; and one query was `"kikokotoo" -site:reddit.com …`, the Swahili word taken
straight from `lib/lang.ec.sw.php`, i.e. an agent searching our own translated string.

- 10|155|[H] **Deploy and verify the Task 149 search-index fix — deployed, awaiting Search Console
  confirmation.** Extracted from 149 on close, 2026-07-28, rather than left as a to-do inside a
  closed block. **Steps 1–5 are done and verified live 2026-07-28; only step 6 is open, and it is a
  calendar wait rather than work** — which is why the priority dropped 50 → 10. Do not close this
  until step 6 actually reports, and do not re-verify 1–5 by hand: the evidence is recorded below.
  Status:
  1. ~~Upload `../sitemap.xml` to the site root~~ — **DONE 2026-07-28**, verified live: 200, 66 KB,
     543 `<loc>` entries, `sewslope.php` and `peakfact.php` both present. Regenerate with
     `php dev/scripts/generate_sitemap.php` whenever pages or languages change, then re-upload.
  2. ~~Add `Sitemap: https://hawsedc.com/sitemap.xml` to the live `robots.txt`~~ — **DONE
     2026-07-28**, verified live. (That file is at the site root and is **not** in the local `../`
     copy; it carries a long `Disallow:` list for `/hawsedc/phpGedView/` that a locally-rebuilt file
     would drop, so it must be edited in place.)
  3. ~~Submit the sitemap in Google Search Console~~ — **DONE 2026-07-28** (Tom).
  4. ~~Push the app code to production~~ — **DONE 2026-07-28** (commit `190c28f`, pulled on the
     server). Verified live across all 20 sitemap pages: every one returns 200 with 28 tags
     (27 languages + `x-default`) and a canonical matching the requested URL, no exceptions. Edge
     cases confirmed in production, not just locally: `?name=My Job 123` renders in the `<title>` but
     is stripped from the canonical, so bookmark labels mint no indexable variants; `?lang=zz`
     consolidates to `en`; `/engcalcs/index.php` collapses to `/engcalcs/`; a bare URL with
     `Accept-Language: ar` self-canonicalises to `?lang=ar` and renders `<html lang="ar" dir="rtl">`.
     **The reciprocity Google requires holds** — the `es` page lists `hreflang="es"` pointing at
     itself, and the `ar` page links back to `es`.
  5. ~~One canonical origin~~ — **DONE 2026-07-28.** Search Console reports on `https://hawsedc.com`,
     matching `CANONICAL_ORIGIN` in `lib/config.inc.php`, so no constant change was needed; Tom added
     a 301 at the parent-site root `.htaccess` (server-side, not in this repo). **The motive was not
     SEO** — the canonical tag already handles Google. It is that `lib/Language.lib.php` sets
     `ec_language`/`ec_blang` with `'secure' => true` and browsers reject `Secure` cookies over plain
     http, so with all four of http/https × www/non-www answering 200, **a visitor arriving on
     `http://` lost language persistence entirely** — picked Spanish, got English again next visit.
     That bug is now closed as a side effect: http visitors land on https before the app ever tries
     to set the cookie. Both hazards flagged beforehand were **resolved empirically rather than by
     reasoning**, and the evidence is worth keeping:
     - `https://hawsedc.com/…` returns **200, not a redirect** → `%{HTTPS}` is read correctly here
       and the host does *not* terminate SSL at a proxy, so no infinite loop. The
       `X-Forwarded-Proto` companion condition is belt-and-braces on this host, not load-bearing.
     - `http://` and `www` both redirect **into `/engcalcs/`** → `engcalcs/.htaccess` does **not**
       shadow the parent rewrite. That is the confirmation the rule about subdirectory `.htaccess`
       overriding a parent's mod_rewrite only when it defines rewrite directives of its own; the
       engcalcs file has only `Redirect 301` (mod_alias) and `FilesMatch`, and the parent rule
       reaches through. **Anyone adding a `RewriteRule` to `engcalcs/.htaccess` later will silently
       break the origin 301 for every calculator** — add `RewriteOptions inherit` there if that day
       comes.
     - The double fault (`http://www.…`) resolves in **one hop**, and `?lang=es&name=Job+7` survives
       intact. Site root, `sewslope.php` and `robots.txt` redirect too, so the parent site is
       covered, not only the calculators.
     HSTS deliberately **not** bundled in: browsers cache the policy for its full max-age and it
     cannot be recalled. A separate, deliberate decision if ever wanted.
  6. **CHECK: 2026-09-01.** (Date set 2026-08-05 at Tom's request — five weeks after the 2026-07-28
     deploy, which is inside Google's usual window for a sitemap plus hreflang change to show. If it
     is still ambiguous then, re-date it rather than closing it.)
     **Remaining — verify in Search Console, no sooner than a few weeks out.** This is the only open
     step and it is a wait, not work: `site:hawsedc.com inurl:lang=es` should start returning
     results, and the Task 149 diagnostic query `calculo de canales trapezoidal online` (position
     2.8, 0% CTR) should begin converting. That query is the cleanest single tell, because it already
     ranks — only the snippet language was wrong. **If it does not move**, the next suspects are
     Google's own hreflang report in Search Console (it names reciprocity failures explicitly) and
     whether the `?lang=xx` URLs are being indexed at all versus indexed-and-not-ranked; those are
     different problems with different fixes, so read the report before assuming either.
  **Task 150 (meta descriptions) is unblocked by this.** It was sequenced behind 149 on the reasoning
  that descriptions on unindexed URLs buy nothing; the URLs are no longer unindexed.

- 12|158| **`sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.**
  Extracted from Task 151 on close, 2026-07-28 — the one part of that task deliberately left undone.
  The query export shows real non-English demand for exactly the content `sewslope.php` already has:
  `pendiente mínima tubería pvc sanitaria`, `kanalizasyon eğim tablosu`, `tabela de inclinação de
  esgoto`. **Task 151 half-mitigated this** by adding mm diameters and mm/m + percent slope columns:
  a metric engineer in any language can now read the *numbers*, which is most of what a lookup table
  is for. What remains untranslated is the prose (introduction, cleansing-velocity basis, headings).
  **This is a different project from the engcalcs translation pipeline, which is why it was not done
  inline.** These are parent-site pages: no `$ec_lang`, no language switcher, no payload generator,
  no drift tripwire — none of the machinery a sprint depends on. Decide the shape *first*, and the
  cheap options are real ones: three static translated copies (es/tr/pt, matching the observed
  demand) may beat building any language infrastructure for two documents.
  **Do not assume this is worth doing** — verify the demand is still there and weigh it against
  Task 151's finding that these queries already *rank*; the CTR problem may be snippet quality (now
  fixed) rather than language.

## Translation Standardization (Glossary Project)

## Translation improvements

## AI Efficiency Scripting (Overhead)

These tasks reduce the AI token cost of routine maintenance by replacing repeated AI judgment with deterministic scripts. Copilot owns execution (all tagged `[CP]`); Claude Code specs any script whose output feeds back into translation quality work.

## CSS Standardization Follow-up

## Low Priority / Nice-to-Have

## New Calculators (Mission Expansion)

No candidate is open. **Score any new candidate on four axes before proposing it** (Tom,
2026-07-14): availability (a genuine gap raises priority, a saturated market lowers it even for
strong mission fit), technology emergence, field/NGO demand, and real search evidence. A 2026-07-14
research pass overturned intuitions in both directions — rainwater harvesting was saturated, while
VIP latrine sizing, handpump selection and check dams were genuine gaps. Every "no calculator found"
verdict is a web-search signal, not a verified global negative.

## Completed

**Closed tasks live in `dev/roadmap-closed-archive.md`**, one summary block each, newest first — 308
of them as of 2026-08-16. This file holds only open work. `roadmap_id_check.php` reads both: an ID is
unique across the pair, and priority 0 means the block is in the archive and nowhere else.
