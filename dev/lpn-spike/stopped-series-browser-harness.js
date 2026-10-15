// A STOPPED RUN KEEPS THE PERIODS IT SOLVED (Task 808; Tom, 2026-10-15: "It would be nice to see
// truncated time series graphs if those are available.").
//
//   node dev/lpn-spike/stopped-series-browser-harness.js
//
// Opens the fixture with File > Open, picks "Tanks run dry" (both tanks empty and EPANET stops with
// Error 110) and asserts, in a real Chromium:
//   1. the status line says the run stopped, and where the results run to;
//   2. the series the graphs read ends at the last solved period, holds real values there, and
//      nothing after it;
//   3. the transport offers no moment beyond it, and the map shows the last solved period;
//   4. a scenario that runs to the end is untouched (all 25 periods).
// Every button is pressed with a MouseEvent of detail 1, as a person's click is.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'stopped-series-browser-harness';
const FIXTURE = path.join(__dirname, 'fixtures', 'fotobi-topology.epp');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SSB_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SSB_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function openFixture(a) {
	const page = a.page;
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.writeFile('fotobi-topology.epp', fs.readFileSync(FIXTURE, 'utf8'));
	await a.queuePick('fotobi-topology.epp');
	await a.menuClick(await a.lang('lpn_file_open'));
	await a.settle(2500);
	const readOnly = await a.lang('lpn_lock_open_readonly');
	for (let k = 0; k < 4; k++) {
		const d = await a.dialog();
		if (!d) { break; }
		// Another session in this run may still hold the file's lock: look at it read-only.
		if ((d.buttons || []).indexOf(readOnly) >= 0) { await a.dialogClick(readOnly); } else {
			await page.evaluate(() => {
				const b = document.querySelector('#lpn_dialog_buttons button');
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			});
		}
		await a.settle(1200);
	}
}
async function pickScenario(a, label) {
	const page = a.page;
	await page.evaluate(() => {
		document.getElementById('lpn_scenario_btn').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
	});
	await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const hit = await page.evaluate((label) => {
		for (const r of document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')) {
			if (r.textContent.trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label) {
				r.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
				return true;
			}
		}
		return false;
	}, label);
	// Long enough for the solve and the 24-hour run (a few hundred ms on this network).
	await a.settle(3500);
	return hit;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'ssb');
		const errors = [];
		a.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await a.page.setViewportSize({ width: 1600, height: 1000 });
		await a.goto('Looped-Network.php?ec_nolog=1');
		await openFixture(a);
		const keptHead = (await a.lang('lpn_time_run_stopped_kept')).split('{time}')[0];
		const oldTail = (await a.lang('lpn_time_run_stopped')).split('{time}')[1].split('.')[0];
		const keptMid = (await a.lang('lpn_time_run_stopped_kept')).split('{time}')[1].split('{solved}')[0];
		const probe = () => a.page.evaluate(() => {
			const fr = EngCalcs.lpnTimeRunFrames(), cur = EngCalcs.lpnTimeCurrentFrame(),
				sel = document.getElementById('lpn_time_step');
			const opts = sel ? Array.from(sel.options).map((o) => o.textContent.trim()) : [];
			return {
				ts: fr.map((f) => f.t),
				finite: fr.every((f) => Object.values(f.heads).every(isFinite) && Object.values(f.flows).every(isFinite)),
				first: fr.length ? Object.keys(fr[0].heads).length : 0,
				curHeads: cur ? Object.keys(cur.heads).length : 0,
				opts, t: EngCalcs.lpnTimeRunState().t
			};
		});

		console.log('\n--- Tanks run dry ---');
		ok('picked the scenario', await pickScenario(a, 'Tanks run dry'));
		const st = await a.status();
		const m = st.match(new RegExp(keptMid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\d+:\\d\\d)'));
		ok('the status says it stopped and where the results run to', st.indexOf(keptHead) === 0 && !!m &&
			st.indexOf(oldTail) < 0, st.slice(0, 200));
		const p = await probe();
		const lastT = p.ts[p.ts.length - 1];
		ok('the series holds the solved periods only (4 to 24 reporting times)', p.ts.length >= 2 && p.ts.length < 25, JSON.stringify(p.ts));
		ok('...it starts at 0 and steps by the reporting step', p.ts[0] === 0 && p.ts.every((t, k) => t === k * 3600));
		ok('...the "results run to" time is its last period', !!m && m[1] === Math.floor(lastT / 3600) + ':00', m && m[1] + ' vs ' + lastT);
		ok('...every value in it is a real number, and the map holds the last period', p.finite && p.first > 0 && p.curHeads === p.first, JSON.stringify([p.finite, p.first, p.curHeads]));
		ok('the transport offers no moment past the last solved period', p.opts.length === p.ts.length, JSON.stringify(p.opts));
		ok('...and sits on one of them', p.ts.indexOf(p.t) >= 0, 't=' + p.t);
		await a.page.evaluate(() => EngCalcs.lpnTimeGoTo(20 * 3600));
		await a.settle(600);
		const q = await probe();
		ok('asking for hour 20 does not conjure a period', q.ts.length === p.ts.length && q.ts[q.ts.length - 1] === lastT, JSON.stringify(q.ts));
		ok('...the map shows the last solved period', q.curHeads === p.first);

		console.log('\n--- a run that finishes is untouched ---');
		ok('picked the scenario', await pickScenario(a, 'EPS Pump off'));
		const r = await probe();
		ok('all 25 periods, and no "results run to" on the status line', r.ts.length === 25 && r.opts.length >= 25 &&
			(await a.status()).indexOf(keptHead) < 0, r.ts.length + ' ' + (await a.status()).slice(0, 100));

		ok('no uncaught page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
