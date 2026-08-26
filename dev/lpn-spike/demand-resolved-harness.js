// Base demand and Demand are two quantities, and the page shows both -- Tom, 2026-08-25.
//
//   node dev/lpn-spike/demand-resolved-harness.js
//
// **THE BUG REPORT IS THE FIRST ASSERTION IN SECTION 2 AND EVERYTHING ELSE EXISTS TO EXPLAIN IT.**
// Net3 is EPA's own example and one of the shipped ones. Add up the pipe flows into junction 101 and
// you get 254.53 gpm; the map, the Tables pane and the property popup all said 189.95, because
// 189.95 is the BASE demand and Net3's [OPTIONS] Pattern multiplies every blank-column junction by
// 1.34 at t = 0. Nothing was wrong with the solve. The label was wrong, and a reader who checks
// continuity by hand -- which is exactly what a reviewer does -- finds a 34% error and blames the
// engine.
//
// The measured ratio for every patterned junction in Net3 was 1.3400 exactly, so this file asserts
// the reconciliation itself rather than that one number: the resolved demand at a junction equals
// the net inflow of its pipes, to a part in 1e-6 of the flow.
//
// **AND THE OTHER HALF IS THAT NOTHING GOT WRITTEN DOWN.** The resolved demand is ours; the base is
// the user's. Section 4 moves the clock and switches scenario and requires the serialized document
// to come back byte-identical, which is the structural version of that rule (CLAUDE.md, "ONLY THE
// USER TOUCHES A FILE'S NUMBERS").

const { ROOT, byId, setUnitSet, loadLoopedNetwork, GPM } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');

// The page's own load order. lpn-time.js must be here: without it modelTimeSeconds() has no clock
// and every multiplier would be read at t = 0 whatever the transport says -- the stub-holds-the-
// coupling-constant failure dev/testing-notes.md warns about, wearing a passing harness.
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject, assembleModel: assembleModel,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tgetScenarios: function () { return scenarios; }, setProp: setProp,\n" +
	"\t\teffective: effective,\n" +
	"\t\tcolorNodeValue: colorNodeValue, resolvedDemand: resolvedDemand,\n" +
	"\t\tdemandPatternActs: demandPatternActs,\n" +
	"\t\tnodeFieldDefs: function () { return nodeFieldDefs(EngCalcs.pageConfig || {}); },\n" +
	"\t\tcolorFieldOptions: colorFieldOptions, paneTables: paneTables,\n" +
	"\t\tdefaultLabelSettings: defaultLabelSettings,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// RELATIVE. A demand crosses into the model in m3/s and is compared against flows that came back
// out of it, and (x*f)/f is not an identity in doubles -- the same fact CLAUDE.md's unit rule is
// built on. An absolute bound here would be a claim about float arithmetic instead of about the
// network.
function near(a, b, rel) { return Math.abs(a - b) <= (rel || 1e-9) * Math.max(1, Math.abs(b)); }

console.log('=== Base demand and Demand, against Net3 ===');

setUnitSet('us');   // Net3 is a gpm file; the file's own units must win
byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'Net3.inp', _text: fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8') });
const doc = L.getDoc();

// ---------------------------------------------------------------------------
// 1. The importer is NOT the cause, and that had to be established first.
// ---------------------------------------------------------------------------
// js/lpn-inp.js flattens demand CATEGORIES: [DEMANDS] rows REPLACE the [JUNCTIONS] number and are
// then summed into this page's single demand. If that flattening were wrong it would produce
// exactly the same symptom -- demands that do not add up to the pipe flows -- and would be the
// bigger finding. **Net3 has an EMPTY [DEMANDS] section**, so no junction in it has more than one
// category and the flattening never runs. The mismatch is entirely about patterns.
console.log('\n--- the importer read the file straight ---');
{
	const text = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const demandsBody = (text.split(/^\[DEMANDS\]/m)[1] || '').split(/^\[/m)[0];
	const rows = demandsBody.split(/\r?\n/).filter(l => l.trim() && !/^\s*;/.test(l));
	ok('Net3 states no demand categories at all -- flattening is not in play',
		rows.length === 0, rows.length + ' rows in [DEMANDS]');
	ok('every junction carries the file\'s own base demand',
		near(doc.nodes.find(n => n.id === '101')._demand, 189.95),
		'101 = ' + doc.nodes.find(n => n.id === '101')._demand + ' gpm');
	ok('[OPTIONS] Pattern came in as the project default', doc.defaultPattern === '1',
		JSON.stringify(doc.defaultPattern));
}

// ---------------------------------------------------------------------------
// 2. THE BUG REPORT: the resolved demands reconcile with the pipe flows.
// ---------------------------------------------------------------------------
console.log('\n--- the resolved demands add up to the pipe flows ---');
const model = L.assembleModel();
const res = require(ROOT + 'js/lpn-solver.js').lpnSolve(model);
ok('Net3 converges', res.ok && res.converged, res.iterations + ' iterations');

// Net inflow at every node, in gpm: what the pipes deliver there. A junction in balance draws
// exactly this.
const netInflow = {};
doc.nodes.forEach(n => { netInflow[n.id] = 0; });
model.links.forEach(l => {
	const q = res.flows[l.id];
	if (q === undefined) { return; }
	netInflow[l.from] -= q; netInflow[l.to] += q;
});

const junctions = doc.nodes.filter(n => n.type === 'junction');
let worstResolved = 0, worstResolvedId = null, worstBase = 0, worstBaseId = null,
	drawing = 0, patterned = 0;
junctions.forEach(n => {
	// An emitter draws more than its demand and the solvers do not report that extra flow back, so
	// such a junction cannot reconcile and is not asked to. Net3 has none; the filter is here so
	// that stays a fact about the file rather than an assumption about every file.
	if (n.emitter) { return; }
	const inflow = netInflow[n.id] / GPM;
	const resolved = L.colorNodeValue(n, 'demandActual');
	const base = L.colorNodeValue(n, 'demand');
	if (!isFinite(inflow) || !isFinite(resolved)) { return; }
	const dR = Math.abs(resolved - inflow), dB = Math.abs(base - inflow);
	if (dR > worstResolved) { worstResolved = dR; worstResolvedId = n.id; }
	if (dB > worstBase) { worstBase = dB; worstBaseId = n.id; }
	// A junction drawing nothing resolves to nothing whatever its pattern says, so it can never
	// show the difference and is not counted as evidence either way.
	if (base) { drawing++; if (Math.abs(resolved - base) > 1e-9) { patterned++; } }
});
ok('EVERY junction\'s Demand equals the net inflow of its pipes',
	worstResolved < 1e-6 * 2000,
	'worst ' + worstResolved.toExponential(3) + ' gpm at ' + worstResolvedId);
// The other half of the same measurement, and the reason this task was urgent: the number the page
// USED to print is out by a third at the same junctions.
ok('...and the Base demand is NOT that number -- this is the defect being fixed',
	worstBase > 100, 'worst ' + worstBase.toFixed(2) + ' gpm at ' + worstBaseId);
ok('...on EVERY junction that draws anything, not a corner case',
	drawing > 50 && patterned === drawing,
	patterned + ' of ' + drawing + ' drawing junctions resolve to something other than their base');

{
	// The worked example, printed, because a ratio is easier to check by hand than a residual.
	const n101 = doc.nodes.find(x => x.id === '101');
	const base = L.colorNodeValue(n101, 'demand'), resolved = L.colorNodeValue(n101, 'demandActual');
	console.log('       junction 101: base ' + base.toFixed(2) + ' gpm, demand ' + resolved.toFixed(2) +
		' gpm, pipes deliver ' + (netInflow['101'] / GPM).toFixed(2) + ' gpm');
	ok('junction 101 resolves through Pattern 1\'s 1.34 at t = 0', near(resolved / base, 1.34, 1e-9),
		'ratio ' + (resolved / base).toFixed(6));
}

// ---------------------------------------------------------------------------
// 3. It is the same product the solver was handed. One expression, not two.
// ---------------------------------------------------------------------------
// The reconciliation above could be made to pass by a second, parallel derivation that happened to
// agree today. This is what stops that: the number on the label IS the number in the equations.
console.log('\n--- the label and the equations read one expression ---');
{
	const modelNode = {};
	model.nodes.forEach(n => { modelNode[n.id] = n; });
	let worst = 0, worstId = null;
	junctions.forEach(n => {
		const shown = L.colorNodeValue(n, 'demandActual');
		const solved = modelNode[n.id].demand / GPM;
		const d = Math.abs(shown - solved);
		if (d > worst) { worst = d; worstId = n.id; }
	});
	ok('the displayed Demand is the demand assembleModel() handed the solver',
		worst < 1e-9 * 2000, 'worst ' + worst.toExponential(3) + ' gpm at ' + worstId);
}

// ---------------------------------------------------------------------------
// 4. THE RESOLVED DEMAND IS OURS AND NEVER REACHES THE DOCUMENT.
// ---------------------------------------------------------------------------
console.log('\n--- the base is the user\'s number and stays untouched ---');
{
	const before = JSON.stringify(L.serialize());

	// **THE CLOCK IS MOVED AT ITS OWN SEAM**, EngCalcs.lpnTimeNow -- the single function
	// modelTimeSeconds() asks what moment the page is showing. js/lpn-time.js keeps the real one
	// private behind its transport (setTime() is internal and the slider is the only caller), and
	// what is under test here is how js/looped-network.js reacts to the clock, not the transport.
	// Asserted to be the real thing before it is replaced, so a version of lpn-time.js that stopped
	// providing it would fail here rather than quietly leave this section testing a stub of itself.
	ok('js/lpn-time.js provides the clock this page reads',
		typeof EngCalcs.lpnTimeNow === 'function');
	const realNow = EngCalcs.lpnTimeNow;
	const n101c = doc.nodes.find(n => n.id === '101');
	const base101 = L.colorNodeValue(n101c, 'demand');
	EngCalcs.lpnTimeNow = function () { return 12 * 3600; };
	const at12 = L.colorNodeValue(n101c, 'demandActual');
	ok('the Demand followed the clock', Math.abs(at12 / base101 - 1.34) > 1e-6,
		'101 at 12:00 is ' + at12.toFixed(2) + ' gpm (x' + (at12 / base101).toFixed(4) + ')');
	ok('...and the Base demand did not', near(base101, 189.95), base101 + ' gpm');
	ok('...and the document is byte-identical across the clock change',
		JSON.stringify(L.serialize()) === before);
	EngCalcs.lpnTimeNow = realNow;
	ok('the document is byte-identical again on the way back',
		JSON.stringify(L.serialize()) === before);

	// **AND A SCENARIO IS THE OTHER THING THE RESOLVED NUMBER FOLLOWS.** effective() finds the
	// override, so the base a scenario states is the base this resolves from -- and Base's own
	// number is untouched by any of it.
	L.createScenario('Peak hour');
	const scn = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(scn.id);
	L.setProp(n101c, 'demand', 300);
	const inScn = L.colorNodeValue(n101c, 'demandActual');
	ok('inside a scenario the Demand resolves from the OVERRIDDEN base',
		near(inScn, 300 * 1.34), inScn.toFixed(4) + ' gpm');
	L.switchScenario('base');
	ok('...and back in Base it resolves from Base\'s own base again',
		near(L.colorNodeValue(n101c, 'demandActual'), 189.95 * 1.34),
		L.colorNodeValue(n101c, 'demandActual').toFixed(4) + ' gpm');
	ok('...with Base\'s stored base demand untouched throughout',
		near(L.effective(n101c, 'demand'), 189.95));

	// There is no setter. Grepped rather than asserted through the interface, because the claim is
	// about what does not exist: a resolved demand with a write path would be a number of ours in a
	// field of the user's, which is the whole failure mode this suite is organised against.
	const src = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('nothing anywhere assigns a resolved demand',
		!/(^|[^a-zA-Z_$])(demandActual|resolvedDemand)\s*=[^=]/.test(src));
	ok('the resolved field has no `set` and no `prop` in the Tables pane',
		!/paneColNodeResult\('demandActual'[^)]*\bset\b/.test(src));
}

// ---------------------------------------------------------------------------
// 5. Both quantities are offered in all three places Tom named.
// ---------------------------------------------------------------------------
// A second demand field that joined only the renderer would be invisible to half the page -- the
// colour ramp, the Labels popover and the legend all read their own field lists.
console.log('\n--- label display, Tables pane, Properties editor ---');
{
	const defs = L.nodeFieldDefs().map(f => f[0]);
	ok('the Labels popover offers both', defs.indexOf('demand') >= 0 && defs.indexOf('demandActual') >= 0,
		defs.join(', '));
	ok('...with Demand above Base demand', defs.indexOf('demandActual') < defs.indexOf('demand'));

	const colour = L.colorFieldOptions('node').map(o => o[0]);
	ok('colour-by-value offers both', colour.indexOf('demand') >= 0 && colour.indexOf('demandActual') >= 0,
		colour.join(', '));

	const ls = L.defaultLabelSettings();
	// **BASE DEMAND IS THE DEFAULT, AND THAT IS TOM'S REVERSAL OF THIS FILE'S FIRST ANSWER**
	// (2026-08-26): *"no options, no demand: true. It's just showing Base Demand as user requested
	// (without sufficient advice) in Settings."* The bug he reported was never the CHOICE of number,
	// it was the LABEL — a base demand printed under the word "Demand". Relabelled, the old default
	// is honest, and no existing project's map changes under its owner for a reason they did not ask
	// for. Demand remains one tick away in the same popover, which is what the two checks above
	// prove.
	ok('a new map labels Base demand, and Demand is one tick away',
		ls.node.demand === true && ls.node.demandActual === false,
		'demand=' + ls.node.demand + ' demandActual=' + ls.node.demandActual);
	ok('the new field is numeric, so it gets a decimals and a priority spinner',
		typeof ls.decimals.node.demandActual === 'number' &&
		typeof ls.priority.node.demandActual === 'number');

	const junc = L.paneTables().filter(t => t.id === 'junctions')[0];
	const keys = junc.cols.map(c => c.key);
	ok('the junctions table has both columns', keys.indexOf('demand') >= 0 && keys.indexOf('demandActual') >= 0,
		keys.join(', '));
	const baseCol = junc.cols.filter(c => c.key === 'demand')[0];
	const resCol = junc.cols.filter(c => c.key === 'demandActual')[0];
	ok('...the Base demand column is editable', typeof baseCol.set === 'function');
	ok('...and the Demand column is a result with no setter',
		resCol.result === true && !resCol.set);

	// The property popup. Net3's junctions all resolve through the project default, so every one of
	// them shows the read-only row.
	byId.lpn_popup_fields.children.length = 0;
	L.renderNodeFields('101');
	const labels = byId.lpn_popup_fields.children
		.filter(c => c.tagName === 'LABEL')
		.map(c => c.textContent);
	ok('the Properties editor offers the typed number as Base demand',
		labels.some(t => /Base demand/.test(t)), labels.filter(t => /emand/i.test(t)).join(' | '));
	ok('...and the resolved one as Demand, where a pattern acts',
		labels.some(t => /^Demand \(/.test(t)) &&
		L.demandPatternActs(doc.nodes.find(n => n.id === '101')) === true);
	// The read-only row carries no control, so there is no way to type into it.
	const demandRow = byId.lpn_popup_fields.children
		.filter(c => c.tagName === 'LABEL' && /^Demand \(/.test(c.textContent))[0];
	ok('...as a plain value with no input in it',
		!!demandRow && !demandRow.children.some(c => c.tagName === 'INPUT'));
}

// ---------------------------------------------------------------------------
// 6. WITH NO PATTERNS THE TWO ARE EQUAL, AND THE PAGE DOES NOT SAY IT TWICE.
// ---------------------------------------------------------------------------
// The common case: a network drawn by hand, one instant, no clock. It must not look broken and it
// must not look noisy.
console.log('\n--- a network with no patterns ---');
{
	doc.patterns.length = 0;
	doc.defaultPattern = null;
	doc.nodes.forEach(n => { n.demandPattern = null; });
	const n101 = doc.nodes.find(n => n.id === '101');
	ok('Demand and Base demand are the same number',
		L.colorNodeValue(n101, 'demandActual') === L.colorNodeValue(n101, 'demand'),
		L.colorNodeValue(n101, 'demandActual') + ' gpm');
	ok('no pattern acts, so the popup drops the read-only row',
		L.demandPatternActs(n101) === false);
	// The list-level controls stay put: a checkbox and a column that appeared and vanished under
	// the reader would be worse than a column that agrees with its neighbour.
	ok('the Labels popover still offers both',
		L.nodeFieldDefs().map(f => f[0]).indexOf('demandActual') >= 0);
	ok('the Tables pane still shows both columns',
		L.paneTables().filter(t => t.id === 'junctions')[0].cols.map(c => c.key).indexOf('demandActual') >= 0);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
