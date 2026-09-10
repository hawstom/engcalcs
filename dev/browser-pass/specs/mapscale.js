// §43 — a geographic example opens on a map you can see and click (MJH, 2026-09-09).
//
// **THE REPORT.** Tom, watching over his son's shoulder: *"the first presenting problem was a
// completely blue map"*, *"his window rubber band was scaled completely wrong"*, *"the project
// became uneditable. In fact, he never once succeeded in editing anything"*, and *"the network never
// disappeared ... The app was broken, but the network was intact."* He was opening the shipped
// examples. It survived a reload and a full Erase-everything, so nothing stored was the cause.
//
// **ALL THREE SYMPTOMS ARE ONE MECHANISM.** Every stroke on this map is a figure in SCREEN PIXELS
// divided by state.s, handed to CSS as a custom property in WORLD units. `css/engcalcs.css` carries
// a fallback for each -- `var(--lpn-sym, 1)`, `var(--lpn-lw, 0.7)`, `var(--lpn-hit, 12)` -- and those
// fallbacks are world units too. On an XY project, at about 1 px per unit, they are the sizes they
// look like. On the lat/lon Net3 example, at 6,479 px per degree, they are 4,535 px of pipe,
// 2,267 px of select-area border and a 77,745 px invisible grab band around every pipe: a canvas
// covered in one colour with nothing on it that can be reached.
//
// So the publish rides setTransform() now (js/looped-network.js, publishScaleSizes()), and this
// spec asks the three questions a user asks, of a REAL browser, on the example they actually open:
// **can I see it, can I click it, and does it stay that way when I zoom?** The stub cannot answer
// any of them -- there is no painting, no computed style and no hit testing in it -- which is why
// dev/lpn-spike/scale-publish-harness.js covers the seam and this covers the screen.
//
// **THE COLOUR CHECK IS A REAL SCREENSHOT**, read by lib/png.js, because "a completely blue map" is
// a claim about pixels and answering it from the DOM would be answering a different question.
//
// Driven in Chromium, which is what this runner has. The engine is not the subject: the whole
// Gecko/LibreWolf half of the investigation is in dev/browser-pass/measure-probe.js, and it found
// the same page behaviour in both engines.

const { Session } = require('../lib/session');
const { readPng, dominantColors, shareNear } = require('../lib/png');

exports.title = '43. A geographic map is visible and clickable at its own scale';

// **BY KEY, NEVER BY WORDING.** The card's heading is a shipped English string, and a spec that
// spells one out turns Tom's next rewording into a red build in a file about hydraulics.
const EXAMPLE_KEY = 'lpn_ex_net3_world_title';

// The world layer's scale, and the four properties every stroke is drawn from.
async function drawing(a) {
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas');
		const world = svg.querySelector('g');
		const m = /scale\(([^)]+)\)/.exec(world.getAttribute('transform') || '');
		const cs = getComputedStyle(svg);
		const link = svg.querySelector('.lpn-link');
		const band = svg.querySelector('.lpn-link-hit, .lpn-link-symbol-hit');
		const num = (p) => parseFloat(cs.getPropertyValue(p));
		return {
			s: m ? parseFloat(m[1]) : null,
			sym: num('--lpn-sym'), lw: num('--lpn-lw'), hit: num('--lpn-hit'), hair: num('--lpn-hair'),
			// **IN SCREEN PIXELS, which is the only unit a reader can judge.** The computed
			// stroke-width is in world units, so this is the multiplication that turns a wrong
			// property into a wrong picture.
			linkPx: link ? parseFloat(getComputedStyle(link).strokeWidth) * (m ? parseFloat(m[1]) : 1) : null,
			bandPx: band ? parseFloat(getComputedStyle(band).strokeWidth) * (m ? parseFloat(m[1]) : 1) : null
		};
	});
}

// What answers a pointer over a 5x5 grid of the canvas. A grab band that has swallowed the map
// answers here and nowhere else: it is transparent, so no screenshot can see it.
async function reachable(a) {
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas');
		const r = svg.getBoundingClientRect();
		const tally = {};
		let onBand = 0, total = 0;
		for (let ix = 1; ix <= 5; ix++) {
			for (let iy = 1; iy <= 5; iy++) {
				const el = document.elementFromPoint(
					Math.round(r.left + r.width * ix / 6), Math.round(r.top + r.height * iy / 6));
				if (!el || !svg.contains(el)) { continue; }
				total++;
				const cls = (el.getAttribute('class') || el.tagName);
				tally[cls] = (tally[cls] || 0) + 1;
				if (/lpn-link-hit|lpn-link-symbol-hit/.test(cls)) { onBand++; }
			}
		}
		return { onBand, total, tally };
	});
}

// **HOW MUCH OF THE CANVAS IS PIPE.** The tile server is blocked here, so the ground is plain white
// and "the commonest colour" would only ever report the background -- the question has to name the
// colour the failure paints. `--lpn-map-ink` is #1a6faf, and it covered 44% of the canvas in the
// Gecko reproduction against about 3% when the map is drawn correctly. The tolerance is wide because
// a pipe is antialiased and the thematic view repaints some of them by value; the MARGIN between 3%
// and 44% is what makes the number decidable at all.
const MAP_INK = '#1a6faf';
async function inkShare(a) {
	const box = await a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x, y: r.y, width: r.width, height: r.height };
	});
	const img = readPng(await a.page.screenshot({ type: 'png' }));
	return { ink: shareNear(img, box, MAP_INK, 24), top: dominantColors(img, box)[0] };
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'mapscale-' + Date.now());
	try {
		// **THE TILE SERVER IS NEVER CALLED**, for specs/basemap.js's two reasons: this pass must not
		// depend on the network, and hammering a free tile service from a test loop is what the OSM
		// usage policy is about. It also makes the colour check HARDER rather than easier -- with no
		// tiles the ground under the network is plain white, so anything painting over it shows up.
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto();
		await a.answerTrainingPanel('MJH').catch(() => {});
		const drawn = await a.openExampleCard(await a.lang(EXAMPLE_KEY));
		report.ok(drawn > 100, 'the lat/lon Net3 example opens and draws its network', drawn + ' elements');

		// ---- the scale, and the four sizes derived from it -------------------------------------
		let d = await drawing(a);
		report.ok(d.s > 1000, 'a geographic project opens at thousands of pixels per degree',
			d.s && d.s.toFixed(1));
		// **A BAND, NOT A NUMBER.** The width a pipe is drawn at is a project SETTING and this spec
		// has no business pinning it: what it is checking is that the figure is in SCREEN pixels at
		// all. A stroke that is 0.7 world units at this scale is 4,535 px, so the two answers are
		// three orders of magnitude apart and no realistic setting sits between them.
		const startPx = d.linkPx;
		report.ok(d.linkPx > 0.5 && d.linkPx < 20,
			'a pipe is drawn at a few SCREEN pixels, not at world units times the scale',
			d.linkPx && d.linkPx.toFixed(3) + ' px');
		report.ok(d.bandPx === null || Math.abs(d.bandPx - 12) < 0.1,
			"...and a pipe's grab band is the 12 px it is meant to be",
			d.bandPx === null ? '(no band element)' : d.bandPx.toFixed(2) + ' px');
		// The stylesheet's own fallbacks, which is what these numbers are protecting against. The
		// arithmetic is stated so a future change to either end cannot make the note false quietly.
		report.ok(0.7 * d.s > 4000 && 12 * d.s > 70000,
			'...where the stylesheet fallback would be over 4,000 px of pipe and 70,000 px of band',
			Math.round(0.7 * d.s) + ' px / ' + Math.round(12 * d.s) + ' px');
		report.ok(d.sym > 0 && d.lw > 0 && d.hit > 0 && d.hair > 0,
			'all four scale-derived properties are published', JSON.stringify(d));

		// ---- can it be seen? --------------------------------------------------------------------
		const col = await inkShare(a);
		report.ok(col.ink < 0.15, 'the map ink is a network drawn on the canvas, not a wash over it',
			(col.ink * 100).toFixed(1) + '% of the canvas is ' + MAP_INK
			+ ', busiest colour ' + col.top.color + ' at ' + (col.top.share * 100).toFixed(0) + '%');

		// ---- can it be reached? -----------------------------------------------------------------
		let hits = await reachable(a);
		report.ok(hits.onBand <= 8,
			'the invisible grab bands have not swallowed the canvas',
			hits.onBand + ' of ' + hits.total + ' probe points: ' + JSON.stringify(hits.tally));

		// ---- can it be edited? THE WHOLE OF THE COMPLAINT ----------------------------------------
		// makeEdit() places one ordinary junction and throws if it does not land, which is exactly
		// the sentence "he never once succeeded in editing anything" turned into a check.
		let threw = null;
		try { await a.makeEdit(); } catch (err) { threw = String(err.message || err); }
		report.ok(threw === null, 'a junction can be placed on the map', threw || 'placed');

		// ---- and it survives a zoom, which is where the scale changes ---------------------------
		const box = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 3) };
		});
		await a.page.mouse.move(box.x, box.y);
		for (let i = 0; i < 5; i++) { await a.page.mouse.wheel(0, -120); await a.settle(120); }
		await a.settle(600);
		d = await drawing(a);
		report.ok(Math.abs(d.linkPx - startPx) < 0.05,
			'after five wheel notches in, a pipe is the same number of screen pixels',
			d.linkPx && d.linkPx.toFixed(3) + ' px at scale ' + (d.s && d.s.toFixed(0)));
		hits = await reachable(a);
		report.ok(hits.onBand <= 8, '...and the canvas is still reachable',
			hits.onBand + ' of ' + hits.total);

		// ---- and a window resize, which is the other thing that moves the view ------------------
		await a.page.setViewportSize({ width: 1100, height: 900 });
		await a.settle(800);
		d = await drawing(a);
		report.ok(Math.abs(d.linkPx - startPx) < 0.05, 'and after a window resize',
			d.linkPx && d.linkPx.toFixed(3) + ' px at scale ' + (d.s && d.s.toFixed(0)));

		report.eq(a.errors.length, 0, 'no uncaught page errors anywhere in the pass');
	} finally {
		await a.close();
	}
};
