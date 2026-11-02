// THE SOLVER SUB-HEADING UNDER SETTINGS > CALCULATION -- IN A REAL CHROMIUM. Run with:
//   node dev/lpn-spike/settings-solver-browser-harness.js
//   DUMP=1 node ...   also prints every row of the Calculation section under its sub-heading
//
// Tom, 2026-11-01: *"Shouldn't the first three settings under Calculation, Hydraulics be directly
// under Calculation or Calculation, Solver?"* The three are Recalculate automatically, Show the run
// progress box, and Use the built-in solver when possible: which solver answers, and when. The
// hydraulic model (friction method, accuracy, demand model, ...) stays under Hydraulics.
//
// Asserted on Net1 and on Net3, for each:
//   1. Calculation's sub-headings, in order: Units, Time, Solver, Hydraulics, Energy, Quality.
//   2. Under Solver, in order, exactly those three rows; Hydraulics opens on Friction method and
//      holds none of the three.
//   3. The index lists Solver between Time and Hydraulics and its link scrolls to the sub-heading.
//   4. Searching each of the three rows' names finds it, under Solver.
//   5. The Settings tab in Tables puts the two project settings (Recalculate automatically, the
//      built-in solver) under Minor heading Solver.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const U = require('./scenario-ui-helper.js');
U.takeBrowserLock('settings-solver-browser-harness', 'EC_SETSOLVER_LOCKED');
const REPO = U.REPO;
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function checkProject(a, L, label) {
	const P = a.page;
	console.log('--- ' + label + ' ---');
	await a.menuClick(await L('lpn_tool_settings'), 'project');
	await a.settle(900);
	const calc = await P.evaluate(() => {
		const sec = document.getElementById('lpn_set_sec_calc'), out = [];
		Array.from(sec.querySelectorAll('.lpn-set-sub')).forEach((sub) => {
			const rows = Array.from(sub.nextElementSibling.querySelectorAll('.lpn-set-row, label')).filter((r) => !r.closest('.lpn-set-row') || r.classList.contains('lpn-set-row'));
			out.push({ id: sub.id, text: sub.childNodes[0].textContent.replace(/\s*\?\s*$/, '').trim(),
				rows: Array.from(sub.nextElementSibling.querySelectorAll('[data-lpn-setting], .lpn-set-row')).filter((r) => r.getClientRects().length || true)
					.map((r) => r.textContent.replace(/\s+/g, ' ').replace(/\s*\?\s*$/, '').trim().slice(0, 48)) });
		});
		return out;
	});
	if (process.env.DUMP) { calc.forEach((s) => { console.log('  [' + s.text + ']'); s.rows.forEach((r) => console.log('      ' + r)); }); }
	const T = {};
	for (const k of ['lpn_view_units', 'lpn_time_menu', 'lpn_settings_solver', 'lpn_settings_hydraulics', 'lpn_settings_energy', 'lpn_settings_quality',
		'lpn_settings_auto_run', 'lpn_settings_runbox', 'lpn_settings_engine_native', 'bpn_method']) { T[k] = await L(k); }
	ok('Calculation has Solver, Units, Time, Hydraulics, Energy, Quality in that order',
		JSON.stringify(calc.map((s) => s.text)) === JSON.stringify([T.lpn_settings_solver, T.lpn_view_units, T.lpn_time_menu, T.lpn_settings_hydraulics, T.lpn_settings_energy, T.lpn_settings_quality]),
		JSON.stringify(calc.map((s) => s.text)));
	const solver = calc.filter((s) => s.id === 'lpn_set_sub_solver')[0], hyd = calc.filter((s) => s.id === 'lpn_set_sub_hydraulics')[0];
	const three = [T.lpn_settings_auto_run, T.lpn_settings_runbox, T.lpn_settings_engine_native];
	ok('Solver holds exactly Recalculate automatically, Show the run progress box, and the built-in solver, in that order',
		!!solver && solver.rows.length === 3 && three.every((t, i) => solver.rows[i].indexOf(t) === 0), solver && JSON.stringify(solver.rows));
	ok('Hydraulics opens on Friction method and holds none of the three',
		!!hyd && hyd.rows[0].indexOf(T.bpn_method) === 0 && !hyd.rows.some((r) => three.some((t) => r.indexOf(t) === 0)), hyd && JSON.stringify(hyd.rows.slice(0, 3)));

	const idx = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_index [data-sub]')).map((b) => ({ sub: b.getAttribute('data-sub'), text: b.textContent.trim() })));
	const ids = idx.map((b) => b.sub), iSol = ids.indexOf('lpn_set_sub_solver');
	ok('the index lists Solver first under Calculation, before Units', iSol > 0 && ids[iSol + 1] === 'lpn_set_sub_units' && idx[iSol].text === T.lpn_settings_solver, JSON.stringify(idx.slice(iSol - 1, iSol + 2)));
	await P.evaluate(() => { const b = document.querySelector('#lpn_setbox_index [data-sub="lpn_set_sub_solver"]'); if (b) { b.click(); } });
	await a.settle(700);
	const seen = await P.evaluate(() => {
		const s = document.getElementById('lpn_set_sub_solver'), c = document.getElementById('lpn_setbox_content');
		const r = s.getBoundingClientRect(), cr = c.getBoundingClientRect();
		return r.bottom > cr.top && r.top < cr.bottom;
	});
	ok('the Solver link brings the sub-heading into view', seen);

	for (const t of three) {
		await P.fill('#lpn_setbox_filter', t);
		await a.settle(500);
		const where = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-row'))
			.filter((r) => r.getClientRects().length).map((r) => {
				const sub = r.closest('.lpn-set-subbody').previousElementSibling;
				return { id: sub.id, text: r.textContent.replace(/\s+/g, ' ').trim() };
			}));
		ok('searching "' + t + '" finds it under Solver', where.some((w) => w.id === 'lpn_set_sub_solver' && w.text.indexOf(t) === 0), JSON.stringify(where.slice(0, 3)));
	}
	await P.fill('#lpn_setbox_filter', '');
	await a.settle(300);
	await P.evaluate(() => { const x = document.getElementById('lpn_setbox_close'); if (x) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
	await a.settle(400);

	await a.toolbarClick(await L('lpn_pane_toggle'));
	await a.settle(700);
	await P.evaluate(() => { const t = document.getElementById('lpn_pane_tab_settings'); if (t) { t.click(); } });
	await a.settle(900);
	const tbl = await P.evaluate(() => {
		const t = document.querySelector('#lpn_pane_settings table');
		if (!t) { return null; }
		const heads = Array.from(t.querySelectorAll('thead th')).map((th) => th.textContent.replace(/­/g, '').trim());
		const rows = Array.from(t.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children).map((td) => td.textContent.replace(/­/g, '').trim()));
		return { heads, rows };
	});
	const iMinor = tbl ? tbl.heads.indexOf(await L('lpn_settings_table_minor')) : -1, iSet = tbl ? tbl.heads.indexOf(await L('lpn_settings_table_setting')) : -1;
	const rowOf = (name) => tbl && tbl.rows.filter((r) => r[iSet] === name)[0];
	for (const name of [T.lpn_settings_auto_run, T.lpn_settings_engine_native]) {
		const r = rowOf(name);
		ok('Settings table: "' + name + '" is under Minor heading Solver', !!r && r[iMinor] === T.lpn_settings_solver, r && JSON.stringify(r.slice(0, 4)));
	}
	const fr = rowOf(T.bpn_method);
	ok('Settings table: Friction method stays under Hydraulics', !!fr && fr[iMinor] === T.lpn_settings_hydraulics, fr && JSON.stringify(fr.slice(0, 4)));
	await a.toolbarClick(await L('lpn_pane_toggle'));
	await a.settle(400);
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
		const ctx = await U.openNet1(browser, 'settings-solver');
		const L = (k) => ctx.a.lang(k);
		await checkProject(ctx.a, L, 'Net1');
		ok('no page errors on Net1', ctx.a.errors.length === 0, ctx.a.errors.slice(0, 2).join(' | '));
		const b = await Session.open(browser, 'B', { viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php');
		await b.answerTrainingPanel().catch(() => {});
		await b.openExampleCard(await L('lpn_ex_net3_title'));
		await b.settle(2500);
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await checkProject(b, L, 'Net3');
		ok('no page errors on Net3', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
