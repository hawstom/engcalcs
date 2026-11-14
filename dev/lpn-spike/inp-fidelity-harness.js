// THE .inp READER AND WRITER KEEP WHAT THE FILE SAYS. Run with:
//   node dev/lpn-spike/inp-fidelity-harness.js
//
// Three breaches of "Import reports every difference, never drops silently; import then export is
// byte-identical for unedited values", found by the 2026-11 code audit (F1, F2, F4):
//
//   1. HEAD LOSS FORMULA. docFromInp() copied the OPEN project's friction method and never read the
//      file's [OPTIONS] Headloss. A D-W file imported as H-W, and an H-W file opened beside a D-W
//      project read C = 100 as a D-W roughness. Held here against the vendored EPANET engine run on
//      the file itself: the imported project solves to EPANET's heads.
//   2. TANK MinVol AND Overflow ([TANKS] columns 7 and 9) were read past in silence, and a tank
//      row came back out as `... 0`.
//   3. A `;` in a label, and [TITLE] lines 2 and 3. EPANET's own reader (the engine, input2.c, and
//      the Delphi GUI's Uimport.pas StripComment) cuts a LABEL at its first `;` even inside quotes;
//      a TITLE line is taken whole, `;` included, and a title is as many lines as the file has.
//
// The expectation is the file: each comparison reads the exported text through a deliberately dumber
// second reader, never through the parser under test.

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tserializeProject: serializeProject, assembleModel: assembleModel,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
L.buildLayers();
setUnitSet('us');
L.seedDefaultInputs();
const EC = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// ---- the dumber reader: section -> rows of tokens, comments cut at the first `;` ---------------
function tokensBySection(text) {
	const out = {};
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { continue; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		out[section].push(line.split(/\s+/));
	}
	return out;
}
const rowsOf = (text, sec) => (tokensBySection(text)[sec] || []).map((r) => r.join(' '));

// ---- the files -----------------------------------------------------------------------------
const COORDS = `[COORDINATES]
 J1 0 0
 J2 100 0
 J3 100 100
 R1 -100 0

`;
const NET = (units, headloss, pipes, junctions, reservoir) => `[TITLE]
fidelity probe

[JUNCTIONS]
${junctions}

[RESERVOIRS]
${reservoir}

[PIPES]
${pipes}

${COORDS}[OPTIONS]
 Units              	${units}
 Headloss           	${headloss}

[END]
`;
const SI_DW = NET('LPS', 'D-W',
	' P1 R1 J1 1000 300 0.25 0 Open\n P2 J1 J2 800 200 0.30 0 Open\n P3 J2 J3 600 200 0.15 0 Open\n P4 J1 J3 900 150 0.20 0 Open',
	' J1 20 5\n J2 18 8\n J3 15 6', ' R1 100');
const US_DW = NET('GPM', 'D-W',
	' P1 R1 J1 3000 12 0.85 0 Open\n P2 J1 J2 2500 8 1.00 0 Open\n P3 J2 J3 2000 8 0.50 0 Open\n P4 J1 J3 3000 6 0.70 0 Open',
	' J1 50 100\n J2 45 120\n J3 40 90', ' R1 300');
const SI_CM = NET('LPS', 'C-M',
	' P1 R1 J1 1000 300 0.013 0 Open\n P2 J1 J2 800 200 0.0130 0 Open\n P3 J2 J3 600 200 0.012 0 Open\n P4 J1 J3 900 150 0.014 0 Open',
	' J1 20 5\n J2 18 8\n J3 15 6', ' R1 100');
const SI_HW = NET('LPS', 'H-W',
	' P1 R1 J1 1000 300 100 0 Open\n P2 J1 J2 800 200 120 0 Open\n P3 J2 J3 600 200 130 0 Open\n P4 J1 J3 900 150 110 0 Open',
	' J1 20 5\n J2 18 8\n J3 15 6', ' R1 100');

// ---- the page's path: units strip first, then the document ----------------------------------
function importDoc(text, name) {
	const parsed = EC.lpnInpParse(text);
	if (!parsed.ok) { throw new Error('parse failed: ' + JSON.stringify(parsed)); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	return { parsed, doc: L.docFromInp(parsed, name || 'probe') };
}
function exportOf(doc) {
	const out = EC.lpnExportInp(doc);
	if (!out.ok) { throw new Error('export refused: ' + JSON.stringify(out)); }
	return out;
}
function open(doc) { L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(doc)))); }

let mod = null;
async function rawHeads(inpText) {
	const ws = new mod.Workspace();
	await ws.loadModule();
	ws.writeFile('r.inp', inpText);
	const p = new mod.Project(ws);
	p.open('r.inp', 'r.rpt', 'r.out');
	p.openH(); p.initH(0); p.runH();
	const h = {};
	for (let i = 1, n = p.getCount(0); i <= n; i++) { h[p.getNodeId(i)] = p.getNodeValue(i, 10); }	// EN_HEAD
	p.closeH(); p.close();
	return h;
}
async function rawSeries(inpText) {
	const ws = new mod.Workspace();
	await ws.loadModule();
	ws.writeFile('r.inp', inpText);
	const p = new mod.Project(ws);
	p.open('r.inp', 'r.rpt', 'r.out');
	p.openH(); p.initH(0);
	const out = {};
	for (;;) {
		const t = p.runH();
		const h = {};
		for (let i = 1, n = p.getCount(0); i <= n; i++) { h[p.getNodeId(i)] = p.getNodeValue(i, 10); }
		out[t] = h;
		if (p.nextH() <= 0) { break; }
	}
	p.closeH(); p.close();
	return out;
}
function worst(a, b, scale) {
	let w = 0;
	for (const id in b) { if (a[id] !== undefined) { w = Math.max(w, Math.abs(a[id] - b[id] * scale)); } }
	return w;
}

(async function () {
	await warmEpanet();
	mod = await EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js');
	const HEAD_TOL = 0.02;		// metres; EPANET is single precision and the two engines carry slightly different water viscosity

	// =============================================================================================
	console.log('1. THE HEAD LOSS FORMULA COMES FROM THE FILE');
	for (const [label, text, method, word] of [['D-W, SI', SI_DW, 'dw', 'D-W'], ['C-M, SI', SI_CM, 'manning', 'C-M'],
		['H-W, SI', SI_HW, 'hw', 'H-W']]) {
		// An open project of ANOTHER method: the old code cloned it.
		const other = importDoc(method === 'dw' ? SI_CM : SI_DW);
		open(other.doc);
		const { parsed, doc } = importDoc(text);
		ok(label + ': the imported project says ' + method, (doc.settings.method || 'hw') === method, String(doc.settings.method));
		const out = exportOf(doc);
		ok(label + ': re-export states Headloss ' + word, rowsOf(out.inp, 'OPTIONS').indexOf('Headloss ' + word) >= 0);
		ok(label + ': every pipe row comes back as the file wrote it',
			JSON.stringify(rowsOf(out.inp, 'PIPES')) === JSON.stringify(rowsOf(text, 'PIPES')),
			JSON.stringify(rowsOf(out.inp, 'PIPES')));
		ok(label + ': the report states no head loss difference', !(parsed.dropped || []).some((d) => d.code === 'headloss-formula'));
		ok(label + ': the export reports no roughness difference',
			!out.differences.some((d) => d.code === 'roughness-method' || d.code === 'unit-converted'), JSON.stringify(out.differences));
		// Solved by both engines against EPANET on the file itself.
		open(doc);
		const ref = await rawHeads(text), scale = parsed.scale.head;
		const model = L.assembleModel();
		ok(label + ': the model is solved by ' + method, model.method === method, model.method);
		const nat = EC.lpnSolve(model, { tol: 1e-9 });
		ok(label + ': built-in solver is within ' + HEAD_TOL + ' m of EPANET on the file', nat.ok && worst(nat.heads, ref, scale) < HEAD_TOL,
			nat.ok ? worst(nat.heads, ref, scale).toFixed(4) + ' m' : JSON.stringify(nat.issues));
		const ep = await EC.lpnSolveEpanet(L.assembleModel(), {});
		ok(label + ': EPANET through the page is within ' + HEAD_TOL + ' m of EPANET on the file', ep.ok && worst(ep.heads, ref, scale) < HEAD_TOL,
			ep.ok ? worst(ep.heads, ref, scale).toFixed(4) + ' m' : JSON.stringify(ep.issues));
	}
	{
		// US Darcy-Weisbach: EPANET's roughness is in millifeet, a unit this page's Roughness
		// selector does not offer. Carried as written, and the project refuses to solve.
		const { doc } = importDoc(US_DW);
		ok('D-W, US: the imported project says dw', doc.settings.method === 'dw');
		const out = exportOf(doc);
		ok('D-W, US: re-export states Headloss D-W', rowsOf(out.inp, 'OPTIONS').indexOf('Headloss D-W') >= 0);
		ok('D-W, US: every pipe row comes back as the file wrote it',
			JSON.stringify(rowsOf(out.inp, 'PIPES')) === JSON.stringify(rowsOf(US_DW, 'PIPES')), JSON.stringify(rowsOf(out.inp, 'PIPES')));
		open(doc);
		const issues = EC.lpnDiagnose(L.assembleModel());
		ok('D-W, US: the solve is refused by name (roughness in millifeet)', issues.some((d) => d.code === 'roughness-unit'), JSON.stringify(issues));
	}

	// =============================================================================================
	console.log('\n2. TANK MinVol AND Overflow');
	const TANKS = (rows) => `[TITLE]
tank probe

[JUNCTIONS]
 J1 20 2

[RESERVOIRS]
 R1 100

[TANKS]
${rows}

[PIPES]
 P1 R1 J1 1000 300 100 0 Open
 P2 J1 T1 500 200 100 0 Open

[COORDINATES]
 J1 0 0
 R1 -100 0
 T1 100 0
 T2 100 100

[OPTIONS]
 Units LPS
 Headloss H-W

[END]
`.replace('J1 T1 500 200 100 0 Open', 'J1 T1 500 200 100 0 Open');
	for (const [label, rows] of [
		['MinVol 500, Overflow YES', ' T1 20 10 2 20 30 500 * YES'],
		['MinVol with a curve and Overflow no', ' T1 20 10 2 20 30 500.0 VC1 no'],
		['MinVol 0 stated', ' T1 20 10 2 20 30 0']]) {
		const text = TANKS(rows) + '';
		const full = text.replace('[PIPES]', '[CURVES]\n VC1 2 400\n VC1 20 4000\n\n[PIPES]');
		const { parsed, doc } = importDoc(full);
		const out = exportOf(doc);
		ok(label + ': the tank row comes back as the file wrote it',
			JSON.stringify(rowsOf(out.inp, 'TANKS')) === JSON.stringify(rowsOf(full, 'TANKS')),
			JSON.stringify(rowsOf(out.inp, 'TANKS')) + ' vs ' + JSON.stringify(rowsOf(full, 'TANKS')));
	}
	{
		const full = TANKS(' T1 20 10 2 20 30 500 * YES');
		const { doc } = importDoc(full);
		open(doc);
		const t = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0];
		ok('the model hands both engines MinVol 500 m3 and Overflow', t && t.minVolume === 500 && t.overflow === true,
			t ? JSON.stringify([t.minVolume, t.overflow]) : 'no tank');
		const { doc: doc2 } = importDoc(TANKS(' T1 20 10 2 20 30'));
		open(doc2);
		const t2 = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0];
		ok('a tank that states neither leaves them off the model', t2 && !(t2.minVolume > 0) && !t2.overflow);
	}

	{
		// A tank that fills to its top over six hours. With Overflow YES the inflow link stays open
		// at the top; without it EPANET closes the link into a full tank, and the heads differ. The
		// file's value has to reach the engine for the page's run to match EPANET's on the file.
		const seen = {};
		for (const word of ['YES', 'NO']) {
			const eps = `[TITLE]
overflow ${word}

[JUNCTIONS]
 J1 20 1

[RESERVOIRS]
 R1 100

[TANKS]
 T1 90 5 0 8 5 100 * ${word}

[PIPES]
 P1 R1 J1 1000 300 100 0 Open
 P2 J1 T1 500 200 100 0 Open

[COORDINATES]
 J1 0 0
 R1 -100 0
 T1 100 0

[TIMES]
 Duration 6:00
 Hydraulic Timestep 1:00

[OPTIONS]
 Units LPS
 Headloss H-W

[END]
`;
			const { parsed, doc } = importDoc(eps);
			open(doc);
			const ref = await rawSeries(eps);
			const run = await EC.lpnEpanetRun(L.assembleModel(), {});
			let w = 0, frames = 0;
			(run.frames || []).forEach((f) => {
				const r = ref[f.t];
				if (!r) { return; }
				frames++;
				for (const id in r) { if (f.heads[id] !== undefined) { w = Math.max(w, Math.abs(f.heads[id] - r[id])); } }
			});
			ok('EPS, Overflow ' + word + ': the page\'s EPANET run matches EPANET on the file at every hour',
				run.ok && frames >= 6 && w < 0.005, frames + ' hours, worst ' + w.toFixed(4) + ' m');
			// ...and by the built-in loop, which copies EPANET's tank rules.
			const nrun = EC.lpnNativeRun(L.assembleModel());
			let nw = 0, nframes = 0;
			(nrun.frames || []).forEach((f) => {
				const r = ref[f.t];
				if (!r) { return; }
				nframes++;
				for (const id in r) { if (f.heads[id] !== undefined) { nw = Math.max(nw, Math.abs(f.heads[id] - r[id])); } }
			});
			ok('EPS, Overflow ' + word + ': the built-in run matches EPANET on the file at every hour',
				nrun.ok && nframes >= 6 && nw < 0.005, nframes + ' hours, worst ' + nw.toFixed(4) + ' m');
			seen[word] = ref;
		}
		let apart = 0;
		for (const t in seen.YES) { for (const id in seen.YES[t]) { apart = Math.max(apart, Math.abs(seen.YES[t][id] - seen.NO[t][id])); } }
		ok('the probe can fail: Overflow YES and NO give EPANET different heads', apart > 0.05, apart.toFixed(3) + ' m');
	}

	// =============================================================================================
	console.log('\n3. SEMICOLONS IN LABELS AND TITLES; ALL TITLE LINES');
	const LBL = (title, labels) => `[TITLE]
${title}

[JUNCTIONS]
 J1 20 2

[RESERVOIRS]
 R1 100

[PIPES]
 P1 R1 J1 1000 300 100 0 Open

[COORDINATES]
 J1 0 0
 R1 -100 0

[LABELS]
${labels}

[OPTIONS]
 Units LPS
 Headloss H-W

[END]
`;
	{
		const full = LBL('Smith; phase 2\nsecond line ; with semi\n  third line', ' 5 5 "Zone A; north"\n 6 6 "Plain" J1');
		const { parsed, doc } = importDoc(full);
		const labelText = (d) => d.labels.map((x) => x._text);
		ok('a quoted label keeps its `;`', JSON.stringify(labelText(doc)) === JSON.stringify(['Zone A; north', 'Plain']), JSON.stringify(labelText(doc)));
		const out = exportOf(doc);
		ok('the label comes back out quoted whole', /"Zone A; north"/.test(out.inp), out.inp.split('[LABELS]')[1].split('[')[0].trim());
		const back = importDoc(out.inp);
		ok('and reads back as written', JSON.stringify(labelText(back.doc)) === JSON.stringify(['Zone A; north', 'Plain']));
		const titleOf = (t) => t.split('[TITLE]')[1].split(/\n\s*\n/)[0].replace(/^\n/, '');
		ok('all three title lines come back as the file wrote them, `;` and spacing included',
			titleOf(out.inp) === 'Smith; phase 2\nsecond line ; with semi\n  third line', JSON.stringify(titleOf(out.inp)));
		// EPANET's own reader on the exported file: the title is whole, three lines.
		const ws = new mod.Workspace(); await ws.loadModule();
		ws.writeFile('t.inp', out.inp.replace(/\[LABELS\][\s\S]*?\n\n/, ''));
		const p = new mod.Project(ws); p.open('t.inp', 't.rpt', 't.out');
		const tt = p.getTitle();
		ok('the vendored EPANET engine reads those three lines whole', tt.line1 === 'Smith; phase 2' && tt.line2 === 'second line ; with semi' && tt.line3 === '  third line', JSON.stringify(tt));
		// A renamed project is titled by its new name: the carried lines speak for the old one.
		const renamed = JSON.parse(JSON.stringify(doc)); renamed.project.name = 'Renamed; again';
		ok('a project the user renamed is titled by its new name', titleOf(exportOf(renamed).inp) === 'Renamed; again');
		// A project named with a `;` and never imported.
		const named = JSON.parse(JSON.stringify(doc)); named.project.name = 'Smith; phase 2'; delete named.project.inpTitle;
		ok('a project name with a `;` exports whole', titleOf(exportOf(named).inp) === 'Smith; phase 2');
	}

	// =============================================================================================
	console.log('\n3b. VISCOSITY IS RELATIVE ABOVE 1e-3 AND ABSOLUTE AT OR BELOW IT, as EPANET reads it');
	// One laminar Darcy-Weisbach pipe, where the head loss is directly proportional to the viscosity.
	const VISC = (units, opt, tail) => `[TITLE]
viscosity probe

[JUNCTIONS]
 J1 0 ${units === 'LPS' ? '0.02' : '0.3'}

[RESERVOIRS]
 R1 100

[PIPES]
 P1 R1 J1 1000 50 0.1 0 Open

[COORDINATES]
 J1 0 0
 R1 -100 0

[OPTIONS]
 Units ${units}
 Headloss D-W
${opt}
[END]
`;
	for (const [label, v] of [['relative 2', ' Viscosity 2.00'], ['absolute 1.0219e-6 m2/s (EPANET\'s own default)', ' Viscosity 1.0219e-6'],
		['absolute 2.0438e-6 m2/s', ' Viscosity 2.0438e-6'], ['absolute 1e-6 m2/s', ' Viscosity 1e-6']]) {
		const text = VISC('LPS', v);
		const { parsed, doc } = importDoc(text);
		const out = exportOf(doc);
		ok('viscosity ' + label + ': the option comes back as the file wrote it', rowsOf(out.inp, 'OPTIONS').indexOf(v.trim().replace(/ +/, ' ')) >= 0, JSON.stringify(rowsOf(out.inp, 'OPTIONS')));
		open(doc);
		const ref = await rawHeads(text);
		const nat = EC.lpnSolve(L.assembleModel(), { tol: 1e-12 });
		const ep = await EC.lpnSolveEpanet(L.assembleModel(), {});
		const refLoss = 100 - ref.J1, natLoss = 100 - nat.heads.J1, epLoss = 100 - ep.heads.J1;
		// 3 %: until the one default viscosity is shared (fix/viscosity) the two engines' water differs by 1.5 %.
		ok('viscosity ' + label + ': the built-in solver loses the head EPANET does (' + natLoss.toFixed(5) + ' vs ' + refLoss.toFixed(5) + ' m)',
			Math.abs(natLoss - refLoss) / refLoss < 0.03);
		ok('viscosity ' + label + ': the EPANET bridge loses the head EPANET does (' + epLoss.toFixed(5) + ')', Math.abs(epLoss - refLoss) / refLoss < 0.001);
	}
	{
		// A US file states it in ft2/s: 2.2e-5 is twice EPANET's own 1.1e-5. The model is handed the
		// relative 2 and the matching absolute viscosity, and the file's characters survive.
		const { doc } = importDoc(VISC('GPM', ' Viscosity 2.20e-5'));
		const out = exportOf(doc);
		ok('US viscosity 2.20e-5: the option comes back as the file wrote it', rowsOf(out.inp, 'OPTIONS').indexOf('Viscosity 2.20e-5') >= 0, JSON.stringify(rowsOf(out.inp, 'OPTIONS')));
		open(doc);
		const m = L.assembleModel();
		ok('US viscosity 2.20e-5 ft2/s reaches both engines as the relative 2', Math.abs(m.hydraulics.viscosity - 2) < 1e-9, String(m.hydraulics.viscosity));
		ok('...and the built-in solver\'s water is twice EPANET\'s default', Math.abs(m.visc / (1.1e-5 * 0.3048 * 0.3048) - 2) < 1e-9, String(m.visc));
		const rel = import_relative();
		ok('a relative Viscosity 1.30 is left as the file wrote it', rel);
	}
	function import_relative() {
		const { doc } = importDoc(VISC('LPS', ' Viscosity 1.30'));
		open(doc);
		const m = L.assembleModel();
		return m.hydraulics.viscosity === 1.3 && rowsOf(exportOf(doc).inp, 'OPTIONS').indexOf('Viscosity 1.30') >= 0;
	}

	// EPA's own Net1, Net2 and Net3: the title (two lines in Net1) now goes back out as the file wrote
	// it, and the sections the other round-trip harnesses hold token for token are unchanged.
	console.log('\n4. EPA NETWORKS STILL EXPORT THEMSELVES');
	for (const net of ['Net1', 'Net2', 'Net3']) {
		const text = fs.readFileSync(ROOT + 'dev/lpn-spike/reference/' + net + '.inp', 'utf8');
		const { doc } = importDoc(text, net);
		const out = exportOf(doc);
		const titleOf = (t) => t.split('[TITLE]')[1].split(/\n\s*\n/)[0].replace(/^\r?\n/, '').replace(/\r/g, '');
		ok(net + ': [TITLE] comes back as the file wrote it', titleOf(out.inp) === titleOf(text), JSON.stringify(titleOf(out.inp)));
		const a = tokensBySection(text), b = tokensBySection(out.inp);
		let same = true;
		['JUNCTIONS', 'RESERVOIRS', 'TANKS', 'PIPES', 'PUMPS', 'VALVES', 'COORDINATES'].forEach((sec) => {
			if (JSON.stringify((a[sec] || []).map((r) => r.slice(0, 7))) !== JSON.stringify((b[sec] || []).map((r) => r.slice(0, 7)))) { same = false; console.log('     differs: ' + sec); }
		});
		ok(net + ': every element row comes back as the file wrote it (tank rows included)', same);
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall fidelity checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.log(e && e.stack || e); process.exit(2); });
