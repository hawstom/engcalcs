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

// Comments stripped, because several checks below ask whether a function CALLS something, and a
// comment explaining why it deliberately does not call it would answer yes.
function stripComments(t) {
	return t.replace(/^[ \t]*\/\/.*$/gm, '');
}
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
// THERE IS NO SLACK CONSTANT ANY MORE, and its absence is asserted rather than assumed: it was a
// fudge for rounding that `Math.floor` handles exactly (Tom, 2026-08-15 -- "Slack: I don't really
// like it"). SLACK stays defined as 0 so the expectations below still read as arithmetic.
const SLACK = 0;

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
	// 900 - 180 above - 30 below - the slack.
	report(h === 900 - 180 - 30 - SLACK, 'the canvas fills the window minus what is above and below it', h);
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
	report(h <= 900 - SLACK, 'the canvas is never taller than the window', h);
	// Without the clamp this returns 1272 — a canvas 372px taller than the window, which is the
	// screenshot: the map running off the bottom and the status strip going with it. Named rather
	// than merely bounded, so a future edit that changes the formula has to look at this case
	// again instead of passing it by accident.
	report(h !== 900 + 400 - 20 - SLACK, '...specifically, not the oversized answer the unclamped formula gives', h);
}
{
	// The same shape from the other direction: a body rect that has not caught up, so `below`
	// reads as nothing at all.
	const h = scope({
		vh: 700, scrollY: 250,
		svg: { top: -250, bottom: 430, width: 1400, height: 680 },
		body: { bottom: 430 }
	});
	report(h <= 700 - SLACK, 'and still never taller when the scroll offset is the honest half', h);
}

console.log('\n--- the floor is a floor, and it is deliberately small ---');
{
	const h = scope({
		vh: 400, scrollY: 0,
		svg: { top: 300, bottom: 340, width: 1400, height: 40 },
		body: { bottom: 900 }   // a lot of page below
	});
	report(h === MIN, 'a window with no room left gets the floor, not a sliver or a zero', h);
	// **THE FLOOR NO LONGER FORCES A SCROLL, AND THAT IS THE CHANGE.** It was 240, on the argument
	// that "a 60px map is not a working map" -- which answers the wrong question, as Tom pointed out
	// on 2026-08-15: the floor does not decide whether the map is usable, the WINDOW does. All it
	// decides is whether a too-short window gets a small map that fits the page, or a bigger one
	// that pushes the status strip off the bottom and makes the page scroll. This asserts the
	// constant stays small enough to be the former.
	report(MIN <= 100, 'and it is small enough not to push the page into scrolling', MIN);
	report(MIN > 0, '...but not zero, which would leave nothing to aim at');
}

// --- A RESIZE MUST NOT SLIDE THE DRAWING -------------------------------------
// The world transform anchors content at the TOP-LEFT, so a canvas that grows by 12px reveals 12
// more at the bottom and moves everything relative to the frame. That is what a tab return looked
// like ("zoom changes for Net3 when I go to another tab and then return") and what a window resize
// had always done. Half the delta on each axis keeps the view CENTRE fixed.
console.log('\n--- resizing the canvas keeps the view centre, and tiny changes are ignored ---');
{
	// A canvas whose rect follows whatever height is written to it, so applyMapHeight() can be run
	// for real rather than inspected as text.
	function fakeCanvas(h, w) {
		var el = { _h: h, _w: w || 1400, attrs: {} };
		el.getBoundingClientRect = function () { return { top: 180, bottom: 180 + el._h, width: el._w, height: el._h }; };
		el.setAttribute = function (k, v) { el.attrs[k] = v; if (k === 'height') { el._h = Number(v); } };
		return el;
	}
	function run(env) {
		var svg = fakeCanvas(env.h0, env.canvasW), state = { tx: env.tx || 0, ty: env.ty || 0, s: 1 }, transforms = 0,
			// The canvas box as of the previous call. Seeded to the starting box, which is what the
			// page's own boot does: the first applyMapHeight() records it and re-centres nothing.
			lastMapBox = env.lastBox === undefined ? { w: 1400, h: env.h0 } : env.lastBox;
		var fn = new Function('window', 'document', 'svg', 'LPN_MAP_MIN', 'state', 'setTransform', 'pageSettled', 'LPN_MAP_HEIGHT_DEADBAND', 'lastMapBox', 'noteMapSized',
			extract('flowBelowMap') + '\n' + extract('effectiveMapHeight') + '\n' +
			extract('applyMapHeight') +
			'\nreturn applyMapHeight();');
		fn({ innerHeight: env.vh, pageYOffset: 0 },
			{ documentElement: { scrollTop: 0 }, body: { getBoundingClientRect: function () { return { bottom: env.bodyBottom }; } } },
			svg, MIN, state, function () { transforms++; }, function () { return true; },
			Number((src.match(/var LPN_MAP_HEIGHT_DEADBAND = (\d+);/) || [])[1]), lastMapBox,
			function () { /* the deferred-fit hook; nothing to defer in here */ });
		return { h: svg._h, state: state, transforms: transforms };
	}
	// The canvas is 600 tall and the window has room for 682. Growing it by 82 must show 41 more at
	// the top and 41 more at the bottom, not 82 more at the bottom.
	var grown = run({ vh: 900, h0: 600, bodyBottom: 810, ty: 0 });
	var want = 900 - 180 - 30 - SLACK;      // window, minus what is above, below, and the slack
	report(grown.h === want, 'the canvas takes the height the measurement asks for', grown.h);
	report(grown.state.ty === (want - 600) / 2,
		'...and the view centre stays put, half the delta on each side', grown.state.ty);
	report(grown.transforms === 1, '...applied once, not per frame', grown.transforms);
	// Shrinking goes the other way, by the same rule.
	var shrunk = run({ vh: 500, h0: 600, bodyBottom: 810, ty: 0 });
	report(shrunk.h < 600 && shrunk.state.ty === (shrunk.h - 600) / 2,
		'shrinking moves the centre the other way by half the delta', shrunk.h + ' -> ty ' + shrunk.state.ty);
	// SUB-PIXEL CHURN IS NOT A CHANGE. Layout settles differently after fonts load or a tab returns,
	// and re-applying a height half a pixel different would move the drawing for no visible reason.
	// Sub-pixel on purpose: 682.4 against a computed 682. Without the dead band the attribute is
	// rewritten every single time the page is measured, which is every resize and every tab return.
	// The CURRENT height is fractional, which is what a browser really reports, and the computed one
	// is the integer just below it. Since Math.floor replaced Math.round the computed value is always
	// a whole number, so this is now the only shape sub-pixel churn can take -- and it is exactly the
	// shape that would otherwise rewrite the height on every resize and every tab return.
	// A WIDTH-ONLY RESIZE MUST RE-CENTRE TOO, and it is the case the old code could not see at all
	// (Tom: "left offset/margin is fixed when changing window width"). The canvas width is CSS, so
	// by the time any handler of ours runs the browser has already applied it -- there is no delta
	// left to observe unless the previous box was remembered. And the old code only looked when the
	// HEIGHT changed, which a width drag never does.
	{
		var w0 = { w: 1400, h: 690 };
		var wide = run({ vh: 900, h0: 690, bodyBottom: 900, lastBox: w0, canvasW: 1800 });
		report(wide.state.tx === (1800 - 1400) / 2, 'a width-only resize re-centres the drawing',
			'tx moved by ' + wide.state.tx + ', want ' + (1800 - 1400) / 2);
	}
	// AND IT MUST NOT DRIFT -- Tom: "very active resizing gradually pans the map until it disappears
	// left." The cause is the same as the case above: a resize that is not OBSERVED is not corrected
	// for, and the shortfall accumulates across a drag that fires dozens of events. Note that the
	// arithmetic FORM is not the fix and this harness says so: re-deriving from a remembered world
	// point is algebraically identical to adding half the delta, and mutating the code to the
	// additive form fails nothing here. What fixes it is measuring against the box as of the last
	// call, so every change is seen exactly once.
	{
		var box = { w: 1400, h: 690 }, st = { tx: 0, ty: 0, s: 1 }, i, r2;
		for (i = 0; i < 20; i++) {
			r2 = run({ vh: 900, h0: box.h, bodyBottom: 900, lastBox: box,
				canvasW: (i % 2) ? 1400 : 1500, tx: st.tx, ty: st.ty });
			st = r2.state; box = { w: (i % 2) ? 1400 : 1500, h: r2.h };
		}
		// The loop ENDS at the width it started from, so a drift-free implementation must end with
		// the transform it started from -- exactly zero, not nearly. (The first draft of this check
		// expected the other width and was simply wrong about which iteration was last; the code was
		// right. Worth the note: a returns-to-origin assertion is the honest shape here, because it
		// needs no arithmetic to predict and cannot be satisfied by a drift that happens to cancel.)
		report(st.tx === 0, 'twenty resizes ending where they began leave no drift at all',
			'tx = ' + st.tx + ' after 20 resizes');
	}
	var same = run({ vh: 900, h0: 688.4, bodyBottom: 900.4 });
	report(same.h === 688.4 && same.transforms === 0 && same.state.ty === 0,
		'a height that has not really changed is not even written', same.h + ' ty ' + same.state.ty);
}

// --- THE HEIGHT IS A FACT ABOUT THE WINDOW, NOT ABOUT THE MODEL ---------------
// Tom, 2026-08-15, as a rule: "Bottom of map should not depend on the model." Opening a different
// project cannot change how much room the window has, so re-deriving the height on every open can
// only produce the same answer or a wrong one -- and it produced wrong ones, because
// refreshAllFromDocument() runs it in the middle of a rebuild with the chrome mid-flight.
console.log('\n--- opening a project does not resize the canvas ---');
{
	const refresh = stripComments(extract('refreshAllFromDocument'));
	report(!/applyMapHeight\(\)/.test(refresh),
		'refreshAllFromDocument does not touch the map height');
	// The one thing that legitimately can: the tab strip wrapping to another line when several
	// projects are open. That is page chrome, and renderTabs() re-measures only when its own height
	// actually changed.
	const tabs = stripComments(extract('renderTabs'));
	report(/stripHeightBefore/.test(tabs) && /applyMapHeight\(\)/.test(tabs),
		'renderTabs re-measures when the strip changes height');
	report(/!== stripHeightBefore/.test(tabs),
		'...and only then, so switching between projects moves nothing');
	// Every remaining caller must be an ENVIRONMENT event. Restoring defaults used to be in this
	// list, left over from when the map height was a setting; it is not one any more.
	const callers = stripComments(src).split('\n')
		.filter(l => /applyMapHeight/.test(l) && !/function applyMapHeight/.test(l));
	report(callers.every(l => /resize|orientationchange|document\.hidden|'load'|fonts|requestAnimationFrame|stripHeightBefore|applyMapHeight\(true\)|^\s*applyMapHeight\(\);$/.test(l)),
		'every caller is a window/chrome event, never a document one',
		callers.length + ' call sites');
}

// --- NO GUESSED HEIGHT, AND NO SIZING BEFORE THE PAGE SETTLES -----------------
// Tom, 2026-08-15: "Why set a map bottom at all when it can't be calculated? Why not stay blank or
// whatever?" The canvas used to be authored at height="500" -- a guess, and a guess that is drawn
// is a stage the user watches: the map appeared half-way up the window and then jumped when the
// page finished assembling and the measurement became true.
//
// A CURTAIN, NOT A GUESS. Zero was the first attempt and Tom improved on it in one line: "I say
// that height 10000 is better so that we don't see the 'under construction' stuff." A zero-height
// canvas does not show nothing -- it pulls the footer, the nav and the legal row up into the
// viewport, so the first thing a visitor sees is the page's plumbing. A number far larger than any
// screen pushes all of that below the fold and leaves an empty map area waiting. It is also
// unmistakable for an answer, which is what let 500 survive for months.
console.log('\n--- the authored height is a curtain, and nothing is sized before the page settles ---');
{
	const page = fs.readFileSync(path.join(__dirname, '../../Looped-Network.php'), 'utf8');
	const tag = (page.match(/<svg id="lpn_canvas"[^>]*>/) || [''])[0];
	const authored = Number((tag.match(/height="(\d+)"/) || [])[1]);
	// Taller than any screen anyone will open this on, so nothing below the map can appear before
	// the map is sized. The bound is what is asserted, not the digits: 10000 is not special, being
	// larger than a viewport is.
	report(authored >= 4000, 'the authored height is far taller than any viewport', tag.slice(0, 90));
	// AND IT MUST NOT LOOK LIKE A REAL ANSWER. That is the property 500 failed: it sat in the range
	// of a plausible canvas height, so it read as a decision rather than as a placeholder, and
	// nobody questioned it until a user watched it jump.
	report(!(authored > 200 && authored < 2000),
		'...and not a number anybody could mistake for a measured one', authored);
	// The gate itself. readyState is the browser's own answer to "has everything finished", which is
	// the only trustworthy moment to measure a navbar and a footer that are still swapping fonts.
	report(/function pageSettled\(\)/.test(src) && /readyState === 'complete'/.test(src),
		'and it is not sized before the browser says the page is complete');
	const body = stripComments(extract('applyMapHeight'));
	report(/if \(!pageSettled\(\)\) \{ return; \}/.test(body),
		'...checked inside applyMapHeight, so every caller obeys it');
	// A canvas at height 0 that never gets sized is a page with no map, so the gate needs a way out
	// that does not depend on the thing that might be broken.
	report(/setTimeout\(armMapSizing/.test(src),
		'with a failsafe, so a subresource that never loads cannot leave the page mapless');
	report(/'load', armMapSizing/.test(src), 'and load arms it the moment the page is really done');
}

// --- THE SLACK IS GONE, NOT SHRUNK -------------------------------------------
// "Slack: I don't really like it. But I can live with it only if you insist." It was a margin for
// rounding overshoot; Math.floor cannot overshoot, so the margin has nothing left to guard.
console.log('\n--- no fudge constant, because floor cannot overshoot ---');
{
	report(!/LPN_MAP_SLACK/.test(src), 'the slack constant is gone from the source');
	const body = stripComments(extract('effectiveMapHeight'));
	report(/Math\.floor\(vh - above - flowBelowMap\(\)\)/.test(body),
		'and the room is floored rather than rounded, which is what made it unnecessary');
	report(!/Math\.round/.test(body), '...with no rounding left that could ask for a pixel too many');
}

console.log('\n--- an element with no layout box is not measured at all ---');
{
	// applyMapHeight() returns before touching the height when the rect is empty: a hidden tab or a
	// display:none ancestor reports zeros, and zeros are not a measurement. The last good height
	// stays, which is what makes coming back to the tab a no-op instead of a resize.
	const body = extract('applyMapHeight');
	report(/getBoundingClientRect\(\)/.test(body) && /!before\.width && !before\.height/.test(body),
		'applyMapHeight refuses to size from an empty rect');
	report(body.indexOf('return;') < body.indexOf("setAttribute('height'"),
		'...and it returns BEFORE writing a height, not after');
	report(/visibilitychange/.test(src) && /!document\.hidden.*applyMapHeight|applyMapHeight/.test(src),
		'and the page re-measures when the tab becomes visible again');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
