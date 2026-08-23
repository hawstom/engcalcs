// THE LABELS PANEL'S COLUMN HEADINGS SIT OVER THEIR CONTROLS -- ROADMAP Task 435. Run with:
//   node dev/lpn-spike/label-columns-harness.js
//
// WHY THIS EXISTS. Tom reported the headings "too far right" twice, and the second report came
// after a fix. Both causes were arithmetic that nobody could see by reading either file alone:
//
//   1. an <input> is content-box by default, so a declared 3.5em rendered as 3.5em PLUS padding and
//      border, and the flexible name cell at the left absorbed the whole difference;
//   2. the heading row is drawn at `font-size: .85em` while a control inherits 1rem, so the SAME
//      declared `em` was two different lengths.
//
// Both are the same shape: the heading row and the field row are built by two different functions,
// in two different files (inline style in js/looped-network.js, `!important` widths in
// css/engcalcs.css), and NOTHING compared them. That is what this harness does. It builds the real
// lists through rebuildLabelsFields() and then computes, for every row, where each trailing column
// starts as an offset from the row's RIGHT edge -- the one quantity alignment actually is.
//
// It is a small layout model rather than a browser, and it is worth being explicit about what it
// therefore holds constant: every row is the same width (they are block-level siblings), the flex
// `gap` is the same on every row, and no column shrinks. Each of those is ASSERTED below rather
// than assumed, because a stub that quietly held one of them would make this whole file pass for
// the wrong reason -- dev/testing-notes.md's first lesson.

const fs = require('fs');
const path = require('path');
const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const ROOT = path.resolve(__dirname, '..', '..');

const L = loadLoopedNetwork(
	"\t\trebuild: rebuildLabelsFields,\n" +
	"\t\tcolW: function () { return LPN_LABEL_COL_W; },\n" +
	"\t\taffixW: function () { return LPN_LABEL_AFFIX_W; },\n" +
	"\t\tcolGap: function () { return LPN_LABEL_COL_GAP; } "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');

// ---- 0. the declared lengths ------------------------------------------------------------------
// rem, not em: a rem is the same absolute length whatever font-size the row carries, which is what
// makes the heading row's .85em harmless. An `em` here would re-create cause (2) above in silence.
console.log('\n--- the column widths are absolute lengths, not relative ones ---');
{
	const w = [L.colW(), L.affixW()];
	w.forEach((v) => ok('a declared width is in rem: ' + v, /^[0-9.]+rem$/.test(v)));
	ok('the gap between the numeric columns is a fixed px: ' + L.colGap(),
		/^[0-9.]+px$/.test(L.colGap()));
	// The two containers are anchored so nothing inside them can inherit a surprise size.
	ok('both field lists are anchored at 1rem in the stylesheet',
		/#lpn_labels_node_fields,\s*\n?#lpn_labels_link_fields \{ font-size: 1rem; \}/.test(css));
}

// ---- 1. what the stylesheet says a heading cell is --------------------------------------------
// The inline widths are overridden by `!important` rules keyed on the COLUMN INDEX. Read them out
// of the stylesheet rather than retyping them, so this harness cannot disagree with the shipped CSS.
function importantWidths() {
	const out = {};
	const re = /((?:#lpn_labels_(?:node|link)_fields > div > span:nth-child\(\d\),?\s*)+)\{\s*width:\s*([0-9.]+rem)\s*!important;\s*\}/g;
	let m;
	while ((m = re.exec(css))) {
		[...m[1].matchAll(/nth-child\((\d)\)/g)].forEach((c) => { out[+c[1]] = m[2]; });
	}
	return out;
}
const IMPORTANT = importantWidths();
console.log('\n--- the stylesheet claims four columns, by index ---');
ok('columns 2-5 all carry an !important width',
	[2, 3, 4, 5].every((i) => IMPORTANT[i]),
	JSON.stringify(IMPORTANT));

// ---- 2. build the real lists -------------------------------------------------------------------
L.rebuild();

const REM = 16;
function px(v) {
	if (!v) { return 0; }
	const n = parseFloat(v);
	return /rem$/.test(v) ? n * REM : n;
}
// The width a browser would give this child: the `!important` rule when it matches (a SPAN in one
// of the four column positions), otherwise the inline declaration.
function childWidth(child, idx) {
	const ruled = child.tagName === 'SPAN' && IMPORTANT[idx];
	return px(ruled || child.style.width);
}
// Offsets of every column edge measured from the row's RIGHT edge, right to left. Alignment IS this
// list: two rows line up exactly when their lists are equal.
const GAP = 6;   // the rows' own `gap: 6px`, asserted equal for every row below
function columnEdges(row) {
	const kids = row.children;
	const edges = [];
	let x = 0;
	for (let i = kids.length - 1; i >= 1; i--) {
		const w = childWidth(kids[i], i + 1);
		edges.unshift({ right: x, left: x + w });
		x += w + px(kids[i].style.marginLeft) + GAP;
	}
	return edges;
}
function sameEdges(a, b) {
	return a.length === b.length &&
		a.every((e, i) => e.left === b[i].left && e.right === b[i].right);
}
function describe(edges) {
	return edges.map((e) => e.right + '–' + e.left).join(' | ');
}

['node', 'link'].forEach(function (group) {
	const box = byId['lpn_labels_' + group + '_fields'];
	const rows = box.children;
	console.log('\n--- the ' + group + ' list: ' + rows.length + ' rows, the first being the headings ---');
	ok('the list has a heading row and at least one field row', rows.length >= 2);

	// THE THINGS THE MODEL HOLDS CONSTANT, ASSERTED. Every one of these is a way two rows could
	// disagree without any width being wrong.
	rows.forEach(function (r, i) {
		ok('row ' + i + ' is a flex row with the same 6px gap', r.style.display === 'flex' && r.style.gap === '6px',
			r.style.display + ' / ' + r.style.gap);
		ok('...with the same number of children as the heading row',
			r.children.length === rows[0].children.length,
			r.children.length + ' vs ' + rows[0].children.length);
		ok('...whose first child takes the slack, so the columns hang off the RIGHT edge',
			r.children[0].style.flex === '1 1 auto', r.children[0].style.flex);
		r.children.slice(1).forEach(function (c, j) {
			ok('...and column ' + (j + 1) + ' cannot shrink or grow', c.style.flex === '0 0 auto', c.style.flex);
		});
	});
	// AND NOTHING IN A ROW MAY SHRINK EVEN WHEN THE PANEL IS DRAGGED NARROW: the inputs carry no
	// inline flex-shrink, so the stylesheet has to say it. Without it a narrow panel squeezes the
	// boxes and leaves every heading standing to their right -- Task 435's defect by another route.
	ok('the stylesheet pins the inputs against shrinking too',
		/#lpn_labels_node_fields > div > input,\s*\n?#lpn_labels_link_fields > div > input \{ flex-shrink: 0; \}/.test(css));

	// **THE ASSERTION THE WHOLE FILE IS FOR.**
	const want = columnEdges(rows[0]);
	console.log('  headings at ' + describe(want) + ' px from the right edge');
	for (let i = 1; i < rows.length; i++) {
		const got = columnEdges(rows[i]);
		const name = (rows[i].children[0].textContent || '(row ' + i + ')').trim();
		ok('"' + name + '" sits under the headings exactly', sameEdges(want, got),
			sameEdges(want, got) ? '' : describe(got));
	}
	// **AND THE HEADING SHARES ITS COLUMN'S ALIGNMENT.** Getting the widths right still leaves a
	// heading that LOOKS displaced if it is centred over a value that is not: the box's own ruling
	// (css/engcalcs.css) is that a spinner centres its digit and a text box keeps its natural start
	// alignment, so the affix headings start and the two numeric ones centre.
	{
		const head = rows[0].children;
		ok('the Before/After headings start where their text boxes start',
			head[1].style.textAlign === 'start' && head[2].style.textAlign === 'start',
			head[1].style.textAlign + ',' + head[2].style.textAlign);
		ok('...and the two spinner headings are centred, like the digit under them',
			head[3].style.textAlign === 'center' && head[4].style.textAlign === 'center',
			head[3].style.textAlign + ',' + head[4].style.textAlign);
		ok('...with the spinners themselves centred by the stylesheet',
			/#lpn_settings_box \.lpn-set-secbody input\.ec-spin \{ text-align: center; \}/.test(css));
		const affix = rows[1].children[1];
		ok('...and the text boxes carrying no alignment of their own',
			!affix.style.textAlign, affix.style.textAlign || '(none)');
	}
	// The ID row is the one named in the task: it has affix boxes but NO spinners, so its last two
	// columns are spacers. A spacer that carried the width and not the margin is how the columns
	// came apart the first time, and it is checked above by the same equality -- this only makes
	// sure such a row is actually in the list being checked.
	if (group === 'node') {
		const idRow = rows.filter((r) => /ID/.test(r.children[0].textContent || ''))[0];
		ok('the node ID row is present and reserves its two numeric columns with spacers',
			!!idRow && idRow.children[3].tagName === 'SPAN' && idRow.children[4].tagName === 'SPAN',
			idRow ? idRow.children.map((c) => c.tagName).join(',') : 'missing');
	}
});

console.log(fails === 0 ? '\nAll label-column checks passed.' : '\n' + fails + ' FAILED');
process.exit(fails ? 1 : 0);
