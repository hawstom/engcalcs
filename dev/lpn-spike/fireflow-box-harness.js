// The fire flow BOX, driven through js/looped-network.js's own entry points (ROADMAP Task 530).
// Run:  node dev/lpn-spike/fireflow-box-harness.js
//
// dev/lpn-spike/fireflow-harness.js proves the arithmetic. This proves the half that arithmetic
// cannot reach, and that a browser pass is otherwise the only way to see:
//
//   * the box builds its criteria and its two reports out of the real document and the real units;
//   * the sweep goes through assembleModel() and the page's own engine choice;
//   * the RESULT SET NEVER REACHES AN ELEMENT. The document is byte-identical across a whole run,
//     which is what keeps setProp() and the scenario write seam out of this feature entirely;
//   * the marks on the map are the states, one class per junction and no junction wearing two;
//   * AN EDIT CLEARS THE RUN, marks and all -- a picture of a network that has since changed is
//     worse than no picture.
//
// The network is the shipped gallery example, opened the way a visitor opens it.

const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\topenFireFlowBox: openFireFlowBox, closeFireFlowBox: closeFireFlowBox,\n" +
	"\t\twireFireFlowBox: wireFireFlowBox,\n" +
	"\t\trunFireFlowSweep: runFireFlowSweep,\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\task: function () { return fireFlowAsk; },\n" +
	"\t\trun: function () { return fireFlowRun; },\n" +
	"\t\tdocGuard: function () { return fireFlowDocGuard; },\n" +
	"\t\tscheduleSolve: scheduleSolve,\n" +
	"\t\tnodeClass: function (id) { return nodeEls[id] ? (nodeEls[id].circle.getAttribute('class') || '') : null; },\n" +
	"\t\tjunctionIds: function () { return fireFlowJunctions().map(function (n) { return n.id; }); },\n" +
	// The layers buildDom() writes into, made the way every other harness makes them.
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
// Every text node under an element, joined -- the report is built from <p>, <div>, <th> and <td>,
// so a single walk is what "does the box say this" means here.
function textOf(el) {
	if (!el) { return ''; }
	let out = el.textContent || '';
	(el.children || []).forEach(c => { out += ' ' + textOf(c); });
	return out;
}
function rowCount(el) {
	let n = 0;
	(el.children || []).forEach(c => {
		if (c._tag === 'tr' || c.tagName === 'TR') { n++; }
		n += rowCount(c);
	});
	return n;
}
const MARKS = ['lpn-ff-pass', 'lpn-ff-fail', 'lpn-ff-design', 'lpn-ff-error'];

(async function () {
	// US units, so the numbers typed into the box below are the gpm and psi a person would type.
	setUnitSet('us');
	L.reset();
	openExample(L, 'us');
	L.wireFireFlowBox();
	L.runSolve();

	console.log('\n--- the box opens on the real document ---');
	L.openFireFlowBox();
	ok('it is shown', byId.lpn_ff_box.style.display === 'flex', byId.lpn_ff_box.style.display);
	const controls = textOf(byId.lpn_ff_controls);
	ok('it asks for the required fire flow', controls.indexOf('Required fire flow') >= 0);
	ok('it asks which junctions to test', controls.indexOf('Junctions to test') >= 0);
	ok('it offers the design scope as a set chosen before the run',
		controls.indexOf('Effect on the rest of the system') >= 0);
	// **THE LOSS ACCOUNTING IS ON THE SCREEN** (Tom, 2026-08-25). Not a comment, not a code
	// constant: the sentence a reader sees before they press Run.
	ok('it states that no hydrant or lateral loss is included',
		controls.indexOf('No hydrant, lateral or fitting loss is included') >= 0,
		'this is the one thing Tom asked to be explicit about');
	ok('and it says which engine will do the work',
		controls.indexOf('built-in solver') >= 0 || controls.indexOf('EPANET engine') >= 0);
	ok('a run has not happened yet, so there is no report', textOf(byId.lpn_ff_report).trim() === '');

	console.log('\n--- one run, one result set, two reports ---');
	const before = JSON.stringify(L.getDoc());
	// A requirement big enough that this small example cannot meet it everywhere, so all three
	// states are reachable. The numbers are DISPLAY values, in the project's own units, exactly as
	// a person would type them.
	L.setAsk('required', '250');
	L.setAsk('design', 'all');
	L.setAsk('minPressure', '20');
	L.setAsk('maxVelocity', '2');
	await L.runFireFlowSweep();
	const set = L.run();
	if (process.env.FFDUMP) { console.log(JSON.stringify(set.results.map(r=>({id:r.id,state:r.state,code:r.code,avail:r.available,sp:r.staticPressure,req:r.required})),null,1)); }
	ok('the run finished and was stored', !!set && set.ok === true);
	// **ALL THREE STATES ARE REACHED ON THIS ONE NETWORK AT THIS ONE REQUIREMENT.** Without that,
	// every assertion below about colouring and about the design half would be true of a run in
	// which nothing interesting happened.
	ok('and all three states are represented',
		set.counts.pass > 0 && set.counts.fail > 0 && set.counts.design > 0,
		JSON.stringify(set.counts));
	ok('every junction in the document was tested', set.results.length === L.junctionIds().length,
		set.results.length + ' of ' + L.junctionIds().length);
	// **THE WHOLE POINT OF THE STORAGE DESIGN.** The answers live beside the document; nothing was
	// written to an element, so setProp() and the scenario write seam were never involved.
	ok('the document is byte-identical across the run', JSON.stringify(L.getDoc()) === before);
	ok('and the page says so itself', L.docGuard() === true);

	const report = textOf(byId.lpn_ff_report);
	ok('the report names both questions',
		report.indexOf('Available against required') >= 0 &&
		report.indexOf('Effect on the rest of the system') >= 0,
		'two reports, one run');
	ok('the summary counts all three states',
		report.indexOf('passing') >= 0 && report.indexOf('failing') >= 0 &&
		report.indexOf('design issue') >= 0);
	ok('the ISO credit limit travels with the numbers', report.indexOf('ISO credits') >= 0);
	// The table has a heading row plus one row per junction, capped -- the example is well under
	// the cap, so every junction is printed.
	ok('the first report prints a row for every junction',
		rowCount(byId.lpn_ff_report) >= set.results.length + 1,
		rowCount(byId.lpn_ff_report) + ' rows');

	console.log('\n--- the marks on the map are the states ---');
	let marked = 0;
	L.junctionIds().forEach(function (id) {
		const cls = L.nodeClass(id).split(/\s+/);
		const mine = MARKS.filter(m => cls.indexOf(m) >= 0);
		if (mine.length) { marked++; }
		if (mine.length !== 1) {
			ok('exactly one fire flow class on ' + id, false, JSON.stringify(mine));
		}
	});
	ok('every tested junction wears exactly one fire flow class', marked === set.results.length,
		marked + ' marked, ' + set.results.length + ' tested');
	// The class each junction wears is the state the result set holds for it -- not merely "some
	// class", which a bug that painted everything green would also satisfy.
	const agree = set.results.every(function (r) {
		const want = 'lpn-ff-' + r.state;
		return L.nodeClass(r.id).split(/\s+/).indexOf(want) >= 0;
	});
	ok('and it is the state that junction actually got', agree);

	console.log('\n--- a result set describes the network it was run on ---');
	L.scheduleSolve();   // what every edit on this page goes through
	ok('an edit clears the run', L.run() === null);
	const stillMarked = L.junctionIds().filter(function (id) {
		return MARKS.some(m => L.nodeClass(id).split(/\s+/).indexOf(m) >= 0);
	});
	ok('and takes the marks off the map with it', stillMarked.length === 0,
		JSON.stringify(stillMarked));
	ok('and empties the report', textOf(byId.lpn_ff_report).trim() === '');

	console.log('\n--- the design half is a choice, and turning it off changes the report ---');
	L.setAsk('design', 'off');
	await L.runFireFlowSweep();
	const off = L.run();
	ok('with it off, nothing is checked', off.design === null);
	ok('and the report says so rather than showing an empty table',
		textOf(byId.lpn_ff_report).indexOf('was not checked in this run') >= 0);
	ok('no junction is in the design state', off.counts.design === 0, JSON.stringify(off.counts));
	// The SAME network and the SAME requirement, with the scope back on: the design state has to
	// come back, or the scope control is not doing anything.
	L.setAsk('design', 'all');
	await L.runFireFlowSweep();
	ok('turning it back on brings the design issues back', L.run().counts.design > 0,
		JSON.stringify(L.run().counts));
	ok('and the compliance answers are unchanged by it',
		L.run().counts.pass + L.run().counts.design === off.counts.pass + off.counts.design,
		'the design half must not move a junction between deliverable and not');

	console.log('\n--- closing the box stops a run ---');
	L.closeFireFlowBox();
	ok('the box is hidden', byId.lpn_ff_box.style.display === 'none');

	console.log('');
	if (fails) { console.log(fails + ' FAILED'); process.exit(1); }
	console.log('all fire flow box checks passed');
}()).catch(function (e) { console.error(e); process.exit(1); });
