// THE FOUR STARTER EXAMPLES, OPENED THE WAY A VISITOR OPENS THEM (Task 823).
//   node dev/lpn-spike/starter-examples-browser-harness.js   (takes the browser lock itself)
//
// Real Chromium, the real page. Each of the four gallery cards is clicked; the page must draw the
// network (the node count of the file), solve it and converge, with no page error. The headless
// numbers (pressures, fire flow, the flow test, the 24-hour run) are held by starter-examples-harness.js.
// Set EC_SHOTS=<dir> to also save a screenshot of each.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_STARTEREX_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_STARTEREX_LOCKED: '1' }) });
		if (r.status === 75) { console.error('starter-examples-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const CARDS = [
	{ key: 'extension', file: 'Fire-flow-extension.lwn' }, { key: 'extension_si', file: 'Fire-flow-extension-SI.lwn' },
	{ key: 'well', file: 'Community-well-tank.lwn' }, { key: 'well_si', file: 'Community-well-tank-SI.lwn' }
];
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		for (const c of CARDS) {
			const a = await Session.open(browser, 'T');
			const page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.setViewportSize({ width: 1400, height: 900 });
			await a.goto('Looped-Network.php');
			const title = await a.lang('lpn_ex_' + c.key + '_title');
			const wantTitle = (c.key.indexOf('extension') === 0 ? 'Johnson City extension' : 'Munday well and tank') + (/_si$/.test(c.key) ? ', L/s (SI)' : ', gpm (US)');
			ok(c.file + ': the card is titled "' + wantTitle + '"', title === wantTitle, title);
			await a.openExampleCard(title);
			await a.settle(1500);
			await page.evaluate(() => {
				let e = document.querySelector('.ec-consent-actions');
				while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
				if (e) { e.style.display = 'none'; }
			});
			ok(c.file + ': the card "' + title + '" drew the network', (await a.nodeCount()) > 0, String(await a.nodeCount()));
			await a.waitFor(() => page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r.pressures); }), 'a solve', 60000).catch(() => null);
			const r = await page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return r ? { converged: r.converged } : null; });
			ok(c.file + ': the page solved it and it converged', !!r && r.converged === true);
			if (process.env.EC_SHOTS) { await page.screenshot({ path: path.join(process.env.EC_SHOTS, c.file.replace(/\.lwn$/, '.png')) }); }
			await a.close && a.close();
		}
		ok('no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
