// OPENING AND CLOSING THE BOTTOM PANE STAYS FAST, TOGGLE AFTER TOGGLE -- IN A REAL CHROMIUM.
// Run with:
//   node dev/lpn-spike/bottom-pane-toggle-lag-harness.js
//
// Tom, production, 2026-10-20: the bottom pane took about 4500 ms or longer on every open and
// close after the first open, with Net3 at its initial view; the first open was instant.
// Opens Net3, toggles the pane open and closed several times through the toolbar button, and
// fails if any toggle (the first included) takes longer than the budget from click to settled.
// NOT YET A REPRODUCTION: on jasmine (headless Chromium, also against production build c375f221)
// every toggle settles in about 30 to 180 ms, so this passes on master. It guards the ceiling only.
// EC_BPLAG_PROFILE=1 (self time) or =2 (also inclusive time) prints the top CPU self-time functions of the toggles.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_BPLAG_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_BPLAG_LOCKED: '1' }) });
		if (r.status === 75) { console.error('bottom-pane-toggle-lag-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
const BOUND_MS = +(process.env.EC_BPLAG_BOUND_MS || 600);
const ROUNDS = +(process.env.EC_BPLAG_ROUNDS || 4);
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		// Tiles answer like a live server would (a real 256 px PNG), so the basemap behind the
		// project paints and repaints as it does for a visitor; the sandbox has no internet.
		const PNG = require('zlib').deflateSync;
		function tilePng() {
			const w = 256, raw = Buffer.alloc((w * 3 + 1) * w, 200);
			for (let y = 0; y < w; y++) { raw[y * (w * 3 + 1)] = 0; }
			const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) { c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; } crcT[n] = c >>> 0; }
			const crc = (buf) => { let c = 0xffffffff; for (const x of buf) { c = crcT[(c ^ x) & 255] ^ (c >>> 8); } return (c ^ 0xffffffff) >>> 0; };
			const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
			const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(w, 4); ih[8] = 8; ih[9] = 2;
			return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', PNG(raw)), chunk('IEND', Buffer.alloc(0))]);
		}
		const tile = tilePng();
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: tile }));
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(2500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		if (process.env.EC_BPLAG_W) { await page.setViewportSize({ width: +process.env.EC_BPLAG_W, height: +process.env.EC_BPLAG_H }); await a.settle(500); }
		const prof = !!process.env.EC_BPLAG_PROFILE;
		let cdp = null;
		if (prof) {
			cdp = await page.context().newCDPSession(page);
			await cdp.send('Profiler.enable');
			await cdp.send('Profiler.start');
		}
		// Click to settled: the click handler plus the next two frames, which is when a long
		// task (layout, a label pass) has finished and the page can paint.
		const toggle = () => page.evaluate(() => new Promise((res) => {
			const t0 = performance.now();
			document.getElementById('lpn_pane_btn').click();
			requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => res(performance.now() - t0), 0)));
		}));
		if (process.env.EC_BPLAG_THROTTLE) {
			const c2 = await page.context().newCDPSession(page);
			await c2.send('Emulation.setCPUThrottlingRate', { rate: +process.env.EC_BPLAG_THROTTLE });
		}
		if (process.env.EC_BPLAG_TAB) {
			await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
			await page.click('#lpn_pane_tab_' + process.env.EC_BPLAG_TAB);
			await a.settle(1500);
			await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
			await a.settle(500);
		}
		const times = [];
		for (let i = 0; i < ROUNDS; i++) {
			const open = await toggle();
			const isOpen = await page.evaluate(() => document.getElementById('lpn_pane').style.display !== 'none');
			await a.settle(+(process.env.EC_BPLAG_PAUSE || 300));
			const close = await toggle();
			await a.settle(+(process.env.EC_BPLAG_PAUSE || 300));
			times.push({ open, close, isOpen });
		}
		if (prof) {
			const { profile } = await cdp.send('Profiler.stop');
			const dt = profile.timeDeltas, self = {};
			const byId = {};
			profile.nodes.forEach((n) => { byId[n.id] = n; });
			profile.samples.forEach((id, i) => {
				const cf = byId[id].callFrame, k = cf.functionName + ' ' + cf.url.split('/').pop() + ':' + cf.lineNumber;
				self[k] = (self[k] || 0) + (dt[i] || 0);
			});
			if (process.env.EC_BPLAG_PROFILE === '2') {
				// inclusive time per function name
				const parent = {}; profile.nodes.forEach((n) => (n.children || []).forEach((c) => { parent[c] = n.id; }));
				const incl = {};
				profile.samples.forEach((id, i) => {
					const seen = {}; let cur = id;
					while (cur) { const cf = byId[cur].callFrame, k = cf.functionName + ':' + cf.lineNumber; if (!seen[k]) { seen[k] = 1; incl[k] = (incl[k] || 0) + (dt[i] || 0); } cur = parent[cur]; }
				});
				Object.entries(incl).sort((x, y) => y[1] - x[1]).slice(0, 40).forEach(([k, v]) => console.log('  incl ' + (v / 1000).toFixed(0).padStart(7) + ' ms  ' + k));
			}
			Object.entries(self).sort((x, y) => y[1] - x[1]).slice(0, 15).forEach(([k, v]) => console.log('  prof ' + (v / 1000).toFixed(0).padStart(7) + ' ms  ' + k));
		}
		times.forEach((t, i) => {
			ok('round ' + (i + 1) + ': open settles within ' + BOUND_MS + ' ms', t.isOpen && t.open <= BOUND_MS, t.open.toFixed(0) + ' ms');
			ok('round ' + (i + 1) + ': close settles within ' + BOUND_MS + ' ms', t.close <= BOUND_MS, t.close.toFixed(0) + ' ms');
		});
	} finally {
		await browser.close();
		env.stopServer();
	}
	if (fails) { console.log('FAILED: ' + fails); process.exit(1); }
	console.log('bottom-pane-toggle-lag-harness: all passed');
}
main().catch((e) => { console.error(e); process.exit(1); });
