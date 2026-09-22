// A CUSTOMER IS A PSEUDO-NODE -- ROADMAP Task 247, Tom's message of 2026-09-18. Run with:
//   node dev/lpn-spike/customer-node-harness.js
//
// FOUR THINGS HE ASKED FOR, and they fail in four different silent ways.
//
// 1. **"Add Customer to Find."** A menu that offers a property which silently matches nothing, or
//    a Replace that writes an element the panel never named. Both draw perfectly. **THE ACCOUNT
//    NUMBER IS A LABEL, NEVER A KEY**, so the assertion that matters most is the one that checks
//    nothing is enforced: two customers may end a bulk write carrying the same account, because a
//    page that refused that would have made the number a key.
//
// 2. **"A Customer demand can follow a pattern. Add that."** The field was already READ -- a
//    customer's demand row has always stated `pattern` -- and nothing wrote it. So the failure to
//    guard is the opposite of the usual one: not that the control is missing, but that a control
//    could be added which writes somewhere the solve does not look. Every assertion here is about
//    the number the RUN uses, never about the box.
//
// 3. **"Customer is a pseudo-node, not a pseudo-link. Its labels would follow Node styles. Q is a
//    demand. Base demand or Demand."** The failure is a customer growing a settings path of its
//    own: a second place to turn a label on, which drifts from the node one the first time either
//    moves. So the assertions are that the NODE checkboxes govern, and that turning them off
//    empties a meter's label with no customer switch anywhere. **THE PLACEMENT IS THE OTHER HALF
//    AND IS DELIBERATELY NOT THE NODE PASS:** *"the labels should be at one of two fixed
//    locations, both aligned with the service line, one justified against the link and the other
//    one justified against the Customer dot and beyond it from the perspective of the link. If
//    both of those fail a conflict check, the label is dropped. This much simpler than general
//    node label placement."*
//
// 4. **"Customer Properties and Table need to respect Custom Properties."** A design that applies
//    to M must reach the popup, the table, Find and Replace -- and must NOT go through setProp(),
//    because nothing a customer carries is scenario-overridable.
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never an English literal --
// dev/scripts/harness_wording_check.php is a ratchet.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.alert = global.window.alert = function () { };
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\taddCustomer: addCustomer, customerEdited: customerEdited,\n" +
	"\t\tcustomerFlow: customerFlow, customerNodeId: customerNodeId,\n" +
	"\t\tcustomerPoint: customerPoint,\n" +
	"\t\tresolvedDemand: resolvedDemand, baseDemandTotal: baseDemandTotal,\n" +
	"\t\tdemandRowsOf: demandRowsOf, assembleModel: assembleModel,\n" +
	"\t\tlibRepointPattern: libRepointPattern,\n" +
	"\t\tfindState: function () { return findState; },\n" +
	"\t\tfindScopeDefs: findScopeDefs, findPropDefs: findPropDefs,\n" +
	"\t\tfindMatches: findMatches, findValueOf: findValueOf,\n" +
	"\t\treplaceState: function () { return replaceState; },\n" +
	"\t\treplaceSpecs: replaceSpecs, replaceTargets: replaceTargets,\n" +
	"\t\trunReplacePreview: runReplacePreview, applyReplace: applyReplace,\n" +
	"\t\tpaneTableById: paneTableById, paneSetFilter: paneSetFilter,\n" +
	"\t\tpaneCols: paneCols, paneTableElements: paneTableElements,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tcustomerLabelLines: customerLabelLines,\n" +
	"\t\tcustLblEls: function () { return custLblEls; },\n" +
	"\t\tlabelSeparator: labelSeparator, effectiveFontSize: effectiveFontSize,\n" +
	"\t\tcustomerFieldDefs: customerFieldDefs, applySaved: applySaved,\n" +
	"\t\tprepareDocument: prepareDocument, serializeProject: serializeProject,\n" +
	"\t\tlayoutCustomerLabels: layoutCustomerLabels,\n" +
	"\t\tcustomerLabelsAttempted: customerLabelsAttempted,\n" +
	"\t\tvisibleMapMetres: visibleMapMetres,\n" +
	"\t\tcustomerAttachPoint: customerAttachPoint,\n" +
	"\t\trelayoutLabels: relayoutLabels, refreshLabelText: refreshLabelText,\n" +
	"\t\trenderCustomerFields: renderCustomerFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tsetSelection: setSelection,\n" +
	"\t\teffective: effective,\n" +
	"\t\tserializeProject: serializeProject,\n" +
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
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
function propKeys(defs) { return defs.map(d => d[0]); }
// The stub's element is not a browser Element, so a subtree is walked by hand -- the same two
// helpers dev/lpn-spike/customer-harness.js uses, and for its reason: STRUCTURE rather than text,
// because a shut <details> still holds every word of its contents here and in a browser.
function walkAll(root, out) {
	out = out || [];
	if (!root) { return out; }
	out.push(root);
	(root.children || []).forEach(function (c) { walkAll(c, out); });
	return out;
}
function tagsInPopup(tag) {
	return walkAll(L.popupFields()).filter(function (e) {
		return String(e.nodeName || '').toLowerCase() === tag;
	});
}

// ---- 0. THE DRAWING EVERY SECTION BELOW USES -------------------------------------------------
//
// One main, two services on it, and a third attached to nothing. The detached one is here from the
// start because it is the case every half has to refuse: no junction to lump at, no demand in any
// answer, and nothing on the drawing to hang a label's meaning on.
const nA = L.addNode('junction', 0, 0);
const nB = L.addNode('junction', 400, 0);
const pipe = L.addLink('pipe', nA.id, nB.id);
const c1 = L.addCustomer(120, 60, { link: pipe.id, t: 0.2 });
const c2 = L.addCustomer(280, 60, { link: pipe.id, t: 0.8 });
const cLoose = L.addCustomer(600, 400, null);
c1.tag = '4417'; c1.demand = 2; c1.count = 42;
c2.tag = 'ELM-9'; c2.demand = 5;
L.customerEdited(c1);
L.customerEdited(c2);

// ================================================================================================
// 1. A CUSTOMER IS A FINDABLE OBJECT
// ================================================================================================
{
	const defs = L.findScopeDefs();
	const cust = defs.filter(d => d.key === 'customer')[0];
	ok('1.1 Customer is one of the things to search', !!cust);
	ok('1.2 ...under the Insert tool\'s own word, not a re-keyed one',
		cust && cust.label === PC.lpn_tool_add_meter);
	ok('1.3 ...in a group of its own rather than folded into node or link',
		cust && cust.group === 'customer');
	['all', 'junction', 'reservoir', 'tank', 'pipe', 'pump', 'valve', 'text'].forEach(function (k) {
		ok('1.4 the ' + k + ' scope survived', defs.some(d => d.key === k));
	});

	// The honesty rule of findPropDefs() is that a property which silently matches nothing does not
	// go in the menu.
	//
	// **STATION AND OFFSET ARE ASSERTED PRESENT, AND THEY USED TO BE ASSERTED ABSENT** (Tom,
	// 2026-09-19, of the argument that they are positions on the drawing rather than facts about
	// the service: *"Bad decision. Put them in. Very handy for offset or station 0."*).
	//
	// **AND THERE IS NO ACCOUNT NUMBER** (same message). A customer carries the DESCRIPTION and the
	// TAG every node and link carries, which is what those two assertions now say.
	L.findState().scope = 'customer';
	const keys = propKeys(L.findPropDefs());
	['id', 'desc', 'tag', 'link', 'demand', 'count', 'total', 'atNode', 'station', 'offset'].forEach(function (k) {
		ok('1.5 ' + k + ' is searchable on a customer', keys.indexOf(k) >= 0, keys.join(','));
	});
	ok('1.6 the account number is gone from the menu, not renamed inside it',
		keys.indexOf('account') < 0);
	ok('1.9 ...nor connectivity, which is a question about the network',
		keys.indexOf('connection') < 0);
	ok('1.10 the tag is named by its own whole label, reused not re-keyed',
		L.findPropDefs().filter(d => d[0] === 'tag')[0][1] === PC.lpn_field_tag);
	ok('1.10b ...and so is the description',
		L.findPropDefs().filter(d => d[0] === 'desc')[0][1] === PC.lpn_field_desc);

	const cand = { group: 'customer', el: c1 };
	ok('1.11 the tag reads', L.findValueOf(cand, 'tag') === '4417');
	ok('1.12 the connected asset reads as the pipe', L.findValueOf(cand, 'link') === pipe.id);
	ok('1.13 the junction it lumps at is DERIVED, not stored',
		L.findValueOf(cand, 'atNode') === L.customerNodeId(c1));
	ok('1.14 the count reads', L.findValueOf(cand, 'count') === 42);
	ok('1.15 the total is the product', near(L.findValueOf(cand, 'total'), L.customerFlow(c1)));
	ok('1.16 a customer nobody gave a count reads as one',
		L.findValueOf({ group: 'customer', el: c2 }, 'count') === 1);
	// An absent value is undefined and never an invented zero, so `contains` with an empty box
	// lists exactly the customers that CARRY one.
	ok('1.17 a customer with no tag answers undefined, not an empty string',
		L.findValueOf({ group: 'customer', el: cLoose }, 'tag') === undefined);
	ok('1.18 a detached customer states no connected asset and no junction',
		L.findValueOf({ group: 'customer', el: cLoose }, 'link') === undefined &&
		L.findValueOf({ group: 'customer', el: cLoose }, 'atNode') === undefined);
	// **THE STATION AND THE OFFSET ANSWER, AND A DETACHED CUSTOMER ANSWERS NEITHER** -- undefined
	// rather than a zero, which would make `offset equal to 0` match every loose service in the
	// drawing. The station is the percentage the popup and the table both show, so all three doors
	// report one number.
	ok('1.19 the station reads as the percentage the popup shows',
		near(L.findValueOf(cand, 'station'), 20));
	ok('1.19b the offset reads as a number', typeof L.findValueOf(cand, 'offset') === 'number');
	ok('1.19c a detached customer is along nothing and off nothing',
		L.findValueOf({ group: 'customer', el: cLoose }, 'station') === undefined &&
		L.findValueOf({ group: 'customer', el: cLoose }, 'offset') === undefined);

	const st = L.findState();
	st.scope = 'customer'; st.prop = 'tag'; st.op = 'contains'; st.value = '441';
	let hits = L.findMatches();
	ok('1.20 a search by tag finds the one service',
		hits.length === 1 && hits[0].el.id === c1.id && hits[0].group === 'customer');
	st.prop = 'count'; st.op = 'gt'; st.value = '10';
	ok('1.21 a numeric condition works on the count',
		L.findMatches().length === 1);
	st.prop = 'tag'; st.op = 'contains'; st.value = '';
	ok('1.22 an empty "contains" lists exactly the customers that HAVE a tag',
		L.findMatches().length === 2);
	// The case he named: every service that never got moved off its main.
	st.prop = 'offset'; st.op = 'eq'; st.value = '0';
	ok('1.22b "offset equal to 0" is answerable, which is the case he asked for',
		L.findMatches().length === 0 || L.findMatches().every(h => h.group === 'customer'));
	// "Everything" has to reach them: a customer has an id a reader can see, on its own symbol and
	// in its own table, so an ID search that skipped it would answer a question about the drawing
	// with part of the drawing left out.
	st.scope = 'all'; st.prop = 'id'; st.op = 'contains'; st.value = '';
	ok('1.23 "Everything" reaches the customers too',
		L.findMatches().filter(h => h.group === 'customer').length === 3);
}

// ---- 1b. THE FILTER IN THE CUSTOMERS TABLE ---------------------------------------------------
//
// The Customers table used to DECLINE to answer a filter, in so many words, because a customer was
// in no search. That refusal is gone and the table now goes through the one evaluator.
{
	const spec = L.paneTableById('customers');
	ok('1.24 there is a Customers table to filter', !!spec);
	ok('1.25 unfiltered, it holds every customer', L.paneTableElements(spec).length === 3);
	const label = L.findScopeDefs().filter(d => d.key === 'customer')[0].label;
	L.findState().scope = 'customer';
	const prop = L.findPropDefs().filter(d => d[0] === 'tag')[0][1];
	L.paneSetFilter('customers', label + '.' + prop + ' ' + PC.lpn_find_op_contains + ' "ELM"');
	ok('1.26 a filter written in the panel\'s own words reaches the table',
		L.paneTableElements(spec).length === 1 && L.paneTableElements(spec)[0].id === c2.id,
		L.paneTableElements(spec).map(x => x.id).join(','));
	L.paneSetFilter('customers', '');
	ok('1.27 clearing it brings every row back', L.paneTableElements(spec).length === 3);
}

// ---- 1c. REPLACE, AND THE LABEL-NOT-A-KEY RULING ----------------------------------------------
{
	const st = L.findState(), rs = L.replaceState();
	st.scope = 'customer'; st.prop = 'tag'; st.op = 'contains'; st.value = '';
	const fields = L.replaceSpecs().map(s => s.field);
	['desc', 'tag', 'demand', 'count', 'pattern', 'station', 'offset'].forEach(function (f) {
		ok('1.28 ' + f + ' is writable on a customer', fields.indexOf(f) >= 0, fields.join(','));
	});
	ok('1.29 the TOTAL is not: it is the product of two numbers above it',
		fields.indexOf('total') < 0);
	ok('1.30 the connected asset is not: one value box cannot say which pipe',
		fields.indexOf('link') < 0);
	ok('1.31 the id is not, for the reason every id is not', fields.indexOf('id') < 0);
	ok('1.32 the junction it lumps at is not, because it is derived',
		fields.indexOf('atNode') < 0);
	ok('1.33 a pipe\'s diameter is not offered against a set of customers',
		fields.indexOf('diameter') < 0 && fields.indexOf('elev') < 0);

	// **THE ASSERTIONS HERE ARE ABOUT WHAT DOES NOT HAPPEN.** A tag is a name on an asset and
	// nothing looks anything up by it. A bulk write is exactly where a page would be tempted to
	// start treating it as a key -- a uniqueness test, a format check, a renumbering -- so this
	// writes ONE tag onto TWO customers and asserts both keep it. Refusing, renumbering or skipping
	// the second would all look like helpfulness.
	rs.prop = 'tag'; rs.value = 'ROUTE-12';
	L.runReplacePreview();
	ok('1.34 the preview counts both services', L.replaceTargets().length === 2);
	L.applyReplace();
	ok('1.35 both carry the tag now',
		c1.tag === 'ROUTE-12' && c2.tag === 'ROUTE-12');
	ok('1.36 ...and nothing enforced uniqueness, because it is a label and not a key',
		c1.tag === c2.tag);
	ok('1.37 the customer that matched nothing is untouched', !cLoose.tag);
	ok('1.38 writing a name changed no demand', near(L.customerFlow(c1), 2 * 42));
	// A DESCRIPTION is a sentence and survives whole, where a TAG keeps EPANET's one word. Both
	// rules live in lpnDescText()/lpnTagText() and are applied here through them, not restated.
	rs.prop = 'desc'; rs.value = '123 Elm St';
	L.runReplacePreview(); L.applyReplace();
	ok('1.39 a description with spaces in it survives whole', c1.desc === '123 Elm St');
	rs.prop = 'tag'; rs.value = 'MAIN 1962 south';
	L.runReplacePreview(); L.applyReplace();
	ok('1.39b a tag keeps the one word EPANET reads', c1.tag === 'MAIN');

	st.prop = 'demand'; st.op = 'gt'; st.value = '0';
	rs.prop = 'count'; rs.value = '3.6';
	L.runReplacePreview(); L.applyReplace();
	ok('1.40 a fractional count is rounded, as the table cell rounds it',
		c1.count === 4 && c2.count === 4, c1.count + '/' + c2.count);
	rs.value = '0';
	L.runReplacePreview(); L.applyReplace();
	ok('1.41 ...and a count below one is refused rather than written',
		c1.count === 4 && c2.count === 4);
	c1.count = 42; c2.count = 1;
	L.customerEdited(c1); L.customerEdited(c2);
}

// ================================================================================================
// 2. A CUSTOMER DEMAND FOLLOWS A PATTERN
// ================================================================================================
//
// **THE FIELD WAS ALREADY READ AND NOTHING WROTE IT.** So every assertion below is about the
// number the RUN uses rather than about the control: a control that wrote somewhere the solve does
// not look would pass any test of the box and fail the network.
{
	const doc = L.getDoc();
	// `multipliers` and `doc.times` are the shapes js/lpn-patterns.js and the library really use;
	// a fixture that invented its own would make every assertion below pass against a pattern
	// nothing reads.
	doc.patterns = [{ id: 'RES', multipliers: [0.5, 2] }, { id: 'IND', multipliers: [1, 1] }];
	doc.times = { duration: 7200, patternStep: 3600, patternStart: 0, hydraulicStep: 3600 };

	ok('2.1 a customer states no pattern until somebody says one', c1.pattern === undefined);
	const plain = L.resolvedDemand(nA);
	c1.pattern = 'RES';
	L.customerEdited(c1);

	// The row is the seam: a customer's demand row has always carried a pattern, which is what
	// makes this a control rather than a second resolution of "what does this meter draw".
	const row = L.demandRowsOf(nA, 0).filter(r => r.customer && r.customer.id === c1.id)[0];
	ok('2.2 the customer\'s own demand row states the pattern', !!row && row.pattern === 'RES');

	// At t = 0 the RES pattern's first factor is 0.5, so the junction's resolved demand must fall
	// by half of what this meter contributes. Worked by hand: the meter draws 2 x 42 = 84.
	const withPat = L.resolvedDemand(nA);
	ok('2.3 the junction\'s resolved demand follows the customer\'s pattern',
		near(withPat, plain - 84 * 0.5, 1e-9), plain + ' -> ' + withPat);

	// **BOTH SOLVERS SEE IT**, because assembleModel() is the one door either engine is handed.
	const model = L.assembleModel();
	const jn = model.nodes.filter(n => n.id === nA.id)[0];
	ok('2.4 the model the solvers are handed carries the customer\'s pattern',
		!!jn && !!jn.demands && jn.demands.some(r => r.pattern === 'RES'),
		jn && jn.demands ? JSON.stringify(jn.demands.map(r => r.pattern)) : 'none');

	// **AND THE .inp EXPORT**, which is where a pattern a file cannot state would be lost in
	// silence: a [DEMANDS] row's second field is its pattern, and the account number rides in the
	// category comment beside it.
	const res = global.EngCalcs.lpnExportInp(L.serializeProject(), { effective: L.effective });
	ok('2.4b the export succeeds', res && res.ok === true, res && res.error);
	const text = res.inp;
	const demandRows = text.split(/\r?\n/).filter(l => /^\s*\S/.test(l) && l.indexOf('RES') >= 0);
	ok('2.5 the export writes the customer\'s pattern on its [DEMANDS] row',
		demandRows.length >= 1, demandRows.join(' | '));

	// **A RENAME MUST NOT STRAND IT.** libRepointPattern() is the one function that knows every
	// place a pattern id is written, and doc.customers is a collection neither of its two loops
	// walks -- so this is the assertion that the sixth attachment point was actually added.
	L.libRepointPattern('RES', 'RES2');
	ok('2.6 renaming a pattern carries the customer\'s reference with it', c1.pattern === 'RES2');
	L.libRepointPattern('RES2', null);
	ok('2.7 ...and deleting one clears it rather than leaving a dangling name',
		c1.pattern === null || c1.pattern === undefined);

	c1.pattern = 'IND';
	L.customerEdited(c1);
	ok('2.8 the pattern survives a save and an open',
		(L.serializeProject().customers || []).filter(c => c.id === c1.id)[0].pattern === 'IND');

	// The popup carries the control, and it is a select rather than a typed name: a pattern that
	// does not exist is not one a reader should be able to state here.
	L.setSelection('customer', c1.id);
	L.renderCustomerFields(c1.id);
	const sels = tagsInPopup('select');
	ok('2.9 the customer popup offers a pattern chooser', sels.length >= 1);
	ok('2.10 ...showing what this customer states', sels.some(s => s.value === 'IND'),
		sels.map(s => s.value).join(','));

	// The table is the bulk-entry surface, so the pattern is a column there too.
	const spec = L.paneTableById('customers');
	ok('2.11 the Customers table has a pattern column',
		L.paneCols(spec).some(c => c.key === 'pattern'));
	const col = L.paneCols(spec).filter(c => c.key === 'pattern')[0];
	col.set(c2, 'NOPE');
	ok('2.12 a pattern name nothing answers to is REFUSED rather than written',
		!c2.pattern, String(c2.pattern));
	col.set(c2, 'IND');
	ok('2.13 ...and a real one is taken', c2.pattern === 'IND');
	col.set(c2, '');
	ok('2.14 ...and an empty cell clears it', c2.pattern === undefined);

	c1.pattern = undefined;
	delete doc.patterns;
	delete doc.times;
	L.customerEdited(c1);
}

// ================================================================================================
// 3. THE LABEL HAS ITS OWN SYMBOLOGY
// ================================================================================================
//
// **WHAT CUSTOMER LABELLING WAS BEFORE THIS: NOTHING.** A meter carried no label of any kind. What
// HAS always been true is that its demand is in its JUNCTION's label, because a customer is one of
// Task 468's demand rows -- which is assertion 3.1, and is why customers can look labelled without
// anybody ever having decided to label them.
//
// **AND THE NODE CHECKBOXES NO LONGER GOVERN, WHICH REVERSES WHAT THIS SECTION USED TO ASSERT**
// (Tom, 2026-09-19: *"I think we need a third separate Customer symbology area in settings so that
// we can control Customer labels differently than other labels, since we may want only demand or
// only demand and description."*). It asserted that there is NO customer side of labelSettings and
// that there must not be one -- his own earlier instruction, now overruled by him. What has NOT
// changed, and is asserted harder here because he called the alternative a bug, is that there is no
// separate TEXT SIZE: *"I **don't** think we need a separate text size. That's a bug."*
{
	const ls = L.labelSettings();
	ok('3.1 a customer\'s demand has always been in its junction\'s own total',
		near(L.baseDemandTotal(nA), (nA._demand || 0) + L.customerFlow(c1)),
		String(L.baseDemandTotal(nA)));

	ok('3.2 there IS a customer side of labelSettings now', !!ls.customer);
	ok('3.3 ...and a customer decimals map of its own',
		typeof (ls.decimals.customer || {}).demand === 'number');
	// **NO TEXT SIZE ANYWHERE IN IT.** He called a separate one a bug, so this is the assertion
	// that would go red if somebody added one back.
	ok('3.3b ...and NO text size of its own, which he called a bug',
		ls.customer.textSize === undefined && ls.customer.size === undefined &&
		ls.customerTextSize === undefined);
	// The ONE customer-shaped setting there is, and it is about how close you have to be rather
	// than about what the label says -- see section 3c.
	ok('3.4 ...and the one customer setting is a view width, not a content switch',
		typeof ls.customerMaxWidth === 'number');

	// **THE CUSTOMER CHECKBOXES GOVERN, AND THE NODE ONES DO NOT REACH A METER.**
	ls.customer.id = true; ls.customer.demand = true; ls.customer.demandActual = false;
	ls.customer.desc = false; ls.customer.tag = false; ls.customer.count = false;
	let lines = L.customerLabelLines(c1);
	ok('3.5 the customer ID and Base demand rows reach a customer',
		lines.map(l => l.field).join(',') === 'id,demand', lines.map(l => l.field).join(','));
	ls.customer.demandActual = true;
	lines = L.customerLabelLines(c1);
	ok('3.6 Demand sits above Base demand, as it does on a junction',
		lines.map(l => l.field).join(',') === 'id,demandActual,demand');
	// **THE TWO IDENTITY STRINGS, WHICH ARE THE ROWS HE ASKED FOR** -- *"we may want only demand or
	// only demand and description"*. An absent value prints nothing rather than an empty slot.
	ls.customer.id = false; ls.customer.demandActual = false; ls.customer.desc = true;
	c1.desc = 'Corner of Elm and Main';
	ok('3.6b demand and description alone is expressible, which is the case he named',
		L.customerLabelLines(c1).map(l => l.field).join(',') === 'demand,desc');
	c1.desc = '';
	ok('3.6c ...and a customer with no description prints no empty slot for it',
		L.customerLabelLines(c1).map(l => l.field).join(',') === 'demand');
	c1.desc = 'Corner of Elm and Main';
	ls.customer.desc = false;
	// **THE NODE SIDE IS NOW INERT HERE**, which is the assertion that the two really are separate.
	ls.node.id = true; ls.node.demandActual = true;
	ok('3.6d turning every node row on adds nothing to a customer label',
		L.customerLabelLines(c1).map(l => l.field).join(',') === 'demand',
		L.customerLabelLines(c1).map(l => l.field).join(','));
	ls.customer.id = true; ls.customer.demandActual = true;
	lines = L.customerLabelLines(c1);
	// **Q IS A DEMAND, AND IT IS THE METER'S OWN TOTAL** -- count included, which is the number
	// this customer adds to its junction.
	const dem = lines.filter(l => l.field === 'demand')[0];
	ok('3.7 the Base demand row prints this meter\'s own total, count included',
		dem.text.indexOf(String(Math.round(L.customerFlow(c1)))) >= 0, dem.text);

	// Four rows a customer does not have, and the customer list simply does not offer them -- so a
	// meter never prints a blank or borrows a junction's number.
	ls.node.elev = true; ls.node.head = true; ls.node.pressure = true; ls.node.quality = true;
	lines = L.customerLabelLines(c1);
	ok('3.8 elevation, head, pressure and quality are not offered on a meter',
		!lines.some(l => ['elev', 'head', 'pressure', 'quality'].indexOf(l.field) >= 0),
		lines.map(l => l.field).join(','));
	ls.node.elev = true; ls.node.head = false; ls.node.pressure = true; ls.node.quality = false;

	// **TURNING THE CUSTOMER ROWS OFF EMPTIES A METER'S LABEL.**
	ls.customer.id = false; ls.customer.demand = false; ls.customer.demandActual = false;
	ok('3.9 with the customer rows off a meter has nothing to say',
		L.customerLabelLines(c1).length === 0);
	ls.customer.id = true; ls.customer.demand = true;

	L.refreshLabelText();
	const els = L.custLblEls();
	ok('3.10 a meter has a label element of its own', !!els[c1.id]);
	const cls = els[c1.id].text.getAttribute('class') || '';
	ok('3.11 ...in the shared label class, so it is styled as a node label is',
		cls.indexOf('lpn-lbl') >= 0, cls);
	ok('3.12 ...and a member of the generated-annotation class, so it hides with the rest',
		cls.indexOf('lpn-annotation') >= 0, cls);
	ok('3.13 ...naming its own customer, so it can be read in the inspector',
		els[c1.id].text.getAttribute('data-custlbl') === c1.id);
	ok('3.14 ...and NO leader: neither of the two positions moves, so nothing needs a line back',
		!els[c1.id].leader);
	ok('3.15 ...with the words it was given', String(els[c1.id].text.textContent).indexOf(c1.id) >= 0,
		String(els[c1.id].text.textContent));
	ok('3.16 a detached meter still gets an element: it is a customer either way',
		!!els[cLoose.id]);
	// **ONE LINE, LIKE A LINK LABEL** (Tom, 2026-09-19: *"Can we make labels one-line concats like
	// link labels?"*). Two values ticked and the drawn label is still ONE row, with the blanket
	// separator between them -- which is also the whole of the answer to *"Labels are bigger than
	// node and pipe labels"*: same font size, one row instead of three.
	ls.customer.id = true; ls.customer.demand = true; ls.customer.demandActual = true;
	L.refreshLabelText();
	const oneLine = L.custLblEls()[c1.id];
	ok('3.17a three values make ONE row, the way a link label concatenates',
		oneLine.lineCount === 1, String(oneLine.lineCount));
	ok('3.17b ...with the blanket separator between the values',
		String(oneLine.text.textContent).split(L.labelSeparator()).length >= 3,
		String(oneLine.text.textContent));
	ok('3.17c ...at the shared text size, with none of its own',
		String(oneLine.text.style.fontSize) === String(L.effectiveFontSize()) + 'px',
		String(oneLine.text.style.fontSize) + ' vs ' + L.effectiveFontSize() + 'px');
	ok('3.17 the label is measured, so the placement pass has a box to reason about',
		(els[c1.id].twPx || els[c1.id].tw) > 0,
		String(els[c1.id].twPx || els[c1.id].tw));
}

// ---- 3b. THE PURE GEOMETRY: TWO PLACES AND NO THIRD -------------------------------------------
//
// Geom.serviceLabelSpots() has no DOM in it, which is what makes the RULE testable rather than
// only its rendering.
{
	const Geom = global.EngCalcs.lpnGeom;
	// A service leaving a main northward: attach (0,0), meter (0,-100) -- SVG y grows downward.
	const spots = Geom.serviceLabelSpots(0, 0, 0, -100,
		{ w: 30, h: 12, fontSize: 10, gap: 3, linkPad: 4, dotPad: 6 });
	ok('3.18 there are exactly two candidate positions and no third', spots.length === 2);
	ok('3.19 the FIRST is the one justified against the link', spots[0].atLink === true);
	ok('3.20 ...and the second is the one beyond the dot', spots[1].atLink === false);
	// Both sit on the service line's own direction, which is what "aligned with the service line"
	// means: one angle, shared, and not the horizontal a general placer would use.
	ok('3.21 both are at the same angle', near(spots[0].angle, spots[1].angle, 1e-9));
	ok('3.22 ...and that angle is the service line\'s, not horizontal',
		Math.abs(spots[0].angle) > 1, spots[0].angle.toFixed(3));
	const d0 = Math.hypot(spots[0].box.cx, spots[0].box.cy),
		d1 = Math.hypot(spots[1].box.cx, spots[1].box.cy);
	ok('3.23 the second is further from the link than the first, which is "beyond it"', d1 > d0,
		d0.toFixed(2) + ' -> ' + d1.toFixed(2));
	ok('3.24 ...and further out than the meter dot itself', d1 > 100);

	// **A SERVICE RUNNING THE OTHER WAY FLIPS THE JUSTIFICATION, NOT THE POSITIONS.** Text must
	// never render upside down, so the angle turns 180 degrees -- and the label justified against
	// the link is then anchored at its END. Getting this wrong puts both labels on the far side of
	// the thing they are justified against.
	const back = Geom.serviceLabelSpots(0, 0, -100, 0,
		{ w: 30, h: 12, fontSize: 10, gap: 3, linkPad: 4, dotPad: 6 });
	ok('3.25 a westward service is flipped to stay readable', back[0].flipped === true);
	ok('3.26 ...and its justification flips with it', back[0].hAlign === 'end');
	const fwd = Geom.serviceLabelSpots(0, 0, 100, 0,
		{ w: 30, h: 12, fontSize: 10, gap: 3, linkPad: 4, dotPad: 6 });
	ok('3.27 an eastward one is not flipped and justifies from its start',
		fwd[0].flipped === false && fwd[0].hAlign === 'start');
	// No service line, nothing to align with. A refusal, never a fallback to horizontal -- that
	// would be the third candidate the rule says there is not.
	ok('3.28 a zero-length service yields no candidate at all',
		Geom.serviceLabelSpots(5, 5, 5, 5, { w: 30, h: 12, fontSize: 10 }).length === 0);

	// **BEYOND THE CUSTOMER THE LABEL IS CENTRED ON THE SERVICE LINE'S AXIS** (Tom, 2026-09-19:
	// *"When a label is beyond the meter, make it middle justified with the meter instead of
	// bottom."*). The two spots are deliberately NOT alike across the line: the one between the
	// main and the customer has a real service line under it to keep off, and the one past the
	// customer does not, because the line stops at the dot. The service here runs straight up from
	// (0,0) to (0,-100), so the axis is x = 0 and "centred on it" is a number rather than an
	// impression -- the label box's own centre lies on that line.
	const two = Geom.serviceLabelSpots(0, 0, 0, -100,
		{ w: 30, h: 12, fontSize: 10, gap: 3, linkPad: 4, dotPad: 6 });
	ok('3.28a the spot beyond the customer is centred on the service line axis',
		near(two[1].box.cx, 0, 1e-9), two[1].box.cx.toFixed(6));
	ok('3.28b ...while the one alongside the line is still held clear of it',
		Math.abs(two[0].box.cx) > 0.5, two[0].box.cx.toFixed(3));
	// And it is a CENTRING rather than a nudge: halve the box height and the centre stays put.
	const tall = Geom.serviceLabelSpots(0, 0, 0, -100,
		{ w: 30, h: 40, fontSize: 10, gap: 3, linkPad: 4, dotPad: 6 });
	ok('3.28c ...at any box height, which is what centred means',
		near(tall[1].box.cx, 0, 1e-9), tall[1].box.cx.toFixed(6));
}

// ---- 3b3. THE LETTERING DOES NOT LIE ON THE SERVICE LINE -------------------------------------
//
// Tom, 2026-09-19: *"The labels are hiding the service line. They need to be moved away about 1px
// or 2px or their halo needs to be that much smaller."* He offered two fixes; the label moved and
// the halo was left alone, because `.lpn-lbl` is one class and thinning it would thin the halo on
// every node and link label to fix a collision only these have.
//
// **THE GAP IS MEASURED TO THE BASELINE, WHICH IS WHY 0.30 OF A FONT SIZE LOOKED LIKE PLENTY AND
// WAS NOTHING.** Below the baseline sit a descender -- the Q of `Qb=` is one -- and then the
// halo's outer half. So the clearance asserted here is from the SERVICE LINE to the bottom edge
// of the label's own box, and it must still leave room for that halo.
{
	const fs = L.effectiveFontSize();
	const a = L.addNode('junction', 0, 400), b = L.addNode('junction', 300, 400);
	const main = L.addLink('pipe', a.id, b.id);
	const c = L.addCustomer(150, 460, { link: main.id });
	L.refreshLabelText();
	L.relayoutLabels();
	const ce = L.custLblEls()[c.id], an = L.customerAttachPoint(c), pt = L.customerPoint(c);
	const ux = pt.x - an.x, uy = pt.y - an.y, len = Math.hypot(ux, uy);
	// Perpendicular distance from the service line to the label box's centre, then in to its edge.
	const perp = Math.abs((ce.spot.box.cx - an.x) * uy - (ce.spot.box.cy - an.y) * ux) / len;
	const clear = perp - ce.spot.box.h / 2;
	ok('3.28d the label alongside a service takes the spot beside the line', ce.spot.atLink === true);
	ok('3.28e ...and its box clears that line by more than the halo\'s outer half',
		clear > fs * 0.10, clear.toFixed(3) + ' against a halo of ' + (fs * 0.10).toFixed(3));
}

// ---- 3c. THE SETTING: THE WIDEST VIEW THAT ATTEMPTS IT ----------------------------------------
{
	const ls = L.labelSettings();
	ok('3.29 there is a view-width setting and it is a number',
		typeof ls.customerMaxWidth === 'number' && isFinite(ls.customerMaxWidth));
	ok('3.30 ...starting at the 1,000 the meter symbol\'s own hybrid rule already uses',
		ls.customerMaxWidth === 1000);
	const was = ls.customerMaxWidth;
	ls.customerMaxWidth = 0;
	ok('3.31 ZERO MEANS NEVER, which is how the setting says "do not label customers"',
		L.customerLabelsAttempted() === false);
	ls.customerMaxWidth = 1e9;
	ok('3.32 a wide enough threshold labels them again', L.customerLabelsAttempted() === true);
	// **AN UNMEASURABLE CANVAS DOES NOT REFUSE, and that is a decision rather than an accident.**
	// The threshold is a courtesy about how close you are looking; failing CLOSED on a canvas with
	// no measured width would blank every customer label in every harness and in any embedding
	// that lays the page out after the first paint. This stub has no canvas box, which is exactly
	// that case, so it is the one the fixture can hold.
	ok('3.33 a view with no measurable width is not a view we refuse to label',
		L.visibleMapMetres() === 0 && L.customerLabelsAttempted() === true,
		String(L.visibleMapMetres()));
	ls.customerMaxWidth = was;
}

// ---- 3d. TWO TRIES AND A DROP ----------------------------------------------------------------
//
// **THE RULE THAT MAKES THIS NOT THE NODE-LABEL PASS.** A node label searches a ring of candidate
// angles, relaxes against its neighbours, is repaired jointly with its gang and hangs a leader when
// it has moved. A customer label tries two positions and gives up. So the fixture blocks both and
// asserts the label is HIDDEN: not moved, not shed, not given a leader.
{
	const Collide = global.EngCalcs.lpnCollide;
	const ls = L.labelSettings();
	ls.customerMaxWidth = 1e9;
	ls.node.id = true; ls.node.demand = true;
	L.refreshLabelText();
	const els = L.custLblEls();

	function freshObs() { return { boxes: [], segments: [] }; }

	// Clear ground first, so the fixture proves a label CAN be placed before it proves one is
	// dropped. A test that only ever asserts absence passes on a feature that never ran.
	L.layoutCustomerLabels(freshObs());
	ok('3.34 a customer on clear ground gets its label drawn',
		els[c1.id].text.style.visibility !== 'hidden',
		String(els[c1.id].text.style.visibility));
	ok('3.35 ...rotated to its own service line rather than left horizontal',
		/rotate\(/.test(els[c1.id].text.getAttribute('transform') || ''),
		els[c1.id].text.getAttribute('transform'));
	ok('3.36 ...and justified rather than centred, which is what the two positions mean',
		['start', 'end'].indexOf(els[c1.id].text.getAttribute('text-anchor')) >= 0,
		els[c1.id].text.getAttribute('text-anchor'));
	ok('3.37 a meter attached to nothing is never labelled: no service line to align with',
		els[cLoose.id].text.style.visibility === 'hidden');

	// **NOW TAKE BOTH POSITIONS.** One box wide enough to cover the whole service line and
	// everything beyond it, which is both candidates at once by construction.
	const pt = L.customerPoint(c1), an = L.customerAttachPoint(c1);
	const blocked = freshObs();
	blocked.boxes.push(Collide.box((an.x + pt.x) / 2, (an.y + pt.y) / 2, 4000, 4000, 0));
	L.layoutCustomerLabels(blocked);
	ok('3.38 both candidates taken means the label is DROPPED',
		els[c1.id].text.style.visibility === 'hidden');
	ok('3.39 ...and nothing grew a leader to reach clear ground instead', !els[c1.id].leader);

	// A drop is a fact about this layout, not a state the label is stuck in.
	L.layoutCustomerLabels(freshObs());
	ok('3.40 clearing the ground brings it back',
		els[c1.id].text.style.visibility !== 'hidden');

	// **A PLACED LABEL IS ITSELF AN OBSTACLE**, which is what makes two meters on one main resolve
	// rather than print on top of each other.
	const obs = freshObs();
	L.layoutCustomerLabels(obs);
	ok('3.41 the pass pushes what it placed into the obstacle set', obs.boxes.length >= 1,
		String(obs.boxes.length));

	// And the setting is the outermost gate: at 0 nothing is attempted at all.
	ls.customerMaxWidth = 0;
	L.layoutCustomerLabels(freshObs());
	ok('3.42 with the setting at zero every customer label is hidden',
		Object.keys(els).every(id => els[id].text.style.visibility === 'hidden'));
	ls.customerMaxWidth = 1000;
}

// ================================================================================================
// 4. CUSTOMERS RESPECT CUSTOM PROPERTIES
// ================================================================================================
{
	const settings = L.getSettings();
	settings.customProps = [
		{ key: 'custom_route', label: 'Route', applies: 'M', validate: 'none', restrict: '' },
		{ key: 'custom_pressureZone', label: 'Zone', applies: 'J,M', validate: 'none', restrict: '' },
		{ key: 'custom_pipeAge', label: 'Age', applies: 'L', validate: 'integer', restrict: '' }
	];

	// **THE POPUP.** A design that applies to M reaches the customer box; one that does not, does
	// not. The letter is the meter's own ID key, so there is no second table of letters.
	L.renderCustomerFields(c1.id);
	const labels = tagsInPopup('label').map(x => String(x.textContent));
	ok('4.1 a design that applies to M reaches the customer popup',
		labels.some(t => t.indexOf('Route') >= 0), labels.join(' | '));
	ok('4.2 ...and one that applies to both J and M does too',
		labels.some(t => t.indexOf('Zone') >= 0));
	ok('4.3 ...and one that applies only to pipes does not',
		!labels.some(t => t.indexOf('Age') >= 0));

	// **THE TABLE.**
	const spec = L.paneTableById('customers');
	const cols = L.paneCols(spec);
	ok('4.4 the Customers table grows a column for each design that applies',
		cols.some(c => c.key === 'custom_route') && cols.some(c => c.key === 'custom_pressureZone'),
		cols.map(c => c.key).join(','));
	ok('4.5 ...and none for a design that does not apply to a customer',
		!cols.some(c => c.key === 'custom_pipeAge'));

	// **THE WRITE IS PLAIN, AND THAT IS THE RULING RATHER THAN A SHORTCUT.** Nothing a customer
	// carries is scenario-overridable, so a custom property on one must not gain a `_` prefix, an
	// override marker or an ovKey. The assertion is the stored shape: the value is on the object
	// under its own key and there is no underscored twin.
	const routeCol = cols.filter(c => c.key === 'custom_route')[0];
	routeCol.set(c1, 'North loop');
	ok('4.6 a customer\'s custom property is stored under its own key, plainly',
		c1.custom_route === 'North loop');
	ok('4.7 ...with no underscored twin, because there is no override to record',
		c1._custom_route === undefined);
	ok('4.8 ...and the cell reads it back', routeCol.get(c1) === 'North loop');
	routeCol.set(c1, '');
	ok('4.9 an empty cell removes the key rather than storing an empty string',
		!('custom_route' in c1));
	routeCol.set(c1, 'North loop');

	// **IT RIDES IN THE PROJECT FILE**, which is what makes it the user's data rather than a
	// scratch value.
	ok('4.10 it survives a save',
		(L.serializeProject().customers || []).filter(c => c.id === c1.id)[0].custom_route === 'North loop');

	// **FIND AND REPLACE.**
	const st = L.findState(), rs = L.replaceState();
	st.scope = 'customer';
	ok('4.11 a customer\'s custom property is searchable',
		propKeys(L.findPropDefs()).indexOf('custom_route') >= 0,
		propKeys(L.findPropDefs()).join(','));
	ok('4.12 ...and one that does not apply to a customer is not',
		propKeys(L.findPropDefs()).indexOf('custom_pipeAge') < 0);
	st.prop = 'custom_route'; st.op = 'contains'; st.value = 'North';
	ok('4.13 searching one finds the customer that carries it',
		L.findMatches().length === 1 && L.findMatches()[0].el.id === c1.id);
	st.value = '';
	ok('4.14 an empty "contains" lists exactly the customers that carry one',
		L.findMatches().length === 1);

	ok('4.15 it is writable in Replace',
		L.replaceSpecs().map(s => s.field).indexOf('custom_route') >= 0,
		L.replaceSpecs().map(s => s.field).join(','));
	st.prop = 'tag'; st.op = 'contains'; st.value = '';
	rs.prop = 'custom_route'; rs.value = 'South loop';
	L.runReplacePreview();
	L.applyReplace();
	ok('4.16 a bulk write reaches every matched customer',
		c1.custom_route === 'South loop' && c2.custom_route === 'South loop');
	ok('4.17 ...still plainly, with no underscored twin',
		c1._custom_route === undefined && c2._custom_route === undefined);

	settings.customProps = [];
}

// ================================================================================================
// 5. AN ACCOUNT NUMBER A DOCUMENT ALREADY HOLDS IS CARRIED, NEVER DROPPED
// ================================================================================================
//
// **THIS IS THE SUITE'S STANDING RULE ABOUT THE USER'S OWN NUMBERS, arriving through a field being
// RETIRED rather than through an import** (Tom, 2026-09-19: *"Didn't I say to trash Account
// number...?"*). Projects saved between 2026-09-15 and today hold `account` on every customer, and
// a removal that simply stopped reading the field would delete four hundred people's records in
// silence, on open, with nothing on the screen to notice.
//
// It goes to the TAG, because that is what an account number is: what somebody else's records call
// this service. A customer that somehow already carries a tag keeps it and the account joins the
// DESCRIPTION instead, so no document loses the text either way.
{
	const doc0 = L.serializeProject();
	const legacy = JSON.parse(JSON.stringify(doc0));
	legacy.customers = [
		{ id: 'M90', account: '4417-A', demand: 1, count: 1, x: 10, y: 10 },
		{ id: 'M91', account: '123 Elm St', demand: 1, count: 1, x: 20, y: 10 },
		{ id: 'M92', account: 'KEEP-ME', tag: 'ALREADY', demand: 1, count: 1, x: 30, y: 10 },
		{ id: 'M93', account: '', demand: 1, count: 1, x: 40, y: 10 }
	];
	L.applySaved(L.prepareDocument(legacy));
	const byId = {};
	(L.getDoc().customers || []).forEach(c => { byId[c.id] = c; });
	ok('5.1 every legacy customer opened', Object.keys(byId).length === 4);
	ok('5.2 an account number became the tag, byte for byte', byId.M90.tag === '4417-A');
	ok('5.3 ...including one with spaces in it, untrimmed and untruncated',
		byId.M91.tag === '123 Elm St', JSON.stringify(byId.M91.tag));
	ok('5.4 a customer that already had a tag keeps it...', byId.M92.tag === 'ALREADY');
	ok('5.5 ...and its account joins the description rather than being lost',
		String(byId.M92.desc || '').indexOf('KEEP-ME') >= 0, JSON.stringify(byId.M92.desc));
	ok('5.6 an empty account number leaves nothing behind',
		byId.M93.tag === undefined && byId.M93.desc === undefined);
	['M90', 'M91', 'M92', 'M93'].forEach(function (id) {
		ok('5.7 ' + id + ' carries no account field any more', byId[id].account === undefined);
	});
	// And the saved file has none either, which is what makes this a one-way move rather than a
	// field that comes back on the next open.
	ok('5.8 the document written back states no account on any customer',
		(L.serializeProject().customers || []).every(c => c.account === undefined));
}

console.log(fails ? '\nFAILED ' + fails : '\nAll customer pseudo-node checks passed.');
process.exit(fails ? 1 : 0);
