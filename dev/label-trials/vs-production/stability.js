// LABEL STABILITY ACROSS SMALL EDITS AND PANS (the "stable modelling" question). JUDGES' SIDE.
//
//   node stability.js <entrant> <stab scene file> [<replay dir>]      one JSON line per comparison
//
// The scene sets are the bench's stability sequence (extract.js, spec.stab): at 1x and 2x, base,
// control (the same view again), edit (one node's elevation retyped with an extra leading digit, so
// its Z row is one character wider; no re-solve), undo, and a pan of a tenth of the canvas width.
// The placer runs through them in order with `prev`, as on the page.
//
// THE METRIC. Between two consecutive views, over the labels requested in both and shown in either
// (the edited label itself left out): a label CHANGED if it appeared or vanished, or, shown in both,
// it shows other rows, turned (angle differs by more than half a degree), or its block moved more
// than 1 px against its own anchor (so a pan, which carries every anchor, moves nothing by itself).
// Unlike the bench's churn, a change that shows more still counts: this asks what the reader sees
// move, not whether the move paid.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const M = require('../round-7/matrix.js');

const name = process.argv[2], sceneFile = process.argv[3];
if (process.argv[4]) { process.env.VSP_REPLAY_DIR = process.argv[4]; }
const set = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
const placer = (name === 'PROD' || name === 'MAST') ? path.join(__dirname, 'replay.js') : M.PLACERS[name].path;
const res = runBench(placer, [set], {})[0];

function compare(sa, la, sb, lb, skip) {
	const A = {}, out = { compared: 0, shownEither: 0, shownBefore: 0, changed: 0, appeared: 0, vanished: 0, moved: 0, rows: 0, turned: 0 };
	sa.labels.forEach(function (r) { A[r.id] = r; });
	sb.labels.forEach(function (rb) {
		const ra = A[rb.id];
		if (!ra || rb.id === skip) { return; }
		out.compared++;
		const pa = la.labels[rb.id], pb = lb.labels[rb.id];
		const ha = !!(pa && pa.shown), hb = !!(pb && pb.shown);
		if (ha) { out.shownBefore++; }
		if (!ha && !hb) { return; }
		out.shownEither++;
		if (ha !== hb) { out.changed++; out[hb ? 'appeared' : 'vanished']++; return; }
		const rowsDiff = JSON.stringify(pa.rows) !== JSON.stringify(pb.rows) || pa.layout !== pb.layout;
		const turned = Math.abs((pa.angle || 0) - (pb.angle || 0)) > 0.5;
		const moved = Math.abs((pa.x - ra.anchor.x) - (pb.x - rb.anchor.x)) > 1 || Math.abs((pa.y - ra.anchor.y) - (pb.y - rb.anchor.y)) > 1;
		if (rowsDiff) { out.rows++; }
		if (turned) { out.turned++; }
		if (moved) { out.moved++; }
		if (rowsDiff || turned || moved) { out.changed++; }
	});
	return out;
}
for (let k = 1; k < res.steps.length; k++) {
	const sa = set.steps[k - 1], sb = set.steps[k];
	const kind = sb.id.split('-').pop();       // control, edit, undo, pan (base follows a zoom: skipped)
	if (kind === 'base') { continue; }
	const c = compare(sa, res.steps[k - 1].layout, sb, res.steps[k].layout, sb.edited || sa.edited);
	const ed = sb.edited || sa.edited, pe = ed && res.steps[k].layout.labels[ed];
	c.editedShown = ed ? !!(pe && pe.shown) : null;
	process.stdout.write(JSON.stringify(Object.assign({ placer: name, set: set.id, kind: kind, mult: sb.zoom, ms: +res.steps[k].ms.toFixed(1) }, c)) + '\n');
}
process.exit(0);
