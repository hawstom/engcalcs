// Headless check of STAGE 3 of dev/scenario-alternatives.md: every reader of a project setting
// goes through the one read seam, settingFor() / effectiveSetting().
//
//   node dev/lpn-spike/scenario-settings-routing-harness.js
//
// Tom, 2026-10-06: *"We can't treat any value overrides differently. This must be a careful and
// long burn."* Routing about a hundred readers can go wrong two silent ways, and this asks both:
//
//   1. A PROJECT WITH NO SETTING OVERRIDE MUST BEHAVE EXACTLY AS BEFORE. Every shipped example is
//      drawn, coloured, labelled, solved and exported twice -- once by the real page, and once by
//      the same page with the seam BLINDED (settingFor() answers the project's own object and no
//      scenario is seen to hold a setting), which is the page as it was before any reader moved.
//      The blinded copy runs in a child process, so the two never share a global. Base, a fresh
//      scenario, and a scenario holding element overrides, a demand multiplier and its own run
//      time (the overrides that existed before stage 3) must be byte-identical between the two:
//      the SVG of the map, the legends, the solver's model and answer, and the `.inp` text.
//   2. A SETTING A SCENARIO HOLDS MUST CHANGE THAT SCENARIO AND NOTHING ELSE: a Presentation
//      value on the map, a Calculation value in the solve, values that ride into the `.inp`, and
//      the scenario's own view.
//
// The blinded run is also the harness's own red check: with an override in place the two runs
// must DIFFER, or the comparison in (1) proves nothing.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BLIND = process.env.LPN_SEAM_BLIND === '1';

global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
global.prompt = global.window.prompt = function () { return 'Scenario'; };

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');

function blind(src) {
	const a = 'function settingFor(scn, path) {\n';
	const b = 'function scenarioSettingsBlock(scn) {\n';
	if (src.indexOf(a) < 0 || src.indexOf(b) < 0) { throw new Error('blind: seam not found'); }
	return src
		.replace(a, a + '\t\tif (true) { return settingGet({ r: settingRootValue(settingPath(path)[0]) }, [\'r\'].concat(settingPath(path).slice(1))); }\n')
		.replace(b, b + '\t\tif (true) { return null; }\n');
}

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tgetSettings: function () { return settings; }, getLabelSettings: function () { return labelSettings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, buildDom: buildDom, applySaved: applySaved,\n" +
	"\t\tacceptImportedText: acceptImportedText, serializeProject: serializeProject,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tactiveScenario: activeScenario, setProp: setProp,\n" +
	"\t\tassembleModel: assembleModel, solveAccuracy: solveAccuracy, applySolveResult: applySolveResult,\n" +
	"\t\trefreshSymbolSizes: refreshSymbolSizes, refreshValueColors: refreshValueColors,\n" +
	"\t\trefreshLabelText: refreshLabelText, renderLabelsLegend: renderLabelsLegend,\n" +
	"\t\tinpExportDocument: inpExportDocument, inpExportOptions: inpExportOptions,\n" +
	"\t\teffectiveTimes: effectiveTimes, frictionMethod: frictionMethod,\n" +
	"\t\tsetScenarioSetting: setScenarioSetting, setScenarioView: setScenarioView,\n" +
	"\t\tcurrentView: currentView, applyView: applyView,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tcolorLegend: function () { return colorLegendBox; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n",
	null, BLIND ? blind : undefined
);
setUnitSet('us');
L.buildLayers();
L.setCanvas(1000, 700);
L.seedDefaultInputs();

// The stub's element tree, as text: tag, attributes, text, style, children. Functions, the
// parent pointer and the listener table are not drawing.
const SKIP = new Set(['children', 'parentNode', 'classList', 'style', '_listeners', 'dataset', '_owner',
	'nodeName', 'nodeType', 'tagName', '_tag', '_svg', 'ownerDocument']);
function dump(e, depth) {
	if (!e || depth > 60) { return ''; }
	if (e.nodeType === 3) { return JSON.stringify(e.textContent || e._text || ''); }
	const attrs = Object.keys(e).filter((k) => !SKIP.has(k) && typeof e[k] !== 'function' &&
		(e[k] === null || typeof e[k] !== 'object')).sort().map((k) => k + '=' + JSON.stringify(e[k]));
	const st = e.style && e.style._props ? JSON.stringify(Object.keys(e.style).filter((k) => k !== '_props' && typeof e.style[k] !== 'function').sort().map((k) => [k, e.style[k]]).concat(Object.keys(e.style._props).sort().map((k) => [k, e.style._props[k]]))) : '';
	return '<' + (e._tag || e.tagName) + ' ' + attrs.join(' ') + ' ' + st + '>' +
		(e.children || []).map((c) => dump(c, depth + 1)).join('') + '</>';
}
const tick = () => new Promise((r) => setTimeout(r, 0));
async function settle() { for (let i = 0; i < 6; i++) { await tick(); } }

async function fingerprint() {
	L.buildDom();
	L.refreshSymbolSizes();
	L.refreshValueColors();
	const model = L.assembleModel();
	let result;
	try { result = global.EngCalcs.lpnSolve(model, { tol: L.solveAccuracy() }); } catch (err) { result = { threw: String(err) }; }
	L.applySolveResult(result);
	L.refreshLabelText();
	L.renderLabelsLegend();
	await settle();
	const ex = global.EngCalcs.lpnExportInp(L.inpExportDocument(), L.inpExportOptions());
	return {
		map: dump(document.getElementById('lpn_canvas'), 0),
		legends: dump(document.getElementById('lpn_labels_legend'), 0) + dump(L.colorLegend(), 0),
		model: JSON.stringify(model),
		solve: JSON.stringify(result),
		accuracy: L.solveAccuracy(),
		times: JSON.stringify(L.effectiveTimes() || null),
		inp: ex && ex.ok ? ex.inp : 'refused: ' + (ex && ex.detail)
	};
}

const exampleFiles = fs.readdirSync(ROOT + 'examples/').filter((f) => /\.lwn$/.test(f)).sort();
function open(name) {
	L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + name, 'utf8')));
	L.buildDom();
}
// The scenarios that existed before stage 3, none holding a setting of its own.
function addPlainScenarios() {
	const plain = L.createScenario('Plain');
	const busy = L.createScenario('Busy');
	busy.demandMultiplier = 1.5;
	busy.times = { duration: 0 };
	const pipe = L.getDoc().links.filter((l) => l.type === 'pipe')[0];
	if (pipe) { L.setProp(pipe, 'diameter', (pipe.diameter || 6) * 2); }
	L.switchScenario(L.baseScenario().id);
	return [plain.id, busy.id];
}
// Turn on what an ordinary project has off, IN THE PROJECT, so the colour, contour and label
// readers all have something to draw.
function dressProject() {
	const S = L.getSettings(), LS = L.getLabelSettings();
	S.colorNodeField = 'pressure'; S.colorLinkField = 'velocity';
	S.contourFill = 'smooth'; S.contourLines = true;
	LS.node.pressure = true; LS.link.flow = true;
}

async function sweep() {
	const out = {};
	for (const f of exampleFiles) {
		for (const dressed of [false, true]) {
			open(f);
			if (dressed) { dressProject(); }
			const ids = [L.baseScenario().id].concat(addPlainScenarios());
			for (const id of ids) {
				L.switchScenario(id);
				out[f + (dressed ? ' (coloured, contoured, labelled)' : '') + ' / ' + (L.activeScenario().name || 'Base')] = await fingerprint();
			}
		}
	}
	return out;
}

// One scenario holding one value of each kind, written by hand as a file would carry it.
function holdOverrides(scn) {
	L.setScenarioSetting(scn, 'settings.textSize', 31);
	L.setScenarioSetting(scn, ['labelSettings', 'node', 'head'], true);
	L.setScenarioSetting(scn, 'settings.hydraulics.accuracy', 1e-4);
	L.setScenarioSetting(scn, 'settings.hydraulics.viscosity', 2);
	// Darcy-Weisbach in a Hazen-Williams project: each pipe's roughness number is REINTERPRETED as
	// a DW roughness, never converted (Tom, 2026-10-06).
	L.setScenarioSetting(scn, 'settings.method', 'dw');
	L.setScenarioSetting(scn, 'settings.reactions.globalBulk', -0.7);
	L.setScenarioSetting(scn, 'times.patternStep', 1800);
	L.setScenarioSetting(scn, ['times', 'text', 'patternStep'], '0:30');
}

if (BLIND && process.env.LPN_SEAM_OVERRIDE === '1') {
	(async function () {
		// The same history as the parent's section 2 (labels remember the layout they came from).
		await sweep();
		open('Net1.lwn');
		const scn = L.createScenario('Figure');
		holdOverrides(scn);
		const fp = await fingerprint();
		process.stdout.write(JSON.stringify(fp));
	}());
} else if (BLIND) {
	sweep().then((o) => { process.stdout.write(JSON.stringify(o)); });
} else {
	(async function () {
		let fails = 0;
		const ok = (name, cond, extra) => {
			console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined || cond ? '' : '   ' + extra));
			if (!cond) { fails++; }
		};
		const runBlind = (extraEnv) => JSON.parse(execFileSync(process.execPath, [__filename], {
			env: Object.assign({}, process.env, { LPN_SEAM_BLIND: '1' }, extraEnv || {}),
			maxBuffer: 1 << 30
		}).toString());

		console.log('\n--- 1. no setting override: the routed page is the page it was ---');
		const real = await sweep();
		const was = runBlind();
		const keys = Object.keys(real);
		ok('the same cases ran both ways (' + keys.length + ': ' + exampleFiles.length +
			' examples, plain and dressed, in Base and two scenarios)',
			keys.length === Object.keys(was).length && keys.length === exampleFiles.length * 2 * 3);
		keys.forEach(function (k) {
			const a = real[k], b = was[k] || {};
			const diff = Object.keys(a).filter((part) => String(a[part]) !== String(b[part]));
			ok(k + ': map, legends, model, solve and .inp byte-identical', !diff.length, diff.join(', '));
		});
		ok('...and the sweep really drew, solved and exported something',
			keys.every((k) => real[k].map.length > 1000 && real[k].inp.indexOf('[JUNCTIONS]') >= 0 && real[k].solve.length > 50));
		ok('...including colour and labels on the dressed cases',
			keys.filter((k) => k.indexOf('coloured') >= 0).every((k) => real[k].map !== real[k.replace(' (coloured, contoured, labelled)', '')].map));

		console.log('\n--- 2. a setting held by a scenario changes that scenario only ---');
		open('Net1.lwn');
		// Label placement remembers the layout it came from, so "Base is untouched" compares Base
		// after a round trip through the scenario holding nothing against Base after the same round
		// trip through it holding settings: the only difference between the two is the settings.
		const scn = L.createScenario('Figure');
		const plain = await fingerprint();
		L.switchScenario(L.baseScenario().id);
		const base0 = await fingerprint();
		L.switchScenario(scn.id);
		holdOverrides(scn);
		const own = await fingerprint();
		L.switchScenario(L.baseScenario().id);
		const base1 = await fingerprint();
		ok('Base is untouched by a scenario holding settings: map, legends, model, solve and .inp',
			['map', 'legends', 'model', 'solve', 'inp'].every((p) => base0[p] === base1[p]),
			['map', 'legends', 'model', 'solve', 'inp'].filter((p) => base0[p] !== base1[p]).join(', '));
		ok('Presentation: the scenario\'s map differs (text size and a head label)', own.map !== plain.map);
		ok('...its labels legend names the head field it turned on', own.legends !== plain.legends);
		ok('Calculation: the scenario solves to its own accuracy', own.accuracy === 1e-4 && plain.accuracy !== 1e-4, own.accuracy + ' vs ' + plain.accuracy);
		ok('...with its own viscosity in the solver\'s model', JSON.parse(own.model).visc === 1.007e-6 * 2 && JSON.parse(plain.model).visc !== JSON.parse(own.model).visc);
		ok('...under its own friction method, which the solver is handed', JSON.parse(own.model).method === 'dw' && JSON.parse(plain.model).method === 'hw');
		ok('...and the answer differs', own.solve !== plain.solve);
		const optLine = (inp, re) => (inp.split('\n').filter((l) => re.test(l))[0] || '').trim();
		ok('Export: [OPTIONS] states the scenario\'s viscosity', /\b2\b/.test(optLine(own.inp, /^\s*Viscosity/i)) && optLine(own.inp, /^\s*Viscosity/i) !== optLine(plain.inp, /^\s*Viscosity/i),
			optLine(own.inp, /^\s*Viscosity/i));
		ok('...[REACTIONS] its global bulk rate', /-0\.7/.test(optLine(own.inp, /^\s*Global\s+Bulk/i)), optLine(own.inp, /^\s*Global\s+Bulk/i));
		ok('...and [TIMES] its pattern step, as typed', /0:30/.test(optLine(own.inp, /^\s*Pattern\s+Timestep/i)), optLine(own.inp, /^\s*Pattern\s+Timestep/i));
		ok('...while Base\'s export states the project\'s own', !/0:30/.test(optLine(base1.inp, /^\s*Pattern\s+Timestep/i)) && !/-0\.7/.test(optLine(base1.inp, /^\s*Global\s+Bulk/i)));
		ok('the scenario runs on its own pattern clock', JSON.parse(own.times).patternStep === 1800 && JSON.parse(own.times).text.patternStep === '0:30');

		const blindOwn = runBlind({ LPN_SEAM_OVERRIDE: '1' });
		ok('red check: the blinded page does NOT see the scenario\'s settings, so section 1 is a real comparison',
			['map', 'legends', 'model', 'solve', 'inp'].every((p) => blindOwn[p] === plain[p]) && own.inp !== blindOwn.inp,
			['map', 'legends', 'model', 'solve', 'inp'].filter((p) => blindOwn[p] !== plain[p]).join(', '));

		console.log('\n--- 3. a scenario\'s own view ---');
		L.applyView({ cx: 50, cy: 40, s: 3 });
		const home = L.currentView();
		L.switchScenario(scn.id);
		ok('switching into a scenario that holds no view moves nothing', JSON.stringify(L.currentView()) === JSON.stringify(home));
		L.applyView({ cx: 20, cy: 60, s: 5 });
		const figView = L.currentView();
		L.setScenarioView(scn, figView);
		// The scale is held as ground metres per CSS pixel (Declan's advice), never as the drawing's
		// own pixels per unit, which means a different zoom in every frame.
		ok('the view is held outward, as a position override is, its scale in metres per pixel',
			scn.settings.view && scn.settings.view.mpp > 0 && scn.settings.view.s === undefined && typeof scn.settings.view.cx === 'number', JSON.stringify(scn.settings.view));
		L.switchScenario(L.baseScenario().id);
		L.applyView(home);
		L.switchScenario(scn.id);
		ok('switching into a scenario that holds a view goes there', Math.abs(L.currentView().cx - figView.cx) < 1e-9 && Math.abs(L.currentView().cy - figView.cy) < 1e-9 && Math.abs(L.currentView().s - 5) < 1e-9);
		L.switchScenario(L.baseScenario().id);
		ok('...and switching out returns to where you were looking', Math.abs(L.currentView().cx - home.cx) < 1e-9 && Math.abs(L.currentView().cy - home.cy) < 1e-9 && L.currentView().s === home.s);
		const text = JSON.stringify(L.serializeProject());
		L.applySaved(L.acceptImportedText(text));
		const back = L.getScenarios().filter((s) => s.name === 'Figure')[0];
		ok('...and the held view survives a save and reopen unchanged', back && JSON.stringify(back.settings.view) === JSON.stringify(scn.settings.view));

		console.log('\n' + (fails ? fails + ' FAILED' : 'ALL PASS'));
		process.exit(fails ? 1 : 0);
	}());
}
