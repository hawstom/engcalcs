// ROUND 7 PILOT: the repair pass (repair.js) on round 6's bent-and-valved E1 networks, beside the
// placers it repairs. One line of JSON per (placer, mode, set, view) on stdout. JUDGES' SIDE.
//
//   node dev/label-trials/round-7-pilot/run-pilot.js <scene dir> [--placers A,B,C,D,empty] [--modes none,rich,lean]
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { runBench } = require('../../lpn-spike/label-bench/run.js');
const R1 = require('../../lpn-spike/label-bench/judges/r1.js');
const TOM = require('../../lpn-spike/label-bench/judges/weights.js');
const Mx = require('../round-5-2026-09-29/metrics.js');
const M6 = require('../round-6-2026-10-05/metrics6.js');
const M = require('../round-6-2026-10-05/matrix.js');
const RP = require('./repair.js');

const a = process.argv.slice(2), dir = a[0];
const opt = function (k, d) { const i = a.indexOf(k); return i >= 0 ? a[i + 1].split(',') : d; };
const placers = opt('--placers', ['A', 'B', 'C', 'D', 'empty']), modes = opt('--modes', ['none', 'rich', 'lean']);
const files = fs.readdirSync(dir).filter(function (f) { return /\.json$/.test(f); }).sort();

files.forEach(function (f) {
	const set = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
	set.steps.forEach(function (s) { s.text.repeatSpacingPx = 0.75 * Math.min(s.viewport.w, s.viewport.h); });
	placers.forEach(function (p) {
		modes.forEach(function (mode) {
			if (p === 'empty' && mode === 'none') { return; }
			const mod = RP.wrap(p === 'empty' ? null : M.PLACERS[p].path, mode);
			const res = runBench(mod, [set], {})[0];
			res.steps.forEach(function (st, k) {
				const scene = set.steps[k], s = st.score, b = s.breaks, L = (st.layout && st.layout.labels) || {};
				const O = Mx.index(scene, st.layout);
				let hidden = 0, roomSmall = 0;
				scene.labels.forEach(function (req) {
					if (req.hand || (L[req.id] && L[req.id].shown)) { return; }
					hidden++;
					if (Mx.roomWithinReach(scene, O, req, R1.smallestRows(req, scene), 3)) { roomSmall++; }
				});
				const g = Mx.missedRoom(scene, st.layout, 3), cov = M6.coverage(scene, scene, st.layout);
				let tom = 0;
				Object.keys(s.counts).forEach(function (c) { tom += s.counts[c] * (TOM[c] || 0); });
				process.stdout.write(JSON.stringify({
					set: set.id, placer: p, mode: mode, step: k,
					labelsReq: s.labelsReq, labelsShown: s.labelsShown, rowsReq: s.rowsReq, rowsShown: s.rowsShown,
					valuesReq: cov.valuesReq, valuesShown: cov.values, topReq: cov.topReq, topShown: cov.top, idsShown: cov.ids,
					breaks: b.N1.length + b.N3.length + b.N4.length + b.N5.length + b.invalid.length, N1: b.N1.length, N3: b.N3.length, invalid: b.invalid.length,
					costRank: s.cost, costTom: +tom.toFixed(2),
					leaderOnLeader: s.counts.leaderOnLeader, labelOnLeader: s.counts.labelOnLeader, labelOnLink: s.counts.labelOnLink, leaderOnLink: s.counts.leaderOnLink,
					hidden: hidden, hiddenRoomSmallest: roomSmall, hiddenRoomId: g.hiddenWithRoom, cut: g.cut, cutWithRoom: g.cutWithRoom,
					r14asked: s.r14.asked, r14along: s.r14.along, ms: +st.ms.toFixed(2), churn: st.stability ? st.stability.churn : null
				}) + '\n');
			});
		});
	});
	process.stderr.write(new Date().toISOString() + ' ' + f + '\n');
});
