// A DRAGGED LABEL STAYS UNDER THE CURSOR, AND ZOOM TO FIT DOES NOT MAKE ROOM FOR LABELS IT HIDES.
// Run with:
//   node dev/lpn-spike/label-drag-fit-harness.js
//
// Tom, 2026-09-25, on port 8103 (R-264): *"A possibly related bug makes labels being dragged jump
// double distance (twice as far at the cursor location) at unpredictable locations as they are
// being dragged away."* And (R-263): *"some label placements cause Zoom to Fit to leave too much
// padding."*
//
// **AGAINST THE REAL PAGE, IN A REAL CHROMIUM, ON THE GALLERY'S OWN GEOGRAPHIC NET3.** A stub
// harness on this branch once passed while the real page was blank, so nothing here is stubbed:
// the example opens from the wall, the drag is the real mouse, and every number is read off what
// the browser drew.
//
//   1. THE DRAG. Zoomed in, a mid-network node label is pulled about 380 px in 60 small steps and, at every
//      step, the cursor must still be on the label's box or within a few pixels of it. It failed
//      before by hundreds of pixels: a dragged label's collision candidates stretched the WHOLE
//      leader by 1.3x, 1.7x and 2.2x, and the label in the hand was one of the labels being
//      placed, so the moment its endpoint touched anything it leapt to 2.2x the cursor's distance.
//   2. THE FIT. In a 1900 px window, the topmost label is dragged 150 px up and the bottommost
//      150 px down, then Zoom to fit. Making room for them costs enough zoom to cross the labeling
//      threshold, where no data label is drawn at all, and the fit used to keep the room anyway:
//      8,587 -> 5,856, the network alone in a frame sized for lettering that was not there. Now,
//      if the fit hides the labels, ONE step of the + key must bring them back -- the fit is on
//      the threshold, not a third of the window beyond it.
//
// **RUN IT DIRECTLY -- DO NOT PREFIX IT WITH `flock`.** It locks /tmp/engcalcs-browser.lock itself
// by re-executing under flock, like table-divider-align-harness.js; an outer flock would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_DRAG_FIT_LOCKED';
const NAME = 'label-drag-fit-harness';

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

// Every drawn node data label, by its rendered box. Hidden ones (threshold, shed) are not drawn.
function visibleNodeLabels(page) {
	return page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]'))
		.filter((e) => {
			if (!(e.textContent || '').trim()) { return false; }
			for (let p = e; p && p.id !== 'lpn_canvas'; p = p.parentNode) {
				const cs = getComputedStyle(p);
				if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { return false; }
			}
			return true;
		})
		.map((e) => { const b = e.getBoundingClientRect(); return { id: e.getAttribute('data-nodelbl'), x: b.x, y: b.y, w: b.width, h: b.height }; }));
}
function scaleOf(page) {
	return page.evaluate(() => {
		const m = /scale\(([^)]+)\)/.exec(document.querySelector('#lpn_canvas g').getAttribute('transform') || '');
		return m ? +m[1] : null;
	});
}
function canvasBox(page) {
	return page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
}

async function openNet3World(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, viewport ? { viewport } : undefined);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.openExampleCard(await a.lang('lpn_ex_net3_world_title'));
	await a.settle(1500);
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	return a;
}
async function zoomToFit(a) {
	const lbl = await a.lang('lpn_tool_zoom_extent');
	await a.page.keyboard.press('Escape');
	await a.settle(50);
	const hit = await a.page.evaluate((l) => {
		const b = Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent &&
			((x.getAttribute('aria-label') || '') === l || (x.textContent || '').trim() === l));
		if (b) { b.click(); }
		return !!b;
	}, lbl);
	if (!hit) { throw new Error('no Zoom to fit button labelled "' + lbl + '"'); }
	await a.settle(800);
}
async function drag(page, from, dx, dy, steps, each) {
	await page.mouse.move(from.x, from.y);
	await page.mouse.down();
	for (let k = 1; k <= steps; k++) {
		await page.mouse.move(from.x + dx * k / steps, from.y + dy * k / steps);
		await page.waitForTimeout(15);
		if (each) { await each(k, from.x + dx * k / steps, from.y + dy * k / steps); }
	}
	await page.mouse.up();
}

async function sectionDrag(Session, browser) {
	console.log('\n--- 1. a dragged label stays under the cursor (R-264) ---');
	const a = await openNet3World(Session, browser);
	try {
		const page = a.page, c = await canvasBox(page);
		await page.mouse.move(c.x + c.w / 2, c.y + c.h / 2);
		for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, -240); await a.settle(30); }
		await a.settle(500);
		const labs = await visibleNodeLabels(page);
		ok('labels are drawn at the zoom the drag starts from', labs.length > 10, labs.length + ' drawn');
		labs.sort((p, q) => p.x - q.x);
		const L = labs[Math.floor(labs.length / 2)];
		const from = { x: L.x + Math.min(8, L.w / 2), y: L.y + L.h / 2 };
		let worst = 0, worstAt = 0;
		await drag(page, from, -360, 120, 60, async (k, cx, cy) => {
			const b = await page.evaluate((id) => {
				const r = document.querySelector('#lpn_canvas text[data-nodelbl="' + id + '"]').getBoundingClientRect();
				return { l: r.left, r: r.right, t: r.top, b: r.bottom };
			}, L.id);
			// Distance from the cursor to the label's box, 0 when the cursor is on it. The text may
			// hang on either side of its leader's end -- that flip moves the box by its own width
			// and keeps the cursor at its edge -- so this asks "is the label still in the hand",
			// not "is it exactly where it started under the cursor".
			const d = Math.hypot(Math.max(b.l - cx, 0, cx - b.r), Math.max(b.t - cy, 0, cy - b.b));
			if (d > worst) { worst = d; worstAt = k; }
		});
		await a.settle(300);
		// R-265 rides along, on the same page: the chip's tips are the tip string and nothing else,
		// so the action is not said twice ("Zoom in -- Zoom in one step...").
		for (const [id, nameKey, tipKey] of [['lpn_zoom_in', 'lpn_zoom_in', 'lpn_zoom_in_tip'], ['lpn_zoom_out', 'lpn_zoom_out', 'lpn_zoom_out_tip']]) {
			const name = await a.lang(nameKey), tip = await a.lang(tipKey);
			const shown = await page.evaluate((i) => {
				const e = document.getElementById(i);
				return e.getAttribute('data-bs-original-title') || e.getAttribute('title') || '';
			}, id);
			const times = shown.toLowerCase().split(name.toLowerCase()).length - 1;
			ok('#' + id + ' tip is its own string, with the action said once', shown === tip && times <= 1, JSON.stringify(shown));
		}
		ok('the label never leaves the cursor during a 380 px drag, in 60 steps', worst <= 16,
			'furthest ' + worst.toFixed(1) + ' px from the cursor, at step ' + worstAt + ' (label ' + L.id + ')');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 1).join(' | '));
	} finally {
		await a.close();
	}
}

async function sectionFit(Session, browser) {
	console.log('\n--- 2. Zoom to fit does not make room for labels it hides (R-263) ---');
	const a = await openNet3World(Session, browser, { width: 1900, height: 950 });
	try {
		const page = a.page;
		await zoomToFit(a);
		const s0 = await scaleOf(page), shown0 = (await visibleNodeLabels(page)).length;
		ok('the plain fit shows the labels', shown0 > 10, shown0 + ' drawn at scale ' + s0.toFixed(0));
		for (const [pick, dy] of [['top', -150], ['bottom', 150]]) {
			const labs = await visibleNodeLabels(page);
			labs.sort((p, q) => pick === 'top' ? p.y - q.y : q.y - p.y);
			const L = labs[0];
			await drag(page, { x: L.x + Math.min(8, L.w / 2), y: L.y + L.h / 2 }, dy < 0 ? -40 : 40, dy, 12);
			await a.settle(300);
		}
		await zoomToFit(a);
		const s1 = await scaleOf(page), shown1 = (await visibleNodeLabels(page)).length;
		console.log('  ..   after dragging two labels out and fitting again: scale ' + s1.toFixed(0) +
			' (' + (s1 / s0).toFixed(3) + ' of the plain fit), ' + shown1 + ' labels drawn');
		if (shown1 > 0) {
			ok('the refit shows labels, so any room it made is for lettering on the map', true);
		} else {
			// One step of the + key: the same 1.1 the wheel notch uses. If the labels come back, the
			// fit stopped at the threshold; if they do not, it made room for lettering that was never
			// going to be drawn at the scale it chose.
			await page.keyboard.press('+');
			await a.settle(900);
			const s2 = await scaleOf(page), shown2 = (await visibleNodeLabels(page)).length;
			ok('the refit hides the labels, so it stops at the labeling threshold: one + step shows them again',
				shown2 > 0, 'after + at scale ' + s2.toFixed(0) + ': ' + shown2 + ' labels drawn');
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 1).join(' | '));
	} finally {
		await a.close();
	}
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
		await sectionDrag(Session, browser);
		await sectionFit(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
