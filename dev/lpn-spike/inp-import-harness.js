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

// TEXT MEASUREMENT THAT TRACKS THE TEXT, for this harness only.
//
// The shared stub returns a constant getBBox().width, which is fine for every other harness and
// useless for this one: EPANET anchors a label at its upper-left corner and this page anchors at
// the centre, so an import moves each label by HALF ITS OWN WIDTH. With every string the same
// width, the test that two differently-sized labels come out sharing a left edge could only ever
// agree with itself.
//
// Patched here rather than in lpn-dom-stub.js deliberately. A width that varies changes the
// example network's measured callout offsets, and example-network-harness.js asserts those against
// numbers taken at the constant width -- so widening the stub for everyone would break a passing
// harness in order to test this one. 0.55 em per character is a fair mean for Arial; only the fact
// that a longer string measures wider actually matters here.
const createNS = global.document.createElementNS;
global.document.createElementNS = function (ns, tag) {
	const el = createNS(ns, tag);
	if (tag === 'text') {
		el.getBBox = function () {
			const fs = parseFloat(String(this._styleAttr || '').replace(/^[\s\S]*font-size:\s*/, '')) ||
				parseFloat(this.style.fontSize) || 10;
			return { x: 0, y: 0, width: (this.textContent || '').length * 0.55 * fs, height: fs * 1.2 };
		};
	}
	return el;
};

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
	// Task 331: lets a test arrive at an import from a DIFFERENT view, which is the only way to
	// see whether the importer's coordinate conversion depends on the zoom it started from.
	"\t\tzoomAbout: zoomAbout,\n" +
	// init() never runs (that is the point of the injection), so the SVG layer variables it would
	// have built are undefined. Same one-time setup example-network-harness.js does.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tdocVersion: function () { return openDocVersion; },\n" +
	// Read from the page rather than typed here: the assertion below is "the import writes a
	// CURRENT document", and a literal 4 made it "the import writes v4" -- a different claim, which
	// went stale at the next format bump (Task 324).
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; }, "
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

	const j2 = nodes.find(n => n.id === 'J2');
	ok('elevation is the file number, in the file units', near(j2.elev, 95, 1e-9), j2.elev + ' ft');
	ok('demand is the file number, in the file units', near(j2._demand, 120, 1e-6), j2._demand + ' gpm');

	// [DEMANDS] REPLACES the [JUNCTIONS] column and its categories sum: J3 is 0 in [JUNCTIONS] with
	// rows of 40 and 35, so 75 -- not 0, and not 75 + 0. Measured against the real engine; see the
	// note in js/lpn-inp.js.
	const j3 = nodes.find(n => n.id === 'J3');
	ok('several demand categories add up into the one demand this page holds',
		near(j3._demand, 75, 1e-6), j3._demand + ' gpm');

	const p1 = links.find(l => l.id === 'P1');
	ok('diameter arrives in inches, not metres', near(p1._diameter, 12, 1e-9), p1._diameter + ' in');
	ok('roughness crosses unchanged -- it is dimensionless', p1._roughness === 130, p1._roughness);
	ok('length is the file length', near(p1._length, 1200, 1e-9), p1._length + ' ft');
	// The one that would be silent: linkGeomLength() would recompute 1200 ft as the 200 units
	// between two symbols on a schematic, redesigning the network on the first edit.
	ok('length is NOT auto -- an EPANET length is a real pipe, not a distance on the drawing',
		p1.lenAuto === false);

	const p8 = links.find(l => l.id === 'P8');
	ok('a closed pipe stays closed', p8._status === 'closed', p8._status);

	const r2 = nodes.find(n => n.id === 'R2');
	ok('a reservoir takes EPANET total head as its elevation', near(r2.elev, 260, 1e-9), r2.elev);
	ok('...and is given NO head, so it goes on following that elevation',
		r2._head === undefined, JSON.stringify(r2._head));

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
	ok('the pump curve is stored in the units on the strip, like every other input',
		pu.curvePoints.length === 3 && near(pu.curvePoints[0][1], 220, 1e-9) &&
		near(pu.curvePoints[2][0], 1000, 1e-6),
		JSON.stringify(pu.curvePoints.map(p => p.map(x => Math.round(x)))));
	// h0/a/b are SI and are what the solver reads. 220 ft of shutoff head is 67.06 m; a curve
	// fitted from the DISPLAYED numbers instead would put 220 metres in here and be 3.3x wrong.
	ok('...while the fitted curve the solver reads is SI', near(pu.h0, 220 * FT, 1e-6), pu.h0 + ' m');
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
	const t1 = labels.find(l => l.text === 'Import test network');
	const t2 = labels.find(l => l.text.indexOf('considerably longer') >= 0);
	const w1 = L.labelWidth(t1.id), w2 = L.labelWidth(t2.id);
	ok('the longer line really does measure wider -- otherwise the next check is vacuous',
		w2 > w1 * 1.5, w1.toFixed(1) + ' vs ' + w2.toFixed(1));
	ok('two lines stored at one x come out sharing a LEFT EDGE, not a centre',
		Math.abs((t1.x - w1 / 2) - (t2.x - w2 / 2)) < 1e-9,
		'left edges ' + (t1.x - w1 / 2).toFixed(2) + ' and ' + (t2.x - w2 / 2).toFixed(2));
	ok('...and their centres are therefore NOT equal', Math.abs(t1.x - t2.x) > 1,
		t1.x.toFixed(2) + ' vs ' + t2.x.toFixed(2));
	// Y is the other way round from what "upper" suggests: the document is Y-up, memory is Y-down,
	// so the centre of a label sits half a line FURTHER DOWN in memory than its top edge.
	// A BAND, NOT AN EQUALITY, AND THE REASON IS THE FINDING (Task 331). The conversion adds half a
	// line height measured in WORLD units, and since text became SCREEN PIXELS that quantity is a
	// function of the zoom in force when the import ran. Re-deriving it here compares it against the
	// zoom in force NOW -- after the post-import fit moved the scale again -- so an exact identity
	// tests the harness's ability to reproduce a scale, not the importer. Direction and order of
	// magnitude are what the conversion actually promises; determinism is asserted separately below,
	// and that is the property that was genuinely at risk.
	ok('the label centre drops BELOW the top-left corner EPANET stored, by under a line',
		t1.y > -420 && t1.y < -420 + L.lineHeight(),
		t1.y.toFixed(2) + ', line height ' + L.lineHeight().toFixed(2));

	// An anchored label stores an OFFSET from its node; EPANET stores the absolute point. The
	// re-anchoring above applies to the offset, since it moves the label and not the node.
	const anchored = labels.find(l => l.anchorNode === 'R2');
	ok('an anchored label becomes an offset from its node, not a position',
		!!anchored && Math.abs(anchored.x - L.labelWidth(anchored.id) / 2) < 1e-9 &&
		anchored.y > 20 && anchored.y < 20 + L.lineHeight(),
		anchored ? anchored.x.toFixed(2) + ',' + anchored.y.toFixed(2) : 'missing');

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
	ok('it says the demand categories were added together, and names the junction',
		t.indexOf('more than one demand') >= 0 && t.indexOf('J3') >= 0);
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
	// Tall and narrow, where a reservoir is wide and short. nodeRadius() is the circumscribing
	// half-diagonal every other consumer reads, so this also pins that a tank is bigger than a
	// junction and every clear-run inset, label leader and hit test follows.
	ok('the tank reads taller than it is wide',
		parseFloat(tkEl.symbol.getAttribute('height')) > parseFloat(tkEl.symbol.getAttribute('width')),
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

	// ---- KNOWN DEFECT, ASSERTED AS SUCH: importing is NOT deterministic (Task 331 -> 332) --------
	// reanchorImportedLabels() converts EPANET's top-left label anchor into our centre anchor using
	// two world-unit measurements of text that is sized in SCREEN PIXELS. Both therefore depend on
	// the zoom in force when the import ran -- whatever the previously open project was left at -- so
	// the same file imported from two different views stores two different sets of coordinates, with
	// nothing on screen to suggest anything went wrong.
	//
	// THE ASSERTION IS DELIBERATELY INVERTED, and this is not a way of blessing the bug. It keeps the
	// evidence executable rather than filed as prose in a document nobody re-reads, and it means the
	// person who closes Task 332 is TOLD, by a failing check with this comment attached, that they
	// have fixed it and should flip the assertion. A silently deleted check would have left them
	// wondering whether the determinism they just achieved was ever wanted.
	//
	// Fitting before converting was tried and reverted: zoomExtent() derives its scale from bbox(),
	// which measures the rendered label text, so fit-then-convert is circular. The real fix is to
	// render imported labels top-left anchored and store EPANET's point unchanged.
	{
		importText(usInp, 'import-cases');
		const first = L.getDoc().labels.map(l => l.id + ':' + l.x.toFixed(6) + ',' + l.y.toFixed(6)).join('|');
		L.zoomAbout(0, 0, 8);          // arrive from a wildly different view
		importText(usInp, 'import-cases');
		const again = L.getDoc().labels.map(l => l.id + ':' + l.x.toFixed(6) + ',' + l.y.toFixed(6)).join('|');
		ok('KNOWN DEFECT (Task 332): import coordinates still depend on the starting zoom',
			again !== first,
			again !== first ? 'differs as expected -- if this now FAILS, Task 332 is fixed: flip this assertion'
				: 'IDENTICAL -- Task 332 appears fixed; invert this check and delete the xfail comment');
	}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
