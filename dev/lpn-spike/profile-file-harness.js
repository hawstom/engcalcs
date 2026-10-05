// Task 604 -- reading an EPANET .PRO profile file. Run: node dev/lpn-spike/profile-file-harness.js
//
// The format (Dgraph.pas, per dev/epanet-net-format.md): an identifier line, then one node ID per
// line. A profile here is a stop list with the shortest route between consecutive stops, so the
// listed nodes are the stops. Proves: the parser's edge cases, that loading on Net3 builds the
// expected path, that unknown IDs are REPORTED (listed) and skipped, and that the menu holds the
// row. Unknown IDs silently dropped, or the row missing, fail here.
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
const PR = global.EngCalcs.lpnProfile;
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const b = new TextEncoder().encode(file._text);
		this.result = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };
const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tprofileState: function () { return profileState; }, profilePath: profilePath,\n" +
	"\t\tloadProfileFileText: loadProfileFileText,\n" +
	"\t\tnoticeText: function () { var n = document.getElementById('lpn_map_notice'); return n ? n._text : null; },\n" +
	"\t\tmenuRows: function () { var l = document.getElementById('lpn_menu_list'); return (l.children || []).map(function (c) { return String(c.textContent || ''); }); },\n" +
	"\t\topenMenu: openProfileSavedMenu, closeMenu: closeMenu,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function same(a, b, name) { const x = JSON.stringify(a), y = JSON.stringify(b); ok(name, x === y, x === y ? '' : 'got ' + x + ' want ' + y); }

console.log('\n--- parser ---');
same(PR.parseProfileFile('Id\r\n10\r\n\r\n 101 \r\n'), { identifier: 'Id', ids: ['10', '101'] }, 'CRLF, blank line, padding');
same(PR.parseProfileFile('﻿Id\n10\n'), { identifier: 'Id', ids: ['10'] }, 'BOM and LF');
same(PR.parseProfileFile('10\n101\n'), { identifier: '10', ids: ['101'] }, 'line 1 is always the identifier');
same(PR.parseProfileFile(''), { identifier: '', ids: [] }, 'empty file');

const SAMPLE = fs.readFileSync(path.join(__dirname, 'fixtures', 'Net3-sample.PRO'), 'utf8');
ok('the committed sample is CRLF', SAMPLE.indexOf('\r\n') > 0);
L.importInp({ name: 'Net3.inp', _text: fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8') });

console.log('\n--- loading on Net3 ---');
ok('load succeeds', L.loadProfileFileText(SAMPLE) === true);
const ps = L.profileState();
ok('from, to, waypoints are the listed nodes in order', ps.from === '10' && ps.to === '111' && JSON.stringify(ps.waypoints) === '["101","103","109"]',
	JSON.stringify([ps.from, ps.waypoints, ps.to]));
const p = L.profilePath();
same(p && p.nodes, ['10', '101', '103', '109', '111'], 'the drawn path runs through exactly those nodes');
ok('no missing-IDs sentence when all are found', (L.noticeText() || '').indexOf(PC.lpn_profile_file_missing.split(' {ids}')[0]) < 0, L.noticeText());

console.log('\n--- unknown IDs are reported and skipped ---');
ok('load with two unknown IDs still succeeds',
	L.loadProfileFileText('Mixed\r\n10\r\nZZ9\r\n101\r\n\r\nQQ1\r\n103\r\nZZ9\r\n') === true);
same(L.profilePath().nodes, ['10', '101', '103'], 'the known nodes make the path');
const note = L.noticeText() || '';
ok('the notice lists each unknown ID once', note.indexOf(PC.lpn_profile_file_missing.replace('{ids}', 'ZZ9, QQ1')) >= 0, note);
ok('the notice counts what was used', /3 of 6 nodes/.test(note), note);

console.log('\n--- too few usable nodes ---');
L.loadProfileFileText(SAMPLE);
ok('one usable node is refused', L.loadProfileFileText('X\n10\nZZ9\n') === false);
ok('...and says which ID is missing', /ZZ9/.test(L.noticeText() || ''), L.noticeText());
ok('...and leaves the earlier path alone', L.profileState().to === '111');

console.log('\n--- the menu row ---');
L.openMenu(byId.lpn_pane_tabs);
const rows = L.menuRows();
ok('the Profile tab menu carries the row', rows.some(r => r.indexOf(PC.lpn_profile_open) >= 0), JSON.stringify(rows));
ok('it is the last row', rows[rows.length - 1].indexOf(PC.lpn_profile_open) >= 0);
ok('the panel itself gets no new control', !byId.lpn_profile_form || !(byId.lpn_profile_form.children || []).some(c => /open|import|pick/i.test(c.id || '')));

console.log(fails ? '\nFAILED ' + fails : '\nall passed');
process.exit(fails ? 1 : 0);
