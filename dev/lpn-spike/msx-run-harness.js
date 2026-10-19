// EPANET-MSX, PHASE 2: THE ATTACHED .msx RUNS (ROADMAP Task 717). Run with:
//
//   node dev/lpn-spike/msx-run-harness.js
//
// Two anchors, neither of them this page agreeing with itself.
//
// 1. CROSS-CHECK AGAINST EPANET'S OWN QUALITY ENGINE. Net1 with one bulk species decaying at
//    first order (Kb 0.5/day) through EPANET-MSX, against the same network run as EPANET's own
//    single-chemical analysis with Global Bulk -0.5 and no wall reaction. Two engines, two
//    transport codes, one decay: they must agree at every node at every reporting hour.
//
// 2. EPA'S OWN PUBLISHED EXAMPLE. The arsenite oxidation / arsenate adsorption network of the
//    EPANET-MSX User's Manual (EPA/600/R-07/088, section 3), its `.inp`, `.msx` and the `.rpt`
//    EPANET-MSX 1.1 printed for it (fixtures/msx-example/, from OpenWaterAnalytics'
//    epanet-example-networks, msx-examples/As5Adsorb). Every value in that report -- nodes C and D,
//    link 5, four species, 25 reporting times -- is compared inside the report's own two-decimal
//    precision.
//
// Everything is read through the page's own readers (nodeQualityValue, linkQualityValue,
// qualityLabel, qualityUnitText) after applySolveResult, so the map, the Tables pane and the Graph
// pane, which all read those, are what is being tested.
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-epanet.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, importInp: importInpFromFile, attachMsx: attachMsx,\n" +
	"\t\tassembleModel: assembleModel, applySolveResult: applySolveResult, qualitySetting: qualitySetting,\n" +
	"\t\tnodeQualityValue: nodeQualityValue, linkQualityValue: linkQualityValue,\n" +
	"\t\tqualityLabel: qualityLabel, qualityUnitText: qualityUnitText, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
function head(t) { console.log('\n' + t); }
function bytesOf(text) {
	const b = new TextEncoder().encode(text);
	return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
function setSpecies(name) { L.getSettings().quality.species = name; }

const FIX = path.join(ROOT, 'dev', 'lpn-spike', 'fixtures', 'msx-example');

(async function () {
	L.buildLayers();
	L.seedDefaultInputs();

	// =========================================================================================
	head('1. Net1, one chlorine species through EPANET-MSX, against EPANET\'s own chemical run');
	// =========================================================================================
	setUnitSet('us');
	L.importInp({ name: 'Net1.inp', _text: fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net1.inp'), 'utf8') });
	const doc = L.getDoc(), settings = L.getSettings();
	ok('Net1 imported', doc.nodes.length === 11 && doc.links.length === 13, doc.nodes.length + ' nodes');
	settings.engine = 'epanet';
	// Bulk decay only, and EPANET's parcel-merging tolerance tightened (its 0.01 default smears the
	// profile by up to 0.9%, reaction-anchor-harness.js), so the comparison is of the two engines'
	// arithmetic and not of EPANET's merging.
	settings.reactions = Object.assign(settings.reactions || {}, { globalBulk: -0.5, globalWall: 0 });
	settings.qualityOptions = Object.assign(settings.qualityOptions || {}, { tolerance: '0.0001' });
	const chem = await EngCalcs.lpnEpanetRun(L.assembleModel(), {});
	ok('the EPANET chemical run finished', chem.ok && chem.frames.length === 25, chem.frames.length + ' frames');

	const ONE = '[TITLE]\nChlorine, first-order bulk decay\n\n[OPTIONS]\nAREA_UNITS FT2\nRATE_UNITS DAY\nSOLVER RK5\n' +
		'TIMESTEP 300\nRTOL 0.0001\nATOL 0.00001\n\n[SPECIES]\nBULK CL2 MG\n\n[COEFFICIENTS]\nCONSTANT Kb 0.5\n\n' +
		'[PIPES]\nRATE CL2 -Kb*CL2\n\n[TANKS]\nRATE CL2 -Kb*CL2\n\n[QUALITY]\n' +
		// EPANET starts the water standing in a pipe from its end nodes' initial quality;
		// EPANET-MSX starts it at GLOBAL unless a LINK line says otherwise. Without GLOBAL 0.5 every
		// pipe started empty and the two runs differed by 0.49 mg/L in the first hour.
		'GLOBAL CL2 0.5\nNODE 9 CL2 1.0\nNODE 2 CL2 1.0\n';
	L.attachMsx(bytesOf(ONE), 'cl2.msx');
	ok('attaching the file chose the Multi-species analysis', L.qualitySetting().mode === 'msx', L.qualitySetting().mode);
	ok('...and the project holds the user\'s characters exactly', doc.msx && doc.msx.text === ONE);
	const model = L.assembleModel();
	ok('the model hands the engine the file\'s own text', model.msx && model.msx.text === ONE);
	ok('...and the .inp the engine reads states no EPANET quality analysis',
		!/^\s*Quality\s+(?!NONE|Timestep)/im.test(EngCalcs.lpnToInp(model, { eps: true }).inp));
	const msx = await EngCalcs.lpnEpanetRun(model, {});
	ok('the EPANET-MSX run finished', msx.ok && msx.frames.length === 25, (msx.frames.length) + ' frames' + (msx.ok ? '' : ' ' + JSON.stringify(msx.issues || msx.error || msx.message)));
	ok('...and names its one species as the file does', msx.msxSpecies && msx.msxSpecies.length === 1 &&
		msx.msxSpecies[0].id === 'CL2' && msx.msxSpecies[0].unitText === 'MG/L',
		JSON.stringify(msx.msxSpecies));
	ok('the run never rewrote the file', doc.msx.text === ONE);

	// Read the chemical run through the page as a chemical, then the MSX run as MSX.
	const chemAt = [], msxAt = [];
	settings.quality = { mode: 'chemical', chemical: 'Chlorine mg/L', traceNode: '' };
	chem.frames.forEach(function (f) {
		L.applySolveResult(EngCalcs.lpnTimeFrameResult(chem, f.t));
		const row = {};
		doc.nodes.forEach(function (n) { row[n.id] = L.nodeQualityValue(n); });
		chemAt.push(row);
	});
	settings.quality = { mode: 'msx', traceNode: '' };
	msx.frames.forEach(function (f) {
		L.applySolveResult(EngCalcs.lpnTimeFrameResult(msx, f.t));
		const row = {};
		doc.nodes.forEach(function (n) { row[n.id] = L.nodeQualityValue(n); });
		msxAt.push(row);
	});
	ok('the page heads the column with the species ID, in the file\'s declared unit',
		L.qualityLabel() === 'CL2' && L.qualityUnitText() === 'MG/L', L.qualityLabel() + ' ' + L.qualityUnitText());
	let n = 0, worst = 0, worstAt = '', moved = 0;
	for (let i = 0; i < chemAt.length; i++) {
		Object.keys(chemAt[i]).forEach(function (id) {
			const a = chemAt[i][id], b = msxAt[i][id];
			if (typeof a !== 'number' || typeof b !== 'number') { worst = Infinity; worstAt = id + ' missing'; return; }
			n++;
			if (Math.abs(b - (i ? msxAt[i - 1][id] : b)) > 1e-3) { moved++; }
			if (Math.abs(a - b) > worst) { worst = Math.abs(a - b); worstAt = 'node ' + id + ' at ' + chem.frames[i].t / 3600 + ' h'; }
		});
	}
	ok('every node at every reporting hour compared', n === 11 * 25, n + ' comparisons');
	ok('...and the concentrations really move, so agreement is not two runs of constants', moved > 50, moved + ' changes');
	// TOLERANCE: 0.01 mg/L. The two engines transport by different codes (EPANET's Lagrangian
	// parcels, EPANET-MSX's own segment scheme and RK5 integrator) and EPANET reports to two
	// decimals; 0.01 mg/L is one unit in that last printed place.
	ok('EPANET-MSX matches EPANET\'s single-chemical result within 0.01 mg/L everywhere',
		worst <= 0.01, 'worst ' + worst.toFixed(5) + ' mg/L at ' + worstAt);

	// =========================================================================================
	head('2. EPA\'s published EPANET-MSX example: arsenic oxidation and adsorption');
	// =========================================================================================
	setUnitSet('si');
	L.importInp({ name: 'example.inp', _text: fs.readFileSync(path.join(FIX, 'example.inp'), 'utf8') });
	const doc2 = L.getDoc(), s2 = L.getSettings();
	s2.engine = 'epanet';
	const MSXTEXT = fs.readFileSync(path.join(FIX, 'example.msx'), 'utf8');
	L.attachMsx(bytesOf(MSXTEXT), 'example.msx');
	ok('the example imported and its .msx attached', doc2.nodes.length === 5 && doc2.msx && doc2.msx.text === MSXTEXT);
	const ex = await EngCalcs.lpnEpanetRun(L.assembleModel(), {});
	ok('the run finished with 25 reporting times', ex.ok && ex.frames.length === 25, ex.frames.length + ' frames');
	ok('...and five species in the file\'s order', (ex.msxSpecies || []).map(function (s) { return s.id; }).join(',') === 'AS3,AS5,AStot,AS5s,NH2CL');

	// Parse EPANET-MSX 1.1's printed tables: "<<< Node C >>>" / "<<< Link 5 >>>", a heading row of
	// species, a units row, then "h:mm v v v".
	const rpt = fs.readFileSync(path.join(FIX, 'example.rpt'), 'utf8').split(/\r?\n/);
	const tables = [];
	for (let i = 0; i < rpt.length; i++) {
		const m = /<<<\s+(Node|Link)\s+(\S+)\s+>>>/.exec(rpt[i]);
		if (!m) { continue; }
		const species = rpt[i + 2].trim().split(/\s+/).slice(1), units = rpt[i + 3].trim().split(/\s+/).slice(1);
		const rows = [];
		for (let j = i + 5; j < rpt.length && /^\s*\d+:\d\d\s/.test(rpt[j]); j++) {
			const w = rpt[j].trim().split(/\s+/), hm = w[0].split(':');
			rows.push({ t: Number(hm[0]) * 3600 + Number(hm[1]) * 60, v: w.slice(1).map(Number) });
		}
		tables.push({ kind: m[1], id: m[2], species: species, units: units, rows: rows });
	}
	ok('the published report has three tables (nodes C and D, link 5)', tables.length === 3, tables.map(function (t) { return t.kind + ' ' + t.id; }).join(', '));
	let cmp = 0, worst2 = 0, where2 = '', unitsOk = true;
	tables.forEach(function (tb) {
		const el = tb.kind === 'Node' ? L.nodeById(tb.id) : L.linkById(tb.id);
		tb.species.forEach(function (sp, k) {
			setSpecies(sp);
			tb.rows.forEach(function (r) {
				L.applySolveResult(EngCalcs.lpnTimeFrameResult(ex, r.t));
				if (L.qualityUnitText() !== tb.units[k]) { unitsOk = false; where2 = sp + ' unit ' + L.qualityUnitText() + ' vs ' + tb.units[k]; }
				const mine = tb.kind === 'Node' ? L.nodeQualityValue(el) : L.linkQualityValue(el);
				if (typeof mine !== 'number') { worst2 = Infinity; where2 = tb.id + ' ' + sp + ' missing'; return; }
				cmp++;
				const d = Math.abs(mine - r.v[k]);
				if (d > worst2) { worst2 = d; where2 = tb.kind + ' ' + tb.id + ' ' + sp + ' at ' + r.t / 3600 + ' h: ' + mine.toFixed(4) + ' vs ' + r.v[k]; }
			});
		});
	});
	ok('every printed value compared (2 nodes x 3 species + 1 link x 4 species, 25 times)', cmp === (3 + 3 + 4) * 25, cmp + ' comparisons');
	ok('...each headed in the unit EPANET-MSX printed (UG/L, MG/L, UG/M2)', unitsOk, where2);
	// TOLERANCE: the report prints two decimals, so it says nothing finer than +-0.005. 0.006
	// allows for a value that sits on a rounding edge.
	ok('the page reproduces EPA\'s published EPANET-MSX report inside its printed precision',
		worst2 <= 0.006, 'worst ' + worst2.toFixed(4) + (where2 ? ' (' + where2 + ')' : ''));
	setSpecies('AS5s');
	L.applySolveResult(EngCalcs.lpnTimeFrameResult(ex, 24 * 3600));
	ok('a wall species has no value at a node, rather than a zero', L.nodeQualityValue(L.nodeById('C')) === undefined);
	ok('...and has one on the pipe wall', L.linkQualityValue(L.linkById('5')) > 40, String(L.linkQualityValue(L.linkById('5'))));

	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
