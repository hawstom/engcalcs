// THE CALIBRATION REPORT (ROADMAP Task 601): measured field data against the model. Run with:
//   node dev/lpn-spike/calibration-harness.js
//
// Tom, 2026-09-06: *"EPANET allows calibration files (measured system data) and offers a
// Calibration Report with three tabbed pages. See EPANET help."* The first feature that brings
// data from OUTSIDE the model onto this page, so the defects this file is written against are the
// ones an import has:
//
//   1. **A LINE MISREAD.** EPANET's format lets a line omit the location ID (it continues the one
//      above), takes decimal hours or hours:minutes, and puts comments after `;`. A reader that
//      gets any of those wrong shifts every later measurement onto the wrong place or time, and
//      the statistics still look like statistics.
//   2. **A LOCATION THE NETWORK DOES NOT HAVE, DROPPED SILENTLY** -- or the file refused over it.
//      CLAUDE.md's .inp import rule: report it, list it, count it, and use the rest.
//   3. **THE WRONG STATISTIC.** EPANET's "Mean Error" is the mean ABSOLUTE difference, and its
//      correlation is between the per-location MEANS. A signed mean error or a correlation over
//      every point draws the same table with different numbers in it. Checked against a hand-worked
//      example, not against the code's own output.
//   4. **A COMPUTED VALUE THAT IS NOT THE ONE ON THE TABLES PANE.** The computed side must come from
//      the same frames and the same accessors as the Full report.
//   5. **SOMETHING WRITTEN TO THE VISITOR'S DEVICE.** The file is held in memory only.
//
// Section 4 onward runs the page's own chain on EPA's Net3 (lpnTimeRunNow() -> the real EPANET),
// as dev/lpn-spike/report-harness.js does, and loads dev/lpn-spike/reference/Net3-pressure.dat,
// the same sample file Tom is given to load in the browser.

const fs = require('fs');
const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-calib.js'));
const C = global.EngCalcs.lpnCalib;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }
const near = (a, b, tol) => typeof a === 'number' && Math.abs(a - b) <= (tol || 1e-9);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 1. PARSING ----------------------------------------------------------------------------------
head('1. THE FILE FORMAT: both time forms, comments, continuation lines, a bad line');
{
	check(C.parseTime('6.4') === 6.4 * 3600, `decimal hours: 6.4 -> ${C.parseTime('6.4')} s`);
	check(C.parseTime('6:24') === 6 * 3600 + 24 * 60, `hours:minutes: 6:24 -> ${C.parseTime('6:24')} s`);
	check(C.parseTime('1:00:30') === 3630, `hours:minutes:seconds: 1:00:30 -> ${C.parseTime('1:00:30')} s`);
	check(C.parseTime('26:00') === 26 * 3600, 'hours past 24 are hours, not a clock');
	check(isNaN(C.parseTime('6:75')) && isNaN(C.parseTime('-1')) && isNaN(C.parseTime('noon')),
		'minutes over 59, a negative time, and a word are not times');
	// EPANET's own example from the manual, section 5.3, verbatim apart from the bad line and the
	// trailing comment added here.
	const text = ';Fluoride Tracer Measurements\n;Location  Time   Value\n;--------------------------\n' +
		'       N1    0      0.5\n             6.4    1.2\n            12:42   0.9   ; a trailing comment\n' +
		'       N2    0.5    0.72\n             5.6    0.77\n   this line is not data at all\n' +
		'       N3    abc    1.0\n';
	const p = C.parse(text);
	check(p.obs.length === 5, `five measurements read: ${p.obs.length}`);
	check(p.order.join(',') === 'N1,N2', `locations in file order, each once: ${p.order.join(',')}`);
	check(p.obs[1].id === 'N1' && p.obs[1].t === 6.4 * 3600 && p.obs[1].v === 1.2,
		'a line with only a time and a value continues the location above it');
	check(p.obs[2].t === 12 * 3600 + 42 * 60 && p.obs[2].v === 0.9, 'hours:minutes in the file, and the trailing comment is ignored');
	check(p.obs[4].id === 'N2' && p.obs[4].v === 0.77, 'continuation follows the most recent location, N2');
	check(p.bad.length === 2 && p.bad[0].line === 9 && p.bad[1].line === 10,
		`the unreadable lines are reported by number, not dropped: ${p.bad.map((b) => b.line).join(', ')}`);
	// **PERRY'S PRE-REVIEW, 2026-10-03: an unreadable line's ID still names the location below it.**
	// The ID-less lines after `J1 6:00 n/a` went to the location BEFORE J1; EPANET files them under J1.
	const afterBad = C.parse('15 0 42.1\nJ1 6:00 n/a\n 7:00 40\n 8:00 41\n');
	check(afterBad.bad.length === 1 && afterBad.obs.filter((o) => o.id === 'J1').length === 2 &&
		afterBad.obs.filter((o) => o.id === '15').length === 1,
		`continuation lines after an unreadable line are filed under ITS ID, J1: ${afterBad.obs.map((o) => o.id).join(',')}`);
	check(afterBad.order.join(',') === '15,J1', 'and J1 is a location of the file');
	// A comma separates like a space or a tab (EPANET's Uutils.pas tokenizer).
	const commas = C.parse('15,0,42.1\n,3,44.0\n35 , 0:30 , 58.4\n');
	check(commas.bad.length === 0 && commas.obs.length === 3 && commas.obs[1].id === '15' && commas.obs[2].v === 58.4,
		`comma-separated lines are read: ${commas.obs.map((o) => o.id + '@' + o.t + '=' + o.v).join(' ')}`);
	const lead = C.parse('  6  40.1\nJ1 1 40\n');
	check(lead.bad.length === 1 && lead.bad[0].line === 1 && lead.obs.length === 1,
		'a two-value line before any location is reported, since it has no place to belong');
}

// ---- 2. STATISTICS -------------------------------------------------------------------------------
head('2. EPANET\'S STATISTICS against a hand-worked example');
{
	// A: (50,52) (60,57)          n 2, means 55 / 54.5, mean error (2+3)/2 = 2.5, RMS sqrt(13/2)
	// B: (40,40) (42,45) (44,44)  n 3, means 42 / 43,   mean error 3/3 = 1,       RMS sqrt(9/3)
	// C: (30,31)                  n 1, means 30 / 31,   mean error 1,             RMS 1
	// Network: n 6, means 266/6 / 269/6, mean error 9/6 = 1.5, RMS sqrt(23/6).
	// Correlation between MEANS, X = 55, 42, 30 and Y = 54.5, 43, 31: 0.999374 (two-pass formula,
	// worked separately). A signed mean error would give A -0.5 and the network 0.5.
	const P = (pairs) => pairs.map((q) => ({ t: 0, o: q[0], s: q[1] }));
	const st = C.stats([
		{ id: 'A', pairs: P([[50, 52], [60, 57]]) },
		{ id: 'B', pairs: P([[40, 40], [42, 45], [44, 44]]) },
		{ id: 'C', pairs: P([[30, 31]]) },
		{ id: 'D', pairs: [] }
	]);
	const A = st.locations[0], B = st.locations[1], N = st.network;
	check(A.n === 2 && A.obsMean === 55 && A.simMean === 54.5, `A: n ${A.n}, observed mean ${A.obsMean}, computed mean ${A.simMean}`);
	check(A.meanErr === 2.5, `A: mean error is the mean ABSOLUTE difference, 2.5: ${A.meanErr}`);
	check(near(A.rmsErr, Math.sqrt(6.5)), `A: RMS error sqrt(6.5) = 2.5495: ${A.rmsErr}`);
	check(B.meanErr === 1 && near(B.rmsErr, Math.sqrt(3)), `B: mean error 1, RMS 1.7321: ${B.meanErr}, ${B.rmsErr}`);
	check(st.locations[3].n === 0 && st.locations[3].obsMean === undefined,
		'a location with nothing compared keeps its row, with no means');
	check(N.n === 6 && near(N.obsMean, 266 / 6) && near(N.simMean, 269 / 6),
		`network: n 6, means pooled over every measurement: ${N.obsMean.toFixed(4)}, ${N.simMean.toFixed(4)}`);
	check(N.meanErr === 1.5 && near(N.rmsErr, Math.sqrt(23 / 6)), `network: mean error 1.5, RMS 1.9579: ${N.meanErr}, ${N.rmsErr}`);
	check(near(st.r, 0.9993744287510941, 1e-12), `correlation between means 0.99937: ${st.r}`);
	check(C.stats([{ id: 'A', pairs: P([[1, 2]]) }]).r === undefined,
		'one location has no correlation, rather than a made-up zero');
}

// ---- 3. INTERPOLATION ----------------------------------------------------------------------------
head('3. A MEASUREMENT BETWEEN REPORTING STEPS is compared with the value interpolated between them');
{
	const T = [0, 3600, 7200], V = [10, 20, 40];
	check(C.interp(T, V, 1800) === 15 && C.interp(T, V, 5400) === 30, 'halfway between steps is halfway between values');
	check(C.interp(T, V, 3600) === 20, 'exactly on a step is that step');
	check(C.interp(T, V, 7300) === undefined && C.interp(T, V, -1) === undefined, 'never extrapolated past the run');
	check(C.interp(T, [10, undefined, 40], 1800) === undefined, 'never carried across a missing value');
	check(C.interp([0], [5], 0) === 5 && C.interp([0], [5], 60) === undefined, 'a single solve answers only at its own time');
}

// ---- 4. THE PAGE ---------------------------------------------------------------------------------
const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tsetDoc: function (d) { doc = d; }, setSettings: function (s) { settings = s; },\n" +
	"\t\tfullReportRows: fullReportRows, serialize: serializeProject,\n" +
	"\t\tcalibCompute: calibCompute, landCalibText: landCalibText, wireCalibBox: wireCalibBox,\n" +
	"\t\tcalibBoxIsOpen: calibBoxIsOpen, setCalibParam: function (k) { calibParam = k; },\n" +
	"\t\tsetOpenId: function (id) { library.openId = id; }, getOpenId: function () { return library.openId; },\n" +
	"\t\tsetLastResult: function (r) { lastSolveResult = r; }, calibColor: calibColor,\n" +
	"\t\tcalibRow: function () {\n" +
	"\t\t\tvar pc = EngCalcs.pageConfig || {};\n" +
	"\t\t\treturn reportMenuRows().filter(function (r) { return r && r.label === pc.lpn_reports_calib; })[0] || null;\n" +
	"\t\t},\n" +
	"\t\topenPane: openPane, wirePane: wirePane, tsState: function () { return tsState; },\n" +
	"\t\trenderTimeSeries: renderTimeSeries,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;
function walk(root, fn) { (function w(e) { if (!e) { return; } fn(e); (e.children || []).forEach(w); }(root)); }
function byTag(root, name) {
	const out = [];
	walk(root, (e) => { if (String(e.tagName || '').toUpperCase() === name.toUpperCase()) { out.push(e); } });
	return out;
}
function byClass(root, cls) {
	const out = [];
	walk(root, (e) => {
		const c = String(e['class'] || e.className || (e.getAttribute && e.getAttribute('class')) || '');
		if (c.split(/\s+/).indexOf(cls) >= 0) { out.push(e); }
	});
	return out;
}
function textOf(e) {
	const parts = [];
	walk(e, (n) => { if (n.nodeType === 3) { parts.push(String(n.textContent)); } else if (n._text) { parts.push(String(n._text)); } });
	return parts.join(' ');
}
// Elements built in JS are not registered by id in the stub, so they are found by walking.
function findId(root, id) {
	let hit = null;
	walk(root, (e) => { if (!hit && e.id === id) { hit = e; } });
	return hit;
}
function fire(el, type) {
	((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el }));
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.wirePane();
	['lpn_calib_box', 'lpn_calib_report', 'lpn_calib_close', 'lpn_calib_file'].forEach(ensure);
	L.wireCalibBox();

	head('4. NET3 THROUGH THE PAGE\'S OWN CHAIN, then the sample calibration file');
	const d = L.docFromInp(EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8')), 'net3');
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);

	const row = L.calibRow();
	check(!!row, `Reports carries a ${PC.lpn_reports_calib} row`);

	// Every localStorage write from here to section 8, where the time-series PANE is opened (the
	// pane's own height is browser furniture and is not this feature's write).
	const writes = [];
	const realSet = global.localStorage.setItem;
	global.localStorage.setItem = function (k, v) { writes.push(k); return realSet.call(this, k, v); };
	// **BEFORE ANY FILE: THE BOX OPENS AND SAYS SO**, with the Load button and the parameter list.
	row.fn();
	check(L.calibBoxIsOpen(), 'the row opens the box');
	check(textOf(byId.lpn_calib_report).indexOf(PC.lpn_calib_none) >= 0, 'with no file, the box says none is loaded');
	const paramSel = byTag(byId.lpn_calib_report, 'SELECT')[0];
	check(paramSel && paramSel.children.length === 6,
		`EPANET's six parameters are offered: ${paramSel && paramSel.children.map((o) => o.value).join(', ')}`);

	await warmEpanet();
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const LIMIT_MS = 90000, t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames === 0 && Date.now() - t0 < LIMIT_MS) { await wait(25); }
	const frames = EngCalcs.lpnTimeRunFrames();
	check(frames.length > 1, `an extended period run of ${frames.length} reporting steps`);


	L.setCalibParam('pressure');
	const sample = fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3-pressure.dat', 'utf8');
	L.landCalibText(sample, 'Net3-pressure.dat');
	const res = L.calibCompute('pressure');
	check(!!res, 'the file is held for Pressure');
	check(res.unknown.length === 1 && res.unknown[0] === 'J999',
		`the location Net3 does not have is LISTED: ${res.unknown.join(', ')}`);
	check(res.unknownCount === 2, `and its measurements are COUNTED as skipped: ${res.unknownCount}`);
	check(res.outside === 1, `the measurement at 26:00, past a 24-hour run, is skipped and counted: ${res.outside}`);
	check(res.stats.locations.map((s) => s.id).join(',') === '15,35,123,247',
		`the other four locations are used: ${res.stats.locations.map((s) => s.id).join(',')}`);
	check(res.stats.locations.map((s) => s.n).join(',') === '6,5,4,3', `with 6, 5, 4 and 3 measurements: ${res.stats.locations.map((s) => s.n).join(',')}`);

	// **THE COMPUTED SIDE IS THE FULL REPORT'S NUMBER** at a measurement on a reporting step, and the
	// interpolation of the two either side for one between steps (35 at 4.5 h).
	const rows = L.fullReportRows();
	const at = (id, t) => rows.filter((r) => r.group === 'node' && String(r.id) === id && r.t === t)[0].pressure;
	const p15 = res.stats.locations[0].pairs;
	check(p15[0].t === 0 && near(p15[0].s, at('15', 0)), `15 at 0:00 computed ${p15[0].s.toFixed(3)} = the Full report's ${at('15', 0).toFixed(3)}`);
	const p35 = res.stats.locations[1].pairs.filter((q) => q.t === 4.5 * 3600)[0];
	const want35 = (at('35', 4 * 3600) + at('35', 5 * 3600)) / 2;
	check(p35 && near(p35.s, want35, 1e-9), `35 at 4:30 computed ${p35 && p35.s.toFixed(3)} = halfway between 4:00 and 5:00, ${want35.toFixed(3)}`);
	const mean15 = p15.reduce((a, q) => a + q.s, 0) / p15.length;
	check(near(res.stats.locations[0].simMean, mean15), 'and the computed mean is the mean of those');

	head('5. THE STATISTICS PAGE: EPANET\'s columns, its Network row, its correlation line');
	const report = byId.lpn_calib_report;
	const all = textOf(report);
	check(all.indexOf(PC.lpn_calib_missing.replace('{ids}', 'J999')) >= 0, `the box lists it: "${PC.lpn_calib_missing.replace('{ids}', 'J999')}"`);
	check(all.indexOf(PC.lpn_calib_missing_count.replace('{n}', '2')) >= 0, 'and counts it');
	check(all.indexOf(PC.lpn_calib_outside.replace('{n}', '1')) >= 0, 'and counts the measurement outside the run');
	check(all.indexOf(PC.lpn_calib_units.replace('{unit}', 'psi')) >= 0, 'and says the file is read in the project\'s unit, psi');
	check(all.indexOf(PC.lpn_calib_session) >= 0, 'and that the file is held for this session only');
	const table = byTag(report, 'TABLE')[0];
	check(!!table, 'the Statistics page is a table');
	const heads = table ? byTag(table, 'TH').map((th) => th.textContent) : [];
	check(heads.join('|') === [PC.lpn_calib_col_location, PC.lpn_calib_col_n, PC.lpn_calib_col_obs_mean,
		PC.lpn_calib_col_sim_mean, PC.lpn_calib_col_mean_err, PC.lpn_calib_col_rms_err].join('|'),
		`with EPANET's six columns: ${heads.join(' | ')}`);
	const trs = table ? byTag(byTag(table, 'TBODY')[0], 'TR') : [];
	check(trs.length === 5, `one row per location used plus the Network row: ${trs.length}`);
	check(trs.length && byTag(trs[4], 'TD')[0].textContent === PC.lpn_calib_network, 'the last row is the Network row');
	check(trs.length && byTag(trs[4], 'TD')[1].textContent === '18', 'pooling all 18 measurements');
	const numCells = trs.length ? byTag(trs[0], 'TD').slice(2).map((td) => td.textContent) : [];
	check(numCells.length === 4 && numCells.every((t) => /^-?\d+\.\d\d$/.test(t)),
		`fixed two decimals, as EPANET prints them: ${numCells.join(' ')}`);
	check(findId(report, 'lpn_calib_corr') && typeof res.stats.r === 'number' &&
		findId(report, 'lpn_calib_corr').textContent === PC.lpn_calib_corr_means.replace('{r}', res.stats.r.toFixed(3)),
		`the correlation line: "${findId(report, 'lpn_calib_corr') && findId(report, 'lpn_calib_corr').textContent}"`);

	head('6. THE OTHER TWO PAGES');
	// **THE DRAWING IS AS WIDE AS THE BOX IN PIXELS** (Perry: 7 px text at 390 px from a fixed
	// viewBox). A phone-width host gets a 390-unit viewBox, so 10 px text stays 10 px.
	byId.lpn_calib_report.style.width = '390px';
	fire(findId(report, 'lpn_calib_tab_corr'), 'click');
	const corrSvg = byTag(findId(report, 'lpn_calib_page'), 'svg')[0];
	check(corrSvg && /^0 0 390 /.test(corrSvg.getAttribute('viewBox')),
		`at 390 px the chart is drawn 390 units wide, not scaled down: ${corrSvg && corrSvg.getAttribute('viewBox')}`);
	byId.lpn_calib_report.style.width = '';
	const pts = byClass(findId(report, 'lpn_calib_page'), 'lpn-calib-point');
	check(pts.length === 18, `the correlation plot draws one point per measurement compared: ${pts.length}`);
	check(byClass(findId(report, 'lpn_calib_page'), 'lpn-calib-diagonal').length === 1, 'against the 45-degree line');
	const diag = byClass(findId(report, 'lpn_calib_page'), 'lpn-calib-diagonal')[0];
	const dx = diag && (+diag.getAttribute('x2') - +diag.getAttribute('x1')),
		dy = diag && (+diag.getAttribute('y1') - +diag.getAttribute('y2'));
	check(diag && dx > 0 && dy > 0, 'which rises left to right, observed across and computed up, on one set of bounds');
	fire(findId(report, 'lpn_calib_tab_means'), 'click');
	check(byClass(findId(report, 'lpn_calib_page'), 'lpn-calib-bar').length === 8, 'the mean comparisons draw an observed and a computed bar for each of four locations');
	check(findId(report, 'lpn_calib_tab_means').getAttribute('aria-selected') === 'true', 'and that tab is the selected one');

	head('7. ANOTHER PARAMETER HAS ITS OWN FILE; A LINK PARAMETER NEEDS LINK IDS');
	L.setCalibParam('flow');
	L.landCalibText('; flows\n 10  1  1200\n 15  1  50\n', 'flow.dat');
	const fres = L.calibCompute('flow');
	check(fres.unknown.join(',') === '15', `on Flow, a NODE ID is not a link of this network and is reported: ${fres.unknown.join(',')}`);
	check(fres.stats.locations.length === 1 && fres.stats.locations[0].id === '10', 'and the link, Pump 10, is compared');
	check(L.calibCompute('pressure').stats.network.n === 18, 'the Pressure file is still held beside it');

	head('7a. A SINGLE-PERIOD RUN COMPARES EVERY MEASUREMENT WITH ITS ONE RESULT (EPANET\'s rule)');
	{
		const realFrames = EngCalcs.lpnTimeRunFrames;
		EngCalcs.lpnTimeRunFrames = function () { return []; };
		L.setLastResult(frames[0]);
		L.setCalibParam('pressure');
		const one = L.calibCompute('pressure');
		check(one.frames === 1 && one.outside === 0 && one.stats.network.n === 19,
			`all 19 measurements at known locations are compared, whatever their time: ${one.stats.network.n}, outside ${one.outside}`);
		const p15 = one.stats.locations[0].pairs;
		check(p15.every((q) => q.s === p15[0].s), 'every one against the same single result');
		L.landCalibText(sample, 'Net3-pressure.dat');
		check(!!findId(byId.lpn_calib_report, 'lpn_calib_single'), 'and the box says so');
		EngCalcs.lpnTimeRunFrames = realFrames;
		L.landCalibText(sample, 'Net3-pressure.dat');
	}

	head('7b. FILES BELONG TO THE PROJECT THEY WERE LOADED ON (Perry: Net3\'s file compared against Net1)');
	{
		const was = L.getOpenId();
		L.setOpenId('another-project');
		check(L.calibCompute('pressure') === null, 'another project tab has no calibration file');
		L.landCalibText('; other\n 15 0 1\n', 'other.dat');
		L.setOpenId(was);
		check(L.calibCompute('pressure').file.name === 'Net3-pressure.dat', 'and loading one there leaves this project\'s file as it was');
		L.setOpenId('a-new-project');
		check(L.calibCompute('pressure') === null && L.calibCompute('flow') === null, 'a new project starts with none');
		L.setOpenId(was);
	}

	head('8. THE TIME-SERIES CHART CARRIES THE MEASURED POINTS');
	global.localStorage.setItem = realSet;
	L.setCalibParam('pressure');
	const ts = L.tsState();
	ts.group = 'node'; ts.fields.node = 'pressure'; ts.picks.node = ['35', '15'];
	L.openPane('timeseries');
	L.renderTimeSeries();
	const rings = byClass(byId.lpn_ts_chart, 'lpn-calib-ring');
	check(rings.length === 11, `one ring per measurement at the two plotted junctions: ${rings.length} (6 + 5)`);
	// **THE RING WEARS THE LOCATION'S REPORT COLOUR**, whatever order the graph lists the assets in:
	// 35 is plotted first here but is the file's second location.
	const ring35 = rings.filter((r) => textOf(r).indexOf('35') >= 0 && textOf(r).indexOf('15') < 0);
	const rep35 = L.calibCompute('pressure').stats.locations.filter((s) => s.id === '35')[0];
	check(ring35.length === 5 && ring35.every((r) => r.getAttribute('stroke') === rep35.color) && rep35.color === L.calibColor(1),
		`35's rings are its report colour ${rep35.color}: ${ring35.map((r) => r.getAttribute('stroke')).join(',')}`);
	const thisProject = L.getOpenId();
	L.setOpenId('another-project');
	L.renderTimeSeries();
	check(byClass(byId.lpn_ts_chart, 'lpn-calib-ring').length === 1,
		'on another project the graph draws THAT project\'s file, not this one\'s');
	L.setOpenId(thisProject);
	L.renderTimeSeries();
	check(String(byId.lpn_ts_note._text || byId.lpn_ts_note.textContent).indexOf(PC.lpn_calib_ts_note) >= 0, 'and the note says what the rings are');
	ts.fields.node = 'head';
	L.renderTimeSeries();
	check(byClass(byId.lpn_ts_chart, 'lpn-calib-ring').length === 0, 'none on a Head chart, since the file measures pressure');

	head('9. NOTHING IS WRITTEN TO THE VISITOR\'S DEVICE');
	check(writes.length === 0, `no localStorage write while loading and reading the report: ${writes.join(', ') || 'none'}`);
	check(JSON.stringify(L.serialize()).indexOf('Net3-pressure') < 0 && JSON.stringify(L.serialize()).indexOf('J999') < 0,
		'and nothing of the file is in the saved project');

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
