// HOW MANY LEADERS CROSS, AND HOW MANY LABELS LIE ACROSS SOMEBODY ELSE'S LEADER (Task 539, phase
// one). Run with:
//
//   node dev/lpn-spike/label-crossing-harness.js
//   node dev/lpn-spike/label-crossing-harness.js --fixtures     (the pure cases alone, no examples)
//   node dev/lpn-spike/label-crossing-harness.js --measure <file.lwn>   (one example, JSON out)
//
// **THIS PHASE MEASURES AND MOVES NOTHING.** Tom, 2026-08-26, with a screenshot of two node labels
// whose leaders cross: *"This might be forgiveable if it looked difficult or impossible. But when it
// looks so easy (to a human) to resolve, it's embarrassing."* And in the same breath: *"I don't want
// to be forever tweaking this."* So the first thing built is the number -- how big the problem
// actually is on the drawings we already ship -- before anybody optimises anything. The gang-move
// optimiser is phase two and is deliberately absent.
//
// WHAT IS ASSERTED, and the order matters:
//
//   1. THE PURE CASES. Collide.labelCrossings() finds a hand-built crossing pair, finds a hand-built
//      label-on-leader, and reports NOTHING on a hand-built clean pair. Plus the three ways it could
//      quietly report the wrong thing: counting a label's own leader (a constant on every drawing),
//      reading a stacked label as one block instead of its rows, and splitting one three-label gang
//      into two pairs.
//   2. THE LIVE COUNT, on every shipped example, at four zooms each. **NO BOUND IS ASSERTED ON IT
//      beyond "it ran and it is finite"** -- the spread across examples and zooms is the finding,
//      and a threshold invented here would be a number nobody chose. The counts are PRINTED, and
//      the ones that matter are copied into the Task 539 block.
//
// **THE SAMPLE IS THE DRAWN LABELS, ASSEMBLED FROM FOUR SOURCES, and leaving one out understates
// the answer.** A "placement" here is a box (or a staircase of rows) plus the leader the renderer
// actually drew for it:
//
//   * node data labels        -- placeLabelsFirstFit()'s result, dropped ones excluded
//   * free link data labels   -- placeLabels()'s result (dragged labels of either kind ride here too)
//   * aligned/stationed link labels -- committed straight onto the caller's obstacle list by
//                                placeStationedLabels(); they never reach a placement pass, and they
//                                draw NO leader, which is exactly why the second trigger needs them:
//                                a rotated pipe label lying across a node label's leader is invisible
//                                to a leader-versus-leader test.
//   * Text objects            -- the user's own annotations, obstacles to everything and movable by
//                                nobody, but they carry leaders and boxes and so can be either half
//                                of a crossing.
//
// **THE LEADER COMES FROM THE DOM, NOT FROM THE PLACEMENT RESULT, and that is the coupling this
// harness must not stub away** (dev/testing-notes.md). placeLabels() returns a leader segment for
// every label it places; the renderer then HIDES it when the label is nearer its anchor than
// leaderThreshold(). Counting the returned segments would therefore count leaders no reader can
// see -- a bigger number about a drawing that does not exist. updateDataLeader() is the only place
// the answer exists, and it writes it onto the element.
//
// **ONE EXAMPLE PER PROCESS.** shedAlignedForConflicts() seeds node labels as obstacles where the
// LAST layout placed them, so the pass converges ACROSS passes and two loads in one process would
// contaminate each other (ROADMAP Task 436). The parent run spawns `--measure` once per file.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const EXAMPLES = path.join(HERE, '../water-network-examples');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ================================================================================================
// 1. THE PURE CASES
// ================================================================================================
function runFixtures() {
	const Collide = require(path.join(HERE, '../../js/lpn-collide.js')).lpnCollide;
	const seg = Collide.segment, box = Collide.box;

	console.log('\n--- fixtures: two leaders that cross ---');
	{
		// An X at (5,5). The two boxes hang off opposite ends and are nowhere near each other, so
		// the ONLY thing wrong with this picture is the crossing -- which is the case Tom
		// photographed.
		const r = Collide.labelCrossings([
			{ id: 'a', box: box(14, 12, 8, 4, 0), leader: seg(0, 0, 10, 10) },
			{ id: 'b', box: box(-4, 12, 8, 4, 0), leader: seg(10, 0, 0, 10) }
		]);
		report(r.counts.leaderCross === 1, 'the crossing is found', JSON.stringify(r.leaderPairs));
		report(r.counts.labelOnLeader === 0, '...and nothing else is claimed');
		report(r.counts.gangs === 1 && r.gangs[0].length === 2, 'the pair is one gang of two');
	}

	console.log('\n--- fixtures: a label lying across somebody else’s leader ---');
	{
		// **THE TRIGGER THE FIRST ONE WOULD MISS.** These two leaders do not come close to each
		// other; B's runs straight through A's box. Tom named this second trigger himself, and it is
		// just as ugly on the page.
		const r = Collide.labelCrossings([
			{ id: 'a', box: box(20, 0, 10, 4, 0), leader: seg(0, 0, 15, 0) },
			{ id: 'b', box: box(20, 22, 8, 4, 0), leader: seg(20, -20, 20, 20) }
		]);
		report(r.counts.leaderCross === 0, 'no leader crossing here, and none is reported');
		report(r.counts.labelOnLeader === 1 && r.labelOnLeader[0].label === 'a'
			&& r.labelOnLeader[0].leader === 'b',
			'a’s box is crossed by b’s leader', JSON.stringify(r.labelOnLeader[0]));
		report(r.counts.pairs === 1 && r.counts.gangs === 1,
			'the two triggers feed one pair list, so this is also one gang');
	}

	console.log('\n--- fixtures: a clean pair, which must NOT be reported ---');
	{
		// Two parallel leaders, boxes well apart: the picture a gang move is trying to PRODUCE. A
		// detector that flags this one would send phase two chasing layouts that are already right.
		const r = Collide.labelCrossings([
			{ id: 'a', box: box(14, -12, 8, 4, 0), leader: seg(0, 0, 10, -10) },
			{ id: 'b', box: box(14, 8, 8, 4, 0), leader: seg(0, 20, 10, 10) }
		]);
		report(r.counts.leaderCross === 0 && r.counts.labelOnLeader === 0 && r.counts.gangs === 0,
			'nothing reported on a clean pair', JSON.stringify(r.counts));
		report(r.counts.labels === 2 && r.counts.leaders === 2,
			'...and it did look at both of them', JSON.stringify(r.counts));
	}

	console.log('\n--- fixtures: the three ways it could report the wrong thing ---');
	{
		// (a) A LABEL'S OWN LEADER IS NEVER COUNTED. It stops at the box's near edge by
		// construction, so counting it would add the same constant to every drawing and the number
		// would say nothing about the layout.
		const own = Collide.labelCrossings([
			{ id: 'a', box: box(14, 0, 8, 4, 0), leader: seg(0, 0, 10, 0) },
			{ id: 'far', box: box(500, 500, 8, 4, 0), leader: seg(480, 500, 496, 500) }
		]);
		report(own.counts.labelOnLeader === 0 && own.counts.leaderCross === 0,
			'a leader landing on its own box is not a crossing', JSON.stringify(own.counts));

		// (b) THE STAIRCASE, NOT THE BLOCK (Task 406). A stacked label reserves one box per ROW, and
		// a leader through the gap beside a short row is through nothing at all.
		const rows = [box(20, 0, 20, 4, 0), box(14, 5, 8, 4, 0)];
		const stair = Collide.labelCrossings([
			{ id: 'a', boxes: rows, leader: seg(0, 0, 9, 0) },
			{ id: 'b', box: box(60, 60, 8, 4, 0), leader: seg(30, -20, 30, 20) }
		]);
		report(stair.counts.labelOnLeader === 1,
			'a leader through ONE row of a stacked label counts once, not once per row',
			JSON.stringify(stair.labelOnLeader));
		const notch = Collide.labelCrossings([
			{ id: 'a', boxes: rows, leader: seg(0, 0, 9, 0) },
			{ id: 'b', box: box(60, 60, 8, 4, 0), leader: seg(19, 5, 40, 5) }
		]);
		report(notch.counts.labelOnLeader === 0,
			'...and a leader in the notch beside the short row hits nothing, because the block is '
			+ 'not the geometry', JSON.stringify(notch.counts));

		// (c) A GANG IS A COMPONENT, NOT A PAIR, AND THE TWO TRIGGERS FEED ONE GRAPH. Tom's cluster D
		// is three labels competing for one open sector; reporting it as separate pairs would have
		// phase two move them in twos and undo itself. Here a and b cross leaders, and c -- which
		// draws no leader of its own -- sits on top of the crossing point, so it is joined to both by
		// the OTHER trigger.
		const chain = Collide.labelCrossings([
			{ id: 'a', box: box(14, 12, 8, 4, 0), leader: seg(0, 0, 10, 10) },
			{ id: 'b', box: box(-4, 12, 8, 4, 0), leader: seg(10, 0, 0, 10) },
			{ id: 'c', box: box(5, 5, 4, 2, 0), leader: null }
		]);
		report(chain.counts.leaderCross === 1 && chain.counts.labelOnLeader === 2,
			'one leader crossing and two labels-on-leaders', JSON.stringify(chain.counts));
		report(chain.counts.gangs === 1 && chain.gangs[0].length === 3,
			'...which is ONE gang of three, not three findings', JSON.stringify(chain.gangs));

		// (d) A DROPPED LABEL IS NOT ON THE MAP. placeLabelsFirstFit() returns it with a null box,
		// and a label nobody can see cannot be in a crossing.
		const dropped = Collide.labelCrossings([
			{ id: 'a', box: box(14, 12, 8, 4, 0), leader: seg(0, 0, 10, 10) },
			{ id: 'gone', box: null, leader: null }
		]);
		report(dropped.counts.labels === 1, 'a dropped label is not counted at all',
			JSON.stringify(dropped.counts));
	}
}

// ================================================================================================
// 2. ONE EXAMPLE, MEASURED
// ================================================================================================
async function measure(file) {
	const stub = require('./lpn-dom-stub.js');
	const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
	const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

	// ---- capture the two placement passes ------------------------------------------------------
	// The same wrapping node-shed-harness.js uses, and for the same reason: everything this needs is
	// already computed inside runLabelCollisionAvoidance(), and reaching it any other way means
	// either editing js/looped-network.js or recomputing geometry that could then drift from what
	// the drawing used.
	let lastFirstFit = null, lastRing = null, lastObs = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obs, opts) {
		const out = realFF.call(this, labels, obs, opts);
		lastFirstFit = out;
		return out;
	};
	const realRing = Collide.placeLabels;
	Collide.placeLabels = function (labels, obs, opts) {
		lastObs = obs;
		const out = realRing.call(this, labels, obs, opts);
		lastRing = out;
		return out;
	};

	setUnitSet('us');
	const L = loadLoopedNetwork(
		// init()'s own layer order, so a geographic project draws where the page draws it.
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
		"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
		"\t\tscale: function () { return state.s; },\n" +
		"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tlinkEls: function () { return linkEls; },\n" +
		"\t\tlabelEls: function () { return labelEls; }"
	);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(EXAMPLES, file), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	// EVERY FIELD ON, which is the crowded end of what a user can ask for and the state Tom's own
	// screenshots were taken in. A drawing with two fields per label has fewer conflicts and would
	// flatter the number.
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });

	// **SOLVED NUMBERS, THROUGH THE REAL ENGINE.** A node label carries head and pressure only once
	// a solve has produced them, and a label with two fewer rows is a smaller box: measuring the
	// unsolved drawing would count crossings on labels no visitor sees.
	await warmEpanet();
	L.settings().engine = 'epanet';
	L.runSolve();
	await settleEpanet();

	const doc = L.getDoc(), nodeEls = L.nodeEls(), linkEls = L.linkEls(), labelEls = L.labelEls();

	// The leader AS DRAWN. Two independent hides: updateDataLeader() sets `display` when the label
	// is nearer its anchor than leaderThreshold(), and setLabelAssemblyHidden() sets `visibility`
	// when the whole assembly is out.
	function drawnLeader(holder) {
		const e = holder && holder.leader;
		if (!e) { return null; }
		if (e.style.display === 'none' || e.style.visibility === 'hidden') { return null; }
		const x1 = Number(e.getAttribute('x1')), y1 = Number(e.getAttribute('y1')),
			x2 = Number(e.getAttribute('x2')), y2 = Number(e.getAttribute('y2'));
		if (![x1, y1, x2, y2].every(isFinite)) { return null; }
		return Collide.segment(x1, y1, x2, y2, 'leader');
	}
	function assemblyShown(holder) {
		return !!holder && !!holder.text && holder.text.style.visibility !== 'hidden';
	}

	function placements() {
		const out = [];
		// (i) node labels, and (ii) the ring pass's free/dragged labels. Both name their holder by
		// the same 'n:'/'l:' key the editor uses, so one lookup serves both.
		function holderFor(id) {
			const bare = id.slice(2);
			return id.charAt(0) === 'n' ? nodeEls[bare] : linkEls[bare];
		}
		[lastFirstFit, lastRing].forEach(function (set) {
			(set || []).forEach(function (r) {
				if (r.dropped || !(r.box || (r.boxes && r.boxes.length))) { return; }
				const h = holderFor(r.id);
				if (!assemblyShown(h)) { return; }
				out.push({ id: r.id, boxes: (r.boxes && r.boxes.length) ? r.boxes : [r.box],
					leader: drawnLeader(h) });
			});
		});
		// (iii) the aligned/stationed link labels and (iv) the Text objects, both of which reach the
		// drawing as OBSTACLES rather than as placements. staticObstacles() pushes the Text boxes
		// first (in doc.labels order, one per label that has an element) and placeStationedLabels()
		// stamps every box of its own with `linkOwner` -- which is what tells the two apart here.
		// The count is asserted below rather than trusted: if either of those two pushes ever gains
		// a third kind of `label` box, this attribution is what breaks, and silently.
		const textBoxes = [], byLink = {};
		((lastObs && lastObs.boxes) || []).forEach(function (b) {
			if (b.kind !== 'label') { return; }
			if (b.linkOwner === undefined) { textBoxes.push(b); return; }
			if (!byLink[b.linkOwner]) { byLink[b.linkOwner] = []; }
			byLink[b.linkOwner].push(b);
		});
		const textLabels = doc.labels.filter(function (lb) { return !!labelEls[lb.id]; });
		if (textBoxes.length !== textLabels.length) {
			throw new Error('label-crossing-harness: ' + textBoxes.length + ' unowned `label` boxes '
				+ 'against ' + textLabels.length + ' Text objects with elements. The attribution '
				+ 'above reads Text boxes as the unowned ones in doc.labels order; something now '
				+ 'pushes a third kind. Fix the attribution -- do not relax the check.');
		}
		textLabels.forEach(function (lb, i) {
			out.push({ id: 't:' + lb.id, boxes: [textBoxes[i]], leader: drawnLeader(labelEls[lb.id]) });
		});
		Object.keys(byLink).forEach(function (id) {
			if (!assemblyShown(linkEls[id])) { return; }
			out.push({ id: 'l:' + id, boxes: byLink[id], leader: drawnLeader(linkEls[id]) });
		});
		return out;
	}

	// The zoom ladder, per example rather than absolute: fit the drawing, then read it at the fit
	// scale and three steps in. A fixed set of scales means something different on Net1 (a few
	// hundred feet across) than on a geographic Net3, and the crossings we are counting are what a
	// reader meets at a working zoom, not at one number of feet per pixel.
	L.zoomExtent();
	const sFit = L.scale();
	let cx = 0, cy = 0;
	doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
	cx /= doc.nodes.length; cy /= doc.nodes.length;

	const rows = [];
	[1, 2, 4, 8].forEach(function (mult) {
		if (!L.setView({ cx: cx, cy: cy, s: sFit * mult })) { return; }
		L.refreshLabelText();     // the page's own content-then-layout pass
		const r = Collide.labelCrossings(placements());
		rows.push({ zoom: mult, s: sFit * mult, counts: r.counts,
			gangs: r.gangs.map(function (g) { return g.join('+'); }) });
	});
	return { file: file, rows: rows };
}

// ================================================================================================
// the runner
// ================================================================================================
async function main() {
	const arg = process.argv[2];
	if (arg === '--measure') {
		const out = await measure(process.argv[3]);
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n');
		return;
	}
	runFixtures();
	if (arg === '--fixtures') {
		console.log(`\n${checks - failures}/${checks} checks passed (fixtures only).`);
		process.exit(failures ? 1 : 0);
	}

	console.log('\n--- the live count, one example per process ---');
	console.log('    (zoom 1 is zoom-to-fit; 2/4/8 are steps in from it, centred on the network)');
	const files = fs.readdirSync(EXAMPLES).filter(function (f) { return /\.lwn$/.test(f); }).sort();
	report(files.length > 0, 'there are examples to measure', files.length + ' file(s)');
	let measured = 0;
	files.forEach(function (f) {
		const run = spawnSync(process.execPath, [__filename, '--measure', f],
			{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
		const line = (run.stdout || '').split('\n').find(function (l) { return l.indexOf('@@JSON@@') === 0; });
		if (run.status !== 0 || !line) {
			report(false, 'measured ' + f, (run.stderr || '').split('\n').slice(-6).join(' | '));
			return;
		}
		measured++;
		const out = JSON.parse(line.slice('@@JSON@@'.length));
		console.log('  ' + f);
		out.rows.forEach(function (r) {
			const c = r.counts;
			console.log('    zoom x' + r.zoom + '  ' + String(c.labels).padStart(4) + ' labels, '
				+ String(c.leaders).padStart(4) + ' with leaders  ->  '
				+ String(c.leaderCross).padStart(3) + ' leader crossings, '
				+ String(c.labelOnLeader).padStart(3) + ' label-on-leader, '
				+ String(c.pairs).padStart(3) + ' pairs in ' + String(c.gangs).padStart(3) + ' gangs');
		});
		// **NO BOUND, ON PURPOSE.** What is asserted is that the measurement HAPPENED and is finite;
		// the size of the number is the finding this phase exists to produce, and a threshold picked
		// here would be one nobody chose. Phase two's assertion is a COMPARISON -- the same drawing
		// before and after a gang move -- which needs no absolute number at all.
		const ok = out.rows.length > 0 && out.rows.every(function (r) {
			return isFinite(r.counts.leaderCross) && isFinite(r.counts.labelOnLeader)
				&& r.counts.labels > 0;
		});
		report(ok, 'measured ' + f, out.rows.length + ' zoom(s), '
			+ out.rows.map(function (r) { return r.counts.pairs; }).join('/') + ' pairs');
	});
	report(measured === files.length, 'every example was measured',
		measured + '/' + files.length);

	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });
