// "Apply to all": re-prefixing every element of one kind (ROADMAP Task 345). Run with:
//   node dev/lpn-spike/id-prefix-harness.js
//
// WHY THIS EXISTS. An ID is written in six places -- the element, both ends of every link that
// touches it, the label anchor, a pump's curveRef, the scenario override key, and the DOM data
// attribute -- and a bulk rename that forgets one is SILENT: the map still draws, the solve still
// runs, and a scenario's values simply stop applying. Tom does not read code and would have no way
// to see it; the status bar would even report a success.
//
// The three things asserted, in the order they can go wrong:
//   1. THE NUMBER SURVIVES. J12 becomes N12, not N1 or N7. The number is what the user knows the
//      element by, and renumbering is the one outcome that makes a drawing useless to its author.
//   2. NOTHING IS LEFT POINTING AT AN OLD ID. Checked by rebuilding the network's connectivity from
//      the ids afterwards, not by trusting the rename to have visited the right places.
//   3. A COLLISION IS SKIPPED, NEVER RESOLVED BY INVENTION. The case that catches a lazy rule is a
//      target held by an element in the SAME batch that is not moving (it already has the target
//      prefix), so its id is never going to come free. "They are all in this batch, so it is fine"
//      produces two elements answering to one id, and nothing else in the app would report it.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, getDoc: function () { return doc; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tsettings: function () { return settings; }, nextIds: function () { return nextId; },\n" +
	"\t\tscenarios: function () { return scenarios; }, ovKeyFor: ovKeyFor,\n" +
	"\t\tapplyToAll: applyIdPrefixToAll, addNode: addNode, addLink: addLink,\n" +
	"\t\tapplyNodeRename: applyNodeRename,\n" +
	"\t\tnotice: function () { return statusNotice; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// The confirm() the real button shows. Answering yes is the point of the test; one case answers no.
let answer = true;
global.window.confirm = function () { return answer; };

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.drawExample();
L.runSolve();

const doc = L.getDoc();
const junctionsBefore = doc.nodes.filter(n => n.type === 'junction').map(n => n.id);
const linkEndsBefore = doc.links.map(l => l.from + '>' + l.to);
ok('the example network has junctions to rename', junctionsBefore.length >= 3, junctionsBefore.join(','));
ok('...all of them numbered, which is what this feature keeps',
	junctionsBefore.every(id => /^\D+\d+$/.test(id)), junctionsBefore.join(','));

// A scenario override on one junction, so the rename has something keyed by id to carry. This is
// the one that fails invisibly: the map falls back to Base and nothing says a number went away.
const target = junctionsBefore[1];
const sc = L.scenarios()[0];
sc.overrides = sc.overrides || {};
sc.overrides[L.ovKeyFor('node', target)] = { demand: 42 };

console.log('\n=== J -> N, every junction ===');
L.settings().idPrefixes.J = 'N';
L.applyToAll('J');

const after = doc.nodes.filter(n => n.type === 'junction').map(n => n.id);
ok('every junction now starts with N', after.every(id => id.indexOf('N') === 0), after.join(','));
ok('...and each kept its own number',
	after.join(',') === junctionsBefore.map(id => id.replace(/^\D+/, 'N')).join(','),
	after.join(',') + '  was  ' + junctionsBefore.join(','));
ok('...with no duplicates', new Set(after).size === after.length, after.join(','));

console.log('\n=== nothing is left pointing at an old id ===');
const ids = new Set(doc.nodes.map(n => n.id));
const dangling = doc.links.filter(l => !ids.has(l.from) || !ids.has(l.to));
ok('every link still names two nodes that exist', dangling.length === 0,
	dangling.map(l => l.id + ': ' + l.from + '>' + l.to).join(' '));
ok('...and the connectivity is the SAME network, renamed rather than rewired',
	doc.links.map(l => l.from + '>' + l.to).join(',') ===
		linkEndsBefore.map(s => s.split('>').map(id => junctionsBefore.indexOf(id) >= 0 ? id.replace(/^\D+/, 'N') : id).join('>')).join(','),
	doc.links.map(l => l.from + '>' + l.to).join(','));
const anchors = doc.labels.filter(lb => lb.anchorNode).map(lb => lb.anchorNode);
ok('every anchored text label still names a node that exists',
	anchors.every(id => ids.has(id)), anchors.join(','));
ok('the scenario override followed the rename',
	!!sc.overrides[L.ovKeyFor('node', target.replace(/^\D+/, 'N'))] &&
	!sc.overrides[L.ovKeyFor('node', target)],
	JSON.stringify(Object.keys(sc.overrides)));

console.log('\n=== the next junction drawn cannot land on a number already in use ===');
const highest = Math.max.apply(null, after.map(id => +id.replace(/^\D+/, '')));
ok('nextId is past the highest number in the drawing', L.nextIds().J > highest,
	L.nextIds().J + ' vs ' + highest);
const fresh = L.addNode('junction', 999, 999);
ok('...so a new junction gets a free id', !after.includes(fresh.id), fresh.id);

console.log('\n=== an id with no trailing number is left alone ===');
const odd = L.addNode('junction', 1200, 1200);
odd.id = 'Tank Farm';
L.settings().idPrefixes.J = 'W';
L.applyToAll('J');
ok('it keeps the name somebody chose', odd.id === 'Tank Farm', odd.id);
ok('...while the numbered ones moved on', doc.nodes.filter(n => n.type === 'junction')
	.some(n => n.id.indexOf('W') === 0));
ok('...and the notice says how many were left alone', /left alone/.test(L.notice()), L.notice());

console.log('\n=== a target held by something OUTSIDE the batch is skipped, not invented ===');
// Point the LINK prefix at the junctions' own prefix. Every L-something wants an id a junction
// already answers to, and no junction is moving, so every one of them must be refused.
const linkIdsBefore = doc.links.map(l => l.id);
L.settings().idPrefixes.L = 'W';
L.applyToAll('L');
const pipeIds = doc.links.map(l => l.id);
const collided = doc.nodes.map(n => n.id).filter(id => pipeIds.includes(id));
ok('no link took an id a node already had', collided.length === 0, collided.join(','));
ok('...and the ones that could not move kept their old ids',
	pipeIds.filter((id, i) => id === linkIdsBefore[i]).length > 0, pipeIds.join(','));

console.log('\n=== a target held by a batch member that is NOT moving is skipped too ===');
// The subtle half of the collision rule, and the one a "they are all in this batch, so it is fine"
// shortcut gets wrong: Y5 is a junction like the others, but it ALREADY has the target prefix, so
// it is not moving and its id is not going to be free. Q5 must therefore be refused -- and the
// visible symptom of getting this wrong is two junctions answering to Y5, which nothing else in
// the app would report.
const a = L.addNode('junction', 2000, 0), b = L.addNode('junction', 2100, 0);
L.applyNodeRename(a.id, 'Y5');
L.applyNodeRename(b.id, 'Q5');
L.settings().idPrefixes.J = 'Y';
L.applyToAll('J');
ok('the stationary Y5 keeps its id', doc.nodes.filter(n => n.id === 'Y5').length === 1,
	doc.nodes.map(n => n.id).join(','));
ok('...Q5 is left where it was rather than taking it', doc.nodes.some(n => n.id === 'Q5'),
	doc.nodes.map(n => n.id).join(','));
ok('...and no two elements anywhere share an id',
	new Set(doc.nodes.map(n => n.id).concat(doc.links.map(l => l.id))).size ===
		doc.nodes.length + doc.links.length,
	doc.nodes.map(n => n.id).join(','));

console.log('\n=== answering NO to the confirm changes nothing ===');
const before = doc.nodes.map(n => n.id).join(',');
answer = false;
L.settings().idPrefixes.J = 'Q';
L.applyToAll('J');
ok('the drawing is untouched', doc.nodes.map(n => n.id).join(',') === before, doc.nodes.map(n => n.id).join(','));
answer = true;

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
