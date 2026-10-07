// ROUND 7: THE DROP-ORDER PICTURE FOR TOM. JUDGES' SIDE.
//
//   node draw-drop-order.js <scene set file> <entrant> <step> <x0> <y0> <w> <h> <out.svg>
//
// The same view laid out twice by the same placer: on the left with the scene's own drop order (the
// app's default names no 'id', so the contract puts the ID first to go and a crowded label keeps a
// bare value such as "P=94.65"), on the right with the ID moved to LAST to go (a crowded label keeps
// a bare ID). Each panel is labelled with what it shows. Pipes grey, nodes dark, valves red.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const C = require('../../lpn-spike/label-bench/contract.js');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const M = require('./matrix.js');

const a = process.argv.slice(2);
const step = +a[2], X0 = +a[3], Y0 = +a[4], W = +a[5], H = +a[6], out = a[7];
function load() {
	const set = JSON.parse(fs.readFileSync(a[0], 'utf8'));
	set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
	set.steps = set.steps.slice(0, step + 1);
	return set;
}
function idLast(order) { return order.filter(function (f) { return f !== 'id'; }).concat(['id']); }
const esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
const poly = function (b, dx) { return C.corners(b).map(function (p) { return (p[0] + dx).toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); };

function panel(set, dx, title) {
	const res = runBench(M.PLACERS[a[1]].path, [set], {})[0];
	const scene = set.steps[step], L = res.steps[step].layout.labels || {}, g = [];
	scene.links.forEach(function (l) {
		g.push('<polyline fill="none" stroke="#9aa" stroke-width="1.2" points="' + l.points.map(function (p) { return (p[0] + dx) + ',' + p[1]; }).join(' ') + '"/>');
		(l.symbols || []).forEach(function (b) { g.push('<polygon fill="#a33" points="' + poly(b, dx) + '"/>'); });
	});
	scene.nodes.forEach(function (n) { g.push('<rect fill="#245" x="' + (n.symbol.x + dx) + '" y="' + n.symbol.y + '" width="' + n.symbol.w + '" height="' + n.symbol.h + '"/>'); });
	let shown = 0, inCrop = 0, idOnly = 0, valueOnly = 0;
	scene.labels.forEach(function (req) {
		const inside = req.anchor.x >= X0 && req.anchor.x <= X0 + W && req.anchor.y >= Y0 && req.anchor.y <= Y0 + H;
		if (inside) { inCrop++; }
		const p = L[req.id];
		if (!p || !p.shown) { return; }
		if (inside) {
			shown++;
			if (p.rows.length === 1) { if (req.rows[p.rows[0]].field === 'id') { idOnly++; } else { valueOnly++; } }
		}
		const rows = p.rows.map(function (i) { return req.rows[i].text; });
		C.placementBoxes(req, p, scene.text).forEach(function (b, i) {
			const t = (p.layout || req.layout) === 'line' ? rows.join(scene.text.separator) : rows[i];
			g.push('<text font-size="11" font-family="sans-serif" fill="#111" text-anchor="middle" dominant-baseline="central" transform="translate(' + (b.cx + dx) + ',' + b.cy + ') rotate(' + (b.angle || 0) + ')">' + esc(t) + '</text>');
		});
		if (p.leader) { g.push('<polyline fill="none" stroke="#333" stroke-width="0.7" points="' + p.leader.map(function (q) { return (q[0] + dx) + ',' + q[1]; }).join(' ') + '"/>'); }
	});
	g.push('<rect x="' + (X0 + dx) + '" y="' + Y0 + '" width="' + W + '" height="38" fill="#fff" opacity="0.94"/>');
	g.push('<text x="' + (X0 + dx + 6) + '" y="' + (Y0 + 15) + '" font-size="13" font-family="sans-serif" font-weight="bold">' + esc(title) + '</text>');
	g.push('<text x="' + (X0 + dx + 6) + '" y="' + (Y0 + 32) + '" font-size="12" font-family="sans-serif">' + esc(shown + ' of ' + inCrop + ' labels shown here; ' + idOnly + ' bare IDs, ' + valueOnly + ' bare values') + '</text>');
	return { svg: g.join('\n'), shown: shown, inCrop: inCrop, idOnly: idOnly, valueOnly: valueOnly };
}

const A = load(), B = load();
B.steps.forEach(function (s) { s.dropOrder = { node: idLast(C.dropOrderOf(s, 'node')), link: idLast(C.dropOrderOf(s, 'link')), customer: [] }; });
const left = panel(A, -X0, 'Default order: ID goes first'), right = panel(B, W + 20 - X0, 'ID moved to last: the ID stays');
fs.writeFileSync(out, '<svg xmlns="http://www.w3.org/2000/svg" width="' + 2 * (2 * W + 20) + '" height="' + 2 * H + '" viewBox="0 ' + Y0 + ' ' + (2 * W + 20) + ' ' + H + '">'
	+ '<rect x="0" y="' + Y0 + '" width="' + (2 * W + 20) + '" height="' + H + '" fill="#fff"/><clipPath id="l"><rect x="0" y="' + Y0 + '" width="' + W + '" height="' + H + '"/></clipPath>'
	+ '<clipPath id="r"><rect x="' + (W + 20) + '" y="' + Y0 + '" width="' + W + '" height="' + H + '"/></clipPath>'
	+ '<g clip-path="url(#l)">' + left.svg + '</g><g clip-path="url(#r)">' + right.svg + '</g>'
	+ '<line x1="' + (W + 10) + '" y1="' + Y0 + '" x2="' + (W + 10) + '" y2="' + (Y0 + H) + '" stroke="#ccc" stroke-width="2"/></svg>\n');
console.log(JSON.stringify({ left: { shown: left.shown, inCrop: left.inCrop, idOnly: left.idOnly, valueOnly: left.valueOnly }, right: { shown: right.shown, inCrop: right.inCrop, idOnly: right.idOnly, valueOnly: right.valueOnly } }));
