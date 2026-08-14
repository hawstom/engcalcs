// Harness for the friction-method choice (ROADMAP Task 271) -- run with:
//   node dev/lpn-spike/friction-method-harness.js
//
// WHY THIS EXISTS. `lpn_` was Hazen-Williams-only in practice: frictionMethod() read
// settings.method, but nothing anywhere WROTE it. Adding the control is easy; the part that is
// easy to get silently wrong is that roughness is three different quantities wearing one field.
// Manning n and HW C are dimensionless, so they pass to the solver untouched -- but
// Darcy-Weisbach e is a LENGTH, and js/lpn-solver.js hands it to lpnDwFriction(q, d, e, visc)
// where d is already SI metres. Get the conversion wrong and the relative roughness e/d is off by
// the unit factor: the network still converges, every number looks plausible, and nothing on
// screen says otherwise. That is exactly the shape of the Task 255 bug (length in the wrong unit),
// which is why this checks the boundary against a HAND-COMPUTED value rather than against the
// app's own arithmetic.

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, effective: effective, linkById: linkById,\n" +
	"\t\tfrictionMethod: frictionMethod, roughnessLabel: roughnessLabel,\n" +
	"\t\troughnessSymbol: roughnessSymbol, roughnessSI: roughnessSI,\n" +
	"\t\tdefaultRoughnessFor: defaultRoughnessFor, applyMethodUI: applyMethodUI,\n" +
	"\t\tsetMethod: function (m) { settings.method = m; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tunitFactor: unitFactor, unitKey: unitKey,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields, toggleSettingsPopup: toggleSettingsPopup,\n" +
	"\t\tsettingsFieldsEl: function () { return document.getElementById('lpn_settings_fields'); },\n" +
	"\t\troughnessRowShown: function () { var r = document.getElementById('lpn_u_roughness_row'); return r ? r.style.display !== 'none' : null; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

function allText(n) {
	if (!n) { return ''; }
	let t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allText(c); });
	return t;
}
// The DOM stub uppercases tagName and has no dispatchEvent -- listeners are called directly.
function findSelect(root, pred) {
	let hit = null;
	(function walk(n) {
		if (hit || !n || !n.children) { return; }
		for (const c of n.children) {
			if (c.tagName === 'SELECT' && pred(c)) { hit = c; return; }
			walk(c);
			if (hit) { return; }
		}
	})(root);
	return hit;
}
function fire(el, type) { (el._listeners[type] || []).forEach(function (fn) { fn({ type: type, currentTarget: el, target: el }); }); }

console.log('=== Task 271: friction-method choice ===');

setUnitSet('us');
L.reset();
L.drawExample();

// ---- 1. Default is unchanged ---------------------------------------------------------------
ok('default method is still Hazen-Williams', L.frictionMethod() === 'hw', L.frictionMethod());
ok('roughness symbol is C under HW', L.roughnessSymbol() === 'C');

// ---- 2. The SETTINGS control exists and writes settings.method ------------------------------
L.rebuildSettingsFields();
const fields = L.settingsFieldsEl();
const methodSel = findSelect(fields, function (s) {
	return s.children.some(function (o) { return o.value === 'manning'; })
		&& s.children.some(function (o) { return o.value === 'dw'; });
});
ok('settings panel renders a friction-method select', !!methodSel);
ok('select offers all three methods', !!methodSel && methodSel.children.length === 3,
	methodSel && methodSel.children.length);
ok('select starts on the current method', !!methodSel
	&& methodSel.children.filter(function (o) { return o.selected; })[0].value === 'hw');

// Switching with pipes present asks first; the stub's confirm() says yes.
if (methodSel) { methodSel.value = 'manning'; fire(methodSel, 'change'); }
ok('choosing Manning writes settings.method', L.frictionMethod() === 'manning', L.frictionMethod());
ok('roughness symbol follows the method', L.roughnessSymbol() === 'n');
ok('roughness label carries the symbol', /,\s*n$/.test(L.roughnessLabel()), L.roughnessLabel());

// ---- 3. The CONFIRM guard actually guards ---------------------------------------------------
// A method switch converts nothing, so on a network that already has pipes it must ask -- and a
// refusal must leave BOTH the setting and the select where they were.
const realConfirm = global.confirm;
let asked = 0;
global.confirm = function () { asked++; return false; };
L.rebuildSettingsFields();
const sel2 = findSelect(L.settingsFieldsEl(), function (s) {
	return s.children.some(function (o) { return o.value === 'dw'; });
});
if (sel2) { sel2.value = 'dw'; fire(sel2, 'change'); }
ok('switching method on a network with pipes asks first', asked === 1, 'asked ' + asked + ' time(s)');
ok('declining leaves the method alone', L.frictionMethod() === 'manning', L.frictionMethod());
ok('declining resets the select too', !sel2 || sel2.value === 'manning', sel2 && sel2.value);
global.confirm = realConfirm;

// ---- 4. The roughness UNIT selector appears only for Darcy-Weisbach --------------------------
L.setMethod('hw'); L.applyMethodUI();
ok('roughness unit row hidden under HW', L.roughnessRowShown() === false);
L.setMethod('manning'); L.applyMethodUI();
ok('roughness unit row hidden under Manning', L.roughnessRowShown() === false);
L.setMethod('dw'); L.applyMethodUI();
ok('roughness unit row shown under Darcy-Weisbach', L.roughnessRowShown() === true);

// ---- 5. THE UNIT BOUNDARY -- the one that fails silently ------------------------------------
// Under US, the roughness family's unit is ft. A pipe whose declared e is 0.005 ft must reach the
// solver as 0.005 * 0.3048 = 0.001524 m. Checked against the hand-computed number, NOT against
// the app's own toSI -- a test that reused the app's conversion would agree with itself.
const pipe = L.getDoc().links.filter(function (l) { return l.type === 'pipe'; })[0];
setUnitSet('us');
L.setMethod('dw');
pipe._roughness = 0.005;
const FT_PER_M = 3.280839895;
ok('roughness unit under the US preset is ft', L.unitKey('lpn_u_roughness') === 'ft', L.unitKey('lpn_u_roughness'));
ok('DW roughness reaches the solver in METRES',
	near(L.roughnessSI(pipe), 0.005 / FT_PER_M, 1e-9),
	'got ' + L.roughnessSI(pipe) + ', expected ' + (0.005 / FT_PER_M));
// And the dimensionless methods must NOT be converted -- the mirror-image bug.
L.setMethod('hw'); pipe._roughness = 130;
ok('HW C is passed through unconverted', L.roughnessSI(pipe) === 130, L.roughnessSI(pipe));
L.setMethod('manning'); pipe._roughness = 0.013;
ok('Manning n is passed through unconverted', L.roughnessSI(pipe) === 0.013, L.roughnessSI(pipe));

// The same declared number in SI must mean a different physical size -- i.e. the boundary is
// live, not a no-op that happens to pass under one preset.
setUnitSet('si');
L.setMethod('dw');
pipe._roughness = 1.5; // mm under the SI preset
ok('roughness unit under the SI preset is mm', L.unitKey('lpn_u_roughness') === 'mm', L.unitKey('lpn_u_roughness'));
ok('1.5 mm reaches the solver as 0.0015 m', near(L.roughnessSI(pipe), 0.0015, 1e-12), L.roughnessSI(pipe));

// ---- 6. Defaults follow the method, and are physically sane ---------------------------------
setUnitSet('us');
ok('HW default roughness is a C', L.defaultRoughnessFor('hw') === 130);
ok('Manning default roughness is an n', L.defaultRoughnessFor('manning') === 0.013);
const dwDef = L.defaultRoughnessFor('dw');
ok('DW default roughness is 0.0015 m expressed in ft',
	near(dwDef, 0.0015 * FT_PER_M, 5e-5), 'got ' + dwDef);

// ---- 7. The three methods actually give three different answers -----------------------------
// The point of the whole task: if the method reached the solver but changed nothing, every check
// above could still pass.
setUnitSet('us');
L.reset();
L.drawExample();
const heads = {};
['hw', 'manning', 'dw'].forEach(function (m) {
	L.setMethod(m);
	const d = L.getDoc();
	d.links.forEach(function (l) {
		if (l.type === 'pump') { return; }
		l._roughness = m === 'hw' ? 130 : m === 'manning' ? 0.013 : 0.005;
	});
	const r = EngCalcs.lpnSolve(L.assembleModel(), { tol: 1e-9 });
	heads[m] = r && r.ok && r.converged ? r.heads : null;
	ok(m + ' converges', !!heads[m], r && r.message);
});
function spread(a, b) {
	if (!heads[a] || !heads[b]) { return 0; }
	return Object.keys(heads[a]).reduce(function (mx, k) {
		return Math.max(mx, Math.abs(heads[a][k] - heads[b][k]));
	}, 0);
}
ok('Manning and HW give different heads', spread('hw', 'manning') > 1e-4, spread('hw', 'manning'));
ok('DW and HW give different heads', spread('hw', 'dw') > 1e-4, spread('hw', 'dw'));

// ---- 8. The example FORCES Hazen-Williams ---------------------------------------------------
// A trap created BY this task: newProject() inherits settings from the project you were in, so a
// visitor sitting on Manning who chose Example would get a ring main whose pipes carry n = 130 --
// an HW C read as a Manning n, four orders of magnitude out, converging happily to nonsense.
setUnitSet('us');
L.reset();
L.setMethod('manning');
L.drawExample();
ok('example forces Hazen-Williams even from a Manning project',
	L.frictionMethod() === 'hw', L.frictionMethod());
ok('example roughness is an HW C, and is now read as one',
	L.getDoc().links.filter(function (l) { return l.type !== 'pump'; })
		.every(function (l) { return L.effective(l, 'roughness') > 50; }));
ok('forcing the method also re-applies the unit row', L.roughnessRowShown() === false);

console.log(fails === 0 ? '\nAll checks passed.' : '\n' + fails + ' FAILURE(S).');
process.exit(fails === 0 ? 0 : 1);
