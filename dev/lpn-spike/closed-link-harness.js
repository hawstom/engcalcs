// Harness for the Open/Closed link property (ROADMAP Task 146.07) -- run with:
//   node dev/lpn-spike/closed-link-harness.js
//
// WHY THIS EXISTS. Almost the whole feature already existed and was unreachable: `_status` was
// written at addLink(), serialized with the project, listed in LPN_OVERRIDABLE, read by
// assembleModel() through effective(), honoured in four places by js/lpn-solver.js, and parsed
// from an EPANET .inp by js/lpn-inp.js. Only the popup checkbox was missing. That is exactly the
// shape of change that LOOKS finished after one browser click -- the box ticks, the pipe goes
// dashed -- while the parts nobody can see from the map (does the solver actually route around
// it? does the state survive a save?) go unverified. Tom's browser passes are slow and tiring
// (CLAUDE.md, "Minimize browser passes"), so this checks the invisible half in ~200 ms.
//
// The example network is a RING, which is the case worth testing: closing one of its two parallel
// paths must force all the flow through the other, and that is a claim about the solver, not the
// checkbox.

const { ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, effective: effective,\n" +
	"\t\tlinkById: linkById, rebuildLink: rebuildLink,\n" +
	"\t\tlinkClass: function (id) { return linkEls[id] ? (linkEls[id].line.getAttribute('class') || '') : null; },\n" +
	// The popup path, not a direct write: the point is that the CHECKBOX produces the state, so a
	// regression in renderLinkFields is caught here rather than only in a browser.
	"\t\trenderLinkFields: renderLinkFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved, buildDom: buildDom,\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// All text under a node, including the .ec-help span setFieldLabel() nests the words in when a
// tip is present, and the text nodes createTextNode() returns (which have no children).
function allText(n) {
	if (!n) { return ''; }
	let t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allText(c); });
	return t;
}

// Finds the shut-this-pipe checkbox the popup actually rendered, rather than trusting a field
// order -- so reordering renderLinkFields() does not silently retarget this test at another
// checkbox.
//
// IT MATCHES ON THE LIVE LANG STRING, NEVER ON A HARDCODED WORD. This used to test /Closed/, and
// on 2026-08-14 the English label became "Shut" (the word "closed" is a polysemy inside hydraulics
// -- a closed conduit is a pressurised pipe) and all ten assertions below failed at once. The
// harness was right to fail: it had a real coupling to the label. But it was coupled to the wrong
// thing -- a test that breaks when a WORD changes is testing the wording, and this one would have
// broken identically for any of the 26 translations. Reading pageConfig makes it track whatever the
// label says, in whatever language the stub is running.
//
// NOTE two shapes of the DOM stub: tagName is UPPERCASE (mkEl uppercases it), and there is no
// dispatchEvent -- the house pattern in these harnesses is to call the registered _listeners
// directly. Getting either wrong makes every assertion below fail for the wrong reason.
function closedBoxIn(fields) {
	const found = [];
	(function walk(node) {
		if (!node || !node.children) { return; }
		for (const c of node.children) {
			if (c.tagName === 'INPUT' && c.type === 'checkbox') { found.push({ box: c, parent: node }); }
			walk(c);
		}
	})(fields);
	const label = (global.EngCalcs && EngCalcs.pageConfig && EngCalcs.pageConfig.lpn_field_closed) || 'Shut';
	for (const f of found) {
		if (allText(f.parent).indexOf(label) !== -1) { return f.box; }
	}
	return null;
}
function fire(el, type) { (el._listeners[type] || []).forEach(function (fn) { fn({ type: type, currentTarget: el, target: el }); }); }

console.log('=== Task 146.07: Open/Closed link ===');

setUnitSet('us');
L.reset();
L.drawExample();

// Solve the way the app does: runSolve() for its side effects (labels, fit, status line), then
// the model + solver directly for the numbers, exactly as example-network-harness.js does. The
// app's own runSolve() returns nothing -- it stores into lastSolveResult -- so a test that wants
// flows has to go through EngCalcs.lpnSolve like every other harness here.
function solve() {
	L.runSolve();
	return EngCalcs.lpnSolve(L.assembleModel(), { tol: 1e-9 });
}

// ---- 1. Baseline: the ring solves, and both parallel paths carry water --------------------
let r = solve();
const doc0 = L.getDoc();
const pipes = doc0.links.filter(function (l) { return l.type === 'pipe'; });
ok('example network has at least 2 pipes', pipes.length >= 2, 'got ' + pipes.length);
ok('baseline solve converged', r && r.ok && r.converged === true, r && r.message);

const baseFlows = {};
pipes.forEach(function (l) { baseFlows[l.id] = r.flows[l.id]; });
const carrying = pipes.filter(function (l) { return Math.abs(baseFlows[l.id]) > 1e-9; });
ok('every pipe carries flow when all are open', carrying.length === pipes.length,
	pipes.length - carrying.length + ' pipe(s) already at zero flow');

// Pick a pipe whose closure leaves the network solvable: one carrying flow, that is part of the
// ring rather than the single feed. The feed is whichever pipe carries the most -- closing that
// would isolate everything, which is a DIFFERENT test (below).
const ranked = pipes.slice().sort(function (a, b) { return Math.abs(baseFlows[b.id]) - Math.abs(baseFlows[a.id]); });
const ringPipe = ranked[ranked.length - 1];

// ---- 2. The CHECKBOX closes it ------------------------------------------------------------
L.renderLinkFields(ringPipe.id);
const fields = L.popupFields();
const box = closedBoxIn(fields);
ok('link popup renders a Closed checkbox', !!box);
ok('checkbox starts unchecked on an open pipe', !!box && box.checked === false);

const undoBefore = L.undoDepth();
if (box) {
	box.checked = true;
	fire(box, 'change');
}
ok('checking the box sets _status to closed', L.effective(L.linkById(ringPipe.id), 'status') === 'closed',
	'got ' + L.effective(L.linkById(ringPipe.id), 'status'));
ok('closing takes an undo snapshot', L.undoDepth() === undoBefore + 1,
	'depth ' + undoBefore + ' -> ' + L.undoDepth());

// ---- 3. It is VISIBLE on the map -----------------------------------------------------------
ok('closed link is drawn with lpn-link-closed', /\blpn-link-closed\b/.test(L.linkClass(ringPipe.id) || ''),
	'class = ' + L.linkClass(ringPipe.id));
const otherPipe = pipes.find(function (l) { return l.id !== ringPipe.id; });
ok('an open link is NOT drawn closed', !/\blpn-link-closed\b/.test(L.linkClass(otherPipe.id) || ''),
	'class = ' + L.linkClass(otherPipe.id));

// ---- 4. The SOLVER honours it --------------------------------------------------------------
r = solve();
ok('network still solves with one ring pipe closed', r && r.ok && r.converged === true, r && r.message);
ok('closed pipe carries exactly zero flow', r && Math.abs(r.flows[ringPipe.id]) < 1e-12,
	'flow = ' + (r && r.flows[ringPipe.id]));
// The whole point of a ring: the flow the closed pipe was carrying has to reappear elsewhere.
const movedSomewhere = pipes.some(function (l) {
	return l.id !== ringPipe.id && Math.abs(Math.abs(r.flows[l.id]) - Math.abs(baseFlows[l.id])) > 1e-6;
});
ok('flow redistributes to the rest of the ring', movedSomewhere);

// ---- 5. It SURVIVES a save/reload ----------------------------------------------------------
const saved = JSON.parse(JSON.stringify(L.serializeProject()));
L.reset();
L.applySaved(saved);
// applySaved() restores the DOCUMENT; buildDom() is what turns it back into SVG. The app calls
// both (they are separate so a load can validate before drawing), so a test that skipped buildDom
// would be asking about elements the app had not built yet and reporting a bug that is its own.
L.buildDom();
ok('closed state survives serialize + applySaved',
	L.effective(L.linkById(ringPipe.id), 'status') === 'closed',
	'got ' + L.effective(L.linkById(ringPipe.id), 'status'));
ok('reloaded closed link is still drawn closed',
	/\blpn-link-closed\b/.test(L.linkClass(ringPipe.id) || ''),
	'class = ' + L.linkClass(ringPipe.id));

// ---- 6. Reopening restores the original solution --------------------------------------------
L.renderLinkFields(ringPipe.id);
const box2 = closedBoxIn(L.popupFields());
ok('checkbox reads back as checked on a closed pipe', !!box2 && box2.checked === true);
if (box2) {
	box2.checked = false;
	fire(box2, 'change');
}
ok('unchecking reopens the link', L.effective(L.linkById(ringPipe.id), 'status') === 'open');
ok('reopened link loses the dashed class', !/\blpn-link-closed\b/.test(L.linkClass(ringPipe.id) || ''));
r = solve();
const restored = pipes.every(function (l) { return Math.abs(r.flows[l.id] - baseFlows[l.id]) < 1e-6; });
ok('reopening restores the original flows exactly', restored);

console.log(fails === 0 ? '\nAll checks passed.' : '\n' + fails + ' FAILURE(S).');
process.exit(fails === 0 ? 0 : 1);
