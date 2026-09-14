// Headless check of the CUSTOM PROPERTY -- ROADMAP Task 636, dev/custom-property-scope.md.
//
//   node dev/lpn-spike/custom-property-harness.js
//
// WHY THIS EXISTS, and it is three questions rather than one.
//
// 1. **THE KEY IS NAMESPACED, SO A COLLISION WITH A BUILT-IN FIELD IS IMPOSSIBLE** (Tom,
//    2026-09-13) rather than refused by a reserved list that would go stale. The failure it
//    prevents is perfectly silent: a custom property keyed `demand` would land on `el._demand`,
//    the solver would read it as a demand, and the map would simply be wrong with no error
//    anywhere. So the test is the adversarial one -- design a property under every built-in name
//    this page has and assert that not one of them reaches a built-in reader.
//
// 2. **A CUSTOM PROPERTY IS SCENARIO-OVERRIDABLE LIKE EVERYTHING ELSE, WHICH MEANS setProp()**
//    (*"Let the people do the things!"*). dev/scenario-seam-repair.md is the record of what a
//    write that misses that seam costs: inside a scenario it edits BASE under every other scenario
//    at once, with the right number still on screen. dev/scripts/scenario_seam_check.php CANNOT
//    see this one -- it parses LPN_OVERRIDABLE for literal property names, and a key the user
//    invents has no literal to be in -- so the seam is held here instead, at every door: the
//    property popup, the Tables pane, the multi-properties box and Find and replace.
//
// 3. **AN OUT-OF-DESIGN VALUE IS FLAGGED IN PLACE AND NEVER CLEARED** (his own words: *"this could
//    be a beautiful exploration tool. You change the constraints just to do a bit of data entry
//    error checking."*). That makes validation a QUERY, so the assertion is about the BYTES: after
//    tightening a limit the value must still be the exact string the user typed, and after
//    loosening it again the flag must simply go out.
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never an English literal --
// dev/scripts/harness_wording_check.php is a ratchet, and a pinned wording taxes exactly the
// rewording this project most wants to be free.

const { ROOT, setUnitSet, loadLoopedNetwork, ensure } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

let lastAlert = null;
global.alert = global.window.alert = function (m) { lastAlert = m; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\teffective: effective, setProp: setProp, isOverridable: isOverridable,\n" +
	"\t\thasOverride: hasOverride, baseValue: baseValue,\n" +
	"\t\tcustomPropKey: customPropKey, customPropProblem: customPropProblem,\n" +
	"\t\tcustomPropsFor: customPropsFor, customPropDefByKey: customPropDefByKey,\n" +
	"\t\tsetCustomProp: setCustomProp, customPropValue: customPropValue,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveScenario: activeScenario,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tcustomBody: function () { return document.getElementById('lpn_set_custom_fields'); },\n" +
	"\t\tsetboxHeadingText: setboxHeadingText,\n" +
	"\t\tcustomPropValidateOptions: customPropValidateOptions,\n" +
	"\t\tcustomPropBareKey: customPropBareKey,\n" +
	"\t\tpushSpecList: pushSpecList, pushFieldShown: pushFieldShown,\n" +
	"\t\tpaneTables: paneTables, paneCols: paneCols, paneWriteCellText: paneWriteCellText,\n" +
	"\t\tfindState: function () { return findState; }, findPropDefs: findPropDefs,\n" +
	"\t\tfindValueOf: findValueOf, findPropIsText: findPropIsText,\n" +
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
function settings() { return L.getSettings(); }
function design(d) {
	settings().customProps = settings().customProps || [];
	settings().customProps.push(d);
	return d;
}
function clearDesigns() { settings().customProps = []; }
// Every input in the property popup, read back the way a user sees it rather than trusting the
// call that built it.
function popupInputs() {
	const out = [];
	(function walk(el) {
		if (el.type === 'text') { out.push(el); }
		(el.children || []).forEach(walk);
	})(L.popupFields());
	return out;
}
function inputFor(labelText) {
	const fields = L.popupFields(), out = [];
	(function walk(el) {
		if (el._tag === 'label' && (el.textContent || '').indexOf(labelText) >= 0) {
			(el.children || []).forEach(function (c) { if (c.type === 'text') { out.push(c); } });
		}
		(el.children || []).forEach(walk);
	})(fields);
	return out[0] || null;
}

// ---- 1. THE NAMESPACE ------------------------------------------------------------------------
//
// Adversarial on purpose: design a custom property under the name of every built-in property this
// page stores, and assert that the stored key is never the built-in one. There is no allowlist to
// keep in step, which is the whole argument for a prefix over a reserved list.
const BUILTINS = ['demand', 'elev', 'head', 'level', 'active', 'fireFlow', 'initQuality',
	'tankCoeff', 'sourceType', 'sourceQuality', 'sourcePattern', 'diameter', 'roughness', 'k',
	'status', 'length', 'setting', 'bulkCoeff', 'wallCoeff', 'energyPrice', 'energyPattern',
	'curveId', 'efficCurveId', 'typeId', 'fittingsId', 'text', 'tag', 'id', 'x', 'y'];
let collided = [];
BUILTINS.forEach(function (b) {
	const k = L.customPropKey(b);
	if (k === b) { collided.push(b); }
});
ok('1.1 no built-in name survives customPropKey()', collided.length === 0, collided.join(','));
ok('1.2 the prefix is added once, not twice',
	L.customPropKey('custom_acct') === L.customPropKey('acct'),
	L.customPropKey('custom_acct'));
ok('1.3 a key with spaces loses them', L.customPropKey(' acct no ').indexOf(' ') < 0,
	L.customPropKey(' acct no '));
ok('1.4 an empty key stays empty', L.customPropKey('   ') === '');

// A designed key really does write a different storage slot from the built-in of the same name.
clearDesigns();
const acct = design({ key: L.customPropKey('demand'), label: 'Account', applies: 'J',
	validate: 'none', restrictMode: 'allow', restrict: '', maxLength: '', low: '', high: '' });
const n1 = L.addNode('junction', 0, 0);
L.setProp(n1, 'demand', 12);
L.setCustomProp(n1, acct, '4417');
ok('1.5 the built-in demand is untouched by the custom write', L.effective(n1, 'demand') === 12,
	String(L.effective(n1, 'demand')));
ok('1.6 the custom value reads back', L.effective(n1, acct.key) === '4417', String(L.effective(n1, acct.key)));
ok('1.7 the two live in different slots', n1._demand === 12 && n1['_' + acct.key] === '4417');

// ---- 2. APPLIES TO ----------------------------------------------------------------------------
clearDesigns();
const zone = design({ key: L.customPropKey('zone'), label: 'Zone', applies: 'J,L',
	validate: 'none', restrictMode: 'allow', restrict: '', maxLength: '', low: '', high: '' });
const jA = L.addNode('junction', 0, 0), jB = L.addNode('junction', 100, 0),
	res = L.addNode('reservoir', 0, 100),
	pipe = L.addLink('pipe', jA.id, jB.id);
ok('2.1 a junction carries it', L.customPropsFor(jA).length === 1);
ok('2.2 a pipe carries it', L.customPropsFor(pipe).length === 1);
ok('2.3 a reservoir does not', L.customPropsFor(res).length === 0);
zone.applies = '';
ok('2.4 an empty applies-to reaches nothing', L.customPropsFor(jA).length === 0);
zone.applies = 'J,L';

// ---- 3. VALIDATION IS A QUERY, NOT A GATE -----------------------------------------------------
//
// Every message is read off pageConfig. A design that a value breaks must FLAG it and leave the
// bytes alone; loosening the design must put the flag out with nothing else moving.
function problem(d, v) { return L.customPropProblem(d, v); }
const num = { key: L.customPropKey('psi'), label: 'psi', validate: 'number', applies: 'J',
	restrictMode: 'allow', restrict: '', maxLength: '', low: '', high: '' };
ok('3.1 a number design accepts a number', problem(num, '42.5') === null);
ok('3.2 and flags a word', problem(num, 'forty') === PC.lpn_cp_bad_number, String(problem(num, 'forty')));
num.validate = 'integer';
ok('3.3 an integer design flags a fraction', problem(num, '42.5') === PC.lpn_cp_bad_integer);
ok('3.4 a blank is never a failure', problem(num, '') === null);
num.validate = 'number'; num.low = '10'; num.high = '100';
ok('3.5 below the low limit is flagged', problem(num, '9') === PC.lpn_cp_bad_low);
ok('3.6 above the high limit is flagged', problem(num, '101') === PC.lpn_cp_bad_high);
ok('3.7 inside them is not', problem(num, '55') === null);
// The limits compare as NUMBERS, which is the leg a string comparison would pass by accident:
// '9' sorts after '100' in every dictionary order there is.
num.low = '8'; num.high = '100';
ok('3.8 the limits compare arithmetically, not alphabetically', problem(num, '9') === null);
const cased = { key: L.customPropKey('c'), label: 'c', applies: 'J', validate: 'upper',
	restrictMode: 'allow', restrict: '', maxLength: '', low: '', high: '' };
ok('3.9 ALL CAPS accepts caps', problem(cased, 'MAIN-12') === null);
ok('3.10 ALL CAPS flags lower case', problem(cased, 'Main-12') === PC.lpn_cp_bad_case);
cased.validate = 'snake';
ok('3.11 snake_case accepts', problem(cased, 'meter_route_4') === null);
ok('3.12 snake_case flags a hyphen', problem(cased, 'meter-route') === PC.lpn_cp_bad_case);
cased.validate = 'camel';
ok('3.13 camelCase accepts', problem(cased, 'meterRoute') === null);
ok('3.14 camelCase flags a leading capital', problem(cased, 'MeterRoute') === PC.lpn_cp_bad_case);
cased.validate = 'none';
ok('3.15 Do not validate accepts anything', problem(cased, 'MeterRoute') === null);
const chars = { key: L.customPropKey('r'), label: 'r', applies: 'J', validate: 'none',
	restrictMode: 'allow', restrict: '@#-', maxLength: '', low: '', high: '' };
ok('3.16 allow-only accepts letters, digits and the listed hyphen', problem(chars, 'AB-12') === null);
ok('3.17 allow-only flags an unlisted character', problem(chars, 'AB.12') === PC.lpn_cp_bad_chars);
chars.restrictMode = 'deny'; chars.restrict = '#';
ok('3.18 refuse-these flags a digit', problem(chars, 'AB1') === PC.lpn_cp_bad_chars);
ok('3.19 and accepts a value with none', problem(chars, 'AB') === null);
chars.restrictMode = 'allow'; chars.restrict = ''; chars.maxLength = 4;
ok('3.20 a length limit flags a long value', problem(chars, 'ABCDE') === PC.lpn_cp_bad_length);
ok('3.21 and accepts one at the limit', problem(chars, 'ABCD') === null);

// **THE BYTES SURVIVE THE FLAG.** The whole of Tom's exploration-tool ruling in one assertion.
clearDesigns();
const meter = design({ key: L.customPropKey('meter'), label: 'Meter', applies: 'J',
	validate: 'number', restrictMode: 'allow', restrict: '', maxLength: '', low: '', high: '' });
const nB = L.addNode('junction', 200, 0);
L.setCustomProp(nB, meter, '0042.50');
ok('3.22 the typed bytes are stored verbatim', L.effective(nB, meter.key) === '0042.50',
	String(L.effective(nB, meter.key)));
meter.low = '100';
ok('3.23 tightening the design flags the value', L.customPropProblem(meter, L.effective(nB, meter.key)) === PC.lpn_cp_bad_low);
ok('3.24 and does not touch it', L.effective(nB, meter.key) === '0042.50',
	String(L.effective(nB, meter.key)));
meter.low = '';
ok('3.25 loosening it again puts the flag out', L.customPropProblem(meter, L.effective(nB, meter.key)) === null);
ok('3.26 with the bytes still exactly as typed', L.effective(nB, meter.key) === '0042.50');

// ---- 4. THE SCENARIO WRITE SEAM ---------------------------------------------------------------
//
// dev/scenario-seam-repair.md's failure, on a property the seam check cannot see. Every door is
// driven, because the 2026-08-14 defect was five doors that each looked right on its own screen.
clearDesigns();
const route = design({ key: L.customPropKey('route'), label: 'Route', applies: 'J,L',
	validate: 'none', restrictMode: 'allow', restrict: '', maxLength: '', low: '', high: '' });
const jC = L.addNode('junction', 300, 0), jD = L.addNode('junction', 400, 0),
	pC = L.addLink('pipe', jC.id, jD.id);
L.setCustomProp(jC, route, 'BASE-ROUTE');
ok('4.1 a custom property is overridable', L.isOverridable(jC, route.key) === true);
ok('4.2 and only where it applies', L.isOverridable(res, route.key) === false);

const scn = L.createScenario('Max day');
L.switchScenario(scn.id);
// (a) the popup's own row
L.renderNodeFields(jC.id);
const cpBox = inputFor(route.label);
ok('4.3 the popup draws a row for it', !!cpBox);
cpBox.value = 'NIGHT-ROUTE';
(cpBox._listeners.change || []).forEach(function (f) { f({ target: cpBox }); });
ok('4.4 the scenario sees the override', L.effective(jC, route.key) === 'NIGHT-ROUTE',
	String(L.effective(jC, route.key)));
ok('4.5 BASE DOES NOT MOVE', L.baseValue(jC, route.key) === 'BASE-ROUTE',
	String(L.baseValue(jC, route.key)));
ok('4.6 the override is recorded as intent', L.hasOverride(jC, route.key) === true);
ok('4.7 the element itself still holds Base', jC['_' + route.key] === 'BASE-ROUTE');

// (b) the Tables pane / multi-properties seam -- one setter, so one assertion covers both
const junctionSpec = L.paneTables().filter(function (s) { return s.id === 'junctions'; })[0];
const cpCol = L.paneCols(junctionSpec).filter(function (c) { return c.key === route.key; })[0];
ok('4.8 the Tables pane has a column for it', !!cpCol);
L.paneWriteCellText(junctionSpec, cpCol, jC, 'TABLE-ROUTE');
ok('4.9 a table edit inside a scenario is an override', L.effective(jC, route.key) === 'TABLE-ROUTE');
ok('4.10 and STILL does not move Base', L.baseValue(jC, route.key) === 'BASE-ROUTE',
	String(L.baseValue(jC, route.key)));

// (c) Find and replace -- pushSpecList()'s spec carries `prop`, which is what routes replaceWrite()
// through setProp().
const spec = L.pushSpecList().filter(function (s) { return s.field === route.key; })[0];
ok('4.11 Find and replace offers it', !!spec);
ok('4.12 its spec carries prop, so replaceWrite() goes through setProp()', spec && spec.prop === route.key);
ok('4.13 and it applies to the kinds the design names',
	spec && spec.applies(jC) === true && spec.applies(res) === false);
ok('4.14 neither push touches it, because it has no map label', L.pushFieldShown(spec) === false);
spec.set(pC, 'BULK-ROUTE');
ok('4.15 the spec setter inside a scenario is an override', L.effective(pC, route.key) === 'BULK-ROUTE');
ok('4.16 and Base is still blank', L.baseValue(pC, route.key) === undefined,
	String(L.baseValue(pC, route.key)));

// ---- 5. FIND READS IT -------------------------------------------------------------------------
L.findState().scope = 'junction';
const props = L.findPropDefs().map(function (p) { return p[0]; });
ok('5.1 Find offers the custom property', props.indexOf(route.key) >= 0, props.join(','));
ok('5.2 Find reads the scenario value', L.findValueOf({ group: 'node', el: jC }, route.key) === 'TABLE-ROUTE');
ok('5.3 a text design gets the text conditions', L.findPropIsText(route.key) === true);
ok('5.4 a number design gets the range conditions', L.findPropIsText(meter.key) === false);
L.findState().scope = 'reservoir';
const rprops = L.findPropDefs().map(function (p) { return p[0]; });
ok('5.5 and it is not offered where nothing carries it', rprops.indexOf(route.key) < 0);
L.findState().scope = 'junction';

// ---- 6. THE DESIGN AND THE OVERRIDE BOTH RIDE IN THE PROJECT ----------------------------------
//
// A definition is MODELLING data by CLAUDE.md's project-versus-browser rule: a document whose
// assets carry a value under a key means nothing without the design of that key. It must NOT be a
// localStorage sibling, which is what lpn_furniture_check.php holds from the other side.
L.switchScenario('base');
const saved = JSON.parse(JSON.stringify(L.serializeProject()));
ok('6.1 the design rides in serializeProject()',
	!!(saved.settings && saved.settings.customProps && saved.settings.customProps.length));
ok('6.2 with its key, label and applies-to',
	saved.settings.customProps.some(function (d) {
		return d.key === route.key && d.label === route.label && d.applies === 'J,L';
	}));
const savedOv = JSON.stringify(saved.scenarios);
ok('6.3 the scenario override rides with it', savedOv.indexOf('TABLE-ROUTE') >= 0);
L.applySaved(saved);
const back = L.getDoc().nodes.filter(function (n) { return n.id === jC.id; })[0];
ok('6.4 the design comes back', !!L.customPropDefByKey(route.key));
ok('6.5 and the Base value comes back verbatim', L.effective(back, route.key) === 'BASE-ROUTE',
	String(L.effective(back, route.key)));

// ---- 7. ONE LINE PER PROPERTY, WITH AN EXPANDER -----------------------------------------------
//
// **KEY ON LINE ONE, THE REST UNDER AN EXPANDER** (Tom, 2026-09-13, his own third option: *"each
// custom property lists only key on line 1 with an expander to show all other design fields below
// it on one line each"*). It replaced BOTH earlier shapes and this section is what keeps either
// from coming back:
//
//   * PHASE 1 put ten live controls on one pane line, which he read back as a form pretending to
//     be a table;
//   * PHASE 2 put a twelve-column summary table in the pane and the form in a popup, and the
//     table did not fit anywhere. Measured in Chromium: its heading row alone needs 721 px
//     against a Settings content pane of 410 px at the shipped box width on a 1200 px screen and
//     202 px at 360 px, so the pane scrolled sideways by 319 px and 527 px -- which
//     dev/browser-pass/specs/labelcols.js has forbidden since Task 435 -- and reaching the high
//     limit scrolled the KEY out of view. The popup was no better: #lpn_dialog is 50vw capped at
//     360 px, so on a 360 px phone the design form was 180 px wide with a 4 px label column and
//     2,661 px of content in a 444 px scroller.
//
// So the assertions that matter here are 7.5 (there is no table left), 7.6 (the key is on line
// one, in full) and 7.11 (every design field is a `.lpn-set-row`, which is what buys the phone
// layout that was already written once for every other row in this box).
clearDesigns();
L.rebuildSettingsFields();
const body = L.customBody();
function buttons(host, text) {
	const out = [];
	(function walk(el) {
		if (el._tag === 'button' && (el.textContent || '') === text) { out.push(el); }
		(el.children || []).forEach(walk);
	})(host);
	return out;
}
function fire(el, kind) { (el._listeners[kind] || []).forEach(function (f) { f({ target: el }); }); }
function controlsIn(host) {
	const out = [];
	(function walk(el) {
		if (el._tag === 'input' || el._tag === 'select' || el._tag === 'textarea') { out.push(el); }
		(el.children || []).forEach(walk);
	})(host);
	return out;
}
function byAria(host, label) {
	return controlsIn(host).filter(function (c) { return c.getAttribute('aria-label') === label; })[0] || null;
}
function byTag(host, tag) {
	const out = [];
	(function walk(el) {
		if (el._tag === tag) { out.push(el); }
		(el.children || []).forEach(walk);
	})(host);
	return out;
}
function byClass(host, cls) {
	const out = [];
	(function walk(el) {
		if ((el['class'] || '').split(/\s+/).indexOf(cls) >= 0) { out.push(el); }
		(el.children || []).forEach(walk);
	})(host);
	return out;
}
function headTips(host) {
	const out = [];
	(function walk(el) {
		if ((el['class'] || '').indexOf('ec-help') >= 0 && el.title) { out.push(el.title); }
		(el.children || []).forEach(walk);
	})(host);
	return out;
}
const addBtn = buttons(body, PC.lpn_cp_add)[0];
ok('7.1 the box offers an Add control', !!addBtn);
fire(addBtn, 'click');
ok('7.2 adding appends one design row', settings().customProps.length === 1);
// **AND OPENS IT**, because a collapsed blank line says nothing about what the user has just been
// given -- the same argument that used to open the popup on a new row.
ok('7.3 adding opens the new design', byTag(L.customBody(), 'details')[0].open === true);
let keyBox = byAria(L.customBody(), PC.lpn_cp_key);
ok('7.4 the key is edited in the pane, with no popup in the way', !!keyBox);
keyBox.value = 'acct no';
fire(keyBox, 'change');
ok('7.5 a typed key is namespaced and unspaced',
	settings().customProps[0].key === L.customPropKey('acctno'), settings().customProps[0].key);
// **THERE IS NO TABLE.** The twelve-column summary is what did not fit; a `<table>` reappearing in
// this host is the regression, whatever it holds.
ok('7.6 nothing in the design box is a table', byTag(L.customBody(), 'table').length === 0);
// **LINE ONE IS THE KEY, IN FULL AND UNABBREVIATED** -- his own exception, and the identity the
// property is filed under. Read here with NO rebuild in between, which is the second half of the
// assertion: commit() writes this text in place precisely so that it does not have to rebuild the
// Settings box, because `change` fires on BLUR and a rebuild would destroy the nine fields after
// the one the user has just tabbed out of.
const summary1 = byTag(L.customBody(), 'summary')[0];
ok('7.7 line one shows the bare key, written in place with no rebuild',
	byClass(summary1, 'lpn-cp-key')[0]._text === L.customPropBareKey(settings().customProps[0].key),
	byClass(summary1, 'lpn-cp-key')[0]._text);
// A second row may not take the first one's key.
fire(buttons(L.customBody(), PC.lpn_cp_add)[0], 'click');
ok('7.8 a second row is added', settings().customProps.length === 2);
const secondKeyBox = controlsIn(byTag(L.customBody(), 'details')[1])
	.filter(function (c) { return c.getAttribute('aria-label') === PC.lpn_cp_key; })[0];
secondKeyBox.value = 'acctno';
lastAlert = null;
fire(secondKeyBox, 'change');
ok('7.9 a duplicate key is refused, in the page’s own words', lastAlert === PC.lpn_cp_key_taken,
	String(lastAlert));
ok('7.10 and the second design keeps no key', settings().customProps[1].key === '');
// A row with no key yet says so rather than showing a line nobody can tell from a rendering fault.
ok('7.11 an unnamed design says so on line one',
	byClass(byTag(L.customBody(), 'summary')[1], 'lpn-cp-key')[0]._text === PC.lpn_cp_unnamed);
// **EVERY DESIGN FIELD IS A .lpn-set-row**, which is the whole reason this shape survives a phone:
// the container query that collapses every other row in this box to one column at 24rem collapses
// these too, so no second layout was written.
const firstBody = byClass(byTag(L.customBody(), 'details')[0], 'lpn-cp-body')[0];
const designRows = byClass(firstBody, 'lpn-set-row');
ok('7.12 the design fields are the box’s own row primitive', designRows.length === 10,
	String(designRows.length));
// Each part of the design has its own line, named the way the page names it.
// **THE CHARACTER BOX IS CAPTIONED BY THE MODE, NOT BY A FIXED STRING** (fixed 2026-09-14): a
// design in the default `allow` mode titles it with the Allow option's own words. That is the
// defect Tom reported as *"Restrict these characters never switches to Allow"* -- the select
// always stored the right value and the caption beside it never moved.
[PC.lpn_cp_key, PC.lpn_cp_label, PC.lpn_cp_applies, PC.lpn_cp_validate, PC.lpn_cp_restrict_mode,
	PC.lpn_cp_restrict_allow, PC.lpn_cp_minlength, PC.lpn_cp_length, PC.lpn_cp_low, PC.lpn_cp_high
].forEach(function (lbl, i) {
	ok('7.13.' + (i + 1) + ' one more design field has its own control',
		!!byAria(firstBody, lbl), lbl);
});
// **AND IT FOLLOWS THE MODE WHEN THE MODE MOVES.** The defect Tom reported on 2026-09-14 was
// exactly this: the select stored `deny` correctly, and the box beside it went on saying the same
// words, so the control looked dead. Both captions are asserted, because a screen reader hears
// only the second and updating one of them would leave the defect in place for the reader least
// able to work around it.
{
	const modeSel = byAria(firstBody, PC.lpn_cp_restrict_mode);
	ok('7.13.11 the mode select is there to drive', !!modeSel);
	modeSel.value = 'deny';
	fire(modeSel, 'change');
	ok('7.13.12 choosing Restrict re-captions the character box',
		!!byAria(firstBody, PC.lpn_cp_restrict_deny), PC.lpn_cp_restrict_deny);
	ok('7.13.13 ...and the old caption is gone, so the control is not saying both',
		!byAria(firstBody, PC.lpn_cp_restrict_allow));
	ok('7.13.14 ...and the design stored the mode it was given',
		settings().customProps[0].restrictMode === 'deny',
		settings().customProps[0].restrictMode);
	modeSel.value = 'allow';
	fire(modeSel, 'change');
	ok('7.13.15 switching back to Allow re-captions again, which is the reported defect',
		!!byAria(firstBody, PC.lpn_cp_restrict_allow));
	ok('7.13.16 ...and stores allow', settings().customProps[0].restrictMode === 'allow');
}
// Remove is on line one, because it is not a design field and should not cost opening the row.
const rm = buttons(L.customBody(), PC.lpn_cp_remove);
ok('7.14 every row offers Remove', rm.length === settings().customProps.length);
ok('7.15 and Remove is on line one, not under the expander',
	byTag(byTag(L.customBody(), 'summary')[0], 'button').length === 1);
fire(rm[1], 'click');
ok('7.16 removing takes one row away', settings().customProps.length === 1);
ok('7.17 and leaves the other one alone', settings().customProps[0].key === L.customPropKey('acctno'));
// **THE EXPANDED STATE IS FURNITURE AND REACHES NO FILE** (CLAUDE.md's project-versus-browser
// rule). rebuildSettingsFields() runs on every commit, so the row the reader is typing in has to
// be reopened -- and that memory must not ride out in the project.
L.rebuildSettingsFields();
ok('7.18 the row being edited is still open after a rebuild',
	byTag(L.customBody(), 'details')[0].open === true);
const savedNow = L.serializeProject();
const savedProps = JSON.stringify((savedNow.settings || {}).customProps || []);
ok('7.19 and no expander state rides in the saved project',
	JSON.stringify(savedNow).indexOf('cpOpen') < 0 && savedProps.indexOf('open') < 0, savedProps);

// ---- 8. THE FIELD LABELS AND THEIR TIPS -------------------------------------------------------
//
// **EVERY DESIGN TIP LEADS WITH THE NAME OF ITS OWN FIELD** (Tom, 2026-09-13, revision 4). It was
// written when the name above the value was an abbreviated column heading; it is kept now that the
// name is written out, because a tip that repeats its own label is how a reader confirms which
// control the tooltip belongs to. Asserted as a RELATIONSHIP between two pageConfig values rather
// than as English, so rewording either one keeps the test.
[['key', PC.lpn_cp_key, PC.lpn_cp_key_tip], ['label', PC.lpn_cp_label, PC.lpn_cp_label_tip],
	['applies', PC.lpn_cp_applies, PC.lpn_cp_applies_tip],
	['validate', PC.lpn_cp_validate, PC.lpn_cp_validate_tip],
	['mode', PC.lpn_cp_restrict_mode, PC.lpn_cp_restrict_mode_tip],
	['restrict', PC.lpn_cp_restrict, PC.lpn_cp_restrict_tip],
	['minLength', PC.lpn_cp_minlength, PC.lpn_cp_minlength_tip],
	['maxLength', PC.lpn_cp_length, PC.lpn_cp_length_tip],
	['low', PC.lpn_cp_low, PC.lpn_cp_low_tip], ['high', PC.lpn_cp_high, PC.lpn_cp_high_tip]
].forEach(function (c, i) {
	ok('8.1.' + (i + 1) + ' the ' + c[0] + ' tip leads with its own field name',
		typeof c[2] === 'string' && c[2].indexOf(c[1] + ':') === 0, String(c[2]).slice(0, 24));
});
const tips = headTips(L.customBody());
ok('8.2 the design heading carries its own tip', tips.indexOf(PC.lpn_cp_design_tip) >= 0);
[PC.lpn_cp_key_tip, PC.lpn_cp_label_tip, PC.lpn_cp_applies_tip, PC.lpn_cp_validate_tip,
	PC.lpn_cp_restrict_mode_tip, PC.lpn_cp_restrict_tip, PC.lpn_cp_minlength_tip,
	PC.lpn_cp_length_tip, PC.lpn_cp_low_tip, PC.lpn_cp_high_tip].forEach(function (t, i) {
	ok('8.3.' + (i + 1) + ' one more design field carries its tip', tips.indexOf(t) >= 0);
});
// **THE SECTION HEADING'S OWN TIP IS TOM'S SENTENCE** (revision 1). It is server-rendered, so this
// is asserted on the SOURCE and on the two KEYS, never on the English.
const pageSrc = require('fs').readFileSync(ROOT + 'Looped-Network.php', 'utf8');
ok('8.4 the Custom properties heading carries the note as its tip',
	pageSrc.indexOf("ecTipLabel($ec_lang['lpn_settings_custom_props'], $ec_lang['lpn_settings_custom_props_note'])") >= 0);

// ---- 9. THE VALIDATION TYPES TOM ASKED FOR ----------------------------------------------------
//
// Revision 7 removed Text, revision 6 added one permissive Date and time, revision 11 split Number
// by its decimal mark, and revision 9 added a Fewest characters. Revision 10 is the white space
// rule, which lives inside the character restriction because that is where its tip states it.
const vOpts = L.customPropValidateOptions().map(function (o) { return o[0]; });
ok('9.1 there is no Text type any more', vOpts.indexOf('text') < 0, vOpts.join(','));
ok('9.2 Do not validate is still there', vOpts.indexOf('none') >= 0);
ok('9.3 both numeric types are offered',
	vOpts.indexOf('number') >= 0 && vOpts.indexOf('number_comma') >= 0);
ok('9.4 Date and time is NOT offered, having been removed 2026-09-14', vOpts.indexOf('datetime') < 0);
// A document that still states the removed type validates as nothing, which is what it always did.
const legacy = { key: L.customPropKey('t'), label: 't', applies: 'J', validate: 'text',
	restrictMode: 'allow', restrict: '', minLength: '', maxLength: '', low: '', high: '' };
ok('9.5 a design that still states Text accepts anything', problem(legacy, 'anything at all') === null);

const dot = { key: L.customPropKey('n'), label: 'n', applies: 'J', validate: 'number',
	restrictMode: 'allow', restrict: '', minLength: '', maxLength: '', low: '', high: '' };
ok('9.6 Number . accepts a dot decimal', problem(dot, '3.5') === null);
ok('9.7 Number . flags a comma decimal', problem(dot, '3,5') === PC.lpn_cp_bad_number);
dot.validate = 'number_comma';
ok('9.8 Number , accepts a comma decimal', problem(dot, '3,5') === null);
ok('9.9 Number , flags a dot decimal', problem(dot, '3.5') === PC.lpn_cp_bad_number);
ok('9.10 either accepts a plain integer', problem(dot, '42') === null);
// And the limits are read with the SAME mark, or a comma design would compare nonsense.
dot.low = '10,5';
ok('9.11 a comma design compares its limits with a comma', problem(dot, '9,5') === PC.lpn_cp_bad_low);
ok('9.12 and passes a value above it', problem(dot, '11,5') === null);
dot.low = '';

// **THERE IS NO DATE AND TIME TYPE, AND THESE ASSERT THAT IT STAYS GONE.** Removed 2026-09-14 on
// Tom's instruction after he found that a 13th month passed it. The type was never asked for and
// what it checked was punctuation, not calendars; the record is in js/looped-network.js beside
// customPropCharInSet(). A DELETION NEEDS A TEST AS MUCH AS A FEATURE DOES: the way this comes
// back is somebody re-adding a plausible-looking option to customPropValidateOptions().
ok('9.13 no Date and time option is offered',
	!L.customPropValidateOptions().some(o => o[0] === 'datetime'),
	JSON.stringify(L.customPropValidateOptions().map(o => o[0])));
{
	// A document saved while the type existed still states it. That value must degrade to no
	// validation rather than to a thrown error or to a rule nobody can see -- the file is the
	// user's and we do not rewrite it.
	const when = { key: L.customPropKey('w'), label: 'w', applies: 'J', validate: 'datetime',
		restrictMode: 'allow', restrict: '', minLength: '', maxLength: '', low: '', high: '' };
	ok('9.14 a stored datetime design validates nothing rather than throwing',
		problem(when, 'sometime soon') === null);
	ok('9.15 ...including the 13th month that ended the feature', problem(when, '2026-13-45') === null);
	ok('9.16 a blank is still not a failure', problem(when, '') === null);
	// The limits Tom actually named for dates still work on that same design, which is the point:
	// removing the type removed nothing a date needed.
	when.minLength = '8';
	ok('9.17 ...and a length limit still flags a partial date',
		problem(when, '2026') === PC.lpn_cp_bad_minlength, problem(when, '2026'));
}

// **THE FEWEST, AND IT FLAGS WITHOUT PADDING** -- the whole of Tom's exploration-tool ruling
// applied to the new limit.
clearDesigns();
const part = design({ key: L.customPropKey('part'), label: 'Part', applies: 'J', validate: 'none',
	restrictMode: 'allow', restrict: '', minLength: '', maxLength: '', low: '', high: '' });
const nP = L.addNode('junction', 500, 0);
L.setCustomProp(nP, part, 'AB');
part.minLength = 4;
ok('9.17 a short value is flagged', L.customPropProblem(part, L.effective(nP, part.key)) === PC.lpn_cp_bad_minlength);
ok('9.18 and is NOT padded or cleared', L.effective(nP, part.key) === 'AB', String(L.effective(nP, part.key)));
part.minLength = 2;
ok('9.19 loosening it puts the flag out', L.customPropProblem(part, L.effective(nP, part.key)) === null);
part.minLength = 4;
ok('9.20 a blank is still not a failure under a minimum', L.customPropProblem(part, '') === null);
part.minLength = ''; part.maxLength = 3;
ok('9.21 the maximum still flags a long value', L.customPropProblem(part, 'ABCD') === PC.lpn_cp_bad_length);
part.maxLength = '';

// **WHITE SPACE ONLY BETWEEN OTHER CHARACTERS** (revision 10), inside the character restriction.
const sp = { key: L.customPropKey('s'), label: 's', applies: 'J', validate: 'none',
	restrictMode: 'allow', restrict: '@# ', minLength: '', maxLength: '', low: '', high: '' };
ok('9.22 a space between characters is fine', problem(sp, 'MAIN ST') === null);
ok('9.23 a leading space is flagged', problem(sp, ' MAIN') === PC.lpn_cp_bad_space);
ok('9.24 a trailing space is flagged', problem(sp, 'MAIN ') === PC.lpn_cp_bad_space);
// And the restriction itself is still the rudimentary validator Tom keeps for saying "no slashes".
sp.restrict = '@#';
ok('9.25 an unlisted slash is still refused by the character set',
	problem(sp, 'MAIN/ST') === PC.lpn_cp_bad_chars);
// A property nobody restricted is one whose owner asked us to have no opinion about its text.
sp.restrict = '';
ok('9.26 with no restriction declared, white space is nobody’s business', problem(sp, ' MAIN ') === null);

// ---- 10. THE GLYPH DOES NOT GO TO THE INDEX PANE ----------------------------------------------
//
// Tom, 2026-09-13: *"It looks like you used the sub-heading label for the index also as is
// typical. But the glyph needs to be separate so it doesn't go to the index pane."*
//
// `ecTipLabel()` with no link wraps the label text AND the "?" in ONE `.ec-help`, which is
// CLAUDE.md's rule and is right on the heading: with no link the tap target would otherwise be a
// single character. buildSettingsIndex() then read that heading's `textContent` to name its own
// row, so the left pane grew a stray "?" beside one section name -- a defect of the READER, not
// of the markup, which is why the fix is setboxHeadingText() and not hand-built `.ec-help`
// (`dev/scripts/tip_markup_check.php` blocks the build on that, and the helpers hold the
// strip_tags()/htmlspecialchars() a title="" needs).
//
// The fixture is the exact three-part shape lib/Calculators.lib.php emits -- text, a space, a
// `.ec-tip` span -- and 8.4 above is what holds the real heading to that helper, so the two
// assertions together cover the markup end and the reading end. Asserted against
// EngCalcs.pageConfig, never English.
function tipHeading(text, tip) {
	var host = document.createElement('div'), help = document.createElement('span'),
		glyph = document.createElement('span');
	help.className = 'ec-help';
	help.title = tip;
	help.appendChild(document.createTextNode(text + ' '));
	glyph.className = 'ec-tip';
	glyph.textContent = '?';
	help.appendChild(glyph);
	host.appendChild(help);
	return host;
}
const cpHead = tipHeading(PC.lpn_settings_custom_props, PC.lpn_settings_custom_props_note);
ok('10.1 the heading itself still carries the glyph, so the tap target is the whole label',
	cpHead.textContent.indexOf('?') >= 0);
ok('10.2 the index reads the label alone',
	L.setboxHeadingText(cpHead) === PC.lpn_settings_custom_props,
	JSON.stringify(L.setboxHeadingText(cpHead)));
// A heading with no tip is every other one in the box, and it must come back byte-identical --
// the trim exists only to eat the space ecTipLabel() puts in front of the glyph.
const plainHead = document.createElement('div');
plainHead.textContent = PC.lpn_settings_defaults;
ok('10.3 a heading with no tip is untouched',
	L.setboxHeadingText(plainHead) === PC.lpn_settings_defaults);
// Written against every heading rather than the one that has a tip today: the next author to add
// one would otherwise repeat the defect in silence.
const secHead = tipHeading(PC.lpn_settings_sec_assets, PC.lpn_cp_design_tip);
ok('10.4 a SECTION heading that grows a tip is read the same way',
	L.setboxHeadingText(secHead) === PC.lpn_settings_sec_assets);

console.log(fails ? ('\nFAILED: ' + fails) : '\nAll custom-property checks passed.');
process.exit(fails ? 1 : 0);
