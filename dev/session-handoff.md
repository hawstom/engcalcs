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

## 3b. SPRINT 584-wave1 CLOSED 2026-09-06 — ALL 26 LANGUAGES, 185 keys each

145 new keys plus 40 whose English had drifted, into every language. **Every language is at parity**
(1666 keys, or 1675 for the four core ones, against 1688 English). The manifest is re-baselined, so
`detect_english_drift.php` reports CHANGED: none.

- **KHMER NEEDED A SECOND DISPATCH, and that is the reusable lesson.** Its first agent wrote NOTHING
  to disk in a full run -- it composed in memory, which is exactly what the batching rule exists to
  prevent, and a session limit or a stall then takes everything. The retry put the batching rule in
  its OPENING PARAGRAPH, named the previous failure, and it worked. **If an agent's language file
  has not grown after a while, it is not slow, it is not saving.** Check the file, not the clock.
- **13 English keys are untranslated and unruled**: Task 593's five water-quality rows and their
  option labels, written after the payloads were generated. Next sprint's delta, correctly.
- **One friction entry is escalated and waiting on Tom**: `lpn_settings_viscosity` in Pashto, where
  two distinct English terms landed on one Pashto word on the same screen. No English defect; it
  needs a Pashto speaker. It is in `dev/new-english-keys.md` under the translators' section.

## 4. STATE — checked and pruned 2026-09-06, second pass

**Everything the curves paradigm change (Task 586) asked to be verified is verified and the
checklist is gone rather than carried.** `doc.curves` is the store; `curvePoints`, `efficPoints` and
`curveRef` survive only inside `mintCurveLibrary()` (the one-way migration) and in `curvePointsOf()`;
all four EPANET kinds exist as library objects; a tank USES its volume curve. The harnesses assert
all of it. Nothing here needs believing.

**THE TRANSLATION BACKLOG IS ESSENTIALLY EMPTY, WHICH IS A CHANGE OF STATE AND NOT A GOOD NUMBER TO
GUESS AT.** Sprint 584-wave1 closed at 26/26. Both friction logs PASS with every entry answered
(wave0: 64 entries, wave1: 34). `detect_english_drift.php` reports **1** changed key and
`new_english_keys.php` **1** untranslated — both of them `lpn_tool_key_hint`, written the same day.
**So there is no sprint to propose.** An earlier version of this file said 39 drifted and 144
untranslated; that debt was discharged, not deferred, and quoting it would size a sprint against
work that is done.

**`lpn_scncmp_at` no longer gates anything.** Tom ruled in conversation on 2026-09-06 — the English
stands as `{value} at {id}` — and his mark did not reach `dev/new-english-keys.md`, which is why the
harvester exists. The `$ec_lang_syn` half was PROPOSED and is still unwritten: it needs written
permission naming it, and has been put to him once, labelled.

---

## 5. THE NEXT THINGS, in the order I would take them

**Four questions are with Tom and each blocks a specific thing. None blocks everything.**

1. **Task 596 — lpn-only Help row, or a suite-wide `echoFooter()` link** for the Not EPANET site.
   Same 26 translations either way; the footer reaches fifteen more pages. Do not write the string
   before he answers, because the answer changes what the string may say.
2. **Task 465 — is a library pipe allowed to be something a `.inp` round trip loses?** A typed pipe
   flattens on export and cannot be rebuilt on import, so Task 281's byte-identical guarantee holds
   for the file's numbers but not for the TYPE. Curves escaped this because EPANET has curves. The
   first buildable slice (`effective()`, disabled-control rendering) can start before he answers.
3. **Task 574 — he may be able to unblock it cheaply.** Indices 16-22, 39 and 40 have no second
   source to match against, and guessing is what wrote `Duration 0.0` into a converted file the
   first time. EPANET persists PROFILES and CALIBRATION files; if either lives in that range it
   would explain the stray `1` and `First`. The test is one save-and-reimport by him.
4. **Task 602 — the engine label.** Recommended wording is *"Always solve with the EPANET solver"*,
   which keeps the checkbox polarity. **Do NOT invert it**: `settings.engine` is stored per project,
   so flipping the sense silently reverses every saved file that states one.

**Buildable now, needing nobody:**

5. **Task 599 — graph a value against time across an EPS.** The highest-value gap and the cheapest
   of the plot family, because the data already exists: a run keeps every reporting step. Draw it
   the way `lpn_profile_*` is drawn — no chart library, nothing vendored.
6. **Task 597/598 — table filters and dictionary-order comparison.** Reuse Find's predicate rather
   than writing a second one, and use EPANET's own words: Below, Equal to, Above (Tom's ruling).
   `Intl.Collator` with `numeric: true` for the string half, or P10 sorts before P2.
7. **Task 539 phase two — the gang move.** Phase one overturned the plan it was written against:
   across 28 drawings there are **9 leader-leader crossings against 76 label-on-leader**, so the
   segment-intersection test the roadmap proposed sees about a tenth of the problem. Build for the
   second trigger.

**Closed this session and named so they are not re-opened from habit:** 436 (arithmetic shed
pricing, tolerance relaxed on Tom's word to a measured 1.111%), 595 (digit keys select a tool),
591 (Not EPANET site deployed), 583, 593, 569.

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
