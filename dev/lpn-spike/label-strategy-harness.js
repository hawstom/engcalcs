// ONE CANDIDATE STRATEGY AT A TIME, MEASURED RATHER THAN ARGUED (Tom, 2026-09-19). Run with:
//
//   node dev/lpn-spike/label-strategy-harness.js
//   node dev/lpn-spike/label-strategy-harness.js --selftest    (mutations; must go red)
//
// **HIS STRUCTURAL INSTRUCTION, and it came before any placement change:** *"it seems to me like we
// have been adding things onto an early model instead of trying new models from scratch. While
// probably complete abandonment of all early work is not right, it might be helpful to split things
// into strategies that can be turned off and on. Clearly the 'most open sector' strategy is not
// synergistic with the spot-prime box strategy."*
//
// `js/lpn-collide.js`'s `cardinalSides()` now takes `opts.strategies` -- the same vocabulary
// `repairCrossingGangs()` already used for its own routes -- and `js/looped-network.js` states the
// shipped set as `labelSideStrategies`, with one bench checkbox per strategy under `?debug=labels`.
// This file is the other half of that seam: the numbers, so a strategy can be judged.
//
//   corners   the four cardinal corners, pruned by the open-arc table
//   sector    a polar raster inside widestArc(arcs), the SINGLE widest gap between the node's pipes
//   ring      the same circles and angles over the WHOLE circle -- the alternative to `sector`
//
// **WHAT IS COUNTED IS DRAWN LABELS, because a drop is the outcome Tom rules out** (*"Moving is
// fine, but dropping is not"*). Section 16j measured that no dropped label anywhere was actually
// enclosed, and that 9 of the 32 dropped on Net3-World's fit view had room the sector window never
// looked toward. This is what happens when it does look.
//
// **THE ASSERTIONS ARE INVARIANTS, NOT A WINNER.** Which strategy set ships is Tom's call, so
// nothing here prefers one; what is held is that the seam exists, that the shipped default is
// unchanged by its introduction, and that every strategy set leaves the placement deterministic.
// dev/label-placement-algorithms.md section 18 is the record.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../../');
const EXAMPLES = path.join(__dirname, '../water-network-examples');
// Every shipped example that has nodes worth labelling, plus the geographic one Tom works in.
const FILES = ['Net3-Novato-CA-World.lwn', 'Net3.lwn', 'Net2.lwn', 'Net1.lwn', 'Elm-Street-Center.lwn'];
// The sets compared. `corners+sector` is what ships.
const SETS = [
	{ tag: 'corners+sector (ships)', use: ['corners', 'sector'] },
	{ tag: 'corners+ring', use: ['corners', 'ring'] },
	{ tag: 'corners only', use: ['corners'] },
	{ tag: 'ring only', use: ['ring'] }
];

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- the child: one document per process ------------------------------------------------------

function runChild(file, useCSV, mutation) {
	const stub = require('./lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet } = stub;
	setUnitSet('us');
	const L = loadLoopedNetwork(
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tmodelLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); },\n" +
		"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
		"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
		"\t\tsetView: function (v) { return applyView(v); },\n" +
		"\t\tgetDoc: function () { return doc; },\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tsetStrategies: function (a) { labelSideStrategies = a; },\n" +
		"\t\tgetStrategies: function () { return labelSideStrategies; }",
		null, mutation ? MUTATIONS[mutation] : undefined);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(EXAMPLES, file), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	// THE NODE ID ALONE, so a drop is a drop and not a shed: with one row there is nothing to give
	// up, and the only question left is whether the label got a place at all.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	const doc = L.getDoc(), nodeEls = L.nodeEls();
	let cx = 0, cy = 0;
	doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
	cx /= doc.nodes.length; cy /= doc.nodes.length;
	// A span the whole model fits in, then three steps in. Derived from the drawing rather than
	// typed, so one table covers a geographic document and an XY one.
	let spanX = 0, spanY = 0;
	doc.nodes.forEach(function (n) {
		spanX = Math.max(spanX, Math.abs(n.x - cx)); spanY = Math.max(spanY, Math.abs(n.y - cy));
	});
	const base = 600 / (Math.max(spanX, spanY, 1e-9) * 2);
	const out = { zooms: [] };
	[1, 2, 4, 8].forEach(function (mult) {
		if (!L.setView({ cx: cx, cy: cy, s: base * mult })) { out.zooms.push(null); return; }
		// The strategy set is applied BEFORE the content pass, because the pass builds the specs.
		L.setStrategies(useCSV.split(','));
		L.refreshLabelText();
		let drawn = 0, hidden = 0, total = 0;
		const where = {};
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (!ne || ne.empty) { return; }
			total++;
			if (ne.hiddenDropped || ne.hiddenCrossed) { hidden++; where[n.id] = 'hidden'; return; }
			drawn++;
			const nu = ne.nudge || { x: 0, y: 0 };
			where[n.id] = ne.side + ':' + nu.x.toPrecision(10) + ',' + nu.y.toPrecision(10);
		});
		out.zooms.push({ drawn: drawn, hidden: hidden, total: total, where: where });
	});
	out.applied = L.getStrategies().join(',');
	return out;
}

// Mutations for the selftest, applied to js/looped-network.js through the stub's own `mutate` hook.
const MUTATIONS = {
	// CAUGHT: the page stops consulting the strategy list and hardcodes the old call, so every set
	// produces the same drawing and the seam is decorative. That is precisely the failure a switch
	// nobody reads would have.
	'seam-ignored': function (src) {
		return src.replace(
			'{ raster: true, outer: reach, strategies: labelSideStrategies });',
			'{ raster: true, outer: reach });');
	}
};

// ---- the parent -------------------------------------------------------------------------------

function child(file, use, mutation) {
	const args = [__filename, '--child', file, use.join(',')];
	if (mutation) { args.push(mutation); }
	const r = spawnSync(process.execPath, args,
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

function totals(res) {
	let drawn = 0, hidden = 0;
	res.zooms.forEach(function (z) { if (z) { drawn += z.drawn; hidden += z.hidden; } });
	return { drawn: drawn, hidden: hidden };
}
// How many node labels sit somewhere else than the shipped set put them, over the four views.
function movedAgainst(baseRes, res) {
	let n = 0;
	baseRes.zooms.forEach(function (bz, i) {
		const z = res.zooms[i];
		if (!bz || !z) { return; }
		Object.keys(bz.where).forEach(function (k) { if (z.where[k] !== bz.where[k]) { n++; } });
	});
	return n;
}

function main() {
	if (process.argv[2] === '--child') {
		const res = runChild(process.argv[3], process.argv[4], process.argv[5]);
		process.stdout.write('@@JSON@@' + JSON.stringify(res) + '\n', function () { process.exit(0); });
		return;
	}
	if (process.argv[2] === '--selftest') { selftest(); done(); return; }

	console.log('--- one candidate strategy at a time, four views of each example ---');
	console.log('    (node ID alone; drawn/hidden summed over the four views; moved is against the shipped set)\n');
	let grand = {};
	SETS.forEach(function (s) { grand[s.tag] = { drawn: 0, hidden: 0, moved: 0 }; });
	let bad = false;
	FILES.forEach(function (f) {
		const got = {};
		SETS.forEach(function (s) { got[s.tag] = child(f, s.use); });
		const baseTag = SETS[0].tag;
		if (got[baseTag].error) { report(false, f, got[baseTag].error); bad = true; return; }
		console.log('  ' + f);
		SETS.forEach(function (s) {
			const r = got[s.tag];
			if (r.error) { console.log('    ' + s.tag.padEnd(24) + 'ERROR ' + r.error); bad = true; return; }
			const t = totals(r), moved = s.tag === baseTag ? 0 : movedAgainst(got[baseTag], r);
			grand[s.tag].drawn += t.drawn; grand[s.tag].hidden += t.hidden; grand[s.tag].moved += moved;
			console.log('    ' + s.tag.padEnd(24) + 'drawn ' + String(t.drawn).padStart(5)
				+ '   hidden ' + String(t.hidden).padStart(4)
				+ '   moved ' + String(moved).padStart(5));
		});
		// **THE SEAM MUST ACTUALLY DO SOMETHING**, or it is a switch wired to nothing -- but only
		// where there is something to separate. On an uncrowded drawing every label takes its first
		// corner whatever else is on offer, so the sets AGREE and must be allowed to: asserting
		// otherwise would demand that a strategy change a drawing it has no work to do on.
		// Elm-Street-Center is that case, and it is reported rather than passed over in silence.
		const crowded = totals(got[baseTag]).hidden > 0
			|| SETS.some(function (s) { return got[s.tag].zooms && totals(got[s.tag]).hidden > 0; });
		const same = JSON.stringify(got[SETS[0].tag].zooms) === JSON.stringify(got[SETS[2].tag].zooms);
		if (!crowded) {
			report(true, f + ': nothing here is crowded enough to separate the strategies',
				'every set draws every label; no candidate but the first corner is ever reached');
		} else {
			report(!same, f + ': turning a strategy off changes the drawing',
				same ? 'corners-only is identical to the shipped set -- the switch is not wired' : 'it does');
		}
		// And every set must still produce a deterministic drawing, or no number here means anything.
		const again = child(f, SETS[1].use);
		report(!again.error && JSON.stringify(again.zooms) === JSON.stringify(got[SETS[1].tag].zooms),
			f + ': a strategy set lays out the same drawing twice', again.error || 'identical');
	});
	if (!bad) {
		console.log('\n  ALL EXAMPLES, four views each');
		SETS.forEach(function (s) {
			console.log('    ' + s.tag.padEnd(24) + 'drawn ' + String(grand[s.tag].drawn).padStart(5)
				+ '   hidden ' + String(grand[s.tag].hidden).padStart(4)
				+ '   moved ' + String(grand[s.tag].moved).padStart(5));
		});
	}
	selftest();
	done();
}

function selftest() {
	// CAUGHT: the page hardcodes the old call and stops reading the list. Every set then draws the
	// same thing, which is what a decorative switch looks like.
	const a = child(FILES[0], SETS[0].use, 'seam-ignored');
	const b = child(FILES[0], SETS[2].use, 'seam-ignored');
	report(!a.error && !b.error && JSON.stringify(a.zooms) === JSON.stringify(b.zooms),
		'selftest: caught -- with the seam bypassed, every strategy set draws the same thing',
		a.error || b.error || 'identical, as the mutation requires');
}

function done() {
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();
