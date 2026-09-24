// §49 — Zoom to fit from a deep zoom shows the whole network (R-184).
//
// Tom, 2026-09-23: after zooming in and then Zoom to fit, *"it doesn't work. This presents as a
// catastrophic loss because my screen is blank."* The pre-reviewer measured it on the shipped Net1:
// from scale 322 not one symbol was left on screen. Net1 carries DRAGGED node labels, whose offsets
// are drawing units, and fitItems() counted them as pixels at the scale the fit started from.
//
// The stub harness (dev/lpn-spike/zoom-fit-harness.js section 5) holds the same property in
// check_all; this is the same question asked of a real browser on the real examples, with real
// fonts, real shedding and the real wheel. Not a fit to an EMPTY document -- that is how the
// zoom-control harness missed it.
//
// Asserted: from every starting scale up to the ceiling, every node is on the canvas afterwards.
// On Net1 the scale also matches the fit from the opened view to 2%. On the geographic Net3 the
// scale is REPORTED, not asserted: shed label rows are laid out at the scale you arrive from, so
// a fit from deep in comes out up to ~6% further back (measured 2026-09-23). That is a separate,
// cosmetic residue; the blank screen is not.

const { Session } = require('../lib/session');

exports.title = '49. Zoom to fit from any zoom shows every node';

async function measure(a) {
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect();
		const m = /scale\(([^)]+)\)/.exec(svg.querySelector('g').getAttribute('transform') || '');
		const els = Array.from(svg.querySelectorAll('.lpn-node[data-node]'));
		let inside = 0;
		els.forEach((e) => {
			const b = e.getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2;
			if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) { inside++; }
		});
		return { s: m ? +m[1] : null, inside, total: els.length };
	});
}
// The toolbar button, found by its label from the language file, never by wording.
async function fit(a) {
	const lbl = await a.lang('lpn_tool_zoom_extent');
	const hit = await a.page.evaluate((l) => {
		const b = Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent &&
			((x.getAttribute('aria-label') || '') === l || (x.textContent || '').trim() === l));
		if (b) { b.click(); }
		return !!b;
	}, lbl);
	if (!hit) { throw new Error('no Zoom to fit button labelled "' + lbl + '"'); }
	await a.settle(400);
}
// Wheel in at the canvas centre until the scale is `mult` times the fitted one, or the ceiling.
async function zoomIn(a, target) {
	const c = await a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
	await a.page.mouse.move(c.x, c.y);
	let m = await measure(a), last = -1, n = 0;
	while (m.s < target && m.s !== last && n < 250) {
		last = m.s;
		await a.page.mouse.wheel(0, -240);
		await a.settle(20);
		m = await measure(a);
		n++;
	}
	return m;
}

async function walk(a, report, key, strictScale) {
	await a.openExampleCard(await a.lang(key));
	await fit(a);
	const base = await measure(a);
	report.ok(base.inside === base.total && base.total > 0, key + ': the fit from the opened view shows every node',
		base.inside + '/' + base.total + ' at scale ' + base.s.toFixed(3));
	for (const mult of [2, 4, 8, 32, Infinity]) {
		await fit(a);
		const pre = await zoomIn(a, base.s * mult);
		await fit(a);
		const post = await measure(a), ratio = post.s / base.s;
		const label = key + ': from scale ' + pre.s.toFixed(1) + (mult === Infinity ? ' (the ceiling)' : '');
		report.ok(post.inside === post.total, label + ', every node is on the canvas',
			post.inside + '/' + post.total);
		if (strictScale) {
			report.ok(Math.abs(ratio - 1) < 0.02, '...and at the same scale as the fit from the opened view',
				'ratio ' + ratio.toFixed(4));
		} else {
			report.note('...scale ratio to the fit from the opened view ' + ratio.toFixed(4));
		}
	}
}

// One fresh profile per example: the examples wall is only on an empty canvas.
exports.run = async function ({ browser, report }) {
	for (const [key, strict] of [['lpn_ex_net1_title', true], ['lpn_ex_net3_world_title', false]]) {
		const a = await Session.open(browser, 'zoomfit-' + Date.now());
		try {
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto();
			await a.answerTrainingPanel().catch(() => {});
			await walk(a, report, key, strict);
			report.eq(a.errors.length, 0, key + ': no uncaught page errors');
		} finally {
			await a.close();
		}
	}
};
