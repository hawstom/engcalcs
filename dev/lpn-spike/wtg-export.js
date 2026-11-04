// EPANET network -> WaterGEMS project (.wtg + .wtg.sqlite): the SPIKE, ROADMAP-free, feasibility only.
//
//   node dev/lpn-spike/wtg-export.js --template <x.wtg.sqlite> [--wtg <x.wtg>] [--inp <Net3.inp>]
//                                    [--out <dir>] [--name Net3]
//
// WHAT IT DOES. Takes a WaterGEMS project that somebody SAVED AS AN ORDINARY USER (Tom's own
// fixtures/wtg-tgh-1, schema 1.0.54, WaterGEMS 26.0.0.532), keeps the schema and every default row,
// removes the model's elements, and writes the EPANET network's elements into it. Nothing here
// was learned by looking inside Bentley software: every table, column and code used is one seen in
// the openly licensed samples (dev/agents/market-researcher/wtg-samples.md) or in that saved file.
// The record, the mapping and the open questions are in dev/wtg-export.md.
//
// HOW AN ELEMENT IS WRITTEN. By CLONING a prototype: the template holds one live element of every
// kind (junction, reservoir, tank, pipe, pump, pump definition, pattern). Its rows, in every table
// that keys on DomainElementID / SupportElementID and in the Base alternatives, are copied under the
// new ID and the fields the EPANET network states are overwritten by column NAME. A column this
// program does not know keeps the template's default, which is the default WaterGEMS itself wrote.
//
// WHAT THE SPIKE REFUSES. Anything but a US customary, GPM file (the storage units below are
// measured for that case only), and a template with no prototype of a kind it needs.
//
// DOM-free: the library takes an initialised sql.js, so the page could call it later.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

// THE WRITER NOW LIVES IN js/lpn-wtg-export.js (Task 749), which the page calls; this file keeps
// the command line and the reference run that returns EPANET's results for a comparison.
if (!(global.EngCalcs && global.EngCalcs.lpnWtgExportInternals)) {
	// Standing alone (the command line, wtg-export-harness.js). A harness that has already set up its
	// own EngCalcs and loaded the module (wtg-page-export-harness.js) is used as it is.
	require('./bootstrap.js');
	global.EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
	require(path.join(ROOT, 'js', 'lpn-patterns.js')); require(path.join(ROOT, 'js', 'lpn-inp.js'));
	require(path.join(ROOT, 'js', 'lpn-wtg-export.js'));
}
const EngCalcsLib = global.EngCalcs;
const { writeWtg, patchWtgXml, symbolMultiplier, smartLabel, GPM_TO_CFS } = EngCalcsLib.lpnWtgExportInternals;

// ---------------------------------------------------------------------------------------------
// The reference run: EPANET (epanet-js, the engine this suite ships) on the original .inp.
// It gives (1) the schedule the level controls followed and (2) numbers to compare with in WaterGEMS.
// ---------------------------------------------------------------------------------------------
async function epanetReference(inpText, watchLinks, snapshotNodes, snapshotLinks) {
	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('r.inp', inpText);
	p.open('r.inp', 'r.rpt', 'r.out');
	const EN_HEAD = 10, EN_PRESSURE = 11, EN_DEMAND = 9, EN_FLOW = 8, EN_STATUS = 11;
	const idx = {}; watchLinks.forEach((id) => { idx[id] = p.getLinkIndex(id); });
	const nIdx = {}; snapshotNodes.forEach((id) => { nIdx[id] = p.getNodeIndex(id); });
	const lIdx = {}; snapshotLinks.forEach((id) => { lIdx[id] = p.getLinkIndex(id); });
	const initial = {}, changes = [], last = {}, snaps = {}, steps = [];
	p.openH(); p.initH(0);
	let t = 0, guard = 0;
	for (;;) {
		t = p.runH();
		steps.push(t);
		watchLinks.forEach((id) => {
			const s = p.getLinkValue(idx[id], EN_STATUS) > 0 ? 'open' : 'closed';
			if (last[id] === undefined) { initial[id] = s; } else if (last[id] !== s) { changes.push({ t: t, link: id, status: s }); }
			last[id] = s;
		});
		if (t % 3600 === 0) {
			const s = { heads: {}, pressures: {}, demands: {}, flows: {} };
			snapshotNodes.forEach((id) => { s.heads[id] = p.getNodeValue(nIdx[id], EN_HEAD); s.pressures[id] = p.getNodeValue(nIdx[id], EN_PRESSURE); s.demands[id] = p.getNodeValue(nIdx[id], EN_DEMAND); });
			snapshotLinks.forEach((id) => { s.flows[id] = p.getLinkValue(lIdx[id], EN_FLOW); });
			snaps[t] = s;
		}
		const ts = p.nextH();
		if (!(ts > 0) || ++guard > 100000) { break; }
	}
	p.closeH(); p.close();
	return { initial: initial, changes: changes, snapshots: snaps, steps: steps };
}

module.exports = { writeWtg, patchWtgXml, symbolMultiplier, epanetReference, smartLabel, GPM_TO_CFS };

// ---------------------------------------------------------------------------------------------
// Command line: three files of rising difficulty, so a failure in WaterGEMS says where it began.
//   1-tiny              reservoir, pump, junction on a pattern, tank (the pump node is the risk)
//   2-net3-hour-zero    Net3 with its starting statuses and NO controls (every control is the risk)
//   3-net3              Net3 with the six clock-time controls
// ---------------------------------------------------------------------------------------------
if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		if (!args.template) { console.error('usage: node dev/lpn-spike/wtg-export.js --template <x.wtg.sqlite> [--wtg <x.wtg>] [--out dir]'); process.exit(2); }
		require('./bootstrap.js');
		const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js')); global.EngCalcs = EngCalcs;
		require(path.join(ROOT, 'js', 'lpn-patterns.js')); require(path.join(ROOT, 'js', 'lpn-inp.js'));
		const initSqlJs = require(require('./wtg-sqljs.js').sqlJsPath());
		const SQL = await initSqlJs({ wasmBinary: fs.readFileSync(require('./wtg-sqljs.js').wasmPath()) });
		const outRoot = args.out || path.join(ROOT, 'dev', 'wtg-export-out');
		const tplBytes = fs.readFileSync(args.template);
		const ref = path.join(ROOT, 'dev', 'lpn-spike', 'reference');
		const variants = [
			{ dir: '1-tiny', name: 'Tiny', inp: path.join(ref, 'wtg-export-tiny.inp'), controls: true },
			{ dir: '2-net3-hour-zero', name: 'Net3', inp: path.join(ref, 'Net3.inp'), controls: false },
			{ dir: '3-net3', name: 'Net3', inp: path.join(ref, 'Net3.inp'), controls: true },
			{ dir: '4-valves-and-more', name: 'Parts', inp: path.join(ref, 'wtg-export-parts.inp'), controls: false }
		].filter((v) => !args.only || args.only.split(',').indexOf(v.dir) >= 0);
		for (const v of variants) {
			const inpText = fs.readFileSync(v.inp, 'utf8');
			const parsed = EngCalcs.lpnInpParse(inpText);
			const watch = Array.from(new Set(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat(parsed.controls.map((c) => c.link))));
			const r = await epanetReference(inpText, watch, parsed.nodes.map((n) => n.id), parsed.links.map((l) => l.id));
			const out = writeWtg(SQL, tplBytes, parsed, { initial: r.initial, changes: v.controls ? r.changes : [] },
				{ name: v.name, efficiency: Number((/Global Efficiency\s+([\d.]+)/i.exec(inpText) || [])[1]) || 75 });
			const dir = path.join(outRoot, v.dir);
			fs.mkdirSync(dir, { recursive: true });
			fs.writeFileSync(path.join(dir, v.name + '.wtg.sqlite'), out.bytes);
			if (args.wtg) {
				fs.writeFileSync(path.join(dir, v.name + '.wtg'), patchWtgXml(fs.readFileSync(args.wtg, 'utf8'), out.report.removedChildScenarios, 1, out.report.removedChildAlternatives, out.report.extentFt));
			}
			const rows = ['kind,id,hour,head_ft,pressure_psi,demand_gpm,flow_gpm'];
			Object.keys(r.snapshots).map(Number).sort((a, b) => a - b).forEach((t) => {
				const sn = r.snapshots[t];
				parsed.nodes.forEach((n) => { rows.push(['node', n.id, t / 3600, sn.heads[n.id].toFixed(3), sn.pressures[n.id].toFixed(3), sn.demands[n.id].toFixed(3), ''].join(',')); });
				parsed.links.forEach((l) => { rows.push(['link', l.id, t / 3600, '', '', '', sn.flows[l.id].toFixed(3)].join(',')); });
			});
			fs.writeFileSync(path.join(dir, v.name + '-EPANET-results.csv'), rows.join('\n') + '\n');
			console.log(v.dir, JSON.stringify(out.report.counts), 'integrity', out.report.integrity, 'fk', out.report.foreignKeyViolations);
		}
		console.log('written under', outRoot);
	}()).catch((e) => { console.error(e); process.exit(1); });
}
