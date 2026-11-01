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
const fs = require('fs');
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
			// ---- 600 junctions, 1000 pipes, a day: the page must stay alive while the built-in loop runs ----
		console.log('\n--- 600 junctions, 1000 pipes, 24 h, built-in solver ---');
		{
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'plain-downtown-n600-seed71.lwn'), 'utf8'));
			d.settings = Object.assign({}, d.settings, { engine: 'native' });
			d.times = Object.assign({}, d.times || {}, { duration: 86400 });
			const b = await Session.open(browser, 'native-wire-n600', { serviceWorkers: 'block' });
			await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await b.goto('Looped-Network.php?ec_nolog=1');
			await b.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_nwire', txt); }, JSON.stringify(d));
			await b.reload();
			await b.answerTrainingPanel().catch(() => {});
			await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await b.settle(6000);
			await b.page.evaluate(() => {
				window.__gaps = { max: 0, last: performance.now(), fractions: [] };
				window.__timer = setInterval(() => {
					const n = performance.now(), bx0 = EngCalcs.lpnTimeRunBoxState && EngCalcs.lpnTimeRunBoxState(); if (bx0 && bx0.phase === 'done') { window.__gaps.last = n; return; } if (n - window.__gaps.last > 150) { (window.__gaps.big = window.__gaps.big || []).push([Math.round(n - window.__t0), Math.round(n - window.__gaps.last)]); } window.__gaps.max = Math.max(window.__gaps.max, n - window.__gaps.last); window.__gaps.last = n;
					const bx = EngCalcs.lpnTimeRunBoxState && EngCalcs.lpnTimeRunBoxState(); if (bx && bx.open) { window.__gaps.fractions.push(bx.fraction); }
				}, 20);
				window.__before = EngCalcs.lpnTimeKeep(); window.__gaps.last = performance.now(); window.__t0 = performance.now(); EngCalcs.lpnTimeRunNow();
			});
			await b.waitFor(() => b.page.evaluate(() => { const r = EngCalcs.lpnTimeKeep(); return !!r && r.run !== (window.__before && window.__before.run) && r.run.frames.length > 1; }), 'the n600 run', 120000);
			const g = await b.page.evaluate(() => { clearInterval(window.__timer); const k = EngCalcs.lpnTimeKeep(); return { big: window.__gaps.big, max: window.__gaps.max, fr: window.__gaps.fractions, engine: k.run.engine, frames: k.run.frames.length, ms: performance.now() - window.__t0 }; });
			const mid = g.fr.filter((f) => f > 0 && f < 1).length;
			ok('n600: the built-in loop ran it', g.engine === 'native' && g.frames === 25, JSON.stringify({ engine: g.engine, frames: g.frames, totalMs: Math.round(g.ms), gaps: g.big }));
			ok('n600: a timer fired at least every 250 ms while the loop ran (the longest gap before the run box says done; drawing the result on the map afterwards is the page\'s work, not the loop\'s)', g.max < 250, Math.round(g.max) + ' ms');
			ok('n600: the run box showed progress part-way, not only 0 and 100 percent', mid >= 2, mid + ' readings between 0 and 1');
			await b.close();
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
