// EVERY PRINTED REPORT FITS ITS SHEET AND BREAKS NO WORD (Task 829, Tom 2026-10-25: *"It works. Some of
// the column widths need tweaking."* after printing the reports to PDF).
//   node dev/lpn-spike/report-print-widths-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1, 24-hour clock, two scenarios. Each report box's Print report sheet is laid out as paper:
// print media, a viewport as wide as the printable width of US Letter (1 in margins) and of A4.
// For each sheet: no table is wider than the sheet; no WORD of any cell, heading or figure is broken
// across lines (a heading may wrap only at its spaces); and a figure is never parted from its unit.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RPTWID_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('report-print-widths-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const dock = require(path.join(REPO, 'dev', 'lpn-spike', 'dock-boxes.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		d.scenarios.push({ id: 'smax', name: 'Max day', overrides: {}, demandMultiplier: 1.8 });
		d.project = Object.assign({}, d.project, { name: 'Elm Street', activeScenario: 'base' });
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block', acceptDownloads: true });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await page.setViewportSize({ width: 1700, height: 1000 });
		await a.settle(2500);
		await page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net1 EPS frames', 120000);

		// Capture what the page puts on the clipboard and on paper.
		await page.evaluate(() => {
			window.__clip = null; window.__print = null;
			Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
				write: async (items) => {
					const it = items[0], out = {};
					for (const t of it.types) { out[t] = await (await it.getType(t)).text(); }
					window.__clip = out;
				},
				writeText: async (t) => { window.__clip = { 'text/plain': t }; }
			} });
			window.print = function () { window.__printed = true; };
		});
		const runLabel = await a.lang('lpn_ff_calculate');
		const pressRun = async (controls, label) => {
			const btns = await page.$$(controls + ' button.lpn-ff-run');
			for (const b of btns) { if (((await b.textContent()) || '').trim() === label) { await b.click(); return; } }
			throw new Error('no ' + label + ' button in ' + controls);
		};
		const waitReport = (sel) => a.waitFor(() => page.evaluate((s) => {
			const r = document.querySelector(s), box = document.getElementById('lpn_ff_run_box');
			return !!r && !!r.querySelector('tbody tr') && (!box || box.style.display === 'none');
		}, sel), 'a table in ' + sel, 300000);

		const PAPERS = [['US Letter', 624], ['A4', 601]];
		const measure = (paperW) => page.evaluate((W) => {
			const area = document.getElementById('lpn_print_area');
			if (!area) { return null; }
			const sheet = area.getBoundingClientRect().width, out = { sheet, tables: [], broken: [], parted: [] };
			area.querySelectorAll('table').forEach((t, ti) => {
				const r = t.getBoundingClientRect();
				out.tables.push({ i: ti, width: r.width, right: r.right - area.getBoundingClientRect().left, cols: t.rows[0] ? t.rows[0].cells.length : 0 });
				Array.from(t.querySelectorAll('th, td')).forEach((c) => {
					const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
					let n;
					while ((n = w.nextNode())) {
						const s = n.nodeValue, re = /[^\s]+/g;
						let m;
						while ((m = re.exec(s))) {
							const rg = document.createRange();
							rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
							const rects = Array.from(rg.getClientRects()).filter((q) => q.width > 0);
							if (rects.length && Math.max.apply(null, rects.map((q) => q.top)) - Math.min.apply(null, rects.map((q) => q.top)) > 3) {
								out.broken.push('table ' + ti + ': "' + m[0] + '" in "' + c.textContent.trim().slice(0, 40) + '"');
							}
						}
						// A figure and its unit sit together: a "number unit" cell stays on one line.
						if (/^\s*[-−]?\d[\d.,]*\s+\S+(\s+H2O)?\s*$/.test(s)) {
							const rg = document.createRange(); rg.selectNodeContents(n);
							const rs = Array.from(rg.getClientRects()).filter((q) => q.width > 0);
							if (rs.length && Math.max.apply(null, rs.map((q) => q.top)) - Math.min.apply(null, rs.map((q) => q.top)) > 3) {
								out.parted.push('table ' + ti + ': "' + s.trim() + '"');
							}
						}
					}
				});
			});
			return out;
		}, paperW);
		const checkPrint = async (label, boxId, prefix) => {
			console.log('\n--- ' + label + ' ---');
			await page.evaluate(() => { window.__printed = false; });
			await page.click('#' + prefix + '_print');
			await a.settle(200);
			await page.emulateMedia({ media: 'print' });
			for (const [paper, w] of PAPERS) {
				// body margin is 8px each side in print too: make the printable sheet exactly w wide.
				await page.setViewportSize({ width: w, height: 900 });
				await a.settle(150);
				const m = await measure(w);
				ok(label + ' on ' + paper + ': there is a sheet with tables', !!m && m.tables.length >= 1, m && m.sheet);
				if (!m) { continue; }
				ok(label + ' on ' + paper + ': every table fits the sheet width (' + Math.round(m.sheet) + ' px)',
					m.tables.every((t) => t.right <= m.sheet + 0.5), m.tables.map((t) => Math.round(t.right) + '/' + t.cols + 'cols').join(' '));
				ok(label + ' on ' + paper + ': no word is broken across lines', m.broken.length === 0, m.broken.slice(0, 6).join(' ; '));
				ok(label + ' on ' + paper + ': no figure is parted from its unit', m.parted.length === 0, m.parted.slice(0, 4).join(' ; '));
			}
			if (process.env.RPT_PDF_DIR) { await page.pdf({ path: path.join(process.env.RPT_PDF_DIR, prefix + '.pdf'), format: 'Letter', margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' } }); }
			await page.emulateMedia({ media: 'screen' });
			await page.setViewportSize({ width: 1700, height: 1000 });
			await page.evaluate(() => { const b = document.getElementById('lpn_print_area'); if (b) { b.remove(); } document.body.classList.remove('lpn-printing-table'); });
		};
		const closeBox = async (id) => { await page.evaluate((i) => { const x = document.querySelector('#' + i + ' .lpn-popover-x'); if (x) { x.click(); } }, id); await a.settle(250); };

		await dock.openBox(a, 'lpn_ff_box');
		await pressRun('#lpn_ff_controls', runLabel);
		await waitReport('#lpn_ff_report');
		await checkPrint('Fire flow box', 'lpn_ff_box', 'lpn_ff');
		await closeBox('lpn_ff_box');

		await dock.openBox(a, 'lpn_crit_box');
		await pressRun('#lpn_crit_controls', runLabel);
		await waitReport('#lpn_crit_report');
		await checkPrint('Criticality analysis', 'lpn_crit_box', 'lpn_crit');
		await closeBox('lpn_crit_box');

		await dock.openBox(a, 'lpn_ds_box');
		await pressRun('#lpn_ds_controls', await a.lang('lpn_ds_run'));
		await waitReport('#lpn_ds_box');
		await checkPrint('Demand scaling', 'lpn_ds_box', 'lpn_ds');
		await closeBox('lpn_ds_box');

		await dock.openBox(a, 'lpn_energy_box');
		await a.settle(500);
		await checkPrint('Pump energy box', 'lpn_energy_box', 'lpn_energy');
		await closeBox('lpn_energy_box');

		await dock.openBox(a, 'lpn_scncmp_box');
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_scncmp_report tbody tr')), 'the comparison table', 120000);
		await checkPrint('Scenario comparison', 'lpn_scncmp_box', 'lpn_scncmp');
		await closeBox('lpn_scncmp_box');

		await dock.openBox(a, 'lpn_status_box');
		await a.settle(500);
		await checkPrint('Status changes', 'lpn_status_box', 'lpn_status');
		await closeBox('lpn_status_box');

		await dock.openBox(a, 'lpn_calib_box');
		await a.settle(300);
		const calibFile = '/tmp/claude-1000/rptbtn-pressure.dat';
		fs.writeFileSync(calibFile, '; pressure\n 10 0 50\n 11 6 40\n 12 12 45\n 13 18 42\n 21 24 38\n');
		await page.setInputFiles('#lpn_calib_file', calibFile);
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_calib_report tbody tr')), 'the calibration table', 60000);
		await checkPrint('Calibration report', 'lpn_calib_box', 'lpn_calib');
		await closeBox('lpn_calib_box');

		await dock.openBox(a, 'lpn_full_box');
		await a.settle(500);
		await checkPrint('Full report', 'lpn_full_box', 'lpn_full');
		await closeBox('lpn_full_box');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\nFAILED: ' + fails : '\nreport-print-widths-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
