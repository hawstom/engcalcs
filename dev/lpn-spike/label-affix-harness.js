// Label prefixes, suffixes, the blanket separator, and the one-line-unless-dragged shape
// (ROADMAP Task 333). Run with:
//   node dev/lpn-spike/label-affix-harness.js
//
// WHY THIS EXISTS. Task 333 traded the per-field label COLOURS for per-field PREFIXES, and the
// trade only works if a prefix is actually attached to the field it names: a mis-wired colour was
// visible at a glance, while a mis-wired prefix prints a plausible-looking label ("V=12.5" over a
// flow) that reads as correct to anyone who is not checking. So every field's default is asserted
// by name.
//
// What can break quietly:
//   1. UNSET IS NOT EMPTY. A field with no stored prefix takes its default; a field storing '' has
//      been told by the user to print nothing. Collapse the two and the user can never turn a
//      prefix off -- the box would refill itself on the next rebuild.
//   2. THE PREFIX IS PRINTED EXACTLY AS TYPED, hard against the number. The '=' in 'Q=' is part of
//      the string the user owns (Tom, 2026-08-15), so nothing may insert a gap of its own.
//   3. THE SEPARATOR GOES BETWEEN VALUES, and is stored exactly as typed -- ', ' and ' | ' both
//      carry their own spaces, so any trim() here would silently rewrite two of the three forms
//      Tom named.
//   4. THE SHAPE FOLLOWS THE DRAG. One line normally, a stack once the user has placed the label.
//      This is the assertion that a future collision or layout change is most likely to break
//      without noticing, because both shapes look deliberate on screen.
//   5. THE EXTREMA MARK IS THE SEGMENT'S OWN text-decoration, and it must land on the NUMBER
//      segment -- never on the separator beside it, and never on a label whose value only ties.

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, effective: effective,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlinkLabel: function (id) { return linkEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tnodeLabel: function (id) { return nodeEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tlinkDecor: function (id) { return linkEls[id].lines.map(function (l) { return l.decoration || ''; }); },\n" +
	"\t\tnodeDecor: function (id) { return nodeEls[id].lines.map(function (l) { return l.decoration || ''; }); },\n" +
	"\t\tlinkLineColors: function (id) { return linkEls[id].lines.map(function (l) { return l.color; }); },\n" +
	"\t\tlinkTspans: function (id) { return this.tspanDump(linkEls[id].text); },\n" +
	"\t\tnodeTspans: function (id) { return this.tspanDump(nodeEls[id].text); },\n" +
	"\t\tlineCount: function (id) { return linkEls[id].lineCount; },\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	// The raw tspans the page actually built. Grouping them into rows is done in the harness
	// (rowsOf() below) rather than here, because the grouping RULE -- a tspan carrying an x starts a
	// row, one without an x flows on from the last -- is the mechanism under test, and a test that
	// asked the page to describe its own rows would be asking the defendant for the verdict.
	"\t\ttspanDump: function (textEl) {\n" +
	"\t\t\tvar out = [];\n" +
	"\t\t\tfor (var i = 0; i < textEl.childNodes.length; i++) {\n" +
	"\t\t\t\tvar t = textEl.childNodes[i];\n" +
	"\t\t\t\tout.push({ text: t.textContent, dec: t.getAttribute('text-decoration') || '',\n" +
	"\t\t\t\t\thasX: t.getAttribute('x') != null });\n" +
	"\t\t\t}\n" +
	"\t\t\treturn out;\n" +
	"\t\t},\n"
);

// SVG's own rule, applied here so the page is never asked to explain itself: an x starts a row.
function rowsOf(tspans) {
	const rows = [];
	tspans.forEach(function (t) {
		if (t.hasX || rows.length === 0) { rows.push([t]); } else { rows[rows.length - 1].push(t); }
	});
	return rows;
}

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function rowText(row) { return row.map(function (s) { return s.text; }).join(''); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
openExample(L);
L.runSolve();

const doc = L.getDoc();
const ls = L.labelSettings();
const pipes = doc.links.filter(function (l) { return l.type === 'pipe'; });
const junctions = doc.nodes.filter(function (n) { return n.type === 'junction'; });
ok('the example network has pipes and junctions to label', pipes.length > 0 && junctions.length > 0);

// Show exactly one field at a time, so the line under test is unmistakably the one asserted.
function onlyLink(field) {
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === field); });
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
	L.refreshLabelText();
	return L.linkLabel(pipes[0].id);
}
function onlyNode(field) {
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === field); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	L.refreshLabelText();
	return L.nodeLabel(junctions[0].id);
}

console.log('\n=== Tom\'s default prefixes, field by field, "=" and all ===');
// A blank expectation is checked against the BARE value, not merely against "does not start with
// the letter I expected" -- an ID line is 'J1', which begins with a letter of its own, and a lazier
// test would have called a stray prefix on it a pass.
function checkAffix(what, field, prefix, text, bare) {
	ok(what + ' ' + field + ' prints "' + prefix + bare + '"', text === prefix + bare, text);
}
[['flow', 'Q='], ['velocity', 'V='], ['headloss', 'Hl='], ['gradient', 'S='], ['km', 'km='],
	['diameter', ''], ['length', '']].forEach(function (pair) {
	const text = onlyLink(pair[0])[0];
	checkAffix('link', pair[0], pair[1], text, text.slice(pair[1].length));
	// The number starts where the prefix stops -- no space of the page's own.
	ok('...and the number follows the prefix immediately', /^-?[\d.]/.test(text.slice(pair[1].length)), text);
});
checkAffix('link', 'id', '', onlyLink('id')[0], pipes[0].id);
[['demand', 'Q='], ['head', 'H='], ['pressure', 'P='], ['elev', 'Z=']].forEach(function (pair) {
	const text = onlyNode(pair[0])[0];
	checkAffix('node', pair[0], pair[1], text, text.slice(pair[1].length));
	ok('...and the number follows the prefix immediately', /^-?[\d.]/.test(text.slice(pair[1].length)), text);
});
checkAffix('node', 'id', '', onlyNode('id')[0], junctions[0].id);

console.log('\n=== the roughness prefix IS the friction method\'s own symbol ===');
// The one dynamic default: a stored 'C=' could not follow the method selector, so this default is
// computed at print time.
[['hw', 'C='], ['manning', 'n='], ['dw', 'e=']].forEach(function (pair) {
	L.settings().method = pair[0];
	const text = onlyLink('roughness')[0];
	ok(pair[0] + ' roughness prints "' + pair[1] + '"', text.indexOf(pair[1]) === 0, text);
});
L.settings().method = 'hw';

console.log('\n=== unset is not empty ===');
ls.prefix.link.flow = '';
ok('an empty stored prefix prints NO prefix', /^-?[\d.]/.test(onlyLink('flow')[0]), onlyLink('flow')[0]);
delete ls.prefix.link.flow;
ok('...and deleting it again restores the default', /^Q=\d/.test(onlyLink('flow')[0]));
ls.prefix.link.flow = 'Qty: ';
ok('a custom prefix is used verbatim, spaces and all', /^Qty: \d/.test(onlyLink('flow')[0]), onlyLink('flow')[0]);
delete ls.prefix.link.flow;

console.log('\n=== suffixes ===');
ls.suffix.link.flow = ' gpm';
ok('a suffix lands after the number, exactly as typed', / gpm$/.test(onlyLink('flow')[0]), onlyLink('flow')[0]);
delete ls.suffix.link.flow;
// The gradient's '%' is UNIT-DERIVED and belongs to the number; a user suffix wraps outside it.
ls.suffix.link.gradient = '!';
ok('the gradient keeps its own % INSIDE a user suffix', /^S=[\d.]+%!$/.test(onlyLink('gradient')[0]), onlyLink('gradient')[0]);
delete ls.suffix.link.gradient;

console.log('\n=== one line unless dragged ===');
function showThree() {
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'id' || k === 'flow' || k === 'velocity'); });
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
	L.refreshLabelText();
	return rowsOf(L.linkTspans(pipes[0].id));
}
const P = pipes[0];
delete P.lx; delete P.ly;
let rows = showThree();
ok('three fields on an auto-placed label render as ONE row', rows.length === 1, JSON.stringify(rows.map(rowText)));
ok('...and lineCount agrees, so the mask and the collision box are sized for one line',
	L.lineCount(P.id) === 1, String(L.lineCount(P.id)));
ok('...with the values joined by the separator', / /.test(rowText(rows[0])) && /Q=/.test(rowText(rows[0])), rowText(rows[0]));
// EVERY PREFIX AND EVERY SEPARATOR IS ITS OWN SEGMENT, which is what keeps an extrema mark the
// length of the number alone: id, sep, 'Q=', value, sep, 'V=', value.
ok('...and the prefixes and separators are their own segments',
	rows[0].length === 7, JSON.stringify(rows[0].map(function (s) { return s.text; })));
ok('...so no segment carrying a number also carries a prefix',
	rows[0].every(function (s) { return !/[A-Za-z]=[\d.]/.test(s.text); }),
	JSON.stringify(rows[0].map(function (s) { return s.text; })));

ls.separator = ', ';
rows = showThree();
ok('a ", " separator keeps its space -- nothing trims it', /, /.test(rowText(rows[0])), rowText(rows[0]));
ls.separator = ' | ';
rows = showThree();
ok('a " | " separator likewise', / \| /.test(rowText(rows[0])), rowText(rows[0]));
ls.separator = ' ';

// A NODE label is a stack whatever it is doing, which is the other half of Tom's rule: it hangs off
// a point with space above and below, and carries up to five fields where a link carries two.
function showThreeNode() {
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id' || k === 'demand' || k === 'pressure'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	L.refreshLabelText();
	return rowsOf(L.nodeTspans(junctions[0].id));
}
const J = junctions[0];
delete J.lx; delete J.ly;
const nodeRows = showThreeNode();
ok('an UNDRAGGED node label is a stack, one row per value', nodeRows.length === 3,
	JSON.stringify(nodeRows.map(rowText)));
J.lx = 5; J.ly = -5;
ok('...and dragging it changes nothing, because it was never on one line',
	showThreeNode().length === 3);
delete J.lx; delete J.ly;

// The drag. lx/ly is the manual offset the page itself writes on a drag.
P.lx = 5; P.ly = -5;
rows = showThree();
ok('a DRAGGED label goes back to a stack, one row per value', rows.length === 3, JSON.stringify(rows.map(rowText)));
ok('...and lineCount follows it', L.lineCount(P.id) === 3, String(L.lineCount(P.id)));
ok('...each row being one whole value, however many segments that takes',
	rows.every(function (r) { return /^([A-Za-z]+\d+|Q=[\d.]+|V=[\d.]+)$/.test(rowText(r)); }),
	JSON.stringify(rows.map(rowText)));
delete P.lx; delete P.ly;
ok('sending it home returns it to one line', showThree().length === 1);

console.log('\n=== the extrema mark is the number\'s own text-decoration ===');
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow'); });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'demand'); });
L.refreshLabelText();

// DEMAND AND FLOW ARE JUDGED SEPARATELY, decided twice (2026-08-15: pooled in the morning at Tom's
// request, reverted in the afternoon once the report behind it turned out to be a misreading). They
// share the Q= prefix, which makes pooling them look obviously right, so this asserts the split
// directly rather than leaving it to a comment.
//
// The reason it must stay split: a pooled Q can only ever be answered by a LINK, because a source
// carries the sum of every demand downstream of it -- so "which junction draws the most" would stop
// being answerable at all. That is exactly what this checks: the biggest demand is marked even
// though a link carries more.
const nodeQ = doc.nodes.filter(function (n) { return n.type === 'junction'; })
	.map(function (n) { return { id: n.id, v: parseFloat(L.nodeLabel(n.id)[0].slice(2)), dec: L.nodeDecor(n.id)[0] }; })
	.filter(function (e) { return isFinite(e.v); });
const linkQ = doc.links
	.map(function (l) { return { id: l.id, v: parseFloat(L.linkLabel(l.id)[0].slice(2)), dec: L.linkDecor(l.id)[0] }; })
	.filter(function (e) { return isFinite(e.v); });
ok('both kinds of Q are on the drawing at once', nodeQ.length > 0 && linkQ.length > 0,
	nodeQ.length + ' demands, ' + linkQ.length + ' flows');
function topOf(list) { return Math.max.apply(null, list.map(function (e) { return e.v; })); }
const topNode = topOf(nodeQ), topLink = topOf(linkQ);
ok('a link really does carry more than any junction demands -- so the pools are distinguishable',
	topLink > topNode, topLink + ' vs ' + topNode);
ok('the biggest DEMAND is marked high, even though a link carries more',
	nodeQ.filter(function (e) { return e.v === topNode; }).every(function (e) { return e.dec === 'high'; }),
	JSON.stringify(nodeQ.filter(function (e) { return e.v === topNode; })));
ok('the biggest FLOW is marked high too -- each pool has its own top',
	linkQ.filter(function (e) { return e.v === topLink; }).every(function (e) { return e.dec === 'high'; }),
	JSON.stringify(linkQ.filter(function (e) { return e.v === topLink; })));
ok('...and no junction is judged against a link: nothing below the demand top is marked high',
	nodeQ.filter(function (e) { return e.dec === 'high'; }).every(function (e) { return e.v === topNode; }),
	JSON.stringify(nodeQ.filter(function (e) { return e.dec === 'high'; })));

// The mark itself: on the value segment, at the value's own length.
doc.links.filter(function (l) { return L.linkDecor(l.id)[0]; }).forEach(function (l) {
	const segs = L.linkTspans(l.id);
	const m = segs.filter(function (t) { return t.dec; });
	const want = L.linkDecor(l.id)[0] === 'high' ? 'overline' : 'underline';
	ok(l.id + ' carries ' + want + ' on exactly one segment', m.length === 1 && m[0].dec === want, JSON.stringify(segs));
	// THE MARK'S LENGTH IS THE NUMBER'S LENGTH. Tom, 2026-08-15, of a mark spanning a whole line:
	// "The underline needs to be only as long as the ID." A mark that also covered 'Q=' would start
	// at the label's left edge, which in a stacked label is exactly where the row above would be
	// underlined -- so it would read as belonging to the wrong row.
	ok('...and that segment is the NUMBER alone, with no prefix in it',
		m.length === 1 && /^-?[\d.]+%?$/.test(m[0].text), JSON.stringify(m));
});
const plain = doc.links.filter(function (l) { return !L.linkDecor(l.id)[0]; });
ok('an unmarked value carries no decoration at all',
	plain.every(function (l) { return L.linkTspans(l.id).every(function (t) { return !t.dec; }); }),
	plain.length + ' unmarked');

// On a one-line label the mark must land on the NUMBER, not on the separator beside it.
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'id' || k === 'flow'); });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
L.refreshLabelText();
const markedOneLine = doc.links.filter(function (l) { return L.linkDecor(l.id)[1]; })[0];
if (markedOneLine) {
	const row = rowsOf(L.linkTspans(markedOneLine.id))[0];
	const at = row.map(function (t) { return t.dec ? 1 : 0; }).indexOf(1);
	ok('on a one-line label exactly one segment is marked',
		row.filter(function (t) { return t.dec; }).length === 1, JSON.stringify(row));
	ok('...and it is the number, not the prefix or the separator beside it',
		at >= 0 && /^-?[\d.]+$/.test(row[at].text), JSON.stringify(row));
	ok('...nor the id, which has no extrema of its own -- a string has no max',
		!row[0].dec && row[0].text === markedOneLine.id, JSON.stringify(row[0]));
} else {
	ok('a link with a marked flow exists to check the one-line case', false);
}

console.log('\n=== affixes never change WHICH value is marked ===');
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow'); });
ls.prefix.link.flow = ''; ls.suffix.link.flow = '';
L.refreshLabelText();
// Every link, not just the pipes: the Q pool spans nodes and links, so the network's high Q is on
// the pump here and a pipes-only check would be asserting nothing.
const bare = doc.links.map(function (l) { return L.linkDecor(l.id)[0]; });
ls.prefix.link.flow = 'FLOW='; ls.suffix.link.flow = ' gpm'; ls.separator = ' | ';
L.refreshLabelText();
const affixed = doc.links.map(function (l) { return L.linkDecor(l.id)[0]; });
ok('the same links are marked high/low with affixes as without',
	bare.join(',') === affixed.join(','), bare.join(',') + ' vs ' + affixed.join(','));
ok('...and something is actually marked, so that check is not vacuous', affixed.some(function (d) { return d; }));

console.log('\n=== affixes are PROJECT settings and survive a save/open round trip ===');
// The empty string is the case that a naive "saved.x || default" merge loses, and losing it means
// a prefix the user turned off comes back on when they reopen their own file.
ls.prefix.link.flow = ''; ls.suffix.link.velocity = ' ft/s'; ls.separator = '';
const saved = JSON.parse(JSON.stringify(L.serializeProject()));
L.applySaved(saved);
const re = L.labelSettings();
ok('an empty prefix survives the round trip as an empty prefix', re.prefix.link.flow === '', JSON.stringify(re.prefix.link.flow));
ok('a suffix survives, leading space and all', re.suffix.link.velocity === ' ft/s', JSON.stringify(re.suffix.link.velocity));
ok('an empty separator survives -- not re-defaulted to a space', re.separator === '', JSON.stringify(re.separator));
// And a file written BEFORE Task 333 has none of these keys at all; it must open on the defaults
// rather than on undefined, which would print "undefined" in front of every number.
delete saved.labelSettings.prefix; delete saved.labelSettings.suffix; delete saved.labelSettings.separator;
L.applySaved(saved);
const old = L.labelSettings();
ok('a pre-Task-333 file opens on the defaults', old.separator === ' ' && old.prefix.link.flow === undefined,
	JSON.stringify({ sep: old.separator, flow: old.prefix.link.flow }));
Object.keys(old.link).forEach(function (k) { old.link[k] = (k === 'flow'); });
L.refreshLabelText();
ok('...and prints the default prefix, not "undefined"', /^Q=\d/.test(L.linkLabel(pipes[0].id)[0]), L.linkLabel(pipes[0].id)[0]);

console.log('\n=== no label carries a colour any more (Task 333 retired the palette) ===');
const anyColor = pipes.some(function (l) {
	return L.linkLineColors(l.id).some(function (c) { return c !== undefined; });
});
ok('a built line carries no color property at all -- setMultilineText has nothing to tint with', !anyColor,
	JSON.stringify(L.linkLineColors(pipes[0].id)));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
