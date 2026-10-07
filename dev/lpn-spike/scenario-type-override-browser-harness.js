// CHANGE TYPE IN A SCENARIO, CLICKED IN A REAL CHROMIUM. Run with:
//   node dev/lpn-spike/scenario-type-override-browser-harness.js
//
// Tom, 2026-10-07 (6a): *"if Change type is used, with other than Base scenario, put up an alert
// box. 'Current scenario is not Base. Create overrides? [Create overrides] [Switch to Base]
// [Cancel]'"*. The hydraulics, the file, undo and the export are held headless by
// scenario-type-override-harness.js; this holds the real rows and the real buttons, on Net1:
//   1. In scenario B, Water > Change type > Tank on junction 22 asks Tom's sentence with his three
//      buttons, in the page's own box (never window.confirm).
//   2. Cancel changes nothing.
//   3. Create overrides: 22 is drawn as a tank in B, is a row of the Tanks table and not of
//      Junctions, and Properties shows a tank's fields; in Base it is a junction everywhere.
//   4. Switch to Base: Base is showing, and the ordinary Base change (its own box) follows.
// Every button is pressed with a MouseEvent of detail 1, as a person's click is.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_STO_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_STO_LOCKED: '1' }) });
		if (r.status === 75) { console.error('scenario-type-override-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = (k) => a.lang(k);
		const settle = (ms) => a.settle(ms);
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net1_title'));
		await settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
			}
			await settle(1200);
		};
		const nodeClass = (id) => page.evaluate((id) => {
			const c = document.querySelector('circle.lpn-node[data-node="' + id + '"]');
			return c ? c.getAttribute('class') : null;
		}, id);
		// A real click on the node's own hit target selects it.
		const clickNode = async (id) => {
			await page.keyboard.press('Escape');
			const r = await page.evaluate((id) => {
				const c = document.querySelector('.lpn-node-hit[data-node="' + id + '"]');
				if (!c) { return null; }
				const b = c.getBoundingClientRect();
				return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
			}, id);
			if (!r) { return false; }
			await page.mouse.click(r.x, r.y);
			await settle(500);
			return true;
		};
		const changeTo = async (typeKey) => a.menuClickSub(await L('lpn_change_type_menu'), await L(typeKey), 'project');
		const press = async (label) => {
			const hit = await page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
				return !!b;
			}, label);
			await settle(900);
			return hit;
		};
		const tableIds = async (tab) => {
			await page.click('#lpn_pane_tab_' + tab);
			await settle(600);
			return page.evaluate((tab) => Array.from(document.querySelectorAll('#lpn_pane_' + tab + ' tbody tr'))
				.map((tr) => { const td = tr.querySelector('td'); return td ? (td._lpnPaneId !== undefined ? String(td._lpnPaneId) : td.textContent.trim()) : ''; }), tab);
		};

		console.log('--- 1. the question, in scenario B ---');
		a.answerPromptWith('B');
		await scenarioMenu(await L('lpn_scenario_new'));
		// From here every question is answered by a click in the page's own box, not the native seam.
		await page.evaluate(() => { delete window.lpnDialogAnswerer; });
		ok('1.0 node 22 is a junction to start with', /lpn-node-junction/.test(await nodeClass('22') || ''), await nodeClass('22'));
		ok('1.1 a click selects junction 22', await clickNode('22'));
		await changeTo('lpn_tool_add_tank');
		await settle(800);
		const d = await a.dialog();
		ok('1.2 the page\'s own box asks Tom\'s sentence', d && d.text.trim() === 'Current scenario is not Base. Create overrides?', d && d.text);
		ok('1.3 ...with exactly his three buttons, in his order', d && JSON.stringify(d.buttons) === JSON.stringify(['Create overrides', 'Switch to Base', await L('lpn_cancel')]),
			d && JSON.stringify(d.buttons));

		console.log('\n--- 2. Cancel ---');
		ok('2.1 Cancel is pressed', await press(await L('lpn_cancel')));
		ok('2.2 the box is gone and 22 is still a junction', !(await a.dialog()) && /lpn-node-junction/.test(await nodeClass('22') || ''));

		console.log('\n--- 3. Create overrides ---');
		await clickNode('22');
		await changeTo('lpn_tool_add_tank');
		ok('3.1 Create overrides is pressed', await press('Create overrides'));
		ok('3.2 no second box (a junction made a tank loses nothing in B)', !(await a.dialog()), JSON.stringify(await a.dialog()));
		ok('3.3 22 is drawn as a tank in B', /lpn-node-tank/.test(await nodeClass('22') || ''), await nodeClass('22'));
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(600);
		const tanksB = await tableIds('tanks'), juncsB = await tableIds('junctions');
		ok('3.4 B\'s Tanks table has a row for 22', tanksB.indexOf('22') >= 0, JSON.stringify(tanksB));
		ok('3.5 ...and its Junctions table does not', juncsB.indexOf('22') < 0, JSON.stringify(juncsB));
		await clickNode('22');
		const popup = await page.evaluate(() => { const p = document.getElementById('lpn_popup'); return p && p.style.display !== 'none' ? p.textContent : ''; });
		ok('3.6 Properties shows a tank\'s fields for 22', popup.indexOf(await L('lpn_field_tank_maxlevel')) >= 0, popup.slice(0, 160));
		await scenarioMenu(await L('lpn_scenario_base'));
		ok('3.7 in Base 22 is drawn as a junction', /lpn-node-junction/.test(await nodeClass('22') || ''), await nodeClass('22'));
		const juncsBase = await tableIds('junctions');
		ok('3.8 ...and is a row of Base\'s Junctions table', juncsBase.indexOf('22') >= 0, JSON.stringify(juncsBase));

		console.log('\n--- 4. Switch to Base ---');
		await a.toolbarClick(await L('lpn_pane_toggle'));   // the bottom panel off the map again
		await page.evaluate(() => { const x = document.querySelector('#lpn_popup .lpn-popover-x'); if (x) { x.click(); } });
		await settle(500);
		await scenarioMenu('B');
		ok('4.0 a click selects junction 23', await clickNode('23') && await page.evaluate(() => !!document.querySelector('circle.lpn-node.lpn-selected[data-node="23"]')));
		await changeTo('lpn_tool_add_tank');
		ok('4.1 Switch to Base is pressed', await press('Switch to Base'));
		const d2 = await a.dialog();
		const btn = await page.evaluate(() => (document.getElementById('lpn_scenario_btn') || {}).textContent || '');
		ok('4.2 Base is showing', btn.indexOf(': ' + await L('lpn_scenario_base') + ' ') >= 0, btn);
		ok('4.3 ...and the ordinary Base box follows (junction 23\'s demand would be lost)', d2 && d2.text.indexOf(await L('lpn_change_type_lost')) >= 0 &&
			JSON.stringify(d2.buttons) === JSON.stringify([await L('lpn_change_type_ok'), await L('lpn_cancel')]), d2 && JSON.stringify(d2));
		await press(await L('lpn_change_type_ok'));
		ok('4.4 Change: 23 is a tank in Base', /lpn-node-tank/.test(await nodeClass('23') || ''), await nodeClass('23'));
		await scenarioMenu('B');
		ok('4.5 ...and in B, which states no type of its own for it', /lpn-node-tank/.test(await nodeClass('23') || ''), await nodeClass('23'));
		ok('4.6 ...while 22 is still B\'s tank', /lpn-node-tank/.test(await nodeClass('22') || ''));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
