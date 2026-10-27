// THE BOTTOM PANE'S OPEN/CLOSE DOES NOT GET SLOWER, TOGGLE AFTER TOGGLE -- IN A REAL CHROMIUM.
// Run with:
//   node dev/lpn-spike/bottom-pane-toggle-growth-harness.js
//
// Tom, 2026-10-26: after the shut-pane fix, *"it still progressively deteriorates until it delays
// 3 seconds."* Opens Net3 from the examples gallery, toggles the pane N times (default 40) and
// records per toggle: click-to-settled time, the document's node count, its JS event listener count
// and the observers/timers the page has made. Fails if the last toggles are slower than the first
// ones by more than a factor, or if any counted quantity grows from the first toggle to the last.
// Counts are taken after a forced garbage collection, so only what the page still holds counts.
// The pointer is a real mouse click (EC_BPGROW_MOUSE=0 for a scripted one); EC_BPGROW_TAB picks the table
// ('' leaves the default); EC_BPGROW_HOVER=1, _PROFILE=1, _MUT=1, _DIFF=1 print what moves.
// EC_BPGROW_THROTTLE (default 4) slows the CPU; EC_BPGROW_N sets the toggle count.
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
if (process.env.EC_BPGROW_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_BPGROW_LOCKED: '1' }) });
		if (r.status === 75) { console.error('bottom-pane-toggle-growth-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
const TILE_MS = +(process.env.EC_BPGROW_TILE_MS || 0);
let N = 0;
// Each tab is shown, then the pane is opened and shut N times. Graph tabs rebuild their controls on every open.
const SPECS = process.env.EC_BPGROW_TAB !== undefined ? [{ tab: process.env.EC_BPGROW_TAB, n: +(process.env.EC_BPGROW_N || 24) }] : [
	{ tab: 'pipes', n: +(process.env.EC_BPGROW_N || 20) }, { tab: 'tanks', n: 10 }, { tab: 'timeseries', n: 10 },
	{ tab: 'profile', n: 10 }, { tab: 'sysflow', n: 10 }, { tab: 'frequency', n: 10 }];
const FACTOR = +(process.env.EC_BPGROW_FACTOR || 2);
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const spec of SPECS) {
		N = spec.n;
			console.log('  tab ' + spec.tab + ', ' + N + ' toggles');
		const a = await Session.open(browser, 'A');
			const page = a.page;
			let tileHits = 0;
			// Tiles answer like a live server would (a real 256 px PNG), so the basemap paints as it does for a visitor.
			const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) { c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; } crcT[n] = c >>> 0; }
			const crc = (buf) => { let c = 0xffffffff; for (const x of buf) { c = crcT[(c ^ x) & 255] ^ (c >>> 8); } return (c ^ 0xffffffff) >>> 0; };
			const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
			const ih = Buffer.alloc(13); ih.writeUInt32BE(256, 0); ih.writeUInt32BE(256, 4); ih[8] = 8; ih[9] = 2;
			const raw = Buffer.alloc((256 * 3 + 1) * 256, 200); for (let y = 0; y < 256; y++) { raw[y * (256 * 3 + 1)] = 0; }
			const tile = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', require('zlib').deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, async (r) => { tileHits++; if (TILE_MS) { await new Promise((z) => setTimeout(z, TILE_MS)); } r.fulfill({ status: 200, contentType: 'image/png', body: tile }).catch(() => {}); });
			await page.addInitScript(() => {
				window.EC_DEFAULT_DOCKS = true;
				window.__ro = 0; window.__mo = 0; window.__io = 0; window.__timers = 0; window.__raf = 0;
				['ResizeObserver', 'MutationObserver', 'IntersectionObserver'].forEach((k, i) => {
					const O = window[k]; if (!O) { return; }
					const key = ['__ro', '__mo', '__io'][i];
					window[k] = function (cb) { window[key]++; return new O(cb); };
					window[k].prototype = O.prototype;
				});
				const st = window.setTimeout; window.setTimeout = function () { window.__timers++; return st.apply(this, arguments); };
				const rf = window.requestAnimationFrame; window.requestAnimationFrame = function () { window.__raf++; return rf.apply(this, arguments); };
			});
			await a.goto('Looped-Network.php');
			await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
			await a.settle(2500);
			await page.evaluate(() => {
				let e = document.querySelector('.ec-consent-actions');
				while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
				if (e) { e.style.display = 'none'; }
			});
			if (process.env.EC_BPGROW_W) { await page.setViewportSize({ width: +process.env.EC_BPGROW_W, height: +process.env.EC_BPGROW_H }); await a.settle(800); }
			const cdp = await page.context().newCDPSession(page);
			const THROTTLE = process.env.EC_BPGROW_THROTTLE || '4';
			if (THROTTLE !== '0') { await cdp.send('Emulation.setCPUThrottlingRate', { rate: +THROTTLE }); }
			// A real pointer click (move, press, release) when EC_BPGROW_MOUSE=1, else a scripted click.
			const toggle = async () => {
				if (process.env.EC_BPGROW_MOUSE !== '0') {
					await page.evaluate(() => { window.__t0 = performance.now(); });
					await page.mouse.move(0, 300); await page.click('#lpn_pane_btn');
					return page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => res(performance.now() - window.__t0), 0)))));
				}
				return page.evaluate(() => new Promise((res) => {
					const t0 = performance.now();
					document.getElementById('lpn_pane_btn').click();
					requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => res(performance.now() - t0), 0)));
				}));
			};
			const counts = async () => {
				await cdp.send('HeapProfiler.collectGarbage');
				const d = await cdp.send('Memory.getDOMCounters');
				const w = await page.evaluate(() => ({ ro: window.__ro, mo: window.__mo, io: window.__io, timers: window.__timers, raf: window.__raf,
					svgKids: document.querySelectorAll('svg *').length, tips: document.querySelectorAll('.tooltip').length, ls: (() => { let n = 0; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += k.length + localStorage.getItem(k).length; } } catch (e) {} return n; })(), tf: Array.from(document.querySelectorAll('svg g[transform]')).slice(0, 3).map((g) => g.getAttribute('transform')).join('|').slice(0, 90), mapH: document.querySelector('svg') && document.querySelector('svg').getAttribute('height'), ids: document.querySelectorAll('[id]').length }));
				return Object.assign({ nodes: d.nodes, listeners: d.jsEventListeners }, w);
			};
			const TAB = spec.tab;
			if (TAB) {
				await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
				await page.click('#lpn_pane_tab_' + TAB);
				await a.settle(1500);
				await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
				await a.settle(500);
			}
			const snap = () => page.evaluate(() => { const m = {}; document.querySelectorAll('*').forEach((e) => { const k = e.tagName + '.' + ((e.getAttribute && e.getAttribute('class')) || '').slice(0, 60) + '#' + ((e.parentNode && e.parentNode.id) || ''); m[k] = (m[k] || 0) + 1; }); return m; });
			let s0 = null;
			await cdp.send('Profiler.enable');
			const profWin = async (start) => {
				if (!process.env.EC_BPGROW_PROFILE) { return null; }
				if (start) { await cdp.send('Profiler.start'); return null; }
				const { profile } = await cdp.send('Profiler.stop');
				const dt = profile.timeDeltas, self = {}, byId = {};
				profile.nodes.forEach((n) => { byId[n.id] = n; });
				profile.samples.forEach((id, i) => { const cf = byId[id].callFrame, k = cf.functionName + ' ' + cf.url.split('/').pop() + ':' + cf.lineNumber; self[k] = (self[k] || 0) + (dt[i] || 0); });
				return self;
			};
			let profA = null, profB = null;
			if (process.env.EC_BPGROW_MUT) {
				await page.evaluate(() => { window.__mut = {}; new MutationObserver((ms) => { ms.forEach((m) => { m.addedNodes.forEach((n) => { const k = '+' + n.nodeName + '.' + ((n.getAttribute && n.getAttribute('class')) || '').slice(0, 50) + ' in ' + (m.target.id || m.target.nodeName + '.' + (m.target.getAttribute && (m.target.getAttribute('class') || '')).slice(0, 30)); window.__mut[k] = (window.__mut[k] || 0) + 1; }); m.removedNodes.forEach((n) => { const k = '-' + n.nodeName + '.' + ((n.getAttribute && n.getAttribute('class')) || '').slice(0, 50) + ' in ' + (m.target.id || m.target.nodeName); window.__mut[k] = (window.__mut[k] || 0) + 1; }); }); }).observe(document, { subtree: true, childList: true }); });
			}
			const rows = [];
			for (let i = 0; i < N; i++) {
				if (i === 4) { await profWin(true); }
				if (i === N - 8) { profA = await profWin(false); await profWin(true); }
				const ms = await toggle();
				await a.settle(250);
				if (process.env.EC_BPGROW_DIFF && i === 3) { s0 = await snap(); }
				if (process.env.EC_BPGROW_HOVER && i % 2 === 0) {
					// The pointer rests on the table's cells and headings the way a hand does between toggles, so their name tips arm and open.
					const box = await page.evaluate(() => { const r = document.getElementById('lpn_pane_body').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
					for (let k = 0; k < 6; k++) { await page.mouse.move(box.x + 40 + k * 90, box.y + 20 + (k % 3) * 25, { steps: 4 }); await a.settle(250); }
				}
				rows.push(Object.assign({ i: i + 1, ms: Math.round(ms), tiles: tileHits, open: i % 2 === 0 }, await counts()));
			}
			rows.forEach((r) => console.log('  toggle ' + String(r.i).padStart(3) + ' ' + (r.open ? 'open ' : 'close') + ' ' + String(r.ms).padStart(6) + ' ms  tiles ' + r.tiles + '  nodes ' + r.nodes + '  listeners ' + r.listeners + '  ro ' + r.ro + ' mo ' + r.mo + ' io ' + r.io + '  timers ' + r.timers + ' raf ' + r.raf + ' tf ' + r.tf + ' mapH ' + r.mapH + ' ls ' + r.ls + ' tips ' + r.tips + ' svgKids ' + r.svgKids + ' ids ' + r.ids));
			if (process.env.EC_BPGROW_PROFILE) {
				profB = await profWin(false);
				const ks = Object.keys(profB).map((k) => [k, (profB[k] - ((profA || {})[k] || 0)) / 1000]).sort((x, y) => y[1] - x[1]).slice(0, 12);
				ks.forEach(([k, v]) => console.log('  prof growth ' + v.toFixed(0).padStart(6) + ' ms  ' + k + '   (early ' + (((profA || {})[k] || 0) / 1000).toFixed(0) + ')'));
			}
			if (process.env.EC_BPGROW_MUT) { console.log(JSON.stringify(await page.evaluate(() => window.__mut), null, 1)); }
			if (s0) { const s1 = await snap(); Object.keys(s1).forEach((k) => { if (s1[k] !== (s0[k] || 0)) { console.log('  live DOM  ' + k + '  ' + (s0[k] || 0) + ' -> ' + s1[k]); } }); }
			// Compare same-kind toggles (open with open): the first four and the last four of each kind.
			for (const open of [true, false]) {
				const k = rows.filter((r) => r.open === open);
				const first = median(k.slice(0, 4).map((r) => r.ms)), last = median(k.slice(-4).map((r) => r.ms));
				ok(spec.tab + ': ' + (open ? 'open' : 'close') + ': last toggles no slower than ' + FACTOR + 'x the first (plus 60 ms)', last <= first * FACTOR + 60, 'first ' + first + ' ms, last ' + last + ' ms');
			}
			// A count that grows per toggle is the cause; compare the 2nd open (state is settled) with the last open.
			const a2 = rows[2], z = rows[rows.length - 2];
			['ls', 'nodes', 'listeners', 'ro', 'mo', 'io', 'svgKids', 'ids'].forEach((k) => ok(spec.tab + ': ' + k + ' stays flat across toggles (after a forced collection)', z[k] <= a2[k] + (k === 'nodes' ? 60 : k === 'listeners' ? 30 : k === 'ids' ? 1 : 0), a2[k] + ' -> ' + z[k]));
			ok(spec.tab + ': timers made per toggle stay flat', (rows[rows.length - 1].timers - rows[rows.length - 3].timers) <= (rows[4].timers - rows[2].timers) + 2, (rows[4].timers - rows[2].timers) + ' -> ' + (rows[rows.length - 1].timers - rows[rows.length - 3].timers));
			await a.page.context().close().catch(() => {});
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	if (fails) { console.log('FAILED: ' + fails); process.exit(1); }
	console.log('bottom-pane-toggle-growth-harness: all passed');
}
main().catch((e) => { console.error(e); process.exit(1); });
