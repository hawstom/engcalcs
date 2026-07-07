# Wave 0 — English Source Review (pre-translation reform)

**Status: PROPOSALS ONLY. Nothing here is applied.** No `$ec_lang` English string and no
`$ec_lang_intent` entry is edited until Tom approves the specific line (CLAUDE.md: intents are
off-limits to AI without written permission; Tom extends the same gate to English source).

## Method

For every non-empty `$ec_lang_intent`, ask: **"How could the English be rewritten so this intent
note is no longer needed?"** Reform the English; then the intent can be deleted. An intent that
merely decodes a colloquialism ("right at"=exactly at, "more for"=better suited to) is a bug report
against the source, not permanent guidance. Keep only intents that survive perfect English (genuine
calque-traps, e.g. the `irregular`=cross-section sense).

Wave 0 pre-filters; it does not replace wave 1 as a detector — the "flag resistant English"
imperative stays in wave 1 for the residual that only surfaces in real cross-language work.

Columns: **Key | Current English | Proposed English | Intent(s) obsoleted | Tom's decision**

---

## Category 1 — Open channel (`mtc_` / `mi_`)  [drafted by Opus, 2026-07-06]

### A. Colloquialisms / casual wording — reword

| Key | Current | Proposed | Obsoletes intent? | Decision |
|---|---|---|---|---|
| `mtc_vel_high` | `Velocity high - check transition losses, available energy, and water hammer.` | `Velocity is high; check transition losses, available energy, and water hammer.` | n/a (none set) | Yes |
| `mtc_vel_low` | `Velocity low - sedimentation risk.` | `Velocity is low; sedimentation risk.` | n/a | Yes |
| `mtc_vel_ok` | `Velocity reasonable for uniform-flow assumptions.` | `Velocity is reasonable for the uniform-flow assumptions.` | n/a | Yes |
| `mi_notes_2_def` | `…This calculator is **more for** natural sections.` | `…This calculator is **better suited to** natural sections.` | n/a | Yes |
| `mtc_note_1` | `…Choose a roughness **radio button**…(**BB** recommended)…**Fine-tune** depth…to get your desired flow with an **even** rock size. Every time you change any input value, the following iteration cycle **happens**:…` | `…Choose a roughness **option**…(**Blodgett–Bathurst** recommended)…**Adjust** depth…to reach your target flow with a **uniform** rock size. Each time you change an input, the calculator repeats these steps:…` | n/a | Yes |
| `mtc_n_strickler` (+`_blodgett`, `_bathurst`) | `n for design rock size **per** Strickler` | `n for design rock size **(Strickler method)**` | n/a | Yes |
| `mtc_note_2_def` | `High velocity implies high specific energy **from an available drop**.` | `High velocity implies that there was a large elevation drop that created such high specific energy**.` | n/a | Yes |

### B. Display-compression / forced line-breaks / abbreviations

Policy chosen (Tom): **(1) move narrowness into CSS + (2) express constraint via `_intent`.** Hard
`<br />`s to be stripped from strings ONLY after the narrow-column CSS is confirmed to hold width
(spike on `mi_is_bank` validated 2026-07-06). Non-negotiable: columns must stay as narrow as today.

| Key | Current | Proposed (post-CSS) | Notes | Decision |
|---|---|---|---|---|
| `mi_n` | `n<br />for seg-<br />ment` | `n for segment` | remove hard hyphen "seg-ment" (breaks in every language) | Yes |
| `mi_is_bank` | `R<sub>h</sub>, Q<br />region<br />boundary<br />(Bank)` | `R<sub>h</sub>, Q region boundary (Bank)` | spike-validated: CSS holds width | Yes |
| `mi_station` | `Sta` | `Station` | let CSS/wrap abbreviate per language | Yes |
| `mi_elevation` | `Elev` | `Elevation` | " | Yes |
| `mi_n617` | `Comp.<br />n` | `Composite n` | `Comp.` ambiguous | Yes |
| `mi_tau` | `Bot.<br />shear<br />&tau;` | `Bottom shear &tau;` | `Bot.` ambiguous | Yes |
| `mi_d50in` | `Lining<br />median<br />rock<br />size` | `Median rock size of lining` | 4 stacked modifiers, English word order | Yes |

Proposed `_intent` to ADD for section B (survives reform — it's a display constraint, not a
colloquialism): *"Renders as a header in a very narrow fixed-width results-table column; keep the
term as short as the language allows."* Applies to the section-B keys.

Proposed `_intent` to ADD (calque-trap, survives perfect English): `mi_menu`/`mi_main_title`/
`mi_main_desc` — the `irregular`= non-uniform cross-section sense (see glossary `irregular channel`).

### Implementation status — 2026-07-06 [CC]

**Section A: all 7 applied** to `lib/lang.ec.en.php` (incl. Tom's reworded `mtc_note_2_def`). Lint + syntax-validator clean.

**Both approved `_intent`s applied:** the narrow-column display-constraint note on all 7 Section-B keys, and the `irregular`=cross-section calque-trap note on `mi_menu`/`mi_main_title`/`mi_main_desc`.

**Section B — a width conflict surfaced against the non-negotiable "columns must not get wider":**
- **Applied (no widening):**
  - `mi_is_bank` — string breaks removed; spike made permanent (`.ec-narrowcol` span). Validated visually 2026-07-06 (identical width). ✅
  - `mi_tau` → `Bottom shear τ` — multi-word, wraps at spaces inside a `width:3.5em` span sitting above a unit-select that already sets the column floor. Est. no widening — **needs your dev eyeball to confirm.**
  - `mi_d50in` → `Median rock size of lining` — string reworded, but this key has **no render site** anywhere in PHP/JS (orphan; only lives in lang files). Zero layout impact today; its 26 existing translations still carry the old 4-line form and will reconcile in the translation waves.
- **NOT applied — needs your decision (expanding the abbreviation inherently widens the column, which conflicts with "non-negotiable narrow"):**
  - `mi_n`: `n for segment` — "segment" is one 7-char token (~3.6em); the current `seg-<br>ment` hard-hyphenation exists precisely to hold ~2em. Un-hyphenating widens it or forces an ugly mid-word CSS break.
  - `mi_n617`: `Composite n` — "Composite" is one 9-char token (~5em) vs. current `Comp.` (~2.5em). Biggest widening.
  - `mi_station`: `Station` (~3.9em) vs. current select-floor ~3.2em.
  - `mi_elevation`: `Elevation` (~4.8em) vs. current select-floor ~3.2em.

  These four trade column width for abbreviation-expansion. Options per key: **(a)** keep the English abbreviation and rely on the just-added `_intent` (translators keep it short) — zero layout change; **(b)** accept the widening; **(c)** allow CSS mid-word wrapping (can look ugly). My recommendation: **(a)** for `mi_n`/`mi_n617` (the hyphen/abbreviation is doing real width work), and your call on the milder `mi_station`/`mi_elevation`. Awaiting your decision before touching these four.

**Tom's decision, 2026-07-06:** "Mi looks good as is." → **KEEP the abbreviations** for all four (`mi_n`, `mi_n617`, `mi_station`, `mi_elevation`) — option (a). English stays `Sta`/`Elev`/`Comp. n`/`n for seg-ment`; the narrow-column `_intent` already added is the translator guidance. No further English change to these four. `mi_is_bank` + `mi_tau` visually approved.

**Column reorder implemented — 2026-07-06 [CC] (Tom approved: tau=Point, n leads Segment):** `n` moved from the Point group into the Segment group (new leaf order: station, elevation, is_bank, tau, **n**, t, pw, a, rh, n617, v617, hv617, fr617, q617; group colspans 5/3/6 → 4/4/6). `mi_n` relabeled `n for segment` → **`n`** (clear under the Segment header; its narrow-column intent removed as it's now a bare symbol). The compute loop is unaffected (reads `n`/`is_bank` by name, station/elevation by fixed row index which didn't move). Cookie is positional, so a **versioned auto-migration** was added: cookies now carry a leading `v<N>` token (`Cookies.lib.js` `cookieFormatVersion`, marker written in `formToCookie`, detected+stripped+migrated in new `normalizeCookieValue`); Manning-Irregular is `cookieFormatVersion = 2` with `migrateCookie` swapping each non-first row's `n`/`is_bank` (first row has neither). The points-data CSV seed + export order updated to match. **Migration unit-tested** (scratchpad harness against the real libs): legacy v1 → correct swap, v2 pass-through with no double-swap, idempotent, prefix/first-row untouched. Other calculators (ip/wi, singletons) are unaffected (no `migrateCookie`, markerless legacy cookies still read as v1=identity; new cookies just gain a `v1` token). **Still needs your browser eyeball:** load Manning-Irregular (new column layout) and, ideally, confirm a pre-existing saved section still loads correctly (the migration path).

**Design principle confirmed (Tom):** the results-table column width is treated as *very important* — mid-word CSS wrapping ("boundar/y") is accepted as the price of holding width. `.ec-narrowcol` default bumped 4.5em→**4.8em** to fit "boundary" on one line (matches the original hard-break width, no widening; removes the ugly break Tom noticed). **Open risk Tom flagged:** fixed-em widths may not sit nicely for all languages (long compound tokens will mid-word-break). It always *fits* (never overflows), but can be ugly — **watch results-table headers per language during translation-wave QA.**

---

## Categories 2–6 + rc_/ip_ harvest — drafted by Fable, 2026-07-07

**Status: PROPOSALS ONLY (same gate as Category 1).** Decision column awaits Tom. Sections:
one per calculator category, then the rc_/ip_ harvest, then cross-cutting items (intent
consolidation, D5 glyph stragglers, typo/defect list).

Reading key for "Obsoletes intent?": *n/a* = no intent exists; *keep* = intent survives perfect
English (calque-trap or layout constraint); *delete* = the reform makes the intent unnecessary;
*replace w/ gloss* = collapse the verbose intent to a `| gloss:` pointer (glossary term exists).

---

## Category 2 — Weirs & orifices (`ws_` / `wi_` / `or_` / `odt_`)

**Overall: clean.** These strings are recently authored; no colloquialisms found in the long
`*_notes_*_def` strings. Findings are calque-trap coverage, not English defects.

### A. English rewording — none required

No `check out`/`right at`-class colloquialisms. `or_notes_*_def`, `odt_notes_*_def`,
`wi_notes_we_def` read as clean technical prose.

### B. Calque-traps to cover via intent/glossary (English stays as-is)

| Key | English (kept) | Trap | Proposed cover | Decision |
|---|---|---|---|---|
| `ws_main_menu`, `wi_menu` | `Weir Flow Simple` / `Weir Flow Irregular` | Postpositive adjective is a menu-sorting compression ("Weir Flow …" variants group together); translators may mis-parse what "Simple"/"Irregular" modifies | ADD intents: "The simple (uniform-crest) variant of the weir flow calculator — use natural word order" / "| gloss: irregular channel"-style pointer for the cross-section sense of irregular (glossary `irregular channel` notes apply to weirs too — the bg engineer rejected "Нередовен Преливник") | OK. It would be good to offer possible English synonyms for "irregular" including "with a crest that slopes" (vs a simple weir with a level crest), "with an uneven crest", or "with a crest of variable depth"|
| `or_regime_warn_tip` | `Headwater below crown` | "crown" = top of opening (not royal crown); no glossary term exists (`invert elevation` does, `crown` doesn't) | ADD glossary term `crown` (top of a pipe/opening; avoid "royal crown", "crown of head"); bind into `or`/`odt` prefixToTermNames | Unsure. Crown means head or top. In English, it is a technical term that means "the top or the highest point of the inside of a pipe". I think that here and in general it is better to provide ample and clear synonyms or definition than to say what it's not. Please advise or discuss.|
| `wi_notes_we_def` | `q = if (length = 0) then 0 else if (slope=0) then …` | if/then/else pseudocode — translators may treat as prose or freeze as untranslatable code | ADD intent: "Formula in if/then/else pseudocode; the words if/then/else/where may be translated, symbols stay | symbol" | Yes |

---

## Category 3 — Pipe friction (`dw_` / `hw_` / `mpf_` / `mphl_`)

### A. Colloquialisms / casual wording — reword

| Key | Current | Proposed | Obsoletes intent? | Decision |
|---|---|---|---|---|
| `mpf_spreadheet_notice` | `**Check out** the spreadsheet version of this calculator` | `**See** the spreadsheet version of this calculator` | n/a | Yes or "Try/test the..."|
| `mpf_note_1` | `…Add at least 1.5 times the velocity head **to get** the headwater depth or see my 2-minute tutorial…` | `…Add at least 1.5 times the velocity head **to estimate** the headwater depth, or see my 2-minute tutorial…` (second "get" in one sentence; polysemous) | n/a | Yes |
| `mphl_note_1` | `…cannot be lower than the upstream normal depth flow elevation **(or lower than the pipe!)**` | `…cannot be lower than the upstream normal-depth flow elevation **(nor below the pipe crown)**` (elliptical + exclamation) | n/a | Or "must be above the upstream normal depth flow elevation **(and higher than the pipe!)**" avoid the mess of negatives. We may want to be on the lookout for negatives on your next pass.|
| `mpf_friction_slope` | `Friction slope (**possibly** <a>?</a> equal to pipe slope), S<sub>f</sub>` | `Friction slope (**often** <a>?</a> equal to pipe slope), S<sub>f</sub>` — "possibly" reads as doubt about the input itself; the linked page explains *when* S_f = S_0. Low-confidence proposal; keep if "possibly" is deliberate hedging. | n/a | I'd like to induce doubt in the mind of the naive user. So maybe instead of "often", would "sometimes" be translateable?|

### B. Symbol ride-along (§4-style)

| Key | Current | Proposed | Decision |
|---|---|---|---|
| `mpf_solve_desc` | `Using **D<sub>0</sub>**, n, and S<sub>f</sub>…` | `Using **d<sub>0</sub>**…` (matches `mpf_pipe_diameter`'s lowercase d₀) | Yes |

### C. Intent consolidation (needs authorization — see Cross-cutting §1)

The 11 "Drop in the height of a column of water…" intents (`dw_main_menu/title/desc`,
`hw_main_menu/title/desc`, `mphl_main_menu/title/desc`, `mphl_friction_loss`, `mphl_total_loss`)
all decode the same calque-trap ("head"). Glossary `head loss` already carries the full sense.
Propose: collapse each to `| gloss: head loss` (keeping any page-specific left-of-pipe payload,
e.g. "…using the Darcy-Weisbach equation"). Also: `mphl_junction_loss`'s intent still says
"junction (point) losses" — **stale vs. the D3 rename** to "Minor (local) loss"; propose
`Minor (local) head loss at junctions, entrances, bends, and valves. | gloss: minor loss`.

TGH: OK.
---

## Category 4 — Irrigation & seepage (`cs_` / `irr_`)

### A. Calque-traps / wording

| Key | Current | Proposed | Obsoletes intent? | Decision |
|---|---|---|---|---|
| `irr_card_weir_uniform_desc` | `Measure flow over a diversion dam crest, **check structure**, or weir board.` | KEEP the correct jargon, but "check structure" will be read as imperative "verify the structure" — the exact polysemy class Wave 0 exists for. ADD glossary term `check structure` (irrigation flow-control gate; avoid verb "to check/verify") + intent pointer. Alternative English fix: `…diversion dam crest, check structure (flow-control gate), or weir board.` | n/a → add | Yes |
| `irr_quickref_html` | `…procedures commonly required by **water masters** and irrigation districts.` | ADD intent: "water master = the official who administers water rights/deliveries (ditch rider, water bailiff); not a skill title." English stays. | n/a → add | OK. Also (in English) "zanjero" (from Spanish "ditch rider/walker/master")|
| `cs_notes_2_def` | `…Seepage losses above 30% of inflow often **justify a lining investment**.` | Clean enough — keep. Listed only because wave-1 reviewers should confirm "justify an investment" translates. | n/a | OK. I agree.|

### B. Suspected intent error (Tom ruling needed — I did not touch it)

| Key | English | Intent | Issue | Decision |
|---|---|---|---|---|
| `cs_Ec` (+ echoes in `cs_main_desc`, `irr_card_seepage_head`) | `Conveyance efficiency, E<sub>c</sub>` | `Conservation Efficiency` | **Conveyance** efficiency (Q_out/Q_in) and **conservation** efficiency are different irrigation concepts. If the intent means "in languages without a 'conveyance' cognate, the conservation register is acceptable," it should say so explicitly; as written it will steer translators to the wrong term. Glossary `conveyance efficiency` exists — propose `| gloss: conveyance efficiency` after Tom rules on intent wording. Same question for the `seepage`→`Infiltration` intents (`cs_main_menu`, `cs_Q_loss`, `irr_card_seepage_*`): glossary `seepage` exists; propose gloss pointers. | I don't know if I agree. Let's discuss? The point is to conserve water even in the classical scientific sense of the conservation of mass. This is a water mass balance calculation dependent on the principle of the conservation of mass. I think I strongly prefer the literal "conservation" over the conventional "conveyance" since what we really mean is "Efficiency of conservation of water along a conveyance reach" |

### C. Ride-alongs

| Key | Issue | Proposed | Decision |
|---|---|---|---|
| `cs_loss_positive/zero/negative` | `Qin > Qout — seepage detected` — plain ASCII `Qin`/`Qout` (no `<sub>`), inconsistent with `Q<sub>in</sub>` labels | `Q<sub>in</sub> > Q<sub>out</sub> — seepage detected` etc. | |
| `cs_Ec_good/fair/poor` | Trailing baked-in `✓`/`⚠` glyphs; rendered raw (bypasses `writeCheckHTML`) — D5 straggler | Strip glyphs from English (`Good — Ec ≥ 80%` / `Fair — Ec 60–80%` / `Poor — Ec < 60%`), render via `writeCheckHTML` (good=✓; poor=⚠; fair: Tom's call — ⚠ or no glyph) | Standardize in all ways. |
| `cs_water_value`, `cs_lining_cost` | Labels don't state the per-unit basis (per volume? per area?) — translators and users must guess | ADD `ec-tip` tooltips stating the basis (confirm from `js/canal-seepage.js` units before wording) | Intentionally unitless to allow any local currency agnostically. We can state so in _intent or in the glossary? |

---

## Category 5 — Micro-hydro (`mhp_`)

### A. Colloquialisms / casual wording — reword

| Key | Current | Proposed | Obsoletes intent? | Decision |
|---|---|---|---|---|
| `mhp_vel_low` | `Velocity low - risk of sedimentation and air entrainment.` | `Velocity is low; sedimentation and air-entrainment risk.` (aligns with reformed `mtc_vel_low`) | n/a | Yes |
| `mhp_vel_high` | `Velocity high - check transition losses, available energy, and water hammer.` | `Velocity is high; check transition losses, available energy, and water hammer.` — NOTE: this makes it an **exact duplicate** of reformed `mtc_vel_high` → item-90 D1 merge candidate (borrow one, retire the other) as a follow-up | n/a | Yes |
| `mhp_notes_3_def` | `Penstock losses below 10% of gross head are generally **economic**. The optimal trade-off…often falls around 4–6% for **high-value electricity sites**.` | `…are generally **economical**. …often falls around 4–6% **where electricity is most valuable**.` (economic≠economical; stacked modifier) | n/a | OK. Good catches here and all around! |
| `mhp_notes_4_term` | `**Junction (Point)** Losses k<sub>m</sub>` | `**Minor (Local)** Losses, k<sub>m</sub>` — stale vs. D3 canonical wording; its `_def` already explains the "minor" convention | n/a | Yes |

### B. Dead key found

`mhp_vel_ok` (`Velocity reasonable ✓`, baked glyph) is **orphaned**: `js/micro-hydro-power.js`
only uses `mhp_vel_ok_short`; the `vel_ok/vel_low/vel_high` entries at Micro-Hydro-Power.php
lines 58–60 are dead pageConfig (the live tips load at lines 61–63... verify line drift). Propose:
delete the dead pageConfig lines; retire `mhp_vel_ok` from all 27 lang files (mechanical).

TGH: OK
### C. Intent consolidation (see Cross-cutting §1)

`mhp_main_menu/title` intents fine. `mhp_main_desc` intent is garbled English
("Estimate run-of-river (no dam) electricity generation output **calculator**") — propose
`Estimate of electricity generation from a run-of-river (no dam) micro-hydropower plant.`
`mhp_gross_head`, `mhp_hl_check`, `mhp_notes_1_term`, `mhp_notes_3_term` intents restate the
head calque-trap — propose `| gloss: head loss` (or `gross head`) pointers.

TGH: OK
---

## Category 6 — Shared UI / units (`u_` / `calc_` / `menu_` / `points_` / `template_` / `view_` / `ec_name_` / `contact*` / `about_` / `install_`)

### A. Colloquialisms / idioms — reword

| Key | Current | Proposed | Obsoletes intent? | Decision |
|---|---|---|---|---|
| `calc_defaults_confirm` | `Reset calculator to **factory defaults**?` | `Reset calculator to **the original default values**?` (no factory involved; classic idiom calque) | n/a | Yes |
| `points_data_help` | `(or Copy/Paste using data area)` | `(or copy/paste using the data area)` (article; drop odd capitalization) | n/a | Yes |
| `view_printable` | `Printable version (reload/refresh **to restore**)` | `Printable version (reload the page **to return to the normal view**)` ("restore" is ambiguous — restore what?) | n/a | Yes |
| `about_body_html` | `…please **get in touch**.` | `…please **contact me**.` (one-word swap; rest of the mission text is deliberate voice — keep) | n/a | Yes |

### B. Keep-as-is dispositions (deliberate voice — intent is the right vehicle)

| Key | Disposition | Decision |
|---|---|---|
| `template_welcome` | Idiomatic on purpose ("Drop your fears at the door; love is spoken here"). The existing intent IS the translatable payload. **Keep both.** | Yes |
| `template_feedback` | Playful voice ("your valued words of suggestion or praise…exceed your expectations in every way?"). Keep, or ADD intent giving translators a plain paraphrase ("Please send suggestions or compliments."). | Add |
| `about_body_html` "free as in freedom" | Established FLOSS phrase; translators render as "libre". Keep; glossary/intent optional. | Yes |

### C. Flags

| Key | Issue | Proposed | Decision |
|---|---|---|---|
| `u_grade`, `u_gradePercent` | `rise/run` is an English slope mnemonic — literal translation is meaningless | ADD intent: "vertical rise divided by horizontal run (slope as a ratio) | layout: unit token, keep short" | Yes |
| `contactSpamPostfix` | Functional question, not language: the spam answer presumably must be typed as the **English** word ("six"). If `formmail.php` only accepts English, translation of the instructions is misleading. Needs a code check before any translation sprint touches it. | Verify accepted answers; either accept localized number-words or state "answer in English" in the string | 1. Only "six" is accepted, and it must be clear that the English word is required. 2. In the emergent age of AI, this may be a trivially superable challenge for bots. On the other hand, I can confirm that the obscurity of this "roll-your-own" form or whatever other factors are in play are successful in keeping me from seeing spam submittals, though I do see sincere messages. |
| `essc_btbw`, `essc_mcr` | Orphan prefix `essc_` (Erosion Setback & Scour) — not in any of the 6 categories, no calculator page found | Disposition: confirm orphan → exclude from item-85 payloads or delete | Delete. We can rethink later as needed. |

---

## rc_ / ip_ harvest (already-translated calculators)

Detection already happened here — the intents were the grievance list. Most `rc_` intents are
legitimate synonymic expansions (the designed payload) and **survive**. Residual findings:

TGH: OK

### A. ip_ English reforms (colloquialisms still in source despite intent migration)

| Key | Current | Proposed | Obsoletes intent? | Decision |
|---|---|---|---|---|
| `ip_count` (tooltip) | `…For the reach **right at** the test lateral&rsquo;s own takeoff…` | `…For the reach **located exactly at** the test lateral&rsquo;s own takeoff…` | keeps `| gloss:` pointer; lets glossary `reach` note drop its "right at" decoder | No. "For the reach of the main line that ends at the test lateral line, ..."|
| `ip_notes_1_def` | `Guesses the pressure…then **marches** the Energy Grade Line back toward the supply…Elevation and velocity head are **backed out** at each node…` | `…then **steps** the Energy Grade Line back toward the supply, reach by reach…Elevation and velocity head are **subtracted** at each node…` | keeps gloss pointer | Yes |
| `ip_notes_2_def` | `…so its draw is a **flat multiplication**…the reach **right at** the test lateral&rsquo;s own takeoff…flow **stepping down** as each emitter in the reach **draws off**.` | `…so its withdrawal is a **simple multiplication**…the reach **located exactly at** the test lateral&rsquo;s own takeoff…flow **decreasing** as each emitter in the reach **withdraws water**.` | keeps gloss pointer; "draw-off" decoder in glossary `reach` note becomes deletable | "the reach **right at**" -> "the reach of the main line that ends at the test lateral line" |
| `ip_notes_3_def` | `…useful for **spotting** an over- or under-pressured system…&Delta;pressure estimate is too small**)**.` | `…useful for **detecting**…` + delete the stray `)` (typo, also present in `ip_du_estimate` tooltip) | keeps gloss pointer | Yes |
| `ip_dp_avg` (tooltip) | `How much higher (or lower) you **believe** a typical/average lateral **runs**…a **biased-low stand-in** for a field average…` | `How much higher (or lower) you **estimate** a typical lateral **operates**…an **underestimate** of the field average…` | n/a | Yes |
| `ip_du_estimate` (tooltip) | `…Values at or above 1 are possible and **not a bug**…estimate is too small**)**.` | `…are possible and **not an error**…` + delete stray `)` | keep gloss pointer | Yes |
| `ip_worst_case_warn` | `…or **pipes can be smaller**.` | `…or **the pipes could be made smaller**.` | n/a | Yes |

### B. rc_ intent defects (cleanup needs authorization)

| Key | Defect | Proposed fix | Decision |
|---|---|---|---|
| `rc_yn` intent | Contains a broken copy-paste HTML fragment (unclosed `<span title="…` before the pipe) | Rewrite intent: `Enter the normal depth in the channel that delivers flow to this chute. | Upstream, not downstream: ponding reduces erosion UPSTREAM of the chute inlet. Do not flip the direction.` | Yes |
| `rc_main_desc` intent | Says "published…in **1988**"; the method is **1998** (title and reference agree on 1998) | `1988` → `1998` | Yes |
| `rc_eq2` intent | `…it is a **big** or steep slope.` | `…it is a steep slope.` | No. I want ample synonyms. Large, steep, severe, high, all may work depending on the target language. "big" also works, though unaturally |

### C. rc_/ip_ D5 stragglers (baked glyphs / marker words — English + JS ride-along)

| Key | Current | Proposed | Decision |
|---|---|---|---|
| `rc_eq_warn_low/high` | `**Warning:** S0 < 0.02 — below Robinson validation range` — translated marker word (D5 forbids) + `S0` missing `<sub>`; rendered raw in `js/rock-chute.js` | `S<sub>0</sub> &lt; 0.02 — below Robinson validation range`, glyph via `writeCheckHTML` | Yes |
| `rc_pond_ok` / `rc_pond_warn` | `Hp > yn — ponding upstream **✓**` / `**⚠** Hp ≤ yn — no ponding — inlet erosion potential` — baked glyphs, inconsistent position, no `<sub>` | Strip glyphs; `H<sub>p</sub> &gt; y<sub>n</sub> — ponding upstream` etc.; render via `writeCheckHTML` with the verbose intents as tips | Yes |
| `ip_pressure_warn_short` | `Low **⚠**` | `Low`; glyph via `writeCheckHTML` (check `js/irrigation-pressure.js` wiring) | Yes |
| `ip_elev_ds_missing_warn` | `…enter it for an accurate result **⚠**` | Strip trailing glyph; supply via `writeCheckHTML` or leading position | Yes |

---

## Cross-cutting (applies across categories)

1. **Intent consolidation to `| gloss:` pointers (single authorization request):** ~18 verbose
   intents restate senses the glossary already owns — the 11 head-loss intents (cat 3), 4 mhp_
   head intents (cat 5), and the cs_ seepage/conveyance pairs (cat 4, after the §B ruling).
   One yes/no from Tom covers the lot; each row above lists its target term.
   TGH: Yes
2. **D5 glyph stragglers:** `cs_Ec_*`, `rc_pond_*`, `rc_eq_*`, `ip_*_warn*`, plus orphan
   `mhp_vel_ok` — item 90's D5 pass converted the listed verdict groups but these render sites
   still bake glyphs into English strings. English edits + small JS changes, no translation cost
   (the 26-language propagation rides item 85 anyway).
   TGH: Yes.
3. **Glossary follow-ups once English reforms land:** update glossary `reach`
   translation_notes (quotes the old "right at the takeoff"/"draw off" wording); add `crown` and
   `check structure` terms; note that `gloss: draw-off/takeoff/bisection` pointers currently
   resolve to notes inside the `reach` entry rather than standalone terms.
   TGH: Yes

---

## Implementation status — 2026-07-07 [Fable], per Tom's decisions above

**Applied to `lib/lang.ec.en.php`** (all approved rows, with Tom's wording where he supplied it):
- Cat 3: `mpf_spreadheet_notice` → "**Try** the spreadsheet version" (Tom's alternative); `mpf_note_1` "to estimate"; `mphl_note_1` → Tom's positive phrasing "must be above … (and higher than the pipe!)"; `mpf_friction_slope` → "**sometimes**" (Tom's choice — yes, it translates cleanly everywhere); `mpf_solve_desc` `d₀`. All 11 head-loss intents collapsed to short payload + `| gloss: head loss`; `mphl_junction_loss` intent updated per D3.
- Cat 2: intents added for `ws_main_menu` / `wi_menu` (the wi_ one carries Tom's synonyms: "a crest that slopes, an uneven crest, or a crest of variable depth"), `wi_notes_we_def` (pseudocode note), `or_regime_warn_tip` (`| gloss: crown`).
- Cat 4: `irr_card_weir_uniform_desc` + `irr_quickref_html` intents added (check structure; water master with **zanjero**); `cs_water_value`/`cs_lining_cost` intents state the per-volume/per-area basis and the deliberately-unspecified currency; `cs_loss_*` got `Q<sub>in</sub>`/`Q<sub>out</sub>`; `cs_Ec_good/fair/poor` glyphs stripped + `E<sub>c</sub>`, rendered via `writeCheckHTML` (fair=⚠ with the warn CSS class — flag if you want fair glyph-less). **`cs_Ec` conservation/conveyance intents untouched — discussion open.**
- Cat 5: `mhp_vel_low/high` reformed; `mhp_notes_3_def` economical/most-valuable; `mhp_notes_4_term` → "Minor (Local) Losses, k<sub>m</sub>"; `mhp_vel_ok` deleted from en + all 26 files and the dead pageConfig removed — which also **fixed a live bug**: Micro-Hydro-Power.php defined `vel_high/vel_low` but the JS reads `mhp_vel_high/mhp_vel_low`, so that page's velocity-check tooltips were undefined; config keys renamed to match. mhp_ intents fixed/glossed.
- Cat 6: `calc_defaults_confirm`, `points_data_help`, `view_printable`, `about_body_html` ("contact me") reworded; `template_feedback` intent added; `u_grade`/`u_gradePercent` intents added (new `layout: unit token` value registered in CLAUDE.md); `contactSpamPostfix` → "(Please answer with the English word. …)"; `essc_*` keys deleted from all 27 lang files (incl. `essc_q`, which existed only in translations).
- rc_/ip_: all seven ip_ reforms applied with Tom's "reach of the main line that ends at the test lateral line" phrasing in both spots (+ follow-on fix: the now-dangling "beyond that takeoff" → "beyond that point"); both stray `)` typos removed; `rc_yn` intent repaired; `rc_main_desc` intent 1988→1998; `rc_eq2` intent → "a large (big, steep, severe, high) slope" per Tom's ample-synonyms preference; `rc_eq*`/`rc_pond_*` glyph/marker-word reform with new `rc_pond_ok_tip`/`rc_pond_warn_tip` keys wired through Rock-Chute.php + `writeCheckHTML`; `ip_pressure_warn_short`/`ip_elev_ds_missing_warn` glyphs moved into `writeCheckHTML`.

**Glossary v1.5:** added `crown` + `check structure` (definition/synonyms-first per Tom's stated
preference, wrong-sense note kept brief in translation_notes; translations empty, marked
`pending-wave-1`); `reach` notes updated ("right at" decoder removed; "drawn off" note kept —
`ip_is_lateral`'s tooltip still uses it, see negatives/leftovers list). prefixToTermNames: `crown`
→ or/odt; new `irr` row (incl. `check structure`); `minor loss` → mphl/mhp.

**QA:** `php -l` clean on all 27 lang files + touched pages; `node --check` clean on 3 touched JS
files; `lang_syntax_validate.php --lang=en` clean; all 13 affected calculator pages CLI-render
without fatals; payloads regenerated, `--check` = FRESH.

**Negatives watch-list (Tom's new directive, next pass):** the remaining negative-stacked strings
are `ip_du_estimate` tooltip + `ip_notes_3_def` ("not lower … therefore also not the point of
lowest pressure", "not a substitute", "no necessary relationship"), `ip_q_supply` ("only, not the
whole zone"), `irr_card_pressure_desc` ("not just a catalog emitter flow rate"),
`irr_card_weir_irregular_desc` ("is not a single uniform elevation"), `or_regime_twe_above_hwe*`.
Also leftover: `ip_is_lateral` tooltip still says "drawn off by individual emitters" (not swept
this round — propose "supplying individual emitters" next pass).

**Open discussion items:** (1) `cs_Ec` conservation-vs-conveyance — Tom's ruling pending
discussion; (2) `crown` glossary style — applied definition-first per Tom's comment, review
welcome; (3) `mhp_vel_high` is now an exact duplicate of `mtc_vel_high` — item-90 D1 merge
deferred as a follow-up (incumbency favors `mhp_`, used by 5 pipe pages vs. 2 channel pages).

---

## Closeout — 2026-07-07 [Fable]; Tom approved both discussion items and ordered the queued work done

- **`cs_Ec` RESOLVED (both-registers):** English label stays `Conveyance efficiency, E<sub>c</sub>`
  (USBR/FAO term); intent carries Tom's meaning as the translatable payload: "Efficiency of
  conservation of water along a conveyance reach: the fraction of inflow still flowing at the
  downstream end. | gloss: conveyance efficiency". The related seepage/infiltration intents
  (`cs_main_menu/desc`, `cs_Q_loss`, `irr_card_seepage_head/desc`) converted to synonym payloads
  + `gloss: seepage` (and `conveyance efficiency`) pointers.
- **`crown` glossary entry confirmed** as applied (definition + synonyms first, brief wrong-sense
  note in translation_notes).
- **D1 merge executed:** `mtc_vel_high` deleted from en; Manning-Trap.php + Manning-Irregular.php
  pageConfig now source the `mtc_vel_high` config property from `$ec_lang['mhp_vel_high']`
  (JS untouched). Translations of `mtc_vel_high` left in the 26 files per the English-only
  consolidation convention; they reconcile in item 85.
- **Negatives pass applied** (positive rewrites): `ip_du_estimate` tooltip and `ip_notes_3_def`
  ("at or above the estimated field average, so some other emitter is the point of lowest
  pressure"; "a separate check to read alongside the uniformity number, since the design/rated
  flow is independent of…"), `ip_q_supply` tooltip ("for the whole zone/system, see Q_zone…"),
  `irr_card_weir_irregular_desc` ("varies in elevation or profile"), `ip_is_lateral` ("from which
  individual emitters withdraw water" — retires the last "drawn off"), `or_regime_warn`
  ("Outside orifice regime"). **Kept deliberately:** the mission-voice negatives
  (`template_welcome`, about-page "not going to ruin everything"), `ip_worst_case_warn`
  ("probably not the worst-case emitter" — the caution IS the content), scope parentheticals
  ("no pump curve", "not the full field"), and single-contrast constructions.
- **Gloss-pointer hygiene:** `takeoff`/`draw-off` removed from the `ip_count`/`ip_notes_1_def`/
  `ip_notes_2_def` gloss lists (those words no longer exist in the English source); glossary
  `reach` note updated to match.
- **Final QA:** php -l clean (27 lang files + all touched pages + generator); node --check clean
  (7 JS files); `lang_syntax_validate.php --lang=en` clean; a full-suite dangling-key check
  (every `$ec_lang[...]` referenced by any page exists in en) passes; every calculator page
  CLI-renders with no fatals; payloads regenerated, `--check` = FRESH.

**Wave 0 is COMPLETE for all 6 calculator categories + rc_/ip_. Wave 1 (category 1 anchors) is
unblocked** — next step is the wave-1 sprint proposal, gated on explicit authorization per
CLAUDE.md.
