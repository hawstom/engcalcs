# `$ec_lang_intent` Audit (Task 125, 2026-07-17)

Two-part audit of `$ec_lang_intent`, per `dev/ROADMAP.md` Task 125.

## Part 1: Non-English leakage — FIXED

Swept all 26 non-English `lib/lang.ec.??.php` files for `$ec_lang_intent[...]=` assignments.

**Finding:** all 26 files had leaked entries — 110 lines total. Every leaked value was an empty
string (`''`), consistent with a scaffold/copy artifact rather than authored translator content
(no non-English file contained a populated intent string). Per-file counts ranged from 4 (most
languages) to 7 (`es`); `ar`/`bg`/`es` additionally had `calc_copy_link`, `calc_copy_link_done`,
and `calc_defaults_confirm` entries not present in the other 23.

**Action taken:** removed all 110 lines from all 26 files (`sed -i '/^\$ec_lang_intent\[/d'`).
This is licensed by CLAUDE.md's own carve-out — the AI-permission restriction on `$ec_lang_intent`
applies to the canonical English array; removal of leakage in a non-English file is explicitly not
covered by that restriction. All 26 files verified `php -l` clean after removal. No non-English
file has any `$ec_lang_intent` entry going forward — recommend the pre-sprint checklist or
`lang_syntax_validate.php` gain a permanent leakage check so this can't silently reappear from a
future scaffold copy.

## Part 2: English `_intent` over-use review — REPORT ONLY, no edits made

**Ratio computed:**
- Total `$ec_lang` keys in `lib/lang.ec.en.php`: 507
- Total `$ec_lang_intent` declarations: 498 (nearly 1:1 with `$ec_lang` — but 369 of those are
  empty-string placeholders, i.e. declared but carrying no guidance)
- **Non-empty `$ec_lang_intent` entries: 129 → 129/507 = 25.4%**

Tom's expectation was "probably much fewer than one-fourth." The actual ratio is *at* one-fourth,
not under it — read as mild confirmation of the over-use concern, not a false alarm.

### Bucket A — Legitimate, keep (real transliteration/polysemy risk)

Roughly 30 entries earn their place under the CLAUDE.md scope rule — real, checkable risk, not
generic definition. Examples: `u_gradePercent`/`u_grade` (grade = ratio, not the verb "to run"),
`mi_station` (verified bus/train-station mistranslation in 6 languages), `mi_is_bank` (HEC-RAS
"bank" boundary sense), `mtc_note_1` (verified initialism-compression defect across 8 languages),
`rc_sg` (specific gravity vs. relative density terminology note), `rc_yn`/`rc_Hp` (verified
upstream/downstream direction-flip and weir-head-not-pressure risks), `ip_x` (discharge exponent vs.
electrical "discharge"), `ip_elev_ds` (DS-abbreviation collision risk), `irr_quickref_html`
("water master"/zanjero/ditch rider — real regional-title risk). These should not be touched.

### Bucket B — `gloss:` entries that restate the glossary definition inline (31 entries)

The tag vocabulary in CLAUDE.md is explicit: `gloss: <term>` means **"defer to `glossary.json`
term `<term>` for full disambiguation; do not restate it inline."** 31 entries carry a `gloss:` tag
*and* a full inline restatement of that same definition before the pipe — violating the very rule
the tag exists to enforce. Pattern repeats 3x per calculator (menu/title/desc all carry the same
"head loss" or "seepage" restatement):

- `dw_main_menu`, `dw_main_title`, `dw_main_desc` (head loss, restated 3x)
- `hw_main_menu`, `hw_main_title`, `hw_main_desc` (head loss, restated 3x)
- `mphl_main_menu`, `mphl_main_title`, `mphl_main_desc`, `mphl_friction_loss`,
  `mphl_junction_loss`, `mphl_total_loss` (head loss / friction loss / minor loss, restated 6x)
- `wi_menu` (irregular channel)
- `or_regime_warn_tip`, `or_notes_2_term`, `or_notes_2_def` (crown)
- `mhp_main_desc`, `mhp_gross_head`, `mhp_hl_check`, `mhp_notes_3_term` (run-of-river, gross head,
  head loss)
- `odt_h2_ok`, `odt_h2_warn` (crown)
- `irr_card_weir_uniform_desc`, `irr_card_seepage_head`, `irr_card_seepage_desc` (check structure,
  seepage, conveyance efficiency)
- `cs_main_menu`, `cs_main_desc`, `cs_Q_loss`, `cs_Ec` (seepage, conveyance efficiency)
- `ip_group_upstream`, `ip_group_downstream`, `ip_is_lateral` (upstream, downstream, lateral/mainline)

**Recommendation (pending Tom's sign-off):** trim these to the bare tag form the vocabulary
already specifies, e.g. `$ec_lang_intent['dw_main_menu']='| gloss: head loss';` — matching the
clean pattern already used correctly by `mi_menu`/`mi_main_title`/`mi_main_desc` (`'| gloss:
irregular channel'`, no restatement). This removes redundant translator-attention cost without
losing any information the glossary doesn't already carry.

### Bucket C — Plain-symbol restatements, no real jargon risk (~10 entries)

`mi_elevation`, `mi_tau`, `mi_t`, `mi_pw`, `mi_a`, `mi_rh`, `mi_n617`, `mi_v617`, `mi_fr617`,
`mi_hv617` all restate an obvious column-heading meaning ("The top width, T, of this segment")
for symbols that are universal, untranslated engineering notation (T, P_w, A, R_h, n, v, Fr, h_v).
These carry `layout: column heading` correctly but are missing the `symbol` flag the vocabulary
defines for exactly this case, and the prose restatement adds nothing a translator needs — the
symbol itself doesn't translate, and "of this segment/region" is not compositionally at risk.

**Recommendation (pending sign-off):** replace with `| layout: column heading; symbol` (no
restatement), consistent with how `mpf_shear_stress` and `wi_notes_we_def` already use the
`symbol` flag alone.

### Bucket D — Non-technical strings with no transliteration risk (3 entries)

`template_welcome`, `template_feedback`, `ec_name_label` are tone/mission strings, not engineering
jargon. They carry no polysemy or transliteration risk under the CLAUDE.md scope rule as written.
Flagging for Tom's judgment call rather than recommending removal outright — `template_welcome` in
particular touches the project's mission statement (love-language framing), which may warrant
deliberate translator guidance for reasons outside the jargon-only rule. Not treating this as an
open-and-shut over-use case.

### Bucket E — `rc_` (Rock Chute) verbose restatements with no flagged risk (~30 entries)

The largest single concentration of unflagged plain-English restatement is in `rc_*`: entries like
`rc_sg_check` ("This is a check of the validity of the provided specific gravity of the rock"),
`rc_pond_ok` ("The condition is good. There is ponding upstream of the chute"), `rc_eq1`/`rc_eq2`,
`rc_SD_ok`/`rc_SD_low`/`rc_SD_high`, `rc_crest_radius`, `rc_crest_length`, `rc_layer`, `rc_n_chute`,
`rc_Vm`/`rc_qm`/`rc_qs`, `rc_notes_1_term` through `rc_notes_5_def` (non-`_6_def`/`_7_def`, which
are legitimate per Bucket A) — read as leftover author-drafting description rather than targeted
translator guidance. None carry a tag (`avoid`/`symbol`/`layout`/`gloss`) or name a specific
mistranslation risk. This looks like the single largest removal opportunity by entry count.

## Resolution (Tom's sign-off, 2026-07-17)

Tom reviewed all four buckets and approved:
- **Bucket B (32 entries):** trim to bare tag form. Done — each now reads
  `'| gloss: <term>'` (or with an additional `avoid:` clause where one existed), matching the
  `mi_menu`-style clean pattern.
- **Bucket C (10 entries):** trim to bare tag form. Done — each now reads
  `'| layout: column heading; symbol'`.
- **Bucket D (3 entries):** keep for now, no change — `template_welcome`, `template_feedback`,
  `ec_name_label` untouched.
- **Bucket E (34 entries):** remove — confirmed as a violation of scope (no tag, no named risk).
  Done — value set to `''`, consistent with the suite's existing convention of a declared-but-empty
  placeholder for keys needing no translator guidance. `rc_notes_6_def` and `rc_notes_7_def` were
  excluded from this bucket (kept, Bucket A) — despite having no formal `|` tag, they carry the same
  real disambiguation content (apron ≠ clothing, weir head ≠ pressure, upstream/downstream direction)
  as the already-kept `rc_apron_length`/`rc_Hp` entries.

**Final count:** non-empty `$ec_lang_intent` entries dropped from 129 to 95 (out of 507 `$ec_lang`
keys) — **18.7%**, safely under Tom's "much fewer than one-fourth" bar. `php -l` clean on
`lib/lang.ec.en.php` after all edits; spot-checked representative entries from each bucket.

Task 125 is complete — both parts done, findings resolved with Tom's explicit sign-off.
