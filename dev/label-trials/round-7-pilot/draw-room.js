// ROUND 7 PILOT: DRAW WHAT THE MEASURER CALLS "ROOM", to check it by eye. JUDGES' SIDE.
//
//   node draw-room.js <scene set file> <placer A|B|C|D> <step> <x0> <y0> <w> <h> <out.svg>
//
// The placer's layout of that view in black (rows as boxes with their text, leaders), pipes grey,
// node symbols and valve symbols dark, and for every label the placer HID, a red dot at its anchor
// and, where judges/room.js's search finds free ground for its smallest form, that spot as a red
// dashed box with its leader. Each hidden label is asked about alone, against the finished layout,
// exactly as the R1 judge asks: two red boxes may claim the same ground.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const C = require('../../lpn-spike/label-bench/contract.js');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const R1 = require('../../lpn-spike/label-bench/judges/r1.js');
const Mx = require('../round-5-2026-09-29/metrics.js');
const M = require('../round-6-2026-10-05/matrix.js');
const RP = require('./repair.js');

const a = process.argv.slice(2);
const set = JSON.parse(fs.readFileSync(a[0], 'utf8')), step = +a[2];
const X0 = +a[3], Y0 = +a[4], W = +a[5], H = +a[6], out = a[7];
set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
set.steps = set.steps.slice(0, step + 1);
const res = runBench(M.PLACERS[a[1]].path, [set], {})[0];
const scene = set.steps[step], L = res.steps[step].layout.labels || {};
const O = Mx.index(scene, { labels: L });
const esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
const poly = function (b) { return C.corners(b).map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); };
const g = [];
scene.links.forEach(function (l) {
	g.push('<polyline fill="none" stroke="#9aa" stroke-width="1.2" points="' + l.points.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '"/>');
	(l.symbols || []).forEach(function (b) { g.push('<polygon fill="#a33" points="' + poly(b) + '"/>'); });
});
scene.nodes.forEach(function (n) { g.push('<rect fill="#245" x="' + n.symbol.x + '" y="' + n.symbol.y + '" width="' + n.symbol.w + '" height="' + n.symbol.h + '"/>'); });
let hidden = 0, room = 0;
scene.labels.forEach(function (req) {
	const p = L[req.id];
	if (p && p.shown) {
		const bs = C.placementBoxes(req, p, scene.text);
		const rows = p.rows.map(function (i) { return req.rows[i].text; });
		bs.forEach(function (b, i) {
			g.push('<polygon fill="rgba(255,255,255,0.75)" stroke="#000" stroke-width="0.4" points="' + poly(b) + '"/>');
			const t = p.layout === 'line' || (p.layout || req.layout) === 'line' ? rows.join(scene.text.separator) : rows[i];
			g.push('<text font-size="10" font-family="monospace" text-anchor="middle" dominant-baseline="central" transform="translate(' + b.cx + ',' + b.cy + ') rotate(' + (b.angle || 0) + ')">' + esc(t) + '</text>');
		});
		if (p.leader) { g.push('<polyline fill="none" stroke="#000" stroke-width="0.8" points="' + p.leader.map(function (q) { return q.join(','); }).join(' ') + '"/>'); }
		return;
	}
	if (req.hand) { return; }
	if (req.anchor.x < X0 || req.anchor.x > X0 + W || req.anchor.y < Y0 || req.anchor.y > Y0 + H) { return; }
	hidden++;
	g.push('<circle fill="red" r="2.5" cx="' + req.anchor.x + '" cy="' + req.anchor.y + '"/>');
	const rows = R1.smallestRows(req, scene), pl = RP.spot(scene, O, req, rows, 3);
	if (!pl) { return; }
	room++;
	C.placementBoxes(req, pl, scene.text).forEach(function (b) {
		g.push('<polygon fill="rgba(255,0,0,0.08)" stroke="red" stroke-dasharray="3,2" stroke-width="1" points="' + poly(b) + '"/>');
		g.push('<text font-size="10" fill="red" font-family="monospace" text-anchor="middle" dominant-baseline="central" x="' + b.cx + '" y="' + b.cy + '">' + esc(req.rows[rows[0]].text) + '</text>');
	});
	if (pl.leader) { g.push('<polyline fill="none" stroke="red" stroke-width="1" points="' + pl.leader.map(function (q) { return q.join(','); }).join(' ') + '"/>'); }
});
fs.writeFileSync(out, '<svg xmlns="http://www.w3.org/2000/svg" width="' + (W * 2) + '" height="' + (H * 2) + '" viewBox="' + X0 + ' ' + Y0 + ' ' + W + ' ' + H + '">' +
	'<rect x="' + X0 + '" y="' + Y0 + '" width="' + W + '" height="' + H + '" fill="#fff"/>' + g.join('\n') + '</svg>\n');
console.log(out + ': ' + hidden + ' hidden labels in the crop, ' + room + ' with room by the measurer');
