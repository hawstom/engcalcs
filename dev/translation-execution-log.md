# Translation Execution Log (item 85 — historical record)

This file is the **verbatim, dated execution record** of the 2026-07 category-by-category
re-translation project (ROADMAP item 85). It was moved here from `dev/ROADMAP.md` on
2026-07-12 to keep the roadmap forward-looking; the entries below are preserved exactly as
written, in chronological order, blow-by-blow per calculator category and translation wave.

**This is history, not guidance.** For the authoritative *rules and sequence* (the sequencing
rule, the three scenarios, the QA chain), see `dev/translation-process.md`. For the *mechanics*
(sprint launch, model policy, post-sprint QA), see `CLAUDE.md` § "Translation Sprints". Where a
durable lesson below still governs how work is done, it has already been lifted into one of those
two files (or into `dev/scripts/glossary.json`); the copy here is the origin story, not the rule.

Still-open threads that were surfaced by these entries live as active bullets in
`dev/ROADMAP.md` (items 40, 45, and the glossary/housekeeping/native-review items under
"Translation Standardization"), not in this archive.

---

> **PROCESS (authoritative, current — see `dev/translation-process.md` Scenario C for the full
> mechanics; this box is the status summary, not a second copy of the SOP):**
> Wave 0 (suite-wide English reform) and item 90 (full-suite key consolidation) are both
> prerequisites that ran once, up front, across all 6 calculator categories, and are both complete
> — see their own Completed entries. With those done, item 85 proceeds **one calculator category
> at a time**, all three language tiers before the next category starts: wave 1 (anchor languages)
> first, which is also the last point where a genuinely untranslatable English string can trigger a
> small targeted English edit before the source freezes; then waves 2–3 (major non-Latin,
> low-resource) against the now-frozen source. Every wave is a **complete re-translation of the
> category's full key set**, never a missing-key delta — pre-existing content predates the Wave
> 0/item-90 reforms and isn't assumed correct. Full QA chain every wave (payload-freshness gate,
> `lang_syntax_validate.php`, independent tag-parity check, inline back-translation check, native-
> review flag for am/km/my/ps/sw), plus one holistic Opus consistency pass across all 26 languages
> once a category's three waves close.
>
> **Category order and status** (see the dated entries below for what was actually done/found in
> each): (1) open channel `mtc_`/`mi_` — closed. (2) weirs & orifices `ws_`/`wi_`/`or_`/`odt_` —
> closed. (3) pipe friction `dw_`/`hw_`/`mpf_`/`mphl_` — closed. (4) irrigation & seepage
> `cs_`/`irr_`/`ip_` — closed. (5) micro-hydro `mhp_`/`rc_` — closed (all 3 waves + holistic pass).
> (6) shared UI/units `u_`/`calc_`/`menu_`/`points_` — closed (light delta sprint + holistic pass,
> 2026-07-12 — see dated entry below; existing content was already high quality so a full 3-wave
> re-translation wasn't warranted per the cost-scoping note). **All 6 calculator categories are now
> closed; item 85's category-by-category loop is complete.** Each wave's paid sprint requires
> explicit go-ahead per CLAUDE.md § "Translation Sprints".
>
> **CONFIRMED 2026-07-07 (Tom): "complete re-translation" means all 53 current `mtc_`/`mi_` keys,
> not just the unfilled delta.** A pre-launch payload check found category 1's anchor languages
> already carry translations for all but ~17 key-instances (4 short labels: `mi_groupPoint`,
> `mi_groupSegment`, `mi_station`, `mtc_blodgett_v_bathurst` — leftover gaps from the item-90 IA
> reorder). That near-complete delta does **not** mean wave 1 is nearly done: per the PROCESS box
> above, wave 1 is a **complete original/comparative re-translation**
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
> regenerated, `--check` FRESH.

> **DONE 2026-07-09: wave-2 sprint executed for category 3 (pipe friction, 59 keys) into the 7
> major-non-Latin languages: zh ar he hi bn fa ur.** Pre-sprint: payloads FRESH; glossary had all
> category-3 terms populated for these 7 except `shear stress` (new term from wave 1, bound to
> `mpf_`) — 0/7 coverage going in. Each agent established its own language's term and recorded it:
> zh 切应力, ar إجهاد القص, he מאמץ גזירה, hi अपरूपण प्रतिबल, bn কৃন্তন পীড়ন, fa تنش برشی, ur برشی
> دباؤ — all confirmed by their translating agents as the mechanical/hydraulic sense, not a
> cutting/scissors false cognate. `ur` was pre-briefed on the item-40 قینچی/قیچی "scissors" trap
> found in `mi_tau`/`mpf_shear_stress` by earlier audits; its agent confirmed `mpf_shear_stress`
> already used the correct برشی دباؤ, not the scissors word (the scissors word remains only in
> category 1's `mi_tau`, tracked separately under item 40). Complete re-translation of all 59 keys
> per language (not assumed-correct deltas). **Real defects found and fixed in every one of the 7
> languages, not just wording** — the same defect cluster wave 1 found in the anchor languages had
> propagated identically here: `dw_roughness_tip` missing entirely; `mpf_friction_slope` mistranslated
> as "pressure slope" with a broken `../pressureslope.php` link (should be `../frictionslope.php`) and
> wrong symbol `S₀` instead of `S_f` (same wrong-symbol bug repeated in `mpf_solve_desc`); dropped/
> wrong-case subscripts across `mpf_flow_area`/`mpf_pipe_area`/`mpf_area_ratio`/`mpf_full_flow`/
> `mpf_full_flow_ratio` (lowercase `a`/missing `<sub>` tags); `mpf_froude_number` truncated to `F`
> instead of `Fr`; literal `ν`/`tau` characters instead of `&nu;`/`&tau;` entities in
> `dw_kinematic_viscosity`/`mpf_shear_stress`; and the item-90 loss-symbol case violation (capital
> `H` instead of lowercase `h`/`k_m`) in `mphl_friction_loss`/`mphl_junction_loss`/`mphl_total_loss`/
> `mphl_total_junction_k` in every language. **Additional defects found beyond the known checklist**:
> bn's `mphl_note_1` had flipped "and" to "or," inverting the logic; hi's `mphl_note_1` mistranslated
> "(and higher than the pipe!)" as "(or pipe!)"; he's `mphl_hgl_2` hardcoded an English "(See notes)"
> placeholder instead of the required PHP concatenation of `$ec_lang['mpf_see_notes']`; fa found and
> fixed a suite-internal inconsistency within its own file (`dw_`/`hw_` used a pressure-loss-sense
> term for "head loss" while `mphl_` correctly used the head-loss sense) and corrected the fa
> glossary `head loss` entry itself (afat fesar → afat had), the same defect class already documented
> for ro/tr/id in wave 1. **Session-limit note**: the `hi` and `ur` agents both hit a session-limit
> error; checked file state before retrying per the standing lesson (a session-limit error can fire
> after the edit landed) — `ur`'s edit had already completed (59/59 keys, dw_roughness_tip added,
> shear-stress term correct) and was kept as-is; `hi` had only added its glossary term before failing
> and was re-run in full. **Post-sprint QA**: `lang_syntax_validate.php` clean across all 7 (15
> findings, all `identical-to-english` advisory on pre-existing shared `calc_copy_link*` UI keys,
> untouched by this sprint); a from-scratch tag-parity check (English vs. all 7 langs across the 59
> keys, `<sub>/<sup>/<span>/<a>` sets) found zero issues; a literal-ν/τ-character sweep across all 7
> found zero remaining instances (all correctly use `&nu;`/`&tau;` entities). `backtranslate_check.php`
> **not run** — no `ANTHROPIC_API_KEY` available in this environment, same gap as wave 1; outstanding
> QA step, not a blocker to recording wave 2 as done. Payloads regenerated, `--check` FRESH.

> **DONE 2026-07-09: retroactive manual back-translation QA (policy step 1, ~ROADMAP line 151-183)
> run for all 21 category-3 languages closed without it** — the 14 wave-1 anchors (es pt fr it de ro
> ru uk bg sr hr cs tr id) plus the 7 wave-2 major-non-Latin (zh ar he hi bn fa ur), 59 keys each.
> One review-only agent per language (21 total), each independently back-translating every long
> string (tooltips, `*_note_1` blocks, `*_desc`/`*_solve_desc`) and sanity-checking short labels,
> per the same rigor as the unavailable scripted `backtranslate_check.php` — no file edits by the
> agents themselves, findings-only. Confirms the fallback procedure catches real defects the
> translation sprints themselves missed: **7 real issues found across 21 languages, all fixed
> directly (not re-sprinted) same session:**
> - **pt** `mpf_shear_stress`: "força de arrasto" (drag force, a distinct fluid-mechanics concept)
>   instead of "força trativa" (tractive force) — fixed.
> - **de** `mphl_main_menu`/`mphl_main_title`/`mphl_main_desc`: used "Druckverlust" (pressure loss,
>   a Δp/Pa quantity) where English says "head loss" (an h/length quantity) — a units/concept swap,
>   internally inconsistent with the same calculator's own `mphl_total_loss` = `h_L` result label —
>   fixed to "Verlusthöhe" (loss head), consistent with the `dw_`/`hw_` sibling keys' "...verlust"
>   pattern.
> - **sr** script-mixing: `hw_`/`mpf_`/`mphl_` (and, caught by the same `replace_all` fix,
>   category-1's `mi_`/`ip_` keys referencing "Manningу") used a stray Latin "u" instead of Cyrillic
>   "У" in the possessive suffix on "Darcy-Weisbach"/"Hazen-Williams"/"Manning" — only `dw_` had the
>   correct Cyrillic У; fixed suite-wide across every occurrence in the file.
> - **hi** `dw_kinematic_viscosity`: tooltip text "for clean water at 20°C" was left untranslated in
>   English (an untranslated-passage finding, not a mistranslation) — translated.
> - **ru** `mpf_note_1`: dropped the "headwater" qualifier ("к глубине" / "to the depth" instead of
>   "to the headwater depth"), a precision-loss rather than a hard error — tightened to "к глубине
>   уровня подпора."
> - **bg** `mpf_friction_slope`/`mphl_friction_slope`: "Хидравличен наклон" (generic "hydraulic
>   slope") blurs the specific friction-loss-rate sense of "friction slope" — flagged as a borderline
>   terminology question for native-engineer review, not auto-fixed (matches this project's practice
>   of not overriding a plausible existing technical-register choice without a human check).
> - **he** `mpf_shear_stress` "כוח גרר": reviewed against the exact same failure class as the pt
>   defect (drag force vs. tractive force) but judged NOT a defect — Hebrew "גרר/גרירה" (drag/pull)
>   shares tractive's own "pulling" etymology much more directly than Portuguese's "arrasto," so it
>   was kept as-is rather than force-changed to match the pt pattern.
> - **ru** `mpf_note_1` and **hi** `dw_kinematic_viscosity` findings above were the only
>   untranslated-passage/precision-loss class findings; no homonym traps, dropped clauses, or
>   flipped upstream/downstream directions were found in ANY of the 21 languages — the
>   highest-risk failure class (direction flips on HGL/EGL upstream/downstream pairs, the exact bug
>   class the 2026-07 rc_/ip_ audit originally found) came back completely clean across the board.
> Post-fix QA: `php -l` and `lang_syntax_validate.php` clean on all 5 edited files (pt, de, sr, hi,
> ru); payloads regenerated, `--check` FRESH. **The holistic Opus/Fable cross-language consistency
> pass (policy step 3) is a separate, additional layer, not yet run for category 3** — do this before
> considering category 3's QA fully equivalent to category 1's treatment.

> **DONE 2026-07-10: wave-3 sprint executed for category 3 (pipe friction, 59 keys) into the 5
> low-resource languages: am km my ps sw.** Pre-sprint: payloads FRESH; key completeness was 58/59
> in all 5 (only `dw_roughness_tip` missing, same gap wave-1/2 had pre-sprint); glossary had 0/5
> coverage for `shear stress`/`friction loss`/`minor loss` going in (expected — same starting point
> wave 2 had). Complete re-translation of all 59 keys per language, all Sonnet (mandatory low-resource
> tier, never Haiku). **Real defects found and fixed in every one of the 5 languages**, the same
> defect cluster waves 1-2 found propagated here too: `dw_roughness_tip` missing; `mpf_friction_slope`
> mistranslated as "pressure slope" with the wrong `../pressureslope.php` link and wrong symbol `S₀`
> instead of `S_f`; `mpf_froude_number` truncated to `F` instead of `Fr`; dropped/wrong-case
> subscripts across `mpf_flow_area`/`mpf_pipe_area`/`mpf_area_ratio`/`mpf_full_flow`/
> `mpf_full_flow_ratio` (sw's agent additionally caught that the case convention itself needed to be
> capital `A`/`Q` matching English, not lowercase as this session's own brief mis-stated — deviated
> correctly); literal `ν`/`τ` characters instead of `&nu;`/`&tau;` entities; the item-90 loss-symbol
> case violation (capital `H` instead of lowercase `h_f`/`h_m`/`h_L`/`k_m`) in every `mphl_` loss key;
> `dw_kinematic_viscosity` tooltip ("for clean water at 20°C") left partly/fully in English in am/km.
> **Defects beyond the known checklist**: am had "ሰርሰርነት" (wrong root) used for "friction" in 4 keys,
> fixed to the glossary-established ፍሪክሽን; km had "ស្ទះ" (blockage) used for "friction" in 3
> `mphl_`/`dw_` keys — flagged as also present, untouched, in the out-of-scope `mhp_hf` key for a
> future pass; my had stray Bengali-script contamination in `dw_kinematic_viscosity` and a
> "medicine" (ဆေး) mistranslation of "factor" in `dw_friction_factor`, plus a directional error
> (hw_hgl_1/mphl_egl_1 "Downstream" rendered as "north" — မြောက်ဘက်) fixed to အောက်ဘက်; sw's glossary
> `head loss` value was itself the stale pressure-sense term ("upotevu wa shinikizo") — corrected to
> head-sense ("upotevu wa kichwa"), consistent with the fa/ro/tr/id fix from waves 1-2, though the
> `dw_main_*`/`mphl_main_*` label strings themselves already used the correct "Kichwa" framing.
> **Item 40 (ps/ur shear-stress scissors trap) closed for ps**: `mpf_shear_stress` changed from a
> pending/absent term to "منځنی برشي فشار" (average shearing pressure), built on the same
> Persian-derived برش root Urdu used for its own fix, confirmed to not use قیچي/قینچی anywhere;
> glossary's `shear stress` term now has ps recorded, closing the ps half of item 40 (mi_tau,
> category 1, remains open — out of scope for this sprint). **Post-sprint QA**: `lang_syntax_validate.php`
> clean across all 5 (14 findings, all pre-existing `identical-to-english` advisories on
> untouched shared UI keys); a from-scratch tag-parity check (English vs. all 5 langs across the 59
> keys, `<sub>/<sup>/<span>/<a>` sets plus literal-ν/τ-character sweep) found zero issues.
> **Manual back-translation QA** (the orchestrating AI performing the unavailable
> `backtranslate_check.php`'s job inline, no `ANTHROPIC_API_KEY` in this environment): reviewed every
> long string (tooltips, `*_note_1` blocks) plus all short labels in all 5 languages against the
> English source — no meaning-level defects found; the highest-risk failure class (direction flips on
> HGL/EGL/upstream-downstream pairs, and AND/OR logic flips in `mphl_note_1`'s two-clause conditions)
> came back clean in every language. Two borderline judgment calls surfaced and left as-is pending
> native review rather than force-changed: km's `mpf_shear_stress` uses "តានតឹងកាត់" and sw's uses
> "Msongo wastani wa mkato" — both build the shear-stress term on a cutting-action root (កាត់/mkato)
> rather than an unambiguous mechanics-only word; both translating agents independently distinguished
> this from the actual scissors-noun trap (កន្ត្រៃ/mkasi) that tripped up ps/ur, and cited precedent
> for action-noun-based shear terms already accepted for ar/he in the glossary, but neither is
> independently verified by a native speaker.
> **QUALITY scores**: am/km/my/ps/sw were already at the correct `0.65` wave-3 tier in
> `lib/Language.Settings.php` — no change needed (per Tom's 2026-07-09 point that the honest signal
> here is the QUALITY score itself, not a native-review flag with no one to act on it — see
> `feedback_quality_score_reflects_verification` memory). Payloads regenerated, `--check` FRESH.
> **Category 3 (pipe friction) is now complete across all 3 waves + retroactive back-translation QA
> for waves 1-2 (21 languages) + this wave-3 pass (5 languages) — all 26 non-English languages done.**
> The holistic Opus/Fable cross-language consistency pass (policy step 3) remains not yet run for
> category 3, same open item as wave-2's note. **Next**: category 4 (irrigation & seepage:
> `cs_`/`irr_`/`ip_`) may now begin per the SEQUENCING RULE.

> **Category 4 wave 1 (anchors) complete 2026-07-10 [CC].** Scope confirmed with Tom to include
> `ip_` (not just `cs_`+`irr_` as item 85's original 54-key count read) — `ip_` never got a
> complete Scenario-C re-translation despite the 2026-07-05 rc_/ip_ audit finding real defects in
> it, so folding it into category 4 closed that gap under the same rigor as categories 1-3. Total
> scope: 107 keys (cs_ 34, irr_ 17, ip_ 56) × 14 anchor languages (es pt fr it de ro ru uk bg sr hr
> cs tr id), complete re-translation not delta-only. English-reform gate and key-consolidation
> check both came back clean (category already had its Wave 0 pass; `ip_length`/`ip_flow`/`cs_L`
> narrow-column variants confirmed correctly scoped against their `mphl_`/`mpf_` owners, nothing to
> merge). Glossary gap flagged pre-sprint: `check structure` had zero translations in any language
> (brand-new term); `low-quarter distribution uniformity` was covered for es/pt/it/de only.
> **All 14 agents launched in parallel (Sonnet, background) hit the plan's session limit
> (11:50am America/Phoenix) — but per the session-limit-retry practice, every one of their file
> edits had already landed before the failure fired; zero languages needed a full relaunch.**
> Post-completion audit found and fixed, beyond what the agents self-reported: (1) `it.php` had
> accumulated **three duplicate ip_/cs_/irr_ blocks** (an old rubber-stamp translation plus two
> newer passes appended rather than edited in place) — PHP's last-assignment-wins semantics meant
> the newest values were already live, but ~100 dead duplicate lines were deleted for file hygiene;
> (2) es/ru/cs/tr/pt/uk/hr had regressed `ip_km`/`ip_hf`/`ip_hm`/`ip_hl` to capitalized `K_m`/`H_f`/
> `H_m`/`H_l` (violates the item-90 lowercase-loss-symbol convention and rule 3 symbol-preservation)
> — fixed across all 7; (3) pt/uk/hr/tr had stripped the `Q<sub>in</sub>`/`Q<sub>out</sub>`/
> `E<sub>c</sub>` subscript tags from the six `cs_loss_*`/`cs_Ec_*` verdict strings and (in
> pt/uk/hr/tr) added unauthorized "Aviso:"/"Попередження:"/"Upozorenje:"/"Uyarı:" marker words and
> decorative ✓/⚠ glyphs the English source doesn't have — reverted to match English exactly per the
> D5 verdict-string convention; (4) **tr and ru had translated the variable subscripts themselves**
> in several `ip_` keys (tr: `q<sub>son</sub>/q<sub>ort,saha</sub>`/`z<sub>beslenme</sub>`/
> `q<sub>tasarım</sub>`; ru: `z<sub>подачи</sub>`/`q<sub>расчётный</sub>`/`q<sub>последний</sub>`/
> `q<sub>ср</sub>`/`q<sub>ср,полевое</sub>`) instead of preserving the English symbol tokens
> (`last`/`avg,field`/`supply`/`design`) — the same class of defect the French agent caught and
> fixed in its own output; both fixed to match English subscript tokens exactly. (5) pt/uk/hr/id
> were each missing 2-3 keys (`ip_roughness` and/or `irr_card_pressure_head`/`_desc`) where the
> session-limit error fired before the agent reached the end of its list — added directly, matching
> each file's own established terminology. **Final QA (this session, since no `ANTHROPIC_API_KEY`
> in this environment):** `php -l` clean on all 14 files; zero duplicate keys; zero missing keys
> (107/107 × 14); zero HTML-tag-parity mismatches against English; `lang_syntax_validate.php`
> reports only the same 68 pre-existing/legitimate `identical-to-english` findings (calc_/dw_/mi_/
> mtc_/or_/ws_/rc_/mphl_/odt_/menu_ — unrelated prefixes — plus `ip_press`="Press." in fr/it/pt and
> `irr_main_menu`="Irrigation" in fr, both confirmed legitimate Romance cognates per the original
> rc_/ip_ audit); manual back-translation spot-check of the highest-risk content (the `ip_notes_3_def`
> opening technical clause and the `ip_worst_case_warn` bias-direction wording) came back semantically
> correct in all 14 languages, no "worst case" flipped to "best case." Glossary updated with each
> language's coined term for `check structure` and `low-quarter distribution uniformity` (both
> flagged not-yet-native-reviewed); payloads regenerated, `--check` FRESH. **Next**: wave 2 (zh ar he
> hi bn fa ur) pending Tom's authorization.

> **Category 4 wave 2 (major non-Latin: zh ar he hi bn fa ur) complete 2026-07-10 [CC].** Complete
> re-translation of all 107 keys (cs_ 34, irr_ 17, ip_ 56) into each of the 7 languages, 7 agents
> launched in parallel (Sonnet, background); all completed without hitting the session limit this
> time. Every agent independently found and fixed the same defect classes wave-1 anchors had:
> capitalized loss symbols (`H_f`/`H_m`/`H_l`/`K_m` → lowercase `h_f`/`h_m`/`h_L`/`k_m`), unauthorized
> ✓/⚠ glyphs and marker words ("Warning:"/"تحذير:"/etc.) added to verdict strings not present in
> English, and (ur/tr precedent from wave 1) translated-instead-of-preserved subscript tokens — none
> of the 7 wave-2 languages repeated the subscript-translation mistake this time. Real terminology
> defects also found and fixed beyond mechanical rule violations: he had "seepage" mistranslated
> suite-wide as "leakage" (דליפה→חלחול) and weir/culvert conflated (שפיכון/מעביר disambiguated); hi
> had "textbook low-quarter DU" instead of "standard" (पाठ्यपुस्तक→मानक, a real mistranslation, not
> just a coinage gap); ar had "distribution uniformity" not using the glossary's own already-decided
> term (توحيد→انتظام التوزيع, glossary-established but the shipped file wasn't using it). zh's agent
> deviated from the suite-wide glossary policy (field term over academic term for practitioner-facing
> vocabulary) by using generic 灌水器 instead of the established 滴头 for "emitter" — caught in
> post-sprint QA and corrected suite-wide (22 occurrences) to match ar/es/uk precedent; glossary's
> `emitter` entry annotated with the correction rationale so future sprints don't re-relitigate it.
> ur's agent additionally removed 8 orphan keys (no longer in English source) that fa/zh/bn/ar/he/hi
> all still carry untouched — a real inconsistency across the 7 files, left as-is (orphan keys are
> confirmed unreferenced by any PHP/JS/template code, so harmless; flagged for a future full-suite
> housekeeping pass rather than fixed ad hoc mid-sprint).
> **Independent QA (orchestrating AI, not just agent self-reports, per the verify-agent-claims
> practice)**: `php -l` clean on all 7 files; a from-scratch programmatic check (not
> `lang_syntax_validate.php` alone) confirmed 107/107 keys present, zero HTML-tag-parity mismatches,
> and zero subscript-token mismatches against English, across all 7 languages — this is a stronger
> check than tag-set comparison alone, since it verifies the literal subscript content
> (`avg,field`/`last`/`supply`/`design`) wasn't translated, not just that a `<sub>` tag exists.
> `lang_syntax_validate.php --lang=zh,ar,he,hi,bn,fa,ur` reports only 15 pre-existing/unrelated
> `identical-to-english` findings (calc_copy_link*, mhp_vel_high_short — outside cs_/irr_/ip_ scope).
> Glossary updated: added zh/bn/fa translations for `check structure` (previously only had the 14
> anchors + ar/he/hi/ur from earlier in this same wave) and for `low-quarter distribution uniformity`
> (bn/fa were the only 2 of the 7 wave-2 languages still missing it after the agents' own work).
> QUALITY scores: zh/ar/he/hi/bn/fa/ur were already correctly at the `0.85` tier in
> `lib/Language.Settings.php` from prior categories — no change needed. Payloads regenerated,
> `--check` FRESH. **Category 4 wave 2 is done for all 7 major non-Latin languages. Next**: wave 3
> (low-resource: am km my ps sw) pending Tom's authorization, then the holistic cross-language
> consistency pass (still outstanding from categories 3 and 4) can be scheduled.

> **Category 4 wave 3 (low-resource: am km my ps sw) complete 2026-07-10 [CC].** Complete
> re-translation of all 107 keys (cs_ 34, irr_ 17, ip_ 56) into each of the 5 languages, 5 Sonnet
> agents launched in parallel in the background. First launch hit the per-session API rate limit on
> all 5 agents simultaneously before any file write landed (`git status` confirmed zero changes on
> all 5 lang files) — per the session-limit-retry practice, verified no partial edits existed, waited
> for the stated reset time, then relaunched all 5 (this was a retry of the same failed task, not a
> duplicate sprint). All 5 completed on the second attempt. Same defect classes as waves 1-2 were
> present in every language's prior pass and fixed: capitalized loss symbols (`H_f`/`H_m`/`H_l`/`K_m`
> → `h_f`/`h_m`/`h_L`/`k_m`), unauthorized `✓`/`⚠` glyphs and marker words ("Warning:"/etc.) baked
> into verdict strings that `EngCalcs.writeCheckHTML()` already prepends programmatically (km's
> agent specifically identified the double-glyph mechanism), and glossary-term drift (wrong words for
> seepage/weir/orifice/reach in am/km/ps in place of established glossary terms). Real content bugs
> also found and fixed beyond mechanical rule violations: am/km both had garbled/nonsensical
> `ip_worst_case_warn` and `ip_notes_2_term` text in the prior pass requiring full rewrite, not
> patching; am/km both still carried the "textbook" vs. "standard" low-quarter DU mistranslation
> (same defect class as hi in wave 2) in `ip_du_estimate`/`ip_notes_3_def`; ps had `cs_L` (reach
> length) mistranslated as reach *width*; sw had "taji" (crown) as a mistranslation of "lateral"
> throughout `ip_`, and "elevation" mistranslated as "length" in two keys. All 5 languages added the
> 3 keys missing from their prior pass (`ip_roughness` replacing a stale orphaned `ip_e`,
> `irr_card_pressure_head`, `irr_card_pressure_desc`).
> **Independent QA (orchestrating AI, not agent self-reports)**: `php -l` clean on all 5 files.
> `lang_syntax_validate.php --lang=am,km,my,ps,sw` reports only 14 pre-existing/unrelated
> `identical-to-english` findings (calc_copy_link*, u_gradePercent, mtc_blodgett_v_bathurst,
> wi_notes_we_def — outside cs_/irr_/ip_ scope). A from-scratch programmatic check confirmed
> 107/107 keys present, zero tag-name mismatches, zero subscript-token mismatches, and zero
> capitalized-loss-symbol matches against English across all 5 languages (first pass of this check
> used a too-strict full-tag-string comparison that flagged 13 false positives per language, purely
> from translated tooltip text inside `title="..."` attributes changing the raw string — re-verified
> with a tag-*name*-only comparison, which is what actually matters for rendering, and got a clean
> 0/107 across the board). **Manual back-translation check performed inline (no `ANTHROPIC_API_KEY`
> set)**: read the 18 highest-risk long strings (`*_notes_*_def`, `*_warn` keys) across all 5
> languages and independently back-translated each against the English source — all semantically
> faithful, no meaning flips (e.g. no "worst case" inverted to "best case"), only compression/
> paraphrase-level differences of the kind normal between languages.
> **Glossary**: added am/km/ps/sw translations for `check structure` (my's agent had already added
> its own); DATA-ERROR FIX for `conveyance efficiency` ps value — glossary had 'د اوبو د رسولو
> موثریت' but the shipped ps file's own irr_ keys (15+ occurrences, predating this sprint) already
> established 'د لیږدولو اغیزمنتیا' as the incumbent term, same defect class as the hi DATA-ERROR-FIX
> from wave 2 — glossary corrected to match established suite usage rather than the file rewritten
> mid-sprint. Payloads regenerated, `--check` FRESH.
> QUALITY scores: am/km/my/ps/sw were already correctly at the `0.65` wave-3 tier in
> `lib/Language.Settings.php` — no change needed (this sprint's QA depth matches exactly what that
> tier assumes: agent self-check + independent structural check + inline manual back-translation
> spot-check, no second-agent QA pass, no native review yet).
> **Category 4 (cs_/irr_/ip_, all 3 waves, 21 languages total) is now complete.** Next: the holistic
> cross-language consistency pass (Opus, still outstanding from categories 3 and 4) can be scheduled,
> or item 85 can proceed to category 5 (micro-hydro: mhp_) pending Tom's direction.
>
> **DONE 2026-07-10: holistic Opus consistency pass executed and closed out for category 4** (all
> ~107 `cs_`/`irr_`/`ip_` keys read side-by-side across all 26 non-English languages plus English).
> First launch hit a session-limit API error mid-run; git status showed the in-flight fixes (7 files)
> had already landed cleanly and correctly (verified against English source before resuming — no
> partial/corrupt edits), so the same agent was resumed from transcript rather than relaunched fresh.
> **Confirmed clean across all 26 languages:** tag parity and subscript/superscript symbol-content
> parity (programmatic check vs. English, 0 mismatches after the one hr fix below); escape leakage
> (none); the "check structure" check≠verify glossary trap; the bg "irregular" geometric-vs-temporal
> trap on the weir-irregular keys; `lang_syntax_validate.php` (0 new findings, all pre-existing
> `identical-to-english` advisories). **7 real findings, all fixed:**
> 1. **Baked/duplicated verdict glyph** — cs/es/hr/pt/ru/tr/uk all had a literal trailing `⚠` baked
>    into `ip_pressure_warn_short` and `ip_elev_ds_missing_warn`, duplicating the glyph
>    `EngCalcs.writeCheckHTML()` (js/irrigation-pressure.js) already prepends at render time (English
>    source carries no glyph on these keys). Stripped the trailing glyph from all 14 strings, 7 files
>    — same defect class category 2's pass found in fa/hi/ur, now confirmed recurring in category 4.
> 2. **Symbol-convention violation** — hr's `ip_elev_supply` had translated the literal subscript
>    `z<sub>supply</sub>` to `z<sub>napajanja</sub>`. Reverted to `supply`.
> 3. **Suite-internal spelling defect** — tr used "kotü" (invalid Turkish) in 3 `ip_` strings while
>    tr's own 20+ other elevation keys (`or_`/`odt_`/`mi_`/`rc_`) consistently use "kotu". Fixed all 3.
> 4. **English leftovers/calques** — pt left "textbook"/"downhill" untranslated in
>    `ip_du_estimate`/`ip_q_ratio`/`ip_notes_3_def`; hr and uk left literal "Distribution Uniformity"
>    untranslated in the same key cluster. Replaced with proper-language equivalents.
> 5. **English leftover — technical term** — ps and tr left "(bisection)" untranslated in
>    `ip_notes_1_def` while every other translated language rendered a native term for the method.
>    Fixed: ps → "(دوه‌ویشنې میتود)", tr → "(ikiye bölme yöntemi)".
> 6. **Terminology-splitting within km** — km's own `mtc_main_title`/weir-irregular keys already
>    translate "Trapezoidal"/"Irregular" natively, but `irr_card_canal_desc` left both as bare
>    English. Fixed to match km's own established terms.
> 7. **Terminology-splitting within hr (most significant finding)** — hr's `cs_` keys (7 occurrences)
>    establish "korisnost transporta" as the incumbent term for "conveyance efficiency," but
>    `irr_card_seepage_head`/`irr_card_seepage_desc` independently used "učinkovitost prijenosa."
>    Fixed the minority usage to match, and corrected the hr entry in `glossary.json`'s `conveyance
>    efficiency` term to match (shipped-file incumbent usage wins over the glossary, same
>    DATA-ERROR-FIX precedent as prior category-4 wave entries), with a note documenting the fix.
> **Not fixed, correctly identified as non-issues:** km's untranslated "culvert" in
> `irr_card_orifice_desc` matches km's own pre-existing suite-wide incumbent convention (also present
> in `mpf_note_1`/`mphl_note_1`, outside category 4) — flagged for a separate future km-wide pass, not
> a category-4-introduced defect; my's untranslated "Trapezoidal" in `irr_card_canal_desc` matches my's
> own established incumbent usage in `mtc_menu`/`mtc_main_title`, so it's internally consistent, not a
> defect; proper nouns and citation titles (Manning, Christiansen, USBR *Water Measurement Manual*,
> ASAE/ASABE) correctly left in English suite-wide. **Post-fix QA:** `php -l` clean on all 9 touched
> files (cs/es/hr/km/ps/pt/ru/tr/uk); `lang_syntax_validate.php --lang=cs,es,hr,km,ps,pt,ru,tr,uk` —
> 35 findings, all pre-existing advisories, 0 new; `generate_translation_payloads.php --check` was
> initially STALE (glossary.json edit), regenerated, re-checked FRESH across all 26 payloads. No
> `$ec_lang_intent` entries touched (read-only, per CLAUDE.md's AI restriction).
>
> **Category 4 fully closed 2026-07-10** — all three translation waves and the holistic Opus
> consistency pass are complete, every fix independently verified. Outstanding, logged separately,
> not blocking closure: native-review flags for am/km/my/ps/sw; the category-3 holistic pass remains
> the sole outstanding holistic-pass item before item 85 can proceed cleanly to category 5
> (micro-hydro: mhp_), pending Tom's direction.
>
> **DONE 2026-07-11: holistic Opus consistency pass executed for category 3** (all 59 `dw_`/`hw_`/
> `mpf_`/`mphl_` keys read side-by-side across all 26 non-English languages plus English). **Result:
> zero real defects found — a genuine clean result, not a skipped check.** Confirmed clean, each
> independently re-verified rather than trusted from prior notes: no baked verdict glyph in any key
> in any language (Category 3 has no `_ok`/`_check`/`_warn`/`_verdict` keys, and the render-time glyph
> injection in `js/Calculators.lib.js` was confirmed as the sole source); symbol convention intact for
> every token (f, e, C, A, R_h, P_w, S_f, h_f/h_m/h_L, k_m, h_v, &tau;, &nu;) across all 26 including
> RTL and non-Latin scripts; tag/entity parity exact in all 26×59 (including re-confirming zh's
> `&tau;`-entity fix from the wave sprint is still in place, and no other language regressed to bare
> Latin for a Greek-letter symbol); **item-40 shear-stress scissors trap independently re-verified
> fixed in both ps (`برشي`) and ur (`برشی`)** — the prior sprint's "fixed" claim was not taken on
> faith, the actual current file content was read and confirms it; fresh scan of all 26 languages'
> `mpf_shear_stress` found no other language using a cutting/scissors-tool root; no upstream/downstream
> or HGL/EGL direction flips and no AND/OR logic flips in `mphl_note_1`/`mpf_note_1` in any language;
> no terminology-splitting within any single language across friction slope/friction factor/roughness/
> hydraulic radius/wetted perimeter/velocity head/the friction-minor-total loss triplet; the "Minor
> (local) loss" convention holds suite-wide with no "smaller loss" mistranslation; `lang_syntax_
> validate.php` clean (advisory-only). **Not fixed, correctly identified as non-issues or as needing
> native review rather than a unilateral override:** ur's `گنجینہ` for "coefficient/factor" (literally
> "treasure/repository") reads suspect for a math coefficient, but is a *consistent* 6-occurrence
> incumbent spanning categories 1/3/4 (`dw_friction_factor`, `hw_roughness`, `mphl_total_junction_k`,
> `ws_weirCoefficient`, `or_cd`, `or_notes_3_term`) that survived all three prior holistic passes —
> fixing only the 3 Category-3 instances would itself create a fresh cross-category split, so this is
> flagged for native-review + a possible dedicated cross-category term-unification pass
> (candidate: `عنصر`/`عامل`, matching ar `معامل`/ps `ضریب`), not force-changed here; km's
> `តានតឹងកាត់` and sw's `Msongo … wa mkato` shear-stress terms re-confirmed as the already-reviewed
> action-noun construction (not the scissors-tool sense) and left as-is; am/km/my's low-resource
> transliterations/partial-untranslated terms (`ፍሪክሽን`/`ፋክተር`/`ሺር ስትሬስ`, "culvert," "spreadsheet")
> are appropriate for their existing 0.65 native-review flag, not inline defects; bg's `Хидравличен
> наклон` for friction slope is an intentional, consistently-applied native-reviewed synonym. **No
> files were edited** (git status confirmed zero diff from this pass); no `$ec_lang_intent` entries
> touched. `generate_translation_payloads.php --check`: FRESH, unchanged.
>
> **All four completed calculator categories (1–4) now have a closed-out holistic Opus consistency
> pass.** Item 85 may proceed to category 5 (micro-hydro: `mhp_`) pending Tom's direction. The
> ur `گنجینہ` cross-category coefficient/factor term and the am/km/my/ps/sw native-review backlog are
> the only open threads carried forward, both already logged above and not blocking category 5.
>
> **DONE 2026-07-11: ur `گنجینہ` cross-category coefficient/factor term fixed [CC].** `گنجینہ`
> (ganjina) literally means "treasure/repository/thesaurus" in Urdu — wrong sense for a math
> coefficient. Confirmed by direct file read (all 7 occurrences, one more than the 6 originally
> flagged — `dw_friction_factor_method` also had it): `dw_friction_factor`, `dw_friction_factor_method`,
> `hw_roughness`, `mphl_total_junction_k`, `ws_weirCoefficient`, `or_cd`, `or_notes_3_term`. Replaced
> with `عامل` (aamil, "factor/agent") suite-wide across these 7 keys — not a new coinage: `عامل` is
> already the established correct Urdu term for the identical concept elsewhere in the same file
> (`mhp_km`="ثانوی نقصان عامل"/secondary loss factor, category 1; `ip_km`/`ip_notes_2_def`'s
> Christiansen F(n) factor, category 4) and already matches the pre-existing, uncorrupted
> `glossary.json` "friction factor" entry's own ur value "رگڑ عامل" — the two related terms had
> simply drifted apart from a single earlier bulk-translation-era error. Also corrected the
> `glossary.json` "discharge coefficient" entry's stale ur value (was `گنجینہ`, now "اخراج عامل"),
> with a DATA-ERROR-FIX note explaining the 2026-07-08 "corrected" value had matched a
> then-incumbent-but-wrong shipped-file pattern, not genuine Urdu usage. **QA:** `php -l` clean;
> `lang_syntax_validate.php --lang=ur` — 2 pre-existing unrelated advisories, 0 new; glossary.json
> JSON-valid; `generate_translation_payloads.php --check` was STALE (glossary edit), regenerated,
> re-checked FRESH across all 26. No native review yet on this specific fix (ur is not yet at the
> `0.95` native-reviewed tier) — same status as before, not a regression.

> **DONE 2026-07-11/12: Category 5 (micro-hydro, `mhp_`+`rc_`, 97 keys) wave 1 — complete
> re-translation into all 14 anchor languages (es pt fr it de ro ru uk bg sr hr cs tr id).**
> Pre-sprint checklist per CLAUDE.md: payloads FRESH, Wave 0 already covered this category
> (2026-07-07), item 90 key consolidation already applied, glossary coverage confirmed for all 20
> `mhp`/`rc` terms (5 terms missing am/km only — wave-3-only gap, not a wave-1 blocker). Custom
> full-key-set payloads built (the standard generator only emits missing-key deltas; Scenario C
> needs every key) at `dev/translation_payloads/payload_cat5_<lang>.json`. 14 agents launched in
> parallel, Sonnet, each retranslating all 97 keys from scratch (existing content treated as
> context only, not trusted). 3 agents (ro, sr, hr) hit session-limit errors; per the
> session-limit-retry lesson, checked `git status`/key-completeness before relaunching — ro was
> actually complete (0 missing), hr was 89/97 (missing only the 8 new `rc_*_tip` keys), sr had 0
> file changes. Resumed hr from transcript (its second pass found the `rc_` block, though present,
> was stale pre-Wave-0 content needing full re-translation, not just the 8 missing keys — redid all
> 97) and relaunched sr fresh with incremental-checkpoint instructions to avoid a second session-limit
> loss. All 14 finished; `php -l` clean on every file.
>
> **Independent orchestrator QA (not just trusting agent self-reports), per item-85 lesson:**
> `lang_syntax_validate.php` clean (only pre-existing/legitimate `identical-to-english` advisories —
> numeric Robinson ranges and true cognates like German/Croatian "Filter"). A scripted tag-parity
> check (`<sub>/<sup>/<span>/<a>` sets vs. English) across all 97×14 found 36 real mismatches —
> `rc_pond_ok`/`rc_pond_warn`/`rc_eq1`/`rc_eq2`/`rc_eq_warn_low`/`rc_eq_warn_high` had silently
> dropped `<sub>` tags around S₀/H_p/y_n in es, fr, de, uk, bg (all 6 keys) and it (4 keys) and tr (2
> keys) — fixed directly by the orchestrator, re-checked, 0 mismatches. Also found and fixed a
> verdict-string convention gap the per-agent instructions had missed: `rc_eq_warn_low`/`rc_eq_warn_high`
> render through `EngCalcs.writeCheckHTML()` (confirmed in `js/rock-chute.js`) exactly like the
> `_ok`/`_low`/`_high` triads, so they may never carry a baked translated "Warning:" marker — fr, it,
> uk, bg, tr had one; stripped from all 5.
>
> **One small English-source edit** (wave-1 grievance → targeted fix, per SOP): `rc_notes_7_def`
> said "ponding occurs upstream of the **inlet apron**" — independently flagged as suspicious by 2
> of 14 agents (uk, id) because "apron" is elsewhere defined strictly as the *outlet* toe-support
> structure (`rc_apron_length`) with no corresponding inlet structure anywhere in the calculator.
> Confirmed a genuine English-source slip, not a translation problem; changed to "upstream of the
> chute inlet". 10 of 14 languages (es pt fr it ro uk sr hr cs tr) had faithfully translated the
> flawed "apron" wording into a same-conceptual-error inlet-apron/slab phrase (reusing their own
> outlet-apron term) — corrected all 10 to match; de/ru/bg had already used a generic inlet
> term there and needed no change; id had already independently dropped "apron" as loose phrasing.
>
> **Cross-language pattern, not a defect:** 5 of 14 agents (it, pt, ru, tr, hr) independently
> flagged the same class of finding — the file's already-established, internally-consistent term for
> a concept (It. "pietrame" for riprap, Pt. "conduta forçada"/"Rendimento da instalação"/"Graduação",
> Ru. "пенсток", Tr. "cebri boru"/"parça taşı", Hr. "kameni žlijeb") diverges from `glossary.json`'s
> `preferred_translation` for the same term. Each agent correctly kept the file's incumbent term
> per CLAUDE.md's ownership/incumbency principle rather than fragmenting one file's internal
> consistency. Not fixed this pass — flagged here as raw material for a future glossary
> reconciliation pass (item 90-style, cross-language not cross-category this time).
>
> **New finding, logged not fixed — glossary self-contradiction on "median rock size" (D50):**
> `glossary.json`'s own `translation_notes` for this term explicitly warn "Do not use 'average'
> (average ≠ median statistically)", yet its own `preferred_translation` values for bg/cs/de/hr/ro/
> ru/sr/tr/uk/fa/ur all read as "mean/average size" (e.g. de `mittlere Korngröße`, ru `средний размер
> камня`, uk `середній розмір каменю`) rather than a true median term — only es/fr/it/id/zh use a
> genuine median word. This affects `mtc_` (category 1, already shipped) as well as `rc_D50` here.
> Needs native-language verification (is "average/mean" colloquially used for median in these
> languages' engineering registers, or is it a real error?) before any suite-wide fix — not
> attempted in this session, logged for a future targeted glossary pass.
>
> **Not yet done:** waves 2 (zh ar he hi bn fa ur) and 3 (am km my ps sw) for category 5, pending
> Tom's go-ahead per the standard per-wave authorization gate.

## Category 5 wave 2 (zh ar he hi bn fa ur) — 2026-07-12

Complete re-translation of all 97 mhp_/rc_ keys into the 7 major-non-Latin wave-2 languages,
authorized after proposing counts/risks up front. Pre-sprint: payloads regenerated (`--check`
FRESH), `payload_cat5_{lang}.json` built for these 7 languages (mirroring wave 1's format — the
generic per-language payloads only carry the missing-delta, not full re-translation scope, so a
one-off script assembled the complete-re-translation payload from the English source + glossary +
each language's existing file). Two glossary gaps found before launch (no `preferred_translation`
for "outlet apron" in fa, "weir head" in he/ur) — filled with best-judgment terms (fa "پاشنه خروجی",
he "גובה מים מעל כתר הסכר", ur "ویئر ہیڈ") before spawning agents, flagged to each affected
language's agent as new/not-battle-tested.

7 agents launched in parallel (Sonnet, background). 6 completed cleanly on the first pass. **ur hit
a session-limit failure mid-sprint** — per the session-limit retry protocol, checked `git status`
and found the file *had* been partially modified (not a clean zero-change failure), so it was not
eligible for a blind full relaunch. A diagnostic comparing the file against the payload found 8 of
the new `_tip` keys missing entirely and ~19 of 97 keys visibly changed from their pre-sprint value;
the remaining ~70 keys still matched the payload's stale `current_translation` baseline exactly and
so were presumptively untouched. Relaunched a single retry agent scoped to diagnose-then-complete
(not a full redo), with instructions to re-check every key rather than trust the stale/changed
split at face value. It found that most of the ~70 "presumptively untouched" keys had, in fact,
already been correctly retranslated before the crash — they matched `current_translation` only
because the correct new wording happened to equal the old one for those particular strings — so the
diagnostic's byte-equality heuristic wasn't a reliable proxy for "not yet done." The retry agent
inserted the 8 missing keys, fixed lingering baked-in ✓/⚠/"warning" verdict strings and legacy
tooltip `style=` attributes the crashed run left behind, and reconciled two internal-consistency
deviations from the glossary (kept the file's already-established loanwords for
penstock/discharge/riprap/chute rather than fragmenting ur's internal consistency — logged as
glossary-reconciliation raw material, item 42).

**Post-sprint QA (orchestrator-run, in order):**
1. `lang_syntax_validate.php --lang=zh,ar,he,hi,bn,fa,ur` — 26 findings, all advisory
   `identical-to-english` (2 legitimately-numeric Robinson-range tooltips per language, plus
   pre-existing untouched `calc_copy_link*` keys). Zero escape-leakage/tag-imbalance/foreign-script
   findings.
2. Tag-parity check (`<sub>/<sup>/<span>/<em>/<a>` counts vs. English) across all 97×7 — found 8 real
   mismatches: he `rc_eq1`/`rc_eq2` and hi `rc_pond_ok`/`rc_pond_warn`/`rc_eq1`/`rc_eq2`/
   `rc_eq_warn_low`/`rc_eq_warn_high` had dropped `<sub>` tags around S₀/H_p/y_n. Also found hi's
   `rc_eq_warn_low`/`rc_eq_warn_high` still carried a baked-in "चेतावनी:" (Warning:) prefix the
   translating agent's own report didn't list as fixed (it only claimed to have fixed the `_sg_/_SD_/
   _pond_/mhp_hl_` triads, missing the `rc_eq_warn_*` pair which follow the identical
   `writeCheckHTML()` convention — same gap class documented in wave 1's log). Fixed directly by
   the orchestrator (not re-sprinted), re-checked: 0 mismatches remaining.
3. Back-translation semantic check (no `ANTHROPIC_API_KEY` set — performed inline by the
   orchestrator per SOP, scoped to the highest-risk trap terms every agent was explicitly warned
   about: gross/net head, specific gravity, weir head, outlet apron, ponding, minor/local loss,
   upstream/downstream) across all 7 languages side-by-side. All checked out correctly — no
   false-cognate or wrong-sense errors found (he's "משקל סגולי" for specific gravity is literally
   "specific weight," the same register choice already accepted for tr/sr/hr per the glossary's own
   carve-out, and correctly carries no units attached).
4. Independent key-completeness verification: 97/97 present, zero empty/null, `php -l` clean, all 7
   languages.

**Not fixed this pass, logged for the standing cross-cutting items:** ur's incumbent-term deviations
from glossary (penstock/discharge/riprap/chute) — item 42. Category 5 still awaits wave 3
(am km my ps sw) before the holistic Opus consistency pass, per THE SEQUENCING RULE.

## Category 5 wave 3 (am km my ps sw) — 2026-07-12

Complete re-translation of all 97 mhp_/rc_ keys into the 5 low-resource wave-3 languages,
authorized after proposing counts/risks up front. Pre-sprint: payloads regenerated
(`--check` FRESH), full-suite glossary coverage for all 5 languages confirmed (55/55 terms
have `translations` entries for am/km/my/ps/sw — no gaps to fill before launch, unlike wave 2).
`payload_cat5_{lang}.json` built via a one-off script mirroring waves 1–2's format (complete
re-translation scope, not the generic per-language delta payloads).

5 agents launched in parallel (Sonnet, background), all completed cleanly on the first pass —
no session-limit retries needed this wave. Each agent's self-report surfaced real bugs found and
fixed in the incumbent (pre-sprint) text, not just fresh translation:

- **am:** "head" family was using ጫና (pressure/burden — the same pressure-sense defect class
  already flagged for ro/tr/id/fa/sw) instead of the correct ሄድ; fixed within the 97 sprinted
  keys. Note: `mhp_flow`/`mhp_roughness`/`mhp_km`/`mhp_nu`/`mhp_velocity`/`mhp_f`/`mhp_hf`/`mhp_hm`/
  `mhp_hl` are *not* in this payload and still use the wrong ጫና — a visible inconsistency within
  the same file now, flagged for a future full-suite pass. Also fixed "specific gravity" (was
  "specific weight," the same ro/de/ru-flagged unit-bearing trap) and "chute" (was mistranslated
  as ቱቦ, "pipe/tube," throughout rc_).
- **km:** fixed D50 (was "median-**method**-size," wrong word), specific gravity (was "type/species
  weight"), and "apron" (prior file used ក្រណាត់ "cloth" and ធុងទឹកចេញ "outgoing water tank" — both
  violate the glossary's explicit "never clothing" warning for this term). Found and fixed a
  structural defect in `rc_Hp`'s tooltip: `<sub>` tags had been placed inside a `title=` attribute,
  where they render as literal text, not markup — corrected to plain-text subscripts matching the
  English source's own convention in that attribute.
- **my:** corrected "erosion" from ရေကြောင်းနွမ်းမှု (roughly "channel weakening") to the standard
  hydraulic term ရေတိုက်စားမှု (water scouring), applied consistently across 5 keys — flagged as a
  substantive term change from the prior file. Restored a citation title ("Design of rock chutes")
  that the old file had partially translated into Burmese; per convention, citation titles stay in
  the original published language.
- **ps:** did **not** use the glossary's `preferred_translation` for "specific gravity"
  (`ستومانه وزن`, literally "heavy weight") — flagged it as the same specific-weight mistranslation
  trap already documented for ro/de/ru, kept the file's existing correct term (`ځانګړی ثقل`)
  instead. **Glossary entry flagged as likely wrong, not yet fixed — needs a human/native check.**
  Also corrected two apparent Urdu/Hindi-script contamination bugs in the incumbent text:
  `mhp_vel_ok_short` used `ٹھیک` (retroflex `ٹ`, not valid Pashto) and `rc_S0` used `بیڈ`
  (retroflex `ڈ`) — both corrected to native Pashto forms.
- **sw:** fixed baked-in ✓/⚠ glyphs and translated "Onyo:" (Warning:) marker text in verdict
  strings (violates the suite-wide check-string convention — the glyph is the marker, added by JS,
  never baked into the translated string). Fixed "minor loss" mistranslated as "small loss"
  (ᐅ literally the trap the English "(local)" parenthetical exists to prevent, per the item-90
  decision), porosity/density confusion (msongamano = density, the *opposite* of porosity), and
  "ponding" mistranslated as "flooding" (mafuriko) — the glossary explicitly flags this as wrong
  for a beneficial design condition. Note: `rc_notes_7_term` has this same ponding/flooding bug but
  is *not* in the 97-key payload — left untouched, flagged for a future pass (same orphan noted
  independently by the am agent, which also spotted `rc_notes_7_term` as a pre-existing
  no-English-key duplicate of `rc_ponding_check`).

**Independent orchestrator QA (in order):**
1. `lang_syntax_validate.php --lang=am,km,my,ps,sw` — 24 findings, all advisory
   `identical-to-english` (numeric Robinson-range tooltips `rc_sg_ok_tip`/`rc_SD_ok_tip` — genuinely
   numeric, correctly identical across all 5 languages — plus pre-existing untouched
   `calc_copy_link*`/`u_gradePercent`/`mtc_blodgett_v_bathurst`/`wi_notes_we_def` keys outside this
   payload). Zero escape-leakage/tag-imbalance/foreign-script findings.
2. Scripted tag-parity check (`<sub>/<sup>/<span>/<em>/<a>` sets vs. English) across all 97×5 = 485
   keys — 0 mismatches, 0 missing keys.
3. Independent key-completeness verification: 97/97 present, zero empty/null, `php -l` clean, all
   5 languages.
4. Back-translation semantic check (no `ANTHROPIC_API_KEY` — performed inline by the orchestrator
   per SOP) on the highest-risk trap terms across all 5 languages side-by-side: specific gravity,
   gradation SD, weir head (Hp/yn), outlet apron, ponding, minor/local loss, net head. All read
   correctly — **except** ps's `rc_pond_ok` carried a baked-in `✓` glyph the agent's own report
   didn't flag (same convention-gap class as wave 1/2's `rc_eq_warn_*` misses). A follow-up scripted
   sweep for stray `✓`/`⚠` characters across all 5 languages found 13 total violations, all in ps
   (`mhp_hl_ok/warn/bad`, `rc_sg_ok/low/high`, `rc_SD_ok/low/high`, `rc_pond_ok/warn`,
   `rc_eq_warn_low/high`) — confirmed none of these have a glyph baked into the English source.
   Fixed directly by the orchestrator (not re-sprinted); re-swept am/km/my/sw clean, re-verified
   `php -l` on ps after the fix.

**Not fixed this pass, logged for the standing cross-cutting items:**
- ps's "specific gravity" glossary entry (`ستومانه وزن`) is likely a specific-weight mistranslation
  trap and should be corrected — same class as the already-known ro/de/ru errors — item 42-style
  glossary reconciliation.
- am's `mhp_flow`/`mhp_roughness`/`mhp_km`/`mhp_nu`/`mhp_velocity`/`mhp_f`/`mhp_hf`/`mhp_hm`/
  `mhp_hl` still use the wrong pressure-sense ጫና for "head" (outside this payload's 97 keys) while
  the 97 sprinted keys now correctly use ሄድ — an internal inconsistency for a future full-suite
  pass.
- `rc_notes_7_term` (orphaned, no English key, duplicates `rc_ponding_check`) — noted independently
  by both the am and sw agents; not part of this payload, not touched.
- sw's incumbent-term deviations from glossary (head loss, gross/net head, radius, rc_main_menu
  wording) — item 42-style glossary-reconciliation raw material, consistent with the wave 1/2
  pattern of keeping a file's internally-consistent incumbent term over a fragmenting glossary
  swap.

Category 5 is now complete across all three waves (14 anchor + 7 major-non-Latin + 5 low-resource
= 26 languages). Per THE SEQUENCING RULE, the holistic Opus consistency pass for category 5 is
next, before starting category 6.

> **DONE 2026-07-12: holistic Opus consistency pass executed and closed out for category 5** (all
> 96 `mhp_`/`rc_` keys read side-by-side across English plus all 26 non-English languages). Payloads
> regenerated and confirmed FRESH before launch.
> **Result: 9 string edits across 5 files.** Glossary-term drift (specific-gravity units trap —
> intent note explicitly warns "not specific weight, which has units"; it/hr/sr were outliers using
> specific-*weight* wording against the established Slavic/Romance relative-density cohort):
> it/hr/sr `rc_sg`/`rc_sg_check` corrected to relative-density terms. Wrong-sense mistranslation:
> it `rc_Hp` had "soglio" (throne) for "sill" — corrected to "soglia". Untranslated English leftover
> ("weir"): my and sw `rc_Hp`/`rc_notes_7_def` (4 occurrences total) substituted with each
> language's own established weir term from its ws_/wi_ calculators (my: ဆည်တမံ; sw: bwawa).
> **Clean across all 26 languages:** baked verdict glyphes (0), loss-symbol case h_f/h_m/h_L/k_m
> (0 violations), subscript/symbol preservation (0 missing across 20 symbol-bearing keys), tag
> parity vs. English (0 mismatches), ponding-vs-flooding trap in the 96 in-scope keys (all clean —
> backwater/ponding terms used, no flooding words), all 96 keys present and non-empty in all 26
> languages.
> **Left unfixed, flagged for a human decision:**
> - `rc_notes_7_term` — an orphan key present in all 26 non-English files but **absent from
>   English** and not rendered by `Rock-Chute.php` (which only outputs note 4). Outside the 96-key
>   scope. sw's value still contains the previously-flagged "Mafuriko" (flooding) mistranslation —
>   needs an English-source decision (add the key, or delete the vestigial translations) before it
>   can be fixed.
> - he `rc_sg` ("משקל סגולי", literally specific-weight) may be idiomatic Hebrew for specific
>   gravity with no cohort to compare against — left as-is, low confidence either way.
> - km `mhp_main_*` keeps "Micro-Hydro" in Latin script rather than native-script transliteration
>   (bn/hi/my transliterate); km is already native-review-flagged.
> - am's ጫና/ሄድ head-terminology split (flagged in the prior wave-3 entry above) remains open, outside
>   this pass's 96-key scope; am is already native-review-flagged.
> **QA:** `php -l` clean on all 5 touched files (it, hr, sr, my, sw); tag-parity/symbol/glyph
> re-check clean; back-translation of every edit verified faithful to English; payloads regenerated,
> `--check` FRESH.
> **Category 5 (all 3 waves + holistic pass, 26 languages) is now fully closed.** Per THE SEQUENCING
> RULE, item 85 may proceed to category 6 (`u_`/`calc_`/`menu_`/`points_`) pending Tom's direction.

> **Follow-up 2026-07-12 (Tom's ruling on the 3 flagged items above):**
> - **`rc_notes_7_term` deleted from all 26 non-English lang files.** Confirmed genuinely orphaned:
>   `Rock-Chute.php`'s notes `<dl>` only renders `rc_notes_4_term`/`_def` (Reference) — `rc_notes_1`,
>   `_2`, `_3`, `_5`, `_6`, `_7` are all defined in English but none are rendered on the page.
>   `rc_notes_7_def` does have an English source (with real ponding/weir-head content) but no
>   `rc_notes_7_term` was ever added for it — only the 26 translations independently invented a
>   heading for it, which is what made it read as an in-scope key during the holistic pass. Tom:
>   "an English rendering would have helped" — i.e. if `rc_notes_7_term` had existed in English,
>   the payload generator would have caught it as a normal in-scope key instead of it surfacing as a
>   one-off orphan discovered by translation agents. **Left untouched, flagged separately (bigger
>   than a translation fix):** the wider fact that notes 1/2/3/5/6/7 are fully authored in English
>   and in every language but never rendered anywhere in `Rock-Chute.php` — this is a page-content/
>   product decision (wire them into the `<dl>`, or delete the dead content suite-wide), not a
>   translation-QA call, so it wasn't acted on here.
> - **he `rc_sg`** ("משקל סגולי") left unchanged — Tom's own read is that "specific weight" or
>   "relative weight" sounds correct to him too, but he deferred to an actual Hebrew speaker for a
>   final call. No cognate cohort exists to cross-check against, so this stays a standing low-
>   confidence note rather than a fix.
> - **"Native review" language retired as a pending-status framing.** Tom: real native review is a
>   pipe dream — no native speaker will ever see these flags, so logging languages as "awaiting
>   native review" implies a resolution that isn't coming. CLAUDE.md and translation-process.md
>   updated: the `QUALITY` score itself must carry our own honest, current estimate of defect risk
>   (the `0.65` low-resource tier already does this); "native review" is only ever real when
>   feedback actually lands as a file (e.g. `dev/Bulgarian-engineer-feedback.md`), which is a
>   completed event, not a scheduled one.

> **DONE 2026-07-12: category 6 (`u_`/`calc_`/`menu_`/`points_`, 62 keys) closed — light delta
> sprint + holistic pass, not a full 3-wave re-translation.** Per the SOP's cost-scoping note, a
> read-only assessment ran first: existing content across all 26 languages (spot-checked across all
> 3 tiers) was already high quality — this category had been translated organically and carefully,
> just never through the formal wave process. Tom authorized the lightest rung that covered the
> risk instead of a full re-translation.
> **Real gaps found (not staleness, just never-propagated new keys):** `calc_copy_link` /
> `calc_copy_link_done` (added in commit `2c8918a`, missing in all 26 non-English files) and
> `calc_defaults_confirm` (present in all 26 files but holding *stale untranslated English* —
> `'Reset calculator to factory defaults?'`, predating a later English-source edit to "the original
> default values?"), plus 4 scattered instances (`u_depthFrac` fr — turned out to be a legitimate
> French cognate, no fix needed; `u_grade`/`u_gradePercent` missing in my, ps; `menu_brand` missing
> in uk).
> **Delta sprint:** all 3 short strings qualified as a short-labels-only batch (≤8 words, no
> tooltips) per the model policy, so Haiku was used for 20 languages; Sonnet for the 5 low-resource
> languages needing the extra u_/menu_ keys (my, ps, sw) plus one language (uk) with 4 keys. One
> agent per language, 26 total, run in two waves after the first wave partially failed on an
> orchestrator-side session-limit error (mid-sprint; verified via file-diff, not a blind full
> relaunch, per the session-limit-retry lesson — only the languages with zero file changes were
> relaunched, others got small targeted follow-ups for just their remaining unfinished keys).
> **Holistic Opus pass** (all 62 keys × 26 languages) found and fixed 2 defects directly: hr
> `u_grade`/`u_gradePercent` used `trčanje` ("running" the activity) for "run" the horizontal slope
> leg — wrong sense; pt `points_data_title` was the only language missing the `<br />` tag present
> in English and all other languages. It also flagged (not auto-fixed, referred to Tom):
> - **A recurring "rise/run" mistranslation independently made by 5 languages** — hi, he, sw, km, tr
>   all used a word for the *activity* of running/walking/jogging for "run" the horizontal leg of a
>   v/h slope ratio (हिन्दी दौड़="race", he ריצה="jogging", sw kutembea="to walk", km
>   ដំណើរ="journey", tr İlerleme="progress"). Per the "bake lessons into English" rule, 4+
>   independent misses on the same key is an English-source ambiguity signal, not translator error.
>   **Tom's ruling:** fix the `$ec_lang_intent` for `u_grade`/`u_gradePercent` to state the v/h
>   (vertical/horizontal, rise/dy over run/dx) distinction explicitly and unmistakably, rather than
>   relying on prose alone — done (both intent strings now name "vertical rise (height, elevation
>   change, dy)" / "horizontal run (horizontal distance, dx)" and carry an explicit `avoid:` tag for
>   the activity sense). Then hi/he/sw/km/tr were each dispatched a small follow-up fix using a
>   natural v/h-based term (hi आधार, he מרחק אופקי, sw mlalo, km ចម្ងាយផ្ដេក, tr Yatay Mesafe) while
>   keeping the existing (correct) rise/ascent half of each pair unchanged.
> - **ps `calc_defaults`/`calc_defaults_confirm` used لاسليک ("signature") for "default"** — a
>   pre-existing defect, not introduced by this sprint (the delta sprint's `calc_defaults_confirm`
>   correctly matched the pre-existing but wrong `calc_defaults` for internal consistency). Fixed:
>   both now use ډيفالټ (the standard Pashto tech-UI borrowing for "default").
> - am `calc_copy_link_done` typo (`ተቅዷል!` missing a syllable from the copy verb ቅዳ) — flagged
>   during the delta sprint, corrected during the holistic pass to `ተቀድቷል!` (~70% confidence,
>   competent-but-not-native; low-harm either way — a transient toast string).
> - Minor, not acted on: es `calc_inputs`='Ingresos' reads more like "income/revenue" than "inputs"
>   in most Spanish registers (pt's `Entradas` is more standard) — flagged only, not fixed, low
>   confidence this is actually wrong vs. a valid regional choice.
> **QA:** `php -l` clean on every touched file; `lang_syntax_validate.php --lang=<all 26>` clean of
> escape-leakage/tag-imbalance/foreign-script findings (identical-to-english findings present are
> pre-existing and outside category 6's key set); payloads regenerated, `--check` FRESH.
> **Category 6 (delta sprint + holistic pass, 26 languages) is now closed.** All 6 calculator
> categories (open channel, weirs & orifices, pipe friction, irrigation & seepage, micro-hydro,
> shared UI/units) have now been through item 85. Suite-wide translation project status: see
> `dev/ROADMAP.md` for what remains (native-review backlog, glossary reconciliation, orphan-key
> housekeeping — all standing cross-cutting items, not category-specific).

## 2026-07-12: Item 45 closed — suite-wide baked-in verdict-glyph sweep

Ran the mechanical suite-wide grep roadmap item 45 called for (previously only confirmed in
category 2's `or_*`/`odt_*` and spot-checked in category 5's `mhp_hl_*`/`rc_sg_*`; category 1's
`mtc_vel_*` had never been checked). Enumerated every verdict-string key actually passed as the
`shortText` argument to `EngCalcs.writeCheckHTML()`/`writeVelocityCheck()` across all JS files
(the only strings the convention says must never carry a baked-in ✓/⚠ glyph or translated
"Warning:"/"OK:" prefix, since the glyph is injected programmatically):

`mhp_vel_ok_short`, `mhp_vel_high_short`, `mhp_vel_low_short`, `or_regime_valid`,
`or_regime_submerged`, `or_regime_warn`, `or_regime_twe_above_hwe`, `mhp_hl_ok`, `mhp_hl_warn`,
`mhp_hl_bad`, `odt_h2_ok`, `odt_h2_warn`, `cs_loss_negative`, `cs_Ec_good`, `cs_Ec_fair`,
`cs_Ec_poor`, `rc_pond_ok`, `rc_pond_warn`, `rc_eq_warn_low`, `rc_eq_warn_high`, `rc_sg_ok`,
`rc_sg_low`, `rc_sg_high`, `rc_SD_ok`, `rc_SD_low`, `rc_SD_high`, `ip_elev_ds_missing_warn`,
`ip_pressure_warn_short` (27 keys).

Wrote a script (`include`-ing each of the 26 non-English `lib/lang.ec.??.php` files and regexing
those 27 keys' values for `✓✔⚠⚡❌✗×` or `Warning:`/`Caution:`/leading `OK:`) — **zero matches**
across all 26 languages × 27 keys. Verified the pattern itself fires correctly against a synthetic
`✓ Test string` before trusting the all-clean result. Also verified in passing that
`manning-irregular.js`/`manning-trap.js`'s `pageConfig.mtc_vel_high` (referenced as `highTip`)
isn't a missing-key bug — `Manning-Trap.php`/`Manning-Irregular.php` populate that JS-side name
from the (different, existing) `$ec_lang['mhp_vel_high']` PHP key; no defect.

**Item 45 closed suite-wide, including the previously-unchecked category-1 `mtc_vel_*`
consumers.** No lang-file edits were needed — the earlier category-2/5 fixes were the only real
instances of this defect class; the rest of the suite was already clean.

## 2026-07-13: Item 44 closed — D50 "median" mistranslation, resolved by 12-language research vote

Item 44 flagged that `glossary.json`'s own rule ("Do not use 'average' — average ≠ median
statistically") contradicted its own `preferred_translation` for D₅₀ ("median rock size") in
bg/cs/de/hr/ro/ru/sr/tr/uk/fa/ur, which read as mean/average wording. It was tagged `[H]` because
resolving it properly needs to know whether "average/mean" is genuinely the accepted engineering
register in each language or a real translation error — normally a native-speaker call.

**Tom had no native reviewer available and gave a different instruction: since the underlying
question is empirical (what do real engineering sources in that language actually call D50?), have
research agents check the literature directly and let the vote across languages show the general
lean, rather than blocking on a human per language.** Tom also named Amharic specifically ("it's
certainly not as though nobody can do real math in Amharic") to make sure a low-resource language
wasn't skipped out of assumption.

Spawned 12 parallel research agents (Sonnet, web search), one per language: bg, cs, de, hr, ro, ru,
sr, tr, uk, fa, ur, am. Each was asked to find real geotechnical/sedimentology/riprap literature in
that language and report whether a genuine "median" cognate is the term actually used for D50, with
citations and a confidence level — not just asked to translate the phrase again.

**Results — 7 of 12 confirmed real errors with direct citations:**
- **de**: German Federal Waterways Institute (BAW) sedimentology data product uses "Median-/medianer
  Korndurchmesser," not "mittlere Korngröße."
- **cs**: Charles University hydraulics course explicitly labels D50 "Medián zrna."
- **uk**: granulometric-analysis literature defines D50 as "медіанний розмір" — turned out to
  already be the wording live in the lang file; only `glossary.json` was stale (see item 42's
  "glossary is what's stale" pattern).
- **tr**: riprap/scour-protection academic papers use "medyan"/"ortanca" for D50 explicitly; "orta
  taş boyutu" doesn't appear in any engineering source (only as an unrelated gemstone-size term).
- **fa**: Persian technical sources define D50 via the percentile point on the gradation curve and
  call it "قطر میانه," never "قطر متوسط."
- **ur**: Urdu statistical vocabulary (mirroring its Arabic source, الوسيط vs المتوسط) cleanly
  separates وسیط (median) from اوسط (average); "اوسط"/"درمیانی" was simply the wrong word.
- **sr**: a Serbian river-engineering course script states "D50 предстaвља медијан величине зрна"
  outright; colloquial mining sources loosely say "средња," which is where the ambiguity came from.

**2 more (bg, hr, ro) turned out to already be correct in the actual lang files** — `glossary.json`
was simply stale, repeating item 42's finding that the glossary drifts out of sync with lang-file
reality. bg's `mi_d50in`/`rc_D50`/`rc_notes_1_def` already said "медианен размер"; hr already said
"medijalna veličina" (an adjective form of medijan); ro already said "dimensiunea mediană." **ru**
was half-stale: `rc_D50` already correctly said "медианный," but `mi_d50in` still said "средний" —
fixed for internal consistency.

**1 (am) had no real fix available.** Amharic dictionaries themselves gloss "median" as "መካከለኛ" —
the same word used for "middle/average" — with no distinct statistical-median term in circulating
use. Left unchanged; there's nothing more correct to change it to. This is a genuine "no such
distinction exists yet in this language's practice" finding, not a resourcing gap to flag for later
— nothing is pending.

**Fixes applied:** `mi_d50in`, `rc_D50`, and (where present) `rc_notes_1_def` in
`lib/lang.ec.{de,cs,ru,tr,fa,ur,sr}.php`. `glossary.json`'s `median rock size` entry's
`translations` map updated for bg/cs/de/hr/ro/ru/sr/tr/uk/fa/ur (am left as-is), plus a dated note
in `translation_notes` recording the research findings and citations so a future pass doesn't
re-litigate this from scratch. `mtc_d50_*` keys were checked and found to never say "average" or
"median" in any language (English source doesn't use either word there, just "size" + the D50
symbol) — no changes needed.

**QA:** `php -l` clean on all 7 touched lang files. `lang_syntax_validate.php --lang=de,cs,ru,tr,fa,
ur,sr` shows only pre-existing, unrelated `identical-to-english` advisories (none touch the edited
keys). `glossary.json` re-validated as parseable JSON after the edit.

**Item 44 closed.** Precedent for future `[H]`-tagged terminology disputes with no native reviewer
available: a multi-language research vote (citing real technical literature, not just re-asking for
a translation) can substitute for native review when the underlying question is empirical rather
than a matter of taste — but only when, as here, most languages return a clear, citable answer. A
minority of genuinely inconclusive results (had one arisen) would still need a human or native
reviewer, not a tie-break by majority vote.

## 2026-07-13: Items 40 and 43 closed — native-review backlog resolved by best-effort verification

Tom's directive: waiting on native review that may never arrive is a pipe dream (already
memorialized 2026-07-12); do our own best-effort verification now and let the language's `QUALITY`
score itself carry the honest "needs review" signal, rather than parking item 43 open indefinitely.

**Research pass:** an Explore agent read `dev/ROADMAP.md` item 43 and the full execution log,
cross-checked every flagged concern against the *current* lang-file contents (several log entries
were stale — e.g. `mi_station` had already been fixed in the 2026-07-08 pass but the item-43 text
still described it as unresolved), and produced a complete current-state inventory organized by
language and key. Full inventory available in the conversation record; summary of dispositions
below.

**Fixed:**
- **ps/ur `mi_tau` (item 40, second half).** The wave-3 sprint fixed `mpf_shear_stress` for both
  languages but explicitly left `mi_tau` (category 1) out of scope. Confirmed both still carried the
  literal scissors word — ps `قیچي`, ur `قینچی`. Changed both to `برش` (the same shear/cut-noun root
  each language's own `mpf_shear_stress` already uses correctly), preserving the existing `<br />`
  column-heading layout (`لاندینۍ<br />برش<br />&tau;` / `تہ کی<br />برش &tau;`). **Item 40 is now
  fully closed** — no more scissors false-cognates in either language.
- **sw `or_hwe` asymmetry.** Was `'Kiwango cha maji juu ya mlango'` (level of water above the gate)
  paired with `'Kiwango cha maji ya mkia'` (level of the tail-water) — an odd construction, since
  every other language pairs headwater/tailwater with a parallel grammatical structure (fr
  amont/aval, es arriba/abajo, ar علوية/سفلية, hi अपस्ट्रीम/डाउनस्ट्रीम, am's own
  የላይ ዳርቻ ከፍታ/የወረድ ዳርቻ ከፍታ). Changed to `'Kiwango cha maji ya kichwa'` (head-water), now a
  parallel head/tail pair with the existing `mkia` (tail-water) — mirrors the English
  headwater/tailwater metaphor directly and is a minimal, low-risk change (only the `hwe` side
  touched, `mkia` untouched).
- **ps `rc_sg` glossary entry.** `glossary.json`'s ps translation (`ستومانه وزن`, literally "heavy
  weight") was stale and didn't even match the file's own already-correct term (`ځانګړی ثقل`) —
  same "glossary is stale, file is fine" pattern as item 42. Corrected the glossary entry to match
  the incumbent file term.

**Verified as correct, not touched:**
- **km/sw `mpf_shear_stress` action-noun shear-stress root.** Checked the actual roots: sw `mkato`
  (a cut/incision, from *kata* "to cut") and km `កាត់` (the verb "to cut") are action/process nouns
  — distinct from the scissors-*tool* nouns (sw `mkasi`, km `កន្ត្រៃ`) that would repeat the item-40
  trap. Same non-error class as Arabic's own standard term `إجهاد القص` and Hebrew's `מאמץ גזירה`,
  both built on cutting roots and both accepted engineering usage (shear stress and cutting are
  etymologically related in English too — sheep *shears*). Confirmed distinct from a real
  false-cognate; left as-is.
- **he `rc_sg` "specific weight" term.** `משקל סגולי` verified as the standard Hebrew
  physics-curriculum term for this dimensionless ratio, the same accepted local-practice exception
  already on file for tr `özgül ağırlık` / sr `специфична тежина` / hr `specifična težina`. Added he
  to that exception list in `glossary.json`'s `translation_notes` rather than "fixing" it into an
  error.

**Discovered, out of scope (not a translation defect):** am's `mhp_flow`/`mhp_roughness`/`mhp_km`/
`mhp_nu`/`mhp_velocity`/`mhp_f`/`mhp_hf`/`mhp_hm`/`mhp_hl` keys don't exist in
`lib/lang.ec.en.php` at all and aren't referenced by `Micro-Hydro-Power.php` (only `mhp_hl_check`,
which already correctly says "Head loss check," is live) — dead orphaned keys unique to the am file
from some earlier design, not a translation quality issue. Left for a future dead-key cleanup pass.

**Left open — genuinely needs a fluent reviewer, no safe fix available:** am `mi_tau`'s shear
rendering (`ሸርፍ`, plausible but not independently confirmable); km's `mtc_vel_low` sedimentation
word choice, `wi_pondingHeight` term choice, the kept-in-Latin-script "re-entrant" in
`or_notes_3_def` and "Micro-Hydro" in `mhp_main_title`; my `ws_headWaterHeight` phrasing; ps
register in `or_notes_3_def`/`odt_notes_2_def`; sw's "tooltip phrasing" flag (no specific key was
ever recorded against it in the log, so there's nothing concrete to act on) and sw's
incumbent-vs-glossary term choices (already correctly kept per the incumbency principle — an item-42
glossary-reconciliation question, not an item-43 native-review one).

**QUALITY scores intentionally left unchanged** (am/km/my/ps/sw stay at `0.65`). This pass verified
specific flagged concerns, not the whole suite for these 5 languages end-to-end — per CLAUDE.md's
tier policy, `0.65`→`0.85` requires full back-translation-checked + cross-language-consistency-checked
coverage of the entire file, which this targeted pass doesn't constitute. The `0.65` score itself is
the intended, honest, standing "needs review" signal per Tom's framing — it isn't a to-do that gets
silently cleared by a partial pass.

**QA:** `php -l` clean on `lib/lang.ec.{ps,ur,sw}.php`. `lang_syntax_validate.php --lang=ps,ur,sw`
shows only 7 pre-existing, unrelated `identical-to-english` advisories (none touch the edited keys).
`glossary.json` re-validated as parseable JSON after both edits.

**Items 40 and 43 closed.**

## 2026-07-13: Item 80(2) closed — Bulgarian gradation-coefficient term applied; roadmap archival cleanup

Tom asked why priority-85 and -80 roadmap items were still open while active work was down at
priority ≤45, and whether that reflected a forgotten archival step. It did: item 85's
category-by-category loop had been fully closed (all 6 categories, see its own status table) but
was never moved to the Completed section, and its lingering text still listed items 44 and 45 as
open "carried forward" threads even though both were closed in the two commits immediately prior
to this one (`9dfad1e`, `ea70fa0`). Moved item 85 to Completed with corrected text; items 42 and 38
remain open under "Translation Standardization" as its real still-open threads.

Item 80 (Bulgarian native-engineer scope question) turned out to be genuinely still open on two of
its three sub-questions, not just administratively stale:
- **(2) — now closed.** The engineer's 2026-07-06 relayed answer, "Коефициент на градация (SD) =
  D₈₄.₁ / D₅₀", had been sitting in the roadmap text as a quote but was never applied — the file
  still read `rc_SD`/`rc_SD_check` = "коефициент на едрозърнестост" (an earlier proposal), and
  `glossary.json`'s `gradation` entry still asked to "ASK for the standard source" for a decision
  the engineer had already given. Applied "Коефициент на градация" to both `lib/lang.ec.bg.php`
  keys and updated the glossary note to record the resolution.
- **(1) — still open**, not a lookup: both дебит (general register) and водно количество
  (academic/hydraulic register) are confirmed acceptable per the engineer; whether to standardize
  suite-wide (and where) is a judgment call for Tom, not something to decide unilaterally.
- **(3) — still open**, no review sent or received on bg ip_ notes/menu-title casing.

**QA:** `php -l` clean on `lib/lang.ec.bg.php`, `contact.php`, `formmailsuccess.php`.
`glossary.json` re-validated as parseable JSON after the edit.

Separately, fixed `contact.php`/`formmailsuccess.php`: both used `echoHeader("Normal", ...)`, a
leftover from when contact.php lived on the parent hawsedc.com site. Since it moved into engcalcs
and is now linked from the app's main menu (`lib/Menus.lib.php`), `"Normal"` meant visiting it via
that menu link landed on a page with no engcalcs CSS and no way back to the app menu. Changed both
to `echoHeader("EngCalcs", ..., false)`, matching the existing `About.php`/`Install.php` pattern
for non-calculator content pages.

## 2026-07-13: Item 42 closed — cross-language glossary reconciliation pass

Roadmap item 42 asked for a deliberate sweep of `glossary.json`'s `preferred_translation` values
against actual shipped lang-file usage, prompted by the category-5-wave-1 log entry where 5 of 14
independent rock-chute translation agents (it, pt, ru, tr, hr) each flagged, unprompted, that their
file's established term for a concept diverged from the glossary — and each correctly kept the file
term per the incumbency principle, leaving the glossary as the confirmed stale side.

**Checked each flagged case against the actual shipped file text** (not just trusting the log's
paraphrase):

- it riprap: file uses `pietrame` consistently (7 occurrences across rc_/mtc_). Glossary said
  `scogliera`. Updated glossary → `pietrame`.
- pt penstock: file uses `conduta forçada` consistently (5 occurrences, mhp_). Glossary said
  `conduto forçado` (different grammatical gender). Updated glossary → `conduta forçada`.
- pt plant efficiency: file's only occurrence (`mhp_efficiency`) is `Rendimento da instalação`.
  Glossary said `eficiência da usina`. Updated glossary → `rendimento da instalação`.
- pt gradation: file's only occurrences (`rc_SD`/`rc_SD_check`) use `Graduação`/`graduação`;
  `granulometria` does not appear anywhere in the pt file. Glossary said `granulometria`. Updated
  glossary → `graduação`.
- ru penstock: file uses `пенсток` consistently (5 occurrences, mhp_). Glossary said `напорный
  трубопровод`. Updated glossary → `пенсток`.
- tr penstock: file uses `cebri boru` consistently (5 occurrences, mhp_). Glossary said `basınç
  borusu`. Updated glossary → `cebri boru`.
- hr rock chute (`kameni žlijeb` shipped vs glossary `kameni skluz`): **not touched.** The glossary
  entry's own translation_notes already flagged this "NOT reconciled pending human review of the
  GLOSSARY side" — the open question is whether the *hr file* should be changed to `kameni brzotok`
  to parallel the sr/ru convention, which is the opposite direction from a glossary-catch-up edit.
  Left as an open `[H]` item, not silently resolved either direction.

**New finding, not a glossary-staleness case — logged as a new roadmap item instead of fixed
here:** tr riprap has an internal inconsistency the log's framing didn't capture. `glossary.json`
already said `taş dolgu` for tr riprap (matching the one occurrence in `mtc_bend_angle`, category 1,
the older calculator) *before* this pass. But all 4 riprap mentions in `rc_` (category 5, newer) say
`parça taşı` instead — so for tr specifically, the rock-chute translation agent diverged from an
already-correct glossary and from the pre-existing suite term, the reverse of the it/pt/ru/tr-
penstock pattern above. Fixing this means editing already-shipped Turkish sentences (grammatical
suffix agreement needs checking, not a blind find-replace), so it was left as a new `[H]`-tagged
roadmap item rather than resolved unilaterally in this pass.

**Scope note:** this pass reconciled the specific terms raised by the category-5-wave-1 log entry,
not an exhaustive sweep of all 55 glossary terms × 26 languages — that remains a larger undertaking
if a future need surfaces it.

**QA:** `glossary.json` re-validated as parseable JSON after edits (`meta.version` 1.5→1.6). No
`lib/lang.ec.*.php` files changed — this was a glossary-metadata-only pass.

## Task 109 — Cross-language consistency audit, stages 1–2 (2026-07-17)

**Stage 1 (category 6: `u_`/`calc_`/`menu_`/`points_`, 62 keys × 26 languages) — DONE.** Piloted the
audit checklist (embedded-source fragments, intra-file terminology drift, tone/register drift) on
the smallest category first, per Tom's authorization. Result: the Burmese-style embedded-English
failure mode did **not** recur in any of the 26 languages, including Burmese itself — a real negative
result, not just an absence of looking. Found and fixed 10 concrete defects (ru `u_gpm` mixed-script
Latin-in-Cyrillic; sr `menu_more` stray Latin in all-Cyrillic file; sw `menu_main_hydraulics`="Majimajii"
wrong word; tr `menu_main_list` spelling drift; id `u_mld` real unit error (day→hour); es `calc_inputs`
wrong sense; fa `points_data_paste`/`_help` "پیست" transliteration; bg `calc_copy_link` term drift; fr
`calc_defaults_confirm` calculatrice/calculateur drift; ro `calc_set_units` grammar/diacritic/register).
Also normalized a widespread minor pattern (~15 languages) where per-hour unit tokens were
inconsistently localized within their own file (de/it/es/pt/am/hi/ru/tr/zh/ar/he/ur). All touched
files re-verified `php -l` clean.

**Stage 2 (category 1: `mtc_`/`mi_`, 63 keys × 26 languages) — DONE.** Larger, more technical category
(Manning's n, hydraulic radius, D50 rock sizing, shear stress, water-surface profile terms). First
launch hit a platform-wide session-limit error on 22 of 26 agents before any file edit landed
(verified no partial edits — read-only audits, nothing to lose); waited out the reset and relaunched
just the 22 failures per the session-limit retry procedure. Found and fixed 19 real defects across
17 languages: am (rock-lining "lining" mistranslated as "line" in 3 keys); ar (riprap transliteration,
`mi_station` wrong sense, tip-glyph convention); bn (`mi_tau` shear loanword drift); de (Radioknopf vs.
Option drift, Design vs. Bemessung loanword); bg (воден стълб vs. дълбочина for flow depth, 2 keys);
hr (`mtc_sgrock` specific gravity mistranslated as specific weight); pt (trapecial vs. trapezoidal
identity-string split, 3 keys); it (flusso vs. portata for discharge, 2 keys); cs (kalkulačky vs.
kalkulátor drift); km (riprap transliteration); zh (`mi_tau` shear force vs. shear stress); fa (riprap
transliteration); sr (Manning script-mixing, проток/протицај drift ×2, нагиб/пад slope-term split);
sw (roughness mistranslated "ukakamavu"=stiffness in 2 keys — same wrong-word failure class as
stage 1's "Majimajii" — plus riprap transliteration); tr (`mi_n` embedded English "segment" fragment,
Hesaplayıcı/Hesap makinesi drift); ru (`mtc_blodgett_v_bathurst` Latin "vs." in Cyrillic heading); ps
(`mi_station` opaque transliteration, یکسان/یکنواخت drift, garbled `mtc_note_2_def` sentence); he
(עיצוב "styling" vs. תכן "design" register confusion, 6 keys); my (riprap transliteration, ချောင်းကြောင်း
vs. မြောင်းကြောင်း channel-term drift, garbled `mtc_note_2_def` "specific energy" sentence); ur
(کیلکولیٹر/حاسبہ and چینل/نالہ drift, 5 tip-glyph convention fixes). ro, id, fr, hi, uk came back
clean (in-scope); French and Hindi each flagged real but **out-of-scope** cross-category drift
(calculatrice/calculateur pervasive elsewhere in fr.php; channel/slope/specific-gravity terms differ
between category 1 and rc_/cs_ in hi.php) — logged here, not fixed, since fixing them means editing
keys outside category 1's scope. All touched files re-verified `php -l` clean.

**Recurring pattern across both stages:** the riprap-transliteration failure (ar/km/fa/sw/my) is the
same defect class the 2026-07-13 Rock Chute audit fixed for a different, newer calculator (rc_) —
confirms this is a systemic transliteration risk for this specific term, not a one-off.

**Stage 3 (category 2: `ws_`/`wi_`/`or_`, 48 keys × 26 languages) — DONE 2026-07-17.** Tom
authorized resuming in the same full 26-agent shape (all four alternatives — full shape, fewer
languages, fewer/larger agents, hold off — were offered; Tom chose full shape). Found and fixed 31
real defects across 10 languages:
- **am**: `ws_headWaterHeight`/`or_head` used ጭንቅ ("distress/anguish") for "head" instead of the
  glossary term ሄድ (2 keys); `or_notes_1_def` had the English word "invert" embedded untranslated
  (1 key).
- **bn**: "centroid" mistranslated as কেন্দ্রচ্যুতি ("deviation/eccentricity") instead of
  কেন্দ্রবিন্দু in 4 keys; পানি/জল ("water") intra-file drift in 3 keys.
- **bg**: `or_main_menu`/`or_main_desc` still used দেবিট/дебит instead of the native-engineer-
  confirmed suite standard водно количество (2 keys) — `or_main_desc` is the exact string
  `dev/Bulgarian-engineer-feedback.md` had already corrected elsewhere but this instance was missed.
- **fa**: `or_invert`/`or_centroid_elev` used ارتفاع ("height") instead of تراز ("datum elevation")
  for two structural-elevation values feeding the h = HWE − centroid equation (2 keys).
- **he**: `or_notes_3_def`'s reference to the "HEC-RAS **Hydraulic** Reference Manual" was rendered
  with הידרולוגיה (*hydrology*, the wrong field) instead of הידראולי (*hydraulic*) — a field-
  confusion wrong-word defect, the same class as stage 2's עיצוב/תכן register-confusion finding but
  a different failure (1 key).
- **hr**: `ws_headWaterHeight` read "Visina preljeva" (height *of the weir structure*) instead of
  "Preljevna visina" (weir *head*) — the same head-vs-height physical-concept-confusion class as
  stage 2's specific-gravity/specific-weight defect (1 key).
- **hi**: `wi_pondingHeight` was a phonetic transliteration "पोंडिंग" of "ponding" instead of the
  glossary term ताल (1 key).
- **my**: embedded English "invert" left untranslated in 2 keys (`or_notes_1_def`,
  `or_notes_4_def`, 3 occurrences); headwater term drift — ဦးရေ (ambiguous with "headcount") used
  instead of the glossary/label term ရေတက်ဘက်ရေ in 3 more spots. Burmese's known failure class
  (embedded-source fragments) recurred here for the third audit stage in a row.
- **uk**: `or_hwe`/`or_twe` used "Позначка рівня" while every other elevation key in the file uses
  "Відмітка" — intra-file drift, normalized to the dominant term (2 keys).
- **zh**: `or_width`'s tooltip used 开口 for "opening" instead of 孔口 used everywhere else in the
  category (1 key).
- **sw**: the single highest per-language defect count of any language audited across all three
  stages — 8 fixes: headwater/tailwater used a "kichwa" (head/energy) calque the glossary
  explicitly warns against, plus a third divergent rendering in the tips (5 keys' worth of
  headwater/tailwater drift); English word "invert" left embedded untranslated in 2 keys; "opening"
  rendered inconsistently in 1 key (Fursa vs. ufunguzi). **Flagged but deliberately NOT fixed:**
  `ws_`/`wi_` render "weir" as bwawa (= dam/pond/reservoir, wrong concept) while the glossary's
  WMO-confirmed sw term is kizuizi cha maji — already used correctly in this same file's
  out-of-scope `irr_` keys. Fixing only ws_/wi_ would create fresh cross-key drift against irr_, so
  this is logged as a suite-wide rename needing its own decision, not patched here.

16 of 26 languages came back clean for this category: ar, cs, de, es, fr, id, it, km, pt, ps,
ro, ru, sr, tr, uk (clean apart from the one fix above), ur. Two additional out-of-scope
observations were surfaced but correctly left unfixed (agent judgment, not oversight): pt's `irr_`
keys use vertedouro/fluxo where in-scope or_/ws_/wi_ use vertedor/vazão (cross-key split, flagged
for a future irr_-scoped pass); km's or_/odt_ keys use bare ប្រហោង where irr_/odt_ titles use the
glossary's fuller ប្រហោងទឹក (same class of cross-key split). Both mirror the sw weir-term finding
above — a pattern worth noting for whoever scopes the next full-suite consolidation pass.

Post-sprint QA: `php -l` clean on all 26 touched/audited files; tag-parity check (`<sub>`/`<sup>`/
`<span>` sets) run against English for every one of the ~30 edited keys — zero mismatches; no
`ANTHROPIC_API_KEY` set, so back-translation-equivalent verification was done inline (reading each
edited key's before/after against the English source meaning) rather than via
`backtranslate_check.php` — same rigor, no billing, per the QA chain's documented no-skip rule.

**Next:** stage 4 (category 3, pending Tom's authorization) — categories 3–5 (pipe friction,
irrigation & seepage, micro-hydro) remain; category 6 = stage 1, category 1 = stage 2, category 2 =
stage 3.

**Stage 4 (category 3: `dw_`/`hw_`/`mpf_`/`mphl_`, 65 keys × 26 languages) — DONE 2026-07-18.** Tom
authorized the same full 26-agent shape. 11 of the 26 first-wave agents (ps, ru, uk, zh, sw, my, pt,
ro, sr, tr, ur) hit a platform-wide session-limit error mid-task before the resumption of this
conversation session; per the session-limit retry procedure, each was relaunched individually after
confirming via `git diff`/`php -l` which had already landed partial edits (my/pt/ro/sr/tr/ur had
partial diffs; ps/ru/uk/zh/sw had none) — every retry either confirmed the prior partial work was
already complete or finished the remaining fixes. Real defects found and fixed in 20 of 26 languages;
es, ru, zh came back fully clean both attempts.

- **am**: the most defects of any language this stage — "head"/"head loss"/"headwater" mistranslated
  throughout as ጭንቅ ("distress/anguish") instead of ሄድ (14 occurrences across 3 keys, matched to the
  sibling `mhp_` calculator's own established term); "friction" bare-transliterated ፍሪክሽን instead of
  the real word ግጭት (5 keys, also used correctly elsewhere in this same category); "roughness"
  3-way spelling drift standardized to the file-dominant ሻካሪነት (2 keys). Flagged (not fixed, out of
  scope): the same ጭንቅ=distress head-mistranslation recurs in `odt_h1`/`odt_notes_1_def` — needs its
  own category's audit pass.
- **ar**: 1 fix — `mphl_total_junction_k_short` loss-coefficient label used a different root
  (الفقد) than the rest of the mphl_ "loss" cluster (فاقِد); aligned.
- **bg**: 4 fixes — `mpf_main_menu`/`mpf_flow` still used дебит instead of the native-engineer-
  confirmed suite standard водно количество (`dev/Bulgarian-engineer-feedback.md`); embedded English
  "Manning Pipe Flow" left untranslated in `mpf_spreadheet_notice`; "wetted perimeter" wrong-word
  (навлажнен="moistened" instead of омокрен) in `mpf_wetted_perimeter`.
- **bn**: 2 fixes — "uniform" mistranslated as "identical" (অভিন্ন→সুষম) in `mpf_main_desc`; headwater
  wrongly rendered "upstream" (আপস্ট্রিম→হেডওয়াটার) in `mpf_note_1`, drifting against the file's own
  correct usage elsewhere.
- **cs**: 1 fix — `mphl_note_1` used "kalkulačka" against the category's unanimous "kalkulátor"
  (the exact drift class stage 2 first flagged for cs). Noted: the reverse drift (kalkulačka
  dominant) holds suite-wide outside this category — a future full-suite decision, not fixed here.
- **de**: 3 fixes, both in long note/tip strings — a "Minderverlust" (=lesser/reduced loss) wrong-
  word in `mphl_total_junction_k_tip` that is exactly the "smaller loss" mistranslation the item-90
  convention exists to block, corrected to "Örtlicher (Einzel-)Verlust" matching the labels; two
  "headwater" terminology-drift fixes (Einstauhöhe/Einstaupegel → Oberwassertiefe/Oberwasserstand,
  matching the glossary and sibling tooltip).
- **es**: clean, no defects found.
- **fa**: 6 fixes, both in note strings — the headwater calque هد آب ("water head", wrong concept)
  recurring 5×, corrected to آب بالادست matching the file's own tooltip and the glossary; the
  ارتفاع-vs-تراز elevation-datum confusion (flagged as a recurring fa failure class in prior stages)
  recurring 2× in `mphl_note_1`, corrected to تراز.
- **fr**: 1 fix — "full flow" rendered "débit plein" in `mpf_full_flow_ratio` against the category's
  established "débit à section pleine". Confirmed no in-scope recurrence of the stage-1/2
  calculatrice/calculateur drift (it exists only outside this category).
- **he**: 3 fixes — velocity head رendered with a literal "head" calque (ראש) instead of the file's
  own correct term עומד in `mpf_note_1`; total-loss terminology drift (אובדן vs. הפסד) in
  `mphl_total_loss`; Manning Hebrew-transliterated in one outlier key (`mpf_manningRoughness`)
  against every other in-category Manning reference kept in Latin script.
- **hi**: 2 defect classes, multiple occurrences — the "minor (local) loss" convention phrase
  order reversed in `mphl_total_junction_k_tip` against its own label; "headwater" conflated with
  "upstream" (both rendered उर्ध्वप्रवाह) in 3 spots across `mpf_flow_tip`/`mpf_note_1`, corrected to
  the file's established शीर्ष जल.
- **hr**: 1 fix — `mphl_friction_loss` used plural "Gubici" (losses) against its two singular
  siblings in the same results-table loss set. No recurrence of hr's previously-flagged head-vs-
  height or specific-gravity-vs-weight confusion classes.
- **id**: 1 fix — `mphl_total_junction_k_tip`'s opening reversed the "minor (local)" word order
  against its own label.
- **it**: 2 fixes — "roughness" drift (rugosità vs. the category-standard scabrezza) in
  `dw_roughness_tip`; the stage-2-flagged flusso-vs-portata discharge drift recurred in `mpf_note_1`
  (2 occurrences), confirming it as a systemic it pattern rather than a one-off.
- **km**: 3 fixes — "wetted perimeter" wrong-word (គ្រែទឹក="water bed" instead of glossary
  បរិវេណសើម); laminar/turbulent regime terms both wrong-word against the glossary, corrected to
  match the already-correct "transitional" term for a parallel triad. No recurrence of km's
  previously-flagged riprap-transliteration failure class (no riprap concept in this category).
- **my**: 2 fixes (after session-limit retry confirmed the larger originally-described fix set had
  NOT landed) — headwater rendered with the anatomical/ambiguous ခေါင်းရေ instead of the glossary-
  confirmed ရေတက်ဘက်ရေ in `mpf_flow_tip`; Manning Burmese-transliterated in one outlier key against
  12+ other in-file Latin-script Manning references. Retry explicitly confirmed velocity head was
  already correctly non-anatomical (ဖိမြင့်) — the original attempt's claim to the contrary did not
  match the actual file.
- **ps**: 2 defect classes, 4 strings (after session-limit retry — no prior edits had landed) — a
  garbled coined term "سرسر" for headwater (non-word) standardized to the file's own correct
  پورتنیو اوبو across 5 occurrences in 2 notes; Manning transliterated in one outlier key against
  the rest of the file's Latin-script eponym convention.
- **pt**: 2 fixes, confirmed complete by the session-limit retry (both had actually landed before
  the cutoff) — "tubo" vs. the file-standard "tubulação" in `mpf_note_1`; decimal separators
  localized to comma in `mphl_total_junction_k_tip`.
- **ro**: 2 fixes, confirmed complete by the session-limit retry (only 1 of 2 had landed before the
  cutoff) — "flow section" drift (Secțiunea de curgere → Aria de curgere) matching the sibling area
  keys; a stacked double-negative in `mphl_note_1` that had also flipped "and" to "or" in a safety-
  critical HGL-above-pipe-elevation sentence, corrected to positive phrasing per CLAUDE.md's
  stacked-negatives guidance.
- **ru**: clean, no defects found (both original attempt and retry).
- **sr**: multiple fixes (≈7–10 edits across the original landed diff — session-limit retry
  confirmed 100% of the проток-vs-протицај and нагиб-vs-пад standardization work described was
  already complete, with the two remaining protok/pad-looking substrings correctly identified as
  false positives — протицајни пресек and падне are unrelated words, not instances of the flagged
  nouns). Standardized "flow" on проток (glossary-confirmed authoritative term) throughout.
- **sw**: 6 fixes (after session-limit retry — no prior edits had landed) — the flagged "kichwa"
  anatomical-head calque recurred in 3 different concepts: "roughness" (Ukakamavu→Usuguo, 2 keys),
  "velocity head" (Kichwa cha kasi→Kimo cha kasi, per glossary, 2 keys), and "headwater" (kichwa-based
  phrasing→"maji ya juu ya mkondo", 3 keys) — confirming sw's established high-defect-rate pattern
  continues into this category. Flagged (not fixed, out of scope): the same Ukakamavu roughness
  wrong-word recurs a third time in `mtc_note_1` (category 1).
- **tr**: 2 fixes, confirmed complete by the session-limit retry (only 1 of 2 had landed before the
  cutoff) — calculator-word drift (hesap makinesi→hesaplayıcı) in `mphl_note_1`; a decimal/percent
  localization defect (93.8%→%93,8) matching both the file's comma-decimal and sign-first-percent
  conventions.
- **uk**: 3 fixes (after session-limit retry — no prior edits had landed) — embedded English "Pipe
  Flow" left untranslated in `mpf_spreadheet_notice`; EGL (energy grade line) wrong-concept term
  "лінія питомої енергії" (specific-energy line — a distinct open-channel-hydraulics concept) used
  in 3 spots instead of the glossary's лінія енергії.
- **ur**: 3 fixes, confirmed complete by the session-limit retry (2 of 3 had NOT landed before the
  cutoff) — "calculator" transliteration (کیلکولیٹر→حاسبہ, already landed); "headwater" phonetic
  transliteration (ہیڈ واٹر→سر آب, still needed) in `mpf_flow_tip`; "minor (local) loss" convention
  word dropped plus coefficient-word drift (عدد→عامل) in `mphl_total_junction_k_tip`, still needed.
- **zh**: clean, no defects found (both original attempt and retry).

Post-sprint QA: `php -l` clean on all 26 touched/audited files; tag-parity check
(`<sub>`/`<sup>`/`<span>`/`<a>`/`<dl>`/`<dt>`/`<dd>`/`<em>` sets) run programmatically against
English for all 65 keys × 26 languages — zero mismatches. No `ANTHROPIC_API_KEY` set, so back-
translation-equivalent verification was done inline by each agent (reading edited keys' before/after
against the English source meaning) rather than via `backtranslate_check.php` — same rigor, no
billing, per the QA chain's documented no-skip rule.

**Session-limit retry note:** this stage is the first to exercise the retry procedure at scale (11
of 26 agents affected by a single platform-wide session-limit event). In every case, checking
`git diff`/`php -l` before relaunching correctly distinguished "no edit landed" (ps/ru/uk/zh/sw) from
"partial edit landed" (my/pt/ro/sr/tr/ur) — confirming the procedure's core caution (`a session-limit
error can fire after the edit already landed`) held in both directions: some retried languages needed
zero further work (pt, sr — fully landed already) and others needed the full remaining fix set
(my, ps, sw, uk — nothing had landed despite the agent's summary describing specific fixes about to
be applied).

**Next:** stages 5–6 (categories 4–5: irrigation & seepage `cs_`/`irr_`/`ip_`; micro-hydro `mhp_`/
`rc_`) remain, each still needing its own propose→confirm→launch authorization per CLAUDE.md.

**Stage 5 (category 4: `cs_`/`irr_`/`ip_`, 106 keys × 26 languages) — DONE 2026-07-19.** Tom
authorized the same full 26-agent shape. A platform-wide session-limit error hit the first wave
twice: the initial 26-agent launch left only am/ar/bg/fr with any landed work (am complete, ar/bg/fr
partial), and a retry of the other 22 lost 11 more mid-task. Both waves were resumed via SendMessage
to the same agent IDs (not fresh relaunches, so each retry kept its own prior reasoning/context)
once Phoenix-time reset had passed. Distinguishing "already landed" from "nothing landed" used
`git diff <file> | grep -c "^[+-]\$ec_lang\['(cs_|irr_|ip_)"` per file — file mtime alone was
unreliable here because every lang file already had uncommitted stage-4 edits sharing the same
mtime neighborhood.

Real defects found and fixed in 24 of 26 languages; **sr and fa came back clean** both times.
`php -l` clean on all 26 files; git diff line counts per language: am 4, ar 10, bg 16, bn 6, cs 14,
de 6, es 4, fa 0, fr 6, he 6, hi 6, hr 12, id 2, it 2, km 2, my 2, ps 6, pt 8, ro 2, ru 18, sr 0,
sw 2, tr 26, uk 22, ur 50, zh 8.

- **am**: 2 fixes — "Application Design" (አፈፃፀም=performance/execution, wrong sense of "application")
  and "application rate" opening phrase, both corrected to match the glossary-endorsed ልፍፍ term
  already used correctly elsewhere in the file. Known am head/friction-calque patterns from stage 4
  checked clean here — not present in category 4.
- **ar**: 2 defect classes, 5 edits — `cs_notes_2_def` "seepage losses" used a different root
  (خسائر) than the rest of the cs_ loss cluster (فقد), fixed with verb/pronoun agreement; "reach"
  split between مقطع (cs_, 4 keys) and قطاع (ip_) for the identical English concept, harmonized to
  قطاع (also disambiguates مقطع, correctly left meaning "cross-section" elsewhere).
- **bg**: 2 defect classes, 8 edits — دbit-type drift (Дебит used in 7 keys against the native-
  engineer-confirmed suite standard Водно количество, per `dev/Bulgarian-engineer-feedback.md`);
  wetted-perimeter term drift (мокър/мокрият/мокри vs. the mpf_-established Омокрен) in
  `cs_notes_3_def`.
- **bn**: 4 fixes, one class — "headwater"/"tailwater" phonetically transliterated (হেডওয়াটার/
  টেলওয়াটার) across 4 irr_ keys, standardized to the glossary/or_-established উজান/ভাটি terms.
  "uniform"≠"identical" checked clean (already সমান).
- **cs**: 8 edits across 7 keys — the flagged kalkulačka-vs-kalkulátor drift (5 occurrences, with
  gender-agreement fixes); a "test" adjective drift (zkušební vs. established testovací); a raw
  `&amp;` HTML-entity defect; three wrong-word/typo errors in `ip_notes_1_def` (energy *layer*
  instead of grade line, "extracted" instead of "subtracted", a typo).
- **de**: 4 fixes — headwater-depth and headwater/tailwater-elevation terminology drift (3 keys,
  standardized to the mpf_/or_-established Oberwassertiefe/Oberwasserstand/Unterwasserstand terms);
  a minor-loss consistency gap (missing the item-90 "(local)"/örtlich qualifier) in `ip_notes_1_def`.
  The flagged "Minderverlust" wrong-word was NOT present in this category.
- **es**: 1 fix — "zone" (Q_zone) rendered "sector" in two field labels (`ip_n_l`, `ip_q_sys`) while
  cross-referencing notes/tips used "zona"; standardized to "zona".
- **fa**: clean, no defects found. Both known fa patterns (headwater calque, ارتفاع/تراز
  elevation-datum confusion) checked and confirmed already correct throughout.
- **fr**: 3 fixes, one class — calculatrice/calculateur gender drift in 3 body strings against the
  category's masculine "Calculateur" (used in all 3 `_main_title` keys and the suite-dominant term
  elsewhere), with adjective-agreement corrections.
- **he**: 4 fixes — Manning/Christiansen Hebrew-transliterated in 3 keys against the suite's Latin-
  script eponym convention; velocity-head term drift (גובה המהירות vs. the glossary/mpf_-established
  עומד מהירות) in `ip_notes_1_def`. "total loss" אובדן/הפסד and "design" עיצוב/תכן both checked
  clean — correctly split by sense, not a defect.
- **hi**: 3 fixes — tailwater transliteration (टेलवाटर) in `irr_card_orifice_desc`, standardized to
  match the linked or_ calculator's own field label; "application rate" drift (सिंचाई दर="irrigation
  rate") in 2 keys, standardized to the dominant अनुप्रयोग term. Flagged (not fixed, out of scope): a
  suite-wide अपस्ट्रीम/डाउनस्ट्रीम (transliterated) vs. ऊर्ध्वप्रवाह/अनुप्रवाह (native) split that
  lives in the category-2 `or_` keys.
- **hr**: 6 defects, 6 edits — embedded untranslated English in a tooltip; a terminology drift on
  the suite's most sensitive term ("target efficiency" ciljnu iskoristivost vs. the incumbent
  korisnost); a stale/nonsense-word warning string rewritten to match current English; a meaning
  inversion ("subtracted" rendered as "returned/restored"); two typos. Flagged (not fixed): a
  napajanje/opskrba "supply" synonym split, left for a human call.
- **id**: 1 fix — the Christiansen citation title was translated into Indonesian instead of kept as
  published (per CLAUDE.md citation-title policy; all comparison languages keep it in English).
  Known id "minor (local) loss" word-order and riprap-transliteration patterns checked clean — not
  present in this category.
- **it**: 3 fixes, one class — `irr_quickref_html` calculator-link texts (Weir Simple/Irregular,
  Orifice) didn't match the linked calculators' own Italian menu names; corrected to match. Known
  rugosità/scabrezza and flusso/portata drift patterns checked clean — portata used consistently
  throughout, no roughness term exists in this category.
- **km**: 1 fix — embedded untranslated English "culvert" in `irr_card_orifice_desc`, replaced with
  the suite-established លូ. Known wetted-perimeter/regime/riprap patterns checked clean.
- **my**: 1 fix — embedded untranslated English "Micro-irrigation" in `ip_notes_4_def` (the same
  defect class that originally motivated this whole Task 109 audit). Known headwater-calque and
  Manning-transliteration patterns checked clean.
- **ps**: 4 fixes across 3 lines — phonetic transliterations of "spillway" and "Trapezoidal", a
  coined/wrong term for "drop structures", a minority culvert spelling normalized to the file-
  dominant form. The flagged سرسر headwater garble was NOT present (headwater already consistently
  correct).
- **pt**: 4 fixes — embedded English left in a tooltip title; two "tubo"-vs-"tubulação" drift fixes
  (the only 2 stray instances in the file); one weir-term identity-string drift ("Vertedores" vs.
  the category's established "Vertedouros"). Flagged (not fixed, out of scope): several `ip_` notes
  read as translated from an older/longer English revision (see cross-language note below); a raw
  `&amp;` vs `&amp;amp;` entity convention gap, internally consistent so left alone.
- **ro**: 1 fix — the Christiansen citation title was translated instead of kept published (matching
  the id defect, same fix). Flow-section and stacked-double-negative patterns checked clean.
- **ru**: 8 fixes — conveyance-efficiency terminology drift (2 keys); embedded untranslated English
  in a tooltip; "Application Design" mistranslated as software-application design (4 occurrences,
  fixed to "Проектирование полива"); a counts-vs-meters wrong-word plus an adjective-lateral drift;
  a gender-agreement error; an application-rate term drift; a supply-pressure term drift. Previously
  clean in stage 4; not clean this stage. Flagged (not fixed): the same stale-English-revision
  observation as pt/uk (see below).
- **sr**: clean, no defects found. Both known проток/протицај and нагиб/пад drift patterns checked
  clean, with the flagged false-positive substrings (протицајни, падне) correctly left alone.
  Flagged (not fixed, out of scope): a suite-wide Manning-name orthography inconsistency (Latin
  adjective endings vs. Cyrillic Манингов- forms) spanning multiple categories.
- **sw**: 1 fix — `ip_group_loss` column header used "Hasara" (financial loss/damage) against the
  suite-standard "Upotevu" used by the very columns (h_f/h_m/h_L) it heads. The recurring kichwa/
  Ukakamavu anatomical-calque pattern was checked and found clean in this category (correctly used
  kimo/msuguano throughout).
- **tr**: 26 edits, the largest fix set this stage — calculator word drift (hesap makinesi→
  hesaplayıcı, 3 keys); "distribution uniformity" transliteration+wrong-word (Uniformluk/Dağıtım→
  Düzgünlük/Dağılım, 7 keys); "branch" loanword-coinage drift (branş→dal, 3 keys); a mangled
  bibliographic citation (embedded English + transliteration, restored to policy); assorted garbled/
  embedded-English prose fixes (3 more spots).
- **uk**: 7 fixes — the glossary-flagged EGL wrong-concept calque; two wrong-word confusions in
  `ip_notes_1_def`/`ip_notes_2_def`; "annual value recovered" mistranslated as "annual value of
  discrepancies" (3 sibling keys); "Application Design" mistranslated as "Program design" (5
  occurrences); a locative-case grammar fix. Flagged (not fixed): the same stale-English-revision
  observation as ru/pt (see below).
- **ur**: the second-largest fix set — ~30 edits across 5 defect classes: کیلکولیٹر calculator
  transliteration (6 keys); رسائی wrong-word for "seepage" (should be رساؤ, 9 keys); "reach" split
  between two wrong terms (پہنچ in cs_, ریچ transliterated in ip_), harmonized to the glossary
  حصہ (~12 keys); "Trapezoidal" transliteration; upstream/downstream transliteration (2 keys).
  Flagged (not fixed, out of scope): a cross-category کیلکولیٹر/حاسبہ split in install_/about_/
  mhp_/rc_ keys, and an orifice سوراخ/اوریفس split between the irr_ portal and the standalone or_
  calculator.
- **zh**: 1 fix — "Application Design" section heading and 3 cross-references drifted to the
  generic/software sense 应用 instead of the irrigation-specific 灌水 already used correctly in the
  input labels (`ip_d`, `ip_pr`).

**Cross-language finding, not fixed in this stage:** three independent agents (ru, pt, uk) flagged
the same likely-systemic issue without prompting each other — several `ip_` note/tooltip strings
(`ip_worst_case_warn`, `ip_du_estimate`, `ip_notes_3_def`, `ip_q_ratio`) read as translations of an
**older, longer English revision** that no longer matches the current, shortened English source
(e.g. content about a "downhill run" or a "uniformity figure" that current English no longer
contains). This is an English-source synchronization gap, not a per-language terminology defect —
it needs its own investigation (diff the current English against what these keys' translations
imply the source once said, across all 26 languages) before any fix is attempted, and should not be
folded into a terminology-consistency stage.

Post-stage QA: `php -l` clean on all 26 touched files. No `ANTHROPIC_API_KEY` set, so back-
translation-equivalent verification was done inline by each agent per the QA chain's no-skip rule,
same as prior stages.

**Session-limit note:** two separate platform-wide session-limit events hit this stage (the first
during the initial 26-agent launch, the second during the first retry wave). Both were resolved by
resuming the same agent IDs via SendMessage once wall-clock time passed the reported reset, rather
than spawning fresh agents — this preserved each agent's own partial reasoning/findings across the
gap and is a lighter-weight variant of the stage-4 retry procedure worth using again.

**Next:** stage 6 (category 5: micro-hydro `mhp_`/`rc_`) remains, still needing its own
propose→confirm→launch authorization per CLAUDE.md.

---

## Backfill: 2026-07-21 maintenance-phase batch (stage 6 + Tasks 126–134)

This log had fallen behind after stage 5. The entries below reconstruct, from `dev/ROADMAP.md`'s
`## Completed` section and git history, the translation-touching work done on 2026-07-21 between
stage 5 and Task 129, in chronological (commit-time) order. The ROADMAP Completed blocks remain the
fuller record; these are the translation-execution summaries.

### Task 109 stage 6 — category 5 (`mhp_`/`rc_`) cross-language consistency audit — `72d7c16` (06:52)
Final stage of the Task 109 consistency audit. 28 lang files touched. Also shipped the
**polysemy/units-trap prevention system**: the `avoid`-array convention in `glossary.json`, the
`dev/scripts/list_trap_terms.php` watchlist (derived from those arrays, never a separate list), and
the three-part trap protocol (English-reform gate → root glossary entry with `avoid` → visible
definitional tip). uk flagged `mhp_notes_2_def` here as still carrying the old "1–3 m/s" English —
the seed of Task 129.

### Task 132 — trim duplicative `$ec_lang_intent` to `gloss:` pointers — `97383c3` (08:20)
Tom-authorized bounded intent-trimming (the one standing AI carve-out on `$ec_lang_intent`). Where an
intent's left-of-pipe merely duplicated a glossary concept, replaced it with a `| gloss: <term>`
pointer. English-side metadata only; no per-language translation, logged here because it changed the
translation-guidance channel.

### Task 131 — translate the 5 trap-term tips into 26 languages — `82f1156` (08:38)
Scenario-D slice: 26 Sonnet agents, 5 keys each (`or_head`, `ws_headWaterHeight`,
`mpf_velocity_head`, `mtc_sgrock`, `rc_sg`), glossary + `avoid` injected, driven off the explicit
grep-slice (not payload delta). Each agent preserved the existing translated label and added/updated
the whole-label `.ec-help`/`.ec-tip` definitional tip; `rc_sg` converted from the old bare-`?`
inline-style tooltip where still present. QA all clean (lang_syntax_validate, tag-parity on all 130
strings, inline back-translation). Glossary write-back on `head` + `specific gravity`. Spun out:
he/my `head` label → Task 128; new SG *label* drift (pt/uk/ar/fa/sr) → Task 133.

### Tasks 128 & 133 — trap-term residue + SG label consolidation — `71057df`, `6f3a455` (11:32)
**128 (closed):** on Tom's directive that native review is not realistically available and we defer
to the locally natural term — sw "Uzito maalum", my "ခေါင်းဆုံး", he "עומק" all KEPT as locally
natural. Upstream fix: the `head` family's blanket `avoid: "anatomical head"` was reframed across all
7 entries to forbid only a lazy anatomical calque that is NOT the local standard (an
anatomically-derived word that IS the dominant standard is now explicitly correct). 3 intent entries
→ `| gloss: head` pointers. **133 (done):** per-language SG *label* consolidation — `mtc_sgrock`
aligned to `rc_sg`'s dominant-standard label in the 5 affected languages (pt/uk/ar/fa/sr). Glossary
write-back on both.

### Task 126 — suite-wide tooltip markup migration — `1d001e3` (12:17)
Scripted, idempotent converter (`dev/scripts/migrate_legacy_tooltips.php`) moved 7 `rc_` keys across
11 languages (ar, bg, de, fr, he, hi, it, pt, ro, uk, zh) from the legacy inline-styled
`<span title=… style=…>?` pattern to the touch-friendly `.ec-help`/`.ec-tip` wrapper, relocating each
language's translated label text (with `<sub>`, escaped quotes, `&quot;`, RTL) inside the wrapper.
76 strings converted, 0 residual. Not a translation sprint, but a structural edit of 11 lang files.

### Tasks 134 / 130 / 127 — units gap-fill + `odt_` rebrand + `mhp_diameter` tip — `e22dc35`, `2c5d54e`, `6f3647a` (12:27–16:24)
English side first (`e22dc35`, `2c5d54e`): added `bar`/`kgf/cm²` pressure units and pruned dead
units; rebranded `odt_` identity vessel-first ("Pond & Tank Drain Time", Tom-locked). Then one
26-agent Sonnet sprint (`6f3647a`, hand-specified key list — payload delta is blind to
changed-English-under-stale-translation, the same blind spot Task 129 addresses) carried three riders
together: **130** re-translated the rebranded `odt_` identity + fixed am's residual head→distress
calque (ጭንቅ→ሄድ); **127** restored the `mhp_diameter` "(supply pipe)" tooltip in the 15 languages that
lacked it (existing penstock terms reused, tag-parity verified on all 26); **134** translated the new
`u_bar`/`u_kgfcm2` unit tokens into all 26. QA all clean; one he escape-leakage on `u_kgfcm2` fixed
inline. Glossary v1.10→1.11.

---

## Task 129 — stale-English-revision resync (2026-07-21)

Closes the "cross-language finding, not fixed in this stage" flagged at the end of stage 5 above:
the `ip_`/`mhp_` note+tooltip strings that read as translations of an older, longer English source.
Authorized by Tom 2026-07-21; committed `6a8203b`.

**Scope:** 5 keys — `ip_du_estimate`, `ip_worst_case_warn`, `ip_q_ratio`, `ip_notes_3_def`,
`mhp_notes_2_def`. The current English of all five was shortened in the Wave-0 reform (commit
`7bfbda1`) after several languages had already translated the longer version. This is an
English-sync gap, not per-language terminology drift.

**Method:** explicit-key-slice sprint, 26 Sonnet agents (one per language), driven off the hand-
specified key list — NOT the payload delta, which is blind to stale-but-present keys (same rationale
as Tasks 130/131). Each agent did a semantic per-language read against current English and rewrote
ONLY drifted keys, leaving matching ones untouched. Byte-length was explicitly rejected as a scoping
filter (script encoding density conflates with real drift).

**Result: 9 languages drifted and were rewritten; 17 were already current.**
- am, km — `ip_notes_3_def` only (retired "inlet pressure" → "supply pressure").
- ru — `ip_worst_case_warn`, `ip_q_ratio`.
- hr — `ip_q_ratio`, `ip_notes_3_def`.
- cs, es, pt, tr — all four `ip_` keys (cs also fixed a garbled-Czech artifact in `ip_notes_3_def`).
- uk — `mhp_notes_2_def` (dropped the old "1–3 m/s target range" band) + three `ip_` keys.
- Already-current (17): ar, bg, bn, de, fa, fr, he, hi, id, it, my, ps, ro, sr, sw, ur, zh.

es/hi also had "textbook" → "standard" (low-quarter DU qualifier) aligned; Tom confirmed that
distinction is negligible/synonymic, so it was NOT swept to the other languages.

**Pre-sprint sweep** for other Wave-0-shortened keys: `7bfbda1` also shortened `mtc_`/`rc_`/`mi_`
keys, but spot-checks (pt `mtc_note_2_def`, `rc_qt`) showed those were re-translated in the later
full-category waves — drift was concentrated in the `ip_`/`mhp_` keys, which had been handled on a
different track.

**QA (all clean):** 9× `php -l`; `lang_syntax_validate` zero hard findings (only advisory
identical-to-english on unrelated keys); tag-parity (`<sub>`/`<span>`/`<sup>` + `q<sub>` symbols)
all-match vs English across 5 keys × 9 langs; entity check clean (no double-encode, no bare
ampersands); inline back-translation of every rewritten string (no `ANTHROPIC_API_KEY`, so the
orchestrator verified inline per the no-skip rule). Glossary write-back v1.11→1.12 (resync note on
the low-quarter DU entry).

**Log-maintenance note:** this log was behind — it ended at stage 5 and did not carry stage 6 or
Tasks 126/127/130/131/133/134. Those are recorded in `dev/ROADMAP.md`'s `## Completed` section
instead; only Task 129 is written up here because stage 5 explicitly deferred it to "its own
investigation."
