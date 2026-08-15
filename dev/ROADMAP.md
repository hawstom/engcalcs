# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" — and *only* that, so a blocked or parked task keeps a real priority, however low, and a task set to 0 moves under `## Completed` in the same edit (`php dev/scripts/roadmap_id_check.php` enforces both directions). 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N". A task that is one of several concrete sub-items under a single parent task may instead use a dotted ID, `parent.nn` (e.g. `146.01`) — introduced 2026-07-29 for Task 146's backlog — but it is still a full `Priority|ID|status` bullet like any other task, just grouped under its parent by ID rather than living inside the parent's prose.

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

**`CHECK: YYYY-MM-DD` marks a task waiting on the calendar rather than on work** (Task 155's Search Console wait; Task 202's `zh` n=30). Tom asked 2026-08-05 whether dated tasks should always be priority 100. **No, and the date must never promote the task.** A `CHECK:` date is a **gate, not a deadline**: before it, the work is impossible (attempting it yields nothing); after it, the task simply becomes doable **at whatever priority it already had**. So Task 155 stays at 10 forever if a Search Console look is worth 10 — an arrived date means "you may now do this", never "do this next". *(CC's first draft of this paragraph said to raise the priority when the date arrives. That was wrong, and it smuggled promotion back in after arguing against it; Tom caught it: "Use the real priority, and don't let the date promote it." That is the rule.)* The one genuine exception is a task whose **value decays** — evidence that expires, a real external deadline. That is a change in worth, so change the priority and say why; it is not the date doing the work.

## NEXT SESSION (updated 2026-08-15, and Tom works one arrow per `/clear`)

**The 2026-08-15 batch has LANDED — Tasks 334, 332, 330, 340, 329, 349 and 350 are closed.**
Aligned pipe labels now ship ON by Tom's verdict, long pipes repeat their label, and a Text label
can be pinned with "Always show". Nothing in that batch is waiting on code.

**The next arrow is a TRANSLATION SPRINT**, covering the whole labels era in one pass. The delta as
of 2026-08-15 is **50 keys per language** (45 new, 5 whose English changed), all `lpn`, in all 26
languages. Pre-sprint order is in CLAUDE.md: Wave 0 adversarial English pass →
`friction_check.php` → `gloss_ref_check.php` → regenerate payloads → propose to Tom → launch.
`$ec_lang_syn` entries are proposed as a diff and approved in that session, not before. Note the
harness concurrency cap: 26 agents means 20 at once and 6 as slots free.

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

- 15|294|[H] **Decide the 7 remaining dead language keys, one each.** `menu_main_list`,
  `menu_main_language`, `mi_d50in`, `mpf_spreadheet_notice` (key name is misspelled too),
  `wi_save_and_calculate`, `or_shape`, `contact_title` — rendered by nothing, 27 translated strings
  apiece. Each is either lost content to restore (as Task 290's six Rock Chute notes turned out to
  be) or debt to delete; only Tom can say which. Recorded so far only inside closed Task 290, where
  nothing re-scans it.


- 55|233| **Manning-Irregular opens in metric on English pages, and greets everyone with a warning.
  One root cause, found 2026-08-08.** `js/manning-irregular.js:184` seeds a hard-coded cookie:
  `'i:,i:,i:1,s:1,i:0.001,s:1,s:1,...'`. Each `s:<n>` sets a select **by its conversion factor**,
  and `1` is always the SI option — so the seed forces every unit select to metric, overwriting the
  US units PHP already rendered correctly. Verified: server-side the page renders `ft`, `cfs`,
  `ft/sec`; in a browser it shows `m`, `m³/s`, `m/s`. It is the only page in the suite that hard-codes
  select values this way.
  Two visible symptoms, both from that line:
  - **Wrong unit system.** Every other calculator opens in US for `en`; this one opens in SI.
  - **Opens on a ⚠ Low velocity warning**, because the seeded section (`0,1 / 10,0.9 / …`, a ~30-unit
    wide, 1-unit deep channel at s=0.001, n=0.03) is metric-scaled. CLAUDE.md is explicit that a page
    greeting a first-time visitor with a warning is worse than one greeting them with a worked
    example.
  **Fix is per-preset seeding keyed off `EngCalcs.defaultUnitSet`** — the exact case the unit-families
  doc warns about ("hard-coded metric seeds read under `us` produced a 100-inch pipe"). Needs the
  positional cookie columns mapped to their selects, US geometry chosen, and both presets checked to
  open on a *passing* design. **Not a quick fix — do not guess the column order.**
  `dev/browser-pass/` can verify it: drive the page in both presets and read `v_check`.

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
- 50|207| **The dilettante path: make replying cost one tap, not five steps.** Scoped with Tom
  2026-08-03, after Task 205 optimized the invitation's wording and placement twice and neither
  addressed the actual constraint. Tom's framing: *"Cost and fun of reaching out; harnessing
  dilettantism, the Wikipedia secret."*

  **The problem, stated as arithmetic.** ~4,042 confirmed-human views in the 2026-07-27 snapshot;
  a few dozen contacts in 15 years — order 0.01%, which is *normal* for an unsolicited "contact us"
  link (the band is roughly 1-in-1,000 to 1-in-10,000). Nothing is broken. That is the point: the
  current rate is what a link-to-a-form *structurally* produces, so no amount of rewording moves it.
  Today's path is click → new page → form → compose → send, and each step sheds most of who is left.
  "I think that word is wrong in Khmer" does not survive five steps. **The lever is the cost of
  replying, not the visibility of the request.**

  **The Wikipedia lesson, precisely.** Wikipedia is not written by committed experts; it is written
  by uncommitted passers-by who fixed one thing. Three mechanisms make that work, and all three are
  portable here:
  1. **The action is available at the point of noticing.** The `edit` link sits beside the sentence
     you are reading — the gap between "that's wrong" and "I can fix it" is zero. Our invitation sits
     at the page bottom; the noticing happens at a *specific label*.
  2. **The unit of contribution is tiny and bounded.** One word. "Feedback" is unbounded and demands
     that the visitor compose an opinion; "Is this word right in your language?" is answerable in one
     tap by someone with no engineering background at all.
  3. **No gate.** No account, no credentials, no proof you are qualified. Dilettantism is *harnessed*
     rather than filtered — which is the whole idea, because the person best placed to catch a bad
     Khmer label is a Khmer speaker who is not necessarily an engineer.

  **Design: a cost ladder, where every rung is optional and the first rung is free.**
  - **Rung 0 — one tap, no text.** A small marker on a label ("this reads wrong") that posts only
    context: page, language, key name, unit set. Zero composition. This is the true floor and the
    rung most people will ever use. Even at Rung 0 the signal is real: three taps on the same key in
    the same language is a defect report, and it is *machine-aggregatable* in a way prose never is.
  - **Rung 1 — one line, inline.** A single textarea plus optional email, submitted without leaving
    the page. Pre-fill the context server-side so the human writes only the delta.
  - **Rung 2 — the existing `contact.php` form**, unchanged, for anyone with more to say.
  Nobody is ever asked to climb; each rung offers the next.

  **Why this is the highest-value ask we have.** Our single largest standing quality risk is
  translation defects in languages nobody on this project speaks. `lib/Language.Settings.php` already
  encodes our own honest confidence per language (0.65 for the low-resource tier, 0.85 AI-checked,
  0.95 native-reviewed). Rung 0 is the *only realistic mechanism that has ever been proposed* for
  moving a language from 0.65 to 0.95, because it is the only one whose cost is low enough for a
  passer-by to pay. Per the standing rule, native review is real only when feedback actually lands —
  this is the instrument that could make it land. Consider asking slightly more insistently on
  low-QUALITY languages; that targeting is honest, because it is precisely where we are least sure.

  **The honesty boundary — non-negotiable, and it is also what works.** Tom asked for "deep psyops
  guidance! For love!", and the two halves of that are compatible only in one direction. Legitimate:
  reducing cost, removing gates, asking at the point of noticing, thanking warmly and instantly,
  showing that a suggestion actually changed the page. Off the table: manufactured urgency, guilt,
  fake counters ("14 people helped this week" if untrue), obstruction, anything that must be
  dismissed to proceed, or a thank-you that implies a reply that will not come. Beyond being
  incompatible with the mission, manipulation fails on the merits here: this audience is small,
  expert, and returning, and a person who feels handled does not come back. **Warmth and low cost are
  the entire technique.** See also Task 205's rejection of the dismiss affordance for the same reason.

  **Reinforcement is the half everyone forgets.** Wikipedia's edit appears *instantly* — the
  contributor sees their effect. We cannot do that, but we can do the two things that matter:
  (a) an immediate, specific thank-you **in the contributor's own language** (not a generic success
  page — `formmailsuccess.php` today is neither specific nor translated); and (b) a public,
  dated changelog crediting anonymous suggestions ("a reader in Bengali corrected this label"). "Your
  suggestion changed this page" is the strongest possible reinforcement and costs one markdown file.

  **Spam, honestly.** A zero-cost form invites bots — and note what the 15-year record actually
  shows: the old challenge test kept the form spam-free *completely*, which is evidence it worked,
  and therefore evidence it was also taxing humans. Now that it is removed, **spam should be expected
  to start arriving; watch for it, because either outcome is informative** (spam ⇒ the filter was
  doing real work; continued silence ⇒ the form was simply invisible to bots and the filter was never
  the constraint). The replacement must put the cost on bots, never on humans: an invisible honeypot
  field, a minimum time-on-page, per-IP rate limiting, and — importantly — **do not send mail on
  submit.** Append to a log file in the `log-human-view.php` beacon pattern and let review be a poll,
  which makes a spam flood a file to ignore rather than an inbox to clean.

  **Implementation notes specific to this codebase.**
  - Reuse the existing beacon pattern (`log-human-view.php`, `navigator.sendBeacon`, POST, sanitized
    fields, no database). Rung 0 is nearly that file with two more fields.
  - **Keep the new string count tiny — 3 or 4 — because every string costs ×26.** This is a real
    design constraint and it argues *for* Rung 0 over prose: a tap target needs almost no words.
  - Attach Rung 0 to the existing `.ec-help`/`.ec-tip` label infrastructure rather than inventing a
    parallel one; those wrappers already mark exactly the labels worth commenting on.
  - **The suite is an offline PWA (`sw.js`).** A submission made offline must queue and send later
    (service-worker background sync) or it is silently lost — and field users in low-resource regions,
    the people this most needs to hear from, are the likeliest to be offline.
  - Collect the minimum: no IP stored beyond transient rate limiting, email optional and only for a
    reply. Say plainly what is collected; a form that asks for trust must deserve it.

  **Idea seeds for the "warm and welcoming" surface (Tom, 2026-08-03), not yet designed:**
  - **Polls.** A one-tap question is Rung 0's mechanics pointed at something we actually want to
    know ("Which calculator should exist next?", "Do you work in metric or US units?", "Is this word
    right in your language?"). Cheapest possible connection: it costs the reader one tap, it gives us
    a real number, and — the part that matters — it is an *invitation to have an opinion*, which
    reads as being asked rather than being solicited. Publishing the running result closes the loop
    and makes the next tap more likely.
  - **Intentional mistakes — REJECTED, decided 2026-08-03, do not re-propose.** The known growth
    trick of planting a visible error to bait corrections ("someone is wrong on the internet" is the
    most reliable engagement engine there is) is off the table here, permanently, and Tom ruled it
    out himself in the same breath as raising it. Two independent reasons: (1) it is deception, and a
    project whose stated purpose is to tell people they are loved cannot get there by tricking them;
    (2) unlike a wiki article, these outputs size real infrastructure — a planted wrong number can
    reach a channel, a pipe, or a chute that someone builds and someone else stands in. There is no
    version of this that is safe here. Recorded so it is not rediscovered as a clever idea later.
  - **Other warm surfaces worth designing later:** a visible "what changed because a reader wrote in"
    log (see reinforcement above); an honest, dated "who uses this" note; a first-visit greeting in
    the reader's own language that asks for nothing at all (`template_welcome` already does this and
    is the tonal model for everything in this task).

  **Was gated on Task 206, which shipped 2026-08-07 — the gate is now a waiting period, not a build
  step.** Do not build this blind. Without contact-funnel logging there was no way to tell whether
  Rung 0 worked, and this task's entire premise — that cost, not visibility, is the constraint — is
  a hypothesis that deserves a measurement rather than another two rounds of rewording. The
  instrument exists and starts at zero on 2026-08-07: read the "Contact funnel" section of
  `log/lang-log-stats.sh` once both counts are out of single digits, and let the clicks-vs-sends
  split pick which lever this task pulls.
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
- 20|321| **`formmail.php` reads five `$_POST` keys with no `isset()`.** `name`, `email`, `subject`,
  `message`, `more_message`. Under PHP 8 a bare POST emits *Undefined array key* warnings, and with
  `display_errors` on anywhere they land in the response body. The header-injection guards on
  name/email/subject are present and correct, so this is hygiene rather than a hole — but it is the
  site's only mail path.

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

- 45|286|[H] **EU cookie/ePrivacy compliance, and a privacy page this site does not have.** Tom,
  2026-08-11: *"That is looming over us. I don't know what triggers it, but probably we are already
  outlaws. That's my guess."* Half of that is answerable from the code, and it is:
  **`dev/cookie-storage-inventory.md`** — every cookie, every `localStorage` key, every server log,
  what each is for, and which ones fail the test. Read it before scoping anything here.
  - **PHASE 1 SHIPPED 2026-08-12. The inventory's new §6 is the record; this block keeps only what
    a future reader needs that the code does not say.**
    - **Lazy sessions were the work, not the banner.** `lib/base.inc.php` had `session_start()` at
      the top of every page load, ABOVE the config require — so `PHPSESSID` was written before
      anything could have asked anything, and no banner could have fixed that from the outside.
      `ecSessionStart()` now starts one only on an explicit yes, and every caller is written to
      work without one.
    - **`PHPSESSID`'s mixed purpose was resolved by MOVING a job, not by arguing about it.** Its
      service-related half (remembering a chosen language) went to the `ec_language` cookie, which
      the visitor sets deliberately and which is exempt on its own footing. That left the session
      with one purpose and one honest answer. Worth remembering as a shape: when a per-purpose test
      taints something, separating the purposes beats defending the mixture.
    - **The banner works with JavaScript off** (`consent.php`). Not a nicety: "as easy to refuse as
      to accept" cannot be met by a control that does not work, and a JS-only banner leaves a no-JS
      visitor unable to consent AND unable to refuse.
    - **Both answer buttons are styled by one CSS rule on purpose.** A coloured Accept beside a
      grey Reject is the specific pattern being fined. Never give one of them its own rule.
    - **Tom's question about opted-out humans is answered, and the answer is two buckets.** *"do we
      report them in a separate bucket... I don't think that we want to completely ignore them."*
      Consent governs STORAGE, and storage is what de-duplication needs — not counting. A row with
      no IP, no session id and no identifier needs no cookie to be lawful or useful. So
      `log/lang-log-stats.sh` now reports **visitors** (consented, deduplicated — every existing
      section, unchanged) and **visits** (everybody else, one row per page load, its own section),
      and never sums them. Summing would turn every count into a mixture of people and page loads
      and every percentage into a number with no meaning.
    - **The bucket marker is a TRAILING column emitted only for `visit` rows**, so the entire
      pre-existing log history stays byte-identical and every awk field index keeps its meaning.
      Absence of the marker means a deduplicated row, which is what every old row is.
  - **PAGES SHIPPED 2026-08-12: `privacy.php` and `terms.php`**, English-authoritative and
    hard-coded, which is a deliberate exception to every other page in this suite — machine
    translating a liability position into 26 languages is a way to say something you did not mean
    where nobody would notice. Tom answered the open decisions the same day: usage counts kept **at
    most 26 months** (enforced by `dev/scripts/trim_logs.php`, not merely promised), contact
    messages **until deleted**, transfer basis **Art 49(1)(a) + 49(1)(b)**, liability cap **the
    greater of fees paid or USD 100**, governing law **Arizona**.
    - **The notice covers hawsedc.com, not just /engcalcs** — the cookies are set with `path=/`. It
      answers at `/privacy.php` and `/terms.php` through three-line redirects at the parent root.
      **Those two shims are NOT in this repo** (the parent site is not under version control) and
      must be recreated by hand if that site is ever rebuilt.
    - **Tom asked whether deleting logs often is bad. Answer: on its own, a little; with a snapshot
      first, no.** What deleting costs is the multi-year trend that language and calculator
      decisions rest on — and `sh log/lang-log-stats.sh` produces exactly that as aggregates with no
      rows in them. Snapshot into `dev/usage-data-log.md`, then delete as freely as he likes.
      `trim_logs.php` is the backstop that makes the 26-month claim true even when nobody
      remembers; it refuses `--months` above 26 because that would make the page lie.
    - **A CLI render is not a visitor** (`PHP_SAPI === 'cli'` guard in `logLanguageSelection`).
      Never mattered before: a CLI render had a session and logged one row per process. With the
      storage-free path logging per page load, one run of `html_balance_check.php` put 25 fictional
      visits in the log. Caught by noticing the row count move during testing.
    - **Still open on this task:** translating the ten new
      `consent_*`/`privacy_link`/`terms_link` keys — which exist in English precisely so they ride
      the Task 251 sprint rather than paying for one of their own. And Task 287, split out because
      writing the notice is what found it.
  - **What triggers it is ePrivacy Article 5(3), not GDPR**, and its test is *strictly necessary for
    a service the user explicitly requested* — applied **per purpose**, and to `localStorage` as
    much as to cookies. Consent under it means opt-IN, before the storage; the existing `ec_nolog`
    opt-out is not consent and was never meant to be.
  - **His guess is roughly right, and the exposure is smaller than "outlaws" suggests.** There are
    no third parties at all here — no analytics vendor, no tag manager, no ads, no CDN fonts — and
    the usage logs carry no IP and no session id by deliberate design. What fails is narrow:
    `ec_blang` (exists only to make a statistic accurate once per browser), the analytics half of
    `PHPSESSID`, and a page-input cookie with a **36,000-day** lifetime that is bad hygiene whatever
    the law says. `lpn_`'s project storage is the strongest case in the file, not the weakest — it
    holds the document the user made in order to give it back to them.
  - **DECIDED 2026-08-11: SHIP THE BANNER, KEEP THE COUNTERS.** CC argued for engineering around
    the banner; Tom overruled it, on two grounds worth keeping because they are better than the
    argument they replaced. **(1) The cost is already sunk on the user's side:** *"We are late in
    the game on this. So users are already trained to 'Accept and continue'. So I don't think that
    the once-per-suite cost is high for users to pay."* **(2) The alternative buys doubt, not
    savings:** *"I think we will forever second-guess a decision to avoid the banner. We want good
    development guidance. We could go for something like 'visits', and that's not terrible. But I
    just don't think the cost is high enough to avoid."* A permanently uncertain compliance posture
    plus permanently degraded numbers is a bad trade against one click.
  - **So the counters stay as they are** — reach, shopping and using keep their per-visitor
    de-duplication, and consent is what makes that lawful. Task 285's device signal can ride the
    same consent rather than needing its own argument.
  - **What must still be fixed regardless of the banner**, because these are hygiene rather than
    consent: the page-input cookie's **36,000-day** (~98 year) lifetime, and the fact that
    `lib/base.inc.php` calls `session_start()` on **every page load** — so `PHPSESSID` is written
    before anybody has been asked anything, which no banner can fix from the outside. Sessions have
    to become lazy.
  - **DRAFTS EXIST FOR REVIEW: `dev/privacy-and-terms-draft.md`** — a privacy notice built on the
    GDPR Art 13 checklist, terms of use, the constraints a valid banner must meet, and the five
    decisions only a human can make (controller name and address, contact address, whether the
    notice lives at hawsedc.com or engcalcs level, governing law, and whether a lawyer reads the
    liability clause).
  - **There is NO official EU template**, contrary to a reasonable first impression (Tom: *"my
    understanding is that the European Union may have a boilerplate template"*). GDPR Art 13/14
    specify required *content*; the Commission publishes its own policy as an example, not a form.
    The uniform look of many sites' policies is commercial generators, not a published EU form. Good
    news, on balance: a short honest document beats a long generated one describing trackers this
    site does not have.
  - **ORDER MATTERS, AND IT IS THE CHEAP ORDER, NOT JUST TOM'S PREFERENCE.** The banner's ~8-12
    strings are UI and must be translated into all 26 languages — consent nobody can read is not
    consent. Landing them BEFORE the Task 251 sprint costs nothing; missing it costs a second
    26-agent sprint for a dozen strings. The long-form notice and terms are a separate question:
    legal prose, English-authoritative, human translation later if at all.
  - **A privacy page is owed independently of all of it**, because `contact.php` collects a name and
    an email address and there is no notice anywhere on this site.
  - **Cheaper now than after the Task 251 sprint.** A banner and a privacy page are text, and text
    is what this project pays 26x for.
  - **Not legal advice and not from a lawyer.** The inventory is what an adviser would ask for
    first, which is why it exists; the verdict is not ours to give.

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

- 40|222| **Position `lpn_` against epanet-js — do not lead with "free EPANET in the browser."**
  Researched 2026-08-05 at Tom's request, before a blog/YouTube push.

  **THE RESEARCH BELOW NOW LIVES IN `dev/positioning.md` (created 2026-08-14), which is the place
  to read and to edit it.** Priority dropped 85 → 40 because the thinking is no longer the
  bottleneck. What is left of this task is the CONTENT residual Task 250 handed it: **`About.php`
  never names EPANET**, so the engine claim — the thing Task 243 actually built — is invisible on
  every page. That edit touches `about_body_html`, a string translated into 26 languages, so it
  needs its own drift-aware pass and is not a five-minute job.

  **Two rulings from Tom, 2026-08-14, that govern any copy written under this task:**
  - **Lead with invitation, not comparison.** *"I'm not keen on saying a lot about comparisons with
    EPANET or epanetjs. I lean toward saying little more than 'Join us in building LibreEPANET, for
    the community and by the community, today.'"* State our own licence; do not narrate theirs.
    This voluntarily extends Task 296's trademark ban to competitors we legally *could* name.
  - **Design, not management.** *"While I am sure that the big money is in management, somebody has
    to design things."* The annotated, publishable map is the differentiator, and it is already
    built (`js/lpn-geom.js`, `js/lpn-collide.js`, draggable labels, backdrops). It is a
    **screenshot** story, not a printing one — see `dev/positioning.md` §4 before proposing a print
    stylesheet.
  - **The pitch is taken.** epanetjs.com (Iterating Inc.) launched ~2025-08: full EPANET via WASM,
    local-first, **free tier with no model-size limits**, satellite basemaps, automated elevations,
    `.inp` import/export, no account to start, multi-language on all tiers. Pro $950/yr. Trade press
    ran it as "brings $16,000 software to browsers for free." Also HydroBOA and Qatium.
  - **Their stated audience is not ours** — "utilities, educators, and engineers with smaller
    budgets," positioned against commercial vendors. No geographic focus, no mobile, no field use.
    That is the gap, and it is from their own words, not our guess.
  - **What survives:** mobile/phone (they market Mac/Linux/Windows only), 26 languages vs. an
    unstated number, distribution (MPF alone is 2,721 humans/period — they buy every user), and GPL
    with no tier that can be revoked.
    - **SUPERSEDED ON ITS ORDERING, 2026-08-14 — this bullet leads with the item Tom has since
      demoted.** *"I think that phone is a dead end. We will keep caring and trying. But I don't
      want to tout it. I could be wrong, and I should get advice."* The live order is in
      `dev/positioning.md` §3: licence first (the only item that is a checkable fact), then 26
      languages, the annotated map, offline/no-third-party, distribution. **Mobile does not appear
      in a headline, tagline, or list of reasons to choose us.** We keep caring — the
      `innerHeight * 0.72` touch-trap cap stays and phone regressions are still bugs — but the
      claim is not made. Left in place rather than rewritten so the change of mind is visible.
  - **Unverified, do not claim publicly until checked:** their actual language count. Their help
    centre is Notion and did not scrape; only Spanish was confirmed.
  - **Why not lead with it as a TAGLINE:** on that exact claim they are already better and free, so
    the comparison a reader runs next is one we lose. Lead where they have publicly conceded the
    ground — phone/field use, 26 languages, offline PWA, GPL that cannot be revoked.
    - **The list in this sentence is superseded for the same reason as the bullet above** (Tom,
      2026-08-14). The *reasoning* stands — do not lead on the claim where they are already better
      and free — but "phone/field use" is no longer one of the grounds we lead on.
  - **TOM OVERRULED THE BROADER VERSION OF THIS, 2026-08-09, and he is right:** *"I disagree with
    not leading with EPANET engine once we have it. I think it could be a litmus test for some
    orgs."* The two claims are about different things. Mine was about the consumer-facing headline;
    his is about **qualification** — for some agencies and NGOs "does it run the actual EPANET
    engine?" is a yes/no gate that decides whether we get evaluated at all, and no amount of
    mobile/multilingual advantage substitutes for a "yes". **So: say it prominently and make it
    checkable; just do not spend the blog/video headline on it.** Do not relitigate.
  - Consequence: raised 146.06 to 90 and 220 to 95.




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

- 1|306| **LibreEPANET.org: the rebranded site variant. BLOCKED on Task 248.** Tom bought the
  domain 2026-08-14; it 302-redirects to `Looped-Network.php?lang=en` as a placeholder and stays
  that way until the gate clears. Rationale, the name ruling and the gate are in
  `dev/positioning.md` §6 — read that before touching this. Priority 1, not 0: 0 means completed,
  and this is blocked, not done. It rises when Task 248 clears.

  Tom's spec: (1) EPANET engine on by default, (2) custom navbar without HawsEDC and the Hydraulics
  menu, (3) page title and description removed, (4) Notes moved elsewhere — perhaps under More as
  "Technical notes", (5) navbar + lpn menus + map fill the whole browser tab. Built in collaboration
  with HawsEDC engcalcs, which is happy to provide helpers or APIs.

  **Feasibility was checked 2026-08-14 so this is costed when it unblocks. It is a VARIANT, not a
  fork — do not start by copying the page.**
  - **THE SUITE COULD NOT STAND ALONE UNTIL 2026-08-14, and this task would have hit it first.**
    Every page loads `/hawsedc.css` — 464 bytes at the SITE ROOT, not tracked by this repository,
    belonging to hawsedc.com — and it carries the calculator form backgrounds and the table borders.
    Found when dev.hawsedc.com's first deploy came up 95% right: everything present except the blue
    and the borders, which reads like a cache problem for a day before anyone checks for a 404. Its
    rules are now duplicated into `css/engcalcs.css` (self-sufficiency block at the top) and
    `dev/scripts/standalone_assets_check.php` blocks any new asset outside `/engcalcs/`. **A
    different domain is exactly the condition that exposes this class**, so treat any parent-site
    dependency as this task's problem by default.
  - **A chrome-free header largely exists already.** `echoHeader()`'s `"normal"` branch
    (`lib/HeadersFooters.lib.php`) already skips the navbar, `engcalcs.css` and the calculator JS.
    No page currently uses it for a calculator, but the branch is live.
  - **The real cost is path-shaped: 112 hardcoded `/engcalcs/` absolute paths**, plus `sw.js` and
    `manifest.json` both scoped to `/engcalcs/`. **The cheapest hosting answer avoids that refactor
    entirely:** a vhost for the domain with an `Alias /engcalcs` pointing at this directory, plus a
    rewrite of `/` to `Looped-Network.php`, so every asset path resolves unchanged. Only deep-link
    URLs look odd. Prefer this over an `EC_BASE` refactor unless something else needs one.
  - **`CANONICAL_ORIGIN` is deliberately hardcoded and explicitly NOT derived from
    `$_SERVER['HTTP_HOST']`** (`lib/config.inc.php`, with the reasoning in a comment). A second
    domain therefore needs a **host → variant whitelist**, never a bare Host read, or it
    reintroduces exactly the canonical-poisoning hole that comment exists to prevent. `ec_canonical_url()`
    in `lib/Language.lib.php` builds every canonical and hreflang from that constant.
  - **EPANET-on-by-default is a one-line change** to `engine: 'native'` in `defaultSettings()`
    (`js/looped-network.js` — find it by name, the line number has already rotted twice). But
    **engine is a PROJECT setting**, under the Computation section, so the change affects *new*
    projects only, and a LibreEPANET-saved project keeps EPANET on when opened on hawsedc. That is
    good interop and worth keeping.
  - **Two consequences that must be ANSWERED, not discovered.**
    1. **The 678 KB engine is lazily imported precisely because it is off by default.** On by
       default means every visit pays it. Decide deliberately whether the LibreEPANET audience wants
       that; it cuts against the low-bandwidth case.
    2. **`lpn_settings_engine_epanet_tip` currently reads *"the built-in solver gives the same
       answers and is faster, so leave this off unless you need EPANET itself."*** On a
       LibreEPANET-branded page that is the page arguing with itself — the exact defect Task 296
       named. **Copy must change with the default**, and it is translated into 26 languages, so it
       is a resync, not a free edit.
  - **A full-viewport map is a JS change, not CSS.** There is no `#lpn_canvas` height rule anywhere
    in `css/engcalcs.css`; height comes from `effectiveMapHeight()`. Its `innerHeight * 0.72` cap is
    **load-bearing**: `#lpn_canvas` has `touch-action:none`, so a canvas taller than the viewport
    swallows every touch and leaves a phone user with no scrollable page — Tom hit exactly that on
    2026-07-31 and had to reload. **Any full-screen variant must answer that trap**, not delete the
    cap.
  - **The Notes block has no id or class** (`Looped-Network.php`, below `echoFeedback()`), so moving
    it under a Help menu needs a wrapper added first.

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

- 69|214| **Realign the glossary anchor languages with measured reach.** Confirms and closes Tom's
  2026-08-05 question, *"Confirm that our wave 1 translation language set is adjusted in light of our
  usage reports."* Answer in two parts:
  - **The priority set IS already adjusted — you did it yesterday.** Task 203's coverage cross names
    core languages **es, pt, fr, tr**, which is exactly the measured top four in order (es 186,
    pt 30, fr 23, tr 17 confirmed humans, 2026-08-03). Nothing to change there.
  - **The wave lists in `dev/translation-process.md` are stale but nearly obsolete.** Wave 1 as
    written (es pt fr it de ro ru uk bg sr hr cs tr id) would sequence ru, uk, bg, sr, hr, cs and id
    — all at 0–1 measured humans — ahead of **zh (12) and he (10)**, which sit in wave 2. **Do not
    renumber the waves.** They were a *build-out sequencing* device for cognate clustering, that
    build-out is complete, and the cross supersedes them in maintenance. A one-line note saying so
    was added to `dev/translation-process.md` on 2026-08-05, which is the whole fix.
  - **The live defect is the anchors.** CLAUDE.md names glossary anchors **es, fr, ru, ar**. `ru` has
    one measured human and `ar` has zero, while `pt` (30) and `tr` (17) are not anchors. An anchor is
    a reference other languages are checked against — anchoring on two we cannot observe is strictly
    weaker than anchoring on ones we can. **Align the anchors to the core four (es, pt, fr, tr)** in
    CLAUDE.md's pre-sprint checklist and in `glossary.json`'s `preferred_translation` expectations.
    The 2026-08-03 usage log already flagged this ("worth revisiting when the glossary is next
    touched") and nothing tracked it.
  - **This is not a reason to deprioritise ru or ar translation quality** — the standing "zero reach
    ≠ low value" rule holds, and for a language that size zero reach is a discovery/SEO gap. It is
    only a statement about which languages make useful *reference* points.
  - **Do not promote `zh` to core yet.** It costs 14 cells, and the pre-registered n = 30 test on its
    17% conversion anomaly is still outstanding (`dev/usage-data-log.md`). `he` (10 humans, 60%,
    squarely in the band) is the cleaner next candidate, with no urgency.

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

- 66|160| **`lib/lang.ec.tr.php` disagrees with itself on vowel harmony for the app name.**
  Extracted from Task 154 on close, 2026-07-28. Three keys write `EngCalcs'i`
  (`install_main_title`, `install_desktop_steps_html`, `install_cached_body`) and one writes
  `EngCalcs'ı`. Turkish picks the accusative suffix by the last vowel *as pronounced*, so exactly one
  form is right and the file ships both. **CC deliberately did not guess** — choosing between them is
  a native phonological judgment about how a Turkish speaker vocalizes "EngCalcs", and getting it
  wrong would replace an inconsistency with a uniform error. **Low priority and low stakes:** it is a
  one-character suffix on a proper noun, affecting only the Install page. Best resolved by whoever
  next does verified tr work, or by the Task 159 sprint's tr agent as a ride-along question.
  **Raised 5 -> 66 on 2026-08-05 (Tom).** Not blocked on a human: `tr` is now a core language
  (Task 203) and a Sonnet tr agent can make the call, so this needs no decision from Tom. Raised
  because it is cheap and CLOSABLE, not because it became important — it is still one character
  on one page. Fold it into the next tr touch rather than spawning an agent for it alone.

## AI Efficiency Scripting (Overhead)

These tasks reduce the AI token cost of routine maintenance by replacing repeated AI judgment with deterministic scripts. Copilot owns execution (all tagged `[CP]`); Claude Code specs any script whose output feeds back into translation quality work.

## CSS Standardization Follow-up

## Low Priority / Nice-to-Have

## Completed

- 0|329| **Pipe labels aligned ALONG the pipe, GIS-style — SHIPPED ON 2026-08-15.** Tom, after a day
  with it behind a setting: *"Ship with it on. Very much earns its keep."* `settings.alignPipeLabels`
  now defaults true. The geometry is `Geom.alignedLabelAnchor()` (angle normalisation so text never
  reads upside down, which also swaps which side is the top); the side is chosen by clearance to the
  nearest other link with a 1.35 margin so the top stays the default; an aligned label draws no
  leader, because its orientation already says which pipe it belongs to. Harnesses:
  `geom-harness.js` (8 checks) and `aligned-label-harness.js` (31).

- 0|349| **A long pipe repeats its label along itself — DONE 2026-08-15.** Tom's spec, taken as
  written: `VD = max(map width, map height)`, `n = ceil(L / (0.25 VD))`, spaced `0.25 VD` —
  *"Link labels spacing = 25% of view size."* Stations are `(i + 0.5)/n`, so **n = 1 lands on 0.5
  and every pipe shorter than a quarter-view is bit-for-bit what it was**; that is the property the
  harness guards first. In view units, so it needs no number from anyone and re-derives on zoom.
  - **The division is uncapped; what is bounded is what gets DRAWN** (Tom's call on being shown a
    cap of 12: *"Do you want only to draw the 4 that appear on the screen? That makes most sense.
    No cap on the division?"*). A cap on n is a cap on the spacing. `drawnLinkLabelStations()`
    clips the polyline to the viewport grown by one view-span (`Geom.segmentRectRange()`,
    Liang–Barsky) and builds only those — so a pipe a thousand view-widths long costs what a short
    one costs. Re-culled at the end of a pan; a bounding-box test instead of a clip culls nothing,
    which is why the clip is its own tested function.
  - **Every copy is pickable** (Tom: *"The problem is that I can only drag one upstream label"*).
    Same `data-linklbl`, same `.lpn-draglbl`, plus `data-repeat` so a grab knows which copy it took
    and the chain collapses to THERE rather than jumping to mid-pipe first. His alternative —
    make the draggable one the upstream label — was declined on one fact: upstream is a solve
    result, so a reversing flow would move the drag target when an unrelated demand changed.
  - **The station is fixed but the SIDE is not** (Tom: *"I assume that side can still be nudged?"*).
    A blocked station takes the other side of its pipe if that one is clear; the even spacing, which
    is what makes a chain read as one repeated name, never moves.
  - A chain does not participate in the collision relaxation, it OBSTRUCTS — the same category an
    aligned label is in. `placeAlignedLabels()` became `placeStationedLabels()`.
  - `bbox()` ignores a chain's labels: how many exist is a function of the zoom, and zoom-to-fit
    reading them back is the Task 332 circularity in different clothes.
  - `dev/lpn-spike/label-repeat-harness.js`, 34 checks, mutation-tested nine ways.

- 0|350| **"Always show" on a Text label — DONE 2026-08-15.** `lb.alwaysShow`, a checkbox under the
  size in the Text property popup, exempting that one label from Task 340's threshold. Tom named and
  rejected the automatic alternative himself — *"the non-customizable way to do this would be to show
  always the largest text, but we don't want to do that"* — and he is right: sparing whichever label
  is biggest makes a legend compete on font size for a property it should declare, and changes its
  mind whenever some other label is resized.

- 0|334| **One `.lpn-annotation` class, declared where the element is built — DONE 2026-08-15.**
  `annotationEl()` in `js/looped-network.js` applies it to every generated mark (data label, its
  mask and leader, flow arrows); `css/engcalcs.css` is one rule instead of a four-selector list, and
  a Text label is deliberately not a member. The list is what let the extrema badge ship unhidden in
  Task 331. Asserted both ways in `dev/lpn-spike/label-visibility-harness.js`.

- 0|332| **Imported EPANET labels are rendered at EPANET's own anchor, not converted — DONE
  2026-08-15.** `reanchorImportedLabels()` is gone: it moved every label by half its own width and
  half a line, both measured in world units against text sized in screen pixels, so the same `.inp`
  imported from two zooms stored two different sets of coordinates. Now the point is stored
  unchanged and `lb.align`/`lb.valign` (left/top on import) say what it means, interpreted in one
  place — `Geom.labelBoxAt()`. `inp-import-harness.js`'s inverted xfail is flipped and passing. The
  import report carries one line about it (`lpn_inp_report_label_anchor`); there is no setting.

- 0|330| **Toggle for label background masking — DONE 2026-08-15.** `settings.maskLabels`, ships ON,
  saved with the PROJECT (Task 263's rule: masking is a property of the sheet, not the browser).
  One class on the `<svg>`, `.lpn-masks-off`. Read as `=== false` so a project written before this
  still masks — a truthiness test would have restyled every drawing in the library on ship day.

- 0|340| **A Text label hides at a threshold scaled by ITS OWN size — DONE 2026-08-15.**
  `labelMaxWidth x lb.sizeMult` in `applyLabelVisibility()`, so a 3x title block survives to 3x the
  map width and a 1x note goes exactly when the data labels do. No new per-label setting — it falls
  out of `lb.sizeMult`, which was already in the document. Replaces Task 331's blanket exemption of
  authored text, which treated a title block and a small note alike.

- 0|305| **How a visitor opens an EXAMPLE, and the New-vs-Open lie — CLOSED 2026-08-15, absorbed by Task 314.**

  Its own text said not to schedule it separately and that closing 314 closes it; 314 is now closed,
  so this is too. The gallery opens examples under **File ▸ Open example…**, not New, and drops a
  COPY into a new tab — the linguistic argument below is what that design is built on, kept because
  314 assumes the reasoning rather than restating it. Raised by Tom, 2026-08-14:

  **THIS IS THE DESIGN RECORD FOR TASK 314's ENTRY POINT — BUILD IT THERE, NOT HERE** (noted
  2026-08-14 while prioritising the gallery). Everything below was written before 314 existed and
  314 has since absorbed its conclusions: File > Open rather than New, "Open a copy" as the honest
  primitive, thumbnails on the empty canvas rather than a modal, and the same three examples. Kept
  as a separate entry because the *linguistic* argument — why New is a lie and what Word's "Open a
  copy" gets right — is the reasoning 314 assumes rather than restates. **Do not schedule 305 as
  its own build; closing 314 closes this.** The one live consequence to watch is the last bullet:
  if thumbnails land, `lpn_empty_hint` is deleted, so do not spend a resync sprint on it.

  *"currently we are using New to 'open' examples, which is linguistically confusing, and maybe we
  need some sort of library paradigm."* And, rejecting a proposed reword of the placeholder:
  *"Saying it differently doesn't change the lie. And I don't know how to fix it."*
  - **The mismatch:** New creates something that did not exist; Open retrieves something that does.
    An example exists, so it belongs under Open. `File > Open example…` (Tom's idea (a)) is the
    linguistically correct home for it.
  - **The trap one level down:** if "Open example" then lets you edit and save over it, it was
    New-from-template after all and the lie returns. The honest primitive is **Open a copy** (Word
    has exactly this): the example is read-only source, opening it drops a copy into a new tab, the
    original is untouched and re-openable. The tab strip then shows an ordinary project and nothing
    is misnamed.
  - **What epanetjs.com gets right is NOT the modal — it is that there is no verb at all.** Tom,
    2026-08-14: *"epanetjs.com just throws a box at you on load that gives you a large thumbnail of
    a US and an SI example. No 'open' or 'new'. Just 'Hmm. I guess I click one of these.'"* Take
    that without taking the box: **put the thumbnails on the empty canvas itself.** A returning user
    with projects never sees them, because the canvas is not empty — so it is a passive readout
    rather than a modal in front of the common action. Nothing to dismiss, no verb to misuse.
  - **Why examples and not an empty canvas at all:** Tom, 2026-08-14, on why the old placeholder was
    worse than the new one — *"'Add a background image' is not harnessing dilettantism. 'Open an
    example' is."* A dabbler clicks a picture; they do not read a sentence about a menu path. This
    is also the first thing the Task 200 `lpn first:` histogram will bear on.
  - **Consequence for translation:** if thumbnails land, `lpn_empty_hint` goes away. **Do not spend
    a resync sprint on it** — it is 26 of the 4 outstanding keys' strings and may be deleted.
  - **Examples to ship:** the two basics, plus `Elm-Street-Center` (Tom anonymised a real model for
    this on 2026-08-14, which is what makes it publishable — the source in `dev/epanet-models/` is
    gitignored because those carry client names, coordinates, base maps and fire-flow results).
    EPANET's Net1/Net2/Net3 are a free third option: public domain, ship with EPANET, and every
    water engineer recognises them.

## New Calculators (Mission Expansion)

Tom, 2026-07-14: interested in expanding beyond hydraulic-structure/irrigation calculators toward
the kind of design work that normally only lives in mission/NGO field manuals (Peace Corps water &
sanitation guides, CAWST, RWSN, Engineers Without Borders) — "systematize what's normally esoteric,"
staying true to the suite's mission (serving engineers and field workers in water-scarce,
low-resource regions). None of the tasks below are scoped for build yet — each needs a full spec
pass (inputs/outputs, formulas, unit sets, worked-example verification, new-calculator checklist per
`CLAUDE.md`) before implementation starts, same as any new calculator.

### Prioritization framework (Tom, 2026-07-14)

Candidates are scored on four axes, not just "sounds like a good mission fit":
1. **Availability/commoditization** — is this calculation already well-served worldwide by existing
   free tools/apps, or trivial in a spreadsheet? **Low availability (a genuine gap) raises priority;
   a saturated market lowers it**, even for calculators with strong humanitarian relevance — the
   relevance doesn't help if ten other free tools already solve it.
2. **Technology emergence** — is the underlying tech/practice currently maturing or dropping in cost
   (e.g. solar panel costs, PWA/offline capability)?
3. **Demand for development** — real field/humanitarian need, e.g. how heavily a method is taught in
   NGO/Peace Corps/WHO/CAWST/RWSN field manuals.
4. **Search keyword research** — actual external search/demand signal, not a guess.

A 2026-07-14 research pass (real web search, not assumption) across 13 candidates on all four axes
overturned some initial intuitions — most notably, rainwater harvesting (the lead candidate from the
first brainstorm) turned out to be a saturated market, while several backlog items (VIP latrine
sizing, handpump/rope pump selection, check dams) turned out to be genuine gaps with strong
humanitarian demand and no existing calculator found. **Honest caveat on all "no calculator found"
verdicts below**: this is a real signal from web search, not a verified global negative — regional,
institutional, paywalled, or non-English tools may exist that search didn't surface. Priorities
below reflect this research; re-run the same 4-axis check before adding new candidates rather than
prioritizing on mission-fit intuition alone.

- 0|314| **An EXAMPLES LIBRARY, on the HEC-RAS model: a pane of many examples, not a menu of two.**

  **BUILT AND SHIPPED 2026-08-14 — the gallery is live; ONE decision of Tom's is deliberately NOT
  built, and it is named below rather than quietly dropped.** What exists now:
  - `dev/scripts/generate_examples.php` publishes `dev/water-network-examples/` to the web-served
    `examples/` with a manifest and a generated SVG thumbnail per example. **The served copy is
    generated, never hand-kept**, and `check_all.sh` fails if it drifts. It publishes exactly what
    the `.gitignore` whitelist publishes — one list, not two that can disagree, so a client model
    dropped in to test the `.inp` importer is invisible to both.
  - **The empty canvas IS the shop window.** The placeholder sentence that had been there since
    2026-07-29 is gone; the canvas stays visible and pannable behind the cards, which is the
    "usable middle" Tom described. `File > Open example…` opens the same wall on demand, **under
    Open, not New** (Task 305's linguistic argument, built here).
  - **Opening one goes through `acceptImportedText()` + `importProject()`** — the upload path's own
    loader, not a second one. So an example lands as an ordinary project the user owns and may Save
    As, carrying the version migration and structural repair for free. That is
    *"they were your copies because you downloaded and installed them"*, as far as a served file can
    get to it.
  - `dev/lpn-spike/examples-gallery-harness.js`, 69 checks. **The one worth knowing about is the
    upside-down test**: a `v >= 4` document is stored Cartesian and SVG is Y-down, so drawing stored
    coordinates straight into a thumbnail mirrors every drawing vertically — and on an unfamiliar
    water network that looks entirely plausible. It is asserted against `applySaved()`'s own rule
    rather than by eye, because eye is exactly what would pass it.

  **The unbuilt half is now Task 347, not a paragraph in here.** Tom's strongest form of the feature
  (*"It's not a map until the first project is started or opened?"*) is a storage-model change
  wearing a UI change's clothes, and this block will not be read again; sub-categories and paging
  went to Task 348 for the same reason. `lpn_empty_hint` is now rendered by nothing and is KEPT
  deliberately — it is the fallback sentence when the manifest cannot be fetched, and 26 translated
  strings that would be expensive to get back.

  - **STEP ZERO IS DONE, 2026-08-14: the shelf is stocked, tracked, and on the new filename
    convention.** `dev/water-network-examples/` (Tom renamed it from `dev/epanet-models/` the same
    day) now holds four saved projects of ours — `Net1-lpn.json` (11 nodes), `Net2-lpn.json` (36),
    `Net3-lpn.json` (97) and `Elm-Street-Center-lpn.json` (18) — each carrying the Task 315
    `format`/`app` marker. A useful spread, and Net3 is the one that will actually exercise label
    clutter and the sizing paradigm in a thumbnail.
  - **AND THE RENAME QUIETLY UNPROTECTED THE CLIENT MODELS, which is worth recording because
    nothing warned.** The root `.gitignore` excluded `dev/epanet-models/` BY PATH; renaming the
    directory did not carry the rule with it, so for a few minutes every real client model in there
    — `Estrellas-*`, a 1.5 MB utility base map — was an ordinary untracked file one
    `git add <dir>` away from GitHub. **A path-named ignore rule is a rule that a rename silently
    revokes.** The fix is `dev/water-network-examples/.gitignore`, which is a WHITELIST: an
    unrecognised file is ignored by default, and publishing one is an explicit line somebody has to
    write, visible in the diff. Prefer that shape anywhere a folder mixes shippable and private
    files — a blacklist has to predict the next client file's name.
  - **`.inp` sources are deliberately NOT tracked**, including Net1/2/3's. The saved project is the
    artifact the gallery serves; the `.inp` is an upstream input, and `dev/lpn-spike/reference/`
    already keeps the one the importer is validated against.
  - **THE GAP IS AN SI EXAMPLE, and it cannot be made by converting one** (Tom: *"We just need an SI
    one now. I will eventually make one or find one."*). All three EPANET nets are `Units GPM`, and
    this suite's standing rule is that switching a unit REINTERPRETS the typed number rather than
    converting it — so opening Net1 and clicking SI gives 8 mm mains, not 200 mm ones. An SI example
    has to be AUTHORED in metres, or imported from an `.inp` that declares LPS/LPM/CMH/MLD, which
    `js/lpn-inp.js` already reads correctly. That is the cheap route if a public SI model turns up.
  - **The real first exhibit, Tom's own "Elm Street Center", is OUT of his browser and on the shelf**
    (2026-08-14: *"should be a solid US units example now"*). 18 nodes, 19 links, a CAD site plan as
    its backdrop. It was the first honest test of the Task 315 filename convention and of whether a
    saved project opens on a machine that never made it.
  - **It ships as-is, on Tom's explicit ruling (2026-08-14), with two residual identifiers named
    here so nobody re-discovers them and panics.** The map labels are anonymised (`ELM STREET
    CENTER`, `ST. FRANCIS`) and the backdrop image carries no text at all — but `project.name` is
    still the real client model name, and the node coordinates are real state-plane, which
    geolocates the site. A sanitisation was offered and declined; **that is a decision, not an
    oversight, and it should not be silently "fixed" by a later pass.** If it is ever revisited:
    pipe `_length` is explicit with `lenAuto:false`, so translating coordinates to a local origin is
    hydraulically lossless for those links, while elevations cannot move without changing every
    pressure.
  Tom, 2026-08-14: *"I envision a stunning array of examples that fills a screen with mere titles or
  brief descriptions and could span pages or sub-categories of large thumbnails… Therefore it is
  some sort of an Examples library or pane. And you probably get there using File Open Examples."*

  **THIS IS A RE-ARCHITECTURE, NOT A THIRD EXAMPLE.** Today an example is a JS FUNCTION —
  `drawExampleNetwork(system)` builds Basic US or Basic SI by executing ~290 lines of drawing code,
  reached from File > New project > From examples. That shape cannot scale to a screen full of
  them: every example would be more code, none could carry a description or a thumbnail, and none
  could be authored by anyone who is not editing `js/looped-network.js`. **An example must become a
  FILE** — an ordinary saved project in an examples folder, with metadata beside it.

  - **Metadata: Description primarily, Thumbnail(s) possibly** (Tom's own ranking). A description is
    what makes a wall of titles browsable; a thumbnail is what makes it *stunning*, and is the more
    expensive half — decide whether it is generated at build time from the project itself (right, no
    drift) or committed as an image (wrong, goes stale the moment the example is edited).
  - **"They were your copies because you downloaded and installed them."** Tom is naming the thing
    HEC-RAS got right without ever saying it: opening an example gives you a document you own and
    may save, and nobody had to explain that. Ours are served rather than installed, so **opening an
    example must produce an unsaved project the user can Save As**, never a read-only view of a file
    on our server, and never something that writes back.
  - **File > Open > Examples**, per Tom, NOT File > New. The current placement under New was right
    when there were two; a library is a thing you browse and open.
  - **Three to start**: Basic SI, Basic US, and *Elm Street Center US design loop fire flow plus max
    day snapshot*. It is the first example drawn from an actual project rather than invented.
  - **ELM STREET IS NOT A SCENARIO DOCUMENT, and this task is NOT blocked on Task 184** (Tom,
    2026-08-14, correcting an error written here earlier the same day): *"Elm Street is not a
    scenario document. It is an EPANET import, and EPANET doesn't do scenarios. Elm Street is a
    single-scenario snapshot that represents one scenario of a design."* The long name describes
    **which** snapshot it is, not a document containing several. Worth keeping the correction
    visible, because the mistake is an easy one to make twice: a name listing three design
    conditions reads like a document holding three, and **EPANET has no scenario concept at all** —
    one `.inp` per condition is exactly why Task 184 exists. So all three examples can ship
    together with no dependency.
  - **The examples folder is a web-served directory, so it needs an index**: the pane cannot list a
    directory it cannot read. A generated manifest (title, description, units, thumbnail, file) is
    the obvious answer, and it must be generated from the files by a script in `dev/scripts/`, never
    hand-maintained — a hand-kept index and a folder of files drift, and the drift is silent.
  - **Sub-categories and paging are explicitly in Tom's picture** but are not needed at three. Build
    the pane so they can arrive without a rewrite; do not build them yet.
  - **THE EMPTY CANVAS BECOMES THE SHOP WINDOW (Tom, 2026-08-14).** *"I agree with the CC idea of
    using our first-visit map as an examples shop window. Possibly there can be no project tabs at
    all until either one of the examples is double-clicked (or maybe each of them has a little
    'Open' button) or the File menu is used. It's not a map until the first project is started or
    opened?"* This is the strongest form of the feature and it retires a standing problem: a blank
    canvas with a placeholder on it is the dominant failure of every map editor, and this page has
    carried one since 2026-07-29 by an explicit decision *made with no data at all*.
    - **"It is not a map until a project is opened" is the decision.** VS Code's welcome tab,
      Excel's start screen, HEC-RAS itself; no-tabs-until-a-project falls straight out of it.
    - **THE "GALLERY IS A WALL IN FRONT OF A WORKED EXAMPLE" OBJECTION WAS RAISED HERE AND TOM
      OVERRULED IT, and the overruling is the more useful record.** The objection ran: every other
      calculator in this suite lands you IN a worked example, per CLAUDE.md's own rule, so a gallery
      costs a visitor who arrived from a search. A gallery-over-a-live-map hybrid was proposed as
      the synthesis. Tom, 2026-08-14: *"A gallery is a universe of working examples. The tension is
      small-minded. This is not a two-minute calculator. I disagree with gallery-over-map."*
      - **He is right, and the error was treating a rule about CALCULATORS as a rule about this
        page.** "Open on a worked example" earns its keep where a visitor can read the whole tool in
        one screen and be finished in two minutes. A network editor is not that; the thing a visitor
        needs first is *the range of what can be built*, and one example cannot show a range. A wall
        of working examples IS the worked example, at the scale this page actually operates at.
      - **Do not re-propose the hybrid.** It was declined on the merits, not deferred.
      - **What epanet-js actually does, stated precisely, because the imprecise version reads as
        support for the hybrid and is not** (Tom, 2026-08-14): *"epanetjs doesn't have a project on
        the map. All they have is a Google Map background on the screen behind their gallery of
        two."* So the thing behind their gallery is a **decorative backdrop, not a network** —
        nobody's worked example, nothing to click, nothing that becomes your document. That is the
        opposite of the gallery-over-a-live-example hybrid proposed here, and it is consistent with
        Tom's own rule: **it is not a map until a project is opened.**
      - **This does leave a usable middle, and it is the one to build:** the map canvas may be
        VISIBLE behind the gallery — empty, no project, no tabs — so the page still reads as a map
        tool at a glance without pretending a document exists.
    - **THE LOG QUESTION IS CLOSED and the instrumentation is not needed for this.** Task 200's
      `first:` histogram was cited here as the evidence that should settle the empty-canvas
      question. Tom offered to pull it and asked which logs were wanted; the honest answer is that
      the decision has now been made on grounds the histogram cannot speak to — it counts what
      visitors did with the OLD page, and cannot say what they would do with a gallery that does not
      exist yet. **Spending his time on it to confirm a decision already taken would have been
      theatre.** The fine-grained `first:` rows remain worth reading later, on their own schedule, as
      a before/after on this change rather than as an input to it.
  - **Every example commits to a unit system and does not adapt to yours** — this decision already
    exists (Task 264, `newProjectFromExample`) and carries over unchanged. Say the units in the
    description.
  - **Not blocked on anything.** All three examples are single-scenario documents.
  - **THE SHELF IS NOT WEB-REACHABLE YET, and this is the first thing the build phase hits.**
    `dev/.htaccess` is `Require all denied`, so the gallery cannot `fetch()` anything under `dev/`.
    Three ways out, and the choice should be made deliberately rather than discovered:
    - **A child `.htaccess` granting access to that one subdirectory.** One copy, no drift — but it
      depends on `AllowOverride AuthConfig` being granted on the host, and CLAUDE.md's deploy
      section already records that a `.htaccess` directive the host has not granted returns **500
      for every request under `/engcalcs/`**, not a quiet ignore. Cheap, with a tail risk that takes
      the whole suite down on a host change.
    - **A served directory outside `dev/`** (e.g. `engcalcs/examples/`), with `dev/water-network-
      examples/` as the authoring source and a `dev/scripts/` step that copies. No Apache risk;
      costs a build step and introduces two copies that can drift.
    - **A PHP endpoint that reads the file and echoes it.** No Apache config, no copy, and it can
      emit the manifest too — but it is a new server-side surface on a suite that otherwise computes
      entirely client-side.
    **Recommended: the served directory, generated.** The manifest has to be generated from the
    files by a script anyway (a hand-kept index and a folder of files drift silently, already
    decided above), so the copy is free — the same script that writes the manifest writes the
    served copies, and there is exactly one authoring location. It also keeps a `git pull` deploy
    honest, which the `.htaccess` route does not.
  - **The loader already exists and should not be rewritten.** `acceptImportedText(text)` →
    `importProject(saved)` is the exact pipeline the gallery needs: it parses, runs
    `prepareDocument()`'s version/structure repair, lands the document as a NEW browser project,
    and stamps it clean. That is precisely Tom's *"they were your copies because you downloaded and
    installed them"* — the user gets a document they own and may Save As, and nothing writes back.
    A gallery click is a `fetch()` plus the two calls the upload path already makes; anything more
    is a second import path that will drift from the first.

- 0|344| **The element property box is DRAGGABLE — SHIPPED 2026-08-15.** Tom: *"EPANET has an
  element properties box. But it is draggable. epanetjs has a side pane. Of the two, the EPANET UX
  is better. Our UX suffers because our properties box is not draggable."* It is now, and it stays
  where you put it: once dragged, every element you click afterwards opens the box in the same
  place, which is what EPANET's own window does. Double-click its chrome to send it home.
  - **The grab surface is the CHROME — the padded band around the body, where `e.target` is the
    popup element itself.** That is what made this safe to add to a panel full of inputs, spinners
    and checkboxes without re-wiring one of them: a control is always a child, so a drag can never
    start on one. No drag bar, no extra row of pixels, no new string.
  - Pointer events with `setPointerCapture`, so touch works identically and the drag survives the
    pointer leaving the box — the failure that makes hand-rolled drags feel broken at speed.
    `touch-action: none` on the popup is what lets a touch drag start at all.
  - `clampPanel()` is shared by opening and dragging, so the box cannot be parked half off-screen
    by one route after being clamped by the other. Harness: `dev/lpn-spike/popup-drag-harness.js`.
  - The remembered position is SESSION-scoped, deliberately: it is a view choice about this screen,
    and putting it in the document would hand a colleague opening your file the place your popup
    sat. Reconsider only if someone asks for it to survive a reload.

- 0|345| **"Apply to all" beside each ID prefix — SHIPPED 2026-08-15.** Tom: *"How about an 'Apply
  to all' for each ID prefix?"* An ID prefix has always been future-only — change it and the next
  junction is N1 while J1..J40 stay — which is the right default and left no way to say "I meant
  all of them", the day you inherit a model or change your mind mid-drawing.
  - **An id keeps its NUMBER and swaps its head**: `J12` → `N12`. The number is what the user knows
    the element by and what every note on their desk refers to.
  - **An id with no trailing number is left alone** (an imported `J-TF`, a typed `Tank Farm`):
    there is no number to keep, so a rename would be an invention, and those are exactly the ids
    somebody chose on purpose. A rename that would collide with an id outside the batch is skipped
    too. Both skips are counted and reported — a silent partial rename is worse than none.
  - **The subtle half of the collision rule**, and the one a shortcut gets wrong: a target held by
    a member of the SAME batch that is *not* moving (because it already has the target prefix) is
    still a collision — its id is never going to come free. "They are all in this batch, so it is
    fine" produces two elements answering to one id, and nothing else in the app would report it.
  - **The two-phase rename through temporary ids is INSURANCE, not a requirement** — worth stating
    plainly rather than dressing up. One batch is one element type with one prefix, so a member
    holding another's target must already carry that prefix and is therefore stationary: no cycle
    exists to break. It stays because it is four lines and takes ordering out of the reasoning, and
    the day an "apply all six at once" button arrives, cycles are reachable and the failure mode is
    a corrupted drawing rather than a refusal.
  - It goes through the same `applyNodeRename()`/`applyLinkRename()` a hand rename does — split out
    of `renameNode()`/`renameLink()` for this, because a second implementation is how a bulk
    operation quietly forgets one of the six places an id is written (scenario overrides, incident
    links, label anchors, pump `curveRef`, the DOM data attributes, `nextId`).

- 0|336| **Link label values on ONE LINE — SHIPPED 2026-08-15 with Task 333's second round.** Tom,
  2026-08-14: *"Concatenate pipe labels where/when possible. More readable."* Every data label —
  node and link — renders as one row, its values joined by the blanket separator, and a DRAGGED
  label goes back to a stack, which is the rule this task had already worked out (*"if they are
  dragged, they keep their prefixes, but go into multi-line mode?"*). `l.lx`/`n.lx` decides, so
  there is no new switch and double-clicking a label sends it home and back to one line.
  - **It shipped unconditionally rather than "where they fit"**, because the prefixes are what make
    a one-line label readable and they landed in the same change. A width test can be added later if
    a long label proves it necessary; it would be a second mechanism competing with Task 343's
    hide-priority order, which is the one actually aimed at "does not fit".
  - The separator is its own text SEGMENT, not appended to the value before it, so an extrema mark
    underlines the number alone and never the punctuation after it.

- 0|333| **Label prefixes, suffixes and one blanket separator — SHIPPED 2026-08-15, and the label
  COLOURS are gone with them.** Tom: *"(1) Let people specify label prefix and postfix/suffix in the
  Labels box. (2) No more label colors."* Every field's line is now `<prefix><sep><number><sep><suffix>`,
  all three editable per project in the Labels box, and the legend keys on the prefix instead of a
  colour swatch. Harness: `dev/lpn-spike/label-affix-harness.js`.
  - **Defaults**: `Q` flow and demand, `V` velocity, `S` gradient, `H` head, `P` pressure, `E`
    elevation, `Hl` head loss, `km` minor loss, `C`/`n`/`e` roughness (the one dynamic default — it
    follows the friction method at print time, which a stored letter could not), blank diameter and
    length. Separator defaults to a space, so `Q=12.5` is one keystroke rather than fifteen edited
    prefixes.
  - **Blank for ID is the one reading added to Tom's list**: his `J`/`R`/`P`/`L`/`V` letters are
    already on the map, because an ID is generated as `settings.idPrefixes[key] + n`. A prefix there
    would print `J J12`. The box still exists on that row for the user who renames their junctions.
  - **UNSET IS NOT EMPTY, and that distinction is the whole storage design.** A field with no stored
    affix takes its default; a field storing `''` has been told to print nothing. Collapse the two
    and a prefix cannot be turned off — it refills itself on the next rebuild. Same for the
    separator, whose own default is a space, so the test is on the TYPE and never on truthiness.
  - **The gradient's `%` stays automatic and lands INSIDE any user suffix.** It is read from the
    units strip on every rebuild because that family also offers plain rise/run, where the token
    would be a lie; a stored suffix could not follow the switch.
  - Extrema badges compare the rounded NUMBER, so affixes are applied to the finished line, after
    the comparison. The harness asserts the same pipes are marked with affixes as without.
  - **A prefix only has to be unambiguous IN ITS SLOT** (Tom, 2026-08-14: *"valve and velocity are
    okay since different contexts… Pump and Pipe are the same context, but we are calling them both
    L; so why not both P? Hah!"*), which is why `V` and `P` doing double duty across groups costs
    nothing.
  - Four new English keys (`lpn_labels_prefix_tip`, `lpn_labels_suffix_tip`, `lpn_labels_separator`,
    `lpn_labels_separator_tip`) are in the standing translation delta. The prefix STRINGS themselves
    are variable symbols and are not translated: they are user-editable per project, which is a
    better answer for a non-English user than 405 new strings.
  - **Not done here: the hide-last priority order** the original task paired with prefixes. Prefixes
    were the half that makes a priority order safe (any subset is self-describing); the order itself
    is now Task 343.
  - **SECOND ROUND, same day, after Tom used it.** Four changes and one replacement:
    - **The '=' moved INTO the prefix strings** (*"Make the initial defaults for prefixes include an
      '=' so that is user supplied"*), so a prefix is printed exactly as typed and the page inserts
      nothing of its own. `Q=`, `V=`, `H=`, `P=`, `E=`, `Hl=`, `km=`, `S=`, `C=`/`n=`/`e=`.
    - **The blanket separator changed jobs**: it is what goes BETWEEN VALUES (*"(', ', ' ', '|')"*),
      not between a prefix and its number. Default still a space, and stored exactly as typed —
      two of the three forms he named carry their own spaces, so nothing may trim it.
    - **One line unless dragged** (*"Make them all one line unless dragged"*), which is Task 336
      landing at the same time. `l.lx`/`n.lx` decides, as that task predicted.
    - **The ID row reserves the decimals column** so its two boxes line up with every other row's,
      and carries its own tip saying to leave it blank for the automatic `J1`/`L1` prefixes. A tip
      rather than a parenthetical in the label, because label strings are shared with the legend and
      a parenthetical would print on the map.
    - **The extrema badge is replaced by text-decoration** — overline for the max, underline for the
      min (*"Extrema are not placing right. This is a perpetual problem. Should we replace them
      with underline for min and overline for max?"*). Yes. **Tom rejected exactly this in July
      2026 as ambiguous, and that objection was fair AT THE TIME**: the mark sat on a bare number in
      a column of bare numbers. Two things changed under it — every value now carries a prefix
      naming its quantity, and the values sit on one line — so the mark is attached to one named
      number rather than floating in a stack. **The structural argument is the stronger one**: a
      badge had to be POSITIONED (measure the digits, know the row, inherit the label's transform,
      tear down and rebuild), and every one of those was a real bug at some point — orphaned glyphs
      beside a rotated label, marks left behind by a deleted pipe, a footprint four other consumers
      measured wrongly (Task 298). A text-decoration is drawn by the text engine at the exact
      extent of the characters it marks, at any rotation, in any row, for free.
      `labelBoxWidth()` is the text again, `measureDecorRight()`/`applyExtremaTicks()` are gone,
      and `dev/lpn-spike/label-decor-harness.js` is half its old length.
  - **THIRD ROUND, same day, after Tom used THAT.** Three more:
    - **Elevation is `Z=`**, the surveyor's letter for a vertical ordinate.
    - **A node label is always a stack; a link label is one line unless dragged** (*"I think that
      either junction labels in home position should be multiline or it should be a project toggle.
      Probably just multiline."*). The asymmetry is the geometry, not a compromise: a link label
      lies along a PIPE and competes for length, which is the whole argument for concatenating,
      while a node label hangs off a POINT with open space above and below — and carries up to five
      fields against a link's typical two.
    - **Demand and flow were pooled into one extrema comparison, and un-pooled the same day** —
      recorded because the idea looks obviously right and will occur to the next reader too.
      Tom asked for it (*"I think they should be aggregated for evaluation"*) on seeing two
      "highest Q" marks; the two turned out to be a junction's **demand** and a pump's **flow**, not
      the pipe-versus-pump split they looked like, so nothing was actually inconsistent. He called
      the revert himself once that was clear.
    - **The reason it stays split is stronger than the reason it was tried: a pooled Q can only ever
      be answered by a LINK.** A source carries the sum of every demand downstream of it, so the top
      mark lands on a pump or a supply main every time and *"which junction draws the most"* — a
      question a designer genuinely asks — stops being answerable at all. Consistency of the prefix
      is not worth the loss of a whole comparison. `label-affix-harness.js` asserts the split so the
      third attempt fails a check instead of shipping.
    - Worth keeping for its own sake: **a report can be wrong about the mechanism and right about
      the symptom**, and the symptom is the half only Tom can see. Check the mechanism before acting
      on it — here that took one headless run against his own file.


- 0|304| **The project file's NAME and EXTENSION — CLOSED 2026-08-14, ratified by Tom.** The
  answer is *not an extension*: stay on `.json`, shorten the suffix to `-lpn`, and put the identity
  INSIDE the document (`format: 'hawsedc-lpn'`, `app: <canonical URL>`). This task asked the
  question; Task 315's research pass had already answered it the same day, which is why the two
  closed together rather than sequentially — worth noticing, because 304 sat at priority 85 and 315
  at 75 while 315 held the finished answer to 304. **A researched conclusion parked in a
  lower-priority task is invisible to whoever is reading the top of the list.**
  - **The reasons a generation-1 extension was declined are about TIMING, not letters**: the schema
    is still moving (scenarios and valves landed this month, extended-period is queued), the product
    name is unsettled so `.lwj`/`.wnj` would encode a name that does not exist, and the only real
    payoff of a custom extension — OS double-click association and a file-manager icon — is
    something a web page cannot deliver at all. When the trigger fires (a PWA `file_handlers` entry,
    or the product name settling), the choice is `.lpn`; the collision research is in the archive.
  - Reading was already permissive and stays so. Full record, including the rejected `name.lpn.json`
    pattern and the extension collision survey, in `dev/roadmap-closed-archive.md`.
- 0|315| **The 30-character filename — CLOSED 2026-08-14.** `<Name>-lpn-hawsedc-engcalcs.json`
  became `<Name>-lpn.json`, 30 characters to 4, and `serializeProject()` now writes
  `format`/`app` as its first two keys. The four call sites moved together: `projectFileName()` (now
  takes a name, so `saveAs()`'s copy branch routes through it instead of spelling the convention out
  a second time), `projectNameFromFileName()`, and the marker at the source.
  - **THE REASON THE SUFFIX COULD SHRINK is the marker, and the order matters.** There was no format
    identifier in the file at all — `v` is a version number and nothing said what it was a version
    *of* — so "identifiable a year later in a forgotten folder" rested entirely on the filename,
    which is precisely the thing a person renames. Cutting the name without adding the marker would
    have been a straight loss.
  - **TASK 315 PREDICTED THE WRONG HAZARD, and the correction is the useful part.** It said the rule
    was "strip the longest suffix first", reasoning that `-lpn` matches inside
    `-lpn-hawsedc-engcalcs`. Measured 2026-08-14: with `$`-ANCHORED strips — which is what the code
    has always used — **order is harmless**, because `/-lpn$/` cannot match a string ending in
    `engcalcs`. Longest-first only matters if someone drops the anchors. The defect that IS real is
    applying BOTH strips in sequence, which is exactly what the obvious chained-replace
    implementation does: a project a user genuinely named `Z-lpn` was written as
    `Z-lpn-lpn-hawsedc-engcalcs.json` and re-opens as `Z`, four typed characters gone.
  - **Why a bad strip here is expensive rather than cosmetic:** `saveCurrent()` treats a filename
    differing from the suggested one as a DELIBERATE RENAME. Before this change a legacy file's name
    and its suggestion were identical, so that branch slept; now they differ BY CONSTRUCTION, so it
    fires on every re-save of every pre-existing file and whatever the strip returns becomes the
    user's project name. `dev/lpn-spike/file-naming-harness.js` (22 checks) pins the round trip, both
    suffixes, the overlap, and the marker.
  - The `dev/browser-pass/` specs were deliberately LEFT on the long suffix — they now exercise the
    legacy read path in a real browser, which still has to work forever, while the node harness
    covers the new one.

- 0|184| **Project/scenario model: the DELTA model — CLOSED 2026-08-14.** One save, a canonical Base,
  scenarios that are nothing but collections of overrides. Shipped and reviewed the same day; the
  three rulings (push CLEARS rather than overwrites; the count reads "Own values"; the marker is
  INTENT, never a diff) are in `dev/roadmap-closed-archive.md` with the full 288-line record, which
  is a DECISION record and was never a build task. Remaining UI polish is Task 201; the per-element
  push is Task 317, closed the same day.
- 0|317| **Push Base values PER ELEMENT — CLOSED 2026-08-14.** `pushBaseToScenarios(el)` takes an
  optional element instead of forking: one count, one confirm, one undo snapshot, so a confirm can
  never promise a different blast radius from the one that happens. The button lives in the
  element's own popup (Base only, absent rather than disabled) and reuses the scenario menu's own
  two strings — it is the same action, narrowed by where it is. It also filters the property list
  to the element's GROUP, which is the only part of the scoping a user sees. Per-property-per-element
  is the third level and is still not wanted. Harness section 7b in `dev/lpn-spike/scenario-harness.js`.
- 0|326| **The paper-units paradigm — CLOSED 2026-08-14 as ALREADY DELIVERED, and it was never a
  build.** Tom, asked whether to store paper heights and a drawing scale: *"I don't think we store
  anything as paper heights. I was just fleshing out a paradigm. Everything is in pixels... drawing
  scale doesn't factor into this project at this time... this task seems to be a mirage after all."*
  What the paradigm actually asked for — an ABSOLUTE frame for sizes, so a size means the same thing
  on Net1 and on a state-plane model — shipped as Task 331's screen pixels. `dev/sizing-paradigm.md`
  stays as the reasoning, and is HISTORY, not a spec: nothing in it is queued work.
- 0|328| **The leader stored the TEXT's corner, so the angle slid with the zoom — CLOSED 2026-08-14.**
  `n.lx/n.ly` now hold point B itself (world units, the user's) and `dataLabelOrigin()` hangs the
  text off it in pixels (ours, free to flip sides). Tom had to report it three times; a
  right-hanging label was always correct, which is why one-sided testing missed it.
  `dev/lpn-spike/leader-angle-harness.js` runs both sides over a 64x zoom sweep. A pre-328 save
  reads its offset as B — exact on the right, one box width off on the left, not migrated because
  the old width depended on the zoom it was last drawn at.
- 0|341| **A pipe too short to carry its label does not carry one — CLOSED 2026-08-14.** Tom: "if a
  line is too short, its label must disappear even if the map is closer than the all-disappear
  limit." `linkLabelTooShort()` compares the pipe's world length against `labelBoxWidth()`, which is
  pixel-derived and therefore ~1/zoom — so the label returns at exactly the zoom where it fits, with
  no setting. **A DRAGGED label is exempt** (Tom's own hedge, same day): dragging one off a stub is
  how a user says they want that number, so the gesture is the escape hatch. Harness:
  `dev/lpn-spike/short-line-label-harness.js`.
- 0|335| **Store a dragged label's offset in screen pixels — SUPERSEDED by Task 328, not shipped.**
  It would have held the leader angle steady, but by storing the wrong thing: a pixel offset says
  "40 px from the node", where the user meant "over there, in the drawing". Tom's leader-endpoint
  design holds the angle by construction and keeps the intent. Recorded because the reasoning that
  killed it is worth having — see `dev/roadmap-closed-archive.md`.
- 0|319| **Accept-Language log injection, in five copy-pasted writers — CLOSED.** `ecBrowserLangTag()`
  in `lib/config.inc.php` filters to `[a-z0-9-]` and truncates rather than rejecting (a long header is
  a real browser's, not an attack). All five writers call it, and
  `dev/scripts/browser_lang_tag_check.php` is blocking in `check_all.sh` so no sixth can reintroduce
  the raw read. Narrative in `dev/roadmap-closed-archive.md`.
- 0|331| **GIS paradigm phase 1: text/symbol/pipe sizes are three independent SCREEN-PIXEL settings,
  and labels hide by map width.** Deleted `textSizeUnits`, `symbolScale`, both pixel floors and
  `importTextSize()` — the paradigm keeps removing controls rather than adding them. `labelMaxWidth`
  (model length units, captured from the current view) hides GENERATED ANNOTATION: data labels, their
  masks and leaders, and flow arrows; never the network or the user's own Text labels. Storage v5->v6
  discards old map-unit sizes rather than inventing a conversion factor. Narrative in
  `dev/roadmap-closed-archive.md`; the ill-posedness it exposed is Task 332.
- 0|324| **[DONE 2026-08-14] Scenario overrides no longer collide between a node and a link sharing
  an id.** One flat map keyed by bare id met EPANET's two namespaces: re-measured, **Net1 has 7
  shared ids, Net2 35, Net3 72** — even the smallest EPA example collides, which the task did not
  know. The halo Tom saw was the harmless half; `active` is on both groups, so unticking "Part of
  this network" on a junction silently dropped an unrelated pipe out of the SOLVE. Now keyed `n:20`
  / `l:20` through one `ovKey()` seam, storage v4→v5 with a migration that states its rule. Harness
  drives an IMPORTED network, because the editor refuses duplicate ids and a hand-built fixture
  could never reach this state. Full record: `dev/scenario-seam-repair.md`.


- 0|318| **[DONE 2026-08-14] The offline promise is now TRUE, and verified on a real device.**
  `sw.js` precached bare paths while every page requested `?v=<filemtime>`, and `cacheFirst()`
  matched the exact URL including the query — so 22 of 25 precache entries could never be served and
  the About page's "visit any calculator, then all of them work offline" was simply false. Replaced
  by a generated `sw.php` (deployment is `git pull`, and **git does not preserve mtimes**, so a baked
  file could never carry the values pages request). `CACHE_VERSION` retired; both lists derived from
  the filesystem, picking up six missing modules and Branched-Network, a whole calculator.
  `dev/scripts/sw_manifest_check.php` renders 21 pages and diffs 174 asset URLs against what the
  worker will really cache.
  **TOM CONFIRMED IT OFFLINE, 2026-08-14**: one calculator loaded online, network set to Offline,
  then Branched-Network — never opened on that device, and absent from the old precache entirely —
  rendered and computed, fully styled. That is the claim observed rather than reasoned about.


- 0|323| **[DONE 2026-08-14] Scenario writes that bypassed `setProp`: the valve popup, `lenAuto`,
  blank overrides, and a stale count.** Five confirmed defects from the Task 184 x Task 248 merge,
  all fixed, plus `dev/scripts/scenario_seam_check.php` (blocking) so the seam cannot be bypassed
  again — it derives the property list from `LPN_OVERRIDABLE` and fails rather than passing if that
  parse breaks. **The lesson is the asset: the two worktrees had DISJOINT FILE TERRITORY exactly as
  CLAUDE.md requires and still collided, because what they shared was a SEAM, not a file.** Neither
  harness could see it — `scenario-harness.js` never said "valve", `valve-harness.js` never said
  "scenario". Brief: `dev/scenario-seam-repair.md`.


- 0|320| **[DONE 2026-08-14] Moved `## Completed` into the archive: ROADMAP 7,067 -> 3,325 lines
  (-53%).** 143 blocks moved, 108 already-short ones left, 251 IDs before and after, every moved
  block verified present in `dev/roadmap-closed-archive.md` byte-for-byte. Two deploy facts found
  buried in closed blocks were promoted to CLAUDE.md rather than archived — the `AllowOverride
  Options` grant whose absence 500s the whole suite on a host move, and the untracked `sitemap.xml`.
  A third finding became a check: `Task 241` was cited four times from live code and had never
  existed, so `roadmap_id_check.php` now fails on a code comment citing a task that does not resolve.


- 0|216| **[DONE 2026-08-14] Outbound reference-link clicks are logged, with the visitor's
  language.** `outbound` rows in the new `SIGNAL_LOG`, reported by destination, served language and
  page. **One `click` listener on `document`, not a per-link attribute** — `mpf_friction_slope`
  carries its own `<a>` inside all 27 lang files. Test is "out of /engcalcs/"; host and path only.
  Narrative archived.

- 0|200| **[DONE 2026-08-14] Usage logging: the questions the report could not answer.** Built
  `touch`, `units`, `repeat` and `lpn` events in ONE new `SIGNAL_LOG` with an event column;
  leftovers extracted to Task 303. **The `ec_seen` digit is FULL** — five bits is one base-32 digit,
  which is what the consent banner promises — so these dedupe in page memory and store nothing.
  Narrative archived.

- 0|302| **[DONE 2026-08-14] The looped network reported NEGATIVE velocities.** `lpnReport()`
  computed `Q/A` from the SIGNED flow, so a pipe carrying flow against the direction it was drawn in
  reported a negative speed and sorted to the bottom of every extrema range. **A velocity is a
  speed; direction is carried by the flow's sign and the map's arrow.** Fixed in `js/lpn-solver.js`;
  EPANET agrees.

- 0|301| **[DONE 2026-08-14] The click that ended a backdrop Move also acted on the node it landed
  on.** Registration listens in the CAPTURE phase and clears `regMode` there, so the tool's own
  bubble-phase `pointerup` ran with the flag already false. Fixed by gating the tap's START. **A
  flag cleared inside a capture-phase listener is already false for every bubble-phase listener on
  the same element.**

- 0|311| **[DONE 2026-08-14] Two errors in Manning Trap Channel's Maynord riprap column, one ~4x
  unsafe.** The bend factor was on the wrong quantity and inverted (the source raises VELOCITY), and
  the `(Ss-1)` exponent had lost a digit. Bend factor is now 4/3 per California Division of Highways
  (1970), and `mtc_d50_mra`'s tip says so. Searcy's 0.022 was challenged and SURVIVED. Narrative
  archived.

- 0|313| **[DONE 2026-08-14] Timed both engines; the EPANET Workspace and Project now live across
  solves.** `lpnSolveEpanet()` was re-instantiating the WASM engine on every solve: 9-10 ms, not the
  1.25 ms the first bench reported — that bench hoisted the Workspace out of its own loop and so
  measured a shape the shipped code never had. Now 0.41 ms at 21 nodes, 3.19 ms at 201 (native: 0.30
  and 33.7). `dev/lpn-spike/session-harness.js`, 121 assertions plus a self-sabotage check every run.
  **The default stays `native` for the 663 KB module load alone — a bandwidth argument, never a speed
  one.** Full narrative: `dev/roadmap-closed-archive.md`.

- 0|312| **[DONE 2026-08-14] A new background image landed at the world origin, not on the model.**
  `initialBackdropPlacement()` now centres on `bbox()` as well as sizing to it. Also gave
  `downscaleImage()` an `onerror` and replaced the MIME `accept` with 10 explicit extensions. **The
  test for a format is whether somebody turns up holding one, not whether a browser can decode it.**

- 0|309| **[DONE 2026-08-14] The extrema badge was not part of the label's footprint.**
  `measureDecorRight()`/`labelBoxWidth()`; the leader, collision boxes, mask rect and `bbox()` all
  read the wider number, measured per line. Task 190's marks toggle needs no code of its own — marks
  off means no decorated line means zero reserved. Harness: `dev/lpn-spike/label-decor-harness.js`.

- 0|295| **[DONE 2026-08-14] Manning Trap Channel's roughness/rock iteration converged on a
  different answer depending on where you started.** `n_strickler` was computed ONCE before the loop
  while its three siblings were recomputed every pass: five starting guesses gave
  0.683/0.542/0.376/0.298/0.220 in, now 0.894 from all five. **A fixed point that moves with the
  initial guess is not converged.**

- 0|308| **[DONE 2026-08-14] Two defects in Manning Trap Channel, both in `mtc_iterate`'s loop-exit
  condition.** A roughness radio with no rock radio ran one pass, so v/Q/Froude came from the typed
  n, not the displayed one; and the safety factor was applied to a typed d50. **A trigger heals a
  stale OUTPUT; it cannot heal a wrong INPUT** — `solveForY` returned 66.97 cfs when asked for 60.

- 0|292| **[DONE 2026-08-13] Give the non-lpn calculators a behavioural test.** `dev/calc-spike/`
  plus `dump_calc_form.php` and `render_page.php`, blocking in `check_all.sh`. All 15 pages
  smoke-tested in both presets; `mpf` and `mtc` get worked examples. **Nothing about the form is
  restated in a harness.** Durable rules: CLAUDE.md § The review office. Narrative archived.

- 0|293| **[DONE 2026-08-13] Extract the pure functions out of `js/looped-network.js` so the map
  editor becomes testable.** Shipped `js/lpn-geom.js` and `js/lpn-collide.js` with two harnesses
  that `require()` their subject. **Split by PURITY, not by subject** — the pattern is in CLAUDE.md.
  Proved behaviour-preserving by a 24,000-case fuzz against `git show HEAD:` first. Narrative
  archived.

- 0|300| **[DECLINED 2026-08-13] A "New project" wizard picking units AND friction method.** The
  six-row arithmetic was right and the premise wrong: **the danger of a wrong unit or method is
  about EXISTING numbers changing meaning, and a blank project has none.** Tom: *"It amounts to
  nothing but advertising."* Route such impulses to Task 222 and Help, never the New menu. Narrative
  archived.

- 0|271| **[DONE 2026-08-13] Give `lpn_` a friction-method choice: HW, DW, Manning.** A Settings
  select writes `settings.method`, which `frictionMethod()` had read since Task 254 with nothing
  writing it. Labels borrowed from `bpn_`, so no new keys. **`roughnessSI()` is the dangerous line**
  — DW's e is a LENGTH and must reach the solver in metres, while n and C must NOT be converted.
  Narrative archived.

- 0|146.07| **[DONE 2026-08-13] Open/Closed link property (Task 146 child).** The feature was ~90%
  built and unreachable — `_status` was already serialized, overridable, solved and parsed from
  `.inp`; all that shipped is one checkbox and a dashed map style. **The label is "Closed", not
  "Open"** — the state worth seeing is the exceptional one. 18 checks. Narrative archived.

- 0|250|[H] **[DONE 2026-08-13] Where do we explain lpn at all? A Help menu on the page.**
  `openHelpMenu()`: Walkthroughs, Contact, About, all reusing existing keys, so zero new
  translation. The navbar duplication is deliberate — the navbar serves somebody CHOOSING a
  calculator, this menu somebody already inside one. Residual: `About.php` never names EPANET, which
  is Task 222's.

- 0|249| **[DONE 2026-08-12, closed 2026-08-13] Translate the 5 `lpn_` engine keys — into all 26.**
  They rode along with `lpn_`'s promotion to a core calculator in the Task 297 sprint rather than
  being scheduled separately, exactly as this task predicted. Verified in zh, sw and am;
  `lang_parity_check` reports 0 missing and 0 equal-to-english suite-wide.

- 0|240| **[DONE, closed 2026-08-13] `lpn_project_copy_suffix` carries a load-bearing leading
  space.** Fixed: the English key is `'(copy)'` and both call sites concatenate the separator; all
  27 files re-checked. **The `lpn_ago_*` half was WITHDRAWN — the finding was wrong**: `"ago"` lives
  in the host sentence, never the fragment, so Spanish always composed correctly. Narrative
  archived.

- 0|146| **[DONE 2026-08-13] Looped pipe network calculator with a map interface — `lpn_`.** Full
  design record: **`dev/looped-network-calculator-scope.md`** (GGA not Hardy Cross, the 10–20 node
  target, the cut list, the backdrop reasoning). **Closed with four children still open, and that is
  correct: a parent feature task closes when its scope is SHIPPED, not when its idea list is
  EMPTY.**

- 0|177| **[DONE 2026-07-30, closed 2026-08-13] Link head loss: report the per-length gradient.** It
  shipped 2026-07-30 and nobody closed the task, so it sat open at priority 20 for six weeks. **This
  suite's own dimensionless convention won; EPANET's per-1000-length form was not introduced.** The
  divisor is `linkLengthSI()`. **Deleting an open task is not the same as closing it.**

- 0|209| **[DECLINED 2026-08-13] A snoozable tip system (originated during Task 146).** Tom: *"we
  are getting along fine without tips especially since adding the Walkthroughs."* The problem was
  real — only shown-once-ever or shown-every-time — and the answer turned out to be **a place a user
  can go and look, not a mechanism for interrupting them.** Reopen only for something that must
  speak up.

- 0|299| **[DONE 2026-08-13] A wrong `layout:` tag misled four translators, and now a check catches
  the class.** `dev/scripts/layout_tag_check.php`, blocking; the rule is in CLAUDE.md. **The
  mutation test is the finding:** it caught 3 of 4 planted defects but silently passed the exact
  defect it was written for. **Plant the bug before believing the check.** `mi_d50in` deleted.
  Narrative archived.

- 0|297| **[DONE 2026-08-13] ONE sprint cleared the whole standing translation backlog.** 26 Sonnet
  agents at once, 364 strings; delta zero, drift empty, 19 friction entries closed. **Wave 0 deleted
  a feature rather than rewording it** — *a string that describes what the program DID is a claim
  nothing checks.* One defect survived to QA, caught only by reading all 26 values side by side, now
  in QA.

- 0|291| **[DONE 2026-08-13] Suffix vocabulary the hygiene check cannot judge, and a human did.**
  Eleven renames via `rename_lang_key.php --apply`, so no translated value changed and no sprint was
  owed. Each of the three excluded groups needed a different answer, which is why they stay out of
  the check: `_help` collided with `.ec-help`; `_title` carried two meanings; `_prompt` keys that
  ask nothing became `_alert`. Narrative archived.

- 0|276| **[DONE 2026-08-13] Precise background-image scaling: type the number, or hand over a world
  file.** The backdrop menu offers "Scale by picking" and "Scale by World File or pixel size" — one
  box taking either. A file that rotates, mirrors or unevenly stretches is refused with a message,
  never half-applied. `backdrop-scale-harness.js`, 32 assertions including the Cartesian-to-Y-down
  flip.

- 0|310| **[DONE 2026-08-13] `Compare-Languages.php` no longer fatals on a bare visit.** Unknown or
  missing `lang1`/`lang2` now render a two-select picker instead of reaching
  `require('lib/lang.ec..php')`. Also dropped the unconditional `echo "$langDir"` that printed the
  absolute server path on every comparison.

- 0|251| **[DONE 2026-08-13] Promote `lpn` to a core calculator — all 26 languages, 6,522 keys.**
  `lpn` is now core in `translation_coverage.json`. **Wave split retired, ~50-key batched appends
  kept** — rule in CLAUDE.md, evidence in `dev/sprint-251-waves.md`. **Verify on disk, never on an
  agent self-report.** Follow-on sprint 252 in `dev/translation-execution-log.md`.

- 0|296| **[DONE 2026-08-12] The word "water" appeared nowhere in `lpn_`'s name, title or
  description.** Retitled water-first ("Water Supply Network"; "…Water Distribution Network
  Calculator with the EPANET Engine"). **"WITH the EPANET engine", never "EPANET-powered"** — the
  default engine is native and our own tooltip says so, so the stronger claim would make the page
  argue with itself. Narrative archived.

- 0|288| **[DONE 2026-08-12] The unique identifier is gone. What is stored is one digit per page.**
  `PHPSESSID` removed outright, not gated — every session value asked "have we already counted
  this?" and none needed an identifier. `ec_seen` is one base-32 digit, which is what makes the
  banner's sentence literally true. Rules live in CLAUDE.md § What may be stored. Narrative
  archived.

- 0|290| **[DONE 2026-08-12] Six Rock Chute notes were written, translated into 26 languages, and
  rendered by nothing.** `Rock-Chute.php` displayed one of its seven; `rc_notes_7_term` existed in
  no language. Restored in language-file order so the bibliography is not in the middle. **A missing
  `<dt>`/`<dd>` pair looks like nothing at all** — `key_hygiene_check.php` found it in its first
  run.

- 0|289| **[DONE 2026-08-12] "Show page titles" — the first setting on lpn that is not part of the
  project.** **Why it is NOT project-scoped is the durable part:** whether a heading shows is about
  the window the person sits in front of, not data about the network, so it is `localStorage` and
  `serializeProject()` must never learn about it. The Settings box now has two scopes.

- 0|287| **[DONE 2026-08-12] Serve Bootstrap from this site instead of jsDelivr — the last third
  party is gone.** The vendored files' sha384 digests match the old SRI hashes, so they are
  byte-identical; that check is also the upgrade procedure. **Four places, and the fourth bites**:
  both header tags, the parent site's copy (not in git), `STATIC_ASSETS`, and `sw.js`'s branches —
  with `CACHE_VERSION` bumped.

- 0|196| **[DONE 2026-08-11] EPANET `.inp` IMPORT (Task 146 child). Export is NOT built — Task
  281.** A separate File row from Open…, since an `.inp` has no docId or handle and must not promise
  a round trip. **Import the supported subset and REPORT every difference, never reject.** Two
  EPANET behaviours were MEASURED because the obvious reading is wrong and silent: `[DEMANDS]`
  REPLACES the `[JUNCTIONS]` demand, and a TCV's loss is its SETTING ALONE. Narrative archived.

- 0|270| **[DONE 2026-08-10] Audited lpn against Tom's three blog checklists.** Report:
  `dev/lpn-new-user-guide-audit.md`; the New Shopper list is where most of the drift is. Of 10
  findings, 1 retracted, 1 downgraded, 1 strengthened, 2 fixed. **The retraction is the lesson: I
  read a JS fallback literal instead of `lang.ec.en.php`. Read label claims out of the lang file,
  always.**

- 0|265| **[REVERTED 2026-08-10, same day it shipped] Units do NOT go on the browser tab.** The
  map's status strip already answers it continuously; a tab is a second copy free to drift. **What
  survives:** `lpn_title_units` in the example's title block, with the label FORCED by the caller —
  *"We never create an example based on the current units."* Do not store "US"/"SI". Narrative
  archived.

- 0|274| **[DONE 2026-08-11] The user works in Cartesian coordinates; Y increases upward.** One
  self-inverse `cartesianY()` at the four places a coordinate reaches or leaves the user. **The flip
  is at the USER boundary, not in the world transform** — `doc` stays Y-down because that is SVG's
  own system, so the drawing is pixel-identical and only the numbers changed. Narrative archived.

- 0|277| **[DONE 2026-08-10] Moving something is undoable.** No drag handler snapshotted, so Undo
  after a drag reverted the last DISCRETE act and left the drag standing. `snapshotDragOnce()` at
  the head of all five mutating branches — **lazy, on the first frame that moves something, not on
  pointerdown**, since every select-mode press opens a drag record. Pan and pinch excluded: they
  move the camera.

- 0|275| **[DONE 2026-08-10] The Settings panel says "Saved with this project."** One note at the
  head of the panel (`lpn_settings_scope_note`, translated in the core four). Verified true of the
  panel entire before writing it: `serializeProject()` carries `settings`, `labelSettings`, `units`
  and `backdrop`, so there is no exception to hedge. It is what makes the New User template flow
  legible — there is no "save as my defaults" because saving the project IS that.

- 0|273| **[DONE 2026-08-10] The tab strip's `+` opens the New project chooser.** It called
  `newProject()` directly, inheriting whatever units were on the strip — the last place a project's
  units were decided by accident, and the one Task 264 removed from File > New. Both doors now ask
  the same question, and both inherit Task 271's wizard when it lands.

- 0|263| **[DONE 2026-08-10] Inputs are stored as declared; nothing converts them on a unit
  change.** `lpn_` stored SI and displayed the conversion, so a unit switch silently rewrote the
  whole map. Now conversion happens at the solver handoff and on results coming back, nowhere else.
  **The project owns its units**, so there are no browser units and no "save as defaults"
  (CLAUDE.md). Narrative archived.

- 0|264| **[DONE 2026-08-10] "Draw example network" retired; File > New project instead.** A real
  fly-out whose rows are Blank project US/SI and two examples. **Each example commits to a unit
  system rather than adapting to yours**, which unblocked Task 263 — and a blank row that inherited
  the strip was the last place a project's units were decided by accident. Narrative archived.

- 0|268| **[DONE 2026-08-10] lock-free / unlocked / unchained added to `menu_libre`'s synonyms.**
  Tom's order, most-liked first. English `menu_libre` unchanged — still an open question whether
  "Lock-free Software" is a better nav item than "Libre Software"; it needs no `avoid: gratis` guard,
  which is an argument for it.

- 0|262| **[DONE 2026-08-10] A file opened in a no-connect browser arrived already asterisked.**
  `importProjectFromFile()` now sets `savedSig`/`dirty`/`exported` as the download path does — a
  file handed to us off the user's own disk is the strongest case of "a copy exists on disk".
  **Recent files is absent in a no-connect browser and that is correct**: with no handle, the list
  could name only files it cannot open.

- 0|261| **[DONE 2026-08-10] A Computation section in lpn Settings.** Convergence tolerance and the
  EPANET engine toggle had accumulated loose in the headingless tail among the panel's *actions*
  (Restore defaults, Clear calculator), so a reader could not tell where the settings stopped. One
  setting there was fine; two were a group without a name. The tail now holds buttons only.

- 0|260| **[DONE 2026-08-10] The lpn map canvas is plain white.** Tom, very high priority. Was
  `#f7f7f2` in three places — `css/engcalcs.css` (twice, including `--lpn-map-bg` behind the symbol
  occlusion patches) and the inline `background` on `#lpn_canvas` in `Looped-Network.php`.

- 0|259| **[DONE 2026-08-10] Navbar overlap just above the hamburger breakpoint.** Bootstrap's
  `.navbar-expand-lg` pins the expanded bar to `flex-wrap: nowrap`, so from 992px to ~1150px nothing
  yields and every nowrap item spills out of its shrunken box. `css/engcalcs.css` now lets the
  navbar wrap in that band. "Libre Software" also now links to the README's `#license` section.

- 0|258| **[DONE 2026-08-10] File > Recent files on Looped-Network.** Up to 8 file handles in a
  second IndexedDB store that outlives the projects — `handles` is deleted on close, which is why it
  could not carry this. Deduped by `isSameEntry()`, not by name; clicking a row spends the click as
  the user activation `requestPermission()` needs. 26 checks, mutation-tested.

- 0|225| **[DONE 2026-08-09] The `lpn_` punch-list leftovers — small, confirmed, none dangerous.**
  Full wording in `dev/lpn-file-lock-test-punchlist.md` § Findings. Closing a tab now activates the
  next tab RIGHTWARD; a diagnostic status only temporarily outranks a notice instead of eating it;
  the "gone for good" prompt no longer fires for an empty untouched project. §13 split out as Task
  225.13.

- 0|252| **[DONE 2026-08-09] Reorder project tabs, left/right, via the tab menu.** Built the cheaper
  of Tom's two options because it works on touch, where dragging fights the scroll gesture:
  `openProjectMenu()` gained Move left / Move right rows, backed by `moveTab(id, dir)` swapping
  position in `library.projects`. New keys `lpn_tab_move_left`/`_right`, English plus the core four.

- 0|256| **[DONE 2026-08-09] `dev/lpn-spike/popup-tips-harness.js` was dead** — `MODULE_NOT_FOUND`
  before a single check ran, so its ~60 assertions had been reporting nothing. Four causes fixed.
  **New `dev/scripts/run_harnesses.sh`** runs every lpn harness and fails on the first non-zero exit
  — the actual fix for "nothing runs these harnesses", which is how this went red for weeks.

- 0|255| **[DONE 2026-08-09] `lpn_` was solving US networks with the length in the wrong unit; head
  loss was 3.281x too high.** `assembleModel()` handed a declared length straight to an all-SI
  solver. Fixed by `linkLengthSI()`. **Verified against a HAND-COMPUTED case, never the other
  engine** — both read the same model, so both were wrong and agreed. **A check that never crosses a
  unit boundary cannot find a unit bug.** Published US answers changed. Narrative archived.

- 0|254| **[DONE 2026-08-09] The lpn example network is a real ring main, at project scale.**
  Reservoir, pump, a five-junction ring with a hydraulic divide, a separate gravity system inside
  the ring, four Text annotations composed from existing keys, 1400 × 700 on 5000,5000. **Map
  coordinates FOLLOW the Length/Map declaration**, so it is a 1400 ft ring in US and 1400 m in SI —
  accepted only while there is no backdrop. Narrative archived.

- 0|243| **[DONE 2026-08-09] Real EPANET engine in `lpn_`, as an opt-in second engine.**
  `js/lpn-epanet.js` + `js/vendor/` (epanet-js 0.9.0, MIT), off by default and lazy-imported, so the
  offline case pays nothing. **Manning is a real 0.6% disagreement and we KEPT OURS** — EPANET's
  would desync this page from the Manning calculators that carry most of our users. **Do not
  relitigate.**

- 0|245| **[DONE 2026-08-09] About-page resync + `menu_libre` into all 26 languages.** Every
  language used its own established free-software term; not one transliterated "libre". **Found a
  silent parse-truncation bug in `lang_parse.inc.php`** — Burmese at 3 bytes/char exhausted PCRE's
  JIT stack and the unchecked `preg_match_all` truncated a parse to 386 of 563 keys, blinding four
  tools at once.

- 0|146.10| **[DONE 2026-08-09] Real element symbols on the lpn map, from the Task 231 icon set.** A
  reservoir and a junction had been the same `<circle>`, and a pump had no symbol at all. Toolbar
  icons are reused verbatim as map marks over an invisible-but-clickable original, so hit-testing,
  labels and `bbox()` are untouched. All four size constants are deliberately experimental.
  Narrative archived.

- 0|235| **[DONE 2026-08-09] The glossary's `pressure` and `elevation` entries no longer hold the
  UPSTREAM label form in any of the 26 languages.** Both were created by harvesting the attested
  forms of `hw_pressure_up`/`hw_elev_up`, and **the entries' own notes said so — the defect was
  documented as a feature.** Caught by the tr translation agent, who declined to apply it. Spun off
  Task 242.

- 0|238| **[DONE 2026-08-08] "Map display and sizes" fixed at the source; "Restore defaults" audited
  in all 26.** The English was the defect — an ambiguous coordination — so fixing it fixed all 26 at
  the source. `calc_defaults` was audited by **cross-checking each language against ITSELF** (every
  language ships the concept twice), which makes it auditable without 26 native speakers. Narrative
  archived.

- 0|237| **[DONE 2026-08-08] "Zoom to fit" shipped meaning "adjust the zoom" in 2 of 4 languages.**
  es and pt were wrong; fr and tr right. **The English is deliberately NOT reformed** — it is an
  established UI idiom and renaming a recognized control costs more than guarding it. The guard is
  the glossary concept `zoom to extents`, wired into `prefixToTermNames()` in the same commit.

- 0|236| **[DONE 2026-08-08] The last preview-era sentence is gone — Tom said delete.**
  `lpn_notes_3_def` still ended *"Because this is an early preview, please use it for small networks
  and for testing only."* Raised as a question rather than fixed inside the sprint, because it
  tangled a dead framing with a live scale caution and dropping a caution is not a sprint's call.
  Deleted from all five files.

- 0|146.06| **[DONE 2026-08-08] Translation sprint for `lpn_` strings (Task 146 child).** 223 keys ×
  es/pt/fr/tr; suite-wide `equal_to_english` went to 0. **A pre-sprint check caught the biggest risk
  before an agent was spawned:** `prefixToTermNames()` had no `lpn` or `bpn` entry, so Task 193's
  whole glossary seed was invisible. Also fixed a note claiming "English only for now" — **agents
  will faithfully translate a lie.** Narrative archived.

- 0|230| **[DONE 2026-08-08] The open-channel velocity verdict stopped citing water hammer.** Both
  Manning channel pages fed the verdict from `mhp_vel_high`, so a trapezoidal channel was told to
  check water hammer. A real `mtc_vel_high` now exists, translated into all 26 the same day —
  **inline by the orchestrating model; 26 paid agents for one string is the wrong shape.** Narrative
  archived.

- 0|232| **[DONE 2026-08-08] `Irrigation.php` removed — the page and its 17 keys are gone.** Tom
  called the menu entry "harmful and spammy". **The number that settled it: reach 1,977, confirmed
  humans 0, used 0** — pure crawler traffic, so there was no audience to strand. **`../sitemap.xml`
  is regenerated but NOT tracked by git** — re-upload it on deploy or the dead URL stays advertised.

- 0|231| **[DONE 2026-08-08] Toolbar: icon as a small prefix to the text, never icon-only.** Glyphs
  live in the markup, never in `$ec_lang` — a glyph baked into a translated value is 27 copies of
  one decision — so this cost no new keys. **Icon-only was rejected on the merits:** it saves no
  translation work and spends first-time comprehension. The A/B poll was rejected too. Narrative
  archived.

- 0|146.02| **[DONE 2026-08-08] EPANET-style icon toolbar — shipped as Task 231; map symbols
  extracted to 146.10.** One SVG icon set in `lib/Icons.lib.php` applied to the lpn menus and shared
  site chrome. **This task's gate on 146.06 is RELEASED:** it gated the sprint only against string
  churn, and icon-as-prefix added, renamed and removed zero language keys.

- 0|205| **[DONE 2026-08-08] One "contact me" line per page, not two.** `template_translation_help`
  and `echoHelpWanted()` deleted from 18 pages and all 27 files; `template_feedback` absorbed the
  wording ask and sits after the results — **give first, then invite**. The `[Hide this line]`
  toggle went too: a dismiss affordance is the visual grammar of a cookie banner. **"me", not
  "us".** Narrative archived.

- 0|229| **[DONE 2026-08-08] The drift tripwire can tell "no translator needed" from "nothing
  changed" — `detect_english_drift.php --update=<key>`.** A URL-only fix flagged CHANGED exactly
  like a rewritten sentence; a hash cannot see *why* a string moved. The tool **refuses to silence a
  key until every language file already carries the same URLs as English**, and records the reason
  in the manifest.

- 0|215| **[DONE 2026-08-08] The Title/Subtitle milestone is logged — the closest instrument this
  suite can build to its own mission.** Its own one-shot beacon, not a flag on the calc event, since
  a title is typed *after* the first calculation. **The typed text is never sent and never stored**,
  asserted as a standing property. Bound on `change`, so a value restored from a cookie fires
  nothing.

- 0|227| **[DONE 2026-08-08] `prod_smoke.php --links` now follows the links our pages emit.** Two
  sources — served pages AND all 27 lang files, since only one language renders per request.
  Off-site links are advisory. **It refuses to run against a host that answers 200 for everything.**
  Found two real defects on its first production run. Narrative archived.

- 0|226| **[DONE 2026-08-08] The Feedback invitation on every calculator page had been a 404 for six
  weeks.** `echoFeedback()` still linked `../contact.php` after commit `b625286` moved contact into
  `engcalcs/` and repointed only two of its three referrers. **Any funnel number that includes
  2026-08-07 is contaminated; the clean baseline starts 2026-08-08.** The failure is silent on both
  ends.

- 0|206| **[DONE 2026-08-07] Measured the contact funnel — the one metric the mission cares about.**
  Two causes were indistinguishable and call for opposite fixes: nobody clicks, versus people click
  but do not send. The send half is logged SERVER-SIDE in `formmail.php`'s success branch, because a
  submit-handler beacon races the navigation and can only count attempts. Narrative archived.

- 0|223| **[DONE 2026-08-06] Fixed the defects from the 2026-08-05/06 `lpn_` browser passes.** Root
  causes: `dev/lpn-file-lock-test-punchlist.md` § Findings. **The lock design was reworked, not
  patched** — a claim survives minimise and reboot, made safe by a write-time freshness check, so
  the lock is a courtesy and the check is the guarantee. **A guarantee guarding one of two write
  paths guards neither.** Narrative archived.

- 0|220| **[DONE 2026-08-06] Browser-verified `lpn_` project files and locking against the post-211
  UI.** Punch list `dev/lpn-file-lock-test-punchlist.md`, §0–§8 rewritten against tabs, the File
  menu and opt-in read-only. Closed with 138 automated checks over two real browser profiles plus
  Tom's §H pass. **Deliberate take-over via *Break their lock* is supported and always was.**

- 0|224| **[DONE 2026-08-06] The punch list runs itself: `dev/browser-pass/`.** 138 checks over two
  real browser profiles against the real broker in about a minute. **The one lie is the picker** —
  replaced with real OPFS handles via `addInitScript`, so no test-only code ships. **`getFile()`
  succeeding is not proof the file is there** — it answers from metadata. Narrative archived.

- 0|219| **[DONE 2026-08-05] `lpn_` added to the Related-calculators line, and its identity strings
  translated.** Done inline rather than a 26-agent sprint — the delta was ~3.5 strings per language,
  91 total, and all 22 non-core languages reached delta ZERO. **Each language's word for "looped" is
  its own professional term, not a calque**, written back to the glossary. Narrative archived.

- 0|213| **[DONE 2026-08-05] Hazen-Williams unified on EPANET's constants.** New
  `js/PipeHydraulics.lib.js` owns the one pair (SI 10.666829 from EPANET's US 4.727, exponent 4.871)
  plus `hwSlope()`; three calculators call it and the dual set is gone. Head loss moves ≤0.12%. The
  DW and Manning kernels stay duplicated on purpose, to move under a behavior-preserving diff.

- 0|174| **[DONE — verified 2026-08-05] Extract `echoUnitsRow()` from `echoCalculatorForm()`.**
  Found already built while reviewing the board: `lib/Calculators.lib.php:153` defines it, and both
  `echoCalculatorForm()` (:207) and `Looped-Network.php:35` call it — which was the whole point. It
  even grew a second flag (`$flagHideDefaults`) for `lpn_`. Shipped as part of Task 146's map-page
  work without anyone closing this ticket.

- 0|203| **[ADOPTED 2026-08-05] The COVERAGE MATRIX: a core cross of calculator × language.**
  The rule and its consequences live in **CLAUDE.md § The coverage declaration** and in
  `dev/scripts/translation_coverage.json`; `coverage_selftest.php` asserts them. In one line: a cell
  is in scope iff the calculator is core OR the language is core (core = `mpf`,`mtc` × es,pt,fr,tr;
  108 of 416 cells, 98.2% of measured use). Identity strings are never out of scope. Narrative archived.

- 0|204| **[DONE 2026-08-05] Coverage declaration for the translation tooling — required before Task
  203's matrix.** `translation_coverage.json` + `coverage.inc.php` + `coverage_selftest.php`, with
  all four scripts wired. **The obvious shortcut is forbidden by our own rule** — the exempt list
  means *identical to English is permanently correct*, and parking an untranslated body there would
  destroy delta-zero. Narrative archived.

- 0|211| **[DONE 2026-08-05] The tab-and-File-menu paradigm for `lpn_`: projects as tabs, files as files.**
  Supersedes Task 195's Phase 2 UI. Triggered by Tom stopping his browser pass mid-test — the UX was
  too confusing — and it **deleted more than it built**: no autosave to file, opt-in read-only, no
  Delete, an ordinary File menu. Made Task 208 obsolete. Full design narrative archived.

- 0|212| **[DONE 2026-08-05] Persisted file handles — a reload no longer drops the file.**
  Handles live in IndexedDB (localStorage cannot hold them); on boot `queryPermission()` reconnects
  a granted one silently, holds a `prompt` one for the first pointerdown/keydown so the revival
  needs no user activation of its own, and drops a denied one. Verified by
  `dev/lpn-spike/handle-restore-harness.js` (26 checks, mutation-tested). `Open Recent` was deferred
  from here and shipped as Task 258. Full narrative in `dev/roadmap-closed-archive.md`.

- 0|208| **[OBSOLETE 2026-08-05] A lock that travels with a COPY of a file is the wrong lock.**
  Ruled obsolete by Tom on reading the post-211 state: opening a file someone else holds now offers
  **Create a copy** as a first-class answer, so the lockout this existed to fix no longer happens to
  a user. Analysis archived.

- 0|195| **[DONE 2026-08-03 — both phases shipped] Export/import a `lpn_` project as a file.**
  Phase 1 one-shot JSON download/import; Phase 2 live `FileSystemFileHandle` with a server lock
  broker (`lpn-lock.php`). Phase 2's UI was then superseded by Task 211's tab-and-File-menu rebuild.
  Design narrative archived in `dev/roadmap-closed-archive.md`.
  **Browser verification is NOT part of this task — it is Task 220.**

- 0|210| **[DONE 2026-08-03] Stop counting Tom's own visits in the usage logs.** `?ec_nolog=1` sets
  a ten-year cookie effective on the same request; all three writers check the one flag and both
  beacon endpoints answer **204, not an error**, so an opted-out event is never queued for retry.
  **Post-hoc detection is explicitly not to be built** — it cannot be applied retroactively and
  would delete the real multilingual users we most want to see.

- 0|199| **[DONE 2026-08-03] `lpn_` logged no real usage at all.** `submitForm()` fires only from
  the unit dropdowns and preset buttons on that page, so **the "used" column was counting unit-strip
  changes, not networks solved**, and the 6%-vs-70% reading was a different event from the other
  fifteen rows. `runSolve()` now logs. **`lpn_`'s conversion is simply UNKNOWN before 2026-08-03.**

- 0|146.08|[CC] **[DONE] Multiple named saved networks (`lpn_`).** Local multi-project save/retrieve,
  shipping the project container from day one so Task 184's delta/scenario model stays open. Not
  EPANET `.inp` interop — Tom confirmed 2026-07-29 that is not needed (Task 196). Detail archived.

- 0|197| **[DONE 2026-08-03] Tooltips stuck visible — the hover+click trigger stack (suite-wide).**
  The 2026-07-30 fix covered controls only, so every PLAIN LABEL kept all three triggers. **The real
  rule is narrower: a tip must never carry both a hover trigger and a click trigger**, because
  Bootstrap will not hide while any is active. One opening gesture per device; 16 checks over all
  four combinations.

- 0|198| **[DONE 2026-08-03] Flow arrow moved downstream of midpoint (Task 146 child).**
  `ARROW_ALONG` 0.3 → 0.7, measured from the upstream end. One constant: `flow < 0` already mirrors
  it, and the label-collision test derives from the same value, so label separation follows
  automatically.

- 0|173| **[DONE — built during Task 146, closed 2026-08-03] `EngCalcs.initTips(root)` — tooltips
  built after page load were dead on touch.** `js/looped-network.js` calls it after building the
  toolbar, each popup and both panels. **It had been built and never closed, sitting at priority 30
  long enough to distort every "what is next" reading** — closing means priority → 0 AND the move,
  in one edit.

- 0|193|[CC] **[DONE 2026-07-31] `lpn_` English tightening pass.** The English-reform gate run before
  the 146.06 sprint so each fix is paid once instead of 26 times. Every `lpn_` key reviewed, 51
  changed, plus trap-term tips and a glossary seed. Narrative archived.

- 0|189| **[DONE 2026-07-30] Per-field decimal places on map labels (Task 146 child).** A 0–4
  spinner on each numeric field's row in the **Labels popover, not Settings**.
  `labelSettings.decimals` is a **parallel map**, not a shape change to the boolean maps merged
  key-by-key out of localStorage. Decimals feed `displayRound()`, so extrema stay judged on the
  rounded display value.

- 0|190| **[DONE 2026-07-30] Toggle for the high/low marks on map labels (Task 146 child).**
  `labelSettings.markExtrema`, one checkbox, **global rather than per field**. Enforced in
  `decorationFor()` rather than by suppressing the extrema, so turning them back on needs no
  recompute. Forced a fix to `loadFromStorage()`, whose merge `Object.assign`ed a bare boolean and
  lost it.

- 0|188| **[DONE 2026-07-30] `lpn_` backdrop fade, heavier pipes, popup placement, and a
  click-blocking bug.** **Fading the REFERENCE material generalises where thickening the drawing
  does not** — a drawing tuned against a busy aerial still reads on white and in print. Pipes went
  0.5 → 0.7 (lighter than the node outlines above them); popups open beside the element's label.
  Narrative archived.

- 0|187| **[DONE 2026-07-30] `lpn_` link labels at the true midpoint; roughness and minor loss added
  to the Labels choices.** `linkLabelMid()` took the midpoint of the middle SEGMENT, which on a bent
  pipe lands in the second leg; it now walks the polyline by arc length and steps clear of any
  arrow. `lpn_field_km_short` exists because a shared label must fit its narrowest use — the on-map
  legend.

- 0|182| **[DONE 2026-07-30] Sticky tooltips on interactive controls — suite-wide.** Every tip
  carried `'hover focus click'`; Bootstrap tracks the three separately and refuses to hide while any
  is active. Fix: decide the trigger from what the element IS. Superseded by Task 197, which found
  the same defect surviving on plain labels. Narrative archived.

- 0|183| **[DONE 2026-07-30] `lpn_` map geometry: scaling gaps, arrow placement/width, symbol
  opacity.** Extrema badges and the leader threshold were fixed world sizes beside constants that
  already scaled with the font; both now go through `textFactor()`. Arrows were double-scaled — **an
  SVG `transform` scales the stroke with the geometry**, so also scaling `stroke-width` squared the
  factor.

- 0|180| **[DONE 2026-07-30] Tom's third review round on `lpn_`: live collision recalc, 3-point
  Example pump, symbol size, legend headings.** The collision pass had to be made IDEMPOTENT before
  it could run during a drag — it kept the previous nudge and pushed further, so per-frame runs
  would drift. Symbols are sized as a MULTIPLE OF THE TEXT, inheriting its map-vs-screen units.
  Narrative archived.

- 0|179|[CC] **[DONE 2026-07-30] Tom's second `lpn_` review round.** Five pieces of test feedback,
  three of which reversed decisions recorded as settled in Tasks 176 and 146.01. Headline: a
  Reservoir is also a Tank (carries Elevation as well as Head). Detail archived.

- 0|146.01|[CC] **[DONE 2026-07-30] Draggable data labels on leaders, collision avoidance, background
  mask (`lpn_`).** Node/link labels carry an optional drag offset persisted like any other property
  (`js/looped-network.js`); past a 4-unit threshold a leader line is drawn. Detail archived.

- 0|146.03| **[DONE 2026-07-29] Text label custom size multiplier.** Per-label `sizeMult` (default
  1) stacks on `settings.textSize` via `effectiveFontSize(mult)`; only a Text label carries one.
  Persisted with the label — no storage-version bump, since old labels fall back to `sizeMult || 1`.
  Rich text formatting stays explicitly undesigned per the scope doc.

- 0|176| **[DONE 2026-07-30] Pump curve entry, head-gain/head-loss reporting fix, demand/flow colour
  unification.** The pump popup offers entered points or another pump's id, resolved one hop only so
  a cycle cannot form. A pump's head GAIN had been reading as a 70 ft "Head loss"; **that split was
  then REVERSED by Task 179** (Tom: "Negative head loss is fine"), so there is no `headgain` field.

- 0|163| **[DONE 2026-07-28] Language strings standardized on single quotes; the validator's blind
  spot closed.** Rule D lives in CLAUDE.md. **The original entry's central claim was wrong** — it
  sized the gap at 43 benign keys from the English file alone; there were **660 double-quoted
  assignments across 27 files, eight real translated content**, two of them interpolating. **Never
  land a mechanical rewrite of the lang files without a `var_export` diff.**

- 0|166| **[DONE 2026-07-28] The 26-language sprint ran.** ~406 strings: 11 new keys common to every
  language, the per-language stragglers, and a resync of two CHANGED keys the payload delta cannot
  see. **Four defects the agents' self-reports missed** were caught by verification — three reported
  a key "already in sync" while none had edited the file, which is the signal. Narrative archived.

- 0|170| **[DONE 2026-07-28] Hazen-Williams and Darcy-Weisbach got their own waterline note.** New
  `hw_note_1` (owner: HW, by reach — 580 humans vs DW's 67) replaces `mphl_note_1` on both waterline
  pages, so the culvert material stays on the culvert calculator. Covers the unmodelled profile,
  negative pressure, the upstream boundary condition and the K total. Fixed a latent unclosed
  `<dl>`.

- 0|168| **[DONE 2026-07-28] Darcy-Weisbach reworked upstream-first.** One "Downstream EGL" input
  became upstream elevation, upstream pressure and downstream elevation, with downstream pressure as
  the headline result. **Zero new language keys** — the eight `hw_*` labels were borrowed whole
  under the concept-level reuse rule. DW and HW agree to within 0.4% on the same pipe.

- 0|169| **[DONE 2026-07-28] Reworded `mphl_note_1`'s opening claim.** It said "doesn't account for
  pipe elevation", which stopped being true once Tasks 167/168 gave HW and DW endpoint elevations.
  Now "does not model the pipe profile between the two ends" — true on all three pages, naming the
  real limitation rather than a superseded one. The remaining culvert bulk became Task 170.

- 0|167| **[DONE 2026-07-28] Hazen-Williams reworked to solve downstream from the end the user
  knows.** The page had asked a waterline engineer for the one number they do not have; one input
  became three. **Separating elevation from pressure bought a real check, not just a nicer form**: a
  negative downstream pressure means the HGL fell below the pipe, which prose could only warn about.

- 0|165| **[DONE 2026-07-28] Default unit preset is chosen by language.** English gets US customary,
  every other language SI; measured reach is en 83%, es 10%, then a ≤1% tail, so one global default
  had to be wrong for someone. **"English" is not "United States", accepted deliberately** — one
  exception to the two-letter code the whole language system rests on is worse. Narrative archived.

- 0|164| **[DONE 2026-07-28] Realistic defaults on every calculator, and per-preset default
  declarations.** A default is in the *displayed* unit, so declarations now take `'us'`/`'si'`
  pairs, decoupling every number from the choice of preset. 45 defaults replaced, **every velocity
  check verified by running each page's real `pageCalculator`.** Table: `dev/unit-families.md`.

- 0|162| **[DONE 2026-07-28] Unit presets rebuilt on named unit families.** `'units' =>
  'distance_small'` names a family defined once; presets are family → unit maps. **Named families
  rather than merely split arrays**, because several families must share one option list. The rule —
  *split on different defaults, not different options* — is in CLAUDE.md. Full record:
  `dev/unit-families.md`.

- 0|161| **[DONE 2026-07-28] Payload-delta false positives eliminated.** The suite-wide delta fell
  341 → 68 and six languages read zero for the first time, so **that zero is now worth reading**.
  **The `symbol` intent tag was rejected as the exemption source** — it means "keep the symbols
  inside this string intact", not "this whole string is a symbol". Cognates are exempted
  per-language, never globally.

- 0|159| **[DONE 2026-07-28] Translation debt resync sprint — 26 languages.** Driven off a
  hand-specified key list rather than the payload delta, which is blind to stale-but-present keys.
  Three process lessons: count the language list before spawning; **never relaunch a "failed" agent
  without diffing its file first**; and any script rewriting `glossary.json` must halve its
  indentation.

- 0|151| **[DONE 2026-07-28] Sewer-slope demand: the doc was findable all along.** Tom corrected the
  task's own headline — `sewslope.php` ranks and gets seen, so 0.5% CTR is a *satisfaction* failure,
  not a discovery one. Shipped on the parent site: meta descriptions, SI columns in Table 1, and a
  back-link from Manning-Pipe-Flow, which carries 67% of the suite's human audience. No sewer-slope
  calculator.

- 0|157| **[DONE 2026-07-28] `index.php` now has a real meta description.** The one page Task 150's
  reuse trick could not cover, since its only candidate key *is* the title. **One bespoke key is the
  deliberate single exception to reuse-or-nothing**, on the page where a description carries most
  weight: 26 strings against the 520 a per-page scheme would have cost.

- 0|142| **[DONE 2026-07-28] `ip_max_head` label vs. tip mismatch — resolved on PRESSURE.** **Tom
  changed the LABEL, overruling CC's opposite recommendation**, because a pipe *pressure rating* is
  how irrigation designers specify this limit and the field already offers psi/kPa/bar. **The
  quantity and its unit list are unchanged; only this label's English noun** — the glossary's `head`
  guard still holds.

- 0|152| **[DONE 2026-07-28] HY-8 itself is now linked from both culvert-adjacent notes.** Both
  named HY-8 while linking only the tutorial video. `mphl_note_1` gained the honest scope sentence:
  this page solves outlet control only, and culvert design is deciding which control governs. **No
  culvert calculator — reaffirmed, not reopened.** Both notes' unclosed `<dl>` is now emitted by the
  pages.

- 0|154| **[DONE 2026-07-28] Turkish ASCII-fold scan — tr is clean; no fold found in any language.**
  **Method: deterministic self-evidence, not an agent pass** — if a word appears in one file both
  with and without diacritics, the bare form is a fold. All four tr candidates were false positives.
  Precision is high for Turkish and low for Romance/Slavic, so a clean tr result is meaningful.

- 0|150| **[DONE 2026-07-28] Every page's meta description was just its own title repeated.** 19
  pages now point `$html_desc` at their own `<prefix>_main_desc`, fixing it in every language at
  zero translation cost. **This was first built the expensive way and Tom caught it** — 20
  purpose-written keys pushed the delta 365 → 885, and the rule is now reuse-or-nothing (CLAUDE.md).
  Narrative archived.

- 0|156| **[DONE 2026-07-28] `.git` and directory listings were readable over HTTP.** `<FilesMatch
  "^\.">` matches filenames, not directories, so the packfiles downloaded intact — making
  `dev/.htaccess`'s block decorative. No credentials in history. Fixed with `RedirectMatch 404` and
  `Options -Indexes`; **the latter needs `AllowOverride Options` or Apache 500s everything**, so
  re-test it if the site moves.

- 0|149| **[DONE 2026-07-28] Non-English pages were effectively absent from the search index —
  `hreflang`, canonical and sitemap now emitted.** One URL served every language and nothing
  declared the `?lang=xx` forms, so Googlebot indexed only the English rendering.
  `ec_canonical_url()` is built from `SCRIPT_NAME` and `CANONICAL_ORIGIN` is deliberately not
  `HTTP_HOST` — both are client-supplied.

- 0|153| **[DONE 2026-07-28] Resync `template_feedback` — 26 languages brought in line with the
  reformed English.** The old wording was flattery-fishing; **the tell was that `$ec_lang_intent`
  had already rewritten it to nearly the new wording, i.e. the intent was doing repair the source
  should have done.** Done inline, not as a sprint. "Tell your friends!" evangelism was considered
  and rejected.

- 0|148| **[DONE 2026-07-27] `template_welcome`'s `>> ... <<` markers replaced with CSS italics.**
  **Done as CSS, not `<em>`, for two reasons:** it gets presentation out of the language strings
  entirely (an `<em>` would leave 27 translators hand-copying markup, which is how the markers
  diverged), and it allows a per-script exception markup could not express — italics off for the 11
  non-italic scripts.

- 0|140| **[DONE 2026-07-27] Get HTML out of language strings where it cannot work, and enforce it mechanically.**
  Produced Rules A–D, which are the durable output and live in **CLAUDE.md § Language Keys** — read
  them there, not here. Enforced by `dev/scripts/lang_syntax_validate.php`. Tom's close: do step 4 +
  enforcement, retire step 2 as superseded by step 1. Full narrative archived.

- 0|147| **[DONE 2026-07-27] sw `kichwa` → `kimo` head-term conversion finished.** All 16
  stragglers; the file now reads `kimo` in all 37 hydraulic uses. **A straight swap was safe because
  both are noun class 7**, so every concord marker stayed valid. **Lesson: the 2026-07-22 glossary
  note listed the keys it changed, which reads as completion but was a partial pass — grep the whole
  file for the rejected term.**

- 0|139| **[DONE 2026-07-27] Points-data copy/paste on Irrigation-Pressure (`ip_`).** A wrong
  singleton count, off by one, because `h_max_allow` was added later without bumping it — so Copy
  emitted a grid shifted one cell left and Paste wrote the shift back. **`bpn_` had the same defect,
  worse.** **This bug is silent and recurs every time a field is added above a row table**; the
  check is three lines.

- 0|141| **[CLOSED 2026-07-27 as already answered] Is `Kichwa` (sw) / `الرأس` (ar) really the
  hydraulic-head term?** No for sw (`kimo` is); yes for ar under defer-to-cultural-standard — an
  anatomically-derived word that IS the dominant local standard is correct. **An earlier version
  claimed a 7-of-26 inconsistency by comparing pipe pressure head against weir head; that finding is
  withdrawn.**

- 0|143| **[DONE 2026-07-27] Move the solver control into the depth label on `mtc_` and `mpf_`.**
  The banner now sits on the second line of the field's own label, so the thing you solve for and
  the control that solves it are one element. **`mpf_solve_for_flow` is one whole key, never a
  preposition composed with a noun at render time.** Cookie format bumped to v2 — the control's
  inputs take positional slots.

- 0|138| **[DONE 2026-07-27] Optimize suite-wide "Related calculators" links.** Re-scoped to five
  links on three pages by the evidence: **MPF alone is 67% of all human views and MPF+HW+MTC is
  92%**, so a link on a long-tail page is seen by 6–17 humans. **Reciprocity was explicitly
  rejected** — 11 page edits to place links in front of a rounding error. No new keys. IP's 4%
  conversion remains un-diagnosed.

- 0|137| **[DONE 2026-07-27] Branched (distributary) pipe network calculator, `bpn_`.** Source →
  main → branches delivering fixed demands, where EPANET is overkill: parent-pointer topology,
  single-pass fixed-demand solve, series-by-default. Spec:
  `dev/branched-network-calculator-scope.md`. **The filing lesson: never park future work inside a
  DONE block** — closed blocks are not scanned.

- 0|136| **[DONE 2026-07-21] Reworded `template_translation_help` to invite native-language
  review.** Resynced into all 26 so the invitation appears in-language — a passive, always-on
  companion to the Task 135 sw review. The English edit correctly tripped
  `detect_english_drift.php`, validating the tripwire on a real change. **6 of 7 "failed" agents had
  already landed correct edits before erroring.**

- 0|129| **[DONE 2026-07-21] Stale-English-revision resync audit.** Explicit-key-slice sprint over
  the 5 keys whose English was shortened in the Wave-0 reform while several languages still carried
  the older text. **Driven off an explicit key list, not the payload delta, which is blind to
  stale-but-present keys.** 9 languages carried drift and were rewritten; 17 already matched.

- 0|126| **[DONE 2026-07-21] Suite-wide tooltip markup migration.** The legacy inline-styled
  `cursor:help` span pattern migrated to `.ec-help`/`.ec-tip`, which is what actually fires tap
  tooltips. Residue was 7 `rc_` keys across 11 languages (the old "es/ru/zh clean" note was wrong).
  Done with a scripted converter that moves each translated label INSIDE the wrapper, not a pure
  attribute swap.

- 0|130| **[DONE 2026-07-21] `odt_` fix + vessel-first rebrand.** Menu became "Pond & Tank Drain
  Time" (Tom-locked), title and description reordered vessel-first, then re-translated into all 26.
  Hand- specified key list, because **the payload delta is blind to
  changed-English-under-stale-translation.** An apparent entity double-encode turned out to be
  notification display escaping.

- 0|127| **`mhp_diameter` tooltip restored suite-wide — DONE 2026-07-21 (rode in Task 130).** The 15
  languages missing the `.ec-help` "(supply pipe)" tooltip got it added (translated gloss, existing
  penstock term reused); the 11 that already had it were left intact. Tag-parity verified on all 26.

- 0|134| **[DONE 2026-07-21] Units audit + bar/kgf-cm² gap-fill.** Defined `kgfcm2`, refined `bar`,
  pruned dead `atm`/`knpm2`/`knpcm2`, wired bar + kgf/cm² into all 27 pressure/head dropdowns.
  Regional-norms research drove it: kgf/cm² is the Asia norm, atm is lab-not-water. **Design note:
  units are universal, not per-locale** — the architecture has no per-language dropdown
  customization.

- 0|131| **[DONE 2026-07-21] Translate the 5 trap-term tips into 26 languages.** Glossary + `avoid`
  injected, driven off an explicit grep-slice rather than the payload delta. Each agent preserved
  the existing translated label and added the definitional tip in whole-label `.ec-help` form —
  **tip-only scope, labels untouched.** Findings spun out as Task 133 and left open in Task 128.

- 0|128| **[CLOSED 2026-07-21] Trap-term native-confirmation residue (sw specific gravity + my/he
  head).** Closed on Tom's directive that **native review is not realistically available and we
  defer to the locally natural term** — all three kept. **The upstream fix is the durable part: the
  glossary `head` family's blanket `avoid: anatomical "head"` was itself mistaken** and was reframed
  across all 7 entries.

- 0|133| **[DONE 2026-07-21] Cross-key specific-gravity LABEL consolidation (per-language).** In
  each of 5 languages `mtc_sgrock`'s divergent weight-flavored label was aligned to `rc_sg`'s, which
  already held that language's dominant standard. **It aligned toward relative density only because
  `rc_sg` held the standard in all 5 — a weight-flavored standard would be equally valid
  elsewhere.**

- 0|132| **[DONE 2026-07-21] `$ec_lang_intent` trimming — collapse duplicative definitions to
  `gloss:` pointers.** 12 entries trimmed, preserving all `layout`/`symbol`/`avoid` commentary;
  English-only. **The standing carve-out that authorized this is RETIRED (Tom, 2026-08-08)** — the
  left-of-pipe IS the payload, and trimming it deletes the synonyms a translator needs. See
  CLAUDE.md.

- 0|109| **[DONE 2026-07-20] Cross-language consistency audit (Opus, suite-wide), all 6 stages.**
  Motivated by a Burmese embedded-English defect that survived a full sprint's own QA. The lasting
  consequence is the mandatory glossary write-back rule in **CLAUDE.md § Post-sprint QA** — audit
  findings must land in `glossary.json` before a stage closes. Stage detail archived.

- 0|125| **[DONE 2026-07-17] Audit `$ec_lang_intent` keys.** Findings in
  `dev/ec-lang-intent-audit-2026-07.md`. Removed 110 lines of empty-placeholder leakage from all 26
  non-English files. The ratio was 129/507 = 25.4%, at Tom's one-fourth ceiling rather than under
  it; after per-bucket sign-off it is 95/507 = 18.7%.

- 0|124| **[DONE 2026-07-16] Shared upstream-HGL/EGL warning for `mphl_`, `dw_` and `hw_`.** One
  shared `.ec-help` tip on both result labels in all three calculators; `mphl_`'s bespoke keys
  retired in favour of the shared `hw_hgl_2`. `mphl_note_1` gained a leading pipe-elevation item,
  and DW and HW gained a Notes section they previously had none of.

- 0|123| **[DONE 2026-07-16] `mtc_`: add a solve-for-depth-given-Q mode.** **Scope grew beyond a
  plain inverse wrapper:** `mtc_` auto-iterates n and d50, both functions of depth, so a fixed-n
  solver would have returned a `y` inconsistent with a re-run — Tom's call was that an honest
  "didn't converge" beats a plausible wrong answer. The iteration became the shared `mtc_iterate()`.
  Narrative archived.

- 0|122| **[DONE 2026-07-16] Add Phillips & Ingersoll (1998) Manning's n option to `mtc_`.** `n =
  0.0926·R^(1/6) / (1.46 + 2.23·log10(R/d50))`, **R and d50 in FEET** (Maricopa County Drainage
  Design Manual §7.6.3), for channels with bed d50 of 0.28–0.36 ft — the manual itself calls it "a
  check or reference", not a sole design basis. A third standalone radio, plus an always-visible
  range check.

- 0|121| **[DONE 2026-07-16] Second-opinion (Opus) pass on the Task 120 math audit.** Requested
  because the first pass had already found one critical bug, so the base rate for a second was not
  zero, and self-derive-then-self-check has a shared-slip blind spot. Findings archived.

- 0|120| **[DONE 2026-07-16] Holistic calculator mathematical audit.** All 14 calculators reviewed
  against a 7-point checklist in 4 physics-grouped stages. Checklist, per-calculator risk notes and
  findings: `dev/calculator-math-audit-checklist.md`. Second opinion was Task 121. Narrative archived.

- 0|119| **[DONE 2026-07-16] Offline usage logging (queue-and-flush).** Beacons send via `fetch(...,
  {keepalive:true})` rather than bare `sendBeacon`, whose return value only means "browser accepted
  for delivery" and cannot drive retry. Failures queue in IndexedDB. **A queued retry carries the
  ORIGINAL client attempt time**, so a beacon landing hours later logs when the usage happened.

- 0|108| **[DONE 2026-07-14] `Install.php` localization.** Was 100% hardcoded English while being
  the only working PWA install path on iOS Safari and Firefox. **Post-close audit found one real
  defect: Burmese left "install", "browser", "menu", "icon" as raw English inside Burmese
  sentences** while its own `install_main_menu` already had the native word. Also fixed stale
  `sw.js` precache lists.

- 0|105| **[DONE 2026-07-14] Scoped and fixed the remaining `mpf_see_notes` stacking sites from Task
  101.** A new `mpf_flow_tip`; one shared `mtc_iteration_tip` for both radio fields; and on `mhp_`
  the `(See notes)` was pure redundancy beside a D5 verdict string, so it was deleted. **Mid-task
  correction: `$ec_lang_intent` entries were added without permission and reverted everywhere.**

- 0|103| **[DONE 2026-07-13] "Penstock" kept as the primary term across all `mhp_` fields, "(supply
  pipe)" disambiguated once rather than repeated.** Unlike "riprap", penstock is established
  international vocabulary with real translations. **The audit found am, bn, ru and ur had
  phonetically transliterated it**, the same defect class as riprap; each got a natural "pressure
  pipe" phrase.

- 0|101| **[DONE 2026-07-13] `k_m` label stacking fixed.** The rendered label concatenated a noun
  phrase, a bare `<a>` with no tooltip, and a trailing `(See notes)`. **bg's length was measured and
  was NOT the defect** — mid-pack against 12 languages. Fixed at all 5 sites; the tooltip needed
  zero new translation, assembled in PHP from two existing keys. Style guide:
  `label-normalization-decision.md` D8.

- 0|102| **[DONE 2026-07-13] Generalized `k_m` typical-values guidance for dw/hw/mphl/mhp.** One
  shared tip used verbatim at all four call sites. **Content changed, not just relocated** — exit
  loss was missing. **The default became one shared 2.0**, derived as the literal sum of the listed
  values, so a user can verify the default by adding the tooltip's own numbers.

- 0|104| **[DONE 2026-07-13] `e`/roughness field D8 content-and-stacking fix on dw/mhp/ip.**
  `dw_roughness_tip` became plain prose assembled at the call sites; `dw_roughness` shrank to a bare
  `'e'` (a Tom-approved exception to D8). **QA caught cs and he using `&ndash;`**, which
  `htmlspecialchars()` would have shown literally — the defect Rule A was later written to make
  impossible.

- 0|98|[CC] **[DONE 2026-07-13] English-improvement pass, 7 items.** The durable output is the
  Simple-English source-string policy, which lives in **CLAUDE.md § Write English source strings in
  Simple English**. Per-string rewordings archived.

- 0|96| **[DONE 2026-07-13] Bulgarian scope question resolved, all 3 sub-items.** Tom: *"I would put
  водно количество everywhere"* — all 35 `дебит` occurrences replaced **with gender agreement fixed
  on every one** (дебит is masculine, водно количество neuter). Menu titles were already sentence
  case; `index_title` was the one real miss. Same-day feedback on `LANGNAME` and two `mhp_` labels
  also fixed.

- 0|97| **[DONE 2026-07-13] tr riprap term unified on "taş dolgu".** Tom could not adjudicate a
  Turkish-native judgment, so it was resolved from suite convention: the English treats riprap as
  ONE concept in all 5 spots and every other language uses one bulk-material term throughout. Not a
  blind find-replace — Turkish genitive and attributive forms differ by construction.

- 0|99| **[DONE 2026-07-13] Removed the broken `mph` option from `Manning-Irregular.php`'s velocity
  unit select.** It had no backing `$ec_units['mph']` factor and no `$ec_lang['u_mph']` label, so
  the option rendered broken. Only one live occurrence (the note said two), now matching the
  `mps`/`ftps` pattern every other velocity selector uses.

- 0|95| **[DONE 2026-07-13] Localization-bypass audit — hardcoded strings that never route through
  `$ec_lang`.** **`Install.php` translated** (the in-app button only fires on Chrome/Edge, so this
  page is the only path on iOS Safari and Firefox); **`Orifice-Drain-Time-Ref.php` English-only
  permanently**, since equation-manipulation prose has a far higher mistranslation cost per word
  than UI labels.

- 0|94| **[DONE 2026-07-13] Orphan-key full-suite housekeeping.** 30 keys present in translated
  files and absent from English, deleted from all 26. **Each was verified with a word-boundary grep
  first, and two looked live**: `cs_wp` is a form-field `name` labelled by a shared key, and
  `mtc_vel_high` is a JS variable fed from `mhp_vel_high`. `--strict` now reports `extra: 0`.

- 0|93| **[DONE 2026-07-13] Cross-language glossary reconciliation pass.** 6 genuinely stale
  glossary entries updated to the incumbent file terms. hr rock chute left pending a decision about
  the *file*, not the glossary. **One case ran the other way — the glossary was right and tr's file
  had drifted** — logged as its own task rather than silently editing shipped sentences.

- 0|92| **[DONE 2026-07-13] Whole-label hover/tap target for tips.** Added `.ec-help { cursor: help
  }`, taught the tooltip init to match `.ec-help[title]`, and migrated all 956 `class="ec-tip"`
  occurrences across the 27 files to the wrapper pattern — the `title` moved outward, so a
  one-character tap target became the whole label. Fixed a raw `"` in sr's `rc_apron_length` title
  that broke the attribute.

- 0|91| **[DONE 2026-07-12] Complete re-translation of every calculator category into all 26
  languages.** Five categories by 3 waves plus a holistic Opus pass; **category 6 deliberately got
  the lightest rung that covered the risk**, because its content was already high quality. Rules in
  `dev/translation-process.md` Scenario C, dated history in `dev/translation-execution-log.md`.

- 0|90| **[DONE 2026-07-13] Native-review backlog resolved by best-effort verification instead of
  waiting for a native reviewer.** Tom: *"it's pie-in-the-sky to wait for human review that may
  never come."* Fixed the ps/ur scissors false cognate and sw's non-parallel head/tail pair,
  verified what only looked wrong, and **documented what genuinely needs a fluent reviewer rather
  than guessing.** Narrative archived.

- 0|89| **[DONE 2026-07-13] D50 "median" mistranslation resolved via a 12-language research vote,
  not native review.** 7 of 12 had a directly-cited real median term and were genuinely wrong; 4
  were already correct in-file and only the glossary was stale. **am had no distinct
  median-vs-average term in circulating usage at all and was left unchanged, because there was
  nothing more correct to fix it to.**

- 0|88| **[DONE 2026-07-12] Suite-wide baked-in verdict-glyph sweep.** Grepped all 26 non-English
  files for baked-in ✓/⚠ glyphs or translated "Warning:"/"OK:" prefixes across the 27 keys actually
  passed as `writeCheckHTML()`'s `shortText`. **Zero matches** — the already-fixed instances were
  the only real ones. Method and results: `dev/translation-execution-log.md`, 2026-07-12.

- 0|87| **[DONE 2026-07-07] Concept-level label normalization — one full-suite English-only pass.**
  The durable output is six rulings, which live in **CLAUDE.md § Concept-level label reuse** and
  `dev/label-normalization-decision.md`. **Ruling D6 was reversed:** consolidation is cross-cutting
  and can never be chunked per calculator category — a duplicate's two halves live in different
  ones.

- 0|86|[CC] **DONE 2026-07-07: Task 86.** Reversed the `dw_roughness` over-consolidation. `dw_roughness` restored to `'Roughness, e'` (dw_/mhp_ wide-form labels); new key `ip_roughness`='e' added for Irrigation-Pressure's narrow table column; both keep sharing `dw_roughness_tip`. English-only per Task 87 convention (`dev/label-normalization-decision.md`: non-English files aren't touched during consolidation work) — Tom confirmed deferring the 26-language propagation to Task 91, or leaving the key empty/English-fallback in the interim is fine. `ip_roughness` doesn't yet exist in the 26 non-English files, so it silently falls back to the English value there (same load order as any other missing key) until propagated.

- 0|85|TypeScript migration item closed as stale, 2026-07-05 (Human authorization): item was conditional on its own face ("only worthwhile if the project scope grows significantly") and no such growth has occurred — no bundler, no npm dependencies, no build step exist in this codebase today, and adding a `tsc` toolchain would cut against that simplicity for no observed type-safety pain. Closed with no code changes; revisit if the project scope grows enough to justify the tooling.

- 0|84|Renamed `irr_main_menu` from "Irrigation Flow Measurement" to plain "Irrigation" in all 27 `lib/lang.ec.??.php` files, 2026-07-05: the section now covers pressure/DU (Irrigation Pressure calculator) as well as flow measurement, so the old label undersold the menu's scope. User chose "Irrigation" over the alternative "Irrigation Calculators" when asked. For the 26 non-English files, reused each language's own existing irrigation-root vocabulary already present in the old (longer) translated string rather than running a translation sprint — e.g. Spanish "Medición de Caudal de Riego" → "Riego", Russian "Измерение расхода ирригации" → "Ирригация". No new terms introduced, so no glossary/sprint step needed. `php -l` clean on all 27 files.

- 0|83|npm/Composer dependency-management task closed as stale, 2026-07-05: investigated before starting (item was reassigned from `[CP]` to `[CC]` this session per Human direction) and found the premise no longer holds — `HeadersFooters.lib.php`/`sw.js` load Bootstrap straight from `cdn.jsdelivr.net`, not a locally vendored copy, and a repo-wide grep found no Composer usage (`vendor/`, PHP library requires) and no locally built/minified JS or CSS. There is currently nothing to manage a dependency manifest for. Closed with no code changes rather than manufacturing an empty `package.json`/`composer.json` — revisit if a real local dependency is introduced later.

- 0|82|Suite-wide symbol-convention question, resolved 2026-07-05 (split off 2026-07-04 from the Irrigation Pressure H-vs-P item): decision is **keep single-letter symbols on labels as-is** — they aren't decoration, they're the join key between a label and the formula shown right below it (e.g. `mhp_notes_1_def`: "Net head H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>"), and the pattern (H<sub>gross</sub>, Q, k<sub>m</sub>, h<sub>f</sub>, R<sub>h</sub>, P<sub>w</sub>, etc.) is already consistent across mi_/mpf_/mphl_/or_/mhp_/odt_ and more. No suite-wide edit made — status quo confirmed, not changed.

- 0|81|Fixed bg/es/pt/tr Manning Trapezoidal Channel (`mtc_`) symbol/translation gaps found 2026-07-05: added the missing `b`/`S`/`y`/`D50` symbol suffixes to `mtc_bottom_width`/`mtc_channel_slope`/`mtc_flow_depth`/`mtc_d50_in` in all 4 languages. For bg/tr, `mtc_bend_angle`/`mtc_sgrock` were left as flat untranslated English (bg additionally marked `//No need` in-file) — decided (no explicit `$ec_lang_intent` guidance existed for these, so treated as an ordinary translation gap) to translate both into bg and tr rather than leave them, matching the pattern already used by fr/de/ru for the same keys. `php -l` clean on all 4 files; `lang_parity_check.php --prefix=mtc` shows 0 missing/extra and 0 equal-to-English for bg/tr, and only pre-existing unrelated gaps (`mtc_blodgett_v_bathurst`, `mtc_vel_ok_short`) remain in es/pt.

- 0|80|Results sharing made opt-in, 2026-07-05: implemented the scope agreed 2026-07-04 (see prior framing above, now folded in here). `EngCalcs.calcAndSave()` (`js/Calculators.lib.js`) no longer calls `updateUrl()` on every form change; a new `EngCalcs.copyLink()` calls it on demand, writing `window.location.href` to the clipboard via `navigator.clipboard.writeText` and flashing the button text to a localized "Copied!" for 1.5s. New `#ec-copy-link-btn` button added next to the existing "Label:" field in `lib/Menus.lib.php` (shared scaffold, all calculator pages) — the `ec_name_hint`/`change` listener's explicit `updateUrl()` call (renaming the saved calc) was left alone since that's already an explicit user action, not automatic churn. New lang keys `calc_copy_link`/`calc_copy_link_done` added to all 27 `lib/lang.ec.??.php` files (English fallback in the 26 non-English files; no translation sprint run yet). Also fixes a real bug this design flaw was causing: `EngCalcs.readCookieAndCalc()` checked `loadFromUrl()` before `cookieToForm()`/`pageCalculatorInitialize()`, and since the URL almost always carried params (from the old automatic `updateUrl()`), it would skip row-table initialization entirely on reload — for calculators with dynamic reach/point tables (Irrigation Pressure, Weir Flow Irregular, Manning Irregular) this meant the table silently ended up with **zero** rows, since rows are only ever created inside those two functions and `CalcsBody` ships empty in the raw HTML. Fixed by always running cookie/default init first, then layering any URL params on top as overrides; `updateUrl()` also now excludes elements inside `#CalcsBody` from the query string, since per-row fields share duplicate `name`s and can't round-trip as flat key=value pairs anyway. Verified via a jsdom + real-cookie-jar harness against the live dev server: reproduced the exact zero-row failure pre-fix, confirmed 3 rows post-fix, and confirmed no regression in normal cookie round-trips (including the user's actual stale cookie value from testing). `php -l` clean on all 27 lang files plus `Menus.lib.php`/`Calculators.lib.js`.

- 0|79|"Default values" reset button, added 2026-07-04: placed on the same shared row as the unit-set buttons ("Set units:"), so one edit to `lib/Calculators.lib.php`'s `set_units_row` covers all 12 calculators — new `<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">` right after the four unit buttons. Reset mechanism deliberately simple per user direction: `EngCalcs.resetToDefaults()` (`js/Calculators.lib.js`) calls a new `EngCalcs.expireCookie()` (`js/Cookies.lib.js`, mirrors `createCookie()` with a past expiry) then does a plain `window.location.href = window.location.pathname` reload — no bespoke per-calculator JS needed, since the existing cookie-miss path already falls back to each page's own `pageCalculatorInitialize` (`js/Calculators.lib.js:107-113`), which naturally restores dynamic reach/points tables too. New lang key `calc_defaults` ("Default values") added to English, then translated into all 26 non-English `lib/lang.ec.??.php` files via 26 parallel haiku agents (per-language authorization given 2026-07-04). Verified: `php -l` clean on all 27 lang files plus `Calculators.lib.php`; `lang_parity_check.php` shows the `equal_to_english` count dropped by exactly 26 (one per language); rendered a live calculator page (Darcy-Weisbach) via CLI PHP and confirmed the button HTML (`<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">Default values</button>`) renders correctly and wires to the new JS function.

- 0|78|Irrigation Pressure H-vs-P decision, resolved 2026-07-04, corrected same day: initial pass kept H<sub>supply</sub>/H<sub>design</sub>/H<sub>last</sub> attached to the three pressure labels (`ip_h_supply`, `ip_h_design`, `ip_h_far`) reasoning that H is the suite-wide head symbol — user corrected this: pressure quantities should carry no symbol at all here, not H and not a new P. Removed the `, H<sub>...</sub>` suffix from all three English labels, now plain "Supply pressure" / "Emitter design pressure" / "Last emitter pressure". Scoped narrowly to the three quantities explicitly labeled "pressure" in words — left the reach-table loss quantities (`ip_hv`/`ip_hf`/`ip_hm`/`ip_hl`: velocity head, friction loss, minor loss, total reach loss) untouched, since those are head/loss terms, not pressure values. Internal JS variable names (`h_supply`, `h_design`, `h_far` in `js/irrigation-pressure.js`/`Irrigation-Pressure.php`) left as-is — internal plumbing, not user-facing, out of scope for a display-symbol correction. No non-English files affected (Irrigation Pressure translation sprint hasn't run yet). Verified: `php -l` clean, rendered page confirms all three labels show plain text with no symbol. The broader "are single-letter symbols worth it suite-wide" question was split off as a separate, still-open, non-urgent item.

- 0|77| **[DONE 2026-07-04] Irrigation Pressure calculator (`ip_`), English-only build.** A flat
  reach table of Main and Lateral reaches, solved by bisecting the last emitter's pressure against
  the supply and marching the EGL backward. **Uniformity was reworked, not just built:** real
  low-quarter DU divides by the sampled population's own mean, never an external rated value.
  Narrative archived.

- 0|76|Quality-score updater: Added `dev/scripts/update_quality_score.php` (usage: `php update_quality_score.php <lang> <quality>`). The roadmap item's original description was slightly off — the `QUALITY` constant actually lives in `lib/Language.Settings.php` (one `$all_language_settings[lang]` array per language), not in the per-language `lang.ec.??.php` files, which only hold display strings. Script validates the lang code (2-letter, must already exist in the settings file) and quality value (numeric, 0–1), then does a targeted regex replace of just that language's `QUALITY` value, leaving formatting/comments untouched. Verified: successful update on `es`, rejected an unknown lang code and an out-of-range quality value, `php -l` clean. Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call.

- 0|75|Deployment workflow script: Added `dev/scripts/deploy.sh` wrapping the full release sequence — `php -l` on every changed/new PHP file (diff-filter ACMR against HEAD plus untracked new files), aborts on any lint failure before touching git; then `git add -A`, an interactive commit-message prompt (skips commit if nothing staged, aborts on empty message), then an interactive push confirmation (`git push origin <branch>`, defaulting to the current branch) via the origin remote (at the time, Bitbucket over `altssh.bitbucket.org:443`; origin moved to GitHub 2026-08-09). Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call. Verified `bash -n` clean and a dry run (declining both prompts) correctly skipped commit/push with no changes to the tree.

- 0|74|Lang-file key-order normalizer: Added `dev/scripts/lang_key_order_normalizer.php`, which rewrites each non-English `lib/lang.ec.??.php` so its `$ec_lang[]` key order matches `lang.ec.en.php` exactly (values, quoting, and trailing same-line comments preserved byte-for-byte via PHP's own tokenizer; stale/duplicated section-header comments consolidated to English's structure). Originally scoped to Copilot (`[CP]`); reassigned to Claude Code and executed directly this session. Ran on all 26 non-English files: `lang_syntax_validate.php` clean, `lang_parity_check.php --strict` shows 0 missing/extra keys, and a separate token-level value-equality check (order-independent) confirmed 0 content diffs across every file. One real hazard surfaced and handled: `lang.ec.es.php` had two keys (`u_gradePercent`, `u_in2`) that reference an earlier key's own translation via PHP's unquoted string-interpolation syntax (e.g. `"$ec_lang[u_grade]"`) rather than retranslating it — naive English-order reordering would have flipped the assignment order and silently broken that reference at runtime (undefined-key warning, empty interpolation). The normalizer detects this pattern generically and topologically re-sorts just the affected pair, deferring to English order everywhere else — confirmed by re-rendering both interpolated strings through PHP post-reorder. The script's `--check` mode (exit 1 on any mismatch) serves as the "hook to enforce order on future edits" called for in the original spec, runnable in CI or pre-commit.

- 0|73|Translated the 3 keys newly surfaced by the entity-normalization fix (see next item): `cs_payback_years` in fr/it/km/my/ro/tr; `mhp_nu` in km/my/ro/tr; `mi_tau` in km — all were fully untranslated English, hidden from prior parity-check runs by HTML-entity vs. literal-character mismatches. Reused established per-language vocabulary already present in each file (e.g. `cs_lining_cost`/`cs_annual_value_recovered` terms for the payback tooltip, `dw_kinematic_viscosity` terms for the viscosity label, `mpf_shear_stress` term for the shear label) for consistency. `lang_parity_check.php` confirms 0 remaining `equal_to_english` hits for all 3 keys across all 27 files; `php -l` clean.

- 0|72|Fixed HTML-entity-vs-literal-character blind spot in `lang_parity_check.php` and `generate_translation_payloads.php`: both scripts' "equal to English" / delta detection compared raw strings, so an entity form (e.g. `&ndash;`, `&times;`, `&nu;`) in one file and its literal UTF-8 character in another (e.g. `–`, `×`, `ν`) were wrongly treated as different, hiding genuinely-untranslated keys from sprint payloads and parity reports. Added a shared `normalizeForCompare()` helper (`html_entity_decode(..., ENT_QUOTES | ENT_HTML5, 'UTF-8')`) applied to every equality comparison in both scripts (main english-equal check, plus `findNeighbor()`'s context-consistency check in the payload generator). Verified via before/after diff of full parity-check output: total `equal_to_english` count rose from 1214 to 1225, newly catching `cs_payback_years`, `mhp_nu`, and `mi_tau` as genuinely untranslated in several languages (previously masked by encoding mismatch) — confirmed each is a real defect, not a false positive. Follow-up translation of those 3 keys logged as a new small task above.

- 0|71|Removed orphaned `rrc_main_desc` and `rrc_main_menu` keys from all 26 non-English lang files: legacy of an earlier `rrc_` prefix before Rock Chute settled on `rc_` — keys existed in every non-English file but never in English. Confirmed via `grep -l` that exactly the 26 non-English files (and no others) had them before removal; `php -l` clean on all 27 files afterward.

- 0|70|Finish the tooltip-icon CSS standardization: the earlier "CSS standardization for validity/status checks" sprint added `.ec-tip` (currently just `cursor: help`) but only wired it into `EngCalcs.writeVelocityCheck()` in JS. The much larger set of hover-tip spans hardcoded directly into the lang files was never migrated — 318 occurrences of `style="cursor:help;color:steelblue;font-size:0.9em"` across all 27 `lib/lang.ec.??.php` files (English included). Plan: (1) add `color: steelblue; font-size: 0.9em` to `.ec-tip` in `css/engcalcs.css`, (2) mechanical find/replace `style="cursor:help;color:steelblue;font-size:0.9em"` → `class="ec-tip"` in all 27 lang files (no translation judgment needed, just markup — safe for a script or a single pass, not a per-language translation sprint).

  Note: a separate, unaddressed variant `style="cursor:help;color:#06c;font-size:0.9em"` (a different blue) also exists in several lang files for the same tooltip-icon purpose — out of scope for this item, candidate for a follow-up consolidation.

- 0|69|Expand and tighten glossary.json: Filled in all 5 empty languages (am, bn, km, my, ps) for all 27 terms using 5 parallel agents. Reviewed 6 nuanced terms across 21 existing languages. Corrections applied: fr conveyance efficiency → rendement de transport d'eau; cs/sr penstock → tlakovod/напорни цевовод; ar/uk emitter → قطارة/крапельниця; uk conveyance efficiency → added 'води'. Version bumped to 1.1.

- 0|68|Drip-Sprinkler.php simplified — removed Distribution Uniformity (DU): DU as implemented required both an average and a minimum emitter flow rate, but neither is knowable at design time without full lateral/main hydraulic modeling (a catalog emitter rating is really a best-case/near-inlet value, not avg or min — DU would report 100% for any un-modeled layout). Removed `q_min`, `du`, `du_check`, and the four `du_*` quality-tier keys; renamed `ds_q_avg` to plain "Emitter flow rate, q"; merged the DU notes entry out and renumbered the Runtime note. Calculator now honestly scopes to what's knowable pre-hydraulics: area per emitter, application rate, lateral/zone flow, and runtime for a target depth. Removed the same keys mechanically (deletion + notes renumbering) from all 26 non-English lang files, then hand-trimmed the "average"/"and uniformity" wording out of `ds_main_desc`/`ds_q_avg` in each (no new translation needed, just removing qualifiers that no longer apply). `lang_parity_check.php --prefix=ds` shows 0 missing/extra/equal-to-English across all 27 files; `php -l` clean. Follow-up (full lateral-hydraulics DU calculator) logged as a new, separate, low-priority roadmap item — scope is larger than first thought once arbitrary pipe-size steps are considered.

- 0|67|Removed `$ec_lang['ec_name_invalid']` (and its empty `$ec_lang_intent` entry, English-only, removed with explicit user permission this session) from all 27 `lib/lang.ec.??.php` files — confirmed unused outside the lang files via repo-wide grep before removal. `php -l` clean on all 27 files; `lang_parity_check.php` shows 0 missing keys post-removal.

- 0|66|Velocity-tip wording upgrade (open-channel + enclosed-pipe): Per user feedback, richer tooltip wording for both threshold groups. Open-channel (`mtc_vel_high`, shared by mtc+mi): "check available drop" → "check transition losses and available energy" (more translatable, more general hydraulic concept than "drop/fall"). Enclosed/pressure (`mhp_vel_high`/`mhp_vel_low`, shared by dw/hw/mpf/mphl/mhp): replaced the trivial "Velocity very high/low ⚠" with substantive tips — high: "risk of water hammer and high point (minor) losses"; low: "risk of sedimentation and air entrainment" (matches the specificity of the open-channel tips; dropped the redundant ⚠ since the icon itself already shows it). Launched 26 parallel haiku agents to reword all 3 keys across every non-English `lib/lang.ec.??.php` file (existing translations were stale — several still described old "diameter sizing" advice rather than the current tooltip content). 0 missing keys, all `php -l` clean.

- 0|65|Velocity checks added to Darcy-Weisbach, Hazen-Williams, Manning Pipe Flow, Manning Pipe Head Loss: All four pressurized/enclosed-pipe calculators now show an OK/High/Low `vel_check` row, reusing `EngCalcs.writeVelocityCheck()` and the existing `mhp_vel_*`/`mhp_vel_*_short` lang keys directly (no new keys, no new translation sprint needed — those keys already have 26-language coverage). Threshold matches Micro-Hydro Power: 1.0–3.0 m/s = OK, >3.0 = High, <1.0 = Low. Open-channel calculators (Manning Trapezoid, Manning Irregular) keep their separate `mtc_vel_*` keys/thresholds (0.6–3.0 m/s) per user direction — two threshold/wording groups by flow type (open-channel vs. enclosed/pressure), not one universal set. Manning Trapezoid Channel already had a velocity check from an earlier session; no changes made there this round.

- 0|64|Translation sprint — velocity-check short labels + orifice centroid reword: Launched 26 parallel haiku agents (one per language) to translate the 6 new short velocity-check keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) and reword `or_regime_submerged` from "invert" to "centroid" in all 26 non-English `lib/lang.ec.??.php` files, each referencing that file's existing `or_centroid_elev` translation for term consistency. Also picked up a few pre-existing untranslated keys (`mtc_blodgett_v_bathurst`, `or_shape_circular`/`rectangular`) surfaced in the same payload. Result: `lang_parity_check.php` shows 0 missing keys project-wide; `lang_syntax_validate.php` clean across all 27 files.

- 0|63|CSS standardization for validity/status checks: Added named classes to `engcalcs.css` (`.ec-status-ok/-info/-warn/-bad/-neutral`, `.ec-tip` for hover-help cursor) using the more accessible hex colors (`#267326`, `#c60`, `#c00`) that Rock Chute already used, instead of the plain CSS color keywords (`green`, `darkorange`, `red`) used ad hoc elsewhere. Replaced all `el.style.color = '...'` assignments with `el.classList.add(...)` across `js/orifice.js`, `js/rock-chute.js`, `js/drip-sprinkler.js`, `js/orifice-drain-time.js`, `js/micro-hydro-power.js`, `js/canal-seepage.js`, and the new `EngCalcs.writeVelocityCheck()` helper. Also fixed `engcalcs.css` being served with a hardcoded `?v=2` instead of `filemtime()` cache-busting (matches the existing per-project convention for JS includes) — now `?v=<?=filemtime(...)?>` in `lib/HeadersFooters.lib.php`. SVG-sketch geometry/line-thickness standardization is a larger follow-up not attempted here.

- 0|62|Velocity-check short labels use "High ⚠" / "Low ⚠" (icon carries the warning), not "High !" / "Low !" — dropped the exclamation mark per user feedback to avoid "hype" wording; the ⚠ hover-tip icon already communicates the warning.

- 0|61|Manning Pipe Head Loss HGL₂ NaN fix: `js/manning-pipe-head-loss.js` had `hgl2 = hgl2 - hv` (self-reference before assignment, always NaN). Fixed to `hgl2 = egl2 - hv`, matching Hazen-Williams and Darcy-Weisbach. Also added the missing `hgl1 = egl1 - hv` result (present in the other two calculators but absent here), reusing the shared `hw_hgl_1` label.

- 0|60|Orifice submergence criterion fixed to use centroid, not invert: `js/orifice.js` `submerged` flag compared TWE to `zinv` (pipe invert), which flagged submergence too early — before the downstream water surface had actually risen past the orifice center, understating the free-discharge head. Changed to compare TWE against `centroid`. Updated English `or_regime_submerged` message from "TWE above invert" to "TWE above centroid" to match; the 26 non-English translations of that string still need re-wording (tracked in active roadmap item).

- 0|59|Velocity check messages shortened to OK/High !/Low !: Added `EngCalcs.writeVelocityCheck()` shared helper in `js/Calculators.lib.js` — renders a short status plus a hover-tip warning icon (⚠, `title` attribute) carrying the full explanation, replacing long inline sentences in Manning Trapezoid, Manning Irregular, and Micro-Hydro Power velocity-check cells. Added 6 new short-form lang keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) to English; non-English translation still needed (tracked in active roadmap item).

- 0|58|Wire glossary into CLAUDE.md agent translation sprint: Translation Sprints section updated with pre-sprint step to verify glossary.json preferred-translation coverage for the calculator prefix's key terms, and launch instructions specifying that each agent receives embedded glossary terms, intent notes, and all translation rules. Glossary at v1.2 covers all 26 non-English languages across all calculator prefixes.

- 0|57|ec_lang_intent workflow audit and Spanish Robinson fix: Spanish Robinson translations verified correct — `bajante de rocado` / `escollera` / `pendiente pronunciada` properly convey the steep-channel context (not generic "canal"). Parallel-agent sprint workflow (one agent per language) established as the standard approach. Glossary injection + intent guard provide the quality layer for future sprints.

- 0|56|Audit remaining English strings in other languages: Parity checker run across all 26 non-English lang files confirms 0 missing keys in every language. English-equal strings (~23–55 per language) are overwhelmingly unit symbols (u_ft, u_m, u_kw, etc.) and technical abbreviations that correctly remain as international English. No untranslated calculator content found. Discovered two orphaned rrc_ keys present in all 26 non-English files — see active cleanup task.

- 0|55|HTML-entity audit script + bulk fix: `dev/scripts/html_entity_audit.php` scans all lang files for HTML entities (`&mdash;`, `&ge;`, `&amp;`, `&nu;`, etc.) that double-encode through `htmlspecialchars()` into JS `pageConfig`. Supports `--lang`, `--prefix`, `--fix` (replace in-place), and `--strict` (exit 1 for CI). On first run with `--fix`, replaced 2201 entity occurrences across all 26 non-English lang files with plain Unicode characters. English file was already clean; all non-English files now match that standard. Run without `--fix` to audit future regressions.

- 0|54|Hard-coded velocity units in Micro-Hydro messages/footnote: Updated velocity check output to unitless wording ("Velocity very low", "Velocity very high", "Velocity reasonable") and replaced the velocity note text with unitless guidance tied to available drop, losses, and water-hammer risk.

- 0|53|Propagate corrected `rc_notes_4_def` link to all translations: Replaced the old DOI URL with `https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf` in all 27 `lib/lang.ec.??.php` files.

- 0|52|Add velocity checks to Manning trapezoid and irregular calculators: Added `v_check` result to both calculators with warning messaging when velocity is high, and added the requested design note about high specific energy and potential expansion/obstruction losses.

- 0|51|ec_lang_intent guard: `$ec_lang_intent` is now explicitly off-limits to AI in both `CLAUDE.md` and `.github/copilot-instructions.md`. Both files state that AI must not add, change, or remove any `$ec_lang_intent` value without explicit written permission from the human in that conversation.

- 0|50|Math/logic review of all 14 calculators: Full review completed; findings written to `dev/ai-report.md`. One confirmed bug (Manning Pipe Head Loss HGL₂ always NaN — `hgl2` referenced before assignment), one medium logic concern (Orifice submergence criterion overestimates flow when TWE between invert and centroid), one design risk (Weir Flow Simple missing unit guidance for Cw), one cosmetic misspelling (Hagen-"Pouseuille" in DW). All core hydraulic formulas in the other 12 calculators verified correct.

- 0|49|"More" dropdown: About link moved under a "More ▾" dropdown (`menu_more` key, translated into all 27 languages). Follows web convention (Twitter, LinkedIn); "Help → About" is desktop-app convention. Dropdown uses `dropdown-menu-end` so it aligns to the right edge on small screens. Ready for Install/Subscribe/Contact items as those pages are built.

- 0|48|Encoding — kinematic viscosity tooltip raw codes: `&sup6;` is not a valid HTML5 named entity; it displayed literally in Bootstrap tooltips across all 27 lang files. Fixed `dw_kinematic_viscosity` and `ps_nu` title attributes to use UTF-8 characters (×, ⁻, ⁶, ², °) instead of HTML entities. Also corrected Ukrainian file which had `&#8308;` (superscript 4) instead of ⁶ and ². Prevention: use literal UTF-8 chars in all lang `title` attributes; the planned HTML-entity audit script (priority 25) will catch any recurrence.

- 0|47|Standalone engcalcs: Decoupled engcalcs from hawsedc.com via optional parent hooks. `hawsedc/engcalcs-parent-hooks.php` defines `engcalcsParentCSS()` and `engcalcsParentMenu()`; `engcalcs/lib/base.inc.php` loads this file if present; `HeadersFooters.lib.php` calls hooks conditionally. `hawsedc/index.php` now uses new standalone `hawsedc/hawsedc.lib.php` — no engcalcs bootstrap required. Fixed info-disclosure bug (BASE_DIRECTORY was echoed into public HTML).

- 0|46|New-calculator scaffold script: Added `scripts/new_calculator_scaffold.php`. Given `--prefix` and `--keys`, it appends missing stub entries across all 27 `lib/lang.ec.??.php` files and creates a calculator skeleton page + JS file using repo conventions (`echoHeader`/`echoCalculatorForm`/`echoFeedback`/`echoFooter`, JS include with `filemtime()`).

- 0|45|Translation completion matrix: Added `scripts/translation_completion_matrix.php` to report untranslated-key counts with languages as rows and key prefixes as columns. Supports `--lang`, `--prefix`, and `--format=table|csv` for sprint prioritization.

- 0|44|Zero-API translation runner (default): Added `scripts/translate_zero_api.php` to orchestrate default non-API translation workflow with deterministic phases (`scan` and `validate`) using payload generation, parity checks, syntax validation, and completion matrix reporting. `scripts/translate.php` remains optional paid path and now labels itself as non-default.

- 0|43|Engineering glossary integration: `scripts/glossary.json` is now wired into both `scripts/generate_translation_payloads.php` (prefix-scoped glossary context and preferred-term payload fields) and API prompt construction in `scripts/translate_prompt.php` (preferred term map, translation notes, and neighboring translated key context injection).

- 0|42|Translation payload generator (per-lang JSON): `scripts/generate_translation_payloads.php` now reads English plus each target lang file, emits only missing/untranslated keys, and includes neighboring translated context per key for register consistency (`key_context`). Supports `--prefix` and `--lang` filters and keeps backward compatibility with existing payload consumers via `keys` aliasing `keys_to_translate`.

- 0|41|Lang-key parity checker: Implemented `scripts/lang_parity_check.php`. Compares each `lib/lang.ec.??.php` against `lib/lang.ec.en.php`, reports missing keys, extra keys, and keys still equal to English. Supports `--lang`, `--prefix`, and `--strict` for sprint briefs and completion checks.

- 0|40|Lang-file syntax validator: Implemented `scripts/lang_syntax_validate.php`. Runs `php -l` per lang file and reports file:line findings for syntax errors, premature `?>`/out-of-scope declarations, and duplicate keys. Supports `--lang` scoping for surgical checks.

- 0|39|Save/share named calculations: URL-based Option B implemented. "Label:" field (50 chars, letters/digits/spaces/–_.) in h1 flex row on all calculator pages. On every calculation, history.replaceState encodes all form inputs + label as GET params. Loading a labelled URL pre-fills the form and restores the label. &lt;title&gt; reflects label. Client-side validation: hint text turns red on invalid chars, strips on blur. Label field suppressed on non-calculator pages. ec_name_* keys added to all 27 lang files.

- 0|38|Canal seepage expansion: Canal-Seepage.php expanded with lining payback outputs (annual value lost/recovered, total lining cost, simple payback period). Blank defaults for optional payback inputs. Separator "/" rendered between input element and unit selector via new 'separator' key in echoCalculatorForm. "per" replaced with "/" in all 27 lang files for "Value of water (currency / unit volume)" and "Lining cost (currency / unit area)".

- 0|37|Progressive Web App (PWA): Implemented. manifest.json, sw.js, and icons/icon.svg added. Service worker pre-caches all 16 calculator pages + all JS/CSS assets + Bootstrap CDN files on install. Strategy: cache-first for static assets, network-first (falling back to cache) for PHP pages. Language cookies work normally when online; offline serves the cached version in whatever language was current at install time. SW registration injected into echoHTMLHead() via HeadersFooters.lib.php. Theme color #1a6faf.

- 0|36|Text-only mode: Evaluated and closed. The PWA pre-caches all assets on install, making text-only redundant for returning visitors — the primary global south use case. A parallel rendering path would add significant maintenance burden for a narrow first-load benefit.

- 0|35|Redundant phrases: Evaluated and closed. The only truly identical long passage across all 27 lang files is the USBR/FAO citation in cs_notes_4_def — a proper-noun citation that doesn't translate. Adding a PHP shared-constant system for one string costs more than it saves.

- 0|34|Language button: replaced translated "Language" text with a globe emoji (🌐) — universally recognized, no translation needed, no flags (flags conflate language with country per W3C i18n). Screen-reader text "Language" retained via visually-hidden span.

- 0|33|Drip-Sprinkler: DU quality check renders as "Good &mdash; DU &ge; 80% ✓" — fixed. HTML entities in ds_du_* lang keys were double-encoded through htmlspecialchars() into JS. Replaced with Unicode (— ≥ <) in all 27 lang files.

- 0|32|Translation sprint — three pages: Drip-Sprinkler.php (ds_* keys), Irrigation.php (body prose and card descriptions), and About.php (body prose). Decision: keep all three pages; translate all 26 non-English lang files before next deployment.

- 0|31|Contextual hover tips: all javascript:alert help links replaced with span hover tooltips across all 27 language files. The only occurrences were the 3 mtc_d50_* Manning Trap Channel riprap sizing labels — all now use the Rock Chute pattern (cursor:help, steelblue ?, title attribute).

- 0|30|Robinson Rock Chute: Rock-Chute.php implemented — Robinson, Rice & Kadavy (1998) D50 sizing equations, slope-based equation selection, range checks, layer/crest/apron geometry, SVG sketch, translated into all 27 languages.

- 0|29|Irrigation: Canal-Seepage.php added (prefix cs_). Inflow-outflow method: Q_loss = Q_in − Q_out, conveyance efficiency Ec = Q_out/Q_in. Outputs: loss rate, loss fraction, Ec with Good/Fair/Poor rating (≥80%/60-80%/<60%), daily and annual volume lost. Unit-aware (m³/s, L/s, cfs for flow; m³/ft³/ac-ft for volume). Added card to Irrigation.php landing page and menu entry under Irrigation.

- 0|28|Drip/Sprinkler Application Rate calculator (Drip-Sprinkler.php): inputs are average and minimum emitter flow rate, emitter spacing Se, lateral spacing Sl, emitters per lateral, laterals per zone, and target application depth. Outputs are area per emitter, application (precipitation) rate PR = q/Ae, distribution uniformity DU = qmin/qavg (with color-coded quality check), flow per lateral, zone flow, and runtime for target depth. New units added: lph, gph (flow rates), mmph, inph (precipitation rate). ds_ keys added to all 27 lang files.

- 0|27|Audit existing translations for glossary compliance: built `dev/scripts/glossary_compliance_audit.php`, comparing lang-file strings for the four highest-drift terms (flow, head loss, weir, conveyance efficiency) against glossary.json preferred translations across all 26 non-English files. Most flagged mismatches were false positives from case/declension (e.g. Bulgarian "загуба"/"загуби") rather than real drift. Found and fixed one genuine defect: bg, tr, sr, km, and my each used a different word for "flow" across the mpf_/or_/mhp_ calculators within the same lang file — standardized all three to the glossary-preferred term per language. Also discovered (but did not yet fix — logged as a new task above) that `cs_Ec_target`'s tooltip text is untranslated English in 19 languages.

- 0|26|Translated `cs_Ec_target` (and the sibling `cs_lining_area`, same defect) into all 25 non-English languages: fr/it/km/my/ro/tr had the literal English "Lining target"/"Lining area" strings; 13 more languages (es, fa, he, hi, hr, id, pt, ps, ru, sr, sw, ur, zh) had a translated label but an untranslated English tooltip `title` attribute; bg/cs/bn/ar/am used a fuller inline sentence instead of the short-label-plus-tooltip pattern that the English source and most other languages use — all reworked to match. Existing per-language "conveyance efficiency" (`cs_Ec`) and "lining" (`cs_lining_cost`) vocabulary reused for consistency within each file. Root cause of why this slipped past `generate_translation_payloads.php`'s delta detection: the checker does exact-string equality against English, and these strings differed from English only by HTML entity vs. literal character (`&ndash;`/`–`, `&times;`/`×`) — a normalization gap in that script, logged separately below.

- 0|25|Language quality — structural fixes: he, pt, hr, sr, ro, zh all raised to 0.85–0.9. he: fixed 6 English strings in mtc_ section and mixed-language mphl_hgl_2. sr: fixed 4 Croatian-script strings in irr_/mhp_ sections. All 26 non-English lang files gained about_ keys.

- 0|24|About page (About.php): added to nav menu. Covers global humanitarian open source mission, GNU GPL v3 license, GitHub repository link (github.com/hawstom/engcalcs), contributing (translations, bugs, new calculators, hosting), offline ZIP download (planned/roadmap), and PWA status.

- 0|23|Irrigation landing page (Irrigation.php): added to menu with divider. Links to Weir Flow Simple, Weir Flow Irregular, Orifice Flow, Orifice Drain Time, and Manning channel calculators. Quick-reference section for diversion dams, headgates, pipe turnouts, and USBR Water Measurement Manual alignment. irr_ keys added to all 27 lang files.

- 0|22|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL. Now 27 languages total.

- 0|21|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two.

- 0|20|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here."

- 0|19|Language menu order: Corrected Language.Settings.php order to alphabetical by English name (EU/UN convention). Arabic, Bengali, Bulgarian were out of order.

- 0|18|Language system audit: Fixed all lang file issues. Removed ~30 orphaned legacy keys. Added missing or_velocity to ro and sr. Fixed es.php forward-reference bug. Fixed tr.php premature ?> close tag that dropped 55 mhp_/ps_ keys outside PHP scope; fixed 3 unescaped apostrophes in Turkish Penstock strings. Fixed bg/he mphl_hgl_2 forward reference.

- 0|17|Chinese language code: Renamed internal code cn→zh (ISO 639-1 standard). Added normalizeLang() to Language.lib.php to silently correct legacy ?lang=cn GET params and ec_language=cn cookies to zh.

- 0|16|Micro-Hydro Power calculator: Retitled from Penstock-Design.php to Micro-Hydro-Power.php and migrated fully to mhp_ language keys (old ps_ keys renamed, duplicate old mhp_ block removed). Calculator wraps Darcy-Weisbach friction factor logic with gross head, plant efficiency, and power output. Inputs: Q, H_gross, D, L, roughness e, minor loss km, kinematic viscosity, η. Results: velocity + color-coded velocity check, f, h_f, h_m, h_L, color-coded head loss % check, H_net, power (kW/MW/hp), annual kWh/yr. Dynamic SVG bar sketch.

- 0|15|Add Amharic, Urdu, Swahili, Hindi, Arabic translations — complete translation of all calculators in each language. All registered in Language.Settings.php (QUALITY 0.9). Urdu/Arabic are RTL.

- 0|14|Language-demand logging: logLanguageSelection() added to Language.lib.php; called when a valid ?lang=XX GET parameter is used. Log path: /var/www/cnm/logs/engcalcs-lang.log. Format: tab-separated UTC-timestamp, lang-code, page-basename.

- 0|13|Solver (y/d₀ given Q) for Manning Pipe Flow: bisection solver added to js/manning-pipe-flow.js. Bisects y/d₀ on [0.0001, 0.9376] (Manning Q peaks at 93.8% full for circular pipes), sets the y/d₀ input and reruns the calculator.

- 0|12|Orifice Drain Time calculator: Orifice-Drain-Time.php with conic volume method. Inputs: starting/ending/orifice elevations, starting-pond area A1, orifice-level area A0, orifice shape/size, Cd. Outputs: interpolated ending area A2, drain time. Equation derivation reference page (MathML) at Orifice-Drain-Time-Ref.php. SVG sketch. Polished: H1, Qmax, Drained Volume outputs added; h2 ≥ D/2 validation.

- 0|11|SVG sketches: Added to Orifice Drain Time (WSE, wall, H₁, D annotations), Weir-Irregular (crest profile as gray filled polygon with HWE line). Manning.lib.js extracted for shared sketch reuse.

- 0|10|Bootstrap 5.3.2 migration and jQuery removal. All pages converted to Bootstrap 5 utility classes; $() calls eliminated. (commit 92f38da)

- 0|9|Extracted per-calculator JavaScript into separate files under js/calculators/. (commit 76d6255)

- 0|8|Added CLAUDE.md architecture and developer guide. Added php -l pre-commit hook. Priority 1 security fixes: XSS output escaping, language parameter validation, cookie Secure/HttpOnly flags, ENV-based DEBUG_MODE, removed test/debug files.

- 0|7|Translations (multi-lingual): Evaluated cost/value of having a languages system in the post-2025 (AI) age. Decision: keep the system — engineering terminology mistranslates poorly in browser auto-translation. Improved fr (complete rewrite), bg (dw/hw/mi/wi sections added), tr (dw/hw/mi added).

- 0|6|Orifice calculator phase 1: Orifice.php created with circular/rectangular shape selector, unit-aware inputs (D, W, invert elevation, HWE, Cd), results (centroid, h, area, Q, v, regime check), SVG profile sketch, and notes.

- 0|5|Touch tooltips: Bootstrap Tooltip initialized on all `[title][style*="cursor:help"]` spans via DOMContentLoaded in Calculators.lib.js (`trigger: 'hover focus click'`). Tappable on mobile. `?` span added after Save label in navbar for the `ec_name_hint` text.

- 0|4|PWA on mobile: PNG icons (192×192, 512×512) generated and added to manifest.json. Apple meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.) added to `<head>` via HeadersFooters.lib.php. SW cache bumped to v2. iOS requires manual "Add to Home Screen" from Safari share menu — `beforeinstallprompt` does not fire on iOS by design.

- 0|3|Layout overflow: Wrapped `<table class="bare">` in `<div style="overflow-x:auto">` in `echoCalculatorForm()`. On narrow screens the table scrolls horizontally within the page rather than overflowing past the edge.

- 0|2|PWA evangelism: "⬇ Install" button added to navbar (before Save field), hidden by default. Shown only when `beforeinstallprompt` fires (Android Chrome); hidden again on `appinstalled`. `EngCalcs.installPWA()` triggers the native install prompt. iOS users see no button (iOS does not fire `beforeinstallprompt`).

- 0|1|Roadmap reorganized: grouped by theme, priorities differentiated so ties are intentional, descriptions tightened. Completed items moved to ## Completed section per instructions.

