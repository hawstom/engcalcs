// §11 — the collision boxes a tester can see (ROADMAP Task 406).
//
// `?debug=boxes` draws what the placement pass reasoned about. Since Task 406 a stacked label
// reserves ONE BOX PER LINE — its rows have different widths, and a single box around all of them
// claims the empty ground beside every short row, which is exactly where the next label would fit.
//
// **THE PICTURE IS THE ONLY WAY TO SEE THAT THE CHANGE LANDED.** The pure harness
// (`dev/lpn-spike/line-box-harness.js`) proved the geometry and the reservation, and both were
// right, while the drawing still showed the block: the debug layer read `r.box` (the one box a
// reader counts) instead of `r.boxes` (what the pass committed). Tom, 2026-08-17: *"?debug=boxes
// still shows one box, not a layer cake."* Nothing headless could have caught that, because nothing
// headless draws.

const { Session } = require('../lib/session');
const { pageUrl } = require('../lib/env');

exports.title = '11. Debug boxes';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.page.goto(pageUrl('Looped-Network.php?ec_nolog=1&debug=boxes'), { waitUntil: 'load' });
		await a.settle();
		// One junction, whose label carries several values at the shipped defaults — so its box is a
		// stack, which is the case this spec is about.
		await a.makeEdit();
		await a.settle(400);

		const seen = await a.page.evaluate(() => {
			// Blue is what the pass PLACED; green is what it went round. Only the placed boxes are
			// this spec's business.
			const blue = [...document.querySelectorAll('#lpn_canvas polygon')]
				.filter(p => p.getAttribute('stroke') === '#00d');
			const rect = (p) => {
				const pts = p.getAttribute('points').split(' ').map(s => s.split(',').map(Number));
				const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
				return { w: +(Math.max(...xs) - Math.min(...xs)).toFixed(3),
					h: +(Math.max(...ys) - Math.min(...ys)).toFixed(3),
					left: +Math.min(...xs).toFixed(3), top: +Math.min(...ys).toFixed(3) };
			};
			const lbl = document.querySelector('#lpn_canvas text.lpn-lbl');
			return { boxes: blue.map(rect), rows: lbl ? lbl.querySelectorAll('tspan[x]').length : -1 };
		});

		report.ok(seen.boxes.length > 1, 'a stacked label draws MORE THAN ONE box — a layer cake',
			seen.boxes.length + ' boxes for ' + seen.rows + ' rows');
		report.eq(seen.boxes.length, seen.rows, 'one box per drawn row, exactly');

		const widths = seen.boxes.map(b => b.w);
		// The whole point: the rows are not the same width, so the block box was claiming ground the
		// short rows never cover. If every box came out identical the change would be cosmetic.
		report.ok(new Set(widths).size > 1, '...and the boxes have DIFFERENT widths, as the rows do',
			widths.join(' / '));

		const heights = seen.boxes.map(b => b.h);
		report.ok(new Set(heights).size === 1, 'every row is one row high', heights.join(' / '));

		// Stacked, not scattered: sorted by top edge, each row starts where the last one ended.
		const tops = seen.boxes.map(b => b.top).sort((x, y) => x - y);
		const step = heights[0];
		report.ok(tops.every((t, i) => i === 0 || Math.abs(t - tops[i - 1] - step) < 0.01),
			'and they stack, edge to edge, with no gap and no overlap', tops.join(' / '));

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
