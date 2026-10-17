// COPY A BASE AS A CHILD, AND COPY UPWARD, CLICKED IN A REAL CHROMIUM (Tom, 2026-10-16). Run with:
//   node dev/lpn-spike/alternative-copy-browser-harness.js   (takes the browser lock itself)
//
// On the crafted Net1 of alternative-merge-upward-browser-harness.js (Physical: Base > A > B > C, B
// holding pipe 10's diameter, C pipe 10's and junction 22's elevation; scenario "Uses C" naming C):
//   C1  Copy is live on the Physical tree's Base, its tip saying what it does (Tom: "I should be able
//       to copy a Base as a child. Right?"); pressed, it adds Copy_of_Base, a child of Base holding no
//       overrides, shown open under Base and selected; one Ctrl+Z takes it away.
//   C2  Copy on A still copies beside A (a sibling under A's parent, Base).
// Wording is read from the page's own language strings.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ALTCOPY_LOCKED';
const NAME = 'alternative-copy-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const byId = (arr, id) => (arr || []).filter((x) => x.id === id)[0];
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	let a = null, page = null;
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		d.alternatives = [
			{ id: 'a1', category: 'physical', name: 'A', parent: null },
			{ id: 'a2', category: 'physical', name: 'B', parent: 'a1', values: { 'l:10': { diameter: 16 } } },
			{ id: 'a3', category: 'physical', name: 'C', parent: 'a2', values: { 'l:10': { diameter: 20 }, 'n:22': { elev: 900 } } },
			{ id: 'a4', category: 'topology', name: 'Tank at 22', parent: null, values: { 'n:22': { type: 'tank' } } },
			{ id: 'a5', category: 'presentation', name: 'Close up', parent: null, settings: { view: { cx: 20, cy: 40, s: 12 } } }];
		d.scenarios.push({ id: 's1', name: 'Uses C', overrides: {}, alternatives: { physical: 'a3' } });
		d.project = Object.assign({}, d.project, { activeScenario: 'base' });
		// Recalculate off: a merge then leaves the answers on screen as a snapshot (CLAUDE.md, lpn_).
		d.settings.autoRun = false;
		a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.settle(2500);
		const L = (k) => a.lang(k);
		const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')));
		const flush = async () => { await a.settle(2600); };
		const settle = (ms) => a.settle(ms);
		const dialogText = () => page.evaluate(() => { const m = document.querySelector('#lpn_dialog .lpn-dialog-msg'); const box = document.getElementById('lpn_dialog'); return box && getComputedStyle(box).display !== 'none' && m ? m.textContent : null; });
		const dialogButtons = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent.trim()));
		const press = async (label) => {
			const hit = await page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
				return !!b;
			}, label);
			await settle(700);
			return hit;
		};
		const click = async (sel) => { await page.evaluate((s) => document.querySelector(s).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), sel); await settle(500); };
		const rowOf = (name) => page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name + '$') }) }).first();
		const clickRow = async (name) => { await rowOf(name).locator('.lpn-sm-name').click(); await settle(300); };
		const mergeBtn = () => page.evaluate(() => { const b = document.getElementById('lpn_sm_merge'); return b ? { text: b.textContent, off: b.getAttribute('aria-disabled') === 'true', title: b.title } : null; });
		const vals = (sv, id) => (byId(sv.alternatives, id) || {}).values;
		// The pressures the map's labels show (P=...), all of them, in order.
		const pressureCell = () => page.evaluate(() => {
			const t = Array.from(document.querySelectorAll('#lpn_canvas text')).map((e) => e.textContent).filter((x) => /P=\s*-?\d/.test(x));
			return t.length ? t.join(' ; ') : null;
		});

		const copyBtn = () => page.evaluate(() => { const b = document.getElementById('lpn_sm_copy'); return b ? { text: b.textContent, off: b.getAttribute('aria-disabled') === 'true', title: b.title } : null; });
		const selName = () => page.evaluate(() => { const r = document.querySelector('#lpn_sm_tree .lpn-sm-row[aria-selected="true"] .lpn-sm-name'); return r ? r.textContent : null; });
		const rowVisible = (name) => rowOf(name).isVisible().catch(() => false);
		const unblur = () => page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim() === (await L('lpn_sm_menu')).trim()) { await r.click(); break; }
		}
		await settle(900);
		ok('the Scenario manager is open', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_box')).display !== 'none'));
		await page.selectOption('#lpn_sm_tree_select', 'physical');
		await settle(600);

		console.log('--- C1. Copy on Base ---');
		await flush();
		const sv0 = await saved();
		await clickRow(await L('lpn_scenario_base'));
		let cb = await copyBtn();
		ok('C1 Copy is live on Base', !!cb && cb.text === (await L('lpn_sm_copy')) && cb.off === false, JSON.stringify(cb));
		ok('C1 ...its tip says it copies Base as a child', !!cb && cb.title === (await L('lpn_sm_copy_base_tip')), JSON.stringify(cb));
		await click('#lpn_sm_copy');
		await flush();
		let sv = await saved();
		const made = (sv.alternatives || []).filter((x) => x.category === 'physical' && x.name === 'Copy_of_Base');
		ok('C1 a new Physical alternative Copy_of_Base, a child of Base (parent null, not a Base of its own)', made.length === 1 && made[0].parent === null && made[0].root !== true, JSON.stringify(made));
		ok('C1 ...holding no overrides', made.length === 1 && !made[0].values && !made[0].settings, JSON.stringify(made));
		ok('C1 ...shown in the tree and selected', (await rowVisible('Copy_of_Base')) && (await selName()) === 'Copy_of_Base', JSON.stringify(await selName()));
		ok('C1 ...and nothing else changed', JSON.stringify((sv.alternatives || []).filter((x) => x.name !== 'Copy_of_Base')) === JSON.stringify(sv0.alternatives), '');
		await unblur();
		await page.keyboard.press('Control+z');
		await flush();
		ok('C1 one Ctrl+Z takes it away', JSON.stringify((await saved()).alternatives) === JSON.stringify(sv0.alternatives), JSON.stringify((await saved()).alternatives));

		console.log('--- C2. Copy on A ---');
		await clickRow('A');
		await click('#lpn_sm_copy');
		await flush();
		sv = await saved();
		const ca = (sv.alternatives || []).filter((x) => x.name === 'Copy_of_A');
		ok('C2 Copy on A copies beside it, under Base', ca.length === 1 && ca[0].parent === null && ca[0].category === 'physical', JSON.stringify(ca));
		await unblur();
		await page.keyboard.press('Control+z');
		await flush();

		// @@COPY-UPWARD@@

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
