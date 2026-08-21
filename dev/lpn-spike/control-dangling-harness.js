// A CONTROL NAMING AN ELEMENT THAT NO LONGER EXISTS MUST NOT REACH EPANET (ROADMAP Task 466).
//
//   node dev/lpn-spike/control-dangling-harness.js
//
// EPANET does not ignore a control on a link it has never heard of -- it REJECTS the input, so one
// dangling sentence takes the whole run down and the user sees a network that will not solve with
// nothing on screen naming the reason. The Libraries editor can no longer write that state (a
// sentence naming a missing id is kept as text with no condition, which lpnTimeModelBlock already
// drops), but a document saved before the element was deleted still carries one.
//
// So the guard lives beside the conditionless drop, in EngCalcs.lpnTimeModelBlock, and this harness
// checks BOTH halves of the coupling:
//
//   * a control whose element was deleted does not reach the model block, and the run survives;
//   * the same control forced back into the block DOES take the run down -- which is the assertion
//     that keeps the first one honest. Without it this harness would still pass if EPANET quietly
//     tolerated a dangling control, and the guard would be untested ceremony.
//
// Net3 is the network because its six controls cover both sides of the question: two name a link
// and a time, four name a link AND the tank node they watch.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, assembleModel: assembleModel,\n" +
	"\t\tapplyUnits: function (p) { applyUnitSelections(inpUnitSelections(p)); },\n" +
	"\t\ttimeBlock: function () { return EngCalcs.lpnTimeModelBlock(doc, toSI); },\n" +
	"\t\tsetDoc: function (d) { doc = d; },\n" +
	"\t\tgetDoc: function () { return doc; }\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-net.js'));
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail ? '   ' + detail : ''));
	if (!ok) { failures++; }
}

(async function () {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	setUnitSet('us');                 // the strip must show the file's units before the doc is built
	const parsed = EngCalcs.lpnInpParse(inp);
	L.applyUnits(parsed);
	const doc = L.docFromInp(parsed, 'Net3');
	L.setDoc(doc);

	const ids = (list) => list.map((c) => c.link + (c.condition.kind === 'node' ? '/' + c.condition.node : '')).join(' ');

	// ---- the network as it stands: every control is live and every control gets through ----
	const base = L.timeBlock().controls;
	check(base.length === 6, 'all six of Net3\'s controls reach the solver untouched', ids(base));
	check(base.filter((c) => c.link === '335').length === 2,
		'...including the two on pump 335, whose link and node both exist');

	// ---- the controlled LINK is deleted ----
	const pump = doc.links.filter((l) => l.id === '335');
	doc.links = doc.links.filter((l) => l.id !== '335');
	const noLink = L.timeBlock().controls;
	check(noLink.length === 4, 'a control on a deleted LINK is dropped, and only it', ids(noLink));
	check(noLink.every((c) => c.link !== '335'), '...leaving nothing that names 335');
	check(noLink.filter((c) => c.link === '330').length === 2,
		'...while the two on 330, which watch the same tank, survive');
	doc.links = doc.links.concat(pump);
	check(L.timeBlock().controls.length === 6, 'and putting the link back brings them back');

	// ---- the WATCHED NODE is deleted. The other side of the same failure: a level condition names
	// a node, and EPANET rejects an unknown node in a condition exactly as it rejects an unknown
	// link in the action.
	const tank = doc.nodes.filter((n) => n.id === '1');
	doc.nodes = doc.nodes.filter((n) => n.id !== '1');
	const noNode = L.timeBlock().controls;
	check(noNode.length === 2, 'a control watching a deleted NODE is dropped', ids(noNode));
	check(noNode.every((c) => c.condition.kind !== 'node'),
		'...leaving only the two AT TIME controls, which name no node');
	doc.nodes = doc.nodes.concat(tank);
	check(L.timeBlock().controls.length === 6, 'and putting the node back brings them back');

	// ---- the drop that was already there, unchanged ----
	doc.controls.push({ link: '', raw: 'LINK NOPE OPEN AT TIME 1', action: {}, condition: null, text: {} });
	check(L.timeBlock().controls.length === 6,
		'a sentence kept as text with no condition is still dropped, as before');
	doc.controls.pop();

	// ---- THE RUN. Both directions, because the guard is only worth anything if the thing it
	// guards against is real.
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	// The document is whole; what it carries is one extra sentence naming a link nobody drew --
	// the state a save from before the deletion comes back in.
	const dangling = {
		link: 'GONE', action: { status: 'open' },
		condition: { kind: 'time', seconds: 3600 }
	};
	doc.controls.push(dangling);
	const model = L.assembleModel();
	model.time = L.timeBlock();
	check(model.time.controls.length === 6, 'the model handed to EPANET carries Net3\'s six and not the seventh',
		String(model.time.controls.length));
	const good = await EngCalcs.lpnEpanetRun(model);
	check(good.ok, 'and the document holding a dangling control RUNS');
	if (!good.ok) { console.log(JSON.stringify(good.issues || good)); }

	// The same run with the dangling sentence forced back into the block. This must FAIL, or the
	// guard above is protecting against nothing and this harness proves nothing.
	let ran = false, why = '';
	try {
		const bad = await EngCalcs.lpnEpanetRun(Object.assign({}, model, {
			time: Object.assign({}, model.time, { controls: model.time.controls.concat([dangling]) })
		}));
		ran = !!(bad && bad.ok);
		why = ran ? '' : JSON.stringify((bad && bad.issues) || bad);
	} catch (e) { why = String(e && e.message || e); }
	check(!ran, 'while the SAME run with the dangling control put back is rejected by EPANET',
		ran ? 'it ran -- EPANET tolerated it, so the guard is untested' : why);

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
