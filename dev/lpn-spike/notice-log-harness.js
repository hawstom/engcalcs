// A NOTICE THAT HAS EXPIRED IS STILL READABLE -- ROADMAP Task 704, rows 1 and 2 of Ida's ranking.
//
//   node dev/lpn-spike/notice-log-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-18, testing the lock work: *"The banner message about 'We asked
// your colleague to close the file' disappeared too fast and unrecoverable. 'Help! What did I
// miss!' We need a better messaging system."* And again on 2026-09-21: *"peripheral and
// pervasive."*
//
// setNotice() is one door with 83 call sites and an eight-second expiry, and a later message
// silently replaces an earlier one. (83 is re-derived from the file with comments stripped, not
// the 66 that was carried into this task and never re-checked.) The repair is not a longer timer -- it is a place the message
// WENT: a bounded in-memory log, and one icon in the map's bottom status strip that reads it back.
//
// SEVEN GROUPS, and the one that matters most is 4. The others describe a feature; 4 describes a
// RULING. Nothing new may be written to a visitor's device, because new storage makes a sentence in
// consent_body false and that is a banner rewrite, 26 retranslations and an EC_CONSENT_VERSION bump
// that re-asks everybody. A log that quietly grew a localStorage key would pass every other
// assertion in this file.
//
//   1. A NOTICE IS KEPT, and it survives its own eight-second expiry.
//   2. NEWEST FIRST, and a repeat MOVES to the top and re-stamps its time rather than adding a row
//      -- renderBanner() repaints on every tab switch, and an append-only log would bury the one
//      thing somebody missed under forty identical read-only banners.
//   3. THE RING IS BOUNDED, and the rows that fall off the end are the oldest ones.
//   4. NOTHING REACHES THE DEVICE. No storage key, and no stored value carrying a logged sentence.
//   5. THE BANNER LANDS IN THE SAME LOG, at the second of exactly two severities.
//   6. CANCEL LEAVES A RESIDUE. presentOpenChoice()'s Cancel branch used to leave nothing at all,
//      which is Ida's diagnosis of the exact dialog behind his complaint.
//   7. THE CONTROL AND THE DIALOG. One icon, with an accessible name, inside the strip that
//      already exists -- never a fifth bar of chrome, and never hidden at 640px.
//
// THE LIVE MUTATION at the end takes the one line out of setNotice() that does all of this, and
// group 1 must go red. A harness that passes because the page happens to be quiet is worth nothing.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\tsetNotice: function (t) { setNotice(t); },\n" +
	"\t\tnoticeLog: function () { return noticeLog.slice(); },\n" +
	"\t\tmaxRows: function () { return NOTICE_LOG_MAX; },\n" +
	"\t\topenMessageLog: openMessageLog,\n" +
	"\t\twireMessageLogButton: wireMessageLogButton,\n" +
	"\t\trenderBanner: renderBanner,\n" +
	"\t\tsetBannerWarn: function (w) { bannerWarn = w; bannerRO = null; },\n" +
	"\t\tsetBannerRO: function (r) { bannerRO = r; bannerWarn = null; },\n" +
	"\t\tnoteMapUnmeasurable: noteMapUnmeasurable,\n" +
	"\t\tpresentOpenChoice: presentOpenChoice,\n" +
	"\t\tnoticeText: function () { return document.getElementById('lpn_map_notice').textContent || ''; }\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ---------------------------------------------------------------------------
// The notice's own expiry timer, intercepted BY VALUE (8000 ms), exactly as
// engine-note-once-harness.js intercepts the engine note's two. Replacing
// setTimeout wholesale would stop the page dead -- it runs on real timers for
// the 300 ms solve debounce -- and intercepting by value is also what makes
// this file fail loudly if STATUS_NOTICE_MS ever moves, instead of passing by
// never firing.
// ---------------------------------------------------------------------------
const realSetTimeout = global.setTimeout, realClearTimeout = global.clearTimeout;
const NOTICE_MS = 8000;
let noticeTimers = [];
global.setTimeout = function (fn, ms) {
	if (ms === NOTICE_MS) { noticeTimers.push(fn); return -noticeTimers.length; }
	return realSetTimeout.apply(this, arguments);
};
global.clearTimeout = function (id) {
	if (typeof id === 'number' && id < 0) { noticeTimers[-id - 1] = null; return; }
	return realClearTimeout.apply(this, arguments);
};
function expireNotices() {
	const due = noticeTimers.splice(0, noticeTimers.length);
	due.forEach(f => { if (f) { f(); } });
}

// ---------------------------------------------------------------------------
// Every write to the visitor's device, recorded from before the page loads.
// ---------------------------------------------------------------------------
const writes = [];
{
	const store = global.localStorage, session = global.sessionStorage;
	[store, session].forEach(s => {
		if (!s || !s.setItem) { return; }
		const real = s.setItem.bind(s);
		s.setItem = function (k, v) { writes.push({ key: String(k), value: String(v) }); return real(k, v); };
	});
}

function load(mutate) {
	noticeTimers = [];
	const L = loadLoopedNetwork(INJECT, null, mutate);
	setUnitSet('us');
	return L;
}

const L = load();
const PC = global.EngCalcs.pageConfig;
function press(label) {
	const btn = byId.lpn_dialog_buttons.children.filter(c => c.textContent === label)[0];
	if (!btn) { throw new Error('no such button: ' + label); }
	(btn._listeners.click || []).forEach(fn => fn({}));
}
// The dialog body is a tree of stub elements; this is the whole of its text.
function dialogText(node) {
	node = node || byId.lpn_dialog_body;
	let out = node.textContent || '';
	(node.children || []).forEach(c => { out += ' ' + dialogText(c); });
	return out;
}
function dialogRows() {
	const rows = [];
	(function walk(n) {
		if (!n) { return; }
		if (String(n.className || '').indexOf('lpn-msglog-row') >= 0) { rows.push(n); }
		(n.children || []).forEach(walk);
	})(byId.lpn_dialog_body);
	return rows;
}

console.log('1. A notice is kept, and it survives its own expiry');
L.setNotice('Saved fixture-one.lwn.');
ok('the notice is on the map', L.noticeText() === 'Saved fixture-one.lwn.');
ok('and it is in the log', L.noticeLog().length === 1 && L.noticeLog()[0].text === 'Saved fixture-one.lwn.');
ok('at the ordinary severity', L.noticeLog()[0].severity === 'notice');
expireNotices();
ok('the map slot is now empty', L.noticeText() === '');
ok('and the log still holds it -- this is the whole feature',
	L.noticeLog().length === 1 && L.noticeLog()[0].text === 'Saved fixture-one.lwn.');
// A real message, read off the language file rather than pinned as a literal
// (dev/scripts/harness_wording_check.php): a reworded string must not turn this file red.
L.setNotice(PC.lpn_lock_ask_sent);
ok('a real page message lands too',
	L.noticeLog()[0].text === String(PC.lpn_lock_ask_sent).trim());
ok('and empty text logs nothing', (L.setNotice(''), L.noticeLog().length === 2));

console.log('2. Newest first, and a repeat moves rather than duplicates');
ok('the newest is first', L.noticeLog()[0].text === String(PC.lpn_lock_ask_sent).trim()
	&& L.noticeLog()[1].text === 'Saved fixture-one.lwn.');
const beforeRepeat = L.noticeLog()[1].at;
L.setNotice('Saved fixture-one.lwn.');
ok('a repeat adds no row', L.noticeLog().length === 2);
ok('a repeat moves to the top', L.noticeLog()[0].text === 'Saved fixture-one.lwn.');
ok('and re-stamps its time, so the age shown is when it was LAST on screen',
	L.noticeLog()[0].at >= beforeRepeat);

console.log('3. The ring is bounded, and it is the oldest rows that fall off');
const MAX = L.maxRows();
ok('the bound is a real number greater than a handful', MAX >= 10 && MAX <= 100, 'MAX=' + MAX);
for (let i = 0; i < MAX + 5; i++) { L.setNotice('ring message ' + i); }
ok('the log stops at the bound', L.noticeLog().length === MAX, 'len=' + L.noticeLog().length);
ok('the newest row is the last one written', L.noticeLog()[0].text === 'ring message ' + (MAX + 4));
ok('the oldest row is MAX back and no further',
	L.noticeLog()[MAX - 1].text === 'ring message ' + 5);
ok('and the messages from before the ring filled are gone',
	!L.noticeLog().some(r => r.text === 'Saved fixture-one.lwn.'));

console.log('4. Nothing reaches the visitor device');
ok('no storage key names the log', !writes.some(w => /msglog|notice.?log/i.test(w.key)),
	writes.filter(w => /msglog|notice.?log/i.test(w.key)).map(w => w.key).join(','));
ok('and no stored value carries a logged sentence',
	!writes.some(w => w.value.indexOf('ring message 7') >= 0));
ok('the log is reachable only through the page object, never through a global',
	typeof global.noticeLog === 'undefined' && !('noticeLog' in global.EngCalcs));

console.log('5. The banner lands in the same log, at the second of two severities');
L.setBannerWarn({ kind: 'lock', message: PC.lpn_lock_requested.replace('{name}', 'AB'), dismissable: true });
L.renderBanner();
const warnRow = L.noticeLog()[0];
ok('the banner message is logged', warnRow.text === PC.lpn_lock_requested.replace('{name}', 'AB'));
ok('as a warning', warnRow.severity === 'warning');
const lenAfterBanner = L.noticeLog().length;
L.renderBanner(); L.renderBanner(); L.renderBanner();
ok('and a repaint adds no rows -- renderBanner() runs on every tab switch',
	L.noticeLog().length === lenAfterBanner);
L.setBannerRO({ message: PC.lpn_lock_readonly_banner.replace('{name}', 'AB') });
L.renderBanner();
ok('the read-only banner is logged too', L.noticeLog()[0].text === PC.lpn_lock_readonly_banner.replace('{name}', 'AB'));
ok('and it is the same warning level, not a third one', L.noticeLog()[0].severity === 'warning');
ok('exactly two severities exist anywhere in the log',
	L.noticeLog().every(r => r.severity === 'notice' || r.severity === 'warning'));
// The map-unmeasurable message writes straight to the slot, bypassing setNotice(), and is re-shown
// whenever an ordinary notice has covered it. It is logged on the TRANSITION only.
// The stub's canvas box can leave this standing from an earlier applyMapHeight(); the assertion is
// about the TRANSITION, so the state is put back first.
// **COUNTED, NEVER MEASURED BY LENGTH.** The ring is saturated by group 3, so a new row pushes an
// old one off and the length never moves again -- an assertion on length would pass here for the
// wrong reason and fail on a shorter run. What is being claimed is that the message is AT THE TOP
// and appears ONCE.
function rowsSaying(t) { return L.noticeLog().filter(r => r.text === t).length; }
L.noteMapUnmeasurable(false);
L.noteMapUnmeasurable(true);
const unmeasurable = L.noticeLog()[0].text;
ok('an unmeasurable map is logged', unmeasurable === String(PC.lpn_map_unmeasurable).trim()
	&& L.noticeLog()[0].severity === 'warning', unmeasurable.slice(0, 60));
L.noteMapUnmeasurable(true); L.noteMapUnmeasurable(true);
ok('and a re-show of the same standing fact adds no row', rowsSaying(unmeasurable) === 1);
L.noteMapUnmeasurable(false);

console.log('6. Cancel leaves a residue');
L.presentOpenChoice({ project: { docId: 'doc-1' } }, null, 'Somebody else', { lockedBy: '' });
press(PC.lpn_cancel);
ok('backing out of the locked-file dialog says what did not happen',
	L.noticeText() === PC.lpn_lock_open_cancelled, L.noticeText());
ok('and it is in the log, so it is readable after it expires',
	L.noticeLog()[0].text === PC.lpn_lock_open_cancelled && rowsSaying(PC.lpn_lock_open_cancelled) === 1,
	L.noticeLog()[0].text.slice(0, 60));

console.log('7. One icon, and a dialog behind it');
L.wireMessageLogButton();
const btn = byId.lpn_msglog_btn;
ok('the control exists', !!btn);
ok('it has an accessible name, which an icon-only button does not get for free',
	btn.getAttribute('aria-label') === PC.lpn_msglog_name);
ok('it carries a tip', String(btn.title || '').indexOf(PC.lpn_msglog_tip) >= 0);
ok('and .ec-help, which is the only selector initTips() wires',
	String(btn.className || '').indexOf('ec-help') >= 0);
ok('it draws a real icon -- a misspelt name renders nothing at all',
	(btn.children || []).some(c => String(c.tagName || '').toLowerCase() === 'svg'));
(btn._listeners.click || []).forEach(fn => fn({}));
ok('pressing it opens the dialog', byId.lpn_dialog.style.display === 'block');
const rows = dialogRows();
ok('every kept message is a row', rows.length === L.noticeLog().length,
	rows.length + ' rows for ' + L.noticeLog().length + ' messages');
ok('newest first, matching the log', dialogText(rows[0]).indexOf(PC.lpn_lock_open_cancelled) >= 0);
ok('each row says how long ago it was shown',
	rows.every(r => (r.children || []).some(c => String(c.className || '').indexOf('lpn-msglog-when') >= 0
		&& String(c.textContent || '').length > 0)));
ok('the age reads through the shared "ago" wording, not a hand-built English phrase',
	/\bago\b/i.test(dialogText(rows[0])) === /\bago\b/i.test(PC.lpn_msglog_ago));
ok('the warning rows are marked, and only them',
	dialogRows().filter(r => String(r.className).indexOf('lpn-msglog-warn') >= 0).length
	=== L.noticeLog().filter(r => r.severity === 'warning').length);
ok('the dialog says the bound and that nothing is stored',
	dialogText().indexOf(String(PC.lpn_msglog_note).replace('{n}', L.maxRows())) >= 0);
press(PC.lpn_dialog_ok);
ok('and OK closes it', byId.lpn_dialog.style.display === 'none');

console.log('7b. The empty state says so rather than showing an empty box');
{
	const L2 = load();
	L2.wireMessageLogButton();
	L2.openMessageLog();
	ok('an untouched page says there is nothing yet',
		dialogText().indexOf(PC.lpn_msglog_empty) >= 0, dialogText().slice(0, 120));
	ok('and draws no rows', dialogRows().length === 0);
	press(PC.lpn_dialog_ok);
}

console.log('7c. It is a cell of the strip that already exists, not a fifth bar of chrome');
// Rendered through dev/scripts/render_page.php, which is the only correct way to render a page
// outside a web request -- an include from inside a function loses the bootstrap globals.
{
	const html = execFileSync('php', [path.join(ROOT, 'dev/scripts/render_page.php'), 'Looped-Network.php'],
		{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
	const atFooter = html.indexOf('id="lpn_map_footer"');
	const atBtn = html.indexOf('id="lpn_msglog_btn"');
	const atWrong = html.indexOf('id="lpn_wrong_btn"');
	const atCredit = html.indexOf('id="lpn_basemap_credit"');
	ok('the page renders the control', atBtn > 0);
	ok('inside the bottom status strip', atFooter > 0 && atBtn > atFooter && atBtn < atCredit);
	ok('before the grievance link, which is declared last in that strip', atBtn < atWrong);
	ok('and it is the ONLY new element -- no new bar, panel or row anywhere on the page',
		(html.match(/id="lpn_msglog/g) || []).length === 1);
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8');
	// The 640px blocks, taken by BRACE MATCHING rather than by splitting on the at-rule -- a split
	// hands back the whole rest of the stylesheet and would fail on any rule that happens to sit
	// below the last media query.
	let small = '';
	for (let at = css.indexOf('@media (max-width: 640px)'); at >= 0;
		at = css.indexOf('@media (max-width: 640px)', at + 1)) {
		let i = css.indexOf('{', at), depth = 0, end = i;
		for (; end < css.length; end++) {
			if (css[end] === '{') { depth++; }
			else if (css[end] === '}') { depth--; if (depth === 0) { end++; break; } }
		}
		small += css.slice(at, end) + '\n';
	}
	ok('the 640px block is found at all', small.length > 200, 'len=' + small.length);
	ok('the 640px rules neither hide the strip nor touch this control',
		small.indexOf('lpn_map_footer') < 0 && small.indexOf('lpn-msglog') < 0);
	ok('and the control is styled, so it is not an unstyled default button on the map',
		css.indexOf('.lpn-msglog-btn') >= 0);
}

console.log('8. THE LIVE MUTATION: take the log line out of setNotice() and group 1 must go red');
{
	const M = load(src => {
		const mark = "\t\tlogMessage(text, 'notice');\n";
		if (src.indexOf(mark) < 0) { throw new Error("setNotice()'s logMessage() call has moved"); }
		return src.replace(mark, '');
	});
	M.setNotice('a message nobody will be able to get back');
	ok('without it, an expired notice is unrecoverable -- which is the defect',
		M.noticeLog().length === 0, 'the mutant still logged ' + M.noticeLog().length);
}

global.setTimeout = realSetTimeout;
global.clearTimeout = realClearTimeout;
console.log(fails ? '\nFAILED: ' + fails : '\nAll assertions passed.');
process.exit(fails ? 1 : 0);
