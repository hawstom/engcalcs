// THE TIME-SERIES CHART, from EPA's own Net3.inp through the page's own chain. Run with:
//   node dev/lpn-spike/time-series-harness.js
//
// ROADMAP Task 599. One or more assets' chosen value against time across an extended-period run.
//
// **THIS FILE BUILDS NO MODEL, AND THAT IS THE WHOLE OF WHY IT EXISTS IN THIS SHAPE.** Task 582
// shipped with five green sections because every one of them handed the engine a model the harness
// had assembled itself, so the page's only document-to-model bridge could put nothing on it and
// nothing noticed (dev/session-handoff.md section 3). So the run here is provoked the way the
// Calculate button provokes it -- lpnTimeRunNow() -> runSolve() -> assembleModel() ->
// lpnTimeAttach() -> lpnTimeRun() -> the real EPANET -- and every number asserted comes out of the
// page's own accessors afterwards.
//
// THE FIVE WAYS THIS FEATURE CAN BE WRONG WHILE DRAWING A PERFECTLY CONVINCING CHART:
//
//   1. **EVERY LINE IS FLAT.** A reader that took one frame and repeated it, or that read
//      `lastSolveResult` once instead of per step, draws N straight lines. Nothing errors, the
//      axes are right, and it looks like a network that does not move.
//   2. **A TANK IS FLAT while everything else moves.** A tank's water surface is an INPUT to a
//      steady state and a RESULT of a run, and colorNodeValue() read the document for it -- so the
//      one asset whose graph anybody wants was the one asset with nothing to show.
//   3. **A PATTERN-DERIVED VALUE IS FLAT AT TODAY'S HOUR.** A resolved demand is its base times the
//      multiplier at modelTimeSeconds(), which is where the TRANSPORT is parked. Read without
//      moving that clock, every point of a demand line carries the same multiplier.
//   4. **THE NUMBERS ARE IN SI while the axis names the project's unit.** The chart must go through
//      the same value-and-unit seam the map label and the asset table go through, or it is a second
//      opinion about a conversion.
//   5. **THE CLOCK IS LEFT MOVED.** Reading as of a frame swaps two module variables; a path that
//      does not put them back leaves the MAP drawn at the wrong moment, which is a wrong number on
//      the drawing and not merely on the chart.

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
// Read from the real lib/lang.ec.en.php the stub loads, so a rewording is not a red build here
// (dev/scripts/harness_wording_check.php).
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
	// The import and install seam -- the same three calls opening a file makes.
	"\t\tdocFromInp: docFromInp, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, getDoc: function () { return doc; },\n" +
	"\t\tsetDoc: function (d) { doc = d; }, setSettings: function (s) { settings = s; },\n" +
	// The page's own solve door, which is what the transport and the Calculate button both reach.
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tmodelTime: modelTimeSeconds,\n" +
	// The pane, so the tab is opened the way a reader opens it.
	"\t\topenPane: openPane, setPaneTab: setPaneTab, wirePane: wirePane,\n" +
	"\t\tpaneTabIds: function () { return paneTabs.map(function (t) { return t.id; }); },\n" +
	// The chart itself, and the state behind it.
	"\t\ttsState: function () { return tsState; }, tsSeries: tsSeries, tsPicks: tsPicks,\n" +
	"\t\ttsField: tsField, renderTimeSeries: renderTimeSeries, rebuildTsForm: rebuildTsForm,\n" +
	"\t\ttsAddSelection: tsAddSelection,\n" +
	// The value-and-unit seam the chart must be reading and not duplicating.
	"\t\tcolorValueOf: colorValueOf, colorFieldUnitText: colorFieldUnitText,\n" +
	"\t\tcolorFieldLabel: colorFieldLabel, colorFieldOptions: colorFieldOptions,\n" +
	"\t\tunitLabel: unitLabel, unitFactor: unitFactor, nodeById: nodeById,\n" +
	"\t\tsetSelectionList: setSelectionList, serialize: serializeProject,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;

// Every element of the drawn chart carrying `cls`, anywhere in the SVG tree.
function chartEls(cls) {
	const out = [];
	(function walk(e) {
		if (!e) { return; }
		if (String(e['class'] || '').split(/\s+/).indexOf(cls) >= 0) { out.push(e); }
		(e.children || []).forEach(walk);
	}(byId.lpn_ts_chart));
	return out;
}
function chartText() {
	const parts = [];
	(function walk(e) {
		if (!e) { return; }
		// A stub text node is {nodeType: 3, textContent}; an element's own characters are whatever
		// text nodes hang off it. Reading `_text` here would collect the boolean flag beside them.
		if (e.nodeType === 3) { parts.push(String(e.textContent)); }
		(e.children || []).forEach(walk);
	}(byId.lpn_ts_chart));
	return parts.join(' | ');
}
const spread = (ys) => Math.max.apply(null, ys) - Math.min.apply(null, ys);
const finite = (s) => s.points.filter((p) => p.y !== undefined).map((p) => p.y);

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	// **THE PANE IS WIRED, so the tab strip is the page's own strip.** Without this the tab exists
	// in paneTabs and has no button, and "can a reader reach the chart" would be untested.
	L.wirePane();

	// ---- parse, import, install: the three calls opening a file makes --------------------------
	head('1. THE PAGE\'S OWN CHAIN, from EPA\'s Net3.inp');
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net3');
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);
	check(d.nodes.length > 90 && d.links.length > 110,
		`Net3 imported through docFromInp(): ${d.nodes.length} nodes, ${d.links.length} links`);
	check(EngCalcs.lpnTimeIsExtended(d.times),
		`and it states a run: duration ${EngCalcs.lpnFormatTime(d.times.duration)}`);

	// **NO RUN MEANS NO CHART, SAID IN WORDS.** Before the engine has answered there are no frames,
	// and the panel must say so rather than draw an empty axis pair -- which reads as a chart that
	// failed. Asserted against pageConfig, never against English (harness_wording_check.php).
	L.openPane('timeseries');
	check(byId.lpn_ts_note._text === PC.lpn_ts_no_frames,
		`with no run yet the panel says so and draws nothing: "${byId.lpn_ts_note._text}"`);
	check(chartEls('lpn-ts-line').length === 0, 'and there is no line, and no axis frame, to misread');

	await warmEpanet();
	// THE CALCULATE BUTTON'S OWN DOOR. requestRun -> host.solveNow() -> runSolve() -> assembleModel()
	// -> lpnTimeAttach() -> lpnTimeRun() -> the real engine. Nothing between the file and the frames
	// is built here.
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	// **BOUNDED, AND LOUD WHEN THE BOUND IS REACHED.** A poll with no ceiling is the shape
	// .claude/hooks/guard-wait-loops.php exists to refuse, and 90 s is generous on purpose: this
	// waits on the real engine solving Net3 over 25 steps, and a machine running several harness
	// suites at once took longer than a 10 s bound allowed -- which read as a feature failure.
	const LIMIT_MS = 90000, t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames === 0 && Date.now() - t0 < LIMIT_MS) {
		await wait(25);
	}
	check(EngCalcs.lpnTimeRunState().frames > 0,
		`the engine answered within ${LIMIT_MS / 1000} s: ${Date.now() - t0} ms`);
	const frames = EngCalcs.lpnTimeRunFrames();
	check(frames.length === EngCalcs.lpnReportTimes(d.times).length,
		`the run reached the chart's reader: ${frames.length} frames for ` +
		`${EngCalcs.lpnReportTimes(d.times).length} reporting stops`);
	if (!frames.length) {
		console.log('\nno frames, so nothing below can be asserted');
		process.exit(1);
	}
	check(frames.every((f, i) => i === 0 || f.t > frames[i - 1].t),
		'and every frame carries its own ascending t, so no stop repeats its predecessor');

	// ---- 2. the lines move ---------------------------------------------------------------------
	head('2. A LINE IS A SERIES AND NOT A REPEATED FRAME');
	const S = L.tsState();
	const junctions = d.nodes.filter((n) => n.type === 'junction').map((n) => n.id);
	S.group = 'node';
	S.fields.node = 'pressure';
	S.picks.node = junctions.slice(0, 3);
	L.renderTimeSeries();
	let series = L.tsSeries(frames);
	check(series.length === 3, `three assets give three series: ${series.map((s) => s.id).join(', ')}`);
	check(series.every((s) => s.points.length === frames.length),
		`each with one point per reporting stop: ${series[0].points.length}`);
	// THE FAILURE THIS CATCHES: a reader that read the current solve once draws a flat line at
	// today's number, with the axes, the legend and the summary all perfectly correct.
	const moved = series.filter((s) => spread(finite(s)) > 0.5);
	check(moved.length === series.length,
		`every junction's pressure MOVES over the day: ` +
		series.map((s) => `${s.id} ${spread(finite(s)).toFixed(1)} ${L.unitLabel('lpn_u_pressure')}`).join(', '));
	check(new Set(series.map((s) => s.color)).size === 3,
		'and the three lines are three colors, so a reader can tell them apart');

	// ---- 3. a tank's water surface is a RESULT inside a run ------------------------------------
	head('3. A TANK FILLS AND DRAINS (the fixed-head read, Task 599)');
	const tanks = d.nodes.filter((n) => n.type === 'tank');
	check(tanks.length > 0, `Net3 states ${tanks.length} tanks, which is why it is the fixture`);
	S.picks.node = tanks.map((t) => t.id);
	S.fields.node = 'head';
	series = L.tsSeries(frames);
	// **THE DEFECT THIS EXISTS FOR.** colorNodeValue() answered the DOCUMENT's stored level for a
	// fixed-head node whatever the frame said, so the one asset a time series is really for was a
	// horizontal line -- and so was its label on the map while the transport played.
	const tankSpread = series.map((s) => spread(finite(s)));
	check(tankSpread.every((v) => v > 1),
		`every tank's head moves across the run: ` +
		series.map((s, i) => `${s.id} ${tankSpread[i].toFixed(2)} ${L.unitLabel('lpn_u_elevhead')}`).join(', '));
	// **AND THE DOCUMENT IS UNTOUCHED BY HAVING BEEN GRAPHED.** The stored level is the user's
	// initial condition; CLAUDE.md's rule is that a computed number and a supplied one never occupy
	// the same field, and a reader that wrote the frame's level back would break it silently.
	const levelsNow = tanks.map((t) => t.level);
	L.renderTimeSeries();
	check(tanks.every((t, i) => t.level === levelsNow[i]),
		`and drawing the chart wrote nothing into the document: ${JSON.stringify(levelsNow)}`);

	// ---- 4. a pattern-derived value is read AS OF its own frame --------------------------------
	head('4. THE PATTERN CLOCK MOVES WITH THE FRAME, NOT WITH THE TRANSPORT');
	// **JUNCTIONS THAT ACTUALLY DRAW WATER.** Net3's node 10 has a base demand of 0, and a
	// multiplier times nothing is nothing at every hour -- so asserting on it would be asserting
	// that a flat line is flat, which is the very failure this section exists to catch.
	const drawing = d.nodes.filter((n) => n.type === 'junction' && +n._demand > 0).map((n) => n.id);
	check(drawing.length >= 2, `${drawing.length} of Net3's junctions state a base demand`);
	S.picks.node = drawing.slice(0, 2);
	S.fields.node = 'demandActual';
	const parkedBefore = L.modelTime();
	series = L.tsSeries(frames);
	// A resolved demand is base x multiplier(t). Net3 names `Pattern 1` in [OPTIONS], so every
	// junction follows it -- read at one fixed t, every point of this line is the same number.
	check(series.every((s) => spread(finite(s)) > 1e-9),
		`a resolved demand varies across the run: ` +
		series.map((s) => `${s.id} ${spread(finite(s)).toFixed(3)} ${L.unitLabel('lpn_u_flow')}`).join(', '));
	// **AND THE CLOCK IS PUT BACK.** tsAsOfFrame() swaps modelTimeSeconds()'s answer and
	// lastSolveResult; a path that leaves either moved draws the MAP at the wrong moment.
	check(L.modelTime() === parkedBefore,
		`and the transport is still parked where it was: ${L.modelTime()} s`);
	check(L.lastResult() && L.lastResult().t === EngCalcs.lpnTimeNow(),
		'and lastSolveResult is the frame the transport is showing, not the last one plotted');

	// ---- 5. every number comes through the page's one value-and-unit seam ----------------------
	head('5. THE CHART CANNOT DISAGREE WITH THE MAP');
	S.picks.node = junctions.slice(0, 1);
	S.fields.node = 'pressure';
	series = L.tsSeries(frames);
	const nowT = EngCalcs.lpnTimeNow();
	const atNow = series[0].points.filter((p) => p.t === nowT)[0];
	const onMap = L.colorValueOf('node', L.nodeById(series[0].id), 'pressure');
	check(atNow && Math.abs(atNow.y - onMap) < 1e-9,
		`the point at the transport's own time IS the number beside the node: ${atNow && atNow.y} / ${onMap}`);
	// **IN THE PROJECT'S UNIT, WHICH IS WHAT THE AXIS NAMES.** Net3 is a GPM/psi file, so the frame
	// holds metres of water and the chart must hold psi -- a factor of about 1.42, which is a
	// different number from the SI one and not a rounding away from it.
	const si = frames[EngCalcs.lpnTimeFrameIndexAt(frames, nowT)].pressures[series[0].id];
	check(Math.abs(atNow.y - si * L.unitFactor('lpn_u_pressure')) < 1e-9,
		`converted by the project's own pressure selector: ${si.toFixed(4)} SI -> ${atNow.y.toFixed(4)} ` +
		L.unitLabel('lpn_u_pressure'));
	// **STATED AS THE FACTOR, NOT AS A MAGNITUDE.** `|display - SI| > 1` was the first form and it
	// is a bad test: Net3 node 10 sits at -0.45 m of water, so the two numbers are 0.19 apart and a
	// chart reading raw SI would have passed. What is actually being claimed is that the selector's
	// factor is not the identity and that the value went through it.
	check(Math.abs(L.unitFactor('lpn_u_pressure') - 1) > 0.1,
		`and the project's pressure factor is not 1, so raw SI would be a different number: ` +
		L.unitFactor('lpn_u_pressure').toFixed(6));
	// The y-axis title is the quantity's whole label with the project's unit in parentheses -- the
	// same expression renderColorLegend() uses for its heading, so the two cannot word it
	// differently.
	L.renderTimeSeries();
	const wantTitle = L.colorFieldLabel('node', 'pressure') + ' (' + L.colorFieldUnitText('node', 'pressure') + ')';
	check(chartText().indexOf(wantTitle) >= 0,
		`and the y axis says so: "${wantTitle}"`);
	check(chartText().indexOf(PC.lpn_ts_axis_time) >= 0, 'with the time axis named beside it');

	// A quantity with NO unit must print its heading bare rather than an empty parenthesis --
	// colorFieldUnitText() answers '' for a dimensionless one, and the chart must honour that.
	S.group = 'link';
	S.fields.link = 'friction';
	S.picks.link = d.links.filter((l) => l.type === 'pipe').slice(0, 1).map((l) => l.id);
	L.renderTimeSeries();
	check(chartText().indexOf('()') < 0,
		`a dimensionless quantity prints its heading bare: "${L.colorFieldLabel('link', 'friction')}"`);

	// ---- 6. a gap is a break and never an interpolation ---------------------------------------
	head('6. A MISSING VALUE BREAKS THE LINE');
	const pumps = d.links.filter((l) => l.type === 'pump').map((l) => l.id);
	check(pumps.length > 0, `Net3 states ${pumps.length} pumps`);
	S.group = 'link';
	S.fields.link = 'velocity';
	S.picks.link = pumps.slice(0, 1);
	series = L.tsSeries(frames);
	// A pump has no velocity -- colorLinkValue() answers undefined for it, and the whole point of
	// carrying `undefined` rather than dropping the point is that the renderer must not join across
	// the gap and draw a number nobody computed.
	check(series[0].points.every((p) => p.y === undefined),
		'a pump has no velocity at any step, so every point is absent rather than zero');
	L.renderTimeSeries();
	check(chartEls('lpn-ts-line').length === 0,
		'and nothing is drawn for it -- not a line along the axis floor');

	// ---- 7. the reader's own gestures ----------------------------------------------------------
	head('7. CHOOSING WHAT TO GRAPH');
	S.group = 'node';
	S.fields.node = 'pressure';
	S.picks.node = [];
	L.setSelectionList([{ kind: 'node', id: junctions[0] }, { kind: 'node', id: junctions[1] }]);
	L.tsAddSelection();
	check(L.tsPicks().length === 2,
		`Add selected puts the map's own subject on the graph: ${L.tsPicks().join(', ')}`);
	L.tsAddSelection();
	check(L.tsPicks().length === 2, 'and pressing it again does not plot the same asset twice');
	// Nothing of this group chosen is SAID. A button that silently does nothing cannot be told from
	// a broken one.
	L.setSelectionList([]);
	L.tsAddSelection();
	check(byId.lpn_ts_note._text === PC.lpn_ts_add_none,
		`an empty selection is answered out loud: "${byId.lpn_ts_note._text}"`);
	// The chips are the legend AND the picker, so one press takes an asset off.
	S.picks.node = junctions.slice(0, 3);
	L.rebuildTsForm();
	const chips = (byId.lpn_ts_form.children || []).filter((c) =>
		String(c['class'] || '').indexOf('lpn-ts-chip') >= 0);
	check(chips.length === 3, `one chip per plotted asset: ${chips.length}`);
	check(chips.every((c) => (c.children || []).some((k) =>
		String(k['class'] || '').indexOf('lpn-ts-swatch') >= 0)),
		'each wearing its own line\'s color, so the chips are the key as well as the picker');
	(chips[0]._listeners.click || []).forEach((f) => f());
	check(L.tsPicks().length === 2, `and pressing one takes it off: ${L.tsPicks().join(', ')}`);
	// An asset that has left the document is dropped from what is DRAWN and left in the state: a
	// delete is one undo away, and a list quietly rewritten could not come back with it.
	S.picks.node = [junctions[0], 'NOSUCHNODE'];
	check(L.tsPicks().length === 1 && S.picks.node.length === 2,
		'an id whose element is gone is not drawn, and not forgotten either');

	// ---- 7b. the two pull-downs, driven ---------------------------------------------------------
	//
	// **THE DEFECT THIS SECTION EXISTS FOR** (Tom, 2026-09-17: *"I am not able to change Nodes to
	// Links."*). Section 7 above sets `tsState` DIRECTLY and every check in it passed while half the
	// feature was unreachable, because writing the state is not the gesture -- the gesture is a
	// pull-down, and the handler on it read the wrong variable. So everything below goes through the
	// controls the reader actually meets, and nothing here touches tsState by hand.
	//
	// Found by walking the form the page built, never through getElementById: the stub answers that
	// only for the ids it pre-creates, and rebuildTsForm() makes its controls with createElement.
	head('7b. THE PULL-DOWNS, PRESSED RATHER THAN SET');
	function tsControl(id) {
		return (byId.lpn_ts_form.children || []).filter((c) => c.id === id)[0] || null;
	}
	function tsOptionValues(id) {
		const c = tsControl(id);
		return c ? (c.children || []).map((o) => o.value) : [];
	}
	function fire(el, type) {
		((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el }));
	}
	S.group = 'node';
	S.fields.node = 'pressure';
	S.fields.link = '';
	L.rebuildTsForm();
	check(tsControl('lpn_ts_group') && tsControl('lpn_ts_group').value === 'node',
		'the group control opens on Nodes');
	check(tsOptionValues('lpn_ts_group').join(',') === 'node,link',
		`and offers both groups: ${tsOptionValues('lpn_ts_group').join(', ')}`);
	// The gesture: choose Links, exactly as a pointer does -- the browser writes the value, then the
	// change event runs the page's own handler.
	const groupSel = tsControl('lpn_ts_group');
	groupSel.value = 'link';
	fire(groupSel, 'change');
	check(L.tsState().group === 'link',
		`choosing Links really switches the graph to links: group is now "${L.tsState().group}"`);
	// **AND THE CONTROL DOES NOT SNAP BACK**, which is what a reader sees. The handler rebuilds the
	// row, so this is the rebuilt control and not the one that was pressed.
	check(tsControl('lpn_ts_group') && tsControl('lpn_ts_group').value === 'link',
		'and the control still reads Links after the row is rebuilt');
	check(tsOptionValues('lpn_ts_quantity')[0] === 'velocity',
		`the quantity list becomes the LINK fields: ${tsOptionValues('lpn_ts_quantity').join(', ')}`);
	check(L.tsPicks().length > 0,
		`and the graph seeds itself with links rather than opening blank: ${L.tsPicks().join(', ')}`);
	// The quantity control, driven the same way -- it worked, and it is one line from the one that
	// did not, so it is held here rather than assumed.
	const fieldSel = tsControl('lpn_ts_quantity');
	fieldSel.value = 'flow';
	fire(fieldSel, 'change');
	check(L.tsState().fields.link === 'flow' && L.tsField() === 'flow',
		`choosing a quantity sticks: ${L.tsField()}`);
	// Back to Nodes, which must bring the node question back rather than a default: the two groups
	// keep their own field and their own picks.
	const groupSel2 = tsControl('lpn_ts_group');
	groupSel2.value = 'node';
	fire(groupSel2, 'change');
	check(L.tsState().group === 'node' && L.tsField() === 'pressure',
		`and switching back restores the node question: ${L.tsField()}`);
	check(tsOptionValues('lpn_ts_quantity')[0] === 'pressure',
		`with the NODE fields offered again: ${tsOptionValues('lpn_ts_quantity').join(', ')}`);

	// **AN INITIAL CONDITION IS NOT A SERIES** (Tom, 2026-09-17: *"Initial quality: This is the
	// wrong property to offer for nodes, since it's 'Initial'. Instead, offer Concentration."*). A
	// node's initial quality is one typed number the run never revisits, so its graph is a flat line
	// that means nothing, and `quality` -- the concentration the engine integrates -- is the reading
	// beside it that anybody asking for it wanted.
	check(tsOptionValues('lpn_ts_quantity').indexOf('initQuality') < 0,
		'Initial quality is not offered for nodes');
	check(tsOptionValues('lpn_ts_quantity').indexOf('quality') >= 0,
		'while Concentration, which the run really does move, still is');
	// Removed from THIS pull-down and from nothing else: it is still a node property and still a
	// colour field on the map, where a single instant is all a map ever shows.
	check(L.colorFieldOptions('node').map((o) => o[0]).indexOf('initQuality') >= 0,
		'and it is still a field the MAP can be colored by, which is untouched');

	// ---- 8. the pane, and what is NOT stored ---------------------------------------------------
	head('8. A TAB IN THE STRIP, AND NO NEW STORAGE');
	const ids = L.paneTabIds();
	check(ids.indexOf('timeseries') >= 0, `the strip carries the tab: ${ids.join(', ')}`);
	check(ids[ids.length - 1] === 'profile',
		'and PROFILE IS STILL LAST -- Tom\'s own ordering, 2026-08-21');
	// Found by walking the strip the page built, NOT through getElementById: the stub answers that
	// only for the ids it pre-creates, and wirePane() makes its buttons with createElement -- so a
	// lookup would be null for a button that is genuinely there.
	const tabBtn = (byId.lpn_pane_tabs.children || [])
		.filter((b) => b.id === 'lpn_pane_tab_timeseries')[0];
	check(!!tabBtn, 'with a button a reader can actually press');
	check(tabBtn && tabBtn.textContent === PC.lpn_ts_menu, 'named out of the language file');
	check(tabBtn && tabBtn.title === PC.lpn_ts_tip, 'and carrying its own tip');
	// **FURNITURE IS THE BROWSER'S AND MODELLING DATA IS THE PROJECT'S; A GRAPH SELECTION IS
	// NEITHER** (Task 584). What is plotted is this reader's question in this session, the same
	// standing as which saved path is selected -- so it must not reach the project file.
	const saved = JSON.stringify(L.serialize());
	check(saved.indexOf('"ts') < 0 && saved.indexOf('timeseries') < 0,
		'and nothing about the graph enters serializeProject()');

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
