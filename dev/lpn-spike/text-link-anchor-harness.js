// A TEXT OBJECT ATTACHED TO A LINK -- ROADMAP Task 502. Run with:
//   node dev/lpn-spike/text-link-anchor-harness.js
//
// OUR VOCABULARY, NOT EPANET'S (Task 482): a **Text** is the object a user types words into. What
// EPANET calls a Label is our Text; what we call a Label is EPANET's notation. Everything below
// is about the Text.
//
// WHAT THIS GUARDS, and why each is silent when it breaks:
//
//   1. **THE ATTACHMENT IS A FRACTION OF THE LINK'S ARC LENGTH.** Every other candidate (the
//      midpoint; the nearest point recomputed each draw; a distance along) fails one of the four
//      edits below, and fails it by moving the user's note somewhere they did not put it -- which
//      looks like the drawing settling rather than like a defect.
//   2. **IT FOLLOWS THROUGH THE ONE PASS, NOT THROUGH A LISTENER.** Moving an end node, dragging a
//      vertex and adding a bend all reshape the polyline by different code paths. All three go
//      through updateLinkGeometry()/rebuildLink(), which is where the note is redrawn; a fourth
//      path added later that forgets it would leave the words behind and the leader stretched.
//   3. **DELETING THE LINK TAKES THE TEXT WITH IT**, which is deleteNode()'s existing rule for a
//      node-anchored Text. Left behind, the note would sit at an OFFSET from something that no
//      longer exists -- drawn near the map origin, pointing at nothing.
//   4. **AN OLD FILE OPENS UNCHANGED.** This is the user's data: a document written before the
//      feature existed must come back with every coordinate identical and no anchor invented.
//   5. **THE OFFSET IS NOT A COORDINATE.** An anchored Text's x/y are an offset, so the origin
//      rebase must not shift them -- the same exclusion eachStoredPoint() already makes for a
//      node-anchored one, which is silent when wrong because the note lands half a million units
//      away only in a survey-coordinate document.
//   6. **THE `.inp` EXPORT REPORTS IT RATHER THAN FAKING IT.** EPANET's [LABELS] anchor is a node
//      and only a node, so a link-anchored Text must go out at the place it is drawn, with no
//      fourth token, and be counted in the differences.

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText, buildDom: buildDom,\n" +
	"\t\tlabelById: labelById, linkById: linkById,\n" +
	"\t\tdeleteLink: deleteLink, deleteNode: deleteNode,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tprepareDocument: prepareDocument,\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\tapplyLinkRename: applyLinkRename,\n" +
	"\t\trebase: rebaseDocument,\n" +
	"\t\tpoint: function (id) { return textLabelPoint(labelById(id)); },\n" +
	"\t\tanchorPoint: function (id) { var p = textAnchorPoint(labelById(id));\n" +
	"\t\t\treturn p ? { x: p.x, y: p.y } : null; },\n" +
	"\t\tdrawnAt: function (id) { var t = labelEls[id] && labelEls[id].text;\n" +
	"\t\t\treturn t ? { x: +t.getAttribute('x'), y: +t.getAttribute('y') } : null; },\n" +
	"\t\tleader: function (id) { var e = labelEls[id] && labelEls[id].leader;\n" +
	"\t\t\treturn e ? { x1: +e.getAttribute('x1'), y1: +e.getAttribute('y1'),\n" +
	"\t\t\t\tx2: +e.getAttribute('x2'), y2: +e.getAttribute('y2') } : null; },\n" +
	"\t\thasEls: function (id) { return !!labelEls[id]; },\n" +
	"\t\tmoveNode: function (id, x, y) { var n = nodeById(id); n.x = x; n.y = y; updateNode(id); },\n" +
	"\t\tinsertVertex: insertVertex,\n" +
	"\t\tmoveVertex: function (linkId, i, x, y) {\n" +
	"\t\t\tlinkById(linkId).verts[i] = { x: x, y: y }; updateVertex(linkId, i); },\n" +
	"\t\tnearLinkAtWorld: function (wx, wy, tolPx) { var p = worldToScreen(wx, wy),\n" +
	"\t\t\thit = nearestLinkNearScreen(p.x, p.y, tolPx);\n" +
	"\t\t\treturn hit ? { id: hit.link.id, t: hit.t } : null; },\n" +
	"\t\tnearNodeAtWorld: function (wx, wy, tolPx) { var p = worldToScreen(wx, wy),\n" +
	"\t\t\thit = nearestNodeNearScreen(p.x, p.y, tolPx);\n" +
	"\t\t\treturn hit ? hit.id : null; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; settings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tbuildDom(); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
function at(p, x, y, tol) { return !!p && near(p.x, x, tol) && near(p.y, y, tol); }
function show(p) { return p ? '(' + p.x + ', ' + p.y + ')' : 'null'; }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// A straight 200-unit main between two junctions, with a note attached half way along it and
// hanging 20 units above the pipe. Every case below starts from this.
function scene() {
	L.reset();
	L.addNode('junction', 0, 0);
	L.addNode('junction', 200, 0);
	L.addLink('pipe', 'J1', 'J2');
	const lb = L.addText(100, -20, null, { link: 'L1', t: 0.5 });
	L.buildDom();
	return lb;
}

console.log('--- 1. the anchor is a station on the line, and x/y are an offset from it ---');
{
	const lb = scene();
	ok('the Text records the link it follows', lb.anchorLink === 'L1', String(lb.anchorLink));
	ok('...and the fraction along it', lb.anchorT === 0.5, String(lb.anchorT));
	ok('...and no node anchor', lb.anchorNode === null, String(lb.anchorNode));
	ok('the attachment is the half-way point of the pipe', at(L.anchorPoint(lb.id), 100, 0), show(L.anchorPoint(lb.id)));
	// THE OFFSET, not the position: this is the field the origin rebase must leave alone, and the
	// one a reader of the raw JSON will misread as a coordinate if it ever stops being small.
	ok('x/y are stored as the offset from that point', lb.x === 0 && lb.y === -20, lb.x + ', ' + lb.y);
	ok('the words are drawn exactly where the user tapped', at(L.point(lb.id), 100, -20), show(L.point(lb.id)));
	ok('...and the element really is there', at(L.drawnAt(lb.id), 100, -20), show(L.drawnAt(lb.id)));
	const ld = L.leader(lb.id);
	ok('a leader runs from the pipe to the words',
		ld && at({ x: ld.x1, y: ld.y1 }, 100, 0) && at({ x: ld.x2, y: ld.y2 }, 100, -20), JSON.stringify(ld));
}

console.log('\n--- 2. an END NODE moves and the note follows, keeping its fraction ---');
{
	const lb = scene();
	L.moveNode('J2', 400, 0);
	ok('the attachment is half way along the LONGER pipe', at(L.anchorPoint(lb.id), 200, 0), show(L.anchorPoint(lb.id)));
	ok('...and the words moved with it, offset intact', at(L.point(lb.id), 200, -20), show(L.point(lb.id)));
	ok('...on the SVG, not merely in the model', at(L.drawnAt(lb.id), 200, -20), show(L.drawnAt(lb.id)));
	ok('...and the leader still lands on the pipe',
		at({ x: L.leader(lb.id).x1, y: L.leader(lb.id).y1 }, 200, 0), JSON.stringify(L.leader(lb.id)));
	// A ROTATION, which is where a stored ABSOLUTE point would come apart while a fraction cannot.
	L.moveNode('J2', 0, 400);
	ok('the pipe swings and the attachment swings with it', at(L.anchorPoint(lb.id), 0, 200), show(L.anchorPoint(lb.id)));
	ok('...the offset is unchanged, so the words hold their side', at(L.point(lb.id), 0, 180), show(L.point(lb.id)));
	ok('...and lb.x/lb.y were never rewritten by any of it',
		L.labelById(lb.id).x === 0 && L.labelById(lb.id).y === -20);
}

console.log('\n--- 3. a BEND: adding a vertex re-measures the arc, and dragging one moves the note ---');
{
	const lb = scene();
	// A bend at the apex of an isoceles pair: both legs are the same length, so the half-way
	// station by ARC LENGTH is the vertex itself. Measured against the segment index instead, or
	// against the straight line between the ends, it would land at (100, 0) -- off the pipe.
	L.insertVertex('L1', { x: 100, y: -100 });
	ok('the pipe took the bend', L.linkById('L1').verts.length === 1);
	ok('half way ALONG THE ARC is the bend itself', at(L.anchorPoint(lb.id), 100, -100, 1e-9), show(L.anchorPoint(lb.id)));
	ok('...and the note is redrawn there, through rebuildLink()', at(L.drawnAt(lb.id), 100, -120), show(L.drawnAt(lb.id)));
	L.moveVertex('L1', 0, 100, -40);
	ok('dragging the vertex drags the attachment', at(L.anchorPoint(lb.id), 100, -40, 1e-9), show(L.anchorPoint(lb.id)));
	ok('...and the words, live', at(L.drawnAt(lb.id), 100, -60), show(L.drawnAt(lb.id)));
	// A LOPSIDED bend: the half-way station is no longer any vertex, so this is the case that
	// proves the walk is by length rather than by segment count.
	L.moveVertex('L1', 0, 20, 0);
	const half = (20 + 180) / 2;
	ok('an off-centre bend puts the station on the long leg',
		at(L.anchorPoint(lb.id), half, 0, 1e-9), show(L.anchorPoint(lb.id)));
}

console.log('\n--- 4. deleting the link takes its Text with it (deleteNode()\'s rule) ---');
{
	const lb = scene();
	L.deleteLink('L1');
	ok('the Text is gone from the document',
		L.getDoc().labels.every(x => x.id !== lb.id), JSON.stringify(L.getDoc().labels.map(x => x.id)));
	ok('...and its elements are gone from the drawing', !L.hasEls(lb.id));
}
{
	// The cascade, one step further out: deleting a NODE deletes its links, and those take their
	// own notes. A note left behind here is the "orphaned labels behind a deleted pipe" report.
	const lb = scene();
	L.deleteNode('J1');
	ok('deleting a node cascades through its link to the link\'s Text',
		L.getDoc().labels.every(x => x.id !== lb.id));
}
{
	// A FREE-FLOATING Text near the same pipe is NOT attached and must survive the deletion.
	L.reset();
	L.addNode('junction', 0, 0); L.addNode('junction', 200, 0);
	L.addLink('pipe', 'J1', 'J2');
	const tied = L.addText(100, -20, null, { link: 'L1', t: 0.5 });
	const free = L.addText(100, -60, null, null);
	L.buildDom();
	L.deleteLink('L1');
	ok('a free-floating note beside the same pipe stays',
		L.getDoc().labels.length === 1 && L.getDoc().labels[0].id === free.id,
		JSON.stringify(L.getDoc().labels.map(x => x.id)));
	ok('...and only the attached one went', L.getDoc().labels.every(x => x.id !== tied.id));
}

console.log('\n--- 5. renaming the link: the note follows the new id ---');
{
	const lb = scene();
	L.applyLinkRename('L1', 'MAIN-A');
	ok('the Text names the renamed link', L.labelById(lb.id).anchorLink === 'MAIN-A');
	ok('...and still resolves to the same point', at(L.anchorPoint(lb.id), 100, 0), show(L.anchorPoint(lb.id)));
	// STILL NOT ASSERTED HERE, and the reason changed: the gap this note used to describe --
	// `incidentLinks` holding the old link id after a rename -- was FIXED under Task 533 and is
	// asserted, with the other four references a rename has to chase, in
	// `dev/lpn-spike/rename-references-harness.js`. It stays out of this file because it is still
	// somebody else's subject; a Text is what this harness is about.
}

console.log('\n--- 6. creating one: a tap near a pipe attaches, a tap near a node still wins ---');
{
	scene();
	const hit = L.nearLinkAtWorld(150, 2, 14);
	ok('a tap beside the pipe finds the pipe', hit && hit.id === 'L1', JSON.stringify(hit));
	ok('...at the fraction it was tapped at', hit && near(hit.t, 0.75, 1e-9), hit && String(hit.t));
	ok('a tap far from every pipe finds nothing', L.nearLinkAtWorld(100, 500, 14) === null);
	// The tie-break the click handler relies on: near an end node BOTH are within tolerance, and
	// the node is the more specific thing. This asserts the node is genuinely offered there, so
	// the handler's `nearNode ? ... : nearLink` ordering is doing real work.
	ok('at an end node, the node is offered too', L.nearNodeAtWorld(0, 0, 14) === 'J1');
}

console.log('\n--- 7. save and open: the attachment survives, exactly ---');
{
	const lb = scene();
	const saved = L.serializeProject();
	const stored = saved.labels.find(x => x.id === lb.id);
	ok('the file carries the link', stored.anchorLink === 'L1', String(stored.anchorLink));
	ok('...and the fraction, as the same double', stored.anchorT === 0.5, String(stored.anchorT));
	// Y IS CARTESIAN IN THE FILE and the offset is a vector, so it negates like every other y.
	ok('...and the offset, flipped into the file\'s frame', stored.x === 0 && stored.y === 20,
		stored.x + ', ' + stored.y);
	L.applySaved(L.prepareDocument(JSON.parse(JSON.stringify(saved))));
	L.buildDom();
	ok('reopened, the note is attached to the same link at the same station',
		L.labelById(lb.id).anchorLink === 'L1' && L.labelById(lb.id).anchorT === 0.5);
	ok('...and drawn in exactly the same place', at(L.point(lb.id), 100, -20), show(L.point(lb.id)));
	L.moveNode('J2', 400, 0);
	ok('...and still follows its pipe after the round trip', at(L.point(lb.id), 200, -20), show(L.point(lb.id)));
}

console.log('\n--- 8. AN OLD FILE OPENS UNCHANGED ---');
{
	// Byte for byte the shape a document had before Task 502: a free Text and a node-anchored one,
	// and no anchorLink anywhere. This is the user's data, so "unchanged" is the whole assertion.
	const before = {
		v: L.storageVersion(),
		project: { name: 'legacy', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: [{ id: 'J1', type: 'junction', x: 10, y: 20, elev: 100, _demand: 0 },
			{ id: 'J2', type: 'junction', x: 210, y: 20, elev: 100, _demand: 0 }],
		links: [{ id: 'L1', type: 'pipe', from: 'J1', to: 'J2', verts: [], _diameter: 8,
			_length: 200, lenAuto: false, _roughness: 130, _status: 'open', _k: 0 }],
		labels: [{ id: 'X1', _text: 'free note', x: 40, y: 60, anchorNode: null, sizeMult: 1 },
			{ id: 'X2', _text: 'on the junction', x: 5, y: -7, anchorNode: 'J1', sizeMult: 1 }],
		nextId: { J: 3, R: 1, T: 1, L: 2, P: 1, V: 1, X: 3 },
		origin: { x: 0, y: 0 }, units: {}
	};
	L.applySaved(L.prepareDocument(JSON.parse(JSON.stringify(before))));
	L.buildDom();
	const free = L.labelById('X1'), tied = L.labelById('X2');
	ok('a free Text keeps its own position', free.x === 40 && free.y === -60, free.x + ', ' + free.y);
	ok('...and is invented no attachment', free.anchorLink === undefined && !free.anchorNode);
	ok('a node-anchored Text keeps its offset', tied.x === 5 && tied.y === 7, tied.x + ', ' + tied.y);
	ok('...and is invented no attachment either', tied.anchorLink === undefined);
	ok('...and still follows its node', at(L.anchorPoint('X2'), 10, -20), show(L.anchorPoint('X2')));
	// Memory is Y-DOWN and the file is Cartesian, so the file's y = 20 opened as -20; move the node
	// in the frame the editor actually holds.
	L.moveNode('J1', 60, -20);
	ok('...really follows it', at(L.point('X2'), 65, -13), show(L.point('X2')));
	// And the file it writes back says nothing new.
	const out = L.serializeProject();
	ok('saving it again writes no anchorLink and no anchorT',
		out.labels.every(x => x.anchorLink === undefined && x.anchorT === undefined),
		JSON.stringify(out.labels));
}

console.log('\n--- 9. an attached Text is an OFFSET, so the origin rebase leaves it alone ---');
{
	// rebaseDocument() directly, on a STORED document in the file's own frame -- the pass that runs
	// when a survey model far from zero is opened (Task 354, LPN_ORIGIN_THRESHOLD 1e4). A note
	// attached to a link stores a 20-unit offset; counted as a coordinate it would both drag the
	// chosen origin toward zero and be shifted by half a million, and the drawing would come apart
	// only in a document nobody in this repo ships.
	const far = {
		nodes: [{ id: 'J1', x: 579300, y: 1200400 }, { id: 'J2', x: 579500, y: 1200400 }],
		links: [{ id: 'L1', from: 'J1', to: 'J2', verts: [{ x: 579400, y: 1200450 }] }],
		labels: [
			{ id: 'X1', _text: 'on the main', x: 0, y: 20, anchorLink: 'L1', anchorT: 0.5 },
			{ id: 'X2', _text: 'on the junction', x: 5, y: -7, anchorNode: 'J1' },
			{ id: 'X3', _text: 'free', x: 579350, y: 1200500, anchorNode: null }
		]
	};
	L.rebase(far);
	ok('the document was rebased', far.origin.x !== 0 && far.origin.y !== 0, JSON.stringify(far.origin));
	ok('...and the node coordinates came down to local numbers',
		Math.abs(far.nodes[0].x) < 1e4 && Math.abs(far.nodes[0].y) < 1e4,
		far.nodes[0].x + ', ' + far.nodes[0].y);
	ok('...as did a vertex', Math.abs(far.links[0].verts[0].x) < 1e4, String(far.links[0].verts[0].x));
	ok('...and a FREE Text, which really is a coordinate', Math.abs(far.labels[2].x) < 1e4,
		String(far.labels[2].x));
	ok('A LINK-ANCHORED TEXT WAS NOT SHIFTED', far.labels[0].x === 0 && far.labels[0].y === 20,
		far.labels[0].x + ', ' + far.labels[0].y);
	ok('...nor a node-anchored one, as before', far.labels[1].x === 5 && far.labels[1].y === -7,
		far.labels[1].x + ', ' + far.labels[1].y);
	// And the offset does not get a vote on WHERE the origin lands: counted as a position, the
	// 20 above would floor the origin's y to 0 and leave every real coordinate enormous -- the fix
	// silently doing nothing, which is the worst outcome available here.
	ok('...and it did not drag the origin to zero', far.origin.y >= 1e6, JSON.stringify(far.origin));
}

console.log('\n--- 10. the `.inp` export reports the attachment rather than faking it ---');
{
	const lb = scene();
	// A second Text on the SAME pipe, anchored to a node, so the regression half is asserted beside
	// the new behaviour: EPANET's fourth token still goes out for a node anchor.
	L.addText(30, -30, 'J1');
	L.buildDom();
	const out = EngCalcs.lpnExportInp(L.serializeProject(), {});
	ok('the export succeeded', out && out.ok === true, out && out.error);
	const rows = out.inp.split('\n').filter(r => /"/.test(r) && !/^\s*;/.test(r));
	const linkRow = rows.find(r => /"Text"/.test(r) && / 100(\.0*)?\s+20/.test(r)) ||
		rows.find(r => r.indexOf('100') >= 0 && r.indexOf('20') >= 0);
	ok('the link-anchored Text is written at the place it is drawn',
		!!linkRow && /(^|\s)100(\s|\.)/.test(linkRow) && /(^|\s)20(\s|$|\.)/.test(linkRow), linkRow);
	ok('...with NO anchor token, because EPANET has no link anchor',
		!!linkRow && linkRow.trim().split(/"/).pop().trim() === '', JSON.stringify(linkRow));
	ok('...and it is REPORTED, never dropped silently',
		out.differences.some(d => d.code === 'label-link-anchor-flattened' && d.ids.indexOf(lb.id) >= 0),
		JSON.stringify(out.differences));
	const nodeRow = rows.find(r => /J1\s*$/.test(r));
	ok('a NODE-anchored Text still names its node, unchanged', !!nodeRow, nodeRow);
}

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'all checks passed'));
process.exit(fails ? 1 : 0);
