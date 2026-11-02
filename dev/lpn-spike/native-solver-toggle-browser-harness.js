// THE SOLVER SETTING IS A MODELLING CHANGE, AND THE REPORT NAMES THE SOLVER THAT WROTE IT (Task 733).
//   node dev/lpn-spike/native-solver-toggle-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Tom's sequence on Net3: tick "Use the built-in solver when possible", scale the demands by 1.5, run the day, untick.
//  1. With Recalculate automatically ON, ticking and unticking re-run the period: the frames and the status-bar sentence
//     follow the solver (before the fix the untick left the built-in results and the sentence on screen).
//  2. The Solver (run) report's banner names the built-in solver when it wrote the report (never EPANET's spaced letters),
//     and keeps EPANET's banner when EPANET wrote it.
//  3. With Recalculate OFF the results stay (snapshot rule), so the sentence that names the solver that made them stays too;
//     Calculate then brings the other solver's results and sentence.
//  4. The Reports row reads "Solver (run)" and the box title "Solver (run) report".
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_NATTOGGLE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('native-solver-toggle-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error('native-solver-toggle-browser-harness: NOT RUN -- the browser lock was held for 180 s.'); process.exit(1); }
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
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'native-toggle');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const setBox = (t, v) => a.page.evaluate(([t, v]) => {
			const rows = Array.from(document.querySelectorAll('label, .lpn-setrow, tr, div')).filter((e) => e.textContent.trim().indexOf(t) === 0 && e.querySelector('input'));
			const box = rows.length ? rows[rows.length - 1].querySelector('input') : null;
			if (!box) { return 'none'; }
			if (box.type === 'checkbox') { if (box.checked !== v) { box.checked = v; box.dispatchEvent(new Event('change', { bubbles: true })); } }
			else { box.value = v; box.dispatchEvent(new Event('input', { bubbles: true })); box.dispatchEvent(new Event('change', { bubbles: true })); }
			return 'ok';
		}, [t, v]);
		const shown = () => a.page.evaluate(() => {
			const k = EngCalcs.lpnTimeKeep(), st = document.getElementById('lpn_status'), f = EngCalcs.lpnTimeCurrentFrame && EngCalcs.lpnTimeCurrentFrame();
			return { engine: k && k.run && k.run.engine, frame: f && f.engine, status: st ? st.textContent : '', head: ((EngCalcs.lpnTimeLastReport && EngCalcs.lpnTimeLastReport()) || '').split('\n').slice(0, 8).join('\n'), busy: !!(EngCalcs.lpnTimeWaiting && EngCalcs.lpnTimeWaiting() === 'running') };
		});
		// Wait for the period run on screen to come from the engine wanted (the automatic re-run takes a moment).
		const until = (engine, what) => a.waitFor(async () => { const s = await shown(); return s.engine === engine && s.frame === engine && !s.busy; }, what, 60000);
		const nativeSays = await a.lang('lpn_engine_native_used'), epanetSays = await a.lang('lpn_engine_epanet_used');
		const tickLabel = await a.lang('lpn_settings_engine_native');
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1500);
		ok('the built-in solver box was ticked', (await setBox(tickLabel, true)) === 'ok');
		await until('native', 'the tick re-runs the period with the built-in solver');
		let s = await shown();
		ok('ticked, Recalculate on: the period was re-run by the built-in loop without pressing Calculate', s.engine === 'native');
		ok('the sentence names the built-in solver', s.status.indexOf(nativeSays) >= 0, s.status.slice(0, 100));
		ok('the report banner names the built-in solver, not EPANET\'s spaced letters', /Looped Network built-in solver/.test(s.head) && !/E P A N E T/.test(s.head), s.head.split('\n').slice(0, 4).join(' / '));
		ok('the demand multiplier box was set to 1.5', (await setBox(await a.lang('bpn_demand_mult'), '1.5')) === 'ok');
		await a.settle(4000);
		await until('native', 'the multiplier re-run');
		s = await shown();
		ok('after the multiplier the built-in loop still wrote the report and its banner says so', s.engine === 'native' && /Looped Network built-in solver/.test(s.head) && !/E P A N E T/.test(s.head));
		// The Reports row and the box title.
		const rowName = (await a.lang('lpn_reports_epanet')).trim(), title = (await a.lang('lpn_time_run_report')).trim();
		ok('the Reports row reads "Solver (run)"', rowName === 'Solver (run)', rowName);
		ok('the box title reads "Solver (run) report"', title === 'Solver (run) report', title);
		await a.menuClickSub(await a.lang('lpn_reports_menu'), await a.lang('lpn_reports_epanet'), 'project');
		await a.settle(500);
		const boxInfo = await a.page.evaluate(() => { const b = document.getElementById('lpn_rptbox'), t = document.getElementById('lpn_rptbox_title'); return { shown: !!b && b.style.display !== 'none', title: t ? t.textContent.trim() : null }; });
		ok('the row opens the box and its title reads "Solver (run) report"', boxInfo.shown && boxInfo.title === 'Solver (run) report', JSON.stringify(boxInfo));
		// Untick: EPANET re-runs it, the sentence and the banner follow.
		ok('the box was unticked', (await setBox(tickLabel, false)) === 'ok');
		await until('epanet', 'the untick re-runs the period with EPANET');
		s = await shown();
		ok('unticked, Recalculate on: EPANET re-ran the period', s.engine === 'epanet' && s.frame === 'epanet');
		ok('the sentence no longer claims the built-in solver', s.status.indexOf(nativeSays) < 0, s.status.slice(0, 100));
		ok('EPANET wrote the report and keeps its own banner', /E P A N E T/.test(s.head) && !/Looped Network built-in solver/.test(s.head), s.head.split('\n').slice(0, 4).join(' / '));
		// Back on, then Recalculate OFF: a snapshot. Results and sentence stay together; Calculate brings the other solver's.
		ok('the box was ticked again', (await setBox(tickLabel, true)) === 'ok');
		await until('native', 'the second tick');
		ok('Recalculate automatically was unticked', (await setBox(await a.lang('lpn_settings_auto_run'), false)) === 'ok');
		await a.settle(500);
		ok('the box was unticked with Recalculate off', (await setBox(tickLabel, false)) === 'ok');
		await a.settle(2500);
		s = await shown();
		ok('Recalculate off: the built-in results stay on screen', s.engine === 'native' && s.frame === 'native');
		ok('Recalculate off: the sentence still names the solver that made what is shown', s.status.indexOf(nativeSays) >= 0 && s.status.indexOf(epanetSays) < 0, s.status.slice(0, 100));
		await a.page.evaluate(() => { window.__before = EngCalcs.lpnTimeKeep(); EngCalcs.lpnTimeRunNow(); });
		await until('epanet', 'Calculate with the box unticked');
		s = await shown();
		ok('Calculate then brings EPANET\'s results and removes the built-in sentence', s.engine === 'epanet' && s.status.indexOf(nativeSays) < 0, s.status.slice(0, 100));
	} catch (e) {
		console.error(e);
		fails++;
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}
main();
