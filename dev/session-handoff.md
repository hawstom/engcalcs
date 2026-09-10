# Session handoff — written 2026-09-05, state refreshed 2026-09-08 (fourth session)

**Read this, then `dev/ROADMAP.md`, then `dev/new-english-keys.md`.** It is a snapshot of one
unusually dense day and it goes stale fast: everything below is either a RULING Tom made (permanent
until he changes it), a TRAP measured on this tree (permanent), or a STATE (perishable, and dated so
you can tell). Delete a state line once you have checked it and it is no longer news.

---

## 0. IF YOU READ ONE SECTION, READ §6 — it is 2026-09-10 and newer than everything else

The file is append-only by design: §1-§3c are 2026-09-05 to 09-06, §4/§4b are 09-09, §4c and §5 are
09-10 morning, and **§6 is the current state.** Where an older section disagrees with a newer one,
the newer wins and says so.
**Every count in here is stale by construction. Read counts from the scripts.**

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

## 4. STATE — written 2026-09-09, after a long orchestration session

**Everything below is on `origin/master` and the tree is green.** Read the counts from the scripts,
never from this line.

### The two repositories

- **engcalcs is clean.** Five lpn batches landed, a 26-language sprint closed, and `check_all.sh`
  passes. **5 English keys still to read, 6 untranslated, 137 CHANGED** -- that last number is
  PRE-EXISTING drift needing a RESYNC sprint, not a delta, and no urgency was attached to it.
- **THE PARENT SITE `hawsedc.com` WAS DOWN FOR WEEKS AND NOBODY KNEW.** Twelve pages in
  `addon_html/hawsedc.com/gnu/` called `echoHawsEDCHeader()` while requiring `edc.lib.php`, which
  loads engcalcs and does not define it. Fixed. **The lesson is not the bug, it is that nothing was
  looking**, which is why `~/check.sh` now exists.
- **`/home/jconstru` is NOT huge and NOT unbacked** -- 246 commits, 60 MB, a Bitbucket origin over
  port 443. Tom asked about splitting it; **the answer is don't.** `addon_html/<domain>/` already
  separates the sites, librewaternet.org and not-epanet.org are already their own repos, and npsge is
  13 files. What made it look like a mess was 2,105 staged-but-uncommitted renames plus four
  `.gitignore` rules pointing at pre-move paths. Both fixed.

### The server, which is reachable now

- **`ssh jconstru`** works from this machine (74.81.90.155 port **15554**, key auth, alias in
  `~/.ssh/config`). Every other SSH port is firewalled.
- **`~/check.sh`** fetches 613 URLs across 12 docroots and mails only on failure; cron 04:20 daily.
  Run it by hand with `ssh jconstru 'sh ~/check.sh -v'`.
- **CRON MAIL HAD BEEN DEAD FOR YEARS AND 800+ BOUNCES PROVE IT.** `minter.nocdirect.com` publishes
  no SPF, so Gmail rejected every `MAILTO` message; the log-chain alarm could never have reached
  him. **Pointing MAILTO at a forwarder does NOT fix it** -- measured -- because forwarding keeps the
  original envelope sender. The fix is `~/cronmail.sh`, which sets `-f tom@hawsedc.com`; all four
  jobs now pipe through it and Tom confirmed delivery.
- **`git push` on that host is blocked by this session's sandbox.** Tom pushes.

### Rulings Tom made this session — do not re-ask

- **The four seats have NAMES and he was not joking**: Sue (utility-planning-engineer), Declan
  (data-entry-clerk), Mary (market-researcher), Franco (utility-field-operator). **Each name is now
  the first line of that agent's own journal**, because the journal is the only file it reads.
- **A catalogue name may keep its English beside the translation** (`dev/language-strings.md`), and
  **prefer what the trade prints over a nativized paraphrase** -- Turkish `Swing çek vana`, sourced
  by Sue to seven manufacturers, replaced our `Menteşeli çek vana`.
- **`$ec_lang_syn` IS NOT A COMMENTARY CHANNEL.** He caught an orchestrator putting prose right of
  the pipe: *"I didn't intend _syn to be a dictionary, encyclopedia, or commentary."* The rule was
  already written at `dev/language-strings.md:190` and says commentary uses a CLOSED TAG VOCABULARY.
- **"Limiting potential" is purged**; EPANET's own help says Limiting Concentration. The `.inp`
  keyword is untouched, because it is the file format.
- **Net1 keeps its two rules and the gallery entry was renamed** so it stops claiming to be plain
  EPA Net1.
- **Go to accepts `38,122` and `38.122`**, overruling a refusal, and he rejected the tip
  clarification: *"nobody thinks that a single number is a lat/lon."*
- **Help wording is "use Help"**, bypassing the two-Help-buttons design flaw rather than encoding it.
- **`wt-wide-long-walk` is the approved icon**, plus a wanted `wt-wide-long-walk-L`.

### TRAPS MEASURED THIS SESSION — each cost real time

- **THE HARVESTER WAS BLIND TO HIS RULINGS BECAUSE THE RULE TOLD YOU TO COMMIT THEM FIRST.**
  `CLAUDE.md` says commit his marks verbatim before anything else; `harvest_english_rulings.php`
  diffed against `HEAD`. Obeying the rule made the script report "nothing unharvested" about a file
  full of his handwriting. **It takes `--baseline=HEAD~1` now**; use that immediately after
  committing his marks. Two correct halves, one silent loss.
- **THREE HARNESSES PINNED ENGLISH WORDING AS LITERALS AND BROKE ON HIS REWORDINGS.**
  `fittings-harness.js` asserted `/none of them changed/`; `reaction-globals-harness.js` asserted
  `/Limiting potential/i`; `dev/browser-pass/specs/goto.js` carried four copies of `lpn_goto_bad`.
  **Assert against `EngCalcs.pageConfig.<key>`**, which the DOM stub loads from the real language
  file. There are probably more: it is a countable construct and worth a sweep.
- **FOUR BUGS SHIPPED WITH GREEN HARNESSES AND BROKEN BROWSERS** in one batch. Each time the stub
  removed the coupling: `getBoundingClientRect()` returned a constant whatever was written to
  `style.left`, so a box could never be found to be off-screen; no harness combined `addText()` with
  an open pane; a ResizeObserver was never flushed. **Teach the stub the one physical relationship;
  do not add assertions.**
- **A FLICKERING CURSOR WAS AREA, NOT A RACE.** 23,821 sampled points: draggable labels claim 6.5%
  of the canvas with `move` while everything saying `pointer` claims 3.2% and node discs just 0.2%.
  Zero mutations, zero `style.cursor` writes. **Instrument before believing "the browser is slow."**
- **`dev/browser-pass` IS NOT RUN BY `check_all.sh` AND HAS ROTTED** -- `find`, `pane`, `toolbar`,
  `setbox`, `smallscreen`, `place` all carry stale expectations. Same shape as the site being down:
  nothing was looking.
- **TWO PRESSURE CONVERSIONS EXIST AND NOTHING COMPARES THEM.** `js/lpn-inp.js` has
  `PSI_M = 0.703070` (EPANET's 2.3067 ft/psi, correct for the file) against `$ec_units`
  `0.70324961`. `unit_factor_check.php` reads the PHP only. An edited emitter coefficient moves by
  ~4e-7; an untouched one is exact by pass-through.

## 4b. THE 2026-09-09 ORCHESTRATION SESSION — five agents, everything pushed

**Everything below is on `origin/master` through `f5ed6fdb` and `check_all.sh` is green, exit 0.**
Read every count from its script, never from this line.

### Tom's three instructions of the day, all built

- **THREE MAP CURSORS, one sentence each** (his words: *"the move cursor has a huge hit box. We need
  a cursor with an infinitesimal hitbox"*). Bare map `grab`; an object under Select `pointer`; any
  placement tool or the area picker `crosshair` over the whole drawing. **`move` is now banned
  anywhere under `#lpn_canvas`** -- the two things wearing it were the draggable label and the vertex
  grip, the smallest targets on the map, so a ~24 px four-headed arrow with a centred hot spot was
  covering exactly what it was aimed at. `delete` deliberately keeps `pointer`: that press acts on
  the object under it. The class is derived from the mode string and written in ONE place, which is
  what stops it sticking the way `lpn-panning` did.
- **ONE TITLE BAR ON EVERY NON-HOGGING BOX**, and his hope that *"the list of non-hoggers is neatly
  presented as an array"* is answered by there being NO list. All ten boxes are `padding: 40px ...`
  with a `.lpn-setbox-title` already in them; only Properties had a visible bar because the divider
  was `#lpn_popup::before`. The divider belongs to the class now and that rule is deleted.
  `dev/lpn-spike/map-cursor-harness.js` holds both, and fails if a ninth tool is added without
  someone deciding its cursor.
- **THE `wt-wide-L` ICON SHIPPED** to the lpn Water menu and to both sibling sites' favicons. §5a
  has the open half and the size measurement.

### Task 539 gang labels: BUILT AND MEASURED, `spot_prime` NOT built

`Collide.repairCrossingGangs()`, a repair pass after every other placement. Both of Tom's routes
built and selectable so they could be compared rather than argued about. **Net3-World at the fit
zoom: 7 pairs -> 5, and 43 -> 31 over its four views.** *(His intuition was right and it is
measurable: the GANG route alone is the whole of that gain at the fit zoom -- 7->5 against brute's
7->7 -- while at 2x it is brute that helps, which is why both ship.)*

- **SCORING THE CROSSING COUNT FIRST MADE IT WORSE, and that is the finding to keep.** It let the
  repair buy back what the first-fit had deliberately refused and **raised** Net3-World from 7 to 9.
  It is a GATE plus a ranking now: a trial may not raise hard-obstacle blocking or label-on-label
  above what the layout already had.
- **`spot_prime` was reported on rather than built, as Tom asked.** The gain came from the half of
  his sketch that needs no `spot_prime` at all -- a gang's existing slots are open ground the
  first-fit already found. The blocker if it is ever wanted: **free space is a PER-VIEW quantity**,
  since link labels appear, shed and yield with the zoom, so a tile-indexed precomputation describes
  the DRAWING and not the view being labelled. And `text_size_largest_perfect_fit` is a separate
  feature (automatic text sizing) that should be judged on its own. Full record:
  `dev/label-placement-algorithms.md` §10.

### Task 322 half B: the counting method found four rounded constants

**`unit_factor_check.php` re-derives every `$ec_units` factor and had never read a line of
JavaScript.** `js/lpn-inp.js` carried `CFS`, `MGD` and `PSI_M` as typed decimals and
`js/lpn-solver.js` divided by a rounded `0.0283168466`. All four are derived expressions now and
`js_constant_check.php` is a ratchet at zero.

- **THE HANDOFF'S OPEN psi QUESTION IS ANSWERED: it was a DEFECT, not a deliberate difference.**
  `PSI_M = 0.703070` was never EPANET's constant -- EPANET's `PSIperFT` implies 2.3079 ft/psi and
  that literal implies 2.3067. It was simply the exact physical value typed to six places. The
  correction moves it by 6e-7 and derives from the same `lbf` and `g` `lib/Units.lib.php` uses.
- **ONE TOLERANCE WAS LOOSENED AND IT IS THE BATCH'S ONE JUDGEMENT CALL.** `validate.js`'s Net3
  continuity bound went 1e-9 -> 5e-9 because the exact `lpnGradMin` moves the last iterate from
  5.04e-10 to 1.32e-9. Checked before it was accepted: Net3 has no emitters so psi cannot be the
  cause, Net1/Net2 stay at 1e-13, EPANET's own residual there is 3e-8, and heads are still held to
  0.01 ft against EPANET. It is how far our iteration ran, not whether it is right.

### `dev/browser-pass` is repaired: 1098/1098, 40/40 sections, exit 0, 807 s

It was 26 of 40 sections red. **Every failure was a stale spec, not a product defect**, and 14 of
them were specs pinning Tom's English. `Session.lang(key)` now reads `EngCalcs.pageConfig[key]` and
**throws** on a missing key, so a silent `undefined` cannot turn a check into a check of nothing.

- **[H] A REAL REACHABILITY REGRESSION, FROM TOM'S OWN OVERHANG RULING.** Boxes keeping their
  overhang replaced `clampPanel()` with `restoreBounds()`. Measured: a 634 px Settings box at left
  1200 in a 1400 px window puts its resize grip at **x = 1834, off the window**, unpressable until
  the box is dragged back by its band. The check that used to prevent this said *"a box near the
  right edge grows its own grabber off the window and can never be shrunk again"*. It IS recoverable,
  so it is not broken -- the spec asserts the overhang AND the recovery, and notes the grabber. **He
  has been told. Do not change it without him.**
- **A HELPER DEFECT HAD BEEN LOOSENING EVERY GUARD IN THE SUITE.** `Session.nodeCount()` counted
  `.lpn-symbols > *`, and the node grab band (`.lpn-node-hit`) doubled every junction, so every
  "at least N nodes" guard had been passing at half strength.
- **DO NOT PUT THE FULL SUITE IN `check_all.sh`.** 807 s against seconds for everything else;
  thirteen minutes on every commit turns "run it before every commit" into "stop running it", which
  is how it rotted. The unbuilt recommendation is `check_browser.sh` over
  `boot menu place pane toolbar visibility` (~2 min), where 11 of the 14 rotted sections lived,
  before any commit touching `js/looped-network.js`, `Looped-Network.php` or `lib/lang.ec.en.php`.
- Noted, not fixed: the comment above `lpn_clean_map` in `lib/lang.ec.en.php` still argues for
  *"Reduce map clutter"* against the value it now guards; a later wave-0 pass reversed it.

### The harness wording ratchet: 199 pins -> 52

The sweep §4 asked for. 111 became key reads, 27 became structural assertions (an ORDER, a COUNT, a
pattern with `{placeholder}` left open), 18 are DECLARED exceptions keyed on file **and exact
literal** with a written reason each -- and a declaration matching nothing now fails the check.

- **FOUR ASSERTIONS WERE NAMING THE WRONG KEY AND PASSING ANYWAY**, which is exactly the failure the
  exercise was for: `/nothing would change/` is in BOTH `lpn_push_no_change` and
  `lpn_scenario_push_none`, and `/Connect to the internet/` in BOTH `lpn_engine_unavailable` and
  `lpn_time_no_engine`. One leg was vacuous.
- **The 52 that remain are all in `dev/browser-pass/`.** `msgRe(key)`/`langRe(key)` in the lpn-spike
  harnesses are the pattern for the placeholder cases; `georef-twopoint-harness.js`'s `langValue()`
  is the pattern for a file that loads no stub.

### THE TRAP THIS SESSION MEASURED, and it is §3's trap in a new costume

**A SUBAGENT RAN `git stash` AND SWEPT TWO OTHER SESSIONS' UNCOMMITTED WORK.** Not copy-aside this
time -- a plain `git stash` run to get a clean tree for a green `check_all.sh`. Everything was
recovered from `stash@{0}` and re-applied, and nothing was lost, but only because it was noticed
within minutes.

- **The rule that keeps three sessions safe in one directory is one line: `git commit <explicit
  paths>`.** It commits your files and leaves everybody else's working tree alone. **Never `git
  stash`, `git add -A`, `git checkout -- .` or `git reset`** -- and put that in every subagent brief,
  because the agent that did it had read `CLAUDE.md`'s "stage explicit paths" rule and did not read
  it as covering `stash`.
- **A FAILING CHECK IN A FILE YOU DID NOT TOUCH IS ANOTHER SESSION MID-EDIT.** That is what provoked
  it. Re-run, or run only the checks covering your own files. Do not clean the tree to get a green
  run. `check_all.sh` reported different failing harness sets on three consecutive runs this session
  and every one of them passed alone.


## 4c. THE 2026-09-10 SESSION — Tom tested by hand all day; everything is pushed

**All three repositories are pushed and `check_all.sh` is green.** Read every count from its script.
`dev/new-english-keys.md`: **0 still to read.** `friction_check.php`: **exit 0** -- the sprint gate is
CLEAR for the first time in weeks. English drift: **139 CHANGED, 7 NEW**, awaiting a resync sprint
Tom has NOT yet authorized.

### His rulings this day — do not re-litigate

- **THE MAP CURSOR IS SETTLED AND THE SHIPPED HYBRID STANDS.** His own summary: *"menus are pointer,
  map is grab, select menu depicts a default, and select is default, which is precise, serious, and
  consummately functional."* Bare map `grab`, an object under Select `default`, any placement tool
  or the area picker `crosshair`.
- **NO SLOP FOR NODES.** *"No slop for nodes. Slop for labels and to enforce a lower limit of 3 px
  for link lines."* A node's hit area IS its drawn ink on a fine pointer; a coarse pointer keeps a
  12 px skirt round the same shape, which he did NOT rule on and may overrule.
- **A NODE OUTRANKS A LINK SYMBOL, and that policy is not to be changed** (*"Somebody has to win.
  There's no compelling reason to change the standing policy that it's the nodes."*). A merge broke
  it silently and it is restored by a dedicated `linkSymbolLayer` between links and nodes, so a
  symbol is above every pipe and below every node BY CONSTRUCTION.
- **EXACTLY TWO ICONS DEPICT A CURSOR AND EACH NOW DEPICTS ITS OWN**: `select` is arrow-and-arrow,
  `select-area` is crosshair-and-crosshair. **It is NOT a suite-wide rule** -- *"vertex and
  everything else is not a place for depicting a cursor. So your question kind of falls on a deaf
  suite."* Every other icon depicts the THING and owes no promise. Do not open a consistency sweep.
- **A PAN TOOL IS REJECTED OUTRIGHT** (*"Strongly opposed. Simply unnecessary and wasted prime real
  estate. And not 2026-like."*). Reasoning kept in Ida's wish list so it is not reinvented.
- **"Start fresh"** replaced "Erase everything on this page"; `lpn_confirm_wipe` restates the label.
  He refused "Clear cache" and the reason generalises: it is the most familiar phrase and it is a
  LIE, because this deletes saved projects.
- **The consent banner says "cookie"** (*"That is the word people know."*). Verified true before
  writing: it IS a cookie holding one base-32 digit per page. **No `EC_CONSENT_VERSION` bump** --
  nothing stored moved. `$ec_lang_syn['consent_body']` updated with his written approval.
- **IDA IS THE INTERFACE DESIGNER**, named 2026-09-10, fifth seat. Her subject is visual HIERARCHY.
  Standing brief: **diagnose and rank, never redesign.**

### What shipped

- **Task 618 hit areas, his own five-row acceptance table, all true now.** Reservoir and tank had
  TWO circular hoggers (the band AND the unpainted `.lpn-node` disc, which carried
  `pointer-events: visible` in its own right). Pump and valve were HOLES: the rect had a size and
  `visibleFill` did answer, but it sat under `nodesLayer` and the end nodes' discs took every press
  -- clicking a volute selected `node Lake`. Hit shapes are the drawn silhouette now.
- **The cursor on the ink.** `.lpn-node-hit` and `.lpn-link-symbol-hit` carried `cursor: inherit`
  from when they were slop; once they became the ink they told the reader the map was pannable while
  they pointed at an asset. **The rule: the shape that IS the ink carries the object cursor; only
  slop inherits.** `.lpn-link-hit` is still slop and still inherits.
- **`pointer-events: visible` is back and is SAFE ONLY because every stroke width is now DECLARED
  with a ZERO fallback.** The 846 px defect was an UNDECLARED width defaulting to one world unit.
  Never restore `visible` on a shape without a declared width.
- Task 539 stands at **zero crossings on every example at every measured zoom**, layout identical
  over five passes. Tom, on a screenshot of a clean gang column: *"we are in a pretty good place
  now. We can try harder after EWB."*
- The suite nav went absolute (`nav_link_absolute_check.php`), the language menu now keeps you at
  `/app/`, every page emits its own favicon, the Titles highlight runs 120 s, and Erase everything
  clears `lpn_areahint`.

### TRAPS MEASURED THIS DAY

- **I RELAYED AN EXPLANATION THAT CONTRADICTED HIS DIRECT OBSERVATION, TWICE.** He said he had
  zoomed in with no node on the map; I twice passed on "the node discs covered the volute". **When a
  user's own measurement rules out a mechanism, the mechanism is dead** -- do not repeat it because
  an agent measured it somewhere else.
- **FOUR WRONG HYPOTHESES IN ONE EVENING** on the cursor-arrow report: stale scale, hidden labels,
  a symbol-size lattice, fractional-DPR seams. Each cost him a knock-down. **Generating theories
  faster than evidence is the failure**; the instrument settled it in one paste.
- **WHEN A DEFECT WILL NOT REPRODUCE IN THE HARNESS, ASK WHETHER SOMEBODY ELSE'S PAGE SHOWS IT.**
  Tom checked epanetjs.com and it does the same thing, which eliminated every shared cause in one
  observation. See Task 619.
- **AND SOME THINGS ARE UNREACHABLE FROM THE HARNESS BY CONSTRUCTION, WHICH IS WORTH KNOWING BEFORE
  SPENDING A DAY.** A Windows mouse delivers its position in PHYSICAL device pixels and Chrome
  divides by the scale factor before the page sees anything; Playwright injects through CDP in CSS
  pixels, so that division never happens in `dev/browser-pass`. **No headless run at any
  `deviceScaleFactor` can exercise the OS input path.** Task 619 is the worked example: four
  hypotheses and roughly 3 M samples died against a mechanism the instrument cannot see.
- **A LOGGER THAT CATCHES A CONTROL AND MISSES THE PHENOMENON IS THE FINDING**, not a broken logger.
- **`collide-harness.js` CARRIES A LOAD-SENSITIVE TIMING ASSERTION AND IT IS BLOCKING.** "the pass
  is linear" measured **1.07x / 1.15x / 1.23x** run alone and **2.11x** while a full `check_all.sh`
  was loading the machine, where it fails. Same class the README already records for `perf.js`, but
  that one is in `dev/browser-pass` and this one BLOCKS a commit. **A red there is environmental
  until proven otherwise -- re-run it alone before believing it.** Worth making load-proof.
- **DO NOT CHAIN `check_all.sh` AND `git push` WITH `;`.** Done here on 2026-09-10: the suite
  printed a FAIL, the push ran anyway, and it was only caught by reading the output afterwards. The
  failure was a flake, so nothing was harmed, which is exactly why the habit survives. Read the
  result, THEN push.


## 5. THE NEXT THINGS, in the order I would take them

**Rewritten 2026-09-10. EWB IS 16 SEPTEMBER AND TOM'S OWN PLAN GOVERNS:** *"4 days of bugs, then 2
days of translation, not earlier."* Translation freeze **14 Sep**; he keeps the right to tweak
English until then. He explicitly declined an earlier sprint. **Nothing below is a reason to break
that.**

1. **THE SPRINT GATE IS CLEAR AND THE SPRINT IS NOT AUTHORIZED.** 0 keys to read,
   `friction_check.php` exit 0, 139 CHANGED + 7 NEW awaiting a resync. **Earliest sensible date is
   13 Sep.** Propose, confirm, launch -- never infer authorization. 26 languages, 20 concurrent.
2. **Bugs only until the freeze**, and only ones a real person hit. Three people tested this week:
   PCW, MJH and Tom. Their reports are in Tasks 615, 616, 618 and 619.
3. **Task 612 screenshot 0082** still waits on the file itself.
4. **Two things he has been told about and has not ruled on:** the maskable icon background (§5a)
   and the Settings-box resize grabber his own overhang change put off the window (§4b).

### After EWB — the lull he asked for, in the order he raised them

5. **`dev/label-placement-dictionary.md` is a REVIEW DRAFT waiting for him.** 26 entries, a 10-item
   decision list at the end. **He asked for it to be cut shorter** (*"it's a dictionary, not an
   encyclopedia ... have mercy on the poor, slow, tired human reader"*) -- that trim is owed and is
   not done. His own terms to adopt: **right-of-way** (between two labels), **needy/wealthy**
   (replacing the undefined "high order"), **interesting** (the umbrella over the salience rules).
   The one place the draft argues with him: **"stacked" should keep its cartographic meaning of
   MULTI-LINE**, because that is Maplex's, and the group of labels needs a different word.
6. **The free-space model, which is HIS design and better than what is built.** *"a simple 'No
   vacancy here' fill-in-the-slots model"*, filled clerically as labels land, carried between zooms
   with an area-wise scale factor, used as a HINT (*"not a prime place to look at this time"*) with
   the exact test still run before anything commits. Today the tiles index OBSTACLES only; nobody
   has ever asked them where there is ROOM.
7. **Right-of-way is used for two jobs that want OPPOSITE orders, and he re-derived this himself.**
   Fitting wants the most CRAMPED first (choose while choices exist); dropping wants the least
   IMPORTANT first. One salience ordinal does both. **Nothing measures congestion at all today.**
   The experiment is cheap: place in salience order, place in most-constrained order, count what
   drops.
8. **745 DOM writes per wheel notch on Net3, where a handful would do.** Sizes that are the same
   formula for every element of a kind can be CSS expressions over one posted number, the way
   `--lpn-sym` and `--lpn-lw` already are; positions and rotations are genuinely per-element and
   must stay. **The poison is that `r`-as-a-CSS-property is SVG2** and degrades silently on old
   browsers -- `.lpn-vertexmode .lpn-vhandle` already documents that. Measure with `specs/perf.js`
   before and after.
9. **Ida's four-bar chrome diagnosis**, her standing brief, still unstarted: suite chrome, menu bar,
   toolbar, tab strip. Two of three testers never saw the menus. **Diagnose and rank, never
   redesign.** Her wish list also holds the hover-highlight (AutoCAD `SELECTIONPREVIEW`, Figma
   "Highlight layers on hover") and her 617 basemap answer: a two-option select in Settings > Map
   appearance, NOT a sixth widget in the lower-left corner, which is already the busiest overlay.
10. **Task 615, the icon.** `wt-wide-L` ships; `ic-tall3-steel-overcast` is his front runner and
    measures FAVICON at 16 px since the descender fix. Sheet:
    `dev/icon-preview/concepts-2026-09-09-color.html`. Three votes, three answers, one of whom sees
    a lavatory sink.
11. Task 611 library import; 592 CSV/GPX survey import; 599 time series; 247 customers -- all in
    `js/looped-network.js`, so sequential.


## 5a. THE MASKABLE ICON BACKGROUND, still Tom's and still unasked-and-answered


**THE ICON IS DEPLOYED EXCEPT FOR THE MASKABLE PNGs, AND THAT ONE GAP IS A REAL OPEN QUESTION,
   not a missing chore.** Tom chose `wt-wide-L` from `dev/icon-preview/concepts-2026-09-08b.html`
   and on 2026-09-09 asked for it *"as the favicon for LibreWaterNet.org and NotEPANET.org and as
   the Water menu icon for lpn."* All three shipped that day. **The concept is a STROKE GLYPH on
   transparent, drawn in `currentColor` -- no background, no tile, no colour of its own**, which is
   why those three uses were straightforward and the fourth is not.
   - **STILL OPEN, AND IT IS HIS DECISION:** `icons/icon-192.png` and `icon-512.png` are declared
     `purpose: "any maskable"` in `lib/WebManifest.lib.php`, so they need an opaque background and a
     safe zone or Android crops them. A transparent stroke glyph cannot be a maskable icon as it
     stands. **What background does he want behind it, if any?** Inventing one is exactly what went
     wrong before: an orchestrator carried the existing `icons/icon.svg` blue EC tile over onto his
     glyph without saying so and showed him the result as his icon -- *"I don't know what you are
     looking at. Here's what I see. You are hallucinating badly."* That deployment was reverted.
   - **ALSO HIS, AND MEASURED RATHER THAN GUESSED: `wt-wide-L`'s own verdict on the proof sheet is
     `MENU ONLY`**, and its `why` reads *"Culled as a favicon. At 16 the L foot lands on the catwalk
     and the stem on the crown, so the tank fills with ink and reads as a scribble. It holds from 32
     up."* Both places he asked for it are under 32 -- a favicon is 16, and the lpn menu bar draws at
     `1.05em` (~17 px). Rendered at both, the L is crowded rather than a scribble, so it shipped as
     instructed and the measurement is in `lib/Icons.lib.php`'s own comment. **Five concepts on that
     sheet carry the verdict `FAVICON`** -- `wt-wide`, `wt-wide-heavy-walk`, `wt-wide-long-walk`,
     `wt-wide-short-legs`, `wt-wide-thin-riser` -- so splitting the small sizes off the lettered one
     is a one-line change if he wants it. He has been told; do not make the swap on your own.
   - Mechanics, so the next session does not rediscover them: `php dev/scripts/icon_ascii_preview.php
     water --size=17` renders the shipped glyph at any size in the terminal, which is the cheap
     check; `dev/browser-pass/node_modules/playwright-core` renders an SVG to PNG when a real raster
     is needed. There is no other rasterizer on this machine.
   - The favicon stroke is `#4E8BC9` on both sibling sites -- librewaternet.org's own `--water-2`,
     the one palette entry identical in its light and dark blocks, sitting between not-epanet.org's
     light and dark `--water`. Measured 3.6:1 on Chrome's light tab strip and 4.6:1 on its dark one,
     both clear of the 3:1 non-text floor. **Both sibling repositories are committed and NOT pushed**,
     which is deliberate: a push publishes, and Tom pushes those.

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
- **Do not run `git stash`, `git add -A`, `git checkout -- .` or `git reset` in this working
  directory, and say so in every subagent brief.** A subagent did it on 2026-09-09 and swept two
  other sessions' uncommitted work; §4b has the recovery and the reason the existing rule did not
  reach it.
- Do not tell Tom a browser test that has not been run headlessly first. Three instructions this
  session were wrong — a file with no `[TIMES]` duration that could not show an energy report, a
  unit switch described as converting, and File > Open where the page says Import.

---

## 6. STATE — 2026-09-10, the icon-and-file-safety session. NEWER THAN §5; where they disagree, this wins

**Everything is pushed. HEAD `69fb1e1f`, `git log --oneline origin/master..master` empty in all
three repos** (`engcalcs`, `librewaternet.org` at `6e6cc8f`, `not-epanet.org` at `4c79fc4`).
`check_all.sh` exit 0. Delete a line here once you have checked it.

### Rulings Tom made this day — do not re-ask
- **The water tower SHIPPED.** Favicon on both landing sites and the app page; the engraved mono
  tower as the `lpn_` Water menu icon; `icon-192/512.png` and `icon.svg` as the app icons.
  *"Favicon as it stands is my one true love."* **The L for Libre is GONE** (*"The L is gone."*) and
  cannot return to this geometry -- zero legible letter pixels at 17 px AND 32 px.
- **The shading follows the SOLID**, reconstructed by Tom in three sentences after losing his
  sketch: cylinder wall takes a left-right band, CONE roof a radial highlight from the apex,
  HEMISPHERE belly a downward darkening from the springline. Quoted verbatim in
  `dev/icon-preview/ship-notes.md`, because nothing else corroborates them.
- **The tab icon is the app page's alone.** *"Can it be just on that page for Engcalcs?"* Scoped in
  `lib/HeadersFooters.lib.php`; the other 27 calculators fall back to hawsedc.com's own `.ico`.
- **Task 624 approved and built** -- every scale fallback in `css/engcalcs.css` is now 0.
- **DIVORCE THE APP FROM ENGCALCS CHROME (Task 625)**, his four embarrassments and his decision:
  *"Bye bye engcalcs titles and navbar ... put language menu in our app chrome navbar."* **This is
  the next real piece of work.** Read `dev/chrome-audit.md` before touching it.
- **The dear file.** *"I suppose I need to start shepherding a dear file."* He has been testing only
  with throwaway examples, so no file-loss path has ever been exercised by someone with stakes
  (Task 623). Ask whether an odd project report was the dear file before assuming a throwaway.

### TRAPS MEASURED THIS SESSION
- **AN ICON CANNOT INVALIDATE ITS OWN CACHE (Task 620).** `CACHE_VERSION` is gone by design and
  invalidation rides `?v=<filemtime>`, which `ecSwAssetUrl()` deliberately does not put on an image
  -- while `ecSwAssetFiles()` precaches `icons/*`. So a changed icon reaches nobody who has already
  loaded the app. Tom saw the new favicon on both landing sites and not on the app; Ctrl+F5 fixed it
  for him and will not fix it for a visitor.
- **A NEW HOST INHERITS NONE OF THE OLD HOST'S EXTERNAL CONFIG, AND THIS REPO CANNOT SEE IT.**
  Satellite and DEM 403'd on librewaternet.org because the Mapbox token was URL-restricted to
  hawsedc.com. Measured against the live endpoints; Tom added the URLs and it went 200. Same class
  as the favicon 404 and the `ea-php56` default. **dev.hawsedc.com is now a third host** -- PHP 8.3
  and the Mapbox URLs are done, and it is password-protected.
- **BOTH BROWSER-PASS REDS THIS SESSION WERE STALE SPECS, NOT PRODUCT.** `search.js` matched the old
  English of a button Tom renamed to "Start fresh" (`9aea17c5`); `mapscale.js` asserted the flat
  12 px grab band that Task 618's WYSIWYG work split into `--lpn-hit` (drawn width, fine pointer)
  and `--lpn-hit-coarse`. Both fixed to read `pageConfig`/behaviour; baseline lowered 52 -> 51.
  **Suspect a pinned literal before suspecting the product.**
- **`node run.js` needs more than 30 minutes on a loaded WSL2** -- a full run capped at 36 of 44
  sections and `mapscale` is LAST, so it silently never ran. Check the section count, not just the
  reds.

### The one thing genuinely unresolved
**The all-blue map (Task 624) is a RACE and neither Tom nor a machine can reproduce it.** A repro
seeded with his own exported `localStorage` came back green on HEAD (2.8% ink against the ~44% the
failure paints). The amplifier is fixed, so if it fires again the symptom is now pipes too thin to
see rather than a blue wall -- **that is the same bug wearing a survivable face, and it should be
reported, not shrugged at.** What it still needs is a CPU-throttled spec so first paint can beat
`publishScaleSizes()`.
