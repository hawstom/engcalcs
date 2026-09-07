# Session handoff — written 2026-09-05, state refreshed 2026-09-06 (third session)

**Read this, then `dev/ROADMAP.md`, then `dev/new-english-keys.md`.** It is a snapshot of one
unusually dense day and it goes stale fast: everything below is either a RULING Tom made (permanent
until he changes it), a TRAP measured on this tree (permanent), or a STATE (perishable, and dated so
you can tell). Delete a state line once you have checked it and it is no longer news.

---

## 1. THE CRITICAL PATH IS TOM'S READING, NOT YOUR BUILDING

**Tom, 2026-09-05: *"If we can implement it and have some serious review and translation before
Sep 17, that would be very cool."*** That is 12 days from the day this was written, and the thing
standing in the way is not code.

- `dev/new-english-keys.md` swung from **0 still to read** to 59 and back inside two days. **He has
  read everything outstanding: it stands at 0 still to read on 2026-09-06**, and the nine keys still
  untranslated all carry his ruling. Read the count from the script, never from this line.
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

## 2b. THE EDITORIAL REVIEW, 2026-09-06 — `dev/editorial-review.md` is the ONE file

Tom asked for a senior editor's reading of both public sites, ruled on all 23 findings the same day,
then asked for a second pass over the application's own pages and a third. **Everything lands in
`dev/editorial-review.md`** — one file, appended passes, keys never restarting (`EDR-`, `EDR2-`,
`EDR3-`), on his instruction: *"Let's avoid proliferating copies and let's try to honor One True
Copy of this."* Do not start a second file, and do not rewrite a `RULE` line he has marked.

- **THE ENGLISH THE PRODUCT SHIPS IS CLEAN AND THE MARKETING PROSE WAS NOT.** Swept: 1,697 shipped
  strings, **zero** marketing-slop words. Both sites, meanwhile, were announcing their own honesty
  in eleven places. Tom, on one clause: *"Methinkest thou boastest too much."* **Write the fact and
  stop.** Every clause praising the page's own conduct is gone from both sites, and the rule is in
  both working guides.
- **EDR2-01 IS DONE AND IS WORTH KNOWING ABOUT ANYWAY**: `lib/Language.Settings.php` had
  `Francais` and `Portugues` — two of the four CORE languages, spelled without their own
  diacritics, in the language menu of every page in all 27 languages, while every other name
  carried its accents and while librewaternet.org spelled both correctly. Fixed 2026-09-06. **The
  general lesson is that nothing checks LANGNAME against anything**, so the next one will be silent
  too; `language_declaration_check.php` asserts a LANGNAME exists and says nothing about what is in
  it.
- **EDR2-11, accepted as recommended (his words), so it is a standing note rather than a task:**
  67 em dashes remain in shipped English, concentrated in `privacy.php` and `terms.php` where they
  do real parenthetical work. The ratchet may fall and may not rise. **If a sprint touches those two
  pages for another reason, lower the baseline while you are in there** — do not open a sweep for
  it, and do not retranslate meaning that did not move.
- **Both site repositories are committed and NOT pushed**, deliberately: a push publishes, and the
  copy changed enough to be read first. `sh check.sh && git push` in each, then pull on the host for
  librewaternet.org.

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

## 4. STATE — rewritten 2026-09-06, third pass

**The curves paradigm change (Task 586) is verified and its checklist is gone rather than carried.**
`doc.curves` is the store; all four EPANET kinds exist as library objects; a tank USES its volume
curve. The harnesses assert it. Nothing here needs believing.

**THE TRANSLATION BACKLOG IS ACCUMULATING ON PURPOSE.** On 2026-09-06, after Task 605, it stood at
**31 CHANGED and 9 NEW**. **Read the two scripts rather than this line** — it is the number that goes
stale fastest in this file, and an earlier version of it sized a sprint against work that was already
done. **The judgement that keeps being re-made and should not be: do not sprint into churning
English.** Task 605 alone moved 25 shipped values, and the pipe library is moving more. One sprint
after the churn settles costs 26 agents; two sprints across it cost 52 and the first one's output is
partly thrown away. Accumulate, then propose once.

**`lpn_scncmp_at` no longer gates anything.** Tom ruled in conversation on 2026-09-06 — the English
stands as `{value} at {id}`. The `$ec_lang_syn` half was PROPOSED and is still unwritten: it needs
written permission naming it, and has been put to him once, labelled.

**THE SERVER HALF OF TASK 479 IS WAITING ON TOM AND ON NOBODY ELSE.** The code half shipped
2026-09-06: `ecSwMounts()` declares `/engcalcs/` and `/app/`, the worker's scope, its
`Service-Worker-Allowed` header and its fetch routing all derive from that list, and
`sw_scope_check.php` blocks on any of the four disagreeing. What remains is the symlink, the `/app`
rewrite and the `CANONICAL_ORIGIN` line, in that order, with the canonical change LAST because it is
the slow one to undo.

---

## 5. THE NEXT THINGS, in the order I would take them

**A SECOND ROUND OF RULINGS LANDED THE SAME DAY AND IS ALSO BUILT.** Task **605** retired the
built-in solver from view -- `epanet` is the default, the gallery banner lost its engine clause, and
25 English values stopped framing EPANET as one of two options; what deliberately SURVIVED is every
sentence a reader meets only when something has gone wrong, because a fallback that does not say
what answered is worse than one that does. Task **606** fixed the box-height cap that did not follow
its box. Task **178** closed on his word, with its filmstrip half extracted as Task 607. **His Help
menu order is now his own numbered list and is asserted**, which reverses where 596 put Not EPANET.
**The open question 605 leaves is the PRECACHE and it is his**: the ~664 KB engine is not in the
service worker's manifest, so a first-time visitor now fetches it on their first solve.

**FOUR EARLIER RULINGS WERE SPENT ON 2026-09-06 AND ALL FOUR ARE NOW BUILT. Do not re-ask, and do not
re-propose the alternatives they declined.** 596 shipped as an lpn-only Help row and **the
suite-wide footer link stays DECLINED**. 602 shipped as label (a) with the DISPLAY inverted and
`settings.engine` untouched in storage — a project stating `epanet` still selects EPANET and now
shows the box unticked. 479's code half is above. 574 is CLOSED, and the answer is that a profile is
in no `.net` at all: EPANET writes it to a separate `.PRO` file through an ordinary save dialog and
records the path nowhere, so reading one is Task 604 and there is nothing to recover from a project
file.

**THE PRIORITY 100 BAND IS NOW FIVE ROWS AND FOUR OF THEM WANT `js/looped-network.js`**, which is
the sequencing problem below stated as a fact about today's backlog rather than as a warning: 465
(library pipes, with 590's fittings picker resolving through the same `effective()`), 266
(multi-select, in epanet-js's three-mode paradigm Tom disclosed), 186 (spreadsheet tables, whose
selection model the `data-entry-clerk` has specified) and 322 (half B, the survey). **Two design
records were written on 2026-09-06 so the building does not have to re-derive them**:
`dev/pipe-library-design.md`, and the clerk's fourth journal entry for 186.

**Buildable now, needing nobody:**

1. **Task 599 — graph a value against time across an EPS.** The utility-planning-engineer ranked
   this joint first of the five plot rows on 2026-09-06 and its reason is worth carrying: every
   published master-plan hydraulic chapter it read reports results this way, and this suite can
   solve the run today and cannot hand over the chart. The data already exists — a run keeps every
   reporting step. Draw it the way `lpn_profile_*` is drawn: no chart library, nothing vendored.
2. **Task 603 — name the nodes on the profile axis.** Tied first in the same ranking, and cheap: it
   closes a real deficiency in a feature already shipped, because a profile with no names answers
   *where* and cannot answer *which junction*, which is the whole reason a profile gets read aloud.
3. **Task 600's cheap two thirds — frequency distribution and system flow balance.** A histogram is
   a sort and a bucket count. **The engineer ranked CONTOUR fourth, below both**, against Tom
   starring it: it is the only one with real geometry, and its own answer is that a filled contour
   must never be extrapolated past the convex hull of the nodes carrying the value.
4. **Task 539 phase two — the gang move.** Phase one overturned the plan it was written against:
   across 28 drawings there are **9 leader-leader crossings against 76 label-on-leader**, so the
   segment-intersection test the roadmap proposed sees about a tenth of the problem.

---

## 7. THINGS NOT TO DO

- Do not launch a translation sprint without explicit authorization in that conversation.
- Do not touch `$ec_lang_syn` without written permission in that conversation. No standing carve-outs.
- Do not regenerate `dev/translation_payloads/` from a subagent. The orchestrator does it once,
  before the commit. A subagent's `payload freshness` failure is EXPECTED and is not its to fix.
- Do not run two tracks in `js/looped-network.js` at once and call it parallelism. Measured again
  2026-09-06: four of the session's five candidate tasks all wanted that one file, so they were
  SEQUENCED and the only genuinely parallel track was the one that touched `js/lpn-net.js` and
  `dev/`. A worktree is justified by concurrency, and there was less concurrency available than the
  backlog made it look.
- Do not put four agents in `js/looped-network.js` at once. Two with named seams worked; the merge
  conflicts that did happen were all in the GENERATED `dev/new-english-keys.md`, which regenerates.
- Do not tell Tom a browser test that has not been run headlessly first. Three instructions this
  session were wrong — a file with no `[TIMES]` duration that could not show an energy report, a
  unit switch described as converting, and File > Open where the page says Import.
