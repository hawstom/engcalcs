// R-204: the Settings box's INITIAL width and index-pane width, on PC. Run with:
//   node dev/lpn-spike/setbox-initial-width-harness.js
//
// Tom, 2026-09-24: "on PC we can make the index pane 10% wider. The main pane could be 70% of what
// it now is ... It has a hard minimum that seems perfectly acceptable to me, and maybe we could use
// that as the initial default." So: index := old index x 1.1; content's INITIAL width :=
// max(content's existing hard minimum, 0.7 x content's old initial width) -- here 70% wins, since it
// measures larger than the floor.
//
// WHY THIS READS THE STYLESHEET RATHER THAN RE-DOING THE ARITHMETIC ITSELF. The box model that
// turns an outer box width into a content-pane width is not addable by hand -- CLAUDE.md's own
// nearby comment says so, and dev/browser-pass/specs/visibility.js once caught a 3px error in this
// exact box from doing it anyway. So the numbers below were taken from a REAL Chromium layout
// (dev/lpn-spike/setbox-initial-width-probe.js, run once and recorded here) and this harness checks
// the stylesheet's literals against that measurement's arithmetic, not the other way round: if
// somebody changes 6.6rem or 34rem again without updating the numbers this rule depends on, this is
// what goes red.
//
// Measured in real Chromium at 1600x1000 (dev/lpn-spike/setbox-initial-width-probe.js):
//   old index = 105.59375 px (6.6rem);  old content initial = 410.40625 px (25.65rem)
//   content's hard minimum (box squeezed to its own 25rem floor, OLD index) = 266.40625 px
//   0.7 x 410.40625 = 287.284375 px, which is LARGER than the 266.40625 px floor -- 70% wins.
//   new index (x1.1) = 116.153125 px; new box initial = new index + 28px overhead + 287.284375
//     = 431.4375 px = 26.965rem, where the 28px overhead (16px padding + 2px border + the 10px the
//     divider's negative margins reduce two gaps to) is read off .lpn-setbox-panes/-divider below,
//     not assumed.

'use strict';

const fs = require('fs');
const path = require('path');
const CSS_PATH = path.join(__dirname, '..', '..', 'css', 'engcalcs.css');
const css = fs.readFileSync(CSS_PATH, 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// Read the PC (non-media-queried) rules only -- strip every @media/@supports block first, so a
// phone or a print override cannot be mistaken for the base rule this checks.
function stripConditionalBlocks(text) {
	let out = '', i = 0;
	while (i < text.length) {
		const at = text.indexOf('@', i);
		if (at < 0) { out += text.slice(i); break; }
		out += text.slice(i, at);
		const open = text.indexOf('{', at);
		if (open < 0) { break; }
		let depth = 0, j = open;
		for (; j < text.length; j++) {
			if (text[j] === '{') { depth++; }
			else if (text[j] === '}') { depth--; if (depth === 0) { break; } }
		}
		i = j + 1;
	}
	return out;
}
const pcCss = stripConditionalBlocks(css.replace(/\/\*[\s\S]*?\*\//g, ''));

function ruleBody(selector) {
	const re = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}');
	const m = pcCss.match(re);
	return m ? m[1] : null;
}

console.log('\n-- the index pane is 10% wider than it was (6.6rem) --');
{
	const body = ruleBody('.lpn-setbox-index');
	ok('.lpn-setbox-index exists as a base (PC) rule', !!body);
	const m = body && body.match(/flex:\s*0\s*0\s*([0-9.]+)rem/);
	ok('...and states an explicit flex-basis in rem', !!m, body);
	const rem = m && parseFloat(m[1]);
	ok('...equal to 6.6 x 1.1 = 7.26rem', rem === 7.26, rem);
}

console.log('\n-- the box\'s initial width is derived from that new index and the measured content floor --');
{
	const body = ruleBody('.lpn-setbox');
	ok('.lpn-setbox exists as a base (PC) rule', !!body);
	const m = body && body.match(/width:\s*min\(([0-9.]+)rem,\s*94vw\)/);
	ok('...and states an explicit initial width in rem, capped at 94vw', !!m, body);
	const boxRem = m && parseFloat(m[1]);

	// The fixed overhead between the two panes, read off the rules that create it rather than
	// assumed: 16px padding (the box's own inline padding: 40px 8px 8px) + 2px border (1px solid,
	// both sides) + the divider's own 6px flex-basis, minus what its -8px/-8px margins take back
	// -- which the comment above .lpn-setbox-panes proves collapses two 10px gaps to one.
	const dividerBody = ruleBody('.lpn-setbox-divider');
	const flexM = dividerBody && dividerBody.match(/flex:\s*0\s*0\s*(\d+)px/);
	const marginM = dividerBody && dividerBody.match(/margin:\s*0\s*(-?\d+)px/);
	const panesBody = ruleBody('.lpn-setbox-panes');
	const gapM = panesBody && panesBody.match(/gap:\s*(\d+)px/);
	ok('the divider and the panes gap are still what the arithmetic below assumes',
		!!flexM && !!marginM && !!gapM &&
			flexM[1] === '6' && marginM[1] === '-8' && gapM[1] === '10',
		JSON.stringify({ flexM, marginM, gapM }));
	// gap(10) + margin_left(-8) + divider(6) + margin_right(-8) + gap(10) = 10, confirming the
	// "2 + 6 + 2 = 10" the stylesheet's own comment states.
	const overheadPx = 16 + 2 + 10;
	ok('...giving 28px of fixed overhead (16 padding + 2 border + 10 pane gap)', overheadPx === 28);

	const oldIndexPx = 105.59375, oldContentPx = 410.40625, floorContentPx = 266.40625;
	const newIndexPx = oldIndexPx * 1.1;
	const seventyPct = 0.7 * oldContentPx;
	ok('70% of the old content width beats its hard minimum, so 70% is what ships',
		seventyPct > floorContentPx, seventyPct + ' vs floor ' + floorContentPx);
	const expectedBoxPx = newIndexPx + overheadPx + seventyPct;
	const expectedBoxRem = expectedBoxPx / 16;
	ok('...and the box\'s new initial width matches that arithmetic to a hundredth of a rem',
		boxRem !== null && Math.abs(boxRem - expectedBoxRem) < 0.005,
		boxRem + ' vs expected ' + expectedBoxRem.toFixed(3));
}

console.log('\n-- the box\'s hard minimum (25rem) and the phone override are both untouched --');
{
	const body = ruleBody('.lpn-setbox');
	ok('min-width is still the existing 25rem floor', /min-width:\s*min\(25rem,\s*94vw\)/.test(body || ''), body);

	// The phone rule derives its OWN figure from its OWN 4.5rem baseline (Task 527's transfer
	// arithmetic) and must still be there, untouched by anything above.
	const phoneBlock = (css.match(/@media \(max-width: 640px\) \{[\s\S]*/) || [''])[0];
	ok('the phone index override still starts from 3.6rem (its own, unrelated figure)',
		/html:has\(#lpn_canvas\) \.lpn-setbox-index \{ flex-basis: calc\(3\.6rem \+ 20% - 2px\); \}/.test(phoneBlock));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
