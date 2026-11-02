// EPANET-MSX IN THE BUILT-IN SOLVER (Task 733, native-wire). Run with:
//
//   node dev/lpn-spike/native-msx-harness.js
//
// The engine under it is the vendored epanet-js build, which runs EPA's own epanet-msx. Each slice is held to that
// engine, never to this file agreeing with itself.
//   Slices 2 to 5: the chemistry and the transport. The same network and the same .msx run through the engine
//            (lpnEpanetRun) and through the built-in loop (lpnNativeRun with quality) and every species at every node and
//            link at every reporting time is compared: each solver (EUL, RK5, ROS2), coupling NONE and FULL, equilibrium and
//            formula species, a wall species, every source type, a pattern, per-pipe parameters, a term using Av, and the
//            tank models MIXED, 2COMP, FIFO and LIFO.
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
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-msx.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));
const { buildModel } = require('./net3-model.js');

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

const copy = (m) => JSON.parse(JSON.stringify(m));
function loadNet(file, edit, msxText) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(file.indexOf('/') >= 0 ? file : path.join(__dirname, 'reference', file), 'utf8'));
	const m = buildModel(EngCalcs, parsed);
	m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {});
	m.quality = { mode: 'msx' };
	m.msx = { text: msxText };
	if (edit) { edit(m); }
	return m;
}
// every value of every species at every node and link at every report time: the largest gap, and where
async function against(name, m, tol, minMoved) {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const e = await EngCalcs.lpnEpanetRun(copy(m)), refs = EngCalcs.lpnNativeRunRefusals(copy(m), { quality: true });
	if (!e.ok) { ok(name + ': the engine ran', false, JSON.stringify(e.issues || '')); return null; }
	if (refs.length) { ok(name + ': the built-in loop takes it', false, JSON.stringify(refs)); return null; }
	const n = EngCalcs.lpnNativeRun(copy(m), { quality: true });
	if (!n.ok) { ok(name + ': the built-in loop ran', false, JSON.stringify(n.issues || '')); return null; }
	let worst = 0, at = '', cnt = 0, moved = 0;
	e.frames.forEach((fe, i) => {
		const fn = n.frames[i];
		['msxNodes', 'msxLinks'].forEach((key) => {
			Object.keys(fe[key] || {}).forEach((id) => {
				fe[key][id].forEach((v, sp) => {
					if (v === null) { if (fn[key][id][sp] !== null) { worst = Infinity; at = 'wall at node ' + id; } return; }
					const d = Math.abs(v - fn[key][id][sp]);
					cnt++;
					if (i && Math.abs(v - e.frames[i - 1][key][id][sp]) > 1e-3) { moved++; }
					if (d > worst) { worst = d; at = `${key === 'msxNodes' ? 'node' : 'link'} ${id} species ${sp + 1} at ${fe.t / 3600} h (${v.toPrecision(6)} / ${fn[key][id][sp].toPrecision(6)})`; }
				});
			});
		});
	});
	ok(`${name}: ${cnt} values within ${tol}, and they move (${moved} changes) so agreement is not two constants`, e.frames.length === n.frames.length && worst <= tol && moved > (minMoved || 20),
		`worst ${worst.toExponential(2)} ${at}`);
	return { e, n };
}
const CHL = `[TITLE]
Chlorine first-order bulk decay (one species)
[OPTIONS]
AREA_UNITS FT2
RATE_UNITS HR
SOLVER     RK5
TIMESTEP   300
RTOL       0.001
ATOL       0.0001
[SPECIES]
BULK CL2 MG
[COEFFICIENTS]
CONSTANT Kb 0.3
[PIPES]
RATE CL2 -Kb*CL2
[TANKS]
RATE CL2 -Kb*CL2
[QUALITY]
GLOBAL CL2 0.5
NODE 9 CL2 1.2
`;
const CHAIN_MSX = `[OPTIONS]
AREA_UNITS FT2
RATE_UNITS HR
SOLVER EUL
TIMESTEP 300
[SPECIES]
BULK TR MG
[COEFFICIENTS]
CONSTANT K 3
[PIPES]
RATE TR -K*TR
[TANKS]
RATE TR -K*TR
[QUALITY]
GLOBAL TR 0.4
NODE R TR 1.0
`;
async function slices2to5() {
	console.log('-- slices 2 to 5: the chemistry and the transport, against the engine');
	const EX = path.join(FIX, 'msx-example');
	const exInp = path.join(EX, 'example.inp'), exMsx = fs.readFileSync(path.join(EX, 'example.msx'), 'utf8');
	await against('Net1, chlorine decay, RK5', loadNet('Net1.inp', null, CHL), 5e-4);
	for (const solver of ['EUL', 'RK5', 'ROS2']) {
		for (const coupling of ['NONE', 'FULL']) {
			const t1 = NET1_MSX.replace('SOLVER RK5', 'SOLVER ' + solver).replace('COUPLING NONE', 'COUPLING ' + coupling);
			await against(`Net1, two bulk species and a wall species with a term, parameter, pattern and two sources, ${solver}, coupling ${coupling}`, loadNet('Net1.inp', null, t1), 5e-4);
			const t2 = exMsx.replace(/SOLVER\s+RK5/, 'SOLVER ' + solver).replace('[OPTIONS]', '[OPTIONS]\n  COUPLING ' + coupling);
			await against(`EPA's arsenic oxidation and adsorption example (equilibrium, formula, wall), ${solver}, coupling ${coupling}`, loadNet(exInp, null, t2), 1e-5);
		}
	}
	// source types: the four, on a node with demand, one with a pattern; a tank-model tour on Net1's tank
	const SRC = NET1_MSX.replace('CONC 10 CL2 1.5 P1\n  MASS 13 TOT 20', 'SETPOINT 10 CL2 0.9\n  FLOW 13 TOT 2.5 P1\n  MASS 22 TOT 15\n  CONC 31 CL2 3');
	await against('Net1, SETPOINT, FLOWPACED (with a pattern), MASS and CONCEN sources', loadNet('Net1.inp', null, SRC), 5e-4);
	for (const mix of ['MIXED', 'FIFO']) {
		await against(`Net1, tank mixing model ${mix}`, loadNet('Net1.inp', (m) => { m.nodes.forEach((nd) => { if (nd.type === 'tank') { nd.mixing = { model: mix }; } }); }, NET1_MSX), 5e-4);
	}
	// Net3: fast flows (a pipe moves several times its volume in a quality step), a pump that opens and closes, two reservoirs, three
	// tanks. The gap here is the largest in the file and is HELD, not hidden: no value is further than 0.035 mg/L from the engine's
	// (5 percent of the starting 0.5 at the worst, in the first hours after the Lake pump opens), the mean is 5e-4.
	{
		const n3 = NET1_MSX.replace('CONC 10 CL2 1.5 P1', 'CONC 15 CL2 1.5 P1').replace('MASS 13 TOT 20', 'MASS 20 TOT 20').replace('NODE 9 CL2 1.0\n', '');
		await against('Net3 (pumps, three tanks, two reservoirs), the three species, RK5', loadNet('Net3.inp', null, n3), 0.0012);
	}
	// A pipe that moves several of its volumes in a quality step hands the water it cannot hold from its upstream node, as that node
	// will mix it this step, whichever way the links are numbered (a reservoir feeding two short pipes in a row, a decaying species).
	for (const order of ['1 2 3', '3 2 1']) {
		const pipes = { 1: ' 1\tR\tA\t100\t12\t130\t0\tOpen', 2: ' 2\tA\tB\t100\t12\t130\t0\tOpen', 3: ' 3\tB\tC\t3000\t12\t130\t0\tOpen' };
		const inp = '[JUNCTIONS]\n A\t0\t0\n B\t0\t0\n C\t0\t900\n[RESERVOIRS]\n R\t150\n[PIPES]\n' + order.split(' ').map((k) => pipes[k]).join('\n') +
			'\n[TIMES]\n Duration\t2:00\n Hydraulic Timestep\t1:00\n Quality Timestep\t0:05\n Report Timestep\t0:05\n[OPTIONS]\n Units\tGPM\n Headloss\tH-W\n[END]\n';
		const tmp = path.join(require('os').tmpdir(), 'msx-chain-' + order.replace(/ /g, '') + '.inp');
		fs.writeFileSync(tmp, inp);
		await against('three pipes in a row, 7.7 volumes a step, links numbered ' + order, loadNet(tmp, null, CHAIN_MSX), 1e-9, 10);
	}
	// THE PAGE'S OWN RUN PATH (lpnTimeRunModel, the engine setting built-in) takes an MSX project now, and says so in the run: the
	// species the file declares, the frames carrying them, the report EPANET writes, and no fall back.
	{
		let engineName = 'native';
		EngCalcs.lpnTimeInit({
			tabs: [], doc: () => null, apply: () => {}, status: () => {}, notice: () => {},
			routeNote: () => {}, engine: () => engineName,
			solve: () => {}, solveNow: () => {}, native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
			snapshot: () => {}, save: () => {},
			toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
		});
		const m = loadNet('Net1.inp', null, NET1_MSX);
		const viaPage = await EngCalcs.lpnTimeRunModel(copy(m), {});
		ok('the page\'s run path with the built-in setting runs an MSX project in the loop (not EPANET)', viaPage.ok && viaPage.engine === 'native' && viaPage.frames.length === 25 && viaPage.frames.every((f) => f.msxNodes && f.msxLinks),
			`engine ${viaPage.engine}, ${viaPage.frames.length} frames`);
		const viaEngine0 = await EngCalcs.lpnEpanetRun(copy(m));
		ok('...and names the species exactly as the engine run does (id, wall, units, unit text)', viaPage.msxSpecies && viaPage.msxSpecies.length === 3 &&
			JSON.stringify(viaPage.msxSpecies) === JSON.stringify(viaEngine0.msxSpecies), JSON.stringify(viaPage.msxSpecies) + ' / ' + JSON.stringify(viaEngine0.msxSpecies));
		ok('...and writes EPANET\'s run report', /Hydraulic Flow Balance/.test(viaPage.report));
		engineName = 'epanet';
		const viaEpanet = await EngCalcs.lpnTimeRunModel(copy(m), {});
		ok('the EPANET setting still runs EPANET', viaEpanet.ok && viaEpanet.engine === 'epanet', viaEpanet.engine);
		// a file the loop cannot read is refused by name and falls back to EPANET, which refuses it too
		engineName = 'native';
		const bad = loadNet('Net1.inp', null, NET1_MSX.replace('RATE CL2 -Rate1', 'RATE CL2 -Rate1*'));
		const refs = EngCalcs.lpnNativeRunRefusals(copy(bad), { quality: true });
		ok('an expression it cannot read is refused by the line, not run', refs.some((r) => r.code === 'native-run-quality' && r.ids.some((x) => /^line \d+ \(408\)$/.test(x))), JSON.stringify(refs));
	}
	// the other two tank models, which the loop used to leave to EPANET: a last-in-first-out tank, and a two-compartment tank at
	// three mixing-zone fractions. Net1's tank, and Net3's three. (The first run of these was 1.7e-2 and 1.8e-2 off the engine:
	// a pipe sends beyond what it holds the tank's concentration as the tank leaves the step, and the mixing zone starts first.)
	{
		const setMix = (mix, fr) => (mm) => { mm.nodes.forEach((nd) => { if (nd.type === 'tank') { nd.mixing = { model: mix, fraction: fr }; } }); };
		await against('Net1, tank mixing model LIFO', loadNet('Net1.inp', setMix('LIFO', 0.3), NET1_MSX), 5e-4);
		await against('Net1, tank mixing model 2COMP, mixing zone 0.3 of the tank', loadNet('Net1.inp', setMix('2COMP', 0.3), NET1_MSX), 5e-4);
		await against('Net1, tank mixing model 2COMP, mixing zone the whole tank', loadNet('Net1.inp', setMix('2COMP', 1), NET1_MSX), 5e-4);
		// a small mixing zone is stiff (the inflow of a step is a large share of it) and the two solvers' last digits show: HELD, not hidden
		await against('Net1, tank mixing model 2COMP, mixing zone 0.05 of the tank', loadNet('Net1.inp', setMix('2COMP', 0.05), NET1_MSX), 3e-3);
		const n3 = NET1_MSX.replace('CONC 10 CL2 1.5 P1', 'CONC 15 CL2 1.5 P1').replace('MASS 13 TOT 20', 'MASS 20 TOT 20').replace('NODE 9 CL2 1.0\n', '');
		await against('Net3, tank mixing model LIFO', loadNet('Net3.inp', setMix('LIFO', 0.4), n3), 0.0012);
		await against('Net3, tank mixing model 2COMP', loadNet('Net3.inp', setMix('2COMP', 0.4), n3), 0.0012);
	}
}

async function run() {
	await slice1();
	await slices2to5();
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });
