// FILE, CONVERT AS... -- ROADMAP Task 696, which absorbed Tasks 688 (units) and 693 (the label).
//
//   node dev/lpn-spike/convert-as-harness.js
//
// Tom's shape, 2026-09-22/23: *"(a) Project and units (maybe this one menu row as 'Convert as...'
// can handle both units and coordinates), (b) step 1 (if CRS changed), (c) step 2 (if CRS
// changed)."* And the defect that started it: for a lat/lon project the wizard *"exits with the
// message 'This project is already on lat/lon'"*.
//
// What this holds, in the order the brief states it:
//   1. The menu row exists exactly once.
//   2. A units-only conversion makes a NEW project whose numbers AND recorded units are converted,
//      with the chosen rounding applied, and the original project is untouched byte for byte.
//   3. A lat/lon project can start the wizard, which opens already answered, and a conversion to an
//      EPSG plane converts every coordinate through the real proj4 definitions.
//   4. A project with an attached world map opens the steps answered FROM THAT ATTACHMENT.
//   5. Cancel in the steps closes the copy and returns to the untouched original.
//
// The real proj4 and the real definitions are loaded, as projected-basemap-harness.js does: the
// arithmetic of a conversion is the thing under test, so stubbing the transform would test nothing.

const path = require('path');
const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));
require(path.join(ROOT, 'js', 'lpn-georef.js'));
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
const CATALOGUE = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-projected.json'), 'utf8'));
global.fetch = (url) => Promise.resolve({
	ok: true, status: 200,
	json: () => Promise.resolve(/epsg-projected/.test(String(url)) ? CATALOGUE : DEFS)
});
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () { };
global.prompt = global.window.prompt = function () { return null; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tscenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, serialize: serializeProject,\n" +
	"\t\tnewProject: newProject, saveToStorage: saveToStorage,\n" +
	"\t\tlibrary: function () { return library; }, unitKey: unitKey,\n" +
	"\t\topenFileMenu: openFileMenu, openConvertAsBox: openConvertAsBox,\n" +
	"\t\tconvasAnswers: convasAnswers, runConvertAs: runConvertAs, coordKind: projectCoordKind,\n" +
	"\t\tgeoref: function () { return georef; }, georefAttach: georefAttach,\n" +
	"\t\tgeorefFinish: georefFinish, georefCancel: georefCancel,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, applyView: applyView, currentView: currentView,\n" +
	"\t\tsetBackdrop: function (b) { backdrop = b; buildBackdropImg(); }, getBackdrop: function () { return backdrop; },\n" +
	"\t\tlayerTransforms: function () { return [modelLayer.getAttribute('transform'), backdropLayer.getAttribute('transform')]; },\n" +
	"\t\tnotice: function () { return harnessNotice; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, ",
	null,
	// A spy on the one notice seam, so the harness can read what the page said.
	function (src) {
		return src.replace('\tfunction setNotice(text) {',
			'\tvar harnessNotice = \'\';\n\tfunction setNotice(text) { harnessNotice = text;');
	}
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const PC = global.EngCalcs.pageConfig || {};
const lib = L.library();
function walk(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}
function stored(id) {
	const raw = global.localStorage.getItem('lpn_project_' + id);
	return raw ? JSON.parse(raw) : null;
}
// The stored document minus the one field a save is allowed to move by itself.
function bytes(id) { const s = stored(id); if (!s) { return null; } delete s.view; return JSON.stringify(s); }
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const SI = { lpn_u_length: 'm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o', lpn_u_diameter: 'mm',
	lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_age: 'hr',
	lpn_u_roughness: 'mm' };
function sameUnits() {
	const u = {};
	Object.keys(SI).forEach((k) => { u[k] = L.unitKey(k); });
	return u;
}
const ready = () => new Promise((res) => global.EngCalcs.lpnCrsLoad(res));

(async function main() {
	setUnitSet('us');

	console.log('\n--- 1. one row on the File menu ---');
	{
		const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
		L.newProject(null, '');
		L.openFileMenu(document.createElement('div'));
		// Top-level rows only: a row's own label span carries the same words as the row.
		const rows = (document.getElementById('lpn_menu_list').children || []).map((e) => String(e.textContent || ''));
		const hits = rows.filter((t) => t.indexOf(String(PC.lpn_file_convert_as)) >= 0).length;
		ok('File, Convert as... is on the menu exactly once', hits === 1, hits + ' rows');
		ok('...and the page source builds it in one place, with no row left for the old wording',
			src.split('label: pc.lpn_file_convert_as ||').length === 2 && src.indexOf('lpn_file_import_geo') < 0);
	}

	console.log('\n--- 2. units only: a new project, converted and rounded, the original untouched ---');
	{
		L.newProject(null, '');
		const R = L.addNode('reservoir', 0, 0);
		const A = L.addNode('junction', 1000, -500);
		const B = L.addNode('junction', 2000, -500);
		R._head = 250.4; R.elev = 250; A.elev = 100; B.elev = 90;
		A._demand = 120; B._demand = 80;
		const p1 = L.addLink('pipe', R.id, A.id), p2 = L.addLink('pipe', A.id, B.id);
		p1._diameter = 8; p2._diameter = 6; p1._length = 1000; p2._length = 1200;
		L.saveToStorage();
		const origId = lib.openId, before = bytes(origId), name0 = L.getProject().name;

		L.openConvertAsBox();
		ok('the box opens', byId.lpn_convas_panel.style.display === 'block');
		ok('...on this project\'s own case: not georeferenced', byId.lpn_convas_kind_none.checked === true);
		const a0 = L.convasAnswers();
		ok('...and on this project\'s own units', a0.units.lpn_u_length === 'ft' && a0.units.lpn_u_flow === 'gpm',
			JSON.stringify(a0.units));
		ok('...with no rounding chosen', Object.keys(a0.rounding).every((k) => a0.rounding[k] === ''));

		L.runConvertAs({ kind: 'none', crs: '', units: SI,
			rounding: { diameter: '1', depth: '', flow: '0.1', head: '0.01' } });
		const d = L.getDoc();
		ok('a NEW project is on screen', lib.openId !== origId);
		ok('...named after the one it came from', L.getProject().name ===
			String(PC.lpn_copy_of).replace('{name}', name0), L.getProject().name);
		ok('...with its recorded units converted', L.unitKey('lpn_u_length') === 'm' &&
			L.unitKey('lpn_u_flow') === 'lps' && L.unitKey('lpn_u_diameter') === 'mm');
		const n = (id) => d.nodes.filter((x) => x.id === id)[0];
		const l = (id) => d.links.filter((x) => x.id === id)[0];
		ok('diameter converted and rounded to the nearest 1', l(p1.id)._diameter === 203 && l(p2.id)._diameter === 152,
			l(p1.id)._diameter + ', ' + l(p2.id)._diameter);
		ok('demand converted and rounded to the nearest 0.1', n(A.id)._demand === 7.6 && n(B.id)._demand === 5,
			n(A.id)._demand + ', ' + n(B.id)._demand);
		ok('reservoir head converted and rounded to the nearest 0.01', n(R.id)._head === 76.32, n(R.id)._head);
		ok('elevation converted (it is not one of the four rounded fields)', near(n(A.id).elev, 30.48, 1e-9), n(A.id).elev);
		ok('pipe length converted', near(l(p2.id)._length, 365.76, 1e-9), l(p2.id)._length);
		// A local grid's coordinates are in its length unit (Task 693), so they rescale with it.
		ok('the grid coordinates rescale with the length unit',
			near(L.outwardX(n(A.id).x), 304.8, 1e-9) && near(L.outwardX(n(B.id).x), 609.6, 1e-9),
			L.outwardX(n(A.id).x) + ', ' + L.outwardX(n(B.id).x));
		ok('...and the copy is stored with those units', stored(lib.openId).units.lpn_u_length === 'm');
		ok('THE ORIGINAL PROJECT IS UNTOUCHED, byte for byte', bytes(origId) === before);
		ok('...and still in its own units', stored(origId).units.lpn_u_length === 'ft');
		ok('the page says so', L.notice() === String(PC.lpn_convas_done).replace('{name}', L.getProject().name),
			L.notice());
	}

	await ready();

	console.log('\n--- 3. lat/lon: the wizard starts, answered, and converts to an EPSG plane ---');
	{
		L.newProject('geo', '');
		const A = L.addNode('junction', -111.9, -35.4);
		const B = L.addNode('junction', -111.89, -35.41);
		const C = L.addNode('junction', -111.88, -35.39);
		L.addLink('pipe', A.id, B.id);
		L.addLink('pipe', B.id, C.id);
		L.saveToStorage();
		const origId = lib.openId, before = bytes(origId);
		const ll = L.getDoc().nodes.map((nd) => [L.outwardX(nd.x), L.outwardY(nd.y)]);
		ok('the project is lat/lon, which is EPSG:3857 here', L.coordKind().crs === 'EPSG:3857');

		await L.runConvertAs({ kind: 'epsg', crs: 'EPSG:32612', units: sameUnits(), rounding: {} });
		await new Promise((res) => setTimeout(res, 0));
		const g = L.georef();
		ok('A lat/lon PROJECT STARTS THE WIZARD (no "already on lat/lon")', !!g);
		ok('...on the copy, not the original', lib.openId !== origId);
		ok('...at step 1', g && g.step === 1, g && g.step);
		ok('...already answered: every node is where its coordinates put it',
			L.getDoc().nodes.every((nd, i) => near(L.outwardX(nd.x), ll[i][0], 1e-9) && near(L.outwardY(nd.y), ll[i][1], 1e-9)));
		ok('...and it says so', L.notice() === PC.lpn_georef_answered, L.notice());
		L.georefAttach();
		L.georefFinish();
		const p = L.getProject();
		ok('Keep this placement lands on the chosen EPSG system', p.crs === 'EPSG:32612' && p.coords === undefined,
			JSON.stringify({ crs: p.crs, coords: p.coords }));
		const worst = L.getDoc().nodes.reduce((w, nd, i) => {
			const e = global.window.proj4('EPSG:4326', '+proj=utm +zone=12 +datum=WGS84 +units=m +no_defs', ll[i]);
			return Math.max(w, Math.hypot(L.outwardX(nd.x) - e[0], L.outwardY(nd.y) - e[1]));
		}, 0);
		ok('...with every coordinate the UTM easting and northing of its lat/lon', worst < 1e-3, worst.toExponential(2) + ' m');
		ok('the original lat/lon project is untouched', bytes(origId) === before);
	}

	console.log('\n--- 4. an attached world map: the steps open answered from the attachment ---');
	{
		L.newProject(null, '');
		const A = L.addNode('junction', 0, 0);
		const B = L.addNode('junction', 1000, 0);
		const C = L.addNode('junction', 0, -1000);
		L.addLink('pipe', A.id, B.id);
		L.addLink('pipe', A.id, C.id);
		const t = { anchor: { x: 0, y: 0 }, origin: { lon: -111.9, lat: 33.4 }, metersPerUnit: 0.3048, rotDeg: 10 };
		L.getProject().georef = t;
		// A site plan behind the drawing, so step 1 can be asked to hold it still with the model.
		L.setBackdrop({ href: 'data:image/png;base64,', x: 0, y: 0, width: 100, height: 100, iw: 100, ih: 100,
			tx: 0, ty: -1000, s: 10 });
		L.saveToStorage();
		const origId = lib.openId, before = bytes(origId);
		ok('the project is an unnamed (local) georeference', L.coordKind().kind === 'unnamed');
		const want = L.getDoc().nodes.map((nd) => global.EngCalcs.lpnGeorefToLonLat(t, L.outwardX(nd.x), L.outwardY(nd.y)));
		await L.runConvertAs({ kind: 'epsg', crs: 'EPSG:3857', units: sameUnits(), rounding: {} });
		const g = L.georef();
		ok('the wizard opens at step 1', !!g && g.step === 1);
		ok('...with every node where the attached map already put it',
			L.getDoc().nodes.every((nd, i) => near(L.outwardX(nd.x), want[i].lon, 1e-9) && near(L.outwardY(nd.y), want[i].lat, 1e-9)));
		L.georefAttach();
		L.georefFinish();
		ok('Keep this placement leaves a lat/lon project where the attachment said',
			L.getProject().coords === 'geo' &&
			L.getDoc().nodes.every((nd, i) => near(L.outwardX(nd.x), want[i].lon, 1e-9) && near(L.outwardY(nd.y), want[i].lat, 1e-9)));
		ok('the original is untouched, attachment and all', bytes(origId) === before && !!stored(origId).project.georef);
		// The site plan came along: its middle is where the attachment put the middle of the picture,
		// and it is still 1000 drawing units (304.8 m) wide on the ground.
		const bd = L.getBackdrop(), bll = global.EngCalcs.lpnGeorefToLonLat(t, 500, 500);
		const bc = { lon: L.outwardX(bd.tx + bd.s * 50), lat: L.outwardY(bd.ty + bd.s * 50) };
		ok('the background image lands where the attachment put it', near(bc.lon, bll.lon, 1e-7) && near(bc.lat, bll.lat, 1e-7),
			JSON.stringify(bc) + ' vs ' + JSON.stringify(bll));
		const wideM = bd.s * 100 * global.EngCalcs.lpnGeorefMetersPerDegree(bll.lat).lon;
		ok('...at its own size on the ground', near(wideM, 304.8, 304.8 * 0.005), wideM.toFixed(2) + ' m');

		console.log('\n--- 5. and back to an unnamed (local) georeference, through the steps ---');
		const latlonId = lib.openId;
		const ll = L.getDoc().nodes.map((nd) => ({ lon: L.outwardX(nd.x), lat: L.outwardY(nd.y) }));
		await L.runConvertAs({ kind: 'unnamed', crs: '', units: sameUnits(), rounding: {} });
		ok('the steps open answered', !!L.georef() && L.georef().step === 1);
		L.georefAttach();
		L.georefFinish();
		const g2 = L.getProject().georef;
		ok('the result is a local grid with the world map attached', !!g2 && !L.getProject().coords && !L.getProject().crs);
		ok('...whose attachment puts every node back where it was',
			!!g2 && L.getDoc().nodes.every((nd, i) => {
				const back = global.EngCalcs.lpnGeorefToLonLat(g2, L.outwardX(nd.x), L.outwardY(nd.y));
				return near(back.lon, ll[i].lon, 1e-9) && near(back.lat, ll[i].lat, 1e-9);
			}));
		const span = Math.hypot(L.outwardX(L.getDoc().nodes[1].x) - L.outwardX(L.getDoc().nodes[0].x),
			L.outwardY(L.getDoc().nodes[1].y) - L.outwardY(L.getDoc().nodes[0].y));
		// 1000 drawing units at 0.3048 m each is 304.8 m on the ground, written in the length unit.
		const lu = L.unitKey('lpn_u_length'), wantSpan = lu === 'ft' ? 1000 : 304.8;
		ok('...in the length unit: the two junctions are ' + wantSpan + ' ' + lu + ' apart', near(span, wantSpan, 0.01),
			span);

		console.log('\n--- 6. Cancel in the steps closes the copy ---');
		const tabs = lib.projects.length;
		const here = lib.openId;
		await L.runConvertAs({ kind: 'epsg', crs: 'EPSG:3857', units: sameUnits(), rounding: {} });
		ok('a copy is being placed', !!L.georef() && lib.openId !== here);
		L.georefCancel();
		ok('Cancel closes it and returns to the project it came from',
			!L.georef() && lib.openId === here && lib.projects.length === tabs, lib.openId + ' vs ' + here);
		ok('...and says nothing was converted', L.notice() === PC.lpn_convas_cancelled, L.notice());
		ok('the earlier lat/lon copy is still there', !!stored(latlonId));
	}

	console.log('');
	console.log(fails === 0 ? 'ALL PASS' : fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}());
