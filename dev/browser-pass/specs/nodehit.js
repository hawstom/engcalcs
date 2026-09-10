// §41 — an invisible band answers only where it is drawn (Tom, 2026-09-09: *"mouse behavior is
// unpredictable and mysterious, and this makes usage and debugging confusing."*).
//
// **THE DEFECT THIS FILE WAS WRITTEN FOR, AND IT WAS ONE WORD OF CSS.** `.lpn-node-hit` and
// `.lpn-link-symbol-hit` carried `pointer-events: visible`, which hit-tests the fill AND THE STROKE
// PERIMETER and ignores the VALUES of `fill` and `stroke` — so their `stroke: none` removed nothing.
// Neither declared a `stroke-width`, so the perimeter was the initial value, **1 USER UNIT**, which
// on this page is one WORLD unit rather than one pixel. The excess reach is therefore exactly half
// the world scale, in screen pixels, and that is the whole of why the fault is geographic: the XY
// Net3 example draws at 23.01 px/unit, so a node's band answered 11.47 px outside its own box and
// nobody could see it; the SAME network as a geographic project draws at 8,431 px/degree, so one
// node's invisible disc answered 42% of a 1398x798 canvas, up to 846 px from an 18 px centre, and
// the bare <svg> answered no sample point at all on a mid-line scan.
//
// It matters more than a cursor: `.lpn-node-hit` carries `data-node` and is what selectFromHit()
// and nodeOutranks() read. `hitConfirmed()` in js/looped-network.js is what stopped that becoming a
// wrong selection — it rejects any hit outside the element's own getBoundingClientRect — but a
// guard is not the cure, and nothing guards the CURSOR, which is computed from the same answer.
//
// The fix is `pointer-events: visibleFill` on both, which is .lpn-link-hit's own `visibleStroke`
// for a shape that is a disc rather than a line. The 12 px of pointer slop (LPN_NODE_HIT_PX) is
// untouched: what was fixed was never slop, it was a stroke.
//
// **THE SECOND MECHANISM, REPORTED HERE AND NOW FIXED IN ITS OWN SPEC.** Label text answered
// 271 px outside its own box on a geographic project and 0 px on the XY example -- scale
// -proportional too, but NOT stroke width: setting `stroke-width` on `.lpn-lbl` changed it by
// nothing. It is Blink laying SVG text out in its OWN LOCAL USER UNITS at LayoutUnit precision,
// which at 8,431 px per unit is 132 screen pixels a quantum. The cure is a SHAPE rather than a
// keyword -- the words hit-test nothing and `.lpn-lbl-hit` takes the press -- and specs/lblhit.js
// owns it. What is left here is the number, still printed, because this is where it was measured.

const { Session } = require('../lib/session');

exports.title = '41. An invisible hit band answers only where it is drawn';

// Open one gallery example and fit it. A FRESH session name every time: a Session profile persists
// between runs, and a profile that has already waved the gallery away never opens it again.
async function example(browser, match) {
	const a = await Session.open(browser, 'nodehit-' + match.replace(/\W+/g, ''));
	await a.goto();
	await a.menuClick(await a.lang('lpn_examples_menu'), 'file');
	await a.settle(600);
	await a.page.waitForSelector('button.lpn-example-card', { timeout: 30000 });
	const found = await a.page.evaluate((m) => {
		const b = [...document.querySelectorAll('button.lpn-example-card')].find(x => x.textContent.indexOf(m) >= 0);
		if (!b) { return false; }
		b.click();
		return true;
	}, match);
	if (!found) { throw new Error(`no examples card matching "${match}"`); }
	await a.settle(4000);
	await a.toolbarClick('Zoom to fit');
	await a.settle(900);
	return a;
}

// Sweep the canvas with document.elementFromPoint and, for every element that answers, measure how
// far the probe sat OUTSIDE that element's own getBoundingClientRect. A bounding box CONTAINS its
// shape, so a positive number is reach the drawing does not show — which is the whole property.
//
// **EVERY SAMPLE IS ACCOUNTED FOR.** Over bare map the consent banner and the colour legend lie on
// top of large parts of the canvas, so a probe can answer with an element that is not in the SVG at
// all; those are counted as `overlay` rather than dropped, because a silent filter here would let
// the sweep shrink to nothing and still read as a pass.
async function sweep(a, step = 7) {
	return a.page.evaluate((st) => {
		const svg = document.getElementById('lpn_canvas');
		const b = svg.getBoundingClientRect();
		const by = {};
		let inSvg = 0, overlay = 0, bare = 0, total = 0;
		const cursor = {};
		for (let y = Math.ceil(b.y) + 5; y < b.y + b.height; y += st) {
			for (let x = Math.ceil(b.x) + 5; x < b.x + b.width; x += st) {
				total++;
				const el = document.elementFromPoint(x, y);
				if (!el || !svg.contains(el)) { overlay++; continue; }
				inSvg++;
				if (el === svg) { bare++; }
				const cu = getComputedStyle(el).cursor;
				cursor[cu] = (cursor[cu] || 0) + 1;
				const r = el.getBoundingClientRect();
				const d = Math.hypot(Math.max(r.left - x, x - r.right, 0), Math.max(r.top - y, y - r.bottom, 0));
				const k = el === svg ? 'bare canvas' : (el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || ''));
				by[k] = by[k] || { n: 0, max: 0 };
				by[k].n++;
				if (d > by[k].max) { by[k].max = d; }
			}
		}
		const t = (svg.querySelector('g').getAttribute('transform') || '').match(/scale\(([-\d.e+]+)\)/);
		return { total, inSvg, overlay, bare, by, cursor, scale: t ? +t[1] : null };
	}, step);
}

// The other half of the question, and the decisive one: how far from its OWN CENTRE does an
// invisible band answer? A grid sweep cannot answer it on a geographic project — the node bands are
// under their own labels there, so a 7 px grid returns none of them and every assertion made from it
// would be a check of nothing (README: "a check that cannot fail is worse than one that does"). So
// this walks OUTWARD from each band's own centre on eight bearings, which puts samples exactly where
// the fault was and can only be answered by the band itself.
//
// **AND IT ASKS elementsFromPoint, THE PLURAL, WHICH IS WHAT mapHitAt() ITSELF WALKS.** On a
// geographic project NOT ONE of the 97 node bands is the topmost answer anywhere — the label text
// above them reaches 271 px past its own box and blankets the map — so the singular call measures
// the label layer rather than the band, and a check built on it would report 0 of 97 and prove
// nothing about the thing being fixed.
async function bandReach(a, cls, limit = 900) {
	return a.page.evaluate(([sel, lim]) => {
		const svg = document.getElementById('lpn_canvas');
		const b = svg.getBoundingClientRect();
		const els = [...svg.querySelectorAll(sel)];
		const B = [[1,0],[0,1],[-1,0],[0,-1],[0.707,0.707],[-0.707,0.707],[0.707,-0.707],[-0.707,-0.707]];
		// **THE WALK STOPS 40 px PAST THE LAST HIT, and that is safe rather than a shortcut.** The
		// fault being measured is a STROKE PERIMETER, which is a solid annulus from the centre
		// outward at these widths, so the reach it produces is continuous: the 846 px answer that
		// started this was reachable one pixel at a time from the node. Walking the full canvas from
		// every band instead costs about six minutes of a pass that is already thirteen.
		const GAP = 40;
		let seen = 0, worstBox = { over: -1 }, worstCentre = { over: -1 };
		els.forEach(el => {
			const r = el.getBoundingClientRect();
			if (!(r.width > 0)) { return; }
			const cx = r.x + r.width / 2, cy = r.y + r.height / 2, rad = Math.max(r.width, r.height) / 2;
			let far = -1, farBox = -1;
			B.forEach(([ux, uy]) => {
				for (let d = 0; d <= lim; d += 2) {
					const x = cx + ux * d, y = cy + uy * d;
					if (x < b.x || y < b.y || x > b.right || y > b.bottom) { break; }
					if (d - far > GAP && far >= 0) { break; }
					if ((document.elementsFromPoint(x, y) || []).indexOf(el) < 0) { continue; }
					far = d;
					const ob = Math.hypot(Math.max(r.left - x, x - r.right, 0), Math.max(r.top - y, y - r.bottom, 0));
					if (ob > farBox) { farBox = ob; }
				}
			});
			if (far < 0) { return; }
			seen++;
			const id = el.dataset.node || el.dataset.link || null;
			if (farBox > worstBox.over) { worstBox = { over: farBox, id }; }
			if (far - rad > worstCentre.over) { worstCentre = { over: far - rad, d: far, rad, id }; }
		});
		return { of: els.length, seen, worstBox, worstCentre };
	}, [cls, limit]);
}

// A run's worth of sampling, printed whole, so a number in a report can be read back later.
function tell(report, label, s) {
	report.note(`${label}: scale ${s.scale && s.scale.toFixed(2)} px/unit, ${s.inSvg} samples in the map, ${s.overlay} under page furniture, ${s.bare} bare canvas`);
	// The cursor split is the shape of Tom's own report and is REPORTED, not asserted: the fix above
	// moves which ELEMENT answers, and on the geographic example the number barely moves, because
	// the band was inheriting `grab` from the canvas anyway and the remaining `pointer` is all label
	// text. Saying so with a number is the point.
	report.note(`   cursor: ${Object.keys(s.cursor).map(k => `${k} ${(100 * s.cursor[k] / s.inSvg).toFixed(1)}%`).join(', ')}`);
	Object.keys(s.by).sort((p, q) => s.by[q].n - s.by[p].n).forEach(k => {
		report.note(`   ${String(s.by[k].n).padStart(6)}  ${s.by[k].max.toFixed(1).padStart(7)} px outside its own box   ${k}`);
	});
}

// How far outside its own box a class is allowed to answer. A polyline's bounding box does not
// include its round caps and joins, so .lpn-link-hit is legitimately a few pixels proud of it; a
// disc and a rect are their own boxes and get the plain slop.
const BOX_SLOP_PX = 3, POLYLINE_SLOP_PX = 8;

function assertHealthy(report, where, s) {
	const bands = ['circle.lpn-node-hit', 'rect.lpn-link-symbol-hit'];
	bands.forEach(k => {
		const e = s.by[k];
		if (!e) { report.note(`${where}: nothing answered as ${k} — nothing to check`); return; }
		report.ok(e.max <= BOX_SLOP_PX, `${where}: ${k} answers only inside its own box`,
			`furthest ${e.max.toFixed(1)} px outside it over ${e.n} samples`);
	});
	const lh = s.by['polyline.lpn-link-hit'];
	if (lh) {
		// Task 4 of the brief: the same idiom, so measure rather than assume. It does NOT share the
		// defect, and the reason is that it is the one band that DECLARES its own stroke-width
		// (`var(--lpn-hit)`, published by refreshSymbolSizes() in screen pixels).
		report.ok(lh.max <= POLYLINE_SLOP_PX, `${where}: .lpn-link-hit does not share the defect`,
			`furthest ${lh.max.toFixed(1)} px outside its own box over ${lh.n} samples`);
	}
	report.ok(s.bare > 0, `${where}: bare map answers the pointer somewhere`,
		`${s.bare} of ${s.inSvg} samples inside the canvas`);
}

exports.run = async function ({ browser, report }) {
	// ---- the geographic project, which is where it was user-visible -----------------------------
	const geo = await example(browser, 'lat/lon');
	try {
		const s = await sweep(geo);
		tell(report, 'geographic (EPANET Net3, lat/lon) at zoom to fit', s);
		report.ok(s.scale > 1000, 'the geographic example really is drawn at a very large scale',
			`${s.scale && s.scale.toFixed(0)} px per world unit`);
		assertHealthy(report, 'geographic', s);

		let nb = null;
		for (const [cls, name] of [['.lpn-node-hit', 'node band'], ['.lpn-link-symbol-hit', 'pump/valve band']]) {
			const r = await bandReach(geo, cls);
			if (cls === '.lpn-node-hit') { nb = r; }
			report.ok(r.seen > 0 && r.seen === r.of, `geographic: every ${name} on the map was measured`,
				`${r.seen} of ${r.of} ${cls}`);
			if (!r.seen) { continue; }
			// The general property, and the one that holds for a rect as well as a disc: a bounding
			// box CONTAINS its shape, so anything answering outside its own box is reach the drawing
			// does not show.
			report.ok(r.worstBox.over <= BOX_SLOP_PX, `geographic: a ${name} answers only inside its own box`,
				`furthest: ${cls} ${r.worstBox.id} answered ${r.worstBox.over.toFixed(0)} px outside it`);
		}
		// The acceptance test in its own words, and it is only askable of a DISC: a rect's corner is
		// legitimately half a diagonal from its centre, which is why the box test above is the one
		// both bands take.
		report.ok(nb.worstCentre.over <= BOX_SLOP_PX,
			'geographic: no node band answers further from its centre than it is drawn',
			`furthest: node ${nb.worstCentre.id} answered ${nb.worstCentre.d.toFixed(0)} px from its own centre at a drawn radius of ${nb.worstCentre.rad.toFixed(0)} px`);

		// **TASK 4 OF THE BRIEF, MEASURED AT THE SCALE THAT MATTERS RATHER THAN ASSUMED.**
		// .lpn-link-hit is the same idiom — an invisible band whose width is published in world
		// units — so if the cause were the scale it would be latent here too. It is not, and the
		// reason is exactly the difference between the two rules: this one DECLARES its own
		// `stroke-width: var(--lpn-hit)`, which refreshSymbolSizes() republishes on every zoom as
		// LPN_LINK_HIT_PX screen pixels converted to world units, so its perimeter is 12 px at
		// 23 px/unit and 12 px at 8,431. A polyline's bounding box does not contain its round caps
		// and joins, which is the whole of the few pixels allowed here.
		const lb = await bandReach(geo, '.lpn-link-hit');
		report.ok(lb.seen > 10, 'geographic: there are pipe bands to measure', `${lb.seen} of ${lb.of}`);
		report.ok(lb.worstBox.over <= POLYLINE_SLOP_PX,
			'geographic: .lpn-link-hit does not share the defect at 8,431 px per unit either',
			`furthest: link ${lb.worstBox.id} answered ${lb.worstBox.over.toFixed(1)} px outside its own box`);

		// REPORTED, not asserted — a different mechanism, and not fixed. See the header.
		const txt = Object.keys(s.by).filter(k => /^(text|tspan)\./.test(k));
		const worstTxt = txt.reduce((m, k) => Math.max(m, s.by[k].max), 0);
			report.note(`label text answers up to ${worstTxt.toFixed(0)} px outside its own box here -- it was 271 px until specs/lblhit.js moved the grab area off the glyphs, and no text should answer at all now`);
	} finally { await geo.close(); }

	// ---- the XY project, which is where the same fault was 11 px and invisible -------------------
	const xy = await example(browser, 'EPANET Net3E');
	try {
		const s = await sweep(xy);
		tell(report, 'XY (EPANET Net3) at zoom to fit', s);
		assertHealthy(report, 'XY', s);
	} finally { await xy.close(); }
};
