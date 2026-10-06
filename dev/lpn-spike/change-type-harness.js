// Headless check of Water > Change type -- dev/asset-type.md. Run with:
//   node dev/lpn-spike/change-type-harness.js
//
// Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables to Change node type
// for any asset, where if it has information that can't be ported to the new type, we alert and
// ask."*
//
// WHAT THIS HOLDS, and every part of it is a way the command could look right and be wrong:
//
//   1. The node keeps its ID, place, pipes, description, tag and every value the new type also has;
//      what only the old type had is gone from the element, its file tokens and every scenario.
//   2. What only the new type has is what a newly drawn asset of that type gets -- the New assets
//      settings -- and nothing else.
//   3. The box appears ONLY when something would be lost (or a control would change meaning), lists
//      Base values AND scenario overrides, and Cancel leaves the document byte-identical.
//   4. One undo puts the whole change back, byte for byte.
//   5. The .inp export writes the node in its new section.
//
// THE PAGE'S OWN CHAIN: changeSelectedNodeType() is called with a real selection and answered
// through the stub's question box, exactly as the Water menu row calls it. Nothing writes a type
// by hand.
//
// MUTATION-PROVED IN PROCESS (section 9): live mutations of js/looped-network.js -- keep the
// lost values, never ask, skip the undo snapshot, skip the New assets defaults, drop the water
// surface either way, show freshly derived results on a converted node, keep the scenario
// overrides -- each must turn this harness red, or the harness fails.
//
// Pre-review, 2026-10-06, added sections 10 and 11: with Recalculate off a converted node keeps its
// stale head and pressure until Calculate, and Net1's tank 2 turned into a reservoir and back
// leaves every junction pressure where it was.
//
// Sections 12-17 hold the LINK half (Tom, 2026-10-06: "Proceed."): on Net1, pipe -> valve,
// valve -> pipe, pipe -> pump with and without a curve, pump -> pipe; on Net3, pump 335 -> pipe ->
// pump, which must solve back to Net3's own answer. Each: the box (key first, every lost line
// "ID: ..."), Cancel byte-identical, one undo byte-identical, and a solve before and after with a
// physical check on heads and flows. Then a pipe with customers and a link named in a rule.

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-rules.js');
const fs = require('fs');
const path = require('path');
const solver = require(ROOT + 'js/lpn-solver.js');
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const NET1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');
const NET3 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8');
const PC = global.EngCalcs.pageConfig;

const INJECT =
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\teffective: effective, setProp: setProp, setCustomProp: setCustomProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tserializeProject: serializeProject, undo: undo,\n" +
	"\t\tsetSelectionList: setSelectionList, changeSelectedNodeType: changeSelectedType, changeSelectedType: changeSelectedType,\n" +
	"\t\tchangeTypeRows: changeTypeRows, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tincident: function (id) { return incidentLinks[id]; },\n" +
	"\t\tlibReadControl: libReadControl, libControls: libControls, addCustomer: addCustomer,\n" +
	"\t\temitterToStore: emitterToStore, runSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tcolorNodeValue: colorNodeValue, fixedHeadPressure: fixedHeadPressure,\n" +
	"\t\tcolorLinkValue: colorLinkValue, linkStatusText: linkStatusText,\n" +
	"\t\tcustomerPoint: customerPoint, linkGeomLength: linkGeomLength, customerById: customerById,\n" +
	"\t\timportInp: importInpFromFile, assembleModel: assembleModel,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), inpExportOptions()); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

// The question box answers through window.confirm in the stub. Every question is recorded, and
// the answer is whatever the test sets next.
let asked = [], answer = true;
global.window.confirm = function (text) { asked.push(String(text)); return answer; };
global.alert = global.window.alert = function () {};

function run(mutate, quiet) {
	let fails = 0;
	function say(t) { if (!quiet) { console.log(t); } }
	function ok(name, cond, extra) {
		if (!cond) { fails++; }
		say((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	}
	const L = loadLoopedNetwork(INJECT, null, mutate);
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	const S = L.getSettings(), D = S.defaults;
	const doc = () => L.getDoc();
	const snap = () => JSON.stringify(L.serializeProject());
	function select(id) { L.setSelectionList([{ kind: 'node', id: id }]); }
	function change(id, to, ans) {
		asked = [];
		answer = ans === undefined ? true : ans;
		select(id);
		L.changeSelectedNodeType(to);
		return asked;
	}
	function sectionOf(inp, id) {
		let sec = null, found = [];
		inp.split(/\r?\n/).forEach(function (line) {
			const m = /^\s*\[([A-Z]+)\]/.exec(line);
			if (m) { sec = m[1]; return; }
			const t = line.replace(/;.*$/, '').trim().split(/\s+/);
			if (t[0] === id && ['JUNCTIONS', 'RESERVOIRS', 'TANKS'].indexOf(sec) >= 0) { found.push(sec); }
		});
		return found.join(',');
	}

	// ---- the network: R1 -- L1 -- J1 -- L2 -- J2 ----
	const r1 = L.addNode('reservoir', 0, 0);
	const j1 = L.addNode('junction', 100, 0);
	const j2 = L.addNode('junction', 200, 0);
	const l1 = L.addLink('pipe', r1.id, j1.id);
	const l2 = L.addLink('pipe', j1.id, j2.id);
	const J = j1.id;
	j1.desc = 'Corner of Elm and Main';
	j1.tag = 'ZONE-3';
	j1.elev = 812;
	L.setProp(j1, 'demand', 0);
	L.setProp(j1, 'initQuality', 0.8);

	say('--- 1. junction -> reservoir with nothing to lose: no question ---');
	{
		const q = change(J, 'reservoir');
		const n = L.nodeById(J);
		ok('1.1 no box was shown (demand 0, no emitter, no fire flow)', q.length === 0, JSON.stringify(q));
		ok('1.2 it is a reservoir now', n && n.type === 'reservoir', n && n.type);
		ok('1.3 the same object kept its ID, place, elevation, description and tag',
			n === j1 && n.x === 100 && n.y === 0 && n.elev === 812 && n.desc === 'Corner of Elm and Main' && n.tag === 'ZONE-3');
		ok('1.4 a common value (initial quality) is carried', L.effective(n, 'initQuality') === 0.8,
			String(L.effective(n, 'initQuality')));
		ok('1.5 the junction-only demand is gone from the element', !('_demand' in n));
		ok('1.6 a new reservoir states no head, as a drawn one does', !('_head' in n));
		ok('1.7 both pipes still meet it', L.linkById(l1.id).to === J && L.linkById(l2.id).from === J &&
			(L.incident(J) || []).length === 2, JSON.stringify(L.incident(J)));
		ok('1.8 the export writes it under [RESERVOIRS]', sectionOf(L.exportInp().inp, J) === 'RESERVOIRS',
			sectionOf(L.exportInp().inp, J));
	}

	say('\n--- 2. reservoir -> tank: the tank a click would have drawn, at the same water surface ---');
	{
		const q = change(J, 'tank');
		const n = L.nodeById(J);
		ok('2.1 no box (a reservoir with a blank head has nothing to lose)', q.length === 0, JSON.stringify(q));
		ok('2.2 it is a tank', n.type === 'tank');
		// A blank head follows the ground, so the surface is AT the elevation: depth 0 keeps it.
		ok('2.3 water depth 0 keeps the surface; lowest, highest and diameter are the New assets defaults',
			L.effective(n, 'level') === 0 && n.minLevel === D.tankMinLevel &&
			n.maxLevel === D.tankMaxLevel && n.tankDiameter === D.tankDiameter,
			[L.effective(n, 'level'), n.minLevel, n.maxLevel, n.tankDiameter].join(',') + ' vs 0,' +
			[D.tankMinLevel, D.tankMaxLevel, D.tankDiameter].join(','));
		ok('2.4 elevation is kept, not re-defaulted', n.elev === 812);
		ok('2.5 the export writes it under [TANKS]', sectionOf(L.exportInp().inp, J) === 'TANKS');
	}

	say('\n--- 3. tank -> junction: the box, Cancel, and Change ---');
	{
		// A default demand that is not zero, so 3.8 cannot pass on an absent one. Set before the
		// snapshot: the New assets settings are part of the document.
		D.demand = 7;
		const before = snap();
		const q = change(J, 'junction', false);
		ok('3.1 the box was shown', q.length === 1);
		const text = q[0] || '';
		ok('3.2 it opens with the key line', !!PC.lpn_change_type_key && text.split('\n')[0] === PC.lpn_change_type_key, text.split('\n')[0]);
		ok('3.2b the "values will be lost" sentence follows, and every line under it is "ID: entry"',
			text.indexOf(PC.lpn_change_type_lost) > 0 && text.split(PC.lpn_change_type_lost + '\n')[1].split('\n\n')[0].split('\n').every(l => l.indexOf(J + ': ') === 0),
			text);
		ok('3.3 it names the water depth and the tank diameter, with the ID',
			text.indexOf(J + ': ' + PC.lpn_field_tank_level) >= 0 && text.indexOf(PC.lpn_field_tank_diameter) >= 0, text);
		ok('3.4 Cancel leaves the document byte-identical', snap() === before);
		ok('3.5 ...and the node still a tank', L.nodeById(J).type === 'tank');
		change(J, 'junction', true);
		const n = L.nodeById(J);
		ok('3.6 Change made it a junction', n.type === 'junction');
		ok('3.7 every tank-only value is gone',
			['_level', 'minLevel', 'maxLevel', 'tankDiameter'].every(k => !(k in n)),
			Object.keys(n).join(','));
		ok('3.8 its demand is the New assets default', L.effective(n, 'demand') === D.demand,
			L.effective(n, 'demand') + ' vs ' + D.demand);
		ok('3.9 one undo puts the tank back byte for byte', (L.undo(), snap() === before));
		ok('3.10 ...as the same tank', L.nodeById(J).type === 'tank' && L.nodeById(J).tankDiameter === D.tankDiameter);
		change(J, 'junction', true);
		ok('3.11 the export writes it under [JUNCTIONS]', sectionOf(L.exportInp().inp, J) === 'JUNCTIONS');
	}

	say('\n--- 4. a scenario\'s override of a lost value is listed and discarded ---');
	{
		const n = L.nodeById(J);
		L.setProp(n, 'demand', 10);
		const scn = L.createScenario('Max day');
		L.setProp(n, 'demand', 25);
		L.setProp(n, 'initQuality', 1.2);
		L.switchScenario(L.baseScenario().id);
		const before = snap();
		const q = change(J, 'tank', false);
		const text = q[0] || '';
		ok('4.1 the box lists Base\'s demand', text.indexOf(J + ': ' + PC.lpn_field_base_demand + ' 10') >= 0, text);
		ok('4.2 ...and the scenario\'s own, by name, led by the ID and a colon', text.split('\n').some(l => l.indexOf(J + ': ') === 0 && l.indexOf('Max day') > 0 && l.indexOf(' 25') > 0), text);
		ok('4.3 Cancel: byte-identical, scenarios included', snap() === before);
		change(J, 'tank', true);
		const ov = (L.getScenarios().filter(s => s.id === scn.id)[0] || {}).overrides || {};
		const key = Object.keys(ov).filter(k => k.slice(-J.length - 1) === ':' + J)[0];
		ok('4.4 the scenario\'s demand override went with the type', !key || !('demand' in ov[key]),
			JSON.stringify(ov));
		ok('4.5 ...and its initial-quality override, which a tank also has, stayed',
			!!key && ov[key].initQuality === 1.2, JSON.stringify(ov));
		ok('4.6 undo restores the scenario\'s override too', (L.undo(), snap() === before));
	}

	say('\n--- 5. custom properties follow their own "Applies to" ---');
	{
		const n = L.nodeById(J);
		S.customProps = [
			{ key: 'custom_acct', label: 'Account', applies: 'J', validate: 'none' },
			{ key: 'custom_zone', label: 'Zone', applies: 'J T', validate: 'none' }
		];
		L.setCustomProp(n, S.customProps[0], 'A-4417');
		L.setCustomProp(n, S.customProps[1], 'North');
		const q = change(J, 'tank', true);
		ok('5.1 the junction-only one is listed', (q[0] || '').indexOf('Account A-4417') >= 0, q[0]);
		ok('5.2 the one that applies to tanks too is not', (q[0] || '').indexOf('North') < 0);
		ok('5.3 ...and it is still on the tank', L.effective(L.nodeById(J), 'custom_zone') === 'North');
		ok('5.4 the other is gone', L.effective(L.nodeById(J), 'custom_acct') === undefined);
		S.customProps = [];
	}

	say('\n--- 6. a control that tests the node is named, because its number changes meaning ---');
	{
		const read = L.libReadControl('LINK ' + l2.id + ' CLOSED IF NODE ' + J + ' ABOVE 30');
		ok('6.0 the control reads', read.ok);
		L.libControls().push(read.rec);
		// tank -> reservoir: a level either way, so the control is not raised; the tank's values are.
		const tk = L.nodeById(J), surfaceWas = tk.elev + L.effective(tk, 'level');
		let q = change(J, 'reservoir', true);
		ok('6.1 tank -> reservoir does not name the control (a level both sides)',
			q.length === 1 && q[0].indexOf(PC.lpn_change_type_meaning) < 0, q[0]);
		ok('6.1b ...and its head is the tank\'s water surface, said in the box',
			L.effective(L.nodeById(J), 'head') === surfaceWas && q[0].indexOf(PC.lpn_change_type_surface) === PC.lpn_change_type_key.length + 2 &&
			q[0].indexOf(J + ': ' + PC.lpn_field_head + ' ' + surfaceWas) >= 0, surfaceWas + ' | ' + q[0]);
		// Back to a junction below needs the head gone first, so the box is about the control only.
		delete L.nodeById(J)._head;
		// reservoir (blank head) -> junction: nothing lost, but the control crosses pressure/level.
		q = change(J, 'junction', true);
		ok('6.2 reservoir -> junction asks, for the control alone', q.length === 1 &&
			q[0].indexOf(PC.lpn_change_type_meaning) === 0 && q[0].indexOf('IF NODE ' + J) >= 0, q[0]);
		ok('6.3 ...and the round trip is complete: a junction again', L.nodeById(J).type === 'junction');
		// The control's number is read as a pressure now, not a level (libAnnotateControl()).
		ok('6.4 the control is re-read: its number is a pressure at a junction', read.rec.condition.unit === 'press',
			String(read.rec.condition.unit));
	}

	say('\n--- 6b. a selection of many: one question, a capped list, one undo ---');
	{
		const tanks = [];
		for (let i = 0; i < 6; i++) { tanks.push(L.addNode('tank', 300 + 50 * i, 100).id); }
		const before = snap();
		asked = []; answer = true;
		L.setSelectionList(tanks.map(id => ({ kind: 'node', id: id })));
		L.changeSelectedNodeType('junction');
		const text = asked[0] || '';
		ok('6b.1 one question for the whole selection', asked.length === 1, asked.length);
		ok('6b.2 the list is capped, and says how many more', (text.match(/\n/g) || []).length === 23 &&
			text.indexOf(String(PC.lpn_change_type_more).replace('{n}', '4')) >= 0, text.split('\n').slice(-2).join(' | '));
		ok('6b.3 all six changed', tanks.every(id => L.nodeById(id).type === 'junction'));
		L.undo();
		ok('6b.4 ONE undo puts all six back, byte for byte', snap() === before);
	}

	say('\n--- 7. the menu rows ---');
	{
		select(J);
		const all = L.changeTypeRows(), rows = all.slice(0, 3);
		ok('7.1 three node rows, a divider, three link rows, each in the Insert order', all.map(r => r.separator ? '-' : r.label).join('|') ===
			[PC.lpn_tool_add_junction, PC.lpn_tool_add_reservoir, PC.lpn_tool_add_tank, '-',
				PC.lpn_tool_add_pipe, PC.lpn_tool_add_pump, PC.lpn_tool_add_valve].join('|'), all.map(r => r.label).join('|'));
		ok('7.1b a node selection leaves every link row disabled', all.slice(4).every(r => r.disabled));
		ok('7.2 the type it already is, is disabled; the others are not',
			rows[0].disabled && !rows[1].disabled && !rows[2].disabled);
		L.setSelectionList([]);
		ok('7.3 with nothing selected every row is disabled', L.changeTypeRows().every(r => r.separator || r.disabled));
	}
	say('\n--- 8. a customer whose demand lands on the junction is named ---');
	{
		// J1 is a junction again after section 6. Last, because a customer added and removed
		// moves the M counter, which an undo then recounts. A customer a tenth of the way along L2 from J1
		// lumps its demand there (EngCalcs.lpnCustomerNode: the nearer end along the pipe).
		const c = L.addCustomer(110, 20, { link: l2.id, t: 0.1 });
		L.setProp(L.nodeById(J), 'emitter', L.emitterToStore(1.5));
		const q = change(J, 'reservoir', false);
		ok('8.1 the box names the customer', q.length === 1 && q[0].indexOf(J + ': ' + PC.lpn_tool_add_meter + ' ' + c.id) >= 0, q[0]);
		// The emitter crosses back from the solver's SI terms, and must not bring the conversion's
		// noise with it (pre-review: "6646.932397").
		ok('8.2 the emitter reads as typed, with its two-unit unit', /Emitter coefficient 1\.5 gpm\/psi/.test(q[0]) ||
			q[0].indexOf(PC.lpn_field_emitter + ' 1.5 ') >= 0, q[0]);
		L.setProp(L.nodeById(J), 'emitter', undefined);
	}

	say('\n--- 10. Recalculate off: a converted node keeps its stale results until Calculate ---');
	{
		// The built-in solver, which answers at once; the EPANET engine (the default) answers later.
		const engineWas = S.engine;
		S.engine = 'native';
		S.autoRun = false;
		L.runSolve();
		const r = L.lastResult(), n = L.nodeById(J);
		const p0 = L.colorNodeValue(n, 'pressure'), h0 = L.colorNodeValue(n, 'head');
		ok('10.0 the solve gave the junction a pressure', !!r && typeof p0 === 'number' && Math.abs(p0) > 1, String(p0));
		change(J, 'reservoir', true);
		ok('10.1 still the same stale solve on show', L.lastResult() === r);
		ok('10.2 the converted node shows the pressure it had, not an invented one',
			L.fixedHeadPressure(L.nodeById(J)) === p0 && L.colorNodeValue(L.nodeById(J), 'pressure') === p0,
			L.fixedHeadPressure(L.nodeById(J)) + ' vs ' + p0);
		ok('10.3 ...and the head it had', L.colorNodeValue(L.nodeById(J), 'head') === h0);
		L.setProp(L.nodeById(J), 'head', 900);
		ok('10.4 an edit of its head shows at once, as any edit does with Recalculate off',
			L.colorNodeValue(L.nodeById(J), 'head') !== h0);
		L.undo();   // the head edit: a reservoir with a blank head again, the stale solve still on show
		L.runSolve();
		ok('10.5 Calculate retires the hold: the reading is now the reservoir\'s own (its head is its ground)',
			L.lastResult() !== r && L.fixedHeadPressure(L.nodeById(J)) === 0, String(L.fixedHeadPressure(L.nodeById(J))));
		L.undo();   // the type change
		S.autoRun = true;
		S.engine = engineWas;
	}

	say('\n--- 11. Net1: tank 2 -> reservoir -> tank, and every junction pressure is unchanged ---');
	{
		L.importInp({ name: 'Net1.inp', _text: NET1 });
		const solve = () => solver.lpnSolve(L.assembleModel(), { tol: 1e-9 });
		const juncs = doc().nodes.filter(nd => nd.type === 'junction').map(nd => nd.id);
		const before = solve();
		const t2 = L.nodeById('2');
		ok('11.0 Net1 tank 2 is a tank at 850 with 120 of water', t2 && t2.type === 'tank' && t2.elev === 850 &&
			L.effective(t2, 'level') === 120);
		// A scenario's own water depth is a surface too, and goes the same way.
		const low = L.createScenario('Low tank');
		L.setProp(t2, 'level', 100);
		L.switchScenario(L.baseScenario().id);
		const ovOf = () => (L.getScenarios().filter(x => x.id === low.id)[0].overrides || {})['n:2'] || {};
		let q = change('2', 'reservoir', true);
		ok('11.1b the scenario\'s depth 100 became its head 950, and the box names it',
			ovOf().head === 950 && !('level' in ovOf()) && (q[0] || '').indexOf('Low tank') >= 0, JSON.stringify(ovOf()));
		ok('11.1 the reservoir\'s head is 970', L.effective(L.nodeById('2'), 'head') === 970,
			String(L.effective(L.nodeById('2'), 'head')));
		ok('11.2 the box says so', (q[0] || '').indexOf('2: ' + PC.lpn_field_head + ' 970') >= 0, q[0]);
		let after = solve(), worst = 0;
		juncs.forEach(id => { worst = Math.max(worst, Math.abs(after.pressures[id] - before.pressures[id])); });
		ok('11.3 every junction pressure unchanged (within 1e-6)', worst < 1e-6, 'worst ' + worst);
		q = change('2', 'tank', true);
		ok('11.4 back to a tank: elevation 850, water depth 120', L.nodeById('2').elev === 850 &&
			L.effective(L.nodeById('2'), 'level') === 120, String(L.effective(L.nodeById('2'), 'level')));
		ok('11.4b ...and the scenario\'s depth is 100 again', ovOf().level === 100 && !('head' in ovOf()), JSON.stringify(ovOf()));
		ok('11.5 the box says the depth', (q[0] || '').indexOf('2: ' + PC.lpn_field_tank_level + ' 120') >= 0, q[0]);
		after = solve(); worst = 0;
		juncs.forEach(id => { worst = Math.max(worst, Math.abs(after.pressures[id] - before.pressures[id])); });
		ok('11.6 and every junction pressure is still unchanged', worst < 1e-6, 'worst ' + worst);
	}


	// ---- THE LINK HALF ----------------------------------------------------------------------
	function changeLink(id, to, ans) {
		asked = [];
		answer = ans === undefined ? true : ans;
		L.setSelectionList([{ kind: 'link', id: id }]);
		L.changeSelectedType(to);
		return asked;
	}
	function linkSection(inp, id) {
		let sec = null, found = [];
		inp.split(/\r?\n/).forEach(function (line) {
			const m = /^\s*\[([A-Z]+)\]/.exec(line);
			if (m) { sec = m[1]; return; }
			const t = line.replace(/;.*$/, '').trim().split(/\s+/);
			if (t[0] === id && ['PIPES', 'PUMPS', 'VALVES'].indexOf(sec) >= 0) { found.push(sec); }
		});
		return found.join(',');
	}
	// The box's own shape: the key line first, and every line of the lost list is "ID: ...".
	function boxShape(text, id) {
		const lines = text.split('\n');
		if (lines[0] !== PC.lpn_change_type_key) { return 'first line ' + lines[0]; }
		const part = text.split(PC.lpn_change_type_lost + '\n')[1];
		if (!part) { return 'no lost list'; }
		const bad = part.split('\n\n')[0].split('\n').filter(l => l.indexOf(id + ': ') !== 0);
		return bad.length ? 'not "ID: ...": ' + bad.join(' | ') : '';
	}
	const solveNow = () => solver.lpnSolve(L.assembleModel(), { tol: 1e-9 });
	const allFinite = r => r && r.converged && Object.keys(r.heads).every(k => isFinite(r.heads[k])) &&
		Object.keys(r.flows).every(k => isFinite(r.flows[k]));
	const engineWas2 = S.engine;
	S.engine = 'native';

	say('\n--- 12. Net1: pipe 10 -> valve ---');
	{
		L.importInp({ name: 'Net1.inp', _text: NET1 });
		const p10 = L.linkById('10');
		p10.desc = 'Plant main'; p10.tag = 'MAIN-1';
		const scn = L.createScenario('Relined');
		L.setProp(p10, 'roughness', 140);
		L.switchScenario(L.baseScenario().id);
		const r0 = solveNow();
		const before = snap();
		let q = changeLink('10', 'valve', false);
		const text = q[0] || '';
		ok('12.1 the box was shown, key first, every lost line "10: ..."', q.length === 1 && boxShape(text, '10') === '', boxShape(text, '10') + ' | ' + text);
		ok('12.2 it lists length, roughness, and the scenario\'s roughness by name',
			text.indexOf('10: ' + PC.lpn_field_length + ' 10530') >= 0 && /10: [^\n]* 100\n/.test(text) &&
			text.split('\n').some(l => l.indexOf('10: ') === 0 && l.indexOf('Relined') > 0 && l.indexOf(' 140') > 0), text);
		ok('12.3 ...and says the valve is born a throttle valve (TCV)', text.indexOf(PC.lpn_change_type_born) > 0 &&
			text.indexOf('10: ' + PC.lpn_field_valve_type + ' ' + PC.lpn_valve_type_tcv) >= 0, text);
		ok('12.4 Cancel leaves the document byte-identical', snap() === before);
		changeLink('10', 'valve', true);
		const v = L.linkById('10');
		ok('12.5 the same object is a TCV valve with setting 2, zero length, Auto off',
			v === p10 && v.type === 'valve' && v.valveType === 'TCV' && L.effective(v, 'setting') === 2 &&
			v._length === 0 && v.lenAuto === false, JSON.stringify(v));
		ok('12.6 kept: ID, ends, bends, diameter 18, Description, Tag', v.id === '10' && v.from === '10' && v.to === '11' &&
			Array.isArray(v.verts) && v._diameter === 18 && v.desc === 'Plant main' && v.tag === 'MAIN-1');
		ok('12.7 gone: roughness from Base and the scenario',
			!('_roughness' in v) && !(((L.getScenarios().filter(x => x.id === scn.id)[0].overrides || {})['l:10']) || {}).roughness);
		ok('12.8 the export writes it under [VALVES]', linkSection(L.exportInp().inp, '10') === 'VALVES', linkSection(L.exportInp().inp, '10'));
		const r1 = solveNow();
		// Pipe 10 is the only way out of the pump: its flow is the pump's. Without 10 530 ft of pipe
		// friction, junction 11 sits higher and the pump delivers a little more, the same way.
		ok('12.9 SOLVE: still converges, finite everywhere', allFinite(r1), r1 && r1.converged);
		ok('12.10 ...flow through 10 the same direction and within 25%, head at 11 not lower',
			Math.sign(r1.flows['10']) === Math.sign(r0.flows['10']) && Math.abs(r1.flows['10'] / r0.flows['10'] - 1) < 0.25 &&
			r1.heads['11'] >= r0.heads['11'] - 1e-6,
			r0.flows['10'] + ' -> ' + r1.flows['10'] + ', H11 ' + r0.heads['11'] + ' -> ' + r1.heads['11']);
		L.undo();
		ok('12.11 one undo: byte-identical', snap() === before);
		const r2 = solveNow();
		ok('12.12 ...and solves back to the pipe\'s answer', Math.abs(r2.heads['11'] - r0.heads['11']) < 1e-9);
	}

	say('\n--- 13. Net1: valve -> pipe ---');
	{
		changeLink('10', 'valve', true);
		// A bend gives the drawn length an irrational tail, which the box must show as the length
		// field does, to 2 places.
		L.linkById('10').verts = [{ x: 25, y: 73 }];
		const r0 = solveNow();
		const before = snap();
		const q = changeLink('10', 'pipe', false);
		const text = q[0] || '';
		ok('13.1 the box: key first, the valve type and its loss coefficient lost', boxShape(text, '10') === '' &&
			text.indexOf('10: ' + PC.lpn_field_valve_type + ' ' + PC.lpn_valve_type_tcv) >= 0 &&
			text.indexOf('10: ' + PC.lpn_field_valve_setting_loss + ' 2') >= 0, text);
		const geom = L.linkGeomLength(L.linkById('10'));
		const shown = String(+geom.toFixed(2));
		ok('13.2 ...and the new pipe\'s drawn length is said, to the field\'s 2 places', text.indexOf(PC.lpn_change_type_born) > 0 &&
			String(geom).length > shown.length && text.indexOf('10: ' + PC.lpn_field_length + ' ' + shown + ' ft\n') >= 0, shown + ' | ' + text);
		ok('13.3 Cancel: byte-identical', snap() === before);
		changeLink('10', 'pipe', true);
		const p = L.linkById('10');
		ok('13.4 a pipe with Auto length at its drawn length, New assets roughness, diameter kept',
			p.type === 'pipe' && p.lenAuto === true && p._length === geom && p._roughness === D.roughness && p._diameter === 18 &&
			!('valveType' in p) && !('_setting' in p), JSON.stringify(p));
		const r1 = solveNow();
		ok('13.5 SOLVE: converges, finite, flow through 10 the same direction', allFinite(r1) &&
			Math.sign(r1.flows['10']) === Math.sign(r0.flows['10']), r0.flows['10'] + ' -> ' + (r1 && r1.flows['10']));
		L.undo();
		ok('13.6 one undo: byte-identical', snap() === before);
		L.undo();   // back to Net1's pipe
		L.linkById('10').verts = [];
	}

	say('\n--- 14. Net1: pipe 10 -> pump, without and then with a curve ---');
	{
		const r0 = solveNow();
		const before = snap();
		const q = changeLink('10', 'pump', true);
		const text = q[0] || '';
		ok('14.1 the box: key first; diameter, roughness and length lost', boxShape(text, '10') === '' &&
			text.indexOf('10: ' + PC.lpn_field_diameter + ' 18') >= 0 && text.indexOf('10: ' + PC.lpn_field_length) >= 0, text);
		ok('14.2 ...and it says the pump has no curve, so it adds no head',
			text.indexOf(String(PC.lpn_change_type_no_curve).replace('{id}', '10')) >= 0, text);
		const pm = L.linkById('10');
		// A pump's diameter is hidden and only seeds the solver's first flow: a drawn pump's is the
		// New assets diameter (addLink()), so a converted pump's is too.
		ok('14.3 a pump naming no curve, no length or roughness, the hidden New assets diameter', pm.type === 'pump' &&
			L.effective(pm, 'curveId') === undefined && pm._diameter === D.diameter &&
			!('_length' in pm) && !('_roughness' in pm), JSON.stringify(pm));
		ok('14.3b the no-curve line says an .inp export writes it as a pipe', /\.inp/.test(PC.lpn_change_type_no_curve) &&
			/pipe/.test(PC.lpn_change_type_no_curve), PC.lpn_change_type_no_curve);
		// The page's normal treatment of a curveless pump: the file gets a smooth stand-in pipe.
		ok('14.4 the export writes the curveless pump as its stand-in pipe', linkSection(L.exportInp().inp, '10') === 'PIPES',
			linkSection(L.exportInp().inp, '10'));
		const r1 = solveNow();
		ok('14.5 SOLVE without a curve: converges; it neither adds nor loses head (|H10 - H11| < 0.01 m)',
			allFinite(r1) && Math.abs(r1.heads['10'] - r1.heads['11']) < 0.01, r1 && (r1.heads['10'] + ' / ' + r1.heads['11']));
		L.setProp(pm, 'curveId', '1');
		const r2 = solveNow();
		ok('14.6 SOLVE with Net1\'s curve 1: converges, and the pump lifts 11 above 10',
			allFinite(r2) && r2.heads['11'] > r2.heads['10'] + 1 && r2.flows['10'] > 0,
			r2 && (r2.heads['10'] + ' -> ' + r2.heads['11'] + ', Q ' + r2.flows['10']));
		ok('14.6b with a curve, the export writes it under [PUMPS]', linkSection(L.exportInp().inp, '10') === 'PUMPS');
		L.undo(); L.undo();
		ok('14.7 two undos (curve, change): byte-identical', snap() === before);
		ok('14.8 ...and Net1 solves as it did', Math.abs(solveNow().heads['11'] - r0.heads['11']) < 1e-9);
	}

	say('\n--- 15. Net1: pump 9 -> pipe; Net3: pump 335 -> pipe -> pump ---');
	{
		const before = snap();
		const q = changeLink('9', 'pipe', false);
		const text = q[0] || '';
		ok('15.1 the box: key first; the head curve 1 lost', boxShape(text, '9') === '' &&
			text.indexOf('9: ' + PC.lpn_pump_curve_source + ' 1') >= 0, text);
		ok('15.2 Cancel: byte-identical', snap() === before);
		// Every value the pipe is born with is said, with its unit (pre-review: only the length was).
		const bornPart = text.split(PC.lpn_change_type_born + '\n')[1] || '';
		ok('15.2b "These are new" lists the pipe\'s diameter, roughness, minor loss and length, with units',
			bornPart.indexOf('9: ' + PC.lpn_field_diameter + ' ' + D.diameter + ' in') >= 0 &&
			bornPart.indexOf(' ' + D.roughness + '\n') > 0 &&
			bornPart.indexOf('9: ' + PC.lpn_field_km + ' ' + D.k) >= 0 &&
			bornPart.indexOf('9: ' + PC.lpn_field_length + ' ') >= 0, bornPart);
		const tv = changeLink('9', 'valve', false)[0] || '';
		const bornV = tv.split(PC.lpn_change_type_born + '\n')[1] || '';
		ok('15.2c pump -> valve: diameter, valve type and setting are listed as new; the pump\'s hidden diameter is not carried',
			bornV.indexOf('9: ' + PC.lpn_field_diameter + ' ' + D.diameter + ' in') >= 0 &&
			bornV.indexOf('9: ' + PC.lpn_field_valve_type + ' ' + PC.lpn_valve_type_tcv) >= 0 &&
			bornV.indexOf('9: ' + PC.lpn_field_valve_setting_loss + ' 2') >= 0 && snap() === before, bornV);
		changeLink('9', 'pipe', true);
		const r1 = solveNow();
		const p = L.linkById('9');
		ok('15.3 a pipe, no curve, the New assets diameter (not the pump\'s hidden 18); SOLVE converges, finite',
			p.type === 'pipe' && !('_curveId' in p) && p._diameter === D.diameter && allFinite(r1),
			JSON.stringify(p));
		// Without the pump, water reaches junction 10 only from the tank, so it sits below the tank's 970 ft.
		ok('15.4 ...and the reservoir no longer lifts junction 10 above the tank surface', r1.heads['10'] < 970 * 0.3048 + 1e-6,
			String(r1.heads['10']));
		L.undo();
		ok('15.5 one undo: byte-identical', snap() === before);

		L.importInp({ name: 'Net3.inp', _text: NET3 });
		const n3 = solveNow();
		ok('15.6 Net3 solves as imported', allFinite(n3));
		const b3 = snap();
		let t = changeLink('335', 'pipe', true)[0] || '';
		ok('15.7 pump 335 -> pipe: key first, curve 2 lost', boxShape(t, '335') === '' &&
			t.indexOf('335: ' + PC.lpn_pump_curve_source + ' 2') >= 0, t);
		const asPipe = solveNow();
		ok('15.8 SOLVE as a pipe: converges, finite', allFinite(asPipe));
		t = changeLink('335', 'pump', true)[0] || '';
		ok('15.9 pipe -> pump: the no-curve line', t.indexOf(String(PC.lpn_change_type_no_curve).replace('{id}', '335')) >= 0, t);
		L.setProp(L.linkById('335'), 'curveId', '2');
		const back = solveNow();
		let worst = 0;
		Object.keys(n3.heads).forEach(k => { worst = Math.max(worst, Math.abs(back.heads[k] - n3.heads[k])); });
		ok('15.10 with its curve back, Net3 solves to its own answer (every head within 1e-6 m)',
			allFinite(back) && worst < 1e-6, 'worst ' + worst);
		L.undo(); L.undo(); L.undo();
		ok('15.11 three undos: byte-identical Net3', snap() === b3);
	}

	say('\n--- 16. a pipe with customers -> valve ---');
	{
		L.importInp({ name: 'Net1.inp', _text: NET1 });
		const pipe = L.linkById('111');   // 11 -> 21
		const c1 = L.addCustomer(0, 0, { link: '111', t: 0.1 });
		const c2 = L.addCustomer(0, 0, { link: '111', t: 0.8 });
		c1.demand = 3; c2.demand = 4;
		const rows = () => {
			const by = global.EngCalcs.lpnCustomerRowsByNode(doc()), out = {};
			Object.keys(by).forEach(k => { out[k] = by[k].map(r => r.customer.id + '=' + r.base).join(','); });
			return JSON.stringify(out);
		};
		const rowsBefore = rows(), pts = [c1, c2].map(c => L.customerPoint(c));
		const r0 = solveNow();
		const before = snap();
		const q = changeLink('111', 'valve', true);
		const text = q[0] || '';
		ok('16.1 the box names both customers and the node each is connected to',
			text.indexOf(PC.lpn_change_type_customers) > 0 &&
			text.indexOf('111: ' + PC.lpn_tool_add_meter + ' ' + c1.id + ' (11)') >= 0 &&
			text.indexOf('111: ' + PC.lpn_tool_add_meter + ' ' + c2.id + ' (21)') >= 0, text);
		const a = L.customerById(c1.id), b = L.customerById(c2.id);
		ok('16.2 each now connects to that node, not the valve', !a.link && a.node === '11' && !b.link && b.node === '21',
			JSON.stringify([a, b]));
		const pts2 = [a, b].map(c => L.customerPoint(c));
		ok('16.3 ...drawn exactly where they were', pts.every((p, i) => Math.abs(p.x - pts2[i].x) < 1e-9 && Math.abs(p.y - pts2[i].y) < 1e-9),
			JSON.stringify(pts) + ' vs ' + JSON.stringify(pts2));
		ok('16.4 ...and their demand lands on the same nodes', rows() === rowsBefore, rowsBefore + ' vs ' + rows());
		ok('16.5 SOLVE: converges', allFinite(solveNow()) && allFinite(r0));
		L.undo();
		ok('16.6 one undo: byte-identical, customers back on the pipe', snap() === before && L.customerById(c1.id).link === '111');
	}

	say('\n--- 17. a link named in a rule and a control ---');
	{
		const R = ['RULE R1', 'IF PIPE 10 FLOW ABOVE 100   ; plant main', 'THEN Pipe 10 SETTING IS 1', 'AND PUMP 9 STATUS IS OPEN', '',
			'RULE R2', 'IF LINK 10 STATUS IS OPEN', 'THEN PUMP 9 STATUS IS CLOSED'];
		doc().rules = R.slice();
		const read = L.libReadControl('LINK 10 1.5 AT TIME 2');
		ok('17.0 the control reads', read.ok);
		L.libControls().push(read.rec);
		const before = snap();
		const q = changeLink('10', 'valve', false);
		const text = q[0] || '';
		ok('17.1 the box lists the two rule lines whose kind word changes, rewritten',
			text.indexOf(PC.lpn_change_type_rules + '\nIF VALVE 10 FLOW ABOVE 100   ; plant main\nTHEN Valve 10 SETTING IS 1') > 0, text);
		ok('17.2 ...and the control and the rule line that give 10 a setting',
			text.indexOf(PC.lpn_change_type_setting) > 0 && /LINK 10 1\.5/.test(text.split(PC.lpn_change_type_setting)[1] || '') &&
			(text.split(PC.lpn_change_type_setting)[1] || '').indexOf('THEN Pipe 10 SETTING IS 1') >= 0, text);
		ok('17.3 Cancel: byte-identical', snap() === before);
		changeLink('10', 'valve', true);
		ok('17.4 the rules now say VALVE 10, keep their case and comment, and leave LINK and PUMP 9 alone',
			JSON.stringify(doc().rules) === JSON.stringify(['RULE R1', 'IF VALVE 10 FLOW ABOVE 100   ; plant main', 'THEN Valve 10 SETTING IS 1',
				'AND PUMP 9 STATUS IS OPEN', '', 'RULE R2', 'IF LINK 10 STATUS IS OPEN', 'THEN PUMP 9 STATUS IS CLOSED']), JSON.stringify(doc().rules));
		const parsed = global.EngCalcs.lpnRuleParse(doc().rules);
		ok('17.5 ...and every rule still parses', parsed.length === 2 && parsed.every(b => b.ok), JSON.stringify(parsed.map(b => b.ok)));
		L.undo();
		ok('17.6 one undo: byte-identical', snap() === before);
	}
	say('\n--- 18. Recalculate off: a changed link shows no results until Calculate ---');
	{
		L.importInp({ name: 'Net1.inp', _text: NET1 });
		const S2 = L.getSettings();
		S2.engine = 'native';
		S2.autoRun = false;
		// Net1 states a 24-hour duration, which makes Calculate an EPANET run (asynchronous). The
		// single instant through the built-in solver is the same snapshot question, answered now.
		const timeRunWas = global.EngCalcs.lpnTimeRun;
		global.EngCalcs.lpnTimeRun = null;
		L.runSolve();
		const r = L.lastResult(), l10 = L.linkById('10');
		const f9 = L.colorLinkValue(L.linkById('9'), 'flow'), f10 = L.colorLinkValue(l10, 'flow');
		ok('18.0 the solve gave pump 9 a flow', typeof f9 === 'number' && f9 > 0, String(f9));
		changeLink('9', 'pipe', true);
		const p9 = L.linkById('9');
		ok('18.1 the same stale solve is on show', L.lastResult() === r);
		ok('18.2 the new pipe shows no flow, velocity, head loss or gradient (none was calculated)',
			['flow', 'velocity', 'headloss', 'gradient'].every(f => L.colorLinkValue(p9, f) === undefined),
			['flow', 'velocity', 'headloss', 'gradient'].map(f => L.colorLinkValue(p9, f)).join(','));
		ok('18.3 ...while every other link keeps its stale result', L.colorLinkValue(l10, 'flow') === f10);
		L.undo();
		ok('18.4 undo puts the pump back with its own results', typeof f9 === 'number' && L.colorLinkValue(L.linkById('9'), 'flow') === f9);
		changeLink('9', 'pipe', true);
		L.runSolve();
		const q9 = L.colorLinkValue(L.linkById('9'), 'flow');
		ok('18.5 Calculate gives the pipe its own flow', L.lastResult() !== r && typeof q9 === 'number' && isFinite(q9), String(q9));
		L.undo();
		S2.autoRun = true;
		global.EngCalcs.lpnTimeRun = timeRunWas;
	}

	say('\n--- 19. a pipe whose library pipe type is chosen only in a scenario -> valve ---');
	{
		L.importInp({ name: 'Net1.inp', _text: NET1 });
		doc().pipeTypes = [{ id: 'DI30', props: { diameter: 30 } }];
		const s1 = L.createScenario('S1');
		L.setProp(L.linkById('10'), 'typeId', 'DI30');
		L.switchScenario(L.baseScenario().id);
		const q = changeLink('10', 'valve', true);
		ok('19.1 the box says that scenario\'s diameter 30 in becomes Base\'s 18 in',
			(q[0] || '').indexOf('10: ' + PC.lpn_field_diameter + ' 30 in, in scenario S1, becomes 18 in') >= 0, q[0]);
		L.switchScenario(s1.id);
		ok('19.2 ...and so it is', L.effective(L.linkById('10'), 'diameter') === 18, String(L.effective(L.linkById('10'), 'diameter')));
		L.switchScenario(L.baseScenario().id);
	}
	S.engine = engineWas2;

	return fails;
}

const fails = run(null, false);
console.log('\n--- 9. live mutations: each must turn this harness red ---');
const MUTATIONS = [
	['the lost values are kept (no delete)', src => src.replace(
		"delete n[sk];   // base-write: the type is Base-owned", "void n[sk];   // base-write: the type is Base-owned")],
	['the box is never shown', src => src.replace(
		"if (!lost.length && !meaning.length && !surface.length && !moved.length && !rules.length && !setting.length && !born.length) { proceed(); return; }", "{ proceed(); return; }")],
	['the key line is dropped', src => src.replace(
		"if (lost.length) { text.push(String(pc.lpn_change_type_key", "if (false) { text.push(String(pc.lpn_change_type_key")],
	['no undo snapshot', src => src.replace(
		"\t\tfunction proceed() {\n\t\t\tsaveUndoSnapshot();\n", "\t\tfunction proceed() {\n")],
	['the new type gets no New assets defaults', src => src.replace(
		"n[k] = birth[k];   // base-write: the new type's own", "void birth[k];   // base-write: the new type's own")],
	['the tank\'s water surface is not carried', src => src.replace(
		"if (typeof n._level === 'number') { out.base = { value: e + n._level }; }", "")],
	['the reservoir\'s head is not carried into a tank', src => src.replace(
		"if (n._head >= e) { out.base = { value: n._head - e }; }", "")],
	['a converted node shows freshly derived results', src => src.replace(
		"\t\tvar held = heldTypeChange(n, 'pressure');\n\t\tif (held !== undefined) { return held; }\n", "")],
	['scenario overrides survive', src => src.replace(
		"spec.props.forEach(function (p) { delete ov[p]; });", "spec.props.forEach(function (p) { void ov[p]; });")],
	// The link half (sections 12-17).
	['a link keeps what only its old type had', src => src.replace(
		"delete l[sk];   // base-write: the type is Base-owned", "void l[sk];   // base-write: the type is Base-owned")],
	['a link\'s scenario overrides survive', src => {
		const k = "spec.props.forEach(function (p) { delete ov[p]; });", i = src.lastIndexOf(k);
		return src.slice(0, i) + "spec.props.forEach(function (p) { void ov[p]; });" + src.slice(i + k.length);
	}],
	['a new link gets no New assets values', src => src.replace(
		"l[k] = birth[k];   // base-write: the new type's own", "void birth[k];   // base-write: the new type's own")],
	['the box does not say a new pump has no curve', src => src.replace(
		"if (to === 'pump') {\n\t\t\tborn.push(", "if (false) {\n\t\t\tborn.push(")],
	['customers stay on the valve', src => src.replace(
		"\t\t\t\tc.link = null;\n\t\t\t\tdelete c.t;\n\t\t\t\tif (nid !== null && nid !== undefined) { c.node = nid; } else { delete c.node; }\n\t\t\t\t// The meter stays",
		"\t\t\t\t// The meter stays")],
	['rule kind words are not rewritten', src => src.replace(
		"ruleKindRewrites(l.id, to).forEach(function (r) { doc.rules[r.index] = r.line; });", "")],
	['a changed link shows its stale results', src => src.replace(
		"if (h.result !== lastSolveResult || h.type !== l.type) { delete typeChangeHeldLink[l.id]; return false; }\n\t\treturn true;",
		"return false;")],
	['the born values are not listed', src => src.replace(
		"born.push(changeTypeLine(LINE, l.id, spec.label, changeTypeValueText(spec, birth[k0])));", "")],
	['the scenario diameter consequence is not listed', src => src.replace(
		"if (was === newDia) { return; }", "return;")],
	['controls are not re-read after the change', src => src.replace(
		"\t\t\t\t\tlibAnnotateControl(c);\n\t\t\t\t}\n\t\t\t});\n\t\t\t// The symbol is the type", "\t\t\t\t}\n\t\t\t});\n\t\t\t// The symbol is the type")]
];
let mutFails = 0;
MUTATIONS.forEach(function (m) {
	let red;
	// A mutation that THROWS mid-run has turned the harness red as surely as a failed check; only
	// one that changed nothing in the source is the harness's own fault (loadLoopedNetwork throws
	// "the mutation changed nothing" before any check runs).
	try { red = run(m[1], true); }
	catch (e) {
		if (/the mutation changed nothing/.test(e.message)) {
			console.log('FAIL  mutation no longer applies: ' + m[0]); mutFails++; return;
		}
		red = 'a thrown error (' + e.message + '), so it';
	}
	console.log((red ? 'PASS  ' : 'FAIL  ') + 'mutation "' + m[0] + '" turns ' + red + ' check(s) red');
	if (!red) { mutFails++; }
});

const total = fails + mutFails;
console.log('\n' + (total ? total + ' FAILED' : 'all passed'));
process.exit(total ? 1 : 0);
