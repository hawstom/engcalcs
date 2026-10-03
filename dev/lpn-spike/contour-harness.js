// THE CONTOUR PLOT (ROADMAP Task 600). Run with:
//   node dev/lpn-spike/contour-harness.js
//
// The design is dev/epanet-js-contour-contribution.md; the pure geometry is js/lpn-contour.js and
// the layer is refreshContour() in js/looped-network.js. What this proves, in order:
//
//   1. THE TRIANGULATION IS DELAUNAY: no node inside any triangle's circumcircle, every triangle
//      counter-clockwise, on random points, a regular grid and a degrees-of-longitude extent.
//   2. A KNOWN LINEAR FIELD IS REPRODUCED EXACTLY, anywhere inside the triangles, by the point
//      value, by the raster, and at every vertex of every filled band (each vertex's value lies in
//      its own band). Linear interpolation must reproduce a plane; anything that does not is not
//      the method the design chose.
//   3. NEVER PAINT OVER NOTHING: two arms of a network with a gap between them get no colour in
//      the gap; two zones joined only by a pump get no triangle across the pump.
//   4. THE GROUND, SUBTRACTED: a hill between nodes takes pressure below every node's own.
//   5. NET3 THROUGH THE PAGE'S OWN CHAIN: the layer draws, under the pipes, with the legend's
//      support sentence, every vertex near a node, filled and line styles, in well under a second.
//   6. RECALCULATE OFF IS A SNAPSHOT: an edit does not redraw the plot; Calculate does.
//   7. THE GROUND THROUGH THE PAGE: a geographic project with a stubbed Mapbox DEM, consent
//      stored, draws pressure out of the junctions' range; without the yes it draws the nodal plot.

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const C = require(ROOT + 'js/lpn-contour.js');
const PC = global.EngCalcs.pageConfig;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }

// A seeded generator, so a failure reproduces.
let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

function delaunayViolations(xs, ys, T) {
	let viol = 0, cw = 0;
	for (let t = 0; t < T.length; t += 3) {
		const a = T[t], b = T[t + 1], c = T[t + 2];
		const o = (xs[b] - xs[a]) * (ys[c] - ys[a]) - (ys[b] - ys[a]) * (xs[c] - xs[a]);
		if (o <= 0) { cw++; }
		for (let p = 0; p < xs.length; p++) {
			if (p === a || p === b || p === c) { continue; }
			const adx = xs[a] - xs[p], ady = ys[a] - ys[p], bdx = xs[b] - xs[p], bdy = ys[b] - ys[p], cdx = xs[c] - xs[p], cdy = ys[c] - ys[p];
			const d = adx * (bdy * (cdx * cdx + cdy * cdy) - (bdx * bdx + bdy * bdy) * cdy) -
				ady * (bdx * (cdx * cdx + cdy * cdy) - (bdx * bdx + bdy * bdy) * cdx) +
				(adx * adx + ady * ady) * (bdx * cdy - bdy * cdx);
			if (d > 1e-9 * Math.abs(o) * (adx * adx + ady * ady + 1e-30)) { viol++; }
		}
	}
	return { viol, cw };
}

head('1. THE TRIANGULATION IS DELAUNAY');
[
	['300 random points', 300, () => [rnd() * 1000, rnd() * 1000]],
	['a 15 x 15 grid (cocircular everywhere)', 225, (i) => [i % 15, Math.floor(i / 15)]],
	['400 points over 0.05 degrees near Petaluma', 400, () => [-122.65 + rnd() * 0.05, 38.2 + rnd() * 0.05]]
].forEach(([name, n, gen]) => {
	const xs = [], ys = [];
	for (let i = 0; i < n; i++) { const p = gen(i); xs.push(p[0]); ys.push(p[1]); }
	const T = C.triangulate(xs, ys), v = delaunayViolations(xs, ys, T);
	check(T.length / 3 > n && v.viol === 0 && v.cw === 0,
		`${name}: ${T.length / 3} triangles, ${v.viol} circumcircle violations, ${v.cw} clockwise`);
});
check(C.triangulate([0, 1], [0, 1]).length === 0, 'two points make no triangle');
check(C.triangulate([0, 1, 2], [0, 1, 2]).length === 0, 'three collinear points make no triangle');

head('2. A KNOWN LINEAR FIELD IS REPRODUCED');
// z = 2x - 3y + 7 at 200 scattered nodes. Linear interpolation over triangles reproduces a plane
// EXACTLY; IDW (EPANET's rule) would not, which is the point of the test.
const plane = (x, y) => 2 * x - 3 * y + 7;
const PX = [], PY = [], PZ = [];
for (let i = 0; i < 200; i++) { const x = rnd() * 100, y = rnd() * 100; PX.push(x); PY.push(y); PZ.push(plane(x, y)); }
const PT = C.triangulate(PX, PY);
let worst = 0, inside = 0;
for (let i = 0; i < 2000; i++) {
	const x = 10 + rnd() * 80, y = 10 + rnd() * 80, v = C.valueAt(PT, PX, PY, PZ, x, y);
	if (v === undefined) { continue; }
	inside++;
	worst = Math.max(worst, Math.abs(v - plane(x, y)));
}
check(inside > 1500 && worst < 1e-9, `${inside} sample points inside the triangles, worst error ${worst.toExponential(2)}`);
const g = C.gridFor(PT, PX, PY, 64), ras = C.rasterField(PT, PX, PY, PZ, g);
let rw = 0, rc = 0;
for (let j = 0; j < g.ny; j++) {
	for (let i = 0; i < g.nx; i++) {
		const v = ras[j * g.nx + i];
		if (!isFinite(v)) { continue; }
		rc++;
		rw = Math.max(rw, Math.abs(v - plane(g.x0 + (i + 0.5) * g.dx, g.y0 + (j + 0.5) * g.dy)));
	}
}
check(rc > 0.6 * g.nx * g.ny && rw < 1e-9, `the raster: ${rc} of ${g.nx * g.ny} cells filled, worst error ${rw.toExponential(2)}`);
const BR = [-200, -100, 0, 100];
const bands = C.isobands(PT, PX, PY, PZ, BR);
let bandBad = 0, bandVerts = 0, area = 0;
bands.forEach((polys, k) => {
	const lo = k === 0 ? -Infinity : BR[k - 1], hi = k === BR.length ? Infinity : BR[k];
	polys.forEach((p) => {
		let a2 = 0;
		for (let m = 0; m < p.length; m += 2) {
			const z = plane(p[m], p[m + 1]);
			bandVerts++;
			if (z < lo - 1e-6 || z > hi + 1e-6) { bandBad++; }
			const n2 = (m + 2) % p.length;
			a2 += p[m] * p[n2 + 1] - p[n2] * p[m + 1];
		}
		area += a2 / 2;
	});
});
let hullArea = 0;
for (let t = 0; t < PT.length; t += 3) {
	const a = PT[t], b = PT[t + 1], c = PT[t + 2];
	hullArea += ((PX[b] - PX[a]) * (PY[c] - PY[a]) - (PY[b] - PY[a]) * (PX[c] - PX[a])) / 2;
}
check(bandBad === 0 && bandVerts > 0, `every one of ${bandVerts} band vertices lies in its own band`);
check(Math.abs(area - hullArea) < 1e-6 * hullArea, `the bands tile the triangles exactly: ${area.toFixed(3)} of ${hullArea.toFixed(3)}`);
const lines = C.isolines(PT, PX, PY, PZ, BR);
let lineBad = 0;
lines.forEach((segs, k) => segs.forEach((s) => { for (let m = 0; m < 4; m += 2) { if (Math.abs(plane(s[m], s[m + 1]) - BR[k]) > 1e-6) { lineBad++; } } }));
check(lines.every((s) => s.length > 0) && lineBad === 0, 'every line-contour vertex lies on its own level');
const gl = C.isolinesGrid(ras, g, [0]);
let glBad = 0;
gl[0].forEach((s) => { for (let m = 0; m < 4; m += 2) { if (Math.abs(plane(s[m], s[m + 1])) > 1e-6) { glBad++; } } });
check(gl[0].length > 0 && glBad === 0, `the raster's line contour lies on its level: ${gl[0].length} segments`);

head('3. NEVER PAINT OVER NOTHING');
// Two arms of a network, each a 6 x 6 grid of nodes at spacing 1 joined by pipes of length 1, and
// a gap of 8 between them -- a river the network does not cross.
function arms(gap) {
	const xs = [], ys = [], links = [];
	[0, 5 + gap].forEach((x0) => {
		const base = xs.length;
		for (let j = 0; j < 6; j++) { for (let i = 0; i < 6; i++) { xs.push(x0 + i); ys.push(j); } }
		for (let j = 0; j < 6; j++) {
			for (let i = 0; i < 6; i++) {
				const k = base + j * 6 + i;
				if (i < 5) { links.push([k, k + 1]); }
				if (j < 5) { links.push([k, k + 6]); }
			}
		}
	});
	return { xs, ys, links };
}
const A = arms(8), AT = C.triangulate(A.xs, A.ys), AZ = A.xs.map(() => 1);
const med = C.median(A.links.map(([a, b]) => Math.hypot(A.xs[a] - A.xs[b], A.ys[a] - A.ys[b])));
check(med === 1, `the median pipe length is 1: ${med}`);
const unmasked = AT.length / 3;
let across = 0;
for (let t = 0; t < AT.length; t += 3) { if ((A.xs[AT[t]] < 6) !== (A.xs[AT[t + 1]] < 6) || (A.xs[AT[t]] < 6) !== (A.xs[AT[t + 2]] < 6)) { across++; } }
check(across > 0, `the bare triangulation does bridge the gap (${across} of ${unmasked} triangles) -- the mask has work to do`);
const AM = C.maskTriangles(AT, A.xs, A.ys, C.zones(A.xs.length, A.links), 3 * med);
check(C.valueAt(AM, A.xs, A.ys, AZ, 9, 2.5) === undefined, 'with the fill limit, a point in the middle of the gap has no value');
check(C.valueAt(AM, A.xs, A.ys, AZ, 2.5, 2.5) === 1 && C.valueAt(AM, A.xs, A.ys, AZ, 15.5, 2.5) === 1,
	'and both arms are still coloured');
const filledX = [];
C.isobands(AM, A.xs, A.ys, AZ, [0.5]).forEach((ps) => ps.forEach((p) => { for (let m = 0; m < p.length; m += 2) { filledX.push(p[m]); } }));
check(filledX.every((x) => x <= 5 + 1e-9 || x >= 13 - 1e-9), 'no filled polygon has a vertex inside the gap');
// The same two arms with a narrow gap (2) joined only by a PUMP: within the fill limit, but a
// different zone, so still no colour across.
const B = arms(2), BT = C.triangulate(B.xs, B.ys);
const pumpless = C.zones(B.xs.length, B.links);
const BMlimit = C.maskTriangles(BT, B.xs, B.ys, null, 3);
const BMzone = C.maskTriangles(BT, B.xs, B.ys, pumpless, 3);
check(C.valueAt(BMlimit, B.xs, B.ys, B.xs.map(() => 1), 6, 2.5) === 1,
	'a gap of 2 pipe lengths is within the fill limit, so length alone would colour it');
check(C.valueAt(BMzone, B.xs, B.ys, B.xs.map(() => 1), 6, 2.5) === undefined,
	'but the arms are joined only by a pump (not an open pipe), so the zone rule leaves it uncoloured');
const joined = C.zones(B.xs.length, B.links.concat([[5, 36]]));
check(C.valueAt(C.maskTriangles(BT, B.xs, B.ys, joined, 3), B.xs, B.ys, B.xs.map(() => 1), 6, 2.5) === 1,
	'join them with an open pipe and the gap is coloured');

head('4. THE GROUND, SUBTRACTED');
// Head is a plane falling west to east; the ground is flat except a hill centred BETWEEN nodes.
// Pressure at every node is head minus a flat ground, so the nodes alone could never show the hill.
const hx = [], hy = [], hh = [];
for (let j = 0; j < 5; j++) { for (let i = 0; i < 5; i++) { hx.push(i * 10); hy.push(j * 10); hh.push(100 - 0.1 * i * 10); } }
const HT = C.triangulate(hx, hy), hg = C.gridFor(HT, hx, hy, 80);
const ground = (x, y) => 40 + 30 * Math.exp(-((x - 15) ** 2 + (y - 25) ** 2) / 20);
const H = C.rasterField(HT, hx, hy, hh, hg);
let pmin = Infinity;
for (let j = 0; j < hg.ny; j++) { for (let i = 0; i < hg.nx; i++) { const v = H[j * hg.nx + i]; if (isFinite(v)) { pmin = Math.min(pmin, v - ground(hg.x0 + (i + 0.5) * hg.dx, hg.y0 + (j + 0.5) * hg.dy)); } } }
const nodeMin = Math.min(...hh.map((h, k) => h - ground(hx[k], hy[k])));
check(pmin < nodeMin - 20, `pressure over the hill reaches ${pmin.toFixed(1)}, below every node's ${nodeMin.toFixed(1)}`);

// ================================================================================================
// THE PAGE
// ================================================================================================
// js/lpn-terrain.js binds to `window`; give it the same EngCalcs, a cookie jar and a token, as
// terrain-harness.js does.
global.window.EngCalcs = global.EngCalcs;
global.window.document = global.document;
global.window.setTimeout = setTimeout;
global.window.clearTimeout = clearTimeout;
global.window.location = { protocol: 'https:' };
let confirmText = null, confirmAnswer = false;
global.window.confirm = function (t) { confirmText = t; return confirmAnswer; };
let realFetches = 0;
global.window.fetch = function () { realFetches++; return Promise.reject(new Error('no network in a harness')); };
const jar = { value: '' };
Object.defineProperty(global.document, 'cookie', {
	configurable: true,
	get() { return jar.value; },
	set(v) { const name = String(v).split('=')[0]; const others = jar.value.split('; ').filter((c) => c && c.split('=')[0] !== name);
		if (!/expires=Thu, 01 Jan 1970/.test(v)) { others.push(String(v).split(';')[0]); } jar.value = others.join('; '); }
});
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-terrain.js');

const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, getDoc: function () { return doc; },\n" +
	"\t\tsetDoc: function (d) { doc = d; }, setSettings: function (s) { settings = s; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trunSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tsetResult: function (r) { lastSolveResult = r; },\n" +
	"\t\trefreshValueColors: refreshValueColors, contourStats: function () { return contourStats; },\n" +
	"\t\tcontourLayer: function () { return contourLayer; }, showContour: showContour,\n" +
	"\t\tcolorNodeValue: colorNodeValue, nodeDrawX: nodeDrawX, nodeDrawY: nodeDrawY,\n" +
	"\t\tlegendText: function () { var b = colorLegendEl(), t = []; (function walk(e) { if (!e) { return; } if (e.nodeType === 3 || e._text) { t.push(String(e.textContent)); } (e.children || []).forEach(walk); }(b)); return t.join(' '); },\n" +
	"\t\tsetProp: setProp, scheduleSolve: scheduleSolve, nodeById: nodeById,\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\taddNode: addNode, addLink: addLink, GEO: LPN_COORDS_GEO,\n" +
	"\t\tplace: function (id, lon, lat) { var n = nodeById(id); n.x = inwardX(lon); n.y = inwardY(lat); },\n" +
	"\t\tnewGeo: function () { doc = { nodes: [], links: [], labels: [], customers: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'G', docId: 'geo-test', activeScenario: 'base', coords: LPN_COORDS_GEO };\n" +
	"\t\t\tscenarios = defaultScenarios(); settings = defaultSettings(); seedDefaultInputs(); lastSolveResult = null; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tmodelLayer: function () { return modelLayer; }, linksLayer: function () { return linksLayer; },\n" +
	"\t\tbuildColoringSection: buildColoringSection, linkById: linkById,\n" +
	"\t\tnewPlain: function () { doc = { nodes: [], links: [], labels: [], customers: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'P', docId: 'plain-test', activeScenario: 'base' };\n" +
	"\t\t\tscenarios = defaultScenarios(); settings = defaultSettings(); seedDefaultInputs(); lastSolveResult = null; },\n"
);
const EngCalcs = global.EngCalcs;

function layerPaths(cls) {
	const lay = L.contourLayer();
	return lay ? (lay.children || []).filter((c) => String(c.getAttribute ? c.getAttribute('class') : c['class'] || '').indexOf(cls) >= 0) : [];
}
function pathPoints(p) {
	const d = p.getAttribute('d') || '', out = [], re = /[ML]([-\d.e]+) ([-\d.e]+)/g;
	let m;
	while ((m = re.exec(d))) { out.push([+m[1], +m[2]]); }
	return out;
}
// Is (x, y) inside any filled band polygon? Even-odd over every closed subpath of every band.
function coloredAt(x, y) {
	return layerPaths('lpn-contour-band').some((p) => {
		return (p.getAttribute('d') || '').split('M').filter(Boolean).some((sub) => {
			const pts = [], re = /([-\d.e]+) ([-\d.e]+)/g;
			let m, inside = false;
			while ((m = re.exec('M' + sub))) { pts.push([+m[1], +m[2]]); }
			for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
				const [xi, yi] = pts[i], [xj, yj] = pts[j];
				if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) { inside = !inside; }
			}
			return inside;
		});
	});
}
function findIn(host, id) {
	let hit = null;
	(function walk(e) { if (!e || hit) { return; } if (e.id === id) { hit = e; return; } (e.children || []).forEach(walk); }(host));
	return hit;
}
function fireEl(el, type) { ((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el, currentTarget: el })); }
function allD() { return layerPaths('lpn-contour').map((p) => p.getAttribute('d')).join('|'); }

// The colour key is created as a SIBLING of #lpn_labels_legend, which the stub makes as an orphan;
// color-ramp-harness.js gives it a parent the same way.
byId.lpn_canvas.appendChild(byId.lpn_labels_legend);

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();

	head('5. NET3 THROUGH THE PAGE\'S OWN CHAIN');
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net3');
	L.setDoc(d); L.setSettings(d.settings); L.applyUnitSelections(d.units);
	d.settings.autoRun = false;
	check(d.settings.contourStyle === '', 'a project opens with no contour plot');
	L.runSolve();
	for (let i = 0; i < 400 && !L.lastResult(); i++) { await new Promise((r) => setTimeout(r, 25)); }
	check(!!L.lastResult(), 'Net3 solved');
	d.settings.colorNodeField = 'pressure';
	L.refreshValueColors();
	check(layerPaths('lpn-contour-band').length === 0, 'colouring the nodes alone draws no contour');
	L.showContour();
	const S = L.contourStats();
	check(d.settings.contourStyle === 'filled', 'Graphs > Contour turns on filled contours');
	const bandsDrawn = layerPaths('lpn-contour-band');
	check(bandsDrawn.length >= 3, `Net3 draws ${bandsDrawn.length} filled bands over ${S && S.triangles} triangles from ${S && S.n} nodes`);
	const ml = L.modelLayer();
	check(ml.children[0] === L.contourLayer() && ml.children.indexOf(L.linksLayer()) > 0,
		'the layer is the first child of the drawing group: under the pipes and the nodes');
	check(L.contourLayer().getAttribute('pointer-events') === 'none', 'and it never takes a click');
	const want = PC.lpn_contour_support.replace('{n}', String(L.contourStats().n)).replace('{k}', '3');
	check(L.legendText().indexOf(want) >= 0, `the legend carries the support sentence: "${want}"`);
	// THE TANK HALO. Under pressure a tank's value is its water depth and a reservoir's about zero:
	// as vertices they would paint false low pressure round each one. Junctions only, for pressure.
	const juncWithP = d.nodes.filter((n) => n.type === 'junction' && isFinite(L.colorNodeValue(n, 'pressure'))).length;
	check(S.n === juncWithP, `pressure: the plot stands on the ${juncWithP} junctions alone, no tank or reservoir: ${S.n}`);
	d.settings.colorNodeField = 'head';
	L.refreshValueColors();
	const fixedN = d.nodes.filter((n) => n.type !== 'junction').length;
	check(L.contourStats().n === juncWithP + fixedN, `head: tanks and reservoirs are vertices too (their water surface is the grade line): ${L.contourStats().n}`);
	d.settings.colorNodeField = 'pressure';
	L.refreshValueColors();
	// Every vertex lies on a kept triangle's edge, so within half the fill limit of a node is too
	// strict; within the fill limit of SOME node is the claim.
	const nodesXY = d.nodes.map((n) => [L.nodeDrawX(n), L.nodeDrawY(n)]);
	const pipeLens = d.links.filter((l) => l.type === 'pipe').map((l) => {
		const a = L.nodeById(l.from), b = L.nodeById(l.to);
		return Math.hypot(L.nodeDrawX(a) - L.nodeDrawX(b), L.nodeDrawY(a) - L.nodeDrawY(b));
	});
	const limit = 3 * C.median(pipeLens);
	let far = 0, verts = 0;
	bandsDrawn.forEach((p) => pathPoints(p).forEach(([x, y]) => {
		verts++;
		let best = Infinity;
		nodesXY.forEach(([nx, ny]) => { best = Math.min(best, Math.hypot(nx - x, ny - y)); });
		if (best > limit + 1e-6) { far++; }
	}));
	check(verts > 0 && far === 0, `all ${verts} band vertices are within the fill limit (${limit.toFixed(0)}) of a node`);
	check(S.ms < 250, `drawn in ${S.ms.toFixed(1)} ms (the claim is well under a second)`);
	let best = Infinity;
	for (let i = 0; i < 20; i++) { L.refreshValueColors(); best = Math.min(best, L.contourStats().ms); }
	console.log(`         Net3, best of 20 redraws: ${best.toFixed(1)} ms`);
	check(JSON.parse(JSON.stringify(L.serialize())).settings.contourStyle === 'filled', 'the style rides in the project');
	d.settings.contourStyle = 'lines';
	L.refreshValueColors();
	check(layerPaths('lpn-contour-line').length >= 2 && layerPaths('lpn-contour-band').length === 0,
		`line contours: ${layerPaths('lpn-contour-line').length} level lines and no fill`);
	d.settings.contourStyle = 'filled';
	d.settings.colorNodeField = '';
	L.refreshValueColors();
	check(layerPaths('lpn-contour').length === 0, 'nodes not coloured: no contour, whatever the style says');
	d.settings.colorNodeField = 'pressure';
	L.refreshValueColors();

	head('6. RECALCULATE OFF IS A SNAPSHOT');
	const before = allD();
	const j = d.nodes.filter((n) => n.type === 'junction')[10];
	j.elev = (j.elev || 0) + 200;
	L.scheduleSolve();
	await new Promise((r) => setTimeout(r, 400));
	check(allD() === before && before.length > 0, 'an edit with Recalculate off leaves the plot exactly as it was');
	const p0 = L.lastResult().pressures[j.id];
	L.runSolve();
	for (let i = 0; i < 400 && allD() === before; i++) { await new Promise((r) => setTimeout(r, 25)); }
	console.log('         pressure at ' + j.id + ': ' + p0 + ' -> ' + L.lastResult().pressures[j.id] + ', elev ' + j.elev);
	check(allD() !== before, 'Calculate redraws it');

	head('7. THE GROUND THROUGH THE PAGE');
	// A 4 x 4 grid of junctions 300 m apart near Petaluma, every head 100 m, the ground flat at 40 m
	// except a 30 m hill in the middle of one square of pipes. The results are set directly: the
	// hydraulics are not under test, the composition is.
	L.newGeo();
	const S2 = L.getSettings();
	const lon0 = -122.64, lat0 = 38.23, dLon = 300 / (111320 * Math.cos(lat0 * Math.PI / 180)), dLat = 300 / 110540;
	const hill = { lon: lon0 + 1.5 * dLon, lat: lat0 + 1.5 * dLat };
	function groundM(lon, lat) {
		const dx = (lon - hill.lon) / dLon * 300, dy = (lat - hill.lat) / dLat * 300;
		return 40 + 30 * Math.exp(-(dx * dx + dy * dy) / (2 * 60 * 60));
	}
	const ids = [];
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			const id = L.addNode('junction', 0, 0).id || ('J' + (ids.length + 1));
			ids.push(id);
			L.place(id, lon0 + c * dLon, lat0 + r * dLat);
			L.nodeById(id).elev = groundM(lon0 + c * dLon, lat0 + r * dLat) / EngCalcs.unitFactor('ft') * 1;
		}
	}
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			if (c < 3) { L.addLink('pipe', ids[r * 4 + c], ids[r * 4 + c + 1]); }
			if (r < 3) { L.addLink('pipe', ids[r * 4 + c], ids[(r + 1) * 4 + c]); }
		}
	}
	const heads = {}, pressures = {};
	ids.forEach((id) => {
		const n = L.nodeById(id);
		heads[id] = 100;
		pressures[id] = 100 - groundM(lon0 + (ids.indexOf(id) % 4) * dLon, lat0 + Math.floor(ids.indexOf(id) / 4) * dLat);
	});
	L.setResult({ ok: true, converged: true, heads, pressures, flows: {}, headlosses: {}, velocities: {}, statuses: {} });
	S2.colorNodeField = 'pressure';
	S2.contourStyle = 'lines';
	S2.contourTerrain = true;
	// The terrain stub: the ground above, ENCODED by Mapbox's own formula so the real decode runs.
	function pixelLonLat(tile, p) {
		const n = Math.pow(2, tile.z);
		return { lon: (tile.x + (p.px + 0.5) / 256) / n * 360 - 180,
			lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * (tile.y + (p.py + 0.5) / 256) / n))) * 180 / Math.PI };
	}
	let tileCalls = 0;
	EngCalcs.lpnTerrainFetchPixels = function (tile) {
		tileCalls++;
		return Promise.resolve(tile.points.map((p) => {
			const ll = pixelLonLat(tile, p), q = Math.round((groundM(ll.lon, ll.lat) + 10000) / 0.1);
			return { id: p.id, r: (q >> 16) & 255, g: (q >> 8) & 255, b: q & 255 };
		}));
	};
	PC.lpn_mapbox_token = 'pk.test-token';
	L.refreshValueColors();
	await new Promise((r) => setTimeout(r, 50));
	check(tileCalls === 0 && !L.contourStats().dem, 'without a stored yes, nothing is fetched and the nodal plot stands');
	// A FILE SAVED WITH THE BOX TICKED, OPENED WHERE NOBODY SAID YES: the box must not show
	// ticked while the plain plot draws.
	S2.contourStyle = 'filled';
	L.buildColoringSection();
	const demBox = findIn(byId.lpn_set_colors_node, 'lpn_set_contour_dem');
	check(!!demBox && demBox.checked === false && S2.contourTerrain === true,
		'a saved tick with no yes in this browser shows UNticked, the project setting kept');
	// Ticking it asks, and the question says one thing about what is sent: tile numbers.
	confirmAnswer = false; confirmText = null;
	demBox.checked = true; fireEl(demBox, 'change');
	const paras = String(confirmText || '').split('\n\n');
	check(paras.length === 4 && paras.every((t, i) => t === PC['lpn_contour_consent_' + (i + 1)]),
		'ticking asks the contour question, its own four paragraphs');
	check(/tile numbers/.test(paras[1]) && /tile numbers/.test(paras[2]) &&
		!/node position|coordinates|latitude/i.test(confirmText || ''),
		'paragraphs 2 and 3 say tile numbers too, never node positions or coordinates');
	check(demBox.checked === false && S2.contourTerrain === false && tileCalls === 0, 'a no unticks it, stores nothing and fetches nothing');
	S2.contourTerrain = true;
	S2.contourStyle = 'lines';
	jar.value = 'ec_terrain=1.' + Math.floor(Date.now() / 1000) + '.' + (PC.lpn_terrain_version || '1');
	L.refreshValueColors();
	for (let i = 0; i < 200 && !(L.contourStats() && L.contourStats().dem); i++) { await new Promise((r) => setTimeout(r, 10)); }
	const G = L.contourStats();
	check(tileCalls > 0 && G && G.dem > 0, `with the yes, the ground is read (${tileCalls} tile(s)) at about ${G && G.dem && G.dem.toFixed(0)} m`);
	const nodeP = ids.map((id) => L.colorNodeValue(L.nodeById(id), 'pressure'));
	const lo = Math.min(...nodeP);
	check(G && G.demRange && G.demRange[0] < lo - 20,
		`pressure over the hill reaches ${G && G.demRange && G.demRange[0].toFixed(1)}, below every junction's ${lo.toFixed(1)} (display unit)`);
	check(L.legendText().indexOf(PC.lpn_contour_support_dem.split('{m}')[0]) >= 0, 'and the legend says what the pressure stands on');
	check(layerPaths('lpn-contour-line').length > 0, 'the line contours are drawn from the ground-subtracted grid');
	// PLAY MUST NOT RE-READ THE GROUND. Close the four pipes between the bottom row and the rest,
	// as a control would: the plot's outline shrinks by a whole row, the network does not.
	const callsBefore = tileCalls;
	const res = L.lastResult();
	for (let c = 0; c < 4; c++) {
		const lk = L.getDoc().links.find((l) => l.from === ids[c] && l.to === ids[4 + c]);
		res.statuses[lk.id] = 'closed';
	}
	L.refreshValueColors();
	await new Promise((r) => setTimeout(r, 50));
	check(tileCalls === callsBefore && L.contourStats().dem > 0,
		`closing pipes moves the outline but re-reads no ground: ${tileCalls - callsBefore} more tile request(s)`);
	check(realFetches === 0, 'no real network request was made');

	head('8. THE MASK THROUGH THE PAGE: THE FILL LIMIT, PUMPS AND CLOSED LINKS');
	// Two 6 x 6 arms of junctions, pipes of length 1, coloured by ELEVATION (an input, so no solve),
	// joined in different ways. The probe point is in the middle of the space between the arms.
	function twoArms(gap, joinType, closed) {
		L.newPlain();
		const S3 = L.getSettings();
		const grid = [];
		[0, 5 + gap].forEach((x0) => {
			for (let r = 0; r < 6; r++) {
				for (let c = 0; c < 6; c++) {
					const n = L.addNode('junction', 0, 0);
					n.x = x0 + c; n.y = r; n.elev = 100 + x0 + c;
					grid.push(n.id);
				}
			}
		});
		for (let a = 0; a < 2; a++) {
			for (let r = 0; r < 6; r++) {
				for (let c = 0; c < 6; c++) {
					const k = a * 36 + r * 6 + c;
					if (c < 5) { L.addLink('pipe', grid[k], grid[k + 1]); }
					if (r < 5) { L.addLink('pipe', grid[k], grid[k + 6]); }
				}
			}
		}
		// The join: from the right edge of arm one to the left edge of arm two, on row 2.
		const j = L.addLink(joinType, grid[2 * 6 + 5], grid[36 + 2 * 6]);
		if (closed) { j._status = 'closed'; }
		S3.colorNodeField = 'elev';
		S3.contourStyle = 'filled';
		L.refreshValueColors();
		return 5 + gap / 2;
	}
	let px = twoArms(8, 'pipe', false);
	check(!coloredAt(px, 2.5) && coloredAt(2.5, 2.5) && coloredAt(15.5, 2.5),
		'a gap of 8 pipe lengths joined by one open pipe: the arms are coloured, the gap is not (the fill limit)');
	px = twoArms(1, 'pipe', false);
	check(coloredAt(px, 2.5), 'a gap of 1 joined by an open pipe is coloured -- so the next two are not vacuous');
	px = twoArms(1, 'pump', false);
	check(!coloredAt(px, 2.5) && coloredAt(2.5, 2.5), 'the same gap joined only by a pump is not coloured');
	px = twoArms(1, 'pipe', true);
	check(!coloredAt(px, 2.5) && coloredAt(2.5, 2.5), 'the same gap joined only by a CLOSED pipe is not coloured');

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
