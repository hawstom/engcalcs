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

- 100|145| **GEOGRAPHIC PROJECTS: grid or geographic, declared before anything is drawn.**
  A project declares it the same way it declares units. Scope, the three places "geo is just another unit" stops holding, the
  basemap, the unprojected display and the projection seam: **`dev/geographic-projects.md`**.
  - **DONE, slices 1-3:** the declaration and degrees at every user boundary; the OpenStreetMap
    raster basemap; and the placement tool (File > Convert to lat/lon…), plus a globe-wide
    zoom floor and Go to latitude, longitude. Terms are Tom's: **XY** and **lat/lon**. Detail, and a
    proposed `$ec_lang_syn` diff still awaiting his approval: **`dev/georeferencing.md`**.
  - **NEXT: the projection seam, and it is its own task-sized piece of work.** The cheap version — an
    internal Mercator frame with a lon/lat file — redefines `doc.nodes[].x` under `js/lpn-inp.js` and
    the `.inp` exporter, so it must be sequenced AFTER them, not run beside them.
  - **Web Mercator must NOT become the document's coordinate system**, and its distances are not
    ground distances (`1/cos(latitude)`: ~15% at 40°, ~30% at 50°). This is the strongest argument for
    the standing rule that **`len` is stored and overridable, never derived.**
  - **THE ONLY UNDECLARED PROJECT IS THE ONE AT BOOT.** File > New declares grid-or-geographic by
    which of its four rows you click, and an import reads it from the file — so every other route
    already carries the answer (Tom, 2026-08-21, confirmed in `newProjectRows()`). What is left is the
    first tab of a first visit, which is born grid without anybody saying so. Task 477 is where that
    gets asked.

- 100|389| **Search and replace inputs across the network, no longer gated on size.**
  WANTED, and no longer gated on network size. Tom, 2026-08-16: *"I would like search and replace embraced more explicitly."* That
  reverses this file's earlier position, which said find-and-replace was a big-network tool we
  should not borrow for a design tool. The reversal is deliberate: a designer re-roughening every
  PVC pipe, or bumping every 6-inch main to 8-inch after a fire-flow run, is doing DESIGN, not
  management — the operation is just as native to 15 pipes as to 4,000.
  - Pairs with Task 353 (find elements by searching): **353 is the query, 389 is the query plus a
    write.** Build 353's selector first and let 389 reuse it rather than growing a second one.
  - Must preview before it writes — "37 pipes will change" with the ability to cancel — and must be
    one undo step, not 37.
  - Goes through `setProp()` like every other property write, or it edits BASE from inside a
    scenario. That seam has already produced five user-reachable defects; `scenario_seam_check.php`
    guards it.
  - Distinct from Task 185 (Match/Copy properties), which stays a click-source-then-click-targets
    tool. Both ship; neither replaces the other.

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
  - Placement leftovers, small: a background image is not carried onto the map, the two-control-point
    path (`lpnGeorefFromTwoPoints`) is built and tested with no interface, and Finish is not undoable.
  - **Held in HEIGHT, not width:** a long north-south journey stretches the model east-west by the
    map's own 1/cos(latitude) — 9% from 20° to 31°. Unavoidable on an unprojected display without an
    anisotropic transform, which `js/lpn-georef.js` refuses by design. `dev/georeferencing.md`.

- 100|439| **The lat/lon drawing comes apart past ~600,000 px/degree.**
  It is Task 354 in degrees. A node's `<circle>` rasterises at x = −41,548,184 and is simply not on screen, while `maxScale()`
  for a geographic project is 5.56e7. The medicine is the one Task 354 already used — coordinates
  local to an origin — but `LPN_ORIGIN_THRESHOLD` is 1e4 and a longitude is 122, so no geographic
  document is ever rebased, and `georefStart()` deliberately sets `doc.origin = {0, 0}`. Touches the
  placement tool, the basemap and the stored file format, so it is its own task.
  - The hit-test half of the same float32 story IS fixed (`hitConfirmed()`), at every zoom where the
    drawing is still correct.

- 100|459| WAIT: sprint — **The next sprint's contents, already earned.** Tasks 405 and 458 merged
  here 2026-08-22: identical blocker, identical action — run one sprint. **ASKED AND HELD 2026-08-21:**
  offered a full 26-language run or a core-four run, Tom chose "hold the sprint entirely"; do not
  re-propose without a reason he has not already heard.
  - **Four English strings resynced after sprint 397's zero-drift baseline (was 405).**
    `lpn_settings_readability_bias` (five languages raised it independently — this project's own
    threshold for an English-source defect) and `lpn_field_text_match_pipe` (three did; it is a
    button, not a toggle). `lpn_examples_size` and `lpn_ex_net3_desc` were factually WRONG about what
    a number counted, and nothing in the build compares prose against a network.
  - **14 mode-name disagreements in ru, sr, tr and zh (was 458).** A language's `lpn_geomap` or
    `lpn_xymap` disagrees with its other mode-naming strings, so a reader meets two names for one kind
    of project. `mode_name_check.php` names the exact strings; inflected languages, so sprint not sed.
  - **CHANGED/NEW since sprint 438:** five `lpn_notes_*`, `lpn_file_import_inp_tip`, `lpn_clean_map`
    ("Reduce map clutter"); NEW `lpn_color_mode_manual`, `lpn_time_no_period`, three
    `lpn_basemap_satellite_*`, `lpn_tables_menu(_tip)`, `lpn_run_menu_tip`,
    `lpn_settings_auto_run(_tip)`, `lpn_time_run_slow`. Wave 0 over the changed set first.
  - **Earned 2026-08-23:** `lpn_settings_legend_position` → `Labels legend position`; Tom found it
    ambiguous against the colour key, whose control already says `Color legend position`. 26 stale.

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

- 75|477| **[H] New blank project startup wizard: xy/lat-lon, units, head loss.** Tom, 2026-08-22,
  naming the scope. It replaces the four-row File > New fly-out; on epanet-js, *"they have a wizard
  box with xy and lat/lon as the top choices, and if lat/lon is selected, a search box is enabled.
  Below it are the units and head loss formula selectors."*
  - It answers three open things at once: the coordinate declaration for the boot project (Task 145's
    last gap), head-loss formula at creation rather than buried in Settings, and a home for the
    geocoder that already works — `js/lpn-search.js`, its search box enabled when lat/lon is chosen.
    **Tom has ruled out a standalone search interface for now** (Task 437, closed into this one):
    *"There's not a lot of reason for search once you are at your model."*
  - **Against it:** the current fly-out ASKS FOR NOTHING — the choice is which row you click, and a
    wizard puts a form in front of the commonest action. Weigh that before building.

- 75|479| **LibreWaterNet.org needs a landing page, and this account needs a hosting decision.**
  Options, the measured facts and the recommendation: `dev/hosting-layout.md`. Positioning is settled
  in `dev/positioning.md` — lead with the invitation, not the comparison.
  - **DONE 2026-08-23, the whole code half.** `CANONICAL_ORIGIN` is now a host → origin whitelist
    (`lib/config.inc.php`), so the same checkout served at librewaternet.org stops asking Google to
    index hawsedc.com. Blocking guard: `dev/scripts/canonical_origin_check.php`. **Nothing else in
    the suite needs changing to serve a second domain** — the 210 absolute `/engcalcs/…` paths all
    resolve under `<newdomain>/engcalcs/`, which is why the symlink beats the refactor.
  - **DONE 2026-08-23, the landing draft** (`dev/librewaternet-landing/index.html`): titled
    `LibreWaterNet.org`, leading with a Start-a-model button to `Looped-Network.php`, phone gate
    lifted on Tom's own pass.
  - **[H] WHAT IS LEFT IS TOM'S, and it is all server work, none of it a `git pull`:** the 301 for
    the broken `constructionnotesmanager.com/hawsedc/engcalcs` route (one `RedirectMatch` in
    `~/public_html/.htaccess`, outside this repo); `ln -s ~/public_html/hawsedc/engcalcs
    ~/librewaternet.org/engcalcs` after testing `Options +FollowSymLinks` on this host; and the
    landing page's own repository at `~/librewaternet.org/index.html`. Move the local working
    directory in that same pass and not before (`dev/hosting-layout.md` §5).

- 75|501| **[H] Tom's own browser pass on the Task 478 field grid.**
  Merged 2026-08-24 on his instruction (*"Please merge"*), which is also his ruling on the narrow-
  window wrap. What no harness here can answer, because each is a picture rather than a number:
  the X button hides all four cells of a line; the conditional lines on Orifice, Orifice-Drain-Time
  and Branched-Network appear and disappear whole; "Printable version" then toggling the orifice
  shape keeps the X's gone; the collapse animation still animates.


- 75|483| **EPANET import: carry unhandled features into a per-asset import notes field.**
  Tom, 2026-08-22. Today an import reports its differences and then the information is discarded; a
  notes field the user can read would keep it, e.g. *"EPANET Label was marked a Meter associated
  with Link 999 and anchored to Link 999."* He leans toward IMPLEMENTING the anchor (a Text object
  associated with a node or link) and merely NOTING the Meter — EPANET's Meter shows whichever
  single notation property is selected on Nodes or Links at that moment, which is less flexible than
  what our labels already do, so reproducing it is not obviously worth it. Tom: *"I'm not opposed to
  implementing this, and it may be better to implement it than to discuss it."*

- 75|495| **[H] REMIND TOM: does an input accept more characters than its width shows?**
  Extracted from Task 491 on close. He believes it does — *"inputs are flexible. You can enter more
  than their width"* (2026-08-23) — and asked to be reminded to confirm it in a browser before a
  pane-table column width is treated as a constraint on how many decimals a value can carry. The
  **Nothing rides on the answer any more.** Round 3 of the width review (2026-08-23, *"I confess I
  am being too stingy"*) widened the last two narrow boxes past their longest values, so the
  question is now about the suite's inputs generally, not about these four columns.

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

- 50|248.02| **Patterns: attach one to a RESERVOIR HEAD and a PUMP.** Task 248 child. Everything
  else shipped: the Libraries box creates, renames, edits and deletes patterns with a sparkline, the
  property popup attaches one to a junction demand, `[PATTERNS]`/`[TIMES]`/`[OPTIONS] Pattern` round-trip
  byte-identically, and Net3 matches EPA's published 24-hour report to 0.005 ft over 2,425 comparisons.
  - **Water quality is NOT in scope and cannot be scoped by Tom** (2026-08-17: *"I don't know anything
    about water quality modeling"*). Build the mechanism so a WQ source could read a pattern later; do
    not build WQ on the strength of it.

- 50|269| **ASU Engineers Without Borders answered, and asked to meet.** Tom, 2026-08-10 — a human
  reply to outreach, and he has replied gratefully. This is the first real conversation this suite's
  mission has earned; prepare for the meeting and record what comes of it. Not a search-reach task,
  but it lives here because it is the same goal reached by a better road.

- 50|408| **Label leader dragging: an optional snap to 15°/30°/45° angle increments, user's choice.**
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

- 50|425| **The unit-change dialog for an lpn project that already has content.**
  It asks what the change should mean to the numbers already typed. Use Tom's own wording
  (2026-08-18) rather than paraphrasing it, and add the CANCEL the first cut lacked.
  - Title: *This unit decides what your inputs mean*. Then *cfs is the unit of what you enter for* and
    the field names **one per line**, not a comma list.
  - Then *Options for units change*: **Non-destructive** — leaves every input as it is and reinterprets
    it in the new unit. **Destructive** — rewrites every input with a mathematical conversion so the
    network stays physically close to the same within conversion tolerances; loses the original inputs.
  - Buttons: **Non-destructive · Destructive · Cancel**.
  - **Open:** back the original inputs up before a Destructive change, or offer to. An undo snapshot is
    already taken; whether that is enough is the question.
  - **AWAITING TOM'S WRITTEN OK — a `$ec_lang_syn` entry**, proposed while Task 426 borrowed the word
    *Non-destructive* for the shared units row. A translator cannot recover the term of art from the
    words, so: `$ec_lang_syn['calc_set_units_tip']='Changes the unit shown on every field at once
    (switches the whole page to that unit system); safe, harmless, does not overwrite anything,
    leaves your entries untouched, keeps the numbers you typed.'`

- 50|433| **Profile: the last piece is the path CHOOSER.** Tom, 2026-08-18: *"Amazing. Now we just need a
  good UI."* Two of the three are done — the route is drawn on the map, and the panel is now the
  full-height Profile tab of Task 434's bottom pane.
  - **The path chooser should be the Google Maps gesture epanetjs uses:** click the starting node, hover
    along the path, click to add a waypoint, double-click to end. Not two pull-downs.
  - **The animation half is already done and proved headless.** The chart follows the transport with
    no listener of its own (`showFrame` → `applySolveResult` → `refreshPaneIfOpen`);
    `dev/lpn-spike/profile-eps-harness.js` walks Net3's 24-hour run and measures the grade line
    moving 90.8 ft at node 61 while the ground holds still. A browser pass here is about the
    chooser, not about whether it animates.

- 50|441| **Settings box: docking left or right, and an AutoCAD-style anchor-and-flyout with
  autohide.** Tom raised it 2026-08-18 without asking for it yet. Nothing in the box is designed
  against it — one element, one placement function.

- 75|442| **[H] The toolbar may want to become a side menu.**
  Raised 2026-08-18: phones have a swipe superpower that is not idiomatic on a PC, so a different
  phone layout convention that could translate to the PC — transforming the toolbar into some sort of
  side menu — would use side real estate when height real estate is very limited. Raised, not scoped.
  - **Raised again 2026-08-20 with the trigger named:** *"Did I already suggest putting the menu and
    the toolbar vertically down the left edge when the screen is wider than tall?"* The new part is
    the CONDITION — wider than tall — which makes it a responsive rule rather than a redesign, and
    which is measurable rather than a matter of taste.
  - This page is a full-window drawing surface designed for a pointer, so the PHONE half is worth
    little on its own; the SIDE-MENU half is worth something regardless, on a laptop with 800px of
    height.

- 50|465| **[H] Reusable pipe and pump TYPES, so editing one edits 400.**
  One "150 mm PVC" definition that 400 pipes point at. A type carries diameter, roughness and minor-loss k; an element names
  a type instead of repeating the numbers. Tom named these beside Patterns/Curves/Controls in Task 462,
  but those are things the document already HOLDS — this is a new indirection through the element model.
  - **It starts at `effective()`, which is the expensive part.** A third resolution layer — override →
    element → type-default — under the one seam the solver, renderer, labels, popups and six pane
    tables all read through. Plus a visible detached-versus-inherited state per property, or a user
    edits a definition and cannot see why nothing moved.
  - **EPANET has no such concept**, so an `.inp` export flattens it and an import can never rebuild it,
    which breaks Task 281's byte-identical round trip for anything typed. Task 390-sized.

- 50|497| **Automatic elevations for a lat/lon project, from a terrain source.**
  Tom asked 2026-08-23 whether this is on the roadmap and where the data would come from. It was
  not; this is the entry. A geographic project knows every node's latitude and longitude, and
  elevation is the one input a designer otherwise types by hand for every junction.
  - **Mapbox Terrain-RGB is the strongest fit and the reason is that it is already paid for.**
    `EC_MAPBOX_TOKEN` already gates satellite tiles, terrain is delivered as ordinary raster tiles,
    and the elevation decodes client-side from the pixel — no server of ours, no new account, and
    the same tile plumbing `project.basemap` already has. Alternatives if that gate is ever absent:
    USGS 3DEP (US only, ~10 m, no key), Copernicus GLO-30 or SRTM through OpenTopoData
    (self-hostable), Open-Elevation (free, rate-limited). Google's Elevation API is paid and keyed.
  - **IT NEEDS ITS OWN CONSENT GATE, not the tile one.** A tile says where you are LOOKING; an
    elevation query says where your NODES ARE, which is the model itself. That is the `ec_geosearch`
    argument exactly, and the search got its own gate for it.
  - **It WRITES numbers into the document, which is the hard constraint.** Only the user touches a
    file's numbers. So it has to be an explicit action that FILLS a field the way typing does —
    never a background sweep, never overwriting an elevation somebody typed, and undoable in one
    step. Accuracy must be stated: 30 m ground resolution is a contour interval, not a survey.

- 25|500| **One home for the reference-table URLs, now copied into four pages.**
  The Hazen-Williams C, Manning n and Darcy-Weisbach roughness-height tables are linked from
  `Manning-Pipe-Flow.php`, `Hazen-Williams.php`, `Darcy-Weisbach.php`, `Irrigation-Pressure.php`,
  `Branched-Network.php` and `Looped-Network.php`, and the URL text is written out separately in
  each. The EPA one is a 500-character `nepis.epa.gov` query string, so a silent divergence is very
  easy and very hard to see. The minor-loss-coefficient link is duplicated the same way.
  - Not urgent and not free: the natural home is `lib/`, and the file that would host it is being
    rewritten on the `task-478-fieldgrid` branch. **Sequence this after 478 lands or is dropped.**

- 25|498| **A public roadmap, with epanet-js's Canny board as the worked example.**
  Tom, 2026-08-23: epanet-js runs one at `roadmap.epanetjs.com`, powered by Canny. Noted as an
  example to weigh, not a decision. The thing to weigh is that `dev/ROADMAP.md` is written for us and
  says things a public board should not (measured costs, what Tom is not proud of, who to ask), so a
  public board is a SECOND artifact to keep current, not this one exposed.

- 50|499.01| ** Create a Scenarios menu icon **
  - Use the paradigm of this icon, probably without the page element. Described textually, this depicts scenarios as three branched children of a main project. It might be nice to make the shape of the main (project) and children (scenarios) reminiscent of our Project icon, possibly stripped of its details and scaled down. If not, then just squares with an aspect ratio representative of a 2H x 3H plan sheet https://www.flaticon.com/free-icon/scenario_17921358?term=scenario&page=1&position=8&origin=tag&related_id=17921358
- 50|499.02| ** Add a tip to the lpn Project menu **
  -  'Everything unique about this application is here in one place except the animation play controls. There is no need to guess where things are.'
  - It would be good to have this reviewed by Mary before or after deployment. Either way is fine. - Tom 2026-08-23
- 100|469| **Node labels should SHED properties before one of them is hidden.** Tom, 2026-08-21:
  *"Properties are never dropped from node labels, so Node label drop order is a lie... As I look at
  Net3, it seems to me that in many cases we could see many more node labels if some of the
  requested node properties were dropped. We probably should try to implement it and then judge
  whether the cost is too high."*
  - **STILL NOT BUILT, and Tom is right that there is no evidence of it** (*"I can't see any evidence
    of node labels dropping properties"*, 2026-08-23). Checked rather than assumed:
    `labelSettings.priority.node` has exactly ONE consumer in `js/looped-network.js`, `nodeDropKey()`,
    which builds a sort key deciding which whole label is hidden; `shedKeepSet()`/`keptLines()` are
    called from three places and every one of them is a link. So it is not implemented-and-unreached
    — there is nothing to reach. The column reads as a property drop order in both lists and is one
    only in the link list. This is a FEATURE and wants scoping before it is written.
  - **ANY overlap, not a vertical one** (Tom left the question open in the tip). `js/lpn-collide.js`
    relaxes boxes and has no notion of an axis, so classifying an overlap as vertical means
    inventing that notion and answering it for a diagonal overlap. A shed row also shortens the
    widest line as often as not, so the axis would not predict what the shed buys anyway.
  - Shed LAST, after placement has failed: place, find the labels still overlapping, drop the
    lowest-ranked property from each, re-measure, re-place, repeat; hide only when one property is
    left and the pair still overlaps. That loop is the cost to measure — link shedding is one
    monotone width per step, node shedding changes a box and so changes the relaxation.
  - **The tip is written and waiting.** `lpn_labels_priority_node_tip` says what is true today; the
    agreed target wording is: *"The order in which properties are given up when two node labels
    would overlap. The property numbered 1 is given up first, on both labels. When one property is
    left and the two still overlap, a whole label is hidden: the one whose remaining value is worth
    showing least — the lowest demand, the pressure nearest the middle of the range, or the
    elevation or head closest to the neighbouring nodes."* Swap it in when this lands.

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

- 25|185| **Match/Copy properties tool (originated during Task 146).** Tom, 2026-07-30: "In the absence of the
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

- 25|218| **Find advisors and proteges: a standing, nagged commitment.**
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

- 25|221| **Retire the "constants now match EPANET" note (Task 213) — CHECK: 2027-08-01.** Delete
  `<prefix>_notes_epanet_term`/`_def` from `Hazen-Williams.php`, `Branched-Network.php`,
  `Looped-Network.php` and all 5 lang files (en, es, pt, fr, tr). A dated "we changed this" note is
  useful for about a year; after that it is archaeology in a user-facing Notes list.

- 25|225.13| **`dev/lpn-file-lock-test-punchlist.md` §13 needs the rewrite §0–§8 got** (Tom: *"Some
  stuff no longer exists or is renamed"*), before anybody is asked to run that section again.
  Split out of Task 225 when the rest of it closed 2026-08-09 — this piece is a punch-list document
  rewrite against live controls, not a code fix, so it needs a browser pass rather than static
  reading.

- 25|234| **Canal Seepage must prove its worth or go.** Tom, 2026-08-08: *"in my crosshairs"*. After
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

- 25|247| **Demand allocation by customer (epanet-js has it, EPANET does not).** Tom, 2026-08-09.
  Assign named demands to a junction and sum them, rather than typing one lumped figure. Genuinely
  fits the irrigation/rural-water audience. Below Task 184 (scenarios), which epanet-js charges for
  and Tom therefore wants raised.

- 25|248| **Extended-period simulation, the GATE on the LibreEPANET.org launch.**
  Last of the three things the EPANET engine unlocked; Tasks 306/307. Tanks and valves shipped
  2026-08-14, PBV and GPV 2026-08-17.
  - **THE RUN SHIPPED 2026-08-18** (`js/lpn-time.js`, `EngCalcs.lpnEpanetRun`): the seven time
    settings are editable, EPANET's own `runH()/nextH()` loop gives a frame per reporting step, a
    transport in the bottom pane scrubs through them, and tanks fill and drain. Against all 25 steps
    of `dev/lpn-spike/reference/Net3.rpt`: head worst 0.005 ft over 2,425 comparisons, flow 0.485 gpm
    over 2,975, tank level 0.005 ft over 75 (`dev/lpn-spike/eps-net3-harness.js`). **The native
    solver has no time dimension and is not getting one** — engine unreachable, one instant, said so.
  - **THE RUN IS STILL LIVE, and the page decides that by TIMING ITSELF** (2026-08-19,
    `EC.LPN_TIME_AUTO`). Cost is per FRAME: Net3 is 40–250 ms at its own 1 h report step, 736 ms at
    15 min, 2972 ms at 1 min, 1255 ms over 30 days; 10× Net3 is only 381 ms
    (`dev/lpn-spike/eps-cost-bench.js`). So an edit re-runs the period after a quiet moment while the
    last measured run stayed under 400 ms, and above that waits for the **Run** button, which is on
    the toolbar either way. The biggest saving is separate and risk-free: a solve is skipped entirely
    when the assembled model is byte-identical to the one the frames came from, so a drag, a
    recolour or a rename now costs **zero** engine calls where three drags cost three runs.
  - **Two performance ideas were measured and dropped.** Warm-starting a run from the previous run's
    flows can only help the FIRST frame — EPANET already carries flows from step to step inside
    `runH()/nextH()`, so the ceiling is 1/N of the cost and N is largest exactly where it hurts.
    "Re-solve only the changed path" is wrong in a looped network at any size: the global gradient
    method moves every flow when one diameter changes.
  - **The EDITORS shipped too** (Libraries box, 2026-08-20): patterns are created, renamed, edited
    and deleted with a sparkline, simple controls are added and validated sentence by sentence, and
    curves are a viewer by design (248.04). **All that is left of this task is attaching a pattern to
    a reservoir head or a pump (248.02) and rule-based `[RULES]` (248.03)** — so the LibreEPANET gate
    is nearly clear, and 248 is no longer the blocker it was written as.
  - **A valve has THREE states in EPANET, not two:** closed, fully open, and ACTIVE. `EN_INITSTATUS =
    OPEN` opens it fully with its setting IGNORED; `EN_INITSETTING` restores active, so status is
    written BEFORE setting. Written the other way a network solves with the valve wide open — exactly
    one k V²/2g of missing head, flows still agreeing to 2e-10 m³/s. A PUMP has no status column
    either, so a closed one needs a `[STATUS]` row or it is written open.
  - **The gate is about sequencing only, not our right to the name.** No node-count limit; never
    describe the gate as one (`dev/positioning.md` §6). Tom, 2026-08-14: *"we have no less technical
    authority to call ourselves EPANET, more moral authority, and all the legal authority since it's
    all public domain."*

- 25|248.03| **Rule-based controls, EPANET's `[RULES]` (Task 248 child).** Simple `[CONTROLS]` shipped
  2026-08-18 — the Libraries box adds, edits, validates and deletes them, an unreadable sentence is kept
  and marked rather than discarded, and only a fully understood one reaches the engine.
  - Deliberately parked: rule-based is a language, and it can wait for evidence that a user has one.

- 25|248.04| **Curves (Task 248 child) — probably NEVER a separate interface.** Tom, 2026-08-17:
  *"We may be able to avoid curves as a separate interface indefinitely by reporting them and
  referring to them by the name of their owner node."* A pump curve is already edited on the pump
  (`curvePoints`, `curveRef`), and a tank volume curve belongs to its tank.
  - So this task is a REPORT and a NAME, not an editor: a curve is named for the element that owns
    it, and a `[CURVES]` section is read and written under that name. Reopen the editor question
    only if a real file arrives whose curve is shared in a way an owner name cannot express.

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

- 25|284| **Settings box follow-ups, after the two-pane box shipped (Task 441).** The paradigm is in
  place; what is left is the part that needs a second design.
  - **The sticky heading is the SECTION only.** Tom asked for the current heading *and sub-heading*
    to stick. Sub-headings scroll away today, which needs a second sticky level and a rule for what
    happens when a short sub-section is on screen with its neighbour.
  - **Narrow screen is a second design, so scope it as two.** The index probably collapses to a
    drop-down under a breakpoint. Argue it on its own merits, never from phone use — Task 285.
  - **`settings.sectionsOpen` is now stale, deliberately.** Nothing reads it; `defaultSettings()`
    still writes it so old and new project files keep one shape. Drop it only alongside a storage
    version bump, the way `fileAutosaveSeconds` was left.

- 25|285| **We do not know what devices anybody uses this on.**
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

- 25|322| **Standing advisories worth converting rather than re-reading.** `check_all.sh` reports
  these every run and nobody can act on them.
  - **`js/looped-network.js` is 20,374 lines**, with `rebuildSettingsFields()` and
    `drawExampleNetwork()` the two obvious extractions. Task 293 established the split-by-PURITY
    pattern and it worked. *(The 9,740 recorded here through 2026-08-23 was less than half the truth —
    an advisory nobody acts on is also an advisory nobody re-reads.)*
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

- 25|417| **Long-press on an element should enter Edit mode.** Exactly as a click does. Tom,
  2026-08-17. The guard that switches to Edit mode on click does not fire when a long press begins a
  drag, so a touch user who presses and drags is editing an element the page does not think is
  selected for editing. Same guard, second trigger. See Task 192 for why long-press is the touch
  equivalent generally.

- 25|435| **[H] The Labels panel's column headings sit too far right.** Tom, 2026-08-18.
  - **The width half is now PROVED, not merely believed.** `dev/lpn-spike/label-columns-harness.js`
    builds the real Node and Link lists through `rebuildLabelsFields()` and computes every column's
    edge offsets from the row's right edge under the stylesheet's `!important` widths: heading row and
    every field row agree to the pixel, node ID row with its two spacers included. Mutation-tested.
  - **What was still wrong, and is changed:** `columnHeadings()` centred all four headings, but the
    Before/After columns hold left-aligned text boxes, so a centred "Before" reads as sitting right of
    its column. Affix headings are now `start` (not `left` — RTL), numeric headings stay `center`,
    which is the alignment rule `css/engcalcs.css` already states.
  - **NEEDS TOM'S EYES, and that is the only thing left.** Whether the panel now LOOKS right is a
    browser pass; and if "too far right" meant something other than the centring, this is the change
    to re-examine.

- 25|468| **Demand categories on a junction — the breakdown the importer already flattens.**
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

- 5|146.09| **Map insets for congested areas of a drawing (Task 146 child).** Very low priority.

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

- 5|178| **Build a real filmstrip-GIF Help asset from `dev/filmstrip-gif-recipe.md`** (e.g. the
  add-pipe / add-junction workflow). A 2026-07-30 proof of concept showed this is cheap once set up;
  the recipe records the ~30 minutes of trial and error, of which the hard part is precise SVG click
  targeting, not GIF assembly. The POC GIFs were never committed.

- 5|181| **Per-element symbol sizing (originated during Task 146).** Task 180 shipped one overall
  `settings.symbolScale` multiplier ("Symbol size (relative to text)") covering node radius, pipe
  width, pump/vertex/arrow marks and stroke widths together. Tom, 2026-07-30, named the
  fine-grained version as the eventual shape — a base pipe width, node size, pump size, reservoir
  size, each independently settable — and explicitly deferred it: "that's a lot… maybe later we
  give more fine-grained control and right now just a two-dimensional control." Build it when
  someone actually needs one symbol bigger without the others, not on symmetry grounds.

- 5|186| **Table-paradigm editor with spreadsheet copy/paste (originated during Task 146).** Tom, 2026-07-30:
  "For the future a table-paradigm editor with spreadsheet-like copy and paste would be very cool."
  A grid of nodes and a grid of links, editable in place, with clipboard paste from a spreadsheet —
  what EPANET's own Data Browser tables and every serious package's tabular view provide, and the
  fastest way to build or bulk-correct a model that already exists in a spreadsheet. Distinct from
  Task 146.04 (node/link report tables), which is read-only reporting: this one is an editor and
  needs paste parsing, per-column unit handling, undo integration, and validation of every pasted
  cell. Large; parked deliberately behind Task 185, which gets most of the practical benefit for a
  fraction of the work.

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

- 5|194| **Touch gestures: one finger scrolls the page, two pan the map.**
  Originated during Task 146. Raised by Tom, 2026-07-31, after the canvas-fills-the-phone lock-up: *"It didn't occur
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

- 5|282| **Offer to attach the backdrop an imported `.inp` names.** An `.inp` (and a `.net`) stores
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

- 5|294|[H] **Decide the 7 remaining dead language keys, one each.** `menu_main_list`,
  `menu_main_language`, `mi_d50in`, `mpf_spreadheet_notice` (key name is misspelled too),
  `wi_save_and_calculate`, `or_shape`, `contact_title` — rendered by nothing, 27 translated strings
  apiece. Each is either lost content to restore (as Task 290's six Rock Chute notes turned out to
  be) or debt to delete; only Tom can say which. Recorded so far only inside closed Task 290, where
  nothing re-scans it.

- 5|303| **Usage logging: the remaining lower-value questions.** Extracted from Task 200 when it
  closed 2026-08-14, so they survive the close rather than being buried in a DONE block nobody
  re-reads. All three are cheap and none of them decides anything on its own; take one when a
  specific question makes it worth the wiring.
  - **Time-to-first-calc** — separates a page that is confusing from one that is merely long.
  - **Print / copy-link use**, as a proxy for work somebody intends to keep. Note this overlaps
    Task 215's named-calculation signal, which already measures intent-to-share more directly, so
    check whether the title log has already answered the question before building it.
  - **Intra-site path** — which calculator is the entry point and where people go next. The most
    expensive of the three, because a path needs an ordering the logs deliberately cannot express
    without a per-visit identifier we will not store.

- 5|306| **LibreEPANET.org: the rebranded site variant. BLOCKED on Task 248.** Tom bought the domain
  2026-08-14; it 302-redirects to `Looped-Network.php?lang=en` until the gate clears. Priority 1, not
  0: 0 means completed and this is blocked.
  - Tom's spec: EPANET engine on by default, a custom navbar without HawsEDC and the Hydraulics menu,
    no page title or description, Notes moved under More, and navbar + lpn menus + map filling the tab.
  - **It is a VARIANT, not a fork — do not start by copying the page.** The name ruling and the gate
    are in `dev/positioning.md` §6; the build costing, including the hosting answer that avoids the
    112-path refactor and the `CANONICAL_ORIGIN` whitelist trap, is §6.1.

- 5|307|[H] **LibreEPANET.org front-door copy. BLOCKED on Task 248.** Holds the approved register so
  the wording is not re-derived later. Tom, 2026-08-14: **"Join us in building LibreEPANET, for the
  community and by the community, today."** Or some such — the *shape* is the ruling, not the exact
  words: an invitation to build, not a pitch to switch, and no comparison to anyone.
  - **Do not import the reasoning from `dev/positioning.md` into the copy.** That file exists so the
    page does not have to make the argument.
  - The one comparative fact licensed for public use is our own licence (GPL v3+, no tier that can
    be revoked) — stated as a fact about us, never as a claim about them. `dev/positioning.md` §2.
  - **[H] Tom approves the final wording.**
  - **Courtesy note to OpenWaterAnalytics before launch**, in the register of
    `dev/outreach-owa-post.md` — a real question, not an announcement. The name is legally safe
    (EPANET is public domain) but names run on community norms, and the note is cheap insurance.

- 5|347| **No project tabs at all until a project is opened.** Tom's strongest form of the examples
  gallery (*"It's not a map until the first project is started or opened?"*), extracted from Task 314
  when it closed. Left out there on grounds worth restating: `init()` guarantees an invariant in as
  many words — *"the library always has exactly one open project, so there is never a state where
  drawing has nowhere to be saved"* — and a tabless boot breaks it everywhere at once (autosave,
  `saveToStorage()`, the scenario container, `renderTabs()`). It is a storage-model change wearing a
  UI change's clothes: it deserves its own `/code-review`. He phrased it as *"possibly"*.

- 5|355| **Long labels and short pipes — WAIT AND TEST.** Tom, 2026-08-15, after the repeat and
  alignment work landed: *"I think we are good, to tell the truth. Nothing to do, I think."* So
  nothing is scheduled. `linkLabelTooShort()` still hides a short pipe's label all-or-nothing; if
  that ever reads wrong in practice Task 399 now covers it — the label sheds values instead of
  vanishing whole, and `linkLabelTooShort()` becomes the last rung rather than the only one.
  - **Shedding itself confirmed compact/stingy and liked, 2026-08-17** — Tom's word, reviewing
    production at commit `22db1f9` after Task 404 closed. See Task 404's close note.

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
