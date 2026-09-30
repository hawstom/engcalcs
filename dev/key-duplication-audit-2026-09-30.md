# Task 699 audit — lazy duplication in language keys

Method: parsed all 2157 `$ec_lang` entries in `lib/lang.ec.en.php` into key/value/line-number
triples. Grouped by exact value and by a normalized value (lowercase, trailing `:`/`…`/`.`
stripped, whitespace collapsed) to catch near-duplicates that differ only in case or trailing
punctuation. `php dev/scripts/key_hygiene_check.php` was run first (per instructions); it found
no new dead keys beyond the two already-ruled KEEPs (`lpn_geomap`, `lpn_xymap` — canonical
wording anchors, not debt) and no suffix drift, so this audit is entirely the duplication half
the script doesn't cover. Renders were confirmed by grepping `js/*.js` and `*.php` for each
candidate key (excluding the `lang.ec.*` definition lines themselves).

## Counts

- English keys: 2157
- Groups sharing a normalized value (2+ keys): 74 groups, 172 keys involved
- Groups sharing the exact same string verbatim: same set minus a handful of
  punctuation-only variants (trailing `…`/`:`), i.e. ~70 groups are exact-string duplicates
- Findings below: 23, covering 56 of those keys (translation cost saved if all applied:
  ~33 keys × 26 languages ≈ 858 translations retired)
- Breakdown by recommendation: MERGE 15, REDESIGN 2, PARAMETERIZE 0 (no case fit the "one key
  with a placeholder" shape better than a plain merge — see note under REDESIGN #16), KEEP 6
  (documented so they aren't re-proposed)

## Top 10 (by translation cost saved × confidence)

1. "Pressure" — 5 keys → MERGE to 1 (saves 4×26=104)
2. "Coordinate system" — 4 keys → MERGE to 1 (saves 3×26=78)
3. "Velocity" — 4 keys → MERGE to 1 (saves 3×26=78)
4. "Flow" — 4 keys → MERGE to 1 (saves 3×26=78)
5. find/op-find case-duplication (4 pairs, 8 keys) → REDESIGN, capitalize in JS (saves 4×26=104)
6. "Elevation" — 3 keys → MERGE to 1 (saves 2×26=52)
7. "Length" — 3 keys → MERGE to 1 (saves 2×26=52)
8. "Close" — 3 keys → MERGE to 1 (saves 2×26=52)
9. "Status" — 3 keys → MERGE to 1 (saves 2×26=52)
10. "Time" (menu/column headers) — 3 keys → MERGE to 1 (saves 2×26=52)

---

## Findings

Each entry: keys, English value(s), where each renders (file:line, confirmed by grep), recommendation.

### 1. "Pressure" — 5 keys, MERGE candidate (confidence: high)
- `bpn_show_p` = 'Pressure' — `Branched-Network.php:125` (checkbox label)
- `lpn_units_pressure` = 'Pressure' — `Looped-Network.php:123` (Settings > Units row name)
- `lpn_result_pressure` = 'Pressure' — `Looped-Network.php:872`, `2506`; `js/looped-network.js:17360` (results column header)
- `lpn_color_mode_pressure` = 'Pressure' — `Looped-Network.php:2733`; `js/looped-network.js:8045` (color-by-mode option)
- `lpn_ff_limit_pressure` = 'Pressure' — `Looped-Network.php:2851`; `js/looped-network.js:55545` (fire-flow limit option)
All five are the bare noun in a label/header/option slot — the narrowest-use-fits-a-whole-label
test in `label-normalization-decision.md` is satisfied (no sentence context). MERGE the four
`lpn_` keys into one (`lpn_result_pressure` is the oldest by line number, or pick by menu order
per the incumbency rule); leave `bpn_show_p` as a fifth borrower of the same key, or merge it too
if cross-calculator reuse is wanted here — the doc explicitly sanctions that.

### 2. "Coordinate system" — 4 keys, MERGE candidate (confidence: medium-high)
- `lpn_new_coordsys` = 'Coordinate system' — `Looped-Network.php:1478` (fieldset legend, already reused at line 1551)
- `lpn_new_crs` = 'Coordinate system' — `Looped-Network.php:1498` (button aria-label)
- `lpn_crsbox_title` = 'Coordinate system' — `Looped-Network.php:1650` (popover dialog title)
- `lpn_crs_list` = 'Coordinate system' — `Looped-Network.php:1668` (listbox label)
All four name the same concept in four UI slots (legend, aria-label, dialog title, list label),
none of them a sentence. `lpn_new_coordsys` is already reused once (proof the pattern works).
MERGE the other three onto it.

### 3. "Velocity" — 4 keys, MERGE candidate (confidence: high)
- `mhp_notes_2_term` = 'Velocity' — Microhydropower notes table term, line 420
- `lpn_units_velocity` = 'Velocity' — Settings > Units row, line 1162
- `lpn_result_velocity` = 'Velocity' — results column header, line 1200
- `lpn_ff_limit_velocity` = 'Velocity' — fire-flow limit option, line 4021
MERGE the three `lpn_` keys; `mhp_notes_2_term`'s render context (a term column in a notes
table) is worth a quick look before folding in — likely fine, same bare noun.

### 4. "Flow" — 4 keys, MERGE candidate (confidence: high)
- `ip_flow` = 'Flow' — Irrigation Pressure field label, line 656
- `bpn_show_q` = 'Flow' — Branched Pipe Network checkbox label, line 742
- `lpn_units_flow` = 'Flow' — line 1161, confirmed render `Looped-Network.php:124`
- `lpn_result_flow` = 'Flow' — line 1199
Same shape as #1/#3. MERGE the `lpn_` pair at minimum; the cross-calculator four-way merge is
the fuller win.

### 5. Find-panel option/label case duplication — 8 keys in 4 pairs, REDESIGN (confidence: high, verified in code)
- `lpn_find_op_conn_unlinked` = 'no links at node' vs `lpn_find_conn_unlinked` = 'No links at node'
- `lpn_find_op_conn_noopen` = 'no open links at node' vs `lpn_find_conn_noopen` = 'No open links at node'
- `lpn_find_op_conn_nolinksource` = 'no link path to a source' vs `lpn_find_conn_nolinksource` = 'No link path to a source'
- `lpn_find_op_conn_noopensource` = 'no open path to a source' vs `lpn_find_conn_noopensource` = 'No open path to a source'
Renders: `js/looped-network.js:17573-17580` (`findConnOpDefs()`, builds the dropdown option
list, lowercase) and `js/looped-network.js:17615-17624` (`findConnLabel()`, builds the result-row
status text, capitalized). Each pair is the exact same English string, differing only in the
leading letter's case, held as two separate `$ec_lang` keys purely so one can be lowercase for
a dropdown option and the other capitalized for a status line. **REDESIGN**: keep one key per
condition (the capitalized form, since it's also the query-parser's accepted spelling per the
code comment), and capitalize/lowercase it in JS at the two call sites instead of storing both
cases in every language. Saves 4 keys × 26 = 104 translations, and removes a place where a
translator could let the two drift.

### 6. "Elevation" — 3 keys, MERGE (confidence: high)
`mi_elevation` (line 200), `bpn_show_elevation` (line 767), `lpn_field_elev` (line 986) — all
bare column/field labels for the same physical quantity.

### 7. "Length" — 3 keys, MERGE (confidence: high)
`bpn_show_length` (740), `lpn_units_length` (1152, confirmed render `Looped-Network.php:116`),
`lpn_field_length` (2342) — same pattern as Flow/Pressure/Velocity.

### 8. "Close" — 3 keys, MERGE (confidence: medium)
`lpn_close` (1027), `lpn_examples_close` (1059), `lpn_file_close` (1904) — all short imperative
button labels. Worth a quick render check before merging (one may sit in a context menu vs. a
dialog button) but same word, same grammatical slot.

### 9. "Status" — 3 keys, MERGE (confidence: high)
`lpn_result_status` (1192), `lpn_color_example_status` (1385), `lpn_reports_status` (3485) — all
column/legend headers for the same concept (open/closed state).

### 10. "Time" — 3 keys, MERGE (confidence: high)
`lpn_time_menu` (3165), `lpn_status_col_time` (3490), `lpn_full_col_time` (3510) — menu entry and
two column headers, same noun, same slot type (short header/menu word).

### 11. "None" — 3 keys, MERGE (confidence: medium)
`lpn_settings_legend_off` (3113), `lpn_source_type_none` (3329), `lpn_ff_mode_none` (4016) — all
dropdown "no selection" options. Same value, same slot type (an option meaning "nothing chosen").

### 12. "Description" — 3 keys, KEEP with caveat (confidence: n/a — flagging for a person)
`lpn_field_desc` (2423), `lpn_library_curve_note_label` (3606), `lpn_field_demand_category`
(3802). The last one is suspicious: a key named `demand_category` holding the English string
"Description" suggests a field label mismatch (advisory check (C) in `lang_syntax_validate.php`
flags name/derivation mismatches like this) rather than a duplication to merge — worth Tom's eyes
on whether that field is mislabeled, separate from this audit's scope.

### 13. "Remove" — 3 keys, MERGE (confidence: medium)
`lpn_backdrop_remove` (2672), `lpn_cp_remove` (2790), `lpn_fitting_remove` (3706) — all short
button labels on a properties panel.

### 14. `lpn_cp_restrict` / `lpn_cp_restrict_deny` — MERGE (confidence: high, verified in code)
Both = 'Restrict these characters'. `lpn_cp_restrict_deny` is one of two option labels in a
select built at `js/looped-network.js:4437-4438` (`['allow', ...Allow only these
characters'],['deny', ...'Restrict these characters']`); `lpn_cp_restrict` is a separate label
used as a read-only display value at `js/looped-network.js:42990`. Same text, same concept
(the "deny" mode's display name). MERGE — use `lpn_cp_restrict_deny` at both call sites and
delete `lpn_cp_restrict`. Saves 1×26=26.

### 15. `lpn_library_control_missing` / `lpn_library_rule_missing` — MERGE (confidence: high, verified in code)
Both = '⚠ This network has nothing called {id}'. Renders: `js/looped-network.js:47794` (Controls
import) and `:47932` (Rules import) — same warning, same placeholder, just fired from two
different import branches. MERGE into one key (e.g. `lpn_library_ref_missing`), call it from
both sites. Saves 1×26=26.

### 16. "Convert" / "Convert as" — 4 keys, mixed (confidence: medium)
`lpn_v2_restore_yes` = 'Convert' (1218), `lpn_convas_ok` = 'Convert' (1295) — both are dialog
confirm-button labels for a conversion action; MERGE candidate.
`lpn_file_convert_as` = 'Convert as…' (1271), `lpn_convas_title` = 'Convert as' (1278) — a menu
entry and a dialog title; differ only by the trailing ellipsis (menu-item convention). Likely
KEEP as-is — the ellipsis is meaningful (menu items that open a dialog get one; dialog titles
don't) rather than lazy duplication, but flagging since it's a borderline call for a person.
This is the case that looked like it might PARAMETERIZE but doesn't: there's no placeholder
shape here, just two genuinely different UI roles that happen to share wording.

### 17. "Cancel" — 2 keys, MERGE (confidence: high)
`lpn_georef_cancel` (1391), `lpn_cancel` (2062) — both plain dialog Cancel buttons.

### 18. "Settings" — 2 keys, MERGE (confidence: medium)
`lpn_menu_settings` (1540), `lpn_tool_settings` (2747) — a menu entry and a toolbar button;
same word, worth a quick render check but likely safe to merge.

### 19. "Water age" — 2 keys, MERGE (confidence: high)
`lpn_result_water_age` (1169), `lpn_quality_age` (3281) — same quantity name in two water-quality
panels.

### 20. "Diameter" — 2 keys, MERGE (confidence: high)
`bpn_show_diameter` (741), `lpn_field_diameter` (1115) — bare field/column labels, same shape
as the Pressure/Flow/Velocity family.

### 21. "Demand multiplier" — 2 keys, MERGE (confidence: high)
`bpn_demand_mult` (726), `lpn_settings_demand_multiplier` (2988) — identical setting name across
two calculators.

### 22. "Lowest pressure" — 2 keys, MERGE (confidence: high)
`bpn_p_min` (710), `lpn_scncmp_col_minpressure` (3457) — identical phrase, both column/result
headers.

### 23. Rock Chute valid-range tips — 2 pairs, KEEP (confidence: high — different meaning)
`rc_sg_low_tip` / `rc_sg_high_tip` both = 'Valid range: 2.54–2.82'; `rc_SD_low_tip` /
`rc_SD_high_tip` both = 'Valid range: 1.15–1.47'. These render as the tip on the low-bound and
high-bound input of the *same* range, so identical text is correct (both ends of one range share
one valid-range statement) — not duplication, KEEP. Listed so it isn't re-flagged.

---

## Groups seen but not written up individually (lower cost or already-plausible KEEPs)

The following normalized-duplicate groups exist (see `key_hygiene_check.php` note: this audit's
own dup-scan, not that script) but are single-instance-savings (2 keys = 26 translations each)
and read as ordinary short-word column/button reuse, same pattern as items above: `Copy`, `Help`,
`Hydraulics`, `day`, `kW`, `Select`, `Junction`, `Tank`, `Pump`, `Text`, `Customer`, `Show`,
`Head`, `Open`, `Closed`, `Edit`, `Find and replace`, `Curves`, `X`, `Y`, `Northing`, `Easting`,
`Design`, `Not stated`, `Concentration`, `kWh`, `Fire flow analysis`, `{n} selected`,
`Manage columns`, `Properties`, `Efficiency`, `High`/`Low`, `Velocity check`, `Length, L`,
`Hazen-Williams constants now match EPANET (August 2026)` (2 keys, one long sentence — a real
merge candidate, `hw_notes_epanet_term`/`bpn_notes_epanet_term`, both render as a notes-table
heading; same for the 3-way `*_notes_epanet_def` sentence already listed under the 74-group
scan). Each of these is a plausible MERGE by the same reasoning as the numbered findings; they
were left out of the numbered list only because each saves a single key (26 translations) and
the report is capped at the higher-value findings. A future pass can work this list directly —
it's already been located; no fresh 27-file read is needed.

## What this audit did not find
- No REDESIGN opportunities beyond #5 (the find-panel case duplication) jumped out — most
  duplication here is same-concept-different-calculator or same-concept-different-panel, which
  the existing "one owning key, others borrow it" convention already handles by policy; it's
  just not been applied to these ~30+ pairs yet.
- No DELETE (dead-key) candidates beyond the two `key_hygiene_check.php` already reports as
  intentional KEEPs (`lpn_geomap`, `lpn_xymap`).
- No PARAMETERIZE candidates (one key + placeholder replacing a per-element family) — the one
  place that shape would fit (`lpn_tool_add_*` element names) is already correctly one key per
  element because each is a distinct toolbar button with its own icon and tip, not a template
  slot; templating it would remove the ability to word each element's tip specifically, which
  the suite already does (see `lpn_tool_add_meter_tip` etc., each meaningfully different prose).
