// THE SCENARIOS TABLE FLOWN OUT BESIDE THE SCENARIO MANAGER (Task 802), AND THE ALL / ALL UNUSED
// VIEWS OF ITS SELECTOR (Task 803), CLICKED IN A REAL CHROMIUM. Run with:
//   node dev/lpn-spike/scenario-flyout-browser-harness.js
//
// Tom, 2026-10-15 (R-389): "Could we stick that table onto the right side of the Scenario Manager to
// accomplish (a) that both are available in the same gesture and (b) that it flies out over the map
// instead of displacing the map?" And (R-390): "I'd like a way to see at a glance all unused
// alternatives ... the selector ... includes 'All unused' (and 'All'?), where all the headings are
// listed with a scrollbar."
//
// Tom, 2026-10-16, on the first build: "(1) I want it automatic, no button, (2) I want the
// spreadsheet version, (3) I want it expandable (it's too narrow)." And of All unused: "let's not
// take up room and attention listing empty categories on the unused list."
//
// And, on the second build: "I think we need only one x and one title bar; this is a consolidated box
// now; I fear that you are still thinking of it as two."
//
// On Net1, at 1600x1000, then 900x800, then a phone's 390x800:
//   1. Opening the manager opens the table INSIDE its box, beside the tree, with no button: one title
//      band across both, one X, one row of dock buttons, one border and shadow, and no second panel
//      anywhere. The map keeps its size and place. It is the Tables pane's own Scenarios table (its
//      panel, moved in); the pane's Scenarios tab stays visible meanwhile.
//   2. A pick in a cell assigns the alternative. Choosing the pane's tab sends the table home and the
//      manager has the whole box; the one X closes the box, table and all.
//   3. Settings' own slim divider sits between the two panes. Dragged toward the manager it widens
//      the table, the box's far edge staying put; the width is kept in lpn_smbox (flyW) and the box
//      reopens at it. Docked at the right, the same divider widens the docked box.
//   4. All unused lists only the categories that have an unused alternative, with only alternatives
//      no scenario names and none inherits from; All lists every one, indented as its tree. Minus
//      deletes an unused one from the list; a double-click opens an item in its category tree.
//   4b. Docked right with Auto-hide, the box has one tab: hovering it brings the whole box out, table
//      and all; pointing at the table keeps it out; off it, the whole box tucks away.
//   5. At 900 px the box fits the window with both panes; at phone width the manager opens without
//      the table, and the pane's tab stays.
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
if (process.env.EC_SFB_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SFB_LOCKED: '1' }) });
		if (r.status === 75) { console.error('scenario-flyout-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
		await a.openNet1Plain(await L('lpn_ex_net1_title'));
		await settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await page.evaluate(() => { delete window.lpnDialogAnswerer; });
		const openManager = async () => {
			const label = await L('lpn_sm_menu');
			await require('./manager-door.js').ensure(page, label);
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim() === label.trim()) { await r.click(); break; }
			}
			await settle(900);
		};
		const click = async (sel) => { await page.evaluate((s) => document.querySelector(s).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), sel); await settle(500); };
		const rect = (sel) => page.evaluate((s) => { const e = document.querySelector(s); if (!e) { return null; } const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; }, sel);
		const same = (p, q) => !!p && !!q && ['l', 't', 'w', 'h'].every((k) => Math.abs(p[k] - q[k]) <= 1);
		// The table pane is shown: in the box, drawn, and not tucked away with it.
		const flyShown = () => page.evaluate(() => {
			const box = document.getElementById('lpn_sm_box'), t = document.getElementById('lpn_sm_table');
			if (!box || !t || getComputedStyle(box).display === 'none') { return false; }
			const r = t.getBoundingClientRect();
			return box.classList.contains('lpn-sm-has-table') && getComputedStyle(t).display !== 'none' && getComputedStyle(t).visibility === 'visible' && r.width > 0;
		});
		const boxShown = () => page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_box')).display !== 'none');
		const selectTree = async (v) => { await page.selectOption('#lpn_sm_tree_select', v); await settle(500); };
		const names = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).map((r) => r.querySelector('input[type=text]') ? 'EDIT:' + r.querySelector('input[type=text]').value : r.querySelector('.lpn-sm-name').textContent));
		const allView = () => page.evaluate(() => {
			const out = [];
			document.querySelectorAll('#lpn_sm_tree > *').forEach((e) => {
				if (e.classList.contains('lpn-sm-cathead')) { out.push({ cat: e.getAttribute('data-cat'), items: [] }); }
				else if (e.classList.contains('lpn-sm-none')) { out[out.length - 1].none = true; }
				else if (e.classList.contains('lpn-sm-row')) { out[out.length - 1].items.push('-'.repeat(+e.getAttribute('aria-level') - 1) + e.querySelector('.lpn-sm-name').textContent); }
			});
			return out;
		});

		const tabShown = () => page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_scenarios'); return !!b && b.style.display !== 'none'; });
		const panelIn = () => page.evaluate(() => { const p = document.getElementById('lpn_pane_scenarios'); return !p ? 'none' : (p.closest('#lpn_sm_box #lpn_sm_table') ? 'fly' : (p.closest('#lpn_pane') || p.closest('.lpn-pane-body') ? 'pane' : 'elsewhere')); });

		console.log('--- 1. one box: the table opens inside the manager\'s box, beside its tree ---');
		const map0 = await rect('#lpn_canvas');
		await openManager();
		await settle(400);
		ok('1.1 the manager is open', await boxShown());
		ok('1.2 there is no Scenarios table button', (await page.evaluate(() => !document.getElementById('lpn_sm_table_btn'))));
		ok('1.3 the table opened with the manager, inside its box', (await flyShown()) && (await page.evaluate(() => !!document.querySelector('#lpn_sm_box #lpn_sm_table #lpn_pane_scenarios'))));
		const box1 = await rect('#lpn_sm_box'), fly1 = await rect('#lpn_sm_table'), mgr1 = await rect('#lpn_sm_body'), map1 = await rect('#lpn_canvas');
		ok('1.4 the map canvas keeps its size and place (within 1 px)', same(map0, map1), JSON.stringify([map0, map1]));
		const one = await page.evaluate(() => {
			const box = document.getElementById('lpn_sm_box'), br = box.getBoundingClientRect();
			const titles = box.querySelectorAll('.lpn-setbox-title'), tr = titles[0] && titles[0].getBoundingClientRect();
			const xs = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent.trim() === '×' && b.closest('#lpn_sm_box'));
			const t = document.getElementById('lpn_sm_table'), cs = getComputedStyle(t);
			return {
				titles: titles.length, titleL: tr && tr.left - br.left, titleR: tr && br.right - tr.right,
				closes: xs.length, xIds: xs.map((x) => x.id), corners: box.querySelectorAll('.lpn-box-corner').length,
				oldPanel: !!document.getElementById('lpn_sm_fly') || !!document.querySelector('.lpn-sm-fly'),
				tableBorder: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].join(' '),
				tableShadow: cs.boxShadow, boxShadow: getComputedStyle(box).boxShadow,
				tableTitle: !!t.querySelector('.lpn-setbox-title, .lpn-popover-x')
			};
		});
		ok('1.5 ONE title bar, running across the whole box (manager and table)', one.titles === 1 && one.titleL <= 1.5 && one.titleR <= 1.5 && !one.tableTitle, JSON.stringify(one));
		ok('1.6 ONE close control, the box\'s own', one.closes === 1 && one.xIds[0] === 'lpn_sm_close', JSON.stringify(one.xIds));
		ok('1.7 ONE row of dock buttons', one.corners === 1, String(one.corners));
		ok('1.8 ONE border and shadow: the table pane has none of its own, and no second panel exists', !one.oldPanel && one.tableBorder === '0px 0px 0px 0px' && one.tableShadow === 'none' && one.boxShadow !== 'none', JSON.stringify(one));
		ok('1.9 the table sits beside the tree, inside the box', fly1.l >= mgr1.r && fly1.r <= box1.r && fly1.l > box1.l && Math.abs(fly1.t - mgr1.t) <= 1, JSON.stringify([box1, mgr1, fly1]));
		ok('1.10 ...over the map, inside the window', fly1.l < map1.r && fly1.r > map1.l && box1.r <= 1600 && box1.b <= 1000 && box1.l >= 0, JSON.stringify([box1, map1]));
		ok('1.11 it is the Tables pane\'s own Scenarios panel, moved in', (await panelIn()) === 'fly');
		ok('1.12 ...and the pane\'s Scenarios tab stays visible meanwhile (continuity)', await tabShown());
		const shape = await page.evaluate(() => ({
			sheet: !!document.querySelector('#lpn_sm_table table.lpn-pane-table'),
			rows: document.querySelectorAll('#lpn_sm_table table.lpn-pane-table tbody tr').length,
			cols: document.querySelectorAll('#lpn_sm_table table.lpn-pane-table thead th').length,
			scrolls: getComputedStyle(document.getElementById('lpn_pane_scenarios')).overflow
		}));
		ok('1.13 the spreadsheet: one row per scenario (Base alone on Net1), Scenario, Parent and the eleven categories', shape.sheet && shape.rows === 1 && shape.cols === 13, JSON.stringify(shape));
		ok('1.14 it scrolls within itself', /auto|scroll/.test(shape.scrolls), shape.scrolls);
		const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && !!e.closest('#lpn_sm_table'); }, [fly1.l + 30, fly1.t + 40]);
		ok('1.15 a point on the table is the table, not the map under it', hit);
		const dv = await page.evaluate(() => {
			const d = document.querySelector('#lpn_sm_box #lpn_sm_divider');
			if (!d) { return null; }
			const cs = getComputedStyle(d, '::before'), r = d.getBoundingClientRect(), m = document.getElementById('lpn_sm_body').getBoundingClientRect(), t = document.getElementById('lpn_sm_table').getBoundingClientRect();
			return { cls: d.classList.contains('lpn-setbox-divider'), role: d.getAttribute('role'), cursor: getComputedStyle(d).cursor, w: cs.width, h: cs.height,
				between: r.left >= m.right - 8 && r.right <= t.left + 8, line: getComputedStyle(document.getElementById('lpn_sm_body')).borderInlineEndWidth };
		});
		ok('1.16 between them, Settings\' own slim dotted divider on the manager\'s rule', !!dv && dv.cls && dv.role === 'separator' && dv.cursor === 'col-resize' && dv.w === '2px' && dv.h === '22px' && dv.between && dv.line === '1px', JSON.stringify(dv));

		console.log('\n--- 2. a scenario and an alternative, picked in the box\'s spreadsheet ---');
		await selectTree('scenarios');
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(500);
		const scnName = (await names())[1];
		ok('2.1 a child scenario is added, and the table gains its row', (await page.evaluate(() => document.querySelectorAll('#lpn_sm_table table.lpn-pane-table tbody tr').length)) === 2, String(scnName));
		await selectTree('demand');
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(400);
		const altA = (await names())[1];
		ok('2.2 the table stays open while the manager changes tree', await flyShown());
		// The Demand cell of the child's row: a select, as in the pane.
		const mark = await page.evaluate((scn) => {
			const tr = Array.from(document.querySelectorAll('#lpn_sm_table table.lpn-pane-table tbody tr')).filter((r) => r.querySelector('td').textContent.trim() === scn)[0];
			const i = Array.from(document.querySelectorAll('#lpn_sm_table table.lpn-pane-table thead th')).findIndex((t) => t._lpnColKey === 'sc_demand');
			const sel = tr && i >= 0 ? tr.children[i].querySelector('select') : null;
			if (!sel) { return null; }
			sel.setAttribute('data-h', 'dem');
			return Array.from(sel.options).map((o) => o.value);
		}, scnName);
		ok('2.3 the new Demand alternative is a choice in the child\'s Demand cell', !!mark && mark.indexOf(altA) >= 0, JSON.stringify(mark));
		if (mark) { await page.selectOption('#lpn_sm_table select[data-h=dem]', altA); }
		await settle(700);
		ok('2.4 picked, the cell holds it after the table is drawn again', await page.evaluate(([scn, alt]) => {
			const tr = Array.from(document.querySelectorAll('#lpn_sm_table table.lpn-pane-table tbody tr')).filter((r) => r.querySelector('td').textContent.trim() === scn)[0];
			const i = Array.from(document.querySelectorAll('#lpn_sm_table table.lpn-pane-table thead th')).findIndex((t) => t._lpnColKey === 'sc_demand');
			return !!tr && tr.children[i].querySelector('select').value === alt;
		}, [scnName, altA]));
		const used = await page.evaluate((n) => { const r = Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).find((x) => x.querySelector('.lpn-sm-name').textContent === n); return r ? r.querySelector('.lpn-sm-meta').textContent : null; }, altA);
		ok('2.5 picked in the spreadsheet, the manager\'s tree says the scenario uses it', used === (await L('lpn_sm_used_by')).replace('{n}', '1'), String(used));
		await page.evaluate(() => document.getElementById('lpn_pane_tab_scenarios').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(600);
		ok('2.6 choosing the pane\'s Scenarios tab sends the table home, the manager staying', !(await flyShown()) && (await boxShown()) && (await panelIn()) === 'pane');
		const alone = await page.evaluate(() => { const b = document.getElementById('lpn_sm_box').getBoundingClientRect(), m = document.getElementById('lpn_sm_body').getBoundingClientRect(); return { b: b.width, m: m.width }; });
		ok('2.7 ...and the manager then has the whole box', alone.b - alone.m <= 24 && alone.b < 700, JSON.stringify(alone));
		ok('2.8 the pane\'s Scenarios tab shows the same pick', await page.evaluate((n) => { const p = document.getElementById('lpn_pane_scenarios'); return !!p && p.classList.contains('on') && (p.textContent.indexOf(n) >= 0 || Array.from(p.querySelectorAll('select,input')).some((e) => e.value === n)); }, altA));
		await click('#lpn_sm_close');
		await settle(400);
		ok('2.9 the one X closes the box', !(await boxShown()) && !(await flyShown()));
		await openManager();
		await settle(400);
		ok('2.10 the manager opened again has its table back', (await boxShown()) && (await flyShown()));
		ok('2.11 ...and the pane, which was on Scenarios, has given way to another tab (the tab itself stays)', (await tabShown()) && (await page.evaluate(() => !document.getElementById('lpn_pane_scenarios').classList.contains('on'))));
		await click('#lpn_sm_close');
		await settle(400);
		ok('2.12 the one X closes manager and table together, and the panel goes home', !(await boxShown()) && !(await flyShown()) && (await panelIn()) === 'pane' && (await tabShown()));
		await settle(500);

		console.log('\n--- 3. the divider widens the table; docking ---');
		await openManager();
		await settle(400);
		const drag = async (x0, y, x1) => { await page.mouse.move(x0, y); await page.mouse.down(); await page.mouse.move(x1, y, { steps: 6 }); await page.mouse.up(); await settle(300); };
		const divMid = async () => { const d = await rect('#lpn_sm_divider'); return { x: d.l + d.w / 2, y: d.t + d.h / 2 }; };
		const f3 = await rect('#lpn_sm_table'), b3 = await rect('#lpn_sm_box');
		ok('3.0 it opens at 40rem of table', f3.w >= 590 && f3.w <= 650, JSON.stringify(f3));
		let m = await divMid();
		await drag(m.x, m.y, m.x + 200);
		const f3a = await rect('#lpn_sm_table'), b3a = await rect('#lpn_sm_box');
		ok('3.1 the divider dragged 200 px into the table narrows it by 200, the far edge staying put', Math.abs(f3.w - f3a.w - 200) <= 3 && Math.abs(b3a.r - b3.r) <= 1 && Math.abs(b3a.l - b3.l - 200) <= 3, JSON.stringify([b3, f3, b3a, f3a]));
		m = await divMid();
		await drag(m.x, m.y, m.x - 100);
		const f3b = await rect('#lpn_sm_table'), b3b = await rect('#lpn_sm_box');
		ok('3.1b ...and dragged 100 px toward the manager it widens the table by 100', Math.abs(f3b.w - f3a.w - 100) <= 3 && Math.abs(b3b.r - b3.r) <= 1, JSON.stringify([f3a, f3b]));
		const mgrStill = await page.evaluate(() => document.getElementById('lpn_sm_body').getBoundingClientRect().width);
		ok('3.1c the manager\'s column keeps its width meanwhile', Math.abs(mgrStill - (b3.w - f3.w - 28)) <= 12, String(mgrStill));
		const stored = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('lpn_smbox') || '{}'); } catch (e) { return {}; } });
		ok('3.2 the table\'s width is kept with the manager\'s layout (lpn_smbox flyW)', Math.abs(stored.flyW - f3b.w) <= 3, JSON.stringify(stored));
		ok('3.2b ...and the record holds no field it did not hold before', Object.keys(stored).every((k) => ['left', 'top', 'w', 'h', 'open', 'userSized', 'flyW', 'dock', 'autohide', 'dockW', 'dockOrd'].indexOf(k) >= 0), JSON.stringify(Object.keys(stored)));
		m = await divMid();
		await drag(m.x, m.y, -300);
		const b3c = await rect('#lpn_sm_box');
		ok('3.3 ...but the box grows no wider than the window', b3c.l >= 0 && b3c.r <= 1600, JSON.stringify(b3c));
		m = await divMid();
		await drag(m.x, m.y, m.x + ((await rect('#lpn_sm_table')).w - f3b.w));
		await click('#lpn_sm_close');
		await settle(300);
		await openManager();
		await settle(400);
		const f3d = await rect('#lpn_sm_table');
		ok('3.4 opened again, the table has the width it was left at', Math.abs(f3d.w - f3b.w) <= 4, JSON.stringify([f3b, f3d]));
		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="right"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(900);
		const boxD = await rect('#lpn_sm_box'), flyD = await rect('#lpn_sm_table'), mapD2 = await rect('#lpn_canvas');
		// A docked box ends at the edge-tab strip, which reserves 24 px (box-design, ffb7735f7 pinned-tab), not at the window edge.
		const stripD = await rect('#lpn_dock_strip_right');
		ok('3.5 docked at the right, the table is in the docked box, at its inline end', (await flyShown()) && flyD.r <= boxD.r && flyD.l > boxD.l + 150 && stripD.w > 0 && stripD.w <= 30 && Math.abs(boxD.r - stripD.l) <= 3 && stripD.r >= 1596, JSON.stringify([boxD, flyD, stripD]));
		ok('3.6 ...and the box is wide enough to be a table', flyD.w >= 280, JSON.stringify(flyD));
		ok('3.7 ...the map gives up the column', mapD2.r <= boxD.l + 1, JSON.stringify([boxD, mapD2]));
		m = await divMid();
		await drag(m.x, m.y, m.x - 60);
		const flyD2 = await rect('#lpn_sm_table'), boxD2 = await rect('#lpn_sm_box');
		ok('3.8 the same divider widens it docked, the box growing toward the map, its right edge staying', Math.abs(flyD2.w - flyD.w - 60) <= 3 && Math.abs(boxD2.r - boxD.r) <= 1 && Math.abs(boxD.l - boxD2.l - 60) <= 3, JSON.stringify([flyD, flyD2]));
		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="float"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(900);

		console.log('\n--- 4. All and All unused ---');
		// Fixture: Demand holds altA (named by the scenario), altB (nothing names it), altC under altB
		// (so altB is used by its child; altC is unused). Physical holds altP, unused.
		await selectTree('demand');
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(400);
		const dn = await names();
		const altB = dn.filter((n) => n !== 'Base' && n !== altA)[0];
		const rowOf = (n) => page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }) }).first();
		await rowOf(altB).locator('.lpn-sm-name').click();
		await settle(300);
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(400);
		const altC = (await names()).filter((n) => [ 'Base', altA, altB ].indexOf(n) < 0)[0];
		await selectTree('physical');
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(400);
		const altP = (await names())[1];
		ok('4.0 the fixture: four alternatives', !!altA && !!altB && !!altC && !!altP && new Set([altA, altB, altC]).size === 3, JSON.stringify([altA, altB, altC, altP]));
		const selOpts = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree_select option')).map((o) => [o.value, o.textContent]));
		ok('4.1 the selector ends with All and All unused', JSON.stringify(selOpts.slice(-2)) === JSON.stringify([['*all', await L('lpn_sm_tree_all')], ['*unused', await L('lpn_sm_tree_unused')]]) && selOpts.length === 14, JSON.stringify(selOpts.slice(-3)));
		await selectTree('*unused');
		const un = await allView();
		ok('4.2 All unused lists only the two categories that have an unused alternative', JSON.stringify(un.map((x) => x.cat)) === JSON.stringify(['physical', 'demand']), JSON.stringify(un.map((x) => x.cat)));
		const unDem = un.filter((x) => x.cat === 'demand')[0], unPhy = un.filter((x) => x.cat === 'physical')[0];
		ok('4.3 under Demand, only the alternative nothing names and nothing inherits from', JSON.stringify(unDem.items) === JSON.stringify([altC]), JSON.stringify(unDem));
		ok('4.4 under Physical, the unused one', JSON.stringify(unPhy.items) === JSON.stringify([altP]), JSON.stringify(unPhy));
		ok('4.5 no heading stands with nothing under it', un.every((x) => x.items.length > 0 && !x.none) && !(await page.evaluate(() => !!document.querySelector('#lpn_sm_tree .lpn-sm-none'))));
		const scrollY = await page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_tree')).overflowY);
		ok('4.6 the list scrolls in one frame', /auto|scroll/.test(scrollY), scrollY);
		await selectTree('*all');
		const all = await allView();
		const allDem = all.filter((x) => x.cat === 'demand')[0];
		ok('4.7 All lists every Demand item, indented as its tree', JSON.stringify(allDem.items) === JSON.stringify(['Base', '-' + altA, '-' + altB, '--' + altC]), JSON.stringify(allDem));
		ok('4.8 ...with the Used by of each', (await page.evaluate(() => document.querySelectorAll('#lpn_sm_tree .lpn-sm-row .lpn-sm-meta').length)) === (await page.evaluate(() => document.querySelectorAll('#lpn_sm_tree .lpn-sm-row').length)));
		await selectTree('*unused');
		ok('4.9 with nothing selected, the minus is greyed', (await page.evaluate(() => document.getElementById('lpn_sm_del').getAttribute('aria-disabled'))) === 'true');
		await page.evaluate((n) => { const r = Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).find((x) => x.getAttribute('data-cat') === 'physical' && x.querySelector('.lpn-sm-name').textContent === n); r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }, altP);
		await settle(400);
		ok('4.10 a click selects an item in the list', (await page.evaluate(() => { const s = document.querySelector('#lpn_sm_tree .lpn-sm-sel'); return s ? s.getAttribute('data-cat') : null; })) === 'physical');
		await click('#lpn_sm_del');
		await settle(500);
		const un2 = await allView();
		ok('4.11 the minus deletes it, and Physical then leaves the list', JSON.stringify(un2.map((x) => x.cat)) === JSON.stringify(['demand']), JSON.stringify(un2.map((x) => x.cat)));
		ok('4.12 ...and the view is still All unused', (await page.evaluate(() => document.getElementById('lpn_sm_tree_select').value)) === '*unused');
		await page.keyboard.press('Control+z');
		await settle(700);
		const un3 = await allView();
		ok('4.13 Ctrl+Z puts it back, its heading with it', ((un3.filter((x) => x.cat === 'physical')[0] || {}).items || []).indexOf(altP) >= 0, JSON.stringify(un3));
		await page.evaluate((n) => { const r = Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).find((x) => x.getAttribute('data-cat') === 'demand' && x.querySelector('.lpn-sm-name').textContent === n); r.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, detail: 2 })); }, altC);
		await settle(500);
		const after = await page.evaluate(() => [document.getElementById('lpn_sm_tree_select').value, (document.querySelector('#lpn_sm_tree .lpn-sm-sel .lpn-sm-name') || {}).textContent]);
		ok('4.14 a double-click opens the item in its own category tree, selected', after[0] === 'demand' && after[1] === altC, JSON.stringify(after));

		console.log('\n--- 4b. docked with Auto-hide: one tab, and the whole box flies out and tucks away ---');
		await click('#lpn_sm_close');
		await openManager();
		await settle(500);
		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="right"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(900);
		const autoOn = await page.evaluate(() => !!document.querySelector('#lpn_sm_box .lpn-corner-btn[data-dock="autohide"]'));
		ok('4b.1 docked, the box offers Auto-hide', autoOn);
		if (autoOn) {
			await page.evaluate(() => document.querySelector('#lpn_sm_box .lpn-corner-btn[data-dock="autohide"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await settle(900);
		}
		const collapsed = () => page.evaluate(() => document.getElementById('lpn_sm_box').classList.contains('lpn-dock-collapsed'));
		const tabs = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-dock-tab')).filter((t) => /Scenario/i.test(t.textContent)).length);
		ok('4b.2 ONE docked tab for the box', tabs === 1, String(tabs));
		ok('4b.2b tucked, the table is out of sight with the box', (await collapsed()) && !(await flyShown()));
		const tb = await (await page.$('#lpn_dock_strip_right .lpn-dock-tab')).boundingBox();
		await page.mouse.move(tb.x - 300, tb.y + 10);
		await settle(100);
		await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 3 });
		await settle(600);
		ok('4b.3 hovering the tab brings the whole box out, table and all', !(await collapsed()) && (await flyShown()));
		const mid = await rect('#lpn_sm_table');
		await page.mouse.move(mid.l + mid.w / 2, mid.t + 120, { steps: 4 });
		await settle(1500);
		ok('4b.4 pointing at the table keeps the box out', !(await collapsed()) && (await flyShown()));
		await page.mouse.move(300, 500);
		await settle(2500);
		ok('4b.5 off it, the whole box tucks away', (await collapsed()) && !(await flyShown()));
		await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 3 });
		await settle(600);
		ok('4b.6 ...and hovering the tab again restores it whole', !(await collapsed()) && (await flyShown()));
		await page.evaluate(() => { const b = document.querySelector('#lpn_sm_box [data-dock="float"]'); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await settle(700);
		if (!(await boxShown())) { await openManager(); }
		await settle(400);
		ok('4b.7 floated again, it is still one box with its table', (await flyShown()) && (await page.evaluate(() => document.querySelectorAll('#lpn_sm_box .lpn-setbox-title').length === 1)));
		await click('#lpn_sm_close');
		await settle(300);

		console.log('\n--- 5. a narrow window, and a phone ---');
		await page.setViewportSize({ width: 900, height: 800 });
		await settle(900);
		await openManager();
		await settle(500);
		const nb = await rect('#lpn_sm_box'), nt = await rect('#lpn_sm_table'), nm = await rect('#lpn_sm_body');
		ok('5.0 at 900 px the box keeps both panes inside the window', (await flyShown()) && nb.l >= 0 && nb.r <= 900 && nt.r <= nb.r && nt.w >= 190 && nm.w >= 190, JSON.stringify([nb, nm, nt]));
		const sw9 = await page.evaluate(() => document.documentElement.scrollWidth);
		ok('5.0b ...and the page does not scroll sideways', sw9 <= 900, String(sw9));
		await click('#lpn_sm_close');
		await page.setViewportSize({ width: 390, height: 800 });
		await settle(900);
		await openManager();
		await settle(500);
		ok('5.1 at 390 px the manager opens without the table, which would cover its tree', (await boxShown()) && !(await flyShown()));
		ok('5.2 ...and the Scenarios table stays in the Tables pane, its tab shown', (await panelIn()) === 'pane' && (await tabShown()));
		const sw = await page.evaluate(() => document.documentElement.scrollWidth);
		ok('5.3 the page does not scroll sideways', sw <= 390, String(sw));
		const pb = await rect('#lpn_sm_box');
		ok('5.4 the box fits the phone\'s window', pb.l >= 0 && pb.r <= 390, JSON.stringify(pb));
		await click('#lpn_sm_close');
		await page.setViewportSize({ width: 1600, height: 1000 });
		await settle(900);
		await openManager();
		await settle(500);
		ok('5.5 back at 1600 px, the manager opens with its table again', await flyShown());

		ok('no page errors', errors.length === 0, JSON.stringify(errors));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
