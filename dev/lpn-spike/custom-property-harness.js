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
	"\t\tdialogBody: function () { return document.getElementById('lpn_dialog_body'); },\n" +
	"\t\topenCustomPropDesign: openCustomPropDesign, closeDialog: closeDialog,\n" +
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

// ---- 7. THE SUMMARY IN SETTINGS, AND THE FORM IN A POPUP --------------------------------------
//
// **THE PANE SHOWS THE DESIGN; THE POPUP EDITS IT** (Tom, 2026-09-13: *"the Custom Property design
// form must be a popup and ... the Settings pane can show only truncated forms of the design except
// for the key. I now confirm that specification."*). Phase 1 built ten live controls per row in the
// pane, which is the shape this section exists to keep from coming back: the assertion that matters
// is 7.10, that the summary holds NO editable control at all.
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
// Every control in a host, whatever it is: the question the summary must answer NO to.
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
// The truncating spans the summary writes, in column order.
function summaryCells(host) {
	const out = [];
	(function walk(el) {
		if ((el['class'] || '').indexOf('lpn-cp-cell') >= 0) { out.push(el); }
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
// **AND OPENS THE FORM ON IT**, because a blank row in a summary table says nothing about what the
// user has just been given.
let dlg = L.dialogBody();
ok('7.3 adding opens the design popup', !!byAria(dlg, PC.lpn_cp_key));
// The key is typed in the POPUP now, not in the pane.
let keyBox = byAria(dlg, PC.lpn_cp_key);
keyBox.value = 'acct no';
fire(keyBox, 'change');
ok('7.4 a key typed in the popup is namespaced and unspaced',
	settings().customProps[0].key === L.customPropKey('acctno'), settings().customProps[0].key);
// **THE KEY IS THE ONE COLUMN SHOWN IN FULL** -- his own exception, and the column the row is
// filed under.
ok('7.5 the summary shows the bare key in the first cell',
	summaryCells(L.customBody())[0]._text === L.customPropBareKey(settings().customProps[0].key),
	summaryCells(L.customBody())[0]._text);
ok('7.6 and the key cell is the one with no truncation on it',
	(summaryCells(L.customBody())[0]['class'] || '').indexOf('lpn-cp-cell-key') >= 0);
// A second row may not take the first one's key.
L.closeDialog();
fire(buttons(L.customBody(), PC.lpn_cp_add)[0], 'click');
ok('7.7 a second row opens its own form', settings().customProps.length === 2);
const secondKeyBox = byAria(L.dialogBody(), PC.lpn_cp_key);
secondKeyBox.value = 'acctno';
lastAlert = null;
fire(secondKeyBox, 'change');
ok('7.8 a duplicate key is refused, in the page’s own words', lastAlert === PC.lpn_cp_key_taken,
	String(lastAlert));
ok('7.9 and the second design keeps no key', settings().customProps[1].key === '');
L.closeDialog();
// **THE PANE EDITS NOTHING.** Ten live controls per row is what revision 5 removed.
ok('7.10 the summary holds no editable control', controlsIn(L.customBody()).length === 0,
	String(controlsIn(L.customBody()).length));
// Every row offers both doors.
const editBtns = buttons(L.customBody(), PC.lpn_profile_edit);
ok('7.11 every row offers Edit', editBtns.length === settings().customProps.length);
const rm = buttons(L.customBody(), PC.lpn_cp_remove);
ok('7.12 every row offers Remove', rm.length === settings().customProps.length);
// Edit opens the form on the row it belongs to, not on the first one.
fire(editBtns[0], 'click');
ok('7.13 Edit opens the form on its own row',
	byAria(L.dialogBody(), PC.lpn_cp_key).value === L.customPropBareKey(settings().customProps[0].key));
// The form carries every part of the design at full length, one row each.
[PC.lpn_cp_key, PC.lpn_cp_label, PC.lpn_cp_applies, PC.lpn_cp_validate, PC.lpn_cp_restrict_mode,
	PC.lpn_cp_restrict, PC.lpn_cp_minlength, PC.lpn_cp_length, PC.lpn_cp_low, PC.lpn_cp_high
].forEach(function (lbl, i) {
	ok('7.14.' + (i + 1) + ' the form has a control for one more column', !!byAria(L.dialogBody(), lbl), lbl);
});
L.closeDialog();
fire(rm[1], 'click');
ok('7.15 removing takes one row away', settings().customProps.length === 1);
ok('7.16 and leaves the other one alone', settings().customProps[0].key === L.customPropKey('acctno'));

// ---- 8. THE HEADINGS AND THEIR TIPS -----------------------------------------------------------
//
// **HEADINGS ARE BACK, TRUNCATED, EACH CARRYING ITS OWN TIP** (revision 3), and **EVERY COLUMN TIP
// LEADS WITH THE NAME OF ITS COLUMN** (revision 4). The second is asserted as a RELATIONSHIP
// between two pageConfig values rather than as English, so rewording either one keeps the test.
[['key', PC.lpn_cp_key, PC.lpn_cp_key_tip], ['label', PC.lpn_cp_label, PC.lpn_cp_label_tip],
	['applies', PC.lpn_cp_applies, PC.lpn_cp_applies_tip],
	['validate', PC.lpn_cp_validate, PC.lpn_cp_validate_tip],
	['mode', PC.lpn_cp_restrict_mode, PC.lpn_cp_restrict_mode_tip],
	['restrict', PC.lpn_cp_restrict, PC.lpn_cp_restrict_tip],
	['minLength', PC.lpn_cp_minlength, PC.lpn_cp_minlength_tip],
	['maxLength', PC.lpn_cp_length, PC.lpn_cp_length_tip],
	['low', PC.lpn_cp_low, PC.lpn_cp_low_tip], ['high', PC.lpn_cp_high, PC.lpn_cp_high_tip]
].forEach(function (c, i) {
	ok('8.1.' + (i + 1) + ' the ' + c[0] + ' tip leads with its own column name',
		typeof c[2] === 'string' && c[2].indexOf(c[1] + ':') === 0, String(c[2]).slice(0, 24));
});
const tips = headTips(L.customBody());
ok('8.2 the design heading carries its own tip', tips.indexOf(PC.lpn_cp_design_tip) >= 0);
[PC.lpn_cp_key_tip, PC.lpn_cp_label_tip, PC.lpn_cp_applies_tip, PC.lpn_cp_validate_tip,
	PC.lpn_cp_restrict_mode_tip, PC.lpn_cp_restrict_tip, PC.lpn_cp_minlength_tip,
	PC.lpn_cp_length_tip, PC.lpn_cp_low_tip, PC.lpn_cp_high_tip].forEach(function (t, i) {
	ok('8.3.' + (i + 1) + ' one more column heading carries its tip', tips.indexOf(t) >= 0);
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
ok('9.4 Date and time is offered', vOpts.indexOf('datetime') >= 0);
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

const when = { key: L.customPropKey('w'), label: 'w', applies: 'J', validate: 'datetime',
	restrictMode: 'allow', restrict: '', minLength: '', maxLength: '', low: '', high: '' };
['2026-09-13', '9/13/2026', '13.09.2026', '14:30', '2:05 pm', '13 September 2026',
	'Sep 13, 2026 14:30', '2026-09-13T14:30:00Z', '20260913'].forEach(function (v, i) {
	ok('9.13.' + (i + 1) + ' Date and time accepts one more plausible expression', problem(when, v) === null, v);
});
ok('9.14 it flags a value with no digit in it', problem(when, 'sometime soon') === PC.lpn_cp_bad_datetime);
ok('9.15 it flags a value no date could carry', problem(when, '13/09/2026 *** ') === PC.lpn_cp_bad_datetime);
ok('9.16 a blank is still not a failure', problem(when, '') === null);

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

console.log(fails ? ('\nFAILED: ' + fails) : '\nAll custom-property checks passed.');
process.exit(fails ? 1 : 0);
