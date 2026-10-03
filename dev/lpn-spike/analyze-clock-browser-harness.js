// THE ANALYZE TOOLS ACROSS AN EXTENDED-PERIOD CLOCK MOVE (Perry's wish, dev/agents/pre-reviewer/wishlist.md;
// Task 754: on Net3 a Find made at 0:00 still read 0.51 with the clock at 6:00, where the answer was 3.10).
//   node dev/lpn-spike/analyze-clock-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net3 from the examples wall, its EPANET run finished. For each of Water > Analyze > Fire flow,
// Criticality and Demand scaling: open, press Run (Demand scaling: Find as well), move the EPS clock
// to another step, and ask what the tool shows. A result computed at 0:00 must not go on passing
// for the step on screen: it must be re-run, cleared, or say it was computed at another time.
//
// Fire flow and Criticality share Demand scaling's two keys, lpn_analyze_at_time and
// lpn_analyze_time_moved: each names its time step, and says so when the clock has left it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ANCLK_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('analyze-clock-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('analyze-clock-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('analyze-clock-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
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
		console.error('analyze-clock-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'analyze-clock');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net3 EPS frames', 120000);

		const goTo = async (t) => { await a.page.evaluate((s) => EngCalcs.lpnTimeGoTo(s), t); await a.settle(600); };
		const txt = (sel) => a.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.textContent : ''; }, sel);
		const elapsed = (t) => a.page.evaluate((s) => EngCalcs.lpnTimeElapsedText(s), t);
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
		}, reportSel), what, 240000);

		const zero = await elapsed(0), six = await elapsed(6 * 3600);
		await goTo(0);
		const runLabel = await a.lang('lpn_ff_calculate');

		const at0 = (await a.lang('lpn_analyze_at_time')).replace('{time}', zero);
		const moved = (await a.lang('lpn_analyze_time_moved')).replace('{time}', zero).replace('{now}', six);

		console.log('\n--- Fire flow ---');
		await openTool('lpn_ff_menu', 'lpn_ff_box');
		await pressRun('#lpn_ff_controls', runLabel);
		await waitDone('#lpn_ff_report', 'the Fire flow answer');
		const ffBefore = await txt('#lpn_ff_report');
		console.log('  ' + ffBefore.slice(0, 120));
		await goTo(6 * 3600);
		const ffAfter = await txt('#lpn_ff_report');
		ok('Fire flow names 0:00 while the clock is there', ffBefore.indexOf(at0) >= 0 && ffBefore.indexOf(moved) < 0);
		ok('Fire flow says it was computed at 0:00 and the clock is at 6:00', ffAfter.indexOf(moved) >= 0, ffAfter.slice(0, 100));
		await closeTool('lpn_ff_close');

		console.log('\n--- Criticality ---');
		await goTo(0);
		await openTool('lpn_crit_menu', 'lpn_crit_box');
		await pressRun('#lpn_crit_controls', runLabel);
		await waitDone('#lpn_crit_report', 'the Criticality answer');
		const crBefore = await txt('#lpn_crit_report');
		console.log('  ' + crBefore.slice(0, 120));
		await goTo(6 * 3600);
		const crAfter = await txt('#lpn_crit_report');
		ok('Criticality names 0:00 while the clock is there', crBefore.indexOf(at0) >= 0 && crBefore.indexOf(moved) < 0);
		ok('Criticality says it was computed at 0:00 and the clock is at 6:00', crAfter.indexOf(moved) >= 0, crAfter.slice(0, 100));
		await closeTool('lpn_crit_close');

		console.log('\n--- Demand scaling ---');
		await goTo(0);
		await openTool('lpn_ds_menu', 'lpn_ds_box');
		await pressRun('#lpn_ds_controls', await a.lang('lpn_ds_run'));
		await waitDone('#lpn_ds_controls [data-ds="scale"]', 'the Demand scaling Run answer');
		await pressRun('#lpn_ds_controls', await a.lang('lpn_ds_find'));
		await waitDone('#lpn_ds_controls [data-ds="search"]', 'the Demand scaling Find answer');
		const dsAt = at0;
		ok('Run names 0:00', (await txt('#lpn_ds_controls [data-ds="scale"]')).indexOf(dsAt) >= 0);
		ok('Find names 0:00', (await txt('#lpn_ds_controls [data-ds="search"]')).indexOf(dsAt) >= 0);
		await goTo(6 * 3600);
		ok('Run says it was computed at 0:00 and the clock is at 6:00', (await txt('#lpn_ds_controls [data-ds="scale"]')).indexOf(moved) >= 0);
		ok('Find says the same', (await txt('#lpn_ds_controls [data-ds="search"]')).indexOf(moved) >= 0);

		console.log('\n--- Find and replace, Selected scope, across a clock move ---');
		// Find and replace reads the model, not a computed result, so a clock move has nothing to
		// go stale: the selection must simply survive it.
		await closeTool('lpn_ds_close');
		const sel = () => a.page.$$eval('.lpn-node-hit.lpn-selected, .lpn-node.lpn-selected',
			(els) => [...new Set(els.map((e) => e.getAttribute('data-node')))].sort());
		const hit = await a.page.$('.lpn-node-hit');
		const bb = await hit.boundingBox();
		await a.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
		await a.settle(300);
		const picked = await sel();
		await goTo(0);
		ok('a node is selected', picked.length >= 1, JSON.stringify(picked));
		ok('the selection survives a clock move', JSON.stringify(await sel()) === JSON.stringify(picked), JSON.stringify(await sel()));

		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n'));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' analyze clock check(s) FAILED' : '\nAnalyze clock harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
