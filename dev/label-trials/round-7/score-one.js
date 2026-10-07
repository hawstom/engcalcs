// ROUND 7: ONE ENTRANT ON ONE SCENE SET, every view scored. One JSON object per view on stdout. Run by
// score-all.js as a child process, so an entrant that hangs costs one cell. JUDGES' SIDE.
//
//   node score-one.js <entrant> <scene file> <probe: 0|1>
//
// The bench's runBench() (fresh placer per set, idle 3000 ms before the first view and 250 ms between,
// `prev` passed), scored by rank and Tom's weights, round 6's coverage (labels, values, most-wanted
// value, IDs), and R1's first half three ways (round-7-plan.md §4.4): the public room score
// (room-check.js, what the builders self-test with), the held-back room score and realizable room
// (judges/room-held.js). R1's second half: the count probe on matrix.PROBE_STEPS when <probe> is 1.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const TOM = require('../../lpn-spike/label-bench/judges/weights.js');
const R1 = require('../../lpn-spike/label-bench/judges/r1.js');
const RC = require('../../lpn-spike/label-bench/room-check.js');
const RH = require('../../lpn-spike/label-bench/judges/room-held.js');
const M6 = require('../round-6-2026-10-05/metrics6.js');
const RP = require('../round-7-pilot/repair.js');
const M = require('./matrix.js');

const name = process.argv[2], sceneFile = process.argv[3], probe = process.argv[4] === '1';
const set = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
const E = M.PLACERS[name];
if (!E) { console.error('unknown entrant ' + name); process.exit(2); }
const placer = E.repair ? RP.wrap(E.inner, E.repair) : E.path;

const res = runBench(placer, [set], {})[0];
function q(arr, p) { if (!arr.length) { return null; } const s = arr.slice().sort(function (a, b) { return a - b; }); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; }
res.steps.forEach(function (st, k) {
	const scene = set.steps[k], s = st.score, b = s.breaks;
	let tom = 0;
	Object.keys(s.counts).forEach(function (c) { tom += s.counts[c] * (TOM[c] || 0); });
	const cov = M6.coverage(scene, scene, st.layout);
	const pub = RC.roomReport(scene, st.layout), held = RH.heldBackRoom(scene, st.layout), real = RH.realizableRoom(scene, st.layout);
	const out = {
		set: set.id, view: st.id, step: k, mult: scene.zoom || null, placer: name,
		labelsReq: s.labelsReq, labelsShown: s.labelsShown, rowsReq: s.rowsReq, rowsShown: s.rowsShown,
		valuesReq: cov.valuesReq, valuesShown: cov.values, topReq: cov.topReq, topShown: cov.top, idsShown: cov.ids,
		N1: b.N1.length, N3: b.N3.length, N4: b.N4.length, N5: b.N5.length, invalid: b.invalid.length,
		breakSample: b.N1.concat(b.N3, b.N4, b.N5, b.invalid).slice(0, 3),
		costRank: s.cost, costTom: +tom.toFixed(2),
		leaderOnLeader: s.counts.leaderOnLeader, labelOnLeader: s.counts.labelOnLeader, labelOnLink: s.counts.labelOnLink, leaderOnLink: s.counts.leaderOnLink,
		leaderMed: q(s.leaderLH, 0.5), leaderP90: q(s.leaderLH, 0.9),
		ms: +st.ms.toFixed(2),
		compared: st.stability ? st.stability.compared : null, churn: st.stability ? st.stability.churn : null,
		regained: st.zoomIn ? st.zoomIn.regained : null, lost: st.zoomIn ? st.zoomIn.lost : null,
		r14asked: s.r14.asked, r14along: s.r14.along, r14missed: s.r14.missedWithRoom, r14zoom: s.r14.zoom,
		hidden: pub.hidden, pubRoom: pub.hiddenWithRoom, cut: pub.cut, pubCutRoom: pub.cutWithRoom,
		heldRoom: held.withRoom, realBrought: real.brought, realRequested: real.requested
	};
	if (probe && M.PROBE_STEPS.indexOf(k) >= 0 && !E.repair) {
		const c = R1.countProbe(E.path, scene);
		out.probe = { farHidden: c.farHidden, revived: c.revived, farShown: c.farShown, lostFar: c.lostFar, controlFlips: c.controlFlips, controlLabels: c.controlLabels };
	}
	if (k === 0) { out.idleMs = +res.idleMs.toFixed(0); }
	process.stdout.write(JSON.stringify(out) + '\n');
});
process.exit(0);
