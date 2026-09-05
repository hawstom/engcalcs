// **`[SOURCES]` AND `[MIXING]`, IMPLEMENTED** -- ROADMAP Task 579. Run with:
//
//   node dev/lpn-spike/source-mixing-harness.js
//
// A booster dose at a node and a tank's mixing model. Both were carried verbatim and never read:
// a file stating `[SOURCES] J1 SETPOINT 1.0` ran here with no chlorine entering at J1 at all, and
// every tank ran completely mixed whatever its file said. Tom, 2026-09-05, of the import note that
// disclosed exactly that: *"Why aren't we implementing this instead of shipping without it?"*
//
// **THE ONE ASSERTION THAT MATTERS MOST IS SECTION 4**, and it is there because of what Task 582
// shipped without for a session: data that is read, kept and written back perfectly, and reaches
// the engine THROUGH NOTHING. Writing the section is not implementing it. So the engine is run
// twice on the same network, once with the booster and once without, and the concentrations it
// reports must differ -- which no amount of correct file writing can fake.
//
// **AND THE ONE THAT IS EASIEST TO GET WRONG IS SECTION 1.** CLAUDE.md's rule is that import then
// export is BYTE-IDENTICAL for every value the user did not edit, not "within tolerance". The
// fixture below states `1.0`, `.75` and `0.35` deliberately: `String(parseFloat('1.0'))` is `'1'`,
// so a reader that keeps the number and not the TOKEN fails here and looks perfect everywhere else.

'use strict';

const { ROOT, byId, setUnitSet, loadLoopedNetwork, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-epanet.js');

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
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tassembleModel: assembleModel, dropText: inpDropText,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\tnodeById: nodeById,\n" +
	"\t\tpopupNode: function (id) { renderNodeFields(id); return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function head(t) { console.log('\n' + t); }
function textOf(el) {
	if (!el) { return ''; }
	let out = el.textContent || '';
	(el.children || []).forEach(c => { out += ' ' + textOf(c); });
	return out;
}
function sectionLines(text) {
	const out = {};
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(raw);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		if (!raw.replace(/;.*$/, '').trim()) { continue; }
		out[section].push(raw.replace(/\s+$/, ''));
	}
	return out;
}
function sectionCount(text, name) {
	return (text.match(new RegExp('^\\s*\\[' + name + '\\]', 'gm')) || []).length;
}

// A small network stating both sections, in the shapes that break a careless reader: a row with the
// type spelled out, a row with the type OMITTED (which EPANET reads as CONCEN), a row with a
// pattern on the end, and two tanks on two different mixing models, one of them with a fraction.
const FIXTURE = [
	'[TITLE]',
	'Booster and mixing fixture',
	'',
	'[JUNCTIONS]',
	' J1              \t100         \t50          \t;',
	' J2              \t90          \t25          \t;',
	'',
	'[RESERVOIRS]',
	' R1              \t200         \t;',
	'',
	'[TANKS]',
	' T1              \t150         \t5           \t0           \t20          \t40          \t0',
	' T2              \t150         \t5           \t0           \t20          \t40          \t0',
	'',
	'[PIPES]',
	' P1              \tR1          \tJ1          \t1000        \t12          \t100         \t0           \tOpen  ;',
	' P2              \tJ1          \tJ2          \t1000        \t12          \t100         \t0           \tOpen  ;',
	' P3              \tJ2          \tT1          \t1000        \t12          \t100         \t0           \tOpen  ;',
	' P4              \tJ2          \tT2          \t1000        \t12          \t100         \t0           \tOpen  ;',
	'',
	'[PATTERNS]',
	' PAT1            \t1.0         \t0.5         \t1.5         \t1.0',
	'',
	'[SOURCES]',
	' J1              \tSETPOINT    \t1.0         \tPAT1',
	' J2              \t.75',
	'',
	'[MIXING]',
	' T1              \tLIFO',
	' T2              \t2COMP       \t0.35',
	'',
	'[QUALITY]',
	' R1              \t0.6',
	'',
	'[OPTIONS]',
	' Units           \tGPM',
	' Headloss        \tH-W',
	' Quality         \tChlorine mg/L',
	'',
	'[COORDINATES]',
	' J1              \t10          \t10',
	' J2              \t20          \t10',
	' R1              \t0           \t10',
	' T1              \t30          \t20',
	' T2              \t30          \t0',
	'',
	'[END]',
	''
].join('\n');

const SRC = sectionLines(FIXTURE);

(async function () {

	// =============================================================================================
	head('1. The file is read, and its own characters come back out unchanged');
	// =============================================================================================
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'booster.inp', _text: FIXTURE });
	const doc = L.getDoc();

	// **READ ONTO THE ELEMENTS, WHICH IS WHAT MAKES IT AN IMPLEMENTATION RATHER THAN A CARRY.**
	const j1 = L.nodeById('J1'), j2 = L.nodeById('J2'), t1 = L.nodeById('T1'), t2 = L.nodeById('T2');
	ok('the booster at J1 reached the node', L.effective(j1, 'sourceQuality') === 1.0
		&& L.effective(j1, 'sourceType') === 'SETPOINT', String(L.effective(j1, 'sourceQuality')));
	ok('with its pattern, kept as a NAME rather than read as a number',
		L.effective(j1, 'sourcePattern') === 'PAT1', String(L.effective(j1, 'sourcePattern')));
	// EPANET's own reader takes the second token as a type only when it is one of the four keywords,
	// so `J2 .75` is a concentration source. Filling the word in is what lets the popup show a type.
	ok('a row with no type named reads as CONCEN, which is EPANET\'s own rule',
		L.effective(j2, 'sourceType') === 'CONCEN' && L.effective(j2, 'sourceQuality') === 0.75);
	ok('T1\'s mixing model reached the tank', t1.mixingModel === 'LIFO', String(t1.mixingModel));
	ok('T2\'s model and its compartment fraction did too',
		t2.mixingModel === '2COMP' && t2.mixingFraction === 0.35,
		t2.mixingModel + '/' + t2.mixingFraction);
	ok('a node the file names no source for states none',
		L.effective(L.nodeById('R1'), 'sourceQuality') === undefined);

	// **THE BYTE-IDENTICAL ROUND TRIP.** CLAUDE.md: not "within tolerance" -- identical.
	const out1 = L.export();
	ok('the project exports', out1.ok === true, out1 && out1.error);
	const back1 = sectionLines(out1.inp);
	ok('[SOURCES] is written back character for character, `.75` and `1.0` included',
		back1.SOURCES.join('\n') === SRC.SOURCES.join('\n'),
		JSON.stringify(back1.SOURCES));
	ok('and so is [MIXING], `0.35` included',
		back1.MIXING.join('\n') === SRC.MIXING.join('\n'), JSON.stringify(back1.MIXING));

	// =============================================================================================
	head('2. Each section appears exactly once in an export, and in EPANET\'s own order');
	// =============================================================================================
	// LPN_CARRIED_PLACED is the other half of the move: the exporter puts both where EPANET's own
	// writer does, and `carriedRest()` must NOT then write a second copy after the options.
	ok('[SOURCES] appears exactly once', sectionCount(out1.inp, 'SOURCES') === 1,
		String(sectionCount(out1.inp, 'SOURCES')));
	ok('[MIXING] appears exactly once', sectionCount(out1.inp, 'MIXING') === 1,
		String(sectionCount(out1.inp, 'MIXING')));
	ok('[SOURCES] sits between [QUALITY] and [MIXING], where EPANET\'s writer puts it',
		out1.inp.indexOf('[QUALITY]') < out1.inp.indexOf('[SOURCES]')
		&& out1.inp.indexOf('[SOURCES]') < out1.inp.indexOf('[MIXING]'));
	ok('and both sit before [OPTIONS], not in the carried tail after it',
		out1.inp.indexOf('[MIXING]') < out1.inp.indexOf('[OPTIONS]'));

	// =============================================================================================
	head('3. Save and reopen agrees with a fresh import, which is the two-doors rule');
	// =============================================================================================
	// readSourceMixingSections() is called from docFromInp() AND from the saved-project reader, the
	// way readQualitySections() and readEnergySection() are, so the doors cannot disagree.
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	L.applySaved(L.migrateSaved(saved));
	const reopened = L.export();
	const back2 = sectionLines(reopened.inp);
	ok('a reopened project states the same [SOURCES]',
		back2.SOURCES.join('\n') === SRC.SOURCES.join('\n'), JSON.stringify(back2.SOURCES));
	ok('and the same [MIXING]', back2.MIXING.join('\n') === SRC.MIXING.join('\n'),
		JSON.stringify(back2.MIXING));
	ok('the reopened booster is still on its node',
		L.effective(L.nodeById('J1'), 'sourceQuality') === 1.0
		&& L.effective(L.nodeById('J1'), 'sourcePattern') === 'PAT1');
	ok('and the reopened tank still knows how it mixes',
		L.nodeById('T2').mixingModel === '2COMP' && L.nodeById('T2').mixingFraction === 0.35);

	// **A PROJECT SAVED BEFORE THIS TASK**, which is the case the once-only read exists for: carried
	// text, no record on the setting, nothing on any node.
	const legacy = JSON.parse(JSON.stringify(saved));
	delete legacy.settings.sources; delete legacy.settings.mixing;
	legacy.nodes.forEach((n) => {
		delete n._sourceType; delete n._sourceQuality; delete n._sourcePattern;
		delete n.mixingModel; delete n.mixingFraction;
	});
	L.applySaved(L.migrateSaved(legacy));
	ok('a project saved while both were carried text gains its booster on open',
		L.effective(L.nodeById('J1'), 'sourceQuality') === 1.0);
	ok('and its tank mixing models', L.nodeById('T1').mixingModel === 'LIFO');
	ok('and still exports the file\'s own characters',
		sectionLines(L.export().inp).SOURCES.join('\n') === SRC.SOURCES.join('\n'));

	// =============================================================================================
	head('4. THE ENGINE HONOURS THEM: the same network answers differently with the booster');
	// =============================================================================================
	// **THE ASSERTION THAT PROVES IT IS IMPLEMENTED RATHER THAN WRITTEN.** Task 582 kept its data,
	// wrote it back perfectly and reached the engine through nothing at all, for a whole session.
	await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);

	// SI throughout, which is what a model handed to js/lpn-epanet.js always is. A reservoir holding
	// nothing, so the ONLY chlorine in the network is what the booster at B adds.
	function boosterCase(source) {
		const nodes = [
			{ id: 'R', type: 'reservoir', head: 100, elev: 0, initQuality: 0 },
			{ id: 'B', type: 'junction', elev: 0, demand: 0.0005, demandBase: 0.0005 },
			{ id: 'D', type: 'junction', elev: 0, demand: 0.010, demandBase: 0.010 }
		];
		if (source) { nodes[1].source = source; }
		return EngCalcs.lpnEpanetRun({
			nodes: nodes,
			links: [
				{ id: 'P1', type: 'pipe', from: 'R', to: 'B', length: 500, diameter: 0.3, roughness: 130, k: 0, status: 'open' },
				{ id: 'P2', type: 'pipe', from: 'B', to: 'D', length: 500, diameter: 0.3, roughness: 130, k: 0, status: 'open' }
			],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			quality: { mode: 'chemical', chemical: 'Chlorine mg/L', tolerance: 1e-8 },
			reactions: { orderBulk: 1, orderWall: 1, globalBulk: 0, globalWall: 0 },
			time: {
				times: {
					duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 60
				},
				patterns: [], controls: [], warnings: []
			}
		});
	}
	const without = await boosterCase(null);
	const with1 = await boosterCase({ type: 'SETPOINT', quality: 1.0, pattern: null });
	ok('both runs completed', without.ok && with1.ok,
		String((without.engineError || '') + ' ' + (with1.engineError || '')));
	if (without.ok && with1.ok) {
		const q0 = without.frames[without.frames.length - 1].qualities.D;
		const q1 = with1.frames[with1.frames.length - 1].qualities.D;
		ok('with no booster the far end has no chlorine at all', Math.abs(q0) < 1e-6, String(q0));
		// A SETPOINT booster raises the water leaving B to 1.0 and no further; nothing decays it on
		// the way, so the far end reads 1.0. That is EPANET's arithmetic, not ours.
		ok('with the booster it reads the setpoint the document states',
			Math.abs(q1 - 1.0) < 1e-3, String(q1));
		ok('so the engine really honours the section, which is what "implemented" means',
			Math.abs(q1 - q0) > 0.5, q0.toFixed(6) + ' against ' + q1.toFixed(6));
	}
	// **AND THE DOSE IS THE DOCUMENT'S OWN NUMBER**, not a constant that happens to be 1.
	const half = await boosterCase({ type: 'SETPOINT', quality: 0.4, pattern: null });
	ok('a different setpoint gives a different answer', half.ok
		&& Math.abs(half.frames[half.frames.length - 1].qualities.D - 0.4) < 1e-3,
		half.ok ? String(half.frames[half.frames.length - 1].qualities.D) : half.engineError);

	// **AND THE PATTERN ON THE DOSE IS HONOURED, WHICH IS THE PIECE MOST EASILY DROPPED IN SILENCE.**
	// A pattern id is a NAME, and a reader that ran it through parseFloat, a writer that omitted the
	// fourth token, or an input whose [PATTERNS] came after [SOURCES] all produce a booster running
	// flat out around the clock -- a plausible answer, on every screen, for the wrong reason.
	function patternCase(pattern) {
		return EngCalcs.lpnEpanetRun({
			nodes: [
				{ id: 'R', type: 'reservoir', head: 100, elev: 0, initQuality: 0 },
				{
					id: 'B', type: 'junction', elev: 0, demand: 0.0005, demandBase: 0.0005,
					source: { type: 'SETPOINT', quality: 1.0, pattern: pattern }
				},
				{ id: 'D', type: 'junction', elev: 0, demand: 0.010, demandBase: 0.010 }
			],
			links: [
				{ id: 'P1', type: 'pipe', from: 'R', to: 'B', length: 50, diameter: 0.3, roughness: 130, k: 0, status: 'open' },
				{ id: 'P2', type: 'pipe', from: 'B', to: 'D', length: 50, diameter: 0.3, roughness: 130, k: 0, status: 'open' }
			],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			quality: { mode: 'chemical', chemical: 'Chlorine mg/L', tolerance: 1e-8 },
			reactions: { orderBulk: 1, orderWall: 1, globalBulk: 0, globalWall: 0 },
			time: {
				times: {
					duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 60
				},
				patterns: [{ id: 'SRCPAT', multipliers: [1, 0, 1, 0] }], controls: [], warnings: []
			}
		});
	}
	const onPattern = await patternCase('SRCPAT');
	const flatOut = await patternCase(null);
	ok('both pattern runs completed', onPattern.ok && flatOut.ok,
		String((onPattern.engineError || '') + ' ' + (flatOut.engineError || '')));
	if (onPattern.ok && flatOut.ok) {
		const q = onPattern.frames.slice(1, 7).map(f => f.qualities.D);
		const f = flatOut.frames.slice(1, 7).map(f2 => f2.qualities.D);
		// The pattern is 1, 0, 1, 0 on an hourly step, so the far end alternates full dose and none.
		ok('a source on a pattern switches off in the hours the pattern says 0',
			q.some(v => v > 0.9) && q.some(v => v < 0.1),
			q.map(v => v.toFixed(3)).join(' '));
		ok('and the same booster with no pattern runs flat out, which is the control case',
			f.every(v => v > 0.9), f.map(v => v.toFixed(3)).join(' '));
	}

	// **THE MIXING MODEL MOVES A NUMBER TOO.** A tank on a two-compartment model with a small inlet
	// zone turns that zone over far faster than a completely mixed tank turns over the whole tank,
	// so the chlorine in the tank's water climbs on a different curve.
	function tankCase(mixing) {
		const t = {
			id: 'T', type: 'tank', elev: 30, level: 5, minLevel: 0, maxLevel: 12,
			diameter: 15, initQuality: 0
		};
		if (mixing) { t.mixing = mixing; }
		return EngCalcs.lpnEpanetRun({
			nodes: [
				{ id: 'R', type: 'reservoir', head: 60, elev: 0, initQuality: 1 },
				{ id: 'J', type: 'junction', elev: 0, demand: 0.0005, demandBase: 0.0005 },
				t
			],
			links: [
				{ id: 'P1', type: 'pipe', from: 'R', to: 'J', length: 300, diameter: 0.3, roughness: 130, k: 0, status: 'open' },
				{ id: 'P2', type: 'pipe', from: 'J', to: 'T', length: 300, diameter: 0.3, roughness: 130, k: 0, status: 'open' }
			],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			quality: { mode: 'chemical', chemical: 'Chlorine mg/L', tolerance: 1e-8 },
			reactions: { orderBulk: 1, orderWall: 1, globalBulk: 0, globalWall: 0 },
			time: {
				times: {
					duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 60
				},
				patterns: [], controls: [], warnings: []
			}
		});
	}
	const mixed = await tankCase(null);
	const twoComp = await tankCase({ model: '2COMP', fraction: 0.05 });
	ok('both tank runs completed', mixed.ok && twoComp.ok,
		String((mixed.engineError || '') + ' ' + (twoComp.engineError || '')));
	if (mixed.ok && twoComp.ok) {
		const a = mixed.frames.map(f => f.qualities.T), b = twoComp.frames.map(f => f.qualities.T);
		let biggest = 0, at = 0;
		a.forEach((v, i) => {
			if (Math.abs(v - b[i]) > biggest) { biggest = Math.abs(v - b[i]); at = i; }
		});
		ok('a two-compartment tank fills differently from a completely mixed one',
			biggest > 0.01, 'largest difference ' + biggest.toFixed(4) + ' mg/L at frame ' + at);
	}

	// **THE ENGINE INPUT ITSELF**, read rather than inferred from the answers.
	const engineInp = EngCalcs.lpnToInp({
		nodes: [
			{ id: 'R', type: 'reservoir', head: 10, elev: 0 },
			{
				id: 'B', type: 'junction', elev: 0, demand: 0.01,
				source: { type: 'MASS', quality: 12, pattern: 'PAT1' }
			},
			{
				id: 'T', type: 'tank', elev: 5, level: 3, minLevel: 0, maxLevel: 10, diameter: 12,
				mixing: { model: '2COMP', fraction: 0.35 }
			}
		],
		links: [
			{ id: 'P1', type: 'pipe', from: 'R', to: 'B', length: 100, diameter: 0.2, roughness: 130, k: 0, status: 'open' },
			{ id: 'P2', type: 'pipe', from: 'B', to: 'T', length: 100, diameter: 0.2, roughness: 130, k: 0, status: 'open' }
		],
		method: 'hw',
		quality: { mode: 'chemical', chemical: 'Chlorine mg/L' },
		reactions: { bulk: {}, wall: {}, tank: {} }
	}).inp;
	ok('the engine input states the booster, its type and its pattern',
		/\[SOURCES\]\n B  MASS  12  PAT1/.test(engineInp),
		JSON.stringify(sectionLines(engineInp).SOURCES));
	ok('and the tank\'s mixing model and fraction',
		/\[MIXING\]\n T  2COMP  0.35/.test(engineInp),
		JSON.stringify(sectionLines(engineInp).MIXING));
	// A hydraulics-only run gets exactly the input it always got: a mixing model means nothing
	// without a quality analysis, and a source means nothing without a chemical.
	const plainInp = EngCalcs.lpnToInp({
		nodes: [
			{ id: 'R', type: 'reservoir', head: 10, elev: 0 },
			{ id: 'B', type: 'junction', elev: 0, demand: 0.01, source: { type: 'MASS', quality: 12 } },
			{
				id: 'T', type: 'tank', elev: 5, level: 3, minLevel: 0, maxLevel: 10, diameter: 12,
				mixing: { model: 'LIFO' }
			}
		],
		links: [{ id: 'P1', type: 'pipe', from: 'R', to: 'B', length: 100, diameter: 0.2, roughness: 130, k: 0, status: 'open' }],
		method: 'hw', quality: {}, reactions: { bulk: {}, wall: {}, tank: {} }
	}).inp;
	ok('a run with no water-quality analysis states neither section',
		!/\[SOURCES\]/.test(plainInp) && !/\[MIXING\]/.test(plainInp));
	// An AGE run states no source -- there is no species to add -- but DOES state the mixing model,
	// because how long a parcel sits in a tank is exactly what a water age measures.
	const ageInp = EngCalcs.lpnToInp({
		nodes: [
			{ id: 'R', type: 'reservoir', head: 10, elev: 0 },
			{ id: 'B', type: 'junction', elev: 0, demand: 0.01, source: { type: 'MASS', quality: 12 } },
			{
				id: 'T', type: 'tank', elev: 5, level: 3, minLevel: 0, maxLevel: 10, diameter: 12,
				mixing: { model: 'LIFO' }
			}
		],
		links: [{ id: 'P1', type: 'pipe', from: 'R', to: 'B', length: 100, diameter: 0.2, roughness: 130, k: 0, status: 'open' }],
		method: 'hw', quality: { mode: 'age' }, reactions: { bulk: {}, wall: {}, tank: {} }
	}).inp;
	ok('a water-age run states the mixing model and no source',
		/\[MIXING\]\n T  LIFO/.test(ageInp) && !/\[SOURCES\]/.test(ageInp));

	// =============================================================================================
	head('5. The controls, and the write seam each of them goes through');
	// =============================================================================================
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'booster.inp', _text: FIXTURE });
	const n1 = L.nodeById('J1'), tk = L.nodeById('T2');
	const junctionPopup = textOf(L.popupNode('J1'));
	ok('the node popup asks for the source type', junctionPopup.indexOf('Source type') >= 0);
	ok('and for its strength, in the unit the document names beside the chemical',
		junctionPopup.indexOf('Source quality (mg/L)') >= 0);
	ok('and for a pattern to run it on', junctionPopup.indexOf('Source pattern') >= 0);
	// EPANET's own four types, by EPANET's own names. An engineer choosing between them is choosing
	// between four real pieces of equipment.
	ok('all four EPANET source types are offered',
		junctionPopup.indexOf('Mass booster') >= 0 && junctionPopup.indexOf('Setpoint booster') >= 0
		&& junctionPopup.indexOf('Flow paced booster') >= 0
		&& junctionPopup.indexOf('Concentration') >= 0);
	const tankPopup = textOf(L.popupNode('T2'));
	ok('the tank popup asks how the tank mixes', tankPopup.indexOf('Mixing model') >= 0);
	ok('with EPANET\'s own four models', tankPopup.indexOf('Complete mixing') >= 0
		&& tankPopup.indexOf('Two compartment mixing') >= 0
		&& tankPopup.indexOf('FIFO plug flow') >= 0 && tankPopup.indexOf('LIFO plug flow') >= 0);
	ok('and, this tank being two-compartment, for the fraction that only that model uses',
		tankPopup.indexOf('Mixing fraction') >= 0);
	ok('a tank on any other model is not asked for a fraction it cannot use',
		textOf(L.popupNode('T1')).indexOf('Mixing fraction') < 0, L.nodeById('T1').mixingModel);

	// **THE SEAM.** A dose is overridable, so a scenario's own dose must not edit Base -- the
	// failure dev/scenario-seam-repair.md records, which looks perfect on screen.
	L.setProp(n1, 'sourceQuality', 1.2);
	const scn = L.createScenario('Winter dosing');
	L.switchScenario(scn.id);
	L.setProp(n1, 'sourceQuality', 0.8);
	L.setProp(n1, 'sourceType', 'FLOWPACED');
	ok('the scenario sees its own dose', L.effective(n1, 'sourceQuality') === 0.8
		&& L.effective(n1, 'sourceType') === 'FLOWPACED');
	ok('and BASE still holds 1.2, which is the whole point of the seam',
		n1._sourceQuality === 1.2 && n1._sourceType === 'SETPOINT');
	ok('the model built inside the scenario carries the scenario\'s dose',
		L.assembleModel().nodes.filter(n => n.id === 'J1')[0].source.quality === 0.8);
	ok('and an export from inside the scenario states it',
		sectionLines(L.export().inp).SOURCES.join('\n').indexOf('0.8') >= 0,
		JSON.stringify(sectionLines(L.export().inp).SOURCES));
	L.switchScenario('base');
	ok('back in Base, Base\'s own dose', L.effective(n1, 'sourceQuality') === 1.2);

	// **AND THE OTHER RULING: A MIXING MODEL IS NOT OVERRIDABLE.** It describes how the tank is
	// plumbed, and it sits with the tank's elevation, levels and diameter, every one of which is
	// Base-owned. Asserted the only way it can be from outside -- it is not on the whitelist, so it
	// has no underscored twin and setProp() would have nowhere to record one.
	ok('the mixing model is not an overridable property',
		tk.mixingModel === '2COMP' && tk._mixingModel === undefined);

	// **A BLANK STRENGTH IS NOT A ZERO.** A blank says this node is not a source; a zero says a feed
	// is running and adding nothing, and EPANET writes those two as no line and as a line.
	L.setProp(n1, 'sourceQuality', undefined);
	ok('clearing the strength takes the node out of [SOURCES] entirely',
		(sectionLines(L.export().inp).SOURCES || []).join('\n').indexOf('J1') < 0,
		JSON.stringify(sectionLines(L.export().inp).SOURCES));
	L.setProp(n1, 'sourceQuality', 0);
	ok('and typing a zero puts it back, stating zero',
		/J1\s+\S+\s+0\b/.test((sectionLines(L.export().inp).SOURCES || []).join('\n')),
		JSON.stringify(sectionLines(L.export().inp).SOURCES));

	// =============================================================================================
	head('6. The import report no longer says the page cannot work them out');
	// =============================================================================================
	// Carrying a thing and telling the user about it are two jobs (Task 248.03's lesson). The
	// sentence is part of the change, not a follow-up: it stood saying "this page does not work out
	// either of those yet" and "every tank is treated as completely mixed", and both went false.
	const note = L.dropText('sources') || '';
	ok('the sentence for these two sections says they are used',
		note.indexOf('does not work out') < 0 && note.indexOf('completely mixed') < 0,
		note.slice(0, 90));
	ok('and it is the same sentence for both codes', L.dropText('mixing') === note);

	console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'ALL PASS'));
	process.exit(fails ? 1 : 0);

}());
