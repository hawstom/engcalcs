# Session handoff — written 2026-09-05, state refreshed 2026-09-08 (fourth session)

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
- **COPY-ASIDE-AND-RESTORE ON A SHARED FILE DESTROYS THE OTHER SESSION'S LINES, and it is a
  technique this project INVENTED and then got bitten by, on 2026-09-06.** Two sessions were editing
  `lib/lang.ec.en.php`. To commit its own change without sweeping the other's uncommitted work into
  the commit, one session copied the worktree file aside, reset it to `HEAD`, re-applied only its own
  edits, committed with a pathspec, and copied the saved file back. **Every line the other session
  wrote during that window was in neither copy and was silently gone** -- three language keys,
  already written and verified, found only because a harness reported them dangling. **The technique
  is correct only while nobody else is writing that file**, which is exactly the condition under
  which it is not needed. Where two writers are live: commit the whole file and DISCLOSE what of
  theirs it carries, or wait. Do not reach for the dance.

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

## 3c. THE 2026-09-06 ORCHESTRATION SESSION — what it decided, in one place

**Six rulings of Tom's, all built, none to re-ask:**

- **Task 605: the built-in solver is retired FROM VIEW, not from the code.** `epanet` is the
  default, the gallery banner lost its engine clause, 25 English values stopped framing EPANET as
  one of two options. **What deliberately SURVIVED is every sentence a reader meets only when
  something has gone wrong** -- a fallback that does not say what answered is worse than one that
  does, and the built-in solver is still what answers when the module cannot be reached, which IS
  the offline promise.
- **Task 608: the engine is fetched BEFORE anybody is waiting**, silently, as soon as there is a
  solveable network or a Calculate; and Tom's own banner shows while a network that only EPANET can
  solve is loading it. **THE CHECKBOX IS NOT DISABLED, and that reversed his own first
  instruction** -- he withdrew it the same day, because the tip on that row already names both
  cases permanently, so the greying was a conditional duplicate bought at the price of a control
  that flickers as you draw. `lpn_settings_engine_native_off` was deleted with it.
- **Tasks 465 and 590: pipe types and fittings, one indirection from two ends.** Detach STAYS
  (*"fatal if Detach didn't exist"*); attaching a type DESTROYS the pipe's own numbers.
- **The EPANET-mention rule, and it is now the standing test for any string**: *an EPANET mention
  earns its place when it explains something the reader is experiencing right now, and does not
  when it answers a question they did not ask.* Written up with worked examples in
  `dev/language-strings.md`. It struck two round-trip sentences and KEEPS the whole
  `lpn_inp_drop_*` family.
- **Task 479.01: the canonical split is closed** -- one address, `https://librewaternet.org/app/`,
  from every door on both hosts.

**Three traps measured this day, each of which cost something:**

- **COPY-ASIDE-AND-RESTORE ON A SHARED FILE DESTROYS THE OTHER WRITER'S LINES.** Recorded in full
  in §3 above. It was invented in this session and bit in this session.
- **TWO CORRECT CHANGES, HOURS APART, MADE A LIVE DEFECT.** 479.01 declared the canonical `/app`;
  the manifest work then made `/app` 301 to `/app/`. Together, every page and all 545 sitemap URLs
  nominated an address that redirects. **Neither was wrong when it was written, and no check saw
  it** -- it was found by curling the live site. The rule is now agreement with the mount, and the
  latent half is the lesson: `ecSwMounts()` had said `/app/` since the mount existed, so an
  exact-match rule would have caught it on day one.
- **A COUNT CATCHES WHAT READING DOES NOT.** A scripted roadmap edit with a careless range nearly
  deleted nine task blocks; `roadmap_id_check.php`'s open-task count fell from 54 to 45 and that is
  the only reason it was noticed. **Bound a scripted block replacement by LINE NUMBERS you have
  just printed, never by `index()` of the next heading you assume follows.**

## 4. STATE — written 2026-09-08, sixth session

**Tom's two 2026-09-08 messages are the worklist**, item by item in
`dev/tom-2026-09-08-worklist.md` with DONE / RUNNING / NOT STARTED against each. Read that first.

- **THE PARENT SITE hawsedc.com HAS NO CLONE AND NO ORIGIN. Production is the only copy**
  (Tom, 2026-09-08). That is a single point of failure and it outranks the repository split he
  asked about: get a second copy off that host, then give it an origin, then split it whenever.
  **Its history is unvetted for secrets**, so a GitHub origin must be PRIVATE. He also cannot reach
  it over SSH on port 22.
- **AI commits carry `--author="Claude Code for Tom Haws <tom.haws@gmail.com>"`** (CLAUDE.md).
- **Style guide is APA, not Oxford.** `dev/language-strings.md` has the list.
- **THE TRANSLATION SPRINT IS AUTHORIZED IN THIS CONVERSATION AND IS GATED ON TOM'S READING, NOT
  ON US.** `new_english_keys.php` says **61 still to read, 84 untranslated** after the second lpn
  batch; `detect_english_drift.php` says 132 changed. Launching before he has read them is what
  sprint 459 threw away. Read the count from the script, never from this line.
- **Screenshot 0082.PNG is in `dev/screenshots/`** and is Tom's centerpiece (Task 612). NOT DONE.
- **The favicon concepts are waiting on Tom's eyes, not on code**
  (`dev/icon-preview/concepts-2026-09-08b.html` is a preview, not an approval).
- **`dev/positioning.md` §6 cites epanet-js as precedent for our LibreEPANET name.** His 2026-09-08
  ruling on the EPANET name undercuts that precedent; ask him before editing. The market
  researcher re-verified the licence facts that day and the file is NOT stale: EPANET is public
  domain, the epanetjs.com app is FSL-1.1-MIT, the toolkit we vendor is plain MIT. **New finding**:
  the upstream repo now mixes MIT with FSL-1.1-MIT for post-fork contributions, and
  `js/vendor/README.md`'s upgrade steps carry no licence re-check.
- **DELETE THESE ONCE CHECKED — they were state and are now history.** The lpn naming beacon IS
  wired (`d740aa20`, verified at `js/looped-network.js:18901` and :21386). Both agent worktrees are
  gone. Task 266 is CLOSED on Tom's own browser pass.

## 5. THE NEXT THINGS, in the order I would take them

1. **Tom's browser pass on the second lpn batch** (`c25b6410`) -- eight numbered checks were given
   to him and none has been confirmed. The pipe/pump grab band is the one to hear about first: it
   ships at `LPN_LINK_HIT_PX` = 12 screen px and the right width is a judgement only he can make.
2. **Task 539 gang labels, at 100 with a deadline.** His sketch is `dev/label-placement-algorithms.md`
   §9, verbatim; his own flag on it is that he waved his wand over finding `spot_prime` and wants to
   be told if that part is hard. **Report back before building it.** The `utility-field-operator` was
   asked on 2026-09-08 whether crossing leaders is even the right defect to spend the nine days on.
3. Task 611 library import; Task 599 time series; Task 592 CSV junction import; Task 247 customers
   first slice. **All on `js/looped-network.js`, so sequential** -- see §7.
4. Translation sprint once he has read, then `detect_english_drift.php --baseline-new`.
5. Task 612 screenshot placement. CLAUDE.md's `web_manifest_check.php` row still describes the old
   `/app` ratchet, and `README.md:137` and `dev/hosting-layout.md` §3 predate the canonical
   consolidation.

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
