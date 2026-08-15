// Label prefixes, suffixes and the one blanket separator (ROADMAP Task 333). Run with:
//   node dev/lpn-spike/label-affix-harness.js
//
// WHY THIS EXISTS. Task 333 traded the per-field label COLOURS for per-field PREFIXES, and the
// trade only works if a prefix is actually attached to the field it names: a mis-wired colour was
// visible at a glance, while a mis-wired prefix prints a plausible-looking label ("V 12.5" over a
// flow) that reads as correct to anyone who is not checking. So every field's default is asserted
// by name.
//
// The three things that can break quietly:
//   1. UNSET IS NOT EMPTY. A field with no stored prefix takes its default; a field storing '' has
//      been told by the user to print nothing. Collapse the two and the user can never turn a
//      prefix off -- the box would refill itself on the next rebuild.
//   2. THE SEPARATOR IS STORED EXACTLY AS TYPED, empty string included, and its own default IS a
//      space -- so any "|| ' '" style fallback silently forbids the 'Q12.5' form.
//   3. THE EXTREMA BADGE COMPARES NUMBERS. Affixes are applied to the finished line, after the
//      comparison, so which labels get a tick must not change when a prefix is added.

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
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
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

console.log('\n=== Tom\'s default prefixes, field by field ===');
// Each pair is [field, expected prefix]. The blanks are as deliberate as the letters: diameter and
// length are read from their units, and an ID already begins with settings.idPrefixes.
// A blank expectation is checked against the BARE value, not merely against "does not start with
// the letter I expected" -- an ID line is 'J1', which begins with a letter of its own, and a lazier
// test would have called a stray prefix on it a pass.
function checkAffix(what, field, prefix, text, bare) {
	const want = prefix ? prefix + ' ' + bare : bare;
	ok(what + ' ' + field + ' prints "' + want + '"', text === want, text);
}
[['flow', 'Q'], ['velocity', 'V'], ['headloss', 'Hl'], ['gradient', 'S'], ['km', 'km'],
	['diameter', ''], ['length', '']].forEach(function (pair) {
	const text = onlyLink(pair[0])[0];
	checkAffix('link', pair[0], pair[1], text, text.replace(/^\S+ /, ''));
	ok('...and nothing else precedes it', pair[1] ? text.indexOf(pair[1] + ' ') === 0 : /^-?[\d.]/.test(text), text);
});
checkAffix('link', 'id', '', onlyLink('id')[0], pipes[0].id);
[['demand', 'Q'], ['head', 'H'], ['pressure', 'P'], ['elev', 'E']].forEach(function (pair) {
	const text = onlyNode(pair[0])[0];
	checkAffix('node', pair[0], pair[1], text, text.replace(/^\S+ /, ''));
	ok('...and nothing else precedes it', text.indexOf(pair[1] + ' ') === 0, text);
});
checkAffix('node', 'id', '', onlyNode('id')[0], junctions[0].id);

console.log('\n=== the roughness prefix IS the friction method\'s own symbol ===');
// The one dynamic default: a stored 'C' could not follow the method selector, so this default is
// computed at print time.
[['hw', 'C'], ['manning', 'n'], ['dw', 'e']].forEach(function (pair) {
	L.settings().method = pair[0];
	const text = onlyLink('roughness')[0];
	ok(pair[0] + ' roughness prints "' + pair[1] + '"', text.indexOf(pair[1] + ' ') === 0, text);
});
L.settings().method = 'hw';

console.log('\n=== the blanket separator ===');
const flowDefault = onlyLink('flow')[0];
ok('the default separator is a single space', /^Q \d/.test(flowDefault), flowDefault);
ls.separator = '';
const flowTight = onlyLink('flow')[0];
ok('an EMPTY separator is honoured, not replaced by the default space', /^Q\d/.test(flowTight), flowTight);
ls.separator = '=';
const flowEq = onlyLink('flow')[0];
ok('a "=" separator gives the Q=12.5 form Task 333 was written around', /^Q=\d/.test(flowEq), flowEq);
// It is BLANKET: one setting, every field, both groups.
const headEq = onlyNode('head')[0];
ok('...and the same separator reaches the node fields', /^H=\d/.test(headEq), headEq);
ls.separator = ' ';

console.log('\n=== unset is not empty ===');
ls.prefix.link.flow = '';
const flowNone = onlyLink('flow')[0];
ok('an empty stored prefix prints NO prefix and no stray separator', /^\d/.test(flowNone), flowNone);
delete ls.prefix.link.flow;
ok('...and deleting it again restores the default', /^Q /.test(onlyLink('flow')[0]));
ls.prefix.link.flow = 'Qty';
ok('a custom prefix is used verbatim', /^Qty \d/.test(onlyLink('flow')[0]), onlyLink('flow')[0]);
delete ls.prefix.link.flow;

console.log('\n=== suffixes ===');
ls.suffix.link.flow = 'gpm';
const flowSuf = onlyLink('flow')[0];
ok('a suffix lands after the number, separated the same way', /^Q \d[\d.]* gpm$/.test(flowSuf), flowSuf);
delete ls.suffix.link.flow;
// The gradient's '%' is UNIT-DERIVED and belongs to the number; a user suffix wraps outside it.
ls.suffix.link.gradient = 'x';
const gradSuf = onlyLink('gradient')[0];
ok('the gradient keeps its own % INSIDE a user suffix', /^S [\d.]+% x$/.test(gradSuf), gradSuf);
delete ls.suffix.link.gradient;

console.log('\n=== the extrema badge still compares numbers, not text ===');
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow'); });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
ls.prefix.link.flow = ''; ls.suffix.link.flow = '';
L.refreshLabelText();
const bare = pipes.map(function (l) { return L.linkDecor(l.id)[0]; });
ls.prefix.link.flow = 'FLOW'; ls.suffix.link.flow = 'gpm'; ls.separator = '=';
L.refreshLabelText();
const affixed = pipes.map(function (l) { return L.linkDecor(l.id)[0]; });
ok('the same pipes are marked high/low with affixes as without',
	bare.join(',') === affixed.join(','), bare.join(',') + ' vs ' + affixed.join(','));
ok('...and something is actually marked, so that check is not vacuous', affixed.some(function (d) { return d; }));

console.log('\n=== affixes are PROJECT settings and survive a save/open round trip ===');
// The empty string is the case that a naive "saved.x || default" merge loses, and losing it means
// a prefix the user turned off comes back on when they reopen their own file.
ls.prefix.link.flow = ''; ls.suffix.link.velocity = 'ft/s'; ls.separator = '';
const saved = JSON.parse(JSON.stringify(L.serializeProject()));
L.applySaved(saved);
const re = L.labelSettings();
ok('an empty prefix survives the round trip as an empty prefix', re.prefix.link.flow === '', JSON.stringify(re.prefix.link.flow));
ok('a suffix survives', re.suffix.link.velocity === 'ft/s', JSON.stringify(re.suffix.link.velocity));
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
ok('...and prints the default prefix, not "undefined"', /^Q \d/.test(L.linkLabel(pipes[0].id)[0]), L.linkLabel(pipes[0].id)[0]);

console.log('\n=== no label carries a colour any more (Task 333 retired the palette) ===');
const anyColor = pipes.some(function (l) {
	return L.linkLineColors(l.id).some(function (c) { return c !== undefined; });
});
ok('a built line carries no color property at all -- setMultilineText has nothing to tint with', !anyColor,
	JSON.stringify(L.linkLineColors(pipes[0].id)));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
