// THE EPANET RUN REPORT IS IN THE PROJECT'S UNITS, AND THE RUN'S NUMBERS DID NOT MOVE. Run with:
//   node dev/lpn-spike/run-report-units-harness.js
//
// Tom, 2026-10-11, on Project > EPANET run report: *"why the Input data file is "eps.inp" ...
// Is the EPANET run in SI always? ... "Tank T-NW is closed at 7.01 m", and I wonder whether m
// means minutes or meters ... I see that the flow is in L/s."* The input stays LPS and metres; the
// engine's REPORTING units are switched after it reads the file (EngCalcs.lpnReportUnits), and
// every value read back is multiplied into L/s and metres again. This holds both halves:
//   1. every result the rest of the page sees -- heads, pressures, demands, flows, velocities,
//      head losses, statuses, tank levels, quality, reaction rates, pump energy, convergence --
//      is the LPS run's within 1e-6 relative (1e-6 absolute floor in SI units, for closed
//      links whose flow is noise around zero), over a full day of Net1 (chemical, pumps, rules) and the SI example;
//   2. Net3's trace percentages, which EPANET computes from a single-precision copy of its own
//      hydraulics written in the reporting units, are held to that precision instead (below);
//      its hydraulics are held to 1e-6 like everything else;
//   3. the report a visitor reads names temp.inp and states the project's units.
//
// THE BASELINE IS THE OLD PATH, NOT A COPY OF IT: the same model with `reportUnits` taken off,
// which lpnReportUnits answers with null -- no switch, no factor, the code as it ran before.
// The SI cases: the shipped SI example run as an L/s project (unchanged by construction, so the
// report must still say LPS) and as an m3/h one; and Net1/Net3 with their reporting unit set to
// m3/h, which is what an SI project of the same network hands the engine (the model is SI either
// way; a project's units decide only reportUnits).

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, unitSelects, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tmigrateSaved: migrateSaved, applySaved: applySaved, assembleModel: assembleModel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

function open(file, unitSet) {
	setUnitSet(unitSet);
	L.applySaved(L.migrateSaved(JSON.parse(fs.readFileSync(ROOT + (/^Basic-/.test(file) ? 'dev/lpn-spike/fixtures/' : /^Net[23]\.lwn$/.test(file) ? 'dev/water-network-examples/' : 'examples/') + file, 'utf8'))));
}

// The absolute floor is in the run's own SI units: 1e-6 m3/s is 0.016 gpm, 1e-6 m/s a micron a
// second. Below it a value is a closed link's leftover, not an answer.
const REL = 1e-6, ABS = 1e-6;
function close(a, b) {
	if (typeof a !== 'number' || typeof b !== 'number') { return a === b; }
	return Math.abs(a - b) <= REL * Math.max(Math.abs(a), Math.abs(b)) + ABS;
}
// Every keyed map on every frame, plus the frame's own numbers. A map present on one side only
// is a difference too.
function compareRuns(a, b, skip) {
	let worst = 0, where = '', checked = 0, bad = 0;
	if (a.frames.length !== b.frames.length) { return { bad: 1, where: 'frame count ' + a.frames.length + ' vs ' + b.frames.length }; }
	a.frames.forEach(function (fa, i) {
		const fb = b.frames[i];
		Object.keys(Object.assign({}, fa, fb)).forEach(function (key) {
			if (skip && skip.indexOf(key) >= 0) { return; }
			const va = fa[key], vb = fb[key];
			if (va && typeof va === 'object') {
				Object.keys(Object.assign({}, va, vb || {})).forEach(function (id) {
					const x = va[id], y = (vb || {})[id];
					checked++;
					if (!close(x, y)) { bad++; if (!where) { where = i + ' ' + key + ' ' + id + ': ' + x + ' vs ' + y; } }
					if (typeof x === 'number' && typeof y === 'number' && Math.abs(x) > 1e-3) {
						const r = Math.abs(x - y) / Math.abs(x);
						if (r > worst) { worst = r; }
					}
				});
			} else {
				checked++;
				if (!close(va, vb)) { bad++; if (!where) { where = i + ' ' + key + ': ' + va + ' vs ' + vb; } }
			}
		});
	});
	return { bad: bad, where: where, worst: worst, checked: checked };
}
function stripUnits(model) { const m = Object.assign({}, model); delete m.reportUnits; return m; }
async function pair(model) {
	const before = await global.EngCalcs.lpnEpanetRun(stripUnits(model), {});
	const after = await global.EngCalcs.lpnEpanetRun(model, {});
	return { before: before, after: after };
}
// THE QUALITY HALF OF Net3, AGAINST THE ENGINE'S OWN PRECISION. EPANET hands its hydraulics to
// the quality step through a SINGLE-PRECISION file written in the reporting units (src/output.c),
// so a run reported in gpm rounds every flow at a different seventh digit than one in L/s, and a
// trace percentage carries that. The yardstick is the same L/s run with every pipe's roughness
// moved by 1e-7, the precision of that file: the switch must not move a quality further than
// three times what that does. Measured 2026-10-11 on Net3: the largest trace difference is
// 0.0003 percentage points, against 0.0001 for the yardstick.
function maxAbs(a, b, key) {
	let worst = 0;
	a.frames.forEach(function (fa, i) {
		const ma = fa[key] || {}, mb = b.frames[i][key] || {};
		for (const id in ma) { worst = Math.max(worst, Math.abs(ma[id] - mb[id])); }
	});
	return worst;
}
async function qualityWithinPrecision(label, model, r) {
	const m = JSON.parse(JSON.stringify(stripUnits(model)));
	m.links.forEach((l) => { if (l.type === 'pipe') { l.roughness *= (1 + 1e-7); } });
	const yard = await global.EngCalcs.lpnEpanetRun(m, {});
	['qualities', 'linkQualities'].forEach(function (key) {
		const d = maxAbs(r.before, r.after, key), y = maxAbs(r.before, yard, key);
		ok(label + ': ' + key + ' move no more than 3x single precision does', d <= 3 * y && y > 0,
			d.toExponential(1) + ' against ' + y.toExponential(1));
	});
}
function sameResults(label, r, kinds, skip) {
	const c = compareRuns(r.before, r.after, skip);
	ok(label + ': every ' + (skip ? 'hydraulic ' : '') + 'result identical to the L/s run within 1e-6',
		c.bad === 0 && c.checked > 0, c.checked + ' values, worst ' + (c.worst || 0).toExponential(1) + (c.where ? ', first: ' + c.where : ''));
	(kinds || []).forEach(function (k) {
		ok('...and the comparison really covered ' + k, r.after.frames.some((f) => f[k] && Object.keys(f[k]).length > 0));
	});
	const ea = JSON.stringify(r.before.energy || null), eb = JSON.stringify(r.after.energy || null);
	if (r.before.energy) {
		const flat = (o, out) => { for (const k in o) { if (o[k] && typeof o[k] === 'object') { flat(o[k], out); } else { out.push(o[k]); } } return out; };
		const xa = flat(r.before.energy, []), xb = flat(r.after.energy, []);
		ok('...and the pump energy totals too', xa.length === xb.length && xa.every((x, i) => close(x, xb[i])), ea.slice(0, 120));
	} else {
		ok('...(no energy block on either side)', ea === eb);
	}
}

(async function () {
	await warmEpanet();

	console.log('1. A US PROJECT: Net1 (chemical, pumps, rules) and Net3 (trace, pumps), full day');
	open('Net1.lwn', 'us');
	let model = L.assembleModel();
	ok('assembleModel hands the run the project\'s unit names', JSON.stringify(model.reportUnits) ===
		JSON.stringify({ flow: 'gpm', length: 'ft', diameter: 'in' }), JSON.stringify(model.reportUnits));
	let r = await pair(model);
	sameResults('Net1 in gpm', r, ['heads', 'pressures', 'flows', 'velocities', 'headlosses', 'levels', 'qualities', 'linkQualities', 'linkRates']);
	const net1 = r.after.report;
	ok('the report names its input temp.inp', /Input Data File \.+ temp\.inp/.test(net1), (net1.match(/Input Data File.*/) || [''])[0]);
	ok('...and never eps.inp', !/eps\.inp/.test(r.after.report + r.before.report));
	ok('the tank messages are in feet', /Tank 2 is (closed|filling|emptying|open) at [\d.]+ ft/.test(net1),
		(net1.match(/Tank 2 is .*/) || [''])[0]);
	ok('...where the L/s run printed metres', /Tank 2 is \w+ at [\d.]+ m\b/.test(r.before.report));
	ok('the report never says L/s or LPS', !/\bLPS\b|L\/s|\blps\b/.test(net1));

	open('Net3.lwn', 'us');
	model = L.assembleModel();
	r = await pair(model);
	sameResults('Net3 in gpm', r, ['heads', 'pressures', 'flows', 'velocities', 'headlosses', 'levels', 'demands'], ['qualities', 'linkQualities']);
	await qualityWithinPrecision('Net3 in gpm', model, r);
	const net3 = r.after.report;
	ok('Net3\'s tank messages are in feet', /Tank \w+ is \w+ at [\d.]+ ft/.test(net3), (net3.match(/Tank \w+ is .*/) || [''])[0]);
	ok('...and the report never says L/s or LPS', !/\bLPS\b|L\/s|\blps\b/.test(net3));

	console.log('\n2. THE SAME NETWORKS REPORTED IN m3/h, AS AN SI PROJECT IN m3/h HANDS THEM OVER');
	for (const file of ['Net1.lwn', 'Net3.lwn']) {
		open(file, 'us');
		model = L.assembleModel();
		model.reportUnits = { flow: 'cmh', length: 'm', diameter: 'mm' };
		if (file === 'Net1.lwn') { r = await pair(model); sameResults(file + ' in m3/h', r, ['heads', 'flows']); }
		else {
			r = await pair(model);
			sameResults(file + ' in m3/h', r, ['heads', 'flows'], ['qualities', 'linkQualities']);
			await qualityWithinPrecision(file + ' in m3/h', model, r);
		}
		ok('...and its tank messages are in metres', /Tank \w+ is \w+ at [\d.]+ m\b/.test(r.after.report),
			(r.after.report.match(/Tank \w+ is .*/) || [''])[0]);
	}

	console.log('\n3. A REAL SI PROJECT: the shipped SI example, in L/s and then in m3/h');
	open('Basic-example-SI-units.lwn', 'si');
	model = L.assembleModel();
	ok('an L/s project needs no switch at all', global.EngCalcs.lpnReportUnits(model.reportUnits) === null,
		JSON.stringify(model.reportUnits));
	r = await pair(model);
	sameResults('SI example in L/s', r, ['heads', 'flows']);
	ok('...and its report is the L/s one it always was', r.after.report === r.before.report && r.after.report.length > 0);
	const sel = unitSelects.lpn_u_flow;
	sel.selectedIndex = sel.options.findIndex((o) => o.value === 'cmh');
	model = L.assembleModel();
	ok('the m3/h project hands over cmh', model.reportUnits.flow === 'cmh');
	r = await pair(model);
	sameResults('SI example in m3/h', r, ['heads', 'flows']);

	console.log('\n4. A WALL REACTION IS THE ONE COEFFICIENT THE SWITCH DOES NOT CONVERT');
	open('Net1.lwn', 'us');
	model = L.assembleModel();
	ok('Net1 carries a wall coefficient, so section 1 really tested it',
		Object.values((model.reactions || {}).wall || {}).some((k) => k !== 0) || (model.reactions || {}).globalWall,
		JSON.stringify(model.reactions && model.reactions.globalWall));

	// **A RESTATEMENT THAT FAILS PART WAY IS UNDONE** (Perry's review, 2026-10-11). The setter is
	// made to throw on the fifth pipe, after four are already in feet; the run must fall back to
	// an L/s report with every pipe's coefficient back as the file stated it, so its chlorine is
	// the L/s run's exactly.
	{
		const real = global.EngCalcs.lpnReportWallKept;
		let writes = 0, threw = false;
		global.EngCalcs.lpnReportWallKept = function (p, m, ru) {
			const q = {
				getOption: (a) => p.getOption(a),
				getLinkIndex: (a) => p.getLinkIndex(a),
				getLinkValue: (a, b) => p.getLinkValue(a, b),
				setLinkValue: (a, b, c) => {
					writes++;
					if (writes === 5) { threw = true; throw new Error('forced failure on the fifth pipe'); }
					return p.setLinkValue(a, b, c);
				}
			};
			return real(q, m, ru);
		};
		try {
			r = await pair(model);
		} finally {
			global.EngCalcs.lpnReportWallKept = real;
		}
		ok('the forced failure really came after four pipes were restated', threw && writes > 5, String(writes));
		sameResults('Net1 after a failed restatement', r, ['qualities', 'linkQualities', 'linkRates']);
		ok('...and that run fell back to the L/s report', r.after.report === r.before.report && /LPS|L\/s/.test(r.after.report));
	}

	console.log('\n5. THE RULE FOR A FLOW UNIT EPANET HAS NO WORD FOR');
	const RU = global.EngCalcs.lpnReportUnits;
	ok('gph in a feet project reports in gpm', RU({ flow: 'gph', length: 'ft', diameter: 'in' }).code === 1);
	ok('m3/s in a metre project stays L/s', RU({ flow: 'm3ps', length: 'm', diameter: 'mm' }) === null);
	ok('cfs is EPANET\'s CFS', RU({ flow: 'ft3ps', length: 'ft' }).code === 0);

	console.log(fails === 0 ? '\nrun report units harness: all checks passed'
		: '\nrun report units harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}());
