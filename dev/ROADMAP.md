# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" and 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N".

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

# Tasks

## Calculator Improvements

- 15|119| **Offline usage logging (queue-and-flush).** Right now `EngCalcs.maybeLogHumanView()` and
  `maybeLogCalcUsage()` (`js/Calculators.lib.js`) fire `navigator.sendBeacon` calls that fail
  silently when offline — `sw.js`'s network-first strategy still lets the PWA serve cached
  calculators fully offline, but that usage leaves zero trace in any of the three logs
  (`engcalcs-lang.log`, `engcalcs-human-view.log`, `engcalcs-calc-usage.log`). Today we can't tell
  "no one used it" from "someone used it offline." Fix: queue failed/undeliverable beacon payloads
  client-side (IndexedDB, or a Background Sync registration if browser support is sufficient) and
  flush them to the existing `log-human-view.php`/`log-calc-event.php` endpoints next time the app
  is back online. Surfaced 2026-07-15 while confirming installed-PWA logging behavior; not scoped
  beyond this description yet — needs a design pass on queue storage, flush retry/backoff, and
  whether flushed entries should carry their original (offline) timestamp or the flush time.

## New Calculators (Mission Expansion)

Tom, 2026-07-14: interested in expanding beyond hydraulic-structure/irrigation calculators toward
the kind of design work that normally only lives in mission/NGO field manuals (Peace Corps water &
sanitation guides, CAWST, RWSN, Engineers Without Borders) — "systematize what's normally esoteric,"
staying true to the suite's mission (serving engineers and field workers in water-scarce,
low-resource regions). None of the tasks below are scoped for build yet — each needs a full spec
pass (inputs/outputs, formulas, unit sets, worked-example verification, new-calculator checklist per
`CLAUDE.md`) before implementation starts, same as any new calculator.

### Prioritization framework (Tom, 2026-07-14)

Candidates are scored on four axes, not just "sounds like a good mission fit":
1. **Availability/commoditization** — is this calculation already well-served worldwide by existing
   free tools/apps, or trivial in a spreadsheet? **Low availability (a genuine gap) raises priority;
   a saturated market lowers it**, even for calculators with strong humanitarian relevance — the
   relevance doesn't help if ten other free tools already solve it.
2. **Technology emergence** — is the underlying tech/practice currently maturing or dropping in cost
   (e.g. solar panel costs, PWA/offline capability)?
3. **Demand for development** — real field/humanitarian need, e.g. how heavily a method is taught in
   NGO/Peace Corps/WHO/CAWST/RWSN field manuals.
4. **Search keyword research** — actual external search/demand signal, not a guess.

A 2026-07-14 research pass (real web search, not assumption) across 13 candidates on all four axes
overturned some initial intuitions — most notably, rainwater harvesting (the lead candidate from the
first brainstorm) turned out to be a saturated market, while several backlog items (VIP latrine
sizing, handpump/rope pump selection, check dams) turned out to be genuine gaps with strong
humanitarian demand and no existing calculator found. **Honest caveat on all "no calculator found"
verdicts below**: this is a real signal from web search, not a verified global negative — regional,
institutional, paywalled, or non-English tools may exist that search didn't surface. Priorities
below reflect this research; re-run the same 4-axis check before adding new candidates rather than
prioritizing on mission-fit intuition alone.

- 80|110| **Water treatment — biosand/slow sand filter design.** Sizes a household or community
  biosand filter per the CAWST Biosand Filter Construction Manual (the standard reference NGOs
  actually build from) — filtration rate (~0.4 m/hr, ~600 L/day for a household unit), sand bed
  depth (~55 cm minimum + separating/gravel drainage layers), sand specification checks (effective
  size 0.15–0.20 mm, uniformity coefficient <2.5), and pause-period guidance (1–48 hr) for the
  biolayer (schmutzdecke) to develop. Inputs: household size or community population, daily demand,
  available container/tank diameter. Outputs: required filter surface area, bed-depth confirmation,
  flow rate, daily-capacity check, pause-period recommendation. **Research-confirmed genuine gap**:
  CAWST publishes manuals + one narrow sand-grain-size spreadsheet, but no general interactive
  sizing/design calculator found; strong sector-wide demand (CAWST is a major global WASH training
  org, biosand filters are a WHO/CAWST household-treatment staple). New domain for the suite (water
  treatment, not just conveyance/storage) — zero overlap with existing calculators. Candidate prefix
  `bsf_` — not yet claimed.
- 80|111| **Spring box / gravity-fed water supply design.** Spring capture structure sizing (spring
  box) plus gravity-fed transmission-line feasibility, per Peace Corps Water Supply & Sanitation
  Technical Training Manual / RWSN spring-protection guidelines: spring yield (bucket-and-stopwatch
  method), spring box minimum freeboard/sizing, and — this is the efficient part — the transmission
  line itself is mostly a front-end wrapper around the **existing** `dw_`/`hw_`/`mphl_` pipe-flow and
  head-loss engines, plus break-pressure-tank spacing logic for where static head would otherwise
  exceed pipe pressure rating. **Research-confirmed genuine gap**: general gravity-flow calculators
  and heavy engineering software (HYDROFLO) exist, but no integrated spring-capture-to-tap tool
  (yield + transmission sizing + break-pressure tanks together) was found — reference material is
  PDF manuals (SKAT/RWSN, IRC) only. Core RWSN/SKAT rural-water doctrine, foundational for
  mountainous/hilly low-resource regions. Lowest net-new engineering-code cost of the top candidates
  since it reuses proven calculators rather than opening new formula territory. Candidate prefix
  `sb_` or `gfs_` — not yet claimed, needs a final pick (avoid collision risk with any future
  "storage bin"/similar prefix).
- 7|112| **VIP/pit latrine sizing.** Volume/depth sizing vs. household size and design life
  (sludge accumulation rate ≈0.04–0.06 m³/person/year is the published WEDC/World Bank/UNICEF
  figure — needs primary-source citation before shipping as a default, not just this note), vent
  pipe diameter, and safe setback distance from water sources per Peace Corps/WEDC guidelines.
  **Research-confirmed genuine gap**: extensive PDF/manual guidance exists (WEDC, World Bank, UNICEF
  Ghana, SSWM) with clean, simple, well-published formulas, but no dedicated interactive calculator
  was found anywhere. Very strong demand — VIP latrines are a WHO/WEDC/World Bank sanitation staple
  across low-resource settings. Promoted from the candidates backlog after the 2026-07-14 research
  pass (was initially filed as a lower-confidence backlog item; the gap turned out to be real and the
  formulas simple, making it one of the cleanest build candidates of the whole set). Candidate prefix
  `vip_` or `lat_` — not yet claimed.
- 6|113| **Handpump / rope pump selection & sizing.** Selects/sizes a handpump or rope pump by
  depth, diameter, and required discharge. **Research-confirmed genuine gap — the strongest
  availability-axis gap found of any candidate**: motorized-pump sizing tools are abundant, but
  nothing addresses rope-pump/handpump selection; that domain is served only by static PDF manuals
  (PRACTICA Ethiopia manual, RWSN handpump standardization docs). High demand — RWSN/SKAT actively
  maintain global handpump standardization as core rural-water infrastructure. Promoted from the
  candidates backlog after the 2026-07-14 research pass. Scope carefully before speccing: this is
  likely a narrower/simpler selection-table calculator (pump type by depth/diameter/discharge) rather
  than complex hydraulics — verify actual formula complexity before committing to full-calculator
  scope. Candidate prefix `hp_` — not yet claimed (watch for collision with `mhp_`).
- 4|114| **Check dam / small earthen dam spillway sizing.** Small/informal check-dam sizing:
  catchment runoff estimate + spillway sizing + freeboard, aimed at low-resource construction rather
  than engineered large-dam design. Directly extends the *existing* `rc_` (Rock Chute, Robinson)
  calculator, which already does spillway rock-lining sizing — pairing a dam/reservoir sizing
  front-end with the existing rock-chute spillway engine is a natural low-marginal-cost companion,
  same reuse pattern as Task 108. **Research-confirmed gap, moderate-high priority**: existing tools
  are either too generic (weir/spillway-flow calculators) or too heavy (NRCS/USBR technical manuals)
  — a gap in the middle. Strong demand signal: heavily promoted in India/Africa watershed programs
  (Rajasthan/Gujarat/MP case studies, TAAT-Africa catalog) for groundwater recharge and farm water
  storage. Promoted from the candidates backlog after the 2026-07-14 research pass. Candidate prefix
  `cd_` — not yet claimed. Tom is (naively?) worried about the technical demand of global PMP/PMF estimation; are there good methods.
- 2|115| **Rainwater Harvesting (roof/catchment sizing).** Sizes a rooftop rainwater harvesting
  system: catchment area → runoff coefficient → harvestable volume → storage tank sizing, plus
  first-flush diverter volume. Core method: rational-method roof runoff (`Q = C × I × A`) combined
  with a monthly rainfall-vs-demand water balance to size storage. **Research-downgraded, 2026-07-14
  (was the original lead candidate)**: this turns out to be a saturated market — 10+ dedicated free
  calculators found (harvesth2o.com, watertankcalculator.com, BlueBarrel, rainwaterharvesting.co.uk)
  already covering tank sizing, yield, and first-flush length with well-established formulas. Demand
  for the *practice* is real and strong (Peace Corps Mexico, UN/Oxfam/ECHO all promote it), but that
  demand is for implementation support, not for another calculation tool — no "there's no good tool"
  gap found. Still directly extends the existing `cs_`/`ip_` water-supply-and-storage calculators if
  built (low marginal engineering cost), so left on the roadmap rather than cut, but no longer the
  lead candidate. Candidate prefix `rwh_` — not yet claimed.

**Candidates backlog — researched, deprioritized (well-served, no clear gap found):**
- **Chlorination dosing for small/community water systems** — well-served; multiple free calculators
  exist, including one CAWST itself publishes ("Chlorine Dose Calculator: Batch Chlorination," tied
  to the Modified Horrocks Test) — the sector's own reference org already ships this.
- **Pond/reservoir evaporation loss** — saturated; 6+ free calculators found, several using the
  FAO-56 Penman-Monteith standard. Demand is real but generic (farms/pools broadly), not specifically
  low-resource/humanitarian.

## Energy for Water

Tom, 2026-07-14: "I have lifelong focus on water and energy development for humanity... we can dip
our toe into energy (including heat), which is a strong interest of mine (instead of, say,
structural)." Tom is a civil engineer — this is not scope creep from the hydraulic-calculator
identity, it's a second, equally central professional focus, so it gets its own section rather than
being folded into "New Calculators" as stretch/candidate material. The suite already has one
foundational calculator here: `mhp_` (Micro-Hydro Power) — everything below either extends that
anchor or opens the *consumption* side (using energy to move/treat/purify water) rather than only
the *generation* side `mhp_` already covers. Same 4-axis prioritization framework as the New
Calculators section above; see that section's header for the methodology and honest-caveat note.

- 3|116| **Solar water pumping sizing.** Sizes a solar-PV-powered pump system for irrigation or
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
- 1|118| **Solar water pasteurization / SODIS exposure calculator.** Two closely related low-cost
  heat/UV water-treatment methods — SODIS (WHO/EAWAG-endorsed: clear PET bottles, 6 hr sunny/2 days
  cloudy exposure, <30 NTU turbidity ceiling) and solar pasteurization (heat to the WAPI 65°C
  threshold via solar cooker/collector, `Q = mcΔT` + collector efficiency). **Research finding,
  2026-07-14, downgraded from the original proposal**: a real availability gap exists (no public
  calculator tool found, only academic models and the standard rule-of-thumb from SKAT/EAWAG
  manuals) — but the value-add of building a calculator is thin, because field workers already solve
  this with the simple heuristic itself; a calculator risks over-engineering a problem that doesn't
  need one. Kept on the roadmap rather than cut, since the underlying mission fit (safe drinking
  water via heat) is exactly Tom's stated interest — but if built, it needs to add real value beyond
  the rule of thumb (e.g. genuinely combining site-specific insolation/cloud-cover/turbidity into a
  more precise output) to be worth the build. **Safety-critical numeric defaults**: turbidity
  threshold, exposure-time table, and collector-efficiency values must cite actual WHO/EAWAG/CAWST
  primary sources before shipping, not placeholders — a wrong default could tell someone unsafe water
  is safe. Candidate prefix `swt_`.

**Candidates backlog — researched, deprioritized (well-served or weak adoption):**
- **Biogas digester sizing** — well-served; 7+ free calculators found, several specifically for the
  small/household fixed-dome design common in low-resource deployments (KENPRO, ITCPH).
- **Solar still (basin-type) sizing** — a real gap exists (no calculator found), but weak real-world
  adoption signal: search surfaces mostly 1970s–80s IRC/Practical Action literature, suggesting this
  is a legacy/niche technology rather than an active field practice; production rates (liters/day per
  m²) are low compared to SODIS/biosand filtration.

**Candidates backlog — not yet researched:**
- **Passive/evaporative cooling calculator** — direct answer to Tom's original "shading/temperature
  management" framing; evaporative cooling is inherently a water-consuming thermal process, so it
  belongs in this section rather than as a stretch off the water-conveyance identity. Not yet run
  through the 4-axis research pass.

## Translation Standardization (Glossary Project)

## Translation improvements

The rules, sequence, and QA chain for translation work are **not** restated here. They live in:
- **`dev/translation-process.md`** — the SOP: the three scenarios, THE SEQUENCING RULE, the QA chain.
- **`CLAUDE.md` § "Translation Sprints"** — sprint mechanics, model policy, pre/post-sprint checklist.
- **`dev/translation-execution-log.md`** — the full dated, category-by-category execution record.

- 70|109| **Cross-language consistency audit (Opus, suite-wide).** Tom, 2026-07-14: wants a
  systematic pass, not just spot-checks reacting to a specific question — motivated directly by the
  Task 18 post-close finding that Burmese had a real embedded-English defect sitting undetected
  through a full translation sprint's own self-check and this session's own initial QA pass, only
  caught because Tom asked a pointed question about one string. The gap: existing QA
  (`lang_syntax_validate.php`, tag-parity, spot-check back-translation) catches structural defects
  and can catch *sampled* meaning defects, but nothing currently does a systematic
  terminology/tone-consistency read across all 26 languages × 12 calculators looking for the
  Burmese-style failure mode (an agent leaving source-language fragments embedded, or drifting from
  a language's own established terminology elsewhere in the same file). Scope not yet finalized —
  given the size (26 × 12 is a lot of surface area for one pass), this should probably run
  **staged by calculator category**, not as one monolithic review, and each stage still needs the
  standard authorization gate before spawning Opus agents (same "propose → confirm → launch" rule as
  a translation sprint — see `CLAUDE.md` § "Translation Sprints"). Model is Opus, not Sonnet (Fable
  is unavailable — see `feedback_fable_unavailable_use_opus`), consistent with prior holistic
  cross-language passes (Task 91's category re-translation quality bar, Task 93's glossary
  reconciliation). Next step before launch: propose a staged plan (which categories first, what
  the audit checklist actually checks for) and get Tom's authorization per stage.

## AI Efficiency Scripting (Overhead)

These tasks reduce the AI token cost of routine maintenance by replacing repeated AI judgment with deterministic scripts. Copilot owns execution (all tagged `[CP]`); Claude Code specs any script whose output feeds back into translation quality work.

## CSS Standardization Follow-up

## Low Priority / Nice-to-Have

## Completed

- 0|108| **`Install.php` localization — DONE 2026-07-14.** Was 100% hardcoded English body text,
  outside `$ec_lang` entirely — the only working PWA install path on iOS Safari/Firefox, where the
  in-app `⬇ Install` button silently does nothing (Task 95 resolution #1). Executed per the split's
  planned sequence, authorized standalone (not bundled with an upcoming category wave, per Tom's
  call when asked): (1) **Wave 0** — tightened the English body for concision/Simple-English
  compliance while restructuring. (2) Restructured into 15 new `$ec_lang['install_*']` keys (intro,
  Android/iOS/Desktop/Firefox section headings+steps, cached-pages summary), one key set rather than
  a single blob since the Android section interleaves a live install button and inline JS — matches
  `About.php`'s `about_body_html` convention where a single blob fits. Dropped the old hardcoded "16
  calculator pages" count in favor of "all calculator pages" so the text can't silently drift out of
  sync with the actual page count again. (3) Full 26-agent Sonnet translation sprint, scoped strictly
  to the 15 new keys (payload deltas also carried 5–15 unrelated pre-existing keys per language from
  other unfinished work, left untouched per standard scoping precedent).
  **Bug found and fixed while in this file, same session, per Tom's authorization:** `sw.js`'s PWA
  precache lists (`STATIC_ASSETS`/`CALC_PAGES`) were stale — missing `Canal-Seepage.php`,
  `Irrigation-Pressure.php`, `Rock-Chute.php` and their JS files, plus `Install.php` itself, so those
  3 calculators silently didn't work offline after install. Added all missing entries and bumped
  `CACHE_VERSION` to `v4` so installed users pick up the corrected list.
  QA: `php -l` clean on `Install.php`, all 27 lang files, and `sw.js`; `node -c sw.js` clean;
  `lang_syntax_validate.php` shows only advisory `identical-to-english` findings (all legitimate —
  `install_android_heading`/`install_ios_heading` are brand names like "Android (Chrome)" that
  correctly stay untranslated in most languages, same class as pre-existing eponym findings); tag-
  parity script-verified 4-for-4 `<li>`/`<strong>` counts across all 26 languages for the three
  step-list keys; no `&ndash;`/`&mdash;` entity-escaping bugs found; inline back-translation spot-
  check (no `ANTHROPIC_API_KEY` set) across 8 languages spanning Latin/Cyrillic/Arabic/CJK/Devanagari
  scripts (es, fr, de, ru, ar, zh, hi, sw) confirmed full meaning preserved, no dropped clauses, no
  leftover English, natural non-calqued phrasing. Payloads regenerated post-sprint (FRESH).
  **Post-close audit, same day, prompted by Tom questioning Wave 0/1 quality.** Tom specifically
  flagged `install_intro`'s "Once installed, ..." construction as a possible translation-risk word.
  Read all 26 languages' `install_intro` in full rather than assuming: 21 used a clean unambiguous
  "after installation" construction; the other 5 (es, fr, it, ro, plus the Hindi/Urdu/Bengali "one
  time X, after" pattern) rendered "once" via their own language's standard native idiom for it
  (French "une fois que," Spanish "una vez," Italian "una volta," Romanian "odată," Hindi "ek
  baar... ke baad" are textbook grammar for this meaning, not calques) — so the English wording
  itself was not the defect and was left unchanged. Extended the check past just `install_intro`:
  read every language's full `install_*` block and grepped fr/id/it/pt/ro for embedded-English
  false positives (all cleared — native words/established loanwords, e.g. French "menu" is
  original French vocabulary, not a leftover). Found one real defect: **my (Burmese) left the raw
  English word "install" (and browser/prompt/cache/menu/icon/window) embedded untranslated inside
  Burmese sentences across nearly every `install_*` key**, inconsistent with its own
  `install_main_menu` key which already had the correct native word (ထည့်သွင်း) sitting in the same
  file. Re-ran just that one language with an Opus agent (Sonnet had already had one clean shot and
  produced this defect; evidence didn't support redoing the other 25 languages or the English
  source). Independently verified the fix myself rather than trusting the agent's self-report:
  `php -l` clean, tag-parity re-confirmed 4-for-4 for all 3 step-list keys, and a direct read of the
  full file confirmed every ordinary tech-vocabulary word (install/browser/prompt/menu/icon/window)
  is now real Burmese, with only brand names (Chrome, Safari, Firefox, Edge, Android, iOS, EngCalcs,
  PWA) and the heading-position device label "Desktop" left in Latin script — matching the pattern
  already accepted in the other clean headings. Payloads regenerated post-fix (FRESH).

- 0|105| **Scoped and fixed the remaining `mpf_see_notes` stacking sites from Task 101, DONE
  2026-07-14.** Per-site fix shape (confirmed with Tom first, same as Task 104): (1)
  `Manning-Pipe-Flow.php` `q` label — folded `mpf_note_1`'s infinite-pipe/headwater caveat into a new
  `mpf_flow_tip` `?` tooltip (D8 pattern), full note with its tutorial-video link stays visible in the
  on-page Notes section since a `title` attribute can't carry a link. (2)/(3) `Manning-Trap.php`
  `n_in`/`d50_in` radio-button fields — both point at the same integrated iteration workflow
  (`mtc_note_1`), so both got one shared new `?` tip key (`mtc_iteration_tip`) rather than duplicating
  content. (4)/(5) `Micro-Hydro-Power.php` `vel_check`/`hl_check` — turned out to be a different case
  entirely: these are already governed by the D5 verdict-string convention (the check *value* itself
  carries the full explanation via `EngCalcs.writeCheckHTML`'s `ec-tip`), so the `(See notes)` on the
  row *label* was pure redundancy — just deleted, no replacement tip needed.
  While fixing site 4/5, Tom flagged a related live defect found by using the app: `hl_check`'s OK
  branch (`js/micro-hydro-power.js`) skipped `tipText` entirely, showing permanently-visible verbose
  text ("6.8% — within 10% target") with no hover explanation, breaking the D5 short-text+tooltip
  pattern that the warn/bad branches already followed. Fixed for all three states (ok/warn/bad now
  show just the percentage with the full explanation in the tooltip, merging the old
  `mhp_hl_ok`/`mhp_hl_warn`/`mhp_hl_bad` short strings into three tip-only keys), and extended the
  same treatment to `vel_check`'s OK case (added `mhp_vel_ok_tip`) for consistency, per Tom's
  direction. 6 new keys total (`mpf_flow_tip`, `mtc_iteration_tip`, `mhp_vel_ok_tip`, `mhp_hl_ok_tip`,
  `mhp_hl_warn_tip`, `mhp_hl_bad_tip`); `mhp_hl_ok`/`mhp_hl_warn`/`mhp_hl_bad` removed as obsolete.
  Translated into all 26 non-English languages via a 26-agent Sonnet sprint (uk landed before its
  reported session-limit failure, per the session-limit-retry lesson — verified complete rather than
  blindly re-run; zh/ur genuinely needed a retry). Mid-task correction: initially added
  `$ec_lang_intent` entries for the new keys without permission — caught and reverted everywhere
  (en.php and all 26 lang files) per the standing "AI must never touch `$ec_lang_intent` without
  explicit permission" rule; Tom confirmed intent entries aren't needed for these keys ("only needed
  for things like Riprap, Penstock, Head, and Chute... our glossary does much of the work").
  Post-sprint QA: `lang_parity_check.php` clean (0 missing/extra), `lang_syntax_validate.php` clean of
  escape-leakage/tag-imbalance/foreign-script findings, inline back-translation check across all 26
  languages found no semantic drift (proper nouns Blodgett–Bathurst/Isbash correctly preserved or
  transliterated to match each language's pre-existing `mtc_note_1` convention).

- 0|103| **"Penstock" kept as the primary term across all mhp fields, "(supply pipe)"
  disambiguated once rather than repeated, DONE 2026-07-13.** Unlike "riprap" (US slang prone to
  phonetic mistranslation), "penstock" is established international hydraulic-engineering
  vocabulary with real translations in most languages, so full replacement wasn't warranted — but
  per the Simple English policy (explanatory strings should still carry a plain-English anchor), a
  synonym was added once rather than leaving the bare jargon term unglossed everywhere. Scope
  narrowed after review: `e` (roughness) and `km` (minor-loss coefficient) tooltips are *shared*
  generic strings (`dw_roughness_tip`, `mphl_total_junction_k_tip`) reused verbatim across
  Darcy-Weisbach/Hazen-Williams/Manning-Pipe-Head-Loss — left untouched, since injecting "penstock"
  into those would corrupt their meaning in every other calculator that reuses them. Only `D` is
  mhp-owned and names the pipe: `mhp_diameter` = "Penstock diameter, D" with `ec-help`/`ec-tip`
  tooltip "Penstock (supply pipe) diameter" (full disambiguation, once, only place it appears).
  `mhp_length` was simplified to plain "Length, L" with no tooltip and no repeated "Penstock" —
  consistent with `e`/`km`, which are also plain generic attributes that never name the pipe
  themselves; `D` alone anchors what pipe the form is about. Also dropped stale "or flume" wording
  from both fields' visible text, tooltip, and `$ec_lang_intent` (intent edit made with Tom's
  explicit permission per the intent-editing rule) — the calculator only models a closed
  pressurized pipe (Darcy-Weisbach h_f,
  k_m minor losses), so "flume" never fit the physics. `mhp_notes_1_def`/`mhp_notes_3_def` prose
  got "(supply pipe)" added inline on first mention.

  **Full-suite propagation, same day.** Carried the D/L wording change to all 26 non-English
  languages: 21 mechanical (mhp_length simplified to a bare "Length, L"-style label, no tooltip,
  no pipe-name repetition, matching `e`/`km`'s style — done directly, no agent needed) + 5 agent-run
  (am, bn, ru, ur, fa) where the change required real translation judgment. The agent pass also
  uncovered and fixed a real defect while auditing existing translations: **am, bn, ru, and ur had
  phonetically transliterated "penstock"** (ፔንስቶክ / পেনস্টক / пенсток / پینسٹاک) instead of
  translating the underlying "pressure pipe" concept — the same defect class as the earlier
  "riprap" audit. Per Tom's fallback instruction ("if there is no good 'Penstock' translation, use
  'Supply pipe (or line)'"), each agent constructed a natural compositional "pressure pipe" phrase
  (am የግፊት ቧንቧ, bn চাপ পাইপ, ru напорный трубопровод, ur دباؤ پائپ) and added a "(supply pipe)"-style
  synonym gloss once, matching the English mhp_diameter tooltip pattern. fa was already correct
  (لوله فشار (پنستاک) — concept-first with jargon as a parenthetical aside) and only needed its
  `mhp_length` tidied. `dev/scripts/glossary.json`'s stale am/bn/ru "penstock" entries were also
  corrected to match (ur/fa glossary entries were already right — only the shipped lang files had
  drifted). QA: `php -l` clean on all 27 files; `lang_syntax_validate.php --lang=am,bn,ru,ur,fa`
  clean (only pre-existing, unrelated advisory `identical-to-english` findings on rc_/mtc_ keys);
  tag-parity check confirmed identical HTML/symbol structure across all 27 files for
  `mhp_length`/`mhp_notes_1_def`/`mhp_notes_3_def` (the `mhp_diameter` tag differences — tooltip
  present only in en/am/bn/ru/ur — are the intentional design, not a defect); inline
  back-translation semantic check (no `ANTHROPIC_API_KEY` set) confirmed all 5 agent-translated
  strings match source meaning.

- 0|101| **`k_m` label stacking fixed 2026-07-13; `e`/roughness field's identical problem DONE
  2026-07-13 via Task 104.** Surfaced investigating why bg's rendered `km` label looked long
  ("Коефициент на местни (локални) загуби, k<sub>m</sub> (Вижте бележките)"). The length itself
  turned out not to be a bg defect — measured against 12 other languages, bg's
  `mphl_total_junction_k` value (40 chars) sits mid-pack (fr 53, it 48, es 44, ro 41, bg/hr 40,
  sr/ru 39 — all longer or equal; en 33 shortest as expected) — normal Indo-European grammatical
  expansion, not a translation error; already checked once before in Task 96 item (2) sub-item 2
  ("no change" verdict) and re-confirmed here. The real problem Tom identified: regardless of
  per-language length, the *rendered field label* concatenated three things never meant to coexist
  for width: the full noun-phrase label, a bare `<a target="_blank">` link to
  engineeringtoolbox.com with no tooltip, and a trailing `(See notes)` appended outside the link.
  **DONE 2026-07-13 for `k_m`, all 5 call sites** (`Darcy-Weisbach.php`, `Hazen-Williams.php`,
  `Manning-Pipe-Head-Loss.php`, `Micro-Hydro-Power.php` ×2 fields), per Tom's direction: keep the
  hyperlink as-is (style-guide refresh instead of removal — see below), fold `(See notes)` into the
  tooltip rather than dropping it (it points to real, useful typical-value guidance), and shorten the
  visible label. New key `mphl_total_junction_k_short` = "Loss coeff., k<sub>m</sub>" (en) added to
  all 27 languages (26 translated directly by Claude Code, not a full agent sprint — one short
  formulaic phrase derived from each language's own already-translated `mphl_total_junction_k`
  wording, same effort class as Tasks 94/96/99). PHP shape at all 5 sites:
  `<a href="…">{short label}</a><span class="ec-help" title="{strip_tags(full definition)} {see
  notes text}"><span class="ec-tip">?</span></span>` — the tooltip text needed **zero new
  translation**, assembled in PHP by reusing the existing `mphl_total_junction_k` and
  `mpf_see_notes` keys as-is. `php -l` clean on all touched files; `lang_syntax_validate.php` shows
  only the same pre-existing 65 advisory findings, no new issues. Style guide refreshed in
  `dev/label-normalization-decision.md` D8: documents the actual live pattern (short "Word(s),
  symbol" label, not bare-symbol-only, which was tried and reversed for wide forms) and adds the
  rule that a "(See notes)" pointer belongs inside the tip, not as separate permanently-visible text.
  **Left open at the time:** the `e`/roughness field had the identical stacking problem — resolved
  by Task 104. A tail note in this same task also flagged 5 further `mpf_see_notes` stacking sites
  (Manning-Pipe-Flow, Manning-Trap ×2, Micro-Hydro-Power vel_check/hl_check) as unscoped
  reconnaissance, never part of this task's own defined scope (`k_m` bare-link stacking) — tracked
  separately as Task 105, not a blocker on closing this task.

- 0|102| **Generalized `k_m` typical-values guidance for dw/hw/mphl/mhp — DONE 2026-07-13.** Tom
  interviewed and decided: form is option (a), folded into the `k_m` tooltip (`title` text) added by
  Task 101 — not a Notes-section entry, not a new alert/panel. New shared key
  `mphl_total_junction_k_tip` (owner: `mphl_`, per existing incumbency of `mphl_total_junction_k`)
  holds the full definition + typical-values text and is used verbatim at all 4 call sites (dw, hw,
  mphl, mhp), replacing the old `strip_tags($ec_lang['mphl_total_junction_k'])` + (mhp only)
  `mpf_see_notes` composition. mhp's old Notes-section entry (`mhp_notes_4_term`/`_def`) is retired —
  deleted from all 27 language files (plus their empty `$ec_lang_intent` lines, with Tom's explicit
  sign-off since `$ec_lang_intent` edits are otherwise off-limits to AI) — so all 4 calculators now
  have identical `k_m` treatment, per Tom's stated direction to converge the suite on one pattern.
  **Content changed, not just relocated:** exit loss (sudden expansion to reservoir/atmosphere, k≈1.0)
  was missing from the original mhp note's typical-values list even though a "short penstock" framing
  implied one; added on Tom's call after he flagged the gap mid-session. New typical-values list:
  sharp intake entrance 0.5, each 45° bend 0.2–0.3, gate valve (fully open) 0.1, butterfly valve 0.2,
  exit (to reservoir or atmosphere) 1.0. **Default value changed from inconsistent per-calculator
  values (dw/hw/mphl were `10`, a generic placeholder never tied to any worked example; mhp was `1.5`,
  tied to the old "one entrance + two bends" note) to one shared, internally-consistent `2.0`** on all
  4 calculators — derived as the literal sum of the typical-values list for "one entrance + one exit +
  two 45° bends" (0.5 + 1.0 + 2×0.25 = 2.0), so a user reading the tooltip can verify the default by
  adding the listed numbers themselves. Full 26-language translation sprint run (Sonnet, one agent per
  language, scoped strictly to this one key — each payload also carried unrelated pre-existing `ip_`
  deltas from other unfinished work, deliberately left untouched). Post-sprint QA: `php -l` clean on
  all 27 lang files + 4 calculator PHP files; `lang_syntax_validate.php` shows only the same
  pre-existing 65 advisory findings (no new issues, none touching the new key); `<sub>`/`</sub>` tag-
  parity confirmed 4-for-4 across all 26 languages; inline back-translation-equivalent check (no
  `ANTHROPIC_API_KEY` set) confirmed all 6 numeric values (0.5, 0.2–0.3, 0.1, 1.0, 2.0, 45°) present
  in every language's string — no dropped clauses. Payloads regenerated post-sprint (FRESH).

- 0|104| **`e`/roughness field D8 content-and-stacking fix on dw/mhp/ip — DONE 2026-07-13.** Task
  101's flagged gap (identical `dw_roughness_tip` + `mpf_see_notes` stacking left open when `k_m` was
  fixed) closed after interviewing Tom. Decisions confirmed in interview: (1) content — generalize
  the existing mhp Notes-section entry (`mhp_notes_5_def`'s typical absolute-roughness values for
  steel/HDPE/PVC-uPVC/concrete), dropping its mhp-specific last sentence ("HDPE is common for small
  micro-hydro penstocks"), rather than drafting fresh Moody-chart values; (2) `dw_roughness` label
  shrunk from `'Roughness, e'` to bare `'e'` (matches `ip_roughness`, a deliberate Tom-approved
  exception to D8's general "not bare symbol alone" rule, documented as such in
  `dev/label-normalization-decision.md`); (3) full 26-agent Sonnet translation sprint authorized for
  the new `dw_roughness_tip` prose (not a hand-translated short label like Task 101's `k_m` label,
  since this is a full sentence of technical content). Execution: `dw_roughness_tip` changed from a
  baked-in `<span class="ec-help" title="…">` markup string to plain prose text, with the PHP call
  sites (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`, `Irrigation-Pressure.php`) now assembling the
  tip via `htmlspecialchars(strip_tags($ec_lang['dw_roughness_tip']))`, matching the `k_m` pattern
  from Task 102. `mhp_notes_5_term`/`_def` deleted from all 27 lang files (content now lives in the
  shared tip) along with its `<dt>/<dd>` row in `Micro-Hydro-Power.php`'s Notes section. `dw_roughness`
  set to bare `'e'` directly in all 27 lang files without a sprint (confirmed via `ip_roughness`
  precedent that a bare Latin symbol needs zero translation in any of the 26 languages). Sprint: 26
  agents (Sonnet, one per language) translated `dw_roughness_tip`'s new prose in parallel; one
  (Hindi) ran long and was completed directly (Claude Code) when the delay exceeded other languages'
  completion times — its independent re-run afterwards produced an identical string, confirming the
  direct translation was correct. Post-sprint QA: `php -l` clean on all 27 lang files + 3 calculator
  PHP files; `lang_syntax_validate.php` shows only the same pre-existing 65 advisory findings (no new
  issues); no stray HTML tags introduced in any of the 26 translated strings; inline read-through of
  all 26 strings against the English source confirmed semantic parity (materials, values, and units
  present in every language). **Bug caught and fixed during QA:** cs and he agents used the
  `&ndash;` HTML entity for the value range instead of a literal en-dash character; since the tip is
  passed through `htmlspecialchars()` at render time, `&` would have been double-escaped to literal
  visible text `&ndash;` — corrected to the literal `–` character in both files, then re-verified by
  rendering the PHP call sites directly (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`,
  `Irrigation-Pressure.php` all confirmed to render the correct tooltip text, `mpf_see_notes` stacking
  confirmed gone from mhp). `dev/label-normalization-decision.md` D8 updated: both known gaps (k_m
  from Tasks 101/102, roughness from this task) marked closed, and the bare-`e`-label exception for
  `dw_roughness` documented as Tom's specific call, not a general D8 rule reversal.

- 0|98|[CC] **DONE 2026-07-13: Task 98 closed — all 7 English-improvement items done.**
  1. `template_translation_help` reworded from "Do you have a great vision for a calculator to
     add here?  Can you help me improve translations, program, or host these calculators?" to
     "Do you have great ideas for expanding or improving these calculators or their
     translations?" in `lib/lang.ec.en.php`.
  2. `template_feedback` reworded "Please give us your valued words of suggestion or praise." to
     "Please share your valued words of suggestion or praise." (second sentence unchanged).
  3. `mpf_shear_stress` (already the single shared key used by mpf_/hw_/dw_/mtc_/mphl_ — confirmed
     via grep, no duplicate keys to consolidate) changed from "Average shear stress (tractive
     force), &tau;" to "Average shear stress, &tau;"; `$ec_lang_intent` updated to "Parallel or
     tangential tractive force per unit area on the bottom or bed of the cross section. | symbol"
     (edited with Tom's explicit in-task authorization, per CLAUDE.md's `$ec_lang_intent`
     AI-off-limits rule).
  4. `rc_sg`'s `$ec_lang_intent` rewritten to lead with "Relative density of rock" as the more
     standard modern term, explaining "specific gravity" is kept in the visible label only for
     continuity with Robinson's paper (same authorization basis as item 3). `glossary.json`'s
     `specific gravity` entry `context` field updated to match.
  5. **Simple English pilot on rc_ (Rock Chute).** Tom's direction: this is a multilingual project
     with an established English user base, so prioritize translatability over English SEO/idiom
     for *explanatory* content — but identity strings (menu + `<title>`) still match the
     authoritative source's own name. Captured as a standing principle in CLAUDE.md ("Write
     English source strings in Simple English"). Audit found "riprap" had been phonetically
     transliterated (not translated) in 6/26 languages (am, bn, he, hi, id, ur) and "chute" in 2
     more (hi, ur). First pass (over-corrected, caught by Tom): renamed English "Rock Chute" →
     "Steep Channel" and "Riprap" → "Rock Lining" *everywhere* including
     `rc_main_menu`/`rc_main_title`, and force-fit all 7 languages' identity strings to the "Steep
     Channel" concept. Tom's correction: Robinson's paper is literally titled "Design of Rock
     Chutes" — the calculator's *name* (menu + title) should keep matching that, only the
     *explanatory* text (description, tooltips, labels) should simplify; and no language should be
     forced into a specific English calque either way. Checked the evidence: 5 of the 6 flagged
     languages (am, bn, he, id, zh) already had natural, non-transliterated "Rock Chute"
     translations in their menu/title *before* any of this — proving transliteration risk tracks
     translation-pass quality, not UI tier, and that forcing "Steep Channel" onto them would have
     overwritten good translations that didn't need touching. Reverted: English
     `rc_main_menu`/`rc_main_title` back to "Rock Chute Design (Robinson)" / "Free Online Rock
     Chute Design Calculator — Robinson (1998)"; am/bn/he/id/zh's menu/title back to their original
     (already-natural) text; hi/ur's menu/title re-done (2 more small agent passes) as natural,
     non-calqued "rock chute" phrases (हिन्दी "चट्टानी ढाल संरचना", Urdu "پتھریلی گزرگاہ") — real
     transliteration fixes, not forced steep-channel translations. Explanatory strings
     (`rc_main_desc` and all rc_ body labels/tooltips/notes) keep the Simple English wording in
     all 7 languages — those were the actual defect locus. zh's pre-existing 3-way term
     inconsistency (块石/护坡/抛石 in explanatory strings → standardized on 护坡) also kept; zh's
     menu/title reverted to its original 块石 wording, matching the identity/explanatory split.
     `php -l` and `lang_syntax_validate.php` clean suite-wide (65 pre-existing advisory
     identical-to-english findings only, no new structural issues). Full 12-calculator Simple
     English audit deferred pending review of how this pilot lands (Tom's call, 2026-07-13: pilot
     rc_ only for now).
  6. **Cross-calculator jargon audit (Tom's candidate list: head, irregular, micro-hydro/
     run-of-river, seepage) — evidence-based, no English renames needed.** None of the other 11
     calculators cite a specific published paper by name the way rc_ cites Robinson, so the
     identity-vs-explanatory tension from item 5 doesn't recur as a *naming* decision elsewhere;
     this was purely a defect hunt. Checked actual shipped translations (not just glossary notes)
     against each candidate term:
     - **"head"** (dw_/hw_/mphl_/mhp_): no action. Core hydraulic vocabulary, not jargon — already
       had 6 languages' worth of documented wrong-sense fixes (pressure-loss vs. head-loss
       confusion) in ro/tr/id/fa/sw/ps between 2026-07-09 and 07-10; re-verified all still clean.
       Eponym calculators (Darcy-Weisbach/Hazen-Williams/Manning) already correctly keep their
       formula names untranslated.
     - **"irregular"** (mi_/wi_): bg was shipping the exact evaluative-sense defect (`неправилно`
       = "incorrect") the glossary's own "irregular channel" entry warns against, despite uk/ru
       already being fixed for the identical problem. Fixed bg's 7 occurrences to `произволно
       сечение` ("arbitrary cross-section"), matching the uk/ru pattern. Lesson: a documented
       glossary warning doesn't guarantee every flagged language was corrected — verify shipped
       state.
     - **"micro-hydro" / "run-of-river"** (mhp_): sw and km left "Micro-Hydro" as raw untranslated
       Latin English embedded in native sentences; km and ps also left "(Run-of-River)" as a
       redundant English parenthetical even where the surrounding sentence already translated the
       concept; ps separately phonetically transliterated "مایکرو هایدرو" as its own word
       throughout (same defect, different script — not caught by a Latin-script-only grep). Same
       failure class as the rc_ "riprap" defect. Fixed all 4: sw → "Umeme Mdogo wa Maji", km →
       "ថាមពលវារីអគ្គិសនីខ្នាតតូច", ps → "کوچنی آبي ځواک" — all real native phrases, none forced to
       calque the English wording (per item 5's "don't force a calque" rule). ar and zh were
       already clean and served as the quality bar.
     - **"seepage"** (cs_): no defects found. Checked actual translated values (not key names,
       which falsely matched "seepage" as a literal substring of every `irr_card_seepage_*` key)
       across all 26 languages — every one has a real native infiltration/percolation term.
     `php -l` and `lang_syntax_validate.php` clean for all 4 touched languages (bg, sw, km, ps) and
     suite-wide (same 65 pre-existing advisory findings, no new issues).
  7. **DONE 2026-07-13.** `ip_main_desc` changed from "Test Branch Pressure and Uniformity
     Estimate" to "Test Branch Pressure and Estimated Uniformity" in `lib/lang.ec.en.php`. The
     point of the reword (Tom, 2026-07-13): disambiguate that "Estimate(d)" modifies *only*
     "Uniformity" — the test-branch pressure itself is directly calculated, not an estimate. The
     old wording read as "[Test Branch Pressure] and [Uniformity Estimate]", ambiguous between
     that and "Estimate of both [Test Branch Pressure] and [Uniformity]". Re-checked all 26
     translations against this specific scope question (an initial "no propagation needed" note
     was wrong — it only checked for meaning-equivalence, not for this ambiguity) and found 4 with
     the identical wrong-scope defect, where a single leading "estimate" noun grammatically governs
     both pressure and uniformity: `bg` ("Оценка на налягането и равномерността..." — "Estimate of
     the pressure and the uniformity..."), `cs` ("Odhad tlaku a uniformity..." — "Estimate of
     pressure and uniformity..."), `hr` ("Procjena tlaka... i jednolikosti" — "Estimate of
     pressure... and uniformity"), `pt` ("Estimativa de Pressão e Uniformidade..." — "Estimate of
     Pressure and Uniformity..."). `ru`/`uk` already used the correct separated structure (a
     distinct "test/pressure" phrase and a distinct "estimate/uniformity" phrase joined by "and")
     and served as the model for the fix: `bg` → "Налягане в пробния клон и оценена равномерност"
     (pressure in the test branch and estimated uniformity), `cs` → "Tlak ve zkušební větvi a
     odhadovaná uniformita", `hr` → "Tlak u testnoj grani i procijenjena jednolikost", `pt` →
     "Pressão no Ramo de Teste e Uniformidade Estimada" — all now attach the estimate word as an
     adjective directly on uniformity only, matching the corrected English's scope exactly. The
     other 22 translations were re-verified clean (their own "estimate" word already binds only to
     uniformity, via a trailing compound or genitive construction). `php -l` and
     `lang_syntax_validate.php --lang=bg,cs,hr,pt` clean (only the same pre-existing advisory
     `identical-to-english` findings, no new issues).
  10. **Closed after scoping — no Opus pass needed.** Checked what items 1-4's English changes
      actually implied for the other 26 languages before propagating anything:
      - `mpf_shear_stress`: every one of the 26 translations still carried the "(tractive force)"
        parenthetical the English dropped. This was a mechanical deletion of an already-correct
        fragment (not a new-translation task), so no agent was needed — stripped it from all 26
        files directly (zh used full-width parens/comma, handled separately). `php -l` clean on
        all 27 files; `lang_syntax_validate.php` shows only the same 65 pre-existing advisory
        findings.
      - `rc_sg`: only the invisible `$ec_lang_intent` changed — nothing visible to propagate.
      - `template_translation_help` / `template_feedback`: reviewed all 26 translations and found
        propagation would be a regression, not an improvement — most languages (ru, ar, hr, sw,
        zh, cs, uk, sr, ur, ro, bg, etc.) already independently phrase "share" rather than "give",
        ahead of where the old English was; the old `template_translation_help` asked volunteers
        for translation/programming/hosting help specifically, content the new terser English
        dropped but which all 26 translations still usefully carry; and Turkish's string carries a
        hand-written translator credit (Mustafa Özbay) that must not be mechanically overwritten.
        Left all 26 as-is.

- 0|96|[CC] **DONE 2026-07-13: Task 96 closed — Bulgarian scope question resolved, all 3 sub-items
  addressed.**
  - **(1) CLOSED 2026-07-13 — decided and executed.** Tom: "I would put водно количество
    everywhere." Suite-wide, all bg calculator categories (pipes/irrigation included, not just
    open-channel/hydraulic-structure). Every `дебит` occurrence in `lib/lang.ec.bg.php` (35 across
    dw_/hw_/mpf_/mphl_/mi_/mtc_/ws_/wi_/or_/odt_/irr_/mhp_/cs_/ip_) replaced with `водно количество`,
    with grammatical gender agreement fixed throughout (дебит is masculine, водно количество is
    neuter — adjective/article/pronoun endings adjusted on every occurrence, e.g. `пълен дебит`→
    `пълно водно количество`, `техният дебит`→`тяхното водно количество`). `glossary.json`'s `flow`
    entry bg value updated to `водно количество` and `translation_notes` updated to record the
    resolution (version 1.6→1.7). `php -l` and `lang_syntax_validate.php --lang=bg` both clean.
  - **(2) CLOSED 2026-07-13:** engineer's 2026-07-06 answer — "Коефициент на градация (SD) =
    D₈₄.₁ / D₅₀" — is the standard term, superseding both candidates originally asked about
    (`едрозърнестост` and `разнозърненост`). Applied to `rc_SD`/`rc_SD_check` in
    `lib/lang.ec.bg.php` and recorded in `glossary.json`'s `gradation` entry.
  - **(3) CLOSED 2026-07-13 — resolved via best-effort review, no native review realistically
    forthcoming (Task 90 precedent).** Checked bg menu-title casing: `main_menu`/`main_title`
    across all 12 calculators were already sentence case (only first word + proper nouns
    capitalized), matching the engineer's corrections in `dev/Bulgarian-engineer-feedback.md`
    (e.g. "Проектиране на Каменен Улей" → "Проектиране на каменен бързоток" is a sentence-case
    correction). One real miss found: `index_title` (the site's homepage title, not a
    calculator-specific key) was genuine Title Case with a stray Latin "O" typo
    ("Безплатни Oнлайн Инженерни Калкулатори") — fixed to sentence case ("Безплатни онлайн
    инженерни калкулатори"), matching `ru`'s pattern for the same string. Spot-checked bg's
    `ip_` notes/tooltips for terminology consistency with the suite-wide `водно количество`
    decision (item 1) — clean, no defects found. (Note in passing, out of scope for this task:
    both bg and ru also Title-Case a handful of `<h3>` section headings in `about_body_html`
    (e.g. "Лицензия с Открытым Исходным Кодом") — a separate, suite-wide heading-casing question
    shared across languages, not a bg-specific defect; left untouched.)
  - **New feedback 2026-07-13 from bg engineer, addressed same day:**
    1. Language-menu capitalization: `LANGNAME` for bg was the only lowercase entry
       (`български`) among all 26 non-English languages (every other Latin/Cyrillic entry —
       `Hrvatski`, `Русский`, `Türkçe`, `Українська`, etc. — is capitalized). Fixed
       `lib/Language.Settings.php` to `Български`.
    2. mhp calculator's `e`/`L`/`Km` labels "more verbose than English": checked all three —
       `Km` (`mphl_total_junction_k`, shared with mphl_) was already a fair parallel of the
       English, no change. `e`'s tooltip (`dw_roughness_tip`, shared with dw_) had a genuinely
       extra "по метода на" ("by the method of") that no other language's equivalent tooltip
       carries — trimmed to "Височина на грапавостта по Дарси-Вайсбах". `L` (`mhp_length`) had
       expanded the main label into a full descriptive phrase ("Дължина на напорния
       тръбопровод, L") where English keeps it terse ("Length, L") and pushes detail into the
       tooltip — shortened the label to "Дължина, L" and applied the engineer's own suggested
       tooltip wording ("Дължина на провеждащия тръбопровод или улей", dropping the redundant
       "подвеждащия (входен)" parenthetical). `php -l` and `lang_syntax_validate.php --lang=bg`
       both clean.

- 0|97|[CC] **DONE 2026-07-13: Task 97 closed — tr riprap term unified on "taş dolgu".** Tom had no
  way to adjudicate the Turkish-native judgment call himself ("I have no way of helping... you will
  have to do your best"), so resolved via an Opus pass reasoning from suite convention rather than
  native review: the English source treats "riprap" as one concept in all 5 spots (bulk material
  and D₅₀ particle-size sizing alike), and every other language (es "enrocado", fr "enrochement",
  pt "enrocamento", ru "каменная наброска") uses one bulk-material term throughout rather than
  switching to a particle/fragment word for the sizing context — Turkish should match. Verdict:
  "parça taşı" ("piece stone"/rock fragment) is not a real Turkish hydraulics term for riprap;
  "taş dolgu" ("stone fill") is the established DSİ/TS term (cf. "taş dolgu baraj" = rockfill dam)
  and already matched `mtc_bend_angle` (category 1, incumbent) and `glossary.json`. Replaced all 4
  `rc_` occurrences (`rc_apron_length`, `rc_notes_1_def`, `rc_notes_3_def`, `rc_notes_6_def`) with
  grammatically correct "taş dolgu" inflections (genitive "taş dolgunun" where the original had
  possessive "parça taşının"; bare attributive "taş dolgu" elsewhere) — not a blind find-replace,
  since Turkish compound/genitive suffixes differ by construction. `php -l` and
  `lang_syntax_validate.php --lang=tr` both clean. No native Turkish review has occurred; this
  stands as our own best-effort resolution (per the Task 90 native-review precedent), not a
  pending "awaiting review" item.

- 0|99|[CC] **DONE 2026-07-13: Task 99 closed — removed broken `mph` option from
  `Manning-Irregular.php`'s velocity unit select.** `echoUnitSelect($name='v617u', ...)` offered
  `mps`/`ftps`/`mph`, but `mph` has no backing `$ec_units['mph']` conversion factor or
  `$ec_lang['u_mph']` label — the option rendered broken. Only one live occurrence found (the
  original roadmap note said "two"; the second no longer exists). Fixed by dropping `mph` from the
  Array, matching the `mps`/`ftps`-only pattern used by every other velocity selector in the suite
  (verified against `Irrigation-Pressure.php:107`, the only other velocity selector). `php -l` clean.

- 0|95|[CC] **DONE 2026-07-13: Localization-bypass audit findings, 2026-07-12 (Tom's "holistic
  closing audit" for Task 91 surfaced this gap class — hardcoded strings that never route through
  `$ec_lang`, so no translation-quality pass would ever catch them).** Two content pages exist
  entirely outside the localization system, unlike `About.php` (which correctly routes its body
  through `$ec_lang['about_body_html']`):
  - `Install.php` (66 lines, PWA install instructions) — 100% hardcoded English body.
  - `Orifice-Drain-Time-Ref.php` (786 lines, equation derivation reference) — 100% hardcoded
    English body; also linked from `Orifice-Drain-Time.php:47` via a hardcoded "Derivation"/
    "Equation derivation" link.
  Three scope questions, all resolved 2026-07-13 (Tom):
  1. **`Install.php`: translate it — moved to Task 100.** Tom's instinct was that it might be
     redundant now that there's an in-app `⬇ Install` button (`EngCalcs.installPWA()`,
     `js/Calculators.lib.js:29`). Checked and it isn't: that button only fires on browsers that
     support `beforeinstallprompt` (Chrome/Edge), so it's silently useless on iOS Safari and
     Firefox — which is most of Install.php's content (the iOS Share-menu steps, the "Firefox
     doesn't support PWA install" note, the "what gets cached" explainer). Install.php is the only
     working install path for those platforms, so it stays in scope and needs translating like any
     other user-facing page. Execution (wave-0 English cleanup, then translate) split off as
     **Task 100** rather than folded into this closure, since a 66-line page + a 786-line reference
     page is a real undertaking, not a quick sub-item.
  2. **`Orifice-Drain-Time-Ref.php`: English-only, permanently — including the "Derivation" /
     "Equation derivation" link text.** 786 lines of equation-manipulation prose ("integrating both
     sides," "substituting into," "rearranging yields") has a much higher mistranslation-consequence-
     per-word ratio than UI labels — a wrong verb tense changes what the math claims — and
     translating it right would be its own sprint for a page most users never open. English-only
     reference links are a normal pattern (engineering software routinely links out to English-only
     derivations/papers). No further action.
  3. **`Manning-Trap.php` radio labels (`Strickler`/`B/B`, `Isbash`/`Maynord`/`Searcy`): leave
     untranslated.** These are the surnames of the formulas' originators (citations, not descriptive
     text). Confirmed this matches existing suite convention — `lib/lang.ec.ar.php` and
     `lib/lang.ec.zh.php` already keep "Manning," "Darcy-Weisbach," and "Hazen-Williams" in Latin
     script inline even in RTL/CJK text (zh glosses with a transliteration once, then reverts to
     plain Latin). No script-rendering need; no code change.
  `Compare-Languages.php` and `formmail.php` are internal/dev-utility pages, not user-facing app
  content — out of scope, no action needed.

- 0|94|[CC] **DONE 2026-07-13: Task 94 closed — orphan-key full-suite housekeeping.** Ran
  `dev/scripts/lang_parity_check.php` across all 26 non-English lang files to get the authoritative
  "extra" (present in translated file, absent from English source) list: 30 keys — `cs_notes_1_term`,
  `cs_notes_4_term`, `cs_wp`, `ip_e`, `ip_hv`, `ip_notes_1_term`, `ip_notes_4_term`, `ip_v`, `mhp_f`,
  `mhp_flow`, `mhp_hf`, `mhp_hl`, `mhp_hm`, `mhp_km`, `mhp_nu`, `mhp_roughness`, `mhp_velocity`,
  `mi_notes`, `mtc_vel_check`, `mtc_vel_high`, `mtc_vel_high_short`, `mtc_vel_low_short`,
  `mtc_vel_ok_short`, `odt_h_orifice`, `or_flow`, `or_velocity`, `wi_elevation`,
  `wi_headWaterelevation`, `wi_notes_we_term`, `wi_station`. Verified each with a word-boundary grep
  across all PHP/JS before deleting — two looked live at first grep but turned out to be false
  positives on the identical string used for something else: `cs_wp` is a form-field `name`
  (labelled via the shared `mpf_wetted_perimeter` key, not its own), and `mtc_vel_high` is a JS
  `pageConfig` variable name fed from `$ec_lang['mhp_vel_high']`, not `$ec_lang['mtc_vel_high']`.
  Deleted both the `$ec_lang[...]` and `$ec_lang_intent[...]` lines for all 30 keys from all 26 files
  (759 lines total; English file untouched since these keys never existed there). Also fixed 4 stale
  references to the same dead keys (`or_flow`, `mhp_flow`, `mhp_hf`, `mhp_hm`) in
  `dev/scripts/glossary_compliance_audit.php`'s `TERM_KEYS` map, which had been silently no-op-ing on
  them. `php -l` clean on all 28 touched files; `lang_parity_check.php --strict` now reports
  `extra: 0` suite-wide (was 759 nonzero across languages); `lang_syntax_validate.php` clean (only
  pre-existing, unrelated `identical-to-english` advisories).

- 0|93|[CC] **DONE 2026-07-13: Task 93 closed — cross-language glossary reconciliation pass.**
  Checked `glossary.json`'s `preferred_translation` against actual shipped lang-file usage for the
  5 terms flagged by independent category-5-wave-1 agents (it, pt×3, ru, tr). Confirmed 6 genuine
  glossary-stale entries and updated them to match the incumbent, internally-consistent file terms:
  it riprap `scogliera`→`pietrame`; pt penstock `conduto forçado`→`conduta forçada`; pt plant
  efficiency `eficiência da usina`→`rendimento da instalação`; pt gradation `granulometria`→
  `graduação`; ru penstock `напорный трубопровод`→`пенсток`; tr penstock `basınç borusu`→`cebri
  boru`. hr rock chute (`kameni skluz` vs shipped `kameni žlijeb`) was left as-is — glossary already
  flagged it "NEEDS HUMAN REVIEW" pending a decision on whether the *file* should change to parallel
  sr/ru (`kameni brzotok`), not the glossary, so out of scope for a glossary-only reconciliation.
  Along the way found one case where the glossary was actually right and the file had drifted (tr
  riprap, `taş dolgu` vs `parça taşı`) — logged as a new item above rather than silently editing
  shipped translated sentences. No lang files changed; `glossary.json` only (version 1.5→1.6).

- 0|92|[CC] **DONE 2026-07-13: Task 92 closed — whole-label hover/tap target for tips.** Added
  `.ec-help { cursor: help; }` to `css/engcalcs.css`, updated the Bootstrap tooltip-init selector in
  `js/Calculators.lib.js` to also match `.ec-help[title]`, and mechanically migrated all 956
  `class="ec-tip"` occurrences across all 27 `lib/lang.ec.*.php` files to the
  `<span class="ec-help" title="…">Label <span class="ec-tip">?</span></span>` pattern (title moved
  from the inner span to the wrapper; inner `.ec-tip` markup/CSS unchanged, so it stays non-breaking).
  Fixed one pre-existing bug found along the way: `lib/lang.ec.sr.php` `rc_apron_length` had a raw
  unescaped `"` inside its `title` attribute (should have been `&quot;` like the English/Russian
  versions) which would have broken the HTML attribute boundary — corrected to `&quot;`.
  `$ec_lang_intent` entries were untouched. `dev/scripts/lang_syntax_validate.php` clean (only
  pre-existing, unrelated `identical-to-english` advisories); `php -l` clean on all 27 files.

- 0|91|[CC] **DONE 2026-07-12: Task 91 closed — complete re-translation of every calculator category
  into all 26 languages, category by category** — rules & sequence in
  `dev/translation-process.md` Scenario C, mechanics in CLAUDE.md § "Translation Sprints."

  | # | Calculator category | Prefixes | Status |
  |---|---------------------|----------|--------|
  | 1 | Open channel | `mtc_`/`mi_` | ✅ closed — 3 waves + holistic Opus pass |
  | 2 | Weirs & orifices | `ws_`/`wi_`/`or_`/`odt_` | ✅ closed — 3 waves + holistic Opus pass |
  | 3 | Pipe friction | `dw_`/`hw_`/`mpf_`/`mphl_` | ✅ closed — 3 waves + holistic Opus pass |
  | 4 | Irrigation & seepage | `cs_`/`irr_`/`ip_` | ✅ closed — 3 waves + holistic Opus pass |
  | 5 | Micro-hydro | `mhp_`/`rc_` | ✅ closed — 3 waves + holistic Opus pass |
  | 6 | Shared UI/units | `u_`/`calc_`/`menu_`/`points_` | ✅ closed — delta sprint + holistic pass |

  Category 6 didn't get a full 3-wave re-translation — a read-only assessment found its existing
  content already high quality (translated organically, never stale), so per the SOP's
  cost-scoping note the lightest rung that covered the risk was used instead: a delta sprint for
  the genuine gaps plus a holistic Opus pass. Full dated execution history:
  `dev/translation-execution-log.md`. Open threads spun off as their own standing items rather
  than closed with this task (Task 93 glossary reconciliation, Task 94 orphan-key housekeeping,
  Task 90 native-review backlog, Task 89 D50 median fix, Task 88 verdict-glyph sweep) were all
  separately closed 2026-07-13. The two suite-wide prerequisites this task depended on — **Wave 0**
  English reform and **Task 87** key consolidation — both ran once, up front, ahead of this task
  (see their own Completed entries).

- 0|90|[CC] **DONE 2026-07-13: Task 90 closed — native-review backlog resolved by best-effort
  verification instead of waiting for a native reviewer (Tom's call: "it's pie-in-the-sky to wait for
  human review that may never come").** Ran a research pass over every flagged concern for
  am/km/my/ps/sw plus the he/hi/ur/ps/ur concerns named explicitly, checked current lang-file
  values against the concern, and fixed what could be fixed without inventing new risk:
  - **The ps/ur "shear"=scissors false-cognate concern fully closed.** `mpf_shear_stress` was already
    fixed in both languages; `mi_tau` (category 1) was the one instance still carrying the literal
    scissors word (`قیچي` ps / `قینچی` ur). Changed both to `برش` (the shear/cut-noun root already
    established as correct in each language's own `mpf_shear_stress`), keeping the existing `<br />`
    column-heading layout. `php -l` clean on both files.
  - **sw `or_hwe`/`or_twe` asymmetry fixed.** Was `'Kiwango cha maji juu ya mlango'` (level of water
    above the gate) paired with `'Kiwango cha maji ya mkia'` (level of the tail-water) — two different
    grammatical constructions where every other language (fr amont/aval, es arriba/abajo, ar
    علوية/سفلية, hi अपस्ट्रीम/डाउनस्ट्रीम) uses a parallel pair. Changed `or_hwe` to
    `'Kiwango cha maji ya kichwa'` (head-water), mirroring the existing `mkia` (tail-water) — now a
    parallel head/tail pair matching the English metaphor exactly, minimal change to the established
    `mkia` term.
  - **km/sw `mpf_shear_stress` action-noun root verified, not a defect.** Checked the actual root
    words: sw `mkato` (a cut/incision, from *kata* "to cut") and km `កាត់` (the verb "to cut") are
    action/process nouns, not the scissors-tool nouns (sw `mkasi`, km `កន្ត្រៃ`) — the same
    non-error class as Arabic's own standard `إجهاد القص` and Hebrew's `מאמץ גזירה`, both built on
    cutting roots and both accepted engineering terms. Confirmed distinct from the real
    scissors-tool trap above; left as-is.
  - **ps `rc_sg`/he `rc_sg` "specific gravity" glossary check.** ps's glossary.json entry
    (`ستومانه وزن`, literally "heavy weight") was stale and did not even match the file's own
    already-correct term (`ځانګړی ثقل`, the standard Perso-Arabic scientific term parallel to
    English's own "gravity" naming) — glossary corrected to match the incumbent file term, same
    pattern as Task 93. he's `משקל סגولی` ("specific weight") verified as the standard Hebrew
    physics-curriculum term for this ratio, same accepted local-practice exception already
    documented for tr/özgül ağırlık/sr/hr — added to that exception list in glossary.json rather
    than "corrected" into an error.
  - **Discovered and left alone (out of scope):** am's `mhp_flow`/`mhp_roughness`/`mhp_km`/`mhp_nu`/
    `mhp_velocity`/`mhp_f`/`mhp_hf`/`mhp_hm`/`mhp_hl` keys don't exist in `lib/lang.ec.en.php` at all
    and aren't referenced by `Micro-Hydro-Power.php` — dead orphaned keys unique to the am file, not
    a translation defect. Left for a future dead-key cleanup pass (Task 94 territory), not touched
    here.
  - **Left open, genuinely needing a fluent reviewer (documented, not fixed):** am `mi_tau`'s shear
    rendering (`ሸርፍ`) — plausible but I can't independently confirm Amharic engineering usage; km's
    `mtc_vel_low` sedimentation word choice, `wi_pondingHeight`, the kept-in-Latin-script
    "re-entrant" in `or_notes_3_def` and "Micro-Hydro" in `mhp_main_title`; my `ws_headWaterHeight`
    phrasing; ps register in `or_notes_3_def`/`odt_notes_2_def`; sw's unnamed "tooltip phrasing" flag
    (no specific key was ever recorded, so nothing to act on) and its incumbent-vs-glossary term
    choices (already correctly kept per the incumbency principle, a Task 93 question not a Task 90
    one).
  - **QUALITY scores intentionally left unchanged** (am/km/my/ps/sw stay at `0.65`). Per Tom's framing,
    the low score itself is the honest, permanent "needs review" flag — it wasn't earned by full-suite
    independent back-translation coverage (only these specific flagged concerns got a second look), so
    bumping it now would overstate verification depth. Per CLAUDE.md's tier policy, `0.65`→`0.85`
    requires the full back-translation-checked + cross-language-consistency-checked treatment across
    the whole file, not a targeted patch.

- 0|89|[CC] **DONE 2026-07-13: Task 89 closed — D50 "median" mistranslation resolved via 12-language
  research vote, not native review.** Tom's call: since no native reviewer was available, research
  each flagged language's actual geotechnical/sedimentology literature (web search) to see how the
  vote leans overall, rather than blocking on human input per language. Spawned one research agent
  per language for bg/cs/de/hr/ro/ru/sr/tr/uk/fa/ur plus am (added per Tom's steer: "it's certainly
  not as though nobody can do real math in Amharic"). Result: 7 of 12 (de/cs/uk/tr/fa/ur/sr) had a
  directly-cited real median term in that language's technical literature — genuine errors, fixed.
  2 (bg, uk) turned out to already be correct in the actual lang files (glossary.json was simply
  stale — same pattern as Task 93); 2 more (hr, ro) were likewise already correct in-file. Only
  am had no distinct median-vs-average term in circulating usage at all (confirmed even by Amharic
  dictionaries) — left unchanged, nothing more correct to fix it to. Edited `mi_d50in`/`rc_D50`/
  `rc_notes_1_def` in lib/lang.ec.{de,cs,ru,tr,fa,ur,sr}.php and refreshed glossary.json's `median
  rock size` entry (translations + a dated research note) to match. `php -l` clean on all 7 touched
  files; `lang_syntax_validate.php` shows only pre-existing, unrelated `identical-to-english`
  advisories. Full per-language findings and citations in the conversation record.

- 0|88|[CC] **DONE 2026-07-12: Task 88 closed — suite-wide baked-in verdict-glyph sweep.** Ran the
  mechanical grep the item called for across every verdict-string key actually passed as
  `writeCheckHTML()`/`writeVelocityCheck()`'s `shortText` argument (27 keys spanning
  `mhp_vel_*_short`, `or_regime_*`, `mhp_hl_*`, `odt_h2_*`, `cs_loss_negative`/`cs_Ec_*`, `rc_pond_*`/
  `rc_eq_warn_*`/`rc_sg_*`/`rc_SD_*`, `ip_elev_ds_missing_warn`, `ip_pressure_warn_short`) against
  all 26 non-English lang files for baked-in ✓/⚠/×/etc. glyphs or translated "Warning:"/"OK:"
  prefixes. Zero matches — the category-2/5 instances already fixed were the only real occurrences;
  category 1's previously-unchecked `mtc_vel_*` consumers are clean. Full method and results:
  `dev/translation-execution-log.md`, 2026-07-12 entry.

- 0|87|[CC/H] **DONE 2026-07-07: Concept-level label normalization (design exploration; raised by Tom 2026-07-06).** The original design attempted to economize by using atomized language variables at the *word* level, which made both translation and maintenance hard. Explore revisiting economizing by normalizing at the *concept* level instead: adopt one canonical, reusable label per concept — borrowed from whichever existing calculator has a good set — rather than per-calculator wording. First candidates to review critically: (a) **elevation** — use identical label wording wherever any calculator asks for an elevation, with the tooltip optionally broken into a few per-context variants; (b) **length** — drop the qualifier ("channel"/"reach"/"pipe") from "channel length"/"reach length"/"pipe length" and lean on the page title for disambiguation. Payoff: shrinks the translation surface and eases maintenance across the suite. Do a reuse-candidate audit before committing. Model split: Fable for the cross-calculator language survey; Opus/Tom for the reuse-architecture decision. Priority number provisional.
  - **Fable survey DONE 2026-07-07 → `dev/label-normalization-survey.md`.** Key findings: cross-prefix borrowing already exists (Darcy-Weisbach.php uses mpf_/mphl_/hw_ keys), so the decision is ownership policy, not mechanism; ~18 exact-duplicate keys mergeable with zero wording decisions (incl. the 7-key mtc_/mhp_ velocity-check block); strongest wording cluster is the head-loss triad + minor/junction-loss coefficient across mphl_/mhp_/ip_; candidate (a) elevation supported as shared-bare-key + closed qualified set (Orifice Flow needs 4 distinct elevations on one page, so bare-only is too strong); candidate (b) length supported for mphl_/mhp_ only — keep "Reach length" (cs_) and "Weir length" (ws_) as load-bearing. Survey §6 has the ranked shortlist.
  - **Opus/Tom architecture decision DONE 2026-07-07 → `dev/label-normalization-decision.md`.** Six rulings: **D1** borrow-from-owner, no neutral prefix, **menu order** breaks ties (`mpf_→mphl_→hw_→dw_→mtc_→mi_→rc_→mhp_→or_→odt_→ws_→wi_→cs_→ip_`); **D2** menu order picks the surviving *key*, best cluster wording picks its *value*; **D3** "**Minor (local) loss**" canonical (merges mphl_ "junction loss" + mhp_/ip_ "minor loss"; rename `mphl_total_junction_k`); **D4** lowercase loss symbols `h_f`/`h_m`/`h_L`, coeff `k_m`, capital `H` reserved for total/gross/net head; **D5** verdict strings = leading `✓`/`⚠` glyph (decorative, untranslated) + short text, **whole string is the `ec-tip` tooltip target** (fixes `writeVelocityCheck`'s glyph-only tap target); **D6** merges execute **per category, just before its Wave 0/wave-1** (not one suite pass), so each shrinks the paid sprint that follows. Recorded in glossary.json (v1.4: minor⇄local, lowercase loss symbols) and CLAUDE.md (Concept-level label reuse + Verdict convention subsections). **Execution backlog (8 items, ranked value÷risk)** — see decision doc's "Execution backlog" and §6 of the survey. (Ruling **D6 was REVERSED 2026-07-07** — see next bullet; it originally, wrongly, handed execution to Task 91's per-calculator-category loop.)
  - **CORRECTION 2026-07-07 (Tom + Opus) — Task 87 REOPENED as a standalone, FULL-SUITE project; ruling D6 REVERSED.** Closing Task 87 as "decision-only" and routing its merges through Task 91's per-calculator-category loop was the mistake that poisoned Task 91. Key consolidation is inherently cross-cutting: a duplicate label's two halves live in *different* calculator categories, so no per-category view can make the merge/ownership call (proved this session — open-channel's merge candidates were shared with weirs, irrigation, and micro-hydro). **New structure:** Task 87 = **one English-only pass over ALL calculators**, executed by **Opus** (context-hot; this is architecture/sequencing, not a linguistic sweep; Fable's survey is already done). It is a prerequisite English-reform step, **decoupled from Task 91**; the merge step that had been inserted into Task 91's per-category loop is removed. **Corrected end-to-end sequence:** (1) Task 87 full-suite key consolidation [Opus, English-only, applies D1–D5 + D7 merge method] **+** Wave 0 colloquialism cleanup for the remaining calculator categories [Fable] → (2) **translation tier/wave 1 (anchors) — INTERACTIVE**; translating into cognates is how we still catch garbage English, so wave 1 may still reform the source → (3) **English then FREEZES for tiers/waves 2+** → complete re-translation of waves 2–3 [major non-Latin → low-resource; full backtranslate + native-review QA] → (4) build the §10.5 per-key English **source-hash LAST** (deferred: with a complete re-translation there is nothing to delta-gate *this* pass; the hash earns its keep only for *future* incremental English edits). Terminology throughout: **"calculator categories"** (the 6 calc groupings; Tom's word, 2026-07-07) vs **"translation tiers/waves"** (language groupings) — never bare "families". The tips standard (blue `?` affordance + whole-label hover/tap target) is split off as its own item under CSS Standardization Follow-up. **Scope reminder (Tom, 2026-07-07): Task 87 is NOT finished until the ENTIRE survey (`dev/label-normalization-survey.md`, §1–§6) is addressed** — executed or explicitly dispositioned keep-as-is. Progress is tracked row-by-row in **`dev/label-normalization-tracker.md`** (the completion gate: every row ☑/◇, 5 open wording decisions ruled, QA clean). The exact-duplicate merges (§2) are only the first of ~10 survey areas. **Status:** roadmap decoupled 2026-07-07; tracker built; 5 open wording decisions surfaced (velocity-shorts, elevation owners, roughness-`e`, weir "height"vs"head", S₀↔S_f safety) — resolve those, then execute top-to-bottom on Opus.
  - **DONE 2026-07-07 — full execution complete, every `dev/label-normalization-tracker.md` row ☑/◇.** §1–§3 (ownership policy, ~18 exact-duplicate merges, 8 concept clusters) executed in prior sessions this same day. §4 typography ride-alongs: area symbols standardized to uppercase `A`/`A₀` (owner incumbency over mpf_'s lowercase `a`), `Q₀`/`z₁`/`z₂` given proper `<sub>` subscripts, Froude `F`→`Fr`, `tau`→`&tau;`, `mi_hv617` `H_v`→`h_v` (incl. its `$ec_lang_intent`, Tom-authorized), and all 10 remaining `style="cursor:help;color:#06c;…"` spans (mtc_/rc_) converted to `class="ec-tip"`. §5 verdict convention (D5): new shared `EngCalcs.writeCheckHTML(ok, shortText, tipText)` in `js/Calculators.lib.js`; `writeVelocityCheck` rewritten so the whole string (not just the ⚠ glyph) is the `.ec-tip` tap target. The other 5 ad-hoc verdict groups (`or_regime_*`, `odt_h2_*`, `cs_loss_*`, `mhp_hl_*`, `rc_sg_*`/`rc_SD_*` — the latter rode along, same defect as `rc_sg_*` though not separately listed in the tracker) had their baked-in long strings split into a short label + new English-only `*_tip` key per D7. QA: `php -l` + `node --check` clean on every touched file, `lang_syntax_validate.php` clean, all touched calculator pages render with no fatals via CLI PHP. New `_tip`/split keys show as "missing" in the 26 non-English files — expected propagation worklist for Task 91 (D7), not a defect.

- 0|86|[CC] **DONE 2026-07-07: Task 86.** Reversed the `dw_roughness` over-consolidation. `dw_roughness` restored to `'Roughness, e'` (dw_/mhp_ wide-form labels); new key `ip_roughness`='e' added for Irrigation-Pressure's narrow table column; both keep sharing `dw_roughness_tip`. English-only per Task 87 convention (`dev/label-normalization-decision.md`: non-English files aren't touched during consolidation work) — Tom confirmed deferring the 26-language propagation to Task 91, or leaving the key empty/English-fallback in the interim is fine. `ip_roughness` doesn't yet exist in the 26 non-English files, so it silently falls back to the English value there (same load order as any other missing key) until propagated.

- 0|85|TypeScript migration item closed as stale, 2026-07-05 (Human authorization): item was conditional on its own face ("only worthwhile if the project scope grows significantly") and no such growth has occurred — no bundler, no npm dependencies, no build step exist in this codebase today, and adding a `tsc` toolchain would cut against that simplicity for no observed type-safety pain. Closed with no code changes; revisit if the project scope grows enough to justify the tooling.

- 0|84|Renamed `irr_main_menu` from "Irrigation Flow Measurement" to plain "Irrigation" in all 27 `lib/lang.ec.??.php` files, 2026-07-05: the section now covers pressure/DU (Irrigation Pressure calculator) as well as flow measurement, so the old label undersold the menu's scope. User chose "Irrigation" over the alternative "Irrigation Calculators" when asked. For the 26 non-English files, reused each language's own existing irrigation-root vocabulary already present in the old (longer) translated string rather than running a translation sprint — e.g. Spanish "Medición de Caudal de Riego" → "Riego", Russian "Измерение расхода ирригации" → "Ирригация". No new terms introduced, so no glossary/sprint step needed. `php -l` clean on all 27 files.

- 0|83|npm/Composer dependency-management task closed as stale, 2026-07-05: investigated before starting (item was reassigned from `[CP]` to `[CC]` this session per Human direction) and found the premise no longer holds — `HeadersFooters.lib.php`/`sw.js` load Bootstrap straight from `cdn.jsdelivr.net`, not a locally vendored copy, and a repo-wide grep found no Composer usage (`vendor/`, PHP library requires) and no locally built/minified JS or CSS. There is currently nothing to manage a dependency manifest for. Closed with no code changes rather than manufacturing an empty `package.json`/`composer.json` — revisit if a real local dependency is introduced later.

- 0|82|Suite-wide symbol-convention question, resolved 2026-07-05 (split off 2026-07-04 from the Irrigation Pressure H-vs-P item): decision is **keep single-letter symbols on labels as-is** — they aren't decoration, they're the join key between a label and the formula shown right below it (e.g. `mhp_notes_1_def`: "Net head H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>"), and the pattern (H<sub>gross</sub>, Q, k<sub>m</sub>, h<sub>f</sub>, R<sub>h</sub>, P<sub>w</sub>, etc.) is already consistent across mi_/mpf_/mphl_/or_/mhp_/odt_ and more. No suite-wide edit made — status quo confirmed, not changed.

- 0|81|Fixed bg/es/pt/tr Manning Trapezoidal Channel (`mtc_`) symbol/translation gaps found 2026-07-05: added the missing `b`/`S`/`y`/`D50` symbol suffixes to `mtc_bottom_width`/`mtc_channel_slope`/`mtc_flow_depth`/`mtc_d50_in` in all 4 languages. For bg/tr, `mtc_bend_angle`/`mtc_sgrock` were left as flat untranslated English (bg additionally marked `//No need` in-file) — decided (no explicit `$ec_lang_intent` guidance existed for these, so treated as an ordinary translation gap) to translate both into bg and tr rather than leave them, matching the pattern already used by fr/de/ru for the same keys. `php -l` clean on all 4 files; `lang_parity_check.php --prefix=mtc` shows 0 missing/extra and 0 equal-to-English for bg/tr, and only pre-existing unrelated gaps (`mtc_blodgett_v_bathurst`, `mtc_vel_ok_short`) remain in es/pt.

- 0|80|Results sharing made opt-in, 2026-07-05: implemented the scope agreed 2026-07-04 (see prior framing above, now folded in here). `EngCalcs.calcAndSave()` (`js/Calculators.lib.js`) no longer calls `updateUrl()` on every form change; a new `EngCalcs.copyLink()` calls it on demand, writing `window.location.href` to the clipboard via `navigator.clipboard.writeText` and flashing the button text to a localized "Copied!" for 1.5s. New `#ec-copy-link-btn` button added next to the existing "Label:" field in `lib/Menus.lib.php` (shared scaffold, all calculator pages) — the `ec_name_hint`/`change` listener's explicit `updateUrl()` call (renaming the saved calc) was left alone since that's already an explicit user action, not automatic churn. New lang keys `calc_copy_link`/`calc_copy_link_done` added to all 27 `lib/lang.ec.??.php` files (English fallback in the 26 non-English files; no translation sprint run yet). Also fixes a real bug this design flaw was causing: `EngCalcs.readCookieAndCalc()` checked `loadFromUrl()` before `cookieToForm()`/`pageCalculatorInitialize()`, and since the URL almost always carried params (from the old automatic `updateUrl()`), it would skip row-table initialization entirely on reload — for calculators with dynamic reach/point tables (Irrigation Pressure, Weir Flow Irregular, Manning Irregular) this meant the table silently ended up with **zero** rows, since rows are only ever created inside those two functions and `CalcsBody` ships empty in the raw HTML. Fixed by always running cookie/default init first, then layering any URL params on top as overrides; `updateUrl()` also now excludes elements inside `#CalcsBody` from the query string, since per-row fields share duplicate `name`s and can't round-trip as flat key=value pairs anyway. Verified via a jsdom + real-cookie-jar harness against the live dev server: reproduced the exact zero-row failure pre-fix, confirmed 3 rows post-fix, and confirmed no regression in normal cookie round-trips (including the user's actual stale cookie value from testing). `php -l` clean on all 27 lang files plus `Menus.lib.php`/`Calculators.lib.js`.

- 0|79|"Default values" reset button, added 2026-07-04: placed on the same shared row as the unit-set buttons ("Set units:"), so one edit to `lib/Calculators.lib.php`'s `set_units_row` covers all 12 calculators — new `<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">` right after the four unit buttons. Reset mechanism deliberately simple per user direction: `EngCalcs.resetToDefaults()` (`js/Calculators.lib.js`) calls a new `EngCalcs.expireCookie()` (`js/Cookies.lib.js`, mirrors `createCookie()` with a past expiry) then does a plain `window.location.href = window.location.pathname` reload — no bespoke per-calculator JS needed, since the existing cookie-miss path already falls back to each page's own `pageCalculatorInitialize` (`js/Calculators.lib.js:107-113`), which naturally restores dynamic reach/points tables too. New lang key `calc_defaults` ("Default values") added to English, then translated into all 26 non-English `lib/lang.ec.??.php` files via 26 parallel haiku agents (per-language authorization given 2026-07-04). Verified: `php -l` clean on all 27 lang files plus `Calculators.lib.php`; `lang_parity_check.php` shows the `equal_to_english` count dropped by exactly 26 (one per language); rendered a live calculator page (Darcy-Weisbach) via CLI PHP and confirmed the button HTML (`<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">Default values</button>`) renders correctly and wires to the new JS function.

- 0|78|Irrigation Pressure H-vs-P decision, resolved 2026-07-04, corrected same day: initial pass kept H<sub>supply</sub>/H<sub>design</sub>/H<sub>last</sub> attached to the three pressure labels (`ip_h_supply`, `ip_h_design`, `ip_h_far`) reasoning that H is the suite-wide head symbol — user corrected this: pressure quantities should carry no symbol at all here, not H and not a new P. Removed the `, H<sub>...</sub>` suffix from all three English labels, now plain "Supply pressure" / "Emitter design pressure" / "Last emitter pressure". Scoped narrowly to the three quantities explicitly labeled "pressure" in words — left the reach-table loss quantities (`ip_hv`/`ip_hf`/`ip_hm`/`ip_hl`: velocity head, friction loss, minor loss, total reach loss) untouched, since those are head/loss terms, not pressure values. Internal JS variable names (`h_supply`, `h_design`, `h_far` in `js/irrigation-pressure.js`/`Irrigation-Pressure.php`) left as-is — internal plumbing, not user-facing, out of scope for a display-symbol correction. No non-English files affected (Irrigation Pressure translation sprint hasn't run yet). Verified: `php -l` clean, rendered page confirms all three labels show plain text with no symbol. The broader "are single-letter symbols worth it suite-wide" question was split off as a separate, still-open, non-urgent item.

- 0|77|Irrigation Pressure calculator (`Irrigation-Pressure.php`, prefix `ip_`) — English-only build of the distributary-network/irrigation-branch hydraulics calculator spec'd out in a 2026-07-04 design session, substantially reworked the same day through extensive live testing and feedback (37 rounds of comments). Description settled on "Test Branch Pressure and Uniformity Estimate."

  **Core model:** a single flat reach table where each row is independently a Main reach (flat draw = design flow × the reach's own total emitter count — every OTHER lateral branching from that reach; for the reach right at the test lateral's own takeoff, this also includes any laterals beyond that point along the main or sharing the same junction, e.g. an opposite-side lateral, since their flow branches from that same reach too) or a Lateral reach (per-emitter `q = k·H^x` draw, friction loss reduced by Christiansen's F(n) for multi-outlet reaches). Solves by guessing the last (most remote) emitter's pressure and bisecting it against the entered supply pressure, marching the Energy Grade Line backward reach-by-reach — same bisection shape as `js/manning-pipe-flow.js`'s `solveForDd0`. Elevation modeled via a proper EGL march (extension beyond the original spec, which had no elevation term): EGL only ever drops by friction+minor loss; actual nodal pressure is backed out using each row's own elevation and velocity. One downstream-node elevation input per row (optional/defaults-to-flat on interior rows, load-bearing on the last row) plus one global supply elevation. Terminology settled through testing: "test path"/"test lateral" (not "critical path"), "last emitter" (not "critical emitter").

  **Uniformity methodology reworked significantly after live discussion**, not just built once: initially compared the last emitter's flow against the manufacturer's design/rated flow, but that's not standard practice — real low-quarter DU divides by the sampled population's own mean, never an external rated value. Settled on `q_last/q_avg_field` (`du_estimate`), where `q_avg_field` is the test lateral's own modeled average corrected by a user-entered `dp_avg` ("estimated pressure difference, average vs. test lateral," default 0). The correction exists because the test lateral is deliberately the presumed worst case, so its raw average is a biased-low stand-in for a true field average — `dp_avg` lets a motivated user correct for that bias, feeding both the uniformity check and the Application Design section below. Kept `q_last/q_design` (`q_ratio`) as a separate, explicitly non-uniformity diagnostic for "how far is this system running from its design point." Added a worst-case sanity warning: if the solved last-emitter pressure reaches or exceeds supply pressure, flags that the modeled path likely isn't the true worst case. Deliberately did not attempt an interpolated low-quarter DU (per-emitter pressure interpolation within each lateral row) — reconsidered and deferred, since the model lacks the elevation and length resolution to do that honestly.

  **Application Design section added**, ported from `Drip-Sprinkler.php`'s formulas and reusing its `ds_*` labels: spacing (`Se`/`Sl`) and system-wide lateral/emitter-count inputs feed precipitation rate, system/zone flow, and runtime, using the corrected `q_avg_field` instead of a manually-guessed rate.

  **Shared-library bugs found and fixed during this build** (benefit every calculator using these patterns, not just this one): `js/Calculators.lib.js`'s `addCalcRow` never applied initial values to checkbox/radio row inputs; a `points_data`-textarea null dereference when a calculator's table omits the copy/paste feature; `loadFromUrl` could crash assigning `.value` to a non-Element when a field name collided with a reserved DOM collection property (e.g. `length` shadowing `HTMLFormControlsCollection.length`); `js/Cookies.lib.js`'s `cookieToForm` had no detection for a stored cookie no longer matching the current page's field layout — now bails cleanly to reinitialize instead of crashing or partially populating.

  Reused existing precedent throughout rather than inventing new architecture: `Manning-Irregular.php`'s dynamic add/remove row table (`EngCalcs.addCalcRow` etc. in `js/Calculators.lib.js`) and `js/darcy-weisbach.js`'s 3-regime friction factor. Deliberately dropped for this pass: the points-data copy/paste bulk-edit textarea (kept add/remove single-row controls only) and a sketch/diagram. Deferred/out of scope: pump-curve supply boundary (fixed inlet pressure only), a dedicated pressure-compensating-emitter toggle (usable today via the free `x` exponent input), and the 26-language translation sprint (English only; `$ec_lang_intent['ip_*']` left blank per the sprint process, not yet run — see the separate symbol-convention roadmap item, H-vs-P and q-vs-Q, to resolve before that sprint). `php -l` and JS syntax clean on all touched/new files throughout.

- 0|76|Quality-score updater: Added `dev/scripts/update_quality_score.php` (usage: `php update_quality_score.php <lang> <quality>`). The roadmap item's original description was slightly off — the `QUALITY` constant actually lives in `lib/Language.Settings.php` (one `$all_language_settings[lang]` array per language), not in the per-language `lang.ec.??.php` files, which only hold display strings. Script validates the lang code (2-letter, must already exist in the settings file) and quality value (numeric, 0–1), then does a targeted regex replace of just that language's `QUALITY` value, leaving formatting/comments untouched. Verified: successful update on `es`, rejected an unknown lang code and an out-of-range quality value, `php -l` clean. Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call.

- 0|75|Deployment workflow script: Added `dev/scripts/deploy.sh` wrapping the full release sequence — `php -l` on every changed/new PHP file (diff-filter ACMR against HEAD plus untracked new files), aborts on any lint failure before touching git; then `git add -A`, an interactive commit-message prompt (skips commit if nothing staged, aborts on empty message), then an interactive push confirmation (`git push origin <branch>`, defaulting to the current branch) via the existing `altssh.bitbucket.org:443` origin remote — no separate SSH config needed since the remote URL already routes through altssh. Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call. Verified `bash -n` clean and a dry run (declining both prompts) correctly skipped commit/push with no changes to the tree.

- 0|74|Lang-file key-order normalizer: Added `dev/scripts/lang_key_order_normalizer.php`, which rewrites each non-English `lib/lang.ec.??.php` so its `$ec_lang[]` key order matches `lang.ec.en.php` exactly (values, quoting, and trailing same-line comments preserved byte-for-byte via PHP's own tokenizer; stale/duplicated section-header comments consolidated to English's structure). Originally scoped to Copilot (`[CP]`); reassigned to Claude Code and executed directly this session. Ran on all 26 non-English files: `lang_syntax_validate.php` clean, `lang_parity_check.php --strict` shows 0 missing/extra keys, and a separate token-level value-equality check (order-independent) confirmed 0 content diffs across every file. One real hazard surfaced and handled: `lang.ec.es.php` had two keys (`u_gradePercent`, `u_in2`) that reference an earlier key's own translation via PHP's unquoted string-interpolation syntax (e.g. `"$ec_lang[u_grade]"`) rather than retranslating it — naive English-order reordering would have flipped the assignment order and silently broken that reference at runtime (undefined-key warning, empty interpolation). The normalizer detects this pattern generically and topologically re-sorts just the affected pair, deferring to English order everywhere else — confirmed by re-rendering both interpolated strings through PHP post-reorder. The script's `--check` mode (exit 1 on any mismatch) serves as the "hook to enforce order on future edits" called for in the original spec, runnable in CI or pre-commit.

- 0|73|Translated the 3 keys newly surfaced by the entity-normalization fix (see next item): `cs_payback_years` in fr/it/km/my/ro/tr; `mhp_nu` in km/my/ro/tr; `mi_tau` in km — all were fully untranslated English, hidden from prior parity-check runs by HTML-entity vs. literal-character mismatches. Reused established per-language vocabulary already present in each file (e.g. `cs_lining_cost`/`cs_annual_value_recovered` terms for the payback tooltip, `dw_kinematic_viscosity` terms for the viscosity label, `mpf_shear_stress` term for the shear label) for consistency. `lang_parity_check.php` confirms 0 remaining `equal_to_english` hits for all 3 keys across all 27 files; `php -l` clean.

- 0|72|Fixed HTML-entity-vs-literal-character blind spot in `lang_parity_check.php` and `generate_translation_payloads.php`: both scripts' "equal to English" / delta detection compared raw strings, so an entity form (e.g. `&ndash;`, `&times;`, `&nu;`) in one file and its literal UTF-8 character in another (e.g. `–`, `×`, `ν`) were wrongly treated as different, hiding genuinely-untranslated keys from sprint payloads and parity reports. Added a shared `normalizeForCompare()` helper (`html_entity_decode(..., ENT_QUOTES | ENT_HTML5, 'UTF-8')`) applied to every equality comparison in both scripts (main english-equal check, plus `findNeighbor()`'s context-consistency check in the payload generator). Verified via before/after diff of full parity-check output: total `equal_to_english` count rose from 1214 to 1225, newly catching `cs_payback_years`, `mhp_nu`, and `mi_tau` as genuinely untranslated in several languages (previously masked by encoding mismatch) — confirmed each is a real defect, not a false positive. Follow-up translation of those 3 keys logged as a new small task above.

- 0|71|Removed orphaned `rrc_main_desc` and `rrc_main_menu` keys from all 26 non-English lang files: legacy of an earlier `rrc_` prefix before Rock Chute settled on `rc_` — keys existed in every non-English file but never in English. Confirmed via `grep -l` that exactly the 26 non-English files (and no others) had them before removal; `php -l` clean on all 27 files afterward.

- 0|70|Finish the tooltip-icon CSS standardization: the earlier "CSS standardization for validity/status checks" sprint added `.ec-tip` (currently just `cursor: help`) but only wired it into `EngCalcs.writeVelocityCheck()` in JS. The much larger set of hover-tip spans hardcoded directly into the lang files was never migrated — 318 occurrences of `style="cursor:help;color:steelblue;font-size:0.9em"` across all 27 `lib/lang.ec.??.php` files (English included). Plan: (1) add `color: steelblue; font-size: 0.9em` to `.ec-tip` in `css/engcalcs.css`, (2) mechanical find/replace `style="cursor:help;color:steelblue;font-size:0.9em"` → `class="ec-tip"` in all 27 lang files (no translation judgment needed, just markup — safe for a script or a single pass, not a per-language translation sprint).

  Note: a separate, unaddressed variant `style="cursor:help;color:#06c;font-size:0.9em"` (a different blue) also exists in several lang files for the same tooltip-icon purpose — out of scope for this item, candidate for a follow-up consolidation.

- 0|69|Expand and tighten glossary.json: Filled in all 5 empty languages (am, bn, km, my, ps) for all 27 terms using 5 parallel agents. Reviewed 6 nuanced terms across 21 existing languages. Corrections applied: fr conveyance efficiency → rendement de transport d'eau; cs/sr penstock → tlakovod/напорни цевовод; ar/uk emitter → قطارة/крапельниця; uk conveyance efficiency → added 'води'. Version bumped to 1.1.

- 0|68|Drip-Sprinkler.php simplified — removed Distribution Uniformity (DU): DU as implemented required both an average and a minimum emitter flow rate, but neither is knowable at design time without full lateral/main hydraulic modeling (a catalog emitter rating is really a best-case/near-inlet value, not avg or min — DU would report 100% for any un-modeled layout). Removed `q_min`, `du`, `du_check`, and the four `du_*` quality-tier keys; renamed `ds_q_avg` to plain "Emitter flow rate, q"; merged the DU notes entry out and renumbered the Runtime note. Calculator now honestly scopes to what's knowable pre-hydraulics: area per emitter, application rate, lateral/zone flow, and runtime for a target depth. Removed the same keys mechanically (deletion + notes renumbering) from all 26 non-English lang files, then hand-trimmed the "average"/"and uniformity" wording out of `ds_main_desc`/`ds_q_avg` in each (no new translation needed, just removing qualifiers that no longer apply). `lang_parity_check.php --prefix=ds` shows 0 missing/extra/equal-to-English across all 27 files; `php -l` clean. Follow-up (full lateral-hydraulics DU calculator) logged as a new, separate, low-priority roadmap item — scope is larger than first thought once arbitrary pipe-size steps are considered.

- 0|67|Removed `$ec_lang['ec_name_invalid']` (and its empty `$ec_lang_intent` entry, English-only, removed with explicit user permission this session) from all 27 `lib/lang.ec.??.php` files — confirmed unused outside the lang files via repo-wide grep before removal. `php -l` clean on all 27 files; `lang_parity_check.php` shows 0 missing keys post-removal.

- 0|66|Velocity-tip wording upgrade (open-channel + enclosed-pipe): Per user feedback, richer tooltip wording for both threshold groups. Open-channel (`mtc_vel_high`, shared by mtc+mi): "check available drop" → "check transition losses and available energy" (more translatable, more general hydraulic concept than "drop/fall"). Enclosed/pressure (`mhp_vel_high`/`mhp_vel_low`, shared by dw/hw/mpf/mphl/mhp): replaced the trivial "Velocity very high/low ⚠" with substantive tips — high: "risk of water hammer and high point (minor) losses"; low: "risk of sedimentation and air entrainment" (matches the specificity of the open-channel tips; dropped the redundant ⚠ since the icon itself already shows it). Launched 26 parallel haiku agents to reword all 3 keys across every non-English `lib/lang.ec.??.php` file (existing translations were stale — several still described old "diameter sizing" advice rather than the current tooltip content). 0 missing keys, all `php -l` clean.

- 0|65|Velocity checks added to Darcy-Weisbach, Hazen-Williams, Manning Pipe Flow, Manning Pipe Head Loss: All four pressurized/enclosed-pipe calculators now show an OK/High/Low `vel_check` row, reusing `EngCalcs.writeVelocityCheck()` and the existing `mhp_vel_*`/`mhp_vel_*_short` lang keys directly (no new keys, no new translation sprint needed — those keys already have 26-language coverage). Threshold matches Micro-Hydro Power: 1.0–3.0 m/s = OK, >3.0 = High, <1.0 = Low. Open-channel calculators (Manning Trapezoid, Manning Irregular) keep their separate `mtc_vel_*` keys/thresholds (0.6–3.0 m/s) per user direction — two threshold/wording groups by flow type (open-channel vs. enclosed/pressure), not one universal set. Manning Trapezoid Channel already had a velocity check from an earlier session; no changes made there this round.

- 0|64|Translation sprint — velocity-check short labels + orifice centroid reword: Launched 26 parallel haiku agents (one per language) to translate the 6 new short velocity-check keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) and reword `or_regime_submerged` from "invert" to "centroid" in all 26 non-English `lib/lang.ec.??.php` files, each referencing that file's existing `or_centroid_elev` translation for term consistency. Also picked up a few pre-existing untranslated keys (`mtc_blodgett_v_bathurst`, `or_shape_circular`/`rectangular`) surfaced in the same payload. Result: `lang_parity_check.php` shows 0 missing keys project-wide; `lang_syntax_validate.php` clean across all 27 files.

- 0|63|CSS standardization for validity/status checks: Added named classes to `engcalcs.css` (`.ec-status-ok/-info/-warn/-bad/-neutral`, `.ec-tip` for hover-help cursor) using the more accessible hex colors (`#267326`, `#c60`, `#c00`) that Rock Chute already used, instead of the plain CSS color keywords (`green`, `darkorange`, `red`) used ad hoc elsewhere. Replaced all `el.style.color = '...'` assignments with `el.classList.add(...)` across `js/orifice.js`, `js/rock-chute.js`, `js/drip-sprinkler.js`, `js/orifice-drain-time.js`, `js/micro-hydro-power.js`, `js/canal-seepage.js`, and the new `EngCalcs.writeVelocityCheck()` helper. Also fixed `engcalcs.css` being served with a hardcoded `?v=2` instead of `filemtime()` cache-busting (matches the existing per-project convention for JS includes) — now `?v=<?=filemtime(...)?>` in `lib/HeadersFooters.lib.php`. SVG-sketch geometry/line-thickness standardization is a larger follow-up not attempted here.

- 0|62|Velocity-check short labels use "High ⚠" / "Low ⚠" (icon carries the warning), not "High !" / "Low !" — dropped the exclamation mark per user feedback to avoid "hype" wording; the ⚠ hover-tip icon already communicates the warning.

- 0|61|Manning Pipe Head Loss HGL₂ NaN fix: `js/manning-pipe-head-loss.js` had `hgl2 = hgl2 - hv` (self-reference before assignment, always NaN). Fixed to `hgl2 = egl2 - hv`, matching Hazen-Williams and Darcy-Weisbach. Also added the missing `hgl1 = egl1 - hv` result (present in the other two calculators but absent here), reusing the shared `hw_hgl_1` label.

- 0|60|Orifice submergence criterion fixed to use centroid, not invert: `js/orifice.js` `submerged` flag compared TWE to `zinv` (pipe invert), which flagged submergence too early — before the downstream water surface had actually risen past the orifice center, understating the free-discharge head. Changed to compare TWE against `centroid`. Updated English `or_regime_submerged` message from "TWE above invert" to "TWE above centroid" to match; the 26 non-English translations of that string still need re-wording (tracked in active roadmap item).

- 0|59|Velocity check messages shortened to OK/High !/Low !: Added `EngCalcs.writeVelocityCheck()` shared helper in `js/Calculators.lib.js` — renders a short status plus a hover-tip warning icon (⚠, `title` attribute) carrying the full explanation, replacing long inline sentences in Manning Trapezoid, Manning Irregular, and Micro-Hydro Power velocity-check cells. Added 6 new short-form lang keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) to English; non-English translation still needed (tracked in active roadmap item).

- 0|58|Wire glossary into CLAUDE.md agent translation sprint: Translation Sprints section updated with pre-sprint step to verify glossary.json preferred-translation coverage for the calculator prefix's key terms, and launch instructions specifying that each agent receives embedded glossary terms, intent notes, and all translation rules. Glossary at v1.2 covers all 26 non-English languages across all calculator prefixes.

- 0|57|ec_lang_intent workflow audit and Spanish Robinson fix: Spanish Robinson translations verified correct — `bajante de rocado` / `escollera` / `pendiente pronunciada` properly convey the steep-channel context (not generic "canal"). Parallel-agent sprint workflow (one agent per language) established as the standard approach. Glossary injection + intent guard provide the quality layer for future sprints.

- 0|56|Audit remaining English strings in other languages: Parity checker run across all 26 non-English lang files confirms 0 missing keys in every language. English-equal strings (~23–55 per language) are overwhelmingly unit symbols (u_ft, u_m, u_kw, etc.) and technical abbreviations that correctly remain as international English. No untranslated calculator content found. Discovered two orphaned rrc_ keys present in all 26 non-English files — see active cleanup task.

- 0|55|HTML-entity audit script + bulk fix: `dev/scripts/html_entity_audit.php` scans all lang files for HTML entities (`&mdash;`, `&ge;`, `&amp;`, `&nu;`, etc.) that double-encode through `htmlspecialchars()` into JS `pageConfig`. Supports `--lang`, `--prefix`, `--fix` (replace in-place), and `--strict` (exit 1 for CI). On first run with `--fix`, replaced 2201 entity occurrences across all 26 non-English lang files with plain Unicode characters. English file was already clean; all non-English files now match that standard. Run without `--fix` to audit future regressions.

- 0|54|Hard-coded velocity units in Micro-Hydro messages/footnote: Updated velocity check output to unitless wording ("Velocity very low", "Velocity very high", "Velocity reasonable") and replaced the velocity note text with unitless guidance tied to available drop, losses, and water-hammer risk.

- 0|53|Propagate corrected `rc_notes_4_def` link to all translations: Replaced the old DOI URL with `https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf` in all 27 `lib/lang.ec.??.php` files.

- 0|52|Add velocity checks to Manning trapezoid and irregular calculators: Added `v_check` result to both calculators with warning messaging when velocity is high, and added the requested design note about high specific energy and potential expansion/obstruction losses.

- 0|51|ec_lang_intent guard: `$ec_lang_intent` is now explicitly off-limits to AI in both `CLAUDE.md` and `.github/copilot-instructions.md`. Both files state that AI must not add, change, or remove any `$ec_lang_intent` value without explicit written permission from the human in that conversation.

- 0|50|Math/logic review of all 14 calculators: Full review completed; findings written to `dev/ai-report.md`. One confirmed bug (Manning Pipe Head Loss HGL₂ always NaN — `hgl2` referenced before assignment), one medium logic concern (Orifice submergence criterion overestimates flow when TWE between invert and centroid), one design risk (Weir Flow Simple missing unit guidance for Cw), one cosmetic misspelling (Hagen-"Pouseuille" in DW). All core hydraulic formulas in the other 12 calculators verified correct.

- 0|49|"More" dropdown: About link moved under a "More ▾" dropdown (`menu_more` key, translated into all 27 languages). Follows web convention (Twitter, LinkedIn); "Help → About" is desktop-app convention. Dropdown uses `dropdown-menu-end` so it aligns to the right edge on small screens. Ready for Install/Subscribe/Contact items as those pages are built.

- 0|48|Encoding — kinematic viscosity tooltip raw codes: `&sup6;` is not a valid HTML5 named entity; it displayed literally in Bootstrap tooltips across all 27 lang files. Fixed `dw_kinematic_viscosity` and `ps_nu` title attributes to use UTF-8 characters (×, ⁻, ⁶, ², °) instead of HTML entities. Also corrected Ukrainian file which had `&#8308;` (superscript 4) instead of ⁶ and ². Prevention: use literal UTF-8 chars in all lang `title` attributes; the planned HTML-entity audit script (priority 25) will catch any recurrence.

- 0|47|Standalone engcalcs: Decoupled engcalcs from hawsedc.com via optional parent hooks. `hawsedc/engcalcs-parent-hooks.php` defines `engcalcsParentCSS()` and `engcalcsParentMenu()`; `engcalcs/lib/base.inc.php` loads this file if present; `HeadersFooters.lib.php` calls hooks conditionally. `hawsedc/index.php` now uses new standalone `hawsedc/hawsedc.lib.php` — no engcalcs bootstrap required. Fixed info-disclosure bug (BASE_DIRECTORY was echoed into public HTML).

- 0|46|New-calculator scaffold script: Added `scripts/new_calculator_scaffold.php`. Given `--prefix` and `--keys`, it appends missing stub entries across all 27 `lib/lang.ec.??.php` files and creates a calculator skeleton page + JS file using repo conventions (`echoHeader`/`echoCalculatorForm`/`echoFeedback`/`echoFooter`, JS include with `filemtime()`).

- 0|45|Translation completion matrix: Added `scripts/translation_completion_matrix.php` to report untranslated-key counts with languages as rows and key prefixes as columns. Supports `--lang`, `--prefix`, and `--format=table|csv` for sprint prioritization.

- 0|44|Zero-API translation runner (default): Added `scripts/translate_zero_api.php` to orchestrate default non-API translation workflow with deterministic phases (`scan` and `validate`) using payload generation, parity checks, syntax validation, and completion matrix reporting. `scripts/translate.php` remains optional paid path and now labels itself as non-default.

- 0|43|Engineering glossary integration: `scripts/glossary.json` is now wired into both `scripts/generate_translation_payloads.php` (prefix-scoped glossary context and preferred-term payload fields) and API prompt construction in `scripts/translate_prompt.php` (preferred term map, translation notes, and neighboring translated key context injection).

- 0|42|Translation payload generator (per-lang JSON): `scripts/generate_translation_payloads.php` now reads English plus each target lang file, emits only missing/untranslated keys, and includes neighboring translated context per key for register consistency (`key_context`). Supports `--prefix` and `--lang` filters and keeps backward compatibility with existing payload consumers via `keys` aliasing `keys_to_translate`.

- 0|41|Lang-key parity checker: Implemented `scripts/lang_parity_check.php`. Compares each `lib/lang.ec.??.php` against `lib/lang.ec.en.php`, reports missing keys, extra keys, and keys still equal to English. Supports `--lang`, `--prefix`, and `--strict` for sprint briefs and completion checks.

- 0|40|Lang-file syntax validator: Implemented `scripts/lang_syntax_validate.php`. Runs `php -l` per lang file and reports file:line findings for syntax errors, premature `?>`/out-of-scope declarations, and duplicate keys. Supports `--lang` scoping for surgical checks.

- 0|39|Save/share named calculations: URL-based Option B implemented. "Label:" field (50 chars, letters/digits/spaces/–_.) in h1 flex row on all calculator pages. On every calculation, history.replaceState encodes all form inputs + label as GET params. Loading a labelled URL pre-fills the form and restores the label. &lt;title&gt; reflects label. Client-side validation: hint text turns red on invalid chars, strips on blur. Label field suppressed on non-calculator pages. ec_name_* keys added to all 27 lang files.

- 0|38|Canal seepage expansion: Canal-Seepage.php expanded with lining payback outputs (annual value lost/recovered, total lining cost, simple payback period). Blank defaults for optional payback inputs. Separator "/" rendered between input element and unit selector via new 'separator' key in echoCalculatorForm. "per" replaced with "/" in all 27 lang files for "Value of water (currency / unit volume)" and "Lining cost (currency / unit area)".

- 0|37|Progressive Web App (PWA): Implemented. manifest.json, sw.js, and icons/icon.svg added. Service worker pre-caches all 16 calculator pages + all JS/CSS assets + Bootstrap CDN files on install. Strategy: cache-first for static assets, network-first (falling back to cache) for PHP pages. Language cookies work normally when online; offline serves the cached version in whatever language was current at install time. SW registration injected into echoHTMLHead() via HeadersFooters.lib.php. Theme color #1a6faf.

- 0|36|Text-only mode: Evaluated and closed. The PWA pre-caches all assets on install, making text-only redundant for returning visitors — the primary global south use case. A parallel rendering path would add significant maintenance burden for a narrow first-load benefit.

- 0|35|Redundant phrases: Evaluated and closed. The only truly identical long passage across all 27 lang files is the USBR/FAO citation in cs_notes_4_def — a proper-noun citation that doesn't translate. Adding a PHP shared-constant system for one string costs more than it saves.

- 0|34|Language button: replaced translated "Language" text with a globe emoji (🌐) — universally recognized, no translation needed, no flags (flags conflate language with country per W3C i18n). Screen-reader text "Language" retained via visually-hidden span.

- 0|33|Drip-Sprinkler: DU quality check renders as "Good &mdash; DU &ge; 80% ✓" — fixed. HTML entities in ds_du_* lang keys were double-encoded through htmlspecialchars() into JS. Replaced with Unicode (— ≥ <) in all 27 lang files.

- 0|32|Translation sprint — three pages: Drip-Sprinkler.php (ds_* keys), Irrigation.php (body prose and card descriptions), and About.php (body prose). Decision: keep all three pages; translate all 26 non-English lang files before next deployment.

- 0|31|Contextual hover tips: all javascript:alert help links replaced with span hover tooltips across all 27 language files. The only occurrences were the 3 mtc_d50_* Manning Trap Channel riprap sizing labels — all now use the Rock Chute pattern (cursor:help, steelblue ?, title attribute).

- 0|30|Robinson Rock Chute: Rock-Chute.php implemented — Robinson, Rice & Kadavy (1998) D50 sizing equations, slope-based equation selection, range checks, layer/crest/apron geometry, SVG sketch, translated into all 27 languages.

- 0|29|Irrigation: Canal-Seepage.php added (prefix cs_). Inflow-outflow method: Q_loss = Q_in − Q_out, conveyance efficiency Ec = Q_out/Q_in. Outputs: loss rate, loss fraction, Ec with Good/Fair/Poor rating (≥80%/60-80%/<60%), daily and annual volume lost. Unit-aware (m³/s, L/s, cfs for flow; m³/ft³/ac-ft for volume). Added card to Irrigation.php landing page and menu entry under Irrigation.

- 0|28|Drip/Sprinkler Application Rate calculator (Drip-Sprinkler.php): inputs are average and minimum emitter flow rate, emitter spacing Se, lateral spacing Sl, emitters per lateral, laterals per zone, and target application depth. Outputs are area per emitter, application (precipitation) rate PR = q/Ae, distribution uniformity DU = qmin/qavg (with color-coded quality check), flow per lateral, zone flow, and runtime for target depth. New units added: lph, gph (flow rates), mmph, inph (precipitation rate). ds_ keys added to all 27 lang files.

- 0|27|Audit existing translations for glossary compliance: built `dev/scripts/glossary_compliance_audit.php`, comparing lang-file strings for the four highest-drift terms (flow, head loss, weir, conveyance efficiency) against glossary.json preferred translations across all 26 non-English files. Most flagged mismatches were false positives from case/declension (e.g. Bulgarian "загуба"/"загуби") rather than real drift. Found and fixed one genuine defect: bg, tr, sr, km, and my each used a different word for "flow" across the mpf_/or_/mhp_ calculators within the same lang file — standardized all three to the glossary-preferred term per language. Also discovered (but did not yet fix — logged as a new task above) that `cs_Ec_target`'s tooltip text is untranslated English in 19 languages.

- 0|26|Translated `cs_Ec_target` (and the sibling `cs_lining_area`, same defect) into all 25 non-English languages: fr/it/km/my/ro/tr had the literal English "Lining target"/"Lining area" strings; 13 more languages (es, fa, he, hi, hr, id, pt, ps, ru, sr, sw, ur, zh) had a translated label but an untranslated English tooltip `title` attribute; bg/cs/bn/ar/am used a fuller inline sentence instead of the short-label-plus-tooltip pattern that the English source and most other languages use — all reworked to match. Existing per-language "conveyance efficiency" (`cs_Ec`) and "lining" (`cs_lining_cost`) vocabulary reused for consistency within each file. Root cause of why this slipped past `generate_translation_payloads.php`'s delta detection: the checker does exact-string equality against English, and these strings differed from English only by HTML entity vs. literal character (`&ndash;`/`–`, `&times;`/`×`) — a normalization gap in that script, logged separately below.

- 0|25|Language quality — structural fixes: he, pt, hr, sr, ro, zh all raised to 0.85–0.9. he: fixed 6 English strings in mtc_ section and mixed-language mphl_hgl_2. sr: fixed 4 Croatian-script strings in irr_/mhp_ sections. All 26 non-English lang files gained about_ keys.

- 0|24|About page (About.php): added to nav menu. Covers global humanitarian open source mission, GNU GPL v3 license, Bitbucket repository link (bitbucket.org/hawstom/engcalcs), contributing (translations, bugs, new calculators, hosting), offline ZIP download (planned/roadmap), and PWA status.

- 0|23|Irrigation landing page (Irrigation.php): added to menu with divider. Links to Weir Flow Simple, Weir Flow Irregular, Orifice Flow, Orifice Drain Time, and Manning channel calculators. Quick-reference section for diversion dams, headgates, pipe turnouts, and USBR Water Measurement Manual alignment. irr_ keys added to all 27 lang files.

- 0|22|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL. Now 27 languages total.

- 0|21|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two.

- 0|20|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here."

- 0|19|Language menu order: Corrected Language.Settings.php order to alphabetical by English name (EU/UN convention). Arabic, Bengali, Bulgarian were out of order.

- 0|18|Language system audit: Fixed all lang file issues. Removed ~30 orphaned legacy keys. Added missing or_velocity to ro and sr. Fixed es.php forward-reference bug. Fixed tr.php premature ?> close tag that dropped 55 mhp_/ps_ keys outside PHP scope; fixed 3 unescaped apostrophes in Turkish Penstock strings. Fixed bg/he mphl_hgl_2 forward reference.

- 0|17|Chinese language code: Renamed internal code cn→zh (ISO 639-1 standard). Added normalizeLang() to Language.lib.php to silently correct legacy ?lang=cn GET params and ec_language=cn cookies to zh.

- 0|16|Micro-Hydro Power calculator: Retitled from Penstock-Design.php to Micro-Hydro-Power.php and migrated fully to mhp_ language keys (old ps_ keys renamed, duplicate old mhp_ block removed). Calculator wraps Darcy-Weisbach friction factor logic with gross head, plant efficiency, and power output. Inputs: Q, H_gross, D, L, roughness e, minor loss km, kinematic viscosity, η. Results: velocity + color-coded velocity check, f, h_f, h_m, h_L, color-coded head loss % check, H_net, power (kW/MW/hp), annual kWh/yr. Dynamic SVG bar sketch.

- 0|15|Add Amharic, Urdu, Swahili, Hindi, Arabic translations — complete translation of all calculators in each language. All registered in Language.Settings.php (QUALITY 0.9). Urdu/Arabic are RTL.

- 0|14|Language-demand logging: logLanguageSelection() added to Language.lib.php; called when a valid ?lang=XX GET parameter is used. Log path: /var/www/cnm/logs/engcalcs-lang.log. Format: tab-separated UTC-timestamp, lang-code, page-basename.

- 0|13|Solver (y/d₀ given Q) for Manning Pipe Flow: bisection solver added to js/manning-pipe-flow.js. Bisects y/d₀ on [0.0001, 0.9376] (Manning Q peaks at 93.8% full for circular pipes), sets the y/d₀ input and reruns the calculator.

- 0|12|Orifice Drain Time calculator: Orifice-Drain-Time.php with conic volume method. Inputs: starting/ending/orifice elevations, starting-pond area A1, orifice-level area A0, orifice shape/size, Cd. Outputs: interpolated ending area A2, drain time. Equation derivation reference page (MathML) at Orifice-Drain-Time-Ref.php. SVG sketch. Polished: H1, Qmax, Drained Volume outputs added; h2 ≥ D/2 validation.

- 0|11|SVG sketches: Added to Orifice Drain Time (WSE, wall, H₁, D annotations), Weir-Irregular (crest profile as gray filled polygon with HWE line). Manning.lib.js extracted for shared sketch reuse.

- 0|10|Bootstrap 5.3.2 migration and jQuery removal. All pages converted to Bootstrap 5 utility classes; $() calls eliminated. (commit 92f38da)

- 0|9|Extracted per-calculator JavaScript into separate files under js/calculators/. (commit 76d6255)

- 0|8|Added CLAUDE.md architecture and developer guide. Added php -l pre-commit hook. Priority 1 security fixes: XSS output escaping, language parameter validation, cookie Secure/HttpOnly flags, ENV-based DEBUG_MODE, removed test/debug files.

- 0|7|Translations (multi-lingual): Evaluated cost/value of having a languages system in the post-2025 (AI) age. Decision: keep the system — engineering terminology mistranslates poorly in browser auto-translation. Improved fr (complete rewrite), bg (dw/hw/mi/wi sections added), tr (dw/hw/mi added).

- 0|6|Orifice calculator phase 1: Orifice.php created with circular/rectangular shape selector, unit-aware inputs (D, W, invert elevation, HWE, Cd), results (centroid, h, area, Q, v, regime check), SVG profile sketch, and notes.

- 0|5|Touch tooltips: Bootstrap Tooltip initialized on all `[title][style*="cursor:help"]` spans via DOMContentLoaded in Calculators.lib.js (`trigger: 'hover focus click'`). Tappable on mobile. `?` span added after Save label in navbar for the `ec_name_hint` text.

- 0|4|PWA on mobile: PNG icons (192×192, 512×512) generated and added to manifest.json. Apple meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.) added to `<head>` via HeadersFooters.lib.php. SW cache bumped to v2. iOS requires manual "Add to Home Screen" from Safari share menu — `beforeinstallprompt` does not fire on iOS by design.

- 0|3|Layout overflow: Wrapped `<table class="bare">` in `<div style="overflow-x:auto">` in `echoCalculatorForm()`. On narrow screens the table scrolls horizontally within the page rather than overflowing past the edge.

- 0|2|PWA evangelism: "⬇ Install" button added to navbar (before Save field), hidden by default. Shown only when `beforeinstallprompt` fires (Android Chrome); hidden again on `appinstalled`. `EngCalcs.installPWA()` triggers the native install prompt. iOS users see no button (iOS does not fire `beforeinstallprompt`).

- 0|1|Roadmap reorganized: grouped by theme, priorities differentiated so ties are intentional, descriptions tightened. Completed items moved to ## Completed section per instructions.
