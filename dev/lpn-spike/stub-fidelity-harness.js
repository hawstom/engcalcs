// The DOM STUB's own fidelity -- ROADMAP Task 403. Run with:
//   node dev/lpn-spike/stub-fidelity-harness.js
//
// WHY A HARNESS FOR THE TEST SCAFFOLDING. `dev/lpn-spike/lpn-dom-stub.js` is what 50-odd harnesses
// measure through, so a place where it does NOT behave like a DOM is not a gap in one test -- it is
// a wrong answer delivered confidently to all of them. This one cost three rounds of "the harness
// passes and the browser does nothing", and the fix was attempted and reverted twice.
//
// The four properties below are the ones that were wrong, each with the shape of the failure:
//
//   1. **Text width follows FONT SIZE.** A real label's font size is a WORLD quantity
//      (`textSize / state.s`), so its world width changes with every zoom. A stub returning
//      characters x a constant holds that at 1 and removes the entire relationship every fitting,
//      shedding and collision rule is about -- while looking perfectly reasonable.
//   2. **The style OBJECT outranks the style ATTRIBUTE, which outranks a bare `font-size`.** Three
//      write paths reach one declaration: the attribute string set when the element is built,
//      `.style.fontSize` written on every refresh after, and the presentation attribute. Read the
//      wrong one and a label is measured at the size it had before the last refresh.
//   3. **Assigning textContent REPLACES the children; reading it INCLUDES them.** As a plain data
//      field it did neither, so a label switched from three rows back to one kept its old tspans
//      and was measured on text nobody could see.
//   4. **firstChild sees the text node.** Without it the standard
//      `while (firstChild) removeChild(firstChild)` teardown clears nothing at all -- and with it,
//      removeChild must actually clear the text, or that same loop never ends.

const { mkEl } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function text(words) { const t = mkEl('text'); t.textContent = words; return t; }

// ---- 1. width follows font size -----------------------------------------------------------------
{
	console.log('\n--- width follows font size ---');
	const base = text('NORTH STREET');
	const wBase = base.getBBox().width;
	const big = text('NORTH STREET');
	big.style.fontSize = '22px';
	const small = text('NORTH STREET');
	small.style.fontSize = '5.5px';
	ok('doubling the font size doubles the width',
		Math.abs(big.getBBox().width - 2 * wBase) < 1e-9, wBase.toFixed(2) + ' -> ' + big.getBBox().width.toFixed(2));
	ok('halving it halves the width',
		Math.abs(small.getBBox().width - wBase / 2) < 1e-9, small.getBBox().width.toFixed(2));
	ok('and width still rises with CHARACTERS at one size',
		text('NORTH STREET AND THEN SOME').getBBox().width > wBase);
	// The calibration promise: a label at the shipped default measures exactly what it did before
	// width followed size, so nothing a harness had tuned against the old stub has moved.
	ok('at the shipped default text size, the old number is unchanged',
		Math.abs(wBase - 'NORTH STREET'.length * 6) < 1e-9, wBase.toFixed(2));
}

// ---- 2. which write path wins --------------------------------------------------------------------
{
	console.log('\n--- three write paths, one declaration ---');
	const t = text('ABCD');
	t.setAttribute('style', 'font-size:22px');
	ok('the style ATTRIBUTE is read', Math.abs(t.getBBox().width - 4 * 6 * 2) < 1e-9, t.getBBox().width.toFixed(2));
	t.style.fontSize = '5.5px';
	ok('...and the style OBJECT beats it, being written later',
		Math.abs(t.getBBox().width - 4 * 6 * 0.5) < 1e-9, t.getBBox().width.toFixed(2));

	const p = text('ABCD');
	p.setAttribute('font-size', 22);
	ok('a bare font-size ATTRIBUTE is read when nothing else says',
		Math.abs(p.getBBox().width - 4 * 6 * 2) < 1e-9, p.getBBox().width.toFixed(2));
	p.setAttribute('style', 'font-size:5.5px');
	ok('...and any CSS declaration outranks it',
		Math.abs(p.getBBox().width - 4 * 6 * 0.5) < 1e-9, p.getBBox().width.toFixed(2));

	// A tspan carries no size of its own and inherits, exactly as in a browser -- otherwise every
	// row of a multi-line label is measured at the base size whatever the label is drawn at.
	const parent = mkEl('text');
	parent.style.fontSize = '22px';
	const row = mkEl('tspan');
	row.setAttribute('x', 0);
	row.textContent = 'ABCD';
	parent.appendChild(row);
	ok('a tspan inherits its <text>\'s size',
		Math.abs(row.getComputedTextLength() - 4 * 6 * 2) < 1e-9, row.getComputedTextLength().toFixed(2));
}

// ---- 3. textContent is an accessor ---------------------------------------------------------------
{
	console.log('\n--- textContent replaces and includes ---');
	const t = mkEl('text');
	['one', 'two', 'three'].forEach(function (w) {
		const s = mkEl('tspan'); s.setAttribute('x', 0); s.textContent = w; t.appendChild(s);
	});
	ok('reading includes the descendants', t.textContent === 'onetwothree', t.textContent);
	t.textContent = 'flat';
	ok('assigning replaces every child', t.children.length === 0, String(t.children.length));
	ok('...and reads back as itself', t.textContent === 'flat', t.textContent);

	// The shape the property popups build: a label's own words plus a value in a span.
	const lab = mkEl('label');
	lab.textContent = 'Y ';
	const span = mkEl('span'); span.textContent = '-5200.00';
	lab.appendChild(span);
	ok('own text comes first, then the descendants', lab.textContent === 'Y -5200.00', lab.textContent);
}

// ---- 4. firstChild, and the teardown that uses it -------------------------------------------------
{
	console.log('\n--- the standard teardown ---');
	const t = mkEl('text');
	t.textContent = 'words';
	ok('firstChild sees the text node', !!t.firstChild && t.firstChild.nodeType === 3,
		t.firstChild && t.firstChild.nodeType);
	let guard = 0;
	while (t.firstChild && guard++ < 100) { t.removeChild(t.firstChild); }
	ok('the standard while-loop terminates', guard < 100, 'iterations ' + guard);
	ok('...and really clears the text', t.textContent === '', JSON.stringify(t.textContent));
	ok('an empty element has no firstChild', t.firstChild === null);
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);
