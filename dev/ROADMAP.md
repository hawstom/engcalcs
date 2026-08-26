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

- 100|436| **What a wheel notch costs, and the placement leftovers.**
  **A notch never ran the relayout — it defers to `scheduleReshed()`, 120 ms after the LAST notch.**
  What that one pass costs, in Chromium on the 480-pipe grid `specs/perf.js` builds: 1.3–7.3 s in
  `reshedLinkLabels()` against 0.06–0.24 s in `relayoutLabels()`. So the relayout was never the
  problem; the CONTENT cascade beside it was, running one label at a time — the quadratic Task 440
  fixed in `refreshLabelText()` and left in this path. Batched 2026-08-23: **1,008 forced layouts per
  notch → 9** on a 112-pipe grid, every label keeping the same values, guarded by
  `dev/lpn-spike/zoom-reshed-harness.js`; 44–458 ms in the browser.
  - **`shedAlignedForConflicts()`'s obstacle walk is INDEXED, 2026-08-23.** It was the whole of what
    was left — 0.3–1.8 s per notch in over 9M box-overlap tests. The cascade still runs one label at
    a time and always will (each label placed is an obstacle for the next); what grew with the
    drawing was `boxIsClear()`'s walk. Through `Collide.boxIndex()`: **231 → 7.3 overlap tests per
    label on 112 pipes, 860 → 7.1 on 480** — the per-label rate now flat instead of rising. Every
    placement byte-identical, proved by dumping both passes from separate processes.
    `dev/lpn-spike/aligned-shed-index-harness.js` guards it.
    - **An APPEND-ONLY grid that re-reads the caller's array on each query, not a tree.** The
      difference from Task 472: that index is built once and held, this one absorbs an insert
      between every pair of queries. A grid's insert has no rebalance, and syncing on query meant no
      call site had to be told about the insert.
    - **THIS PASS CONVERGES ACROSS PASSES,** which is a trap for anyone comparing it: it seeds node
      labels as obstacles where the last layout PLACED them, so two identical runs back to back in
      one process already disagree on one label. Compare backends in separate processes.
  - **AND IT IS STILL 2.5–3.3 s END TO END, WHICH THE COUNTS CANNOT SEE.** Measured in Chromium
    AFTER both fixes above, on the same 736-element geographic grid: the block after a zoom runs
    2.5–3.3 s with labels on against **0.5–0.7 s with every label field switched off**, so what is
    left is label work. One run of the identical gesture hit 16.9 s. Forced layouts are held at 9
    per notch and overlap tests at ~7 per label, so the remaining cost is PER-LABEL work no index
    removes — text measurement is the suspect and is unproven. `specs/perf.js` reports the number
    and asserts no bound: the spread is wider than any honest threshold.
  - **AND THAT CONVERGENCE WAS HIDING A DEFECT, FIXED 2026-08-23.** Because the seed lags, a first
    layout sheds link labels for ground the node labels do not take, and the node then takes ground
    under a pipe label using `yields` — which granted the position and never made the holder leave.
    Measured on `Net3-World`: 60 node label rows printed through an aligned pipe label, up to 28 px
    deep, zero node-on-node. `yieldStationedLabels()` hides the yielder; node placements are
    unchanged. Iterating the two passes instead also reaches zero and costs 3x.
    `dev/lpn-spike/node-yield-harness.js`.
  - **Placement leftovers: all three done 2026-08-25.** A background image is carried onto the map
    with the drawing (it moves and resizes; a picture cannot TURN, and Finish says so); Finish is
    undoable — the snapshot is taken at `georefStart()` and pushed only on commit, so Ctrl+Z gives
    back the exact grid the user opened; and `lpnGeorefFromTwoPoints` has a door at last, a button in
    step 2 beside the scale and turn boxes. Step 2 and not step 1 because a pick inverts the live
    transform, which a detached model's compensation makes a lie.
    `dev/lpn-spike/georef-carry-harness.js`, `dev/lpn-spike/georef-twopoint-harness.js`,
    `specs/place.js` §15. **Awaiting Tom's wording only:** the six `lpn_georef_twopt*` strings and
    `lpn_georef_backdrop_unturned`, all shipping on placeholder English.
  - **Held in HEIGHT, not width:** a long north-south journey stretches the model east-west by the
    map's own 1/cos(latitude) — 9% from 20° to 31°. Unavoidable on an unprojected display without an
    anisotropic transform, which `js/lpn-georef.js` refuses by design. `dev/georeferencing.md`.

- 100|513| **Sprint 459's leftovers: two named strings nobody here can read.**
  The three jobs this task carried are done (2026-08-25). The glossary write-back was done from the
  SHIPPED STRINGS, not from the lost transcript — `dev/scripts/glossary_rendering_census.php` counts
  which rendering each language really uses and how often, and its findings are written into the
  `translation_notes` of flow, head, emitter, slope, ponding, elevation, link, tank and valve.
  `mode_name_check.php` went from 21 findings to 1. What is left needs a reader of the script:
  - **`ar` calls the lat/lon mode `جغرافي` ("geographic"), which is not a pair at all.** Its
    `lpn_georef_asdeg_btn` now names latitude first, but it names the PAIR while every other `ar`
    string names the mode, so the two still disagree. Resolving it means choosing an Arabic mode
    name, which is a translation decision, not an ordering one.
  - **`zh` renders the pair `经纬度`, longitude-first, and that is the lexicalized compound.**
    `纬经度` is not Chinese. Either the compound stands as an exception or zh gets a different
    phrasing; a non-reader must not choose.
  - **THERE ARE TWO `ponding` ENTRIES IN `glossary.json` (ids 34 and 46)** and the strings say
    entry 46 is the one in use — 15 languages ship its rendering, entry 34's appears 0 or 1 times in
    20 of 26 files. Merging them is a glossary-structure call and is left for a human.

- 100|530| **Available fire flow at a hydrant, with the hydrant assembly modelled.**
  Promoted from the `utility-planning-engineer`'s own wish list (Tom, 2026-08-25). *How much can
  this hydrant deliver while a critical node holds >= 20 psi?* Flow and pressure trade, so it is a
  search: guess a hydrant demand, solve, check the residual, bisect. Today it is done by hand with
  scenario overrides. AWWA M31 defines the required flow at 20 psi residual; EPANET has no built-in
  tool for it, so this is not a gap against EPANET.
  - **THE ASSEMBLY IS PART OF THE ANSWER, AND THE STANDARD IS NON-NEGOTIABLE.** Tom, 2026-08-25:
    *"including **some** k whatsoever is non-negotiable"*, and *"we must either ask or disclose our
    assumptions about the diameter, roughness, k, and length of a hydrant and lateral assembly. The
    fire flow wizard must include this add-on to the entered assets of the system, and this is an
    ad-hoc add-on applied before asserting anything about fire flow."*
    - **BARREL + LATERAL + k**, agreeing with the research: model the hydrant's own waterway as a
      short pipe at its real diameter, in series with the lateral, AND carry a k. Not one or the
      other — a k of zero is not an option here.
    - **THE DANGER IS THAT FRICTION IS NOT DOMINANT.** The runs are so short that minor losses
      carry the answer, so this is *"the one place where we must most necessarily provide k guidance
      and demand reasonable k."* **Research it to be standard; if the research is thin, be
      reasonable and do not swallow a camel.**
    - **The add-on is AD-HOC and never enters the user's document** — not the asset list, not a
      saved file, not the `.inp` export. Same boundary the solve already keeps.
    - **A FIRE HYDRANT LIBRARY IS SAVED WITH THE PROJECT** (Tom). So a hydrant type is a reusable
      named thing, stored in the project file like any other user data, inheriting every rule there.
  - **Fire hose losses are OUT OF SCOPE and that is deliberate** — *"we can safely leave the fire
    hose losses to somebody else."* The one alternative he left open: a *"to the building"* analysis
    including the fountain stream, **if that is standard**. Research decides; do not build it on a
    hunch.
  - **RESEARCH ROUND 1 DONE 2026-08-25** (`dev/agents/utility-planning-engineer/journal.md`), and it
    corrected the premise. The four that change what gets built:
    1. **150 mm is the hydrant's SHOE, not its waterway.** AWWA C502 sets the main-valve waterway at
       **4½ or 5¼ in (114–133 mm)** behind a 6 in mechanical-joint inlet. Modelling "a 150 mm
       hydrant" as one 150 mm pipe leaves the real constriction out and reproduces **exactly the
       overstatement this task exists to prevent**.
    2. **THE `k` EXISTS AFTER ALL, and round 2 found it 2026-08-25.** Not in the hydraulics
       literature — in **AWWA C502's QA clause**, as a maximum-allowable friction loss: *3.0 psi at
       1000 gpm through the 4½ in pumper nozzle*, quoted word-for-word in a municipal design
       standard and in a manufacturer's own spec sheet, independently. Referenced to velocity in the
       6 in lateral that is **K ≈ 3.5** for barrel + main valve + nozzle. Add Crane TP-410 fittings
       for the rest of the run — tee off the main ≈1.0, gate valve ≈0.15, elbow ≈0.3–0.5 — and the
       **recommended total is K ≈ 5, range 3–6**, carried as TWO labelled pieces (a QA-derived
       dominant term plus a Crane-derived remainder), never as one measured number for a whole
       assembly. It is a worst-case ALLOWABLE, so a real hydrant does at least this well — the
       conservative direction. **Do NOT import the pitot Cd (0.90/0.80) as a `k`;** it converts a
       field pitot reading to gpm and is a different quantity that merely sounds adjacent.
    2b. **Tom's worry is confirmed, moderately.** At 1000 gpm through 6 in C=140 DI, friction is
       64.5 ft per 1000 ft against the barrel's fixed 6.93 ft. So minor loss is **4.3x friction at
       25 ft, 2.2x at 50 ft, and about equal at 100 ft** — across every lateral length real agency
       standards use, minor loss is never the smaller term. (The agent's first pass reported 10-40x
       from a mis-remembered Hazen-Williams constant and caught it by cross-checking against
       Darcy-Weisbach. The corrected figures are the ones above.)
    2c. **"To the building" is CLOSED — the answer is no.** AWWA M31 and NFPA 291 both define
       performance at the outlet; WaterGEMS's own Hydrant element stops at the same boundary, with
       the identical three fields and no published default for any of them. Past the nozzle is
       fire-ground hydraulics, whose inputs a distribution model cannot know at design time because
       the hose lay is chosen at the scene.
    2d. **The saved library type carries:** make, model, waterway diameter (4½ or 5¼ in), outlet
       configuration, and the `k` itself — editable, defaulting to ~5, with its source visible **and
       with the VELOCITY IT IS REFERENCED TO stated beside it.** Tom, 2026-08-25: *"We must be
       crystal clear on which velocity any k belongs to. I see this as critical in the hydrant
       model."* The assembly has two diameters, so `V²/2g` differs by ~3.16x between them and a
       re-referenced `k` moves the answer 18.9% — measured. `js/lpn-fireflow.js` now names the
       reference in the constant names, in `assembly.k.referencedTo`, and per part.
    2e. **A PRE-COMPUTED q-vs-loss TABLE WAS CONSIDERED AND DECLINED — `dev/fireflow-loss-table.md`.**
       Tom asked whether EPANET takes one and whether the hydrant can be injected into the physical
       model. **Yes to both, and the second is already what we do** (`lpnFireFlowBuild()` builds the
       assembly onto a COPY). EPANET takes a loss table as a **GPV**, and `js/lpn-inp.js` already
       imports and exports one. **But the saving is not real:** the assembly costs **+0.029 ms of a
       0.613 ms solve** on 49 junctions and nothing measurable at 225, because the bisection's cost
       is the NETWORK solve, which no table can remove. It would also cost the built-in solver —
       `lpnValveIsNative` is true only for a TCV, so a GPV would make this search EPANET-only. A
       stored table is also a cached derived value that can go stale. **Dimensions and a `k`, not a
       table.** The one case that would justify points is a manufacturer's MEASURED curve, and even
       then it converts to a `k` at the lateral's velocity for the solve.
       **Deliberately NOT in the type:** installation year and NFPA 291 colour class, which are
       per-instance facts that go stale if baked into a reusable type; and the lateral's own
       diameter, length and roughness, which stay per-instance ad-hoc inputs.
    3. **Ask or disclose, per quantity.** LENGTH must be asked — five agency standards span 25–100 ft
       for the same pipe. Diameter carries a disclosed 6 in; roughness a disclosed cement-lined DI
       C≈120–140, the cheapest of the four to get wrong.
    4. **A "rated" flow is a SYSTEM measurement, not a hydrant property** — NFPA 291 rates what the
       system delivered through that hydrant at 20 psi, at that location. Available fire flow is
       quoted **at the outlet**. **ISO caps single-hydrant credit at 1,500 gpm** whatever the
       hydraulics say.
  - **THE ENGINE SHIPPED 2026-08-25: `js/lpn-fireflow.js`, pure, plus
    `dev/lpn-spike/fireflow-harness.js`.** `EngCalcs.lpnFireFlow(model, options)` always returns a
    promise and takes **the solve as an injected dependency** — the native engine is synchronous,
    EPANET's is a promise, an active valve routes to EPANET, and a search costs ~16 solves, so the
    caller chooses. The assembly is built on a COPY (input byte-identical, asserted), the k is
    derived from 3.0 psi at 1000 gpm rather than typed, and every assumption is overridable and
    reported `supplied`/`default`. Every edge case has a name: `below-residual-at-rest`,
    `search-ceiling-reached`, `solve-did-not-converge`, `hydrant-node-not-found`,
    `hydrant-node-not-a-junction`, `lateral-length-required`. ISO's 1,500 gpm is a note, never a
    clamp. Worked example checked against EPANET's own 4.727 equation and an independent root find.
  - **MEASURED, and the second number is the surprise:** on the harness network the barrel
    constriction (4½ in vs 6 in over 5 ft) is worth **1.06%**, while the k is worth **11.6%**. Both
    are needed, but the barrel earns its place mostly by being where the QA-derived k is measured,
    not by its own friction. Do not quote the constriction as the big term.
  - **STILL TO BUILD: the wizard, and the hydrant library.** Language keys, the dialog that asks
    for the lateral length and discloses the rest, the flow readout in the project's own units, and
    the saved-with-the-project hydrant type (fields listed above). Wording is Tom's.

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
  - **[H] `friction_check.php` NOW EXITS 1 with 16 `refer-to-human` entries awaiting Tom's ruling.**
    That is the escalation mechanism working, and it is not in `check_all.sh` so it blocks no commit —
    **but it blocks the next sprint launch until he rules.** The 16, plus 9 wording proposals and 7
    `$ec_lang_syn` proposals, are in `239-wave0-calcs.json`. **Tom answers in
    `dev/english-friction/239-refer-to-human.md`** (2026-08-23: *"Give me a file or a page where I
    can decide and comment"*) — one `**Tom:**` line per item, blank meaning not yet decided. Each
    answer goes back into the JSON's `disposition` and `resolution`, which is what re-opens the gate.

- 100|477| **New blank project startup wizard: xy/lat-lon, units, head loss.** Tom, 2026-08-22,
  naming the scope. It replaces the four-row File > New fly-out; on epanet-js, *"they have a wizard
  box with xy and lat/lon as the top choices, and if lat/lon is selected, a search box is enabled.
  Below it are the units and head loss formula selectors."*
  - It answers three open things at once: the coordinate declaration for the boot project (Task 145's
    last gap), head-loss formula at creation rather than buried in Settings, and a home for the
    geocoder that already works — `js/lpn-search.js`, its search box enabled when lat/lon is chosen.
    **Tom has ruled out a standalone search interface for now** (Task 437, closed into this one):
    *"There's not a lot of reason for search once you are at your model."*
  - **UNITS, ANSWERED 2026-08-24.** Tom: *"all units are shown (6 for inputs and 5 for results) with
    the US and SI presets to set them."* So the wizard shows every unit selector — not one unit-system
    radio — and the two presets are the fast path that sets them all. That is the same paradigm the
    calculator pages already use, and it is the reason a project's own units are declarative
    (`serializeProject().units`) rather than a browser preference.
  - **Against it:** the current fly-out ASKS FOR NOTHING — the choice is which row you click, and a
    wizard puts a form in front of the commonest action. Weigh that before building.

- 75|479| **[H] One question left: should the suite answer at librewaternet.org/engcalcs/ ?**
  **The landing page and the code half are DONE and LIVE** — `https://librewaternet.org` and
  `/features.html` both serve, `libreepanet.org` 302s to it (Tom, 2026-08-24: *"Keep both, but
  EPANET is silent."*), and `CANONICAL_ORIGIN` became a host→origin whitelist on 2026-08-23 with
  `canonical_origin_check.php` guarding it. The landing page's own repository is
  `~/webdev/librewaternet.org`; see `dev/librewaternet-landing.md`.
  - **DROPPED 2026-08-25 on Tom's ruling:** the `constructionnotesmanager.com/hawsedc/engcalcs`
    redirect. *"It has never been canonical. No redirect is required."*
  - **THE ONE OPEN QUESTION, and it is his.** `librewaternet.org/engcalcs/Looped-Network.php`
    currently 404s, because the planned symlink was never made. Tom, 2026-08-25: *"I forgot what our
    goal was. We wanted lpn to appear at lwn?"*
    - **The recorded goal was yes**, and the reasoning is in `dev/hosting-layout.md`: the 210
      absolute `/engcalcs/…` paths all resolve under `<newdomain>/engcalcs/`, so one symlink serves
      the whole suite under the new domain and **no code changes at all** — which is why the symlink
      beat the refactor.
    - **Nothing is broken while it is absent.** The landing page's buttons point at
      `https://hawsedc.com/engcalcs/…` and work. So this is a positioning choice, not a defect: does
      a visitor who arrives at LibreWaterNet stay on that domain when they start a model, or get
      handed to hawsedc.com?
    - **PARKED 2026-08-25 ON TOM'S RULING:** *"Since I don't have clarity, let's leave it as it is
      for now."* So the suite is NOT mirrored, the landing page keeps handing visitors to
      hawsedc.com, and nothing is broken. The analysis below stands for whenever clarity arrives.
    - **IS THE MIRROR AN SEO PROBLEM? Answer: not a penalty, but AS CONFIGURED TODAY it would split
      the signal, and the fix is one line.** Google's own position
      on duplicate content across domains is that it is not grounds for a penalty, but that
      identical pages must nominate ONE canonical or the engine picks for you and the ranking
      signals divide between the two. **Our whitelist currently maps `librewaternet.org` to
      `https://librewaternet.org`** (`lib/config.inc.php`), so a mirrored suite would serve two
      copies of every page each declaring ITSELF canonical — precisely the split. Three ways out,
      and the choice is Tom's: map `librewaternet.org` to `https://hawsedc.com` so the mirror defers
      and consolidates; leave it self-canonical and accept a divided signal for a marketing gain;
      or do not mirror, and let the landing page keep handing visitors to hawsedc.com as it does
      now. **`canonical_origin_check.php` exists precisely so this is a lookup and not a guess.**
    - If yes, it is `ln -s ~/public_html/hawsedc/engcalcs ~/librewaternet.org/engcalcs` after
      testing `Options +FollowSymLinks` on that host, plus the canonical decision above.

- 25|487| **The suite only works when its URL path is `/engcalcs/`.**
  Measured 2026-08-22: 79 root-anchored `/engcalcs/` occurrences across 18 root `.php` pages plus
  `sw.php` and `consent.php`, and three `Redirect 301` rules in `.htaccess` naming it absolutely.
  **210 counting the JS.**
  - **DEMOTED 25 on 2026-08-23, because this task and `dev/hosting-layout.md` §3 contradicted each
    other and the hosting doc is right.** The refactor is rejected while a symlink does the job:
    serving at `<newdomain>/engcalcs/` needs no code at all, and the count grew 112 → 210 between
    measurements, so the refactor gets more expensive over time, not less. This blocks nothing that
    is planned.
  - **It becomes real only if the suite must be served at a path that is NOT `/engcalcs/`.** Then the
    fix is one derived base-path constant plus a check failing on a new hardcoded prefix — and keep
    root-relative, because root-relative was itself the 2026-08-08 fix for a `../` bug.

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

- 75|532| **An English style guide for label wording — Tom says he is writing one by intuition.**
  His own words, 2026-08-25, answering a friction question: *"I would be grateful for a style guide,
  or maybe I am creating it by intuition."* **That sentence is the task**: rulings he has been making
  one at a time for months are consistent with each other, nobody has written them down as rules,
  and so each new one costs a conversation.
  - **This is a HARVEST, not an invention.** The material already exists and is dated and quoted —
    `dev/language-strings.md` (which is about the mechanics of a string, not the voice of a label),
    the closed ledger, `dev/english-friction/*.json`, and `239-refer-to-human.md`. Read them and
    extract the rules he has ALREADY applied rather than proposing a house style from taste.
  - **Some are already stated elsewhere and belong in it by reference, not by copy:** column width is
    king and mid-word wrap is acceptable in a results table; a verdict leads with `✓` or `⚠` and never
    a translated marker word; loss symbols are lowercase `h` and total heads capital `H`; the
    local-loss term is "Minor (local) loss" suite-wide; reuse a WHOLE label, never a fragment.
  - **The open question is what it is FOR.** A guide read by a human is prose; a guide read by a
    check is a script, and CLAUDE.md's own argument is that a rule a machine enforces is worth ten a
    human must remember. **Some of these are checkable** (a verdict string starting with a glyph, a
    label ending in a colon, a sentence in a column heading) and some are irreducibly judgement.
    Sort them into those two piles as you go — that sorting is most of the value.
  - **[H] The voice is his and the guide must quote him rather than paraphrase.** Where a ruling was
    a one-off with no principle behind it, say so instead of inventing the principle.
  - **ONE PRINCIPLE HE HAS ALREADY GIVEN, and it cuts against a plausible-sounding opposite.** Tom,
    2026-08-25, on a claim that abstractions survive machine translation badly so a word should be
    placed where its sentence works without it: *"I would argue the opposite with some nuance, that
    direct, ancient, and earthy metaphors (like 'run') are the most translatable things of all. But
    to know them when you see them may be an art."* **So the rule is not "avoid metaphor" — it is
    that an OLD, CONCRETE, BODILY metaphor travels and an abstract or modern one does not.** Water
    runs; a zone runs; a machine's "runtime" does not travel the same way. His own caveat is part of
    the rule and must survive into the guide: telling them apart is a judgement, so this is one for
    the human pile, not the checkable one.

- 75|533| **Renaming a link leaves `incidentLinks` pointing at the old id.**
  Found 2026-08-25 by the Task 502 agent while building Text-on-a-link, and **left unfixed on
  purpose** — it was outside that track's territory and is pre-existing, not something 502
  introduced. Its harness says where it declines to assert it, which is the honest form.
  - `applyLinkRename()` updates the link but does not remap `incidentLinks`, so the index still
    holds the OLD id. **Move a node after renaming one of its links and the drag walks into a
    missing `linkEls` entry.** Rename, then drag: that is the whole reproduction.
  - It is the same shape as the defect Task 502's own index had to avoid — a second map keyed by id
    that a rename can desynchronise. **Look for the others while you are in there**: `labelsByAnchor`
    and the new `labelsByLinkAnchor` are keyed the same way, and a node rename is a real gesture too.
  - **Not observed in the wild**, which is why it is 75 and not 100: renaming a link and then
    dragging one of its nodes without an intervening redraw is a narrow path. It is still a throw.

- 75|531| **Tag the examples: US/SI, design/maintenance, xy/lat-lon.**
  Tom, 2026-08-25: *"Reference 348. Phase 1 can be adding labels, tags, or keywords to the
  examples."* **Task 348 is sub-categories and paging in the gallery, and is deliberately unbuilt at
  seven examples** — the grid is `auto-fit`, so both arrive without a rewrite when the wall stops
  fitting a screen. This is the half worth doing BEFORE that day, because it is what any grouping or
  filter would have to be built on.
  - **The three axes are his**, and each is a fact the example already has rather than an opinion
    somebody must supply: the unit set it opens in, whether it is a design exercise or a maintenance
    one, and whether it is an XY grid or a geographic project. **Two of the three are derivable from
    the file itself** (`units`, and `project.coords`), which is the cheap and non-rotting way to get
    them — a tag nobody has to maintain cannot go stale.
  - **Design vs maintenance is the one that needs a human**, and it is the one that carries real
    meaning for somebody choosing where to start.
  - `dev/scripts/generate_examples.php` builds the manifest and `generate_examples.php --check`
    guards it, so a derived tag belongs there rather than hand-written beside each example.
  - **A tag that is DISPLAYED is a string in 27 languages.** A tag used only to group or filter need
    not be. Decide which before writing any key — this is the difference between a cheap task and a
    sprint.

- 100|508| **Tom's screenshot drop: dozens of captures, indexed and reused.** His idea,
  2026-08-24: *"a folder in this project, not in git, where I can prolifically put screenshots by
  the dozens."* `dev/screenshots/` exists and is gitignored; the convention is in its README —
  ordinal names (`0001.png`), PNG, no describing in the filename.
  - **The value is that describing them is AI's job.** He captures; AI reads, writes one line per
    file in the tracked `dev/screenshots/INDEX.md`, and says which are publishable. The pictures do
    not survive a clone; what we learned from them does.
  - **No thumbnailer exists on this machine** — no ImageMagick, no Pillow, no PHP GD. Not worth
    installing one: a contact sheet is an untracked `sheet.html` with every image at 200 px wide,
    which is a thumbnail a browser makes for free.
  - Feeds Task 504 (a features list wants pictures), the LibreWaterNet landing page and its
    `graphics-plan.md`, and Task 459's sense of what the interface actually looks like in each
    language. **A screenshot is a screen** — the publishable/not judgement is made once, in the
    index, not every time somebody reaches for an image.
  - **A row must name the task that superseded it.** The 2026-08-25 phone session shot nine frames
    and five fixes landed the same day, so eight of the nine now show a bug that is gone. Without
    that note the next reader re-diagnoses a fixed defect from a stale picture — which is the whole
    cost the index exists to avoid.
  - **Publishable and useful are separate axes.** Publishable is the privacy test in the README and
    nothing else; a frame full of defects can still be safe to publish. Judging the two together
    once retired the best phone frame in the drop as a flat "No". Use **Not as is** for safe-but-stale.

- 100|509| **Edit mode on the path itself: drag any point, click a waypoint off.**
  **BUILT 2026-08-25.** The Edit button puts the PATH in edit mode: every node the route passes
  through wears a grab handle, and one gesture carries both operations Tom named —
  *"drag any waypoint or not-yet-waypoint on the path including the start and end."*
  - **The difference between "move" and "add" is a NUMBER, not a second gesture.**
    `EngCalcs.lpnProfile.pathHandles()` labels each route node with the stop it is, or −1 and the LEG
    it lies on. A labelled handle's stop is replaced; a −1 is inserted after the stop that begins its
    own leg — deliberately NOT `insertStop()`'s least-added-length, which could put the new stop on a
    different leg from the one under the hand. The ends are handles too, so "change one end" stopped
    being a pull-down.
  - **A DRAG THAT LANDS ON NOTHING PUTS THE PATH BACK AND SAYS SO.** A stop IS a node id, so bare map
    has no commit to make. Dropping the stop was rejected — a slip would be destructive where a click
    already removes deliberately — and so was snapping to the nearest node, which commits a stop
    nobody aimed at. A drop with no route is refused and names both nodes, the chooser's own refusal
    reached by the other gesture.
  - **THE BOX IS NOT SUPERSEDED, and both are entered by the same press.** It is the discoverable
    form, it is what a pointer-less reader gets, and it names the waypoints, which the drawing
    cannot. Edit mode and the box are ONE state: the button toggles it, its X and Escape leave it,
    and arming the chooser puts it away (the chooser writes a stop list `profileStops()` reads
    instead of from/to/waypoints).
  - **While it is on, the map drags nothing but a handle** — a handle sits exactly on a junction, so
    without that rule re-routing a path would also move the pipework.
    `dev/lpn-spike/profile-edit-harness.js` (48 checks, fake clock) asserts that one from the drag
    type and from the coordinate.
  - **Open: Tom's own pass.** Three new English keys await his wording — `lpn_profile_edit_say`,
    `_edit_tap`, `_edit_nowhere`.

- 100|510| **Saved paths work; the arrow that opens them is not discoverable.**
  **BUILT 2026-08-25** — `doc.profiles = [{id, name, stops}]`, in the project file, in the undo
  snapshot and in the dirty signature; **the stops the user chose, not the resolved route**, because
  freezing a node list would preserve a path through pipes since deleted and then disagree with the
  chart drawn beside it. An unknown id is kept verbatim, marked in the menu and named in a notice,
  but dropped from the DISPLAY, since a stop with no node routes nowhere. Which path is selected is
  deliberately NOT stored — that is a fact about a reader, like pane height. Round trip proved at the
  file boundary in `dev/lpn-spike/profile-saved-harness.js` (54 checks), and `.inp` export carries
  neither the name nor a section for one.
  - **THE CONTROL WAS REDRAWN 2026-08-25**, on Tom's ruling: *"The saved paths arrow is not designed
    right. It should be similar to the Project arrow and the Google Sheets tab arrow. It's too small
    and non-conforming to be discoverable."* It now takes `.lpn-tab-caret`'s numbers — this page's
    OWN answer to the same problem on the project tabs, and the spreadsheet arrow he named: full
    type, the tab's own vertical padding, a hairline rule instead of an 8px overlap into the word,
    and the tab's selected background so the two read as one tab with a caret.
  - **A touch target IS a legitimate argument here** — this is chrome, not the drawing surface — so
    the width floor is 2rem, rising to 2.75rem (44px) below 40rem. It grows SIDEWAYS only: the strip
    sits above a chart with the least height to spare on a phone (Task 527). Guarded at 360px in
    `dev/lpn-spike/small-screen-harness.js` and against the rendered box in `dev/browser-pass`.
  - **One hazard already handled, do not undo it:** the Profile tab's SECOND press is the command
    that starts drawing a path, so the arrow must never route through `openPane()` when Profile is
    already showing — otherwise reaching for a saved path arms the chooser every time.

- 50|269| **ASU Engineers Without Borders answered, and asked to meet.** Tom, 2026-08-10 — a human
  reply to outreach, and he has replied gratefully. This is the first real conversation this suite's
  mission has earned; prepare for the meeting and record what comes of it. Not a search-reach task,
  but it lives here because it is the same goal reached by a better road.

- 100|408| **Label leader dragging: an optional snap to 15°/30°/45° angle increments, user's choice.**
  Tom, 2026-08-17. A toggle or picker for the increment, not a forced snap — free dragging must stay
  available for whoever wants it.
  - **Open question, same day: magnet-style (soft pull toward the nearest increment, override-able by
    continuing to drag past it) instead of constrained (hard-locks to the grid of angles) snapping.**
    Tom named this as the more modern UX but flagged he does not know what's available to build it
    with. Not researched yet — this repo has no drag/snap library today (`js/looped-network.js`'s own
    pointer handlers do all dragging by hand), so the real choice is between a small hand-rolled
    magnet threshold (a few lines: snap only within N° of an increment, free otherwise) versus pulling
    in a library, which needs its own evaluation against this codebase's no-dependencies-shipped-to-
    visitors norm (`js/vendor/` today holds only the EPANET engine). Decide the mechanism before
    scoping the toggle above.

- 75|503| **AWAITING TOM'S WRITTEN OK — a `$ec_lang_syn` entry**, proposed while Task 426 borrowed the
  word *Non-destructive* for the shared units row and extracted from Task 425 on its close so the
  proposal does not vanish into a closed block. A translator cannot recover the term of art from the
  words, so: `$ec_lang_syn['calc_set_units_tip']='Changes the unit shown on every field at once
  (switches the whole page to that unit system); safe, harmless, does not overwrite anything, leaves
  your entries untouched, keeps the numbers you typed.'` **AI proposes; only Tom writes it.**
  - While here: Task 425 left three keys in the 26 non-English files that English no longer defines
    (`lpn_units_warn_body`, `lpn_units_reinterpret`, `lpn_units_convert`). Unreachable, so not a
    defect — retire them with `rename_lang_key.php`'s 27-file pass, or in the next lpn sprint.

- 75|441| **Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with
  autohide.** Tom raised it 2026-08-18 without asking for it yet. Nothing in the box is designed
  against it — one element, one placement function.

- 25|465| **[H] Reusable pipe and pump TYPES, so editing one edits 400.**
  - **RESEARCHED 2026-08-25 by `utility-planning-engineer`, and its answer is: TWO features, not
    one — which is the thing we would have got wrong.** WaterGEMS separates a **Prototype** (stamps
    starting values onto elements drawn AFTERWARDS, not retroactive) from an **Engineering Library**
    (live-linked, retroactive). This task conflates them. Its recommendation: **leave the full type
    system parked** — at this suite's stated scale the motivating case cannot arise, roughness is a
    function of material AND AGE so even "a PVC type" needs a per-element qualifier, and diameter is
    not shared even in the commercial tools. **Find-and-replace already does better than a library
    on the thing that matters**: it previews an exact change count before writing and goes through
    `setProp()`, where a live-linked library edit propagates with no confirmation step it could
    find documented. **The one slice it does NOT rank low: a live-linked pump CURVE table** — no
    aging wrinkle, no diameter conflation, `curveRef` already copies once, and the Curves panel's
    own code comment names the missing piece (`js/looped-network.js:19466`).
  One "150 mm PVC" definition that 400 pipes point at. A type carries diameter, roughness and minor-loss k; an element names
  a type instead of repeating the numbers. Tom named these beside Patterns/Curves/Controls in Task 462,
  but those are things the document already HOLDS — this is a new indirection through the element model.
  - **It starts at `effective()`, which is the expensive part.** A third resolution layer — override →
    element → type-default — under the one seam the solver, renderer, labels, popups and six pane
    tables all read through. Plus a visible detached-versus-inherited state per property, or a user
    edits a definition and cannot see why nothing moved.
  - **EPANET has no such concept**, so an `.inp` export flattens it and an import can never rebuild it,
    which breaks Task 281's byte-identical round trip for anything typed. Task 390-sized.

- 50|498| **A public roadmap, with epanet-js's Canny board as the worked example.**
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

- 75|185| **Match/Copy properties tool (originated during Task 146).** Tom, 2026-07-30: "In the absence of the
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

  **Kept and still liked (Tom, 2026-08-13): "Very nice idea. I love it."** Keep it a click-source-
  then-click-targets tool: that is the right shape when you are drawing 15 pipes and want this one
  to look like that one. Do not grow it into a query tool — search-and-replace is now Task 389 and
  is a better fit for its own job, so the two ship side by side rather than one becoming the other.

- 25|217| **A suite-owned, multilingual Manning's n table, built from primary sources.** Tom,
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

- 75|247| **Customers: metered demands with account numbers, lumped to the nearest node.**
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

- 75|248.03| **Rule-based controls, EPANET's `[RULES]` (Task 248 child).** Simple `[CONTROLS]` shipped
  2026-08-18 — the Libraries box adds, edits, validates and deletes them, an unreadable sentence is kept
  and marked rather than discarded, and only a fully understood one reaches the engine.
  - Deliberately parked: rule-based is a language, and it can wait for evidence that a user has one.

- 25|266| **Multi-select (lasso) plus edit-all-selected, as EPANET has.** Tom, 2026-08-10: *"very nice
  for bigger models."* Today's selection model is single-element — `openEditMenu()` already says so
  where it explains why "Select all" is absent. Wants a rubber-band select and one property sheet
  that writes a value to every selected element. **Blocked on Task 415's `selected` property**, which
  is the foundation this was always missing.

- 25|283| **Map label legibility: what remains is the AUTO-HIDE rule.** Tom, 2026-08-11, after
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
  `log-human-view.php` and `log-calc-event.php` record **page and language and nothing else**, so
  there is no device signal anywhere in this project's instrumentation — every touch-target,
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

- 75|322| **Convert standing advisories into checks, and survey for the ones nobody has named.**
  Tom, 2026-08-25: *"322 convert to scripts and include a broad survey for other such
  recommendations."* `check_all.sh` reports these every run and nobody can act on them — and
  CLAUDE.md's own argument is that **a rule a machine enforces is worth roughly ten a human must
  remember.** Every rule here that became a script stopped being violated; every rule that stayed
  prose kept being violated by people who had read it.
  - **The survey is the new half and it is the bigger one.** Read the whole of `CLAUDE.md` and the
    `dev/*.md` set and list every rule stated as prose that a script COULD enforce, with the cost of
    each. That file says outright that its unexecutable half is decoration; nobody has ever gone
    through and counted which half that is.
  - **`js/looped-network.js` is over 20,000 lines**, with `rebuildSettingsFields()` and
    `drawExampleNetwork()` the two obvious extractions. Task 293 established the split-by-PURITY
    pattern and it worked. *(The 9,740 recorded here through 2026-08-23 was less than half the truth
    — an advisory nobody acts on is also an advisory nobody re-reads.)*
  - **DONE 2026-08-25:** `key_hygiene_check.php` learned two more dynamic-key shapes (an interpolated
    build and a prefix test), dropping 14 false orphans from its list — 35 → 21, then → 16 after
    Task 294's deletions. A check that is 40% noise is a check people learn to skip.
  - **DONE 2026-08-23:** `mpf_spreadheet_notice` renamed to `mpf_spreadsheet_notice` across all 27
    lang files in one `rename_lang_key.php` pass.
  - **DONE 2026-08-14:** the js syntax check globs `sw.js` and `js/vendor/` too.

- 25|348| **Sub-categories and paging in the examples gallery.** The grid is `auto-fit`, so both
  arrive without a rewrite. Deliberately not built at six examples; worth doing when the wall stops
  fitting on a screen.

- 25|390| **Finish the unit paradigm migration: a unit is a NAME.**
  And a file's numbers are the user's. Diagnosis, measurements and dependency order: **`dev/unit-paradigm-migration.md`**.
  - **All six steps are DONE** (five 2026-08-16, the reservoir head 2026-08-17). What is left is the
    acceptance criterion, which only `.inp` EXPORT can satisfy.
  - **No choice of constant could have fixed this**: 36.7% of a 20,000 sample fails to round-trip
    bit-identically even with exact factors, worse than the 26% before them; 9.3% of EPA's own
    tokens reformat under `parseFloat` however exact the arithmetic is.
  - The five new unit keys (`u_imgd`, `u_afd`, `u_lpm`, `u_cmh`, `u_cmd`) and `lpn_unit_unknown` are
    in `lang.ec.en.php` only, and fold into the queued sprint.
  - **Acceptance: import then export is BYTE-IDENTICAL for every value the user did not edit.** Also
    Task 281's criterion.

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

- 75|417| **Long-press enters Edit mode, and the phone's touch radius is too mean.**
  Two things, and Tom added the second on 2026-08-25: *"417 phone radius needs to be larger more
  forgiving for the switch-to-edit-mode decision on tapping an asset (I assume any asset, not just a
  new asset)."* **Read that as ANY asset** — his own parenthesis, and it is the scope.
  - **The original:** the guard that switches to Edit mode on click does not fire when a long press
    begins a drag, so a touch user who presses and drags is editing an element the page does not
    think is selected for editing. Same guard, second trigger. Task 192 has why long-press is the
    touch equivalent generally.
  - **The new half:** the hit radius that decides "you tapped an asset" is tuned for a pointer, and a
    finger is not a pointer. CLAUDE.md's rule stands — *say "pointer slop" when you mean
    hand-and-mouse tolerance, and a 44px touch target is not an argument here* — but that rule is
    about not letting phone ergonomics drive the DESKTOP design, not about being stingy on a phone.
    **A touch-derived radius is a different number from a mouse-derived one and should be one.**
  - `hitConfirmed()` is where the float32 half of this was already fixed, so it is the place to look
    first. Whatever number is chosen must be asserted at 360px, where every other phone fix is
    guarded.

- 75|468| **Demand categories on a junction — the breakdown the importer already flattens.**
  EPANET stacks (base demand, pattern, category) triples on one node and sums them; `js/lpn-inp.js`
  reads them, sums them into this page's single `demand`, and reports `demand-categories` on every
  import that had one. So the data arrives and is thrown away today.
  - Design, not analysis: *50 gpm residential + 20 gpm irrigation on this node* is how the demand is
    actually assembled. With Task 191 (emitters) this completes the EPANET flow model bar the global
    demand multiplier, which the importer already applies.
  - **WHAT THE TWO COLUMNS MEAN, settled by Tom 2026-08-21: the PATTERN is the type of user
    ("residential", "restaurant"); the CATEGORY is WHO ("Elm Acres", "Taco Bell 354").** That is why
    no validation is needed and no registry is wanted — it is a name, not a key. Label it *Category*
    with the tip *"Name or description of the user or users using this pattern"*. EPANET itself
    validates nothing here and runs happily with varying descriptions on one pattern.
  - **epanet-js measured (Tom, 2026-08-21): it has no Category column at all — base demand and
    pattern only — and it imports categories as CONSTANT FLOWS, losing the pattern link even though
    it imports the patterns themselves.** So this is a place we can be plainly better, not just
    different; see `dev/positioning.md`.
  - Touches the scenario write seam (`setProp`), the popup, the importer, and Task 281's exporter —
    a per-category override is the question to settle first.
  - **Ship before Task 247, whose Customer is one of these rows extended** (`dev/customer-demands.md`).
  - **Tom, 2026-08-24: the totals are ADDITIVE and nothing is deducted.** A junction's demand is its
    own rows plus its customers' — placing a meter never edits a row the user typed. And the
    exporter writes `[DEMANDS]` **itemized**, one row per demand: any lumping for readability is a
    presentation decision in the pane and the popup, never a change to the file.

- 25|484| **Log which unhandled EPANET features actually arrive in real imports.**
  A server-side count of the import features we do not handle, so Task 483 and its siblings are
  driven by what users really bring rather than by what we imagine. **This is analytics, so the log
  row is gated on `ecAnalyticsConsented()`** — the non-obvious part, and the reason it is not simply
  a counter.

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

- 5|175| **A real printable version, suite-wide.** Raised by Tom, 2026-07-30, while reviewing the
  `lpn_` map page: the suite's only print affordance today is `d-print-none` hiding chrome
  (toolbar, unit-select row, nav) so `Ctrl+P` on the bare page reads a little cleaner — there is no
  actual "printable view" (clean pagination, a results summary, a static rendering of an SVG
  canvas like `lpn_`'s map). Not designed yet — Tom's own fallback today is a screenshot, which
  works but produces something the reader can't page through or reflow. Whoever picks this up
  should figure out what "printable" should even mean per calculator type (a two-column input/
  result form vs. a map/canvas page are different problems) before building anything.

- 75|178| **NOTHING in the suite links to the screenshots page. Fix that first.**
  **CORRECTION, 2026-08-25.** The previous version of this block implied Help already pointed at
  `https://librewaternet.org/screenshots.html`. Tom: *"What points at the live screenshots page? I
  expected Help, but that doesn't."* **He is right and I checked: nothing does.** No `.php` in this
  suite contains the string `librewaternet` outside `lib/config.inc.php`'s canonical whitelist. The
  page is live, annotated and unreachable from the software it depicts.
  - **Phase 1, and it is nearly free: a link from Help.** The pictures exist and are maintained in
    another repository; Help carrying a link costs one string and goes stale only when the page
    does. **[H] Where in Help, and the wording, are Tom's.**
  - **Phase 2 is the original task and is NOT the same thing:** a filmstrip GIF from
    `dev/filmstrip-gif-recipe.md` (the add-pipe / add-junction workflow). A 2026-07-30 proof of
    concept showed it is cheap once set up — the hard part is precise SVG click targeting, not GIF
    assembly — and the POC GIFs were never committed.
  - **They are not substitutes.** A still shows a STATE; only a moving asset shows a GESTURE, and
    "how do I draw a pipe" is a gesture. Doing phase 1 does not retire phase 2.

- 5|181| **Per-element symbol sizing (originated during Task 146).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.

- 50|186| **Make the Tables pane spreadsheet-interoperable.**
  Reworked by Tom 2026-08-25: *"186 reworked to make our Tables spreadsheet-interoperable."* The
  original asked for a whole table-paradigm EDITOR (*"For the future a table-paradigm editor with
  spreadsheet-like copy and paste would be very cool"*, 2026-07-30). **The rework is smaller and
  better aimed: we already HAVE tables — make them talk to a spreadsheet.**
  - **Out means copy and paste that lands correctly**, with the headers, in the units on the strip.
    The pane already builds the rows; what a spreadsheet needs is tab-separated text on the
    clipboard, which is a formatter, not an editor.
  - **In is the harder half and is where the old task's real content survives**: paste parsing,
    per-column unit handling, undo integration, and validation of every pasted cell. **A paste is
    the user typing, so every rule about the user's own numbers applies to it.**
  - **Do the OUT direction first and separately.** It is most of the value — a model that already
    exists in a spreadsheet is the case Tom named, and getting a report out is what a submittal
    needs — and it cannot corrupt anything.
  - Distinct from Task 146.04 (node/link report tables), which is read-only reporting.

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

Evidence base for this whole section: the 2026-07-27 Google Search Console query export — cluster
table, CTRs and the two smaller findings are in `dev/usage-data-log.md`. The headline: **Manning is
won and needs nothing** (position 1, 25% CTR), while the comparable sewer-slope cluster converts at 1%.

## Completed

**Closed IDs live in `dev/roadmap-closed-ids.md`**, one line each so a cited `Task N` still resolves;
the text stays in git. `roadmap_id_check.php` reads both files: an ID is unique across the pair, and
priority 0 means the block is in the ledger and nowhere else.
