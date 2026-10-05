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
	// The Demand multiplier column: a calculation option beside the alternatives, after the categories.
	{
		// The row above the headings that names the calculation options as a group is not a data row.
		const notGroupRow = (tr) => !(tr.children || []).some((c) => /lpn-alt-group/.test(c.className || ''));
		const rowsOf = (function walkRows(el, out) { if (el.tagName === 'TR') { out.push(el); } (el.children || []).forEach(function (c) { walkRows(c, out); }); return out; })(ensure('lpn_alt_report'), []).filter(notGroupRow);
		// A scenario's option is a box it can be typed into (Task 755), so a cell reads as its input.
		const cellText = (c) => { const inp = (c.children || []).filter((k) => k.tagName === 'INPUT')[0];
			return inp ? String(inp.value) : (c.textContent || ''); };
		const cells = (tr) => tr.children.map((c) => cellText(c).replace(/[^\x20-\x7e]/g, '').trim());
		const head = cells(rowsOf[0]);
		// Demand multiplier, then the two clock options (Task 755), after every category.
		const DM = L.CATS.length + 1;
		ok('the calculation options follow every category: Demand multiplier, Total run time, Hydraulic time step',
			head[DM].indexOf(PC.bpn_demand_mult) === 0 && head[DM + 1].indexOf(PC.lpn_time_duration) === 0 &&
			head[DM + 2].indexOf(PC.lpn_time_hyd_step) === 0 && head.length === L.CATS.length + 4, JSON.stringify(head));
		const byName = {}; rowsOf.slice(1).forEach(function (tr) { byName[cells(tr)[0]] = cells(tr); });
		ok('Base shows the project value (1 when it states none)', byName[PC.lpn_scenario_base][DM] === '1', JSON.stringify(byName[PC.lpn_scenario_base]));
		// createScenario() seeds a new scenario with the project's value, so one that inherits is one
		// holding none (the ready-made Flow test scenarios).
		const inheriting = L.createScenario('Inheriting'); delete inheriting.demandMultiplier; L.openAlternativesBox();
		const rows1 = (function walkRows(el, out) { if (el.tagName === 'TR') { out.push(el); } (el.children || []).forEach(function (c) { walkRows(c, out); }); return out; })(ensure('lpn_alt_report'), []).filter(notGroupRow);
		rows1.slice(1).forEach(function (tr) { byName[cells(tr)[0]] = cells(tr); });
		ok('a scenario holding no multiplier of its own the project shows blank', byName['Inheriting'][DM] === '', JSON.stringify(byName['Inheriting']));
		const ownMult = L.createScenario('Max Day'); ownMult.demandMultiplier = 2;
		L.openAlternativesBox();
		const rows2 = (function walkRows(el, out) { if (el.tagName === 'TR') { out.push(el); } (el.children || []).forEach(function (c) { walkRows(c, out); }); return out; })(ensure('lpn_alt_report'), []).filter(notGroupRow);
		const md = rows2.map(cells).filter((r) => r[0] === 'Max Day')[0];
		ok('a scenario with its own multiplier shows it', md && md[DM] === '2', JSON.stringify(md));
		ok('the column is marked as a calculation option, apart from the categories',
			rowsOf[0].children[DM].className.indexOf('lpn-alt-calcopt') >= 0);
		L.deleteScenario(ownMult.id); L.deleteScenario(inheriting.id);
	}
	basicRow().fn();
	ok('ticking it again removes the stored key and closes the box',
		L.basicMode() && global.localStorage.getItem('lpn_scnbasic') === null && !L.altBoxIsOpen());
}

console.log('\n' + (fails ? fails + ' FAILED' : 'ALL PASS'));
process.exit(fails ? 1 : 0);
