// MORPH IN A SCENARIO, CLICKED IN A REAL CHROMIUM (Task 781). Run with:
//   node dev/lpn-spike/morph-browser-harness.js
//
// Tom's case, 2026-10-14: *"I would like to create a scenario called 'Tank at J1' and change the J1
// junction to a tank in that scenario without having to delete and reconstitute the pipes
// connecting to it."* On Net1, junction 22 standing in for J1:
//   1. Scenarios > New "Tank at J1"; a click selects 22; Water > Morph > Tank. No box; 22 is drawn
//      as a tank, with its four pipes; the page's own solve puts 22's head at its water surface.
//   2. Properties shows the Type row, Tank, marked as an override, and the tank's rows.
//   3. The Tables: 22 is in Tanks, not in Junctions.
//   4. Scenarios > Base: 22 is a junction, solving to Base's head as before.
//   5. Back in the scenario, Ctrl+Z undoes the morph; Ctrl+Y brings it back.
//   6. The Type row's dot clears the override: 22 is a junction in the scenario.
//   7. The same Morph on the Spanish page, read from the language file.
// Every button is pressed with a MouseEvent of detail 1, as a person's click is. The hydraulics in
// both engines, the export, the file, inheritance and the link half are held headless by
// dev/lpn-spike/morph-harness.js.
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
		if (r.status === 75) { console.error('morph-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const FT = 0.3048;

async function session(browser, name, url, errors) {
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const a = await Session.open(browser, name);
	const page = a.page;
	page.on('pageerror', (e) => errors.push(String(e && e.message)));
	await page.setViewportSize({ width: 1600, height: 1000 });
	await a.goto(url);
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.settle(1500);
	await page.evaluate(() => {
		let e = document.querySelector('.ec-consent-actions');
		while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
		if (e) { e.style.display = 'none'; }
	});
	const L = (k) => a.lang(k);
	const h = {
		a, page, L,
		scenarioMenu: async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
			}
			await a.settle(1200);
		},
		nodeClass: (id) => page.evaluate((id) => {
			const c = document.querySelector('circle.lpn-node[data-node="' + id + '"]');
			return c ? c.getAttribute('class') : null;
		}, id),
		clickNode: async (id) => {
			await page.keyboard.press('Escape');
			const r = await page.evaluate((id) => {
				const c = document.querySelector('.lpn-node-hit[data-node="' + id + '"]');
				if (!c) { return null; }
				const b = c.getBoundingClientRect();
				return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
			}, id);
			if (!r) { return false; }
			await page.mouse.click(r.x, r.y);
			await a.settle(500);
			return true;
		},
		selectedNode: () => page.evaluate(() => {
			const c = document.querySelector('circle.lpn-node.lpn-selected');
			return c ? c.getAttribute('data-node') : null;
		}),
		morphTo: async (typeKey) => a.menuClickSub(await L('lpn_morph_menu'), await L(typeKey), 'project'),
		// The page's own next solve: its head at a node, in metres (the solver's unit).
		headAfterSolve: async (id) => {
			await a.waitFor(() => page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__snapPrev && r.heads); }), 'a solve', 60000);
			return page.evaluate((id) => { const r = EngCalcs.lpnSolveProbe(); return r && r.heads ? r.heads[id] : null; }, id);
		},
		markSolve: () => page.evaluate(() => { window.__snapPrev = EngCalcs.lpnSolveProbe(); })
	};
	return h;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const s = await session(browser, 'A', 'Looped-Network.php', errors);
		const { a, page, L } = s;
		const base22 = await s.headAfterSolve('22').catch(() => null) || await page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return r && r.heads ? r.heads['22'] : null; });
		ok('0.1 Net1 solved: 22 has a head', typeof base22 === 'number' && isFinite(base22), String(base22));

		console.log('--- 1. "Tank at J1": Morph 22 into a tank ---');
		a.answerPromptWith('Tank at J1');
		await s.scenarioMenu(await L('lpn_scenario_new'));
		ok('1.1 a click selects junction 22', await s.clickNode('22') && await s.selectedNode() === '22');
		await s.markSolve();
		await s.morphTo('lpn_tool_add_tank');
		await a.settle(800);
		ok('1.2 no box opens', !(await a.dialog()));
		ok('1.3 22 is drawn as a tank', /lpn-node-tank/.test(await s.nodeClass('22') || ''), await s.nodeClass('22'));
		ok('1.4 its four pipes are still drawn to it', await page.evaluate(() => ['21', '22', '112', '122'].every((id) => !!document.querySelector('.lpn-link[data-link="' + id + '"]'))));
		const tank22 = await s.headAfterSolve('22');
		ok('1.5 the page\'s solve puts 22 at its water surface, 695 ft + the New assets depth, not Base\'s head',
			typeof tank22 === 'number' && Math.abs(tank22 - base22) > FT && Math.abs(tank22 / FT - 695 - Math.round(tank22 / FT - 695)) < 1e-6, tank22 / FT + ' ft vs ' + base22 / FT);

		console.log('\n--- 2. Properties ---');
		await s.clickNode('22');
		const props = await page.evaluate((t) => {
			const labels = Array.from(document.querySelectorAll('#lpn_popup_fields label'));
			const row = labels.filter((l) => l.textContent.trim().indexOf(t) === 0)[0];
			const g = row && row.previousElementSibling;
			return { rows: labels.map((l) => l.textContent.trim().slice(0, 24)), type: row ? row.textContent : null,
				dot: !!(g && g.classList.contains('lpn-ovm') && g.querySelector('.lpn-ovm-dot')) };
		}, await L('lpn_field_type'));
		ok('2.1 a Type row says Tank', props.type !== null && props.type.indexOf(await L('lpn_tool_add_tank')) >= 0, props.type);
		ok('2.2 ...marked as an override in this scenario', props.dot);
		const tankDia = await L('lpn_field_tank_diameter');
		ok('2.3 the tank\'s own rows are shown (Tank diameter)', props.rows.some((r) => r.indexOf(tankDia.slice(0, 20)) === 0), JSON.stringify(props.rows));

		console.log('\n--- 3. the Tables ---');
		const tableIds = async (tab) => {
			await page.click('#lpn_pane_tab_' + tab);
			await a.settle(600);
			return page.evaluate((tab) => Array.from(document.querySelectorAll('#lpn_pane_' + tab + ' tbody tr'))
				.map((tr) => { const td = tr.querySelector('td'); return td ? (td._lpnPaneId !== undefined ? String(td._lpnPaneId) : td.textContent.trim()) : ''; }), tab);
		};
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(600);
		const tanks = await tableIds('tanks');
		const juncs = await tableIds('junctions');
		ok('3.1 22 is a row of Tanks, beside tank 2', tanks.indexOf('22') >= 0 && tanks.indexOf('2') >= 0, JSON.stringify(tanks));
		ok('3.2 ...and not of Junctions', juncs.indexOf('22') < 0 && juncs.length === 8, JSON.stringify(juncs));
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(400);

		console.log('\n--- 4. Base ---');
		await s.markSolve();
		await s.scenarioMenu(await L('lpn_scenario_base'));
		ok('4.1 in Base 22 is a junction', /lpn-node-junction/.test(await s.nodeClass('22') || ''), await s.nodeClass('22'));
		const b4 = await s.headAfterSolve('22');
		ok('4.2 ...solving to Base\'s head as before', Math.abs(b4 - base22) < 1e-6, b4 + ' vs ' + base22);
		await s.scenarioMenu('Tank at J1');
		ok('4.3 back in Tank at J1, 22 is a tank', /lpn-node-tank/.test(await s.nodeClass('22') || ''));

		console.log('\n--- 5. undo and redo ---');
		await page.keyboard.press('Escape');
		await page.keyboard.press('Control+z');
		await a.settle(1200);
		ok('5.1 Ctrl+Z: 22 a junction in the scenario', /lpn-node-junction/.test(await s.nodeClass('22') || ''), await s.nodeClass('22'));
		await page.keyboard.press('Control+y');
		await a.settle(1200);
		ok('5.2 Ctrl+Y: a tank again', /lpn-node-tank/.test(await s.nodeClass('22') || ''), await s.nodeClass('22'));

		console.log('\n--- 6. the Type row\'s dot clears the morph ---');
		await s.clickNode('22');
		const hit = await page.evaluate((t) => {
			const row = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((l) => l.textContent.trim().indexOf(t) === 0)[0];
			const dot = row && row.previousElementSibling && row.previousElementSibling.querySelector('.lpn-ovm-dot');
			if (dot) { dot.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return !!dot;
		}, await L('lpn_field_type'));
		await a.settle(1200);
		ok('6.1 the dot is clicked: 22 is a junction in the scenario, with no override left on it',
			hit && /lpn-node-junction/.test(await s.nodeClass('22') || '') && !/lpn-override/.test(await s.nodeClass('22') || ''), await s.nodeClass('22'));
		const after = await page.evaluate((t) => Array.from(document.querySelectorAll('#lpn_popup_fields label')).some((l) => l.textContent.trim().indexOf(t) === 0), await L('lpn_field_type'));
		ok('6.2 ...and Properties has no Type row', !after);
		await page.keyboard.press('Escape');
		await page.keyboard.press('Control+z');
		await a.settle(1200);
		ok('6.3 Ctrl+Z: the tank again', /lpn-node-tank/.test(await s.nodeClass('22') || ''), await s.nodeClass('22'));
		await s.a.context.close();

		console.log('\n--- 7. the Spanish page ---');
		const es = await session(browser, 'B', 'Looped-Network.php?lang=es', errors);
		ok('7.0 the page is Spanish', await es.page.evaluate(() => document.documentElement.lang) === 'es');
		es.a.answerPromptWith('Tanque en J1');
		await es.scenarioMenu(await es.L('lpn_scenario_new'));
		ok('7.1 a click selects junction 22', await es.clickNode('22') && await es.selectedNode() === '22');
		await es.morphTo('lpn_tool_add_tank');
		await es.a.settle(800);
		ok('7.2 Morph > Tank, in Spanish: 22 is a tank in the scenario', /lpn-node-tank/.test(await es.nodeClass('22') || ''), await es.nodeClass('22'));
		await es.scenarioMenu(await es.L('lpn_scenario_base'));
		ok('7.3 ...and a junction in Base', /lpn-node-junction/.test(await es.nodeClass('22') || ''));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
