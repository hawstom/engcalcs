// Give the shipped gallery examples their EPANET token bags back -- ROADMAP Task 430.
//
//   node dev/scripts/backfill_example_tokens.js            # report only
//   node dev/scripts/backfill_example_tokens.js --apply     # write, then run generate_examples.php
//
// WHY THIS EXISTS. `dev/inp-export-conversion-bug.md` measured the whole of Task 430: on a Net3
// round trip **no unit is converted and no value changes** -- 1,225 tokens, 1,225 with the same
// value. What differs is 32 tokens' TEXT (`9.00` -> `9`, `4530.` -> `4530`, `.1` -> `0.1`,
// `220.0` -> `220`), because the committed example JSONs were authored before Task 390 step 3 taught
// the reader to keep a number's own characters beside it. They carry no `tok` bags at all, and
// nothing in the writer can recover text the document never held.
//
// **IT IS A MERGE, NOT A RE-AUTHORING.** The examples' view, labels, backdrop, name and description
// are hand-tuned and must not move, so this walks the committed file and adds `tok` where a fresh
// import of the same `.inp` has one for the same element. `carryInpTokens()`'s own rule makes it
// safe in the other direction too: a token is kept only while `parseFloat(token) === value`, so a
// bag that disagreed with the example's number would simply never be written back out.
//
// **THIS IS A REPAIR AND ALSO A GENERATOR.** It is reproducible on purpose: the examples will be
// re-authored one day, and a one-off REPL session is not a fix. Re-running it on already-repaired
// files is a no-op, which the report makes visible.
//
// The two Basic examples have no `.inp` behind them and correctly have no tokens. Elm Street has
// none either -- its `.inp` is not in the repo -- so its 37 elements stay bare and its round trip
// keeps reformatting. Nothing here can change that without the source file.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..') + path.sep;

const APPLY = process.argv.indexOf('--apply') >= 0;

// name -> [committed example JSON, the .inp it came from]
const PAIRS = [
	['Net1', 'dev/water-network-examples/Net1-lpn.json', 'dev/lpn-spike/reference/Net1.inp'],
	['Net2', 'dev/water-network-examples/Net2-lpn.json', 'dev/lpn-spike/reference/Net2.inp'],
	['Net3', 'dev/water-network-examples/Net3-lpn.json', 'dev/lpn-spike/reference/Net3.inp']
];

const { byId, setUnitSet, loadLoopedNetwork } = require('../lpn-spike/lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

// The import path is written around the browser's FileReader, and it decides which of EPANET's two
// formats a file is from its first BYTES -- so the stub reads bytes, exactly as inp-import-harness
// does, rather than short-circuiting to text.
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let totalAdded = 0, filesChanged = 0;

PAIRS.forEach(function (pair) {
	const name = pair[0], jsonPath = ROOT + pair[1], inpPath = ROOT + pair[2];
	if (!fs.existsSync(jsonPath) || !fs.existsSync(inpPath)) {
		console.log(name + ': SKIP -- ' + (fs.existsSync(jsonPath) ? pair[2] : pair[1]) + ' is not here');
		return;
	}
	// Start from SI every time, so the import's own "the file's units win" step is exercised rather
	// than accidentally satisfied by whatever the last file left on the strip.
	setUnitSet('si');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: name + '.inp', _text: fs.readFileSync(inpPath, 'utf8') });
	const fresh = L.getDoc();

	const bag = {}, curveIds = {};
	fresh.nodes.forEach(function (n) { if (n.tok) { bag['n|' + n.id] = n.tok; } });
	// **A PUMP'S CURVE NAME IS THE USER'S TEXT TOO** (Task 430(b)). It is not in a `tok` bag -- a
	// token is text for a NUMBER -- but it is spent in exactly the same way: without it the writer
	// invents `C_<pumpid>` and Net3's curves `1` and `2` come back as `C_10` and `C_335`.
	fresh.links.forEach(function (l) { if (l.curveId) { curveIds[l.id] = l.curveId; } });
	fresh.links.forEach(function (l) {
		if (l.tok) { bag['l|' + l.id] = l.tok; }
		// A VERTEX HAS TOKENS TOO and is matched by POSITION IN ITS LINK, which is the only identity a
		// vertex has -- it carries no id. Twelve of Net3's differences were coordinates, so leaving
		// these out would fix the elements and not the bends.
		(l.verts || []).forEach(function (v, i) { if (v.tok) { bag['v|' + l.id + '|' + i] = v.tok; } });
	});

	const raw = fs.readFileSync(jsonPath, 'utf8');
	const ex = JSON.parse(raw);
	let added = 0, already = 0, unmatched = 0;
	function merge(target, key) {
		const t = bag[key];
		if (!t) { unmatched++; return; }
		if (target.tok) { already++; return; }
		target.tok = t;
		added++;
	}
	(ex.nodes || []).forEach(function (n) { merge(n, 'n|' + n.id); });
	(ex.links || []).forEach(function (l) {
		merge(l, 'l|' + l.id);
		if (curveIds[l.id] && !l.curveId) { l.curveId = curveIds[l.id]; added++; }
		(l.verts || []).forEach(function (v, i) { merge(v, 'v|' + l.id + '|' + i); });
	});

	console.log(name + ': ' + added + ' bags added, ' + already + ' already present, ' +
		unmatched + ' elements with no token in the source');
	totalAdded += added;
	if (!added) { return; }
	if (!APPLY) { return; }
	// **THE SAME SHAPE THE FILE ALREADY HAD** -- TAB indent, and a trailing newline only if the
	// committed file had one. Re-serialising with a different indent would make a 2,500-line diff out
	// of a 27-key change and bury the thing being reviewed.
	fs.writeFileSync(jsonPath, JSON.stringify(ex, null, '\t') + (/\n$/.test(raw) ? '\n' : ''));
	filesChanged++;
});

console.log('\n' + totalAdded + ' token bag(s) ' + (APPLY ? 'written into ' + filesChanged + ' file(s)' : 'would be written (--apply to do it)'));
if (APPLY && filesChanged) {
	console.log('Now run: php dev/scripts/generate_examples.php');
}
process.exit(0);
