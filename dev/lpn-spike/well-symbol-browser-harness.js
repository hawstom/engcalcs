// THE WELL'S SYMBOL, IN A REAL CHROME. Run with:
//   node dev/lpn-spike/well-symbol-browser-harness.js
//
// Task 822, round 8 (Tom, 2026-11-14: "There should be no box. But I think there should be a water level horizontal line in the hole." and "Equal to
// reservoir and tank, I hope?"): the Well's map symbol has a short horizontal line across the narrow hole at the drawdown level and no box; the tint
// inside its holes is the same fill, at the same strength, as the reservoir's and the tank's symbols.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_SYMBOL_LOCKED';
const NAME = 'well-symbol-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 } });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await a.reload(); await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1200);
		const place = async (item, x, y) => { await a.menuClickSub('Insert', item, 'project'); await P.mouse.click(x, y); await a.settle(500); await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(300); };
		await place('Reservoir', 500, 400);
		await place('Tank', 700, 400);
		await place('Well', 900, 400);
		const symbols = await P.evaluate(() => {
			const fill = (sel) => { const e = document.querySelector(sel); if (!e) { return null; } const cs = getComputedStyle(e); return { fill: cs.fill, op: cs.fillOpacity, cls: e.getAttribute('class') }; };
			const well = document.querySelector('#lpn_canvas .lpn-node-symbol-well');
			return {
				well: fill('#lpn_canvas .lpn-node-symbol-well .lpn-node-symbol-backdrop'), tank: fill('#lpn_canvas .lpn-node-symbol-tank .lpn-node-symbol-backdrop'), reservoir: fill('#lpn_canvas .lpn-node-symbol-reservoir .lpn-node-symbol-backdrop'),
				paths: well ? Array.from(well.querySelectorAll('path')).map((p) => ({ d: p.getAttribute('d'), cls: p.getAttribute('class') || '' })) : null
			};
		});
		console.log('        ' + JSON.stringify(symbols));
		ok('the Well, the Tank and the Reservoir are all drawn as symbols', !!symbols.well && !!symbols.tank && !!symbols.reservoir);
		ok('the tint in the Well\'s holes is the Tank\'s and the Reservoir\'s: the same class, the same fill, the same strength', symbols.well && symbols.well.cls === symbols.tank.cls && symbols.well.cls === symbols.reservoir.cls && symbols.well.fill === symbols.tank.fill && symbols.well.fill === symbols.reservoir.fill && symbols.well.op === symbols.tank.op && symbols.well.op === symbols.reservoir.op, JSON.stringify([symbols.well, symbols.tank, symbols.reservoir]));
		const lines = (symbols.paths || []).filter((p) => !/backdrop/.test(p.cls));
		ok('the symbol has a horizontal water-level line across the narrow hole, and its linework is the casing, the ground, the curves and that line, with no box', lines.length === 4 && lines.some((p) => /^M10\.5 18H13\.5$/.test(p.d)) && !lines.some((p) => /Z/i.test(p.d)), lines.map((p) => p.d).join(' | '));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });
