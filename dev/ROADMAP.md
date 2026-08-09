# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" and 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N". A task that is one of several concrete sub-items under a single parent task may instead use a dotted ID, `parent.nn` (e.g. `146.01`) — introduced 2026-07-29 for Task 146's backlog — but it is still a full `Priority|ID|status` bullet like any other task, just grouped under its parent by ID rather than living inside the parent's prose.

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

- 25|240| **`lpn_project_copy_suffix` carries a load-bearing leading space.**
  `" (copy)"` is concatenated straight onto a project name (`js/looped-network.js:2831`, `:4161`), so
  the leading space is functional — and leading whitespace is exactly what a careful translator or a
  translation tool strips. **Fix:** move the space to the call site so the translatable string is
  `(copy)` and cannot be silently broken.
  - **The `lpn_ago_*` half of this task was WITHDRAWN 2026-08-08 — the finding was wrong.** The Wave 0
    agent claimed the fragments were spliced into `"{x} ago"` and that Spanish therefore could not
    render them. **Tom caught it:** *"Spanish can say 'hace {minutes} minutos' while English says
    '{minutes} ago'. The concept is good. Did you misunderstand and build it wrong?"* No — it was
    built right. `"ago"` lives in the **host** sentence, never in the fragment: en
    `the last edit was {x} ago` / es `la última edición fue hace {x}`, with the fragment supplying
    only `{n} minutos`. Composed, Spanish reads *"la última edición fue hace 5 minutos"*, and has
    been shipping correctly all along.
  - **Kept as a record, not deleted**, because a withdrawn finding is data about the *pass*: an
    adversarial reviewer over-calls, and the orchestrator relaying it without checking the composed
    output is the failure mode to watch. The general caution still stands — a run-time sentence
    fragment IS a latent i18n defect — but this particular instance is a correct implementation.

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
- 85|146| **Looped pipe network calculator with a map interface — new page `lpn_`. Scoped with Tom
  2026-07-28; was "Looped-network (Hardy Cross) solving", extracted from Task 137 on 2026-07-27.**
  A canvas/map-centric calculator where the interface *is* a drawing surface: elements (Junction,
  Pipe, Reservoir, Pump, Text) added from a toolbar, properties edited in a popup, loops solved to
  convergence. Full design record: **`dev/looped-network-calculator-scope.md`** — read that before
  starting anything; this entry is the summary and the decision log.

  **Three corrections to the entry this replaces, each a real change of direction:**
  1. **New page and new prefix — not "extend `bpn_` (or build alongside it)".** `bpn_` /
     `Branched-Network.php` stays exactly as shipped; the row-table form is genuinely better for a
     simple series run, and this is a different UX with a different audience. `lpn_`,
     `Looped-Network.php`, `js/looped-network.js`.
  2. **Global gradient algorithm (Todini), not Hardy Cross.** Hardy Cross needs an explicit
     independent-loop set, pseudo-loops through every pair of fixed-head sources, and an initial flow
     distribution that *already* satisfies continuity at every node — all of which get re-derived
     every time a user draws one more pipe on a map. GGA needs none of the three and is
     Newton-quadratic. Hardy Cross is now recorded as the method **not** chosen, with that reason.
  3. **Target scale is ~10–20 nodes, and that is a design decision, not a shortfall (Tom).** An
     engineer with a 200-node model would rather crack open EPANET, and 200 nodes is past the
     comfortable usability limit of a browser canvas unless we are *very* good at this. **Our
     strength is the map interface, not capacity.** 200 nodes survives only as a headroom check —
     we must not fall over — never as the sizing target. This single decision **deletes the hardest
     part of the solver**: at 20 nodes a dense Cholesky is ~30 lines and microseconds, so the CSR /
     conjugate-gradient / fill-reducing-ordering machinery is **cut, not deferred**.

  **Identity strings** (decided 2026-07-28): menu "Looped Pipe Network (Map Interface)"; title "Free
  Online Looped Pipe Network Calculator with Map Interface"; desc "Pressure and Flow in a Looped Pipe
  Network You Draw on a Map". **"…on a Map" alone was rejected**: it reads as a *geographic overlay*,
  which is Phase 4 and may never ship, whereas what actually distinguishes this page is that the
  interface is a drawing surface. Do not let a later edit quietly shorten it back.

  **Gate: satisfied.** Task 137's original gate was an OR — "after we're map-mashup experts **or**
  users ask" — and it is now moot from a third direction: Tom committed to the calculator directly,
  and Task 145 moved here (below), so this page is *how* we become map-mashup experts rather than
  something waiting on it. Task 144's finding is still welcome evidence but is no longer a blocker.

  **Commit direct to `master` (Tom, 2026-07-30 cleanup — this project does not normally use
  branches; the per-phase `lpn-solver`/`lpn-labels` branches this task used through Phase 2 were an
  inconsistency with the standing no-branching policy already recorded elsewhere in this file, e.g.
  the entity-migration task below, not a deliberate exception. Both branches were fast-forward-merged
  into `master` and deleted 2026-07-30.)** The scope doc and these roadmap entries are planning
  artifacts and belong on `master` as always.

  **Biggest standing risk is scope gravity toward EPANET.** The scope doc opens with a "Cut, not
  deferred" list (extended-period simulation, water quality, PRV/PSV/FCV, demand patterns, energy
  cost, **Tank** — Tom is right that it is a time-modeling element in a steady-state tool). Second
  biggest is translation cost: ~85–95 new keys ≈ 1.7× the `bpn_` sprint, which is why **Phase 1
  ships English-only** and the sprint waits until the string set stops moving.

  **Phases. Risk is carried by two cheap spikes rather than by the old gate.** The two spikes are
  **independent of each other**, so a failure in one wastes nothing from the other, and each is a
  real abort point. (These were briefly filed as separate Tasks 171/172 on 2026-07-28 and folded back
  the same day — the "extract unbuilt phases to their own task" lesson from Task 137 applies to
  *closing a parent*, because blocks in `## Completed` are never re-scanned. This parent is open and
  gets scanned every pass, so extraction bought nothing and only scattered the design.)

  - **Phase 0 — canvas spike. DONE 2026-07-29, on branch `lpn-solver`.** `dev/lpn-spike/canvas-spike.html`
    (standalone, no PHP/lang keys/solver/persistence) plus the full round-by-round record in
    `dev/lpn-spike/phase0-acceptance.md`. Settled the technology empirically: **SVG DOM
    (`createElementNS`, not `innerHTML` rebuilds) is the chosen technology** — 12 rounds of on-device
    iteration with Tom plus an independent Opus subagent review found no SVG-blocking issue, so the
    Leaflet + `CRS.Simple` fallback was never triggered. Demonstrated: pan, wheel zoom about the
    cursor, pinch, double-tap zoom, click-to-popup with a writeback field, node/vertex/label drag,
    **arbitrary-vertex link editing** (not capped at one — see the Phase 1 note below), zoom-extent
    fitted to rendered extent (not bare coordinates), a draggable label with a leader (Arabic and
    Amharic shape and order correctly), a two-point-registered backdrop image with separate Scale/
    Position steps, a 200-node headroom grid, and print output. On-device phone pass (drag
    smoothness, pinch vs. page scroll, tap-target size) confirmed 2026-07-29. Real bugs found and
    fixed along the way — several are suite-relevant beyond this spike: SVG is a CSS replaced
    element and won't stretch from `position:absolute` insets alone (needs `width`/`height`
    attributes); combining top+bottom insets *with* an explicit height over-constrains the box per
    CSS2.1 §10.6.4 and silently drops one constraint; `setPointerCapture` retargets the synthesized
    `click` event to the capturing element on desktop Chrome, breaking naive tap-detection.
  - **Phase 0.5 — headless GGA solver. DONE 2026-07-29, on branch `lpn-solver`.**
    `js/lpn-solver.js` + `dev/lpn-spike/`; `node dev/lpn-spike/validate.js`, 46 checks, no network
    access or `node_modules` needed.
    **The reference is the real EPANET engine, not published tables:** `epanet-js` (EPANET's C code
    as WASM) runs EPA's Net1/Net2/Net3 and its output is committed. Result: heads within 0.0002 ft,
    flows within 0.004 gpm, continuity and energy residuals at machine precision, closed-form cases
    exact to 1e−12, and the head-loss kernel exact to 1e−12 against `branched-network.js`.
    **Three things this task said would be true, that the spike proved wrong** — recorded because
    they are the entire justification for spiking before building:
    1. *"Linearize below a flow cutoff Qmin."* Not sufficient, and not what EPANET does. A flow
       cutoff leaves the gradient unbounded just above it, so a near-zero-flow link gets an enormous
       conductance. Net3's pipe 333 oscillated between 0 and −2.28 gpm forever. The guard must floor
       **dh/dQ**, not |Q|.
    2. *"A 0.6 relaxation factor, without which pumps and emitters oscillate forever."* No such
       oscillation exists once the gradient floor is right — everything converges in 5–16 iterations
       with no damping. And the relaxation as specified was itself a bug: multiplying every flow by
       0.6 is arbitrary shrinkage, not under-relaxation, and would have destroyed the exact
       continuity the GGA update guarantees.
    3. *"200 nodes is ~2.7 M flops, a few milliseconds."* Off by an order of magnitude — it forgot
       the iteration count. Measured: 0.4 ms at the 21-node target, 30 ms at 201 nodes. The
       conclusion (dense Cholesky, sparse machinery cut) survives; the arithmetic did not.
    **Two requirements nobody anticipated**, both found by cases that only exist because the harness
    was written first: convergence must be normalised by total **demand** rather than total flow, and
    **stagnation detection** is mandatory — without it a large network burns 100 iterations and
    330 ms re-deriving the answer it had at iteration 6, on every keystroke.
    Also confirmed: **structural diagnostics run before the solve** (no fixed head / unreachable
    node named by id / node isolated behind a closed link), and this suite's Hazen-Williams differs
    from EPANET's by ~0.012%, so the solver carries both constant sets and defaults to ours.
  - **Phases 1–4 were originally scoped in the scope doc; Phase 1 is DONE** (shipped 2026-07-29,
    live as a PREVIEW page: page, toolbar, elements, popups, solve, autosave, diagnostics). Phase
    2 shipped most of its scope (labels, gear/settings panel, legend positioning, user-supplied
    backdrop image). **The rest of Phase 2/3/4's unbuilt items are no longer tracked as phases —
    reorganized 2026-07-29 into individually-prioritized child tasks 146.01–146.09 below** (plus
    Task 145, which already covers what was Phase 4), so each item's priority is visible instead
    of buried in phase prose. The scope doc retains the phase framing as historical narrative;
    ROADMAP priority is authoritative for what to work on next.

  **Backdrop: the network is drawn over a background, and the background is usually not a map (Tom,
  2026-07-28).** Nobody uses EPANET without a backdrop, and in practice that backdrop is a plan
  sheet, a CAD export, or a local aerial — **not** a Google map or Google aerial. So the primary
  backdrop feature is **a user-supplied image with a two-point scale/rotate registration**, in the
  page's own flat Cartesian world coordinates, with **no projection anywhere**. That is what EPANET
  itself does, it is a Phase 2-sized feature rather than a Phase 4 one, and it needs no API key, no
  terms of service, and no network connection — so it survives offline in the PWA. **Tiled online
  maps (Task 145) then become one more backdrop type that happens to arrive pre-registered**, not
  the foundation. Design consequence for Phase 0: the coordinate seam must be able to place and
  scale a backdrop image from day one, which is why the spike now includes one.
  **The canonical case is a screenshot with a bar scale on it** (Tom, 2026-07-29) — often a Google
  Maps screenshot, which is a completely different thing from a Google Maps integration: a plain
  image the user already has, no API, no key, no terms of service. It is also *why* two-point
  registration beats a scale-factor field: the user clicks the two ends of the bar scale and types
  what it says, which needs no knowledge of projections or units-per-pixel and works the same for a
  scanned plan, a CAD export, or a phone photo of a drawing on a wall. Make that the spike's
  backdrop acceptance test. A blank project carries placeholder text across the canvas — "Start by
  adding a background image using the toolbar." **The empty-canvas question is closed** (was open
  as of this paragraph's original writing; resolved by commit `7428ff0 Task 146: close the
  empty-canvas open question`, 2026-07-29) — a new project opens on the placeholder-text canvas
  above, not a worked example.
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

- 10|181| **Per-element symbol sizing (Task 146 child).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.
- 40|184| **Project/scenario model for saved networks: DELTA model — one save, canonical Base,
  scenarios are collections of overrides (Task 146 child).** Raised by Tom, 2026-07-30, thinking ahead to Task 146.08 (multiple named saved
  networks): "I am wondering whether the concept of project.scenario buys us anything… if multiple
  saves were grouped as scenarios under a project, we could conceivably, for any element, 'Push to
  project' to sync across scenarios. We could even get fine-grained with checkboxes in popups."
  **The question is not "should saves be grouped" but "what is shared and what varies."** Grouping
  alone buys a folder. Every serious package sells the answer as its differentiator — InfoWater's
  scenario manager over facility sets and alternatives, WaterGEMS' Alternatives / Scenarios /
  Calculation Options triple, WNTR's one `WaterNetworkModel` with programmatic overrides — and they
  all agree on the split: **topology and geometry are shared; demands, link statuses, roughness
  ageing and boundary heads are what vary.** None of them lets a scenario freely add and delete
  pipes and still call it a scenario; conflating those two is the usual way this feature turns
  confusing. EPANET itself gives you none of it: one `.inp` per scenario, whole network duplicated,
  no way to push a diameter correction across them.

  **DECISION (current, 2026-07-30, third and final pass): the DELTA model — one project save, a
  canonical Base, and scenarios that are nothing but collections of overrides.** Tom: "There is a
  project. It's a single save… It has scenarios that consist of overrides. That's all. A scenario is
  simply a collection of overrides? Base is canon is parent and has no overrides."

  **Why this reverses the copy-model decision recorded earlier the same day (kept below as
  superseded).** The copy-model argument was: the dangerous "clear/override children" action has to
  exist in BOTH models, so the delta model's remaining advantages are only organizational overhead
  and file-size parsimony, which no user feels. **That reasoning missed the bigger cost it was
  spending to avoid the smaller one.** In the copy model, propagation is an *action* — "Push to
  project" — and Tom found its failure by inspection: *"If I edit a child and then Push to Project,
  the original parent doesn't get my push because everything there is an override."* Push is the
  hassle, and a user feels it on every single edit. In the delta model **propagation is not an action
  at all**: editing Base *is* the propagation, there is no Push upward, and nothing silently fails to
  arrive. What survives is one dangerous action (below), and it operates inside a single document
  where its effects are visible in the same view and reversible in one undo — categorically safer
  than the copy model's push, which edits documents that are not on screen.

  The copy model's one genuine win was **"what am I working on right now"** (Tom's words). The status
  bar answers it: `Scenario: Fire flow · 7 overrides | Mode: …`. The override count is what makes it
  answerable at a glance, and it is only cheap to compute in the delta model.

  **Shape to build:**
  - **Two levels, permanently.** Base is canon and has no overrides; scenarios are leaves. No
    scenario-of-a-scenario. The asymmetry must be **structural, not conventional** — Tom's own
    diagnosis of what went wrong before: *"pushing becomes chaotic if everybody is equal."* Lazy
    overrides and ambiguous parentage are what a second level would reintroduce.
  - **Every edit in a non-Base scenario is an override, full stop** — even when the typed value
    equals Base's. This preserves the one decision worth carrying over from the copy-model writeup:
    the marker records **user INTENT at edit time** and is never computed by diffing. A diff cannot
    tell "I set this deliberately here" from "Base moved underneath me", and those need opposite
    treatment. Unchecking the marker is the un-do; the value returns to Base's.
  - **Show Base's value beside the scenario's** whenever a marker is checked, in the property row.
    This is the cheap fix for the one confusing case the model leaves: you correct a diameter in Base
    and a scenario that overrode it does not move. Seeing what you are diverging from, at the moment
    you can act on it, needs no change-tracking or "Base changed since" bookkeeping.
  - **"Push displayed properties hard downstream"** — the dangerous action, and it stays (Tom,
    2026-07-30: *"still needed for good UX"*). Base-side, it forces the displayed properties onto
    every scenario, ignoring their markers. Finger-wag with a count of scenarios and properties.
    "Displayed" is deliberate: the Labels panel is already the per-property checkbox filter, so
    Task 185's "reuse the Labels panel as the property filter" idea applies here directly and the
    user's own current view defines the blast radius.
  - **An overrides report is explicitly low priority** (Tom, 2026-07-30) — the map halos below make
    the same information visible in the place the user is already looking.
  - **Audit halos.** A highlight (outline, not fill, so it composes with the flow/pressure coloring)
    around every element carrying an override in the current scenario, filtered by the same Labels
    panel checkboxes.
  - **Copy is a project-level operation, not a scenario-level one.** "Save project as" duplicates the
    whole project — Base, scenarios, and markers together. This is where a self-contained copy is
    genuinely what the user wants, and it is the answer to the delta model's one real cost (one save
    = one blast radius). **Copy at the project level, delta at the scenario level**; each does the job
    it is good at. This retires the "Copy with / without overrides" naming problem entirely — there is
    no scenario-level copy that has to decide.

  **REVERSED, 2026-07-30: "topology and geometry are shared, only properties vary" was too strong.**
  Tom pushed back on it — *"Is it possibly not true even though this is what everybody does?"* — and
  he is right; the survey paragraph above overstated what the packages actually do. **WaterGEMS
  varies topology every day, via an active-topology alternative that toggles elements on and off.**
  What the packages really share is the *element set*, not the topology: membership is itself an
  overridable property. And the reason they stop there is partly historical — EPANET-lineage engines
  index links by array position and store result series against a fixed link set, which is an
  implementation constraint from the 1990s, not a conceptual truth. Meanwhile "with the new 12-inch
  loop vs. without" is *the* most common real design question this calculator will be asked, so a
  rule that forbids it would gut the feature. Corrected rule:
  - **Existence is an ordinary overridable boolean** (`active`). A proposed loop lives in Base as
    inactive; the "Build the loop" scenario overrides it to active. Deleting in a scenario means
    setting it inactive. No new delta type, no new machinery — the whole "topology varies" case is
    just a property override, which is exactly why this stays coherent.
  - **Drawing inside a scenario must still work.** When the user draws a new pipe in a scenario, the
    app silently creates it in Base as inactive and overrides it active in the current scenario. The
    user gets ordinary drawing; the model keeps a single ID space and a single element set. This is
    what makes the corrected rule feel like no rule at all.
  - **Deleting in Base is a real deletion** — it drops the element and every scenario's overrides on
    it. Confirm with a count.
  - **Geometry genuinely does stay shared**, and this is the part of the original rule with an actual
    reason rather than an inherited one: a node cannot be in two places at once in a single rendered
    map view.

  **The line, stated exactly (2026-07-30, agreed): MEMBERSHIP is overridable, IDENTITY is not.** A
  link's `from`/`to` and a node's `x`/`y` are Base-owned and never override; `active` is an ordinary
  property override like any other. This is narrower than the retired "topology is shared" rule and
  is the form worth defending, because:
  - **The escape hatch is cheaper than the feature it replaces, and better.** "Same pipe, different
    alignment" is two pipes with opposite `active` flags — one extra ID. And it is the *superior*
    representation: alignment variants nearly always differ in length, diameter and cost, so they
    want to be two separately priceable elements anyway.
  - **A connectivity override has no picture.** Re-pointing P-12 from J-5 to J-9 renders as a pipe
    that silently jumps when you switch scenarios, with no halo that reads as "this is the change."
    The inactive/active pair draws *both at once*, greyed and solid — precisely the image an engineer
    wants for "with the loop vs. without." The restriction is not a limitation; it is the mechanism
    that makes the comparison visible.
  - **Do not inherit the vendors' reason.** EPANET-lineage engines index links by array position
    against fixed result series; we store no result series and re-solve on scenario switch, so that
    constraint is theirs, not ours. Only the two reasons above are ours.
  - **Two honest costs, accepted with eyes open.** (1) Report tables (146.04) get two rows for one
    physical decision — the compare-with field below is the fix. (2) Mid-pipe insertion in one
    scenario clutters Base: a service tap means Base gains a junction plus two half-pipes, all
    inactive, plus deactivating the original run. That argues for an eventual "purge elements
    inactive in every scenario" affordance, and for the audit halos to also mark inactive-everywhere
    elements.

  **Storage shape (v2), and the one seam that matters:**
  ```json
  { "v": 2,
    "project": { "name": "Elm St. subdivision", "activeScenario": "base" },
    "nodes": [], "links": [], "labels": [],
    "nextId": {}, "labelSettings": {}, "backdrop": {}, "settings": {},
    "scenarios": [
      { "id": "base", "name": "Base", "isBase": true, "overrides": {} },
      { "id": "s1", "name": "Fire flow", "overrides": {
          "J-3":  { "demand": 1500 },
          "P-12": { "active": true },
          "P-4":  { "active": false } } } ] }
  ```
  - **The key's presence IS the marker.** No parallel marker array to drift out of sync: writing
    `overrides["J-3"].demand` records intent, deleting it is the un-do, and both hold even when the
    value equals Base's. The status bar's override count is a sum of key counts.
  - **Base is a row in the same array**, flagged `isBase` with a permanently empty `overrides`. The
    scenario selector then has no special case, and because nothing carries a parent pointer, a
    scenario-of-a-scenario is *unrepresentable* rather than merely discouraged — the structural
    asymmetry the model requires.
  - **One resolver seam:** `effective(el, prop)` → `override ?? el[prop]`. Solver, renderer, labels
    and popups all read through it. **Build this seam in 146.08 while Base is still the only
    scenario** — it, not the JSON wrapper, is what makes scenarios purely additive later.
  - **An overridable-property whitelist**, cheap to widen and expensive to narrow. Start with:
    junction `demand` and `emitter` (Task 191); reservoir/tank `head`; pipe `diameter`, `roughness`,
    `k`, `open` (146.07); `active` on anything. Explicitly out: `id`, `from`, `to`, `x`, `y`, `verts`,
    `type`, and junction `elev` (survey data, not a design variable).
  - **v1 → v2 is a wrap, no data loss**: the existing `lpn_document` becomes project "Untitled" with
    one Base scenario.

  **Dragging inside a scenario: no dialog. Silent to Base, with ambient warning.** Two unequal
  intents hide behind a drag — "that node is in the wrong place" (a fact about reality, the
  overwhelming majority) and "in this scenario the manhole is 40 ft north" (rare, and when real it
  wants to be a separate priced element anyway). A modal taxes the common case to serve the rare one,
  and drags are not discrete decisions but nudge-nudge-nudge; users would learn to click through
  without reading, which is worse than no dialog. **Note this is a hydraulic edit, not just a
  cartographic one:** `lenAuto` (`js/looped-network.js:740`) makes `length` follow geometry until the
  user takes control, so a drag changes a solver input in every scenario. What replaces the dialog:
  - **A one-time, dismissible notice** on the first drag in a non-Base scenario: "Moving elements
    changes the drawing in every scenario. Property changes stay in this scenario." [OK] [Don't show
    again].
  - **Ambient state, not modal** — flash the recomputed length in the status bar on mouse-up when the
    dragged link is auto-length, so the hydraulic consequence leaves a visible trace.
  - **Undo.** One document, one undo stack, effect on screen — categorically better than the retired
    copy model, whose push edited documents the user could not see.
  - **"Create scenario geometry variant"** (Tom's wording, 2026-07-30) is the deliberate path, and it
    is an *up-front command, never a post-drag question*: clone the element (new ID, same geometry and
    properties), set the original inactive here, set the clone active only here — then drag the clone.
    By the time a post-drag modal could fire the gesture is already complete, so "create a copy" would
    have to retroactively reinterpret what just happened. Same machinery as drawing a new pipe in a
    scenario, so no new concept. **Entry path in 146.08 is the toolbar/menu only** — see Task 192 for
    why the right-click path is a separate build.
  - **A non-clone escape valve already exists:** `length` is a property with a manual-override flag,
    so a scenario wanting a different length *without* a different drawing just overrides `length`.
    The clone stays reserved for real re-routes. Vertices follow the identical rule — a vertex list is
    geometry, Base-owned.

  **"Compare with base ID" — a visible, blank-by-default, usually-guessable string field** (Tom,
  2026-07-30, simplifying an earlier proposal for a hidden clone id + named group). It is what makes
  the two-elements-per-variant rule legible instead of chaotic, and it is load-bearing for 146.08
  rather than a 146.04 report-table nicety — it is simultaneously the table's row key, the halo
  grouping, and the cleanup handle for "pipes could get out of control fast."
  - **A string, never a live reference.** Grouping is string equality; nothing is ever dereferenced.
    This is why deleting the base object cannot break it — the earlier objection to a pointer applied
    only to a resolved one. The group's name simply *is* that string, normally the base object's ID.
  - **Capture, don't infer, as the primary path.** "Create scenario geometry variant" knows the
    relationship with certainty at creation and writes it then — the same principle as the override
    marker: a diff cannot tell "deliberate" from "drifted," and a geometric guess cannot tell
    "alternative alignment" from "two pipes that happen to be near each other," least of all in the
    congested drawings where it matters most.
  - **Guessing is the secondary path**, for pipes drawn independently before the user thought of them
    as alternatives. Two signals, the second near-conclusive: same endpoints, and **never active in
    the same scenario**. Offer as a *suggestion*, visually distinct from confirmed, one click to
    accept or reject.
  - **Follow renames while the object exists; freeze on delete.** Renaming P-12 → P-100 updates every
    member's field (we own the rename path, it is cheap, and it is what the user meant). Once P-12 is
    deleted there is nothing to follow, so it freezes into a plain name and we hint, at that moment
    and not as a standing nag: "Group is named after a deleted object ID. Consider changing to a
    friendly name."
  - **A collision is cosmetic, not corrupting.** If a later pipe is renamed *into* a deleted group's
    name the label reads oddly, but since the string is never resolved nothing breaks. Warn on the
    rename; build no machinery.
  - **What the table then does:** one row per *design decision*, not per element. The group name is
    the row; each scenario's column shows whichever member is active there, with the member ID in a
    sub-cell.
  - **Two guards fall out free.** Two members active in the same scenario is a table flag and a halo
    candidate (not necessarily an error — you might build both). A group whose members are inactive
    everywhere is exactly the "purge unused" candidate above.

  **This entry is the DECISION RECORD, not a build task.** Everything above is settled; what remains
  is to build it, which is **Task 201**. Two bullets that used to live in 146.08 moved there on
  2026-08-03 rather than being left in a closed block.

  **Sequencing:** 146.08 must ship the **project container from day one**, holding Base as its only
  scenario. Then scenarios are purely additive and there is never a storage migration. Tom flagged
  this himself — *"this is an important decision because we want to introduce it early"* — and it is
  the reason the model had to be settled before 146.08 rather than after.

  ---
  **SUPERSEDED (kept for the reasoning, not the conclusion) — the copy model, decided and reversed
  2026-07-30.** A scenario would be a whole, self-contained network; it keeps working if the project
  is renamed or deleted, "Save as" is a copy, and undo/versioning stay per-document. It needed:
  "Push to project" (promote this scenario's values up and out to siblings that have NOT overridden
  that property, finger-wagged because it edits documents not on screen); "Push through all
  overrides" (the same, ignoring markers — double finger-wag, and it destroys deliberate work in
  scenarios the user cannot see); and a two-mode copy, since a copy must decide what happens to the
  source's markers — "Copy with overrides" (default) / "Copy without overrides", preferred over
  Tom's original "Copy as child / Copy as sibling" because in that model every scenario is already
  both a child of the project and a sibling of every other scenario, so the genealogy named a
  distinction that did not exist, and because "child"/"sibling" applied to a FILE is an English
  computing idiom that does not carry into 26 languages. Its sequencing note read: ship 146.08 as
  flat named saves first, since flat saves ARE the copy model already. **All of this is retired by
  the delta decision above** — the naming problem disappears with scenario-level copy, and the
  sequencing note inverts: the container must come first, not the flat saves.

- 30|192| **Right-click / long-press context-menu system (Task 146 child).** Raised by Tom,
  2026-07-30, when "Create scenario geometry variant" (Task 184) was proposed as a right-click
  action: the calculator has **no right-click capability at all today**, so that action cannot
  quietly introduce one. Tom: *"if we add right-click, it should be built out robustly. It's a habit
  that, once taught or discovered, we should leverage."* Hence a task of its own, and hence 146.08
  ships its command on the toolbar/menu path only — this is not a blocker for it.
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
- 40|201| **Scenario UI — build what Task 184 decided (Task 146 child).** Created 2026-08-03 while
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

- 35|185| **Match/Copy properties tool (Task 146 child).** Tom, 2026-07-30: "In the absence of the
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
- 15|186| **Table-paradigm editor with spreadsheet copy/paste (Task 146 child).** Tom, 2026-07-30:
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
  (Task 146 child).** Raised 2026-07-30 when Tom asked of the Settings panel's "Emitter exponent"
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
- 15|146.07| **Open/Closed link property (Task 146 child).** A simple boolean state on a link. Tom,
  2026-07-29: explicitly not a "valve" and not modeled via minor-loss-coefficient (Km) abuse — just
  a plain open/closed state, kept simple.
- 15|194| **Touch gesture model: one finger scrolls the page, two fingers pan the map (Task 146
  child).** Raised by Tom, 2026-07-31, after the canvas-fills-the-phone lock-up: *"It didn't occur
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
- 0|195| **[DONE 2026-08-03 — both phases shipped] Export/import a `lpn_` project as a file.**
  Phase 1 one-shot JSON download/import; Phase 2 live `FileSystemFileHandle` with a server lock
  broker (`lpn-lock.php`). Phase 2's UI was then superseded by Task 211's tab-and-File-menu rebuild.
  Design narrative archived in `dev/roadmap-closed-archive.md`.
  **Browser verification is NOT part of this task — it is Task 220.**

- 0|212| **[DONE 2026-08-05] Persisted file handles — a reload no longer drops the file.**
  Handles are kept in IndexedDB (structured-cloneable; localStorage cannot hold them). On boot
  `queryPermission()` decides: **granted** reconnects silently, **prompt** is held pending and the
  banner becomes a one-click *Reconnect to this file* — no picker, no hunting — and **denied** or a
  missing API is dropped. A handle whose project has been closed is dropped rather than restored.
  Verified by `dev/lpn-spike/handle-restore-harness.js` (26 checks, mutation-tested) rather than by
  adding six boxes to Tom's punch list.
  - **A banner is not "nothing"** (Tom, 2026-08-05, on the first cut: "I should get nothing, or a
    prompt for single-click permission to reconnect"). A grant does not vanish on reload, it goes
    **dormant**: `queryPermission()` says `prompt`, but `requestPermission()` revives it showing the
    user *nothing* — provided it has a live user activation. Boot has none, which is why it must not
    ask. So the **first pointerdown or keydown** on the page is spent on it instead
    (`armPendingReconnect()`), once per project. Ordinary case: the banner is gone before it is read.
    Where the grant really is gone the browser puts its own one-click bubble up, which is the honest
    version of the question and what Tom asked for.
  - `lpn_file_needs_reopen` said "a browser does not stay connected to a file after the page is
    reloaded" — no longer true, and the sentence Tom hit. It now says the connection to *that file*
    was lost, which is what the remaining cases (permission withdrawn, private browsing, a project
    last opened before the IndexedDB store existed) actually are.
  - **Promoted from 20 and done out of order** because it was not a nicety: every reload disconnected,
    so it contaminated every browser pass and produced three separate "reload doesn't work" reports.
  - Still deferred: `Open Recent`, and answering "is this the same file?" across sessions. Those were
    the other half of this task and want `isSameEntry()`; extract them if they earn it.
- 55|225| **The `lpn_` punch-list leftovers — small, confirmed, and none of them dangerous.** Extracted
  from Tasks 223/220 as they closed, because a defect left inside a `## Completed` block is a defect
  nobody reads again. All confirmed in a browser; full wording in
  `dev/lpn-file-lock-test-punchlist.md` § Findings.
  - **§4 Closing a tab activates the LAST-CREATED project** rather than the next one rightward, which
    is what every tab strip in the world does.
  - **§4 Status messages overwrite each other** — "nodes have no path to a reservoir" ate the message
    saying what had just closed. They should queue, or the notice should outlive the diagnostic.
  - **§4 The "gone for good" prompt fires for an empty, untouched new project**, where there is
    nothing to lose and the question is noise.
  - **§6 The lock dialog says "1 minutes ago".** `agoText()` has no singular. **Deliberately timed
    with the `lpn_` translation sprint**: three singular forms now become 78 then.
  - **§13 needs the rewrite §0–§8 got** (Tom: *"Some stuff no longer exists or is renamed"*), before
    anybody is asked to run that section again.
  - Two feature asks, both from Tom and both real: a `beforeunload` **"Leave site?"** when a connected
    file has unsaved work, and his suggestion for the Restore-settings tip — *"To save your favorite
    settings, save a project file with nothing but settings."*

- 45|209| **A snoozable tip system (Task 146 child, but suite-shaped).** Asked for by Tom,
  2026-08-03, while reviewing Task 195's file-and-lock explanation: the page needs somewhere to put
  "here is what is about to happen" text that a user can dismiss for now and see again later, rather
  than the two states we have (shown once ever, or shown every time). Phase 2's training panel is the
  first instance and currently uses the crude version — **shown once per browser, keyed off whether
  an identity exists** — which is right for onboarding and wrong for anything a user might want back.
  Wants: dismiss, snooze, and a way to bring a tip back deliberately (a "show me that again" in
  Settings). Suite-shaped rather than `lpn_`-only: every calculator has explanations it currently
  either buries in Notes or repeats forever.
  - **Second concrete instance, 2026-08-06:** Save all switches tabs as it saves — ugly, but the
    honest consequence of the write path writing the OPEN project (punch list §3). Tom: *"Some sort
    of an explanation might be nice. But I don't know where or how unless we had a snoozable tip
    system."* That is this task, and it is why the priority moved 40 → 45: it now has two real things
    to say, and a tip system with nothing to say is scaffolding.

- 20|196| **EPANET `.inp` import/export (Task 146 child) — a separate task from Task 195, deliberately.**
  Raised 2026-08-01. **This reopens a decision already made once**: the scope doc records
  `.inp` interop as "distinct from" Task 195 and says "Tom confirmed 2026-07-29 is not needed," in
  favor of Task 146.08's local multi-project save/retrieve instead. Logging it here is a conscious
  reversal of that call, not an oversight — note it as such if it's picked up, rather than losing
  the history of why it was declined the first time.

  **Independent of Task 195's native format, in both directions, and independent of whether Phase 1
  or Phase 2 of that task has shipped.** `.inp` import/export is interop with a DIFFERENT program's
  file format, not a persistence mechanism — it is two transcode functions between `.inp` text and
  the same in-memory `doc` object every one of Task 195's phases already reads and writes, so it
  slots in beside localStorage, JSON download/import, or a live file handle without changing any of
  them.
  - **Export is the easy direction.** Every element this suite models (junctions, reservoirs,
    pipes, pumps with curves) is a strict subset of what `.inp` can express — nothing here needs a
    lossy projection. A straightforward serializer, buildable independent of anything else on this
    list.
  - **Import is the harder direction**, because a real-world `.inp` file can carry things this
    calculator has deliberately cut (tanks, PRV/PSV/FCV, patterns, water quality, energy cost — see
    the scope doc's "Cut, not deferred" list). Needs a defined behavior: reject a file that uses a
    cut feature, or import the supported subset and report exactly what was dropped. Silently
    dropping data on import would be the worse of the two.
  - **The known ~0.012% Hazen-Williams constant mismatch against EPANET is already handled
    infrastructure, not new work.** `js/lpn-solver.js` already carries both constant sets
    (`EngCalcs.lpnConstants.engcalcs` and `.epanet`) for exactly this reason — an imported network
    can default to `'epanet'` constants so results agree with the source file it came from.
  - **UI convenience, not an architectural dependency:** naturally sits on the same file-menu
    surface as Task 195's Import/Export actions, so building it alongside whichever of that task's
    phases is in flight avoids building the menu twice — but nothing here blocks on that timing.
- 5|146.09| **Map insets for congested areas of a drawing (Task 146 child).** Very low priority.
- 20|177| **Link head loss: report the per-length gradient alongside total (Task 146 child).**
  Conventional network software and reports express pipe head loss in TWO forms, not one, because
  they answer different questions: **total head loss** (ft or m across the whole link — what you
  need to build the HGL/EGL, and what `lpn_` already reports) and a **per-length gradient/slope**
  (independent of how long the pipe happens to be — the form used to screen/compare pipes against a
  design criterion, e.g. "keep it under 5 ft per 1000 ft"). EPANET's own default Link Results table
  leads with the per-length form ("Unit Headloss", ft/1000ft or m/km) and derives total separately;
  WaterCAD/InfoWater-class tools show both as separate columns for the same reason. **`lpn_` should
  reuse this suite's OWN existing convention for this exact concept, not invent a new one**:
  `mpf_`/`mphl_` already report friction slope through the `'slope'` unit family
  (`lib/Units.lib.php`: `grade` = ft/ft or m/m, `gradePercent` = %) — a dimensionless ratio, not
  EPANET's per-1000-length form, but the same underlying quantity (head loss ÷ length) and already
  translated/established suite-wide. Add a link "Head loss gradient" field (`headloss/length`)
  alongside the existing total, using the `slope` family — parallel to how `headgain` just got
  split out from `headloss` as its own field/color/extrema bucket, not merged into it. Needs one
  new unit selector on the page (`echoUnitSelect('lpn_u_gradient', 'slope', '')`) and a
  `lpnFieldColors`/`linkFieldDefs`/`defaultLabelSettings` entry, same shape as every other field
  added this way. Not yet built — a real design question (does `lpn_` want `grade`/`gradePercent`
  like `mpf_`/`mphl_`, or is a per-1000-length form worth introducing as a second option) should be
  confirmed with Tom before wiring the selector, since it's the kind of suite-wide convention choice
  CLAUDE.md's concept-level reuse rule cares about getting right once rather than per-page.
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

- 85|222| **Position `lpn_` against epanet-js — do not lead with "free EPANET in the browser."**
  Researched 2026-08-05 at Tom's request, before a blog/YouTube push.
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
  - **Unverified, do not claim publicly until checked:** their actual language count. Their help
    centre is Notion and did not scrape; only Spanish was confirmed.
  - **Why not lead with it as a TAGLINE:** on that exact claim they are already better and free, so
    the comparison a reader runs next is one we lose. Lead where they have publicly conceded the
    ground — phone/field use, 26 languages, offline PWA, GPL that cannot be revoked.
  - **TOM OVERRULED THE BROADER VERSION OF THIS, 2026-08-09, and he is right:** *"I disagree with
    not leading with EPANET engine once we have it. I think it could be a litmus test for some
    orgs."* The two claims are about different things. Mine was about the consumer-facing headline;
    his is about **qualification** — for some agencies and NGOs "does it run the actual EPANET
    engine?" is a yes/no gate that decides whether we get evaluated at all, and no amount of
    mobile/multilingual advantage substitutes for a "yes". **So: say it prominently and make it
    checkable; just do not spend the blog/video headline on it.** Do not relitigate.
  - Consequence: raised 146.06 to 90 and 220 to 95.

- 60|254| **lpn greets a first-time visitor with an empty canvas, and converts worst because of it.**
  From the 2026-08-09 usage snapshot (`dev/usage-data-log.md`): lpn shops best of the complex
  calculators (51, vs bpn 19 and ip 9) and then **converts worst — 14% of shoppers use it**, below
  every peer but bpn, against 58–70% for the Manning family. 51 opened it, 44 computed nothing.
  Attraction is not the problem; the first minute is.
  - **lpn is the ONLY calculator that opens on nothing.** Every other page opens on a worked
    example that already computes — CLAUDE.md's own rule. lpn shows `lpn_empty_hint` text and an
    empty canvas; `drawExampleNetwork()` exists but has to be found and clicked.
  - **Fix: draw the example network automatically for a visitor with no saved project**, so the
    page opens solved, labelled and pannable — then they delete it or start over. Same principle as
    every other page's default inputs. Cheap: the function already exists.
  - This is the highest-value small task on the list, and it must land BEFORE Task 251's sprint —
    translating a page nobody gets past is spending 26 languages on a first screen that fails.

- 35|252| **Reorder project tabs, left/right.** Tom, 2026-08-09: *"We talked about this, but I
  guess we forgot about it. Either Drag or click an item on the tab menu. Either one is fine."*
  He is right that it was dropped. Either mechanism is authorized; the tab menu item is the
  cheaper one and works on touch, where tab-dragging fights the scroll gesture.

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

- 25|250|[H] **Where do we explain lpn at all? A Help menu on the page.** Tom, 2026-08-09, after
  the EPANET toggle shipped: *"Where are we going to discuss, explain, or feature this? Does lpn
  need its own Help menu in the pull-down and the toolbar after Settings? Help > About and Help >
  I don't know what else (Videos? I already have two. Features? Discover?)."*
  - **The real gap is that lpn has no front door.** Every claim we just built — real EPANET
    engine, GPL, offline, 26 languages — is invisible on the page itself. That is also Task 222's
    unfinished half: positioning nobody can read is not positioning.
  - **Tom already has two videos.** Linking what exists beats authoring anything new, so the
    cheapest real version is Help > About (what this is, what engine, what licence, link to
    About.php) + Help > Videos. "Features"/"Discover" needs content that does not exist — do not
    scope it until something is written.
  - **[H] Tom decides the menu shape before this is built.**

- 40|251| **Promote `lpn` to a core calculator in `translation_coverage.json`?** Tom,
  2026-08-09: *"If we care about lpn and its 26-language offering, then we must irrationally add
  lpn to the top tier... But maybe we block this behind other tasks."* He is right that it is
  irrational on current evidence and right to hesitate.
  - **DECIDED: DO IT. Tom asked 2026-08-09 why CC was resistant, and the resistance was wrong.**
    Three counts. (1) The cost was overstated: 22 languages x 226 keys is 22 agents in ONE sprint,
    the same shape as the wave-1 category sprints and as 146.06 itself — not "the largest
    commitment ever considered". (2) "Least measured reach" is the wrong test here, and this
    project already knows it: zero reach is not low value when the mission is reach into places
    that have none. (3) The Task 216 gate was borrowed from Task 217, where it fits an
    outsourceable reference table; it does not fit a mission claim.
  - **The one REAL cost is churn, not the sprint: maintenance.** Today an English edit to an
    `lpn_` string costs 4 languages; after promotion it costs 26. `lpn_` is still moving —
    Tasks 248, 250, 252, 253 all add or change strings. **So the gate is ENGLISH STABILITY, not
    the beacon:** land the current `lpn_` UI batch, then promote and sprint once over a settled
    surface rather than three times over a moving one.
  - **BUT THE HONESTY PROBLEM IS SEPARATE AND DOES NOT WAIT FOR THE BEACON.** Tom, 2026-08-09:
    *"Maybe irrational, but consistent. We've been talking out of one side of our mouth that
    languages are a superpower of lpn when it really has only 4 (about the same as epanet-js)."*
    He is right, and this is the more urgent half. Task 222's surviving differentiator list says
    "26 languages"; on `lpn_` that is FOUR, which is parity with the competitor, not an edge. So
    **either promote lpn, or stop citing 26 languages when positioning lpn specifically** — the
    suite-wide claim stays true, the page-level one does not. Fix the claim now; decide the
    promotion on the beacon.

- 20|248| **What the EPANET toggle actually unlocks: tanks, valves, extended-period simulation.**
  Task 243 shipped the engine and the toggle; none of this is built. The engine makes each of
  these a mapping-and-UI job rather than a numerical one, which is the entire reason it was worth
  vendoring. Do NOT start until someone asks for one — Task 243's own conclusion was that the
  toggle is the cheap 90% of the value and these are the expensive 10%.

- 15|249| **Translate the 5 `lpn_` engine keys into the core four.** `lpn_settings_engine_epanet`,
  its tip, `lpn_engine_loading`, `_failed`, `_manning_note`. English shipped 2026-08-09; `lpn_` is
  not a core calculator under the Task 203 cross, so es/pt/fr/tr only. Fold into the next `lpn_`
  sprint rather than running one for five strings.

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

- 80|216| **Beacon outbound reference-link clicks, with the visitor's language.** Raised by Tom,
  2026-08-05: *"How often are non-English people asking for 'n' help? And should we let them somehow
  complain that the reference is only English?"*
  - **Build the beacon; skip the complaint UI.** The click *is* the complaint. A non-English visitor
    clicking an English-only reference is a complete, zero-cost, unambiguous signal. A button asking
    them to additionally *say* they would like it translated collects the same bit at a much higher
    price, and an interstitial page would tax the majority to survey the minority. Tom agreed,
    2026-08-05.
  - **What to log:** page, `lang`, and which link. Same beacon pattern and the same
    `ecLoggingOptedOut()` check as the other writers.
  - **The links that matter:** the Manning's n table
    (`engineeringtoolbox.com/mannings-roughness-d_799.html`, on `Manning-Pipe-Flow.php` and
    `Manning-Trap.php`), the Hazen-Williams C table (`Hazen-Williams.php`), the EPA roughness
    document (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`), and our own English-only
    `frictionslope.php` — whose tip already admits "English only" in all 26 languages, so we know
    the visitor clicked *knowing* that.
  - **The decision it feeds is Task 217**, so this metric arrives with a decision already attached
    rather than becoming another number nobody acts on.

- 80|200| **Usage logging: the questions the current report cannot answer.** Raised by Tom,
  2026-08-03: *"I'd like to get more guidance about our development priorities from usage logging."*
  Ordered by value ÷ effort. Nothing here needs a database — the existing
  `log-calc-event.php` / `log-human-view.php` beacon pattern covers all of it.
  - **First, two things about how the CURRENT report must be read, which cost nothing to adopt:**
    - **There is a bot floor around 900.** Almost every page sits at 834–1193 reach regardless of
      how many humans it gets; only Manning-Pipe-Flow (3619) and Manning-Trap (2141) rise above it.
      So for every other page `%human of reach` is a signal-to-noise ratio, not a conversion rate,
      and driving it up is not a goal.
    - **Below roughly 40 humans, `%used` is noise.** Only MPF (1576 humans), Manning-Trap (242) and
      marginally Hazen-Williams (60) have the sample for that ratio to mean anything. The single-digit
      rows — Canal-Seepage at 1 human, Weir-Flow-Irregular at 2 — cannot support any decision, and
      reading them as failure is a mistake. What those pages need is not a metric, it is either
      traffic or an honest decision that they are niche.
  - **Repeat use — the strongest value signal we do not collect.** One flag in `localStorage` per
    page ("this browser has logged a calc here before") turns every event into new-vs-returning. A
    calculator a working engineer comes back to is worth more than a hundred one-off visits, and
    nothing in the present report can distinguish those two.
  - **Did they touch anything before leaving?** For a human who never calculates, one bit: did any
    input change at all? Splits "could not understand it" from "did not want it", which are opposite
    development responses, and it is the cheapest diagnostic on this list.
  - **`lpn_` first action, and `lpn_` diagnostic frequency.** Which of draw-example / add-element /
    add-background / nothing happens first, and which of the four diagnostics fires most. Between
    them they name exactly where the map interface loses people. **This is also the first evidence
    that would bear on the empty-canvas decision** (closed 2026-07-29, commit `7428ff0`: a new
    project opens on placeholder text rather than a worked example) — a decision made with no data,
    which the first-action histogram would either vindicate or overturn.
  - ~~Language × calculator cross-tab~~ — **BUILT 2026-08-03**, and it was nearly free as predicted.
    All three tiers already carried both dimensions (`engcalcs-lang.log` = ts/lang/source/page; both
    human logs = ts/page/lang). New "Non-English HUMANS by calculator" section in
    `log/lang-log-stats.sh`.
    - **A reach-tier version already existed** ("Non-English demand by page") and is the reason this
      looked answered. It is built from `engcalcs-lang.log` — the tier with the ~900/page bot floor —
      so it largely counts crawlers. The new section is built from the two confirmed-human logs,
      which bots essentially never reach, so every row is a real person. Keep both; they answer
      different questions and only one of them should sequence a sprint.
    - **An empty table is the finding**, and the section says so in place: 26 translated languages
      with no confirmed non-English human use would bear directly on how much further translation
      work is worth before the pages themselves earn traffic. Verified against fixtures for both the
      populated and empty cases, including `es-MX` → `es` subtag folding.
    - Not yet run against production data — the dev machine has 7 human-view rows and no usage log
      at all.
  - **US vs SI actually chosen**, one bit per session — validates `EC_DEFAULT_UNIT_SET`-by-language
    and shows whether per-page unit-family defaults are right (ROADMAP Task 162's design).
    **Widen this to the unit token each select actually lands on**, per family, not just the preset.
    Asked by Tom, 2026-08-05: *"How often are units being used? Are there units we can drop because
    nobody really uses them?"* Three findings from that discussion, recorded so they are not
    re-brainstormed:
    - **Prefer REORDERING to removal.** An unused option in a dropdown costs a user essentially
      nothing; a *missing* one costs them the whole calculator. And with roughly four thousand humans
      total, "no hits in three months" on a long-tail unit is weak evidence — that is deleting on
      absence of data from a small sample. Reordering by measured frequency captures most of the
      benefit at none of the risk. Set a high bar for any actual removal.
    - **An "Other" option INSIDE a unit select is actively dangerous here.** Per the standing rule in
      CLAUDE.md, changing a unit select *reinterprets* the typed number rather than converting it, so
      choosing "Other" would silently reinterpret the user's value while a dialog sits open. If the
      ask is wanted it must be a non-selecting affordance — an item that opens a prompt and reverts
      the select, or better a small `?` beside the unit strip.
    - **Tom likes the units `?` as an EXPERIMENT** (2026-08-05). Frame it that way: it is really
      Rung 0 of the feedback cost-ladder (Task 207) applied to units, not a units feature, and it
      should be measured like an experiment rather than shipped as a permanent affordance on faith.
  - **First run happened 2026-08-03 and the cross-tab immediately paid for itself** — see
    `dev/usage-data-log.md` and Task 202. Headline: 290 non-English humans shopping, 170 using, and
    one clear quality outlier that no other instrument in the suite had surfaced. The remaining
    ideas below are still unbuilt.
  - **Lower value, listed so they are not re-brainstormed:** time-to-first-calc (separates a
    confusing page from a long one); print / copy-link use as a proxy for work someone intends to
    keep; intra-site path (which calculator is the entry point and where people go next).

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

- 0|243| **[DONE 2026-08-09] Real EPANET engine in `lpn_`, as an opt-in second engine.**
  `js/lpn-epanet.js` + `js/vendor/` (epanet-js 0.9.0, MIT). Settings toggle, off by default;
  678 KB lazy-imported only when checked, so the offline case pays nothing. Verified
  `node dev/lpn-spike/validate_epanet.js` 8/8 against the native solver.
  - **Manning is a real 0.6% disagreement and we KEPT OURS** — the opposite of the Task 213
    Hazen-Williams call. Measured over an 8x diameter range, EPANET's C-M is a near-constant
    0.9939–0.9944 of ours (*not* the truncated 16/3 exponent, which predicts 0.9924–0.9993 and is
    refuted). Ours is the exact derivation, 10.2936; EPANET's implies 10.231. Adopting EPANET's
    would desync this page from Manning-Pipe-Flow/-Head-Loss/-Trap, which carry most of our users.
    Surfaced to the user, not hidden. **Do not relitigate.**
  - **Vendored as `.js`, never `.mjs`** — module-ness comes from the import statement, but the
    server must still send a JS MIME type and shared hosts routinely do not know `.mjs`. Same
    reasoning chose the WASM-embedded build over a separate `.wasm`. See `js/vendor/README.md`.
  - **`dev/lpn-spike/validate.js` had been silently FAILING** and was repaired in passing
    (`bootstrap.js`). `EngCalcs.G` lives in `js/Calculators.lib.js`; a Node `require()` of
    lpn-solver.js skips it, every minor-loss and D-W resistance went `NaN`, and the gradient floor
    swallows `NaN` because `!(NaN > gradMin)` is true — so networks "converged" in 2 iterations to
    no head loss and reported success. Browser was never affected. **The lesson is that a harness
    nobody runs is worse than no harness: run both before trusting either.**

- 0|245| **[DONE 2026-08-09] About-page resync + `menu_libre` into all 26 languages.** 3 keys ×
  26 agents (Sonnet). Final state: parity `missing 0, extra 0, equal_to_english 0`; drift manifest
  re-baselined; friction gate 6/6 answered.
  - **Every language used its own established free-software term; not one transliterated "libre"** —
    the exact failure the new `glossary.json` entry was written to prevent. es *software libre*,
    de *Freie Software*, ru *Свободное ПО*, zh *自由软件*, ar *برمجيات حرة*, am *ነጻ ሶፍትዌር*,
    km *កម្មវិធីសេរី*, my *လွတ်လပ်သော ဆော့ဖ်ဝဲ*, sw *Programu Huria*.
  - **Found and fixed a silent parse-truncation bug in `lang_parse.inc.php`** (see its comment).
    Burmese at 3 bytes/char pushed one value to 8,354 bytes, exhausting PCRE's JIT stack;
    `preg_match_all` returned false, the return was unchecked, and the parse silently truncated to
    386 of 563 keys — blinding the validator, parity checker, completion matrix and payload
    generator at once. **This was luck, not diligence: it surfaced only because Burmese prose
    crossed the threshold first.** Any multi-byte script at ordinary paragraph length reaches it.
  - **Two agents committed and one pushed despite "do not run git commands."** A bare instruction
    loses to CLAUDE.md's commit-by-default policy inside a subagent. The wording that held was an
    explicit "DO NOT RUN ANY GIT COMMAND — no add, no commit, no push, no status." Use that form.
  - Long-running agents are normal: km and my each ran ~6 h across a session-limit reset and
    finished correctly. **Check the file before relaunching a "failed" agent** — sw and ps had
    already written their work when their agents died.

- 0|146.10| **[DONE 2026-08-09] Real element symbols on the lpn map, from the Task 231 icon set
  (Task 146 child).** Scoped with Tom 2026-08-08. A reservoir and a junction were the same `<circle>`
  mark, told apart only by size and colour — the same mark in greyscale and to a red-green
  colour-blind reader (~8% of men) — and a pump (a *link*, not a node) had no symbol at all, just a
  plain coloured line.
  - **Reservoir**: the plain circle in `js/looped-network.js` `buildNodeEls()` stays exactly as it
    was — same radius, same `data-node`, same click/drag/hit-test path — but is now invisible
    (`fill:none; stroke:none`) and kept clickable purely via `pointer-events:all` (`css/engcalcs.css`
    `.lpn-node-reservoir`). A second, non-interactive element drawn on top of it is the real visible
    mark: the toolbar's own reservoir icon (`lib/Icons.lib.php`, arrived as `EngCalcs.icons` — never
    redrawn), placed via `buildMapIconSvg()`, a nested `<svg viewBox="0 0 24 24">` sized to
    `2×nodeRadius(n)` and positioned by `positionNodeSymbol()`. Junction is unchanged — it was already
    a filled circle, which is what the Task 231 icon draws too.
  - **Pump**: same reuse pattern, on a link instead of a node — `buildLinkEls()` adds a `<g
    class="lpn-link-symbol-pump">` in the nodesLayer (so it paints over every pipe it crosses),
    holding the pump icon (casing + tangent discharge tail) at the link's own from/to midpoint.
    **Orientation, verified over all 25 angles at 15° steps, 0 failures:** always
    `rotate(atan2(to.y−from.y, to.x−from.x))` so the discharge points at the `to` node, and — because
    that rotation alone swings the tail under the casing for every westward pump — vertically flip
    (`scale(1,−1)`) first whenever `dx = to.x − from.x < 0`. Boundary is on `dx`, never `dy`: at
    `dx=0` the tail lands horizontal and either variant is correct. Verified in a headless-browser
    check (Playwright): an east-pointing pump transforms to `rotate(0)`, no flip; a west-pointing one
    (built by drawing a pump from an east node to a west node through the actual toolbar) transforms
    to `rotate(180) scale(1,−1)`, exactly as specified.
  - **Every constraint the scoping note called out held with no extra work**, because `nodeRadius()`
    itself was left untouched — only what gets DRAWN inside its footprint changed. `segmentMidpoints()`
    (arrow clear-run), label mask/leader placement, hit-testing, and the zoom-extent `bbox()` all still
    read the same scalar radius they always did, so none of them needed to change.
  - Symbol sizing (`pumpSymbolSize() = 4 × symbolFactor()`) is a starting value, a one-line change if
    Tom wants pumps to read larger or smaller relative to reservoirs/junctions — noted rather than
    hand-tuned, same spirit as `lib/Icons.lib.php`'s own "one-line change" notes on the pump tail.
  - **Follow-up, same day (Tom): two more things needed fixing before this could ship.**
    1. **Opacity.** A toolbar icon is drawn stroke-only (`fill:none` — correct for a button, nothing
       is ever behind it), so on the map a pipe ran right through the open/translucent parts of a
       reservoir tank or a pump casing and stayed visible. Fixed by `prependSymbolBackdrop()`: an
       opaque patch (rect for the reservoir, circle for the pump casing — matching each icon's own
       silhouette, not just its bounding square) inserted as the FIRST child of the icon's nested
       `<svg>`, so it paints underneath the icon's own unmodified linework. Filled with the new
       `--lpn-map-bg` custom property (`#f7f7f2`, matching `#lpn_canvas`'s own inline background).
       Verified by sampling actual rendered pixel colour through a zoomed screenshot (not just DOM
       structure) at the pipe's centerline through both symbols — solid backdrop colour, no pipe
       colour bleeding through, on both.
    2. **Sizing.** Read as "twice as large" next to text: junction was a diameter-3.2 circle,
       shrunk to `JUNCTION_R = 0.72` (was 1.6× symbolFactor — 0.45×, inside Tom's asked-for
       0.4-0.5× range). Reservoir was *also* a scaled-up copy of that same circle's square box
       (`2×nodeRadius(n)` on a side, so a tall/square tank) — Tom didn't want a uniform shrink here
       (would also narrow it), wanting instead what EPANET's own reservoir icon looks like: wide,
       not tall. Reservoir now has its own independent width/height
       (`RESERVOIR_HALF_W = 3.3, RESERVOIR_HALF_H = 1.1` — half-height is exactly his instruction,
       "shortening its height to 0.5 its current height" of 4.4; half-width is a widened starting
       value, not a specified factor, since that half of the ask was an experiment to try, not a
       number he gave). Needs `preserveAspectRatio="none"` on the nested `<svg>` so the icon
       actually stretches into that non-square box instead of a default "meet" letterboxing it.
       `nodeRadius(n)` — the one scalar every OTHER consumer (clear-run insets, label mask/leader,
       hit-testing, `staticObstacleBoxes()`, the zoom-extent `bbox()`) still reads — now returns the
       CIRCUMSCRIBING radius (half the longer side) for a reservoir rather than a true radius:
       generous rather than tight, so none of those consumers clips the wide/short tank on either
       axis. Pump's own size was confirmed correct as shipped ("literally the same size as text, as
       advertised") and deliberately left alone. All four numbers (`JUNCTION_R`,
       `RESERVOIR_HALF_W`, `RESERVOIR_HALF_H`, `pumpSymbolSize()`'s `4`) are one-line changes,
       explicitly experimental starting values per Tom's own framing ("since all is customizable,
       maybe we should try...") rather than settled numbers — revisit if he wants any of them
       nudged after looking at it live.
  - **Second follow-up, same day: the map/menu reservoir widths pull in opposite directions on ONE
    shared path, which needs a division, not two independent percentages.** Tom asked for both at
    once: the MAP reservoir "about 80% as wide as they are", and the MENU (toolbar) reservoir "as
    wide as you can make it... about 50% wider" — but the menu icon has no separate box-width knob
    the way the map does (`RESERVOIR_HALF_W`); its only lever is `lib/Icons.lib.php`'s own path
    coordinates, which is the SAME path data the map stretches via `preserveAspectRatio="none"`.
    Widened the shared path from x:6-18 (12 wide, margin 6) to x:3-21 (18 wide, margin 3 — this
    set's own established convention at this size, matching `file`/`image`/`zoom`), landing the
    menu icon at exactly 1.5x. Left alone, that widening would ALSO have widened the map's
    rendering by the same 1.5x. `RESERVOIR_HALF_W` was reset to `1.76` (not `3.3 x 0.8 = 2.64`) to
    back out the path's own 1.5x first — see the derivation comment beside the constant in
    `js/looped-network.js` — so the map lands at exactly 80% of its ORIGINAL (pre-either-change)
    width while the menu lands at exactly 150% of ITS original. Both verified in a headless
    browser: toolbar row screenshot shows the reservoir button visibly wider than its neighbours;
    zoomed map screenshot confirms the tank is narrower than before AND still fully occludes the
    pipe underneath it (the backdrop rect's own x/width were updated to match the widened path,
    same (3,4)-(21,20) box). Height, on both surfaces, was untouched by this — only x-coordinates
    changed, so `RESERVOIR_HALF_H` and the icon's y-coordinates are exactly as the first follow-up
    left them.
  - **Third follow-up, same day: menu confirmed, map still too wide — but no shared-path change
    this time.** Tom: menu icon "approximately square looks as expected... looks great"; map "still
    looks a bit too wide, but its side walls are good now" — i.e. the shared path's wall-to-box
    ratio (0.75, set in the second follow-up) is right, only the map's own box needed to shrink
    further, on top of that. Since `lib/Icons.lib.php` didn't change this time, no division was
    needed: `RESERVOIR_HALF_W = 1.76 x 0.8 = 1.408`, a plain 80% of the prior value. Verified in a
    headless browser at the same zoom level as the second follow-up's check — tank visibly
    narrower, side-wall proportions unchanged, pipe still fully occluded underneath it.

- 0|235| **[DONE 2026-08-09] The glossary's `pressure` and `elevation` entries no longer hold the
  UPSTREAM label form in any of the 26 languages.** Found during the Task 146.06 sprint,
  2026-08-08 — by a translation agent: the tr agent was handed `preferred_translation` = "Memba
  basıncı" (*upstream* pressure) for a generic node label, recognized it was wrong for the
  concept, and declined.
  - **What happened:** both entries were created in the Task 166 sprint by harvesting the attested
    label forms of `hw_pressure_up` and `hw_elev_up`. Those are *upstream-specific* labels. The
    entries' own `translation_notes` said so plainly ("ATTESTED LABEL FORMS of `hw_pressure_up`"),
    which is how the defect survived: it was documented as a feature.
  - **es, pt, fr, tr** were already corrected in the 146.06 sprint, from attested
    `lpn_result_pressure` / `lpn_field_elev`. **The other 22 languages**, corrected here, from
    `bpn_show_p` ('Pressure') / `bpn_show_elevation` ('Elevation') — both bare-concept keys
    already translated into all 26 languages, free of the upstream framing, verified against each
    language's own file before writing back. No sprint, no agents — direct per-language lookup.
  - `translation_notes` on both entries carry the 2026-08-09 correction record.
  - Spun off **Task 242**: check whether other glossary entries populated in the same Task 166 pass
    carry the same specific-label-as-concept scope error.

- 0|238| **[DONE 2026-08-08] "Map display and sizes" fixed at the source; "Restore defaults" audited
  in all 26 and given a glossary entry.** Two labels Tom read on the shipped page.
  - **`lpn_settings_map_display`: the ENGLISH was the defect, so the English was fixed.** Tom:
    *"the short name could be just Map Display... But in Spanish it is translated as 'Display of the
    map and sizes'."* He was right about the symptom and right about the cure. "Map display and
    sizes" is an ambiguous coordination — is it *[map display] and [sizes]* or *[map] [display and
    sizes]*? — and every language had to guess, leaving a dangling "y tamaños" / "e tamanhos".
    **The section holds text size, symbol size and opacity, backdrop opacity, map height and legend
    position — all of them display settings, so "and sizes" named a subset, not a second category,
    and dropping it loses nothing.** Now **"Map display"**, retranslated in all 4: es
    *Visualización del mapa*, pt *Exibição do mapa*, fr *Affichage de la carte*, tr *Harita
    görünümü*.
    - **Deliberately NOT given an `$ec_lang_intent` entry**, though Tom raised the option. Once the
      English is unambiguous the label is plain, directly-translatable technical English, and
      CLAUDE.md is explicit that adding an intent to a plain label is itself a defect — it burns
      translator attention on something no longer at risk. **Fixing the English fixed all 26
      languages at the source; an intent would only have described the ambiguity we removed.** This
      is the English-reform gate working as designed.
  - **`calc_defaults` ("Restore defaults"): audited across all 26.** Tom: *"default is a troublesome
    word... it should be easy to find standard renditions in any language. so I am hesitant to
    judge. I just want it to be right."*
    - **Method: cross-check each language against ITSELF**, not against outside judgement — every
      language ships this concept twice (`calc_defaults` and `calc_defaults_confirm`), so a language
      that contradicts itself has a defect provable from inside its own file. That is what makes
      this auditable without a native speaker for each of 26.
    - **3 real defects found and fixed, each self-evidenced:**
      1. **ro** — button was bare *"Resetează"* ("Reset"), concept dropped, while its own confirm
         string said *"valorile implicite"* correctly. Now *"Restabilește valorile implicite"*.
      2. **sw** — confirm said *"maadili ya kawaida"*. **`maadili` means morals/ethics**; the word
         this file uses for a numeric value in **19 other keys** is `thamani`, and the button
         already used the correct `chaguo-msingi`. Now *"thamani za awali za chaguo-msingi"*.
      3. **he** — *"לערכים ברירת המחדל"* required the construct state before a definite noun
         phrase. Now *"לערכי ברירת המחדל"*.
    - **3 languages deliberately left alone as lower-confidence** rather than guessed at: **am**
      (ነባሪ vs ነባር across the two keys), **my** (ပုံမှန် = normal/regular, may or may not be the
      settled Burmese software term), **id** (*"Pulihkan Default"* — the loanword is genuinely
      standard in Indonesian UI, but the Title-Cased *Default* mid-phrase is odd). Two are 0.65-tier
      languages where our own confidence is lowest by design. **Recorded, not silently "fixed".**
  - **New glossary concept `default (setting)`** (version 1.25 → 1.26) with all 26 attested forms
    and a 5-item `avoid` array. The dangerous senses are named explicitly — **financial** (defaulting
    on a debt, the dominant everyday sense in many languages), legal, sports-forfeit — plus the two
    real failure shapes this audit found: *dropping the concept* (ro) and *substituting a
    normal/usual word* (sw). Per the defer-to-cultural-standard principle the entry records that
    bn/hi/id/ps legitimately use the English loanword: it IS the local software standard there, and
    that is correct rather than a transliteration defect.
  - **Wired into `prefixToTermNames()`: `lpn`, `bpn`, and a new `calc` entry** — suite chrome had no
    entry at all and was silently falling back to the default three terms, so the button that owns
    this concept could never have received its own guard. Verified by resolution (calc 4/4, lpn
    35/35, bpn 28/28) and by reading the generated `DO NOT render as:` line.

- 0|237| **[DONE 2026-08-08] "Zoom to fit" shipped meaning "adjust the zoom" in 2 of 4 languages.**
  Caught by Tom reading the shipped Spanish: *"Zoom to fit in Spanish is ajustar zoom. I could be
  wrong, but I think that's wrong."* He was right, and it had spread further than the one example.
  - **The review he asked for, complete.** `lpn_tool_zoom_extent` is a `lpn_` body string, so only
    es/pt/fr/tr carry it — a 4-language review, not 27. es *Ajustar zoom* ("adjust zoom") and pt
    *Zoom para ajustar* ("zoom to adjust") were both wrong; fr *Zoom sur l'étendue* and tr *Tümünü
    göster* ("show all") were both correct. Fixed to **es *Ver todo*, pt *Ver tudo***.
  - **Why it happened, and why the English is deliberately NOT reformed.** The lure is the word
    "fit": it invites a fitting/adjusting verb while saying nothing about *what* is fitted, so a
    translator with no other context lands on "adjust" and produces a label describing the zoom
    slider rather than the button. The English-reform gate was considered and declined — "Zoom to
    fit" is an established UI idiom (browsers, PDF viewers, design tools all ship it) and renaming a
    recognized control costs more than guarding it. The guard is the glossary entry, not a rename.
  - **New glossary concept `zoom to extents`** (version 1.24 → 1.25) with a 4-item `avoid` array
    that names this exact failure, plus the attested forms for all four languages. **Two registers
    are both correct and both are recorded**: CAD-faithful (fr, matching AutoCAD's own
    *Zoom Étendu*/*Zoom Extensión*) and plain (tr *show all*). Tom chose plain for es/pt, so 3 of 4
    now share the show-everything model. An adjust-the-zoom reading is what the entry forbids.
  - **Wired into `prefixToTermNames()` in the same commit** — verified by resolving the `lpn` map
    against the live glossary (34 of 34 names resolve, the new term among them) and reading the
    generated `DO NOT render as:` line. **This is the step that Task 146.06 found had never been
    done for `lpn` at all**; a glossary entry that is not in that map reaches no agent, so adding
    the entry without the map line would have been the same defect in miniature.

- 0|236| **[DONE 2026-08-08] The last preview-era sentence is gone — Tom said delete.**
  `lpn_notes_3_def` ended *"Because this is an early preview, please use it for small networks and
  for testing only."* The 2026-08-08 PREVIEW removal took the 3 identity keys and the banner but
  missed this one, and the Task 146.06 sprint had just translated it into es, pt, fr and tr.
  - **Raised as a question rather than fixed inside the sprint**, because the sentence tangled a
    dead preview framing with a live scale caution, and dropping a caution nobody decided to drop
    is not a translation sprint's call. Tom's answer was "delete" — the size guidance goes with it.
  - **Deleted from all 5 files that carry it** (en + es/pt/fr/tr; no other language has `lpn_` body
    strings), drift manifest re-baselined, payloads FRESH, `equal_to_english` still 0 suite-wide,
    and the page re-rendered in es and fr to confirm no preview wording survives anywhere.
  - **`lpn_` now carries no preview language in any of the 27 lang files.** Four stale mentions
    remain in `js/looped-network.js` (lines 2078, 3225, 5602, 6164) but they are **code comments
    only** — never rendered. One of them (5602) explains a button's existence as a
    preview-era convenience, so it is worth a read next time that code is touched; it is not worth
    a commit of its own.

- 0|146.06| **[DONE 2026-08-08] Translation sprint for `lpn_` strings (Task 146 child).**
  `lpn_` is now translated into es, pt, fr and tr — **223 keys × 4 languages**, 4 Sonnet agents,
  plus 10 non-`lpn_` stragglers the payloads swept up. Sized by the coverage declaration (Tasks
  203/204): `lpn_` is not a core calculator, so it gets the core languages, and its 3 identity
  strings were already translated in all 26. **Suite-wide `equal_to_english` is now 0.**
  - **A pre-sprint check caught the sprint's biggest risk before a single agent was spawned.**
    `prefixToTermNames()` in `generate_translation_payloads.php` had no `lpn` entry (nor `bpn`), so
    both fell back to the three default terms and **every network concept seeded in Task 193 —
    `node`, `link`, `vertex`, `junction`, `reservoir`, `scenario`, `project`, `draw`, `background
    image`, `demand`, `pump curve`, `pressure rating`, each with a hand-written `avoid` array — was
    invisible to translation agents.** That seeding was the whole point of 193's glossary work.
    Fixed in `7c86785`; payloads went from 3 injected terms to 33. **The lesson generalizes: a new
    calculator prefix needs a `prefixToTermNames()` entry, or its glossary work silently never
    ships.** Nothing warns you — the generator just uses the default three.
  - **The trap terms held.** Every language avoided its hyperlink word for `link` (es *enlace*,
    fr *lien*, tr *bağlantı*), the draw-water sense of `draw`, and the computing sense of `node`.
    The paired **Reservoir/Tanks** trap — English uses the first for the node type and the second,
    in `lpn_notes_2_def`, for what `lpn_` deliberately does NOT model — was kept distinct in all
    four unprompted: es *embalse*/*depósitos*, pt *reservatório*/*tanques*, fr *réservoir*/
    *réservoirs à niveau variable*.
  - **Where the languages diverge, they diverge for a reason, and it is recorded.** es splits
    *nodo* (generic node) from *nudo* (the junction subtype), matching EPANET-Spanish; tr does
    **not** split, because Turkish water-engineering practice uses *düğüm* for both and
    disambiguates by context. The tr agent explicitly declined to coin an artificial distinction.
    Both decisions are now in `glossary.json` rather than waiting to be re-derived next sprint.
  - **Glossary write-back done before close, as required.** The 12 concepts 193 seeded empty now
    carry es/pt/fr/tr values and dated notes. Glossary version 1.23 → 1.24.
  - **Three defects the sprint exposed, all fixed in `19355f2`:**
    1. **`lpn_notes_4_def` promised "Other languages: this page is in English only for now"** — a
       sentence this very sprint makes false, and which rendered as *"por ahora esta página está
       solo en inglés"* on a fully Spanish page. Removed from en and all four; drift manifest
       re-baselined. **A sprint must re-read the page's own prose for claims the sprint invalidates
       — the translation agents will faithfully translate a lie.**
    2. **The glossary's `pressure` and `elevation` entries stored the UPSTREAM label form as the
       bare concept**, in all 26 languages — `Pression amont`, `Memba basıncı`, `Presión aguas
       arriba`. The entries' own notes admitted they were "ATTESTED LABEL FORMS of `hw_pressure_up`".
       Any agent following `preferred_translation` literally puts "upstream" on a generic node
       label. **The tr agent caught this itself and declined to apply it.** Fixed for the four
       sprint languages; the other 22 are **Task 235**.
    3. **tr rendered `lpn_field_id` as "Kimlik" while its own `bpn_id` stayed "ID"** — same concept,
       same suite, two spellings. Aligned to the incumbent per the label-reuse convention.
  - **QUALITY scores unchanged at 0.85** for all four, which is the honest tier: AI-translated,
    back-translation-checked, consistency-checked, never confirmed by a native human. 0.95 needs a
    review on file and there is none.
  - **`lpn_` is now clear to deploy** as far as this task is concerned — the hold recorded when
    PREVIEW came off ahead of the sprint is released. See **Task 236** for the one leftover
    preview-era sentence that is Tom's call, not a blocker.

- 0|230| **[DONE 2026-08-08] The open-channel velocity verdict stopped citing water hammer.**
  `Manning-Trap.php` and `Manning-Irregular.php` fed the channel high-velocity verdict from
  `$ec_lang['mhp_vel_high']` — there was no `mtc_vel_high` — so a trapezoidal channel was told to
  check transition losses and water hammer. A real `mtc_vel_high` now exists and both pages read it,
  translated into all 26 languages the same day. Parity delta 0.
  **Translated inline by the orchestrating model, not by a 26-agent sprint** — 26 paid agents for
  one string is the wrong shape. Each language was anchored on vocabulary already shipped in its
  own file (`mtc_note_2_def` for expansions/bends/obstructions, `rc_yn` for erosion,
  `mi_notes_2_term`/`rc_main_desc` for lining); all 78 term probes matched. Glossary write-back:
  new `channel lining` and `erosion` entries, glossary 1.22 → 1.23.
  **Side effect worth knowing:** the mandatory `detect_english_drift.php --update` re-baselined 232
  keys, of which 227 are `lpn_` — a pre-existing unbaselined backlog from the English-only preview,
  not this task's doing. Harmless (parity and coverage still report them), but it means the drift
  manifest now treats those lpn_ strings as synced.

- 0|232| **[DONE 2026-08-08] `Irrigation.php` removed — the page and its 17 keys are gone.**
  Tom called the menu entry "harmful and spammy" (it was the only non-calculator under Hydraulics,
  labelled the bare word "Irrigation", fronting a card index that pointed back at the dropdown
  containing it). The entry went 2026-08-08; the page stayed pending the one number nobody had.
  **That number arrived the same day and settled it: reach 1,977, confirmed humans 0, used 0.**
  Pure crawler traffic — the usage log's own reading of "high reach + ~0% human" — so there was no
  audience to strand. Deleted: the page, its `sw.js` precache line, and all 17 `irr_` keys across
  27 lang files (476 lines), which also retired `irr` from the translation payloads' active
  prefixes. `generate_sitemap.php` globs `*.php`, so the sitemap dropped it on regeneration;
  `glossary_compliance_audit.php` had hardcoded `irr_` keys as its 'weir' and 'conveyance
  efficiency' samples and now uses `ws_`/`wi_`/`cs_` instead.
  **`../sitemap.xml` is regenerated but NOT tracked by git** — it must be re-uploaded to the site
  root when this deploys, or the dead URL stays advertised.

- 0|231| **[DONE 2026-08-08] Toolbar: icon as a small prefix to the text, never icon-only.** Added
  `↺` Restore defaults, `📏` Set units, `🖨` Printable (`lib/Calculators.lib.php`) and `🔗` Copy link
  with a matching `✓ Copied!` confirm state (`lib/Menus.lib.php`), following the existing
  `⬇ Install` / `🌐 English` house style. Glyphs live in the markup, never in `$ec_lang` — a glyph
  baked into a translated value is 27 copies of one decision. No new language keys.
  **Extended to `lpn_` the same day** (Tom: what he actually meant by the request). One `ICON` map
  in `js/looped-network.js` feeds the menu bar, every dropdown row, the toolbar and the backdrop
  select — 31 glyphs, no duplicates, none unused. Menu rows get a *reserved* icon column
  (`.lpn-menu-icon`) rather than an inline prefix, so a row with no natural glyph still aligns;
  confirm-dialog rows (Cancel / Break their lock / Close without saving) deliberately take no icon,
  since they are sentences rather than commands. The five drawing tools map the map — square
  reservoir, circle junction, line pipe — so the icon teaches the canvas notation instead of
  decorating it.
  **Icon-only was rejected on the merits:** it saves no translation work (the label text stays
  either way) and spends first-time comprehension, which is the entire audience a web calculator
  exists for. **The pop-up A/B preference poll was rejected too** — it breaks Task 207's "nothing
  that must be dismissed to proceed" boundary; a "which screenshot do you prefer?" poll measures
  stated preference about chrome, where stated and revealed reliably diverge; and ~4,042
  confirmed humans per period leaves a two-arm split under-powered anywhere but Manning-Pipe-Flow.
  Test chrome variants behaviorally against the `used`-of-`human` band (Task 202) instead.

- 0|146.02| **[DONE 2026-08-08] EPANET-style icon toolbar — shipped as Task 231; map symbols
  extracted to 146.10.** The toolbar half is done: one SVG icon set in `lib/Icons.lib.php`, applied
  to the lpn menu bar, dropdowns and toolbar and to shared site chrome. The map-symbol half was
  re-scoped separately as **146.10** and is still open.
  **This task's gate on 146.06 is RELEASED.** It gated the sprint for churn reasons only — the fear
  being that icon-only buttons would turn visible noun labels into `title`/`aria-label` phrases,
  adding and rewriting strings the sprint would then pay for twice. Task 231 chose icon-as-**prefix**
  instead, so every label kept its word and **zero language keys were added, renamed or removed**.
  There is therefore nothing for the promised "193-style re-read" to read. 146.10 adds no strings
  either (it is geometry), so it does not re-gate the sprint.

- 0|205| **[DONE 2026-08-08] One "contact me" line per page, not two — English shipped 2026-08-03, the
  26-language resync (d) completed 2026-08-08.** Raised by Tom,
  2026-08-03, on noticing that `Manning-Pipe-Flow.php` and `Looped-Network.php` showed different
  invitation text. They are not one line with two wordings; they are two separate lines, both
  linking to `contact.php`:
  `echoHelpWanted()`/`template_translation_help` ("Can you suggest better wording…") above the form
  on 18 pages, and `echoFeedback()`/`template_feedback` ("Please send suggestions or praise…") below
  the form on every page. `Looped-Network.php` is the only calculator page that omits the first.
  **They converged in commit `5b3ee95`**, which expanded `template_feedback` to cover suggestions,
  roadmap advising, testing, contributing, and mentorship — swallowing the other line's whole
  purpose. Two collapsible links to the same destination on one page do not double the invitation;
  they halve the weight of each. Four changes; (a)-(c) are DONE in English, (d) is the open debt:
  (a) **DONE 2026-08-03. Deleted `template_translation_help` and every `echoHelpWanted()` call**
  (18 pages); function retired from `lib/Calculators.lib.php`. The key was removed from all 27 lang
  files, so this *removed* 26 translated strings rather than adding any. `lang_parity_check.php`
  reports `extra: 0`, confirming no orphans left behind.
  (b) **DONE 2026-08-03. Folded the wording ask into the surviving line.** Kept because asking a reader whether the wording
  is wrong *in their own language* is the one report only they can file, and per the standing rule
  native review is real only when feedback actually lands — a generic "connect with the project"
  pitch will not prompt a Khmer reader to report a bad label. Final English, settled with Tom
  2026-08-03: `Can you suggest better wording or anything else? Do you want to help or to learn to
  create tools like these? Please contact me.` The roadmap/testing/mentorship prose that `5b3ee95`
  added comes **out** of the page string and goes onto `contact.php`, which is one click away and
  can be as long as it likes. A calculator page's job is to invite; the landing page's job is to
  explain.
  (b2) **DONE 2026-08-03. Removed the `[Hide this line]` toggle from the invitation** (Tom: "Nothing,
  and force a 'Printable version' button click for a screenshot"). A dismiss affordance is the visual
  grammar of a cookie banner, and readers have trained themselves for decades to skip anything
  wearing it — it did not merely permit ignoring the line, it *marked* it as chrome. It was also
  doing no real work: the collapse state has no cookie or storage behind it, so a hidden line
  reappeared on the next page load. `d-print-none` stays and the Printable version button
  (`btn-printable`, in `lib/Calculators.lib.php`) covers the real "I want a clean page" need. An
  `[X]` was considered and rejected — a smaller costume, the same costume. Other collapsible lines
  (`relatedCalcs`, the units row) keep their toggles; those genuinely are chrome.
  (c) **DONE 2026-08-03. Placed the surviving line before the Notes heading on every page, and
  before the sketch on the 9 pages that have one.** Not above the calculator: that is *before the
  reader has been given anything*, when they still want something from us. After the results, the
  ask lands on someone already served — give first, then invite. The top of the page is also already
  occupied by `template_welcome` ("Drop your fears at the door; love is spoken here"), which asks for
  nothing at all; that division is deliberate and should hold. `Looped-Network` is excluded from the
  above-sketch move — its map *is* the calculator, not an illustration of the answer. It was
  before on 6
  (`Looped-Network`, `Branched-Network`, `Irrigation-Pressure`, `Manning-Irregular`,
  `Weir-Flow-Irregular`, `Weir-Flow-Simple`) and after on 10 (`Canal-Seepage`, `Darcy-Weisbach`,
  `Hazen-Williams`, `Manning-Pipe-Flow`, `Manning-Pipe-Head-Loss`, `Manning-Trap`,
  `Micro-Hydro-Power`, `Orifice`, `Orifice-Drain-Time`, `Rock-Chute`). Before-notes is not the
  symmetry argument — Notes are reference prose the reader dips into, sometimes a full paragraph
  (`lpn_notes_5_def`), so an after-notes line lands at the true bottom of the page where nobody is.
  Immediately after the results is where the reader has what they came for and is most able to say
  something useful. It also makes `lpn_notes_4_def`'s "(see the feedback link above)" true by
  design rather than by accident.
  (d) **Resync `template_feedback` into all 26 languages — DONE 2026-08-08, see the record below.** Every
  non-English file currently shows the *pre-`5b3ee95`* short wording ("Please send suggestions or
  praise. Was this free calculator useful?"), which is now two generations behind the English. The
  debt was already owed before this task — `5b3ee95` rewrote the English and no translation followed
  — so merging first paid one sprint instead of two.
  **The debt is tracked, not remembered:** `detect_english_drift.php` flags `template_feedback` under
  CHANGED, and `--update` was deliberately NOT run, because re-baselining the manifest is exactly
  what would erase the signal. Do not run `--update` until all 26 languages are actually resynced.
  The same run reports `template_translation_help` under REMOVED, which is correct and needs no
  action.
  This was one key × 26 languages. The plan of record had been to fold it into the next sprint
  touching these files (`lpn_`'s Task 146.06) rather than stand up 26 agents for a single string;
  in the event Tom authorized it on its own on 2026-08-08, because Task 206 had just made the
  contact funnel measurable and this is the exact string that funnel measures — a baseline taken
  against a stale, off-voice ask in 26 languages would have been worth little.
  **First person is deliberate.** "me", not "us" — Tom, 2026-08-03: "scrupulously honest and
  unpretentious. When the time is right, it can become 'us'." An audit of `lang.ec.en.php` found
  only one other shipped first-person-plural string, `ip_q_ratio`'s tooltip ("different than **our**
  approximation of the standard uniformity measure"); `about_body_html` is already consistently
  singular. **`ip_q_ratio` stays as-is — decided, not deferred** (Tom, 2026-08-03): its "our" is the
  *inclusive* first person, "the user and I" working the same calculation together, which is a
  different pronoun from the institutional "we" that "contact me" avoids. Do not "fix" it.
  **(d) DONE 2026-08-08 — resynced in all 26 languages.** Run as two batches: 15 languages, then a
  session limit, then the remaining 11 (am bn fa he km my ps ro sr sw ur). One key, 26 agents,
  Sonnet throughout.
  - **The defect was worse than staleness.** Nearly every file said *send **us*** — `Envíenos`,
    `Envoyez-nous`, `Pošlete nám`, `Inviateci`, `senden Sie uns`, `Пошаљите нам`, `tutumie`,
    `ይላኩልን` — the institutional first person this task had deliberately rejected in English. A
    per-language scan for surviving first-person-plural author forms now returns **zero**.
  - **Reader-address plurality was left alone on purpose.** Several RTL and South Asian files (ar,
    he, ur, ps, fa) address the reader in the plural while making the author singular. That matches
    how those files already speak to readers; it was the *author's* number that was wrong. Do not
    "fix" the address forms later — this was checked, not missed.
  - **Pashto was not merely stale**, it was answering a question the English stopped asking two
    generations ago: the old value asked about ratings and usefulness.
  - **Verified rather than trusted, and it mattered.** In batch one, 15 files changed on disk while
    only 13 agents reported success — **`cs` and `hr` landed their edits and then reported
    failure.** Relaunching on the strength of the status line would have redone correct work. Every
    value was then checked directly: one-line diffs, `php -l`, no HTML entities or tags,
    single-quoted one-liners, validator clean, and rendered in a live page across Latin, Cyrillic,
    Hebrew, Arabic-script RTL and Khmer.
  - **The drift flag was cleared for this key only**, via the Task 229 partial re-baseline, so
    `mhp_vel_high` stays flagged. Running a full `--update` here would have silently baselined away
    the one real drift left.

- 0|229| **[DONE 2026-08-08] The drift tripwire can now tell "no translator needed" from "nothing
  changed" — `detect_english_drift.php --update=<key>`.** Fallout from Task 227, and caught the same
  day it was created: fixing the dead engineeringtoolbox URL inside `or_notes_3_def` flagged that
  key as CHANGED exactly like a rewritten sentence would. A hash cannot see *why* a string moved.
  Left alone, the next resync sprint would have sent 26 agents to re-translate a note whose prose
  never changed.
  - **The wrong fix would have been to just re-baseline it.** A URL-only edit still has to reach all
    27 files — the `href` lives inside each language's own string, which is why the fix was a `sed`
    across `lang.ec.*.php` and not a one-line English edit. So the tool refuses to silence a key
    until **every language file already carries the same URLs as English**, naming the stragglers
    when it won't. "No translator needed" and "nothing left to do" are different claims; only the
    first one is being made.
  - **It refuses three ways**, each verified: a key that is not currently CHANGED (a typo, or a
    command already run), a key that does not exist in English, and a key where any language is
    still on the old link. Mutation-tested by reverting `km` and `ur` to the old URL — refused,
    named both, exit 2; restored — accepted.
  - **The reason travels with the manifest.** A `partial_updates` record (date, keys, reason) is
    written into `english_string_hashes.json` and survives a later full `--update`, because a key
    sitting un-flagged with no explanation is indistinguishable from a bug in the tripwire six
    months on. Omitting `--reason` still works but says so.
  - **One defect found in this feature's own first run and fixed:** a partial re-baseline was
    stamping today's date onto the manifest's `updated` field, so the report announced "last synced:
    2026-08-08" over 500 keys nobody had looked at. The last-FULL-sync date is now carried through.
  - **Result:** `or_notes_3_def` re-baselined with its reason on the record; the tripwire now flags
    exactly two keys, both genuine — `template_feedback` (Task 205(d), two generations behind in all
    26 languages and still using the institutional "us" the English deliberately dropped) and
    `mhp_vel_high` (English gained "and may not be realistic"; the translations are the older,
    shorter wording). Neither was silenced. `template_feedback` was then actually resynced later the
    same day and re-baselined through this same partial path, leaving `mhp_vel_high` as the single
    outstanding drift.

- 0|215| **[DONE 2026-08-08] The Title/Subtitle milestone is logged — the closest instrument this
  suite can build to its own mission.** Asked for by Tom, 2026-08-05: *"How many people are adding
  Title and Subtitle? This is a major milestone that indicates they are sharing the calculation in a
  report or message."* Nothing saw it before. A page view says someone looked, a calc event says
  they got an answer; a typed title says they mean to put the result in front of another human,
  which is the one behavior this suite exists to produce.
  - **Its own one-shot beacon, not a flag on the calc event** — the design correction that was
    already recorded here, and it held up: `maybeLogCalcUsage()` dedupes per page load and a title
    is nearly always typed *after* the first calculation, so a flag there would have read zero
    almost every time. `EngCalcs.maybeLogTitleEvent()` → `log-title-event.php` → `TITLE_LOG`
    (`log/engcalcs-title.log`), honouring `ecLoggingOptedOut()` (Task 210) like every other writer.
  - **Both fields, recorded separately.** A title labels a scratch calculation; a subtitle as well
    means someone is building a document. The fifth log column is a closed vocabulary
    (`title`/`subtitle`) — anything else is a 400 rather than a quietly widened log.
  - **The typed text is never sent and never stored.** What the calculation is *called* is the
    user's business; that they named one is ours. The harness asserts this as a standing property,
    because a regression here is a privacy defect rather than a metrics one.
  - **Bound in JS on the `change` event, not in the inputs' `onchange` attributes.** Two
    consequences that are the whole reason for the choice: a value restored programmatically from a
    cookie or a shared URL fires nothing at all (restoring a saved title is not a person deciding to
    name something, and `input` would have counted every returning visitor), and it works on any
    page carrying those ids, including the JS-built ones.
  - **No 10s dwell gate**, unlike the other two beacons. Those gate on time because a bot can trip a
    page load or a calculation; typing into a text field is already the human proof that timer is a
    proxy for.
  - **Verified without a browser pass**, per the standing preference: `dev/lpn-spike/
    title-beacon-harness.js` drives the real `js/Calculators.lib.js` against a DOM stub over **both**
    transports (`fetch` and the `sendBeacon` fallback — a beacon that works on only one silently
    under-reports on the other). Mutation-tested three ways: removing the empty-value guard,
    removing the dedupe, and leaking the typed text each make it fail. Endpoint tested directly for
    dedupe, the 400s, and the opt-out; the report section against populated and empty fixtures.
    - **One trap worth keeping for the next harness:** Node 21+ ships a **read-only** built-in
      `navigator`, so `global.navigator = {...}` is silently ignored and every beacon vanishes into
      a stub that was never installed — which reads exactly like the feature being broken.
      `Object.defineProperty` is required. Cost an hour before the harness was believable.
  - **Reported by `log/lang-log-stats.sh`**: titles, subtitles, a named-per-confirmed-calculation
    ratio by page (both counts deduped per session+page, so they are the same kind of number), and
    breakdowns by page and language — carrying the same under-40-is-noise caution as the rest of the
    report.

- 0|227| **[DONE 2026-08-08] `prod_smoke.php --links` now follows the links our pages emit, not just
  that the pages answer.** Written the same day as Task 226, whose six-week 404 nothing in the repo
  could have noticed: this script proved every *page* returned 200 while saying nothing about
  whether the links *on* those pages went anywhere.
  - **Two sources, because pages alone are not enough.** It resolves every `href` from a sample of
    served pages, AND statically from all 27 `lib/lang.ec.*.php` files. Only one language renders
    per request, so a link broken in exactly one language file is invisible to any amount of page
    fetching; reading them off disk covers all 27 at once. 201 distinct on-site links from five
    pages plus the lang files. A failure names its source (`lang.ec.en.php:zz_key`, or the page).
  - **Off-site links are advisory and never touch the exit code.** A reference site rate-limiting a
    script is not our deploy being broken, and a gate that fails for reasons outside the repo is a
    gate everyone learns to ignore. `--external` opts into checking them.
  - **It refuses to run against a host that answers 200 for everything.** `php -S` falls back to the
    docroot's `index.php` for any missing path, so a link check against the built-in server returns
    a cheerful all-clear no matter how broken the links are — worse than not running, because it is
    a green light that means nothing. Found the honest way: the mutation test for this feature
    passed against localhost with the Task 226 404 reintroduced and sitting right there in the page.
    It now probes a URL that cannot exist first, and skips with an explanation if that answers 200.
    **Run `--links` against production.**
  - **Verified by mutation, not by inspection:** a dead link injected into `lang.ec.en.php` produced
    `FAIL … 404`, named `lang.ec.en.php:zz_mutation_test`, and exited 1; removing it returned the
    run to all-clear. The resolver has its own case table — `../`, `./`, root-relative,
    scheme-relative, `?query`-only, ports, climbing past the root, and the `mailto:`/`javascript:`/
    `#fragment` forms it must ignore.
  - **It found two real defects on its first production run, which is the argument for it:**
    - **Nine links per page were downgrading to `http://`.** `echoMainMenu()` built every
      root-relative menu item as `'http://' . $_SERVER['SERVER_NAME'] . $path`. Wrong three ways:
      an https visitor got nine 301 round trips and a moment of plaintext on a site with no HSTS;
      the host came from a client-supplied header, the very thing `config.inc.php` refuses to do for
      `CANONICAL_ORIGIN`; and it emitted an undefined-index warning wherever `SERVER_NAME` is absent
      (CLI). The paths were already root-relative — they are now emitted as-is. Fixed.
    - **A dead reference link on the Orifice calculator, in all 27 languages.** `or_notes_3_def`
      pointed at `engineeringtoolbox.com/orifice-nozzle-**venture**-d_590.html`; the real page is
      `**venturi**`. A one-letter typo, 404 for as long as it has existed, in every language at
      once. Fixed in all 27 files (one line each, `lang_syntax_validate.php` clean).
  - **What it still does not do**, recorded so nobody assumes otherwise: it checks a sample of five
    pages, not all 24; it does not render JS, so links built at runtime by `js/looped-network.js`
    are outside it; and the page-emitted path is exercised against production, which serves its own
    deployed code rather than the working tree, so only the lang-file path can be mutation-tested
    locally end to end.

- 0|226| **[DONE 2026-08-08] The Feedback invitation on every calculator page had been a 404 for six
  weeks.** Found by Tom on the live site the day after Task 206 shipped: the in-page invitation
  linked to `../contact.php`, which from `/engcalcs/` resolves to `hawsedc.com/contact.php` —
  confirmed 404 in production, while the menu's Contact item (200) worked fine.
  - **Cause, and it is the ordinary one:** commit `b625286` (2026-06-26) moved the contact system
    from the parent site *into* `engcalcs/` and repointed both links in `lib/Menus.lib.php` — but
    not the third referrer, `echoFeedback()` in `lib/Calculators.lib.php`. Before that day
    `../contact.php` was correct, because the parent site really did have one. The destination
    moved; two of its three referrers came along.
  - **Fixed** to `/engcalcs/contact.php` — root-relative, the same form `Menus.lib.php:44` already
    used. `../` is the wrong shape even when it happens to work: the file is included by pages that
    could sit at any depth, and the site answers on all four of http/https × www/non-www with no
    redirect.
  - **Bounds on the damage, stated honestly.** This broke 2026-06-26 and was fixed 2026-08-08 — six
    weeks, on the suite's most prominent invitation. Tom's drought predates it ("none at all in
    recent months"), so this is a real cause of the most recent stretch and **not** an explanation
    of the whole silence. Resist reading it as case closed.
  - **It nearly poisoned Task 206's first reading.** The funnel instrument shipped 2026-08-07 with
    the link still broken: clicks would have logged normally, sends would have sat at zero, and the
    honest-looking conclusion — "the invitation works, the form is the barrier" — would have been
    exactly wrong. **Any funnel number that includes 2026-08-07 is contaminated; the clean baseline
    starts 2026-08-08.**
  - **The lesson worth keeping:** a link's failure mode here is silent on both ends. The visitor
    sees a 404 and does not write to report that they could not write, and the site owner sees
    nothing at all. `dev/scripts/prod_smoke.php` checks that every *page* answers 200 but has never
    followed the links those pages *emit* — which is why six weeks passed. A one-command live link
    check of every emitted `href` is Task 227 — written and shipped the same day, and it found two
    more defects on its first production run.

- 0|206| **[DONE 2026-08-07] Measured the contact funnel — the one metric the mission cares about,
  and we were blind on it.** Raised by Tom, 2026-08-03: contacts "have always been rare and
  gratifying. None at all in recent months." Nothing logged `contact.php` views or `formmail.php`
  submissions, so the two possible causes were indistinguishable, and they call for **opposite**
  fixes: nobody clicks the invitation (wording/placement is the lever) versus people click but do
  not send (the form is the barrier, and further tinkering with placement is wasted motion). Two
  numbers now answer it. What shipped:
  - **The view half was 90% built and silently doing nothing, exactly as the build plan predicted.**
    `maybeLogHumanView()` fires on every page that loads `js/Calculators.lib.js`, `contact.php`
    included — but it posts `EngCalcs.cookieName`, which only `echoCookieScript()` assigns, and a
    page with no calculator form never calls it. So it posted an empty page name and
    `log-human-view.php` answered 400. Verified both ways against a live server before and after:
    `page=contact` → 204 and a log row, `page=` → 400. New `echoPageNameScript()`
    (`lib/Calculators.lib.php`) emits the page name and `sessionAgeMs`; `contact.php` calls it after
    `echoHeader()`. No new endpoint, no new log, no beacon changes.
    - It also emits `sessionAgeMs` for a reason worth keeping: without it the beacon assumes a
      brand-new session and waits the full 10s, so a visitor arriving from a calculator page — the
      arrival path that matters most for this funnel — would have had to dwell another 10s to count.
  - **The send half is logged SERVER-SIDE** in `formmail.php`'s `mail()` success branch
    (`ecLogContactSend()` → `CONTACT_SEND_LOG`, `log/engcalcs-contact-send.log`). **Rejected
    alternative, recorded so it is not re-litigated:** a beacon fired from the submit handler races
    the navigation AND cannot know whether the send succeeded — it would count attempts, and
    attempts are exactly what we already could not tell apart from successes. `formmail.php` knows
    the truth and is already on the page.
  - **Honours the Task 210 opt-out**, like the other three writers, and more cheaply than a beacon
    could since `ecLoggingOptedOut()` is right there. **Same four-column line format** as the other
    logs, with page fixed at `contact` so send rows divide cleanly by the view rows — verified by
    exercising the real function against the real config: opted-out wrote nothing, a junk
    `ec_language` cookie was sanitized with no tab or newline injection.
  - **Only two questions asked.** No referrer, no message length, no subject. Those would be the
    third question that turns a two-number instrument into a project nobody finishes, and none of
    them answer "is the form the barrier?".
  - **Reported by `log/lang-log-stats.sh`** in a new "Contact funnel" section: clicks, sends, and
    sent-per-click, with the percentage suppressed when there are no clicks. It prints on the
    no-usage-log path too, and the new log gets a coverage-footer row. Verified against fixtures for
    the populated, no-sends, and no-view-log cases.
    - The section says in place that the ratio is only readable once **both** counts leave single
      digits — with a handful of contacts a year, one message either way moves it enormously.
  - **The baseline starts 2026-08-08, not 2026-08-07 — see Task 226.** The day after this shipped,
    Tom found that the in-page Feedback invitation had been linking to a 404 since 2026-06-26. Had
    that gone unnoticed, this instrument's first reading would have shown clicks with zero sends and
    pointed confidently at the wrong culprit ("the form is the barrier"). Discard any funnel figure
    covering 2026-08-07. It is also a fair verdict on the instrument: it took one day to turn a
    six-week silent failure into a visible question.
  - **Why it was urgent:** two confounders had just landed and were otherwise going to be
    uninterpretable — Tom removed the form's anti-spam test (a classic conversion killer, especially
    on mobile and for non-English users), and Task 205 changed the invitation's wording, placement
    and dismiss affordance suite-wide on 2026-08-03. Both are now measurable going forward, though
    neither can be credited retroactively: the instrument starts at zero on 2026-08-07.
  - Context, fixed along the way on 2026-08-03: `formmail.php:90` carried a bare `<?` short open tag
    — the only one in the repo. It parses only where `short_open_tag=On`, which production evidently
    still is, but any PHP upgrade or host move would have silently killed the contact form, and with
    zero logging the symptom would have been indistinguishable from ordinary silence. That near-miss
    is itself the argument for this task: a broken contact path is invisible precisely because its
    failure mode looks exactly like nobody writing.

- 0|223| **[DONE 2026-08-06] Fixed the defects from the 2026-08-05 and 2026-08-06 `lpn_` browser passes.** Triaged list with root
  causes: `dev/lpn-file-lock-test-punchlist.md` § Findings.
  - **P0 already fixed, awaiting browser retest:** Save as… would overwrite a file another profile
    had open. The guard only ran when *your own* tab was read-only and compared against your own
    previous handle instead of the file chosen in the picker; identity is the `docId` inside the
    target file, never its name.
  - **P1 FIXED 2026-08-05, all three, awaiting browser retest.** The intermittent lock was not the
    TTL sweep: `visibilitychange -> hidden` fires on an ordinary **tab switch**, and released every
    lock one-way with nothing taking them back — so a colleague who glanced at their email came back
    holding nothing, silently. Locks are now remembered on `hidden` and re-acquired on `visible`.
    The needs-reopen banner could never appear because `syncReadOnlyToOpenProject()` ran from
    `openProject()`/`newProject()` but not from boot — a page load being the only case it exists
    for. Read-only now allows every edit and enforces itself in exactly two places:
    `writeOpenProjectToFile()` refuses, and Save is disabled (it does **not** become Save as).
  - **Also fixed 2026-08-05, reported separately by Tom:** new projects reused a taken number once
    the first was saved (saving renames a project after its file, and `safeFileName()` collapses the
    space, so the exact-template scan stopped recognising it); and the dialog claimed
    `aria-modal="true"` with no backdrop, so tabs and the map stayed clickable underneath a question
    about the project you could switch away from.
  - **The lock design was reworked, not patched** (Tom: *"If minimizing loses the lock, then the lock
    is useless"*). A claim now survives minimise, reload and reboot, and ends only at Close. What
    makes that safe is a **write-time freshness check** — `writeOpenProjectToFile()` compares the
    bytes on disk with what it last saw and refuses if they moved — so a stale claim can no longer
    cause an overwrite, and the file is protected even with the broker down. The lock is a courtesy;
    the freshness check is the guarantee. "Break their lock" is therefore safe to offer where "Take
    over" never was.
  - **P2/P3 fixed 2026-08-05 from Tom's second pass (he stopped at punch-list line 193):** the same
    file opening as two live tabs (identity is the `docId`, so re-opening now switches to the tab
    that has it and adopts the fresh handle — a second route back from a lost connection); and
    `Save all`, which was not missing but *hidden* below two dirty file projects, so a command that
    existed was one nobody could find. It greys out now, like Save and Revert.
  - **The freshness check had a hole exactly where it was most needed, and it was ours.** Tom:
    *"Still doesn't work with broker blocked. Save is apparently allowed as normal."* The stamp lived
    only in memory, so a reload dropped it — and Task 212 then re-read the file on the way back in,
    **adopting a colleague's newer version as our own baseline**. A reloaded A would have written
    over B's saved work with nothing said, on the one path that is supposed to hold when the broker
    is down. The stamp now lives in the project index and boot keeps the old one rather than taking
    a new one. **Lesson worth more than the fix: restoring a connection is not the same as restoring
    what that connection KNEW** — Task 212 brought back the handle and silently reset the guarantee
    built on top of it.
  - **The freshness check was on one write path out of two** (2026-08-06, Tom's third report of the
    same symptom: *"Still doesn't work with broker blocked. Save is apparently allowed as normal."*).
    It lived in `writeOpenProjectToFile()` — but **read-only routes Save straight to Save as**, and
    so does a tab with no live handle, and Save as exempted any file carrying our own `docId` from
    every question, without even asking the broker. True of the file we last wrote; false of the file
    a colleague has written since. Save as now runs the same stamp comparison and asks the broker
    about our own docId too. **Two lessons: a guarantee that guards one of two paths guards neither,
    and "it is our own file" is a statement about the past.**
  - **"{name} has this file open." now carries numbers** (Tom: *"Are we going to add some numbers to
    this message?"*). The dialog asks the reader to judge a claim, and that judgment is entirely
    about time. The broker already stored `editedAt`/`savedAt`/`lastActivity`; only the richest of
    the four sentences was ever used, and it required both an edit and a save in the holder's current
    session — so the ordinary case fell through to the bare sentence. Four cases now: unsaved work,
    all saved, edited-but-never-saved, and only-opened.
  - **Revert was in the menu and in neither banner**, which is where somebody locked out is looking.
    Both banners carry it now.
  - **Save all's tab-switching flicker is deliberately NOT fixed** — the write path writes the *open*
    project and every warning it raises is a banner about the tab in front of you; making it silent
    means teaching that function to report about a project the user cannot see. Cosmetic cost, P0
    surface. Recorded so it is not re-litigated as an oversight.
  - **From Tom's §H pass, 2026-08-06 — the first pass run against a list this short.** H1 (the
    native picker handshake, the riskiest single guess in the build) **passes**; H2 and H5 pass; H3
    passes once you know Chrome's row says Block, not Remove. Two real defects, both fixed:
    - **§10 a moved file was reported as saved** — *"It neither complains nor creates a new file. It
      silently fails to save."* Everything through `writable.close()` can resolve without a byte
      landing. **A write is not a save until you can read it back**: the file is now re-read after
      every write and its size compared with what was written. This is the worst class of bug this
      feature can have — not refusing to save, but *believing* it had.
    - **§11 the fallback asterisk never went out.** In a browser that cannot connect to a file the
      downloaded copy IS the saved state; it now records a baseline and the star clears until the
      next change, staying faint because the page still cannot write back to it.
    - Not defects: the tab-strip scrollbar (*"there all along"* — struck from the findings), and
      Save all's flicker (wants an explanation, carried to Task 209).
  - **Closed with every P0/P1/P2 fixed and verified**, most of them by
    `dev/browser-pass/run.js` (138 checks) and the rest by Tom on real disk. The small survivors are
    Task 225, extracted rather than left inside a closed block.
  - **The one that cost the most, and the one worth remembering:** four rounds on a single box —
    a save reporting success while the file was gone — because each fix was correct and none of them
    was asking the disk. Read-back, then a baseline, then a flat no-create rule, and finally the real
    answer: `getFile()` answers from metadata the browser already holds. **An API that answers
    without touching the thing it describes is not evidence about that thing.**


- 0|220| **[DONE 2026-08-06] Browser-verified `lpn_` project files and locking against the POST-211 UI.**
  Punch list: `dev/lpn-file-lock-test-punchlist.md` — **§0–§8 rewritten 2026-08-05 against tabs, the
  File menu, no autosave, opt-in read-only, no Delete and no AUTOMATIC take-over** (corrected
  2026-08-09: deliberate take-over via *Break their lock* is a supported action and always was —
  what Task 211 deleted was the silent promotion poll; see the note at the top of the punch list).** 78 checks, all open; the
  old §1–§6 "done" marks were against controls that no longer exist, so they were reset. Tom's
  annotations from that pass are preserved in an appendix as the record of why Task 211 happened.
  - **§11 (Firefox/Safari) is largely coverable from Chrome** on a plain `http://` LAN IP — the
    fallback is the same `showSaveFilePicker === undefined` branch. What that misses is
    browser-specific rendering, which is the lower risk. (`http://localhost` will NOT trigger it;
    localhost is a secure context.)
  - **§13 still needs the rewrite §0–§8 got** — it names controls that were renamed or removed, which
    Tom caught in the pass. Do it before asking him to run the list again.
  - **Closed 2026-08-06.** Every box is `[x]` or `[auto]`: 138 automated checks over two real browser
    profiles against the real broker (Task 224), plus Tom's §H pass for the handful a machine cannot
    answer. §13's rewrite and the small leftovers moved to Task 225.
  - **It no longer gates Task 146.06 on verification** — but dropping the PREVIEW banner is Tom's
    call, not a consequence of a green test run, and the feature laundry list in
    `project_lpn_scaffold_before_translate` is the other half of that decision.


- 0|224| **[DONE 2026-08-06] The punch list runs itself: `dev/browser-pass/`.** Asked for by Tom
  (*"I am very tired and feeble-minded right now. Is there any way that we can proceed without my
  working through the test punch list?"*). 89 checks over two real browser profiles against the real
  `lpn-lock.php`, in about a minute, re-runnable: `node dev/browser-pass/run.js`. It began at 89 checks and closed the punch list at 138.
  - **The one lie is the picker, and it is small.** `showSaveFilePicker`/`showOpenFilePicker` are
    replaced — nothing else — with functions returning **OPFS** handles, which are real
    `FileSystemFileHandle`s: structured-cloneable (so Task 212's IndexedDB persistence is genuinely
    exercised), real `createWritable()`, real `queryPermission()`. Injected via `addInitScript`, so
    **no test-only code ships in the page**: no flag, no seam, no build step.
  - **Two contexts, not two tabs** — separate `localStorage`, separate identity, real contention. OPFS
    is per-profile, so the runner plays the network share and moves the bytes when a spec says so.
  - **It paid for itself in the first hour**, with four defects, three of which no human pass could
    have found: `pageCalculatorInitialize` missing (every FIRST-TIME visitor's page half-initialised —
    Tom's own browser has had the cookie for weeks); a listener for a button not on the page;
    **`Accept-Language: *` 500'd every page in the suite** on PHP 8; and arriving-then-reloading
    emptying the tab strip. Then three more while writing the specs: a dismissed change-banner
    silencing later refusals, and the read-only banner not naming who holds the file.
  - **Grown to 138 checks 2026-08-06** as Tom's §H answers came back: §9 (an unreachable broker, a
    broker that ANSWERS a setup fault, a full lock directory, and when a warning may be dismissed),
    §6-saveas (every Save-as guard, run twice — once with the broker unreachable, because a guard
    against destroying somebody's work that needs a server is not a guard), §11 (the fallback branch,
    reached by deleting the one property the page tests), §10's relink, and read-only surviving a tab
    switch. **The punch list is now down to a single open box** — §H4, a file moved in a real folder.
  - **A moved file was reported as saved, and it was TWO bugs** (Tom, §H4, twice). The first: a write
    can resolve without a byte landing, so the file is now read back and its size compared. The
    second, which the first fix could not have caught: **moving a file does not make the write fail
    at all** — `createWritable()` recreates it at the old path, so the save genuinely succeeds and
    the user is left editing a file they did not choose while their moved copy goes stale. Only the
    BASELINE knows better: we have read that file before, so if it cannot be read now it is gone —
    the one case where an unreadable file must not fail open. **Lesson: "the write succeeded" and
    "your work is in the file you meant" are different claims, and only the second is worth making.**
    It also retired the excuse for skipping §10 in the runner: OPFS does exactly what Chrome does
    here, so it is tested rather than deferred.
  - **`getFile()` succeeding is not proof the file is there** (Tom, fourth report of one silent save,
    with the file confirmed deleted before every attempt). It returns a File built from metadata the
    browser already holds, and on Windows it will do that for a path with nothing at it; the error
    surfaces only when something reads the BYTES. So every guard layered on over four rounds — the
    stamp, the metadata comparison, the existence check — was interrogating the browser's memory
    rather than the disk, and all of them passed. The guard now reads one byte off a slice.
    **The lesson is the general one: an API that answers without touching the thing it describes is
    not evidence about the thing.**
  - **It found one more defect on the way**: a Save whose pre-write lock re-check failed said nothing.
    The block cleared the "locking is not working" banner when the broker came back but never raised
    it when the broker went away mid-session — recovery without onset — so a Save that could not
    check the lock went through in silence at the exact moment the risk is real.
  - **What it cannot answer stays visible, never silently passed**: `--` lines with a reason. §1's
    native user-activation handshake, a `prompt`/`denied` permission, §10 on a real folder, §11, and
    anything visual. Listed in `dev/browser-pass/README.md`.
  - **`dev/scripts/prod_smoke.php` is the other half, for the server** (Tom: *"node is not a known
    command at the CPanel production server"*). Correct, and it never needs to be — the pass runs
    where the code is edited. But the `Accept-Language: *` fatal WAS on production and nothing there
    would have said so, so: 46 probes over five page shapes and nine header forms plus the broker,
    needing nothing but PHP (curl where there is curl, streams where there is not), exiting non-zero
    so it can gate a deploy. A 200 carrying a PHP warning counts as a failure — a warning above the
    broker's JSON makes the page report "the server is unreachable", and a fault disguised as a
    network problem is the worst kind to ship.

- 0|219| **[DONE 2026-08-05] `lpn_` added to the Related-calculators line, and its identity strings
  translated.** Order set by Tom: HW → lpn, bpn, dw, mphl, mpf; BPN → lpn (the page had no such line
  at all); IP → bpn, lpn (`mpf` removed as not very related). The blocker is cleared —
  `lpn_main_menu`/`_title`/`_desc` now exist in all 26 languages, so the links render in the
  visitor's language.
  - **Done inline by the orchestrator rather than as a 26-agent sprint** (Tom's call): the delta was
    ~3.5 strings per language, where a spawn per language is poor value. 91 strings total.
  - **All 22 non-core languages are now at delta ZERO.** es/pt/fr/tr retain only the `lpn_` body
    (204 keys), still gated by Task 146.06. Along the way: `mtc_pi_ok_tip`/`mtc_pi_tip` given
    comma decimals in id, pt, sr; `mtc_blodgett_v_bathurst` translated in de, id, ro; and
    `mtc_pi_ok_tip` (am/bn/he/hi/my), `install_desktop_heading` (de/id/it) and `ec_name_placeholder`
    (de) added to `translation_exempt_keys.json` as genuinely-correct cognates.
  - **Each language's word for "looped" is its own professional term, not a calque** — de
    *vermascht*, es *mallada*, fr *maillé*, pt *malhada*, it *magliata*, ru *кольцевая*,
    tr *halkalı*, zh *环状*. Written back to `glossary.json`'s `looped network` entry, which had
    been seeded empty since 2026-07-23.
  - Still open: this was Task 144's live test — watch HW conversion and LPN human count together.

- 0|213| **[DONE 2026-08-05] Hazen-Williams unified on EPANET's constants.** New
  `js/PipeHydraulics.lib.js` owns the one pair — SI coefficient 10.666829 (derived in code from
  EPANET's US 4.727) and diameter exponent 4.871 — plus `EngCalcs.hwSlope()`. `hazen-williams.js`,
  `branched-network.js` and `lpn-solver.js` all call it; `lpnConstants`' dual set and the `constants`
  solve option are gone. `dev/lpn-spike/validate.js` is 48/48: Net1/2/3 now match the real EPANET
  engine on the **shipped** constants, and two new checks assert the US-unit form and that no
  calculator has regrown its own copy. Head loss moves ≤0.12%, +0.042% on the HW page's own defaults.
  User-facing note added as `*_notes_epanet_term`/`_def` (en + es/pt/fr/tr) — **Task 221 retires it.**
  - **Checked, no work needed: `Darcy-Weisbach.php` already matches** EPANET's 3-regime Dunlop
    treatment line for line, same as `bpnDwFriction`/`lpnDwFriction`. This closes the open question
    the task recorded, rather than spawning a separate task.
  - **Still duplicated on purpose:** the Darcy-Weisbach and Manning kernels remain copied between
    `branched-network.js` and `lpn-solver.js`. They move into `PipeHydraulics.lib.js` under a
    behavior-preserving diff, not as part of this.

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

- 0|204| **[DONE 2026-08-05] Coverage declaration for the translation tooling — required before Task 203's matrix can
  be adopted.** Four scripts treat a missing key as debt: `lang_parity_check.php`,
  `generate_translation_payloads.php`, `translation_completion_matrix.php` and
  `lang_syntax_validate.php`, all reading one list via `exempt_keys.inc.php`. Under Task 203 a key
  absent from a non-core cell is **deliberate**, not debt — and there is currently no way to say so.
  - **The obvious shortcut is explicitly forbidden by our own rule.** `translation_exempt_keys.json`
    is for keys where *identical to English is permanently correct* (symbols, eponyms, cognates), and
    CLAUDE.md says: "Add a key there only when identical-to-English is permanently correct — never to
    quiet a number you don't want to fix." A deliberately-untranslated body is neither identical nor
    permanent. Using the exempt list for it would corrupt the one mechanism that makes **delta zero
    mean zero**.
  - **What is needed is a different concept:** a per-(prefix × language) *coverage* declaration —
    which prefixes are in scope for which languages — so the delta means "missing from what we intend
    to cover," and an out-of-scope cell is reported separately as **out of scope**, never as missing.
  - **Why this blocks rather than follows.** Adopt the matrix without it and the very next parity run
    reports `lpn_` alone as 154 × 25 ≈ **3,850 missing keys, permanently**. A number that large and
    that permanent teaches everyone to ignore it, which destroys the delta-zero discipline that was
    deliberately built (Task 161). The tooling must learn the new model **before** the model ships.
  - Keep the two ideas separate in the data as well as the code: *exempt* = correctly identical
    forever; *out of scope* = not translated yet, by decision, and revisitable when a cell earns it.

  **BUILT 2026-08-05.** `dev/scripts/translation_coverage.json` (the declaration) +
  `dev/scripts/coverage.inc.php` (the shared loader, mirroring `exempt_keys.inc.php` so the four
  scripts cannot drift apart) + `dev/scripts/coverage_selftest.php` (asserts the cross, the identity
  floor, and the exempt/out-of-scope separation against the REAL declaration, not a fixture — the
  failures worth catching are edits to that file).
  - **All four scripts wired.** `lang_parity_check.php` gains an `out_of_scope` bucket;
    `generate_translation_payloads.php` stops sending out-of-scope keys to agents and reports
    `out_of_scope_key_count` in payload meta; `translation_completion_matrix.php` prints `.` for a
    cell that owes nothing and excludes it from the row total; `lang_syntax_validate.php` stops
    warning `identical-to-english` on a body we have not asked for.
  - **The forbidden shortcut stayed forbidden.** Nothing was added to
    `translation_exempt_keys.json`; the selftest reports exempt keys sitting under non-core
    calculator prefixes (13 today — all genuine symbols and eponyms: `e`, `L`, `D`, `h_f`, `ID`,
    "Hazen-Williams", "laminar", "Circular") so a future attempt to park a body there is visible at
    review time rather than silent.
  - **Editing the declaration invalidates every payload.** `EC_COVERAGE_PATH` and
    `coverage.inc.php` joined the freshness check's input set, so `--check` goes STALE and exits 1
    the moment coverage changes — verified. A sprint cannot launch on a delta computed under a
    different coverage model than the one in force.
  - **`--ignore-coverage` on the parity checker and the matrix** restores the pre-204 full-parity
    view. Kept deliberately: "what would promoting this cell cost?" is a real question, it is just
    not the default one.
  - **Two implementation findings worth keeping.** (1) Scope must be consulted **only about a gap** —
    ask it about an already-translated key and the tools report finished work as "out of scope",
    which reads as a plan to abandon it and contradicts Task 203's *deletes nothing*. (2) The
    identity floor cannot be a `_menu` **suffix** rule: it silently swept in `lpn_tab_menu`
    ("Project menu") and `lpn_backdrop_menu` ("Background image…"), promoting two ordinary body
    labels to never-out-of-scope. The three legacy identity keys (`mi_menu`, `mtc_menu`, `wi_menu`)
    are listed by exact name instead.
  - Documented in CLAUDE.md (a new subsection under the sprint checklist) and in
    `dev/translation-process.md` (the background-structures list and the scripts reference).

- 0|211| **[DONE 2026-08-05] The tab-and-File-menu paradigm for `lpn_`: projects as tabs, files as files.**
  Supersedes Task 195's Phase 2 UI. Triggered by Tom stopping his browser pass mid-test — the UX was
  too confusing — and it **deleted more than it built**: no autosave to file, opt-in read-only, no
  Delete, an ordinary File menu. Made Task 208 obsolete. Full design narrative archived.

- 0|208| **[OBSOLETE 2026-08-05] A lock that travels with a COPY of a file is the wrong lock.**
  Ruled obsolete by Tom on reading the post-211 state: opening a file someone else holds now offers
  **Create a copy** as a first-class answer, so the lockout this existed to fix no longer happens to
  a user. Analysis archived.

- 0|210| **[DONE 2026-08-03] Stop counting Tom's own visits in the usage logs.** Asked 2026-08-03: *"is it hard to
  ignore my visits? I suppose we can pretty easily detect me in the logs if I exercise many
  calculators and languages in a human way."* Not hard, and worth doing before more hand-testing:
  he is about to exercise `lpn_` heavily on production, and Task 203's coverage matrix is being
  driven off exactly these numbers, so author traffic is now a measurement problem and not just
  untidiness.
  - **Post-hoc detection is the wrong approach** and is what the question was really asking about.
    The logs carry timestamp, page, served lang and raw Accept-Language — **no IP, no session id** —
    so "many calculators and languages in a human way" is a guess, it cannot be applied to data
    already written, and it would also delete real multilingual users, who are the ones we most want
    to see. Do not build a heuristic filter.
  - **Do the cheap, exact thing instead:** a long-lived opt-out cookie set by visiting a URL once
    (e.g. `?ec_nolog=1`), checked by all three log writers — `log-calc-event.php`,
    `log-human-view.php`, and `logLanguageSelection()` in `lib/Language.lib.php`. Per-device, which
    means setting it once per browser Tom tests in, and honest: it suppresses at write time rather
    than guessing afterwards.
  - **Built exactly that way.** `EC_NOLOG_COOKIE` + `ecLoggingOptedOut()` in `lib/config.inc.php`;
    `?ec_nolog=1` sets a ten-year cookie and takes effect on that same request, `?ec_nolog=0` clears
    it. All three writers check the one flag: `log-calc-event.php`, `log-human-view.php`, and
    `logLanguageSelection()` in `lib/Language.lib.php`. The two beacon endpoints answer **204, not an
    error**, so `EngCalcs._sendOrQueue()` never queues an opted-out event for retry — otherwise it
    would come back and be counted later.
  - Priority raised from 30 and done the same day at Tom's request, ahead of his production testing
    of Task 195 — that testing is precisely the author traffic this exists to keep out of the
    numbers Task 203's coverage matrix is being computed from.
  - Verified with a 14-check harness (each case its own process): the flag itself including junk
    cookie values, the set/clear query parameters taking effect within the request, each of the three
    writers falling silent, and both endpoints answering 204.
  - **Still open, deliberately:** the matching note in `dev/usage-data-log.md` recording the date the
    opt-out started, so later snapshots stay comparable to earlier ones. Write it at the next
    snapshot, when there is a number to attach it to.


- 0|199|[CC] **`lpn_` logged no real usage at all — instrumentation fix, DONE 2026-08-03.**
  Found while answering Tom's question about what usage logging could tell us. Every other
  calculator reaches `maybeLogCalcUsage()` through `calcAndSave()` ← `submitForm()`. On
  `Looped-Network.php` `submitForm()` fires **only** from the seven unit dropdowns' hardcoded
  `onchange="EngCalcs.submitForm()"` and the US/SI preset buttons — drawing a network and solving it
  goes `scheduleSolve()` → `runSolve()`, which never touches that path.
  - **So `lpn_`'s "used" column counted unit-strip changes, not networks solved.** The 2026-08-03
    report read `Looped-Network … 35 human, 2 used, 6%` against 70% for Manning-Pipe-Flow, which
    looks like catastrophic conversion and is not a conversion figure at all — it is a different
    event from the other fifteen rows. `runSolve()` now calls `maybeLogCalcUsage()`.
  - **Logged before the diagnostics, not after a successful solve**, so the event matches what the
    other pages log: interaction that triggers a recalculation, usable result or not. The existing
    10s-after-load gate and per-page-load dedupe keep the initial solve and the debounce from
    inflating it.
  - **Consequence for reading past reports: `lpn_`'s conversion is simply UNKNOWN before this date.**
    Do not treat the pre-2026-08-03 `%used` figures for this page as a baseline to improve on.
- 0|146.08|[CC] **[DONE] Multiple named saved networks (`lpn_`).** Local multi-project save/retrieve,
  shipping the project container from day one so Task 184's delta/scenario model stays open. Not
  EPANET `.inp` interop — Tom confirmed 2026-07-29 that is not needed (Task 196). Detail archived.

- 0|197|[CC] **Tooltips stuck visible — the hover+click trigger stack (suite-wide) — DONE 2026-08-03.**
  Tom: *"Tips are getting stuck visible. I saw this on mtc.n."* Second report of the same symptom;
  the 2026-07-30 fix in `js/Calculators.lib.js` covered **controls only**, so every PLAIN LABEL kept
  `'hover focus click'` — all three triggers at once — which is precisely the accumulation that
  file's own comment describes. The comment explained the bug and the code then shipped it for half
  the elements.
  - **Why `mtc_n` specifically:** its `.ec-help` sits *beside* the `<a>`, not inside it (the
    link+tip convention), so `ecTipIsControl()`'s `closest()` finds no control and it takes the
    plain-label branch. Nothing wrong with the markup — the branch was wrong.
  - **The real rule is narrower than "controls differ from labels":** a tip must never carry both a
    hover trigger and a click trigger, whatever the element is. Bootstrap will not hide while ANY
    trigger is active, so hover-then-click leaves it pinned when the pointer leaves. The fix picks
    **one opening gesture per device**: hover-capable pointers get `'hover focus'`; touch gets
    `'click'` for plain labels (their only gesture) while controls stay `'hover focus'` so a tap
    still just performs the button's action. Controls keep the explicit hide-on-click stabilizer.
  - **Accepted gap:** a hybrid device (touch screen + mouse) reports `(hover: hover)`, so a plain
    label's tip is hover-only there and a finger tap will not open it. Rare device, and a far
    smaller harm than a tooltip stranded over the page for every mouse user.
  - **Guarded by `dev/lpn-spike/suite-tips-trigger-harness.js`** (16 checks), which asserts the rule
    for all four combinations of (is a control, device can hover) rather than for the case that
    happened to be reported — that narrowness is what let this regress once already. Note the
    harness tests suite-wide code from an `lpn-spike` directory; a neutral home is wanted once there
    are more than two.
- 0|198|[CC] **Flow arrow moved downstream of midpoint (Task 146 child) — DONE 2026-08-03.**
  Tom: *"I think it's more intuitive for the flow arrow to be downstream of midpoint. It's currently
  upstream."* `ARROW_ALONG` 0.3 → 0.7 in `js/looped-network.js`, measured from the upstream end.
  One constant: `flow < 0` already mirrors it to `1 - ARROW_ALONG`, and `linkLabelMid()`'s
  label-collision test measures against `arrowAlongDistances()`, which derives from the same value,
  so label separation follows automatically. The arrow now leads the flow rather than trailing it,
  keeping the same distance from the midpoint label and the same redundancy with the chevron.

- 0|173|[CC] **`EngCalcs.initTips(root)` — tooltips built after page load are dead on touch — DONE
  (built during Task 146; closed 2026-08-03 on discovering it was still listed at priority 30).**
  `js/Calculators.lib.js` exports `EngCalcs.initTips(root)`, calls it with `document` on
  `DOMContentLoaded`, and `js/looped-network.js` calls it again after building the toolbar, each
  property popup, the Settings panel and the Labels panel — the three things the original entry
  asked for. It was implemented as the hard prerequisite it was described as, and then never closed.
  - **Closing note, and the reason this is worth a paragraph rather than a silent deletion:** the
    entry sat at priority 30 in an active list for long enough to distort every "what is next"
    reading of the roadmap. Recurring miss — closing a task means priority → 0 AND moving the block
    to `## Completed`, in the same edit.
  - The tooltip work did NOT end here. See Task 193's reset-controls block for the 2026-08-03
    stuck-tooltip fix, which is a different defect in the same function.

- 0|193|[CC] **[DONE 2026-07-31] `lpn_` English tightening pass.** The English-reform gate run before
  the 146.06 sprint so each fix is paid once instead of 26 times. Every `lpn_` key reviewed, 51
  changed, plus trap-term tips and a glossary seed. Narrative archived.

- 0|189|[CC] **Per-field decimal places on map labels (Task 146 child) — DONE 2026-07-30.** Tom:
  "along with the checkbox, a decimal places input (with scroller since it's integer and small?)
  would be nice for each numerical label." Shipped as a 0–4 number input on each numeric field's row
  in the **Labels popover, not Settings** — it is a per-field property and that panel is already the
  per-field row list, while Settings holds page-wide preferences.
  - `labelSettings.decimals.{node,link}` is a **parallel map**, not a shape change to the existing
    `node`/`link` boolean maps. Those booleans are merged key-by-key out of localStorage on every
    load; turning each one into an object would have silently reinterpreted every already-saved
    network's toggles. A field is numeric exactly when it has an entry here, so ID needs no second
    list — `decimalsFor()` reads that one map to decide whether a row gets a spinner.
  - **The decimals are fed through `displayRound()`/`plainRound()`, which is the whole point.**
    Extrema are deliberately judged on the *rounded display value* so two series links printing the
    same number can't be marked max and min by solver roundoff past the last printed decimal. Feeding
    per-field decimals into that same function keeps the invariant: verified numerically — three
    flows of 100.004 / 100.000 / 99.996 all print "100" at 0 decimals and **none** is marked, and at
    3 decimals they differ and the max/min marks appear.
  - `Math.round(x*100)/100` was open-coded in four places for the declarative/dimensionless fields
    (Length, Roughness, k) — folded into `plainRound()` so those follow per-field decimals too rather
    than staying pinned at 2.
  - Defaults are 2 everywhere, so shipping it is a visual no-op; the spinner clamps to 0–4 rather
    than alerting (a held-down spinner runs past its own max, and every out-of-range value has an
    obvious intended meaning).
  - **The up/down arrows needed a new opt-in CSS class, `.ec-spin`** (Tom asked for them, which is
    what surfaced this). `css/engcalcs.css` strips the native spinner from *every* number input in
    the suite — correct for a physical quantity, where a 1-unit step is meaningless and the arrows
    only steal width, and wrong for a small bounded integer, where clicking up/down is the natural
    gesture and the arrows themselves signal "this is not a free-form number." `.ec-spin` opts one
    field back in; `opacity:1` is part of it because Chrome/Safari otherwise hide the spinner until
    the pointer is over the input — invisible exactly when the user is looking for it. Reusable
    suite-wide, but purely opt-in, so nothing existing changes.
- 0|190|[CC] **Toggle for the high/low marks on map labels (Task 146 child) — DONE 2026-07-30.**
  `labelSettings.markExtrema`, a single checkbox below both field lists in the Labels popover, using
  the roadmap's recommended wording **"Mark highest and lowest values"** (per CLAUDE.md's
  Simple-English rule, the plain verb and adjectives beat "indicate" and beat "max/min").
  - **Global, not per field**, as the roadmap called: the mark answers one network-wide question per
    field, and it is the smaller build.
  - **Enforced in `decorationFor()`, not by suppressing the extrema themselves.** The `fieldExtrema()`
    results stay computed and correct while the marks are hidden, so turning them back on needs no
    recompute and nothing else reading them can go stale.
  - Lives in `labelSettings` (a view preference, deliberately outside the undo-snapshotted `doc`),
    which forced a fix to `loadFromStorage()`: its merge looped `Object.keys(labelSettings)` and
    `Object.assign`ed each group, which **boxes a bare boolean and throws the result away**. The
    groups are now named explicitly, since the object is no longer uniformly two flat sub-objects.
  - Both tasks are covered by the existing "Restore defaults" button, which resets all of
    `labelSettings`.

- 0|188|[CC] **`lpn_` backdrop fade, heavier pipes, popup placement, and a click-blocking bug —
  DONE 2026-07-30.** Tom, testing against a real backdrop: "my backdrop is busy and dark… I can't
  see my pipes and flow arrows. Should we just strengthen their relative widths a little? Maybe
  double? Do both? I trust your judgment."
  1. **Backdrop opacity setting** (`settings.backdropOpacity`, 0–1, beside Symbol opacity). This is
     the primary fix and the one that generalizes: fading the REFERENCE material rather than
     thickening the drawing over it is what AutoCAD's image fade and a QGIS layer's transparency are
     for, and unlike a heavier stroke it changes nothing about the network — so a drawing tuned
     against a busy aerial still reads correctly on white and in print. Implemented as
     `--lpn-backdrop-opacity` on a `.lpn-backdrop` layer class, same mechanism as symbol opacity.
  2. **Pipes went from 0.5 to 0.7 wide — "a little", not Tom's offered "maybe double".** At 0.5 a
     pipe was drawn LIGHTER than the node outlines (1.0) sitting on top of it, which is backwards
     for a pipe network, where the pipes are the primary content. 0.7 fixes that while staying under
     the node outline, so the over-wide problem that the earlier 2 → 0.5 correction fixed does not
     come back. **The flow arrow was deliberately left at 0.3**: Tom called that width "beautifully
     narrow", and what makes an arrow vanish into a dark aerial is its pure BLACK against a dark
     background, not its width — the backdrop fade fixes that without coarsening the mark.
  3. **Property popups no longer open on the click point.** On an orthogonal network — most real
     ones — a popup centred on the element covers the elements directly north and south of it,
     which are exactly the ones being compared against it. It now opens to the RIGHT of that
     element's own data label, just past where its extrema glyph would sit, plus one node diameter
     (Tom's own measure: "roughly a node size to the right of the extrema location"). It still reads
     as belonging to the element because it lines up with that element's label, and it falls back to
     the click point for an element with no rendered label. Needed a `worldToScreen()`, the inverse
     of the existing `screenToWorld()`.
  4. **Bug found while verifying (3): leader lines and extrema ticks were swallowing clicks.**
     `labelsLayer` draws above the symbol layers, so a leader or a tick mark crossing a node took
     the click meant for that node and the popup simply never opened — reproduced on the Example
     network's J1, whose popup would not open at all while R1's and J2's did. Neither element is
     clickable by design (a label's own text is the drag target; a tick decorates that text), so
     both now carry `pointer-events: none` (`.lpn-leader`, and a new `.lpn-tick` class on every tick
     element). All three nodes open correctly after the fix.

- 0|187|[CC] **`lpn_` link labels at the true midpoint; roughness and minor loss added to the
  Labels choices — DONE 2026-07-30.**
  1. **A link's label anchored inside one SEGMENT, not at the halfway point of the pipe** (Tom:
     "link label is placing within last segment instead of overall length. Not good."). `linkLabelMid()`
     took `segmentMidpoints()[floor(segCount / 2)]` — the midpoint of the middle segment — which on
     a bent pipe with an even segment count lands in the middle of the *second leg*. It now walks
     the polyline by arc length (`pointAlongLink()`) and takes the 50% point of the whole pipe.
  2. **...then steps clear of any flow arrow it would land on** ("but don't conflict with an
     arrow"). Arrows sit at 30% of each SEGMENT, so on some geometries the two coincide;
     `arrowAlongDistances()` reports where the actually-drawn arrows fall along the whole pipe (same
     two rules `updateArrow()` applies), and the label slides along the pipe — never off it — to the
     far side of a conflicting arrow, clamped to 12–88% so it never crowds a node.
  3. **Roughness and the minor-loss coefficient are now Labels choices** (Tom: "add all input
     properties to the Labels choices"). Both are dimensionless, so they render through `rawLine()`
     like Length; both are suppressed on pumps, like the other pipe-only inputs; both are off by
     default. Placed **with the other inputs** — after Length, before the solved results — since
     inputs-then-results is the order the list already follows and Tom left the placement open ("do
     something and we can change later"). They got real colors rather than the offered black
     (teal `#00695c`, freed up when head gain was removed, and olive `#827717`), since two more
     entries all reading black would make the legend ambiguous with ID.
     `lpn_field_km_short` ("Minor loss, k") is a new key: the popup's full
     "Minor (local) loss coefficient, km" would set the width of the whole on-map legend box, and
     CLAUDE.md's rule is that a shared label must fit its narrowest use.

- 0|182|[CC] **Sticky tooltips on interactive controls — suite-wide, DONE 2026-07-30.**
  Tom, testing `lpn_` against a real system: "tips are getting stuck open. Here's something
  repeatable. Labels hover, then labels click, then Close. Tip is now stuck open until you click and
  close again. It cycles. I think another button was also sticking."
  **Cause:** `EngCalcs.initTips()` (`js/Calculators.lib.js`) gave every tip
  `trigger: 'hover focus click'`. Bootstrap tracks the three triggers separately and refuses to hide
  while ANY is still active — hovering sets hover, the click then sets click as well, and moving the
  mouse away only clears hover. The tip stays pinned until a second click toggles click back off,
  which is exactly the cycle Tom described. `focus` sticks the same way, since a clicked button keeps
  focus; that is the "another button" he suspected.
  **Fix:** decide the trigger from what the element IS. A tip on an interactive control
  (`closest('button, a, input, select, textarea, [role=button]')`) gets `hover focus` plus an
  explicit `hide()` on click — Bootstrap's `hide()` clears all three active triggers at once, which
  is what breaks the cycle. A tip on a plain label keeps `click` in the list, because a tap is the
  only way a touch user can reach it at all (ROADMAP Task 173's whole point). On touch, tapping a
  button performs its action, which IS the answer; a tip left hanging over the panel it just opened
  is noise.
  **Checked the one case that could have regressed:** the two link+tip strings
  (`mpf_friction_slope`, `mtc_bend_angle`) put `.ec-help` as a SIBLING after `</a>`, per CLAUDE.md's
  link+tip convention — so `closest('a')` misses them and they keep the click trigger. Verified in a
  browser: label tips still open on tap, and the Labels-button cycle now leaves zero tooltips open
  on two consecutive repetitions.

- 0|183|[CC] **`lpn_` map geometry: scaling gaps, arrow placement/width, symbol opacity —
  DONE 2026-07-30.** Everything Tom found once he started laying a real system over a backdrop.
  1. **Extrema badges were not scaling.** `TICK_STROKE`/`TICK_LENGTH`/`CARET_LEG_*` were fixed world
     sizes while the rise/drop constants beside them were already × font size, so a badge that
     decorates a number stopped reading as part of it at any non-default text size. All of them now
     go through a new `textFactor()` (= `effectiveFontSize() / 2.5`, so 1 at the default). Verified:
     text 2.5 → 5 doubles the rail length (1.6 → 3.2), stroke (0.3 → 0.6) and chevron (0.5 → 1.0).
  2. **The leader threshold was not scaling either**, so at large text a label had to travel much
     further (relatively) before earning a leader. `leaderThreshold()` scales the 4-unit constant by
     `max(textFactor, symbolFactor)`. The DEFAULT label offset (+2, −2) now scales with
     `symbolFactor()` too — at 2× symbols a fixed offset started the label inside its own node. A
     label the user has DRAGGED keeps the exact offset they dropped it at.
  3. **Flow arrows were too wide** — "it seemed beautifully narrow before." Double-scaled: the
     chevron's SHAPE is scaled by an SVG `scale()` transform, and an SVG transform scales the stroke
     with the geometry, so also multiplying `stroke-width` by `--lpn-sym` in CSS squared the factor.
     `.lpn-arrow` is now the one stroke width in that file that does NOT read `--lpn-sym`.
  4. **Flow arrows collided with pipe labels** — both sat at the segment midpoint. The arrow moved
     to `ARROW_ALONG` = 0.3 **measured from the upstream end** (0.3 at positive flow, 0.7 at
     negative), so its position redundantly encodes flow direction as well.
  5. **Arrows on a segment too short to hold one are hidden** (`len < 2 × chevron length`) — a
     chevron longer than its own run overhangs both vertices and reads as a mark on the network
     rather than on that pipe. Verified on the Example: 5 arrows shown at symbol size 1, 4 at 4,
     0 at 8.
  6. **Symbol opacity setting** (`settings.symbolOpacity`, "Symbol opacity (0 to 1)"), for laying a
     network out over a backdrop aerial or plan. Applied as `opacity` on the two whole symbol
     layers (now classed `.lpn-symbols`) via a `--lpn-opacity` custom property, so nodes, pipes,
     arrows and vertex handles fade together as ONE drawing instead of each fading independently
     and showing where they overlap. **Labels, masks and leaders are deliberately untouched** — the
     point is to see the backdrop through the network while placing it, and fading the numbers at
     the same time would defeat the reason you are looking at both together.

- 0|180|[CC] **Tom's third review round on `lpn_`: live collision recalc, 3-point Example pump,
  symbol size, legend headings — DONE 2026-07-30.**
  1. **Collision avoidance now runs during a drag** (Tom: "collisions aren't recalculated after
     drag; leaders stay unchanged"). `refreshLabelText()`'s layout half is split out as
     `relayoutLabels()` — collision pass, then every label's text/mask/leader/ticks — and
     `applyDrag()` calls it for node, vertex, Text-label and data-label drags. The numbers don't
     change while dragging, so the tspans are not rebuilt; only the layout is redone.
     **This required making the collision pass idempotent:** it used to keep an auto label's
     previous nudge and push further from there, so a label stayed pushed long after whatever it
     hit had moved away, and re-running it per frame would have accumulated drift. Every nudge is
     now cleared and re-derived from scratch on each pass. Verified: dragging J1's label on the
     Example produces three leaders (the dragged one plus two labels it pushed), where before the
     drag there were none.
  2. **The Example network's pump curve is three points, not one** (Tom: "1-point is not very
     readable, and not good for our Example even if it's legal"): (0 gpm, 90 ft), (150, 65),
     (300, 20) — a shutoff head, a duty point, and a run-out point, the way a manufacturer
     publishes one. One point stays legal, because it is EPANET's own rule and matching EPANET is
     the point of `lpnPumpFromCurve` — but it DERIVES shutoff head and maximum flow from the single
     number you type, which is the same "numbers the user never entered" problem Task 179 removed
     from new pumps. **The Example's reservoir also moved down to 55 ft**, in among the junctions
     it feeds (50 ft and 40 ft) instead of 50 ft above them: perched high, the example was a
     gravity system that would work with the pump deleted, so the pump's contribution was invisible.
     It now delivers 76.3 ft at the 100 gpm duty flow and is the only reason there is pressure
     anywhere (J1 35.3 psi, J2 39.4 psi).
  3. **Pump curve documented in the Notes, not in the popup** — a new `lpn_notes_5` ("Pump curve")
     giving H = H₀ − aQ^b and what one, two and three points each mean, with a one-line pointer
     under the curve table in the popup (`lpn_pump_curve_note`). The popup floats over the map and
     has to stay readable on a phone; the Notes list is already this page's documentation home,
     prints with the page, and is translated with everything else.
  4. **Symbol size setting**, as the two-dimensional control Tom asked for rather than a full
     per-element breakdown: `settings.symbolScale`, labelled "Symbol size (relative to text)", sits
     under the existing Text size block. Symbols are sized as a MULTIPLE OF THE TEXT
     (`symbolFactor() = effectiveFontSize() / 2.5 × symbolScale`), so they inherit the text's
     map-vs-screen units for free and there is no second units selector. Node/vertex radii and the
     flow-arrow chevron are geometry, scaled in JS; the six stroke widths are styles, and now read a
     `--lpn-sym` custom property that `refreshSymbolSizes()` writes on the SVG
     (`stroke-width: calc(0.5 * var(--lpn-sym, 1))` etc. in `css/engcalcs.css`). A default of 1
     reproduces exactly what shipped before. Per-element control (separate pipe width, node size,
     pump size, reservoir size) is deliberately **not** built — see Task 181.
  5. **The on-map labels legend gained Node labels / Link labels headings**, reusing the two keys
     the Labels popover already has, emitted only when that group has a visible field. And the
     Select-mode hint now reads "Click an element **or label** to view or edit it".

- 0|179|[CC] **[DONE 2026-07-30] Tom's second `lpn_` review round.** Five pieces of test feedback,
  three of which reversed decisions recorded as settled in Tasks 176 and 146.01. Headline: a
  Reservoir is also a Tank (carries Elevation as well as Head). Detail archived.

- 0|146.01|[CC] **[DONE 2026-07-30] Draggable data labels on leaders, collision avoidance, background
  mask (`lpn_`).** Node/link labels carry an optional drag offset persisted like any other property
  (`js/looped-network.js`); past a 4-unit threshold a leader line is drawn. Detail archived.

- 0|146.03|[CC] **Text label custom size multiplier — DONE 2026-07-29.** Per-label `sizeMult`
  (default 1) stacks on top of the shared `settings.textSize`/`settings.textSizeUnits` via
  `effectiveFontSize(mult)` in `js/looped-network.js`; only a Text label carries one — node/link
  labels are unaffected. Editable via a new "Size ×" number field in the Text popup
  (`renderLabelFields()`), persisted with the label (no storage-version bump needed — old saved
  labels fall back to `sizeMult || 1`). Rich text formatting (bold, font family) remains explicitly
  undesigned per the scope doc.

- 0|176|[CC] **Pump curve entry, head-gain/head-loss reporting fix, demand/flow color unification —
  DONE 2026-07-30.** Three related fixes to `js/looped-network.js`, found and built in one session:
  1. **Pump curve entry**, built exactly to the scope doc's sketch (see
     `dev/looped-network-calculator-scope.md`'s "Pump curve entry" entry, now marked done): the pump
     popup's `<select>` offers "Enter points below" (1-3 `[Q,H]` rows feeding the ALREADY-WRITTEN
     `EngCalcs.lpnPumpFromCurve()` in `js/lpn-solver.js` — that solver-side fit was done in an
     earlier pass and had simply never been wired to a UI) or any other pump's id, copying that
     pump's curve instead (`l.curveRef`, resolved one hop only by `resolveCurvePoints()`, so a
     reference cycle can't form). `renameLink()` now rewrites every `curveRef` that pointed at a
     renamed pump's old id, so a rename can't silently orphan a reference.
  2. **A pump's head GAIN was reading as a "Head loss" of ~70+ ft.** Found while testing the popup:
     the map-label rendering reused the `headloss` field/color/extrema bucket for a pump's
     `-headloss` (i.e. its gain), so a 77 ft pump boost sat in the same legend swatch and the same
     min/max scale as a pipe's fractional friction loss — indistinguishable from an enormous, wrong
     loss at a glance, even though the property popup already correctly labeled it "Head gain"
     (readonly field, separate string, already right). Split into a genuinely separate `headgain`
     field: own color (`#00695c`, distinct from `headloss`'s `#4527a0`), own `linkFieldDefs()`
     entry/checkbox/legend row, own extrema bucket computed from pump links only (`headloss`'s
     extrema now excludes pump links symmetrically). `lpn_result_headgain` already existed as a lang
     key from the popup; no new translation needed for this fix, only new plumbing.
     **REVERSED 2026-07-30 by Task 179** — Tom: "I don't think we need a separate Head Gain.
     Negative head loss is fine." There is no `headgain` field, color, checkbox, or extrema bucket
     any more, and `lpn_result_headgain` is deleted.
  3. **Node Demand and Link Flow now share one color** (`#1565c0`, was `#6a1b9a` for Demand) —
     both are the same physical quantity, Q, so the Labels-panel legend should read them as one
     concept rather than two unrelated numbers that happen to both be flow rates.
  Also (same session): `.lpn-vhandle` (a pipe's editable vertex) is now filled the pipe's own color
  (`#557`) instead of a hollow white circle with the PUMP's stroke color, which had no relation to
  the link it belonged to; the Select-mode status hint gained "Double-click a pipe to add or remove
  a vertex."; the gear/settings panel gained a "Restore defaults" button (settings/labelSettings
  only) and a temporary "Wipe memory" button + `?lpn_wipe=1` URL param (full localStorage reset, for
  verifying the true first-visit state during preview — Tom: "I want a way to know that I am
  loading the first-time calculator"); default visible labels changed to ID/Demand/Pressure/
  Elevation (node) and ID/Flow/Velocity (link), Tom's own choice after using the Labels panel for
  the first time. See Task 177 (open) for the follow-on question this surfaced: should `lpn_` also
  report a per-length head-loss GRADIENT alongside the total, matching conventional network-software
  reporting.

- 0|163|[CC] **Language strings standardized on single quotes; the validator's blind spot closed —
  DONE 2026-07-28.** Was: "`lang_syntax_validate.php` cannot see double-quoted lang assignments"
  (priority 8, found incidentally while closing Task 161). `extractValues()` matched only
  `$ec_lang['key']='...';`, so every double-quoted assignment was invisible to **every** check built
  on it, including Rule A (`entity-in-lang-string`) and Rule B (`tag-in-plain-text-string`) — the two
  rules CLAUDE.md calls absolute and tool-enforced.

  **The original entry's central claim was wrong, and the correction is the most useful thing here.**
  It said "the gap is currently benign … all 43 double-quoted keys in `lang.ec.en.php` are `u_` unit
  tokens … nothing is hiding there today," and rated the risk as purely future. In fact **660
  double-quoted assignments existed across the 27 files**, and eight were real translated content:
  `mpf_main_title`, `mpf_main_desc`, `mpf_pipe_diameter`, `mpf_solver_no_solution` and
  `contactSendMessage` in `lang.ec.tr.php`, `contact_title` in `lang.ec.bg.php`, and
  `contactSpamPostfix` in bg and fr. The future risk had already happened; the estimate was low
  because it was taken from the English file alone and generalized to all 27. **Lesson: when sizing a
  defect that spans the language files, count in all 27 — English is the least representative one,
  because it is the file that gets edited most carefully.**

  **A second, worse defect surfaced only because the fix was verified rather than assumed.** Two
  Spanish values were double-quoted *for interpolation*: `$ec_lang['u_gradePercent']="% $ec_lang[u_grade]"`
  and `$ec_lang['u_in2']="$ec_lang[u_in]^2"`. Those strings silently depended on another key being
  assigned earlier **in the same file** — and `lang_key_order_normalizer.php` exists specifically to
  reorder these files, which would have blanked both with nothing visible in the diff of the changed
  line. Spanish is the suite's second-largest audience (10% of human reach). Both are now literals.
  The naive conversion to single quotes broke them exactly as it should have; a `var_export` diff of
  every value PHP produces, before vs after, is what caught it. **Never land a mechanical rewrite of
  the language files without that diff** — `php -l` passes happily on a string whose meaning changed.

  **Shipped:**
  1. `dev/scripts/lang_parse.inc.php` — one parser for all four tools. Exposes two deliberate views:
     `ecLangRawValues()` (escapes intact, for syntax rules that check the literal text an author
     typed) and `ecLangValues()` (escapes resolved, for comparison, where `Haws\'a` must equal
     `Haws'a`). It still reads both quote forms on purpose — a parser that only understood the
     standard could not report a violation of it.
  2. All 660 double-quoted assignments converted to single quotes; 3 apostrophes escaped `\'`.
     **Zero string values changed**, proven by diffing PHP's own evaluated output across 27 files and
     15,552 keys.
  3. **Rule D** (`double-quoted-assignment`) in `lang_syntax_validate.php`, covering `$ec_lang` and
     `$ec_lang_intent`, a hard error, verified by injecting a violation and confirming it fires
     rather than trusting a clean run.
  4. `u_depthFrac` added to `translation_exempt_keys.json` for **fr only** — the one genuinely new
     finding the closed hole exposed. French "fraction" is spelled identically; es/it/pt/ro/de all
     differ, so it is not a global exemption.
  5. Rule D documented in CLAUDE.md's Language Keys section, next to Rules A–C.

  **Verified:** `lang_syntax_validate.php` byte-identical to its pre-change baseline (60 advisory
  identical-to-english findings, no new class); `lang_parity_check.php` differs only by the intended
  `u_depthFrac` reclassification (equal_to_english 68 → 67, exempt 1520 → 1521); payloads regenerated
  to FRESH, with `payload_fr.json`'s delta 10 → 9 as the sole content change.

- 0|166|[CC] **The 26-language sprint ran — DONE 2026-07-28.** 26 Sonnet agents, one per language,
  covering 11 new keys common to every language (`calc_units_us`, `calc_units_si`, the eight `hw_*`
  pressure/elevation keys from Task 167, and `hw_note_1` from Task 170), the per-language stragglers
  the delta had swept up, and a semantic **resync** of the two CHANGED keys (`calc_defaults`,
  `mphl_note_1`) that the payload-delta structurally cannot see. ~406 strings.
  **Verification (the agent reports were not taken at face value, per the standing rule):**
  `lang_syntax_validate.php` clean of every non-advisory finding; `php -l` clean on all 27 files;
  tag/URL parity checked programmatically for `hw_note_1`, `mphl_note_1` and `hw_pressure_neg`
  against English; every one of the 10 core keys confirmed non-identical to English in all 26 files;
  and an inline back-translation read of all 26 languages' short labels.
  **Four defects the self-reports missed, found by that verification and fixed by hand:**
  1. **fa, sw and my each reported `mphl_note_1` "already in sync" — none of them were.** All three
     still carried the pre-Task-169 opening `<dt>` ("does not consider pipe elevation"). Caught by
     `git diff` per file: an agent that reports a resync but never edited the file is the signal.
  2. **my silently skipped `calc_defaults`** (self-reported honestly, to its credit).
  3. **ru rendered `calc_defaults` as "По умолчанию"** ("By default") — a noun label, the exact
     defect the English reform removed. Reset to "Восстановить значения по умолчанию". The agent's
     width justification did not hold: de and es ship 30–33-character imperatives on the same button.
  4. **pt "fixed" `mphl_note_1` by adding a `</dl>`**, breaking tag parity with English.
  **The `</dl>` finding was real and is now fixed at the source.** `mphl_note_1` opened `<dl>` and
  never closed it, with `Manning-Pipe-Head-Loss.php` appending `</dl>` in the page — so Hazen-Williams
  and Darcy-Weisbach, which never appended it, had been shipping an unclosed list. Both the pt agent
  and the ur agent flagged it independently. The key is now self-closing in all 27 files and the
  page's trailing `</dl>` is gone; all three pages verified to emit balanced tags.
  **Glossary write-back (mandatory, done before close):** added root concepts **`pressure`** and
  **`elevation`**, each with all 26 attested label forms and an `avoid` array guarding the
  head-vs-pressure trap. The suite had `head`, `head loss` and `pressure rating` but no entry for
  either root, so every sprint re-derived them and the trap had to be re-explained in each prompt.
  Recorded there too: the pre-existing ar tension where head loss is "فقدان الضغط" (literally
  "pressure loss") while pressure itself is "ضغط" — deliberately not touched by this sprint.
  **`calc_units_us`/`calc_units_si` moved to `translation_exempt_keys.json`** (`"*"`): all 26
  languages independently kept "US"/"SI", which is what permanent-identical looks like.
  **Residual delta is 68, all pre-existing** — per-language cognates ("Segment", "Filter", "OK",
  "turbulent") and numeric citation tips. Not exempted here: each is a per-language claim taken from
  an agent's word, and the exempt list is for things verified permanently correct, not for quieting
  a number. That is Task 161 hygiene, not this sprint's scope.
  Drift manifest re-baselined (`--update`) only after the resync actually landed, as the task warned.

- 0|170|[CC] **Hazen-Williams and Darcy-Weisbach got their own waterline note — DONE 2026-07-28.**
  New key `hw_note_1` (owner: HW, by the concept-level label reuse rule and by reach — 580 humans vs
  DW's 67) replaces `mphl_note_1` on both waterline pages. `Manning-Pipe-Head-Loss.php` keeps
  `mphl_note_1` unchanged, so the culvert material — inlet control, HY-8, outlet-control-only — now
  lives only on the culvert calculator.
  The new note covers what a waterline engineer actually needs, per the task spec: (1) the profile
  between the two ends is not modeled — an intermediate high point sees lower pressure than anything
  reported, and the fix is to re-run the page for the upstream-end-to-high-point length; (2)
  negative-pressure consequences (air out of solution, thin-wall collapse, groundwater drawn in at
  the joints) and air valves at high points; (3) upstream pressure is a boundary condition the user
  supplies — gauge, tank level, or a pump curve read *at the entered flow*; (4) the minor-loss K
  total is theirs to sum, small next to friction on a transmission main and dominant in station
  piping.
  **Fixed a latent HTML defect in passing:** `mphl_note_1` opens `<dl>` but never closes it —
  `Manning-Pipe-Head-Loss.php` appends `</dl>` in the page, while HW and DW never did, so both had
  been shipping an unclosed `<dl>`. `hw_note_1` closes its own list, so neither page needs a trailing
  tag.
  Seeded as English in all 26 non-English files; `lang_syntax_validate.php` clean apart from the
  expected advisory identical-to-english. Translation debt rolled into Task 166.

- 0|168|[CC] **Darcy-Weisbach reworked upstream-first — DONE 2026-07-28.** Applied the Task 167
  form: the single "Downstream EGL" input became Upstream elevation, Upstream pressure and Downstream
  elevation, with Downstream pressure as the headline result and the negative-pressure check. **Zero
  new language keys** — the eight `hw_*` labels were borrowed whole under the concept-level label
  reuse rule, which is exactly the case that rule exists for.
  Verified: opens at 45.19 psi residual (SI 29.49 m H₂O), the check flips to ⚠ at z_down = 250 ft
  (−11.17 psi), and **DW and HW agree to within 0.4% on head loss for the same pipe** (6.143 vs
  6.168 psi) — a useful independent cross-check, since one is Hazen-Williams C = 130 and the other is
  Darcy-Weisbach with ε = 0.0005 ft.
  **Manning Pipe Head Loss was deliberately left alone.** Storm drain and culvert design genuinely
  runs downstream-to-upstream from a known tailwater, so its current form fits its audience. Three
  pages that look identical, and the right answer for the third is the opposite of the other two.

- 0|169|[CC] **Reworded `mphl_note_1`'s opening claim — DONE 2026-07-28.** It said *"This calculator
  doesn't account for pipe elevation,"* which stopped being true for Hazen-Williams and
  Darcy-Weisbach once Tasks 167/168 gave them endpoint elevations. Now reads *"This calculator does
  not model the pipe profile between the two ends"* — true on all three pages, and it names the real
  limitation rather than a superseded one: the HGL can still dip below the pipe mid-run even when
  both endpoints are satisfactory. The consequence sentence that follows is unchanged.
  A shared key was reworded rather than a page-specific note added, so this costs **no new key** —
  but it is now a CHANGED key, and `detect_english_drift.php` reports it alongside `calc_defaults`
  for the pending resync. **The larger finding it exposed — that the note's remaining bulk is
  culvert material irrelevant to the two waterline pages — is Task 170.**

- 0|167|[CC] **Hazen-Williams reworked to solve downstream from the end the user knows — DONE
  2026-07-28.** The page took a single input labelled **"Downstream EGL"** and computed upstream
  (`egl2 = egl1 + h_L`), asking a waterline engineer for the one number they do not have. Tom:
  *"Starting at the downstream is feeling to me like it will be unwelcome to new visitors."*
  **What changed.** One input (`egl1`) became three — **Upstream elevation, Upstream pressure,
  Downstream elevation** — and the headline result is now **Downstream pressure**, the residual the
  visitor actually came for. EGL and HGL are still reported at both ends, reusing the existing
  `hw_hgl_1/2` and `mphl_egl_1/2` labels rather than minting new ones. Defaults tell a small story on
  arrival: 400 gpm through 1,000 ft of 6 in C-130 main, 60 psi at elevation 100 ft, rising 20 ft →
  **45.2 psi residual** (SI: 25 L/s, 150 mm, 300 m, 40 m H₂O at 30 m rising to 36 m → 29.5 m H₂O).
  **Separating elevation from pressure bought a real check, not just a nicer form.** A negative
  downstream pressure means the hydraulic grade line has fallen below the pipe — it would not flow
  full and the answer is invalid. The old single-EGL form could only warn about this in prose
  (`mphl_note_1`); the page now **detects** it, using the standard ✓/⚠ verdict convention. Verified:
  z_down 120 ft → 45.2 psi ✓; 200 ft → 10.5 psi ✓; 250 ft → −11.2 psi ⚠.
  **Why this was worth building without waiting for the query export** (Task 144): "the page asks for
  the wrong end" is defensible on engineering grounds alone. The export would only say whether it is
  *the* cause of HW's 11% conversion. Note this is the same defect class as the missing inverse
  solver — Manning Pipe Flow and Manning Trap are the only calculators that solve for what the user
  wants, and the two highest converters. **No solver was added here** (Tom: *"we just need to fix the
  presentation"*); the page now simply asks for what the visitor has.
  **8 new language keys**, seeded as English in all 27 files — pending translation with the Task 166
  batch. **Returning visitors are safe**: the input count went 6 → 8, and `cookieToForm`'s
  slot-count guard bails to a fresh, correctly-initialised page rather than misapplying a stale
  cookie — verified, not assumed.
  **Extracted rather than left inside this block:** Darcy-Weisbach is **Task 168**, `mphl_note_1`'s
  now-overstated warning is **Task 169**.

- 0|165|[CC] **Default unit preset is chosen by language — DONE 2026-07-28.** English gets US
  customary; every other language gets SI.
  **How it arose, recorded because the process matters more than the outcome:** the "default to US"
  decision was taken in a document titled *Hazen-Williams worked example*, in a section whose
  reasoning was entirely HW-specific. CC implemented it as one global constant across all 13 pages
  and reported it as settled **without flagging that it had generalised an HW-framed answer to the
  whole suite**. Tom caught it by observing behaviour — *"I don't see that mpf defaults to SI when es
  is the language; I see US"* — not by reading the diff. The lesson is narrow and worth keeping: when
  a decision is taken inside a worked example, say explicitly how far you are about to apply it.
  **Why language rather than global or per-page.** Measured per-language human reach is **en 83%,
  es 10%, then a ≤1% tail**, and the English audience is dominated by US municipal and storm-drain
  work quoted in inches, feet, cfs, gpm and psi — while essentially every other language in the suite
  is spoken where SI is the working system. A single global default had to be wrong for one of those
  two groups. Per-page was rejected because two pages in one session could then disagree.
  **Known limitation, deliberately accepted:** "English" is not "United States" — a visitor in the
  UK, Australia, India, Ireland, New Zealand, Nigeria or South Africa works in SI but reads English
  and lands on US units. Fixing it means reading the region subtag (`en-GB` vs `en-US`) from
  Accept-Language instead of the app's normalised two-letter code, and **one exception to the
  two-letter code the entire language system is built on is worse than one imperfect default**. Those
  visitors get a correct page, one click from right.
  **This was free to do because Task 164 had already made every default preset-aware** — no number on
  any page needed changing. Verified end to end: `?lang=en` opens Manning Pipe Flow at an 18 in pipe
  in in/cfs/psi, `?lang=es|fr|sw|hi` at 450 mm in mm/m³s/mH₂O, every velocity check passes in both,
  and the JS-seeded sample rows on Branched Network and Irrigation Pressure follow the language too.

- 0|164|[CC] **Realistic defaults on every calculator, and per-preset default declarations —
  DONE 2026-07-28.** Opened when Task 162 closed with faithful-but-ugly conversions (Manning Pipe
  Flow opening at d₀ = 39.4 in); Tom asked for a best effort across all pages the same day, so it
  closed the same day rather than waiting for his own pass.
  **Two mechanism changes were needed before any number could be chosen.** (1) A default is
  expressed in the *displayed* unit, so one number cannot serve both presets — under SI,
  Hazen-Williams' `6` reads as 6 mm. Declarations now accept
  `'default' => Array('us' => '6', 'si' => '150')`, resolved by `ecDefaultValue()`. **This decouples
  every number from the choice of default preset**, so Task 165 can be decided either way without
  reworking anything. (2) A `roughness` family split from `distance_small`, because US practice
  quotes absolute roughness ε in **feet** (0.0005 ft commercial steel), not inches — the
  split-on-different-defaults rule doing its job.
  **45 defaults across 12 pages replaced with deliberate design cases**, e.g. Manning Pipe Flow at an
  18 in concrete pipe (n 0.013) on 0.5% grade flowing half full → v = 4.2 ft/s, Q = 3.7 cfs; Manning
  Trap at a 4 ft-bottom 2:1 earthen canal → v = 2.17 ft/s, Fr 0.33; Orifice Drain Time at a 39.6-hour
  pond drawdown. **Every velocity check passes on arrival in both presets** — verified by running
  each page's real `pageCalculator` against its own rendered HTML through a stub DOM, not by
  inspection.
  **Three defects exposed by actually running the pages, all fixed:**
  1. **Orifice Drain Time has always opened on an invalid case** — its guard needs the ending water
     level above the orifice *top* (`h2 >= d/2`) and the page shipped `h2_elev = 0` with the centroid
     also at 0, so it rendered **zeros and a NaN** on arrival. **This predates Task 162** and is a
     plausible cause of its 0% used-of-human. Now opens on a real drawdown.
  2. **`rc_crest_radius` sat in `distance_small`**, rendering an 8 m crest radius as **317 inches**.
     Moved to `distance_medium`.
  3. **The JS-seeded sample rows on Branched Network and Irrigation Pressure were hard-coded metric**
     and would have been read in US units — Branched Network's sample main became a **100-inch
     pipe**. Both now carry one seed set per preset via a new `EngCalcs.defaultUnitSet`.
  **Judgment calls open to reversal:** Manning Trap side slopes 4:1 → 2:1 and n 0.03 → 0.025 (at 0.03
  the page opened on a *failing* velocity check); Manning Pipe Flow and Manning Pipe Head Loss
  n 0.01 → 0.013, matching their storm-drain audience. Full table: `dev/unit-families.md`.

- 0|162|[CC] **Unit presets rebuilt on named unit families — DONE 2026-07-28.** Replaces the
  three-architecture (A/B/C) framing the task carried; the built design is Tom's array-splitting
  instinct taken to its logical end, and it is neither A, B nor C as originally sketched.
  **The mechanism.** `'units' => Array('m','mm','ft','in')` became `'units' => 'distance_small'` — a
  **named family** defined once in `lib/Units.lib.php`, carrying both the option list and the
  identity a preset keys on. Presets are `family → unit` maps. **No new field key was needed**: the
  existing `units` key just takes a name instead of an array, which is why the `role` attribute
  proposed in review was dropped.
  **Why named families rather than simply splitting the arrays** (Tom's first proposal, and the
  better instinct): splitting works where the split lists are disjoint in the units a preset names —
  diameter `[mm, in]` vs length `[m, ft]`. It fails on the head family, where line pressure, EGL/HGL
  and losses all legitimately want the same units offered. Naming the family lets several families
  share one option list, which is exactly what content-splitting cannot express.
  **The rule that came out of it, worth keeping:** *split a family when two fields want different
  defaults, not when they want different options.* `distance_small` and `distance_large` offer the
  identical four units and exist purely to carry different defaults — merging them would re-create
  the 12,000-inch defect, because one family can only name one default.
  **Both original defects are structurally gone, not merely patched.** Per-family lookup fixes the
  overwrite (each select is assigned the one unit its family names, so nothing can overwrite
  anything); named families fix the length granularity. A third hazard was removed on the way: the
  old matcher compared against **translated label text**, so a translator editing `u_psi` silently
  broke the preset buttons in that language. Matching now uses a `data-unit` attribute.
  **Scope: 25 families, 174 field declarations + 32 row-table selects across 13 pages, zero inline
  unit arrays left.** Verified rather than assumed — option lists diffed field-by-field against git
  HEAD (154 unchanged, 20 changed and all 20 intended), every rendered select on every page carries a
  family and a marked default, and both presets were simulated against the rendered HTML to confirm
  **exactly one selection per select on all 13 pages**.
  **Two defects found during the work, both fixed:** the 32 repeating-row selects (Manning
  Irregular's points, Branched Network's nodes, Irrigation Pressure's laterals) call
  `echoUnitSelect()` directly and would have **ignored the preset buttons entirely**, leaving table
  columns in metric; and a stored cookie holding a unit that no longer exists left `selectedIndex` at
  −1 and silently broke every calculation on the page, so `js/Cookies.lib.js` now falls back to the
  server-rendered default (a guard worth having independent of this task).
  **Defaults were converted, not relabelled.** A page's `default` number is expressed in the
  displayed unit, so switching the initial preset to US changed what all 49 affected defaults *mean*
  — Hazen-Williams would have opened at 1 gpm through a 1-inch pipe. Each was converted to preserve
  its physical value, then rounded to 3 significant figures. **Hazen-Williams additionally got Tom's
  numbers** (6 in, 400 gpm, 1,000 ft, C = 130), verified numerically: v = 4.54 ft/s, inside the
  velocity check band, and h_f = 13.59 ft H₂O ≈ 5.9 psi, cross-checked to within 1.7% against the
  independent US-customary Hazen-Williams form. **The other 12 pages' defaults are faithful but
  unpolished — extracted as Task 164**, since rounding them is engineering judgment Tom offered to
  do himself.
  **Buttons: four (m/mm/ft/in) became two (US/SI), shipped in the same change rather than deferred.**
  Phase 1 would have made the old labels lie *worse* than before — "in" would set diameter to inches,
  length to feet and loss to psi — so relabelling was a correctness requirement, not phase-2 polish.
  `calc_units_us` and `calc_units_si` were seeded as English in all 27 files (+52 payload delta) for
  the next sprint. Tips were dropped as unnecessary; four Large/Small buttons were rejected because
  the size axis is now carried by which family each page names.
  **US is the default preset for first-time visitors** (Tom's call, overriding the Task 144 caution
  about a possible metric Latin American segment). Cheap to revisit: it is one constant,
  `EC_DEFAULT_UNIT_SET` in `lib/Units.lib.php`, and returning visitors are unaffected because the
  cookie stores each select's option *value*.
  Full design record, per-field rationale and the conversion table: `dev/unit-families.md`.

- 0|161|[CC] **Payload-delta false positives eliminated — DONE 2026-07-28.** The delta could never
  reach zero because `generate_translation_payloads.php` counted any key byte-identical to English
  as untranslated, which is permanently wrong for 15 keys: **symbols** (`dw_roughness`,
  `ip_length`, `ip_diameter`, `ip_roughness`, `ip_hf`, `ip_hm`, `bpn_id`), **eponyms**
  (`bpn_method_hw`, `bpn_method_dw`, `bpn_method_manning`), **brands** (`install_android_heading`,
  `install_ios_heading`), and **coincidental cognates** (`dw_regime_laminar`, `or_shape_circular`,
  `or_shape_rectangular`).
  **Result: the suite-wide delta fell from 341 to 68, and six languages (bg, es, ru, tr, uk, zh) now
  read exactly zero for the first time.** That zero is now worth reading.
  **What was built:**
  - `dev/scripts/translation_exempt_keys.json` — the classification, one entry per key with a
    category and a written reason, so no future session re-derives it by hand.
  - `dev/scripts/exempt_keys.inc.php` — shared loader (`ecLoadExemptMap`,
    `ecIsExemptFromEnglishEquality`, `ecIsUniversalKey`).
  **Two design decisions worth keeping:**
  1. **The `$ec_lang_intent` `symbol` tag was rejected as the exemption source** — the task offered
     it as one of two options and it does not work. `symbol` means *"keep the symbols inside this
     string intact"*, not *"this whole string is a symbol"*: `ip_notes_1_def`, `ip_notes_2_def` and
     `wi_notes_we_def` carry the tag and are full prose that must be translated. Only 2 of the 7
     symbol-only keys (`ip_hf`, `ip_hm`) even carry it. An explicit list is the honest mechanism.
     Recorded so the idea is not re-proposed as an obvious improvement later.
  2. **Cognates are exempted per-language, not globally.** `dw_regime_laminar` is exempt only for
     de/es/id/pt/ro; `or_shape_circular` only for es/pt; `or_shape_rectangular` only for es. A global
     exemption would have hidden a genuinely untranslated "Circular" in an unrelated script. A
     language added later is reported until someone confirms the cognate holds — which is the
     correct default.
  **Exemption never suppresses a missing or blank value** — verified empirically, not by reading the
  code: blanking `bpn_id` in `lang.ec.zh.php` reported `reason=blank`, deleting it reported
  `reason=missing`, and the file was restored clean. The `--check` freshness gate was extended to
  treat the exempt list as an input and was confirmed to print STALE when it post-dates the payloads.
  **Scope note — three sibling scripts were fixed too, beyond the task's literal wording.** The task
  named only the generator, but `lang_parity_check.php`, `translation_completion_matrix.php` and
  `lang_syntax_validate.php` each recomputed the same "untranslated" number independently and would
  have kept contradicting it. All four now share `exempt_keys.inc.php`, and the first three report
  **identical per-language counts**. Doing this also required moving the generator's `u_`/`mi_`
  universal-key heuristic into the shared include: the parity checker had never had it, so its
  headline `equal_to_english` was **1237** against the generator's 68 — the same "which number do I
  trust" defect this task exists to remove. Parity now reports 68 with 1468 separately labelled
  `exempt_identical`, and `--strict` becomes usable for the first time.
  `lang_syntax_validate.php`'s `identical-to-english` warnings fell 181 → 60 (it stays lower than 68
  by its own documented ≥4-letter-word filter, plus it does not entity-normalize before comparing).
  **Follow-up logged as Task 163** (validator blind to double-quoted assignments), found incidentally
  during this work.

- 0|159|[CC] **Translation debt resync sprint — 26 languages, DONE 2026-07-28.** Authorized by Tom
  in-session. Created earlier the same day when Tom asked whether translation debt was tracked
  anywhere and it was not; closed the same day.
  **Scope: 5 keys × 26 languages.** Three stale resyncs — `ip_max_head` (Task 142 label head →
  pressure), `mpf_note_1` and `mphl_note_1` (Task 152 HY-8 link + outlet-control item) — plus two new
  keys, `index_meta_desc_plain` (Task 157) and `mpf_sewer_ref` (Task 151).
  **Method:** explicit-key-slice sprint, 26 Sonnet agents, one per language, driven off a
  hand-specified key list rather than the payload delta (which is blind to stale-but-present keys).
  The pre-sprint gate was run: payloads regenerated, `--check` returned FRESH and exit 0.
  **Result: all 26 pass independent verification.** Not the agents' self-reports — CC re-checked every
  file directly for key presence, tag-set parity against English, entity leakage, tags in the
  plain-text meta key, href survival, link counts, and residual English. `php -l` clean on all 26;
  `lang_syntax_validate.php` across all 27 files shows **zero hard findings** (181
  `identical-to-english`, all advisory and expected — see Task 161).
  **The Task 142 terminology decision landed in every language.** All 26 moved off the head word onto
  a genuine pressure term (Presión / Pression / давление / ضغط / Druck / 压力 / दाब / basınç /
  tekanan kerja / тиск / налягане / tlak / притисак / فشار / shinikizo / …). None calqued the English;
  none drifted into a stress or material-strength sense, which was the specific risk the glossary
  flagged. **Glossary write-back done in the same session** — `pressure rating` and `maximum allowable
  head` now carry all 26 new labels, replacing the stale head-era values a translating agent correctly
  flagged as still wrong. Drift manifest re-baselined (`--update`): **debt is zero.**
  **Three process lessons, recorded because each cost something:**
  1. **CC under-launched: 20 agents for 26 languages**, missing the six low-resource ones (am, bn, km,
     my, ps, sw). Nothing was lost — they were launched in a second wave — but the sprint took two
     launches. Count the language list against `lib/Language.Settings.php` before spawning.
  2. **The session-limit retry rule paid off again.** Two agents (km, my) reported *failed* — one on a
     session limit, one on a stalled stream. Per the standing rule, CC checked the files before
     relaunching: `my` needed only one key, `km` needed three, and neither needed the full 20-key
     prompt re-run. Two narrow finishing agents closed them. **Never relaunch a "failed" translation
     agent without diffing its file first.**
  3. **A JSON write-back can silently reformat the whole glossary.** CC's first write-back re-encoded
     `glossary.json` with `JSON_PRETTY_PRINT` (4-space) against the file's own 2-space convention,
     producing a 2,612-line diff that buried the 4 lines of real change. Fixed by re-indenting.
     **Any script that rewrites `glossary.json` must halve `JSON_PRETTY_PRINT`'s indentation.**
  **Extracted, not left inside this block:** the payload delta's permanent false-positive floor is
  **Task 161**.

- 0|151|[CC] **Sewer-slope demand: the doc was findable all along; the real gaps were SI units,
  no meta description, and no back-link — DONE 2026-07-28.**
  **The task's own headline was wrong, and Tom corrected it 2026-07-28: `sewslope.php` is *not*
  unfindable.** Google sends users straight to it — that is where the ~950 impressions across 169
  slope/grade queries come from. The 0.5% CTR was read as a discovery failure; it is better read as
  a *satisfaction* failure, because the page ranked, got seen, and did not get clicked. Everything
  else in the task survived that correction, which is why it still had meat.
  **Shipped (all in `/var/www/cnm/public_html/hawsedc/`, outside this repo — Tom uploads to deploy):**
  - `hawsedc.lib.php` — `echoHawsEDCHeader()` gained an optional second parameter
    `$description = ''`, emitting `<meta name="description">` only when non-empty. Backward
    compatible: every other parent-site page still calling it with one argument is untouched.
  - `sewslope.php` — real meta description; **Table 1 rebuilt with SI**: added a pipe-diameter mm
    column (100–2400 mm, rounded in the same style Table 2 already used) and expressed the same
    minimum slope in three forms side by side — ratio (m/m or ft/ft), **mm/m**, and **percent**.
    Added a "note on slope units" paragraph under Table 2 explaining that slope is a dimensionless
    ratio, so the number is identical in feet and meters; ×1000 gives mm/m, ×100 gives percent.
  - `peakfact.php` — real meta description naming the Harmon formula and the original 10–300 person
    UPC-derived low-flow research.
  - **Back-link added** (`Manning-Pipe-Flow.php` + new `mpf_sewer_ref` key): MPF now points at both
    `/sewslope.php` and `/peakfact.php`, closing the one-directional link the task identified. This
    is the single highest-leverage placement available — MPF carries 2,721 human views, 67% of the
    suite's entire human audience.
  **A correction to the task's premise: Table 2 already had mm diameters.** The "inches-only" claim
  was true of Table 1 only. What no table had, and what the top query (`4 inch sewer pipe minimum
  slope **in mm**`, 135 impressions) actually wants, is the **slope** in a millimeter form — hence
  mm/m rather than only a diameter column.
  **Still open, deliberately not done:** the doc is English-only while the demand is not (`pendiente
  mínima tubería pvc sanitaria`, `kanalizasyon eğim tablosu`, `tabela de inclinação de esgoto`).
  Translating a parent-site tech doc is a different project from the engcalcs translation pipeline
  and was not in scope; the SI columns at least make the tables *readable* to a metric engineer in
  any language, since numbers need no translation. **Extracted to Task 158.**
  **Not done, by standing policy:** no sewer-slope calculator was built — that would duplicate
  parent-site content.

- 0|157|[CC] **`index.php` now has a real meta description — DONE 2026-07-28.**
  The suite's front door was the one page Task 150's reuse trick could not cover, because its only
  candidate key (`index_title`) *is* the title, and pointing at it would have reinstated the exact
  duplicate-of-title defect Task 150 removed. It emitted nothing, leaving Google to auto-generate a
  snippet from a page that is nothing but a menu of links.
  **Decision taken (the task asked for it explicitly): yes, one bespoke key is warranted here.** The
  standing rule is reuse-or-nothing; this is the deliberate, single exception, on the page where a
  description carries the most weight. Cost is 1 key × 26 = 26 strings riding the normal payload
  delta — two orders of magnitude below the 520-string per-page scheme rejected 2026-07-28.
  **Shipped:** `index_meta_desc_plain` = "Free hydraulic engineering calculators for pipes, channels,
  weirs and irrigation. They run in your browser, work offline, and are available in 27 languages."
  Simple English, 154 characters, no tags, no entities. `index.php` sets `$html_desc` from it.
  Verified: `lang_syntax_validate.php` clean, `--rule-c` reports no name/derivation disagreement (so
  `plainTextBoundKeys()` correctly picked the `_plain` key up from the `$html_desc` assignment), and
  the rendered page emits the tag.

- 0|142|[CC] **`ip_max_head` label vs. tip mismatch — resolved on PRESSURE — DONE 2026-07-28.**
  The label read "Max. allow. pipe **head**" while its own tip read "Lines whose **pressure**
  exceeds this value are flagged."
  **Decision: Tom, 2026-07-28 — change the LABEL to pressure, not the tip to head.** `ip_max_head` is
  now **"Max. allow. pipe pressure"**; the tip is unchanged, so exactly **one** key stales.
  **CC initially recommended the opposite and was overruled**, on the strength of two prior glossary
  notes (2026-07-24, 2026-07-27) recording "keep it dimensionally a head" and confirming all 26
  translations had been built that way. Tom's call stands on better ground: a pipe **pressure
  rating** is how irrigation designers actually specify this limit (PVC class 160, PN 10), and the
  field already offers psi/kPa/bar alongside mH2O/ftH2O — so the label now matches both the trade's
  vocabulary and what the user is most likely to type.
  **Scope of the override, recorded precisely:** the underlying quantity and its unit list are
  **unchanged**. Only this label's English noun changed. The head-vs-pressure guard in the root
  `head` glossary entry's `avoid` array still holds everywhere else in the suite.
  **Glossary write-back done in the same session (v1.18 → v1.19)**, per the mandatory-write-back
  rule: both `maximum allowable head` and `pressure rating` carry a dated note stating the decision,
  that it supersedes the earlier framing *for this label only*, that all 26 translations are now
  stale for this key, and that translators should use their own language's natural pipe
  pressure-rating term (pressure class, PN rating) rather than calquing the English.

- 0|152|[CC] **HY-8 itself is now linked from both culvert-adjacent notes — DONE 2026-07-28.**
  Both `mpf_note_1` and `mphl_note_1` named HY-8 in text while linking only to the 2-minute tutorial
  video. Both now link the program itself at the FHWA page
  (`https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/` — verified live, HTTP 200), styled
  as "HY-8, the free culvert program from the U.S. Federal Highway Administration" so the link says
  what it is rather than assuming the reader knows.
  **The honest scope sentence the task asked for** was added to `mphl_note_1` as a fourth item: "This
  page solves the outlet control case only: a pipe flowing full, where the downstream conditions set
  the head. Culvert design is the job of deciding whether inlet control or outlet control governs, so
  use HY-8 whenever either one could."
  **Ride-along fix:** both notes opened a `<dl>` and never closed it. Closing it inside the language
  string would have staled 26 translations for a markup bug, so the `</dl>` is emitted by
  `Manning-Pipe-Flow.php` and `Manning-Pipe-Head-Loss.php` instead — zero translation cost.
  **Decision reaffirmed, not reopened: no culvert calculator.** (Reach is 66 impressions; `mphl_` is
  only *like* a culvert calculator in outlet control, and shipping outlet-control-only would disagree
  with HY-8 exactly where a designer most needs to be right.)
  **Cost incurred: 2 keys × 26 languages stale** (`mpf_note_1`, `mphl_note_1`) — a resync, not a
  sprint. Tracked by the drift tripwire and rolled into Task 159.

- 0|154|[CC] **Turkish ASCII-fold scan — tr is clean; no fold found in any language — DONE
  2026-07-28.**
  **Method: deterministic self-evidence, not an agent pass.** Rather than the Sonnet read the task
  proposed, CC wrote a scanner keyed on a fact that needs no dictionary: **if the same word appears
  in the same file both with and without its diacritics, the bare form is a fold.** Ran it over all
  ten diacritic-bearing lang files (tr, ro, hr, cs, sr, pt, es, de, fr, it).
  **Result for tr — clean.** Four candidates, all verified false positives, all correct as shipped:
  `kotu` (×22) is *kot* "elevation" + suffix, a real surveying term, not `kötü` "bad"; `Islak`
  (`mpf_wetted_perimeter`) is the correct **dotless-I** capitalization of `ıslak`; `Bas.` (`ip_press`)
  is a correct truncation of `Basınç`, not `baş`. A second, independent probe for ~40 common Turkish
  words that always carry a diacritic (`için`, `değer`, `yüksek`, `çap`, `akış`, `basınç`, …) found
  **zero** ASCII-folded occurrences. **The `template_feedback` string fixed during Task 153 was the
  only instance in the file.**
  **Other languages: no confirmed fold either, but the method cannot close the question there.** In
  Romance and Slavic files the signal is swamped by legitimate homographs where the unaccented form
  is its own real word — es `que`/`qué` and `esta`/`está`, ro `baza` (definite article) vs `bază`,
  cs `plocha` (noun) vs `plochá` (adjective), fr `base`/`basé`. Precision is high for Turkish
  (diacritics are not optional there) and low for these, so a clean tr result is meaningful while a
  ro/cs candidate list is not evidence of a defect. hr, sr and it returned zero candidates outright.
  **One real, non-fold finding in tr, left unfixed on purpose:** the file disagrees with itself on
  vowel harmony for the app name — `EngCalcs'i` (3×: `install_main_title`, `install_desktop_steps_html`,
  `install_cached_body`) vs `EngCalcs'ı` (1×). One of the two is wrong, but which depends on how a
  Turkish speaker vocalizes "EngCalcs", and CC will not guess a native phonological judgment to
  change three shipped strings. **Extracted to Task 160.**
  **`QUALITY` unchanged for tr** — the scan found no defect, so there is nothing to lower it for, and
  a clean automated scan is not grounds to raise it either.

- 0|150|[CC] **Every page's meta description was just its own title repeated — DONE 2026-07-28.**
  All 21 pages that carried a description built `$html_head` with
  `<meta name="Description" content="'. $html_title .'" />`. Google routinely discards a
  duplicate-of-title description and auto-generates a snippet instead — from a page whose visible
  content above the fold is a form, not prose.
  **What shipped: reuse, not new strings.** 19 pages now point `$html_desc` at their own existing
  `<prefix>_main_desc` — a key that is already written, already translated into all 26 languages, and
  already distinct from the title ("Free Online Manning Pipe Flow Calculator" vs "Manning Formula
  Uniform Pipe Flow at Given Slope and Depth"). The defect is fixed **in every language today at zero
  translation cost**. `Orifice-Drain-Time-Ref.php` keeps a literal English string, being an
  English-only reference page with no language switcher.
  **This task was first built the expensive way, and Tom caught it (2026-07-28).** The original
  implementation wrote 20 purpose-authored `*_meta_desc_plain` keys (98–151 characters of prose:
  what the calculator finds, then what the user enters) and seeded all 27 lang files, which pushed
  the standing translation delta from **365 strings to 885** — avg 14 per language to 34, i.e. +520
  strings, roughly tripling it. His question was the right one: *why new descriptions when
  descriptions already exist?* The prose does read better as a search snippet, but that is an
  incremental SEO gain bought with a full extra sprint's worth of translation, and it was never put
  to him as a trade before the strings were written. Reverted in full; delta measured back at
  exactly 365. **The standing rule is now reuse-or-nothing, recorded in `CLAUDE.md`** — weigh any
  future "let's write real descriptions" proposal against that same arithmetic before starting.
  **Emission moved into `echoHTMLHead()`**, on the Task 149 precedent: a page sets the global
  `$html_desc` before `echoHeader()`, and the one function every page's `<head>` passes through does
  the escaping. Three consequences worth keeping. (1) The 12 pages that had been interpolating
  `$html_title` **unescaped** are now escaped by construction, not by remembering. (2) A new
  calculator gets the tag right for free — the recipe is one line, documented in `CLAUDE.md`. (3) The
  tag is emitted **only when non-empty**, so `index.php`, `contact.php`, `Compare-Languages.php`, and
  `formmailsuccess.php` correctly have none: repeating the title is worse than silence, so a page
  with nothing real to say says nothing. `index.php` is the one place that genuinely costs something
  — **extracted as Task 157**, a 26-string exception, rather than left as a loose end here.
  **`plainTextBoundKeys()` gained a derivation rule for the `$html_desc` assignment**, so whatever
  key a page points at is held to Rule A (no entities) and Rule B (no tags). It is redundant today —
  every such key is a `*_main_desc`, already bound via `Menus.lib.php`'s `title=""` — and kept
  precisely for the day a page points `$html_desc` somewhere new. Rule C's advisory count went
  **29 → 31**: `about_main_desc` and `install_main_desc` are the two `_main_desc` keys whose menu
  entries carry no `title=`, so nothing derived them until now. Same intentional class as the other
  16 — a `_main_desc` has three destinations at once and no single name fits. Counts updated in
  `CLAUDE.md` and the validator's `--help`.
  **Verified by rendering all 23 pages** in en, and es/ar/ru for the translated path: 19 unique
  descriptions, no duplicates, none repeating its own title, none empty where one was expected.
  **Partially done 2026-07-27 (unchanged):** the companion `<meta name="Keywords">` tags were deleted
  from all 20 pages that carried them (Tom: "Once upon a time that was a main purpose of keywords…
  let's modernize"). They were both ignored by search engines and actively wrong — `Manning-Trap.php`
  and `Weir-Flow-Simple.php` carried `"wier vetedero calculacíon…"` (weir keywords on the
  *trapezoidal channel* page, "wier" misspelled), with `pipie`/`tobus` typos elsewhere and
  `&iacute;` HTML entities inside meta content.
  **Unrelated pre-existing finding, not touched:** `formmail.php` does not parse (`php -l`:
  "Unclosed '{' on line 80"). Confirmed present before this task by stashing the change and
  re-linting. Left alone deliberately — it is not a meta-description defect and deserves its own look.

- 0|156|[CC] **`.git` and directory listings were readable over HTTP — closed. DONE 2026-07-28.**
  Found while answering "is `engcalcs/.htaccess` even needed?" during Task 155, not by looking for
  it. Two defects, both now fixed and verified live:
  - **`.git` was fully retrievable.** `/engcalcs/.git/` served a browsable index,
    `.git/refs/heads/master` gave the tip SHA, and `objects/pack/*.pack` downloaded intact (937 KB,
    HTTP 200). **Why the existing guard missed it:** `<FilesMatch "^\.">` matches *filenames*, not
    directories, and `.git`'s contents are named `config`, `HEAD`, `index`, `objects/` — not one of
    them starts with a dot. Production deploys by `git pull`, so `.git` is necessarily present.
    **The real cost was not source disclosure** — the suite is GPL v3 — **it is that `dev/.htaccess`
    deliberately blocks `dev/` over HTTP while the packfiles served the same content anyway**, making
    that block decorative. The reflog also carried committer names and addresses. History was scanned
    for committed credentials: **none** (the `x-api-key` hits are `$apiKey` variable references
    reading from the environment). Fixed with `RedirectMatch 404 "/\.git(/|$)"`.
  - **Directory listings were on** — `/lib/`, `/js/`, `/css/`, `/icons/` each served a full file
    index. Fixed with `Options -Indexes`.
  **Shipped as two commits on purpose** (`c089fc9`, then `a012927`), pulled and verified separately.
  `RedirectMatch` is mod_alias, the same override level as the `Redirect 301` rules already working
  in the file, so it was known-safe. **`Options` is not** — it needs `AllowOverride Options`, a
  separate grant, and where that is missing Apache returns **500 for every request under
  `/engcalcs/`** rather than ignoring the line. **Confirmed granted on this host 2026-07-28**; if the
  site ever moves, re-test that line first and drop it if the new host 500s. Splitting the commits is
  what made the risky half independently revertable.
  **Also assessed and left alone:** the three `Redirect 301` lines for pre-reorg `/engcalcs/lib/`
  asset paths are **spent** — the reorg was `fe2af01`, 2026-06-16; nothing in the codebase references
  those paths, `sw.js` (v5) precaches only the new ones, and pages are served `no-store, no-cache` so
  no stale HTML points at them. They fire correctly but have nothing left to catch. Harmless to keep,
  safe to delete whenever.

- 0|149|[CC] **Non-English pages were effectively absent from the search index — `hreflang`,
  canonical, and sitemap now emitted. DONE 2026-07-28.** Root cause: one URL served every language,
  chosen at request time by cookie / `Accept-Language` (`lib/Language.lib.php`). `?lang=xx` URLs
  existed (language dropdown, `lib/Menus.lib.php:148`) but **nothing declared them** — no `hreflang`,
  no `canonical`, and `hawsedc.com/sitemap.xml` returned 404. Googlebot crawls from US IPs with
  `Accept-Language: en`, so it indexed the English rendering of every calculator and the other 26
  languages never entered the index — a mission problem (reach), not merely an SEO one. Diagnostic
  signature in the 2026-07-27 Search Console export: `calculo de canales trapezoidal online` ranked
  **position 2.8 with 0% CTR** (34 impressions); `formula de manning` 80 impressions, position 8.8,
  zero clicks — ranking well while converting zero is what a language-mismatched snippet looks like.
  **Decided (Tom, 2026-07-27): `?lang=xx` stays the canonical URL form** rather than `/es/…` paths.
  What shipped:
  - `ec_canonical_url($lang)` in `lib/Language.lib.php`, built from **`SCRIPT_NAME`, not `PHP_SELF`
    or `REQUEST_URI`** — either of those would let a visitor's own URL nominate itself as canonical
    via trailing `PATH_INFO` or arbitrary query junk. Every parameter except `lang` is dropped, which
    also stops `?name=` (the bookmark/share label) from minting an indexable variant per label.
    `/index.php` collapses to the directory URL.
  - `CANONICAL_ORIGIN` in `lib/config.inc.php` — **deliberately not `$_SERVER['HTTP_HOST']`**, which
    is client-supplied: a spoofed `Host` would emit a canonical pointing search engines off-site.
  - `echoHTMLHead()` in `lib/HeadersFooters.lib.php` emits a self-referencing `<link rel="canonical">`
    plus 27 `hreflang` alternates and `x-default`, so all 23 pages got it in one edit and a new
    calculator gets it for free. **`x-default` points at `?lang=en`, not the bare URL**: the bare URL
    is not self-canonical (it canonicalises to whatever it negotiated), and an `x-default` aimed at a
    URL that canonicalises elsewhere is a signal Google may ignore. Naming `?lang=en` for both `en`
    and `x-default` is explicitly permitted.
  - `dev/scripts/generate_sitemap.php` → `../sitemap.xml`, 543 URLs (20 pages × 27 languages + 3
    parent-site pages). Languages are read from `Language.Settings.php`, so adding a language needs no
    second edit. `sewslope.php` and `peakfact.php` are included on purpose — Task 151's "no sitemap
    entry" defect, fixed here. The sitemap does **not** repeat the hreflang set as `xhtml:link`; the
    HTML head already carries it, and repeating it would multiply the file ~27× for no added signal.
  Verified by rendering against a local PHP server: `?lang=es` self-canonicalises, `?name=` is
  dropped, `?lang=zz` and the bare URL both consolidate to a valid language, `/engcalcs/index.php`
  collapses to `/engcalcs/`, and the XML parses. **Deploy and verification are Task 155** — nothing
  reaches Google until the sitemap is uploaded, `robots.txt` names it, and Search Console gets it.

- 0|153| **Resync `template_feedback` — 26 languages brought in line with the reformed
  English. DONE 2026-07-28.** The string was `'Please share your valued words of suggestion or praise.  Did this free calculator
  exceed your expectations in every way?'` and is now `'Please send suggestions or praise. Did this
  free calculator serve you well?'`. Rationale: the old wording was flattery-fishing and failed the
  Simple-English rule, and the 26 languages already showed the strain — es and ar had quietly dropped
  "or praise" and softened to "was it useful?", while sw and zh calqued the whole thing literally.
  Tell: `$ec_lang_intent['template_feedback']` had *already* rewritten it to almost exactly the new
  wording, i.e. the intent was doing repair work the source string should have done. Caught by
  `detect_english_drift.php`, which now reports it as the sole CHANGED key. **Also considered and
  rejected:** replacing the ask with "Tell your friends!" evangelism and dropping the Contact link.
  Rejected because (a) the link is the only in-context ask at the moment the user just got their
  answer, and it is the channel that actually paid — `dev/Bulgarian-engineer-feedback.md` exists
  because someone clicked it; menu presence is not equivalent; (b) "friends" reads personal-social in
  most of the 26 target languages while the real sharing act is professional; (c) evangelism is
  unmeasurable and unharvestable where feedback is neither. If a share mechanism is ever wanted, it
  should be a copy-link affordance near the results, not a sentence. **`$ec_lang_intent` for this key
  was emptied** — authorized by Tom in-conversation 2026-07-27; the old intent had become redundant
  with the reformed English, and a plain, directly-translatable label needs no intent entry.
  1 key × 26 languages: a resync, not a sprint.

  **Done inline, not as a sprint.** One short, wholly non-technical sentence with no glossary terms
  and no markup — Opus wrote all 26 directly, so no agents were spawned and no payload regeneration
  was needed. The sprint-authorization rule is about fanning out paid agents; there was nothing to
  fan out.

  **QA run:** `php -l` on all 27 files; `lang_syntax_validate.php` (180 findings, all pre-existing
  advisory `identical-to-english`, none on this key — no entity, tag, or escape findings);
  back-translation of every one of the 26 against the new English. All 26 read back as "send
  suggestions or praise" + "was it useful / did it serve you well" — the flattery clause
  ("exceed your expectations in every way") is gone everywhere, including the es/ar softenings and
  the sw/zh calques the task named. No glossary write-back: the string carries no engineering
  terminology, so there was no terminology decision to memorialize.
  `detect_english_drift.php --update` run; drift now reports CHANGED: none.

  **Found in passing, extracted to Task 154:** the old tr value was ASCII-folded (missing ş/ğ/ı).
  Out of scope here; filed as its own task rather than left inside a closed block.

- 0|148| **`template_welcome`'s `>> ... <<` markers replaced with CSS italics — DONE 2026-07-27.**
  Filed and closed the same day. Tom, on reading the finding: "could use italics `<em>`? instead of
  `>> ____ <<`, I suppose. The symbols are not standard English or typography." Correct on both
  counts, and it makes the divergence moot rather than merely consistent.

  **What was there.** All 27 files wrapped the welcome line in directional markers — English in
  `»`/`«` (Task 140 step 1 converted its `&gt;&gt;` entity), the other 26 in a literal ASCII
  `>> ... <<` that Rule A never touched because it was never an entity.

  **Done as CSS, not `<em>`, for two reasons beyond Tom's typography point.**
  1. **It gets presentation out of the language strings entirely** — the same theme as Task 140
     itself. An `<em>` in the string would have left 27 translators hand-copying markup, which is how
     the markers ended up inconsistent in the first place. The strings now carry only words; the
     emphasis lives in `.ec-welcome` (`css/engcalcs.css`) and the class is added once in
     `lib/HeadersFooters.lib.php`.
  2. **It allows a per-script exception that markup in the string could not express.** Italics are
     applied by default but switched off via `html[lang="…"]` for the 11 languages whose scripts have
     no italic tradition (am, ar, bn, fa, he, hi, km, my, ps, ur, zh) — there the browser can only
     synthesize a slanted face, which reads as a rendering fault rather than as emphasis. Those
     languages lose nothing: the line is already its own paragraph under the `<h1>`.

  This also retires the directional-decoration problem the CSS had already documented once, for
  `.ec-solverline`: a `>>`/`<<` pair has to be mirrored for the five RTL languages, and now nothing
  needs mirroring.

  **QA.** All 27 `php -l` clean; `lang_syntax_validate.php` clean of every structural category.
  Rendered `Manning-Pipe-Flow.php` in en/es/ar/zh and confirmed the markers are gone, the
  `ec-welcome` class is on the paragraph, and the `html[lang="…"]` selector matches the real markup
  (`<html lang="ar" dir="rtl">`). Drift manifest re-baselined — markup-only, no words changed, so no
  language is stale and no resync is owed.

- 0|140| **[DONE 2026-07-27] Get HTML out of language strings where it cannot work, and enforce it mechanically.**
  Produced Rules A–D, which are the durable output and live in **CLAUDE.md § Language Keys** — read
  them there, not here. Enforced by `dev/scripts/lang_syntax_validate.php`. Tom's close: do step 4 +
  enforcement, retire step 2 as superseded by step 1. Full narrative archived.

- 0|147|[CC] **sw `kichwa` → `kimo` head-term conversion finished — DONE 2026-07-27.** Authorized by
  Tom the same day it was filed. Converted all 16 stragglers in `lib/lang.ec.sw.php`:
  `dw_`/`hw_`/`mphl_` `main_menu`+`main_title`+`main_desc`, `mhp_hnet`, `mhp_notes_1_term`,
  `mhp_notes_1_def`, `mhp_notes_3_term`, `odt_h1`, `rc_Hp`, `ip_max_head`. Head loss is now
  "Upotevu wa Kimo" (Title Case in identity strings, lowercase in prose, matching the already-correct
  `mhp_hl_check`); net head is "Kimo halisi", parallel to `mhp_gross_head` "Kimo cha jumla". The file
  now reads `kimo` in all 37 hydraulic uses and `Kichwa` only in
  `template_printable_title`/`_subtitle`, where it correctly means "title/heading".
  **Why a straight word swap was safe:** `kichwa` and `kimo` are both noun class 7, so every
  `cha`/`wa`/`kinacho-` concord marker in the surrounding text stayed valid — no regrammaring needed.
  **QA:** `php -l` clean; `lang_syntax_validate.php --lang=sw` clean of every structural category (7
  advisory `identical-to-english` findings, all pre-existing and unrelated); tag-name parity against
  English verified on all 16; and each string back-translated to English inline (no `ANTHROPIC_API_KEY`
  here, so the orchestrator does the check rather than logging it skipped). Two apparent tag mismatches
  were a naive-regex artifact of Rule A: `rc_Hp`'s `&gt;` is now a literal `>` inside a `title="…"`.
  Checked with a real parser (`DOMDocument`) rather than dismissed — the attribute reads back intact
  with zero libxml errors, confirming the Task 140 step-1 judgment that `>` is safe in a quoted
  attribute value. Glossary `head` entry updated with the completion per the mandatory write-back rule.
  **Left deliberately alone:** `rc_Hp` keeps `bwawa` for "weir", matching its already-converted sibling
  `rc_notes_7_def`; the `ws_`/`wi_` `kizingiti` standardization is a separate concern, not this task.
  **Lesson worth keeping:** the 2026-07-22 glossary note *listed the keys it changed*, which reads as
  completion but was a partial pass — a terminology decision is not applied until someone greps the
  whole file for the rejected term.

- 0|139|[CC] **Points-data copy/paste on Irrigation-Pressure (`ip_`) — DONE 2026-07-27.** Diagnosed
  and fixed the same day Tom asked. Root cause was exactly the "wrong singleton count" the task
  predicted, off by one: `js/irrigation-pressure.js` declared `dataSingletonsCount = 14` while the
  form renders **15** INPUT elements above the reach table — `h_max_allow` was added later without
  bumping the count (its comment still read "the 12 form inputs"). Effect: Copy emitted a grid
  shifted one cell left (leading with `40`, h_max_allow's own value, and dropping the last row's
  `elev_ds`), and Paste wrote that shift straight back into the form. Reproduced and verified with
  the Node harness the task specified (eval `Cookies.lib.js` + `global.EngCalcs=EngCalcs;`), driving
  a cookie built in real `form.elements` order: at 14 the round-trip fails, at 15 it is byte-identical.
  **Second, unasked-for find — `bpn_` had the same defect, worse.** A generic check (render each page,
  count INPUTs before `id="CalcsBody"`, compare to the declared constant) cleared Manning-Irregular
  and Weir-Flow-Irregular but flagged Branched-Network at **declared 9 vs actual 11** — `h_max_allow`
  *and* `demand_mult` were both added after the count was written, and a stale 5-singleton comment
  from an earlier layout was still sitting above the live one. Fixed to 11 and verified by the same
  round-trip. So the Task 137 note that bpn's copy/paste "works" was true when written and had since
  rotted. Both comments now state the invariant (count INPUTs only — unit SELECTs are `s:` slots and
  never reach the input counter) and warn that adding a singleton input means bumping the number.
  **Worth keeping:** this bug is silent and recurs every time a field is added above a row table.
  The render-and-count check is three lines of throwaway script; a permanent version belongs in
  `dev/scripts/` if it bites a third time.

- 0|141| **Check whether `Kichwa` (sw) and `الرأس` (ar) are really the hydraulic-head term — CLOSED
  2026-07-27 as already answered.** Tom, 2026-07-27: "I believe it's stale. We already determined
  that the answer is 'No'." Confirmed against the record — the determination predates the task by
  five days. The sw half was settled **2026-07-22** (glossary `head` `translation_notes`, Tom +
  Kenya-engineer input): `kichwa` is the body-part word and NOT the Swahili engineering term for
  hydraulic head; `kimo` is, anchored by `kimo cha kasi` already being the accepted term for velocity
  head. The ar half is settled by the **Task 128 resolution (2026-07-21)**: the blanket
  `avoid: anatomical "head"` guard was itself the mistake, and an anatomically-derived word that IS
  the dominant local standard is explicitly correct (English "head" is itself the body-part word) —
  so `الرأس` needs no change under defer-to-cultural-standard. No native check is owed on either.
  **Closing this surfaced real unfinished work, extracted to Task 147:** the 2026-07-22 sw decision
  was only applied to the seven keys it named, leaving 16 keys still on `kichwa` against 15 on
  `kimo`. The question is closed; the cleanup is not.
  **Original text follows.** **Scope corrected 2026-07-27 (Tom): an
  earlier version of this entry claimed a 7-of-26 head-term inconsistency by comparing each language's
  `ip_max_head` (pipe pressure head) against `ws_headWaterHeight` (weir head). That baseline was
  wrong — those are different quantities and SHOULD differ; weir head is the depth over the crest, so
  he `עומק`, de `Überfallhöhe`, cs `Přepadová výška` are all correct. That finding is withdrawn; the
  head terminology was already settled and stays settled.**
  What remains is one small question, not a defect list: Swahili uses `Kichwa` — the ordinary word for
  the body part — as the hydraulic-head term in the `dw_`/`mhp_` strings, and the sprint's new
  `ip_max_head` followed that incumbent for consistency. Arabic's `ws_headWaterHeight` uses `الرأس`
  the same way. In many languages the body-part word IS the standard hydraulic term (English "head"
  is itself exactly this), so this may be entirely correct. Worth one native or high-confidence check
  for those two languages only — **do not bulk-rewrite, and do not re-open the other 24.**

- 0|143|[CC] **Move the solver control into the depth label on `mtc_` and `mpf_` — DONE 2026-07-27.**
  Requested by Tom 2026-07-27 and built the same day (commit `b3fd396`). The "solve for depth given
  Q" control was a banner above the form, separated from the field it writes into by the units row
  and several inputs; it now sits on the second line of that field's own label (`dd0` on
  Manning-Pipe-Flow, `y` on Manning-Trap), so the thing you are solving for and the control that
  solves it are one element. Feasible as hoped — the label markup already carried links, tips,
  radios and a second number input on `mtc_`, and the narrow-column constraint governs the
  *results* table, not the inputs column.
  Shipped:
  - `echoCalculatorForm()` inputs take an optional `'control'` key, rendered **after** `</label>`.
    This also fixes a pre-existing wart: `mtc_`'s radio groups had been nesting form controls
    (and nested `<label>`s) inside `<label for=…>`.
  - `solverControlHtml()` in `lib/Calculators.lib.php` holds the shared control, rendering
    `[Solve] for Flow, Q = __ [units]`. Same `solver_q` / `solver_qu` / `solver_msg` ids, so
    **no solver JS logic changed**.
  - `.ec-solverline` is deliberately plain — no rule, no indent glyph. An arrow glyph would have
    needed RTL mirroring, and the original `line-height: 2` was being inherited by the Q input and
    inflating its height.
  - **One new key, `mpf_solve_for_flow`** (`"for Flow, Q ="`), translated into all 26 languages.
    The connective is one whole key, never a preposition composed with a separate noun at render
    time, so word order and case agreement stayed the translator's to decide — case-governed
    prepositions inflect (ru `для расхода`, uk `для витрати`, cs/hr/sr accusative) and
    postpositions go where they belong (tr `debi için`, my/ur/hi/ps). Every language reuses its own
    glossary `flow` term, verified mechanically. `=` was chosen over `:` (Tom): it says only "here
    comes a value", and unlike a colon it needs no per-language typographic convention.
  - Four keys retired from all 27 files — `mpf_solve_desc`, `mtc_solve_desc`, `mpf_solve_for_dd0`,
    `mtc_solve_for_y`. Neither depth label had a tip before the change and neither has one now; an
    interim attempt to rehome the banner's prose in a label tip was rejected (Tom) as both wrong
    for the content and unnecessary once the solver is targeted.
  - **Cookie format bumped to v2 on both pages.** Non-obvious and the main risk in the task: moving
    the control inside the form makes its Q input and units select form elements holding two
    *positional* cookie slots, so an unmigrated v1 cookie would fail the slot-count guard in
    `cookieToForm` and silently reset every returning visitor's saved inputs — on two of the three
    highest-reach calculators. `insertSolverCookieSlots()` in `js/Cookies.lib.js` splices the slots
    in at page defaults (`solver_q` is INPUT #6 on MPF, #11 on MTC — the `n_radio` buttons count).
    Side effect, benign: the target Q now persists like any other field.
  QA: `lang_syntax_validate.php` clean of the new key; `php -l` clean on all 27 files; payloads
  regenerated and `--check` FRESH; drift manifest re-baselined; back-translation checked inline per
  language. **Glossary needed no write-back** — the `flow` entry already carried all 26 terms and no
  new terminology decision was made.

- 0|138|[CC] **Optimize suite-wide "Related calculators" links — DONE 2026-07-27.** Re-scoped from a
  full cross-cutting graph pass to a handful of links, on the evidence of the 2026-07-27 usage
  snapshot (`dev/usage-data-log.md`). Findings that drove it: only 4 of 15 calculator pages carried a
  Related line at all and **no link was reciprocated** (all 11 targets were dead ends); human views
  are extremely concentrated (**MPF alone = 67% of all human views; MPF + HW + MTC = 92%**), so a
  link on a long-tail page is seen by 6–17 humans; and the combined downstream traffic of MPF's four
  existing outbound links is ≤3.6% of MPF's own, so re-curation has small expected yield regardless.
  **Reciprocity was explicitly rejected** (Tom): it would spend 11 page edits placing links in front
  of a rounding error. Links are only worth adding where the humans already are.
  Shipped — three pages, five links, no new `$ec_lang` keys and therefore **no translation work**:
  - `Hazen-Williams.php` — added Manning-Pipe-Flow and Branched-Network (kept DW, MPHL). The one real
    opportunity: 580 humans converting at 11%, previously offered only the suite's two *least*
    trafficked pipe pages. MPF converts at 67%; BPN does HW loss natively. See Task 144.
  - `Manning-Trap.php` — added Manning-Pipe-Flow (kept MI, RC, CS). Both Manning open-channel; low
    stakes, and MPF needs no promotion (Tom) — it is for the MTC visitor's benefit, not MPF's.
  - `Irrigation-Pressure.php` — new Related line: Branched-Network, Manning-Pipe-Flow. Justified by
    the **dead end in the suite's highest-value flow**, not by IP's own 46 humans: MPF actively feeds
    IP, IP converts at 4%, and there was no onward path. IP (main/lateral pressure, DU) and BPN
    (branched fixed-demand network) are the same person's problem at different scales.
  - Every other page deliberately left unchanged; MPF's own line left alone (already a reasonable
    length, and its links are the long tail's only distribution channel).
  **IP's 4% remains un-diagnosed** — the tempting "broken copy/paste" explanation (Task 139) was
  tested and rejected by Tom: Paste is indeed broken but only a rare, experienced user touches that
  area, far too few to explain 44 of 46 visitors not calculating.
- 0|137|[CC] **Branched (distributary) pipe network calculator — DONE 2026-07-27.** A quick, easy pressure/flow
  calculator for distributary (dendritic/tree) pipe networks — source → main → branches delivering
  fixed demands — filling the niche where EPANET is overkill (no loops, no iteration). Parent-pointer
  topology (no node table; each line has one upstream line), single-pass fixed-demand solve
  (bottom-up flows, top-down pressures), **series-by-default degradation** (`upstream` defaults to
  the previous line, so a no-topology entry is a plain series pipeline — subsumes the old
  "generic series multi-reach" idea), live Manning/HW/DW method switching, fixed k-value minor
  losses, **break-pressure-tank spacing** (flags where static head would exceed pipe pressure rating
  — absorbs the useful core of the former spring-box Task 111, now cut), a demand-multiplier
  **system curve** with pump-curve overlay, and a "tall" topology sanity
  sketch with toggleable per-cell data. **Phases 2 and 3 were EXTRACTED to Tasks 145 and 146 on
  2026-07-27 and are no longer tracked here** — Phase 2 = the feasibility-gated Google Maps
  elevation/length helper (isolated, lazy-loaded, core solve never depends on it); Phase 3 = looped
  (Hardy Cross) networks, originally "conditional, uncommitted, only after we're map-mashup experts
  or users ask." **Both have since left `bpn_` entirely (2026-07-28):** Task 146 became a separate
  map-interface calculator with its own prefix (`lpn_`), using the global gradient algorithm rather
  than Hardy Cross, and Task 145's map mashup moved onto that page with it. **`bpn_` therefore has no
  remaining phases and no map work** — nothing should go looking for either here. **Filing lesson (Tom, 2026-07-27):** leaving unbuilt phases inside a `- 0|…|` block
  in `## Completed` means nothing will ever surface them again — closed blocks are not scanned during
  prioritization, so the only retrieval mechanism was Tom personally remembering. Future work must
  never be parked inside a DONE block; extract it to its own task, even if the priority is low and
  the gate is unmet. Springboards off Irrigation-Pressure (`ip_`) but built fresh —
  **do not extract or degrade `ip`**. This is a **core-hydraulics** calculator in Tom's home
  authority, so the 4-axis mission-expansion framework above does not gate it. Candidate prefix
  `bpn_` (claimed 2026-07-23). Full spec: `dev/branched-network-calculator-scope.md`.
  **Status 2026-07-24 — build complete; only the translation sprint remains.** Decisions taken this
  date (all recorded in the scope doc): excessive-pressure reporting built, with **no "break pressure
  tank" terminology anywhere in UI or code** — the tool reports excessive pressure and does not size
  or place tanks (`6394929`); global demand multiplier built (`160cdb9`); the demand-multiplier
  **system-curve plot is CUT, not deferred** — no place for it on the page, do not reintroduce
  without a fresh reason; distributed outflow settled as **point demand at the downstream end only**
  (do not carry over `ip`'s along-the-line outflow); `ip_max_head_tip` reworded so it no longer
  repeats its own label (`c7027f6`). Glossary gained `pressure rating` and `pressure reduction`,
  both synonym-tolerant rather than calques (glossary 1.17).
  **Sprint run and closed 2026-07-27** (authorized by Tom the same date). 26 Sonnet agents, one per
  language. Per-language deltas ran 15-24 keys, not a uniform 21 — the count varies with what each
  file was still missing. The six real strings (`ip_pressure_high`, `ip_pressure_high_short`,
  `ip_max_head`, `ip_max_head_tip`, `bpn_demand_mult`, `bpn_demand_mult_tip`) are translated in all
  26; the do-not-translate guard held (symbols/eponyms verbatim everywhere, RTL included).
  `ip_pressure_warn` was carried as a resync key (English had drifted); every language independently
  confirmed its existing translation still matched, so none was rewritten, and the drift manifest is
  re-baselined to 2026-07-27. QA: `lang_syntax_validate.php` across all 26 returns 180 findings, all
  advisory `identical-to-english` (the frozen symbols) — zero escape-leakage, tag-imbalance,
  foreign-script, or entity-in-attribute. Tag-parity and entity checks on the six keys clean in all
  26. Back-translation done inline (no `ANTHROPIC_API_KEY` here), not skipped. Glossary write-back
  done as part of closing, not deferred: `pressure rating` and `pressure reduction` both populated
  for all 26 with dated notes (glossary 1.18). The residual payload delta (365 keys) is entirely
  frozen symbols, eponyms, product names, citations, and genuine cross-language cognates (`Name` in
  de, `Source`/`Notes`/`fraction` in fr, `Diameter` in id) — it will never reach zero and that is
  correct. Two follow-ups were split out rather than left dangling inside this closed block: Task 142
  (`ip_max_head` label/tip wording) and Task 141 (a narrow sw/ar terminology question).

- 0|136| **Reworded `template_translation_help` to invite native-language review — DONE 2026-07-21.**
  Authorized by Tom 2026-07-21 ("Deploy now"). English changed to the LOCKED wording "Do you have
  ideas to improve these calculators? And if this is your language &mdash; is the translation good?
  Please tell us." (draft C, "right"→"good"), then resynced into all 26 languages so the invitation
  appears in-language (a native speaker sees the ask to review their own language — a passive,
  always-on companion to the Task 135 sw review). One-key delta sprint, 26 Sonnet agents. The English
  edit correctly tripped `detect_english_drift.php` (validated the tripwire end-to-end on a real
  change), and the manifest was re-baselined after full sync. QA: 27×`php -l` clean; em-dash verified
  single-encoded `&mdash;` in all 26 (the `&amp;mdash;` in agent reports was notification
  display-escaping, per the Task-130 lesson); no double-encoding anywhere; trailing-space + string
  termination verified. **Session-limit note:** the account-wide session limit fired mid-sprint; 6 of
  7 "failed" agents (ru/sr/sw/tr/uk/ur) had already landed correct edits before erroring (per the
  session-limit-retry lesson — verify before relaunch), and only **zh** truly missed. With retries
  blocked by the limit and the rest ready, zh was completed inline by the orchestrator (Opus) rather
  than stalling the deploy — a one-string, trap-free deviation from the Sonnet-agent process, flagged
  for transparency; zh back-translation verified faithful.
- 0|129| **Stale-English-revision resync audit — DONE 2026-07-21.** Authorized by Tom 2026-07-21.
  Explicit-key-slice sprint (26 Sonnet agents, one per language) over the 5 keys flagged in Task 109
  (`ip_du_estimate`, `ip_worst_case_warn`, `ip_q_ratio`, `ip_notes_3_def`, `mhp_notes_2_def`) whose
  current English was shortened in the Wave-0 reform (commit 7bfbda1) while several languages still
  carried translations of the older, longer English. Driven off the explicit key list, not the
  payload delta (delta is blind to stale-but-present keys — same as Tasks 130/131). Each agent did a
  semantic per-language read against current English and rewrote ONLY drifted keys. **9 languages
  carried drift and were rewritten** (am, cs, es, hr, km, pt, ru, tr, uk); the other 17 already
  reflected current English. Drift kinds fixed: retired "inlet pressure" → current "supply pressure"
  (am/cs/es/hr/km/pt/tr/uk); ip_q_ratio's stale long "separate check" paragraph → current single
  sentence (cs/es/hr/pt/ru/tr/uk); ip_worst_case_warn old long form → short two-sentence
  (cs/es/pt/ru/tr/uk); uk's mhp_notes_2_def dropped-"1–3 m/s band" version → current; cs also fixed a
  garbled-Czech artifact. es/hi "textbook"→"standard" aligned (Tom confirmed negligible/synonymic —
  not swept to other languages). **Pre-sprint sweep for other Wave-0-shortened keys:** commit 7bfbda1
  also shortened mtc_/rc_/mi_ keys, but spot-check (pt `mtc_note_2_def`, `rc_qt`) showed those were
  re-translated in the later full-category waves — drift was concentrated in the ip_/mhp_ keys, which
  ip_ was handled differently from. QA all clean: 9×`php -l`; `lang_syntax_validate` zero hard
  findings (only advisory identical-to-english on unrelated keys); tag-parity (`<sub>`/`<span>`/`<sup>`
  + `q<sub>` symbols) all-match vs English on all 5 keys × 9 langs; entity check clean (no
  double-encode, no bare ampersands); inline back-translation of every rewritten string verified
  against current English. Glossary write-back done (v1.11→1.12: resync note on low-quarter DU entry).
- 0|126| **Suite-wide tooltip markup migration — DONE 2026-07-21.** Migrated the legacy
  inline-styled tooltip pattern (`<span title="..." style="cursor:help;...">?</span>`) to the
  touch-friendly `.ec-help`/`.ec-tip` convention (only `.ec-help[title]` fires tap tooltips in
  `js/Calculators.lib.js`). Audit narrowed the residue to exactly **7 `rc_` (Rock Chute) keys**
  (`rc_D50`, `rc_Hp`, `rc_SD`, `rc_Vm`, `rc_apron_length`, `rc_qt`, `rc_yn`) across **11 languages**
  (ar, bg, de, fr, he, hi, it, pt, ro, uk, zh) — English was already clean (the old "es/ru/zh clean"
  note was wrong: zh was NOT clean). Done with a scripted, idempotent converter
  (`dev/scripts/migrate_legacy_tooltips.php`) that moves each language's translated label text (with
  `<sub>` tags, escaped quotes, `&quot;`, RTL) INSIDE the `.ec-help` wrapper to match English's
  structure — not a pure attribute swap. **76 strings converted, 0 residual.** QA all clean: `php -l`
  on all 11 files, `lang_syntax_validate.php` (only advisory identical-to-english findings on
  unrelated keys, none on the 7 migrated keys), ec-help==ec-tip tag-count parity, byte-level
  spot-check of escaped-apostrophe / `&quot;` / RTL cases against the English structure.
- 0|130| **`odt_` fix + vessel-first rebrand — DONE 2026-07-21.** Authorized by Tom 2026-07-21. One
  26-agent Sonnet sprint (hand-specified key list, because the payload delta is blind to
  changed-English-under-stale-translation — same blind spot as Task 129). English `odt_` identity
  rebranded (menu "Orifice Drain Time" → **"Pond & Tank Drain Time"** Tom-locked; title/desc reordered
  vessel-first, orifice as method qualifier), then re-translated into all 26 languages. am's residual
  `odt_` head→distress calque (ጭንቅ in `odt_h1`, `odt_notes_1_def`) fixed to ሄድ. Bundled riders:
  **Task 127** (mhp_diameter "(supply pipe)" tooltip restored in the 15 langs that lacked it, existing
  penstock terms reused) and **Task 134** unit-token translations (see below). QA all clean: 27×`php -l`,
  `lang_syntax_validate` zero hard findings across all 26 (one he escape-leakage on `u_kgfcm2` fixed
  inline), mhp_diameter tag-parity (ec-help+ec-tip) on all 15, es reach-weighted spot-check, entity
  single-encoding verified (`&mdash;`/`&amp;` correct — an apparent double-encode was just notification
  display escaping). Glossary write-back done (v1.10→1.11: head am-odt fix, orifice ps-odt fix, penstock
  gloss note).
- 0|127| **`mhp_diameter` tooltip restored suite-wide — DONE 2026-07-21 (rode in Task 130).** The 15
  languages missing the `.ec-help` "(supply pipe)" tooltip got it added (translated gloss, existing
  penstock term reused); the 11 that already had it were left intact. Tag-parity verified on all 26.
- 0|134| **Units audit + bar/kgf-cm² gap-fill — DONE 2026-07-21.** English side (committed earlier):
  defined `kgfcm2` (0.1 = 1 kgf/cm² per 10 m H₂O), refined `bar` (0.09806), pruned dead
  `atm`/`knpm2`/`knpcm2`; wired `bar`+`kgf/cm²` into all 27 pressure/head dropdowns across 5 calculators
  (shear-stress `tau` left as `npm2`/`psf`); added `u_bar`/`u_kgfcm2` to all 27 files. Regional-norms
  web research drove the add/prune decisions (Tom adopted: add bar+kgf/cm², prune atm as lab-not-water,
  kgf/cm² is the Asia norm). The 26-language `u_bar`/`u_kgfcm2` translations completed as a rider in the
  Task 130 sprint. Numeric check: 30 m H₂O = 2.94 bar = 3.0 kgf/cm² = 294 kPa = 42.7 psi (consistent).
  Design note: units are **universal**, not per-locale (architecture has no per-language dropdown
  customization).
- 0|131| **Translate the 5 trap-term tips into 26 languages — DONE 2026-07-21.** Authorized by Tom
  2026-07-21. Scenario-D slice: 26 Sonnet agents (one per language, run in parallel), 5 keys each
  (`or_head`, `ws_headWaterHeight`, `mpf_velocity_head`, `mtc_sgrock`, `rc_sg`), glossary + `avoid`
  injected; driven off the explicit grep-slice, not the payload delta (stale-but-present keys don't
  surface there). Each agent preserved the existing translated label, added/updated the definitional
  tip in the whole-label `.ec-help`/`.ec-tip` form, and converted `rc_sg` from the old bare-`?`
  inline-style tooltip to the `.ec-help` wrapper where a language still had it (Task 127-style fix for
  the SG label specifically). Post-sprint QA all clean: `lang_syntax_validate.php` (zero
  escape/tag/foreign-script findings; only advisory identical-to-english on unrelated keys),
  structural tag-parity on all 130 strings (exactly one `.ec-help` + one `.ec-tip`, balanced spans,
  subscript parity, no raw ampersands), inline back-translation of every tip. Glossary write-back
  done (`head` + `specific gravity` translation_notes). Findings spun out: am `head` re-verified
  clean (ሄד loanword, no ጭንቅ); he/my `head` label issues re-confirmed open → stay in Task 128; new
  cross-key SG *label* drift (pt/uk/ar/fa/sr) → new Task 133. Labels were preserved throughout —
  tip-only scope.

- 0|128| **Trap-term native-confirmation residue (sw specific gravity + my/he head) — CLOSED 2026-07-21.**
  The specific-gravity portion (hr/sr/it stale-glossary corrections; tr/he/ps weight-flavored standards kept;
  units clean in all 26) was already resolved 2026-07-20/21. The three residual items were closed on Tom's
  2026-07-21 directive that **native review is not realistically available and we defer to the locally natural
  term**: (1) sw `mtc_sgrock`/`rc_sg` "Uzito maalum" KEPT — a weight-flavored local standard parallel to tr
  "özgül ağırlık", internally consistent, dimensionless guard satisfied. (2) my `or_head`/`ws_headWaterHeight`
  "ခေါင်းဆုံး" KEPT — an anatomically-derived head word is NOT inherently wrong (English "head" is itself the
  body-part word); it is a locally natural term, not a defect. (3) he `or_head`/`ws_headWaterHeight` "עומק"
  (depth) KEPT — depth-to-centroid is a physically legitimate reading of orifice effective head, and it is a
  natural term. Upstream fix: the glossary `head` family's blanket `avoid: "anatomical head"` was mistaken and
  was reframed across all 7 entries (`head` root + head loss/gross/net/velocity/weir head/headwater elevation)
  to forbid only *a lazy anatomical calque that is not the local standard* — an anatomically-derived word that
  IS the dominant standard is now explicitly correct. This does NOT revert the documented cs/he/sw velocity-head
  calque fixes (those anatomical renderings were not the natural term there, which the reframed guard still
  catches). Glossary `head` `translation_notes` updated with the full resolution. The 3 intent entries that
  read `avoid: anatomical "head"` (`mpf_velocity_head`, `ws_headWaterHeight`, `or_head` in `lib/lang.ec.en.php`)
  were updated to `| gloss: head` pointers (Tom authorized 2026-07-21), so they defer to the reframed glossary
  guard rather than restating the old blanket avoid.
- 0|133| **Cross-key specific-gravity LABEL consolidation (per-language) — DONE 2026-07-21.** Authorized by
  Tom 2026-07-21. In each of the 5 affected languages `mtc_sgrock`'s divergent weight-flavored label was
  aligned to `rc_sg`'s relative-density-flavored label (which already held this language's dominant glossary
  standard): pt→"Densidade relativa da rocha", uk→"Відносна густина каменю", ar→"الكثافة النسبية للصخور",
  fa→"چگالی نسبی سنگ", sr→"Релативна густина камена". Both calculators now agree within each language (ar
  retains a pre-existing singular/plural difference on the *rock* word only — للصخور vs للصخر — the SG term
  itself is aligned). Tips were already consistent and left untouched (label-only edit, per the task scope).
  `lang_syntax_validate.php` clean on all 5 (only advisory identical-to-english on unrelated keys). Glossary
  `specific gravity` `translation_notes` updated with the resolution. Consolidation happened to align toward
  relative-density because `rc_sg` held the standard in all 5; a weight-flavored standard would be equally
  valid to consolidate toward where it is the dominant term — this does not contradict defer-to-cultural-standard.
- 0|132|[CC] **`$ec_lang_intent` trimming — collapse duplicative definitions to `gloss:` pointers — DONE 2026-07-21.**
  Authorized by Tom 2026-07-20 (the single standing carve-out to the CLAUDE.md intent off-limits rule).
  Audited every non-empty `$ec_lang_intent` left-of-pipe in `lib/lang.ec.en.php` against `glossary.json`;
  trimmed 12 entries whose left-of-pipe merely restated a glossary concept to `| gloss: <term>` pointers,
  preserving all label-level commentary (`layout`/`symbol`/`avoid`) — Tom approved Group A + B:
  `rc_sg` (specific gravity), `rc_Hp` (weir head), `ip_pr` (application rate),
  `mpf_shear_stress` (shear stress; +symbol), `mi_d50in` (median rock size; +layout),
  `mhp_efficiency` (plant efficiency), `mhp_diameter`/`mhp_length` (penstock),
  `rc_notes_6_def` (outlet apron, downstream), `rc_notes_7_def` (weir head, upstream, ponding),
  `u_grade`/`u_gradePercent` (slope; +layout/avoid). Deliberately kept: `rc_apron_length` (label-specific
  toe-support length), `rc_yn` (critical directional guidance), and methodology/identity strings with no
  matching single glossary concept. All `gloss:` targets verified present in the glossary; `php -l` clean.
  English-only — the 26 translated files were not touched.

- 0|109| **[DONE 2026-07-20] Cross-language consistency audit (Opus, suite-wide), all 6 stages.**
  Motivated by a Burmese embedded-English defect that survived a full sprint's own QA. The lasting
  consequence is the mandatory glossary write-back rule in **CLAUDE.md § Post-sprint QA** — audit
  findings must land in `glossary.json` before a stage closes. Stage detail archived.

- 0|125| **Audit `$ec_lang_intent` keys — DONE 2026-07-17.** Two-part audit requested by Tom. Full
  findings in `dev/ec-lang-intent-audit-2026-07.md`.
  1. Swept all 26 non-English `lib/lang.ec.??.php` files for `$ec_lang_intent[...]=` leakage. Found
     leakage in all 26 (110 lines total, all empty-string placeholders — scaffold artifact, not
     authored content). Removed all 110 lines (licensed by CLAUDE.md's own carve-out: the
     AI-permission restriction applies to the canonical English array, not removal of leakage
     elsewhere). All 26 files verified `php -l` clean.
  2. Computed ratio: 129 non-empty English `_intent` entries / 507 `$ec_lang` keys = 25.4% — at
     Tom's "one-fourth" ceiling, not under it. Report bucketed the 129 into: ~30 legitimate (real
     transliteration/polysemy risk, kept untouched), 32 that restated a `gloss:` term inline in
     violation of the tag vocabulary's own "do not restate it inline" rule, 10 plain-symbol
     column-heading restatements missing the `symbol` flag, 3 non-technical tone/mission strings
     with no jargon risk, and 34 `rc_` (Rock Chute) entries that were unflagged leftover prose with
     no named risk. Tom signed off per-bucket: trim gloss entries to bare `'| gloss: ...'` tag form
     (done), trim symbol entries to `'| layout: column heading; symbol'` (done), leave the 3
     tone/mission strings alone (no change), and remove the 34 unflagged `rc_` entries as a scope
     violation (value set to `''`, matching the suite's existing empty-placeholder convention).
     Final ratio: 95/507 = 18.7%, `php -l` clean.

- 0|124| **Shared upstream-HGL/EGL warning for `mphl_`, `dw_`, and `hw_`, fixing `mphl_`'s
  "(See notes)" real-estate problem — DONE 2026-07-16.** Implemented per the finalized UI design
  (Tom, 2026-07-16): a shared `.ec-help`/`.ec-tip` `?` (new key `mphl_hgl_egl_tip`, "May not be
  valid if pipe is high. See notes.") now appears on both the "Upstream HGL" (`hw_hgl_2`) and
  "Upstream EGL" (`mphl_egl_2`) result labels in all three calculators. `mphl_`'s bespoke
  `mphl_hgl_2`/`mpf_see_notes` keys are retired (removed from all 27 lang files); `mphl_` now
  reuses the shared `hw_hgl_2` label like `dw_`/`hw_` already did. `mphl_note_1` gained a new
  first `dt`/`dd` item ("This calculator doesn't account for pipe elevation." / "If the HGL goes
  below the top of the pipe at any point, this calculation may not be valid.") ahead of the
  existing culvert-inlet-control item, and a matching Notes section (`ws_notes_heading` +
  `mphl_note_1`) was added to `Darcy-Weisbach.php` and `Hazen-Williams.php`, which previously had
  none. New/changed key `mphl_hgl_egl_tip` and the updated `mphl_note_1` text are English-only so
  far — not yet sprinted to the other 26 languages (payload delta confirmed via
  `generate_translation_payloads.php`; `mphl_hgl_egl_tip` appears in the fr delta, mixed in with
  unrelated pre-existing untranslated keys from other recent tasks).

- 0|123| **`mtc_`: add a solve-for-depth-given-Q mode — DONE 2026-07-16.** Added a Q-input
  solver above the main form (mirroring `mpf_`'s solve-for-y/d0 UI), with a new
  `EngCalcs.solveForY()` in `js/manning-trap.js`.
  **Scope grew beyond a plain inverse wrapper:** `mtc_` already has its own roughness/rock-size
  auto-iteration (Blodgett/Bathurst/P&I `n`, Isbash/Maynord/Searcy `d50`), both of which are
  functions of depth — so a naive fixed-`n` solver (the `mpf_` pattern) would have silently
  returned a `y` inconsistent with a re-run of that auto-iteration. Tom's call: an honest
  "didn't converge" beats a plausible-looking wrong answer. So the fix instead extracted the
  main form's existing n/d50 iteration loop into one shared, verified function,
  `EngCalcs.Manning.mtc_iterate()` in `js/Manning.lib.js` (used by both the main calculator and
  the solver — no duplicated logic to drift out of sync), and the solver bisects on `y` while
  re-running that full iteration at every trial depth, reporting `mtc_solver_no_solution` if the
  inner iteration or the outer bracket fails to converge. Confirmed Q and y increase together
  for trapezoidal geometry even under auto-iteration (no local peak like `mpf_`'s circular-pipe
  case), so plain bisection is valid; verified numerically (both manual-n and Blodgett+Isbash
  auto-iteration modes recover the seed depth exactly). New lang keys `mtc_solve_for_y`,
  `mtc_solve_desc`, `mtc_solver_no_solution` added to `lib/lang.ec.en.php` only — not yet
  sprinted to the other 26 languages.

- 0|122| **Add Phillips & Ingersoll (1998) Manning's n option to `mtc_` — DONE 2026-07-16.**
  Found this equation (Maricopa County Drainage Design Manual, Hydraulics Volume, Section 7.6.3,
  Figure 7.5) while chasing down Task 120/121's unresolved Bathurst-coefficient gap — it's what the
  manual actually still contains, fully specified with units and a stated applicability range,
  unlike the now-unrecoverable Bathurst formula (see Task 121's follow-up note). Formula:
  `n = 0.0926·R^(1/6) / (1.46 + 2.23·log10(R/d50))`, where **R (hydraulic radius) and d50 are in
  feet** — developed for central-Arizona lower-gradient channels with bed-material d50 ranging
  0.28–0.36 ft (~85–110 mm) in the source dataset; the manual itself calls these equations "a check
  or reference," not a sole design basis.
  **Implementation:** added as a third standalone `n_radio` option (`pi`) in `Manning-Trap.php`,
  alongside `strickler`/`bb` — not folded into the `bb` auto-select logic, which stays untouched.
  `js/manning-trap.js` converts `rh`/`d50_in` from SI meters to feet (factor 3.28084) before applying
  the formula. Added a `pi_range_check` result row (always visible, mirroring the existing
  `blodgett_v_bathurst` check) showing "d50 in P&I range" / "Outside range" via the suite-wide
  ✓/⚠ `EngCalcs.writeCheckHTML` convention, with a tip explaining the 0.28–0.36 ft dataset-range
  extrapolation risk either direction (consolidated into one shared out-of-range string + one shared
  tip, not separate low/high wording, per Tom's simplification request). New keys: `mtc_n_pi`,
  `mtc_pi_range_check`, `mtc_pi_ok(+tip)`, `mtc_pi_out_of_range`, `mtc_pi_tip` — translated into all
  26 non-English languages via the standard 26-agent Sonnet sprint (plus a leftover pre-existing
  untranslated `mtc_blodgett_v_bathurst` picked up in the same delta). Post-sprint QA passed:
  `lang_syntax_validate.php` clean of real findings (identical-to-english flags were all either
  deliberately-literal citation/unit strings or legitimate "vs." constructions), tag-parity verified
  script-wide (one Khmer `<sub>` tag mismatch found and fixed), and inline back-translation review of
  all 26 languages' final values against the English source.

- 0|121| **[DONE 2026-07-16] Second-opinion (Opus) pass on the Task 120 math audit.** Requested
  because the first pass had already found one critical bug, so the base rate for a second was not
  zero, and self-derive-then-self-check has a shared-slip blind spot. Findings archived.

- 0|120| **[DONE 2026-07-16] Holistic calculator mathematical audit.** All 14 calculators reviewed
  against a 7-point checklist in 4 physics-grouped stages. Checklist, per-calculator risk notes and
  findings: `dev/calculator-math-audit-checklist.md`. Second opinion was Task 121. Narrative archived.

- 0|119| **Offline usage logging (queue-and-flush) — DONE 2026-07-16.**
  `EngCalcs.maybeLogHumanView()`/`maybeLogCalcUsage()` (`js/Calculators.lib.js`) now send via
  `fetch(..., {keepalive:true})` instead of bare `sendBeacon` (sendBeacon's return value only means
  "browser accepted for delivery," not "reached the server," so it couldn't drive retry logic). A
  failed/offline request is queued into an IndexedDB store (`engcalcs-offline-queue`) via the new
  shared `EngCalcs._sendOrQueue()`. The queue flushes on the `online` event, on next page load
  (`EngCalcs.flushQueue()`), and — where Background Sync is supported — from `sw.js` itself via a
  registered `engcalcs-flush-queue` sync tag, so it can flush even with no EngCalcs tab open. Records
  that fail `_QUEUE_MAX_ATTEMPTS` (20) times are dropped rather than growing forever. Design-pass
  question resolved: queued retries carry the *original* client attempt time (`offline_ts`, ISO
  string) rather than the flush time — `log-human-view.php`/`log-calc-event.php` parse and use it
  (clamped to a 0–90 day sane window, else fall back to server "now") so a beacon that finally lands
  hours later logs when the usage actually happened. `sw.js` cache version bumped to `engcalcs-v5`.
  Not covered: `engcalcs-lang.log` (`LANG_LOG`) is written synchronously by PHP on page request, so
  when the SW serves a page fully from cache while offline, PHP never runs and there's nothing
  client-side to queue — that gap is structural, not a queue-and-flush gap, and was out of scope per
  the original task description (which named only the two beacon calls).

- 0|108| **`Install.php` localization — DONE 2026-07-14.** Was 100% hardcoded English body text,
  outside `$ec_lang` entirely — the only working PWA install path on iOS Safari/Firefox, where the
  in-app `⬇ Install` button silently does nothing (Task 95 resolution #1). Executed per the split's
  planned sequence, authorized standalone (not bundled with an upcoming category wave, per Tom's
  call when asked): (1) **Wave 0** — tightened the English body for concision/Simple-English
  compliance while restructuring. (2) Restructured into 15 new `$ec_lang['install_*']` keys (intro,
  Android/iOS/Desktop/Firefox section headings+steps, cached-pages summary), one key set rather than
  a single blob since the Android section interleaves a live install button and inline JS — matches
  `About.php`'s `about_body_html` convention where a single blob fits. Dropped the old hardcoded "16
  calculator pages" count in favor of "all calculator pages" so the text can't silently drift out of
  sync with the actual page count again. (3) Full 26-agent Sonnet translation sprint, scoped strictly
  to the 15 new keys (payload deltas also carried 5–15 unrelated pre-existing keys per language from
  other unfinished work, left untouched per standard scoping precedent).
  **Bug found and fixed while in this file, same session, per Tom's authorization:** `sw.js`'s PWA
  precache lists (`STATIC_ASSETS`/`CALC_PAGES`) were stale — missing `Canal-Seepage.php`,
  `Irrigation-Pressure.php`, `Rock-Chute.php` and their JS files, plus `Install.php` itself, so those
  3 calculators silently didn't work offline after install. Added all missing entries and bumped
  `CACHE_VERSION` to `v4` so installed users pick up the corrected list.
  QA: `php -l` clean on `Install.php`, all 27 lang files, and `sw.js`; `node -c sw.js` clean;
  `lang_syntax_validate.php` shows only advisory `identical-to-english` findings (all legitimate —
  `install_android_heading`/`install_ios_heading` are brand names like "Android (Chrome)" that
  correctly stay untranslated in most languages, same class as pre-existing eponym findings); tag-
  parity script-verified 4-for-4 `<li>`/`<strong>` counts across all 26 languages for the three
  step-list keys; no `&ndash;`/`&mdash;` entity-escaping bugs found; inline back-translation spot-
  check (no `ANTHROPIC_API_KEY` set) across 8 languages spanning Latin/Cyrillic/Arabic/CJK/Devanagari
  scripts (es, fr, de, ru, ar, zh, hi, sw) confirmed full meaning preserved, no dropped clauses, no
  leftover English, natural non-calqued phrasing. Payloads regenerated post-sprint (FRESH).
  **Post-close audit, same day, prompted by Tom questioning Wave 0/1 quality.** Tom specifically
  flagged `install_intro`'s "Once installed, ..." construction as a possible translation-risk word.
  Read all 26 languages' `install_intro` in full rather than assuming: 21 used a clean unambiguous
  "after installation" construction; the other 5 (es, fr, it, ro, plus the Hindi/Urdu/Bengali "one
  time X, after" pattern) rendered "once" via their own language's standard native idiom for it
  (French "une fois que," Spanish "una vez," Italian "una volta," Romanian "odată," Hindi "ek
  baar... ke baad" are textbook grammar for this meaning, not calques) — so the English wording
  itself was not the defect and was left unchanged. Extended the check past just `install_intro`:
  read every language's full `install_*` block and grepped fr/id/it/pt/ro for embedded-English
  false positives (all cleared — native words/established loanwords, e.g. French "menu" is
  original French vocabulary, not a leftover). Found one real defect: **my (Burmese) left the raw
  English word "install" (and browser/prompt/cache/menu/icon/window) embedded untranslated inside
  Burmese sentences across nearly every `install_*` key**, inconsistent with its own
  `install_main_menu` key which already had the correct native word (ထည့်သွင်း) sitting in the same
  file. Re-ran just that one language with an Opus agent (Sonnet had already had one clean shot and
  produced this defect; evidence didn't support redoing the other 25 languages or the English
  source). Independently verified the fix myself rather than trusting the agent's self-report:
  `php -l` clean, tag-parity re-confirmed 4-for-4 for all 3 step-list keys, and a direct read of the
  full file confirmed every ordinary tech-vocabulary word (install/browser/prompt/menu/icon/window)
  is now real Burmese, with only brand names (Chrome, Safari, Firefox, Edge, Android, iOS, EngCalcs,
  PWA) and the heading-position device label "Desktop" left in Latin script — matching the pattern
  already accepted in the other clean headings. Payloads regenerated post-fix (FRESH).

- 0|105| **Scoped and fixed the remaining `mpf_see_notes` stacking sites from Task 101, DONE
  2026-07-14.** Per-site fix shape (confirmed with Tom first, same as Task 104): (1)
  `Manning-Pipe-Flow.php` `q` label — folded `mpf_note_1`'s infinite-pipe/headwater caveat into a new
  `mpf_flow_tip` `?` tooltip (D8 pattern), full note with its tutorial-video link stays visible in the
  on-page Notes section since a `title` attribute can't carry a link. (2)/(3) `Manning-Trap.php`
  `n_in`/`d50_in` radio-button fields — both point at the same integrated iteration workflow
  (`mtc_note_1`), so both got one shared new `?` tip key (`mtc_iteration_tip`) rather than duplicating
  content. (4)/(5) `Micro-Hydro-Power.php` `vel_check`/`hl_check` — turned out to be a different case
  entirely: these are already governed by the D5 verdict-string convention (the check *value* itself
  carries the full explanation via `EngCalcs.writeCheckHTML`'s `ec-tip`), so the `(See notes)` on the
  row *label* was pure redundancy — just deleted, no replacement tip needed.
  While fixing site 4/5, Tom flagged a related live defect found by using the app: `hl_check`'s OK
  branch (`js/micro-hydro-power.js`) skipped `tipText` entirely, showing permanently-visible verbose
  text ("6.8% — within 10% target") with no hover explanation, breaking the D5 short-text+tooltip
  pattern that the warn/bad branches already followed. Fixed for all three states (ok/warn/bad now
  show just the percentage with the full explanation in the tooltip, merging the old
  `mhp_hl_ok`/`mhp_hl_warn`/`mhp_hl_bad` short strings into three tip-only keys), and extended the
  same treatment to `vel_check`'s OK case (added `mhp_vel_ok_tip`) for consistency, per Tom's
  direction. 6 new keys total (`mpf_flow_tip`, `mtc_iteration_tip`, `mhp_vel_ok_tip`, `mhp_hl_ok_tip`,
  `mhp_hl_warn_tip`, `mhp_hl_bad_tip`); `mhp_hl_ok`/`mhp_hl_warn`/`mhp_hl_bad` removed as obsolete.
  Translated into all 26 non-English languages via a 26-agent Sonnet sprint (uk landed before its
  reported session-limit failure, per the session-limit-retry lesson — verified complete rather than
  blindly re-run; zh/ur genuinely needed a retry). Mid-task correction: initially added
  `$ec_lang_intent` entries for the new keys without permission — caught and reverted everywhere
  (en.php and all 26 lang files) per the standing "AI must never touch `$ec_lang_intent` without
  explicit permission" rule; Tom confirmed intent entries aren't needed for these keys ("only needed
  for things like Riprap, Penstock, Head, and Chute... our glossary does much of the work").
  Post-sprint QA: `lang_parity_check.php` clean (0 missing/extra), `lang_syntax_validate.php` clean of
  escape-leakage/tag-imbalance/foreign-script findings, inline back-translation check across all 26
  languages found no semantic drift (proper nouns Blodgett–Bathurst/Isbash correctly preserved or
  transliterated to match each language's pre-existing `mtc_note_1` convention).

- 0|103| **"Penstock" kept as the primary term across all mhp fields, "(supply pipe)"
  disambiguated once rather than repeated, DONE 2026-07-13.** Unlike "riprap" (US slang prone to
  phonetic mistranslation), "penstock" is established international hydraulic-engineering
  vocabulary with real translations in most languages, so full replacement wasn't warranted — but
  per the Simple English policy (explanatory strings should still carry a plain-English anchor), a
  synonym was added once rather than leaving the bare jargon term unglossed everywhere. Scope
  narrowed after review: `e` (roughness) and `km` (minor-loss coefficient) tooltips are *shared*
  generic strings (`dw_roughness_tip`, `mphl_total_junction_k_tip`) reused verbatim across
  Darcy-Weisbach/Hazen-Williams/Manning-Pipe-Head-Loss — left untouched, since injecting "penstock"
  into those would corrupt their meaning in every other calculator that reuses them. Only `D` is
  mhp-owned and names the pipe: `mhp_diameter` = "Penstock diameter, D" with `ec-help`/`ec-tip`
  tooltip "Penstock (supply pipe) diameter" (full disambiguation, once, only place it appears).
  `mhp_length` was simplified to plain "Length, L" with no tooltip and no repeated "Penstock" —
  consistent with `e`/`km`, which are also plain generic attributes that never name the pipe
  themselves; `D` alone anchors what pipe the form is about. Also dropped stale "or flume" wording
  from both fields' visible text, tooltip, and `$ec_lang_intent` (intent edit made with Tom's
  explicit permission per the intent-editing rule) — the calculator only models a closed
  pressurized pipe (Darcy-Weisbach h_f,
  k_m minor losses), so "flume" never fit the physics. `mhp_notes_1_def`/`mhp_notes_3_def` prose
  got "(supply pipe)" added inline on first mention.

  **Full-suite propagation, same day.** Carried the D/L wording change to all 26 non-English
  languages: 21 mechanical (mhp_length simplified to a bare "Length, L"-style label, no tooltip,
  no pipe-name repetition, matching `e`/`km`'s style — done directly, no agent needed) + 5 agent-run
  (am, bn, ru, ur, fa) where the change required real translation judgment. The agent pass also
  uncovered and fixed a real defect while auditing existing translations: **am, bn, ru, and ur had
  phonetically transliterated "penstock"** (ፔንስቶክ / পেনস্টক / пенсток / پینسٹاک) instead of
  translating the underlying "pressure pipe" concept — the same defect class as the earlier
  "riprap" audit. Per Tom's fallback instruction ("if there is no good 'Penstock' translation, use
  'Supply pipe (or line)'"), each agent constructed a natural compositional "pressure pipe" phrase
  (am የግፊት ቧንቧ, bn চাপ পাইপ, ru напорный трубопровод, ur دباؤ پائپ) and added a "(supply pipe)"-style
  synonym gloss once, matching the English mhp_diameter tooltip pattern. fa was already correct
  (لوله فشار (پنستاک) — concept-first with jargon as a parenthetical aside) and only needed its
  `mhp_length` tidied. `dev/scripts/glossary.json`'s stale am/bn/ru "penstock" entries were also
  corrected to match (ur/fa glossary entries were already right — only the shipped lang files had
  drifted). QA: `php -l` clean on all 27 files; `lang_syntax_validate.php --lang=am,bn,ru,ur,fa`
  clean (only pre-existing, unrelated advisory `identical-to-english` findings on rc_/mtc_ keys);
  tag-parity check confirmed identical HTML/symbol structure across all 27 files for
  `mhp_length`/`mhp_notes_1_def`/`mhp_notes_3_def` (the `mhp_diameter` tag differences — tooltip
  present only in en/am/bn/ru/ur — are the intentional design, not a defect); inline
  back-translation semantic check (no `ANTHROPIC_API_KEY` set) confirmed all 5 agent-translated
  strings match source meaning.

- 0|101| **`k_m` label stacking fixed 2026-07-13; `e`/roughness field's identical problem DONE
  2026-07-13 via Task 104.** Surfaced investigating why bg's rendered `km` label looked long
  ("Коефициент на местни (локални) загуби, k<sub>m</sub> (Вижте бележките)"). The length itself
  turned out not to be a bg defect — measured against 12 other languages, bg's
  `mphl_total_junction_k` value (40 chars) sits mid-pack (fr 53, it 48, es 44, ro 41, bg/hr 40,
  sr/ru 39 — all longer or equal; en 33 shortest as expected) — normal Indo-European grammatical
  expansion, not a translation error; already checked once before in Task 96 item (2) sub-item 2
  ("no change" verdict) and re-confirmed here. The real problem Tom identified: regardless of
  per-language length, the *rendered field label* concatenated three things never meant to coexist
  for width: the full noun-phrase label, a bare `<a target="_blank">` link to
  engineeringtoolbox.com with no tooltip, and a trailing `(See notes)` appended outside the link.
  **DONE 2026-07-13 for `k_m`, all 5 call sites** (`Darcy-Weisbach.php`, `Hazen-Williams.php`,
  `Manning-Pipe-Head-Loss.php`, `Micro-Hydro-Power.php` ×2 fields), per Tom's direction: keep the
  hyperlink as-is (style-guide refresh instead of removal — see below), fold `(See notes)` into the
  tooltip rather than dropping it (it points to real, useful typical-value guidance), and shorten the
  visible label. New key `mphl_total_junction_k_short` = "Loss coeff., k<sub>m</sub>" (en) added to
  all 27 languages (26 translated directly by Claude Code, not a full agent sprint — one short
  formulaic phrase derived from each language's own already-translated `mphl_total_junction_k`
  wording, same effort class as Tasks 94/96/99). PHP shape at all 5 sites:
  `<a href="…">{short label}</a><span class="ec-help" title="{strip_tags(full definition)} {see
  notes text}"><span class="ec-tip">?</span></span>` — the tooltip text needed **zero new
  translation**, assembled in PHP by reusing the existing `mphl_total_junction_k` and
  `mpf_see_notes` keys as-is. `php -l` clean on all touched files; `lang_syntax_validate.php` shows
  only the same pre-existing 65 advisory findings, no new issues. Style guide refreshed in
  `dev/label-normalization-decision.md` D8: documents the actual live pattern (short "Word(s),
  symbol" label, not bare-symbol-only, which was tried and reversed for wide forms) and adds the
  rule that a "(See notes)" pointer belongs inside the tip, not as separate permanently-visible text.
  **Left open at the time:** the `e`/roughness field had the identical stacking problem — resolved
  by Task 104. A tail note in this same task also flagged 5 further `mpf_see_notes` stacking sites
  (Manning-Pipe-Flow, Manning-Trap ×2, Micro-Hydro-Power vel_check/hl_check) as unscoped
  reconnaissance, never part of this task's own defined scope (`k_m` bare-link stacking) — tracked
  separately as Task 105, not a blocker on closing this task.

- 0|102| **Generalized `k_m` typical-values guidance for dw/hw/mphl/mhp — DONE 2026-07-13.** Tom
  interviewed and decided: form is option (a), folded into the `k_m` tooltip (`title` text) added by
  Task 101 — not a Notes-section entry, not a new alert/panel. New shared key
  `mphl_total_junction_k_tip` (owner: `mphl_`, per existing incumbency of `mphl_total_junction_k`)
  holds the full definition + typical-values text and is used verbatim at all 4 call sites (dw, hw,
  mphl, mhp), replacing the old `strip_tags($ec_lang['mphl_total_junction_k'])` + (mhp only)
  `mpf_see_notes` composition. mhp's old Notes-section entry (`mhp_notes_4_term`/`_def`) is retired —
  deleted from all 27 language files (plus their empty `$ec_lang_intent` lines, with Tom's explicit
  sign-off since `$ec_lang_intent` edits are otherwise off-limits to AI) — so all 4 calculators now
  have identical `k_m` treatment, per Tom's stated direction to converge the suite on one pattern.
  **Content changed, not just relocated:** exit loss (sudden expansion to reservoir/atmosphere, k≈1.0)
  was missing from the original mhp note's typical-values list even though a "short penstock" framing
  implied one; added on Tom's call after he flagged the gap mid-session. New typical-values list:
  sharp intake entrance 0.5, each 45° bend 0.2–0.3, gate valve (fully open) 0.1, butterfly valve 0.2,
  exit (to reservoir or atmosphere) 1.0. **Default value changed from inconsistent per-calculator
  values (dw/hw/mphl were `10`, a generic placeholder never tied to any worked example; mhp was `1.5`,
  tied to the old "one entrance + two bends" note) to one shared, internally-consistent `2.0`** on all
  4 calculators — derived as the literal sum of the typical-values list for "one entrance + one exit +
  two 45° bends" (0.5 + 1.0 + 2×0.25 = 2.0), so a user reading the tooltip can verify the default by
  adding the listed numbers themselves. Full 26-language translation sprint run (Sonnet, one agent per
  language, scoped strictly to this one key — each payload also carried unrelated pre-existing `ip_`
  deltas from other unfinished work, deliberately left untouched). Post-sprint QA: `php -l` clean on
  all 27 lang files + 4 calculator PHP files; `lang_syntax_validate.php` shows only the same
  pre-existing 65 advisory findings (no new issues, none touching the new key); `<sub>`/`</sub>` tag-
  parity confirmed 4-for-4 across all 26 languages; inline back-translation-equivalent check (no
  `ANTHROPIC_API_KEY` set) confirmed all 6 numeric values (0.5, 0.2–0.3, 0.1, 1.0, 2.0, 45°) present
  in every language's string — no dropped clauses. Payloads regenerated post-sprint (FRESH).

- 0|104| **`e`/roughness field D8 content-and-stacking fix on dw/mhp/ip — DONE 2026-07-13.** Task
  101's flagged gap (identical `dw_roughness_tip` + `mpf_see_notes` stacking left open when `k_m` was
  fixed) closed after interviewing Tom. Decisions confirmed in interview: (1) content — generalize
  the existing mhp Notes-section entry (`mhp_notes_5_def`'s typical absolute-roughness values for
  steel/HDPE/PVC-uPVC/concrete), dropping its mhp-specific last sentence ("HDPE is common for small
  micro-hydro penstocks"), rather than drafting fresh Moody-chart values; (2) `dw_roughness` label
  shrunk from `'Roughness, e'` to bare `'e'` (matches `ip_roughness`, a deliberate Tom-approved
  exception to D8's general "not bare symbol alone" rule, documented as such in
  `dev/label-normalization-decision.md`); (3) full 26-agent Sonnet translation sprint authorized for
  the new `dw_roughness_tip` prose (not a hand-translated short label like Task 101's `k_m` label,
  since this is a full sentence of technical content). Execution: `dw_roughness_tip` changed from a
  baked-in `<span class="ec-help" title="…">` markup string to plain prose text, with the PHP call
  sites (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`, `Irrigation-Pressure.php`) now assembling the
  tip via `htmlspecialchars(strip_tags($ec_lang['dw_roughness_tip']))`, matching the `k_m` pattern
  from Task 102. `mhp_notes_5_term`/`_def` deleted from all 27 lang files (content now lives in the
  shared tip) along with its `<dt>/<dd>` row in `Micro-Hydro-Power.php`'s Notes section. `dw_roughness`
  set to bare `'e'` directly in all 27 lang files without a sprint (confirmed via `ip_roughness`
  precedent that a bare Latin symbol needs zero translation in any of the 26 languages). Sprint: 26
  agents (Sonnet, one per language) translated `dw_roughness_tip`'s new prose in parallel; one
  (Hindi) ran long and was completed directly (Claude Code) when the delay exceeded other languages'
  completion times — its independent re-run afterwards produced an identical string, confirming the
  direct translation was correct. Post-sprint QA: `php -l` clean on all 27 lang files + 3 calculator
  PHP files; `lang_syntax_validate.php` shows only the same pre-existing 65 advisory findings (no new
  issues); no stray HTML tags introduced in any of the 26 translated strings; inline read-through of
  all 26 strings against the English source confirmed semantic parity (materials, values, and units
  present in every language). **Bug caught and fixed during QA:** cs and he agents used the
  `&ndash;` HTML entity for the value range instead of a literal en-dash character; since the tip is
  passed through `htmlspecialchars()` at render time, `&` would have been double-escaped to literal
  visible text `&ndash;` — corrected to the literal `–` character in both files, then re-verified by
  rendering the PHP call sites directly (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`,
  `Irrigation-Pressure.php` all confirmed to render the correct tooltip text, `mpf_see_notes` stacking
  confirmed gone from mhp). `dev/label-normalization-decision.md` D8 updated: both known gaps (k_m
  from Tasks 101/102, roughness from this task) marked closed, and the bare-`e`-label exception for
  `dw_roughness` documented as Tom's specific call, not a general D8 rule reversal.

- 0|98|[CC] **[DONE 2026-07-13] English-improvement pass, 7 items.** The durable output is the
  Simple-English source-string policy, which lives in **CLAUDE.md § Write English source strings in
  Simple English**. Per-string rewordings archived.

- 0|96|[CC] **DONE 2026-07-13: Task 96 closed — Bulgarian scope question resolved, all 3 sub-items
  addressed.**
  - **(1) CLOSED 2026-07-13 — decided and executed.** Tom: "I would put водно количество
    everywhere." Suite-wide, all bg calculator categories (pipes/irrigation included, not just
    open-channel/hydraulic-structure). Every `дебит` occurrence in `lib/lang.ec.bg.php` (35 across
    dw_/hw_/mpf_/mphl_/mi_/mtc_/ws_/wi_/or_/odt_/irr_/mhp_/cs_/ip_) replaced with `водно количество`,
    with grammatical gender agreement fixed throughout (дебит is masculine, водно количество is
    neuter — adjective/article/pronoun endings adjusted on every occurrence, e.g. `пълен дебит`→
    `пълно водно количество`, `техният дебит`→`тяхното водно количество`). `glossary.json`'s `flow`
    entry bg value updated to `водно количество` and `translation_notes` updated to record the
    resolution (version 1.6→1.7). `php -l` and `lang_syntax_validate.php --lang=bg` both clean.
  - **(2) CLOSED 2026-07-13:** engineer's 2026-07-06 answer — "Коефициент на градация (SD) =
    D₈₄.₁ / D₅₀" — is the standard term, superseding both candidates originally asked about
    (`едрозърнестост` and `разнозърненост`). Applied to `rc_SD`/`rc_SD_check` in
    `lib/lang.ec.bg.php` and recorded in `glossary.json`'s `gradation` entry.
  - **(3) CLOSED 2026-07-13 — resolved via best-effort review, no native review realistically
    forthcoming (Task 90 precedent).** Checked bg menu-title casing: `main_menu`/`main_title`
    across all 12 calculators were already sentence case (only first word + proper nouns
    capitalized), matching the engineer's corrections in `dev/Bulgarian-engineer-feedback.md`
    (e.g. "Проектиране на Каменен Улей" → "Проектиране на каменен бързоток" is a sentence-case
    correction). One real miss found: `index_title` (the site's homepage title, not a
    calculator-specific key) was genuine Title Case with a stray Latin "O" typo
    ("Безплатни Oнлайн Инженерни Калкулатори") — fixed to sentence case ("Безплатни онлайн
    инженерни калкулатори"), matching `ru`'s pattern for the same string. Spot-checked bg's
    `ip_` notes/tooltips for terminology consistency with the suite-wide `водно количество`
    decision (item 1) — clean, no defects found. (Note in passing, out of scope for this task:
    both bg and ru also Title-Case a handful of `<h3>` section headings in `about_body_html`
    (e.g. "Лицензия с Открытым Исходным Кодом") — a separate, suite-wide heading-casing question
    shared across languages, not a bg-specific defect; left untouched.)
  - **New feedback 2026-07-13 from bg engineer, addressed same day:**
    1. Language-menu capitalization: `LANGNAME` for bg was the only lowercase entry
       (`български`) among all 26 non-English languages (every other Latin/Cyrillic entry —
       `Hrvatski`, `Русский`, `Türkçe`, `Українська`, etc. — is capitalized). Fixed
       `lib/Language.Settings.php` to `Български`.
    2. mhp calculator's `e`/`L`/`Km` labels "more verbose than English": checked all three —
       `Km` (`mphl_total_junction_k`, shared with mphl_) was already a fair parallel of the
       English, no change. `e`'s tooltip (`dw_roughness_tip`, shared with dw_) had a genuinely
       extra "по метода на" ("by the method of") that no other language's equivalent tooltip
       carries — trimmed to "Височина на грапавостта по Дарси-Вайсбах". `L` (`mhp_length`) had
       expanded the main label into a full descriptive phrase ("Дължина на напорния
       тръбопровод, L") where English keeps it terse ("Length, L") and pushes detail into the
       tooltip — shortened the label to "Дължина, L" and applied the engineer's own suggested
       tooltip wording ("Дължина на провеждащия тръбопровод или улей", dropping the redundant
       "подвеждащия (входен)" parenthetical). `php -l` and `lang_syntax_validate.php --lang=bg`
       both clean.

- 0|97|[CC] **DONE 2026-07-13: Task 97 closed — tr riprap term unified on "taş dolgu".** Tom had no
  way to adjudicate the Turkish-native judgment call himself ("I have no way of helping... you will
  have to do your best"), so resolved via an Opus pass reasoning from suite convention rather than
  native review: the English source treats "riprap" as one concept in all 5 spots (bulk material
  and D₅₀ particle-size sizing alike), and every other language (es "enrocado", fr "enrochement",
  pt "enrocamento", ru "каменная наброска") uses one bulk-material term throughout rather than
  switching to a particle/fragment word for the sizing context — Turkish should match. Verdict:
  "parça taşı" ("piece stone"/rock fragment) is not a real Turkish hydraulics term for riprap;
  "taş dolgu" ("stone fill") is the established DSİ/TS term (cf. "taş dolgu baraj" = rockfill dam)
  and already matched `mtc_bend_angle` (category 1, incumbent) and `glossary.json`. Replaced all 4
  `rc_` occurrences (`rc_apron_length`, `rc_notes_1_def`, `rc_notes_3_def`, `rc_notes_6_def`) with
  grammatically correct "taş dolgu" inflections (genitive "taş dolgunun" where the original had
  possessive "parça taşının"; bare attributive "taş dolgu" elsewhere) — not a blind find-replace,
  since Turkish compound/genitive suffixes differ by construction. `php -l` and
  `lang_syntax_validate.php --lang=tr` both clean. No native Turkish review has occurred; this
  stands as our own best-effort resolution (per the Task 90 native-review precedent), not a
  pending "awaiting review" item.

- 0|99|[CC] **DONE 2026-07-13: Task 99 closed — removed broken `mph` option from
  `Manning-Irregular.php`'s velocity unit select.** `echoUnitSelect($name='v617u', ...)` offered
  `mps`/`ftps`/`mph`, but `mph` has no backing `$ec_units['mph']` conversion factor or
  `$ec_lang['u_mph']` label — the option rendered broken. Only one live occurrence found (the
  original roadmap note said "two"; the second no longer exists). Fixed by dropping `mph` from the
  Array, matching the `mps`/`ftps`-only pattern used by every other velocity selector in the suite
  (verified against `Irrigation-Pressure.php:107`, the only other velocity selector). `php -l` clean.

- 0|95|[CC] **DONE 2026-07-13: Localization-bypass audit findings, 2026-07-12 (Tom's "holistic
  closing audit" for Task 91 surfaced this gap class — hardcoded strings that never route through
  `$ec_lang`, so no translation-quality pass would ever catch them).** Two content pages exist
  entirely outside the localization system, unlike `About.php` (which correctly routes its body
  through `$ec_lang['about_body_html']`):
  - `Install.php` (66 lines, PWA install instructions) — 100% hardcoded English body.
  - `Orifice-Drain-Time-Ref.php` (786 lines, equation derivation reference) — 100% hardcoded
    English body; also linked from `Orifice-Drain-Time.php:47` via a hardcoded "Derivation"/
    "Equation derivation" link.
  Three scope questions, all resolved 2026-07-13 (Tom):
  1. **`Install.php`: translate it — moved to Task 100.** Tom's instinct was that it might be
     redundant now that there's an in-app `⬇ Install` button (`EngCalcs.installPWA()`,
     `js/Calculators.lib.js:29`). Checked and it isn't: that button only fires on browsers that
     support `beforeinstallprompt` (Chrome/Edge), so it's silently useless on iOS Safari and
     Firefox — which is most of Install.php's content (the iOS Share-menu steps, the "Firefox
     doesn't support PWA install" note, the "what gets cached" explainer). Install.php is the only
     working install path for those platforms, so it stays in scope and needs translating like any
     other user-facing page. Execution (wave-0 English cleanup, then translate) split off as
     **Task 100** rather than folded into this closure, since a 66-line page + a 786-line reference
     page is a real undertaking, not a quick sub-item.
  2. **`Orifice-Drain-Time-Ref.php`: English-only, permanently — including the "Derivation" /
     "Equation derivation" link text.** 786 lines of equation-manipulation prose ("integrating both
     sides," "substituting into," "rearranging yields") has a much higher mistranslation-consequence-
     per-word ratio than UI labels — a wrong verb tense changes what the math claims — and
     translating it right would be its own sprint for a page most users never open. English-only
     reference links are a normal pattern (engineering software routinely links out to English-only
     derivations/papers). No further action.
  3. **`Manning-Trap.php` radio labels (`Strickler`/`B/B`, `Isbash`/`Maynord`/`Searcy`): leave
     untranslated.** These are the surnames of the formulas' originators (citations, not descriptive
     text). Confirmed this matches existing suite convention — `lib/lang.ec.ar.php` and
     `lib/lang.ec.zh.php` already keep "Manning," "Darcy-Weisbach," and "Hazen-Williams" in Latin
     script inline even in RTL/CJK text (zh glosses with a transliteration once, then reverts to
     plain Latin). No script-rendering need; no code change.
  `Compare-Languages.php` and `formmail.php` are internal/dev-utility pages, not user-facing app
  content — out of scope, no action needed.

- 0|94|[CC] **DONE 2026-07-13: Task 94 closed — orphan-key full-suite housekeeping.** Ran
  `dev/scripts/lang_parity_check.php` across all 26 non-English lang files to get the authoritative
  "extra" (present in translated file, absent from English source) list: 30 keys — `cs_notes_1_term`,
  `cs_notes_4_term`, `cs_wp`, `ip_e`, `ip_hv`, `ip_notes_1_term`, `ip_notes_4_term`, `ip_v`, `mhp_f`,
  `mhp_flow`, `mhp_hf`, `mhp_hl`, `mhp_hm`, `mhp_km`, `mhp_nu`, `mhp_roughness`, `mhp_velocity`,
  `mi_notes`, `mtc_vel_check`, `mtc_vel_high`, `mtc_vel_high_short`, `mtc_vel_low_short`,
  `mtc_vel_ok_short`, `odt_h_orifice`, `or_flow`, `or_velocity`, `wi_elevation`,
  `wi_headWaterelevation`, `wi_notes_we_term`, `wi_station`. Verified each with a word-boundary grep
  across all PHP/JS before deleting — two looked live at first grep but turned out to be false
  positives on the identical string used for something else: `cs_wp` is a form-field `name`
  (labelled via the shared `mpf_wetted_perimeter` key, not its own), and `mtc_vel_high` is a JS
  `pageConfig` variable name fed from `$ec_lang['mhp_vel_high']`, not `$ec_lang['mtc_vel_high']`.
  Deleted both the `$ec_lang[...]` and `$ec_lang_intent[...]` lines for all 30 keys from all 26 files
  (759 lines total; English file untouched since these keys never existed there). Also fixed 4 stale
  references to the same dead keys (`or_flow`, `mhp_flow`, `mhp_hf`, `mhp_hm`) in
  `dev/scripts/glossary_compliance_audit.php`'s `TERM_KEYS` map, which had been silently no-op-ing on
  them. `php -l` clean on all 28 touched files; `lang_parity_check.php --strict` now reports
  `extra: 0` suite-wide (was 759 nonzero across languages); `lang_syntax_validate.php` clean (only
  pre-existing, unrelated `identical-to-english` advisories).

- 0|93|[CC] **DONE 2026-07-13: Task 93 closed — cross-language glossary reconciliation pass.**
  Checked `glossary.json`'s `preferred_translation` against actual shipped lang-file usage for the
  5 terms flagged by independent category-5-wave-1 agents (it, pt×3, ru, tr). Confirmed 6 genuine
  glossary-stale entries and updated them to match the incumbent, internally-consistent file terms:
  it riprap `scogliera`→`pietrame`; pt penstock `conduto forçado`→`conduta forçada`; pt plant
  efficiency `eficiência da usina`→`rendimento da instalação`; pt gradation `granulometria`→
  `graduação`; ru penstock `напорный трубопровод`→`пенсток`; tr penstock `basınç borusu`→`cebri
  boru`. hr rock chute (`kameni skluz` vs shipped `kameni žlijeb`) was left as-is — glossary already
  flagged it "NEEDS HUMAN REVIEW" pending a decision on whether the *file* should change to parallel
  sr/ru (`kameni brzotok`), not the glossary, so out of scope for a glossary-only reconciliation.
  Along the way found one case where the glossary was actually right and the file had drifted (tr
  riprap, `taş dolgu` vs `parça taşı`) — logged as a new item above rather than silently editing
  shipped translated sentences. No lang files changed; `glossary.json` only (version 1.5→1.6).

- 0|92|[CC] **DONE 2026-07-13: Task 92 closed — whole-label hover/tap target for tips.** Added
  `.ec-help { cursor: help; }` to `css/engcalcs.css`, updated the Bootstrap tooltip-init selector in
  `js/Calculators.lib.js` to also match `.ec-help[title]`, and mechanically migrated all 956
  `class="ec-tip"` occurrences across all 27 `lib/lang.ec.*.php` files to the
  `<span class="ec-help" title="…">Label <span class="ec-tip">?</span></span>` pattern (title moved
  from the inner span to the wrapper; inner `.ec-tip` markup/CSS unchanged, so it stays non-breaking).
  Fixed one pre-existing bug found along the way: `lib/lang.ec.sr.php` `rc_apron_length` had a raw
  unescaped `"` inside its `title` attribute (should have been `&quot;` like the English/Russian
  versions) which would have broken the HTML attribute boundary — corrected to `&quot;`.
  `$ec_lang_intent` entries were untouched. `dev/scripts/lang_syntax_validate.php` clean (only
  pre-existing, unrelated `identical-to-english` advisories); `php -l` clean on all 27 files.

- 0|91|[CC] **DONE 2026-07-12: Task 91 closed — complete re-translation of every calculator category
  into all 26 languages, category by category** — rules & sequence in
  `dev/translation-process.md` Scenario C, mechanics in CLAUDE.md § "Translation Sprints."

  | # | Calculator category | Prefixes | Status |
  |---|---------------------|----------|--------|
  | 1 | Open channel | `mtc_`/`mi_` | ✅ closed — 3 waves + holistic Opus pass |
  | 2 | Weirs & orifices | `ws_`/`wi_`/`or_`/`odt_` | ✅ closed — 3 waves + holistic Opus pass |
  | 3 | Pipe friction | `dw_`/`hw_`/`mpf_`/`mphl_` | ✅ closed — 3 waves + holistic Opus pass |
  | 4 | Irrigation & seepage | `cs_`/`irr_`/`ip_` | ✅ closed — 3 waves + holistic Opus pass |
  | 5 | Micro-hydro | `mhp_`/`rc_` | ✅ closed — 3 waves + holistic Opus pass |
  | 6 | Shared UI/units | `u_`/`calc_`/`menu_`/`points_` | ✅ closed — delta sprint + holistic pass |

  Category 6 didn't get a full 3-wave re-translation — a read-only assessment found its existing
  content already high quality (translated organically, never stale), so per the SOP's
  cost-scoping note the lightest rung that covered the risk was used instead: a delta sprint for
  the genuine gaps plus a holistic Opus pass. Full dated execution history:
  `dev/translation-execution-log.md`. Open threads spun off as their own standing items rather
  than closed with this task (Task 93 glossary reconciliation, Task 94 orphan-key housekeeping,
  Task 90 native-review backlog, Task 89 D50 median fix, Task 88 verdict-glyph sweep) were all
  separately closed 2026-07-13. The two suite-wide prerequisites this task depended on — **Wave 0**
  English reform and **Task 87** key consolidation — both ran once, up front, ahead of this task
  (see their own Completed entries).

- 0|90|[CC] **DONE 2026-07-13: Task 90 closed — native-review backlog resolved by best-effort
  verification instead of waiting for a native reviewer (Tom's call: "it's pie-in-the-sky to wait for
  human review that may never come").** Ran a research pass over every flagged concern for
  am/km/my/ps/sw plus the he/hi/ur/ps/ur concerns named explicitly, checked current lang-file
  values against the concern, and fixed what could be fixed without inventing new risk:
  - **The ps/ur "shear"=scissors false-cognate concern fully closed.** `mpf_shear_stress` was already
    fixed in both languages; `mi_tau` (category 1) was the one instance still carrying the literal
    scissors word (`قیچي` ps / `قینچی` ur). Changed both to `برش` (the shear/cut-noun root already
    established as correct in each language's own `mpf_shear_stress`), keeping the existing `<br />`
    column-heading layout. `php -l` clean on both files.
  - **sw `or_hwe`/`or_twe` asymmetry fixed.** Was `'Kiwango cha maji juu ya mlango'` (level of water
    above the gate) paired with `'Kiwango cha maji ya mkia'` (level of the tail-water) — two different
    grammatical constructions where every other language (fr amont/aval, es arriba/abajo, ar
    علوية/سفلية, hi अपस्ट्रीम/डाउनस्ट्रीम) uses a parallel pair. Changed `or_hwe` to
    `'Kiwango cha maji ya kichwa'` (head-water), mirroring the existing `mkia` (tail-water) — now a
    parallel head/tail pair matching the English metaphor exactly, minimal change to the established
    `mkia` term.
  - **km/sw `mpf_shear_stress` action-noun root verified, not a defect.** Checked the actual root
    words: sw `mkato` (a cut/incision, from *kata* "to cut") and km `កាត់` (the verb "to cut") are
    action/process nouns, not the scissors-tool nouns (sw `mkasi`, km `កន្ត្រៃ`) — the same
    non-error class as Arabic's own standard `إجهاد القص` and Hebrew's `מאמץ גזירה`, both built on
    cutting roots and both accepted engineering terms. Confirmed distinct from the real
    scissors-tool trap above; left as-is.
  - **ps `rc_sg`/he `rc_sg` "specific gravity" glossary check.** ps's glossary.json entry
    (`ستومانه وزن`, literally "heavy weight") was stale and did not even match the file's own
    already-correct term (`ځانګړی ثقل`, the standard Perso-Arabic scientific term parallel to
    English's own "gravity" naming) — glossary corrected to match the incumbent file term, same
    pattern as Task 93. he's `משקל סגولی` ("specific weight") verified as the standard Hebrew
    physics-curriculum term for this ratio, same accepted local-practice exception already
    documented for tr/özgül ağırlık/sr/hr — added to that exception list in glossary.json rather
    than "corrected" into an error.
  - **Discovered and left alone (out of scope):** am's `mhp_flow`/`mhp_roughness`/`mhp_km`/`mhp_nu`/
    `mhp_velocity`/`mhp_f`/`mhp_hf`/`mhp_hm`/`mhp_hl` keys don't exist in `lib/lang.ec.en.php` at all
    and aren't referenced by `Micro-Hydro-Power.php` — dead orphaned keys unique to the am file, not
    a translation defect. Left for a future dead-key cleanup pass (Task 94 territory), not touched
    here.
  - **Left open, genuinely needing a fluent reviewer (documented, not fixed):** am `mi_tau`'s shear
    rendering (`ሸርፍ`) — plausible but I can't independently confirm Amharic engineering usage; km's
    `mtc_vel_low` sedimentation word choice, `wi_pondingHeight`, the kept-in-Latin-script
    "re-entrant" in `or_notes_3_def` and "Micro-Hydro" in `mhp_main_title`; my `ws_headWaterHeight`
    phrasing; ps register in `or_notes_3_def`/`odt_notes_2_def`; sw's unnamed "tooltip phrasing" flag
    (no specific key was ever recorded, so nothing to act on) and its incumbent-vs-glossary term
    choices (already correctly kept per the incumbency principle, a Task 93 question not a Task 90
    one).
  - **QUALITY scores intentionally left unchanged** (am/km/my/ps/sw stay at `0.65`). Per Tom's framing,
    the low score itself is the honest, permanent "needs review" flag — it wasn't earned by full-suite
    independent back-translation coverage (only these specific flagged concerns got a second look), so
    bumping it now would overstate verification depth. Per CLAUDE.md's tier policy, `0.65`→`0.85`
    requires the full back-translation-checked + cross-language-consistency-checked treatment across
    the whole file, not a targeted patch.

- 0|89|[CC] **DONE 2026-07-13: Task 89 closed — D50 "median" mistranslation resolved via 12-language
  research vote, not native review.** Tom's call: since no native reviewer was available, research
  each flagged language's actual geotechnical/sedimentology literature (web search) to see how the
  vote leans overall, rather than blocking on human input per language. Spawned one research agent
  per language for bg/cs/de/hr/ro/ru/sr/tr/uk/fa/ur plus am (added per Tom's steer: "it's certainly
  not as though nobody can do real math in Amharic"). Result: 7 of 12 (de/cs/uk/tr/fa/ur/sr) had a
  directly-cited real median term in that language's technical literature — genuine errors, fixed.
  2 (bg, uk) turned out to already be correct in the actual lang files (glossary.json was simply
  stale — same pattern as Task 93); 2 more (hr, ro) were likewise already correct in-file. Only
  am had no distinct median-vs-average term in circulating usage at all (confirmed even by Amharic
  dictionaries) — left unchanged, nothing more correct to fix it to. Edited `mi_d50in`/`rc_D50`/
  `rc_notes_1_def` in lib/lang.ec.{de,cs,ru,tr,fa,ur,sr}.php and refreshed glossary.json's `median
  rock size` entry (translations + a dated research note) to match. `php -l` clean on all 7 touched
  files; `lang_syntax_validate.php` shows only pre-existing, unrelated `identical-to-english`
  advisories. Full per-language findings and citations in the conversation record.

- 0|88|[CC] **DONE 2026-07-12: Task 88 closed — suite-wide baked-in verdict-glyph sweep.** Ran the
  mechanical grep the item called for across every verdict-string key actually passed as
  `writeCheckHTML()`/`writeVelocityCheck()`'s `shortText` argument (27 keys spanning
  `mhp_vel_*_short`, `or_regime_*`, `mhp_hl_*`, `odt_h2_*`, `cs_loss_negative`/`cs_Ec_*`, `rc_pond_*`/
  `rc_eq_warn_*`/`rc_sg_*`/`rc_SD_*`, `ip_elev_ds_missing_warn`, `ip_pressure_warn_short`) against
  all 26 non-English lang files for baked-in ✓/⚠/×/etc. glyphs or translated "Warning:"/"OK:"
  prefixes. Zero matches — the category-2/5 instances already fixed were the only real occurrences;
  category 1's previously-unchecked `mtc_vel_*` consumers are clean. Full method and results:
  `dev/translation-execution-log.md`, 2026-07-12 entry.

- 0|87|[CC/H] **DONE 2026-07-07: Concept-level label normalization (design exploration; raised by Tom 2026-07-06).** The original design attempted to economize by using atomized language variables at the *word* level, which made both translation and maintenance hard. Explore revisiting economizing by normalizing at the *concept* level instead: adopt one canonical, reusable label per concept — borrowed from whichever existing calculator has a good set — rather than per-calculator wording. First candidates to review critically: (a) **elevation** — use identical label wording wherever any calculator asks for an elevation, with the tooltip optionally broken into a few per-context variants; (b) **length** — drop the qualifier ("channel"/"reach"/"pipe") from "channel length"/"reach length"/"pipe length" and lean on the page title for disambiguation. Payoff: shrinks the translation surface and eases maintenance across the suite. Do a reuse-candidate audit before committing. Model split: Fable for the cross-calculator language survey; Opus/Tom for the reuse-architecture decision. Priority number provisional.
  - **Fable survey DONE 2026-07-07 → `dev/label-normalization-survey.md`.** Key findings: cross-prefix borrowing already exists (Darcy-Weisbach.php uses mpf_/mphl_/hw_ keys), so the decision is ownership policy, not mechanism; ~18 exact-duplicate keys mergeable with zero wording decisions (incl. the 7-key mtc_/mhp_ velocity-check block); strongest wording cluster is the head-loss triad + minor/junction-loss coefficient across mphl_/mhp_/ip_; candidate (a) elevation supported as shared-bare-key + closed qualified set (Orifice Flow needs 4 distinct elevations on one page, so bare-only is too strong); candidate (b) length supported for mphl_/mhp_ only — keep "Reach length" (cs_) and "Weir length" (ws_) as load-bearing. Survey §6 has the ranked shortlist.
  - **Opus/Tom architecture decision DONE 2026-07-07 → `dev/label-normalization-decision.md`.** Six rulings: **D1** borrow-from-owner, no neutral prefix, **menu order** breaks ties (`mpf_→mphl_→hw_→dw_→mtc_→mi_→rc_→mhp_→or_→odt_→ws_→wi_→cs_→ip_`); **D2** menu order picks the surviving *key*, best cluster wording picks its *value*; **D3** "**Minor (local) loss**" canonical (merges mphl_ "junction loss" + mhp_/ip_ "minor loss"; rename `mphl_total_junction_k`); **D4** lowercase loss symbols `h_f`/`h_m`/`h_L`, coeff `k_m`, capital `H` reserved for total/gross/net head; **D5** verdict strings = leading `✓`/`⚠` glyph (decorative, untranslated) + short text, **whole string is the `ec-tip` tooltip target** (fixes `writeVelocityCheck`'s glyph-only tap target); **D6** merges execute **per category, just before its Wave 0/wave-1** (not one suite pass), so each shrinks the paid sprint that follows. Recorded in glossary.json (v1.4: minor⇄local, lowercase loss symbols) and CLAUDE.md (Concept-level label reuse + Verdict convention subsections). **Execution backlog (8 items, ranked value÷risk)** — see decision doc's "Execution backlog" and §6 of the survey. (Ruling **D6 was REVERSED 2026-07-07** — see next bullet; it originally, wrongly, handed execution to Task 91's per-calculator-category loop.)
  - **CORRECTION 2026-07-07 (Tom + Opus) — Task 87 REOPENED as a standalone, FULL-SUITE project; ruling D6 REVERSED.** Closing Task 87 as "decision-only" and routing its merges through Task 91's per-calculator-category loop was the mistake that poisoned Task 91. Key consolidation is inherently cross-cutting: a duplicate label's two halves live in *different* calculator categories, so no per-category view can make the merge/ownership call (proved this session — open-channel's merge candidates were shared with weirs, irrigation, and micro-hydro). **New structure:** Task 87 = **one English-only pass over ALL calculators**, executed by **Opus** (context-hot; this is architecture/sequencing, not a linguistic sweep; Fable's survey is already done). It is a prerequisite English-reform step, **decoupled from Task 91**; the merge step that had been inserted into Task 91's per-category loop is removed. **Corrected end-to-end sequence:** (1) Task 87 full-suite key consolidation [Opus, English-only, applies D1–D5 + D7 merge method] **+** Wave 0 colloquialism cleanup for the remaining calculator categories [Fable] → (2) **translation tier/wave 1 (anchors) — INTERACTIVE**; translating into cognates is how we still catch garbage English, so wave 1 may still reform the source → (3) **English then FREEZES for tiers/waves 2+** → complete re-translation of waves 2–3 [major non-Latin → low-resource; full backtranslate + native-review QA] → (4) build the §10.5 per-key English **source-hash LAST** (deferred: with a complete re-translation there is nothing to delta-gate *this* pass; the hash earns its keep only for *future* incremental English edits). Terminology throughout: **"calculator categories"** (the 6 calc groupings; Tom's word, 2026-07-07) vs **"translation tiers/waves"** (language groupings) — never bare "families". The tips standard (blue `?` affordance + whole-label hover/tap target) is split off as its own item under CSS Standardization Follow-up. **Scope reminder (Tom, 2026-07-07): Task 87 is NOT finished until the ENTIRE survey (`dev/label-normalization-survey.md`, §1–§6) is addressed** — executed or explicitly dispositioned keep-as-is. Progress is tracked row-by-row in **`dev/label-normalization-tracker.md`** (the completion gate: every row ☑/◇, 5 open wording decisions ruled, QA clean). The exact-duplicate merges (§2) are only the first of ~10 survey areas. **Status:** roadmap decoupled 2026-07-07; tracker built; 5 open wording decisions surfaced (velocity-shorts, elevation owners, roughness-`e`, weir "height"vs"head", S₀↔S_f safety) — resolve those, then execute top-to-bottom on Opus.
  - **DONE 2026-07-07 — full execution complete, every `dev/label-normalization-tracker.md` row ☑/◇.** §1–§3 (ownership policy, ~18 exact-duplicate merges, 8 concept clusters) executed in prior sessions this same day. §4 typography ride-alongs: area symbols standardized to uppercase `A`/`A₀` (owner incumbency over mpf_'s lowercase `a`), `Q₀`/`z₁`/`z₂` given proper `<sub>` subscripts, Froude `F`→`Fr`, `tau`→`&tau;`, `mi_hv617` `H_v`→`h_v` (incl. its `$ec_lang_intent`, Tom-authorized), and all 10 remaining `style="cursor:help;color:#06c;…"` spans (mtc_/rc_) converted to `class="ec-tip"`. §5 verdict convention (D5): new shared `EngCalcs.writeCheckHTML(ok, shortText, tipText)` in `js/Calculators.lib.js`; `writeVelocityCheck` rewritten so the whole string (not just the ⚠ glyph) is the `.ec-tip` tap target. The other 5 ad-hoc verdict groups (`or_regime_*`, `odt_h2_*`, `cs_loss_*`, `mhp_hl_*`, `rc_sg_*`/`rc_SD_*` — the latter rode along, same defect as `rc_sg_*` though not separately listed in the tracker) had their baked-in long strings split into a short label + new English-only `*_tip` key per D7. QA: `php -l` + `node --check` clean on every touched file, `lang_syntax_validate.php` clean, all touched calculator pages render with no fatals via CLI PHP. New `_tip`/split keys show as "missing" in the 26 non-English files — expected propagation worklist for Task 91 (D7), not a defect.

- 0|86|[CC] **DONE 2026-07-07: Task 86.** Reversed the `dw_roughness` over-consolidation. `dw_roughness` restored to `'Roughness, e'` (dw_/mhp_ wide-form labels); new key `ip_roughness`='e' added for Irrigation-Pressure's narrow table column; both keep sharing `dw_roughness_tip`. English-only per Task 87 convention (`dev/label-normalization-decision.md`: non-English files aren't touched during consolidation work) — Tom confirmed deferring the 26-language propagation to Task 91, or leaving the key empty/English-fallback in the interim is fine. `ip_roughness` doesn't yet exist in the 26 non-English files, so it silently falls back to the English value there (same load order as any other missing key) until propagated.

- 0|85|TypeScript migration item closed as stale, 2026-07-05 (Human authorization): item was conditional on its own face ("only worthwhile if the project scope grows significantly") and no such growth has occurred — no bundler, no npm dependencies, no build step exist in this codebase today, and adding a `tsc` toolchain would cut against that simplicity for no observed type-safety pain. Closed with no code changes; revisit if the project scope grows enough to justify the tooling.

- 0|84|Renamed `irr_main_menu` from "Irrigation Flow Measurement" to plain "Irrigation" in all 27 `lib/lang.ec.??.php` files, 2026-07-05: the section now covers pressure/DU (Irrigation Pressure calculator) as well as flow measurement, so the old label undersold the menu's scope. User chose "Irrigation" over the alternative "Irrigation Calculators" when asked. For the 26 non-English files, reused each language's own existing irrigation-root vocabulary already present in the old (longer) translated string rather than running a translation sprint — e.g. Spanish "Medición de Caudal de Riego" → "Riego", Russian "Измерение расхода ирригации" → "Ирригация". No new terms introduced, so no glossary/sprint step needed. `php -l` clean on all 27 files.

- 0|83|npm/Composer dependency-management task closed as stale, 2026-07-05: investigated before starting (item was reassigned from `[CP]` to `[CC]` this session per Human direction) and found the premise no longer holds — `HeadersFooters.lib.php`/`sw.js` load Bootstrap straight from `cdn.jsdelivr.net`, not a locally vendored copy, and a repo-wide grep found no Composer usage (`vendor/`, PHP library requires) and no locally built/minified JS or CSS. There is currently nothing to manage a dependency manifest for. Closed with no code changes rather than manufacturing an empty `package.json`/`composer.json` — revisit if a real local dependency is introduced later.

- 0|82|Suite-wide symbol-convention question, resolved 2026-07-05 (split off 2026-07-04 from the Irrigation Pressure H-vs-P item): decision is **keep single-letter symbols on labels as-is** — they aren't decoration, they're the join key between a label and the formula shown right below it (e.g. `mhp_notes_1_def`: "Net head H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>"), and the pattern (H<sub>gross</sub>, Q, k<sub>m</sub>, h<sub>f</sub>, R<sub>h</sub>, P<sub>w</sub>, etc.) is already consistent across mi_/mpf_/mphl_/or_/mhp_/odt_ and more. No suite-wide edit made — status quo confirmed, not changed.

- 0|81|Fixed bg/es/pt/tr Manning Trapezoidal Channel (`mtc_`) symbol/translation gaps found 2026-07-05: added the missing `b`/`S`/`y`/`D50` symbol suffixes to `mtc_bottom_width`/`mtc_channel_slope`/`mtc_flow_depth`/`mtc_d50_in` in all 4 languages. For bg/tr, `mtc_bend_angle`/`mtc_sgrock` were left as flat untranslated English (bg additionally marked `//No need` in-file) — decided (no explicit `$ec_lang_intent` guidance existed for these, so treated as an ordinary translation gap) to translate both into bg and tr rather than leave them, matching the pattern already used by fr/de/ru for the same keys. `php -l` clean on all 4 files; `lang_parity_check.php --prefix=mtc` shows 0 missing/extra and 0 equal-to-English for bg/tr, and only pre-existing unrelated gaps (`mtc_blodgett_v_bathurst`, `mtc_vel_ok_short`) remain in es/pt.

- 0|80|Results sharing made opt-in, 2026-07-05: implemented the scope agreed 2026-07-04 (see prior framing above, now folded in here). `EngCalcs.calcAndSave()` (`js/Calculators.lib.js`) no longer calls `updateUrl()` on every form change; a new `EngCalcs.copyLink()` calls it on demand, writing `window.location.href` to the clipboard via `navigator.clipboard.writeText` and flashing the button text to a localized "Copied!" for 1.5s. New `#ec-copy-link-btn` button added next to the existing "Label:" field in `lib/Menus.lib.php` (shared scaffold, all calculator pages) — the `ec_name_hint`/`change` listener's explicit `updateUrl()` call (renaming the saved calc) was left alone since that's already an explicit user action, not automatic churn. New lang keys `calc_copy_link`/`calc_copy_link_done` added to all 27 `lib/lang.ec.??.php` files (English fallback in the 26 non-English files; no translation sprint run yet). Also fixes a real bug this design flaw was causing: `EngCalcs.readCookieAndCalc()` checked `loadFromUrl()` before `cookieToForm()`/`pageCalculatorInitialize()`, and since the URL almost always carried params (from the old automatic `updateUrl()`), it would skip row-table initialization entirely on reload — for calculators with dynamic reach/point tables (Irrigation Pressure, Weir Flow Irregular, Manning Irregular) this meant the table silently ended up with **zero** rows, since rows are only ever created inside those two functions and `CalcsBody` ships empty in the raw HTML. Fixed by always running cookie/default init first, then layering any URL params on top as overrides; `updateUrl()` also now excludes elements inside `#CalcsBody` from the query string, since per-row fields share duplicate `name`s and can't round-trip as flat key=value pairs anyway. Verified via a jsdom + real-cookie-jar harness against the live dev server: reproduced the exact zero-row failure pre-fix, confirmed 3 rows post-fix, and confirmed no regression in normal cookie round-trips (including the user's actual stale cookie value from testing). `php -l` clean on all 27 lang files plus `Menus.lib.php`/`Calculators.lib.js`.

- 0|79|"Default values" reset button, added 2026-07-04: placed on the same shared row as the unit-set buttons ("Set units:"), so one edit to `lib/Calculators.lib.php`'s `set_units_row` covers all 12 calculators — new `<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">` right after the four unit buttons. Reset mechanism deliberately simple per user direction: `EngCalcs.resetToDefaults()` (`js/Calculators.lib.js`) calls a new `EngCalcs.expireCookie()` (`js/Cookies.lib.js`, mirrors `createCookie()` with a past expiry) then does a plain `window.location.href = window.location.pathname` reload — no bespoke per-calculator JS needed, since the existing cookie-miss path already falls back to each page's own `pageCalculatorInitialize` (`js/Calculators.lib.js:107-113`), which naturally restores dynamic reach/points tables too. New lang key `calc_defaults` ("Default values") added to English, then translated into all 26 non-English `lib/lang.ec.??.php` files via 26 parallel haiku agents (per-language authorization given 2026-07-04). Verified: `php -l` clean on all 27 lang files plus `Calculators.lib.php`; `lang_parity_check.php` shows the `equal_to_english` count dropped by exactly 26 (one per language); rendered a live calculator page (Darcy-Weisbach) via CLI PHP and confirmed the button HTML (`<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">Default values</button>`) renders correctly and wires to the new JS function.

- 0|78|Irrigation Pressure H-vs-P decision, resolved 2026-07-04, corrected same day: initial pass kept H<sub>supply</sub>/H<sub>design</sub>/H<sub>last</sub> attached to the three pressure labels (`ip_h_supply`, `ip_h_design`, `ip_h_far`) reasoning that H is the suite-wide head symbol — user corrected this: pressure quantities should carry no symbol at all here, not H and not a new P. Removed the `, H<sub>...</sub>` suffix from all three English labels, now plain "Supply pressure" / "Emitter design pressure" / "Last emitter pressure". Scoped narrowly to the three quantities explicitly labeled "pressure" in words — left the reach-table loss quantities (`ip_hv`/`ip_hf`/`ip_hm`/`ip_hl`: velocity head, friction loss, minor loss, total reach loss) untouched, since those are head/loss terms, not pressure values. Internal JS variable names (`h_supply`, `h_design`, `h_far` in `js/irrigation-pressure.js`/`Irrigation-Pressure.php`) left as-is — internal plumbing, not user-facing, out of scope for a display-symbol correction. No non-English files affected (Irrigation Pressure translation sprint hasn't run yet). Verified: `php -l` clean, rendered page confirms all three labels show plain text with no symbol. The broader "are single-letter symbols worth it suite-wide" question was split off as a separate, still-open, non-urgent item.

- 0|77|Irrigation Pressure calculator (`Irrigation-Pressure.php`, prefix `ip_`) — English-only build of the distributary-network/irrigation-branch hydraulics calculator spec'd out in a 2026-07-04 design session, substantially reworked the same day through extensive live testing and feedback (37 rounds of comments). Description settled on "Test Branch Pressure and Uniformity Estimate."

  **Core model:** a single flat reach table where each row is independently a Main reach (flat draw = design flow × the reach's own total emitter count — every OTHER lateral branching from that reach; for the reach right at the test lateral's own takeoff, this also includes any laterals beyond that point along the main or sharing the same junction, e.g. an opposite-side lateral, since their flow branches from that same reach too) or a Lateral reach (per-emitter `q = k·H^x` draw, friction loss reduced by Christiansen's F(n) for multi-outlet reaches). Solves by guessing the last (most remote) emitter's pressure and bisecting it against the entered supply pressure, marching the Energy Grade Line backward reach-by-reach — same bisection shape as `js/manning-pipe-flow.js`'s `solveForDd0`. Elevation modeled via a proper EGL march (extension beyond the original spec, which had no elevation term): EGL only ever drops by friction+minor loss; actual nodal pressure is backed out using each row's own elevation and velocity. One downstream-node elevation input per row (optional/defaults-to-flat on interior rows, load-bearing on the last row) plus one global supply elevation. Terminology settled through testing: "test path"/"test lateral" (not "critical path"), "last emitter" (not "critical emitter").

  **Uniformity methodology reworked significantly after live discussion**, not just built once: initially compared the last emitter's flow against the manufacturer's design/rated flow, but that's not standard practice — real low-quarter DU divides by the sampled population's own mean, never an external rated value. Settled on `q_last/q_avg_field` (`du_estimate`), where `q_avg_field` is the test lateral's own modeled average corrected by a user-entered `dp_avg` ("estimated pressure difference, average vs. test lateral," default 0). The correction exists because the test lateral is deliberately the presumed worst case, so its raw average is a biased-low stand-in for a true field average — `dp_avg` lets a motivated user correct for that bias, feeding both the uniformity check and the Application Design section below. Kept `q_last/q_design` (`q_ratio`) as a separate, explicitly non-uniformity diagnostic for "how far is this system running from its design point." Added a worst-case sanity warning: if the solved last-emitter pressure reaches or exceeds supply pressure, flags that the modeled path likely isn't the true worst case. Deliberately did not attempt an interpolated low-quarter DU (per-emitter pressure interpolation within each lateral row) — reconsidered and deferred, since the model lacks the elevation and length resolution to do that honestly.

  **Application Design section added**, ported from `Drip-Sprinkler.php`'s formulas and reusing its `ds_*` labels: spacing (`Se`/`Sl`) and system-wide lateral/emitter-count inputs feed precipitation rate, system/zone flow, and runtime, using the corrected `q_avg_field` instead of a manually-guessed rate.

  **Shared-library bugs found and fixed during this build** (benefit every calculator using these patterns, not just this one): `js/Calculators.lib.js`'s `addCalcRow` never applied initial values to checkbox/radio row inputs; a `points_data`-textarea null dereference when a calculator's table omits the copy/paste feature; `loadFromUrl` could crash assigning `.value` to a non-Element when a field name collided with a reserved DOM collection property (e.g. `length` shadowing `HTMLFormControlsCollection.length`); `js/Cookies.lib.js`'s `cookieToForm` had no detection for a stored cookie no longer matching the current page's field layout — now bails cleanly to reinitialize instead of crashing or partially populating.

  Reused existing precedent throughout rather than inventing new architecture: `Manning-Irregular.php`'s dynamic add/remove row table (`EngCalcs.addCalcRow` etc. in `js/Calculators.lib.js`) and `js/darcy-weisbach.js`'s 3-regime friction factor. Deliberately dropped for this pass: the points-data copy/paste bulk-edit textarea (kept add/remove single-row controls only) and a sketch/diagram. Deferred/out of scope: pump-curve supply boundary (fixed inlet pressure only), a dedicated pressure-compensating-emitter toggle (usable today via the free `x` exponent input), and the 26-language translation sprint (English only; `$ec_lang_intent['ip_*']` left blank per the sprint process, not yet run — see the separate symbol-convention roadmap item, H-vs-P and q-vs-Q, to resolve before that sprint). `php -l` and JS syntax clean on all touched/new files throughout.

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
