// THE BUILT-IN SOLVER'S PERIOD LOOP, IN THE REAL PAGE (Task 733, slice 7).
//   node dev/lpn-spike/native-wire-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1 and Net3 from the examples wall, each with a 24-hour clock. With the "Use the built-in solver when
// possible" box ticked, Calculate must run the loop (the run says engine 'native', no EPANET loading
// banner); unticked, EPANET runs it and says nothing about the built-in solver.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_NATWIRE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('native-wire-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('native-wire-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('native-wire-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
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
		console.error('native-wire-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'native-wire');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const label = await a.lang('lpn_settings_engine_native');
		const tick = (on) => a.page.evaluate(([t, v]) => {
			const rows = Array.from(document.querySelectorAll('label, .lpn-setrow, tr, div')).filter((e) => e.textContent.trim().indexOf(t) === 0 && e.querySelector('input[type=checkbox]'));
			const box = rows.length ? rows[rows.length - 1].querySelector('input[type=checkbox]') : null;
			if (!box) { return 'no checkbox'; }
			if (box.checked !== v) { box.checked = v; box.dispatchEvent(new Event('change', { bubbles: true })); }
			return 'ok';
		}, [label, on]);
		const runIt = async () => {
			await a.page.evaluate(() => { window.__before = EngCalcs.lpnTimeKeep(); EngCalcs.lpnTimeRunNow(); });
			await a.waitFor(() => a.page.evaluate(() => { const r = EngCalcs.lpnTimeKeep(); return !!r && r.run !== (window.__before && window.__before.run) && r.run.frames.length > 1; }), 'a fresh period run', 120000);
			await a.settle(300);
			return a.page.evaluate(() => {
				const k = EngCalcs.lpnTimeKeep(), banner = document.getElementById('lpn_engine_banner'), st = document.getElementById('lpn_status');
				return { engine: k.run.engine, frames: k.run.frames.length, banner: banner ? banner.textContent : '', status: st ? st.textContent : '',
					cur: (EngCalcs.lpnTimeCurrentFrame() || {}).engine };
			});
		};
		for (const [key, name] of [['lpn_ex_net1_title', 'Net1'], ['lpn_ex_net3_title', 'Net3']]) {
			console.log('\n--- ' + name + ' ---');
			await a.openExampleCard(await a.lang(key));
			await a.settle(800);
			ok('the built-in solver box was ticked', (await tick(true)) === 'ok');
			await a.settle(300);
			let r = await runIt();
			ok(name + ': the period was run by the built-in loop', r.engine === 'native' && r.cur === 'native', JSON.stringify({ engine: r.engine, frames: r.frames }));
			ok(name + ': no EPANET loading banner is up', !/EPANET/.test(r.banner), r.banner);
			ok(name + ': the status line does not claim EPANET ran it', !/Solved with the EPANET solver/.test(r.status), r.status.slice(0, 120));
			ok('the box was unticked', (await tick(false)) === 'ok');
			await a.settle(300);
			r = await runIt();
			ok(name + ': with the box unticked EPANET ran it', r.engine === 'epanet' && r.cur === 'epanet', JSON.stringify({ engine: r.engine, frames: r.frames }));
		}
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
