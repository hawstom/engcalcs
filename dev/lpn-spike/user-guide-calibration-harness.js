// THE GUIDE'S CALIBRATION CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-calibration-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1, calculated over its 24-hour period:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The entry has the box's paragraph and the chapter's three terms.
//   3. The Parameter list holds the six parameters the chapter names, in order, with Pressure chosen.
//   4. The example file: the counts, the skipped location, the unreadable line, and every Statistics number.
//   5. The three pages are there, and the Correlation plot has one point for each measurement compared.
//   6. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, entry, esEntryCheck, finish } = L;
const NAME = 'user-guide-calibration-harness';
U.takeBrowserLock(NAME, 'EC_UGCA_LOCKED');

const TERMS = ['lpn_guide_cal_what_term', 'lpn_guide_cal_file_term', 'lpn_guide_cal_example_term'];
const FILE = ['; Field pressures, psi', '11  0:00   118.5', '    12:00  121.0', '31  6:00   110.2', '    18     108.7', '99  0      50', 'bad line here', ''].join('\n');
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_cal_what_def: ['lpn_menu_project', 'lpn_reports_menu', 'lpn_reports_calib', 'lpn_calib_param', 'lpn_calib_load', 'lpn_calib_tab_stats', 'lpn_calib_tab_corr', 'lpn_calib_tab_means', 'lpn_calib_network']
	});
	const tipRules = plain(enString('lpn_calib_load_tip')).split(/(?<=\.) /).slice(0, 4);
	ok('the file description carries the first four sentences of the Load button tip (its format rules)', tipRules.length === 4 && tipRules.every((w) => plain(enString('lpn_guide_cal_file_def')).indexOf(w.replace(/^A text file with /, '')) >= 0 || plain(enString('lpn_guide_cal_file_def')).indexOf(w) >= 0), JSON.stringify(tipRules));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const file = path.join(os.tmpdir(), 'ec-calib-harness-' + process.pid + '.txt');
	fs.writeFileSync(file, FILE);
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 500);
		await openGuide(a);
		console.log('\n2. The entry');
		const en = await entry(P, 'lpn_calib_box');
		ok('lpn_calib_box holds the chapter\'s three terms after the box\'s paragraph', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)) && en.paras >= 1, en && JSON.stringify(en.dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);
		await P.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => P.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'frames', 120000);
		await settle(800);
		await a.menuClickSub(await T('lpn_reports_menu'), await T('lpn_reports_calib'), 'project');
		await settle(1200);

		console.log('\n3. The Parameter list');
		const opts = await P.evaluate(() => ({ o: Array.from(document.querySelectorAll('#lpn_calib_param option')).map((x) => x.textContent), v: document.getElementById('lpn_calib_param').value }));
		const what = plain(enString('lpn_guide_cal_what_def'));
		ok('six parameters, in the order the chapter lists them, and Pressure chosen', opts.o.length === 6 && what.indexOf(opts.o.slice(0, 5).join(', ') + ', or ' + opts.o[5]) >= 0 && opts.v === 'pressure', JSON.stringify(opts));

		console.log('\n4. The example file');
		await P.setInputFiles('#lpn_calib_file', file);
		await settle(1000);
		const rep = await P.evaluate(() => ({
			text: document.getElementById('lpn_calib_report').innerText.replace(/\s+/g, ' '),
			rows: Array.from(document.querySelectorAll('#lpn_calib_page tbody tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim())),
			missing: (document.getElementById('lpn_calib_missing') || {}).textContent, bad: (document.getElementById('lpn_calib_bad') || {}).textContent,
			units: (document.getElementById('lpn_calib_units_note') || {}).textContent
		}));
		const ex = plain(enString('lpn_guide_cal_example_def'));
		ok('5 measurements at 3 locations, Junction 99 not in the network, 1 skipped, 1 unreadable line', /measurements \(5\) at locations \(3\)/.test(rep.text) && /: 99\.$/.test(rep.missing) && /Measurements skipped[^:]*: 1\./.test(rep.text) && /: 7$/.test(rep.bad) && /\b5 measurements at 3 locations/.test(ex) && /Junction 99/.test(ex) && /\b1 measurement skipped/.test(ex), rep.missing + ' | ' + rep.bad);
		ok('the values are read in psi, as the chapter says', /: psi\.$/.test(rep.units) && ex.indexOf('psi') >= 0, rep.units);
		const r11 = rep.rows.filter((r) => r[0] === '11')[0], r31 = rep.rows.filter((r) => r[0] === '31')[0], net = rep.rows.filter((r) => r[0] === 'Network')[0];
		ok('Junction 11: 2 observations, means 119.75 and 116.53, errors 3.98 and 5.12, as the chapter says', !!r11 && r11.slice(1).join() === '2,119.75,116.53,3.98,5.12' && ex.indexOf(r11.slice(2).join(', ').replace(/^(\S+), (\S+), (\S+), (\S+)$/, '$1 psi, a computed mean of $2 psi, a mean error of $3, and an RMS error of $4')) >= 0, JSON.stringify(r11));
		ok('Junction 31: 109.45, 118.71, 9.26, 9.79 and the Network row: 4 observations, 6.62, 7.81', !!r31 && !!net && r31.slice(1).join() === '2,109.45,118.71,9.26,9.79' && net.slice(1).join() === '4,114.60,117.62,6.62,7.81' && ex.indexOf([r31[2], r31[3], r31[4]].join(', ') + ', and ' + r31[5]) >= 0 && ex.indexOf(net[1] + ' observations') >= 0 && ex.indexOf(net[4]) >= 0 && ex.indexOf(net[5]) >= 0, JSON.stringify([r31, net]));

		console.log('\n5. The three pages');
		const tabs = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_calib_report [role=tab]')).map((b) => b.textContent));
		ok('Statistics, Correlation plot, Mean comparisons, in that order', tabs.join() === [await T('lpn_calib_tab_stats'), await T('lpn_calib_tab_corr'), await T('lpn_calib_tab_means')].join(), JSON.stringify(tabs));
		await P.evaluate(() => document.getElementById('lpn_calib_tab_corr').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(500);
		const plot = await P.evaluate(() => ({ points: document.querySelectorAll('#lpn_calib_page .lpn-calib-point').length, diag: document.querySelectorAll('#lpn_calib_page .lpn-calib-diagonal').length }));
		ok('the Correlation plot has 4 points (one for each measurement compared) and the diagonal', plot.points === 4 && plot.diag === 1, JSON.stringify(plot));
		await P.evaluate(() => document.getElementById('lpn_calib_tab_means').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(500);
		const bars = await P.evaluate(() => document.querySelectorAll('#lpn_calib_page .lpn-calib-bar').length);
		ok('Mean comparisons has a pair of bars for each of the 2 locations', bars === 4, String(bars));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n6. Another language');
		await esEntryCheck(browser, NAME + '-1', 'lpn_calib_box', TERMS);
	} catch (e) {
		console.error(e && e.stack || e);
		ok('the harness ran to the end', false, String(e && e.message));
	} finally {
		try { fs.unlinkSync(file); } catch (e) { /* gone */ }
		await browser.close().catch(() => {});
		env.stopServer();
	}
	process.exit(finish(NAME));
}
main();
