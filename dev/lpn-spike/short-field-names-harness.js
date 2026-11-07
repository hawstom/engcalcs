// EVERY PLACE THAT NAMES A FIELD USES THE KEY THE PROPERTIES BOX USES (Task 849). Run with:
//   node dev/lpn-spike/short-field-names-harness.js
//
// Tom, 2026-10-28: the short name Properties shows (Active, Initial depth, Minor loss, k, Type)
// is the name everywhere, except where he agreed the long one stays: Settings, Find, map labels,
// the .inp upload and the reports. For each field this asserts that the Tables heading, the
// Change type box and the unit-change question render the Properties key's text, in English and
// again in Spanish. Spanish is the proof: two keys can read alike in English, but only one KEY
// gives the same words in every language. A last section holds the places that stay long, so
// that deliberate difference is a decision on record and not drift.
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const fs = require('fs');
const PC = global.EngCalcs.pageConfig;

function readLang(code) {
	const src = fs.readFileSync(ROOT + 'lib/lang.ec.' + code + '.php', 'utf8');
	const re = /^\$ec_lang\['([a-z0-9_]+)'\]\s*=\s*'((?:[^'\\]|\\.)*)';$/gm;
	const out = {};
	let m;
	while ((m = re.exec(src))) { out[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'); }
	return out;
}
const EN = Object.assign({}, PC);
const ES = Object.assign({}, EN, readLang('es'));

const INJECT =
	"\t\tpaneTables: paneTables, paneCols: paneCols, addNode: addNode, addLink: addLink,\n" +
	"\t\tpushSpecList: pushSpecList, typeOwnedNodeSpecs: typeOwnedNodeSpecs, typeOwnedLinkSpecs: typeOwnedLinkSpecs,\n" +
	"\t\tunitServes: unitServes, propOrder: function () { return PROP_ORDER; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined || cond ? '' : '   ' + extra));
}

const L = loadLoopedNetwork(INJECT);
setUnitSet('us');
L.buildLayers();

// field | the Properties key | Tables columns [table id, column key] | change-type spec property
const TABLE_ELEMENTS = { junctions: 'junction', reservoirs: 'reservoir', tanks: 'tank', pipes: 'pipe', pumps: 'pump', valves: 'valve', text: 'text' };
const FIELDS = [
	{ field: 'active', pkey: 'lpn_field_active_short', tables: ['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves', 'text'], col: 'active' },
	{ field: 'check valve', pkey: 'lpn_field_cv_short', tables: ['pipes'], col: 'cv' },
	{ field: 'minor loss, pipe', pkey: 'lpn_field_km_short', tables: ['pipes'], col: 'km', spec: 'k' },
	{ field: 'minor loss, valve', pkey: 'lpn_field_km_short', tables: ['valves'], col: 'km' },
	{ field: 'initial depth', pkey: 'lpn_field_tank_level_short', tables: ['tanks'], col: 'level', spec: 'level', unit: true },
	{ field: 'minimum depth', pkey: 'lpn_field_tank_minlevel_short', tables: ['tanks'], col: 'minLevel', spec: 'minLevel' },
	{ field: 'maximum depth', pkey: 'lpn_field_tank_maxlevel_short', tables: ['tanks'], col: 'maxLevel', spec: 'maxLevel' },
	{ field: 'valve type', pkey: 'lpn_full_col_type', tables: ['valves'], col: 'valveType' },
	{ field: 'bulk reaction', pkey: 'lpn_reaction_bulk_short', spec: 'bulkCoeff' },
	{ field: 'wall reaction', pkey: 'lpn_reaction_wall_short', spec: 'wallCoeff' },
	{ field: 'tank reaction', pkey: 'lpn_reaction_tank_short', spec: 'tankCoeff' }
];
// Where a long name stays, by Tom's 2026-10-28 agreement: Find and Settings read pushSpecList().
const STAY_LONG = [
	{ spec: 'level', key: 'lpn_field_tank_level' }, { spec: 'minLevel', key: 'lpn_field_tank_minlevel' },
	{ spec: 'maxLevel', key: 'lpn_field_tank_maxlevel' }, { spec: 'k', key: 'lpn_field_km' },
	{ spec: 'bulkCoeff', key: 'lpn_reaction_bulk' }, { spec: 'wallCoeff', key: 'lpn_reaction_wall' }
];

function resolve(label, pc) {
	if (typeof label === 'function') { return label(); }
	return pc[label] !== undefined ? pc[label] : label;
}

const r1 = L.addNode('reservoir', 0, 0), j1 = L.addNode('junction', 100, 0), tk = L.addNode('tank', 200, 0);
const pipe = L.addLink('pipe', r1.id, j1.id);
const specs = {};

[['en', EN], ['es', ES]].forEach(function (pair) {
	const lang = pair[0], src = pair[1];
	Object.keys(src).forEach(function (k) { PC[k] = src[k]; });
	console.log('\n--- ' + lang + ' ---');
	const order = L.propOrder(), tables = {};
	L.paneTables().forEach(function (t) { tables[t.id] = t; });
	const nodeSpecs = L.typeOwnedNodeSpecs(), linkSpecs = L.typeOwnedLinkSpecs(pipe);
	function specLabel(prop) {
		const hit = nodeSpecs.concat(linkSpecs).filter(function (s) { return s.props && s.props.indexOf(prop) >= 0; })[0];
		return hit ? hit.label : undefined;
	}
	FIELDS.forEach(function (f) {
		const want = src[f.pkey];
		ok(lang + ' ' + f.field + ': the key has text', !!want, f.pkey);
		if (lang === 'es' && f.pkey !== 'lpn_full_col_type' && f.pkey !== 'lpn_field_active_short') {
			ok(lang + ' ' + f.field + ': the Spanish is its own words, not the English', want !== EN[f.pkey], want);
		}
		(f.tables || []).forEach(function (tid) {
			ok(lang + ' ' + f.field + ': Properties for a ' + TABLE_ELEMENTS[tid] + ' is built on ' + f.pkey,
				(order[TABLE_ELEMENTS[tid]] || []).indexOf(f.pkey) >= 0);
			const col = L.paneCols(tables[tid]).filter(function (c) { return c.key === f.col; })[0];
			ok(lang + ' ' + f.field + ': the ' + tid + ' table heading is the Properties text', !!col && resolve(col.label, src) === want,
				col ? resolve(col.label, src) + ' vs ' + want : 'no column ' + f.col);
		});
		if (f.spec) {
			ok(lang + ' ' + f.field + ': the Change type box says the Properties text', specLabel(f.spec) === want, specLabel(f.spec) + ' vs ' + want);
		}
		if (f.unit) {
			ok(lang + ' ' + f.field + ': the unit-change question names the Properties text', L.unitServes('lpn_u_elevhead').indexOf(want) >= 0,
				JSON.stringify(L.unitServes('lpn_u_elevhead')));
		}
	});
	STAY_LONG.forEach(function (s) {
		const hit = L.pushSpecList().filter(function (x) { return x.prop === s.spec; })[0];
		ok(lang + ' ' + s.spec + ': Find and Settings keep the long name (Tom, 2026-10-28)', !!hit && hit.label === src[s.key], hit && hit.label);
	});
});

console.log('\n' + (checks - fails) + '/' + checks + ' checks passed');
process.exit(fails ? 1 : 0);
