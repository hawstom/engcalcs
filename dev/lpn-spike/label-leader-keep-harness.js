// A LABEL THE USER DRAGGED STAYS EXACTLY WHERE HE PUT IT, AND ONLY A RESET HANDS IT BACK (Task 807).
// Run with:
//   node dev/lpn-spike/label-leader-keep-harness.js
//
// Tom, 2026-10-15: *"Placement rules: Let's try leaving exactly in place the leader locations set by
// the user. I think that our stretching them is frustrating to them. If they want to give us
// control, they will reset the leader."*
//
// **AGAINST THE REAL PAGE, IN A REAL CHROMIUM, ON THE GALLERY'S GEOGRAPHIC NET3.** A node label is
// dragged with the real mouse ON TOP OF its neighbour's label -- the crowded case, where the placer
// used to stretch the leader outward along its own line -- and then:
//   1. the drop: the leader ends where the user dropped it (stored offset, no nudge);
//   2. zoom in and out, nine wheel steps: the stored offset and the drawn leader end do not move;
//   3. Calculate: a fresh solve moves nothing;
//   4. reload: the autosave brings the same offset and the same end back;
//   5. a pipe label, if one is drawn, held to the same through zoom and a solve (its leader used to
//      start at a point that dodged the flow arrows, which moved with both);
//   6. double-click, the reset gesture: the offset is gone and the placer has the label again.
// Every position is read in DRAWING units (EngCalcs.lpnLabelProbe), which is what the user's
// offset is stored in -- never screen pixels.
//
// **RUN IT DIRECTLY -- DO NOT PREFIX IT WITH `flock`.** It locks /tmp/engcalcs-browser.lock itself
// by re-executing under flock; an outer flock would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_LEADER_KEEP_LOCKED';
const NAME = 'label-leader-keep-harness';

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

// Every drawn data label of one kind, by its rendered box. Hidden ones are not drawn.
function visibleLabels(page, attr) {
	return page.evaluate((attr) => Array.from(document.querySelectorAll('#lpn_canvas text[' + attr + ']'))
		.filter((e) => {
			if (!(e.textContent || '').trim()) { return false; }
			for (let p = e; p && p.id !== 'lpn_canvas'; p = p.parentNode) {
				const cs = getComputedStyle(p);
				if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { return false; }
			}
			const b = e.getBoundingClientRect();
			return b.width > 0 && b.right > 0 && b.bottom > 0 && b.left < innerWidth && b.top < innerHeight;
		})
		.filter((e) => e.getAttribute('data-repeat') === null)
		.map((e) => { const b = e.getBoundingClientRect(); return { id: e.getAttribute(attr), x: b.x, y: b.y, w: b.width, h: b.height }; }), attr);
}
// A point on the label that the map's own hit test gives to THIS label, not to a neighbour drawn
// over it -- the point a person would have to press. Null when no such point is visible.
function grabPoint(page, attr, id) {
	return page.evaluate(([attr, id]) => {
		const els = Array.from(document.querySelectorAll('#lpn_canvas [' + attr + '="' + id + '"]'));
		for (const e of els) {
			const r = e.getBoundingClientRect();
			for (let fy = 0.5; fy > 0; fy -= 0.15) {
				for (let fx = 0.1; fx < 1; fx += 0.1) {
					for (const yy of [r.top + r.height * fy, r.top + r.height * (1 - fy)]) {
						const x = r.left + r.width * fx, h = document.elementFromPoint(x, yy);
						if (h && h.getAttribute && h.getAttribute(attr) === id) { return { x, y: yy }; }
					}
				}
			}
		}
		return null;
	}, [attr, id]);
}
// Do two drawn labels' lettering overlap on screen? A hidden one overlaps nothing.
function lettersOverlap(page, attr, a, b) {
	return page.evaluate(([attr, a, b]) => {
		const box = (id) => {
			const e = document.querySelector('#lpn_canvas text[' + attr + '="' + id + '"]');
			if (!e || getComputedStyle(e).visibility === 'hidden') { return null; }
			return e.getBoundingClientRect();
		};
		const p = box(a), q = box(b);
		if (!p || !q) { return false; }
		return Math.min(p.right, q.right) - Math.max(p.left, q.left) > 1 && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > 1;
	}, [attr, a, b]);
}
// The drawn node labels whose lettering overlaps this one's.
function overlappers(page, id) {
	return page.evaluate((id) => {
		const vis = (e) => { for (let p = e; p && p.id !== 'lpn_canvas'; p = p.parentNode) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden') { return false; } } return true; };
		const me = document.querySelector('#lpn_canvas text[data-nodelbl="' + id + '"]');
		if (!me || !vis(me)) { return []; }
		const p = me.getBoundingClientRect();
		return Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((e) => {
			if (e === me || !(e.textContent || '').trim() || !vis(e)) { return false; }
			const q = e.getBoundingClientRect();
			return Math.min(p.right, q.right) - Math.max(p.left, q.left) > 1 && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > 1;
		}).map((e) => e.getAttribute('data-nodelbl'));
	}, id);
}
async function nobodyOnIt(page, tag, id) {
	const o = await overlappers(page, id);
	ok(tag + ': no other node label is drawn over it', o.length === 0, o.join(', '));
}
function probe(page, kind, id) {
	return page.evaluate(([k, i]) => EngCalcs.lpnLabelProbe(k, i), [kind, id]);
}
function canvasBox(page) {
	return page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
}
async function drag(page, from, dx, dy, steps) {
	await page.mouse.move(from.x, from.y);
	await page.mouse.down();
	for (let k = 1; k <= steps; k++) {
		await page.mouse.move(from.x + dx * k / steps, from.y + dy * k / steps);
		await page.waitForTimeout(15);
	}
	await page.mouse.up();
}
async function open(Session, browser) {
	const a = await Session.open(browser, NAME);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	return a;
}
const same = (p, q, tol) => Math.abs(p - q) <= tol;
function fmt(p) { return p ? '(' + p.x.toFixed(4) + ', ' + p.y.toFixed(4) + ')' : 'none'; }

// The label, as drawn, is the user's: its offset unchanged, its end at anchor + offset with no
// nudge, and the leader drawn to that end. `tol` is in drawing units.
function heldExactly(tag, kind, p, ref, tol) {
	const off = p && p.lx === ref.lx && p.ly === ref.ly;
	const endOk = p && same(p.end.x, ref.end.x, tol) && same(p.end.y, ref.end.y, tol);
	const noNudge = p && (!p.nudge || (p.nudge.x === 0 && p.nudge.y === 0));
	const leadOk = p && p.leader && same(p.leader.x2, p.end.x, 1e-9) && same(p.leader.y2, p.end.y, 1e-9);
	ok(tag + ': the stored offset is unchanged', off, p ? JSON.stringify([p.lx, p.ly]) + ' vs ' + JSON.stringify([ref.lx, ref.ly]) : 'no label');
	ok(tag + ': the leader ends where the user put it, with no stretch', endOk && noNudge && leadOk,
		p ? 'end ' + fmt(p.end) + ' vs ' + fmt(ref.end) + ', nudge ' + JSON.stringify(p.nudge) +
			', leader end ' + (p.leader ? fmt({ x: p.leader.x2, y: p.leader.y2 }) : 'not drawn') : 'no label');
	ok(tag + ': and it is not hidden', p && !p.hidden);
}

async function wheel(a, at, notches, dir) {
	await a.page.mouse.move(at.x, at.y);
	for (let i = 0; i < notches; i++) { await a.page.mouse.wheel(0, dir * 240); await a.settle(40); }
	await a.settle(700);
}
// The real Calculate button, or -- Recalculate being on, which hides it -- the same call its menu
// row makes. Done when the page holds a NEW result object.
async function calculate(a) {
	const P = a.page;
	await P.evaluate(() => { window.__k807Prev = EngCalcs.lpnSolveProbe(); });
	const run = P.locator('#lpn_toolbar_run button[data-icon="run"]:visible');
	const clicked = !!(await run.count());
	if (clicked) { await run.first().click(); } else { await P.evaluate(() => EngCalcs.lpnTimeRunNow()); }
	let fresh = false;
	try {
		await a.waitFor(() => P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__k807Prev); }), 'a solve', 60000);
		fresh = true;
	} catch (e) { /* reported by the caller */ }
	await a.settle(1000);
	return { clicked, fresh };
}

// A label to drag and the neighbour to drop it on: the pair of drawn labels nearest each other,
// away from the window's edges, so the drop is into a crowd.
function pickPair(labs, c) {
	const inner = labs.filter((l) => l.x > c.x + 120 && l.x + l.w < c.x + c.w - 120 && l.y > c.y + 120 && l.y + l.h < c.y + c.h - 120);
	let best = null;
	for (const p of inner) {
		for (const q of inner) {
			if (p === q) { continue; }
			const d = Math.hypot(p.x - q.x, p.y - q.y);
			if (d > 40 && (!best || d < best.d)) { best = { d, L: p, M: q }; }
		}
	}
	return best;
}

async function run(Session, browser) {
	const a = await open(Session, browser);
	try {
		const page = a.page, c = await canvasBox(page), mid = { x: c.x + c.w / 2, y: c.y + c.h / 2 };
		await wheel(a, mid, 8, -1);
		const labs = await visibleLabels(page, 'data-nodelbl');
		ok('node labels are drawn at the zoom the drag starts from', labs.length > 10, labs.length + ' drawn');
		const pair = pickPair(labs, c);
		ok('two neighbouring labels to drag one onto', !!pair);
		if (!pair) { return; }
		const L = pair.L, M = pair.M;

		console.log('\n--- 1. the drop: label ' + L.id + ' dragged on top of label ' + M.id + ' ---');
		const before = await probe(page, 'node', L.id);
		ok('label ' + L.id + ' starts automatic (no stored offset)', before && before.lx === undefined);
		const from = await grabPoint(page, 'data-nodelbl', L.id);
		ok('label ' + L.id + ' can be grabbed', !!from);
		await drag(page, from, M.x - L.x, M.y - L.y, 30);
		await a.settle(1200);
		const ref = await probe(page, 'node', L.id);
		ok('the drag stored an offset in drawing units', ref && typeof ref.lx === 'number' && typeof ref.ly === 'number',
			ref ? JSON.stringify([ref.lx, ref.ly]) : '');
		ok('the end is the node plus that offset, exactly',
			ref && same(ref.end.x, ref.anchor.x + ref.lx, 1e-9) && same(ref.end.y, ref.anchor.y + ref.ly, 1e-9),
			ref ? fmt(ref.end) + ' = ' + fmt(ref.anchor) + ' + offset' : '');
		heldExactly('after the drop', 'node', ref, ref, 1e-9);
		ok('label ' + M.id + ', which it was dropped on, moved out of its way', !(await lettersOverlap(page, 'data-nodelbl', L.id, M.id)));
		await nobodyOnIt(page, 'after the drop', L.id);

		console.log('\n--- 2. zoom in and out ---');
		const tol = Math.hypot(ref.lx, ref.ly) * 1e-9;
		await wheel(a, mid, 3, -1);
		heldExactly('zoomed in 3 steps', 'node', await probe(page, 'node', L.id), ref, tol);
		await nobodyOnIt(page, 'zoomed in 3 steps', L.id);
		await wheel(a, mid, 6, 1);
		heldExactly('zoomed out 6 steps', 'node', await probe(page, 'node', L.id), ref, tol);
		await nobodyOnIt(page, 'zoomed out 6 steps', L.id);
		await wheel(a, mid, 3, -1);
		heldExactly('zoomed back in 3 steps', 'node', await probe(page, 'node', L.id), ref, tol);
		await nobodyOnIt(page, 'zoomed back in 3 steps', L.id);

		console.log('\n--- 3. Calculate ---');
		const calc = await calculate(a);
		ok('a fresh solve ran', calc.fresh, calc.clicked ? 'Calculate clicked' : 'Recalculate is on; Calculate run from its menu call');
		heldExactly('after Calculate', 'node', await probe(page, 'node', L.id), ref, tol);

		console.log('\n--- 4. reload ---');
		await a.settle(1500);   // the autosave is debounced behind the solve
		await page.reload();
		await a.settle(2500);
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await nobodyOnIt(page, 'after reload, at the fitted view', L.id);
		const back = await probe(page, 'node', L.id);
		ok('the project came back from the autosave', !!back);
		if (back) {
			// The offset comes back through the file's Cartesian Y and the node through longitude
			// and latitude, so allow the last few bits; anything a reader could see is far larger.
			ok('after reload: the stored offset is the same', same(back.lx, ref.lx, tol) && same(back.ly, ref.ly, tol),
				JSON.stringify([back.lx, back.ly]) + ' vs ' + JSON.stringify([ref.lx, ref.ly]));
			const t2 = Math.hypot(ref.lx, ref.ly) * 1e-6;
			ok('after reload: the end is where it was, with no stretch',
				same(back.end.x, ref.end.x, t2) && same(back.end.y, ref.end.y, t2) &&
				(!back.nudge || (back.nudge.x === 0 && back.nudge.y === 0)), fmt(back.end) + ' vs ' + fmt(ref.end));
		}

		console.log('\n--- 5. a pipe label ---');
		await wheel(a, mid, 8, -1);
		const links = await visibleLabels(page, 'data-linklbl');
		const K = links.filter((l) => l.x > c.x + 150 && l.x + l.w < c.x + c.w - 150 && l.y > c.y + 150 && l.y + l.h < c.y + c.h - 150)[0];
		const kAt = K ? await grabPoint(page, 'data-linklbl', K.id) : null;
		if (!K || !kAt) {
			console.log('  ..   no pipe label drawn on this view; section skipped');
		} else {
			await drag(page, kAt, 70, -60, 20);
			await a.settle(1200);
			const kref = await probe(page, 'link', K.id);
			ok('pipe ' + K.id + ': the drag stored an offset', kref && typeof kref.lx === 'number');
			if (kref && typeof kref.lx === 'number') {
				const kt = Math.hypot(kref.lx, kref.ly) * 1e-9;
				heldExactly('pipe ' + K.id + ' after the drop', 'link', kref, kref, kt);
				await wheel(a, mid, 4, 1);
				heldExactly('pipe ' + K.id + ' zoomed out 4 steps', 'link', await probe(page, 'link', K.id), kref, kt);
				await wheel(a, mid, 4, -1);
				ok('pipe ' + K.id + ': a fresh solve ran', (await calculate(a)).fresh);
				heldExactly('pipe ' + K.id + ' zoomed back and recalculated', 'link', await probe(page, 'link', K.id), kref, kt);
			}
		}

		console.log('\n--- 6. double-click resets it ---');
		const now = await grabPoint(page, 'data-nodelbl', L.id);
		ok('the dragged label is still drawn, so it can be double-clicked', !!now);
		if (now) {
			await page.mouse.dblclick(now.x, now.y);
			await a.settle(1200);
			const reset = await probe(page, 'node', L.id);
			ok('the stored offset is gone', reset && reset.lx === undefined && reset.ly === undefined,
				reset ? JSON.stringify([reset.lx, reset.ly]) : '');
			const dragged = Math.hypot(ref.end.x - ref.anchor.x, ref.end.y - ref.anchor.y),
				home = reset ? Math.hypot(reset.end.x - reset.anchor.x, reset.end.y - reset.anchor.y) : Infinity;
			ok('the placer has it again: the label left the dragged spot', reset &&
				Math.hypot(reset.end.x - back.end.x, reset.end.y - back.end.y) > dragged * 0.2,
				'end ' + fmt(reset && reset.end) + ', ' + home.toFixed(4) + ' from its node (dragged: ' + dragged.toFixed(4) + ')');
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
		await run(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
