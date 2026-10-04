// TOM'S 2026-10-04 TIP VERDICTS, HELD. Run with:
//   node dev/lpn-spike/tip-verdict-harness.js
//
// Tom ruled on every `lpn_*_tip` one key at a time (dev/tip-review.csv). The deletions are held by
// deleted-key-harness.js; this holds the other halves, which fail silently in the browser:
//
//   1. EVERY TIP THE PAGE WIRES EXISTS. A `$ec_lang['x_tip']` in Looped-Network.php for a key that
//      lib/lang.ec.en.php no longer has renders as the empty string -- an empty tooltip, or a `?`
//      that opens on nothing -- in all 27 languages, with no symptom anywhere else.
//   2. AND EVERY KEY THIS RULING TOUCHED IS WIRED. A rewritten or new key the page does not supply
//      is a sentence translated 26 times and shown nowhere.
//   3. THE CUSTOM-PROPERTY CHARACTER TIP FOLLOWS THE MODE ("Allow uses restrict and restrict uses
//      nothing"). Driven end to end in custom-property-harness.js 7.13.17-21; here the source shape
//      that fixed it is held, so the textContent re-caption that wiped the `?` cannot come back.
//   4. A BLANK THAT FOLLOWS A DEFAULT SAYS "Default" (Tom: *"Why not change the first (blank value)
//      option in the selector to say 'Default' so that this tip is not needed?"*), at the four
//      Properties selectors and the two table columns where a blank means the project's value.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
const page = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const enKeys = new Set();
{
	const re = /^\$ec_lang\['([a-z0-9_]+)'\]\s*=/gm;
	let m;
	while ((m = re.exec(en))) { enKeys.add(m[1]); }
}
const val = (k) => {
	const m = new RegExp("^\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';", 'm').exec(en);
	return m ? m[1].replace(/\\'/g, "'") : null;
};

console.log('\n--- 1. every tip key the page wires exists in English ---');
{
	const wired = new Set();
	const re = /\$ec_lang\[['"]([a-z0-9_]*(?:_tip|_tip_[a-z0-9_]+|lpn_tip_[a-z0-9_]+))['"]\]/g;
	let m;
	while ((m = re.exec(page))) { wired.add(m[1]); }
	const missing = [...wired].filter((k) => !enKeys.has(k));
	ok('the page wires ' + wired.size + ' tip keys and every one is in lib/lang.ec.en.php',
		wired.size > 100 && missing.length === 0, missing.join(', '));
}

console.log('\n--- 2. every key this ruling touched is in English and wired ---');
const TOUCHED = [
	// Tom's rewrites
	'lpn_cp_label_tip', 'lpn_crs_place_tip', 'lpn_energy_demand_charge_tip', 'lpn_ff_menu_tip',
	'lpn_ff_required_node_tip', 'lpn_field_meter_total_tip', 'lpn_field_pump_speed_tip',
	'lpn_field_speed_pattern_tip', 'lpn_field_valve_setting_pressure_tip', 'lpn_find_filter_tip',
	'lpn_find_menu_tip', 'lpn_find_query_tip', 'lpn_freq_tip', 'lpn_labels_customer_width_tip',
	'lpn_labels_priority_node_tip', 'lpn_labels_suffix_gradient_tip', 'lpn_labels_use_units_tip',
	'lpn_library_curves_tip', 'lpn_library_fittings_tip', 'lpn_menu_project_tip',
	'lpn_node_customers_tip', 'lpn_pane_tab_tip', 'lpn_pane_toggle_tip', 'lpn_quality_tolerance_tip',
	'lpn_reports_full_tip', 'lpn_reports_status_tip', 'lpn_result_demand_tip', 'lpn_result_head_tip',
	'lpn_run_menu_tip', 'lpn_scncmp_menu_tip', 'lpn_search_tip', 'lpn_settings_auto_run_tip',
	'lpn_settings_show_arrows_tip', 'lpn_settings_symbol_cap_tip', 'lpn_tables_menu_tip',
	'lpn_tip_select', 'lpn_tool_add_meter_tip', 'lpn_tool_area_tip', 'lpn_tool_undo_tip',
	'lpn_tool_zoom_extent_tip', 'lpn_tool_zoom_window_tip', 'lpn_ts_tip',
	// the split and the new keys
	'lpn_cp_restrict_tip', 'lpn_cp_allow_tip', 'lpn_cp_characters_tip', 'lpn_choice_default',
	'lpn_pane_sort_desc'
];
TOUCHED.forEach((k) => {
	ok(k + ' is in English and supplied by the page',
		enKeys.has(k) && new RegExp("\\$ec_lang\\[['\"]" + k + "['\"]\\]").test(page));
});
{
	// The three drop tips became one: every group reads the one key, and nothing reads the two
	// that went.
	const body = js.slice(js.indexOf('function labelDropTip('), js.indexOf('function labelDropTip(') + 1200);
	ok('labelDropTip() answers every group with lpn_labels_priority_node_tip',
		/return pc\.lpn_labels_priority_node_tip/.test(body) && !/group === /.test(body.slice(0, body.indexOf('\n\t}'))));
}

console.log('\n--- 3. the custom-property character tip follows Allow/Restrict ---');
{
	const at = js.indexOf('function restrictTip(mode)');
	ok('restrictTip(mode) exists', at > 0);
	const fn = js.slice(at, at + 600);
	ok('...Restrict leads with lpn_cp_restrict_tip and Allow with lpn_cp_allow_tip',
		/mode === 'deny' \? \(pc\.lpn_cp_restrict_tip/.test(fn) && /pc\.lpn_cp_allow_tip/.test(fn));
	ok('...and both share lpn_cp_characters_tip', /pc\.lpn_cp_characters_tip/.test(fn));
	const sw = js.slice(at, at + 2400);
	ok('the mode change re-labels through setFieldLabel, so the `?` survives',
		/setFieldLabel\(lab, cap, restrictTip\(mode\)\)/.test(sw) && !/lab\.textContent = cap/.test(sw));
	ok('the character box opens with the tip of the stored mode',
		/textRow\('restrict', restrictCaption\(def\.restrictMode \|\| 'allow'\),\s*restrictTip\(def\.restrictMode \|\| 'allow'\)\)/.test(js));
	// Each tip is its own field's caption and a colon (section 8 of custom-property-harness.js).
	ok('the Restrict tip is the Restrict caption with a colon', val('lpn_cp_restrict_tip') === val('lpn_cp_restrict') + ':');
	ok('the Allow tip is the Allow caption with a colon', val('lpn_cp_allow_tip') === val('lpn_cp_restrict_allow') + ':');
}

console.log('\n--- 4. a blank that follows a default says Default ---');
{
	ok('lpn_choice_default reads Default', val('lpn_choice_default') === 'Default');
	ok('lpnBlankIsDefault() returns that key',
		/function lpnBlankIsDefault\(\) \{\s*return \(EngCalcs\.pageConfig \|\| \{\}\)\.lpn_choice_default \|\| 'Default';/.test(js));
	const sites = [
		['junction demand row', /libFillPatternOptions\(sel, acc\.getPattern\(\), lpnBlankIsDefault\(\)\)/],
		['customer demand pattern', /libFillPatternOptions\(patSel, c\.pattern \|\| '', lpnBlankIsDefault\(\)\)/],
		['pump price pattern', /pc\.lpn_energy_price_pattern_tip, lpnBlankIsDefault\(\)\)/],
		['pump efficiency-curve chooser', /pc\.lpn_pump_effic_curve_tip, lpnBlankIsDefault\(\)\)/],
		['pump price pattern column', /setProp\(l, 'energyPattern', v \|\| null\); \}, true, true\)/],
		['pump efficiency-curve column', /paneColCurveRef\('efficCurveId', 'effic', 'lpn_pump_effic_curve', true\)/]
	];
	sites.forEach((s) => { ok(s[0] + ' passes Default for its blank', s[1].test(js)); });
	// And the blanks that really are "none" stay so: the project's own Default demand pattern, a
	// reservoir's head pattern, a pump's speed pattern, a source pattern, the network price pattern.
	ok('the Settings default-pattern row still offers No pattern',
		/libFillPatternOptions\(sel, doc\.defaultPattern\);/.test(js));
	ok('...as does the network price pattern', /libFillPatternOptions\(pat, e\.globalPattern \|\| ''\);/.test(js));
	// Nothing may still hand the two deleted pattern tips to a label.
	ok('neither deleted pattern tip is read', !/pc\.lpn_field_(demand|meter)_pattern_tip/.test(js));
}

console.log('\n--- 5. Toms follow-up wording, 2026-10-04 ---');
{
	ok('customer tip opens "Specify the customer point, then its connection: a link or node."',
		val('lpn_tool_add_meter_tip').indexOf('Specify the customer point, then its connection: a link or node.') === 0);
	ok('zoom window tip opens "Specify corners or drag a rectangle."',
		val('lpn_tool_zoom_window_tip').indexOf('Specify corners or drag a rectangle.') === 0);
	ok('quality tolerance tip says concentration difference below which parcels are one',
		/^Concentration difference below which EPANET treats two adjoining parcels of water as one\./.test(val('lpn_quality_tolerance_tip')));
	ok('the specific gravity tip is gone but its Settings row still takes a label',
		val('lpn_settings_specific_gravity_tip') === null && /hydNumberRow\('specificGravity', 'lpn_settings_specific_gravity', 'Specific gravity',\s*'', 1\)/.test(js));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
