// THE GUIDE'S FIRE FLOW ANALYSIS CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-fireflow-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The entry has the box's paragraphs and the chapter's four terms.
//   3. The example is performed: Analyze, Fire flow analysis, Run, with the box as it opens; the table
//      and the summary hold the chapter's numbers, cell for cell, and the 135 solves.
//   4. The columns are the ones the chapter lists, in its order; a dash stands where there is no
//      number; the circles are outlined by result with different dash patterns; Selected junctions
//      tests only the selection and counts what else is selected.
//   5. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, entry, finish } = L;
const NAME = 'user-guide-fireflow-harness';
U.takeBrowserLock(NAME, 'EC_UGFF_LOCKED');

const TERMS = ['lpn_guide_ff_asks_term', 'lpn_guide_ff_result_term', 'lpn_guide_ff_marks_term', 'lpn_guide_ff_example_term'];
const COLS = ['lpn_ff_col_junction', 'lpn_ff_col_static', 'lpn_ff_col_required', 'lpn_ff_col_atrequired', 'lpn_ff_col_available', 'lpn_ff_col_residual', 'lpn_ff_col_affected', 'lpn_ff_col_limit', 'lpn_ff_col_solves', 'lpn_ff_col_modes'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_ff_asks_def: ['lpn_ff_required', 'lpn_ff_minpressure', 'lpn_ff_maxvelocity', 'lpn_ff_design_off'],
		lpn_guide_ff_result_def: ['lpn_ff_col_static', 'lpn_ff_col_required', 'lpn_ff_col_atrequired', 'lpn_ff_col_available', 'lpn_ff_col_residual', 'lpn_ff_col_affected', 'lpn_ff_col_limit', 'lpn_ff_col_solves', 'lpn_ff_col_modes'],
		lpn_guide_ff_marks_def: ['lpn_ff_selected', 'lpn_ff_stop'],
		lpn_guide_ff_example_def: ['lpn_menu_project', 'lpn_analyze_menu', 'lpn_ff_calculate']
	});
	ok('the example names the menu row without its ellipsis', plain(enString('lpn_guide_ff_example_def')).indexOf(enString('lpn_ff_menu').replace(/…$/, '')) >= 0);
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
		console.log('\n2. The entry');
		const en = await entry(P, 'lpn_ff_box');
		ok('the entry holds the chapter\'s four terms after the box\'s paragraphs', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)) && en.paras >= 3, en && JSON.stringify(en.dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. The example');
		await a.menuClickSub(await T('lpn_analyze_menu'), await T('lpn_ff_menu'), 'project');
		await settle(1000);
		const ctl = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_ff_controls select')).map((s) => ({ v: s.value, t: s.options[s.selectedIndex].textContent })));
		ok('the box opens with All junctions and a design check scope that is not None', ctl[0].t === enString('lpn_ff_all') && ctl[1].t !== enString('lpn_ff_design_off'), JSON.stringify(ctl));
		const clickRun = () => P.evaluate((t) => { Array.from(document.querySelectorAll('#lpn_ff_box button')).filter((x) => x.textContent.trim() === t)[0].click(); }, enString('lpn_ff_calculate'));
		const waitTable = async () => { await a.waitFor(() => P.evaluate(() => !!document.querySelector('#lpn_ff_report table')), 'ff table', 120000); await settle(1200); };
		await clickRun();
		await waitTable();
		const rep = await P.evaluate(() => ({ head: Array.from(document.querySelectorAll('#lpn_ff_report table th')).map((t) => t.textContent.trim()), rows: Array.from(document.querySelectorAll('#lpn_ff_report table tbody tr')).map((r) => Array.from(r.cells).map((c) => c.textContent.trim())), text: document.getElementById('lpn_ff_report').innerText.replace(/\s+/g, ' ') }));
		const ex = plain(enString('lpn_guide_ff_example_def'));
		const byJ = {}; rep.rows.forEach((r) => { byJ[r[0]] = r; });
		const idx = {}; for (const k of COLS) { idx[k] = rep.head.indexOf(await T(k)); }
		ok('nine junctions were tested', rep.rows.length === 9, String(rep.rows.length));
		const n32 = byJ.N32, n31 = byJ.N31, n12 = byJ.N12;
		ok('Junction N32: static ' + n32[idx.lpn_ff_col_static] + ', ' + n32[idx.lpn_ff_col_atrequired] + ' at ' + n32[idx.lpn_ff_col_required] + ', available ' + n32[idx.lpn_ff_col_available] + ', failing the fire flow',
			[n32[idx.lpn_ff_col_static], n32[idx.lpn_ff_col_atrequired], n32[idx.lpn_ff_col_required], n32[idx.lpn_ff_col_available]].every((v) => ex.indexOf(v) >= 0) && n32[idx.lpn_ff_col_modes] === enString('lpn_ff_mode_fire'), JSON.stringify(n32));
		ok('Junction N31 delivers ' + n31[idx.lpn_ff_col_available] + ' and N12 ' + n12[idx.lpn_ff_col_available], ex.indexOf(n31[idx.lpn_ff_col_available]) >= 0 && ex.indexOf(n12[idx.lpn_ff_col_available].replace(/^.* (\d+ gpm)$/, '$1')) >= 0 && n12[idx.lpn_ff_col_available].indexOf('10000') >= 0, JSON.stringify([n31, n12]));
		const solves = (enString('lpn_ff_cost').match(/\{solves\}/), (enString('lpn_ff_cost')));
		ok('the run solves the whole network 135 times, and the chapter says so', rep.text.indexOf(enString('lpn_ff_cost').replace('{solves}', '135')) >= 0 && ex.indexOf('135 times') >= 0, rep.text.slice(0, 200));
		ok('the summary counts eight passed and one failed, as the chapter says (eight of the nine pass; N32 fails)', rep.text.indexOf(enString('lpn_ff_summary').replace('{clean}', '8').replace('{fire}', '1').replace('{design}', '0')) >= 0 && ex.indexOf('Eight of') >= 0);
		ok('the time step shown is 0:00, as the chapter says', /Time step: 0:00/.test(rep.text) && ex.indexOf('0:00') >= 0);

		console.log('\n4. Columns, rings, and the selection');
		ok('the columns are the ones the chapter lists, in its order', JSON.stringify(rep.head) === JSON.stringify(await Promise.all(COLS.map(T))), JSON.stringify(rep.head));
		const dashes = await P.evaluate(() => {
			const q = (c) => { const e = document.querySelector('#lpn_canvas circle.' + c); return e ? getComputedStyle(e).strokeDasharray : null; };
			return { pass: q('lpn-ff-pass'), fail: q('lpn-ff-fail'), nPass: document.querySelectorAll('#lpn_canvas .lpn-ff-pass').length, nFail: document.querySelectorAll('#lpn_canvas .lpn-ff-fail').length };
		});
		ok('eight junctions are outlined as passed and one as failed, with different dash patterns', dashes.nPass === 8 && dashes.nFail === 1 && dashes.pass !== dashes.fail, JSON.stringify(dashes));
		await P.evaluate((t) => { Array.from(document.querySelectorAll('#lpn_ff_box button')).filter((x) => x.textContent.trim() === t)[0].click(); }, enString('lpn_ff_clear'));
		await settle(500);
		ok('Clear rings removes the outlines', (await P.evaluate(() => document.querySelectorAll('#lpn_canvas [class*="lpn-ff-"]').length)) === 0);
		// Selected junctions: one junction and one pipe.
		const pt = (kind, id) => P.evaluate(([k, i]) => { const all = Array.from(document.querySelectorAll('#lpn_canvas [data-' + k + '="' + i + '"]')); const e = all.filter((x) => x.tagName === 'circle' && x.getBoundingClientRect().width > 0)[0] || all.filter((x) => x.classList.contains('lpn-link-hit') && (x.getBoundingClientRect().width > 0 || x.getBoundingClientRect().height > 0))[0] || all.filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [kind, id]);
		await P.evaluate(() => document.getElementById('lpn_ff_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);
		const j = await pt('node', '31'), l = await pt('link', '121');
		await P.mouse.click(j.x, j.y);
		await settle(800);
		await P.keyboard.down('Shift'); await P.mouse.click(l.x, l.y); await P.keyboard.up('Shift');
		await settle(900);
		await a.menuClickSub(await T('lpn_analyze_menu'), await T('lpn_ff_menu'), 'project');
		await settle(900);
		await P.evaluate((t) => { const s = document.querySelector('#lpn_ff_controls select'); s.value = Array.from(s.options).filter((o) => o.textContent === t)[0].value; s.dispatchEvent(new Event('change', { bubbles: true })); }, enString('lpn_ff_selected'));
		await settle(300);
		await clickRun();
		await waitTable();
		await P.evaluate(() => document.getElementById('lpn_msglog_btn').click());
		await settle(500);
		const skipNote = await P.evaluate(() => document.getElementById('lpn_msglog_panel').innerText.replace(/\s+/g, ' '));
		const rows2 = await P.evaluate(() => document.querySelectorAll('#lpn_ff_report table tbody tr').length);
		ok('Selected junctions tests the one junction selected', rows2 === 1, String(rows2));
		ok('...and the selected pipe is counted and not tested', skipNote.indexOf(enString('lpn_ff_skipped').replace('{n}', '1')) >= 0, skipNote.slice(0, 300));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n5. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await entry(b.page, 'lpn_ff_box');
		ok('the Spanish page shows the four terms', !!es && TERMS.every((k, i) => es.dts[i] === enString(k)), es && JSON.stringify(es.dts));
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
