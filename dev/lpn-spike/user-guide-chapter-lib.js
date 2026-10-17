// SHARED HELPER FOR THE GUIDE'S CHAPTER HARNESSES (Task 785): user-guide-scenarios-harness.js and
// user-guide-library-harness.js. Not a harness itself (run_harnesses.sh globs *harness*.js).
//
// A chapter is English prose written from the code, so each harness holds three things that cannot
// drift apart silently:
//   1. every UI name the chapter quotes is READ from the language file (never typed here) and must
//      appear in the chapter, and must be what the page actually shows;
//   2. every number and sentence the chapter states about behaviour is measured in the real page;
//   3. the chapter renders in the Guide, on an English page and on a page in another language, and a
//      search finds it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const U = require('./scenario-ui-helper.js');

const REPO = U.REPO;
const EN = fs.readFileSync(path.join(REPO, 'lib', 'lang.ec.en.php'), 'utf8');

let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined || extra === '' ? '' : '   ' + extra));
}

// The English value of a language key, escapes resolved, exactly as the page sends it.
function enString(key) {
	const m = EN.match(new RegExp("\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';"));
	if (!m) { throw new Error('no English for ' + key); }
	return m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}
// Markup out, entities out, white space single: what a reader of the entry sees.
const plain = (html) => String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Every key in `quotes` ({chapterKey: [langKey, ...]}) has its English value written in that chapter.
function checkQuotes(quotes) {
	Object.keys(quotes).forEach((chapterKey) => {
		const text = plain(enString(chapterKey));
		const missing = quotes[chapterKey].filter((k) => text.indexOf(plain(enString(k))) < 0);
		ok(chapterKey + ' quotes ' + quotes[chapterKey].length + ' interface names exactly as the language file has them',
			missing.length === 0, missing.map((k) => k + '=' + JSON.stringify(enString(k))).join('; '));
	});
}

// The Guide entry for one box: its element id, its terms, its tables, read after opening the User manual.
async function openGuide(a) {
	const manual = await a.lang('lpn_help_manual');
	await a.menuClick(manual, 'help');
	await a.settle(600);
}
const entry = (page, boxId) => page.evaluate((id) => {
	const e = document.getElementById('lpn_guide_b_' + id);
	if (!e) { return null; }
	return {
		title: (e.querySelector('h3') || {}).textContent || '',
		dts: Array.from(e.querySelectorAll('dt')).map((d) => d.textContent.trim()),
		text: e.textContent.replace(/\s+/g, ' ').trim(),
		tables: Array.from(e.querySelectorAll('table')).map((t) => Array.from(t.rows).map((r) => Array.from(r.cells).map((c) => c.textContent.trim()))),
		paras: e.querySelectorAll(':scope > p').length,
		shown: e.style.display !== 'none',
		group: (e.closest('.lpn-guide-group') || { getAttribute: () => null }).getAttribute('data-guide-key')
	};
}, boxId);

// Text of a Guide entry as a search would see it.
async function searchFinds(a, boxId, query) {
	await a.page.fill('#lpn_guide_search', query);
	await a.settle(250);
	const shown = await a.page.evaluate((id) => { const e = document.getElementById('lpn_guide_b_' + id); return !!e && e.style.display !== 'none'; }, boxId);
	await a.page.fill('#lpn_guide_search', '');
	await a.settle(150);
	return shown;
}

// Press a button of the page's own dialog by its visible label.
const dialogPress = (page, label) => page.evaluate((l) => {
	const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === l);
	if (!b) { return false; }
	b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
	return true;
}, label);

function finish(name) {
	console.log(fails ? `\n${name}: ${fails} FAILURE(S) of ${checks}` : `\n${name}: ALL PASS (${checks})`);
	return fails ? 1 : 0;
}

module.exports = { REPO, U, ok, enString, plain, checkQuotes, openGuide, entry, searchFinds, dialogPress, finish };
