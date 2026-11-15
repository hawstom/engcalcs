// Headless check of Geom.pickCandidates(), the rule for when one click could mean
// more than one element (js/lpn-geom.js). Pure: nodes and links in, an ordered list out.
//
//   node dev/lpn-spike/pick-candidates-harness.js
//
// What can be wrong: the chooser opening on the ordinary click (a junction on a pipe, two nearby
// but separate junctions, a short pipe), which would make every click a question; and the chooser
// NOT opening where the page cannot otherwise answer (coincident nodes, a zero-length pipe or pump
// between them, two pipes drawn over each other). Ambiguity is a fact about the MODEL: nothing here
// may change with the zoom, which is the defect Perry found (Net3 zoomed out opened a box on one
// click in four, because a screen-pixel test calls every short pipe and close pair of junctions
// 'coincident' once the picture is small).

const Geom = require('../../js/lpn-geom.js').lpnGeom;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const J = (id, x, y, type) => ({ id, x, y, type: type || 'junction' });
const L = (id, from, to, type) => ({ id, from, to, type: type || 'pipe' });
function run(nodes, links, wx, wy, s, extra) {
	const byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
	return Geom.pickCandidates(nodes, links, wx, wy, s === undefined ? 1 : s, Object.assign({
		linkPts: (l) => [byId[l.from], byId[l.to]]
	}, extra || {})).map((c) => c.kind + ':' + c.id);
}
function same(name, got, want) { ok(name, JSON.stringify(got) === JSON.stringify(want), 'got ' + JSON.stringify(got)); }

console.log('\n--- the ordinary click stays ordinary ---');
{
	const nodes = [J('J1', 0, 0), J('J2', 100, 0), J('J3', 50, 0)];
	const links = [L('P1', 'J1', 'J2')];
	same('a junction sitting on a pipe: no choice to offer (the browser answers with the junction)', run(nodes, links, 50, 0), []);
	same('a click on the pipe away from any node: no choice', run(nodes, links, 25, 1), []);
	same('bare map: nothing', run(nodes, links, 25, 40), []);
	same('two junctions 4 px apart, press between them: not coincident, so no choice',
		run([J('A', 0, 0), J('B', 4, 0)], [], 1, 0), []);
	same('a node with a pipe leaving it: no choice', run(nodes, links, 2, 0), []);
}

console.log('\n--- coincident nodes ---');
{
	const nodes = [J('J2', 10, 10), J('J10', 10, 10), J('T1', 10, 10, 'tank'), J('Z', 40, 10)];
	same('three nodes at one position: all three, natural id order (J2 before J10)', run(nodes, [], 10, 10), ['node:J2', 'node:J10', 'node:T1']);
	same('...and a node 0.5 units away is NOT one of them (stored positions differ)',
		run([J('A', 10, 10), J('B', 10, 10), J('C', 10.5, 10)], [], 10, 10), ['node:A', 'node:B']);
	same('ordered by distance from the press, then natural id',
		run([J('J10', 10, 10), J('J2', 10, 10)], [], 10, 10), ['node:J2', 'node:J10']);
	same('two junctions 0.4 apart are separate at every zoom: the nearer alone, so no choice',
		[0.001, 0.1, 1, 100, 1000].map((z) => run([J('A', 10, 10), J('B', 10.4, 10), J('Z', 200, 200)], [], 10.4, 10, z).length), [0, 0, 0, 0, 0]);
	same('two nodes at one position are one choice at every zoom',
		[0.001, 0.1, 1, 100, 1000].map((z) => run([J('A', 10, 10), J('B', 10, 10), J('Z', 200, 200)], [], 10, 10, z).length), [2, 2, 2, 2, 2]);
	same('out of reach: none', run(nodes, [], 10, 30), []);
	same('a finger reach picks the pile from 20 px away',
		run([J('A', 10, 10), J('B', 10, 10)], [], 25, 10, 1, { nodeReach: 24 }), ['node:A', 'node:B']);
}

console.log('\n--- a zero-length pipe and pump between coincident nodes (an exploded assembly) ---');
{
	const nodes = [J('J1', 5, 5), J('J2', 5, 5), J('J3', 5, 5)];
	const links = [L('P9', 'J1', 'J2', 'pump'), L('P1', 'J2', 'J3')];
	same('the nodes, then the two zero-length links', run(nodes, links, 5, 5),
		['node:J1', 'node:J2', 'node:J3', 'link:P1', 'link:P9']);
	same('a short pipe (1 unit) between nodes 1 apart is a real pipe: no choice, however far out the view',
		[1, 0.1, 0.001].map((z) => run([J('A', 0, 0), J('B', 1, 0), J('Z', 500, 500)], [L('Z1', 'A', 'B')], 0, 0, z).length), [0, 0, 0]);
	same('a zero-length pipe is buried at every zoom',
		[1, 0.1, 0.001].map((z) => run([J('A', 3, 3), J('B', 3, 3), J('Z', 500, 500)], [L('Z0', 'A', 'B')], 3, 3, z).join('+')),
		['node:A+node:B+link:Z0', 'node:A+node:B+link:Z0', 'node:A+node:B+link:Z0']);
	same('a zero-length pipe elsewhere is not offered when the press is on another junction',
		run([J('A', 3, 3), J('B', 3, 3), J('C', 5, 3)], [L('Z0', 'A', 'B')], 5, 3, 1), []);
	same('a short but real pipe (30 px) is not buried: no choice',
		run([J('A', 0, 0), J('B', 30, 0)], [L('P', 'A', 'B')], 0, 0), []);
	same('a pile far from the press is not offered', run(nodes, links, 5, 60), []);
}

console.log('\n--- coincident links (no node near) ---');
{
	const nodes = [J('A', 0, 0), J('B', 100, 0), J('C', 0, 50), J('D', 100, 50)];
	same('two pipes drawn over each other', run(nodes, [L('P1', 'A', 'B'), L('P2', 'A', 'B', 'pump')], 50, 0.5),
		['link:P1', 'link:P2']);
	same('a pipe alone: no choice', run(nodes, [L('P1', 'A', 'B')], 50, 0.5), []);
	same('two pipes 20 px apart, press on one: no choice',
		run(nodes, [L('P1', 'A', 'B'), L('P3', 'C', 'D')], 50, 0.5), []);
	same('two pipes crossing exactly at the press (their feet coincide)',
		run([J('A', 0, 0), J('B', 100, 100), J('C', 0, 100), J('D', 100, 0)], [L('X1', 'A', 'B'), L('X2', 'C', 'D')], 50, 50),
		['link:X1', 'link:X2']);
	same('crossing pipes 1 unit from the crossing: the nearest alone, no choice',
		run([J('A', 0, 0), J('B', 100, 100), J('C', 0, 100), J('D', 100, 0)], [L('X1', 'A', 'B'), L('X2', 'C', 'D')], 50, 51, 1, { linkReach: 5 }), []);
	same('crossing pipes 40 px along from the crossing: no choice',
		run([J('A', 0, 0), J('B', 100, 100), J('C', 0, 100), J('D', 100, 0)], [L('X1', 'A', 'B'), L('X2', 'C', 'D')], 10, 10),
		[]);
	same('two thick pipes (reach 5 px) pressed 4 px off their centreline: both',
		run(nodes, [L('P1', 'A', 'B'), L('P2', 'A', 'B', 'pump')], 50, 4, 1, { linkReach: 5 }), ['link:P1', 'link:P2']);
	same('...and 6 px off is out of the stroke: no choice',
		run(nodes, [L('P1', 'A', 'B'), L('P2', 'A', 'B', 'pump')], 50, 6, 1, { linkReach: 5 }), []);
	same('a thin default reach (1.5 px) 4 px off: no choice',
		run(nodes, [L('P1', 'A', 'B'), L('P2', 'A', 'B', 'pump')], 50, 4), []);
	same('near the shared end node the node outranks both pipes: no choice',
		run([J('A', 0, 0), J('B', 100, 0), J('C', 100, 5)], [L('P1', 'A', 'B'), L('P2', 'A', 'C')], 3, 0), []);
}

console.log('\n--- reading the document the way the caller draws it ---');
{
	const nodes = [J('J1', 0, 0), J('J2', 0, 0)];
	same('nodeX/nodeY override (a scenario moved J2 away)', run(nodes, [], 0, 0, 1, { nodeX: (n) => (n.id === 'J2' ? 50 : n.x) }), []);
	same('nodeOk drops a node the map does not draw', run(nodes, [], 0, 0, 1, { nodeOk: (n) => n.id !== 'J2' }), []);
	same('linkOk drops a link', run([J('A', 0, 0), J('B', 0, 0)], [L('Z', 'A', 'B')], 0, 0, 1, { linkOk: () => false }), ['node:A', 'node:B']);
}

console.log('\n--- the box prefilter and the caller\'s own node lookup change nothing but time ---');
{
	const nodes = [], links = [];
	for (let i = 0; i < 400; i++) { nodes.push(J('N' + i, (i % 20) * 10, Math.floor(i / 20) * 10)); }
	nodes.push(J('Z1', 55, 55), J('Z2', 55, 55));
	for (let i = 0; i < 399; i++) { links.push(L('L' + i, 'N' + i, 'N' + (i + 1))); }
	links.push(Object.assign(L('B1', 'N0', 'N399'), { verts: [{ x: 100, y: 3 }] }));
	const byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
	const pts = (l) => [byId[l.from]].concat(l.verts || [], [byId[l.to]]);
	for (const p of [[55, 55], [100, 3.5], [100, 3.4], [47, 21], [5, 5]]) {
		const a = Geom.pickCandidates(nodes, links, p[0], p[1], 1, { linkPts: pts });
		const b = Geom.pickCandidates(nodes, links, p[0], p[1], 1, { linkPts: pts, nodeById: (id) => byId[id] });
		ok('press at ' + p + ': same answer with the caller\'s lookup (' + a.length + ' candidate(s))', JSON.stringify(a) === JSON.stringify(b));
	}
	ok('the pile Z1/Z2 is found among 400 nodes', Geom.pickCandidates(nodes, links, 55, 55, 1, { linkPts: pts }).length === 2);
}

console.log('\n--- a geographic project, in degrees ---');
{
	const g = [J('G1', -111.9, 33.4), J('G2', -111.9, 33.4), J('G3', -111.9001, 33.4), J('G4', -111.8, 33.5), J('G5', -111.9 + 1e-10, 33.4)];
	same('equal longitude/latitude pairs coincide; one 1e-4 degree (about 10 m) away does not; 1e-10 degree (a hair) does',
		run(g, [], -111.9, 33.4, 1e6), ['node:G1', 'node:G2', 'node:G5']);
}

console.log('\n--- Net3, every junction pressed at every zoom: never a choice (Perry\'s sweep, in the model) ---');
{
	const fs = require('fs'), path = require('path');
	for (const file of ['Net3.lwn', 'Net3-Novato-CA-World.lwn']) {
	const net = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'water-network-examples', file), 'utf8'));
	const byId = {}; net.nodes.forEach((n) => { byId[n.id] = n; });
	const pts = (l) => [byId[l.from]].concat(l.verts || [], [byId[l.to]]);
	const geo = /World/.test(file);   // stored in degrees: the same picture is a million times fewer pixels per unit
	for (const [label, z0] of [['the opening view', 3], ['4 notches out', 3 / Math.pow(1.1, 4)], ['8 notches out', 3 / Math.pow(1.1, 8)], ['12 notches out', 3 / Math.pow(1.1, 12)], ['far out', 0.01]]) {
		const z = geo ? z0 * 3e-5 : z0;
		let boxes = 0;
		net.nodes.forEach((n) => { if (Geom.pickCandidates(net.nodes, net.links, n.x, n.y, z, { linkPts: pts, nodeById: (id) => byId[id] }).length) { boxes++; } });
		ok(file + ': ' + net.nodes.length + ' junction-centre presses at ' + label + ': ' + boxes + ' boxes', boxes === 0);
	}
	}
}

console.log(fails ? '\nFAILED: ' + fails : '\nALL PASS');
process.exit(fails ? 1 : 0);
