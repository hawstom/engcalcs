# Session handoff — written 2026-09-05

**Read this, then `dev/ROADMAP.md`, then `dev/new-english-keys.md`.** It is a snapshot of one
unusually dense day and it goes stale fast: everything below is either a RULING Tom made (permanent
until he changes it), a TRAP measured on this tree (permanent), or a STATE (perishable, and dated so
you can tell). Delete a state line once you have checked it and it is no longer news.

---

## 1. THE CRITICAL PATH IS TOM'S READING, NOT YOUR BUILDING

**Tom, 2026-09-05: *"If we can implement it and have some serious review and translation before
Sep 17, that would be very cool."*** That is 12 days from the day this was written, and the thing
standing in the way is not code.

- `dev/new-english-keys.md` stood at **59 still to read, 136 untranslated** at the end of this
  session, all `lpn_`. It was **0 still to read** that morning; one day of EPANET work added them all.
  **He read them. It stands at 3 on 2026-09-06** -- see §4.
- **A sprint before he has read them is paid work thrown away** — that is what sprint 459 recorded,
  when nine agents translated a payload that disagreed with the source. Do not launch one on a
  general "proceed"; CLAUDE.md requires explicit authorization and it means it.
- **Read the count from the script, not from the file's size.** `new_english_keys.php` prints
  `N still to read, M untranslated`. Those are different questions and this session reported one as
  the other to Tom, who caught it: *"You say 79. But there is one."* The script's console line was
  changed the same day so the unread count leads.
- **When he writes on that file, COMMIT HIS MARKS VERBATIM BEFORE ANYTHING ELSE TOUCHES IT**, then
  transfer approvals into `dev/english-key-rulings.json` and edits into `lib/lang.ec.en.php`. The
  file has eaten his work once (Task 545). `--write` refuses over a hand-edited file; that guard is
  the only thing standing between his reading and another loss.

---

## 2. RULINGS TOM MADE THIS DAY — do not re-litigate these

- **"Implement all of EPANET."** He overturned the standing *"wait for a user who has one"* bar:
  *"Why would we design something ourselves for [RULES] and [MIXING]. Implementing it doesn't mean
  we can't change anything."* The working rule that came out of it: **drop the bar where EPANET has
  fully specified the thing and wiring it through is cheap; keep it where we would have to design
  something ourselves.** The `utility-planning-engineer` disagrees that parity is the right *goal*
  and its reasoning is in its wish list — worth reading, and overruled on the specific gaps.
- **A pump's curve reference IS scenario-overridable** (*"Scenario pump reference: Yes."*). The
  curve's POINTS stay Base-owned and document-level: an override is on WHICH curve an element names,
  never on what a curve contains.
- **There are four kinds of curve and only four** — Pump (head), Efficiency, Volume, Headloss. That
  is EPANET's complete `[CURVES]` set.
- **A tank gets its volume curve from the Library** (*"Tank can't use its own volume curve any more.
  It needs to get it from the Library."*) — the same paradigm as every other curve. No per-element
  curve data anywhere.
- **The `lpn_` menu bar's own entry is `Water`, not `Project`.** The KEY is still
  `lpn_menu_project` and that is deliberate (Task 523). Do not describe it as the Project menu.
- **`[REPORT]` stays carried for ever** unless he says otherwise. It is formatting for a `.rpt` this
  page never requests, and implementing it means *generating a report file*, which is a feature and
  not parity. Flagged to him; he has not asked for it.

---

## 3. TRAPS MEASURED ON THIS TREE — each one cost real time

- **A HARNESS THAT BUILDS ITS OWN MODEL CAN BE GREEN WHILE THE FEATURE DOES NOT WORK.** Task 582
  shipped with five green sections because every one handed the engine a model the harness had
  assembled itself, so `docEnergy()` — the page's ONLY document-to-model bridge — could put nothing
  on it and nothing noticed. **If you are testing a feature that crosses from a document to the
  engine, drive the page's own chain: parse, import, install, assemble, run.**
  `pump-effic-curve-harness.js` section 6 is the worked example.
- **A ONCE-ONLY READ GUARD NESTED INSIDE AN OLDER SECTION'S GUARD WALKS PAST THE DOCUMENTS IT EXISTS
  FOR.** `[TAGS]` landed after `[SOURCES]`; a project saved in between already carries
  `settings.sources`, so a tags read under that test would never run for exactly those files.
  **Every interpreted section gets its own record and its own guard.** Two features hit this in one
  day. There is a harness fixture in that state for both.
- **EPANET CHECKS ITS RULE BASE *BETWEEN* TIME STEPS.** A `[RULES]` rule changes nothing on a
  single-instant solve — the pump keeps running at a level its own rule says shuts it. That is the
  engine's behaviour and we copy it. **A rule only demonstrates itself on an extended-period run**,
  and so does anything about pump energy, which is power accumulated over time.
- **CHANGING A UNIT REINTERPRETS THE TYPED NUMBER; IT NEVER CONVERTS IT.** This session told Tom the
  opposite in a browser-test instruction and he corrected it. The exporter *does* convert when it
  must state a flow keyword EPANET can name, and reports that as a difference — that is the export
  choosing a keyword, not a unit switch touching the document.
- **`INP_SECTIONS_READ` IS NOT "THE INTERPRETED LIST".** It is the list of sections the reader takes
  APART into tokens, and a section on it loses its own characters. "Interpreted" here means parsed
  BESIDE the carried lines, with the exporter writing those lines back while they still parse to
  what the document states. `lpnSourcesText(live, src)` is the pattern; `[SOURCES]`, `[MIXING]` and
  `[TAGS]` all follow it.
- **The DOM stub's `querySelectorAll()` returns `[]` for everything.** Walk the tree in the harness;
  do not teach the stub a selector engine to satisfy one assertion. That is the
  stub-that-removes-the-coupling trap `dev/testing-notes.md` warns about.

---

## 4. STATE — checked and pruned 2026-09-06

**Everything §4 and §5 said to verify about the curves paradigm change (Task 586) was verified on
2026-09-06 and is true**, so the checklist is gone rather than carried: `doc.curves` is the store;
`curvePoints`, `efficPoints` and `curveRef` survive only inside `mintCurveLibrary()`, which is the
one-way migration, and in the helper `curvePointsOf()`; all four EPANET kinds exist as library
objects; and a tank USES its volume curve (Task 587 closed the same day, `lpnTankVolumeAttach()` in
`js/lpn-time.js`, anchored by `dev/lpn-spike/tank-volume-curve-harness.js`). Nothing here needs
believing any more; the harnesses assert it.

**`dev/new-english-keys.md` is at ZERO still to read, 2026-09-06.** Tom read the whole list again
and wrote 50 marks on it, and all 50 are now in `dev/english-key-rulings.json` and
`dev/english-friction/584-wave0.json` rather than in the working tree.
`harvest_english_rulings.php --check` is blocking, so a mark can no longer sit only in the markdown.
**The sprint is gated on ONE string:** `lpn_scncmp_at`, where he asked *"I need more context. Where
is this used?"* — answered in the friction log, and waiting on his ruling. Nothing else blocks it.

**The retranslation debt is the live number:** `detect_english_drift.php` reports 39 keys whose
English moved after a translation was written, and `new_english_keys.php` reports 144 untranslated.
That is one sprint's worth and it is what a sprint should be sized against.

---

## 5. THE NEXT THINGS, in the order I would take them

1. **THE SPRINT IS GATED ON TOM AND ON NOTHING ELSE.** Wave 0 ran on 2026-09-06 over 178 new and
   changed strings and filed **64 findings** — 44 applied, 7 referred to him, the rest dismissed or
   ruled. `friction_check.php` counts a `refer-to-human` as unanswered by design, so those 7 are the
   hard gate. Separately `dev/new-english-keys.md` stands at **45 to read**, and 43 of those are
   keys whose earlier ruling LAPSED because Wave 0 changed the wording — which is the ruling
   mechanism working, not a regression.
2. **The JS fallback literals — DONE 2026-09-06, and named here for the lesson.** Every localized
   string is copied beside its key as `pageConfig.<key> || '<literal>'`, and 199 of 893 had drifted
   from `lib/lang.ec.en.php` — invisible because `pageconfig_check.php` guarantees the key is
   supplied, so none of it renders, which is exactly why it rotted. All 199 corrected mechanically
   out of `$ec_lang`, and `js_fallback_string_check.php` is absolute at 0.
3. **Task 539 phase two — the gang move.** Phase one measured it and overturned the plan: across 28
   drawings there are **9 leader-leader crossings against 76 label-on-leader**, so the cheap
   segment-intersection test the roadmap proposed as the opening sees about a tenth of the problem.
   Build for the second trigger.
4. **Task 436's measurement is DONE, 2026-09-06, and it turned a suspicion into a decision.** Text
   measurement was the suspect and is now proven: 70-79% of the block, `getBBox` at 0.8 ms a call,
   ~100% of the calls from one caller. The standing warning against the arithmetic fix is FALSE
   (0 of 3,608 `getComputedTextLength` calls returned zero) and the real obstacle is that advance
   width runs 0.636% mean / 1.801% worst under the ink box. The fix is named and costed in the
   roadmap block; what is left is Tom's call on whether "byte-identical placement" may be relaxed.

---

## 7. THINGS NOT TO DO

- Do not launch a translation sprint without explicit authorization in that conversation.
- Do not touch `$ec_lang_syn` without written permission in that conversation. No standing carve-outs.
- Do not regenerate `dev/translation_payloads/` from a subagent. The orchestrator does it once,
  before the commit. A subagent's `payload freshness` failure is EXPECTED and is not its to fix.
- Do not put four agents in `js/looped-network.js` at once. Two with named seams worked; the merge
  conflicts that did happen were all in the GENERATED `dev/new-english-keys.md`, which regenerates.
- Do not tell Tom a browser test that has not been run headlessly first. Three instructions this
  session were wrong — a file with no `[TIMES]` duration that could not show an energy report, a
  unit switch described as converting, and File > Open where the page says Import.
