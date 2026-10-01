// A MERGED KEY IS GONE EVERYWHERE, AND ITS SURVIVOR SAYS IT EVERYWHERE. Run with:
//   node dev/lpn-spike/key-merge-harness.js
//
// Task 699. Tom, 2026-09-30, on dev/key-duplication-audit-2026-09-30.md: *"Merge the listed groups
// and do the Find redesign."* Each retired key below held the same whole label, in the same role,
// as its survivor, so every language was translating it twice and the two could drift. A merge is
// a repoint plus a deletion, and both halves fail silently: a language file missed leaves an orphan
// a sprint will pay to maintain, and a reader missed renders an empty string. This asserts both.
//
// **THE FIND REDESIGN** is the last four rows: the result row used to read a second, capitalized
// copy of each connectivity condition. It now reads the pull-down's own key and raises the first
// letter in code (findConnLabel()), which this harness drives with a real page build.
//
// The groups the audit proposed and this task WITHDREW (a column abbreviation, a gender agreement,
// a different concept under the same English word) are not listed, because they are not merged.
// The report on the Task 699 branch names each one and its evidence.
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

// retired -> survivor
const MERGED = {
	bpn_show_p: 'lpn_result_pressure', lpn_units_pressure: 'lpn_result_pressure',
	lpn_color_mode_pressure: 'lpn_result_pressure', lpn_ff_limit_pressure: 'lpn_result_pressure',
	lpn_new_crs: 'lpn_new_coordsys', lpn_crsbox_title: 'lpn_new_coordsys', lpn_crs_list: 'lpn_new_coordsys',
	lpn_units_velocity: 'lpn_result_velocity', lpn_ff_limit_velocity: 'lpn_result_velocity',
	ip_flow: 'lpn_result_flow', bpn_show_q: 'lpn_result_flow', lpn_units_flow: 'lpn_result_flow',
	bpn_show_elevation: 'lpn_field_elev',
	bpn_show_length: 'lpn_field_length',
	lpn_examples_close: 'lpn_close', lpn_file_close: 'lpn_close',
	lpn_color_example_status: 'lpn_result_status',
	lpn_status_col_time: 'lpn_full_col_time',
	lpn_cp_remove: 'lpn_fitting_remove',
	lpn_cp_restrict_deny: 'lpn_cp_restrict',
	lpn_library_rule_missing: 'lpn_library_control_missing',
	lpn_georef_cancel: 'lpn_cancel',
	lpn_menu_settings: 'lpn_tool_settings',
	lpn_quality_age: 'lpn_result_water_age',
	bpn_show_diameter: 'lpn_field_diameter',
	lpn_settings_demand_multiplier: 'bpn_demand_mult',
	lpn_scncmp_col_minpressure: 'bpn_p_min',
	// The Find redesign: one key per condition, capitalized in code.
	lpn_find_conn_unlinked: 'lpn_find_op_conn_unlinked',
	lpn_find_conn_noopen: 'lpn_find_op_conn_noopen',
	lpn_find_conn_nolinksource: 'lpn_find_op_conn_nolinksource',
	lpn_find_conn_noopensource: 'lpn_find_op_conn_noopensource'
};
const RETIRED = Object.keys(MERGED);
const SURVIVORS = Array.from(new Set(RETIRED.map(function (k) { return MERGED[k]; })));

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function stripComments(code) {
	return code.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(function (l) {
		const i = l.indexOf('//'); return i < 0 ? l : l.slice(0, i);
	}).join('\n');
}
function has(text, key) {
	return new RegExp('(^|[^A-Za-z0-9_])' + key + '(?![A-Za-z0-9_])').test(text);
}

// ---- 1. The 27 language files ------------------------------------------------------------------
const langs = fs.readdirSync(path.join(ROOT, 'lib'))
	.filter(function (f) { return /^lang\.ec\.[a-z][a-z]\.php$/.test(f); });
console.log('\n--- 1. ' + langs.length + ' language files, ' + RETIRED.length + ' retired, '
	+ SURVIVORS.length + ' survivors ---');
ok('all 27 language files are read, so "gone everywhere" means everywhere', langs.length === 27,
	String(langs.length));
const langText = {};
langs.forEach(function (f) { langText[f] = read('lib/' + f); });
RETIRED.forEach(function (k) {
	const still = langs.filter(function (f) { return langText[f].indexOf("$ec_lang['" + k + "']") >= 0; });
	ok(k + ' is assigned in no language file', still.length === 0, still.join(', '));
});
SURVIVORS.forEach(function (k) {
	const missing = langs.filter(function (f) { return langText[f].indexOf("$ec_lang['" + k + "']=") < 0; });
	ok(k + ' (survivor) is assigned in all 27', missing.length === 0, missing.join(', '));
});

// ---- 2. No page, script or bridge still reads a retired key -----------------------------------
console.log('\n--- 2. readers ---');
const pages = fs.readdirSync(ROOT).filter(function (f) { return /\.php$/.test(f); });
const libs = fs.readdirSync(path.join(ROOT, 'lib'))
	.filter(function (f) { return /\.php$/.test(f) && !/^lang\.ec\./.test(f); }).map(function (f) { return 'lib/' + f; });
const phpFiles = pages.concat(libs);
const phpText = phpFiles.map(read).join('\n');
// Several retired names are ALSO element ids (id="bpn_show_p", id="lpn_georef_cancel") and stay so:
// an id is not a key. A script may name one of those as a string, and only those.
const domIds = new Set();
phpText.replace(/\bid="([A-Za-z0-9_]+)"/g, function (m, id) { domIds.add(id); return m; });
const jsDir = path.join(ROOT, 'js');
const jsFiles = fs.readdirSync(jsDir).filter(function (f) { return /\.js$/.test(f); });
const jsCode = {};
jsFiles.forEach(function (f) { jsCode[f] = stripComments(fs.readFileSync(path.join(jsDir, f), 'utf8')); });
RETIRED.forEach(function (k) {
	const phpReaders = phpFiles.filter(function (f) {
		const t = read(f);
		return t.indexOf("$ec_lang['" + k + "']") >= 0 || new RegExp('^\\s*' + k + ':\\s*<\\?=', 'm').test(t);
	});
	ok(k + ': no PHP page reads it or hands it to pageConfig', phpReaders.length === 0, phpReaders.join(', '));
	const jsReaders = jsFiles.filter(function (f) {
		const c = jsCode[f];
		if (new RegExp('\\.' + k + '(?![A-Za-z0-9_])').test(c)) { return true; }
		if (new RegExp('\\[\\s*[\'"]' + k + '[\'"]\\s*\\]').test(c)) { return true; }
		return !domIds.has(k) && new RegExp('[\'"]' + k + '[\'"]').test(c);
	});
	ok(k + ': no shipped script reads it outside a comment', jsReaders.length === 0, jsReaders.join(', '));
});

// ---- 3. The records that name keys have forgotten the retired ones ------------------------------
console.log('\n--- 3. manifests ---');
const manifest = JSON.parse(read('dev/scripts/english_string_hashes.json'));
const exempt = JSON.parse(read('dev/scripts/translation_exempt_keys.json')).exempt;
const concepts = JSON.parse(read('dev/scripts/key_concepts.json')).keys;
const rulings = JSON.parse(read('dev/english-key-rulings.json')).rulings;
RETIRED.forEach(function (k) {
	ok(k + ': gone from the drift manifest, the exempt list, the concept list and the rulings',
		!(k in manifest.hashes) && !(k in (manifest.shapes || {})) && !(k in exempt) && !(k in concepts)
		&& !(k in rulings));
});
ok('the drift manifest count matches its hashes', manifest.count === Object.keys(manifest.hashes).length,
	manifest.count + ' vs ' + Object.keys(manifest.hashes).length);

// ---- 4. The Find panel still prints the capitalized form, from the one key ----------------------
console.log('\n--- 4. the Find redesign, on a real page build ---');
const { loadLoopedNetwork } = require('./lpn-dom-stub.js');
const L = loadLoopedNetwork(
	"\t\tconnLabel: function (st) { return findConnLabel(st); },\n" +
	"\t\tconnOpLabels: function () { return findConnOpDefs().map(function (d) { return d[1]; }); },\n");
const PC = global.EngCalcs.pageConfig;
const STATES = ['conn-unlinked', 'conn-noopen', 'conn-nolinksource', 'conn-noopensource'];
const OPKEYS = ['lpn_find_op_conn_unlinked', 'lpn_find_op_conn_noopen', 'lpn_find_op_conn_nolinksource',
	'lpn_find_op_conn_noopensource'];
ok('the pull-down offers the four op keys, lowercase as written',
	JSON.stringify(L.connOpLabels()) === JSON.stringify(OPKEYS.map(function (k) { return PC[k]; })),
	JSON.stringify(L.connOpLabels()));
// What each result row printed before the redesign was the op key's words with a capital first
// letter (the retired keys were exactly that in English). Asserted against the page's own strings,
// never an English literal, so a rewording keeps the test.
STATES.forEach(function (st, i) {
	const want = PC[OPKEYS[i]].charAt(0).toUpperCase() + PC[OPKEYS[i]].slice(1);
	ok('a ' + st + ' result row reads the op key with its first letter raised', L.connLabel(st) === want,
		L.connLabel(st));
	ok('...which is not the lowercase pull-down form', L.connLabel(st) !== PC[OPKEYS[i]]);
});
ok('a node that is fine prints nothing', L.connLabel('ok') === '');
// Raising, never lowering: a translation that already opens with a capital keeps it, and one that
// opens in lowercase is raised -- the German and Ukrainian shapes, which differ in their first word.
const saved = PC.lpn_find_op_conn_unlinked;
PC.lpn_find_op_conn_unlinked = 'ohne Verbindungen am Knoten';
ok('a lowercase translation is raised', L.connLabel('conn-unlinked') === 'Ohne Verbindungen am Knoten',
	L.connLabel('conn-unlinked'));
PC.lpn_find_op_conn_unlinked = 'Knoten ohne Verbindungen';
ok('a capital already there is kept', L.connLabel('conn-unlinked') === 'Knoten ohne Verbindungen');
PC.lpn_find_op_conn_unlinked = 'без з\'єднань у вузлі';
ok('Cyrillic is raised too', L.connLabel('conn-unlinked') === 'Без з\'єднань у вузлі', L.connLabel('conn-unlinked'));
PC.lpn_find_op_conn_unlinked = '节点无连接线';
ok('an uncased script is left exactly as written', L.connLabel('conn-unlinked') === '节点无连接线');
PC.lpn_find_op_conn_unlinked = saved;

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
