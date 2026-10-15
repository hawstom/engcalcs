// MERGE UPWARD, CLICKED IN A REAL CHROMIUM (Task 801; Tom, 2026-10-15). Run with:
//   node dev/lpn-spike/alternative-merge-upward-browser-harness.js   (takes the browser lock itself)
//
// The model is held headless by alternative-merge-upward-harness.js; this holds the box, the menu
// and the two questions, on a crafted Net1 whose Physical tree is Base > A > B > C (B holds pipe
// 10's diameter, C pipe 10's and junction 22's elevation), scenario "Uses C" naming C, Recalculate
// off:
//   M1  the Scenarios menu has no Apply Base values;
//   M2  "Merge upward" is a button and a right-click row of an alternatives tree, greyed on Base;
//   M3  pressed on C it asks which ancestor, by name, parent first, then Cancel; Cancel writes nothing;
//   M4  choosing A asks first, naming B and "Pipe 10: Diameter" (the skipped value); OK merges, B is
//       untouched, C is emptied; the stale results stay on screen (Recalculate off);
//   M5  one Ctrl+Z puts all of it back;
//   M6  from the right-click menu, into the parent B: no skipped level is named; and into Base the
//       drawing itself takes the values.
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
const LOCK_ENV = 'EC_MERGEUP_LOCKED';
const NAME = 'alternative-merge-upward-browser-harness';
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
			{ id: 'a3', category: 'physical', name: 'C', parent: 'a2', values: { 'l:10': { diameter: 20 }, 'n:22': { elev: 900 } } }];
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

		console.log('--- M1. the Scenarios menu ---');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const menuText = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).map((r) => r.textContent.trim()).join(' | '));
		ok('M1 no Apply Base values in the Scenarios menu', menuText.length > 0 && !/Apply Base/i.test(menuText), menuText);
		// The Scenario manager row is first; Basic mode is already off.
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim() === (await L('lpn_sm_menu')).trim()) { await r.click(); break; }
		}
		await settle(900);
		ok('M1 the Scenario manager is open', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_box')).display !== 'none'));

		console.log('--- M2. the command ---');
		await page.selectOption('#lpn_sm_tree_select', 'physical');
		await settle(600);
		await clickRow(await L('lpn_scenario_base'));
		const MU = await L('lpn_sm_merge_up');
		let mb = await mergeBtn();
		ok('M2 the alternatives tree has a "' + MU + '" button, reading exactly "Merge upward"', !!mb && mb.text === MU && MU === 'Merge upward', JSON.stringify(mb));
		ok('M2 ...greyed on Base, saying why', mb.off === true && mb.title === await L('lpn_sm_merge_up_root'), JSON.stringify(mb));
		await clickRow('C');
		mb = await mergeBtn();
		ok('M2 ...live on C', mb.off === false, JSON.stringify(mb));
		await rowOf('C').locator('.lpn-sm-name').click({ button: 'right' });
		await settle(400);
		const ctx = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-sm-menu [role=menuitem]')).map((e) => e.textContent.trim()));
		ok('M2 ...and a right-click row', ctx.indexOf(MU) >= 0, JSON.stringify(ctx));
		await page.keyboard.press('Escape');
		await page.evaluate(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
		await settle(300);

		console.log('--- M3. which ancestor ---');
		await flush();
		const sv0 = await saved();
		const p0 = await pressureCell();
		await click('#lpn_sm_merge');
		ok('M3 it asks which alternative, naming C', (await dialogText()) === (await L('lpn_sm_merge_pick')).replace('{name}', 'C'), await dialogText());
		ok('M3 ...offering B, A, Base, then Cancel', JSON.stringify(await dialogButtons()) === JSON.stringify(['B', 'A', await L('lpn_scenario_base'), await L('lpn_cancel')]), JSON.stringify(await dialogButtons()));
		await press(await L('lpn_cancel'));
		await flush();
		ok('M3 Cancel writes nothing', JSON.stringify(await saved()) === JSON.stringify(sv0));

		console.log('--- M4. into A, skipping B ---');
		await click('#lpn_sm_merge');
		await press('A');
		const q = await dialogText();
		const ask = (await L('lpn_sm_merge_ask')).replace('{n}', '2').replace('{name}', 'C').replace('{target}', 'A');
		const skip = (await L('lpn_sm_merge_skipped')).replace(/\{between\}/g, 'B').replace('{name}', 'C').replace('{target}', 'A');
		ok('M4 the question names C, the count and A', !!q && q.indexOf(ask) === 0, JSON.stringify(q));
		ok('M4 ...and, before merging, B and the value it holds', !!q && q.indexOf(skip + '\n' + (await L('lpn_tool_add_pipe')) + ' 10: ' + (await L('lpn_field_diameter'))) > 0, JSON.stringify(q));
		await press(await L('lpn_dialog_ok'));
		await flush();
		let sv = await saved();
		ok('M4 A holds C\'s values', (vals(sv, 'a1') || {})['l:10'] && vals(sv, 'a1')['l:10'].diameter === 20 && vals(sv, 'a1')['n:22'].elev === 900, JSON.stringify(vals(sv, 'a1')));
		ok('M4 ...B is untouched', JSON.stringify(vals(sv, 'a2')) === JSON.stringify({ 'l:10': { diameter: 16 } }), JSON.stringify(vals(sv, 'a2')));
		ok('M4 ...C is emptied and still in the tree', !!byId(sv.alternatives, 'a3') && !vals(sv, 'a3'), JSON.stringify(byId(sv.alternatives, 'a3')));
		const p1 = await pressureCell();
		ok('M4 the results on screen stay (Recalculate off: a snapshot, never cleared)', p0 !== null && p1 === p0, JSON.stringify([p0, p1]).slice(0, 300));

		console.log('--- M5. undo ---');
		await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
		await page.keyboard.press('Control+z');
		await flush();
		ok('M5 one Ctrl+Z puts all of it back', JSON.stringify((await saved()).alternatives) === JSON.stringify(sv0.alternatives), JSON.stringify((await saved()).alternatives));

		console.log('--- M6. into the parent, from the right-click menu; then into Base ---');
		await page.evaluate(() => { const b = document.getElementById('lpn_sm_box'); if (b && getComputedStyle(b).display === 'none') { b.style.display = 'flex'; } });
		await clickRow('C');
		await rowOf('C').locator('.lpn-sm-name').click({ button: 'right' });
		await settle(400);
		await page.evaluate((t) => { const b = Array.from(document.querySelectorAll('.lpn-sm-menu [role=menuitem]')).filter((e) => e.textContent.trim() === t)[0]; if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } }, MU);
		await settle(600);
		await press('B');
		const q2 = await dialogText();
		ok('M6 into the parent: no skipped level is named', !!q2 && q2 === (await L('lpn_sm_merge_ask')).replace('{n}', '2').replace('{name}', 'C').replace('{target}', 'B'), JSON.stringify(q2));
		await press(await L('lpn_dialog_ok'));
		await flush();
		sv = await saved();
		ok('M6 ...B holds 20 for pipe 10', vals(sv, 'a2')['l:10'].diameter === 20 && !vals(sv, 'a3'), JSON.stringify(vals(sv, 'a2')));
		await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
		await page.keyboard.press('Control+z');
		await flush();
		await clickRow('C');
		await click('#lpn_sm_merge');
		await press(await L('lpn_scenario_base'));
		await press(await L('lpn_dialog_ok'));
		await flush();
		sv = await saved();
		ok('M6 into Base: the drawing takes pipe 10\'s diameter and junction 22\'s elevation', byId(sv.links, '10')._diameter === 20 && byId(sv.nodes, '22').elev === 900,
			JSON.stringify([byId(sv.links, '10')._diameter, byId(sv.nodes, '22').elev]));
		ok('M6 ...B keeps its own 16', vals(sv, 'a2')['l:10'].diameter === 16);

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
