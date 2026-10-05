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
// MUTATION-PROVED IN PROCESS (section 9): five live mutations of js/looped-network.js -- keep the
// lost values, never ask, skip the undo snapshot, skip the New assets defaults, keep the scenario
// overrides -- each must turn this harness red, or the harness fails.

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
const PC = global.EngCalcs.pageConfig;

const INJECT =
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\teffective: effective, setProp: setProp, setCustomProp: setCustomProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tserializeProject: serializeProject, undo: undo,\n" +
	"\t\tsetSelectionList: setSelectionList, changeSelectedNodeType: changeSelectedNodeType,\n" +
	"\t\tchangeTypeRows: changeTypeRows, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tincident: function (id) { return incidentLinks[id]; },\n" +
	"\t\tlibReadControl: libReadControl, libControls: libControls, addCustomer: addCustomer,\n" +
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

	say('\n--- 2. reservoir -> tank: the tank a click would have drawn ---');
	{
		const q = change(J, 'tank');
		const n = L.nodeById(J);
		ok('2.1 no box (a reservoir with a blank head has nothing to lose)', q.length === 0, JSON.stringify(q));
		ok('2.2 it is a tank', n.type === 'tank');
		ok('2.3 water depth, lowest, highest and diameter are the New assets defaults',
			L.effective(n, 'level') === D.tankLevel && n.minLevel === D.tankMinLevel &&
			n.maxLevel === D.tankMaxLevel && n.tankDiameter === D.tankDiameter,
			[L.effective(n, 'level'), n.minLevel, n.maxLevel, n.tankDiameter].join(',') + ' vs ' +
			[D.tankLevel, D.tankMinLevel, D.tankMaxLevel, D.tankDiameter].join(','));
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
		ok('3.2 it opens with the "values will be lost" sentence', text.indexOf(PC.lpn_change_type_lost) === 0, text.split('\n')[0]);
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
		ok('4.2 ...and the scenario\'s own, by name', text.indexOf('Max day') >= 0 && text.indexOf(' 25') >= 0, text);
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
		let q = change(J, 'reservoir', true);
		ok('6.1 tank -> reservoir does not name the control (a level both sides)',
			q.length === 1 && q[0].indexOf(PC.lpn_change_type_meaning) < 0, q[0]);
		// reservoir (blank head) -> junction: nothing lost, but the control crosses pressure/level.
		q = change(J, 'junction', true);
		ok('6.2 reservoir -> junction asks, for the control alone', q.length === 1 &&
			q[0].indexOf(PC.lpn_change_type_meaning) === 0 && q[0].indexOf('IF NODE ' + J) >= 0, q[0]);
		ok('6.3 ...and the round trip is complete: a junction again', L.nodeById(J).type === 'junction');
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
		ok('6b.2 the list is capped, and says how many more', (text.match(/\n/g) || []).length === 21 &&
			text.indexOf(String(PC.lpn_change_type_more).replace('{n}', '4')) >= 0, text.split('\n').slice(-2).join(' | '));
		ok('6b.3 all six changed', tanks.every(id => L.nodeById(id).type === 'junction'));
		L.undo();
		ok('6b.4 ONE undo puts all six back, byte for byte', snap() === before);
	}

	say('\n--- 7. the menu rows ---');
	{
		select(J);
		const rows = L.changeTypeRows();
		ok('7.1 three rows, in the Insert order', rows.map(r => r.label).join('|') ===
			[PC.lpn_tool_add_junction, PC.lpn_tool_add_reservoir, PC.lpn_tool_add_tank].join('|'));
		ok('7.2 the type it already is, is disabled; the others are not',
			rows[0].disabled && !rows[1].disabled && !rows[2].disabled);
		L.setSelectionList([]);
		ok('7.3 with nothing selected every row is disabled', L.changeTypeRows().every(r => r.disabled));
	}
	say('\n--- 8. a customer whose demand lands on the junction is named ---');
	{
		// J1 is a junction again after section 6. Last, because a customer added and removed
		// moves the M counter, which an undo then recounts. A customer a tenth of the way along L2 from J1
		// lumps its demand there (EngCalcs.lpnCustomerNode: the nearer end along the pipe).
		const c = L.addCustomer(110, 20, { link: l2.id, t: 0.1 });
		const q = change(J, 'reservoir', false);
		ok('8.1 the box names the customer', q.length === 1 && q[0].indexOf(J + ': ' + PC.lpn_tool_add_meter + ' ' + c.id) >= 0, q[0]);
	}

	return fails;
}

const fails = run(null, false);
console.log('\n--- 9. live mutations: each must turn this harness red ---');
const MUTATIONS = [
	['the lost values are kept (no delete)', src => src.replace(
		"delete n[sk];   // base-write: the type is Base-owned", "void n[sk];   // base-write: the type is Base-owned")],
	['the box is never shown', src => src.replace(
		"if (!lost.length && !meaning.length) { proceed(); return; }", "{ proceed(); return; }")],
	['no undo snapshot', src => src.replace(
		"\t\tfunction proceed() {\n\t\t\tsaveUndoSnapshot();\n\t\t\ttargets.forEach(", "\t\tfunction proceed() {\n\t\t\ttargets.forEach(")],
	['the new type gets no New assets defaults', src => src.replace(
		"n[k] = birth[k];   // base-write: the new type's own", "void birth[k];   // base-write: the new type's own")],
	['scenario overrides survive', src => src.replace(
		"spec.props.forEach(function (p) { delete ov[p]; });", "spec.props.forEach(function (p) { void ov[p]; });")]
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
