// §39 — a label you cannot see is not a label you can grab, and a node that moved says so.
//
// Tom, 2026-09-01, after a phone pass, on two things neither of which is a phone item:
//   *"somehow a node label is present but not (yet?) visible, and when I go to pan, the label that
//   I did not see drags off the screen."*
//   *"we have no way of knowing when a junction moves. Some sort of a fading highlight like the
//   labels have when they are moved would help. And this doesn't apply only to the phone."*
//
// **WHY THIS IS A BROWSER SPEC AND NOT ONLY A HARNESS.** The fix is one CSS keyword.
// `.lpn-draglbl` carried `pointer-events: all`, and SVG's four visibility-ignoring values --
// `painted`, `fill`, `stroke`, `all` -- hit-test an element whatever its `visibility` says. Only a
// real engine can be asked whether that is still true; dev/lpn-spike/lpn-dom-stub.js has no
// stylesheet at all, so its half of the guard is the JS one (mapHitAt() reads `visibility` too) and
// a text lint of the rule. This is the other half, and it is the half where the defect lived.
//
// The hidden state is produced the way applyLabelVisibility() produces it -- the `.lpn-labels-hidden`
// class on the canvas, which is one line of the page's own code -- rather than through the menus
// that reach it (thematic colouring, the georeferencing wizard), so the spec is about the rule and
// not about a menu path that may be renamed next week.

const { Session } = require('../lib/session');

exports.title = '39. An invisible label cannot be grabbed; a moved node is marked';

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}
async function transform(a) {
	return a.page.evaluate(() => {
		const t = document.querySelector('#lpn_canvas > g').getAttribute('transform') || '';
		const m = t.match(/translate\(([-\d.e+]+),([-\d.e+]+)\)\s*scale\(([-\d.e+]+)\)/);
		return m ? { tx: +m[1], ty: +m[2] } : null;
	});
}
// The middle of the one node data label on screen, in page pixels, plus where its node is.
async function labelSpot(a) {
	return a.page.evaluate(() => {
		const t = document.querySelector('#lpn_canvas text[data-nodelbl]');
		if (!t) { return null; }
		const r = t.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
	});
}
// What elementsFromPoint() answers at a point — the exact question mapHitAt() asks, with the same
// tspan-to-<text> resolution mapHitAt() does through resolveLabelHit(). A label's glyphs live in
// <tspan> children, which carry none of the parent's data attributes, so without that step this
// helper reports "tspan" for the very thing it is asking about.
async function stackAt(a, p) {
	return a.page.evaluate(({ x, y }) => (document.elementsFromPoint(x, y) || [])
		.map(e => (e.nodeName.toLowerCase() === 'tspan' && e.parentNode) ? e.parentNode : e)
		.map(e => e.dataset && e.dataset.nodelbl !== undefined ? 'LABEL'
			: (e.dataset && e.dataset.node !== undefined ? 'NODE' : e.nodeName)), p);
}
// Where the label is PAINTED. Read off the drawing rather than out of the document: the page
// exports no internal for a label offset, and the x/y it is drawn at is the thing Tom watched slide
// off the screen. A pan does not change it — the whole map moves under one transform — so a change
// here after a pan gesture means the label itself was dragged.
async function labelOffset(a) {
	return a.page.evaluate(() => {
		const t = document.querySelector('#lpn_canvas text[data-nodelbl]');
		return t ? { x: +t.getAttribute('x'), y: +t.getAttribute('y') } : null;
	});
}
async function setLabelsHidden(a, on) {
	await a.page.evaluate((v) => {
		document.getElementById('lpn_canvas').classList.toggle('lpn-labels-hidden', v);
	}, on);
}
async function oneJunction(a) {
	const r = await canvasRect(a);
	await a.toolbarClick('Junction');
	await a.page.mouse.click(r.x + r.w * 0.4, r.y + r.h * 0.5);
	await a.settle(500);
	await a.toolbarClick('Select');
	await a.settle(250);
	if (await a.nodeCount() < 1) { throw new Error(`${a.name}: the junction did not land`); }
}
async function dragFrom(a, p, dx, dy) {
	await a.page.mouse.move(p.x, p.y);
	await a.page.mouse.down();
	await a.page.mouse.move(p.x + dx / 2, p.y + dy / 2, { steps: 4 });
	await a.page.mouse.move(p.x + dx, p.y + dy, { steps: 4 });
	await a.page.mouse.up();
	await a.settle(500);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.newProject();
		await a.settle(700);
		await oneJunction(a);

		// ---- 1. the label is there, painted, and grabbable ---------------------------------------
		const spot = await labelSpot(a);
		report.ok(!!spot && spot.w > 0, 'the junction draws a data label', spot && `${Math.round(spot.w)}x${Math.round(spot.h)} px`);
		const s0 = await stackAt(a, spot);
		report.ok(s0[0] === 'LABEL', 'a visible label is what the pointer finds', s0.slice(0, 3).join(' > '));

		const at0 = await labelOffset(a);
		await dragFrom(a, spot, 45, 30);
		const at1 = await labelOffset(a);
		report.ok(at0 && at1 && Math.abs(at1.x - at0.x) > 10,
			'dragging a visible label moves it, as it always did',
			at0 && at1 ? `moved ${(at1.x - at0.x).toFixed(1)} px` : 'no label');

		// ---- 2. hidden: the browser must not answer with it at all -------------------------------
		const spot2 = await labelSpot(a);
		await setLabelsHidden(a, true);
		await a.settle(200);
		const s1 = await stackAt(a, spot2);
		report.ok(s1[0] !== 'LABEL',
			'a HIDDEN label is not what the pointer finds -- the whole defect, in one line',
			s1.slice(0, 3).join(' > '));

		// ---- 3. ...so a press over it PANS -------------------------------------------------------
		const t0 = await transform(a);
		const before = await labelOffset(a);
		await dragFrom(a, spot2, 90, 55);
		const t1 = await transform(a);
		const after = await labelOffset(a);
		report.ok(t0 && t1 && Math.abs((t1.tx - t0.tx) - 90) < 4 && Math.abs((t1.ty - t0.ty) - 55) < 4,
			'a press on the invisible label pans the map by the pointer\'s travel',
			t0 && t1 ? `moved ${(t1.tx - t0.tx).toFixed(1)}, ${(t1.ty - t0.ty).toFixed(1)} px` : 'no transform');
		report.ok(before && after && Math.abs(after.x - before.x) < 0.5 && Math.abs(after.y - before.y) < 0.5,
			'...and the label the user could not see stayed exactly where it was');

		// ---- 4. and it comes back ----------------------------------------------------------------
		// Hiding is not deletion. A fix that made a returned label unpickable would have traded one
		// silent state for another.
		await setLabelsHidden(a, false);
		await a.settle(250);
		const spot3 = await labelSpot(a);
		const s2 = await stackAt(a, spot3);
		report.ok(s2[0] === 'LABEL', 'a label that comes back is grabbable again', s2.slice(0, 3).join(' > '));

		// ---- 5. a node that moved is marked ------------------------------------------------------
		// The mark is a class and a CSS animation that clears itself, so what is asserted is the
		// class, that the browser resolved it to the NODE keyframes rather than the label ones, and
		// that a node nobody touched has neither.
		const nodeSpot = await a.page.evaluate(() => {
			const c = document.querySelector('#lpn_canvas .lpn-node');
			const r = c.getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		});
		const anim0 = await a.page.evaluate(() => {
			const c = document.querySelector('#lpn_canvas .lpn-node');
			return { cls: c.classList.contains('lpn-just-dragged'), name: getComputedStyle(c).animationName };
		});
		report.ok(!anim0.cls, 'a node standing still carries no mark', anim0.name);

		await dragFrom(a, nodeSpot, 70, 45);
		const anim1 = await a.page.evaluate(() => {
			const c = document.querySelector('#lpn_canvas .lpn-node');
			const cs = getComputedStyle(c);
			return { cls: c.classList.contains('lpn-just-dragged'), name: cs.animationName, dur: cs.animationDuration };
		});
		report.ok(anim1.cls, 'a node that was dragged is marked');
		report.eq(anim1.name, 'lpn-just-moved-node', '...with the NODE animation, not the label one');
		report.eq(anim1.dur, '45s', '...for the same 45 seconds the label mark runs');

		// A second junction, never touched, to say the mark is about the node and not about the map.
		const r = await canvasRect(a);
		await a.toolbarClick('Junction');
		await a.page.mouse.click(r.x + r.w * 0.75, r.y + r.h * 0.35);
		await a.settle(500);
		await a.toolbarClick('Select');
		await a.settle(250);
		const others = await a.page.evaluate(() => Array.from(
			document.querySelectorAll('#lpn_canvas .lpn-node'))
			.filter(c => c.classList.contains('lpn-just-dragged')).length);
		report.eq(others, 1, 'exactly one node carries the mark');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
