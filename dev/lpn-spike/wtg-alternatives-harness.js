// A WaterGEMS MODEL'S ALTERNATIVES AND SCENARIOS, AS THE PAGE STORES AND RESOLVES THEM -- ROADMAP Task 749. Run with:
//
//   node dev/lpn-spike/wtg-alternatives-harness.js
//
// The reader (js/lpn-wtg.js) gives each scenario the stored alternatives it names; the page lays them onto the
// document (landWtgResult()) and resolves them (effective(), the stored tree of dev/scenario-alternatives.md).
// This holds the whole road on Tom's WTG-tgh-1 sample (outside the repository, WTG_TGH_DIR): with scenario TGH-1
// open the page reads every pipe, node, tank, pump and valve value that WaterGEMS's own TGH-1 export states, and with
// Base open, the Base export's. It then holds the tree shapes on a synthetic model (wtg-synthetic-fixture.js, built
// by Python at test time): two scenarios that share one alternative are one stored record both name, and an
// alternative that hangs from another keeps its parent.
// Record: dev/sqlite-reader.md, "Pumps and valves as nodes, a continuous pattern, and the alternatives themselves".
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { ROOT, setUnitSet, loadLoopedNetwork } = stub;
const FX = process.env.WTG_TGH_DIR || '/home/haws/tom-files/2026-10-19';
if (!fs.existsSync(path.join(FX, 'WTG-tgh-1.wtg.sqlite'))) {
	console.log('NOT RUN (fixture not present: ' + path.join(FX, 'WTG-tgh-1.wtg.sqlite') + ')');
	process.exit(0);
}
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-rules.js');
// The stub's `window` is not its global; in a browser they are one, and these two modules attach to `window`.
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-sqlite.js');
require(ROOT + 'js/lpn-wtg.js');
const initSqlJs = require(ROOT + 'js/vendor/sql-wasm.js');
const EC = global.EngCalcs;
EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(ROOT + 'js/vendor/sql-wasm.wasm'));
global.alert = global.window.alert = function () { };

const INJECT =
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; }, getProject: function () { return project; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, landWtgResult: landWtgResult, serializeProject: serializeProject,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function same(a, b) {
	if (typeof a === 'number' && typeof b === 'number') { return Math.abs(a - b) <= 1e-9 + 1e-6 * Math.abs(b); }
	return a === b;
}
function pointsSame(a, b) { return !!a && !!b && a.length === b.length && a.every((p, i) => same(p[0], b[i][0]) && same(p[1], b[i][1])); }
function rename(theirs) {
	const alias = {};
	theirs.links.forEach((l) => { if (l.type === 'pump' || l.type === 'valve') { alias[l.from] = l.id + '-U'; alias[l.to] = l.id + '-D'; } });
	theirs.nodes.forEach((n) => { if (alias[n.id]) { n.id = alias[n.id]; } });
	theirs.links.forEach((l) => { l.from = alias[l.from] || l.from; l.to = alias[l.to] || l.to; });
	return theirs;
}

// ---------------------------------------------------------------------------------------------
// The shapes of the tree, on the synthetic model with alternativesExtra() added.
// ---------------------------------------------------------------------------------------------
async function tree() {
	console.log('\n=== the shapes of the tree: sharing, depth, a return to Base, categories with no home ===');
	const os = require('os');
	const { buildSyntheticWtg, alternativesExtra } = require('./wtg-synthetic-fixture.js');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wtg-alt-'));
	const file = buildSyntheticWtg(path.join(tmp, 'Alternatives.wtg.sqlite'), alternativesExtra());
	const db = await EC.lpnSqliteOpen(fs.readFileSync(file));
	const r = EC.lpnWtgRead(db, { flowUnits: 'LPS' });
	db.close();
	ok('reads', r.ok, r.message);
	const sc = (name) => r.scenarios.filter((x) => x.name === name)[0] || {};
	const alt = (fileId) => r.alternatives.filter((x) => x.fileId === fileId)[0] || {};
	const shared = sc('Shared A'), small = sc('Peak, small main'), deep = sc('Deep'), reset = sc('Reset');
	ok('five scenarios beyond Base', r.scenarios.length === 5, r.scenarios.map((x) => x.name).join());
	ok('"Shared A" and "Peak, small main" name the same Physical alternative, one record', shared.alternatives.physical === small.alternatives.physical && alt(shared.alternatives.physical).name === 'Small main' &&
		r.alternatives.filter((x) => x.name === 'Small main').length === 1, JSON.stringify([shared.alternatives, small.alternatives]));
	ok('"Smaller P3" hangs from "Small main" and holds only P3', alt(deep.alternatives.physical).name === 'Smaller P3' && alt(deep.alternatives.physical).parentFileId === small.alternatives.physical &&
		JSON.stringify(alt(deep.alternatives.physical).values) === '{"l:P3":{"diameter":180}}', JSON.stringify(alt(deep.alternatives.physical)));
	ok('"P4 closed" is an Initial settings alternative holding P4 closed', alt(shared.alternatives.initial).category === 'initial' && JSON.stringify(alt(shared.alternatives.initial).values) === '{"l:P4":{"status":"closed"}}',
		JSON.stringify(alt(shared.alternatives.initial)));
	ok('"Hot J3" is a Demand alternative holding J_3 at 3', alt(deep.alternatives.demand).category === 'demand' && JSON.stringify(alt(deep.alternatives.demand).values) === '{"n:J_3":{"demand":3}}',
		JSON.stringify(alt(deep.alternatives.demand)));
	ok('"Chlorine 1" (Constituent) is carried by name, with no values', alt(deep.alternatives.constituent).name === 'Chlorine 1' && alt(deep.alternatives.constituent).category === 'constituent' &&
		!Object.keys(alt(deep.alternatives.constituent).values).length);
	ok('"Deep" is a child of Peak, "Reset" a child of "Peak, small main", "Shared A" a child of Base', deep.parentName === 'Peak' && reset.parentName === 'Peak, small main' && shared.parentName === null);
	ok('"Reset" goes back to the Base Physical alternative', reset.alternatives.physical === 'base' && Object.keys(reset.alternatives).length === 1, JSON.stringify(reset.alternatives));
	ok('no scenario keeps an override of its own', r.scenarios.every((x) => !Object.keys(x.overrides).length), JSON.stringify(r.scenarios.map((x) => x.overrides)));
	const note = (code) => (r.notes.filter((n) => n.code === code)[0] || { ids: [] }).ids;
	ok('the Operational alternative has no home, and is named', note('wtg-scenario-category').join() === 'Shared A: Night controls (Operational)', note('wtg-scenario-category').join());
	ok('the Constituent alternative is named as imported by name only', note('wtg-alternative-nameonly').join() === 'Chlorine 1 (Constituent)', note('wtg-alternative-nameonly').join());
	ok('the alternatives are listed with their categories', note('wtg-alternatives').indexOf('Small main (Physical)') >= 0 && note('wtg-alternatives').indexOf('P4 closed (Initial Settings)') >= 0, note('wtg-alternatives').join());

	// The page: lay them on, resolve them.
	const L = loadLoopedNetwork(INJECT, null);
	setUnitSet('si');
	L.buildLayers();
	L.seedDefaultInputs();
	ok('lands', !!L.landWtgResult(r, 'Alternatives.wtg.sqlite'));
	const doc = L.getDoc(), scns = L.getScenarios(), byName = (n) => scns.filter((x) => x.name === n)[0];
	ok('six alternatives are stored (Rehab, which no scenario uses, among them)', (doc.alternatives || []).length === 6, (doc.alternatives || []).map((a) => a.name).join());
	ok('the two scenarios that share "Small main" name one stored record', byName('Shared A').alternatives.physical === byName('Peak, small main').alternatives.physical);
	const stored = (id) => (doc.alternatives || []).filter((a) => a.id === id)[0] || {};
	ok('"Smaller P3" is stored with "Small main" as its parent', stored(byName('Deep').alternatives.physical).parent === byName('Shared A').alternatives.physical);
	ok('"Reset" names the Base alternative', byName('Reset').alternatives.physical === 'base');
	const dia = (scnName, id) => { L.switchScenario(byName(scnName).id); return L.effective(L.linkById(id), 'diameter'); };
	const base = L.baseScenario().id;
	L.switchScenario(base);
	ok('Base: P2 300 mm, P3 250 mm, P4 open, J_3 1', L.effective(L.linkById('P2'), 'diameter') === 300 && L.effective(L.linkById('P3'), 'diameter') === 250 &&
		L.effective(L.linkById('P4'), 'status') === 'open' && L.effective(L.nodeById('J_3'), 'demand') === 1);
	ok('Shared A: P2 200, P4 closed', dia('Shared A', 'P2') === 200 && L.effective(L.linkById('P4'), 'status') === 'closed');
	ok('Deep: P2 200 (through "Small main"), P3 180, J_3 3, P4 open', dia('Deep', 'P2') === 200 && L.effective(L.linkById('P3'), 'diameter') === 180 &&
		L.effective(L.nodeById('J_3'), 'demand') === 3 && L.effective(L.linkById('P4'), 'status') === 'open');
	ok('Peak, small main: P2 200, P3 250', dia('Peak, small main', 'P2') === 200 && L.effective(L.linkById('P3'), 'diameter') === 250);
	ok('Reset: P2 back to 300', dia('Reset', 'P2') === 300);
	fs.rmSync(tmp, { recursive: true, force: true });
}

(async () => {
	const db = await EC.lpnSqliteOpen(fs.readFileSync(path.join(FX, 'WTG-tgh-1.wtg.sqlite')));
	const display = EC.lpnWtgDisplayUnits(fs.readFileSync(path.join(FX, 'WTG-tgh-1.wtg'), 'utf8'));
	const r = EC.lpnWtgRead(db, { display });
	db.close();
	const tBase = rename(EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-Base.inp'), 'utf8')));
	const tScen = rename(EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-TGH-1.inp'), 'utf8')));

	const L = loadLoopedNetwork(INJECT, null);
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	const id = L.landWtgResult(r, 'WTG-tgh-1.wtg.sqlite');
	ok('the import lands as a project', !!id);
	const doc = L.getDoc(), scns = L.getScenarios();

	console.log('\n--- the stored tree ---');
	ok('Base and TGH-1', scns.map((s) => s.name).join('|') === 'Base|TGH-1', scns.map((s) => s.name).join('|'));
	const t = scns.filter((s) => s.name === 'TGH-1')[0];
	ok('two stored alternatives, both named TGH-1: one Physical, one Demand', (doc.alternatives || []).length === 2 &&
		doc.alternatives.every((a) => a.name === 'TGH-1') && doc.alternatives.map((a) => a.category).sort().join() === 'demand,physical', JSON.stringify((doc.alternatives || []).map((a) => [a.id, a.name, a.category])));
	const named = (cat) => (doc.alternatives || []).filter((a) => a.id === (t.alternatives || {})[cat])[0];
	ok('scenario TGH-1 names them', !!named('physical') && !!named('demand'), JSON.stringify(t.alternatives));
	ok('its own overrides are the two tank depths only (they follow the base elevation)', JSON.stringify(t.overrides) === '{"n:T-1":{"level":19},"n:T-2":{"level":19}}', JSON.stringify(t.overrides));

	// The page reads each element as the export states it.
	const NODE_PROPS = { junction: ['elev', 'demand'], reservoir: ['head'], tank: ['level', 'minLevel', 'maxLevel', 'tankDiameter'] };
	const EXPORT_NODE = { elev: 'elev', demand: 'demand', head: 'head', level: 'level', minLevel: 'minLevel', maxLevel: 'maxLevel', tankDiameter: 'diameter' };
	function holds(label, theirs) {
		const bad = [];
		let n = 0;
		theirs.nodes.forEach((tn) => {
			const el = L.nodeById(tn.id);
			if (!el) { if (!/-[UD]$/.test(tn.id)) { bad.push('node ' + tn.id + ' missing'); } return; }
			(NODE_PROPS[el.type] || []).forEach((p) => {
				if (el.type === 'tank' && p === 'tankDiameter' && tn.volCurve) { return; }
				n++;
				if (!same(L.effective(el, p), tn[EXPORT_NODE[p]])) { bad.push(el.id + ' ' + p + ' ' + L.effective(el, p) + ' vs ' + tn[EXPORT_NODE[p]]); }
			});
			if (el.type === 'tank') {
				n++;
				const mine = L.effective(el, 'volCurve') || null, cu = mine && (doc.curves || []).filter((c) => c.id === mine)[0];
				const theirsCurve = tn.volCurve ? (theirs.curves.filter((c) => c.id === tn.volCurve)[0] || {}).points : null;
				if (!(mine === null && theirsCurve === null) && !pointsSame(cu && cu.points, theirsCurve)) { bad.push(el.id + ' volume curve'); }
			}
		});
		theirs.links.forEach((tl) => {
			const el = L.linkById(tl.id);
			if (!el) { bad.push('link ' + tl.id + ' missing'); return; }
			if (tl.type === 'pipe') {
				['diameter', 'length', 'roughness', 'k'].forEach((p) => { n++; if (!same(L.effective(el, p), tl[p])) { bad.push(el.id + ' ' + p + ' ' + L.effective(el, p) + ' vs ' + tl[p]); } });
			}
			const curveOf = (cid, parsed) => (cid ? ((parsed.curves.filter((c) => c.id === cid)[0] || {}).points || null) : null);
			const docCurve = (cid) => (cid ? (((doc.curves || []).filter((c) => c.id === cid)[0] || {}).points || null) : null);
			if (tl.type === 'pump') {
				['curveId', 'efficCurveId'].forEach((p) => {
					n++;
					const a = docCurve(L.effective(el, p)), b = curveOf(tl[p], theirs);
					if (!(a === null && b === null) && !pointsSame(a, b)) { bad.push(el.id + ' ' + p); }
				});
			}
			if (tl.type === 'valve') {
				n++;
				if (tl.valveType !== 'GPV' && !same(L.effective(el, 'setting'), tl.setting)) { bad.push(el.id + ' setting ' + L.effective(el, 'setting') + ' vs ' + tl.setting); }
				if (tl.valveType === 'GPV') {
					const a = docCurve(L.effective(el, 'curveId')), b = curveOf(tl.curveId, theirs);
					if (!(a === null && b === null) && !pointsSame(a, b)) { bad.push(el.id + ' GPV curve'); }
				}
			}
		});
		ok(label + ': the page reads ' + n + ' values as WaterGEMS\'s export states them', bad.length === 0 && n > 150, bad.slice(0, 12).join('; '));
	}
	console.log('\n--- Base open ---');
	holds('Base', tBase);
	console.log('\n--- TGH-1 open ---');
	L.switchScenario(t.id);
	holds('TGH-1', tScen);
	L.switchScenario(L.baseScenario().id);
	holds('Base again', tBase);

	// A file written and read back keeps the tree.
	const back = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the saved file keeps the two alternatives and the scenario naming them', (back.alternatives || []).length === 2 && back.scenarios.filter((s) => s.name === 'TGH-1')[0].alternatives.physical, '');

	await tree();
	console.log(fails ? '\n' + fails + ' FAILED' : '\nAll passed.');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
