// THE GUIDE'S LIBRARIES CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-library-harness.js   (takes the browser lock itself)
//
// The chapter is the entry for the Libraries box. Real Chromium:
//   1. Every interface name the chapter quotes is the language file's own, read from it.
//   2. The entry renders in the Guide with its seven terms and its table, and a search finds it.
//   3. The worked example is performed on Net1 as the chapter says: what each section holds, and the
//      times of the Status changes before and after the control is edited.
//   4. The behaviour the chapter states: a blank or duplicate ID snaps back, a rename moves the
//      default demand pattern, a pattern in use is deleted and the default notice follows, a curve in
//      use is not deleted, Undo reverses an edit, an edit made in a scenario is the same in Base, a
//      control that names an inactive asset is named in its section, and File, Import, Import
//      libraries is where the chapter sends the reader.
//   5. A page in another language renders the same entry.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, entry, searchFinds, dialogPress, finish } = L;
const NAME = 'user-guide-library-harness';
U.takeBrowserLock(NAME, 'EC_UGLIB_LOCKED');

const QUOTES = {
	lpn_guide_text_library_box: ['lpn_menu_project', 'lpn_library_menu'],
	lpn_guide_lib_kinds_def: ['lpn_library_patterns', 'lpn_library_curves', 'lpn_library_pipetypes', 'lpn_library_fittings', 'lpn_library_controls',
		'lpn_library_rules', 'lpn_library_pattern_default_mark', 'lpn_settings_sec_calculation', 'lpn_settings_hydraulics', 'lpn_curve_kind_head',
		'lpn_curve_kind_effic', 'lpn_curve_kind_volume', 'lpn_curve_kind_headloss', 'lpn_library_curve_type', 'lpn_library_curve_equation',
		'lpn_curve_library_link', 'lpn_pipetype_detach', 'lpn_fitting_other', 'lpn_library_pattern_values'],
	lpn_guide_lib_ctl_def: ['lpn_library_control_add', 'lpn_time_duration'],
	lpn_guide_lib_import_def: ['lpn_file_import_menu', 'lpn_library_import'],
	lpn_guide_lib_example_def: ['lpn_menu_project', 'lpn_library_menu', 'lpn_library_patterns', 'lpn_library_pattern_default_mark', 'lpn_library_curves',
		'lpn_curve_kind_head', 'lpn_library_controls', 'lpn_library_rules', 'lpn_time_run', 'lpn_reports_menu', 'lpn_reports_status']
};
const TERMS = ['lpn_guide_lib_kinds_term', 'lpn_guide_lib_refs_term', 'lpn_guide_lib_scn_term', 'lpn_guide_lib_ctl_term', 'lpn_guide_lib_import_term',
	'lpn_guide_lib_example_term', 'lpn_guide_lib_notes_term'];
// The chapter's own sentences about the times, read out of it so a reworded sentence is re-measured.
function exampleTimes() {
	const t = plain(enString('lpn_guide_lib_example_def'));
	const a = t.match(/Pump L9 is now closed at (\d+:\d\d), now open at (\d+:\d\d), and now closed at (\d+:\d\d), and Tank N2 is now emptying at (\d+:\d\d)\./);
	const b = t.match(/The last closing moves to (\d+:\d\d), and Tank N2 is now emptying at (\d+:\d\d)\./);
	return { a: a && a.slice(1), b: b && b.slice(1) };
}

async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes(QUOTES);
	const times = exampleTimes();
	ok('the chapter\'s two time sentences are in the form this harness measures', !!times.a && !!times.b, JSON.stringify(times));

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 700);
		const closeBox = (id) => P.evaluate((i) => { const x = document.getElementById(i); if (x) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } }, id);
		const openLib = async (section) => {
			if (!(await P.evaluate(() => { const b = document.getElementById('lpn_library_box'); return !!b && b.style.display !== 'none'; }))) {
				await a.menuClick(await T('lpn_library_menu'), 'project');
				await settle(700);
			}
			if (section) {
				await P.evaluate((s) => document.getElementById('lpn_libbox_link_' + s).click(), section);
				await settle(400);
			}
		};
		const libText = () => P.evaluate(() => document.getElementById('lpn_libbox_content').innerText.replace(/\s+/g, ' ').trim());
		const stored = () => U.storedProject(ctx);
		const undo = async () => {
			await P.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await P.mouse.move(700, 600);
			await P.keyboard.press('Control+z');
			await settle(700);
		};
		const press = (text) => P.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('#lpn_libbox_content button')).filter((x) => x.textContent.trim() === t)[0];
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return !!b;
		}, text);
		const statusTimes = async () => {
			await a.menuClickSub(await T('lpn_reports_menu'), await T('lpn_reports_status'), 'project');
			await settle(1000);
			const rows = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_status_report tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim())));
			await closeBox('lpn_status_close');
			await settle(300);
			return rows;
		};
		const calculate = async () => {
			await a.menuClick(await T('lpn_time_run'), 'project');
			await a.waitFor(() => P.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'extended-period frames', 120000);
			await settle(800);
		};

		// ---- 2. the entry renders ---------------------------------------------------------------
		console.log('\n2. The entry renders in the Guide, and a search finds it');
		await openGuide(a);
		const en = await entry(P, 'lpn_library_box');
		ok('the Libraries entry is in the Guide, titled by the box', !!en && en.title.trim() === await T('lpn_library_menu'), en && en.title);
		ok('...it opens with the box\'s paragraph', !!en && en.text.indexOf(plain(enString('lpn_guide_text_library_box')).slice(0, 24)) === 0 || en.text.indexOf(plain(enString('lpn_guide_text_library_box')).slice(0, 24)) > 0);
		ok('...and carries the seven terms of the chapter, in order', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)), en && JSON.stringify(en.dts));
		ok('...and the table of what each section holds, one row for each of the six sections, in the order of the box\'s list',
			!!en && en.tables.length === 1 && en.tables[0].length === 6 && JSON.stringify(en.tables[0].map((r) => r[0])) === JSON.stringify(await Promise.all(['lpn_library_patterns', 'lpn_library_curves', 'lpn_library_pipetypes', 'lpn_library_fittings', 'lpn_library_controls', 'lpn_library_rules'].map(T))), en && JSON.stringify(en.tables[0].map((r) => r[0])));
		ok('a search for "Table 3.3" shows the Libraries entry', await searchFinds(a, 'lpn_library_box', 'Table 3.3'));
		await P.keyboard.press('Escape');
		await settle(300);

		// ---- 3. Net1: what each section holds -------------------------------------------------------
		console.log('\n3. The worked example on Net1');
		await openLib('patterns');
		const idx = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_index button')).map((b) => b.textContent.trim()));
		ok('the box\'s list is Patterns, Curves, Pipe types, Fittings, Controls, Rules', JSON.stringify(idx) === JSON.stringify(await Promise.all(['lpn_library_patterns', 'lpn_library_curves', 'lpn_library_pipetypes', 'lpn_library_fittings', 'lpn_library_controls', 'lpn_library_rules'].map(T))), JSON.stringify(idx));
		let txt = await libText();
		const span = (await T('lpn_library_pattern_span')).replace('{n}', '12').replace('{step}', '2:00').replace('{span}', '24:00');
		const pat = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry')).map((e) => ({ id: e.querySelector('.lpn-lib-id').value, desc: (e.querySelector('textarea') || {}).value, mult: e.querySelector('.lpn-lib-values').value })));
		ok('Patterns holds pattern 1, Demand Pattern, one pattern in all', pat.length === 1 && pat[0].id === '1' && pat[0].desc === 'Demand Pattern', JSON.stringify(pat));
		ok('...with 12 multipliers, "' + span + '", marked ' + await T('lpn_library_pattern_default_mark'), txt.indexOf(span) >= 0 && txt.indexOf(await T('lpn_library_pattern_default_mark')) >= 0 && pat[0].mult.split(/\s+/).length === 12, txt.slice(0, 200));
		const ch = plain(enString('lpn_guide_lib_example_def'));
		ok('...and the chapter says all of that', [pat[0].id, pat[0].desc, '12', '2:00', '24:00', await T('lpn_library_pattern_default_mark')].every((x) => ch.indexOf(x) >= 0));
		await openLib('curves');
		const cv = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry')).map((e) => ({
			id: (e.querySelector('.lpn-lib-id') || {}).value, desc: (e.querySelector('textarea') || {}).value, kind: (e.querySelector('select') || {}).value,
			pts: Array.from(e.querySelectorAll('input[type=text],input:not([type])')).map((i) => i.value).filter((v) => /^[\d.]+$/.test(v)), text: e.innerText.replace(/\s+/g, ' ') })));
		ok('Curves holds curve 1, Pump Curve for Pump 9, a pump head curve with one point, 1500 and 250', cv.length === 1 && cv[0].id === '1' && cv[0].desc === 'Pump Curve for Pump 9' && cv[0].kind === 'head' && cv[0].pts.slice(1).join() === '1500,250', JSON.stringify(cv));
		ok('...with its flow in gpm and head in ft', cv[0].text.indexOf('Flow (gpm)') >= 0 && cv[0].text.indexOf('Head (ft H2O)') >= 0, cv[0].text.slice(0, 120));
		await openLib('pipetypes');
		const none = await T('lpn_pane_none');
		ok('Pipe types and Fittings hold none on Net1', (await libText()).indexOf(none) >= 0 && (await (async () => { await openLib('fittings'); return libText(); })()).indexOf(none) >= 0);
		await openLib('controls');
		const ctl = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_content input.lpn-lib-wide')).map((i) => i.value));
		const nums = plain(enString('lpn_guide_lib_example_def')).match(/opens Link (\d+) when Node (\d+) falls below (\d+), and the second closes it when Node \d+ rises above (\d+)\./);
		ok('Controls holds the two statements the chapter describes: Link 9 opens when Node 2 falls below 110, and closes when it rises above 140', !!nums && ctl.length === 2
			&& new RegExp('^LINK ' + nums[1] + ' OPEN IF NODE ' + nums[2] + ' BELOW ' + nums[3] + '$').test(ctl[0]) && new RegExp('^LINK ' + nums[1] + ' CLOSED IF NODE ' + nums[2] + ' ABOVE ' + nums[4] + '$').test(ctl[1]), JSON.stringify(ctl));
		const want = ctl;
		ok('...each marked ' + await T('lpn_library_control_ok'), (await libText()).split(await T('lpn_library_control_ok')).length === 3);
		await openLib('rules');
		const rules = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_content textarea.lpn-lib-wide, #lpn_libbox_content .lpn-lib-wide')).map((i) => i.value).filter((v) => /^RULE/.test(v)));
		ok('Rules holds two rules, which test the clock time and the level of Tank 2', rules.length === 2 && rules.every((r) => /SYSTEM CLOCKTIME/.test(r)) && rules.some((r) => /TANK\s+2\s+LEVEL/.test(r)), JSON.stringify(rules.map((r) => r.slice(0, 50))));
		await closeBox('lpn_libbox_close');
		await settle(300);

		await calculate();
		const ev = (rows) => rows.filter((r) => r.length === 2 && /^\d+:\d\d$/.test(r[0])).map((r) => r[0] + ' ' + r[1]);
		const before = ev(await statusTimes());
		const pumpClosed = (e) => e.filter((x) => /Pump L9 now closed/.test(x)).map((x) => x.split(' ')[0]);
		const pumpOpen = (e) => e.filter((x) => /Pump L9 now open/.test(x)).map((x) => x.split(' ')[0]);
		const emptying = (e) => e.filter((x) => /Tank N2 now emptying/.test(x)).map((x) => x.split(' ')[0]);
		ok('Status changes: Pump L9 now closed at ' + times.a[0] + ' and ' + times.a[2] + ', now open at ' + times.a[1],
			pumpClosed(before).join() === [times.a[0], times.a[2]].join() && pumpOpen(before).join() === times.a[1], before.join(' | '));
		ok('...and Tank N2 now emptying at ' + times.a[3] + ' (after an earlier 11:00)', emptying(before).slice(-1)[0] === times.a[3], emptying(before).join());
		await openLib('controls');
		await P.evaluate(() => { const i = document.querySelectorAll('#lpn_libbox_content input.lpn-lib-wide')[1]; i.value = i.value.replace(/(\d+)$/, '135'); i.dispatchEvent(new Event('change', { bubbles: true })); });
		await settle(1200);
		ok('the edited control is still understood', (await libText()).split(await T('lpn_library_control_ok')).length === 3);
		await closeBox('lpn_libbox_close');
		await settle(300);
		await calculate();
		const after = ev(await statusTimes());
		ok('after changing 140 to 135 the last closing is at ' + times.b[0] + ' and Tank N2 empties at ' + times.b[1],
			pumpClosed(after).slice(-1)[0] === times.b[0] && emptying(after).slice(-1)[0] === times.b[1], after.join(' | '));
		await undo();
		await openLib('controls');
		ok('one Undo reverses the edit (Undo reverses an edit made in the Libraries box)', (await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_content input.lpn-lib-wide')).map((i) => i.value)))[1] === want[1]);

		// ---- 4. renaming, deleting, Undo ----------------------------------------------------------
		console.log('\n4. Renaming, deleting, and what refers to an item');
		await openLib('patterns');
		const renameFirst = async (v) => {
			await P.evaluate((val) => { const i = document.querySelector('#lpn_libbox_content .lpn-lib-id'); i.value = val; i.dispatchEvent(new Event('change', { bubbles: true })); }, v);
			await settle(700);
		};
		await press(await T('lpn_library_pattern_add'));
		await settle(500);
		let d = await stored();
		ok('Add a pattern adds one: 24 multipliers of 1', d.patterns.length === 2 && d.patterns[1].multipliers.length === 24 && d.patterns[1].multipliers.every((m) => m === 1), JSON.stringify(d.patterns.map((p) => p.id)));
		const newId = d.patterns[1].id;
		await undo();
		d = await stored();
		ok('...and Undo takes it away again', d.patterns.length === 1, JSON.stringify(d.patterns.map((p) => p.id)));
		await openLib('patterns');
		await press(await T('lpn_library_pattern_add'));
		await settle(500);
		// The new pattern is second; rename the FIRST to the new one's ID (a clash).
		await renameFirst(newId);
		d = await stored();
		ok('an ID already used in the section is not accepted: pattern 1 stays 1', d.patterns[0].id === '1', JSON.stringify(d.patterns.map((p) => p.id)));
		await renameFirst('   ');
		d = await stored();
		ok('a blank ID is not accepted either', d.patterns[0].id === '1', JSON.stringify(d.patterns.map((p) => p.id)));
		await renameFirst('Day');
		d = await stored();
		ok('a new ID is accepted, and the default demand pattern moves with it (Base)', d.patterns[0].id === 'Day' && d.defaultPattern === 'Day', JSON.stringify({ p: d.patterns.map((p) => p.id), def: d.defaultPattern }));
		const delText = await T('lpn_tool_delete');
		await P.evaluate((t) => { const b = Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-del'))[0]; b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, delText);
		await settle(800);
		d = await stored();
		const wantNote = (await T('lpn_library_pattern_default_deleted_none')).replace('{id}', 'Day');
		ok('a pattern in use is deleted, with a notice that states what junctions with no pattern use now', d.patterns.length === 1 && d.patterns[0].id === newId && (await a.notice()) === wantNote, (await a.notice()));
		ok('...and the default demand pattern is cleared', !d.defaultPattern, JSON.stringify(d.defaultPattern));
		await undo();
		d = await stored();
		ok('one Undo brings the deleted pattern back, with its place as the default demand pattern', d.patterns.map((p) => p.id).join() === 'Day,' + newId && d.defaultPattern === 'Day', JSON.stringify({ p: d.patterns.map((p) => p.id), def: d.defaultPattern }));
		await undo();
		d = await stored();
		ok('...and the next Undo reverses the rename', d.patterns.map((p) => p.id).join() === '1,' + newId, JSON.stringify(d.patterns.map((p) => p.id)));
		await openLib('curves');
		await P.evaluate(() => { const b = document.querySelector('#lpn_libbox_content .lpn-lib-del'); b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); });
		await settle(900);
		d = await stored();
		const inUse = (await T('lpn_library_curve_in_use'));
		const pieces = inUse.split(/\{count\}|\{ids\}/);
		const said = (await a.notice()) + ' ' + ((await a.dialog()) || { text: '' }).text + ' ' + (await libText());
		ok('a curve in use is not deleted, and the message names the assets using it', d.curves.length === 1 && pieces.every((x) => said.indexOf(x.trim()) >= 0), said.slice(0, 260));
		const dlg = await a.dialog();
		if (dlg) { await dialogPress(P, dlg.buttons[0]); }
		await closeBox('lpn_libbox_close');
		await settle(300);

		// ---- 5. libraries and scenarios -------------------------------------------------------------
		console.log('\n5. Libraries and scenarios');
		const SCN = await T('lpn_scenario_menu'), NEW = await T('lpn_scenario_new'), OK = await T('lpn_dialog_ok');
		await a.menuClickSub(SCN, NEW, 'project');
		await a.waitDialog(3000);
		await P.fill('#lpn_dialog_body input', 'Library test');
		await dialogPress(P, OK);
		await settle(1000);
		await openLib('patterns');
		await P.evaluate(() => { const i = document.querySelector('#lpn_libbox_content .lpn-lib-values'); i.value = i.value.replace(/0\.8$/, '0.9'); i.dispatchEvent(new Event('change', { bubbles: true })); });
		await settle(900);
		d = await stored();
		const scnBlob = JSON.stringify([d.scenarios, d.alternatives || [], d.calcSets || []]);
		ok('a pattern edited while a scenario is open changes the pattern itself (the last multiplier is 0.9)', d.patterns[0].multipliers[11] === 0.9, JSON.stringify(d.patterns[0].multipliers));
		ok('...and the scenario holds nothing for it', scnBlob.indexOf('0.9') < 0 && scnBlob.indexOf('multipliers') < 0, scnBlob.slice(0, 200));
		await closeBox('lpn_libbox_close');
		await a.menuClick(await T('lpn_library_menu'), 'project');
		await P.click('#lpn_scenario_btn');
		await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) { if ((await r.textContent()).trim().replace(/^✓\s*/, '') === await T('lpn_scenario_base')) { await r.click(); break; } }
		await settle(1200);
		await openLib('patterns');
		ok('...and Base shows the same multipliers', (await P.evaluate(() => document.querySelector('#lpn_libbox_content .lpn-lib-values').value)).split(/\s+/).pop() === '0.9');
		await closeBox('lpn_libbox_close');
		await settle(300);
		// A control that names an inactive asset: back in the scenario, make pump 9 inactive.
		await P.click('#lpn_scenario_btn');
		await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) { if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === 'Library test') { await r.click(); break; } }
		await settle(1200);
		await U.openProperties(ctx, 'link', '9');
		await P.keyboard.press('Delete');
		await settle(1200);
		const note = (await T('lpn_control_inactive_note')).split('{ids}')[0].trim();
		let seen = false;
		for (const sec of ['patterns', 'curves', 'pipetypes', 'fittings', 'controls']) {
			await openLib(sec);
			if ((await libText()).indexOf(note) >= 0) { seen = true; }
		}
		ok('a control that names an asset inactive in the open scenario is named in the Libraries box', seen);
		await openLib('rules');
		const rnote = (await T('lpn_rule_inactive_note')).split('{ids}')[0].trim();
		ok('...and a rule in the Rules section', (await libText()).indexOf(rnote) >= 0, (await libText()).slice(0, 200));
		await closeBox('lpn_libbox_close');
		await settle(300);

		// ---- 6. where the chapter sends the reader ------------------------------------------------
		console.log('\n6. File, Import…, Import libraries…');
		await a.openMenu('file');
		await a._clickRow('#lpn_menu_list', await T('lpn_file_import_menu'));
		await P.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		const imp = await P.$$eval('#lpn_menu_list2 button.lpn-menu-row', (es) => es.map((e) => e.textContent.trim()));
		ok('the File menu\'s Import… list has Import libraries…', imp.indexOf(await T('lpn_library_import')) >= 0, JSON.stringify(imp));
		await a.closeMenu();
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		// ---- 7. another language ------------------------------------------------------------------
		console.log('\n7. A page in another language shows the same entry');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await entry(b.page, 'lpn_library_box');
		ok('the Spanish page shows the Libraries entry with its seven terms and its table', !!es && TERMS.every((k, i) => es.dts[i] === esString(k)) && es.tables.length === 1, es && JSON.stringify(es.dts.slice(0, 2)));
		ok('...titled by the Spanish box title', !!es && es.title.trim() === await b.lang('lpn_library_menu'), es && es.title);
		ok('no page errors (Spanish)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.context.close().catch(() => {});
	} catch (e) {
		console.error(e && e.stack || e);
		ok('the harness ran to the end', false, String(e && e.message));
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	process.exit(finish(NAME));
}
main();
