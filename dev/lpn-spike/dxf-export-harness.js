// FILE > EXPORT DXF FILE -- ROADMAP Task 772. Run with:
//   node dev/lpn-spike/dxf-export-harness.js
// Optional independent audit: EC_EZDXF_PYTHON=/path/to/python-with-ezdxf (else `python3` is tried);
// without ezdxf the audit prints NOT RUN and the harness does not fail for it.
//
// What must be true of the drawing, read back by a small DXF reader written here (not the writer's
// own code), on Net1 (a grid project in feet) and Net3-Novato-CA-World (latitude and longitude):
//   (a) it is R2000 (AC1015) with the units stated in $INSUNITS, every handle unique and below
//       $HANDSEED, and every owner (330) an object that exists;
//   (b) one layer per asset type, and per layer exactly the entities the model has: pipes, pumps
//       and valves as LWPOLYLINEs with one vertex per node and bend; nodes, pumps and valves as
//       INSERTs of their blocks;
//   (c) every ATTRIB value equals the model's number or string;
//   (d) a grid project's coordinates are the file's own, EXACTLY; a geographic project's are UTM
//       metres, so a pipe's drawn length matches its ground length;
//   (e) the map's lettering is there: every shown node label's ID row, the Text labels, leaders.
'use strict';

const path = require('path');
const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));
require(path.join(ROOT, 'js', 'lpn-dxf.js'));
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
// The loader's job is fetching, which is not under test; the definitions are the real ones.
global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(DEFS) });

const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tcustomersLayer = el('g', { 'class': 'lpn-customers' }, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tlinkSymbolLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tnodesLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { left: 0, right: w, top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\tnewProject: newProject, applySaved: applySaved, migrateSaved: migrateSaved, refreshAll: refreshAllFromDocument,\n" +
	"\t\tsaveToStorage: saveToStorage, flush: flushLabelRefresh, refreshLabelText: refreshLabelText,\n" +
	"\t\tgetDoc: function () { return doc; }, serialize: serializeProject,\n" +
	"\t\tnodeEls: function () { return nodeEls; }, labelEls: function () { return labelEls; },\n" +
	"\t\tlabelsLayer: function () { return labelsLayer; },\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\taddCustomer: addCustomer, linkPointList: linkPointList,\n" +
	"\t\tfontSize: function () { return effectiveFontSize(); },\n" +
	"\t\tdxfFrame: dxfFrame, dxfExportText: dxfExportText, dxfShown: dxfShown,\n" +
	"\t\tisGeo: isLatLonProject, zoomAbout: zoomAbout, settleZoom: reshedNow,\n" +
	"\t\tview: function () { return { s: state.s, tx: state.tx, ty: state.ty }; },\n" +
	"\t\tnodeById: nodeById"
);

const PC = global.EngCalcs.pageConfig;
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ---- A SMALL INDEPENDENT DXF READER ------------------------------------------------------------
// Group-code pairs into sections of {type, codes: [[code, value]...]}. Deliberately not js/lpn-dxf.js.
function readDxf(text) {
	const lines = text.split(/\r?\n/);
	const pairs = [];
	for (let i = 0; i + 1 < lines.length; i += 2) { pairs.push([parseInt(lines[i], 10), lines[i + 1]]); }
	const sections = {};
	let sec = null, cur = null, header = {}, hvar = null;
	for (const [c, v] of pairs) {
		if (c === 0 && v === 'SECTION') { sec = 'pending'; cur = null; continue; }
		if (sec === 'pending' && c === 2) { sec = v; sections[sec] = []; continue; }
		if (c === 0 && v === 'ENDSEC') { sec = null; cur = null; continue; }
		if (!sec) { continue; }
		if (sec === 'HEADER') {
			if (c === 9) { hvar = v; header[hvar] = []; } else if (hvar) { header[hvar].push([c, v]); }
			continue;
		}
		if (c === 0) { cur = { type: v, codes: [] }; sections[sec].push(cur); continue; }
		if (cur) { cur.codes.push([c, v]); }
	}
	return { pairs, sections, header };
}
function g(ent, code) { const p = ent.codes.find(x => x[0] === code); return p ? p[1] : undefined; }
function gAll(ent, code) { return ent.codes.filter(x => x[0] === code).map(x => x[1]); }
function handleOf(ent) { return ent.type === 'DIMSTYLE' ? g(ent, 105) : g(ent, 5); }

// Entities grouped: an INSERT carries the ATTRIBs that follow it up to its SEQEND.
function entities(d) {
	const out = [];
	let ins = null;
	for (const e of d.sections.ENTITIES) {
		if (e.type === 'ATTRIB' && ins) { ins.attribs[g(e, 2)] = g(e, 1); ins.attribEnts.push(e); continue; }
		if (e.type === 'SEQEND') { ins = null; continue; }
		const r = { type: e.type, layer: g(e, 8), ent: e, attribs: {}, attribEnts: [] };
		if (e.type === 'INSERT') { ins = r; r.block = g(e, 2); }
		out.push(r);
	}
	return out;
}
function countOn(ents, type, layer) { return ents.filter(e => e.type === type && e.layer === layer).length; }

function structural(d, label) {
	ok(label + ': $ACADVER is AC1015 (R2000)', d.header.$ACADVER && d.header.$ACADVER[0][1] === 'AC1015');
	const all = [];
	Object.keys(d.sections).forEach(k => d.sections[k].forEach(e => all.push(e)));
	const handles = all.map(handleOf).filter(h => h !== undefined);
	const set = new Set(handles);
	ok(label + ': every handle is unique (' + handles.length + ')', set.size === handles.length);
	const seed = parseInt(d.header.$HANDSEED[0][1], 16);
	ok(label + ': $HANDSEED is above every handle', handles.every(h => parseInt(h, 16) < seed));
	const owners = all.map(e => g(e, 330)).filter(o => o !== undefined && o !== '0');
	const dangling = owners.filter(o => !set.has(o));
	ok(label + ': every owner (330) is an object in the file', dangling.length === 0, dangling.slice(0, 5).join(','));
	ok(label + ': no entity is missing its handle',
		d.sections.ENTITIES.every(e => g(e, 5) !== undefined));
	['VPORT', 'LTYPE', 'LAYER', 'STYLE', 'VIEW', 'UCS', 'APPID', 'DIMSTYLE', 'BLOCK_RECORD'].forEach(t => {
		ok(label + ': TABLES has ' + t, d.sections.TABLES.some(e => e.type === 'TABLE' && g(e, 2) === t));
	});
	const brNames = d.sections.TABLES.filter(e => e.type === 'BLOCK_RECORD').map(e => g(e, 2));
	ok(label + ': BLOCK_RECORDs hold *Model_Space and *Paper_Space',
		brNames.indexOf('*Model_Space') >= 0 && brNames.indexOf('*Paper_Space') >= 0);
	ok(label + ': APPID holds ACAD', d.sections.TABLES.some(e => e.type === 'APPID' && g(e, 2) === 'ACAD'));
	ok(label + ': OBJECTS opens with the root dictionary naming ACAD_GROUP',
		d.sections.OBJECTS[0].type === 'DICTIONARY' && gAll(d.sections.OBJECTS[0], 3).indexOf('ACAD_GROUP') >= 0);
	ok(label + ': no XDATA anywhere (no 1001 group)', !d.pairs.some(p => p[0] === 1001));
	return brNames;
}

function numStr(v) { return v === undefined || v === null ? '' : String(v); }

function openExample(file) {
	const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples', file), 'utf8'));
	if (json.settings) { json.settings.labelMaxWidth = null; }
	L.newProject();
	L.applySaved(L.migrateSaved(json));
	L.refreshAll();
	L.refreshLabelText();
	L.flush();
	return json;
}
function exportNow() {
	return new Promise((resolve) => { L.dxfFrame((frame) => resolve(L.dxfExportText(frame))); });
}

// Run the independent auditor if there is one. Never fails the suite for its absence.
function ezdxfAudit(file, label) {
	const { spawnSync } = require('child_process');
	const py = process.env.EC_EZDXF_PYTHON || 'python3';
	const probe = spawnSync(py, ['-c', 'import ezdxf'], { encoding: 'utf8' });
	if (probe.error || probe.status !== 0) {
		console.log('  NOT RUN ' + label + ': ezdxf audit (no Python with ezdxf; set EC_EZDXF_PYTHON)');
		return;
	}
	const script = [
		'import sys, ezdxf',
		'from ezdxf import recover',
		'doc, aud = recover.readfile(sys.argv[1])',
		'a = doc.audit()',
		'print(len(aud.errors), len(aud.fixes), len(a.errors), len(a.fixes))',
		'for e in list(aud.errors) + list(aud.fixes) + list(a.errors) + list(a.fixes): print(e.message)'
	].join('\n');
	const r = spawnSync(py, ['-c', script, file], { encoding: 'utf8' });
	const first = String(r.stdout || '').split('\n')[0].trim();
	ok(label + ': ezdxf recover + audit report no errors and no fixes', r.status === 0 && first === '0 0 0 0',
		(r.stdout || '') + (r.stderr || ''));
}

async function main() {
	setUnitSet('us');
	L.buildLayers();
	L.setCanvas(1400, 700);
	L.markSized();
	const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'lpn-dxf-'));

	console.log('--- Net1: a grid project in feet ---');
	const net1 = openExample('Net1.lwn');
	// A customer, so the customer layer and its service line are covered too.
	L.addCustomer(30, -75, { link: '10' });
	L.flush();
	const out1 = await exportNow();
	ok('Net1 exports', out1 && out1.ok);
	fs.writeFileSync(path.join(tmp, 'Net1.dxf'), Buffer.from(global.EngCalcs.lpnDxfBytes(out1.text)));
	const d1 = readDxf(out1.text);
	structural(d1, 'Net1');
	ok('Net1: $INSUNITS is 2 (feet), the project length unit', d1.header.$INSUNITS[0][1].trim() === '2');
	const e1 = entities(d1);
	const snap1 = L.serialize();
	const org1 = snap1.origin || { x: 0, y: 0 };
	const byType = t => snap1.nodes.filter(n => n.type === t);
	const linksOf = t => snap1.links.filter(l => l.type === t);
	const layers1 = d1.sections.TABLES.filter(e => e.type === 'LAYER').map(e => g(e, 2));
	['C-WATR-PIPE', 'C-WATR-EQPM', 'C-WATR-VALV', 'C-WATR-NODE', 'C-WATR-TANK', 'C-WATR-RSVR',
		'C-WATR-CUST', 'C-WATR-LABL', 'C-WATR-TEXT', 'C-WATR-RDME'].forEach(n => {
		ok('Net1: layer ' + n + ' is declared', layers1.indexOf(n) >= 0);
	});
	const rdme = d1.sections.TABLES.find(e => e.type === 'LAYER' && g(e, 2) === 'C-WATR-RDME');
	ok('Net1: the read-me layer does not plot (290 = 0)', g(rdme, 290) === '0');
	ok('Net1: one polyline per pipe (' + linksOf('pipe').length + ')',
		countOn(e1, 'LWPOLYLINE', 'C-WATR-PIPE') === linksOf('pipe').length);
	ok('Net1: one polyline and one block per pump (' + linksOf('pump').length + ')',
		countOn(e1, 'LWPOLYLINE', 'C-WATR-EQPM') === linksOf('pump').length &&
		countOn(e1, 'INSERT', 'C-WATR-EQPM') === linksOf('pump').length);
	ok('Net1: no valves, so nothing on the valve layer', countOn(e1, 'LWPOLYLINE', 'C-WATR-VALV') === 0);
	ok('Net1: one block per junction (' + byType('junction').length + ')',
		countOn(e1, 'INSERT', 'C-WATR-NODE') === byType('junction').length);
	ok('Net1: one block per tank and per reservoir',
		countOn(e1, 'INSERT', 'C-WATR-TANK') === byType('tank').length &&
		countOn(e1, 'INSERT', 'C-WATR-RSVR') === byType('reservoir').length);
	ok('Net1: the customer is a block and a service line',
		countOn(e1, 'INSERT', 'C-WATR-CUST') === 1 && countOn(e1, 'LINE', 'C-WATR-CUST') === 1);

	// (b) vertices, in link order: the polylines are written in the file's link order.
	const polys = e1.filter(e => e.type === 'LWPOLYLINE');
	const wantVerts = snap1.links.map(l => (l.verts || []).length + 2);
	ok('Net1: each polyline has one vertex per end and bend',
		JSON.stringify(polys.map(p => +g(p.ent, 90))) === JSON.stringify(wantVerts),
		JSON.stringify(polys.map(p => +g(p.ent, 90))) + ' vs ' + JSON.stringify(wantVerts));

	// (c) and (d): attribute values and exact coordinates.
	let attrBad = [], coordBad = [];
	e1.filter(e => e.type === 'INSERT' && /NODE|TANK|RSVR/.test(e.layer)).forEach(ins => {
		const n = snap1.nodes.find(x => x.id === ins.attribs.ID);
		if (!n) { attrBad.push('no node ' + ins.attribs.ID); return; }
		const X = parseFloat(g(ins.ent, 10)), Y = parseFloat(g(ins.ent, 20));
		if (X !== n.x + org1.x || Y !== n.y + org1.y) { coordBad.push(n.id + ' ' + X + ',' + Y + ' vs ' + n.x + ',' + n.y); }
		const want = { junction: { ELEV: n.elev, DEMAND: n._demand }, tank: { ELEV: n.elev, LEVEL: n._level,
			MINLEVEL: n.minLevel, MAXLEVEL: n.maxLevel, DIAMETER: n.tankDiameter },
		reservoir: { HEAD: n._head } }[n.type];
		Object.keys(want).forEach(t => {
			if (ins.attribs[t] !== numStr(want[t])) { attrBad.push(n.id + '.' + t + '=' + ins.attribs[t] + ' want ' + want[t]); }
		});
		if (!ins.attribEnts.every(a => g(a, 70) === (g(a, 2) === 'ID' ? '0' : '1'))) { attrBad.push(n.id + ': only the ID attribute may be visible'); }
	});
	ok('Net1: every node attribute equals the model', attrBad.length === 0, attrBad.slice(0, 5).join('; '));
	ok('Net1: every node lands on the file\'s own coordinates, exactly', coordBad.length === 0, coordBad.slice(0, 3).join('; '));
	const p0 = polys[0], l0 = snap1.links[0], from0 = snap1.nodes.find(n => n.id === l0.from);
	ok('Net1: a polyline starts exactly on its from-node',
		parseFloat(gAll(p0.ent, 10)[0]) === from0.x + org1.x && parseFloat(gAll(p0.ent, 20)[0]) === from0.y + org1.y);
	const pumpIns = e1.find(e => e.type === 'INSERT' && e.layer === 'C-WATR-EQPM');
	ok('Net1: the pump block carries the pump\'s ID', pumpIns && pumpIns.attribs.ID === linksOf('pump')[0].id);
	const blockAttdefs = d1.sections.BLOCKS.filter(e => e.type === 'ATTDEF').map(e => g(e, 2));
	ok('Net1: block definitions declare the ATTDEFs the inserts fill',
		['ID', 'ELEV', 'DEMAND', 'HEAD', 'LEVEL', 'MINLEVEL', 'MAXLEVEL', 'DIAMETER'].every(t => blockAttdefs.indexOf(t) >= 0));

	// (e) the lettering.
	const lbl = e1.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-LABL').map(e => g(e.ent, 1));
	const ne = L.nodeEls();
	const shownNodeIds = Object.keys(ne).filter(id => ne[id].text && L.dxfShown(ne[id].text) &&
		L.labelSettings().node.id);
	const missing = shownNodeIds.filter(id => lbl.indexOf(id) < 0);
	ok('Net1: every shown node label\'s ID row is a TEXT (' + shownNodeIds.length + ' shown)',
		shownNodeIds.length > 0 && missing.length === 0, missing.join(','));
	const texts = e1.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-TEXT').map(e => g(e.ent, 1));
	ok('Net1: the Text labels are on the text layer',
		net1.labels.length === 3 && net1.labels.every(lb => texts.indexOf(lb._text) >= 0), JSON.stringify(texts));
	const shownLeaders = L.labelsLayer().children.filter(c => c._tag === 'line' &&
		String(c['class'] || '').indexOf('lpn-leader') >= 0 && L.dxfShown(c)).length;
	ok('Net1: one LINE per leader shown on the map (' + shownLeaders + ')',
		countOn(e1, 'LINE', 'C-WATR-LABL') === shownLeaders);
	const lblHeights = e1.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-LABL').map(e => parseFloat(g(e.ent, 40)));
	const textSize = parseFloat(d1.header.$TEXTSIZE[0][1]);
	ok('Net1: every label row is one height, the drawing\'s $TEXTSIZE (' + textSize + ')',
		lblHeights.length > 0 && lblHeights.every(h => Math.abs(h - textSize) < 1e-9 * Math.max(1, h)));
	const rd = e1.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-RDME').map(e => g(e.ent, 1));
	ok('Net1: the read-me note states the coordinates claim no system', rd.some(t => t === global.EngCalcs.lpnDxfString(PC.lpn_dxf_note_grid.replace('{unit}', 'ft'))), rd.join(' | '));
	// The pipe blocks: one per pipe, at mid-run, carrying the pipe's own numbers.
	const pipeIns = e1.filter(e => e.type === 'INSERT' && e.layer === 'C-WATR-PIPE');
	ok('Net1: one WATR_PIPE block per pipe', pipeIns.length === linksOf('pipe').length &&
		pipeIns.every(e => e.block === 'WATR_PIPE'));
	const pipeBad = [];
	pipeIns.forEach(ins => {
		const l = snap1.links.find(x => x.id === ins.attribs.ID);
		if (!l) { pipeBad.push('no pipe ' + ins.attribs.ID); return; }
		[['DIAMETER', l._diameter], ['LENGTH', l._length], ['ROUGHNESS', l._roughness]].forEach(([t, v]) => {
			if (ins.attribs[t] !== numStr(v)) { pipeBad.push(l.id + '.' + t + '=' + ins.attribs[t] + ' want ' + v); }
		});
		if (!('FLOW' in ins.attribs) || !('VELOCITY' in ins.attribs)) { pipeBad.push(l.id + ' lacks FLOW/VELOCITY'); }
		if (!ins.attribEnts.every(a => g(a, 70) === (g(a, 2) === 'ID' ? '0' : '1'))) { pipeBad.push(l.id + ': only the ID attribute may be visible'); }
	});
	ok('Net1: every pipe block\'s diameter, length and roughness equal the model', pipeBad.length === 0, pipeBad.slice(0, 4).join('; '));
	ezdxfAudit(path.join(tmp, 'Net1.dxf'), 'Net1');

	console.log('--- the drawing does not depend on the zoom it was exported from ---');
	{
		const files = [], views = [];
		[0.25, 8, 40].forEach((f, i) => {
			if (i) { L.zoomAbout(700, 350, f); L.settleZoom(); }
			const before = L.view();
			files.push(L.dxfExportText(out1.frame).text);
			views.push([before, L.view()]);
		});
		if (process.env.EC_DXF_KEEP) { files.forEach((t, i) => fs.writeFileSync(path.join(tmp, 'zoom' + i + '.dxf'), t, 'latin1')); }
		ok('Net1 exported at three zooms gives three identical files', files[0] === files[1] && files[1] === files[2],
			files.map(t => t.length).join(' / '));
		ok('...from three different views', views[0][0].s !== views[1][0].s && views[1][0].s !== views[2][0].s,
			views.map(v => v[0].s).join(' / '));
		ok('...and each export puts the user\'s view back exactly', views.every(v => v[0].s === v[1].s &&
			v[0].tx === v[1].tx && v[0].ty === v[1].ty));
		const rdz = readDxf(files[0]).sections.ENTITIES.filter(e => e.type === 'TEXT' && g(e, 8) === 'C-WATR-RDME').map(e => g(e, 1));
		const lead = PC.lpn_dxf_note_scale.split('{h}')[0];
		ok('the read-me note states the text height against the network\'s size',
			rdz.some(t => t.indexOf(global.EngCalcs.lpnDxfString(lead)) === 0 && / 80 /.test(t)), rdz.join(' | '));
	}

	console.log('--- strings the user typed reach the drawing literally ---');
	{
		const n = L.nodeById('10');
		n._tag = 'a^b 50%%c \\U+0041 \\P 😀';
		n._desc = 'x'.repeat(3000);
		const out = L.dxfExportText(out1.frame), ents = entities(readDxf(out.text));
		const ins = ents.find(e => e.type === 'INSERT' && e.layer === 'C-WATR-NODE' && e.attribs.ID === '10');
		ok('caret, percent, backslash and a non-BMP character are each escaped in an ATTRIB',
			ins.attribs.TAG === 'a^ b 50%%%%%%c \\U+005CU+0041 \\U+005CP ?', JSON.stringify(ins.attribs.TAG));
		ok('a 3000-character description is cut to 2049 characters ending in an ellipsis',
			ins.attribs.DESC.length === 2049 && ins.attribs.DESC.charCodeAt(2048) === 0x85, ins.attribs.DESC.length);
		const rds = ents.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-RDME').map(e => g(e.ent, 1));
		ok('...and the read-me note says one value was shortened',
			rds.some(t => t === global.EngCalcs.lpnDxfString(PC.lpn_dxf_note_shortened.replace('{n}', '1').replace('{max}', '2049'))),
			rds.join(' | '));
		ok('no string in the file is longer than 2049 characters',
			readDxf(out.text).pairs.every(p => p[1] === undefined || p[1].length <= 2049));
		delete n._tag; delete n._desc;
	}

	console.log('--- Net3-Novato-CA-World: latitude and longitude, to UTM ---');
	const net3 = openExample('Net3-Novato-CA-World.lwn');
	// A customer in a latitude-and-longitude project: its place is worked out in the drawing frame
	// (customerPoint()), so it crosses the boundary through dxfDrawnToFile(), not the nodes' path.
	{
		const pl = L.linkPointList(L.getDoc().links.find(l => l.type === 'pipe'));
		L.addCustomer((pl[0].x + pl[1].x) / 2 + 1e-4, (pl[0].y + pl[1].y) / 2 + 1e-4,
			{ link: L.getDoc().links.find(l => l.type === 'pipe').id });
		L.flush();
	}
	ok('Net3-World opens as a latitude-and-longitude project', L.isGeo());
	const out3 = await exportNow();
	ok('Net3-World exports', out3 && out3.ok);
	ok('...through UTM zone 10N (EPSG:32610)', out3.frame && out3.frame.code === 'EPSG:32610', out3.frame && out3.frame.code);
	fs.writeFileSync(path.join(tmp, 'Net3-World.dxf'), Buffer.from(global.EngCalcs.lpnDxfBytes(out3.text)));
	const d3 = readDxf(out3.text);
	structural(d3, 'Net3-World');
	ok('Net3-World: $INSUNITS is 6 (meters)', d3.header.$INSUNITS[0][1].trim() === '6');
	const e3 = entities(d3);
	const snap3 = L.serialize();
	const n3 = t => snap3.nodes.filter(n => n.type === t).length;
	const l3 = t => snap3.links.filter(l => l.type === t).length;
	ok('Net3-World: per-layer counts equal the model (' + l3('pipe') + ' pipes, ' + l3('pump') + ' pumps, ' +
		n3('junction') + ' junctions, ' + n3('tank') + ' tanks, ' + n3('reservoir') + ' reservoirs)',
		countOn(e3, 'LWPOLYLINE', 'C-WATR-PIPE') === l3('pipe') &&
		countOn(e3, 'LWPOLYLINE', 'C-WATR-EQPM') === l3('pump') &&
		countOn(e3, 'LWPOLYLINE', 'C-WATR-VALV') === l3('valve') &&
		countOn(e3, 'INSERT', 'C-WATR-VALV') === l3('valve') &&
		countOn(e3, 'INSERT', 'C-WATR-NODE') === n3('junction') &&
		countOn(e3, 'INSERT', 'C-WATR-TANK') === n3('tank') &&
		countOn(e3, 'INSERT', 'C-WATR-RSVR') === n3('reservoir'));
	const polys3 = e3.filter(e => e.type === 'LWPOLYLINE');
	ok('Net3-World: each polyline has one vertex per end and bend',
		JSON.stringify(polys3.map(p => +g(p.ent, 90))) === JSON.stringify(snap3.links.map(l => (l.verts || []).length + 2)));
	// Coordinates are proj4's own UTM for the file's latitude and longitude, and a ground length.
	let bad3 = [];
	e3.filter(e => e.type === 'INSERT' && /NODE|TANK|RSVR/.test(e.layer)).forEach(ins => {
		const n = snap3.nodes.find(x => x.id === ins.attribs.ID);
		const u = global.window.proj4('EPSG:4326', '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs', [n.x, n.y]);
		const X = parseFloat(g(ins.ent, 10)), Y = parseFloat(g(ins.ent, 20));
		if (Math.abs(X - u[0]) > 1e-6 || Math.abs(Y - u[1]) > 1e-6) { bad3.push(n.id + ' ' + X + ',' + Y + ' vs ' + u); }
	});
	ok('Net3-World: every node is at its UTM 10N position to a micrometre', bad3.length === 0, bad3.slice(0, 3).join('; '));
	// One long pipe: the drawn length in metres against the ellipsoid (the page's own geodesic).
	const Geom = global.EngCalcs.lpnGeom;
	let worst = 0;
	polys3.forEach((p, i) => {
		const fl = snap3.links[i], a = snap3.nodes.find(n => n.id === fl.from), b = snap3.nodes.find(n => n.id === fl.to);
		if (fl.verts && fl.verts.length) { return; }
		const xs = gAll(p.ent, 10).map(parseFloat), ys = gAll(p.ent, 20).map(parseFloat);
		const drawn = Math.hypot(xs[1] - xs[0], ys[1] - ys[0]);
		const ground = Geom.geodesicMeters(a.x, a.y, b.x, b.y);
		if (ground > 500) { worst = Math.max(worst, Math.abs(drawn / ground - 1)); }
	});
	ok('Net3-World: drawn pipe lengths are ground metres within UTM\'s scale factor (worst ' +
		(worst * 100).toFixed(3) + '%)', worst > 0 && worst < 0.001);
	let attr3 = [];
	e3.filter(e => e.type === 'INSERT' && e.layer === 'C-WATR-NODE').forEach(ins => {
		const n = snap3.nodes.find(x => x.id === ins.attribs.ID);
		if (ins.attribs.ELEV !== numStr(n.elev)) { attr3.push(n.id + ' ELEV ' + ins.attribs.ELEV); }
	});
	ok('Net3-World: junction elevations equal the model', attr3.length === 0, attr3.slice(0, 3).join('; '));
	const lbl3 = e3.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-LABL');
	{
		const ci = e3.filter(e => e.type === 'INSERT' && e.layer === 'C-WATR-CUST'),
			cl = e3.filter(e => e.type === 'LINE' && e.layer === 'C-WATR-CUST');
		const fl = snap3.links.find(l => l.type === 'pipe'),
			a = e3.find(e => e.type === 'INSERT' && e.attribs.ID === fl.from), b = e3.find(e => e.type === 'INSERT' && e.attribs.ID === fl.to);
		const cx = ci.length ? parseFloat(g(ci[0].ent, 10)) : NaN, cy = ci.length ? parseFloat(g(ci[0].ent, 20)) : NaN,
			ax = parseFloat(g(a.ent, 10)), ay = parseFloat(g(a.ent, 20)), bx = parseFloat(g(b.ent, 10)), by = parseFloat(g(b.ent, 20));
		const off = Math.hypot(cx - (ax + bx) / 2, cy - (ay + by) / 2), pipeLen = Math.hypot(bx - ax, by - ay);
		ok('Net3-World: the customer is a block and a service line, in UTM metres beside its pipe (' +
			off.toFixed(1) + ' m from mid-pipe, pipe ' + pipeLen.toFixed(0) + ' m)',
			ci.length === 1 && cl.length === 1 && off < 30 + pipeLen / 2);
	}
	ok('Net3-World: one WATR_PIPE block per pipe',
		countOn(e3, 'INSERT', 'C-WATR-PIPE') === l3('pipe'));
	ok('Net3-World: the map\'s labels are in the drawing (' + lbl3.length + ' rows)', lbl3.length > 0);
	ok('Net3-World: Text labels LAKE and RIVER are on the text layer',
		['LAKE', 'RIVER'].every(t => e3.some(e => e.type === 'TEXT' && e.layer === 'C-WATR-TEXT' && g(e.ent, 1) === t)));
	const rd3 = e3.filter(e => e.type === 'TEXT' && e.layer === 'C-WATR-RDME').map(e => g(e.ent, 1));
	ok('Net3-World: the read-me note names the conversion and the zone',
		rd3.some(t => t.indexOf(PC.lpn_dxf_note_geo.split('{crs}')[0]) === 0 && /\(EPSG:32610\)/.test(t)), rd3.join(' | '));
	ezdxfAudit(path.join(tmp, 'Net3-World.dxf'), 'Net3-World');

	console.log('--- strings ---');
	const S = global.EngCalcs.lpnDxfString;
	ok('a Windows-1252 character is its one byte (the file is ANSI_1252)',
		S('Ü 50° ’') === 'Ü 50° \x92' && Buffer.from(global.EngCalcs.lpnDxfBytes(S('é')))[0] === 0xE9);
	ok('a character outside Windows-1252 becomes AutoCAD\'s \\U+ escape', S('水') === '\\U+6C34');
	ok('the whole file is bytes: every character of it is below 256',
		!/[^\x00-\xff]/.test(out1.text) && !/[^\x00-\xff]/.test(out3.text));
	ok('a control character is written in the Reference\'s caret form', S('a\nb') === 'a^Jb');
	ok('a literal caret is written "^ "', S('a^b') === 'a^ b');
	ok('where "%%" appears, every percent sign is AutoCAD\'s literal %%%', S('5%%u') === '5%%%%%%u' && S('50%') === '50%');
	ok('a typed "\\U+0041" and "\\P" are not decoded: the backslash is \\U+005C',
		S('\\U+0041\\P') === '\\U+005CU+0041\\U+005CP');
	ok('a character outside the BMP is "?", not two escaped surrogates', S('a😀b') === 'a?b');
	ok('the cap is 2049 characters, cut between whole escapes', S('水'.repeat(1000)).length <= 2049 &&
		/(\\U\+6C34)+\x85$/.test(S('水'.repeat(1000))));
	// THE ESCAPE ASSERTION CAN FAIL: the same module with its caret rule taken out answers wrong.
	{
		const vm = require('vm');
		const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-dxf.js'), 'utf8');
		const rule = "if (c === 0x5E) { parts.push('^ '); continue; }";
		ok('mutation: the caret rule is in js/lpn-dxf.js to take out', src.indexOf(rule) >= 0);
		const ctx = {}; vm.createContext(ctx);
		vm.runInContext(src.replace(rule, ''), ctx);
		ok('mutation: without it, the caret assertion goes red', ctx.EngCalcs.lpnDxfString('a^b') !== 'a^ b');
	}

	if (process.env.EC_DXF_KEEP) { console.log('  (files kept in ' + tmp + ')'); } else {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
