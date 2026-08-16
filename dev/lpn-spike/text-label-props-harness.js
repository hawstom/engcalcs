// A Text label's own BOLD and its own ROTATION (ROADMAP Task 337). Run with:
//   node dev/lpn-spike/text-label-props-harness.js
//
// THE DESIGN THIS DEFENDS, because the obvious alternative is the one Tom rejected: rotation is a
// stored NUMBER, not a live reference to a pipe (2026-08-14, *"Rotation as number. Yes. It's just
// a helper/convenience, not a link."*). "Match pipe" is a convenience that FILLS THE BOX from the
// nearest pipe at the moment the user presses it; the label does not follow that pipe afterwards.
// Section 4 asserts both halves of that, because "it did not move" is indistinguishable from "the
// feature is broken" unless the same test also shows that asking again gives the new answer.
//
// What can break quietly, and what each section is here to catch:
//
//   1. THE TWO ANGLE FRAMES. lb.rot is CARTESIAN -- counter-clockwise, y up, the frame a user
//      reads an angle in. SVG rotates CLOCKWISE. Getting that negation wrong renders a mirror
//      image of the intended angle, which looks deliberate on a symmetric drawing and wrong on
//      every other one. It is exactly the mismatch that shipped a page of upside-down pipe labels
//      (settings.labelFlipLeftOfVertical). Asserted as a SIGN, on a non-symmetric angle.
//
//   2. BOLD CHANGES TEXT METRICS. Bold glyphs are wider, so the measured width -- which sizes the
//      mask, the collision box and zoom-to-fit -- must be taken with the weight already on the
//      element. dev/lpn-spike/lpn-dom-stub.js is taught that one relationship on purpose: its
//      getBBox() returns a constant for everything else, and a constant HERE would make this whole
//      section pass while the browser drew a bold label inside a light label's box.
//
//   3. THE MASK MUST TURN WITH THE TEXT, about the SAME point. Two elements, one transform. A mask
//      left upright behind rotated text is a white bar lying across the drawing at an angle to the
//      words it is supposed to sit behind.
//
//   4. THE ROTATED BOX IS AN AXIS-ALIGNED APPROXIMATION and is deliberately larger than the glyphs.
//      What must hold is that it is larger AT ALL: a rotated label reported through its unrotated
//      box is a phantom, and the collision pass would shove data labels away from empty space while
//      the real text collided somewhere else.
//
//   5. ROUND-TRIP, INCLUDING THE ABSENCE OF THE FIELDS. Every label written before Task 337 has
//      neither property. `undefined` must read as "upright, not bold" -- not as NaN, which would
//      emit `rotate(NaN ...)` and make the label vanish with nothing in the console.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tlabelEl: function (id) { return labelEls[id]; },\n" +
	"\t\tlabelById: labelById,\n" +
	"\t\tbuildDom: buildDom,\n" +
	"\t\tmoveNode: function (id, x, y) { var n = nodeById(id); n.x = x; n.y = y; updateNode(id); },\n" +
	// The rotated box exactly as every consumer sees it -- through textLabelBox(), at the label's
	// own rendered point, which is what the collision pass, the leader and bbox() all call.
	"\t\ttextBox: function (id) { var lb = labelById(id), le = labelEls[id],\n" +
	"\t\t\tan = lb.anchorNode ? nodeById(lb.anchorNode) : null;\n" +
	"\t\t\treturn textLabelBox(lb, le, an ? an.x + lb.x : lb.x, an ? an.y + lb.y : lb.y); },\n" +
	"\t\tnearestLinkAngle: nearestLinkAngle,\n" +
	"\t\trenderLabelFields: renderLabelFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol); }
function fire(el, type) {
	(el._listeners[type] || []).forEach(function (fn) { fn({ type: type, currentTarget: el, target: el }); });
}
// The rotate() a stub element is carrying, parsed back into numbers -- or null when it carries
// none, which is the upright case and must be an ABSENT attribute rather than rotate(0).
function transformOf(e) {
	const t = e && e.getAttribute('transform');
	if (!t) { return null; }
	const m = /^rotate\(([-\d.]+) ([-\d.]+) ([-\d.]+)\)$/.exec(t);
	return m ? { a: +m[1], x: +m[2], y: +m[3] } : { raw: t };
}
// Walk the popup's field tree for controls, since renderLabelFields() builds raw elements rather
// than returning handles.
function descendants(root, pred) {
	const out = [];
	(function walk(n) {
		(n.children || []).forEach(function (c) { if (pred(c)) { out.push(c); } walk(c); });
	}(root));
	return out;
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

const doc = L.getDoc();
// A pipe running up and to the right: 30 degrees Cartesian, which is 30 degrees of REAL rotation
// and not a value any sign error can hide in.
const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 100, -57.735026918962575);   // memory frame is y-down, so up is -y
L.addLink('pipe', a.id, b.id);
const lb = L.addText(50, 20, null);

console.log('\n1. Defaults: an untouched Text label is upright and light');
ok('no rot stored', lb.rot === undefined);
ok('no bold stored', lb.bold === undefined);
ok('no transform attribute on the text', transformOf(L.labelEl(lb.id).text) === null,
	JSON.stringify(transformOf(L.labelEl(lb.id).text)));
ok('no transform attribute on the mask', transformOf(L.labelEl(lb.id).mask) === null);
ok('style declares normal weight',
	/font-weight:normal/.test(L.labelEl(lb.id).text.getAttribute('style') || ''),
	L.labelEl(lb.id).text.getAttribute('style'));

console.log('\n2. The popup writes the properties, and the buttons work');
L.renderLabelFields(lb.id);
let fieldsEl = L.popupFields();
let checks = descendants(fieldsEl, c => c.type === 'checkbox');
let numbers = descendants(fieldsEl, c => c.type === 'number');
let buttons = descendants(fieldsEl, c => c._tag === 'button');
// Order matters only for picking the right control out of the tree: alwaysShow ships before bold,
// the size box before the rotation box.
const boldBox = checks[1], rotBox = numbers[1], matchBtn = buttons[0], flipBtn = buttons[1];
ok('a bold checkbox exists', !!boldBox);
ok('a rotation number box exists', !!rotBox);
ok('the rotation box offers presets', rotBox && rotBox.getAttribute('list') === 'lpn_rot_presets');
ok('two buttons exist (match pipe, flip)', buttons.length === 2, 'buttons=' + buttons.length);

const lightWidth = L.labelEl(lb.id).width;
boldBox.checked = true; fire(boldBox, 'change');
ok('bold is stored', lb.bold === true);
ok('style declares bold', /font-weight:bold/.test(L.labelEl(lb.id).text.getAttribute('style') || ''));
// Section 2's real assertion: the RE-MEASUREMENT happened. If the width did not move, either the
// weight was applied after measuring or the stub is holding it constant -- and both of those make
// every geometry check below pass for the wrong reason.
ok('bold re-measures wider than light', L.labelEl(lb.id).width > lightWidth,
	lightWidth + ' -> ' + L.labelEl(lb.id).width);

console.log('\n3. Cartesian in, clockwise out -- the sign, and the mask that follows it');
rotBox.value = '30'; fire(rotBox, 'change');
ok('rotation is stored as the number typed', lb.rot === 30);
const tt = transformOf(L.labelEl(lb.id).text);
ok('the SVG angle is the NEGATED Cartesian angle', tt && near(tt.a, -30, 1e-3),
	tt && tt.a);
ok('rotation is about the label point', tt && near(tt.x, 50) && near(tt.y, 20),
	tt && (tt.x + ',' + tt.y));
const mt = transformOf(L.labelEl(lb.id).mask);
ok('the mask carries the same transform about the same point',
	mt && tt && near(mt.a, tt.a) && near(mt.x, tt.x) && near(mt.y, tt.y));

console.log('\n4. The rotated box is bigger than the upright one, and reverts');
const rotBoxGeom = L.textBox(lb.id);
rotBox.value = '0'; fire(rotBox, 'change');
const uprightGeom = L.textBox(lb.id);
ok('a 30-degree label claims more height than an upright one',
	rotBoxGeom.h > uprightGeom.h, rotBoxGeom.h + ' vs ' + uprightGeom.h);
ok('zero rotation REMOVES the transform rather than writing rotate(0)',
	transformOf(L.labelEl(lb.id).text) === null);

console.log('\n5. Match pipe captures a NUMBER, and the number does not chase the pipe');
fire(matchBtn, 'click');
ok('match pipe fills the box from the nearest pipe', near(lb.rot, 30, 1e-6), lb.rot);
// THE HALF THAT PROVES THE DESIGN. Move the pipe the angle was taken from: the stored number is
// unchanged (it is not a link), and asking again returns the pipe's NEW angle (it is a live
// convenience, not a dead constant). Either half alone is satisfied by a broken feature.
L.moveNode(b.id, 100, 100);            // now -45 degrees Cartesian, and readable as such
const captured = lb.rot;
ok('moving the pipe leaves the stored angle alone', lb.rot === captured && near(lb.rot, 30, 1e-9),
	lb.rot);
ok('asking again reads the pipe where it is now', near(L.nearestLinkAngle(50, 20), -45, 1e-6),
	L.nearestLinkAngle(50, 20));
fire(matchBtn, 'click');
ok('match pipe re-captures the new angle', near(lb.rot, -45, 1e-6), lb.rot);

console.log('\n6. Flip is +180, normalised back into (-180, 180]');
fire(flipBtn, 'click');
ok('-45 flips to 135', near(lb.rot, 135, 1e-6), lb.rot);
fire(flipBtn, 'click');
ok('flipping twice returns to where it started', near(lb.rot, -45, 1e-6), lb.rot);
rotBox.value = '90'; fire(rotBox, 'change');
fire(flipBtn, 'click');
ok('90 flips to -90, not 270', near(lb.rot, -90, 1e-6), lb.rot);

console.log('\n7. Round-trip, and a document written before Task 337');
lb.rot = 30; lb.bold = true;
L.renderLabelFields(lb.id);            // resync the popup handles onto the current values
const saved = JSON.parse(JSON.stringify(L.serializeProject()));
const savedLabel = saved.labels[0];
ok('bold is written to the file', savedLabel.bold === true);
ok('rotation is written to the file', savedLabel.rot === 30);
L.applySaved(saved);
L.buildDom();
const reopened = L.labelById(lb.id);
ok('bold survives the round trip', reopened.bold === true);
ok('rotation survives the round trip', reopened.rot === 30);
ok('the reopened label renders rotated',
	near((transformOf(L.labelEl(lb.id).text) || {}).a, -30, 1e-3));
ok('the reopened label renders bold',
	/font-weight:bold/.test(L.labelEl(lb.id).text.getAttribute('style') || ''));

// An OLD file: the two fields simply are not there. This is the case that fails silently, because
// NaN propagates into the transform string and the browser drops the whole element.
const old = JSON.parse(JSON.stringify(saved));
delete old.labels[0].bold;
delete old.labels[0].rot;
L.applySaved(old);
L.buildDom();
ok('an old label opens upright', transformOf(L.labelEl(lb.id).text) === null,
	JSON.stringify(transformOf(L.labelEl(lb.id).text)));
ok('an old label opens light',
	/font-weight:normal/.test(L.labelEl(lb.id).text.getAttribute('style') || ''));
ok('an old label reports a finite box',
	['x', 'y', 'w', 'h'].every(k => isFinite(L.textBox(lb.id)[k])),
	JSON.stringify(L.textBox(lb.id)));

console.log('');
if (fails) { console.log(fails + ' FAILED'); process.exit(1); }
console.log('all text label property checks passed');
