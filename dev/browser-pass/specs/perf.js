// §25 — how long an open, a Close and a wheel notch take, in milliseconds.
//
// Tom, 2026-08-18: *"Close is extremely sluggish. Around 30 seconds."*
//
// **CLOSING IS NOT WHAT COSTS; OPENING WHAT YOU LAND ON IS.** discardProject() drops the document
// and then opens the neighbouring tab, so a Close pays for a full open of THAT project — buildDom(),
// a solve and the label pass. Dropping the document measured 5 ms. So the Close checked below is
// really an open, which is also why the wheel notch is in the same file: it is the same work.
//
// Three things made that work quadratic in the size of the drawing, and all three are fixed:
//
//   * **nodeById() was a linear scan**, and linkPointList() calls it twice per link per candidate
//     position the label pass considers — 14.5% of a whole open in a CPU profile, second only to
//     getBBox().
//   * **the canvas box was read per label.** clientWidth/clientHeight are LAYOUT reads, and one taken
//     between two DOM writes forces a synchronous layout of the whole drawing — 10% of an open.
//   * **every wheel notch ran the full label collision pass.** onZoomChanged() already ends in the
//     debounced scheduleReshed(), which lays out 120 ms after the LAST notch, so the per-notch pass
//     was work nobody ever looked at.
//
// Measured here on the 16 x 16 grid below (256 junctions, 480 pipes), before and after:
//
//     opened, to first draw       4,745 ms  ->  2,081 ms
//     one wheel notch             1,888 ms  ->     97 ms
//     Close, landing on it       24,262 ms  ->  9,484 ms
//
// (Each measured with nothing else running. With the rest of this pass on the same machine the
// after-figures are about a third higher, which is what the bounds leave room for.)
//
// **AND THEN THE LINK HALF OF THE LABEL PASS WAS BATCHED TOO** (Task 440), which is the fourth
// quadratic and the last of the measurement ones. It wrote one link label, measured it, and ran its
// shed cascade — draw, measure, drop a value, draw again — before touching the next label, so a
// forced layout landed once per label per rung. It is now three passes: write every label, measure
// every label, then iterate the CASCADE a rung at a time across all of them.
//
//     Close, landing on it, the two builds run ALTERNATING on a busy machine, best of three each:
//
//                                18,106 ms  ->  8,473 ms
//
// **ALTERNATING IS WHY THAT PAIR MEANS ANYTHING.** This number swings by a factor of two with what
// else the machine is doing — the after-build measured 13,302 ms in the first of those three rounds
// and 8,473 ms in the third with no change to it in between — so a before measured in one session
// and an after measured in the next says nothing at all. Both figures above are inflated by that
// load; on a quiet machine the after-build closed in 6,448 ms.
//
// **THE PROOF THAT IT IS THE SAME DRAWING is not in this file**, because a stopwatch cannot see a
// label shed a value it should have kept: `dev/lpn-spike/label-batch-harness.js` re-runs each link's
// cascade the old way, one label at a time, and requires the batched pass to have decided
// identically — and counts the forced layouts, which fell from 1,033 to 10 on a 112-pipe grid.
//
// **WHAT IS LEFT IS NO LONGER MEASUREMENT.** Under Chrome's sampling profiler, on this same network
// and this same Close (23,016 ms before against 9,875 ms after, both under the profiler's own
// overhead), getBBox() went from 53.7% of self time to 6.2%. The three biggest remaining
// are linkPointList() at 21%, readMapBox() at 16% and the collision geometry at about 13% — and the
// first is quadratic for a reason that has nothing to do with labels' text: alignedSideFor() walks
// EVERY link to decide which side of its own pipe one label hangs on, which is 480 x 480 on this
// drawing. That is the next task here, and this file is where its number lives.
//
// **THE BOUNDS ARE GENEROUS ON PURPOSE — well clear of the measurement, not a hair over it.** This
// pass runs on whatever machine is free, and a timing check that fails on a busy one teaches people
// to ignore failures. What they catch is the QUADRATIC coming back, which is an order of magnitude;
// the numbers printed beside them are the real signal. **A saving smaller than the machine noise is
// therefore not defended here at all** — the eighteen seconds below would sit quietly through the
// whole of Task 440 going back the way it came. What defends that one is a COUNT rather than a
// clock, in label-batch-harness.js, and a saving worth defending is worth a countable guard.
//
// **THE NETWORK IS WRITTEN INTO THE PROJECT'S OWN STORAGE, which is the one place this file departs
// from doing what a user does** — 256 junctions cannot be clicked out, and Insert's "[dev] Draw large
// test network" builds 64. It writes the document format the page itself writes (specs/gallery.js
// reads the same storage), and then RELOADS, so everything measured after that is the ordinary open
// path with nothing stubbed.

const { Session } = require('../lib/session');

exports.title = '25. Open, close and zoom, timed';

const GRID = 16;   // 256 junctions, 480 pipes — small next to a real distribution system

async function answerConsent(a) {
	const btn = await a.page.$('#ec-consent button[value="0"]');
	if (!btn) { return; }
	await btn.click();
	await a.settle(300);
}
// An m x m grid of junctions on 0.0004° spacing (~35 m), one corner a reservoir, written into the
// open project's stored document.
async function writeGrid(a, m) {
	return a.page.evaluate((m) => {
		const idx = JSON.parse(localStorage.getItem('lpn_index'));
		const key = 'lpn_project_' + idx.openId;
		const doc = JSON.parse(localStorage.getItem(key));
		const x0 = -122.5686, y0 = 38.106, step = 0.0004;
		const nodes = [], links = [];
		for (let r = 0; r < m; r++) {
			for (let c = 0; c < m; c++) {
				nodes.push({
					id: 'J' + (r * m + c), type: (r === 0 && c === 0) ? 'reservoir' : 'junction',
					x: x0 + c * step, y: y0 + r * step, elev: 100, _demand: 5, head: 200
				});
			}
		}
		let k = 0;
		const pipe = (from, to) => ({
			id: 'P' + (k++), type: 'pipe', from: from, to: to,
			diam: 200, length: 100, rough: 100, verts: []
		});
		for (let r = 0; r < m; r++) {
			for (let c = 0; c < m; c++) {
				if (c < m - 1) { links.push(pipe('J' + (r * m + c), 'J' + (r * m + c + 1))); }
				if (r < m - 1) { links.push(pipe('J' + (r * m + c), 'J' + ((r + 1) * m + c))); }
			}
		}
		doc.nodes = nodes; doc.links = links; doc.labels = [];
		doc.nextId = nodes.length + links.length + 10;
		delete doc.view;   // no stored view, so it opens on its own extent
		localStorage.setItem(key, JSON.stringify(doc));
		return nodes.length + links.length;
	}, m);
}
// One wheel notch's handler time, averaged over ten. Dispatched from inside the page, so what is
// measured is the page's own work rather than the runner's round trips.
async function notchMs(a) {
	const ms = await a.page.evaluate(() => {
		const c = document.getElementById('lpn_canvas');
		const r = c.getBoundingClientRect();
		const t0 = performance.now();
		for (let i = 0; i < 10; i++) {
			c.dispatchEvent(new WheelEvent('wheel', {
				deltaY: -100, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2,
				bubbles: true, cancelable: true
			}));
		}
		return (performance.now() - t0) / 10;
	});
	await a.settle(700);   // let the debounced reshed land before anything else is measured
	return ms;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.goto();
		await answerConsent(a);
		await a.dismissGallery();

		// ---- a big lat/lon network, opened -------------------------------------------------------
		await a.newGeoProject();
		await a.settle(600);
		const drawn = await writeGrid(a, GRID);
		const t0 = Date.now();
		await a.page.reload({ waitUntil: 'commit' });
		const there = await a.waitFor(async () => (await a.nodeCount()) >= drawn, 'the network to draw', 120000);
		const opened = Date.now() - t0;
		// **THE OPEN IS REPORTED, NOT ASSERTED, AND THAT IS DELIBERATE.** It is the one number here
		// with no room between the two states: 4,745 ms before against 2,081 ms after, and 3,418 ms
		// when the whole pass is running beside it on the same machine. Any bound tight enough to
		// catch the regression fails on a busy machine, and a flaky red teaches people to skim. The
		// notch and the Close below are the same work with an order of magnitude between them, so
		// they carry the check; this line carries the number.
		report.ok(!!there, 'a 256-junction lat/lon network opens at all',
			drawn + ' elements in ' + opened + ' ms');
		await a.settle(2000);

		// ---- a wheel notch on it -----------------------------------------------------------------
		const notch = await notchMs(a);
		report.ok(notch < 250, 'a wheel notch on it stays under 250 ms', notch.toFixed(1) + ' ms');

		// ---- and closing a project that lands on it ----------------------------------------------
		// The tab strip lands on the neighbour that slides into the closed tab's spot, so closing the
		// LAST tab lands on the big one — which is exactly the shape of "Close is sluggish".
		await a.newGeoProject();
		await a.settle(600);
		await a.makeEdit();                    // so the close asks, as Tom's did
		const before = (await a.tabs()).length;
		await a.menuClick('Close');
		const d = await a.waitDialog(4000);
		report.ok(!!d, 'closing an edited project asks first');
		const t1 = Date.now();
		if (d) { await a.dialogClick('Close without saving'); }
		await a.waitFor(async () => (await a.tabs()).length < before, 'the tab to go', 120000);
		const took = Date.now() - t1;
		report.eq((await a.tabs()).length, before - 1, 'the tab is gone');
		report.ok((await a.nodeCount()) >= drawn, '...and the big network it landed on is drawn',
			(await a.nodeCount()) + ' elements');
		// Session.dialogClick()'s own 350 ms settle is inside this number.
		// Eighteen seconds is not a target — it is a fence around the 24 seconds this used to take,
		// with room for a machine running the rest of this pass beside it (9.5 s idle, 11.4 s busy).
		// See the note at the top: the honest number today is about ten, and what is left of it is
		// named there.
		report.ok(took < 18000, 'and the whole Close took under eighteen seconds', took + ' ms');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
