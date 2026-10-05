// ROUND 6: ONE PLACER ON ONE SCENE SET (in one arm), every view scored. One JSON object per view on
// stdout. Run by score-all.js as a child process, so a placer that hangs costs one cell.
//
//   node score-one.js <placer> <scene file> <master file> <arm: full|two|one> <probe: 0|1>
//
// The bench's runBench() (fresh placer per set, idle 3000 ms before the first view and 250 ms
// between views, `prev` passed), scored by rank, Tom's weights, round 5's missed room (G), then
// round 6's: coverage against the FULL request (metrics6.js), the gaps between a node's pipes, R1's
// two halves (judges/r1.js), the count probe on matrix.PROBE_STEPS when <probe> is 1.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const TOM = require('../../lpn-spike/label-bench/judges/weights.js');
const R1 = require('../../lpn-spike/label-bench/judges/r1.js');
const M = require('./matrix.js');
const Mx = require('../round-5-2026-09-29/metrics.js');
const M6 = require('./metrics6.js');

const name = process.argv[2], sceneFile = process.argv[3], masterFile = process.argv[4];
const arm = process.argv[5] || 'full', probe = process.argv[6] === '1';
const full = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
full.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
const set = arm === 'full' ? full : Object.assign({}, full, { id: full.id + '#' + arm, steps: full.steps.map(function (s) { return M6.armScene(s, arm); }) });

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
	const g = Mx.missedRoom(scene, st.layout, 3), cov = M6.coverage(full.steps[k], scene, st.layout);
	const out = {
		set: full.id, arm: arm, view: st.id, step: k, mult: scene.zoom || null, placer: name,
		labelsReq: s.labelsReq, labelsShown: s.labelsShown, rowsReq: s.rowsReq, rowsShown: s.rowsShown,
		valuesReq: cov.valuesReq, valuesShown: cov.values, topReq: cov.topReq, topShown: cov.top, idsShown: cov.ids,
		N1: b.N1.length, N3: b.N3.length, N4: b.N4.length, N5: b.N5.length, invalid: b.invalid.length,
		breakSample: b.N1.concat(b.N3, b.N4, b.N5, b.invalid).slice(0, 3),
		costRank: s.cost, costTom: +tom.toFixed(2),
		leaderOnLeader: s.counts.leaderOnLeader, labelOnLeader: s.counts.labelOnLeader, labelOnLink: s.counts.labelOnLink,
		leaderOnLink: s.counts.leaderOnLink,
		leaders: s.leaderLH.length, leaderMed: q(s.leaderLH, 0.5), leaderP90: q(s.leaderLH, 0.9), leaderMax: q(s.leaderLH, 1),
		ms: +st.ms.toFixed(2),
		compared: st.stability ? st.stability.compared : null, churn: st.stability ? st.stability.churn : null,
		regained: st.zoomIn ? st.zoomIn.regained : null, lost: st.zoomIn ? st.zoomIn.lost : null,
		r14asked: s.r14.asked, r14along: s.r14.along, r14missed: s.r14.missedWithRoom,
		hidden: g.hidden, hiddenWithRoom: g.hiddenWithRoom, cut: g.cut, cutWithRoom: g.cutWithRoom
	};
	if (arm === 'full') {
		// R1's first half by kind (the judges' room.js through round 5's grid: the same G search).
		let hn = 0, hnr = 0, hl = 0, hlr = 0;
		const L = (st.layout && st.layout.labels) || {}, O = Mx.index(scene, st.layout);
		scene.labels.forEach(function (req) {
			if (req.hand || (L[req.id] && L[req.id].shown)) { return; }
			const room = Mx.roomWithinReach(scene, O, req, R1.smallestRows(req), 3);
			if (req.kind === 'node') { hn++; if (room) { hnr++; } } else if (req.kind === 'link') { hl++; if (room) { hlr++; } }
		});
		Object.assign(out, { hidNode: hn, hidNodeRoom: hnr, hidLink: hl, hidLinkRoom: hlr });
		out.gap = M6.gapStats(scene, st.layout);
		if (probe && name !== 'master' && M.PROBE_STEPS.indexOf(k) >= 0) {
			const c = R1.countProbe(placer, scene);
			out.probe = { farHidden: c.farHidden, revived: c.revived, farShown: c.farShown, lostFar: c.lostFar,
				controlFlips: c.controlFlips, controlLabels: c.controlLabels };
		}
	}
	if (k === 0) { out.idleMs = +res.idleMs.toFixed(0); }
	process.stdout.write(JSON.stringify(out) + '\n');
});
process.exit(0);
