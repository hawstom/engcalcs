// ZOOMING OUT STOPS WHEN THE WHOLE WORLD SPANS THE MAP'S WIDTH, BY EVERY ZOOM ROUTE.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/zoom-floor-browser-harness.js
//
// Tom, 2026-11-01, on "zooming out stops when the whole world fills the width of the map": *"Not
// true. Net3 stops when only part of the northern hemisphere is shown and only a part of one ocean."*
// The shipped Net3 is on California zone 3 (EPSG:2227, feet). `minScale()` needs the zone's area of
// use to measure the plane unit, the full register that holds it is fetched only when the projection
// chooser opens, so it was unknown and the floor fell back to "the drawing is a 4 px mark" (about
// 27,000 ft across, 9.6e6 ft visible). Measured here: the visible span at the floor, as a share of
// the 40,075 km equator (projected) or of 360 degrees (the lat/lon original of Net3). Routes: wheel,
// the +/- chip buttons, the - key, and a two-finger pinch. A local grid drawing is checked to keep
// its own (drawing-sized) floor.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { serveLatLonNet3 } = require('./latlon-net3-route.js');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ZOOM_FLOOR_BROWSER_LOCKED';
const NAME = 'zoom-floor-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++; if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const GRID_INP = ['[TITLE]', 'grid', '', '[JUNCTIONS]', ' J1  10  100', ' J2  10  100', '', '[RESERVOIRS]', ' R1  50', '',
	'[PIPES]', ' P1  R1  J1  1000  12  100  0  Open', ' P2  J1  J2  1000  8  100  0  Open', '', '[DEMANDS]', ' J2  50', '',
	'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '', '[COORDINATES]', ' R1  0  0', ' J1  100  0', ' J2  200  50', '', '[END]', ''].join('\n');
const EQUATOR_FT = 40075000 * 3.280839895;

async function main() {
	const env = require(path.join(REPO, 'dev/browser-pass/lib/env.js'));
	const { Session } = require(path.join(REPO, 'dev/browser-pass/lib/session.js'));
	const { chromium } = require(path.join(REPO, 'dev/browser-pass/node_modules/playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	async function open(kind) {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, serviceWorkers: 'block' });
		if (kind === 'latlon') { await serveLatLonNet3(a.page); }
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		if (kind === 'grid') {
			await a.page.setInputFiles('#lpn_inp_file', { name: 'grid.inp', mimeType: 'text/plain', buffer: Buffer.from(GRID_INP) });
			await a.settle(800);
			await a.page.click('#lpn_dialog_buttons button');
		} else {
			await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		}
		await a.settle(1500);
		return a;
	}
	const view = (a) => a.page.evaluate(() => {
		const s = document.getElementById('lpn_canvas');
		const g = Array.from(s.querySelectorAll(':scope > g')).find((x) => /scale/.test(x.getAttribute('transform') || ''));
		const m = /scale\(([^)]+)\)/.exec(g.getAttribute('transform'));
		return { w: s.clientWidth, s: parseFloat(m[1]) };
	});
	const routes = {
		wheel: async (a) => { await a.page.mouse.move(700, 450); for (let i = 0; i < 260; i++) { await a.page.mouse.wheel(0, 240); await a.page.waitForTimeout(8); } },
		button: async (a) => { for (let i = 0; i < 260; i++) { await a.page.evaluate(() => document.getElementById('lpn_zoom_out').click()); } },
		key: async (a) => { await a.page.mouse.move(700, 450); for (let i = 0; i < 260; i++) { await a.page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '-', bubbles: true }))); } },
		pinch: async (a) => {
			// A real two-finger gesture through the browser's touch input (CDP), not synthetic events.
			const cdp = await a.page.context().newCDPSession(a.page);
			const cx = 700, cy = 450, tp = (x1, x2) => [{ x: x1, y: cy, id: 1 }, { x: x2, y: cy, id: 2 }];
			for (let k = 0; k < 14; k++) {
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(cx - 300, cx + 300) });
				for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(cx - 300 + i * 29, cx + 300 - i * 29) }); }
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				if (process.env.ZF_DEBUG) { console.log('pinch', k, JSON.stringify(await view(a))); }
			}
		}
	};
	try {
		for (const kind of (process.env.ZF_KINDS || 'projected,latlon').split(',')) {
			for (const route of (process.env.ZF_ROUTES || Object.keys(routes).join(',')).split(',')) {
				const a = await open(kind);
				await routes[route](a);
				await a.settle(400);
				const v = await view(a);
				if (kind === 'latlon') {
					const deg = v.w / v.s;
					ok(kind + ' Net3, ' + route + ': visible span is the whole 360 degrees', deg > 340 && deg < 380, deg.toFixed(1) + ' degrees');
				} else {
					const share = v.w / v.s / EQUATOR_FT;
					ok(kind + ' Net3 (EPSG:2227), ' + route + ': visible span is the whole equator', share > 0.95 && share < 1.1, (share * 100).toFixed(1) + ' % of 40,075 km');
				}
				ok(kind + ' ' + route + ': no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
				await a.close();
			}
		}
		const g = await open('grid');
		await routes.wheel(g);
		await g.settle(400);
		const v = await view(g);
		ok('a local grid drawing keeps its drawing-sized floor (200 units across at ~4 px: scale 0.02..0.05)', v.s >= 0.015 && v.s <= 0.05, 'scale ' + v.s);
		await g.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));
