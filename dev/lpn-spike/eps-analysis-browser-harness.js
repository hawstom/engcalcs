// FIRE FLOW, CRITICALITY AND DEMAND SCALING OVER A WHOLE RUN, IN THE REAL PAGE (Task 578).
//   node dev/lpn-spike/eps-analysis-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1 from the examples wall, which has a 24-hour clock. Water > Analyze > Fire flow, the choice
// "Every reporting step, worst case", Run: the table must carry the column that says at which
// step each junction is lowest, and the report must say it is the worst of the steps. The same
// box on the step on screen has no such column.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_EPSAN_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('eps-analysis-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('eps-analysis-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('eps-analysis-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('eps-analysis-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'eps-analysis');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net1 EPS frames', 120000);

		const txt = (sel) => a.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.textContent : ''; }, sel);
		const openTool = async (menuKey, boxId) => {
			await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang(menuKey), 'project');
			await a.page.waitForSelector('#' + boxId, { state: 'visible' });
		};
		const closeTool = async (id) => { await a.page.click('#' + id); await a.settle(200); };
		const pressRun = async (controls, label) => {
			const btns = await a.page.$$(controls + ' button.lpn-ff-run');
			for (const b of btns) {
				if (((await b.textContent()) || '').trim() === label) { await b.click(); return; }
			}
			throw new Error('no ' + label + ' button in ' + controls);
		};
		const waitDone = (reportSel, what) => a.waitFor(() => a.page.evaluate((s) => {
			const r = document.querySelector(s), box = document.getElementById('lpn_ff_run_box');
			return !!r && r.textContent.length > 20 && (!box || box.style.display === 'none');
		}, reportSel), what, 300000);
		const heads = (reportSel) => a.page.$$eval(reportSel + ' th', (ths) => ths.map((t) => t.textContent.trim()));
		// The leaf columns, left to right, each with the group heading above it (''): the report tables carry compound headings
		// since 6a7bce3ca (840), so a cell's column is its leaf's position, not its th's position in the flat list.
		const leaves = (reportSel) => a.page.$$eval(reportSel + ' thead tr', (trs) => {
			const taken = [], cells = [];
			trs.forEach((tr, ri) => {
				let ci = 0;
				Array.from(tr.children).forEach((th) => {
					while (taken[ri] && taken[ri][ci]) { ci++; }
					const cs = th.colSpan || 1, rs = th.rowSpan || 1;
					for (let r = ri; r < ri + rs; r++) { taken[r] = taken[r] || []; for (let c = ci; c < ci + cs; c++) { taken[r][c] = true; } }
					cells.push({ text: th.textContent.trim(), ri, ci, cs, rs });
					ci += cs;
				});
			});
			const width = Math.max.apply(null, cells.map((c) => c.ci + c.cs)), out = [];
			for (let c = 0; c < width; c++) {
				const cover = cells.filter((x) => x.ci <= c && c < x.ci + x.cs).sort((x, y) => x.ri - y.ri);
				const leaf = cover[cover.length - 1], group = cover.length > 1 ? cover[0].text : '';
				out.push({ text: leaf.text, group });
			}
			return out;
		});
		const runLabel = await a.lang('lpn_ff_calculate');

		console.log('\n--- Fire flow on the step on screen ---');
		await openTool('lpn_ff_menu', 'lpn_ff_box');
		const whenSel = '#lpn_ff_controls select:has(option[value="all"]):has(option[value="minp"])';
		ok('the box offers a choice of time step on a project with a clock', !!(await a.page.$(whenSel)));
		await pressRun('#lpn_ff_controls', runLabel);
		await waitDone('#lpn_ff_report', 'the Fire flow answer on screen');
		const hourHead = await a.lang('lpn_ff_col_hour');
		ok('no "' + hourHead + '" column when one step is tested', (await heads('#lpn_ff_report')).indexOf(hourHead) < 0);

		console.log('\n--- Fire flow, every reporting step ---');
		await a.page.selectOption(whenSel, 'all');
		await a.settle(200);
		await pressRun('#lpn_ff_controls', runLabel);
		await waitDone('#lpn_ff_report', 'the every-step answer');
		const h = (await leaves('#lpn_ff_report')).map((l) => l.text);
		ok('the table has a "' + hourHead + '" column', h.indexOf(hourHead) >= 0, h.join(' | '));
		const rows = await a.page.$$eval('#lpn_ff_report tbody tr', (trs) => trs.map((tr) => [...tr.children].map((c) => c.textContent.trim())));
		const col = h.indexOf(hourHead);
		ok('every row names a step, such as 7:00', rows.length > 0 && rows.every((r) => /^\d+:\d\d/.test(r[col])), JSON.stringify(rows.slice(0, 2)));
		const report = await txt('#lpn_ff_report');
		const lead = (await a.lang('lpn_ff_at_all')).split('{n}')[0];
		ok('the report says it is the worst of the reporting steps', report.indexOf(lead) >= 0, report.slice(0, 160));
		await closeTool('lpn_ff_close');

		console.log('\n--- Criticality, the whole run ---');
		await openTool('lpn_crit_menu', 'lpn_crit_box');
		const critWhen = '#lpn_crit_controls select:has(option[value="run"])';
		ok('the box offers the whole run on a project with a clock', !!(await a.page.$(critWhen)));
		await a.page.selectOption(critWhen, 'run');
		await a.settle(200);
		await pressRun('#lpn_crit_controls', runLabel);
		await waitDone('#lpn_crit_report', 'the whole-run Criticality answer');
		const chL = await leaves('#lpn_crit_report'), ch = (await heads('#lpn_crit_report'));
		const emptyHead = await a.lang('lpn_crit_col_empty'), timeHead = await a.lang('lpn_full_col_time');
		ok('the table has the columns "' + emptyHead + '" and "' + await a.lang('lpn_crit_col_hours') + '"',
			ch.indexOf(emptyHead) >= 0 && ch.indexOf(await a.lang('lpn_crit_col_hours')) >= 0, ch.join(' | '));
		const crows = await a.page.$$eval('#lpn_crit_report tbody tr', (trs) => trs.map((tr) => [...tr.children].map((c) => c.textContent.trim())));
		// "Tank empties" is a group over Tank | Time (6a7bce3ca); the time is the Time leaf under it.
		const ec = chL.findIndex((l) => l.group === emptyHead && l.text === timeHead);
		ok('Tank empties has a Time column under it', ec >= 0, JSON.stringify(chL));
		const emptied = crows.filter((r) => /\d+:\d\d/.test(r[ec]));
		ok('some outage empties the tank, with the time (such as "2 at 5:00")', emptied.length >= 1, JSON.stringify(emptied.slice(0, 2)));
		await closeTool('lpn_crit_close');

		console.log('\n--- Demand scaling, the whole run ---');
		await openTool('lpn_ds_menu', 'lpn_ds_box');
		const dsWhen = '#lpn_ds_controls select:has(option[value="run"])';
		ok('the box offers the whole run on a project with a clock', !!(await a.page.$(dsWhen)));
		await a.page.selectOption(dsWhen, 'run');
		await a.settle(200);
		await pressRun('#lpn_ds_controls', await a.lang('lpn_find_btn'));
		await waitDone('#lpn_ds_controls [data-ds="search"]', 'the whole-run Find answer');
		const dsText = await txt('#lpn_ds_controls [data-ds="search"]');
		const limitLead = (await a.lang('lpn_ds_limit_at')).split('{time}')[0];
		const runLead = await a.lang('lpn_ds_run_note');
		ok('Find says it judged the whole run', dsText.indexOf(runLead) >= 0, dsText.slice(0, 220));
		ok('and names the limiting reporting step', dsText.indexOf(limitLead) >= 0 && /^\d+:\d\d/.test(dsText.slice(dsText.indexOf(limitLead) + limitLead.length)), dsText.slice(0, 220));
		await closeTool('lpn_ds_close');

		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n'));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' eps analysis browser check(s) FAILED' : '\nEPS analysis browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
