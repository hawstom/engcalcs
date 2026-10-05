// Headless check of STAGES 4 AND 5 of dev/scenario-alternatives.md: the stored scenario tree.
//
//   node dev/lpn-spike/scenario-tree-harness.js [seed]
//
// Tom, 2026-10-05: *"our first item of business is to get the full alternatives and inheritance
// model built under the hood."* The tree is resolved by a cached resolver (resolvedOverrides(),
// resolvedSettingsBlock()) that every hot reader goes through, so what can go wrong is silent: a
// chain walked in the wrong order, a cache that outlives a write, a maintenance walk that misses
// a stored alternative, an undo that leaves half the tree behind. So this harness is
// PROPERTY-BASED: seeded random trees (scenario chains, shared and orphan alternatives, empty
// ones, calculation sets with parents, depth up to four) and random mutations, and after every
// step every element property and every held setting of every scenario is compared against a
// ten-line uncached walk written here, independently of the page's.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const fs = require('fs');

global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
global.prompt = global.window.prompt = function () { return 'Scenario'; };

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tgetSettings: function () { return settings; }, getProject: function () { return project; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, buildDom: buildDom, applySaved: applySaved,\n" +
	"\t\tacceptImportedText: acceptImportedText, serializeProject: serializeProject, projectFileText: projectFileText,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, deleteScenario: deleteScenario,\n" +
	"\t\tbaseScenario: baseScenario, activeScenario: activeScenario, scenarioById: scenarioById,\n" +
	"\t\tsetProp: setProp, effective: effective, ovKey: ovKey, ovKeyGroup: ovKeyGroup, hasOverride: hasOverride,\n" +
	"\t\tcategoryOf: categoryOf, categoryOfSetting: categoryOfSetting, settingFor: settingFor,\n" +
	"\t\tsetScenarioSetting: setScenarioSetting, heldCalcOption: heldCalcOption, heldView: heldView,\n" +
	"\t\tOVERRIDABLE: LPN_OVERRIDABLE, CATS: LPN_ALT_CATEGORIES, TYPE_PROP_SET: LPN_TYPE_PROP_SET,\n" +
	"\t\tresolvedOverrides: resolvedOverrides, buildResolvedOverrides: buildResolvedOverrides,\n" +
	"\t\tresolvedSettingsBlock: resolvedSettingsBlock, buildResolvedSettings: buildResolvedSettings,\n" +
	"\t\tisExplicitTree: isExplicitTree, touchTree: touchTree,\n" +
	"\t\tsetTouchSkip: function (site) { treeTouchSkip = site; },\n" +
	"\t\tassembleModel: assembleModel, inpExportDocument: inpExportDocument, inpExportOptions: inpExportOptions,\n" +
	"\t\teffectiveTimes: effectiveTimes,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
setUnitSet('us');
L.buildLayers();
L.setCanvas(1000, 700);
L.seedDefaultInputs();

let fails = 0, passes = 0;
function ok(name, cond, extra) {
	if (cond) { passes++; } else { fails++; }
	if (!cond || !QUIET) { console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (cond || extra === undefined ? '' : '   ' + extra)); }
}
let QUIET = false;
const has = (o, k) => !!o && typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, k);
const J = (v) => JSON.stringify(v === undefined ? null : v);

// A small seeded generator (mulberry32), so a failure names the seed that reproduces it.
const SEED = +(process.argv[2] || 20261005);
function rng(seed) {
	let a = seed >>> 0;
	return function () {
		a = (a + 0x6D2B79F5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
let R = rng(SEED);
const pick = (a) => a[Math.floor(R() * a.length)];
const chance = (p) => R() < p;
const num = () => Math.round(R() * 1000) / 10 + 1;

function open(name) {
	L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + name, 'utf8')));
	L.buildDom();
}

// ---------------------------------------------------------------------------
// The independent walk: nearest holder first, Base excluded.
// ---------------------------------------------------------------------------
function byId(list, id) { return (list || []).filter((r) => r.id === id)[0] || null; }
function naiveChain(s, cat) {
	const out = [], seen = {}, calc = cat === 'calculation';
	while (s && !s.isBase && !seen[s.id]) {
		seen[s.id] = 1; out.push(['scn', s]);
		const named = calc ? s.calc : (s.alternatives || {})[cat];
		if (named !== undefined) {
			for (let r = byId(calc ? L.getDoc().calcSets : L.getDoc().alternatives, named), k = 0; r && k < 50; k++) {
				out.push([calc ? 'calc' : 'alt', r]); r = r.parent == null ? null : byId(calc ? L.getDoc().calcSets : L.getDoc().alternatives, r.parent);
			}
			return out;
		}
		s = (s.parent !== undefined && L.scenarioById(s.parent)) || L.baseScenario();
	}
	return out;
}
// An element property: {found, value}, the R-369 rule that a whole list's row 0 IS `demand` included.
function naiveValue(s, el, prop) {
	const key = L.ovKey(el), cat = L.categoryOf(prop, L.ovKeyGroup(key));
	for (const [kind, h] of naiveChain(s, cat)) {
		const v = kind === 'scn' ? (h.overrides || {})[key] : kind === 'alt' ? (h.values || {})[key] : null;
		if (prop === 'demand' && v && Array.isArray(v.demands) && v.demands.length) { return { found: true, value: v.demands[0].base }; }
		if (has(v, prop)) { return { found: true, value: v[prop] }; }
	}
	return { found: false };
}
// A setting leaf: the multiplier and the two times live in their own homes on a scenario or a set.
function holderGet(kind, h, p) {
	const k = p.join('.');
	if (kind !== 'alt' && k === 'settings.hydraulics.demandMultiplier') { return h.demandMultiplier; }
	if (kind !== 'alt' && /^times\.(text\.)?(duration|hydraulicStep)$/.test(k)) { return p.reduce((o, x) => (o && typeof o === 'object' ? o[x] : undefined), h); }
	return p.reduce((o, x) => (o && typeof o === 'object' ? o[x] : undefined), h.settings);
}
function naiveSetting(s, p) {
	for (const [kind, h] of naiveChain(s, L.categoryOfSetting(p))) {
		const v = holderGet(kind, h, p);
		if (v !== undefined) { return { found: true, value: v }; }
	}
	return { found: false };
}

// ---------------------------------------------------------------------------
// The whole comparison, run after every step.
// ---------------------------------------------------------------------------
// Properties whose "not held anywhere" answer has a layer of its own (the pipe type, the derived
// auto length, the outward position, the demand list) are compared only where a holder has them.
const SPECIAL = new Set(['length', 'x', 'y', 'demand', 'demands', 'typeId']);
let elements = [];
let settingPaths = [];
function checkAll(label) {
	const bad = [], scns = L.getScenarios(), base = L.baseScenario(), keep = L.getProject().activeScenario;
	scns.forEach((s) => {
		L.getProject().activeScenario = s.id;
		elements.forEach((el) => {
			const g = L.ovKeyGroup(L.ovKey(el));
			Object.keys(L.OVERRIDABLE[g] || {}).forEach((prop) => {
				if (prop === 'demands') { return; }
				const n = naiveValue(s, el, prop);
				let want;
				if (n.found) { want = n.value; }
				else {
					if (SPECIAL.has(prop) || L.TYPE_PROP_SET[prop]) { return; }
					L.getProject().activeScenario = base.id; want = L.effective(el, prop); L.getProject().activeScenario = s.id;
				}
				const got = L.effective(el, prop);
				if (J(got) !== J(want)) { bad.push(s.id + '/' + el.id + '.' + prop + ' got ' + J(got) + ' want ' + J(want)); }
			});
		});
		settingPaths.forEach((p) => {
			const n = naiveSetting(s, p), got = L.settingFor(s, p), want = n.found ? n.value : L.settingFor(base, p);
			if (J(got) !== J(want)) { bad.push(s.id + '/' + p.join('.') + ' got ' + J(got) + ' want ' + J(want)); }
		});
		['demandMultiplier', 'duration', 'hydraulicStep'].forEach((k) => {
			const n = s.isBase ? { found: false } : naiveSetting(s, k === 'demandMultiplier' ? ['settings', 'hydraulics', k] : ['times', k]);
			if (J(L.heldCalcOption(s, k)) !== J(n.found ? n.value : undefined)) { bad.push(s.id + '/held ' + k); }
		});
	});
	L.getProject().activeScenario = keep;
	ok(label + ': effective(), settingFor() and the held options agree with the uncached walk', !bad.length, bad.slice(0, 4).join(' | ') + (bad.length > 4 ? ' (+' + (bad.length - 4) + ')' : ''));
	return bad.length === 0;
}
// The cache against a rebuild from nothing, for every scenario.
function cacheFresh() {
	return L.getScenarios().every((s) => J(L.resolvedOverrides(s)) === J(s.isBase || !L.isExplicitTree() ? s.overrides : L.buildResolvedOverrides(s)) &&
		(s.isBase || !L.isExplicitTree() || J(L.resolvedSettingsBlock(s)) === J(L.buildResolvedSettings(s))));
}
// The four structural invariants of a stored tree.
function invariants() {
	const d = L.getDoc(), alts = d.alternatives || [], sets = d.calcSets || [], bad = [];
	const loops = (list, r) => { const seen = {}; for (let c = r; c; c = c.parent == null ? null : byId(list, c.parent)) { if (seen[c.id]) { return true; } seen[c.id] = 1; } return false; };
	alts.forEach((a) => {
		if (loops(alts, a)) { bad.push('cycle ' + a.id); }
		if (a.parent != null && (!byId(alts, a.parent) || byId(alts, a.parent).category !== a.category)) { bad.push('parent ' + a.id); }
		if (String(a.id).indexOf(':') >= 0) { bad.push('id ' + a.id); }
	});
	sets.forEach((c) => { if (loops(sets, c)) { bad.push('cycle ' + c.id); } if (c.parent != null && !byId(sets, c.parent)) { bad.push('parent ' + c.id); } });
	L.getScenarios().forEach((s) => {
		const seen = {};
		for (let c = s; c && !c.isBase; c = c.parent !== undefined ? L.scenarioById(c.parent) : null) { if (seen[c.id]) { bad.push('scenario cycle ' + s.id); break; } seen[c.id] = 1; }
		if (s.parent !== undefined && !L.scenarioById(s.parent)) { bad.push('dangling parent ' + s.id); }
		if (s.calc !== undefined && !byId(sets, s.calc)) { bad.push('dangling calc ' + s.id); }
		Object.keys(s.alternatives || {}).forEach((cat) => {
			const a = byId(alts, s.alternatives[cat]);
			if (!a) { bad.push('dangling ' + s.id + '.' + cat); return; }
			if (a.category !== cat) { bad.push('category ' + s.id + '.' + cat); }
			// A scenario that names a stored alternative in a category holds no local value in it.
			const local = Object.keys(s.overrides || {}).some((k) => Object.keys(s.overrides[k]).some((p) => L.categoryOf(p, L.ovKeyGroup(k)) === cat));
			if (local) { bad.push('named and local ' + s.id + '.' + cat); }
		});
	});
	return bad;
}

// ---------------------------------------------------------------------------
// A random tree, written as a file from a later reader would carry it.
// ---------------------------------------------------------------------------
const SETTING_POOL = {
	presentation: [['settings', 'textSize'], ['settings', 'symbolSize'], ['labelSettings', 'node', 'pressure'], ['project', 'basemap']],
	calculation: [['settings', 'hydraulics', 'accuracy'], ['settings', 'hydraulics', 'trials'], ['settings', 'method'], ['times', 'patternStep']],
	physical: [['settings', 'defaults', 'diameter'], ['settings', 'idPrefixes', 'J']],
	demand: [['settings', 'defaults', 'demand'], ['defaultPattern']],
	constituent: [['settings', 'reactions', 'globalBulk']],
	energy: [['settings', 'energy', 'globalPrice']]
};
const ELEMENT_CATS = ['physical', 'demand', 'topology', 'initial', 'constituent', 'fireflow', 'energy', 'userdata', 'text'];
function settingValue(p) {
	const k = p.join('.');
	if (k === 'settings.method') { return pick(['hw', 'dw', 'cm']); }
	if (k === 'project.basemap') { return pick(['none', 'osm']); }
	if (k === 'labelSettings.node.pressure') { return chance(0.5); }
	if (k === 'defaultPattern') { return pick(['1', '2']); }
	if (k === 'settings.idPrefixes.J') { return pick(['N', 'Q']); }
	return num();
}
function propsOf(cat) {
	const out = [];
	elements.forEach((el) => {
		const g = L.ovKeyGroup(L.ovKey(el));
		Object.keys(L.OVERRIDABLE[g] || {}).forEach((p) => { if (L.categoryOf(p, g) === cat && p !== 'x' && p !== 'y') { out.push([el, p]); } });
	});
	return out;
}
function propValue(prop) {
	if (prop === 'active') { return chance(0.5); }
	if (prop === 'demands') { return [{ base: num(), pattern: null, category: 'a' }, { base: num(), pattern: null, category: 'b' }]; }
	if (prop === 'status') { return pick(['open', 'closed']); }
	if (prop === 'text') { return 'T' + Math.floor(R() * 99); }
	return num();
}
function putValue(map, el, prop, v) { const k = L.ovKey(el); (map[k] = map[k] || {})[prop] = v; }
function putSetting(holder, p, v) {
	const k = p.join('.');
	if (k === 'settings.hydraulics.demandMultiplier') { holder.demandMultiplier = v; return; }
	if (/^times\.(duration|hydraulicStep)$/.test(k)) { holder.times = holder.times || {}; holder.times[p[1]] = v; return; }
	holder.settings = holder.settings || {};
	let n = holder.settings;
	for (let i = 0; i < p.length - 1; i++) { n = n[p[i]] = n[p[i]] || {}; }
	n[p[p.length - 1]] = v;
}
function randomTree(name) {
	open(name);
	const d = L.getDoc();
	elements = d.nodes.slice(0, 6).concat(d.links.slice(0, 6), d.labels.slice(0, 2));
	settingPaths = [].concat.apply([], Object.keys(SETTING_POOL).map((c) => SETTING_POOL[c]))
		.concat([['settings', 'hydraulics', 'demandMultiplier'], ['times', 'duration'], ['times', 'hydraulicStep'], ['view']]);
	const scns = [], depth = {};
	const nS = 2 + Math.floor(R() * 5);
	for (let i = 0; i < nS; i++) {
		const s = L.createScenario('S' + i);
		depth[s.id] = 1;
		if (scns.length && chance(0.6)) {
			const p = pick(scns.filter((x) => depth[x.id] < 4));
			if (p) { s.parent = p.id; depth[s.id] = depth[p.id] + 1; }
		}
		if (chance(0.5)) { delete s.demandMultiplier; }
		scns.push(s);
	}
	const alts = [], adepth = {};
	ELEMENT_CATS.concat(['presentation']).forEach((cat) => {
		const n = Math.floor(R() * 4);
		for (let i = 0; i < n; i++) {
			const same = alts.filter((a) => a.category === cat && adepth[a.id] < 4);
			const a = { id: 'a' + (alts.length + 1), category: cat, name: cat + ' ' + i, parent: same.length && chance(0.6) ? pick(same).id : null, values: {} };
			adepth[a.id] = a.parent ? adepth[a.parent] + 1 : 1;
			// Empty ones too: an alternative with no values must resolve exactly as its parent.
			const pv = propsOf(cat);
			for (let k = Math.floor(R() * 4); k > 0 && pv.length; k--) { const [el, p] = pick(pv); putValue(a.values, el, p, propValue(p)); }
			(SETTING_POOL[cat] || []).forEach((p) => { if (chance(0.3)) { putSetting(a, p, settingValue(p)); } });
			alts.push(a);
		}
	});
	const sets = [];
	for (let n = Math.floor(R() * 4), i = 0; i < n; i++) {
		const c = { id: 'c' + (i + 1), name: 'Calc ' + i, parent: sets.length && chance(0.5) ? pick(sets).id : null };
		if (chance(0.5)) { c.demandMultiplier = num(); }
		if (chance(0.3)) { c.times = { duration: 3600 * Math.floor(1 + R() * 24) }; }
		SETTING_POOL.calculation.forEach((p) => { if (chance(0.3)) { putSetting(c, p, settingValue(p)); } });
		sets.push(c);
	}
	if (alts.length) { d.alternatives = alts; }
	if (sets.length) { d.calcSets = sets; }
	scns.forEach((s) => {
		ELEMENT_CATS.concat(['presentation']).forEach((cat) => {
			const mine = alts.filter((a) => a.category === cat);
			if (mine.length && chance(0.4)) { s.alternatives = s.alternatives || {}; s.alternatives[cat] = pick(mine).id; return; }
			// Locals only in a category it does not name (the invariant).
			const pv = propsOf(cat);
			if (pv.length && chance(0.3)) { const [el, p] = pick(pv); putValue(s.overrides, el, p, propValue(p)); }
			(SETTING_POOL[cat] || []).forEach((p) => { if (chance(0.15)) { putSetting(s, p, settingValue(p)); } });
		});
		if (sets.length && chance(0.4)) { s.calc = pick(sets).id; }
		else {
			if (chance(0.3)) { s.demandMultiplier = num(); }
			if (chance(0.2)) { s.times = { hydraulicStep: 60 * Math.floor(1 + R() * 60) }; }
			SETTING_POOL.calculation.forEach((p) => { if (chance(0.15)) { putSetting(s, p, settingValue(p)); } });
		}
		if (chance(0.15)) { putSetting(s, ['view'], { cx: num(), cy: num(), s: 1 + R() }); }
	});
	L.touchTree();
}

// ---------------------------------------------------------------------------
// 1. Random stored trees resolve exactly as the uncached walk says
// ---------------------------------------------------------------------------
console.log('\n--- 1. random stored trees (seed ' + SEED + ') ---');
{
	const N = 40;
	let good = 0, cached = 0, inv = 0;
	QUIET = true;
	for (let t = 0; t < N; t++) {
		randomTree(pick(['Net1.lwn', 'Net2.lwn', 'Net3.lwn']));
		if (!L.isExplicitTree()) { continue; }
		if (checkAll('tree ' + t)) { good++; }
		if (cacheFresh()) { cached++; }
		if (!invariants().length) { inv++; }
		// And through a save: the file carries the tree, and reopening it resolves the same.
		const before = L.projectFileText();
		L.applySaved(L.acceptImportedText(before));
		L.buildDom();
		if (L.projectFileText() !== before) { fails++; console.log('FAIL  tree ' + t + ' does not round-trip byte-identical'); } else { passes++; }
	}
	QUIET = false;
	ok('every random tree resolves as the uncached walk says (' + good + '/' + N + ')', good === N);
	ok('...the cache equals a fresh rebuild in every one', cached === N, cached + '/' + N);
	ok('...and no generated tree breaks an invariant (the generator is honest)', inv === N, inv + '/' + N);
}

// ---------------------------------------------------------------------------
// 2. A tree that names nothing new resolves exactly as the derived model does
// ---------------------------------------------------------------------------
// Every scenario explicitly a child of Base, with no stored alternative: the explicit resolver must
// see exactly what the derived one sees -- in the solver's model, the export and the map.
console.log('\n--- 2. explicit but derivable == derived ---');
{
	const files = fs.readdirSync(ROOT + 'examples/').filter((f) => /\.lwn$/.test(f)).sort();
	function fp() {
		L.buildDom();
		const ex = global.EngCalcs.lpnExportInp(L.inpExportDocument(), L.inpExportOptions());
		return J([L.assembleModel(), ex && ex.inp, L.effectiveTimes(), document.getElementById('lpn_canvas').children.length]);
	}
	files.forEach((f) => {
		open(f);
		const busy = L.createScenario('Busy');
		busy.demandMultiplier = 1.5; busy.times = { duration: 0 };
		L.setScenarioSetting(busy, 'settings.hydraulics.accuracy', 1e-4);
		L.setScenarioSetting(busy, 'times.patternStep', 1800);
		const pipe = L.getDoc().links.filter((l) => l.type === 'pipe')[0];
		if (pipe) { L.setProp(pipe, 'diameter', 99); }
		const junc = L.getDoc().nodes.filter((n) => n.type === 'junction')[0];
		if (junc) { L.setProp(junc, 'demand', 77); }
		const derived = fp();
		L.touchTree();
		ok(f + ': the derived project reads as derived', !L.isExplicitTree());
		L.getScenarios().forEach((s) => { if (!s.isBase) { s.parent = L.baseScenario().id; } });
		L.touchTree();
		ok(f + ': ...a stated parent of Base makes it explicit', L.isExplicitTree());
		ok(f + ': ...and the model, the export, the clock and the map are unchanged', fp() === derived);
	});
}

// ---------------------------------------------------------------------------
// 3. Every shipped example and fixture opens and re-saves unchanged
// ---------------------------------------------------------------------------
console.log('\n--- 3. files ---');
{
	const files = fs.readdirSync(ROOT + 'examples/').filter((f) => /\.lwn$/.test(f)).map((f) => ROOT + 'examples/' + f)
		.concat(fs.readdirSync(ROOT + 'dev/water-network-examples/').filter((f) => /\.lwn$/.test(f)).map((f) => ROOT + 'dev/water-network-examples/' + f));
	files.forEach((f) => {
		L.applySaved(L.acceptImportedText(fs.readFileSync(f, 'utf8')));
		L.buildDom();
		const once = L.projectFileText();
		L.applySaved(L.acceptImportedText(once));
		L.buildDom();
		ok(f.replace(ROOT, '') + ': no tree key appears, and a re-save is byte-identical',
			L.projectFileText() === once && !/"(alternatives|calcSets)":/.test(once.replace(/"scenarios":[\s\S]*?\]\s*,\s*"nodes"/, '')));
	});
	// A file whose tree cannot be resolved is cleaned, never trusted.
	open('Net1.lwn');
	const o = JSON.parse(L.projectFileText());
	o.alternatives = [{ id: 'a1', category: 'demand', name: 'A', parent: 'a2', values: {} }, { id: 'a2', category: 'demand', name: 'B', parent: 'a1', values: {} },
		{ id: 'x:1', category: 'demand', name: 'bad id' }, { id: 'a3', category: 'nonsense', name: 'bad category' }];
	o.calcSets = [];
	o.scenarios.push({ id: 's9', name: 'X', overrides: {}, parent: 'nowhere', alternatives: { demand: 'a1', physical: 'a1' }, calc: 'c9' });
	L.applySaved(L.acceptImportedText(JSON.stringify(o)));
	const d = L.getDoc(), s9 = L.scenarioById('s9');
	ok('a loop of parents is broken, a bad id and a bad category go', J(d.alternatives.map((a) => a.id)) === '["a1","a2"]' && d.alternatives.some((a) => a.parent === null));
	ok('...an empty list of sets goes', d.calcSets === undefined);
	ok('...a missing parent, a mismatched choice and a missing set go; a good choice stays',
		s9.parent === undefined && J(s9.alternatives) === '{"demand":"a1"}' && s9.calc === undefined);
	ok('...and the cleaned tree breaks no invariant', !invariants().length, invariants().join(', '));
}

console.log('\n' + (fails ? fails + ' FAILED, ' : 'ALL PASS, ') + passes + ' passed');
process.exit(fails ? 1 : 0);
