// **TOM'S BROWSER PASS OF 2026-10-14 ON SCENARIOS**, in a real Chromium, most of it on his own test
// project (dev/lpn-spike/fixtures/Fotobi_US_WGS84.epp), through the menus, table cells and Scenario
// manager keys his clicks reach:
//   R8  "Tanks show amber circle on map, but has overrides only in parent, not here.": in EPS Pump off
//       the tanks' levels come from EPS's Initial alternative (its own, a13, is a child of a12), so
//       they wear the inherited ring, never the amber of an override made here; in EPS they are amber;
//   B1  "when I first change the Calculation alternative for a scenario to Base the selector goes
//       blank": a child of Base holding its own calculation values picks Base, and the select shows it;
//   I2  the child icon in the Scenario manager only on an item that has children, leaves keeping its width;
//   D4  deleting an alternative in use: the alternative, then the phrase, then each user, a line each;
//   O6  the scenario menu (the Water menu's Scenarios submenu is the same rows) and the Scenarios
//       table list scenarios in the Scenario manager's tree order;
//   P3  "Is it universal and absolute that Base scenario must have only base alternatives?": with
//       Basic mode off Base picks EPS's Initial alternative in its own row, shows its tank levels,
//       and a level typed in Base goes into that alternative; blank gives Base its own again.
// Wording is read from the page's own language strings, never written here.
//
//   node dev/lpn-spike/scenario-pass-1014-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNPASS1014_LOCKED';
const NAME = 'scenario-pass-1014-browser-harness';
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
const FOTOBI = path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'Fotobi_US_WGS84.epp');
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
		const openProject = async (d) => {
			if (a) { await a.context.close(); }
			a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
			page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, JSON.stringify(d));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await page.setViewportSize({ width: 1600, height: 1000 });
			await a.settle(2500);
		};
		const fotobi = () => JSON.parse(fs.readFileSync(FOTOBI, 'utf8'));
		const L = (k) => a.lang(k);
		const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')));
		const flush = async () => { await a.settle(2600); };
		const menuNames = async () => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (bs) => bs.map((b) => b.textContent.trim()));
			await page.keyboard.press('Escape');
			await a.settle(300);
			return rows;
		};
		const scenarioMenu = async (label) => {
			await require('./manager-door.js').ensure(page, label);
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			let hit = false;
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '');
				if (t === label.trim()) { await r.click(); hit = true; break; }
			}
			if (!hit) { await page.keyboard.press('Escape'); }
			await a.settle(1500);
			return hit;
		};
		const pane = async () => {
			if (!(await page.evaluate(() => { const p = document.getElementById('lpn_pane_tab_junctions'); return !!p && !!p.offsetParent; }))) {
				await a.toolbarClick(await L('lpn_pane_toggle'));
				await a.settle(600);
			}
		};
		const tab = async (id) => { await page.click('#lpn_pane_tab_' + id); await a.settle(800); };
		const ring = (id) => page.evaluate((i) => {
			const c = document.querySelector('#lpn_canvas .lpn-node[data-node="' + i + '"]');
			if (!c) { return null; }
			const t = Array.from(c.childNodes).filter((n) => n.nodeName === 'title')[0];
			return { amber: c.classList.contains('lpn-override'), inh: c.classList.contains('lpn-override-inh'), tip: t ? t.textContent : null, stroke: getComputedStyle(c).stroke };
		}, id);
		const scnCell = (name, cat) => page.evaluate(([n, c]) => {
			const tr = Array.from(document.querySelectorAll('#lpn_pane_scenarios tbody tr')).filter((r) => r.querySelector('td').textContent.trim() === n)[0];
			const th = Array.from(document.querySelectorAll('#lpn_pane_scenarios thead th')), i = th.findIndex((t) => t._lpnColKey === 'sc_' + c);
			const td = tr ? tr.children[i] : null, s = td ? td.querySelector('select') : null;
			return s ? { value: s.value, idx: s.selectedIndex, shown: s.selectedIndex >= 0 ? s.options[s.selectedIndex].text : null,
				options: Array.from(s.options).map((o) => o.value + '=' + o.text) } : (td ? { text: td.textContent.trim() } : null);
		}, [name, cat]);
		// A person's pick: a real click on the box, then the option by its label.
		const pick = async (name, cat, label) => {
			const h = (await page.evaluateHandle(([n, c]) => {
				const tr = Array.from(document.querySelectorAll('#lpn_pane_scenarios tbody tr')).filter((r) => r.querySelector('td').textContent.trim() === n)[0];
				const th = Array.from(document.querySelectorAll('#lpn_pane_scenarios thead th')), i = th.findIndex((t) => t._lpnColKey === 'sc_' + c);
				return tr ? tr.children[i].querySelector('select') : null;
			}, [name, cat])).asElement();
			if (!h) { return false; }
			await h.scrollIntoViewIfNeeded();
			await h.click();
			await a.settle(200);
			await h.selectOption({ label });
			await a.settle(1500);
			return true;
		};
		const cell = (kind, id, key) => page.evaluate(([k, i, c]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-' + c)).filter((t) => t._lpnPaneId === i)[0];
			if (!td) { return null; }
			const inp = td.querySelector('input,select');
			return inp ? inp.value : td.textContent.trim();
		}, [kind, id, key]);
		const typeInto = async (kind, id, key, text) => {
			const h = await page.evaluateHandle(([s, i]) => Array.from(document.querySelectorAll(s)).filter((t) => t._lpnPaneId === i)[0],
				['#lpn_pane_' + kind + ' td.lpn-pane-col-' + key, id]);
			const inp = await h.asElement().$('input');
			await inp.click();
			await page.keyboard.press('Control+A');
			await page.keyboard.type(text, { delay: 10 });
			await page.keyboard.press('Tab');
			await a.settle(900);
		};
		const smRows = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).map((r) => {
			const ic = r.querySelector('.lpn-sm-icon'), nm = r.querySelector('.lpn-sm-name');
			return { name: nm.textContent, level: +r.getAttribute('aria-level'), icon: ic.className.replace('lpn-sm-icon ', ''),
				iconW: ic.getBoundingClientRect().width, nameX: nm.getBoundingClientRect().left - r.getBoundingClientRect().left };
		}));
		const smRow = async (name) => {
			await page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name + '$') }) }).first().locator('.lpn-sm-name').click();
			await a.settle(300);
		};
		const strip = (t) => t.replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '');

		// ---- R8 ----
		console.log('--- R8. Inherited tank levels wear the inherited ring, not the amber ---');
		await openProject(fotobi());
		await scenarioMenu('EPS Pump off');
		const INH = (await L('lpn_scenario_mark_inh_tip')).replace('{name}', 'EPS Pump off');
		for (const t of ['T-NW', 'T-NE']) {
			const r = await ring(t);
			ok('R8 EPS Pump off: tank ' + t + ' (level only in its parent alternative EPS) wears no amber, but the inherited ring and its tip',
				!!r && !r.amber && r.inh && r.tip === INH, JSON.stringify(r));
		}
		await scenarioMenu('EPS');
		const AMB = (await L('lpn_scenario_mark_tip')).replace('{name}', 'EPS');
		for (const t of ['T-NW', 'T-NE']) {
			const r = await ring(t);
			ok('R8 EPS: tank ' + t + ' (its level an override in EPS\'s own Initial alternative) wears the amber ring', !!r && r.amber && !r.inh && r.tip === AMB, JSON.stringify(r));
		}
		const rgb = (s) => (s || '').replace(/\s/g, '');
		const amberStroke = (await ring('T-NW')).stroke;
		await scenarioMenu('EPS Pump off');
		ok('R8 ...and the two rings are drawn in different colours', rgb((await ring('T-NW')).stroke) !== rgb(amberStroke), amberStroke + ' / ' + (await ring('T-NW')).stroke);
		await scenarioMenu(await L('lpn_scenario_base'));
		ok('R8 Base: no ring at all on the tanks', !(await ring('T-NW')).amber && !(await ring('T-NW')).inh);

		// ---- O6 ----
		console.log('\n--- O6. Every scenario list follows the Scenario manager\'s tree ---');
		await scenarioMenu(await L('lpn_sm_menu'));
		await page.selectOption('#lpn_sm_tree_select', 'scenarios');
		await a.settle(500);
		const treeNames = (await smRows()).map((r) => r.name);
		const all = await menuNames();
		const BASEW = await L('lpn_scenario_base');
		const listed = all.map(strip).filter((t) => treeNames.indexOf(t) >= 0);
		ok('O6 the scenario menu lists every scenario in the manager\'s tree order (depth first)', JSON.stringify(listed) === JSON.stringify(treeNames), JSON.stringify(listed));
		ok('O6 ...EPS is followed by its child EPS Pump off and then that one\'s four children, and only then by EPS\'s siblings',
			treeNames.indexOf('EPS Pump off') === treeNames.indexOf('EPS') + 1 && treeNames.indexOf('1-hr drain w pump off') === treeNames.indexOf('EPS Pump off') + 1 &&
			treeNames.indexOf('16-hr drain w pump off') === treeNames.indexOf('EPS Pump off') + 4 && treeNames.indexOf('No wells') > treeNames.indexOf('16-hr drain w pump off'), JSON.stringify(treeNames));
		// ---- I2 ----
		console.log('\n--- I2. The child icon only where there are children ---');
		const rows = await smRows();
		const byName = (n) => rows.filter((r) => r.name === n)[0];
		ok('I2 Base keeps its own icon; EPS and EPS Pump off (parents) the child icon; a leaf none',
			byName(BASEW).icon === 'lpn-sm-icon-scnbase' && byName('EPS').icon === 'lpn-sm-icon-scn' && byName('EPS Pump off').icon === 'lpn-sm-icon-scn' &&
			byName('1-hr drain w pump off').icon === 'lpn-sm-icon-none' && byName('No wells').icon === 'lpn-sm-icon-none', JSON.stringify(rows.map((r) => [r.name, r.icon])));
		ok('I2 ...a leaf keeps the icon\'s width, so No wells (a leaf) and EPS (a parent) start their names at one x', byName('No wells').iconW === byName('EPS').iconW &&
			Math.abs(byName('No wells').nameX - byName('EPS').nameX) < 0.5, JSON.stringify([byName('No wells'), byName('EPS')]));

		await page.click('#lpn_sm_close');
		await a.settle(400);
		await pane();
		await tab('scenarios');
		const tableNames = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_scenarios tbody tr')).map((tr) => tr.querySelector('td').textContent.trim()));
		ok('O6 the Scenarios table lists them in the same order', JSON.stringify(tableNames) === JSON.stringify(treeNames), JSON.stringify(tableNames));
		ok('O6 ...Base first', treeNames[0] === BASEW);

		await scenarioMenu(await L('lpn_sm_menu'));
		await a.settle(400);

		// ---- D4 ----
		console.log('\n--- D4. Delete an alternative in use: three parts, a line each ---');
		await page.selectOption('#lpn_sm_tree_select', 'initial');
		await a.settle(500);
		await smRow('EPS');
		a.dialogs.length = 0;
		await page.keyboard.press('Delete');
		await flush();
		const said = ((a.dialogs.filter((x) => x.type === 'alert')[0]) || {}).message || '';
		const lines = said.split('\n'), phrase = (await L('lpn_sm_in_use')).split('\\n')[1];
		ok('D4 line 1 is "Alternative EPS" alone, line 2 the phrase alone, then each user', lines[0] === (await L('lpn_sm_item_alternative')).replace('{name}', 'EPS') &&
			lines[1] === phrase && lines.slice(2).indexOf((await L('lpn_sm_item_scenario')).replace('{name}', 'EPS')) >= 0 &&
			lines.slice(2).indexOf((await L('lpn_sm_item_alternative')).replace('{name}', 'EPS Pump off')) >= 0, JSON.stringify(said));
		ok('D4 ...and it is not deleted', (await saved()).alternatives.some((x) => x.id === 'a12'));

		// ---- P3 ----
		console.log('\n--- P3. Base picks an alternative, with Basic mode off ---');
		await page.click('#lpn_sm_close');
		await a.settle(400);
		await pane();
		await scenarioMenu(BASEW);
		await tab('tanks');
		const lvl0 = await cell('tanks', 'T-NW', 'level');
		await tab('scenarios');
		const bc0 = await scnCell(BASEW, 'initial');
		ok('P3 Base\'s Initial cell is a pick-list showing Base', !!bc0 && bc0.value === '' && bc0.shown === BASEW, JSON.stringify(bc0));
		ok('P3 Base picks EPS in its own row', await pick(BASEW, 'initial', 'EPS'));
		let sv = await saved();
		const bc1 = await scnCell(BASEW, 'initial');
		ok('P3 ...the cell shows EPS and the file says Base uses a12', bc1 && bc1.shown === 'EPS' && sv.scenarios[0].alternatives && sv.scenarios[0].alternatives.initial === 'a12', JSON.stringify([bc1, sv.scenarios[0]]));
		await tab('tanks');
		const lvl1 = await cell('tanks', 'T-NW', 'level');
		ok('P3 ...Base now shows EPS\'s tank level (23), the element\'s own (15.01) untouched', parseFloat(lvl1) === 23 && parseFloat(lvl0) === 15.01 &&
			sv.nodes.filter((n) => n.id === 'T-NW')[0]._level === 15.01, lvl0 + ' -> ' + lvl1);
		await typeInto('tanks', 'T-NW', 'level', '22');
		await flush();
		sv = await saved();
		ok('P3 a level typed in Base goes into the alternative Base uses, not the element', sv.alternatives.filter((x) => x.id === 'a12')[0].values['n:T-NW'].level === 22 &&
			sv.nodes.filter((n) => n.id === 'T-NW')[0]._level === 15.01, JSON.stringify(sv.alternatives.filter((x) => x.id === 'a12')[0].values));
		const r3 = await ring('T-NW');
		ok('P3 ...and the tank wears the amber ring in Base, an override in the alternative Base uses', r3.amber && !r3.inh, JSON.stringify(r3));
		await tab('scenarios');
		ok('P3 picking Base in Base\'s row gives Base its own alternative again', await pick(BASEW, 'initial', BASEW));
		sv = await saved();
		await tab('tanks');
		ok('P3 ...nothing is named, and the level is the element\'s again', !sv.scenarios[0].alternatives && parseFloat(await cell('tanks', 'T-NW', 'level')) === 15.01, JSON.stringify(sv.scenarios[0]));

		// ---- B1 ----
		console.log('\n--- B1. Base picked in the Calculation column does not blank the selector ---');
		const n1 = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		n1.scenarios.push({ id: 'x1', name: 'Own', overrides: {}, demandMultiplier: 1.7 }, { id: 'x2', name: 'Kid', parent: 'x1', overrides: {} });
		await openProject(n1);
		await pane();
		await tab('scenarios');
		ok('B1 Own (a child of Base, its multiplier its own) first reads itself', ((await scnCell('Own', 'calculation')) || {}).shown === 'Own', JSON.stringify(await scnCell('Own', 'calculation')));
		await pick('Own', 'calculation', BASEW);
		const b1 = await scnCell('Own', 'calculation');
		ok('B1 ...Base picked the first time: the selector shows Base, not a blank', !!b1 && b1.value === BASEW && b1.idx >= 0 && b1.shown === BASEW, JSON.stringify(b1));
		ok('B1 ...the blank row now says it inherits, so Base is not listed twice under one name',
			b1.options.filter((o) => o.split('=')[1] === BASEW).length === 1 && b1.options[0] !== '=' + BASEW, JSON.stringify(b1.options));
		sv = await saved();
		ok('B1 ...and the file says so: Base chosen, its multiplier kept as an alternative named Own', sv.scenarios.filter((s) => s.id === 'x1')[0].calc === 'base' &&
			(sv.calcSets || []).some((c) => c.name === 'Own' && c.demandMultiplier === 1.7), JSON.stringify([sv.scenarios.filter((s) => s.id === 'x1')[0], sv.calcSets]));

		ok('no page error', errors.length === 0, JSON.stringify(errors));
	} finally {
		if (a) { await a.context.close().catch(() => {}); }
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\n' + failures + ' of ' + checks + ' FAILED' : '\nall ' + checks + ' ok');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
