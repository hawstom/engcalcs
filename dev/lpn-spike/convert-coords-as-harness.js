// FILE, CONVERT COORDINATES AS -- Tom's design of 2026-09-18.
//
//   node dev/lpn-spike/convert-coords-as-harness.js
//
// Tom, 2026-09-18: *"We need a working menu item to convert coordinates as a new project."* His
// design in three steps: the row becomes File, Convert coordinates as; it makes a duplicate tab
// named `Copy of {project_name}`; the conversion wizard runs on THAT copy.
//
// **WHAT THIS HARNESS IS FOR IS THE HALF THAT CANNOT BE SEEN BY USING IT: the project you were
// looking at must come through untouched.** Converting is the one path in this page that really
// does rewrite every coordinate, which is why it may only ever do so to a COPY -- the same
// argument a Save as makes. So the original's saved bytes are compared before and after, and the
// copy is required to be a different document rather than a second tab onto the same one.
//
// `CONVERT_AS_MUTATE=1` makes the command convert in place instead of copying, and the run must go
// RED. Without that leg an assertion that nothing changed would pass just as happily if the command
// did nothing at all.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () { };
global.prompt = global.window.prompt = function () { return null; };

const MUTATE = process.env.CONVERT_AS_MUTATE === '1';

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink, serialize: serializeProject,\n" +
	"\t\tconvertCoordsAs: convertCoordsAs,\n" +
	"\t\tdisplayName: function () { return projectDisplayName(project); },\n" +
	"\t\tnewProject: newProject, saveToStorage: saveToStorage,\n" +
	"\t\tlibrary: function () { return library; },\n" +
	"\t\tswitchToTab: switchToTab,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, ",
	null,
	MUTATE ? function (src) {
		// CONVERT IN PLACE: the defect this command exists not to be. The copy is still made, so
		// the tab count and the name still come out right; only the original is damaged.
		return src.replace(
			"\t\tlandProjectText(JSON.stringify(saved), true, name);",
			"\t\tif (doc.nodes[1]) { doc.nodes[1].x = doc.nodes[1].x * (1 + 1e-9); }\n" +
			"\t\tlandProjectText(JSON.stringify(saved), true, name);");
	} : null
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');

// A REAL project in the library, not a bare document: the property under test is what lands in
// storage for the tab you came from, and a document nobody ever opened has no storage at all.
L.newProject(null, '');

const R = L.addNode('reservoir', 0, 0);
const A = L.addNode('junction', 1234.5, -200.25);
const B = L.addNode('junction', 2000, -800);
R._head = 250; R.elev = 250; A.elev = 100; B.elev = 90; A._demand = 120; B._demand = 80;
L.addLink('pipe', R.id, A.id);
L.addLink('pipe', A.id, B.id);

const PC = global.EngCalcs.pageConfig || {};
const lib = L.library();
const originalId = lib.openId;
const originalName = L.displayName();

// **THE BYTES, NORMALISED THE ONE WAY THE COPY IS ALLOWED TO DIFFER.** A copy is a different
// document with a different name on a different plane, so those three fields are lifted out and
// everything else -- every coordinate, every elevation, every demand -- must match.
function normalize(saved) {
	const s = JSON.parse(JSON.stringify(saved));
	delete s.project.georef; delete s.project.basemap; delete s.project.coords;
	delete s.project.name; delete s.project.docId; delete s.view; delete s.origin;
	return JSON.stringify(s);
}
function storedBytes(id) {
	const raw = global.localStorage.getItem('lpn_project_' + id);
	return raw ? normalize(JSON.parse(raw)) : null;
}
L.saveToStorage();
const beforeBytes = normalize(L.serialize());

L.convertCoordsAs();

ok('the copy is the project now on screen', lib.openId !== originalId, lib.openId);
ok('the copy is named after the project it came from',
	L.getProject().name === String(PC.lpn_copy_of).replace('{name}', originalName),
	L.getProject().name);
ok('the copy has the whole network in it', L.getDoc().nodes.length === 3, L.getDoc().nodes.length);
ok('the copy is the one being placed on the map', L.getProject().coords === 'geo',
	String(L.getProject().coords));

// **THE ORIGINAL IS THE POINT.** Read back out of storage rather than off the live document,
// because storage is what the other tab, and a reload, will get.
ok('CONVERTING LEAVES THE ORIGINAL PROJECT UNTOUCHED', storedBytes(originalId) === beforeBytes,
	storedBytes(originalId) === beforeBytes ? '' : 'the stored original moved');
ok('...and the copy started from exactly those bytes too',
	storedBytes(lib.openId) !== null);

if (MUTATE) {
	console.log('');
	console.log(fails > 0
		? 'MUTATION LEG OK: converting the original in place was caught.'
		: 'MUTATION LEG FAILED: the original was damaged and nothing noticed.');
	process.exit(fails > 0 ? 0 : 1);
}
console.log('');
console.log(fails === 0 ? 'ALL PASS' : fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);
