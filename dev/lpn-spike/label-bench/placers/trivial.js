// LABEL BENCH REFERENCE PLACER (a): TRIVIAL. Every label, whole, at its owner's upper right; no
// leaders, no search, no drops. It exists to show the scorer catching breaks, and it is what the
// self-test runs. Hand-placed labels are hung at the user's point, so N4 holds.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

module.exports = {
	name: 'trivial (upper right, no leaders)',
	place: function (scene) {
		const out = {}, nodes = {};
		scene.nodes.forEach(function (n) { nodes[n.id] = n; });
		scene.labels.forEach(function (req) {
			const rows = req.rows.map(function (r, i) { return i; });
			const h = req.rows.reduce(function (a, r) { return a + r.h; }, 0);
			const layout = req.layout;
			const lineH = req.rows.length ? Math.max.apply(null, req.rows.map(function (r) { return r.h; })) : 0;
			const H = layout === 'line' ? lineH : h;
			let x, y;
			if (req.hand) {
				x = req.hand.x; y = req.hand.y - Math.min(H, req.rows[0].h) / 2;
			} else if (req.kind === 'node' && nodes[req.owner]) {
				const s = nodes[req.owner].symbol;
				x = s.x + s.w; y = s.y - H;
			} else {
				x = req.anchor.x + 2; y = req.anchor.y - H - 2;
			}
			out[req.id] = { shown: true, rows: rows, layout: layout, align: 'left', x: x, y: y, leader: null };
		});
		return { labels: out };
	}
};
