// §39 — WHY THE CURSOR FLICKERS TO THE DEFAULT ARROW NEAR A NODE (ROADMAP Task 569).
//
// Tom, 2026-09-01: *"As I wander the mouse around the map, it occasionally flickers from pan/drag
// cross to default pointer. If I am painstakingly slow and precise, I can return the mouse to any
// such flicker point and see it dwell as a default pointer. There is nothing at these points
// apparent to me that explains the default pointer except that it almost (!) reliably happens at
// 12px from the point of a node (the 24px diameter)."* Long-recognized, never diagnosed; he rates
// it *"slightly mystifying and annoying"* rather than harmful.
//
// **THIS SPEC DIAGNOSES RATHER THAN ASSERTS, and that is deliberate.** Nobody knows the cause yet,
// so a pass/fail on a guess would be a guess with a green tick on it. What it does is walk outward
// from a node one pixel at a time and record, at every step, the element the browser actually hit
// and the cursor that element actually computes to. The output is the evidence Task 569 has never
// had; the one thing it DOES assert is the property Tom's complaint reduces to.
//
// **THE PROPERTY, stated so it can be wrong:** every element the pointer can land on over the map
// should compute a cursor that MEANS something -- `pointer` on a thing you can open, `move` on a
// thing you can drag, `crosshair` in a drawing mode -- or be the bare canvas. A ring of `default`
// at a fixed radius, surrounded by non-default on both sides, is the signature of an element that
// captures the pointer and carries no cursor rule of its own, inheriting `default` from
// `#lpn_canvas`. That sandwich is what this looks for and what would name the culprit.
//
// **TWO HYPOTHESES ARE ALREADY RULED OUT BY READING, so do not re-derive them:**
//   * `.lpn-node-symbol-backdrop` -- the occlusion patch behind a reservoir/tank symbol. It carries
//     no `pointer-events` and no `cursor` rule, which is exactly the shape to suspect, but
//     `pointer-events` is an INHERITED property and its parent `.lpn-node-symbol` sets `none`, so
//     the backdrop never answers a hit test at all.
//   * The touch and pointer reach constants. `POINTER_REACH_PX` is 14 and `TOUCH_REACH_PX` is 24
//     (closed Task 562), and neither is 12 -- and neither draws anything: they are used by
//     `nearestNodeNearScreen()` AFTER a hit, not by the browser's own hit test.
//
// `cursor: move` is the four-headed arrow, which is what "pan/drag cross" names: on this map it
// comes from `.lpn-draglbl` (a label you can drag) and `.lpn-vhandle` (a pipe's bend). So the
// flicker is most likely a boundary of a LABEL's box rather than anything belonging to the node --
// which the radial walk below will show as a `move` run ending at a fixed radius.

'use strict';

const { Session } = require('../lib/session');

async function canvasRect(a) {
	return await a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height };
	});
}
// One junction in the middle of the canvas, its label left where the placement pass puts it.
// **Driven through the toolbar the way geohit.js does it, not through an id**: the buttons carry no
// ids, so a selector-based click silently does nothing and the spec then measures an empty map.
async function oneJunction(a) {
	const r = await canvasRect(a);
	await a.toolbarClick('Junction');
	await a.page.mouse.click(r.x + r.w / 2, r.y + r.h / 2);
	await a.settle(500);
	await a.toolbarClick('Select');
	await a.settle(250);
	if (await a.nodeCount() < 1) { throw new Error('the junction did not land'); }
	return r;
}

// Where the node ended up, in client pixels.
async function nodeSpot(a) {
	return await a.page.evaluate(() => {
		const n = document.querySelector('.lpn-node');
		if (!n) { return null; }
		const r = n.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2, r: Math.max(r.width, r.height) / 2 };
	});
}

/**
 * Walk out from the node along one bearing, and at every pixel record what the browser hits and
 * what cursor that element computes to. `elementFromPoint` is the same hit test the cursor itself
 * is resolved from, which is why this can answer the question at all.
 */
async function walk(a, at, dx, dy, upto) {
	return await a.page.evaluate(([at, dx, dy, upto]) => {
		const out = [];
		for (let d = 0; d <= upto; d++) {
			const x = at.x + dx * d, y = at.y + dy * d;
			const el = document.elementFromPoint(x, y);
			if (!el) { out.push({ d: d, tag: null, cls: '', cursor: '(none)' }); continue; }
			out.push({
				d: d,
				tag: el.tagName,
				cls: (el.getAttribute && el.getAttribute('class')) || '',
				id: el.id || '',
				cursor: getComputedStyle(el).cursor
			});
		}
		return out;
	}, [at, dx, dy, upto]);
}

// A run of equal cursors, so 40 pixels print as three lines rather than forty.
function runs(steps) {
	const out = [];
	steps.forEach(function (s) {
		const last = out[out.length - 1];
		if (last && last.cursor === s.cursor && last.cls === s.cls) { last.to = s.d; return; }
		out.push({ from: s.d, to: s.d, cursor: s.cursor, cls: s.cls, tag: s.tag, id: s.id });
	});
	return out;
}
function show(r) {
	return `${r.from}-${r.to}px ${r.cursor} <${(r.tag || '?').toLowerCase()}${r.id ? ' #' + r.id : ''}${r.cls ? ' .' + r.cls.split(/\s+/).join('.') : ''}>`;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await answerIfAsked(a);
		await a.dismissGallery();
		await a.newProject();
		await a.settle(600);
		await oneJunction(a);

		const n = await nodeSpot(a);
		report.ok(!!n, 'a junction is on the map to walk away from',
			n ? `at ${Math.round(n.x)},${Math.round(n.y)} r=${n.r.toFixed(1)}px` : 'none');
		if (!n) { return; }

		// Eight bearings, 40 px out. Tom's flicker is at 12; 40 is well past any label box.
		const dirs = [[1, 0, 'E'], [0, 1, 'S'], [-1, 0, 'W'], [0, -1, 'N'],
			[0.7071, 0.7071, 'SE'], [-0.7071, 0.7071, 'SW'],
			[0.7071, -0.7071, 'NE'], [-0.7071, -0.7071, 'NW']];
		const sandwiches = [];
		for (const [dx, dy, name] of dirs) {
			const r = runs(await walk(a, n, dx, dy, 40));
			console.log(`      ${name}: ` + r.map(show).join(' | '));
			// **THE SIGNATURE**: a `default` run with a non-default, non-canvas run on BOTH sides.
			// A default run that simply continues to the edge is the bare map and is correct.
			for (let i = 1; i < r.length - 1; i++) {
				if (r[i].cursor !== 'default') { continue; }
				const before = r[i - 1], after = r[i + 1];
				if (before.cursor !== 'default' && after.cursor !== 'default') {
					sandwiches.push(`${name} ${show(r[i])} between ${before.cursor} and ${after.cursor}`);
				}
			}
		}
		// **NOW A VERDICT, because the fix landed** (Tom, 2026-09-06: *"Try a Pan cursor."*). This
		// line reported rather than asserted while `#lpn_canvas` was `cursor: default` and the fix
		// was a pending decision -- a spec that can never go green makes `node run.js` exit 1 for
		// ever, and this suite's README promises that exit 0 means every check passed. The canvas
		// now says `grab`, so a band of `default` between two meaningful cursors would be a
		// REGRESSION rather than a known state, and that is exactly what an assertion is for.
		report.ok(sandwiches.length === 0,
			'no band of default cursor is sandwiched between two meaningful ones',
			sandwiches.length ? sandwiches.join(' ;; ') : 'none on eight bearings');
		// **AND THE HAND IS OPEN ON THE BARE MAP.** Asserted separately from the sandwich test
		// because they can fail for different reasons: the test above would still pass if the
		// canvas were given some other non-default cursor, and `grab` is the specific promise.
		const bare = await a.page.evaluate(() => {
			const c = document.getElementById('lpn_canvas');
			return c ? getComputedStyle(c).cursor : '(no canvas)';
		});
		report.eq(bare, 'grab', 'the bare map offers the open hand, so it reads as pannable');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};

// The consent banner, if this profile has not answered it yet.
async function answerIfAsked(a) {
	try {
		const btn = await a.page.$('.ec-consent-btn');
		if (btn) { await btn.click(); await a.settle(200); }
	} catch (e) { /* no banner is the ordinary case */ }
}
