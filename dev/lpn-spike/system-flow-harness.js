// THE SYSTEM FLOW BALANCE PLOT, from EPA's own Net1.inp and Net3.inp through the page's own chain.
// Run with:
//   node dev/lpn-spike/system-flow-harness.js
//
// ROADMAP Task 600. EPANET's System Flow plot: total flow PRODUCED and total flow CONSUMED against
// time. The definition is EPANET's own Graph window, Fgraph.pas GetSysFlow(): every JUNCTION and
// RESERVOIR demand from the output file, a positive one added to Consumed and a negative one
// subtracted into Produced; TANKS in neither. So, at every reporting step,
//
//     Produced - Consumed = net flow INTO the tanks
//
// and that is asserted here against an INDEPENDENT reading of the tank term: the solved FLOWS of
// the links touching each tank, never the demand array the chart itself sums. A chart that put a
// tank into either total, dropped a reservoir, summed the wrong sign or skipped a node fails it.
//
// Built as time-series-harness.js is: no model assembled here, the run provoked through the
// Calculate button's own door (lpnTimeRunNow -> runSolve -> assembleModel -> the real EPANET).
//
// Each network runs in a child process of its own (the page holds one run at a time); with no
// argument this file runs both and fails if either does.

const fs = require('fs');
const NET = process.argv[2];
if (!NET) {
	const { spawnSync } = require('child_process');
	let bad = 0;
	['Net1', 'Net3'].forEach((n) => {
		console.log('\n======== ' + n + ' ========');
		const r = spawnSync(process.execPath, [__filename, n], { stdio: 'inherit' });
		if (r.status !== 0) { bad++; }
	});
	console.log(bad ? `\n${bad} network(s) FAILED` : '\nall checks passed');
	process.exit(bad ? 1 : 0);
}

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
	"\t\topenPane: openPane, wirePane: wirePane,\n" +
	"\t\tpaneTabIds: function () { return paneTabs.map(function (t) { return t.id; }); },\n" +
	"\t\tactiveTabId: function () { var t = activePaneTab(); return t && t.id; },\n" +
	"\t\tsysflowSeries: sysflowSeries, renderSysflow: renderSysflow,\n" +
	"\t\tunitLabel: unitLabel, unitFactor: unitFactor, serialize: serializeProject,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;

function walkEls(root, fn) {
	(function walk(e) {
		if (!e) { return; }
		fn(e);
		(e.children || []).forEach(walk);
	}(root));
}
function chartEls(cls) {
	const out = [];
	walkEls(byId.lpn_sysflow_chart, (e) => {
		if (String(e['class'] || '').split(/\s+/).indexOf(cls) >= 0) { out.push(e); }
	});
	return out;
}
function textOf(root) {
	const parts = [];
	walkEls(root, (e) => { if (e.nodeType === 3) { parts.push(String(e.textContent)); } });
	return parts.join(' | ');
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.wirePane();

	head(`1. ${NET}.inp THROUGH THE PAGE'S OWN CHAIN`);
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + `dev/lpn-spike/reference/${NET}.inp`, 'utf8'));
	const d = L.docFromInp(parsed, NET.toLowerCase());
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);
	const tanks = d.nodes.filter((n) => n.type === 'tank');
	const reservoirs = d.nodes.filter((n) => n.type === 'reservoir');
	check(tanks.length > 0 && reservoirs.length > 0,
		`${d.nodes.length} nodes: ${tanks.length} tank(s), ${reservoirs.length} reservoir(s)`);
	check(EngCalcs.lpnTimeIsExtended(d.times), `and it states a run: ${EngCalcs.lpnFormatTime(d.times.duration)}`);

	// ---- the tab, and no run ---------------------------------------------------------------
	head('2. THE TAB, AND WHAT IT SAYS WITH NO RUN');
	const ids = L.paneTabIds();
	check(ids.indexOf('sysflow') === ids.indexOf('frequency') + 1 && ids[ids.length - 1] === 'profile',
		`Flow balance sits after Frequency and Profile is still last: ${ids.slice(-4).join(', ')}`);
	const tabBtn = (byId.lpn_pane_tabs.children || []).filter((b) => b.id === 'lpn_pane_tab_sysflow')[0];
	check(!!tabBtn && tabBtn.textContent === PC.lpn_sysflow_menu && tabBtn.title === PC.lpn_sysflow_tip,
		'with a button in the strip, named and tipped from the language file');
	d.settings.autoRun = false;
	L.openPane('sysflow');
	check(L.activeTabId() === 'sysflow', 'openPane(\'sysflow\'), the menu row\'s own call, shows it');
	check(byId.lpn_sysflow_note._text === PC.lpn_ts_no_frames,
		`Recalculate off, no run: said in words, naming Calculate: "${byId.lpn_sysflow_note._text}"`);
	check(chartEls('lpn-ts-line').length === 0 && chartEls('lpn-profile-frame').length === 0,
		'and no empty axis pair is drawn');
	const keyText = textOf(byId.lpn_sysflow_key);
	check(keyText.indexOf(PC.lpn_sysflow_produced) >= 0 && keyText.indexOf(PC.lpn_sysflow_consumed) >= 0,
		`the key names EPANET's two series: "${keyText}"`);
	const keyTips = (byId.lpn_sysflow_key.children || []).map((s) => s.getAttribute('data-bs-original-title') || s.title);
	check(keyTips[0] === PC.lpn_sysflow_produced_tip && keyTips[1] === PC.lpn_sysflow_consumed_tip,
		`each carrying what it sums as its tip: ${JSON.stringify(keyTips)}`);

	// ---- the run ---------------------------------------------------------------------------
	await warmEpanet();
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const LIMIT_MS = 90000, t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames === 0 && Date.now() - t0 < LIMIT_MS) { await wait(25); }
	const frames = EngCalcs.lpnTimeRunFrames();
	check(frames.length === EngCalcs.lpnReportTimes(d.times).length,
		`the engine answered: ${frames.length} frames for ${EngCalcs.lpnReportTimes(d.times).length} reporting stops`);
	if (!frames.length) { console.log('\nno frames, nothing below can be asserted'); process.exit(1); }
	const pts = L.sysflowSeries(frames);
	check(pts.length === frames.length && pts.every((p, i) => p.t === frames[i].t),
		`one point per reporting step, each at its own frame's time: ${pts.length}`);
	check(pts.every((p) => p.produced >= 0 && p.consumed >= 0 && isFinite(p.produced) && isFinite(p.consumed)),
		'both totals are finite and never negative');

	// ---- the balance ------------------------------------------------------------------------
	head('3. PRODUCED - CONSUMED = NET FLOW INTO THE TANKS, AT EVERY STEP');
	const qf = L.unitFactor('lpn_u_flow');
	check(Math.abs(qf - 1) > 0.1, `the project's flow unit is ${L.unitLabel('lpn_u_flow')}, factor ${qf.toFixed(3)} per m3/s, so SI would be a different number`);
	// The tank term read from the LINKS, not from the demands the chart sums: flow arriving at each
	// tank down every link that ends there, minus flow leaving down every link that starts there.
	function tankInflowSI(f) {
		let s = 0;
		tanks.forEach((tk) => {
			d.links.forEach((l) => {
				const q = f.flows[l.id];
				if (typeof q !== 'number') { return; }
				if (l.to === tk.id) { s += q; }
				if (l.from === tk.id) { s -= q; }
			});
		});
		return s;
	}
	let worst = 0, worstAt = null, swingIn = false, swingOut = false;
	const scale = Math.max.apply(null, pts.map((p) => Math.max(p.produced, p.consumed))) || 1;
	pts.forEach((p, i) => {
		const tank = tankInflowSI(frames[i]) * qf, err = Math.abs((p.produced - p.consumed) - tank);
		if (err > worst) { worst = err; worstAt = p.t; }
		if (tank > scale * 0.01) { swingIn = true; }
		if (tank < -scale * 0.01) { swingOut = true; }
	});
	// EPANET's own convergence is to 0.001 relative flow change; a balance closed to 1e-4 of the
	// largest total is a closed balance, and a wrong population is off by whole demands.
	check(worst <= scale * 1e-4,
		`closed at every one of ${pts.length} steps: worst gap ${worst.toExponential(2)} ${L.unitLabel('lpn_u_flow')} ` +
		`at ${EngCalcs.lpnFormatTime(worstAt || 0)}, against totals up to ${scale.toFixed(1)}`);
	check(swingIn && swingOut,
		'and the tanks both fill and drain across the day, so the balance was tested both ways round');

	// ---- the population, from the other side ------------------------------------------------
	head('4. WHAT EACH TOTAL HOLDS');
	// Consumed is every positive junction demand (and a filling reservoir, which these files have
	// none of): the junction demands, summed straight off the frame.
	let consumedOk = true, producedOk = true;
	pts.forEach((p, i) => {
		const f = frames[i];
		let cons = 0, prod = 0;
		d.nodes.forEach((n) => {
			const q = f.demands[n.id];
			if (n.type === 'tank' || typeof q !== 'number') { return; }
			if (q > 0) { cons += q; } else { prod -= q; }
		});
		if (Math.abs(cons * qf - p.consumed) > scale * 1e-9) { consumedOk = false; }
		if (Math.abs(prod * qf - p.produced) > scale * 1e-9) { producedOk = false; }
	});
	check(consumedOk && producedOk, 'each total is GetSysFlow()\'s sum, converted by the project\'s flow selector');
	// Produced, read from the links leaving the reservoirs: what the sources push into the network.
	let srcWorst = 0;
	pts.forEach((p, i) => {
		let s = 0;
		reservoirs.forEach((r) => d.links.forEach((l) => {
			const q = frames[i].flows[l.id];
			if (typeof q !== 'number') { return; }
			if (l.from === r.id) { s += q; }
			if (l.to === r.id) { s -= q; }
		}));
		srcWorst = Math.max(srcWorst, Math.abs(s * qf - p.produced));
	});
	check(srcWorst <= scale * 1e-4,
		`and Produced is what leaves the reservoirs (no negative demands in this file): worst gap ${srcWorst.toExponential(2)}`);
	// The two branches these files never take, on a frame made up for the purpose: a NEGATIVE
	// junction demand produces, a reservoir being FILLED consumes, and a tank is in neither.
	{
		const j = d.nodes.filter((n) => n.type === 'junction'), r = reservoirs[0], tk = tanks[0];
		const fake = { t: 0, demands: {} };
		fake.demands[j[0].id] = 0.002; fake.demands[j[1].id] = -0.0005;
		fake.demands[r.id] = 0.0003; fake.demands[tk.id] = -0.9;
		const p = L.sysflowSeries([fake])[0];
		check(Math.abs(p.produced - 0.0005 * qf) < 1e-9 && Math.abs(p.consumed - 0.0023 * qf) < 1e-9 &&
			Math.abs(p.storage + 0.9 * qf) < 1e-9,
			`negative demand -> Produced, filling reservoir -> Consumed, tank -> neither: ` +
			`${p.produced.toFixed(3)} / ${p.consumed.toFixed(3)} ${L.unitLabel('lpn_u_flow')}`);
	}
	if (NET === 'Net1') {
		// **EPANET'S OWN EXAMPLE.** The 2.2 manual's System Flow figure is Net1: Produced near 1,850
		// GPM in the morning, then ZERO through the afternoon while the tank's control holds the pump
		// off, with Consumed following the demand pattern above it the whole time.
		const off = pts.filter((p) => p.produced < 1e-6);
		check(off.length >= 3 && off.every((p) => p.consumed > 100),
			`Produced falls to nothing for ${off.length} steps while Consumed carries on: ` +
			off.map((p) => EngCalcs.lpnFormatTime(p.t)).join(' '));
		check(pts[0].produced > 1500 && pts[0].produced < 2200,
			`and starts near the manual's figure: ${pts[0].produced.toFixed(0)} ${L.unitLabel('lpn_u_flow')}`);
	}

	// ---- the drawing --------------------------------------------------------------------------
	head('5. THE CHART');
	L.renderSysflow();
	const lines = chartEls('lpn-ts-line');
	check(lines.length === 2, `two lines, Produced and Consumed: ${lines.length}`);
	check(chartEls('lpn-sysflow-produced').length === 1 && chartEls('lpn-sysflow-consumed').length === 1,
		'one of each');
	check(lines[0] && lines[1] && lines[0].stroke !== lines[1].stroke, 'in two colors');
	// Anchored at zero: a low total must not be drawn as an empty system.
	const ticks = chartEls('lpn-profile-tick').map((e) => textOf(e));
	check(ticks.indexOf('0') >= 0, `the flow axis starts at 0: ${ticks.slice(0, 6).join(', ')}`);
	const want = PC.lpn_result_flow + ' (' + L.unitLabel('lpn_u_flow') + ')';
	const txt = textOf(byId.lpn_sysflow_chart);
	check(txt.indexOf(want) >= 0, `the flow axis names the project's unit: "${want}"`);
	check(txt.indexOf(PC.lpn_ts_axis_time) >= 0, 'with the time axis named beside it');
	check(byId.lpn_sysflow_note._text === '', 'and no waiting sentence over a drawn chart');
	const tankLevels = tanks.map((t) => t.level);
	L.renderSysflow();
	check(tanks.every((t, i) => t.level === tankLevels[i]), 'drawing it wrote nothing into the document');
	const saved = JSON.stringify(L.serialize());
	check(saved.indexOf('sysflow') < 0, 'and nothing about it enters serializeProject()');

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
