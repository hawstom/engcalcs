// NO LEADER RUNS TO NOWHERE, in a real Chromium, at real wheel notches. Run with:
//   node dev/lpn-spike/label-leader-bound-browser-harness.js
//
// Tom's Net1 screenshot, 2026-10-20 (dev/label-trials/tom-1020/labels-bug-off-screen.png): a leader
// by the label of N10 ran up and off the top of the screen, nowhere near any words. A leader joins
// a label to its element. Asserted over every leader drawn, in every view of Net1 (wheeled in and
// out, in six window sizes, and with N10's label dragged away first) and Net3: it belongs to a
// label that is drawn (a leader left behind by a hidden label), it is no longer than LEN_MAX_PX
// (except where the user dragged the label), and its far end is within GAP_MAX_PX of the label's
// words. The bug itself did not reproduce in these views on the code Tom saw (bcebdfa58) or on this
// branch, so this holds the invariant and is not shown to fail on the bug.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_LEADER_BOUND_LOCKED';
const NAME = 'label-leader-bound-browser-harness';

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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
// A leader longer than this, or ending further than this from its words, is not tying a label to
// its element. Tom's own crowded-spot leaders are 100 px or so.
const LEN_MAX_PX = 220, GAP_MAX_PX = 40;
const SCENES = [
	{ name: 'Net1, wheeled out and in', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [4, 2, 0, -2, -4, -6, -8, -10, -12, -14, -16] },
	{ name: 'Net1, a 1100 x 700 window', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [2, 0, -1, -2, -3, -4, -6, -8], viewport: { width: 1100, height: 700 } },
	{ name: 'Net1, a 1280 x 720 window', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [2, 0, -1, -2, -3, -4, -6, -8], viewport: { width: 1280, height: 720 } },
	{ name: 'Net1, a 900 x 600 window', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [2, 0, -1, -2, -3, -4, -6, -8], viewport: { width: 900, height: 600 } },
	{ name: 'Net1, a 700 x 700 window', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [2, 0, -1, -2, -3, -4, -6, -8], viewport: { width: 700, height: 700 } },
	{ name: 'Net1, a 1500 x 850 window', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [2, 0, -1, -2, -3, -4, -6, -8], viewport: { width: 1500, height: 850 } },
	{ name: 'Net1, a 800 x 1000 window', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [2, 0, -1, -2, -3, -4, -6, -8], viewport: { width: 800, height: 1000 } },
	// Tom's N10: its label dragged up and away, then the wheel (a leader belongs to a label that is
	// drawn; a leader may be long where the user made it long, so no length bound here).
	{ name: 'Net1, N10 label dragged away', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['flow', 'velocity'], notches: [-2, -6, -10, -14, 0, 4], drag: { id: '10', dx: 120, dy: -260 } },
	{ name: 'Net3, in', cardKey: 'lpn_ex_net3_title', node: ['id', 'pressure', 'demand', 'elev'], link: ['id', 'flow', 'velocity'], notches: [3, 6, 9, 12] }
];

async function wheel(page, n) {
	const step = n > 0 ? -100 : 100;
	for (let i = 0; i < Math.abs(n); i++) { await page.mouse.wheel(0, step); await page.waitForTimeout(40); }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + ' ===');
			const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.viewport || { width: 1920, height: 1000 } });
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			let hooked = 0;
			await a.page.route(/\/js\/looped-network\.js/, async (route) => {
				const resp = await route.fetch();
				let body = await resp.text();
				if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); hooked++; }
				await route.fulfill({ response: resp, body });
			});
			try {
				await a.goto('Looped-Network.php?ec_nolog=1');
				await a.answerTrainingPanel().catch(() => {});
				await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
				await a.openExampleCard(await a.lang(sc.cardKey));
				await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
				await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [sc.node, sc.link]);
				await a.settle(2000);
				const mid = await a.page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
				await a.page.mouse.move(mid.x, mid.y);
				ok(sc.name + ': the hook reached the page', hooked >= 1);
				if (sc.drag) {
					const r = await a.page.evaluate((id) => window.__lpnForm.ev(`(function () { var b = nodeEls['${id}'].text.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`), sc.drag.id);
					await a.page.mouse.move(r.x, r.y); await a.page.mouse.down();
					await a.page.mouse.move(r.x + sc.drag.dx / 2, r.y + sc.drag.dy / 2, { steps: 5 });
					await a.page.mouse.move(r.x + sc.drag.dx, r.y + sc.drag.dy, { steps: 5 });
					await a.page.mouse.up(); await a.settle(800);
					await a.page.mouse.move(mid.x, mid.y);
				}
				let at = 0, drawn = 0;
				for (const k of sc.notches) {
					for (let i = 0; i < Math.abs(k - at); i++) { await wheel(a.page, k > at ? 1 : -1); await a.settle(700); }
					at = k;
					await a.settle(1200);
					const ls = await a.page.evaluate(() => window.__lpnForm.leaders());
					drawn += ls.length;
					const bad = ls.filter((l) => l.orphan || (l.len > LEN_MAX_PX && !sc.drag) || l.gap > GAP_MAX_PX);
					if (process.env.LEADER_BOUND_PRINT) { ls.forEach((l) => console.log('        ' + l.key + ' len ' + l.len.toFixed(0) + ' gap ' + l.gap.toFixed(0) + (l.off ? ' OFF' : ''))); }
					ok(sc.name + ', ' + k + ' notches: ' + ls.length + ' leaders, each on a drawn label, none over ' + LEN_MAX_PX + ' px, none ending over ' + GAP_MAX_PX + ' px from its words', bad.length === 0,
						bad.slice(0, 4).map((l) => l.key + ' len ' + l.len.toFixed(0) + ' gap ' + l.gap.toFixed(0) + (l.off ? ' OFF (' + l.a.x.toFixed(0) + ',' + l.a.y.toFixed(0) + ')->(' + l.b.x.toFixed(0) + ',' + l.b.y.toFixed(0) + ') in ' + l.W + 'x' + l.H : '')).join('; '));
				}
				ok(sc.name + ': leaders were drawn at all (the check is not vacuous)', drawn >= 10, String(drawn));
			} finally {
				await a.close();
			}
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });
