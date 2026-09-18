// ONE EXAMPLE, MEASURED: the drawn labels of a shipped example at four zooms, counted by
// Collide.labelCrossings(). Required by BOTH label-crossing harnesses so there is one measurement
// and not two -- label-crossing-harness.js reports the drawing as it ships, and
// label-gang-harness.js runs the same measurement once per repair MODE and compares.
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
// must not stub away** (dev/testing-notes.md). placeLabels() returns a leader segment for every
// label it places; the renderer then HIDES it when the label is nearer its anchor than
// leaderThreshold(). Counting the returned segments would therefore count leaders no reader can
// see -- a bigger number about a drawing that does not exist. updateDataLeader() is the only place
// the answer exists, and it writes it onto the element.
//
// **ONE EXAMPLE PER PROCESS, AND ONE MODE.** A second document loaded into a page that already
// holds one inherits its elements' measured widths and its label state, so two loads in one process
// contaminate each other. Both callers spawn a child per (example, mode) pair for that reason.
// (Until Task 539's stability work there was a second reason -- shedAlignedForConflicts() seeded
// node labels where the LAST layout put them, so the pass carried state from one layout to the
// next. It does not any more: predictNodeLabelBoxes() derives that seed from the drawing, and
// label-stability-harness.js holds it.)

'use strict';

const fs = require('fs');
const path = require('path');

const EXAMPLES = path.join(__dirname, '../water-network-examples');

// **THE MODE IS TWO SWITCHES, NOT ONE, since Task 539 phase three.** The repair route is the part
// before a '+' ('off', 'brute', 'gang', 'spot', 'both', 'all', 'dry'); a '+shed' suffix lets the
// FINAL SHED run,
// and without it Collide.shedCrossingSurvivors() is neutered so that it hides nothing. It has to be
// switchable for the same reason the repair does: the shed drives every measured view to zero by
// construction, so a table with it always on would report the same column four times and could not
// say what it COST. `shed` on each row is what it hid, which is the cost side of Tom's ruling.
async function measure(file, mode, opts) {
	opts = opts || {};
	// **HOW MANY TIMES ONE UNTOUCHED VIEW IS RE-LAID-OUT.** One is the measurement every caller
	// before Task 539's stability work wanted; more than one is the stability question, and the
	// answer is a SIGNATURE per pass rather than a count -- a layout that swaps two labels keeps
	// its count, and a shed that picks a different victim keeps the number it hides. Both are
	// exactly the defects that hid behind counting (section 11 of
	// dev/label-placement-algorithms.md).
	const passes = Math.max(1, opts.passes || 1);
	const stub = require('./lpn-dom-stub.js');
	const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
	const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

	// **THE MODE IS APPLIED AT THE ONE SEAM, so every run below is the page's own chain and the
	// only difference between two of them is which routes were allowed to generate a layout.**
	// 'off' returns the first-fit's own result untouched, which is the drawing as it stood before
	// Task 539 phase two and therefore the "before" column of every comparison.
	const parts = String(mode).split('+'), repairMode = parts[0], useShed = parts.indexOf('shed') > 0;
	let repairMs = 0, repairCalls = 0, lastStats = null;
	let shedMs = 0, shedHidden = [], shedResidual = [];
	const realShed = Collide.shedCrossingSurvivors;
	Collide.shedCrossingSurvivors = function (entries, opts) {
		const t0 = process.hrtime.bigint();
		const out = useShed ? realShed.call(this, entries, opts)
			: { hidden: [], hiddenSet: {}, residual: [], rounds: 0, before: 0, after: 0 };
		shedMs += Number(process.hrtime.bigint() - t0) / 1e6;
		shedHidden = out.hidden.slice();
		shedResidual = out.residual.map(function (q) { return q.join('|'); });
		return out;
	};
	const realRepair = Collide.repairCrossingGangs;
	Collide.repairCrossingGangs = function (labels, placed, obs, opts) {
		const t0 = process.hrtime.bigint();
		let out;
		if (repairMode === 'off') {
			out = { results: placed, stats: { gangs: 0, considered: 0, moved: 0, trials: 0,
				brute: 0, gang: 0, before: 0, after: 0 } };
		} else {
			const o = Object.assign({}, opts);
			// **THE MODE NAMES THE ROUTES EXPLICITLY, and 'both' has to keep meaning the two it
			// always meant.** Task 539 phase four added a third route, so leaving opts alone -- the
			// old way of spelling 'both' -- would have silently turned every recorded 'both' figure
			// into a three-route one and made the table say the opposite of what it says.
			if (repairMode === 'brute' || repairMode === 'gang' || repairMode === 'spot') {
				o.strategies = [repairMode];
			} else if (repairMode === 'both') {
				o.strategies = ['brute', 'gang'];
			} else if (repairMode === 'all') {
				o.strategies = ['brute', 'gang', 'spot'];
			}
			// The closing count is opt-in in the pass itself, being a second sweep of the whole
			// drawing for a number no decision reads. A harness comparing model with drawing wants it.
			o.report = true;
			out = realRepair.call(this, labels, placed, obs, o);
			// 'dry' RUNS THE MODEL AND THROWS THE MOVE AWAY: the drawing is the unrepaired one, and
			// the stats say what the repair BELIEVED about it. That is the one way to ask whether
			// the model and the measurement agree about the same picture, which is the question
			// behind every surprise this pass has produced.
			if (repairMode === 'dry') { out = { results: placed, stats: out.stats }; }
		}
		repairMs += Number(process.hrtime.bigint() - t0) / 1e6;
		repairCalls++;
		lastStats = out.stats;
		// **THE REPAIR RETURNS A NEW ARRAY, so the node placements this harness reads have to be
		// THAT one and not the first-fit's own.** repairCrossingGangs() copies the list and
		// replaces the entries it moved, leaving placeLabelsFirstFit()'s result holding the boxes
		// as they were before the move -- while the LEADERS below are read from the DOM and are
		// therefore the moved ones. Measuring the two together describes a drawing that does not
		// exist, and it is what made the phase-three shed report zero about a view with eight
		// pairs on it (2026-09-09). It also carries the shed's own `dropped` marks, which are
		// written onto this array.
		lastFirstFit = out.results;
		return out;
	};

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
	//
	// **opts.fields OVERRIDES IT, for the one question the all-on drawing cannot answer** (Task 539,
	// 2026-09-18): Tom compared three screenshots -- node ID only, ID plus demand, demand only --
	// and asked why the third is so much worse than the first. Two drawings that differ in ONE field
	// cannot be compared unless the field set is an input. `{ node: ['id'], link: [] }` turns on
	// exactly those and nothing else; omit it and every field is on, which is what every recorded
	// figure in dev/label-placement-algorithms.md was taken with.
	const ls = L.labelSettings();
	if (opts.fields) {
		['node', 'link'].forEach(function (g) {
			const want = opts.fields[g] || [];
			Object.keys(ls[g]).forEach(function (k) { ls[g][k] = want.indexOf(k) >= 0; });
		});
	} else {
		Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
		Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	}

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

	// **THE SIGNATURE IS THE LABEL SET AND WHERE EACH ONE SITS, not the count.** Two layouts with
	// the same number of crossings are not the same drawing, and a reader watching four labels
	// trade places sees a flicker the count cannot report. A label the shed hid is not in the set at
	// all, so a shed that changed its mind moves this too.
	//
	// **TWELVE SIGNIFICANT FIGURES AND NOT A FIXED NUMBER OF DECIMALS.** A world unit is a foot on
	// an XY drawing and a DEGREE on a geographic one, so rounding to a hundredth compares Net3-World
	// to the nearest kilometer and calls every layout identical. Significant figures absorb a
	// last-bit wobble in either.
	function signature(pl) {
		return pl.map(function (p) {
			const b = p.boxes[0];
			return p.id + '@' + b.cx.toPrecision(12) + ',' + b.cy.toPrecision(12)
				+ (p.leader ? '+L' : '');
		}).sort().join(' ');
	}
	// **HIDDEN IS COUNTED AGAINST WHAT THE DRAWING HAS TO SAY**, so the denominator is every label
	// with text in it and the numerator is the ones no reader can see this pass. A fix that buys
	// labels, or spends them, shows up here and nowhere else.
	//
	// **IT IS NOT THE SHED'S BILL, AND READING IT AS ONE OVERSTATES IT BY TWENTY TIMES.** Most of
	// this number is link labels the VIEW does not draw -- shorter than their own pipe at this zoom,
	// or off the screen -- which is why it falls as you zoom in. What Task 539's shed cost is the
	// `shed` list on each pass, which names the labels it hid and is single figures.
	function hiddenCount() {
		let total = 0, hidden = 0;
		doc.nodes.forEach(function (n) {
			const h = nodeEls[n.id];
			if (!h || h.empty || !h.text) { return; }
			total++; if (!assemblyShown(h)) { hidden++; }
		});
		doc.links.forEach(function (l) {
			const h = linkEls[l.id];
			if (!h || h.empty || !h.text) { return; }
			total++; if (!assemblyShown(h)) { hidden++; }
		});
		return { total: total, hidden: hidden };
	}
	// **HOW MANY NODE LABELS GAVE UP A VALUE RATHER THAN GOING WHOLE** (Task 469's cascade). Zero
	// here beside a large hidden count is the signature of a label set the value shed cannot help:
	// it refuses to drop the LAST ranked value, so a drawing showing the ID and one number has
	// nothing to give and the only move left is to hide the label entire.
	function valueShedCount() {
		let shed = 0;
		doc.nodes.forEach(function (n) {
			const h = nodeEls[n.id];
			if (!h || h.empty || !h.allLines || !h.lines) { return; }
			if (h.lines.length < h.allLines.length) { shed++; }
		});
		return shed;
	}
	// **LABEL ON LABEL IS A SEPARATE READING AND IS NOT A CROSSING.** Collide.labelCrossings()
	// answers Tom's two triggers -- crossed leaders, and a label lying on somebody's leader -- and
	// two labels printed on top of each other trips neither of them. He sent a screenshot of
	// exactly that on 2026-09-09, so the number is taken here beside the crossings rather than
	// inferred from them. Counted over the STAIRCASE on both sides (Task 406), unordered, once
	// per pair.
	// Node labels only -- the subject of the three-screenshot question -- in world units, with the
	// leader read from the DOM exactly as everything else here reads it.
	function nodeGeometry(drawn) {
		const w = [], h = [], area = [], rows = [], lead = [];
		drawn.forEach(function (p) {
			if (p.id.charAt(0) !== 'n') { return; }
			// **THE WHOLE FOOTPRINT, NOT THE FIRST ROW.** A node label STACKS, so boxes[] is a
			// staircase of rows and boxes[0] is only the top one -- reading it reports the ID row's
			// width for a label whose demand row is three times wider, which is exactly the
			// misreading the three-screenshot question was about.
			let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
			p.boxes.forEach(function (b) {
				x0 = Math.min(x0, b.cx - b.w / 2); x1 = Math.max(x1, b.cx + b.w / 2);
				y0 = Math.min(y0, b.cy - b.h / 2); y1 = Math.max(y1, b.cy + b.h / 2);
			});
			w.push(x1 - x0); h.push(y1 - y0); area.push((x1 - x0) * (y1 - y0));
			rows.push(p.boxes.length);
			lead.push(p.leader ? Math.hypot(p.leader.bx - p.leader.ax, p.leader.by - p.leader.ay) : 0);
		});
		function stat(a) {
			if (!a.length) { return { n: 0, med: 0, max: 0, mean: 0 }; }
			const s2 = a.slice().sort(function (x, y) { return x - y; });
			return { n: a.length, med: s2[Math.floor(s2.length / 2)], max: s2[s2.length - 1],
				mean: a.reduce(function (x, y) { return x + y; }, 0) / a.length };
		}
		return { width: stat(w), height: stat(h), area: stat(area), rows: stat(rows),
			leader: stat(lead),
			withLeader: lead.filter(function (v) { return v > 0; }).length };
	}
	function overlapPairs(drawn) {
		const overlaps = [];
		for (let a = 0; a < drawn.length; a++) {
			for (let b = a + 1; b < drawn.length; b++) {
				let hit = false;
				(drawn[a].boxes || []).forEach(function (p) {
					(drawn[b].boxes || []).forEach(function (q) {
						if (Collide.boxOverlapDepth(p, q) > 0) { hit = true; }
					});
				});
				if (hit) { overlaps.push(drawn[a].id + '|' + drawn[b].id); }
			}
		}
		return overlaps;
	}

	const rows = [];
	[1, 2, 4, 8].forEach(function (mult) {
		if (!L.setView({ cx: cx, cy: cy, s: sFit * mult })) { return; }
		let first = null, firstShed = [], firstResidual = [], firstOverlaps = [], firstShedMs = 0;
		const seen = [];
		for (let i = 0; i < passes; i++) {
			repairMs = 0; repairCalls = 0; lastStats = null;
			shedMs = 0; shedHidden = []; shedResidual = [];
			const t0 = process.hrtime.bigint();
			L.refreshLabelText();     // the page's own content-then-layout pass
			const passMs = Number(process.hrtime.bigint() - t0) / 1e6;
			const pl = placements();
			const r = Collide.labelCrossings(pl);
			const hc = hiddenCount();
			// **THE SHED'S OWN VICTIMS, LISTED AND NOT COUNTED.** Hiding the same NUMBER of labels
			// while choosing different ones is a blink on an untouched drawing, and it is the shape
			// that hid behind counting once already.
			seen.push({ sig: signature(pl), pairs: r.counts.pairs, drawn: pl.length,
				hidden: hc.hidden, labels: hc.total, ms: passMs,
				// **THE GEOMETRY OF WHAT WAS DRAWN, not only how much of it.** A node label's box
				// WIDTH and the length of the leader it ended up trailing are what separate two
				// field sets that place the same number of labels; nothing here could report them
				// before 2026-09-18.
				geom: nodeGeometry(pl), valueShed: valueShedCount(),
				shed: shedHidden.slice().sort().join(' ') });
			if (i === 0) {
				first = r; firstShed = shedHidden.slice(); firstResidual = shedResidual.slice();
				firstOverlaps = overlapPairs(pl); firstShedMs = shedMs;
			}
		}
		const r = first;
		rows.push({ zoom: mult, s: sFit * mult, counts: r.counts,
			repairMs: repairMs, repairCalls: repairCalls, repair: lastStats,
			shedMs: firstShedMs, shed: firstShed, shedResidual: firstResidual,
			overlaps: firstOverlaps, passes: seen,
			pairs: r.pairs.map(function (p) { return p.join('|'); }),
			gangs: r.gangs.map(function (g) { return g.join('+'); }) });
	});
	return { file: file, mode: mode, rows: rows };
}

module.exports = { measure: measure, EXAMPLES: EXAMPLES };
