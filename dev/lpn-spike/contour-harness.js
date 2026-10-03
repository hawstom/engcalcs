// THE CONTOUR PLOT (ROADMAP Task 600). Run with:
//   node dev/lpn-spike/contour-harness.js
//
// The design is dev/epanet-js-contour-contribution.md (§2b is this version); the pure geometry is
// js/lpn-contour.js and the layer is refreshContour() in js/looped-network.js. The browser half
// (the box at phone width, the raster on screen) is contour-browser-harness.js. What this proves:
//
//   1. FROM A LINK: on a pipe the field is the pipe's own linear value; beside it, an average that
//      never leaves the nodes' range; past the reach, nothing; the fade runs one way.
//   2. A WALL: across a pump's fault the colour jumps, both sides coloured, and no contour line
//      crosses it; two zones beside each other are never averaged.
//   3. CONTOUR LINES lie on their level; labels are upright, spaced and never on top of each other.
//   4. LEVELS, STEPS, TEXT, COLOUR: the small arithmetic.
//   5. THE GROUND, SUBTRACTED: a hill between pipes takes pressure below every node's own.
//   6. NET3 THROUGH THE PAGE: (a) every loop coloured, measured at buffer 1.5, 2, 2.5 and 3;
//      (b) a point far from every pipe bare; (c) a wall at each pump; (d) lines every 5 psi, each
//      label the value of the field under it; timing.
//   7. THE BOX: interval, opacity, fill, lines and labels redraw the layer; the menu row turns it on.
//   8. RECALCULATE OFF IS A SNAPSHOT.
//   9. THE GROUND THROUGH THE PAGE (stubbed Mapbox DEM, consent).
//  10. TWO ARMS THROUGH THE PAGE: a wide gap stays bare; a pump between them is a wall.
//  11. A LARGER NETWORK: a generated 40 x 40 grid, for the timing.

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

// A grid network of pipes, spacing 1, as segments: n x n nodes, value f(x, y) at each node.
function gridSegs(n, f, zone) {
	const segs = [];
	for (let j = 0; j < n; j++) {
		for (let i = 0; i < n; i++) {
			if (i + 1 < n) { segs.push({ x0: i, y0: j, x1: i + 1, y1: j, v0: f(i, j), v1: f(i + 1, j), zone: zone || 0 }); }
			if (j + 1 < n) { segs.push({ x0: i, y0: j, x1: i, y1: j + 1, v0: f(i, j), v1: f(i, j + 1), zone: zone || 0 }); }
		}
	}
	return segs;
}
function fieldOf(segs, faults, R, long) {
	const S = C.segmentSet(segs), grid = C.gridAround(S, R, long || 200);
	return { S, grid, F: C.corridorField(S, faults || [], grid, R, { fade: 0.4 }) };
}
function at(Fd, x, y) { const c = C.cellAt(Fd.grid, x, y); return c < 0 ? { v: NaN, a: 0, z: -1 } : { v: Fd.F.val[c], a: Fd.F.alpha[c], z: Fd.F.zone[c] }; }

head('1. FROM A LINK');
{
	// Two parallel pipes, 3 apart: the lower one rising 10 to 20, the upper one level at 40. The grid
	// puts a row of cell centres exactly on the lower pipe.
	const S = C.segmentSet([{ x0: 0, y0: 0, x1: 10, y1: 0, v0: 10, v1: 20, zone: 0 }, { x0: 0, y0: 3, x1: 10, y1: 3, v0: 40, v1: 40, zone: 0 }]);
	// Binary-exact cells, so row 24's centres lie exactly on the lower pipe (y = 0).
	const g1 = { x0: -0.0625, y0: -3.0625, dx: 0.125, dy: 0.125, nx: 82, ny: 72 };
	const F1 = C.corridorField(S, [], g1, 2.5, {}), Fd = { grid: g1, F: F1 };
	let onPipe = 0, onBad = 0;
	for (let i = 0; i < g1.nx; i++) {
		const x = g1.x0 + (i + 0.5) * g1.dx;
		if (x < 0 || x > 10) { continue; }
		onPipe++;
		if (Math.abs(F1.val[24 * g1.nx + i] - (10 + x)) > 1e-9) { onBad++; }
	}
	check(onPipe > 50 && onBad === 0, `on a pipe the field is the pipe's own linear value (${onPipe} cells, ${onBad} off)`);
	let lo = Infinity, hi = -Infinity;
	for (let i = 0; i < F1.val.length; i++) { if (isFinite(F1.val[i])) { lo = Math.min(lo, F1.val[i]); hi = Math.max(hi, F1.val[i]); } }
	const mid = at(Fd, 5, 1.5).v;
	check(lo >= 10 - 1e-9 && hi <= 40 + 1e-9, `beside the pipes the field never leaves the nodes' range: ${lo.toFixed(3)} to ${hi.toFixed(3)}`);
	check(mid > 15 && mid < 40, `halfway between the two pipes it is between their values: ${mid.toFixed(2)}`);
	const far = at(Fd, 5, -2.6);
	check(!(far.a > 0) && isNaN(far.v), 'a point 2.6 from every pipe with a reach of 2.5 is bare (b, in miniature)');
	const near = at(Fd, 5, -1.0), edge = at(Fd, 5, -2.2);
	check(near.a === 1 && edge.a > 0 && edge.a < 1, `the fade: full colour at 1.0 (${near.a}), fading at 2.2 (${edge.a.toFixed(2)})`);
	let mono = true, prev = 2;
	for (let dd = 1.0; dd < 2.5; dd += 0.1) { const a = at(Fd, 5, -dd).a; if (a > prev + 1e-6) { mono = false; } prev = a; }
	check(mono, 'and the alpha only ever falls going away from the pipe');
}

head('2. A WALL');
{
	// A line of pipes A (x 0..5, value 20), a pump from 5 to 6, B (x 6..11, value 80), all one zone
	// (as if the network looped round elsewhere), and the pump's fault.
	const segs = [];
	for (let x = 0; x < 5; x++) { segs.push({ x0: x, y0: 0, x1: x + 1, y1: 0, v0: 20, v1: 20, zone: 0 }); }
	for (let x = 6; x < 11; x++) { segs.push({ x0: x, y0: 0, x1: x + 1, y1: 0, v0: 80, v1: 80, zone: 0 }); }
	const fault = C.faultAcross([{ x: 5, y: 0 }, { x: 6, y: 0 }], 2.5);
	check(Math.abs(fault.mx - 5.5) < 1e-12 && Math.abs(fault.x0 - 5.5) < 1e-12 && Math.abs(Math.abs(fault.y0 - fault.y1) - 5) < 1e-12,
		'the fault crosses the pump at its midpoint, square to it, the reach each side');
	const W = fieldOf(segs, [fault], 2.5, 300), N = fieldOf(segs, [], 2.5, 300);
	const l = at(W, 5.4, 0.3), r = at(W, 5.6, 0.3), ln = at(N, 5.4, 0.3), rn = at(N, 5.6, 0.3);
	check(l.a > 0 && r.a > 0 && Math.abs(l.v - 20) < 1e-6 && Math.abs(r.v - 80) < 1e-6,
		`with the wall, both sides coloured and each its own: ${l.v.toFixed(2)} | ${r.v.toFixed(2)}`);
	check(Math.abs(ln.v - rn.v) < 30, `without it, the colour runs across with no jump: ${ln.v.toFixed(2)} | ${rn.v.toFixed(2)} (so the wall is doing the work)`);
	const lines = C.contourLines(W.F, W.grid, [30, 50, 70], { smooth: 0 }), linesN = C.contourLines(N.F, N.grid, [30, 50, 70], { smooth: 0 });
	const cnt = (ls) => ls.reduce((s, l2) => s + l2.length, 0);
	check(cnt(lines) === 0 && cnt(linesN) > 0, `no contour line along the wall (${cnt(lines)} lines), where the smooth field draws ${cnt(linesN)}`);
	const z = fieldOf([{ x0: 0, y0: 0, x1: 10, y1: 0, v0: 10, v1: 10, zone: 1 }, { x0: 0, y0: 2, x1: 10, y1: 2, v0: 90, v1: 90, zone: 2 }], [], 2.5, 300);
	const z1 = at(z, 5, 0.9), z2 = at(z, 5, 1.1);
	check(z1.v === 10 && z2.v === 90 && z1.z !== z2.z, `two zones a pipe-length apart: ${z1.v} | ${z2.v}, never a blend`);
}

head('3. CONTOUR LINES AND LABELS');
{
	const f = (x, y) => 40 + 6 * x + 4 * y;
	const Fd = fieldOf(gridSegs(10, f), [], 2.5, 300);
	const levels = C.levelsFor(40, 140, 5, 100);
	const raw = C.contourLines(Fd.F, Fd.grid, levels, { smooth: 0 });
	let bad = 0, verts = 0;
	raw.forEach((ls, k) => ls.forEach((pl) => { for (let m = 0; m < pl.pts.length; m += 2) { verts++; if (Math.abs(C.sampleField(Fd.F.val, Fd.grid, pl.pts[m], pl.pts[m + 1]) - levels[k]) > 1e-6) { bad++; } } }));
	check(verts > 500 && bad === 0, `every one of ${verts} unsmoothed line vertices lies on its level`);
	const pieces = raw.reduce((s, ls) => s + ls.length, 0), withLine = raw.filter((ls) => ls.length).length;
	check(pieces <= 2 * withLine, `joined into polylines: ${pieces} pieces for ${withLine} levels, not hundreds of segments`);
	const sm = C.contourLines(Fd.F, Fd.grid, levels, { smooth: 2 });
	let smWorst = 0;
	sm.forEach((ls, k) => ls.forEach((pl) => { for (let m = 0; m < pl.pts.length; m += 2) { const v = C.sampleField(Fd.F.val, Fd.grid, pl.pts[m], pl.pts[m + 1]); if (isFinite(v)) { smWorst = Math.max(smWorst, Math.abs(v - levels[k])); } } }));
	check(smWorst < 1, `smoothed, a line stays within ${smWorst.toFixed(3)} of its level (interval 5)`);
	const ends = sm.every((ls, k) => ls.every((pl, q) => pl.closed || (pl.pts[0] === raw[k][q].pts[0] && pl.pts[pl.pts.length - 1] === raw[k][q].pts[raw[k][q].pts.length - 1])));
	check(ends, 'smoothing keeps an open line\'s two ends exactly where the corridor stopped it');
	const lines = [];
	levels.forEach((lv, k) => sm[k].forEach((pl) => lines.push({ level: lv, pts: pl.pts, closed: pl.closed })));
	const scale = 60, px = 11;
	const placed = C.placeLabels(lines, { scale, height: px, spacing: 200, pad: px, width: (lv) => 0.62 * px * C.levelText(lv, 5).length });
	check(placed.length > 5, `${placed.length} labels placed`);
	check(placed.every((q) => q.angle > -90 && q.angle <= 90), 'every label upright: its angle in (-90, 90]');
	let crowd = 0;
	for (let a = 0; a < placed.length; a++) { for (let b = a + 1; b < placed.length; b++) { if (Math.hypot(placed[a].x - placed[b].x, placed[a].y - placed[b].y) * scale < 2 * px) { crowd++; } } }
	check(crowd === 0, 'no two labels within two text heights of each other');
	let off = 0;
	placed.forEach((q) => { if (Math.abs(C.sampleField(Fd.F.val, Fd.grid, q.x, q.y) - q.level) > 1) { off++; } });
	check(off === 0, 'every label sits on its own line: the field under it is its value');
}

head('4. LEVELS, STEPS, TEXT, COLOUR');
check(JSON.stringify(C.levelsFor(3.2, 21, 5)) === '[5,10,15,20]', 'levels: the multiples of 5 in [3.2, 21]');
check(C.levelsFor(0, 1000, 1, 150) === null, 'more than the cap answers null, not a smear');
check(C.niceStep(0, 130, 10) === 10 && C.niceStep(0, 0.37, 10) === 0.05 && C.niceStep(0, 2600, 10) === 200, 'nice steps 1, 2, 5 times a power of ten');
check(C.levelText(15, 5) === '15' && C.levelText(2.5, 0.5) === '2.5' && C.levelText(-0.0000001, 0.5) === '0.0', 'level text: as many decimals as the step needs');
{
	const segs = [{ x0: 0, y0: 0, x1: 10, y1: 0, v0: 0, v1: 100, zone: 0 }];
	const Fd = fieldOf(segs, [], 2, 200), cols = [[0, 0, 0], [100, 100, 100], [200, 200, 200]], br = [33, 66];
	const smooth = C.fillRGBA(Fd.F, Fd.grid, br, cols, 'smooth'), bands = C.fillRGBA(Fd.F, Fd.grid, br, cols, 'bands');
	const cAt = (data, x, y) => { const c = C.cellAt(Fd.grid, x, y); return [data[4 * c], data[4 * c + 3]]; };
	check(cAt(smooth, -1.9, 1.9)[1] === 0 && cAt(smooth, 5, 0)[1] === 255, 'the fill is transparent off the corridor and opaque on the pipe');
	let rising = true, last = -1;
	for (let x = 0.2; x < 10; x += 0.2) { const v = cAt(smooth, x, 0)[0]; if (v < last - 1e-9) { rising = false; } last = v; }
	const midC = cAt(smooth, 4.95, 0)[0];
	check(rising && midC > 90 && midC < 110, `smooth: the colour rises with the value, the middle class's colour at its middle (${midC})`);
	const flat = cAt(bands, 2, 0)[0] === 0 && cAt(bands, 5, 0)[0] === 100 && cAt(bands, 8, 0)[0] === 200;
	let blended = 0;
	for (let x = 2.8; x < 3.8; x += 0.02) { const v = cAt(bands, x, 0)[0]; if (v > 0 && v < 100) { blended++; } }
	check(flat && blended > 0 && blended < 10, `bands: flat inside each class, anti-aliased over a cell at the limit (${blended} blended samples)`);
}

head('5. THE GROUND, SUBTRACTED');
{
	const segs = gridSegs(5, (i) => 100 - i).map((s) => Object.assign(s, { x0: s.x0 * 10, y0: s.y0 * 10, x1: s.x1 * 10, y1: s.y1 * 10 }));
	const Fd = fieldOf(segs, [], 25, 160);
	const ground = (x, y) => 40 + 30 * Math.exp(-((x - 15) ** 2 + (y - 25) ** 2) / 20);
	let pmin = Infinity;
	for (let j = 0; j < Fd.grid.ny; j++) {
		for (let i = 0; i < Fd.grid.nx; i++) {
			const v = Fd.F.val[j * Fd.grid.nx + i];
			if (isFinite(v)) { pmin = Math.min(pmin, v - ground(Fd.grid.x0 + (i + 0.5) * Fd.grid.dx, Fd.grid.y0 + (j + 0.5) * Fd.grid.dy)); }
		}
	}
	let nodeMin = Infinity;
	for (let j = 0; j < 5; j++) { for (let i = 0; i < 5; i++) { nodeMin = Math.min(nodeMin, 100 - i - ground(i * 10, j * 10)); } }
	check(pmin < nodeMin - 20, `pressure over the hill reaches ${pmin.toFixed(1)}, below every node's ${nodeMin.toFixed(1)}`);
}

// ================================================================================================
// THE PAGE
// ================================================================================================
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
	"\t\tcontourField: function () { return contourField; },\n" +
	"\t\tcontourLayer: function () { return contourLayer; }, showContour: showContour, openContourBox: openContourBox,\n" +
	"\t\tdrawContourLabels: drawContourLabels, setScale: function (s) { state.s = s; },\n" +
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
	"\t\tnewPlain: function () { doc = { nodes: [], links: [], labels: [], customers: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'P', docId: 'plain-test', activeScenario: 'base' };\n" +
	"\t\t\tscenarios = defaultScenarios(); settings = defaultSettings(); seedDefaultInputs(); lastSolveResult = null; },\n"
);
const EngCalcs = global.EngCalcs;

function kids(e) { return (e && e.children) || []; }
function cls(e) { return String((e && e.getAttribute && e.getAttribute('class')) || ''); }
function layerAll() {
	const out = [];
	(function walk(e) { kids(e).forEach((c) => { out.push(c); walk(c); }); }(L.contourLayer()));
	return out;
}
function layerOf(c) { return layerAll().filter((e) => cls(e).split(' ').indexOf(c) >= 0); }
function findIn(host, id) {
	let hit = null;
	(function walk(e) { if (!e || hit) { return; } if (e.id === id) { hit = e; return; } kids(e).forEach(walk); }(host));
	return hit;
}
function fireEl(el, type) { ((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el, currentTarget: el })); }
function fieldAt(x, y) {
	const cf = L.contourField(); if (!cf) { return { v: NaN, a: 0 }; }
	const c = C.cellAt(cf.grid, x, y);
	return c < 0 ? { v: NaN, a: 0 } : { v: cf.field.val[c], a: cf.field.alpha[c] };
}
function allD() { return layerAll().map((p) => (p.getAttribute && (p.getAttribute('d') || p.getAttribute('x'))) || '').join('|') + '#' + (L.contourField() && L.contourField().key); }
function pathPts(p) {
	const d = p.getAttribute('d') || '', out = [], re = /[ML]([-\d.e]+) ([-\d.e]+)/g;
	let m;
	while ((m = re.exec(d))) { out.push([+m[1], +m[2]]); }
	return out;
}

// THE LOOPS OF A NETWORK: the bounded faces of its drawing as a plane graph, traced by half-edges.
// Returns [{poly: [[x, y], ...], area}] for every face but the outside one of each piece.
function loopsOf(nodesXY, edges) {
	const out = {}, used = {};
	edges.forEach(([a, b]) => { if (a === b || !nodesXY[a] || !nodesXY[b]) { return; } (out[a] = out[a] || []).push(b); (out[b] = out[b] || []).push(a); });
	Object.keys(out).forEach((v) => {
		const [vx, vy] = nodesXY[v];
		out[v] = Array.from(new Set(out[v])).sort((p, q) => Math.atan2(nodesXY[p][1] - vy, nodesXY[p][0] - vx) - Math.atan2(nodesXY[q][1] - vy, nodesXY[q][0] - vx));
	});
	const faces = [];
	Object.keys(out).forEach((u) => out[u].forEach((v) => {
		if (used[u + '>' + v]) { return; }
		const poly = []; let a = u, b = v, guard = 0;
		while (!used[a + '>' + b] && guard++ < 10000) {
			used[a + '>' + b] = 1; poly.push(nodesXY[a]);
			const list = out[b], k = list.indexOf(a);
			const c = list[(k - 1 + list.length) % list.length];
			a = b; b = c;
		}
		let area = 0;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { area += (poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1]) / 2; }
		faces.push({ poly, area });
	}));
	// Every loop turns one way; the outside of each connected piece turns the other, and there are
	// far fewer of those.
	const pos = faces.filter((f) => f.area > 1e-9), neg = faces.filter((f) => f.area < -1e-9);
	return (pos.length >= neg.length ? pos : neg).map((f) => ({ poly: f.poly, area: Math.abs(f.area) }));
}
function inPoly(poly, x, y) {
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i], [xj, yj] = poly[j];
		if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) { inside = !inside; }
	}
	return inside;
}
function loopSamples(loops) {
	return loops.map((f) => {
		let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
		f.poly.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
		const pts = [];
		for (let a = 1; a < 12; a++) { for (let b = 1; b < 12; b++) { const x = x0 + (x1 - x0) * a / 12, y = y0 + (y1 - y0) * b / 12; if (inPoly(f.poly, x, y)) { pts.push([x, y]); } } }
		return pts;
	}).filter((p) => p.length);
}

byId.lpn_canvas.appendChild(byId.lpn_labels_legend);

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.setScale(1);

	head('6. NET3 THROUGH THE PAGE');
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net3');
	L.setDoc(d); L.setSettings(d.settings); L.applyUnitSelections(d.units);
	d.settings.autoRun = false;
	check(!d.settings.contourFill && !d.settings.contourLines, 'a project opens with no contour plot');
	L.runSolve();
	for (let i = 0; i < 400 && !L.lastResult(); i++) { await new Promise((r) => setTimeout(r, 25)); }
	check(!!L.lastResult(), 'Net3 solved');
	d.settings.colorNodeField = 'pressure';
	L.refreshValueColors();
	check(layerAll().length === 0, 'colouring the nodes alone draws no contour');
	L.showContour();
	const S = L.contourStats();
	check(d.settings.contourFill === 'smooth' && d.settings.contourLines === true, 'Graphs > Contour turns on a smooth fill and contour lines');
	check(findIn(byId.lpn_contour_body, 'lpn_contour_interval') !== null, '...and opens the contour box');
	const ml = L.modelLayer();
	check(ml.children[0] === L.contourLayer() && ml.children.indexOf(L.linksLayer()) > 0,
		'the layer is the first child of the drawing group: under the pipes and the nodes');
	check(L.contourLayer().getAttribute('pointer-events') === 'none', 'and it never takes a click');
	check(layerOf('lpn-contour-fill').length === 1 && String(layerOf('lpn-contour-fill')[0].getAttribute('opacity')) === '0.6',
		'one fill image, at the 60% opacity Tom asked for');
	const juncWithP = d.nodes.filter((n) => n.type === 'junction' && isFinite(L.colorNodeValue(n, 'pressure'))).length;
	check(S.n === juncWithP, `pressure: the plot stands on the ${juncWithP} junctions alone, no tank or reservoir: ${S.n}`);
	const want = PC.lpn_contour_support.replace('{n}', String(S.n)).replace('{p}', String(S.pipes)).replace('{k}', '2.5');
	check(L.legendText().indexOf(want) >= 0, `the legend carries the support sentence: "${want}"`);
	check(L.legendText().indexOf(PC.lpn_contour_support_lines.replace('{i}', '5').replace('{u}', 'psi')) >= 0, '...and says the lines are every 5 psi');

	// (a) THE LOOPS, at four multiples of the median pipe length.
	const xy = {}, edges = [];
	d.nodes.forEach((n) => { xy[n.id] = [L.nodeDrawX(n), L.nodeDrawY(n)]; });
	d.links.forEach((l) => edges.push([l.from, l.to]));
	const loops = loopsOf(xy, edges), samples = loopSamples(loops);
	const table = [];
	for (const k of [1.5, 2, 2.5, 3]) {
		d.settings.contourBuffer = k;
		L.refreshValueColors();
		let pts = 0, colored = 0, opaque = 0, full = 0;
		samples.forEach((ps) => {
			let all = true;
			ps.forEach(([x, y]) => { const f = fieldAt(x, y); pts++; if (f.a > 0) { colored++; } else { all = false; } if (f.a >= 1) { opaque++; } });
			if (all) { full++; }
		});
		table.push({ k, loops: samples.length, full, colored: colored / pts, opaque: opaque / pts });
		console.log(`         buffer ${k} x median: ${full} of ${samples.length} loops wholly coloured; ${(100 * colored / pts).toFixed(1)}% of loop interiors coloured, ${(100 * opaque / pts).toFixed(1)}% at full strength`);
	}
	d.settings.contourBuffer = 2.5;
	L.refreshValueColors();
	const at25 = table.find((t) => t.k === 2.5), at15 = table.find((t) => t.k === 1.5);
	check(samples.length >= 20 && at25.full === at25.loops, `(a) at the default 2.5, every one of Net3's ${at25.loops} loops is coloured through`);
	check(at15.full < at15.loops, `...and at 1.5 some loop has a bare hole (${at15.full} of ${at15.loops}), so the measure can fail`);

	// (b) FAR FROM EVERY LINK.
	let x0 = Infinity, x1 = -Infinity, y0 = Infinity;
	Object.values(xy).forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); });
	const cf = L.contourField();
	const corner = C.cellAt(cf.grid, cf.grid.x0 + cf.grid.dx / 2, cf.grid.y0 + cf.grid.dy / 2);
	check(fieldAt(x1 + 0.4 * (x1 - x0), y0 - 0.4 * (x1 - x0)).a === 0 && cf.field.alpha[corner] === 0, '(b) a point far from every link, and the corner of the grid, are bare');

	// (c) THE PUMPS. Pump 335 lifts from the river's zone into the network's: the colour jumps across
	// it and a break line is drawn there. (Pump 10, from the lake, is closed and has no pressure on
	// its lake side to differ from, so nothing is drawn across it.)
	const p335 = d.links.find((l) => l.id === '335'), a335 = L.nodeById(p335.from), b335 = L.nodeById(p335.to);
	const ax = L.nodeDrawX(a335), ay = L.nodeDrawY(a335), bx = L.nodeDrawX(b335), by = L.nodeDrawY(b335);
	const side = (f) => fieldAt(ax + f * (bx - ax), ay + f * (by - ay));
	const before335 = side(0.2), after335 = side(0.8);
	check(before335.a > 0 && after335.a > 0 && Math.abs(after335.v - before335.v) > 20,
		`(c) across pump 335 the colour jumps: ${before335.v.toFixed(1)} psi on the suction side, ${after335.v.toFixed(1)} on the discharge`);
	const plen = Math.hypot(bx - ax, by - ay), mx = (ax + bx) / 2, my = (ay + by) / 2;
	const breakPts = [].concat(...layerOf('lpn-contour-break').map(pathPts));
	const nearest = Math.min(...breakPts.map(([x, y]) => Math.hypot(x - mx, y - my)));
	check(S.walls >= 1 && nearest < 2 * plen, `(c) a break line is drawn at pump 335: ${S.walls} break line(s), the nearest point ${(nearest / plen).toFixed(2)} pump lengths from its middle`);
	// The line separates the two sides: the suction side's colour is on one side of it only.
	const crossesPump = layerOf('lpn-contour-break').some((p) => { const q = pathPts(p); for (let i = 0; i + 1 < q.length; i++) {
		const [x1a, y1a] = q[i], [x2a, y2a] = q[i + 1];
		const d1 = (bx - ax) * (y1a - ay) - (by - ay) * (x1a - ax), d2 = (bx - ax) * (y2a - ay) - (by - ay) * (x2a - ax);
		const d3 = (x2a - x1a) * (ay - y1a) - (y2a - y1a) * (ax - x1a), d4 = (x2a - x1a) * (by - y1a) - (y2a - y1a) * (bx - x1a);
		if ((d1 > 0) !== (d2 > 0) && (d3 > 0) !== (d4 > 0)) { return true; } } return false; });
	check(crossesPump, '(c) and it crosses the pump between its two ends, the retaining wall across the corridor');

	// (d) THE LINES AND THEIR LABELS.
	const lineEls = layerOf('lpn-contour-line');
	const lvls = lineEls.map((p) => +p.getAttribute('data-level'));
	check(lineEls.length >= 8 && lvls.every((v) => Math.abs(v / 5 - Math.round(v / 5)) < 1e-9), `(d) ${lineEls.length} contour lines, every one at a multiple of 5 psi`);
	check(layerOf('lpn-contour-index').length > 0 && layerOf('lpn-contour-index').every((p) => +p.getAttribute('data-level') % 25 === 0), 'every fifth level (25 psi) is an index contour');
	// A scale an engineer would see Net3 at: the whole network across 1000 px, then zoomed 3 times.
	const fit = 1000 / (x1 - x0);
	L.setScale(3 * fit); L.drawContourLabels();
	const labels = layerOf('lpn-contour-label');
	let wrong = 0, offLine = 0;
	labels.forEach((t) => {
		const lv = +t.getAttribute('data-level'), x = +t.getAttribute('x'), y = +t.getAttribute('y');
		if (t.textContent !== C.levelText(lv, 5)) { wrong++; }
		const cfl = L.contourField(), v = C.sampleField(cfl.field.val, cfl.grid, x, y);
		if (!(Math.abs(v - lv) < 2.5)) { offLine++; if (process.env.CDEBUG) { console.log('OFF', lv, v, x, y); } }
	});
	check(labels.length >= 5 && wrong === 0, `(d) ${labels.length} labels, each printing its own level`);
	check(offLine === 0, '(d) the field under every label is within half an interval of it: it labels the line it sits on');
	check(labels.every((t) => { const m = /rotate\(([-\d.]+)/.exec(t.getAttribute('transform')); return m && +m[1] > -90 && +m[1] <= 90; }), 'every label upright');
	check(labels.length && Math.abs(+labels[0].getAttribute('font-size') - 11 / (3 * fit)) < 1e-9, 'a label is 11 px on screen at any zoom');
	L.setScale(fit); L.drawContourLabels();
	const fitLabels = layerOf('lpn-contour-label').length;
	check(fitLabels > 0 && fitLabels < labels.length, `zoomed out, fewer labels fit: ${fitLabels} at the whole-network view, ${labels.length} zoomed in 3 times`);

	// Timing: a cold field, then the cached redraw a colour change costs.
	let cold = Infinity, warm = Infinity;
	for (let i = 0; i < 5; i++) { d.settings.contourBuffer = 2.5 + ((i % 2) + 1) * 1e-9; L.refreshValueColors(); cold = Math.min(cold, L.contourStats().ms); }
	for (let i = 0; i < 5; i++) { L.refreshValueColors(); warm = Math.min(warm, L.contourStats().ms); }
	d.settings.contourBuffer = 2.5; L.refreshValueColors();
	console.log(`         Net3: ${L.contourStats().cells} cells; field and lines ${cold.toFixed(1)} ms, cached redraw ${warm.toFixed(1)} ms`);
	check(cold < 1500 && warm < cold, `Net3 builds in ${cold.toFixed(0)} ms and a cached redraw takes ${warm.toFixed(0)} ms`);
	check(JSON.parse(JSON.stringify(L.serialize())).settings.contourFill === 'smooth', 'the contour settings ride in the project');

	head('7. THE BOX');
	const box = byId.lpn_contour_body;
	const q = (id) => findIn(box, id);
	check(q('lpn_contour_interval') && q('lpn_contour_interval').value === '5', 'the interval box reads 5 (psi) to start');
	const n5 = layerOf('lpn-contour-line').length;
	q('lpn_contour_interval').value = '10'; fireEl(q('lpn_contour_interval'), 'change');
	const lv10 = layerOf('lpn-contour-line').map((p) => +p.getAttribute('data-level'));
	check(d.settings.contourInterval['pressure|psi'] === 10 && lv10.length > 0 && lv10.length < n5 && lv10.every((v) => v % 10 === 0),
		`(e) interval 10: the layer redraws with ${lv10.length} lines (was ${n5}), every one a multiple of 10`);
	q('lpn_contour_opacity').value = '30'; fireEl(q('lpn_contour_opacity'), 'change');
	check(String(layerOf('lpn-contour-fill')[0].getAttribute('opacity')) === '0.3', '(e) opacity 30%: the fill redraws at 0.3');
	q('lpn_contour_fill').value = 'bands'; fireEl(q('lpn_contour_fill'), 'change');
	check(d.settings.contourFill === 'bands' && layerOf('lpn-contour-fill').length === 1, 'fill Bands: still one fill');
	q('lpn_contour_fill').value = ''; fireEl(q('lpn_contour_fill'), 'change');
	check(layerOf('lpn-contour-fill').length === 0 && layerOf('lpn-contour-line').length > 0, 'fill None: lines alone');
	q('lpn_contour_labels').checked = false; fireEl(q('lpn_contour_labels'), 'change');
	check(layerOf('lpn-contour-label').length === 0 && layerOf('lpn-contour-line').length > 0, 'labels off: lines without labels');
	q('lpn_contour_labels').checked = true; fireEl(q('lpn_contour_labels'), 'change');
	q('lpn_contour_lines').checked = false; fireEl(q('lpn_contour_lines'), 'change');
	check(layerAll().length === 0, 'fill None and lines off: the plot is off');
	q('lpn_contour_lines').checked = true; fireEl(q('lpn_contour_lines'), 'change');
	q('lpn_contour_fill').value = 'smooth'; fireEl(q('lpn_contour_fill'), 'change');
	q('lpn_contour_opacity').value = '60'; fireEl(q('lpn_contour_opacity'), 'change');
	q('lpn_contour_interval').value = '5'; fireEl(q('lpn_contour_interval'), 'change');
	q('lpn_contour_buffer').value = '1.5'; fireEl(q('lpn_contour_buffer'), 'change');
	check(d.settings.contourBuffer === 1.5 && L.contourStats().k === 1.5, 'the buffer box sets the reach');
	q('lpn_contour_buffer').value = '2.5'; fireEl(q('lpn_contour_buffer'), 'change');
	check(q('lpn_set_ramp_node_contour') !== null, 'the colour scheme picker is the node colouring\'s own, with ids of its own');

	head('8. RECALCULATE OFF IS A SNAPSHOT');
	const before = allD();
	const j = d.nodes.filter((n) => n.type === 'junction')[10];
	j.elev = (j.elev || 0) + 200;
	L.scheduleSolve();
	await new Promise((r) => setTimeout(r, 400));
	check(allD() === before && before.length > 0, 'an edit with Recalculate off leaves the plot exactly as it was');
	L.runSolve();
	for (let i = 0; i < 400 && allD() === before; i++) { await new Promise((r) => setTimeout(r, 25)); }
	check(allD() !== before, 'Calculate redraws it');

	head('9. THE GROUND THROUGH THE PAGE');
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
	ids.forEach((id, k) => { heads[id] = 100; pressures[id] = 100 - groundM(lon0 + (k % 4) * dLon, lat0 + Math.floor(k / 4) * dLat); });
	L.setResult({ ok: true, converged: true, heads, pressures, flows: {}, headlosses: {}, velocities: {}, statuses: {} });
	S2.colorNodeField = 'pressure';
	S2.contourLines = true; S2.contourFill = '';
	S2.contourTerrain = true;
	function pixelLonLat(tile, p) {
		const n = Math.pow(2, tile.z);
		return { lon: (tile.x + (p.px + 0.5) / 256) / n * 360 - 180,
			lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * (tile.y + (p.py + 0.5) / 256) / n))) * 180 / Math.PI };
	}
	let tileCalls = 0;
	EngCalcs.lpnTerrainFetchPixels = function (tile) {
		tileCalls++;
		return Promise.resolve(tile.points.map((p) => {
			const ll = pixelLonLat(tile, p), qq = Math.round((groundM(ll.lon, ll.lat) + 10000) / 0.1);
			return { id: p.id, r: (qq >> 16) & 255, g: (qq >> 8) & 255, b: qq & 255 };
		}));
	};
	PC.lpn_mapbox_token = 'pk.test-token';
	L.refreshValueColors();
	await new Promise((r) => setTimeout(r, 50));
	check(tileCalls === 0 && !L.contourStats().dem, 'without a stored yes, nothing is fetched and the plot between nodes stands');
	L.openContourBox();
	const demBox = findIn(byId.lpn_contour_body, 'lpn_contour_dem');
	check(!!demBox && demBox.checked === false && S2.contourTerrain === true,
		'a saved tick with no yes in this browser shows UNticked, the project setting kept');
	confirmAnswer = false; confirmText = null;
	demBox.checked = true; fireEl(demBox, 'change');
	const paras = String(confirmText || '').split('\n\n');
	check(paras.length === 4 && paras.every((t, i) => t === PC['lpn_contour_consent_' + (i + 1)]),
		'ticking asks the contour question, its own four paragraphs');
	check(/tile numbers/.test(paras[1]) && /tile numbers/.test(paras[2]) && !/node position|coordinates|latitude/i.test(confirmText || ''),
		'paragraphs 2 and 3 say tile numbers too, never node positions or coordinates');
	check(S2.contourTerrain === false && tileCalls === 0, 'a no unticks it, stores nothing and fetches nothing');
	S2.contourTerrain = true;
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
	check(layerOf('lpn-contour-line').length > 0, 'the contour lines are drawn from the ground-subtracted field');
	const callsBefore = tileCalls, res = L.lastResult();
	for (let c = 0; c < 4; c++) {
		const lk = L.getDoc().links.find((l) => l.from === ids[c] && l.to === ids[4 + c]);
		res.statuses[lk.id] = 'closed';
	}
	L.refreshValueColors();
	await new Promise((r) => setTimeout(r, 50));
	check(tileCalls === callsBefore && L.contourStats().dem > 0,
		`closing pipes re-reads no ground: ${tileCalls - callsBefore} more tile request(s)`);
	check(realFetches === 0, 'no real network request was made');

	head('10. TWO ARMS THROUGH THE PAGE');
	function twoArms(gap, joinType, closed) {
		L.newPlain();
		const S3 = L.getSettings(), grid = [];
		[0, 5 + gap].forEach((x0a) => {
			for (let r = 0; r < 6; r++) { for (let c = 0; c < 6; c++) { const n = L.addNode('junction', 0, 0); n.x = x0a + c; n.y = r; n.elev = x0a ? 300 : 100; grid.push(n.id); } }
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
		const jl = L.addLink(joinType, grid[2 * 6 + 5], grid[36 + 2 * 6]);
		if (closed) { jl._status = 'closed'; }
		S3.colorNodeField = 'elev';
		S3.contourFill = 'smooth'; S3.contourLines = true;
		L.refreshValueColors();
		return 5 + gap / 2;
	}
	let px = twoArms(8, 'pipe', false);
	check(fieldAt(px, 5).a === 0 && fieldAt(2.5, 2.5).a > 0 && fieldAt(15.5, 2.5).a > 0,
		'a gap of 8 pipe lengths: the arms are coloured, the gap away from the joining pipe is not');
	px = twoArms(1, 'pump', false);
	const lft = fieldAt(px - 0.1, 2.3), rgt = fieldAt(px + 0.1, 2.3);
	check(lft.a > 0 && rgt.a > 0 && Math.abs(lft.v - 100) < 1e-6 && Math.abs(rgt.v - 300) < 1e-6 && L.contourStats().walls === 1,
		`a gap of 1 joined by a pump: coloured both sides, ${lft.v} | ${rgt.v}, and one wall`);
	const wall = [].concat(...layerOf('lpn-contour-break').map(pathPts)), wy = wall.map((w) => w[1]);
	check(wall.length >= 2 && wall.every((w) => Math.abs(w[0] - px) < 0.05) && Math.max(...wy) - Math.min(...wy) > 4,
		`the break line stands across the corridor at the pump: x ${wall.length && wall[0][0].toFixed(3)}, y ${Math.min(...wy).toFixed(2)} to ${Math.max(...wy).toFixed(2)}`);
	let crossing = 0;
	layerOf('lpn-contour-line').forEach((p) => { const qq = pathPts(p); for (let i = 0; i + 1 < qq.length; i++) { if ((qq[i][0] - px) * (qq[i + 1][0] - px) < 0 && Math.abs(qq[i][1] - 2) < 2) { crossing++; } } });
	check(crossing === 0, 'no contour line crosses the wall');
	px = twoArms(1, 'pipe', true);
	check(fieldAt(px - 0.1, 2.3).v === 100 && fieldAt(px + 0.1, 2.3).v === 300 && L.contourStats().walls === 1,
		'the same gap joined by a CLOSED pipe: a wall too');
	px = twoArms(1, 'pipe', false);
	const mv = fieldAt(px, 2).v;
	check(mv > 100 && mv < 300 && L.contourStats().walls === 0, `joined by an open pipe: one zone, no wall, the colour runs across (${mv.toFixed(1)})`);

	head('11. A LARGER NETWORK');
	L.newPlain();
	const S4 = L.getSettings(), N = 40, gid = [];
	for (let r = 0; r < N; r++) { for (let c = 0; c < N; c++) { const n = L.addNode('junction', 0, 0); n.x = c * 100 + (rnd() - 0.5) * 30; n.y = r * 100 + (rnd() - 0.5) * 30; n.elev = 50 + 20 * Math.sin(c / 6) + 15 * Math.cos(r / 5); gid.push(n.id); } }
	for (let r = 0; r < N; r++) { for (let c = 0; c < N; c++) { const k = r * N + c; if (c < N - 1 && rnd() > 0.1) { L.addLink('pipe', gid[k], gid[k + 1]); } if (r < N - 1 && rnd() > 0.1) { L.addLink('pipe', gid[k], gid[k + N]); } } }
	S4.colorNodeField = 'elev'; S4.contourFill = 'smooth'; S4.contourLines = true;
	let big = Infinity;
	for (let i = 0; i < 3; i++) { S4.contourBuffer = 2.5 + (i + 1) * 1e-9; L.refreshValueColors(); big = Math.min(big, L.contourStats().ms); }
	console.log(`         ${N * N} junctions, ${L.getDoc().links.length} pipes: ${L.contourStats().cells} cells, ${big.toFixed(1)} ms`);
	check(big < 4000, `a ${N * N}-junction network builds in ${big.toFixed(0)} ms`);

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
