// WATERGEMS UNIT DEMAND LOADS AND PER-SCENARIO DEMAND ADJUSTMENTS (ROADMAP Task 749). Run with:
//
//   node dev/lpn-spike/wtg-unit-demand-harness.js
//
// Two real WaterCAD models from a consulting firm (supplied by Tom, never in the repository) showed
// what the public samples could not: ALL their demand sits in unit demand loads (loading units times
// a unit load; each row stores its flow), and their scenarios (average day, maximum day, peak hour)
// differ ONLY in the EPANET engine's demand adjustment (1, 1.8, 3.0), each scenario owning one
// calculation-options row. This builds the same two shapes from synthetic data (Python sqlite3, at
// test time) and holds that the reader carries them, then, when EC_WTG_PRIVATE_DIR names a folder of
// real models, asserts aggregate properties only (it opens, imports, solves) and prints nothing from them.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
require('./bootstrap.js');
const initSqlJs = require(path.join(ROOT, 'js', 'vendor', 'sql-wasm.js'));
require(path.join(ROOT, 'js', 'lpn-sqlite.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-wtg.js'));
const EC = globalThis.EngCalcs;
EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(path.join(ROOT, 'js', 'vendor', 'sql-wasm.wasm')));
const { buildSyntheticWtg } = require('./wtg-synthetic-fixture.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
function noteOf(r, code) { return r.notes.filter((n) => n.code === code)[0] || null; }
function section(inp, name) {
	const out = [];
	let on = false;
	for (const l of inp.split(/\r?\n/)) {
		if (/^\[/.test(l)) { on = l === '[' + name + ']'; continue; }
		if (on && l.trim() && l.trim()[0] !== ';') { out.push(l.trim().split(/\s+/)); }
	}
	return out;
}

// Base options 48 (no adjustment); the Peak scenario (60) owns options 49 with a UNIT adjustment of 3.5
// (scope 0, operation 2: multiply); the child 61 owns none and so takes its parent's. J1 gets a 4 L/s
// unit demand load of 100 units. `onlyUnit` removes J1's and J3's normal demands (the real models' shape).
function extra(unitAdjust, onlyUnit, baseAdjust) {
	return `
x('CREATE TABLE IdahoDemandNode_Demand_UnitDemandLoadCollection (ItemID, DomainElementID, AlternativeID, UnitDemandLoadCollection_UnitDemandLoadID, UnitDemandLoadCollection_NumberOfLoadingUnits, UnitDemandLoadCollection_UnitDemandBaseFlow, UnitDemandLoadCollection_UnitDemandPatternID)')
x('CREATE TABLE EpaNetEngine_UnitDemandAdjustmentsCollection (ItemID, CalculationOptionsID, UnitDemandAdjustmentsCollection_UnitDemandScopeID, UnitDemandAdjustmentsCollection_UnitDemandID, UnitDemandAdjustmentsCollection_UnitDemandAdjustmentValue, UnitDemandAdjustmentsCollection_UnitDemandOrderIndex, UnitDemandOperation)')
x("UPDATE IdahoDemandNode_Demand_Data SET UnitDemandLoadCollectionCount = 1 WHERE DomainElementID = 101")
x('INSERT INTO IdahoDemandNode_Demand_UnitDemandLoadCollection VALUES (1, 101, 35, 9999, 100, ?, NULL)', (4 * L,))
x('INSERT INTO EpaNetEngine VALUES (49,1,1,40,0.001,1.0837399580445e-05,1.0,1584489600,2,10,0,0.5,0,1,0,0,0)')
x('INSERT INTO EpaNetEngine_TimeAnalysisType_EpsType VALUES (49,86400,3600,3600,0)')
x('INSERT INTO HMIScenarioCalculationOptions VALUES (60, -1304441024, 49, 1)')
x('INSERT INTO EpaNetEngine_UnitDemandAdjustmentsCollection VALUES (1, 49, 0, 0, ${unitAdjust}, 0, 2)')
x('INSERT INTO EpaNetEngine_UnitDemandAdjustmentsCollection VALUES (2, 48, 0, 0, ${baseAdjust}, 0, 2)')
x('UPDATE EpaNetEngine SET UnitDemandAdjustmentsCollectionCount = 1 WHERE CalculationOptionsID = 48')
` + (onlyUnit ? `
x('DELETE FROM IdahoDemandNode_Demand_DemandCollection')
x('UPDATE IdahoDemandNode_Demand_Data SET DemandCollectionCount = 0')
` : '');
}

async function build(tag, unitAdjust, onlyUnit, baseAdjust) {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wtg-ud-'));
	const file = buildSyntheticWtg(path.join(tmp, tag + '.wtg.sqlite'), extra(unitAdjust, onlyUnit, baseAdjust === undefined ? 2.0 : baseAdjust));
	const db = await EC.lpnSqliteOpen(fs.readFileSync(file));
	return EC.lpnWtgRead(db, { flowUnits: 'LPS' });
}

async function synthetic() {
	head('1. Unit demand loads only, Base adjusted 2.0, Peak scenario 3.5 (the real models\' shape)');
	let r = await build('only', 3.5, true);
	ok('read succeeds', r.ok, r.message);
	let J = section(r.inp, 'JUNCTIONS');
	const j1 = J.filter((t) => t[0] === 'J1')[0];
	ok('J1 demand is the load\'s 4 L/s, not the 100 loading units and not adjusted', j1 && j1[2] === '4', JSON.stringify(j1));
	ok('Demand Multiplier is the unit adjustment of Base, 2', /Demand Multiplier\s+2\n/.test(r.inp));
	ok('a note says the demand comes from unit loads, naming J1', noteOf(r, 'wtg-unit-demand') && noteOf(r, 'wtg-unit-demand').ids.indexOf('J1') >= 0);
	ok('no "customer demand not imported" note for a unit load', !noteOf(r, 'wtg-customer-demand'));
	const peak = r.scenarios.filter((s) => s.name === 'Peak')[0], small = r.scenarios.filter((s) => s.name === 'Peak, small main')[0];
	ok('scenario Peak carries its own multiplier, 3.5', peak && peak.demandMultiplier === 3.5, JSON.stringify(peak && peak.demandMultiplier));
	ok('its child takes the parent\'s calculation options, 3.5', small && small.demandMultiplier === 3.5);
	ok('the Base scenario states no multiplier of its own', r.scenarios.every((s) => s.name !== r.baseScenario));

	head('2. A scenario with the same adjustment as Base states none');
	r = await build('same', 2.0, true, 2.0);
	const peak2 = r.scenarios.filter((s) => s.name === 'Peak')[0];
	ok('Peak at 2.0 with Base at 2.0: no demandMultiplier on the record', peak2 && peak2.demandMultiplier === undefined);

	head('3. Normal demands and a unit load together: the unit adjustment is applied to the loads');
	r = await build('mixed', 3.5, false);
	J = section(r.inp, 'JUNCTIONS');
	const dem = section(r.inp, 'DEMANDS').filter((t) => t[0] === 'J1').map((t) => t[1]);
	ok('Demand Multiplier is the NORMAL adjustment (none stated, so 1)', /Demand Multiplier\s+1\n/.test(r.inp));
	ok('the unit load is written at 4 L/s x 2 (Base unit adjustment) = 8', dem.indexOf('8') >= 0, JSON.stringify(dem));
	ok('the report says the unit adjustment could not stay a multiplier', !!noteOf(r, 'wtg-demand-adjustments'));
}

// The private half: a folder of real models named by EC_WTG_PRIVATE_DIR. Aggregate properties only.
async function priv() {
	head('2. Real models (EC_WTG_PRIVATE_DIR)');
	const dir = process.env.EC_WTG_PRIVATE_DIR;
	if (!dir || !fs.existsSync(dir)) { console.log('  SKIPPED (EC_WTG_PRIVATE_DIR not set)'); return; }
	const files = fs.readdirSync(dir).filter((f) => /\.wtg\.sqlite$/i.test(f));
	if (!files.length) { console.log('  SKIPPED (no .wtg.sqlite in the folder)'); return; }
	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	let n = 0;
	for (const f of files) {
		n++;
		const tag = 'model ' + n;
		const db = await EC.lpnSqliteOpen(fs.readFileSync(path.join(dir, f)));
		ok(tag + ': recognised as a WaterGEMS model', EC.lpnWtgIsWtg(db));
		const wtg = path.join(dir, f.replace(/\.sqlite$/i, ''));
		const display = fs.existsSync(wtg) ? EC.lpnWtgDisplayUnits(fs.readFileSync(wtg, 'utf8')) : null;
		const r = EC.lpnWtgRead(db, { display });
		ok(tag + ': imports', r.ok);
		const counts = r.counts;
		ok(tag + ': has junctions, pipes and a source', counts.junctions > 0 && counts.pipes > 0 && counts.reservoirs + counts.tanks > 0);
		const J = section(r.inp, 'JUNCTIONS');
		const tot = J.reduce((a, t) => a + Number(t[2] || 0), 0) + section(r.inp, 'DEMANDS').reduce((a, t) => a + Number(t[1] || 0), 0);
		ok(tag + ': carries demand (the total is above zero)', tot > 0);
		const ws = new mod.Workspace();
		await ws.loadModule();
		const p = new mod.Project(ws);
		ws.writeFile('h.inp', r.inp);
		let solved = true;
		try { p.open('h.inp', 'h.rpt', 'h.out'); p.openH(); p.initH(0); p.runH(); } catch (e) { solved = false; }
		let minP = Infinity, maxP = -Infinity;
		if (solved) {
			for (let i = 1; i <= p.getCount(0); i++) {
				if (p.getNodeType(i) !== 0) { continue; }
				const v = p.getNodeValue(i, 11);
				minP = Math.min(minP, v); maxP = Math.max(maxP, v);
			}
			p.closeH(); p.close();
		}
		ok(tag + ': EPANET solves it', solved);
		ok(tag + ': pressures are sane (all junctions between 0 and 300 in the file\'s units)', solved && minP > 0 && maxP < 300);
		ok(tag + ': every scenario has a demand multiplier or is the base', r.scenarios.every((s) => s.demandMultiplier === undefined || s.demandMultiplier > 0));
	}
}

(async () => {
	await synthetic();
	await priv();
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})();
