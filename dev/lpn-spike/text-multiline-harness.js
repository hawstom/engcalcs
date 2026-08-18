// Headless check of MULTI-LINE TEXT OBJECTS -- ROADMAP Task 342, rung 1.
//
//   node dev/lpn-spike/text-multiline-harness.js
//
// WHY THIS EXISTS. The migration has exactly one acceptance criterion Tom will judge it by:
// **a ONE-line Text label must render pixel-identically to before.** Every existing drawing is
// one-line, so a regression here changes every drawing anybody has ever made, and it changes them
// by a fraction of a line height -- the size of defect nobody reports and everybody notices.
//
// The three properties asserted below, and why each is silent when wrong:
//
//   1. **One line keeps a plain text node.** The measurement path, the hit-test (a tap lands on a
//      tspan, which carries none of its parent's data-lbl) and six existing harnesses all see the
//      single-line shape. Growing a tspan for one line would work on screen and break those.
//   2. **A centred block straddles its point.** The <text>'s y does not move -- the block is
//      raised by half its extra height through the first row's dy, in em so it survives a zoom
//      without being rebuilt. Get the sign wrong and a two-line note hangs entirely below its
//      point, which looks deliberate.
//   3. **Moving a multi-line label moves every ROW.** Each row carries its own explicit x. Setting
//      the parent's x alone leaves the rows behind, and only the FIRST row looks wrong at first
//      glance because it is the one the eye follows.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addText: addText, setProp: setProp, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tlabelEl: function (id) { return labelEls[id] && labelEls[id].text; },\n" +
	"\t\tlines: function (id) { return textLabelLines(labelById(id)); },\n" +
	"\t\tfirstDy: function (id) { return textLabelFirstDy(labelById(id)); },\n" +
	"\t\theight: function (id) { return textLabelHeight(labelById(id)); },\n" +
	"\t\tfontSize: function (id) { return effectiveFontSize(labelById(id).sizeMult); },\n" +
	"\t\tbox: function (id) { var lb = labelById(id);\n" +
	"\t\t\treturn textLabelBox(lb, labelEls[id], lb.x, lb.y); },\n" +
	"\t\tsetAlign: function (id, prop, v) { labelById(id)[prop] = v; refreshLabelContent(id); },\n" +
	"\t\tmoveTo: function (id, x, y) { var lb = labelById(id); lb.x = x; lb.y = y; updateLabelGeometry(id); },\n" +
	"\t\trefreshContent: refreshLabelContent,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; settings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

function tspans(id) {
	const t = L.labelEl(id);
	return (t.childNodes || []).filter(c => c.nodeType === 1);
}
function place(text, x, y) {
	const lb = L.addText(x === undefined ? 100 : x, y === undefined ? 100 : y, null);
	L.setProp(lb, 'text', text);
	L.buildDom();
	return lb.id;
}

// ---- 1. one line is exactly what it was ---------------------------------------------------------
{
	console.log('\n--- one line is unchanged ---');
	L.reset(); L.setCanvas(800, 600);
	const id = place('Pump house', 100, 100);
	ok('one line is one line', L.lines(id).length === 1);
	ok('...held as a plain text node, not a tspan', tspans(id).length === 0, String(tspans(id).length));
	ok('...at its own point, with no block shift at all', L.firstDy(id) === 0);
	ok('...and one line high', Math.abs(L.height(id) - L.fontSize(id) * 1.2) < 1e-9, String(L.height(id)));
	const t = L.labelEl(id);
	ok('...anchored on the point it was placed at', +t.getAttribute('x') === 100 && +t.getAttribute('y') === 100);
}

// ---- 2. several lines ---------------------------------------------------------------------------
{
	console.log('\n--- several lines ---');
	L.reset(); L.setCanvas(800, 600);
	const id = place('NORTH\nSTREET\nMAIN', 100, 100);
	ok('the newlines are the lines', L.lines(id).length === 3, JSON.stringify(L.lines(id)));
	const rows = tspans(id);
	ok('one tspan per line', rows.length === 3, String(rows.length));
	ok('every row carries its own x, at the label point',
		rows.every(r => +r.getAttribute('x') === 100), rows.map(r => r.getAttribute('x')).join(','));
	ok('rows after the first are one line height apart, in em so a zoom needs no rebuild',
		rows[1].getAttribute('dy') === '1.2em' && rows[2].getAttribute('dy') === '1.2em');
	ok('three lines are three lines high',
		Math.abs(L.height(id) - L.fontSize(id) * 3.6) < 1e-9, String(L.height(id)));

	// The straddle: the block is raised by half the EXTRA height, so its middle stays on the point.
	ok('a centred block is raised by half its extra height', Math.abs(L.firstDy(id) - (-1.2)) < 1e-9, String(L.firstDy(id)));
	ok('...which is what the first row is given', rows[0].getAttribute('dy') === '-1.2em', String(rows[0].getAttribute('dy')));
	const box = L.box(id);
	ok('...so the box straddles the point rather than hanging below it',
		box.y < 100 && box.y + box.h > 100, JSON.stringify(box));
	ok('...symmetrically', Math.abs((100 - box.y) - ((box.y + box.h) - 100)) < 1e-9);
}

// ---- 3. the point can mean the TOP instead ------------------------------------------------------
{
	console.log('\n--- the point is at the top ---');
	L.reset(); L.setCanvas(800, 600);
	const id = place('LEGEND\nNot to scale', 100, 100);
	L.setAlign(id, 'valign', 'top');
	ok('a top-anchored block hangs downward, with no shift', L.firstDy(id) === 0, String(L.firstDy(id)));
	const box = L.box(id);
	ok('...so its box starts AT the point', Math.abs(box.y - 100) < 1e-9, JSON.stringify(box));
	ok('...and is two lines tall', Math.abs(box.h - L.fontSize(id) * 2.4) < 1e-9);
}

// ---- 4. horizontal justification ----------------------------------------------------------------
{
	console.log('\n--- left, centre, right ---');
	L.reset(); L.setCanvas(800, 600);
	const id = place('NORTH\nSTREET', 100, 100);
	const w = L.box(id).w;
	ok('centred by default: the point is the middle', Math.abs(L.box(id).x - (100 - w / 2)) < 1e-9);
	L.setAlign(id, 'align', 'left');
	ok('left: the point is the left edge', Math.abs(L.box(id).x - 100) < 1e-9, JSON.stringify(L.box(id)));
	L.setAlign(id, 'align', 'right');
	ok('right: the point is the right edge', Math.abs(L.box(id).x - (100 - w)) < 1e-9);
}

// ---- 5. moving a multi-line label moves every row ------------------------------------------------
{
	console.log('\n--- moving it ---');
	L.reset(); L.setCanvas(800, 600);
	const id = place('NORTH\nSTREET\nMAIN', 100, 100);
	L.moveTo(id, 400, 250);
	const t = L.labelEl(id), rows = tspans(id);
	ok('the <text> itself moves', +t.getAttribute('x') === 400 && +t.getAttribute('y') === 250);
	ok('and EVERY row moves with it', rows.every(r => +r.getAttribute('x') === 400),
		rows.map(r => r.getAttribute('x')).join(','));
}

// ---- 6. editing the words, both directions -------------------------------------------------------
// A one-line label typed into a three-line one and back again: the tspans have to appear and then
// go away entirely, or the second edit leaves the first edit's rows stranded on the map.
{
	console.log('\n--- editing between one line and many ---');
	L.reset(); L.setCanvas(800, 600);
	const id = place('One line', 100, 100);
	L.setProp(L.getDoc().labels[0], 'text', 'One line\nTwo lines\nThree');
	L.refreshContent(id);
	ok('typing newlines grows the rows', tspans(id).length === 3, String(tspans(id).length));
	L.setProp(L.getDoc().labels[0], 'text', 'Back to one');
	L.refreshContent(id);
	ok('removing them takes the rows away again', tspans(id).length === 0, String(tspans(id).length));
	ok('...and the words are the new ones', L.labelEl(id).textContent === 'Back to one', L.labelEl(id).textContent);
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);
