// THE GUIDE'S RUN REPORT, STATUS CHANGES, AND FULL REPORT CHAPTERS (Task 785).
//   node dev/lpn-spike/user-guide-reports-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1, which has been calculated over its 24-hour period when it opens:
//   1. Every interface name the chapters quote is the language file's own.
//   2. Each entry has the box's paragraph and the chapter's two terms.
//   3. Run: the counts, formula, time step, and duration of the example; the Copy button.
//   4. Status changes: the seven rows of the example, in time order, as the chapter says.
//   5. Full report: the columns the chapter lists in its order, the 600 rows, Junction 11 at 0:00, the
//      step list, and the Download CSV and Print report buttons.
//   6. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, entry, esEntryCheck, finish } = L;
const NAME = 'user-guide-reports-harness';
U.takeBrowserLock(NAME, 'EC_UGRP_LOCKED');

const RR = ['lpn_guide_rr_what_term', 'lpn_guide_scn_example_term'], ST = ['lpn_guide_st_what_term', 'lpn_guide_scn_example_term'], FR = ['lpn_guide_cmp_cols_term', 'lpn_guide_scn_example_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapters quote is the language file\'s');
	checkQuotes({
		lpn_guide_rr_what_def: ['lpn_menu_project', 'lpn_reports_menu', 'lpn_reports_epanet'],
		lpn_guide_st_what_def: ['lpn_menu_project', 'lpn_reports_menu', 'lpn_reports_status'],
		lpn_guide_fr_what_def: ['lpn_menu_project', 'lpn_reports_menu', 'lpn_full_download_csv', 'lpn_full_print']
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
		console.log('\n2. The entries');
		for (const [id, terms, minParas] of [['lpn_rptbox', RR, 1], ['lpn_status_box', ST, 1], ['lpn_full_box', FR, 1]]) {
			const en = await entry(P, id);
			ok(id + ' holds the chapter\'s two terms after the box\'s paragraph', !!en && terms.every((k, i) => en.dts[i] === enString(k)) && en.paras >= minParas, en && JSON.stringify(en.dts));
		}
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);
		await P.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => P.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'frames', 120000);
		await settle(800);
		const open = async (key, id) => { await a.menuClickSub(await T('lpn_reports_menu'), await T(key), 'project'); await settle(1500); return id; };
		const close = (id) => P.evaluate((i) => { const b = document.getElementById(i).querySelector('.lpn-popover-x'); b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }, id);

		console.log('\n3. Run');
		await open('lpn_reports_epanet', 'lpn_rptbox');
		const run = await P.evaluate(() => document.getElementById('lpn_rptbox').innerText.replace(/\s+/g, ' '));
		const grab = (re) => (run.match(re) || [])[1];
		const rex = plain(enString('lpn_guide_rr_example_def'));
		const counts = ['Junctions', 'Reservoirs', 'Tanks', 'Pipes', 'Pumps', 'Valves'].map((k) => grab(new RegExp('Number of ' + k + '\\s*\\.+\\s*(\\d+)')));
		ok('the summary counts the example network\'s nine kinds of asset as the chapter says', counts.join() === '9,1,1,12,1,0' && ['9 junctions', '1 reservoir', '1 tank', '12 pipes', '1 pump', '0 valves'].every((w) => rex.indexOf(w) >= 0), counts.join() + ' ' + (run.match(/Number of Junctions.{0,200}/)||[''])[0]);
		ok('...Hazen-Williams, a hydraulic timestep of 1.00 hrs, and a total duration of 24.00 hrs', grab(/Headloss Formula \.+\s*(\S+)/) === 'Hazen-Williams' && grab(/Hydraulic Timestep \.+\s*([\d.]+ hrs)/) === '1.00 hrs' && grab(/Total Duration \.+\s*([\d.]+ hrs)/) === '24.00 hrs' && ['Hazen-Williams', '1.00 hrs', '24.00 hrs'].every((w) => rex.indexOf(w) >= 0), run.slice(0, 120));
		const copyBtn = await P.evaluate(() => (document.getElementById('lpn_rptbox_copy') || {}).textContent);
		ok('the Copy button is there', !!copyBtn);
		await close('lpn_rptbox');

		console.log('\n4. Status changes');
		await open('lpn_reports_status', 'lpn_status_box');
		const rows = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_status_report tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim())).filter((r) => /^\d+:\d\d$/.test(r[0])));
		const pretty = (r) => r[1].replace(/^(\w+) (\w+) now (.*)$/, '$1 $2 now $3');
		const sx = plain(enString('lpn_guide_st_example_def'));
		const times = rows.map((r) => r[0]);
		ok('seven rows, in time order', rows.length === 7 && times.every((t, i) => i === 0 || parseInt(t) >= parseInt(times[i - 1])), JSON.stringify(rows));
		const tank = rows.filter((r) => /Tank N2/.test(r[1])).map((r) => r[0] + ' ' + r[1].split('now ')[1]);
		const pump = rows.filter((r) => /Pump L9/.test(r[1])).map((r) => r[0] + ' ' + r[1].split('now ')[1]);
		ok('Tank N2: filling 1:00, emptying 11:00, filling 16:00, emptying 22:00 and Pump L9: closed 10:00, open 15:00, closed 21:00, as the chapter says',
			tank.join() === '1:00 filling,11:00 emptying,16:00 filling,22:00 emptying' && pump.join() === '10:00 closed,15:00 open,21:00 closed'
			&& ['1:00', '11:00', '16:00', '22:00', '10:00', '15:00', '21:00', 'Tank N2', 'Pump L9'].every((w) => sx.indexOf(w) >= 0), JSON.stringify([tank, pump]));
		await close('lpn_status_box');

		console.log('\n5. Full report');
		await open('lpn_reports_full', 'lpn_full_box');
		const fr = await P.evaluate(() => ({ head: Array.from(document.querySelectorAll('#lpn_full_report table th')).map((t) => t.textContent.replace(/\s*\(.*\)\s*$/, '').trim()), rows: Array.from(document.querySelectorAll('#lpn_full_report table tbody tr')).map((r) => Array.from(r.cells).map((c) => c.textContent.trim())), steps: Array.from(document.querySelectorAll('#lpn_full_step option')).map((o) => o.textContent), text: document.getElementById('lpn_full_box').innerText.replace(/\s+/g, ' ') }));
		const fx = plain(enString('lpn_guide_fr_what_def'));
		const colNames = fr.head;
		ok('the columns match the chapter\'s list, in order', colNames.join() === 'Type,ID,Demand,Head,Pressure,Chlorine concentration,Flow,Velocity,Head loss,Pump head,Status' && fx.indexOf(colNames.slice(0, 10).join(', ') + ', and ' + colNames[10]) >= 0, JSON.stringify(colNames));
		ok('the box says 600 rows: 24 assets at 25 steps, 0:00 to 24:00', fr.text.indexOf('(600)') >= 0 && fr.rows.length === 24 && fr.steps.length === 25 && fr.steps[0] === '0:00' && fr.steps[24] === '24:00', JSON.stringify([fr.rows.length, fr.steps.length]));
		const j11 = fr.rows.filter((r) => r[0] === 'Junction' && r[1] === '11')[0];
		const fex = plain(enString('lpn_guide_fr_example_def'));
		ok('at 0:00 Junction 11 has demand 150, head 985.23, pressure 119.26, as the chapter says', !!j11 && j11[2] === '150' && j11[3] === '985.23' && j11[4] === '119.26' && ['150 gpm', '985.23 ft', '119.26 psi', '600 rows', '25 reporting'].every((w) => fex.indexOf(w) >= 0), JSON.stringify(j11));
		const btns = await P.evaluate(() => [document.getElementById('lpn_full_csv').textContent.trim(), document.getElementById('lpn_full_print').textContent.trim()]);
		ok('Download CSV and Print report are the two buttons', btns.join() === [await T('lpn_full_download_csv'), await T('lpn_full_print')].join(), JSON.stringify(btns));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n6. Another language');
		await esEntryCheck(browser, NAME + '-1', 'lpn_rptbox', RR);
		await esEntryCheck(browser, NAME + '-2', 'lpn_status_box', ST);
		await esEntryCheck(browser, NAME + '-3', 'lpn_full_box', FR);
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
