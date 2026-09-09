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

// ================================================================================================
// 4. "HIDE THESE TITLES" -- THE LINK, AND THE WAY BACK (Tom's 2026-09-08 worklist)
// ================================================================================================
//
// Tom, 2026-09-08: *"Can the LPN main page titles have a link to 'Hide these titles'? And maybe
// that link opens up settings to the Map and page heading with the Show page titles label
// temporarily highlighted and the box newly unchecked?"*
//
// **THE SECOND HALF IS WHAT MAKES THE FIRST HALF SAFE.** A one-way switch on the headings teaches
// a reader that the headings can go and nothing at all about getting them back -- and the switch
// itself goes away with them, because the link lives INSIDE what it hides. So the link throwing
// the switch and the box opening at the row that holds it are one gesture, and each assertion
// below is one way that pairing can silently come apart.
const LANG = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
{
	const anchor = /<a id="lpn_hide_titles"[^>]*>/.exec(PAGE);
	check(!!anchor, 'the page emits the Hide these titles link');
	// INSIDE the thing it hides. A link left outside would still be on screen with the headings
	// gone -- a control offering to do what has already been done, and the only one on the page
	// that cannot be pressed to undo itself.
	const descOpen = PAGE.indexOf('<h2 id="ec-page-desc"');
	const descClose = PAGE.indexOf('</h2>', descOpen);
	const linkAt = PAGE.indexOf('<a id="lpn_hide_titles"');
	check(descOpen >= 0 && linkAt > descOpen && linkAt < descClose,
		'...inside one of the elements it hides, so it goes away with them',
		'h2 ' + descOpen + '-' + descClose + ', link at ' + linkAt);
	// NO title= on it. js/Calculators.lib.js wires tap tooltips on .ec-help[title] alone, so a tip
	// parked on a bare <a> just navigates on a touch -- link_title_check.php's whole subject.
	check(!!anchor && !/\stitle=/.test(anchor[0]), 'the link carries no tip on its own title=',
		anchor && anchor[0]);
	check(/\$ec_lang\['lpn_hide_titles'\]/.test(PAGE), '...and its words come from a language key');
	check(/\$ec_lang\['lpn_hide_titles'\]\s*=/.test(LANG), '...which lib/lang.ec.en.php defines');

	// WIRED, and wired from init() -- a listener nobody attaches is a link that navigates to "#".
	check(/wireHideTitlesLink\(\);/.test(LPNJS), 'wireHideTitlesLink() is called');
	const wire = /function wireHideTitlesLink\(\)[\s\S]*?\n\t}/.exec(LPNJS);
	check(!!wire && /getElementById\('lpn_hide_titles'\)/.test(wire[0]),
		'...and it reaches the link by the id the page emits');
	check(!!wire && /e\.preventDefault\(\)/.test(wire[0]),
		'...and swallows the href="#" so the page does not jump to the top');

	// THE PAIRING, in order: the switch is thrown BEFORE the box is built, or the checkbox the
	// reader is being shown would still be ticked -- the box is rebuilt from pageTitlesShown() on
	// every open.
	const act = /function hideTitlesAndShowTheSwitch\(\)[\s\S]*?\n\t}/.exec(LPNJS);
	check(!!act, 'the link has one action function, so both halves cannot drift apart');
	if (act) {
		const off = act[0].indexOf('setPageTitlesShown(false)');
		const open = act[0].indexOf("openSettingsBox('page')");
		const flash = act[0].indexOf('flashPageTitlesRow()');
		check(off >= 0 && open > off,
			'...it unchecks the box BEFORE opening it, or the reader is shown a ticked switch',
			'off at ' + off + ', open at ' + open);
		check(flash > open, '...and highlights the row after the box has been rebuilt',
			'open at ' + open + ', flash at ' + flash);
	}
	// The section it opens at has to be a real id in this page, or scrollSetboxTo() scrolls to
	// nothing and the reader gets the box with no idea which row was meant.
	const target = /page: '([a-z_]+)'/.exec(LPNJS);
	check(!!target && PAGE.includes('id="' + target[1] + '"'),
		'the section it opens at is an id this page really has', target && target[1]);

	// TRANSIENT, both ways. A sticky highlight is state nobody asked for, still shining next week.
	const flashFn = /function flashPageTitlesRow\(\)[\s\S]*?\n\t}/.exec(LPNJS);
	const clearFn = /function clearPageTitlesFlash\(\)[\s\S]*?\n\t}/.exec(LPNJS);
	check(!!flashFn && /setTimeout\(clearPageTitlesFlash/.test(flashFn[0]),
		'the highlight comes off on a timer');
	check(!!wire && /clearPageTitlesFlash/.test(wire[0]),
		'...and on the first press inside the box, whichever comes first');
	check(!!clearFn && /classList\.remove\('lpn-set-row-flash'\)/.test(clearFn[0]),
		'...and clearing it really removes the class');
	const CSS = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');
	check(/\.lpn-set-row-flash\s*\{/.test(CSS), '...for which the stylesheet has a rule');
	check(/\.lpn-hide-titles\s*\{/.test(CSS), 'and the link has one of its own');
}

console.log('');
console.log(failures === 0 ? 'page-titles: all checks passed' : 'page-titles: ' + failures + ' FAILED');
process.exit(failures === 0 ? 0 : 1);
