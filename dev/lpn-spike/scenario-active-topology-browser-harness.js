// ACTIVE TOPOLOGY AND CHANGE TYPE IN A SCENARIO, CLICKED IN A REAL CHROMIUM (Task 781). Run with:
//   node dev/lpn-spike/scenario-active-topology-browser-harness.js
//
// The hydraulics, the file, undo, inheritance and the export are held headless by
// scenario-active-topology-harness.js; this holds the real rows and buttons, on Net1:
//   1. In scenario B, Water > Change type > Tank on junction 22 asks the scope question with its
//      three buttons in the page's own box; Cancel changes nothing.
//   2. Create new assets, then Change on the box that lists the demand a tank cannot hold: a new
//      tank is drawn and selected, 22 and its four pipes are drawn greyed.
//   3. The Junctions and Pipes tables leave the inactive assets out; the cell menu's Include
//      inactive topology brings them back, and the heading menu offers it too.
//   4. With inactive topology included, row 22's Is active? box is cleared; selecting it makes 22
//      active in B; Ctrl+Z undoes. (The tank stands on 22, so the map's click selects the tank.)
//   5. Base: 22 is a junction and active, the tank greyed; Ctrl+Z undoes the replacement.
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
if (process.env.EC_SAT_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SAT_LOCKED: '1' }) });
		if (r.status === 75) { console.error('scenario-active-topology-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
		const linkClass = (id) => page.evaluate((id) => {
			const c = document.querySelector('.lpn-link[data-link="' + id + '"]');
			return c ? c.getAttribute('class') : null;
		}, id);
		const selectedNode = () => page.evaluate(() => {
			const c = document.querySelector('circle.lpn-node.lpn-selected');
			return c ? c.getAttribute('data-node') : null;
		});
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
		const cellMenu = async (id) => {
			await page.click('#lpn_pane_' + id + ' tbody td:nth-child(2)', { button: 'right' });
			await settle(300);
			return page.evaluate(() => Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).map((e) => e.textContent.trim()));
		};
		const headMenu = async (id) => {
			await page.click('#lpn_pane_' + id + ' thead th:nth-child(2)', { button: 'right' });
			await settle(300);
			return page.evaluate(() => Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).map((e) => e.textContent.trim()));
		};
		const menuPick = async (label) => {
			const hit = await page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).filter((e) => e.textContent.trim().replace(/^✓\s*/, '') === t)[0];
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
				return !!b;
			}, label);
			await settle(900);
			return hit;
		};
		const ACTIVE = await L('lpn_field_active');

		console.log('--- 1. the question, in scenario B ---');
		a.answerPromptWith('B');
		await scenarioMenu(await L('lpn_scenario_new'));
		await page.evaluate(() => { delete window.lpnDialogAnswerer; });
		ok('1.1 a click selects junction 22', await clickNode('22') && await selectedNode() === '22');
		await changeTo('lpn_tool_add_tank');
		await settle(800);
		const d = await a.dialog();
		ok('1.2 the page\'s own box asks the scope question', d && d.text.trim() === await L('lpn_change_type_scenario_ask'), d && d.text);
		ok('1.3 ...with three buttons: Create new assets, Switch to Base, Cancel',
			d && JSON.stringify(d.buttons) === JSON.stringify([await L('lpn_change_type_create_new'), await L('lpn_change_type_switch_base'), await L('lpn_cancel')]),
			d && JSON.stringify(d.buttons));
		ok('1.4 Cancel is pressed', await press(await L('lpn_cancel')));
		ok('1.5 the box is gone and 22 is still an active junction', !(await a.dialog()) && /lpn-node-junction/.test(await nodeClass('22') || '') &&
			!/lpn-inactive/.test(await nodeClass('22') || ''));

		console.log('\n--- 2. Create new assets ---');
		await clickNode('22');
		await changeTo('lpn_tool_add_tank');
		ok('2.1 Create new assets is pressed', await press(await L('lpn_change_type_create_new')));
		const d2 = await a.dialog();
		ok('2.2 the box lists what the tank cannot hold, kept by the old asset', d2 && d2.text.indexOf(await L('lpn_change_type_not_carried')) >= 0, d2 && d2.text);
		ok('2.3 Change is pressed', await press(await L('lpn_change_type_ok')));
		await settle(1200);
		const T = await selectedNode();
		ok('2.4 a new tank is selected, under a new ID', !!T && T !== '22' && /lpn-node-tank/.test(await nodeClass(T) || ''), T + ' ' + await nodeClass(T));
		ok('2.5 22 is drawn greyed', /lpn-inactive/.test(await nodeClass('22') || ''), await nodeClass('22'));
		ok('2.6 ...and so are its four pipes', (await Promise.all(['21', '22', '112', '122'].map(linkClass))).every((c) => /lpn-inactive/.test(c || '')));

		console.log('\n--- 3. the tables leave inactive assets out ---');
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(600);
		let juncs = await tableIds('junctions');
		ok('3.1 the Junctions table has no row for 22', juncs.length > 0 && juncs.indexOf('22') < 0, JSON.stringify(juncs));
		const tanks = await tableIds('tanks');
		ok('3.2 the Tanks table has the new tank', tanks.indexOf(T) >= 0, JSON.stringify(tanks));
		const pipes = await tableIds('pipes');
		ok('3.3 the Pipes table has none of 22\'s old pipes, and four new ones', ['21', '22', '112', '122'].every((p) => pipes.indexOf(p) < 0) && pipes.length === 12, JSON.stringify(pipes));
		await tableIds('junctions');
		const m = await cellMenu('junctions');
		ok('3.4 the cell menu offers Include inactive topology', m.indexOf(await L('lpn_pane_inactive_show')) >= 0, JSON.stringify(m));
		await menuPick(await L('lpn_pane_inactive_show'));
		juncs = await tableIds('junctions');
		ok('3.5 picked: 22 is a row again', juncs.indexOf('22') >= 0, JSON.stringify(juncs));
		const hm = await headMenu('junctions');
		ok('3.6 the heading menu offers it, ticked', hm.indexOf('✓ ' + await L('lpn_pane_inactive_show')) >= 0, JSON.stringify(hm));
		await menuPick(await L('lpn_pane_inactive_show'));
		juncs = await tableIds('junctions');
		ok('3.7 picked again: 22 is left out', juncs.indexOf('22') < 0);

		console.log('\n--- 4. ' + ACTIVE + ' in the Junctions table, with inactive topology included ---');
		// The new tank stands exactly where 22 stood, so a click on the map selects the tank; 22 is
		// reached by its row.
		await tableIds('junctions');
		await cellMenu('junctions');
		await menuPick(await L('lpn_pane_inactive_show'));
		const boxOf = (id) => page.evaluate((id) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_junctions td.lpn-pane-col-active')).filter((t) => String(t._lpnPaneId) === id)[0];
			const i = td && td.querySelector('input[type=checkbox]');
			return i ? i.checked : null;
		}, id);
		ok('4.1 row 22 shows ' + ACTIVE + ' cleared', await boxOf('22') === false, String(await boxOf('22')));
		await page.evaluate(() => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_junctions td.lpn-pane-col-active')).filter((t) => String(t._lpnPaneId) === '22')[0];
			td.querySelector('input[type=checkbox]').click();
		});
		await settle(1200);
		ok('4.2 selected: 22 is active in B and no longer greyed', !/lpn-inactive/.test(await nodeClass('22') || '') && await boxOf('22') === true, await nodeClass('22'));
		await page.mouse.click(800, 300);
		await page.keyboard.press('Escape');
		await page.keyboard.press('Control+z');
		await settle(1200);
		ok('4.3 Ctrl+Z: 22 is inactive in B again', /lpn-inactive/.test(await nodeClass('22') || ''), await nodeClass('22'));
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(400);

		console.log('\n--- 5. Base, and undoing the replacement ---');
		await scenarioMenu(await L('lpn_scenario_base'));
		ok('5.1 in Base 22 is an active junction and the tank is greyed', /lpn-node-junction/.test(await nodeClass('22') || '') &&
			!/lpn-inactive/.test(await nodeClass('22') || '') && /lpn-inactive/.test(await nodeClass(T) || ''), await nodeClass(T));
		await scenarioMenu('B');
		await page.keyboard.press('Control+z');
		await settle(1500);
		ok('5.2 Ctrl+Z in B: the tank is gone and 22 is active again', (await nodeClass(T)) === null && !/lpn-inactive/.test(await nodeClass('22') || ''),
			String(await nodeClass(T)));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
