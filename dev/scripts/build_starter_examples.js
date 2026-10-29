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
// WHERE THEY SIT (Tom, 2026-10-28: "align with the streets"). Each example is drawn on the real
// streets of a real town, and every junction is a longitude/latitude taken ONCE from OpenStreetMap
// (Overpass, fetched 2026-10-28, the street centrelines named beside each node) and fixed here as a
// constant: nothing is fetched when the generator runs or when a visitor opens the page. The project's
// plane coordinates are those points projected into the project's coordinate system.
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
// TWO UNIT SYSTEMS, TWO DESIGNS. The SI twin is written as a metric design with round metric numbers
// (120 m, 0.4 L/s, 7.5 m), never a conversion of the US numbers; v(us, si) picks one.
// ---------------------------------------------------------------------------------------------
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const scnName = (key, n) => n + '. ' + PC[key].replace(/^\d+\.\s*/, '');
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Project each node's longitude/latitude into the example's coordinate system and set x and y relative to
// the origin shift (the south-west corner of the nodes, floored to 1000 US survey feet, as a person would
// set it). The SI twin is the same projection in metres: its plane is the US plane times 1200/3937 exactly.
function locate(nodes, crsUs, si) {
	const code = crsUs.replace('EPSG:', '');
	proj4.defs('U' + code, DEFS[code]);
	const pts = nodes.map((n) => proj4('EPSG:4326', 'U' + code, n.ll));
	const org = { x: Math.floor(Math.min(...pts.map((q) => q[0])) / 1000) * 1000, y: Math.floor(Math.min(...pts.map((q) => q[1])) / 1000) * 1000 };
	nodes.forEach((n, i) => {
		const x = pts[i][0] - org.x, y = pts[i][1] - org.y;
		n.x = si ? round(x * FTUS, 2) : round(x, 1);
		n.y = si ? round(y * FTUS, 2) : round(y, 1);
	});
	return org;
}
// The title block sits above the drawing, centred on it.
function titleAt(nodes, si) {
	const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
	const x = round((Math.min(...xs) + Math.max(...xs)) / 2, 1), top = Math.max(...ys);
	return si ? [[x, round(top + 55, 1)], [x, round(top + 33, 1)], [x, round(top + 21, 1)]]
		: [[x, round(top + 180, 1)], [x, round(top + 110, 1)], [x, round(top + 70, 1)]];
}

function extension(si) {
	const v = (us, m) => si ? m : us;
	const flow = (us, m) => si ? m + ' L/s' : fmt(us) + ' gpm';
	const res = v('20 psi', '14 m');
	const nodes = [
		{ id: 'SYS', type: 'reservoir', ll: [-98.411993, 30.276713], head: v(1200, 366),
			desc: 'System reservoir. Stands for the existing distribution system, as a fixed head at the elevation of the pressure hydrant, with PMP-1 giving its pressure and flow from the hydrant flow test.' },
		{ id: 'HYD-P', ll: [-98.4114405, 30.276722], elev: v(1200, 366), demand: 0,
			desc: 'Test pressure hydrant. Reads the pressure during the hydrant flow test: ' + v('62 psi static, 56 psi at 600 gpm, 48 psi at 1,200 gpm.', '43.5 m static, 39.5 m at 38 L/s, 34 m at 76 L/s.') },
		{ id: 'HYD-F', ll: [-98.410888, 30.276731], elev: v(1202, 366.5), demand: 0,
			desc: 'Test flow hydrant, on the existing ' + v('12 inch', '300 mm') + ' main. The flow test draws ' + v('600 and 1,200 gpm', '38 and 76 L/s') + ' here. The extension ties in at this junction.' },
		{ id: 'EXT-1', ll: [-98.409793, 30.27675], elev: v(1205, 367.5), demand: v(6, 0.4), desc: 'First junction of the loop, two houses.' },
		{ id: 'EXT-2', ll: [-98.409812, 30.277725], elev: v(1215, 370.5), demand: v(12, 0.8), desc: 'Four houses.' },
		{ id: 'FH-1', ll: [-98.4086786, 30.2777426], elev: v(1228, 374), demand: 0, fireFlow: v(1500, 95),
			desc: 'Fire hydrant junction, the high point of the loop and the design point for fire flow: ' + flow(1500, 95) + ' with ' + res + ' residual.' },
		{ id: 'EXT-3', ll: [-98.408674, 30.276769], elev: v(1218, 371.5), demand: v(10, 0.6), desc: 'Three houses.' }
	];
	const orgUs = locate(nodes, 'EPSG:2277', si);   // Texas Central, Johnson City
	const big = v(12, 300), small = v(8, 200);
	const links = [
		{ id: 'PMP-1', type: 'pump', from: 'SYS', to: 'HYD-P', curve: 'SYSTEM',
			desc: 'Pump that stands for the existing system. Its curve is the hydrant flow test: ' + v('143.2 ft (62 psi) at no flow, 129.4 ft (56 psi) at 600 gpm, 110.9 ft (48 psi) at 1,200 gpm.', '43.5 m at no flow, 39.5 m at 38 L/s, 34 m at 76 L/s.') },
		{ id: 'MAIN-1', from: 'HYD-P', to: 'HYD-F', dia: big, c: 130, desc: 'Existing ' + v('12 inch', '300 mm') + ' ductile iron main between the two test hydrants.' },
		{ id: 'EXT-A', from: 'HYD-F', to: 'EXT-1', dia: big, c: 140, desc: 'New ' + v('12 inch', '300 mm') + ' PVC feeder, sized for the ' + flow(1500, 95) + ' fire flow.' },
		{ id: 'EXT-B', from: 'EXT-1', to: 'EXT-2', dia: small, c: 140, desc: 'New ' + v('8 inch', '200 mm') + ' PVC main.' },
		{ id: 'EXT-C', from: 'EXT-2', to: 'FH-1', dia: small, c: 140 },
		{ id: 'EXT-D', from: 'FH-1', to: 'EXT-3', dia: small, c: 140 },
		{ id: 'EXT-E', from: 'EXT-3', to: 'EXT-1', dia: small, c: 140, desc: 'Closes the loop, so FH-1 is fed from both sides.' }
	];
	return {
		key: 'Fire-flow-extension', name: 'Extension with fire flow', si,
		crsUs: 'EPSG:2277', crsSi: 'EPSG:32139', orgUs,
		title: 'Extension with fire flow', nodes, links,
		curve: { id: 'SYSTEM', note: 'Existing system from the hydrant flow test: static, mid and max flow',
			pts: v([[0, 143.2], [600, 129.4], [1200, 110.9]], [[0, 43.5], [38, 39.5], [76, 34]]) },
		// Flow tests are scenarios in which every demand is 0 except the flowing hydrant (the page's own preset names).
		scenarios: [
			{ name: PC.lpn_scenario_preset_flow_static, zero: true },
			{ name: PC.lpn_scenario_preset_flow_mid, zero: true, flow: ['HYD-F', v(600, 38)] },
			{ name: PC.lpn_scenario_preset_flow_max, zero: true, flow: ['HYD-F', v(1200, 76)] },
			{ name: scnName('lpn_scenario_preset_max_day', 4), mult: 2 }
		],
		texts: ['Extension with fire flow',
			'SYS and PMP-1 stand for the existing system, from the hydrant flow test at HYD-P and HYD-F.',
			'Design point: ' + flow(1500, 95) + ' at FH-1 with ' + res + ' residual. Scenarios 1 to 3 repeat the flow test.'],
		textAt: titleAt(nodes, si)
	};
}

function well(si) {
	const v = (us, m) => si ? m : us;
	const flow = (us, m) => si ? m + ' L/s' : fmt(us) + ' gpm';
	const res = v('20 psi', '14 m');
	const nodes = [
		{ id: 'WELL-1', type: 'reservoir', ll: [-99.6315968, 33.4492181], head: v(1330, 405.5),
			desc: 'Community well, as a fixed head at its pumping water level, ' + v('160 ft below the 1,490 ft', '49 m below the 454.5 m') + ' ground at the wellhead.' },
		{ id: 'WH-1', ll: [-99.6312968, 33.4492181], elev: v(1485, 454.5), demand: 0, desc: 'Wellhead and pump discharge. The discharge check valve is CV-1. This is the wellhead, not a fire flow point, so a fire flow sweep that fails it is expected.' },
		{ id: 'C-1', ll: [-99.6313264, 33.4496383], elev: v(1480, 451), demand: 0, desc: 'Where the well supply enters the loop.' },
		{ id: 'C-2', ll: [-99.6313548, 33.4503786], elev: v(1478, 450.5), demand: v(6, 0.4), desc: 'Thirteen houses.' },
		{ id: 'C-3', ll: [-99.631389, 33.4510723], elev: v(1476, 450), demand: v(5, 0.3), desc: 'Eleven houses.' },
		{ id: 'C-4', ll: [-99.6305304, 33.4510928], elev: v(1474, 449.5), demand: v(5, 0.3), desc: 'Eleven houses. The tank connects here, the only tank connection.' },
		{ id: 'C-5', ll: [-99.6305159, 33.4503979], elev: v(1476, 450), demand: v(4, 0.3), desc: 'Nine houses.' },
		{ id: 'FH-1', ll: [-99.6305005, 33.4496572], elev: v(1478, 450.5), demand: v(4, 0.3), fireFlow: v(500, 32),
			desc: 'Fire hydrant junction, the point of the loop farthest from the tank and the design point for fire flow: ' + flow(500, 32) + ' with ' + res + ' residual, for two hours from the tank and the pump.' },
		{ id: 'TANK-1', type: 'tank', ll: [-99.630545, 33.45219], elev: v(1590, 485), init: v(17, 5.2), min: v(2, 0.6), max: v(20, 6), dia: v(24, 7.5),
			desc: 'Elevated tank, ' + v('24 ft in diameter and 20 ft high, about 67,000 gal', '7.5 m in diameter and 6 m high, about 265 cubic meters') + ', with its floor about ' + v('116 ft', '35.5 m') + ' above C-4, the junction it connects to.' }
	];
	const orgUs = locate(nodes, 'EPSG:2276', si);   // Texas North Central, Munday
	const links = [
		{ id: 'WP-1', type: 'pump', from: 'WELL-1', to: 'WH-1', curve: 'WELL',
			desc: 'Submersible well pump, ' + v('120 gpm at 275 ft, about 15 hp', '7.5 L/s at 84 m, about 11 kW') + '. Runs when TANK-1 falls below ' + v('16 ft', '4.8 m') + ' and stops above ' + v('19 ft', '5.8 m') + '. '
				+ v('The 14 ft of tank below 16 ft holds about 47,000 gal and the pump adds about 14,000 gal in two hours, over the 60,000 gal that 500 gpm needs for two hours.',
					'The 4.2 m of tank below 4.8 m holds about 185 cubic meters and the pump adds about 54 cubic meters in two hours, over the 230 cubic meters that 32 L/s needs for two hours.') },
		{ id: 'CV-1', from: 'WH-1', to: 'C-1', dia: v(6, 150), c: 140, status: 'CV',
			desc: 'Check valve on the well discharge, so the system cannot flow back toward the well. The other check valves of a real installation are assumed, not modeled.' },
		{ id: 'L-1', from: 'C-1', to: 'C-2', dia: v(6, 150), c: 140 },
		{ id: 'L-2', from: 'C-2', to: 'C-3', dia: v(6, 150), c: 140 },
		{ id: 'L-3', from: 'C-3', to: 'C-4', dia: v(6, 150), c: 140 },
		{ id: 'L-4', from: 'C-4', to: 'C-5', dia: v(6, 150), c: 140 },
		{ id: 'L-5', from: 'C-5', to: 'FH-1', dia: v(6, 150), c: 140 },
		{ id: 'L-6', from: 'FH-1', to: 'C-1', dia: v(6, 150), c: 140, desc: 'Closes the loop, so the community circulates internally.' },
		{ id: 'TL-1', from: 'C-4', to: 'TANK-1', dia: v(8, 200), c: 130, desc: 'Ductile iron tank line. It fills and drains the tank, so it has no check valve.' }
	];
	return {
		key: 'Community-well-tank', name: 'Munday well and tank', si,
		crsUs: 'EPSG:2276', crsSi: 'EPSG:32138', orgUs,
		title: 'Munday well and tank', nodes, links,
		curve: { id: 'WELL', note: 'Well pump, three points: shutoff, design, maximum', pts: v([[0, 350], [120, 275], [190, 185]], [[0, 107], [7.5, 84], [12, 56]]) },
		pattern: { id: 'DAILY', note: 'Residential diurnal demand', m: [0.5, 0.5, 0.5, 0.5, 0.5, 0.8, 1.3, 1.6, 1.4, 1.1, 1.0, 1.1, 1.0, 0.9, 1.0, 1.0, 1.2, 1.5, 1.6, 1.4, 1.1, 1.0, 0.9, 0.6] },
		controls: ['LINK WP-1 OPEN IF NODE TANK-1 BELOW ' + v(16, 4.8), 'LINK WP-1 CLOSED IF NODE TANK-1 ABOVE ' + v(19, 5.8)],
		energy: [' Global Efficiency\t65', ' Global Price\t0.12'],
		scenarios: [{ name: scnName('lpn_scenario_preset_max_day', 1), mult: 2 }, { name: scnName('lpn_scenario_preset_peak_hour', 2), mult: 3 }],
		texts: ['Munday well and tank',
			'WELL-1 and WP-1 are the well and its pump. TANK-1 has one connection, TL-1.',
			'Design point: ' + flow(500, 32) + ' at FH-1 with ' + res + ' residual. The 24-hour run switches the pump based on the tank level.'],
		textAt: titleAt(nodes, si)
	};
}

// Lengths are the drawn distance between the end nodes, to the whole foot (US) or whole metre (SI).
function convert(spec) {
	const byId = {};
	spec.nodes.forEach((n) => { byId[n.id] = n; });
	const links = spec.links.map((l) => {
		const o = Object.assign({}, l);
		if (l.type !== 'pump') { o.len = Math.round(dist(byId[l.from], byId[l.to])); }
		return o;
	});
	return { nodes: spec.nodes, links, curve: spec.curve };
}

function inpText(spec, si) {
	const c = convert(spec);
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
		spec.controls.forEach((s) => out.push(s));
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

function build(spec) {
	const si = spec.si;
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
	const c = convert(spec);
	c.nodes.forEach((n) => { if (n.fireFlow) { node(n.id)._fireFlow = n.fireFlow; } });
	// Scenarios: ordinary overrides, through the page's own seam.
	const base = L.getScenarios()[0];
	const sc = (spec.scenarios || []);
	sc.forEach((s) => {
		const scn = L.createScenario(s.name, base.id);
		L.switchScenario(scn.id);
		if (s.mult) { L.calcWriteTargetOf(scn).demandMultiplier = s.mult; }
		if (s.zero) { doc.nodes.filter((n) => n.type === 'junction').forEach((n) => { if (n._demand) { L.setProp(n, 'demand', 0); } }); }
		if (s.flow) { L.setProp(node(s.flow[0]), 'demand', s.flow[1]); }
	});
	L.switchScenario(base.id);

	const f = JSON.parse(L.projectFileText());
	// Coordinate system and origin: the plane position of the project's south-west corner, floored to 1000.
	const crs = si ? spec.crsSi : spec.crsUs;
	const orgUs = spec.orgUs;
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
	const k = 1;
	f.labels = (f.labels || []).filter((t) => t.anchorNode || t.anchorLink);
	spec.texts.forEach((t, i) => {
		f.labels.push({ id: 'X' + (i + 1), text: t, x: round(spec.textAt[i][0] * k, 1), y: round(spec.textAt[i][1] * k, 1), anchorNode: null, sizeMult: i ? 1 : 3, allZoom: i === 0 });
	});
	f.nextId = Object.assign({}, f.nextId, { X: spec.texts.length + 1 });
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
[extension, well].forEach((make) => {
	[false, true].forEach((si) => {
		const spec = make(si);
		const f = build(spec);
		const file = path.join(dest, spec.key + (si ? '-SI' : '') + '.lwn');
		const out = JSON.stringify(f, null, '\t');
		fs.writeFileSync(file, out + '\n');
		console.log('written', path.basename(file), out.length, 'bytes');
	});
});

