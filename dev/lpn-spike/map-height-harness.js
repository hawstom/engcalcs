// The map's height, as a FIXED POINT (ROADMAP Task 314 follow-on).
//
//   node dev/lpn-spike/map-height-harness.js
//
// Tom, 2026-08-14, with a photograph of a strip of empty page between the map's status bar and the
// Windows taskbar: "The bottom still isn't at the bottom."
//
// THE BUG WAS CIRCULAR, WHICH IS WHY IT LOOKED LIKE A TUNING PROBLEM AND WAS NOT.
// effectiveMapHeight() sizes the canvas as `viewport - above - below - slack`. `below` was read as
// `documentElement.scrollHeight - canvasBottom`, and scrollHeight NEVER REPORTS LESS THAN THE
// VIEWPORT. So the moment the page became shorter than the window -- exactly what this feature is
// for -- `below` stopped measuring content and started measuring the empty space itself:
//
//     below = vh - above - H        (the gap)
//     room  = vh - above - below - 8
//           = vh - above - (vh - above - H) - 8
//           = H - 8
//
// The map therefore shrank by the slack on every single recompute, and the gap it was closing was
// its own input. No constant could have fixed that; the measurement had to change.
//
// So the property under test is CONVERGENCE, not a number: iterate the sizing the way a browser
// does (resize, re-layout, resize) and the height must settle, settle QUICKLY, and settle with the
// page exactly filling the window. A harness that asserted one call's output would have passed on
// the broken version.
//
// The functions are pure arithmetic over a few DOM measurements, so they are lifted by text and run
// against a fake layout. That is the weaker pattern in this directory -- it tests a copy -- but the
// copy is exact here and there is no other way to reach a closure variable.

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
function constant(name) {
	const m = src.match(new RegExp('var ' + name + ' = (\\d+)'));
	if (!m) { throw new Error('constant not found: ' + name); }
	return Number(m[1]);
}

const LPN_MAP_MIN = constant('LPN_MAP_MIN');
const LPN_MAP_FIT = constant('LPN_MAP_FIT');
const LPN_MAP_SHIPPED_DEFAULTS = JSON.parse(
	(src.match(/var LPN_MAP_SHIPPED_DEFAULTS = (\[[^\]]*\])/) || [])[1]);

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// A fake page: `above` px of chrome over the canvas, `realBelow` px of genuine content under it.
// The canvas's own height is the thing being solved for.
function makeWorld(vh, above, realBelow, mapHeight) {
	const state = { H: 500 };
	const svg = {
		getBoundingClientRect() {
			return { top: above, bottom: above + state.H, height: state.H };
		}
	};
	const settings = { mapHeight: mapHeight };
	const window = { innerHeight: vh, pageYOffset: 0 };
	const document = {
		documentElement: {
			scrollTop: 0,
			// The real thing: never smaller than the viewport. This is the trap.
			get scrollHeight() { return Math.max(above + state.H + realBelow, vh); }
		},
		body: {
			getBoundingClientRect() {
				return { top: 0, bottom: above + state.H + realBelow };
			}
		}
	};
	const scope = { svg, settings, window, document, LPN_MAP_MIN, LPN_MAP_FIT, state };
	const fn = new Function('svg', 'settings', 'window', 'document', 'LPN_MAP_MIN', 'LPN_MAP_FIT',
		extract('flowBelowMap') + '\n' + extract('effectiveMapHeight') + '\nreturn effectiveMapHeight;');
	state.effective = fn(svg, settings, window, document, LPN_MAP_MIN, LPN_MAP_FIT);
	return scope;
}
// One "browser pass": measure with the current height applied, then apply the answer.
function settle(world, passes) {
	const seen = [];
	for (let i = 0; i < passes; i++) {
		const h = world.state.effective();
		seen.push(h);
		world.state.H = h;
	}
	return seen;
}

console.log('\n-- it converges, and it converges immediately --');
{
	const w = makeWorld(900, 300, 0, LPN_MAP_FIT);
	const seen = settle(w, 6);
	report(new Set(seen.slice(1)).size === 1, 'the height stops moving after the first pass', seen.join(' -> '));
	// THE REGRESSION TEST FOR THE CIRCULAR BUG: a monotonically shrinking series is exactly what
	// the scrollHeight version produced (H, H-8, H-16, ...). Assert it is not happening.
	const shrinking = seen.every((h, i) => i === 0 || h < seen[i - 1]);
	report(!shrinking, 'it does NOT shrink a little on every recompute');
}

console.log('\n-- and it settles with the page exactly filling the window --');
[[900, 300, 0], [768, 260, 0], [1200, 340, 0], [900, 300, 40]].forEach(function (c) {
	const [vh, above, below] = c;
	const w = makeWorld(vh, above, below, LPN_MAP_FIT);
	settle(w, 4);
	const total = above + w.state.H + below;
	report(total <= vh && total >= vh - 10,
		`vh=${vh} above=${above} below=${below}: page fills the window without exceeding it`,
		`total ${total}, map ${w.state.H}`);
});

console.log('\n-- the trap it was written for cannot come back --');
{
	// `above` is at least the header's height and always > 0, so the canvas can never be as tall as
	// the viewport. That is the precondition of the touch trap (touch-action:none swallows every
	// gesture landing on the canvas), and it is now prevented by construction rather than by a
	// chosen fraction.
	[[640, 120, 0], [900, 300, 0], [1400, 200, 0]].forEach(function (c) {
		const w = makeWorld(c[0], c[1], c[2], LPN_MAP_FIT);
		settle(w, 4);
		report(w.state.H < c[0], `vh=${c[0]}: the canvas is never viewport-tall`, `${w.state.H} < ${c[0]}`);
	});
}

console.log('\n-- real content below shrinks the map to keep itself reachable --');
{
	const bare = makeWorld(900, 300, 0, LPN_MAP_FIT); settle(bare, 4);
	const withFooter = makeWorld(900, 300, 120, LPN_MAP_FIT); settle(withFooter, 4);
	report(withFooter.state.H === bare.state.H - 120,
		'adding 120px under the map takes exactly 120px off it',
		`${bare.state.H} -> ${withFooter.state.H}`);
	// This is the self-correcting property: put something tall back under the map and nothing has
	// to be retuned.
}

console.log('\n-- a short screen keeps a usable map even if that means scrolling --');
{
	const w = makeWorld(420, 300, 60, LPN_MAP_FIT);
	settle(w, 4);
	report(w.state.H === LPN_MAP_MIN, 'the floor holds', `${w.state.H} = LPN_MAP_MIN`);
	// And the trap still cannot occur, because a floor well under any real viewport leaves plenty
	// of non-canvas page to touch.
	report(w.state.H < 420, 'and the canvas is still shorter than the viewport');
}

console.log('\n-- an explicit height is a MAXIMUM, never a stretch --');
{
	const small = makeWorld(900, 300, 0, 400); settle(small, 4);
	report(small.state.H === 400, 'a typed 400 is honoured on a tall window', `${small.state.H}`);
	const big = makeWorld(700, 300, 0, 4000); settle(big, 4);
	report(big.state.H < 700 - 300, 'a typed 4000 is still clamped to the room available', `${big.state.H}`);
}

console.log('\n-- a stored default is not a choice --');
{
	const norm = new Function('LPN_MAP_FIT', 'LPN_MAP_SHIPPED_DEFAULTS',
		extract('normalizeMapHeight') + '\nreturn normalizeMapHeight;')(LPN_MAP_FIT, LPN_MAP_SHIPPED_DEFAULTS);
	// 500 was the original fixed <svg height="500">; 800 was the default for a few hours on
	// 2026-08-14. A stored value equal to either is the default sitting in a settings object, not a
	// number anybody typed — and leaving it would have left every existing visitor with the very
	// gap Tom photographed, since the cap would hold the map short of the window forever.
	LPN_MAP_SHIPPED_DEFAULTS.forEach(function (d) {
		report(norm(d) === LPN_MAP_FIT, `a stored ${d} migrates to fit-the-window`);
	});
	report(norm(640) === 640, 'but a height the user actually typed is kept');
	report(norm(0) === LPN_MAP_FIT && norm(undefined) === LPN_MAP_FIT && norm(-5) === LPN_MAP_FIT,
		'and anything absent or nonsensical means fit');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
