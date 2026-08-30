// WHERE ONE SOLVE'S TIME GOES, at three sizes (ROADMAP Task 530 follow-up). Run:
//   node dev/lpn-spike/solve-profile-bench.js
//
// The fire-flow sweep's solve COUNT grows linearly with junctions; its cost per solve does not.
// This file answers which part of a single solve is the superlinear one, by wrapping the three
// functions lpnSolve calls -- the linear solve, the structural diagnose, the report -- and
// charging everything else to assembly. It asserts nothing; a timing number is not pass/fail, and
// run_harnesses.sh's glob (*harness*.js) deliberately does not pick this up.
//
// The grid is fireflow-bench.js's grid, kept identical on purpose so the two tables compare.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EC;

const gpm = function (q) { return q * 0.0000630901964; };

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
	return { method: 'hw', nodes: nodes, links: links };
}

let spdMs = 0, spdN = 0, diagMs = 0, repMs = 0;
function wrap(name, acc) {
	const orig = EC[name];
	EC[name] = function () {
		const t = process.hrtime.bigint();
		const r = orig.apply(null, arguments);
		acc(Number(process.hrtime.bigint() - t) / 1e6);
		return r;
	};
}
wrap('lpnSolveSPD', function (ms) { spdMs += ms; spdN++; });
wrap('lpnDiagnose', function (ms) { diagMs += ms; });
wrap('lpnReport', function (ms) { repMs += ms; });

const rows = [];
for (const n of [7, 11, 15]) {
	const m = grid(n);
	EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 });
	spdMs = spdN = diagMs = repMs = 0;
	const R = 5;
	const t = process.hrtime.bigint();
	let res;
	for (let i = 0; i < R; i++) { res = EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 }); }
	const tot = Number(process.hrtime.bigint() - t) / 1e6;
	const nn = m.nodes.length - 1;
	const asm = tot - spdMs - diagMs - repMs;
	rows.push({ nn: nn, tot: tot / R, spd: spdMs / R, asm: asm / R, iters: res.iterations });
	console.log(nn + ' junctions / ' + m.links.length + ' links: ' + (tot / R).toFixed(2) +
		' ms per solve, ' + res.iterations + ' Newton iterations (converged=' + res.converged + ')');
	console.log('   linear solve   ' + (spdMs / R).toFixed(2) + ' ms  ' +
		(100 * spdMs / tot).toFixed(0) + '%   (' + (spdN / R) + ' calls, ' +
		(spdMs / spdN).toFixed(3) + ' ms each)');
	console.log('   assembly       ' + (asm / R).toFixed(2) + ' ms  ' + (100 * asm / tot).toFixed(0) + '%');
	console.log('   diagnose       ' + (diagMs / R).toFixed(2) + ' ms  ' + (100 * diagMs / tot).toFixed(0) + '%');
	console.log('   report         ' + (repMs / R).toFixed(2) + ' ms  ' + (100 * repMs / tot).toFixed(0) + '%');
}
const a = rows[0], b = rows[rows.length - 1];
const ex = (x, y) => (Math.log(y / x) / Math.log(b.nn / a.nn)).toFixed(2);
console.log('\nexponent from ' + a.nn + ' to ' + b.nn + ' junctions:  whole solve ' +
	ex(a.tot, b.tot) + ',  linear solve ' + ex(a.spd, b.spd) + ',  assembly ' + ex(a.asm, b.asm));
console.log('Newton iterations: ' + rows.map(r => r.nn + '->' + r.iters).join(', '));
