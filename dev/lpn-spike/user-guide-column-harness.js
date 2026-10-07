// THE GUIDE'S RIGHT PANE IS ONE READING COLUMN, AND IT SAYS "ASSET" (Tom, 2026-10-07).
//   node dev/lpn-spike/user-guide-column-harness.js
// (it takes the browser lock itself; never wrap it in that lock).
//
// Tom's browser pass: "A lot of real estate is wasted on making the middle part of the box a
// separate column. And then at Map and afterward, it's suddenly not a separate column. Ditch the
// two-column approach for the right pane and put it all in line." And: "Every chance we can
// honestly say 'asset' instead of 'element', we should."
//
// Real Chromium, the Guide opened from its real Help row, at 1400 px and at 390 px:
//   1. Every toolbar and menu row puts its text BELOW its name, starting at the row's own edge,
//      never in a column beside the name.
//   2. Every block of text in the pane -- section headings, row text, box entries, the key tables
//      and the terms above them -- starts on one left edge (submenu rows excepted: their indent
//      means nesting).
//   3. The pane never scrolls sideways.
//   4. No Guide text says "element" unless the sentence is on ALLOW below (an interface or DOM
//      element, never a network asset).
//   5. The Properties and Settings entries carry the 2026-10-07 wording.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDECOLUMN_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-column-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

// Sentences in the Guide that may say "element" because they mean an interface or a DOM element,
// not a junction, pipe, tank or any other network asset. Add the WHOLE sentence, with a reason.
const ALLOW = [
];

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const EN = require('fs').readFileSync(path.join(REPO, 'lib', 'lang.ec.en.php'), 'utf8');
function enString(key) {
	const m = EN.match(new RegExp("\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';"));
	if (!m) { throw new Error('no English for ' + key); }
	return m[1].replace(/\\'/g, "'");
}

async function openGuide(Session, browser, tag, extra) {
	const a = await Session.open(browser, 'guide-col-' + tag, extra);
	await a.goto('Looped-Network.php');
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(600);
	await a.openMenu('help');
	await a.page.evaluate(() => {
		const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(r => r.__lpnRow && r.__lpnRow.hotkey === '?')[0];
		b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	});
	await a.settle(400);
	return a;
}

// Measures the content pane with every section in view in turn (layout does not depend on scroll,
// but a lazily drawn section might).
const measure = (page) => page.evaluate(() => {
	const pane = document.getElementById('lpn_guide_content');
	const px = (el, side) => parseFloat(getComputedStyle(el)['padding' + side]) + parseFloat(getComputedStyle(el)['border' + side + 'Width']);
	const textLeft = (el) => Math.round(el.getBoundingClientRect().left + px(el, 'Left'));
	const shown = (el) => el.getClientRects().length > 0;
	const out = { rows: 0, beside: [], offEdge: [], edges: {}, overflow: pane.scrollWidth - pane.clientWidth };
	const h2 = pane.querySelector('.lpn-guide-section > h2');
	const edge = textLeft(h2);
	out.edge = edge;
	const note = (what, el) => {
		const l = textLeft(el);
		if (Math.abs(l - edge) > 2) { out.offEdge.push(what + ' at ' + l + ' (edge ' + edge + '): ' + el.textContent.trim().slice(0, 40)); }
		out.edges[what] = (out.edges[what] || 0) + 1;
	};
	pane.querySelectorAll('.lpn-guide-row').forEach((r) => {
		if (!shown(r)) { return; }
		const name = r.querySelector('.lpn-guide-name'), desc = r.querySelector('.lpn-guide-desc');
		out.rows++;
		if (!desc || !desc.textContent.trim()) { return; }
		const n = name.getBoundingClientRect(), d = desc.getBoundingClientRect();
		const rowLeft = textLeft(r);
		if (d.top < n.bottom - 1 || Math.abs(d.left - rowLeft) > 2) {
			out.beside.push(name.textContent.trim() + ' desc@' + Math.round(d.left) + ',' + Math.round(d.top) + ' name bottom ' + Math.round(n.bottom) + ' row ' + rowLeft);
		}
		if (!r.classList.contains('lpn-guide-sub')) { note('row text', desc); }
	});
	pane.querySelectorAll('.lpn-guide-section > h2').forEach((el) => { if (shown(el)) { note('h2', el); } });
	pane.querySelectorAll('.lpn-guide-menu > h3').forEach((el) => { if (shown(el)) { note('menu h3', el); } });
	pane.querySelectorAll('.lpn-guide-section dt').forEach((el) => { if (shown(el)) { note('term', el); } });
	pane.querySelectorAll('.lpn-guide-section dd td:first-child').forEach((el) => { if (shown(el)) { note('key cell', el); } });
	pane.querySelectorAll('.lpn-guide-prose').forEach((el) => { if (shown(el)) { note('prose', el); } });
	pane.querySelectorAll('.lpn-guide-boxentry').forEach((en) => {
		if (!shown(en)) { return; }
		note('box title', en.querySelector('h3'));
		en.querySelectorAll('p').forEach((p) => note('box text', p));
	});
	return out;
});

const sentences = (page) => page.evaluate(() => {
	const pane = document.getElementById('lpn_guide_content'), out = [];
	pane.querySelectorAll('.lpn-guide-tip, .lpn-guide-boxentry p, .lpn-guide-prose, dt, td, h2, h3').forEach((el) => {
		String(el.textContent || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).forEach((s) => { if (s) { out.push(s); } });
	});
	return out;
});

async function pass(browser, Session, tag, extra) {
	const a = await openGuide(Session, browser, tag, extra);
	const page = a.page;
	console.log('\n' + tag);
	ok('the guide is open', await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex'));
	const m = await measure(page);
	ok('it drew toolbar and menu rows', m.rows > 40, String(m.rows));
	ok('1. every row puts its text below its name, at the row\'s edge', m.beside.length === 0, m.beside.slice(0, 3).join(' | '));
	ok('2. every text block starts on one left edge', m.offEdge.length === 0, m.offEdge.slice(0, 4).join(' | '));
	ok('...and that covers every kind of block', ['row text', 'h2', 'menu h3', 'term', 'key cell', 'prose', 'box title', 'box text'].every(k => m.edges[k] > 0), JSON.stringify(m.edges));
	ok('3. the pane never scrolls sideways', m.overflow <= 0, String(m.overflow));
	if (tag === 'desktop') {
		const w = await page.evaluate(() => document.getElementById('lpn_guide_content').clientWidth);
		ok('...measured at desktop width (pane wider than 520 px)', w > 520, String(w));
		const all = await sentences(page);
		const bad = all.filter(s => /\belements?\b/i.test(s) && ALLOW.indexOf(s) < 0);
		ok('4. no Guide sentence says "element" outside the allow-list', bad.length === 0, bad.slice(0, 3).join(' | '));
		ok('...and the Guide was read whole', all.length > 150, String(all.length));
		const entry = (id) => page.evaluate((id) => {
			const en = document.getElementById('lpn_guide_b_' + id);
			return en ? Array.from(en.querySelectorAll('p')).map(p => p.textContent.trim()).join('\n\n') : null;
		}, id);
		const props = await entry('lpn_popup');
		ok('5. Properties shows the 2026-10-07 wording', props === enString('lpn_guide_text_popup'), props);
		ok('...without the Recalculate sentence it replaced', !/Recalculate automatically/.test(props || ''));
		const set = await entry('lpn_settings_box');
		ok('...Settings shows its wording, leading with the only place and the search', set === enString('lpn_guide_text_settings_box') && /^This is the only place where settings are made, and it is searchable/.test(set || ''), set);
	} else {
		const w = await page.evaluate(() => document.getElementById('lpn_guide_content').clientWidth);
		ok('...measured at phone width (pane at most 390 px)', w <= 390, String(w));
		const cells = await page.evaluate(() => {
			const td = document.querySelector('[data-guide-section="map"] td:first-child'), nx = td.nextElementSibling;
			return { keyBottom: Math.round(td.getBoundingClientRect().bottom), actTop: Math.round(nx.getBoundingClientRect().top) };
		});
		ok('a key table stacks its action below its key at phone width', cells.actTop >= cells.keyBottom - 1, JSON.stringify(cells));
	}
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
		await pass(browser, Session, 'desktop', { viewport: { width: 1400, height: 1000 } });
		await pass(browser, Session, 'phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nuser-guide-column-harness: ${fails} FAILURE(S)` : '\nuser-guide-column-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();
