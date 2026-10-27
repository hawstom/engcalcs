// A TANK HAS TWO ELEVATIONS (Tom, 2026-10-11: *"Pressure is above ground. No special meaning at
// tanks. ... Build Elevation (ground and pressure datum) and Elevation (depth and volume tank
// base)."*). Run with:
//   node dev/lpn-spike/tank-ground-harness.js
//
// `elev` is the GROUND, the pressure datum as at a junction. `bottomElev` is the BASE, EPANET's
// [TANKS] Elevation, on which the hydraulics stand and from which depth and volume are measured.
// What this holds:
//   1. A raised tank (Net1's tank 2, ground 20 m below its base) solves to the SAME heads and
//      flows in both engines, bit for bit in the native one, and its pressure is head minus ground
//      -- in the engines' own results and in what the page shows.
//   2. Net1 and Net3 import with base = ground = the file's elevation, and export character for
//      character; moving the ground changes not one byte of the .inp.
//   3. An old project migrates to v12 with base = ground = its old elevation, and every number on
//      screen (head, pressure, depth) is what it was.
//   4. A blank base follows the ground, and is written back as the ground's own characters.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tserializeProject: serializeProject, assembleModel: assembleModel, colorNodeValue: colorNodeValue,\n" +
	"\t\tnodeFixedHead: nodeFixedHead, toSI: toSI, toDisplay: toDisplay, resultUnit: resultUnit,\n" +
	"\t\tstorageVersion: LPN_STORAGE_VERSION, setTankBottom: setTankBottom, openPane: openPane,\n" +
	"\t\theadings: function (id) { return paneCols(paneTableById(id)).map(function (c) { return { key: c.key, h: paneHeadingText(c) }; }); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = paneTableAllElements(s).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tpasteAppend: function (id, text) { var s = paneTableById(id); renderPaneTable(s);\n" +
	"\t\t\treturn panePasteAt(s, libPasteCells(text), { append: true }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined || cond ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const refPath = (f) => path.join(ROOT, 'dev', 'lpn-spike', 'reference', f);
const tankOf = (id) => L.getDoc().nodes.find((n) => n.id === id);

function openInp(file) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(refPath(file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ': ' + parsed.error); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const saved = L.docFromInp(parsed, file);
	L.applySaved(L.migrateSaved(saved));
	return parsed;
}
function exportText() {
	const out = EngCalcs.lpnExportInp(L.serializeProject());
	if (!out.ok) { throw new Error('export: ' + JSON.stringify(out.error)); }
	return out.inp;
}
function tokens(text, section) {
	let cur = null;
	const rows = [];
	text.split(/\r?\n/).forEach((raw) => {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { return; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { cur = m[1].toUpperCase(); return; }
		if (cur === section) { rows.push(line.split(/\s+/).join(' ')); }
	});
	return rows;
}

(async function main() {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	// =============================================================================================
	console.log('\n1. A RAISED TANK: same hydraulics, pressure above the ground');
	// =============================================================================================
	openInp('Net1.inp');
	const t2 = tankOf('2');
	ok('Net1 tank 2 imports with base = ground = the file\'s 850', t2.bottomElev === 850 && t2.elev === 850,
		JSON.stringify({ base: t2.bottomElev, ground: t2.elev }));
	const before = L.assembleModel();
	const nat0 = EngCalcs.lpnSolve(before), epa0 = await EngCalcs.lpnSolveEpanet(before);
	ok('both engines solve Net1 as imported', nat0.converged !== false && epa0.ok !== false, JSON.stringify(epa0.error || ''));
	ok('as imported, the tank\'s pressure is its depth (120 ft)',
		near(nat0.pressures['2'], 120 * 0.3048, 1e-9) && near(epa0.pressures['2'], 120 * 0.3048, 1e-4),
		nat0.pressures['2'] + ' / ' + epa0.pressures['2']);

	// Ground 20 m below the base, in this project's feet.
	const DROP_FT = 20 / 0.3048;
	t2.elev = 850 - DROP_FT;
	const after = L.assembleModel();
	const mt = after.nodes.find((n) => n.id === '2');
	ok('the model stands the tank on its BASE and carries the ground beside it',
		near(mt.elev, 850 * 0.3048, 1e-12) && near(mt.ground, 850 * 0.3048 - 20, 1e-9), JSON.stringify(mt));
	const nat1 = EngCalcs.lpnSolve(after), epa1 = await EngCalcs.lpnSolveEpanet(after);
	let natSame = true, epaSame = true, worst = 0;
	Object.keys(nat0.heads).forEach((id) => { if (nat0.heads[id] !== nat1.heads[id]) { natSame = false; } });
	Object.keys(nat0.flows).forEach((id) => { if (nat0.flows[id] !== nat1.flows[id]) { natSame = false; } });
	Object.keys(epa0.heads).forEach((id) => {
		const d = Math.abs(epa0.heads[id] - epa1.heads[id]); worst = Math.max(worst, d);
		if (d > 1e-9) { epaSame = false; }
	});
	Object.keys(epa0.flows).forEach((id) => { if (Math.abs(epa0.flows[id] - epa1.flows[id]) > 1e-12) { epaSame = false; } });
	ok('native engine: every head and flow is bit-identical with the ground moved', natSame);
	ok('EPANET: every head and flow is identical with the ground moved', epaSame, 'worst head diff ' + worst);
	let junctionsSame = true;
	after.nodes.filter((n) => n.type === 'junction').forEach((n) => {
		if (nat0.pressures[n.id] !== nat1.pressures[n.id]) { junctionsSame = false; }
	});
	ok('every junction\'s pressure is untouched', junctionsSame);
	const headSI = nat1.heads['2'], wantSI = headSI - mt.ground;
	ok('native: tank pressure = head minus ground (depth + 20 m)',
		near(nat1.pressures['2'], wantSI, 1e-9) && near(wantSI, 120 * 0.3048 + 20, 1e-9),
		nat1.pressures['2'] + ' vs ' + wantSI);
	ok('EPANET: tank pressure = head minus ground, the same number',
		near(epa1.pressures['2'], wantSI, 1e-4), epa1.pressures['2'] + ' vs ' + wantSI);
	const shown = L.colorNodeValue(t2, 'pressure'),
		wantShown = L.toDisplay(wantSI, L.resultUnit('pressure'));
	ok('the page shows that pressure (labels, Tables, colouring, Find read colorNodeValue)',
		near(shown, wantShown, 1e-9), shown + ' vs ' + wantShown);
	ok('depth is still measured from the base (120 ft)',
		near(L.colorNodeValue(t2, 'depth'), L.toDisplay(120 * 0.3048, L.resultUnit('elevhead')), 1e-9),
		String(L.colorNodeValue(t2, 'depth')));
	ok('head is still base + level (970 ft)', L.nodeFixedHead(t2) === 970, String(L.nodeFixedHead(t2)));
	// The two drawing exports say the same thing: plain elevation is the ground, the base is named.
	// (GeoJSON needs a located project, so this uses the shipped Net3 on the world, tank 1.)
	const world = L.migrateSaved(JSON.parse(fs.readFileSync(path.join(ROOT, 'dev', 'water-network-examples', 'latlon-originals', 'Net3-Novato-CA-World.lwn'), 'utf8')));
	const wt = world.nodes.find((n) => n.id === '1');
	wt.elev = wt.bottomElev - 20;
	const gj = JSON.parse(EngCalcs.lpnExportGeoJson(world, {}).text);
	const gt = gj.features.find((f) => f.properties.node_type && f.properties.name === '1').properties;
	ok('GeoJSON: elevation is the ground, base_elevation the base',
		gt.elevation === wt.elev && gt.base_elevation === wt.bottomElev, JSON.stringify(gt));

	// Specific gravity reaches a tank's pressure exactly as it reaches a junction's, in each engine.
	// Both engines multiply by SG at their one door (a pressure in m or ft is a column of water);
	// dev/lpn-spike/specific-gravity-harness.js holds that on Net1.
	const sgModel = L.assembleModel();
	sgModel.hydraulics = Object.assign({}, sgModel.hydraulics, { specificGravity: 1.1 });
	const nat2 = EngCalcs.lpnSolve(sgModel), epa2 = await EngCalcs.lpnSolveEpanet(sgModel);
	const ratio = (a, b, id) => a.pressures[id] / b.pressures[id];
	ok('with SG 1.1 the native tank pressure scales as its junctions do',
		near(ratio(nat2, nat1, '2'), ratio(nat2, nat1, '10'), 1e-9) && near(nat2.pressures['2'], wantSI * 1.1, 1e-9),
		ratio(nat2, nat1, '2') + ' vs ' + ratio(nat2, nat1, '10'));
	ok('with SG 1.1 the EPANET tank pressure scales as its junctions do',
		near(ratio(epa2, epa1, '2'), ratio(epa2, epa1, '10'), 1e-6),
		ratio(epa2, epa1, '2') + ' vs ' + ratio(epa2, epa1, '10'));

	// =============================================================================================
	console.log('\n2. .inp IN AND OUT: the base is the file\'s, the ground is never written');
	// =============================================================================================
	for (const f of ['Net1.inp', 'Net3.inp']) {
		const src = fs.readFileSync(refPath(f), 'utf8');
		openInp(f);
		const tanks = L.getDoc().nodes.filter((n) => n.type === 'tank');
		ok(f + ': every tank imports with base = ground', tanks.length > 0 &&
			tanks.every((n) => n.bottomElev === n.elev), tanks.map((n) => n.id + ':' + n.bottomElev + '/' + n.elev).join(' '));
		const out0 = exportText();
		ok(f + ': [TANKS] exports token for token as the file states it',
			JSON.stringify(tokens(out0, 'TANKS')) === JSON.stringify(tokens(src, 'TANKS')),
			JSON.stringify(tokens(out0, 'TANKS')) + ' vs ' + JSON.stringify(tokens(src, 'TANKS')));
		tanks.forEach((n) => { n.elev = n.elev - 33; });
		ok(f + ': moving every tank\'s ground changes not one byte of the export', exportText() === out0);
		tanks.forEach((n) => { n.elev = n.elev + 33; });
	}

	// =============================================================================================
	console.log('\n3. AN OLD PROJECT: base = ground = its old elevation, every number as it was');
	// =============================================================================================
	for (const f of ['Net1.lwn', 'Net3-Novato-CA-World.lwn']) {
		const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', f), 'utf8'));
		const oldTanks = {};
		raw.nodes.filter((n) => n.type === 'tank').forEach((n) => { oldTanks[n.id] = JSON.parse(JSON.stringify(n)); });
		ok(f + ' is an old project (v' + raw.v + ') with tanks and no base field',
			raw.v < 12 && Object.keys(oldTanks).length > 0 && Object.values(oldTanks).every((n) => !('bottomElev' in n)));
		const migrated = L.migrateSaved(raw);
		ok(f + ' migrates to v' + L.storageVersion, migrated.v === L.storageVersion && L.storageVersion >= 12, String(migrated.v));
		L.applySaved(migrated);
		Object.keys(oldTanks).forEach((id) => {
			const o = oldTanks[id], n = tankOf(id), lvl = o._level || 0;
			ok(f + ' tank ' + id + ': base = ground = old elevation ' + o.elev,
				n.bottomElev === o.elev && n.elev === o.elev, n.bottomElev + ' / ' + n.elev);
			ok(f + ' tank ' + id + ': head = old elevation + level', L.nodeFixedHead(n) === o.elev + lvl);
			const pOld = L.toDisplay(L.toSI(lvl, 'lpn_u_elevhead'), L.resultUnit('pressure'));
			ok(f + ' tank ' + id + ': pressure reads the depth, as it always did',
				near(L.colorNodeValue(n, 'pressure'), pOld, 1e-9), L.colorNodeValue(n, 'pressure') + ' vs ' + pOld);
			if (o.tok && o.tok.elev) {
				ok(f + ' tank ' + id + ': the base keeps the old elevation\'s characters',
					n.tok && n.tok.bottomElev === o.tok.elev);
			}
		});
		const again = L.serializeProject();
		ok(f + ' saves back as the current version carrying the base', again.v === L.storageVersion &&
			again.nodes.filter((n) => n.type === 'tank').every((n) => typeof n.bottomElev === 'number'));
		// Typing the real ground under an old raised tank must not drag the tank down with it.
		const id0 = Object.keys(oldTanks)[0], n0 = tankOf(id0), h0 = L.nodeFixedHead(n0);
		n0.elev = n0.elev - 10;
		ok(f + ' tank ' + id0 + ': lowering the ground leaves the water surface where it was', L.nodeFixedHead(n0) === h0);
	}

	// =============================================================================================
	console.log('\n4. A BLANK BASE FOLLOWS THE GROUND');
	// =============================================================================================
	openInp('Net1.inp');
	const t = tankOf('2');
	L.setTankBottom(t, undefined);
	ok('a blank base is no key at all', !('bottomElev' in t));
	t.elev = 860;
	ok('the water surface stands on the ground then (860 + 120)', L.nodeFixedHead(t) === 980, String(L.nodeFixedHead(t)));
	ok('and the pressure is the depth', near(L.colorNodeValue(t, 'pressure'),
		L.toDisplay(L.toSI(120, 'lpn_u_elevhead'), L.resultUnit('pressure')), 1e-9));
	ok('the export writes the ground as the [TANKS] Elevation',
		tokens(exportText(), 'TANKS')[0].split(' ')[1] === '860', tokens(exportText(), 'TANKS')[0]);
	L.setTankBottom(t, 840);
	ok('a typed base stops following', t.bottomElev === 840 && L.nodeFixedHead(t) === 960);

	// =============================================================================================
	console.log('\n5. THE TANKS TABLE: Base elevation beside Elevation, Pressure among the results, paste');
	// =============================================================================================
	openInp('Net1.inp');
	L.openPane('tanks');
	const heads = L.headings('tanks'), keys = heads.map((h) => h.key);
	ok('Base elevation is the column right after Elevation', keys.indexOf('bottomElev') === keys.indexOf('elev') + 1, keys.join(','));
	const elevUnit = heads[keys.indexOf('elev')].h.replace(/^Elevation/, '');
	ok('its heading names it, in the unit the Elevation column is in',
		heads[keys.indexOf('bottomElev')].h === 'Base elevation' + elevUnit, heads[keys.indexOf('bottomElev')].h + ' / ' + elevUnit);
	ok('the tanks table shows Pressure', keys.indexOf('pressure') >= 0, keys.join(','));
	const src = heads.map((h) => L.cellText('tanks', '2', h.key));
	ok('tank 2 copies as base 850 beside ground 850', src[keys.indexOf('elev')] === '850' && src[keys.indexOf('bottomElev')] === '850',
		src.join(' | '));
	const row = src.slice();
	row[keys.indexOf('id')] = 'TX';
	row[keys.indexOf('elev')] = '800';
	row[keys.indexOf('bottomElev')] = '830';
	L.pasteAppend('tanks', row.join('\t'));
	const tx = tankOf('TX');
	ok('a pasted row lands its ground and its base in their own fields', !!tx && tx.elev === 800 && tx.bottomElev === 830,
		tx && JSON.stringify({ elev: tx.elev, base: tx.bottomElev }));
	ok('...and its pressure reads 30 ft more than its depth', !!tx && near(L.colorNodeValue(tx, 'pressure'),
		L.toDisplay(L.toSI(30 + 120, 'lpn_u_elevhead'), L.resultUnit('pressure')), 1e-9), tx && String(L.colorNodeValue(tx, 'pressure')));
	const blankRow = src.slice();
	blankRow[keys.indexOf('id')] = 'TY';
	blankRow[keys.indexOf('bottomElev')] = '';
	L.pasteAppend('tanks', blankRow.join('\t'));
	const ty = tankOf('TY');
	ok('a pasted blank base is a blank base, at the ground', !!ty && !('bottomElev' in ty) && L.nodeFixedHead(ty) === 970,
		ty && JSON.stringify(ty));

	console.log('\n' + (fails ? fails + ' FAILED of ' + checks : 'all ' + checks + ' tank-ground checks passed'));
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
