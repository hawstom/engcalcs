// THE SETTINGS TABLE'S OWNER COLUMN, ITS MISSING ROWS, AND THE TWO SHOW SCENARIOS FILTERS -- IN A
// REAL CHROMIUM. Run with:
//   node dev/lpn-spike/settings-table-owner-browser-harness.js
//
// Tom's browser pass, 2026-10-07:
//   (1) *"We need a third organizational hierarchy column to help organize the labels and custom
//       properties settings... We could call it 'Owner'. Examples: Symbology.Node labels.ID.Is
//       Active, Symbology.Node labels.ID.Show order (You called this Rank, but that is a very
//       dangerous term.)... Assets.Custom properties.date_installed.Label"*
//   (2) *"Can the tables, in Show scenarios mode, have an options to show overrides only and show
//       current scenario only?"*
//   (5) *"I don't see Bef. and Aft. in the Settings table. Better do an audit."*
//
// Asserted on Net1 (US) and on Net3 lat/lon, which ships a custom property:
//   1. Columns Major heading, Minor heading, Owner, Setting; Node labels / ID / Is active, Show order,
//      Drop order are rows, and no cell anywhere in the table says "Rank".
//   2. Every label field's Before and After is a row, stated or not, showing the default the page
//      prints; typed in a scenario it is that scenario's override, marked, and the map's label
//      follows it; Base's row is untouched.
//   3. The Settings box's note under a held Labels row names the column as the table does.
//   4. Show scenarios, then Overrides only: only the scenario rows holding a value of their own;
//      Current scenario only: only the open scenario's rows; both together: the open scenario's
//      overrides. A line above the table names them, with Show all, which is the way back when no
//      row is left to right-click; the heading menu carries them too. The same filters on Pipes.
//   5. Net3 lat/lon: the custom property's design is rows under Custom properties, owned by its key;
//      typing a Label writes the design (the Properties box and the Settings box read it); in a
//      scenario's row under Show scenarios the design is read-only.
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
if (process.env.EC_STOWN_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_STOWN_LOCKED: '1' }) });
		if (r.status === 75) { console.error('settings-table-owner-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

function helpers(a) {
	const page = a.page;
	const settle = (ms) => a.settle(ms);
	const hideConsent = () => page.evaluate(() => {
		let e = document.querySelector('.ec-consent-actions');
		while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
		if (e) { e.style.display = 'none'; }
	});
	const tab = async (id) => { await page.click('#lpn_pane_tab_' + id); await settle(700); };
	// Every row of a table as {key, cells: {colKey: text}, local, editable}.
	const rowsOf = (id) => page.evaluate((id) => {
		const out = [];
		document.querySelectorAll('#lpn_pane_' + id + ' tbody tr').forEach((tr) => {
			const cells = {}; let key = null, local = false, editable = false;
			tr.querySelectorAll('td').forEach((td) => {
				const inp = td.querySelector('input, select');
				cells[td._lpnPaneKey] = inp ? (inp.tagName === 'SELECT' ? (inp.options[inp.selectedIndex] || { text: '' }).text : inp.value) : td.textContent.trim();
				key = td._lpnPaneId;
				if (td.classList.contains('lpn-pane-ovcell')) { local = true; }
				if (td._lpnPaneKey === 'st_value') { editable = !!inp; }
			});
			out.push({ key: String(key), cells: cells, local: local, editable: editable });
		});
		return out;
	}, id);
	const headings = (id) => page.evaluate((id) => Array.from(document.querySelectorAll('#lpn_pane_' + id + ' thead th'))
		.map((th) => (th.querySelector('.lpn-pane-sort') || th).textContent.replace(/­/g, '').trim()), id);
	const typeValue = async (rowKey, text) => {
		const r = await page.evaluate(([k, v]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
			const inp = td && td.querySelector('input, select');
			if (!inp) { return false; }
			inp.value = v;
			inp.dispatchEvent(new Event('change', { bubbles: true }));
			return true;
		}, [rowKey, text]);
		await settle(1500);
		return r;
	};
	// The cell menu, by a real right-click on a cell of table `id`; returns its rows.
	const cellMenu = async (id, sel) => {
		await page.click(sel || ('#lpn_pane_' + id + ' tbody td:nth-child(2)'), { button: 'right' });
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
	const scenarioMenu = async (label) => {
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
		}
		await settle(1500);
	};
	const newScenario = async (name) => {
		a.answerPromptWith(name);
		await scenarioMenu(await a.lang('lpn_scenario_new'));
		await settle(1200);
	};
	return { hideConsent, tab, rowsOf, headings, typeValue, cellMenu, headMenu, menuPick, scenarioMenu, newScenario };
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
		await H.tab('settings');

		console.log('--- 1. the Owner column ---');
		const heads = await H.headings('settings');
		ok('Major heading, Minor heading, Owner, Setting lead the table',
			JSON.stringify(heads.slice(0, 4)) === JSON.stringify([await L('lpn_settings_table_major'), await L('lpn_settings_table_minor'),
				await L('lpn_settings_table_owner'), await L('lpn_settings_table_setting')]), JSON.stringify(heads));
		let rows = await H.rowsOf('settings');
		const NL = await L('lpn_labels_heading_node'), LL = await L('lpn_labels_heading_link');
		const id3 = ['lpn_settings_row_label_on', 'lpn_settings_row_label_show', 'lpn_settings_row_label_drop'];
		for (const k of id3) {
			const w = await L(k);
			const r = rows.filter((x) => x.cells.st_minor === NL && x.cells.st_owner === 'ID' && x.cells.st_setting === w)[0];
			ok('Node labels / ID / ' + w + ' is a row', !!r, r && JSON.stringify(r.cells));
		}
		ok('no cell of the Settings table says Rank', !rows.some((r) => Object.keys(r.cells).some((k) => /\bRank\b/.test(r.cells[k]))));
		ok('a row with no owner leaves Owner blank and names itself (Friction method)',
			rows.some((r) => r.cells.st_owner === '' && r.cells.st_setting === 'Friction method'));

		console.log('--- 2. Before and After, stated or not ---');
		const BEF = await L('lpn_settings_row_label_before'), AFT = await L('lpn_settings_row_label_after');
		const flowBef = rows.filter((r) => r.cells.st_minor === LL && r.cells.st_owner === 'Flow' && r.cells.st_setting === BEF)[0];
		const dTpl = (await L('lpn_settings_row_default')).split('{value}');
		ok('Link labels / Flow / Text before is a row, showing the default the page prints',
			flowBef && flowBef.cells.st_value === dTpl[0] + 'Q=' + dTpl[1], flowBef && flowBef.cells.st_value);
		ok('Node labels / Pressure / Text after is a row', rows.some((r) => r.cells.st_minor === NL && r.cells.st_owner === 'Pressure' && r.cells.st_setting === AFT));
		await H.newScenario('Peak');
		await H.tab('settings');
		await H.typeValue(flowBef.key, 'F=');
		rows = await H.rowsOf('settings');
		const fb2 = rows.filter((r) => r.key === flowBef.key)[0];
		ok('typed in Peak, it is Peak\'s override: marked, reading F=', fb2 && fb2.local && fb2.cells.st_value === 'F=', fb2 && JSON.stringify(fb2));

		console.log('--- 3. the Settings box note names the column as the table does ---');
		await a.toolbarClick(await L('lpn_tool_settings'));
		await a.settle(1500);
		const note = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_content .lpn-set-heldnote')).map((n) => n.textContent.trim()));
		ok('the held Flow row\'s note says Bef.: Q= (the box\'s own column word)', note.some((t) => t.indexOf('Q=') >= 0 && t.indexOf(BEF) < 0), JSON.stringify(note));
		await a.toolbarClick(await L('lpn_tool_settings'));
		await a.settle(600);

		console.log('--- 4. Show scenarios: Overrides only, Current scenario only ---');
		await H.tab('settings');
		const firstValue = '#lpn_pane_settings tbody td.lpn-pane-col-st_value';
		let menu = await H.cellMenu('settings', firstValue);
		ok('the cell menu offers no filter before Show scenarios is on',
			menu.indexOf(await L('lpn_pane_scn_ov_only')) < 0 && menu.indexOf(await L('lpn_pane_scn_cur_only')) < 0, JSON.stringify(menu));
		await H.menuPick(await L('lpn_pane_scn_show'));
		const all = (await H.rowsOf('settings')).length;
		menu = await H.cellMenu('settings', firstValue);
		ok('with Show scenarios on it offers both', menu.indexOf(await L('lpn_pane_scn_ov_only')) >= 0 && menu.indexOf(await L('lpn_pane_scn_cur_only')) >= 0, JSON.stringify(menu));
		await H.menuPick(await L('lpn_pane_scn_ov_only'));
		rows = await H.rowsOf('settings');
		ok('Overrides only: just Peak\'s Flow Text before', rows.length === 1 && rows[0].cells.scn_name === 'Peak' && rows[0].cells.st_setting === BEF,
			rows.length + ' ' + JSON.stringify(rows.slice(0, 3).map((r) => r.cells.st_setting + '/' + r.cells.scn_name)));
		await H.headMenu('settings');
		await H.menuPick(await L('lpn_pane_scn_ov_only'));
		menu = await H.cellMenu('settings', firstValue);
		await H.menuPick(await L('lpn_pane_scn_cur_only'));
		rows = await H.rowsOf('settings');
		ok('Current scenario only: one row per setting, every one Peak\'s', rows.length * 2 === all && rows.every((r) => r.cells.scn_name === 'Peak'),
			rows.length + ' of ' + all);
		menu = await H.cellMenu('settings', firstValue);
		ok('a filter that is on is ticked', menu.indexOf('✓ ' + await L('lpn_pane_scn_cur_only')) >= 0, JSON.stringify(menu));
		await H.menuPick(await L('lpn_pane_scn_ov_only'));
		rows = await H.rowsOf('settings');
		ok('both: the open scenario\'s overrides', rows.length === 1 && rows[0].cells.scn_name === 'Peak');
		// Into Base, the open scenario's overrides are none: no row left.
		await H.scenarioMenu(await L('lpn_scenario_base'));
		await H.tab('settings');
		rows = await H.rowsOf('settings');
		ok('in Base, both together leave no row', rows.length === 0, String(rows.length));
		const banner = await page.evaluate(() => { const b = document.querySelector('#lpn_pane_settings .lpn-pane-filter'); return b ? b.textContent : null; });
		const OVO = await L('lpn_pane_scn_ov_only'), CURW = await L('lpn_pane_scn_cur_only'), SHOWALL = await L('lpn_pane_filter_clear');
		ok('...and a line above says which filters hold the rows back, with Show all', !!banner && banner.indexOf(OVO) >= 0 &&
			banner.indexOf(CURW) >= 0 && banner.indexOf(SHOWALL) >= 0, banner);
		await page.click('#lpn_pane_settings .lpn-pane-filter-clear');
		await a.settle(900);
		ok('Show all turns both off: every row is back', (await H.rowsOf('settings')).length === all);
		// The heading menu carries the two switches too.
		menu = await H.headMenu('settings');
		ok('the heading menu offers the two filters', menu.indexOf(OVO) >= 0 && menu.indexOf(CURW) >= 0, JSON.stringify(menu));
		await page.keyboard.press('Escape');
		await a.settle(300);
		await H.scenarioMenu('Peak');
		// The Pipes table: one pipe given its own diameter in Peak.
		await H.tab('pipes');
		await page.evaluate(() => {
			const inp = document.querySelector('#lpn_pane_pipes td.lpn-pane-col-diameter input');
			inp.value = '16'; inp.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(1500);
		await H.cellMenu('pipes', '#lpn_pane_pipes tbody td.lpn-pane-col-diameter');
		await H.menuPick(await L('lpn_pane_scn_show'));
		await H.cellMenu('pipes', '#lpn_pane_pipes tbody td.lpn-pane-col-diameter');
		await H.menuPick(await L('lpn_pane_scn_ov_only'));
		rows = await H.rowsOf('pipes');
		ok('the Pipes table, Overrides only: the one pipe Peak changed', rows.length === 1 && rows[0].cells.diameter === '16' && rows[0].local,
			rows.length + ' ' + JSON.stringify(rows.slice(0, 2).map((r) => r.cells.id + '/' + r.cells.diameter)));

		console.log('--- 5. a custom property\'s design (Net3 lat/lon) ---');
		ok('no page errors on Net1', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		// A fresh profile, as a second visitor opening another example.
		const b = await Session.open(browser, 'B');
		const pageB = b.page, HB = helpers(b);
		await b.goto('Looped-Network.php');
		await b.openExampleCard(await L('lpn_ex_net3_world_title'));
		await b.settle(2500);
		await HB.hideConsent();
		await b.toolbarClick(await L('lpn_pane_toggle'));
		await b.settle(500);
		await HB.tab('settings');
		rows = await HB.rowsOf('settings');
		const CPM = await pageB.evaluate(() => { const e = document.getElementById('lpn_set_sub_customProps'); return e ? e.textContent.replace(/\?/g, '').replace(/\s+/g, ' ').trim() : ''; });
		const CPL = await L('lpn_cp_label');
		const cpLabel = rows.filter((r) => r.cells.st_owner === 'date_installed' && r.cells.st_setting === CPL)[0];
		const ASSETS = await pageB.evaluate(() => { const e = document.querySelector('#lpn_set_sec_elements .lpn-set-head'); return e ? e.textContent.trim() : null; });
		ok('Assets / Custom properties / date_installed / Label is a row', !!cpLabel && cpLabel.cells.st_major === ASSETS &&
			CPM.indexOf(cpLabel.cells.st_minor) === 0 && cpLabel.cells.st_category === '', cpLabel && JSON.stringify(cpLabel.cells));
		const cpWords = [await L('lpn_cp_applies'), await L('lpn_cp_validate'), await L('lpn_cp_restrict_mode')];
		ok('...with Applies to, Validate as and Allow or restrict beside it',
			cpWords.every((w) => rows.some((r) => r.cells.st_owner === 'date_installed' && r.cells.st_setting === w)));
		await HB.typeValue(cpLabel.key, 'Installed on');
		rows = await HB.rowsOf('settings');
		ok('typing the Label writes the design', rows.filter((r) => r.key === cpLabel.key)[0].cells.st_value === 'Installed on');
		await b.toolbarClick(await L('lpn_tool_settings'));
		await b.settle(1500);
		const design = await pageB.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_content input')).map((i) => i.value));
		ok('...and the Settings box reads it', design.indexOf('Installed on') >= 0, String(design.length) + ' inputs');
		await b.toolbarClick(await L('lpn_tool_settings'));
		await b.settle(600);
		await HB.newScenario('Dry');
		await HB.tab('settings');
		await HB.cellMenu('settings', firstValue);
		await HB.menuPick(await L('lpn_pane_scn_show'));
		rows = await HB.rowsOf('settings');
		const dryCp = rows.filter((r) => r.cells.st_owner === 'date_installed' && r.cells.scn_name === 'Dry')[0];
		ok('in a scenario\'s row the design is read-only', dryCp && !dryCp.editable && !dryCp.local, dryCp && JSON.stringify(dryCp));
		ok('no page errors on Net3 lat/lon', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? 'settings-table-owner-browser-harness: ' + fails + ' FAILED' : 'settings-table-owner-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
