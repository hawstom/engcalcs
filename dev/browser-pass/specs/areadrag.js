// §42 — a select-area ring never outlives the gesture that drew it (MJH, 2026-09-09).
//
// **THE REPORT.** Tom, 2026-09-09, relaying his son MJH, a civil engineering designer using the
// map: *"His LibreWolf browser won't select area. Area select broke the project."*
//
// **IT IS NOT A BROWSER DIFFERENCE, AND THAT WAS THE FIRST THING MEASURED.** Playwright's Firefox
// 153 is the engine LibreWolf is, and the whole gesture matrix — window, lasso and polygon, plain
// and with LibreWolf's own hardening (`privacy.resistFingerprinting`, letterboxing, strict tracking
// protection, `cookieBehavior 5`) — behaves in Gecko exactly as it behaves in Blink, before the fix
// and after it. What was found instead were two engine-independent ways to leave a ring OPEN after
// the gesture that drew it was over, both of which read to a user as *"won't select area"*:
//
//   1. **A press-drag-release.** Click-and-rubber-band (Tom, 2026-09-07) gave the release no
//      meaning at all, so a press, a drag and a lift — the marquee gesture of every other drawing
//      program — drew a rectangle and then did nothing with it.
//   2. **A closing click that lands on the instruction bubble.** It opens CENTRED on the map with
//      `pointer-events: auto`, because makePanelDraggable() needs the press. Measured in Gecko at
//      1440x900: 242 x 93 px over a 1438 x 499 map, 3.1% of it, all of it the middle — which is
//      where a network is drawn and where a marquee is closed.
//
// **AND THEN THE SECOND HALF OF THE REPORT.** In both cases the ring goes on following the pointer
// with the gesture long over, and the user's NEXT ordinary click anywhere on the map commits it: a
// rectangle from a corner they had given up on to wherever they just clicked. Measured here before
// the fix: four junctions selected that the user never framed, with the multi-element property
// editor opened over them. No document was written — a selection is not an edit — but a keystroke
// into that box, or the Delete key, would have gone to all of them.
//
// This spec drives the real page in Chromium, which is what this runner has; the Gecko half of the
// reproduction is in the harness note above and in dev/lpn-spike/select-area-harness.js §20.

const { Session } = require('../lib/session');

exports.title = '42. A select-area ring never outlives its gesture';

// A fresh profile per run: a Session profile persists between runs, and one that has already waved
// the examples gallery away never opens it again.
async function mapWithNodes(browser, name) {
	const a = await Session.open(browser, name);
	await a.goto();
	await a.dismissGallery();
	await a.answerTrainingPanel('MJH').catch(() => {});
	await a.newProject('us');
	await a.toolbarClick('Junction');
	const r = await a.page.evaluate(() => {
		const c = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: c.x, y: c.y, w: c.width, h: c.height };
	});
	a.P = (fx, fy) => ({ x: Math.round(r.x + r.w * fx), y: Math.round(r.y + r.h * fy) });
	// **THE UPPER-LEFT QUADRANT, AND THAT IS NOT AN AESTHETIC CHOICE.** The instruction bubble
	// opens centred on the map, so a point near the middle lands on the panel rather than on the
	// canvas — which is defect 2 above, and would silently make every gesture below a check of it
	// instead of of what it says it checks.
	for (const p of [a.P(0.10, 0.15), a.P(0.18, 0.15), a.P(0.18, 0.28)]) {
		await a.page.mouse.click(p.x, p.y);
		await a.settle(200);
	}
	// Far away, so a ring that ran away has something to catch that a correct one never would.
	const far = a.P(0.85, 0.80);
	await a.page.mouse.click(far.x, far.y);
	await a.settle(200);
	await a.toolbarClick('Select');
	await a.settle(200);
	return a;
}

// The area tool, cycled to the wanted shape. The toolbar button is one slot holding three modes, so
// "which shape" and "is the mode on" are two different questions and both have to be asked.
async function areaTool(a, shape) {
	for (let i = 0; i < 5; i++) {
		const st = await a.page.evaluate(() => {
			const b = document.querySelector('#lpn_toolbar button[data-tool="select-area"]');
			return b ? { shape: b.dataset.shape, on: b.getAttribute('aria-pressed') === 'true',
				label: (b.getAttribute('aria-label') || '').trim() } : null;
		});
		if (!st) { throw new Error('no select-area button on the toolbar'); }
		if (st.on && st.shape === shape) { return; }
		await a.toolbarClick(st.label);
		await a.settle(200);
	}
	throw new Error(`could not reach select-area shape "${shape}"`);
}

// What the map is showing about the ring and the subject. The marquee is a live SVG polygon, so
// "still drawing" is a fact about the page rather than about our own bookkeeping.
async function state(a) {
	return a.page.evaluate(() => {
		const m = document.querySelector('.lpn-marquee');
		const pop = document.getElementById('lpn_popup');
		const hint = document.getElementById('lpn_area_hint');
		return {
			drawing: !!(m && m.style.display !== 'none'),
			selected: document.querySelectorAll('#lpn_canvas .lpn-selected').length,
			popup: !!(pop && pop.style.display !== 'none'),
			hintTakesPresses: hint && hint.style.display !== 'none'
				? getComputedStyle(hint).pointerEvents !== 'none' : null
		};
	});
}

async function clearAll(a) {
	await a.toolbarClick('Select');
	await a.settle(150);
	await a.page.evaluate(() => {
		const p = document.getElementById('lpn_popup');
		if (p) { p.style.display = 'none'; }
	});
	const p = a.P(0.55, 0.15);
	await a.page.mouse.click(p.x, p.y);
	await a.settle(200);
}

exports.run = async function ({ browser, report }) {
	const a = await mapWithNodes(browser, 'areadrag-' + Date.now());
	try {
		// ---- press, drag, release ------------------------------------------------------------
		await clearAll(a);
		await areaTool(a, 'window');
		const A = a.P(0.05, 0.08), B = a.P(0.25, 0.36);
		await a.page.mouse.move(A.x, A.y);
		await a.page.mouse.down();
		await a.page.mouse.move(B.x, B.y, { steps: 8 });
		const mid = await state(a);
		report.ok(mid.drawing, 'a press and a drag draw a marquee');
		await a.page.mouse.up();
		await a.settle(500);
		let s = await state(a);
		report.ok(!s.drawing, 'and the RELEASE ends it, rather than leaving it following the pointer');
		report.eq(s.selected, 3, 'it selected exactly the three junctions it framed');
		report.ok(s.popup, 'and the properties box opened on them');

		// **THE RUNAWAY, WHICH IS THE HALF THAT COULD DAMAGE A DOCUMENT.** The user believes the
		// gesture is over, moves the mouse away and clicks something on the other side of the map.
		const away = a.P(0.6, 0.5);
		await a.page.mouse.move(away.x, away.y, { steps: 6 });
		await a.settle(200);
		s = await state(a);
		report.ok(!s.drawing, 'a mouse move after the gesture draws nothing');
		report.eq(s.selected, 3, '...and the subject is still the three that were framed');

		// ---- the bubble must not swallow the click that closes a ring -------------------------
		await clearAll(a);
		await areaTool(a, 'window');
		let h = await state(a);
		report.ok(h.hintTakesPresses === true,
			'with no ring open the instruction bubble takes presses, so it can be dragged aside');
		const corner = a.P(0.08, 0.12);
		await a.page.mouse.move(corner.x, corner.y);
		await a.page.mouse.down();
		await a.page.mouse.up();
		await a.settle(250);
		h = await state(a);
		report.ok(h.drawing, 'one click opens a ring');
		report.ok(h.hintTakesPresses === false,
			'...and while it is open the bubble stops taking presses');
		// **CLOSE IT ON THE BUBBLE ITSELF, ASKED OF THE BUBBLE.** The panel opens centred on the map
		// and is then clamped to the window, so "the centre of the canvas" is where it sits at some
		// window sizes and not at others — and a probe that missed it would make every line below a
		// check of nothing, in a spec whose whole subject is a click that was eaten. So the point
		// comes from the panel's own box, and the spec REFUSES to assert if the panel is not what
		// answers there.
		const centre = await a.page.evaluate(() => {
			const h = document.getElementById('lpn_area_hint').getBoundingClientRect();
			const c = document.getElementById('lpn_canvas').getBoundingClientRect();
			const x = Math.round(h.x + h.width / 2), y = Math.round(h.y + h.height / 2);
			const el = document.elementFromPoint(x, y);
			return { x, y, over: el ? (el.id || el.tagName) : '(nothing)',
				// GEOMETRY, never the hit test: with the repair in place the panel is inert while
				// a ring is open, so asking what answers here would report the canvas and prove
				// nothing about where the panel is.
				overMap: h.x >= c.x && h.right <= c.right && h.y >= c.y && h.bottom <= c.bottom };
		});
		report.ok(centre.overMap,
			'the bubble really is lying over the map, so this is the click that used to be eaten',
			`the point answers ${centre.over}`);
		await a.page.mouse.move(centre.x, centre.y, { steps: 4 });
		await a.page.mouse.down();
		await a.page.mouse.up();
		await a.settle(500);
		s = await state(a);
		report.ok(!s.drawing, 'a closing click on the bubble reaches the map and finishes the ring');
		report.ok(s.hintTakesPresses === true, '...and the bubble is draggable again');

		// ---- click-and-rubber-band is untouched (Tom, 2026-09-07) ------------------------------
		await clearAll(a);
		await areaTool(a, 'window');
		await a.page.mouse.move(A.x, A.y);
		await a.page.mouse.down();
		await a.page.mouse.up();
		await a.settle(250);
		report.ok((await state(a)).drawing, 'a click with no travel still opens a ring');
		await a.page.mouse.move(B.x, B.y, { steps: 4 });
		await a.settle(150);
		await a.page.mouse.down();
		await a.page.mouse.up();
		await a.settle(500);
		s = await state(a);
		report.ok(!s.drawing, '...and the second click finishes it');
		report.eq(s.selected, 3, '...on the same three');

		// ---- the lasso, whose press-drag-release is the same rule -----------------------------
		await clearAll(a);
		await areaTool(a, 'lasso');
		await a.page.mouse.move(A.x, A.y);
		await a.page.mouse.down();
		for (const p of [a.P(0.28, 0.05), a.P(0.30, 0.40), a.P(0.03, 0.36)]) {
			await a.page.mouse.move(p.x, p.y, { steps: 5 });
		}
		await a.page.mouse.up();
		await a.settle(500);
		s = await state(a);
		report.ok(!s.drawing, 'a traced lasso ends on the lift too');
		report.eq(s.selected, 3, '...and catches what it enclosed');

		// ---- the polygon keeps its clicks and its double-click ending --------------------------
		await clearAll(a);
		await areaTool(a, 'polygon');
		for (const p of [A, a.P(0.28, 0.05), a.P(0.30, 0.40)]) {
			await a.page.mouse.move(p.x, p.y);
			await a.page.mouse.down();
			await a.page.mouse.up();
			await a.settle(150);
		}
		report.ok((await state(a)).drawing, 'a polygon ring is still open after three clicks');
		const last = a.P(0.03, 0.36);
		await a.page.mouse.move(last.x, last.y);
		await a.page.mouse.dblclick(last.x, last.y);
		await a.settle(500);
		s = await state(a);
		report.ok(!s.drawing, '...and a double-click closes it');
		report.eq(s.selected, 3, '...on the three it enclosed');

		report.eq(a.errors.length, 0, 'no uncaught page errors anywhere in the pass');
	} finally {
		await a.close();
	}
};
