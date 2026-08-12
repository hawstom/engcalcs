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

// The page loads js/lpn-inp.js before js/looped-network.js; do the same, onto the same EngCalcs.
require(ROOT + 'js/lpn-inp.js');

// FileReader is the browser's; the import path is written around it, so it is stubbed rather than
// bypassed -- calling docFromInp() directly would skip importInpFromFile()'s own ordering, and the
// order (units strip first, THEN the conversion) is exactly the thing most likely to be wrong.
let lastAlert = null;
global.FileReader = function () {
	this.readAsText = function (file) {
		this.result = file._text;
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
	"\t\tlabelWidth: function (id) { return labelEls[id].width; },\n" +
	"\t\tlineHeight: function () { return effectiveFontSize(1) * 1.2; },\n" +
	// init() never runs (that is the point of the injection), so the SVG layer variables it would
	// have built are undefined. Same one-time setup example-network-harness.js does.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tdocVersion: function () { return openDocVersion; }, "
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

	// The TCV. Its whole loss is the SETTING (12); the [VALVES] minor-loss column is ignored by
	// EPANET itself, which is measured in js/lpn-inp.js and is not what the column heading implies.
	const v1 = links.find(l => l.id === 'V1');
	ok('a throttle valve becomes a pipe of zero length, so it adds friction to nothing',
		v1.type === 'pipe' && v1._length === 0, v1.type + ', L=' + v1._length);
	ok('...carrying the valve setting as its local loss, and NOT the ignored minor-loss column',
		v1._k === 12, 'k=' + v1._k);

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
	ok('the label centre drops half a line below the top-left corner EPANET stored',
		Math.abs(t1.y - (-420 + L.lineHeight() / 2)) < 1e-9,
		t1.y.toFixed(2) + ' vs ' + (-420 + L.lineHeight() / 2).toFixed(2));

	// An anchored label stores an OFFSET from its node; EPANET stores the absolute point. The
	// re-anchoring above applies to the offset, since it moves the label and not the node.
	const anchored = labels.find(l => l.anchorNode === 'R2');
	ok('an anchored label becomes an offset from its node, not a position',
		!!anchored && Math.abs(anchored.x - L.labelWidth(anchored.id) / 2) < 1e-9 &&
		Math.abs(anchored.y - (20 + L.lineHeight() / 2)) < 1e-9,
		anchored ? anchored.x.toFixed(2) + ',' + anchored.y.toFixed(2) : 'missing');

	// nextId has to clear every id the file brought or the next junction drawn would be J1 again.
	ok('nextId clears the ids the file brought', L.nextId().J === 7 && L.nextId().R === 3,
		'J' + L.nextId().J + ' R' + L.nextId().R);

	ok('the project is named after the file', L.getProject().name === 'import-cases',
		L.getProject().name);
	ok('an imported project starts SAVED, not modified', L.indexEntry(L.openId()).dirty === false);
	ok('the document is written at the current version', L.docVersion() === 4, L.docVersion());
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
	ok('it says the throttle valves became pipes, and names them',
		t.indexOf('throttle control valves') >= 0 && t.indexOf('V1') >= 0);
	ok('it says the demand categories were added together, and names the junction',
		t.indexOf('more than one demand') >= 0 && t.indexOf('J3') >= 0);
	ok('it says the emitter is being solved but cannot be edited',
		t.indexOf('sprinkler or leak coefficient') >= 0 && t.indexOf('J6') >= 0);
	ok('no sentence is left as a bare code name', t.indexOf('valve-tcv-as-pipe') < 0);
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
// 5. A file that is not an .inp is refused, and says so.
// ---------------------------------------------------------------------------
console.log('\n--- a file that is not a network ---');
{
	const before = L.getDoc().nodes.length;
	importText('{"v":4,"nodes":[]}', 'notanetwork.inp');
	ok('it is refused with a message', !!lastAlert, JSON.stringify(lastAlert));
	ok('and nothing was imported over the open project', L.getDoc().nodes.length === before);
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
