// ONE ENTRANT ON ONE SCENE SET, scored exactly as round 7's score-one.js scores it (same bench, same
// judges' measures), one JSON line per view. JUDGES' SIDE.
//
//   node score-one.js <entrant> <scene file> [<replay dir>]
//
// <entrant> is A7..D7 (round 7's frozen placers) or PROD / MAST (replay.js, reading <replay dir>).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const TOM = require('../../lpn-spike/label-bench/judges/weights.js');
const RC = require('../../lpn-spike/label-bench/room-check.js');
const RH = require('../../lpn-spike/label-bench/judges/room-held.js');
const M6 = require('../round-6-2026-10-05/metrics6.js');
const M = require('../round-7/matrix.js');

const name = process.argv[2], sceneFile = process.argv[3];
if (process.argv[4]) { process.env.VSP_REPLAY_DIR = process.argv[4]; }
const set = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
const placer = (name === 'PROD' || name === 'MAST') ? path.join(__dirname, 'replay.js') : M.PLACERS[name].path;

const res = runBench(placer, [set], {})[0];
function q(arr, p) { if (!arr.length) { return null; } const s = arr.slice().sort(function (a, b) { return a - b; }); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; }
const variant = /-bmany-vmany/.test(set.id) ? 'both' : 'plain';
res.steps.forEach(function (st, k) {
	const scene = set.steps[k], s = st.score, b = s.breaks;
	let tom = 0;
	Object.keys(s.counts).forEach(function (c) { tom += s.counts[c] * (TOM[c] || 0); });
	const cov = M6.coverage(scene, scene, st.layout);
	const pub = RC.roomReport(scene, st.layout), held = RH.heldBackRoom(scene, st.layout), real = RH.realizableRoom(scene, st.layout);
	process.stdout.write(JSON.stringify({
		set: set.id, view: st.id, step: k, mult: scene.zoom || null, placer: name, exp: 'E1', variant: variant,
		labelsReq: s.labelsReq, labelsShown: s.labelsShown, rowsReq: s.rowsReq, rowsShown: s.rowsShown,
		valuesReq: cov.valuesReq, valuesShown: cov.values, topReq: cov.topReq, topShown: cov.top, idsShown: cov.ids,
		N1: b.N1.length, N3: b.N3.length, N4: b.N4.length, N5: b.N5.length, invalid: b.invalid.length,
		costRank: s.cost, costTom: +tom.toFixed(2), labelOnSymbol: s.counts.labelOnSymbol, labelOnLabel: s.counts.labelOnLabel,
		leaderOnLeader: s.counts.leaderOnLeader, labelOnLeader: s.counts.labelOnLeader, labelOnLink: s.counts.labelOnLink, leaderOnLink: s.counts.leaderOnLink,
		leaderMed: q(s.leaderLH, 0.5), leaderP90: q(s.leaderLH, 0.9),
		ms: +st.ms.toFixed(2),
		compared: st.stability ? st.stability.compared : null, churn: st.stability ? st.stability.churn : null,
		r14asked: s.r14.asked, r14along: s.r14.along, r14missed: s.r14.missedWithRoom,
		hidden: pub.hidden, pubRoom: pub.hiddenWithRoom, heldRoom: held.withRoom, realBrought: real.brought, realRequested: real.requested
	}) + '\n');
});
process.exit(0);
