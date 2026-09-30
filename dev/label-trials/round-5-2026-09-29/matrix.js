// ROUND 5 (2026-09-29): THE PRE-REGISTERED DESIGN, as data. dev/label-trials/round-5-2026-09-29.md
// states it in words; this file is what the runner reads, so the two cannot drift. Changing it
// after the run starts is a protocol deviation and is recorded as one in the round record.
//
// JUDGES' SIDE: this round scores with dev/lpn-spike/label-bench/judges/ (Tom's weights, room.js),
// so builders must not read dev/label-trials/.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');

const WT = '/home/haws/webdev/worktrees';
// The placers compared, frozen at these commits (the round record lists the file hashes).
const PLACERS = {
	master: { path: path.join(__dirname, '../../lpn-spike/label-bench/placers/master-replay.js'), replay: true },
	A: { path: WT + '/feat-label-placer-a/engcalcs/js/lpn-placer-a.js', commit: '3483bfd6' },
	B: { path: WT + '/feat-label-placer-b/engcalcs/js/lpn-placer-b.js', commit: 'c5905432' },
	C: { path: WT + '/feat-label-placer-c/engcalcs/js/lpn-placer-c.js', commit: '9a790a3e' },
	D: { path: WT + '/feat-label-placer-d/engcalcs/js/lpn-placer-d.js', commit: '129b63c4' }
};

const FAMILIES = ['grid', 'tree', 'suburban', 'downtown'];
const SIZES = [150, 1000, 5000];
const SPACINGS = [28, 44, 70];          // screen px between nearest neighbours at the first view
const SEEDS = [1, 2, 3, 4, 5, 6];
const MASTER_MAX_N = 1000;             // master's pass grows with the whole network (see the record)

// Extraction jobs. One job = one child process of extract.js --gen. A 5000-node network is loaded
// once for its three densities (no master); a smaller one once per density (with master).
function jobs() {
	const out = [];
	// E1, the main matrix.
	FAMILIES.forEach(function (family) {
		SIZES.forEach(function (n) {
			SEEDS.forEach(function (seed) {
				if (n > MASTER_MAX_N) {
					out.push({ exp: 'E1', spec: { family: family, n: n, seed: seed, spacingPx: SPACINGS.slice(), noMaster: true } });
				} else {
					SPACINGS.forEach(function (sp) { out.push({ exp: 'E1', spec: { family: family, n: n, seed: seed, spacingPx: sp } }); });
				}
			});
		});
	});
	// E2, ID length: the SAME networks as E1's grid and suburban n=1000 at 44 px (the generator's
	// ID stream is separate from its network stream), with three more ID styles; E1's 'epanet'
	// cells are the fourth level.
	['grid', 'suburban'].forEach(function (family) {
		['short', 'long', 'mixed'].forEach(function (ids) {
			SEEDS.forEach(function (seed) { out.push({ exp: 'E2', spec: { family: family, n: 1000, seed: seed, spacingPx: 44, ids: ids } }); });
		});
	});
	// E3, published networks: L-Town and C-Town at the three densities; the seed picks the view's
	// centre (seed 1 the node nearest the centroid).
	['L-TOWN', 'C-TOWN'].forEach(function (bench) {
		SPACINGS.forEach(function (sp) {
			SEEDS.forEach(function (seed) { out.push({ exp: 'E3', spec: { bench: bench, spacingPx: sp, seed: seed } }); });
		});
	});
	return out;
}

module.exports = { PLACERS, FAMILIES, SIZES, SPACINGS, SEEDS, MASTER_MAX_N, jobs };

if (require.main === module) {
	const j = jobs();
	const sets = j.reduce(function (a, x) { return a + (Array.isArray(x.spec.spacingPx) ? x.spec.spacingPx.length : 1); }, 0);
	console.log(j.length + ' extraction jobs, ' + sets + ' scene sets, ' + (sets * 5) + ' views');
	['E1', 'E2', 'E3'].forEach(function (e) {
		const k = j.filter(function (x) { return x.exp === e; });
		console.log('  ' + e + ': ' + k.reduce(function (a, x) { return a + (Array.isArray(x.spec.spacingPx) ? x.spec.spacingPx.length : 1); }, 0) + ' sets');
	});
}
