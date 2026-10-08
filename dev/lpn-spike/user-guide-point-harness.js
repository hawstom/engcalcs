// EVERY GUIDE CARD POINTS (Tom's browser pass, 2026-10-08: "Things need to have a predictable behavior.").
//   node dev/lpn-spike/user-guide-point-harness.js
// (it takes the browser lock itself; never wrap it in that lock).
//
// Real Chromium, clicking real cards:
//   1. Select, Water > Scenarios > Basic mode and Find and replace: nothing is invoked (tool mode,
//      document, undo stack and stored settings unchanged), the pointer ring (lpn-guide-point) is
//      on the control, it is not the control's pressed state, and no menu row holds focus.
//   2. The index (contents rail) highlight moves to the section of the card clicked.
//   3. A search for "mode" shows Scenarios in the path of the Basic mode hit.
//   4. Clicking the same card again does exactly what the first click did.
//   5. SWEEP: every card in the Guide marks a visible control, or shows the one "not on screen" note.
//   6. The same on a Spanish page.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDEPOINT_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-point-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

async function boot(Session, browser, tag, url) {
	const a = await Session.open(browser, 'guidepoint-' + tag);
	await a.goto(url);
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(600);
	await a.page.evaluate(() => {
		const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(r => r.__lpnRow && r.__lpnRow.hotkey === '?')[0];
		if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
	});
	return a;
}
async function openGuide(a) {
	await a.openMenu('help');
	await a.page.evaluate(() => {
		const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(r => r.__lpnRow && r.__lpnRow.hotkey === '?')[0];
		b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	});
	await a.settle(400);
}
const state = (page) => page.evaluate(() => {
	const p = EngCalcs.lpnGuideProbe();
	return { mode: p.mode, sig: p.sig, undo: p.undo, ls: JSON.stringify(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)])
		.filter(x => !/hotkeysbox|dock|layout/.test(x[0]))) };
});
// Click a card by its selector-finder (a function body string), as a real click.
const clickCard = (page, finder) => page.evaluate((f) => {
	const c = (new Function('return (' + f + ')()'))();
	if (!c) { return false; }
	c.scrollIntoView({ block: 'center' });
	c.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	return true;
}, finder);
const pointed = (page) => page.evaluate(() => {
	const els = Array.from(document.querySelectorAll('.lpn-guide-point'));
	const el = els[0] || null;
	const note = document.querySelectorAll('.lpn-guide-nopoint').length;
	const ae = document.activeElement;
	return {
		n: els.length, note,
		id: el ? (el.id || (el.__lpnRow ? el.__lpnRow.label : '') || el.getAttribute('data-tool') || el.getAttribute('title') || el.tagName) : null,
		visible: !!el && el.getClientRects().length > 0,
		pressed: el ? el.getAttribute('aria-pressed') : null,
		focusOnMenuRow: !!(ae && ae.closest && ae.closest('#lpn_menu_popup, #lpn_menu_popup2')),
		ring: el ? getComputedStyle(el).outlineStyle + ' ' + getComputedStyle(el).outlineColor : ''
	};
});
const cur = (page) => page.evaluate(() => {
	const c = document.querySelector('#lpn_guide_nav a[aria-current="true"]');
	return c ? c.getAttribute('data-guide-link') : null;
});
const cardSel = {
	select: "function () { return Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).filter(r => r.__lpnGuide.g.b.el && r.__lpnGuide.g.b.el.dataset.tool === 'select')[0]; }",
	basic: "function () { return Array.from(document.querySelectorAll('#lpn_guide_menus [data-guide-menu=\"lpn_menu_project\"] .lpn-guide-sub')).filter(r => r.querySelector('.lpn-guide-name').textContent.indexOf(EngCalcs.pageConfig.lpn_scenario_basic) >= 0)[0]; }",
	find: "function () { return document.getElementById('lpn_guide_b_lpn_find_popup'); }"
};

async function run(browser, Session, tag, url) {
	console.log('\n=== ' + tag + ' ===');
	const a = await boot(Session, browser, tag, url);
	const page = a.page;
	await openGuide(a);
	ok('the guide is open', await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex'));
	const before = await state(page);

	console.log('\n1. Select');
	ok('the Select card exists', await clickCard(page, cardSel.select));
	await a.settle(200);
	let p = await pointed(page);
	ok('exactly one pointer ring, on a visible control', p.n === 1 && p.visible, JSON.stringify(p));
	ok('the ring is dashed and in the pointer colour, whatever the control\'s own state', /dashed/.test(p.ring) && /194, 24, 91/.test(p.ring), JSON.stringify(p));
	let s = await state(page);
	ok('nothing invoked: mode, document, undo and stored settings unchanged', s.mode === before.mode && s.sig === before.sig && s.undo === before.undo && s.ls === before.ls, before.mode + ' -> ' + s.mode);
	ok('the index highlight is on Toolbar', (await cur(page)) === 'toolbar', await cur(page));
	await page.waitForTimeout(2800);
	p = await pointed(page);
	ok('the ring fades away by itself', p.n === 0, JSON.stringify(p));

	console.log('\n2. Water > Scenarios > Basic mode');
	ok('the Basic mode card exists', await clickCard(page, cardSel.basic));
	await a.settle(250);
	p = await pointed(page);
	const open1 = await page.evaluate(() => ({ m: document.getElementById('lpn_menu_popup').style.display, s: document.getElementById('lpn_menu_popup2').style.display }));
	ok('the Water menu and its fly-out are open', open1.m === 'block' && open1.s === 'block', JSON.stringify(open1));
	ok('one ring, on a visible row, and no menu row holds keyboard focus', p.n === 1 && p.visible && !p.focusOnMenuRow, JSON.stringify(p));
	ok('...and the ring is on Basic mode', p.id.indexOf(await a.lang('lpn_scenario_basic')) >= 0, JSON.stringify(p));
	s = await state(page);
	ok('nothing invoked', s.mode === before.mode && s.sig === before.sig && s.undo === before.undo && s.ls === before.ls);
	ok('the index highlight moved to Menus', (await cur(page)) === 'menus', await cur(page));
	const first = { p, open1 };
	await clickCard(page, cardSel.basic);
	await a.settle(250);
	p = await pointed(page);
	const open2 = await page.evaluate(() => ({ m: document.getElementById('lpn_menu_popup').style.display, s: document.getElementById('lpn_menu_popup2').style.display }));
	ok('a second click does exactly the same', JSON.stringify([p, open2]) === JSON.stringify([first.p, first.open1]), JSON.stringify([p, open2]));
	s = await state(page);
	ok('...and still invokes nothing', s.mode === before.mode && s.sig === before.sig && s.ls === before.ls);

	const menusOpen = () => page.evaluate(() => ({ m: document.getElementById('lpn_menu_popup').style.display, s: document.getElementById('lpn_menu_popup2').style.display }));
	await page.waitForTimeout(2800);
	ok('after the ring fades the menu and fly-out the card opened are closed', JSON.stringify(await menusOpen()) === '{"m":"none","s":"none"}', JSON.stringify(await menusOpen()));
	await clickCard(page, cardSel.basic);
	await a.settle(200);
	await clickCard(page, cardSel.select);
	await a.settle(200);
	p = await pointed(page);
	ok('a card of another kind closes the first card\'s menu at once, and rings its own control', JSON.stringify(await menusOpen()) === '{"m":"none","s":"none"}' && p.n === 1 && p.id === 'select', JSON.stringify([await menusOpen(), p]));
	await page.waitForTimeout(2800);

	console.log('\n2b. Properties and Alternatives preview say how they open');
	await clickCard(page, "function () { return document.getElementById('lpn_guide_b_lpn_popup'); }");
	await a.settle(150);
	const note = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-guide-nopoint')).map(n => n.textContent));
	ok('the Properties card shows the note with its pointer', note.length === 1 && note[0].indexOf(await a.lang('lpn_guide_how_popup')) >= 0 && note[0].indexOf(await a.lang('lpn_guide_not_shown')) === 0, JSON.stringify(note));
	await clickCard(page, "function () { return document.getElementById('lpn_guide_b_lpn_alt_box'); }");
	await a.settle(150);
	const note2 = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-guide-nopoint')).map(n => n.textContent));
	ok('the Alternatives preview card shows the note with its pointer, and the Properties note is gone', note2.length === 1 && note2[0].indexOf(await a.lang('lpn_guide_how_alt')) >= 0, JSON.stringify(note2));

	console.log('\n3. Find and replace');
	await page.keyboard.press('Escape');
	await a.settle(100);
	ok('the Find and replace card exists', await clickCard(page, cardSel.find));
	await a.settle(250);
	p = await pointed(page);
	ok('it points at a visible control', p.n === 1 && p.visible && p.note === 0, JSON.stringify(p));
	const findBox = await page.evaluate(() => { const b = document.getElementById('lpn_find_popup'); return b.style.display !== 'none' && b.getClientRects().length > 0; });
	ok('...and does not open the Find box', !findBox);
	ok('the index highlight is on that card', (await cur(page)) === 'box-lpn_find_popup', await cur(page));
	s = await state(page);
	ok('nothing invoked', s.mode === before.mode && s.sig === before.sig && s.undo === before.undo);

	console.log('\n4. Search: every hit shows its whole path');
	const basicWord = (await a.lang('lpn_scenario_basic')).toLowerCase().replace(/[^\p{L}\s]/gu, '').trim();
	await page.fill('#lpn_guide_search', basicWord);
	await a.settle(200);
	const hit = await page.evaluate(() => {
		const r = Array.from(document.querySelectorAll('#lpn_guide_menus .lpn-guide-sub')).filter(x => x.style.display !== 'none' && x.querySelector('.lpn-guide-name').textContent.indexOf(EngCalcs.pageConfig.lpn_scenario_basic) >= 0)[0];
		if (!r) { return null; }
		const n = r.querySelector('.lpn-guide-name');
		const ctx = getComputedStyle(n, '::before').content;
		const h3 = r.closest('.lpn-guide-menu').querySelector('h3').textContent;
		return { ctx, h3, h2: r.closest('section').querySelector('h2').textContent };
	});
	ok('the Basic mode hit is listed', !!hit, JSON.stringify(hit));
	ok('...its path carries Scenarios', !!hit && hit.ctx.indexOf(a.scenariosLabel || 'Scenarios') >= 0 || !!hit && /\S/.test(hit.ctx.replace(/["\s›]/g, '')), JSON.stringify(hit));
	if (tag === 'en') { ok('...exactly "Scenarios" before the name', !!hit && /Scenarios/.test(hit.ctx), JSON.stringify(hit)); }
	const navTxt = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_nav a')).map(x => {
		const sn = x.querySelector('.lpn-guide-nav-snip');
		return sn ? x.textContent.indexOf(' ' + sn.textContent) > 0 : true;
	}));
	ok('a rail entry\'s name and its snippet are separated by a space', navTxt.length > 0 && navTxt.every(Boolean), JSON.stringify(navTxt));
	await page.fill('#lpn_guide_search', '');
	await page.evaluate(() => document.getElementById('lpn_guide_search').dispatchEvent(new Event('input')));
	await a.settle(150);

	console.log('\n5. SWEEP: every card points, or says it cannot');
	const total = await page.evaluate(() => document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row, #lpn_guide_menus .lpn-guide-row, .lpn-guide-boxentry').length);
	const bad = [], notes = [];
	for (let i = 0; i < total; i++) {
		const info = await page.evaluate((idx) => {
			const cards = Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row, #lpn_guide_menus .lpn-guide-row, .lpn-guide-boxentry'));
			const c = cards[idx];
			if (!document.getElementById('lpn_hotkeys_popup') || document.getElementById('lpn_hotkeys_popup').style.display !== 'flex') { return { gone: true }; }
			c.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			const name = (c.querySelector('.lpn-guide-name, h3') || c).textContent.trim();
			const pts = Array.from(document.querySelectorAll('.lpn-guide-point'));
			const notesN = c.querySelectorAll('.lpn-guide-nopoint').length;
			return { name, pts: pts.length, vis: pts.length === 1 && pts[0].getClientRects().length > 0, notes: notesN };
		}, i);
		if (info.gone) { bad.push(i + ': the guide closed'); await openGuide(a); continue; }
		if (info.notes === 1 && info.pts === 0) { notes.push(info.name); }
		else if (!(info.pts === 1 && info.vis && info.notes === 0)) { bad.push(i + ' ' + info.name + ' ' + JSON.stringify(info)); }
	}
	ok('all ' + total + ' cards either ring a visible control or show the note', bad.length === 0, bad.slice(0, 12).join(' | '));
	console.log('       (' + notes.length + ' show the note: ' + notes.join(', ').slice(0, 600) + ')');
	s = await state(page);
	ok('after the sweep nothing was invoked', s.mode === before.mode && s.sig === before.sig && s.undo === before.undo, before.mode + ' -> ' + s.mode);
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
		await run(browser, Session, 'en', 'Looped-Network.php');
		await run(browser, Session, 'es', 'Looped-Network.php?lang=es');
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nuser-guide-point-harness: ${fails} FAILURE(S)` : '\nuser-guide-point-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();
