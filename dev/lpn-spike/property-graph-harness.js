// THE GRAPH AT THE FOOT OF THE PROPERTIES BOX, from EPA's own Net3.inp through the page's own
// chain. Run with:
//   node dev/lpn-spike/property-graph-harness.js
//
// ROADMAP Task 637, revised by Tom 2026-09-29: *"But what we really want is a time series graph at
// the bottom of Properties for an EPS project; it should have a selector for all the properties
// that can be graphed for that asset."*
//
// Built in the shape of time-series-harness.js, and for its reason: the run is provoked through
// the Calculate button's own door, so every number below comes out of the page's accessors and
// nothing is a model this file assembled. What is asserted:
//
//   1. No run, no graph: the Properties box is exactly as it was.
//   2. A junction gets a graph whose pull-down lists that TYPE's results, and no typed inputs.
//   3. A tank, a pipe and a pump each get their own list; a pump has no velocity.
//   4. Choosing a property redraws the plot.
//   5. Moving the transport moves the `now` marker.
//   6. The chosen property is remembered per element type, for the session only.
//   7. The multi-element box carries no graph.
//   8. Recalculate off keeps the snapshot: an edit does not take the graph away.
//   9. A steady-state project (no run time) has no graph.
//  3b. A pump's head loss is graphed as its Head, positive (minus the signed value); a pipe's stays Head loss.
//  3c. Sloping or stepped (Tom, 2026-10-02: "Do both, each as the situation requires"): a held
//      value (a junction's demand, a pump's flow) draws as steps that hold FORWARD from each report
//      time; an evolving one (a junction's pressure, a pipe's flow) draws as straight segments.
//  10. A source-trace run: the selector's own wording, "Source share from {node}" (Tom, 2026-09-30),
//      distinct from the shared lpn_result_source_share used everywhere else; and with no trace node
//      set, the entry does not appear at all (no results to offer it from).

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-profile.js');

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, getDoc: function () { return doc; },\n" +
	"\t\tsetDoc: function (d) { doc = d; }, setSettings: function (s) { settings = s; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trunSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\topenPopup: openPopup, openLinkPopup: openLinkPopup, closePopup: closePopup,\n" +
	"\t\topenMultiProperties: openMultiProperties, refreshPopupIfOpen: refreshPopupIfOpen,\n" +
	"\t\tsetSelectionList: setSelectionList, setProp: setProp, serialize: serializeProject,\n" +
	"\t\tcolorFieldLabel: colorFieldLabel, colorFieldUnitText: colorFieldUnitText,\n" +
	"\t\tpgFieldLabel: pgFieldLabel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;
const box = byId.lpn_popup_graph;

// Walk the stub tree under the graph box.
function walk(root, fn) {
	(function go(e) {
		if (!e) { return; }
		fn(e);
		(e.children || []).forEach(go);
	}(root));
}
function find(pred) { const out = []; walk(box, (e) => { if (pred(e)) { out.push(e); } }); return out; }
function byCls(cls) { return find((e) => String(e['class'] || e.className || '').split(/\s+/).indexOf(cls) >= 0); }
function sel() { return find((e) => e.id === 'lpn_pgraph_field')[0] || null; }
function options() { const s = sel(); return s ? (s.children || []).map((o) => o.value) : []; }
function optionTexts() { const s = sel(); return s ? (s.children || []).map((o) => o.textContent) : []; }
function shown() { return box.style.display !== 'none' && (box.children || []).length > 0; }
function lineSig() { return byCls('lpn-ts-line').map((p) => p.points).join('|'); }
function chartText() {
	const parts = [];
	walk(box, (e) => { if (e.nodeType === 3) { parts.push(String(e.textContent)); } });
	return parts.join(' | ');
}
function nowX() { const l = byCls('lpn-ts-now')[0]; return l ? String(l.x1) : null; }
function fire(el, type) {
	((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el }));
}
function choose(field) { const s = sel(); s.value = field; fire(s, 'change'); }
async function until(pred, ms) {
	const t0 = Date.now();
	while (!pred() && Date.now() - t0 < ms) { await wait(25); }
	return pred();
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();

	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net3');
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);
	d.settings.autoRun = false;
	const junctions = d.nodes.filter((n) => n.type === 'junction' && +n._demand > 0);
	const J1 = junctions[0].id, J2 = junctions[1].id;
	const tank = d.nodes.filter((n) => n.type === 'tank')[0].id;
	const pipe = d.links.filter((l) => l.type === 'pipe')[0].id;
	const pump = d.links.filter((l) => l.type === 'pump')[0].id;

	// ---- 1 ------------------------------------------------------------------------------------
	head('1. NO RUN, NO GRAPH');
	L.openPopup(J1, 100, 100);
	check(!shown(), 'before any run, the Properties box has no graph at its foot');
	L.closePopup();

	await warmEpanet();
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const ok = await until(() => EngCalcs.lpnTimeRunState().frames > 0, 90000);
	check(ok, `the engine ran Net3: ${EngCalcs.lpnTimeRunState().frames} frames`);
	if (!ok) { process.exit(1); }

	// ---- 2 ------------------------------------------------------------------------------------
	head('2. A JUNCTION: ITS RESULTS, AND NOTHING TYPED');
	L.openPopup(J1, 100, 100);
	check(shown(), `junction ${J1}: the graph appears at the foot of Properties`);
	const jOpts = options();
	check(['pressure', 'head', 'demandActual'].every((f) => jOpts.indexOf(f) >= 0),
		`its pull-down offers the junction's results: ${jOpts.join(', ')}`);
	check(['elev', 'demand', 'initQuality'].every((f) => jOpts.indexOf(f) < 0),
		'and no typed input (elevation, base demand, initial quality), which would be a flat line');
	check(optionTexts()[0] === L.colorFieldLabel('node', jOpts[0]),
		`the options reuse the page's own property labels: ${optionTexts().join(', ')}`);
	check(byCls('lpn-ts-line').length === 1, 'and one line is drawn, for this one junction');
	const want = L.colorFieldLabel('node', 'pressure') + ' (' + L.colorFieldUnitText('node', 'pressure') + ')';
	check(sel().value === 'pressure' && chartText().indexOf(want) >= 0,
		`it opens on the first property, with the y axis named: "${want}"`);
	check(byCls('lpn-ts-now').length === 1, 'and the dashed line marks the time the map is showing');

	// ---- 3 ------------------------------------------------------------------------------------
	head('3. EACH ELEMENT TYPE ITS OWN LIST');
	L.openPopup(tank, 100, 100);
	const tOpts = options();
	check(tOpts.indexOf('head') >= 0 && tOpts.indexOf('pressure') < 0 && tOpts.indexOf('demandActual') < 0,
		`a tank offers its moving head, not the stored-level pressure or a demand: ${tOpts.join(', ')}`);
	L.openLinkPopup(pipe, 100, 100);
	const pOpts = options();
	check(['velocity', 'flow', 'headloss', 'gradient', 'friction', 'status'].every((f) => pOpts.indexOf(f) >= 0),
		`a pipe offers its link results: ${pOpts.join(', ')}`);
	check(['diameter', 'roughness'].every((f) => pOpts.indexOf(f) < 0), 'and not its diameter or roughness');
	L.openLinkPopup(pump, 100, 100);
	const uOpts = options();
	check(uOpts.indexOf('flow') >= 0 && uOpts.indexOf('velocity') < 0 && uOpts.indexOf('gradient') < 0,
		`a pump offers only what the run has for it, no velocity: ${uOpts.join(', ')}`);

	head('3b. A PUMP GRAPHS ITS HEAD, POSITIVE; A PIPE STILL GRAPHS HEAD LOSS');
	{
		const frames = EngCalcs.lpnTimeRunFrames();
		const ftPerM = 3.28084;
		const titles = () => byCls('lpn-ts-dot').map((c) => (c.children || []).map((t) =>
			(t.children || []).map((x) => String(x.textContent)).join('')).join('')).filter(Boolean);
		const lastNum = (t) => parseFloat(t.trim().split(/\s+/).pop());
		L.openLinkPopup(pump, 100, 100);
		check(options().indexOf('headloss') >= 0 &&
			optionTexts()[options().indexOf('headloss')] === 'Head',
			`the pump's selector entry reads "Head": ${optionTexts().join(', ')}`);
		check(optionTexts().indexOf('Head loss') < 0, 'and the pump offers no "Head loss"');
		choose('headloss');
		check(/(^|\| )Head \(/.test(chartText()), 'the y axis is named Head with its unit');
		check(String(sel()['data-bs-original-title'] || sel().title).indexOf(PC.lpn_result_pump_head_tip) >= 0, 'and the selector carries the tip');
		const got = titles().map(lastNum);
		const wantv = frames.map((f) => -f.headlosses[pump] * ftPerM);
		check(got.length === frames.length && got.length > 0, `one dot per step: ${got.length}`);
		check(got.every((v, i) => Math.abs(v - Math.round(wantv[i] * 100) / 100) < 0.011),
			'each plotted value equals minus the EPANET head loss at that step');
		check(got.every((v) => v >= 0) && got.some((v) => v > 0), `and no value is negative, some are positive (max ${Math.max.apply(null, got)})`);
		L.openLinkPopup(pipe, 100, 100);
		check(optionTexts()[options().indexOf('headloss')] === 'Head loss', 'a pipe still offers "Head loss"');
		choose('headloss');
		check(chartText().indexOf('Head loss (') >= 0 && !/(^|\| )Head \(/.test(chartText()), 'and its axis says Head loss');
		choose(pOpts[0]);
	}

	head('3c. A HELD VALUE STEPS, AN EVOLVING ONE SLOPES');
	{
		const nFrames = EngCalcs.lpnTimeRunFrames().length;
		const corners = () => byCls('lpn-ts-line').map((p) => String(p.points).trim().split(/\s+/)
			.map((xy) => xy.split(',').map(Number)));
		const runs = () => corners().filter((r) => r.length > 1);
		// Stepped: every leg is flat or vertical, each flat leg runs FORWARD (left to right) from a
		// report point, and a rise sits at the next report time, so n points give 2n - 1 corners.
		function isStepped(r) {
			for (let i = 1; i < r.length; i++) {
				const flat = r[i][1] === r[i - 1][1], upright = r[i][0] === r[i - 1][0];
				if (!(i % 2 ? flat && r[i][0] > r[i - 1][0] : upright)) { return false; }
			}
			return r.length % 2 === 1;
		}
		const diagonal = (r) => r.some((q, i) => i > 0 && q[0] !== r[i - 1][0] && q[1] !== r[i - 1][1]);
		function expect(stepped, what) {
			const rs = runs(), pts = rs.reduce((k, r) => k + (stepped ? (r.length + 1) / 2 : r.length), 0);
			check(rs.length > 0 && rs.every((r) => stepped === isStepped(r)),
				`${what}: ${stepped ? 'stepped' : 'sloping'} (${rs.map((r) => r.length).join('+')} corners)`);
			check(pts === nFrames, `  and every report time is a corner of it, with no corner added between (${pts} of ${nFrames})`);
			check(byCls('lpn-ts-line').every((p) => /lpn-ts-stepped/.test(String(p['class'] || p.className || '')) === stepped),
				'  and the line says which in its class');
		}
		L.openPopup(J1, 100, 100);
		choose('demandActual');
		expect(true, `junction ${J1}'s demand, held by its pattern`);
		const dv = corners()[0];
		check(dv.some((q, i) => i > 0 && q[1] !== dv[i - 1][1]), '  and the demand actually changes somewhere, so a step is drawn and not just a flat line');
		choose('pressure');
		expect(false, `junction ${J1}'s pressure, which drifts with the tanks`);
		check(corners().some(diagonal), '  with at least one sloping segment');
		L.openLinkPopup(pump, 100, 100);
		const pumpWas = sel().value;
		choose('flow');
		expect(true, `pump ${pump}'s flow, held between events`);
		choose(pumpWas);
		L.openLinkPopup(pipe, 100, 100);
		choose('flow');
		expect(false, `pipe ${pipe}'s flow`);
		check(corners().some(diagonal), '  with at least one sloping segment');
		choose(pOpts[0]);
		L.closePopup();
	}

	// ---- 4 ------------------------------------------------------------------------------------
	head('4. CHOOSING A PROPERTY REDRAWS THE PLOT');
	L.openPopup(J1, 100, 100);
	const before = lineSig();
	choose('head');
	check(sel().value === 'head', 'the pull-down holds the new choice after the rebuild');
	check(lineSig() !== before && lineSig().length > 0, 'and the line is a different line');
	check(chartText().indexOf(L.colorFieldLabel('node', 'head')) >= 0, 'with the y axis renamed to match');

	// ---- 5 ------------------------------------------------------------------------------------
	head('5. THE TRANSPORT MOVES THE MARKER');
	const stops = EngCalcs.lpnReportTimes(d.times);
	EngCalcs.lpnTimeGoTo(stops[0]);
	const x0 = nowX();
	EngCalcs.lpnTimeGoTo(stops[Math.floor(stops.length / 2)]);
	const x1 = nowX();
	check(x0 !== null && x1 !== null && x0 !== x1, `the now line follows the frame: x ${x0} -> ${x1}`);
	check(sel().value === 'head', 'and the chosen property survives the step');

	// ---- 6 ------------------------------------------------------------------------------------
	head('6. REMEMBERED PER ELEMENT TYPE, FOR THIS SESSION');
	L.openPopup(J2, 100, 100);
	check(sel().value === 'head', `another junction (${J2}) opens on the property chosen for junctions`);
	L.openLinkPopup(pipe, 100, 100);
	check(sel().value === pOpts[0], `a pipe keeps its own: ${sel().value}`);
	L.openPopup(tank, 100, 100);
	check(sel().value === 'head' && tOpts[0] === 'head', 'a tank has its own first choice');
	const saved = JSON.stringify(L.serialize());
	check(saved.indexOf('pgraph') < 0 && saved.indexOf('pgField') < 0,
		'and nothing about the choice enters the project file');

	// ---- 7 ------------------------------------------------------------------------------------
	head('7. SEVERAL ELEMENTS: NO GRAPH');
	L.setSelectionList([{ kind: 'node', id: J1 }, { kind: 'node', id: J2 }]);
	L.openMultiProperties();
	check(!shown(), 'the multi-element Properties box carries no graph');
	L.setSelectionList([]);
	L.closePopup();

	// ---- 8 ------------------------------------------------------------------------------------
	head('8. RECALCULATE OFF: THE SNAPSHOT STAYS');
	L.openPopup(J1, 100, 100);
	const snap = lineSig();
	L.setProp(L.getDoc().nodes.filter((n) => n.id === J1)[0], 'elev', 1);
	L.runSolve();
	await wait(400);
	L.refreshPopupIfOpen();
	check(EngCalcs.lpnTimeRunFrames().length > 0 && shown(),
		'after an edit with Recalculate off, the graph is still there');
	check(lineSig() === snap, 'and it is the same line, the stale run, not a hidden or cleared one');

	// ---- 9 ------------------------------------------------------------------------------------
	head('9. A STEADY-STATE PROJECT: NO GRAPH');
	d.times.duration = 0;
	d.settings.autoRun = true;
	L.runSolve();
	const gone = await until(() => EngCalcs.lpnTimeRunFrames().length === 0, 20000);
	L.refreshPopupIfOpen();
	check(gone && !shown(), 'with no run time set, the Properties box has no graph');

	// ---- 10 -----------------------------------------------------------------------------------
	head('10. SOURCE TRACE: THE SELECTOR\'S OWN WORDING');
	L.closePopup();
	d.times.duration = 86400;
	d.settings.quality = { mode: 'trace', traceNode: 'River' };
	d.settings.autoRun = false;
	L.runSolve();
	EngCalcs.lpnTimeRunNow();
	const traceOk = await until(() => EngCalcs.lpnTimeRunState().frames > 0, 90000);
	check(traceOk, `the trace run completed: ${EngCalcs.lpnTimeRunState().frames} frames`);
	L.openPopup(J1, 100, 100);
	const trOpts = options();
	const trTexts = optionTexts();
	const qIdx = trOpts.indexOf('quality');
	check(qIdx >= 0, `a source-trace run offers quality on a junction: ${trOpts.join(', ')}`);
	check(qIdx >= 0 && trTexts[qIdx] === 'Source share from River',
		`the selector names the trace node, not the bare label: "${trTexts[qIdx]}"`);
	check(qIdx >= 0 && L.pgFieldLabel('node', 'quality') === 'Source share from River',
		'pgFieldLabel() itself returns the same wording');
	check(L.colorFieldLabel('node', 'quality') === 'Source share',
		'while the shared label colorFieldLabel() still returns unchanged, for Tables, Find and the legend');
	L.closePopup();

	// No trace node at all: the trace has nothing to report, so the run carries no quality numbers
	// and the entry never reaches the selector -- the same "no results, no candidate" rule that
	// keeps a pump's velocity and a reservoir's demand off their own lists (pgAvailable()'s rule).
	d.settings.quality = { mode: 'trace', traceNode: '' };
	L.runSolve();
	EngCalcs.lpnTimeRunNow();
	const noNodeOk = await until(() => EngCalcs.lpnTimeRunState().frames > 0, 90000);
	check(noNodeOk, `the run without a trace node still completed: ${EngCalcs.lpnTimeRunState().frames} frames`);
	L.openPopup(J1, 100, 100);
	check(options().indexOf('quality') < 0,
		'with no trace node set, quality (source share) does not appear in the selector at all');
	L.closePopup();

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
