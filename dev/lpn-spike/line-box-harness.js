// ONE BOX PER LINE, not one box for the stack -- ROADMAP Task 406. Run with:
//   node dev/lpn-spike/line-box-harness.js
//
// js/lpn-collide.js is values-in/values-out, so this needs no browser and no DOM stub.
//
// WHY THIS EXISTS. A stacked label is a STAIRCASE: "J12" over "48.3 psi" over "0.5 L/s" have three
// different widths, and the block box around them claims the empty ground beside every short row --
// which is precisely where the next label would have fitted. The defect is invisible: the drawing
// simply comes out emptier than the conflict warranted, and no error is raised by anything.
//
// The three properties that carry the change, and what each protects:
//
//   1. **A label with no per-line widths behaves EXACTLY as before.** Text objects, single-line
//      labels, and every caller that has not measured its rows must be untouched -- otherwise this
//      is a rewrite of label placement rather than a refinement of it.
//   2. **The staircase leans the right way.** Rows are anchored on the same edge the block is: the
//      left edge for a label right of its anchor, the right edge for one to its left. Backwards,
//      the boxes still look plausible and are wrong by their own width difference.
//   3. **The pass RESERVES the staircase, not the block.** Committing the block would leave the
//      whole change cosmetic -- the scoring would see the true shape and the reservation would not.

const { lpnCollide: C } = require('../../js/lpn-collide.js');

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? 'PASS  ' : 'FAIL  ') + label + (detail === undefined ? '' : '   ' + detail));
}
function near(a, b) { return Math.abs(a - b) < 1e-9; }
// A label as the pass takes one: three rows, 30 / 12 / 6 wide, 12 tall in total.
function stacked(lines) {
	return { id: 'N1', anchor: { x: 0, y: 0 }, home: { x: 20, y: 0 },
		w: 30, h: 12, yOff: -6, lines: lines };
}
const RIGHT = { x: 20, y: 0 };   // an endpoint to the RIGHT of the anchor
const LEFT = { x: -20, y: 0 };   // and one to the left

// ---- 1. no per-line widths: nothing changes ----------------------------------------------------
{
	console.log('\n--- a label with no lines is one box, exactly as before ---');
	const plain = stacked(undefined);
	const one = C.labelLineBoxes(plain, RIGHT), whole = C.labelBoxAtEnd(plain, RIGHT);
	ok(one.length === 1, 'one box', String(one.length));
	ok(near(one[0].cx, whole.cx) && near(one[0].cy, whole.cy) &&
		near(one[0].w, whole.w) && near(one[0].h, whole.h), '...and it IS the whole box');

	// A single row is the same statement: a one-line label has no staircase to describe.
	const single = C.labelLineBoxes(stacked([30]), RIGHT);
	ok(single.length === 1 && near(single[0].w, 30), 'one row is one box too', String(single.length));
}

// ---- 2. the staircase itself -------------------------------------------------------------------
{
	console.log('\n--- three rows of three widths ---');
	const lbl = stacked([30, 12, 6]);
	const rows = C.labelLineBoxes(lbl, RIGHT), whole = C.labelBoxAtEnd(lbl, RIGHT);
	ok(rows.length === 3, 'one box per row', String(rows.length));
	ok(rows.every((r, i) => near(r.w, [30, 12, 6][i])), 'each row is its OWN width',
		rows.map(r => r.w).join(','));
	ok(rows.every(r => near(r.h, 4)), 'each row is one row high', rows.map(r => r.h).join(','));
	ok(near(rows[0].cy - 2, whole.cy - 6) && near(rows[2].cy + 2, whole.cy + 6),
		'the stack spans exactly the block it replaced', rows.map(r => r.cy).join(','));
	ok(rows[0].cy < rows[1].cy && rows[1].cy < rows[2].cy, 'rows run top to bottom');

	// To the RIGHT of the anchor the text starts at the endpoint, so every row shares a LEFT edge.
	ok(rows.every(r => near(r.cx - r.w / 2, 20)), 'right of the anchor, rows share their left edge',
		rows.map(r => r.cx - r.w / 2).join(','));
	// To the LEFT the text ends at the endpoint, so every row shares a RIGHT edge.
	const lrows = C.labelLineBoxes(lbl, LEFT);
	ok(lrows.every(r => near(r.cx + r.w / 2, -20)), 'left of the anchor, rows share their right edge',
		lrows.map(r => r.cx + r.w / 2).join(','));

	// A blank row occupies no ground. Left in, it would reserve a full-height sliver at the anchor
	// edge -- a label blocked by nothing at all.
	const withBlank = C.labelLineBoxes(stacked([30, 0, 6]), RIGHT);
	ok(withBlank.length === 2, 'a blank row claims nothing', String(withBlank.length));
}

// ---- 3. the ground beside a short row is free ---------------------------------------------------
// The whole point, stated as the two answers that must differ.
{
	console.log('\n--- the ground beside a short row ---');
	const lbl = stacked([30, 6, 6]);
	// A neighbour sitting where rows 2 and 3 are NOT: past their right edge, inside the block.
	const neighbour = C.box(20 + 20, 2, 8, 4, 0, 'label', 'N2');
	const obs = { boxes: [neighbour], segments: [] };

	ok(C.boxClearOf(C.labelBoxAtEnd(lbl, RIGHT), obs, 0, 'N1') === 'blocked',
		'the BLOCK box calls that ground occupied -- the old answer');
	ok(C.boxesClearOf(C.labelLineBoxes(lbl, RIGHT), obs, 0, 'N1') === 'clear',
		'the STAIRCASE leaves it free -- the new one',
		C.boxesClearOf(C.labelLineBoxes(lbl, RIGHT), obs, 0, 'N1'));

	// And it is not merely permissive: something over the LONG row still blocks.
	const onTop = C.box(20 + 10, -4, 8, 4, 0, 'label', 'N3');
	ok(C.boxesClearOf(C.labelLineBoxes(lbl, RIGHT), { boxes: [onTop], segments: [] }, 0, 'N1') === 'blocked',
		'a neighbour on the long row still blocks');

	// The worst answer any row gives is the answer.
	const yielder = Object.assign(C.box(20 + 10, -4, 8, 4, 0, 'label', 'N4'), { yields: true });
	ok(C.boxesClearOf(C.labelLineBoxes(lbl, RIGHT), { boxes: [yielder], segments: [] }, 0, 'N1') === 'yielding',
		'a row held only by something this label outranks yields rather than blocks');
}

// ---- 4. the score sees the same shape ------------------------------------------------------------
{
	console.log('\n--- scoring ---');
	const lbl = stacked([30, 6, 6]);
	const beside = { boxes: [C.box(20 + 20, 2, 8, 4, 0, 'label', 'N2')], segments: [] };
	const plain = stacked(undefined);
	ok(C.rawScore(plain, RIGHT, beside, 100) > C.rawScore(lbl, RIGHT, beside, 100),
		'a stack scores BETTER than the block it replaced, on ground its rows do not cover',
		C.rawScore(plain, RIGHT, beside, 100).toFixed(4) + ' vs ' + C.rawScore(lbl, RIGHT, beside, 100).toFixed(4));

	// **NOT A SUM OVER ROWS.** An obstacle across the whole label must not cost three times what it
	// costs a one-line label, or the ranking starts describing the label's height.
	const across = { boxes: [C.box(20 + 15, 0, 40, 20, 0, 'label', 'N5')], segments: [] };
	ok(C.rawScore(lbl, RIGHT, across, 100) <= C.rawScore(plain, RIGHT, across, 100) + 1e-9,
		'an obstacle over every row costs no more than it costs the block',
		C.rawScore(lbl, RIGHT, across, 100).toFixed(4) + ' vs ' + C.rawScore(plain, RIGHT, across, 100).toFixed(4));
}

// ---- 5. the pass reserves the staircase ----------------------------------------------------------
{
	console.log('\n--- what the pass commits ---');
	const lbl = { id: 'N1', anchor: { x: 0, y: 0 }, home: { x: 20, y: 0 },
		sides: [{ x: 20, y: 0 }], w: 30, h: 12, yOff: -6, lines: [30, 6, 6], priority: 0 };
	const out = C.placeLabelsFirstFit([lbl], { boxes: [], segments: [] }, { pad: 0 });
	ok(out.length === 1 && !out[0].dropped, 'it places');
	ok(Array.isArray(out[0].boxes) && out[0].boxes.length === 3,
		'and reserves one box per row', out[0].boxes && out[0].boxes.length);
	ok(out[0].box && near(out[0].box.w, 30),
		'...while still returning the ONE box a reader draws and counts');

	// The reservation is what the NEXT label sees. A second label wanting the ground beside the
	// short rows must be able to have it.
	const near2 = { id: 'N2', anchor: { x: 60, y: 0 }, home: { x: 44, y: 2 },
		sides: [{ x: 44, y: 2 }], w: 8, h: 4, yOff: -2, priority: 1 };
	const both = C.placeLabelsFirstFit([lbl, near2], { boxes: [], segments: [] }, { pad: 0 });
	ok(both.every(r => !r.dropped), 'a neighbour fits in the notch the staircase leaves',
		JSON.stringify(both.map(r => r.dropped)));

	// The inputs come back as they went in -- the promise both passes make.
	ok(lbl.lines.length === 3 && lbl._reach === undefined, 'the pass scribbles on nothing');
}

console.log('\n' + (failures === 0 ? 'ALL PASS' : failures + ' FAILED') + '   (' + checks + ' checks)');
process.exit(failures === 0 ? 0 : 1);
