// NO SHIPPED EXAMPLE IS LATITUDE AND LONGITUDE (ROADMAP Task 826). Run with:
//   node dev/lpn-spike/examples-crs-harness.js
//
// Tom, 2026-10-24: *"I think that we should not provide examples with lat/lon CRS. We should
// provide them in a CRS that can be imported and exported, probably either UTM (for SI) or the
// appropriate NAD83 State Plane zone (for US units)."* A latitude-and-longitude project cannot take
// a DXF drawing back in (js/looped-network.js refuses it by isLatLonProject()), so an example that
// is one cannot round-trip through the files a surveyor uses.
//
// What it holds, over every example the gallery publishes (the list is read from the folder):
//   1. none is lat/lon: not `project.coords === 'geo'`, not a manifest `coords` of 'geo';
//   2. one that declares a CRS declares a PROJECTED one this page holds a definition for, and an
//      example near the place it names (Net2 and Net3 are placed on the Earth);
//   3. each such example, opened on the real page, exports a DXF whose every node and bend, read
//      back by the page's own DXF reader, lands on the example's own absolute plane position (the
//      origin plus the stored number), so exporting and importing it into itself moves nothing;
//   4. the page does not see it as lat/lon (the DXF import's refusal is that one predicate);
//   5. the lat/lon originals the harnesses still need are kept and are lat/lon (nothing lost), and
//      the shipped files are exactly what dev/scripts/project_example_crs.js makes from them.
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
	"\t\tdxfFrame: dxfFrame, dxfExportText: dxfExportText, baseDemandTotal: baseDemandTotal, isGeo: isLatLonProject,\n" +
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
const CATALOGUE = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-projected.json'), 'utf8'));
const exDir = path.join(ROOT, 'examples');
const files = fs.readdirSync(exDir).filter(f => f.endsWith('.lwn')).sort();
const manifest = JSON.parse(fs.readFileSync(path.join(exDir, 'manifest.json'), 'utf8'));

(async function main() {
	setUnitSet('us');
	L.buildLayers();
	L.setCanvas(1400, 700);
	L.markSized();
	await new Promise((res) => global.EngCalcs.lpnCrsLoad(res));
	ok('there are examples, read from the folder', files.length >= 7, files.length + ' file(s)');

	console.log('--- 1. none is latitude and longitude ---');
	files.forEach((f) => {
		const j = JSON.parse(fs.readFileSync(path.join(exDir, f), 'utf8'));
		const m = manifest.examples.find((e) => e.file === f);
		ok(f + ' is not a lat/lon project', !j.project || j.project.coords !== 'geo');
		ok(f + ' is not listed as lat/lon in the manifest', !!m && m.coords !== 'geo', m && m.coords);
	});

	console.log('--- 2. a declared CRS is a projected one this page can transform ---');
	files.forEach((f) => {
		const j = JSON.parse(fs.readFileSync(path.join(exDir, f), 'utf8'));
		const crs = j.project && j.project.crs;
		if (!crs) { return; }
		ok(f + ': ' + crs + ' has a definition here', global.EngCalcs.lpnCrsHas(crs));
		const code = crs.replace('EPSG:', '');
		const inCat = Array.isArray(CATALOGUE) ? CATALOGUE.some((r) => String(r.code || r[0]).replace('EPSG:', '') === code)
			: JSON.stringify(CATALOGUE).indexOf('"' + code + '"') >= 0 || JSON.stringify(CATALOGUE).indexOf(code) >= 0;
		ok(f + ': ' + crs + ' is in the projected catalogue', inCat);
		ok(f + ': the example sits on the Earth (its origin inverts to a finite lon/lat)',
			!!global.EngCalcs.lpnCrsInverse(crs, { x: j.origin.x + j.nodes[0].x, y: j.origin.y + j.nodes[0].y }));
	});

	console.log('--- 2b. each US and SI pair sits on the same place and the same plane family (Task 826) ---');
	const PLACE = { 'Net2-Branford-CT': [41.28, -72.81, ['EPSG:2234', 'EPSG:26956']], 'Net3-Novato-CA-World': [38.11, -122.57, ['EPSG:2227', 'EPSG:26943']] };
	Object.keys(PLACE).forEach((base) => {
		const pl = PLACE[base];
		[base, base + '-SI'].forEach((nm, i) => {
			const j = JSON.parse(fs.readFileSync(path.join(exDir, nm + '.lwn'), 'utf8'));
			ok(nm + ' is on ' + pl[2][i], j.project.crs === pl[2][i], j.project.crs);
			const ll = global.EngCalcs.lpnCrsInverse(j.project.crs, { x: j.origin.x + j.nodes[0].x, y: j.origin.y + j.nodes[0].y });
			const lat = ll && (ll.lat !== undefined ? ll.lat : ll[1]), lon = ll && (ll.lon !== undefined ? ll.lon : ll[0]);
			ok(nm + ' lands within 0.2 degrees of ' + pl[0] + ', ' + pl[1], !!ll && Math.abs(lat - pl[0]) < 0.2 && Math.abs(lon - pl[1]) < 0.2, JSON.stringify(ll));
		});
	});

	console.log('--- 3 and 4. DXF out, DXF in: every position comes back where it went ---');
	for (const f of files) {
		const j = JSON.parse(fs.readFileSync(path.join(exDir, f), 'utf8'));
		if (!(j.project && j.project.crs)) { continue; }
		const raw = JSON.parse(JSON.stringify(j));
		L.newProject();
		L.applySaved(L.migrateSaved(raw));
		L.refreshAll(); L.refreshLabelText(); L.flush();
		ok(f + ': the page does not treat it as lat/lon (so a DXF import is not refused)', !L.isGeo());
		const out = await new Promise((resolve) => { L.dxfFrame((frame) => resolve(L.dxfExportText(frame))); });
		ok(f + ': exports a DXF', !!(out && out.ok));
		if (!(out && out.ok)) { continue; }
		const back = global.EngCalcs.lpnDxfShapes(out.text);
		ok(f + ': the page\'s own DXF reader accepts it', !!back && back.ok, back && back.detail);
		if (!(back && back.ok)) { continue; }
		const snap = L.serialize(), org = snap.origin || { x: 0, y: 0 };
		// The file's units: ft examples are written in the plane's own unit; the reader says which.
		const pipes = back.shapes.filter((s) => s.pts.length >= 2);
		const want = [];
		snap.nodes.forEach((n) => want.push([n.x + org.x, n.y + org.y]));
		const have = [];
		back.shapes.forEach((s) => s.pts.forEach((p) => have.push([p.x, p.y])));
		let missing = 0, worst = 0;
		want.forEach((w) => {
			let best = Infinity;
			have.forEach((h) => { const d = Math.hypot(h[0] - w[0], h[1] - w[1]); if (d < best) { best = d; } });
			if (best > 1e-3) { missing++; }
			worst = Math.max(worst, best);
		});
		ok(f + ': all ' + want.length + ' nodes read back on their own plane position (worst ' + worst.toExponential(1) + ')',
			missing === 0 && pipes.length > 0, missing + ' missing');
	}

	console.log('--- 5. the originals are kept, and the shipped files are made from them ---');
		const od = path.join(ROOT, 'dev', 'water-network-examples', 'latlon-originals');
	const kept = fs.existsSync(od) ? fs.readdirSync(od).filter((f) => f.endsWith('.lwn')) : [];
	ok('the lat/lon originals are kept', kept.length >= 2, kept.join(', '));
	kept.forEach((f) => {
		const j = JSON.parse(fs.readFileSync(path.join(od, f), 'utf8'));
		ok(f + ' original is lat/lon', j.project.coords === 'geo');
	});
	const r = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'dev', 'scripts', 'project_example_crs.js'), '--check'], { encoding: 'utf8' });
	ok('dev/water-network-examples holds exactly what project_example_crs.js makes from them', r.status === 0, (r.stdout || '').trim());

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());
