// §50 -- Zoom to fit keeps every drawn label on the map, not only every node (R-214).
//
// Tom, 2026-09-24, retesting master after R-184: *"The problem is that now Zoom to Fit doesn't
// account for labels. Not all fits. We are back to week 1 of development."* §49 asserted only that
// every NODE ends on the canvas, which is how a fit that let lettering fall off the edge passed.
//
// Asked of the real examples in real Chrome: open, fit, then fit again from a normal view and from
// deep zooms (wheel in at the centre, then Zoom to fit). After each fit every visible label -- node
// and pipe data labels, Text labels, and the leader lines that tie a dragged label to its symbol --
// must lie wholly inside the canvas. Net1 carries dragged node labels; one run drags more on the
// Basic example so leaders are drawn at both far corners.

const { Session } = require('../lib/session');

exports.title = '50. Zoom to fit keeps every label on the map';

// Every drawn piece of lettering in the world layer, and each leader line, by its rendered box.
// Labels a threshold has hidden are not drawn, so they are not measured. Tolerance 1 px for
// anti-aliasing of the box edge.
async function measure(a) {
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect();
		const m = /scale\(([^)]+)\)/.exec(svg.querySelector('g').getAttribute('transform') || '');
		function drawn(e) {
			for (let p = e; p && p !== svg; p = p.parentNode) {
				const cs = getComputedStyle(p);
				if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { return false; }
			}
			return true;
		}
		const out = [];
		svg.querySelectorAll('text, line').forEach((e) => {
			if (e.closest('.lpn-scalebar, #lpn_scalebar, defs, marker, pattern')) { return; }
			if (e.tagName === 'text' && !(e.textContent || '').trim()) { return; }
			if (e.tagName === 'line' && !/leader/.test((e.getAttribute('class') || '') + ' ' + (e.id || ''))) { return; }
			if (!drawn(e)) { return; }
			const b = e.getBoundingClientRect();
			if (!b.width && !b.height) { return; }
			const over = Math.max(r.left - b.left, b.right - r.right, r.top - b.top, b.bottom - r.bottom);
			if (over > 1) {
				out.push({ what: e.tagName + ':' + (e.textContent || e.getAttribute('class') || '').trim().slice(0, 24),
					over: Math.round(over) });
			}
		});
		let total = 0;
		svg.querySelectorAll('text').forEach((e) => { if ((e.textContent || '').trim() && drawn(e)) { total++; } });
		return { s: m ? +m[1] : null, outside: out, total };
	});
}
async function fit(a) {
	const t0 = Date.now();
	const lbl = await a.lang('lpn_tool_zoom_extent');
	const hit = await a.page.evaluate((l) => {
		const b = Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent &&
			((x.getAttribute('aria-label') || '') === l || (x.textContent || '').trim() === l));
		if (b) { b.click(); }
		return !!b;
	}, lbl);
	if (!hit) { throw new Error('no Zoom to fit button labelled "' + lbl + '"'); }
	fit.ms = Date.now() - t0;
	await a.settle(600);
}
// Click somewhere neutral so the next Zoom to fit press is a first press (R-181's state machine).
async function neutral(a) {
	await a.page.keyboard.press('Escape');
	await a.settle(50);
}
async function zoomIn(a, target) {
	const c = await a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
	await a.page.mouse.move(c.x, c.y);
	let s = (await measure(a)).s, last = -1, n = 0;
	while (s < target && s !== last && n < 250) {
		last = s;
		await a.page.mouse.wheel(0, -240);
		await a.settle(20);
		s = (await measure(a)).s;
		n++;
	}
	return s;
}
function say(m) {
	return m.outside.length + ' of ' + m.total + ' outside' +
		(m.outside.length ? ': ' + m.outside.slice(0, 4).map((o) => o.what + ' by ' + o.over + 'px').join(', ') : '');
}

async function walk(a, report, key, prep, strictScale) {
	await a.openExampleCard(await a.lang(key));
	if (prep) { await prep(a); }
	await fit(a);
	const base = await measure(a);
	report.ok(base.outside.length === 0 && base.total > 0, key + ': after Zoom to fit every label is on the map', say(base));
	for (const mult of [0.25, 4, 32, Infinity]) {
		await neutral(a);
		if (mult < 1) {
			const c = await a.page.evaluate(() => {
				const r = document.getElementById('lpn_canvas').getBoundingClientRect();
				return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
			});
			await a.page.mouse.move(c.x, c.y);
			for (let i = 0; i < 6; i++) { await a.page.mouse.wheel(0, 240); await a.settle(20); }
		} else {
			await zoomIn(a, base.s * mult);
		}
		const from = (await measure(a)).s;
		await neutral(a);
		await fit(a);
		const post = await measure(a);
		report.note('the press took ' + fit.ms + ' ms');
		report.ok(post.outside.length === 0, key + ': fit from scale ' + from.toFixed(2) +
			(mult === Infinity ? ' (the ceiling)' : '') + ', every label on the map', say(post));
		// On the geographic Net3 the scale is REPORTED, as in §49: shed label rows are laid out at
		// the scale you arrive from, so a fit from deep in comes out a few per cent further back.
		if (strictScale) {
			report.ok(Math.abs(post.s / base.s - 1) < 0.03, '...at the scale of the first fit',
				'ratio ' + (post.s / base.s).toFixed(4));
		} else {
			report.note('...scale ratio to the first fit ' + (post.s / base.s).toFixed(4));
		}
	}
}

// Drag node labels with the real mouse: the leftmost label further left and up, the rightmost
// further right and down, each by 120 px at the fitted view, so a leader is drawn at both far edges
// and the dragged offsets are the outermost ink on the map.
async function dragLabels(a) {
	await fit(a);
	const ends = await a.page.evaluate(() => {
		const all = Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]'))
			.filter((e) => (e.textContent || '').trim()).map((e) => {
				const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
			});
		all.sort((p, q) => p.x - q.x);
		return all.length ? [all[0], all[all.length - 1]] : [];
	});
	for (let i = 0; i < ends.length; i++) {
		const p = ends[i], d = i ? 120 : -120;
		await a.page.mouse.move(p.x, p.y);
		await a.page.mouse.down();
		for (let k = 1; k <= 8; k++) { await a.page.mouse.move(p.x + d * k / 8, p.y + d * k / 8 * 0.5); }
		await a.page.mouse.up();
		await a.settle(200);
	}
	return ends.length;
}

exports.run = async function ({ browser, report }) {
	const list = [['lpn_ex_net1_title'], ['lpn_ex_basic_us_title'], ['lpn_ex_basic_si_title', dragLabels],
		['lpn_ex_net2_title'], ['lpn_ex_net3_title'], ['lpn_ex_elm_street_title'],
		['lpn_ex_net3_world_title', null, false]];
	for (const [key, prep, strict] of list) {
		const a = await Session.open(browser, 'zoomfitlbl-' + Date.now());
		try {
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto();
			await a.answerTrainingPanel().catch(() => {});
			await walk(a, report, key, prep, strict !== false);
			report.eq(a.errors.length, 0, key + ': no uncaught page errors');
		} finally {
			await a.close();
		}
	}
};
