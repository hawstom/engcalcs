// FOUR THINGS A MEETING CAUGHT -- Tom, 2026-10-09, using the page for Engineers Without Borders:
//
//   1. "I got caught by our refusal to calculate a network that has disconnected junctions.
//       ... Do we have the power to relax this and to simply neglect disconnected junctions?"
//   2. "I got caught by our refusal to calculate a network that has no reservoir. ... to
//       calculate based on a tank only without checking for the presence of a reservoir?"
//   3. "I got caught by the inability to edit the from and to nodes for a link."
//   4. "Could we offer to break a link when a node is placed on it?"
//
//   node dev/lpn-spike/ewb-meeting-harness.js
//
// 1 and 2 run through BOTH engines (the built-in solver and the vendored EPANET) and through an
// extended-period run, because the old refusal lived in lpnDiagnose() and both engines call it.
// The observable is the network the engine was handed and the answer that came back, never a flag:
// the disconnected junctions must be ABSENT from the result, the connected ones must carry the same
// head as the network solved without the extras, and the document must be untouched (nothing marked
// inactive). Section 5 proves a normal network (Net1) is byte-for-byte what it was.

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

// The clock's file is not loaded by the stub; the page seams to it when it is there.
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, undo: undo, saveUndoSnapshot: saveUndoSnapshot,\n" +
	"\t\tbreakPipeAtPoint: breakPipeAtPoint, linkEndProblem: linkEndProblem,\n" +
	"\t\treconnectLinkEnd: reconnectLinkEnd, paneColEnds: paneColEnds, nodeById: nodeById,\n" +
	"\t\tlinkById: linkById, incident: function () { return incidentLinks; },\n" +
	"\t\tscenarios: function () { return scenarios; },\n" +
	"\t\tcustomersByLink: function () { return customersByLink; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const statusEl = global.document.getElementById('lpn_status');
function status() { return (global.document.getElementById('lpn_status_text') || statusEl).textContent || ''; }
const near = (a, b, tol) => Math.abs(a - b) <= (tol || 1e-6);

// SI strip: mm, m, L/s. A TANK ONLY (no reservoir), a short chain, and a separate pair of
// junctions no pipe connects to the tank.
function tankNet() {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.scenarios().length = 0;
	L.scenarios().push({ id: 'base', name: 'Base', isBase: true, overrides: {} });
	doc.nodes.push({ id: 'T1', type: 'tank', x: 0, y: 0, elev: 50, _level: 5, minLevel: 0, maxLevel: 6, tankDiameter: 10 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 10 });
	doc.nodes.push({ id: 'J2', type: 'junction', x: 1000, y: 0, elev: 0, _demand: 10 });
	doc.nodes.push({ id: 'J8', type: 'junction', x: 0, y: 800, elev: 0, _demand: 5 });
	doc.nodes.push({ id: 'J9', type: 'junction', x: 500, y: 800, elev: 0, _demand: 5 });
	const pipe = (id, a, b) => ({ id, type: 'pipe', from: a, to: b, verts: [], _diameter: 200, _roughness: 130,
		_length: 500, lenAuto: false, _k: 0, _status: 'open' });
	doc.links.push(pipe('P1', 'T1', 'J1'), pipe('P2', 'J1', 'J2'), pipe('P8', 'J8', 'J9'));
	L.buildDom();   // indexes and elements follow the document written above
	return doc;
}

async function solved() {
	L.runSolve();
	await settleEpanet();
	return L.lastResult();
}

async function main() {
	setUnitSet('si');
	L.buildLayers();
	L.seedDefaultInputs();
	await warmEpanet();

	for (const engine of ['native', 'epanet']) {
		console.log('\n--- 1+2. a tank-only network with two disconnected junctions, ' + engine + ' engine ---');
		const doc = tankNet();
		L.settings().engine = engine;
		L.settings().method = 'hw';
		const before = JSON.stringify(doc);
		const r = await solved();
		ok('it solves instead of refusing', !!r && r.ok !== false && r.heads && r.heads.J1 !== undefined,
			status());
		ok('...with no reservoir anywhere, the tank is the source', r && near(r.heads.T1, 55, 1e-6), r && r.heads && r.heads.T1);
		ok('the disconnected J8 and J9 have no result, as an inactive asset has none',
			r && r.heads.J8 === undefined && r.heads.J9 === undefined && r.flows.P8 === undefined);
		ok('the connected junctions are answered', r && r.heads.J1 < 55 && r.heads.J2 < r.heads.J1);
		ok('the standing note lists the nodes left out', /J8/.test(status()) && /J9/.test(status()), status());
		ok('the stored document is untouched (nothing marked inactive)', JSON.stringify(doc) === before);
		if (engine === 'native') {
			// the same answer as the network without the extras, to the last digit
			const bare = tankNet();
			bare.nodes = bare.nodes.filter((n) => n.id !== 'J8' && n.id !== 'J9');
			bare.links = bare.links.filter((l) => l.id !== 'P8');
			const r2 = await solved();
			ok('J1 and J2 heads equal those of the network drawn without the extras',
				near(r2.heads.J1, r.heads.J1, 1e-9) && near(r2.heads.J2, r.heads.J2, 1e-9));
			ok('...and the note is gone once nothing is left out', status().indexOf('J8') < 0, status());
		}
	}

	console.log('\n--- 1. nothing at all can be solved: still refused, by name ---');
	{
		const doc = tankNet();
		doc.links = doc.links.filter((l) => l.id === 'P8');
		L.settings().engine = 'native';
		const r = await solved();
		ok('a tank with no link to anything is refused', !r && /J1|J2|J8|J9/.test(status()) && status().length > 0, status());
	}

	console.log('\n--- 1+2. an extended-period run, EPANET ---');
	{
		const doc = tankNet();
		doc.times = Object.assign(global.EngCalcs.lpnTimesDefaults(), { duration: 7200 });
		const model = L.assembleModel();
		ok('the model handed over carries a clock', !!model.time);
		ok('J8 and J9 are not in it', !model.nodes.some((n) => n.id === 'J8' || n.id === 'J9') &&
			!model.links.some((l) => l.id === 'P8'));
		const run = await global.EngCalcs.lpnEpanetRun(model, {});
		ok('the period run is not refused', run && run.ok !== false && run.frames && run.frames.length >= 2,
			run && JSON.stringify(run.issues));
		ok('every frame answers J1 and none answers J8',
			run.frames.every((f) => f.heads && f.heads.J1 !== undefined && f.heads.J8 === undefined));
		delete doc.times;
	}

	console.log('\n--- 3. From and To are editable ---');
	{
		const doc = tankNet();
		L.settings().engine = 'native';
		const p2 = L.linkById('P2');
		p2._length = 1234.5; p2.lenAuto = false; p2.tok = { _length: '1234.50' };
		ok('an unknown node is refused, with the id in the words', /ZZ/.test(L.linkEndProblem(p2, 'to', 'ZZ')));
		ok('From equal to To is refused', L.linkEndProblem(p2, 'to', 'J1') !== '');
		ok('an existing node is accepted', L.linkEndProblem(p2, 'to', 'J9') === '');
		const cols = L.paneColEnds();
		ok('the Tables pane has editable From and To cells', cols.length === 2 && cols.every((c) => typeof c.set === 'function'));
		L.saveUndoSnapshot();
		cols[1].set(p2, 'J9');
		ok('To is now J9, the ID is kept', p2.to === 'J9' && p2.id === 'P2' && p2.from === 'J1');
		ok('the typed length is exactly as typed, characters included', p2._length === 1234.5 && p2.tok._length === '1234.50');
		ok('the incident index follows', L.incident().J9.indexOf('P2') >= 0 && L.incident().J2.indexOf('P2') < 0);
		ok('a refused cell edit changes nothing', (cols[1].set(p2, 'NOPE'), p2.to === 'J9'));
		L.undo();
		const back = L.linkById('P2');
		ok('one undo reverses it', back.to === 'J2');
	}

	console.log('\n--- 4. breaking a pipe at a placed node ---');
	{
		const doc = tankNet();
		L.settings().engine = 'native';
		const p1 = L.linkById('P1');
		p1.verts = [{ x: 100, y: 0 }, { x: 400, y: 0 }];
		p1._k = 3; p1._diameter = 250; p1._roughness = 120; p1._status = 'closed'; p1.tag = 'ASSET7';
		p1._length = 600;   // typed; the drawn length of 500 is not what was typed
		p1.tok = { _length: '600.0', _k: '3.0' };
		L.scenarios()[0].overrides['l:P1'] = {};
		L.scenarios().push({ id: 's2', name: 'S2', overrides: { 'l:P1': { diameter: 300, k: 9, length: 600 } } });
		const nLinks = doc.links.length;
		L.saveUndoSnapshot();
		const made = L.breakPipeAtPoint(p1, 'junction', 300, 7);
		const a = made.original, b = made.added;
		ok('one more pipe, one more node', L.getDoc().links.length === nLinks + 1 && doc.nodes.some((n) => n.id === made.node.id));
		ok('the original keeps its ID and its From side; it now ends at the new node',
			a.id === 'P1' && a.from === 'T1' && a.to === made.node.id);
		ok('the new pipe takes the next free ID and runs from the node to the old To node',
			b.id !== 'P1' && /^\D*\d+$/.test(b.id) && b.from === made.node.id && b.to === 'J1', b.id);
		ok('the node sits on the pipe line (y = 0), not where the press was', near(made.node.y, 0) && near(made.node.x, 300));
		ok('vertices are split at the point', a.verts.length === 1 && a.verts[0].x === 100 && b.verts.length === 1 && b.verts[0].x === 400);
		ok('diameter, roughness and status are copied', b._diameter === 250 && b._roughness === 120 && b._status === 'closed');
		ok('the minor loss stays on the original only', a._k === 3 && b._k === 0);
		ok('a Tag (an asset-register key) is not copied', a.tag === 'ASSET7' && b.tag === undefined);
		ok('the typed length is divided in proportion to drawn length (300 of 500 on the From side)',
			near(a._length, 360, 1e-6) && near(b._length, 240, 1e-6), a._length + ' / ' + b._length);
		ok('the halves sum to the typed length', near(a._length + b._length, 600, 1e-9));
		ok('the typed characters of the old length are dropped from both', !(a.tok && a.tok._length) && !(b.tok && b.tok._length));
		const ov = L.scenarios()[1].overrides;
		ok('the scenario override is copied to both, the minor loss to the original only',
			ov['l:P1'].diameter === 300 && ov['l:P1'].k === 9 && ov['l:' + b.id].diameter === 300 &&
			ov['l:' + b.id].k === undefined);
		ok('the scenario length override is divided too', near(ov['l:P1'].length + ov['l:' + b.id].length, 600, 1e-9));
		ok('indexes: the node has both pipes; J1 has the new one, not the old',
			L.incident()[made.node.id].length === 2 && L.incident().J1.indexOf(b.id) >= 0 && L.incident().J1.indexOf('P1') < 0);
		L.undo();
		ok('ONE undo reverses the whole split', L.getDoc().links.length === nLinks && L.linkById('P1').to === 'J1' &&
			!L.getDoc().nodes.some((n) => n.id === made.node.id));
	}

	console.log('\n--- 4. the offer is made by the node tool on a pipe, and No places the node alone ---');
	{
		const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
		ok('the click handler asks lpn_split_pipe_ask for add-junction, add-reservoir and add-tank',
			/mode === 'add-junction' \|\| mode === 'add-reservoir' \|\| mode === 'add-tank'\)\s*\? linkById\(exitLinkId\)/.test(src) &&
			src.indexOf('lpn_split_pipe_ask') > 0);
		ok('only pipes, only in Base', /breakLink\.type === 'pipe'/.test(src) && /inBaseScenario\(\) &&\s*\(mode === 'add-junction'/.test(src));
		const en = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
		ok('the question names the pipe', /lpn_split_pipe_ask'\]='Split pipe \{id\} at this node\?'/.test(en));
	}

	console.log('\n--- 5. a normal network is unchanged: Net1 ---');
	{
		const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
		L.applySaved(saved); L.buildDom();
		const out = {};
		for (const engine of ['native', 'epanet']) {
			L.settings().engine = engine;
			const r = await solved();
			out[engine] = r && { h: r.heads, q: r.flows };
			ok('Net1 solves on ' + engine, !!r && r.ok !== false);
		}
		ok('nothing is left out of Net1 and no note is shown', L.assembleModel().omitted.length === 0 && status().indexOf('Left out') < 0);
		const digest = require('crypto').createHash('sha1').update(JSON.stringify(out)).digest('hex');
		console.log('  Net1 result digest ' + digest);
		if (process.env.NET1_DIGEST) { ok('digest equals the one recorded before the change', digest === process.env.NET1_DIGEST, digest); }
	}

	console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
