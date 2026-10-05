// ROUND 6 (2026-10-05): THE PRE-REGISTERED DESIGN, as data. dev/label-trials/round-6-2026-10-05.md
// states it in words; this file is what the runners read, so the two cannot drift. Changing it after
// scoring starts is a protocol deviation and is recorded as one in the round record.
//
// JUDGES' SIDE: builders must not read dev/label-trials/.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');

const WT = '/home/haws/webdev/worktrees';
// The same five placers as round 5, frozen at the same commits (the record lists the file hashes).
const PLACERS = {
	master: { path: path.join(__dirname, '../../lpn-spike/label-bench/placers/master-replay.js'), replay: true },
	A: { path: WT + '/feat-label-placer-a/engcalcs/js/lpn-placer-a.js', commit: '3483bfd6' },
	B: { path: WT + '/feat-label-placer-b/engcalcs/js/lpn-placer-b.js', commit: 'c5905432' },
	C: { path: WT + '/feat-label-placer-c/engcalcs/js/lpn-placer-c.js', commit: '9a790a3e' },
	D: { path: WT + '/feat-label-placer-d/engcalcs/js/lpn-placer-d.js', commit: '129b63c4' }
};
const BUILDERS = ['A', 'B', 'C', 'D'];

const FAMILIES = ['grid', 'tree', 'suburban', 'downtown'];
// FRESH SEEDS: round 5 used 1-6. Nobody has seen a network from these.
const SEEDS = [61, 62, 63, 64];
const SPACINGS = [28, 44];
// The 2 x 2 of round 6's question: bent pipes and valves, each on or off, on the SAME network.
const VARIANTS = [
	{ v: 'plain', bends: 'none', valves: 'none' },
	{ v: 'bent', bends: 'many', valves: 'none' },
	{ v: 'valved', bends: 'none', valves: 'many' },
	{ v: 'both', bends: 'many', valves: 'many' }
];
const E1_N = 1000;
// E2, large networks: no master (its pass grows with the whole network: round 5, E4).
const E2_FAMILIES = ['grid', 'suburban', 'downtown'];
const E2_SIZES = [5000, 20000];
const E2_SEEDS = [61, 62];
const E2_SPACING = 44;
// E3, the drop-order arms (Tom, 2026-10-06), on E1's 'both' sets, builders only.
const ARMS = ['two', 'one'];
// E4, THE ROUND-5 RECHECK: until round 6 the generator wrote a pipe's vertices as [x, y] pairs, which
// the app reads as NaN, so every "bent" pipe of round 5 ran through a vertex at no position. These
// are the 21 round-5 sets on which D broke N1 (round 5 blamed bent pipes), extracted again from the
// same specs with the vertices fixed.
const E4_SETS = ['suburban-1000-28-2', 'suburban-1000-28-5', 'downtown-1000-28-3', 'suburban-150-28-5', 'suburban-150-28-4',
	'suburban-150-28-1', 'suburban-150-28-6', 'suburban-150-44-2', 'downtown-150-28-2', 'suburban-150-44-1', 'suburban-150-28-3',
	'suburban-150-44-4', 'suburban-150-28-2', 'suburban-150-70-6', 'suburban-150-70-1', 'suburban-150-70-4', 'suburban-150-44-3',
	'suburban-150-70-2', 'suburban-150-44-5', 'suburban-150-70-5', 'suburban-150-44-6'];
// The R1 probe (judges/r1.js countProbe) on these views of every E1 and E2 builder cell.
const PROBE_STEPS = [0, 2];

function jobs() {
	const out = [];
	FAMILIES.forEach(function (family) {
		SEEDS.forEach(function (seed) {
			VARIANTS.forEach(function (va) {
				SPACINGS.forEach(function (sp) {
					out.push({ exp: 'E1', variant: va.v, spec: { family: family, n: E1_N, seed: seed, spacingPx: sp, bends: va.bends, valves: va.valves } });
				});
			});
		});
	});
	E2_FAMILIES.forEach(function (family) {
		E2_SIZES.forEach(function (n) {
			E2_SEEDS.forEach(function (seed) {
				out.push({ exp: 'E2', variant: 'both', spec: { family: family, n: n, seed: seed, spacingPx: [E2_SPACING], bends: 'many', valves: 'many', noMaster: true } });
			});
		});
	});
	E4_SETS.forEach(function (k) {
		const f = k.split('-');
		out.push({ exp: 'E4', variant: 'r5recheck', spec: { family: f[0], n: +f[1], spacingPx: +f[2], seed: +f[3] } });
	});
	return out;
}

module.exports = { PLACERS, BUILDERS, FAMILIES, SEEDS, SPACINGS, VARIANTS, E1_N, E2_SIZES, ARMS, PROBE_STEPS, jobs };

if (require.main === module) {
	const j = jobs();
	console.log(j.length + ' extraction jobs (one scene set each)');
	['E1', 'E2', 'E4'].forEach(function (e) { console.log('  ' + e + ': ' + j.filter(function (x) { return x.exp === e; }).length + ' sets'); });
}
