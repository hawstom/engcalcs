// AN IMPORT MUST NOT REWRITE THE USER'S NUMBERS -- and a number is its TEXT as well as its value.
// Run with:
//   node dev/lpn-spike/inp-token-harness.js
//
// inp-passthrough-harness.js beside this one proves VALUE fidelity: 710 comes back as 710 and not
// as 709.9913664. This one proves REPRESENTATION fidelity, which is a different property and fails
// for a different reason. `parseFloat('710.0')` is exactly 710, so every check in that harness
// passes while the text is already gone; across EPA's own Net1/Net2/Net3, 243 of 2,608 numeric
// tokens are written in a form `String(parseFloat(t))` does not reproduce -- `220.0`, `20.00`,
// `4530.`. A file that round-trips through `String(value)` alone comes back reformatted.
//
// THE ASSERTION IS `===` ON STRINGS. Not "parses to the same number" -- that is the other
// harness's job and it would pass here vacuously. Byte-identical or nothing, which is Task 281's
// (`.inp` export) acceptance criterion written down before the exporter exists, so it lands with
// this already in place.
//
// THE EXPECTATION COMES OUT OF THE FILE, never out of a fixture. There is nothing on disk here to
// go stale and no second copy of the answer.
//
// Section 3 is the containment check, and it is the one a type system would have given for free:
// a token is a STRING, so `'710' * 2` is 1420 and `'710' + 1` is `'7101'`. It asserts that no
// numeric field of any parsed or imported record ever holds one.

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// The same deliberately-dumber second reader inp-passthrough-harness.js uses: section, id, column.
// Asking the real parser what the file says would be asking the defendant for the verdict.
function tokensBySection(text) {
	const out = {};
	let section = null;
	for (let raw of text.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { continue; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		out[section].push(line.split(/\s+/));
	}
	return out;
}

const REFERENCE = ['Net1.inp', 'Net2.inp', 'Net3.inp'];

// ---- 0. how much of this there is to get wrong ------------------------------------------------
// Counted rather than quoted from a comment. If a reference model is replaced and the surprising
// tokens go to zero, sections 1 and 2 would pass while proving nothing, and this number says so.
function countSurprising() {
	let total = 0, surprising = 0;
	REFERENCE.forEach((f) => {
		const text = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f), 'utf8');
		text.split(/\r?\n/).forEach((raw) => {
			const line = raw.replace(/;.*$/, '').trim();
			if (!line || line.charAt(0) === '[') { return; }
			line.split(/\s+/).forEach((t) => {
				if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t)) { return; }
				total++;
				if (String(parseFloat(t)) !== t) { surprising++; }
			});
		});
	});
	return { total, surprising };
}

console.log('\n0. There is something here to lose');
const counted = countSurprising();
console.log('  ' + counted.surprising + ' of ' + counted.total + ' numeric tokens in Net1/Net2/Net3 (' +
	(100 * counted.surprising / counted.total).toFixed(1) + '%) are text String(parseFloat(t)) does not reproduce');
ok('the reference models still contain surprising tokens', counted.surprising > 100, counted.surprising);

// ---- 1. the parser keeps the file's own text --------------------------------------------------
// EngCalcs.lpnNumText(rec, key, value) is the ONE reader, and it returns a string in every branch.
function checkParsed(inpPath) {
	const text = fs.readFileSync(inpPath, 'utf8');
	const sec = tokensBySection(text);
	const parsed = EngCalcs.lpnInpParse(text);
	const tag = path.basename(inpPath) + ': ';
	ok(tag + 'parses', parsed.ok, JSON.stringify(parsed.error));
	if (!parsed.ok) { return; }

	const node = {}, link = {};
	parsed.nodes.forEach((n) => { node[n.id] = n; });
	parsed.links.forEach((l) => { link[l.id] = l; });

	// [id, section, {column: field}] -- exactly the columns js/lpn-inp.js stores verbatim.
	const NODE_COLS = {
		JUNCTIONS: { 1: 'elev', 2: 'demand' },
		// A reservoir's one column is a total HEAD, and since Task 390 it is stored as one -- no
		// ground elevation is invented from it.
		RESERVOIRS: { 1: 'head' },
		TANKS: { 1: 'elev', 2: 'level', 3: 'minLevel', 4: 'maxLevel', 5: 'diameter' },
		COORDINATES: { 1: 'x', 2: 'y' }
	};
	const LINK_COLS = { PIPES: { 3: 'length', 4: 'diameter', 5: 'roughness', 6: 'k' } };

	// A junction whose demand [DEMANDS] replaces states a number the [JUNCTIONS] column no longer
	// holds, so its text is not expected to survive -- and that is asserted the other way in
	// section 3, which forbids a stale token rather than merely not requiring a fresh one.
	const replaced = {};
	(sec.DEMANDS || []).forEach((d) => { replaced[d[0]] = true; });

	Object.keys(NODE_COLS).forEach((s) => {
		(sec[s] || []).forEach((r) => {
			const n = node[r[0]];
			if (!n) { return; }
			Object.keys(NODE_COLS[s]).forEach((col) => {
				const field = NODE_COLS[s][col], t = r[col];
				if (t === undefined) { return; }
				if (s === 'JUNCTIONS' && field === 'demand' && replaced[r[0]]) { return; }
				ok(tag + s + ' ' + r[0] + '.' + field + ' keeps its text',
					EngCalcs.lpnNumText(n, field, n[field]) === t,
					JSON.stringify(EngCalcs.lpnNumText(n, field, n[field])) + ' vs ' + JSON.stringify(t));
			});
		});
	});
	Object.keys(LINK_COLS).forEach((s) => {
		(sec[s] || []).forEach((r) => {
			const l = link[r[0]];
			if (!l) { return; }
			Object.keys(LINK_COLS[s]).forEach((col) => {
				const field = LINK_COLS[s][col], t = r[col];
				if (t === undefined) { return; }
				ok(tag + s + ' ' + r[0] + '.' + field + ' keeps its text',
					EngCalcs.lpnNumText(l, field, l[field]) === t,
					JSON.stringify(EngCalcs.lpnNumText(l, field, l[field])) + ' vs ' + JSON.stringify(t));
			});
		});
	});
}

console.log('\n1. js/lpn-inp.js hands back the file\'s own text, character for character');
REFERENCE.forEach((f) => checkParsed(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f)));

// ---- 2. the text survives the trip into the document ------------------------------------------
// The parser keeping a token is worthless if docFromInp() drops it, which is where the VALUE
// fidelity bug lived. Same expectation, read through the document's own field names.
const DOC_NODE = { elev: 'elev', demand: '_demand', level: '_level', minLevel: 'minLevel', maxLevel: 'maxLevel', diameter: 'tankDiameter' };
const DOC_LINK = { length: '_length', diameter: '_diameter', roughness: '_roughness', k: '_k' };

function checkDoc(inpPath) {
	const text = fs.readFileSync(inpPath, 'utf8');
	const sec = tokensBySection(text);
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { return; }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const saved = L.docFromInp(parsed, path.basename(inpPath));
	const node = {}, link = {};
	saved.nodes.forEach((n) => { node[n.id] = n; });
	saved.links.forEach((l) => { link[l.id] = l; });
	const tag = path.basename(inpPath) + ': ';
	const replaced = {};
	(sec.DEMANDS || []).forEach((d) => { replaced[d[0]] = true; });

	const NODE_COLS = {
		JUNCTIONS: { 1: 'elev', 2: 'demand' },
		RESERVOIRS: { 1: 'elev' },
		TANKS: { 1: 'elev', 2: 'level', 3: 'minLevel', 4: 'maxLevel', 5: 'diameter' }
	};
	Object.keys(NODE_COLS).forEach((s) => {
		(sec[s] || []).forEach((r) => {
			const n = node[r[0]];
			if (!n) { return; }
			Object.keys(NODE_COLS[s]).forEach((col) => {
				const field = DOC_NODE[NODE_COLS[s][col]], t = r[col];
				if (t === undefined || !(field in n)) { return; }
				if (s === 'JUNCTIONS' && NODE_COLS[s][col] === 'demand' && replaced[r[0]]) { return; }
				ok(tag + 'doc ' + r[0] + '.' + field + ' keeps its text',
					EngCalcs.lpnNumText(n, field, n[field]) === t,
					JSON.stringify(EngCalcs.lpnNumText(n, field, n[field])) + ' vs ' + JSON.stringify(t));
			});
		});
	});
	(sec.PIPES || []).forEach((r) => {
		const l = link[r[0]];
		if (!l) { return; }
		[[3, 'length'], [4, 'diameter'], [5, 'roughness'], [6, 'k']].forEach(([col, key]) => {
			const field = DOC_LINK[key], t = r[col];
			if (t === undefined) { return; }
			ok(tag + 'doc ' + r[0] + '.' + field + ' keeps its text',
				EngCalcs.lpnNumText(l, field, l[field]) === t,
				JSON.stringify(EngCalcs.lpnNumText(l, field, l[field])) + ' vs ' + JSON.stringify(t));
		});
	});

	// A SAVE MUST NOT LOSE IT EITHER. The document goes to localStorage and to a `.json` file as
	// JSON, so the round trip is asserted rather than assumed -- a `tok` bag on a non-enumerable
	// property, or one hung off an Array, would vanish here and nowhere else.
	const revived = JSON.parse(JSON.stringify(saved));
	const rNode = {};
	revived.nodes.forEach((n) => { rNode[n.id] = n; });
	saved.nodes.forEach((n) => {
		if (!n.tok) { return; }
		Object.keys(n.tok).forEach((k) => {
			ok(tag + 'JSON round trip keeps ' + n.id + '.' + k, rNode[n.id].tok && rNode[n.id].tok[k] === n.tok[k]);
		});
	});
}

console.log('\n2. docFromInp() carries the text onto the document, and a save keeps it');
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
REFERENCE.forEach((f) => checkDoc(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f)));

// ---- 3. a token can never reach arithmetic ----------------------------------------------------
// The hazard a type system would have caught. Every token lives under a `tok` bag and nowhere
// else, so: no field outside `tok` is a string that looks like a number, and every entry inside a
// `tok` bag is a string that parses to the value the record holds under that name.
console.log('\n3. A token is a string, and no string ever sits where a number belongs');
function auditRecord(tag, rec) {
	Object.keys(rec).forEach((k) => {
		const v = rec[k];
		if (k === 'tok') {
			Object.keys(v).forEach((tk) => {
				ok(tag + '.tok.' + tk + ' is a string', typeof v[tk] === 'string', typeof v[tk]);
				ok(tag + '.tok.' + tk + ' still states ' + tk, parseFloat(v[tk]) === rec[tk],
					JSON.stringify(v[tk]) + ' vs ' + rec[tk]);
			});
			return;
		}
		// id/type/from/to/status/text/valveType/settingUnit and friends are legitimately strings;
		// what must never happen is a NUMERIC field holding one.
		if (typeof v !== 'string') { return; }
		// ID-BEARING FIELDS, which are exempt because an EPANET id is often written as a numeral --
		// Net3's demand patterns are called 1 to 5. They are NAMES, and a name that looks like a
		// number is still a name; the rule this check enforces is that a field holding a QUANTITY
		// never holds text.
		ok(tag + '.' + k + ' is not a number wearing a string',
			!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(v) ||
			k === 'id' || k === 'from' || k === 'to' ||
			k === 'demandPattern' || k === 'headPattern' || k === 'speedPattern',
			k + ' = ' + JSON.stringify(v));
	});
}
REFERENCE.forEach((f) => {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f), 'utf8'));
	if (!parsed.ok) { return; }
	parsed.nodes.forEach((n) => auditRecord(f + ' node ' + n.id, n));
	parsed.links.forEach((l) => {
		auditRecord(f + ' link ' + l.id, l);
		(l.verts || []).forEach((v, i) => auditRecord(f + ' vert ' + l.id + '#' + i, v));
	});
	parsed.labels.forEach((lb, i) => auditRecord(f + ' label#' + i, lb));
});

// A stale token is the one failure mode the read-time guard exists for: change the number and the
// text must stop being offered, with no edit path having had to clear it.
const stale = { elev: 710, tok: { elev: '710.0' } };
ok('an unedited value offers its own text', EngCalcs.lpnNumText(stale, 'elev', 710) === '710.0');
stale.elev = 715;
ok('an EDITED value drops the stale text', EngCalcs.lpnNumText(stale, 'elev', 715) === '715');
ok('a record with no tok answers String(value)', EngCalcs.lpnNumText({ elev: 12.5 }, 'elev', 12.5) === '12.5');
ok('lpnNumText always returns a string', typeof EngCalcs.lpnNumText(null, 'elev', 3) === 'string');

console.log('');
if (fails) { console.log(fails + ' FAILED of ' + checks); process.exit(1); }
console.log('all ' + checks + ' token-fidelity checks passed');
