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
// `extra` reaches browser.newContext(), which is the only place `deviceScaleFactor` can be set.
async function example(browser, match, extra) {
	const a = await Session.open(browser, 'nodehit-' + String(match.key || match).replace(/\W+/g, '')
		+ (extra && extra.deviceScaleFactor ? '-dpr' + String(extra.deviceScaleFactor).replace('.', '_') : ''), extra);
	await a.goto();
	// A card can be asked for by LANGUAGE KEY, which is how a spec names a shipped string without
	// pinning its English (harness_wording_check.php).
	if (match && match.key) { match = await a.lang(match.key); }
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
		// **AND IT GIVES UP AFTER 60 px IF THE BAND HAS NOT ANSWERED ONCE.** The reach this walk
		// hunts is a solid annulus from the centre outward -- the 846 px answer that started this
		// file was reachable one pixel at a time from the node -- so a band that says nothing in its
		// first 60 px will say nothing at 900 either. Without this, every band its own drawn symbol
		// covers costs eight full-length walks, which is most of them now that the slop is zero.
		const GIVE_UP = 60;
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
					if (far < 0 && d > GIVE_UP) { break; }
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

// How far outside its own box a class is allowed to answer.
//
// **THE BOX IS THE GEOMETRY BOX AND LEAVES THE STROKE OUT** -- measured in Chromium on the XY Net3
// example: a node band drawn at a 4 px radius reports an 8 x 8 px rect while carrying a declared
// 12 px stroke. Since Task 618 the SLOP of every band on this map IS a stroke (that is the only
// construction that can put a constant margin round an outline that is not a circle), so each row
// below is the slop that band DECLARES, in screen pixels, plus a tolerance for the sweep's own
// 7 px grid step and for a polyline's round caps and joins.
//
// **IT IS THE DECLARED NUMBER AND NEVER "whatever stroke it happens to carry", WHICH IS WHAT KEEPS
// THIS FILE'S ORIGINAL DEFECT VISIBLE.** That defect WAS a stroke -- an undeclared one, the initial
// 1 USER UNIT, 4,215 screen pixels on a geographic drawing -- so an allowance that read the stroke
// off the element would have called it explained and passed. Chromium reports `pointer: fine`, so
// a pump and a valve get the mouse figure here.
const BAND_SLOP_PX = {
	'circle.lpn-node-hit': 0,          // Tom, 2026-09-10: "No slop for nodes."
	'path.lpn-node-hit': 0,            // the same, round a silhouette
	'path.lpn-link-symbol-hit': 2,     // LPN_SYMBOL_HIT_PX / 2, the mouse figure
	'polyline.lpn-link-hit': 1.5       // half the 3 px floor; the drawn pipe is 2 px
};
const GRID_TOL_PX = 3, POLYLINE_SLOP_PX = 8;
function allowed(cls) { return (BAND_SLOP_PX[cls] || 0) + GRID_TOL_PX; }

function assertHealthy(report, where, s) {
	// A node's band is a <circle> where the symbol IS a disc and a <path> where it is not, and a
	// pump's is a <path> since Task 618 -- so the SHAPES are named here rather than one tag.
	const bands = ['circle.lpn-node-hit', 'path.lpn-node-hit', 'path.lpn-link-symbol-hit'];
	bands.forEach(k => {
		const e = s.by[k];
		if (!e) { report.note(`${where}: nothing answered as ${k} — nothing to check`); return; }
		report.ok(e.max <= allowed(k), `${where}: ${k} answers only inside its own box, plus its declared slop`,
			`furthest ${e.max.toFixed(1)} px outside it over ${e.n} samples, allowed ${allowed(k)}`);
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


// ---- TASK 618: WYSIWYG. HOW FAR PAST THE DRAWN INK DOES A NODE ANSWER, PER TYPE? ---------------
//
// Tom, 2026-09-10, with Thematic map on and the labels off, tracing the answer with the pointer
// itself: *"the reservoir triangle seems to be hogging space. Actually, that's not a suspicion...
// I can visually trace the outline of the reservoir's halo, and if I am not mistaken, it is
// circular. Fix that."* And: *"Tank is not clean; it's a circle too."* And, of the type that was
// already right: *"Junctions are clean."*
//
// **IT ASKS THE TOPMOST ANSWER, NOT "IS MY BAND IN THE STACK", AND THAT IS THE WHOLE POINT.** The
// round halo had TWO sources -- `.lpn-node-hit` being a circle at the circumscribing radius, and
// the unpainted `.lpn-node` disc under a vessel carrying `pointer-events: visible` in its own
// right -- so a measurement that named one element would have reported the other one fixed. What a
// person meets is whatever is on top, so that is what is walked.
//
// The DRAWN extent on the same bearing comes from the browser's own geometry rather than from any
// number of ours: `isPointInFill()` on the symbol's silhouette (the backdrop path, which traces the
// icon) for a reservoir and a tank, and on the drawn disc for a junction.
// **IT MEASURES UP TO EIGHT NODES OF EACH TYPE AND SAYS SO.** A walk on sixteen bearings from every
// one of Net3's 97 nodes is a quarter of a million hit tests and minutes of a pass that is already
// thirteen; the question here is about a TYPE's shape, which eight of them answer as well as ninety.
async function inkVsHit(a, bearings = 16, limit = 60, perType = 8) {
	return a.page.evaluate(([NB, LIM, PER]) => {
		const svg = document.getElementById('lpn_canvas');
		const B = [];
		for (let i = 0; i < NB; i++) { const t = i * 2 * Math.PI / NB; B.push([Math.cos(t), Math.sin(t)]); }
		const GAP = 6;
		function reach(cx, cy, ux, uy, fn) {
			let far = -1;
			for (let d = 0; d <= LIM; d += 1.5) {
				if (fn(cx + ux * d, cy + uy * d)) { far = d; }
				else if (far >= 0 && d - far > GAP) { break; }
			}
			return far;
		}
		const out = {};
		const seen = {};
		[...svg.querySelectorAll('.lpn-node')].forEach(circ => {
			const id = circ.dataset.node;
			const type = (circ.getAttribute('class').match(/lpn-node-(\w+)/) || [])[1];
			seen[type] = (seen[type] || 0) + 1;
			if (seen[type] > PER) { return; }
			const cr = circ.getBoundingClientRect();
			const cx = cr.x + cr.width / 2, cy = cr.y + cr.height / 2;
			// The silhouette this node is drawn from: the nearest backdrop path to its own centre,
			// which is the shape prependSymbolBackdrop() traced out of lib/Icons.lib.php.
			let ink = circ;
			if (type === 'reservoir' || type === 'tank') {
				let best = null, bd = 1e9;
				[...svg.querySelectorAll('.lpn-node-symbol-backdrop')].forEach(pth => {
					const r = pth.getBoundingClientRect();
					const d = Math.hypot(r.x + r.width / 2 - cx, r.y + r.height / 2 - cy);
					if (d < bd) { bd = d; best = pth; }
				});
				if (best && bd < 40) { ink = best; }
			}
			const e = out[type] = out[type] || { n: 0, ink: [], hit: [], rounds: [], over: -99, round: 0, worst: null, shape: null };
			e.n++;
			// **WHAT THE BAND IS, not only where it answers.** The probe below is a measurement and a
			// measurement can be blunted -- a node with a pipe drawn over one side answers short on
			// that bearing, which makes a circle read as a polygon. This reads the shape itself.
			const bandEl = svg.querySelector('.lpn-node-hit[data-node="' + CSS.escape(id) + '"]');
			if (bandEl && !e.shape) { e.shape = bandEl.tagName.toLowerCase(); }
			// One inverse per node rather than one per probe: the transform does not move while the
			// walk runs, and this is the difference between seconds and minutes.
			let inv = null;
			try { inv = ink.getScreenCTM().inverse(); } catch (err) { inv = null; }
			const pt = svg.createSVGPoint();
			let hMin = 1e9, hMax = -1;
			B.forEach(([ux, uy]) => {
				const inkFar = reach(cx, cy, ux, uy, (x, y) => {
					if (!inv) { return false; }
					pt.x = x; pt.y = y;
					try { return ink.isPointInFill(pt.matrixTransform(inv)); } catch (err) { return false; }
				});
				const hitFar = reach(cx, cy, ux, uy, (x, y) => {
					const list = (document.elementsFromPoint(x, y) || []).filter(el => svg.contains(el));
					const top = list[0];
					return !!(top && top.dataset && top.dataset.node === id);
				});
				if (inkFar >= 0) { e.ink.push(inkFar); }
				if (hitFar >= 0) {
					e.hit.push(hitFar);
					hMin = Math.min(hMin, hitFar); hMax = Math.max(hMax, hitFar);
					const over = hitFar - Math.max(inkFar, 0);
					if (over > e.over) { e.over = over; e.worst = id; }
				}
			});
			// How far from ROUND this node's answer is: a disc gives ~0 whatever its size, and any
			// polygon gives its own corner-to-side difference. It is the number Tom read by eye.
			// **PER NODE, AND THE TYPE TAKES THE MEDIAN**, because anything drawn over a node -- a
			// pipe, a pump, another node's band -- shortens the reach on the bearings it covers and
			// makes a circle read as a polygon. Obstruction is the exception on any drawing, so the
			// median is what that type's shape actually is.
			if (hMax > 0) { e.rounds.push(hMax - hMin); }
		});
		Object.keys(out).forEach(k => {
			const e = out[k];
			e.inkMin = Math.min.apply(null, e.ink.length ? e.ink : [0]);
			e.inkMax = Math.max.apply(null, e.ink.length ? e.ink : [0]);
			e.hitMin = Math.min.apply(null, e.hit.length ? e.hit : [0]);
			e.hitMax = Math.max.apply(null, e.hit.length ? e.hit : [0]);
			const rs = e.rounds.slice().sort((p, q) => p - q);
			e.round = rs.length ? rs[Math.floor(rs.length / 2)] : 0;
			delete e.ink; delete e.hit; delete e.rounds;
		});
		return out;
	}, [bearings, limit, perType]);
}

// **A PUMP AND A VALVE ARE SELECTED BY CLICKING WHAT YOU CAN SEE** -- Tom's own acceptance test
// (2026-09-10: *"My test case is trying to select pump volutes while zoomed to fit on Net3"*, and
// *"They are identical to valve. No wonder! There is no presence!"*). It clicks the CENTRE OF THE
// DRAWN SYMBOL, which is the one place a reader is aiming, and reads back what the page selected.
// Before the fix every one of these answered with a NODE: the grab square was in the links layer,
// under both end nodes' bands.
async function clickSymbols(a) {
	// **THE POINT IS FOUND FRESH FOR EACH SYMBOL, IMMEDIATELY BEFORE ITS OWN CLICK.** The click
	// before it opened a property popup, and a popup drawn over the canvas swallows the next press
	// -- which then reads as "the pump was not selectable" when what happened is that the click
	// never reached the map. Escape first, then look, then click.
	const spots = await a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas');
		return [...svg.querySelectorAll('.lpn-link-symbol')].map(g => {
			const h = g.querySelector('.lpn-link-symbol-hit');
			const t = (g.getAttribute('class').match(/lpn-link-symbol-(\w+)/) || [])[1];
			return { type: t, id: h ? h.dataset.link : null, w: g.getBoundingClientRect().width };
		}).filter(p => p.w > 0 && p.id);
	});
	const out = [];
	for (const p of spots) {
		await a.page.keyboard.press('Escape');
		await a.settle(120);
		// **IT AIMS AT INK THE LABELS ARE NOT COVERING, AND THAT IS NOT A DODGE.** Every label lives
		// in the topmost layer and keeps its own grab shape (Tom, 2026-09-10: *"Slop for labels"*),
		// so a label lying over a volute takes the press -- correctly, because the label is what a
		// reader sees there. Tom made his own observations with Thematic map on, which is this
		// page's own way of saying "labels off". So the candidates are the symbol's centre and eight
		// points inside its own box; the first one the symbol itself answers at is the one clicked,
		// and a symbol buried under something else everywhere is REPORTED rather than failed.
		const at = await a.page.evaluate((id) => {
			const svg = document.getElementById('lpn_canvas');
			const h = svg.querySelector('.lpn-link-symbol-hit[data-link="' + CSS.escape(id) + '"]');
			if (!h) { return null; }
			const r = h.getBoundingClientRect();
			const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
			const q = Math.min(r.width, r.height) * 0.25;
			const tries = [[0, 0], [q, 0], [-q, 0], [0, q], [0, -q], [q, q], [-q, q], [q, -q], [-q, -q]];
			for (const [dx, dy] of tries) {
				const list = (document.elementsFromPoint(cx + dx, cy + dy) || []).filter(e => svg.contains(e));
				const top = list[0];
				if (top && top.dataset && top.dataset.link === id) { return { x: cx + dx, y: cy + dy }; }
			}
			return null;
		}, p.id);
		if (!at) {
			out.push({ type: p.type, id: p.id, got: null, covered: true });
			continue;
		}
		await a.page.mouse.click(at.x, at.y);
		await a.settle(220);
		// **EVERY MARKED ELEMENT, NOT THE FIRST ONE IN DOCUMENT ORDER.** A press can leave more than
		// one thing marked, and reading `querySelector` alone then answers with whatever is drawn
		// earliest. A link wears its mark on its HALO, which carries no dataset (selectionMarkEl()
		// in js/looped-network.js), so a link is identified by GEOMETRY: the halo and the band are
		// both built from linkPoints(l).
		const got = await a.page.evaluate((id) => {
			const svg = document.getElementById('lpn_canvas');
			const sel = [...svg.querySelectorAll('.lpn-selected')];
			if (!sel.length) { return null; }
			const band = svg.querySelector('.lpn-link-hit[data-link="' + CSS.escape(id) + '"]');
			const pts = band && band.getAttribute('points');
			for (const el of sel) {
				if (el.dataset && el.dataset.link === id) { return 'link ' + id; }
				if (pts && el.getAttribute('points') === pts) { return 'link ' + id; }
			}
			const first = sel[0];
			if (first.dataset && first.dataset.node) { return 'node ' + first.dataset.node; }
			if (first.dataset && first.dataset.link) { return 'link ' + first.dataset.link; }
			return 'something else (' + sel.length + ' marked)';
		}, p.id);
		out.push({ type: p.type, id: p.id, got: got, covered: false });
		await a.page.keyboard.press('Escape');
		await a.settle(80);
	}
	return out;
}

// A few wheel notches over the middle of the canvas, which is how a person zooms this map.
async function zoomIn(a, notches) {
	const b = await a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
	await a.page.mouse.move(b.x, b.y);
	for (let i = 0; i < notches; i++) { await a.page.mouse.wheel(0, -100); await a.page.waitForTimeout(40); }
	await a.settle(700);
}

// The slop a band is allowed past its own ink: half of LPN_NODE_HIT_PX, plus the walk's own 1 px
// step and antialiasing.
// **ZERO SINCE TOM'S RULING OF 2026-09-10**: *"No slop for nodes. Slop for labels and to enforce a
// lower limit of 3 px for link lines."* The tolerance below is the walk's own 1.5 px step, the
// drawn ring's own stroke, and antialiasing -- not a margin anybody asked for.
const NODE_SLOP_PX = 0, SLOP_TOL_PX = 4;

function tellShape(report, where, m) {
	report.note(`${where}: drawn extent against hit extent, in screen pixels from the node's own centre`);
	report.note('   type        n   ink min/max   hit min/max   past the ink   out of round');
	Object.keys(m).sort().forEach(t => {
		const e = m[t];
		report.note(`   ${t.padEnd(10)} ${String(e.n).padStart(3)}   ${e.inkMin.toFixed(0).padStart(3)}/${e.inkMax.toFixed(0).padEnd(4)}     ${e.hitMin.toFixed(0).padStart(3)}/${e.hitMax.toFixed(0).padEnd(4)}    ${e.over.toFixed(1).padStart(6)}        ${e.round.toFixed(1).padStart(5)}`);
	});
}

function assertShape(report, where, m) {
	// **WITH THE SLOP AT ZERO THIS IS THE WHOLE OF WYSIWYG IN ONE NUMBER**, and it is asked of every
	// type: how far past its own ink does the node answer, walking out from its centre? Tom,
	// 2026-09-10: *"No slop for nodes."* The tolerance is the walk's 1.5 px step, the drawn ring's
	// own stroke and antialiasing.
	//
	// **IT IS THE ASSERTION THAT SURVIVED A MUTATION AND THE PRETTIER ONE DID NOT.** "How far from
	// round is the answer" reads 0 for a circle and ought to convict a circumscribing band -- but
	// with the band forced back to a circle a tank still read 3.0 (its own corners are only 3 px
	// further than its sides at that size) and a reservoir read 13.5 (a pipe drawn across one
	// bearing shortened the answer there). So roundness is PRINTED, and what is asked is the ink.
	// Measured with the band forced back to a circle: a reservoir answered 10.5 px past its ink and
	// a tank 9.0, against 0.0 and 1.5 as they stand.
	Object.keys(m).sort().forEach(t => {
		const e = m[t];
		if (e.over < -90) { report.note(`${where}: no ${t} was reachable on this view -- not measured`); return; }
		report.ok(e.over <= NODE_SLOP_PX + SLOP_TOL_PX,
			`${where}: a ${t} answers only where it is drawn`,
			`furthest ${e.over.toFixed(1)} px past its ink (node ${e.worst}), allowed ${NODE_SLOP_PX + SLOP_TOL_PX}`);
		report.note(`${where}: a ${t} is ${e.round.toFixed(1)} px out of round (a disc gives ~0), ink ${e.inkMin}-${e.inkMax} px, hit ${e.hitMin}-${e.hitMax} px`);
	});
	// **AND THE SHAPE ITSELF, WHICH IS THE ASSERTION NO DRAWING CAN BLUNT.** A pipe over one bearing
	// can make a circle read as a polygon; nothing can turn a <path> into a <circle>.
	['reservoir', 'tank'].forEach(t => {
		if (!m[t]) { report.note(`${where}: no ${t} on this drawing -- nothing to check`); return; }
		report.ok(m[t].shape === 'path', `${where}: a ${t}'s band IS its silhouette, not a circle`,
			`<${m[t].shape}>`);
	});
	if (m.junction) {
		report.ok(m.junction.shape === 'circle', `${where}: a junction's band is still a plain disc -- "Junctions are clean"`,
			`<${m.junction.shape}>`);
	}
}

function assertSymbolClicks(report, where, clicks) {
	report.ok(clicks.length > 0, `${where}: there are pump/valve symbols to click`, `${clicks.length}`);
	clicks.forEach(c => {
		if (c.covered) {
			report.note(`${where}: the ${c.type} on link ${c.id} has a label lying over every point of it -- not asked`);
			return;
		}
		report.ok(c.got === 'link ' + c.id,
			`${where}: clicking the drawn ${c.type} selects that ${c.type}`,
			`wanted link ${c.id}, selected ${c.got}`);
	});
}

// The two Task 618 measurements are exported so a MUTATION CHECK can drive them on one example in
// minutes rather than re-running the whole section, which walks 97 node bands and 119 pipe bands and
// takes the better part of an hour on a loaded machine. Nothing in run.js reads these.
exports.inkVsHit = inkVsHit;
exports.clickSymbols = clickSymbols;
exports.example = example;

// ---- TOM'S OWN SETUP, AND THE 1 px ISLAND HUNT (2026-09-10) ----------------------------------
//
// He found an invisible border by hand and said what that costs: *"You have no idea how
// painstaking it is to find an invisible line 1px wide even once, much less many times."* So this
// is the machine, and it reproduces his settings exactly -- the Basic example, **Symbol size
// 100 px, Link line thickness 30 px, Thematic map on** -- then walks outward one pixel at a time
// on eight bearings from a junction, a reservoir and a pump, at three zooms, reading the element
// the browser hits and the cursor that element computes.
//
// **WHAT IT ASSERTS IS TWO SHAPES OF ISLAND, NAMED SO THEY CAN BE WRONG:**
//   * a PHANTOM -- an invisible hit band (`.lpn-node-hit`, `.lpn-link-hit`, `.lpn-link-symbol-hit`,
//     `.lpn-lbl-hit`) that is the topmost answer for two pixels or fewer. Those elements draw
//     nothing, so anywhere one of them is the whole of a run is a cursor change with no ink under
//     it, which is Tom's report exactly.
//   * a SLIT -- a run of two pixels or fewer whose two neighbours are the SAME element, i.e. a
//     hairline cut through one object's own answer.
// A run of bare map between two DIFFERENT objects that touch is neither, and is deliberately not
// failed: that is two drawn things abutting, and the arithmetic of a curve against a polygon
// leaves one or two pixels of ground between them. It is printed.
//
// **THREE ZOOMS, BECAUSE THE SIGNATURE WAS ZOOM-DEPENDENT.** Tom, on the offset he measured:
// *"its offset from the link in px increases as I zoom in ... 4 widths away from the link.
// Zoomed out, it may be only 1/2 width away."* An offset that moves while the drawn object does
// not is a length in WORLD units where a screen one was meant, so a single-zoom sweep would have
// found one island and said nothing about its cause. The wheel is anchored ON the object, so the
// object stays under the pointer and the walk starts from the same ink at every zoom.
//
// **MEASURED 2026-09-10 AND FOUND NOTHING**, which is why the mutation below exists: 1.4 million
// samples over the whole canvas at 1 px on the XY Basic, the XY Net3 and the geographic Net3, at
// four zooms, in Chromium AND in Playwright's Firefox, plus a 1.6-million-sample sub-pixel raster
// at 0.25 px over a 400 x 400 window round one junction at 2.66x -- no phantom and no slit
// anywhere. A check that passes by finding nothing is the shape that has already died of success
// in this suite once, so the last section injects a real one and requires this walk to name it.
const TOM_SYMBOL_PX = 100, TOM_LINK_PX = 30;
const HIT_ONLY = ['lpn-node-hit', 'lpn-link-hit', 'lpn-link-symbol-hit', 'lpn-lbl-hit'];
const ISLAND_PX = 2;

// A Settings row is found by its own language KEY, never by its English (harness_wording_check.php).
async function setSettingNumber(a, label, value) {
	const got = await a.page.evaluate(([label, v]) => {
		for (const r of document.querySelectorAll('#lpn_setbox_content .lpn-set-row')) {
			if (r.textContent.indexOf(label) < 0) { continue; }
			const inp = r.querySelector('input[type=number]');
			if (!inp) { continue; }
			inp.value = String(v);
			inp.dispatchEvent(new Event('change', { bubbles: true }));
			return true;
		}
		return false;
	}, [label, value]);
	if (!got) { throw new Error(`no Settings number row saying "${label}"`); }
}
async function setSettingCheck(a, label, on) {
	const got = await a.page.evaluate(([label, v]) => {
		for (const r of document.querySelectorAll('#lpn_setbox_content .lpn-set-row')) {
			if (r.textContent.indexOf(label) < 0) { continue; }
			const inp = r.querySelector('input[type=checkbox]');
			if (!inp) { continue; }
			if (inp.checked !== v) { inp.click(); }
			return true;
		}
		return false;
	}, [label, on]);
	if (!got) { throw new Error(`no Settings checkbox row saying "${label}"`); }
}
async function applyTomSetup(a) {
	await a.toolbarClick('Settings');
	await a.settle(400);
	await setSettingNumber(a, await a.lang('lpn_settings_symbol_size'), TOM_SYMBOL_PX);
	await a.settle(250);
	await setSettingNumber(a, await a.lang('lpn_settings_link_width'), TOM_LINK_PX);
	await a.settle(250);
	await setSettingCheck(a, await a.lang('lpn_settings_color_thematic'), true);
	await a.settle(400);
	// The box lies over the canvas, and a popover swallows every probe under it.
	await a.page.keyboard.press('Escape');
	await a.settle(250);
	await a.page.evaluate(() => {
		const b = document.querySelector('#lpn_setbox .lpn-popover-close');
		if (b) { b.click(); }
	});
	await a.settle(600);
}

// The drawn centre of the object of this kind nearest the middle of the canvas.
async function spotOf(a, kind) {
	return a.page.evaluate((kind) => {
		const svg = document.getElementById('lpn_canvas');
		const b = svg.getBoundingClientRect();
		const sel = kind === 'pump' || kind === 'valve' ? '.lpn-link-symbol-' + kind : '.lpn-node-' + kind;
		let best = null;
		[...svg.querySelectorAll(sel)].forEach((n) => {
			const r = n.getBoundingClientRect();
			if (!(r.width > 0) || r.x < b.x || r.right > b.right || r.y < b.y || r.bottom > b.bottom) { return; }
			const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
			const d = Math.hypot(cx - (b.x + b.width / 2), cy - (b.y + b.height / 2));
			if (!best || d < best.d) { best = { x: cx, y: cy, d: d, id: n.dataset.node || n.dataset.link || kind }; }
		});
		return best;
	}, kind);
}
// The wheel is anchored at the pointer, so zooming ON the object leaves it where it was.
async function zoomOn(a, at, notches) {
	await a.page.mouse.move(at.x, at.y);
	for (let i = 0; i < notches; i++) { await a.page.mouse.wheel(0, -100); await a.page.waitForTimeout(45); }
	await a.settle(800);
}

// One bearing, one pixel at a time: the element the browser hits and the cursor it computes.
// `document.elementFromPoint` is the same hit test the cursor is resolved from, which is what lets
// this answer the question at all.
// **`step` IS ONE DEVICE PIXEL, WHICH AT A FRACTIONAL RATIO IS A FRACTIONAL CSS ONE.** At device
// pixel ratio 1.25 -- Windows' own 125% display scaling -- the only positions a real pointer can
// occupy are multiples of 0.8 CSS px, and a walk at 1 samples none of them but the whole ones. So
// the step is passed in, and a run's width is counted in SAMPLES rather than in CSS pixels, which
// keeps ISLAND_PX meaning "one or two of the pixels the screen actually has".
async function walkRuns(a, at, upto, step) {
	return a.page.evaluate(([at, upto, step]) => {
		const B = [[1, 0, 'E'], [0.7071, 0.7071, 'SE'], [0, 1, 'S'], [-0.7071, 0.7071, 'SW'],
			[-1, 0, 'W'], [-0.7071, -0.7071, 'NW'], [0, -1, 'N'], [0.7071, -0.7071, 'NE']];
		const svg = document.getElementById('lpn_canvas');
		const box = svg.getBoundingClientRect();
		const name = (el) => {
			if (!el) { return '(nothing)'; }
			if (el === svg) { return 'bare map'; }
			if (!svg.contains(el)) { return 'off the map: ' + (el.id || el.tagName.toLowerCase()); }
			const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter((c) => /^lpn-/.test(c));
			return el.tagName.toLowerCase() + (cls.length ? '.' + cls.join('.') : '')
				+ (el.dataset && (el.dataset.node || el.dataset.link) ? ' [' + (el.dataset.node || el.dataset.link) + ']' : '');
		};
		const out = [];
		B.forEach(([dx, dy, bearing]) => {
			const runs = [];
			for (let i = 0; i * step <= upto; i++) {
				const d = i * step;
				const x = at.x + dx * d, y = at.y + dy * d;
				if (x < box.x || y < box.y || x > box.right || y > box.bottom) { break; }
				const el = document.elementFromPoint(x, y);
				const k = name(el) + '|' + (el ? getComputedStyle(el).cursor : '(none)');
				const last = runs[runs.length - 1];
				if (last && last.k === k) { last.to = d; last.n++; continue; }
				runs.push({ k: k, from: d, to: d, n: 1, el: name(el), cursor: el ? getComputedStyle(el).cursor : '(none)',
					cls: el && el.getAttribute ? (el.getAttribute('class') || '') : '' });
			}
			out.push({ bearing: bearing, runs: runs });
		});
		return out;
	}, [at, upto, step || 1]);
}

// The two island shapes, plus the abutments, which are printed and never failed.
function islandsIn(walk, where) {
	const phantom = [], slit = [], abut = [];
	walk.forEach(({ bearing, runs }) => {
		runs.forEach((r, i) => {
			const w = r.n || (r.to - r.from + 1);
			if (w > ISLAND_PX || i === 0 || i === runs.length - 1) { return; }
			// Page furniture lying over the canvas -- the tab strip, the toolbar, the form itself --
			// is not the map and its own borders are not islands in it.
			if ([r, runs[i - 1], runs[i + 1]].some((x) => x.el.indexOf('off the map') === 0)) { return; }
			const line = `${where} ${bearing} ${r.from.toFixed(2)}-${r.to.toFixed(2)}px (${w} sample${w === 1 ? '' : 's'}) ${r.cursor} <${r.el}> between <${runs[i - 1].el}> and <${runs[i + 1].el}>`;
			if (HIT_ONLY.some((c) => (' ' + r.cls + ' ').indexOf(' ' + c + ' ') >= 0)) { phantom.push(line); return; }
			if (runs[i - 1].k === runs[i + 1].k) { slit.push(line); return; }
			abut.push(line);
		});
	});
	return { phantom, slit, abut };
}

// **EACH TYPE IS ZOOMED ON IN ITS OWN RIGHT, AND THAT IS NOT TIDINESS.** A wheel anchored on a
// junction throws the reservoir and the pump off the canvas within a few notches, so one zoom
// sequence for the whole set measures the junction at three scales and the other two at one -- and
// a check that quietly stops asking is this suite's own named failure. So the view is re-fitted per
// type and the wheel is put over THAT object.
async function huntIslands(a, report, where, kinds, upto, notches, step, quiet) {
	let phantom = [], slit = [], abut = 0;
	for (const kind of kinds) {
		if (notches) {
			await a.toolbarClick('Zoom to fit');
			await a.settle(700);
			const seed = await spotOf(a, kind);
			if (seed) { await zoomOn(a, seed, notches); }
		}
		const at = await spotOf(a, kind);
		if (!at) { report.note(`${where}: no ${kind} inside the canvas -- not walked`); continue; }
		const walk = await walkRuns(a, at, upto, step);
		if (!quiet) {
			walk.forEach(({ bearing, runs }) => {
				report.note(`${where} ${kind} ${at.id} ${bearing}: ` + runs
					.map((r) => `${r.from.toFixed(2)}-${r.to.toFixed(2)}px ${r.cursor} <${r.el}>`).join(' | '));
			});
		}
		const f = islandsIn(walk, `${where} ${kind} ${at.id}`);
		phantom = phantom.concat(f.phantom);
		slit = slit.concat(f.slit);
		abut += f.abut.length;
		if (!quiet) { f.abut.forEach((l) => report.note('   two objects touch, one or two pixels of map between them: ' + l)); }
	}
	return { phantom, slit, abut };
}

// ---- THE DEVICE PIXEL RATIO SWEEP, AND WHAT IT MEASURED (2026-09-10) ------------------------
//
// Tom bisected the environment himself, which is the one thing this runner could not do for him:
// *"I don't get the flicker on another laptop I have."* / Chrome 152 on Windows / *"Windows scale
// 125%. Issue goes away when I change to 100%. Distances change if I go to 150%."* So the variable
// named was a FRACTIONAL device pixel ratio -- 125% is 1.25, and it is the out-of-the-box setting
// on a great many laptops rather than an exotic one.
//
// Playwright can set it: `deviceScaleFactor` on the CONTEXT, which is why `Session.open()` grew a
// third argument. The prediction under test was that islands appear at 1.25 and 1.5 and not at 1
// or 2, because a fractional ratio puts an element's edges between device pixels while an integer
// one does not.
//
// **THE PREDICTION DID NOT HOLD, AND THE NEGATIVE RESULT IS SHARP RATHER THAN VAGUE.** Walking at
// ONE DEVICE PIXEL -- 0.8 CSS px at 1.25, the only positions a real pointer can occupy there -- the
// runs are the SAME at 1, 1.25, 1.5 and 2: the same elements, in the same order, at the same
// distances to within the sampling step. On the Basic example under Tom's own settings there is no
// phantom and no slit at any ratio; on the GEOGRAPHIC Net3 at those settings there are one- and
// two-pixel runs of `.lpn-link-symbol-hit`, and they are the DECLARED 2 px slop (BAND_SLOP_PX,
// Tom's own ruling of 2026-09-10) appearing at the edge of a volute -- present at ratio 1 exactly
// as at 1.25, which is the whole point. `document.elementFromPoint` is what the cursor is resolved
// from and Blink computes it in LayoutUnits, which are CSS-relative, so the ratio is not in that
// arithmetic at all. Two further measurements from the same sitting, both
// worth not repeating: a hidden label's grab shape (`.lpn-lbl-hit`, `visibility: hidden` plus
// `pointer-events: visibleFill`) answered ZERO of 108,009 probes over its own box at 1.25 and zero
// at every other ratio, so `visibility` does not leak a hit at a fractional ratio; and a walk
// compared against a REAL SCREENSHOT (`lib/png.js`) put no uniform halo round anything -- the ink
// reaches further than the hit answer on the median bearing at every ratio and every zoom.
//
// **WHAT THAT LEAVES, SAID PLAINLY.** The sweep below emulates the ratio the way a page sees it
// (`window.devicePixelRatio` really is 1.25) and drives the mouse through CDP in CSS pixels. What
// it cannot drive is the OS INPUT PATH -- a Windows mouse delivers a position in physical device
// pixels and Chrome divides it by the scale factor before anything on this page sees it. If the
// artefact lives there, it is not reachable from a headless run at all, and it is not ours. This
// section therefore REPORTS the four ratios side by side and asserts only what the tree is
// expected to hold (no phantom, no slit), which is README's rule about asserting versus reporting.
const DPR_SWEEP = [1, 1.25, 1.5, 2];
async function dprSweep(browser, report, card, where) {
	const rows = [];
	for (const dpr of DPR_SWEEP) {
		const a = await example(browser, card, { deviceScaleFactor: dpr });
		try {
			// **THE SWEEP MUST PROVE IT VARIED THE THING IT NAMES.** A `deviceScaleFactor` that
			// silently did not apply would give four identical runs and read as a clean result,
			// which is this suite's own named failure shape.
			const got = await a.page.evaluate(() => window.devicePixelRatio);
			await applyTomSetup(a);
			let phantom = [], slit = [], abut = 0;
			for (const notches of [0, 12]) {
				const f = await huntIslands(a, report, `${where} dpr ${dpr}, ${notches} notches`,
					['junction', 'reservoir', 'pump'], 320, notches, 1 / dpr, true);
				phantom = phantom.concat(f.phantom);
				slit = slit.concat(f.slit);
				abut += f.abut;
			}
			rows.push({ dpr, got, phantom, slit, abut });
		} finally { await a.close(); }
	}
	return rows;
}

// The 1 px island machine, exported so a DPR sweep can drive it without re-running the section.
exports.applyTomSetup = applyTomSetup;
exports.huntIslands = huntIslands;
exports.walkRuns = walkRuns;
exports.islandsIn = islandsIn;
exports.spotOf = spotOf;
exports.zoomOn = zoomOn;

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
			if (cls === '.lpn-node-hit') { nb = await bandReach(geo, 'circle.lpn-node-hit'); }
			report.ok(r.seen > 0 && r.seen === r.of, `geographic: every ${name} on the map was measured`,
				`${r.seen} of ${r.of} ${cls}`);
			if (!r.seen) { continue; }
			// The general property, and the one that holds for a rect as well as a disc: a bounding
			// box CONTAINS its shape, so anything answering outside its own box is reach the drawing
			// does not show.
			const cap = cls === '.lpn-node-hit' ? allowed('circle.lpn-node-hit') : allowed('path.lpn-link-symbol-hit');
			report.ok(r.worstBox.over <= cap, `geographic: a ${name} answers only inside its own box, plus its declared slop`,
				`furthest: ${cls} ${r.worstBox.id} answered ${r.worstBox.over.toFixed(0)} px outside it, allowed ${cap}`);
		}
		// The acceptance test in its own words, and it is only askable of a DISC -- so since Task 618
		// it is asked of `circle.lpn-node-hit` alone, which is a junction, whose symbol IS a disc. A
		// reservoir's band is its triangle now and its corner is legitimately further from the centre
		// than its sides are; that is measured by shape below, and by the box test above, which is
		// the one every band takes.
		report.ok(nb.worstCentre.over <= allowed('circle.lpn-node-hit'),
			'geographic: no junction band answers further from its centre than it is drawn, plus its slop',
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

		// ---- TASK 618, on the drawing where a stray pixel of reach is thousands of world units ---
		const gm = await inkVsHit(geo);
		tellShape(report, 'geographic (EPANET Net3, lat/lon)', gm);
		assertShape(report, 'geographic', gm);
		assertSymbolClicks(report, 'geographic', await clickSymbols(geo));

		// REPORTED, not asserted — a different mechanism, and not fixed. See the header.
		const txt = Object.keys(s.by).filter(k => /^(text|tspan)\./.test(k));
		const worstTxt = txt.reduce((m, k) => Math.max(m, s.by[k].max), 0);
			report.note(`label text answers up to ${worstTxt.toFixed(0)} px outside its own box here -- it was 271 px until specs/lblhit.js moved the grab area off the glyphs, and no text should answer at all now`);
	} finally { await geo.close(); }

	// ---- the XY project, which is where the same fault was 11 px and invisible -------------------
	// **AND IT IS TOM'S OWN TEST CASE FOR TASK 618**: *"My test case is trying to select pump
	// volutes while zoomed to fit on Net3."*
	const xy = await example(browser, 'EPANET Net3E');
	try {
		const s = await sweep(xy);
		tell(report, 'XY (EPANET Net3) at zoom to fit', s);
		assertHealthy(report, 'XY', s);

		const m = await inkVsHit(xy);
		tellShape(report, 'XY (EPANET Net3)', m);
		assertShape(report, 'XY', m);
		assertSymbolClicks(report, 'XY', await clickSymbols(xy));

		// **AND ZOOMED IN, BECAUSE THAT IS HOW TOM RULED OUT OVERLAP** (2026-09-10: *"I zoomed in to
		// eliminate this variable. Valve and pump are holes, not just non-existent. Even link
		// disappears under them."*). At the fit zoom a pump sits inside its own end nodes' reach, so
		// a fix that only works there is a fix for the wrong thing; zoomed in the symbols stand
		// alone and the answer has to be the same.
		await zoomIn(xy, 3);
		const mz = await inkVsHit(xy);
		tellShape(report, 'XY (EPANET Net3), zoomed in', mz);
		assertShape(report, 'XY zoomed in', mz);
		assertSymbolClicks(report, 'XY zoomed in', await clickSymbols(xy));
	} finally { await xy.close(); }

	// ---- a drawing with VALVES on it, which Net3 has none of ------------------------------------
	// Tom reported the valve first and the pump second, in the same words -- *"It is hidden from the
	// mouse"*, then *"They are identical to valve. No wonder! There is no presence!"* -- and they
	// share one code path, so the valve needs a drawing of its own to be asserted on at all.
	// The card is asked for by KEY, never by its English (harness_wording_check.php): the title is a
	// shipped string and a rewording of it must not turn this into a red build.
	const elm = await example(browser, { key: 'lpn_ex_elm_street_title' });
	const WHERE = 'the valve example';
	try {
		const m = await inkVsHit(elm);
		tellShape(report, WHERE, m);
		assertShape(report, WHERE, m);
		const clicks = await clickSymbols(elm);
		report.ok(clicks.some(c => c.type === 'valve'), `${WHERE}: there are valves here to click`,
			clicks.map(c => c.type).join(', ') || 'none');
		assertSymbolClicks(report, WHERE, clicks);
	} finally { await elm.close(); }
// ---- TOM'S 2026-09-10 SETUP: THE 1 px ISLAND HUNT -------------------------------------------
	const tom = await example(browser, { key: 'lpn_ex_basic_us_title' });
	try {
		await applyTomSetup(tom);
		for (const notches of [0, 6, 12]) {
			const where = `100/30 thematic, ${notches} wheel notches in`;
			const f = await huntIslands(tom, report, where, ['junction', 'reservoir', 'pump'], 320, notches);
			report.ok(f.phantom.length === 0, `${where}: no invisible band is the whole of a run`,
				f.phantom.length ? f.phantom.join(' ;; ') : `none on eight bearings, ${f.abut} abutments printed`);
			report.ok(f.slit.length === 0, `${where}: nothing cuts a hairline slit through one object's answer`,
				f.slit.length ? f.slit.join(' ;; ') : 'none on eight bearings');
		}

		// **A LIVE MUTATION, BECAUSE THIS SECTION PASSES BY FINDING NOTHING.** It plants exactly the
		// thing Tom described -- one transparent circle round a junction, `visibleStroke` with a
		// one-screen-pixel stroke, so its INTERIOR answers nothing and its OUTLINE answers as an
		// invisible ring at a radius the drawing does not show. The walk must name it, and must stop
		// naming it when it is taken away.
		await tom.toolbarClick('Zoom to fit');
		await tom.settle(700);
		const seed = await spotOf(tom, 'junction');
		const planted = await tom.page.evaluate((id) => {
			const svg = document.getElementById('lpn_canvas');
			const g = svg.querySelector('g');
			const m = (g.getAttribute('transform') || '').match(/scale\(([-\d.e+]+)\)/);
			const s = m ? +m[1] : 1;
			const c = svg.querySelector('.lpn-node[data-node="' + CSS.escape(id) + '"]');
			if (!c) { return false; }
			const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			ring.setAttribute('class', 'lpn-node-hit');
			ring.setAttribute('id', 'lpn_mutation_ring');
			ring.setAttribute('cx', c.getAttribute('cx'));
			ring.setAttribute('cy', c.getAttribute('cy'));
			ring.setAttribute('r', (+c.getAttribute('r')) + 60 / s);
			ring.setAttribute('style', 'pointer-events:visibleStroke;fill:none;stroke:transparent;stroke-width:' + (1 / s));
			g.appendChild(ring);
			return true;
		}, seed && seed.id);
		report.ok(planted, 'the mutation ring was planted round a junction');
		const withRing = islandsIn(await walkRuns(tom, seed, 320), 'mutation');
		report.ok(withRing.phantom.length > 0, 'the walk NAMES a planted one-pixel invisible ring',
			withRing.phantom.length ? withRing.phantom[0] : 'it found nothing, so this section proves nothing');
		await tom.page.evaluate(() => {
			const r = document.getElementById('lpn_mutation_ring');
			if (r) { r.remove(); }
		});
		const without = islandsIn(await walkRuns(tom, seed, 320), 'mutation removed');
		report.ok(without.phantom.length === 0, '...and stops naming it the moment it is taken away',
			without.phantom.length ? without.phantom.join(' ;; ') : 'clean');
	} finally { await tom.close(); }

	// ---- THE SAME HUNT AT FOUR DEVICE PIXEL RATIOS -----------------------------------------------
	// See the header block above dprSweep() for what this measured and what it rules out. The rows
	// are printed side by side because the comparison IS the result: four ratios, one answer.
	// NOT `sweep`: that is this file's own grid-sweep function, and a `const` of the same name
	// shadows it for the whole of this function -- including the call twenty lines above it.
	const dprRows = await dprSweep(browser, report, { key: 'lpn_ex_basic_us_title' }, 'basic');
	report.note('the island hunt at four device pixel ratios, walking one DEVICE pixel at a time:');
	report.note('   ratio   page says   phantom   slit   abutments');
	dprRows.forEach((r) => report.note(
		`   ${String(r.dpr).padEnd(7)} ${String(r.got).padEnd(11)} ${String(r.phantom.length).padStart(7)} ${String(r.slit.length).padStart(6)} ${String(r.abut).padStart(11)}`));
	dprRows.forEach((r) => {
		report.ok(r.got === r.dpr, `device pixel ratio ${r.dpr} really was applied`,
			`window.devicePixelRatio is ${r.got}`);
		report.ok(r.phantom.length === 0, `dpr ${r.dpr}: no invisible band is the whole of a run`,
			r.phantom.length ? r.phantom.join(' ;; ') : `none on eight bearings at two zooms, ${r.abut} abutments`);
		report.ok(r.slit.length === 0, `dpr ${r.dpr}: nothing cuts a hairline slit through one object's answer`,
			r.slit.length ? r.slit.join(' ;; ') : 'none on eight bearings at two zooms');
	});
	// **THE FOUR RATIOS MUST AGREE, WHICH IS THE ACTUAL FINDING AND NOT A BY-PRODUCT.** If a future
	// change makes a fractional ratio behave differently from an integer one, that is exactly the
	// class of defect Tom reported and this is the line that would say so.
	const shapes = dprRows.map((r) => `${r.phantom.length}/${r.slit.length}`);
	report.ok(shapes.every((x) => x === shapes[0]),
		'a fractional device pixel ratio finds the same islands an integer one does',
		shapes.map((x, i) => `${DPR_SWEEP[i]}: ${x}`).join(', '));
};
