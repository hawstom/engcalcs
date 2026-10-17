// THE GUIDE'S NOTES SECTION AND THE SENTENCES IT SHARES WITH ABOUT (Task 785).
//   node dev/lpn-spike/user-guide-notes-harness.js   (takes the browser lock itself)
//
//   1. Every interface name the notes quote is the language file's own.
//   2. The Notes section holds its five terms in order, and neither Notes nor About says "you" or "your".
//   3. The built-in solver note agrees with the setting's own tip.
//   4. The engine note: the run report prints the version the note says it prints.
//   5. Color bands: a scenario and a later time step show the legend Base showed.
//   6. The pump curve note, on the real EPANET engine: the Net1 pump's one-point curve, its head at zero
//      flow and highest flow, and the negative head and the warning at 3500 gpm.
//   7. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, finish } = L;
const NAME = 'user-guide-notes-harness';
U.takeBrowserLock(NAME, 'EC_UGNT_LOCKED');

const TERMS = ['lpn_notes_3_term', 'lpn_notes_5_term', 'lpn_notes_color_term', 'lpn_notes_engine_term', 'lpn_guide_nt_example_term'];
const INP = (q) => '[TITLE]\n[JUNCTIONS]\n J 0 ' + q + '\n[RESERVOIRS]\n R 0\n[PUMPS]\n PU R J HEAD 1\n[CURVES]\n 1 1500 250\n[OPTIONS]\n Units GPM\n Headloss H-W\n[END]\n';
async function pumpAt(q) {
	const mod = await import('file://' + path.join(L.REPO, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const m = new mod.Project(ws);
	ws.writeFile('a.inp', INP(q));
	m.open('a.inp', 'a.rpt', 'a.out');
	m.solveH();
	const head = -m.getLinkValue(m.getLinkIndex('PU'), 10);
	m.close();
	return head;
}
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the notes quote is the language file\'s');
	checkQuotes({
		lpn_notes_1_def: ['lpn_settings_engine_native'],
		lpn_notes_3_def: ['lpn_tool_file', 'lpn_file_save', 'lpn_lock_ask', 'lpn_lock_open_readonly', 'lpn_lock_break'],
		lpn_notes_5_def: ['lpn_menu_project', 'lpn_library_menu', 'lpn_curve_kind_head', 'lpn_library_curve_equation'],
		lpn_guide_nt_example_def: ['lpn_menu_project', 'lpn_library_menu']
	});
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 500);
		await openGuide(a);
		console.log('\n2. The section');
		const sec = await P.evaluate(() => ({
			dts: Array.from(document.querySelectorAll('[data-guide-section="notes"] > dl > dt')).map((d) => d.textContent.trim()),
			text: ['notes', 'about'].map((s) => document.querySelector('[data-guide-section="' + s + '"]').innerText).join(' ')
		}));
		ok('Notes holds its five terms, in order', JSON.stringify(sec.dts) === JSON.stringify(TERMS.map(enString)), JSON.stringify(sec.dts));
		ok('neither Notes nor About says "you" or "your"', !/\byou(r|rs|rself)?\b/i.test(sec.text), (sec.text.match(/.{20}\byou\w*\b.{10}/i) || [''])[0]);

		console.log('\n3. The built-in solver');
		const tip = plain(enString('lpn_settings_engine_native_tip')), note = plain(enString('lpn_notes_1_def'));
		// Since Task 733 phase 1 (2026-10-17) the built-in solver solves PRV, PSV and FCV; only PBV and GPV still need EPANET.
		ok('the setting\'s tip and the note both name extended period simulation and the valves only EPANET solves, and both give the rest to the EPANET solver', [tip, note].every((t) => /extended period/.test(t) && /PBV/.test(t) && /GPV/.test(t) && !/PRV, PSV/.test(t) && /EPANET solver/.test(t)));

		console.log('\n4. The engine note');
		const engine = plain(enString('lpn_notes_engine_def'));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);
		await P.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => P.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'frames', 120000);
		await settle(800);
		await a.menuClickSub(await T('lpn_reports_menu'), await T('lpn_reports_epanet'), 'project');
		await settle(1500);
		const ver = await P.evaluate(() => (document.getElementById('lpn_rptbox').innerText.match(/Version\s+(\d+\.\d+\.\d+)/) || [])[1]);
		ok('the run report prints 2.3.05 and the note says so, and that the engine is 2.3.5', ver === '2.3.05' && /2\.3\.05/.test(engine) && /OWA-EPANET 2\.3\.5/.test(engine), String(ver));
		await P.evaluate(() => document.querySelector('#lpn_rptbox .lpn-popover-x').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));

		console.log('\n5. Color bands');
		await a.menuClickSub(await T('lpn_graphs_menu'), await T('lpn_contour_menu'), 'project');
		await settle(1500);
		const legend = () => P.evaluate(() => { const e = document.getElementById('lpn_color_legend'); return e ? e.innerText.split('\n').filter((l) => /\d/.test(l) && /[<≥–]/.test(l)).join(' | ') : ''; });
		const at = async (h) => { await P.evaluate((s) => EngCalcs.lpnTimeGoTo(s), h * 3600); await settle(700); return { t: await P.evaluate(() => EngCalcs.lpnTimeNow()), l: await legend() }; };
		const b0 = await at(0), b12 = await at(12);
		ok('Base shows the same band boundaries at 0:00 and 12:00', b0.t === 0 && b12.t === 43200 && b0.l.length > 10 && b0.l === b12.l, b0.l + ' / ' + b12.l);
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await settle(1500);
		await P.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await settle(4000);
		const s12 = await at(12);
		ok('a new scenario shows the boundaries of Base', s12.l === b0.l, s12.l);
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n6. The pump curve, on the real engine');
		const fit = await (async () => { const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js')); return Session; })();
		const f = await (async () => { const x = require(path.join(L.REPO, 'js', 'lpn-solver.js')); return x.lpnPumpFromCurve([[1500, 250]]); })();
		const qMax = Math.pow(f.h0 / f.a, 1 / f.b);
		const h3500 = f.h0 - f.a * Math.pow(3500, f.b);
		const ex = plain(enString('lpn_guide_nt_example_def'));
		ok('one point, 1500 gpm at 250 ft: head at zero flow ' + f.h0.toFixed(1) + ', highest flow ' + Math.round(qMax) + ', head at 3500 gpm ' + h3500.toFixed(1), ex.indexOf(f.h0.toFixed(1) + ' ft') >= 0 && ex.indexOf(Math.round(qMax) + ' gpm') >= 0 && ex.indexOf(h3500.toFixed(1).replace('-', '−') + ' ft') >= 0);
		const e1500 = await pumpAt(1500), e3500 = await pumpAt(3500);
		ok('EPANET agrees: 250 ft at the design flow and ' + e3500.toFixed(1) + ' ft at 3500 gpm', Math.abs(e1500 - 250) < 0.01 && Math.abs(e3500 - h3500) < 0.05, e1500 + ' / ' + e3500);
		void fit;

		console.log('\n7. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await b.page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="notes"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the Spanish page shows the five Notes terms, the new one as the Spanish file has it', es.length === 5 && es[4] === esString(TERMS[4]) && es[0] !== enString(TERMS[0]), JSON.stringify(es));
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
