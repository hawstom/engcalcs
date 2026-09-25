// FIRE FLOW AT A TIME STEP, AND A LINK'S STATUS AT A TIME STEP. Run with:
//   node dev/lpn-spike/fireflow-eps-harness.js
//
// Tom, 2026-09-25, on EPA's Net3: pump 10 is closed at 0:00 and its control opens it at 1:00,
// yet the map, Properties and the Tables kept calling it closed; and fire flow's static pressure
// at Junction 10 "never matches the map pressure, and it's always significantly lower". He also
// asked that several selected hydrants each be tested.
//
// Everything here goes through the page's own doors: the gallery file opened the way a visitor
// opens it, the Run through lpnTimeRunNow() and the real EPANET engine, the transport moved with
// lpnTimeGoTo(), and the answers read from the same accessors the Properties box, the Tables pane
// and the map read.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const fs = require('fs');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-fireflow.js');

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tlinkById: linkById, nodeById: nodeById, effective: effective,\n" +
	"\t\tlinkStatusText: linkStatusText, renderLinkFields: renderLinkFields,\n" +
	"\t\tlinkClass: function (id) { return linkEls[id] ? (linkEls[id].line.getAttribute('class') || '') : null; },\n" +
	"\t\tpaneTables: paneTables, paneCellText: paneCellText,\n" +
	"\t\tcolorNodeValue: colorNodeValue,\n" +
	"\t\tsetSelectionList: setSelectionList,\n" +
	"\t\trunFireFlowSweep: runFireFlowSweep,\n" +
	"\t\tfireFlowModel: function () { var m = assembleModel(); fireFlowAtFrame(m); return m; },\n" +
	"\t\tengineFor: engineFor, assembleModel: assembleModel,\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\tffRun: function () { return fireFlowRun; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;

function open(file) {
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + file, 'utf8'));
	if (!saved) { throw new Error('did not open ' + file); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
}

async function runToFrames(limitMs) {
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames === 0 && Date.now() - t0 < limitMs) { await wait(25); }
	return EngCalcs.lpnTimeRunState().frames;
}

// Every piece of text under an element, in document order, so a popup row reads as its label then
// its value -- what a person reading the Properties box sees.
function texts(e, out) {
	out = out || [];
	if (!e) { return out; }
	if (e.nodeType === 3) { if (String(e.textContent).trim()) { out.push(String(e.textContent).trim()); } return out; }
	if (e._text && String(e._text).trim()) { out.push(String(e._text).trim()); }
	(e.children || []).forEach((c) => texts(c, out));
	return out;
}
function propertiesStatus(id) {
	L.renderLinkFields(id);
	const t = texts(byId.lpn_popup_fields);
	const i = t.indexOf(PC.lpn_result_status);
	return i >= 0 ? t[i + 1] : '(no Status row)';
}
function tableStatus(tableId, id) {
	const spec = L.paneTables().find((s) => s.id === tableId);
	const col = spec && spec.cols.find((c) => c.key === 'status' && c.result);
	return col ? L.paneCellText(col, L.linkById(id)) : '(no Status column)';
}
function shutBox(id) {
	return L.effective(L.linkById(id), 'status') || 'open';
}

// Fire flow on the selected junctions at the step on screen; returns the result set.
async function sweepSelected(ids, extra) {
	L.setSelectionList(ids.map((id) => ({ kind: 'node', id: id })).concat(extra || []));
	L.setAsk('scope', 'selected');
	L.setAsk('design', 'off');
	await L.runFireFlowSweep();
	return L.ffRun();
}

const PSI = 0.703070;   // metres of water per psi, to one part in a million -- only a readout here
async function staticEqualsMap(label, ids, times, engine) {
	for (const t of times) {
		EngCalcs.lpnTimeGoTo(t);
		const map = L.lastResult().pressures;
		const set = await sweepSelected(ids);
		let worst = 0, worstId = '(all equal)';
		ids.forEach((id) => {
			const rec = set.byId[id];
			let d = rec && typeof rec.staticPressure === 'number' ? Math.abs(rec.staticPressure - map[id]) : Infinity;
			// A hydrant the map has no pressure for is a failure, never a vacuous pass.
			if (!isFinite(d)) { d = Infinity; }
			if (d > worst) { worst = d; worstId = id; }
		});
		// 0.01 psi. The map shows pressure to two decimals; a static pressure that differed from it
		// by more than that would show as a different number on the screen.
		check(worst < 0.01 * PSI,
			`${label}, ${engine} engine, at ${EngCalcs.lpnFormatTime(t)}: static = map pressure at ` +
			`${ids.length} hydrants (worst ${(worst / PSI).toFixed(4)} psi at ${worstId})`);
	}
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();

	// ---------------------------------------------------------------------------------------------
	head('1. NET3: PUMP 10 SHOWS CLOSED AT 0:00 AND OPEN AT 1:00, AS A RESULT');
	open('Net3.lwn');
	L.setEngine('epanet');
	const frames = await runToFrames(90000);
	check(frames === 25, `the run produced ${frames} frames`);
	check(shutBox('10') === 'closed', 'the file starts pump 10 shut, and that is its stored input');

	EngCalcs.lpnTimeGoTo(0);
	check(L.lastResult().statuses['10'] === 'closed', 'at 0:00 the engine reports pump 10 closed');
	check(propertiesStatus('10') === PC.lpn_result_status_closed,
		`Properties at 0:00 reads Status ${propertiesStatus('10')}`);
	check(tableStatus('pumps', '10') === PC.lpn_result_status_closed,
		`the Pumps table at 0:00 reads ${tableStatus('pumps', '10')}`);
	check(/\blpn-link-closed\b/.test(L.linkClass('10')), 'and the map draws it closed (dashed)');

	EngCalcs.lpnTimeGoTo(3600);
	check(L.lastResult().statuses['10'] === 'open', 'at 1:00 its control has opened it');
	check(propertiesStatus('10') === PC.lpn_result_status_open,
		`Properties at 1:00 reads Status ${propertiesStatus('10')}`);
	check(tableStatus('pumps', '10') === PC.lpn_result_status_open,
		`the Pumps table at 1:00 reads ${tableStatus('pumps', '10')}`);
	check(!/\blpn-link-closed\b/.test(L.linkClass('10')), 'and the map draws it open');
	check(shutBox('10') === 'closed', 'while the stored input is still the file\'s: shut at the start');
	check(tableStatus('pipes', '20') === PC.lpn_result_status_open, 'an ordinary pipe reads Open in the Pipes table');

	EngCalcs.lpnTimeGoTo(0);
	check(/\blpn-link-closed\b/.test(L.linkClass('10')), 'back at 0:00 the map draws it closed again');

	// ---------------------------------------------------------------------------------------------
	head('2. FIRE FLOW STATIC PRESSURE = THE MAP PRESSURE AT THE STEP ON SCREEN');
	// THE DEFECT, SEEN FIRST: the bare model at 1:00 still has pump 10 shut and every tank at its
	// starting level, which is what the sweep used to test. If this ever stops differing, the
	// checks below have stopped proving anything.
	{
		EngCalcs.lpnTimeGoTo(3600);
		const bare = L.assembleModel();
		const r = await L.engineFor(bare).solve(bare);
		const gap = (L.lastResult().pressures['10'] - r.pressures['10']) / PSI;
		check(gap > 10, `without the frame, Junction 10 at 1:00 reads ${gap.toFixed(1)} psi below the map`);
	}
	const net3Ids = ['10', '15', '20', '35', '101', '123', '161', '209', '255'];
	await staticEqualsMap('Net3', net3Ids, [0, 3600, 7200, 14 * 3600], 'EPANET');
	L.setEngine('native');
	await staticEqualsMap('Net3', net3Ids, [3600, 14 * 3600], 'built-in');
	L.setEngine('epanet');

	// **EVERY JUNCTION AT EVERY STEP OF THE DAY**, through the model the sweep starts from and its
	// own engine choice, with no fire drawn: the static condition, which is the map. Cheaper than a
	// sweep (one solve a step, not sixteen a junction) and it reaches every tank at every level the
	// run takes it to, full and empty included.
	{
		let worst = 0, where = '(all equal)', steps = 0;
		for (const t of EngCalcs.lpnReportTimes(L.getDoc().times)) {
			EngCalcs.lpnTimeGoTo(t);
			const map = L.lastResult().pressures;
			const m = L.fireFlowModel();
			const r = await L.engineFor(m).solve(m);
			steps++;
			m.nodes.filter((n) => n.type === 'junction').forEach((n) => {
				let d = Math.abs(r.pressures[n.id] - map[n.id]);
				if (!isFinite(d)) { d = Infinity; }
				if (d > worst) { worst = d; where = n.id + ' at ' + EngCalcs.lpnFormatTime(t); }
			});
		}
		check(steps === 25 && worst < 0.01 * PSI,
			`Net3, every junction at all ${steps} steps: the static solve is the map ` +
			`(worst ${(worst / PSI).toFixed(4)} psi, ${where})`);
	}

	// ---------------------------------------------------------------------------------------------
	head('3. THREE SELECTED JUNCTIONS GIVE THREE RESULTS, AND A PIPE IN THE SELECTION IS SKIPPED');
	EngCalcs.lpnTimeGoTo(3600);
	const three = await sweepSelected(['10', '15', '20'], [{ kind: 'link', id: '20' }, { kind: 'node', id: 'River' }]);
	check(three.results.length === 3, `three junctions selected, ${three.results.length} results`);
	check(['10', '15', '20'].every((id) => three.byId[id] && typeof three.byId[id].staticPressure === 'number'),
		'one row each, every one with its own static pressure');
	check(three.results.every((r) => r.code !== EngCalcs.lpnFireFlowCodes.NOT_A_JUNCTION),
		'and no row for the pipe or the river');
	const notice = String((byId.lpn_map_notice || {}).textContent || '');
	check(notice === PC.lpn_ff_skipped.replace('{n}', '2'), `the skip is said: "${notice}"`);

	// ---------------------------------------------------------------------------------------------
	head('4. ELM STREET CENTER');
	open('Elm-Street-Center.lwn');
	const elmDoc = L.getDoc();
	const elm = elmDoc.nodes.filter((n) => n.type === 'junction').map((n) => n.id);
	check(elm.length >= 3, `Elm Street Center opened: ${elm.length} junctions`);
	if (EngCalcs.lpnTimeIsExtended(elmDoc.times)) {
		check(await runToFrames(90000) > 0, 'and its run produced frames');
		await staticEqualsMap('Elm Street Center', elm, [0, 3600], 'EPANET');
	} else {
		// One instant: the map is the page's own steady solve, so that is what is compared.
		L.runSolve();
		for (let i = 0; i < 200 && !(L.lastResult() && L.lastResult().pressures[elm[0]] !== undefined); i++) { await wait(25); }
		const map = L.lastResult().pressures;
		const set = await sweepSelected(elm);
		let worst = 0;
		elm.forEach((id) => {
			const r = set.byId[id];
			let d = r && typeof r.staticPressure === 'number' ? Math.abs(r.staticPressure - map[id]) : Infinity;
			if (!isFinite(d)) { d = Infinity; }
			worst = Math.max(worst, d);
		});
		check(worst < 0.01 * PSI, `Elm Street Center, one instant: static = map pressure at ${elm.length} hydrants ` +
			`(worst ${(worst / PSI).toFixed(4)} psi)`);
	}

	console.log(failures ? `\n${failures} FAILED` : '\nall ok');
	process.exit(failures ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
