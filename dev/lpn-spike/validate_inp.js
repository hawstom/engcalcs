// Cross-check: EngCalcs.lpnInpParse (js/lpn-inp.js) against the real EPANET engine.
//
// ROADMAP Task 196. Run:  node dev/lpn-spike/validate_inp.js [extra.inp ...]
//
// WHAT THIS IS ACTUALLY TESTING. Not the solver -- validate.js and validate_epanet.js already
// hold that ground. This tests the READER: whether the network we build out of an `.inp` is the
// same network EPANET builds out of the same file. Every failure mode here is silent by nature.
// A diameter read from the wrong column, gpm taken for L/s, a TCV's setting added to the wrong
// term, [DEMANDS] summed onto the [JUNCTIONS] value instead of replacing it -- each of those
// produces a network that solves perfectly well and answers a question nobody asked. Running both
// engines over the same file is the only thing that catches them.
//
// The comparison is only valid where the import kept the whole network, so a file that still loses
// something (a control valve, a pattern, an extended-period run) is reported as SKIPPED with the
// reason rather than being held to a tolerance it cannot meet.
//
// TANKS LEFT THAT LIST IN TASK 248. They used to be the headline example of it -- the fixture
// beside this file was hand-written without any for exactly that reason -- and now a tank is
// imported as a tank, at its initial level, which is the same boundary condition EPANET solves at
// t = 0. So EPA's own Net1/Net2/Net3 are finally in scope here:
//
//   node dev/lpn-spike/validate_inp.js dev/lpn-spike/reference/Net1.inp

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));

const FT = 0.3048;
const HEAD_TOL = 3e-3;   // m -- EPANET reports through a float API; see validate_epanet.js
const FLOW_TOL = 3e-6;   // m3/s == 0.003 L/s

let failures = 0, checks = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

/**
 * The parse result, as js/lpn-solver.js wants it: everything SI.
 *
 * THE PARSER HANDS BACK THE FILE'S OWN UNITS, so this is where the SI conversion happens --
 * `parsed.scale` states each one and nothing here retypes a constant. It used to be only `length`
 * and the coordinates that arrived unconverted; everything now does, because a value normalised
 * to SI on the way in and converted back for display cannot return the number the file stated
 * (see the units note at the top of js/lpn-inp.js). A solver harness wants SI, so it pays the
 * conversion; the page wants the user's own number, so it pays nothing.
 */
function toSolverModel(parsed) {
	const S = parsed.scale;
	const nodes = parsed.nodes.map((n) => {
		// A tank passes its vessel geometry through as well, because js/lpn-epanet.js writes it
		// into [TANKS] and the native solver ignores it -- see EngCalcs.lpnIsFixedHead.
		// EVERY LENGTH ON A TANK IS IN THE ELEVATION/HEAD UNIT, the vessel diameter included --
		// unlike a pipe diameter, which is inches or millimetres.
		if (n.type === 'tank') {
			return { id: n.id, type: 'tank', elev: n.elev * S.head, head: n.head * S.head,
				level: n.level * S.head, minLevel: n.minLevel * S.head,
				maxLevel: n.maxLevel * S.head, diameter: n.diameter * S.head };
		}
		return n.type === 'reservoir'
			? { id: n.id, type: 'reservoir', elev: n.elev * S.head, head: n.head * S.head }
			// `emitter` is the one quantity the parser already returns in SI -- it is derived, has
			// no display unit, and is documented as the exception at [EMITTERS].
			: { id: n.id, type: 'junction', elev: n.elev * S.head, demand: n.demand * S.flow,
				emitter: n.emitter };
	});
	const links = parsed.links.map((l) => {
		const out = {
			id: l.id, type: l.type, from: l.from, to: l.to,
			diameter: l.diameter * S.dia, roughness: l.roughness,
			length: (l.length || 0) * S.len, status: l.status, k: l.k || 0
		};
		if (l.type === 'valve') {
			// A VALVE'S SETTING IS PART OF THE MODEL, and forgetting it here is silent: the solver
			// reads a throttle valve's loss out of its setting (EngCalcs.lpnLinkK), so a valve
			// arriving with no setting develops NO head loss and the network merrily solves as if
			// the valve were not there. Caught 2026-08-14 the first time a TCV imported as a valve
			// rather than as a pipe -- 3.2 cm of head and a 0.28 L/s flow error, small enough to
			// look like tolerance.
			out.valveType = l.valveType;
			// A setting is a pressure, a flow or a bare coefficient depending on the type, and the
			// parser says which rather than making this file re-derive the type table.
			out.setting = l.settingUnit ? l.setting * S[l.settingUnit] : l.setting;
		}
		if (l.type === 'pump') {
			const fit = (l.curvePoints && l.curvePoints.length)
				? EngCalcs.lpnPumpFromCurve(l.curvePoints.map((pt) => [pt[0] * S.flow, pt[1] * S.head]))
				: { h0: 0, a: 0, b: 2 };
			out.h0 = fit.h0; out.a = fit.a; out.b = fit.b;
		}
		return out;
	});
	return {
		nodes, links, method: 'hw', visc: 1.007e-6,
		emitterExponent: parsed.emitterExponent
	};
}

async function epanetSolve(inpText) {
	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('ref.inp', inpText);
	p.open('ref.inp', 'ref.rpt', 'ref.out');
	// Match the tolerance our own solver runs at, so a disagreement is never just a stopped solve.
	p.setOption(2 /* Option.Accuracy */, 1e-8);
	p.setOption(0 /* Option.Trials */, 200);
	p.openH(); p.initH(0); p.runH();

	const heads = {}, flows = {};
	const nodeCount = p.getCount(0), linkCount = p.getCount(2);
	for (let i = 1; i <= nodeCount; i++) { heads[p.getNodeId(i)] = p.getNodeValue(i, 10) * FT; }
	for (let i = 1; i <= linkCount; i++) { flows[p.getLinkId(i)] = p.getLinkValue(i, 8); }
	p.closeH(); p.close();
	return { heads, flows, flowUnitFactor: null };
}

async function checkFile(file) {
	const text = fs.readFileSync(file, 'utf8');
	const name = path.basename(file);
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { report(false, `${name} parses`, parsed.error); return; }

	report(true, `${name} parses`,
		`${parsed.nodes.length} nodes, ${parsed.links.length} links, ${parsed.flowUnits}, ${parsed.headloss}`);
	for (const d of parsed.dropped) {
		console.log(`       reported: ${d.code}${d.ids.length ? ' [' + d.ids.join(', ') + ']' : ''}${d.detail !== null ? ' (' + d.detail + ')' : ''}`);
	}

	// A file whose import removed elements is no longer the same network, so the numbers below
	// would be comparing two different things. Say so instead of pretending.
	const structural = parsed.dropped.filter((d) =>
		// 'tanks' and 'links-on-tanks' are gone from this list because they are gone from the
		// importer (Task 248): a tank now comes in as a tank, so a file with tanks IS the same
		// network after import and is held to the same tolerance as any other. That is what makes
		// EPA's Net1/Net2/Net3 usable here -- all three have tanks, which is exactly why the
		// fixture beside this file had to be hand-written without any.
		d.code === 'dangling-link' ||
		d.code === 'valve-dropped' || d.code === 'pump-constant-power' || d.code === 'controls' ||
		d.code === 'rules' || d.code === 'patterns' || d.code === 'extended-period' ||
		d.code === 'headloss-formula' || d.code === 'pump-curve-reduced' || d.code === 'link-setting');
	if (structural.length) {
		console.log(`  skip  ${name} numbers   not the same network after import: ${structural.map((d) => d.code).join(', ')}`);
		return;
	}

	const ours = EngCalcs.lpnSolve(toSolverModel(parsed));
	if (!ours.ok) { report(false, `${name} solves`, JSON.stringify(ours.issues)); return; }

	const ref = await epanetSolve(text);

	let worstH = 0, worstHId = null;
	for (const n of parsed.nodes) {
		const d = Math.abs((ours.heads[n.id] || 0) - (ref.heads[n.id] || 0));
		if (d > worstH) { worstH = d; worstHId = n.id; }
	}
	report(worstH <= HEAD_TOL, `${name} heads match EPANET`,
		`max ${worstH.toExponential(2)} m at ${worstHId}`);

	// EPANET reports link flow in the FILE's flow unit; our solver is m3/s. The parser's own table
	// is read rather than restated, so the harness cannot drift from the thing it is checking.
	const unitRatio = EngCalcs.lpnInpFlowUnits[parsed.flowUnits].toSI;
	let worstQ = 0, worstQId = null, biggestQ = 0;
	for (const l of parsed.links) {
		const mine = ours.flows[l.id] || 0;
		const d = Math.abs(mine - (ref.flows[l.id] || 0) * unitRatio);
		if (d > worstQ) { worstQ = d; worstQId = l.id; }
		biggestQ = Math.max(biggestQ, Math.abs(mine));
	}
	// The flow bound is RELATIVE to the largest flow in the network as well as absolute, and the
	// reason is a real model rather than a convenience. Tom's Navajo network joins five nodes with
	// 99-inch pipes carrying no measurable loss; those nodes sit at one head, so how the flow
	// SPLITS between them is close to indeterminate and the two engines legitimately land a gpm
	// apart on a 1-3 gpm stub while agreeing to 2 mm of head everywhere. An absolute bound would
	// call that an import bug. The bound stays tight enough to catch every failure this harness is
	// for: a wrong column or a wrong unit is out by a factor, not by a tenth of a percent.
	const flowBound = Math.max(FLOW_TOL, 1e-3 * biggestQ);
	report(worstQ <= flowBound, `${name} flows match EPANET`,
		`max ${worstQ.toExponential(2)} m3/s at ${worstQId} (bound ${flowBound.toExponential(2)})`);
}

async function main() {
	const extra = process.argv.slice(2);
	const files = extra.length ? extra : [path.join(__dirname, 'reference', 'import-cases.inp')];
	for (const f of files) { await checkFile(f); }
	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
