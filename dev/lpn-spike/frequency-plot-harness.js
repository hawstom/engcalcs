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
	// The edit, scenario and project doors, for sections 8 to 11.
	"\t\tsetProp: setProp, scheduleSolve: scheduleSolve, createScenario: createScenario,\n" +
	"\t\tswitchScenario: switchScenario, baseScenarioId: function () { return baseScenario().id; },\n" +
	"\t\tgetLibrary: function () { return library; }, saveToStorage: saveToStorage,\n" +
	"\t\topenProject: openProject, nodeById: nodeById, linkById: linkById, effective: effective,\n" +
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
// WHAT THE CHART DREW, read back off its dots' hover text ("id   value   percent %"), as
// {id: value}. Everything from section 8 on asserts on THIS rather than on a fresh computation, so a
// tab that was never redrawn is caught: the page's accessors would give the new answer on demand
// while the screen still showed the old one.
function drawn() {
	const out = {};
	chartEls('lpn-ts-dot').forEach((c) => {
		const t = (c.children || []).filter((k) => k.tagName === 'title' || k.nodeName === 'title' ||
			String(k.tagName || '').toLowerCase() === 'title')[0];
		const txt = [];
		(function walk(e) { if (!e) { return; } if (e.nodeType === 3) { txt.push(String(e.textContent)); } (e.children || []).forEach(walk); }(t));
		const parts = txt.join('').split(/\s{3}/);
		if (parts.length >= 2) { out[parts[0]] = +parts[1]; }
	});
	return out;
}
const close = (a, b) => Math.abs(a - b) <= 1e-3 * Math.max(1, Math.abs(b));
function drawnMatches(want) {
	const got = drawn(), ids = Object.keys(want);
	if (Object.keys(got).length !== ids.length) { return `drew ${Object.keys(got).length}, want ${ids.length}`; }
	for (const id of ids) { if (!(id in got) || !close(got[id], want[id])) { return `${id}: drew ${got[id]}, want ${want[id]}`; } }
	return '';
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
	check(ids.indexOf('frequency') === ids.indexOf('profile') + 1 && ids.indexOf('profile') === ids.indexOf('timeseries') + 1,
		`the tab sits after Time series and Profile (menu order, 2026-10-04): ${ids.slice(-4).join(', ')}`);
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

	// ---- 8. Recalculate OFF: the kept snapshot, and an edit still shows ------------------------
	head('8. RECALCULATE OFF: AN EDIT SHOWS, THE SNAPSHOT STAYS');
	d.settings.autoRun = false;
	const J = L.nodeById('10');
	const kept = L.lastResult();
	const pWant = {};
	junctions.forEach((n) => { pWant[n.id] = kept.pressures[n.id] * L.unitFactor('lpn_u_pressure'); });
	S.group = 'node'; S.fields.node = 'elev';
	L.rebuildFreqForm(); L.renderFrequency();
	const elevBefore = J.elev;
	// The edit a person makes: the number changes and scheduleSolve() is told (an elevation is not
	// scenario-overridable and is stored bare, so it is written directly, as manual-recalc-harness.js
	// writes a roughness). With the switch off that solves nothing and refreshes the pane.
	J.elev = elevBefore + 50;
	L.scheduleSolve();
	check(drawn()['10'] !== undefined && close(drawn()['10'], elevBefore + 50),
		`the edited elevation is on the curve at once, with nothing solved: ${drawn()['10']}`);
	check(L.lastResult() === kept, 'and the kept solve is still the one on screen, not cleared');
	const qOff = control('lpn_freq_quantity');
	qOff.value = 'pressure';
	fire(qOff, 'change');
	check(!drawnMatches(pWant) && chartEls('lpn-freq-line').length === 1,
		`pressure still draws the kept snapshot, never hidden: ${drawnMatches(pWant) || 'matches'}`);
	J.elev = elevBefore + 60;
	L.scheduleSolve();
	check(!drawnMatches(pWant) && byId.lpn_freq_note._text !== PC.lpn_freq_none,
		`and a second edit, with pressure on show, leaves the snapshot drawn: ${drawnMatches(pWant) || 'matches'}`);
	J.elev = elevBefore;
	L.scheduleSolve();

	// ---- 9. scenario switch -----------------------------------------------------------------
	head('9. A SCENARIO SWITCH REDRAWS THE CURVE');
	const pSel9 = control('lpn_freq_group');
	pSel9.value = 'link';
	fire(pSel9, 'change');
	const q9 = control('lpn_freq_quantity');
	q9.value = 'diameter';
	fire(q9, 'change');
	const P = L.linkById('10');
	const baseDia = {};
	pipes.forEach((l) => { baseDia[l.id] = L.effective(l, 'diameter'); });
	const scn = L.createScenario('Frequency test');
	L.setProp(P, 'diameter', 99);
	L.scheduleSolve();
	const scnDia = Object.assign({}, baseDia, { '10': 99 });
	check(!drawnMatches(scnDia), `in the new scenario the overridden diameter is drawn: ${drawnMatches(scnDia) || 'matches'}`);
	L.switchScenario(L.baseScenarioId());
	check(!drawnMatches(baseDia), `switched to Base, Base's diameters are drawn: ${drawnMatches(baseDia) || 'matches'}`);
	L.switchScenario(scn.id);
	check(!drawnMatches(scnDia), `and back, the override is drawn again: ${drawnMatches(scnDia) || 'matches'}`);
	L.switchScenario(L.baseScenarioId());

	// ---- 10. Recalculate ON: an edit redraws --------------------------------------------------
	head('10. RECALCULATE ON: AN EDIT RE-SOLVES AND REDRAWS');
	const g10 = control('lpn_freq_group');
	g10.value = 'node';
	fire(g10, 'change');
	const q10 = control('lpn_freq_quantity');
	q10.value = 'pressure';
	fire(q10, 'change');
	d.settings.autoRun = true;
	const oldP10 = drawn()['10'];
	J.elev = elevBefore + 50;
	L.scheduleSolve();
	const t10 = Date.now();
	while (Date.now() - t10 < LIMIT_MS && (L.lastResult() === kept || close(drawn()['10'], oldP10))) { await wait(50); }
	const R10 = L.lastResult(), want10 = {};
	junctions.forEach((n) => { want10[n.id] = R10.pressures[n.id] * L.unitFactor('lpn_u_pressure'); });
	check(R10 !== kept && !drawnMatches(want10),
		`the new solve is drawn: ${drawnMatches(want10) || 'matches'}`);
	check(oldP10 - drawn()['10'] > 15,
		`junction 10, raised 50 ft (about 21.7 psi of static head), drops by more than 15 psi on the curve: ${oldP10.toFixed(2)} -> ${drawn()['10'].toFixed(2)}`);

	// ---- 11. project switch and back --------------------------------------------------------
	head('11. SWITCHING PROJECT TAB AND BACK');
	d.settings.autoRun = false;
	J.elev = elevBefore;
	const lib = L.getLibrary();
	const d2 = L.docFromInp(EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net2.inp', 'utf8')), 'net2');
	d2.settings.autoRun = false;
	lib.projects = [{ id: 'freq-net1', name: 'net1', updated: 0 }, { id: 'freq-net2', name: 'net2', updated: 0 }];
	// Net2 is written to its own slot through the page's own save, then Net1 is put back as the
	// open project, so openProject() below is a real switch between two stored documents.
	lib.openId = 'freq-net2';
	L.setDoc(d2); L.setSettings(d2.settings);
	L.saveToStorage();
	lib.openId = 'freq-net1';
	L.setDoc(d); L.setSettings(d.settings);
	L.saveToStorage();
	const g11 = control('lpn_freq_group');
	g11.value = 'node';
	fire(g11, 'change');
	const q11 = control('lpn_freq_quantity');
	q11.value = 'elev';
	fire(q11, 'change');
	const net1Elev = {};
	junctions.forEach((n) => { net1Elev[n.id] = n.elev; });
	check(!drawnMatches(net1Elev), `Net1's elevations before the switch: ${drawnMatches(net1Elev) || 'matches'}`);
	check(L.openProject('freq-net2') === true, 'switched to the Net2 tab');
	const net2Elev = {};
	L.getDoc().nodes.filter((n) => n.type === 'junction').forEach((n) => { net2Elev[n.id] = n.elev; });
	check(Object.keys(net2Elev).length > 20 && !drawnMatches(net2Elev),
		`the curve is Net2's ${Object.keys(net2Elev).length} junctions: ${drawnMatches(net2Elev) || 'matches'}`);
	check(L.openProject('freq-net1') === true, 'and back to Net1');
	check(!drawnMatches(net1Elev), `the curve is Net1's again: ${drawnMatches(net1Elev) || 'matches'}`);

	head('12. NOTHING STORED');
	const saved = JSON.stringify(L.serialize());
	check(saved.indexOf('freq') < 0, 'nothing about the graph enters serializeProject()');

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
