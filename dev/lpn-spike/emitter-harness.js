// A JUNCTION'S OWN EMITTER COEFFICIENT, END TO END -- ROADMAP Task 191. Run with:
//   node dev/lpn-spike/emitter-harness.js
//
// Tom, 2026-09-08: *"lpn_settings_emitter_exponent is rendered: Yes. But emitter coeff. is not. It
// should be under Node properties."*
//
// EPANET states the coefficient once per junction in `[EMITTERS]` and the exponent once for the
// whole model in `[OPTIONS]`, so only the second ever had a control. js/lpn-inp.js has read,
// carried, solved and written the coefficient back since long before there was anywhere to see it
// -- which is exactly what its own `emitters-not-editable` note said out loud, in the report.
//
// **THIS DRIVES THE PAGE'S OWN CHAIN AND BUILDS NO MODEL** (session handoff §3). Task 582 shipped
// five green sections because every one handed the engine a model the harness had assembled itself,
// so the page's only document-to-model bridge could put nothing on it and nothing noticed. Here the
// chain is: importInpFromFile -> the document -> renderNodeFields (the shipped popup) -> the
// shipped `change` listener -> assembleModel -> the exporter. Nothing is written by hand.
//
// **THE ONE THING THAT CAN BE WRONG AND LOOK RIGHT IS THE EXPONENT ON THE WRONG FACTOR.** The
// coefficient is flow per pressure^gamma, so BOTH scales move and one of them is raised to a
// power. Get it backwards and a US file's 1.5 comes back as a number that is still plausible on
// screen, still solves, and is a different sprinkler. Sections 2 and 3 grade it against the
// importer's own conversion read the other way, and against a byte-identical round trip.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, GPM, FT } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () {};
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tnodeById: nodeById, effective: effective,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tassembleModel: assembleModel,\n" +
	// The exporter through the page's own door, with the same effective() the shipped exportInpFile()
	// hands it -- so an export from inside a scenario writes that scenario's numbers.
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	// The shipped popup, and the shipped fields inside it. Nothing here writes _emitter.
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tunitFactor: unitFactor"
);
L.buildLayers();

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

const INP = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'import-cases.inp'), 'utf8');
setUnitSet('us');
L.importInp({ name: 'import-cases.inp', _text: INP });

// The file states GPM and psi, so its 1.5 is 1.5 gpm per psi^0.5.
// 1 psi of water column in metres, READ OUT OF js/lpn-inp.js rather than retyped: a second copy of
// a conversion constant is a second chance for the two to disagree, which is the whole failure this
// harness is about.
// (2026-09-09: it is an EXPRESSION there now, not a decimal -- dev/scripts/js_constant_check.php
// found it typed as a rounded 0.703070 -- so the expression is evaluated rather than parsed. The
// point is unchanged: the number comes from the module, never from a second copy typed here.)
const PSI_M = (function () {
	const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-inp.js'), 'utf8');
	const IN = parseFloat(/\bIN = ([0-9.eE+-]+)/.exec(src)[1]);
	const expr = /var PSI_M = ([^;]+);/.exec(src)[1];
	return Function('IN', 'return (' + expr + ');')(IN);
}());
const doc = L.getDoc();
const j6 = L.nodeById('J6');

console.log('--- 1. the file\'s coefficient arrived and is on the junction ---');
ok('J6 exists', !!j6);
ok('...and carries an emitter, in the solver\'s own SI terms', typeof L.effective(j6, 'emitter') === 'number'
	&& L.effective(j6, 'emitter') > 0, String(L.effective(j6, 'emitter')));
{
	// The importer's own line, computed here from first principles rather than copied: 1.5 gpm per
	// psi^0.5 -> m3/s per m^0.5.
	const want = 1.5 * GPM / Math.pow(PSI_M, 0.5);
	ok('...at the value the file states, converted once', Math.abs(L.effective(j6, 'emitter') / want - 1) < 1e-9,
		L.effective(j6, 'emitter') + ' vs ' + want);
}
ok('the exponent came from [OPTIONS] or its default', L.settings().emitterExponent === 0.5,
	String(L.settings().emitterExponent));

console.log('\n--- 2. the popup shows it, in the units on the units strip ---');
// **THE SHIPPED POPUP, NOT A HAND-BUILT ROW.** The whole of Tom's report is that there was no row;
// a harness that asked emitterToDisplay() directly would pass with no row on the page.
L.renderNodeFields('J6');
const fields = L.popupFields();
function labelled(re) {
	return (fields.children || []).filter(function (c) {
		return c._tag === 'label' && re.test(c.textContent || '');
	})[0];
}
const row = labelled(/Emitter coefficient/);
ok('the junction popup carries an Emitter coefficient row', !!row, (fields.children || []).length + ' fields');
if (row) {
	ok('...naming both units, because the quantity is flow per pressure',
		/gpm/.test(row.textContent) && /psi/.test(row.textContent), row.textContent);
	const input = (row.children || []).filter(function (c) { return c._tag === 'input'; })[0];
	ok('...with a number box in it', !!input && input.type === 'number');
	// **THE NUMBER ON SCREEN IS THE FILE'S OWN NUMBER.** This is the assertion the whole conversion
	// pair exists for: the display is the importer's line read backwards, so a 1.5 in the file is a
	// 1.5 in the box, whatever the two factors are.
	ok('...showing the file\'s own 1.5, so the conversion is its own inverse',
		!!input && Math.abs(parseFloat(input.value) - 1.5) < 1e-5, input && input.value);

	console.log('\n--- 3. typing in it writes the document, through the shipped listener ---');
	input.value = '3';
	(input._listeners.change || []).forEach(function (f) { f({}); });
	const want3 = 3 * GPM / Math.pow(PSI_M, 0.5);
	ok('the document holds twice the coefficient', Math.abs(L.effective(j6, 'emitter') / want3 - 1) < 1e-5,
		L.effective(j6, 'emitter') + ' vs ' + want3);
	ok('...written under the underscore, which is the overridable seam', typeof j6._emitter === 'number');
	// BLANK IS NO EMITTER. EPANET treats a zero coefficient as none at all, so there is nothing to
	// distinguish and nothing to store -- and a 0 typed into every junction is a different document.
	L.renderNodeFields('J6');
	const in2 = (labelled(/Emitter coefficient/).children || []).filter(function (c) { return c._tag === 'input'; })[0];
	ok('reopening shows the new number', Math.abs(parseFloat(in2.value) - 3) < 1e-9, in2.value);
	in2.value = '';
	(in2._listeners.change || []).forEach(function (f) { f({}); });
	ok('clearing the box clears the emitter', L.effective(j6, 'emitter') === undefined,
		String(L.effective(j6, 'emitter')));
	L.renderNodeFields('J6');
	const in3 = (labelled(/Emitter coefficient/).children || []).filter(function (c) { return c._tag === 'input'; })[0];
	ok('...and the box comes back empty, not as a 0', in3.value === '', JSON.stringify(in3.value));
	in3.value = '1.5';
	(in3._listeners.change || []).forEach(function (f) { f({}); });
}

console.log('\n--- 4. and the value the file stated still leaves the way it came ---');
{
	// **THE ACCEPTANCE CRITERION IS THE FILE'S OWN NUMBER BACK.** The coefficient is the one
	// quantity js/lpn-inp.js cannot return as TEXT -- it has no display unit to be returned in --
	// so the characters need not survive, but the value must.
	const res = L.exportInp();
	ok('the export succeeded', !!res && res.ok, res && res.detail);
	const out = (res && res.inp) || '';
	const em = out.indexOf('[EMITTERS]') < 0 ? null :
		out.slice(out.indexOf('[EMITTERS]')).split('\n').filter(function (ln) { return /J6/.test(ln); })[0];
	ok('the export writes an [EMITTERS] row for J6', !!em, JSON.stringify(em));
	if (em) {
		const v = parseFloat(em.trim().split(/\s+/)[1]);
		ok('...at the coefficient the file stated', Math.abs(v - 1.5) < 1e-5, String(v));
	}
	// The row must vanish with the emitter, not be written as a 0.
	L.renderNodeFields('J6');
	const in4 = (labelled(/Emitter coefficient/).children || []).filter(function (c) { return c._tag === 'input'; })[0];
	in4.value = '';
	(in4._listeners.change || []).forEach(function (f) { f({}); });
	const out2 = (L.exportInp() || {}).inp || '';
	const emAfter = out2.indexOf('[EMITTERS]') < 0 ? null :
		out2.slice(out2.indexOf('[EMITTERS]')).split('\n').filter(function (ln) { return /J6/.test(ln); })[0];
	ok('an emitter cleared on screen leaves no row behind', !emAfter, JSON.stringify(emAfter));
}

console.log('\n--- 5. the strings, and the note that used to say there was nowhere to see it ---');
{
	const lang = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
	const php = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
	const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
	['lpn_field_emitter', 'lpn_field_emitter_tip'].forEach(function (k) {
		ok(k + ' is defined in English', lang.indexOf("$ec_lang['" + k + "']='") >= 0);
		ok(k + ' is emitted into pageConfig', php.indexOf("$ec_lang['" + k + "']") >= 0);
		ok(k + ' is read from pageConfig', src.indexOf('pc.' + k) >= 0);
	});
	// **THE IMPORT NOTE SAID THE OPPOSITE UNTIL TODAY**, and a note that is false is worse than no
	// note: the reader looks for the thing it says is not there.
	const drop = /\$ec_lang\['lpn_inp_drop_emitters'\]='([^']*)'/.exec(lang);
	ok('the import note no longer says there is nowhere to see it',
		!!drop && !/nowhere/.test(drop[1]), drop && drop[1]);
	ok('...and says where it is instead', !!drop && /Emitter coefficient/.test(drop[1]));
	// **SETPROP, NEVER A DIRECT WRITE.** `emitter` is overridable, so a direct `n._emitter = v`
	// inside a scenario edits Base under every other scenario at once.
	ok('the row writes through setProp()', /setProp\(n, 'emitter', emitterToStore\(v\)\)/.test(src));
	ok('...and reads through effective()', /emitterToDisplay\(effective\(n, 'emitter'\)\)/.test(src));
}

console.log('\n' + (fails ? fails + ' FAILED of ' + checks : 'all ' + checks + ' emitter checks passed'));
process.exit(fails ? 1 : 0);
