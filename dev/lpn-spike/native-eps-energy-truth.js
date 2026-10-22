// EPANET 2.3.5's OWN ENERGY RESULT FOR A MODEL, read from the vendored engine (Task 733, slice 6).
//
// Used by native-eps-energy-harness.js and native-eps-examples-harness.js as the truth the built-in
// loop's pump energy is held to. It is not the page's energy figure (js/lpn-epanet.js adds up EN_ENERGY
// samples): the engine solves the model's .inp and saves it, and the energy block of its binary output
// file (output.c saveenergy(): per pump usage %, efficiency %, kWh per m3, average kW, peak kW and cost
// per day, then the demand charge) is read back. That block is single precision. The report text
// carries the same numbers to two decimals and `energyFromReport` reads them, so a caller can hold the
// binary reader to the report.
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
let MODULE = null, WS = null;
async function engine(EngCalcs) {
	if (MODULE) { return; }
	MODULE = await EngCalcs.lpnEpanetLoad(MODULE_URL);
	WS = new MODULE.Workspace();
	await WS.loadModule();
}
// output.c savenetdata() then saveenergy(): the byte offset of the energy block, from the prolog's counts.
function energyFromBinary(bytes) {
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const nNodes = dv.getInt32(8, true), nTanks = dv.getInt32(12, true), nLinks = dv.getInt32(16, true), nPumps = dv.getInt32(20, true);
	let off = 15 * 4 + 3 * 80 + 2 * 260 + 2 * 32;
	off += nNodes * 32 + nLinks * 32 + 3 * nLinks * 4 + nTanks * 4 + nTanks * 4 + nNodes * 4 + 2 * nLinks * 4;
	const linkIds = [];
	let idOff = 15 * 4 + 3 * 80 + 2 * 260 + 2 * 32 + nNodes * 32;
	for (let i = 0; i < nLinks; i++) {
		let s = '';
		for (let j = 0; j < 32; j++) { const c = bytes[idOff + i * 32 + j]; if (!c) { break; } s += String.fromCharCode(c); }
		linkIds.push(s);
	}
	const pumps = [];
	for (let i = 0; i < nPumps; i++) {
		const idx = dv.getInt32(off, true);
		const f = (k) => dv.getFloat32(off + 4 + 4 * k, true);
		pumps.push({ id: linkIds[idx - 1], usage: f(0) / 100, avgEfficiency: f(1) / 100, kwhPerM3: f(2), avgKw: f(3), peakKw: f(4), costPerDay: f(5) });
		off += 28;
	}
	return { pumps, demandCharge: dv.getFloat32(off, true) };
}
// EPANET's report text, for the one case that checks the reader against what the report prints.
function energyFromReport(txt) {
	const i = txt.indexOf('Energy Usage'), rows = [];
	if (i < 0) { return null; }
	txt.slice(i).split(/\r?\n/).slice(5).some((ln) => {
		const m = /^\s*(\S+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$/.exec(ln);
		if (!m) { return rows.length > 0; }
		rows.push({ id: m[1], usage: +m[2] / 100, avgEfficiency: +m[3] / 100, kwhPerM3: +m[4], avgKw: +m[5], peakKw: +m[6], costPerDay: +m[7] });
		return false;
	});
	const d = /Demand Charge:\s+([\d.]+)/.exec(txt), t = /Total Cost:\s+([\d.]+)/.exec(txt);
	return { pumps: rows, demandCharge: d ? +d[1] : null, totalCost: t ? +t[1] : null };
}
async function truth(EngCalcs, model, wantReport) {
	await engine(EngCalcs);
	const built = EngCalcs.lpnToInp(JSON.parse(JSON.stringify(model)), { eps: true });
	const p = new MODULE.Project(WS);
	WS.writeFile('e.inp', built.inp);
	p.open('e.inp', 'e.rpt', 'e.out');
	if (wantReport) { p.setReport('ENERGY YES'); p.setReport('SUMMARY NO'); }
	p.solveH();
	p.saveH();
	if (wantReport) { p.report(); }
	p.close();
	const out = { bin: energyFromBinary(WS.readFile('e.out', 'binary')) };
	if (wantReport) { out.report = energyFromReport(WS.readFile('e.rpt')); }
	return out;
}


// TOLERANCES (measured worst across the harnesses: usage 1.2e-5, efficiency 3e-7, every other column 7e-5, on
// Net3 with a price pattern). Energy numbers are integrals over the run of a power that depends on the head
// across the pump and the flow through it, so the two engines' solve difference (0.8 mm of head, 1e-5 of flow)
// arrives as a relative difference of about 3e-5 at a 30 to 60 m pump head, and an integral is no worse than
// its worst instant.
//   * USAGE FACTOR, 1e-4 as a fraction (0.01 percentage point): a ratio of times, each a whole second. A step
//     the two engines cut one second apart (the rounding of a time to a tank level, native-eps-plan.md slice
//     5) moves it by 1/86400 = 1.2e-5.
//   * EVERYTHING ELSE, 1e-4 relative, with an absolute floor of 1e-4 of the column's largest value (a pump that
//     ran a minute has no relative digits to speak of). EPANET's report prints two decimals; 1e-4 of 62 kW is
//     0.006 kW, inside the report's own rounding, so a match here is a match to the report's digits or better.
//   * AVERAGE EFFICIENCY, 5e-4 relative: on a curve it follows the flow through a slope that can be steep.
const USAGE_TOL = 1e-4, REL_TOL = 1e-4, EFF_REL = 5e-4;
const COLS = { usage: USAGE_TOL, avgEfficiency: EFF_REL, kwhPerM3: REL_TOL, avgKw: REL_TOL, peakKw: REL_TOL, costPerDay: REL_TOL };
const maxOf = (rows, k) => rows.reduce((a, r) => Math.max(a, Math.abs(r[k])), 0);
function close(a, b, rel, floor) { return Math.abs(a - b) <= Math.max(rel * Math.abs(b), floor); }
// The native loop's energy summary against EPANET's block: { good, worst:{column: relative gap}, detail }.
function diff(n, t) {
	const worst = { usage: 0, avgEfficiency: 0, kwhPerM3: 0, avgKw: 0, peakKw: 0, costPerDay: 0 };
	let good = true, detail = '';
	if (!n || !t) { return { good: false, worst, detail: 'no energy block' }; }
	if (n.pumps.length !== t.pumps.length || n.pumps.some((r, i) => r.id !== t.pumps[i].id)) {
		return { good: false, worst, detail: 'pumps listed: native ' + n.pumps.map((r) => r.id) + ' / EPANET ' + t.pumps.map((r) => r.id) };
	}
	n.pumps.forEach((r, i) => {
		const w = t.pumps[i];
		Object.keys(worst).forEach((k) => {
			const tol = COLS[k], floor = k === 'usage' ? USAGE_TOL : tol * Math.max(maxOf(t.pumps, k), 1e-12);
			const d = Math.abs(r[k] - w[k]);
			worst[k] = Math.max(worst[k], k === 'usage' ? d : d / Math.max(Math.abs(w[k]), floor / tol));
			if (!close(r[k], w[k], tol, floor)) { good = false; detail += ` ${r.id}.${k} ${r[k]} vs ${w[k]};`; }
		});
	});
	// the demand charge and the totals line (EPANET: cost per day plus the demand charge)
	if (!close(n.demandCharge, t.demandCharge, REL_TOL, REL_TOL * Math.max(Math.abs(t.demandCharge), 1e-12))) { good = false; detail += ` demand charge ${n.demandCharge} vs ${t.demandCharge};`; }
	const totT = t.pumps.reduce((a, r) => a + r.costPerDay, 0) + t.demandCharge;
	if (!close(n.totalCostPerDay, totT, REL_TOL, REL_TOL * Math.max(totT, 1e-12))) { good = false; detail += ` total ${n.totalCostPerDay} vs ${totT};`; }
	return { good, worst, detail };
}
module.exports = { truth, engine, energyFromBinary, energyFromReport, diff, USAGE_TOL, REL_TOL, EFF_REL };
