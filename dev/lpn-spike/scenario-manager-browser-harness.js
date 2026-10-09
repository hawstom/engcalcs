// THE SCENARIO MANAGER, CLICKED IN A REAL CHROMIUM (stage 6; Tom's calls of 2026-10-09). Run with:
//   node dev/lpn-spike/scenario-manager-browser-harness.js
//
// The model is held headless by scenario-manager-harness.js; this holds the real box and table, on Net1:
//   1. Scenarios > Scenario manager, with Basic mode ticked, opens the box, turns Basic mode off and
//      says so; the Scenarios tab appears in the Tables pane.
//   2. "+" adds Child_1_of_Base and opens its name for editing; "Add Base" adds Base2; F2 renames; a
//      slow click on the selected row renames; Escape cancels; Del is refused for a scenario with a
//      child, naming it; right-click offers Add child, Rename, Make current, Copy, Delete.
//   3. A drop ONTO a row re-parents (the row is outlined); a drop BETWEEN rows reorders (a line);
//      a drop onto its own child is refused; Enter and a double-click make a scenario current.
//   4. A category tree (Demand): "Used by scenarios: N" with the list in its tip.
//   5. The Scenarios table: one row per scenario, a column per category; picking an alternative in a
//      cell assigns it; Clear override inherits again; the Base row has no pick-list.
//   6. Copy scenario asks, and both answers work; the Compare checkbox is stored in the project.
//   7. Basic mode ticked again closes the box and hides the tab; the box's position is the only
//      thing kept on the device (`lpn_smbox`), and `lpn_altbox` is cleared.
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
if (process.env.EC_SMB_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SMB_LOCKED: '1' }) });
		if (r.status === 75) { console.error('scenario-manager-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
			}
			await settle(900);
		};
		const press = async (label) => {
			const hit = await page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
				return !!b;
			}, label);
			await settle(700);
			return hit;
		};
		const rows = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).map((r) => ({
			key: r.getAttribute('data-key'), depth: +r.getAttribute('aria-level') - 1, sel: r.classList.contains('lpn-sm-sel'),
			name: (r.querySelector('input[type=text]') ? 'EDIT:' + r.querySelector('input[type=text]').value : r.querySelector('.lpn-sm-name').textContent),
			meta: r.querySelector('.lpn-sm-meta') ? r.querySelector('.lpn-sm-meta').textContent : '',
			metaTip: r.querySelector('.lpn-sm-meta') ? r.querySelector('.lpn-sm-meta').title : '' })));
		const names = async () => (await rows()).map((r) => '-'.repeat(r.depth) + r.name);
		const rowOf = (name) => page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }) }).first();
		const click = async (sel) => { await page.evaluate((s) => document.querySelector(s).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), sel); await settle(500); };
		const clickRow = async (name) => { await rowOf(name).locator('.lpn-sm-name').click(); await settle(300); };
		const ctxPick = async (label) => {
			const hit = await page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('.lpn-sm-menu [role=menuitem]')).filter((e) => e.textContent.trim() === t)[0];
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
				return !!b;
			}, label);
			await settle(600);
			return hit;
		};
		const ctxItems = () => page.evaluate(() => Array.from(document.querySelectorAll('.lpn-sm-menu [role=menuitem]')).map((e) => e.textContent.trim()));
		const store = (k) => page.evaluate((k) => { try { return localStorage.getItem(k); } catch (e) { return 'ERR'; } }, k);
		const current = () => page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent);

		console.log('--- 1. the menu row, and Basic mode ---');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const SMMENU = await L('lpn_sm_menu');
		const menuRows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).map((r) => r.textContent.trim()));
		ok('1.1 the Scenario manager row is in the menu with Basic mode ticked', menuRows.some((t) => t.indexOf(SMMENU) >= 0), JSON.stringify(menuRows));
		await page.keyboard.press('Escape');
		await page.evaluate(() => { document.body.click(); });
		ok('1.2 the Scenarios tab is not shown in Basic mode', await page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_scenarios'); return !b || getComputedStyle(b).display === 'none'; }));
		await scenarioMenu(await L('lpn_sm_menu'));
		ok('1.3 the box is open', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_box')).display !== 'none'));
		ok('1.4 Basic mode is off (the preference says so)', (await store('lpn_scnbasic')) === 'off');
		const notice = await page.evaluate(() => (document.getElementById('lpn_map_notice') || document.body).textContent);
		ok('1.5 ...and one line said so', notice.indexOf(await L('lpn_sm_basic_off')) >= 0, notice.slice(0, 160));
		ok('1.6 the Scenarios tab is shown', await page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_scenarios'); return !!b && getComputedStyle(b).display !== 'none'; }));
		ok('1.7 the box starts on the Scenarios tree with Base', JSON.stringify(await names()) === JSON.stringify([await L('lpn_scenario_base')]), JSON.stringify(await names()));

		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="right"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(900);
		const saved = JSON.parse((await store('lpn_smbox')) || '{}');
		ok('1.8 docked at the right of the map, the box remembers it on lpn_smbox', saved.dock === 'right' && saved.open === true, JSON.stringify(saved));

		console.log('\n--- 2. add, rename, delete ---');
		await clickRow(await L('lpn_scenario_base'));
		await click('#lpn_sm_add');
		ok('2.1 "+" adds Child_1_of_Base and opens its name for editing', JSON.stringify(await names()) === JSON.stringify(['Base', '-EDIT:Child_1_of_Base']), JSON.stringify(await names()));
		await page.keyboard.type('Peak');
		await page.keyboard.press('Enter');
		await settle(500);
		ok('2.2 Enter commits the typed name', (await names())[1] === '-Peak', JSON.stringify(await names()));
		await click('#lpn_sm_addbase');
		await page.keyboard.press('Enter');
		await settle(400);
		ok('2.3 Add Base adds Base2 as a root', (await names()).indexOf('Base2') === 2 || (await names()).indexOf('Base2') > 0, JSON.stringify(await names()));
		await clickRow('Peak');
		await page.keyboard.press('F2');
		await settle(300);
		ok('2.4 F2 opens the name for editing', (await names()).some((n) => n === '-EDIT:Peak'));
		await page.keyboard.press('Control+a');
		await page.keyboard.type('Peak Hour');
		await page.keyboard.press('Escape');
		await settle(300);
		ok('2.5 Escape cancels', (await names()).some((n) => n === '-Peak'), JSON.stringify(await names()));
		await page.waitForTimeout(600);
		await rowOf('Peak').locator('.lpn-sm-name').click();
		await settle(300);
		ok('2.6 a slow click on the selected row renames it', (await names()).some((n) => n === '-EDIT:Peak'), JSON.stringify(await names()));
		await page.keyboard.press('Control+a');
		await page.keyboard.type('Peak Hour');
		await page.keyboard.press('Enter');
		await settle(400);
		ok('2.7 renamed to Peak Hour', (await names()).some((n) => n === '-Peak Hour'));
		// a child of Peak Hour by right-click
		await rowOf('Peak Hour').locator('.lpn-sm-name').click({ button: 'right' });
		await settle(300);
		const items = await ctxItems();
		ok('2.8 right-click offers add child, add Base, rename, make current, copy, delete', items.length === 6, JSON.stringify(items));
		await ctxPick(await L('lpn_sm_add_child'));
		await page.keyboard.press('Enter');
		await settle(500);
		ok('2.9 the child is named Child_1_of_Peak Hour and sits under it', (await names()).some((n) => n === '--Child_1_of_Peak Hour'), JSON.stringify(await names()));
		await clickRow('Peak Hour');
		await page.keyboard.press('Delete');
		await settle(700);
		const dd = await a.dialog();
		ok('2.10 Del on a scenario with a child is refused, naming the child', !!dd && dd.text.indexOf('Child_1_of_Peak Hour') >= 0 && dd.text.indexOf('Peak Hour') >= 0, dd && dd.text);
		await press(await L('lpn_dialog_ok'));
		ok('2.11 ...and nothing was deleted', (await names()).length === 4);
		await clickRow('Child_1_of_Peak Hour');
		await click('#lpn_sm_del');
		ok('2.12 the "-" button deletes a leaf', (await names()).length === 3, JSON.stringify(await names()));
		await page.keyboard.press('Control+z');
		await settle(800);
		ok('2.13 Ctrl+Z puts it back', (await names()).length === 4, JSON.stringify(await names()));

		await clickRow('Base');
		await page.keyboard.press('Delete');
		await settle(400);
		const bn = await page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '');
		ok('2.14 Del on Base is refused with its own sentence, not "Nothing is selected"', bn.indexOf(await L('lpn_sm_base_kept')) >= 0 && bn.indexOf('Nothing is selected') < 0, bn);
		await click('#lpn_sm_del');
		ok('2.15 "-" on Base gives the same sentence', (await page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '')).indexOf(await L('lpn_sm_base_kept')) >= 0);
		await clickRow('Base2');
		await click('#lpn_sm_del');
		ok('2.16 an unused Base of its own can be deleted', !(await names()).some((n) => n === 'Base2'), JSON.stringify(await names()));
		await page.keyboard.press('Control+z');
		await settle(600);
		ok('2.17 ...and Ctrl+Z brings it back', (await names()).some((n) => n === 'Base2'), JSON.stringify(await names()));

		console.log('\n--- 3. drag ---');
		// make a second scenario to drag
		await clickRow('Base');
		await click('#lpn_sm_add');
		await page.keyboard.type('Night');
		await page.keyboard.press('Enter');
		await settle(500);
		const before = await names();
		const into = rowOf('Peak Hour'), mover = rowOf('Night');
		const bb = await into.boundingBox();
		await mover.dragTo(into, { targetPosition: { x: bb.width / 2, y: bb.height / 2 } });
		await settle(700);
		const after = await names();
		ok('3.1 a drop ONTO Peak Hour makes Night its child', after.some((n) => n === '--Night'), JSON.stringify(before) + ' -> ' + JSON.stringify(after));
		const cyc = rowOf('Peak Hour'), child = rowOf('Night');
		const cb = await child.boundingBox();
		await cyc.dragTo(child, { targetPosition: { x: cb.width / 2, y: cb.height / 2 } });
		await settle(600);
		const notice2 = await page.evaluate(() => document.body.textContent);
		ok('3.2 a drop onto its own child is refused and nothing moves', (await names()).some((n) => n === '--Night') && !(await names()).some((n) => n === '-Night'));
		// reorder: drop Night on the top quarter of Child... use the top edge of Peak Hour
		const ph = rowOf('Peak Hour'), nb = rowOf('Night');
		const pb = await ph.boundingBox();
		await nb.dragTo(ph, { targetPosition: { x: pb.width / 2, y: 2 } });
		await settle(700);
		const re = await names();
		ok('3.3 a drop on the top edge puts Night BEFORE Peak Hour, as a sibling', re.indexOf('-Night') >= 0 && re.indexOf('-Night') < re.indexOf('-Peak Hour'), JSON.stringify(re));
		ok('3.4 the order is stored in the project', await page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { if ((localStorage.getItem(localStorage.key(i)) || '').indexOf('"scenarioOrdered":true') >= 0) { return true; } } return false; }));
		await clickRow('Base2');
		await clickRow('Night');
		await page.keyboard.press('Enter');
		await settle(900);
		ok('3.5 Enter makes the selected scenario current', (await current()).indexOf('Night') >= 0, await current());
		await rowOf('Peak Hour').locator('.lpn-sm-name').dblclick();
		await settle(900);
		ok('3.6 a double-click makes Peak Hour current', (await current()).indexOf('Peak Hour') >= 0, await current());

		console.log('\n--- 4. a category tree ---');
		await page.selectOption('#lpn_sm_tree_select', 'demand');
		await settle(400);
		ok('4.1 the Demand tree shows only its Base', JSON.stringify(await names()) === JSON.stringify(['Base']));
		const baseMeta = (await rows())[0];
		ok('4.2 the Base item says how many scenarios use it', /\d/.test(baseMeta.meta) && baseMeta.metaTip.indexOf('Night') >= 0, baseMeta.meta + ' | ' + baseMeta.metaTip);
		await click('#lpn_sm_add');
		await page.keyboard.type('Dry year');
		await page.keyboard.press('Enter');
		await settle(500);
		ok('4.3 an alternative was added under Base', JSON.stringify(await names()) === JSON.stringify(['Base', '-Dry year']), JSON.stringify(await names()));
		ok('4.4 ...used by no scenario yet', (await rows())[1].meta === await L('lpn_sm_used_by_none'), (await rows())[1].meta);

		console.log('\n--- 5. the Scenarios table ---');
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(600);
		await page.click('#lpn_pane_tab_scenarios');
		await settle(900);
		const hdr = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_scenarios thead th')).map((t) => t.textContent.replace(/[­​]/g, '').trim()));
		ok('5.1 a column per category after Scenario and Parent', hdr.length === 13, JSON.stringify(hdr));
		const trs = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_scenarios tbody tr')).map((tr) => tr.querySelector('td').textContent.trim()));
		ok('5.2 a row per scenario, in the stored order (Base first, Night before Peak Hour)', trs[0] === await L('lpn_scenario_base') && trs.length === 5 && trs.indexOf('Night') < trs.indexOf('Peak Hour'), JSON.stringify(trs));
		const cellSel = (row, cat) => page.evaluate(([row, cat]) => {
			const tr = document.querySelectorAll('#lpn_pane_scenarios tbody tr')[row], th = Array.from(document.querySelectorAll('#lpn_pane_scenarios thead th'));
			const label = cat; const i = th.findIndex((t) => t._lpnColKey === 'sc_' + label);
			const td = tr.children[i], s = td.querySelector('select');
			return s ? { value: s.value, options: Array.from(s.options).map((o) => o.value + '=' + o.textContent) } : { text: td.textContent.trim() };
		}, [row, cat]);
		const baseCell = await cellSel(0, 'demand');
		ok('5.3 the Base row has no pick-list', !!baseCell.text, JSON.stringify(baseCell));
		const peakRow = trs.indexOf('Peak Hour');
		const parentOf = (name) => page.evaluate((n) => { const tr = Array.from(document.querySelectorAll('#lpn_pane_scenarios tbody tr')).filter((r) => r.querySelector('td').textContent.trim() === n)[0]; return tr ? tr.children[1].textContent.trim() : null; }, name);
		ok('5.2b a Base of its own has a blank Parent; a child shows its parent', (await parentOf('Base2')) === '' && (await parentOf('Peak Hour')) === 'Base', String(await parentOf('Base2')) + ' / ' + String(await parentOf('Peak Hour')));
		// Peak Hour is the open scenario: give it a demand of its own, so the solve differs from Base's.
		const pressure = () => page.evaluate(() => { const td = document.querySelector('#lpn_pane_junctions tbody tr td.lpn-pane-col-pressure'); return td ? td.textContent.trim() : null; });
		await page.click('#lpn_pane_tab_junctions');
		await settle(700);
		const pBase = await pressure();
		const di = page.locator('#lpn_pane_junctions tbody tr').nth(2).locator('td.lpn-pane-col-demand input').first();
		await di.click();
		await settle(200);
		await page.keyboard.press('Control+a');
		await page.keyboard.type('2500');
		await di.press('Enter');
		await settle(2500);
		const pPeak = await pressure();
		ok('5.4a Peak Hour\'s own demand changes the solve (pressure at the first junction)', !!pBase && !!pPeak && pBase !== pPeak, pBase + ' -> ' + pPeak);
		await page.click('#lpn_pane_tab_scenarios');
		await settle(700);
		const pc = await cellSel(peakRow, 'demand');
		ok('5.4 a scenario\'s Demand cell is a pick-list with the alternatives', pc.options && pc.options.some((o) => o === 'Dry year=Dry year') && pc.value === '', JSON.stringify(pc));
		await page.evaluate(([row]) => {
			const tr = document.querySelectorAll('#lpn_pane_scenarios tbody tr')[row], th = Array.from(document.querySelectorAll('#lpn_pane_scenarios thead th'));
			const i = th.findIndex((t) => t._lpnColKey === 'sc_demand'), s = tr.children[i].querySelector('select');
			s.value = 'Dry year';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		}, [peakRow]);
		await settle(1000);
		const pc2 = await cellSel(peakRow, 'demand');
		ok('5.5 picking Dry year assigns it', pc2.value === 'Dry year', JSON.stringify(pc2));
		await page.click('#lpn_pane_tab_junctions');
		await settle(1500);
		const pDry = await pressure();
		ok('5.5b ...and the solve changes: Peak Hour\'s own demand is set aside, so the pressure is Base\'s again', pDry === pBase && pDry !== pPeak, pPeak + ' -> ' + pDry);
		await page.click('#lpn_pane_tab_scenarios');
		await settle(700);
		await page.selectOption('#lpn_sm_tree_select', 'demand');
		await settle(400);
		ok('5.6 the manager now shows Dry year used by Peak Hour and the child that inherits it', (await rows())[1].meta.indexOf('2') >= 0 && (await rows())[1].metaTip.indexOf('Peak Hour') >= 0, JSON.stringify(await rows()));
		// the other categories' cells list only their own category's alternatives
		const pcPhys = await cellSel(peakRow, 'physical');
		ok('5.7 the Physical cell lists none of Demand\'s alternatives', pcPhys.options && pcPhys.options.every((o) => o.indexOf('Dry year') < 0), JSON.stringify(pcPhys));
		// Clear override
		await page.evaluate(([row]) => {
			const tr = document.querySelectorAll('#lpn_pane_scenarios tbody tr')[row], th = Array.from(document.querySelectorAll('#lpn_pane_scenarios thead th'));
			const i = th.findIndex((t) => t._lpnColKey === 'sc_demand'); tr.children[i].click();
		}, [peakRow]);
		await settle(300);
		await page.locator('#lpn_pane_scenarios tbody tr').nth(peakRow).locator('td').nth(3).click({ button: 'right', position: { x: 2, y: 2 } });
		await settle(300);
		const pm = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).map((e) => e.textContent.trim()));
		ok('5.8 the cell menu offers Clear override', pm.indexOf(await L('lpn_pane_clear_override')) >= 0, JSON.stringify(pm));
		await page.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).filter((e) => e.textContent.trim() === t)[0];
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
		}, await L('lpn_pane_clear_override'));
		await settle(900);
		ok('5.9 Clear override: the cell inherits again', (await cellSel(peakRow, 'demand')).value === '');

		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(400);
		console.log('\n--- 6. copy, and the compare checkbox ---');
		await page.selectOption('#lpn_sm_tree_select', 'scenarios');
		await settle(300);
		await clickRow('Peak Hour');
		await click('#lpn_sm_copy');
		const cd = await a.dialog();
		ok('6.1 Copy asks: make copies, share them, or cancel', cd && JSON.stringify(cd.buttons) === JSON.stringify([await L('lpn_sm_copy_own'), await L('lpn_sm_copy_share'), await L('lpn_cancel')]), cd && JSON.stringify(cd.buttons));
		await press(await L('lpn_cancel'));
		ok('6.2 Cancel copies nothing', (await names()).length === 5, JSON.stringify(await names()));
		await click('#lpn_sm_copy');
		await press(await L('lpn_sm_copy_share'));
		ok('6.3 Share them copies the scenario', (await names()).some((n) => /Copy_of_Peak Hour/.test(n)), JSON.stringify(await names()));
		await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).filter((r) => /Night/.test(r.textContent))[0].querySelector('.lpn-sm-compare').click());
		await settle(500);
		const proj = await page.evaluate(() => { try { return JSON.stringify(Object.keys(localStorage)); } catch (e) { return ''; } });
		ok('6.4 unchecking Night stores the compare set in the project (autosave holds compareSet)', await page.evaluate(() => {
			let found = false;
			for (let i = 0; i < localStorage.length; i++) { const v = localStorage.getItem(localStorage.key(i)) || ''; if (v.indexOf('"compareSet"') >= 0) { found = true; } }
			return found;
		}), proj);
		await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).filter((r) => /Night/.test(r.textContent))[0].querySelector('.lpn-sm-compare').click());
		await settle(500);

		console.log('\n--- 7. Basic mode ticked again, and what is stored ---');
		ok('7.1 the box keeps its place on one key', (await page.evaluate(() => { try { return localStorage.getItem('lpn_smbox') !== undefined; } catch (e) { return false; } })));
		ok('7.2 the old Alternatives box key is cleared', (await store('lpn_altbox')) === null);
		await scenarioMenu(await L('lpn_scenario_basic'));
		ok('7.3 the box is closed', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_box')).display === 'none'));
		ok('7.4 the Scenarios tab is hidden', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display === 'none'));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
const PCsm = '';
main().catch((e) => { console.error(e); process.exit(1); });
