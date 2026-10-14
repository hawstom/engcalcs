// Every shipped example whose asset IDs are BARE numbers opens with node ID labels prefixed "N" and
// link ID labels prefixed "L" (Tom, 2026-10-08). An ID that already carries its own prefix (the
// Basic examples' R1, J1, P1, L1; Elm Street's node IDs J2, J-H, R1) shows as itself, with no
// before-text (Tom, 2026-10-14: "the node and link ID labels don't need Bef text"). Run with:  node dev/lpn-spike/example-id-prefix-harness.js
// Reads the prefix through labelPrefixFor(), the function the map label itself uses, and checks the
// first line of a real label built by the real open path.
const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, labelSettings: function () { return labelSettings; },\n" +
	"\t\trefreshLabelText: refreshLabelText, labelPrefixFor: labelPrefixFor,\n" +
	"\t\tlinkLabel: function (id) { return linkEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tnodeLabel: function (id) { return nodeEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const files = fs.readdirSync(ROOT + 'examples').filter(function (f) { return /\.lwn$/.test(f); });
ok('the examples folder holds the nine shipped examples', files.length === 9, files.length);

// What each example's ID labels must say: '' where the IDs already carry a prefix. Elm Street's
// links are bare numbers, so its link labels keep L.
const EXPECT = {
	'Basic-example-US-units.lwn': ['', ''], 'Basic-example-SI-units.lwn': ['', ''],
	'Elm-Street-Center.lwn': ['', 'L']
};
files.forEach(function (f) {
	const want = EXPECT[f] || ['N', 'L'];
	setUnitSet('us');
	L.buildLayers();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + f, 'utf8'));
	if (!saved) { ok(f + ' opens', false); return; }
	L.applySaved(saved);
	L.buildDom();
	const ls = L.labelSettings();
	// Only the ID is under test: show it alone so the first line is the ID.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'id'); });
	L.refreshLabelText();
	const doc = L.getDoc();
	const np = L.labelPrefixFor('node', 'id'), lp = L.labelPrefixFor('link', 'id');
	console.log('\n=== ' + f + ' ===');
	ok('node id prefix is "' + want[0] + '"', np === want[0], np);
	ok('link id prefix is "' + want[1] + '"', lp === want[1], lp);
	const nb = doc.nodes.filter(function (n) { return L.nodeLabel(n.id).length; });
	const lb = doc.links.filter(function (l) { return L.linkLabel(l.id).length; });
	ok('every node label is its prefix + its id (' + nb.length + ' labelled)',
		nb.length > 0 && nb.every(function (n) { return L.nodeLabel(n.id)[0] === want[0] + n.id; }),
		nb.length && L.nodeLabel(nb[0].id)[0]);
	ok('every link label is its prefix + its id (' + lb.length + ' labelled)',
		lb.length > 0 && lb.every(function (l) { return L.linkLabel(l.id)[0] === want[1] + l.id; }),
		lb.length && L.linkLabel(lb[0].id)[0]);
	ok('customers are left alone (no customer prefix stored)',
		!((saved.labelSettings || {}).prefix || {}).customer);
});

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
