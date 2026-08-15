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

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, effective: effective,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlinkLabel: function (id) { return linkEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tnodeLabel: function (id) { return nodeEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tlinkDecor: function (id) { return linkEls[id].lines.map(function (l) { return l.decoration || ''; }); },\n" +
	"\t\tlinkLineColors: function (id) { return linkEls[id].lines.map(function (l) { return l.color; }); },\n" +
	"\t\tlinkTspans: function (id) { return this.tspanDump(linkEls[id].text); },\n" +
	"\t\tnodeTspans: function (id) { return this.tspanDump(nodeEls[id].text); },\n" +
	"\t\tlineCount: function (id) { return linkEls[id].lineCount; },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
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
L.drawExample();
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
[['demand', 'Q='], ['head', 'H='], ['pressure', 'P='], ['elev', 'E=']].forEach(function (pair) {
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
// The separator is a segment of its own, so five segments: id, sep, flow, sep, velocity.
ok('...and the separator is its own segment, so a mark can never land on it',
	rows[0].length === 5, JSON.stringify(rows[0].map(function (s) { return s.text; })));

ls.separator = ', ';
rows = showThree();
ok('a ", " separator keeps its space -- nothing trims it', /, /.test(rowText(rows[0])), rowText(rows[0]));
ls.separator = ' | ';
rows = showThree();
ok('a " | " separator likewise', / \| /.test(rowText(rows[0])), rowText(rows[0]));
ls.separator = ' ';

// The drag. lx/ly is the manual offset the page itself writes on a drag.
P.lx = 5; P.ly = -5;
rows = showThree();
ok('a DRAGGED label goes back to a stack, one row per value', rows.length === 3, JSON.stringify(rows.map(rowText)));
ok('...and lineCount follows it', L.lineCount(P.id) === 3, String(L.lineCount(P.id)));
ok('...each row being one whole value', rows.every(function (r) { return r.length === 1; }), JSON.stringify(rows.map(rowText)));
delete P.lx; delete P.ly;
ok('sending it home returns it to one line', showThree().length === 1);

console.log('\n=== the extrema mark is the number\'s own text-decoration ===');
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow'); });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
L.refreshLabelText();
// Every LINK, not just the pipes: the network-wide flow extremes are judged across all of them,
// and in this example the maximum flow is on the pump. Filtering to pipes first and then asserting
// "a high and a low exist" asserted something about the example, not about the code.
const decorated = doc.links.filter(function (l) { return L.linkDecor(l.id)[0]; });
const kinds = decorated.map(function (l) { return L.linkDecor(l.id)[0]; });
ok('the example network really does have a marked high AND a marked low',
	kinds.indexOf('high') >= 0 && kinds.indexOf('low') >= 0,
	decorated.map(function (l) { return l.id + ':' + L.linkDecor(l.id)[0]; }).join(' '));
decorated.forEach(function (l) {
	const seg = rowsOf(L.linkTspans(l.id))[0][0];
	const want = L.linkDecor(l.id)[0] === 'high' ? 'overline' : 'underline';
	ok(l.id + ' carries ' + want + ' on the value itself', seg.dec === want, JSON.stringify(seg));
});
const plain = doc.links.filter(function (l) { return !L.linkDecor(l.id)[0]; });
ok('an unmarked value carries no decoration at all',
	plain.every(function (l) { return !rowsOf(L.linkTspans(l.id))[0][0].dec; }), plain.length + ' unmarked');

// On a one-line label the mark must land on the NUMBER, not on the separator beside it.
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'id' || k === 'flow'); });
L.refreshLabelText();
const markedOneLine = pipes.filter(function (l) { return L.linkDecor(l.id)[1]; })[0];
if (markedOneLine) {
	const row = rowsOf(L.linkTspans(markedOneLine.id))[0];
	ok('on a one-line label the mark is on the value segment', row[2] && row[2].dec, JSON.stringify(row));
	ok('...and NOT on the separator', !row[1].dec && row[1].text === ' ', JSON.stringify(row[1]));
	ok('...nor on the id, which has no extrema of its own', !row[0].dec, JSON.stringify(row[0]));
} else {
	ok('a link with a marked flow exists to check the one-line case', false);
}

console.log('\n=== affixes never change WHICH value is marked ===');
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow'); });
ls.prefix.link.flow = ''; ls.suffix.link.flow = '';
L.refreshLabelText();
const bare = pipes.map(function (l) { return L.linkDecor(l.id)[0]; });
ls.prefix.link.flow = 'FLOW='; ls.suffix.link.flow = ' gpm'; ls.separator = ' | ';
L.refreshLabelText();
const affixed = pipes.map(function (l) { return L.linkDecor(l.id)[0]; });
ok('the same pipes are marked high/low with affixes as without',
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
