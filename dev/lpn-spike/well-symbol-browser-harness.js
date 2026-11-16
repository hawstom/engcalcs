// THE WELL'S SYMBOL, IN A REAL CHROME. Run with:
//   node dev/lpn-spike/well-symbol-browser-harness.js
//
// Task 822, round 8 (Tom, 2026-11-14: "There should be no box. But I think there should be a water level horizontal line in the hole." and "Equal to
// reservoir and tank, I hope?"): the Well's map symbol has a short horizontal line across the narrow hole at the drawdown level and no box; the tint
// inside its holes is the same fill, at the same strength, as the reservoir's and the tank's symbols. The "box" Tom saw was the pump's and the drawdown
// valve's own solid symbols: choosing a curve rebuilds those links, and a link built after buildDom() drew its symbol over the Well (found in this page,
// round 8). So the walk here chooses both curves and asks again what is drawn on the Well.
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
		const a = await Session.open(browser, NAME, Object.assign({ viewport: { width: 1400, height: 1000 } }, process.env.EC_WELL_SHOT ? { deviceScaleFactor: 3 } : {}));
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await a.reload(); await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1200);
		await P.setInputFiles('#lpn_project_file', path.join(REPO, 'dev', 'lpn-spike', 'well-test-net1.lwn'));
		await a.settle(2500);
		// Net1 already draws a reservoir (9) and a tank (2) as symbols; the Well goes on open ground below it.
		await a.menuClickSub('Insert', 'Well', 'project');
		const free = await P.evaluate(() => { for (let r = 0; r < 700; r += 30) { for (let k = 0; k < 24; k++) { const x = 1100 + r * Math.cos(k * Math.PI / 12), y = 800 + r * Math.sin(k * Math.PI / 12), e = document.elementFromPoint(x, y); if (e && e.closest && e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],.lpn-node-symbol-box,.lpn-link-symbol,text') && x > 300 && y > 250 && x < 1300 && y < 900) { return { x: x, y: y }; } } } return null; });
		await P.mouse.click(free.x, free.y); await a.settle(900);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
		const wc = () => P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		// What is drawn within 30 px of the Well's centre: the pump's and the drawdown valve's own symbols must not be.
		const drawnLinkSymbols = async () => { const c = await wc(); return P.evaluate((c) => Array.from(document.querySelectorAll('#lpn_canvas .lpn-link-symbol')).filter((g) => { const b = g.getBoundingClientRect(); return getComputedStyle(g).display !== 'none' && b.width > 0 && Math.abs(b.left + b.width / 2 - c.x) < 30 && Math.abs(b.top + b.height / 2 - c.y) < 30; }).map((g) => g.getAttribute('class')), c); };
		ok('a new Well draws no pump or valve symbol of its own', (await drawnLinkSymbols()).length === 0, JSON.stringify(await drawnLinkSymbols()));
		// Choosing the two curves rebuilds the pump and the valve; a solve follows. That is when the pump's solid symbol used to appear over the Well.
		const c0 = await wc();
		await P.mouse.click(c0.x, c0.y); await a.settle(900);
		const setSel = async (idx, text) => { await P.evaluate(([i, t]) => { const s = document.querySelectorAll('#lpn_popup_fields select')[i]; const o = Array.from(s.options).find((x) => x.textContent.indexOf(t) >= 0); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }, [idx, text]); await a.settle(500); };
		await setSel(0, 'Drawdown'); await setSel(1, 'WellPump');
		await P.keyboard.press('Escape'); await a.settle(2500);
		ok('with both curves chosen and a solve done, still no pump or valve symbol is drawn over the Well (Tom: "no box")', (await drawnLinkSymbols()).length === 0, JSON.stringify(await drawnLinkSymbols()));
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
		ok('the symbol has a horizontal water-level line across the narrow hole, and its linework is the casing, the ground, the curves and that line, with no box', lines.length === 4 && lines.some((p) => /^M9\.75 18\.5H14\.25$/.test(p.d)) && !lines.some((p) => /Z/i.test(p.d)), lines.map((p) => p.d).join(' | '));
		if (process.env.EC_WELL_SHOT) {   // a picture of the Well's symbol, for a review: EC_WELL_SHOT=/path/to.png
			const c = await wc();
			await P.evaluate(() => { document.querySelectorAll('#lpn_canvas .lpn-label, #lpn_canvas text').forEach((t) => { t.style.visibility = 'hidden'; }); });
			await P.screenshot({ path: process.env.EC_WELL_SHOT, clip: { x: Math.max(0, c.x - 60), y: Math.max(0, c.y - 60), width: 120, height: 120 } });
		}
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
