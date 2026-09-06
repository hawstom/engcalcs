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

console.log('=== 1. there are exactly four, and no element type is drawn without one ===');
{
	// FOUR, and the number is the guard. `buildMapIconSvg()` draws a symbol for reservoir, tank,
	// pump and valve; a junction is a plain circle and needs no backdrop, and a text label is not
	// an asset. A fifth symbol arriving without a backdrop is the exact defect this file exists
	// for, and it would be invisible in a diff -- so a fifth CALL, or a fifth drawn type, has to
	// fail here until somebody decides which it is.
	ok('four backdrop call sites, one per drawn symbol', calls.length === 4,
		calls.length + ': ' + calls.map((c) => c.cls).join(', '));
	const nodeCalls = calls.filter((c) => c.cls === 'lpn-node-symbol-backdrop');
	const linkCalls = calls.filter((c) => c.cls === 'lpn-link-symbol-backdrop');
	ok('...two of them on nodes (reservoir, tank)', nodeCalls.length === 2, String(nodeCalls.length));
	ok('...and two on links (pump, valve)', linkCalls.length === 2, String(linkCalls.length));

	// The types that GET a symbol, read out of the editor rather than listed here.
	const nodeTypes = editor.match(/\(n\.type === 'reservoir' \|\| n\.type === 'tank'\)/);
	ok('a node symbol is drawn for exactly reservoir and tank', !!nodeTypes);
}

console.log('\n=== 2. each backdrop traces its own icon, character for character ===');
{
	// **THE RESERVOIR.** A triangle. It was a rectangle once, and a rectangle behind a triangle
	// leaves two corners outside the outline with pipe showing through them.
	const res = calls.find((c) => c.cls === 'lpn-node-symbol-backdrop' && c.tag === 'path');
	const resD = res && (res.attrs.match(/d:\s*'([^']*)'/) || [])[1];
	ok('the reservoir backdrop is the reservoir icon\'s own path',
		resD === iconPathData('reservoir')[0],
		'backdrop ' + resD + ' vs icon ' + iconPathData('reservoir')[0]);

	// **THE TANK.** A rect, and the one case where the two are written in different notations --
	// `<rect>` against the icon's `M4 6.5h16v11H4z`. So it is compared by GEOMETRY: the four
	// numbers the rect states must be the four the path traces. Comparing the strings would fail
	// on a difference that is not one, and comparing nothing at all is what let a domed tank keep
	// a rectangular backdrop.
	const tank = calls.find((c) => c.cls === 'lpn-node-symbol-backdrop' && c.tag === 'rect');
	const num = (k) => Number((tank.attrs.match(new RegExp(k + ':\\s*([\\d.]+)')) || [])[1]);
	const iconTank = iconPathData('tank')[0];
	const tm = iconTank.match(/^M([\d.]+) ([\d.]+)h([\d.]+)v([\d.]+)H([\d.]+)z$/);
	ok('the tank icon is still a plain axis-aligned rectangle path', !!tm, iconTank);
	ok('...and the tank backdrop states exactly its four numbers',
		!!tm && num('x') === Number(tm[1]) && num('y') === Number(tm[2])
		&& num('width') === Number(tm[3]) && num('height') === Number(tm[4]),
		`backdrop ${num('x')},${num('y')} ${num('width')}x${num('height')} vs icon ${iconTank}`);
	ok('...and its left edge closes back to x, so the rect is the whole shape',
		!!tm && Number(tm[5]) === Number(tm[1]), tm ? tm[5] + ' vs ' + tm[1] : iconTank);

	// **THE VALVE.** Two triangles, concatenated. A bounding box here would blank the pipe on both
	// sides of the waist and read as a rectangle rather than as a valve.
	const valve = calls.find((c) => c.cls === 'lpn-link-symbol-backdrop'
		&& /M3 3/.test(c.attrs));
	const valveD = valve && (valve.attrs.match(/d:\s*'([^']*)'/) || [])[1];
	ok('the valve backdrop is its two icon triangles, concatenated',
		valveD === iconPathData('valve').join(''),
		'backdrop ' + valveD + ' vs icon ' + iconPathData('valve').join(''));

	// **THE PUMP.** The whole volute, tail included. The backdrop used to trace the casing only,
	// on the argument that a thin discharge LINE crossing a pipe reads as two lines crossing; the
	// discharge became a filled body, so a pipe showing through it now reads as a hole in the pump.
	const pump = calls.find((c) => c.cls === 'lpn-link-symbol-backdrop' && !/M3 3/.test(c.attrs));
	const pumpD = pump && (pump.attrs.match(/d:\s*'([^']*)'/) || [])[1];
	ok('the pump backdrop is the pump icon\'s own path, tail and all',
		pumpD === iconPathData('pump')[0],
		'backdrop ' + pumpD + ' vs icon ' + iconPathData('pump')[0]);
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
	ok('and every backdrop call carries a real shape, not an empty attrs object',
		calls.every((c) => c.attrs.length > 8), JSON.stringify(calls.map((c) => c.attrs)));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall symbol-backdrop checks passed');
process.exit(fails ? 1 : 0);
