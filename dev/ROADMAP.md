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


- 25|574| **What is left of the `.net` slot map: nine slots nothing identifies.**
  **MOSTLY CLOSED 2026-09-03.** The slots were MEASURED, not inferred: the import report prints
  `index: value`, Tom imported his Net3 and read the indices back, and every name was then checked
  against what EPANET itself wrote for the same model (`dev/net-import-study/`). Two independent
  sources agreeing on both index and value is what confirmed it.
  - **Named now:** `[TIMES]` 23-31 (all nine, in order), `[ENERGY]` 32-35 (34 is the optional
    `Global Pattern`, which is what explains the gap), `[REPORT] Status` at 10, the water-quality
    trio 11/12/14 as ONE line, `CheckFreq`/`MaxCheck`/`DampLimit` 36-38, and EPANET 2.2's PDA
    quartet 41-44.
  - **THE DEFECT THIS CLOSES: `[TIMES]` was never written**, so every `.net` ever imported arrived
    with no duration and no timesteps, and an extended-period model silently became a single
    instant. `[ENERGY]` and `[REPORT]` were lost the same way.
  - **Still unnamed and still reported: 16-22, 39, 40** -- `1`, `First` and a run of zeros that
    EPANET's own export of the same model does not state anywhere, so there is nothing to match
    them against. They cost nothing while they are reported, and naming one from a guess is what
    the first attempt did.
  - **THE FIRST ATTEMPT IS WORTH KEEPING IN MIND, because it looked right.** The same values without
    their indices decoded plausibly against EPANET's section order and were WRONG by one, which
    wrote `Duration 0.0` and `HeadError 10` into a converted file. The values were right and the
    offsets were not; a run of repeated zeros cannot be counted by eye. The repair was not more
    care, it was making the file state its own indices.



- 75|578| **Fire flow: the EPS frame and the Run concept, extracted from 530.**
  Everything else in Task 530 shipped and that task is closed. Two phases were never built and are
  kept here so they are not lost in a closed block.
  - **Picking an EPS frame.** The sweep answers one instant. A project with a clock has many, and
    the honest question is which one a fire flow is checked at -- maximum day is the convention, and
    the page has no way to say "run the sweep at hour 14".
  - **The Run concept, in Tom's own sketch (2026-08-27):** *"a Run names a scenario among its
    parameters."* A named Run would carry the scenario, the required flow, the residual and the
    frame together, so a report says what it was a report OF.

- 100|583| **Two EPS sentences left, and one states an unmeasured cause.**
  Tom read `dev/eps-terminology-audit.md` and marked all eight rows; his marks are committed verbatim
  (`9562285a`) and §4 records what came of each. **Five applied 2026-09-04** -- three translated, so
  **78 retranslations are owed** (`lpn_inp_drop_eps`, `lpn_time_no_engine`, `lpn_time_no_period`).
  - **`lpn_energy_over` is SETTLED**, in a second ruling the same day and in his own wording: *For
    extended period simulation of {time}*. The first pass had dropped the duration, which
    `energy-anchor-harness.js` caught as the guarded property it is; he rejected the two-line repair
    and put the duration back inside the sentence. Untranslated, so free. §4 has the one place the
    shipped string departs from his sketch and why (H:MM cannot carry a trailing "hours").
  - **`lpn_time_running` is the one row of eight he left blank.** Unruled, so unchanged, and the
    audit rated it the single best place to name the analysis: it is the progress line.
  - **[H] `lpn_time_run_note` was not a wording question, and answering it found a defect** (§5).
    The behaviour is sound -- the page computes one instant of an EPS project only when the user has
    unchecked *Recalculate automatically* themselves, `autoRunAllowed()` being the whole gate, and
    above `LPN_TIME_SLOW_MS` the page only advises it. **But the sentence asserts a speed the code
    never tests**: `lpnTimeStatusNote()` reads no timing at all, so a user who unchecks the box on a
    fast network is told their network is slow. Replacement in §5, awaiting his word. Translated: 26.


- 100|581| **An empty box cannot say "this file states zero" apart from "nothing is set".**
  Found 2026-09-04 while Tom read the refreshed gallery: Net2 states `Fluoride mg/L` with all-zero
  reaction globals, and Net3 states price 0 and demand charge 0, so the examples are faithful and
  the interface still reads as though the numbers were never filled in. **Sparseness is deliberate
  and load-bearing** -- an empty box exports no line and a typed zero exports a line stating zero,
  and those are two different files (Task 553) -- so the fix is not to fill the box. It is to show
  the difference, and the honest question is whether a reader ever needs to see it or only an
  exporter does.


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

- 75|479| **[H] The suite answers at librewaternet.org/app -- one path, and it is not `/engcalcs/`.**
  **TOM'S ANSWER, 2026-09-05:** *"LibreWaterNet.org/app is what I think the url would be."* That
  settles the goal and MOVES the work, because the plan below assumed the path stayed `/engcalcs/`
  and one symlink would do it. **`/app` makes this Task 487's problem** -- 210 absolute
  `/engcalcs/...` paths resolve only under that one path name, which is why 487 was raised the same
  day. Sequence: 487 first, then this.
  - **The canonical decision is still his and is unchanged by the path.** `librewaternet.org` maps
    to `https://librewaternet.org` in the whitelist, so a mirror would serve two copies of every
    page each declaring ITSELF canonical -- not a penalty, but a split signal. Map it to
    `https://hawsedc.com` so the mirror defers, or accept the split for the marketing gain.
  *(Superseded, kept so it is not re-proposed: the `/engcalcs/` symlink, and the 2026-08-25 parking
  of the question for want of clarity. Clarity arrived.)*
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

- 50|487| **The suite only works when its URL path is `/engcalcs/`.**
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

- 75|465| **[H] Reusable pipe and pump TYPES, so editing one edits 400.**
  - **RAISED FROM 25 ON TOM'S OWN WORDS, 2026-09-05:** *"Pipe library: I foresee very soon that we
    will add the ability to refer to a library pipe for roughness, reaction coefficients, and maybe
    diameter (depending on what user chooses to include in the library pipe definition). The Library
    pipe selector can be immediately after ID, and any properties defined in the Library are disabled
    or removed in the pipe properties box. Very cool and open to user needs."*
  - **HIS SHAPE ANSWERS THE ENGINEER'S TWO OBJECTIONS BELOW, WHICH IS WHY IT IS WORTH SAYING THEY
    DISAGREE.** The engineer ranked this low partly because roughness is a function of material AND
    age (so "a PVC type" needs a per-element qualifier) and partly because a live-linked edit
    propagates with no confirmation step. Tom's version makes the definition's CONTENTS the user's
    choice — a library pipe that states roughness and not diameter is legal — so the aging wrinkle is
    the user's to resolve by defining two library pipes, not ours to model. And a property the library
    defines is DISABLED in the properties box, which is the visible detached-versus-inherited state
    the note below says is mandatory, arrived at from the other direction.
  - **AND THE INDIRECTION IS NO LONGER NEW.** Task 586 shipped exactly this pattern for curves: a
    document-level object, an element holding only a reference, a Library section that creates and
    renames and refuses to delete what is in use, and a rename that carries every reference. The
    engineer's "one slice it does NOT rank low" was the pump curve, and it is built. What is left for
    pipes is `effective()` and the disabled-control rendering, not the concept.
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

- 25|266| **Multi-select (lasso) plus edit-all-selected, as EPANET has.** Tom, 2026-08-10: *"very nice
  for bigger models."* Today's selection model is single-element — `openEditMenu()` already says so
  where it explains why "Select all" is absent. Wants a rubber-band select and one property sheet
  that writes a value to every selected element. **Blocked on Task 415's `selected` property**, which
  is the foundation this was always missing.

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



- 75|569| **The cursor flickers to the default pointer at ~12 px from a node, on a PC.**
  Tom, 2026-09-01: *"As I wander the mouse around the map, it occasionally flickers from pan/drag
  cross to default pointer. If I am painstakingly slow and precise, I can return the mouse to any
  such flicker point and see it dwell as a default pointer. There is nothing at these points apparent
  to me that explains the default pointer except that it almost (!) reliably happens at 12px from the
  point of a node (the 24px diameter)."* Long-recognized, never diagnosed. He rates it *"slightly
  mystifying and annoying"* rather than harmful — *"Did I see what I thought I saw? Why?"*
  - **12 px is not one of the touch numbers**, which is what makes it interesting: `POINTER_REACH_PX`
    is 14 and `TOUCH_REACH_PX` is 24 (closed Task 562), and the default `settings.symbolSize` is 7.
    Something is drawing or hit-testing a ring at a radius nobody declared. A DOM element with no
    cursor rule of its own, sitting between the node and its rivals, is the shape to look for.

- 50|590| **A fittings picker, so a pipe's `k` is summed rather than guessed.**
  Tom, 2026-09-05, on the market researcher's finding: *"Fittings library: Put it in our roadmap.
  Thanks, Market Researcher!"* A `lpn_` pipe has one bare minor-loss `k` field and nothing else.
  - **Every tool the seat could examine offers a picker and none defaults to a nonzero `k`:**
    EPANET 0, epanet-js 0 (verified in their source, `DEFAULT_MINOR_LOSS = 0`), WaterGEMS/WaterCAD's
    *Minor Loss Collection* and KYPipe's *SigmaM* both sum named fittings and quantities, which is
    zero absent a pick. **So the DEFAULT stays zero** -- that half was asked and answered, and it is
    the rejected alternative worth keeping.
  - **The seat ranks it BELOW CSV/GPX import and says why:** it has no evidence anybody in this
    suite's actual population (small and rural utilities, EWB, Peace Corps) has hit it as a blocker,
    where CSV/GPX has a documented forum trail of people stuck. Sizing it is the planning
    engineer's, not the researcher's. `dev/agents/market-researcher/wishlist.md` No. 5.
  - The shape a k table would take is this page's own settled one: a Library object elements refer
    to, as a curve is since Task 586 -- not a per-element blob.

- 100|591| **The Not EPANET site: a gateway built on deep honesty and deep gratitude.**
  Tom, 2026-09-06: *"I want to add to our roadmap a task to create this Not EPANET web site as a
  gateway to lwn and lpn. My vision is for it to be a model/example/demonstration/leadership of
  deep honesty and deep gratitude."*
  - **`not-epanet.org` IS THE CANONICAL NAME**, settled the same day by his own correction: *"When
    I saw that notepanet.org had the word 'note' in it prominently, I felt that I had made a
    mistake, and so I registered not-epanet.org as a correction."* The standing advice against
    hyphenated domains does not reach this case -- it is about names whose unhyphenated form reads
    correctly, and `notepanet` reads as "note panet" to everyone. A hyphen setting a word boundary
    is the standard remedy for exactly that, and camel case cannot help because host names are
    case-insensitive and display lowercased. The other five are defensive and redirect here.
    The draft folder is `~/webdev/not-epanet.org`, named for it.
  - **THIS IS THE RULING TASK 544 WAS OPENED TO WAIT FOR, and it REVERSES a standing rule.**
    `dev/positioning.md` §1 says no competitor appears in a title, meta description, tagline, menu
    item or headline, and extends that to names we legally could use. A site called Not EPANET is
    that rule inverted on purpose. His argument is the one to keep: *"That feels deeply honest and
    quietly rebuking of name dropping while all the while invoking the EPANET name for SEO."*
    **The reversal is scoped to EPANET and to this site.** Every live commercial trademark stays
    banned everywhere, and the invitation still leads on LibreWaterNet itself.
  - **The two halves are his, and the honesty half is the load-bearing one:** deeply dependent on
    EPANET; not public domain and therefore less free, less trusting and arguably less collegial
    than EPANET, under GPL-3.0 deliberately and open to being argued out of it; new, with all that
    implies; and AI-assisted, with his own reason for using AI at all. The gratitude half names the
    US government, the EPA, the public domain release, the libraries, EPANET's UI, and *"successors
    and other great souls (Cynthia Brewer, Richard M. Stallman, etc)"*.
  - **The risk this task exists to manage is EPA endorsement.** Nothing may imply affiliation,
    sponsorship or review by a federal agency, and the disclaimer is the site's whole premise, so it
    leads. Naming Cynthia Brewer is separately constrained by the ColorBrewer licence, which this
    suite already carries: attribution is required and promotion is forbidden.
  - Draft lives outside this repository at `~/webdev/notepanet.org`, as the landing page does.
    Nothing is deployed and no domain is pointed anywhere without Tom saying so.

- 100|322| **Convert standing advisories into checks, and survey for the ones nobody has named.**
  Tom, 2026-08-25: *"322 convert to scripts and include a broad survey for other such
  recommendations."* Record, ranked list and the per-runner audit: `dev/enforceable-rules-survey.md`.
  - **HALF A IS DONE.** 62 rules enforced, 4 left (rows 13, 14, 22, 23) and every one states why no
    blocking `check_all.sh` entry can hold it: two are advisory at best, two are git hooks and
    `check_all.sh` runs before a commit message exists. Three landed rows found the RULE was wrong
    rather than the code, each only by trying to execute it.
  - **HALF B IS NOT, AND THE 2026-09-06 PASS IS WHY.** Five rules had been classified into neither
    column, and the one that matters was **in no document at all**: `js/*.js` writes every string
    read as `pc.<key> || '<English literal>'`, so 892 uncontrolled second copies of
    `lang.ec.en.php` ship and **199 already disagree** — including a sentence struck as false, two
    that fall back to the empty string, and a control the language file calls `Calculate` and the
    fallback calls `Run`. `pageconfig_check.php` guarantees the key is supplied, so none of it ever
    renders and nothing had ever compared them. Held as a ratchet (`js_fallback_string_check.php`);
    **walking 199 to zero and making it absolute is the open work.**
  - **THE TRANSFERABLE METHOD, and the reason this stays open:** re-reading `CLAUDE.md` cannot find
    a rule nobody wrote down. Row 32 came from COUNTING a repeated construct in the source and
    asking what writing it 892 times assumes. Next pass does that to `js/` and `lib/` as well as
    re-reading the prose.
  - **Row 13's own worst offender was this block**, at 201 lines against a 15-line cap, until it
    was compressed on 2026-09-06.

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

- 75|539| **Gang the neighbour labels so their leaders stop crossing.**
  Tom, 2026-08-26, with a screenshot of two node labels whose leaders cross: *"This might be
  forgiveable if it looked difficult or impossible. But when it looks so easy (to a human) to
  resolve, it's embarrassing."* **That is the right test and it is the one to build against** — not
  "are the labels legible" but "would a person looking at this see an obvious fix we missed".
  - **His strategy, and the name is his:** *"can two nearby nodes be labeled as a gang in a
    direction that makes their leaders mutually clear each other's nodes? Maybe we call this the
    gang neighbor nodes strategy."* Three ingredients he lists: **(a)** knowledge of the most-open
    sectors, **(b)** full awareness of the immediate vicinity of the labels, **(c)** parallel
    leaders and/or label stacking.
  - **What makes this different from every previous label pass** is that it optimises a PAIR (or a
    small cluster) rather than one label at a time. `shedAlignedForConflicts()` places one label,
    then treats it as an obstacle for the next — which is why two labels can each be locally
    reasonable and jointly absurd. A gang move has to consider both placements together.
  - **HIS OWN RULE, 2026-08-26:** *"Maybe it's as simple as, if two leaders cross or if a label
    crosses a leader, try stacking their labels."* Two triggers, one remedy, and the second is the
    one the first would miss.
  - **He marked FIVE gangs on one screenshot of Net3-World** (A–E, 2026-08-26): four pairs of near
    neighbours whose leaders splay apart, and one cluster near the reservoir where three labels
    compete for the same open sector.
  - **PHASE ONE IS BUILT AND THE NUMBERS ARE IN `dev/label-placement-algorithms.md` §8** —
    `Collide.labelCrossings()` plus `dev/lpn-spike/label-crossing-harness.js`, measuring every
    shipped example at four zooms. **Read §8 before designing phase two**, with the survey it sits
    in: a crossing pair is the conflict-graph case §6 covers, and Task 400 parked that only for
    lack of real-world feedback. The findings, one line each: Net3-World holds exactly five
    node-label gangs at the fit zoom, four pairs and one triple, which is the shape Tom marked;
    **9 leader-leader crossings against 76 label-on-leader across 28 measured drawings**, so the
    cheap test alone would see a tenth of the problem; and the count is a fact about a VIEW, so
    phase two is judged on one stated view before and after.
  - Phase two is therefore a COMPARISON and needs no absolute target: stack a flagged gang,
    re-measure the same view, and the count falls or the strategy is wrong.


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

- 75|186| **Make the Tables pane spreadsheet-interoperable.**
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
  - **The Library's Curves grid already does both directions, for curves alone** (Task 588): a
    spreadsheet paste in, a Copy points button out, TSV either way. It is the worked example of the
    paste rules above rather than a claim on this task -- `libPasteCells()`, `libDropNameColumn()`
    and `libMergePaste()` in `js/looped-network.js` are pure and reusable, and the Tables pane's own
    per-column units are the part they do not answer.

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
