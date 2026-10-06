// Copy with headings, and Export to CSV and ODS, on the Tables pane (Tom, 2026-10-06). Run with:
//   node dev/lpn-spike/table-export-harness.js
//
// Tom, 2026-10-06: *"When copying from a Table, it would be nice to be able to copy the headings
// somehow. It might also be nice to Export to CSV and ODS the Tables."*
//
// Driven through the page's own door, the right-click menu, on Net1's junction table. Compared
// against the LIVE table's cells (what the screen shows), not against a second reading of the same
// function. A junction is given a tag with a comma and a quote in it, which is the one name a CSV
// writer gets wrong. The ODS is validated by Python's zipfile (CRC and structure) and parsed back.
'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');
const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const ROOT = path.join(__dirname, '..', '..') + '/';
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

let clipboard = null;
global.navigator.clipboard = { writeText: function (t) { clipboard = t; return { then: function () {} }; } };
// Every download is a Blob handed to URL.createObjectURL; keep each one so a click that makes two
// downloads (which Chrome would drop) is seen.
const downloads = [];
global.URL.createObjectURL = function (b) { downloads.push(b); return 'blob:x'; };
global.URL.revokeObjectURL = function () {};

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunSolve: runSolve, openPane: openPane, paneTableById: paneTableById,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\theadText: paneHeadingText,\n" +
	"\t\tnotice: function () { var n = document.getElementById('lpn_map_notice'); return n ? n.textContent : ''; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const PC = global.EngCalcs.pageConfig;

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function menuEl() {
	return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0];
}
function labelText(b) {
	const first = b.children && b.children[0];
	return (first && first.textContent !== undefined) ? first.textContent : b.textContent;
}
function parseCsv(text) {
	const rows = []; let row = [], f = '', q = false, i = 0;
	for (; i < text.length; i++) {
		const ch = text[i];
		if (q) {
			if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else { q = false; } } else { f += ch; }
		} else if (ch === '"') { q = true; }
		else if (ch === ',') { row.push(f); f = ''; }
		else if (ch === '\r') { /* CRLF */ }
		else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
		else { f += ch; }
	}
	return rows;
}

const PY = `
import zipfile, sys, json
import xml.etree.ElementTree as ET
z = zipfile.ZipFile(sys.argv[1])
bad = z.testzip()
infos = z.infolist()
ns = {'t':'urn:oasis:names:tc:opendocument:xmlns:table:1.0','o':'urn:oasis:names:tc:opendocument:xmlns:office:1.0','x':'urn:oasis:names:tc:opendocument:xmlns:text:1.0'}
root = ET.fromstring(z.read('content.xml'))
rows = []
for r in root.iter('{%(t)s}table-row' % ns):
    row = []
    for c in r:
        vt = c.get('{%(o)s}value-type' % ns)
        txt = ''.join(''.join(p.itertext()) for p in c.findall('x:p', ns))
        row.append([vt, c.get('{%(o)s}value' % ns), txt])
    rows.append(row)
print(json.dumps({'bad': bad, 'first': infos[0].filename, 'firstType': infos[0].compress_type,
  'firstExtra': len(infos[0].extra), 'mime': z.read('mimetype').decode(), 'names': [i.filename for i in infos],
  'manifest': 'content.xml' in z.read('META-INF/manifest.xml').decode(), 'rows': rows}))
`;

(async function () {
	setUnitSet('us');
	L.reset();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	L.applySaved(saved);
	L.buildDom();
	L.runSolve();
	const doc = L.getDoc();
	const junc = doc.nodes.filter((n) => n.type === 'junction');
	const NAME = 'Smith, "Bob" Ln éè';
	junc[1].tag = NAME;
	L.openPane('junctions');
	L.renderTable('junctions');
	const tableEl = byId.lpn_pane_junctions.children.filter((c) => c._tag === 'table')[0];
	const cols = L.tableCols('junctions'), order = L.tableOrder('junctions');
	const cells = L.cells('junctions'), tds = L.tds('junctions');
	const heads = cols.map(L.headText);
	const live = order.map((id) => cols.map((c) => cells[id][c.key].value));
	ok('the junction table has rows and the tag is on screen', order.length >= 9 && live.some((r) => r.indexOf(NAME) >= 0));

	function openMenu(id, k) {
		fire(tableEl, 'mousedown', { target: tds[id][k], button: 2, shiftKey: false, preventDefault() {} });
		fire(tableEl, 'focusin', { target: tds[id][k] });
		fire(tableEl, 'contextmenu', { target: tds[id][k], clientX: 5, clientY: 5, preventDefault() {} });
		return menuEl();
	}
	function pick(menu, text) {
		const b = menu.children.filter((x) => labelText(x) === text)[0];
		if (!b) { return false; }
		fire(b, 'click', {});
		return true;
	}

	async function readOds() {
		const odsBytes = Buffer.from(await downloads[0].arrayBuffer());
		const f = path.join(os.tmpdir(), 'lpn-table-export-' + process.pid + '.ods');
		fs.writeFileSync(f, odsBytes);
		const py = PY;
		const res = JSON.parse(cp.execFileSync('python3', ['-c', py, f]).toString());
		fs.unlinkSync(f);
		return res;
	}

	console.log('--- copy with headings ---');
	const k1 = cols[1].key, k2 = cols[2].key;
	// A rectangle: rows 0-1, columns 1-2, by a press and a shift-extended press.
	fire(tableEl, 'mousedown', { target: tds[order[0]][k1], button: 0, shiftKey: false, preventDefault() {} });
	fire(tableEl, 'focusin', { target: tds[order[0]][k1] });
	fire(tableEl, 'mouseup', {});
	fire(tableEl, 'mousedown', { target: tds[order[1]][k2], button: 0, shiftKey: true, preventDefault() {} });
	fire(tableEl, 'mouseup', {});
	let menu = openMenu(order[1], k2);
	ok('the menu offers Copy with headings', !!menu && menu.children.some((x) => labelText(x) === PC.lpn_pane_copy_heads));
	clipboard = null;
	pick(menu, PC.lpn_pane_copy_heads);
	const expect = [heads[1] + '\t' + heads[2], live[0][1] + '\t' + live[0][2], live[1][1] + '\t' + live[1][2]].join('\n');
	ok('heading row then values, tab separated', clipboard === expect, JSON.stringify(clipboard) + ' vs ' + JSON.stringify(expect));
	ok('the headings carry the unit as the table shows it', /\(.+\)/.test(heads.join('|')), heads.join(' | '));
	clipboard = null;
	menu = openMenu(order[1], k2);
	pick(menu, PC.points_data_copy || 'Copy');
	ok('plain Copy is unchanged: values only', clipboard === [live[0][1] + '\t' + live[0][2], live[1][1] + '\t' + live[1][2]].join('\n'),
		JSON.stringify(clipboard));

	console.log('--- CSV ---');
	downloads.length = 0;
	menu = openMenu(order[0], k1);
	ok('the menu offers both exports', !!menu && [PC.lpn_pane_export_csv, PC.lpn_pane_export_ods].every((t) => menu.children.some((x) => labelText(x) === t)));
	pick(menu, PC.lpn_pane_export_csv);
	ok('one download per click', downloads.length === 1, String(downloads.length));
	const csvBytes = Buffer.from(await downloads[0].arrayBuffer());
	ok('UTF-8 byte order mark first', csvBytes[0] === 0xEF && csvBytes[1] === 0xBB && csvBytes[2] === 0xBF);
	const csvText = csvBytes.toString('utf8').replace(/^﻿/, '');
	ok('CRLF line ends and a closing one', /\r\n$/.test(csvText) && !/[^\r]\n/.test(csvText));
	const parsed = parseCsv(csvText);
	ok('heading row equals the table headings', JSON.stringify(parsed[0]) === JSON.stringify(heads), JSON.stringify(parsed[0]));
	// The stub fills an <input>'s value only for typed cells: a computed result, a yes/no and a
	// pull-down read blank here, where a browser shows 150, a tick and the option's label. Those
	// four columns are held to what the screen shows by name instead.
	const SHOWN_BLANK = { [PC.lpn_field_active]: /^[01]$/, 'Demand (gpm)': /^-?[\d.]+$/, 'Source type': /^None$/, 'Source pattern': /^No pattern$/ };
	const diffs = [];
	parsed.slice(1).forEach((r, i) => r.forEach((t, j) => {
		if (t === live[i][j]) { return; }
		if (live[i][j] === '' && SHOWN_BLANK[heads[j]] && SHOWN_BLANK[heads[j]].test(t)) { return; }
		diffs.push([heads[j], t, live[i][j]]);
	}));
	ok('every body cell equals the displayed cell', diffs.length === 0 && parsed.length === live.length + 1, JSON.stringify(diffs));
	ok('the comma-and-quote name survives', parsed.some((r) => r.indexOf(NAME) >= 0));

	console.log('--- ODS ---');
	downloads.length = 0;
	menu = openMenu(order[0], k1);
	pick(menu, PC.lpn_pane_export_ods);
	ok('one download per click', downloads.length === 1, String(downloads.length));
	const out = await readOds();
	ok('zip CRCs are valid (zipfile.testzip)', out.bad === null, String(out.bad));
	ok('mimetype is the first entry, stored, no extra field', out.first === 'mimetype' && out.firstType === 0 && out.firstExtra === 0);
	ok('mimetype text is the OpenDocument spreadsheet type', out.mime === 'application/vnd.oasis.opendocument.spreadsheet');
	ok('manifest lists content.xml', out.manifest);
	ok('content.xml parses with one row per table row plus the heading', out.rows.length === live.length + 1, String(out.rows.length));
	ok('heading cells match', JSON.stringify(out.rows[0].map((c) => c[2])) === JSON.stringify(heads));
	ok('ODS body text equals the CSV body text', JSON.stringify(out.rows.slice(1).map((r) => r.map((c) => c[2]))) === JSON.stringify(parsed.slice(1)));
	let floats = 0, badFloat = 0;
	out.rows.slice(1).forEach((r) => r.forEach((c) => {
		if (c[0] === 'float') { floats++; if (c[1] !== c[2]) { badFloat++; } }
	}));
	ok('numeric cells are floats holding the exact displayed characters', floats > 20 && badFloat === 0, floats + ' floats, ' + badFloat + ' mismatched');
	const idIdx = cols.map((c) => c.key).indexOf('id');
	ok('the ID column stays text, even when an ID is all digits', out.rows.slice(1).every((r) => r[idIdx][0] === 'string'));

	console.log('--- ODS of the Pipes table: From and To are text ---');
	// A node ID that is all digits with a leading zero: read as a float it would become 7.
	const target = doc.nodes.filter((n) => n.type === 'junction')[2], oldId = target.id;
	const touched = doc.links.filter((l) => l.from === oldId || l.to === oldId);
	target.id = '007';
	doc.links.forEach((l) => { if (l.from === oldId) { l.from = '007'; } if (l.to === oldId) { l.to = '007'; } });
	ok('a pipe ends at node 007', touched.length > 0);
	L.openPane('pipes');
	L.renderTable('pipes');
	const pTable = byId.lpn_pane_pipes.children.filter((c) => c._tag === 'table')[0];
	const pCols = L.tableCols('pipes'), pOrder = L.tableOrder('pipes'), pTds = L.tds('pipes');
	fire(pTable, 'mousedown', { target: pTds[pOrder[0]][pCols[0].key], button: 2, shiftKey: false, preventDefault() {} });
	fire(pTable, 'focusin', { target: pTds[pOrder[0]][pCols[0].key] });
	fire(pTable, 'contextmenu', { target: pTds[pOrder[0]][pCols[0].key], clientX: 5, clientY: 5, preventDefault() {} });
	downloads.length = 0;
	pick(menuEl(), PC.lpn_pane_export_ods);
	const pOut = await readOds();
	const fi = pCols.map((c) => c.key).indexOf('from'), ti = pCols.map((c) => c.key).indexOf('to');
	ok('Pipes has From and To columns', fi >= 0 && ti >= 0);
	const body = pOut.rows.slice(1);
	ok('every From and To cell is a string', body.every((r) => r[fi][0] === 'string' && r[ti][0] === 'string'));
	ok('the leading-zero ID keeps its zeros', body.some((r) => r[fi][2] === '007' || r[ti][2] === '007'));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
})();
