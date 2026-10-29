// ZOOM TO SELECTION, in real Chrome. Run with:
//   node dev/lpn-spike/zoom-selection-browser-harness.js
//
// Franco's wish list, row 8: a second named view beside Zoom to fit, framed on what is selected.
//
//   1. With nothing selected the Map-menu row is there and greyed (never hidden).
//   2. One node, several nodes, and a pipe that has vertices: after the row is pressed, every
//      selected mark lies wholly inside the canvas, and the view has moved in on it (the selection
//      is drawn larger than it was at Zoom to fit). One node is not zoomed to infinity: it is
//      framed at the same street scale a lone junction gets from Zoom to fit.
//   3. In an XY project (the Basic example, which has pipes with vertices) and in a geographic one
//      (EPANET Net3 at Novato; none of the shipped geographic examples has a vertex).
//
// The marks are read off the DOM (`.lpn-selected`), so the harness asserts what a person sees.
// Labels come from the language file. Do not prefix with flock; this takes the lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ZOOM_SELECTION_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('zoom-selection-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('zoom-selection-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('zoom-selection-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function openExample(browser, Session, match) {
	const a = await Session.open(browser, 'zoomsel');
	// No published XY example has a pipe with vertices now, so the XY section is handed the Basic-network fixture in place of the Net1 card's file.
	if (/Net1/.test(match)) {
		const body = require('fs').readFileSync(path.join(__dirname, 'fixtures', 'Basic-example-US-units.lwn'), 'utf8');
		await a.page.route(/examples\/Net1-Scenarios\.lwn/, (route) => route.fulfill({ status: 200, contentType: 'application/json', body }));
	}
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.menuClick(await a.lang('lpn_examples_menu'), 'file');
	await a.settle(600);
	await a.page.waitForSelector('button.lpn-example-card', { timeout: 30000 });
	const found = await a.page.evaluate((m) => {
		const b = [...document.querySelectorAll('button.lpn-example-card')].find(x => x.textContent.indexOf(m) >= 0);
		if (!b) { return false; }
		b.click();
		return true;
	}, match);
	if (!found) { throw new Error('no examples card matching "' + match + '"'); }
	await a.settle(4000);
	return a;
}

// Screen centre of the first spot on an element that is on the canvas and not under a symbol.
const SCREEN = `
	function canvasBox() { return document.getElementById('lpn_canvas').getBoundingClientRect(); }
	function centreOf(e) { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }
	function onCanvas(p, c) { return p.x > c.left + 60 && p.x < c.right - 60 && p.y > c.top + 90 && p.y < c.bottom - 90; }
`;

async function nodeSpots(a, n) {
	return a.page.evaluate(({ n, SCREEN }) => {
		eval(SCREEN);
		const c = canvasBox(), out = [];
		const els = [...document.querySelectorAll('circle.lpn-node-hit, path.lpn-node-hit')];
		// The extremes first, so "several" spans real distance.
		els.sort((p, q) => centreOf(p).x - centreOf(q).x);
		const pts = els.map(centreOf).filter(p => onCanvas(p, c));
		if (!pts.length) { return out; }
		out.push(pts[0]);
		if (n > 1) { out.push(pts[pts.length - 1]); }
		if (n > 2) { out.push(pts[Math.floor(pts.length / 2)]); }
		return out;
	}, { n, SCREEN: SCREEN.replace(/`/g, '') });
}
// A spot on the first segment of a pipe that has at least one vertex.
async function vertexLinkSpot(a, minNums) {
	return a.page.evaluate(({ SCREEN, minNums }) => {
		eval(SCREEN);
		const c = canvasBox(), svg = document.getElementById('lpn_canvas');
		for (const h of document.querySelectorAll('polyline.lpn-link-hit')) {
			const nums = (h.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number);
			if (nums.length < minNums) { continue; }   // 8 = two ends and at least two vertices... see caller
			const m = h.getScreenCTM();
			const pt = (i) => ({ x: m.a * nums[i] + m.c * nums[i + 1] + m.e, y: m.b * nums[i] + m.d * nums[i + 1] + m.f });
			for (let i = 0; i + 3 < nums.length; i += 2) {
				const p0 = pt(i), p1 = pt(i + 2);
				for (const f of [0.5, 0.3, 0.7]) {
					const q = { x: p0.x + (p1.x - p0.x) * f, y: p0.y + (p1.y - p0.y) * f };
					const e = document.elementFromPoint(q.x, q.y);
					// Something else (a box, a symbol) on top of the pipe there would take the click.
					if (Math.hypot(p1.x - p0.x, p1.y - p0.y) > 6 && onCanvas(q, c) && e && /lpn-link\b/.test(e.getAttribute('class') || '')) {
						return { x: q.x, y: q.y, id: h.getAttribute('data-link'), pts: nums.length / 2 };
					}
				}
			}
		}
		return null;
	}, { SCREEN: SCREEN.replace(/`/g, ''), minNums });
}
async function marks(a) {
	return a.page.evaluate(() => {
		const c = document.getElementById('lpn_canvas').getBoundingClientRect();
		const els = [...document.querySelectorAll('#lpn_canvas .lpn-selected')];
		let l = Infinity, r = -Infinity, t = Infinity, b = -Infinity;
		els.forEach(e => { const q = e.getBoundingClientRect(); l = Math.min(l, q.left); r = Math.max(r, q.right); t = Math.min(t, q.top); b = Math.max(b, q.bottom); });
		return { n: els.length, l, r, t, b, c: { l: c.left, r: c.right, t: c.top, b: c.bottom }, w: r - l, h: b - t };
	});
}
async function clickAt(a, p, shift) {
	if (shift) { await a.page.keyboard.down('Shift'); }
	await a.page.mouse.click(p.x, p.y);
	if (shift) { await a.page.keyboard.up('Shift'); }
	await a.settle(300);
}
async function clearSelection(a) {
	await a.page.keyboard.press('Escape');
	await a.settle(200);
	return (await marks(a)).n;
}
function inside(m, tol) {
	return m.l >= m.c.l - tol && m.r <= m.c.r + tol && m.t >= m.c.t - tol && m.b <= m.c.b + tol;
}

async function section(browser, Session, title, match, minNums) {
	console.log('\n=== ' + title + ' ===');
	const a = await openExample(browser, Session, match);
	try {
		const ROW = await a.lang('lpn_tool_zoom_selection');
		await a.toolbarClick(await a.lang('lpn_tool_zoom_extent'));
		await a.settle(900);
		const row = async () => (await a.menuRows('map')).find(r => r.label === ROW);

		await clearSelection(a);
		const r0 = await row();
		ok('the Map menu offers "' + ROW + '"', !!r0);
		ok('...greyed while nothing is selected', !!r0 && r0.disabled === true);

		const cases = [['one node', 1], ['several nodes', 3]];
		for (const [name, n] of cases) {
			await clearSelection(a);
			await a.toolbarClick(await a.lang('lpn_tool_zoom_extent'));
			await a.settle(900);
			const spots = await nodeSpots(a, n);
			for (let i = 0; i < spots.length; i++) { await clickAt(a, spots[i], i > 0); }
			const before = await marks(a);
			ok(name + ': ' + n + ' selected before', before.n >= 1, String(before.n));
			const r1 = await row();
			ok(name + ': the row is enabled', !!r1 && r1.disabled === false);
			await a.menuClick(ROW, 'map');
			await a.settle(700);
			const after = await marks(a);
			ok(name + ': every selected mark is on the canvas', inside(after, 1), JSON.stringify([after.l, after.r, after.t, after.b]));
			if (n > 1) {
				const cw = after.c.r - after.c.l, ch = after.c.b - after.c.t;
				ok(name + ': the selection fills the canvas in one direction (at least 60%)', after.w >= cw * 0.6 || after.h >= ch * 0.6,
					before.w.toFixed(0) + 'x' + before.h.toFixed(0) + ' -> ' + after.w.toFixed(0) + 'x' + after.h.toFixed(0));
			} else {
				ok(name + ': a lone node is not zoomed to infinity (smaller than a quarter of the canvas)',
					after.w < (after.c.r - after.c.l) / 4 && after.h < (after.c.b - after.c.t) / 4, after.w.toFixed(0) + ' px');
			}
		}

		await clearSelection(a);
		await a.toolbarClick(await a.lang('lpn_tool_zoom_extent'));
		await a.settle(900);
		const vl = await vertexLinkSpot(a, minNums);
		if (!vl) { ok('a pipe with vertices exists on screen', false); return; }
		await clickAt(a, vl, false);
		const lb = await marks(a);
		ok('a pipe of ' + vl.pts + ' points is selected', lb.n >= 1, String(lb.n));
		await a.menuClick(ROW, 'map');
		await a.settle(700);
		const la = await marks(a);
		ok('the whole pipe, vertices included, is on the canvas', inside(la, 1), JSON.stringify([la.l, la.r, la.t, la.b]));
		ok('...and it fills the canvas in one direction (at least 60%)', la.w >= (la.c.r - la.c.l) * 0.6 || la.h >= (la.c.b - la.c.t) * 0.6,
			lb.w.toFixed(0) + 'x' + lb.h.toFixed(0) + ' -> ' + la.w.toFixed(0) + 'x' + la.h.toFixed(0));

		await clearSelection(a);
		const r2 = await row();
		ok('cleared again, the row is greyed again', !!r2 && r2.disabled === true);
		ok('no uncaught page error', a.errors.length === 0, a.errors.join(' | ').slice(0, 200));
	} finally { await a.close(); }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('zoom-selection-browser-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('zoom-selection-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const probe = await Session.open(browser, 'titles');
		await probe.goto('Looped-Network.php?ec_nolog=1');
		const xyTitle = await probe.lang('lpn_ex_net1_title');
		const geoTitle = await probe.lang('lpn_ex_net3_title');
		await probe.close();
		// The XY example has pipes with two vertices (the first segment of one is clicked). No shipped
		// geographic example has a vertex, so there the pipe is a two-point one.
		await section(browser, Session, 'XY project (Net1, gpm)', xyTitle, 8);
		await section(browser, Session, 'geographic project (EPANET Net3, Novato)', geoTitle, 4);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (checks - fails) + ' of ' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
