// DEMAND CATEGORIES ON A JUNCTION -- ROADMAP Task 468. Run with:
//   node dev/lpn-spike/demand-category-harness.js
//
// **THE FIXTURE IS THE POINT OF THIS FILE.** EPANET stacks (base demand, pattern, category) triples
// on one junction and adds them up. js/lpn-inp.js read those rows, SUMMED them into this page's one
// demand field and reported the loss -- and that flattening had never once been run against a real
// multi-category file, because Net1, Net2 and Net3 all have an EMPTY [DEMANDS] section.
// dev/lpn-spike/reference/multi-category.inp is the smallest network that exercises it: three
// categories on one junction across two patterns, a row with a category and no pattern, a junction
// with one itemized category, an ordinary junction that must not change, and a junction whose
// [JUNCTIONS] demand EPANET discards because [DEMANDS] states its demands instead.
//
// FIVE THINGS ARE ASSERTED AND THEY ARE NOT THE SAME QUESTION:
//   1. the rows ARRIVE as rows, with their own text, and the ordinary junction grows nothing;
//   2. the resolved demand is the SUM AT THE CLOCK, each row through its own pattern -- checked
//      against the pipe flows the solver returns, so it reconciles the way a reviewer checks it;
//   3. the writer hands every category's number back CHARACTER FOR CHARACTER (CLAUDE.md's rule,
//      and Task 281's acceptance criterion applied to a row instead of a field);
//   4. the property popup can add, edit and remove one, and doing so leaves the rest of the
//      document byte-identical;
//   5. nothing of ours is ever written into the user's numbers -- the clock moves, a scenario
//      overrides, and the serialized document comes back byte for byte.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

// The page's own load order. lpn-time.js must be here or every multiplier is read at t = 0 whatever
// the transport says -- the stub-holds-the-coupling-constant failure dev/testing-notes.md names.
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

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
	"\t\tserialize: serializeProject, assembleModel: assembleModel,\n" +
	"\t\teffective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tresolvedDemand: resolvedDemand, baseDemandTotal: baseDemandTotal,\n" +
	"\t\tcolorNodeValue: colorNodeValue, paneTables: paneTables,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tlibRenamePattern: libRenamePattern, libPatterns: libPatterns,\n" +
	"\t\tpushSpecs: pushSpecList,\n" +
	// The Find panel, driven the way its three pull-downs drive it.
	"\t\tfindProps: function (scope) { findState.scope = scope; return findPropDefs(); },\n" +
	"\t\tfind: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// RELATIVE, for the same reason demand-resolved-harness.js gives: a demand crosses into the model
// in m3/s and is compared against flows that came back out of it, and (x*f)/f is not an identity.
function near(a, b, rel) { return Math.abs(a - b) <= (rel || 1e-9) * Math.max(1, Math.abs(b)); }

const FIXTURE = path.join(ROOT, 'dev/lpn-spike/reference/multi-category.inp');
const TEXT = fs.readFileSync(FIXTURE, 'utf8');

// The deliberately-dumber second reader the other .inp harnesses use -- section, id, column. Asking
// the real parser what the file says would be asking the defendant for the verdict. This one also
// keeps the trailing COMMENT, because in [DEMANDS] the comment IS the category.
function rowsOf(text, section) {
	const out = [];
	let cur = null;
	for (const raw of text.split(/\r?\n/)) {
		const semi = raw.indexOf(';');
		const body = (semi >= 0 ? raw.slice(0, semi) : raw).trim();
		const cmt = semi >= 0 ? raw.slice(semi + 1).trim() : '';
		const m = /^\[(\w+)\]/.exec(body);
		if (m) { cur = m[1].toUpperCase(); continue; }
		if (cur !== section || !body) { continue; }
		const toks = body.split(/\s+/);
		toks.cmt = cmt;
		out.push(toks);
	}
	return out;
}

console.log('=== demand categories, against dev/lpn-spike/reference/multi-category.inp ===');

// ---------------------------------------------------------------------------
// 0. The fixture really does state what this file claims it states.
// ---------------------------------------------------------------------------
// A fixture that quietly stopped holding categories would make every section below pass while
// checking nothing -- the failure this repo has been bitten by more than once.
console.log('\n--- the fixture ---');
{
	const rows = rowsOf(TEXT, 'DEMANDS');
	ok('the fixture states demand categories at all', rows.length === 7, rows.length + ' rows');
	ok('...on more than one junction', new Set(rows.map(r => r[0])).size === 4);
	ok('...with a category name on every row', rows.every(r => r.cmt.length > 0));
	ok('...at least one of them with NO pattern', rows.some(r => r.length === 2 && r.cmt));
	ok('...and at least one junction stating three of them',
		rows.filter(r => r[0] === 'J1').length === 3);
	// The texts must not be what String(parseFloat(x)) returns, or the token assertions in section 3
	// would pass against a writer that formats every number from scratch.
	const texts = rows.map(r => r[1]);
	ok('...written with texts a formatter would not reproduce',
		texts.some(t => String(parseFloat(t)) !== t), texts.join(' '));
}

setUnitSet('us');   // a gpm file; the file's own units must win
byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'multi-category.inp', _text: TEXT });
const doc = L.getDoc();
const J = (id) => doc.nodes.find(n => n.id === id);

// ---------------------------------------------------------------------------
// 1. The rows arrive AS ROWS, and the ordinary junction grows nothing.
// ---------------------------------------------------------------------------
console.log('\n--- the importer keeps the breakdown ---');
{
	const j1 = J('J1');
	ok('row 0 is the junction\'s own demand', j1._demand === 50, j1._demand + ' gpm');
	ok('...with row 0\'s pattern and category on the junction',
		j1.demandPattern === 'Pat1' && j1.demandCategory === 'Elm Acres',
		j1.demandPattern + ' / ' + j1.demandCategory);
	ok('the other two arrived as two more rows', (j1.extraDemands || []).length === 2,
		JSON.stringify(j1.extraDemands));
	ok('...the second is 20 gpm on Pat2, named',
		j1.extraDemands[0].base === 20 && j1.extraDemands[0].pattern === 'Pat2' &&
		j1.extraDemands[0].category === 'Elm Acres Park');
	// **A BLANK PATTERN COLUMN IS NOT "NO PATTERN"** -- it is [OPTIONS] Pattern, exactly as it is
	// for the [JUNCTIONS] column, and storing the default here would put a name the file never
	// wrote at this row into a field labelled as the file's.
	ok('...and the third has a CATEGORY AND NO PATTERN, stored as null rather than as the default',
		j1.extraDemands[1].base === 12.5 && j1.extraDemands[1].pattern === undefined &&
		j1.extraDemands[1].category === 'Taco Bell 354',
		JSON.stringify(j1.extraDemands[1]));

	// **THE TOKEN, KEPT PER ROW.** `50.0` and `12.50` do not survive parseFloat/String, so a row
	// without its own token bag would hand the user back a number they never typed.
	ok('row 0 keeps the file\'s own text', j1.tok && j1.tok._demand === '50.0', JSON.stringify(j1.tok));
	ok('...and so does a category row', j1.extraDemands[1].tok && j1.extraDemands[1].tok.base === '12.50',
		JSON.stringify(j1.extraDemands[1].tok));

	const j4 = J('J4');
	ok('THE ORDINARY JUNCTION IS UNTOUCHED: no list, no category, no itemize flag',
		j4.extraDemands === undefined && j4.demandCategory === undefined &&
		j4.demandItemized === undefined, JSON.stringify(j4));
	ok('...and its demand is still the file\'s own number', j4._demand === 33, j4._demand + ' gpm');

	// [DEMANDS] REPLACES the [JUNCTIONS] column: J5 says 100 there and 40 + 0.75 here.
	const j5 = J('J5');
	ok('a [JUNCTIONS] demand is REPLACED by the rows, not added to',
		j5._demand === 40 && j5.extraDemands.length === 1 && j5.extraDemands[0].base === 0.75,
		j5._demand + ' + ' + JSON.stringify(j5.extraDemands));

	// A junction with ONE itemized category is not a multi-category junction, but it is still a
	// junction whose demand the file stated in [DEMANDS] -- so it says so, and the writer puts it
	// back where it came from.
	const j2 = J('J2');
	ok('one itemized category is one row on the junction itself',
		j2._demand === 18 && j2.extraDemands === undefined && j2.demandCategory === 'Rio Vista Apartments');
	ok('...and it remembers that the file stated it in [DEMANDS]', j2.demandItemized === true);

	// Nothing was lost, so nothing is reported. The importer's contract is to name every DIFFERENCE.
	const report = byId.lpn_dialog_body.children.map(c => c.textContent).join(' ');
	ok('the import report does NOT claim the demands were added together',
		report.indexOf('added together') < 0 && report.indexOf('more than one demand') < 0);
}

// ---------------------------------------------------------------------------
// 2. THE RESOLVED DEMAND IS THE SUM AT THE CLOCK, row by row through its own pattern.
// ---------------------------------------------------------------------------
// Pat1 is 0.6 1.0 1.4 1.0 and Pat2 is 0.2 0.5 2.3 1.0, on a 6-hour pattern step. At t = 0 that
// makes J1 = 50(0.6) + 20(0.2) + 12.5(0.6) = 41.5 gpm, and the third row follows Pat1 because the
// project's default pattern is Pat1 and its own column was blank.
console.log('\n--- the resolved demand ---');
{
	const j1 = J('J1');
	ok('every row resolves through ITS OWN pattern, and they add',
		near(L.resolvedDemand(j1), 41.5), L.resolvedDemand(j1) + ' gpm');
	// The base is what the user typed, added up and NOT multiplied -- the honest reading of "Base
	// demand" for a junction whose demand is a list.
	ok('Base demand is every row\'s base, unmultiplied', L.baseDemandTotal(j1) === 82.5,
		L.baseDemandTotal(j1) + ' gpm');
	ok('...and the map/colour field reads the same number',
		L.colorNodeValue(j1, 'demand') === 82.5 && near(L.colorNodeValue(j1, 'demandActual'), 41.5));

	const realNow = EngCalcs.lpnTimeNow;
	EngCalcs.lpnTimeNow = () => 12 * 3600;      // pattern index 2: Pat1 = 1.4, Pat2 = 2.3
	ok('...and it follows the clock, per row',
		near(L.resolvedDemand(j1), 50 * 1.4 + 20 * 2.3 + 12.5 * 1.4),
		L.resolvedDemand(j1) + ' gpm');
	ok('...while the Base demand does not move', L.baseDemandTotal(j1) === 82.5);
	EngCalcs.lpnTimeNow = realNow;

	// **THE RECONCILIATION A REVIEWER ACTUALLY DOES.** Add up the pipe flows into a junction and
	// they must equal what the page says it draws. This is the assertion that would have caught the
	// old flattening if a multi-category file had ever been run through it.
	const model = L.assembleModel();
	const res = require(ROOT + 'js/lpn-solver.js').lpnSolve(model);
	ok('the network converges', res.ok && res.converged, res.iterations + ' iterations');
	const netInflow = {};
	doc.nodes.forEach(n => { netInflow[n.id] = 0; });
	model.links.forEach(l => {
		const q = res.flows[l.id];
		if (q === undefined) { return; }
		netInflow[l.from] -= q; netInflow[l.to] += q;
	});
	const GPM_SI = 6.309019640343977e-5;
	let worst = 0, worstId = null;
	doc.nodes.filter(n => n.type === 'junction').forEach(n => {
		const drew = netInflow[n.id] / GPM_SI, says = L.resolvedDemand(n);
		const err = Math.abs(drew - says) / Math.max(1, Math.abs(says));
		if (err > worst) { worst = err; worstId = n.id; }
	});
	ok('every junction draws exactly what the page says it draws', worst < 1e-6,
		'worst ' + (worst * 1e6).toFixed(3) + ' ppm at ' + worstId);

	// And the model the EPANET bridge is handed carries the breakdown, because base x one pattern
	// cannot state two daily shapes. Only where there IS one.
	const mj1 = model.nodes.find(n => n.id === 'J1');
	const mj4 = model.nodes.find(n => n.id === 'J4');
	ok('an extended-period run is handed the rows', (mj1.demands || []).length === 3,
		JSON.stringify(mj1.demands));
	ok('...each with its blank pattern resolved to the project default',
		mj1.demands[2].pattern === 'Pat1');
	ok('...and an ordinary junction is handed none, so nothing downstream changes',
		mj4.demands === null);
}

// ---------------------------------------------------------------------------
// 3. THE WRITER HANDS EVERY CATEGORY BACK CHARACTER FOR CHARACTER.
// ---------------------------------------------------------------------------
console.log('\n--- export: itemized, and byte-identical ---');
{
	// **THE SAVED SHAPE, which is what the writer documents itself as reading** -- serializeProject()
	// is where the project's own unit selection is stated, and a document without one cannot be
	// written at all (the writer refuses rather than guessing a unit, by design).
	const out = EngCalcs.lpnExportInp(L.serialize());
	ok('the document exports', out.ok === true, JSON.stringify(out.error));
	if (!out.ok) { throw new Error('nothing below this can mean anything'); }
	const src = rowsOf(TEXT, 'DEMANDS'), got = rowsOf(out.inp, 'DEMANDS');
	ok('every [DEMANDS] row comes back, itemized -- one row per demand',
		got.length === src.length, got.length + ' vs ' + src.length);
	let compared = 0, identical = 0;
	src.forEach((r, i) => {
		const g = got[i];
		if (!g) { ok('row ' + i + ' is in the export', false); return; }
		[[0, 'junction'], [1, 'demand']].forEach(([c, what]) => {
			compared++;
			if (g[c] === r[c]) { identical++; }
			ok('row ' + i + ' ' + what + ' is the file\'s own text', g[c] === r[c],
				JSON.stringify(g[c]) + ' vs ' + JSON.stringify(r[c]));
		});
		ok('row ' + i + ' pattern', (g[2] || null) === (r[2] || null),
			JSON.stringify(g[2]) + ' vs ' + JSON.stringify(r[2]));
		// THE CATEGORY IS A TRAILING COMMENT in EPANET's format, not a column -- that is why the
		// old reader never saw one, and it is why this is asserted off the comment.
		ok('row ' + i + ' category', g.cmt === r.cmt, JSON.stringify(g.cmt) + ' vs ' + JSON.stringify(r.cmt));
	});
	ok('every compared demand token is byte-identical', identical === compared,
		(compared - identical) + ' of ' + compared + ' differ');

	// **A JUNCTION WITH ITEMIZED DEMANDS WRITES NO DEMAND COLUMN**, which is EPANET's own writer's
	// layout and the only unambiguous one: [DEMANDS] REPLACES that column, so a number left in it
	// would be a statement the engine ignores and the next reader believes.
	const gotJ = rowsOf(out.inp, 'JUNCTIONS');
	const byId2 = {};
	gotJ.forEach(r => { byId2[r[0]] = r; });
	ok('an itemized junction writes ID and elevation only', byId2.J1.length === 2, JSON.stringify(byId2.J1));
	ok('...J5\'s discarded [JUNCTIONS] demand is not written back either',
		byId2.J5.length === 2, JSON.stringify(byId2.J5));
	ok('THE ORDINARY JUNCTION IS WRITTEN EXACTLY AS IT ALWAYS WAS',
		byId2.J4.length === 4 && byId2.J4[2] === '33.0' && byId2.J4[3] === 'Pat2',
		JSON.stringify(byId2.J4));

	// The round trip: the exported file re-imports as the same breakdown, values and TEXT alike.
	const back = EngCalcs.lpnInpParse(out.inp);
	ok('the exported file re-imports', back.ok === true, JSON.stringify(back.error));
	const bj1 = back.nodes.find(n => n.id === 'J1');
	ok('...with the same three rows on J1',
		bj1.demand === 50 && bj1.extraDemands.length === 2 &&
		bj1.extraDemands[0].base === 20 && bj1.extraDemands[1].base === 12.5);
	ok('...their categories intact',
		bj1.demandCategory === 'Elm Acres' && bj1.extraDemands[1].category === 'Taco Bell 354');
	// The parser's own vocabulary here (`demand`, not `_demand`): this is a parse result, not a
	// document. The text survived a full round trip through the writer.
	ok('...and their own text intact',
		bj1.tok.demand === '50.0' && bj1.extraDemands[1].tok.base === '12.50',
		JSON.stringify(bj1.tok) + ' ' + JSON.stringify(bj1.extraDemands[1].tok));
}

// ---------------------------------------------------------------------------
// 4. THE PROPERTY POPUP: add, edit, remove.
// ---------------------------------------------------------------------------
console.log('\n--- the property popup ---');
function popupFor(id) {
	byId.lpn_popup_fields.children.length = 0;
	L.renderNodeFields(id);
	return byId.lpn_popup_fields.children;
}
function findAll(kids, tag) {
	const out = [];
	(function walk(list) {
		list.forEach((c) => {
			if (c.tagName === tag) { out.push(c); }
			if (c.children && c.children.length) { walk(c.children); }
		});
	})(kids);
	return out;
}
{
	const kids = popupFor('J1');
	const labels = kids.filter(c => c.tagName === 'LABEL').map(c => c.textContent);
	// **ROW 0 IS IN THE TABLE, SO IT IS NOT A FIELD** (Tom, 2026-08-26: of the two shown together,
	// *"I think this is a mistake"*). The popup must NOT carry a standalone Base demand, Demand
	// pattern or Category label once a breakdown exists -- that duplicated heading is the defect.
	ok('a junction with categories has NO standalone Base demand field',
		!labels.some(t => /^Base demand/.test(t)), labels.join(' | '));
	ok('...nor a standalone Demand pattern or Description field',
		!labels.some(t => /^Demand pattern/.test(t)) && !labels.some(t => /^Description/.test(t)));
	const table = kids.filter(c => c.tagName === 'TABLE')[0];
	ok('...but a table holding EVERY demand', !!table);
	ok('...one row per demand, row 0 included',
		!!table && findAll(table.children, 'TR').length === 4, 'header + 3');
	ok('...each row a number, a pattern and a name',
		findAll([table], 'INPUT').length === 6 && findAll([table], 'SELECT').length === 3);
	// The headings are the only labels these columns have, so they carry the tips the vanished
	// fields used to (Tom: *"Maybe you can put the tip here"*).
	ok('...and the column headings carry the tips',
		findAll([table], 'TH').filter(th => /\?/.test(th.textContent)).length === 3,
		findAll([table], 'TH').map(th => th.textContent).join(' | '));
	ok('the resolved Demand row is still there and still says the total',
		labels.some(t => /^Demand \(/.test(t)));

	// **AND SO DOES A ONE-DEMAND JUNCTION** (Task 553, Tom 2026-08-28: *"remove the original Base
	// demand and Demand pattern inputs and leave in their place the Demand categories interface"*).
	// Until then this asserted the OPPOSITE -- an ordinary junction got the two plain fields and no
	// table -- which left the EPANET asymmetry on screen: the same junction met two different
	// interfaces depending on a row count nothing reported. J4 is the ordinary case and every
	// junction in Net1, Net2 and Net3 is one.
	const plain = popupFor('J4');
	const ptable = plain.filter(c => c.tagName === 'TABLE')[0];
	ok('a one-demand junction gets the SAME table', !!ptable);
	ok('...holding exactly one demand row', !!ptable && findAll(ptable.children, 'TR').length === 2,
		'header + 1');
	const plabels = plain.filter(c => c.tagName === 'LABEL').map(c => c.textContent);
	ok('...and no standalone Base demand or Demand pattern field beside it',
		!plabels.some(t => /^Base demand/.test(t)) && !plabels.some(t => /^Demand pattern/.test(t)),
		plabels.join(' | '));
	// **THE LAST DEMAND CANNOT BE REMOVED.** Before the table was unconditional, row 0's delete
	// always had a row 1 to promote; now it is drawn on a junction that has no row 1, where
	// acc.remove() would shift an empty array and read `.base` off undefined.
	const pdel = findAll([ptable], 'BUTTON').filter(b => b.textContent === '\u00d7');
	ok('...whose delete is present but DISABLED, there being nothing to promote',
		pdel.length === 1 && pdel[0].disabled === true, JSON.stringify(pdel.map(b => b.disabled)));
	ok('...but can still start a second', findAll(plain, 'BUTTON').some(b => /Add demand category/.test(b.textContent)));
	// The heading is Tom's word as of Task 553, and the Find property answers to it too.
	ok('the third column is headed Description, not Category',
		findAll([ptable], 'TH').some(th => /^Description/.test(th.textContent)),
		findAll([ptable], 'TH').map(th => th.textContent).join(' | '));
	// A junction WITH a breakdown keeps a live delete on every row, including row 0.
	// Re-fetched, not reused: popupFor() renders into the ONE popup, so `kids` above now points at
	// J4's nodes. That is the stub trap dev/testing-notes.md warns about, in miniature.
	const j1tab = popupFor('J1').filter(c => c.tagName === 'TABLE')[0];
	const j1del = findAll([j1tab], 'BUTTON').filter(b => b.textContent === '\u00d7');
	ok('a junction with three demands has three LIVE deletes',
		j1del.length === 3 && j1del.every(b => !b.disabled), JSON.stringify(j1del.map(b => b.disabled)));
}

// ---------------------------------------------------------------------------
// 5. Editing through the popup, and nothing of ours written into their numbers.
// ---------------------------------------------------------------------------
console.log('\n--- editing, undo-safe and write-safe ---');
{
	const before = JSON.stringify(L.serialize());
	const plain = popupFor('J4');
	const add = findAll(plain, 'BUTTON').filter(b => /Add demand category/.test(b.textContent))[0];
	add._listeners.click[0]();
	ok('Add gives the junction a second demand', (J('J4').extraDemands || []).length === 1,
		JSON.stringify(J('J4').extraDemands));
	// A NEW ROW IS ZERO AND BLANK, not a copy of row 0: seeding it would put a number nobody typed
	// into a field labelled as theirs.
	ok('...at zero, unnamed and on no pattern',
		J('J4').extraDemands[0].base === 0 && J('J4').extraDemands[0].pattern === null &&
		J('J4').extraDemands[0].category === null);
	// J4 is on Pat2, whose first multiplier is 0.2. A zero row adds nothing, which is the point:
	// starting a breakdown must not move the number.
	ok('...so the junction still draws exactly what it drew', near(L.resolvedDemand(J('J4')), 33 * 0.2),
		L.resolvedDemand(J('J4')) + ' gpm');

	const rows = popupFor('J4');
	const table = rows.filter(c => c.tagName === 'TABLE')[0];
	const nums = findAll([table], 'INPUT').filter(i => i.type === 'number');
	const texts = findAll([table], 'INPUT').filter(i => i.type === 'text');
	// **INDEX 1, NOT 0: ROW 0 IS THE JUNCTION'S OWN DEMAND** and it is now the table's first row.
	// Typing into nums[0] edits J4's 33 gpm, which is how this harness first "proved" a regression
	// that was only its own stale indexing -- worth leaving said, because the symptom was a
	// 1,000,000 ppm disagreement with the EPANET engine four sections later.
	nums[1].value = '12.5';
	nums[1]._listeners.change[0]();
	texts[1].value = '  Hilltop Water Users  ';
	texts[1]._listeners.change[0]();
	ok('typing into the row stores the number as typed', J('J4').extraDemands[0].base === 12.5);
	ok('...and the name trimmed', J('J4').extraDemands[0].category === 'Hilltop Water Users');
	// Each row at its own pattern: the junction's own Pat2 (0.2) and the new row's blank column,
	// which is the project default Pat1 (0.6).
	ok('...and the junction now draws both', near(L.resolvedDemand(J('J4')), 33 * 0.2 + 12.5 * 0.6),
		L.resolvedDemand(J('J4')) + ' gpm');

	// The Tables pane says the same number, and refuses to be typed into: a total is not a thing
	// anybody can type over.
	const col = L.paneTables().filter(t => t.id === 'junctions')[0].cols.filter(c => c.key === 'demand')[0];
	ok('the Tables pane shows the same Base demand total', col.get(J('J4')) === 45.5, String(col.get(J('J4'))));
	ok('...and that cell is a value rather than a box, because it is a sum',
		col.plainFor(J('J4')) === true && col.plainFor(J('J1')) === true && col.plainFor(J('J3')) === false);

	// Removing the last row must leave the junction the object it was, key for key -- an empty
	// array left behind would change every future export and every saved file.
	const del = findAll([table], 'BUTTON')[1];
	del._listeners.click[0]();
	ok('Remove takes the row away entirely, leaving no empty list',
		J('J4').extraDemands === undefined, JSON.stringify(J('J4')));
	ok('THE DOCUMENT IS BYTE-IDENTICAL AGAIN after add, edit and remove',
		JSON.stringify(L.serialize()) === before);

	// **DELETING ROW 0 PROMOTES ROW 1 INTO IT.** With every demand in one table, a row you cannot
	// remove is the anomaly -- but a junction always has a demand, so the delete on row 0 is a
	// promotion rather than a deletion. J1 carries three demands; removing the first must leave two
	// and must move the second one's number, pattern and name onto the junction itself.
	// **SNAPSHOT AND PUT IT BACK.** This is the only assertion here that mutates a junction the
	// later sections read, and the first attempt silently poisoned the EPANET comparison four
	// sections down -- the same failure mode as the stale row index above, from the other end.
	// Restored in place so every reference held elsewhere still points at the same object.
	const j1snap = JSON.parse(JSON.stringify(J('J1')));
	const wasRow1 = JSON.stringify(J('J1').extraDemands[0]);
	const wasCount = J('J1').extraDemands.length;
	const t1 = popupFor('J1').filter(c => c.tagName === 'TABLE')[0];
	findAll([t1], 'BUTTON')[0]._listeners.click[0]();
	ok('deleting row 0 promotes row 1 rather than dropping a demand',
		(J('J1').extraDemands || []).length === wasCount - 1, JSON.stringify(J('J1').extraDemands));
	ok('...and the promoted row IS the old row 1, number, pattern and name',
		JSON.stringify({ base: J('J1')._demand, pattern: J('J1').demandPattern,
			category: J('J1').demandCategory }) === wasRow1,
		JSON.stringify({ base: J('J1')._demand, pattern: J('J1').demandPattern,
			category: J('J1').demandCategory }) + ' vs ' + wasRow1);
	ok('...and the junction still has a demand rather than an empty one',
		typeof J('J1')._demand === 'number');
	// Hold the object: the restore deletes every key including `id`, and J() looks up BY id.
	const j1ref = J('J1');
	Object.keys(j1ref).forEach(function (k) { delete j1ref[k]; });
	Object.assign(j1ref, j1snap);
	ok('...and J1 is put back exactly as it was, for the sections below',
		JSON.stringify(J('J1')) === JSON.stringify(j1snap));
}

// ---------------------------------------------------------------------------
// 6. A category's pattern is a fifth attachment point, and a scenario is not.
// ---------------------------------------------------------------------------
console.log('\n--- patterns and scenarios ---');
{
	const pat = L.libPatterns().filter(p => p.id === 'Pat2')[0];
	L.libRenamePattern(pat, 'Irrigation');
	ok('renaming a pattern repoints a demand CATEGORY that names it',
		J('J1').extraDemands[0].pattern === 'Irrigation', J('J1').extraDemands[0].pattern);
	ok('...and the resolved demand is unchanged by a rename', near(L.resolvedDemand(J('J1')), 41.5),
		L.resolvedDemand(J('J1')) + ' gpm');
	L.libRenamePattern(pat, 'Pat2');

	// **THE PER-CATEGORY OVERRIDE QUESTION, SETTLED.** An override is keyed by an element and a
	// property NAME; a category has only a position, and a position moves when a row above it goes.
	// So a scenario overrides the junction's demand -- row 0 -- exactly as it always has, and the
	// breakdown is Base-document structure like the pattern beside it.
	const j1 = J('J1');
	L.createScenario('Peak hour');
	const scn = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(scn.id);
	L.setProp(j1, 'demand', 100);
	ok('a scenario overrides ROW 0 and the other rows stand',
		near(L.resolvedDemand(j1), 100 * 0.6 + 20 * 0.2 + 12.5 * 0.6),
		L.resolvedDemand(j1) + ' gpm');
	ok('...and Base demand follows it too', L.baseDemandTotal(j1) === 132.5, String(L.baseDemandTotal(j1)));
	L.switchScenario('base');
	ok('...with Base\'s own numbers untouched throughout',
		L.effective(j1, 'demand') === 50 && near(L.resolvedDemand(j1), 41.5));

	// **AND THE BULK WRITERS REFUSE IT.** The Settings push and Find and Replace both write ONE
	// number through pushSpecList(), and one number cannot state a breakdown -- writing it would set
	// the first category and leave the others standing.
	ok('a junction with a demand breakdown is not offered to a bulk demand write',
		L.pushSpecs().filter(sp => sp.key === 'demand')[0].applies(J('J1')) === false &&
		L.pushSpecs().filter(sp => sp.key === 'demand')[0].applies(J('J3')) === true);

	// There is no setter for a resolved demand anywhere, and there must not be one for a total
	// either: both are ours, and a field of ours with a write path is how one gets into a file.
	const src = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('nothing anywhere assigns a base-demand total or a resolved demand',
		!/(^|[^a-zA-Z_$])(baseDemandTotal|resolvedDemand|demandActual)\s*=[^=]/.test(src));
}

// ---------------------------------------------------------------------------
// 7. THE REAL EPANET ENGINE READS THE SAME FILE THE SAME WAY.
// ---------------------------------------------------------------------------
// **THE ONLY CHECK THAT CAN SETTLE WHAT THE FORMAT MEANS**, and there are two questions in this
// file that nothing of ours can answer on its own: does [DEMANDS] REPLACE the [JUNCTIONS] column
// (J5 says 100 there and 40 + 0.75 here), and does a BLANK pattern column on a [DEMANDS] row mean
// [OPTIONS] Pattern the way a blank [JUNCTIONS] column does (J1's third row and J3's only row)?
// Read both wrong and the network still solves perfectly and answers a question nobody asked --
// which is the whole reason dev/lpn-spike/validate_inp.js exists. So the vendored engine is handed
// the fixture unchanged and asked what each junction draws at t = 0.
(async function () {
	console.log('\n--- the same file through the real EPANET engine ---');
	const GPM = 6.309019640343977e-5;
	try {
		const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
		const ws = new mod.Workspace();
		await ws.loadModule();
		const p = new mod.Project(ws);
		ws.writeFile('mc.inp', TEXT);
		p.open('mc.inp', 'mc.rpt', 'mc.out');
		p.setOption(2 /* Accuracy */, 1e-8);
		p.setOption(0 /* Trials */, 200);
		p.openH(); p.initH(0); p.runH();
		const EN_DEMAND = 9, demands = {};
		const nodeCount = p.getCount(0);
		for (let i = 1; i <= nodeCount; i++) { demands[p.getNodeId(i)] = p.getNodeValue(i, EN_DEMAND); }
		p.closeH(); p.close();
		let worst = 0, worstId = null;
		doc.nodes.filter(n => n.type === 'junction').forEach(n => {
			const says = L.resolvedDemand(n), theirs = demands[n.id];
			const err = Math.abs(says - theirs) / Math.max(1, Math.abs(theirs));
			if (err > worst) { worst = err; worstId = n.id; }
		});
		ok('EPANET draws the same demand at every junction we do', worst < 1e-6,
			'worst ' + (worst * 1e6).toFixed(3) + ' ppm at ' + worstId +
			' (J1: ours ' + L.resolvedDemand(J('J1')).toFixed(4) + ', theirs ' + demands.J1.toFixed(4) + ')');
		// Named separately, because each one is a reading of the FORMAT rather than of the network,
		// and a single worst-case number would not say which reading was wrong.
		ok('...so [DEMANDS] REPLACES the [JUNCTIONS] column, measured rather than assumed',
			near(demands.J5, L.resolvedDemand(J('J5')), 1e-6) && Math.abs(demands.J5 - 100) > 1,
			'J5 draws ' + demands.J5.toFixed(4) + ' gpm, not its [JUNCTIONS] 100');
		ok('...and a blank pattern column on a demand row means the PROJECT default',
			near(demands.J3, 7.5 * 0.6, 1e-6), 'J3 draws ' + demands.J3.toFixed(4) + ' gpm');
	} catch (err) {
		// The engine is a vendored wasm module and can legitimately be unavailable in a bare
		// checkout. That is a SKIP with the reason, never a silent pass and never a failure of
		// the page: everything above this line ran without it.
		console.log('  skip  the EPANET cross-check   engine unavailable: ' + err.message);
	}
	// -----------------------------------------------------------------------
	// Searching for a category (Tom, 2026-08-26: *"is it feasible to search for
	// categories or nodes with something about categories?"*).
	// -----------------------------------------------------------------------
	console.log('\n--- finding a demand category ---');
	{
		const names = (list) => list.slice().sort().join(',');
		ok('Category is offered on junctions',
			L.findProps('junction').some(d => d[0] === 'demandCategory'),
			L.findProps('junction').map(d => d[0]).join(' '));
		// The rule in findPropDefs() is that a property which silently matches nothing does not go
		// in the menu, and a reservoir has no demand at all.
		ok('...and NOT on reservoirs or tanks',
			!L.findProps('reservoir').some(d => d[0] === 'demandCategory') &&
			!L.findProps('tank').some(d => d[0] === 'demandCategory'));

		// **ANY ROW MATCHES.** J1 carries three names; each one must find it.
		ok('an exact name on ROW 0 finds the junction',
			names(L.find('junction', 'demandCategory', 'equals', 'Elm Acres')) === 'J1');
		ok('...and an exact name on a LATER row finds it just the same',
			names(L.find('junction', 'demandCategory', 'equals', 'Taco Bell 354')) === 'J1');
		ok('...which is the whole point: a join could not answer "equal to" for J1 at all',
			names(L.find('junction', 'demandCategory', 'equals', 'Elm Acres Park')) === 'J1');
		// `contains` spans rows AND junctions: two different junctions carry a "Sunset"/"Elm".
		ok('contains spans every row of every junction',
			names(L.find('junction', 'demandCategory', 'contains', 'Elm')) === 'J1');
		ok('...and gathers different junctions under one word',
			names(L.find('junction', 'demandCategory', 'contains', 'a')) === 'J1,J2,J3,J5',
			names(L.find('junction', 'demandCategory', 'contains', 'a')));
		ok('...case-insensitively, like every other text search here',
			names(L.find('junction', 'demandCategory', 'contains', 'SUNSET')) === 'J5');
		ok('a name nobody used matches nothing',
			L.find('junction', 'demandCategory', 'equals', 'Nowhere Ranch').length === 0);
		// J4 has a demand and no category. It must not turn up in a blank "contains", which is the
		// panel's "show me everything that has this property" query.
		// **THE EXTREMES RANK TEXT ALPHABETICALLY** (Tom, 2026-08-26). The categories in the fixture
		// are Elm Acres / Elm Acres Park / Taco Bell 354 (all on J1), Rio Vista Apartments (J2),
		// Mesa Elementary School (J3) and Sunset Estates (J5). The joined value is what ranks, so
		// J1 sorts on "Elm Acres, Elm Acres Park, Taco Bell 354".
		ok('"n lowest" on a text property takes the alphabetical start',
			L.find('junction', 'demandCategory', 'bottom', '2').join(',') === 'J1,J3',
			L.find('junction', 'demandCategory', 'bottom', '2').join(','));
		ok('"n highest" takes the alphabetical end',
			L.find('junction', 'demandCategory', 'top', '2').join(',') === 'J5,J2',
			L.find('junction', 'demandCategory', 'top', '2').join(','));
		// A junction nobody named a category on has no value to rank, so it is left out rather
		// than sorted as a blank -- it is not "the lowest category".
		ok('...and a junction with no category is in neither end',
			L.find('junction', 'demandCategory', 'bottom', '10').indexOf('J4') < 0 &&
			L.find('junction', 'demandCategory', 'top', '10').indexOf('J4') < 0);
		ok('a junction with no category is absent from the property entirely',
			names(L.find('junction', 'demandCategory', 'contains', '')) === 'J1,J2,J3,J5',
			names(L.find('junction', 'demandCategory', 'contains', '')));
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());
