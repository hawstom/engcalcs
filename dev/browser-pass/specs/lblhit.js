// §42 — a label is grabbed by a shape, and the shape is where the words are.
//
// **THE DEFECT, MEASURED BEFORE ANYTHING WAS CHANGED** (Tom, 2026-09-09, on being shown it:
// *"Label text answers hits up to 271 px: Yes! This is it! High priority task."*). On the lat/lon
// Net3 example at zoom to fit, 8,431 px per world unit, over 22,823 sample points of a 1398x798
// canvas:
//
//     tspan (no class)                       8,247 samples, up to 271.5 px outside its own box
//     text.lpn-lbl .lpn-draglbl              1,074 samples, up to 145.9 px
//     tspan.lpn-min                            361 samples, up to 125.1 px
//     bare canvas                            6,906 samples
//     ...and NOT ONE of the 97 node hit bands was the topmost answer anywhere on the canvas.
//
// **IT IS NOT THE STROKE WIDTH, WHICH IS THE FAULT ONE DAY OLDER** (specs/nodehit.js, where
// `pointer-events: visible` hit-tested an undeclared 1-USER-UNIT stroke perimeter). Setting
// `stroke-width` on `.lpn-lbl` moves this by nothing. Three measurements taken at the same
// 8,431 px/unit pin it on TEXT LAYOUT instead, and section 0 below re-takes all three every run:
//
//     a <rect> of the label's own box, same layer, visibleFill      0 px outside its box
//     a <path> of the same box, same layer, visibleFill             0 px
//     the same words in a group scaled to SCREEN pixels             0 px
//     the XY drawing at 23 px/unit, where the same quantum is 0.36 px   under 2 px
//
// So an SVG text's hit geometry is laid out in its OWN local user units at LayoutUnit precision,
// and a label's font-size is a pixel size divided by the scale -- 0.0013 user units against a
// 1/64-user-unit grid, which at this scale is 132 screen pixels per quantum. That is why the fault
// is geographic and why the XY drawing is the control: any explanation that does not predict ~0
// there is wrong.
//
// THE CURE IS `.lpn-lbl-hit` -- one transparent <path> per label, one subpath per ROW, carrying the
// label's own data-* identity, with the words themselves left at `pointer-events: none`. The rows
// are the shrink-wrap Tom asked for (*"maybe we will make their hitbox more aggressively
// shrink-wrapped"*): a stacked label's short rows no longer claim the ground beside them. The gaps
// BETWEEN the glyphs stay grabbable, which is the promise `pointer-events: visible` used to make
// and the reason it was never `visiblePainted` -- a finger is not aimed at the inside of an "8".
//
// hitConfirmed() in js/looped-network.js is untouched. Section 4 counts what it still rejects.

const { Session } = require('../lib/session');

exports.title = '42. A label is grabbed by a shape, not by its glyphs';

// Open one gallery example and fit it. A FRESH session name every time: a Session profile persists
// between runs, and a profile that has already waved the gallery away never opens it again.
async function example(browser, match) {
	const a = await Session.open(browser, 'lblhit-' + match.replace(/\W+/g, '') + '-' + Date.now());
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

// **EVERY SAMPLE IS ACCOUNTED FOR** — nodehit.js's rule, for the same reason: the consent banner and
// the colour legend lie over parts of the canvas, and a silent filter would let the sweep shrink to
// nothing and still read as a pass. So a probe that answers with something outside the SVG is
// counted as `overlay` rather than dropped, and the three counts add up to the total.
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

// The decisive question, asked of the labels themselves rather than of a grid: how far OUTSIDE its
// own getBoundingClientRect does each label answer? A grid cannot ask it — a label that has been
// fixed occupies a few dozen pixels and a 7 px grid may miss a whole row of it — so this walks
// outward from each label's own centre on eight bearings, which puts samples exactly where the
// fault was.
//
// **elementsFromPoint, THE PLURAL, WHICH IS WHAT mapHitAt() ITSELF WALKS**, and a tspan is resolved
// to its parent <text> the way resolveLabelHit() does: the singular call would measure whatever is
// on top rather than the element being asked about.
async function labelReach(a, limit = 900) {
	return a.page.evaluate((lim) => {
		const svg = document.getElementById('lpn_canvas');
		const b = svg.getBoundingClientRect();
		// The words AND their grab shapes: whichever of them answers, it must answer where it is.
		const els = [...svg.querySelectorAll('text.lpn-draglbl, path.lpn-lbl-hit')];
		const B = [[1, 0], [0, 1], [-1, 0], [0, -1], [0.707, 0.707], [-0.707, 0.707], [0.707, -0.707], [-0.707, -0.707]];
		// The walk stops 40 px past the last hit — nodehit.js's own bound, and safe for the same
		// reason: a quantised text region and a filled path are both continuous outward from the
		// element, so the reach they produce is reachable a step at a time.
		const GAP = 40;
		let of = 0, seen = 0, grabbable = 0, worst = { over: -1, what: null };
		els.forEach(el => {
			const r = el.getBoundingClientRect();
			if (!(r.width > 0) || getComputedStyle(el).visibility === 'hidden') { return; }
			of++;
			const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
			let far = -1, farBox = -1;
			B.forEach(([ux, uy]) => {
				for (let d = 0; d <= lim; d += 2) {
					const x = cx + ux * d, y = cy + uy * d;
					if (x < b.x || y < b.y || x > b.right || y > b.bottom) { break; }
					if (d - far > GAP && far >= 0) { break; }
					const list = document.elementsFromPoint(x, y) || [];
					if (!list.some(n => n === el || n.parentNode === el)) { continue; }
					far = d;
					const ob = Math.hypot(Math.max(r.left - x, x - r.right, 0), Math.max(r.top - y, y - r.bottom, 0));
					if (ob > farBox) { farBox = ob; }
				}
			});
			if (far < 0) { return; }
			seen++;
			if (farBox > worst.over) {
				worst = { over: farBox, what: el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || ''),
					id: el.dataset.nodelbl || el.dataset.linklbl || el.dataset.lbl || null };
			}
		});
		// **AND THE OTHER HALF OF THE TRADE: a label must still be pickable.** Every visible label's
		// own box is sampled on a 4 px grid and a sample counts only when the topmost thing under it
		// carries THAT label's identity.
		//
		// **A SHARE, NOT A CENTRE POINT.** The shape is one subpath per ROW at that row's own width,
		// so a stacked data label whose first row is the id ("10", 14 px) and whose widest row is a
		// result ("Qb=0.00 P=-0.4", 56 px) does NOT answer at the middle of its bounding box -- and
		// must not, since that is the empty ground beside a short row that this change exists to
		// give back. The property worth asserting is that a label answers SOMEWHERE, over a real
		// fraction of itself; the fraction is reported so the shrink-wrap is on the record.
		const words = [...svg.querySelectorAll('text.lpn-draglbl')];
		let asked = 0, coverage = 0;
		words.forEach(t => {
			const r = t.getBoundingClientRect();
			if (!(r.width > 0) || getComputedStyle(t).visibility === 'hidden') { return; }
			asked++;
			const id = t.dataset.nodelbl || t.dataset.linklbl || t.dataset.lbl;
			let hits = 0, pts = 0;
			for (let y = r.top + 2; y < r.bottom; y += 4) {
				for (let x = r.left + 2; x < r.right; x += 4) {
					if (x < b.x || y < b.y || x > b.right || y > b.bottom) { continue; }
					const list = document.elementsFromPoint(x, y) || [];
					// **A SAMPLE UNDER PAGE FURNITURE IS NOT A SAMPLE OF THE MAP**, and this is the
					// sweep's own `overlay` rule stated per label: the consent banner lies over the
					// bottom of the canvas, and on a fresh profile ELEVEN of the 67 visible labels
					// are entirely beneath it. Counting those as ungrabbable would fail this on the
					// banner rather than on the geometry.
					if (!list.length || !svg.contains(list[0])) { continue; }
					pts++;
					for (const n of list) {
						if (!svg.contains(n) || n === svg) { break; }
						const ds = n.dataset || {};
						if ((ds.nodelbl || ds.linklbl || ds.lbl) === id) { hits++; break; }
					}
				}
			}
			// A label with nothing left to sample is neither a pass nor a failure; it is not on the
			// map as far as a pointer is concerned.
			if (!pts) { asked--; return; }
			if (hits > 0) { grabbable++; }
			coverage += hits / pts;
		});
		return { of, seen, worst, asked, grabbable, coverage: asked ? coverage / asked : 0 };
	}, limit);
}

// **THE THREE CONTROL MEASUREMENTS THAT ESTABLISH THE MECHANISM**, re-taken every run rather than
// quoted from the header: a rect, a path and a screen-scaled text, all drawn at the label's own
// place in the label layer at the very scale the fault appears at. Cleaned up before returning, so
// nothing this leaves behind can be measured by the sections after it.
async function controls(a) {
	return a.page.evaluate(() => {
		const NS = 'http://www.w3.org/2000/svg';
		const svg = document.getElementById('lpn_canvas');
		const b = svg.getBoundingClientRect();
		const s = +(svg.querySelector('g').getAttribute('transform') || '').match(/scale\(([-\d.e+]+)\)/)[1];
		const t0 = svg.querySelector('text.lpn-draglbl');
		const bb = t0.getBBox();
		function reach(el, self) {
			const r = el.getBoundingClientRect();
			if (!(r.width > 0)) { return -1; }
			const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
			let far = -1;
			[[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([ux, uy]) => {
				for (let d = 0; d <= 800; d += 3) {
					const x = cx + ux * d, y = cy + uy * d;
					if (x < b.x || y < b.y || x > b.right || y > b.bottom) { break; }
					const list = document.elementsFromPoint(x, y) || [];
					if (!list.some(n => n === el || (self && n.parentNode === el))) { continue; }
					const ob = Math.hypot(Math.max(r.left - x, x - r.right, 0), Math.max(r.top - y, y - r.bottom, 0));
					if (ob > far) { far = ob; }
				}
			});
			return +far.toFixed(1);
		}
		const made = [];
		function add(el) { t0.parentNode.appendChild(el); made.push(el); return el; }
		const rect = add(document.createElementNS(NS, 'rect'));
		rect.setAttribute('x', bb.x); rect.setAttribute('y', bb.y);
		rect.setAttribute('width', bb.width); rect.setAttribute('height', bb.height);
		rect.setAttribute('style', 'fill:transparent;stroke:none;pointer-events:visibleFill');
		const path = add(document.createElementNS(NS, 'path'));
		path.setAttribute('d', 'M' + bb.x + ',' + bb.y + 'h' + bb.width + 'v' + (bb.height / 2) + 'h' + (-bb.width) + 'Z');
		path.setAttribute('style', 'fill:transparent;stroke:none;pointer-events:visibleFill');
		const g = add(document.createElementNS(NS, 'g'));
		g.setAttribute('transform', 'translate(' + (bb.x + bb.width * 1.4) + ',' + bb.y + ') scale(' + (1 / s) + ')');
		const txt = document.createElementNS(NS, 'text');
		txt.setAttribute('style', 'font-size:11px;pointer-events:visible;fill:none');
		txt.setAttribute('x', 0); txt.setAttribute('y', 11);
		txt.textContent = 'CONTROL';
		g.appendChild(txt);
		const out = { rect: reach(rect, false), path: reach(path, false), screenText: reach(txt, true),
			fontUserUnits: parseFloat(getComputedStyle(t0).fontSize), layoutUnitPx: s / 64, scale: s };
		made.forEach(e => e.remove());
		return out;
	});
}

// **THE LIVE MUTATION.** A check that passes by finding nothing is the shape that has already died
// of success in this tree once, so the defect is put back — one declaration, exactly the one that
// was removed — and the measurement above must NAME it. Removed again immediately; nothing after
// this runs against a mutated page.
async function mutate(a) {
	return a.page.evaluate(async () => {
		const svg = document.getElementById('lpn_canvas');
		const st = document.createElementNS('http://www.w3.org/2000/svg', 'style');
		st.textContent = '#lpn_canvas .lpn-draglbl { pointer-events: visible !important; }';
		svg.appendChild(st);
		const b = svg.getBoundingClientRect();
		const els = [...svg.querySelectorAll('text.lpn-draglbl')];
		let worst = -1;
		for (const el of els.slice(0, 25)) {
			const r = el.getBoundingClientRect();
			if (!(r.width > 0) || getComputedStyle(el).visibility === 'hidden') { continue; }
			const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
			for (const [ux, uy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
				for (let d = 0; d <= 600; d += 4) {
					const x = cx + ux * d, y = cy + uy * d;
					if (x < b.x || y < b.y || x > b.right || y > b.bottom) { break; }
					const list = document.elementsFromPoint(x, y) || [];
					if (!list.some(n => n === el || n.parentNode === el)) { continue; }
					const ob = Math.hypot(Math.max(r.left - x, x - r.right, 0), Math.max(r.top - y, y - r.bottom, 0));
					if (ob > worst) { worst = ob; }
				}
			}
		}
		st.remove();
		return +worst.toFixed(1);
	});
}

// **WHAT hitConfirmed() STILL CATCHES.** It is the safety net that made the 271 px harmless for
// SELECTION, and it is deliberately NOT removed in the same change as the geometry. This counts, on
// a real sweep, how many candidates in the elementsFromPoint stack sit outside their own box —
// which is exactly what that guard rejects. A number, never a verdict: whether a net that catches
// nothing should come out is a separate decision.
async function guardWork(a, step = 11) {
	return a.page.evaluate((st) => {
		const svg = document.getElementById('lpn_canvas');
		const b = svg.getBoundingClientRect();
		const SLOP = 2;
		let candidates = 0, rejected = 0, worst = 0, worstWhat = null;
		for (let y = Math.ceil(b.y) + 5; y < b.y + b.height; y += st) {
			for (let x = Math.ceil(b.x) + 5; x < b.x + b.width; x += st) {
				const list = document.elementsFromPoint(x, y) || [];
				for (const raw of list) {
					if (raw === svg || !svg.contains(raw)) { break; }
					const t = (raw.tagName.toLowerCase() === 'tspan' && raw.parentNode) ? raw.parentNode : raw;
					candidates++;
					const r = t.getBoundingClientRect();
					if (!(r.width > 0 || r.height > 0)) { continue; }
					const d = Math.hypot(Math.max(r.left - x, x - r.right, 0), Math.max(r.top - y, y - r.bottom, 0));
					if (d > SLOP) {
						rejected++;
						if (d > worst) { worst = d; worstWhat = t.tagName.toLowerCase() + '.' + (t.getAttribute('class') || ''); }
					}
				}
			}
		}
		return { candidates, rejected, worst: +worst.toFixed(1), worstWhat };
	}, step);
}

function tell(report, label, s) {
	report.note(`${label}: scale ${s.scale && s.scale.toFixed(2)} px/unit, ${s.inSvg} samples in the map, ${s.overlay} under page furniture, ${s.bare} bare canvas`);
	report.note(`   cursor: ${Object.keys(s.cursor).map(k => `${k} ${(100 * s.cursor[k] / s.inSvg).toFixed(1)}%`).join(', ')}`);
	Object.keys(s.by).sort((p, q) => s.by[q].n - s.by[p].n).forEach(k => {
		report.note(`   ${String(s.by[k].n).padStart(6)}  ${s.by[k].max.toFixed(1).padStart(7)} px outside its own box   ${k}`);
	});
}

// A bounding box CONTAINS its shape, so anything answering outside its own box is reach the drawing
// does not show. Two pixels of slop, which is HIT_SLOP_PX's own figure.
const BOX_SLOP_PX = 3;

function assertLabelsHonest(report, where, s) {
	const labelKeys = Object.keys(s.by).filter(k => /lpn-lbl|^tspan\./.test(k));
	labelKeys.forEach(k => {
		report.ok(s.by[k].max <= BOX_SLOP_PX, `${where}: ${k} answers only inside its own box`,
			`furthest ${s.by[k].max.toFixed(1)} px outside it over ${s.by[k].n} samples`);
	});
	// The words are not the target any more. A `text`/`tspan` in the census means `.lpn-lbl`'s
	// `pointer-events: none` has been overridden again, which is the whole defect coming back.
	const words = Object.keys(s.by).filter(k => /^(text|tspan)\./.test(k));
	report.ok(words.length === 0, `${where}: no label TEXT answers the pointer at all`,
		words.length ? words.join(', ') : 'only .lpn-lbl-hit does');
	report.ok(s.bare / s.inSvg > 0.25, `${where}: bare map answers a substantial share of the canvas`,
		`${s.bare} of ${s.inSvg} samples (${(100 * s.bare / s.inSvg).toFixed(1)}%)`);
}

exports.run = async function ({ browser, report }) {
	// ---- the geographic project, which is where it was user-visible -----------------------------
	const geo = await example(browser, 'lat/lon');
	try {
		// 0. the mechanism, re-measured rather than quoted
		const c = await controls(geo);
		report.note(`geographic: one Blink LayoutUnit (1/64 user unit) is ${c.layoutUnitPx.toFixed(1)} screen px here, against a label font of ${c.fontUserUnits} user units`);
		report.ok(c.scale > 1000, 'the geographic example really is drawn at a very large scale',
			`${c.scale.toFixed(0)} px per world unit`);
		report.ok(c.rect <= BOX_SLOP_PX && c.path <= BOX_SLOP_PX,
			'geometry at this scale is honest: a rect and a path answer only inside their own box',
			`rect ${c.rect} px, path ${c.path} px outside`);
		report.ok(c.screenText <= BOX_SLOP_PX,
			'...and the same WORDS in a screen-scaled group are honest too, which is what makes it text layout',
			`${c.screenText} px outside its own box`);

		// 1. the census
		const s = await sweep(geo);
		tell(report, 'geographic (EPANET Net3, lat/lon) at zoom to fit', s);
		assertLabelsHonest(report, 'geographic', s);

		// 2. the per-label walk, and the trade
		const r = await labelReach(geo);
		report.ok(r.seen > 20, 'geographic: there are labels to measure', `${r.seen} of ${r.of} answered anywhere`);
		report.ok(r.worst.over <= BOX_SLOP_PX, 'geographic: no label answers outside its own box',
			`furthest: ${r.worst.what} ${r.worst.id} answered ${r.worst.over.toFixed(1)} px outside it`);
		report.ok(r.asked > 20 && r.grabbable === r.asked, 'geographic: every visible label is still grabbable',
			`${r.grabbable} of ${r.asked} answer with their own id somewhere inside their own box`);
		report.note(`geographic: a label's grab shape covers ${(100 * r.coverage).toFixed(0)}% of its own bounding box -- the rest is the ground beside its short rows`);

		// 3. the live mutation — put the defect back and require the measurement to name it
		const back = await mutate(geo);
		report.ok(back > 50, 'the measurement above can fail: restoring `pointer-events: visible` brings the reach back',
			`${back} px outside the box with the one declaration back on`);

		// 4. what the safety net still catches (reported, never asserted — see the header)
		const g = await guardWork(geo);
		report.note(`hitConfirmed() would still reject ${g.rejected} of ${g.candidates} candidates on a geographic sweep, worst ${g.worst} px (${g.worstWhat || 'none'})`);
	} finally { await geo.close(); }

	// ---- the XY project, the control: one LayoutUnit is 0.36 px there and the fault is invisible --
	const xy = await example(browser, 'EPANET Net3E');
	try {
		const s = await sweep(xy);
		tell(report, 'XY (EPANET Net3) at zoom to fit', s);
		assertLabelsHonest(report, 'XY', s);
		const r = await labelReach(xy);
		report.ok(r.worst.over <= BOX_SLOP_PX, 'XY: no label answers outside its own box',
			`furthest: ${r.worst.what} ${r.worst.id} answered ${r.worst.over.toFixed(1)} px outside it`);
		report.ok(r.asked > 20 && r.grabbable === r.asked, 'XY: every visible label is still grabbable',
			`${r.grabbable} of ${r.asked}`);
		report.note(`XY: a label's grab shape covers ${(100 * r.coverage).toFixed(0)}% of its own bounding box`);
	} finally { await xy.close(); }
};
