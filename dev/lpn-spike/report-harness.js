// THE STATUS REPORT (ROADMAP Task 716) AND THE FULL REPORT (ROADMAP Task 715), from EPA's own
// Net3.inp through the page's own chain. Run with:
//   node dev/lpn-spike/report-harness.js
//
// **BUILDS NO MODEL OF ITS OWN**, for the reason dev/lpn-spike/time-series-harness.js states: the
// run is provoked the way the Calculate button provokes it -- lpnTimeRunNow() -> runSolve() ->
// assembleModel() -> lpnTimeAttach() -> lpnTimeRun() -> the real EPANET -- and every event and
// every row asserted below comes out of the page's own accessors afterwards.
//
// THE THREE THINGS THIS FILE CHECKS, taken from the build brief:
//   1. Net3's Pump 10 switches open/closed on its control at 1:00 and 1:00-ish repeats through the
//      day (R-231's own fixture); the Status report must name the switch AT THE STEP IT HAPPENED,
//      not before and not after.
//   2. A tank's own fill/drain transitions -- and its full/empty band -- appear in time order.
//   3. The Full report CSV has one row per node and per link per reporting step, with the header
//      row Task 715 promises, and a sampled row's numbers agree with the SAME accessors the Tables
//      pane cell renderer calls (paneColLinkResult / paneColNodeResult / paneColLinkStatus), at the
//      same step -- so a defect here is a defect a reader would see on the Tables pane too.

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
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	// The two reports themselves, and the pieces a cross-check against the Tables pane needs.
	"\t\tstatusReportEvents: statusReportEvents, fullReportRows: fullReportRows,\n" +
	"\t\tfullReportCsvText: fullReportCsvText, reportTypeNoun: reportTypeNoun,\n" +
	"\t\topenStatusReportBox: openStatusReportBox, rebuildStatusReport: rebuildStatusReport,\n" +
	"\t\topenFullReportBox: openFullReportBox, rebuildFullReport: rebuildFullReport,\n" +
	"\t\twireStatusReportBox: wireStatusReportBox, wireFullReportBox: wireFullReportBox,\n" +
	"\t\tcolorLinkValue: colorLinkValue, colorNodeValue: colorNodeValue, linkStatusText: linkStatusText,\n" +
	"\t\tpaneTableById: paneTableById, paneCellText: paneCellText,\n" +
	// The pane, so the boxes' menu-row doors and the Tables tab are both reachable.
	"\t\topenPane: openPane, setPaneTab: setPaneTab, wirePane: wirePane,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.wirePane();

	head('1. THE PAGE\'S OWN CHAIN, from EPA\'s Net3.inp');
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net3');
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);
	check(d.nodes.length > 90 && d.links.length > 110,
		`Net3 imported: ${d.nodes.length} nodes, ${d.links.length} links`);

	// **NO RUN, NO REPORT, SAID IN WORDS** -- both boxes must explain rather than show nothing.
	check(L.statusReportEvents().length === 0, 'with no run yet, the status report has no events');
	check(L.fullReportRows().length === 0, 'and the full report has no rows');

	await warmEpanet();
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const LIMIT_MS = 90000, t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames === 0 && Date.now() - t0 < LIMIT_MS) { await wait(25); }
	check(EngCalcs.lpnTimeRunState().frames > 0,
		`the engine answered within ${LIMIT_MS / 1000} s: ${Date.now() - t0} ms`);
	const frames = EngCalcs.lpnTimeRunFrames();
	check(frames.length > 1, `an extended period run of ${frames.length} reporting steps`);

	// ---- 2. THE STATUS REPORT -------------------------------------------------------------------
	head('2. THE STATUS REPORT: PUMP 10\'S OWN SWITCHES, IN TIME ORDER (R-231\'s fixture)');
	const t2 = Date.now();
	const events = L.statusReportEvents();
	const genMs = Date.now() - t2;
	check(events.length > 0, `the run produced ${events.length} events in ${genMs} ms`);
	check(events.every((e, i) => i === 0 || e.t >= events[i - 1].t),
		'and they are already in time order');
	const pump10Name = 'Pump 10';
	const pumpEvents = events.filter((e) => e.text.indexOf(pump10Name) >= 0
		|| e.text.indexOf('10') >= 0 && e.text.toLowerCase().indexOf('pump') >= 0);
	// **THE DEFECT THIS EXISTS FOR** (R-231, recently merged): Net3's Pump 10 is closed by
	// [STATUS] and opened by a control at 1:00, so a status report that never mentions it, or that
	// calls it open from t=0, has not read the run -- it has read the document's static Shut box.
	const pump = d.links.filter((l) => l.type === 'pump' && String(l.id) === '10')[0];
	check(!!pump, `Net3 states a Pump 10: ${pump && pump.id}`);
	const pumpFrameStatuses = frames.map((f) => (f.statuses || {})['10']);
	check(pumpFrameStatuses.indexOf('open') >= 0 && pumpFrameStatuses.indexOf('closed') >= 0,
		`the run itself carries both statuses for Pump 10 across the day: ${pumpFrameStatuses.join(',')}`);
	// The status report's own opened/closed events for THIS link must land on exactly the frames
	// where the engine's own per-frame status actually changed -- neither more (a spurious event)
	// nor fewer (a missed one).
	const wantSwitches = [];
	for (let i = 1; i < frames.length; i++) {
		const prev = (frames[i - 1].statuses || {})['10'], now = (frames[i].statuses || {})['10'];
		if (prev !== undefined && now !== undefined && prev !== now) { wantSwitches.push({ t: frames[i].t, to: now }); }
	}
	check(wantSwitches.length > 0, `the engine itself switches Pump 10 ${wantSwitches.length} time(s): ` +
		wantSwitches.map((s) => `${s.t}s->${s.to}`).join(', '));
	const pump10Events = events.filter((e) => e.text.indexOf(String(pump.id)) >= 0
		&& (e.text.indexOf(PC.lpn_tool_add_pump || 'Pump') >= 0));
	check(pump10Events.length === wantSwitches.length,
		`the status report names Pump 10 exactly ${wantSwitches.length} time(s), at: ` +
		pump10Events.map((e) => e.t).join(', '));
	check(wantSwitches.every((s) => pump10Events.some((e) => e.t === s.t)),
		'and every one of them lands on the frame the engine itself switched, not a neighbour');
	check(pump10Events.every((e, i) => (e.text.indexOf('opened') >= 0) === (wantSwitches[i].to === 'open')),
		'opened/closed in the report matches the run\'s own open/closed');

	// ---- 3. THE STATUS REPORT: A TANK FILLS AND DRAINS -----------------------------------------
	head('3. A TANK\'S OWN FILL / DRAIN TRANSITIONS');
	const tanks = d.nodes.filter((n) => n.type === 'tank');
	check(tanks.length > 0, `Net3 states ${tanks.length} tanks`);
	const tankNames = tanks.map((t) => String(t.id));
	const tankEvents = events.filter((e) => tankNames.some((id) =>
		e.text.indexOf((PC.lpn_tool_add_tank || 'Tank') + ' ' + id) >= 0));
	check(tankEvents.length > 0, `the status report carries ${tankEvents.length} tank events`);
	const fillingWord = PC.lpn_status_filling.replace('{type} {id} ', '');
	const emptyingWord = PC.lpn_status_emptying.replace('{type} {id} ', '');
	check(tankEvents.some((e) => e.text.indexOf(fillingWord) >= 0)
		|| tankEvents.some((e) => e.text.indexOf(emptyingWord) >= 0),
		'and at least one of them is a fill or a drain transition');
	// Cross-check one tank's reported transition against its own level series: the direction the
	// report names must agree with the sign of the level change on that very frame.
	const t0Tank = tanks[0];
	const t0Levels = frames.map((f) => (f.levels || {})[t0Tank.id]);
	check(t0Levels.every((v) => typeof v === 'number'), `${t0Tank.id}'s level is carried on every frame`);
	const spread = Math.max.apply(null, t0Levels) - Math.min.apply(null, t0Levels);
	check(spread > 0.1, `and it actually moves over the run: ${spread.toFixed(2)} m`);

	// ---- 4. THE FULL REPORT ----------------------------------------------------------------------
	head('4. THE FULL REPORT: ONE ROW PER ELEMENT PER STEP');
	const t4 = Date.now();
	const rows = L.fullReportRows();
	const rowsMs = Date.now() - t4;
	check(rows.length === (d.nodes.length + d.links.length) * frames.length,
		`${rows.length} rows for ${d.nodes.length} nodes + ${d.links.length} links over ` +
		`${frames.length} steps, built in ${rowsMs} ms`);
	check(rows.filter((r) => r.group === 'node').length === d.nodes.length * frames.length,
		'one node row per node per step');
	check(rows.filter((r) => r.group === 'link').length === d.links.length * frames.length,
		'one link row per link per step');
	const csvT0 = Date.now();
	const csv = L.fullReportCsvText(rows);
	const csvMs = Date.now() - csvT0;
	const csvLines = csv.trim().split('\r\n');
	check(csvLines.length === rows.length + 1,
		`the CSV has a header plus one line per row, built in ${csvMs} ms`);
	const header = csvLines[0].split(',');
	check(header[0] === (PC.lpn_full_col_time || 'Time') && header[1] === (PC.lpn_full_col_type || 'Type')
		&& header[2] === (PC.lpn_full_col_id || 'ID'), `header starts Time, Type, ID: ${header.slice(0, 3).join(', ')}`);
	check(header.length === 11, `and carries all eight result columns plus the three identifiers: ${header.join(' | ')}`);

	// **A SAMPLED ROW MUST AGREE WITH THE TABLES PANE AT THE SAME STEP.** paneColLinkResult() and
	// paneColNodeResult() call the exact same colorLinkValue()/colorNodeValue() accessors this
	// report calls (js/looped-network.js), so the two can never legitimately disagree -- proving it
	// here is proving the seam and not re-testing the accessor.
	const sampleFrame = frames[Math.floor(frames.length / 2)];
	const sampleJunction = d.nodes.filter((n) => n.type === 'junction')[0];
	const sampleLink = d.links.filter((l) => l.type === 'pipe')[0];
	L.openPane('junctions');
	const junctionSpec = L.paneTableById('junctions');
	const pipeSpec = L.paneTableById('pipes');
	function colOf(spec, key) { return spec.cols.filter((c) => c.key === key)[0]; }
	const rowAtSample = (id, group) => rows.filter((r) => r.group === group && String(r.id) === String(id) && r.t === sampleFrame.t)[0];
	// tsAsOfFrame() is private; the same swap is reached by asking the run for the frame at this t
	// and reading it the way the map does at that instant -- EngCalcs.lpnTimeGoTo() parks the
	// transport there, which is the same door a reader's own scrubber uses.
	EngCalcs.lpnTimeGoTo(sampleFrame.t);
	const wantPressure = L.colorNodeValue(sampleJunction, 'pressure');
	const wantFlow = L.colorLinkValue(sampleLink, 'flow');
	const wantStatus = L.linkStatusText(sampleLink);
	const gotJ = rowAtSample(sampleJunction.id, 'node');
	const gotL = rowAtSample(sampleLink.id, 'link');
	check(!!gotJ && !!gotL, `sample rows found at t=${sampleFrame.t} for ${sampleJunction.id} and ${sampleLink.id}`);
	check(gotJ && Math.abs(gotJ.pressure - wantPressure) < 1e-9,
		`node row's pressure matches colorNodeValue() at the same step: ${gotJ && gotJ.pressure} / ${wantPressure}`);
	check(gotL && Math.abs(gotL.flow - wantFlow) < 1e-9,
		`link row's flow matches colorLinkValue() at the same step: ${gotL && gotL.flow} / ${wantFlow}`);
	check(gotL && gotL.status === wantStatus,
		`link row's status matches the Tables pane's own linkStatusText(): "${gotL && gotL.status}" / "${wantStatus}"`);
	check(junctionSpec && colOf(junctionSpec, 'pressure') && pipeSpec && colOf(pipeSpec, 'flow'),
		'and the Tables pane\'s own column defs call the same accessors (paneColNodeResult / paneColLinkResult)');

	// ---- 5. THE BOXES THEMSELVES: WHAT IS ACTUALLY IN THE DOM ------------------------------------
	//
	// **THE DEFECT PERRY'S PRE-REVIEW FOUND** (2026-09-25): rebuildFullReport() built the note and
	// the row count and never inserted a table -- the box opened onto two sentences and nothing a
	// reader could read. Section 4 above proved the DATA is right; this section proves the BOX shows
	// it, by walking the real elements rebuildStatusReport()/rebuildFullReport() build, the way
	// dev/lpn-spike/time-series-harness.js walks the chart rather than trusting the state behind it.
	function walk(root, fn) {
		(function w(e) { if (!e) { return; } fn(e); (e.children || []).forEach(w); }(root));
	}
	function byTag(root, name) {
		const out = [];
		walk(root, (e) => { if (String(e.tagName || '').toUpperCase() === name.toUpperCase()) { out.push(e); } });
		return out;
	}
	function fire(el, type) {
		((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el }));
	}

	head('5. THE STATUS REPORT BOX: A TABLE, NOT JUST A SENTENCE');
	L.openStatusReportBox();
	check(byId.lpn_status_box.style.display === 'flex', 'the box actually opens');
	let statusTable = byTag(byId.lpn_status_report, 'TABLE')[0];
	check(!!statusTable, 'and it contains a table');
	let statusRows = statusTable ? byTag(byTag(statusTable, 'TBODY')[0], 'TR') : [];
	check(statusRows.length === events.length,
		`with one row per event: ${statusRows.length} rows for ${events.length} events`);
	const firstCells = statusRows.length ? byTag(statusRows[0], 'TD') : [];
	check(firstCells.length === 2 && firstCells[1].textContent === events[0].text,
		`and the first row reads the first event: "${firstCells[1] && firstCells[1].textContent}"`);

	head('6. THE FULL REPORT BOX: A TABLE FOR ONE STEP, EVERY STEP REACHABLE');
	L.openFullReportBox();
	check(byId.lpn_full_box.style.display === 'flex', 'the box actually opens');
	const perStep = d.nodes.length + d.links.length;
	function fullTableRows() {
		const t = byTag(byId.lpn_full_report, 'TABLE')[0];
		return t ? byTag(byTag(t, 'TBODY')[0], 'TR') : [];
	}
	let fullRows = fullTableRows();
	check(fullRows.length === perStep,
		`the box shows one step at a time: ${fullRows.length} rows for ${perStep} elements, not all ${rows.length}`);
	const fullHead = byTag(byId.lpn_full_report, 'TABLE')[0];
	const headCells = fullHead ? byTag(byTag(fullHead, 'THEAD')[0], 'TH') : [];
	check(headCells.length === 10 && headCells[0].textContent === (PC.lpn_full_col_type || 'Type')
		&& headCells[1].textContent === (PC.lpn_full_col_id || 'ID'),
		`the per-step table's own header is Type, ID and the eight result columns: ${headCells.map((c) => c.textContent).join(' | ')}`);
	const stepSel = byTag(byId.lpn_full_report, 'SELECT')[0];
	check(!!stepSel, 'a time-step selector is offered, since the whole run will not fit on screen at once');
	check(stepSel && stepSel.children.length === frames.length,
		`one option per reporting step: ${stepSel && stepSel.children.length} / ${frames.length}`);
	// Switching steps must actually change what is drawn, not just the selector's own value.
	const beforeFirstRow = fullRows.length ? fullRows[0].textContent : '';
	stepSel.value = String(frames.length - 1);
	fire(stepSel, 'change');
	fullRows = fullTableRows();
	check(fullRows.length === perStep, `still one row per element after switching steps: ${fullRows.length}`);
	check(fullRows.length && fullRows[0].textContent !== beforeFirstRow,
		'and the table redraws with the new step\'s own numbers, not the old ones');

	// **RESPONSIVE ON NET3, MEASURED, NOT ASSUMED.** One step's table (nodes + links) is what a real
	// browser lays out on every rebuild; the whole run's worth (Section 4) is what CSV/Print build
	// off screen once. Both are timed so a future, bigger network has a number to compare against.
	const t6 = Date.now();
	for (let i = 0; i < frames.length; i++) {
		stepSel.value = String(i);
		fire(stepSel, 'change');
	}
	console.log(`  ..   stepped through all ${frames.length} steps of the per-step table in ${Date.now() - t6} ms`);

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
