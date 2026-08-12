// Guards the "Show page titles" toggle (ROADMAP Task 289) against the exact bug it shipped with.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
//
// THE BUG THIS EXISTS FOR. The inline block in Looped-Network.php hides three elements by id. It
// was placed ABOVE the <h2> it names, so on every load getElementById('ec-page-desc') returned null
// and the page description reappeared while the other two hid correctly. Tom found it by reloading
// the page. Nothing could have caught it: a null return from getElementById is indistinguishable
// from success, `check_all.sh` has no DOM test for this page, and the block is inline PHP so no JS
// harness saw it either.
//
// Three assertions, each aimed at one way this can silently break again:
//   1. Every id the script names exists in the page it runs on. (A renamed id in
//      HeadersFooters.lib.php would otherwise just stop hiding something.)
//   2. The script appears AFTER every element it names. This is the bug, stated directly.
//   3. The inline list and js/looped-network.js's list are the same. They are two copies of one
//      fact -- the inline one paints, the JS one re-applies on toggle -- and a element added to
//      one and not the other hides on load but not on toggle, or the reverse.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const PAGE = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
const HEADER = fs.readFileSync(path.join(ROOT, 'lib', 'HeadersFooters.lib.php'), 'utf8');
const LPNJS = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');

let failures = 0;
function check(ok, label, detail) {
	if (ok) { console.log('PASS  ' + label); return; }
	failures++;
	console.log('FAIL  ' + label + (detail ? '  ' + detail : ''));
}

// The inline block: find the id list it iterates.
const inlineMatch = /applyStoredTitleVisibility[\s\S]*?\[([^\]]*)\]\.forEach/.exec(PAGE);
check(!!inlineMatch, 'inline toggle block found in Looped-Network.php');
if (!inlineMatch) { process.exit(1); }

const idsFromList = (raw) => raw.split(',')
	.map(s => s.trim().replace(/^['"]|['"]$/g, ''))
	.filter(Boolean);

const inlineIds = idsFromList(inlineMatch[1]);
check(inlineIds.length >= 3, 'inline block names at least the three known elements',
	'got ' + JSON.stringify(inlineIds));

// 1. Every id exists, in this page or in the shared header that emits the h1/welcome.
inlineIds.forEach(id => {
	const marker = 'id="' + id + '"';
	check(PAGE.includes(marker) || HEADER.includes(marker),
		'element exists for id ' + id,
		'not found in Looped-Network.php or lib/HeadersFooters.lib.php');
});

// 2. THE BUG. The script must come after every element it hides that lives on this page.
//    Elements emitted by echoHeader() are always earlier, so only same-file ones can be wrong.
const scriptPos = PAGE.indexOf('applyStoredTitleVisibility');
inlineIds.forEach(id => {
	const elPos = PAGE.indexOf('id="' + id + '"');
	if (elPos === -1) return;                    // emitted by the shared header, always earlier
	check(elPos < scriptPos,
		'element ' + id + ' is parsed before the script that hides it',
		'element at ' + elPos + ', script at ' + scriptPos + ' -- getElementById will return null');
});

// 3. The two copies of the list agree.
const jsMatch = /function applyPageTitles[\s\S]*?\[([^\]]*)\]\.forEach/.exec(LPNJS);
check(!!jsMatch, 'applyPageTitles found in js/looped-network.js');
if (jsMatch) {
	const jsIds = idsFromList(jsMatch[1]);
	const same = inlineIds.length === jsIds.length && inlineIds.every(id => jsIds.includes(id));
	check(same, 'inline list and applyPageTitles list are identical',
		'inline ' + JSON.stringify(inlineIds) + ' vs js ' + JSON.stringify(jsIds));
}

console.log('');
console.log(failures === 0 ? 'page-titles: all checks passed' : 'page-titles: ' + failures + ' FAILED');
process.exit(failures === 0 ? 0 : 1);
