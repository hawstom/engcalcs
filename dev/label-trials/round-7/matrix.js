// ROUND 7: THE PRE-REGISTERED DESIGN, as data (dev/label-trials/round-7-plan.md §4 states it in words).
// The runners read this file, so the two cannot drift. Changing it after scoring starts is a protocol
// deviation and is recorded as one in the round record.
//
// JUDGES' SIDE: builders must not read dev/label-trials/.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');

const HERE = __dirname;
// The entrants. A7-D7 are the four builders' round-7 placers, frozen 2026-10-07 in ./frozen from their
// branches' heads: A 2883c033 (sha256 12e5cad68767), B 18cac708 (493406be5439), C 4dc27ea1
// (2de9fc6470c3), D 2e5e81c4 (ca198b8d5cc0); their strategy cards beside them. A6-D6 are their
// round-6 placers, frozen in ./frozen (sha256 e14958e44ebc, d75fee62e228, a21a307a8ad7, 9924a126a244,
// the same files round 6 scored). R and M are the pilot's repair pass (round-7-pilot/repair.js,
// mode 'strict'): R on round 6's C, M on an empty map (the measurer alone).
const PLACERS = {
	A7: { path: path.join(HERE, 'frozen/placer-a-r7.js'), builder: 'A' },
	B7: { path: path.join(HERE, 'frozen/placer-b-r7.js'), builder: 'B' },
	C7: { path: path.join(HERE, 'frozen/placer-c-r7.js'), builder: 'C' },
	D7: { path: path.join(HERE, 'frozen/placer-d-r7.js'), builder: 'D' },
	A6: { path: path.join(HERE, 'frozen/placer-a-r6.js'), builder: 'A' },
	B6: { path: path.join(HERE, 'frozen/placer-b-r6.js'), builder: 'B' },
	C6: { path: path.join(HERE, 'frozen/placer-c-r6.js'), builder: 'C' },
	D6: { path: path.join(HERE, 'frozen/placer-d-r6.js'), builder: 'D' },
	R: { repair: 'strict', inner: path.join(HERE, 'frozen/placer-c-r6.js') },
	M: { repair: 'strict', inner: null }
};
const BUILDERS7 = ['A7', 'B7', 'C7', 'D7'];
const BUILDERS6 = ['A6', 'B6', 'C6', 'D6'];

const FAMILIES = ['grid', 'tree', 'suburban', 'downtown'];
// FRESH SECRET SEEDS for E1 and E2. Round 6 used 61-64 (they are E3 here).
const SEEDS = [71, 72, 73, 74];
const SPACINGS = [28, 44];
const VARIANTS = [{ v: 'plain', bends: 'none', valves: 'none' }, { v: 'both', bends: 'many', valves: 'many' }];
const E3_SEEDS = [61, 62, 63, 64];
// The R1 count probe (judges/r1.js countProbe) on these views of every E1 and E2 builder cell.
const PROBE_STEPS = [0, 2];

// Extraction jobs: one network, both densities from one load (noMaster: master is not re-run).
function jobs() {
	const out = [];
	FAMILIES.forEach(function (family) {
		SEEDS.forEach(function (seed) {
			VARIANTS.forEach(function (va) {
				out.push({ exp: 'E1', variant: va.v, spec: { family: family, n: 1000, seed: seed, spacingPx: SPACINGS, bends: va.bends, valves: va.valves, noMaster: true } });
			});
		});
		E3_SEEDS.forEach(function (seed) {
			out.push({ exp: 'E3', variant: 'both', spec: { family: family, n: 1000, seed: seed, spacingPx: SPACINGS, bends: 'many', valves: 'many', noMaster: true } });
		});
	});
	['grid', 'suburban', 'downtown'].forEach(function (family) {
		out.push({ exp: 'E2', variant: 'both', spec: { family: family, n: 20000, seed: 71, spacingPx: [44], bends: 'many', valves: 'many', noMaster: true } });
	});
	return out;
}
// Who runs on which experiment (round-7-plan.md §4.5).
function entrantsFor(exp) {
	if (exp === 'E0' || exp === 'E1') { return Object.keys(PLACERS); }
	if (exp === 'E2') { return BUILDERS7.concat(BUILDERS6); }
	if (exp === 'E3') { return BUILDERS7.concat(BUILDERS6, ['R']); }
	return [];
}
const PUBLIC_SETS = ['net1', 'net2', 'net3', 'novato-zoom', 'novato-seq', 'bent-valves'];

module.exports = { PLACERS, BUILDERS7, BUILDERS6, FAMILIES, SEEDS, SPACINGS, VARIANTS, PROBE_STEPS, PUBLIC_SETS, jobs, entrantsFor };

if (require.main === module) {
	const j = jobs();
	console.log(j.length + ' extraction jobs');
	['E1', 'E2', 'E3'].forEach(function (e) { console.log('  ' + e + ': ' + j.filter(function (x) { return x.exp === e; }).length + ' networks'); });
}
