// A DRAGGED LABEL STAYS UNDER THE POINTER, WHATEVER IT IS AND WHEREVER IT STARTS.
// Run with:
//   node dev/lpn-spike/label-drag-track-harness.js
//
// Tom, 2026-10-12, on production with R-264 already in it: *"I noticed on production the old bug of
// the label jumping out twice as far as my mouse cursor while dragging a label."*
//
// R-264 (label-drag-fit-harness.js) pinned one node label of the geographic Net3 at one zoom. This
// drags a node label and a pipe label, three times each in alternating directions, in three
// networks (geographic Net3, plain Net3, the small basic example), at two zooms and two device
// pixel ratios, with the real mouse in a real Chromium, and asks at every step whether the pointer
// is still on the label's box. Two causes it caught:
//   1. THE FLIP. A data label hangs off its leader's end on the side the flip rule picks; dragging
//      only the end moved the whole box by its own width the moment the end crossed the anchor's
//      line, leaving the pointer a grab-distance outside it (heldLabelEnd()).
//   2. THE ALIGNED PIPE LABEL. Grabbed lying along its pipe, its first drag frame re-laid it out
//      left-anchored at the default offset, a box width or more away (the linklbl pointerdown).
// A label whose box straddles the anchor's line lags the pointer by up to a quarter of its width
// by design of the flip rule, so "on the label" is within 8 px, not 0.
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
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_DRAG_TRACK_LOCKED';
const NAME = 'label-drag-track-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '1700', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 1700 s. Lock contention, not a failure of what this measures; re-run it alone.');
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

function canvasBox(page) {
	return page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
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

function canvasBox(page) {
	return page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
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

function scaleOf(page) {
	return page.evaluate(() => {
		const m = /scale\(([^)]+)\)/.exec(document.querySelector('#lpn_canvas g').getAttribute('transform') || '');
		return m ? +m[1] : null;
	});
}
function canvasBox(page) {
	return page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
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


function drawn(page, attr) {
	return page.evaluate((at) => Array.from(document.querySelectorAll('#lpn_canvas text[' + at + ']'))
		.filter((e) => {
			if (!(e.textContent || '').trim()) { return false; }
			for (let p = e; p && p.id !== 'lpn_canvas'; p = p.parentNode) {
				const cs = getComputedStyle(p);
				if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { return false; }
			}
			return true;
		})
		.map((e) => { const b = e.getBoundingClientRect(); return { id: e.getAttribute(at), x: b.x, y: b.y, w: b.width, h: b.height }; })
		// Only what is on screen, clear of the toolbar and edges, can be picked up.
		.filter((b) => {
			const h = document.elementFromPoint(b.x + b.w / 2, b.y + b.h / 2);
			return !!h && h.getAttribute && h.getAttribute(at) === b.id;
		}), attr);
}
// The drawn box of label `id` nearest the point (px, py): a long pipe repeats its label, so more
// than one element carries the id until the first one is picked up and the rest go away.
function boxOf(page, attr, id, px, py) {
	return page.evaluate(([at, i, x, y]) => {
		let best = null, bd = Infinity;
		for (const e of document.querySelectorAll('#lpn_canvas text[' + at + '="' + i + '"]')) {
			if (!(e.textContent || '').trim()) { continue; }
			const r = e.getBoundingClientRect();
			if (!r.width) { continue; }
			const d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
			if (d < bd) { bd = d; best = { l: r.left, t: r.top, r: r.right, b: r.bottom }; }
		}
		return best;
	}, [attr, id, px, py]);
}

// Drags one label of `kind` ('node'|'link') `passes` times and returns the worst DRIFT: how far the
// label's box has moved from where it would be if it rode exactly with the cursor (the box at grab
// time, translated by the cursor's travel). Measured on the box's nearer edge so the text's flip
// about its leader end does not count; a doubled move shows as a drift as large as the travel.
async function dragCase(a, kind, passes, dx, dy) {
	const page = a.page, attr = kind === 'node' ? 'data-nodelbl' : 'data-linklbl', ds = kind === 'node' ? 'nodelbl' : 'linklbl';
	let labs = await drawn(page, attr);
	if (labs.length < 3) { return { n: labs.length }; }
	const mx = 640, my = 400;
	labs.sort((p, q) => Math.hypot(p.x - mx, p.y - my) - Math.hypot(q.x - mx, q.y - my));
	const L0 = labs[0];
	let worst = 0, at = 0, moved = Infinity, cur = { x: L0.x + L0.w / 2, y: L0.y + L0.h / 2 }, id = L0.id;
	for (let pass = 0; pass < passes; pass++) {
		// A label dragged over a neighbour is covered by it, so each pass takes up whichever label
		// is under the pointer: it is that one the reader would be holding.
		for (const f of [0.5, 0.15, 0.85]) {
			const bb = await boxOf(page, attr, id, cur.x, cur.y);
			if (!bb) { break; }
			const px = bb.l + (bb.r - bb.l) * f, py = (bb.t + bb.b) / 2;
			const hit = await page.evaluate(([x, y, k]) => { const e = document.elementFromPoint(x, y); return e && e.dataset ? e.dataset[k] : null; }, [px, py, ds]);
			if (hit === id) { cur = { x: px, y: py }; break; }
		}
		const under = await page.evaluate(([x, y, k]) => { const e = document.elementFromPoint(x, y); return e && e.dataset ? e.dataset[k] : null; }, [cur.x, cur.y, ds]);
		if (process.env.DBG) { console.log('   cur ' + cur.x.toFixed(0) + ',' + cur.y.toFixed(0) + ' id ' + id + ' under ' + under + ' el ' + await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + '.' + (e.getAttribute('class') || '') + '#' + e.id : 'null'; }, [cur.x, cur.y]) + ' labs ' + labs.length + ' L0 ' + JSON.stringify(L0)); }
		if (under === null || under === undefined) { return { n: labs.length, worst: 999, at: -1, id: id + ' (nothing under the pointer on pass ' + (pass + 1) + ')' }; }
		id = under;
		const sx = pass % 2 ? -dx : dx, sy = pass % 2 ? -dy : dy;
		const b0 = await boxOf(page, attr, id, cur.x, cur.y);
		await drag(page, cur, sx, sy, 40, async (k, cx, cy) => {
			const b = await boxOf(page, attr, id, cx, cy);
			const d = Math.hypot(Math.max(b.l - cx, 0, cx - b.r), Math.max(b.t - cy, 0, cy - b.b));
			if (process.env.DBG && (k % 5 === 0 || k <= 3)) { console.log('   k' + k + ' cur ' + cx.toFixed(0) + ',' + cy.toFixed(0) + ' box ' + b.l.toFixed(0) + '..' + b.r.toFixed(0) + ' ' + b.t.toFixed(0) + '..' + b.b.toFixed(0)); }
			if (d > worst) { worst = d; at = k; }
		});
		await a.settle(300);
		const b1 = await boxOf(page, attr, id, cur.x + sx, cur.y + sy);
		// The label must have gone with the pointer, not merely stayed under it by never moving.
		moved = Math.min(moved, Math.hypot((b1.l + b1.r) / 2 - (b0.l + b0.r) / 2, (b1.t + b1.b) / 2 - (b0.t + b0.b) / 2));
		cur = { x: (b1.l + b1.r) / 2, y: (b1.t + b1.b) / 2 };
	}
	return { n: labs.length, worst, at, id, moved };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	const browser = await chromium.launch({ executablePath });
	try {
		const ex = process.env.EX ? process.env.EX.split(',') : ['lpn_ex_net3_world_title', 'lpn_ex_net3_title', 'lpn_ex_basic_us_title'];
		for (const exKey of ex) for (const dpr of (process.env.DPR ? [+process.env.DPR] : [1, 2])) for (const zin of (process.env.ZIN ? [+process.env.ZIN] : [0, 4])) for (const kind of (process.env.KIND ? [process.env.KIND] : ['node', 'link'])) {
			const a = await Session.open(browser, NAME, { viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr });
			try {
				await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
				await a.goto('Looped-Network.php');
				await a.answerTrainingPanel().catch(() => {});
				await a.openExampleCard(await a.lang(exKey));
				await a.settle(1500);
				await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
				// Fit the drawing, then zoom in at its centre one notch at a time until this kind
				// of label is drawn on screen (Net3 labels late, its pipes later), then `zin` more.
				await zoomToFit(a);
				const attr = kind === 'node' ? 'data-nodelbl' : 'data-linklbl';
				const c = await canvasBox(a.page);
				await a.page.mouse.move(c.x + c.w / 2, c.y + c.h / 2);
				let notches = 0;
				while ((await drawn(a.page, attr)).length < 3 && notches < 60) {
					await a.page.mouse.wheel(0, -240); await a.settle(120); notches++;
				}
				for (let i = 0; i < zin; i++) { await a.page.mouse.wheel(0, -240); await a.settle(120); }
				await a.settle(600);
				const r = await dragCase(a, kind, 3, -120, 70);
				ok(exKey + ' dpr' + dpr + ' +' + zin + ' notches' + ' ' + kind + ' label tracks (3 drags)', r.n >= 3 && r.worst <= 8 && r.moved > 40,
					r.n < 3 ? 'only ' + r.n + ' labels drawn' : 'worst distance from pointer ' + r.worst.toFixed(1) + ' px at step ' + r.at + ', least pass travel ' + (r.moved || 0).toFixed(0) + ' px (' + r.id + ')');
			} finally { await a.close(); }
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
