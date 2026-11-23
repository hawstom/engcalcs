// THE VELOCITY WARNING LIMIT, AS THE PAGE USES IT, IN A REAL CHROME (Task 864). Run with:
//   node dev/lpn-spike/velocity-limit-browser-harness.js   (takes the browser lock itself)
//   A. Destructive velocity unit change: a scenario's own limit, not only the stored number, is the one the Settings
//      row shows and the warning compares against (the scenario settings are read through a cache);
//   B. the real New project box, from a US project that holds a limit, to an SI project: the limit is not carried
//      (it is a number typed in the old unit) and the row opens blank, labelled in m/s.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_VLIM_LOCKED';
const NAME = 'velocity-limit-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
const { openBox } = require('./dock-boxes.js');
let failures = 0;
function ok(label, cond, detail) {
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const proj = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1-Scenarios.lwn'), 'utf8'));
	proj.settings.velocityLimit = 12;
	proj.scenarios.find((s) => s.id === 's1').settings = { settings: { velocityLimit: 0.4 } };
	proj.project.activeScenario = 's1';
	let text = JSON.stringify(proj);
	async function open() {
		const a = await Session.open(browser, NAME, { viewport: { width: 1280, height: 800 } });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, text);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		return a;
	}
	// The velocity row's label and shown value, with the Hydraulics section open.
	async function row(a) {
		const P = a.page;
		await openBox(a, 'lpn_settings_box');
		await P.evaluate(() => { const h = document.getElementById('lpn_set_sub_hydraulics'); if (h && h.nextElementSibling && h.nextElementSibling.offsetHeight === 0) { h.click(); } });
		await a.settle(500);
		return P.evaluate(() => {
			const r = Array.from(document.querySelectorAll('#lpn_set_hydraulics_fields label.lpn-set-row')).find((x) => /Velocity warning limit/.test(x.textContent));
			return r ? { label: r.textContent.trim(), value: r.querySelector('input').value } : null;
		});
	}
	const status = (a) => a.page.evaluate(() => document.getElementById('lpn_status').textContent);
	try {
		// ---- A. Destructive unit change, in the scenario that holds its own limit ----
		let a = await open(), r = await row(a);
		ok('Max day is open and its own limit (0.4 ft/sec) is what the row shows', r && /ft\/sec/.test(r.label) && r.value === '0.4', JSON.stringify(r));
		ok('...and the warning uses it', /above 0\.4 ft\/sec/.test(await status(a)), (await status(a)).slice(0, 120));
		await a.page.evaluate(() => { const s = document.getElementById('lpn_u_velocity'); s.value = 'mps'; s.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(600);
		const asked = await a.page.evaluate(() => /Velocity warning limit/.test(document.body.innerText) && /Convert inputs from/.test(document.body.innerText));
		ok('the unit question is asked and names the limit', asked);
		await a.page.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === 'Convert'); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); } });
		await a.settle(1500);
		r = await row(a);
		ok('Convert: the row shows the scenario\'s limit converted (0.4 ft/s is 0.12192 m/s) and names m/s', r && /m\/s/.test(r.label) && Math.abs(+r.value - 0.12192) < 1e-4, JSON.stringify(r));
		ok('...and the warning compares against the converted number, not the old one read as m/s', /above 0\.122 m\/s/.test(await status(a)), (await status(a)).slice(0, 160));
		await a.page.close && a.page.close();

		// ---- B. the real New project box, US project to SI ----
		proj.project.activeScenario = 'base';
		text = JSON.stringify(proj);
		a = await open();
		r = await row(a);
		ok('the US project (Base open) shows its own limit, 12 ft/sec', r && r.value === '12', JSON.stringify(r));
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.newProject('si');
		await a.settle(1000);
		r = await row(a);
		ok('a new SI project opens with the limit blank and the row in m/s', r && /m\/s/.test(r.label) && r.value === '', JSON.stringify(r));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\n' + failures + ' FAILED' : '\nall ok');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
