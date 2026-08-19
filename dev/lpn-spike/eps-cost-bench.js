// WHAT DOES A PERIOD RUN ACTUALLY COST, AND HOW DOES IT SCALE? -- ROADMAP Task 248.
//
//   node dev/lpn-spike/eps-cost-bench.js
//
// WHY THIS EXISTS. Tom, 2026-08-19: "I am not opposed to benchmarking and brainstorming entire-
// simulation recalculation on the fly. I am just foreseeing the multiplied burden of recalculating
// every time step at every value change. That's not good for data entry efficiency." The question
// that settles is a MEASUREMENT, not a preference: how long does one run block the main thread, and
// what happens to that number when the reporting step gets finer or the network gets bigger.
//
// The axis that matters is the REPORTING STEP, because that is what multiplies. Net3's own 1-hour
// step over 24 hours is 25 frames; a 1-minute step over the same day is 1441, and a modeller
// chasing a transient sets exactly that.
//
// WHAT THIS CANNOT TELL YOU, exactly as dev/lpn-spike/engine-bench.js says of its own numbers:
// this is Node, not a browser. Treat the shape of the curve as the finding and the absolute
// milliseconds as representative rather than exact.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

// The page's edge, in the shape dev/lpn-spike/eps-net3-harness.js builds it -- the file's own units
// in, SI out, through the parser's own scale table rather than retyped constants.
function buildModel(parsed) {
	const S = parsed.scale;
	const nodes = parsed.nodes.map((n) => {
		if (n.type === 'tank') {
			return { id: n.id, type: 'tank', elev: n.elev * S.head, head: (n.elev + n.level) * S.head,
				level: n.level * S.head, minLevel: n.minLevel * S.head, maxLevel: n.maxLevel * S.head,
				diameter: n.diameter * S.head };
		}
		if (n.type === 'reservoir') { return { id: n.id, type: 'reservoir', elev: n.elev * S.head, head: n.head * S.head }; }
		return { id: n.id, type: 'junction', elev: n.elev * S.head,
			demandBase: n.demand * S.flow,
			demandPattern: n.demandPattern || parsed.defaultPattern || null,
			demand: n.demand * S.flow, emitter: n.emitter };
	});
	const links = parsed.links.map((l) => {
		const out = { id: l.id, type: l.type, from: l.from, to: l.to,
			diameter: l.diameter * S.dia, roughness: l.roughness,
			length: (l.length || 0) * S.len, status: l.status, k: l.k || 0 };
		if (l.type === 'valve') {
			out.valveType = l.valveType;
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
	const model = { nodes, links, method: 'hw', visc: 1.007e-6, emitterExponent: parsed.emitterExponent };
	const toSI = (v, id) => (typeof v === 'number'
		? v * ({ lpn_u_elevhead: S.head, lpn_u_flow: S.flow, lpn_u_diameter: S.dia, lpn_u_length: S.len, lpn_u_pressure: S.press })[id]
		: v);
	model.time = EngCalcs.lpnTimeModelBlock(
		{ times: parsed.times, patterns: parsed.patterns, defaultPattern: parsed.defaultPattern, controls: parsed.controls },
		toSI);
	return model;
}

// The same network repeated `copies` times, ids suffixed, so size varies without the hydraulics
// changing character. The copies are independent networks in one document, which is what a big
// drawing usually is anyway.
function scaled(base, copies) {
	const nodes = [], links = [];
	for (let c = 0; c < copies; c++) {
		const sfx = c === 0 ? '' : '#' + c;
		base.nodes.forEach((n) => nodes.push(Object.assign({}, n, { id: n.id + sfx })));
		base.links.forEach((l) => links.push(Object.assign({}, l, { id: l.id + sfx, from: l.from + sfx, to: l.to + sfx })));
	}
	return Object.assign({}, base, { nodes, links });
}

function ms(t) { return (Number(t) / 1e6).toFixed(1); }

(async function () {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);
	const base = buildModel(parsed);
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	async function time(model, label) {
		// Two runs; the second is reported. The first pays for whatever the engine caches.
		await EngCalcs.lpnEpanetRun(model);
		const t0 = process.hrtime.bigint();
		const run = await EngCalcs.lpnEpanetRun(model);
		const dt = process.hrtime.bigint() - t0;
		console.log('  ' + label.padEnd(46) + ms(dt).padStart(8) + ' ms   ' +
			String(run.frames ? run.frames.length : 0).padStart(5) + ' frames');
		return Number(dt) / 1e6;
	}

	console.log('Net3: ' + base.nodes.length + ' nodes, ' + base.links.length + ' links\n');

	console.log('ONE STEADY SOLVE -- what an edit costs when the period is not re-run');
	{
		const steady = JSON.parse(JSON.stringify(base));
		delete steady.time;
		await EngCalcs.lpnSolveEpanet(steady);
		const t0 = process.hrtime.bigint();
		await EngCalcs.lpnSolveEpanet(steady);
		console.log('  EngCalcs.lpnSolveEpanet (t=0)'.padEnd(48) + ms(process.hrtime.bigint() - t0).padStart(8) + ' ms');
	}

	console.log('\nTHE REPORTING STEP IS THE AXIS THAT MULTIPLIES (24 h run)');
	for (const [step, label] of [[3600, '1 hour'], [900, '15 minutes'], [300, '5 minutes'], [60, '1 minute']]) {
		const m = JSON.parse(JSON.stringify(base));
		m.time.times = Object.assign({}, m.time.times, { reportStep: step, hydraulicStep: Math.min(3600, step) });
		await time(m, 'report step ' + label);
	}

	console.log('\nA LONGER RUN, at Net3\'s own 1 hour step');
	for (const [dur, label] of [[86400, '24 hours'], [604800, '1 week'], [2592000, '30 days']]) {
		const m = JSON.parse(JSON.stringify(base));
		m.time.times = Object.assign({}, m.time.times, { duration: dur });
		await time(m, 'duration ' + label);
	}

	console.log('\nAND SIZE, at 24 h / 1 hour');
	for (const copies of [1, 4, 10]) {
		const m = scaled(JSON.parse(JSON.stringify(base)), copies);
		await time(m, copies + 'x Net3 (' + m.nodes.length + ' nodes, ' + m.links.length + ' links)');
	}
}());
