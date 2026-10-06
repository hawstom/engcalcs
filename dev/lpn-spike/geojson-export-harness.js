// File > Export GeoJSON file (ROADMAP Task 728, export half). Run with:
//   node dev/lpn-spike/geojson-export-harness.js
//
// WHAT CAN GO WRONG WITHOUT ANYTHING THROWING, and is checked here:
//   * a position written in the wrong order (lat, lon), or rounded, or converted -- every coordinate
//     of the shipped geographic Net3 is compared with the project's own number with `===`;
//   * a pipe's vertices dropped, so a bent main draws as a chord in QGIS;
//   * the user's own characters (`-122.50`) turned into the plain rendering of the number;
//   * a project that is not on the Earth written anyway, with a made-up system;
//   * results written for a network nobody solved, or left out of one that was;
//   * a file that is not RFC 7946 (a `crs` member, a Polygon, a position out of range). The RFC's
//     mechanical rules are checked by validateRfc7946() below, written from the RFC, not from the
//     writer: https://www.rfc-editor.org/rfc/rfc7946 sections 3.1 to 3.3 and 4.
// The page half runs the real page against the real example: serializeProject() and the real
// results of a real solve are what the writer is handed.

const fs = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet } = stub;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-geojson.js');

let fails = 0, checks = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   -- ' + detail));
}
const clone = (o) => JSON.parse(JSON.stringify(o));
const WORLD = () => JSON.parse(fs.readFileSync(ROOT + 'examples/Net3-Novato-CA-World.lwn', 'utf8'));
const GRID = () => JSON.parse(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));

// ---- RFC 7946, the rules a program can check ---------------------------------------------------
function validateRfc7946(text) {
	const errs = [];
	let g;
	try { g = JSON.parse(text); } catch (e) { return ['not JSON: ' + e.message]; }   // RFC 8259 numbers
	if (g.type !== 'FeatureCollection') { errs.push('top-level type is ' + g.type); }
	if (!Array.isArray(g.features)) { errs.push('features is not an array'); return errs; }
	if ('crs' in g) { errs.push('crs member present (removed by RFC 7946 section 4)'); }
	const pos = (p, where) => {
		if (!Array.isArray(p) || p.length < 2 || p.length > 3) { errs.push(where + ': position has ' + (p && p.length) + ' elements'); return; }
		if (!p.every((v) => typeof v === 'number' && isFinite(v))) { errs.push(where + ': non-numeric position'); }
		if (p[0] < -180 || p[0] > 180) { errs.push(where + ': longitude ' + p[0] + ' out of range'); }
		if (p[1] < -90 || p[1] > 90) { errs.push(where + ': latitude ' + p[1] + ' out of range'); }
	};
	g.features.forEach((f, i) => {
		const w = 'feature ' + i;
		if (f.type !== 'Feature') { errs.push(w + ': type ' + f.type); }
		if (!('geometry' in f) || !('properties' in f)) { errs.push(w + ': geometry and properties members are required'); }
		if ('crs' in f) { errs.push(w + ': crs'); }
		const geo = f.geometry;
		if (!geo) { return; }
		if (geo.type === 'Point') { pos(geo.coordinates, w); }
		else if (geo.type === 'LineString') {
			if (!Array.isArray(geo.coordinates) || geo.coordinates.length < 2) { errs.push(w + ': LineString needs two positions'); }
			else { geo.coordinates.forEach((p, k) => pos(p, w + '[' + k + ']')); }
		} else { errs.push(w + ': geometry type ' + geo.type + ' is not one this writer may produce'); }
		if (f.properties !== null && (typeof f.properties !== 'object' || Array.isArray(f.properties))) { errs.push(w + ': properties not an object'); }
	});
	return errs;
}

// ---- 1. the shipped geographic Net3, straight through the writer ------------------------------
console.log('\n1. Net3 on the world: counts, positions to the last digit, RFC 7946');
const world = WORLD();
let out = EngCalcs.lpnExportGeoJson(world, {});
ok('exports', out.ok === true, JSON.stringify(out));
const gj = JSON.parse(out.text);
const byKey = {};
gj.features.forEach((f) => { byKey[(f.properties.node_type ? 'N:' : 'L:') + f.properties.name] = f; });
const nodeCount = world.nodes.length, linkCount = world.links.length;
ok('one feature per node and per link (' + nodeCount + ' + ' + linkCount + ')', gj.features.length === nodeCount + linkCount, gj.features.length);
const cnt = (t) => world.nodes.filter((n) => n.type === t).length;
ok('junctions, reservoirs and tanks are Points; counts match',
	['junction', 'reservoir', 'tank'].every((t) => out.counts[t] === cnt(t) &&
		gj.features.filter((f) => f.geometry.type === 'Point' && f.properties.node_type === t[0].toUpperCase() + t.slice(1)).length === cnt(t)));
const lc = (t) => world.links.filter((l) => l.type === t).length;
ok('pipes, pumps and valves are LineStrings; counts match',
	['pipe', 'pump', 'valve'].every((t) => out.counts[t] === lc(t) &&
		gj.features.filter((f) => f.geometry.type === 'LineString' && f.properties.link_type === t[0].toUpperCase() + t.slice(1)).length === lc(t)));
ok('every node position is [longitude, latitude] and equals the project\'s number exactly',
	world.nodes.every((n) => { const c = byKey['N:' + n.id].geometry.coordinates; return c[0] === n.x && c[1] === n.y; }));
ok('Novato is at longitude about -122 and latitude about 38 (not swapped)',
	gj.features[0].geometry.coordinates[0] < -100 && gj.features[0].geometry.coordinates[1] > 30);
ok('a pipe runs from its start node to its end node',
	world.links.every((l) => {
		const c = byKey['L:' + l.id].geometry.coordinates, a = world.nodes.find((n) => n.id === l.from), b = world.nodes.find((n) => n.id === l.to);
		return c.length === 2 + l.verts.length && c[0][0] === a.x && c[0][1] === a.y && c[c.length - 1][0] === b.x && c[c.length - 1][1] === b.y;
	}));
ok('start_node_name and end_node_name name the ends',
	world.links.every((l) => byKey['L:' + l.id].properties.start_node_name === l.from && byKey['L:' + l.id].properties.end_node_name === l.to));
const rfc = validateRfc7946(out.text);
ok('RFC 7946 mechanical rules: no violations', rfc.length === 0, rfc.slice(0, 3).join(' | '));
ok('no crs member, no Polygon anywhere', !/"crs"/.test(out.text) && !/Polygon/.test(out.text));

// ---- 2. properties and units -------------------------------------------------------------------
console.log('\n2. Properties carry values in the project\'s units, and name them');
const U = world.units;
const j10 = byKey['N:10'].properties, tank = byKey['N:1'].properties, pipe20 = byKey['L:20'].properties, pump10 = byKey['L:10'].properties;
ok('a junction carries elevation and base_demand with unit names',
	j10.elevation === 147 && j10.units.elevation === U.lpn_u_elevhead && j10.base_demand === 0 && j10.units.base_demand === U.lpn_u_flow, JSON.stringify(j10));
ok('a tank carries its levels, and its diameter in the LENGTH unit (not the pipe diameter unit)',
	tank.min_level === 0.1 && tank.max_level === 32.1 && tank.tank_diameter === 85 &&
	tank.units.tank_diameter === U.lpn_u_length && tank.units.tank_diameter !== U.lpn_u_diameter, JSON.stringify(tank));
ok('a reservoir carries base_head', byKey['N:River'].properties.base_head === 220 && byKey['N:River'].properties.units.base_head === U.lpn_u_elevhead);
ok('a pipe carries length, diameter, roughness, minor_loss, status',
	pipe20.length === 99 && pipe20.diameter === 99 && pipe20.roughness === 199 && pipe20.minor_loss === 0 && pipe20.initial_status === 'Open' &&
	pipe20.units.length === U.lpn_u_length && pipe20.units.diameter === U.lpn_u_diameter, JSON.stringify(pipe20));
ok('Hazen-Williams roughness has no unit; the file says the formula',
	!('roughness' in pipe20.units) && gj.lwn.headloss_formula === 'H-W');
ok('a pump names its curve and its status', pump10.pump_type === 'HEAD' && pump10.pump_curve === '1' && pump10.initial_status === 'Closed', JSON.stringify(pump10));
ok('the collection states every unit name', JSON.stringify(gj.lwn.units) === JSON.stringify(U));

// ---- 3. the user's own characters, and vertices ------------------------------------------------
console.log('\n3. Typed characters survive; vertices are carried');
{
	const d = clone(world);
	const n0 = d.nodes[0];
	n0.x = -122.5; n0.tok = { x: '-122.50' };   // the user typed -122.50
	n0.y = 38.1; n0.tok.y = '38.10';
	n0.elev = 147; n0.tok.elev = '147.0';
	const t1 = d.nodes.find((n) => n.id === '1'); t1.minLevel = 0.1; t1.tok = { minLevel: '.1' };   // not legal JSON text
	const pl = d.links.find((l) => l.type === 'pipe');
	pl.verts = [{ x: -122.55, y: 38.11, tok: { x: '-122.550' } }, { x: -122.56, y: 38.115 }];
	const o = EngCalcs.lpnExportGeoJson(d, {});
	ok('exports', o.ok === true);
	ok('the typed text -122.50 is in the file as typed', /\[-122\.50,38\.10\]/.test(o.text), o.text.slice(0, 400));
	ok('...and the file still parses to the same number', JSON.parse(o.text).features.find((f) => f.properties.name === n0.id && f.properties.node_type).geometry.coordinates[0] === -122.5);
	ok('typed elevation 147.0 is written as 147.0', new RegExp('"elevation":147\\.0[,}]').test(o.text.split('\n').find((l) => l.indexOf('"name":"' + n0.id + '"') >= 0 && l.indexOf('"Point"') >= 0) || ''));
	ok('a token that is not legal JSON (.1) falls back to 0.1, the same value', /"min_level":0\.1[,}]/.test(o.text) && !/"min_level":\.1/.test(o.text));
	const f = JSON.parse(o.text).features.find((x) => x.properties.link_type && x.properties.name === pl.id);
	const A = d.nodes.find((n) => n.id === pl.from), B = d.nodes.find((n) => n.id === pl.to);
	ok('a pipe with two vertices is a LineString of four positions, in order',
		f.geometry.coordinates.length === 4 &&
		f.geometry.coordinates[1][0] === -122.55 && f.geometry.coordinates[1][1] === 38.11 &&
		f.geometry.coordinates[2][0] === -122.56 && f.geometry.coordinates[2][1] === 38.115 &&
		f.geometry.coordinates[0][0] === A.x && f.geometry.coordinates[3][1] === B.y, JSON.stringify(f.geometry));
	ok('a vertex keeps its typed text (-122.550)', o.text.indexOf('[-122.550,38.11]') >= 0);
	ok('still RFC 7946', validateRfc7946(o.text).length === 0);
}

// ---- 4. refusals --------------------------------------------------------------------------------
console.log('\n4. A project with no place on the Earth is refused, with a reason; so is nonsense');
{
	const r = EngCalcs.lpnExportGeoJson(GRID(), {});
	ok('a local (XY) project is refused as `local`', r.ok === false && r.error === 'local', JSON.stringify(r));
	ok('...and no file text is produced', r.text === undefined);
	const bad = clone(world); bad.nodes[3].y = 4000;
	const r2 = EngCalcs.lpnExportGeoJson(bad, {});
	ok('a geographic project holding a latitude of 4000 is refused as `range`, naming the node',
		r2.ok === false && r2.error === 'range' && r2.detail.indexOf(bad.nodes[3].id) === 0, JSON.stringify(r2));
	const empty = clone(world); empty.nodes = []; empty.links = [];
	ok('an empty network is refused as `empty`', EngCalcs.lpnExportGeoJson(empty, {}).error === 'empty');
	// A projected project: the writer converts through the page's own transform and says so.
	const proj = clone(GRID()); proj.project = { name: 'p', coords: 'xy', crs: 'EPSG:26910' };
	const stubInv = (code, xy) => ({ lon: -122 + xy.x / 1e6, lat: 38 + xy.y / 1e6 });
	const r3 = EngCalcs.lpnExportGeoJson(proj, { crsInverse: stubInv });
	ok('a projected project with a transform exports, converted, and the file says so',
		r3.ok === true && /Converted from EPSG:26910/.test(JSON.parse(r3.text).lwn.coordinates) && validateRfc7946(r3.text).length === 0, JSON.stringify(r3).slice(0, 200));
	const r4 = EngCalcs.lpnExportGeoJson(proj, { crsInverse: () => null });
	ok('...and one the transform cannot place is refused', r4.ok === false && r4.error === 'range');
}

// ---- 5. the page: the real example, the real solve, the real options ---------------------------
console.log('\n5. The page hands the writer the scenario, the custom properties and the results on screen');
setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, runSolve: runSolve,\n" +
	"\t\tserialize: serializeProject, geoOptions: geoJsonExportOptions, settings: function () { return settings; },\n" +
	"\t\tgetDoc: function () { return doc; }, toDisplay: toDisplay, unitKey: unitKey,\n" +
	"\t\tnodeValue: colorNodeValue, linkValue: colorLinkValue\n"
);
L.buildLayers();
{
	L.applySaved(WORLD()); L.buildDom();
	L.settings().engine = 'native';
	let o = EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions());
	ok('before a solve: exports, with no results, and says so',
		o.ok && o.hasResults === false && JSON.parse(o.text).lwn.results.included === false &&
		JSON.parse(o.text).features.every((f) => f.properties.has_results === false && !('pressure' in f.properties) && !('flowrate' in f.properties)));
	const g0 = JSON.parse(o.text);
	ok('a custom property designed on the project is in the file as typed text',
		g0.features.some((f) => f.properties.custom_date_installed === '1971-01-01 00:00:00'));
	L.runSolve();
	o = EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions());
	const g1 = JSON.parse(o.text);
	ok('after a solve: results are included and the file says so', o.hasResults === true && g1.lwn.results.included === true);
	const jn = g1.features.find((f) => f.properties.node_type === 'Junction' && f.properties.name === '10').properties;
	const pp = g1.features.find((f) => f.properties.link_type === 'Pipe' && f.properties.name === '20').properties;
	ok('a junction has head, pressure and demand with unit names',
		typeof jn.head === 'number' && typeof jn.pressure === 'number' && jn.units.pressure === L.unitKey('lpn_u_pressure') && jn.units.head === L.unitKey('lpn_u_elevhead') && jn.has_results === true, JSON.stringify(jn));
	ok('a pipe has flowrate, headloss, unit_headloss and velocity with unit names',
		['flowrate', 'headloss', 'unit_headloss', 'velocity'].every((k) => typeof pp[k] === 'number') &&
		pp.units.flowrate === L.unitKey('lpn_u_flow') && pp.units.velocity === L.unitKey('lpn_u_velocity'), JSON.stringify(pp));
	ok('the written pressure and flow are the map colouring\'s own values (the screen\'s), exactly',
		jn.pressure === L.nodeValue(L.getDoc().nodes.find((n) => n.id === '10'), 'pressure') &&
		pp.flowrate === L.linkValue(L.getDoc().links.find((l) => l.id === '20'), 'flow') && isFinite(jn.pressure),
		jn.pressure + ' ' + pp.flowrate);
	ok('still RFC 7946 with results', validateRfc7946(o.text).length === 0);
	ok('the file says its results are those on the screen',
		/on the screen/.test(g1.lwn.results.note));
}
{
	L.applySaved(GRID()); L.buildDom();
	const r = EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions());
	ok('the page\'s XY example is refused through the page too', r.ok === false && r.error === 'local', JSON.stringify(r));
}

// ---- 6. the words -------------------------------------------------------------------------------
console.log('\n6. The refusal tells the visitor what to do');
{
	const en = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
	const m = /\$ec_lang\['lpn_geojson_refused_local'\]='([^']*)'/.exec(en);
	ok('the English refusal says why (longitude and latitude only) and what to do (Georeference first)',
		m && /longitude and latitude only/.test(m[1]) && /Georeference/.test(m[1]), m && m[1]);
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	['lpn_file_export_geojson', 'lpn_file_export_geojson_tip', 'lpn_geojson_refused_local', 'lpn_geojson_refused_range',
		'lpn_geojson_refused_empty', 'lpn_geojson_results_in', 'lpn_geojson_results_out'].forEach((k) => {
		ok(k + ' reaches the page', php.indexOf("lpn_" + k.slice(4) + ": <?=json_encode($ec_lang['" + k + "'])?>") >= 0);
	});
	const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	ok('File menu row sits directly under Export EPANET file', /fn: exportInpFile \},(\s*\/\/[^\n]*)*\s*\{ icon: 'save', label: pc\.lpn_file_export_geojson/.test(js));
}

console.log('\n' + (fails ? 'FAIL ' : 'ok   ') + 'geojson export   ' + checks + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
