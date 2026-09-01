// AN EXPORT MUST HAND THE USER'S OWN NUMBERS BACK. Run with:
//   node dev/lpn-spike/inp-export-harness.js
//
// Task 281's acceptance criterion, and it is one sentence: IMPORT THEN EXPORT IS BYTE-IDENTICAL FOR
// EVERY VALUE THE USER DID NOT EDIT. Not "within tolerance" -- identical, on strings, with `===`.
// inp-passthrough-harness.js proves the import half keeps the VALUE and inp-token-harness.js that it
// keeps the TEXT; this one closes the loop and proves the writer spends neither.
//
// WHY `===` AND NOT A TOLERANCE, in one line each (the two harnesses beside this have the full
// argument): a value normalised and converted back is not the same double -- 710 ft came back as
// 709.9913664 -- and `String(parseFloat('220.0'))` is `'220'`, so 243 of Net1/2/3's 2,608 numeric
// tokens are reformatted by any writer that formats at all. Both failures are invisible to a
// tolerance and both are the user's data.
//
// THE EXPECTATION IS THE FILE. Every assertion here compares the exported text against the ORIGINAL
// `.inp`, token by token, through a deliberately dumber second reader. There is no fixture to go
// stale and no second copy of the answer.
//
// THE THREE THINGS THAT GENUINELY CANNOT COME BACK AS TEXT are excluded by name and for a stated
// reason -- not skipped quietly:
//   1. an EMITTER coefficient, which has no display unit on this page and is the reader's own
//      documented conversion (js/lpn-inp.js at [EMITTERS]);
//   2. a CURVE point, because the reader deliberately keeps no token for one and docFromInp() maps
//      the points through a new array, so there is nowhere for the text to survive. The VALUE is
//      still asserted;
//   3. the [JUNCTIONS] demand COLUMN of a junction whose demands [DEMANDS] states. EPANET DISCARDS
//      that column when [DEMANDS] carries rows for the node, so it is not part of the model at all
//      and this writer leaves it off entirely, exactly as EPANET's own writer does. The rows
//      themselves DO come back character for character since Task 468 -- asserted, with categories
//      and patterns on them, by dev/lpn-spike/demand-category-harness.js.

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
function done(label) { console.log('  ' + (fails ? 'FAIL ' : 'ok   ') + label + '   ' + checks + ' checks'); }

// The same deliberately-dumber reader the other two use: section, id, column. Asking the real parser
// what the file says would be asking the defendant for the verdict.
function tokensBySection(text) {
	const out = {};
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { continue; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		out[section].push(line.split(/\s+/));
	}
	return out;
}
function rowsById(rows) {
	const out = {};
	(rows || []).forEach((r) => { if (!(r[0] in out)) { out[r[0]] = r; } });
	return out;
}

function importDoc(inpPath) {
	const text = fs.readFileSync(inpPath, 'utf8');
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { throw new Error(inpPath + ': ' + parsed.error); }
	// The import path in full: the units strip moves to the file's units FIRST, exactly as
	// importInpFromFile() does, because docFromInp() is written against the selector state.
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	return { text, parsed, doc: L.docFromInp(parsed, path.basename(inpPath)) };
}

const REFERENCE = ['Net1.inp', 'Net2.inp', 'Net3.inp'];
const refPath = (f) => path.join(ROOT, 'dev', 'lpn-spike', 'reference', f);

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// ---- 0. the two flow-unit tables are inverses --------------------------------------------------
// js/lpn-inp.js's FLOW_KEYWORD_UNIT (writing) and js/looped-network.js's LPN_INP_FLOW_UNIT (reading)
// are the same mapping in opposite directions. Two hand-written tables that must agree are two
// tables that will not, so this reads both out of the SOURCE rather than trusting either.
console.log('\n0. the writer\'s flow-keyword table is the exact inverse of the reader\'s');
{
	function tableFrom(file, name) {
		const src = fs.readFileSync(ROOT + file, 'utf8');
		const m = new RegExp('var ' + name + ' = \\{([^}]*)\\}').exec(src);
		if (!m) { throw new Error('cannot find ' + name + ' in ' + file + ' -- fix the parse, do not restate the table'); }
		const out = {};
		for (const p of m[1].matchAll(/(\w+)\s*:\s*'([^']+)'/g)) { out[p[1]] = p[2]; }
		return out;
	}
	const write = tableFrom('js/lpn-inp.js', 'FLOW_KEYWORD_UNIT');
	const read = tableFrom('js/looped-network.js', 'LPN_INP_FLOW_UNIT');
	ok('both tables hold all ten EPANET keywords',
		Object.keys(write).length === 10 && Object.keys(read).length === 10,
		Object.keys(write).length + ' / ' + Object.keys(read).length);
	Object.keys(read).forEach((kw) => {
		ok('keyword ' + kw + ' maps to the same unit both ways', write[kw] === read[kw], write[kw] + ' vs ' + read[kw]);
	});
}
done('the keyword tables agree');

// ---- 1. byte identity, token by token, against EPA's own models --------------------------------
console.log('\n1. Every number in EPA Net1/Net2/Net3 comes back out character for character');
let identical = 0, compared = 0;
REFERENCE.forEach((f) => {
	const { text, doc } = importDoc(refPath(f));
	const out = EngCalcs.lpnExportInp(doc);
	ok(f + ' exports', out.ok === true, JSON.stringify(out.error));
	if (!out.ok) { return; }
	const src = tokensBySection(text), got = tokensBySection(out.inp);
	const tag = f + ': ';

	// A token is compared as a STRING, and the check counts as well as asserts: a comparison that
	// silently matched nothing would pass, which is the failure mode this repo has been bitten by.
	function same(label, a, b) {
		compared++;
		if (a === b) { identical++; }
		ok(label, a === b, JSON.stringify(a) + ' vs ' + JSON.stringify(b));
	}

	// Which junctions [DEMANDS] rewrites -- their demand is a sum no token states.
	const multi = {};
	const seenDemand = {};
	(src.DEMANDS || []).forEach((r) => {
		if (seenDemand[r[0]]) { multi[r[0]] = 1; }
		seenDemand[r[0]] = 1;
	});

	const gotJ = rowsById(got.JUNCTIONS);
	(src.JUNCTIONS || []).forEach((r) => {
		const g = gotJ[r[0]];
		ok(tag + 'J ' + r[0] + ' is in the export', !!g);
		if (!g) { return; }
		same(tag + 'J ' + r[0] + ' elevation', g[1], r[1]);
		if (r[2] !== undefined && !multi[r[0]] && !(src.DEMANDS || []).some((d) => d[0] === r[0])) {
			same(tag + 'J ' + r[0] + ' demand', g[2], r[2]);
		}
	});
	const gotR = rowsById(got.RESERVOIRS);
	(src.RESERVOIRS || []).forEach((r) => {
		const g = gotR[r[0]];
		ok(tag + 'R ' + r[0] + ' is in the export', !!g);
		if (g) { same(tag + 'R ' + r[0] + ' head', g[1], r[1]); }
	});
	const gotT = rowsById(got.TANKS);
	(src.TANKS || []).forEach((r) => {
		const g = gotT[r[0]];
		ok(tag + 'T ' + r[0] + ' is in the export', !!g);
		if (!g) { return; }
		['elevation', 'initial level', 'minimum level', 'maximum level', 'diameter'].forEach((what, i) => {
			same(tag + 'T ' + r[0] + ' ' + what, g[i + 1], r[i + 1]);
		});
	});
	const gotP = rowsById(got.PIPES);
	(src.PIPES || []).forEach((r) => {
		const g = gotP[r[0]];
		ok(tag + 'P ' + r[0] + ' is in the export', !!g);
		if (!g) { return; }
		same(tag + 'P ' + r[0] + ' length', g[3], r[3]);
		same(tag + 'P ' + r[0] + ' diameter', g[4], r[4]);
		same(tag + 'P ' + r[0] + ' roughness', g[5], r[5]);
		if (r[6] !== undefined) { same(tag + 'P ' + r[0] + ' minor loss', g[6], r[6]); }
	});
	const gotC = rowsById(got.COORDINATES);
	(src.COORDINATES || []).forEach((r) => {
		const g = gotC[r[0]];
		ok(tag + 'XY ' + r[0] + ' is in the export', !!g);
		if (!g) { return; }
		same(tag + 'XY ' + r[0] + ' x', g[1], r[1]);
		same(tag + 'XY ' + r[0] + ' y', g[2], r[2]);
	});
	// [LABELS] is positional rather than keyed, and EPANET's point is the label's upper-left corner
	// -- which is exactly what an imported label stores, so these must be untouched.
	(src.LABELS || []).forEach((r, i) => {
		const g = (got.LABELS || [])[i];
		ok(tag + 'label ' + i + ' is in the export', !!g);
		if (!g) { return; }
		same(tag + 'label ' + i + ' x', g[0], r[0]);
		same(tag + 'label ' + i + ' y', g[1], r[1]);
	});
	// The file's own flow keyword must come back, or every number above is in a different unit than
	// the file says it is.
	const gotUnits = (got.OPTIONS || []).find((r) => (r[0] || '').toUpperCase() === 'UNITS');
	const srcUnits = (src.OPTIONS || []).find((r) => (r[0] || '').toUpperCase() === 'UNITS');
	ok(tag + 'the flow keyword is the file\'s own', gotUnits && srcUnits && gotUnits[1] === srcUnits[1],
		JSON.stringify(gotUnits) + ' vs ' + JSON.stringify(srcUnits));
});
console.log('  ' + compared + ' numeric tokens compared, ' + identical + ' byte-identical');
ok('every compared token is byte-identical', identical === compared, (compared - identical) + ' differ');
// A count this low would mean the loops above matched nothing and passed for the wrong reason.
ok('the comparison actually compared the models', compared > 500, String(compared));
done('EPA models export their own numbers');

// ---- 2. the round trip: export, re-import, same document ---------------------------------------
console.log('\n2. The exported file re-imports as the same network');
REFERENCE.concat(['import-cases.inp']).forEach((f) => {
	const first = importDoc(refPath(f));
	const out = EngCalcs.lpnExportInp(first.doc);
	ok(f + ' exports', out.ok === true, JSON.stringify(out.error));
	if (!out.ok) { return; }
	const back = EngCalcs.lpnInpParse(out.inp);
	ok(f + ' re-imports', back.ok === true, JSON.stringify(back.error));
	if (!back.ok) { return; }
	L.applyUnitSelections(L.inpUnitSelections(back));
	const again = L.docFromInp(back, f);

	// A curveless pump becomes a pipe on the way out, by construction and reported, so the counts
	// are compared per TYPE with that one substitution allowed for.
	const noCurve = first.doc.links.filter((l) => l.type === 'pump' && !(l.curvePoints || []).length).length;
	ok(f + ' every node returns', again.nodes.length === first.doc.nodes.length,
		again.nodes.length + ' vs ' + first.doc.nodes.length);
	ok(f + ' every link returns', again.links.length === first.doc.links.length,
		again.links.length + ' vs ' + first.doc.links.length);
	ok(f + ' every label returns', again.labels.length === first.doc.labels.length,
		again.labels.length + ' vs ' + first.doc.labels.length);
	ok(f + ' the curveless pumps are the reported ones',
		out.differences.filter((d) => d.code === 'pump-no-curve-as-pipe').length === noCurve);

	const was = {}, now = {};
	first.doc.nodes.forEach((n) => { was['n' + n.id] = n; });
	again.nodes.forEach((n) => { now['n' + n.id] = n; });
	first.doc.links.forEach((l) => { was['l' + l.id] = l; });
	again.links.forEach((l) => { now['l' + l.id] = l; });

	// VALUES, on every field the document holds. `===` again: the writer converts nothing on this
	// path, so a difference of any size is a defect and not a rounding.
	first.doc.nodes.forEach((n) => {
		const b = now['n' + n.id];
		ok(f + ' node ' + n.id + ' returns', !!b);
		if (!b) { return; }
		ok(f + ' node ' + n.id + ' type', b.type === n.type, b.type + ' vs ' + n.type);
		['elev', '_head', '_demand', '_level', 'minLevel', 'maxLevel', 'tankDiameter', 'x', 'y'].forEach((k) => {
			if (n[k] === undefined) { return; }
			ok(f + ' node ' + n.id + '.' + k, b[k] === n[k], b[k] + ' vs ' + n[k]);
		});
		// The one converted quantity, so this is a tolerance ON PURPOSE and the only one in the file.
		if (n._emitter) {
			ok(f + ' node ' + n.id + ' emitter within 1e-12 relative',
				Math.abs(b._emitter - n._emitter) <= 1e-12 * Math.abs(n._emitter), b._emitter + ' vs ' + n._emitter);
		}
	});
	first.doc.links.forEach((l) => {
		const b = now['l' + l.id];
		ok(f + ' link ' + l.id + ' returns', !!b);
		if (!b) { return; }
		const substituted = l.type === 'pump' && !(l.curvePoints || []).length;
		if (!substituted) { ok(f + ' link ' + l.id + ' type', b.type === l.type, b.type + ' vs ' + l.type); }
		ok(f + ' link ' + l.id + ' ends', b.from === l.from && b.to === l.to);
		if (l.type === 'pipe') {
			['_length', '_diameter', '_roughness', '_k', '_status'].forEach((k) => {
				ok(f + ' link ' + l.id + '.' + k, b[k] === l[k], b[k] + ' vs ' + l[k]);
			});
			ok(f + ' link ' + l.id + ' keeps its bends', (b.verts || []).length === (l.verts || []).length);
			(l.verts || []).forEach((v, i) => {
				ok(f + ' link ' + l.id + ' vertex ' + i, b.verts[i].x === v.x && b.verts[i].y === v.y);
			});
		}
		if (l.type === 'valve') {
			ok(f + ' valve ' + l.id + ' type', b.valveType === l.valveType, b.valveType + ' vs ' + l.valveType);
			ok(f + ' valve ' + l.id + ' setting', b._setting === l._setting, b._setting + ' vs ' + l._setting);
			ok(f + ' valve ' + l.id + ' diameter', b._diameter === l._diameter, b._diameter + ' vs ' + l._diameter);
			ok(f + ' valve ' + l.id + ' k', b._k === l._k, b._k + ' vs ' + l._k);
		}
		if (l.type === 'pump' && !substituted) {
			// The VALUE of every curve point, though not its text -- see the header.
			ok(f + ' pump ' + l.id + ' curve point count',
				(b.curvePoints || []).length === l.curvePoints.length);
			l.curvePoints.forEach((pt, i) => {
				ok(f + ' pump ' + l.id + ' curve point ' + i,
					b.curvePoints[i][0] === pt[0] && b.curvePoints[i][1] === pt[1],
					JSON.stringify(b.curvePoints[i]) + ' vs ' + JSON.stringify(pt));
			});
		}
	});
	first.doc.labels.forEach((lb, i) => {
		const b = again.labels[i];
		ok(f + ' label ' + i + ' returns', !!b);
		if (!b) { return; }
		ok(f + ' label ' + i + ' text', b._text === lb._text, b._text + ' vs ' + lb._text);
		ok(f + ' label ' + i + ' x', b.x === lb.x, b.x + ' vs ' + lb.x);
		ok(f + ' label ' + i + ' y', b.y === lb.y, b.y + ' vs ' + lb.y);
		ok(f + ' label ' + i + ' anchor', (b.anchorNode || null) === (lb.anchorNode || null));
	});
});
done('the round trip returns the same network');

// ---- 3. the label corner shift, with an answer stated by hand ----------------------------------
//
// EPANET's [LABELS] point is the UPPER-LEFT CORNER; this page anchors a drawn label at its CENTRE.
// A label centred at (100, 200) that measures 30 wide and 10 high therefore has its corner at
// x = 100 - 15 = 85 and, in the Cartesian frame the document stores, y = 200 + 5 = 205. Those two
// numbers are worked out here rather than read off the code.
console.log('\n3. A centred label is written from its upper-left corner');
{
	const base = {
		units: { lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_diameter: 'in', lpn_u_flow: 'gpm' },
		settings: { method: 'hw', emitterExponent: 0.5 },
		project: { name: 'label case' },
		origin: { x: 0, y: 0 },
		nodes: [{ id: 'J1', type: 'junction', x: 0, y: 0, elev: 10, _demand: 0 }],
		links: [],
		labels: [
			{ id: 'X1', _text: 'CENTRED', x: 100, y: 200, anchorNode: null, sizeMult: 1 },
			{ id: 'X2', _text: 'CORNERED', x: 100, y: 200, anchorNode: null, align: 'left', valign: 'top', sizeMult: 1 }
		]
	};
	const out = EngCalcs.lpnExportInp(base, { labelSize: () => ({ w: 30, h: 10 }) });
	ok('exports', out.ok === true, JSON.stringify(out.error));
	const rows = tokensBySection(out.inp).LABELS || [];
	ok('a centred label moves half its width left', rows[0] && rows[0][0] === '85', rows[0] && rows[0][0]);
	ok('a centred label moves half its height up', rows[0] && rows[0][1] === '205', rows[0] && rows[0][1]);
	// An imported label is ALREADY stored at EPANET's corner, so the measurer must not move it. This
	// is the assertion that keeps section 1's label coordinates honest.
	ok('a left/top label is written where it sits', rows[1] && rows[1][0] === '100' && rows[1][1] === '200',
		rows[1] && rows[1].join(','));

	// With no measurer there is nothing to shift by, so the point goes out unmoved and the difference
	// is REPORTED -- guessing at a width would be worse than saying so.
	const bare = EngCalcs.lpnExportInp(base);
	const bareRows = tokensBySection(bare.inp).LABELS || [];
	ok('unmeasured, the centred label is written unshifted', bareRows[0] && bareRows[0][0] === '100');
	ok('unmeasured, the centred label is reported',
		bare.differences.some((d) => d.code === 'label-anchor-unmeasured' && d.ids.indexOf('X1') >= 0));
	ok('unmeasured, the left/top label is NOT reported',
		!bare.differences.some((d) => d.code === 'label-anchor-unmeasured' && d.ids.indexOf('X2') >= 0));

	// A multi-line label cannot round-trip: [LABELS] holds ONE quoted string. Flattened, and said.
	const multi = JSON.parse(JSON.stringify(base));
	multi.labels = [{ id: 'X1', _text: 'FIRST\nSECOND', x: 0, y: 0, anchorNode: null, align: 'left', valign: 'top' }];
	const mOut = EngCalcs.lpnExportInp(multi);
	ok('a multi-line label is flattened to one row',
		(tokensBySection(mOut.inp).LABELS || []).length === 1);
	ok('the flattened label keeps every word', /"FIRST SECOND"/.test(mOut.inp));
	ok('the flattening is reported', mOut.differences.some((d) => d.code === 'label-multiline-flattened'));
	// And it must survive its own writer: a quote inside the text would end EPANET's string.
	const quoted = JSON.parse(JSON.stringify(base));
	quoted.labels = [{ id: 'X1', _text: 'A "quoted" note', x: 0, y: 0, anchorNode: null, align: 'left', valign: 'top' }];
	const qOut = EngCalcs.lpnExportInp(quoted);
	ok('a quote in the text is replaced', qOut.inp.indexOf('"A \'quoted\' note"') >= 0);
	ok('the replacement is reported', qOut.differences.some((d) => d.code === 'label-quote-replaced'));
	ok('the quoted label still re-imports as one label',
		EngCalcs.lpnInpParse(qOut.inp).labels.length === 1);
}
done('the corner shift and the label limits');

// ---- 4. units: the project's, not the adapter's ------------------------------------------------
//
// js/lpn-epanet.js's lpnToInp() writes LPS whatever the project is in, because the engine reads it
// straight back. A file a person keeps must not do that. This is the decision Task 281 names, and it
// is asserted rather than described.
console.log('\n4. The file is written in the project\'s own units');
{
	const doc = {
		units: { lpn_u_length: 'm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o', lpn_u_diameter: 'mm', lpn_u_flow: 'lps' },
		settings: { method: 'hw', emitterExponent: 0.5 },
		project: { name: 'metric' }, origin: { x: 0, y: 0 },
		nodes: [
			{ id: 'J1', type: 'junction', x: 0, y: 0, elev: 100, _demand: 12.5 },
			{ id: 'R1', type: 'reservoir', x: 10, y: 0, _head: 150 }
		],
		links: [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', _length: 300, _diameter: 200, _roughness: 130, _k: 0, _status: 'open', verts: [] }],
		labels: []
	};
	const out = EngCalcs.lpnExportInp(doc);
	ok('a metric project writes LPS', /Units\tLPS/.test(out.inp));
	const sec = tokensBySection(out.inp);
	ok('its length is the project\'s metres', sec.PIPES[0][3] === '300', sec.PIPES[0][3]);
	ok('its diameter is the project\'s millimetres', sec.PIPES[0][4] === '200', sec.PIPES[0][4]);
	ok('nothing was converted', !out.differences.some((d) => d.code === 'unit-converted'));

	// A US project writes GPM, and the SAME numbers -- the writer must not be quietly normalising.
	const us = JSON.parse(JSON.stringify(doc));
	us.units = { lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_diameter: 'in', lpn_u_flow: 'gpm' };
	const usOut = EngCalcs.lpnExportInp(us);
	ok('a US project writes GPM', /Units\tGPM/.test(usOut.inp));
	ok('its length is the project\'s feet', tokensBySection(usOut.inp).PIPES[0][3] === '300');
	ok('fth2o is written as EPANET\'s foot without arithmetic',
		tokensBySection(usOut.inp).JUNCTIONS[0][1] === '100');

	// A flow unit EPANET cannot name really does convert, and says so. m3ps -> LPS is x1000.
	const odd = JSON.parse(JSON.stringify(doc));
	odd.units.lpn_u_flow = 'm3ps';
	const oddOut = EngCalcs.lpnExportInp(odd);
	ok('a flow unit EPANET has no keyword for is reported',
		oddOut.differences.some((d) => d.code === 'flow-units-not-epanet'));
	ok('and its flows convert', Math.abs(parseFloat(tokensBySection(oddOut.inp).JUNCTIONS[0][2]) - 12500) < 1e-6,
		tokensBySection(oddOut.inp).JUNCTIONS[0][2]);

	// A MIXED PROJECT -- the seven selectors are independent, so metres of head beside gallons per
	// minute is a state a user can reach, and it is the only state that can tell one converter from
	// another. **A TANK'S DIAMETER IS IN THE ELEVATION UNIT AND A PIPE'S IS NOT** (the vessel is
	// measured on the same staff as its water level), so here the tank's five numbers all move by the
	// metre-to-foot factor and the pipe's diameter does not move at all.
	const mixed = JSON.parse(JSON.stringify(doc));
	mixed.units = { lpn_u_length: 'ft', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'psi', lpn_u_diameter: 'in', lpn_u_flow: 'gpm' };
	mixed.nodes.push({ id: 'T1', type: 'tank', x: 20, y: 0, elev: 30, _level: 3, minLevel: 0, maxLevel: 10, tankDiameter: 15 });
	const mixOut = EngCalcs.lpnExportInp(mixed);
	const ft = EngCalcs.unitFactors.fth2o / EngCalcs.unitFactors.mh2o;
	const mixT = tokensBySection(mixOut.inp).TANKS[0];
	ok('a mixed project reports the elevation conversion',
		mixOut.differences.some((d) => d.code === 'unit-converted' && /elevation/.test(d.detail)));
	ok('the tank bottom converts', mixT[1] === String(30 * ft), mixT[1]);
	ok('the tank diameter converts WITH IT, being in the elevation unit',
		mixT[5] === String(15 * ft), mixT[5]);
	ok('the pipe diameter does not, being in the pipe diameter unit',
		tokensBySection(mixOut.inp).PIPES[0][4] === '200', tokensBySection(mixOut.inp).PIPES[0][4]);

	// A VALVE'S SETTING IS A DIFFERENT QUANTITY PER TYPE, and the two that convert differently are
	// the pair to separate: under m3ps->LPS an FCV's setting is a FLOW and moves by 1000, while a
	// PRV's is a PRESSURE in metres of water and does not move at all. Reading one as the other
	// leaves a file that solves perfectly and is not the network anybody drew.
	const valveDoc = JSON.parse(JSON.stringify(doc));
	valveDoc.units.lpn_u_flow = 'm3ps';
	valveDoc.links = [
		{ id: 'V1', type: 'valve', valveType: 'FCV', from: 'R1', to: 'J1', _diameter: 200, _setting: 0.05, _k: 0, _status: 'open', verts: [] },
		{ id: 'V2', type: 'valve', valveType: 'PRV', from: 'R1', to: 'J1', _diameter: 200, _setting: 40, _k: 0, _status: 'open', verts: [] },
		{ id: 'V3', type: 'valve', valveType: 'TCV', from: 'R1', to: 'J1', _diameter: 200, _setting: 12, _k: 3, _status: 'open', verts: [] }
	];
	const vOut = tokensBySection(EngCalcs.lpnExportInp(valveDoc).inp).VALVES;
	ok('an FCV setting is a flow and converts', vOut[0][5] === '50', vOut[0][5]);
	ok('a PRV setting is a pressure and does not', vOut[1][5] === '40', vOut[1][5]);
	ok('a TCV setting is dimensionless and does not', vOut[2][5] === '12', vOut[2][5]);
	// EPANET IGNORES a TCV's minor-loss column (EngCalcs.lpnLinkK), so writing the stored k there
	// would state a number the engine discards.
	ok('a TCV writes no minor loss', vOut[2][6] === '0', vOut[2][6]);

	// A unit whose magnitude this browser does not know is REFUSED BY NAME, never guessed at --
	// CLAUDE.md's rule, the same one that stops the solve.
	const unknown = JSON.parse(JSON.stringify(doc));
	unknown.units.lpn_u_length = 'furlong';
	const bad = EngCalcs.lpnExportInp(unknown);
	ok('an unknown unit refuses the export', bad.ok === false && bad.error === 'unknown-unit', JSON.stringify(bad.error));
	ok('and names the unit', bad.detail === 'furlong', bad.detail);
}
done('the project\'s units reach the file');

// ---- 5. the two things a document can hold that an .inp cannot -------------------------------
console.log('\n5. What cannot be written is reported, never invented');
{
	const doc = {
		units: { lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_diameter: 'in', lpn_u_flow: 'gpm' },
		settings: { method: 'hw', emitterExponent: 0.5 },
		project: { name: 'gaps' }, origin: { x: 0, y: 0 },
		nodes: [
			{ id: 'J1', type: 'junction', x: 0, y: 0, elev: 10, _demand: 0 },
			{ id: 'R1', type: 'reservoir', x: 10, y: 0, _head: 50 }
		],
		links: [{ id: 'PU1', type: 'pump', from: 'R1', to: 'J1', curvePoints: [], _diameter: 8, _status: 'open', verts: [] }],
		labels: []
	};
	const out = EngCalcs.lpnExportInp(doc);
	ok('a curveless pump is reported', out.differences.some((d) => d.code === 'pump-no-curve-as-pipe'));
	ok('and it is written as a pipe, so the network stays connected',
		(tokensBySection(out.inp).PIPES || []).some((r) => r[0] === 'PU1'));
	ok('and there is no [PUMPS] row for it', !(tokensBySection(out.inp).PUMPS || []).some((r) => r[0] === 'PU1'));

	// AN IMAGE BACKDROP: the placement can be written, the picture cannot -- an .inp names a path on
	// somebody's disk and this page holds the image itself.
	const img = JSON.parse(JSON.stringify(doc));
	img.backdrop = { href: 'data:image/png;base64,AAAA', tx: 10, ty: 90, width: 40, height: 20, s: 1 };
	const imgOut = EngCalcs.lpnExportInp(img);
	const dim = (tokensBySection(imgOut.inp).BACKDROP || [])[0];
	ok('an image backdrop writes its placement', !!dim && dim[0].toUpperCase() === 'DIMENSIONS');
	// Top-left (10, 90) with a 40 x 20 box is lower-left (10, 70) and upper-right (50, 90).
	ok('the placement is the image\'s corners in map units',
		dim && dim[1] === '10' && dim[2] === '70' && dim[3] === '50' && dim[4] === '90', dim && dim.join(','));
	ok('and the missing picture is reported', imgOut.differences.some((d) => d.code === 'backdrop-image-not-named'));

	// A TILE BASEMAP IS NOT A FILE. Nothing is written for it and the difference is reported -- the
	// seam this task shares with the tile-basemap track.
	const tiles = JSON.parse(JSON.stringify(doc));
	tiles.backdrop = { type: 'tiles', url: 'https://tile.example/{z}/{x}/{y}.png' };
	const tileOut = EngCalcs.lpnExportInp(tiles);
	ok('a tile basemap writes no [BACKDROP]', tileOut.inp.indexOf('[BACKDROP]') < 0);
	ok('and is reported', tileOut.differences.some((d) => d.code === 'backdrop-not-a-file'));

	// A SCENARIO is written as the scenario, through the caller's own resolver -- this file spells no
	// override key of its own.
	const scn = JSON.parse(JSON.stringify(doc));
	scn.links = [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', _length: 100, _diameter: 8, _roughness: 130, _k: 0, _status: 'open', verts: [] }];
	const scnOut = EngCalcs.lpnExportInp(scn, {
		effective: (el, prop) => (el.id === 'P1' && prop === 'diameter') ? 12 : el['_' + prop]
	});
	ok('the resolver decides the number written', tokensBySection(scnOut.inp).PIPES[0][4] === '12',
		tokensBySection(scnOut.inp).PIPES[0][4]);
	// And an element the scenario switched off is not in the file at all.
	const offOut = EngCalcs.lpnExportInp(scn, {
		effective: (el, prop) => (el.id === 'P1' && prop === 'active') ? false : el['_' + prop]
	});
	ok('an inactive link is left out', (tokensBySection(offOut.inp).PIPES || []).length === 0);
}
done('the differences are declared');

// ---- 6. a survey-coordinate model, where the document is LOCAL to an origin --------------------
//
// Task 354 stores coordinates local to `doc.origin` so a float32 rasteriser cannot lose a pipe at
// x = 579,350, and lists the handful of sites that face OUTWARD and must add it back. An exporter is
// one of them, and getting it wrong is a coordinate half a million units out that looks perfectly
// ordinary in a diff. Net1/2/3 are all under the threshold and rebase to {0, 0}, so nothing above
// this line would notice.
console.log('\n6. A model in survey coordinates comes back in survey coordinates');
{
	const text = [
		'[TITLE]', 'survey', '',
		'[JUNCTIONS]', ' J1\t100\t0', ' J2\t95\t120', '',
		'[RESERVOIRS]', ' R1\t220.0', '',
		'[PIPES]', ' P1\tR1\tJ1\t1200\t12\t130\t0\tOpen', ' P2\tJ1\tJ2\t800\t10\t120\t0\tOpen', '',
		'[OPTIONS]', ' Units\tGPM', ' Headloss\tH-W', '',
		'[COORDINATES]', ' J1\t579350.00\t1304070.25', ' J2\t579400.50\t1304100.00', ' R1\t579300.00\t1304000.00', '',
		'[VERTICES]', ' P1\t579325.00\t1304035.50', '',
		'[LABELS]', ' 579310.00\t1304010.00\t"SOURCE"', '',
		'[END]', ''
	].join('\n');
	const parsed = EngCalcs.lpnInpParse(text);
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'survey');
	ok('the document really was rebased onto an origin', doc.origin.x !== 0 && doc.origin.y !== 0,
		JSON.stringify(doc.origin));
	ok('and its stored coordinates really are small', Math.abs(doc.nodes[0].x) < 1e4, String(doc.nodes[0].x));
	const out = EngCalcs.lpnExportInp(doc);
	ok('it exports', out.ok === true, JSON.stringify(out.error));
	const src = tokensBySection(text), got = tokensBySection(out.inp);
	const gotC = rowsById(got.COORDINATES);
	(src.COORDINATES || []).forEach((r) => {
		ok('survey ' + r[0] + ' x', gotC[r[0]] && gotC[r[0]][1] === r[1], gotC[r[0]] && gotC[r[0]][1]);
		ok('survey ' + r[0] + ' y', gotC[r[0]] && gotC[r[0]][2] === r[2], gotC[r[0]] && gotC[r[0]][2]);
	});
	ok('a vertex too', got.VERTICES[0][1] === '579325.00' && got.VERTICES[0][2] === '1304035.50',
		got.VERTICES[0].join(','));
	ok('and a label', got.LABELS[0][0] === '579310.00' && got.LABELS[0][1] === '1304010.00',
		got.LABELS[0].join(','));
}
done('the origin is added back');

// ---- 7. [OPTIONS] Quality: interpreted, and STILL written back as the file's own characters -----
//
// `Quality` stopped being carried text and became a live input (water age, source share). The rule
// it has to keep is the one section 1 keeps for every number: a value the user did not change comes
// back out exactly as it came in. It is kept by storing the interpretation BESIDE the token rather
// than over it -- js/lpn-inp.js's lpnQualityParse/lpnQualityText -- and this is where that is
// asserted through the page's own docFromInp() and exporter rather than through the helpers alone.
console.log('\n7. the water-quality option round-trips, and changes only when the user changes it');
{
	const { doc } = importDoc(refPath('Net3.inp'));
	ok('docFromInp interpreted it', doc.settings.quality && doc.settings.quality.mode === 'trace',
		JSON.stringify(doc.settings.quality));
	ok('and kept the source it names', doc.settings.quality.traceNode === 'Lake', doc.settings.quality.traceNode);
	ok("and kept the file's own characters beside it", doc.settings.quality.src === 'Trace Lake',
		JSON.stringify(doc.settings.quality.src));
	const qualityLine = (inp) => {
		const m = /^\s*Quality\s+(.*?)\s*$/m.exec(inp || '');
		return m ? m[1] : null;
	};
	const out = EngCalcs.lpnExportInp(doc);
	ok('it exports', out.ok === true, JSON.stringify(out.error));
	ok('untouched, the line is byte-identical', qualityLine(out.inp) === 'Trace Lake', qualityLine(out.inp));
	// And the other half: once the user really has chosen something else, the file must stop
	// claiming the analysis it no longer describes.
	doc.settings.quality.mode = 'age';
	const aged = EngCalcs.lpnExportInp(doc);
	ok('after the user picks water age, it says so', qualityLine(aged.inp) === 'Age', qualityLine(aged.inp));
	// Net1 names a CHEMICAL, which this page carries and does not work out. Its token must survive
	// an open-and-save exactly as it always did.
	const one = importDoc(refPath('Net1.inp'));
	ok('Net1 reads as a carried chemical', one.doc.settings.quality.mode === 'chemical',
		JSON.stringify(one.doc.settings.quality));
	// **A PROJECT SAVED BEFORE THE OPTION WAS INTERPRETED**: it has the token and a setting that
	// has never met it. Read as a deliberate "no analysis", the export would delete a line the
	// source stated -- which is the whole reason `src` is stored rather than re-derived.
	const legacy = importDoc(refPath('Net3.inp')).doc;
	legacy.settings.quality = { mode: 'none', traceNode: '' };
	ok('an un-interpreted setting does not delete the carried line',
		qualityLine(EngCalcs.lpnExportInp(legacy).inp) === 'Trace Lake',
		qualityLine(EngCalcs.lpnExportInp(legacy).inp));
	ok('and its own words come back out', qualityLine(EngCalcs.lpnExportInp(one.doc).inp) === 'Chlorine mg/L',
		qualityLine(EngCalcs.lpnExportInp(one.doc).inp));
}
done('the quality option survives being interpreted');

// ---- 8. the two [OPTIONS] keys that name a FILE come back out ----------------------------------
//
// `Map` and `Hydraulics USE/SAVE` name a file beside the `.inp` -- a `.map` of coordinates, a `.hyd`
// of already-solved hydraulics. This page can open neither and acts on neither, and it read past
// both without keeping them, so an import and re-export DELETED a line the source stated. That is
// the input-is-canonical rule broken in the same way [RULES] and the rest of [OPTIONS] each broke it
// in turn. Carried now, and asserted here, because none of EPA's three models states either one.
console.log('\n8. Map and Hydraulics USE/SAVE are carried, not deleted');
{
	const text = [
		'[TITLE]', 'carries a map and a hydraulics file', '',
		'[JUNCTIONS]', ' J1\t100\t0', '',
		'[RESERVOIRS]', ' R1\t220.0', '',
		'[PIPES]', ' P1\tR1\tJ1\t1200\t12\t130\t0\tOpen', '',
		'[OPTIONS]', ' Units\tGPM', ' Headloss\tH-W', ' Map\tnetwork.map',
		' Hydraulics\tUSE\tsaved.hyd', '',
		'[COORDINATES]', ' J1\t10.0\t10.0', ' R1\t0.0\t0.0', '',
		'[END]', ''
	].join('\n');
	const parsed = EngCalcs.lpnInpParse(text);
	ok('the map file is read', parsed.fileOptions.map === 'network.map', JSON.stringify(parsed.fileOptions.map));
	ok('and the hydraulics file with its keyword',
		parsed.fileOptions.hydraulics === 'USE saved.hyd', JSON.stringify(parsed.fileOptions.hydraulics));
	ok('and both are reported rather than kept quietly',
		(parsed.dropped || []).some((d) => d.code === 'file-options'),
		JSON.stringify((parsed.dropped || []).map((d) => d.code)));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'carries');
	const out = EngCalcs.lpnExportInp(doc);
	ok('it exports', out.ok === true, JSON.stringify(out.error));
	const got = tokensBySection(out.inp).OPTIONS || [];
	const rowFor = (kw) => got.find((r) => r[0].toUpperCase() === kw);
	ok('Map comes back naming the same file',
		rowFor('MAP') && rowFor('MAP')[1] === 'network.map', JSON.stringify(rowFor('MAP')));
	ok('Hydraulics comes back as three tokens, not one string',
		rowFor('HYDRAULICS') && rowFor('HYDRAULICS').length === 3
			&& rowFor('HYDRAULICS')[1] === 'USE' && rowFor('HYDRAULICS')[2] === 'saved.hyd',
		JSON.stringify(rowFor('HYDRAULICS')));
	// The other half of sparseness: a file that stated neither must not gain either.
	const bare = EngCalcs.lpnExportInp(importDoc(refPath('Net1.inp')).doc);
	const bareOpts = tokensBySection(bare.inp).OPTIONS || [];
	ok('a file that stated neither gains neither',
		!bareOpts.some((r) => ['MAP', 'HYDRAULICS'].indexOf(r[0].toUpperCase()) >= 0),
		JSON.stringify(bareOpts.map((r) => r[0])));
}
done('a line naming another file is not deleted');

console.log('');
if (fails) { console.log(fails + ' FAILED of ' + checks); process.exit(1); }
console.log('all ' + checks + ' export checks passed');
