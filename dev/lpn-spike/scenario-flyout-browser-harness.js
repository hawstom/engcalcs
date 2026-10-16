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
// On Net1, at 1600x1000 and then at a phone's 390x800:
//   1. The manager's Scenarios table button opens the table beside the box, at its right edge, over
//      the map: the map canvas keeps its size and place within 1 px. It scrolls within itself.
//   2. A pick in a cell assigns the alternative (the same write as the Tables pane's Scenarios tab,
//      which still shows it). The button again, and the box's close, close it.
//   3. Docked at the right, the table opens at the box's left instead; the map is not resized by it.
//   4. All unused lists every category heading, with only alternatives no scenario names and none
//      inherits from; All lists every one, indented as its tree. Minus deletes an unused one from
//      the list; a double-click opens an item in its category tree.
//   5. At phone width the table lies over the box's lower part, inside the screen, and the map
//      keeps its size.
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
		await a.openExampleCard(await L('lpn_ex_net1_title'));
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
		const flyShown = () => page.evaluate(() => { const f = document.getElementById('lpn_sm_fly'); return !!f && getComputedStyle(f).display !== 'none'; });
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

		console.log('--- 1. the button opens the table beside the box, over the map ---');
		await openManager();
		ok('1.1 the manager is open', await boxShown());
		const btn = await page.evaluate(() => { const b = document.getElementById('lpn_sm_table_btn'); return b ? [b.textContent, b.getAttribute('aria-pressed'), b.title] : null; });
		ok('1.2 its top row has the Scenarios table button, not pressed, with a tip', !!btn && btn[0] === await L('lpn_sm_table') && btn[1] === 'false' && btn[2] === await L('lpn_sm_table_tip'), JSON.stringify(btn));
		ok('1.3 the table is not shown until asked for', !(await flyShown()));
		const map0 = await rect('#lpn_canvas');
		await click('#lpn_sm_table_btn');
		await settle(400);
		ok('1.4 the button shows the table', await flyShown());
		ok('1.5 ...and reads pressed', (await page.evaluate(() => document.getElementById('lpn_sm_table_btn').getAttribute('aria-pressed'))) === 'true');
		const box1 = await rect('#lpn_sm_box'), fly1 = await rect('#lpn_sm_fly'), map1 = await rect('#lpn_canvas');
		ok('1.6 the map canvas keeps its size and place (within 1 px)', same(map0, map1), JSON.stringify([map0, map1]));
		ok('1.7 the table is attached to the box\'s right edge, top aligned', Math.abs(fly1.l - box1.r) <= 2 && Math.abs(fly1.t - box1.t) <= 1, JSON.stringify([box1, fly1]));
		ok('1.8 ...and lies over the map', fly1.l < map1.r && fly1.r > map1.l && fly1.t < map1.b && fly1.b > map1.t, JSON.stringify([fly1, map1]));
		ok('1.9 it stays inside the window', fly1.r <= 1600 && fly1.b <= 1000, JSON.stringify(fly1));
		const shape = await page.evaluate(() => ({
			rows: document.querySelectorAll('#lpn_sm_fly tbody tr').length,
			cols: document.querySelectorAll('#lpn_sm_fly thead th').length,
			scrolls: getComputedStyle(document.querySelector('#lpn_sm_fly .lpn-sm-fly-scroll')).overflow
		}));
		ok('1.10 one row per scenario (Base alone on Net1), Scenario, Parent and the eleven categories', shape.rows === 1 && shape.cols === 13, JSON.stringify(shape));
		ok('1.11 it scrolls within itself', /auto|scroll/.test(shape.scrolls), shape.scrolls);
		const flyZ = await page.evaluate(() => [getComputedStyle(document.getElementById('lpn_sm_fly')).zIndex, getComputedStyle(document.getElementById('lpn_sm_box')).zIndex]);
		ok('1.12 at the box\'s own stacking level', flyZ[0] === flyZ[1] || flyZ[1] === 'auto', JSON.stringify(flyZ));
		// The element at the table's centre is the table, not the map.
		const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && !!e.closest('#lpn_sm_fly'); }, [fly1.l + 30, fly1.t + 40]);
		ok('1.13 a point on the table is the table, not the map under it', hit);

		console.log('\n--- 2. a scenario and two alternatives, picked in the flown-out table ---');
		await selectTree('scenarios');
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(500);
		const scnName = (await names())[1];
		ok('2.1 a child scenario is added, and the table gains its row', (await page.evaluate(() => document.querySelectorAll('#lpn_sm_fly tbody tr').length)) === 2, String(scnName));
		await selectTree('demand');
		await click('#lpn_sm_add');
		await page.keyboard.press('Enter');
		await settle(400);
		const altA = (await names())[1];
		ok('2.2 the table stays open while the manager changes tree', await flyShown());
		const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_fly tbody tr:nth-child(2) td[data-cat=demand] option')).map((o) => o.value));
		ok('2.3 the new Demand alternative is a choice in the child\'s Demand cell', opts.indexOf(altA) >= 0, JSON.stringify(opts));
		await page.selectOption('#lpn_sm_fly tbody tr:nth-child(2) td[data-cat=demand] select', altA);
		await settle(700);
		ok('2.4 picked, the cell holds it after the table is drawn again', (await page.evaluate(() => document.querySelector('#lpn_sm_fly tbody tr:nth-child(2) td[data-cat=demand] select').value)) === altA);
		const used = await page.evaluate((n) => { const r = Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).find((x) => x.querySelector('.lpn-sm-name').textContent === n); return r ? r.querySelector('.lpn-sm-meta').textContent : null; }, altA);
		ok('2.5 ...and the manager\'s tree says the scenario uses it', used === (await L('lpn_sm_used_by')).replace('{n}', '1'), String(used));
		await click('#lpn_pane_tab_scenarios');
		await settle(500);
		ok('2.6 the Tables pane\'s Scenarios tab is kept, and shows the same pick', await page.evaluate((n) => { const p = document.getElementById('lpn_pane_scenarios'); return !!p && (p.textContent.indexOf(n) >= 0 || Array.from(p.querySelectorAll('select,input')).some((e) => e.value === n)); }, altA));
		// Every map size from here on is measured after the pane, which does resize the map, has settled.
		await settle(500);

		console.log('\n--- 3. close, and docking ---');
		await click('#lpn_sm_table_btn');
		ok('3.1 the button again hides the table', !(await flyShown()));
		await click('#lpn_sm_table_btn');
		ok('3.2 ...and shows it again', await flyShown());
		await click('#lpn_sm_close');
		await settle(400);
		ok('3.3 closing the manager closes the table', !(await boxShown()) && !(await flyShown()));
		await openManager();
		ok('3.4 the manager opens again without the table', (await boxShown()) && !(await flyShown()));
		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="right"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(900);
		const mapD = await rect('#lpn_canvas');
		await click('#lpn_sm_table_btn');
		await settle(400);
		const boxD = await rect('#lpn_sm_box'), flyD = await rect('#lpn_sm_fly'), mapD2 = await rect('#lpn_canvas');
		ok('3.5 docked at the right, the table opens at the box\'s left edge', (await flyShown()) && Math.abs(flyD.r - boxD.l) <= 2, JSON.stringify([boxD, flyD]));
		ok('3.6 ...over the map, which keeps its size (within 1 px)', same(mapD, mapD2) && flyD.l < mapD2.r, JSON.stringify([mapD, mapD2]));
		ok('3.7 ...inside the window', flyD.l >= 0, JSON.stringify(flyD));
		await click('#lpn_sm_table_btn');
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
		ok('4.2 All unused lists all eleven category headings', un.length === 11 && un[0].cat === 'physical', JSON.stringify(un.map((x) => x.cat)));
		const unDem = un.filter((x) => x.cat === 'demand')[0], unPhy = un.filter((x) => x.cat === 'physical')[0];
		ok('4.3 under Demand, only the alternative nothing names and nothing inherits from', JSON.stringify(unDem.items) === JSON.stringify([altC]), JSON.stringify(unDem));
		ok('4.4 under Physical, the unused one', JSON.stringify(unPhy.items) === JSON.stringify([altP]), JSON.stringify(unPhy));
		ok('4.5 a heading with none says None', un.filter((x) => x.cat === 'fireflow')[0].none === true && (await page.evaluate(() => document.querySelector('.lpn-sm-none').textContent)) === await L('lpn_sm_unused_none'));
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
		ok('4.11 the minus deletes it, and Physical then says None', un2.filter((x) => x.cat === 'physical')[0].none === true, JSON.stringify(un2.filter((x) => x.cat === 'physical')[0]));
		ok('4.12 ...and the view is still All unused', (await page.evaluate(() => document.getElementById('lpn_sm_tree_select').value)) === '*unused');
		await page.keyboard.press('Control+z');
		await settle(700);
		ok('4.13 Ctrl+Z puts it back', ((await allView()).filter((x) => x.cat === 'physical')[0].items || []).indexOf(altP) >= 0, JSON.stringify((await allView()).filter((x) => x.cat === 'physical')[0]));
		await page.evaluate((n) => { const r = Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).find((x) => x.getAttribute('data-cat') === 'demand' && x.querySelector('.lpn-sm-name').textContent === n); r.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, detail: 2 })); }, altC);
		await settle(500);
		const after = await page.evaluate(() => [document.getElementById('lpn_sm_tree_select').value, (document.querySelector('#lpn_sm_tree .lpn-sm-sel .lpn-sm-name') || {}).textContent]);
		ok('4.14 a double-click opens the item in its own category tree, selected', after[0] === 'demand' && after[1] === altC, JSON.stringify(after));

		console.log('\n--- 5. a phone ---');
		await click('#lpn_sm_close');
		await page.setViewportSize({ width: 390, height: 800 });
		await settle(900);
		await openManager();
		const mapP = await rect('#lpn_canvas');
		await click('#lpn_sm_table_btn');
		await settle(500);
		const boxP = await rect('#lpn_sm_box'), flyP = await rect('#lpn_sm_fly'), mapP2 = await rect('#lpn_canvas');
		const side = await page.evaluate(() => document.getElementById('lpn_sm_fly').getAttribute('data-side'));
		ok('5.1 at 390 px the table opens over the box', (await flyShown()) && side === 'over', String(side));
		ok('5.2 ...inside the screen', flyP.l >= 0 && flyP.r <= 390 && flyP.t >= 0 && flyP.b <= 800, JSON.stringify(flyP));
		ok('5.3 ...below the selector and the button, which stay usable', await page.evaluate(([x, y]) => { const b = document.getElementById('lpn_sm_table_btn').getBoundingClientRect(); const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!e && !!e.closest('#lpn_sm_table_btn'); }, [0, 0]), JSON.stringify([boxP, flyP]));
		ok('5.4 the map keeps its size (within 1 px)', same(mapP, mapP2), JSON.stringify([mapP, mapP2]));
		const sw = await page.evaluate(() => { const s = document.querySelector('#lpn_sm_fly .lpn-sm-fly-scroll'); return [s.scrollWidth, s.clientWidth, document.documentElement.scrollWidth]; });
		ok('5.5 the table scrolls sideways within itself; the page does not', sw[0] > sw[1] && sw[2] <= 390, JSON.stringify(sw));
		await click('#lpn_sm_table_btn');
		ok('5.6 the button closes it', !(await flyShown()));

		ok('no page errors', errors.length === 0, JSON.stringify(errors));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
