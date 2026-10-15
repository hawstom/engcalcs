// COUNT SENTENCES READ CORRECTLY AT 1 AND AT 2 WITHOUT PLURAL LOGIC. Run with:
//   node dev/lpn-spike/count-wording-harness.js
//
// The rule (dev/language-strings.md): a number the page substitutes into a sentence stands after a
// colon or inside parentheses ("Cells pasted: {n}", "Add rows ({extra})"), so no noun has to agree
// with it. Each key below is rendered with every count placeholder set to 1 and then to 2, straight
// from lib/lang.ec.en.php, and must have no digit directly before a lowercase plural noun
// ("1 cells") or singular verb mismatch marker, and each count placeholder must follow ": " or "(".
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');

// key -> the placeholders that carry a count (others, such as {unit} or {ids}, are text)
const COUNTS = {
	lpn_prefix_applied: ['n', 'skipped'],
	lpn_status_reinterpreted: ['n'],
	lpn_status_converted: ['n'],
	lpn_replace_preview: ['n'],
	lpn_replace_done: ['n'],
	lpn_confirm_apply_prefix: ['n'],
	lpn_scenario_delete_confirm: ['n'],
	lpn_delete_drops_overrides: ['n'],
	lpn_dxf_note_shortened: ['n'],
	lpn_dxf_note_categories: ['n'],
	lpn_library_pattern_span: ['n'],
	lpn_terrain_confirm_default_2: ['n']
};

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

function value(key) {
	const m = new RegExp("^\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';", 'm').exec(en);
	return m ? m[1].replace(/\\'/g, "'") : null;
}

Object.keys(COUNTS).forEach((key) => {
	const v = value(key);
	if (v === null) { ok(key + ' exists', false); return; }
	[1, 2].forEach((n) => {
		let out = v;
		COUNTS[key].forEach((ph) => { out = out.split('{' + ph + '}').join(String(n)); });
		const bad = /\b[0-9]+ (?:of them |of the )?[a-z]+s\b(?! of \d)/.exec(out.replace(/\b[0-9]+ of [0-9]+\b/g, ''));
		ok(key + ' at ' + n + ' has no number before a plural noun', !bad, JSON.stringify(out.slice(0, 110)));
	});
	const stray = COUNTS[key].filter((ph) => {
		const i = v.indexOf('{' + ph + '}'), before = v.slice(0, i);
		return i < 0 || !(/(?:: |\(| of |, )$/.test(before));
	});
	ok(key + ' puts each count after a colon or inside parentheses', stray.length === 0, stray.join(' '));
});

console.log(fails ? fails + ' FAILED' : 'all passed');
process.exit(fails ? 1 : 0);
