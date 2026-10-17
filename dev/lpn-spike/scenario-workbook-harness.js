// THE SCENARIO WORKBOOK, OUT AND BACK IN (Task 752; dev/scenario-workbook.md). Headless. Run with:
//   node dev/lpn-spike/scenario-workbook-harness.js
//
// On Net1, with a child scenario and a grandchild holding overrides in four categories and a
// calculation set:
//   W1  the workbook's sheets: Scenarios, Alternatives, a sheet per element category, Settings; a
//       hidden key row; units in the headings; every value as stored;
//   W2  an unchanged export read straight back changes nothing and reports nothing; so does the same
//       workbook as a spreadsheet program re-saves it (shared strings, deflated, a namespace prefix,
//       numbers re-typed);
//   W3  three cells edited: the report lists exactly those three, applying changes exactly those
//       values, as one undo step, and every scenario solves the same as when the three edits are
//       made by hand in the program;
//   W4  what is never done silently: a blanked cell is kept and listed, a row naming an asset the
//       project lacks, a value that is not a number, a column in other units, and a sheet that is
//       not the workbook's are each listed with the reason; nothing of them is applied;
//   W5  the tree from a workbook: a new scenario, a rename, a new alternative and a pick, applied;
//   W6  a file from before 2026-10-12 (a scenario's own values in its own map): round trip clean,
//       and an edit stores that alternative as the program does;
//   W7  a choice (a pipe's status) is read by its stored word; a word that is no choice is refused;
//   W8  a workbook made on a page in another language (its headings, sheet names, category and asset
//       words, Base's name) reads back as no change;
//   W9  a workbook from another project (Net1's into Net2) is warned of at the top, never refused;
//   W10 typed characters: the program keeps a typed number as a number, and so does the workbook;
//   W11 no two columns of a sheet share a heading (Type and Valve type).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const stub = require('./lpn-dom-stub.js');
const { ROOT, setUnitSet, loadLoopedNetwork } = stub;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-rules.js');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const solver = require(ROOT + 'js/lpn-solver.js');
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const NET1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');
const E = global.EngCalcs;
const PC = global.EngCalcs.pageConfig;
const INJECT =
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, setProp: setProp, effective: effective,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario, scenarioById: scenarioById,\n" +
	"\t\tserializeProject: serializeProject, undo: undo, importProject: importProject, touchTree: touchTree,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, assembleModel: assembleModel, importInp: importInpFromFile,\n" +
	"\t\tcalcWriteTargetOf: calcWriteTargetOf, smRecords: smRecords, smName: smName, overrideCount: overrideCount,\n" +
	"\t\tsetScenarioSetting: setScenarioSetting, ownWriteTarget: ownWriteTarget,\n" +
	"\t\tbookSheets: scnBookSheets, bookBytes: scnBookBytes, bookRead: scnBookRead, bookPlan: scnBookPlan,\n" +
	"\t\tbookApply: function (p) { var r = scnBookApply(p); scnBookAfter(r); return r; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
function page() {
	const L = loadLoopedNetwork(INJECT);
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.getSettings().engine = 'native';
	return L;
}
// Every scenario's heads and flows, solved by the built-in solver.
function solveAll(L) {
	const out = {};
	L.getScenarios().forEach((s) => {
		L.switchScenario(s.id);
		const r = solver.lpnSolve(L.assembleModel(), { tol: 1e-10 });
		out[s.name || s.id] = r && r.converged ? { heads: r.heads, flows: r.flows } : null;
	});
	L.switchScenario(L.baseScenario().id);
	return out;
}
function sameSolve(a, b) {
	let worst = 0, bad = '';
	Object.keys(a).forEach((n) => {
		if (!a[n] || !b[n]) { bad = bad || n + ' did not solve'; return; }
		['heads', 'flows'].forEach((k) => Object.keys(a[n][k]).forEach((id) => {
			const d = Math.abs(a[n][k][id] - b[n][k][id]);
			if (!(d <= worst)) { worst = isNaN(d) ? Infinity : d; }
		}));
	});
	return { ok: !bad && worst < 1e-9, worst: worst, bad: bad };
}
// The sheet a key row names, the column of a key, and the row of an alternative and asset.
const sheetOf = (book, kind) => book.filter((s) => String((s.rows[1] || [])[0] || '').indexOf(kind + ':') === 0)[0];
const colOf = (sh, key) => (sh.rows[1] || []).findIndex((k, i) => (i === 0 ? String(k).split(':')[1] : String(k)).split('|')[0] === key);
const rowOf = (sh, alt, id) => sh.rows.findIndex((r, i) => i > 1 && r[0] === alt && r[2] === id);
function setCell(book, kind, alt, id, key, text) {
	const sh = sheetOf(book, kind), c = colOf(sh, key), r = rowOf(sh, alt, id);
	if (c < 0 || r < 0) { throw new Error('no cell ' + [kind, alt, id, key].join('/')); }
	sh.rows[r][c] = text;
}
// The workbook as a spreadsheet program writes it back: shared strings, every entry deflated, an
// `x:` namespace prefix, each number as its double's own text, and the cells without inline strings.
function resaved(book) {
	const sst = [], idx = {};
	const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const si = (s) => { if (idx[s] === undefined) { idx[s] = sst.length; sst.push(s); } return idx[s]; };
	const col = (i) => { let s = ''; for (i = i + 1; i > 0; i = Math.floor((i - 1) / 26)) { s = String.fromCharCode(65 + ((i - 1) % 26)) + s; } return s; };
	const files = {};
	const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', RN = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
	files['[Content_Types].xml'] = '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>';
	files['_rels/.rels'] = '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="' + RN + '/officeDocument" Target="xl/workbook.xml"/></Relationships>';
	let wb = '<?xml version="1.0"?><x:workbook xmlns:x="' + NS + '" xmlns:r="' + RN + '"><x:sheets>', rels = '';
	book.forEach((sh, n) => {
		wb += '<x:sheet name="' + esc(sh.name) + '" sheetId="' + (n + 1) + '" r:id="rId' + (n + 1) + '"/>';
		rels += '<Relationship Id="rId' + (n + 1) + '" Type="' + RN + '/worksheet" Target="worksheets/sheet' + (n + 1) + '.xml"/>';
		let x = '<?xml version="1.0"?><x:worksheet xmlns:x="' + NS + '"><x:sheetData>';
		sh.rows.forEach((r, ri) => {
			x += '<x:row r="' + (ri + 1) + '"' + (ri === 1 ? ' hidden="1"' : '') + '>';
			r.forEach((v, ci) => {
				if (v === '' || v === undefined) { return; }
				const ref = col(ci) + (ri + 1);
				if (ri > 1 && /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(v) && String(+v) === v) { x += '<x:c r="' + ref + '"><x:v>' + String(+v) + '</x:v></x:c>'; }
				else { x += '<x:c r="' + ref + '" t="s"><x:v>' + si(v) + '</x:v></x:c>'; }
			});
			x += '</x:row>';
		});
		files['xl/worksheets/sheet' + (n + 1) + '.xml'] = x + '</x:sheetData></x:worksheet>';
	});
	files['xl/workbook.xml'] = wb + '</x:sheets></x:workbook>';
	rels += '<Relationship Id="rIdS" Type="' + RN + '/sharedStrings" Target="sharedStrings.xml"/>';
	files['xl/_rels/workbook.xml.rels'] = '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + rels + '</Relationships>';
	files['xl/sharedStrings.xml'] = '<?xml version="1.0"?><x:sst xmlns:x="' + NS + '">' + sst.map((s) => '<x:si><x:t xml:space="preserve">' + esc(s) + '</x:t></x:si>').join('') + '</x:sst>';
	// A real zip, every entry deflated (method 8), as Excel writes one.
	const parts = [], central = [];
	let off = 0;
	Object.keys(files).forEach((name) => {
		const raw = Buffer.from(files[name], 'utf8'), data = zlib.deflateRawSync(raw), nm = Buffer.from(name, 'utf8'), crc = E.lpnCrc32(new Uint8Array(raw));
		const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(8, 8);
		h.writeUInt32LE(crc, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(raw.length, 22); h.writeUInt16LE(nm.length, 26);
		const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(8, 10);
		c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(raw.length, 24); c.writeUInt16LE(nm.length, 28); c.writeUInt32LE(off, 42);
		parts.push(h, nm, data); central.push(c, nm); off += 30 + nm.length + data.length;
	});
	const cd = Buffer.concat(central), end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(central.length / 2, 8); end.writeUInt16LE(central.length / 2, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
	return new Uint8Array(Buffer.concat(parts.concat([cd, end])));
}
const clone = (b) => JSON.parse(JSON.stringify(b));
const SCN_ELEMENT_KINDS = ['physical', 'demand', 'topology', 'initial', 'constituent', 'fireflow', 'energy', 'userdata', 'text'];
const what = (p) => p.changes.map((c) => c.what + ' = ' + c.to).join(' | ');

// Net1, a child scenario Peak and its child Fire, with overrides in four categories and a
// calculation set. Each edit goes through the program's own write seam, as a person's would.
function build(L) {
	L.importInp({ name: 'Net1.inp', _text: NET1 });
	const P = L.createScenario('Peak');
	L.switchScenario(P.id);
	L.setProp(L.nodeById('22'), 'demand', 400);
	L.setProp(L.nodeById('23'), 'demand', 250);
	L.setProp(L.linkById('12'), 'diameter', 12);
	const F = L.createScenario('Fire', P.id);
	L.switchScenario(F.id);
	L.setProp(L.linkById('11'), 'roughness', 90);
	L.setProp(L.linkById('10'), 'status', 'closed');
	L.setProp(L.nodeById('32'), 'fireFlow', 1500);
	L.calcWriteTargetOf(F).demandMultiplier = 1.25;
	L.touchTree('harness');
	L.switchScenario(L.baseScenario().id);
	return { P, F };
}

(async function () {
	console.log('--- W1. the sheets ---');
	const L = page();
	build(L);
	const sheets = L.bookSheets();
	const names = sheets.map((s) => s.keys[0].split(':')[0]);
	ok('W1.1 Scenarios, Alternatives, nine element categories, Settings, Project, in that order',
		names.join() === ['scenarios', 'alternatives', 'physical', 'demand', 'topology', 'initial', 'constituent', 'fireflow', 'energy', 'userdata', 'text', 'settings', 'project'].join(), names.join());
	const scn = sheets[0];
	ok('W1.2 the Scenarios sheet: Fire is a child of Peak, names its own Physical, Initial settings, Fire flow and Calculation, and inherits Peak\'s Demand',
		JSON.stringify(scn.rows.map((r) => r.slice(0, 3))) === JSON.stringify([['base', 'Base', ''], [L.getScenarios()[1].id, 'Peak', 'Base'], [L.getScenarios()[2].id, 'Fire', 'Peak']]) &&
		JSON.stringify(scn.rows[1].slice(3)) === JSON.stringify(['Peak', 'Peak', '', '', '', '', '', '', '', '', '']) &&
		JSON.stringify(scn.rows[2].slice(3)) === JSON.stringify(['Fire', '', '', 'Fire', '', 'Fire', '', '', '', '', 'Fire']), JSON.stringify(scn.rows));
	const phys = sheets[2], dcol = phys.keys.indexOf('diameter|in');
	ok('W1.3 Physical: the diameter column is stamped in inches, headed with the unit', dcol > 2 && / \(in\)$/.test(phys.heads[dcol]), phys.heads[dcol] + ' / ' + phys.keys[dcol]);
	const rcol = phys.keys.indexOf('roughness');
	ok('W1.4 ...and holds Peak\'s Pipe 12 at the 12 typed and Fire\'s Pipe 11 roughness at 90, and nothing else', phys.rows.length === 2 &&
		phys.rows[0][0] === 'Peak' && phys.rows[0][2] === '12' && phys.rows[0][dcol] === '12' && phys.rows[0].filter((c) => c !== '').length === 4 &&
		phys.rows[1][0] === 'Fire' && phys.rows[1][2] === '11' && phys.rows[1][rcol] === '90' && phys.rows[1].filter((c) => c !== '').length === 4, JSON.stringify(phys.rows));
	const init = sheets[5], scol = init.keys.indexOf('status');
	ok('W1.5 Initial settings: Fire closes Pipe 10, written as stored', init.rows.length === 1 && init.rows[0][scol] === 'closed', JSON.stringify(init.rows));
	const set = sheets[11];
	ok('W1.6 Settings: Fire\'s calculation set holds the multiplier 1.25', set.rows.some((r) => r[1] === 'Fire' && r[3] === 'settings.hydraulics.demandMultiplier' && r[4] === '1.25'), JSON.stringify(set.rows));
	const bytes = L.bookBytes();
	const book0 = await L.bookRead(bytes);
	const trim = (r) => { const c = r.map((x) => String(x)); while (c.length && c[c.length - 1] === '') { c.pop(); } return c; };
	ok('W1.7 the .xlsx reads back cell for cell', JSON.stringify(book0.map((s) => s.rows.slice(2).map(trim))) === JSON.stringify(sheets.map((s) => s.rows.map(trim))) &&
		JSON.stringify(book0.map((s) => trim(s.rows[1]))) === JSON.stringify(sheets.map((s) => trim(s.keys))) &&
		JSON.stringify(book0.map((s) => trim(s.rows[0]))) === JSON.stringify(sheets.map((s) => trim(s.heads))));
	ok('W1.8 the key row is hidden', /<row r="2" hidden="1">/.test(Buffer.from(bytes).toString('latin1')) || (await E.lpnUnzip(bytes).then((f) => /<row r="2" hidden="1">/.test(Buffer.from(f['xl/worksheets/sheet1.xml']).toString()))));

	console.log('--- W2. an unchanged round trip ---');
	const file0 = JSON.stringify(L.serializeProject());
	let plan = L.bookPlan(book0);
	ok('W2.1 straight back: no change, nothing unused, nothing kept', plan.ok && plan.changes.length === 0 && plan.unusable.length === 0 && plan.kept.length === 0,
		JSON.stringify([plan.changes, plan.unusable, plan.kept]));
	const resave = await L.bookRead(resaved(book0));
	ok('W2.2 the re-saved form reads to the same cells', JSON.stringify(resave.map((s) => s.rows)) === JSON.stringify(book0.map((s) => s.rows)));
	plan = L.bookPlan(resave);
	ok('W2.3 ...and changes nothing', plan.ok && plan.changes.length === 0 && plan.unusable.length === 0 && plan.kept.length === 0, JSON.stringify([plan.changes, plan.unusable, plan.kept]));
	// A spreadsheet keeps 15 significant digits.
	const noisy = clone(book0);
	setCell(noisy, 'physical', 'Peak', '12', 'diameter', '12.0000000000000004');
	plan = L.bookPlan(noisy);
	ok('W2.4 a number equal to 15 significant digits is the same number', plan.changes.length === 0, what(plan));
	ok('W2.5 the project is untouched by reading', JSON.stringify(L.serializeProject()) === file0);

	console.log('--- W3. three cells edited ---');
	const book3 = clone(book0);
	setCell(book3, 'physical', 'Peak', '12', 'diameter', '16');
	setCell(book3, 'demand', 'Peak', '22', 'demand', '520');
	setCell(book3, 'physical', 'Fire', '11', 'roughness', '110');
	plan = L.bookPlan(book3);
	ok('W3.1 the report lists exactly the three', plan.changes.length === 3 && plan.unusable.length === 0 && plan.kept.length === 0 &&
		plan.changes.some((c) => /Peak, Pipe 12: Diameter/.test(c.what) && c.from === '12' && c.to === '16') &&
		plan.changes.some((c) => /Peak, Junction 22: /.test(c.what) && c.from === '400' && c.to === '520') &&
		plan.changes.some((c) => /Fire, Pipe 11: /.test(c.what) && c.from === '90' && c.to === '110'), what(plan) + ' ' + JSON.stringify(plan.unusable));
	ok('W3.2 ...each with its sheet and row number', plan.changes.every((c) => typeof c.row === 'number' && c.row >= 3 && c.sheet));
	const before = JSON.parse(file0);
	const res = L.bookApply(plan);
	ok('W3.3 applied, none failed', res.applied === 3 && res.failed.length === 0, JSON.stringify(res));
	const after = JSON.parse(JSON.stringify(L.serializeProject()));
	const altVals = (d) => { const o = {}; (d.alternatives || []).forEach((a) => { o[a.name + '/' + a.category] = a.values; }); return o; };
	const want = altVals(before);
	want['Peak/physical']['l:12'].diameter = 16;
	want['Peak/demand']['n:22'].demand = 520;
	want['Fire/physical']['l:11'].roughness = 110;
	ok('W3.4 exactly those three values changed in the stored alternatives', JSON.stringify(altVals(after)) === JSON.stringify(want), JSON.stringify(altVals(after)));
	const strip = (d) => { const c = clone(d); delete c.alternatives; return JSON.stringify(c); };
	ok('W3.5 ...and nothing else in the file', strip(after) === strip(before));
	// The same three edits made by hand in a second page, from the same file.
	const H = page();
	H.importProject(JSON.parse(file0));
	const sid = (LL, n) => LL.getScenarios().filter((s) => s.name === n)[0].id;
	H.switchScenario(sid(H, 'Peak'));
	H.setProp(H.linkById('12'), 'diameter', 16);
	H.setProp(H.nodeById('22'), 'demand', 520);
	H.switchScenario(sid(H, 'Fire'));
	H.setProp(H.linkById('11'), 'roughness', 110);
	H.switchScenario(H.baseScenario().id);
	const byHand = solveAll(H), byBook = solveAll(L), cmp = sameSolve(byHand, byBook);
	ok('W3.6 every scenario solves the same as the edits made by hand', cmp.ok && Object.keys(byHand).length === 3, 'worst ' + cmp.worst + ' ' + cmp.bad);
	ok('W3.7 ...and the edits moved the answer', Math.abs(byBook.Peak.heads['22'] - solveAll((() => { const O = page(); O.importProject(JSON.parse(file0)); return O; })()).Peak.heads['22']) > 0.01);
	ok('W3.8 the hand-edited file and the workbook-edited file hold the same alternatives', JSON.stringify(altVals(JSON.parse(JSON.stringify(H.serializeProject())))) === JSON.stringify(altVals(after)));
	L.undo();
	ok('W3.9 one Undo puts the whole import back', JSON.stringify(L.serializeProject()) === file0);
	plan = L.bookPlan(book0);
	ok('W3.10 ...after which the first workbook is again no change', plan.changes.length === 0 && plan.kept.length === 0 && plan.unusable.length === 0);

	console.log('--- W4. nothing silently ---');
	const book4 = clone(book0);
	setCell(book4, 'demand', 'Peak', '23', 'demand', '');
	setCell(book4, 'physical', 'Peak', '12', 'diameter', 'twelve');
	const dem = sheetOf(book4, 'demand');
	dem.rows.push(['Peak', 'Junction', 'J-NOPE', '10']);
	const ph = sheetOf(book4, 'physical');
	ph.rows[1][colOf(ph, 'roughness')] = 'roughness|furlongs';
	book4.push({ name: 'Notes', rows: [['my notes'], ['nothing here']] });
	plan = L.bookPlan(book4);
	const why = plan.unusable.map((u) => u.sheet + '@' + u.row + ': ' + u.why);
	ok('W4.1 nothing to apply', plan.changes.length === 0, what(plan));
	ok('W4.2 the blanked cell is kept, and said', plan.kept.length === 1 && /Demand, Peak: .*Junction 23/.test(plan.kept[0]), JSON.stringify(plan.kept));
	const fill = (key, vars) => Object.keys(vars).reduce((t, k) => t.split('{' + k + '}').join(vars[k]), PC[key]);
	ok('W4.3 "twelve" is not a number, with its row', why.indexOf('Physical@3: Peak, ' + PC.lpn_tool_add_pipe + ' 12: ' + PC.lpn_field_diameter + ': ' + PC.lpn_scnbook_why_number) >= 0, why.join(' | '));
	ok('W4.4 the asset the project lacks', why.some((w) => /^Demand@\d+: /.test(w) && w.slice(w.indexOf(': ') + 2) === fill('lpn_scnbook_why_no_asset', { asset: 'Junction', id: 'J-NOPE' })), why.join(' | '));
	ok('W4.5 the column in other units is refused as a column', why.indexOf('Physical@: ' + fill('lpn_scnbook_why_column_unit',
		{ column: ph.rows[0][colOf(ph, 'roughness')], property: ph.rows[0][colOf(ph, 'roughness')], unit: 'furlongs', project: PC.lpn_scnbook_no_unit })) >= 0, why.join(' | '));
	ok('W4.6 the sheet that is not the workbook\'s', why.indexOf('Notes@: ' + PC.lpn_scnbook_why_sheet) >= 0, why.join(' | '));
	ok('W4.7 a file that is no workbook at all is refused whole', L.bookPlan([{ name: 'S', rows: [['a'], ['b']] }]).ok === false);

	console.log('--- W5. the tree from a workbook ---');
	const book5 = clone(book0);
	const s5 = sheetOf(book5, 'scenarios'), a5 = sheetOf(book5, 'alternatives');
	s5.rows[3][1] = 'Peak hour';
	const cats = s5.rows[1].map((k, i) => (i === 0 ? 'id' : k));
	const newRow = cats.map(() => '');
	newRow[1] = 'Night'; newRow[2] = 'Base'; newRow[cats.indexOf('demand')] = 'Night demand';
	s5.rows.push(newRow);
	a5.rows.push(['Demand', '', 'Night demand', 'Base']);
	sheetOf(book5, 'demand').rows.push(['Night demand', 'Junction', '22', '15']);
	plan = L.bookPlan(book5);
	ok('W5.1 five changes: a rename, a new scenario, a new alternative, its pick, and its one value', plan.changes.length === 5 && plan.unusable.length === 0, what(plan) + ' ' + JSON.stringify(plan.unusable));
	L.bookApply(plan);
	const night = L.getScenarios().filter((s) => s.name === 'Night')[0];
	ok('W5.2 Peak is now Peak hour', L.getScenarios().some((s) => s.name === 'Peak hour') && !L.getScenarios().some((s) => s.name === 'Peak'));
	ok('W5.3 Night exists, a child of Base, naming Night demand', !!night && night.parent === undefined && !!night.alternatives &&
		L.smName('demand', night.alternatives.demand) === 'Night demand');
	L.switchScenario(night.id);
	ok('W5.4 ...whose Junction 22 demand is the 15 typed', L.effective(L.nodeById('22'), 'demand') === 15, String(L.effective(L.nodeById('22'), 'demand')));
	L.switchScenario(L.baseScenario().id);
	const book5b = await L.bookRead(L.bookBytes());
	plan = L.bookPlan(book5b);
	ok('W5.5 exported again and read back: no change', plan.changes.length === 0 && plan.kept.length === 0 && plan.unusable.length === 0, what(plan) + JSON.stringify(plan.kept));
	L.undo();
	ok('W5.6 Undo puts it all back', JSON.stringify(L.serializeProject()) === file0);

	console.log('--- W6. a file from before 2026-10-12 ---');
	const old = JSON.parse(file0);
	const peak = old.scenarios.filter((s) => s.name === 'Peak')[0];
	const pd = old.alternatives.filter((a) => a.name === 'Peak' && a.category === 'demand')[0];
	peak.overrides = JSON.parse(JSON.stringify(pd.values));
	delete peak.alternatives.demand;
	old.alternatives = old.alternatives.filter((a) => a !== pd);
	const O = page();
	O.importProject(old);
	const oldFile = JSON.stringify(O.serializeProject());
	const bookO = await O.bookRead(O.bookBytes());
	ok('W6.1 its own Demand values are listed under the scenario\'s own alternative', sheetOf(bookO, 'alternatives').rows.some((r) => r[1] === peak.id + ':demand' && r[2] === 'Peak') &&
		sheetOf(bookO, 'demand').rows.filter((r, i) => i > 1 && r[0] === 'Peak').length === 2);
	plan = O.bookPlan(bookO);
	ok('W6.2 round trip: no change', plan.changes.length === 0 && plan.kept.length === 0 && plan.unusable.length === 0, what(plan) + JSON.stringify(plan.unusable) + JSON.stringify(plan.kept));
	setCell(bookO, 'demand', 'Peak', '23', 'demand', '260');
	plan = O.bookPlan(bookO);
	ok('W6.3 one edit, one change', plan.changes.length === 1, what(plan));
	O.bookApply(plan);
	const stored = O.smRecords('demand').filter((r) => !r.implicit && r.name === 'Peak')[0];
	ok('W6.4 ...stored as the scenario\'s own alternative, as an edit in the program stores it, both values in it',
		!!stored && stored.values['n:23'].demand === 260 && stored.values['n:22'].demand === 400 && !Object.keys(O.scenarioById(peak.id).overrides || {}).length, JSON.stringify(stored));
	O.undo();
	ok('W6.5 Undo gives the old file back', JSON.stringify(O.serializeProject()) === oldFile);

	console.log('--- W7. a choice, by its word or the page\'s ---');
	const book7 = clone(book0);
	setCell(book7, 'initial', 'Fire', '10', 'status', 'open');
	plan = L.bookPlan(book7);
	ok('W7.1 closed to open: one change, to the stored word', plan.changes.length === 1 && plan.ops.vals.length === 1 && plan.ops.vals[0].v === 'open', what(plan) + JSON.stringify(plan.unusable));
	setCell(book7, 'initial', 'Fire', '10', 'status', 'Shut');
	plan = L.bookPlan(book7);
	setCell(book7, 'initial', 'Fire', '10', 'status', 'FALSE');
	plan = L.bookPlan(book7);
	ok('W7.1b ...and FALSE in the Closed column is open too', plan.changes.length === 1 && plan.ops.vals[0].v === 'open', what(plan));
	setCell(book7, 'initial', 'Fire', '10', 'status', 'Shut');
	plan = L.bookPlan(book7);
	ok('W7.2 a word that is no choice is refused, and said', plan.changes.length === 0 && plan.unusable.length === 1 && plan.unusable[0].why.endsWith(PC.lpn_scnbook_why_choice), JSON.stringify(plan.unusable) + what(plan));

	console.log('--- W8. a workbook made on a page in another language ---');
	// Its headings, category words, asset words and Base's name are that page's; the keys are not.
	const book8 = clone(book0);
	book8.forEach((sh) => { sh.name = 'Hoja ' + sh.name; sh.rows[0] = sh.rows[0].map((h) => 'X ' + h); });
	sheetOf(book8, 'scenarios').rows[2][1] = 'Escenario base';
	sheetOf(book8, 'scenarios').rows.slice(2).forEach((r) => { if (r[2] === 'Base') { r[2] = 'Escenario base'; } });
	sheetOf(book8, 'alternatives').rows.slice(2).forEach((r) => { if (r[3] === 'Base') { r[3] = 'Escenario base'; } });
	sheetOf(book8, 'alternatives').rows.slice(2).forEach((r) => { r[0] = 'Categoría ' + r[0]; });
	sheetOf(book8, 'settings').rows.slice(2).forEach((r) => { r[0] = 'Categoría ' + r[0]; });
	SCN_ELEMENT_KINDS.forEach((k) => { const sh = sheetOf(book8, k); if (sh) { sh.rows.slice(2).forEach((r) => { r[1] = r[1] === 'Pipe' ? 'Tubería' : r[1] === 'Junction' ? 'Nudo' : r[1]; }); } });
	plan = L.bookPlan(book8);
	ok('W8.1 read back on this page: no change, nothing unused, nothing kept', plan.ok && plan.changes.length === 0 && plan.unusable.length === 0 && plan.kept.length === 0,
		JSON.stringify([plan.changes, plan.unusable, plan.kept]));
	setCell(book8, 'physical', 'Peak', '12', 'diameter', '14');
	plan = L.bookPlan(book8);
	ok('W8.2 ...and an edit in it is the one change', plan.changes.length === 1 && plan.ops.vals[0].v === 14 && plan.unusable.length === 0, what(plan));
	const s8 = sheetOf(book8, 'scenarios'), k8 = s8.rows[1].map((k, i) => (i === 0 ? 'id' : String(k))), r8 = k8.map(() => '');
	r8[1] = 'Noche'; r8[2] = 'Escenario base'; r8[k8.indexOf('demand')] = 'Escenario base';
	s8.rows.push(r8);
	plan = L.bookPlan(book8);
	ok('W8.3 a new scenario under Base, choosing Base, in that language\'s word for Base', plan.unusable.length === 0 && plan.ops.newScn.length === 1 && plan.ops.newScn[0].parent === 'base' &&
		plan.ops.picks.length === 1 && plan.ops.picks[0].key === 'base', JSON.stringify(plan.unusable) + what(plan));

	console.log('--- W9. a workbook from another project says so ---');
	plan = L.bookPlan(book0);
	ok('W9.1 its own project: no warning', !plan.warning, plan.warning);
	const N2 = page();
	N2.importInp({ name: 'Net2.inp', _text: fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net2.inp'), 'utf8') });
	plan = N2.bookPlan(book0);
	ok('W9.2 Net1\'s workbook read into Net2 warns, naming both and their asset counts', !!plan.warning &&
		plan.warning === PC.lpn_scnbook_other_project.split('{book}').join('Net1').split('{n}').join('24').split('{project}').join('Net2').split('{m}').join(String(N2.getDoc().nodes.length + N2.getDoc().links.length)), plan.warning);
	ok('W9.3 ...and still reports its rows: the person decides', plan.ok && plan.changes.length > 0, String(plan.changes.length));
	const renamed = clone(book0);
	sheetOf(renamed, 'project').rows[2][2] = '00000000';
	ok('W9.4 the same name with other asset IDs warns too', !!L.bookPlan(renamed).warning);

	console.log('--- W10. typed characters ---');
	// The program stores a typed number as a number (the Tables pane and Properties read +text), so
	// "6.00" typed is 6, and the workbook writes 6. dev/scenario-workbook.md says so.
	const T = page();
	T.importProject(JSON.parse(file0));
	T.switchScenario(sid(T, 'Peak'));
	T.setProp(T.linkById('12'), 'diameter', +'6.00');
	T.setProp(T.nodeById('23'), 'demand', +'1e-3');
	T.switchScenario(T.baseScenario().id);
	const bookT = await T.bookRead(T.bookBytes());
	const tph = sheetOf(bookT, 'physical'), tdm = sheetOf(bookT, 'demand');
	ok('W10.1 a typed 6.00 is stored as 6 and written as 6', tph.rows[rowOf(tph, 'Peak', '12')][colOf(tph, 'diameter')] === '6');
	ok('W10.2 a typed 1e-3 is written as 0.001', tdm.rows[rowOf(tdm, 'Peak', '23')][colOf(tdm, 'demand')] === '0.001');
	setCell(bookT, 'physical', 'Peak', '12', 'diameter', '6.00');
	setCell(bookT, 'demand', 'Peak', '23', 'demand', '1e-3');
	plan = T.bookPlan(bookT);
	ok('W10.3 ...and the workbook typing them back is no change, as retyping them in the program is none', plan.changes.length === 0 && plan.unusable.length === 0, what(plan));

	console.log('--- W11. headings ---');
	const topo = sheetOf(book0, 'topology');
	const typeHeads = topo.rows[0].filter((h, i) => ['type', 'valveType'].indexOf(String(topo.rows[1][i]).split('|')[0].replace(/^topology:/, '')) >= 0);
	ok('W11.1 Active topology names its two type columns apart, as the Tables pane does', typeHeads.length === 2 && typeHeads[0] === PC.lpn_field_type && typeHeads[1] === PC.lpn_field_valve_type, JSON.stringify(typeHeads));
	const heads = book0.map((sh) => sh.rows[0]).reduce((a, r) => a.concat(r), []);
	ok('W11.2 no sheet has two columns with one heading', book0.every((sh) => new Set(sh.rows[0]).size === sh.rows[0].length), JSON.stringify(heads.length));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nALL PASS');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
