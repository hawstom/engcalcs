// FILE > EXPORT DXF FILE -- ROADMAP Task 772. Run with:
//   node dev/lpn-spike/dxf-export-harness.js
// Optional independent audit: EC_EZDXF_PYTHON=/path/to/python-with-ezdxf (else `python3` is tried);
// without ezdxf the audit prints NOT RUN and the harness does not fail for it.
//
// What must be true of the file, read back by a small DXF reader written here (not the writer's
// own code), on Net1 (a grid project in feet) and Net3-Novato-CA-World (latitude and longitude):
//   (a) it is R2000 (AC1015) with the units stated in $INSUNITS, every handle unique and below
//       $HANDSEED, and every owner (330) an object that exists;
//   (b) Tom's DXF Interface Manager specification (dev/dxf-interface.md): data only -- links as
//       LWPOLYLINEs, every element an attributed INSERT, no TEXT, MTEXT, LINE or MULTILEADER --
//       on layers C-WATR-MODL- + asset code + "-" + alternative, all in capitals;
//   (c) every attribute's tag is its property label and its value the model's, verbatim;
//   (d) a grid project's coordinates are the file's own, EXACTLY; a geographic project's are UTM
//       metres, so a pipe's drawn length matches its ground length;
//   (e) attributes 1 high at INSERT scale 1; the one STYLE is Standard on txt, and no Arial.
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
	"\t\tdxfFrame: dxfFrame, dxfExportText: dxfExportText, isGeo: isLatLonProject,\n" +
	"\t\tsettings: function () { return settings; }, createScenario: createScenario,\n" +
	"\t\tswitchScenario: switchScenario, baseScenario: baseScenario,\n" +
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
// The text a number was typed as, where the file kept it (rec.tok), else its plain rendering.
function typed(rec, key, v) { const t = rec && rec.tok ? rec.tok[key] : undefined; return typeof t === 'string' && parseFloat(t) === v ? t : numStr(v); }

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

// Tom's browser-pass points on the first cut (2026-10-07), each held here:
//   (3) ALL CAPS: every layer name, block name, attribute tag and prompt, and the read-me.
//   (1) plain ASCII quotes in the read-me; (2) the read-me layer white (ACI 7).
//   (5) attribute height 1, INSERT scale 1.
//   (6) no annotation but the attributed blocks: no TEXT, MTEXT, LINE or MULTILEADER.
//   (11) layers C-WATR-MODL- + asset code + "-" + alternative, the prefix one constant.
//   (12) the STYLE table names no Arial and gives Standard its txt font.
function specChecks(d, label) {
	const ents = d.sections.ENTITIES, tables = d.sections.TABLES, blocks = d.sections.BLOCKS;
	const types = new Set(ents.map(e => e.type));
	ok(label + ': no TEXT, MTEXT, LINE or MULTILEADER entity (data only)',
		!['TEXT', 'MTEXT', 'LINE', 'MULTILEADER', 'MLEADER', 'LEADER'].some(t => types.has(t)), [...types].join(','));
	ok(label + ': entities are only LWPOLYLINE, INSERT, ATTRIB and SEQEND',
		[...types].every(t => ['LWPOLYLINE', 'INSERT', 'ATTRIB', 'SEQEND'].indexOf(t) >= 0), [...types].join(','));
	const layers = tables.filter(e => e.type === 'LAYER');
	const names = layers.map(e => g(e, 2));
	ok(label + ': every layer but 0 is C-WATR-MODL-XXXX-ALT or the read-me layer',
		names.every(n => n === '0' || n === 'C-WATR-RDME' || /^C-WATR-MODL-[A-Z0-9_]{4}-[A-Z0-9_]+$/.test(n)), names.join(' '));
	const rd = layers.find(e => g(e, 2) === 'C-WATR-RDME');
	ok(label + ': the read-me layer is white (62 = 7) and does not plot (290 = 0)', rd && g(rd, 62).trim() === '7' && g(rd, 290).trim() === '0');
	const brNames = tables.filter(e => e.type === 'BLOCK_RECORD').map(e => g(e, 2)).filter(n => n[0] !== '*');
	ok(label + ': every block name is upper case', brNames.length > 0 && brNames.every(n => n === n.toUpperCase()), brNames.join(' '));
	const allTags = ents.filter(e => e.type === 'ATTRIB').map(e => g(e, 2)).concat(blocks.filter(e => e.type === 'ATTDEF').map(e => g(e, 2)));
	ok(label + ': every attribute tag is upper case with no space', allTags.every(t => t === t.toUpperCase() && !/\s/.test(t)));
	const prompts = blocks.filter(e => e.type === 'ATTDEF').map(e => g(e, 3));
	ok(label + ': every prompt is upper case', prompts.every(t => t === t.toUpperCase()), prompts.slice(0, 4).join(' | '));
	const attribs = ents.filter(e => e.type === 'ATTRIB'), attdefs = blocks.filter(e => e.type === 'ATTDEF');
	ok(label + ': every ATTRIB and ATTDEF is 1 high', attribs.length > 0 && attribs.concat(attdefs).every(e => +g(e, 40) === 1));
	const inserts = ents.filter(e => e.type === 'INSERT');
	ok(label + ': every INSERT is at scale 1', inserts.every(e => +g(e, 41) === 1 && +g(e, 42) === 1 && +g(e, 43) === 1));
	ok(label + ': every ATTRIB sits on its INSERT\'s layer; every ATTDEF and block outline on layer 0', (() => {
		let ins = null;
		for (const e of ents) {
			if (e.type === 'INSERT') { ins = e; } else if (e.type === 'ATTRIB' && (!ins || g(e, 8) !== g(ins, 8))) { return false; }
		}
		return blocks.filter(e => ['ATTDEF', 'CIRCLE', 'LWPOLYLINE', 'POINT'].indexOf(e.type) >= 0).every(e => g(e, 8) === '0');
	})());
	const styles = tables.filter(e => e.type === 'STYLE');
	ok(label + ': one STYLE, Standard, on font txt; no Arial anywhere in the file',
		styles.length === 1 && g(styles[0], 2) === 'Standard' && g(styles[0], 3) === 'txt' &&
		!d.pairs.some(p => /arial/i.test(p[1] || '')), styles.map(s => g(s, 2) + '/' + g(s, 3)).join(','));
	const readme = ents.filter(e => e.type === 'ATTRIB' && g(e, 8) === 'C-WATR-RDME').map(e => g(e, 1));
	ok(label + ': the read-me is a block of visible attributes, upper case, in plain ASCII',
		readme.length >= 3 && readme.every(t => t === t.toUpperCase() && !/[\x80-\xff]/.test(t)) &&
		ents.filter(e => e.type === 'ATTRIB' && g(e, 8) === 'C-WATR-RDME').every(e => g(e, 70) === '0'), readme.join(' | '));
	return readme;
}

async function main() {
	setUnitSet('us');
	L.buildLayers();
	L.setCanvas(1400, 700);
	L.markSized();
	const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'lpn-dxf-'));
	const T = { ID: 'ID', ELEV: 'ELEVATION', DEMAND: 'BASE_DEMAND', HEAD: 'HEAD', LEVEL: 'WATER_DEPTH',
		MINLEVEL: 'LOWEST_WATER_DEPTH', MAXLEVEL: 'HIGHEST_WATER_DEPTH', DIAMETER: 'DIAMETER',
		TANKDIAM: 'TANK_DIAMETER', LENGTH: 'LENGTH', ROUGHNESS: 'ROUGHNESS', TAG: 'TAG', DESC: 'DESCRIPTION' };

	console.log('--- Net1: a grid project in feet ---');
	openExample('Net1.lwn');
	// A customer, so the customer layer and its service line are covered too.
	L.addCustomer(30, -75, { link: '10' });
	L.flush();
	const out1 = await exportNow();
	ok('Net1 exports', out1 && out1.ok);
	fs.writeFileSync(path.join(tmp, 'Net1.dxf'), Buffer.from(global.EngCalcs.lpnDxfBytes(out1.text)));
	const d1 = readDxf(out1.text);
	structural(d1, 'Net1');
	const rd1 = specChecks(d1, 'Net1');
	ok('Net1: $INSUNITS is 2 (feet), the project length unit', d1.header.$INSUNITS[0][1].trim() === '2');
	ok('Net1: the layer prefix is one constant, C-WATR-MODL-', global.EngCalcs.lpnDxfModelPrefix === 'C-WATR-MODL-');
	const e1 = entities(d1);
	const snap1 = L.serialize();
	const org1 = snap1.origin || { x: 0, y: 0 };
	const byType = t => snap1.nodes.filter(n => n.type === t);
	const linksOf = t => snap1.links.filter(l => l.type === t);
	const LAY = { pipe: 'C-WATR-MODL-L___-BASE', pump: 'C-WATR-MODL-P___-BASE', valve: 'C-WATR-MODL-V___-BASE',
		junction: 'C-WATR-MODL-J___-BASE', tank: 'C-WATR-MODL-T___-BASE', reservoir: 'C-WATR-MODL-R___-BASE',
		customer: 'C-WATR-MODL-C___-BASE' };
	const layers1 = d1.sections.TABLES.filter(e => e.type === 'LAYER').map(e => g(e, 2));
	Object.keys(LAY).forEach(t => ok('Net1: layer ' + LAY[t] + ' is declared', layers1.indexOf(LAY[t]) >= 0));
	ok('Net1: one polyline and one WATR_PIPE block per pipe (' + linksOf('pipe').length + ')',
		countOn(e1, 'LWPOLYLINE', LAY.pipe) === linksOf('pipe').length &&
		e1.filter(e => e.type === 'INSERT' && e.layer === LAY.pipe && e.block === 'WATR_PIPE').length === linksOf('pipe').length);
	ok('Net1: one polyline and one block per pump (' + linksOf('pump').length + ')',
		countOn(e1, 'LWPOLYLINE', LAY.pump) === linksOf('pump').length && countOn(e1, 'INSERT', LAY.pump) === linksOf('pump').length);
	ok('Net1: no valves, so nothing on the valve layer', countOn(e1, 'LWPOLYLINE', LAY.valve) === 0);
	ok('Net1: one block per junction (' + byType('junction').length + ')', countOn(e1, 'INSERT', LAY.junction) === byType('junction').length);
	ok('Net1: one block per tank and per reservoir',
		countOn(e1, 'INSERT', LAY.tank) === byType('tank').length && countOn(e1, 'INSERT', LAY.reservoir) === byType('reservoir').length);
	ok('Net1: the customer is a block and a two-point service polyline',
		countOn(e1, 'INSERT', LAY.customer) === 1 && countOn(e1, 'LWPOLYLINE', LAY.customer) === 1);

	const polys = e1.filter(e => e.type === 'LWPOLYLINE' && e.layer !== LAY.customer);
	const wantVerts = snap1.links.map(l => (l.verts || []).length + 2);
	ok('Net1: each link polyline has one vertex per end and bend',
		JSON.stringify(polys.map(p => +g(p.ent, 90))) === JSON.stringify(wantVerts));

	// Attribute tags are the property labels, values verbatim.
	let attrBad = [], coordBad = [];
	e1.filter(e => e.type === 'INSERT' && [LAY.junction, LAY.tank, LAY.reservoir].indexOf(e.layer) >= 0).forEach(ins => {
		const n = snap1.nodes.find(x => x.id === ins.attribs.ID);
		if (!n) { attrBad.push('no node ' + ins.attribs.ID); return; }
		const X = parseFloat(g(ins.ent, 10)), Y = parseFloat(g(ins.ent, 20));
		if (X !== n.x + org1.x || Y !== n.y + org1.y) { coordBad.push(n.id); }
		const want = { junction: { [T.ELEV]: n.elev, [T.DEMAND]: n._demand },
			tank: { [T.ELEV]: n.elev, [T.LEVEL]: n._level, [T.MINLEVEL]: n.minLevel, [T.MAXLEVEL]: n.maxLevel, [T.TANKDIAM]: n.tankDiameter },
			reservoir: { [T.HEAD]: n._head } }[n.type];
		Object.keys(want).forEach(t => {
			if (ins.attribs[t] !== numStr(want[t])) { attrBad.push(n.id + '.' + t + '=' + ins.attribs[t] + ' want ' + want[t]); }
		});
		if (!ins.attribEnts.every(a => g(a, 70) === (g(a, 2) === 'ID' ? '0' : '1'))) { attrBad.push(n.id + ': only the ID attribute may be visible'); }
	});
	ok('Net1: every node attribute (ELEVATION, BASE_DEMAND, HEAD, WATER_DEPTH...) equals the model', attrBad.length === 0, attrBad.slice(0, 5).join('; '));
	ok('Net1: every node lands on the file\'s own coordinates, exactly', coordBad.length === 0, coordBad.slice(0, 3).join('; '));
	const pipeBad = [];
	e1.filter(e => e.type === 'INSERT' && e.layer === LAY.pipe).forEach(ins => {
		const l = snap1.links.find(x => x.id === ins.attribs.ID);
		if (!l) { pipeBad.push('no pipe ' + ins.attribs.ID); return; }
		[[T.DIAMETER, '_diameter'], [T.LENGTH, '_length'], [T.ROUGHNESS, '_roughness']].forEach(([t, k]) => {
			const v = typed(l, k, l[k]);
			if (ins.attribs[t] !== v) { pipeBad.push(l.id + '.' + t + '=' + ins.attribs[t] + ' want ' + v); }
		});
		if ('FLOW' in ins.attribs || 'VELOCITY' in ins.attribs) { pipeBad.push(l.id + ' carries a result'); }
	});
	ok('Net1: every pipe block\'s DIAMETER, LENGTH and ROUGHNESS equal the model, and no result rides along', pipeBad.length === 0, pipeBad.slice(0, 4).join('; '));
	const pumpIns = e1.find(e => e.type === 'INSERT' && e.layer === LAY.pump);
	ok('Net1: the pump block carries the pump\'s ID', pumpIns && pumpIns.attribs.ID === linksOf('pump')[0].id);
	ok('Net1: the read-me states the coordinates claim no system, in capitals',
		rd1.indexOf(global.EngCalcs.lpnDxfString(PC.lpn_dxf_note_grid.replace('{unit}', 'ft').toUpperCase())) >= 0, rd1.join(' | '));
	ok('Net1: the read-me names the layer pattern with a real layer', rd1.some(t => t.indexOf(LAY.junction) >= 0));
	ezdxfAudit(path.join(tmp, 'Net1.dxf'), 'Net1');

	console.log('--- layer names follow the project\'s ID prefixes and the scenario on screen ---');
	{
		const st = L.settings();
		const keep = Object.assign({}, st.idPrefixes);
		st.idPrefixes.J = 'jn-'; st.idPrefixes.L = 'PIPE5';
		L.createScenario('Fire flow 2030');
		const ents = entities(readDxf(L.dxfExportText(out1.frame).text));
		const lay = new Set(ents.map(e => e.layer));
		ok('a junction prefix "jn-" gives JN__, a pipe prefix "PIPE5" gives PIPE, and the scenario its name',
			lay.has('C-WATR-MODL-JN__-FIRE_FLOW_2030') && lay.has('C-WATR-MODL-PIPE-FIRE_FLOW_2030'), [...lay].join(' '));
		st.idPrefixes.L = 'JN';
		const lay2 = new Set(entities(readDxf(L.dxfExportText(out1.frame).text)).map(e => e.layer));
		ok('two types that would share a code fall back to the built-in codes', lay2.has('C-WATR-MODL-J___-FIRE_FLOW_2030') &&
			lay2.has('C-WATR-MODL-L___-FIRE_FLOW_2030'), [...lay2].join(' '));
		Object.assign(st.idPrefixes, keep);
		L.switchScenario(L.baseScenario().id);
	}

	console.log('--- pre-review 2026-10-07: D1, the ID is found by property, not by its English tag ---');
	{
		const keepId = PC.lpn_field_id;
		PC.lpn_field_id = 'المعرف';
		const ents = entities(readDxf(L.dxfExportText(out1.frame).text)).filter(e => e.type === 'INSERT' && e.layer !== 'C-WATR-RDME');
		const vis = ents.map(e => e.attribEnts.filter(a => g(a, 70) === '0').map(a => g(a, 2)));
		ok('D1: with the ID label in Arabic, every block still has exactly one visible attribute, the translated ID',
			vis.length > 0 && vis.every(v => v.length === 1 && v[0] === global.EngCalcs.lpnDxfString('المعرف')), JSON.stringify(vis.slice(0, 2)));
		PC.lpn_field_id = keepId;
	}

	console.log('--- D2: scenario names in any script, told apart, never BASE ---');
	{
		const layersOf = () => new Set(entities(readDxf(L.dxfExportText(out1.frame).text)).map(e => e.layer));
		const rdOf = () => Object.values(entities(readDxf(L.dxfExportText(out1.frame).text)).find(e => e.layer === 'C-WATR-RDME').attribs);
		L.createScenario('Пожар');
		const cyr = 'C-WATR-MODL-J___-' + global.EngCalcs.lpnDxfString('ПОЖАР');
		ok('D2: "Пожар" is written on ' + cyr + ', not -BASE', layersOf().has(cyr) && ![...layersOf()].some(n => /-BASE$/.test(n)), [...layersOf()].join(' '));
		ok('D2: ...and the read-me example names that layer', rdOf().some(t => t.indexOf(cyr) >= 0));
		L.createScenario('Débit max');
		ok('D2: "Débit max" keeps its accent (DÉBIT_MAX, one Windows-1252 byte)', layersOf().has('C-WATR-MODL-J___-D\xc9BIT_MAX'), [...layersOf()].join(' '));
		L.createScenario('Fire flow');
		L.createScenario('Fire-flow');
		ok('D2: two names that encode alike are told apart (FIRE_FLOW, then FIRE_FLOW_2)', layersOf().has('C-WATR-MODL-J___-FIRE_FLOW_2'), [...layersOf()].join(' '));
		L.createScenario('!!!');
		ok('D2: a name with nothing left after encoding takes its scenario ID, not BASE',
			[...layersOf()].some(n => /^C-WATR-MODL-J___-S\d+$/.test(n)), [...layersOf()].join(' '));
		L.switchScenario(L.baseScenario().id);
	}

	console.log('--- D3: values as typed, and Base demand the first category ---');
	{
		const n = L.nodeById('10');
		const keep = { d: n._demand, tok: n.tok, extra: n.extraDemands };
		n._demand = 150; n.tok = Object.assign({}, n.tok || {}, { _demand: '150.0' }); n.extraDemands = [{ base: 25 }];
		const ents = entities(readDxf(L.dxfExportText(out1.frame).text));
		const ins = ents.find(e => e.type === 'INSERT' && e.layer === LAY.junction && e.attribs.ID === '10');
		ok('D3: BASE_DEMAND is the first category as typed ("150.0"), not the sum 175', ins.attribs[T.DEMAND] === '150.0', ins.attribs[T.DEMAND]);
		const rd = Object.values(ents.find(e => e.layer === 'C-WATR-RDME').attribs);
		ok('D3: the read-me says one junction has more than one category, in capitals',
			rd.indexOf(global.EngCalcs.lpnDxfString(PC.lpn_dxf_note_categories.replace('{n}', '1').replace('{tag}', 'BASE_DEMAND').toUpperCase())) >= 0, rd.join(' | '));
		n._demand = keep.d; n.tok = keep.tok; if (keep.extra) { n.extraDemands = keep.extra; } else { delete n.extraDemands; }
	}

	console.log('--- minor: Turkish capitals, an upright pump ID ---');
	{
		ok('a Turkish tag is upper-cased in the Turkish locale (DERİNLİĞİ)', global.EngCalcs.lpnDxfTag('derinliği', 'tr') === 'DERİNLİĞİ');
		const keepL = global.document.documentElement.lang, keepLab = PC.lpn_field_tank_level;
		global.document.documentElement.lang = 'tr'; PC.lpn_field_tank_level = 'Su derinliği';
		const ents = entities(readDxf(L.dxfExportText(out1.frame).text));
		ok('...and the export passes the page language through', ents.some(e => e.attribs[global.EngCalcs.lpnDxfString('SU_DERİNLİĞİ')] !== undefined));
		global.document.documentElement.lang = keepL; PC.lpn_field_tank_level = keepLab;
		const d = readDxf(global.EngCalcs.lpnDxfWrite({
			nodes: [], tags: { pump: ['ID'] }, idTags: { pump: 'ID' },
			links: [{ id: 'P1', type: 'pump', pts: [{ x: 10, y: 0 }, { x: 0, y: 0 }], attrs: [{ tag: 'ID', value: 'P1' }] }]
		}));
		const ins = d.sections.ENTITIES.find(e => e.type === 'INSERT'), at = d.sections.ENTITIES.find(e => e.type === 'ATTRIB');
		ok('a pump drawn right to left: its block faces 180, its ID reads at 0, right- and top-justified',
			+g(ins, 50) === 180 && +(g(at, 50) || 0) === 0 && g(at, 72).trim() === '2' && g(at, 74).trim() === '3', [g(ins, 50), g(at, 50), g(at, 72), g(at, 74)].join(','));
	}

	console.log('--- strings the user typed reach the file literally ---');
	{
		const n = L.nodeById('10');
		n._tag = 'a^b 50%%c \\U+0041 \\P 😀';
		n._desc = 'x'.repeat(3000);
		const out = L.dxfExportText(out1.frame), ents = entities(readDxf(out.text));
		const ins = ents.find(e => e.type === 'INSERT' && e.layer === LAY.junction && e.attribs.ID === '10');
		ok('caret, percent, backslash and a non-BMP character are each escaped in an ATTRIB, case kept',
			ins.attribs.TAG === 'a^ b 50%%%%%%c \\U+005CU+0041 \\U+005CP ?', JSON.stringify(ins.attribs.TAG));
		ok('a 3000-character description is cut to 2049 characters ending in three periods',
			ins.attribs[T.DESC].length === 2049 && /x\.\.\.$/.test(ins.attribs[T.DESC]), ins.attribs[T.DESC].length);
		const rds = Object.values((ents.find(e => e.type === 'INSERT' && e.layer === 'C-WATR-RDME') || { attribs: {} }).attribs);
		ok('...and the read-me says one value was shortened',
			rds.indexOf(global.EngCalcs.lpnDxfString(PC.lpn_dxf_note_shortened.replace('{n}', '1').replace('{max}', '2049').toUpperCase())) >= 0,
			rds.join(' | '));
		ok('no string in the file is longer than 2049 characters',
			readDxf(out.text).pairs.every(p => p[1] === undefined || p[1].length <= 2049));
		delete n._tag; delete n._desc;
	}

	console.log('--- Net3-Novato-CA-World: latitude and longitude, to UTM ---');
	openExample('Net3-Novato-CA-World.lwn');
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
	const rd3 = specChecks(d3, 'Net3-World');
	ok('Net3-World: $INSUNITS is 6 (meters)', d3.header.$INSUNITS[0][1].trim() === '6');
	const e3 = entities(d3);
	const snap3 = L.serialize();
	const n3 = t => snap3.nodes.filter(n => n.type === t).length;
	const l3 = t => snap3.links.filter(l => l.type === t).length;
	ok('Net3-World: per-layer counts equal the model (' + l3('pipe') + ' pipes, ' + l3('pump') + ' pumps, ' +
		n3('junction') + ' junctions, ' + n3('tank') + ' tanks, ' + n3('reservoir') + ' reservoirs)',
		countOn(e3, 'LWPOLYLINE', LAY.pipe) === l3('pipe') && countOn(e3, 'INSERT', LAY.pipe) === l3('pipe') &&
		countOn(e3, 'LWPOLYLINE', LAY.pump) === l3('pump') &&
		countOn(e3, 'LWPOLYLINE', LAY.valve) === l3('valve') && countOn(e3, 'INSERT', LAY.valve) === l3('valve') &&
		countOn(e3, 'INSERT', LAY.junction) === n3('junction') &&
		countOn(e3, 'INSERT', LAY.tank) === n3('tank') && countOn(e3, 'INSERT', LAY.reservoir) === n3('reservoir'));
	const polys3 = e3.filter(e => e.type === 'LWPOLYLINE' && e.layer !== LAY.customer);
	ok('Net3-World: each polyline has one vertex per end and bend',
		JSON.stringify(polys3.map(p => +g(p.ent, 90))) === JSON.stringify(snap3.links.map(l => (l.verts || []).length + 2)));
	let bad3 = [];
	e3.filter(e => e.type === 'INSERT' && [LAY.junction, LAY.tank, LAY.reservoir].indexOf(e.layer) >= 0).forEach(ins => {
		const n = snap3.nodes.find(x => x.id === ins.attribs.ID);
		const u = global.window.proj4('EPSG:4326', '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs', [n.x, n.y]);
		const X = parseFloat(g(ins.ent, 10)), Y = parseFloat(g(ins.ent, 20));
		if (Math.abs(X - u[0]) > 1e-6 || Math.abs(Y - u[1]) > 1e-6) { bad3.push(n.id + ' ' + X + ',' + Y + ' vs ' + u); }
	});
	ok('Net3-World: every node is at its UTM 10N position to a micrometre', bad3.length === 0, bad3.slice(0, 3).join('; '));
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
	e3.filter(e => e.type === 'INSERT' && e.layer === LAY.junction).forEach(ins => {
		const n = snap3.nodes.find(x => x.id === ins.attribs.ID);
		if (ins.attribs[T.ELEV] !== numStr(n.elev)) { attr3.push(n.id + ' ELEVATION ' + ins.attribs[T.ELEV]); }
	});
	ok('Net3-World: junction elevations equal the model', attr3.length === 0, attr3.slice(0, 3).join('; '));
	{
		const p204 = e3.find(e => e.type === 'INSERT' && e.layer === LAY.pipe && e.attribs.ID === '204');
		ok('D3: Net3 pipe 204\'s LENGTH is written as the file typed it, "4530."', p204 && p204.attribs[T.LENGTH] === '4530.', p204 && p204.attribs[T.LENGTH]);
		let tokBad = 0, tokSeen = 0;
		e3.filter(e => e.type === 'INSERT' && e.layer === LAY.pipe).forEach(ins => {
			const l = snap3.links.find(x => x.id === ins.attribs.ID);
			[[T.DIAMETER, '_diameter'], [T.LENGTH, '_length'], [T.ROUGHNESS, '_roughness']].forEach(([t, k]) => {
				if (l.tok && l.tok[k]) { tokSeen++; }
				if (ins.attribs[t] !== typed(l, k, l[k])) { tokBad++; }
			});
		});
		ok('D3: every Net3 pipe value is its typed token where the file kept one (' + tokSeen + ' tokens)', tokSeen > 0 && tokBad === 0, tokBad);
	}
	{
		const ci = e3.filter(e => e.type === 'INSERT' && e.layer === LAY.customer),
			cl = e3.filter(e => e.type === 'LWPOLYLINE' && e.layer === LAY.customer);
		const fl = snap3.links.find(l => l.type === 'pipe'),
			a = e3.find(e => e.type === 'INSERT' && e.attribs.ID === fl.from), b = e3.find(e => e.type === 'INSERT' && e.attribs.ID === fl.to);
		const cx = ci.length ? parseFloat(g(ci[0].ent, 10)) : NaN, cy = ci.length ? parseFloat(g(ci[0].ent, 20)) : NaN,
			ax = parseFloat(g(a.ent, 10)), ay = parseFloat(g(a.ent, 20)), bx = parseFloat(g(b.ent, 10)), by = parseFloat(g(b.ent, 20));
		const off = Math.hypot(cx - (ax + bx) / 2, cy - (ay + by) / 2), pipeLen = Math.hypot(bx - ax, by - ay);
		ok('Net3-World: the customer is a block and a service polyline, in UTM metres beside its pipe (' +
			off.toFixed(1) + ' m from mid-pipe)', ci.length === 1 && cl.length === 1 && off < 30 + pipeLen / 2);
	}
	ok('Net3-World: the read-me names the conversion and the zone',
		rd3.some(t => t.indexOf(PC.lpn_dxf_note_geo.split('{crs}')[0].toUpperCase()) === 0 && /\(EPSG:32610\)/.test(t)), rd3.join(' | '));
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
		/(\\U\+6C34)+\.\.\.$/.test(S('水'.repeat(1000))));
	ok('a tag is the label in capitals with underscores for spaces', global.EngCalcs.lpnDxfTag('Base demand') === 'BASE_DEMAND' &&
		global.EngCalcs.lpnDxfTag('Lowest  water depth!') === 'LOWEST_WATER_DEPTH');
	// THE ASSERTIONS CAN FAIL: the same module with a rule taken out answers wrong.
	{
		const vm = require('vm');
		const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-dxf.js'), 'utf8');
		const rule = "if (c === 0x5E) { parts.push('^ '); continue; }";
		ok('mutation: the caret rule is in js/lpn-dxf.js to take out', src.indexOf(rule) >= 0);
		let ctx = {}; vm.createContext(ctx);
		vm.runInContext(src.replace(rule, ''), ctx);
		ok('mutation: without it, the caret assertion goes red', ctx.EngCalcs.lpnDxfString('a^b') !== 'a^ b');
		const font = ".g(3, 'txt')";
		ok('mutation: the Standard font is in js/lpn-dxf.js to take out', src.indexOf(font) >= 0);
		ctx = {}; vm.createContext(ctx);
		vm.runInContext(src.replace(font, ".g(3, '')"), ctx);
		const dm = readDxf(ctx.EngCalcs.lpnDxfWrite({ nodes: [], links: [], tags: {} }));
		ok('mutation: with the font blank, the STYLE assertion goes red', g(dm.sections.TABLES.find(e => e.type === 'STYLE'), 3) !== 'txt');
	}

	if (process.env.EC_DXF_KEEP) { console.log('  (files kept in ' + tmp + ')'); } else {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
