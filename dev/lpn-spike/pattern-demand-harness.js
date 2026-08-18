// Does an imported demand PATTERN reach the solver? -- ROADMAP Task 423.
//
//   node dev/lpn-spike/pattern-demand-harness.js
//
// js/lpn-patterns.js and js/lpn-inp.js could already read a pattern before this existed; nothing
// consumed one. The reading was therefore correct and invisible, which is the worst pair: Net3
// imported cleanly, drew correctly, solved without complaint, and every junction was low.
//
// **THE ASSERTION THAT MATTERS IS THE BLANK COLUMN.** A junction whose [JUNCTIONS] pattern column
// is empty does not have "no pattern" -- it has [OPTIONS] Pattern, which Net3 sets to `1`. A
// reader that treats blank as 1.0 leaves nearly every junction 34% low with every number on screen
// looking perfectly reasonable, so that case is tested first and by name.
//
// The reference is EPA's own published Net3 report at 0:00 (dev/lpn-spike/reference/Net3.rpt),
// the same source dev/lpn-spike/net3-vs-epanet-report.js measures against. That report puts our
// unpatterned heads 41 ft out at their worst and our patterned ones 0.01 ft out, so the bound here
// is 0.1 ft -- far inside the gap the patterns close, and far outside float noise.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, GPM, FT } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');

// The page's own load order (Task 423 put js/lpn-patterns.js ahead of js/lpn-inp.js in
// Looped-Network.php). In Node, js/lpn-inp.js requires the clock itself, so this is belt and
// braces -- and it is the line that would fail loudly if that require were ever removed.
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();

let fails = 0;
// RELATIVE, not absolute. A demand crosses into the model in m3/s and comes back out in gpm, and
// (x*f)/f is not an identity in doubles -- the same fact CLAUDE.md's unit rule is built on. The
// claim here is "the multiplier was applied", which a part-per-billion bound states exactly; an
// absolute 1e-9 would instead be a claim about float arithmetic, and node 15's 620 gpm fails it.
function near(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const inpPath = path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp');
setUnitSet('si');   // the file's units must win, exactly as in inp-import-harness.js
byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'Net3.inp', _text: fs.readFileSync(inpPath, 'utf8') });

const doc = L.getDoc();

// ---------------------------------------------------------------------------
// 1. The clock reached the document.
// ---------------------------------------------------------------------------
console.log('\n--- the document carries the clock ---');
ok('[PATTERNS] came in', doc.patterns.length === 5, doc.patterns.length + ' patterns');
ok('[OPTIONS] Pattern came in as the document default', doc.defaultPattern === '1',
	JSON.stringify(doc.defaultPattern));
ok('[TIMES] came in', !!doc.times && doc.times.duration === 24 * 3600,
	doc.times && doc.times.duration + ' s');
ok('[CONTROLS] came in', doc.controls.length > 0, doc.controls.length + ' controls');

// **THE DEFAULT IS NOT WRITTEN ONTO THE JUNCTION.** The file does not name a pattern at that row,
// so nothing of ours may appear in a field labelled as the file's (CLAUDE.md's number rule). The
// resolution happens at the solve and only there.
const blank = doc.nodes.filter(n => n.type === 'junction' && !n.demandPattern);
ok('a blank pattern column stays blank on the junction', blank.length > 0,
	blank.length + ' junctions state no pattern of their own');

// ---------------------------------------------------------------------------
// 2. The multiplier reaches the solver -- and NOT the document.
// ---------------------------------------------------------------------------
console.log('\n--- base demand in the document, patterned demand at the solver ---');
const model = L.assembleModel();
const modelNode = {};
model.nodes.forEach(n => { modelNode[n.id] = n; });

const pat1 = EngCalcs.lpnPatternById(doc.patterns, '1');
const m0 = EngCalcs.lpnPatternValue(pat1, 0, doc.times.patternStep, doc.times.patternStart);
ok('Pattern 1 does not start at 1.0 -- so this test can tell the two answers apart',
	Math.abs(m0 - 1) > 0.01, 'multiplier at t=0 is ' + m0);

{
	// The blank-column junction with the largest demand, so a wrong answer is unmistakable.
	const j = blank.filter(n => n._demand).sort((a, b) => b._demand - a._demand)[0];
	const declared = j._demand;
	const solved = modelNode[j.id].demand / GPM;
	ok('the document still holds the file\'s own base demand', declared === j._demand,
		j.id + ' = ' + declared + ' gpm');
	ok('...and the solver is handed base x the DEFAULT pattern\'s multiplier',
		near(solved, declared * m0),
		j.id + ': ' + solved.toFixed(6) + ' gpm vs ' + (declared * m0).toFixed(6));
	ok('...which is NOT the base demand -- the blank column was resolved, not ignored',
		Math.abs(solved - declared) > 1e-6);
}

{
	// A junction that names its own pattern uses that one, not the document default.
	const named = doc.nodes.filter(n => n.demandPattern && n.demandPattern !== '1' && n._demand);
	if (named.length) {
		const j = named[0];
		const p = EngCalcs.lpnPatternById(doc.patterns, j.demandPattern);
		const m = EngCalcs.lpnPatternValue(p, 0, doc.times.patternStep, doc.times.patternStart);
		ok('a junction naming its own pattern uses THAT one',
			near(modelNode[j.id].demand / GPM, j._demand * m),
			j.id + ' on pattern ' + j.demandPattern + ' (x' + m + ')');
	} else {
		ok('a junction naming its own pattern uses THAT one', true, 'none in Net3 -- not applicable');
	}
}

// ---------------------------------------------------------------------------
// 3. The whole network now lands where EPA's own report puts it.
// ---------------------------------------------------------------------------
// This is the check the other two exist to explain. Before Task 423 the worst head here was 41 ft
// out and nothing on the page said so.
console.log('\n--- and it solves to EPA\'s published Net3 report at 0:00 ---');
{
	const res = require(ROOT + 'js/lpn-solver.js').lpnSolve(model);
	ok('it converges', res.ok && res.converged, res.iterations + ' iterations');

	const rpt = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.rpt'), 'utf8');
	// The report is an EXTENDED-PERIOD run; 0:00 is the only block a steady-state page can be
	// compared against, and it ends at the next block's header.
	// **THE 0:00 BLOCK IS THREE BLOCKS**, the second and third headed "(continued)". Splitting on
	// the first header and stopping at the next one reads 36 of the 97 nodes and says nothing --
	// so the end is the next block for a DIFFERENT time, and the continuation headers in between
	// are simply lines that parse as nothing.
	const at0 = rpt.split(/Node Results at 0:00/).slice(1).join('\n')
		// ...and the block that FOLLOWS them is Link Results at the same time, whose rows also parse
		// as three numbers. Reading them as nodes put a link's flow where node 60's head belongs and
		// reported a 199 ft error against a correct solve -- a harness bug that looks exactly like a
		// solver fault (dev/testing-notes.md's standing lesson, and the reason this comment is here).
		.split(/Link Results at/)[0];
	const want = {};
	at0.split(/\r?\n/).forEach(function (line) {
		const t = line.trim().split(/\s+/);
		// id, demand, head, pressure, [quality] -- a data row is one whose 3rd column is a number.
		if (t.length >= 4 && /^[-\d.]+$/.test(t[2]) && /^[-\d.]+$/.test(t[1])) { want[t[0]] = +t[2]; }
	});
	ok('the published report was read', Object.keys(want).length > 90,
		Object.keys(want).length + ' nodes in the 0:00 block');

	let worst = 0, worstId = null;
	Object.keys(want).forEach(function (id) {
		if (!res.heads[id]) { return; }
		const d = Math.abs(res.heads[id] / FT - want[id]);
		if (d > worst) { worst = d; worstId = id; }
	});
	ok('every head matches EPA\'s own report', worst < 0.1,
		'worst ' + worst.toFixed(3) + ' ft at ' + worstId);
}

// ---------------------------------------------------------------------------
// 4. And the clock survives being written back out.
// ---------------------------------------------------------------------------
// **AN EXPORT THAT DROPPED THE CLOCK WOULD BE A FILE THAT SOLVES DIFFERENTLY IN EPANET THAN THE ONE
// IT CAME FROM**, with every number in it looking reasonable -- demands a third low, exactly the
// failure this task was about. So the round trip is closed here rather than assumed.
console.log('\n--- and it comes back out again ---');
{
	// serializeProject(), not the live `doc`: the writer reads the project's UNITS and settings, and
	// it reads coordinates in the Cartesian frame a file is written in. Handing it the y-down memory
	// document would export a network mirrored north-south with no units named.
	const out = EngCalcs.lpnExportInp(L.serialize(), {
		effective: function (el, prop) { return el['_' + prop]; }
	});
	ok('the export succeeds', !!out && out.ok, out && out.detail);
	const text = (out && out.inp) || '';
	ok('[PATTERNS] is written', /\[PATTERNS\]/.test(text));
	ok('[TIMES] is written', /\[TIMES\]/.test(text));
	ok('[CONTROLS] is written', /\[CONTROLS\]/.test(text));
	// row() writes a leading SPACE then tabs between cells, so the line reads ` Pattern\t1`.
	ok('[OPTIONS] names the default demand pattern', /\n Pattern\t1(\s|$)/.test(text));

	// The one that matters: read our own file back and solve it. Same demands, same heads.
	const back = EngCalcs.lpnInpParse(text);
	ok('our own file parses', back.ok, back.error);
	ok('...with the same five patterns', back.patterns.length === 5, back.patterns.length);
	ok('...the same default', back.defaultPattern === '1', JSON.stringify(back.defaultPattern));
	ok('...the same duration', back.times && back.times.duration === 24 * 3600,
		back.times && back.times.duration);
	ok('...and the same controls', back.controls.length === doc.controls.length,
		back.controls.length + ' vs ' + doc.controls.length);
	// A junction that named its own pattern still does, and one that did not still does not.
	const named = back.nodes.filter(n => n.type === 'junction' && n.demandPattern);
	ok('...and only the junctions that stated a pattern carry one',
		named.length === doc.nodes.filter(n => n.demandPattern).length,
		named.length + ' of ' + back.nodes.length);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
