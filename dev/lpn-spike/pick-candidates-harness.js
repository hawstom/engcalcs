// Headless check of Geom.pickCandidates(), the rule for when one click could mean
// more than one element (js/lpn-geom.js). Pure: nodes and links in, an ordered list out.
//
//   node dev/lpn-spike/pick-candidates-harness.js
//
// What can be wrong: the chooser opening on the ordinary click (a junction on a pipe, two nearby
// but separate junctions), which would make every click a question; and the chooser NOT opening
// where the page cannot otherwise answer (coincident nodes, a zero-length pipe or pump between
// them, two pipes drawn over each other).

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
	const nodes = [J('J2', 10, 10), J('J10', 10, 10), J('T1', 10.5, 10, 'tank'), J('Z', 40, 10)];
	same('three nodes within a pixel: all three, natural id order', run(nodes, [], 10, 10).sort(), ['node:J10', 'node:J2', 'node:T1']);
	same('ordered by distance from the press, then natural id',
		run([J('J10', 10, 10), J('J2', 10, 10)], [], 10, 10), ['node:J2', 'node:J10']);
	same('nearer one first', run([J('A', 10, 10), J('B', 10.4, 10)], [], 10.4, 10), ['node:B', 'node:A']);
	same('zoomed in the same two are 40 px apart and no longer coincident',
		run([J('A', 10, 10), J('B', 10.4, 10)], [], 10, 10, 100), []);
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
	same('a near-zero link (1 px) between nodes 1 px apart: ends and link',
		run([J('A', 0, 0), J('B', 1, 0)], [L('Z', 'A', 'B')], 0, 0), ['node:A', 'node:B', 'link:Z']);
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
	same('two pipes crossing exactly at the press',
		run([J('A', 0, 0), J('B', 100, 100), J('C', 0, 100), J('D', 100, 0)], [L('X1', 'A', 'B'), L('X2', 'C', 'D')], 50, 50),
		['link:X1', 'link:X2']);
	same('crossing pipes 40 px along from the crossing: no choice',
		run([J('A', 0, 0), J('B', 100, 100), J('C', 0, 100), J('D', 100, 0)], [L('X1', 'A', 'B'), L('X2', 'C', 'D')], 10, 10),
		[]);
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

console.log(fails ? '\nFAILED: ' + fails : '\nALL PASS');
process.exit(fails ? 1 : 0);
