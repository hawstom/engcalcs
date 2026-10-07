// THE GUIDE'S FIND AND REPLACE CHAPTER, ITS ORDER, AND Ctrl+K (Tom's browser pass, 2026-10-07).
//   node dev/lpn-spike/user-guide-find-harness.js
// (it takes the browser lock itself; never wrap it in that lock).
//
// Real Chromium, clicking and typing in the real controls:
//   1. "Using the guide" is the first chapter, in the text and in the Contents rail.
//   2. Ctrl+K puts the current selection in the guide's search field: text selected on the page,
//      and text selected inside a text box. With nothing selected the field opens empty.
//   3. Every query in the chapter's worked examples (read out of lpn_guide_find_examples_def, so a
//      reworded example cannot escape this check) is typed into the Find box's Query field on Net3
//      and returns exactly the assets the chapter names, in the order it names them where it says so.
//   4. The chapter's Replace examples: on Net1, four diameters changed and one Undo restores them;
//      on Net3, Pipe 247 closed through Replace, the connectivity query then lists the four
//      junctions the chapter names, and Undo reopens the pipe.
//   5. A choice typed with its displayed word ('Closed') finds the closed pipe, not the open ones.
//   6. The chapter is rendered in the Guide (its terms and its queries) and a search finds it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDEFIND_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-find-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const EN = fs.readFileSync(path.join(REPO, 'lib', 'lang.ec.en.php'), 'utf8');
function enString(key) {
	const m = EN.match(new RegExp("\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';"));
	if (!m) { throw new Error('no English for ' + key); }
	return m[1].replace(/\\'/g, "'");
}
// The queries of the worked-example table: the <code> that opens each row.
function exampleQueries() {
	const out = [], re = /<tr><td><code>([^<]+)<\/code><\/td><td>(.*?)<\/td><\/tr>/g;
	let m;
	const html = enString('lpn_guide_find_examples_def');
	while ((m = re.exec(html))) { out.push({ q: m[1], text: m[2] }); }
	return out;
}
// What each worked query returns on Net3, measured, ROW BY ROW in the chapter's table (the queries
// themselves are read from the language file, never written here). `ordered` where the chapter
// states the order. A row added to the chapter without a line here fails, so every example stays
// measured; a reworded query is run as reworded and must still return these assets.
const ROWS = [
	{ ids: ['Junction 60', 'Pipe 60'] },
	{ ids: ['Junction 10', 'Junction 40', 'Junction 50', 'Junction 20', 'Junction 153'], ordered: true },
	{ ids: ['Pipe 60', 'Pipe 329', 'Pipe 125', 'Pipe 123', 'Pipe 149'], ordered: true },
	{ ids: ['Junction 10', 'Junction 20', 'Junction 40', 'Junction 50', 'Pipe 60', 'Pipe 125', 'Pipe 329'] },
	{ ids: ['Junction 10', 'Junction 20', 'Junction 40', 'Junction 50'], inner: [] },
	{ ids: ['Pipe 330'] },
	{ ids: [] }
];
// Every <code> in a key, in order: the queries a chapter paragraph quotes.
function codesIn(key) {
	const out = [], re = /<code>([^<]+)<\/code>/g;
	let m;
	const html = enString(key);
	while ((m = re.exec(html))) { out.push(m[1]); }
	return out;
}

async function boot(Session, browser, tag, example) {
	const a = await Session.open(browser, 'gfind-' + tag);
	await a.goto('Looped-Network.php');
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang(example));
	await a.settle(800);
	return a;
}
async function openFind(a) {
	if (await a.page.evaluate(() => !!document.querySelector('#lpn_find_popup .lpn-find-query') &&
		document.getElementById('lpn_find_popup').getClientRects().length > 0)) { return; }
	await a.menuClick(await a.lang('lpn_find_menu'), 'edit');
	await a.settle(300);
}
// Type a query in the Query field and press Enter: the list of result rows, as the reader sees them.
async function runQuery(a, q) {
	await a.page.fill('#lpn_find_popup .lpn-find-query', q);
	await a.page.press('#lpn_find_popup .lpn-find-query', 'Enter');
	await a.settle(250);
	return a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_find_results .lpn-find-row'))
		.map(r => r.textContent.replace(/\s+/g, ' ').trim()));
}
// "Pipe 60 9.3315" -> "Pipe 60": the kind and the ID, without the value.
const idOf = (row) => row.split(' ').slice(0, 2).join(' ');
const sameSet = (a, b) => a.length === b.length && a.slice().sort().join('|') === b.slice().sort().join('|');

// A labelled control in the Change what was found part of the box, by its label's text.
async function replaceControl(a, labelKey, tag) {
	const label = await a.lang(labelKey);
	return a.page.evaluateHandle(([l, t]) => {
		const labs = Array.from(document.querySelectorAll('#lpn_find_popup label'));
		const lab = labs.filter(x => x.textContent.trim().indexOf(l) === 0 && x.querySelector(t)).pop();
		return lab ? lab.querySelector(t) : null;
	}, [label, tag]);
}
async function pressButton(a, key) {
	const t = await a.lang(key);
	await a.page.evaluate((txt) => {
		const b = Array.from(document.querySelectorAll('#lpn_find_popup button')).filter(x => x.textContent.trim() === txt && x.getClientRects().length).pop();
		b.click();
	}, t);
	await a.settle(300);
}
async function undo(a) {
	await a.page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
	await a.page.mouse.move(700, 600);
	await a.page.keyboard.press('Control+z');
	await a.settle(500);
}

async function orderAndKeys(browser, Session) {
	const a = await boot(Session, browser, 'order', 'lpn_ex_net3_title');
	const page = a.page;
	console.log('\n1. Using the guide is the first chapter');
	const first = await page.evaluate(() => {
		const s = document.querySelector('#lpn_guide_content .lpn-guide-section');
		return s ? s.getAttribute('data-guide-section') : null;
	});
	ok('the first section of the guide text is Using the guide', first === 'using', first);

	console.log('\n2. Ctrl+K puts the current selection in the search field');
	// Text selected on the page: the Settings box title.
	await openFind(a);
	const word = await page.evaluate(() => document.querySelector('#lpn_find_popup .lpn-setbox-title').textContent.replace(/\s+/g, ' ').trim());
	await page.evaluate(() => {
		const t = document.querySelector('#lpn_find_popup .lpn-setbox-title') || document.querySelector('#lpn_find_popup');
		if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); }
		const r = document.createRange(); r.selectNodeContents(t);
		const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
	});
	await page.keyboard.press('Control+k');
	await a.settle(300);
	let st = await page.evaluate(() => ({ open: document.getElementById('lpn_hotkeys_popup').style.display === 'flex',
		v: document.getElementById('lpn_guide_search').value, focus: document.activeElement && document.activeElement.id,
		entry: (() => { const e = document.getElementById('lpn_guide_b_lpn_find_popup'); return !!e && e.style.display !== 'none'; })() }));
	ok('page text selected: the guide opens with that text in the search field', st.open && st.v === word && st.focus === 'lpn_guide_search', JSON.stringify(st));
	ok('...and the search has run: the Find and replace entry is showing', st.entry, JSON.stringify(st));
	await page.keyboard.press('Escape');
	await a.settle(200);
	// Text selected inside a text box: part of the Find box's query.
	await page.fill('#lpn_find_popup .lpn-find-query', 'Pipe.Length above 900');
	const part = await page.evaluate(() => { const i = document.querySelector('#lpn_find_popup .lpn-find-query'); i.focus(); i.setSelectionRange(5, 11); return i.value.substring(5, 11); });
	await page.keyboard.press('Control+k');
	await a.settle(300);
	st = await page.evaluate(() => ({ v: document.getElementById('lpn_guide_search').value }));
	ok('text selected in a text box: that text is in the search field', st.v === part && part.length === 6, JSON.stringify(st) + ' ' + part);
	await page.keyboard.press('Escape');
	await a.settle(200);
	// Nothing selected.
	await page.evaluate(() => { window.getSelection().removeAllRanges(); if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
	await page.keyboard.press('Control+k');
	await a.settle(300);
	st = await page.evaluate(() => ({ v: document.getElementById('lpn_guide_search').value, open: document.getElementById('lpn_hotkeys_popup').style.display === 'flex' }));
	ok('nothing selected: the guide opens with an empty search field', st.open && st.v === '', JSON.stringify(st));
	const navFirst = await page.evaluate(() => { const l = document.querySelector('#lpn_guide_nav a[data-guide-link]'); return l ? l.getAttribute('data-guide-link') : null; });
	ok('...and Using the guide is first in the Contents rail', navFirst === 'using', navFirst);

	console.log('\n6. The chapter is in the Guide, and a search finds it');
	const ch = await page.evaluate(() => {
		const e = document.getElementById('lpn_guide_b_lpn_find_popup');
		return e ? { codes: e.querySelectorAll('code').length, dts: Array.from(e.querySelectorAll('dt')).map(d => d.textContent.trim()), paras: e.querySelectorAll(':scope > p').length } : null;
	});
	const terms = [];
	for (const k of ['lpn_guide_find_query_term', 'lpn_guide_find_examples_term', 'lpn_guide_find_results_term', 'lpn_guide_find_replace_term', 'lpn_guide_find_notes_term']) { terms.push(await a.lang(k).catch(() => enString(k))); }
	ok('the Find and replace entry carries its five terms', !!ch && terms.every(t => ch.dts.indexOf(t) >= 0), JSON.stringify(ch && ch.dts));
	ok('...its two opening paragraphs and its queries', !!ch && ch.paras === 2 && ch.codes >= exampleQueries().length, JSON.stringify(ch));
	await page.fill('#lpn_guide_search', 'criticality');
	await a.settle(200);
	const hit = await page.evaluate(() => {
		const e = document.getElementById('lpn_guide_b_lpn_find_popup');
		const shown = Array.from(document.querySelectorAll('.lpn-guide-boxentry')).filter(x => x.style.display !== 'none').map(x => x.id);
		return { find: !!e && e.style.display !== 'none', shown: shown };
	});
	ok('a search for "criticality" shows the Find and replace entry, whole', hit.find, JSON.stringify(hit));
	ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function net3(browser, Session) {
	const a = await boot(Session, browser, 'net3', 'lpn_ex_net3_title');
	await openFind(a);
	console.log('\n3. Every worked example returns what the chapter says (Net3)');
	const ex = exampleQueries();
	ok('every worked example in the chapter is measured here, and no more', ex.length === ROWS.length, ex.length + ' rows, ' + ROWS.length + ' measured');
	for (let i = 0; i < ex.length; i++) {
		const e = ex[i], want = ROWS[i];
		if (!want) { ok('measured: ' + e.q, false, 'no expectation in this harness'); continue; }
		const got = (await runQuery(a, e.q)).map(idOf);
		ok(e.q + ' -> ' + (want.ids.join(', ') || 'nothing'), want.ordered ? got.join('|') === want.ids.join('|') : sameSet(got, want.ids), got.join(', '));
		// A query quoted inside the row's text (the AND across two kinds of asset) matches nothing.
		if (want.inner) {
			const inner = (e.text.match(/<code>([^<]+)<\/code>/) || [])[1];
			const g2 = inner ? await runQuery(a, inner) : null;
			ok('...and ' + inner + ' matches nothing', !!g2 && g2.length === 0, g2 && g2.join(', '));
		}
		// The chapter names the same assets it was measured with.
		want.ids.forEach(id => { const n = id.split(' ')[1]; if (!new RegExp('\\b' + n + '\\b').test(e.text)) { ok('the chapter names ' + id + ' for ' + e.q, false); } });
	}
	console.log('\n5. A choice typed as the word the list shows');
	const closedWord = await a.lang('lpn_result_status_closed');
	const closedQ = (w) => [a.lang('lpn_tool_add_pipe'), a.lang('lpn_field_closed'), a.lang('lpn_find_op_equals')];
	const [pipeW, closedP, eqW] = await Promise.all(closedQ());
	let got = (await runQuery(a, pipeW + '.' + closedP + ' ' + eqW + " '" + closedWord + "'")).map(idOf);
	ok('a choice typed as its displayed word (' + closedWord + ') finds Pipe 330 alone', got.join('|') === 'Pipe 330', got.slice(0, 4).join(', '));
	got = await runQuery(a, pipeW + '.' + closedP + ' ' + eqW + " 'shut'");
	ok('a word that is no choice finds nothing (never the first choice)', got.length === 0, got.slice(0, 3).join(', '));

	console.log('\n4b. Replace closes Pipe 247; the connectivity query lists the junctions it cut off');
	const rq = codesIn('lpn_guide_find_replace_def'), connQ = ex[ex.length - 1].q;
	got = (await runQuery(a, rq[1])).map(idOf);
	ok(rq[1] + ' -> Pipe 247', got.join('|') === 'Pipe 247', got.join(', '));
	const propSel = await replaceControl(a, 'lpn_replace_prop', 'select');
	await propSel.asElement().selectOption('status');
	await a.settle(200);
	const valSel = await replaceControl(a, 'lpn_replace_value', 'select');
	await valSel.asElement().selectOption('closed');
	await a.settle(100);
	await pressButton(a, 'lpn_replace_btn');
	await pressButton(a, 'lpn_replace_apply');
	got = (await runQuery(a, connQ)).map(idOf);
	ok('with Pipe 247 closed: Junctions 215, 217, 219, and 225', sameSet(got, ['Junction 215', 'Junction 217', 'Junction 219', 'Junction 225']), got.join(', '));
	ok('...and the chapter names those four', ['215', '217', '219', '225'].every(n => enString('lpn_guide_find_examples_def').indexOf(n) >= 0));
	await undo(a);
	await openFind(a);
	got = await runQuery(a, connQ);
	ok('Undo reopens the pipe: nothing is cut off', got.length === 0, got.join(', '));
	ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function net1(browser, Session) {
	const a = await boot(Session, browser, 'net1', 'lpn_ex_net1_title');
	await openFind(a);
	console.log('\n4a. Replace on Net1: four diameters, one Undo');
	const dq = codesIn('lpn_guide_find_replace_def')[0];
	let got = (await runQuery(a, dq)).map(idOf);
	ok(dq + ' -> Pipes 31, 122, 113, and 121', sameSet(got, ['Pipe 31', 'Pipe 122', 'Pipe 113', 'Pipe 121']), got.join(', '));
	const propSel = await replaceControl(a, 'lpn_replace_prop', 'select');
	await propSel.asElement().selectOption('diameter');
	await a.settle(200);
	const val = await replaceControl(a, 'lpn_replace_value', 'input');
	await val.asElement().fill('10');
	await pressButton(a, 'lpn_replace_btn');
	const preview = await a.page.evaluate(() => document.getElementById('lpn_find_popup').textContent);
	const want = (await a.lang('lpn_replace_preview')).replace('{n}', '4');
	ok('the box shows the preview for 4 assets', preview.indexOf(want) >= 0, want);
	await pressButton(a, 'lpn_replace_apply');
	got = await runQuery(a, dq);
	ok('after Change them, no pipe is below 10 in.', got.length === 0, got.join(', '));
	got = (await runQuery(a, dq.replace(/ \S+ 10$/, ' ' + (await a.lang('lpn_find_op_equals')) + ' 10'))).map(idOf);
	ok('...the four are 10 in.', ['Pipe 31', 'Pipe 122', 'Pipe 113', 'Pipe 121'].every(p => got.indexOf(p) >= 0), got.join(', '));
	await undo(a);
	await openFind(a);
	got = await runQuery(a, dq);
	ok('one Undo returns all four to 6 and 8 in.', got.length === 4 && got.every(r => / (6|8)$/.test(r)), got.join(', '));
	const tq = codesIn('lpn_guide_find_notes_def')[0];
	got = (await runQuery(a, tq)).map(idOf);
	ok(tq + ' -> Junctions 21, 22, 23, 31, and 32', sameSet(got, ['Junction 21', 'Junction 22', 'Junction 23', 'Junction 31', 'Junction 32']), got.join(', '));
	ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		await orderAndKeys(browser, Session);
		await net3(browser, Session);
		await net1(browser, Session);
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nuser-guide-find-harness: ${fails} FAILURE(S)` : '\nuser-guide-find-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();
