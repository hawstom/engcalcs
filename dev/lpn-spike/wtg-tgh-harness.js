// THE WaterGEMS CHILD-SCENARIO SAMPLE, js/lpn-wtg.js -- ROADMAP Task 749. Run with:
//
//   node dev/lpn-spike/wtg-tgh-harness.js
//
// fixtures/wtg/WTG-tgh-1.wtg.sqlite is a model Tom saved in WaterGEMS as an ordinary user: Base plus a
// child scenario TGH-1 that changes one pipe diameter (P-1, 8 to 10 in) and one demand (J-1, 0 to
// 1250 gpm). The two `.inp` files beside it are WaterGEMS's own exports of each scenario. The reader's
// Base is compared with the Base export element by element, and Base with TGH-1's overrides laid on is
// compared with the TGH-1 export; the overrides must be exactly the differences between the two exports.
// Tolerance: 1e-6 relative on numbers (the reader writes seven significant digits where WaterGEMS's
// export writes fifteen). Record: dev/sqlite-reader.md, "A scenario that overrides Physical and Demand".
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const FX = path.join(__dirname, 'fixtures', 'wtg');
require('./bootstrap.js');
const initSqlJs = require(path.join(ROOT, 'js', 'vendor', 'sql-wasm.js'));
require(path.join(ROOT, 'js', 'lpn-sqlite.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-wtg.js'));
const EC = globalThis.EngCalcs;
EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(path.join(ROOT, 'js', 'vendor', 'sql-wasm.wasm')));

let fails = 0, compared = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function same(a, b) {
	if (typeof a === 'number' && typeof b === 'number') { return Math.abs(a - b) <= 1e-9 + 1e-6 * Math.abs(b); }
	return a === b;
}
const FIELDS = ['type', 'elev', 'demand', 'head', 'x', 'y', 'length', 'diameter', 'roughness', 'k', 'status', 'from', 'to'];
// Every element of `ours` against `theirs`: same IDs, same kinds, same values in FIELDS.
function diffNetworks(ours, theirs) {
	const out = [];
	['nodes', 'links'].forEach((kind) => {
		const o = Object.fromEntries(ours[kind].map((e) => [e.id, e])), t = Object.fromEntries(theirs[kind].map((e) => [e.id, e]));
		Object.keys(t).forEach((id) => { if (!o[id]) { out.push(kind + ' ' + id + ' missing'); } });
		Object.keys(o).forEach((id) => { if (!t[id]) { out.push(kind + ' ' + id + ' extra'); } });
		Object.keys(t).forEach((id) => {
			if (!o[id]) { return; }
			FIELDS.forEach((f) => {
				if (t[id][f] === undefined && o[id][f] === undefined) { return; }
				compared++;
				if (!same(o[id][f], t[id][f])) { out.push(kind + ' ' + id + ' ' + f + ': ours ' + o[id][f] + ', theirs ' + t[id][f]); }
			});
		});
	});
	return out;
}

(async () => {
	const db = await EC.lpnSqliteOpen(fs.readFileSync(path.join(FX, 'WTG-tgh-1.wtg.sqlite')));
	ok('recognised as a WaterGEMS model', EC.lpnWtgIsWtg(db));
	const display = EC.lpnWtgDisplayUnits(fs.readFileSync(path.join(FX, 'WTG-tgh-1.wtg'), 'utf8'));
	const r = EC.lpnWtgRead(db, { display });
	ok('reads', r.ok, r.message);
	ok('flow units from the .wtg: GPM', r.flowUnits === 'GPM', r.flowUnits);
	ok('Base scenario is named Base', r.baseScenario === 'Base', r.baseScenario);
	const base = EC.lpnInpParse(r.inp);
	const tBase = EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-Base.inp'), 'utf8'));
	const tScen = EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-TGH-1.inp'), 'utf8'));
	ok('all three parse', base.ok && tBase.ok && tScen.ok);
	ok('3 nodes and 2 links', base.nodes.length === 3 && base.links.length === 2, base.nodes.length + ' ' + base.links.length);

	// Base against WaterGEMS's Base export.
	const d0 = diffNetworks(base, tBase);
	ok('Base: every element and value matches the Base export', d0.length === 0, d0.join('; '));

	// The scenario.
	ok('one scenario beyond Base, named TGH-1', r.scenarios.length === 1 && r.scenarios[0].name === 'TGH-1');
	const ov = (r.scenarios[0] || {}).overrides || {};
	// The differences between the two exports, as overrides: the ground truth.
	const truth = {};
	tScen.links.forEach((l) => { const b = tBase.links.filter((x) => x.id === l.id)[0]; ['diameter', 'length', 'roughness', 'k'].forEach((f) => { if (!same(l[f], b[f])) { (truth['l:' + l.id] = truth['l:' + l.id] || {})[f] = l[f]; } }); });
	tScen.nodes.forEach((n) => { const b = tBase.nodes.filter((x) => x.id === n.id)[0]; ['elev', 'demand', 'head'].forEach((f) => { if (!same(n[f], b[f])) { (truth['n:' + n.id] = truth['n:' + n.id] || {})[f] = n[f]; } }); });
	console.log('       the exports differ in: ' + JSON.stringify(truth));
	ok('the overrides are exactly the differences between the exports', JSON.stringify(ov) === JSON.stringify(truth), JSON.stringify(ov));
	ok('the diameter override is P-1 = 10', ov['l:P-1'] && ov['l:P-1'].diameter === 10);
	ok('the demand override is J-1 = 1250', ov['n:J-1'] && ov['n:J-1'].demand === 1250);
	ok('no override is dropped silently: no "category" or "alternative" note remains for Demand',
		!r.notes.some((n) => n.code === 'wtg-scenario-category'), JSON.stringify(r.notes.filter((n) => n.code === 'wtg-scenario-category')));

	// Base with the overrides laid on, against the scenario export.
	const lay = JSON.parse(JSON.stringify(base));
	Object.keys(ov).forEach((key) => {
		const e = (key[0] === 'l' ? lay.links : lay.nodes).filter((x) => x.id === key.slice(2))[0];
		Object.keys(ov[key]).forEach((p) => { e[p] = ov[key][p]; });
	});
	const d1 = diffNetworks(lay, tScen);
	ok('TGH-1: Base with its overrides matches the TGH-1 export', d1.length === 0, d1.join('; '));
	console.log('       ' + compared + ' values compared');
	db.close();
	console.log(fails ? '\n' + fails + ' FAILED' : '\nAll passed.');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
