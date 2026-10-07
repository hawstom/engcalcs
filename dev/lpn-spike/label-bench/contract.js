// LABEL BENCH: THE PLACER CONTRACT, and the one place a placement is turned into ink.
//
// A placer is a PURE FUNCTION of one view: no page, no DOM, no text measurement. Everything is in
// VIEW PIXELS (origin at the map canvas's upper-left, x right, y down). The bench measured every
// row of every label already; a placer never measures text.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

/**
 * @typedef {{x:number, y:number}} Pt
 * @typedef {{x:number, y:number, w:number, h:number}} Rect            top-left, axis-aligned
 * @typedef {{cx:number, cy:number, w:number, h:number, angle:number}} OBox   centred, turned `angle`
 *          degrees (clockwise on screen, since y is down) about its centre
 *
 * @typedef {Object} Scene                  ONE VIEW. The input to place().
 * @property {string} id                    e.g. 'novato-zoom@4x'
 * @property {string} set                   the scene set (one project, one or more views)
 * @property {number} step                  index of this view within its set
 * @property {Rect}   viewport              the visible map; the model runs off it on every side. On
 *          the page it is the canvas less the strips the page's mode hint and status footer cover,
 *          so its top-left need not be (0, 0).
 * @property {Rect[]} [furniture]           boxes the page draws OVER the map inside the viewport
 *          (legends, the zoom buttons, status chips): a label under one cannot be read, so keep
 *          clear of them as of a Text object. Absent in the bench's scenes.
 * @property {{s:number, tx:number, ty:number}} view   view px = model * s + t, for a placer that
 *          caches in model space across zooms (H-b: hard thinking may be cached across zooms).
 *          Everything else is already in view px.
 * @property {{sizePx:number, rowHeightPx:number, separator:string, separatorW:number,
 *            hookMaxPx:number, repeatSpacingPx:number}} text   the lettering: row height, the
 *          separator a one-line label joins its rows with (and its measured width), the longest
 *          allowed hook, and the spacing a pipe longer than it repeats its label along (R9)
 * @property {{node:string[], link:string[], customer:string[]}} dropOrder   the user's per-kind
 *          value drop order, FIRST TO GO first. The ID is in it like any other value (Tom,
 *          2026-10-06: "Keep the last dropped property."): a label keeps the LAST value in this order
 *          longest, and that may be a value rather than the ID. A scene recorded before then lacks
 *          'id'; dropOrderOf() puts it first to go, as Tom's table does. A row whose `field` is not
 *          listed goes before every listed one.
 * @property {{alignPipeLabels:boolean, readableAngleDeg:{min:number, max:number}}} [settings]   the
 *          user's "Draw link labels along the link line" setting (Settings > Symbology > Labels), and
 *          the reading window a turned label keeps to: its `angle` lies in (min, max], so no label
 *          reads upside down. Scenes made before 2026-09-28 lack it; read it as off.
 * @property {Array<{id:string, type:string, x:number, y:number, symbol:Rect}>} nodes   EVERY node,
 *          on screen or not
 * @property {Array<{id:string, type:string, from:string, to:string, points:number[][],
 *            symbols:OBox[], arrows:OBox[]}>} links   EVERY link: its polyline, pump/valve
 *          symbol, and flow arrows
 * @property {Array<{id:string, text:string, box:OBox, leader?:number[][]}>} texts   the user's
 *          Text objects: fixed, never moved, never covered
 * @property {Array<{id:string, box:Rect}>} customers   customer symbols (fixed boxes)
 * @property {Array<LabelReq>} labels       the labels REQUESTED at this view (owner on screen)
 *
 * @typedef {Object} LabelReq
 * @property {string} id                    'n:<node>' | 'l:<link>' | 'c:<customer>' | 't:<text>'
 * @property {string} owner                 the element id
 * @property {'node'|'link'|'customer'|'text'} kind
 * @property {Pt}     anchor                where the label belongs: the node centre, or the
 *          point half-way along its pipe
 * @property {Array<{field:string, text:string, w:number, h:number}>} rows   in display order,
 *          each measured
 * @property {'stack'|'line'} layout        its usual shape: a node label stacks, a pipe label is
 *          one line. A placer may choose the other (H-a) and says so in its output.
 * @property {Pt|null} hand                 the leader end point the USER dragged it to, or null.
 *          A hand-placed label must stay attached there and must be shown (N4).
 * @property {boolean} [along]              a pipe label only: true when the setting above asks this
 *          label to lie ALONG its pipe (turned to the pipe where it sits, read the right way up,
 *          beside the line), which R14 asks for when there is space available. False for a label
 *          the user dragged, which opts out; absent (false) on a node label.
 *
 * @typedef {Object} Placement              ONE LABEL'S ANSWER. Missing or {shown:false} = hidden.
 * @property {boolean} shown
 * @property {number[]} rows                indices into LabelReq.rows that are shown, ascending
 * @property {'stack'|'line'} [layout]      default: the label's own
 * @property {'left'|'right'|'center'} [align]   how rows of different widths line up in a stack,
 *          justified to the side its leader arrives from (R5: a label hanging west of its node,
 *          with its leader arriving from the east, is right-aligned and grows west). Default left.
 * @property {number} x                     top-left of the UNTURNED text block
 * @property {number} y
 * @property {number} [angle]               degrees, turned about the block's centre (a pipe label
 *          lying along its pipe). Default 0.
 * @property {number[][]|null} leader       null, or [[ax,ay],[bx,by]] a straight leader from the
 *          owner, or [[ax,ay],[hx,hy],[bx,by]] the one standard hook: the last leg horizontal and
 *          no longer than scene.text.hookMaxPx. The first point is on the owner (within its symbol,
 *          or on its pipe); the last touches the text block.
 * @property {Array<{x:number, y:number, angle?:number}>} [repeats]   further copies of the same
 *          rows along a long pipe (optional; only the shipped placer uses it)
 *
 * @typedef {Object} Placer
 * @property {string} name
 * @property {function(Scene, {prev:{scene:Scene, layout:Object}|null}):{labels:Object<string,Placement>}} place
 * @property {function(number, {scene:Scene, opening:boolean}):void} [idle]   called between views
 *          with a time budget in ms, so a placer can think during the breathers and cache (H-b)
 * A module exports either a Placer or {create: () => Placer}; create() is called once per scene
 * set (one project opened), so a cache cannot leak between projects.
 */

// **1.5 PX OF OVERLAP IS LEADING, NOT INK.** A row's box is its line PITCH (1.2 em), which carries
// about 0.1 em of leading above and below the glyphs; two boxes can share 1.5 px at 12 px text
// before any glyph touches another. The shipped placer's own boxes are 1.1 em for the first row,
// so a stricter tolerance reports its touching labels as overlapping when no ink is.
const EPS = 1.5;

function blockSize(req, pl, text) {
	const layout = pl.layout || req.layout;
	const rows = (pl.rows || []).map(function (i) { return req.rows[i]; }).filter(Boolean);
	if (!rows.length) { return { w: 0, h: 0, rows: rows, layout: layout }; }
	if (layout === 'line') {
		return { w: rows.reduce(function (a, r) { return a + r.w; }, 0) + (rows.length - 1) * text.separatorW,
			h: Math.max.apply(null, rows.map(function (r) { return r.h; })), rows: rows, layout: layout };
	}
	return { w: Math.max.apply(null, rows.map(function (r) { return r.w; })),
		h: rows.reduce(function (a, r) { return a + r.h; }, 0), rows: rows, layout: layout };
}

// The ink of one placement: one OBox per row of a stack (the staircase, so the empty ground beside
// a short row stays free), one for a line, and the same again for every repeat.
function placementBoxes(req, pl, text) {
	const bs = blockSize(req, pl, text), out = [];
	if (!bs.rows.length) { return out; }
	function at(x, y, angle) {
		const a = angle || 0, rad = a * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
		const bcx = x + bs.w / 2, bcy = y + bs.h / 2;
		function put(cx, cy, w, h) {
			const dx = cx - bcx, dy = cy - bcy;
			out.push({ cx: bcx + dx * cos - dy * sin, cy: bcy + dx * sin + dy * cos, w: w, h: h, angle: a });
		}
		if (bs.layout === 'line') { put(bcx, bcy, bs.w, bs.h); return; }
		let top = y;
		bs.rows.forEach(function (r) {
			const left = pl.align === 'right' ? x + bs.w - r.w : (pl.align === 'center' ? x + (bs.w - r.w) / 2 : x);
			put(left + r.w / 2, top + r.h / 2, r.w, r.h);
			top += r.h;
		});
	}
	at(pl.x, pl.y, pl.angle);
	(pl.repeats || []).forEach(function (r) { at(r.x, r.y, r.angle === undefined ? pl.angle : r.angle); });
	return out;
}

// What is wrong with a placement AS A STATEMENT, before any of it is scored. Returns a reason or
// null. An invalid placement is a break like N1, N3, N4 or N5: a placer must not rely on the bench
// guessing.
function invalidReason(req, pl, scene, owners) {
	if (!pl || !pl.shown) { return null; }
	if (!Array.isArray(pl.rows) || !pl.rows.length) { return 'shown with no rows'; }
	for (let i = 0; i < pl.rows.length; i++) {
		if (!(pl.rows[i] >= 0 && pl.rows[i] < req.rows.length) || (i && pl.rows[i] <= pl.rows[i - 1])) {
			return 'rows must be ascending indices into the request';
		}
	}
	if (!isFinite(pl.x) || !isFinite(pl.y)) { return 'no position'; }
	if (pl.layout && pl.layout !== 'stack' && pl.layout !== 'line') { return 'layout ' + pl.layout; }
	if (pl.align && ['left', 'right', 'center'].indexOf(pl.align) < 0) { return 'align ' + pl.align; }
	const L = pl.leader;
	if (L === null || L === undefined) { return null; }
	if (!Array.isArray(L) || L.length < 2 || L.length > 3 || !L.every(function (p) { return p && isFinite(p[0]) && isFinite(p[1]); })) {
		return 'a leader is null, two points, or three (the standard hook)';
	}
	if (L.length === 3) {
		const a = L[1], b = L[2];
		if (Math.abs(a[1] - b[1]) > EPS) { return 'the hook\'s last leg is not horizontal'; }
		if (Math.abs(a[0] - b[0]) > scene.text.hookMaxPx + EPS) { return 'the hook is longer than hookMaxPx'; }
	}
	// Starts on the owner.
	const o = owners[req.id];
	if (o && o.node) {
		const s = o.node.symbol, p = L[0];
		const d = Math.hypot(p[0] - o.node.x, p[1] - o.node.y);
		if (d > Math.max(s.w, s.h) / 2 + 1) { return 'the leader does not start on its node'; }
	} else if (o && o.link) {
		if (distToPolyline(L[0], o.link.points) > 1) { return 'the leader does not start on its pipe'; }
	}
	// Ends on its own text.
	const end = L[L.length - 1], boxes = placementBoxes(req, Object.assign({}, pl, { repeats: [] }), scene.text);
	const near = boxes.some(function (b) { return distToOBox(end, b) <= 1.5; });
	if (!near) { return 'the leader does not reach its text'; }
	return null;
}

// ---- geometry ------------------------------------------------------------------------------
function corners(b) {
	const rad = (b.angle || 0) * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad), hw = b.w / 2, hh = b.h / 2;
	return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(function (p) {
		return [b.cx + p[0] * c - p[1] * s, b.cy + p[0] * s + p[1] * c];
	});
}
function rectToOBox(r) { return { cx: r.x + r.w / 2, cy: r.y + r.h / 2, w: r.w, h: r.h, angle: 0 }; }
function shrink(b, by) { return { cx: b.cx, cy: b.cy, w: Math.max(0, b.w - 2 * by), h: Math.max(0, b.h - 2 * by), angle: b.angle || 0 }; }
// Separating axes: two boxes overlap when their projections overlap by more than EPS on every
// axis of either. Touching is not overlapping.
function boxesOverlap(a, b) {
	if (Math.abs(a.cx - b.cx) > (a.w + a.h + b.w + b.h)) { return false; }
	const A = corners(a), B = corners(b);
	const axes = [];
	[a, b].forEach(function (q) {
		const rad = (q.angle || 0) * Math.PI / 180;
		axes.push([Math.cos(rad), Math.sin(rad)], [-Math.sin(rad), Math.cos(rad)]);
	});
	for (let i = 0; i < axes.length; i++) {
		const ax = axes[i];
		let amin = Infinity, amax = -Infinity, bmin = Infinity, bmax = -Infinity;
		A.forEach(function (p) { const v = p[0] * ax[0] + p[1] * ax[1]; amin = Math.min(amin, v); amax = Math.max(amax, v); });
		B.forEach(function (p) { const v = p[0] * ax[0] + p[1] * ax[1]; bmin = Math.min(bmin, v); bmax = Math.max(bmax, v); });
		if (Math.min(amax, bmax) - Math.max(amin, bmin) <= EPS) { return false; }
	}
	return true;
}
function segsCross(p, q, r, s) {
	// Proper crossing of p-q and r-s; shared end points (within EPS) do not count.
	function near(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]) <= EPS; }
	if (near(p, r) || near(p, s) || near(q, r) || near(q, s)) { return false; }
	const d1 = cross(r, s, p), d2 = cross(r, s, q), d3 = cross(p, q, r), d4 = cross(p, q, s);
	return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0;
}
function cross(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
function pointInOBox(p, b) {
	const rad = -(b.angle || 0) * Math.PI / 180, dx = p[0] - b.cx, dy = p[1] - b.cy;
	const x = dx * Math.cos(rad) - dy * Math.sin(rad), y = dx * Math.sin(rad) + dy * Math.cos(rad);
	return Math.abs(x) < b.w / 2 && Math.abs(y) < b.h / 2;
}
// Does segment p-q pass through the INSIDE of box b (shrunk by EPS, so grazing is not a hit)?
function segHitsBox(p, q, b) {
	const s = shrink(b, EPS);
	if (!s.w || !s.h) { return false; }
	if (pointInOBox(p, s) || pointInOBox(q, s)) { return true; }
	const c = corners(s);
	for (let i = 0; i < 4; i++) {
		const a = c[i], d = c[(i + 1) % 4];
		const d1 = cross(a, d, p), d2 = cross(a, d, q), d3 = cross(p, q, a), d4 = cross(p, q, d);
		if (((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0))) { return true; }
	}
	return false;
}
function distToSeg(p, a, b) {
	const vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
	let t = L2 ? ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L2 : 0;
	t = Math.max(0, Math.min(1, t));
	return Math.hypot(p[0] - a[0] - t * vx, p[1] - a[1] - t * vy);
}
function distToPolyline(p, pts) {
	let d = Infinity;
	for (let i = 1; i < pts.length; i++) { d = Math.min(d, distToSeg(p, pts[i - 1], pts[i])); }
	return d;
}
function distToOBox(p, b) {
	const rad = -(b.angle || 0) * Math.PI / 180, dx = p[0] - b.cx, dy = p[1] - b.cy;
	const x = dx * Math.cos(rad) - dy * Math.sin(rad), y = dx * Math.sin(rad) + dy * Math.cos(rad);
	return Math.hypot(Math.max(0, Math.abs(x) - b.w / 2), Math.max(0, Math.abs(y) - b.h / 2));
}
function polylineLength(pts) {
	let d = 0;
	for (let i = 1; i < pts.length; i++) { d += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); }
	return d;
}

// **A SCENE WITH A MISSING OR NON-NUMERIC COORDINATE IS REFUSED.** Round 5 ran a whole round on
// generated pipes whose vertices were NaN in the page and null in the scene file; arithmetic read
// them as 0, so those pipes ran to the corner of the screen and nobody saw it. Returns the first
// problem found, as a sentence, or null when every coordinate is a finite number.
function sceneProblem(scene) {
	function num(v) { return typeof v === 'number' && isFinite(v); }
	function rect(r, what) { return r && num(r.x) && num(r.y) && num(r.w) && num(r.h) ? null : what + ' is not four finite numbers'; }
	function obox(b, what) { return b && num(b.cx) && num(b.cy) && num(b.w) && num(b.h) && num(b.angle || 0) ? null : what + ' is not a finite box'; }
	function pts(a, what) {
		if (!Array.isArray(a) || !a.length) { return what + ' has no points'; }
		for (let i = 0; i < a.length; i++) { if (!a[i] || !num(a[i][0]) || !num(a[i][1])) { return what + ' point ' + i + ' is ' + JSON.stringify(a[i]); } }
		return null;
	}
	const id = (scene && scene.id) || '?';
	let p = rect(scene && scene.viewport, id + ': viewport');
	if (p) { return p; }
	const v = scene.view;
	if (!v || !num(v.s) || !num(v.tx) || !num(v.ty)) { return id + ': view is not finite'; }
	for (const n of scene.nodes || []) {
		if (!num(n.x) || !num(n.y)) { return id + ': node ' + n.id + ' is at ' + JSON.stringify([n.x, n.y]); }
		if ((p = rect(n.symbol, id + ': node ' + n.id + ' symbol'))) { return p; }
	}
	for (const l of scene.links || []) {
		if ((p = pts(l.points, id + ': link ' + l.id))) { return p; }
		for (const b of (l.symbols || []).concat(l.arrows || [])) { if ((p = obox(b, id + ': link ' + l.id + ' symbol or arrow'))) { return p; } }
	}
	for (const t of scene.texts || []) {
		if ((p = obox(t.box, id + ': text ' + t.id))) { return p; }
		if (t.leader && (p = pts(t.leader, id + ': text ' + t.id + ' leader'))) { return p; }
	}
	for (const c of scene.customers || []) { if ((p = rect(c.box, id + ': customer ' + c.id))) { return p; } }
	for (const f of scene.furniture || []) { if ((p = rect(f, id + ': furniture'))) { return p; } }
	for (const r of scene.labels || []) {
		if (!r.anchor || !num(r.anchor.x) || !num(r.anchor.y)) { return id + ': label ' + r.id + ' anchor is ' + JSON.stringify(r.anchor); }
		if (r.hand && (!num(r.hand.x) || !num(r.hand.y))) { return id + ': label ' + r.id + ' hand point is ' + JSON.stringify(r.hand); }
		for (const row of r.rows || []) { if (!num(row.w) || !num(row.h)) { return id + ': label ' + r.id + ' row ' + row.field + ' has no measured size'; } }
	}
	return null;
}

// The drop order of one kind, FIRST TO GO first, with the ID in it (Tom, 2026-10-06: the ID is dropped
// like any other value, and a label keeps the last value in the user's order longest). A scene
// recorded before then names no 'id'; it is put first to go, where Tom's table (R-326) ranks it
// among Novato's fields.
function dropOrderOf(scene, kind) {
	const o = ((scene.dropOrder && scene.dropOrder[kind]) || []).slice();
	if (o.indexOf('id') < 0) { o.unshift('id'); }
	return o;
}
// A shown label gives up values in the user's order, so what it shows is what is LEFT when the first
// k have gone. It breaks that when it shows a row that comes earlier in the order than a row it
// hides: a bare ID beside a hidden last-in-order value is the case that matters. A row whose field
// is not in the order ranks before all that are. `shownIdx` is the placement's `rows`. Returns the
// hidden row's field that outranks a shown one, or null.
function dropOrderBreak(scene, req, shownIdx) {
	const order = dropOrderOf(scene, req.kind);
	const rank = function (i) { return order.indexOf(req.rows[i].field); };
	const shown = {};
	shownIdx.forEach(function (i) { shown[i] = true; });
	let minShown = Infinity;
	shownIdx.forEach(function (i) { minShown = Math.min(minShown, rank(i)); });
	let worst = null, worstRank = -Infinity;
	req.rows.forEach(function (r, i) {
		if (shown[i]) { return; }
		const k = rank(i);
		if (k > minShown && k > worstRank) { worst = r.field; worstRank = k; }
	});
	return worst;
}

module.exports = { dropOrderOf, dropOrderBreak, sceneProblem, EPS, blockSize, placementBoxes, invalidReason, corners, rectToOBox, boxesOverlap,
	segsCross, segHitsBox, distToSeg, distToPolyline, distToOBox, polylineLength, pointInOBox };
