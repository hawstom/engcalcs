// File > Import > GeoJSON network (ROADMAP Task 728, import half): the reader and the builder,
// js/lpn-geojson.js (lpnGeoJsonNetScan / lpnGeoJsonNetGuess / lpnGeoJsonNetBuild). Run with:
//   node dev/lpn-spike/geojson-import-harness.js
// The page half (the menu row, the mapping dialog, the new project, the report) is
// geojson-import-browser-harness.js, in a real Chromium.
//
// WHAT CAN GO WRONG WITHOUT ANYTHING THROWING, and is checked here:
//   * a file of ours that does not come back as the network it was: an ID, a kind, a value, a
//     coordinate's characters, a bend, a pattern, a curve, a custom property or a Shape lost or
//     changed. Proved by writing the imported network out again and comparing the TEXT, byte for
//     byte, on Net1 (placed on the Earth here), Net3 in US units, Net3 in SI units, and Net2 (a
//     State Plane project, whose export is converted to longitude and latitude);
//   * a foreign layer whose mapping is not honoured (a field to the wrong property, a unit not
//     stated, a number rounded or re-rendered);
//   * a line end left unconnected, joined to the wrong point, or joined beyond the tolerance;
//   * a feature dropped, or an ID or value changed, with nothing in the report;
//   * a file in another coordinate system read as if it were longitude and latitude.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + '/';
global.window = global.window || global;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-geojson.js');
global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(DEFS) });
const E = global.EngCalcs;

let fails = 0, checks = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   -- ' + detail));
}
// The lat/lon originals: GeoJSON is longitude and latitude, and no shipped example is lat/lon (Task 826).
const ex = (f) => JSON.parse(fs.readFileSync(ROOT + (fs.existsSync(ROOT + 'dev/water-network-examples/latlon-originals/' + f) ? 'dev/water-network-examples/latlon-originals/' : 'examples/') + f, 'utf8'));
const LETTER = { junction: 'J', reservoir: 'R', tank: 'T', pipe: 'L', pump: 'P', valve: 'V' };
// The page's own custom-property resolver, for a saved document (geoJsonExportOptions()).
const cpOf = (doc) => (el) => ((doc.settings && doc.settings.customProps) || [])
	.filter((d) => String(d.applies || '').split(',').indexOf(LETTER[el.type]) >= 0)
	.map((d) => ({ key: d.key, value: el['_' + d.key] }));
// What the page's docFromGeoJsonNet() keeps of a built network, without the page.
function docOf(net, like) {
	return {
		project: { name: like.project.name, coords: 'geo' }, origin: { x: 0, y: 0 },
		nodes: net.nodes, links: net.links, patterns: net.patterns, curves: net.curves, shapes: net.shapes,
		units: net.units, settings: { method: net.method, customProps: net.customProps }
	};
}
function firstDiff(a, b) {
	const A = a.split('\n'), B = b.split('\n');
	for (let i = 0; i < Math.max(A.length, B.length); i++) {
		if (A[i] !== B[i]) { return 'line ' + i + '\n     was: ' + String(A[i]).slice(0, 300) + '\n     now: ' + String(B[i]).slice(0, 300); }
	}
	return '';
}

// ---- 1. a file of ours comes back as the network it was ------------------------------------------
// `featuresOnly`: a projected project's file says its positions were converted, and the file
// written from the imported (geographic) project rightly says they are as stored; the features
// must still be the same, byte for byte.
function roundTrip(label, doc, opts, featuresOnly) {
	console.log('\n1. ' + label);
	const o = Object.assign({ customProps: cpOf(doc) }, opts || {});
	const a = E.lpnExportGeoJson(doc, o);
	ok('exports', a.ok === true, JSON.stringify(a).slice(0, 200));
	const scan = E.lpnGeoJsonNetScan(a.text);
	ok('the file is recognised as one of ours, so no mapping is asked', scan.ok && scan.ours === true);
	const net = E.lpnGeoJsonNetBuild(scan, {});
	const back = docOf(net, doc);
	const b = E.lpnExportGeoJson(back, { customProps: cpOf(back) });
	const cut = (t) => featuresOnly ? t.slice(t.indexOf('\n"features":')) : t;
	ok(featuresOnly ? 'written out again, every feature is the same, byte for byte' : 'written out again, the file is the same, byte for byte',
		b.ok && cut(a.text) === cut(b.text), b.ok ? firstDiff(cut(a.text), cut(b.text)) : JSON.stringify(b));
	const codes = net.notes.map((n) => n.code);
	ok('the report names only what a GeoJSON file never holds', codes.join() === 'not-in-geojson', codes.join());
	return { a, net, scan };
}

// Net3 on the world, US units: the stored characters, the tank's two elevations, a closed pump.
{
	const w = ex('Net3-Novato-CA-World.lwn');
	const { net } = roundTrip('Net3 on the world, US units', w);
	const byId = {};
	net.nodes.forEach((n) => { byId['N' + n.id] = n; });
	net.links.forEach((l) => { byId['L' + l.id] = l; });
	let same = 0, diff = [];
	w.nodes.forEach((n) => {
		const m = byId['N' + n.id];
		if (m && m.type === n.type && m.x === n.x && m.y === n.y) { same++; } else { diff.push(n.id); }
	});
	ok('every node: same ID, same kind, same longitude and latitude (===)', same === w.nodes.length && net.nodes.length === w.nodes.length, diff.join());
	let lsame = 0; diff = [];
	w.links.forEach((l) => {
		const m = byId['L' + l.id];
		const vs = (l.verts || []).every((v, i) => m && m.verts[i] && m.verts[i].x === v.x && m.verts[i].y === v.y);
		if (m && m.type === l.type && m.from === l.from && m.to === l.to && vs && (m.verts.length === (l.verts || []).length)) { lsame++; } else { diff.push(l.id); }
	});
	ok('every link: same ID, kind, ends and bends', lsame === w.links.length && net.links.length === w.links.length, diff.join());
	const p20 = w.links.find((l) => l.id === '20'), q20 = byId.L20;
	ok('a pipe keeps its length, diameter, roughness and minor loss', q20._length === p20._length && q20._diameter === p20._diameter && q20._roughness === p20._roughness && q20._k === p20._k && q20.lenAuto === false);
	const lake = byId.NLake;
	ok('a reservoir keeps its head and the characters 167.0 it was read as', lake._head === 167 && lake.tok._head === '167.0', JSON.stringify(lake));
	const t3 = byId.N3;
	ok('a tank keeps its levels, diameter and the characters 129.0', t3._level === 29 && t3.minLevel === 4 && t3.maxLevel === 35.5 && t3.tankDiameter === 164 && t3.tok.elev === '129.0' && t3.tok._level === '29.0');
	ok('a tank keeps its custom property as typed', t3._custom_date_installed === '1952-01-01 00:00:00');
	const carry = [...new Set(w.nodes.concat(w.links).filter((e) => e._custom_date_installed).map((e) => LETTER[e.type]))].sort().join();
	ok('the custom property design names the kinds that carry it (' + carry + ')', net.customProps.length === 1 && net.customProps[0].key === 'custom_date_installed' && net.customProps[0].applies.split(',').sort().join() === carry, JSON.stringify(net.customProps));
	ok('the closed pump 10 stays closed, with curve 1 and its points', byId.L10._status === 'closed' && byId.L10._curveId === '1' &&
		JSON.stringify(net.curves.find((c) => c.id === '1').points) === '[[0,104],[2000,92],[4000,63]]');
	const pat1 = net.patterns.find((p) => p.id === '1');
	ok('pattern 1 comes back with its 24 multipliers', pat1 && pat1.multipliers.length === 24 && pat1.multipliers[4] === 0.76, JSON.stringify(pat1));
	ok('the units are the file\'s: gpm, ft, in', net.units.lpn_u_flow === 'gpm' && net.units.lpn_u_length === 'ft' && net.units.lpn_u_diameter === 'in');
}
// The user's characters, a Shape, a bend and the third coordinate of a Shape, on a doctored Net3.
{
	const w = ex('Net3-Novato-CA-World.lwn');
	const j = w.nodes.find((n) => n.id === '15');
	j.x = -122.50; j.tok = { x: '-122.50', elev: '32.00' }; j.elev = 32;
	const p = w.links.find((l) => l.id === '20');
	p.verts = [{ x: -122.5400, y: 38.1200, tok: { x: '-122.5400' } }];
	w.shapes = [{ id: 'Zone1', closed: true, pts: [{ x: -122.6, y: 38.1 }, { x: -122.59, y: 38.1, z: 12.50, tok: { z: '12.50' } }, { x: -122.59, y: 38.11 }], desc: 'Pressure zone', props: { zone: 'A' } }];
	const { net } = roundTrip('Net3 with typed characters, a bend and a Shape', w);
	const n15 = net.nodes.find((n) => n.id === '15'), l20 = net.links.find((l) => l.id === '20');
	ok('the characters -122.50 and 32.00 are kept beside the numbers', n15.x === -122.5 && n15.tok.x === '-122.50' && n15.tok.elev === '32.00', JSON.stringify(n15.tok));
	ok('the bend is a bend, with its characters', l20.verts.length === 1 && l20.verts[0].x === -122.54 && l20.verts[0].tok.x === '-122.5400', JSON.stringify(l20.verts));
	ok('the Shape comes back with its ID, closure, description, property and third number', net.shapes.length === 1 && net.shapes[0].id === 'Zone1' &&
		net.shapes[0].closed === true && net.shapes[0].desc === 'Pressure zone' && net.shapes[0].props.zone === 'A' && net.shapes[0].pts[1].tok.z === '12.50', JSON.stringify(net.shapes[0]));
}
// The SI twin.
{
	const { net } = roundTrip('Net3 on the world, SI units', ex('Net3-Novato-CA-World-SI.lwn'));
	ok('the units are the file\'s: L/s, m, mm', net.units.lpn_u_flow === 'lps' && net.units.lpn_u_length === 'm' && net.units.lpn_u_diameter === 'mm');
}
// Net1 is drawn on a local grid, which a GeoJSON file cannot hold; placed on the Earth first, as
// Map, World map, Attach places it.
{
	const g = ex('Net1.lwn');
	g.project.coords = 'geo';
	g.origin = { x: 0, y: 0 };
	const place = (p) => { p.x = -111.9 + p.x * 1e-5; p.y = 33.4 + p.y * 1e-5; delete p.tok; };
	g.nodes.forEach(place);
	g.links.forEach((l) => (l.verts || []).forEach(place));
	g.labels = [];
	ok('Net1 on its grid is refused by the export (the reason it is placed first)', E.lpnExportGeoJson(ex('Net1.lwn'), {}).error === 'local');
	const { net } = roundTrip('Net1, placed on the Earth', g);
	ok('Net1: 9 junctions, a reservoir, a tank, 12 pipes and a pump', net.counts.junction === 9 && net.counts.reservoir === 1 && net.counts.tank === 1 && net.counts.pipe === 12 && net.counts.pump === 1, JSON.stringify(net.counts));
}
// Net2 is a State Plane project: its export is converted (numbers of ours), and it is those that
// must come back.
async function net2() {
	await new Promise((res) => E.lpnCrsLoad(res));
	const d = ex('Net2-Branford-CT.lwn');
	const { a, net } = roundTrip('Net2, a State Plane project, through its conversion', d, null, true);
	const f = JSON.parse(a.text).features.find((x) => x.properties.name === '1' && x.properties.node_type);
	const n1 = net.nodes.find((n) => n.id === '1');
	ok('a converted position is stored as the file wrote it', n1.x === f.geometry.coordinates[0] && n1.y === f.geometry.coordinates[1]);
}

// ---- 2. a foreign layer, through the mapping ----------------------------------------------------
// A utility's asset layer, hand-written: dev/lpn-spike/fixtures/geojson-utility-layer.geojson.
const FOREIGN = fs.readFileSync(ROOT + 'dev/lpn-spike/fixtures/geojson-utility-layer.geojson', 'utf8');
{
	console.log('\n2. A utility layer, through the mapping step');
	const scan = E.lpnGeoJsonNetScan(FOREIGN);
	ok('read: 4 points, 5 lines, 1 other; not one of ours', scan.ok && !scan.ours && scan.counts.point === 4 && scan.counts.line === 5 && scan.counts.other === 1, JSON.stringify(scan.counts));
	ok('the CRS84 member is the frame RFC 7946 requires, so it is read and named', scan.crsNamed === 'urn:ogc:def:crs:OGC:1.3:CRS84');
	const pf = scan.fields.point.map((f) => f.name + (f.numeric ? '#' : '')).join(), lf = scan.fields.line.map((f) => f.name + (f.numeric ? '#' : '')).join();
	ok('the fields found, in order, numbers told from text ("12.0" is a number)', pf === 'FACILITYID,ELEV_FT#,DEMAND#,OWNER' && lf === 'PIPE_ID,DIAM_MM,C#,MATERIAL,LEN', pf + ' | ' + lf);
	const offered = { lpn_u_elevhead: ['fth2o', 'mh2o'], lpn_u_flow: ['gpm', 'lps'], lpn_u_diameter: ['in', 'mm'], lpn_u_length: ['ft', 'm'], lpn_u_roughness: ['ft', 'mm'] };
	const now = { lpn_u_elevhead: 'mh2o', lpn_u_flow: 'lps', lpn_u_diameter: 'in', lpn_u_length: 'm' };
	const g = E.lpnGeoJsonNetGuess(scan, now, offered);
	ok('guessed by name: FACILITYID the ID, ELEV_FT the elevation, DEMAND the demand, OWNER kept',
		g.point.FACILITYID === 'id' && g.point.ELEV_FT === 'elev' && g.point.DEMAND === 'demand' && g.point.OWNER === 'custom', JSON.stringify(g.point));
	ok('ELEV_FT is guessed in feet from its name; DEMAND takes the project unit', g.units['point:ELEV_FT'] === 'fth2o' && g.units['point:DEMAND'] === 'lps', JSON.stringify(g.units));
	ok('PIPE_ID the ID, C the roughness; DIAM_MM (four numbers and "6 inch") is guessed the diameter, in mm from its name',
		g.line.PIPE_ID === 'id' && g.line.C === 'roughness' && g.line.DIAM_MM === 'diameter' && g.units['line:DIAM_MM'] === 'mm' && g.line.MATERIAL === 'custom', JSON.stringify(g.line));
	// The user's choices: DIAM_MM is the diameter in mm, LEN is not imported.
	g.line.DIAM_MM = 'diameter'; g.line.LEN = 'skip';
	const units = { lpn_u_elevhead: 'fth2o', lpn_u_flow: 'lps', lpn_u_diameter: 'mm', lpn_u_length: 'm' };
	const net = E.lpnGeoJsonNetBuild(scan, { mapping: g, units: units, tolerance: 0.5, prefixes: { J: 'J', L: 'P' },
		defaults: { nodeElev: 0, demand: 0, diameter: 200, roughness: 100, k: 0, tankLevel: 6, tankMinLevel: 0, tankMaxLevel: 9, tankDiameter: 15 }, method: 'hw' });
	const N = {}, L = {};
	net.nodes.forEach((n) => { N[n.id] = n; });
	net.links.forEach((l) => { L[l.id] = l; });
	const note = (c) => net.notes.find((n) => n.code === c);
	ok('HY-1: its position and elevation exactly, with the characters -111.90000 and 1203.50',
		N['HY-1'] && N['HY-1'].x === -111.9 && N['HY-1'].tok.x === '-111.90000' && N['HY-1'].elev === 1203.5 && N['HY-1'].tok.elev === '1203.50', JSON.stringify(N['HY-1']));
	ok('a demand written as text ("12.0") is the number, and keeps its characters', N['HY-1']._demand === 12 && N['HY-1'].tok._demand === '12.0');
	ok('OWNER rides as a custom property, as typed, and its design is labelled with the field name',
		N['HY-1']._custom_OWNER === 'City' && net.customProps.some((d) => d.key === 'custom_OWNER' && d.label === 'OWNER' && d.applies === 'J'));
	ok('the second HY-2 gets an ID of its own, and the report says so', !!note('id-dup') && note('id-dup').ids[0] === 'HY-2 (J1)' && N.J1 && N.J1.elev === 1199, JSON.stringify(note('id-dup')));
	ok('HY-2 (the second) states no demand: the default, named', N.J1._demand === 0 && note('default-demand') && note('default-demand').ids.indexOf('J1') >= 0);
	ok('the point that is not a longitude and latitude is not imported, and is named', !N.BAD && note('skip-position') && note('skip-position').ids.indexOf('BAD') >= 0);
	ok('the polygon is not imported, and is named', note('skip-geometry') && note('skip-geometry').ids.indexOf('ZONE') >= 0);
	ok('M-1: from HY-1 to HY-2, its interior position a bend with its characters',
		L['M-1'] && L['M-1'].from === 'HY-1' && L['M-1'].to === 'HY-2' && L['M-1'].verts.length === 1 && L['M-1'].verts[0].x === -111.895 && L['M-1'].verts[0].tok.x === '-111.89500', JSON.stringify(L['M-1']));
	ok('M-1 ends 0.1 m from HY-2, inside 0.5 m: joined, and the move is named with its distance',
		note('end-moved') && note('end-moved').ids.indexOf('M-1') >= 0 && note('end-moved').detail > 0.05 && note('end-moved').detail < 0.2, JSON.stringify(note('end-moved')));
	ok('M-1: diameter 150.0 mm as typed, C 130', L['M-1']._diameter === 150 && L['M-1'].tok._diameter === '150.0' && L['M-1']._roughness === 130);
	ok('LEN was not imported, as chosen, and the report says so', note('field-skipped') && note('field-skipped').ids.join() === 'LEN' && !('_length' in L['M-1'] && L['M-1'].lenAuto === false));
	ok('no length field: every pipe is Auto, in one line of the report', L['M-1'].lenAuto === true && note('unmapped-length') && !note('length-auto'));
	ok('M-2 ends where no point is: one junction is added there', L['M-2'].from === 'HY-2' && N[L['M-2'].to] && note('junction-added').ids.indexOf(L['M-2'].to) >= 0);
	ok('...and it takes the elevation of HY-2, the other end of its pipe, with its characters, and the report names the source',
		N[L['M-2'].to].elev === 1201.25 && N[L['M-2'].to].tok.elev === '1201.25' && note('elev-taken').ids.indexOf(L['M-2'].to + ' (HY-2)') >= 0, JSON.stringify(note('elev-taken')));
	ok('no pipe has the New assets minor loss: no field fills it, so 0, in one line', net.links.every((l) => l._k === 0) && note('unmapped-k') && note('unmapped-k').ids.length === 0);
	ok('M-3, a multipart line whose parts meet, is one pipe from that junction, with the meeting point a bend',
		L['M-3'] && L['M-3'].from === L['M-2'].to && L['M-3'].verts.length === 1 && L['M-3'].verts[0].x === -111.885, JSON.stringify(L['M-3']));
	ok('M-3 states no roughness: the default 100, named', L['M-3']._roughness === 100 && note('default-roughness').ids.indexOf('M-3') >= 0);
	ok('M-4: "6 inch" is not a number; the default diameter is used and the value is named',
		L['M-4']._diameter === 200 && note('value-unread').ids.some((s) => s.indexOf('M-4 DIAM_MM: 6 inch') === 0) && note('default-diameter').ids.indexOf('M-4') >= 0, JSON.stringify(note('value-unread')));
	ok('M-4 starts on the middle of M-3 but not at its end: a junction, not connected, and named',
		note('end-on-pipe') && note('end-on-pipe').ids.some((s) => s === L['M-4'].from + ' (M-3)'), JSON.stringify(note('end-on-pipe')));
	ok('M-5, whose two parts do not meet, is two pipes, named', L['M-5/1'] === undefined && net.links.filter((l) => /^P\d+$/.test(l.id)).length === 2 && note('parts').ids.join() === 'M-5', JSON.stringify(net.links.map((l) => l.id)));
	ok('the frame the file named is in the report', note('crs-named') && note('crs-named').detail === 'urn:ogc:def:crs:OGC:1.3:CRS84');
	ok('every ID is unique within its kind', new Set(net.nodes.map((n) => n.id)).size === net.nodes.length && new Set(net.links.map((l) => l.id)).size === net.links.length);
	ok('the units are the ones chosen', net.units === units);
	// A tighter tolerance: M-1 no longer reaches HY-2.
	const tight = E.lpnGeoJsonNetBuild(scan, { mapping: g, units: units, tolerance: 0.05, defaults: { nodeElev: 0, demand: 0, diameter: 200, roughness: 100, k: 0 } });
	const m1 = tight.links.find((l) => l.id === 'M-1');
	ok('at 0.05 m, M-1 ends at a junction of its own at the line\'s own position', m1.to !== 'HY-2' && tight.nodes.find((n) => n.id === m1.to).tok.x === '-111.890001');
}
// Nothing mapped at all: every element gets an ID and the defaults, each said once.
{
	const scan = E.lpnGeoJsonNetScan(FOREIGN);
	const none = { point: {}, line: {}, units: {} };
	scan.fields.point.forEach((f) => { none.point[f.name] = 'skip'; });
	scan.fields.line.forEach((f) => { none.line[f.name] = 'skip'; });
	const net = E.lpnGeoJsonNetBuild(scan, { mapping: none, defaults: { nodeElev: 0, demand: 0, diameter: 200, roughness: 100, k: 0 } });
	const codes = net.notes.map((n) => n.code);
	ok('with no field mapped: one line each for the ID, elevation, demand, diameter, roughness, k and length',
		['unmapped-id-point', 'unmapped-id-line', 'unmapped-elev', 'unmapped-demand', 'unmapped-diameter', 'unmapped-roughness', 'unmapped-k', 'unmapped-length'].every((c) => codes.indexOf(c) >= 0) &&
		!codes.some((c) => /^default-(elev|demand|diameter|roughness|k)$/.test(c)), codes.join());
	ok('...and the IDs made here are J and L numbers', net.nodes.every((n) => /^J\d+$/.test(n.id)) && net.links.every((l) => /^L\d+$/.test(l.id)));
}

// A QGIS export (the pre-reviewer's layer): text numbers, nulls, a duplicate name, a reservoir with
// a demand, a 3D point, a multipart line, a line end on the middle of a pipe.
{
	console.log('\n2b. A QGIS layer');
	const scan = E.lpnGeoJsonNetScan(fs.readFileSync(ROOT + 'dev/lpn-spike/fixtures/geojson-qgis-layer.geojson', 'utf8'));
	const offered = { lpn_u_elevhead: ['fth2o', 'mh2o'], lpn_u_flow: ['gpm', 'lps'], lpn_u_diameter: ['in', 'mm'], lpn_u_length: ['ft', 'm'], lpn_u_roughness: ['ft', 'mm'] };
	const g = E.lpnGeoJsonNetGuess(scan, { lpn_u_elevhead: 'fth2o', lpn_u_flow: 'gpm', lpn_u_diameter: 'mm', lpn_u_length: 'ft' }, offered);
	ok('guessed: NAME the ID, ELEV_M the elevation in m, BASEDEM the base demand (one "1,5" among numbers), KIND the node type',
		g.point.NAME === 'id' && g.point.ELEV_M === 'elev' && g.units['point:ELEV_M'] === 'mh2o' && g.point.BASEDEM === 'demand' && g.point.KIND === 'nodeType', JSON.stringify(g.point));
	ok('guessed: PIPE the ID, DIA_IN the diameter in in, LEN_M the length in m, CVAL the roughness',
		g.line.PIPE === 'id' && g.line.DIA_IN === 'diameter' && g.units['line:DIA_IN'] === 'in' && g.line.LEN_M === 'length' && g.units['line:LEN_M'] === 'm' && g.line.CVAL === 'roughness', JSON.stringify(g.line) + JSON.stringify(g.units));
	ok('the Example is the first value stated, never a null', scan.fields.point.find((f) => f.name === 'ELEV_M').sample === '250.75' && scan.fields.line.find((f) => f.name === 'DIA_MM').sample === '');
	const net = E.lpnGeoJsonNetBuild(scan, { mapping: g, units: {}, tolerance: 0.5, defaults: { nodeElev: 0, demand: 0, diameter: 200, roughness: 100, k: 2 } });
	const N = {}, L = {};
	net.nodes.forEach((n) => { N[n.id] = n; });
	net.links.forEach((l) => { L[l.id] = l; });
	const note = (c) => net.notes.find((n) => n.code === c);
	ok('J-A is a reservoir; its demand 3.20 is kept as the custom property custom_BASEDEM, as typed, and named',
		N['J-A'].type === 'reservoir' && N['J-A']._custom_BASEDEM === '3.20' && note('demand-kept') && note('demand-kept').ids.join() === 'J-A' && note('demand-kept').detail === 'custom_BASEDEM' &&
		net.customProps.some((d) => d.key === 'custom_BASEDEM' && d.applies === 'R'), JSON.stringify(note('demand-kept')));
	ok('J-B states a null elevation: it takes the nearest stated one, named with its source', N['J-B'].elev === 248.5 && note('elev-taken').ids.indexOf('J-B (J1)') >= 0, JSON.stringify(note('elev-taken')));
	const added = note('junction-added').ids[0];
	ok('the junction added at P4\'s far end takes the elevation of the node at its other end (J1)', N[added].elev === 248.5 && note('elev-taken').ids.indexOf(added + ' (J1)') >= 0);
	ok('LEN_M 912.30 is P1\'s length, as typed; a blank LEN_M is Auto', L.P1._length === 912.3 && L.P1.tok._length === '912.30' && L.P1.lenAuto === false && L.P2.lenAuto === true);
	ok('the 3D point is named', note('z-ignored') && note('z-ignored').ids.join() === 'J-A');
	ok('every pipe has minor loss 0, as EPANET reads a silent file, not the New assets 2', net.links.every((l) => l._k === 0) && note('unmapped-k'));
	ok('fid is named once among the custom properties although points and lines both carry it', note('field-custom').ids.filter((x) => x === 'fid').length === 1, note('field-custom').ids.join());
	ok('every pipe has an ID field, and so do the points: no unmapped-ID line', !note('unmapped-id-point') && !note('unmapped-id-line'));
}
// The edge cases: a byte order mark, null geometry, a GeometryCollection, a multipoint, positions
// that are not positions, a one-position line, a zero-length line, a multipart line apart.
{
	const scan = E.lpnGeoJsonNetScan(fs.readFileSync(ROOT + 'dev/lpn-spike/fixtures/geojson-edge-cases.geojson', 'utf8'));
	ok('a file starting with a byte order mark is read', scan.ok === true, JSON.stringify(scan).slice(0, 100));
	const g = E.lpnGeoJsonNetGuess(scan, {}, {});
	const net = E.lpnGeoJsonNetBuild(scan, { mapping: g, tolerance: 0.5, defaults: { nodeElev: 0, demand: 0, diameter: 200, roughness: 100, k: 2 } });
	const note = (c) => net.notes.find((n) => n.code === c) || { ids: [] };
	ok('a one-position line: "a line needs at least two positions"', note('skip-short').ids.join() === 'L2');
	ok('no geometry, a GeometryCollection and an empty MultiPolygon: not a point or a line', note('skip-geometry').ids.join() === 'C,D,P', note('skip-geometry').ids.join());
	ok('an empty, an out-of-range and a quoted position are named', note('skip-position').ids.join() === 'F,G,H');
	ok('the zero-length line joins one node to itself and is named', note('skip-loop').ids.join() === 'L3');
	ok('only lines lack a field mapped for the ID... none here: both kinds map ID', !note('unmapped-id-point').code && !note('unmapped-id-line').code);
	const lines = E.lpnGeoJsonNetBuild(scan, { mapping: { point: g.point, line: {}, units: {} }, defaults: { nodeElev: 0 } });
	ok('with no line field chosen as the ID, the report says the pipes, not every element',
		lines.notes.some((n) => n.code === 'unmapped-id-line') && !lines.notes.some((n) => n.code === 'unmapped-id-point'));
}
// No elevation field: every node has the default, said once, and nothing is taken from a neighbour.
{
	const scan = E.lpnGeoJsonNetScan(fs.readFileSync(ROOT + 'dev/lpn-spike/fixtures/geojson-qgis-layer.geojson', 'utf8'));
	const g = E.lpnGeoJsonNetGuess(scan, {}, {});
	g.point.ELEV_M = 'skip';
	const net = E.lpnGeoJsonNetBuild(scan, { mapping: g, defaults: { nodeElev: 7, demand: 0 } });
	const codes = net.notes.map((n) => n.code);
	ok('no elevation field: every node, added ones too, has the default 7, in one line; none taken',
		net.nodes.every((n) => n.elev === 7) && codes.indexOf('unmapped-elev') >= 0 && codes.indexOf('elev-taken') < 0 && codes.indexOf('default-elev-added') < 0, codes.join());
}

// ---- 3. a frame that is not longitude and latitude is refused, never guessed ----------------------
{
	console.log('\n3. A coordinate system other than WGS 84 longitude and latitude');
	const sp = JSON.stringify({ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::2223' } },
		features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [700000, 900000] } }] });
	const r = E.lpnGeoJsonNetScan(sp);
	ok('a State Plane crs member is refused, and named', r.ok === false && r.error === 'crs' && r.detail === 'urn:ogc:def:crs:EPSG::2223', JSON.stringify(r));
	const old = JSON.stringify({ type: 'FeatureCollection', crs: { type: 'EPSG', properties: { code: 26912 } }, features: [] });
	ok('the 2008 EPSG form is refused too, with its code', E.lpnGeoJsonNetScan(old).detail === 'EPSG:26912');
	const ll = JSON.stringify({ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'EPSG:4326' } },
		features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-111.9, 33.4] } }] });
	ok('EPSG:4326 is longitude and latitude and is read', E.lpnGeoJsonNetScan(ll).ok === true);
	['EPSG:4269', 'urn:ogc:def:crs:EPSG::4269', 'urn:ogc:def:crs:EPSG:6.6:4269', 'http://www.opengis.net/def/crs/EPSG/0/4269'].forEach(function (nm) {
		const nad = JSON.stringify({ type: 'FeatureCollection', crs: { type: 'name', properties: { name: nm } },
			features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-111.9, 33.4] } }] });
		const sc = E.lpnGeoJsonNetScan(nad);
		ok('NAD83 as ' + nm + ' is read as WGS 84 and named, not refused', sc.ok === true && sc.nad83Named === nm && !sc.crsNamed, JSON.stringify(sc.error || sc.nad83Named));
	});
	ok('a file with no points or lines is refused as empty', E.lpnGeoJsonNetScan('{"type":"FeatureCollection","features":[]}').error === 'empty');
	ok('text that is not JSON is refused as unreadable', E.lpnGeoJsonNetScan('not json').error === 'unreadable');
}

net2().then(() => {
	console.log('\n' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}).catch((e) => { console.error(e); process.exit(1); });
