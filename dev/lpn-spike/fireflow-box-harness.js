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
	"\t\tdefaults: function () { return fireFlowDefaults(); },\n" +
	// The run dialog, read the way a person reads it: what is on the screen, not what the page
	// believes. `done` comes back out of the rendered count line rather than out of a counter.
	"\t\trunUi: function () { var b = document.getElementById('lpn_ff_run_box');\n" +
	"\t\t\treturn { display: b ? b.style.display : null,\n" +
	"\t\t\t\ttext: ffRunUi ? ffRunUi.count.textContent : '',\n" +
	"\t\t\t\ttally: ffRunUi ? ffRunUi.tally.textContent : '',\n" +
	"\t\t\t\twidth: ffRunUi ? ffRunUi.fill.style.width : '',\n" +
	"\t\t\t\ttotal: ffRunUi ? ffRunUi.total : 0,\n" +
	"\t\t\t\tstopDisabled: ffRunUi ? !!ffRunUi.stop.disabled : null }; },\n" +
	"\t\tpressStop: function () { if (!ffRunUi) { return false; }\n" +
	"\t\t\t(ffRunUi.stop._listeners.click || []).forEach(function (f) { f(); }); return true; },\n" +
	"\t\trunBoxText: function () { var b = document.getElementById('lpn_ff_run_box');\n" +
	"\t\t\treturn b ? b : null; },\n" +
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
// The heading row's width. Column width is king, so how many columns there are is a fact worth
// asserting rather than counting by eye in a browser.
function headCells(el) {
	let n = 0;
	(el.children || []).forEach(c => {
		if (c._tag === 'th' || c.tagName === 'TH') { n++; }
		n += headCells(c);
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

	console.log('\n--- the criteria the box opens on ---');
	// **10 ft/s, NOT 5** (Tom, 2026-08-30: "I would have used 10 (3 m/s)."). A DISPLAY value in this
	// project's units, so under the US preset it is the number a person would type.
	ok('the velocity criterion opens at 10 ft/s', L.defaults().maxVelocity === '10',
		L.defaults().maxVelocity);

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
	// **THE LOSS ACCOUNTING IS A STATED METHOD, NOT A STATED ABSENCE** (Tom, 2026-08-30, reading the
	// first wording: "It says that no losses are accounted for at the raw node."). It has to lead
	// with what the tool DOES, and it still has to say what is left out.
	ok('it says where the fire flow is drawn',
		controls.indexOf('Fire flow is drawn at the junction itself') >= 0,
		'this is the one thing Tom asked to be explicit about');
	ok('and that this is the method rather than an omission',
		controls.indexOf('That is the method used here') >= 0);
	ok('and it still names what is not modelled',
		controls.indexOf('nozzle are not modelled') >= 0);
	ok('and it says which engine will do the work, in the present tense',
		controls.indexOf('This is worked out with') >= 0 &&
		controls.indexOf('will be worked out') < 0);
	ok('a run has not happened yet, so there is no report', textOf(byId.lpn_ff_report).trim() === '');

	console.log('\n--- one run, one result set, one wide table ---');
	// Not `=== 'none'`: the page ships it hidden by an inline style ATTRIBUTE, which the stub keeps
	// as a string rather than parsing into style.display. What is asserted is what matters, which
	// is that nothing has shown it.
	ok('the run dialog is not on screen before a run', byId.lpn_ff_run_box.style.display !== 'block',
		String(byId.lpn_ff_run_box.style.display));
	const before = JSON.stringify(L.getDoc());
	// A requirement big enough that this small example cannot meet it everywhere, so all three
	// states are reachable. The numbers are DISPLAY values, in the project's own units, exactly as
	// a person would type them.
	L.setAsk('required', '250');
	L.setAsk('design', 'all');
	L.setAsk('minPressure', '20');
	L.setAsk('maxVelocity', '2');
	// **THE RUN IS WATCHED WHILE IT RUNS.** The sweep yields a macrotask between junctions, so a
	// poll on the same queue interleaves with it and sees the dialog as a person would -- rather
	// than being told about it by a counter the page keeps. Nothing is stubbed out to make this
	// work: it is the real sweep over the real example.
	const running = L.runFireFlowSweep();
	const opened = L.runUi();
	ok('the run dialog appears as the run starts', opened.display === 'block', opened.display);
	ok('the bar starts empty and knows its total',
		opened.width === '0%' && opened.total === L.junctionIds().length,
		opened.width + ' of ' + opened.total);
	ok('and it counts junctions from zero', opened.text.indexOf('0 of ' + opened.total) >= 0,
		opened.text);
	const samples = [];
	let watching = true;
	(function poll() {
		if (!watching) { return; }
		samples.push(L.runUi());
		setTimeout(poll, 0);
	}());
	await running;
	watching = false;
	const set = L.run();
	const midRun = samples.filter(x => x.display === 'block' && x.total > 0 &&
		/(\d+) of /.test(x.text) && +/(\d+) of /.exec(x.text)[1] > 0);
	ok('the dialog stays up while the run is going, and the bar advances',
		midRun.length > 0 && midRun.some(x => x.width !== '0%'),
		samples.length + ' samples, ' + midRun.length + ' with work done');
	// **done/total, AND THE BAR IS THAT FRACTION.** A bar that moves is not the claim; a bar that
	// says how far along the run actually is, is.
	ok('and the bar is done/total rather than an animation',
		midRun.every(x => x.width === (Math.round(1000 * (+/(\d+) of /.exec(x.text)[1]) / x.total) / 10) + '%'),
		JSON.stringify(midRun.slice(0, 2)));
	ok('Stop is reachable at every moment of the run',
		samples.length > 0 && samples.every(x => x.stopDisabled === false));
	// **NO TIME ESTIMATE, EVER** (per-solve cost RISES through a run, so an ETA gets worse as it
	// goes). Nothing on this dialog may name a duration.
	const runText = textOf(byId.lpn_ff_run_box);
	ok('and nothing on the dialog forecasts a time',
		!/(remaining|time left|estimated|eta\b|second|minute|hour)/i.test(runText), runText);
	ok('the running tally is the same three states the report opens with',
		samples.some(x => /passing/.test(x.tally) && /failing/.test(x.tally)));
	ok('the dialog goes when the run ends', L.runUi().display === 'none');
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
	// **ONE TABLE, NOT TWO** (Tom, 2026-08-30). Both halves of the answer are on one row per
	// junction, in this page's own words rather than the competitor's.
	ok('there is one table under one heading', report.indexOf('Every junction tested') >= 0 &&
		report.indexOf('Available against required') < 0);
	['Junction', 'Rest pressure', 'Available', 'Required', 'Residual held',
		'Pressure at required', 'Pulled down', 'Design limit', 'Solves', 'Result'
	].forEach(function (h) {
		ok('the table has a "' + h + '" column', report.indexOf(h) >= 0);
	});
	ok('and it is ten columns wide', headCells(byId.lpn_ff_report) === 10,
		String(headCells(byId.lpn_ff_report)));
	ok('the summary counts all three states',
		report.indexOf('passing') >= 0 && report.indexOf('failing') >= 0 &&
		report.indexOf('design issue') >= 0);
	ok('the ISO credit limit travels with the numbers', report.indexOf('ISO credits') >= 0);
	// The table has a heading row plus one row per junction, capped -- the example is well under
	// the cap, so every junction is printed.
	ok('the table prints one row per tested junction, plus the heading',
		rowCount(byId.lpn_ff_report) === set.results.length + 1,
		rowCount(byId.lpn_ff_report) + ' rows for ' + set.results.length + ' junctions');
	// The design half is on the SAME row now, so a junction that pulled something down says so
	// beside its own flow rather than in a second table further down.
	const pulled = set.results.filter(r => r.effects && (r.effects.nodes.length || r.effects.links.length));
	ok('a junction that pulled something down names it on its own row',
		pulled.length > 0 && pulled.every(r => report.indexOf(r.id) >= 0) &&
		(report.indexOf('down to') >= 0 || report.indexOf(' at ') >= 0),
		pulled.length + ' junctions with an effect');

	console.log('\n--- a cell with no number shows a dash, never a zero ---');
	// A residual no junction in this network can hold with nothing drawn: every record comes back
	// with no available flow at all, which is the state that must never print as a flow of zero.
	L.setAsk('residual', '400');
	await L.runFireFlowSweep();
	const none = L.run();
	ok('no junction has an available flow at all',
		none.results.every(r => r.available === undefined), JSON.stringify(none.counts));
	const blankText = textOf(byId.lpn_ff_report);
	ok('and the table shows a dash where there is no number', blankText.indexOf('\u2013') >= 0);
	ok('and never prints a flow of zero', !/\b0(\.0+)? gpm/.test(blankText), blankText.slice(0, 200));
	L.setAsk('residual', '20');
	await L.runFireFlowSweep();

	console.log('\n--- Stop is reachable, and a stopped run keeps what it had ---');
	const stopping = L.runFireFlowSweep();
	await new Promise(r => setTimeout(r, 0));
	ok('the dialog is up and Stop can be pressed', L.pressStop() === true);
	const stopped = await stopping;
	ok('the run stopped early', stopped.stopped === true);
	ok('and kept what it had already worked out',
		stopped.results.length > 0 && stopped.results.length < L.junctionIds().length,
		stopped.results.length + ' of ' + L.junctionIds().length);
	ok('and the dialog went with it', L.runUi().display === 'none');
	ok('and the table says how far it got',
		textOf(byId.lpn_ff_report).indexOf('Stopped after') >= 0);
	// Back to a whole run, so the assertions below are about a complete result set.
	await L.runFireFlowSweep();

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
	ok('every tested junction wears exactly one fire flow class', marked === L.run().results.length,
		marked + ' marked, ' + L.run().results.length + ' tested');
	// The class each junction wears is the state the result set holds for it -- not merely "some
	// class", which a bug that painted everything green would also satisfy.
	const agree = L.run().results.every(function (r) {
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
