# Roadmap

Open tasks for the EngCalcs hydraulic calculator suite. **Format: `Priority|ID| Description`.** One
flat list, highest priority first, lowest ID first inside a band. `# Reference` at the foot holds the
standing prose that is not a task.

| Priority | Means |
|---|---|
| **100** | **Next.** Being worked, or the thing to pick up on finishing something. |
| **75** | **Soon.** Real, wanted, queued behind Next. |
| **50** | **Someday.** Agreed worth doing; nothing is waiting on it. |
| **25** | **Maybe.** Worth keeping; not obviously worth doing. |
| **5** | **Parked.** Alive only so it is not re-proposed from scratch. |
| **0** | **Closed** — the block moves to `dev/roadmap-closed-ids.md` in the same edit. |

Five values and nothing between them. Ties are the point: twelve tasks at 75 says "these are the soon
ones" honestly rather than pretending to rank them. *(Replaced a 0–100 free scale on 2026-08-21, when
88 tasks used 19 distinct values and 40 of them sat between 40 and 60. The rejected alternative was to
re-space the fine scale; 45-vs-50 is a distinction nobody can re-derive a month later.)*

**Every task OPENS with an executive-summary title of 4–12 words** — the first bolded run of the
description, after any marker or actor tag. The exact rule, and why that range, is in
`dev/scripts/roadmap_lib.php`; `roadmap_id_check.php` reports the ones outside it (advisory while
the backlog catches up). Anything longer belongs in the body. `dev/roadmap-index.md` is those
titles alone, the whole backlog in one screen — generated, never hand-edited.

**ID is permanent** — never reused, never changed, unrelated to priority. Cite one as "Task N". A
sub-item under a parent may use a dotted ID (`146.01`) and is still a full bullet.

**A marker says what a task is WAITING ON. It never changes the priority**, because worth and
reachability are different questions.

- **`WAIT: sprint`** — needs Tom to authorize a paid translation sprint. No AI may launch one. It does
  not block anyone else; work around it.
- **`CHECK: YYYY-MM-DD`** — a gate, not a deadline. Before the date the work yields nothing; after it
  the task is doable *at the priority it already had*. Only a task whose value DECAYS gets its priority
  changed, and then say why.

**Actor tags:** `[CC]` Claude Code, `[CP]` Copilot, `[H]` needs a human decision, `[CC→CP]` / `[CP→CC]`
a split task. Untagged = actor-agnostic. Lifecycle: `cross-platform-planning.md` §2.2.2.

**Length: 1–3 lines, hard cap ~15.** One test for adding a line — *would a competent person reading
the short version DO SOMETHING DIFFERENT if it were there?* Expansion is earned by a decision with a
real rejected alternative, a measured number, a non-obvious blocker, or a correction. Past the cap the
content is a `dev/*.md` and the task is one line pointing at it. Compress on close, do not just move
the block.

# Tasks

- 50|610| **[H] Paste that CREATES table rows: gated on the data-entry clerk's own spec.**
  Split out of Task 186 at its close (2026-09-08). Tom, the same day: *"Why would we want a paste
  that creates rows? ... I thought that the reasoning for not doing that was very good"*, then,
  having read the clerk's wish list, *"I am sympathetic."* His conditions, which are the whole
  task: the Junction table gains the project's location coordinates (xy, or lat,lon) as columns;
  a paste that ADDS is refused unless every row carries an ID that validates as non-duplicating,
  and a link row names two existing nodes; and pipe vertices need a stated cell format, which the
  `data-entry-clerk` must specify (*"there is no point in our guessing it"*) before anything is
  built. Ctrl+Shift+PageUp/PageDn to the next table (*"lower priority, but very cool"*) rides here.

- 100|611| **Import a library (pipe types, fittings, curves) from another project file.**
  Tom, 2026-09-08: *"If the Libraries have Import buttons that ask for selecting another project
  file, then import anything that is not a name conflict, that probably would be all that's needed."*
  No export function: a project file already is the export. A name conflict is reported and skipped,
  never renamed silently.

- 75|612| **[H] Screenshot 0082 is the centerpiece of any lpn display.**
  Tom, 2026-09-08, having replaced it: *"I consider my replacement to be the quintessential
  expression of the state of this project. I would consider it the current centerpiece of any
  display about lpn."* The file is not in `dev/screenshots/` yet (the folder ends at 0081); once it
  lands, it leads `dev/screenshots/INDEX.md`, the landing page's screenshots, and the social card.

- 25|613| **[H] "Note" instead of "Text" for the free-text map object.**
  Tom, 2026-09-08: *"Maybe it doesn't matter or we should wait for user demand or a population we
  can poll."* Waiting for that population. Renaming touches every `lpn_text_*` key in 27 languages,
  so it is not done on a hunch. EPANET calls the same object a Label, which we already declined.

- 5|537| **[H] PARKED. Both seats say a phone reaching a PC's model is a want that mostly is not there.**
  Tom parked it 2026-08-26 (*"Compact and park. 5"*) after asking whether file access was the field
  operator's blocker. Researched from both seats, separately, and they converged.
  - **The field operator:** every field-facing tool they could source runs on a **GIS asset graph
    plus a work-order system**, never a hydraulic solver — Esri's Utility Isolation Trace already
    answers "what does closing this valve isolate", and asset CONDITION is a GIS/CMMS record. The
    exception is real but narrow: the smallest agencies still on paper tie cards, for whom our map
    competes with nothing.
  - **The planning engineer:** "cloud behind a login" is a thing a small agency's counsel cannot
    approve — a complete network topology is the document type several states legislate as sensitive
    infrastructure information, and a volunteer project has no SOC2, no incident-response contract
    and no DPA. **So "nothing you draw is uploaded" is not merely a privacy nicety: it is the one
    posture that never asks a utility's lawyer a question they must refuse.**
  - **If it is ever revived, the shape both ranked first** is a read-only, one-way link or export
    with storage the UTILITY controls — *"the moment 'the link' is something we host, it has become
    the cloud-login proposal in a smaller costume."* Full record in both agents' journals.


- 50|604| **Read an EPANET `.PRO` profile file.**
  It is the only route a profile can arrive by, and it falls out of closing Task 574. **A profile is in NO `.net` and no `.inp`** -- EPANET's Graph
  Selection dialog writes its node list to a separate `.PRO` text file through an ordinary save
  dialog, and nothing anywhere records the path, not even an MRU entry. So a user who has built a
  profile in EPANET cannot bring it here by opening their project, and never will be able to.
  - The format is small: an identifier line, then one node ID per line. The work is the
    reconciliation -- what happens when a listed ID is not in this network -- and that answer is
    already written for the calibration files of Task 601.
  - Worth far more once Task 603 lands: an imported profile that cannot name its own nodes is a
    line on an axis.
  - **IT GETS A MINUSCULE SLICE OF THE INTERFACE, on Tom's ruling of 2026-09-06:** *"Creating a
    profile is so easy now using the Google paradigm that I don't think there is much value in
    importing a `.pro` file. If we do it, it needs to take up miniscule space in the UX/UI, hidden
    deep under some menu or in the profile tab down arrow."* So the acceptance bar is a row in an
    existing menu, never a control on the profile panel itself.

- 75|578| **Fire flow: the EPS frame and the Run concept, extracted from 530.**
  Everything else in Task 530 shipped and that task is closed. Two phases were never built and are
  kept here so they are not lost in a closed block.
  - **Picking an EPS frame.** The sweep answers one instant. A project with a clock has many, and
    the honest question is which one a fire flow is checked at -- maximum day is the convention, and
    the page has no way to say "run the sweep at hour 14".
  - **The Run concept, in Tom's own sketch (2026-08-27):** *"a Run names a scenario among its
    parameters."* A named Run would carry the scenario, the required flow, the residual and the
    frame together, so a report says what it was a report OF.

- 100|592| **[AI] Read a surveyed point list: junctions from a CSV or GPX file.**
  **Promoted from the market researcher's wish list, 2026-09-06, ranked first there** (its journal
  and `dev/agents/market-researcher/wishlist.md` §1 hold the citation and the honest size).
  **RAISED TO 75 by Tom the same day**: *"I am excited about this contribution of Market
  Researcher."* The line that said nobody had asked for it is superseded -- he has. It is also the
  row the `data-entry-clerk` moved ABOVE its own item 2 against its earlier ranking, reached from a
  different direction: a mapped file import removes the per-row round trip entirely rather than
  shortening it, which is what "400 pipes from a marked-up plan set" actually needs.
  - **The evidence is a paper trail rather than an inference.** A field survey -- the actual input
    method for the EWB chapters and Peace Corps volunteers this suite most resembles -- produces a
    flat list of id, latitude and longitude, never an `.inp`. EPANET has no path for it either, and
    the researcher found independent Open Water Analytics and Eng-Tips threads asking how, each
    answered with an ad hoc workaround.
  - **The hard parts are built.** Geographic projects already store longitude and latitude and
    already derive their own frame (`dev/geographic-projects.md`); what is missing is one column
    mapping step and one batch of junctions created at their surveyed coordinates. It belongs
    behind the `Settings > New assets` door Task 542 already opened rather than a new one, and the
    coordinate order rule applies on both sides: the FILE is read as whatever its header says, the
    person reads lat,lon.
  - **The one design question is the same one the `.inp` importer already answered:** a row that
    cannot be honoured is reported, never dropped and never guessed at.

- 75|239| **The English-friction loop: run the mechanized Wave 0 and measure its yield.** The
  mechanism shipped 2026-08-08 — an adversarial English pass asking *"list every plausible reading;
  more than one means rewrite"*, both waves writing to `dev/english-friction/<sprint>.json`, with
  `friction_check.php` blocking sprint *launch* on wave-0 findings and sprint *close* on translator
  findings. `refer-to-human` deliberately does NOT close the gate; escalating is not resolving.
  - **Why it exists: `lpn_` HAD a Wave 0 and it did not work.** Task 193 reviewed all 226 English keys
    and rewrote 51, and the sprint still shipped "Zoom to fit", "Map display and sizes" and "Restore
    defaults" — all three caught later by Tom reading the *Spanish*. Wave 0 was not skipped; it was
    not falsifiable. The fix had to be a different QUESTION, not more diligence.
  - **THE YIELD IS MEASURED TWICE NOW, AND IT DEPENDS ENTIRELY ON HOW SETTLED THE ENGLISH IS.**
    `lpn_`, freshly-written feature UI: 36 findings on 225 keys, **26 rewrites (11.6%)**.
    The fifteen non-lpn calculators, mature label sets already through a completed review
    (`239-wave0-calcs.json`): 35 findings on 415 keys, **6 rewrites (1.4%)**, dismissal rate 37%
    against a 9.8% historical wave-0 rate. **Budget a Wave 0 at the `lpn_` rate for NEW English only.**
    One of the six was still a real catch — `mphl_hgl_egl_tip` would have produced a false sentence in
    26 languages.
  - **DONE — `wave0_keyset.php` assembles the pass set and pre-filters keys that already carry a
    non-empty `$ec_lang_syn`** (104 of 582 non-lpn keys, 17.9%). Replayed on `239-wave0-calcs.json`:
    9 of 35 findings skipped, dismissal rate 37% → 23% (the prediction was ~21%). **It also skips
    one confirmed rewrite, `mtc_note_1`** — so the skipped set is enumerable (`--skipped`) and is a
    cheaper second look, never a key ruled correct. `--measure=<sprint>` redoes the arithmetic.
  - **DONE — the suggestion box now ships inside every payload** as `suggestion_box`, extracted by
    the generator from the one canonical block in `dev/translation-process.md`. No longer retyped
    per sprint; the generator fails hard if that block goes missing.
  - **[H] The escalation gate works, and it is down to ONE entry (2026-09-06).** `friction_check.php`
    exits 1 on any `open` or `refer-to-human` finding; it is not in `check_all.sh`, so it blocks no
    commit and blocks every sprint launch. `239-wave0-calcs.json`'s 16 are all dispositioned, and
    what remains is **`lpn_scncmp_at` in `584-wave0.json`** — Tom asked *"I need more context. Where
    is this used?"*, which is answered in that entry's `resolution` (one cell of Water, Scenario
    comparison), so the gate is waiting on his ruling and on nothing else.
  - **AND HE ANSWERS IN `dev/new-english-keys.md` NOW, not in a second file.** The open findings are
    printed into that list's own "Questions from the translators" section, under the same
    `@@ NEEDS RULING` flag as everything else, and `harvest_english_rulings.php --apply` carries his
    answer back into the JSON's `human_answer`. Two lists was one list somebody forgets;
    `239-refer-to-human.md` is the superseded route and is kept only as the record of its sprint.

- 100|599| **Graph a value against time across an extended-period run.**
  Tom, 2026-09-06: *"We haven't added anything for time series reporting or graphing such as one or
  more nodes' pressure or head across an EPS."* Correct, and it is the gap that costs most: the run
  ships (`js/lpn-time.js`), the frames are already kept, and the only way to read one node across
  them is to scrub the transport and watch a number change.
  - **THE DATA IS ALREADY THERE, WHICH IS WHY THIS RANKS ABOVE THE OTHER PLOTS.** A run holds every
    reporting step; nothing has to be re-solved, re-fetched or stored differently. This is a reader
    over state we already have.
  - **DRAW IT THE WAY THE PROFILE IS DRAWN.** `lpn_profile_*` already owns an axis pair, a unit
    label per axis, a legend and a hand-rolled plot -- no chart library, nothing vendored, and it
    survives `vendor_integrity_check.php` by having nothing to declare. A second plotting idiom on
    this page would be the expensive mistake.
  - **MULTI-SERIES IS THE POINT** (*"one or more nodes' pressure or head"*): one node over time is a
    number, several on one axis is the comparison an operator is actually making.

- 50|600| **The three EPANET plots we do not have: contour, frequency, flow balance.**
  Tom, 2026-09-06, surveying EPANET's plot menu: *"time series, profile, contour (very cool),
  frequency distribution ... and system flow balance."* **We already have PROFILE** (`lpn_profile_*`)
  and time series is Task 599, so this row is the remaining three.
  - **CONTOUR is the one he starred and is also the one with a real unknown**: it interpolates a
    nodal value over the plane between nodes, so it needs a decision about what happens where there
    are no nodes -- a pressure contour across a river a main crosses is drawn over nothing.
  - **FREQUENCY DISTRIBUTION is nearly free** and would be the first slice: a histogram of one
    property over one element type is a sort and a bucket count, no interpolation and no geometry.
  - **SYSTEM FLOW BALANCE -- AND HIS READING OF IT IS RIGHT, but confirm it against EPANET's own
    help before writing a word of interface.** He guessed *"produced comes from reservoirs and
    negative demands and consumed is positive demands"*; that matches how the engine accounts for
    it, and a tank is the third term, swinging between the two as it fills and drains. Getting the
    definition wrong here is a number a user would believe.

- 50|601| **Calibration files: measured field data, against the model that predicts it.**
  Tom, 2026-09-06: *"EPANET allows calibration files (measured system data) and offers a Calibration
  Report with three tabbed pages. See EPANET help. Very interesting to be aware of."*
  - **THIS IS THE FIRST FEATURE THAT BRINGS IN DATA FROM OUTSIDE THE MODEL**, which is why it is
    filed at 50 rather than as an afterthought to the plots: every number on this page today is
    either typed or derived, and a calibration file is neither. It has its own format, its own
    units question, and its own answer to what happens when a measurement names a node that is not
    in the network.
  - **READ EPANET'S HELP FIRST AND COPY THE REPORT'S SHAPE.** Three tabbed pages is a design that
    has been in front of users for twenty years; we have no evidence that beats it, and CLAUDE.md's
    default-to-EPANET rule applies to the vocabulary as much as to the layout.
  - Depends on nothing, but it is worth far more once Task 599 exists: a measured series and a
    computed series belong on one axis, and that axis is the time-series plot.

- 25|487| **The suite only works when its URL path is `/engcalcs/`.**
  A rejected refactor, kept so it is not re-proposed. Measured 2026-08-22: 79 root-anchored
  `/engcalcs/` occurrences across 18 root `.php` pages plus `sw.php` and `consent.php`, three
  `Redirect 301` rules in `.htaccess`, **210 counting the JS**, up from 112 -- it gets dearer.
  - **Task 479 closed 2026-09-08 WITHOUT it.** `librewaternet.org/app/` is a rewrite onto
    `Looped-Network.php` and a symlink makes `/engcalcs/` answer on that host too, so every
    absolute path resolves; the canonical, the worker scope and the web app manifest all derive
    from declarations (`ecCanonicalPaths()`, `ecSwMounts()`) rather than from a base path.
  - **It becomes real only if the suite must be served at a path that is NOT `/engcalcs/` with no
    `/engcalcs/` beside it.** Then the fix is one derived base-path constant plus a check failing
    on a new hardcoded prefix, and keep root-relative: root-relative was itself the 2026-08-08 fix
    for a `../` bug. `dev/hosting-layout.md` §3 is the record.

- 50|269| **Both EWB chapters answered, and Phoenix invited a talk.**
  Tom, 2026-08-10 — human replies to outreach, and he has replied gratefully. This is the first real
  conversation this suite's mission has earned; prepare and record what comes of it. Not a
  search-reach task, but it lives here because it is the same goal reached by a better road.
  - **EWB-ASU is theirs to move.** Ahadu Tsotaselassie Assegued, 2026-08-11: *"we'll keep you posted
    once we set our team up."* Waiting on a student team forming, so nudge in the fall, do not chase.
  - **EWB Phoenix Professional is OURS to move, and it has a cadence.** Dane Whitmer, PE, 2026-09-02:
    *"I would love for you to come to our meetings and share about your software"* — 3rd Thursday
    monthly, ACEC office downtown Phoenix, virtual option, plus an offered introduction to EWB-USA.
    **The action is to pick a month and call him**, and the introduction is the larger prize: EWB-USA
    reaches every chapter at once, which is the same leverage a faculty advisor has over a club.

- 75|441| **Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with
  autohide.** Tom raised it 2026-08-18 without asking for it yet. Nothing in the box is designed
  against it — one element, one placement function.

- 25|607| **A moving picture of drawing a pipe -- Task 178's phase 2, extracted on close.**
  A filmstrip GIF from `dev/filmstrip-gif-recipe.md` of the add-pipe / add-junction workflow. A
  2026-07-30 proof of concept showed it is cheap once set up -- the hard part is precise SVG click
  targeting, not GIF assembly -- and the POC GIFs were never committed.
  - **A still shows a STATE; only a moving asset shows a GESTURE**, and "how do I draw a pipe" is a
    gesture. That is why closing 178 on the Help link did not retire this.

- 75|608| **[H] The engine's 664 KB is no longer opt-in, and somebody pays for it.**
  Task 605 made EPANET the default, so a first-time visitor now fetches `js/vendor/epanet-js.js`
  on their FIRST SOLVE rather than on opting in. **A blanket precache is the wrong answer and that
  half is settled**: it moves the cost to service-worker install, paid by every visitor to all
  sixteen calculators including people who never open this page.
  - **RESEARCHED 2026-09-06 by `market-researcher`** (its journal carries the citations, and flags
    which numbers are secondary-source and must be re-verified before any public claim leans on
    them). 664 KB floors at roughly **7 s on 3G and 21 s on 2G** before handshake, and in the
    worst-priced data markets a megabyte is a measurable fraction of daily income. The population
    this suite is written for is disproportionately there.
  - **CHEAP AND INDEPENDENT OF THE REST: a percent-done indicator on that first fetch.** Nielsen's
    response-time doctrine is explicit that past ten seconds a wait needs one or the reader leaves,
    and this is a DELIBERATE CLICK rather than a page load, which is the more forgiving case
    provided the wait is legible. Buildable now, needing nobody.
  - **THE THIRD OPTION THE FRAMING MISSED: a connection-aware idle prefetch, on this page only.**
    `navigator.connection.effectiveType` and `.saveData` let the page ask the visitor's own browser
    which cost is smaller, and prefetch after idle unless they are on 2G or have data-saver on.
    **Chromium-only**, so Safari and Firefox get no signal and must fall back to today's behaviour
    rather than to an unconditional prefetch.
  - `[H]` because the trade is Tom's: it is a claim about who this suite is for, not an
    optimisation.
  - **HE ANSWERED 2026-09-08** (numbering it 600, which is the plots task; the words are this one's):
    *"I am open to your ideas. I am also open to putting up a banner 'Loading solver. Results
    delayed momentarily. Continue working.'"* So the percent-done bullet above is authorized, and
    the sentence he wrote is the sentence to use. **"Continue working" is the load-bearing half** --
    it says the page is not frozen, which is the thing a wait most needs to say and the thing a bare
    spinner cannot. The `[H]` stands on the connection-aware prefetch, which he has not ruled on.

- 75|498| **A public roadmap, with epanet-js's Canny board as the worked example.**
  Tom, 2026-08-23: epanet-js runs one at `roadmap.epanetjs.com`, powered by Canny. Noted as an
  example to weigh, not a decision. The thing to weigh is that `dev/ROADMAP.md` is written for us and
  says things a public board should not (measured costs, what Tom is not proud of, who to ask), so a
  public board is a SECOND artifact to keep current, not this one exposed.

- 25|144| **Diagnose the Hazen-Williams conversion leak — full record in `dev/hazen-williams-leak.md`.**
  **The 11% outlier does not reproduce and the fix it was waiting for already shipped** (2026-07-28,
  `9c47608f`, one day after the snapshot). The 2026-08-21 report gives HW 58% use-of-shopping, ordinary
  beside MPF 78% and DW 56%; P(X ≥ 7 | n = 12) = 8.6e-5 against the old rate. **The two causes are
  confounded** — the defaults changed AND the report began reading the consented bucket only — so do
  not claim the defaults fixed it.
  - **The Search Console route this task used to call decisive is superseded.** That export covers 16
    clicks against 580 counted humans; Google organic cannot characterize this audience. What settles
    it is one run of the rebuilt `log/lang-log-stats.sh` over HW and the band pages, same window and
    same bucket, long enough that the denominator is not marked `~`.

- 100|185| **Match/Copy properties tool (originated during Task 146).**
  **RAISED TO 100 BY TOM, 2026-09-07.** The earlier gate -- 100 with Task 186, and only once all of
  the EPANET file is implemented -- is superseded by his own promotion, exactly as Task 186's was.
  - **THE PREMISE IT WAS CONCEIVED UNDER IS GONE, AND HE KEPT IT ANYWAY.** Tom, 2026-09-06: *"This
    was conceived 'in the absence of the table editor'. But now we have a table editor.
    Nevertheless, this could be a very cool visual feature if done right."* So it is no longer the
    cheap stand-in for Task 186 -- the line below calling it "the cheap 80% of Task 186" is
    superseded -- it is a POINTING tool that a table cannot replace, wanted for what it is.
  - **HIS SPEC, VERBATIM AND IN HIS OWN NUMBERING** (2026-09-06):
    1. Invoke it -- **under the Edit menu, and maybe on the toolbar with a nice icon**.
    2. Get prompted to select the source asset to copy from.
    3. **A specialised properties box for the source asset opens**, with recommended or previous
       (remembered by the BROWSER) checkboxes ticked for the properties to copy.
    4. Click Copy.
    5. (a) Click other assets **of the same type** to receive the designated properties.
       (b) Optional or future: click in space to start a **polygon window selection** of every asset
       fully inside the drawn polygon, documented in the tip on the Copy button. While drawing,
       **right-click to choose Finish as polygon or Finish as fence**.
    6. The properties are copied to all indicated assets, **as a SINGLE undo operation**.
  - **"Previous (by browser)" is the project/browser split doing its work, not an exception to it**:
    which boxes were ticked last time is furniture -- a fact about the person, not the document --
    so it is a `localStorage` sibling key and `serializeProject()` must never learn about it.
    `lpn_furniture_check.php` will require it to be declared.
  - **Same type only, in step 5a, and that is load-bearing**: a pump's properties are not a pipe's,
    and a tool that silently skips non-matching clicks teaches nothing. Say why the click did
    nothing.
  - Two things a decision is owed on before building: **ID is never copyable** (IDs are unique) and
    **geometry is never copyable** (that is a move, not a property copy).
  - Original phrasing, kept because the good idea is in it. Tom, 2026-07-30: "In the absence of the
  table editor, some sort of Match or Copy tool would be very cool. Checkboxes (or current visible
  labels) say what properties to copy, top shows (or initial click gives) the Source object then you
  click the Target objects." Same interaction as AutoCAD's MATCHPROP and every GIS attribute-copy
  tool: a toolbar mode, first click sets the source, every later click applies to a target, Escape
  or a mode change ends it. **The good idea in Tom's own phrasing is "or current visible labels"** —
  the Labels panel already IS a per-property checkbox list, already knows which properties are
  interesting to this user right now, and is already on screen; reusing it as the property filter
  means the tool needs no property picker of its own, and what you see on the map is what gets
  copied.

  **Kept and still liked (Tom, 2026-08-13): "Very nice idea. I love it."** Keep it a click-source-
  then-click-targets tool: that is the right shape when you are drawing 15 pipes and want this one
  to look like that one. Do not grow it into a query tool — search-and-replace is now Task 389 and
  is a better fit for its own job, so the two ship side by side rather than one becoming the other.

- 50|217| **A suite-owned, multilingual Manning's n table, built from primary sources.** Tom,
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

- 50|218| **Find advisors and proteges: a standing, nagged commitment.**
  Not a task that completes. Tom, 2026-08-05: *"I still need help knowing where to try to connect with advisors and proteges;
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
    - 2026-08-11 — EWB-ASU ANSWERED (protege side). The form did submit; the Jared Schoepf backstop
      was not needed and stays on the shelf. Details and next step in Task 269.
    - 2026-09-02 — **THREE REPLIES IN ONE DAY, from individual outreach Tom sent himself.** EWB
      Phoenix Professional invited a talk and offered an EWB-USA introduction (protege side, Task
      269); EWB-ASU restated it is forming a team (protege side, Task 269); **Francisco Bobadilla
      answered on the advisor side** — the first one this item has ever produced.
      **What Francisco asked for is a demand reading, and it lands on shipped features:** scenarios
      and fire flow *"the same way as WaterCAd does it"*, both of which exist (Task 530's sweep
      shipped 2026-08-29). He said he will test and send ideas. **Ask for that list if it does not
      arrive** — a colleague who will answer is worth more than the whole usage instrument on the
      question of why somebody wanted the page.

- 50|221| **Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.** Delete
  `<prefix>_notes_epanet_term`/`_def` from `Hazen-Williams.php`, `Branched-Network.php`,
  `Looped-Network.php` and all 5 lang files (en, es, pt, fr, tr). A dated "we changed this" note is
  useful for about a year; after that it is archaeology in a user-facing Notes list.

- 25|225.13| **`dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got** (Tom: *"Some
  stuff no longer exists or is renamed"*), before anybody is asked to run that section again.
  Split out of Task 225 when the rest of it closed 2026-08-09 — this piece is a punch-list document
  rewrite against live controls, not a code fix, so it needs a browser pass rather than static
  reading.

- 50|234| **Canal Seepage must prove its worth or go.** Tom, 2026-08-08: *"in my crosshairs"*. After
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

- 100|247| **Customers: metered demands with account numbers, lumped to the nearest node.**
  Tom, 2026-08-09, raised and expanded 2026-08-24. epanet-js has demand allocation by customer;
  EPANET does not. **Full design, with the costs priced: `dev/customer-demands.md`.**
  - **Tom's expansion, in his words:** *"expand/envision as a Customer management model where we are
    adding Customer account numbers, and these are meters on the system. Not sure where this is
    headed, but let's at least think that way. And of course I assume that we lump the Customer
    demands additively at their nearest (by length) node. Graphically, I think you pick a point, it
    draws a meter rectangle, and then you pick a pipe and it connects perpendicularly from the meter
    to the pipe."*
  - **Task 468 is a PREREQUISITE, not a sibling** — a Customer is one of its demand rows extended,
    and 247 must not invent a second breakdown structure. Shares the attach-to-a-link-at-a-fraction
    seam with Task 502.
  - **Recommended first slice: an account number on a 468 demand row, no geometry** — it settles the
    `.inp` answer while that is still cheap to change, and spends none of the drawing-surface budget.
  - **The account number is a label on a demand, never a key into anything**, and it is the first
    personal-adjacent data in the suite: it must never reach a log row or a usage statistic.
  - **Tom ruled the open questions 2026-08-24 — `dev/customer-demands.md` §7 has all of them.** The
    two that change the build: a meter carries a **Count** (so *forty-two residential services* is
    one symbol), and the attachment point is **user-draggable along its pipe** — a handle on the
    `linkAnchor {link, t}` Task 502 needs anyway, on data we already store. He also asked for a
    **Customer table**, which the pane's generated tab list makes a row rather than a mechanism.

- 50|283| **Map label legibility: what remains is the AUTO-HIDE rule.** Tom, 2026-08-11, after
  studying epanet-js. Label prefixes (`labelPrefixFor()`) and pipe-aligned link labels
  (`alignedLabelAnchor()`) both shipped under Tasks 333 and 329; two pieces are left.
  - **Auto-hide text that does not fit, as a rule we STATE rather than inherit.** Tom leans to two
    separate toggles — *"Auto-hide map-sized text"* (or no toggle, and the answer is always no) and
    *"Auto-hide screen-sized text"* (or no toggle, and the answer is always yes). The asymmetry is
    the point: map-sized text shrinks with the drawing and its absence would be surprising,
    screen-sized text stays put and collides. epanet-js hides NODE labels at one zoom threshold, all
    together and apparently hard-coded — cruder than per-label fit, so beat it rather than copy it.
    Interacts with Tasks 379, 377 and 399, which are the same question at other granularities.
  - **Units as an optional suffix**, for anyone who wants epanet-js's behaviour. Not the default —
    Tom: *"I personally don't see the need for units on a map when they are endlessly redundant. But
    we could offer that."*
  - **Flow direction arrows stay.** epanet-js has none; Tom: *"I like that we do."* Recorded so a
    future tidy-up does not quietly remove them in the name of matching.

- 50|285| **We do not know what devices anybody uses this on.**
  Several decisions have quietly assumed an answer. Tom, 2026-08-11: *"we don't know whether anybody uses this on a phone."*
  **Instrumented 2026-09-08, not yet read:** `log-human-view.php` and `log-calc-event.php` carry
  `pointer: coarse|fine|''` as a fifth column and the report prints it as its own DEVICE tier. Every
  row on file predates it; the first reading is the next weekly report. Close this once one has been
  read into `dev/usage-data-log.md`. Until then the sentence below still describes the record.
  Before that date the two writers recorded **page and language and nothing else**, so
  there was no device signal anywhere in this project's instrumentation — every touch-target,
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



- 100|322| **Convert standing advisories into checks, and survey for the ones nobody has named.**
  Tom, 2026-08-25: *"322 convert to scripts and include a broad survey for other such
  recommendations."* Record, ranked list, per-runner audit: `dev/enforceable-rules-survey.md`.
  - **HALF A IS DONE.** 78 enforced, 4 left (rows 13, 14, 22, 23), each stating why no blocking
    `check_all.sh` entry can hold it. Three landed rows found the RULE wrong, not the code.
  - **HALF B IS OPEN AND ITS METHOD IS NOT RE-READING.** Re-reading `CLAUDE.md` cannot find a rule
    nobody wrote down. Row 32 came from COUNTING a construct and asking what writing it 892 times
    assumes; rows 35-38, 40-44, 48-50 and 54-56 came the same way and none from re-reading.
  - **A RATCHET AT ZERO IS THE FINDING.** A rule followed and enforced by nothing is invisible to
    every audit that looks for defects. Where the tree HAD violated one it had usually decided the
    question twice in opposite directions (rows 38, 44, 49) -- an unwritten rule from outside.
  - **2026-09-09 gave rows 54-56:** 4 of 28 JS physical constants were rounded decimals, one of them
    carried in `dev/session-handoff.md` as an open question rather than as a defect; 199 harnesses
    pin English wording, so a rewording costs a red build in a file about hydraulics; and 28 of the
    29 keys reaching the tip helpers' `title=""` were unbound by rule B.
  - **WHEN THE ANSWER IS NO, SAY SO IN A ROW** -- 34, 39, 45-47, 51-53 are measured negatives.

- 25|348| **Sub-categories and paging in the examples gallery.** The grid is `auto-fit`, so both
  arrive without a rewrite. Deliberately not built at six examples; worth doing when the wall stops
  fitting on a screen.


- 25|416| **The tester control panel: move it, prune it, repurpose it.** Make it the request channel. Tom,
  2026-08-17: *"I am not using it much because it seems like mostly noise."* Today it is
  `?debug=labels`, built by `buildLabelBench()`.
  - **Move to the LEFT edge** (away from Settings and Labels), **prune the obsolete numbers**, and
    give it an untranslated title — it is a tester surface, never shown to a visitor.
  - **Its real job is a channel for "please try this and tell me what you see" requests**, one tweak
    at a time, not a permanent dashboard. Task 411's off-orthogonal tolerance is next onto it.
  - **A STOP-AFTER-STEP control, which is what "solo" has to become for a pipeline** (Tom,
    2026-08-17, a vocal arranger: *"the equivalent of 'mute' and 'solo' buttons for certain
    'voices'"*, then *"Only solo or all"*). Placement is judged through every pass at once today,
    which is why it feels blind.
  - **Solo-in-isolation is incoherent here**: each pass consumes the previous one's output, so
    "relaxation alone" has nothing to relax. The honest control is **cumulative** — apply steps 1..N
    and draw. One stepper (Next / Back / All), not N checkboxes.
  - **The steps, named for what a reader sees on the map, not for functions:** 1 node labels placed
    at their offsets · 2 pipe (link) labels placed along their pipes · 3 labels turned to lie along
    the pipe · 4 labels pushed apart where they collide · 5 values dropped from a crowded label
    (shedding) · 6 labels hidden because the zoom is too far out · 7 leader lines drawn.
  - Stopping at N answers "did my change help?" — the answer is two drawings at the same step.

- 100|539| **Gang the neighbour labels so their leaders stop crossing.**
  Tom, 2026-08-26, with a screenshot of two node labels whose leaders cross: *"This might be
  forgiveable if it looked difficult or impossible. But when it looks so easy (to a human) to
  resolve, it's embarrassing."* **That is the right test and it is the one to build against** — not
  "are the labels legible" but "would a person looking at this see an obvious fix we missed". The
  strategy and the name are his: *"can two nearby nodes be labeled as a gang in a direction that
  makes their leaders mutually clear each other's nodes?"*
  - **PHASES ONE AND TWO ARE BUILT AND MEASURED; `dev/label-placement-algorithms.md` §8 AND §10 HOLD
    THE NUMBERS.** Phase two is `Collide.repairCrossingGangs()`, a repair pass after every other
    placement, with BOTH of the routes he asked for measured against each other by
    `dev/lpn-spike/label-gang-harness.js`. **Net3-World, the drawing he marked five gangs on, goes
    from 7 flagged pairs to 5 at the fit zoom and from 44 to 30 over four zooms**; Net3 (XY) 26 to
    20. Elm-Street does not move because 14 of its 18 node labels are hand-placed, which is the
    right answer.
  - **The gang route — order the stack by the ANGLE of each label's node — is the whole of the gain
    at his fit zoom** (7→5, against 7→7 for brute force alone). The routes fix different views and
    neither dominates, so both ship.
  - **WHAT IS OPEN IS HIS OWN FLAG: `spot_prime`** (§9b: *"I waved my wand over finding spot-prime;
    if it's hard, let me know."*). It is deliberately NOT built. The stack is hung where the gang
    already stands, so the pass needs no search for open ground — and that is what produced the
    numbers above. **A search for open real estate is a much larger build and the case for it is now
    a judgment about the remaining pairs, not about the strategy.** His call, on §10c.
  - **PHASE TWO SHIPPED WITH THE DRAWING FLICKERING, AND THAT IS FIXED (2026-09-09, §11).** One
    untouched view laid out A B A B A at an unchanged count, so counting could not see it, and 14 of
    the 28 views did not settle. `predictNodeLabelBoxes()` replaces the shed's memory of the last
    layout; `dev/lpn-spike/label-stability-harness.js` asserts the LAYOUT and not the count.
  - **Also open, and cheap to answer with the harness in place:** whether the remaining flagged
    pairs are worth another pass, and whether he wants the dev control knobs re-opened (he
    authorized it) to look at them. **§11e counts the small drawings BY KIND: not one of their five
    remaining pairs is a gang with free labels and open ground**, the only kind any route can fix.


- 50|544| **[H] epanet-js is implicitly claiming to be EPANET, and we have now decided.**
  **THE ANSWER ARRIVED 2026-09-06 and it is Task 591**: we do not fight fire with fire, we build a
  site whose subject is our own dependence and our own gratitude, and we let that stand as the
  contrast. Nothing here is a grievance and the school of thought that said "do what they do" is
  not the one taken. What is LEFT in this row is only the thing it originally recorded: that the
  behaviour was observed, and that `dev/positioning.md` remains the authority for every sentence.
  Tom, 2026-08-26, and he calls it socially difficult: *"epanetjs is legally, but unethically,
  implicitly claiming to be epanet. For example, they have a Youtube video posted with the title
  'Fire flow analysis with EPANET'. We need to note this because one school of thought says that we
  should fight fire with fire. Our school of thought may be contrary. But we aren't going anywhere
  without users, and apparently the name EPANET is gold."*
  - **This is recorded rather than acted on, deliberately.** `dev/positioning.md` is the authority
    for every public claim and it leads with the invitation, not the comparison. Nothing here
    changes that without Tom saying so.
  - **He is considering help:** *"Maybe I need to get human advisers. But a marketing specialist
    agent might not hurt."* A marketing seat would have to carry outside evidence, like every other
    seat (`dev/agents/README.md`), not just an opinion about names.
  - **AND HE HAS WRITTEN THE POSITIONING SENTENCE HIMSELF**, which is the most useful thing in this
    block: *"Semi-retired senior water engineer with a body of established software and online
    calculators seeks radical volunteer engagement."* That is a personals ad, it is honest, it says
    who is asking and what for, and it does not mention anybody else's product.
  - **AND HE IS CONSIDERING LEANING INTO IT, 2026-09-05, which is a different school from the one
    this block was opened in.** Tom: *"I have been considering leaning into the 'Not EPANET' brand,
    maybe with a NotEPANET.org domain and maybe with 'Not EPANET' and 'The Un-EPANET' in video and
    blog titles. That feels deeply honest and quietly rebuking of name dropping while all the while
    invoking the EPANET name for SEO."* **He has registered `NotEPANET.org` and `Not-EPANET.org`.**
    Nothing is built or claimed on either yet, and `dev/positioning.md` is still the authority for
    every public sentence -- a brand that names somebody else's product is exactly the kind of claim
    that file exists to gate. The market-researcher seat is the one to ask what "Not X" branding
    actually earns, and whether it reads as honest or as trading on the name to anyone but us.
  - **HE HAS STARTED, 2026-08-26:** *"I started using that appeal today, and I joined the
    EPANET-USERS listserv to ask about hydrant modeling and more later."* So the sentence is in use
    and there is now a channel to real practitioners. **That listserv is also the place the fire-flow
    questions in Task 530 could be answered by people rather than by search** — the emitter posture,
    and whether anyone models the assembly at all.



- 5|492| **[H] Rewriting the 986 existing commit messages is NOT recommended.**
  Extracted from Task 388 on close so it is not re-proposed from scratch. It rewrites every SHA,
  forces a push, breaks production's `git pull` deploy, dangles 43 SHA citations in `dev/*.md`, and
  saves no context — **nothing ever loads a commit message.** Alive only as a recorded no.

- 5|114| **Reservoir / detention routing calculator (Modified Puls) — full scope in
  `dev/detention-routing-scope.md`.** A time-stepping engine, which is the real departure from the
  suite's steady-state weir and orifice calculators. **Hydrology stays out of scope** — the user
  brings the flood, the tool routes it; do not add a Rational Method or a curve number. Daunting
  (Tom's word) and bigger than Task 137 — do 137 first.

- 5|116| **Solar water pumping sizing.** Sizes a solar-PV-powered pump system for irrigation or
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

- 5|118| **Solar water pasteurization / SODIS exposure calculator.** SODIS (WHO/EAWAG-endorsed: clear
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

- 50|146.09| **A key map: the whole project as a thumbnail, with a box round where you are.**
  Reworked by Tom 2026-08-25, and it is a different feature from the one this ID used to hold:
  *"146.09 reworked as a key/overview map inset like many games where the entire project is depicted
  as a thumbnail with the current window box placed on it for 'Where am I?'"*
  - **The question it answers is orientation, not detail** — "where am I in this drawing", asked by
    somebody zoomed in far enough to have lost the shape of the whole. That is a different question
    from the old version of this task, which was insets that MAGNIFY congested areas.
  - The pieces exist: `bbox()` gives the whole extent, `currentView()` gives the visible rectangle in
    world units, and the drawing is already a `<g>` that can be rendered at another scale. The work
    is a small always-on overlay, a viewport box, and — probably — click-to-go-there.
  - **It is a natural companion to the phone work**, where the screen is small enough that being lost
    is easy, and it is exactly the moment the label passes are already hiding text.

- 5|155|[H] **The Task 149 search-index fix awaits Search Console confirmation.**
  Deployed already. Steps 1–5 (sitemap uploaded, `robots.txt` Sitemap line, sitemap submitted in
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

- 5|158| **`sewslope.php` and `peakfact.php` are English-only while the sewer-slope demand is not.**
  The query export shows real non-English demand for content `sewslope.php` already has (`pendiente
  mínima tubería pvc sanitaria`, `kanalizasyon eğim tablosu`, `tabela de inclinação de esgoto`).
  Task 151 half-mitigated it with mm diameters and mm/m + percent slope columns, so a metric engineer
  in any language can read the *numbers*; the prose is what remains.
  - **These are PARENT-SITE pages** — no `$ec_lang`, no language switcher, no payload generator, no
    drift tripwire. Decide the shape first: three static translated copies (es/tr/pt) may beat
    building language infrastructure for two documents.
  - **Do not assume this is worth doing.** Task 151 found these queries already *rank*, so the CTR
    problem may be snippet quality (now fixed) rather than language.

- 50|614| **The sewer-slope cluster is the largest demand we do not convert.**
  Raised by Tom, 2026-09-08. Measured twice, 2026-07-27 and 2026-09-07, and unmoved: sewer, drainage
  and slope queries with no "manning" in them are 190 queries, 3,557 impressions, 60 clicks —
  **1.7% CTR against Manning's 27.9%** — and the biggest single loss is *"4 inch sewer pipe minimum
  slope in mm"* at 505 impressions, 3 clicks, position 6 (`dev/usage-data-log.md`).
  - **IT IS NOT A CONTENT GAP.** `sewslope.php` has answered that exact query since Task 151: 4 in /
    100 mm reads 8.4 mm/m and 0.84% in Table 1, in the units asked for. We rank 3–10 and are not
    clicked, so more table answers what is already answered. Task 158 is these same two pages on the
    language question, which is a different one.
  - **DIAGNOSE BEFORE BUILDING: three hypotheses, three answers.** Position 3–10 is not enough for a
    table query; or the SERP answers it itself by featured snippet or AI overview, so the click is
    not on offer, CTR is the wrong target and doing nothing is correct; or the title does not use
    the searcher's words (the H1 is "Minimum Sanitary Sewer Slopes"). Reading the live SERP for
    those queries decides which, and `market-researcher` is the seat that can look.
  - **The page is in no repository** — `~/webdev/hawsedc.subset/` is a hand-kept subset, not a
    checkout — so an edit ships by hand, and clicks split across `hawsedc.com` and `www.hawsedc.com`.

- 5|175| **A real printable version, suite-wide.** Raised by Tom, 2026-07-30, while reviewing the
  `lpn_` map page: the suite's only print affordance today is `d-print-none` hiding chrome
  (toolbar, unit-select row, nav) so `Ctrl+P` on the bare page reads a little cleaner — there is no
  actual "printable view" (clean pagination, a results summary, a static rendering of an SVG
  canvas like `lpn_`'s map). Not designed yet — Tom's own fallback today is a screenshot, which
  works but produces something the reader can't page through or reflow. Whoever picks this up
  should figure out what "printable" should even mean per calculator type (a two-column input/
  result form vs. a map/canvas page are different problems) before building anything.

- 5|181| **Per-element symbol sizing (originated during Task 146).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.

- 5|191| **Junction emitters: surface the pressure-dependent demand already solved.**
  Originated during Task 146. Raised 2026-07-30 when Tom asked of the Settings panel's "Emitter exponent"
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

- 5|202| **`zh` converts at ~15% where its peers convert at 50–75%.**
  PARKED until n=30, with a pre-registered threshold. Everything cheap has been eliminated: **not bots** (arrival pattern is
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

- 5|267| **"Save as" the backdrop image.** Tom, 2026-08-10, "very low priority". The image is stored
  as a data URI on `backdrop.href`, so writing it back out is a blob download away.

- 50|282| **Offer to attach the backdrop an imported `.inp` names.** An `.inp` (and a `.net`) stores
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

- 25|303| **Usage logging: the remaining lower-value questions.**
  **NOT obsolete, and 50 overstates it** — Tom asked which on 2026-08-25. The questions are still
  real and still cheap; what is true is that **none of them decides anything on its own**, which is
  the definition of Maybe rather than Someday. Take one when a specific question makes it worth the
  wiring. Extracted from Task 200 when it closed 2026-08-14 so they survive the close.
  - **Time-to-first-calc** — separates a page that is confusing from one that is merely long.
  - **Print / copy-link use**, as a proxy for work somebody intends to keep. Overlaps Task 215's
    named-calculation signal, which measures intent-to-share more directly — check whether the title
    log has already answered the question before building it.
  - **Intra-site path** — which calculator is the entry point and where people go next. The most
    expensive of the three, because a path needs an ordering the logs deliberately cannot express
    without a per-visit identifier we will not store.
  - **Whatever is added is analytics and is gated on `ecAnalyticsConsented()`**, and a new log writer
    must call `ecLogBucketSuffix()`.

- 5|391| **[H] Evaluate `// @ts-check` with JSDoc branded types — a joint decision, not a
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

- 5|482| **EPANET's vocabulary collides with ours, and we are keeping ours.** Tom, 2026-08-21, from
  a session with EPANET: what we call **Labels** EPANET calls **Notation/Annotation**, and what
  EPANET calls **Labels** is what we call **Text** objects.
  - **RULED: stay our course, at priority 5.** Tom's reasoning, and it is the argument to re-read
    before anyone reopens this: *"Annotation probably has no specific meaning, and various software
    apps have used terms like Results Field, Map Output, or Results Variable. And for Label (Text
    object), the same holds true, with most using the word 'Text' as part of their terminology, such
    as Drawing Text, Free Text Decoration, Map Graphic Text, Map Note, Text Annotation."* **There is
    no industry standard to defer to here**, so EPANET's words carry no more authority than ours, and
    a rename would cost a 26-language key family plus the vocabulary inside saved projects.
  - **Recorded so NEW strings do not drift.** The decision is cheap now and expensive later: every
    string written in the other vocabulary adds to the rename we have just declined.
  - **A real feature gap found the same day, and it is separate: EPANET can METER a node or link.**
    A Text/Label is associated with an element, and EPANET puts that element's one selected notation
    property under the text you typed, in a pale yellow bubble. **Our labels already carry MULTIPLE
    properties and drag freely** (`dev/positioning.md` §4), so copying it wholesale is scope gravity.
  - **DEFERRED ON PURPOSE, and that is the position, not indecision** (Tom, 2026-08-22). Change is
    inevitable and refactoring is a value, because foresight is never perfect; overvaluing the past
    is as much a weakness as ignoring it; listen to users; there is an unknown depth of possible
    correction, so the aim is to act rightly now rather than lock the decision early. Tom: *"there is
    an unknown amount of EPANET that we don't yet implement."*

- 5|400| **Phase 3: bounded local search on the label residue.**
  Tom, 2026-08-17, lowering it 60→15: *"Phases 1 and 2 are good enough for GIS mode or management
  mode. Phase 3 may be helpful for report mode."*
  Parked for real-world feedback from Tom's colleague Mary (Philippines) rather than scheduled work;
  an event gate, not a `CHECK:` date.
  - Wagner & Wolff's three optimum-preserving reduction rules on an explicit conflict graph, then a
    bounded chain search, in QGIS PAL's shape. Survey: `dev/label-placement-algorithms.md`. Needs
    Tasks 398 and 399.
  - **The view-independent conflict graph is the gate, not a loose end.** The rules are defined on
    it, and today the graph differs at every zoom and every pan.
  - Straight-top as a third candidate position belongs here: measured (arXiv 2407.11996) as
    preferred over Imhof's top-right.
  - **A relaxation/nudge pass may belong in the strategy** (Tom, 2026-08-17) — check how the
    literature sequences it against the reduction rules. Of limited value until labels start in open
    territory, so it follows rather than precedes the rest of Phase 3.
  - **"Most-open angle(s)" is Task 411, not this task** — candidate *generation*, orthogonal to the
    reduction rules, and the "start in open territory" precondition the relaxation bullet assumes.
    Literature pass done 2026-08-17: `dev/most-open-angle-brainstorm.md`.

# Reference

Standing prose that is not a task. It was the body of the old category sections.

## New Calculators (Mission Expansion)

No candidate is open. **Score any new candidate on four axes before proposing it** (Tom, 2026-07-14):
availability (a genuine gap raises priority, a saturated market lowers it even for strong mission
fit), technology emergence, field/NGO demand, and real search evidence. A 2026-07-14 pass overturned
intuitions both ways — rainwater harvesting was saturated; VIP latrine sizing, handpump selection and
check dams were genuine gaps. Every "no calculator found" verdict is a web-search signal, not a
verified global negative. Researched and deprioritized as well-served: **chlorination dosing** (CAWST
itself publishes one) and **pond/reservoir evaporation** (6+ free, several using FAO-56).

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

## Discoverability (Search Reach)

Evidence base for this whole section: the Google Search Console query exports of 2026-07-27 and
2026-09-07 — cluster tables, CTRs and the smaller findings are in `dev/usage-data-log.md`. The
headline: **Manning is won and needs nothing** (position 1, 25% then 27.9% CTR), while the comparable
sewer-slope cluster converts at 1%, and at 1.7% on the second export. That non-conversion is
**Task 614**; Tasks 155 and 158 are the other open search-reach ones.

## Completed

**Closed IDs live in `dev/roadmap-closed-ids.md`**, one line each so a cited `Task N` still resolves;
the text stays in git. `roadmap_id_check.php` reads both files: an ID is unique across the pair, and
priority 0 means the block is in the ledger and nowhere else.
