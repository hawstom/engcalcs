// THE DXF NETWORK READER ALONE (ROADMAP Task 772, import slice 1): js/lpn-dxf-read.js, with no page.
//   node dev/lpn-spike/dxf-import-reader-harness.js
// The page half (menu row, units strip, customers, receipt) and the round trip through the page's own
// export are dxf-import-roundtrip-harness.js, in a real Chromium.
//
// What can go wrong without anything throwing, checked here on files written by js/lpn-dxf.js:
//   * a value that does not come back as the characters it went out as (a caret, a backslash, a
//     percent pair, a letter Windows-1252 lacks, the spaces at its ends);
//   * a number that comes back as a number but not as its own text (`4530.`, `220.0`);
//   * a link joined to the wrong node, or to none, with nothing said;
//   * an entity, layer, block or attribute tag dropped without a line naming it.
'use strict';
const path = require('path');
global.window = global;
const ROOT = path.resolve(__dirname, '..', '..') + '/';
require(ROOT + 'js/lpn-dxf.js');
require(ROOT + 'js/lpn-gisread.js');
require(ROOT + 'js/lpn-dxf-read.js');
const E = global.EngCalcs;

let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   -- ' + detail));
}

const KEYS = {
	junction: ['ID', 'ELEV', 'DEMAND', 'TAG', 'DESC'], reservoir: ['ID', 'HEAD', 'TAG', 'DESC'],
	tank: ['ID', 'ELEV', 'BASEELEV', 'LEVEL', 'MINLEVEL', 'MAXLEVEL', 'DIAMETER', 'TAG', 'DESC'],
	pipe: ['ID', 'DIAMETER', 'LENGTH', 'ROUGHNESS', 'TAG', 'DESC'], pump: ['ID', 'TAG', 'DESC'],
	valve: ['ID', 'VALVETYPE', 'DIAMETER', 'SETTING', 'TAG', 'DESC'], customer: ['ID', 'DEMAND', 'COUNT', 'TAG', 'DESC']
};
const TAGS = {
	junction: ['ID', 'ELEVATION', 'BASE_DEMAND', 'TAG', 'DESCRIPTION'], reservoir: ['ID', 'HEAD', 'TAG', 'DESCRIPTION'],
	tank: ['ID', 'ELEVATION', 'BASE_ELEVATION', 'WATER_DEPTH', 'LOWEST_WATER_DEPTH', 'HIGHEST_WATER_DEPTH', 'TANK_DIAMETER', 'TAG', 'DESCRIPTION'],
	pipe: ['ID', 'DIAMETER', 'LENGTH', 'ROUGHNESS', 'TAG', 'DESCRIPTION'], pump: ['ID', 'TAG', 'DESCRIPTION'],
	valve: ['ID', 'VALVE_TYPE', 'DIAMETER', 'SETTING', 'TAG', 'DESCRIPTION'], customer: ['ID', 'BASE_DEMAND', 'NUMBER_OF_SERVICES', 'TAG', 'DESCRIPTION']
};
const PROMPTS = {};
Object.keys(TAGS).forEach((t) => { TAGS[t].forEach((g) => { PROMPTS[t + '.' + g] = g.replace(/_/g, ' '); }); });
PROMPTS['junction.ELEVATION'] = 'ELEVATION (FT)'; PROMPTS['junction.BASE_DEMAND'] = 'BASE DEMAND (GPM)';
PROMPTS['pipe.DIAMETER'] = 'DIAMETER (IN)'; PROMPTS['pipe.LENGTH'] = 'LENGTH (FT)'; PROMPTS['tank.TANK_DIAMETER'] = 'TANK DIAMETER (FT)';
const attrs = (type, vals) => KEYS[type].map((k, i) => ({ tag: TAGS[type][i], value: vals[k] === undefined ? '' : vals[k] }));
function model(over) {
	return Object.assign({
		insunits: 2, measurement: 0, alternative: 'BASE', locale: 'en', idTags: { junction: 'ID', reservoir: 'ID', tank: 'ID', pipe: 'ID', pump: 'ID', valve: 'ID', customer: 'ID' },
		nodes: [
			{ id: 'J1', type: 'junction', x: 0, y: 0, attrs: attrs('junction', { ID: 'J1', ELEV: '710.0', DEMAND: '4530.', TAG: 'a^b', DESC: ' 100%% \\ Ωmega é  ' }) },
			{ id: 'J2', type: 'junction', x: 100, y: 0, attrs: attrs('junction', { ID: 'J2', ELEV: '700', DEMAND: '10' }) },
			{ id: 'J3', type: 'junction', x: 100, y: 100, attrs: attrs('junction', { ID: 'J3', ELEV: '690.50', DEMAND: '0' }) },
			{ id: 'R1', type: 'reservoir', x: -50, y: 0, attrs: attrs('reservoir', { ID: 'R1', HEAD: '167.0' }) },
			{ id: 'T1', type: 'tank', x: 200, y: 100, attrs: attrs('tank', { ID: 'T1', ELEV: '129.0', BASEELEV: '129.0', LEVEL: '29.0', MINLEVEL: '4', MAXLEVEL: '35.5', DIAMETER: '164' }) }
		],
		links: [
			{ id: 'P1', type: 'pipe', pts: [{ x: 0, y: 0 }, { x: 100, y: 0 }], attrs: attrs('pipe', { ID: 'P1', DIAMETER: '12', LENGTH: '2400', ROUGHNESS: '100' }) },
			{ id: 'P2', type: 'pipe', pts: [{ x: 100, y: 0 }, { x: 150, y: 50 }, { x: 100, y: 100 }], attrs: attrs('pipe', { ID: 'P2', DIAMETER: '8.5', LENGTH: '1.5e3', ROUGHNESS: '110' }) },
			{ id: 'PU1', type: 'pump', pts: [{ x: -50, y: 0 }, { x: 0, y: 0 }], attrs: attrs('pump', { ID: 'PU1', TAG: 'booster' }) },
			{ id: 'V1', type: 'valve', pts: [{ x: 100, y: 100 }, { x: 200, y: 100 }], attrs: attrs('valve', { ID: 'V1', VALVETYPE: 'PRV', DIAMETER: '6', SETTING: '45' }) }
		],
		customers: [{ id: 'M1', x: 50, y: 20, from: { x: 50, y: 0 }, attrs: attrs('customer', { ID: 'M1', DEMAND: '12.5', COUNT: '3', DESC: 'School' }) }],
		readme: ['A project', 'Coordinates: the X and Y of this project, in ft.'], tags: TAGS, prompts: PROMPTS
	}, over || {});
}
const OPTS = { keys: KEYS, tags: TAGS };
const read = (t) => E.lpnDxfNetRead(t, OPTS);
// The pump in the model has no curve in a DXF file, which the reader always says; the other checks leave it out.
const codes = (r) => r.notes.map((n) => n.code).filter((c) => c !== 'pump-no-curve');
const note = (r, c) => r.notes.find((n) => n.code === c);

// ---- 1. the file this page writes comes back ------------------------------------------------------
console.log('\n1. a file of ours');
{
	const text = E.lpnDxfWrite(model()), r = read(text);
	ok('it reads', r.ok === true, JSON.stringify(r).slice(0, 200));
	ok('nothing is reported but the pump\'s missing curve: five nodes, four links, one customer', codes(r).length === 0 && note(r, 'pump-no-curve').ids.join() === 'PU1' && r.nodes.length === 5 && r.links.length === 4 && r.customers.length === 1, JSON.stringify(r.notes));
	const N = {}, L = {};
	r.nodes.forEach((n) => { N[n.id] = n; });
	r.links.forEach((l) => { L[l.id] = l; });
	ok('a junction: elevation and demand with the characters typed (4530. stays 4530.)', N.J1.elev === 710 && N.J1.tok.elev === '710.0' && N.J1._demand === 4530 && N.J1.tok._demand === '4530.', JSON.stringify(N.J1));
	ok('...its position with the characters the file wrote them in', N.J2.x === 100 && N.J2.tok.x === '100.0', JSON.stringify(N.J2.tok));
	ok('a tank: all six values, as typed', N.T1.elev === 129 && N.T1.bottomElev === 129 && N.T1._level === 29 && N.T1.minLevel === 4 && N.T1.maxLevel === 35.5 && N.T1.tankDiameter === 164 && N.T1.tok.maxLevel === '35.5');
	ok('a reservoir: the head, and no elevation invented', N.R1._head === 167 && N.R1.tok._head === '167.0' && N.R1.elev === undefined);
	ok('a pipe: ends found by position, diameter, length, roughness', L.P1.from === 'J1' && L.P1.to === 'J2' && L.P1._diameter === 12 && L.P1._length === 2400 && L.P1._roughness === 100 && L.P1.lenAuto === false);
	ok('a number in exponent form keeps its text (1.5e3)', L.P2._length === 1500 && L.P2.tok._length === '1.5e3' && L.P2._diameter === 8.5);
	ok('a bend is kept, with its characters', L.P2.verts.length === 1 && L.P2.verts[0].x === 150 && L.P2.verts[0].tok.x === '150.0');
	ok('a pump: its ends, kind and tag', L.PU1.type === 'pump' && L.PU1.from === 'R1' && L.PU1.to === 'J1' && L.PU1.tag === 'booster');
	ok('a valve: type, diameter and setting', L.V1.type === 'valve' && L.V1.valveType === 'PRV' && L.V1._diameter === 6 && L.V1._setting === 45 && L.V1.from === 'J3' && L.V1.to === 'T1');
	ok('a customer: its block, its service line\'s first point, and its values', r.customers[0].id === 'M1' && r.customers[0].x === 50 && r.customers[0].y === 20 &&
		r.customers[0].from.x === 50 && r.customers[0].from.y === 0 && r.customers[0].demand === 12.5 && r.customers[0].count === 3 && r.customers[0].desc === 'School');
	ok('text comes back as typed: a caret, a percent pair, a backslash, a letter Windows-1252 lacks, and spaces at both ends',
		N.J1.tag === 'a^b' && N.J1.desc === ' 100%% \\ Ωmega é  ', JSON.stringify([N.J1.tag, N.J1.desc]));
	ok('the units are read from the prompts: ft, gpm, in; tank diameter ft; coordinates ft', r.unitText.lpn_u_elevhead === 'FT' && r.unitText.lpn_u_flow === 'GPM' && r.unitText.lpn_u_diameter === 'IN' &&
		r.unitText.lpn_u_length === 'FT' && r.coordUnit === 'ft', JSON.stringify(r.unitText) + ' ' + r.coordUnit);
	ok('the counts', r.counts.junction === 3 && r.counts.reservoir === 1 && r.counts.tank === 1 && r.counts.pipe === 2 && r.counts.pump === 1 && r.counts.valve === 1 && r.counts.customer === 1, JSON.stringify(r.counts));
	const bytes = E.lpnDxfBytes(text), back = E.lpnDxfDecode(bytes), r2 = read(back);
	ok('as BYTES in Windows-1252, decoded by the file\'s own code page, the same values', r2.ok && r2.nodes[0].desc === ' 100%% \\ Ωmega é  ', JSON.stringify(r2.nodes[0] && r2.nodes[0].desc));
}

console.log('\n1b. the coordinate system the read-me states');
{
	const r = read(E.lpnDxfWrite(model({ readme: ['A project', 'Coordinates: WGS 84 / UTM zone 10N (EPSG:32610), in meters, not latitude and longitude.'] })));
	ok('EPSG:32610 is read out of the read-me', r.crsCode === 'EPSG:32610', r.crsCode);
	ok('a read-me that states none leaves it empty (a grid)', read(E.lpnDxfWrite(model())).crsCode === '');
}

// ---- 2. a language this page is not in: the file's own block definitions name the properties ------------
console.log('\n2. tags in another language');
{
	const de = JSON.parse(JSON.stringify(TAGS)), dePrompts = {};
	de.junction = ['KENNUNG', 'GELAENDEHOEHE', 'GRUNDBEDARF', 'KENNZEICHEN', 'BESCHREIBUNG'];
	de.junction.forEach((g, i) => { dePrompts['junction.' + g] = g; });
	const text = E.lpnDxfWrite(model({ tags: de, prompts: dePrompts, idTags: { junction: 'KENNUNG', reservoir: 'ID', tank: 'ID', pipe: 'ID', pump: 'ID', valve: 'ID', customer: 'ID' },
		nodes: model().nodes.map((n) => n.type === 'junction' ? Object.assign({}, n, { attrs: n.attrs.map((a, i) => ({ tag: de.junction[i], value: a.value })) }) : n) }));
	const r = read(text);
	ok('the junctions are read by the file\'s own definitions, none of their tags reported', r.nodes.filter((n) => n.type === 'junction').length === 3 && !note(r, 'tag-unknown'), JSON.stringify(r.notes));
	ok('...with their values', r.nodes[0].elev === 710 && r.nodes[0]._demand === 4530);
}

// ---- 3. everything the reader does not understand is named ----------------------------------------------
console.log('\n3. what is not understood is named');
function addEntities(text, extra) {
	const k = text.indexOf('ENDSEC', text.indexOf('\r\nENTITIES\r\n'));
	return text.slice(0, k - 3) + extra + text.slice(k - 3);
}
const G = (pairs) => pairs.map((p) => String(p[0]).padStart(3, ' ') + '\r\n' + p[1] + '\r\n').join('');
const base = E.lpnDxfWrite(model());
{
	let t = addEntities(base, G([[0, 'LINE'], [5, 'F1'], [8, 'WALLS'], [10, '0.0'], [20, '0.0'], [11, '1.0'], [21, '1.0']]) +
		G([[0, 'TEXT'], [5, 'F2'], [8, 'WALLS'], [10, '0.0'], [20, '0.0'], [40, '1.0'], [1, 'x']]) +
		G([[0, 'CIRCLE'], [5, 'F3'], [8, 'C-WATR-MODL-NODE-BASE'], [10, '0.0'], [20, '0.0'], [40, '2.0']]) +
		G([[0, 'LWPOLYLINE'], [5, 'F4'], [8, 'C-WATR-MODL-NODE-FIRE'], [90, '2'], [70, '0'], [10, '0.0'], [20, '0.0'], [10, '9.0'], [20, '9.0']]) +
		G([[0, 'LWPOLYLINE'], [5, 'F5'], [8, 'C-WATR-MODL-SHAP-BASE'], [90, '2'], [70, '0'], [10, '0.0'], [20, '0.0'], [10, '9.0'], [20, '9.0']]) +
		G([[0, 'LWPOLYLINE'], [5, 'F6'], [8, 'C-WATR-MODL-ZZZZ-BASE'], [90, '2'], [70, '0'], [10, '0.0'], [20, '0.0'], [10, '9.0'], [20, '9.0']]) +
		G([[0, 'LINE'], [5, 'F7'], [67, '1'], [8, 'SHEET'], [10, '0.0'], [20, '0.0'], [11, '1.0'], [21, '1.0']]));
	const r = read(t);
	ok('the network is read whole beside them', r.ok && r.nodes.length === 5 && r.links.length === 4, r.nodes.length + '/' + r.links.length);
	ok('a layer without our prefix: named, with its entity counts', note(r, 'layer-foreign') && note(r, 'layer-foreign').ids.join('|') === 'WALLS (1 LINE, 1 TEXT)', JSON.stringify(note(r, 'layer-foreign')));
	ok('an entity of a kind not read on a layer of ours: named', note(r, 'entity-unread') && note(r, 'entity-unread').ids.join('|') === 'C-WATR-MODL-NODE-BASE (1 CIRCLE)', JSON.stringify(note(r, 'entity-unread')));
	ok('another alternative: reported and not read', note(r, 'alternative') && note(r, 'alternative').ids.join('|') === 'C-WATR-MODL-NODE-FIRE (1 LWPOLYLINE)');
	ok('a Shape layer: reported and not read', note(r, 'shapes') && note(r, 'shapes').ids.join('|') === 'C-WATR-MODL-SHAP-BASE (1 LWPOLYLINE)');
	ok('an unknown asset code: reported', note(r, 'layer-unknown') && note(r, 'layer-unknown').ids.join('|') === 'C-WATR-MODL-ZZZZ-BASE (1 LWPOLYLINE)');
	ok('paper space: counted', note(r, 'paper-space') && note(r, 'paper-space').detail === 1);
	ok('and nothing else', codes(r).sort().join() === 'alternative,entity-unread,layer-foreign,layer-unknown,paper-space,shapes', codes(r).join());
}
{
	// an attribute tag this page does not write, on two blocks
	let t = base.replace(/(  0\r\nSEQEND)/, G([[0, 'ATTRIB'], [5, 'F9'], [8, 'C-WATR-MODL-LINK-BASE'], [10, '0'], [20, '0'], [40, '1'], [1, 'q'], [2, 'FOO_BAR'], [70, '0']]) + '$1');
	const r = read(t);
	ok('an unknown attribute tag: named, with how many blocks carry it; the block still imports', note(r, 'tag-unknown') && note(r, 'tag-unknown').ids.join() === 'FOO_BAR (1)' && r.nodes.length + r.links.length === 9, JSON.stringify(r.notes));
	ok('...and it is the only note', codes(r).length === 1);
}
{
	// a value that is not a number, a blank ID, a repeated ID, an invalid valve type
	const m = model();
	m.nodes[1].attrs = attrs('junction', { ID: 'J2', ELEV: 'abc', DEMAND: '10' });
	m.nodes[2].attrs = attrs('junction', { ID: '', ELEV: '1', DEMAND: '0' });
	m.nodes.push({ id: 'J1', type: 'junction', x: 300, y: 300, attrs: attrs('junction', { ID: 'J1', ELEV: '1', DEMAND: '1' }) });
	m.links[3].attrs = attrs('valve', { ID: 'V1', VALVETYPE: 'XYZ', DIAMETER: '6', SETTING: '45' });
	const r = read(E.lpnDxfWrite(m));
	ok('a value that is not a number: named with the element and the tag, not used', note(r, 'value-unread') && note(r, 'value-unread').ids.indexOf('J2 ELEV: abc') >= 0 && r.nodes.find((n) => n.id === 'J2').elev === undefined, JSON.stringify(note(r, 'value-unread')));
	ok('a blank ID: named with its place; the element is not imported', note(r, 'bad-id') && note(r, 'bad-id').ids[0].indexOf('(blank) at 100.0, 100.0') === 0 && !r.nodes.some((n) => n.x === 100 && n.y === 100), JSON.stringify(note(r, 'bad-id')));
	ok('a repeated ID: named, the first kept', note(r, 'dup-id') && note(r, 'dup-id').ids.join() === 'J1' && r.nodes.filter((n) => n.id === 'J1').length === 1 && r.nodes.find((n) => n.id === 'J1').x === 0);
	ok('an unknown valve type: named, imported as TCV', r.links.find((l) => l.id === 'V1') === undefined || r.links.find((l) => l.id === 'V1').valveType === 'TCV', JSON.stringify(note(r, 'value-unread')));
	ok('links whose end node was not imported are named (P1 ends at nothing? no, J1 is) and V1 starts at the blank-ID node', note(r, 'end-no-node') && note(r, 'end-no-node').ids.indexOf('V1') >= 0 && note(r, 'end-no-node').ids.indexOf('P2') >= 0, JSON.stringify(note(r, 'end-no-node')));
}
{
	// two nodes on one point; a link that starts and ends at the same node; a polyline with no block; a block with no line
	const m = model();
	m.nodes.push({ id: 'J9', type: 'junction', x: 0, y: 0, attrs: attrs('junction', { ID: 'J9', ELEV: '1', DEMAND: '1' }) });
	const r = read(E.lpnDxfWrite(m));
	ok('two nodes on the same point: the links that end there are named, not guessed', note(r, 'end-ambiguous') && note(r, 'end-ambiguous').ids.join() === 'P1,PU1', JSON.stringify(note(r, 'end-ambiguous')));
	const m2 = model();
	m2.links.push({ id: 'LOOP', type: 'pipe', pts: [{ x: 200, y: 100 }, { x: 220, y: 120 }, { x: 200, y: 100 }], attrs: attrs('pipe', { ID: 'LOOP' }) });
	const r2 = read(E.lpnDxfWrite(m2));
	ok('a link that starts and ends at one node: named', note(r2, 'end-loop') && note(r2, 'end-loop').ids.join() === 'LOOP');
	let t = E.lpnDxfWrite(model());
	t = addEntities(t, G([[0, 'LWPOLYLINE'], [5, 'E1'], [8, 'C-WATR-MODL-LINK-BASE'], [90, '2'], [70, '0'], [10, '0.0'], [20, '0.0'], [10, '0.0'], [20, '7.0']]));
	const r3 = read(t);
	ok('a polyline with no block at its middle: named by layer and first point', note(r3, 'link-no-block') && note(r3, 'link-no-block').ids.join() === 'C-WATR-MODL-LINK-BASE at 0.0, 0.0', JSON.stringify(note(r3, 'link-no-block')));
}
{
	const r = read('not a dxf');
	ok('a file that is not a DXF is refused, with a reason', r.ok === false && !!r.detail, JSON.stringify(r));
	ok('a binary DXF is recognised', read('AutoCAD Binary DXF\r\n\x1a\x00xxxxxxxxxxxxxxxx').detail === 'binary');
	const empty = read(E.lpnDxfWrite(model({ nodes: [], links: [], customers: [] })));
	ok('a drawing of ours with no model on it reads as empty, not as an error', empty.ok && empty.nodes.length === 0 && codes(empty).length === 0, JSON.stringify(empty.notes));
}

// ---- 7. round 2: everything the block scheme can hold, and the alternative that is read -----------
console.log('\n7. status, minor loss, initial quality, active, pump curve and speed, head loss formula, alternatives');
{
	const K2 = JSON.parse(JSON.stringify(KEYS)), T2 = JSON.parse(JSON.stringify(TAGS));
	const add = (type, keys, tags) => { const at = K2[type].indexOf('TAG'); K2[type].splice(at, 0, ...keys); T2[type].splice(at, 0, ...tags); };
	add('junction', ['INITQUALITY', 'ACTIVE'], ['INITIAL_QUALITY', 'IS_ACTIVE']);
	add('reservoir', ['INITQUALITY', 'ACTIVE'], ['INITIAL_QUALITY', 'IS_ACTIVE']);
	add('tank', ['INITQUALITY', 'ACTIVE'], ['INITIAL_QUALITY', 'IS_ACTIVE']);
	add('pipe', ['MINORLOSS', 'STATUS', 'ACTIVE'], ['MINOR_LOSS', 'STATUS', 'IS_ACTIVE']);
	add('valve', ['MINORLOSS', 'STATUS', 'ACTIVE'], ['MINOR_LOSS', 'STATUS', 'IS_ACTIVE']);
	add('pump', ['STATUS', 'SPEED', 'CURVE', 'CURVEPOINTS', 'ACTIVE'], ['STATUS', 'RELATIVE_SPEED', 'PUMP_HEAD_CURVE', 'PUMP_HEAD_CURVE_POINTS', 'IS_ACTIVE']);
	const P2 = {};
	Object.keys(T2).forEach((t) => { T2[t].forEach((g) => { P2[t + '.' + g] = g.replace(/_/g, ' '); }); });
	P2['pipe.ROUGHNESS'] = 'ROUGHNESS (MM)'; P2['pipe.DIAMETER'] = 'DIAMETER (IN)'; P2['pipe.LENGTH'] = 'LENGTH (FT)'; P2['junction.ELEVATION'] = 'ELEVATION (FT)'; P2['junction.BASE_DEMAND'] = 'BASE DEMAND (GPM)';
	const at2 = (type, vals) => K2[type].map((k, i) => ({ tag: T2[type][i], value: vals[k] === undefined ? '' : vals[k] }));
	const m = model({ tags: T2, prompts: P2, readme: ['Plant (HW)', 'Head loss formula: DARCY-WEISBACH (DW).'] });
	m.nodes[0].attrs = at2('junction', { ID: 'J1', ELEV: '710.0', DEMAND: '4530.', INITQUALITY: '0.5', ACTIVE: 'YES' });
	m.nodes[1].attrs = at2('junction', { ID: 'J2', ELEV: '700', DEMAND: '10', ACTIVE: 'NO' });
	m.nodes[2].attrs = at2('junction', { ID: 'J3', ELEV: '690', DEMAND: '0' });
	m.nodes[3].attrs = at2('reservoir', { ID: 'R1', HEAD: '167.0', INITQUALITY: '1.25' });
	m.nodes[4].attrs = at2('tank', { ID: 'T1', ELEV: '129', BASEELEV: '129', LEVEL: '29', MINLEVEL: '4', MAXLEVEL: '35', DIAMETER: '164', INITQUALITY: '0' });
	m.links[0].attrs = at2('pipe', { ID: 'P1', DIAMETER: '12', LENGTH: '2400', ROUGHNESS: '0.25', MINORLOSS: '7.50', STATUS: 'CLOSED' });
	m.links[1].attrs = at2('pipe', { ID: 'P2', DIAMETER: '8', LENGTH: '1500', ROUGHNESS: '0.3', MINORLOSS: '0', STATUS: 'CV' });
	m.links[2].attrs = at2('pump', { ID: 'PU1', STATUS: 'OPEN', SPEED: '1.1', CURVE: 'C7', CURVEPOINTS: '0,104. 2000,92 4000,63' });
	m.links[3].attrs = at2('valve', { ID: 'V1', VALVETYPE: 'PRV', DIAMETER: '6', SETTING: '45', MINORLOSS: '2', STATUS: 'BOGUS', ACTIVE: 'NO' });
	const r = E.lpnDxfNetRead(E.lpnDxfWrite(m), { keys: K2, tags: T2 });
	const N = {}, L = {};
	r.nodes.forEach((n) => { N[n.id] = n; });
	r.links.forEach((l) => { L[l.id] = l; });
	ok('initial quality is read, as typed, on a junction, a reservoir and a tank', N.J1._initQuality === 0.5 && N.R1._initQuality === 1.25 && N.T1._initQuality === 0 && N.J1.tok._initQuality === '0.5', JSON.stringify([N.J1, N.R1, N.T1].map((n) => n._initQuality)));
	ok('ACTIVE NO makes an element inactive; YES and blank leave it active', N.J2._active === false && N.J1._active === undefined && N.J3._active === undefined && L.V1._active === false);
	ok('a pipe\'s status and minor loss: CLOSED, CV, and 7.50 as typed', L.P1._status === 'closed' && L.P2._status === 'cv' && L.P1._k === 7.5 && L.P1.tok._k === '7.50' && L.P2._k === 0, JSON.stringify([L.P1, L.P2]));
	ok('a status that is not OPEN, CLOSED or CV (a valve cannot be CV) is named and the link stays open', L.V1._status === 'open' && note(r, 'value-unread') && note(r, 'value-unread').ids.some((t) => /V1 STATUS: BOGUS/.test(t)), JSON.stringify(note(r, 'value-unread')));
	ok('a valve\'s minor loss', L.V1._k === 2);
	ok('a pump: status, speed, curve reference, and the curve with its points and their own text', L.PU1._status === 'open' && L.PU1.speed === 1.1 && L.PU1._curveId === 'C7' &&
		r.curves.length === 1 && r.curves[0].id === 'C7' && r.curves[0].kind === 'head' && JSON.stringify(r.curves[0].points) === '[[0,104],[2000,92],[4000,63]]' && r.curves[0].tok['0y'] === '104.' && r.curves[0].tok['1x'] === undefined, JSON.stringify([L.PU1, r.curves]));
	ok('a pump that states a curve gets no "no curve" note', !note(r, 'pump-no-curve'));
	ok('the head loss formula is the read-me\'s last code in brackets (the project name\'s (HW) is not it)', r.method === 'dw', r.method);
	ok('a Darcy-Weisbach roughness takes its unit from the prompt: ROUGHNESS (MM)', r.unitText.lpn_u_roughness === 'MM', JSON.stringify(r.unitText));
	ok('a read-me with no code gives no method (the page then says Hazen-Williams was assumed)', E.lpnDxfNetRead(E.lpnDxfWrite(model()), OPTS).method === '');
	// a second pump with the same curve ID and different points: first kept, named
	const m2 = model({ tags: T2, prompts: P2 });
	m2.nodes.push({ id: 'J7', type: 'junction', x: 300, y: 0, attrs: at2('junction', { ID: 'J7', ELEV: '1', DEMAND: '1' }) });
	m2.links[2].attrs = at2('pump', { ID: 'PU1', CURVE: 'C7', CURVEPOINTS: '0,100 1000,50' });
	m2.links.push({ id: 'PU2', type: 'pump', pts: [{ x: 200, y: 100 }, { x: 300, y: 0 }], attrs: at2('pump', { ID: 'PU2', CURVE: 'C7', CURVEPOINTS: '0,100 1000,60' }) });
	const r2 = E.lpnDxfNetRead(E.lpnDxfWrite(m2), { keys: K2, tags: T2 });
	ok('a curve ID reused with different points: one curve kept, the second pump named', r2.curves.length === 1 && note(r2, 'curve-differs') && note(r2, 'curve-differs').ids.join() === 'C7 (PU2)', JSON.stringify(note(r2, 'curve-differs')));
}
{
	// which alternative is read
	const base = (alt) => E.lpnDxfWrite(model({ alternative: alt }));
	const shift = (t, from, to) => t.split(from).join(to);
	const only = read(base('MAX_DAY'));
	ok('a drawing with only one alternative, not BASE, is read as a network: the whole of it', only.nodes.length === 5 && only.links.length === 4 && only.customers.length === 1 && only.alternative === 'MAX_DAY', JSON.stringify([only.nodes.length, only.links.length, only.alternative]));
	ok('...and says so (alt-read), with nothing reported as unread', note(only, 'alt-read') && note(only, 'alt-read').detail === 'MAX_DAY' && !note(only, 'alternative'), JSON.stringify(only.notes.map((n) => n.code)));
	const two = shift(base('BASE'), 'C-WATR-MODL-TANK-BASE', 'C-WATR-MODL-TANK-FIRE');
	const r = read(two);
	ok('BASE and another alternative: BASE is read, the other named, no alt-read line', r.alternative === 'BASE' && note(r, 'alternative') && note(r, 'alternative').detail === 'BASE' && !note(r, 'alt-read'), JSON.stringify(r.notes.map((n) => n.code)));
	const three = shift(shift(base('A_ONE'), 'C-WATR-MODL-TANK-A_ONE', 'C-WATR-MODL-TANK-B_TWO'), 'C-WATR-MODL-VALV-A_ONE', 'C-WATR-MODL-VALV-B_TWO');
	const r3 = read(three);
	ok('two alternatives and no BASE: the first in the file is read, the other named', r3.alternative === 'A_ONE' && note(r3, 'alternative') && note(r3, 'alternative').ids.some((t) => /TANK-B_TWO/.test(t)) && note(r3, 'alt-read') && note(r3, 'alt-read').detail === 'A_ONE', JSON.stringify(r3.notes.map((n) => n.code + ':' + n.detail)));
}
{
	// the embedded .inp sections (Tom, 2026-10-30): text on C-WATR-EPANET-INP, in pieces, put back in order
	const lines = [];
	lines.push('[PATTERNS]', ';ID Multipliers', '1 1.0 1.2 0.8 {x} \\n } back\\slash 100%% ^caret é Ωmega');
	for (let i = 0; i < 400; i++) { lines.push('P' + i + '  ' + (i * 0.37).toFixed(3) + ' ' + (i * 1.1).toFixed(2) + ' ;comment ' + i); }
	lines.push('[RULES]', 'RULE 1', 'IF TANK T1 LEVEL ABOVE 20', 'THEN PUMP PU1 STATUS IS CLOSED', 'x'.repeat(5000));
	const text = lines.join('\n') + '\n';
	const dxf = E.lpnDxfWrite(model({ sections: text }));
	const r = read(dxf);
	ok('embedded text comes back whole, in order, through many pieces (braces, backslash, percent pairs, caret, accents, a 5000-character line)', r.sectionsText === text, r.sectionsText.length + ' vs ' + text.length);
	ok('...on the layer C-WATR-EPANET-INP, visible, not plotted, outside the model prefix, and the layer is not reported as foreign or unknown', /\n\s*2\r?\nC-WATR-EPANET-INP\r?\n\s*70\r?\n\s*0\r?\n\s*62\r?\n\s*7\r?\n/.test(dxf) && !r.notes.some((n) => n.code === 'layer-foreign' || n.code === 'layer-unknown'), JSON.stringify(r.notes.map((n) => n.code)));
	// pieces in the wrong order in the file are put back by their markers
	const parts = dxf.split(/\r?\n  0\r?\nMTEXT/);
	const mt = parts.slice(1).map((q, i) => (i === parts.length - 2 ? q.split(/\r?\n  0\r?\nENDSEC/)[0] : q));
	ok('the file holds the text in more than one piece, each MTEXT under the 2049-character limit and each chunk under 250', mt.length >= 4 && mt.every((q) => {
		const g = q.split(/\r?\n/); let tot = 0, big = 0;
		for (let i = 0; i + 1 < g.length; i++) { const c = g[i].trim(); if (c === '1' || c === '3') { tot += g[i + 1].length; big = Math.max(big, g[i + 1].length); } }
		return tot > 0 ? tot <= 2049 && big <= 250 : true;
	}), String(mt.length));
	const flipped = [parts[0]].concat(mt.slice().reverse().map((q, i, a) => q)).join('\n  0\nMTEXT');
	const r2 = read(flipped + '\n  0\nENDSEC\n  0\nEOF\n');
	ok('...and pieces written in another order are read in the order their markers give', r2.ok && r2.sectionsText === text, r2.ok ? r2.sectionsText.length + ' vs ' + text.length : JSON.stringify(r2));
	ok('a file with no such layer has no sectionsText, and imports as before', read(E.lpnDxfWrite(model())).sectionsText === '');
}

console.log('\ndxf-import-reader-harness: ' + (checks - fails) + '/' + checks + ' checks passed');
process.exit(fails ? 1 : 0);
