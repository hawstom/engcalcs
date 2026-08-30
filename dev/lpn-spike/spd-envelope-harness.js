// THE PROOF THAT THE FAST LINEAR SOLVE DID NOT MOVE AN ANSWER. Run:
//   node dev/lpn-spike/spd-envelope-harness.js
//
// js/lpn-solver.js factors its matrix with an ENVELOPE Cholesky instead of a dense one, because
// the dense one is n^3/6 multiply-adds and that -- not the sweep's solve count -- is what made a
// whole-system fire flow run take minutes (see dev/lpn-spike/solve-profile-bench.js).
//
// The claim that made it shippable without re-approving a single published number is that the two
// factorizations agree BIT FOR BIT, because every term the envelope skips is a product with an
// exactly-zero factor and the surviving terms are added in the same order. A claim of that shape
// is worth nothing unasserted, so this file asserts it three ways:
//
//   1. On RANDOM sparse SPD matrices, including dense ones and 1x1 ones -- the numerics on their
//      own, away from any network.
//   2. On EVERY MATRIX A REAL SOLVE FORMS. lpnSolveSPD is wrapped, so each Newton iteration of
//      each case network hands the same A and F to both implementations and the two answers are
//      compared with Object.is (which separates -0 from 0, where === does not).
//   3. On the SOLVE'S OWN OUTPUT -- heads, flows, head losses, velocities, iteration count -- for
//      every case network and for square grids up to 225 junctions, forced through each
//      implementation in turn and compared bit for bit.
//
// It also asserts the thing that is a COUNT rather than a duration, and therefore reproducible on
// any machine under any load: the number of multiply-adds each factorization performs. A time
// here would be worthless (this repo learned that at Task 436); the flop count is the same on
// every machine forever, and it is the number that says the growth is no longer cubic.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
const cases = require('./cases.js');

let failures = 0;
function ok(what, cond, detail) {
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + what + (cond || detail === undefined ? '' : '  -- ' + detail));
}

function sameVector(a, b) {
	if ((a === null) !== (b === null)) { return false; }
	if (a === null) { return true; }
	if (a.length !== b.length) { return false; }
	for (let i = 0; i < a.length; i++) { if (!Object.is(a[i], b[i])) { return false; } }
	return true;
}

// -------------------------------------------------------------------------------------------
// 1. The numerics alone
// -------------------------------------------------------------------------------------------
function lcg(seed) { let s = seed >>> 0; return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff); }

console.log('--- random sparse SPD matrices ---');
{
	const r = lcg(20260830);
	let worst = null;
	let checked = 0;
	for (let trial = 0; trial < 400; trial++) {
		const n = 1 + Math.floor(r() * 30);
		// Density spans empty (pure diagonal, envelope = the diagonal) to full (envelope = dense),
		// so both ends of the optimisation are exercised, not just the sparse middle.
		const density = trial % 4 === 0 ? 1 : trial % 4 === 1 ? 0 : r();
		const A = [];
		for (let i = 0; i < n; i++) { A.push(new Float64Array(n)); }
		for (let i = 0; i < n; i++) { A[i][i] = 1 + r() * 5; }
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < i; j++) {
				if (r() < density) {
					const g = r() * 10;
					A[i][j] -= g; A[j][i] -= g; A[i][i] += g; A[j][j] += g;
				}
			}
		}
		const b = new Float64Array(n);
		for (let i = 0; i < n; i++) { b[i] = r() * 20 - 10; }
		const dense = EC.lpnSolveSPDDense(A, b), env = EC.lpnSolveSPD(A, b);
		checked++;
		if (!sameVector(dense, env) && !worst) { worst = 'trial ' + trial + ' n=' + n; }
	}
	ok(checked + ' random matrices factor bit-identically', worst === null, worst);
}

// A matrix that is NOT positive definite must still be refused, by both, the same way.
{
	const A = [new Float64Array([1, 2]), new Float64Array([2, 1])];
	const b = new Float64Array([1, 1]);
	ok('a non-positive-definite matrix returns null from both',
		EC.lpnSolveSPDDense(A, b) === null && EC.lpnSolveSPD(A, b) === null);
}

// -------------------------------------------------------------------------------------------
// The corpus: the hand-built cases, plus grids at the fire-flow bench's own three sizes
// -------------------------------------------------------------------------------------------
const gpm = q => q * 0.0000630901964;
function grid(n) {
	const nodes = [{ id: 'R', type: 'reservoir', elev: 0, head: 70 }];
	const links = [];
	const id = (i, j) => 'J' + i + '_' + j;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			nodes.push({ id: id(i, j), type: 'junction', elev: 5 + (i + j) * 0.2, demand: gpm(15) });
		}
	}
	links.push({ id: 'FEED', type: 'pipe', from: 'R', to: id(0, 0), length: 100, diameter: 0.3048,
		roughness: 130, k: 0, status: 'open' });
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i + 1 < n) {
				links.push({ id: 'H' + i + '_' + j, type: 'pipe', from: id(i, j), to: id(i + 1, j),
					length: 150, diameter: 0.2032, roughness: 130, k: 0, status: 'open' });
			}
			if (j + 1 < n) {
				links.push({ id: 'V' + i + '_' + j, type: 'pipe', from: id(i, j), to: id(i, j + 1),
					length: 150, diameter: 0.1524, roughness: 130, k: 0, status: 'open' });
			}
		}
	}
	return { name: 'grid-' + n, method: 'hw', nodes: nodes, links: links };
}

const corpus = Object.keys(cases).map(k => Object.assign({ name: k }, cases[k]))
	.concat([grid(7), grid(11), grid(15)]);

// -------------------------------------------------------------------------------------------
// 2. Every matrix a real solve forms
// -------------------------------------------------------------------------------------------
//
// This one also covers the ASSEMBLY, not only the factorization. lpnSolve now builds its matrix
// straight into the packed band, so the packed matrix is UNPACKED back into a square here and the
// dense reference is run on that. If a link were being added into the wrong cell, or the lower
// triangle were losing a contribution the dense form used to make twice, the two answers would
// part company right here.
console.log('\n--- every matrix a real solve forms ---');
{
	const packed = EC.lpnSolvePacked, dense = EC.lpnSolveSPDDense;
	let matrices = 0, bad = null;
	EC.lpnSolvePacked = function (env, M, b) {
		const n = env.n;
		const A = [];
		for (let i = 0; i < n; i++) { A.push(new Float64Array(n)); }
		for (let i = 0; i < n; i++) {
			for (let j = env.first[i]; j <= i; j++) {
				const v = M[env.rowStart[i] - env.first[i] + j];
				A[i][j] = v;
				A[j][i] = v;
			}
		}
		// The dense reference goes FIRST, and its result is what the solve continues from, so a
		// divergence cannot hide by steering the two runs onto different iterates. (M is factored
		// in place, so the packed call has to come second.)
		const d = dense(A, b), e = packed(env, M, b);
		matrices++;
		if (!sameVector(d, e) && !bad) { bad = 'n=' + b.length; }
		return d;
	};
	corpus.forEach(m => { EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 }); });
	EC.lpnSolvePacked = packed;
	ok(matrices + ' matrices from ' + corpus.length + ' networks factor bit-identically', bad === null, bad);
}

// -------------------------------------------------------------------------------------------
// 3. The solve's own reported answers
// -------------------------------------------------------------------------------------------
console.log('\n--- reported answers, dense against envelope ---');
{
	const packed = EC.lpnSolvePacked, dense = EC.lpnSolveSPDDense;
	// "Dense" here means: let the solve assemble exactly as it does, then unpack the band into a
	// square and factor THAT with the untouched reference. It is the old numerics driven by the
	// new code, which is the only way left to run them against the same networks.
	const viaDense = function (env, M, b) {
		const n = env.n;
		const A = [];
		for (let i = 0; i < n; i++) { A.push(new Float64Array(n)); }
		for (let i = 0; i < n; i++) {
			for (let j = env.first[i]; j <= i; j++) {
				const v = M[env.rowStart[i] - env.first[i] + j];
				A[i][j] = v;
				A[j][i] = v;
			}
		}
		return dense(A, b);
	};
	function run(m) {
		const r = EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 });
		return { ok: r.ok, converged: r.converged, iterations: r.iterations,
			heads: r.heads, pressures: r.pressures, flows: r.flows,
			headlosses: r.headlosses, velocities: r.velocities };
	}
	function compare(a, b) {
		if (a.ok !== b.ok || a.converged !== b.converged || a.iterations !== b.iterations) {
			return 'ok/converged/iterations differ';
		}
		for (const field of ['heads', 'pressures', 'flows', 'headlosses', 'velocities']) {
			const A = a[field] || {}, B = b[field] || {};
			const ka = Object.keys(A);
			if (ka.length !== Object.keys(B).length) { return field + ': key count differs'; }
			for (const k of ka) { if (!Object.is(A[k], B[k])) { return field + '[' + k + ']: ' + A[k] + ' vs ' + B[k]; } }
		}
		return null;
	}
	corpus.forEach(m => {
		EC.lpnSolvePacked = viaDense;
		const d = run(m);
		EC.lpnSolvePacked = packed;
		const e = run(m);
		const diff = compare(d, e);
		const n = m.nodes.filter(x => !EC.lpnIsFixedHead(x)).length;
		ok(m.name + ' (' + n + ' junctions) reports identical numbers', diff === null, diff);
	});
	EC.lpnSolvePacked = packed;
}

// -------------------------------------------------------------------------------------------
// The count that says the growth is no longer cubic
// -------------------------------------------------------------------------------------------
//
// Multiply-adds in the factorization's inner loop, counted rather than timed. Dense is n^3/6 and
// nothing can change that; the envelope's count depends on the network's own node numbering, so
// it is asserted as a RATIO on the grid the fire-flow bench uses, at that bench's three sizes.
console.log('\n--- factorization work, counted (a count travels between machines; a time does not) ---');
{
	function flops(first, n) {
		let env = 0, den = 0;
		for (let i = 0; i < n; i++) {
			for (let j = 0; j <= i; j++) {
				den += j;
				if (j >= first[i]) { env += Math.max(0, j - Math.max(first[i], first[j])); }
			}
		}
		return { env, den };
	}
	const packed = EC.lpnSolvePacked;
	const rows = [];
	[grid(7), grid(11), grid(15)].forEach(m => {
		let f = null;
		EC.lpnSolvePacked = function (env, M, b) { if (!f) { f = flops(env.first, env.n); } return packed(env, M, b); };
		EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 });
		EC.lpnSolvePacked = packed;
		const n = m.nodes.length - 1;
		rows.push({ n, env: f.env, den: f.den });
		console.log('  ' + n + ' junctions: dense ' + f.den.toLocaleString() + ' multiply-adds, envelope ' +
			f.env.toLocaleString() + '  (x' + (f.den / f.env).toFixed(1) + ' fewer)');
	});
	const a = rows[0], b = rows[rows.length - 1];
	const ex = (p, q) => Math.log(q / p) / Math.log(b.n / a.n);
	const denEx = ex(a.den, b.den), envEx = ex(a.env, b.env);
	console.log('  growth exponent over that range: dense ' + denEx.toFixed(2) +
		', envelope ' + envEx.toFixed(2));
	// Not a threshold picked to pass. Dense Cholesky is n^3/6 by construction, so its exponent is
	// 3 whatever the network; an envelope on a grid whose numbering is row-major has bandwidth
	// sqrt(n), which is n^2. The assertion is that the exponent CHANGED -- a constant-factor
	// speedup would leave it at 3 and would not have fixed anything.
	ok('dense grows as the cube it is', denEx > 2.8 && denEx < 3.05, denEx.toFixed(2));
	ok('envelope grows strictly slower than the cube', envEx < 2.3, envEx.toFixed(2));
	ok('225 junctions does at least 20x less factorization work',
		b.den / b.env >= 20, (b.den / b.env).toFixed(1) + 'x');
}

console.log('\n' + (failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'));
process.exit(failures === 0 ? 0 : 1);
