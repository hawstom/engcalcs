// A SHIPPED EXAMPLE STATES EVERYTHING ITS OWN SOURCE `.inp` STATES. Run with:
//   node dev/lpn-spike/examples-audit-harness.js
//
// Tom, 2026-09-06: *"Do we need to update the examples now that we handle all this EPANET
// functionality? I guess we should audit the examples to ensure that nothing in the original .inp
// files is missing."*
//
// **THE DEFECT THIS EXISTS FOR IS CHRONOLOGY, NOT PARSING.** A gallery example is a STORED PROJECT,
// so it does not gain a feature the day the importer does. It is written once, and every later task
// that teaches this page to interpret a section it used to merely carry leaves the stored copy
// behind. `section-carry-harness.js` §6 already holds one half of that -- the CARRIED text, and a
// named list of interpreted fields -- and the named list is the weakness: it is a list somebody has
// to extend, and Task 586's curve library did not extend it. `examples/Net3.lwn` was therefore
// shipping pump curves with EPA's own `104.` rewritten as `104` and the curve's name
// (`Pump Curve for Pump 10 (Lake Source)`) gone, while every check in the tree passed. Task 587's
// tank volume curve cost nothing only because no EPA file states a `VolCurve` -- which is luck, not
// a guard.
//
// **SO THE EXPECTATION HERE IS NOT A LIST. IT IS THE IMPORTER.** For each example with a source
// `.inp`, this opens the SHIPPED file the way the gallery does -- `migrateSaved()` then
// `applySaved()`, which is where every once-only conversion lives -- and compares the whole
// serialized document against a FRESH IMPORT of that same `.inp`. Anything the importer knows how to
// read today, the stored copy must already say. A field nobody here has heard of is compared by
// default; the exemptions are the other way round, and each one is a line somebody had to write.
//
// **WHAT IS EXEMPT IS CURATION, AND ONLY CURATION.** A gallery example differs from a raw import on
// purpose: which engine it opens on, where the reader is looking, how big the symbols are, and --
// for Net1 -- label offsets placed by hand so the drawing is legible. Those are declared below with
// their reason. Everything else is model, and model must match.
//
// Section 3 is the other half Tom asked for and it is deliberately cruder: every section the source
// `.inp` STATES is accounted for by name, in one of four dispositions, or this fails. That is the
// declared list the brief asks for -- so the next section this page learns leaves a sentence behind
// rather than a silence.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

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
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '   ' + extra));
}
function done(label) { console.log('  ' + (fails ? 'FAIL ' : 'ok   ') + label + '   ' + checks + ' checks'); }

const SRC_DIR = path.join(ROOT, 'dev', 'water-network-examples');
const OUT_DIR = path.join(ROOT, 'examples');

// **EVERY PUBLISHED EXAMPLE, READ OUT OF THE MANIFEST THE GENERATOR WRITES.** A list typed here
// would pass forever after somebody published an eighth example.
const PUBLISHED = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'manifest.json'), 'utf8'))
	.examples.map((e) => e.file);

// **WHICH `.inp` EACH EXAMPLE CAME FROM, AND WHY AN EXAMPLE HAS NONE.** An entry of `null` is the
// declaration that this example was AUTHORED rather than imported, so there is no source to be
// behind. Adding an example forces a line here, which is the point.
const SOURCE_OF = {
	'Net1.lwn': 'Net1.inp',
	'Net2.lwn': 'Net2.inp',
	'Net3.lwn': 'Net3.inp',
	// Net3 placed on the world (Task 497's geographic project). Its model is Net3's, so Net3.inp is
	// its source too and the geographic coordinates are the curation.
	'Net3-Novato-CA-World.lwn': 'Net3.inp',
	'Basic-example-SI-units.lwn': null,   // authored in metres; there is no public SI `.inp` to import
	'Basic-example-US-units.lwn': null,   // authored, the teaching starter
	'Elm-Street-Center.lwn': null         // Tom's own design snapshot, drawn on this page
};

// ---- What a curated example may differ from a raw import in, and why -----------------------------
//
// Read as: a settings key matching one of these is FURNITURE or a deliberate presentation choice.
// Everything else on `settings` is model and is compared.
const CURATED_SETTING = {
	engine: 'the gallery opens Net1 on EPANET so its chemistry runs; the routing is not the model',
	sectionsOpen: 'which Settings sections are unfolded',
	colorClassesNode: 'legend banding', colorClassesLink: 'legend banding',
	colorRampNode: 'palette', colorRampLink: 'palette',
	colorNodeField: 'what the map is coloured by', colorLinkField: 'what the map is coloured by',
	colorBreaks: 'the legend limits that colouring was drawn on',
	colorModes: 'how those limits were chosen', colorLegendPosition: 'where the legend sits',
	linkWidth: 'line weight',
	textSize: 'label size', symbolSize: 'symbol size', mapHeight: 'pane height',
	backdropOpacity: 'how strongly the site plan shows through'
};
// Same idea for an element: geometry and label placement are the drawing, not the network.
//
// `importNotes` is the one that is not curation and is still exempt, deliberately. A note is
// written into the document at import and KEPT there even after the feature that closed its gap
// ships -- `LPN_INP_NOT_A_LOSS` in js/lpn-inp.js filters it at DISPLAY time instead, because the
// record is the document's and a later feature may make it a loss again. Net3-Novato carries four
// `demand-pattern` notes from before Task 423, and they are correctly still there.
const CURATED_ELEMENT = {
	x: 1, y: 1, lx: 1, ly: 1, verts: 1, _xsrc: 1, _ysrc: 1, hidden: 1, labelHidden: 1,
	importNotes: 1
};
// Top-level keys that are the DRAWING or the session rather than the model.
const CURATED_TOP = {
	format: 1, app: 1, v: 1, project: 1, view: 1, backdrop: 1, labels: 1, labelSettings: 1,
	nextId: 1, origin: 1, scenarios: 1, profiles: 1, units: 1
};

function dump(v) { return JSON.stringify(v); }
// `times.text` is the clock as typed, and its KEY ORDER differs between a fresh import and a
// document that gained `qualityStep` through applySaved's once-only read. Order is not content.
function normalizeTimes(t) {
	if (!t || typeof t !== 'object') { return t; }
	const out = JSON.parse(JSON.stringify(t));
	if (out.text && typeof out.text === 'object') {
		const sorted = {};
		Object.keys(out.text).sort().forEach((k) => { sorted[k] = out.text[k]; });
		out.text = sorted;
	}
	return out;
}

function freshImport(inpName) {
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: inpName, _text: fs.readFileSync(path.join(SRC_DIR, inpName), 'utf8') });
	return JSON.parse(JSON.stringify(L.serialize()));
}
function openShipped(file) {
	const saved = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
	L.applySaved(L.migrateSaved(saved));
	return JSON.parse(JSON.stringify(L.serialize()));
}

// ------------------------------------------------------------------------------------------------
// 1. Every published example is declared, so a new one cannot slip in unaudited.
// ------------------------------------------------------------------------------------------------
console.log('\n1. Every published example says where it came from');
PUBLISHED.forEach((f) => {
	ok(f + ' is declared in SOURCE_OF',
		Object.prototype.hasOwnProperty.call(SOURCE_OF, f),
		'add a line to SOURCE_OF in this file -- an `.inp` name, or null with the reason it has none');
	ok(f + ' is shipped', fs.existsSync(path.join(OUT_DIR, f)));
});
Object.keys(SOURCE_OF).forEach((f) => {
	ok(f + ' is still published', PUBLISHED.indexOf(f) >= 0, 'declared here but not in the manifest');
});
ok('at least four examples have a source .inp',
	Object.keys(SOURCE_OF).filter((f) => SOURCE_OF[f]).length >= 4);
done('the roll call');

// ------------------------------------------------------------------------------------------------
// 2. THE MEASUREMENT. A shipped example, opened, says everything a fresh import of its own
//    source `.inp` says -- except what is declared curation.
// ------------------------------------------------------------------------------------------------
console.log('\n2. Opening a shipped example gives what importing its source .inp gives');
// **EVERY FRESH IMPORT FIRST, THEN EVERY OPEN.** `applySaved()` replaces the whole settings object
// and `importInp()` does not, so an open followed by an import leaves the OPENED project's display
// settings standing in the "source" side of the comparison -- which reads exactly like a shipped
// example having drifted, and is nothing of the kind.
const FRESH = {};
PUBLISHED.filter((f) => SOURCE_OF[f]).forEach((file) => {
	if (!FRESH[SOURCE_OF[file]]) { FRESH[SOURCE_OF[file]] = freshImport(SOURCE_OF[file]); }
});
PUBLISHED.filter((f) => SOURCE_OF[f]).forEach((file) => {
	const fresh = FRESH[SOURCE_OF[file]];
	const open = openShipped(file);

	// -- the model-bearing top-level keys, whole ---------------------------------------------------
	Object.keys(fresh).forEach((k) => {
		if (CURATED_TOP[k] || k === 'settings' || k === 'nodes' || k === 'links' || k === 'times') { return; }
		ok(file + ' carries its ' + k, dump(fresh[k]) === dump(open[k]),
			'\n     source: ' + String(dump(fresh[k])).slice(0, 400)
			+ '\n     shipped: ' + String(dump(open[k])).slice(0, 400));
	});
	ok(file + ' carries its times', dump(normalizeTimes(fresh.times)) === dump(normalizeTimes(open.times)),
		'\n     source: ' + dump(normalizeTimes(fresh.times))
		+ '\n     shipped: ' + dump(normalizeTimes(open.times)));

	// -- settings, key by key, with curation declared ----------------------------------------------
	Object.keys(fresh.settings || {}).forEach((k) => {
		if (CURATED_SETTING[k]) { return; }
		ok(file + ' carries settings.' + k,
			dump(fresh.settings[k]) === dump((open.settings || {})[k]),
			'source ' + String(dump(fresh.settings[k])).slice(0, 200)
			+ ' vs shipped ' + String(dump((open.settings || {})[k])).slice(0, 200));
	});

	// -- every node and every link, field by field -------------------------------------------------
	['nodes', 'links'].forEach((coll) => {
		const shipped = {};
		(open[coll] || []).forEach((e) => { shipped[e.id] = e; });
		const missing = [];
		(fresh[coll] || []).forEach((e) => {
			const s = shipped[e.id];
			if (!s) { missing.push(e.id); return; }
			new Set(Object.keys(e).concat(Object.keys(s))).forEach((k) => {
				if (CURATED_ELEMENT[k]) { return; }
				if (dump(e[k]) === dump(s[k])) { return; }
				missing.push(e.id + '.' + k + ': source ' + dump(e[k]) + ' vs shipped ' + dump(s[k]));
			});
		});
		ok(file + ' carries every ' + coll.slice(0, -1) + ' field its source states',
			missing.length === 0, missing.slice(0, 6).join(' | ') + (missing.length > 6 ? ' (+' + (missing.length - 6) + ')' : ''));
	});
});
done('a stored example has not fallen behind the importer');

// ------------------------------------------------------------------------------------------------
// 3. THE DECLARED LIST. Every section a source `.inp` states is accounted for by name.
// ------------------------------------------------------------------------------------------------
//
// Four dispositions, and a section in none of them fails. `structure` is read into the drawing
// itself, `interpreted` onto the model record, `carried` kept as the file's own characters, and
// `header-only` is a section the file opens and states nothing in.
console.log('\n3. Every section the source .inp states is accounted for');
const DISPOSITION = {
	TITLE: 'structure', JUNCTIONS: 'structure', RESERVOIRS: 'structure', TANKS: 'structure',
	PIPES: 'structure', PUMPS: 'structure', VALVES: 'structure', DEMANDS: 'structure',
	STATUS: 'structure', PATTERNS: 'structure', CURVES: 'structure', CONTROLS: 'structure',
	RULES: 'structure', EMITTERS: 'structure', TIMES: 'structure', OPTIONS: 'structure',
	COORDINATES: 'structure', VERTICES: 'structure', LABELS: 'structure', BACKDROP: 'structure',
	END: 'structure',
	// Taken apart onto the record AND kept as text (Tasks 566, 579). Section 2 above is what
	// actually proves the record half; this is the roll call.
	ENERGY: 'interpreted', QUALITY: 'interpreted', REACTIONS: 'interpreted',
	SOURCES: 'interpreted', MIXING: 'interpreted', TAGS: 'interpreted',
	// Kept verbatim and written back, read by nothing here: it tells EPANET's own report writer
	// what to print, and this page does not print EPANET's report.
	REPORT: 'carried'
};
function statedSections(text) {
	const out = {};
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(raw);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		if (!raw.replace(/;.*$/, '').trim()) { continue; }
		out[section].push(raw.replace(/\s+$/, ''));
	}
	return out;
}
const seenDisposition = {};
new Set(Object.keys(SOURCE_OF).map((f) => SOURCE_OF[f]).filter(Boolean)).forEach((inpName) => {
	const src = statedSections(fs.readFileSync(path.join(SRC_DIR, inpName), 'utf8'));
	Object.keys(src).forEach((sec) => {
		const d = src[sec].length ? DISPOSITION[sec] : 'header-only';
		ok(inpName + ' states [' + sec + '], and this page says what becomes of it', !!d,
			'add [' + sec + '] to DISPOSITION in this file with what happens to it');
		if (d) { seenDisposition[d] = (seenDisposition[d] || 0) + 1; }
	});
});
// A disposition nothing exercises is a claim nothing checks.
['structure', 'interpreted', 'carried'].forEach((d) => {
	ok('the EPA models exercise the ' + d + ' disposition', (seenDisposition[d] || 0) > 0, dump(seenDisposition));
});
done('nothing a source states is unaccounted for');

// ------------------------------------------------------------------------------------------------
// 4. AND THE CHARACTERS. Exporting a shipped example returns its source's own tokens.
// ------------------------------------------------------------------------------------------------
//
// The rule is CLAUDE.md's: a number that came from a file is the user's, and `104.` may not come
// back as `104`. Section 2 compares documents; this compares the text, which is where the curve
// loss was actually visible -- a stored curve with no `src` exports a rebuilt row.
console.log('\n4. A shipped example exports its source\'s own numbers');
PUBLISHED.filter((f) => SOURCE_OF[f]).forEach((file) => {
	openShipped(file);
	const out = L.export();
	ok(file + ' exports', out.ok === true, out && out.error);
	const src = statedSections(fs.readFileSync(path.join(SRC_DIR, SOURCE_OF[file]), 'utf8'));
	const back = statedSections(out.inp);
	// Compared as TOKEN SEQUENCES: the exporter writes its own column widths, and padding is not
	// content. What must survive is every token, `104.` and its trailing point included.
	const toks = (lines) => (lines || []).join('\n').split(/[\s\t]+/).filter(Boolean).join(' ');
	['CURVES', 'PATTERNS', 'ENERGY', 'QUALITY', 'REACTIONS', 'SOURCES', 'MIXING', 'REPORT'].forEach((sec) => {
		if (!src[sec] || !src[sec].length) { return; }
		ok(file + ' writes [' + sec + '] with its source\'s own tokens',
			toks(src[sec]) === toks(back[sec]),
			'\n     source: ' + toks(src[sec]).slice(0, 300) + '\n     shipped: ' + toks(back[sec]).slice(0, 300));
	});
	// The `;PUMP:` comment above a curve is EPANET's own way of TYPING that curve, and it carries
	// the curve's name -- the one thing the Library shows a person. A rebuilt curve loses it.
	const srcNotes = (fs.readFileSync(path.join(SRC_DIR, SOURCE_OF[file]), 'utf8')
		.match(/^;(PUMP|EFFICIENCY|VOLUME|HEADLOSS):.*$/gm) || []).map((s) => s.trim());
	const backNotes = (out.inp.match(/^;(PUMP|EFFICIENCY|VOLUME|HEADLOSS):.*$/gm) || []).map((s) => s.trim());
	ok(file + ' keeps every curve\'s own name and kind', dump(srcNotes) === dump(backNotes),
		'source ' + dump(srcNotes) + ' vs shipped ' + dump(backNotes));
});
done('the file\'s own characters come back');

console.log(fails ? '\n' + fails + ' FAILED of ' + checks : '\nall ' + checks + ' example-audit checks passed');
process.exit(fails ? 1 : 0);
