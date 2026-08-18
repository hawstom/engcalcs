// The draggable property box (ROADMAP Task 344). Run with:
//   node dev/lpn-spike/popup-drag-harness.js
//
// Tom, 2026-08-15: "EPANET has an element properties box. But it is draggable... Our UX suffers
// because our properties box is not draggable."
//
// TWO THINGS HERE CAN BE TESTED WITHOUT A BROWSER, and they are the two that would be wrong
// silently. The drag gesture itself is browser behaviour and is not simulated.
//
//   1. clampPanel() -- the arithmetic that keeps the box on screen. It is shared by OPENING the box
//      at a point on the map and by DRAGGING it, which is the whole reason it exists as a function:
//      two copies drift, and the symptom is a box that one route can park half off-screen after the
//      other route has just clamped it. A phone in landscape is the case that finds it.
//   2. The WIRING rules that make a drag safe to add to a panel full of controls -- the grab
//      surface is the popup itself and never a child, the position is remembered as the pointer
//      moves rather than on release, and the pointer is captured. Each is one line, each is
//      invisible when wrong until someone drags fast or on a touch screen.

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

function extract(name) {
	const re = new RegExp('(?:async )?function ' + name + '\\s*\\(');
	const at = src.search(re);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return src.slice(at, end);
}

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// The margin comes out of the file for the same reason every other constant in these harnesses
// does: a retune has to move the assertions with it rather than strand them.
const EDGE = +(src.match(/var POPUP_EDGE = (\d+);/) || [])[1];
report(EDGE > 0, 'the viewport margin is read out of the file', String(EDGE));
eval(`var POPUP_EDGE = ${EDGE};\n` + extract('clampPanel'));

console.log('\n-- clampPanel: a box that fits is left alone --');
{
	const at = clampPanel(100, 80, 200, 300, 1000, 800);
	report(at.left === 100 && at.top === 80, 'a box well inside the viewport does not move', JSON.stringify(at));
}

console.log('\n-- ...and one that does not fit is pulled back by its far edge --');
{
	const at = clampPanel(950, 700, 200, 300, 1000, 800);
	report(at.left === 1000 - 200 - EDGE, 'the right edge lands one margin inside', String(at.left));
	report(at.top === 800 - 300 - EDGE, 'and the bottom edge likewise', String(at.top));
	// The near edges are clamped too, which is the case a drag hits first: a user hauls the box
	// left past the window and lets go.
	const near = clampPanel(-40, -40, 200, 300, 1000, 800);
	report(near.left === EDGE && near.top === EDGE, 'dragging past the top-left stops at the margin', JSON.stringify(near));
}

console.log('\n-- the case that matters on a phone: a box TALLER than the viewport --');
{
	// The far-edge clamp wants a negative top here and the near-edge clamp overrules it. Getting
	// this backwards puts the box's TITLE off the top of the screen, where neither the ID field nor
	// the close button can be reached -- and a box you cannot close is the worst outcome available.
	const at = clampPanel(10, 10, 200, 900, 400, 700);
	report(at.top === EDGE, 'the top stays on screen rather than the bottom', JSON.stringify(at));
	report(at.left === 10, '...while the width, which does fit, is left where it was', JSON.stringify(at));
	// Same rule on the other axis, with a box genuinely wider than the window.
	const wide = clampPanel(10, 10, 500, 100, 400, 700);
	report(wide.left === EDGE, 'a box wider than the window keeps its LEFT edge on screen', JSON.stringify(wide));
	// .lpn-popover's own max-height/max-width keep such a box from actually being that big, but the
	// arithmetic must not depend on that -- the CSS is one stylesheet edit away from changing.
	report(/max-height: calc\(100vh - 8px\)/.test(fs.readFileSync(path.join(__dirname, '../../css/engcalcs.css'), 'utf8')),
		'and the stylesheet still caps the box to the viewport as a second line of defence');
}

console.log('\n-- both placement routes go through it --');
{
	report(/clampPanel\(/.test(extract('openPopupAt')), 'opening the box at a point on the map clamps');
	// The drag lives in makePanelDraggable() since 2026-08-18: the Find panel is a standing box too
	// (Tom: "Like the properties box, we want it to be draggable and have an X to close"), and two
	// copies of a drag would be two chances for one of them to escape the window.
	report(/clampPanel\(/.test(extract('makePanelDraggable')), 'and so does the drag');
}

console.log('\n-- the wiring rules that keep a drag out of the controls --');
{
	const drag = extract('makePanelDraggable'), wire = extract('wirePopup');
	// A control is always a CHILD of the popup, so testing identity is what makes this safe to add
	// to a panel of inputs without re-wiring any of them.
	report(/if \(e\.target !== popup\) \{ return; \}/.test(drag),
		'a drag starts only on the chrome, never on a child control');
	report(/setPointerCapture/.test(drag) && /releasePointerCapture/.test(drag),
		'the pointer is captured and released, so a fast drag does not escape the box');
	report(/pointercancel/.test(drag), 'and a cancelled pointer ends the drag rather than sticking it');
	// Remembered during the move, not at the end: a drag interrupted by pointercancel still leaves
	// the box where the user can see it. The shared function hands the position to its caller, and
	// each box decides what to remember it in.
	const move = drag.slice(drag.indexOf("'pointermove'"));
	report(/onMove\(at\);/.test(move.slice(0, move.indexOf('function endDrag'))),
		'the remembered position is written as it moves, not on release');
	report(/makePanelDraggable\(popup, function \(at\) \{ popupUserPos = at; \}\);/.test(wire),
		'...and the property popup remembers it in popupUserPos');
	report(/makePanelDraggable\(popup, function \(pos\) \{ findUserPos = pos; \}\);/.test(extract('wireFindPopup')),
		'...and the Find box in its own, so the two cannot move each other');
	report(/popupUserPos = null;/.test(wire), 'double-clicking the chrome sends the box home');
	report(/if \(popupUserPos\) \{ sx = popupUserPos\.left; sy = popupUserPos\.top; \}/.test(extract('openPopupAt')),
		'and once moved, the next element opens the box where the user left it');
}

console.log(`\n${checks - failures}/${checks} passed`);
process.exit(failures ? 1 : 0);
