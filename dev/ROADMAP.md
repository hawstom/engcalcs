# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: `Priority|ID|status Description`. Priority: 0 means "Completed" and 100 means top priority; ties (same priority for multiple tasks) are okay; any whole number 0-100 can be used; priority is mutable and gets reused across tasks, and always drops to 0 on completion. ID is a permanent, ordinal task number — never reused, never changed, unrelated to priority — used whenever a task needs to be referenced by number (in another task's text, in a commit message, in `dev/` docs). Refer to a task in prose as "Task N".

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

# Tasks

## Calculator Improvements

- 80|99|Bug (pre-existing, ~2021): `Manning-Irregular.php` velocity unit selects (`echoUnitSelect($name='v617u', ...)`, two occurrences around line 93) offer `mph` as a velocity unit choice, but `$ec_units['mph']` and `$ec_lang['u_mph']` don't exist (`lib/Units.lib.php` only defines `mps`/`ftps` for velocity). Produces PHP warnings and an empty/broken option in the unit dropdown. Fix: either add a proper `mph` conversion factor + label, or (more likely correct, since mph is unusual for open-channel velocities) drop `mph` from the Array and use `mps`/`ftps` only, matching every other velocity selector in the suite.

## Translation Standardization (Glossary Project)

- 75|97|[H] **tr riprap term inconsistency, found during the Task 93 glossary sweep (2026-07-13),
  not fixed this pass.** `lib/lang.ec.tr.php` uses two different words for the same riprap concept:
  `mtc_bend_angle` (category 1, older) says "taş dolgu"; all 4 riprap mentions in `rc_` (category 5,
  Rock Chute, newer) say "parça taşı" instead. `glossary.json`'s tr riprap entry already said "taş
  dolgu" — matching the older mtc_ term — before this pass, so the rock-chute translation agent
  diverged from both the glossary and the established suite term, unlike the it/pt/ru/tr-penstock
  cases in this same sweep where the glossary was what was stale. Needs a human call before editing:
  is "parça taşı" actually a legitimate riprap synonym Turkish speakers would accept swapped for "taş
  dolgu" in the 4 rc_ sentences (grammatical agreement/suffixes may differ), or should "taş dolgu" be
  substituted in? Left untouched pending that judgment call rather than a blind find-replace on
  shipped translated text.

## Translation improvements

The rules, sequence, and QA chain for translation work are **not** restated here. They live in:
- **`dev/translation-process.md`** — the SOP: the three scenarios, THE SEQUENCING RULE, the QA chain.
- **`CLAUDE.md` § "Translation Sprints"** — sprint mechanics, model policy, pre/post-sprint checklist.
- **`dev/translation-execution-log.md`** — the full dated, category-by-category execution record.

- 19|96|[H] Bulgarian scope question for the native engineer (dev/Bulgarian-engineer-feedback.md):
  (3) Invite review of the freshly rewritten bg ip_ notes/tooltips and of Bulgarian
  menu-title casing (their corrections use sentence case; many bg titles are Title Case).
  Priority dropped 80→30 now that (1) and (2), the substantive terminology questions, are closed —
  only the review-solicitation thread (3) remains.
  - **(2) CLOSED 2026-07-13:** engineer's 2026-07-06 answer — "Коефициент на градация (SD) =
    D₈₄.₁ / D₅₀" — is the standard term, superseding both candidates originally asked about
    (`едрозърнестост` and `разнозърненост`). Applied to `rc_SD`/`rc_SD_check` in
    `lib/lang.ec.bg.php` and recorded in `glossary.json`'s `gradation` entry; no longer an open
    question.
  - **(1) CLOSED 2026-07-13 — decided and executed.** Tom: "I would put водно количество
    everywhere." Suite-wide, all bg calculator categories (pipes/irrigation included, not just
    open-channel/hydraulic-structure). Every `дебит` occurrence in `lib/lang.ec.bg.php` (35 across
    dw_/hw_/mpf_/mphl_/mi_/mtc_/ws_/wi_/or_/odt_/irr_/mhp_/cs_/ip_) replaced with `водно количество`,
    with grammatical gender agreement fixed throughout (дебит is masculine, водно количество is
    neuter — adjective/article/pronoun endings adjusted on every occurrence, e.g. `пълен дебит`→
    `пълно водно количество`, `техният дебит`→`тяхното водно количество`). `glossary.json`'s `flow`
    entry bg value updated to `водно количество` and `translation_notes` updated to record the
    resolution (version 1.6→1.7). `php -l` and `lang_syntax_validate.php --lang=bg` both clean.
  - **(3) still open:** no review has been sent or received on the bg ip_ notes/tooltips or
    menu-title casing. Per the Task 90 precedent (native review is only real once feedback
    actually lands — see CLAUDE.md's "Translation Sprints" section), don't log this as "awaiting
    review" indefinitely — either send it to the engineer as a concrete, bounded ask, or close it
    via our own best-effort sentence-case sweep if no review is realistically coming. Feedback 2026-07-13 from bg engineer: In the language menu, maybe you can make Български with a capital Б, I guess it could bother someone it's the only language with a small letter. In the dw calculator, the label for e is more verbose than English; is this a problem in many languages? Дължина на провеждащия тръбопровод или улей

- 18|100|[H] **`Install.php` localization (split from Task 95, 2026-07-13).** `Install.php` (66
  lines, PWA install instructions) is 100% hardcoded English body text, outside `$ec_lang` entirely
  — unlike `About.php`'s `$ec_lang['about_body_html']` pattern. Scope, per Tom 2026-07-13: it must
  be translated (it's the only working install path on iOS Safari and Firefox, where the in-app
  `⬇ Install` button silently does nothing — see Task 95 resolution #1). Sequence, Task-87-style:
  (1) **Wave 0 first** — tighten and clarify the English body for concision before any translation
  work starts, same discipline as Task 87's English-reform pass; this is a much smaller page than
  Task 87's full-suite sweep, so likely doesn't need Opus, but re-evaluate if the pass turns out to
  be nontrivial. (2) Restructure the body into `$ec_lang['install_body_html']` (or a small set of
  section keys if a single blob is awkward — e.g. separate Android/iOS/Desktop/Firefox sections),
  following `About.php`'s convention. (3) Run through the normal translation-sprint pipeline
  (`dev/translation-process.md`) once the English is settled. Not yet scoped: whether this earns a
  standalone sprint or rides along with an upcoming category's wave.

- 24|98|English improvements: 
1. Change 
"Do you have a great vision for a calculator to add here? Can you help me improve translations, program, or host these calculators?"
to
"Do you have great ideas for expanding or improving these calculators or their translations?
2. Change
"Please give us your valued words of suggestion or praise."
to
"Please share your valued words of suggestion or praise."
3. Change (in mphl, hw, and dw and wherever used, hopefully a single re-used key)
"Average shear stress (tractive force), τ"
to
"Average shear stress, τ". Add to _intent Parallel or tangential tractive force per unit area on the bottom or bed of the cross section.
4. Clarify in _intent and in glossary that for rc_ "Rock specific gravity, sg ?", the more standard term is "Relative density of rock".
10. Propagate these changes to all languages with discretion, or in other words, improve all languages if appropriate in light of these changes. Probably an Opus task.

## AI Efficiency Scripting (Overhead)

These tasks reduce the AI token cost of routine maintenance by replacing repeated AI judgment with deterministic scripts. Copilot owns execution (all tagged `[CP]`); Claude Code specs any script whose output feeds back into translation quality work.

## CSS Standardization Follow-up

## Low Priority / Nice-to-Have

## Completed

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
