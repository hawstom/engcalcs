# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: Priority/status|Description. 0 means "Completed" and 100 means top priority. Ties (same priority for multiple tasks) are okay. Any whole number 0-100 can be used. Tasks are sorted highest priority first; move completed tasks to the ## Completed section.

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

# Tasks

## Calculator Improvements

- 20|Bug (pre-existing, ~2021): `Manning-Irregular.php` velocity unit selects (`echoUnitSelect($name='v617u', ...)`, two occurrences around line 93) offer `mph` as a velocity unit choice, but `$ec_units['mph']` and `$ec_lang['u_mph']` don't exist (`lib/Units.lib.php` only defines `mps`/`ftps` for velocity). Produces PHP warnings and an empty/broken option in the unit dropdown. Fix: either add a proper `mph` conversion factor + label, or (more likely correct, since mph is unusual for open-channel velocities) drop `mph` from the Array and use `mps`/`ftps` only, matching every other velocity selector in the suite.

## Translation Standardization (Glossary Project)

- 40|[H] Suite-wide Pashto (ps) **and Urdu (ur)** false-cognate: "shear" is rendered as `قیچي`/`قینچی`
  (both literally "scissors" — cognate words) in both `mi_tau` (category 1) and `mpf_shear_stress`
  (category 3), found by the category-1 wave-3 (ps) and retroactive wave-2 QA (ur) agents 2026-07-08.
  Not fixed in category 1 alone — it's the established term across categories in both languages, so a
  category-1-only fix would create suite-wide inconsistency; needs a correct replacement term decided
  once per language and applied everywhere `قیچي`/`قینچی` is used for "shear," not per-category.

- 45|[CC] Suite-wide baked-in verdict-glyph defect class: legacy translations across multiple
  categories manually baked ✓/⚠ glyphs, translated "Warning:"-style prefixes, and inline explanatory
  text into verdict strings, contradicting the actual convention (`js/Calculators.lib.js`'s
  `writeCheckHTML()` injects the glyph programmatically; English source strings never contain one).
  Confirmed and fixed in all 7 category-2 wave-2 languages 2026-07-08 (`or_regime_*`/`odt_h2_*`); the
  zh agent also found it in category 5's `mhp_hl_ok`/`rc_sg_ok`. Category 1's `mtc_vel_*`/wave-1
  languages haven't had this specific check run — do a mechanical suite-wide grep for baked-in ✓/⚠/
  translated-"Warning:" text in verdict-string keys across all categories/languages before assuming
  any already-closed category is clean of this pattern, rather than waiting to rediscover it
  category by category.

## Translation improvements

> **SEQUENCING RULE (authoritative — Tom's approved recap, 2026-07-07; read this before touching item 85 or Wave 0):**
> The Wave 0 restructure does NOT supersede the category-by-category wave/tier stepping plan; it
> merely puts Wave 0 **external to** (before) that plan. Item 90 was about key consolidation only —
> it neither finished Wave 0 nor froze English.
>
> - **Wave 0 (external, up front, all calculators):** Fable checks the English on ALL calculator
>   categories for lazy wording that is hard to translate — colloquialisms, jargon, compressions —
>   and reforms it into easily-translatable English. Runs to completion before wave 1 starts on
>   ANY category (including category 1, whose own Wave 0 is already done). No interleaving of
>   "Wave 0 category N → wave 1 category N". **English is NOT frozen after Wave 0.**
> - **Waves 1+ (category by category):** do ALL waves for each category before proceeding to the
>   next category. (Tom, 2026-07-07: "I don't know whether this was a good plan, but it's our plan
>   unless somebody screams against it.")
> - **Wave 1 (within a category):** translate the category into the tier-1 anchor languages.
>   Feed back to English: where wording is still untranslatable, revise the English with human
>   advice (re-translate the changed keys).
> - **Waves 2+ (within a category):** **English is now frozen** for that category. Translate the
>   category wave by wave, tier by tier, using all our tools, processes, and checks (glossary,
>   intents, payload freshness gate, lang_syntax_validate, tag parity, backtranslate_check,
>   native-review flags).
>
> Status: **Wave 0 COMPLETE 2026-07-07 for all 6 calculator categories + rc_/ip_** (see
> `dev/english-review-wave0.md` "Implementation status" + "Closeout"). Both discussion items
> resolved (cs_Ec = conveyance label + conservation intent, both-registers; crown =
> definition-first glossary entry), the D1 `mtc_vel_high`→`mhp_vel_high` merge executed, and the
> stacked-negatives pass applied (Tom's standing directive: watch for negatives in every future
> linguistic pass). QA clean, payloads FRESH. **Wave 1 (item 85, category 1 anchors) is
> unblocked** — sprint launch still requires explicit authorization per CLAUDE.md.
>
> **CONFIRMED 2026-07-07 (Tom): "complete re-translation" means all 53 current `mtc_`/`mi_` keys,
> not just the unfilled delta.** A pre-launch payload check found category 1's anchor languages
> already carry translations for all but ~17 key-instances (4 short labels: `mi_groupPoint`,
> `mi_groupSegment`, `mi_station`, `mtc_blodgett_v_bathurst` — leftover gaps from the item-90 IA
> reorder). That near-complete delta does **not** mean wave 1 is nearly done: per the
> DEPENDENCY/RESTRUCTURE bullet above, wave 1 is a **complete original/comparative re-translation**
> of the full 53-key set per anchor language — the existing strings predate Wave 0's English
> reform and item-90 consolidation and are not assumed correct. Do not shrink the sprint to just
> the delta keys. (Also found and left alone: 6 orphan keys — `mi_notes`, `mtc_vel_check`,
> `mtc_vel_high`, `mtc_vel_high_short`, `mtc_vel_low_short`, `mtc_vel_ok_short` — present in
> translated lang files but no longer in English; candidates for deletion, out of scope for wave 1
> itself.)
>
> **DONE 2026-07-07: wave-1 sprint executed for category 1.** 14 Sonnet agents (one per anchor
> language: es pt fr it de ro ru uk bg sr hr cs tr id), each given the full 53-key `mtc_`/`mi_`
> bundle (English source + existing translation + intent + glossary) and told to re-translate from
> English rather than assume the existing string. Real defects found and fixed suite-wide, not
> just wording polish: dropped `<span class="ec-tip">` tooltips (several langs had silently lost
> the whole tooltip, e.g. `mi_q_617`, `mtc_sgrock`), missing `<sub>` tags (`D<sub>50</sub>`,
> `z<sub>1</sub>`/`z<sub>2</sub>`), stale `style="cursor:help"` markup instead of the current
> `class="ec-tip"` convention, `H<sub>v</sub>`→`h<sub>v</sub>` case fix per the item-90 loss-symbol
> convention, the audit-flagged "irregular channel" wrong-sense fix (ru/uk/sr/hr — temporal or
> "incorrect" reading → geometric cross-section reading), and assorted typos/mixed-script (sr had
> Latin/Cyrillic character mixing). Post-sprint QA: `lang_syntax_validate.php` clean (62 residual
> findings, all `identical-to-english` advisory — legit cognates/proper nouns like `Segment` in
> fr/de/cs/hr/ro and `Blodgett`/`Bathurst` surnames); a from-scratch tag-parity check (English vs.
> translated `<sub>/<sup>/<span>/<a>` tag sets) caught one real miss the Turkish agent's own report
> had claimed fixed but hadn't (`mtc_d50_bottom/in/mra/searcy/z1/z2` — missing `D<sub>50</sub>` and
> an inverted tooltip structure) — corrected by hand, re-verified clean. Payloads regenerated,
> `--check` reports FRESH. **Not run: `backtranslate_check.php`** (needs `ANTHROPIC_API_KEY`, not
> set in this environment) — do this before calling category 1 fully closed if the key becomes
> available. **Lesson: don't trust a translation agent's self-reported "fixed" claim without an
> independent structural check** (tag-parity here) — the agent's own summary can be wrong even when
> `php -l` passes, since lint only catches PHP syntax, not markup/content drift.
>
> **SEQUENCING CORRECTION 2026-07-07 (Tom caught it):** category 2's wave-1 sprint was launched and
> completed before category 1's waves 2-3 — a direct violation of the SEQUENCING RULE box above
> ("do ALL waves for each category before proceeding to the next category"). Category 2 wave-1 work
> is not being discarded (re-translating is expensive and it's not wrong on its own), but no further
> category-2 work (wave 2+) or any category-3 work happens until category 1 is fully closed.
> Corrective launch order: **(1)** resolve the pending English-reform gate below (mi_station/mi_n617
> abbreviations) **(2)** category 1 wave 2 **(3)** category 1 wave 3 **(4)** only then resume
> category 2 at wave 2.
>
> **English-reform gate RESOLVED 2026-07-07 (Tom):** of the 6 flagged abbreviation candidates
> (`mi_station`, `mi_elevation`, `mi_n617`, `mi_tau`, `mi_d50in`, `mi_n`), 4 were already fixed
> during Wave 0; `mi_d50in` turned out to be dead code (unreferenced in any PHP/JS file). The
> remaining 2 (`mi_station`="Sta", `mi_n617`="Comp.<br />n") were checked against the completed
> category-2 wave-1 output rather than assumed problematic: all 14 anchor languages had already
> produced natural short forms with zero translator friction — **kept as-is.** Principle ("verify,
> don't assume, that a compressed column heading resists translation") captured in `CLAUDE.md`'s
> `layout: column heading` tag section.
>
> **DONE 2026-07-07: wave-2 sprint executed for category 1 (mtc_/mi_, 53 keys) into the 7
> major-non-Latin languages: zh ar he hi bn fa ur.** Pre-sprint checklist: payloads FRESH; glossary
> had all category-1 terms populated for these 7 except `irregular channel` (0/7) — this sprint
> established it per language, briefing every agent up front on the Bulgarian-engineer wrong-sense
> trap (temporal "sporadic" / evaluative "incorrect" readings of "irregular") so each proactively
> named the cross-section explicitly rather than using a bare adjective (e.g. zh 不规则断面明渠, ar
> قناة غير منتظمة المقطع, he תעלה בעלת חתך לא סדיר, hi अनियमित-काट नाली, bn অনিয়মিত
> প্রস্থচ্ছেদের চ্যানেল, fa کانال با مقطع نامنظم, ur غیر یکساں مقطع نالہ) — all 7 terms now recorded
> in `glossary.json` (bn's agent added its own inline; the other 6 were transcribed from agent
> reports and added by the launcher afterward). Real defects fixed across every language, not just
> wording: dropped `<span class="ec-tip">` tooltips restored (several langs had silently lost whole
> tooltips, e.g. `mi_q_617`, `mtc_sgrock`); missing `<sub>` tags restored (`z<sub>1</sub>`/
> `z<sub>2</sub>`, `D<sub>50</sub>`); stale `style="cursor:help;..."` markup converted to the current
> `class="ec-tip"` convention; `H<sub>v</sub>`→`h<sub>v</sub>` case fix (velocity head, not a
> loss/total head) in every language that still had it wrong; `mi_n` over-translations (some
> languages had expanded the bare symbol `n` into a descriptive phrase) trimmed back to match the
> reformed English source. **he agent found a real markup-breaking bug** pre-existing in the old he
> file: an unescaped Hebrew abbreviation quote (gershayim) inside a double-quoted HTML `title`
> attribute — fixed. **ar agent found a mistranslation**: `mtc_menu`/`mtc_main_title`/`mtc_main_desc`
> used a word for "retention/detention channel" instead of "trapezoidal channel" — fixed. Post-sprint
> QA: `glossary.json` re-validated as parseable JSON after the bn agent's inline edit and the
> launcher's 6-language addition; `lang_syntax_validate.php` clean (16 findings, all
> `identical-to-english` advisory — `calc_copy_link*` shared UI keys plus 2 pre-existing, genuinely
> out-of-category findings — `mhp_vel_high_short` in bn and `wi_notes_we_def` in fa — from
> categories 5/2, untouched by this sprint, not actionable here); tag-parity check (English vs.
> translated `<sub>/<sup>/<span>/<a>` sets, all 53 keys × 7 languages) clean, zero issues. **Not run:
> `backtranslate_check.php`** (needs `ANTHROPIC_API_KEY`, not set in this environment) — same gap as
> category 1 wave 1 and category 2; run before calling category 1 fully closed if the key becomes
> available. **Remaining for category 1: Wave 3** (am km my ps sw, low-resource, mandatory
> backtranslate_check + native-review flag) before category 1 is fully closed and category 2 wave 2
> can resume.
>
> **POLICY 2026-07-07 (Tom): back-translation QA fallback when `ANTHROPIC_API_KEY` is unavailable.**
> Tom declined to enable pay-as-you-go API billing to unblock `backtranslate_check.php` for wave 3,
> but does **not** waive the mandatory meaning-level check — it must still happen, just by another
> route, and must be applied retroactively, not just going forward. Resolution: `backtranslate_check.php`
> automates a task the orchestrating AI can do directly — read the target-language string, produce an
> independent back-translation to English, and compare it against the source meaning — without calling
> the external API or needing a key. Standing procedure, effective immediately, supersedes the
> "not run, needs `ANTHROPIC_API_KEY`" gap noted for waves 1 and 2 above:
> 1. **Per-string check (mandatory, replaces the scripted call when no key is set):** the orchestrating
>    AI performs its own back-translation + meaning comparison on every sprinted key, inline, right
>    after the translation agents finish — same rigor as the script, no billing.
> 2. **Retroactive enforcement:** waves already closed without this check (category 1 wave 1 — 14
>    anchor languages; category 1 wave 2 — zh/ar/he/hi/bn/fa/ur) get the same per-string check run
>    against their existing output, not just future waves.
> 3. **Additional layer, not a substitute for #1:** once a calculator category's waves are all
>    complete, one holistic review pass across every language in that category, aimed at
>    cross-language *consistency* (same term rendered differently across calculators, register drift,
>    recurring patterns) — a different failure mode than a single mistranslated string, so it
>    complements #1 rather than replacing it.
>    **MODEL CHANGE 2026-07-08 (Tom): use Opus, not Fable, for this pass, going forward for every
>    remaining category.** The category-1 run (below) proved the *task* — holding all 26 languages'
>    53 keys in view at once to catch patterns no single-language reviewer can see — is real and
>    worth doing again. Fable is no longer available to us. Opus is the reasoning-heaviest model this
>    project can call, matching the actual shape of the work (cross-language pattern-matching across
>    ~1,400 short strings, not a linguistic-fluency task Fable specifically brought). Spawn it via the
>    `Agent` tool's `model: "opus"` — note the tool exposes model choice only, not a separate
>    reasoning-effort dial; there is no literal "high effort" knob to set for a subagent in this
>    environment. Compensate for that by front-loading the prompt: name every specific pattern class
>    to hunt for (as the category-1 prompt did) rather than leaving the task open-ended, since a
>    sharper prompt is the only lever available to push a fixed-effort model toward deeper analysis.
> If `ANTHROPIC_API_KEY` becomes available later, the scripted `backtranslate_check.php` may resume
> as the primary per-string method; this fallback stays documented as the procedure for whenever the
> key isn't set, not a one-off improvisation.
>
> **DONE 2026-07-08: wave-3 sprint executed for category 1 (mtc_/mi_, 53 keys) into the 5
> low-resource languages: am km my ps sw.** Pre-sprint checklist: payloads FRESH; intent coverage
> 53/53; glossary coverage 6/7 category terms already populated for all 5 languages, `irregular
> channel` missing for all 5 (same gap wave 2 filled for its 7 languages). 5 Sonnet agents, one per
> language, `run_in_background`. **First launch hit a session-limit API error on all 5 agents before
> any file edit landed** — verified via `git status --short` (zero diff on all 5 target files) before
> relaunching, per the session-limit retry procedure; second launch completed cleanly. Existing
> content in these 5 lang files was legacy (pre-Wave-0/pre-item-90): 28/53 (am), 39/53 (km), 13/53
> (my), 15/53 (ps), 25/53 (sw) keys changed after full re-read against the reformed English source —
> the rest were individually re-verified correct and left alone, not skipped. Real defects fixed
> across every language (not just wording): dropped `<span class="ec-tip">` tooltips restored
> (`mi_q_617`, `mtc_sgrock` — every language had lost these); missing `D<sub>50</sub>` and
> `z<sub>1</sub>/z<sub>2</sub>` subscripts restored; `H<sub>v</sub>`→`h<sub>v</sub>` case fix
> (velocity head, not total head) in every language that still had it wrong; stale
> `style="cursor:help;..."` markup converted to `class="ec-tip"`; assorted false-cognate/garbled-text
> fixes (my: a corrupted unreadable sentence fragment in `mtc_note_1`, "surface" vs. "bottom" shear
> mistranslation in `mi_tau`; sw: a non-existent verb "hucopiwa" and wrong word for "cross-section";
> km: colloquial "messiness" swapped for the established roughness glossary term; am: false-cognate
> "Segment"→"fraction" confusion, "mean" vs. "median" mixup). **`irregular channel` established for
> all 5 languages** and written to `glossary.json` (am ያልተስተካከለ ቅርጽ ቦይ, km ខណ្ឌកាត់មិនទៀងទាត់, my
> မညီမညာ, ps غیریکسانې مقطع, sw mfereji wa mkato usio wa kawaida) — each names the cross-section
> explicitly per the Bulgarian-engineer wrong-sense precedent, though km/my agents independently
> confirmed their base adjective doesn't carry the temporal/evaluative trap the way Slavic languages
> did. **Post-sprint QA:** `lang_syntax_validate.php` clean (14 findings, all advisory
> `identical-to-english` — shared UI keys + 1 proper-noun surname string); **independent tag-parity
> check caught a real miss** the Burmese agent's self-report hadn't flagged — 6 keys
> (`mtc_d50_bottom/in/mra/searcy/z1/z2`) still missing `<sub>` tags and/or still using the stale
> `style="cursor:help"` markup despite being in the agent's "left unchanged, verified correct" list —
> same lesson as wave 1's Turkish miss; corrected by hand, re-verified clean (0 mismatches across all
> 5 languages). **Back-translation fallback (per the policy above) executed by each agent inline** —
> two residual-uncertainty flags for native review: km `mtc_vel_low` (sedimentation phrase, no
> confirmed standard single-word term) and am `mi_tau` (shear-stress rendering not fully confirmed as
> the standard civil-engineering term). Payloads regenerated, `--check` reports FRESH.
> **Glossary correction (ps agent finding, applied):** `Manning roughness`'s `ps` entry was stale
> (`د مانینګ زبریتوب`, zero actual occurrences in the lang file) vs. the term genuinely used 14× across
> `dw_/hw_/mpf_/mhp_/ip_` (`خشونت`) — corrected to `د مانینګ خشونت`.
> **Deferred, cross-cutting (ps agent finding, NOT fixed here per the "defer cross-cutting changes"
> rule):** Pashto `mi_tau` and `mpf_shear_stress` both render "shear" as `قیچي` (literally "scissors"),
> a false-cognate error — but it's already the established suite-wide Pashto term (also used outside
> category 1), so a category-1-only fix would create inconsistency. Needs a dedicated suite-wide item.
> **Native review flag (mandatory): am, km, my, ps, sw all outstanding**, plus the two specific
> residual-uncertainty items above.
>
> **DONE 2026-07-08: retroactive back-translation QA (policy step 2) executed for category 1 waves
> 1 and 2 — 21 languages, 53 keys each, 1,113 strings total.** One review agent per language (Sonnet,
> read-only unless a genuine meaning-level defect was found — explicitly scoped as QA-only, not a
> re-translation, so stylistic rewording was out of bounds). **Wave 1 (14 anchor languages): 19 real
> defects found and fixed** — es 2 (`mi_is_bank` "banco"→"margen", false-cognate for riverbank vs.
> financial bank; a "BB" abbreviation cleanup, see below), de 1 (`mtc_sgrock` "Rohdichte"→"Relative
> Dichte", dimensional-vs-dimensionless specific-gravity false cognate — the project's own glossary
> already warned about this exact trap), it 2 (`mi_tau` dropped "shear" qualifier; `mtc_note_1` "BB"
> abbreviation), uk 1 (`mtc_note_1` "convenient"→"uniform" rock size, an engineering-meaningful
> swap for riprap gradation), ru 2 (`mtc_sgrock` same specific-gravity false cognate as de; `mtc_note_1`
> "BB"), bg 1 (`mtc_note_1` "BB"), cs 2 (`mi_menu`/`mtc_menu` "channel"→wrongly "cross-section",
> inconsistent within the same file), hr 1 (`mi_is_bank` "Brijeg"[hill]→"Obala"[bank], false friend,
> cross-checked against 4 sibling Slavic translations), tr 1 (`mtc_note_2_def` dropped "large"
> elevation-drop magnitude qualifier), sr 1 (`mi_tau` dropped "shear" qualifier). **A systemic pattern
> — "Blodgett–Bathurst" compressed to an undefined Latin "BB" abbreviation in `mtc_note_1` — recurred
> across 3+ agent-caught instances (it/ru/bg) but 6 more languages (es/uk/sr/hr/cs/tr) had the same
> defect without their own agent flagging/fixing it** (es explicitly considered and declined it as
> "stylistic"; uk/hr/cs/tr didn't check it at all) — **caught by an orchestrator-run grep across all
> 14 languages after the individual agent passes**, applied uniformly (spelled out
> "Blodgett–Bathurst"), reinforcing the standing lesson that a subagent's per-language "no defect
> found" self-report needs an independent cross-language consistency check, not just trust. **Wave 2
> (7 major non-Latin languages): 0 defects reported by any of the 7 agents** (zh/ar/he/hi/bn/fa/ur all
> clean) — but the orchestrator's own follow-up check found **1 more real defect in Arabic** (`mi_tau`
> "إجهاد القاع" dropped the "shear" qualifier present in Arabic's own `mpf_shear_stress` — same
> dropped-qualifier pattern as it/sr in wave 1), fixed for internal consistency. Confirmed several
> wave-1/wave-2 native-reviewer-driven fixes are still holding with no regression: Bulgarian's
> "irregular channel" fix, Russian/Ukrainian's "irregular channel" fixes, the Hebrew gershayim/quote
> escaping fix, the Arabic trapezoidal-channel fix, and the Turkish D50-subscript hand-fix from wave 1.
> Also surfaced (documented, not fixed here — see the standalone item above): Urdu shares Pashto's
> "shear"=scissors false-cognate, a suite-wide cross-category issue. **Post-fix QA:**
> `lang_syntax_validate.php` clean across all 21 languages (advisory identical-to-english only);
> independent tag-parity check (all 53 keys × 21 languages) clean, 0 mismatches; `glossary.json`
> deduplicated (a stale duplicate "specific gravity" entry with wrong de/ru weight-word values was
> merged into the correct, audited entry, keeping the documented tr/sr/hr local-practice weight-word
> exception); payloads regenerated, `--check` FRESH. **30 real defects found and fixed in total across
> the whole category-1 retroactive QA pass** (19 wave-1 individual + 6 wave-1 "BB" cross-check + 1
> wave-2 individual [none] + 1 wave-2 orchestrator cross-check + glossary dedup, plus the earlier
> wave-3 tag-parity catch) — this validates the inline-Claude-back-translation fallback procedure as
> a real substitute for the unavailable scripted `backtranslate_check.php`, not a token gesture.
>
> **DONE 2026-07-08: holistic Fable consistency pass (policy step 3) executed across all 26
> non-English languages for category 1's 53 keys** — a single model given the full cross-language
> matrix at once, tasked with finding patterns invisible to any single-language reviewer (each prior
> agent only ever saw its own language). **Confirmed clean:** symbol/case convention (zero stray
> uppercase `H` across all 26×53), and the "irregular channel" geometric sense (holding everywhere,
> including the previously-defective Slavic set). **16 real findings, all fixed same-day:**
> intra-language terminology drift on "composite n" (bg: 3 different words across 4 keys, one an
> abbreviation that doesn't even expand to the term the notes use; uk: same pattern) — harmonized to
> each language's own majority term; gender-agreement drift on "composite n" (es masc./fem. split
> across 4 keys, it same) — harmonized to majority form; **ar and he each split "rock" vs.
> "riprap"/"stone" across the design-input key and its 5 iteration-output siblings** — unified to the
> single correctly-cased term each language already used elsewhere in the same category; **tr's
> cross-reference note named a calculator by a name that doesn't match that calculator's own menu
> entry** — corrected to match; **sw's "ukingo" (bank/edge) was doing double duty for both "channel
> bank" and "rock lining," two distinct concepts colliding on one word** — introduced "kifuniko"
> (covering) for the lining sense, freeing "ukingo" for bank only; **stale English-vintage "radio
> button" wording survived in 7 languages (bg/tr/es/ps/my/ru/uk) after the English source itself
> changed to "option"** — a source-version-skew class of defect no per-language pass could catch,
> fixed in all 7; **the "Blodgett–Bathurst→BB" abbreviation defect (already fixed in it/ru/bg during
> the wave-1 retroactive check) turned out to also affect ps and my** (missed by the wave-3 sprint
> agent and by my own post-wave-1 cross-check, since that only covered wave-1 languages) — fixed in
> both, and combined into the same edit as the radio-button fix where they overlapped; am register
> drift (informal/polite imperative mixing within `mtc_note_1` and between sibling notes) — harmonized
> to polite register; es tú/usted drift on one stray informal imperative — corrected to usted; id's
> "irregular channel" title/desc lacked a cross-section anchor word that 20+ other languages carry —
> added; "station" (chainage) rendered as an everyday bus/train-station word with no surveying sense
> in he/hi/ur/ps/my/am — replaced with surveying-appropriate terms (he פיקטה, hi/ur/ps चेनेज/چینج,
> my/am descriptive distance-point phrasing); es/ur had dropped the "lining" qualifier from
> `mi_d50in`'s rock-size heading — restored (Fable's companion claim that fa/hi/zh were missing
> `<br />` line-wraps on this same key was **not applied** — checked and found backwards: the English
> source itself has no `<br />` in this key, so fa/hi/zh already match it exactly); Bulgarian's
> `mtc_main_title`/`mtc_main_desc`/`mtc_menu` were English-style Title Case while the sibling `mi_`
> calculator's equivalents were natural Bulgarian sentence case — normalized `mtc_` to sentence case
> to match. **Post-fix QA:** `php -l` clean on all 14 touched files; `lang_syntax_validate.php` clean
> (42 findings, all advisory `identical-to-english`); independent tag-parity check re-run across the
> full 26-language × 53-key matrix, 0 mismatches; payloads regenerated, `--check` FRESH.
>
> **Category 1 is now fully closed 2026-07-08** — all three translation waves, the retroactive
> back-translation QA on waves 1–2, and the holistic Fable consistency pass are complete, with every
> fix independently verified (not just agent-self-reported). Outstanding, logged separately, not
> blocking closure: native-review flags for am/km/my/ps/sw (mandatory per tier policy) plus he/hi/ur
> specifically for the new "station" terminology fixes above (best-effort, moderate-to-low confidence
> on my/am/ps in particular); the suite-wide ps/ur "shear"=scissors false-cognate item; the
> `mtc_bend_angle`/Isbash-citation riprap-vs-rock synonym question noted (not fixed) by the hr
> retroactive-QA agent as accepted local practice, left as-is. Category 2 wave 2 may now resume per
> the SEQUENCING CORRECTION above.
>
> **DONE 2026-07-08: three post-closeout corrections (Tom).** (1) **Model policy for future holistic
> consistency passes changed from Fable to Opus** — Fable is no longer available; see the MODEL
> CHANGE note inlined at policy step 3 above. (2) **Two translation lessons baked back into the
> English source** rather than left as scattered per-language fixes: `mi_station`'s `$ec_lang_intent`
> now names the chainage/"Distance" sense explicitly and flags the transit-station wrong-sense trap
> found in he/hi/ur/ps/my/am; `mtc_note_1`'s (previously empty) intent now warns against compressing
> "Blodgett–Bathurst" to an unexplained initialism, since 8+ languages independently made that exact
> mistake. (The "radio button"→"option" lesson from finding F11 above needed no English change — the
> source already said "option"; the translations had just gone stale against it.) (3) **`QUALITY`
> scores in `lib/Language.Settings.php` recalibrated to actually reflect verification depth**, per
> the new standing policy in `CLAUDE.md` § "Translation Sprints" — a native-review flag that never
> touched a real, consequential number (this file drives production Accept-Language negotiation) was
> all cost and no signal. es dropped 0.95→0.85 (glossary's own notes call the pre-2026 Spanish
> baseline non-native/non-engineer — it didn't earn parity with bg's actually-verified 0.95); the
> other 18 wave-1/wave-2 languages set to a uniform 0.85 (real QA, no native human yet); am/km/my/ps/sw
> dropped 0.9→0.65 (least-verified tier, several self-admitted low-confidence fixes landed this
> session). Payloads regenerated after the English edits, `--check` FRESH.
>
> **DONE 2026-07-07: wave-1 sprint executed for category 2 (weirs & orifices: `ws_`/`wi_`/`or_`/
> `odt_`, 75 keys after item-90 consolidation).** Pre-sprint checklist: payloads regenerated,
> `--check` FRESH; glossary already had `weir`/`orifice`/`discharge coefficient`/`headwater
> elevation`/`tailwater elevation` bound and populated for all 14 anchors (weir is WMO-385-cited);
> only `crown` had zero anchor coverage (`pending-wave-1`) — this sprint established it per language.
> 14 Sonnet agents launched (es pt fr it de ro ru uk bg sr hr cs tr id); **first launch hit the
> session limit mid-run** — es/de/fr landed clean (fr 74/75, one key short), the other 11 never
> wrote a file (verified via `git status` before retrying, per the now-documented lesson in
> `dev/translation-process.md`); relaunched only those 11, all landed clean. Real defects fixed
> suite-wide: baked-in checkmark/warning glyphs and translated "Warning:"/"OK:" prefixes stripped
> from verdict strings per the D5 convention (glyph is programmatic; explanation moved to the paired
> `_tip` key — 4 `_tip` keys existed in English but were missing from every non-English file
> pre-sprint and are now populated in all 14); several English-only tooltip `<span title="...">`
> texts translated (pre-reform oversight); symbol-tag fidelity fixes (`ws_weirLength` wrong-case
> `l`->`L`, `ws_weirCoefficient` missing `<sub>w</sub>`) in multiple languages; fr's `odt_h1_elev`/
> `odt_h2_elev` had an invented "WSE" abbreviation and an extra tooltip span not in the English
> source — caught by an independent tag-parity check (not the agent's own report) and hand-fixed.
> **Wrong-sense "irregular" fix propagated proactively**: every Slavic/Balkan agent (ru, uk, bg, sr,
> hr) was briefed on the category-1 Bulgarian-engineer catch up front and rendered `wi_menu`'s
> "irregular" with an explicitly geometric phrase (uneven/variable-depth crest or profile), not a
> temporal/"incorrect" sense word. **Glossary fix**: tr's `headwater elevation`/`tailwater
> elevation` were swapped (`mansap`=downstream not upstream) — caught by the tr agent, corrected in
> `glossary.json` with a dated note so future sprints don't re-inherit the error. **Flagged, not
> acted on** (out of category-2 scope, cross-category consistency call): it agent switched "weir"
> from `sfioratore` to `stramazzo` (checked: consistent with already-reformed `irr_` cross-reference
> text, only one harmless orphan-key holdout); id agent switched `pelimpah` to `bendung ukur`
> (checked: the one remaining `pelimpah` use is a different sense, "natural spillway" — not a real
> clash). Post-sprint QA: `lang_syntax_validate.php` clean (61 findings, all `identical-to-english`
> advisory, all legit cognates — e.g. es/pt `Circular`); tag-parity check (English vs. translated
> `<sub>/<sup>/<span>/<a>` sets, all 75 keys x 14 languages) found and fixed the fr issue above, zero
> remaining. **Not run: `backtranslate_check.php`** (needs `ANTHROPIC_API_KEY`, not set in this
> environment) — same gap as category 1; run before calling category 2 fully closed if the key
> becomes available.
>
> **DONE 2026-07-08: wave-2 sprint executed for category 2 (weirs & orifices, 75 keys) into zh/ar/
> he/hi/bn/fa/ur.** Pre-sprint checklist: payloads FRESH; glossary had 7/8 relevant terms covered,
> `crown` missing for all 7 (established this sprint, recorded). First launch hit a session-limit API
> error on all 7 agents before any edit landed — verified via `git status` scoped to `ws_/wi_/or_/
> odt_` diff lines specifically (not just whole-file diff, since 6 of 7 files already carried
> unrelated category-1 changes from earlier this session) before relaunching; second launch completed
> cleanly. Existing content was legacy, full re-translation per policy: zh 27/75, ar ~55/75, he 75/75
> (all reconfirmed), hi 67/75, bn 34/75, fa 71/75, ur 34/75 keys changed.
> **The single biggest finding: all 7 agents independently found and fixed the same defect class** —
> legacy translations had manually baked in ✓/⚠ glyphs, translated "Warning:"/"تحذير:"/"चेतावनी:"-style
> prefixes, and inline explanatory clauses that duplicate the paired `_tip` key, all contradicting the
> suite's actual convention (the `js/orifice.js`/`Calculators.lib.js` `writeCheckHTML()` function injects
> the glyph programmatically; the English source strings never contain one). The ar and he agents each
> independently traced the JS to confirm this rather than assuming. This is unambiguous evidence the
> defect is systemic pre-existing debt in this category's `or_regime_*`/`odt_h2_*` verdict strings
> across every language, not translator-specific noise — worth a mechanical suite-wide grep-and-check
> before the next category's sprint, since it likely also affects the wave-1 anchors' output that
> hasn't had this specific check run yet. Other real defects (dropped/fabricated tooltip HTML, missing
> `<sub>` tags, wrong symbol case, untranslated `title` attributes, gender-agreement errors in ar,
> the "irregular"-as-temporal-ambiguity trap caught proactively in fa/hi/bn/ur) matched the pattern
> already seen in category 1 — this category's legacy translations were of similar quality/vintage.
> **Crown established for all 7** (zh 孔口顶部, ar تاج, he גג, hi शिखर, bn ক্রাউন, fa تاج, ur تاج) and
> recorded in `glossary.json`. **3 stale glossary entries found and corrected** (ur weir/headwater
> elevation/tailwater elevation/discharge coefficient — glossary values had literally zero occurrences
> in the actual established-usage lang file across 5+ calculators; corrected to match real usage).
> **1 flagged, not corrected — genuine Arabic grammar uncertainty:** the ar agent chose feminine
> adjective agreement for `or_hwe`/`or_twe` ("منسوب المياه العلوية") over the glossary's masculine form
> ("العلوي"), arguing it's more grammatically defensible; this is an idafa-construction agreement call
> a non-native reviewer (human or AI) shouldn't arbitrate — left as the agent set it, flagged for
> native Arabic review rather than guessed at.
> **1 flagged, not corrected — genuine cross-category inconsistency (defer-cross-cutting-changes
> policy):** Hebrew now has three different words for "weir" across the suite — `שפיכון` (this
> sprint's glossary-correct WMO-385 term, `ws_`/`wi_`/`or_`), `מפלי` (category 4's `irr_main_desc`),
> `מעביר` (category 4's `irr_quickref_html`, 4 occurrences) — pre-existing divergence in category 4
> that this sprint's correct choice widens rather than causes; needs a category-4-scoped fix when that
> category gets its own audit, not a category-2 patch.
> **1 flagged, out-of-category (same systemic verdict-glyph defect class, but in a different
> category):** the zh agent found the identical baked-in-glyph pattern in `mhp_hl_ok`/`rc_sg_ok`
> (category 5, micro-hydro) — confirms the systemic-debt hypothesis above, logged as a category-5 item.
> **Post-sprint QA:** `php -l` clean; `lang_syntax_validate.php` clean (15 findings, all advisory
> `identical-to-english`); independent tag-parity check (all 75 keys × 7 languages) — **0 mismatches**,
> a cleaner result than category 1's wave-1 (which had caught a real Turkish miss) and category 1's
> wave-2 (also clean) — consistent with wave 2 generally being the highest-quality tier so far.
> Payloads regenerated, `--check` FRESH.
>
> **Cost/yield data point for Tom's "be scientific about cost" ask (2026-07-08):** unlike category 1
> wave 2 (7 agents, 0 individual defects found, only 1 caught by an orchestrator follow-up check), this
> wave 2 had **very high yield** — every one of the 7 agents found real, independently-confirmed
> defects, plus the tag-parity check came back clean (no orchestrator catch needed this time). Category
> 1 and category 2's wave-2 sprints used an identical process and prompt shape but produced very
> different yield — the difference isn't the QA layer, it's how stale/legacy the pre-existing
> translations were in each category. This suggests the **QA layers themselves aren't the lever to cut
> for cost savings** — the actual cost driver is re-translating already-decent content category by
> category regardless of whether that category needed it. A more targeted future optimization: audit
> a category's existing translation quality *before* committing to a full re-translation wave, and
> scope the wave to what's actually stale.
>
> **DONE 2026-07-08: wave-3 sprint executed for category 2 (weirs & orifices, 75 keys) into am/km/my/
> ps/sw.** Pre-sprint checklist: payloads FRESH; same 4-tip-key gap and missing `crown` term as wave 2.
> Every one of the 5 agents was briefed up front on the wave-2 baked-glyph finding and told to check for
> it specifically — **all 5 confirmed the same defect present in their language too (10/10 languages
> across waves 2+3 now)**, strong confirmation this is genuine pre-existing suite debt, not translator
> noise. Keys changed: sw 60/75, my 33/75, ps 39/75, km 71/75, am 71/75 — this wave's legacy content
> was noticeably more stale than category 1's wave-3 (am/km/my/ps/sw), consistent with the wave-2
> "different categories carry different amounts of debt" finding above. Real defects beyond the glyph
> pattern matched the established shape (dropped/fabricated tooltip HTML, missing `<sub>` tags, wrong
> symbol case, untranslated `title` attributes) plus several genuine mistranslations caught and fixed:
> km "pond"→"school" (សាលា→ស្រះ), km "diameter"→"gap/slot" (ប្រឡោះ→អង្កត់ផ្ចិត), km "head"→"lowland"
> (ទំនាប់→ក្បាលទឹក), my "broad-crested"→"snow-capped" (နှင်းစွပ်→ထိပ်, confusing weir crest with a
> mountain crest), my "orifice area"→"orifice location" (နေရာ→ဧရိယာ), sw "submerged" rendered with a
> non-existent verb "kuzozwa" (→ kuzama), sw "broad-crested"→"broad-branches" (matawi-pana→ukingo
> mpana, confusing weir crest with tree branches — same error class as my's snow-capped mistake, two
> languages independently mistranslating "crested" via its unrelated everyday sense), am "invert"
> garbled to "not-falling-on-top elevation", am headwater/head conflation (the exact trap CLAUDE.md
> warns about). **Crown established for all 5** (am ጫፍ, km កំពូល, my ထိပ်, ps تاج, sw taji) and recorded.
> **4 more stale/wrong glossary entries found and corrected**, verified against actual usage counts
> before changing (not just taken on an agent's word): ps `weir` (glossary said بند/0 occurrences,
> actual established term ویر/26 occurrences — the same pattern as the earlier ur fix, same root cause of a
> glossary entry nobody had checked against real usage); km `discharge coefficient` (glossary literally
> meant "flow stability," a genuine mistranslation, not just a stale synonym — corrected to
> "coefficient of flow"); am `orifice` (glossary had the transliteration ኦሪፊስ, but the descriptive
> native term ቀዳዳ dominates 33:7 in actual usage — updated to match, though the 7 stray instances
> elsewhere in the file are untouched, out of category-2 scope); am `discharge coefficient` (same
> pattern, glossary's loanword form has zero actual occurrences). **Post-sprint QA:** `php -l` clean;
> `lang_syntax_validate.php` clean (14 findings, all advisory); independent tag-parity check across
> all 12 languages (both waves) × 75 keys — **0 mismatches**. Payloads regenerated, `--check` FRESH.
> **Native-review flags:** am/km/my/ps/sw all carry the standing mandatory flag, plus several
> agent-specific residual-uncertainty items this sprint (my's `ws_headWaterHeight` phrasing, km's
> `wi_pondingHeight` and "re-entrant" inlet term, ps's `or_notes_3_def`/`odt_notes_2_def` register,
> sw's tooltip phrasing, am's long formula-narration sentences) — noted here rather than repeated
> individually, all in the "flag for native review, don't guess further" category, not defects.
> **Category 2 wave 1's own retroactive back-translation check has still not been run** (only wave 2
> and wave 3 have now had the full treatment this session) — needed before category 2 can be called
> fully closed, same as category 1's sequencing.
>
> **DONE 2026-07-08: retroactive back-translation QA executed for category 2 wave 1 (14 anchor
> languages, 75 keys each = 1,050 strings).** **Deliberate cost-scoping decision (Tom's "be scientific
> about cost" ask):** wave 2 (7 languages) was NOT given a separate retroactive-check pass — it was
> translated *this same session* with mandatory inline back-translation self-check already built into
> the same agent turn, so a second standalone check on content that just got checked was judged
> near-zero expected yield (mirroring category 1 wave 2's near-zero result); the holistic Opus pass
> covers it instead. Wave 1 (14 anchors), translated in an earlier session before that self-check
> convention existed, got the full retroactive treatment. **Result: 7 real defects found and fixed
> across 6 of 14 languages** (fr 5, uk 1, hr 1; es/pt/it/de/ro/ru/bg/sr/cs/tr/id all clean) — lower
> yield than category 1 wave 1 (19+6 fixes) but far from zero, and **critically: 0 of 14 languages had
> the baked-glyph defect** that was independently found in all 12 wave-2/wave-3 languages. This is a
> real, useful finding, not just a null result: category 2's wave-1 anchor translations were produced
> by a genuinely cleaner process than the legacy content wave-2/wave-3 inherited — the defect isn't
> suite-wide legacy debt, it's specifically confined to whatever earlier bulk-translation pass produced
> the non-Latin/low-resource baseline content. Real defects found: fr had an invented "CSE" abbreviation
> in `odt_h1` mirroring the earlier-caught "WSE" pattern in a different key (same defect class
> recurring), a wrong invert-vs-centroid elevation concept in `odt_a0`, two untranslated time-unit
> labels, and a wrong hydraulic term for "ponding height" (confused with pipe pressurization); uk had
> 4 untranslated time-unit parenthetical labels; hr had translated variable identifiers (`length`,
> `slope`) that its own `$ec_lang_intent` explicitly said must stay literal English symbols — a real
> intent-compliance miss, not a translation-quality issue. **Post-sprint QA:** `php -l` clean;
> `lang_syntax_validate.php` clean (61 findings, all advisory); independent tag-parity check across
> all 26 languages (waves 1+2+3 combined) × 75 keys — **0 mismatches**. Payloads regenerated,
> `--check` FRESH. **Holistic Opus consistency pass launched** (policy step 3, per the Fable→Opus
> model change) across all 26 languages — pending.
>
> **DONE 2026-07-09: holistic Opus consistency pass executed and closed out for category 2.** First
> launch hit a session-limit API error (report-only task, no partial file edits possible, so no
> git-status check needed before relaunch — just waited past the reset and relaunched directly).
> **Result: found real strays the individual "confirmed clean" agent reports had missed** — this is
> the clearest validation yet that the holistic pass earns its keep independent of the per-language
> checks, not a redundant safety net. Confirmed clean: weir/discharge-coefficient/head terminology
> (fully consistent in all 26), symbol case (only one violation, below), the "irregular"
> geometric-vs-temporal trap (clean in all 26, including a `bn` internal wording variance judged
> acceptable — both readings are geometric). **4 real findings, all fixed:**
> 1. **fa/hi/ur still had the baked-glyph defect** — all 3 are in the "12 freshly re-translated"
>    cohort whose own agents each explicitly reported "confirmed absent" for this exact pattern, yet
>    the glyph survived in all 6 verdict keys in all 3 languages. Stripped the leading `✓`/`⚠` +
>    space from all 18 strings. **Lesson: an agent's own "I checked for X and it's not there" claim
>    needs the same independent verification as an "I fixed X" claim** — this project's standing
>    rule was "don't trust a fix claim," this extends it to "don't trust a not-present claim" either.
> 2. **km had `HWE`/`TWE` spelled out in Khmer inside two formula strings** (`or_notes_1_def`,
>    `or_notes_4_def`) while every other km key correctly kept them as literal symbols — an
>    intra-language inconsistency plus a `symbol`-convention violation. Restored literal `HWE`/`TWE`
>    in both.
> 3. **ru/bg had "orifice regime" split into two different qualifiers** across 4 sibling keys
>    (ru: "режим истечения"/outflow-regime vs "режим отверстия"/orifice-regime; bg: "режима на
>    изтичане" vs "режима на отвор") — the same "composite n"-class defect first found in category 1.
>    Standardized both to the orifice-regime form already used in the majority of instances.
> 4. **ur rendered "regime" as "نوع" (type/kind)** throughout, losing the flow-regime sense entirely
>    — the lone outlier among all 26 languages (every other language uses a genuine regime/mode word).
>    Replaced with "حالت" (state/condition), the natural Urdu engineering term for flow regime.
> **Not fixed, correctly identified as non-issues:** the crown-vs-"top" split in ~9 languages traces
> exactly to the English source itself using both words (`or_notes_2_def` says "crown," `odt_h2_*`
> says "top") — every language faithfully mirrors that split, so it's an English-source unification
> question (out of scope here, not a translation bug) if anyone wants one term suite-wide; sw's
> asymmetric headwater/tailwater construction and bn's orifice/hole doublet are low-confidence
> stylistic notes, not defects, and sw is already flagged for native review. **Post-fix QA:** `php -l`
> clean on all 6 touched files; `lang_syntax_validate.php` clean; independent tag-parity re-check
> clean; payloads regenerated, `--check` FRESH.
>
> **Category 2 fully closed 2026-07-09** — all three translation waves, the retroactive
> back-translation QA (wave 1, deliberately cost-scoped per the wave-2 self-check reasoning above),
> and the holistic Opus consistency pass are complete, every fix independently verified. Outstanding,
> logged separately, not blocking closure: native-review flags for am/km/my/ps/sw plus sw's
> asymmetric-construction note above; the suite-wide baked-verdict-glyph item (item 45) now has a
> confirmed category-5 instance (`mhp_hl_ok`/`rc_sg_ok`) still needing its own pass.
>
> **DONE 2026-07-09: `$ec_lang_intent` enrichment for "crown" (Tom's catch, explicit permission
> granted for this specific edit).** Tom noticed a translation agent's own reasoning surface "obvert"
> as a candidate synonym for "crown" — a real, precise civil-engineering term (invert/obvert is the
> standard bottom/top pairing for a pipe or culvert cross-section, and this category already uses
> "invert" in `or_invert`). That synonym was already sitting in `glossary.json`'s `crown` entry
> (`context`: "Synonyms: top, soffit, obvert.") — likely what the agent was reading — but only one
> key (`or_regime_warn_tip`) had a `gloss: crown` intent tag pointing translators there. The other
> three keys that reference the same concept (`or_notes_2_term`, `or_notes_2_def`, `odt_h2_ok`,
> `odt_h2_warn`) had empty intents, so a translator (or future re-translation sprint) working on just
> those wouldn't see the synonym set at all. Added `gloss: crown` to all four. (One self-caught slip
> during this edit: the first `odt_h2_ok` edit dropped the closing `';` mid-edit, briefly breaking
> `lib/lang.ec.en.php`'s syntax — caught immediately by the standard `php -l` check before moving on,
> fixed in the same turn, not left for a later surprise.) Payloads regenerated, `--check` FRESH.
>
> Category 3 (pipe friction: `dw_`/`hw_`/`mpf_`/`mphl_`) may now begin per the SEQUENCING RULE.

> **DONE 2026-07-09: wave-1 sprint executed for category 3 (pipe friction, 59 keys) into all 14
> anchor languages (es pt fr it de ro ru uk bg sr hr cs tr id).** Pre-sprint: English-reform gate
> found the source already clean (suite-wide Wave 0 covered it 2026-07-07); no cross-category key
> duplicates; added a new `shear stress` glossary term bound to `mpf`, pre-briefed with the
> ps/ur "scissors" trap from item 40 so the wave-3 sprint on `mpf_shear_stress` inherits the warning.
> Complete re-translation of all 59 keys per language (not the ~1-key delta each anchor already
> had). **Real defects found and fixed across languages, not just wording**: a broken
> `mpf_friction_slope` tooltip link (`../pressureslope.php` → `../frictionslope.php`, several
> languages had also drifted the symbol to `S₀` instead of `S_f`); dropped/wrong-case subscripts on
> `mpf_flow_area`/`mpf_pipe_area`/`mpf_area_ratio`/`mpf_froude_number` (F→Fr) /`mpf_full_flow*`
> across nearly every language; the item-90 loss-symbol convention (lowercase `h` for loss
> components) not yet applied to `mphl_friction_loss`/`mphl_junction_loss`/`mphl_total_loss` in
> most languages; `&tau;`/`&nu;` entities spelled out as literal words/characters instead of kept
> as HTML entities (fixed post-sprint suite-wide for `&nu;` — see below); missing `dw_roughness_tip`
> key in every anchor language; a hardcoded untranslated English placeholder baked into bg's
> `mphl_hgl_2` instead of the required PHP concatenation pattern; sr's entire `mpf_` block was in
> stray Latin script instead of Cyrillic; tr's `mphl_main_menu`/`mphl_main_title` had been carrying
> over Manning Pipe Flow's text instead of Manning Pipe Head Loss's; pt's `mpf_depth_ratio` and
> es's `mpf_velocity_head` were mistranslated as different concepts entirely (a "used-section
> percentage" and "kinetic energy" respectively) — both corrected to match the English source
> concept. `mpf_shear_stress` checked in every language for the ps/ur scissors trap — confirmed
> clean everywhere (correct mechanical-stress terms used, no cutting-sense mistranslation).
> **Post-sprint QA**: `lang_syntax_validate.php` clean (only advisory `identical-to-english`
> findings, all legitimate cognates — `laminar`/`turbulent`/`Area`); a suite-wide tag-parity script
> (English vs. all 14 langs across the 59 keys, plus `&tau;`/`&nu;` entity-preservation check) found
> 6 languages (it/ro/ru/uk/sr/tr) had left a literal `ν` character instead of `&nu;` in
> `dw_kinematic_viscosity` — fixed mechanically across all 6; also found 6 languages
> (es/pt/it/de/sr/hr) had left that same key's tooltip text ("for clean water at 20°C") untranslated
> in English — translated directly rather than re-running agents, per the SOP's "fix directly, don't
> re-sprint" rule. **Two glossary data-entry errors surfaced independently by translation agents,
> both fixed**: (1) the `head loss` glossary term's ro/tr/id `preferred_translation` fields were
> pressure-loss-sense ("pierdere de presiune"/"basınç kaybı"/"kehilangan tekanan"), directly
> contradicting the entry's own `translation_notes` (which argue for head-framing over
> pressure-framing) — both the ro and tr wave-1 agents independently caught and overrode this;
> corrected the glossary to head-loss-sense to match what both agents actually used. (2) the
> `Manning roughness` glossary term's ru/uk `preferred_translation` used a single-н transliteration
> ("Манинга"/"Манінга") inconsistent with the double-н form used 11+ times elsewhere in both lang
> files predating this sprint — the ru agent flagged it as a likely typo; corrected glossary and the
> one uk occurrence that had used the single-н form. `backtranslate_check.php` (meaning-level check)
> was **not run this session** — no `ANTHROPIC_API_KEY` available in this environment; flagged as an
> outstanding QA step before waves 2-3, not a blocker to recording wave 1 as done. Payloads
> regenerated, `--check` FRESH. **Next**: category 3 wave 2 (zh ar he hi bn fa ur), then wave 3 (am
> km my ps sw — mandatory native-review flag, and must apply the item-40 shear-stress term decision
> for ps/ur specifically).

- 85|[CC] Extend the rc_/ip_ audit treatment to the remaining calculators using the category-grid plan (agreed with Tom 2026-07-06). **Calculator categories (N=6):** (1) open channel: mtc_+mi_ (59 keys — first, because the Bulgarian engineer's "irregular"="нередовен" catch is likely systemic across languages); (2) weirs & orifices: ws_+wi_+or_+odt_ (78); (3) pipe friction: dw_+hw_+mpf_+mphl_ (59); (4) irrigation & seepage: cs_+irr_ (54); (5) micro-hydro: mhp_ (44); (6) shared UI/units: u_+calc_+menu_+points_ incl. the ~121 identical-to-english validator warnings. **Language tiers (M=3), run as sequential waves within each category, not parallel cells:** wave 1 anchors (es pt fr it de ro ru uk bg sr hr cs tr id — cognate language groups let one glossary decision propagate; review side-by-side within Slavic/Romance blocks; **wave 1 is also the English-reform gate (Tom's principle, 2026-07-06): tier-1 translators/reviewers must flag English source strings that resist translation — idioms, stacked modifiers, compressions like "right at"/"draw off"/"Est." — and those grievances are resolved by REWRITING THE ENGLISH (author-reviewable in cognate languages) rather than only patching intents, BEFORE waves 2-3 launch, so all remaining languages inherit the more translatable source**), wave 2 major non-Latin (zh ar he hi bn fa ur), wave 3 low-resource (am km my ps sw — run last against the glossary enriched by waves 1-2; mandatory backtranslate_check + native-review flag). Per category: audit read → mechanical fixes → intents (needs human authorization) → glossary + prefixToTermNames additions → wave-1 sprint → English-reform pass from wave-1 grievances (human approves English edits; re-run wave 1 on changed keys) → waves 2-3 → post-sprint QA chain. Prereq raised by this ordering: implement the per-key English source-hash in payloads so any later English edit re-flags all 26 translations (audit §10.5). ≈10-12 authorization events total; each paid sprint gated on explicit user go-ahead per CLAUDE.md.
  - **CORRECTION 2026-07-07 (Tom, supersedes the paragraph below where they conflict):** the "DEPENDS on a completed, FROZEN English source" framing was a **mistake**. English is NOT frozen after Wave 0, and item 90 neither finishes Wave 0 nor freezes English — **item 90 was about key consolidation only**. Item 85 **starts with** its own Wave 0 pass by Fable across all calculator categories, editing obvious colloquialisms, jargon, and lazy phrases into easily-translatable English. English freezes only after wave 1 (interactive anchors) — see the SEQUENCING RULE box.
  - **DEPENDENCY / RESTRUCTURE 2026-07-07 (Tom + Opus; see CORRECTION above): item 85 no longer owns key consolidation.** The key-consolidation work is pulled *out* of item 85's per-calculator-category loop and done up front as a decoupled prerequisite: **item 90** (full-suite key consolidation, Opus — done). **Wave 0** (colloquialism cleanup, Fable) is item 85's first step, run externally across all categories. After Wave 0, item 85 proceeds **category by category** (all waves for a category before the next category) — a **complete re-translation** of every category (Tom's "be complete" call, 2026-07-07), tier by tier within each, with full QA. See the SEQUENCING RULE box for the authoritative recap. The old per-category "concept-level MERGE" and "English-reform pass from wave-1 grievances / re-run wave 1 on changed keys" steps are **superseded** (residual English grievances that wave-1 still surfaces become small, targeted English edits, not a structural loop). The §10.5 source-hash is deferred to *after* this complete pass. The sub-bullets below are retained as historical rationale; where they say "per category: … Wave 0 …" read Wave 0 as the single up-front English pass, not a per-category step.
  - **STRATEGY CHANGE 2026-07-06 (Tom): promote the English-reform gate to a standalone Wave 0 English review that runs BEFORE any translation wave, across ALL categories including the already-translated ip_/rc_.** Rationale: the existing `$ec_lang_intent` strings are themselves the grievance list — ~11 of 70 non-empty intents exist only to decode Sonnet-authored colloquialisms/calque-traps ("right at the lateral", "textbook low-quarter DU", "draw off", "favorable downhill run"), clustered in ip_/rc_. Fixing the English source once benefits all 26 languages, lets those workaround intents be deleted, and removes the plan's wasteful "re-run wave 1 on changed keys" step. Tom accepted that revising ip_/rc_ English invalidates their existing 26-language translations (audit already rated ip_ quality poor, so re-translation was coming anyway). **Corrected order (per-category framing below is superseded — see the SEQUENCING RULE box above): audit → mechanical → Wave 0 English review, run once across ALL categories (Fable sweep of the 35 long-string `*_notes_*_def`/tooltip keys + harvest of existing colloquialism-explaining intents; human approves each English edit) → only then does wave 1 begin, category by category → waves 2-3.** §10.5 per-key English source-hash still wanted so ip_/rc_ edits re-flag stale translations, but no longer a hard blocker since re-translation is accepted.
    - **Wave 0 operating method (Tom, 2026-07-06):** for each non-empty `$ec_lang_intent`, ask *"How could the English be rewritten so this intent note is no longer needed?"* — then reform the English and DELETE the obsoleted intent. The intent strings are the pre-collected grievance list; an intent that decodes a colloquialism ("right at"=exactly at, "draw off"=withdraw, "textbook"=as in standard texts, "more for"=better suited to) is a bug report against the source, not permanent guidance. Keep only intents that survive perfect English (genuine calque-traps like the "irregular"=cross-section sense).
    - **Refinement (Tom, 2026-07-06): Wave 0 does NOT replace wave 1 as a detector — it pre-filters for it.** The translation act is the truest detector (that's how Fable found the colloquialisms); a monolingual proofread would miss latent problems. So keep the "flag English that resists translation" imperative IN wave 1. Wave 0 (cheap Fable translation-driven sweep) removes the obvious ~80%; wave 1's paid cognate work still surfaces the residual ~20% that only appears in real cross-language translation; only that small residual triggers an English re-edit + targeted wave-1 re-run. For ip_/rc_ specifically the detection already happened — the intents ARE the surfaced grievances — so Wave 0 there is harvesting, not speculation.
    - **Model plan (per feedback_model_switch_reminder):** collaborative English-reform decisions + layout-critical CSS = Opus; the bulk Wave 0 linguistic sweep = Fable (its demonstrated strength; bounded, high-value); paid short-label waves = Sonnet/Haiku per CLAUDE.md. Remind Tom to hand off + clear + switch to Fable at the Wave 0 sweep boundary.
  - **Batch 1 (open channel mtc_+mi_) prep done 2026-07-06 [CC], stopped at the wave-1 authorization gate.** Mechanical state is clean: the only validator class present for mtc_/mi_ is `identical-to-english` (18), and those are legit — pure symbols (`mi_a/rh/t/pw/fr617/…`) plus real cognates (`Point`/`Segment`/`Notes` are actual words in fr/de/cs/hr/ro) plus proper nouns (`mtc_blodgett_v_bathurst` = surnames). No escape/tag/foreign-script bugs. Genuine remaining defect is bn `mtc_vel_high_short`="High" (Latin in a non-Latin lang — wave-2). **Applied:** bg `mi_menu` "Нередовен канал"→"Канал с неправилно сечение по Манинг" (the menu was missed when the Bulgarian engineer corrected the title/desc; removes the exact rejected temporal-sense word). **Glossary v1.3:** added `irregular channel` entry (geometric cross-section sense; translation_notes warns against temporal "нередовен/нерегулярний" and evaluative ru "неправильное русло"), bound it into `mi` and `wi` prefixToTermNames, payloads regenerated (verified bound in payload_uk.json). **Wrong-sense flags for wave-1 cognate review (NOT yet changed in lang files):** ru `Неправильное русло` (reads "incorrect channel"), uk `Нерегулярне русло` (temporal sense), sr/hr `неправилни/nepravilni` (borderline "incorrect"); cs/de are best-in-class (`nepravidelný průřez`/`unregelmäßiges Profil`). **English-reform candidates (mtc_/mi_) for wave-1 grievance pass (need human approval before editing English):** compressed abbreviations/stacked modifiers — `mi_station`="Sta", `mi_elevation`="Elev", `mi_n617`="Comp. n", `mi_tau`="Bot. shear τ", `mi_d50in`="Lining median rock size", `mi_n`="n for seg-ment" (hard hyphenation). **RESOLVED 2026-07-07 (Tom):** 4 of 6 were already fixed during Wave 0 (`mi_elevation`→"Elevation", `mi_tau`→"Bottom shear", `mi_n`→"n"; `mi_d50in` reworded but turns out to be **dead code** — unreferenced in any PHP/JS file, left in place, candidate for deletion later). The remaining 2 (`mi_station`="Sta", `mi_n617`="Comp.<br />n") were checked against actual category-2 wave-1 output rather than assumed: all 14 anchor languages produced natural short forms with zero translator friction — **kept as-is, not a translation obstacle.** Principle captured in `CLAUDE.md`'s `layout: column heading` tag section. Gate closed, no English edit made. **Cross-category carry-over:** bg still has 2 `Нередов*` in `irr_card_weir_irregular_head` and `irr_quickref_html` ("Нередовен Преливник") — engineer rejected this word for weirs too (feedback line 10); left for category 2 (wi_/weirs) / category 4 (irr_). **Next gated actions requiring your go-ahead:** (a) authorize `$ec_lang_intent` additions for the "irregular" sense on mtc_/mi_ keys; (b) authorize the wave-1 paid sprint (14 anchor languages).
  - **Wave 0 English reform + IA reorder applied for mtc_/mi_ (2026-07-06, see dev/english-review-wave0.md).** Section A rewords + approved intents applied; `mi_` results-table `n` column moved Point→Segment (IA fix; `tau` confirmed Point per code), `mi_n`→`n`. Introduced a **reusable versioned cookie-migration mechanism** in `js/Cookies.lib.js` (`cookieFormatVersion` + `v<N>` token + `normalizeCookieValue` + per-page `migrateCookie`); Manning-Irregular is v2. This is the pattern for any future results-table reorder in ip_/wi_ — bump that page's `cookieFormatVersion` and supply a `migrateCookie`. Migration unit-tested; browser-verified good by Tom 2026-07-07 (new layout + legacy saved section both load correctly).
  - **HANDOFF note 2026-07-07 [CC/Opus → Fable] — `$ec_lang_intent` format hardened; ready for Wave 0 categories 2–6.**
    - `Done:` Established the `<intent> | <commentary>` pipe convention (CLAUDE.md "Language Keys") with a tag vocabulary — `layout: column heading`, `avoid: <sense>`, `gloss: <term>`, `symbol` (flag). Generator `collectKeyIntent()` now strips everything from the first `|` before payloads are built. Migrated all `ip_` and `mi_` intents to it: subscript strings → `| symbol`; the tripled `ip_notes_1/2/3_def` and `mi_menu/main_title/main_desc` "irregular" blocks collapsed to `| gloss:` pointers (senses moved into glossary `reach`/`energy grade line`/`irregular channel` entries, which `ip`/`mi` already inject); buried "never X" notes → `| avoid:`. Recorded the bg engineer's `flow` clarification in glossary.json. Added roadmap item 40; logged the engineer response in item 80.
    - `Ready:` Wave 0 English-reform sweep for categories 2–6, per the operating method in the sub-bullets above. Batch-1 (mtc_/mi_) Wave 0 already applied. **This is the sole remaining blocker before wave 1 (item 85) can start on anything, per the SEQUENCING RULE box at the top of this section — wave 1 does not begin on category 1 or any other category until 2–6 are done.**
    - `Next:` (Fable) Tom hands off → `/clear` → switch to Fable pointed at `dev/english-review-wave0.md`. For each non-empty intent ask "how to reword the English so this note is unneeded," reform the English + delete the obsoleted intent; keep only genuine calque-traps. NOTE: commentary tags after the `|` (layout/avoid/gloss/symbol) are STRIPPED reminders, not grievances — do not treat them as English bug reports; the left-of-pipe intent is the only translatable content. Payload regeneration is the launcher's job, not the user's: the sprint launcher runs `generate_translation_payloads.php --check` as a hard gate (exit 1 = stale = regenerate first). This session's edits are already regenerated + fresh.
    - `Blocker:` none. (Batch-1 browser verification by Tom is still open but does not block Wave 0 of other categories.)
    - `Files:` CLAUDE.md, lib/lang.ec.en.php, dev/scripts/generate_translation_payloads.php, dev/scripts/glossary.json, dev/ROADMAP.md.

- 80|[H] Bulgarian scope question for the native engineer (dev/Bulgarian-engineer-feedback.md): (1) should "дебит" become "водно количество" suite-wide (pipes/irrigation too) or only in open-channel/hydraulic-structure contexts? Currently applied only to rc_/or_ strings they corrected. (2) Confirm "коефициент на едрозърнестост" as the standard term for the D84.1/D50 gradation SD (vs "коефициент на разнозърненост"), ideally with a source. (3) Invite review of the freshly rewritten bg ip_ notes/tooltips and of Bulgarian menu-title casing (their corrections use sentence case; many bg titles are Title Case).
  - **RESPONSE received 2026-07-06 (Tom relayed engineer):** On (1) — engineer says *both* дебит and водно количество work: "дебит is a typical colloquial call… regular people and non-hydraulic engineers use it. In university (hydraulic engineering) they used водно количество for Q, never дебит." So водно количество is the academic/hydraulic register, дебит the general register; since both are acceptable, possibly we can use the longer in titles and descriptions and the shorter where we need to conserve width. Recorded verbatim in glossary.json `flow` translation_notes. On (2)/coefficient — engineer: "Коефициент на градация (SD) = D₈₄.₁ / D₅₀".


## AI Efficiency Scripting (Overhead)

These tasks reduce the AI token cost of routine maintenance by replacing repeated AI judgment with deterministic scripts. Copilot owns execution (all tagged `[CP]`); Claude Code specs any script whose output feeds back into translation quality work.

## CSS Standardization Follow-up

- 55|[CC] **Tips standard: blue `?` affordance + whole-label hover/tap target (decided by Tom 2026-07-07).** A tip with no visible marker fails to signal that help exists ("doesn't tickle the user"); a marker you must hit precisely is a poor touch target. Resolution: keep the visible blue `?` as the affordance, but make the **entire label** the hover/tap region. **Non-breaking design:** `.ec-tip` stays exactly as-is (the blue `?` marker: `cursor:help; color:steelblue; font-size:0.9em`); add a wrapper class (e.g. `.ec-help { cursor:help }`) that carries the `title` and wraps the whole label; pattern `<span class="ec-help" title="…">Label <span class="ec-tip">?</span></span>`. Also update the Bootstrap tooltip-init selector to match the wrapper. Scope: ~643 `class="ec-tip"` occurrences across the 27 lang files to migrate (additive, so existing tips keep working during migration) + 1 CSS class + 1 JS selector line. `mi_q_617` (Manning-Irregular composite-flow tip, added 2026-07-07) is the reference instance. Relates to the older tooltip-icon CSS-standardization item (migrating inline `style="cursor:help;color:#06c;…"` spans to `ec-tip`). Do as one mechanical pass, not a translation sprint.

## Low Priority / Nice-to-Have

## Completed

- 0|[CC/H] **DONE 2026-07-07: Concept-level label normalization (design exploration; raised by Tom 2026-07-06).** The original design attempted to economize by using atomized language variables at the *word* level, which made both translation and maintenance hard. Explore revisiting economizing by normalizing at the *concept* level instead: adopt one canonical, reusable label per concept — borrowed from whichever existing calculator has a good set — rather than per-calculator wording. First candidates to review critically: (a) **elevation** — use identical label wording wherever any calculator asks for an elevation, with the tooltip optionally broken into a few per-context variants; (b) **length** — drop the qualifier ("channel"/"reach"/"pipe") from "channel length"/"reach length"/"pipe length" and lean on the page title for disambiguation. Payoff: shrinks the translation surface and eases maintenance across the suite. Do a reuse-candidate audit before committing. Model split: Fable for the cross-calculator language survey; Opus/Tom for the reuse-architecture decision. Priority number provisional.
  - **Fable survey DONE 2026-07-07 → `dev/label-normalization-survey.md`.** Key findings: cross-prefix borrowing already exists (Darcy-Weisbach.php uses mpf_/mphl_/hw_ keys), so the decision is ownership policy, not mechanism; ~18 exact-duplicate keys mergeable with zero wording decisions (incl. the 7-key mtc_/mhp_ velocity-check block); strongest wording cluster is the head-loss triad + minor/junction-loss coefficient across mphl_/mhp_/ip_; candidate (a) elevation supported as shared-bare-key + closed qualified set (Orifice Flow needs 4 distinct elevations on one page, so bare-only is too strong); candidate (b) length supported for mphl_/mhp_ only — keep "Reach length" (cs_) and "Weir length" (ws_) as load-bearing. Survey §6 has the ranked shortlist.
  - **Opus/Tom architecture decision DONE 2026-07-07 → `dev/label-normalization-decision.md`.** Six rulings: **D1** borrow-from-owner, no neutral prefix, **menu order** breaks ties (`mpf_→mphl_→hw_→dw_→mtc_→mi_→rc_→mhp_→or_→odt_→ws_→wi_→cs_→ip_`); **D2** menu order picks the surviving *key*, best cluster wording picks its *value*; **D3** "**Minor (local) loss**" canonical (merges mphl_ "junction loss" + mhp_/ip_ "minor loss"; rename `mphl_total_junction_k`); **D4** lowercase loss symbols `h_f`/`h_m`/`h_L`, coeff `k_m`, capital `H` reserved for total/gross/net head; **D5** verdict strings = leading `✓`/`⚠` glyph (decorative, untranslated) + short text, **whole string is the `ec-tip` tooltip target** (fixes `writeVelocityCheck`'s glyph-only tap target); **D6** merges execute **per category, just before its Wave 0/wave-1** (not one suite pass), so each shrinks the paid sprint that follows. Recorded in glossary.json (v1.4: minor⇄local, lowercase loss symbols) and CLAUDE.md (Concept-level label reuse + Verdict convention subsections). **Execution backlog (8 items, ranked value÷risk)** — see decision doc's "Execution backlog" and §6 of the survey. (Ruling **D6 was REVERSED 2026-07-07** — see next bullet; it originally, wrongly, handed execution to item 85's per-calculator-category loop.)
  - **CORRECTION 2026-07-07 (Tom + Opus) — item 90 REOPENED as a standalone, FULL-SUITE project; ruling D6 REVERSED.** Closing 90 as "decision-only" and routing its merges through item 85's per-calculator-category loop was the mistake that poisoned 85. Key consolidation is inherently cross-cutting: a duplicate label's two halves live in *different* calculator categories, so no per-category view can make the merge/ownership call (proved this session — open-channel's merge candidates were shared with weirs, irrigation, and micro-hydro). **New structure:** item 90 = **one English-only pass over ALL calculators**, executed by **Opus** (context-hot; this is architecture/sequencing, not a linguistic sweep; Fable's survey is already done). It is a prerequisite English-reform step, **decoupled from item 85**; the merge step that had been inserted into item 85's per-category loop is removed. **Corrected end-to-end sequence:** (1) item 90 full-suite key consolidation [Opus, English-only, applies D1–D5 + D7 merge method] **+** Wave 0 colloquialism cleanup for the remaining calculator categories [Fable] → (2) **translation tier/wave 1 (anchors) — INTERACTIVE**; translating into cognates is how we still catch garbage English, so wave 1 may still reform the source → (3) **English then FREEZES for tiers/waves 2+** → complete re-translation of waves 2–3 [major non-Latin → low-resource; full backtranslate + native-review QA] → (4) build the §10.5 per-key English **source-hash LAST** (deferred: with a complete re-translation there is nothing to delta-gate *this* pass; the hash earns its keep only for *future* incremental English edits). Terminology throughout: **"calculator categories"** (the 6 calc groupings; Tom's word, 2026-07-07) vs **"translation tiers/waves"** (language groupings) — never bare "families". The tips standard (blue `?` affordance + whole-label hover/tap target) is split off as its own item under CSS Standardization Follow-up. **Scope reminder (Tom, 2026-07-07): item 90 is NOT finished until the ENTIRE survey (`dev/label-normalization-survey.md`, §1–§6) is addressed** — executed or explicitly dispositioned keep-as-is. Progress is tracked row-by-row in **`dev/label-normalization-tracker.md`** (the completion gate: every row ☑/◇, 5 open wording decisions ruled, QA clean). The exact-duplicate merges (§2) are only the first of ~10 survey areas. **Status:** roadmap decoupled 2026-07-07; tracker built; 5 open wording decisions surfaced (velocity-shorts, elevation owners, roughness-`e`, weir "height"vs"head", S₀↔S_f safety) — resolve those, then execute top-to-bottom on Opus.
  - **DONE 2026-07-07 — full execution complete, every `dev/label-normalization-tracker.md` row ☑/◇.** §1–§3 (ownership policy, ~18 exact-duplicate merges, 8 concept clusters) executed in prior sessions this same day. §4 typography ride-alongs: area symbols standardized to uppercase `A`/`A₀` (owner incumbency over mpf_'s lowercase `a`), `Q₀`/`z₁`/`z₂` given proper `<sub>` subscripts, Froude `F`→`Fr`, `tau`→`&tau;`, `mi_hv617` `H_v`→`h_v` (incl. its `$ec_lang_intent`, Tom-authorized), and all 10 remaining `style="cursor:help;color:#06c;…"` spans (mtc_/rc_) converted to `class="ec-tip"`. §5 verdict convention (D5): new shared `EngCalcs.writeCheckHTML(ok, shortText, tipText)` in `js/Calculators.lib.js`; `writeVelocityCheck` rewritten so the whole string (not just the ⚠ glyph) is the `.ec-tip` tap target. The other 5 ad-hoc verdict groups (`or_regime_*`, `odt_h2_*`, `cs_loss_*`, `mhp_hl_*`, `rc_sg_*`/`rc_SD_*` — the latter rode along, same defect as `rc_sg_*` though not separately listed in the tracker) had their baked-in long strings split into a short label + new English-only `*_tip` key per D7. QA: `php -l` + `node --check` clean on every touched file, `lang_syntax_validate.php` clean, all touched calculator pages render with no fatals via CLI PHP. New `_tip`/split keys show as "missing" in the 26 non-English files — expected propagation worklist for item 85 (D7), not a defect.

- 0|[CC] **DONE 2026-07-07:** Reversed the `dw_roughness` over-consolidation (was item 86). `dw_roughness` restored to `'Roughness, e'` (dw_/mhp_ wide-form labels); new key `ip_roughness`='e' added for Irrigation-Pressure's narrow table column; both keep sharing `dw_roughness_tip`. English-only per item 90 convention (`dev/label-normalization-decision.md`: non-English files aren't touched during consolidation work) — Tom confirmed deferring the 26-language propagation to item 85, or leaving the key empty/English-fallback in the interim is fine. `ip_roughness` doesn't yet exist in the 26 non-English files, so it silently falls back to the English value there (same load order as any other missing key) until propagated.

- 0|TypeScript migration item closed as stale, 2026-07-05 (Human authorization): item was conditional on its own face ("only worthwhile if the project scope grows significantly") and no such growth has occurred — no bundler, no npm dependencies, no build step exist in this codebase today, and adding a `tsc` toolchain would cut against that simplicity for no observed type-safety pain. Closed with no code changes; revisit if the project scope grows enough to justify the tooling.

- 0|Renamed `irr_main_menu` from "Irrigation Flow Measurement" to plain "Irrigation" in all 27 `lib/lang.ec.??.php` files, 2026-07-05: the section now covers pressure/DU (Irrigation Pressure calculator) as well as flow measurement, so the old label undersold the menu's scope. User chose "Irrigation" over the alternative "Irrigation Calculators" when asked. For the 26 non-English files, reused each language's own existing irrigation-root vocabulary already present in the old (longer) translated string rather than running a translation sprint — e.g. Spanish "Medición de Caudal de Riego" → "Riego", Russian "Измерение расхода ирригации" → "Ирригация". No new terms introduced, so no glossary/sprint step needed. `php -l` clean on all 27 files.

- 0|npm/Composer dependency-management task closed as stale, 2026-07-05: investigated before starting (item was reassigned from `[CP]` to `[CC]` this session per Human direction) and found the premise no longer holds — `HeadersFooters.lib.php`/`sw.js` load Bootstrap straight from `cdn.jsdelivr.net`, not a locally vendored copy, and a repo-wide grep found no Composer usage (`vendor/`, PHP library requires) and no locally built/minified JS or CSS. There is currently nothing to manage a dependency manifest for. Closed with no code changes rather than manufacturing an empty `package.json`/`composer.json` — revisit if a real local dependency is introduced later.

- 0|Suite-wide symbol-convention question, resolved 2026-07-05 (split off 2026-07-04 from the Irrigation Pressure H-vs-P item): decision is **keep single-letter symbols on labels as-is** — they aren't decoration, they're the join key between a label and the formula shown right below it (e.g. `mhp_notes_1_def`: "Net head H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>"), and the pattern (H<sub>gross</sub>, Q, k<sub>m</sub>, h<sub>f</sub>, R<sub>h</sub>, P<sub>w</sub>, etc.) is already consistent across mi_/mpf_/mphl_/or_/mhp_/odt_ and more. No suite-wide edit made — status quo confirmed, not changed.

- 0|Fixed bg/es/pt/tr Manning Trapezoidal Channel (`mtc_`) symbol/translation gaps found 2026-07-05: added the missing `b`/`S`/`y`/`D50` symbol suffixes to `mtc_bottom_width`/`mtc_channel_slope`/`mtc_flow_depth`/`mtc_d50_in` in all 4 languages. For bg/tr, `mtc_bend_angle`/`mtc_sgrock` were left as flat untranslated English (bg additionally marked `//No need` in-file) — decided (no explicit `$ec_lang_intent` guidance existed for these, so treated as an ordinary translation gap) to translate both into bg and tr rather than leave them, matching the pattern already used by fr/de/ru for the same keys. `php -l` clean on all 4 files; `lang_parity_check.php --prefix=mtc` shows 0 missing/extra and 0 equal-to-English for bg/tr, and only pre-existing unrelated gaps (`mtc_blodgett_v_bathurst`, `mtc_vel_ok_short`) remain in es/pt.

- 0|Results sharing made opt-in, 2026-07-05: implemented the scope agreed 2026-07-04 (see prior framing above, now folded in here). `EngCalcs.calcAndSave()` (`js/Calculators.lib.js`) no longer calls `updateUrl()` on every form change; a new `EngCalcs.copyLink()` calls it on demand, writing `window.location.href` to the clipboard via `navigator.clipboard.writeText` and flashing the button text to a localized "Copied!" for 1.5s. New `#ec-copy-link-btn` button added next to the existing "Label:" field in `lib/Menus.lib.php` (shared scaffold, all calculator pages) — the `ec_name_hint`/`change` listener's explicit `updateUrl()` call (renaming the saved calc) was left alone since that's already an explicit user action, not automatic churn. New lang keys `calc_copy_link`/`calc_copy_link_done` added to all 27 `lib/lang.ec.??.php` files (English fallback in the 26 non-English files; no translation sprint run yet). Also fixes a real bug this design flaw was causing: `EngCalcs.readCookieAndCalc()` checked `loadFromUrl()` before `cookieToForm()`/`pageCalculatorInitialize()`, and since the URL almost always carried params (from the old automatic `updateUrl()`), it would skip row-table initialization entirely on reload — for calculators with dynamic reach/point tables (Irrigation Pressure, Weir Flow Irregular, Manning Irregular) this meant the table silently ended up with **zero** rows, since rows are only ever created inside those two functions and `CalcsBody` ships empty in the raw HTML. Fixed by always running cookie/default init first, then layering any URL params on top as overrides; `updateUrl()` also now excludes elements inside `#CalcsBody` from the query string, since per-row fields share duplicate `name`s and can't round-trip as flat key=value pairs anyway. Verified via a jsdom + real-cookie-jar harness against the live dev server: reproduced the exact zero-row failure pre-fix, confirmed 3 rows post-fix, and confirmed no regression in normal cookie round-trips (including the user's actual stale cookie value from testing). `php -l` clean on all 27 lang files plus `Menus.lib.php`/`Calculators.lib.js`.

- 0|"Default values" reset button, added 2026-07-04: placed on the same shared row as the unit-set buttons ("Set units:"), so one edit to `lib/Calculators.lib.php`'s `set_units_row` covers all 12 calculators — new `<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">` right after the four unit buttons. Reset mechanism deliberately simple per user direction: `EngCalcs.resetToDefaults()` (`js/Calculators.lib.js`) calls a new `EngCalcs.expireCookie()` (`js/Cookies.lib.js`, mirrors `createCookie()` with a past expiry) then does a plain `window.location.href = window.location.pathname` reload — no bespoke per-calculator JS needed, since the existing cookie-miss path already falls back to each page's own `pageCalculatorInitialize` (`js/Calculators.lib.js:107-113`), which naturally restores dynamic reach/points tables too. New lang key `calc_defaults` ("Default values") added to English, then translated into all 26 non-English `lib/lang.ec.??.php` files via 26 parallel haiku agents (per-language authorization given 2026-07-04). Verified: `php -l` clean on all 27 lang files plus `Calculators.lib.php`; `lang_parity_check.php` shows the `equal_to_english` count dropped by exactly 26 (one per language); rendered a live calculator page (Darcy-Weisbach) via CLI PHP and confirmed the button HTML (`<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">Default values</button>`) renders correctly and wires to the new JS function.

- 0|Irrigation Pressure H-vs-P decision, resolved 2026-07-04, corrected same day: initial pass kept H<sub>supply</sub>/H<sub>design</sub>/H<sub>last</sub> attached to the three pressure labels (`ip_h_supply`, `ip_h_design`, `ip_h_far`) reasoning that H is the suite-wide head symbol — user corrected this: pressure quantities should carry no symbol at all here, not H and not a new P. Removed the `, H<sub>...</sub>` suffix from all three English labels, now plain "Supply pressure" / "Emitter design pressure" / "Last emitter pressure". Scoped narrowly to the three quantities explicitly labeled "pressure" in words — left the reach-table loss quantities (`ip_hv`/`ip_hf`/`ip_hm`/`ip_hl`: velocity head, friction loss, minor loss, total reach loss) untouched, since those are head/loss terms, not pressure values. Internal JS variable names (`h_supply`, `h_design`, `h_far` in `js/irrigation-pressure.js`/`Irrigation-Pressure.php`) left as-is — internal plumbing, not user-facing, out of scope for a display-symbol correction. No non-English files affected (Irrigation Pressure translation sprint hasn't run yet). Verified: `php -l` clean, rendered page confirms all three labels show plain text with no symbol. The broader "are single-letter symbols worth it suite-wide" question was split off as a separate, still-open, non-urgent item.

- 0|Irrigation Pressure calculator (`Irrigation-Pressure.php`, prefix `ip_`) — English-only build of the distributary-network/irrigation-branch hydraulics calculator spec'd out in a 2026-07-04 design session, substantially reworked the same day through extensive live testing and feedback (37 rounds of comments). Description settled on "Test Branch Pressure and Uniformity Estimate."

  **Core model:** a single flat reach table where each row is independently a Main reach (flat draw = design flow × the reach's own total emitter count — every OTHER lateral branching from that reach; for the reach right at the test lateral's own takeoff, this also includes any laterals beyond that point along the main or sharing the same junction, e.g. an opposite-side lateral, since their flow branches from that same reach too) or a Lateral reach (per-emitter `q = k·H^x` draw, friction loss reduced by Christiansen's F(n) for multi-outlet reaches). Solves by guessing the last (most remote) emitter's pressure and bisecting it against the entered supply pressure, marching the Energy Grade Line backward reach-by-reach — same bisection shape as `js/manning-pipe-flow.js`'s `solveForDd0`. Elevation modeled via a proper EGL march (extension beyond the original spec, which had no elevation term): EGL only ever drops by friction+minor loss; actual nodal pressure is backed out using each row's own elevation and velocity. One downstream-node elevation input per row (optional/defaults-to-flat on interior rows, load-bearing on the last row) plus one global supply elevation. Terminology settled through testing: "test path"/"test lateral" (not "critical path"), "last emitter" (not "critical emitter").

  **Uniformity methodology reworked significantly after live discussion**, not just built once: initially compared the last emitter's flow against the manufacturer's design/rated flow, but that's not standard practice — real low-quarter DU divides by the sampled population's own mean, never an external rated value. Settled on `q_last/q_avg_field` (`du_estimate`), where `q_avg_field` is the test lateral's own modeled average corrected by a user-entered `dp_avg` ("estimated pressure difference, average vs. test lateral," default 0). The correction exists because the test lateral is deliberately the presumed worst case, so its raw average is a biased-low stand-in for a true field average — `dp_avg` lets a motivated user correct for that bias, feeding both the uniformity check and the Application Design section below. Kept `q_last/q_design` (`q_ratio`) as a separate, explicitly non-uniformity diagnostic for "how far is this system running from its design point." Added a worst-case sanity warning: if the solved last-emitter pressure reaches or exceeds supply pressure, flags that the modeled path likely isn't the true worst case. Deliberately did not attempt an interpolated low-quarter DU (per-emitter pressure interpolation within each lateral row) — reconsidered and deferred, since the model lacks the elevation and length resolution to do that honestly.

  **Application Design section added**, ported from `Drip-Sprinkler.php`'s formulas and reusing its `ds_*` labels: spacing (`Se`/`Sl`) and system-wide lateral/emitter-count inputs feed precipitation rate, system/zone flow, and runtime, using the corrected `q_avg_field` instead of a manually-guessed rate.

  **Shared-library bugs found and fixed during this build** (benefit every calculator using these patterns, not just this one): `js/Calculators.lib.js`'s `addCalcRow` never applied initial values to checkbox/radio row inputs; a `points_data`-textarea null dereference when a calculator's table omits the copy/paste feature; `loadFromUrl` could crash assigning `.value` to a non-Element when a field name collided with a reserved DOM collection property (e.g. `length` shadowing `HTMLFormControlsCollection.length`); `js/Cookies.lib.js`'s `cookieToForm` had no detection for a stored cookie no longer matching the current page's field layout — now bails cleanly to reinitialize instead of crashing or partially populating.

  Reused existing precedent throughout rather than inventing new architecture: `Manning-Irregular.php`'s dynamic add/remove row table (`EngCalcs.addCalcRow` etc. in `js/Calculators.lib.js`) and `js/darcy-weisbach.js`'s 3-regime friction factor. Deliberately dropped for this pass: the points-data copy/paste bulk-edit textarea (kept add/remove single-row controls only) and a sketch/diagram. Deferred/out of scope: pump-curve supply boundary (fixed inlet pressure only), a dedicated pressure-compensating-emitter toggle (usable today via the free `x` exponent input), and the 26-language translation sprint (English only; `$ec_lang_intent['ip_*']` left blank per the sprint process, not yet run — see the separate symbol-convention roadmap item, H-vs-P and q-vs-Q, to resolve before that sprint). `php -l` and JS syntax clean on all touched/new files throughout.

- 0|Quality-score updater: Added `dev/scripts/update_quality_score.php` (usage: `php update_quality_score.php <lang> <quality>`). The roadmap item's original description was slightly off — the `QUALITY` constant actually lives in `lib/Language.Settings.php` (one `$all_language_settings[lang]` array per language), not in the per-language `lang.ec.??.php` files, which only hold display strings. Script validates the lang code (2-letter, must already exist in the settings file) and quality value (numeric, 0–1), then does a targeted regex replace of just that language's `QUALITY` value, leaving formatting/comments untouched. Verified: successful update on `es`, rejected an unknown lang code and an out-of-range quality value, `php -l` clean. Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call.

- 0|Deployment workflow script: Added `dev/scripts/deploy.sh` wrapping the full release sequence — `php -l` on every changed/new PHP file (diff-filter ACMR against HEAD plus untracked new files), aborts on any lint failure before touching git; then `git add -A`, an interactive commit-message prompt (skips commit if nothing staged, aborts on empty message), then an interactive push confirmation (`git push origin <branch>`, defaulting to the current branch) via the existing `altssh.bitbucket.org:443` origin remote — no separate SSH config needed since the remote URL already routes through altssh. Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call. Verified `bash -n` clean and a dry run (declining both prompts) correctly skipped commit/push with no changes to the tree.

- 0|Lang-file key-order normalizer: Added `dev/scripts/lang_key_order_normalizer.php`, which rewrites each non-English `lib/lang.ec.??.php` so its `$ec_lang[]` key order matches `lang.ec.en.php` exactly (values, quoting, and trailing same-line comments preserved byte-for-byte via PHP's own tokenizer; stale/duplicated section-header comments consolidated to English's structure). Originally scoped to Copilot (`[CP]`); reassigned to Claude Code and executed directly this session. Ran on all 26 non-English files: `lang_syntax_validate.php` clean, `lang_parity_check.php --strict` shows 0 missing/extra keys, and a separate token-level value-equality check (order-independent) confirmed 0 content diffs across every file. One real hazard surfaced and handled: `lang.ec.es.php` had two keys (`u_gradePercent`, `u_in2`) that reference an earlier key's own translation via PHP's unquoted string-interpolation syntax (e.g. `"$ec_lang[u_grade]"`) rather than retranslating it — naive English-order reordering would have flipped the assignment order and silently broken that reference at runtime (undefined-key warning, empty interpolation). The normalizer detects this pattern generically and topologically re-sorts just the affected pair, deferring to English order everywhere else — confirmed by re-rendering both interpolated strings through PHP post-reorder. The script's `--check` mode (exit 1 on any mismatch) serves as the "hook to enforce order on future edits" called for in the original spec, runnable in CI or pre-commit.

- 0|Translated the 3 keys newly surfaced by the entity-normalization fix (see next item): `cs_payback_years` in fr/it/km/my/ro/tr; `mhp_nu` in km/my/ro/tr; `mi_tau` in km — all were fully untranslated English, hidden from prior parity-check runs by HTML-entity vs. literal-character mismatches. Reused established per-language vocabulary already present in each file (e.g. `cs_lining_cost`/`cs_annual_value_recovered` terms for the payback tooltip, `dw_kinematic_viscosity` terms for the viscosity label, `mpf_shear_stress` term for the shear label) for consistency. `lang_parity_check.php` confirms 0 remaining `equal_to_english` hits for all 3 keys across all 27 files; `php -l` clean.

- 0|Fixed HTML-entity-vs-literal-character blind spot in `lang_parity_check.php` and `generate_translation_payloads.php`: both scripts' "equal to English" / delta detection compared raw strings, so an entity form (e.g. `&ndash;`, `&times;`, `&nu;`) in one file and its literal UTF-8 character in another (e.g. `–`, `×`, `ν`) were wrongly treated as different, hiding genuinely-untranslated keys from sprint payloads and parity reports. Added a shared `normalizeForCompare()` helper (`html_entity_decode(..., ENT_QUOTES | ENT_HTML5, 'UTF-8')`) applied to every equality comparison in both scripts (main english-equal check, plus `findNeighbor()`'s context-consistency check in the payload generator). Verified via before/after diff of full parity-check output: total `equal_to_english` count rose from 1214 to 1225, newly catching `cs_payback_years`, `mhp_nu`, and `mi_tau` as genuinely untranslated in several languages (previously masked by encoding mismatch) — confirmed each is a real defect, not a false positive. Follow-up translation of those 3 keys logged as a new small task above.

- 0|Removed orphaned `rrc_main_desc` and `rrc_main_menu` keys from all 26 non-English lang files: legacy of an earlier `rrc_` prefix before Rock Chute settled on `rc_` — keys existed in every non-English file but never in English. Confirmed via `grep -l` that exactly the 26 non-English files (and no others) had them before removal; `php -l` clean on all 27 files afterward.

- 0|Finish the tooltip-icon CSS standardization: the earlier "CSS standardization for validity/status checks" sprint added `.ec-tip` (currently just `cursor: help`) but only wired it into `EngCalcs.writeVelocityCheck()` in JS. The much larger set of hover-tip spans hardcoded directly into the lang files was never migrated — 318 occurrences of `style="cursor:help;color:steelblue;font-size:0.9em"` across all 27 `lib/lang.ec.??.php` files (English included). Plan: (1) add `color: steelblue; font-size: 0.9em` to `.ec-tip` in `css/engcalcs.css`, (2) mechanical find/replace `style="cursor:help;color:steelblue;font-size:0.9em"` → `class="ec-tip"` in all 27 lang files (no translation judgment needed, just markup — safe for a script or a single pass, not a per-language translation sprint).

  Note: a separate, unaddressed variant `style="cursor:help;color:#06c;font-size:0.9em"` (a different blue) also exists in several lang files for the same tooltip-icon purpose — out of scope for this item, candidate for a follow-up consolidation.

- 0|Expand and tighten glossary.json: Filled in all 5 empty languages (am, bn, km, my, ps) for all 27 terms using 5 parallel agents. Reviewed 6 nuanced terms across 21 existing languages. Corrections applied: fr conveyance efficiency → rendement de transport d'eau; cs/sr penstock → tlakovod/напорни цевовод; ar/uk emitter → قطارة/крапельниця; uk conveyance efficiency → added 'води'. Version bumped to 1.1.

- 0|Drip-Sprinkler.php simplified — removed Distribution Uniformity (DU): DU as implemented required both an average and a minimum emitter flow rate, but neither is knowable at design time without full lateral/main hydraulic modeling (a catalog emitter rating is really a best-case/near-inlet value, not avg or min — DU would report 100% for any un-modeled layout). Removed `q_min`, `du`, `du_check`, and the four `du_*` quality-tier keys; renamed `ds_q_avg` to plain "Emitter flow rate, q"; merged the DU notes entry out and renumbered the Runtime note. Calculator now honestly scopes to what's knowable pre-hydraulics: area per emitter, application rate, lateral/zone flow, and runtime for a target depth. Removed the same keys mechanically (deletion + notes renumbering) from all 26 non-English lang files, then hand-trimmed the "average"/"and uniformity" wording out of `ds_main_desc`/`ds_q_avg` in each (no new translation needed, just removing qualifiers that no longer apply). `lang_parity_check.php --prefix=ds` shows 0 missing/extra/equal-to-English across all 27 files; `php -l` clean. Follow-up (full lateral-hydraulics DU calculator) logged as a new, separate, low-priority roadmap item — scope is larger than first thought once arbitrary pipe-size steps are considered.

- 0|Removed `$ec_lang['ec_name_invalid']` (and its empty `$ec_lang_intent` entry, English-only, removed with explicit user permission this session) from all 27 `lib/lang.ec.??.php` files — confirmed unused outside the lang files via repo-wide grep before removal. `php -l` clean on all 27 files; `lang_parity_check.php` shows 0 missing keys post-removal.

- 0|Velocity-tip wording upgrade (open-channel + enclosed-pipe): Per user feedback, richer tooltip wording for both threshold groups. Open-channel (`mtc_vel_high`, shared by mtc+mi): "check available drop" → "check transition losses and available energy" (more translatable, more general hydraulic concept than "drop/fall"). Enclosed/pressure (`mhp_vel_high`/`mhp_vel_low`, shared by dw/hw/mpf/mphl/mhp): replaced the trivial "Velocity very high/low ⚠" with substantive tips — high: "risk of water hammer and high point (minor) losses"; low: "risk of sedimentation and air entrainment" (matches the specificity of the open-channel tips; dropped the redundant ⚠ since the icon itself already shows it). Launched 26 parallel haiku agents to reword all 3 keys across every non-English `lib/lang.ec.??.php` file (existing translations were stale — several still described old "diameter sizing" advice rather than the current tooltip content). 0 missing keys, all `php -l` clean.

- 0|Velocity checks added to Darcy-Weisbach, Hazen-Williams, Manning Pipe Flow, Manning Pipe Head Loss: All four pressurized/enclosed-pipe calculators now show an OK/High/Low `vel_check` row, reusing `EngCalcs.writeVelocityCheck()` and the existing `mhp_vel_*`/`mhp_vel_*_short` lang keys directly (no new keys, no new translation sprint needed — those keys already have 26-language coverage). Threshold matches Micro-Hydro Power: 1.0–3.0 m/s = OK, >3.0 = High, <1.0 = Low. Open-channel calculators (Manning Trapezoid, Manning Irregular) keep their separate `mtc_vel_*` keys/thresholds (0.6–3.0 m/s) per user direction — two threshold/wording groups by flow type (open-channel vs. enclosed/pressure), not one universal set. Manning Trapezoid Channel already had a velocity check from an earlier session; no changes made there this round.

- 0|Translation sprint — velocity-check short labels + orifice centroid reword: Launched 26 parallel haiku agents (one per language) to translate the 6 new short velocity-check keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) and reword `or_regime_submerged` from "invert" to "centroid" in all 26 non-English `lib/lang.ec.??.php` files, each referencing that file's existing `or_centroid_elev` translation for term consistency. Also picked up a few pre-existing untranslated keys (`mtc_blodgett_v_bathurst`, `or_shape_circular`/`rectangular`) surfaced in the same payload. Result: `lang_parity_check.php` shows 0 missing keys project-wide; `lang_syntax_validate.php` clean across all 27 files.

- 0|CSS standardization for validity/status checks: Added named classes to `engcalcs.css` (`.ec-status-ok/-info/-warn/-bad/-neutral`, `.ec-tip` for hover-help cursor) using the more accessible hex colors (`#267326`, `#c60`, `#c00`) that Rock Chute already used, instead of the plain CSS color keywords (`green`, `darkorange`, `red`) used ad hoc elsewhere. Replaced all `el.style.color = '...'` assignments with `el.classList.add(...)` across `js/orifice.js`, `js/rock-chute.js`, `js/drip-sprinkler.js`, `js/orifice-drain-time.js`, `js/micro-hydro-power.js`, `js/canal-seepage.js`, and the new `EngCalcs.writeVelocityCheck()` helper. Also fixed `engcalcs.css` being served with a hardcoded `?v=2` instead of `filemtime()` cache-busting (matches the existing per-project convention for JS includes) — now `?v=<?=filemtime(...)?>` in `lib/HeadersFooters.lib.php`. SVG-sketch geometry/line-thickness standardization is a larger follow-up not attempted here.

- 0|Velocity-check short labels use "High ⚠" / "Low ⚠" (icon carries the warning), not "High !" / "Low !" — dropped the exclamation mark per user feedback to avoid "hype" wording; the ⚠ hover-tip icon already communicates the warning.

- 0|Manning Pipe Head Loss HGL₂ NaN fix: `js/manning-pipe-head-loss.js` had `hgl2 = hgl2 - hv` (self-reference before assignment, always NaN). Fixed to `hgl2 = egl2 - hv`, matching Hazen-Williams and Darcy-Weisbach. Also added the missing `hgl1 = egl1 - hv` result (present in the other two calculators but absent here), reusing the shared `hw_hgl_1` label.

- 0|Orifice submergence criterion fixed to use centroid, not invert: `js/orifice.js` `submerged` flag compared TWE to `zinv` (pipe invert), which flagged submergence too early — before the downstream water surface had actually risen past the orifice center, understating the free-discharge head. Changed to compare TWE against `centroid`. Updated English `or_regime_submerged` message from "TWE above invert" to "TWE above centroid" to match; the 26 non-English translations of that string still need re-wording (tracked in active roadmap item).

- 0|Velocity check messages shortened to OK/High !/Low !: Added `EngCalcs.writeVelocityCheck()` shared helper in `js/Calculators.lib.js` — renders a short status plus a hover-tip warning icon (⚠, `title` attribute) carrying the full explanation, replacing long inline sentences in Manning Trapezoid, Manning Irregular, and Micro-Hydro Power velocity-check cells. Added 6 new short-form lang keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) to English; non-English translation still needed (tracked in active roadmap item).

- 0|Wire glossary into CLAUDE.md agent translation sprint: Translation Sprints section updated with pre-sprint step to verify glossary.json preferred-translation coverage for the calculator prefix's key terms, and launch instructions specifying that each agent receives embedded glossary terms, intent notes, and all translation rules. Glossary at v1.2 covers all 26 non-English languages across all calculator prefixes.

- 0|ec_lang_intent workflow audit and Spanish Robinson fix: Spanish Robinson translations verified correct — `bajante de rocado` / `escollera` / `pendiente pronunciada` properly convey the steep-channel context (not generic "canal"). Parallel-agent sprint workflow (one agent per language) established as the standard approach. Glossary injection + intent guard provide the quality layer for future sprints.

- 0|Audit remaining English strings in other languages: Parity checker run across all 26 non-English lang files confirms 0 missing keys in every language. English-equal strings (~23–55 per language) are overwhelmingly unit symbols (u_ft, u_m, u_kw, etc.) and technical abbreviations that correctly remain as international English. No untranslated calculator content found. Discovered two orphaned rrc_ keys present in all 26 non-English files — see active cleanup task.

- 0|HTML-entity audit script + bulk fix: `dev/scripts/html_entity_audit.php` scans all lang files for HTML entities (`&mdash;`, `&ge;`, `&amp;`, `&nu;`, etc.) that double-encode through `htmlspecialchars()` into JS `pageConfig`. Supports `--lang`, `--prefix`, `--fix` (replace in-place), and `--strict` (exit 1 for CI). On first run with `--fix`, replaced 2201 entity occurrences across all 26 non-English lang files with plain Unicode characters. English file was already clean; all non-English files now match that standard. Run without `--fix` to audit future regressions.

- 0|Hard-coded velocity units in Micro-Hydro messages/footnote: Updated velocity check output to unitless wording ("Velocity very low", "Velocity very high", "Velocity reasonable") and replaced the velocity note text with unitless guidance tied to available drop, losses, and water-hammer risk.

- 0|Propagate corrected `rc_notes_4_def` link to all translations: Replaced the old DOI URL with `https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf` in all 27 `lib/lang.ec.??.php` files.

- 0|Add velocity checks to Manning trapezoid and irregular calculators: Added `v_check` result to both calculators with warning messaging when velocity is high, and added the requested design note about high specific energy and potential expansion/obstruction losses.

- 0|ec_lang_intent guard: `$ec_lang_intent` is now explicitly off-limits to AI in both `CLAUDE.md` and `.github/copilot-instructions.md`. Both files state that AI must not add, change, or remove any `$ec_lang_intent` value without explicit written permission from the human in that conversation.

- 0|Math/logic review of all 14 calculators: Full review completed; findings written to `dev/ai-report.md`. One confirmed bug (Manning Pipe Head Loss HGL₂ always NaN — `hgl2` referenced before assignment), one medium logic concern (Orifice submergence criterion overestimates flow when TWE between invert and centroid), one design risk (Weir Flow Simple missing unit guidance for Cw), one cosmetic misspelling (Hagen-"Pouseuille" in DW). All core hydraulic formulas in the other 12 calculators verified correct.

- 0|"More" dropdown: About link moved under a "More ▾" dropdown (`menu_more` key, translated into all 27 languages). Follows web convention (Twitter, LinkedIn); "Help → About" is desktop-app convention. Dropdown uses `dropdown-menu-end` so it aligns to the right edge on small screens. Ready for Install/Subscribe/Contact items as those pages are built.

- 0|Encoding — kinematic viscosity tooltip raw codes: `&sup6;` is not a valid HTML5 named entity; it displayed literally in Bootstrap tooltips across all 27 lang files. Fixed `dw_kinematic_viscosity` and `ps_nu` title attributes to use UTF-8 characters (×, ⁻, ⁶, ², °) instead of HTML entities. Also corrected Ukrainian file which had `&#8308;` (superscript 4) instead of ⁶ and ². Prevention: use literal UTF-8 chars in all lang `title` attributes; the planned HTML-entity audit script (priority 25) will catch any recurrence.

- 0|Standalone engcalcs: Decoupled engcalcs from hawsedc.com via optional parent hooks. `hawsedc/engcalcs-parent-hooks.php` defines `engcalcsParentCSS()` and `engcalcsParentMenu()`; `engcalcs/lib/base.inc.php` loads this file if present; `HeadersFooters.lib.php` calls hooks conditionally. `hawsedc/index.php` now uses new standalone `hawsedc/hawsedc.lib.php` — no engcalcs bootstrap required. Fixed info-disclosure bug (BASE_DIRECTORY was echoed into public HTML).

- 0|New-calculator scaffold script: Added `scripts/new_calculator_scaffold.php`. Given `--prefix` and `--keys`, it appends missing stub entries across all 27 `lib/lang.ec.??.php` files and creates a calculator skeleton page + JS file using repo conventions (`echoHeader`/`echoCalculatorForm`/`echoFeedback`/`echoFooter`, JS include with `filemtime()`).

- 0|Translation completion matrix: Added `scripts/translation_completion_matrix.php` to report untranslated-key counts with languages as rows and key prefixes as columns. Supports `--lang`, `--prefix`, and `--format=table|csv` for sprint prioritization.

- 0|Zero-API translation runner (default): Added `scripts/translate_zero_api.php` to orchestrate default non-API translation workflow with deterministic phases (`scan` and `validate`) using payload generation, parity checks, syntax validation, and completion matrix reporting. `scripts/translate.php` remains optional paid path and now labels itself as non-default.

- 0|Engineering glossary integration: `scripts/glossary.json` is now wired into both `scripts/generate_translation_payloads.php` (prefix-scoped glossary context and preferred-term payload fields) and API prompt construction in `scripts/translate_prompt.php` (preferred term map, translation notes, and neighboring translated key context injection).

- 0|Translation payload generator (per-lang JSON): `scripts/generate_translation_payloads.php` now reads English plus each target lang file, emits only missing/untranslated keys, and includes neighboring translated context per key for register consistency (`key_context`). Supports `--prefix` and `--lang` filters and keeps backward compatibility with existing payload consumers via `keys` aliasing `keys_to_translate`.

- 0|Lang-key parity checker: Implemented `scripts/lang_parity_check.php`. Compares each `lib/lang.ec.??.php` against `lib/lang.ec.en.php`, reports missing keys, extra keys, and keys still equal to English. Supports `--lang`, `--prefix`, and `--strict` for sprint briefs and completion checks.

- 0|Lang-file syntax validator: Implemented `scripts/lang_syntax_validate.php`. Runs `php -l` per lang file and reports file:line findings for syntax errors, premature `?>`/out-of-scope declarations, and duplicate keys. Supports `--lang` scoping for surgical checks.

- 0|Save/share named calculations: URL-based Option B implemented. "Label:" field (50 chars, letters/digits/spaces/–_.) in h1 flex row on all calculator pages. On every calculation, history.replaceState encodes all form inputs + label as GET params. Loading a labelled URL pre-fills the form and restores the label. &lt;title&gt; reflects label. Client-side validation: hint text turns red on invalid chars, strips on blur. Label field suppressed on non-calculator pages. ec_name_* keys added to all 27 lang files.

- 0|Canal seepage expansion: Canal-Seepage.php expanded with lining payback outputs (annual value lost/recovered, total lining cost, simple payback period). Blank defaults for optional payback inputs. Separator "/" rendered between input element and unit selector via new 'separator' key in echoCalculatorForm. "per" replaced with "/" in all 27 lang files for "Value of water (currency / unit volume)" and "Lining cost (currency / unit area)".

- 0|Progressive Web App (PWA): Implemented. manifest.json, sw.js, and icons/icon.svg added. Service worker pre-caches all 16 calculator pages + all JS/CSS assets + Bootstrap CDN files on install. Strategy: cache-first for static assets, network-first (falling back to cache) for PHP pages. Language cookies work normally when online; offline serves the cached version in whatever language was current at install time. SW registration injected into echoHTMLHead() via HeadersFooters.lib.php. Theme color #1a6faf.

- 0|Text-only mode: Evaluated and closed. The PWA pre-caches all assets on install, making text-only redundant for returning visitors — the primary global south use case. A parallel rendering path would add significant maintenance burden for a narrow first-load benefit.

- 0|Redundant phrases: Evaluated and closed. The only truly identical long passage across all 27 lang files is the USBR/FAO citation in cs_notes_4_def — a proper-noun citation that doesn't translate. Adding a PHP shared-constant system for one string costs more than it saves.

- 0|Language button: replaced translated "Language" text with a globe emoji (🌐) — universally recognized, no translation needed, no flags (flags conflate language with country per W3C i18n). Screen-reader text "Language" retained via visually-hidden span.

- 0|Drip-Sprinkler: DU quality check renders as "Good &mdash; DU &ge; 80% ✓" — fixed. HTML entities in ds_du_* lang keys were double-encoded through htmlspecialchars() into JS. Replaced with Unicode (— ≥ <) in all 27 lang files.

- 0|Translation sprint — three pages: Drip-Sprinkler.php (ds_* keys), Irrigation.php (body prose and card descriptions), and About.php (body prose). Decision: keep all three pages; translate all 26 non-English lang files before next deployment.

- 0|Contextual hover tips: all javascript:alert help links replaced with span hover tooltips across all 27 language files. The only occurrences were the 3 mtc_d50_* Manning Trap Channel riprap sizing labels — all now use the Rock Chute pattern (cursor:help, steelblue ?, title attribute).

- 0|Robinson Rock Chute: Rock-Chute.php implemented — Robinson, Rice & Kadavy (1998) D50 sizing equations, slope-based equation selection, range checks, layer/crest/apron geometry, SVG sketch, translated into all 27 languages.

- 0|Irrigation: Canal-Seepage.php added (prefix cs_). Inflow-outflow method: Q_loss = Q_in − Q_out, conveyance efficiency Ec = Q_out/Q_in. Outputs: loss rate, loss fraction, Ec with Good/Fair/Poor rating (≥80%/60-80%/<60%), daily and annual volume lost. Unit-aware (m³/s, L/s, cfs for flow; m³/ft³/ac-ft for volume). Added card to Irrigation.php landing page and menu entry under Irrigation.

- 0|Drip/Sprinkler Application Rate calculator (Drip-Sprinkler.php): inputs are average and minimum emitter flow rate, emitter spacing Se, lateral spacing Sl, emitters per lateral, laterals per zone, and target application depth. Outputs are area per emitter, application (precipitation) rate PR = q/Ae, distribution uniformity DU = qmin/qavg (with color-coded quality check), flow per lateral, zone flow, and runtime for target depth. New units added: lph, gph (flow rates), mmph, inph (precipitation rate). ds_ keys added to all 27 lang files.

- 0|Audit existing translations for glossary compliance: built `dev/scripts/glossary_compliance_audit.php`, comparing lang-file strings for the four highest-drift terms (flow, head loss, weir, conveyance efficiency) against glossary.json preferred translations across all 26 non-English files. Most flagged mismatches were false positives from case/declension (e.g. Bulgarian "загуба"/"загуби") rather than real drift. Found and fixed one genuine defect: bg, tr, sr, km, and my each used a different word for "flow" across the mpf_/or_/mhp_ calculators within the same lang file — standardized all three to the glossary-preferred term per language. Also discovered (but did not yet fix — logged as a new task above) that `cs_Ec_target`'s tooltip text is untranslated English in 19 languages.

- 0|Translated `cs_Ec_target` (and the sibling `cs_lining_area`, same defect) into all 25 non-English languages: fr/it/km/my/ro/tr had the literal English "Lining target"/"Lining area" strings; 13 more languages (es, fa, he, hi, hr, id, pt, ps, ru, sr, sw, ur, zh) had a translated label but an untranslated English tooltip `title` attribute; bg/cs/bn/ar/am used a fuller inline sentence instead of the short-label-plus-tooltip pattern that the English source and most other languages use — all reworked to match. Existing per-language "conveyance efficiency" (`cs_Ec`) and "lining" (`cs_lining_cost`) vocabulary reused for consistency within each file. Root cause of why this slipped past `generate_translation_payloads.php`'s delta detection: the checker does exact-string equality against English, and these strings differed from English only by HTML entity vs. literal character (`&ndash;`/`–`, `&times;`/`×`) — a normalization gap in that script, logged separately below.

- 0|Language quality — structural fixes: he, pt, hr, sr, ro, zh all raised to 0.85–0.9. he: fixed 6 English strings in mtc_ section and mixed-language mphl_hgl_2. sr: fixed 4 Croatian-script strings in irr_/mhp_ sections. All 26 non-English lang files gained about_ keys.

- 0|About page (About.php): added to nav menu. Covers global humanitarian open source mission, GNU GPL v3 license, Bitbucket repository link (bitbucket.org/hawstom/engcalcs), contributing (translations, bugs, new calculators, hosting), offline ZIP download (planned/roadmap), and PWA status.

- 0|Irrigation landing page (Irrigation.php): added to menu with divider. Links to Weir Flow Simple, Weir Flow Irregular, Orifice Flow, Orifice Drain Time, and Manning channel calculators. Quick-reference section for diversion dams, headgates, pipe turnouts, and USBR Water Measurement Manual alignment. irr_ keys added to all 27 lang files.

- 0|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL. Now 27 languages total.

- 0|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two.

- 0|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here."

- 0|Language menu order: Corrected Language.Settings.php order to alphabetical by English name (EU/UN convention). Arabic, Bengali, Bulgarian were out of order.

- 0|Language system audit: Fixed all lang file issues. Removed ~30 orphaned legacy keys. Added missing or_velocity to ro and sr. Fixed es.php forward-reference bug. Fixed tr.php premature ?> close tag that dropped 55 mhp_/ps_ keys outside PHP scope; fixed 3 unescaped apostrophes in Turkish Penstock strings. Fixed bg/he mphl_hgl_2 forward reference.

- 0|Chinese language code: Renamed internal code cn→zh (ISO 639-1 standard). Added normalizeLang() to Language.lib.php to silently correct legacy ?lang=cn GET params and ec_language=cn cookies to zh.

- 0|Micro-Hydro Power calculator: Retitled from Penstock-Design.php to Micro-Hydro-Power.php and migrated fully to mhp_ language keys (old ps_ keys renamed, duplicate old mhp_ block removed). Calculator wraps Darcy-Weisbach friction factor logic with gross head, plant efficiency, and power output. Inputs: Q, H_gross, D, L, roughness e, minor loss km, kinematic viscosity, η. Results: velocity + color-coded velocity check, f, h_f, h_m, h_L, color-coded head loss % check, H_net, power (kW/MW/hp), annual kWh/yr. Dynamic SVG bar sketch.

- 0|Add Amharic, Urdu, Swahili, Hindi, Arabic translations — complete translation of all calculators in each language. All registered in Language.Settings.php (QUALITY 0.9). Urdu/Arabic are RTL.

- 0|Language-demand logging: logLanguageSelection() added to Language.lib.php; called when a valid ?lang=XX GET parameter is used. Log path: /var/www/cnm/logs/engcalcs-lang.log. Format: tab-separated UTC-timestamp, lang-code, page-basename.

- 0|Solver (y/d₀ given Q) for Manning Pipe Flow: bisection solver added to js/manning-pipe-flow.js. Bisects y/d₀ on [0.0001, 0.9376] (Manning Q peaks at 93.8% full for circular pipes), sets the y/d₀ input and reruns the calculator.

- 0|Orifice Drain Time calculator: Orifice-Drain-Time.php with conic volume method. Inputs: starting/ending/orifice elevations, starting-pond area A1, orifice-level area A0, orifice shape/size, Cd. Outputs: interpolated ending area A2, drain time. Equation derivation reference page (MathML) at Orifice-Drain-Time-Ref.php. SVG sketch. Polished: H1, Qmax, Drained Volume outputs added; h2 ≥ D/2 validation.

- 0|SVG sketches: Added to Orifice Drain Time (WSE, wall, H₁, D annotations), Weir-Irregular (crest profile as gray filled polygon with HWE line). Manning.lib.js extracted for shared sketch reuse.

- 0|Bootstrap 5.3.2 migration and jQuery removal. All pages converted to Bootstrap 5 utility classes; $() calls eliminated. (commit 92f38da)

- 0|Extracted per-calculator JavaScript into separate files under js/calculators/. (commit 76d6255)

- 0|Added CLAUDE.md architecture and developer guide. Added php -l pre-commit hook. Priority 1 security fixes: XSS output escaping, language parameter validation, cookie Secure/HttpOnly flags, ENV-based DEBUG_MODE, removed test/debug files.

- 0|Translations (multi-lingual): Evaluated cost/value of having a languages system in the post-2025 (AI) age. Decision: keep the system — engineering terminology mistranslates poorly in browser auto-translation. Improved fr (complete rewrite), bg (dw/hw/mi/wi sections added), tr (dw/hw/mi added).

- 0|Orifice calculator phase 1: Orifice.php created with circular/rectangular shape selector, unit-aware inputs (D, W, invert elevation, HWE, Cd), results (centroid, h, area, Q, v, regime check), SVG profile sketch, and notes.

- 0|Touch tooltips: Bootstrap Tooltip initialized on all `[title][style*="cursor:help"]` spans via DOMContentLoaded in Calculators.lib.js (`trigger: 'hover focus click'`). Tappable on mobile. `?` span added after Save label in navbar for the `ec_name_hint` text.

- 0|PWA on mobile: PNG icons (192×192, 512×512) generated and added to manifest.json. Apple meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.) added to `<head>` via HeadersFooters.lib.php. SW cache bumped to v2. iOS requires manual "Add to Home Screen" from Safari share menu — `beforeinstallprompt` does not fire on iOS by design.

- 0|Layout overflow: Wrapped `<table class="bare">` in `<div style="overflow-x:auto">` in `echoCalculatorForm()`. On narrow screens the table scrolls horizontally within the page rather than overflowing past the edge.

- 0|PWA evangelism: "⬇ Install" button added to navbar (before Save field), hidden by default. Shown only when `beforeinstallprompt` fires (Android Chrome); hidden again on `appinstalled`. `EngCalcs.installPWA()` triggers the native install prompt. iOS users see no button (iOS does not fire `beforeinstallprompt`).

- 0|Roadmap reorganized: grouped by theme, priorities differentiated so ties are intentional, descriptions tightened. Completed items moved to ## Completed section per instructions.
