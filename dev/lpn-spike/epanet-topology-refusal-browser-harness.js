// A PUMP SWITCHED OFF IN A SCENARIO, CLICKED THROUGH IN A REAL CHROMIUM (Tom, 2026-10-14).
//
//   node dev/lpn-spike/epanet-topology-refusal-browser-harness.js
//
// The engine half is held headless by epanet-topology-refusal-harness.js. This opens the same
// fixture with File > Open and picks every scenario from the scenario menu, as Tom did:
//   1. no scenario's status line says EPANET rejected the network, and none says "memory access
//      out of bounds";
//   2. "Tanks run dry", whose demand empties both tanks, says the run STOPPED at a time (the
//      lpn_time_run_stopped sentence), not that it was rejected and "did not start";
//   3. on the Spanish page the same scenario says the same thing in that page's own words.
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
const NAME = 'epanet-topology-refusal-browser-harness';
const FIXTURE = path.join(__dirname, 'fixtures', 'fotobi-topology.epp');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_ETR_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_ETR_LOCKED: '1' }) });
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
		const scenarios = JSON.parse(fs.readFileSync(FIXTURE, 'utf8')).scenarios.map((s) => s.name);
		for (const lang of ['en', 'es']) {
			console.log('\n--- ' + lang + ' ---');
			const a = await Session.open(browser, 'etr-' + lang);
			const errors = [];
			a.page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await a.page.setViewportSize({ width: 1600, height: 1000 });
			await a.goto(lang === 'en' ? 'Looped-Network.php?ec_nolog=1' : 'Looped-Network.php?ec_nolog=1&lang=es');
			const refused = (await a.lang('lpn_engine_refused')).slice(0, 30);
			const stopped = await a.lang('lpn_time_run_stopped');
			const stoppedHead = stopped.slice(0, stopped.indexOf('{time}'));
			await openFixture(a);
			for (const name of (lang === 'en' ? scenarios : ['EPS Pump off', 'Tanks run dry'])) {
				const hit = await pickScenario(a, name);
				const st = await a.status();
				if (name === 'Tanks run dry') {
					ok(name + ': the status says the run stopped, and when', hit && st.indexOf(stoppedHead) >= 0 && /\d+:\d\d/.test(st.slice(st.indexOf(stoppedHead))) &&
						st.indexOf(refused) < 0, st.slice(0, 220));
				} else {
					ok(name + ': no refusal on the status line', hit && st.indexOf(refused) < 0 && !/out of bounds/.test(st), st.slice(0, 160));
				}
			}
			ok('no uncaught page errors (' + lang + ')', errors.length === 0, errors.slice(0, 2).join(' | '));
			await a.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
