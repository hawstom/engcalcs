// EPANET 2.3.5's OWN SAVED HYDRAULICS FOR A MODEL, read from the vendored engine (Task 733, phase 4).
//
// Used by native-eps-quality-harness.js to hold the built-in loop's water-quality pass to EPANET
// APART FROM the two engines' hydraulic difference: the engine solves the model's .inp and writes
// its hydraulics file (output.c savehyd(): per solve the time, each node's demand and head, each
// link's flow, status and setting, all in EPANET's internal units and single precision, then the
// step to the next solve), and this reads it back as the records EngCalcs.lpnNativeQualityOver
// walks. The quality answer that comes out of that walk should be EPANET's own to the last few
// digits; a gap there is a transcription defect, not a hydraulic one.
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
const FT3 = 0.3048 * 0.3048 * 0.3048, EN_TANKVOLUME = 24, CLOSED = 2;
let MODULE = null, WS = null;
async function engine(EngCalcs) {
	if (MODULE) { return; }
	MODULE = await EngCalcs.lpnEpanetLoad(MODULE_URL);
	WS = new MODULE.Workspace();
	await WS.loadModule();
}
// project.c openhydfile(): magic, version, then Nnodes, Nlinks, Ntanks, Npumps, Nvalves, Dur (8 x INT4).
function recordsFromHyd(bytes, nodeIds, linkIds, model) {
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const N = dv.getInt32(8, true), L = dv.getInt32(12, true);
	const linkPos = {}, junction = {};
	model.links.forEach((l, k) => { linkPos[l.id] = k; });
	model.nodes.forEach((n) => { if (n.type === 'junction') { junction[n.id] = true; } });
	const recs = [];
	let off = 32;
	while (off + 4 <= bytes.length) {
		const t = dv.getInt32(off, true); off += 4;
		const f = (i) => dv.getFloat32(off + 4 * i, true);
		const r = { t, q: new Array(model.links.length).fill(0), closed: new Array(model.links.length).fill(false), d: {} };
		for (let i = 0; i < N; i++) { if (junction[nodeIds[i]]) { r.d[nodeIds[i]] = f(i); } }
		off += 8 * N;                                               // demands, heads
		for (let i = 0; i < L; i++) { r.q[linkPos[linkIds[i]]] = f(i); }
		off += 4 * L;
		for (let i = 0; i < L; i++) { r.closed[linkPos[linkIds[i]]] = f(i) <= CLOSED; }
		off += 8 * L;                                               // statuses, settings
		const step = dv.getInt32(off, true); off += 4;
		recs.push(r);
		if (step === 0) { break; }
	}
	return recs;
}
async function savedHydraulics(EngCalcs, model) {
	await engine(EngCalcs);
	const built = EngCalcs.lpnToInp(JSON.parse(JSON.stringify(model)), { eps: true });
	const p = new MODULE.Project(WS);
	WS.writeFile('q.inp', built.inp);
	p.open('q.inp', 'q.rpt', 'q.out');
	const nodeIds = [], linkIds = [];
	for (let i = 1; i <= p.getCount(0); i++) { nodeIds.push(p.getNodeId(i)); }
	for (let i = 1; i <= p.getCount(2); i++) { linkIds.push(p.getLinkId(i)); }
	p.solveH();
	const vEnd = {};
	model.nodes.forEach((n) => { if (n.type === 'tank') { vEnd[n.id] = p.getNodeValue(p.getNodeIndex(n.id), EN_TANKVOLUME) / FT3; } });
	p.saveHydFile('q.hyd');
	p.close();
	return { recs: recordsFromHyd(WS.readFile('q.hyd', 'binary'), nodeIds, linkIds, model), vEnd };
}
module.exports = { savedHydraulics, engine };
