// Headless check of File > Import EPANET file (.inp) -- ROADMAP Task 196.
//
//   node dev/lpn-spike/inp-import-harness.js
//
// WHAT THIS COVERS THAT validate_inp.js DOES NOT. That harness checks the READER: does
// EngCalcs.lpnInpParse build the same network the real EPANET engine builds? This one checks the
// other half, which is where the interesting mistakes live: does the parsed network become a
// correct DOCUMENT? A document holds DECLARED values in the project's own units (Task 263), so
// every number crosses a unit boundary on the way in, and getting one wrong is invisible -- a 12
// inch main stored as 0.3048 still draws, still solves, and is a different pipe.
//
// It also pins the decisions that are not arithmetic and would otherwise only be checked by
// looking: imported lengths are the file's, not the drawing's (lenAuto off); a reservoir gets no
// head so it keeps following its elevation; EPANET's own ids survive and nextId clears them; an
// anchored label becomes an offset; and the report actually names what was left out.
//
// Tom's browser passes are slow and tiring -- this runs the whole path in well under a second.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, GPM, FT } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');

// The page loads both readers before js/looped-network.js; do the same, onto the same EngCalcs.
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
// The placement wizard's arithmetic, needed because File > Import xy to lat/lon… ends in it (Task 447).
// georefStart() refuses outright without it, which would make the routing test below pass for the
// wrong reason -- "no wizard armed" would be true whatever the file said.
require(ROOT + 'js/lpn-georef.js');
// The Mercator pair Task 145's projection seam draws through, for the assertions in the
// DEGREES section below: the drawing frame is projected and the file is not.
const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;

// FileReader is the browser's; the import path is written around it, so it is stubbed rather than
// bypassed -- calling docFromInp() directly would skip importInpFromFile()'s own ordering, and the
// order (units strip first, THEN the conversion) is exactly the thing most likely to be wrong.
//
// It reads BYTES, as the real path does: which of EPANET's two formats a file is gets decided from
// its first bytes rather than its name, so a stub that handed over text would skip that decision
// entirely -- and it is the decision a renamed file turns on.
let lastAlert = null;
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = file._bytes || new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function (m) { lastAlert = m; };
// Keep this placement asks before it commits, and the wizard section below presses it.
global.confirm = global.window.confirm = function () { return true; };

// TEXT MEASUREMENT: THE SHARED STUB NOW DOES THIS ITSELF (Task 403).
//
// This harness used to patch getBBox() locally, because EPANET anchors a label at its upper-left
// corner and this page anchors at the centre -- so an import moves each label by HALF ITS OWN
// WIDTH, and with every string measuring the same the test could only agree with itself. The stub
// has measured by character count for a while, and since Task 403 it also scales with font size,
// which is the relationship that was actually missing. The local patch's stated reason for
// existing -- that a varying width would break example-network-harness.js's callout assertions --
// is also gone: those offsets no longer derive from a measured width at all.

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\treadUnitSelections: readUnitSelections,\n" +
	"\t\tgetProject: function () { return project; }, nextId: function () { return nextId; },\n" +
	"\t\tindexEntry: indexEntry, openId: function () { return library.openId; },\n" +
	"\t\tassembleModel: assembleModel,\n" +
	// Task 248: the tank's MAP SYMBOL. buildNodeEls() gives a reservoir and a tank a second,
	// non-interactive element over the plain node circle; a junction gets none. Reaching the
	// element map is the only way to tell "the symbol was built" from "the node exists".
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	"\t\tnodeRadius: function (id) { return nodeRadius(nodeById(id)); },\n" +
	"\t\tlabelWidth: function (id) { return labelEls[id].width; },\n" +
	"\t\tlineHeight: function () { return effectiveFontSize(1) * 1.2; },\n" +
	// Task 332: where the label's box actually IS, which is no longer derivable from its stored
	// point alone -- lb.align/lb.valign decide which corner of the box that point is.
	"\t\tlabelBox: function (id) { var lb = labelById(id), le = labelEls[id],\n" +
	"\t\t\tan = lb.anchorNode ? nodeById(lb.anchorNode) : null;\n" +
	"\t\t\treturn textLabelBox(lb, le, an ? an.x + lb.x : lb.x, an ? an.y + lb.y : lb.y); },\n" +
	// Task 331: lets a test arrive at an import from a DIFFERENT view, which is the only way to
	// see whether the importer's coordinate conversion depends on the zoom it started from.
	"\t\tzoomAbout: zoomAbout,\n" +
	// init() never runs (that is the point of the injection), so the SVG layer variables it would
	// have built are undefined. Same one-time setup example-network-harness.js does.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tdocVersion: function () { return openDocVersion; },\n" +
	// Read from the page rather than typed here: the assertion below is "the import writes a
	// CURRENT document", and a literal 4 made it "the import writes v4" -- a different claim, which
	// went stale at the next format bump (Task 324).
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	// Task 447: File > Import xy to lat/lon…, and the wizard it can end in. serialize() is how this
	// harness gets a real project FILE to hand back through that row -- writing one by hand would be
	// a second opinion about our own format.
	"\t\topenAsGeo: openAsGeoFile, serialize: serializeProject,\n" +
	"\t\tgeorefState: function () { return georef; }, georefCancel: georefCancel,\n" +
	"\t\tgeorefFinish: georefFinish, georefSetTransform: georefSetTransform,\n" +
	// Task 447, revised 2026-08-21: the reinterpret arm is a BUTTON now, not a guess, so the
	// harness has to press it the way the bar does.
	"\t\tgeorefArmAsDegrees: georefArmAsDegrees, "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol); }
function dialogText() {
	// openDialog() builds real elements into #lpn_dialog_body; read them back the way a user does.
	function walk(el) {
		if (!el.children || !el.children.length) { return el.textContent || ''; }
		return el.children.map(walk).join('\n');
	}
	return walk(byId.lpn_dialog_body);
}
function importText(text, name) {
	lastAlert = null;
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: name, _text: text });
}
function importBytes(bytes, name) {
	lastAlert = null;
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: name, _bytes: bytes });
}

const CASES = path.join(__dirname, 'reference', 'import-cases.inp');
const usInp = fs.readFileSync(CASES, 'utf8');

// ---------------------------------------------------------------------------
// 1. A US (GPM) file, imported into a browser that was last left in SI.
// ---------------------------------------------------------------------------
// Starting from the WRONG units is the point: the file's units must win, because a project now
// carries its own (Task 263, "no browser units, only PROJECT units"). Starting from 'us' would let
// a do-nothing import pass.
console.log('\n--- a GPM file, opened in a browser left in SI ---');
setUnitSet('si');
importText(usInp, 'import-cases.inp');

{
	const u = L.readUnitSelections();
	ok('the strip moves to the units the FILE was written in',
		u.lpn_u_length === 'ft' && u.lpn_u_diameter === 'in' && u.lpn_u_flow === 'gpm' &&
		u.lpn_u_elevhead === 'fth2o' && u.lpn_u_pressure === 'psi' && u.lpn_u_velocity === 'ftps',
		JSON.stringify(u));

	const doc = L.getDoc();
	const nodes = doc.nodes, links = doc.links;
	ok('every junction and reservoir came in', nodes.length === 8, nodes.length + ' nodes');
	ok('every pipe, pump and valve came in', links.length === 10, links.length + ' links');

	// EPANET's OWN IDS, not ours. A network a user recognises is one whose labels match the report
	// they already wrote; renaming J3 to J1 on the way in would silently break that.
	ok('EPANET ids are kept exactly', nodes.map(n => n.id).join(',') === 'J1,J2,J3,J4,J5,J6,R1,R2',
		nodes.map(n => n.id).join(','));

	// **BIT-IDENTICAL, NOT "CLOSE".** An import must not rewrite the user's numbers, and a
	// tolerance is exactly what hid this for months: the page normalised to SI in js/lpn-inp.js
	// and converted back through lib/Units.lib.php's factors, storing 709.9913664 for a 710 ft
	// elevation and 149.98747841154 for 150 gpm. Both tables are right to sixteen digits and
	// their product still is not 1 -- and even with exactly-reciprocal factors, 35% of a random
	// sample fails to return bit-identical, because (x*f)/f is not an identity in doubles. So the
	// assertion is `===`. Anything looser cannot tell a pass-through from a good approximation,
	// which is the only distinction here worth making.
	const j2 = nodes.find(n => n.id === 'J2');
	ok('elevation is the file number EXACTLY, in the file units', j2.elev === 95, j2.elev + ' ft');
	ok('demand is the file number EXACTLY, in the file units', j2._demand === 120, j2._demand + ' gpm');

	// [DEMANDS] REPLACES the [JUNCTIONS] column -- J3 is 0 there with rows of 40 and 35, and the
	// engine reports 75, not 0 and not 75 + 0. Measured against the real one; see js/lpn-inp.js.
	//
	// **AND SINCE TASK 468 THE ROWS ARRIVE AS ROWS.** They used to be summed into one field and the
	// breakdown reported as lost. Row 0 is the junction's own `_demand`; the rest are
	// `extraDemands`, which is the shape EngCalcs.lpnDemandRows() states and every reader asks it
	// for. The TOTAL is asserted by dev/lpn-spike/demand-category-harness.js, against a fixture
	// with patterns and category names on the rows; here the question is only that nothing was
	// flattened on the way in.
	const j3 = nodes.find(n => n.id === 'J3');
	ok('the first demand category is the junction\'s own demand',
		j3._demand === 40, j3._demand + ' gpm');
	ok('...and the second arrived as a second row rather than being added into it',
		!!j3.extraDemands && j3.extraDemands.length === 1 && j3.extraDemands[0].base === 35,
		JSON.stringify(j3.extraDemands));
	// The ordinary junction is untouched by any of it: no list, no flag, no new keys.
	ok('a junction with one demand grows nothing',
		j2.extraDemands === undefined && j2.demandCategory === undefined);

	const p1 = links.find(l => l.id === 'P1');
	ok('diameter arrives in inches EXACTLY, not metres', p1._diameter === 12, p1._diameter + ' in');
	ok('roughness crosses unchanged -- it is dimensionless', p1._roughness === 130, p1._roughness);
	ok('length is the file length', p1._length === 1200, p1._length + ' ft');
	// The one that would be silent: linkGeomLength() would recompute 1200 ft as the 200 units
	// between two symbols on a schematic, redesigning the network on the first edit.
	ok('length is NOT auto -- an EPANET length is a real pipe, not a distance on the drawing',
		p1.lenAuto === false);

	const p8 = links.find(l => l.id === 'P8');
	ok('a closed pipe stays closed', p8._status === 'closed', p8._status);

	// **AN EPANET RESERVOIR STATES A HEAD AND SAYS NOTHING ABOUT THE GROUND** (Task 390). The
	// number lands in the head, exactly, and NO elevation is invented from it -- the old import
	// wrote it into both, which put a number the file never stated into a field labelled as the
	// user's. A reservoir with no elevation has no knowable pressure, which is the honest reading.
	const r2 = nodes.find(n => n.id === 'R2');
	ok('a reservoir takes EPANET total head as its HEAD, exactly', r2._head === 260, r2._head);
	ok('...and is given NO ground elevation, because the file states none',
		r2.elev === undefined, JSON.stringify(r2.elev));

	// The TCV. It used to arrive as a zero-length PIPE carrying the same loss -- exact hydraulics
	// under the wrong element name -- and since Task 248 phase 2 it arrives as a valve. Its whole
	// loss is still the SETTING (12); the [VALVES] minor-loss column is ignored by EPANET itself,
	// which is measured in js/lpn-inp.js and is not what the column heading implies.
	const v1 = links.find(l => l.id === 'V1');
	ok('a throttle valve arrives as a VALVE, of zero length, so it adds friction to nothing',
		v1.type === 'valve' && v1._length === 0, v1.type + ', L=' + v1._length);
	ok('...of the type the file named', v1.valveType === 'TCV', v1.valveType);
	ok('...carrying the valve setting, and NOT the ignored minor-loss column',
		v1._setting === 12 && v1._k === 0, 'setting=' + v1._setting + ' k=' + v1._k);

	const pu = links.find(l => l.id === 'PU1');
	ok('the pump curve is stored in the units on the strip, exactly as written',
		pu.curvePoints.length === 3 && pu.curvePoints[0][1] === 220 && pu.curvePoints[2][0] === 1000,
		JSON.stringify(pu.curvePoints));
	// h0/a/b are SI and are what the solver reads. 220 ft of shutoff head is 67.06 m; a curve
	// fitted from the DISPLAYED numbers instead would put 220 metres in here and be 3.3x wrong.
	//
	// ASKED OF THE MODEL, NOT OF THE DOCUMENT (Task 390 step 5). The fitted triple is derived at
	// the solver handoff now and is deliberately not stored, so reading pu.h0 would read undefined
	// -- and the property under test was never "the link carries h0", it was "the solver is handed
	// SI". The document is asserted to carry none of it, one line down.
	const puModel = L.assembleModel().links.find(l => l.id === 'PU1');
	ok('...while the fitted curve the solver reads is SI', near(puModel.h0, 220 * FT, 1e-6), puModel.h0 + ' m');
	ok('...and the document stores no fitted curve at all',
		pu.h0 === undefined && pu.a === undefined && pu.b === undefined,
		JSON.stringify([pu.h0, pu.a, pu.b]));
	ok('a pump gets a diameter even though no head loss uses one',
		pu._diameter > 0, pu._diameter);

	// An emitter changes the answer, so it is kept rather than dropped -- and it is stored in the
	// solver's own SI terms, because there is no field on the page that could show it.
	const j6 = nodes.find(n => n.id === 'J6');
	ok('an emitter coefficient is kept, converted to the solver terms',
		near(j6._emitter, 1.5 * GPM / Math.pow(0.703070, 0.5), 1e-12), j6._emitter);

	ok('link vertices survive', links.find(l => l.id === 'P5').verts.length === 2);

	const labels = doc.labels;
	ok('map labels come in', labels.length === 3, labels.length);

	// ---- EPANET anchors at the UPPER-LEFT corner; this page anchors at the CENTRE ----
	// The fixture stacks two title-block lines of very different lengths at the SAME x, which is
	// what a left-aligned block looks like -- and is exactly the evidence in Tom's own files that
	// settled this (Estrellas' two lines are 31 and 25 characters and their stored x values differ
	// by 0.98 map units, where centring would put them ~85 apart).
	const t1 = labels.find(l => l._text === 'Import test network');
	const t2 = labels.find(l => l._text.indexOf('considerably longer') >= 0);
	const w1 = L.labelWidth(t1.id), w2 = L.labelWidth(t2.id);
	ok('the longer line really does measure wider -- otherwise the next check is vacuous',
		w2 > w1 * 1.5, w1.toFixed(1) + ' vs ' + w2.toFixed(1));
	// TASK 332 CHANGED WHAT THESE THREE ASSERT, AND THE CHANGE IS THE POINT. They used to check the
	// arithmetic that moved an imported label half its own width and half a line -- the conversion
	// that made importing depend on the zoom. There is no arithmetic now: the coordinate is stored
	// exactly as the file wrote it and the ALIGNMENT carries EPANET's convention, so what is worth
	// asserting is that nothing moved at all.
	ok('two lines stored at one x are still stored at one x -- nothing was converted',
		t1.x === t2.x && t1.x === 100, t1.x + ' and ' + t2.x);
	ok('...and they render sharing a LEFT EDGE, because that is what a title block IS',
		L.labelBox(t1.id).x === L.labelBox(t2.id).x,
		'left edges ' + L.labelBox(t1.id).x.toFixed(2) + ' and ' + L.labelBox(t2.id).x.toFixed(2));
	// Y is the other way round from what "upper" suggests: the file is Y-up and memory is Y-down, so
	// EPANET's 420 is -420 here -- and that single sign flip is now the ONLY thing done to it.
	ok('the stored y is EPANET\'s own point, flipped into the Y-down frame and nothing more',
		t1.y === -420, t1.y);
	ok('...and the rendered box hangs BELOW it, which is where a top-left corner puts the text',
		L.labelBox(t1.id).y === t1.y, L.labelBox(t1.id).y + ' vs ' + t1.y);

	// An anchored label stores an OFFSET from its node; EPANET stores the absolute point. That
	// subtraction is exact and is unaffected by any of the above.
	const anchored = labels.find(l => l.anchorNode === 'R2');
	ok('an anchored label becomes an offset from its node, not a position',
		!!anchored && anchored.x === 0 && anchored.y === 20,
		anchored ? anchored.x + ',' + anchored.y : 'missing');

	// nextId has to clear every id the file brought or the next junction drawn would be J1 again.
	ok('nextId clears the ids the file brought', L.nextId().J === 7 && L.nextId().R === 3,
		'J' + L.nextId().J + ' R' + L.nextId().R);

	ok('the project is named after the file', L.getProject().name === 'import-cases',
		L.getProject().name);
	ok('an imported project starts SAVED, not modified', L.indexEntry(L.openId()).dirty === false);
	ok('the document is written at the current version', L.docVersion() === L.storageVersion(),
		L.docVersion());
}

// ---------------------------------------------------------------------------
// 2. It solves, and it solves to the answer EPANET gives for the same file.
// ---------------------------------------------------------------------------
// The reference numbers come from dev/lpn-spike/validate_inp.js, which runs the real EPANET engine
// over this very file. Repeating them here as literals is deliberate: this harness asserts that the
// DOCUMENT round trip preserves the network, and a unit slip anywhere above lands here as feet.
console.log('\n--- and the document solves to the same answer ---');
{
	const res = require(ROOT + 'js/lpn-solver.js').lpnSolve(L.assembleModel());
	ok('it converges', res.ok && res.converged, res.iterations + ' iterations');
	// J2's head in feet, as the real EPANET engine reports it for this file (264.317). The bound is
	// 0.01 ft: tight enough that any unit slip above lands here, loose enough not to chase the
	// float API EPANET reports through.
	const j2ft = res.heads.J2 / FT;
	ok('J2 sits where EPANET puts it', near(j2ft, 264.317, 0.01), j2ft.toFixed(3) + ' ft');
}

// ---------------------------------------------------------------------------
// 3. The report says what changed.
// ---------------------------------------------------------------------------
console.log('\n--- the report ---');
{
	const t = dialogText();
	ok('the report names the file', t.indexOf('import-cases.inp') >= 0);
	ok('it says the throttle valves came in whole, and names them',
		t.indexOf('throttle valves') >= 0 && t.indexOf('V1') >= 0);
	// **AND IT NO LONGER SAYS THE CATEGORIES WERE THROWN AWAY**, because they no longer are
	// (Task 468). The importer's contract is to report every DIFFERENCE; a breakdown that arrives
	// whole is not one, and a report that still claimed the loss would be the page describing an
	// older version of itself.
	ok('it does NOT say the demands were added together -- they were not',
		t.indexOf('more than one demand') < 0);
	ok('it says the emitter is being solved but cannot be edited',
		t.indexOf('sprinkler or leak coefficient') >= 0 && t.indexOf('J6') >= 0);
	ok('no sentence is left as a bare code name', t.indexOf('valve-tcv') < 0);
}

// ---------------------------------------------------------------------------
// 4. An SI file lands on SI units, and the same network comes out.
// ---------------------------------------------------------------------------
console.log('\n--- an LPS file ---');
{
	const siInp = [
		'[JUNCTIONS]', ' J1 30 5', '',
		'[RESERVOIRS]', ' R1 60', '',
		'[PIPES]', ' P1 R1 J1 400 300 130 0 Open', '',
		'[OPTIONS]', ' Units LPS', ' Headloss H-W', '',
		'[COORDINATES]', ' J1 100 0', ' R1 0 0', '', '[END]', ''
	].join('\n');
	setUnitSet('us');
	importText(siInp, 'metric.inp');
	const u = L.readUnitSelections();
	ok('the strip moves to metric', u.lpn_u_length === 'm' && u.lpn_u_diameter === 'mm' && u.lpn_u_flow === 'lps',
		JSON.stringify(u));
	const doc = L.getDoc();
	ok('diameter stays 300 mm -- millimetres in, millimetres stored',
		near(doc.links[0]._diameter, 300, 1e-9), doc.links[0]._diameter);
	ok('demand stays 5 l/s', near(doc.nodes[0]._demand, 5, 1e-9), doc.nodes[0]._demand);
	ok('elevation stays 30 m', near(doc.nodes[0].elev, 30, 1e-9), doc.nodes[0].elev);
	ok('nothing was left out of a file this simple',
		dialogText().indexOf('Nothing was left out') >= 0);
}

// ---------------------------------------------------------------------------
// 4b. A TANK becomes a tank in the DOCUMENT (ROADMAP Task 248).
// ---------------------------------------------------------------------------
// js/lpn-inp.js's own reading of a tank row is covered by tank-harness.js. What is checked here is
// the layer above it: does the parsed tank become a correct DOCUMENT? A document holds DECLARED
// numbers in the project's own units, so all five of a tank's lengths cross a unit boundary here,
// and a tank's diameter is the one that would go wrong quietly -- it belongs with the elevations,
// not with the pipe diameters, and a document showing 15000 for a 15 m tank still draws and solves.
//
// The pipe on the tank is the other half. Before Task 248 every link touching a tank was dropped
// as an orphan, so an imported municipal model arrived missing whole branches.
console.log('\n--- a tank, in an LPS file ---');
{
	const tankInp = [
		'[JUNCTIONS]', ' J1 30 5', '',
		'[TANKS]', ' TK1 40 6 1 9 15 0', '',
		'[PIPES]', ' P1 TK1 J1 400 300 130 0 Open', '',
		'[OPTIONS]', ' Units LPS', ' Headloss H-W', '',
		'[COORDINATES]', ' J1 100 0', ' TK1 0 0', '', '[END]', ''
	].join('\n');
	setUnitSet('us');
	importText(tankInp, 'tank.inp');
	const doc = L.getDoc();
	const tk = doc.nodes.filter((n) => n.id === 'TK1')[0];
	ok('the tank is a node of type tank', !!tk && tk.type === 'tank', tk && tk.type);
	ok('...bottom elevation, declared in metres', near(tk.elev, 40, 1e-9), tk && tk.elev);
	ok('...water level, declared in metres', near(tk._level, 6, 1e-9), tk && tk._level);
	ok('...lowest and highest levels', near(tk.minLevel, 1, 1e-9) && near(tk.maxLevel, 9, 1e-9));
	ok('...VESSEL DIAMETER in the elevation unit (15 m), not the pipe unit (15000 mm)',
		near(tk.tankDiameter, 15, 1e-9), tk && tk.tankDiameter);
	ok('THE PIPE ON THE TANK SURVIVED THE IMPORT', doc.links.length === 1 && doc.links[0].from === 'TK1',
		doc.links.length + ' link(s)');
	ok('nothing was reported as left out', dialogText().indexOf('Nothing was left out') >= 0);
	// The document must be solvable straight off the import, with the tank as the only source --
	// which is also the diagnostic that used to say "add a reservoir" and now accepts a tank.
	const res = EngCalcs.lpnSolve(L.assembleModel());
	ok('...and it solves, anchored only by the tank', res.ok && res.converged, JSON.stringify(res.issues));
	ok('...with the tank held at bottom + level = 46 m', near(res.heads.TK1, 46, 1e-6), res.heads.TK1);

	// The map symbol. A tank must NOT draw as the reservoir's mark -- that was the whole Task
	// 146.10 finding, one mark for two elements, indistinguishable in greyscale.
	const tkEl = L.nodeEl('TK1'), jEl = L.nodeEl('J1');
	ok('the tank draws its own overlay symbol', !!tkEl && !!tkEl.symbol);
	ok('...which is the TANK icon, not the reservoir one',
		!!tkEl && /lpn-node-symbol-tank/.test(tkEl.symbol.getAttribute('class') || ''),
		tkEl && tkEl.symbol && tkEl.symbol.getAttribute('class'));
	ok('a junction still draws no overlay symbol', !!jEl && !jEl.symbol);
	// **THE TWO ARE TOLD APART BY SHAPE, NOT BY ASPECT** (2026-09-03). This asserted that a tank is
	// taller than it is wide, against a reservoir that was wider than tall -- true while both were
	// stretched versions of one generic vessel. They are a rectangle and a triangle now, each drawn
	// in its own proportions and both 2 junction-widths across by Tom's ratio, so the aspect no
	// longer carries the distinction and asserting it would freeze the old drawing in place. What
	// still matters, and is what this ever really guarded, is that a tank is NOT a junction-sized
	// mark: nodeRadius() is the circumscribing half every clear-run inset, leader and hit test
	// reads.
	ok('the tank is drawn in its own square box, undistorted',
		parseFloat(tkEl.symbol.getAttribute('height')) === parseFloat(tkEl.symbol.getAttribute('width')),
		tkEl.symbol.getAttribute('width') + ' x ' + tkEl.symbol.getAttribute('height'));
	ok('...and its hit radius is bigger than a junction\'s', L.nodeRadius('TK1') > L.nodeRadius('J1'),
		L.nodeRadius('TK1') + ' vs ' + L.nodeRadius('J1'));
}

// ---------------------------------------------------------------------------
// 4c. A tank called T1 and a text label in the SAME file (Task 248).
// ---------------------------------------------------------------------------
// EPANET's own default tank names are T1, T2 -- and until Task 248 this importer minted text
// element ids as 'T' + n, because nothing else used the letter. Two elements sharing an id is not
// a crash: nodeEls and labelEls are separate maps, so the drawing looks right. It breaks the ID
// VALIDATOR, which reads one flat list -- so renaming something to a genuinely free name gets
// refused, and renaming it onto a taken one gets accepted. Exactly the kind of defect that is
// invisible until somebody hits it.
console.log('\n--- a tank named T1 beside a text label ---');
{
	const clash = [
		'[JUNCTIONS]', ' J1 30 5', '',
		'[TANKS]', ' T1 40 6 1 9 15 0', '',
		'[PIPES]', ' P1 T1 J1 400 300 130 0 Open', '',
		'[OPTIONS]', ' Units LPS', ' Headloss H-W', '',
		'[COORDINATES]', ' J1 100 0', ' T1 0 0', '',
		'[LABELS]', ' 10 10 "North tank"', ' 20 20 "Zone 2"', '',
		'[END]', ''
	].join('\n');
	importText(clash, 'clash.inp');
	const doc = L.getDoc();
	const ids = doc.nodes.map((n) => n.id).concat(doc.links.map((l) => l.id), doc.labels.map((b) => b.id));
	const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
	ok('the tank kept the name the file gave it', doc.nodes.some((n) => n.id === 'T1' && n.type === 'tank'));
	ok('both labels came in', doc.labels.length === 2, doc.labels.length + ' label(s)');
	ok('NO TWO ELEMENTS SHARE AN ID', dupes.length === 0, ids.join(', '));
}

// ---------------------------------------------------------------------------
// 5. A file that is not an .inp is refused, and says so.
// ---------------------------------------------------------------------------
console.log('\n--- a file that is not a network ---');
{
	const before = L.getDoc().nodes.length;
	importText('{"v":4,"nodes":[]}', 'notanetwork.inp');
	ok('it is refused with a message', !!lastAlert, JSON.stringify(lastAlert));
	ok('and nothing was imported over the open project', L.getDoc().nodes.length === before);
}

// ---------------------------------------------------------------------------
// 6. A BINARY .net goes through the very same menu item.
// ---------------------------------------------------------------------------
// The format is decided from the file's first bytes, not its name, so this is deliberately handed
// over with the WRONG extension: a user who renames a file must still get the right reader, and a
// path that trusted the name would import binary as text and produce nonsense without a word.
// js/lpn-net.js itself is tested in dev/lpn-spike/net-import-harness.js; what is checked here is
// only that this page's one import command reaches it.
console.log('\n--- a binary .net, handed over as "model.inp" ---');
{
	const netBytes = fs.existsSync(ROOT + 'dev/epanet-models')
		? fs.readdirSync(ROOT + 'dev/epanet-models').filter(f => f.endsWith('.net'))[0]
		: null;
	if (!netBytes) {
		console.log('  skip  no dev/epanet-models/*.net here (they are gitignored client models)');
	} else {
		const bytes = new Uint8Array(fs.readFileSync(path.join(ROOT, 'dev/epanet-models', netBytes)));
		importBytes(bytes, 'model.inp');
		ok('a binary file named .inp is still read as a .net', !lastAlert, JSON.stringify(lastAlert));
		ok('...and a real network lands', L.getDoc().nodes.length > 5, L.getDoc().nodes.length + ' nodes');
		ok('...in the units the model was written in', L.readUnitSelections().lpn_u_flow === 'gpm');
	}
	// And the other way: a .net that this page cannot read is refused with the way out, never
	// half-imported.
	const before = L.getDoc().nodes.length;
	const junk = new Uint8Array([0x06, 9, 60, 69, 80, 65, 78, 69, 84, 50, 62, 0x03, 0xe9, 0x4e, 0x02, 1]);
	importBytes(junk, 'broken.net');
	ok('a damaged .net is refused, and the message says to export it as .inp',
		!!lastAlert && /\.inp/.test(lastAlert), JSON.stringify(lastAlert));
	ok('...and nothing was imported over the open project', L.getDoc().nodes.length === before);
}

	// ---- IMPORTING IS DETERMINISTIC (Task 332, fixed 2026-08-15) --------------------------------
	// This assertion spent a day INVERTED, as an executable record of a known defect:
	// reanchorImportedLabels() converted EPANET's top-left label anchor into our centre anchor using
	// two world-unit measurements of text that is sized in SCREEN PIXELS, so both terms depended on
	// the zoom in force when the import ran -- whatever the previously open project happened to be
	// left at. The same file imported from two different views stored two different sets of
	// coordinates, with nothing on screen to suggest anything had gone wrong.
	//
	// The fix was to stop converting: EPANET's point is stored unchanged and the label is rendered
	// from its own corner via lb.align/lb.valign. Nothing is measured, so nothing can depend on the
	// zoom -- and the check that had been written to fail now passes for the right reason.
	//
	// (Fitting the view before converting was tried and reverted: zoomExtent() derives its scale
	// from bbox(), which measures the rendered label text, so fit-then-convert is circular.)
	{
		importText(usInp, 'import-cases');
		const first = L.getDoc().labels.map(l => l.id + ':' + l.x.toFixed(6) + ',' + l.y.toFixed(6)).join('|');
		L.zoomAbout(0, 0, 8);          // arrive from a wildly different view
		importText(usInp, 'import-cases');
		const again = L.getDoc().labels.map(l => l.id + ':' + l.x.toFixed(6) + ',' + l.y.toFixed(6)).join('|');
		ok('import coordinates do not depend on the starting zoom (Task 332)',
			again === first, again + ' vs ' + first);
		const lbs = L.getDoc().labels;
		ok('...and every imported label is anchored where EPANET anchors it, top left',
			lbs.length > 0 && lbs.every(l => l.align === 'left' && l.valign === 'top'),
			JSON.stringify(lbs.map(l => l.align + '/' + l.valign)));
	}

// ---------------------------------------------------------------------------
// [BACKDROP] UNITS: the file says which KIND of project it is (ROADMAP Task 447).
// ---------------------------------------------------------------------------
// EPANET's own Map Dimensions dialog offers FEET, METERS, DEGREES or NONE and persists the answer
// here. We read only the FILE line out of that section for years and threw the rest away, so every
// `.inp` opened as an XY drawing -- including one whose coordinates were already lon/lat.
//
// The three facts worth pinning, all from the REAL parser rather than a stub of it:
//   * DEGREES opens a lat/lon project and everything else opens XY;
//   * ABSENT and NONE stay tellable apart, because a prompt (if one is ever added) belongs on the
//     first and never on the second -- EPA's own Net1, Net2 and Net3 all say NONE;
//   * the coordinates are still the file's own numbers, bit for bit. A degrees file is the one case
//     where a longitude could plausibly be "helped", and it must not be.
console.log('\n--- [BACKDROP] UNITS decides XY or lat/lon ---');
function probeInp(backdrop) {
	return [
		'[TITLE]', ' units probe', '',
		'[JUNCTIONS]', ' J1  10  25', '',
		'[RESERVOIRS]', ' R1  100', '',
		'[PIPES]', ' P1  R1  J1  1000  8  130  0  Open', '',
		'[COORDINATES]', ' J1  -122.5686103  38.106067', ' R1  -122.5700  38.1070', '',
		'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', ''
	].concat(backdrop).concat(['[END]', '']).join('\n');
}
const INP_DEGREES = probeInp(['[BACKDROP]', ' UNITS  Degrees', '']);
const INP_NONE = probeInp(['[BACKDROP]', ' UNITS  None', '']);
const INP_SILENT = probeInp([]);
const INP_STRANGE = probeInp(['[BACKDROP]', ' UNITS  Furlongs', '']);
{
	const P = EngCalcs.lpnInpParse;
	const deg = P(INP_DEGREES), none = P(INP_NONE), silent = P(INP_SILENT), odd = P(INP_STRANGE);
	ok('DEGREES is read, and the file\'s own token is kept beside it',
		deg.mapUnits === 'degrees' && deg.mapUnitsRaw === 'Degrees', deg.mapUnits + ' / ' + deg.mapUnitsRaw);
	ok('NONE is read as NONE -- the file said its coordinates are arbitrary',
		none.mapUnits === 'none' && none.mapUnitsRaw === 'None', none.mapUnits + ' / ' + none.mapUnitsRaw);
	// THE DISTINCTION THE WHOLE STATE EXISTS FOR. Silence is not NONE: only mapUnitsRaw separates
	// them, and a later reader deciding whether a question is worth asking needs exactly this.
	ok('a file with no [BACKDROP] at all says NOTHING, which is not the same as NONE',
		silent.mapUnits === null && silent.mapUnitsRaw === null,
		JSON.stringify([silent.mapUnits, silent.mapUnitsRaw]));
	ok('...and a word we do not know keeps its token rather than becoming silence',
		odd.mapUnits === null && odd.mapUnitsRaw === 'Furlongs',
		JSON.stringify([odd.mapUnits, odd.mapUnitsRaw]));
	// The real thing, not a fixture: EPA ships Net3 saying None, which is why NONE gets no prompt.
	const net3 = P(fs.readFileSync(path.join(__dirname, 'reference', 'Net3.inp'), 'utf8'));
	ok('EPA\'s own Net3 says None', net3.mapUnits === 'none', net3.mapUnitsRaw);
}
{
	importText(INP_DEGREES, 'world.inp');
	const p = L.getProject(), d = L.getDoc();
	ok('a DEGREES file opens a lat/lon project', p.coords === 'geo', p.coords);
	// **AND IT DOES GET AN ORIGIN, WHICH IS THE OPPOSITE OF WHAT THIS ASSERTED** (Task 439). The
	// old reasoning here -- "degrees start from zero by definition, so there is nothing to do" --
	// was the exact mistake: a longitude is 122 and a float32's spacing at 122 is what loses the
	// drawing at street zoom. What is true is that the SHIFT MUST NOT REACH THE FILE, which is the
	// last assertion in this block and is where the promise really lives.
	ok('...on a derived local origin, so it is still drawable zoomed in',
		d.origin.x !== 0 && d.origin.y !== 0, JSON.stringify(d.origin));
	ok('...and that origin is on the power-of-two grid, which is what makes the shift exact',
		d.origin.x * 128 === Math.round(d.origin.x * 128) && d.origin.y * 128 === Math.round(d.origin.y * 128),
		JSON.stringify(d.origin));
	// `===`, for the reason the header gives: a longitude is the user's number too.
	const j1 = d.nodes.find(n => n.id === 'J1');
	// **MEMORY IS WEB MERCATOR SINCE TASK 145'S PROJECTION SEAM**, y down, so the latitude arrives
	// projected and negated -- and since Task 439 it is also LOCAL to d.origin. Longitude is
	// otherwise untouched: Mercator x IS longitude. Written as the outward composition rather than
	// as a raw number, because the raw number is now a frame detail and the composition is the
	// contract every readout, export and terrain lookup depends on.
	ok('...the drawn position is the projection of the file\'s latitude, local to the origin',
		j1.x + d.origin.x === -122.5686103 && -j1.y + d.origin.y === Geom.mercY(38.106067),
		(j1.x + d.origin.x) + ', ' + (-j1.y + d.origin.y) +
		' (mercY(38.106067) = ' + Geom.mercY(38.106067) + ')');
	ok('...and the number actually handed to the renderer is small, which is the whole point',
		Math.abs(j1.x) < 1 && Math.abs(j1.y) < 1, j1.x + ', ' + j1.y);
	// **AND THE FILE GETS ITS OWN BYTES BACK**, which is the property that actually matters and is
	// now the harder one: mercLat(mercY(lat)) is a different double for 70% of latitudes, so this
	// passes only because serializeProject() hands back the latitude the file stated rather than
	// re-deriving it. Nothing in the projection may be allowed to edit the user's number.
	const outJ1 = L.serialize().nodes.find(n => n.id === 'J1');
	ok('...and saving hands the file its own longitude and latitude back, exactly',
		outJ1.x === -122.5686103 && outJ1.y === 38.106067, outJ1.x + ', ' + outJ1.y);

	importText(INP_NONE, 'grid.inp');
	ok('a NONE file opens an XY project, with no prompt in the way',
		L.getProject().coords !== 'geo' && lastAlert === null, String(L.getProject().coords));
	importText(INP_SILENT, 'quiet.inp');
	ok('...and so does a file that never mentions its map units',
		L.getProject().coords !== 'geo', String(L.getProject().coords));
	importText(INP_STRANGE, 'odd.inp');
	ok('...and so does one naming a unit we do not know',
		L.getProject().coords !== 'geo', String(L.getProject().coords));
}

// ---------------------------------------------------------------------------
// File > Import xy to lat/lon…: ONE row, both kinds of file (Task 447).
// ---------------------------------------------------------------------------
// The row exists for the one cell no file can state: an XY drawing whose X and Y were MEANT as
// lon/lat all along. It therefore takes a project file and an `.inp` alike, and decides which reader
// from the content -- a project file is JSON and starts with `{`, which no `.inp` ever does.
console.log('\n--- Import xy to lat/lon…, over an .inp and over a project file ---');
{
	// currentView() measures the canvas, and the shared stub's elements carry no layout box; without
	// a size the wizard correctly refuses to arm and every check below would pass for that reason.
	byId.lpn_canvas.clientWidth = 1000;
	byId.lpn_canvas.clientHeight = 500;

	L.openAsGeo({ name: 'grid.inp', _text: INP_NONE });
	ok('an .inp that does NOT say degrees runs the placement wizard', !!L.georefState(),
		JSON.stringify(L.georefState() && L.georefState().step));
	ok('...on a project that is now on the map', L.getProject().coords === 'geo');
	L.georefCancel();

	// A file that already states DEGREES is already where it belongs. Placing it by hand would be
	// this page overruling the file, which is the one thing the unit rule forbids.
	L.openAsGeo({ name: 'world.inp', _text: INP_DEGREES });
	ok('a DEGREES .inp just opens -- there is nothing to place', L.georefState() === null);
	ok('...and it is a lat/lon project', L.getProject().coords === 'geo');

	// The other kind of file, through the same row. Written by our own serializer so the harness is
	// not a second opinion about the format.
	importText(INP_NONE, 'grid.inp');
	const projectFile = JSON.stringify(L.serialize());
	ok('a project file really is JSON, which is how the router tells the two apart',
		projectFile.charAt(0) === '{');
	L.openAsGeo({ name: 'grid.json', _text: projectFile });
	ok('an XY project file runs the placement wizard too', !!L.georefState());
	ok('...and it landed as a NEW tab rather than converting anything in place',
		L.openId() !== null && L.getProject().coords === 'geo');
	L.georefCancel();
}

// ---------------------------------------------------------------------------
// PLACE or REINTERPRET: the numbers choose, and a reinterpret moves NOTHING (Task 447).
// ---------------------------------------------------------------------------
// One command does two jobs. A real XY drawing has to be MOVED onto the Earth; a network whose
// coordinates already ARE lon/lat -- the `.inp` that only ever said `UNITS None` -- is already in the
// right place and must not move at all. Dropping the second kind at the centre of the world would
// take a correct network and ask the user to drag it back to a precision no hand can reach.
//
// **THE GUARANTEE: press Keep this placement without touching anything and every coordinate comes
// back BYTE-IDENTICAL.** Not within tolerance -- CLAUDE.md's rule is that a number the user did not
// touch is not ours to rewrite, and scaling by 1.0 perturbs the last bits of a double. It holds
// structurally rather than by rounding: the document is written only by georefSetTransform(), and
// only a user gesture calls that. The `!==` check after a real drag is what stops that from being a
// wizard that quietly applies nothing.
console.log('\n--- the wizard always opens at step 1, and the reinterpret button moves nothing ---');
{
	// The file's own coordinates, y NEGATED because memory is y-down and the file is Cartesian.
	// The file's OWN bytes, in the file's own Cartesian frame -- these are the two [COORDINATES]
	// rows above, character for character. They were negated here while this read memory; the
	// projection seam moved the reading to the saved document, where the sign is the file's.
	const FILE_COORDS = '[["J1",-122.5686103,38.106067],["R1",-122.57,38.107]]';
	// **READ OUT OF THE SAVED DOCUMENT, NOT OUT OF MEMORY** (Task 145's projection seam): memory is
	// Web Mercator now and the file is longitude and latitude, and it is the FILE the promise is
	// about. Reading memory would compare the reinterpret against a frame the user never sees.
	const coords = () => JSON.stringify(L.serialize().nodes.map(n => [n.id, n.x, n.y]));

	// **THE RANGE TEST NO LONGER DECIDES ANYTHING** (Tom, 2026-08-21: EPA's own Net3, whose
	// coordinates run x 8..45 and y 0..31, armed as degrees and landed in North Darfur). Every
	// small drawing fits inside +/-180 and +/-90, so the test's answer was never evidence. The
	// wizard opens where the menu row promised, and the reinterpret case is offered as a button.
	L.openAsGeo({ name: 'really-lonlat.inp', _text: INP_NONE });
	let armed = L.georefState();
	ok('coordinates that CAN be read as degrees still open at step 1, like any other drawing',
		!!armed && armed.step === 1, armed && armed.step);
	ok('...and the bar is told it may offer the reinterpret button', !!armed && armed.mayBeDegrees === true);

	// Pressing it is what arms the reinterpret, and it is exact AFTER a step of panning because it
	// rebuilds from the numbers the document arrived with, not from what step 1 has been drawing.
	L.georefArmAsDegrees();
	armed = L.georefState();
	ok('the button arms the wizard attached, on the ground', !!armed && armed.step === 2, armed && armed.step);
	ok('...and not one coordinate moved', coords() === FILE_COORDS, coords());
	L.georefFinish();
	ok('Keep this placement, untouched, commits the file\'s own numbers byte for byte',
		coords() === FILE_COORDS, coords());
	ok('...as a lat/lon project', L.getProject().coords === 'geo');

	// The other direction, so the pass-through above cannot be hiding a wizard that never applies
	// anything: a real gesture must really move the network.
	L.openAsGeo({ name: 'really-lonlat.inp', _text: INP_NONE });
	L.georefArmAsDegrees();
	L.georefSetTransform(EngCalcs.lpnGeorefWithTranslation(L.georefState().t, 0.01, -0.02));
	ok('after a real drag the coordinates DID change', coords() !== FILE_COORDS, coords());
	L.georefCancel();
	ok('...and Cancel puts the file\'s own numbers back, byte for byte', coords() === FILE_COORDS, coords());

	// State Plane: half a million feet east, four million north. No such pair is a coordinate on the
	// Earth, so the button is not offered at all.
	const STATE_PLANE = probeInp(['[BACKDROP]', ' UNITS  Feet', ''])
		.replace(' J1  -122.5686103  38.106067', ' J1  579350  4218000')
		.replace(' R1  -122.5700  38.1070', ' R1  579900  4218600');
	L.openAsGeo({ name: 'state-plane.inp', _text: STATE_PLANE });
	const far = L.georefState();
	ok('coordinates that CANNOT be degrees open at step 1 too, at the centre of the world',
		!!far && far.step === 1, far && far.step);
	ok('...and the reinterpret button is not offered for them', !!far && far.mayBeDegrees === false);
	ok('...with the model mapped onto plausible lon/lat rather than left at half a million',
		L.getDoc().nodes.every(n => Math.abs(n.x) <= 180 && Math.abs(n.y) <= 90), coords());
	L.georefCancel();
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
