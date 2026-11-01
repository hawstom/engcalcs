// A stale view scale must never lay a million label stations on one pipe. Run with:
//   node dev/lpn-spike/label-station-cap-harness.js
// 2026-10-27: a label pass with a stale scale put 1,045,277 positions on one Net3 pipe.
// linkLabelStations() caps n at LPN_LABEL_STATIONS_MAX; every ordinary case is unchanged.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tstations: linkLabelStations, spacing: labelRepeatSpacing,\n" +
	"\t\tpipeLength: function (id) { return Geom.polylineLength(linkPointList(linkById(id))); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++; console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setCanvas(1000, 1000);
L.setZoom(1);
const doc = L.getDoc();
const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 10000, 0);
const link = L.addLink('pipe', a.id, b.id), id = link.id;

// Normal case: n = ceil(len / spacing), stations (i + 0.5)/n.
const sp = L.spacing(), len = L.pipeLength(id), nWant = Math.ceil(len / sp);
const st = L.stations(link);
ok('normal case: ' + nWant + ' stations, uncapped', nWant < 10000 && st.length === nWant, st.length);
ok('normal case: stations are (i+0.5)/n', st.every((v, i) => Math.abs(v - (i + 0.5) / nWant) < 1e-12));

// Absurd scale: spacing collapses to near zero.
L.setZoom(1e9);
const t0 = Date.now();
const huge = L.stations(link);
const ms = Date.now() - t0;
ok('absurd scale: count bounded (' + huge.length + ')', huge.length <= 10000 && huge.length > 1);
ok('absurd scale: returns fast (' + ms + ' ms)', ms < 500);
ok('absurd scale: stations still even and inside (0,1)', huge.every((v, i) => v > 0 && v < 1 && Math.abs(v - (i + 0.5) / huge.length) < 1e-12));
L.setZoom(1);
ok('restoring the scale restores the normal count', L.stations(link).length === nWant);

console.log(fails ? fails + ' FAILED' : 'all passed');
process.exit(fails ? 1 : 0);
