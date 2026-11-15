// **THE PICK CHOOSER NEVER OPENS ON AN ORDINARY CLICK, AT ANY ZOOM** (Perry's pre-review of
// feat/pick-chooser: zoomed out on Net3, a screen-pixel rule opened a box on one click in four, 39 of
// 97 at 12 notches out, where master gives none). Ambiguity is judged in the model, so the view's
// scale cannot matter. Real Chromium, the Net3 example, a click on EVERY node's centre:
//   A. desktop, a mouse: at the opening view and 4, 8, 12 and 20 notches out (the network drawn 120 px wide), no click opens a box, and
//      every click selects exactly what the same click selects with the chooser rule switched off
//      (the rule's function is stubbed to answer "ordinary" in the same page, which is the path master has);
//   B. phone, 390 x 844 touch, 8 notches out: the same with a finger.
// The cases where a box DOES open are in pick-chooser-browser-harness.js.
//
//   node dev/lpn-spike/pick-chooser-zoom-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'pick-chooser-zoom-browser-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PICKZOOM_LOCKED';
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
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net3 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn'), 'utf8');
	const errors = [];
	const open = async (S) => {
		S.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net3);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(3000);
	};
	// Every node centre on screen, and how wide the network is drawn.
	const centres = (S) => S.page.evaluate(() => {
		const out = [];
		let l = Infinity, r = -Infinity;
		document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node], #lpn_canvas .lpn-node[data-node]').forEach((e) => {
			const b = e.getBoundingClientRect();
			if (!(b.width > 0)) { return; }
			const x = b.left + b.width / 2, y = b.top + b.height / 2;
			l = Math.min(l, x); r = Math.max(r, x);
			const top = document.elementsFromPoint(x, y)[0];
			if (top && top.closest && top.closest('#lpn_canvas') && x > 0 && y > 0 && x < innerWidth && y < innerHeight) { out.push({ id: e.dataset.node, x, y }); }
		});
		return { pts: out, width: r - l };
	});
	const readAndReset = (S) => S.page.evaluate(() => {
		const sel = Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link ? 'l' + e.dataset.link : 'x')).sort().join(',');
		const box = !!document.querySelector('.lpn-pick-chooser');
		document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove());
		const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); }
		return { sel, box };
	});
	const sweep = async (S, touch) => {
		const { pts, width } = await centres(S);
		const cdp = touch ? await S.page.context().newCDPSession(S.page) : null;
		const press = async (p) => {
			if (touch) {
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
				await sleep(35);
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				await sleep(touch ? 60 : 0);
			} else { await S.page.mouse.move(p.x, p.y); await S.page.mouse.click(p.x, p.y); await sleep(40); }
		};
		const run = async () => { const res = []; for (const p of pts) { await press(p); res.push(await readAndReset(S)); } return res; };
		const withRule = await run();
		await S.page.evaluate(() => { window.__pickRule = EngCalcs.lpnGeom.pickCandidates; EngCalcs.lpnGeom.pickCandidates = () => []; });
		const ruleOff = await run();
		await S.page.evaluate(() => { EngCalcs.lpnGeom.pickCandidates = window.__pickRule; });
		const boxes = withRule.filter((r) => r.box).length;
		const differ = withRule.filter((r, i) => r.sel !== ruleOff[i].sel).length;
		return { n: pts.length, width: Math.round(width), boxes, differ, ruleOffBoxes: ruleOff.filter((r) => r.box).length };
	};
	const zoomOut = async (S, notches) => {
		const c = await S.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await S.page.mouse.move(c.x, c.y);
		for (let i = 0; i < notches; i++) { await S.page.mouse.wheel(0, 120); await sleep(30); }
		await S.settle(900);
	};
	try {
		console.log('\nA. Desktop, a mouse, Net3');
		const D = await Session.open(browser, NAME + '-d', { viewport: { width: 1400, height: 900 } });
		await open(D);
		let done = 0;
		for (const [label, notches] of [['the opening view', 0], ['4 notches out', 4], ['8 notches out', 4], ['12 notches out', 4], ['20 notches out', 8]]) {
			await zoomOut(D, notches);
			const r = await sweep(D, false);
			done += notches;
			ok(label + ' (network ' + r.width + ' px wide): ' + r.n + ' node-centre clicks open ' + r.boxes + ' boxes', r.n >= 90 && r.boxes === 0, JSON.stringify(r));
			ok('...and each selects what the same click selects with the rule off', r.differ === 0, JSON.stringify(r));
		}
		await D.page.close();

		console.log('\nB. Phone, 390 x 844, a finger, Net3, 8 notches out');
		const T = await Session.open(browser, NAME + '-p', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await open(T);
		await zoomOut(T, 8);
		const r = await sweep(T, true);
		ok('8 notches out (network ' + r.width + ' px wide): ' + r.n + ' node-centre taps open ' + r.boxes + ' boxes', r.n >= 50 && r.boxes === 0, JSON.stringify(r));
		ok('...and each selects what the same tap selects with the rule off', r.differ === 0, JSON.stringify(r));
		await T.page.close();
		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
