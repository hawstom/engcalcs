// Where the two engines disagree on head loss, and by how much. Run:
//   node dev/lpn-spike/minor-loss-gravity-harness.js
//
// Tom, 2026-08-17: "the EPANET solver produces slightly smaller losses. Across Elm Street Center the
// difference in psi is 0.003. I know it is in the links because the difference grows with distance
// from the source." Correct on all three counts. This file says which term it is in, so the number
// is measured rather than argued about.
//
// **THE METHOD IS THE POINT: DIFFERENCE TWO k VALUES ON ONE PIPE SO FRICTION CANCELS.** Comparing
// total head loss cannot separate a friction disagreement from a minor-loss one, and the first look
// at Elm Street said only "~0.1% per pipe" -- consistent with a wrong Hazen-Williams constant, a
// wrong diameter in the .inp, or a wrong g, which need completely different fixes. Two solves whose
// only difference is k leave exactly one term standing.
//
// ANSWER: friction is not involved. Ours reproduces EPANET's own 4.727 US equation to ~1e-15, and
// EPANET is ~1e-5 LOW against that same equation, from its rounded 28.317 L/s per cfs. The whole
// visible difference is the minor-loss term, where g is the entire coefficient: EPANET's g is
// 32.2 ft/s^2 and ours is standard gravity. We do not adopt 32.2 -- see js/lpn-epanet.js.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EC;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const Q = 0.05, L = 100, D = 0.1524, C = 150;   // m3/s, m, m (6 in), Hazen-Williams C
function model(k) {
	return {
		method: 'hw',
		nodes: [{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
		        { id: 'J', type: 'junction', elev: 0, demand: Q }],
		links: [{ id: 'P1', type: 'pipe', from: 'R', to: 'J', length: L, diameter: D,
		          roughness: C, k: k, status: 'open' }]
	};
}
// EPANET's documented equation, in the US units it is stated in. Not a restatement of our own
// resistance function -- the whole value of this check is that it comes from the other direction.
const FT = 0.3048, CFS = FT * FT * FT;
function usFrictionLoss(q) {
	return 4.727 * (L / FT) * Math.pow(q / CFS, 1.852) /
		(Math.pow(C, 1.852) * Math.pow(D / FT, 4.871)) * FT;   // -> m
}

(async function () {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const nat = {}, epa = {};
	for (const k of [0, 10]) {
		nat[k] = 100 - EngCalcs.lpnSolve(model(k), { tol: 1e-14, maxIter: 500 }).heads['J'];
		epa[k] = 100 - (await EngCalcs.lpnSolveEpanet(model(k))).heads['J'];
	}

	console.log('\n--- friction alone (k = 0) is not where the disagreement lives ---');
	{
		const closed = usFrictionLoss(Q);
		ok('our Hazen-Williams IS EPANET’s published 4.727 equation',
			Math.abs(nat[0] / closed - 1) < 1e-12,
			'ours/equation - 1 = ' + (nat[0] / closed - 1).toExponential(3));
		// EPANET's own engine is slightly off its own equation, and it is worth pinning the size of
		// that so nobody later "fixes" our friction to chase it.
		const epaErr = epa[0] / closed - 1;
		ok('EPANET is ~1e-5 low against its own equation (its rounded L/s per cfs)',
			epaErr < 0 && Math.abs(epaErr) > 5e-6 && Math.abs(epaErr) < 2e-5,
			'EPANET/equation - 1 = ' + epaErr.toExponential(3));
	}

	console.log('\n--- the minor-loss term, with friction differenced out ---');
	{
		const V = Q / (Math.PI * D * D / 4);
		const mn = nat[10] - nat[0], me = epa[10] - epa[0];
		const gOurs = 10 * V * V / (2 * mn), gEpa = 10 * V * V / (2 * me);
		ok('our implied g is the suite’s EngCalcs.G', Math.abs(gOurs - EngCalcs.G) < 1e-6,
			gOurs.toFixed(6) + ' vs ' + EngCalcs.G);
		ok('...and EngCalcs.G is standard gravity', Math.abs(EngCalcs.G - 9.80665) < 1e-12,
			String(EngCalcs.G));
		// 32.2 ft/s^2 is 9.814560; EPANET's unit rounding puts the implied value a little above it.
		ok('EPANET’s implied g is 32.2 ft/s^2', Math.abs(gEpa - 32.2 * 0.3048) < 0.002,
			gEpa.toFixed(6) + ' vs ' + (32.2 * 0.3048).toFixed(6));
		const rel = mn / me - 1;
		ok('so our minor losses are ~0.08% larger, and that is the whole story',
			rel > 5e-4 && rel < 1.5e-3, 'ours/EPANET - 1 = ' + rel.toExponential(3));
	}

	console.log('\n--- and the user is told, but only when there is a minor loss to tell about ---');
	{
		const withK = EngCalcs.lpnToInp(model(2)).warnings.map(w => w.code);
		const without = EngCalcs.lpnToInp(model(0)).warnings.map(w => w.code);
		ok('a network with minor losses declares the difference',
			withK.indexOf('minor-loss-gravity-differs') >= 0, withK.join(',') || '(none)');
		ok('...and one without them says nothing',
			without.indexOf('minor-loss-gravity-differs') < 0, without.join(',') || '(none)');
	}

	console.log(fails ? '\n' + fails + ' FAILURES' : '\nall minor-loss gravity assertions passed');
	process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
