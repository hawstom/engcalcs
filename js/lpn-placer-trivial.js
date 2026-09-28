// LABEL PLACER: TRIVIAL, the label bench's reference placer (a) wrapped for the browser. Every label
// whole at its owner's upper right, no leaders, no search, no drops; a hand-placed label hangs at
// the user's point. It exists to prove the seam: with ?placer=trivial on a development host, every
// data label on the map is where this function says. Not for production and never loaded there.
//
// THE SHAPE EVERY PLACER FILE HAS (dev/lpn-spike/label-bench/README.md, "The contract"): a module
// that is a Placer or {create: () => Placer}, exported for node (so the bench's run.js takes this
// very file) and registered as EngCalcs.lpnPlacers['<name>'] for the page, where <name> is the part
// of the file name after `lpn-placer-`. dev/lpn-spike/label-placer-seam-harness.js holds this copy
// to the bench's own placers/trivial.js on the bench's scenes.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
	'use strict';

	var placer = {
		name: 'trivial (upper right, no leaders)',
		place: function (scene) {
			var out = {}, nodes = {};
			scene.nodes.forEach(function (n) { nodes[n.id] = n; });
			scene.labels.forEach(function (req) {
				var rows = req.rows.map(function (r, i) { return i; });
				var h = req.rows.reduce(function (a, r) { return a + r.h; }, 0);
				var layout = req.layout;
				var lineH = req.rows.length ? Math.max.apply(null, req.rows.map(function (r) { return r.h; })) : 0;
				var H = layout === 'line' ? lineH : h;
				var x, y;
				if (req.hand) {
					x = req.hand.x; y = req.hand.y - Math.min(H, req.rows[0].h) / 2;
				} else if (req.kind === 'node' && nodes[req.owner]) {
					var s = nodes[req.owner].symbol;
					x = s.x + s.w; y = s.y - H;
				} else {
					x = req.anchor.x + 2; y = req.anchor.y - H - 2;
				}
				out[req.id] = { shown: true, rows: rows, layout: layout, align: 'left', x: x, y: y, leader: null };
			});
			return { labels: out };
		}
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = placer; }
	if (root) {
		root.EngCalcs = root.EngCalcs || {};
		root.EngCalcs.lpnPlacers = root.EngCalcs.lpnPlacers || {};
		root.EngCalcs.lpnPlacers.trivial = placer;
	}
}(typeof window !== 'undefined' ? window : null));
