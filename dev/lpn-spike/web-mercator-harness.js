// EPSG:3857 IS A REAL PROJECTED SYSTEM -- ROADMAP Task 775.
//
//   node dev/lpn-spike/web-mercator-harness.js
//
// Tom, 2026-10-07: "Make 3857 real. They aren't the same thing, and some pedantic people will
// notice if 3857 is missing or doesn't work."
//
// What it holds, with no browser:
//   1. js/lpn-crs.js's closed-form Web Mercator agrees with proj4's own built-in EPSG:3857, and
//      answers before (and without) the 190 KB definitions download.
//   2. A Net1-sized network (11 nodes, 12 links) at 45 degrees north goes 4326 -> 3857 -> 4326
//      through those transforms within 1e-9 degree.
//   3. In a project declared on EPSG:3857, an Auto pipe length is a GROUND length: within 0.1% of
//      Vincenty's inverse (written out here from the published formula, not ours), while the plane
//      distance between the same metre coordinates is 41% long at this latitude.
//   4. The scale used for customer offsets and symbol sizes is the ground one too.
//
// The real-Chromium half -- the chooser clicked, the placement kept, the .inp exported -- is
// web-mercator-browser-harness.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { ROOT, loadLoopedNetwork } = require('./lpn-dom-stub.js');

global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));
const proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const E = global.EngCalcs;

// Vincenty's inverse on WGS 84 (T. Vincenty, Survey Review 23(176), 1975), metres.
function vincenty(lon1, lat1, lon2, lat2) {
	const a = 6378137, f = 1 / 298.257223563, b = a * (1 - f), r = Math.PI / 180;
	const L = (lon2 - lon1) * r, U1 = Math.atan((1 - f) * Math.tan(lat1 * r)), U2 = Math.atan((1 - f) * Math.tan(lat2 * r));
	const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
	let lam = L, lamP, sS, cS, sig, sA, c2A, c2Sm, C, it = 0;
	do {
		const sl = Math.sin(lam), cl = Math.cos(lam);
		sS = Math.sqrt((cU2 * sl) ** 2 + (cU1 * sU2 - sU1 * cU2 * cl) ** 2);
		if (sS === 0) { return 0; }
		cS = sU1 * sU2 + cU1 * cU2 * cl;
		sig = Math.atan2(sS, cS);
		sA = cU1 * cU2 * sl / sS;
		c2A = 1 - sA * sA;
		c2Sm = c2A ? cS - 2 * sU1 * sU2 / c2A : 0;
		C = f / 16 * c2A * (4 + f * (4 - 3 * c2A));
		lamP = lam;
		lam = L + (1 - C) * f * sA * (sig + C * sS * (c2Sm + C * cS * (-1 + 2 * c2Sm * c2Sm)));
	} while (Math.abs(lam - lamP) > 1e-12 && ++it < 200);
	const u2 = c2A * (a * a - b * b) / (b * b);
	const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
	const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
	const dS = B * sS * (c2Sm + B / 4 * (cS * (-1 + 2 * c2Sm * c2Sm) - B / 6 * c2Sm * (-3 + 4 * sS * sS) * (-3 + 4 * c2Sm * c2Sm)));
	return b * A * (sig - dS);
}

// Net1's own layout (EPANET's example network), its 70 x 80 grid units laid on the ground at
// 45 N 122 W, one unit = 0.0005 degree: a network about 3 km across. The pump 9-10 is a pipe here.
const NET1 = {
	'9': [10, 70], '10': [20, 70], '11': [30, 70], '12': [50, 70], '13': [70, 70],
	'21': [30, 40], '22': [50, 40], '23': [70, 40], '31': [30, 10], '32': [50, 10], '2': [50, 90]
};
const NET1_LINKS = [['P9', '9', '10'], ['10', '10', '11'], ['11', '11', '12'], ['12', '12', '13'],
	['21', '21', '22'], ['22', '22', '23'], ['31', '31', '32'], ['110', '2', '12'], ['111', '11', '21'],
	['112', '12', '22'], ['113', '13', '23'], ['121', '21', '31'], ['122', '22', '32']];
const lonOf = (u) => -122 + u * 0.0005, latOf = (u) => 45 + u * 0.0005;

console.log('\n--- 1. the closed form agrees with proj4\'s own EPSG:3857 ---');
{
	ok('lpnCrsHas(EPSG:3857) is true before anything has loaded', E.lpnCrsReady() === false && E.lpnCrsHas('EPSG:3857') === true);
	ok('...and its unit is the metre', E.lpnCrsUnit('EPSG:3857') && E.lpnCrsUnit('EPSG:3857').units === 'm');
	let worst = 0, worstBack = 0;
	for (let lat = -80; lat <= 80; lat += 7.3) {
		for (let lon = -179; lon <= 179; lon += 23.9) {
			const p = E.lpnCrsForward('EPSG:3857', { lon, lat }), q = proj4('EPSG:4326', 'EPSG:3857', [lon, lat]);
			worst = Math.max(worst, Math.hypot(p.x - q[0], p.y - q[1]));
			const b = E.lpnCrsInverse('EPSG:3857', p);
			worstBack = Math.max(worstBack, Math.abs(b.lon - lon), Math.abs(b.lat - lat));
		}
	}
	ok('forward matches proj4 within a micrometre from 80 S to 80 N', worst < 1e-6, worst.toExponential(2) + ' m');
	ok('inverse(forward) returns the point within 1e-9 degree', worstBack < 1e-9, worstBack.toExponential(2) + ' deg');
	const z = E.lpnCrsForward('EPSG:3857', { lon: 0, lat: 0 }), edge = E.lpnCrsForward('EPSG:3857', { lon: 180, lat: 0 });
	ok('the origin is 0, 0 and the antimeridian is pi R', z.x === 0 && Math.abs(z.y) < 1e-9 && Math.abs(edge.x - Math.PI * 6378137) < 1e-6,
		JSON.stringify([z, edge.x]));
}

console.log('\n--- 2. Net1-sized round trip 4326 -> 3857 -> 4326 ---');
{
	let worst = 0;
	Object.keys(NET1).forEach((id) => {
		const lon = lonOf(NET1[id][0]), lat = latOf(NET1[id][1]);
		const m = E.lpnCrsForward('EPSG:3857', { lon, lat }), b = E.lpnCrsInverse('EPSG:3857', m);
		worst = Math.max(worst, Math.abs(b.lon - lon), Math.abs(b.lat - lat));
	});
	ok('every one of the 11 nodes returns within 1e-9 degree', worst < 1e-9, worst.toExponential(2) + ' deg');
}

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink, newProject: newProject,\n" +
	"\t\tinwardX: inwardX, inwardY: inwardY, outwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tlinkGeomLength: linkGeomLength, metresPerWorldUnit: metresPerWorldUnit,\n" +
	"\t\tisWebMerc: isWebMercProject, isProjected: isProjectedProject, isGeo: isLatLonProject,\n" +
	"\t\tlocatable: projectLocatable, crsName: crsDisplayName, unitKey: unitKey,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

console.log('\n--- 3. a project on EPSG:3857 measures its pipes on the ground ---');
{
	L.newProject(null, 'EPSG:3857');
	ok('the project states EPSG:3857 as project.crs', L.getProject().crs === 'EPSG:3857' && L.getProject().coords === undefined);
	ok('...is a projected project, not a lat/lon one', L.isProjected() && !L.isGeo() && L.isWebMerc());
	ok('...and can be placed on the world map (projectLocatable)', L.locatable() === true);
	ok('...and names itself as the register does', L.crsName() === 'WGS 84' + ' / ' + 'Pseudo-Mercator' + ' (EPSG:3857)', L.crsName());
	const at = {}, merc = {};
	Object.keys(NET1).forEach((id) => {
		const m = E.lpnCrsForward('EPSG:3857', { lon: lonOf(NET1[id][0]), lat: latOf(NET1[id][1]) });
		merc[id] = m;
		at[id] = L.addNode('junction', L.inwardX(m.x), L.inwardY(m.y));
	});
	ok('the nodes hold Web Mercator metres', Object.keys(NET1).every((id) =>
		Math.abs(L.outwardX(at[id].x) - merc[id].x) < 1e-6 && Math.abs(L.outwardY(at[id].y) - merc[id].y) < 1e-6),
		L.outwardX(at['9'].x).toFixed(3) + ', ' + L.outwardY(at['9'].y).toFixed(3));
	const lenK = L.unitKey('lpn_u_length'), toUnit = lenK === 'ft' ? 1 / 0.3048 : 1;
	let worstRel = 0, planeRel = 0;
	NET1_LINKS.forEach(([id, f, t]) => {
		const l = L.addLink('pipe', at[f].id, at[t].id);
		const got = L.linkGeomLength(l) / toUnit;
		const truth = vincenty(lonOf(NET1[f][0]), latOf(NET1[f][1]), lonOf(NET1[t][0]), latOf(NET1[t][1]));
		const plane = Math.hypot(merc[t].x - merc[f].x, merc[t].y - merc[f].y);
		worstRel = Math.max(worstRel, Math.abs(got - truth) / truth);
		planeRel = Math.max(planeRel, Math.abs(plane - truth) / truth);
	});
	ok('every Auto length is within 0.1% of Vincenty\'s geodesic', worstRel < 0.001, (worstRel * 100).toFixed(4) + '%');
	ok('...while the plane distance between the same metres is about 41% long (1/cos 45)',
		planeRel > 0.40 && planeRel < 0.43, (planeRel * 100).toFixed(1) + '%');
	// A pipe with a bend: the polyline is measured leg by leg on the ground.
	const l = L.addLink('pipe', at['9'].id, at['32'].id);
	const bend = E.lpnCrsForward('EPSG:3857', { lon: lonOf(10), lat: latOf(10) });
	l.verts = [{ x: L.inwardX(bend.x), y: L.inwardY(bend.y) }];
	const want = vincenty(lonOf(10), latOf(70), lonOf(10), latOf(10)) + vincenty(lonOf(10), latOf(10), lonOf(50), latOf(10));
	const got = L.linkGeomLength(l) / toUnit;
	ok('a bent pipe is measured along its bend, on the ground', Math.abs(got - want) / want < 0.001,
		got.toFixed(2) + ' vs ' + want.toFixed(2) + ' m');

	console.log('\n--- 4. the ground scale beside the lengths ---');
	const k = L.metresPerWorldUnit(at['22'].x, at['22'].y), c = Math.cos(latOf(40) * Math.PI / 180);
	ok('one Web Mercator metre is about cos(latitude) of a ground metre', Math.abs(k - c) / c < 0.005,
		k.toFixed(5) + ' vs cos ' + c.toFixed(5));
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);
