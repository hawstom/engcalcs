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
| `mtc_vel_high` | `Velocity high - check transition losses, available energy, and water hammer.` | `Velocity is high; check transition losses, available energy, and water hammer.` | n/a (none set) | OK |
| `mtc_vel_low` | `Velocity low - sedimentation risk.` | `Velocity is low; sedimentation risk.` | n/a | OK |
| `mtc_vel_ok` | `Velocity reasonable for uniform-flow assumptions.` | `Velocity is reasonable for the uniform-flow assumptions.` | n/a | OK |
| `mi_notes_2_def` | `…This calculator is **more for** natural sections.` | `…This calculator is **better suited to** natural sections.` | n/a | OK |
| `mtc_note_1` | `…Choose a roughness **radio button**…(**BB** recommended)…**Fine-tune** depth…to get your desired flow with an **even** rock size. Every time you change any input value, the following iteration cycle **happens**:…` | `…Choose a roughness **option**…(**Blodgett–Bathurst** recommended)…**Adjust** depth…to reach your target flow with a **uniform** rock size. Each time you change an input, the calculator repeats these steps:…` | n/a | OK |
| `mtc_n_strickler` (+`_blodgett`, `_bathurst`) | `n for design rock size **per** Strickler` | `n for design rock size **(Strickler method)**` | n/a | OK |
| `mtc_note_2_def` | `High velocity implies high specific energy **from an available drop**.` | `High velocity implies that there was a large elevation drop that created such high specific energy**.` | n/a | OK |

### B. Display-compression / forced line-breaks / abbreviations

Policy chosen (Tom): **(1) move narrowness into CSS + (2) express constraint via `_intent`.** Hard
`<br />`s to be stripped from strings ONLY after the narrow-column CSS is confirmed to hold width
(spike on `mi_is_bank` validated 2026-07-06). Non-negotiable: columns must stay as narrow as today.

| Key | Current | Proposed (post-CSS) | Notes | Decision |
|---|---|---|---|---|
| `mi_n` | `n<br />for seg-<br />ment` | `n for segment` | remove hard hyphen "seg-ment" (breaks in every language) | OK |
| `mi_is_bank` | `R<sub>h</sub>, Q<br />region<br />boundary<br />(Bank)` | `R<sub>h</sub>, Q region boundary (Bank)` | spike-validated: CSS holds width | OK |
| `mi_station` | `Sta` | `Station` | let CSS/wrap abbreviate per language | OK |
| `mi_elevation` | `Elev` | `Elevation` | " | OK |
| `mi_n617` | `Comp.<br />n` | `Composite n` | `Comp.` ambiguous | OK |
| `mi_tau` | `Bot.<br />shear<br />&tau;` | `Bottom shear &tau;` | `Bot.` ambiguous | OK |
| `mi_d50in` | `Lining<br />median<br />rock<br />size` | `Median rock size of lining` | 4 stacked modifiers, English word order | OK |

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

## Categories 2–6 — TODO (Fable Wave 0 sweep)

Sweep the remaining `*_notes_*_def` / tooltip long strings and harvest existing
colloquialism-explaining intents (concentrated in `ip_`/`rc_`, where translation-discovery already
happened — those intents ARE the surfaced grievances). Append a section per category here.
