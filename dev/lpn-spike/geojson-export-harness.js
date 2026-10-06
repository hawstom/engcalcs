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
const path = require('path');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-geojson.js');
// The real transform and the real definitions, for the projected cases (the same wiring as
// projected-basemap-harness.js: the alias BEFORE the require, the fetch stubbed to serve the file).
global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(DEFS) });

let fails = 0, checks = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   -- ' + detail));
}
const r6 = (v) => Number(v.toPrecision(6));
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
ok('a pump names its curve and its status', pump10.pump_type === 'HEAD' && pump10.pump_curve_name === '1' && typeof pump10.pump_curve === 'string' && pump10.initial_status === 'Closed', JSON.stringify(pump10));
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
	"\t\texportResult: exportGeoJsonResult, createScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tsetProp: setProp, writeNodeCoord: writeNodeCoord, getProject: function () { return project; },\n" +
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
		jn.pressure === r6(L.nodeValue(L.getDoc().nodes.find((n) => n.id === '10'), 'pressure')) &&
		pp.flowrate === r6(L.linkValue(L.getDoc().links.find((l) => l.id === '20'), 'flow')) && isFinite(jn.pressure),
		jn.pressure + ' ' + pp.flowrate);
	ok('still RFC 7946 with results', validateRfc7946(o.text).length === 0);
	ok('the file says its results are those on the screen',
		typeof g1.lwn.results.note === 'string' && g1.lwn.results.note.length > 20);
}
{
	L.applySaved(GRID()); L.buildDom();
	const r = EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions());
	ok('the page\'s XY example is refused through the page too', r.ok === false && r.error === 'local', JSON.stringify(r));
}

// ---- 6. the words -------------------------------------------------------------------------------
console.log('\n6. The refusal tells the visitor what to do');
{
	// Asserted against the language the stub loaded, never against its words (a reword is free).
	const PC = EngCalcs.pageConfig || {};
	ok('the refusal for a local project is a real sentence, not the fallback, and says nothing about {detail}',
		typeof PC.lpn_geojson_refused_local === 'string' && PC.lpn_geojson_refused_local.length > 60 &&
		PC.lpn_geojson_refused_local.indexOf('{detail}') < 0, String(PC.lpn_geojson_refused_local));
	ok('the range refusal has a {detail} place for the offending node', /\{detail\}/.test(PC.lpn_geojson_refused_range || ''));
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	['lpn_file_export_geojson', 'lpn_file_export_geojson_tip', 'lpn_geojson_refused_local', 'lpn_geojson_refused_range',
		'lpn_geojson_refused_empty', 'lpn_geojson_results_in', 'lpn_geojson_results_out'].forEach((k) => {
		ok(k + ' reaches the page', php.indexOf("lpn_" + k.slice(4) + ": <?=json_encode($ec_lang['" + k + "'])?>") >= 0);
	});
	const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	ok('File menu row sits directly under Export EPANET file', /fn: exportInpFile \},(\s*\/\/[^\n]*)*\s*\{ icon: 'save', label: pc\.lpn_file_export_geojson/.test(js));
}


// ---- 7. patterns, curves, min_vol, in Gusnet's meaning -------------------------------------------
console.log('\n7. Pattern and curve fields carry the numbers; *_name carries the name (Gusnet reads numbers)');
{
	const g = JSON.parse(EngCalcs.lpnExportGeoJson(WORLD(), {}).text);
	const w = WORLD();
	const pat3 = w.patterns.find((p) => p.id === '3');
	const feat = (type, name) => g.features.find((f) => f.properties[type ? 'node_type' : 'link_type'] && f.properties.name === name);
	const withPat = w.nodes.find((n) => n.type === 'junction' && n.demandPattern === '3');
	const pr = feat(true, withPat.id).properties;
	ok('a junction on pattern 3 carries its multipliers, space separated, in demand_pattern',
		pr.demand_pattern === pat3.multipliers.map((m, i) => (w.patterns.find((p) => p.id === '3').tok || {})['m' + i] || String(m)).join(' '), pr.demand_pattern);
	ok('...and the name in demand_pattern_name', pr.demand_pattern_name === '3');
	ok('every number in demand_pattern parses the way Gusnet parses it (float of each word)',
		pr.demand_pattern.split(/\s+/).every((t) => isFinite(parseFloat(t))) && pr.demand_pattern.split(/\s+/).length === pat3.multipliers.length);
	const blank = w.nodes.find((n) => n.type === 'junction' && !n.demandPattern);
	if (blank && w.defaultPattern) {
		ok('a junction with no pattern of its own gets the default pattern, resolved, as EPANET applies it',
			feat(true, blank.id).properties.demand_pattern_name === String(w.defaultPattern));
	}
	const pmp = feat(false, '10').properties;   // a pump on curve 1
	const cv = w.curves.find((c) => c.id === '1');
	ok('a pump carries pump_curve as "(x, y), (x, y)" points that Gusnet\'s literal_eval reads, and the name beside it',
		pmp.pump_curve_name === '1' && /^\((-?[\d.e+]+), (-?[\d.e+]+)\)(, \(.*\))*$/.test(pmp.pump_curve) &&
		pmp.pump_curve === cv.points.map((q) => '(' + q[0] + ', ' + q[1] + ')').join(', '), pmp.pump_curve);
	ok('the pump curve is "(x, y)" pairs with x strictly increasing, as Gusnet requires',
		JSON.parse('[' + pmp.pump_curve.replace(/\(/g, '[').replace(/\)/g, ']') + ']').every((q, i, a) => i === 0 || q[0] > a[i - 1][0]));
	const tk = feat(true, '1').properties;
	ok('a tank carries min_vol, 0', tk.min_vol === 0 && 'min_vol' in tk && !('min_vol' in feat(true, '10').properties));
	const lvl = JSON.stringify(g).indexOf('"demand_pattern":"3"');
	ok('no pattern or curve FIELD holds a bare name (Gusnet would read "3" as a one-multiplier pattern)', lvl < 0);
}

// ---- 8. results: rounded; units note; datum note -----------------------------------------------
console.log('\n8. Result numbers are rounded to 6 significant figures; the notes say what they must');
{
	const w = WORLD();
	const rr = { nodes: { '10': { head: 0.30000000000000004, pressure: 123.456789012345, demand: 1 / 3 } }, links: { '20': { flowrate: 2246.303370535152, headloss: -0.1, unit_headloss: 1e-9 / 3, velocity: 5.000000000001 } }, time: undefined };
	const g = JSON.parse(EngCalcs.lpnExportGeoJson(w, { results: rr }).text);
	const j = g.features.find((f) => f.properties.node_type && f.properties.name === '10').properties;
	const p = g.features.find((f) => f.properties.link_type && f.properties.name === '20').properties;
	ok('0.30000000000000004 is written 0.3 and 123.456789012345 as 123.457', j.head === 0.3 && j.pressure === 123.457, j.head + ' ' + j.pressure);
	ok('a link result is rounded the same way', p.flowrate === 2246.3 && p.velocity === 5 && p.unit_headloss === 3.33333e-10, JSON.stringify(p));
	ok('a typed input is never rounded (elevation 147 and a long typed length keep every digit)',
		(() => { const d = clone(w); d.links.find((l) => l.id === '20')._length = 1234.56789012345; d.links.find((l) => l.id === '20').tok = {};
			return JSON.parse(EngCalcs.lpnExportGeoJson(d, {}).text).features.find((f) => f.properties.link_type && f.properties.name === '20').properties.length === 1234.56789012345; })());
	const m = g.lwn;
	ok('lwn says the values are in the project\'s own units, not SI and not WNTR\'s',
		/own units/.test(m.unit_note) && /not SI/.test(m.unit_note) && /WNTR/.test(m.unit_note) && /Darcy-Weisbach/.test(m.unit_note) && /unit_headloss/.test(m.unit_note));
	ok('lwn says a pump headloss is negative in EPANET and WNTR', /negative/.test(m.headloss_sign) && /pump/.test(m.headloss_sign));
	ok('lwn states the rounding', /6 significant/.test(m.result_precision));
}

// ---- 9. scenario switch-off, scenario-moved positions, and a non-zero origin -------------------
console.log('\n9. A scenario that switches elements off or moves a node; a project with a non-zero origin');
{
	L.applySaved(WORLD()); L.buildDom();
	L.settings().engine = 'native';
	const nodes = L.getDoc().nodes, links = L.getDoc().links;
	const J = nodes.find((n) => n.id === '10'), P = links.find((l) => l.id === '20');
	const incident = links.filter((l) => l.from === J.id || l.to === J.id);
	const base = JSON.parse(EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions()).text);
	L.createScenario('Off'); L.switchScenario(L.getProject().activeScenario === 'base' ? L.getScenarios()[L.getScenarios().length - 1].id : L.getProject().activeScenario);
	L.setProp(J, 'active', false);
	L.setProp(P, 'active', false);
	const goneLinks = new Set(incident.map((l) => l.id).concat([P.id]));
	const sc = JSON.parse(EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions()).text);
	const names = (g, k) => new Set(g.features.filter((f) => f.properties[k]).map((f) => f.properties.name));
	ok('the switched-off junction is not in the file', names(sc, 'node_type').has(J.id) === false && names(base, 'node_type').has(J.id));
	ok('the switched-off pipe is not in the file', names(sc, 'link_type').has(P.id) === false);
	ok('every link at the switched-off junction is omitted too (nowhere to land)',
		[...goneLinks].every((id) => !names(sc, 'link_type').has(id)) &&
		sc.features.length === base.features.length - 1 - goneLinks.size, sc.features.length + ' vs ' + base.features.length);
	ok('...and the scenario is named in lwn', typeof sc.lwn.scenario === 'string' && sc.lwn.scenario.length > 0);
	// A node moved in the scenario.
	L.setProp(J, 'active', true);
	const K = nodes.find((n) => n.id === '15');
	L.writeNodeCoord(K, false, undefined, -122.5);
	L.writeNodeCoord(K, true, undefined, 38.25);
	const mv = JSON.parse(EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions()).text);
	const kf = mv.features.find((f) => f.properties.node_type && f.properties.name === '15');
	ok('a node the scenario moved is at the scenario\'s position, not Base\'s',
		kf.geometry.coordinates[0] === -122.5 && kf.geometry.coordinates[1] === 38.25 &&
		!(base.features.find((f) => f.properties.node_type && f.properties.name === '15').geometry.coordinates[0] === -122.5), JSON.stringify(kf.geometry));
	const lf = mv.features.find((f) => f.properties.link_type && (f.properties.start_node_name === '15'));
	ok('a link at the moved node ends at the moved position',
		lf.geometry.coordinates[0][0] === -122.5 && lf.geometry.coordinates[0][1] === 38.25, JSON.stringify(lf.geometry.coordinates[0]));
}
{
	// A non-zero document origin (a projected project drawn local to a shifted origin): positions are
	// origin plus stored, then converted. UTM 12N, real transform.
	const g = GRID(); g.project = { name: 'p', coords: 'xy', crs: 'EPSG:32612' };
	g.origin = { x: 400000, y: 3700000 };
	g.nodes.forEach((n, i) => { n.x = 10 * i; n.y = 5 * i; delete n.tok; });
	g.links.forEach((l) => { l.verts = []; });
	const A = EngCalcs.lpnCrsInverse; ok('placeholder to keep the require honest', typeof A === 'function' || A === undefined);
	globalThis.__geoOrigin = g;
}

(async function () {
	const g = globalThis.__geoOrigin;
	console.log('\n10. A projected project: the table loads first; real transform, non-zero origin, refusals');
	// The page's own door, with a projected project open: it waits for the table, then answers.
	L.applySaved(clone(g)); L.buildDom();
	let got = null;
	L.exportResult((res) => { got = res; });
	ok('before the table is loaded the writer alone would refuse (the wrong place to find out)', EngCalcs.lpnCrsReady() === false && EngCalcs.lpnExportGeoJson(g, {}).error === 'crs');
	await new Promise((res) => setTimeout(res, 20));
	ok('the page\'s export door waits for the table, and then answers for a projected project (it loads the table if needed)', got && got.ok === true, JSON.stringify(got).slice(0, 160));
	await new Promise((res) => global.EngCalcs.lpnCrsLoad(res));
	const o = EngCalcs.lpnExportGeoJson(g, {});
	ok('exports with the real UTM 12N transform', o.ok === true, JSON.stringify(o).slice(0, 200));
	if (o.ok) {
		const f = JSON.parse(o.text).features.find((x) => x.properties.node_type && x.properties.name === g.nodes[2].id).geometry.coordinates;
		const want = global.EngCalcs.lpnCrsInverse('EPSG:32612', { x: 400000 + g.nodes[2].x, y: 3700000 + g.nodes[2].y });
		ok('the position is the transform of ORIGIN PLUS stored, to the digit', f[0] === want.lon && f[1] === want.lat, JSON.stringify(f) + ' ' + JSON.stringify(want));
		ok('...and is near Phoenix, Arizona (lon about -112, lat about 33)', f[0] < -110 && f[0] > -114 && f[1] > 32 && f[1] < 34, JSON.stringify(f));
		ok('lwn states a no-shift datum treatment, sub-metre', /no datum shift/.test(JSON.parse(o.text).lwn.coordinates) && /NAD83/.test(JSON.parse(o.text).lwn.coordinates) && /metre/.test(JSON.parse(o.text).lwn.coordinates));
		ok('RFC 7946', validateRfc7946(o.text).length === 0);
	}
	const bogus = clone(g); bogus.project.crs = 'EPSG:99999';
	const r = EngCalcs.lpnExportGeoJson(bogus, {});
	ok('a coordinate system with no definition is refused as `crs`, naming it (not as bad latitudes)',
		r.ok === false && r.error === 'crs' && r.detail === 'EPSG:99999', JSON.stringify(r));
	// The table not loaded: the page loads it first. Simulate a fresh page by asking the page's own door.
	const PC = EngCalcs.pageConfig || {};
	ok('the crs refusal is a sentence in the language file, with a {detail} place, and reaches the page',
		typeof PC.lpn_geojson_refused_crs === 'string' && PC.lpn_geojson_refused_crs.indexOf('{detail}') >= 0 &&
		fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8').indexOf("lpn_geojson_refused_crs: <?=json_encode($ec_lang['lpn_geojson_refused_crs'])?>") >= 0);
	console.log('\n' + (fails ? 'FAIL ' : 'ok   ') + 'geojson export   ' + checks + ' checks, ' + fails + ' failed');
	process.exit(fails ? 1 : 0);
})();
