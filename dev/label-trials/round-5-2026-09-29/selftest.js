// ROUND 5: PROVES metrics.js's indexed room search answers exactly what the judges' room.js answers,
// on every hidden or cut label of the public bench's scenes laid out by the given placer (default:
// master's replay) and, if a scene folder is given, its first N sets.
//
//   node dev/label-trials/round-5-2026-09-29/selftest.js [--placer <path>] [--scenes <dir> --max 4]
//
// Exit 1 on any disagreement.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { runBench, loadSets } = require('../../lpn-spike/label-bench/run.js');
const Room = require('../../lpn-spike/label-bench/judges/room.js');
const Mx = require('./metrics.js');

const a = process.argv.slice(2);
function opt(k) { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; }
const placer = opt('--placer') || path.join(__dirname, '../../lpn-spike/label-bench/placers/master-replay.js');
let sets = loadSets(path.join(__dirname, '../../lpn-spike/label-bench/scenes'));
if (opt('--scenes')) { sets = sets.concat(loadSets(opt('--scenes')).slice(0, +(opt('--max') || 4))); }
const res = runBench(placer, sets, { idleOpen: 0, idleStep: 0 });
let checked = 0, agree = 0;
res.forEach(function (set, si) {
	set.steps.forEach(function (st, k) {
		const scene = sets[si].steps[k], L = (st.layout && st.layout.labels) || {}, O = Mx.index(scene, st.layout);
		scene.labels.forEach(function (req) {
			const p = L[req.id];
			let rows = null;
			if (!p || !p.shown) { rows = req.rows.map(function (r, i) { return r.field === 'id' ? i : -1; }).filter(function (i) { return i >= 0; }); }
			else if (p.rows.length < req.rows.length) { rows = req.rows.map(function (r, i) { return i; }); }
			if (!rows || req.hand) { return; }
			checked++;
			const want = !!Room.roomWithinReach(scene, st.layout, req, rows, { reachRows: 3 });
			const got = Mx.roomWithinReach(scene, O, req, rows, 3);
			if (want === got) { agree++; } else { console.log('DISAGREE ' + scene.id + ' ' + req.id + ' room.js ' + want + ' indexed ' + got); }
		});
	});
});
console.log(agree + '/' + checked + ' hidden or cut labels: indexed search agrees with judges/room.js');
process.exit(agree === checked ? 0 : 1);
