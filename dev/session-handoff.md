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

- `dev/new-english-keys.md` stood at **38 still to read, 115 untranslated** at the end of this
  session, all `lpn_`. It was **0 still to read** that morning; one day of EPANET work added them all.
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

## 4. STATE AS OF 2026-09-05 — perishable, check before trusting

**Shipped this day**, all with harnesses, all pushed: `[RULES]` (the language, per-clause unit
conversion, an editor), `[SOURCES]`, `[MIXING]`, `[TAGS]`, pump efficiency curves (read, honoured,
editable), Tag in Find and replace, example tags (Task 531), the label-crossing detector (Task 539
phase one), and four fixes from Tom's own browser passes.

**IN FLIGHT when this was written: the CURVES PARADIGM CHANGE.** One agent, one worktree. Tom's
instruction: *"move all pump curve data to the Library under curves and leave only curve references
in the pump properties."* If it has landed, verify against §5 below. If it has not, the brief is
reconstructable from this file plus `dev/ROADMAP.md`.

**Two defects found by surveying rather than by testing, both worth knowing even after they are
fixed:**

1. **A pump head curve of more than three points was destroyed on import** — sampled at its ends and
   middle, exported as three, and re-sampled again for the engine. Reported honestly as
   `pump-curve-reduced`, which is why it survived since July. Honest is not correct. The library is
   the structural fix.
2. **`replaceSpecs()` read only the pull-down state**, so after a compound typed query (`A OR B`)
   Replace wrote the PREVIOUS query's elements under a count the user had already approved. Wrong
   for every property since compound queries shipped. Fixed via `findRunQuery()`.

---

## 5. WHAT MUST BE TRUE WHEN THE CURVES WORK LANDS

Check these rather than believing a report:

- `doc.curves` holds every curve; **no element carries curve POINTS.** `curvePoints`, `curveRef`,
  `efficPoints` should all be gone from the document format.
- **All four EPANET types exist as library objects**, including `VOLUME`, even though a tank cannot
  yet USE one.
- **A curve nothing references survives a round trip.** The Library can create one now, so an
  orphan is legitimate document data and dropping it on save is the class of defect we spent this
  day fixing.
- **A curve's TYPE is read from EPANET's own `;PUMP:` / `;EFFICIENCY:` / `;VOLUME:` / `;HEADLOSS:`
  comment**, not inferred from what references it — inference fails for a newly created curve.
- **A five-point pump curve imports with five points and exports byte-identically.**
- **`curveId` is in `LPN_OVERRIDABLE.link`** and every READ of it goes through `effective()` — not
  only the write. The reads are the half that is easy to do partially: `pumpCurveSI()`,
  `docEnergy()`, `assembleModel()`, the exporter, the engine writer, and the Library's
  "which elements use this curve" list.
- **EPANET now gets the curve's real points** instead of a re-sample of our fit, so answers change
  for any file with a >3-point pump curve. That change should be MEASURED and stated somewhere, not
  silent.

---

## 6. THE NEXT THINGS, in the order I would take them

1. **Tom's reading of `dev/new-english-keys.md`**, then the sprint. Everything else is behind it.
2. **A tank USES its volume curve** — the last piece of "all of EPANET" and the one that may not fit
   before Sep 17. It is arithmetic, not plumbing: it changes the level-to-volume relationship the
   extended-period run integrates. The import note `tank-volume-curve` currently reassures the
   reader that only the level's movement over time is lost; that note predates EPS shipping, so a
   tank with a volume curve today runs an EPS that fills and drains on the wrong schedule.
3. **Task 539 phase two — the gang move.** Phase one measured it and overturned the plan: across 28
   drawings there are **9 leader-leader crossings against 76 label-on-leader**, so the cheap
   segment-intersection test the roadmap proposed as the opening sees about a tenth of the problem.
   Build for the second trigger.
4. **Priority 100 is otherwise empty of buildable work.** 545, 553 and 509 are done and awaiting
   Tom; 322 is advisory; 508 is a records task; 436's last piece is *"awaiting Tom's wording only"*.

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
