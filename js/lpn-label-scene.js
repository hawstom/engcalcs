// LABEL SCENE: the live drawing at one view, as the label bench's placer contract reads it.
//
// ONE FUNCTION, TWO CALLERS. dev/lpn-spike/label-bench/extract.js builds the bench's scene files
// with it headlessly, and js/looped-network.js builds the same shape from the page on screen when
// a contract placer is driving the labels (the dev-only ?placer=<name> switch). What differs
// between the two is handed in, never branched on here: the text measurement (the bench's nominal
// advance, or the page's own measurement in the real font) and the obstacle set the Text objects
// are read from.
//
// The contract itself (what a scene holds, what a placement says) is the doc comment at the top
// of dev/lpn-spike/label-bench/contract.js. No DOM is touched here beyond reading attributes the
// page already wrote; everything comes through `host`, an accessor object over the page's own
// state (the same names extract.js injects into the headless page).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
	'use strict';

	function r2(v) { return Math.round(v * 100) / 100; }

	// The user's drop order per kind: lowest Drop number first; a field with none goes first of all
	// (linkFieldRank()'s rule). ID is never in it -- it is the label.
	function dropOrder(ls, group) {
		var pr = (ls.priority && ls.priority[group]) || {};
		return Object.keys(ls[group] || {}).filter(function (f) { return ls[group][f] && f !== 'id'; })
			.sort(function (a, b) {
				var ra = typeof pr[a] === 'number' ? pr[a] : -Infinity;
				var rb = typeof pr[b] === 'number' ? pr[b] : -Infinity;
				return ra - rb || (a < b ? -1 : 1);
			});
	}

	/**
	 * The scene at the page's CURRENT view.
	 *
	 * host: { state(), getDoc(), settings(), labelSettings(), nodeEls(), linkEls(), nodeAt(n),
	 *         nodeRadius(n), linkPointList(l), linkLabelMid(l), pumpSymbolSize(type),
	 *         labelSeparator(), labelFlipLeftOfVertical()? }
	 * opts: { id, set, step, source, canvas: {w, h}, measure(str) -> px, obs, zoom? }
	 *   `obs` is an obstacle set shaped like the page's staticObstacles(): the Text objects are
	 *   read off its boxes and segments that carry `textOwner`.
	 *
	 * Returns { scene, V, textW, rowH, inView, rowsOf }: the scene, and the conversions it was
	 * built with, so a caller reading the page's own layout for the same view (extract.js's
	 * master replay) converts with exactly the same arithmetic.
	 */
	function buildScene(host, opts) {
		var doc = host.getDoc(), settings = host.settings(), ls = host.labelSettings();
		var textPx = settings.textSize, CANVAS = opts.canvas;
		var textW = function (str) { return str.length ? opts.measure(str) : 0; };
		var rowH = textPx * 1.2;
		var st = host.state(), s = st.s, tx = st.tx, ty = st.ty;
		var V = function (p) { return { x: r2(p.x * s + tx), y: r2(p.y * s + ty) }; };
		var inView = function (p) { return p.x >= 0 && p.y >= 0 && p.x <= CANVAS.w && p.y <= CANVAS.h; };
		var nodeEls = host.nodeEls(), linkEls = host.linkEls(), obs = opts.obs;
		var sep = host.labelSeparator();
		var alignOn = !!settings.alignPipeLabels;
		var flipDeg = typeof host.labelFlipLeftOfVertical === 'function' ? host.labelFlipLeftOfVertical() : 20;
		var scene = {
			id: opts.id, set: opts.set, step: opts.step, source: opts.source,
			viewport: { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
			view: { s: s, tx: tx, ty: ty, note: 'view px = model * s + t (model = the app draw frame, y down)' },
			text: { sizePx: textPx, rowHeightPx: r2(rowH), separator: sep,
				separatorW: r2(textW(sep)), hookMaxPx: r2(rowH) },
			dropOrder: { node: dropOrder(ls, 'node'), link: dropOrder(ls, 'link'), customer: [] },
			// **THE USER'S "DRAW LINK LABELS ALONG THE LINK LINE" SETTING** (Settings > Symbology >
			// Labels; settings.alignPipeLabels), and the reading window a turned label must keep to:
			// its reading direction, `angle` in the contract's sense, lies in (min, max] degrees, so
			// no label reads upside down. The window is the page's own, from its "Label flip angle
			// adjustment" setting. Each pipe label that should lie along its pipe says so itself
			// (`along`), since a label the user dragged opts out.
			settings: { alignPipeLabels: alignOn, readableAngleDeg: { min: -(90 + flipDeg), max: 90 - flipDeg } },
			nodes: [], links: [], texts: [], customers: [], labels: []
		};
		if (opts.zoom) { scene.zoom = opts.zoom; }

		doc.nodes.forEach(function (n) {
			var p = V(host.nodeAt(n)), r = host.nodeRadius(n) * s;
			scene.nodes.push({ id: String(n.id), type: n.type, x: p.x, y: p.y,
				symbol: { x: r2(p.x - r), y: r2(p.y - r), w: r2(2 * r), h: r2(2 * r) } });
		});
		doc.links.forEach(function (l) {
			var pts = host.linkPointList(l).map(V);
			var rec = { id: String(l.id), type: l.type, from: String(l.from), to: String(l.to),
				points: pts.map(function (p) { return [p.x, p.y]; }), symbols: [], arrows: [] };
			if (l.type === 'pump' || l.type === 'valve') {
				// positionPumpSymbol(): centred between the END nodes, turned to the from->to line.
				var a = pts[0], b = pts[pts.length - 1], sz = host.pumpSymbolSize(l.type) * s;
				rec.symbols.push({ cx: r2((a.x + b.x) / 2), cy: r2((a.y + b.y) / 2), w: r2(sz), h: r2(sz),
					angle: r2(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI) });
			}
			var le = linkEls[l.id];
			(le && le.arrows || []).forEach(function (ar) {
				if (ar.style.display === 'none') { return; }
				var m = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\) scale\(([-0-9.e]+)\)/
					.exec(ar.getAttribute('transform') || '');
				if (!m) { return; }
				var c = V({ x: +m[1], y: +m[2] }), k = +m[4] * s;
				rec.arrows.push({ cx: c.x, cy: c.y, w: r2(1.6 * k), h: r2(1.6 * k), angle: r2(+m[3]) });
			});
			scene.links.push(rec);
		});
		// Text objects: fixed boxes (oriented) and their callout lines, off the obstacle set
		// (staticObstacles() pushes them in doc.labels order).
		var textBoxes = [], textLeaders = {};
		((obs && obs.boxes) || []).forEach(function (b) {
			if (b.kind === 'label' && b.textOwner !== undefined) { textBoxes.push(b); }
		});
		((obs && obs.segments) || []).forEach(function (g) {
			if (g.kind === 'leader' && g.textOwner !== undefined) { textLeaders[g.textOwner] = g; }
		});
		textBoxes.forEach(function (b) {
			var lb = doc.labels.find(function (x) { return x.id === b.textOwner; }) || {};
			var c = V({ x: b.cx, y: b.cy }), g = textLeaders[b.textOwner];
			var t = { id: String(b.textOwner), text: String(lb.text || ''),
				box: { cx: c.x, cy: c.y, w: r2(b.w * s), h: r2(b.h * s), angle: r2(b.a || 0) } };
			if (g) {
				var a = V({ x: g.ax, y: g.ay }), e = V({ x: g.bx, y: g.by });
				t.leader = [[a.x, a.y], [e.x, e.y]];
			}
			scene.texts.push(t);
		});

		// ---- the labels requested: every node and link whose label has content and whose owner is
		// on screen. Rows are the FULL list (allLines), whatever the page's own pass shed.
		function rowsOf(lines) {
			return (lines || []).map(function (ln) {
				return { field: ln.field || 'id', text: String(ln.text), w: r2(textW(String(ln.text))), h: r2(rowH) };
			});
		}
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id];
			if (!ne || !ne.allLines || !ne.allLines.length) { return; }
			var anchor = V(host.nodeAt(n));
			if (!inView(anchor)) { return; }
			var lab = { id: 'n:' + n.id, owner: String(n.id), kind: 'node', anchor: anchor,
				rows: rowsOf(ne.allLines), layout: 'stack', hand: null };
			if (n.lx !== undefined) {
				var b = host.nodeAt(n);
				lab.hand = V({ x: b.x + n.lx, y: b.y + (n.ly || 0) });
			}
			scene.labels.push(lab);
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id];
			if (!le || !le.allLines || !le.allLines.length) { return; }
			var anchor = V(host.linkLabelMid(l));
			if (!inView(anchor)) { return; }
			var dragged = l.lx !== undefined;
			var lab = { id: 'l:' + l.id, owner: String(l.id), kind: 'link', anchor: { x: anchor.x, y: anchor.y },
				rows: rowsOf(le.allLines), layout: dragged ? 'stack' : 'line', hand: null,
				along: alignOn && !dragged };
			if (dragged) {
				var m = host.linkLabelMid(l);
				lab.hand = V({ x: m.x + l.lx, y: m.y + (l.ly || 0) });
			}
			scene.labels.push(lab);
		});
		return { scene: scene, V: V, textW: textW, rowH: rowH, inView: inView, rowsOf: rowsOf };
	}

	var api = { buildScene: buildScene, dropOrder: dropOrder, r2: r2 };
	if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
	if (root) {
		root.EngCalcs = root.EngCalcs || {};
		root.EngCalcs.lpnLabelScene = api;
	}
}(typeof window !== 'undefined' ? window : null));
