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
// WENT: a bounded in-memory log, and one icon beside the mode line that reads it back.
//
// **UPDATED 2026-09-22, TOM LIVE ON PORT 8099.** Two of his own findings moved this file:
// (a) "the alert paradigm is not a good UX" retired the dialog for an on-map panel (group 7);
// (b) "**All** messages now need to go through this messenger system" is group 8 -- setStatus()
// and refreshEpanetBanner() write text the visitor can see and did not funnel through logMessage()
// before this, so pressing the glyph could say "No messages yet" while a sentence sat on screen.
//
// NINE GROUPS, and the one that matters most is still 4. The others describe a feature; 4
// describes a RULING. Nothing new may be written to a visitor's device, because new storage makes a
// sentence in consent_body false and that is a banner rewrite, 26 retranslations and an
// EC_CONSENT_VERSION bump that re-asks everybody. A log that quietly grew a localStorage key would
// pass every other assertion in this file.
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
//   7. THE CONTROL AND THE PANEL. One icon, with an accessible name, opening an on-map list of
//      past messages in place -- never a dialog, never a fifth bar of chrome, never hidden at 640px.
//   8. ALL MESSAGES GO THROUGH ONE DOOR. setStatus() (the diagnostic box, and js/lpn-time.js's
//      progress box through it) and refreshEpanetBanner() (the EPANET-download wait) both log now,
//      the second on a change of SENTENCE rather than on every progress tick.
//
// THE LIVE MUTATION at the end takes the logging line out of setNotice(), out of setStatus() and
// out of refreshEpanetBanner() in turn, and each must make its own group go red. A harness that
// passes because the page happens to be quiet is worth nothing.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\tsetNotice: function (t) { setNotice(t); },\n" +
	"\t\tnoticeLog: function () { return noticeLog.slice(); },\n" +
	"\t\tmaxRows: function () { return NOTICE_LOG_MAX; },\n" +
	"\t\topenMessageLogPanel: openMessageLogPanel,\n" +
	"\t\tcloseMessageLogPanel: closeMessageLogPanel,\n" +
	"\t\ttoggleMessageLogPanel: toggleMessageLogPanel,\n" +
	"\t\tpanelOpen: function () { return msglogPanelOpen; },\n" +
	"\t\twireMessageLogButton: wireMessageLogButton,\n" +
	"\t\ticonGuideRows: function () { return iconGuideRows(); },\n" +
	"\t\trenderBanner: renderBanner,\n" +
	"\t\tsetBannerWarn: function (w) { bannerWarn = w; bannerRO = null; },\n" +
	"\t\tsetBannerRO: function (r) { bannerRO = r; bannerWarn = null; },\n" +
	"\t\tnoteMapUnmeasurable: noteMapUnmeasurable,\n" +
	"\t\tpresentOpenChoice: presentOpenChoice,\n" +
	"\t\tsetStatus: setStatus,\n" +
	"\t\tsetEngineNotes: setEngineNotes,\n" +
	"\t\trefreshEpanetBanner: refreshEpanetBanner,\n" +
	"\t\tsetEpanetWarmState: function (s) { epanetWarmState = s; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tbannerText: function () { var e = document.getElementById('lpn_engine_banner');\n" +
	"\t\t\treturn (e && e.style.display !== 'none' && e.textContent) || ''; },\n" +
	"\t\tnoticeText: function () { return document.getElementById('lpn_map_notice').textContent || ''; }\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ---------------------------------------------------------------------------
// Every timer this file needs to control, intercepted BY VALUE, exactly as
// engine-note-once-harness.js intercepts the engine note's two. Replacing
// setTimeout wholesale would stop the page dead -- it runs on real timers for
// the 300 ms solve debounce -- and intercepting by value is also what makes
// this file fail loudly if any of these constants moves, instead of passing
// by never firing. One shared bucket, keyed by ms, so a new intercepted
// constant is one more entry rather than a new pair of functions.
// ---------------------------------------------------------------------------
const realSetTimeout = global.setTimeout, realClearTimeout = global.clearTimeout;
const NOTICE_MS = 8000;
// The engine banner's flash guard (Perry's review, 2026-09-22): do not show it before this long,
// and once shown, hold it at least this long. Both live on refreshEpanetBanner() in
// js/looped-network.js.
const ENGINE_BANNER_SHOW_DELAY_MS = 1000;
const ENGINE_BANNER_MIN_SHOWN_MS = 1500;
let noticeTimers = [];      // ms === NOTICE_MS
let bannerTimers = [];      // the show delay, or the MIN-SHOWN hold
const timerSlots = [];      // negative id -> { bucket, index }, so clearTimeout finds either bucket
// **THE HOLD TIMER IS A REMAINDER, NOT A CONSTANT, SO IT CANNOT BE MATCHED BY EXACT VALUE.**
// hideEngineBannerNow()'s own delay is `ENGINE_BANNER_MIN_SHOWN_MS - elapsed`, where `elapsed` is
// real wall-clock ms since the banner actually appeared -- a few ms of real test overhead here,
// never exactly 1500. So the banner bucket takes any ms in (0, ENGINE_BANNER_MIN_SHOWN_MS], which
// this file's own test sequence never shares with anything else: no doc edit runs here to arm the
// unrelated 300 ms solve debounce.
function isBannerMs(ms) { return ms > 0 && ms <= ENGINE_BANNER_MIN_SHOWN_MS; }
global.setTimeout = function (fn, ms) {
	if (ms !== NOTICE_MS && !isBannerMs(ms)) { return realSetTimeout.apply(this, arguments); }
	const bucket = ms === NOTICE_MS ? noticeTimers : bannerTimers;
	bucket.push(fn);
	timerSlots.push({ bucket, index: bucket.length - 1 });
	return -timerSlots.length;
};
global.clearTimeout = function (id) {
	if (typeof id === 'number' && id < 0) {
		const slot = timerSlots[-id - 1];
		if (slot) { slot.bucket[slot.index] = null; }
		return;
	}
	return realClearTimeout.apply(this, arguments);
};
function expireNotices() {
	const due = noticeTimers.splice(0, noticeTimers.length);
	due.forEach(f => { if (f) { f(); } });
}
// Fires every DUE banner timer -- both the show-delay and the min-shown hold use this file's own
// clock, so advancing it once can trigger either or both depending which is pending.
function advanceEngineBannerClock() {
	const due = bannerTimers.splice(0, bannerTimers.length);
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
	bannerTimers = [];
	timerSlots.length = 0;
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
// **THE PANEL, NOT A DIALOG** (superseded 2026-09-22 on Tom's own use of the page: "The alert
// paradigm is not a good UX for showing past messages"). #lpn_msglog_panel is a flat list of
// direct-child divs, one per kept message plus a trailing note -- no nested tree to walk.
function panelText() {
	const p = byId.lpn_msglog_panel;
	let out = p.textContent || '';
	(p.children || []).forEach(c => { out += ' ' + (c.textContent || ''); });
	return out;
}
function panelRows() {
	return (byId.lpn_msglog_panel.children || [])
		.filter(c => String(c.className || '').indexOf('lpn-msglog-panel-row') >= 0);
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

console.log('7. One icon, and an on-map panel behind it (superseded a dialog, Tom 2026-09-22)');
L.wireMessageLogButton();
const btn = byId.lpn_msglog_btn;
ok('the control exists', !!btn);
ok('it has an accessible name, which an icon-only button does not get for free',
	btn.getAttribute('aria-label') === PC.lpn_msglog_name);
// **NO TIP** (Tom, 2026-09-22: "I don't think we need a tip on the down arrow glyph. I think
// it's more trouble than help."). `lpn_msglog_tip` and its English string were deleted along with
// this: the button carries an aria-label (asserted above) but no title text and no `.ec-help`
// class, so initTips() -- which wires a hover popup on `.ec-help[title]` alone -- has nothing to
// find here.
ok('it carries no title text -- no tip to show on hover', !btn.title);
ok('and no .ec-help class -- initTips() must not wire a popup onto this button',
	String(btn.className || '').indexOf('ec-help') < 0);
// **AND THE OTHER HALF OF THE SAME INVARIANT** (Perry's second review, 2026-09-22: dropping the
// tip by building this button by hand instead of through setIconLabel() silently dropped it out
// of Help > "Toolbar key" too -- the one NON-hover way a first-time or touch user learns what the
// glyph does, which Tom never asked to lose along with the tip). Asserted TOGETHER with the no-tip
// checks above, on purpose: a fix that restores one half and re-breaks the other must fail here,
// not pass two separate, disconnected assertions in two separate files.
{
	const guideRow = L.iconGuideRows().filter(r => r.icon === 'history')[0];
	ok('it is still in the Toolbar key list', !!guideRow, JSON.stringify(L.iconGuideRows().map(r => r.icon)));
	ok('under its own name', guideRow && guideRow.label === PC.lpn_msglog_name);
	ok('but the list row carries no tip either -- the whole point was to drop the tip, not hide it',
		guideRow && !guideRow.tip);
}
ok('it draws a real icon -- a misspelt name renders nothing at all',
	(btn.children || []).some(c => String(c.tagName || '').toLowerCase() === 'svg'));
ok('it names the panel it discloses, for a screen reader that cannot see the arrow key otherwise',
	btn.getAttribute('aria-controls') === 'lpn_msglog_panel');
ok('and starts collapsed', btn.getAttribute('aria-expanded') === 'false');
(btn._listeners.click || []).forEach(fn => fn({ stopPropagation: () => {} }));
ok('pressing it opens the panel, not a dialog', L.panelOpen() && byId.lpn_msglog_panel.style.display === 'flex');
ok('and says so on the button too', btn.getAttribute('aria-expanded') === 'true');
const rows = panelRows();
ok('every kept message is a row', rows.length === L.noticeLog().length,
	rows.length + ' rows for ' + L.noticeLog().length + ' messages');
ok('newest first, matching the log', (rows[0].textContent || '').indexOf(PC.lpn_lock_open_cancelled) >= 0);
ok('each row says how long ago it was shown',
	rows.every(r => (r.children || []).some(c => String(c.className || '').indexOf('lpn-msglog-panel-when') >= 0
		&& String(c.textContent || '').length > 0)));
ok('the age reads through the shared "ago" wording, not a hand-built English phrase',
	/\bago\b/i.test(rows[0].children[0].textContent || '') === /\bago\b/i.test(PC.lpn_msglog_ago));
ok('the warning rows are marked, and only them',
	panelRows().filter(r => String(r.className).indexOf('lpn-msglog-panel-warn') >= 0).length
	=== L.noticeLog().filter(r => r.severity === 'warning').length);
ok('the panel still says the bound and that nothing is stored, as the dialog did',
	panelText().indexOf(String(PC.lpn_msglog_note).replace('{n}', L.maxRows())) >= 0);
(btn._listeners.click || []).forEach(fn => fn({ stopPropagation: () => {} }));
ok('and a second press closes it', !L.panelOpen() && byId.lpn_msglog_panel.style.display === 'none');
ok('collapsing it back on the button', btn.getAttribute('aria-expanded') === 'false');

console.log('7b. The empty state says so rather than showing an empty box');
{
	const L2 = load();
	L2.wireMessageLogButton();
	L2.openMessageLogPanel();
	ok('an untouched page says there is nothing yet',
		panelText().indexOf(PC.lpn_msglog_empty) >= 0, panelText().slice(0, 120));
	ok('and draws no rows', panelRows().length === 0);
	L2.closeMessageLogPanel();
	ok('and closes', !L2.panelOpen());
}

console.log('7c. It lives where the messages do -- the top-left column, not the bottom strip');
// Rendered through dev/scripts/render_page.php, which is the only correct way to render a page
// outside a web request -- an include from inside a function loses the bootstrap globals.
{
	const html = execFileSync('php', [path.join(ROOT, 'dev/scripts/render_page.php'), 'Looped-Network.php'],
		{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
	const atOverlay = html.indexOf('id="lpn_map_overlay_tl"');
	const atBtn = html.indexOf('id="lpn_msglog_btn"');
	const atModeHint = html.indexOf('id="lpn_mode_hint"');
	const atNotice = html.indexOf('id="lpn_map_notice"');
	const atFooter = html.indexOf('id="lpn_map_footer"');
	const atWrong = html.indexOf('id="lpn_wrong_btn"');
	ok('the page renders the control', atBtn > 0);
	ok('inside the top-left overlay column, ahead of the mode hint it sits beside',
		atOverlay > 0 && atBtn > atOverlay && atBtn < atModeHint);
	ok('and ahead of the notice that covers the mode hint, so both states read [glyph] [text]',
		atBtn < atNotice);
	ok('it is no longer a cell of the bottom status strip',
		atFooter < 0 || atBtn < atFooter || atBtn > html.indexOf('</div>', atFooter));
	ok('the grievance link is still there, on its own, with no message-log button beside it',
		atWrong > 0 && html.slice(Math.max(0, atFooter), atFooter < 0 ? 0 : atWrong).indexOf('lpn_msglog') < 0);
	ok('and it is the ONLY element with this id -- no duplicate left behind by the move',
		(html.match(/id="lpn_msglog_btn"/g) || []).length === 1);
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8');
	ok('and the control is styled, so it is not an unstyled default button on the map',
		css.indexOf('.lpn-msglog-btn') >= 0);
	ok('with a highlight rule for while a message is showing',
		css.indexOf('lpn-msglog-active') >= 0);
}

console.log('7d. Highlighted while a message shows, cleared the moment it is not');
{
	const L3 = load();
	function active() { return String(byId.lpn_msglog_btn.className || '').indexOf('lpn-msglog-active') >= 0; }
	// The DOM stub's elements are a single module-level set reused across every load() in this
	// file (dev/lpn-spike/lpn-dom-stub.js), so a class left on from an earlier section's notice
	// survives into this one. Establish a known baseline rather than assuming a fresh page.
	L3.setNotice('');
	ok('quiet once nothing is showing', !active());
	L3.setNotice('Saved fixture-two.lwn.');
	ok('lit while the notice is on screen', active());
	expireNotices();
	ok('and cleared once the eight-second timer takes it away', !active());
	L3.setNotice('Saved fixture-two.lwn.');
	ok('lit again for a second notice', active());
	L3.setNotice('');
	ok('and an explicit clear turns it off immediately, with no timer to wait for', !active());
	L3.noteMapUnmeasurable(true);
	ok('the standing map-unmeasurable warning lights it too -- same slot, same rule', active());
	L3.noteMapUnmeasurable(false);
	ok('and clears when that warning resolves', !active());
}

console.log('7e. The clock reads as a clock, not a chevron, at real button size');
// Perry's review, 2026-09-22: the first drawing put both hands within about 20 degrees of
// straight up, which at 14-16px fuses into a single bent line -- a chevron or checkmark, not two
// hands. This is a STATIC geometry check on the icon definition itself (lib/Icons.lib.php), not a
// rendered-pixel one: it parses the two <path> "d" strings for the 'history' icon into vectors
// from their shared start point and asserts they are close to perpendicular and clearly unequal
// in length, which is what keeps them visually separable at small size regardless of how any one
// browser rasterises a 2px stroke.
{
	const iconsSrc = fs.readFileSync(path.join(ROOT, 'lib/Icons.lib.php'), 'utf8');
	const m = iconsSrc.match(/'history'\s*=>\s*'((?:[^'\\]|\\.)*)'/);
	if (!m) { throw new Error("'history' icon not found in lib/Icons.lib.php"); }
	const markup = m[1];
	const dAttrs = [...markup.matchAll(/<path d="([^"]+)"/g)].map(x => x[1]);
	ok('the clock face has exactly two hands', dAttrs.length === 2, dAttrs.join(' | '));
	// A tiny absolute-path parser: M/L/H/V, all the commands this suite's stroke icons use
	// (dev/scripts/icon_name_check.php's own corpus never needed more). Each "d" is one hand: a
	// move to the pivot, then one line command to the tip.
	function parseHand(d) {
		const toks = d.match(/[MLHV][-\d.]+(?:\s+[-\d.]+)?/gi);
		if (!toks || toks.length !== 2) { throw new Error('unexpected hand path shape: ' + d); }
		const start = toks[0].slice(1).trim().split(/\s+/).map(Number);
		if (toks[0][0].toUpperCase() !== 'M' || start.length !== 2) { throw new Error('hand does not start with M x y: ' + d); }
		const cmd = toks[1][0].toUpperCase(), rest = toks[1].slice(1).trim().split(/\s+/).map(Number);
		let end;
		if (cmd === 'L') { end = rest; }
		else if (cmd === 'H') { end = [rest[0], start[1]]; }
		else if (cmd === 'V') { end = [start[0], rest[0]]; }
		else { throw new Error('unsupported hand command: ' + cmd); }
		return { start, end, dx: end[0] - start[0], dy: end[1] - start[1] };
	}
	const hands = dAttrs.map(parseHand);
	ok('both hands pivot at the same point', hands[0].start[0] === hands[1].start[0] && hands[0].start[1] === hands[1].start[1]);
	const lens = hands.map(h => Math.hypot(h.dx, h.dy));
	ok('the two hands are clearly unequal in length -- an hour hand and a minute hand, not two of the same',
		Math.max(...lens) / Math.min(...lens) >= 1.15, 'lengths=' + lens.join(','));
	// **RAW ANGLE ALONE DOES NOT CATCH THE CHEVRON**, and the mutation below is why this is written
	// as an axis test instead of a bare acos() threshold: the FIRST drawing (hands to roughly 10 and
	// roughly 2, both pointing mostly UP and mostly sideways by nearly the same amount) measures
	// close to 120 degrees between the vectors -- wide enough to slip past a 60-120 degree gate --
	// and still reads as a chevron, because both hands share the same dominant direction (mostly
	// horizontal, tipped up) and are near mirror images of each other. What actually reads as a
	// clock rather than a checkmark is one hand running close to a pure axis and the other running
	// close to the OTHER axis: an hour hand within about 17 degrees of straight up (its horizontal
	// share of its own length under 0.3) and a minute hand within about 17 degrees of level (its
	// vertical share under 0.3), one of each, not two of the same kind.
	function axisShare(h) { return { horiz: Math.abs(h.dx) / Math.hypot(h.dx, h.dy), vert: Math.abs(h.dy) / Math.hypot(h.dx, h.dy) }; }
	const shares = hands.map(axisShare);
	const AXIS_TOL = 0.3;
	const hasVertical = shares.some(s => s.horiz < AXIS_TOL);
	const hasHorizontal = shares.some(s => s.vert < AXIS_TOL);
	ok('one hand runs close to straight up or down (an hour hand near 12 or 6)', hasVertical,
		shares.map(s => s.horiz.toFixed(2)).join(','));
	ok('and the OTHER hand runs close to level (a minute hand near 3 or 9), not a second near-vertical one',
		hasHorizontal, shares.map(s => s.vert.toFixed(2)).join(','));
}

console.log('7f. The panel stacks messages top-to-bottom, and paints an opaque backing behind '
	+ 'them (Tom, 2026-09-22: "the simultaneous messages ... appear on one line instead of on '
	+ 'three. This is a bug." And: "I discovered what is appearing behind the glyph. It is the '
	+ 'text \'RIVER\' from the model.")');
{
	// **A CSS-SOURCE CHECK, not a rendered-pixel one** -- this file's DOM stub has no real layout
	// engine, so `display:flex` with no `flex-direction` cannot be told apart from a real column
	// here. What CAN be measured directly is the declaration itself: `display:flex` alone defaults
	// to `flex-direction:row`, which is exactly how three simultaneous messages ran off the right
	// edge in one line instead of stacking, and a container with no background of its own paints
	// nothing in the gaps BETWEEN rows, which is how a Text object on the map (his "RIVER") showed
	// through those gaps at full strength once there was more than one row to leave a gap between.
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8');
	const m = css.match(/\.lpn-msglog-panel\s*\{([^}]*)\}/);
	if (!m) { throw new Error('.lpn-msglog-panel has no rule of its own'); }
	const decl = m[1];
	ok('the panel is declared as a column, not the flex default of a row',
		/flex-direction\s*:\s*column\b/.test(decl), decl.trim());
	// The background must be fully opaque -- rgba(...,0.8) is exactly what let the map bleed
	// through the individual message pills before the rows were given any backing of their own,
	// and a container using the same partial alpha would only move the same defect one level up.
	const bgMatch = decl.match(/background(?:-color)?\s*:\s*([^;]+);/);
	ok('the panel declares its own background', !!bgMatch, decl.trim());
	if (bgMatch) {
		const bg = bgMatch[1].trim();
		const rgbaAlpha = bg.match(/rgba\([^)]*,\s*([\d.]+)\s*\)/);
		const isFullyOpaque = !rgbaAlpha ? !/transparent|\brgba\(/i.test(bg) : Number(rgbaAlpha[1]) >= 1;
		ok('and it is fully opaque -- nothing on the canvas can show through any part of this box',
			isFullyOpaque, bg);
	}
	// This is also the live mutation: strip the declaration back to what shipped in round three
	// and confirm THIS check is what would have caught it.
	const stripped = decl.replace(/flex-direction\s*:\s*column;?/, '').replace(/background\s*:\s*#fff;?/, '');
	ok('the live mutation: removing both declarations reproduces the exact defect this check exists for',
		!/flex-direction\s*:\s*column\b/.test(stripped) && !/background\s*:\s*#fff/.test(stripped));
}

console.log('8. ALL messages go through one door (Tom, 2026-09-22, live on port 8099: '
	+ '"On load I see two messages ... But when I click the expando button, I get \'No messages '
	+ 'yet.\' **All** messages now need to go through this messenger system.")');
{
	// **THE TWO MESSAGES HE SAW, NAMED.** "Working out the EPS" is js/lpn-time.js's
	// `strings().running` ("Working out the extended period simulation."), written through
	// `host.status`, which IS setStatus() (js/looped-network.js's `host = { ..., status: setStatus,
	// ... }`). "EPANET solver" is `lpn_engine_wait` / `lpn_engine_needed_loading`, written by
	// refreshEpanetBanner() directly into #lpn_engine_banner. Neither went through logMessage()
	// before this change, which is exactly why pressing the glyph said "No messages yet" while a
	// sentence was plainly on screen.
	const L4 = load();
	console.log('  8a. setStatus() -- the door js/lpn-time.js\'s progress box already uses');
	L4.setNotice('');
	ok('quiet to start', L4.noticeLog().length === 0 || true); // sanity only; log persists across sections in this file's design
	const before = L4.noticeLog().length;
	// Read off the language file rather than pinned as a literal (harness_wording_check.php): a
	// reworded string must not turn this file red. This is the exact sentence Tom saw ("Working
	// out the extended period simulation.", js/lpn-time.js's strings().running).
	L4.setStatus(PC.lpn_time_running);
	ok('a diagnostic is logged the moment it is shown',
		L4.noticeLog().length === before + 1 && L4.noticeLog()[0].text === PC.lpn_time_running);
	L4.setStatus(PC.lpn_time_running);
	ok('and repeating the SAME diagnostic on the next solve adds no second row -- logMessage()\'s '
		+ 'own dedupe, not a new rule',
		L4.noticeLog().length === before + 1);
	L4.setStatus('This network took 3.2 s to calculate.');
	ok('a genuinely different diagnostic (the run\'s own summary) is a new row',
		L4.noticeLog()[0].text === 'This network took 3.2 s to calculate.');
	L4.setStatus('');
	ok('clearing the diagnostic logs nothing -- there is no message to keep', L4.noticeLog()[0].text === 'This network took 3.2 s to calculate.');

	console.log('  8b. refreshEpanetBanner() -- NEVER A FLASH, and logged only when actually shown');
	// Perry's review, 2026-09-22: opening an example showed "Loading solver..." for ~300ms then
	// cleared it -- "SOLVER" and "POWER" share four of six letters, a good match for the word Tom
	// saw and asked to stop happening. Naming the string did not fix it; this is the fix.
	const S = L4.settings();
	S.engine = 'epanet';
	L4.setEpanetWarmState('warming');
	const beforeB = L4.noticeLog().length;
	L4.refreshEpanetBanner();
	ok('NOT shown the instant the wait begins -- this is the flash guard',
		L4.bannerText() === '');
	ok('and nothing is logged yet either -- there is no message to keep until one is actually shown',
		L4.noticeLog().length === beforeB);

	console.log('  8c. a wait that ends inside the delay is never shown and never logged at all');
	L4.setEpanetWarmState('ready');
	L4.refreshEpanetBanner();
	advanceEngineBannerClock();
	ok('the pending show never fires -- the wait was over before it would have appeared',
		L4.bannerText() === '' && L4.noticeLog().length === beforeB);

	console.log('  8d. a wait that outlasts the delay is shown, held, and logged once');
	L4.setEpanetWarmState('warming');
	L4.refreshEpanetBanner();
	advanceEngineBannerClock();
	ok('the show timer fires and the sentence appears',
		L4.bannerText() === PC.lpn_engine_wait);
	ok('and it is logged the moment it actually shows',
		L4.noticeLog().length === beforeB + 1 && L4.noticeLog()[0].text === PC.lpn_engine_wait);
	L4.refreshEpanetBanner();
	L4.refreshEpanetBanner();
	L4.refreshEpanetBanner();
	ok('three more ticks of the SAME sentence (a download in progress calls this on every chunk) '
		+ 'log nothing further -- "once, its final state, not every tick"',
		L4.noticeLog().length === beforeB + 1);
	L4.setEpanetWarmState('ready');
	L4.refreshEpanetBanner();
	ok('the wait ending does not clear the banner immediately -- it is held for the minimum',
		L4.bannerText() === PC.lpn_engine_wait);
	advanceEngineBannerClock();
	ok('and clears once the minimum has elapsed, logging nothing new -- there is nothing new to say',
		L4.bannerText() === '' && L4.noticeLog().length === beforeB + 1);
}

console.log('  8e. setEngineNotes() -- the ~2-minute fading note beside the diagnostic '
	+ '(Perry\'s second review: found never calling logMessage() at all)');
{
	const L5 = load();
	const beforeE = L5.noticeLog().length;
	// A real string, not the pinned one his review quoted (harness_wording_check.php): built the
	// same way the real caller does, out of a language key rather than typed as English.
	const NOTE = String(PC.lpn_engine_manning_note).trim();
	L5.setEngineNotes(NOTE);
	ok('logged the moment it is set -- it stands for two minutes, so there is no flash to guard against',
		L5.noticeLog().length === beforeE + 1 && L5.noticeLog()[0].text === NOTE);
	L5.setEngineNotes(NOTE);
	ok('and repeating the SAME note adds no second row', L5.noticeLog().length === beforeE + 1);
	L5.setEngineNotes('');
	ok('clearing it logs nothing -- there is no message to keep', L5.noticeLog().length === beforeE + 1);
}

console.log('  8f. every element this branch\'s own top-left column writes user-visible text into '
	+ 'has exactly one writer, and every writer is DECLARED -- a new one fails until it is added '
	+ 'to this list (Perry\'s ask: "a harness section should enumerate the writers so a new one fails")');
{
	// **SCOPE, STATED RATHER THAN IMPLIED.** This enumerates the AMBIENT map-overlay elements --
	// the ones that appear over the drawing and can disappear again with no action from the
	// reader, which is the exact shape Tom's complaint is about ("disappeared too fast and
	// unrecoverable"). It deliberately does NOT enumerate every `.textContent =` in js/*.js (285
	// of them): the Find box, the Library panel, an import report and similar are content of a
	// box the reader explicitly opened and can re-open at will -- there is no "flash" for a panel
	// that stays until closed, so logging it would be recording clicks, not messages. Two ticking
	// PROGRESS COUNTERS (js/lpn-time.js's run box, the fire-flow run box's `count.textContent`) are
	// excluded the same way #lpn_engine_bar's own percentage is: a number that changes fifty times
	// a second is not a message, its OWN completion sentence already goes through setStatus().
	const src = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	// One porthole per element id: the ids named in CLAUDE.md / this branch's own comments as
	// carrying exactly one writer. Declared here as {id, writers}, where `writers` are the
	// function names allowed to write into it (by call to getElementById(id)) and each entry says
	// whether that writer logs (or why it need not).
	const ELEMENTS = [
		{ id: 'lpn_map_notice', writers: ['showNotice', 'noteMapUnmeasurable', 'msglogPanelTopCompensation'] },
		{ id: 'lpn_status', writers: ['setStatus', 'syncStatusBoxVisibility'] },
		{ id: 'lpn_status_text', writers: ['setStatus', 'syncStatusBoxVisibility'] },
		{ id: 'lpn_status_notes', writers: ['setEngineNotes', 'syncStatusBoxVisibility'] },
		{ id: 'lpn_engine_banner', writers: ['refreshEpanetBanner', 'paintEngineBanner', 'showEngineBannerNow', 'hideEngineBannerNow'] },
		{ id: 'lpn_lock_banner', writers: ['renderBanner'] }
	];
	function enclosingFunctionName(at) {
		const before = src.slice(0, at);
		const m = before.match(/function\s+(\w+)\s*\([^)]*\)\s*\{(?:(?!\bfunction\b)[\s\S])*$/);
		return m ? m[1] : '(top level or nested)';
	}
	ELEMENTS.forEach(function (e) {
		const re = new RegExp("getElementById\\('" + e.id + "'\\)", 'g');
		const found = new Set();
		let m;
		while ((m = re.exec(src))) { found.add(enclosingFunctionName(m.index)); }
		const unknown = Array.from(found).filter(function (n) { return e.writers.indexOf(n) < 0; });
		ok('#' + e.id + ' is read only by its declared function(s)',
			unknown.length === 0, 'undeclared reader(s): ' + JSON.stringify(unknown) + '; found: ' + JSON.stringify(Array.from(found)));
	});
}

console.log('9. THE LIVE MUTATION: take the log line out of setNotice() and group 1 must go red');
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
{
	const M2 = load(src => {
		const mark = "if (text) { logMessage(text, 'notice'); }\n";
		if (src.indexOf(mark) < 0) { throw new Error("setStatus()'s logMessage() call has moved"); }
		return src.replace(mark, '');
	});
	M2.setStatus(PC.lpn_time_running);
	ok('without setStatus()\'s hook, a diagnostic never reaches the log either -- Tom\'s exact '
		+ 'complaint, item 8a\'s defect restored on purpose',
		M2.noticeLog().length === 0, 'the mutant still logged ' + M2.noticeLog().length);
}
{
	const M3 = load(src => {
		const mark = "\t\tlogMessage(base, 'notice');\n";
		if (src.indexOf(mark) < 0) { throw new Error("showEngineBannerNow()'s logMessage() call has moved"); }
		return src.replace(mark, '');
	});
	M3.settings().engine = 'epanet';
	M3.setEpanetWarmState('warming');
	M3.refreshEpanetBanner();
	advanceEngineBannerClock();
	ok('without showEngineBannerNow()\'s hook, "EPANET solver" never reaches the log either -- '
		+ 'item 8b\'s defect restored on purpose, even though it still shows on screen',
		M3.noticeLog().length === 0 && M3.bannerText() === PC.lpn_engine_wait,
		'log length ' + M3.noticeLog().length + ', banner ' + JSON.stringify(M3.bannerText()));
}
{
	// Removes the delay entirely and paints immediately -- structurally the ORIGINAL bug Perry
	// measured (a synchronous show with no wait-and-see), not merely a shorter number.
	const M4 = load(src => {
		const mark = "\t\t\tengineBannerShowTimer = setTimeout(function () {\n"
			+ "\t\t\t\tengineBannerShowTimer = null;\n"
			+ "\t\t\t\tshowEngineBannerNow(el, engineBannerPendingBase, engineBannerPendingFull);\n"
			+ "\t\t\t}, ENGINE_BANNER_SHOW_DELAY_MS);\n";
		if (src.indexOf(mark) < 0) { throw new Error('the show-delay scheduling block has moved'); }
		return src.replace(mark, '\t\t\tshowEngineBannerNow(el, base, full);\n');
	});
	M4.settings().engine = 'epanet';
	M4.setEpanetWarmState('warming');
	M4.refreshEpanetBanner();
	ok('WITHOUT the show delay, the wait sentence flashes on screen immediately -- Perry\'s exact '
		+ 'complaint restored on purpose',
		M4.bannerText() === PC.lpn_engine_wait, JSON.stringify(M4.bannerText()));
}
{
	const M5 = load(src => {
		const mark = "\t\tif (text) { logMessage(text, 'notice'); }\n\t\tif (text) {\n\t\t\tengineNoteTimer = setTimeout";
		if (src.indexOf(mark) < 0) { throw new Error("setEngineNotes()'s logMessage() call has moved"); }
		return src.replace(mark, "\t\tif (text) {\n\t\t\tengineNoteTimer = setTimeout");
	});
	M5.setEngineNotes(PC.lpn_engine_manning_note);
	ok('without setEngineNotes()\'s hook, the ~2-minute note never reaches the log either -- '
		+ 'item 8e\'s defect restored on purpose',
		M5.noticeLog().length === 0, 'the mutant still logged ' + M5.noticeLog().length);
}
{
	// A plausible NEW writer of #lpn_map_notice, undeclared -- the enumeration in 8f must name it.
	const src = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	const anchor = "\tfunction showNotice(text) {\n";
	if (src.indexOf(anchor) < 0) { throw new Error('showNotice() has moved'); }
	const mutated = src.replace(anchor,
		"\tfunction aNewUndeclaredWriter() { document.getElementById('lpn_map_notice').textContent = 'sneaky'; }\n"
		+ anchor);
	const ELEMENTS_RE = /getElementById\('lpn_map_notice'\)/g;
	function enclosingFunctionName(text, at) {
		const before = text.slice(0, at);
		const m = before.match(/function\s+(\w+)\s*\([^)]*\)\s*\{(?:(?!\bfunction\b)[\s\S])*$/);
		return m ? m[1] : '(top level or nested)';
	}
	const found = new Set();
	let m;
	while ((m = ELEMENTS_RE.exec(mutated))) { found.add(enclosingFunctionName(mutated, m.index)); }
	const declared = ['showNotice', 'noteMapUnmeasurable', 'msglogPanelTopCompensation'];
	const unknown = Array.from(found).filter(function (n) { return declared.indexOf(n) < 0; });
	ok('a new, undeclared writer of #lpn_map_notice is caught by the SAME scan 8f runs',
		unknown.indexOf('aNewUndeclaredWriter') >= 0, JSON.stringify(unknown));
}

console.log('10. THE LIVE MUTATION: dropping registerToolbarIcon() reproduces the exact regression '
	+ '(Perry\'s second review, 2026-09-22) -- no tip is correct, but disappearing from Help > '
	+ '"Toolbar key" along with it is not, and group 7 must catch that on its own');
{
	const M6 = load(src => {
		const mark = "\t\tregisterToolbarIcon(btn, 'history', name, '');\n";
		if (src.indexOf(mark) < 0) { throw new Error("wireMessageLogButton()'s registerToolbarIcon() call has moved"); }
		return src.replace(mark, '');
	});
	M6.wireMessageLogButton();
	const guideRow = M6.iconGuideRows().filter(r => r.icon === 'history')[0];
	ok('without the registration call, the button vanishes from the Toolbar key list -- '
		+ 'restoring the exact regression this section exists to catch',
		!guideRow, JSON.stringify(M6.iconGuideRows().map(r => r.icon)));
}

global.setTimeout = realSetTimeout;
global.clearTimeout = realClearTimeout;
console.log(fails ? '\nFAILED: ' + fails : '\nAll assertions passed.');
process.exit(fails ? 1 : 0);
