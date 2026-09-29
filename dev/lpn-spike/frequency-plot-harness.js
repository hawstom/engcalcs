// THE FREQUENCY PLOT, from EPA's own Net1.inp through the page's own chain. Run with:
//   node dev/lpn-spike/frequency-plot-harness.js
//
// ROADMAP Task 600, first slice. EPANET's Frequency Plot: one value over every junction or every
// pipe, at one time, against the percent of them less than it. EPANET's Graph window
// (Fgraph.pas, RefreshFrequencyPlot) plots the i-th of n sorted values at (value, 100*i/n).
//
// Built as time-series-harness.js is: no model assembled here, the run provoked through the
// Calculate button's own door, and every expected number computed INDEPENDENTLY from the solve
// result's own SI arrays and the unit factor, never from the page's value seam the chart reads.
//
// THE WAYS THIS CAN BE WRONG WHILE DRAWING A CONVINCING CURVE:
//   1. THE PERCENTAGES ARE OFF BY ONE (100*(i+1)/n, or a curve that reaches 100).
//   2. THE POPULATION IS WRONG: a tank or a reservoir among the junctions, a pump among the pipes.
//   3. THE NUMBERS ARE SI while the axis names the project's unit.
//   4. THE CURVE IS FROZEN at the first frame while the transport moves.
//   5. NO RESULTS DRAWS EMPTY AXES instead of saying so -- or hides an input that needs no solve.

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
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\topenPane: openPane, wirePane: wirePane,\n" +
	"\t\tpaneTabIds: function () { return paneTabs.map(function (t) { return t.id; }); },\n" +
	"\t\tfreqState: function () { return freqState; }, freqValues: freqValues,\n" +
	"\t\tfreqField: freqField, renderFrequency: renderFrequency, rebuildFreqForm: rebuildFreqForm,\n" +
	"\t\tcolorFieldUnitText: colorFieldUnitText, colorFieldLabel: colorFieldLabel,\n" +
	"\t\tunitLabel: unitLabel, unitFactor: unitFactor, serialize: serializeProject,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;

function chartEls(cls) {
	const out = [];
	(function walk(e) {
		if (!e) { return; }
		if (String(e['class'] || '').split(/\s+/).indexOf(cls) >= 0) { out.push(e); }
		(e.children || []).forEach(walk);
	}(byId.lpn_freq_chart));
	return out;
}
function chartText() {
	const parts = [];
	(function walk(e) {
		if (!e) { return; }
		if (e.nodeType === 3) { parts.push(String(e.textContent)); }
		(e.children || []).forEach(walk);
	}(byId.lpn_freq_chart));
	return parts.join(' | ');
}
function control(id) {
	return (byId.lpn_freq_form.children || []).filter((c) => c.id === id)[0] || null;
}
function fire(el, type) {
	((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el }));
}
// THE INDEPENDENT ANSWER. For each distinct value x in the list: the percent of the list strictly
// less than x, counted by brute force. EPANET's curve puts the FIRST point at x at exactly this y.
function percentBelow(list) {
	const n = list.length, out = {};
	list.forEach((x) => { out[x] = 100 * list.filter((y) => y < x).length / n; });
	return out;
}
// Does the page's curve agree with the independent answer? Compared value by value, in order.
function agrees(pts, expected) {
	const want = expected.slice().sort((a, b) => a - b), below = percentBelow(want);
	if (pts.length !== want.length) { return `length ${pts.length} vs ${want.length}`; }
	for (let k = 0; k < pts.length; k++) {
		if (Math.abs(pts[k].x - want[k]) > 1e-9 * Math.max(1, Math.abs(want[k]))) {
			return `value ${k}: ${pts[k].x} vs ${want[k]}`;
		}
		// The first of a run of ties sits at the percent strictly below it.
		if ((k === 0 || want[k - 1] !== want[k]) && Math.abs(pts[k].y - below[want[k]]) > 1e-9) {
			return `percent at ${want[k]}: ${pts[k].y} vs ${below[want[k]]}`;
		}
	}
	return '';
}
function curve(group, field) {
	return EngCalcs.lpnProfile.frequencySeries(L.freqValues(group, field).map((o) => o.v));
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.wirePane();

	head('0. THE CURVE ITSELF, EPANET\'S 100*i/n');
	const toy = EngCalcs.lpnProfile.frequencySeries([30, 10, 20, NaN, 40, undefined]);
	check(JSON.stringify(toy) === JSON.stringify([{ x: 10, y: 0 }, { x: 20, y: 25 }, { x: 30, y: 50 }, { x: 40, y: 75 }]),
		`four values give 0, 25, 50, 75 and never 100; a missing value is left out: ${JSON.stringify(toy)}`);
	check(EngCalcs.lpnProfile.frequencySeries([]).length === 0, 'no values, no curve');

	head('1. NET1 THROUGH THE PAGE\'S OWN CHAIN, BEFORE ANY SOLVE');
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net1.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net1');
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);
	d.settings.autoRun = false;
	const junctions = d.nodes.filter((n) => n.type === 'junction');
	const pipes = d.links.filter((l) => l.type === 'pipe');
	check(junctions.length === 9 && pipes.length === 12,
		`Net1: ${junctions.length} junctions, ${pipes.length} pipes (plus a tank, a reservoir and a pump)`);
	const ids = L.paneTabIds();
	check(ids.indexOf('frequency') === ids.indexOf('timeseries') + 1 && ids[ids.length - 1] === 'profile',
		`the tab sits after Time series and Profile is still last: ${ids.slice(-3).join(', ')}`);
	const tabBtn = (byId.lpn_pane_tabs.children || []).filter((b) => b.id === 'lpn_pane_tab_frequency')[0];
	check(!!tabBtn && tabBtn.textContent === PC.lpn_freq_menu && tabBtn.title === PC.lpn_freq_tip,
		'with a button in the strip, named and tipped from the language file');
	L.openPane('frequency');
	check(L.freqField() === 'pressure', `it opens on junction pressure: ${L.freqField()}`);
	check(byId.lpn_freq_note._text === PC.lpn_freq_none,
		`no solve yet: said in words: "${byId.lpn_freq_note._text}"`);
	check(chartEls('lpn-profile-frame').length === 0, 'and no empty axis pair is drawn');
	// An INPUT needs no solve, as Profile draws its ground line with no solve.
	const qSel0 = control('lpn_freq_quantity');
	qSel0.value = 'elev';
	fire(qSel0, 'change');
	const elevPts = curve('node', 'elev');
	check(elevPts.length === 9 && chartEls('lpn-freq-line').length === 1,
		`elevation, an input, is drawn with no solve: ${elevPts.length} points`);
	check(!agrees(elevPts, junctions.map((n) => n.elev)) ,
		`and matches the typed elevations of the junctions alone: ${agrees(elevPts, junctions.map((n) => n.elev)) || 'agrees'}`);
	check(byId.lpn_freq_note._text === String(PC.lpn_freq_summary).replace('{n}', '9').replace('{total}', '9'),
		`with the count said, and no time because nothing is a frame: "${byId.lpn_freq_note._text}"`);

	head('2. THE RUN');
	await warmEpanet();
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const LIMIT_MS = 90000, t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames === 0 && Date.now() - t0 < LIMIT_MS) { await wait(25); }
	const frames = EngCalcs.lpnTimeRunFrames();
	check(frames.length > 1, `the engine answered: ${frames.length} frames in ${Date.now() - t0} ms`);
	if (frames.length < 2) { console.log('\nno run, nothing below can be asserted'); process.exit(1); }

	head('3. PRESSURE OVER JUNCTIONS, AGAINST AN INDEPENDENT COUNT');
	const S = L.freqState();
	S.group = 'node'; S.fields.node = 'pressure';
	EngCalcs.lpnTimeGoTo(frames[0].t);
	L.rebuildFreqForm(); L.renderFrequency();
	let R = L.lastResult();
	check(R && R.t === frames[0].t, `the map is showing the run's first frame: t=${R && R.t}`);
	const fp = L.unitFactor('lpn_u_pressure');
	let want = junctions.map((n) => R.pressures[n.id] * fp);
	let pts = curve('node', 'pressure');
	check(!agrees(pts, want), `the curve is the sorted pressures, each at the percent below it: ${agrees(pts, want) || 'agrees'}`);
	check(pts[0].y === 0 && Math.abs(pts[pts.length - 1].y - 100 * 8 / 9) < 1e-9,
		`from 0 to 100*(n-1)/n, EPANET's ends: ${pts[0].y} .. ${pts[pts.length - 1].y.toFixed(3)}`);
	check(chartEls('lpn-ts-dot').length === 9, `one dot per junction: ${chartEls('lpn-ts-dot').length}`);
	check(chartText().indexOf(PC.lpn_freq_axis_percent) >= 0, `the percent axis says "${PC.lpn_freq_axis_percent}"`);
	const title = L.colorFieldLabel('node', 'pressure') + ' (' + L.colorFieldUnitText('node', 'pressure') + ')';
	check(chartText().indexOf(title) >= 0, `the value axis says "${title}"`);
	check(byId.lpn_freq_note._text.indexOf(EngCalcs.lpnFormatTime(frames[0].t)) >= 0,
		`the summary names the frame's time: "${byId.lpn_freq_note._text}"`);

	head('4. LINKS: PIPES ONLY, FLOW AS AN ABSOLUTE VALUE');
	const gSel = control('lpn_freq_group');
	gSel.value = 'link';
	fire(gSel, 'change');
	check(control('lpn_freq_group').value === 'link' && L.freqField() === 'velocity',
		`choosing Pipes switches the list to link fields: ${L.freqField()}`);
	const opts = (control('lpn_freq_quantity').children || []).map((o) => o.value);
	check(opts.indexOf('status') < 0 && opts.indexOf('flow') >= 0 && opts.indexOf('friction') >= 0,
		`the map's own list less Status: ${opts.join(', ')}`);
	const qSel = control('lpn_freq_quantity');
	qSel.value = 'flow';
	fire(qSel, 'change');
	const ff = L.unitFactor('lpn_u_flow');
	want = pipes.map((l) => Math.abs(R.flows[l.id]) * ff);
	pts = curve('link', 'flow');
	check(!agrees(pts, want), `flow over the 12 pipes, absolute, in ${L.unitLabel('lpn_u_flow')}: ${agrees(pts, want) || 'agrees'}`);
	check(L.freqValues('link', 'flow').every((o) => o.id !== '9'), 'and the pump (9) is not among them');
	check(Math.abs(ff - 1) > 0.1, `and the flow factor is not 1, so SI would be a different curve: ${ff.toFixed(4)}`);

	head('5. UNITS: THE SAME CURVE IN ANOTHER UNIT');
	// The row was rebuilt by the last change, so this is the control now on screen.
	const gSel2 = control('lpn_freq_group');
	gSel2.value = 'node';
	fire(gSel2, 'change');
	check(L.freqState().group === 'node' && L.freqField() === 'pressure',
		`back to Junctions restores the junction question: ${L.freqField()}`);
	// Through the page's own door for installing a unit, so the select the page reads is the one set.
	check(L.applyUnitSelections({ lpn_u_pressure: 'kpa' }) === true, 'the pressure unit is switched to kPa');
	L.renderFrequency();
	const fk = L.unitFactor('lpn_u_pressure');
	pts = curve('node', 'pressure');
	check(Math.abs(fk - fp) > 1 && !agrees(pts, junctions.map((n) => R.pressures[n.id] * fk)),
		`switched to ${L.unitLabel('lpn_u_pressure')}: values follow the new factor (${fp.toFixed(4)} -> ${fk.toFixed(4)})`);
	check(chartText().indexOf('(' + L.colorFieldUnitText('node', 'pressure') + ')') >= 0,
		`and the axis names it: (${L.colorFieldUnitText('node', 'pressure')})`);
	L.applyUnitSelections({ lpn_u_pressure: 'psi' });
	L.renderFrequency();

	head('6. THE TRANSPORT MOVES, THE CURVE MOVES WITH IT');
	const before = curve('node', 'pressure').map((p) => p.x).join(',');
	const later = frames[Math.floor(frames.length / 2)];
	EngCalcs.lpnTimeGoTo(later.t);
	R = L.lastResult();
	check(R && R.t === later.t, `the map is at ${EngCalcs.lpnFormatTime(later.t)}`);
	pts = curve('node', 'pressure');
	want = junctions.map((n) => later.pressures[n.id] * L.unitFactor('lpn_u_pressure'));
	check(!agrees(pts, want), `the curve is that frame's pressures: ${agrees(pts, want) || 'agrees'}`);
	check(pts.map((p) => p.x).join(',') !== before, 'and differs from the first frame\'s');
	check(byId.lpn_freq_note._text.indexOf(EngCalcs.lpnFormatTime(later.t)) >= 0,
		`the tab was refreshed by the step itself, and says so: "${byId.lpn_freq_note._text}"`);

	head('7. NOTHING STORED');
	const saved = JSON.stringify(L.serialize());
	check(saved.indexOf('freq') < 0, 'nothing about the graph enters serializeProject()');

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
