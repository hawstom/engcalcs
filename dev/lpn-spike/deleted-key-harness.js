// A KEY TOM RULED OUT IS GONE FROM ALL 27 LANGUAGES. Run with:
//   node dev/lpn-spike/deleted-key-harness.js
//
// Tom, 2026-09-08, reading dev/new-english-keys.md: *"Time menu tip: Delete."*
//
// `lpn_time_menu_tip` named the bottom pane's Time TAB. The tab is gone (js/lpn-time.js records the
// five strings that left with it), the key was still supplied to pageConfig on every page load, and
// nothing on the page read it -- so it was a sentence translated into 26 languages, shipped to
// every visitor's browser, and rendered nowhere.
//
// **WHY A HARNESS RATHER THAN A ONE-OFF SWEEP.** A deletion done by hand across 27 language files
// fails silently in both directions: a file missed leaves an orphan that a payload will pick up and
// a translator will be paid to maintain, and a pageConfig line missed makes the page emit
// `$ec_lang['...']` for a key that no longer exists, which renders as the empty string. Neither has
// a symptom. This asserts BOTH halves, and it is written so the next such ruling is one line.
//
// **WHAT IT DELIBERATELY DOES NOT ASSERT** is that a key is dead. Whether an unreferenced key is
// debt or lost content is Tom's call and nothing else's (CLAUDE.md); key_hygiene_check.php prints
// candidates and never fails. This list is what he has already ruled on.
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

// One line per ruling: the key, and the words that decided it.
const DELETED = [
	{ key: 'lpn_time_menu_tip', ruling: 'Tom, 2026-09-08: "Time menu tip: Delete."' }
];

const langs = fs.readdirSync(path.join(ROOT, 'lib'))
	.filter(function (f) { return /^lang\.ec\.[a-z][a-z]\.php$/.test(f); });
console.log('\n--- ' + langs.length + ' language files, ' + DELETED.length + ' ruled-out key(s) ---');
ok('all 27 language files are on the list, so "gone everywhere" means everywhere',
	langs.length === 27, String(langs.length));

DELETED.forEach(function (d) {
	console.log('\n--- ' + d.key + ' --- ' + d.ruling);
	const still = langs.filter(function (f) {
		return fs.readFileSync(path.join(ROOT, 'lib', f), 'utf8')
			.indexOf("$ec_lang['" + d.key + "']") >= 0;
	});
	ok('no language file still assigns it', still.length === 0, still.join(', '));

	// The page's own supply. A pageConfig line for a key that does not exist emits nothing at all,
	// which is the quiet half of this failure.
	const page = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
	ok('the page does not supply it to pageConfig', page.indexOf(d.key) < 0);

	// The drift manifest. A manifest entry for a key that is gone makes detect_english_drift.php
	// report a key nobody can look at -- which is the exact failure rename_lang_key.php was written
	// to stop happening one file at a time.
	const manifest = fs.readFileSync(path.join(ROOT, 'dev/scripts/english_string_hashes.json'), 'utf8');
	ok('the English drift manifest has forgotten it', manifest.indexOf(d.key) < 0);

	// And no shipped script reads it. A comment naming it as history is legitimate and is the
	// reason comments are blanked first.
	const jsDir = path.join(ROOT, 'js');
	const readers = fs.readdirSync(jsDir).filter(function (f) { return /\.js$/.test(f); })
		.filter(function (f) {
			const code = fs.readFileSync(path.join(jsDir, f), 'utf8')
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.split('\n').map(function (l) {
					const i = l.indexOf('//'); return i < 0 ? l : l.slice(0, i);
				}).join('\n');
			return code.indexOf(d.key) >= 0;
		});
	ok('no shipped script reads it outside a comment', readers.length === 0, readers.join(', '));
});

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
