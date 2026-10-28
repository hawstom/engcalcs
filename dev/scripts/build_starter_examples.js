// Builds the four starter examples (Task 823), each in US and SI units:
//
//   Fire-flow-extension.lwn / Fire-flow-extension-SI.lwn   a main extension tied to an existing system
//   Community-well-tank.lwn / Community-well-tank-SI.lwn   a small community well, loop and tank
//
//   node dev/scripts/build_starter_examples.js            # write dev/water-network-examples/
//   node dev/scripts/build_starter_examples.js --solve    # also print the solved state, for tuning
//
// The networks are written ONCE below, in US units, and the SI twin is derived from the same record
// (a metric design, not a bit-exact image: nominal diameters 150, 200 and 300 mm, lengths to the
// metre, elevations to 0.1 m, flows to 0.01 L/s). Each is turned into EPANET .inp text and imported
// through the page's own importer; the scenarios, required fire flow, text labels, coordinate system
// and saved view are then set through the page's own code, and the file is written by the page's own
// serializer. The .lwn format is never written by hand. Held by dev/lpn-spike/starter-examples-harness.js.
//
// DESIGN POINT, so the numbers below can be judged: US practice (AWWA M31, NFPA 291) tests fire flow
// at 20 psi residual; normal pressure is 40 to 80 psi; Hazen-Williams C 130 (ductile iron) to 140 (PVC).
'use strict';
const path = require('path');
const fs = require('fs');
const H = path.join(__dirname, '..', 'lpn-spike');
const { ROOT, setUnitSet, loadLoopedNetwork } = require(H + '/lpn-dom-stub.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }
const proj4 = require(ROOT + 'js/vendor/proj4.js');
const DEFS = JSON.parse(fs.readFileSync(ROOT + 'js/data/epsg-proj4.json', 'utf8')).defs;

const PC = global.EngCalcs.pageConfig;   // the page's own preset scenario names, in English
const FT = 0.3048, GPM_LPS = 1 / 15850.323141488905 * 1000, FTUS = 1200 / 3937;
const round = (x, d) => Number(x.toFixed(d));

// ---------------------------------------------------------------------------------------------
// WORDS WITH UNITS. A description is a function of the unit system, so an SI file never says "psi".
// ---------------------------------------------------------------------------------------------
const MM = { 6: 150, 8: 200, 12: 300 };
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const units = (si, qdec) => ({
	q: (v, d) => si ? round(v * GPM_LPS, d === undefined ? qdec : d) + ' L/s' : fmt(v) + ' gpm',
	len: (ft) => si ? round(ft * FT, 1) + ' m' : fmt(ft) + ' ft',
	pr: (psi) => si ? round(psi * 2.31 * FT, 1) + ' m' : psi + ' psi',
	res: si ? '14 m' : '20 psi',
	dia: (n) => si ? MM[n] + ' mm' : n + ' inch',
	vol: si ? '255 cubic meters' : '67,000 gallons',
	power: si ? '7.6 L/s at 83.8 m, about 11 kW' : '120 gpm at 275 ft, about 15 hp'
});

// ---------------------------------------------------------------------------------------------
// THE TWO NETWORKS, in US units (ft, in, gpm). y is north. Node x, y are feet from the origin.
// ---------------------------------------------------------------------------------------------
const EXTENSION = {
	key: 'Fire-flow-extension', name: 'Fire flow extension', qdec: 0,
	crsUs: 'EPSG:2277', crsSi: 'EPSG:32139', where: [30.28, -98.41],   // Texas Central, near Johnson City
	title: 'Fire flow extension',
	nodes: [
		{ id: 'SYS', type: 'reservoir', x: 0, y: 0, head: 1200,
			desc: () => 'System reservoir. Stands for the existing distribution system, as a fixed head at the elevation of the pressure hydrant, with PMP-1 giving its pressure and flow from the hydrant flow test.' },
		{ id: 'HYD-P', x: 200, y: 0, elev: 1200, demand: 0,
			desc: (u) => 'Test pressure hydrant. Reads the pressure during the hydrant flow test: ' + u.pr(62) + ' static, ' + u.pr(56) + ' at ' + u.q(600) + ', ' + u.pr(48) + ' at ' + u.q(1200) + '.' },
		{ id: 'HYD-F', x: 600, y: 0, elev: 1202, demand: 0,
			desc: (u) => 'Test flow hydrant, on the existing ' + u.dia(12) + ' main. The flow test draws ' + u.q(600) + ' and ' + u.q(1200) + ' here. The extension ties in at this junction.' },
		{ id: 'EXT-1', x: 800, y: 0, elev: 1205, demand: 6, desc: () => 'First junction of the loop, two houses.' },
		{ id: 'EXT-2', x: 800, y: 300, elev: 1215, demand: 12, desc: () => 'Four houses.' },
		{ id: 'FH-1', x: 1200, y: 300, elev: 1228, demand: 0, fireFlow: 1500,
			desc: (u) => 'Fire hydrant junction, the high point of the loop and the design point for fire flow: ' + u.q(1500) + ' with ' + u.res + ' residual.' },
		{ id: 'EXT-3', x: 1200, y: 0, elev: 1218, demand: 10, desc: () => 'Three houses.' }
	],
	links: [
		{ id: 'PMP-1', type: 'pump', from: 'SYS', to: 'HYD-P', curve: 'SYSTEM',
			desc: (u) => 'Pump that stands for the existing system. Its curve is the hydrant flow test: ' + u.len(143.2) + ' (' + u.pr(62) + ') at no flow, ' + u.len(129.4) + ' (' + u.pr(56) + ') at ' + u.q(600) + ', ' + u.len(110.9) + ' (' + u.pr(48) + ') at ' + u.q(1200) + '.' },
		{ id: 'MAIN-1', from: 'HYD-P', to: 'HYD-F', dia: 12, c: 130, desc: (u) => 'Existing ' + u.dia(12) + ' ductile iron main between the two test hydrants.' },
		{ id: 'EXT-A', from: 'HYD-F', to: 'EXT-1', dia: 12, c: 140, desc: (u) => 'New ' + u.dia(12) + ' PVC feeder, sized for the ' + u.q(1500) + ' fire flow.' },
		{ id: 'EXT-B', from: 'EXT-1', to: 'EXT-2', dia: 8, c: 140, desc: (u) => 'New ' + u.dia(8) + ' PVC main.' },
		{ id: 'EXT-C', from: 'EXT-2', to: 'FH-1', dia: 8, c: 140 },
		{ id: 'EXT-D', from: 'FH-1', to: 'EXT-3', dia: 8, c: 140 },
		{ id: 'EXT-E', from: 'EXT-3', to: 'EXT-1', dia: 8, c: 140, desc: () => 'Closes the loop, so FH-1 is fed from both sides.' }
	],
	curve: { id: 'SYSTEM', note: 'Existing system from the hydrant flow test: static, mid and max flow', pts: [[0, 143.2], [600, 129.4], [1200, 110.9]] },
	// Flow tests are scenarios in which every demand is 0 except the flowing hydrant (the page's own preset names).
	scenarios: [
		{ name: PC.lpn_scenario_preset_flow_static, zero: true },
		{ name: PC.lpn_scenario_preset_flow_mid, zero: true, flow: ['HYD-F', 600] },
		{ name: PC.lpn_scenario_preset_flow_max, zero: true, flow: ['HYD-F', 1200] },
		{ name: PC.lpn_scenario_preset_max_day, mult: 2 }
	],
	texts: (u) => ['Fire flow extension',
		'SYS and PMP-1 stand for the existing system, from the hydrant flow test at HYD-P and HYD-F.',
		'Design point: ' + u.q(1500) + ' at FH-1 with ' + u.res + ' residual. Scenarios 1 to 3 repeat the flow test.'],
	textAt: [[600, 480], [600, 410], [600, 370]]
};

const WELL = {
	key: 'Community-well-tank', name: 'Community well and tank', qdec: 1,
	crsUs: 'EPSG:2276', crsSi: 'EPSG:32138', where: [33.05, -99.20],   // Texas North Central
	title: 'Community well and tank',
	nodes: [
		{ id: 'WELL-1', type: 'reservoir', x: -400, y: 0, head: 1330,
			desc: (u) => 'Community well, as a fixed head at its pumping water level, ' + u.len(160) + ' below the ' + u.len(1490) + ' ground at the wellhead.' },
		{ id: 'WH-1', x: 0, y: 0, elev: 1485, demand: 0, desc: () => 'Wellhead and pump discharge. The discharge check valve is CV-1.' },
		{ id: 'C-1', x: 400, y: 0, elev: 1480, demand: 0, desc: () => 'Where the well supply enters the loop.' },
		{ id: 'C-2', x: 600, y: 0, elev: 1478, demand: 6, desc: () => 'Thirteen houses.' },
		{ id: 'C-3', x: 800, y: 0, elev: 1476, demand: 5, desc: () => 'Eleven houses.' },
		{ id: 'C-4', x: 800, y: 350, elev: 1474, demand: 5, desc: () => 'Eleven houses. The tank connects here, the only tank connection.' },
		{ id: 'C-5', x: 600, y: 350, elev: 1476, demand: 4, desc: () => 'Nine houses.' },
		{ id: 'FH-1', x: 400, y: 350, elev: 1478, demand: 4, fireFlow: 500,
			desc: (u) => 'Fire hydrant junction, the point of the loop farthest from the tank and the design point for fire flow: ' + u.q(500) + ' with ' + u.res + ' residual, for two hours from the tank.' },
		{ id: 'TANK-1', type: 'tank', x: 1280, y: 450, elev: 1590, init: 13, min: 2, max: 20, dia: 24,
			desc: (u) => 'Ground storage tank on the hill above the community, ' + u.len(24) + ' in diameter and ' + u.len(20) + ' high, about ' + u.vol + '.' }
	],
	links: [
		{ id: 'WP-1', type: 'pump', from: 'WELL-1', to: 'WH-1', curve: 'WELL',
			desc: (u) => 'Submersible well pump, ' + u.power + '. Runs when TANK-1 falls below ' + u.len(12) + ' and stops above ' + u.len(19) + ', which holds the water below ' + u.len(12) + ' in reserve for fire flow.' },
		{ id: 'CV-1', from: 'WH-1', to: 'C-1', dia: 6, c: 140, status: 'CV',
			desc: () => 'Check valve on the well discharge, so the system cannot flow back toward the well. The other check valves of a real installation are assumed, not modeled.' },
		{ id: 'L-1', from: 'C-1', to: 'C-2', dia: 6, c: 140 },
		{ id: 'L-2', from: 'C-2', to: 'C-3', dia: 6, c: 140 },
		{ id: 'L-3', from: 'C-3', to: 'C-4', dia: 6, c: 140 },
		{ id: 'L-4', from: 'C-4', to: 'C-5', dia: 6, c: 140 },
		{ id: 'L-5', from: 'C-5', to: 'FH-1', dia: 6, c: 140 },
		{ id: 'L-6', from: 'FH-1', to: 'C-1', dia: 6, c: 140, desc: () => 'Closes the loop, so the community circulates internally.' },
		{ id: 'TL-1', from: 'C-4', to: 'TANK-1', dia: 8, c: 130, desc: () => 'Ductile iron tank line. It fills and drains the tank, so it has no check valve.' }
	],
	curve: { id: 'WELL', note: 'Well pump, three points: shutoff, design, maximum', pts: [[0, 350], [120, 275], [190, 185]] },
	pattern: { id: 'DAILY', note: 'Residential diurnal demand', m: [0.5, 0.5, 0.5, 0.5, 0.5, 0.8, 1.3, 1.6, 1.4, 1.1, 1.0, 1.1, 1.0, 0.9, 1.0, 1.0, 1.2, 1.5, 1.6, 1.4, 1.1, 1.0, 0.9, 0.6] },
	controls: ['LINK WP-1 OPEN IF NODE TANK-1 BELOW 12', 'LINK WP-1 CLOSED IF NODE TANK-1 ABOVE 19'],
	energy: [' Global Efficiency\t65', ' Global Price\t0.12'],
	scenarios: [{ name: PC.lpn_scenario_preset_max_day, mult: 2 }, { name: PC.lpn_scenario_preset_peak_hour, mult: 3 }],
	texts: (u) => ['Community well and tank',
		'WELL-1 and WP-1 are the well and its pump. TANK-1 has one connection, TL-1.',
		'Design point: ' + u.q(500) + ' at FH-1 with ' + u.res + ' residual. The 24-hour run switches the pump on tank level.'],
	textAt: [[440, 650], [440, 590], [440, 555]]
};

// ---------------------------------------------------------------------------------------------
// US spec -> the numbers in one unit system
// ---------------------------------------------------------------------------------------------
function convert(spec, si) {
	const u = units(si, spec.qdec);
	const Qc = si ? (v) => round(v * GPM_LPS, spec.qdec) : (v) => v;
	const L = si ? (v) => round(v * FT, 1) : (v) => v;
	const Lz = si ? (v) => Math.round(v * FT) : (v) => Math.round(v);
	const Q = si ? (v) => round(v * GPM_LPS, 2) : (v) => v;
	const nodes = spec.nodes.map((n) => Object.assign({}, n, {
		x: si ? round(n.x * FT, 1) : n.x, y: si ? round(n.y * FT, 1) : n.y,
		elev: n.elev === undefined ? undefined : L(n.elev), head: n.head === undefined ? undefined : L(n.head),
		demand: n.demand === undefined ? undefined : Q(n.demand),
		min: n.min === undefined ? undefined : L(n.min), max: n.max === undefined ? undefined : L(n.max),
		init: n.init === undefined ? undefined : L(n.init), dia: n.dia === undefined ? undefined : L(n.dia),
		fireFlow: n.fireFlow === undefined ? undefined : (si ? round(n.fireFlow * GPM_LPS, 0) : n.fireFlow),
		desc: n.desc ? n.desc(u) : undefined
	}));
	const byId = {};
	spec.nodes.forEach((n) => { byId[n.id] = n; });
	const links = spec.links.map((l) => {
		const o = Object.assign({}, l, { desc: l.desc ? l.desc(u) : undefined });
		if (l.type !== 'pump') {
			const a = byId[l.from], b = byId[l.to];
			o.len = Lz(Math.hypot(a.x - b.x, a.y - b.y));
			o.dia = si ? MM[l.dia] : l.dia;
		}
		return o;
	});
	const curve = { id: spec.curve.id, note: spec.curve.note, pts: spec.curve.pts.map((p) => [Qc(p[0]), L(p[1])]) };
	return { nodes, links, curve, u };
}

function inpText(spec, si) {
	const c = convert(spec, si);
	const out = [];
	out.push('[TITLE]', spec.title, '');
	out.push('[JUNCTIONS]', ';ID Elev Demand' + (spec.pattern ? ' Pattern' : ''));
	c.nodes.filter((n) => !n.type).forEach((n) => out.push(' ' + n.id + '\t' + n.elev + '\t' + n.demand + (spec.pattern ? '\t' + spec.pattern.id : '') + '\t;' + (n.desc || '')));
	out.push('', '[RESERVOIRS]', ';ID Head');
	c.nodes.filter((n) => n.type === 'reservoir').forEach((n) => out.push(' ' + n.id + '\t' + n.head + '\t;' + n.desc));
	out.push('', '[TANKS]', ';ID Elev InitLvl MinLvl MaxLvl Diam MinVol');
	c.nodes.filter((n) => n.type === 'tank').forEach((n) => out.push(' ' + n.id + '\t' + n.elev + '\t' + n.init + '\t' + n.min + '\t' + n.max + '\t' + n.dia + '\t0\t;' + n.desc));
	out.push('', '[PIPES]', ';ID Node1 Node2 Length Diam Rough MinorLoss Status');
	c.links.filter((l) => l.type !== 'pump').forEach((l) => out.push(' ' + l.id + '\t' + l.from + '\t' + l.to + '\t' + l.len + '\t' + l.dia + '\t' + l.c + '\t0\t' + (l.status || 'Open') + '\t;' + (l.desc || '')));
	out.push('', '[PUMPS]', ';ID Node1 Node2 Parameters');
	c.links.filter((l) => l.type === 'pump').forEach((l) => out.push(' ' + l.id + '\t' + l.from + '\t' + l.to + '\tHEAD ' + l.curve + '\t;' + l.desc));
	out.push('', '[CURVES]', ';PUMP: ' + c.curve.note);
	c.curve.pts.forEach((p) => out.push(' ' + c.curve.id + '\t' + p[0] + '\t' + p[1]));
	if (spec.pattern) {
		out.push('', '[PATTERNS]', ';' + spec.pattern.note);
		for (let i = 0; i < 24; i += 6) { out.push(' ' + spec.pattern.id + '\t' + spec.pattern.m.slice(i, i + 6).join('\t')); }
	}
	if (spec.controls) {
		out.push('', '[CONTROLS]');
		spec.controls.forEach((s) => out.push(si ? s.replace(/(BELOW|ABOVE) (\S+)/, (m, w, v) => w + ' ' + round(Number(v) * FT, 1)) : s));
	}
	if (spec.energy) { out.push('', '[ENERGY]'); spec.energy.forEach((l) => out.push(l)); }
	out.push('', '[TIMES]');
	if (spec.pattern) { out.push(' Duration\t24:00', ' Hydraulic Timestep\t1:00', ' Pattern Timestep\t1:00', ' Pattern Start\t0:00', ' Report Timestep\t1:00'); }
	else { out.push(' Duration\t0'); }
	out.push('', '[OPTIONS]', ' UNITS\t' + (si ? 'LPS' : 'GPM'), ' HEADLOSS\tH-W');
	out.push('', '[COORDINATES]', ';Node X Y');
	c.nodes.forEach((n) => out.push(' ' + n.id + '\t' + n.x + '\t' + n.y));
	out.push('', '[END]', '');
	return out.join('\n');
}

// ---------------------------------------------------------------------------------------------
// the page
// ---------------------------------------------------------------------------------------------
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs, getScenarios: function () { return scenarios; },\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, applyMethodUI: applyMethodUI, projectFileText: projectFileText,\n" +
	"\t\tgetProject: function () { return project; }, runSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, calcWriteTargetOf: calcWriteTargetOf, setProp: setProp,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");

function build(spec, si) {
	setUnitSet(si ? 'si' : 'us');
	L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
	const parsed = global.EngCalcs.lpnInpParse(inpText(spec, si));
	if (!parsed.ok) { throw new Error('inp: ' + parsed.error); }
	if (parsed.dropped.length) { console.log('  dropped:', JSON.stringify(parsed.dropped.map((d) => d.code))); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const name = spec.name + (si ? ', L/s (SI)' : ', gpm (US)');
	const doc0 = L.docFromInp(parsed, spec.name);
	L.applySaved(doc0); L.buildDom(); L.applyMethodUI();
	const doc = L.getDoc();
	const node = (id) => doc.nodes.filter((n) => n.id === id)[0];
	L.getProject().name = spec.name + (si ? ' SI' : '');
	// Required fire flow, the junction's own (Task 530).
	const c = convert(spec, si);
	c.nodes.forEach((n) => { if (n.fireFlow) { node(n.id)._fireFlow = n.fireFlow; } });
	// Scenarios: ordinary overrides, through the page's own seam.
	const base = L.getScenarios()[0];
	const sc = (spec.scenarios || []);
	sc.forEach((s) => {
		const scn = L.createScenario(s.name, base.id);
		L.switchScenario(scn.id);
		if (s.mult) { L.calcWriteTargetOf(scn).demandMultiplier = s.mult; }
		if (s.zero) { doc.nodes.filter((n) => n.type === 'junction').forEach((n) => { if (n._demand) { L.setProp(n, 'demand', 0); } }); }
		if (s.flow) { L.setProp(node(s.flow[0]), 'demand', si ? round(s.flow[1] * GPM_LPS, spec.qdec) : s.flow[1]); }
	});
	L.switchScenario(base.id);

	const f = JSON.parse(L.projectFileText());
	// Coordinate system and origin: the plane position of the project's south-west corner, floored to 1000.
	const crs = si ? spec.crsSi : spec.crsUs;
	const usCode = spec.crsUs.replace('EPSG:', '');
	proj4.defs('U' + usCode, DEFS[usCode]);
	const o = proj4('EPSG:4326', 'U' + usCode, [spec.where[1], spec.where[0]]);
	const orgUs = { x: Math.floor(o[0] / 1000) * 1000, y: Math.floor(o[1] / 1000) * 1000 };
	f.origin = si ? { x: Number((orgUs.x * FTUS).toPrecision(9)), y: Number((orgUs.y * FTUS).toPrecision(9)) } : orgUs;
	f.project.crs = crs;
	f.project.gallery = spec.key + (si ? '-SI' : '') + '.lwn';
	delete f.project.coords;
	// The page's own pump fit from the curve is kept; the stub spells every default out, so state what this example chose.
	f.settings.textSize = 12; f.settings.symbolSize = 12; f.settings.linkWidth = 4;
	f.labelSettings = {
		node: { id: true, elev: true, demand: true, head: false, pressure: true },
		link: { id: true, diameter: false, length: false, roughness: false, km: false, flow: true, velocity: true, headloss: false, gradient: false },
		prefix: { node: { id: '' }, link: { id: '' } }, separator: ' ', markExtrema: true
	};
	// Title block: the project's description, as Text objects above the drawing.
	const k = si ? FT : 1;
	f.labels = (f.labels || []).filter((t) => t.anchorNode || t.anchorLink);
	spec.texts(c.u).forEach((t, i) => {
		f.labels.push({ id: 'X' + (i + 1), text: t, x: round(spec.textAt[i][0] * k, 1), y: round(spec.textAt[i][1] * k, 1), anchorNode: null, sizeMult: i ? 1 : 3, allZoom: i === 0 });
	});
	f.nextId = Object.assign({}, f.nextId, { X: spec.texts(c.u).length + 1 });
	// View: the nodes and the title block, fitted to a 900 x 520 px canvas.
	const xs = c.nodes.map((n) => n.x), ys = c.nodes.map((n) => n.y).concat(spec.textAt.map((t) => t[1] * k));
	const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
	f.view = { cx: round((x0 + x1) / 2, 1), cy: round((y0 + y1) / 2, 1), s: Number(Math.min(900 / (x1 - x0), 520 / (y1 - y0)).toPrecision(4)) };
	if (si) {
		f.units = { lpn_u_length: 'm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o', lpn_u_diameter: 'mm', lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: f.units.lpn_u_gradient };
		if (f.units0) { delete f.units0; }
	}
	f.app = 'https://librewaternet.org/app/';
	return f;
}

const dest = process.argv.filter((a) => a.indexOf('--out=') === 0).map((a) => a.slice(6))[0]
	|| path.join(ROOT, 'dev/water-network-examples');
[EXTENSION, WELL].forEach((spec) => {
	[false, true].forEach((si) => {
		const f = build(spec, si);
		const file = path.join(dest, spec.key + (si ? '-SI' : '') + '.lwn');
		const out = JSON.stringify(f, null, '\t');
		fs.writeFileSync(file, out + '\n');
		console.log('written', path.basename(file), out.length, 'bytes');
	});
});
module.exports = { EXTENSION, WELL, convert, inpText };
