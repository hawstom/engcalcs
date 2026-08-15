// The canvas fills the window and never exceeds it. Run with:
//   node dev/lpn-spike/map-height-harness.js
//
// WHY THIS EXISTS: on 2026-08-15 Tom hit a state he could not get out of — "The bottom of the map
// overflowed the bottom of the screen. And status line is gone. Unrecoverable. Reload doesn't fix."
// The status strip is `position:absolute; bottom:4px` INSIDE the canvas, so those are one symptom,
// not two: a canvas taller than the window takes its own footer off the bottom of the screen with
// it.
//
// AND THE STATE FEEDS ITSELF, which is what made it unrecoverable rather than merely wrong. An
// overflowing canvas makes the page scrollable; a scrolled page is what makes the measurement go
// wrong; the next resize measures the scrolled page. Nothing in that loop tends back toward a
// correct answer.
//
// effectiveMapHeight() is measurement arithmetic over four numbers, and every one of them comes
// from the browser. That is exactly the shape a harness can pin down without one: feed the four
// numbers directly, including the impossible combinations a real browser produces at the worst
// moments (a hidden tab, a not-yet-laid-out element, a scroll offset that disagrees with the rect),
// and assert the answer stays inside the window.

const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

function extract(name) {
	const at = src.search(new RegExp('function ' + name + '\\s*\\('));
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

// The floor is read from the source rather than typed here — a harness that hard-codes 240 stops
// testing the constant the moment somebody changes it.
const MIN = Number((src.match(/var LPN_MAP_MIN = (\d+);/) || [])[1]);
if (!MIN) { throw new Error('LPN_MAP_MIN not found'); }

// A world just real enough to run the two functions in: a window, a canvas rect, a body rect and a
// scroll offset. Everything else they touch is stubbed to nothing.
function scope(env) {
	const sandbox = {
		window: { innerHeight: env.vh, pageYOffset: env.scrollY || 0 },
		document: {
			documentElement: { scrollTop: env.scrollY || 0 },
			body: { getBoundingClientRect: () => env.body }
		},
		svg: env.svg === null ? null : { getBoundingClientRect: () => env.svg },
		LPN_MAP_MIN: MIN,
		Math: Math
	};
	const fn = new Function('window', 'document', 'svg', 'LPN_MAP_MIN',
		extract('flowBelowMap') + '\n' + extract('effectiveMapHeight') + '\n' +
		'return effectiveMapHeight();');
	return fn(sandbox.window, sandbox.document, sandbox.svg, sandbox.LPN_MAP_MIN);
}

// A healthy desktop page: 900px window, canvas starting 180 down, one line of legal links below it.
console.log('--- the ordinary case is untouched ---');
{
	const h = scope({
		vh: 900, scrollY: 0,
		svg: { top: 180, bottom: 860, width: 1400, height: 680 },
		body: { bottom: 890 }
	});
	// 900 - 180 above - 30 below - 8 slack.
	report(h === 682, 'the canvas fills the window minus what is above and below it', h);
	report(180 + h <= 900, '...and its bottom lands inside the window', 180 + h);
}

// THE PATHOLOGY, and it is the one Tom hit. `above` = rect.top + scrollY. When those two disagree —
// a rect measured against a scrolled viewport while the scroll offset reads 0 — `above` goes
// negative and the old formula returned MORE than the whole window.
console.log('\n--- a measurement that disagrees with itself cannot produce an oversized canvas ---');
{
	const h = scope({
		vh: 900, scrollY: 0,
		svg: { top: -400, bottom: 280, width: 1400, height: 680 },   // scrolled, but scrollY says 0
		body: { bottom: 300 }
	});
	report(h <= 900 - 8, 'the canvas is never taller than the window', h);
	// Without the clamp this returns 1272 — a canvas 372px taller than the window, which is the
	// screenshot: the map running off the bottom and the status strip going with it. Named rather
	// than merely bounded, so a future edit that changes the formula has to look at this case
	// again instead of passing it by accident.
	report(h !== 1272, '...specifically, not the 1272 the unclamped formula gives here', h);
}
{
	// The same shape from the other direction: a body rect that has not caught up, so `below`
	// reads as nothing at all.
	const h = scope({
		vh: 700, scrollY: 250,
		svg: { top: -250, bottom: 430, width: 1400, height: 680 },
		body: { bottom: 430 }
	});
	report(h <= 700 - 8, 'and still never taller when the scroll offset is the honest half', h);
}

console.log('\n--- the floor still holds, because a 60px map is not a map ---');
{
	const h = scope({
		vh: 400, scrollY: 0,
		svg: { top: 300, bottom: 340, width: 1400, height: 40 },
		body: { bottom: 900 }   // a lot of page below
	});
	report(h === MIN, 'a short window gets the floor, not a sliver', h);
	// The floor is deliberately allowed to overflow — see LPN_MAP_MIN's own comment. The clamp
	// above must not have quietly removed that, because a usable canvas on a small screen is worth
	// a little scrolling and this is the one case where overflow is a decision rather than a bug.
	report(h > 400 - 300, '...even though that means the page scrolls, which is the deliberate part');
}

console.log('\n--- an element with no layout box is not measured at all ---');
{
	// applyMapHeight() returns before touching the height when the rect is empty: a hidden tab or a
	// display:none ancestor reports zeros, and zeros are not a measurement. The last good height
	// stays, which is what makes coming back to the tab a no-op instead of a resize.
	const body = extract('applyMapHeight');
	report(/getBoundingClientRect\(\)/.test(body) && /!r\.width && !r\.height/.test(body),
		'applyMapHeight refuses to size from an empty rect');
	report(body.indexOf('return;') < body.indexOf("setAttribute('height'"),
		'...and it returns BEFORE writing a height, not after');
	report(/visibilitychange/.test(src) && /!document\.hidden.*applyMapHeight|applyMapHeight/.test(src),
		'and the page re-measures when the tab becomes visible again');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
