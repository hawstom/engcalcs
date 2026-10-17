// The "Mark highest and lowest values" setting is retired (Tom: Tables and Find replaced it).
//   node dev/lpn-spike/retire-mark-extrema-harness.js
//
//   1. The setting is gone from the label settings and from what a saved project writes.
//   2. A project file from before, still carrying `markExtrema`, opens without error, ignores it,
//      and draws no high/low tick on any label.
//   3. The page source, the Settings panel and the language files no longer name it.

const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet } = require('./lpn-dom-stub.js');
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
	"\t\tlabelPrefixFor: labelPrefixFor,\n" +
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


let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function noTicks(doc) {
	const bad = [];
	doc.links.forEach(function (l) { L.linkDecor(l.id).concat(L.linkTspans(l.id).map(function (t) { return t.dec; })).forEach(function (d) { if (d) { bad.push(l.id); } }); });
	doc.nodes.forEach(function (n) { L.nodeDecor(n.id).concat(L.nodeTspans(n.id).map(function (t) { return t.dec; })).forEach(function (d) { if (d) { bad.push(n.id); } }); });
	return bad;
}

async function main() {
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
openExample(L);
L.runSolve();
await settleEpanet();

let ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow' || k === 'id'); });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'demand' || k === 'pressure'); });
L.refreshLabelText();
ok('the setting is not among the label settings', !('markExtrema' in ls));
ok('labels draw no high/low tick', noTicks(L.getDoc()).length === 0, noTicks(L.getDoc()).join(','));

const saved = JSON.parse(JSON.stringify(L.serializeProject()));
ok('a saved project does not write the setting', !('markExtrema' in (saved.labelSettings || {})));

// An old file: the setting present, both ways round.
for (const v of [true, false]) {
	const old = JSON.parse(JSON.stringify(saved));
	old.labelSettings.markExtrema = v;
	let err = null;
	try { L.applySaved(old); L.runSolve(); } catch (e) { err = e; }
	ok('an old project with markExtrema=' + v + ' opens without error', !err, err && err.stack);
	await settleEpanet();
	ls = L.labelSettings();
	ok('...the setting is not taken up', !('markExtrema' in ls));
	L.refreshLabelText();
	ok('...and it draws no tick', noTicks(L.getDoc()).length === 0, noTicks(L.getDoc()).join(','));
	ok('...and saving it again drops the setting', !('markExtrema' in (JSON.parse(JSON.stringify(L.serializeProject())).labelSettings || {})));
}

const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');
ok('the page code has no checkbox or reader for it', !/lpn_labels_mark_extrema/.test(src) && !/labelSettings\.markExtrema/.test(src));
const langs = fs.readdirSync(path.join(__dirname, '../../lib')).filter(function (f) { return /^lang\.ec\.[a-z]{2}\.php$/.test(f); });
ok('all 27 language files are checked', langs.length === 27, String(langs.length));
ok('no language file keeps the setting or its tip', langs.every(function (f) {
	return !/lpn_labels_mark_extrema/.test(fs.readFileSync(path.join(__dirname, '../../lib', f), 'utf8'));
}));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
}
main().catch(function (e) { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });
