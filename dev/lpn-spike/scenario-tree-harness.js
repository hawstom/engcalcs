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
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }

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
	"\t\teffectiveTimes: effectiveTimes, setScenarioTime: setScenarioTime, calcTargetOf: calcTargetOf,\n" +
	"\t\tcreateAlternative: createAlternative, renameAlternative: renameAlternative, reparentAlternative: reparentAlternative,\n" +
	"\t\tdeleteAlternative: deleteAlternative, mergeAlternativeInto: mergeAlternativeInto, assignAlternative: assignAlternative,\n" +
	"\t\tpromoteImplicitAlternative: promoteImplicitAlternative, createCalcSet: createCalcSet, renameCalcSet: renameCalcSet,\n" +
	"\t\treparentCalcSet: reparentCalcSet, deleteCalcSet: deleteCalcSet, assignCalcSet: assignCalcSet,\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo, redo: redo,\n" +
	"\t\tapplyNodeRename: applyNodeRename, deleteNode: deleteNode, convertUnitValues: convertUnitValues,\n" +
	"\t\tlibRepointPattern: libRepointPattern, setScenarioParent: setScenarioParent, treeLayers: treeLayers,\n" +
	"\t\tsetScenarioView: setScenarioView, currentView: currentView, applyView: applyView,\n" +
	"\t\tclearOverride: clearOverride, commitAltOption: commitAltOption, scenarioMenuRows: scenarioMenuRows,\n" +
	"\t\tlastNotice: function () { return noticeLog[0]; },\n" +
	"\t\tgeorefBegin: function () { var was = georef; georef = { ovs: georefCaptureCoordOverrides() }; return was; },\n" +
	"\t\tgeorefMove: function (t) { georefWriteCoordOverrides(t); }, georefEnd: function (was) { georef = was; },\n" +
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
// The mutation sweep: TREE_SKIP=<site> skips that one touchTree() for the whole run, and the run
// must then FAIL somewhere. dev/lpn-spike's sweep is `for s in <sites>; do TREE_SKIP=$s node ...`.
if (process.env.TREE_SKIP) { L.setTouchSkip(process.env.TREE_SKIP); }

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
// (A demand, a position and a type reference fall back to exactly Base's own, so they ARE compared.)
const SPECIAL = new Set(['length']);
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
// Key order is not meaning: a key mended in place lands last in its map.
function C(v) {
	if (Array.isArray(v)) { return '[' + v.map(C).join(',') + ']'; }
	if (v && typeof v === 'object') { return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + C(v[k])).join(',') + '}'; }
	return J(v);
}
// Whether anything about the tree is stored, measured here independently of the page.
function naiveStored() {
	const d = L.getDoc();
	return !!((d.alternatives || []).length || (d.calcSets || []).length ||
		L.getScenarios().some((s) => s.parent !== undefined || s.alternatives !== undefined || s.calc !== undefined));
}
// The cache as it stands, against one rebuilt from nothing: every cached answer is read first, then
// the epoch is bumped and every answer read again. Bumping is the point -- a "fresh" rebuild that
// reused the cache's own per-holder grouping would agree with a stale one.
function cacheTruthful() {
	const snap = () => C([L.isExplicitTree()].concat(L.getScenarios().map((s) => [L.resolvedOverrides(s), s.isBase ? null : L.resolvedSettingsBlock(s)])));
	const cached = snap();
	L.touchTree();
	return cached === snap();
}
function cacheFresh() {
	return L.isExplicitTree() === naiveStored() && L.getScenarios().every((s) => C(L.resolvedOverrides(s)) === C(s.isBase || !L.isExplicitTree() ? s.overrides : L.buildResolvedOverrides(s)) &&
		(s.isBase || !L.isExplicitTree() || C(L.resolvedSettingsBlock(s)) === C(L.buildResolvedSettings(s))));
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

// ---------------------------------------------------------------------------
// 4. Random mutations through the API, compared after every one
// ---------------------------------------------------------------------------
const CATS_STORED = ELEMENT_CATS.concat(['presentation']);
function randomMutation() {
	const d = L.getDoc(), scns = L.getScenarios().filter((x) => !x.isBase), s = pick(scns), alts = d.alternatives || [], sets = d.calcSets || [];
	const cat = pick(CATS_STORED), ofCat = alts.filter((a) => a.category === cat);
	const r = Math.floor(R() * 18);
	let what;
	switch (r) {
		case 0: case 1: {
			const pv = propsOf(cat);
			if (!pv.length) { return 'none'; }
			const [el, p] = pick(pv);
			L.getProject().activeScenario = s.id;
			L.setProp(el, p, propValue(p));
			return 'setProp ' + s.id + ' ' + el.id + '.' + p;
		}
		case 2: {
			const pool = SETTING_POOL[cat] || SETTING_POOL.calculation, p = pick(pool);
			what = L.setScenarioSetting(s, p, chance(0.2) ? undefined : settingValue(p));
			return 'setting ' + s.id + ' ' + p.join('.') + ' ' + what;
		}
		case 3: return 'create ' + J(L.createAlternative(cat, 'new', ofCat.length && chance(0.5) ? pick(ofCat).id : null).id);
		case 4: return ofCat.length ? 'reparent ' + J(L.reparentAlternative(pick(ofCat).id, chance(0.3) ? null : pick(ofCat).id)) : 'none';
		case 5: return ofCat.length ? 'delete ' + J(L.deleteAlternative(pick(ofCat).id)) : 'none';
		case 6: return ofCat.length ? 'assign ' + J(L.assignAlternative(s.id, cat, chance(0.2) ? null : pick(ofCat).id, { discard: chance(0.3) })) : 'none';
		case 7: return 'promote ' + J((L.promoteImplicitAlternative(s.id, cat, 'P') || {}).id);
		case 8: return ofCat.length > 1 ? 'merge ' + J(L.mergeAlternativeInto(ofCat[0].id, pick(ofCat).id)) : 'none';
		case 9: return 'calc create ' + J(L.createCalcSet('C', sets.length && chance(0.5) ? pick(sets).id : null).id);
		case 10: return sets.length ? 'calc assign ' + J(L.assignCalcSet(s.id, chance(0.2) ? null : pick(sets).id, { discard: chance(0.4) })) : 'none';
		case 11: return sets.length ? 'calc reparent/delete ' + J(chance(0.5) ? L.reparentCalcSet(pick(sets).id, pick(sets).id) : L.deleteCalcSet(pick(sets).id)) : 'none';
		case 12: return 'calc promote ' + J((L.promoteImplicitAlternative(s.id, 'calculation', 'CP') || {}).id);
		case 13: {
			const t = L.calcTargetOf(s);
			if (chance(0.5)) { t.demandMultiplier = num(); L.touchTree(); return 'multiplier'; }
			return 'time ' + L.setScenarioTime(t, 'duration', chance(0.3) ? '' : String(Math.floor(1 + R() * 48)) + ':00');
		}
		case 15: return 'parent ' + J(L.setScenarioParent(s.id, chance(0.3) ? null : pick(L.getScenarios()).id));
		case 16: { const c = L.createScenario('Child', pick(L.getScenarios()).id); return 'child ' + c.id + ' of ' + J(c.parent); }
		case 17: return scns.length > 2 ? 'delete scenario ' + J(L.deleteScenario(pick(scns).id)) : 'none';
		default: {
			const pv = propsOf(cat);
			if (!pv.length) { return 'none'; }
			const [el, p] = pick(pv);
			L.getProject().activeScenario = s.id;
			if (L.hasOverride(el, p)) { L.setProp(el, p, propValue(p)); }
			return 'touch ' + p;
		}
	}
}
console.log('\n--- 4. random mutations (seed ' + SEED + ') ---');
{
	let steps = 0, good = 0, cached = 0, inv = 0, firstBad = '';
	QUIET = true;
	for (let t = 0; t < 12; t++) {
		randomTree(pick(['Net1.lwn', 'Net2.lwn']));
		for (let m = 0; m < 25; m++) {
			const what = randomMutation();
			steps++;
			const before = fails;
			if (checkAll('step ' + t + '.' + m + ' (' + what + ')')) { good++; }
			if (cacheFresh()) { cached++; } else if (!firstBad) { firstBad = 'cache after ' + what; }
			const iv = invariants();
			if (!iv.length) { inv++; } else if (!firstBad) { firstBad = what + ': ' + iv.join(', '); }
			if (fails > before && !firstBad) { firstBad = what; }
		}
	}
	QUIET = false;
	ok('every mutation leaves every value as the uncached walk says (' + good + '/' + steps + ')', good === steps, firstBad);
	ok('...the cache equals a fresh rebuild after every one', cached === steps, firstBad);
	ok('...and no mutation breaks an invariant', inv === steps, firstBad);
}

// ---------------------------------------------------------------------------
// 5. The cache goes stale without its touch, and the harness sees it
// ---------------------------------------------------------------------------
// A mutation test of the epoch itself, one case per write site: the site's bump is skipped by name
// (treeTouchSkip; the page is not edited) and the comparison must then FAIL -- and pass with it.
// If a case passed both ways, sections 1 and 4 would prove nothing about that site.
console.log('\n--- 5. a missing touchTree() is caught, site by site ---');
function quietCheck() {
	const before = fails, log = console.log;
	console.log = function () {};
	const good = checkAll('stale') && cacheFresh();
	console.log = log;
	fails = before;
	return good;
}
// Read everything, so every cache is full.
function warm() { quietCheck(); }
// Detect: wrong values, a cache disagreeing with a rebuild, or a cache disagreeing with one built
// from nothing.
function stale() { return !quietCheck() || !cacheTruthful(); }
function siteCase(site, what, build) {
	const seen = [], sweep = process.env.TREE_SKIP;
	// In the sweep the site named by TREE_SKIP is skipped for the whole run, so only the "with its
	// bump" leg runs, under that skip -- and fails for exactly that site.
	(sweep ? [false] : [false, true]).forEach((skip) => {
		const act = build();
		warm();
		L.setTouchSkip(skip ? site : (sweep || null));
		act();
		L.setTouchSkip(sweep || null);
		seen.push(stale());
		L.touchTree();
	});
	if (sweep) { ok(site + ' (' + what + '): fresh', !seen[0]); return; }
	ok(site + ' (' + what + '): fresh with its bump, caught without it', !seen[0] && seen[1], J(seen));
}
// A fresh Net1 with the elements the cases use, and a scenario Peak with a local demand.
function fixture(explicit) {
	open('Net1.lwn');
	const d = L.getDoc(), j = d.nodes.filter((n) => n.type === 'junction')[0], pipe = d.links.filter((l) => l.type === 'pipe')[0];
	elements = [j, pipe];
	settingPaths = [['settings', 'hydraulics', 'demandMultiplier']];
	L.switchScenario(L.baseScenario().id);
	const peak = L.createScenario('Peak');
	L.setProp(j, 'demand', 500);
	const kid = explicit ? L.createScenario('Kid', peak.id) : null;
	L.switchScenario(L.baseScenario().id);
	return { d, j, pipe, peak, kid };
}
siteCase('setOverride', 'a demand typed in a child', () => { const f = fixture(true); return () => { L.getProject().activeScenario = f.kid.id; L.setProp(f.j, 'demand', 4321); }; });
siteCase('clearOverride', 'a demand cleared in a parent', () => { const f = fixture(true); return () => { L.getProject().activeScenario = f.peak.id; L.clearOverride(f.j, 'demand'); }; });
siteCase('createStored', 'the first alternative makes the tree stored', () => { fixture(false); return () => { L.createAlternative('physical', 'x', null); }; });
siteCase('deleteStored', 'the last alternative goes', () => { fixture(false); const a = L.createAlternative('physical', 'x', null); return () => { L.deleteAlternative(a.id); }; });
siteCase('mergeAlternativeInto', 'a child merged into the parent another scenario uses', () => {
	const f = fixture(true), t = L.createAlternative('physical', 't', null), a = L.createAlternative('physical', 'a', t.id);
	a.values = {}; a.values[L.ovKey(f.pipe)] = { diameter: 77 };
	L.assignAlternative(f.peak.id, 'physical', t.id);
	L.assignAlternative(L.createScenario('Uses a').id, 'physical', a.id);
	L.touchTree();
	return () => { L.mergeAlternativeInto(a.id, t.id); };
});
siteCase('promoteStored', 'a derived project\'s first promote', () => { const f = fixture(false); return () => { L.promoteImplicitAlternative(f.peak.id, 'demand', 'Peak demand'); }; });
siteCase('eachOverrideMap', 'a unit change reaching a stored alternative', () => {
	const f = fixture(true), ph = L.createAlternative('physical', 'Big', null);
	ph.values = {}; ph.values[L.ovKey(f.pipe)] = { diameter: 12 };
	L.assignAlternative(f.peak.id, 'physical', ph.id);
	L.touchTree();
	return () => { L.convertUnitValues('lpn_u_diameter', 2); };
});
siteCase('eachOverrideMap', 'a node rename moving its key', () => { const f = fixture(true); return () => { L.applyNodeRename(f.j.id, 'RENAMED'); }; });
siteCase('createScenario', 'a child scenario makes the tree stored', () => { const f = fixture(false); return () => { L.createScenario('Kid', f.peak.id); }; });
siteCase('deleteScenario', 'the only stored parent goes with its scenario', () => { const f = fixture(true); return () => { L.deleteScenario(f.kid.id); }; });
siteCase('demandMultiplier', 'a parent\'s multiplier typed in the Alternatives table', () => {
	const f = fixture(true);
	return () => { L.commitAltOption(f.peak, 'demandMultiplier', { value: '4' }); };
});
siteCase('georef', 'a scenario\'s own position moved by the georeferencing wizard', () => {
	const f = fixture(true);
	L.getProject().activeScenario = f.peak.id;
	L.setProp(f.j, 'x', 1234);
	L.getProject().activeScenario = L.baseScenario().id;
	const n0 = f.d.nodes.filter((n) => n !== f.j)[0];
	elements = [f.j, n0];
	let was;
	return () => { was = L.georefBegin(); warm(); L.georefMove({ rotDeg: 0, anchor: { x: 0, y: 0 }, metersPerUnit: 1, origin: { lon: 10, lat: 10 } }); L.georefEnd(was); };
});

// ---------------------------------------------------------------------------
// 6. Promote changes nothing anybody can see; undo and redo are whole
// ---------------------------------------------------------------------------
function everyValue() {
	const out = [], keep = L.getProject().activeScenario;
	L.getScenarios().forEach((s) => {
		L.getProject().activeScenario = s.id;
		elements.forEach((el) => Object.keys(L.OVERRIDABLE[L.ovKeyGroup(L.ovKey(el))] || {}).forEach((p) => out.push(J(L.effective(el, p)))));
		settingPaths.forEach((p) => out.push(J(L.settingFor(s, p))));
		['demandMultiplier', 'duration', 'hydraulicStep'].forEach((k) => out.push(J(L.heldCalcOption(s, k))));
	});
	L.getProject().activeScenario = keep;
	return out.join('|');
}
// The saved project without `nextId`: undo recounts the id counters from the elements
// (recountNextId()), which an opened file states its own way. Nothing about the tree is in them.
function fileText() { const o = JSON.parse(L.projectFileText()); delete o.nextId; return JSON.stringify(o); }
console.log('\n--- 6. promote, and undo ---');
{
	let same = 0, n = 0, undone = 0, redone = 0, un = 0;
	for (let t = 0; t < 10; t++) {
		randomTree('Net1.lwn');
		L.getScenarios().filter((x) => !x.isBase).forEach((s) => {
			CATS_STORED.concat(['calculation']).forEach((cat) => {
				const was = everyValue();
				L.promoteImplicitAlternative(s.id, cat, s.name + ' ' + cat);
				n++;
				if (everyValue() === was) { same++; }
			});
		});
		for (let m = 0; m < 8; m++) {
			L.saveUndoSnapshot();
			const t0 = fileText();
			randomMutation();
			const t1 = fileText();
			if (t0 === t1) { continue; }
			un++;
			L.undo();
			if (fileText() === t0 && cacheFresh()) { undone++; }
			L.redo();
			if (fileText() === t1 && cacheFresh()) { redone++; }
		}
	}
	ok('promoting every category of every scenario changes no resolved value (' + same + '/' + n + ')', same === n);
	ok('...and leaves no scenario holding a local value in a category it names', !invariants().length, invariants().join(', '));
	ok('undo of a tree mutation gives back the saved project byte for byte (' + undone + '/' + un + ')', undone === un && un > 20);
	ok('...and redo gives back the mutated one (' + redone + '/' + un + ')', redone === un);
}

// ---------------------------------------------------------------------------
// 7. The API's refusals, and Peak Hour shared by a second scenario
// ---------------------------------------------------------------------------
console.log('\n--- 7. the API ---');
{
	open('Net1.lwn');
	const j = L.getDoc().nodes.filter((n) => n.type === 'junction')[0];
	elements = [j];
	const peak = L.createScenario('Peak Hour');
	L.setProp(j, 'demand', 300);
	const fire = L.createScenario('Fire at Peak Hour');
	ok('a scenario holding a local demand cannot just name an alternative', !!L.assignAlternative(peak.id, 'demand', L.createAlternative('demand', 'x', null).id).refused);
	L.deleteAlternative(L.getDoc().alternatives[0].id);
	const pd = L.promoteImplicitAlternative(peak.id, 'demand', 'Peak Demand');
	ok('promote stores Peak Hour\'s demand as a child of Base Demand, and names it', pd.parent === null && peak.alternatives.demand === pd.id && !peak.overrides[L.ovKey(j)]);
	ok('...a second scenario can now share it', L.assignAlternative(fire.id, 'demand', pd.id) === true);
	L.getProject().activeScenario = fire.id;
	ok('...and reads Peak Hour\'s demand', L.effective(j, 'demand') === 300);
	L.setProp(j, 'demand', 450);
	L.getProject().activeScenario = peak.id;
	ok('an edit in either changes both: the shared alternative took it', L.effective(j, 'demand') === 450 && pd.values[L.ovKey(j)].demand === 450);
	ok('...and the edit marker is on, in both', L.hasOverride(j, 'demand'));
	const del = L.deleteAlternative(pd.id);
	ok('deleting an alternative in use is refused, naming its users', del.refused && J(del.scenarios) === J([peak.id, fire.id]));
	ok('an alternative of another category cannot parent it', !!L.reparentAlternative(pd.id, L.createAlternative('physical', 'p', null).id).refused);
	const child = L.createAlternative('demand', 'Child', pd.id);
	ok('...nor can its own child (no loops)', !!L.reparentAlternative(pd.id, child.id).refused);
	ok('Calculation is not an alternative', !!L.createAlternative('calculation', 'c', null).refused);
	ok('a merge across categories is refused', L.mergeAlternativeInto(child.id, L.getDoc().alternatives.filter((a) => a.category === 'physical')[0].id).refused === 'category');
	ok('...a merge into its parent moves its users and children, and deletes it', L.mergeAlternativeInto(child.id, pd.id) === true && !L.getDoc().alternatives.some((a) => a.id === child.id));
	const cs = L.createCalcSet('Peak options', null);
	ok('a calculation set is named by a scenario', L.assignCalcSet(peak.id, cs.id, { discard: true }) === true);
	L.getProject().activeScenario = peak.id;
	L.calcTargetOf(peak).demandMultiplier = 2.5; L.touchTree();
	ok('...and its multiplier is the scenario\'s held one', L.heldCalcOption(peak, 'demandMultiplier') === 2.5 && peak.demandMultiplier === undefined);
	const cs2 = L.createCalcSet('Child options', cs.id);
	L.assignCalcSet(fire.id, cs2.id, { discard: true });
	ok('...a child set inherits what it does not state (a Base change would flow too)', L.heldCalcOption(fire, 'demandMultiplier') === 2.5);
	ok('...and deleting a set in use is refused', !!L.deleteCalcSet(cs.id).refused);
}

// ---------------------------------------------------------------------------
// 7b. A merge moves no value any user of the merged alternative reads
// ---------------------------------------------------------------------------
// Perry's two repros first, then every same-category pair of every random tree: an allowed merge
// leaves every scenario that used the source (directly, through a child alternative, or through a
// parent scenario) reading exactly what it read; a refused one changes nothing at all.
console.log('\n--- 7b. merge ---');
{
	function valuesOf(s) {
		const keep = L.getProject().activeScenario, out = [];
		L.getProject().activeScenario = s.id;
		elements.forEach((el) => Object.keys(L.OVERRIDABLE[L.ovKeyGroup(L.ovKey(el))] || {}).forEach((p) => out.push(J(L.effective(el, p)))));
		settingPaths.forEach((p) => out.push(J(L.settingFor(s, p))));
		L.getProject().activeScenario = keep;
		return out.join('|');
	}
	function usersOf(a) {
		return L.getScenarios().filter((s) => !s.isBase && L.treeLayers(s, a.category).some((l) => l.obj === a));
	}
	// Repro 1: a holds demand 9, t holds a demands list; same parent (Base).
	open('Net1.lwn');
	const j = L.getDoc().nodes.filter((n) => n.type === 'junction')[0], pipe = L.getDoc().links.filter((l) => l.type === 'pipe')[0];
	elements = [j, pipe];
	const s1 = L.createScenario('Uses a');
	const a = L.createAlternative('demand', 'a', null), t = L.createAlternative('demand', 't', null);
	a.values = {}; a.values[L.ovKey(j)] = { demand: 9 };
	t.values = {}; t.values[L.ovKey(j)] = { demands: [{ base: 100, pattern: null, category: 'x' }] };
	L.assignAlternative(s1.id, 'demand', a.id, { discard: true });
	L.touchTree();
	L.getProject().activeScenario = s1.id;
	const was = L.effective(j, 'demand');
	const r1 = L.mergeAlternativeInto(a.id, t.id);
	ok('a merge that would hand a demand list to its users is refused, saying why', was === 9 && r1.refused === 'values' && /start reading/.test(r1.why) && L.effective(j, 'demand') === 9);
	// The same pair as child and parent: allowed, and 9 stays 9 (the list takes row 0's base).
	L.reparentAlternative(a.id, t.id);
	ok('...as child and parent it is allowed, and the demand still reads 9',
		L.mergeAlternativeInto(a.id, t.id) === true && L.effective(j, 'demand') === 9 && s1.alternatives.demand === t.id);
	// Repro 2: aa, a child of p0 (diameter 123), into an unrelated tt.
	const s2 = L.createScenario('Uses aa');
	const p0 = L.createAlternative('physical', 'p0', null), aa = L.createAlternative('physical', 'aa', p0.id), tt = L.createAlternative('physical', 'tt', null);
	p0.values = {}; p0.values[L.ovKey(pipe)] = { diameter: 123 };
	L.assignAlternative(s2.id, 'physical', aa.id, { discard: true });
	L.touchTree();
	L.getProject().activeScenario = s2.id;
	const r2 = L.mergeAlternativeInto(aa.id, tt.id);
	ok('a merge into an unrelated alternative is refused, saying why', r2.refused === 'unrelated' && /ancestor/.test(r2.why) && L.effective(pipe, 'diameter') === 123);
	ok('...into its parent it is allowed, and 123 stays', L.mergeAlternativeInto(aa.id, p0.id) === true && L.effective(pipe, 'diameter') === 123);

	let tried = 0, allowed = 0, kept = 0, refusedClean = 0, refused = 0;
	for (let n = 0; n < 25; n++) {
		randomTree(pick(['Net1.lwn', 'Net2.lwn']));
		const alts = (L.getDoc().alternatives || []).slice();
		for (let i = 0; i < 6 && alts.length > 1; i++) {
			const src = pick(alts), tgt = pick(alts.filter((x) => x.category === src.category && x !== src));
			if (!tgt || !L.getDoc().alternatives.includes(src) || !L.getDoc().alternatives.includes(tgt)) { continue; }
			tried++;
			const users = usersOf(src), before = users.map(valuesOf), file = L.projectFileText();
			const r = L.mergeAlternativeInto(src.id, tgt.id);
			if (r === true) {
				allowed++;
				if (J(users.map(valuesOf)) === J(before)) { kept++; } else if (process.env.TREE_DEBUG) { console.log('MOVED', src.id, '->', tgt.id); }
			} else {
				refused++;
				if (L.projectFileText() === file) { refusedClean++; }
			}
		}
	}
	ok('every allowed merge leaves every user of the source reading what it read (' + kept + '/' + allowed + ' of ' + tried + ' tried)', kept === allowed && allowed > 10);
	ok('...and every refused one changes nothing (' + refusedClean + '/' + refused + ')', refusedClean === refused);
	ok('...and the merges break no invariant', !invariants().length, invariants().join(', '));
}

// ---------------------------------------------------------------------------
// 8. Maintenance reaches a stored alternative's values
// ---------------------------------------------------------------------------
console.log('\n--- 8. maintenance ---');
{
	open('Net1.lwn');
	const d = L.getDoc(), j = d.nodes.filter((n) => n.type === 'junction')[1], pipe = d.links.filter((l) => l.type === 'pipe')[0];
	const a = L.createAlternative('demand', 'Shared', null), ph = L.createAlternative('physical', 'Big pipes', null);
	a.values = {}; a.values[L.ovKey(j)] = { demand: 10, demands: [{ base: 10, pattern: '1', category: null }] };
	ph.values = {}; ph.values[L.ovKey(pipe)] = { diameter: 12 };
	L.touchTree();
	const oldId = j.id;
	L.applyNodeRename(oldId, 'RENAMED');
	ok('a node rename moves its key in a stored alternative', !!a.values[L.ovKey(j)] && !a.values['n:' + oldId] === true && j.id === 'RENAMED');
	L.libRepointPattern('1', 'P9');
	ok('a pattern rename reaches a stored alternative\'s demand list', a.values[L.ovKey(j)].demands[0].pattern === 'P9');
	L.convertUnitValues('lpn_u_diameter', 2);
	ok('a unit change converts a stored alternative\'s value', ph.values[L.ovKey(pipe)].diameter === 24);
	L.deleteNode(j.id);
	ok('a deletion purges the element from a stored alternative', !a.values || !Object.keys(a.values).some((k) => k.indexOf('RENAMED') >= 0));
}

// ---------------------------------------------------------------------------
// 9. Stage 5: a scenario of a scenario, and the view it inherits
// ---------------------------------------------------------------------------
// Tom, 2026-10-05: "Leaving doesn't do anything. Entering does everything." A scenario that holds
// or inherits a view moves the map there; one that holds none shows Base's live view.
console.log('\n--- 9. scenario parents and the held view ---');
{
	open('Net1.lwn');
	const d = L.getDoc(), j = d.nodes.filter((n) => n.type === 'junction')[0], pipe = d.links.filter((l) => l.type === 'pipe')[0];
	elements = [j, pipe];
	const base = L.baseScenario();
	L.switchScenario(base.id);
	const peak = L.createScenario('Peak Hour');
	L.setProp(j, 'demand', 500);
	peak.demandMultiplier = 3; L.touchTree();
	const fire = L.createScenario('Fire at Peak Hour', peak.id);
	ok('a child scenario is born with no multiplier of its own, so it inherits its parent\'s',
		fire.parent === peak.id && fire.demandMultiplier === undefined && L.heldCalcOption(fire, 'demandMultiplier') === 3);
	L.switchScenario(fire.id);
	ok('...and its parent\'s demand', L.effective(j, 'demand') === 500 && !L.hasOverride(j, 'demand'));
	L.setProp(j, 'demand', 900);
	ok('a local demand in the child is its own, and the parent keeps its', L.effective(j, 'demand') === 900 &&
		(L.switchScenario(peak.id), L.effective(j, 'demand') === 500));
	L.switchScenario(fire.id);
	ok('a loop of parents is refused', !!L.setScenarioParent(peak.id, fire.id).refused);
	ok('Base takes no parent', !!L.setScenarioParent(base.id, peak.id).refused);
	ok('deleting a scenario with a child is refused, naming it', J((L.deleteScenario(peak.id) || {}).children) === J([fire.id]));
	{
		L.switchScenario(peak.id);
		const row = L.scenarioMenuRows().filter((r) => r.label === global.EngCalcs.pageConfig.lpn_scenario_delete)[0];
		let said = '';
		const before = L.getScenarios().length;
		row.fn();
		said = (L.lastNotice() || {}).text || '';
		ok('...and the menu\'s Delete row says so instead of asking', L.getScenarios().length === before && said.indexOf(fire.name) >= 0 && said.indexOf('inherit') >= 0);
	}
	ok('...and a reparent to Base keeps its own values', L.setScenarioParent(fire.id, null) === true && fire.parent === undefined &&
		(L.switchScenario(fire.id), L.effective(j, 'demand') === 900) && L.heldCalcOption(fire, 'demandMultiplier') === undefined);
	L.setScenarioParent(fire.id, peak.id);
	ok('every value still agrees with the uncached walk', checkAll('stage 5'));

	// The view.
	L.switchScenario(base.id);
	const live = { cx: 10, cy: 20, s: 3 }, fig = { cx: 400, cy: -300, s: 0.5 };
	L.applyView(live);
	const near = (a, b) => !!a && !!b && Math.abs(a.cx - b.cx) < 1e-6 && Math.abs(a.cy - b.cy) < 1e-6 && Math.abs(a.s - b.s) < 1e-9;
	ok('a scenario can hold a view', L.setScenarioView(peak, fig) === true && near(L.heldView(peak), fig));
	ok('...which its child inherits', near(L.heldView(fire), fig));
	L.switchScenario(fire.id);
	ok('entering the child that inherits a held view goes there', near(L.currentView(), fig), J(L.currentView()));
	L.switchScenario(peak.id);
	ok('...entering its parent, which holds the same view, stays there', near(L.currentView(), fig));
	L.switchScenario(base.id);
	ok('...and entering Base shows Base\'s live view again', near(L.currentView(), live), J(L.currentView()));
	const plain = L.createScenario('Plain');
	L.switchScenario(fire.id);
	L.switchScenario(plain.id);
	ok('entering a scenario that holds no view shows Base\'s live view', near(L.currentView(), live), J(L.currentView()));
}

console.log('\n' + (fails ? fails + ' FAILED, ' : 'ALL PASS, ') + passes + ' passed');
process.exit(fails ? 1 : 0);
