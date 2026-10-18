// A PBV'S SETTING IS A PRESSURE, IN THE PAGE'S PRESSURE UNIT. Run with:
//   node dev/lpn-spike/pbv-setting-unit-harness.js
//
// assembleModel() converted a PRV's and PSV's setting from lpn_u_pressure but passed a PBV's
// through, so under the US preset a 10 psi PBV reached the EPANET engine as 10 m of head
// (14.2 psi). A PBV removes exactly its setting whatever the flow, so the head drop across it
// is the observable. Goes through assembleModel and the real engine, not the writer alone.

const { setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\trunSolve: runSolve, assembleModel: assembleModel, buildDom: buildDom,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
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
const M_PER_PSI = 0.70307;   // metres of water per psi

function network(diamTyped, settingTyped) {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 0 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 0 });
	doc.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 0 });
	doc.nodes.push({ id: 'J3', type: 'junction', x: 1300, y: 0, elev: 0, _demand: 1 });
	doc.nodes[0].elev = 300;
	const pipe = function (id, a, b) {
		return { id: id, type: 'pipe', from: a, to: b, verts: [], _diameter: diamTyped,
			_roughness: 130, _length: 100, _k: 0, _status: 'open' };
	};
	doc.links.push(pipe('L1', 'R1', 'J1'));
	doc.links.push({ id: 'V1', type: 'valve', valveType: 'PBV', from: 'J1', to: 'J2', verts: [],
		_diameter: diamTyped, _setting: settingTyped, _k: 0, _status: 'open' });
	doc.links.push(pipe('L2', 'J2', 'J3'));
}

async function dropFor(preset, diam, setting) {
	setUnitSet(preset);
	L.buildLayers();
	L.seedDefaultInputs();
	L.settings().method = 'hw';
	L.settings().engine = 'epanet';
	network(diam, setting);
	L.runSolve();
	await settleEpanet();
	const r = L.lastResult();
	return r && r.converged ? r.heads.J1 - r.heads.J2 : NaN;
}

async function main() {
	await warmEpanet();
	console.log('--- US preset: 10 psi ---');
	// US pipe diameter is typed in inches.
	let d = await dropFor('us', 8, 10);
	ok('the drop across a 10 psi PBV is 10 psi', Math.abs(d / M_PER_PSI - 10) < 0.05,
		(d / M_PER_PSI).toFixed(3) + ' psi (' + d.toFixed(3) + ' m)');
	console.log('--- SI preset: 10 m ---');
	// SI pressure is metres of head (setting 10 = 10 m); diameter typed in mm.
	d = await dropFor('si', 200, 10);
	ok('the drop across a 10 m PBV is 10 m', Math.abs(d - 10) < 0.05, d.toFixed(3) + ' m');
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main();
