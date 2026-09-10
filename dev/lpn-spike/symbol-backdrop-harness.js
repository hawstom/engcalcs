// EVERY MAP SYMBOL'S OPAQUE BACKDROP TRACES ITS OWN ICON -- ROADMAP Task 575. Run with:
//
//   node dev/lpn-spike/symbol-backdrop-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-06, closing the symbol work: *"Does it help at all if I rule the
// icons visually complete for the purposes of this task? If there is unfinished background masking
// or something, finish it."* The masking turned out to be complete. This file is what keeps it
// that way, because "complete" is the state that decays silently here.
//
// WHAT THE MASKING IS FOR. A pipe is drawn UNDER a node, so without an opaque shape between them
// the pipe runs visibly across the middle of the tank it terminates at. `prependSymbolBackdrop()`
// puts that shape in. Since 2026-09-02 it does a second job as well: on the valve and the pump it
// IS the solid fill, which is why it must trace the outline rather than merely cover it.
//
// THE FAILURE THIS CATCHES, IN THE WORDS ALREADY IN THE SOURCE: *"A rect over a domed tank leaves
// its corners outside the outline and a pipe appears to stop short of the tank instead of running
// behind it."* That is not a hypothetical -- the tank WAS domed once, and the reservoir was drawn
// as a rectangle before it became a triangle. Each redraw moved the outline in `lib/Icons.lib.php`
// and left a backdrop behind in `js/looped-network.js`, and the two files sit 4,000 lines apart in
// different languages with a comment saying KEEP IT IN SYNC between them.
//
// **A COMMENT IS NOT A CHECK.** CLAUDE.md's own argument: a rule a machine enforces is worth
// roughly ten a human must remember. So the icon geometry is read out of the PHP that ships it and
// the backdrop out of the JS that draws it, and neither is retyped here. A harness carrying its
// own copy of either path would go green on the day somebody edited both files and stayed green
// forever after, which is the shape of test this repository keeps finding and deleting.
//
// The valve's own pair is asserted a second time by dev/lpn-spike/valve-arrow-harness.js, which
// got there first and reaches it from the other side (the icon must have no stem and no handwheel).
// Deliberately not deduplicated: that file is about what a valve LOOKS like, this one is about the
// four backdrops as a set, and the set is the thing an added element type breaks.

'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '../../');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const icons = fs.readFileSync(ROOT + 'lib/Icons.lib.php', 'utf8');
const editor = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');

// ------------------------------------------------------------------------------------------------
// The icon geometry, out of the file that ships it.
// ------------------------------------------------------------------------------------------------
// One `'name' => '<path .../>'` row of the icon table. Read by NAME rather than by position: the
// table is alphabetical today and nothing guarantees it stays that way.
function iconGeometry(name) {
	const re = new RegExp("'" + name + "'\\s*=>\\s*'([^']*)'");
	const m = icons.match(re);
	return m ? m[1] : null;
}
// Every `d="..."` in a row, in order. A valve is two triangles and comes back as two.
function iconPathData(name) {
	const geom = iconGeometry(name);
	if (geom === null) { return null; }
	return [...geom.matchAll(/\sd="([^"]*)"/g)].map((m) => m[1]);
}

// ------------------------------------------------------------------------------------------------
// The backdrops, out of the file that draws them.
// ------------------------------------------------------------------------------------------------
// `prependSymbolBackdrop(target, tag, attrs, cls)` -- attrs is an object literal at every call
// site, which is what makes reading them out of the source honest rather than fragile.
function backdropCalls() {
	const out = [];
	const re = /prependSymbolBackdrop\(\s*(\w+),\s*'(\w+)',\s*\{([^}]*)\},\s*'([^']*)'\s*\)/g;
	let m;
	while ((m = re.exec(editor)) !== null) {
		out.push({ target: m[1], tag: m[2], attrs: m[3].trim(), cls: m[4], at: m.index });
	}
	return out;
}
const calls = backdropCalls();

// **THE OUTLINES ARE ONE TABLE NOW, AND THAT IS WHAT THIS FILE READS** (Task 618, 2026-09-10). They
// used to be four `d:` literals at four call sites; they are `SYMBOL_SILHOUETTE` in
// js/looped-network.js, because the same four outlines became the INVISIBLE GRAB SHAPES as well as
// the opaque backdrops -- a reservoir's pointer band is its triangle, a pump's is its volute. Two
// consumers of one drawing is exactly the shape that produced this harness's own defect, so the
// table is read here and held against lib/Icons.lib.php as the literals were.
function silhouetteTable() {
	const blk = editor.match(/var SYMBOL_SILHOUETTE = \{([\s\S]*?)\n\t\};/);
	const out = {};
	if (!blk) { return out; }
	[...blk[1].matchAll(/(\w+):\s*'([^']*)'/g)].forEach((m) => { out[m[1]] = m[2]; });
	return out;
}
const SIL = silhouetteTable();

console.log('=== 1. every drawn symbol has a backdrop, and it comes from the one table ===');
{
	// **THREE CALL SITES FOR FOUR SYMBOLS, and the node one is keyed by TYPE.** It was four
	// literals; the reservoir and the tank now share one call that reads
	// `SYMBOL_SILHOUETTE[n.type]`, which is the same guard by a shorter road -- a fifth drawn type
	// added to that table with no backdrop still cannot happen, because the call IS the table
	// lookup. What has to fail here is a symbol drawn with no backdrop at all, so the assertion is
	// on the SET of classes and on every call taking its shape from the table.
	ok('three backdrop call sites: one per node type together, and one each for pump and valve',
		calls.length === 3, calls.length + ': ' + calls.map((c) => c.cls).join(', '));
	const nodeCalls = calls.filter((c) => c.cls === 'lpn-node-symbol-backdrop');
	const linkCalls = calls.filter((c) => c.cls === 'lpn-link-symbol-backdrop');
	ok('...one of them on nodes, keyed by the node\'s own type', nodeCalls.length === 1 &&
		/d:\s*SYMBOL_SILHOUETTE\[n\.type\]/.test(nodeCalls[0].attrs), nodeCalls[0] && nodeCalls[0].attrs);
	ok('...and two on links (pump, valve)', linkCalls.length === 2, String(linkCalls.length));
	// The types that GET a symbol, read out of the editor rather than listed here.
	const nodeTypes = editor.match(/\(n\.type === 'reservoir' \|\| n\.type === 'tank'\)/);
	ok('a node symbol is drawn for exactly reservoir and tank', !!nodeTypes);

	ok('the table names those four and nothing else',
		Object.keys(SIL).sort().join(',') === 'pump,reservoir,tank,valve',
		Object.keys(SIL).join(','));
}

console.log('\n=== 2. each outline traces its own icon, character for character ===');
{
	// **THE RESERVOIR.** A triangle. It was a rectangle once, and a rectangle behind a triangle
	// leaves two corners outside the outline with pipe showing through them.
	ok('the reservoir outline is the reservoir icon\'s own path',
		SIL.reservoir === iconPathData('reservoir')[0],
		'table ' + SIL.reservoir + ' vs icon ' + iconPathData('reservoir')[0]);

	// **THE TANK**, and the one case where the two are written in different notations: the table
	// spells it in absolute commands (`M4 6.5H20V17.5H4Z`) against the icon's relative
	// `M4 6.5h16v11H4z`, because the grab shape and the backdrop are one path now and a `<rect>`
	// cannot be both. So it is compared by GEOMETRY: the four numbers the table traces must be the
	// four the icon does. Comparing the strings would fail on a difference that is not one, and
	// comparing nothing at all is what let a domed tank keep a rectangular backdrop.
	const iconTank = iconPathData('tank')[0];
	const tm = iconTank.match(/^M([\d.]+) ([\d.]+)h([\d.]+)v([\d.]+)H([\d.]+)z$/);
	const sm = (SIL.tank || '').match(/^M([\d.]+) ([\d.]+)H([\d.]+)V([\d.]+)H([\d.]+)Z$/);
	ok('the tank icon is still a plain axis-aligned rectangle path', !!tm, iconTank);
	ok('...and the table states the same rectangle', !!sm, SIL.tank);
	ok('...corner for corner',
		!!tm && !!sm && Number(sm[1]) === Number(tm[1]) && Number(sm[2]) === Number(tm[2])
		&& Number(sm[3]) === Number(tm[1]) + Number(tm[3])
		&& Number(sm[4]) === Number(tm[2]) + Number(tm[4])
		&& Number(sm[5]) === Number(tm[1]) && Number(tm[5]) === Number(tm[1]),
		SIL.tank + ' vs icon ' + iconTank);

	// **THE VALVE.** Two triangles, concatenated. A bounding box here would blank the pipe on both
	// sides of the waist and read as a rectangle rather than as a valve -- and as a GRAB shape it
	// would take the pipe running through the waist away from the pointer.
	ok('the valve outline is its two icon triangles, concatenated',
		SIL.valve === iconPathData('valve').join(''),
		'table ' + SIL.valve + ' vs icon ' + iconPathData('valve').join(''));

	// **THE PUMP.** The whole volute, tail included. The backdrop used to trace the casing only,
	// on the argument that a thin discharge LINE crossing a pipe reads as two lines crossing; the
	// discharge became a filled body, so a pipe showing through it now reads as a hole in the pump.
	ok('the pump outline is the pump icon\'s own path, tail and all',
		SIL.pump === iconPathData('pump')[0],
		'table ' + SIL.pump + ' vs icon ' + iconPathData('pump')[0]);
}

console.log('\n=== 2b. the same four outlines are what answers the pointer ===');
{
	// Task 618. A grab shape that is not the drawn shape is the defect Tom traced by eye -- *"I can
	// visually trace the outline of the reservoir's halo, and if I am not mistaken, it is
	// circular."* -- so the two readers of this table are asserted to BE the two readers, and a
	// third one written as a literal would leave one of these false.
	ok('a vessel\'s grab shape is built from the table',
		/nodeHitSilhouette\(n\) \{[\s\S]{0,200}?SYMBOL_SILHOUETTE\[n\.type\]/.test(editor));
	ok('a pump\'s and a valve\'s grab shape is built from the table',
		/'class': 'lpn-link-symbol-hit'/.test(editor) &&
		/d: SYMBOL_SILHOUETTE\[l\.type\], 'class': 'lpn-link-symbol-hit'/.test(editor));
	ok('...and no shape in that family is written as a path literal anywhere else',
		(editor.match(/'M3\.5 5\.5H20\.5L12 20Z'/g) || []).length === 1 &&
		(editor.match(/'M9 7H22\.5V13H15A6 6 0 1 1 9 7Z'/g) || []).length === 1,
		'reservoir ' + (editor.match(/'M3\.5 5\.5H20\.5L12 20Z'/g) || []).length +
		', pump ' + (editor.match(/'M9 7H22\.5V13H15A6 6 0 1 1 9 7Z'/g) || []).length);
}

console.log('\n=== 3. the mutant: this file would notice a redraw ===');
{
	// A harness reading two sources and comparing them can still pass for the wrong reason -- if
	// the reader returns null on both sides, null === null. So every icon this file compares is
	// asserted to have been FOUND and to be non-trivial, which is the one thing that cannot be
	// true by accident.
	['reservoir', 'tank', 'pump', 'valve'].forEach((name) => {
		const d = iconPathData(name);
		ok(name + ': its geometry was actually read out of lib/Icons.lib.php',
			!!d && d.length > 0 && d.every((x) => x.length > 8), JSON.stringify(d));
	});
	ok('and every outline in the table is a real shape, not an empty string',
		Object.keys(SIL).length === 4 && Object.keys(SIL).every((k) => SIL[k].length > 8),
		JSON.stringify(SIL));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall symbol-backdrop checks passed');
process.exit(fails ? 1 : 0);
