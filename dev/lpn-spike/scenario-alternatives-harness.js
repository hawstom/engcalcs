// Headless check of the SCENARIO ALTERNATIVES model -- dev/scenario-alternatives.md.
//
//   node dev/lpn-spike/scenario-alternatives-harness.js
//
// Tom, 2026-09-30, the spec: Base is the only scenario parent; every category has a Base
// alternative and Base uses them all; a scenario uses them too "until the moment it gets a property
// local value", which creates its own child of that category's Base alternative. His example:
// "In scenario Peak Hour, I change a Base Demand. This triggers the creation of a Peak Hour demand
// alternative child of the Base demand alternative."
//
// The model is DERIVED from the overrides (choice A in the doc), so what can go wrong is silent:
//   1. a property nobody gave a category (it would quietly fall into User data);
//   2. the derived tree disagreeing with what effective() reads -- the whole claim of choice A;
//   3. the API mutating the overrides it reads, or a new key reaching the saved file.
// Each section below asks one of those, on the real page code (the lpn-dom-stub.js technique).

const { ROOT, setUnitSet, loadLoopedNetwork, ensure } = require('./lpn-dom-stub.js');
// Read from the real lib/lang.ec.en.php the stub loads (dev/scripts/harness_wording_check.php).
const PC = global.EngCalcs.pageConfig;
const fs = require('fs');

let promptAnswer = 'Peak Hour';
global.prompt = global.window.prompt = function () { return promptAnswer; };
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\teffective: effective, setProp: setProp, setOverride: setOverride, clearOverride: clearOverride,\n" +
	"\t\tovKey: ovKey, createScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tdeleteScenario: deleteScenario, activeScenario: activeScenario, baseScenario: baseScenario,\n" +
	"\t\tserializeProject: serializeProject, projectFileText: projectFileText, applySaved: applySaved,\n" +
	"\t\tacceptImportedText: acceptImportedText, buildDom: buildDom,\n" +
	"\t\tOVERRIDABLE: LPN_OVERRIDABLE, CATS: LPN_ALT_CATEGORIES, CATEGORY_OF: LPN_ALT_CATEGORY_OF,\n" +
	"\t\tcategoryOf: categoryOf, alternativesOf: alternativesOf, alternativeFor: alternativeFor,\n" +
	"\t\tallAlternatives: allAlternatives, resolveThroughAlternatives: resolveThroughAlternatives,\n" +
	"\t\talternativeOverrides: alternativeOverrides,\n" +
	"\t\tSETTING_CATEGORY_OF: LPN_SETTING_CATEGORY_OF, settingFor: settingFor, effectiveSetting: effectiveSetting,\n" +
	"\t\tsetScenarioSetting: setScenarioSetting, overrideCount: overrideCount,\n" +
	"\t\tgetSettings: function () { return settings; }, getProject: function () { return project; },\n" +
	"\t\tscenarioMenuRows: scenarioMenuRows, openAlternativesBox: openAlternativesBox,\n" +
	"\t\taltBoxIsOpen: altBoxIsOpen, wireAlternativesBox: wireAlternativesBox,\n" +
	"\t\tbasicMode: function () { return scenarioBasicMode; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
// Key order is not meaning: the rebuilt map is assembled category by category.
function canon(o) { return o === undefined ? 'undefined' : JSON.stringify(Object.keys(o).sort().map(function (k) { return [k, o[k]]; })); }

// ---------------------------------------------------------------------------
// 1. Every overridable property is in exactly one category, and no mapping is stale
// ---------------------------------------------------------------------------
console.log('\n--- every overridable property has a category ---');
{
	const missing = [], stale = [], badCat = [];
	Object.keys(L.OVERRIDABLE).forEach(function (g) {
		Object.keys(L.OVERRIDABLE[g]).forEach(function (p) {
			if (!has(L.CATEGORY_OF[g] || {}, p)) { missing.push(g + '.' + p); }
		});
	});
	Object.keys(L.CATEGORY_OF).forEach(function (g) {
		Object.keys(L.CATEGORY_OF[g]).forEach(function (p) {
			if (!has(L.OVERRIDABLE[g] || {}, p)) { stale.push(g + '.' + p); }
			if (L.CATS.indexOf(L.CATEGORY_OF[g][p]) < 0) { badCat.push(g + '.' + p); }
		});
	});
	ok('every LPN_OVERRIDABLE property is named in LPN_ALT_CATEGORY_OF', !missing.length, missing.join(', '));
	ok('...and nothing is named there that is not overridable', !stale.length, stale.join(', '));
	ok('...and every category named is a declared category', !badCat.length, badCat.join(', '));
	ok('a custom property is User data', L.categoryOf('custom_owner', 'link') === 'userdata');
	ok('a node\'s active is topology, a Text\'s is not',
		L.categoryOf('active', 'node') === 'topology' && L.categoryOf('active', 'label') === 'text');
}

// A small network: R1 -L1- J1 -L2- J2, a pump-free line, plus one Text.
const r = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 100, 0);
const j2 = L.addNode('junction', 200, 0);
const l1 = L.addLink('pipe', r.id, j1.id);
const l2 = L.addLink('pipe', j1.id, j2.id);
L.setProp(j1, 'demand', 100);
L.setProp(j2, 'demand', 50);

// ---------------------------------------------------------------------------
// 2. Base uses every Base alternative, and a fresh project has nothing else
// ---------------------------------------------------------------------------
console.log('\n--- Base uses all the Base alternatives ---');
{
	const alts = L.alternativesOf(L.baseScenario());
	ok('Base has one alternative per category', Object.keys(alts).length === L.CATS.length);
	ok('...and every one is the Base alternative', L.CATS.every(function (c) { return alts[c].isBase && alts[c].parent === null; }));
	ok('a project with only Base has exactly the Base alternatives', L.allAlternatives().length === L.CATS.length);
}

// ---------------------------------------------------------------------------
// 3. Tom's example: in Peak Hour, change a Base Demand
// ---------------------------------------------------------------------------
console.log('\n--- Peak Hour: one Demand child of Base Demand, and nothing else ---');
let peak;
{
	peak = L.createScenario('Peak Hour');
	let alts = L.alternativesOf(peak);
	ok('a new scenario uses every Base alternative until it has a value of its own',
		L.CATS.every(function (c) { return alts[c].isBase; }));
	ok('...even though it was seeded with the project\'s demand multiplier',
		L.allAlternatives().length === L.CATS.length);

	L.setProp(j2, 'demand', 180);
	alts = L.alternativesOf(peak);
	const d = alts.demand, all = L.allAlternatives(), extra = all.filter(function (a) { return !a.isBase; });
	ok('Peak Hour now uses its own Demand alternative', !d.isBase && d.scenario === peak.id);
	ok('...a child of the Base Demand alternative', d.parent === L.alternativeFor(L.baseScenario(), 'demand').id, d.parent);
	ok('...holding exactly the one value typed', d.count === 1 && d.values[L.ovKey(j2)].demand === 180);
	ok('every other category of Peak Hour is still Base\'s',
		L.CATS.filter(function (c) { return c !== 'demand'; }).every(function (c) { return alts[c].isBase; }));
	ok('the project holds exactly one alternative beyond the Base ones', extra.length === 1 && extra[0].id === d.id,
		extra.map(function (a) { return a.id; }).join(', '));
	const res = L.resolveThroughAlternatives(peak, j2, 'demand');
	ok('the chain resolves the demand in Peak Hour\'s Demand alternative', res.found && res.value === 180 && res.alternative.id === d.id);
	const res1 = L.resolveThroughAlternatives(peak, j1, 'demand');
	ok('...and an untouched junction falls through to Base (the element\'s own)', !res1.found && L.effective(j1, 'demand') === 100);

	// A description in the demand table (R-369) is the same category: still one alternative.
	const rows = L.effective(j2, 'demands');
	L.setProp(j2, 'demands', rows);
	ok('a whole-breakdown write stays in the same Demand alternative',
		L.allAlternatives().filter(function (a) { return !a.isBase; }).length === 1);

	// A pipe diameter is Physical: a second child appears, of a different Base alternative.
	L.setProp(l2, 'diameter', 12);
	const p = L.alternativeFor(peak, 'physical');
	ok('a diameter makes a Physical child of Base Physical', !p.isBase && p.parent === L.alternativeFor(L.baseScenario(), 'physical').id);
	L.clearOverride(l2, 'diameter');
	ok('clearing the last Physical value makes that child vanish', L.alternativeFor(peak, 'physical').isBase);
	ok('...and leaves the Demand child standing', !L.alternativeFor(peak, 'demand').isBase);
}

// ---------------------------------------------------------------------------
// 4. The derived tree is exactly what effective() reads, in every scenario
// ---------------------------------------------------------------------------
// The claim of choice A, checked by substitution: effective() reads only the active scenario's
// override map for an element, so if the map rebuilt from the alternatives equals the stored one for
// every element in every scenario, routing effective() through the alternatives would change
// nothing anybody could observe.
console.log('\n--- the alternatives rebuild every override map exactly ---');
{
	const t = L.addText(50, 50);
	L.switchScenario('base');
	const s2 = L.createScenario('Everything');
	// One override of EVERY overridable property, on an element of the right group.
	const holder = { node: j1, link: l1, label: t };
	let written = 0;
	Object.keys(L.OVERRIDABLE).forEach(function (g) {
		if (!holder[g]) { return; }
		Object.keys(L.OVERRIDABLE[g]).forEach(function (p) {
			if (p === 'x' || p === 'y') { return; } // position has its own writer; covered below by setProp
			L.setOverride(holder[g], p, p === 'demands' ? [{ base: 7, pattern: '', category: 'x' }] : 1.5);
			written++;
		});
	});
	L.setProp(j2, 'x', 222);
	const s3 = L.createScenario('Only topology');
	L.setProp(l2, 'active', false);

	const els = L.getDoc().nodes.concat(L.getDoc().links, L.getDoc().labels);
	let mapsChecked = 0, mapBad = [], chainBad = [], effBad = [];
	const before = JSON.stringify(L.serializeProject());
	L.getScenarios().forEach(function (s) {
		L.switchScenario(s.id);
		els.forEach(function (el) {
			const stored = s.overrides[L.ovKey(el)];
			const rebuilt = L.alternativeOverrides(s, el);
			if (canon(stored) !== canon(rebuilt)) { mapBad.push(s.name + '/' + el.id); }
			mapsChecked++;
			Object.keys(stored || {}).forEach(function (p) {
				const r = L.resolveThroughAlternatives(s, el, p);
				// effective()'s own R-369 rule: once the whole breakdown is local, row 0's base is it.
				const want = (p === 'demand' && Array.isArray(stored.demands) && stored.demands.length) ? stored.demands[0].base : stored[p];
				if (!r.found || JSON.stringify(r.value) !== JSON.stringify(want)) { chainBad.push(s.name + '/' + el.id + '.' + p); }
				if (p !== 'x' && p !== 'y' && p !== 'demands' && JSON.stringify(L.effective(el, p)) !== JSON.stringify(r.value)) {
					effBad.push(s.name + '/' + el.id + '.' + p);
				}
			});
		});
	});
	ok('some overrides were written for every overridable property', written >= 25, String(written));
	ok('the rebuilt map equals the stored one, element by element, in every scenario', !mapBad.length,
		mapsChecked + ' maps; bad: ' + mapBad.join(', '));
	ok('the resolve chain finds every local value where the override map has it', !chainBad.length, chainBad.join(', '));
	ok('effective() reads the same value the chain resolves', !effBad.length, effBad.join(', '));
	ok('reading the alternatives changed nothing in the document', JSON.stringify(L.serializeProject()) === before);
	ok('the topology-only scenario has one child, in Asset activation',
		L.allAlternatives().filter(function (a) { return a.scenario === s3.id; }).map(function (a) { return a.category; }).join() === 'topology');
	const cats = L.allAlternatives().filter(function (a) { return a.scenario === s2.id; }).map(function (a) { return a.category; }).sort();
	// Presentation and Calculation hold settings, not element properties (section 7).
	ok('the everything scenario has a child in every element category but User data',
		cats.join() === L.CATS.filter(function (c) { return ['userdata', 'presentation', 'calculation'].indexOf(c) < 0; }).sort().join(), cats.join());
	L.deleteScenario(s2.id);
	ok('deleting a scenario takes its alternatives with it',
		!L.allAlternatives().some(function (a) { return a.scenario === s2.id; }));
	L.switchScenario('base');
}

// ---------------------------------------------------------------------------
// 5. Files: nothing new is stored, and every shipped example round-trips unchanged
// ---------------------------------------------------------------------------
console.log('\n--- no file changes ---');
{
	const saved = L.serializeProject();
	ok('the saved project carries no alternatives key', !has(saved, 'alternatives'));
	ok('...and no scenario does either', saved.scenarios.every(function (s) { return !has(s, 'alternatives'); }));
	const dir = ROOT + 'examples/';
	fs.readdirSync(dir).filter(function (f) { return /\.lwn$/.test(f); }).forEach(function (f) {
		const s = L.acceptImportedText(fs.readFileSync(dir + f, 'utf8'));
		L.applySaved(s);
		L.buildDom();
		const once = L.projectFileText();
		L.getScenarios().forEach(function (sc) { L.alternativesOf(sc); });
		L.allAlternatives();
		const again = L.projectFileText();
		const s2 = L.acceptImportedText(once);
		L.applySaved(s2);
		L.buildDom();
		ok(f + ': reading its alternatives changes no byte, and it round-trips unchanged',
			once === again && L.projectFileText() === once);
	});
}

// ---------------------------------------------------------------------------
// 6. Scenarios > Basic mode: ticked by default, a browser setting, and unticked shows the table
// ---------------------------------------------------------------------------
console.log('\n--- Basic mode ---');
{
	const s = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	L.applySaved(s);
	L.buildDom();
	const pk = L.createScenario('Peak Hour');
	L.setProp(L.getDoc().nodes.filter(function (n) { return n.type === 'junction'; })[0], 'demand', 999);
	// The page's markup, which the stub builds only on request (Looped-Network.php holds the real one).
	ensure('lpn_alt_box'); ensure('lpn_alt_report'); ensure('lpn_alt_close');
	L.wireAlternativesBox();
	function rows() { return L.scenarioMenuRows().filter(function (r) { return !r.separator; }); }
	function basicRow() { return rows().filter(function (r) { return r.label.indexOf(PC.lpn_scenario_basic) >= 0; })[0]; }
	function altRow() { return rows().filter(function (r) { return r.label === PC.lpn_alt_title; })[0]; }
	let store = null;
	try { store = global.localStorage.getItem('lpn_scnbasic'); } catch (e) {}
	ok('Basic mode is on for a browser that never touched it, and nothing is stored', L.basicMode() && store === null);
	ok('the Scenarios menu carries the row, ticked', basicRow() && basicRow().label.indexOf('✓') === 0);
	ok('...and no Alternatives row while it is ticked', !altRow());
	const fileBefore = L.projectFileText();
	basicRow().fn();
	ok('unticking it turns Basic mode off', !L.basicMode() && basicRow().label.indexOf('✓') !== 0);
	ok('...stored in the browser as off', global.localStorage.getItem('lpn_scnbasic') === 'off');
	ok('...and not in the project: the saved file is byte-identical', L.projectFileText() === fileBefore);
	ok('the Alternatives row appears', !!altRow());
	altRow().fn();
	ok('it opens the Alternatives box', L.altBoxIsOpen());
	const text = (function walk(el) { return (el.textContent || '') + (el.children || []).map(walk).join('|'); })(ensure('lpn_alt_report'));
	ok('the table names every category', L.CATS.every(function (c) { return text.indexOf(PC['lpn_alt_cat_' + c]) >= 0; }));
	ok('...and shows Peak Hour with its own Demand alternative of one value', text.indexOf(pk.name + ' (1)') >= 0);
	// Q7 (Tom, 2026-10-05): the demand multiplier, run time and time step are calculation options,
	// counted in the Calculation column; their own three columns retired with the Settings table.
	{
		const rowsOf = () => (function walkRows(el, out) { if (el.tagName === 'TR') { out.push(el); } (el.children || []).forEach(function (c) { walkRows(c, out); }); return out; })(ensure('lpn_alt_report'), []);
		const cells = (tr) => tr.children.map((c) => String(c.textContent || '').replace(/[^\x20-\x7e]/g, '').trim());
		const head = cells(rowsOf()[0]);
		ok('one column per category and nothing after them', head.length === L.CATS.length + 1, JSON.stringify(head));
		ok('...the last two headed Presentation and Calculation', head[head.length - 2] === PC.lpn_alt_cat_presentation &&
			head[head.length - 1] === PC.lpn_alt_cat_calculation, JSON.stringify(head.slice(-2)));
		ok('no input is left in the table', !(function walk(el) { return el.tagName === 'INPUT' || (el.children || []).some(walk); })(ensure('lpn_alt_report')));
		const CALC = head.length - 1;
		const seeded = L.createScenario('Seeded');
		const ownMult = L.createScenario('Max Day'); ownMult.demandMultiplier = 2;
		L.openAlternativesBox();
		const byName = {}; rowsOf().slice(1).forEach(function (tr) { byName[cells(tr)[0]] = cells(tr); });
		ok('a multiplier seeded equal to the project\'s counts nothing: Calculation is Base\'s',
			byName.Seeded && byName.Seeded[CALC] === PC.lpn_scenario_base, JSON.stringify(byName.Seeded));
		ok('a scenario with its own multiplier counts it in Calculation', byName['Max Day'] && byName['Max Day'][CALC] === 'Max Day (1)',
			JSON.stringify(byName['Max Day']));
		ok('...and that count is the number beside its name', L.overrideCount(ownMult) === 1, L.overrideCount(ownMult));
		L.deleteScenario(ownMult.id); L.deleteScenario(seeded.id);
	}
	basicRow().fn();
	ok('ticking it again removes the stored key and closes the box',
		L.basicMode() && global.localStorage.getItem('lpn_scnbasic') === null && !L.altBoxIsOpen());
}

// ---------------------------------------------------------------------------
// 7. Settings in scenarios: Presentation and Calculation (Tom, 2026-10-05)
// ---------------------------------------------------------------------------
// "any Setting that is stored in the project should be subject to scenario overrides under some
// alternatives category". What can go wrong silently: a key the project stores that no table names
// (it would vary by nothing, or by accident); a file changing because the store exists; a
// scenario's setting leaking into Base, or Base's object being written through the seam.
console.log('\n--- settings: every stored setting is named, once ---');
const fileOf = (name) => L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + name, 'utf8'));
const exampleFiles = fs.readdirSync(ROOT + 'examples/').filter(function (f) { return /\.lwn$/.test(f); });
{
	const CONTAINERS = ['settings', 'labelSettings', 'project', 'times'];
	const unnamed = new Set(), badCat = [];
	function walk(v, path) {
		if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length) {
			Object.keys(v).forEach(function (k) { walk(v[k], path.concat(k)); });
			return;
		}
		if (L.categoryOf(path, 'setting') === undefined) { unnamed.add(path.join('.')); }
	}
	function audit() {
		const snap = L.serializeProject();
		Object.keys(snap).forEach(function (k) {
			if (CONTAINERS.indexOf(k) >= 0) { walk(snap[k], [k]); }
			else if (L.categoryOf([k], 'setting') === undefined) { unnamed.add(k); }
		});
	}
	audit();
	exampleFiles.forEach(function (f) { L.applySaved(fileOf(f)); L.buildDom(); audit(); });
	Object.keys(L.SETTING_CATEGORY_OF).forEach(function (k) {
		const c = L.SETTING_CATEGORY_OF[k];
		if (c !== null && L.CATS.indexOf(c) < 0) { badCat.push(k + '=' + c); }
	});
	ok('every key a saved project carries has a category or an explicit exclusion (' + exampleFiles.length + ' examples and a fresh project)',
		!unnamed.size, [...unnamed].join(', '));
	ok('...and every category named is a declared category', !badCat.length, badCat.join(', '));
	ok('Presentation and Calculation each hold settings',
		['presentation', 'calculation'].every(function (c) { return Object.keys(L.SETTING_CATEGORY_OF).some(function (k) { return L.SETTING_CATEGORY_OF[k] === c; }); }));
	// Tom, 2026-10-06: "The one thing we refuse to do in the same project is let equations push
	// physical dimensions around (units and coordinates conversion)."
	ok('units and the coordinate frame may never vary by scenario; friction method may (a Calculation option)',
		L.categoryOf('units', 'setting') === null && L.categoryOf('units.lpn_u_flow', 'setting') === null &&
		L.categoryOf('origin', 'setting') === null && L.categoryOf('project.crs', 'setting') === null &&
		L.categoryOf('settings.method', 'setting') === 'calculation');
	ok('new-asset settings vary too, in the category of the property they seed',
		L.categoryOf('settings.defaults.diameter', 'setting') === 'physical' &&
		L.categoryOf('settings.defaults.demand', 'setting') === 'demand' &&
		L.categoryOf('settings.idPrefixes.J', 'setting') === 'physical');
	ok('a scenario\'s view is Presentation', L.categoryOf('view', 'setting') === 'presentation');
	ok('the longest named path wins: label values are Presentation, a reaction rate Constituent, tank staging excluded',
		L.categoryOf(['labelSettings', 'node', 'pressure'], 'setting') === 'presentation' &&
		L.categoryOf('settings.reactions.globalBulk', 'setting') === 'constituent' &&
		L.categoryOf('settings.reactions.tank', 'setting') === null &&
		L.categoryOf('settings.hydraulics.accuracy', 'setting') === 'calculation');
	ok('an element property\'s category is unchanged by the new group', L.categoryOf('demand', 'node') === 'demand');
}

console.log('\n--- settings: no file changes while no scenario holds one ---');
{
	exampleFiles.forEach(function (f) {
		L.applySaved(fileOf(f));
		L.buildDom();
		const once = L.projectFileText();
		// Read every setting through the seam in every scenario: reading must write nothing.
		L.getScenarios().forEach(function (sc) {
			['settings', 'labelSettings', 'project', 'times', 'defaultPattern'].forEach(function (root) { L.settingFor(sc, [root]); });
			L.settingFor(sc, 'settings.hydraulics.demandMultiplier');
			L.alternativesOf(sc);
		});
		const snap = L.serializeProject();
		const s2 = L.acceptImportedText(once);
		L.applySaved(s2);
		L.buildDom();
		ok(f + ': no scenario carries a settings block, reading through the seam writes nothing, and it round-trips unchanged',
			snap.scenarios.every(function (sc) { return !has(sc, 'settings'); }) && L.projectFileText() === once);
	});
}

console.log('\n--- settings: an override resolves in its scenario and not in Base ---');
{
	L.applySaved(fileOf('Net1.lwn'));
	L.buildDom();
	L.switchScenario('base');
	const S = L.getSettings(), baseText = S.textSize, baseBreaks = JSON.stringify(S.colorBreaks);
	const before = L.projectFileText();
	ok('the write seam refuses Base', L.setScenarioSetting(L.baseScenario(), 'settings.textSize', 20) === false);
	const pk = L.createScenario('Peak Hour');
	ok('...and refuses units and the coordinate frame',
		L.setScenarioSetting(pk, 'units', {}) === false && L.setScenarioSetting(pk, 'origin', { x: 1, y: 1 }) === false &&
		L.setScenarioSetting(pk, 'project.coords', 'geo') === false);
	ok('...and the demand multiplier and run time, which keep their own homes',
		L.setScenarioSetting(pk, 'settings.hydraulics.demandMultiplier', 3) === false &&
		L.setScenarioSetting(pk, 'times.duration', 3600) === false);
	ok('a fresh scenario has no settings block', !has(pk, 'settings'));

	L.setScenarioSetting(pk, 'settings.textSize', baseText + 9);
	L.setScenarioSetting(pk, ['settings', 'colorBreaks', 'node.pressure'], [10, 20, 30]);
	L.setScenarioSetting(pk, 'settings.hydraulics.accuracy', 0.0001);
	L.setScenarioSetting(pk, 'settings.quality', { mode: 'age', traceNode: '' });
	ok('in Peak Hour the seam answers Peak Hour\'s own text size', L.effectiveSetting('settings.textSize') === baseText + 9);
	ok('...a member of a map it holds part of, merged over the project\'s',
		JSON.stringify(L.effectiveSetting(['settings', 'colorBreaks'])['node.pressure']) === '[10,20,30]');
	ok('...a calculation option', L.effectiveSetting('settings.hydraulics.accuracy') === 0.0001);
	ok('...a member of an atomic object, from the scenario\'s whole', L.effectiveSetting('settings.quality.mode') === 'age');
	pk.demandMultiplier = 2.5;
	ok('...and the demand multiplier from where it has always been stored',
		L.effectiveSetting('settings.hydraulics.demandMultiplier') === 2.5 && L.effectiveSetting('settings.hydraulics').demandMultiplier === 2.5);
	ok('an untouched setting in Peak Hour is the project\'s own object, not a copy',
		L.effectiveSetting(['labelSettings']) !== undefined && L.settingFor(pk, ['labelSettings']) === L.settingFor(L.baseScenario(), ['labelSettings']));
	L.switchScenario('base');
	ok('in Base the seam answers the project\'s own values', L.effectiveSetting('settings.textSize') === baseText &&
		L.effectiveSetting('settings.hydraulics.accuracy') === S.hydraulics.accuracy &&
		L.effectiveSetting('settings.hydraulics') === S.hydraulics);
	ok('...and the project\'s own objects were never written through the seam',
		S.textSize === baseText && JSON.stringify(S.colorBreaks) === baseBreaks && S.hydraulics.accuracy !== 0.0001);

	const pres = L.alternativeFor(pk, 'presentation'), calc = L.alternativeFor(pk, 'calculation');
	ok('Peak Hour now uses its own Presentation alternative, a child of Base Presentation, of two values',
		!pres.isBase && pres.parent === L.alternativeFor(L.baseScenario(), 'presentation').id && pres.count === 2 && pres.settings.length === 2);
	// Q7 (Tom, 2026-10-05): the demand multiplier is a calculation option like accuracy, counted here.
	ok('...and its own Calculation alternative, of three values, the demand multiplier among them',
		!calc.isBase && calc.count === 3 && calc.settings.some(function (l) { return l.path.join('.') === 'settings.hydraulics.demandMultiplier'; }),
		JSON.stringify(calc.settings));
	ok('...and every element category is still Base\'s',
		L.CATS.filter(function (c) { return c !== 'presentation' && c !== 'calculation'; }).every(function (c) { return L.alternativeFor(pk, c).isBase; }));
	ok('the scenario\'s count includes its four setting values', L.overrideCount(pk) === 5, String(L.overrideCount(pk)));

	const text = L.projectFileText();
	L.applySaved(L.acceptImportedText(text));
	L.buildDom();
	const pk2 = L.getScenarios().filter(function (s) { return s.name === 'Peak Hour'; })[0];
	ok('a scenario\'s settings block survives a save and reopen byte-identical',
		L.projectFileText() === text && pk2.settings && pk2.settings.settings.textSize === baseText + 9);

	['settings.textSize', ['settings', 'colorBreaks', 'node.pressure'], 'settings.hydraulics.accuracy', 'settings.quality'].forEach(function (p) {
		L.setScenarioSetting(pk2, p, undefined);
	});
	delete pk2.demandMultiplier;
	ok('clearing every value removes the block, and Peak Hour uses the Base alternatives again',
		!has(pk2, 'settings') && L.alternativeFor(pk2, 'presentation').isBase && L.alternativeFor(pk2, 'calculation').isBase);
	L.deleteScenario(pk2.id);
	L.switchScenario('base');
	ok('...and with the scenario gone the file is what it was', L.projectFileText() === before);

	// A file is read, never trusted.
	const hand = JSON.parse(before);
	hand.scenarios[0].settings = { settings: { textSize: 30 } };
	hand.scenarios.push({ id: 'hand', name: 'Hand', overrides: {},
		settings: { units: { lpn_u_flow: 'gpm' }, origin: { x: 5, y: 5 }, settings: { method: 'dw', textSize: 9, laterKey: 1 } } });
	L.applySaved(L.acceptImportedText(JSON.stringify(hand)));
	const hs = L.getScenarios().filter(function (s) { return s.id === 'hand'; })[0];
	ok('on open, Base\'s block goes, and so do units and the origin, which may never vary',
		!has(L.baseScenario(), 'settings') && !has(hs.settings, 'units') && !has(hs.settings, 'origin'));
	ok('...a Presentation value stays, and a key from a later version is kept verbatim but counted in no alternative',
		hs.settings.settings.textSize === 9 && hs.settings.settings.laterKey === 1 && L.alternativeFor(hs, 'presentation').count === 1);
	ok('...and a friction method stays, counted in Calculation', hs.settings.settings.method === 'dw' && L.alternativeFor(hs, 'calculation').count === 1);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'ALL PASS'));
process.exit(fails ? 1 : 0);
