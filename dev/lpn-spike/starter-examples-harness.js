// THE FOUR STARTER EXAMPLES OPEN ON A PASSING DESIGN (ROADMAP Task 823). Run with:
//   node dev/lpn-spike/starter-examples-harness.js
//
// Tom, 2026-10-23: *"What if we curate/create some of our examples better to be good simple starting
// points for new users?"* Two networks, each in US and SI units (examples/Fire-flow-extension*.lwn,
// examples/Community-well-tank*.lwn, built by dev/scripts/build_starter_examples.js). A starter that
// opens on a failing design teaches the wrong thing, so each shipped file is opened the way the
// gallery opens it and held to what an engineer would accept:
//
//   every file     projected CRS (never lat/lon), on the Earth where it says; one loop; the key
//                  elements carry a plain Description; the manifest and the English card text exist;
//                  both engines converge and agree; normal pressure is 40 to 80 psi; the fire hydrant
//                  junction passes its own required fire flow at 20 psi (14 m) residual with no design
//                  issue elsewhere; the .inp export reads back to the same network, the same solve.
//   the extension  the hydrant flow test is reproduced by the three flow-test scenarios at the
//                  pressure hydrant (62, 56 and 48 psi), which is what the pump curve was built from.
//   the well       the tank is the one tank connection; a 24-hour run through EPANET keeps the tank
//                  inside its levels, the pump switches on tank level, and every junction holds
//                  40 psi or more at every step.
//   each pair      the US and SI files behave alike (the SI file is a metric design: nominal pipe sizes).
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-fireflow.js');
require(ROOT + 'js/lpn-crs.js');
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(DEFS) });

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\trunSolve: runSolve, lastResult: function () { return lastSolveResult; }, assembleModel: assembleModel,\n" +
	"\t\tgetScenarios: function () { return scenarios; }, switchScenario: switchScenario, getProject: function () { return project; },\n" +
	"\t\twireFireFlowBox: wireFireFlowBox, runFireFlowSweep: runFireFlowSweep, run: function () { return fireFlowRun; },\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), inpExportOptions()); },\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");
const EC = global.EngCalcs;
const PC = EC.pageConfig;

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const PSI_PER_M = 0.4333 / 0.3048, GPM = 15850.32, FT = 0.3048;

const FILES = [
	{ file: 'Fire-flow-extension.lwn', si: false, kind: 'ext', crs: 'EPSG:2277', place: [30.28, -98.41], key: 'extension' },
	{ file: 'Fire-flow-extension-SI.lwn', si: true, kind: 'ext', crs: 'EPSG:32139', place: [30.28, -98.41], key: 'extension_si' },
	{ file: 'Community-well-tank.lwn', si: false, kind: 'well', crs: 'EPSG:2276', place: [33.05, -99.20], key: 'well' },
	{ file: 'Community-well-tank-SI.lwn', si: true, kind: 'well', crs: 'EPSG:32138', place: [33.05, -99.20], key: 'well_si' }
];
const DESCRIBED = {
	ext: ['SYS', 'HYD-P', 'HYD-F', 'FH-1', 'PMP-1', 'MAIN-1'],
	well: ['WELL-1', 'WH-1', 'FH-1', 'TANK-1', 'WP-1', 'CV-1', 'TL-1']
};
const FIRE = { ext: { id: 'FH-1', gpm: 1500, lps: 95 }, well: { id: 'FH-1', gpm: 500, lps: 32 } };

function open(f) {
	setUnitSet(f.si ? 'si' : 'us');
	L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + f.file, 'utf8'));
	if (!saved) { return null; }
	L.applySaved(saved); L.buildDom(); L.applyMethodUI();
	return saved;
}
const psi = (r, id) => r.pressures[id] * PSI_PER_M;
async function solve(engine) {
	L.settings().engine = engine;
	L.runSolve(); await settleEpanet();
	return L.lastResult();
}
function scenarioByName(prefix) { return L.getScenarios().filter((s) => s.name.indexOf(prefix) === 0)[0]; }
function loopCount(doc) { return doc.links.length - doc.nodes.length + 1; }   // one connected network

(async function main() {
	await warmEpanet();
	await new Promise((res) => EC.lpnCrsLoad(res));
	const manifest = JSON.parse(fs.readFileSync(ROOT + 'examples/manifest.json', 'utf8'));
	const solved = {};

	for (const f of FILES) {
		console.log('\n=== ' + f.file + ' ===');
		const raw = JSON.parse(fs.readFileSync(ROOT + 'examples/' + f.file, 'utf8'));
		const m = manifest.examples.find((e) => e.file === f.file);
		ok('the gallery lists it, tagged design, on an XY plane', !!m && m.work === 'design' && m.coords === 'xy', m && JSON.stringify([m.work, m.coords]));
		ok('its card has an English title and description, both without an em dash', !!m && !!PC['lpn_ex_' + f.key + '_title'] && !!PC['lpn_ex_' + f.key + '_desc'] &&
			!/—/.test(PC['lpn_ex_' + f.key + '_title'] + PC['lpn_ex_' + f.key + '_desc']));
		ok('the manifest repeats the English card text', !!m && m.title === PC['lpn_ex_' + f.key + '_title'] && m.description === PC['lpn_ex_' + f.key + '_desc']);
		ok('the SI file is in SI and the US file in US', !!m && m.system === (f.si ? 'si' : 'us'), m && m.system);

		console.log('--- the coordinate system is projected');
		ok('not a lat/lon project', raw.project.coords !== 'geo');
		ok('declares ' + f.crs, raw.project.crs === f.crs, raw.project.crs);
		ok('the page holds a definition for it', EC.lpnCrsHas(f.crs));
		const ll = EC.lpnCrsInverse(f.crs, { x: raw.origin.x + raw.nodes[0].x, y: raw.origin.y + raw.nodes[0].y });
		const lat = ll && (ll.lat !== undefined ? ll.lat : ll[1]), lon = ll && (ll.lon !== undefined ? ll.lon : ll[0]);
		ok('its origin lands within 0.2 degrees of ' + f.place.join(', '), !!ll && Math.abs(lat - f.place[0]) < 0.2 && Math.abs(lon - f.place[1]) < 0.2, JSON.stringify(ll));

		const saved = open(f);
		ok('it opens through the real import path', !!saved);
		if (!saved) { continue; }
		const doc = L.getDoc();
		const byId = (id) => doc.nodes.filter((n) => n.id === id)[0] || doc.links.filter((l) => l.id === id)[0];
		ok('it has exactly one loop', loopCount(doc) === 1, doc.nodes.length + ' nodes, ' + doc.links.length + ' links');
		ok('the key elements carry a plain Description', DESCRIBED[f.kind].every((id) => {
			const e = byId(id); return e && e.desc && e.desc.length >= 25 && /[.]$/.test(e.desc) && !/[—–]/.test(e.desc);
		}), DESCRIBED[f.kind].filter((id) => { const e = byId(id); return !(e && e.desc); }).join(', '));
		ok('the units in the Descriptions match the file (no psi or gpm in SI, no L/s in US)',
			doc.nodes.concat(doc.links).every((e) => !e.desc || (f.si ? !/\b(psi|gpm|ft|inch)\b/.test(e.desc) : !/(L\/s|\bmm\b|\b\d+ m\b)/.test(e.desc))));
		ok('the project states a description as text on the map', (raw.labels || []).filter((t) => !t.anchorNode).length >= 3);
		ok('IDs read as names (none is a bare number)', doc.nodes.concat(doc.links).every((e) => /[A-Za-z]/.test(e.id)));
		const pipes = doc.links.filter((l) => l.type === 'pipe');
		const dias = pipes.map((l) => l._diameter);
		ok('mains are ' + (f.kind === 'ext' ? '12 and 8 inch (300 and 200 mm)' : '6 inch (150 mm) with an 8 inch (200 mm) tank line'),
			f.kind === 'ext' ? dias.every((d) => (f.si ? [300, 200] : [12, 8]).indexOf(d) >= 0) : dias.every((d) => (f.si ? [150, 200] : [6, 8]).indexOf(d) >= 0), JSON.stringify(dias));
		ok('Hazen-Williams C is 130 to 140 on every pipe', pipes.every((l) => l._roughness >= 130 && l._roughness <= 140));
		const pump = doc.links.filter((l) => l.type === 'pump')[0];
		const curve = (doc.curves || []).filter((c) => c.id === pump._curveId)[0];
		ok('the pump has a three-point curve in the Library', !!curve && curve.points.length === 3 && curve.kind === 'head', curve && JSON.stringify(curve.points));

		console.log('--- both engines converge and agree (Base)');
		const nat = await solve('native'), epa = await solve('epanet');
		ok('built-in solver converges', nat.converged === true);
		ok('EPANET converges and solved it', epa.converged === true && epa.engine === 'epanet', epa.engine);
		let wp = 0, wq = 0;
		doc.nodes.forEach((n) => { if (n.type === 'junction') { wp = Math.max(wp, Math.abs(psi(nat, n.id) - psi(epa, n.id))); } });
		doc.links.forEach((l) => { wq = Math.max(wq, Math.abs(nat.flows[l.id] - epa.flows[l.id]) * GPM); });
		ok('pressures agree to 0.5 psi', wp < 0.5, wp.toFixed(3) + ' psi');
		ok('flows agree to 0.5 gpm', wq < 0.5, wq.toFixed(3) + ' gpm');

		console.log('--- normal pressure is 40 to 80 psi');
		const cond = f.kind === 'ext' ? ['Base', PC.lpn_scenario_preset_max_day] : ['Base', PC.lpn_scenario_preset_max_day, PC.lpn_scenario_preset_peak_hour];
		for (const name of cond) {
			const scn = name === 'Base' ? L.getScenarios()[0] : scenarioByName(name);
			ok('scenario "' + name + '" exists', !!scn);
			if (!scn) { continue; }
			L.switchScenario(scn.id);
			for (const eng of ['native', 'epanet']) {
				const r = await solve(eng);
				const ps = doc.nodes.filter((n) => n.type === 'junction').map((n) => psi(r, n.id));
				ok(name + ' (' + eng + '): every junction 40 to 80 psi', r.converged && Math.min(...ps) >= 40 && Math.max(...ps) <= 80, Math.min(...ps).toFixed(1) + ' to ' + Math.max(...ps).toFixed(1) + ' psi');
			}
		}
		L.switchScenario(L.getScenarios()[0].id);

		console.log('--- the fire hydrant junction passes its fire flow');
		const fire = FIRE[f.kind];
		const fh = byId(fire.id);
		ok(fire.id + ' states its own required fire flow', fh._fireFlow === (f.si ? fire.lps : fire.gpm), String(fh._fireFlow));
		L.wireFireFlowBox();
		for (const eng of ['native', 'epanet']) {
			L.settings().engine = eng;
			L.setAsk('scope', 'all'); L.setAsk('design', 'all');
			L.setAsk('residual', f.si ? '14' : '20'); L.setAsk('minPressure', f.si ? '14' : '20');
			await L.runFireFlowSweep();
			const rec = L.run().byId[fire.id];
			ok(eng + ': ' + fire.id + ' passes', rec && rec.state === 'pass', rec && rec.state);
			ok(eng + ': the required flow is ' + (f.si ? fire.lps + ' L/s' : fire.gpm + ' gpm'), rec && (f.si ? Math.abs(rec.required * 1000 - fire.lps) < 0.01 : Math.abs(rec.required * GPM - fire.gpm) < 3), rec && (rec.required * GPM).toFixed(1) + ' gpm');
			const resid = rec.pressureAtRequired * PSI_PER_M;
			ok(eng + ': ' + resid.toFixed(1) + ' psi residual at the required flow, over 20 psi', rec.holdsAtRequired === true && resid >= 19.9);
			ok(eng + ': no other junction falls below 20 psi and no pipe runs over 10 ft/s', rec.effects.nodes.length === 0 && rec.effects.links.length === 0, JSON.stringify(rec.effects));
		}
		L.settings().engine = 'native';

		if (f.kind === 'ext') {
			console.log('--- the hydrant flow test is reproduced at the pressure hydrant');
			const want = [[PC.lpn_scenario_preset_flow_static, 62, 0.2], [PC.lpn_scenario_preset_flow_mid, 56, 0.3], [PC.lpn_scenario_preset_flow_max, 48, 0.3]];
			for (const w of want) {
				const scn = scenarioByName(w[0]);
				ok('"' + w[0] + '" exists', !!scn);
				if (!scn) { continue; }
				L.switchScenario(scn.id);
				for (const eng of ['native', 'epanet']) {
					const r = await solve(eng);
					ok(w[0] + ' (' + eng + '): HYD-P reads ' + w[1] + ' psi', Math.abs(psi(r, 'HYD-P') - w[1]) <= w[2], psi(r, 'HYD-P').toFixed(2) + ' psi');
				}
				const rn = await solve('native'), testGpm = [0, 600, 1200][want.indexOf(w)];
				ok(w[0] + ': the pump passes the test flow and none of it reaches the extension (HYD-F is the only draw)',
					Math.abs(rn.flows['PMP-1'] * GPM - testGpm) <= Math.max(1, testGpm * 0.01) && Math.abs(rn.flows['EXT-A'] * GPM) < 1,
					(rn.flows['PMP-1'] * GPM).toFixed(1) + ' gpm through PMP-1, ' + (rn.flows['EXT-A'] * GPM).toFixed(2) + ' gpm into the extension');
			}
			L.switchScenario(L.getScenarios()[0].id);
		}

		if (f.kind === 'well') {
			console.log('--- one tank connection, and a 24-hour run');
			const tank = doc.nodes.filter((n) => n.type === 'tank');
			ok('one tank, on a single link', tank.length === 1 && doc.links.filter((l) => l.from === tank[0].id || l.to === tank[0].id).length === 1);
			const nr = await solve('native');
			const dq = nr.flows[pump.id] * GPM, designQ = curve.points[1][0] * (f.si ? 15850.32 / 1000 : 1);
			ok('at the start the pump runs near its design flow (' + designQ.toFixed(0) + ' gpm)', Math.abs(dq - designQ) / designQ < 0.15, dq.toFixed(1) + ' gpm');
			const model = L.assembleModel();
			const run = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
			ok('EPANET runs the 24 hours', run.ok && run.frames.length === 25, run.ok ? run.frames.length + ' steps' : JSON.stringify(run.issues || ''));
			if (run.ok) {
				const t = tank[0], lv = run.frames.map((fr) => fr.levels[t.id]);
				const lo = model.nodes.filter((n) => n.id === t.id)[0];
				ok('the tank stays inside its levels', Math.min(...lv) >= lo.minLevel - 1e-6 && Math.max(...lv) <= lo.maxLevel + 1e-6,
					(Math.min(...lv) / FT).toFixed(1) + ' to ' + (Math.max(...lv) / FT).toFixed(1) + ' ft');
				let sw = 0;
				run.frames.forEach((fr, i) => { if (i && fr.statuses[pump.id] !== run.frames[i - 1].statuses[pump.id]) { sw++; } });
				ok('the pump switches on tank level (at least two changes)', sw >= 2, sw + ' changes');
				const elev = {}; model.nodes.forEach((n) => { elev[n.id] = n.elev; });
				let lowest = Infinity;
				run.frames.forEach((fr) => model.nodes.filter((n) => n.type === 'junction').forEach((n) => { lowest = Math.min(lowest, (fr.heads[n.id] - elev[n.id]) * PSI_PER_M); }));
				ok('every junction holds 40 psi or more at every step', lowest >= 40, lowest.toFixed(1) + ' psi');
			}
		}

		console.log('--- the .inp export reads back to the same network and the same solve');
		const out = L.exportInp();
		ok('exports', !!out && out.ok, out && out.detail);
		const parsed = EC.lpnInpParse(out.inp);
		ok('the export parses', parsed.ok, parsed.error);
		const n0 = doc.nodes.length, l0 = doc.links.length;
		const orig = {};
		doc.nodes.forEach((n) => { orig[n.id] = { elev: n.elev, head: n._head, d: n._demand, lvl: n._level }; });
		const origLen = {}, origDia = {}, origC = {}, origSt = {};
		doc.links.forEach((l) => { origLen[l.id] = l._length; origDia[l.id] = l._diameter; origC[l.id] = l._roughness; origSt[l.id] = l._status; });
		const baseP = {}; const rBase = await solve('native'); doc.nodes.forEach((n) => { baseP[n.id] = rBase.pressures[n.id]; });
		setUnitSet(f.si ? 'si' : 'us');
		L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
		L.applyUnitSelections(L.inpUnitSelections(parsed));
		L.applySaved(L.docFromInp(parsed, 'roundtrip')); L.buildDom(); L.applyMethodUI();
		const d2 = L.getDoc();
		ok('same element counts', d2.nodes.length === n0 && d2.links.length === l0);
		ok('every node keeps elevation, head, demand and tank level', d2.nodes.every((n) => {
			const o = orig[n.id]; return o && o.elev === n.elev && o.head === n._head && o.d === n._demand && o.lvl === n._level;
		}));
		ok('every link keeps length, diameter, roughness and status (the check valve stays a check valve)', d2.links.every((l) => origLen[l.id] === l._length && origDia[l.id] === l._diameter && origC[l.id] === l._roughness && origSt[l.id] === l._status), JSON.stringify(d2.links.filter((l) => l.id === 'CV-1').map((l) => l._status)));
		const r2 = await solve('native');
		let dp = 0; d2.nodes.forEach((n) => { if (n.type !== 'reservoir') { dp = Math.max(dp, Math.abs(r2.pressures[n.id] - baseP[n.id]) * PSI_PER_M); } });
		ok('the re-imported network solves to the same pressures (0.01 psi)', r2.converged && dp < 0.01, dp.toExponential(2) + ' psi');
		solved[f.file] = { rBase, doc: doc.nodes.map((n) => n.id) };
	}

	console.log('\n=== each US and SI pair behaves alike ===');
	for (const kind of ['ext', 'well']) {
		const us = FILES.filter((f) => f.kind === kind && !f.si)[0], si = FILES.filter((f) => f.kind === kind && f.si)[0];
		const a = solved[us.file], b = solved[si.file];
		if (!a || !b) { ok(kind + ' pair solved', false); continue; }
		let dp = 0, at = '';
		Object.keys(a.rBase.pressures).forEach((id) => {
			if (b.rBase.pressures[id] === undefined) { return; }
			const d = Math.abs(a.rBase.pressures[id] - b.rBase.pressures[id]) * PSI_PER_M;
			if (d > dp) { dp = d; at = id; }
		});
		ok(kind + ': every pressure within 1.5 psi of its twin (nominal metric pipe sizes)', dp < 1.5, dp.toFixed(2) + ' psi at ' + at);
		ok(kind + ': the twins have the same IDs', JSON.stringify(a.doc) === JSON.stringify(b.doc));
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
