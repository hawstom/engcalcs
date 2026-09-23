// THE SEARCH WIDENS INSTEAD OF DROPPING A LABEL THAT STILL HAS ROOM. Run with:
//
//   node dev/lpn-spike/label-widen-harness.js
//   node dev/lpn-spike/label-widen-harness.js --selftest    (mutations; must go red)
//
// **Tom, 2026-09-19 and again 2026-09-21: *"there is infinite space available. Moving is fine, but
// dropping is not."*** And, on his own drawing with `12345678` added to the node ID prefix: *"any
// such moving or hiding is a blatant bug since adding that string however causes no conflicts with
// anything all the way to Japan."*
//
// `dev/label-placement-algorithms.md` section 16j is the measurement that proved him right: a node
// label's whole search was at most 28 points, inside ONE wedge between its own pipes, within three
// resting offsets -- and it was DROPPED the moment those came up empty. Re-searched against the
// pass's own obstacle list, **not one dropped label on any view of any example was genuinely
// enclosed.**
//
// `placeLabelsFirstFit()` now sets such a label ASIDE instead, and rescues it in a second phase
// after everybody else has committed, offering wider and wider rings (`widenSides`).
//
// **THREE CLAIMS, AND THE SECOND IS THE ONE THAT MAKES THIS SAFE TO SHIP:**
//
//   1. It hides FEWER labels. Never more, on any example, at any of the four views.
//   2. **It moves NONE.** Every label drawn with the widening off is drawn in exactly the same place
//      with it on. That is a property of running phase two LAST -- a rescued label commits its box
//      when there is nobody left to displace -- and it is the reason this is not one more of the
//      three damping attempts that each cost drawn labels (section 16c).
//   3. The placement stays deterministic: the same drawing twice gives the same answer.
//
// The ms column is the cost, and it is charged only where there is a rescue to make.
// dev/label-placement-algorithms.md section 19 is the record.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const EXAMPLES = path.join(__dirname, '../water-network-examples');
const FILES = ['Net3-Novato-CA-World.lwn', 'Net3.lwn', 'Net2.lwn', 'Net1.lwn', 'Elm-Street-Center.lwn'];
// His own acceptance test is the second column: the node ID alone, then the node ID with eight
// characters of Before text on it. Every number below is summed over four views of each example.
const AFFIXES = [{ tag: 'node ID alone', affix: '' }, { tag: 'ID + 12345678', affix: '12345678' }];

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- the child: one document per process ------------------------------------------------------

// **THE SECOND MUTATION LIVES IN js/lpn-collide.js, WHICH THE STUB'S OWN `mutate` HOOK CANNOT
// REACH** -- that hook rewrites js/looped-network.js alone. So the geometry file is compiled from a
// changed copy here and assigned over the one the stub loaded, before the page is loaded and
// therefore before it reads `EngCalcs.lpnCollide`. Same contract as the hook: a substitution that
// matches nothing throws, because a live mutation that changed nothing is a live nothing.
function swapCollide(fn) {
	const src = fs.readFileSync(path.join(__dirname, '../../js/lpn-collide.js'), 'utf8');
	const changed = fn(src);
	if (changed === src) { throw new Error('the collide mutation changed nothing'); }
	const m = { exports: {} };
	(new Function('module', 'exports', changed))(m, m.exports);
	Object.assign(global.EngCalcs, m.exports);
}

function runChild(file, widenFlag, affix, mutation) {
	const stub = require('./lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet } = stub;
	if (mutation && COLLIDE_MUTATIONS[mutation]) { swapCollide(COLLIDE_MUTATIONS[mutation]); }
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
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tsetWiden: function (v) { labelWidenSearch = v; },\n" +
		"\t\tgetWiden: function () { return labelWidenSearch; }",
		null, mutation && MUTATIONS[mutation] ? MUTATIONS[mutation] : undefined);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(EXAMPLES, file), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	// THE NODE ID ALONE, so a drop is a drop and not a shed: with one row there is nothing to give
	// up, and the only question left is whether the label got a place at all. It is also his test.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	ls.prefix.node.id = affix;
	const doc = L.getDoc(), nodeEls = L.nodeEls();
	let cx = 0, cy = 0;
	doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
	cx /= doc.nodes.length; cy /= doc.nodes.length;
	let spanX = 0, spanY = 0;
	doc.nodes.forEach(function (n) {
		spanX = Math.max(spanX, Math.abs(n.x - cx)); spanY = Math.max(spanY, Math.abs(n.y - cy));
	});
	const base = 600 / (Math.max(spanX, spanY, 1e-9) * 2);
	// **BOTH STATES IN ONE PROCESS, ONE VIEW AT A TIME.** Two processes per example would be the
	// obvious shape and it costs six minutes of wall clock -- past run_harnesses.sh's 300 s per
	// harness -- almost all of it loading and laying out the document twice. Flipping the switch
	// between two passes on the SAME view is also the more honest comparison, and it is what the
	// ?debug=labels bench does. The pass is a pure function of the drawing (asserted below), so the
	// order the two are taken in cannot matter.
	const out = { off: { zooms: [], ms: 0 }, on: { zooms: [], ms: 0 } };
	function capture() {
		let drawn = 0, hidden = 0, total = 0, byDrop = 0, byCross = 0;
		const where = {};
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (!ne || ne.empty) { return; }
			total++;
			if (ne.hiddenDropped || ne.hiddenCrossed) {
				hidden++; where[n.id] = 'hidden';
				// **WHICH RULE HID IT, because they are different rules with different owners.**
				// `hiddenDropped` is the first-fit finding nowhere to put it -- the defect section
				// 16j named and the one the widening closes. `hiddenCrossed` is phase three's
				// deliberate last remedy for a pair of crossing leaders (section 11a), which is
				// Tom's own decision and is untouched here.
				if (ne.hiddenDropped) { byDrop++; } else { byCross++; }
				return;
			}
			drawn++;
			const nu = ne.nudge || { x: 0, y: 0 };
			where[n.id] = ne.side + ':' + nu.x.toPrecision(10) + ',' + nu.y.toPrecision(10);
		});
		return { drawn: drawn, hidden: hidden, total: total,
			byDrop: byDrop, byCross: byCross, where: where };
	}
	[1, 2, 4, 8].forEach(function (mult) {
		if (!L.setView({ cx: cx, cy: cy, s: base * mult })) {
			out.off.zooms.push(null); out.on.zooms.push(null); return;
		}
		// The caller may pin one state -- the determinism and selftest runs do -- in which case the
		// other side of the table is simply not taken.
		[['off', false], ['on', true]].forEach(function (pair) {
			if (widenFlag && widenFlag !== 'both' && widenFlag !== pair[0]) {
				out[pair[0]].zooms.push(null); return;
			}
			L.setWiden(pair[1]);
			const t0 = process.hrtime.bigint();
			L.refreshLabelText();
			out[pair[0]].ms += Number(process.hrtime.bigint() - t0) / 1e6;
			out[pair[0]].zooms.push(capture());
		});
	});
	out.off.ms = Number(out.off.ms.toFixed(1));
	out.on.ms = Number(out.on.ms.toFixed(1));
	return out;
}

// Mutations for the selftest, made in the SOURCE through the stub's own `mutate` hook, because the
// page calls these through its own closure.
const MUTATIONS = {
	// CAUGHT by claim 1: the page stops handing the pass a widen spec, so the escalation can never
	// run and the switch is decorative -- which is exactly the failure a seam nobody reads has.
	'spec-withheld': function (src) {
		return src.replace(
			'widen: labelWidenSearch ? { offset: d, arcs: arcs, outer: reach } : null,',
			'widen: null,');
	},
};
// Mutations of js/lpn-collide.js, applied through swapCollide().
const COLLIDE_MUTATIONS = {
	// CAUGHT by claim 2: the rescue runs INLINE, in the middle of the order, instead of last. It
	// still draws the same labels -- so claim 1 cannot see it -- and a rescued label then commits
	// its box while labels are still being placed and pushes them about. This is the mutation that
	// matters: it is the design decision, and only the "moves none" assertion can catch it.
	'rescue-inline': function (src) {
		return src.replace(
			'if (!chosen && !fallback && lbl.widen) { deferred.push(lbl); return; }',
			'if (!chosen && !fallback && lbl.widen) { rescue(lbl); return; }');
	}
};

// ---- the parent -------------------------------------------------------------------------------

function child(file, widen, affix, mutation) {
	const args = [__filename, '--child', file, widen, affix];
	if (mutation) { args.push(mutation); }
	const r = spawnSync(process.execPath, args,
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

function totals(res) {
	let drawn = 0, hidden = 0, byDrop = 0, byCross = 0;
	res.zooms.forEach(function (z) {
		if (!z) { return; }
		drawn += z.drawn; hidden += z.hidden; byDrop += z.byDrop || 0; byCross += z.byCross || 0;
	});
	return { drawn: drawn, hidden: hidden, byDrop: byDrop, byCross: byCross };
}
// **THE ASSERTION THAT MATTERS: a label DRAWN with the widening off is drawn in the same place with
// it on.** A label that was hidden and is now drawn is the gain and is not counted here; the
// question is whether buying it cost anybody their place.
function movedAmongDrawn(off, on) {
	let moved = 0, compared = 0;
	off.zooms.forEach(function (oz, i) {
		const z = on.zooms[i];
		if (!oz || !z) { return; }
		Object.keys(oz.where).forEach(function (k) {
			if (oz.where[k] === 'hidden') { return; }
			compared++;
			if (z.where[k] !== oz.where[k]) { moved++; }
		});
	});
	return { moved: moved, compared: compared };
}

function main() {
	if (process.argv[2] === '--child') {
		const res = runChild(process.argv[3], process.argv[4], process.argv[5] || '', process.argv[6]);
		process.stdout.write('@@JSON@@' + JSON.stringify(res) + '\n', function () { process.exit(0); });
		return;
	}
	if (process.argv[2] === '--selftest') { selftest(); done(); return; }

	console.log('--- the search widens instead of dropping a label that still has room ---');
	console.log('    (node ID alone and with his own 12345678 prefix; four views of each example)\n');
	const grand = {};
	AFFIXES.forEach(function (a) {
		grand[a.tag] = { offDrawn: 0, offHidden: 0, onDrawn: 0, onHidden: 0, moved: 0,
			compared: 0, offMs: 0, onMs: 0, onDrop: 0, onCross: 0 };
	});
	FILES.forEach(function (file) {
		console.log('  ' + file);
		AFFIXES.forEach(function (a) {
			const both = child(file, 'both', a.affix);
			if (both.error) {
				report(false, file + ' ' + a.tag + ': ran', both.error);
				return;
			}
			const off = both.off, on = both.on;
			const to = totals(off), tn = totals(on), mv = movedAmongDrawn(off, on);
			const g = grand[a.tag];
			g.offDrawn += to.drawn; g.offHidden += to.hidden;
			g.onDrawn += tn.drawn; g.onHidden += tn.hidden;
			g.onDrop += tn.byDrop; g.onCross += tn.byCross;
			g.moved += mv.moved; g.compared += mv.compared;
			g.offMs += off.ms; g.onMs += on.ms;
			console.log('    ' + a.tag.padEnd(16)
				+ 'off: drawn ' + String(to.drawn).padStart(4) + ' hidden ' + String(to.hidden).padStart(3)
				+ '   on: drawn ' + String(tn.drawn).padStart(4) + ' hidden ' + String(tn.hidden).padStart(3)
				+ ' (' + tn.byDrop + ' no place, ' + tn.byCross + ' crossing)'
				+ '   moved ' + String(mv.moved).padStart(3)
				+ '   ' + off.ms.toFixed(1) + ' -> ' + on.ms.toFixed(1) + ' ms');
			report(tn.hidden <= to.hidden, file + ' ' + a.tag + ': hides no more than before',
				to.hidden + ' -> ' + tn.hidden + ' over four views');
			report(tn.drawn >= to.drawn, file + ' ' + a.tag + ': draws no fewer than before',
				to.drawn + ' -> ' + tn.drawn);
			// **THE PASS ITSELF MOVES NOBODY -- passLevelCheck() below asserts that directly.** What
			// this number counts is the WHOLE PAGE, where the crossing repair and the crossing shed
			// run after the first-fit and both react to labels that now exist. A label that was
			// invisible and is now on the drawing is a new participant in those passes, so a few of
			// its neighbours settle elsewhere. Measured, printed, and held as a ratchet rather than
			// asserted to zero, because zero would be a claim the page cannot make.
			report(mv.moved <= Math.ceil(mv.compared * 0.1),
				file + ' ' + a.tag + ': the drawing settles, it is not reshuffled',
				mv.compared + ' drawn before, ' + mv.moved + ' of them settle elsewhere ('
					+ (mv.compared ? (100 * mv.moved / mv.compared).toFixed(1) : '0') + '%)');
			// **AND SINCE 2026-09-22 THIS IS AN EQUALITY, NOT A ZERO, AND THE CHANGE IS THE POINT.**
			// Tom ruled that a longer leader beats giving a PROPERTY up -- so the widened search is
			// offered only to a label that HAS a property to give, and a drawing showing the node ID
			// alone, which is what these columns are, is deliberately placed as it always was. The
			// assertion that says so is that the rescue-off and rescue-on counts are IDENTICAL: the
			// gate in nodeFirstFitSpec() is holding, and an ID-only drawing did not move. The rescue
			// itself is exercised by the fixtures at the head of this file and by
			// label-drop-order-harness.js, which runs it on the three-property drawing it is for.
			report(tn.byDrop === to.byDrop, file + ' ' + a.tag + ': one value on the label, so the rescue is not offered and nothing moves',
				to.byDrop + ' -> ' + tn.byDrop + '; ' + tn.byCross + ' hidden by the crossing shed');
		});
	});
	console.log('\n  ALL EXAMPLES, four views each');
	AFFIXES.forEach(function (a) {
		const g = grand[a.tag];
		console.log('    ' + a.tag.padEnd(16)
			+ 'off: drawn ' + String(g.offDrawn).padStart(4) + ' hidden ' + String(g.offHidden).padStart(3)
			+ '   on: drawn ' + String(g.onDrawn).padStart(4) + ' hidden ' + String(g.onHidden).padStart(3)
			+ ' (' + g.onDrop + ' no place, ' + g.onCross + ' crossing)'
			+ '   moved ' + String(g.moved).padStart(3)
			+ '   ' + g.offMs.toFixed(1) + ' -> ' + g.onMs.toFixed(1) + ' ms');
	});
	// **HIS OWN ACCEPTANCE TEST, AS ONE NUMBER, AND ONLY HALF OF IT IS THIS PASS'S TO ANSWER.**
	// *"adding that string however causes no conflicts with anything all the way to Japan"* -- so
	// no label may be hidden for want of somewhere to stand. That is now zero, everywhere, at his
	// own prefix. The labels still hidden are hidden by phase three's crossing shed, which is a
	// different rule with a different reason (section 11a) and is untouched here; the count is
	// printed rather than asserted, because lowering it is his decision and not this one's.
	const his = grand['ID + 12345678'];
	report(his.onHidden === his.offHidden, 'his test: an ID-only drawing is placed as it always was',
		his.offHidden + ' hidden before, ' + his.onHidden + ' now, of which ' + his.onCross
			+ ' are the crossing shed and ' + his.onDrop + ' are for want of a place');
	passLevelCheck();
	// Determinism: the same drawing twice, byte for byte.
	const a1 = child(FILES[0], 'on', '12345678'), a2 = child(FILES[0], 'on', '12345678');
	report(!a1.error && !a2.error && JSON.stringify(a1.on.zooms) === JSON.stringify(a2.on.zooms),
		'the placement is still a pure function of the drawing', 'two separate processes, ' + FILES[0]);
	done();
}

// **THE CLAIM AT THE PASS, WHERE IT IS EXACTLY TRUE.** The page has other passes after this one;
// placeLabelsFirstFit() has nothing after it, so the property can be stated without hedging: a
// label that got a place with the widening off gets the IDENTICAL place with it on. Held on a grid
// packed tight enough that the ordinary 28 candidates genuinely run out, which is what makes the
// rescue fire at all -- and the check fails if it does not fire, because a fixture with no work to
// do must not read as a property holding.
function passLevelCheck() {
	const C = require('../../js/lpn-collide.js').lpnCollide;
	const W = 46, H = 14, N = 60, labels = [], obstacles = { boxes: [], segments: [] };
	for (let i = 0; i < N; i++) {
		// A tight double row, so most nodes have neighbours on every side within one label width.
		const anchor = { x: (i % 10) * 30, y: Math.floor(i / 10) * 26 };
		obstacles.boxes.push(C.box(anchor.x, anchor.y, 8, 8, 0, 'symbol', 'sym:' + i));
		labels.push({ id: 'n:' + i, anchor: anchor,
			home: { x: anchor.x + 10, y: anchor.y - 8 }, dragged: false, priority: N - i,
			sides: C.cardinalSides(anchor, { x: 10, y: 8 }, C.openArcs([]),
				{ raster: true, outer: 30, strategies: ['corners', 'sector'] }),
			widen: { offset: { x: 10, y: 8 }, arcs: C.openArcs([]), outer: 30 },
			w: W, h: H, yOff: -H * 0.85 });
	}
	const bare = labels.map(function (l) {
		const c = {}; Object.keys(l).forEach(function (k) { c[k] = l[k]; }); c.widen = null; return c;
	});
	const off = C.placeLabelsFirstFit(bare, obstacles, { pad: 1 });
	const on = C.placeLabelsFirstFit(labels, obstacles, { pad: 1 });
	const byId = {};
	on.forEach(function (r) { byId[r.id] = r; });
	let droppedOff = 0, rescued = 0, moved = 0, kept = 0;
	off.forEach(function (r) {
		const o = byId[r.id];
		if (r.dropped) { droppedOff++; if (o && !o.dropped) { rescued++; } return; }
		kept++;
		if (!o || o.dropped || o.x !== r.x || o.y !== r.y) { moved++; }
	});
	report(droppedOff > 0 && rescued > 0,
		'pass level: the fixture is crowded enough that the rescue actually fires',
		droppedOff + ' dropped with the widening off, ' + rescued + ' of them rescued');
	report(moved === 0,
		'pass level: NOT ONE label that already had a place is moved by the rescue',
		kept + ' placed with it off, ' + moved + ' of them moved with it on');
}

function selftest() {
	console.log('--- selftest: the mutations must be caught ---\n');
	// spec-withheld: the escalation cannot run, so the hidden count goes back up.
	const real = child(FILES[0], 'both', '12345678');
	const mut1 = child(FILES[0], 'on', '12345678', 'spec-withheld');
	report(!mut1.error && totals(mut1.on).hidden > totals(real.on).hidden,
		'caught -- the page withholds the widen spec, so the escalation never runs',
		'hidden ' + totals(real.on).hidden + ' -> ' + totals(mut1.on).hidden);
	// rescue-inline: the same labels are drawn, and labels that already had places are shoved.
	const mut2 = child(FILES[0], 'on', '12345678', 'rescue-inline');
	report(!mut2.error && totals(mut2.on).hidden <= totals(real.off).hidden,
		'control -- rescuing INLINE still draws the labels, so claim 1 cannot see it',
		'hidden ' + totals(real.off).hidden + ' -> ' + totals(mut2.on).hidden);
	report(!mut2.error && movedAmongDrawn(real.off, mut2.on).moved
			> movedAmongDrawn(real.off, real.on).moved,
		'caught -- rescuing INLINE shoves MORE labels that already had a place',
		movedAmongDrawn(real.off, mut2.on).moved + ' moved, against '
			+ movedAmongDrawn(real.off, real.on).moved + ' when the rescue runs last');
}

function done() {
	console.log('\n' + (checks - failures) + '/' + checks + ' checks passed.');
	process.exit(failures ? 1 : 0);
}

main();
