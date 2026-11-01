// OPENING AND CLOSING THE BOTTOM PANE STAYS FAST, TOGGLE AFTER TOGGLE -- IN A REAL CHROMIUM.
// Run with:
//   node dev/lpn-spike/bottom-pane-toggle-lag-harness.js
//
// Tom, 2026-10-25: *"Bottom pane is slow to open and close (about 4-5 seconds baseline) ... on dev
// master w/ Net3."* Cause: closing the pane was `display:none`, which threw away the layout of the
// shown table's ~1,300 form controls, and every open derived it again (forced by paneMaxHeight()).
// Fixed by shutting the pane with content-visibility instead (applyPaneLayout()).
// Opens Net3 with a first visit's docks, shows the Pipes table, then opens and closes the pane
// through the toolbar button, and reports each toggle's time from click to settled (a ceiling with
// EC_BPLAG_STRICT=1). A fast CPU hides the cost, so the page runs 6x throttled (EC_BPLAG_THROTTLE=0 for none):
// master measures about 900 to 1,200 ms to open here, the fix about 500 ms. EC_BPLAG_TAB picks the table.
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
const BOUND_MS = +(process.env.EC_BPLAG_BOUND_MS || 900);
// The times are printed, and fail only with EC_BPLAG_STRICT=1: under check_all's four suites (load 30 on
// 24 threads, 2026-10-26) a toggle read 2.8 s on the fixed code. The shut-pane layout check holds the fix.
const STRICT = process.env.EC_BPLAG_STRICT === '1';
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
		// A first visit's own docks (the visitor's layout), which a driven browser starts without.
		if (process.env.EC_BPLAG_DOCKS !== '0') { await page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; }); }
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
		const THROTTLE = process.env.EC_BPLAG_THROTTLE || '6';
		if (THROTTLE !== '0') {
			const c2 = await page.context().newCDPSession(page);
			await c2.send('Emulation.setCPUThrottlingRate', { rate: +THROTTLE });
		}
		const TAB = process.env.EC_BPLAG_TAB || 'pipes';
		if (TAB !== '0') {
			await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
			await page.click('#lpn_pane_tab_' + TAB);
			await a.settle(1500);
			await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
			await a.settle(500);
		}
		const times = [];
		for (let i = 0; i < ROUNDS; i++) {
			const open = await toggle();
			const isOpen = await page.evaluate(() => !document.getElementById('lpn_pane').classList.contains('lpn-pane-shut'));
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
			if (process.env.EC_BPLAG_PROFILE === '3') {
				// where the self time of the chosen function (EC_BPLAG_FN) is called from: the 4 nearest callers
				const parent = {}; profile.nodes.forEach((n) => (n.children || []).forEach((c) => { parent[c] = n.id; }));
				const chain = {};
				profile.samples.forEach((id, i) => {
					if (byId[id].callFrame.functionName !== (process.env.EC_BPLAG_FN || 'viewportHeight')) { return; }
					const names = []; let cur = parent[id];
					while (cur && names.length < 5) { names.push(byId[cur].callFrame.functionName + ':' + byId[cur].callFrame.lineNumber); cur = parent[cur]; }
					const k = names.join(' < '); chain[k] = (chain[k] || 0) + (dt[i] || 0);
				});
				Object.entries(chain).sort((x, y) => y[1] - x[1]).slice(0, 8).forEach(([k, v]) => console.log('  from ' + (v / 1000).toFixed(0).padStart(6) + ' ms  ' + k));
			}
			Object.entries(self).sort((x, y) => y[1] - x[1]).slice(0, 15).forEach(([k, v]) => console.log('  prof ' + (v / 1000).toFixed(0).padStart(7) + ' ms  ' + k));
		}
		// What keeps it fast: a shut pane still has a layout (display is not none), skipped by content-visibility.
		const shut = await page.evaluate(() => { const p = document.getElementById('lpn_pane'), c = getComputedStyle(p); return { display: c.display, cv: c.contentVisibility, h: p.getBoundingClientRect().height }; });
		ok('a shut pane keeps its layout (not display:none) and takes no height', shut.display !== 'none' && shut.cv === 'hidden' && shut.h === 0, JSON.stringify(shut));
		times.forEach((t, i) => {
			ok('round ' + (i + 1) + ': the pane opens', t.isOpen);
			const timed = STRICT ? ok : (name, cond, extra) => console.log('  info ' + name + (cond ? '' : ' (OVER)') + '   ' + extra);
			timed('round ' + (i + 1) + ': open settles within ' + BOUND_MS + ' ms', t.open <= BOUND_MS, t.open.toFixed(0) + ' ms');
			timed('round ' + (i + 1) + ': close settles within ' + BOUND_MS + ' ms', t.close <= BOUND_MS, t.close.toFixed(0) + ' ms');
		});
	} finally {
		await browser.close();
		env.stopServer();
	}
	if (fails) { console.log('FAILED: ' + fails); process.exit(1); }
	console.log('bottom-pane-toggle-lag-harness: all passed');
}
main().catch((e) => { console.error(e); process.exit(1); });
