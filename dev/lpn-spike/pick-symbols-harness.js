// Headless check of Geom.pickSymbols(), the rule for when one click could mean more than one
// symbol (js/lpn-geom.js). Pure: drawn extents in screen pixels in, an ordered list out.
//
//   node dev/lpn-spike/pick-symbols-harness.js
//
// Tom, 2026-11-16 (round 6): the box is strictly an overlap disambiguator. It opens only when the
// pressed POINT lies on the drawn ink of two or more symbols; where symbols touch elsewhere does not
// matter; a symbol hidden entirely under others joins when the press lands on a hider; never a line;
// at most six rows, the symbol nearest the press first.
// What can be wrong: a box for a press on one symbol that overlaps another elsewhere (round 5); a
// press on two inks that gives no box; a hidden symbol missing; a pipe or an open polyline in the list;
// more than six rows; the order.

const Geom = require('../../js/lpn-geom.js').lpnGeom;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const dot = (id, x, y, r) => ({ kind: 'node', id, type: 'junction', rank: 0, circle: { x, y, r: r === undefined ? 4 : r } });
const box = (kind, id, l, t, r, b, rank) => ({ kind, id, type: 'x', rank, rect: { l, t, r, b } });
const shape = (id, pts, closed) => ({ kind: 'shape', id, rank: 3, outline: { pts, closed: !!closed } });
const ids = (list) => list.map((c) => c.kind + ':' + c.id);
function same(name, got, want) { ok(name, JSON.stringify(got) === JSON.stringify(want), 'got ' + JSON.stringify(got)); }
const pick = (items, x, y, o) => ids(Geom.pickSymbols(items, x, y, o));

console.log('\n--- a finger is a disc ---');
same('a point on one dot, a second dot 12 px off: the point rule gives no box', pick([dot('A', 0, 0), dot('B', 12, 0)], 0, 0), []);
same('...with a disc the point still rules while it is on ink: no box', pick([dot('A', 0, 0), dot('B', 12, 0)], 1, 0, { disc: 24 }), []);
same('...a point on no ink, a 24 px disc touching both: the box, the nearer first', pick([dot('A', 0, 0), dot('B', 12, 0)], 8, 12, { disc: 24 }), ['node:B', 'node:A']);
same('...a disc that reaches only one dot: no box', pick([dot('A', 0, 0), dot('B', 40, 0)], 1, 0, { disc: 24 }), []);
same('...a press on bare map with a disc touching two dots: the box, nearest first', pick([dot('A', 0, 0), dot('B', 20, 0)], 14, 0, { disc: 24 }), ['node:B', 'node:A']);
same('...the disc is measured to the ink, not the centre: a dot 28 px off (radius 4, stroke 0.6) is within 24', pick([dot('A', 0, 0), dot('B', 28, 0)], 14, 12, { disc: 24 }), ['node:A', 'node:B']);

console.log('\n--- the ordinary click stays ordinary ---');
same('one dot', pick([dot('A', 0, 0)], 0, 0), []);
same('bare map', pick([dot('A', 0, 0)], 50, 50), []);
same('two separate dots inside a finger\'s reach: the nearer one, no box', pick([dot('A', 0, 0), dot('B', 12, 0)], 1, 0, { reach: 24 }), []);
same('two dots 9 px apart (radius 4): they do not touch', pick([dot('A', 0, 0), dot('B', 9, 0)], 0, 0), []);
same('a Text whose words cover a dot, pressed 30 px from the dot on the Text: no box (the dot is not under the pickbox)',
	pick([box('label', 'X', 0, -5, 80, 5, 2), dot('A', 5, 0)], 60, 0), []);
same('a pump clear of the reservoir it overlaps: no box',
	pick([box('node', 'Lake', 0, 0, 30, 20, 0), box('link', 'PU', 25, 5, 60, 15, 1)], 50, 10), []);

console.log('\n--- the box opens where symbols visibly overlap ---');
same('two dots overlapping by half a width (centres 4 apart, radius 4; depth 4 of 8), pressed on one', pick([dot('A', 0, 0), dot('B', 4, 0)], 0, 0), ['node:A', 'node:B']);
same('...pressed on the part of B outside A: B only, no box', pick([dot('A', 0, 0), dot('B', 4, 0)], 7, 0), []);
same('...pressed in the overlap: both, in id order (both are under the point)', pick([dot('A', 0, 0), dot('B', 4, 0)], 3, 0), ['node:A', 'node:B']);
same('two dots that only touch (centres 8 apart): no box', pick([dot('A', 0, 0), dot('B', 8, 0)], 0, 0), []);
same('two dots that graze, overlapping by 2 px of an 8 px width: no box', pick([dot('A', 0, 0), dot('B', 6, 0)], 0, 0), []);
same('the reservoir and the pump where they overlap',
	pick([box('node', 'Lake', 0, 0, 30, 20, 0), box('link', 'PU', 10, 5, 45, 15, 1)], 20, 10), ['node:Lake', 'link:PU']);
same('a pump overlapping the reservoir\'s edge, pressed on its free part: no box',
	pick([box('node', 'Lake', 0, 0, 30, 20, 0), box('link', 'PU', 25, 5, 60, 15, 1)], 50, 10), []);
same('...pressed on the reservoir clear of the pump: no box',
	pick([box('node', 'Lake', 0, 0, 30, 20, 0), box('link', 'PU', 25, 5, 60, 15, 1)], 10, 10), []);
same('coincident dots in natural id order (J2 before J10)', pick([dot('J10', 0, 0), dot('J2', 0, 0), dot('J1', 0, 0)], 0, 0), ['node:J1', 'node:J2', 'node:J10']);
same('a Text over coincident dots is one more row, after the dots',
	pick([box('label', 'X', -10, -5, 20, 5, 2), dot('A', 0, 0), dot('B', 0, 0)], 0, 0), ['node:A', 'node:B', 'label:X']);
same('a point Shape on a dot', pick([dot('A', 0, 0), shape('S1', [{ x: 0, y: 0 }])], 0, 0), ['node:A', 'shape:S1']);
same('a closed Shape whose outline passes through a dot',
	pick([dot('A', 0, 0), shape('S3', [{ x: -20, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 30 }], true)], 0, 0), ['node:A', 'shape:S3']);

console.log('\n--- a pump\'s or valve\'s symbol is a symbol: its drawn pieces, not its box (round 4) ---');
{
	// A pump 20 px wide: casing (circle r 6 at 8,10) and tail (rect 8..20 x 4..10); a valve: two triangles.
	const pump = (id, ox, oy) => ({ kind: 'link', id, type: 'pump', rank: 1,
		quad: { cx: ox + 10, cy: oy + 10, hw: 10, hh: 6, ux: 1, uy: 0 },
		parts: [{ circle: { x: ox + 8, y: oy + 10, r: 6 } }, { poly: [{ x: ox + 8, y: oy + 4 }, { x: ox + 20, y: oy + 4 }, { x: ox + 20, y: oy + 10 }, { x: ox + 8, y: oy + 10 }] }] });
	const valve = (id, ox, oy) => ({ kind: 'link', id, type: 'valve', rank: 1,
		quad: { cx: ox + 9, cy: oy + 9, hw: 9, hh: 9, ux: 1, uy: 0 },
		parts: [{ poly: [{ x: ox, y: oy }, { x: ox, y: oy + 18 }, { x: ox + 9, y: oy + 9 }] }, { poly: [{ x: ox + 18, y: oy }, { x: ox + 18, y: oy + 18 }, { x: ox + 9, y: oy + 9 }] }] });
	same('a junction on the pump\'s casing: the box, the junction first', pick([dot('J', 8, 10), pump('PU', 0, 0)], 8, 10), ['node:J', 'link:PU']);
	same('a junction on the pump\'s tail end, pressed on the overlap: the box', pick([dot('J', 22, 7), pump('PU', 0, 0)], 19, 7), ['node:J', 'link:PU']);
	same('...pressed on the pump\'s free tail: the pump alone, no box', pick([dot('J', 22, 7), pump('PU', 0, 0)], 14, 7), []);
	same('...pressed on the junction beyond the pump: the junction alone, no box', pick([dot('J', 22, 7), pump('PU', 0, 0)], 25, 7), []);
	same('a junction in the empty corner of the pump\'s box (below the tail, clear of the casing): no box', pick([dot('J', 20, 17), pump('PU', 0, 0)], 20, 17), []);
	same('a junction only touching the casing: no box', pick([dot('J', 8 + 6 + 4, 10 + 6 + 4), pump('PU', 0, 0)], 18, 20), []);
	same('a junction over a valve\'s triangle: the box', pick([dot('J', 3, 9), valve('V', 0, 0)], 3, 9), ['node:J', 'link:V']);
	same('a junction in the valve\'s waist gap, above the apex (empty corner): no box', pick([dot('J', 9, 1), valve('V', 0, 0)], 9, 1), []);
	// Only the pressed point counts (round 6): a disc that touches a glyph elsewhere does not change a press.
	same('a disc over the valve\'s notch, pressed where the disc and a triangle meet: the box', pick([dot('J', 9, 4, 4), valve('V', 0, 0)], 5, 5).sort(), ['link:V', 'node:J']);
	same('...pressed on the disc part clear of the triangles: the junction alone, no box', pick([dot('J', 9, 4, 4), valve('V', 0, 0)], 9, 1), []);
	same('a disc grazing the pump\'s tail end, pressed on the disc far side: the junction alone', pick([dot('J', 24, 7), pump('PU', 0, 0)], 27, 7), []);
	same('a disc a pixel clear of the pump\'s tail end: no box anywhere', pick([dot('J', 25.7, 7), pump('PU', 0, 0)], 22, 7), []);
	same('two glyphs over each other: the box', pick([pump('PA', 0, 0), valve('V', 4, 0)], 8, 9), ['link:PA', 'link:V']);
	same('a tank under the pump\'s casing: the box', pick([box('node', 'T', 0, 0, 16, 12, 0), pump('PU', 4, 0)], 10, 8), ['node:T', 'link:PU']);
}

console.log('\n--- no line is a row ---');
same('an open polyline over a dot is not a row: no box', pick([dot('A', 0, 0), shape('S2', [{ x: -20, y: 0 }, { x: 20, y: 0 }], false)], 0, 0), []);
same('an open polyline over two coincident dots: the dots only',
	pick([dot('A', 0, 0), dot('B', 0, 0), shape('S2', [{ x: -20, y: 0 }, { x: 20, y: 0 }], false)], 0, 0), ['node:A', 'node:B']);

console.log('\n--- at most six rows, coincident first, by distance from the press ---');
{
	const pile = [];
	for (let i = 1; i <= 9; i++) { pile.push(dot('Z' + i, 0, 0)); }
	same('nine coincident dots: six rows', pick(pile, 0, 0).length, 6);
	same('...the first six by id', pick(pile, 0, 0), ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6'].map((i) => 'node:' + i));
	const mixed = [dot('Far', 6, 0), dot('A', 0, 0), dot('B', 0, 0), dot('C', 0, 0), dot('N1', 2, 0), dot('N2', 3, 0), dot('N3', 1, 0)];
	same('coincident dots first, then the nearest others, cap 6', pick(mixed, 0, 0),
		['node:A', 'node:B', 'node:C', 'node:N3', 'node:N1', 'node:N2']);
	same('the cap can be changed', pick(pile, 0, 0, { cap: 3 }).length, 3);
}

console.log('\n--- a pipe drawn as a point is a row, never the reason for a box ---');
{
	const buried = { kind: 'link', id: 'P2', type: 'pipe', rank: 1, soft: true, circle: { x: 0, y: 0, r: 0.5 } };
	same('a dot with only a buried pipe on it: no box', pick([dot('A', 0, 0), buried], 0, 0), []);
	same('two coincident dots and the buried pipe between them: all three', pick([dot('A', 0, 0), dot('B', 0, 0), buried], 0, 0), ['node:A', 'node:B', 'link:P2']);
}

console.log('\n--- a rotated pump glyph, and the primary is never cut ---');
{
	const pump = (ux, uy) => ({ kind: 'link', id: 'PU', type: 'pump', rank: 1, quad: { cx: 0, cy: 0, hw: 10, hh: 5, ux, uy } });
	same('a dot on the end of a horizontal pump glyph', pick([pump(1, 0), dot('A', 8, 0)], 6, 0), ['node:A', 'link:PU']);
	same('...but not beside it, where its axis-aligned box would claim it (the glyph turned 90 degrees)', pick([pump(0, 1), dot('A', 8, 0)], 6, 0), []);
	same('...and on its turned end', pick([pump(0, 1), dot('A', 0, 8)], 0, 6), ['node:A', 'link:PU']);
	const pile = [dot('P', 4, 0)];
	for (let i = 1; i <= 8; i++) { pile.push(dot('Z' + i, 0, 0)); }
	const got = pick(pile, 3, 0);
	same('a pile past six keeps the symbol nearest the press first', got[0], 'node:P');
	same('...and stops at six', got.length, 6);
}

console.log('\n--- a press beside the ink is the plain click\'s ---');
same('a dot 10 px away is not under a 6 px mouse pickbox', pick([dot('A', 0, 0, 3), dot('B', 0, 0, 3)], 10, 0, { reach: 6 }), []);
same('...nor under a 24 px finger: the point is on no ink, so the plain click decides', pick([dot('A', 0, 0, 3), dot('B', 0, 0, 3)], 10, 0, { reach: 24 }), []);

console.log('\n--- a symbol hidden entirely under others joins (round 6) ---');
{
	const pump = (id, ox, oy) => ({ kind: 'link', id, type: 'pump', rank: 1,
		quad: { cx: ox + 10, cy: oy + 10, hw: 10, hh: 6, ux: 1, uy: 0 },
		parts: [{ circle: { x: ox + 8, y: oy + 10, r: 6 } }, { poly: [{ x: ox + 8, y: oy + 4 }, { x: ox + 20, y: oy + 4 }, { x: ox + 20, y: oy + 10 }, { x: ox + 8, y: oy + 10 }] }] });
	same('a small junction wholly under a bigger one: a press anywhere on the big one lists both',
		pick([dot('Small', 2, 0, 3), dot('Big', 0, 0, 10)], -8, 0), ['node:Big', 'node:Small']);
	same('...but a small junction painted OVER the big one (later in the list) is visible, not hidden: no box', pick([dot('Big', 0, 0, 10), dot('Small', 2, 0, 3)], -8, 0), []);
	same('...a press clear of the big one: no box', pick([dot('Small', 2, 0, 3), dot('Big', 0, 0, 10)], 20, 0), []);
	same('a junction sticking out of the bigger one is not hidden: a press on the big one only is no box',
		pick([dot('Small', 9, 0, 3), dot('Big', 0, 0, 10)], -8, 0), []);
	same('two coincident junctions under a tank: pressed on the tank away from them, all three',
		pick([dot('A', 0, 0), dot('B', 0, 0), box('node', 'T', -20, -20, 20, 20, 0)], 15, 15), ['node:T', 'node:A', 'node:B']);
	same('a junction on a pump is painted over it, never hidden by it: pressed on the pump\'s tail, the pump alone, no box',
		pick([pump('PU', 0, 0), dot('J', 8, 10, 3)], 17, 7), []);
	same('a pump wholly under a junction is hidden: a press on the junction lists both, the junction first',
		pick([pump('PU', 0, 0), dot('Big', 10, 10, 14)], 22, 10), ['node:Big', 'link:PU']);
	same('a junction covered by two others together (neither alone): a press on either lists it',
		pick([dot('Mid', 0, 0, 2), dot('L', -3, 0, 5), dot('R', 3, 0, 5)], -7, 0), ['node:L', 'node:Mid']);
	same('a Text over a junction does not hide it, and a junction under a Text is not hidden: no box',
		pick([box('label', 'X', -20, -20, 20, 20, 2), dot('A', 0, 0)], 15, 15), []);
	same('a buried pipe under a hidden pair joins: pressed on the cover',
		pick([dot('Small', 2, 0, 3), dot('Big', 0, 0, 10), { kind: 'link', id: 'P2', type: 'pipe', rank: 1, soft: true, circle: { x: 2, y: 0, r: 0.5 } }], -8, 0), ['node:Big', 'node:Small', 'link:P2']);
	same('a hidden symbol alone with a hider is the box even when the press is on only the hider\'s rim',
		pick([dot('Small', 0, 0, 3), dot('Big', 0, 0, 10)], 10, 0), ['node:Big', 'node:Small']);
}

console.log(fails ? '\nFAILED: ' + fails : '\nALL PASS');
process.exit(fails ? 1 : 0);
