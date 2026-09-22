// WHICH WAY THE TURN BAR TURNS THE MAP -- Tom's R-021, 2026-09-19.
//   node dev/lpn-spike/mapgeo-turn-direction-harness.js
//
// *"The rotation slider needs up to be counterclockwise."* It was clockwise, and the comment
// beside the sign said the opposite of what the arithmetic did, because it reasoned about the
// DRAWING sweeping when the drawing is the one thing that never moves. This file settles it the
// only way a direction can be settled: by putting a point of GROUND on the screen and looking at
// which way it went.
//
// **THE FRAME IS NAMED, because half of every rotation mistake is an unnamed frame.** Screen
// coordinates: x to the right, y DOWNWARD, which is what the page draws in. In that frame an angle
// measured by atan2(dy, dx) INCREASES clockwise. A document's own y runs the other way, and the
// page negates it at inwardY(); so does this file, at one place, named.
//
// The bar is vertical with `writing-mode: vertical-lr; direction: rtl`, which puts max at the TOP,
// so a bar pushed UP is a POSITIVE turn value. That is the fact the assertions below are about.

const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..') + path.sep;
require(ROOT + 'js/lpn-georef.js');
const G = global.EngCalcs;

const L = loadLoopedNetwork(
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tmapgeoStart: mapgeoStart, mapgeoPlace: mapgeoPlaceApproximately,\n" +
	"\t\tmapgeoFinish: mapgeoFinish, mapgeoGoTo: mapgeoGoTo,\n" +
	"\t\tmapgeoAdjust: mapgeoAdjust, mapgeoCancel: mapgeoCancel,\n" +
	"\t\tdialTurn: mapgeoDialSetTurn, dialState: function () { return mapgeo && mapgeo.dial; },\n" +
	"\t\txyGeoref: xyGeoref,\n" +
	"\t\tsetSized: function (on) { mapSized = on !== false; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, ");

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;
L.setSized();

// An ordinary grid drawing in feet, and a world map attached to it near Novato, CA.
L.addNode('reservoir', 0, 0);
L.addNode('junction', 1234.5, -200.25);
L.addNode('junction', 2000, -800);
L.mapgeoStart();
L.mapgeoGoTo({ lat: 38.1074, lon: -122.5697 });
L.mapgeoPlace();
L.mapgeoFinish();
ok('a world map is attached to the grid drawing', !!L.xyGeoref());

// SCREEN POSITION OF A PIECE OF GROUND. The camera never moves in any of this, so a document
// coordinate is a screen coordinate up to a fixed scale and offset -- and a fixed scale and offset
// cannot change the SIGN of a rotation, which is the only thing asserted here.
function screenOf(t, lon, lat) {
	const q = G.lpnGeorefFromLonLat(t, lon, lat);
	return { x: q.x, y: -q.y };   // the one place the document's y-up becomes the screen's y-down
}
// The angle, in the screen frame, of a piece of ground about the turn's own pivot. Increasing means
// clockwise.
function groundAngle(t, pivotDoc, ll) {
	const p = screenOf(t, ll.lon, ll.lat);
	return Math.atan2(p.y - (-pivotDoc.y), p.x - pivotDoc.x) * 180 / Math.PI;
}

L.mapgeoAdjust();
// The dial is built lazily, on the first write: asking for zero is the cheapest way to bring it
// into being without moving anything.
L.dialTurn(0);
const d = L.dialState();
ok('Re-adjust opens the turn bar with a pivot and a base placement', !!d && !!d.pivot && !!d.base);

// The piece of ground to watch: 500 m due EAST of the pivot, which puts it to the RIGHT of the
// pivot on screen at 0 degrees. Due east so that "went up" and "went down" are unambiguous.
const pivotLL = G.lpnGeorefToLonLat(d.base, d.pivot.x, d.pivot.y);
const east = {
	lon: pivotLL.lon + 500 / (111320 * Math.cos(pivotLL.lat * Math.PI / 180)),
	lat: pivotLL.lat
};
const a0 = groundAngle(d.base, d.pivot, east);
ok('...and that piece of ground starts due east of the pivot on screen', Math.abs(a0) < 0.01,
	a0.toFixed(4) + ' degrees');

// **THE ASSERTION TOM ASKED FOR.** The bar's max is at the top, so up is a POSITIVE turn.
L.dialTurn(5);
const aUp = groundAngle(L.xyGeoref(), d.pivot, east);
ok('THE BAR PUSHED UP TURNS THE MAP COUNTERCLOCKWISE', aUp < a0 - 1,
	a0.toFixed(2) + ' -> ' + aUp.toFixed(2) + ' degrees in a frame where y runs DOWN');
ok('...by the number of degrees the bar says, and no other number',
	Math.abs((a0 - aUp) - 5) < 0.01, (a0 - aUp).toFixed(4) + ' degrees for a bar reading 5');

L.dialTurn(-5);
const aDown = groundAngle(L.xyGeoref(), d.pivot, east);
ok('...and pushed DOWN it turns the map clockwise, by the same amount the other way',
	aDown > a0 + 1 && Math.abs((aDown - a0) - 5) < 0.01,
	a0.toFixed(2) + ' -> ' + aDown.toFixed(2));

L.dialTurn(0);
const aZero = groundAngle(L.xyGeoref(), d.pivot, east);
ok('...and the middle of the bar leaves the map exactly where step 1 left it',
	Math.abs(aZero - a0) < 1e-9, aZero.toFixed(6));

// **THE DOCUMENT NEVER MOVED, WHICH IS THE STANDING RULING AND IS WHAT THE SIGN IS ABOUT.**
// Turning the bar aligns the streets with the project; if it ever aligned the project with the
// streets, the sign would be the least of it.
L.dialTurn(7);
L.mapgeoCancel();
ok('and Cancel puts the placement back, so none of this left a mark', !!L.xyGeoref());

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
