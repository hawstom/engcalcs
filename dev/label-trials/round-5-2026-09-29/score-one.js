// ROUND 5: ONE PLACER ON ONE SCENE SET, every view scored. Prints one JSON object per view (a line
// each) to stdout. Run by score-all.js as a child process, so a placer that hangs or runs out of
// memory costs one cell, not the round.
//
//   node score-one.js <placer name> <scene file> [<master file>]
//
// The bench's own runBench() (fresh placer per set, idle 3000 ms before the first view and 250 ms
// between views, as the bench runs it), scoreView() by rank, then Tom's weights on the same counts,
// and metrics.js's missed room (G).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const TOM = require('../../lpn-spike/label-bench/judges/weights.js');
const M = require('./matrix.js');
const Mx = require('./metrics.js');

const name = process.argv[2], sceneFile = process.argv[3], masterFile = process.argv[4];
const set = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });

let placer;
if (name === 'master') {
	const rec = {};
	JSON.parse(fs.readFileSync(masterFile, 'utf8')).steps.forEach(function (s) { rec[s.id] = s; });
	placer = { name: 'master (replayed)', place: function (scene) { const r = rec[scene.id]; return { labels: r.labels, recordedMs: r.ms }; } };
} else {
	placer = M.PLACERS[name].path;
}
const res = runBench(placer, [set], {})[0];
function q(arr, p) { if (!arr.length) { return null; } const s = arr.slice().sort(function (a, b) { return a - b; }); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; }
res.steps.forEach(function (st, k) {
	const scene = set.steps[k], s = st.score, b = s.breaks;
	let tom = 0;
	Object.keys(s.counts).forEach(function (c) { tom += s.counts[c] * (TOM[c] || 0); });
	const g = Mx.missedRoom(scene, st.layout, 3), v = Mx.values(scene, st.layout);
	const out = {
		set: set.id, view: st.id, step: k, mult: scene.zoom || null, placer: name,
		labelsReq: s.labelsReq, labelsShown: s.labelsShown, rowsReq: s.rowsReq, rowsShown: s.rowsShown,
		valuesReq: v.req, valuesShown: v.shown,
		N1: b.N1.length, N3: b.N3.length, N4: b.N4.length, N5: b.N5.length, invalid: b.invalid.length,
		breakSample: b.N1.concat(b.N3, b.N4, b.N5, b.invalid).slice(0, 3),
		costRank: s.cost, costTom: +tom.toFixed(2),
		leaderOnLeader: s.counts.leaderOnLeader, labelOnLeader: s.counts.labelOnLeader, labelOnLink: s.counts.labelOnLink,
		leaderOnLink: s.counts.leaderOnLink,
		leaders: s.leaderLH.length, leaderMed: q(s.leaderLH, 0.5), leaderP90: q(s.leaderLH, 0.9), leaderMax: q(s.leaderLH, 1),
		ms: +st.ms.toFixed(2),
		compared: st.stability ? st.stability.compared : null, moved: st.stability ? st.stability.moved : null,
		churn: st.stability ? st.stability.churn : null,
		regained: st.zoomIn ? st.zoomIn.regained : null, lost: st.zoomIn ? st.zoomIn.lost : null,
		r14asked: s.r14.asked, r14along: s.r14.along, r14missed: s.r14.missedWithRoom,
		r7checked: s.r7.checked, r7onOwn: s.r7.onOwnPipe, r5checked: s.r5.checked, r5mismatch: s.r5.mismatch,
		hidden: g.hidden, hiddenWithRoom: g.hiddenWithRoom, cut: g.cut, cutWithRoom: g.cutWithRoom
	};
	if (k === 0) { out.idleMs = +res.idleMs.toFixed(0); }
	process.stdout.write(JSON.stringify(out) + '\n');
});
process.exit(0);
