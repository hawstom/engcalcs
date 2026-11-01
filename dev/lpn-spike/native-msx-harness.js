// EPANET-MSX IN THE BUILT-IN SOLVER (Task 733, native-wire). Run with:
//
//   node dev/lpn-spike/native-msx-harness.js
//
// The engine under it is the vendored epanet-js build, which runs EPA's own epanet-msx. Each slice is held to that
// engine, never to this file agreeing with itself.
//   Slice 1: the file and the expressions. The .msx parser (js/lpn-native-msx.js lpnMsxParse) reads the fixtures to the
//            same species, units, tolerances, constants, parameters, sources and initial qualities the engine reads from
//            the same text, and the expression evaluator gives MSX's own answers, quirks included.
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-native-msx.js'));

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
const FIX = path.join(__dirname, 'fixtures');
let ws = null, mod = null;
async function engine() {
	if (ws) { return ws; }
	mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	ws = new mod.Workspace();
	await ws.loadModule();
	return ws;
}
// The engine's own reading of an .inp and an .msx.
async function openEngine(inpText, msxText) {
	const w = await engine(), p = new mod.Project(w);
	w.writeFile('t.inp', inpText);
	w.writeFile('t.msx', msxText);
	p.open('t.inp', 't.rpt', 't.out');
	p.msxOpen('t.msx');
	return p;
}
// Net1 (US units): one decaying chlorine, a second bulk species fed by a booster, a wall species, a term, a parameter, a pattern.
const NET1_MSX = `[TITLE]
Net1, two bulk species and a wall species
[OPTIONS]
  AREA_UNITS FT2
  RATE_UNITS HR
  SOLVER RK5
  COUPLING NONE
  TIMESTEP 300
  RTOL 0.001
  ATOL 0.0001
[SPECIES]
  BULK CL2 MG 0.0001 0.002
  BULK TOT UG
  WALL BIO UG/M2
[COEFFICIENTS]
  CONSTANT Kb 0.3
  PARAMETER Kw 0.01
  CONSTANT Ks 2.0
[TERMS]
  Rate1 Kb*CL2 + Ks*Av*0.01
[PIPES]
  RATE CL2 -Rate1
  RATE TOT 0.1*CL2
  RATE BIO Kw*CL2 - 0.5*BIO
[TANKS]
  RATE CL2 -Kb*CL2
  RATE TOT 0.1*CL2
[SOURCES]
  CONC 10 CL2 1.5 P1
  MASS 13 TOT 20
[QUALITY]
  GLOBAL CL2 0.5
  NODE 9 CL2 1.0
  LINK 10 BIO 3.0
[PARAMETERS]
  PIPE 10 Kw 0.05
[PATTERNS]
  P1 1 0.5 1.5 1
  P1 0.8
[REPORT]
  NODES ALL
  SPECIE CL2 YES
`;
const MSX_NODE = 0, MSX_LINK = 1, MSX_TANK = 2, MSX_SPECIES = 3, MSX_TERM = 4, MSX_PARAMETER = 5, MSX_CONSTANT = 6, MSX_PATTERN = 7;

async function slice1() {
	console.log('-- slice 1: the file and the expressions');
	const cases = [
		['Net1 + a chlorine decay with a source and patterns', path.join(ROOT, 'dev/lpn-spike/reference/Net1.inp'), null],
		['As5Adsorb (EPA\'s arsenic example)', path.join(FIX, 'msx-example/example.inp'), path.join(FIX, 'msx-example/example.msx')]
	];
	for (const [name, inpFile, msxFile] of cases) {
		const inpText = fs.readFileSync(inpFile, 'utf8'), msxText = msxFile ? fs.readFileSync(msxFile, 'utf8') : NET1_MSX;
		const p = await openEngine(inpText, msxText);
		const nodeIds = new Set(), linkIds = new Set();
		// ids from the .inp text: [JUNCTIONS] [RESERVOIRS] [TANKS] and the link sections
		let sec = '';
		inpText.split(/\r?\n/).forEach((ln) => {
			const m = /^\s*\[(\w+)\]/.exec(ln);
			if (m) { sec = m[1].toUpperCase(); return; }
			const t = ln.split(';')[0].trim().split(/\s+/);
			if (!t[0]) { return; }
			if (sec === 'JUNCTIONS' || sec === 'RESERVOIRS' || sec === 'TANKS') { nodeIds.add(t[0]); }
			if (sec === 'PIPES' || sec === 'PUMPS' || sec === 'VALVES') { linkIds.add(t[0]); }
		});
		const r = EngCalcs.lpnMsxParse(msxText, { node: (id) => nodeIds.has(id), link: (id) => linkIds.has(id) });
		ok(name + ': the parser reads the file without an error', r.ok, JSON.stringify(r.errors).slice(0, 200));
		const spec = r.spec;
		ok(name + ': the species count is the engine\'s', spec.species.length === p.msxGetCount(MSX_SPECIES), spec.species.length + '');
		let allSpecies = true;
		spec.species.forEach((s, i) => {
			const e = p.msxGetSpecies(i + 1), id = p.msxGetId(MSX_SPECIES, i + 1);
			const same = id === s.id && (e.type === 1) === (s.type === 'WALL') && e.units === s.units &&
				Math.abs(e.aTol - s.aTol) < 1e-15 && Math.abs(e.rTol - s.rTol) < 1e-15;
			if (!same) { allSpecies = false; console.log('   species ' + (i + 1), JSON.stringify(e), JSON.stringify(s), id); }
		});
		ok(name + ': every species\' name, kind, units and tolerances (the defaults filled in) are the engine\'s', allSpecies);
		let allConst = spec.consts.length === p.msxGetCount(MSX_CONSTANT);
		spec.consts.forEach((c, i) => { if (Math.abs(p.msxGetConstant(i + 1) - c.value) > 1e-15) { allConst = false; } });
		ok(name + ': the constants are the engine\'s', allConst, spec.consts.map((c) => c.id + '=' + c.value).join(' '));
		ok(name + ': the parameters and patterns are counted as the engine counts them (it does not count terms)',
			spec.params.length === p.msxGetCount(MSX_PARAMETER) && spec.patterns.length === p.msxGetCount(MSX_PATTERN));
		// initial quality: apply the file's lines in order to a table and read the engine's
		const speciesCount = spec.species.length, nodeList = [], linkList = [];
		let nn = p.getCount(mod.CountType.NodeCount), nl = p.getCount(mod.CountType.LinkCount);
		for (let i = 1; i <= nn; i++) { nodeList.push(p.getNodeId(i)); }
		for (let i = 1; i <= nl; i++) { linkList.push(p.getLinkId(i)); }
		const c0n = {}, c0l = {};
		nodeList.forEach((id) => { c0n[id] = new Array(speciesCount + 1).fill(0); });
		linkList.forEach((id) => { c0l[id] = new Array(speciesCount + 1).fill(0); });
		spec.quality.forEach((q) => {
			const bulk = spec.species[q.species - 1].type === 'BULK';
			if (q.scope === 'global') {
				if (bulk) { nodeList.forEach((id) => { c0n[id][q.species] = q.value; }); }
				linkList.forEach((id) => { c0l[id][q.species] = q.value; });
			} else if (q.scope === 'node') { if (bulk) { c0n[q.id][q.species] = q.value; } }
			else { c0l[q.id][q.species] = q.value; }
		});
		let qOk = true;
		for (let m = 1; m <= speciesCount; m++) {
			nodeList.forEach((id, i) => { if (Math.abs(p.msxGetInitQual(MSX_NODE, i + 1, m) - c0n[id][m]) > 1e-12) { qOk = false; } });
			linkList.forEach((id, i) => { if (Math.abs(p.msxGetInitQual(MSX_LINK, i + 1, m) - c0l[id][m]) > 1e-12) { qOk = false; } });
		}
		ok(name + ': the initial quality of every node and link, with GLOBAL then NODE then LINK lines applied in order, is the engine\'s', qOk);
		// sources
		let srcOk = true, nSrc = 0;
		Object.keys(spec.sources).forEach((nid) => {
			spec.sources[nid].forEach((s) => {
				const e = p.msxGetSource(nodeList.indexOf(nid) + 1, s.species);
				nSrc++;
				if (!(Math.abs(e.level - s.c0) < 1e-12)) { srcOk = false; }
			});
		});
		ok(name + ': the sources (' + nSrc + ') are the engine\'s', srcOk);
		p.msxClose(); p.close();
	}
	// ---- expressions: the engine has no evaluator we can call, so these are MSX's own rules worked by hand ----
	const code = (id) => ({ X: 1, Y: 2, K_1: 3 }[id] === undefined ? -1 : { X: 1, Y: 2, K_1: 3 }[id]);
	const val = (i) => [0, 3, 4, 0.5][i];
	const ev = (s) => { const pr = EngCalcs.lpnMsxCompile(s, code); return pr ? EngCalcs.lpnMsxEval(pr, val) : null; };
	const near = (a, b) => typeof a === 'number' && Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b));
	[['1+2*3', 7], ['(1+2)*3', 9], ['-X*Y', -12], ['X-Y-1', -2], ['X^2', 9], ['2^(3)', 8], ['SQRT(X*X+Y*Y)', 5], ['ABS(-X)+SGN(-5)', 2],
		['STEP(X-4)', 0], ['STEP(X-2)', 1], ['LOG10(1000)', 3], ['1e-3*X', 0.003], ['K_1*X/Y', 0.375], ['-(X+1)', -4], ['((1))', 1],
		['exp(0)', 1], ['EXP(LOG(2))', 2], ['COT(1)', 1 / Math.tan(1)], ['ACOT(1)', Math.PI / 2 - Math.PI / 4], ['SINH(1)', (Math.E - 1 / Math.E) / 2],
		['COTH(2)', (Math.exp(2) + Math.exp(-2)) / (Math.exp(2) - Math.exp(-2))]].forEach(([s, want]) => {
		const got = ev(s);
		ok('expression ' + s + ' = ' + want, near(got, want), String(got));
	});
	// the quirks: an exponent is a number, a "-" before a number is part of it only at the start or after "(", a power is exp(b ln a)
	ok('X^Y (a variable exponent) is refused, as mathexpr.c refuses it', EngCalcs.lpnMsxCompile('X^Y', code) === null);
	ok('2*-3 is refused: a minus is part of a number only at the start or after "("', EngCalcs.lpnMsxCompile('2*-3', code) === null);
	ok('-2^2 is (-2)^2 = exp(2 ln -2) = NaN, because the minus belongs to the 2', Number.isNaN(ev('-2^2')));
	ok('an unknown name is refused', EngCalcs.lpnMsxCompile('Z+1', code) === null);
	ok('an unclosed parenthesis is refused', EngCalcs.lpnMsxCompile('(1+2', code) === null);
	ok('a division by zero is Infinity, as C gives', ev('1/(Y-4)') === Infinity);
	// the file's own errors
	const bad = EngCalcs.lpnMsxParse('[SPECIES]\nBULK A MG\nBULK A MG\n[PIPES]\nRATE B -A\nRATE A -A*\n[OPTIONS]\nSOLVER XYZ\n[COEFFICIENTS]\nCONSTANT D 1\n', {});
	ok('a duplicate species, an unknown species, a bad expression, a bad keyword and a reserved name are each an error, with the line',
		!bad.ok && bad.errors.length >= 5 && bad.errors.every((e) => e.line > 0 || e.code === 410), bad.errors.map((e) => e.code + '@' + e.line).join(' '));
}

async function run() {
	await slice1();
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });
