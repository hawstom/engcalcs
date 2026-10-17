// MANAGE OVERRIDES: EVERY OWN OVERRIDE A ROW, CLEARED ONE, SEVERAL OR ALL AT A TIME. Real Chromium.
//   node dev/lpn-spike/manage-overrides-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-16, of "each bubble listed as a row in List overrides, where you can audit and clear
// it": *"This sounds very promising as a general upgrade to List Overrides (which could become
// 'Manage overrides') ... Do this. I'd love to see it."*
// The scenarios are started from the UI (scenario-ui-helper.js), so the stored shape is the real one.
//   M1  Base opens a time series graph of 31. A child (made with New scenario) overrides pipe 10's
//       diameter, Text X1's words, the demand multiplier, and opens graphs of 22 and 12. A sibling
//       opens its own graph of 22.
//   M2  The Scenarios menu row reads Override manager… and the dialog title Override manager: (Tom,
//       2026-10-16, "Yes. Proceed." to the rename from Manage overrides); the child counts 5, one
//       row each, the two graphs as Presentation rows (Junction 22, Junction 12, Time series graph,
//       replacing "Not on the map"); the graph of 31 it inherits is no row.
//   M3  Clear override on the 22 row: one row fewer, the list stays open, the child's map loses its
//       22 graph and keeps 31 and 12; the sibling still shows its own 22.
//   M4  Select the diameter and Text rows, Clear selected overrides: both go, no override ring is
//       left on the map, the Text reads Base's words.
//   M5  Clear all overrides asks first, then the count is 0 and the menu row is greyed.
//   M6  Each clear was one undo step: three Undos bring back the 5, in order.
//   M7  A Spanish page opens the dialog and lists the rows.
'use strict';
const path = require('path');
const U = require('./scenario-ui-helper.js');
const NAME = 'manage-overrides-browser-harness';
U.takeBrowserLock(NAME, 'EC_MANAGE_OVR_LOCKED');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(U.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(U.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const L = (k) => U.lang(ctx, k);
		const settle = (ms) => a.settle(ms || 600);
		const click = (sel) => P.evaluate((s) => { const e = typeof s === 'string' ? document.querySelector(s) : s; e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, sel);
		const runEps = async () => {
			await P.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
			await a.waitFor(() => P.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
			await settle(800);
		};
		const shown = () => P.evaluate(() => Array.from(document.querySelectorAll('.lpn-tsb')).filter((b) => b.style.display !== 'none')
			.map((b) => b.querySelector('.lpn-tsb-title').textContent).sort().join(','));
		const pointOf = (g, id) => P.evaluate(([g, i]) => {
			for (const el of document.querySelectorAll('#lpn_canvas [data-' + g + '="' + i + '"]')) {
				const r = el.getBoundingClientRect();
				if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
			}
			return null;
		}, [g, id]);
		const openGraph = async (id) => {
			const p = await pointOf('node', id);
			await P.mouse.move(p.x, p.y);
			await P.mouse.click(p.x, p.y, { button: 'right' });
			await settle(400);
			const label = await L('lpn_tsb_menu');
			await P.evaluate((l) => { Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0].click(); }, label);
			await settle(700);
		};
		// The Scenarios menu's rows, and one pressed by its label (a scenario's count ignored).
		const menuRows = async () => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rows = await P.$$eval('#lpn_menu_list button.lpn-menu-row', (es) => es.map((e) => ({ text: e.textContent.trim().replace(/^✓\s*/, ''), off: e.disabled })));
			await P.keyboard.press('Escape');
			await settle(200);
			return rows;
		};
		const scenarioMenu = async (label) => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			let hit = false;
			for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label || t.replace(/\s*\(\d+\)$/, '') === label) { await r.click(); hit = true; break; }
			}
			if (!hit) { await P.keyboard.press('Escape'); throw new Error('no scenario menu row ' + label); }
			await settle(1200);
		};
		const dialog = () => P.evaluate(() => {
			const d = document.getElementById('lpn_dialog');
			if (!d || d.style.display !== 'block') { return null; }
			const body = document.getElementById('lpn_dialog_body');
			return {
				title: document.getElementById('lpn_dialog_title').textContent,
				msg: (body.querySelector('.lpn-dialog-msg') || {}).textContent,
				groups: Array.from(body.querySelectorAll('.lpn-ovl-group')).map((g) => ({ cat: g.getAttribute('data-cat'),
					rows: Array.from(g.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children)
						.filter((td) => !td.classList.contains('lpn-ovl-pick') && !td.classList.contains('lpn-ovl-act')).map((td) => td.textContent)) })),
				boxes: body.querySelectorAll('tbody input[type=checkbox]').length,
				clears: body.querySelectorAll('tbody button.lpn-ovl-clear').length,
				selOff: (body.querySelector('button.lpn-ovl-clearsel') || {}).disabled
			};
		});
		const rowsOf = (d) => (d ? d.groups.reduce((s, g) => s.concat(g.rows.map((r) => g.cat + '|' + r.join('|'))), []) : []);
		const nrows = (d) => (d ? d.groups.reduce((s, g) => s + g.rows.length, 0) : -1);
		// The row whose cells start with these words: its index among all rows.
		const rowIndex = (d, test) => rowsOf(d).findIndex(test);
		const rowButton = (i, sel) => P.evaluate(([i, sel]) => {
			const tr = document.querySelectorAll('#lpn_dialog_body tbody tr')[i];
			const e = tr && tr.querySelector(sel);
			if (!e) { return false; }
			if (e.type === 'checkbox') { e.click(); } else { e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return true;
		}, [i, sel]);
		const okDialog = () => P.evaluate(() => { const b = document.querySelectorAll('#lpn_dialog_buttons button')[0]; b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); });
		const pressDialog = (label) => P.evaluate((l) => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === l); b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, label);
		const stored = () => U.storedProject(ctx);
		// Where a scenario's values are stored for a category: the alternative (or calculation set) it
		// names, else the scenario itself. A stored tree is what this page writes once a scenario has one.
		const holder = (sv, name, cat) => {
			const s = sv.scenarios.find((x) => x.name === name);
			if (cat === 'calculation') { return s.calc ? (sv.calcSets || []).find((c) => c.id === s.calc) : s; }
			const id = s.alternatives && s.alternatives[cat];
			return id ? (sv.alternatives || []).find((x) => x.id === id) : s;
		};
		const vals = (h) => (h && (h.values || h.overrides)) || {};
		const setOf = (h) => (h && h.settings && Array.isArray(h.settings.bubbles) ? h.settings.bubbles : null);
		const MO = await L('lpn_sm_list_overrides');
		const openManage = async (name) => {
			await scenarioMenu(name);
			await scenarioMenu(MO);
			await settle(500);
			return dialog();
		};

		console.log('--- M1. a child made from the UI, four kinds of override ---');
		await runEps();
		await openGraph('31');
		ok('M1 Base shows its graph of 31', (await shown()) === '31', await shown());
		const made = await U.createScenarioViaMenu(ctx);
		const CHILD = made.scenario.name;
		await U.editPropertyViaUI(ctx, { kind: 'link', id: '10', labelKey: 'lpn_field_diameter', value: '14' });
		// Text X1, edited in place
		const xc = await P.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl="X1"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		await P.mouse.dblclick(xc.x, xc.y);
		await settle(500);
		await P.keyboard.press('Control+a');
		await P.keyboard.type('Child source');
		await P.keyboard.press('Control+Enter');
		await settle(800);
		// the demand multiplier, in the Settings box
		await a.toolbarClick(await L('lpn_tool_settings'));
		await P.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await settle(600);
		const dmOk = await P.evaluate(() => {
			const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((e) => /demandMultiplier/.test(e.getAttribute('data-lpn-setting')))[0];
			const i = r && r.querySelector('input');
			if (!i) { return false; }
			i.focus(); i.value = '1.5';
			i.dispatchEvent(new Event('input', { bubbles: true }));
			i.dispatchEvent(new Event('change', { bubbles: true }));
			i.blur();
			return true;
		});
		await settle(900);
		await a.toolbarClick(await L('lpn_tool_settings'));
		await settle(400);
		await runEps();
		await openGraph('22');
		await openGraph('12');
		ok('M1 the child shows 31 (inherited), 22 and 12', (await shown()) === '12,22,31', await shown());
		let sv = await stored();
		const hp = vals(holder(sv, CHILD, 'physical')), ht = vals(holder(sv, CHILD, 'text'));
		ok('M1 the child holds the diameter, the Text, the multiplier and its set of three graphs', dmOk &&
			hp['l:10'] && String(hp['l:10'].diameter) === '14' && ht['t:X1'] && /Child source/.test(String(ht['t:X1'].text)) &&
			holder(sv, CHILD, 'calculation').demandMultiplier === 1.5 && (setOf(holder(sv, CHILD, 'presentation')) || []).length === 3,
			JSON.stringify({ s: sv.scenarios.find((s) => s.name === CHILD), alts: sv.alternatives, calc: sv.calcSets }));
		await scenarioMenu(await L('lpn_scenario_base'));
		const made2 = await U.createScenarioViaMenu(ctx);
		const SIB = made2.scenario.name;
		await runEps();
		await openGraph('22');
		ok('M1 the sibling ' + SIB + ' shows 31 and its own 22', (await shown()) === '22,31', await shown());

		console.log('--- M2. the list ---');
		const rows0 = await menuRows();
		ok('M2 the Scenarios menu row reads "Override manager…"', MO === 'Override manager…' && rows0.some((r) => r.text === MO), JSON.stringify(rows0.map((r) => r.text)));
		let d = await openManage(CHILD);
		ok('M2 the dialog is titled "Override manager: ' + CHILD + '"', !!d && d.title === (await L('lpn_ovl_title')).replace('{name}', CHILD) && /^Override manager: /.test(d.title), d && d.title);
		ok('M2 it counts 5, one row each, a box and Clear override on every row', !!d && d.msg === (await L('lpn_scenario_overrides')) + ': 5' && nrows(d) === 5 && d.boxes === 5 && d.clears === 5, JSON.stringify(d && d.msg) + ' ' + JSON.stringify(rowsOf(d)));
		ok('M2 Clear selected overrides is off until a row is selected', !!d && d.selOff === true);
		const junction = await L('lpn_tool_add_junction'), TSG = await L('lpn_tsb_menu'), OFF = await L('lpn_ovl_bubble_off');
		const pres = d.groups.filter((g) => g.cat === 'presentation')[0];
		ok('M2 the two graphs are Presentation rows: Junction 12 and Junction 22, Time series graph, replacing "' + OFF + '"', !!pres && pres.rows.length === 2 &&
			JSON.stringify(pres.rows.map((r) => r[0])) === JSON.stringify([junction + ' 12', junction + ' 22']) && pres.rows.every((r) => r[1] === TSG && r[3] === OFF && r[2] !== OFF),
			JSON.stringify(pres && pres.rows));
		ok('M2 the graph of 31 it inherits is no row', !rowsOf(d).some((r) => / 31\|/.test(r)), JSON.stringify(rowsOf(d)));
		ok('M2 the diameter, the Text and the multiplier are rows', rowIndex(d, (r) => /^physical\|/.test(r) && /\|14\|/.test(r)) >= 0 &&
			rowIndex(d, (r) => /^text\|/.test(r) && /Child source/.test(r)) >= 0 && rowIndex(d, (r) => /^calculation\|/.test(r) && /\|1\.5\|1$/.test(r)) >= 0, JSON.stringify(rowsOf(d)));

		console.log('--- M3. clear one graph row ---');
		const i22 = rowIndex(d, (r) => r.indexOf('presentation|' + junction + ' 22|') === 0);
		await rowButton(i22, 'button.lpn-ovl-clear');
		await settle(900);
		d = await dialog();
		ok('M3 the list stays open, counting 4', !!d && d.msg === (await L('lpn_scenario_overrides')) + ': 4' && nrows(d) === 4, d && d.msg);
		ok('M3 ...the 22 row is gone, the 12 row kept', !rowsOf(d).some((r) => r.indexOf(junction + ' 22|') >= 0) && rowsOf(d).some((r) => r.indexOf(junction + ' 12|') >= 0), JSON.stringify(rowsOf(d)));
		ok('M3 the child\'s map shows 31 and 12, no 22', (await shown()) === '12,31', await shown());
		sv = await stored();
		ok('M3 the child\'s stored set lost 22 only', JSON.stringify((setOf(holder(sv, CHILD, 'presentation')) || []).map((b) => b.n).sort()) === '["12","31"]');
		ok('M3 the sibling still holds its own 22', (setOf(holder(sv, SIB, 'presentation')) || []).some((b) => b.n === '22'));

		console.log('--- M4. clear several ---');
		const iDia = rowIndex(d, (r) => /^physical\|/.test(r)), iTxt = rowIndex(d, (r) => /^text\|/.test(r));
		await rowButton(iDia, 'input[type=checkbox]');
		await rowButton(iTxt, 'input[type=checkbox]');
		ok('M4 two rows selected turn Clear selected overrides on', (await dialog()).selOff === false);
		await click('#lpn_dialog_body button.lpn-ovl-clearsel');
		await settle(900);
		d = await dialog();
		ok('M4 the list counts 2: the multiplier and the 12 graph', !!d && d.msg === (await L('lpn_scenario_overrides')) + ': 2' &&
			JSON.stringify(d.groups.map((g) => g.cat)) === '["presentation","calculation"]', JSON.stringify(rowsOf(d)));
		const marks = await P.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-override').length);
		ok('M4 no override ring is left on the map', marks === 0, String(marks));
		const words = await P.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl="X1"]'); return t ? t.textContent : null; });
		ok('M4 Text X1 reads Base\'s words again', words === 'Source', JSON.stringify(words));
		sv = await stored();
		ok('M4 nothing of the diameter or the Text is stored', !vals(holder(sv, CHILD, 'physical'))['l:10'] && !vals(holder(sv, CHILD, 'text'))['t:X1'],
			JSON.stringify([holder(sv, CHILD, 'physical'), holder(sv, CHILD, 'text')]));

		console.log('--- M5. clear all ---');
		await click('#lpn_dialog_body button.lpn-ovl-clearall');
		await settle(500);
		const ask = await P.evaluate(() => (document.querySelector('#lpn_dialog .lpn-dialog-msg') || {}).textContent);
		const askWant = (await L('lpn_ovl_clear_all_ask')).replace('{n}', '2').replace('{name}', CHILD);
		ok('M5 Clear all overrides asks first: "' + askWant + '"', ask === askWant, ask);
		await pressDialog(await L('lpn_dialog_ok'));
		await settle(900);
		d = await dialog();
		ok('M5 the list reopens counting 0', !!d && d.msg === (await L('lpn_scenario_overrides')) + ': 0' && nrows(d) === 0, d && d.msg);
		ok('M5 the child shows only the inherited 31', (await shown()) === '31', await shown());
		await okDialog();
		await settle(400);
		const rows5 = await menuRows();
		ok('M5 the menu row is greyed at 0', rows5.some((r) => r.text === MO && r.off === true), JSON.stringify(rows5.filter((r) => r.text === MO)));
		sv = await stored();
		ok('M5 the child stores no multiplier and no set', holder(sv, CHILD, 'calculation').demandMultiplier === undefined && !setOf(holder(sv, CHILD, 'presentation')),
			JSON.stringify([holder(sv, CHILD, 'calculation'), holder(sv, CHILD, 'presentation')]));

		console.log('--- M6. one undo step per clear ---');
		const countNow = async () => { const r = (await menuRows()).filter((x) => x.text.replace(/\s*\(\d+\)$/, '') === CHILD)[0]; const m = r && /\((\d+)\)$/.exec(r.text); return m ? +m[1] : 0; };
		const undo = async () => { await P.mouse.click(5, 5).catch(() => {}); await P.keyboard.press('Escape'); await P.keyboard.press('Control+z'); await settle(900); };
		await undo();
		ok('M6 Undo brings back the multiplier and the 12 graph (2)', (await countNow()) === 2 && (await shown()) === '12,31', String(await countNow()) + ' ' + await shown());
		await undo();
		ok('M6 Undo again: the diameter and the Text too (4)', (await countNow()) === 4, String(await countNow()));
		await undo();
		ok('M6 Undo again: the 22 graph too (5)', (await countNow()) === 5 && (await shown()) === '12,22,31', String(await countNow()) + ' ' + await shown());
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 3).join(' | '));

		console.log('--- M7. a Spanish page ---');
		await a.goto('Looped-Network.php?lang=es');
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await settle(1500);
		ctx.strings = {};
		const MOes = await L('lpn_sm_list_overrides');
		await P.click('#lpn_scenario_btn');
		await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim() === MOes) { await r.click(); break; }
		}
		await settle(800);
		d = await dialog();
		ok('M7 the Spanish page opens the dialog on ' + CHILD + ' with its 5 rows', !!d && nrows(d) === 5 && d.clears === 5 && (await P.evaluate(() => document.documentElement.lang)).indexOf('es') === 0,
			JSON.stringify(d && { title: d.title, n: nrows(d) }));
		ok('no uncaught page errors on the Spanish page', a.errors.length === 0, a.errors.slice(0, 3).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
