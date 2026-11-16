// Headless check of Geom.pickSymbols(), the rule for when one click could mean more than one
// symbol (js/lpn-geom.js). Pure: drawn extents in screen pixels in, an ordered list out.
//
//   node dev/lpn-spike/pick-symbols-harness.js
//
// Tom, 2026-11-16: the box opens only where a person can see it coming (the press is on a symbol
// whose drawn extent overlaps another's), never lists a line (a pipe, an open Shape), and lists at
// most six rows, the symbol nearest the press and those coincident with it first.
// What can be wrong: a box for two separate dots that merely lie inside a finger's reach; a pipe or
// an open polyline in the list; more than six rows; the order; a box on the far end of a long Text
// or on a pump clear of the reservoir it overlaps.

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
same('...pressed on the other: that one first', pick([dot('A', 0, 0), dot('B', 4, 0)], 7, 0), ['node:B', 'node:A']);
same('two dots that only touch (centres 8 apart): no box', pick([dot('A', 0, 0), dot('B', 8, 0)], 0, 0), []);
same('two dots that graze, overlapping by 2 px of an 8 px width: no box', pick([dot('A', 0, 0), dot('B', 6, 0)], 0, 0), []);
same('the reservoir and the pump where they overlap',
	pick([box('node', 'Lake', 0, 0, 30, 20, 0), box('link', 'PU', 10, 5, 45, 15, 1)], 20, 10), ['node:Lake', 'link:PU']);
same('a pump that only touches the reservoir\'s edge: no box',
	pick([box('node', 'Lake', 0, 0, 30, 20, 0), box('link', 'PU', 25, 5, 60, 15, 1)], 28, 10), []);
same('coincident dots in natural id order (J2 before J10)', pick([dot('J10', 0, 0), dot('J2', 0, 0), dot('J1', 0, 0)], 0, 0), ['node:J1', 'node:J2', 'node:J10']);
same('a Text over coincident dots is one more row, after the dots',
	pick([box('label', 'X', -10, -5, 20, 5, 2), dot('A', 0, 0), dot('B', 0, 0)], 0, 0), ['node:A', 'node:B', 'label:X']);
same('a point Shape on a dot', pick([dot('A', 0, 0), shape('S1', [{ x: 0, y: 0 }])], 0, 0), ['node:A', 'shape:S1']);
same('a closed Shape whose outline passes through a dot',
	pick([dot('A', 0, 0), shape('S3', [{ x: -20, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 30 }], true)], 0, 0), ['node:A', 'shape:S3']);

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

console.log('\n--- the pickbox reach is the caller\'s ---');
same('a dot 10 px away is not under a 6 px mouse pickbox', pick([dot('A', 0, 0, 3), dot('B', 0, 0, 3)], 10, 0, { reach: 6 }), []);
same('...but is under a 24 px finger', pick([dot('A', 0, 0, 3), dot('B', 0, 0, 3)], 10, 0, { reach: 24 }), ['node:A', 'node:B']);

console.log(fails ? '\nFAILED: ' + fails : '\nALL PASS');
process.exit(fails ? 1 : 0);
