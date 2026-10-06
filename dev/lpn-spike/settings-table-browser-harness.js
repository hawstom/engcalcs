// THE SETTINGS TABLE, IN A REAL CHROMIUM -- dev/scenario-alternatives.md, "The Settings table".
// Run with:
//   node dev/lpn-spike/settings-table-browser-harness.js
//
// Tom, 2026-10-05: *"Scenarios must be added to tables so we can audit these things. And by
// extension, there will have to be a settings Table... We can't treat any value overrides
// differently."* And Q7: once the Settings table exists, the Alternatives table's columns for the
// demand multiplier, run time and time step retire, and its two setting columns are headed
// Presentation and Calculation. Asserted on Net1 (US units, Hazen-Williams):
//
//   1. The Settings tab is a table of the Tables pane: Major heading, Minor heading, Category,
//      Setting, Value; units and the coordinate frame are not rows.
//   2. A Base edit (the demand multiplier) writes the project: the solve changes, and comes back.
//   3. Show scenarios gives one row per setting per scenario, Scenario after Setting.
//   4. In a child scenario, Darcy-Weisbach typed into Friction method is that scenario's override:
//      marked, Base's row untouched, the solve differs from Base's, C = 130 now reads as a roughness
//      and wears the value warning in that scenario's Pipes rows only (the value-warning seam).
//   5. Clear override puts it back (the solve returns to Base's); it is not offered on Base's row.
//   6. A child's own demand multiplier changes its solve and counts in the Alternatives table's
//      Calculation column; a Presentation value counts in Presentation; no option columns remain.
// And on Net3 lat/lon (geographic): the coordinate frame is not a row, and a scenario's own text
// size changes that scenario's map and not Base's.
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
if (process.env.EC_SETTAB_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SETTAB_LOCKED: '1' }) });
		if (r.status === 75) { console.error('settings-table-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// ---- page helpers, each one thing a person does or sees ----
function helpers(a) {
	const page = a.page;
	const hideConsent = () => page.evaluate(() => {
		let e = document.querySelector('.ec-consent-actions');
		while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
		if (e) { e.style.display = 'none'; }
	});
	const tab = async (id) => { await page.click('#lpn_pane_tab_' + id); await a.settle(600); };
	// Every row of the Settings table as {key, cells: {colKey: text}, local}.
	const settingRows = () => page.evaluate(() => {
		const out = [];
		document.querySelectorAll('#lpn_pane_settings tbody tr').forEach((tr) => {
			const cells = {}; let key = null, local = false;
			tr.querySelectorAll('td').forEach((td) => {
				const inp = td.querySelector('input, select');
				// A select shows the words of its chosen option, which is what the reader sees.
				cells[td._lpnPaneKey] = inp ? (inp.tagName === 'SELECT' ? (inp.options[inp.selectedIndex] || { text: '' }).text : inp.value) : td.textContent.trim();
				if (td._lpnPaneKey === 'st_value') { cells.select = !!(inp && inp.tagName === 'SELECT'); cells.aria = inp ? inp.getAttribute('aria-label') : ''; }
				key = td._lpnPaneId;
				if (td._lpnPaneKey === 'st_value' && td.classList.contains('lpn-pane-ovcell')) { local = true; }
			});
			out.push({ key: key, cells: cells, local: local });
		});
		return out;
	});
	const headings = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_settings thead th'))
		.map((th) => (th.querySelector('.lpn-pane-sort') || th).textContent.replace(/­/g, '').trim()));
	// The row whose Setting cell reads `label`, in scenario `scn` (Show scenarios) or the only one.
	const findRow = async (label, scn) => (await settingRows()).filter((r) => r.cells.st_setting === label &&
		(scn === undefined || r.cells.scn_name === scn))[0];
	const valueInput = (rowKey) => page.evaluateHandle((k) => {
		const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
		return td ? td.querySelector('input, select') : null;
	}, rowKey);
	const typeValue = async (rowKey, text) => {
		await page.evaluate(([k, v]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
			const inp = td.querySelector('input, select');
			inp.value = v;
			inp.dispatchEvent(new Event('change', { bubbles: true }));
		}, [rowKey, text]);
		await a.settle(1500);
	};
	// The cell menu of one Value cell, by the keyboard's own door (Shift+F10); returns its rows.
	const cellMenu = async (rowKey) => {
		const h = await valueInput(rowKey);
		// Focus, not a click: a click on a select opens its own list.
		await h.asElement().focus();
		await a.settle(200);
		await page.keyboard.press('Shift+F10');
		await a.settle(300);
		return page.evaluate(() => Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).map((e) => e.textContent.trim()));
	};
	const menuPick = (label) => page.evaluate((t) => {
		const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).filter((e) => e.textContent.trim().indexOf(t) >= 0)[0];
		if (b) { b.click(); }
		return !!b;
	}, label);
	const closeCellMenu = () => page.keyboard.press('Escape');
	// The pressure the Junctions table shows for one junction (results show on the open scenario).
	const pressure = async (id) => {
		await tab('junctions');
		const v = await page.evaluate((id) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_junctions td.lpn-pane-col-pressure'))
				.filter((t) => t._lpnPaneId === id || String(t._lpnPaneId).split(String.fromCharCode(1))[0] === id && t.textContent.trim() !== '')[0];
			return td ? td.textContent.trim() : null;
		}, id);
		await tab('settings');
		return v === null || v === '' ? NaN : +v;
	};
	const scenarioMenu = async (label) => {
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		// A real click on the row (Playwright's), as a person makes it: the menu acts on the press.
		const rowsH = await page.$$('#lpn_menu_list button.lpn-menu-row');
		let hit = false;
		for (const r of rowsH) {
			if ((await r.textContent()).trim().replace(/^✓\s*/, '') === label.trim()) { await r.click(); hit = true; break; }
		}
		await a.settle(800);
		return hit;
	};
	// The session hands the page's question box to the native prompt (dev/browser-pass/lib/pickers.js),
	// which answerPromptWith() fills.
	const newScenario = async (name) => {
		a.answerPromptWith(name);
		const hit = await scenarioMenu(await a.lang('lpn_scenario_new'));
		if (!hit) { throw new Error('no New scenario row'); }
		await a.settle(1200);
	};
	return { hideConsent, tab, settingRows, headings, findRow, typeValue, cellMenu, menuPick, closeCellMenu, pressure,
		scenarioMenu, newScenario };
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
		const a = await Session.open(browser, 'A');
		const page = a.page;
		const H = helpers(a);
		const L = async (k) => a.lang(k);
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net1_title'));
		await a.settle(1500);
		await H.hideConsent();
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);

		console.log('--- 1. the Settings tab ---');
		const tabText = await page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_settings'); return b ? b.textContent : null; });
		ok('the pane has a Settings tab', tabText === await L('lpn_tool_settings'), tabText);
		await H.tab('settings');
		const heads = await H.headings();
		ok('columns: Major heading, Minor heading, Category, Setting, Value',
			JSON.stringify(heads) === JSON.stringify([await L('lpn_settings_table_major'), await L('lpn_settings_table_minor'),
				await L('lpn_settings_table_category'), await L('lpn_settings_table_setting'), await L('lpn_find_value')]), JSON.stringify(heads));
		let rows = await H.settingRows();
		const FM = await L('bpn_method'), DM = await L('bpn_demand_mult'), DUR = await L('lpn_time_duration'),
			TS = await L('lpn_settings_text_size'), CALC = await L('lpn_alt_cat_calculation'), PRES = await L('lpn_alt_cat_presentation');
		const fm = rows.filter((r) => r.cells.st_setting === FM)[0];
		ok('Friction method is a row, in Calculation, reading Hazen-Williams',
			fm && fm.cells.st_category === CALC && fm.cells.st_value === await L('bpn_method_hw'), JSON.stringify(fm));
		ok('Demand multiplier and Total run time are rows (Q7)', rows.some((r) => r.cells.st_setting === DM) && rows.some((r) => r.cells.st_setting === DUR));
		const ts = rows.filter((r) => r.cells.st_setting === TS)[0];
		ok('Text size is a row, in Presentation', ts && ts.cells.st_category === PRES, JSON.stringify(ts));
		const DIA = await L('lpn_field_diameter'), BD = await L('lpn_field_base_demand'),
			PHYS = await L('lpn_alt_cat_physical'), DEMC = await L('lpn_alt_cat_demand'), NEWA = await L('lpn_settings_row_new_asset');
		ok('new-asset defaults sit in Physical (diameter) and Demand (base demand)',
			rows.some((r) => r.cells.st_setting === NEWA.replace('{setting}', DIA) && r.cells.st_category === PHYS) &&
			rows.some((r) => r.cells.st_setting === NEWA.replace('{setting}', BD) && r.cells.st_category === DEMC));
		const keys = rows.map((r) => JSON.parse(r.key)[0] + (JSON.parse(r.key)[1] ? '.' + JSON.parse(r.key)[1] : ''));
		ok('units and the coordinate frame are not rows', !keys.some((k) => /^(units|origin|project\.(coords|crs|georef))/.test(k)), JSON.stringify(keys.filter((k) => /^(units|origin|project)/.test(k))));
		ok('no Value cell wears the override wash with no scenario', rows.every((r) => !r.local));
		const ACC = await L('lpn_settings_accuracy'), TRI = await L('lpn_settings_trials'), await0n = { he: await L('lpn_settings_head_error') };
		ok('every setting is a row, stated or not: Accuracy and Maximum trials are rows', rows.some((r) => r.cells.st_setting === ACC) &&
			rows.some((r) => r.cells.st_setting === TRI));
		// Net1 states no head error limit: the row shows the 0 the page uses, with its unit, as the default.
		const tri = rows.filter((r) => r.cells.st_setting === await0n.he)[0];
		const dTpl = (await L('lpn_settings_row_default')).split('{value}');
		ok('...an unstated one shows the default the page uses, with its unit, marked as the default', tri &&
			tri.cells.st_value.indexOf(dTpl[0] + '0 ') === 0 && tri.cells.st_value.slice(-dTpl[1].length) === dTpl[1], tri && tri.cells.st_value);
		ok('a choice is a select showing the Settings box\'s words', fm.cells.select && fm.cells.st_value === await L('bpn_method_hw'));
		ok('...and its screen-reader label is the setting\'s name, not its stored path', /Friction method/.test(fm.cells.aria || '') && !/settings/.test(fm.cells.aria || ''), fm.cells.aria);
		const mv = rows.filter((r) => r.key === '["view"]')[0];
		ok('Map view reads as a summary, read-only', mv && !/[{}"]/.test(mv.cells.st_value) && mv.cells.select === false &&
			await page.evaluate(() => !Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === '["view"]')[0].querySelector('input')),
			mv && mv.cells.st_value);
		const widthRow = rows.filter((r) => r.key === '["settings","labelMaxWidth"]')[0];
		ok('a length setting carries its unit or reads Always show', widthRow && (/ ft$/.test(widthRow.cells.st_value) || widthRow.cells.st_value === await L('lpn_settings_label_always')), widthRow && widthRow.cells.st_value);
		const CODE = /[a-z][A-Z]|\w\.\w|\u203a|_|\w:\w|\w\|\w/;
		ok('Net1: every Setting cell is words, none a stored name', rows.every((r) => !CODE.test(r.cells.st_setting)),
			JSON.stringify(rows.filter((r) => CODE.test(r.cells.st_setting)).map((r) => r.cells.st_setting).slice(0, 10)));

		console.log('\n--- 2. a Base edit writes the project ---');
		const p0 = await H.pressure('22');
		ok('Net1 solves: junction 22 has a pressure', isFinite(p0), p0);
		const dmRow = (await H.findRow(DM)).key;
		await H.typeValue(dmRow, '1.5');
		const p1 = await H.pressure('22');
		ok('Base demand multiplier 1.5: junction 22\'s pressure drops', p1 < p0 - 0.01, p0 + ' -> ' + p1);
		await H.typeValue(dmRow, '1');
		const p2 = await H.pressure('22');
		ok('...and back to 1 it is what it was', Math.abs(p2 - p0) < 1e-6, p2);
		// A Base edit is an undo step like a scenario's (its step carries the project's settings).
		const blurAll = () => page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await H.typeValue(dmRow, '1.5');
		await blurAll();
		await page.keyboard.press('Control+z');
		await a.settle(1500);
		ok('Ctrl+Z after a Base edit puts the Base value back', (await H.findRow(DM)).cells.st_value === '1', (await H.findRow(DM)).cells.st_value);
		const pUndo = await H.pressure('22');
		ok('...and the solve with it', Math.abs(pUndo - p0) < 1e-6, pUndo);
		await blurAll();
		await page.keyboard.press('Control+y');
		await a.settle(1500);
		ok('Ctrl+Y redoes it', (await H.findRow(DM)).cells.st_value === '1.5', (await H.findRow(DM)).cells.st_value);
		await H.typeValue(dmRow, '1');
		const tsBase0 = (await H.findRow(TS)).cells.st_value;
		await H.typeValue((await H.findRow(TS)).key, String(+tsBase0 + 3));
		await blurAll();
		await page.keyboard.press('Control+z');
		await a.settle(1000);
		ok('...a Base Presentation value too (text size)', (await H.findRow(TS)).cells.st_value === tsBase0, (await H.findRow(TS)).cells.st_value);

		console.log('\n--- 3. Show scenarios ---');
		await H.newScenario('Peak');
		await H.tab('settings');
		let menu = await H.cellMenu((await H.findRow(FM)).key);
		ok('the cell menu offers Show scenarios', menu.indexOf(await L('lpn_pane_scn_show')) >= 0, JSON.stringify(menu));
		ok('...and nothing about the map, deleting an element, or Delete', menu.indexOf(await L('lpn_pane_goto_tip')) < 0 &&
			menu.indexOf(await L('lpn_pane_select_on_map')) < 0 && menu.indexOf(await L('lpn_pane_delete_element')) < 0 &&
			menu.indexOf(await L('lpn_tool_delete')) < 0, JSON.stringify(menu));
		await H.menuPick(await L('lpn_pane_scn_show'));
		await a.settle(800);
		const heads2 = await H.headings();
		ok('a Scenario column is inserted after Setting', heads2[4] === await L('lpn_scenario_label') && heads2[3] === await L('lpn_settings_table_setting'), JSON.stringify(heads2));
		rows = await H.settingRows();
		const base = await L('lpn_scenario_base');
		ok('every setting is shown once per scenario, Base first', rows.filter((r) => r.cells.st_setting === FM).map((r) => r.cells.scn_name).join() === base + ',Peak',
			rows.filter((r) => r.cells.st_setting === FM).map((r) => r.cells.scn_name).join());

		const dmNew = await H.findRow(DM, 'Peak');
		ok('a new scenario inherits the demand multiplier: Peak shows Base\'s, unmarked', dmNew && !dmNew.local &&
			dmNew.cells.st_value === (await H.findRow(DM, base)).cells.st_value, JSON.stringify(dmNew && dmNew.cells));
		console.log('\n--- 4. a friction method override in Peak ---');
		const pBase = await H.pressure('22');
		// A choice is a select of the Settings box's own options; picking Darcy-Weisbach.
		await H.typeValue((await H.findRow(FM, 'Peak')).key, 'dw');
		let fmPeak = await H.findRow(FM, 'Peak'), fmBase = await H.findRow(FM, base);
		ok('Peak\'s row reads Darcy-Weisbach and wears the override wash', fmPeak.cells.st_value === await L('bpn_method_dw') && fmPeak.local, JSON.stringify(fmPeak));
		ok('...Base\'s row still reads Hazen-Williams, unmarked', fmBase.cells.st_value === await L('bpn_method_hw') && !fmBase.local, JSON.stringify(fmBase));
		const pDw = await H.pressure('22');
		ok('Peak solves differently from Base (C = 130 read as a roughness, never converted)', isFinite(pDw) ? Math.abs(pDw - pBase) > 0.01 : true, pBase + ' vs ' + pDw);
		// The value-warning seam: the Pipes table under Show scenarios judges each row by its own method.
		await H.tab('pipes');
		const warn = await page.evaluate(() => {
			const spec = Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-roughness')).filter((t) => String(t._lpnPaneId).split(String.fromCharCode(1))[0] === '11');
			return spec.map((t) => !!t.querySelector('.lpn-valwarn'));
		});
		ok('Pipes table (ordinary view, in Peak): pipe 11\'s C = 130 wears ⚠ under Darcy-Weisbach', warn.length === 1 && warn[0], JSON.stringify(warn));
		// ...and with Show scenarios on, each row is judged by ITS scenario's method: Base's row
		// (Hazen-Williams) carries none, Peak's (Darcy-Weisbach) does.
		await page.evaluate(() => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-roughness')).filter((t) => t._lpnPaneId === '11')[0];
			td.querySelector('input').focus();
		});
		await a.settle(200);
		await page.keyboard.press('Shift+F10');
		await a.settle(300);
		await H.menuPick(await L('lpn_pane_scn_show'));
		await a.settle(800);
		const warn2 = await page.evaluate(() => {
			const out = {};
			Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-roughness')).forEach((t) => {
				const k = String(t._lpnPaneId).split(String.fromCharCode(1));
				if (k[0] === '11') { out[k[1]] = !!t.querySelector('.lpn-valwarn'); }
			});
			return out;
		});
		ok('Pipes table, Show scenarios: pipe 11\'s Base row has no ⚠, its Peak row has one', warn2.base === false && warn2.s1 === true, JSON.stringify(warn2));
		await H.tab('settings');

		console.log('\n--- 5. Clear override ---');
		menu = await H.cellMenu((await H.findRow(FM, base)).key);
		ok('on Base\'s row the menu has no Clear override', menu.indexOf(await L('lpn_pane_clear_override')) < 0, JSON.stringify(menu));
		await H.closeCellMenu();
		menu = await H.cellMenu((await H.findRow(FM, 'Peak')).key);
		ok('on Peak\'s row it does', menu.indexOf(await L('lpn_pane_clear_override')) >= 0, JSON.stringify(menu));
		await H.menuPick(await L('lpn_pane_clear_override'));
		await a.settle(1500);
		fmPeak = await H.findRow(FM, 'Peak');
		ok('Peak inherits Hazen-Williams again, unmarked', fmPeak.cells.st_value === await L('bpn_method_hw') && !fmPeak.local, JSON.stringify(fmPeak));
		const pBack = await H.pressure('22');
		ok('...and solves as Base does', Math.abs(pBack - pBase) < 1e-6, pBase + ' vs ' + pBack);

		console.log('\n--- 6. a demand multiplier and a text size in Peak; the Alternatives table ---');
		await H.typeValue((await H.findRow(DM, 'Peak')).key, '2');
		const dmPeak = await H.findRow(DM, 'Peak'), dmBase = await H.findRow(DM, base);
		ok('Peak\'s demand multiplier reads 2, marked; Base\'s reads 1', dmPeak.cells.st_value === '2' && dmPeak.local && dmBase.cells.st_value === '1' && !dmBase.local,
			JSON.stringify([dmPeak, dmBase]));
		const pDm = await H.pressure('22');
		ok('Peak\'s pressure at 22 drops below Base\'s', pDm < pBase - 0.01, pBase + ' -> ' + pDm);
		const tsBase = await H.findRow(TS, base);
		await H.typeValue((await H.findRow(TS, 'Peak')).key, String(+tsBase.cells.st_value + 4));
		ok('Peak\'s text size is its own; Base\'s is unchanged', (await H.findRow(TS, 'Peak')).local && (await H.findRow(TS, base)).cells.st_value === tsBase.cells.st_value);
		// Ctrl+Z, pressed outside the table, takes a Settings table edit back, and Ctrl+Y redoes it.
		await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await page.keyboard.press('Control+z');
		await a.settle(1000);
		const undone = await H.findRow(TS, 'Peak');
		ok('Ctrl+Z takes Peak\'s text size back to inheriting Base\'s', !undone.local && undone.cells.st_value === tsBase.cells.st_value, JSON.stringify(undone.cells));
		await page.keyboard.press('Control+y');
		await a.settle(1000);
		ok('...and Ctrl+Y puts it back', (await H.findRow(TS, 'Peak')).local);
		// Basic mode off reveals the Alternatives preview.
		await H.scenarioMenu(await L('lpn_scenario_basic'));
		await H.scenarioMenu(await L('lpn_alt_title'));
		const alt = await page.evaluate(() => {
			const trs = Array.from(document.querySelectorAll('#lpn_alt_report tr'));
			return trs.map((tr) => Array.from(tr.children).map((c) => c.textContent.trim()));
		});
		const ah = alt[0] || [];
		ok('the Alternatives table ends with Presentation and Calculation, and no option columns',
			ah[ah.length - 2] === PRES && ah[ah.length - 1] === CALC && ah.indexOf(DM) < 0 && ah.indexOf(DUR) < 0, JSON.stringify(ah));
		const peakRow = alt.filter((r) => r[0] === 'Peak')[0] || [];
		ok('Peak: Presentation (1) for its text size, Calculation (1) for its multiplier',
			peakRow[ah.length - 2] === 'Peak (1)' && peakRow[ah.length - 1] === 'Peak (1)', JSON.stringify(peakRow));
		ok('no input is left in it', await page.evaluate(() => !document.querySelector('#lpn_alt_report input')));
		await page.evaluate(() => { const x = document.getElementById('lpn_alt_close'); if (x) { x.click(); } });
		await H.scenarioMenu('  ' + await L('lpn_scenario_basic')).catch(() => {});
		await page.evaluate(() => { try { localStorage.removeItem('lpn_scnbasic'); } catch (e) {} });

		console.log('\n--- 7. the Settings box writes the open scenario (Tom, Q4) ---');
		// The session answers a confirm with OK (dev/browser-pass/lib/session.js), so the friction
		// method's warning is accepted as a person would accept it.
		const openBox = async () => {
			const open = await page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return b && b.style.display !== 'none' && b.style.display !== ''; });
			if (!open) { await a.toolbarClick(await L('lpn_tool_settings')); await page.waitForSelector('#lpn_settings_box', { state: 'visible' }); await a.settle(500); }
		};
		const boxMethod = () => page.evaluateHandle(() => Array.from(document.querySelectorAll('#lpn_settings_box select'))
			.filter((s) => Array.from(s.options).some((o) => o.value === 'dw') && Array.from(s.options).some((o) => o.value === 'manning'))[0]);
		const pickMethod = async (m) => { await (await boxMethod()).asElement().selectOption(m); await a.settle(1500); };
		await openBox();
		const unitsNote = await page.evaluate(() => { const n = document.getElementById('lpn_set_units_scn_note'); return n ? n.textContent : null; });
		ok('in Peak the box says units are the same in every scenario', unitsNote === await L('lpn_settings_units_one_project'), unitsNote);
		await pickMethod('manning');
		let fmP = await H.findRow(FM, 'Peak'), fmB = await H.findRow(FM, base);
		ok('friction method picked in the box in Peak: Peak holds Manning, marked', fmP.cells.st_value === await L('bpn_method_manning') && fmP.local, JSON.stringify(fmP.cells));
		ok('...and Base is untouched', fmB.cells.st_value === await L('bpn_method_hw') && !fmB.local, JSON.stringify(fmB.cells));
		ok('...and the box shows Peak\'s method', await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box select'))
			.filter((s) => Array.from(s.options).some((o) => o.value === 'manning'))[0].value) === 'manning');
		const CAP = await L('lpn_settings_row_symbol_cap_multiple');
		const capBase0 = (await H.findRow(CAP, base)).cells.st_value;
		await page.evaluate(() => { const i = document.getElementById('lpn_set_symbol_cap_mult'); i.value = '0.7'; i.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(1200);
		const capP = await H.findRow(CAP, 'Peak');
		ok('a Presentation value typed in the box in Peak (largest symbol): Peak holds 0.7, marked', capP.cells.st_value === '0.7' && capP.local, JSON.stringify(capP.cells));
		ok('...and Base keeps its own', (await H.findRow(CAP, base)).cells.st_value === capBase0, (await H.findRow(CAP, base)).cells.st_value);
		await page.evaluate(() => { const s = document.getElementById('lpn_set_basemap_style'); s.value = 'faded'; s.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(1000);
		const BMS = await L('lpn_settings_basemap_style');
		ok('basemap style picked in the box in Peak: Peak holds Faded, Base does not', (await H.findRow(BMS, 'Peak')).local &&
			(await H.findRow(BMS, 'Peak')).cells.st_value === await L('lpn_basemap_style_faded') && !(await H.findRow(BMS, base)).local);
		// Undo of a box edit in a scenario.
		await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await page.keyboard.press('Control+z');
		await a.settle(1200);
		ok('Ctrl+Z takes the basemap style edit back off Peak', !(await H.findRow(BMS, 'Peak')).local);

		console.log('\n--- 8. undo restores only what an edit changed (Perry\'s repro) ---');
		await H.scenarioMenu(base);
		await a.settle(800);
		ok('back in Base the box shows Base\'s method', await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box select'))
			.filter((s) => Array.from(s.options).some((o) => o.value === 'manning'))[0].value) === 'hw');
		const dmB = (await H.findRow(DM, base)).key;
		const dmBase0 = (await H.findRow(DM, base)).cells.st_value;
		await H.typeValue(dmB, '1.5');
		await pickMethod('dw');
		ok('Base now: multiplier 1.5 from the table, Darcy-Weisbach from the box', (await H.findRow(DM, base)).cells.st_value === '1.5' &&
			(await H.findRow(FM, base)).cells.st_value === await L('bpn_method_dw'));
		await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await page.keyboard.press('Control+z');
		await a.settle(1500);
		ok('one Ctrl+Z undoes the box edit only: Hazen-Williams again, multiplier still 1.5',
			(await H.findRow(FM, base)).cells.st_value === await L('bpn_method_hw') && (await H.findRow(DM, base)).cells.st_value === '1.5',
			(await H.findRow(FM, base)).cells.st_value + ' / ' + (await H.findRow(DM, base)).cells.st_value);
		await page.keyboard.press('Control+z');
		await a.settle(1500);
		ok('the next Ctrl+Z undoes the table edit only: multiplier back, method still Hazen-Williams',
			(await H.findRow(DM, base)).cells.st_value === dmBase0 && (await H.findRow(FM, base)).cells.st_value === await L('bpn_method_hw'),
			(await H.findRow(DM, base)).cells.st_value);
		await page.evaluate(() => { const x = document.getElementById('lpn_setbox_close'); if (x) { x.click(); } });

		console.log('\n--- geographic: Net3 lat/lon ---');
		const b = await Session.open(browser, 'B');
		const G = helpers(b);
		await b.goto('Looped-Network.php');
		await b.openExampleCard(await b.lang('lpn_ex_net3_world_title'));
		await b.settle(2000);
		await G.hideConsent();
		await b.toolbarClick(await b.lang('lpn_pane_toggle'));
		await b.settle(500);
		await G.tab('settings');
		const grows = await G.settingRows();
		const await0 = { dflt: await b.lang('lpn_settings_row_default'), hw: await b.lang('bpn_method_hw') };
		const gkeys = grows.map((r) => JSON.parse(r.key).join('.'));
		ok('Net3 lat/lon: the coordinate frame and units are not rows', gkeys.length > 50 &&
			!gkeys.some((k) => /^(units|origin|project\.(coords|crs|georef))/.test(k)), gkeys.length);
		ok('...and the view is a Presentation row', grows.some((r) => r.key === '["view"]' && r.cells.st_category === PRES));
		ok('Net3 lat/lon, which states no friction method, still has the row, reading Hazen-Williams (default)',
			grows.some((r) => r.cells.st_setting === FM && r.cells.st_value === (await0.dflt).replace('{value}', await0.hw)), JSON.stringify(grows.filter((r) => r.cells.st_setting === FM).map((r) => r.cells.st_value)));
		ok('Net3 lat/lon: every Setting cell is words, none a stored name',
			grows.every((r) => !/[a-z][A-Z]|\w\.\w|\u203a|_|\w:\w|\w\|\w/.test(r.cells.st_setting)),
			JSON.stringify(grows.filter((r) => /[a-z][A-Z]|\w\.\w|\u203a|_|\w:\w|\w\|\w/.test(r.cells.st_setting)).map((r) => r.cells.st_setting).slice(0, 10)));
		// The labels' drawn height on screen, as a reader sees it: the median over every map label.
		const fontOf = () => b.page.evaluate(() => {
			// Font size times the drawing's scale is the size on screen, in pixels, whatever the zoom.
			const hs = Array.from(document.querySelectorAll('#lpn_canvas text')).filter((t) => t.getBoundingClientRect().height > 0)
				.map((t) => { const m = t.getScreenCTM(); return Math.round(parseFloat(getComputedStyle(t).fontSize) * (m ? Math.hypot(m.a, m.b) : 1) * 10) / 10; })
				.sort((x, y) => x - y);
			return hs.length ? hs[Math.floor(hs.length / 2)] : NaN;
		});
		await G.newScenario('Figure 6-1');
		await b.settle(1000);
		// Measured in the new scenario before it holds anything, where the map is Base's.
		const f0 = await fontOf();
		await G.tab('settings');
		const tsRow = (await G.settingRows()).filter((r) => r.cells.st_setting === TS)[0];
		await G.typeValue(tsRow.key, String(+tsRow.cells.st_value + 8));
		await b.settle(1500);
		const f1 = await fontOf();
		ok('a scenario\'s own text size changes its map, label by label', f0 === +tsRow.cells.st_value && f1 === f0 + 8, f0 + ' -> ' + f1);
		await G.scenarioMenu(await b.lang('lpn_scenario_base'));
		await b.settle(1500);
		const f2 = await fontOf();
		ok('...and Base\'s map is as it was', Math.abs(f2 - f0) < 0.5, f0 + ' vs ' + f2);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' settings table check(s) FAILED' : '\nSettings table browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch(function (e) { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
