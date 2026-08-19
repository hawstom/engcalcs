// §24 — clicking empty space on a lat/lon map (ROADMAP Task 145).
//
// Tom, 2026-08-18: *"When I click in space on the geomap, it opens properties for a node. Bad. This
// doesn't happen in xy projects."* and *"Panning is broken because mousedown is selecting nodes far
// away."*
//
// **THE CAUSE IS float32, AND IT IS THE BROWSER'S HIT TEST RATHER THAN OURS.** An SVG hit test is
// resolved in the target's own local coordinates, which Blink carries as 32-bit floats. A lat/lon
// project makes one world unit a DEGREE, so a node sits at x = -122.568 with an 11 px label whose
// font is 1.8e-4 units — and a float32's spacing at 122 is 7.6e-6, forty times that label's whole
// height. The quantised text then answers "yes, that is me" hundreds of pixels away. Measured with
// one junction and one label on a 5,022-point sweep of the canvas: 4% of it resolved to that node at
// the home view, 62% at 91,000 px/degree, up to 758 px away — every hit a <tspan>. The same sweep in
// an XY project answers 7 points out of 5,022, at every zoom.
//
// `hitConfirmed()` in js/looped-network.js confirms every hit against the element's own
// getBoundingClientRect(), which does not go through that path. A bounding box CONTAINS its shape,
// so the confirmation can only reject: nothing about a true hit changes anywhere.
//
// The checks below are behavioural on purpose — a DOM sweep would measure elementFromPoint(), which
// is still wrong and is not ours to fix. What must be true is that a press on bare map pans, and a
// tap on bare map selects nothing and opens nothing.

const { Session } = require('../lib/session');

exports.title = '24. Clicking empty space on a lat/lon map';

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}
// Where the one junction is drawn, in screen pixels.
async function nodeSpot(a) {
	return a.page.evaluate(() => {
		const c = document.querySelector('#lpn_canvas .lpn-node');
		if (!c) { return null; }
		const r = c.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
}
// What the page thinks is selected, and whether the property popup is up — the two things a click
// on nothing must not produce.
async function picked(a) {
	return a.page.evaluate(() => {
		const sel = document.querySelector('#lpn_canvas .lpn-selected');
		const pop = document.getElementById('lpn_popup');
		return {
			selected: sel ? (sel.dataset.node || sel.dataset.link || sel.dataset.lbl || 'something') : null,
			popup: !!(pop && pop.style.display !== 'none')
		};
	});
}
async function transform(a) {
	return a.page.evaluate(() => {
		const t = document.querySelector('#lpn_canvas > g').getAttribute('transform') || '';
		const m = t.match(/translate\(([-\d.e+]+),([-\d.e+]+)\)\s*scale\(([-\d.e+]+)\)/);
		return m ? { tx: +m[1], ty: +m[2], s: +m[3] } : null;
	});
}
// Eight points spread over the canvas, all of them a long way from the only node there is.
async function farPoints(a, from, minPx) {
	const r = await canvasRect(a);
	const out = [];
	for (const fy of [0.2, 0.45, 0.7, 0.9]) {
		for (const fx of [0.12, 0.35, 0.62, 0.88]) {
			const p = { x: r.x + r.w * fx, y: r.y + r.h * fy };
			if (Math.hypot(p.x - from.x, p.y - from.y) >= minPx) { out.push(p); }
		}
	}
	return out.slice(0, 8);
}
async function wheelIn(a, n) {
	const r = await canvasRect(a);
	await a.page.mouse.move(r.x + r.w / 2, r.y + r.h / 2);
	for (let i = 0; i < n; i++) { await a.page.mouse.wheel(0, -100); await a.page.waitForTimeout(30); }
	await a.settle(500);
}
// One junction in the middle of the map, and back to Select.
async function oneJunction(a) {
	const r = await canvasRect(a);
	await a.toolbarClick('Junction');
	await a.page.mouse.click(r.x + r.w / 2, r.y + r.h / 2);
	await a.settle(500);
	await a.toolbarClick('Select');
	await a.settle(250);
	if (await a.nodeCount() < 1) { throw new Error(`${a.name}: the junction did not land`); }
}
// Tap every far point; report how many of them picked something up.
async function tapAll(a, points) {
	let caught = 0, where = '';
	for (const p of points) {
		await a.page.mouse.click(p.x, p.y);
		await a.settle(150);
		const got = await picked(a);
		if (got.selected || got.popup) {
			caught++;
			if (!where) { where = `${Math.round(p.x)},${Math.round(p.y)} → ${got.selected}${got.popup ? ' + popup' : ''}`; }
		}
		// A popup left open covers the next point.
		await a.page.keyboard.press('Escape');
		await a.settle(80);
	}
	return { caught, where };
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.goto();
		await a.dismissGallery();

		// ---- 1. a lat/lon project, at the view it opens on --------------------------------------
		await a.newGeoProject();
		await a.settle(700);
		await oneJunction(a);
		const n0 = await nodeSpot(a);
		const pts0 = await farPoints(a, n0, 100);
		report.ok(pts0.length >= 6, 'there are points on the canvas well clear of the node', pts0.length + ' of them');
		const t0 = await tapAll(a, pts0);
		report.eq(t0.caught, 0, 'tapping bare map on a lat/lon project picks nothing up');
		if (t0.caught) { console.log('      first:', t0.where); }

		// ---- 2. and still nothing a long way into the zoom --------------------------------------
		// 20 notches is ~91,000 px/degree, where 62% of the canvas used to answer to one junction.
		await wheelIn(a, 20);
		const n1 = await nodeSpot(a);
		const t1 = await tapAll(a, await farPoints(a, n1, 150));
		report.eq(t1.caught, 0, '...and still nothing 20 wheel notches in, where 62% of it used to');
		if (t1.caught) { console.log('      first:', t1.where); }

		// ---- 3. a press on bare map PANS ---------------------------------------------------------
		// The whole of Tom's second sentence: a mousedown that selects a node starts a node drag, so
		// the map does not move at all.
		const before = await transform(a);
		const start = (await farPoints(a, await nodeSpot(a), 150))[0];
		await a.page.mouse.move(start.x, start.y);
		await a.page.mouse.down();
		await a.page.mouse.move(start.x + 120, start.y + 70, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(500);
		const after = await transform(a);
		report.ok(before && after && Math.abs((after.tx - before.tx) - 120) < 4 &&
			Math.abs((after.ty - before.ty) - 70) < 4,
			'a drag from bare map pans the lat/lon map by exactly the pointer\'s travel',
			after && before ? `moved ${(after.tx - before.tx).toFixed(1)}, ${(after.ty - before.ty).toFixed(1)} px` : 'no transform');
		report.ok(!(await picked(a)).selected, '...and selects nothing on the way');

		// ---- 4. the node itself still answers ----------------------------------------------------
		// The guard can only ever REJECT a hit, so the check that it rejects nothing real is the
		// other half of it.
		const n2 = await nodeSpot(a);
		await a.page.mouse.click(n2.x, n2.y);
		await a.settle(400);
		const onIt = await picked(a);
		report.ok(!!onIt.selected, 'clicking the junction still selects it', onIt.selected);
		report.ok(onIt.popup, '...and still opens its properties');
		await a.page.keyboard.press('Escape');
		await a.settle(150);

		// ---- 5. the XY control -------------------------------------------------------------------
		// Not decoration: it is what says the checks above are about degrees and not about the taps.
		await a.newProject();
		await a.settle(700);
		await oneJunction(a);
		const t3 = await tapAll(a, await farPoints(a, await nodeSpot(a), 150));
		report.eq(t3.caught, 0, 'an XY project behaves the same, as it always did');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
