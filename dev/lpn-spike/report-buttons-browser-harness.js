// THE SHARED REPORT BUTTON ROW, ON EVERY ANALYSIS AND REPORT BOX (Task 829).
//   node dev/lpn-spike/report-buttons-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1 (a 24-hour clock, two scenarios). For Fire flow, Criticality, Demand scaling, Pump energy,
// Scenario comparison, Status changes, Calibration and the Full report: open the box, run it, then
// Download CSV, Copy HTML and Print report must each give a non-empty result that holds a number the
// box shows, the file name must be project-scenario-analysis, the HTML must be a self-contained
// table under a line naming the project and the analysis, and the printed sheet must be dark on
// white even with a dark page theme.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RPTBTN_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('report-buttons-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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

		// One box: the three buttons, against the first body row of the first table the box shows.
		const checkBox = async (label, boxId, host, prefix, titleKey) => {
			console.log('\n--- ' + label + ' ---');
			const title = (await a.lang(titleKey)).trim();
			const shown = await page.evaluate(([b]) => {
				const t = document.querySelector('#' + b + ' .lpn-popover-body table'), tr = t && t.querySelector('tbody tr');
				return tr ? Array.from(tr.children).map((c) => c.textContent.trim()).filter((x) => x) : [];
			}, [boxId]);
			ok(label + ': the box shows a table', shown.length > 1, shown.join(' | '));
			const states = await page.evaluate((p) => ['_csv', '_copyhtml', '_print'].map((s) => {
				const b = document.getElementById(p + s); return b ? [b.textContent.trim(), b.disabled] : null;
			}), prefix);
			ok(label + ': Download CSV, Copy HTML and Print report, all enabled',
				states.every((s) => s && !s[1]) && states.map((s) => s[0]).join('|') ===
				[await a.lang('lpn_full_download_csv'), await a.lang('lpn_report_copy_html'), await a.lang('lpn_full_print')].map((x) => x.trim()).join('|'), JSON.stringify(states));
			const inRow = await page.evaluate((b) => !!document.querySelector('#' + b + ' .lpn-popover-body > .lpn-box-tools #' + b.replace(/_box$/, '') + '_csv'), boxId);
			ok(label + ': the row sits in the box\'s sticky tools row', inRow);

			const dl = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
			await page.click('#' + prefix + '_csv');
			const f = await dl;
			const csv = f ? fs.readFileSync(await f.path(), 'utf8') : '';
			ok(label + ': Download CSV gives a file', !!f && csv.length > 20, f && f.suggestedFilename());
			ok(label + ': ...named project-analysis (no spaces)', !!f && /^Elm_Street-(Base-)?[A-Za-z_]+\.csv$/.test(f.suggestedFilename()) &&
				f.suggestedFilename().replace(/\.csv$/, '').toLowerCase().indexOf(title.replace(/\s+/g, '_').toLowerCase()) > 0, f && f.suggestedFilename());
			const sample = shown[1], sample0 = shown[0];
			// The CSV carries the figure in full: its row starts with the first cell, and the second cell is the
			// shown figure to within its rounding, as a bare number.
			const rowCells = (csv.split(/\r?\n/).find((l) => l.indexOf(sample0 + ',') === 0) || '').split(',');
			const shownNum = parseFloat(sample);
			ok(label + ': ...and holds the box\'s first row (' + sample0 + ', ' + sample + ')', csv.indexOf(sample0) >= 0 &&
				(label === 'Full report' || isNaN(shownNum) || (rowCells.length > 1 && /^-?\d+(\.\d+)?$/.test(rowCells[1]) && Math.abs(+rowCells[1] - shownNum) <= Math.max(0.5, Math.abs(shownNum) * 0.01))), csv.slice(0, 160).replace(/\r?\n/g, ' / '));

			await page.evaluate(() => { window.__clip = null; });
			await page.click('#' + prefix + '_copyhtml');
			await a.settle(300);
			const clip = await page.evaluate(() => window.__clip);
			const html = clip && clip['text/html'];
			ok(label + ': Copy HTML puts HTML on the clipboard', !!html && html.indexOf('<table') >= 0, html && html.slice(0, 80));
			ok(label + ': ...self-contained (inline styles, no class, no script)', !!html && html.indexOf('style="') > 0 && !/class=|<script|<link/.test(html));
			ok(label + ': ...under a line with the project, the analysis and the date', !!html && html.indexOf('Elm Street') >= 0 && html.indexOf(title) >= 0 && /\d{4}-\d\d-\d\d/.test(html), html && html.slice(0, 160));
			ok(label + ': ...holding the box\'s numbers', !!html && html.indexOf(sample0) >= 0 && (label === 'Full report' || html.indexOf(sample) >= 0));
			ok(label + ': ...with a plain-text copy beside it', !!clip && !!clip['text/plain'] && clip['text/plain'].indexOf(sample0) >= 0);

			await page.evaluate(() => { window.__printed = false; document.documentElement.setAttribute('data-theme', 'dark'); });
			await page.click('#' + prefix + '_print');
			await a.settle(200);
			ok(label + ': Print report asks the browser to print', await page.evaluate(() => window.__printed));
			const screenPaper = await page.evaluate((bid) => getComputedStyle(document.getElementById(bid)).backgroundColor, boxId);
			await page.emulateMedia({ media: 'print' });
			const pr = await page.evaluate((bid) => {
				const area = document.getElementById('lpn_print_area'), td = area && area.querySelector('td'), h1 = area && area.querySelector('h1');
				return area ? {
					text: area.innerText, tables: area.querySelectorAll('table').length,
					ink: td ? getComputedStyle(td).color : '', head: h1 ? getComputedStyle(h1).color : '',
					paper: getComputedStyle(document.body).backgroundColor,
					hidden: getComputedStyle(document.getElementById(bid)).display,
					sizes: ['h1', 'h2', 'h3'].map((t) => parseFloat(getComputedStyle(area.querySelector(t)).fontSize)), first: area.querySelector('h1').textContent
				} : null;
			}, boxId);
			await page.emulateMedia({ media: 'screen' });
			await page.evaluate(() => { document.documentElement.removeAttribute('data-theme'); });
			ok(label + ': Print report builds a sheet with the box\'s table', !!pr && pr.tables >= 1 && pr.text.indexOf('Elm Street') >= 0 && pr.text.indexOf(title) >= 0 && pr.text.indexOf(sample0) >= 0, pr && pr.text.slice(0, 100).replace(/\n/g, ' / '));
			ok(label + ': ...that prints alone (the page and the box are hidden)', !!pr && pr.hidden === 'none');
			const lum = (c) => { const m = /\d+/g, v = (c.match(m) || []).slice(0, 3).map(Number); return (v[0] + v[1] + v[2]) / 3; };
			ok(label + ': ...dark ink on white paper, whatever the page theme', !!pr && lum(pr.ink) < 100 && lum(pr.head) < 100 && /rgba?\(255, 255, 255|rgba\(0, 0, 0, 0\)/.test(pr.paper), pr && [pr.ink, pr.head, pr.paper].join(' '));
			const lumOf = (c) => { const v = (c.match(/\d+/g) || []).slice(0, 3).map(Number); return (v[0] + v[1] + v[2]) / 3; };
			ok(label + ': ...and the dark theme really was on (the box is dark on screen)', lumOf(screenPaper) < 110, screenPaper);
			ok(label + ': ...the title prints largest, then the project, then the scenario line', !!pr && pr.sizes[0] > pr.sizes[1] && pr.sizes[1] >= pr.sizes[2] && pr.first === title, pr && (pr.sizes.join(',') + ' ' + pr.first));
			ok(label + ': the CSV file name has no doubled underscore', !!f && !/__|^_|_\.|-_|_-/.test(f.suggestedFilename()), f && f.suggestedFilename());
			ok(label + ': the CSV opens with one byte-order mark and no other', csv.charCodeAt(0) === 0xFEFF && csv.indexOf('\uFEFF', 1) < 0);
			const cellsAll = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l).map((l) => l.split(','));
			ok(label + ': the CSV has no figure with a unit stuck to it', !cellsAll.some((r) => r.some((c) => /^-?\d+(\.\d+)?\s+(psi|gpm|ft|ft\/s|in|kW|kWh|%)$/.test(c))), cellsAll.filter((r) => r.some((c) => /^-?\d+(\.\d+)?\s+[a-z%]/i.test(c)))[0]);
			await page.evaluate(() => { const b = document.getElementById('lpn_print_area'); if (b) { b.remove(); } document.body.classList.remove('lpn-printing-table'); });
		};
		const closeBox = async (id) => { await page.evaluate((i) => { const x = document.querySelector('#' + i + ' .lpn-popover-x'); if (x) { x.click(); } }, id); await a.settle(250); };

		await dock.openBox(a, 'lpn_ff_box');
		await pressRun('#lpn_ff_controls', runLabel);
		await waitReport('#lpn_ff_report');
		await checkBox('Fire flow box', 'lpn_ff_box', 'lpn_ff_report', 'lpn_ff', 'lpn_ff_title');
		await closeBox('lpn_ff_box');

		await dock.openBox(a, 'lpn_crit_box');
		await pressRun('#lpn_crit_controls', runLabel);
		await waitReport('#lpn_crit_report');
		await checkBox('Criticality analysis', 'lpn_crit_box', 'lpn_crit_report', 'lpn_crit', 'lpn_crit_title');
		await closeBox('lpn_crit_box');

		await dock.openBox(a, 'lpn_ds_box');
		await pressRun('#lpn_ds_controls', await a.lang('lpn_ds_run'));
		await waitReport('#lpn_ds_box');
		await checkBox('Demand scaling', 'lpn_ds_box', 'lpn_ds_report', 'lpn_ds', 'lpn_ds_title');
		await closeBox('lpn_ds_box');

		await dock.openBox(a, 'lpn_energy_box');
		await a.settle(500);
		await checkBox('Pump energy box', 'lpn_energy_box', 'lpn_energy_report', 'lpn_energy', 'lpn_energy_title');
		await closeBox('lpn_energy_box');

		await dock.openBox(a, 'lpn_scncmp_box');
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_scncmp_report tbody tr')), 'the comparison table', 120000);
		await checkBox('Scenario comparison', 'lpn_scncmp_box', 'lpn_scncmp_report', 'lpn_scncmp', 'lpn_scncmp_title');
		const oldBtns = await page.evaluate(() => !!document.getElementById('lpn_scnres_copy') || !!document.getElementById('lpn_scnres_csv'));
		ok('Scenario comparison: its own lone Copy and Download CSV are gone', !oldBtns);
		const csvFull = await (async () => {
			const dl = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
			await page.click('#lpn_scncmp_csv');
			const f = await dl; return f ? fs.readFileSync(await f.path(), 'utf8') : '';
		})();
		ok('Scenario comparison: the CSV keeps the unrounded numbers of Results by asset', /\d\.\d{4,}/.test(csvFull), csvFull.slice(-200).replace(/\r?\n/g, ' / '));
		await closeBox('lpn_scncmp_box');

		await dock.openBox(a, 'lpn_status_box');
		await a.settle(500);
		await checkBox('Status changes', 'lpn_status_box', 'lpn_status_report', 'lpn_status', 'lpn_status_title');
		await closeBox('lpn_status_box');

		await dock.openBox(a, 'lpn_calib_box');
		await a.settle(300);
		const calibFile = '/tmp/claude-1000/rptbtn-pressure.dat';
		fs.writeFileSync(calibFile, '; pressure\n 10 0 50\n 11 6 40\n 12 12 45\n 13 18 42\n 21 24 38\n');
		await page.setInputFiles('#lpn_calib_file', calibFile);
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_calib_report tbody tr')), 'the calibration table', 60000);
		await checkBox('Calibration report', 'lpn_calib_box', 'lpn_calib_report', 'lpn_calib', 'lpn_calib_title');
		await closeBox('lpn_calib_box');

		await dock.openBox(a, 'lpn_full_box');
		await a.settle(500);
		await checkBox('Full report', 'lpn_full_box', 'lpn_full_report', 'lpn_full', 'lpn_full_title');
		await closeBox('lpn_full_box');
		console.log('\n--- A refused rich clipboard write falls back to plain text ---');
		await dock.openBox(a, 'lpn_status_box');
		await a.settle(400);
		await page.evaluate(() => {
			window.__clip = null;
			Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
				write: async () => { throw new Error('refused'); },
				writeText: async (t) => { window.__clip = { 'text/plain': t }; }
			} });
		});
		await page.click('#lpn_status_copyhtml');
		await a.settle(400);
		const fbClip = await page.evaluate(() => window.__clip);
		ok('the plain copy holds the title line and tabs, no markup', !!fbClip && fbClip['text/plain'].indexOf('Elm Street') >= 0 && fbClip['text/plain'].indexOf('\t') > 0 && !/<(table|p|td)/.test(fbClip['text/plain']), fbClip && fbClip['text/plain'].slice(0, 80));
		await closeBox('lpn_status_box');

		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\nFAILED: ' + fails : '\nreport-buttons-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
