// THE WaterGEMS PUMP-AND-VALVE, CONTINUOUS-PATTERN AND SCENARIO SAMPLE, js/lpn-wtg.js -- ROADMAP Task 749. Run with:
//
//   node dev/lpn-spike/wtg-tgh-harness.js
//
// WTG-tgh-1.wtg.sqlite (kept outside the repository, see WTG_TGH_DIR below) is a model Tom saved in WaterGEMS as an ordinary user:
// a reservoir, two tanks, three pumps (one a variable speed pump battery) and one valve of each type (PRV, PSV, PBV, FCV, TCV,
// GPV), each pump or valve a NODE with three or four pipes, a continuous demand pattern, and a child scenario TGH-1 that changes
// pipe diameters, junction elevations and demands, both tanks, the pump definitions and the GPV curve. The two `.inp` files
// beside it are WaterGEMS's own exports of each scenario. The reader's Base is compared with the Base export element by
// element, and Base with TGH-1's alternatives and overrides laid on (as a stored tree resolves them) is compared with the
// TGH-1 export. A pump or valve's two junctions are named and placed as the export names and places them (46-A, 46-B for
// PMP-1, both at the pump's position), so the comparison renames nothing and compares positions too. Tolerance: 1e-6 relative
// on numbers (the reader writes seven significant digits where WaterGEMS's export writes fifteen).
// Record: dev/sqlite-reader.md, "Pumps and valves as nodes, a continuous pattern, and the alternatives themselves".
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
// The fixtures are large and not in the repository: WTG_TGH_DIR names the folder holding them.
const FX = process.env.WTG_TGH_DIR || '/home/haws/tom-files/2026-10-19';
if (!fs.existsSync(path.join(FX, 'WTG-tgh-1.wtg.sqlite'))) {
	console.log('NOT RUN (fixture not present: ' + path.join(FX, 'WTG-tgh-1.wtg.sqlite') + ')');
	process.exit(0);
}
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
function pointsSame(a, b) {
	return !!a && !!b && a.length === b.length && a.every((p, i) => same(p[0], b[i][0]) && same(p[1], b[i][1]));
}
const curveOf = (parsed, id) => (parsed.curves.filter((c) => c.id === id)[0] || {}).points || null;

const FIELDS = ['type', 'elev', 'demand', 'head', 'x', 'y', 'level', 'minLevel', 'maxLevel', 'length', 'diameter', 'roughness', 'k', 'status', 'from', 'to',
	'valveType', 'setting', 'speed'];
// Every element of `ours` against `theirs`: same IDs, same kinds, same values in FIELDS, positions included; a pump's diameter, a valve's length and
// roughness, and the diameter of a tank with a volume curve are not used by EPANET.
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
				if (t[id].type === 'pump' && f === 'diameter') { return; }
				// A pump with no SPEED keyword runs at relative speed 1, which WaterGEMS writes out once it has a curve.
				if (f === 'speed' && t[id].type === 'pump') { compared++; if (!same(o[id].speed === undefined ? 1 : o[id].speed, t[id].speed === undefined ? 1 : t[id].speed)) { out.push(kind + ' ' + id + ' speed'); } return; }
				if (t[id].type === 'valve' && (f === 'length' || f === 'roughness')) { return; }
				if (t[id].type === 'tank' && f === 'diameter' && t[id].volCurve) { return; }
				compared++;
				if (!same(o[id][f], t[id][f])) { out.push(kind + ' ' + id + ' ' + f + ': ours ' + o[id][f] + ', theirs ' + t[id][f]); }
			});
			if (t[id].type === 'pump') {
				['curveId', 'efficCurveId'].forEach((f) => {
					const a = o[id][f] ? curveOf(ours, o[id][f]) : null, b = t[id][f] ? curveOf(theirs, t[id][f]) : null;
					compared++;
					if (!(a === null && b === null) && !pointsSame(a, b)) { out.push(kind + ' ' + id + ' ' + f + ': ours ' + JSON.stringify(a) + ', theirs ' + JSON.stringify(b)); }
				});
			}
			if (t[id].type === 'valve' && t[id].valveType === 'GPV') {
				compared++;
				const a = o[id].curveId ? curveOf(ours, o[id].curveId) : null, b = t[id].curveId ? curveOf(theirs, t[id].curveId) : null;
				if (!(a === null && b === null) && !pointsSame(a, b)) { out.push(kind + ' ' + id + ' GPV curve: ours ' + JSON.stringify(a) + ', theirs ' + JSON.stringify(b)); }
			}
			if (t[id].type === 'tank') {
				compared++;
				const a = o[id].volCurve ? curveOf(ours, o[id].volCurve) : null, b = t[id].volCurve ? curveOf(theirs, t[id].volCurve) : null;
				if (!(a === null && b === null) && !pointsSame(a, b)) { out.push(kind + ' ' + id + ' volume curve: ours ' + JSON.stringify(a) + ', theirs ' + JSON.stringify(b)); }
			}
		});
	});
	return out;
}
// A stored scenario, resolved the way the page resolves it: its alternatives' chains laid onto Base, then its own overrides.
function resolve(r, scn) {
	const byId = Object.fromEntries(r.alternatives.map((a) => [a.fileId, a]));
	const out = {};
	function lay(values) { Object.keys(values).forEach((k) => { out[k] = Object.assign(out[k] || {}, values[k]); }); }
	Object.keys(scn.alternatives || {}).forEach((cat) => {
		const pick = scn.alternatives[cat];
		if (pick === 'base') { return; }
		const chain = [];
		for (let a = byId[pick]; a; a = byId[a.parentFileId]) { chain.unshift(a); }
		chain.forEach((a) => lay(a.values));
	});
	lay(scn.overrides || {});
	return out;
}
const PROP = { tankDiameter: 'diameter', bottomElev: null, active: null };
function laid(base, flat) {
	const lay = JSON.parse(JSON.stringify(base));
	Object.keys(flat).forEach((key) => {
		const e = (key[0] === 'l' ? lay.links : lay.nodes).filter((x) => x.id === key.slice(2))[0];
		if (!e) { throw new Error('no element ' + key); }
		Object.keys(flat[key]).forEach((p) => {
			const to = p in PROP ? PROP[p] : p;
			if (to) { e[to] = flat[key][p]; }
		});
	});
	return lay;
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
	const tBase = (EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-Base.inp'), 'utf8')));
	const tScen = (EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-TGH-1.inp'), 'utf8')));
	ok('all three parse', base.ok && tBase.ok && tScen.ok);
	ok('every node and link of the export is read (' + tBase.nodes.length + ' nodes, ' + tBase.links.length + ' links)',
		base.nodes.length === tBase.nodes.length && base.links.length === tBase.links.length, base.nodes.length + ' ' + base.links.length);
	ok('the nine pump and valve nodes are links: 3 pumps, 6 valves', base.links.filter((l) => l.type === 'pump').length === 3 && base.links.filter((l) => l.type === 'valve').length === 6);
	ok('no pump, valve or pipe is left out (no "unlinked" or "unjoined" note)', !r.notes.some((n) => n.code === 'wtg-directed-unlinked' || n.code === 'wtg-link-unjoined'),
		JSON.stringify(r.notes.filter((n) => n.code === 'wtg-directed-unlinked' || n.code === 'wtg-link-unjoined')));

	ok('a GPV with no curve is not reported by the reader as well as by the .inp parser (one claim, not two)', !r.notes.some((n) => n.code === 'wtg-gpv-nocurve'));
	ok('the .inp parser reports it once, for GPV-1', (base.dropped || []).filter((d) => d.code === 'gpv-curve-missing').length === 1);
	// A pump node with several pipes: the pipe the model calls downstream is on the outlet, every other on the inlet.
	const pmp1 = base.links.filter((l) => l.id === 'PMP-1')[0];
	const at = (id) => base.links.filter((l) => l.id === id)[0];
	ok('PMP-1: P-1 (downstream) leaves the outlet; P-2, P-3 and P-16 meet the inlet',
		pmp1 && at('P-1').from === pmp1.to && at('P-2').to === pmp1.from && at('P-3').from === pmp1.from && at('P-16').to === pmp1.from);

	// Tom, 2026-10-21: *"Please check against the Bentley inp export that has upstream and downstream nodes coincident with
	// pump/valve."* Every pump and valve: its two junctions are the export's, by name, at the node's own position.
	const tRaw = EC.lpnInpParse(fs.readFileSync(path.join(FX, 'WTG-export-tgh-1-Base.inp'), 'utf8'));
	const pv = base.links.filter((l) => l.type === 'pump' || l.type === 'valve');
	const nOf = (net, id) => net.nodes.filter((n) => n.id === id)[0] || {};
	const pvBad = pv.filter((l) => {
		const t = tRaw.links.filter((x) => x.id === l.id)[0];
		const a = nOf(base, l.from), b = nOf(base, l.to);
		return !t || t.from !== l.from || t.to !== l.to || a.x !== b.x || a.y !== b.y || !same(a.x, nOf(tRaw, t.from).x) || !same(a.y, nOf(tRaw, t.from).y);
	}).map((l) => l.id + ' ' + l.from + ' ' + l.to);
	ok('all nine pumps and valves join the export\'s own two junctions (46-A to 46-B ...), drawn on top of each other at the node',
		pv.length === 9 && pvBad.length === 0, pvBad.join('; '));
	const pipeBad = base.links.filter((l) => l.type === 'pipe').filter((l) => {
		const t = tRaw.links.filter((x) => x.id === l.id)[0];
		return !t || t.from !== l.from || t.to !== l.to;
	}).map((l) => l.id);
	ok('every pipe runs between the same two nodes as in the export', pipeBad.length === 0, pipeBad.join(' '));

	// Base against WaterGEMS's Base export.
	const d0 = diffNetworks(base, tBase);
	ok('Base: every element and value matches the Base export', d0.length === 0, d0.join('; '));

	// The continuous pattern: ten points over 24 hours, written at the one-hour step as WaterGEMS writes it (26 values).
	const pat = base.patterns[0], tpat = tBase.patterns[0];
	ok('the continuous pattern is written as WaterGEMS writes it: ' + (tpat ? tpat.multipliers.length : 0) + ' multipliers',
		pat && tpat && pat.multipliers.length === tpat.multipliers.length && pat.multipliers.every((m, i) => same(m, tpat.multipliers[i])),
		JSON.stringify(pat && pat.multipliers));
	ok('the report says the pattern was continuous', r.notes.some((n) => n.code === 'wtg-pattern-continuous'));
	ok('the pattern time step is one hour, as the export states', /Pattern Timestep\s+1:00/.test(r.inp));

	// The scenario and its alternatives.
	ok('one scenario beyond Base, named TGH-1', r.scenarios.length === 1 && r.scenarios[0].name === 'TGH-1');
	const scn = r.scenarios[0] || {};
	ok('it uses two alternatives, both named TGH-1: Physical and Demand', scn.alternatives && Object.keys(scn.alternatives).sort().join() === 'demand,physical' &&
		scn.alternatives.physical !== scn.alternatives.demand, JSON.stringify(scn.alternatives));
	const altOf = (cat) => r.alternatives.filter((a) => a.fileId === (scn.alternatives || {})[cat])[0] || {};
	ok('the Physical alternative is named TGH-1 and hangs from Base', altOf('physical').name === 'TGH-1' && altOf('physical').category === 'physical' && !altOf('physical').parentFileId && !altOf('physical').root);
	ok('the Demand alternative is named TGH-1 and holds the three changed demands', altOf('demand').name === 'TGH-1' &&
		JSON.stringify(altOf('demand').values) === JSON.stringify({ 'n:J-11': { demand: 200 }, 'n:J-12': { demand: 1000 }, 'n:J-13': { demand: 500 } }), JSON.stringify(altOf('demand').values));
	// The model of 2026-10-21: PMP-3 has its curve in Base too, and the GPV node is at elevation 0 in TGH-1.
	ok('the Physical alternative holds the 33 pipe diameters, the tanks, the pump and GPV curves and the GPV node elevation',
		Object.keys(altOf('physical').values || {}).length === 40 && altOf('physical').values['l:P-1'].diameter === 10 && altOf('physical').values['n:T-1'].tankDiameter === 50 &&
		altOf('physical').values['l:GPV-1'].curveId && altOf('physical').values['l:PMP-1'].curveId &&
		altOf('physical').values['n:62-A'].elev === 0 && altOf('physical').values['n:62-B'].elev === 0);
	ok('what an alternative cannot say stays the scenario\'s own: the tank depths (they follow the base elevation)',
		JSON.stringify(scn.overrides) === JSON.stringify({ 'n:T-1': { level: 19 }, 'n:T-2': { level: 19 } }), JSON.stringify(scn.overrides));

	// The differences between the two exports, as the ground truth for what the scenario changes.
	console.log('       the exports differ in ' + diffNetworks(tScen, tBase).length + ' values');
	const lay0 = laid(base, resolve(r, scn));
	const d1 = diffNetworks(lay0, tScen);
	ok('TGH-1: Base with its alternatives and overrides matches the TGH-1 export', d1.length === 0, d1.join('; '));
	ok('the alternatives and the overrides together are exactly the scenario\'s differences from Base', (function () {
		const a = resolve(r, scn), b = scn.differences;
		return Object.keys(b).every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k])) && Object.keys(a).every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k]));
	}()));
	console.log('       ' + compared + ' values compared');
	db.close();
	console.log(fails ? '\n' + fails + ' FAILED' : '\nAll passed.');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
