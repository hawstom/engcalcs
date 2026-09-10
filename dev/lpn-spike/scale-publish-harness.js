// **A SCALE NEVER REACHES THE WORLD LAYER WITHOUT THE STROKE SIZES FOLLOWING IT.** Run with:
//   node dev/lpn-spike/scale-publish-harness.js
//
// THE REPORT. Tom, 2026-09-09, relaying his son MJH, a civil engineering designer opening the
// shipped examples in LibreWolf: *"the first presenting problem was a completely blue map"*,
// *"his window rubber band was scaled completely wrong"*, *"the project became uneditable. In fact,
// he never once succeeded in editing anything"*, and *"the network never disappeared ... The app
// was broken, but the network was intact."* It survived a reload and a full Erase-everything, so
// nothing stored was the cause.
//
// **THE MECHANISM, AND ALL THREE SYMPTOMS ARE THE SAME ONE.** Every stroke on this map is a figure
// in SCREEN PIXELS divided by state.s, published to CSS as a custom property in WORLD units by
// publishScaleSizes(). css/engcalcs.css carries a fallback for each -- `var(--lpn-sym, 1)`,
// `var(--lpn-lw, 0.7)`, `var(--lpn-hit, 12)` -- and those fallbacks are world units too. On an XY
// project, where state.s is about 1, they are the sizes they look like. On a GEOGRAPHIC one they
// are multiplied by thousands of pixels per degree.
//
// MEASURED in Gecko on the lat/lon Net3 example at 6,478.75 px per degree, with the two link
// properties simply absent (dev/browser-pass/measure-probe.js, scenario `blueLinksOnly`):
//
//     pipes            0.7 world units  = 4,535 screen px wide, painted #1a6faf
//     the map          #186bad over 44% of the canvas -- a completely blue map
//     select-area ring 0.35 x 1 unit border = 2,267 screen px -- scaled completely wrong
//     grab band        12 world units = 77,745 px around EVERY pipe
//     hit tests        14 of 25 points across the canvas answer `lpn-link-hit`, not the map
//     an edit          a Junction placed on the map: refused, 97 nodes before and after
//
// **SO THE PUBLISH RIDES setTransform(), which is already "the one seam for the view moved".** It
// used to hang off onZoomChanged(), five statements downstream through applyLabelVisibility() and
// refreshFontSizes() -- the most measurement-dependent code on the page -- and behind applyView()'s
// `state.s !== lastLayoutScale` guard. This harness asserts the seam directly: it moves state.s and
// calls setTransform() and NOTHING ELSE, which is the one thing that could not be true before.
//
// **AND THE LAST SECTION IS A LIVE MUTATION**, because every assertion above would pass just as
// happily on a page that had never been repaired if the publish happened to run for some other
// reason. The repair is deleted from the source, the same checks are re-run, and they must go red.

const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');
byId.lpn_toolbar.querySelectorAll = () => [];

const INJECT =
	"\t\tstate: state, setTransform: setTransform, applyView: applyView, init: init,\n" +
	"\t\tarmMapSizing: armMapSizing, refreshSymbolSizes: refreshSymbolSizes,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tsvg: function () { return svg; }, world: function () { return world; },\n" +
	"\t\tLINK_HIT_PX: LPN_LINK_HIT_PX, LINK_HIT_FLOOR_PX: LPN_LINK_HIT_FLOOR_PX\n";

// **THE CANVAS HAS A SIZE, AND WITHOUT ONE THERE IS NO BUG TO SEE.** currentView() answers null on
// an unsized canvas, so a harness that left it unsized would exercise none of the view code and
// report green about a page that never lays out at all -- boot-clean-harness.js's whole subject.
const canvas = byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { configurable: true, get() { return 1400; } });
Object.defineProperty(canvas, 'clientHeight', { configurable: true, get() { return 600; } });
canvas.getBoundingClientRect = () => ({ left: 0, top: 0, right: 1400, bottom: 600, width: 1400, height: 600 });

// The gallery fetches examples/manifest.json on a first visit and there is no network here; a
// rejected promise is what an offline browser gets, and the page already handles it.
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

function boot(mutate) {
	const L = loadLoopedNetwork(INJECT, undefined, mutate);
	L.init();
	L.armMapSizing();
	return L;
}

function props(L) {
	const st = L.svg().style;
	return {
		sym: st.getPropertyValue('--lpn-sym'),
		lw: st.getPropertyValue('--lpn-lw'),
		hit: st.getPropertyValue('--lpn-hit'),
		hitCoarse: st.getPropertyValue('--lpn-hit-coarse'),
		hair: st.getPropertyValue('--lpn-hair')
	};
}
function worldTransform(L) { return L.world().getAttribute('transform') || ''; }

// The one thing every assertion below asks, in one place, so the mutated run asks it identically.
// A scale is MOVED and setTransform() is called with nothing else touched; the four properties must
// describe that scale afterwards.
function seamHolds(L, s) {
	const set = L.settings();
	L.state.s = s;
	L.state.tx = 0;
	L.state.ty = 0;
	L.setTransform();
	const p = props(L);
	return {
		p: p,
		lw: +p.lw === set.linkWidth / s,
		hit: +p.hit === Math.max(set.linkWidth, L.LINK_HIT_FLOOR_PX) / s,
		hitCoarse: +p.hitCoarse === L.LINK_HIT_PX / s,
		hair: +p.hair === 1 / s,
		sym: +p.sym > 0 && isFinite(+p.sym),
		transform: worldTransform(L).indexOf('scale(' + s + ')') >= 0
	};
}

// ---- 1. THE SEAM ITSELF ---------------------------------------------------------------------
console.log('\n--- the stroke sizes ride the transform ---');
{
	const L = boot();
	// A geographic scale, which is where the fallbacks are catastrophic rather than merely wrong.
	// The number is the one Gecko computed for the lat/lon Net3 example at 1400 x 599.
	const GEO_S = 6478.7497871167825;
	const r = seamHolds(L, GEO_S);
	ok('moving the scale and calling setTransform() publishes --lpn-lw', r.lw, r.p.lw);
	// **TWO BANDS SINCE TOM'S RULING OF 2026-09-10** (*"No slop for nodes. Slop for labels and to
	// enforce a lower limit of 3 px for link lines."*): a POINTER aims at the pipe's own drawn width
	// with a 3 px floor, a FINGER keeps the 12 px band, and the stylesheet picks by pointer type.
	// Both are published here, and both have to ride the same seam or one device gets a stale one.
	ok('...and --lpn-hit', r.hit, r.p.hit);
	ok('...and --lpn-hit-coarse', r.hitCoarse, r.p.hitCoarse);
	ok('...and --lpn-hair', r.hair, r.p.hair);
	ok('...and --lpn-sym', r.sym, r.p.sym);
	ok('...and the world layer really is at that scale', r.transform, worldTransform(L));

	// **WHY IT MATTERS, IN SCREEN PIXELS.** This is the arithmetic that turns an unpublished
	// property into MJH's screen, asserted rather than described so that a future change to the
	// stylesheet's fallbacks cannot quietly make this note false.
	const FALLBACK_LW = 0.7, FALLBACK_HIT = 12;
	ok('a pipe at the stylesheet fallback would be over 4,000 px wide at this scale',
		FALLBACK_LW * GEO_S > 4000, Math.round(FALLBACK_LW * GEO_S) + ' px');
	ok('...and every pipe would carry a grab band over 70,000 px across',
		FALLBACK_HIT * GEO_S > 70000, Math.round(FALLBACK_HIT * GEO_S) + ' px');
	// The published value, in the units the reader actually sees: the pipe width SETTING, which is
	// a number of screen pixels and is the same number at every scale. That invariance is the whole
	// point of publishing at all.
	ok('...against the published width, which is the user\'s own setting in screen pixels',
		Math.abs(+r.p.lw * GEO_S - L.settings().linkWidth) < 1e-9,
		(+r.p.lw * GEO_S).toFixed(3) + ' px for a setting of ' + L.settings().linkWidth);

	// A SECOND SCALE, because a publish that ran once and then stopped would pass everything above.
	const r2 = seamHolds(L, 1);
	ok('a second, ordinary scale republishes them', r2.lw && r2.hit && r2.hair, r2.p.lw);

	// The guard is on the SCALE, so a pan (same scale, new translation) must still be free -- and
	// must still leave the properties correct, which is the only half a reader cares about.
	L.state.tx = 40; L.state.ty = -12;
	L.setTransform();
	ok('a pan leaves them alone and correct', +props(L).lw === L.settings().linkWidth, props(L).lw);

	// Symbol size and link width change these numbers WITHOUT changing the scale, so that path
	// forces a republish rather than being turned away by the scale guard.
	L.settings().linkWidth = 5;
	L.refreshSymbolSizes();
	ok('changing the link width republishes at the same scale', +props(L).lw === 5, props(L).lw);
	L.settings().linkWidth = 2;
}

// ---- 2. A BAD MEASUREMENT NEVER BECOMES A TRANSFORM -----------------------------------------
//
// `scale(NaN)` is dropped whole by SVG, so the world silently falls back to the identity and every
// hit test on the page then resolves against a transform nobody chose. `scale(0)` is worse, because
// it PARSES: the drawing collapses to a point and every stroke size above divides by it.
console.log('\n--- a scale that is not a scale ---');
{
	const L = boot();
	const good = 250;
	L.state.s = good; L.state.tx = 10; L.state.ty = 20;
	L.setTransform();
	const held = worldTransform(L);
	ok('set-up: a good view is on the world layer', held.indexOf('scale(250)') >= 0, held);
	const goodProps = props(L);

	[['NaN', NaN], ['zero', 0], ['negative', -3], ['infinite', Infinity]].forEach(function (pair) {
		L.state.s = pair[1];
		L.setTransform();
		ok('a ' + pair[0] + ' scale is refused and the last good view stands',
			worldTransform(L) === held, worldTransform(L));
		ok('...and the stroke sizes are left alone rather than made NaN',
			props(L).lw === goodProps.lw, props(L).lw);
	});

	// The translation half of the same rule.
	L.state.s = good; L.state.tx = NaN;
	L.setTransform();
	ok('a translation that is not a number is refused too', worldTransform(L) === held, worldTransform(L));

	// And it RECOVERS. Holding the last good view is only the right answer if a measurement that
	// comes back is picked up with nothing to reset.
	L.state.tx = 10; L.state.s = 500;
	L.setTransform();
	ok('a view that becomes usable again is applied', worldTransform(L).indexOf('scale(500)') >= 0,
		worldTransform(L));
	ok('...with the stroke sizes at the new scale', +props(L).lw === L.settings().linkWidth / 500, props(L).lw);
}

// ---- 3. AND IT SAYS SO ----------------------------------------------------------------------
//
// A map that is silently unusable is what cost MJH the session. The message is a STANDING one --
// showNotice() rather than setNotice(), which expires -- because it reports a state of the page
// that is true until a measurement recovers.
console.log('\n--- the reader is told ---');
{
	const L = boot();
	const notice = byId.lpn_map_notice;
	const WORDS = (global.EngCalcs.pageConfig || {}).lpn_map_unmeasurable;
	ok('set-up: lpn_map_unmeasurable is a defined English key', !!WORDS,
		WORDS ? WORDS.slice(0, 40) + '...' : '(undefined)');
	L.state.s = 300; L.state.tx = 0; L.state.ty = 0;
	L.setTransform();
	ok('a usable view says nothing', !notice.textContent, JSON.stringify(notice.textContent));
	L.state.s = NaN;
	L.setTransform();
	ok('a view that cannot be computed puts the message on the map', notice.textContent === WORDS,
		JSON.stringify((notice.textContent || '').slice(0, 40)));
	ok('...and the map notice is actually showing', notice.style.display === 'block', notice.style.display);
	L.state.s = 300;
	L.setTransform();
	ok('...and it goes when the measurement comes back', !notice.textContent,
		JSON.stringify(notice.textContent));
}

// ---- 4. THE LIVE MUTATION -------------------------------------------------------------------
//
// Everything above would pass on an unrepaired page if the publish happened to have run for some
// other reason before the assertion looked. So the repair is DELETED from the source and the same
// function is asked the same question: it must answer no.
console.log('\n--- with the repair taken out, section 1 must go red ---');
{
	const M = boot(function (src) {
		return src.replace('\t\tpublishScaleSizes();\n', '\t\t/* deleted by scale-publish-harness.js */\n');
	});
	const r = seamHolds(M, 6478.7497871167825);
	ok('the mutated page does NOT publish --lpn-lw on a transform', !r.lw, r.p.lw || '(unset)');
	ok('...nor --lpn-hit', !r.hit, r.p.hit || '(unset)');
	ok('...nor --lpn-hit-coarse', !r.hitCoarse, r.p.hitCoarse || '(unset)');
	// **WHAT IT LEAVES BEHIND IS A STALE VALUE, NOT AN ABSENT ONE, AND THAT IS THE FAITHFUL SHAPE.**
	// init() publishes once at the boot scale of 1, so the mutated page carries 2 and 12 WORLD units
	// into a view at 6,478 px per degree. The stylesheet's own fallbacks (0.7 and 12) are the same
	// arithmetic where nothing published at all. Either way the reader gets pipes and grab bands
	// thousands of screen pixels across, which is the map MJH could not click on.
	ok('...and what it leaves behind is a width of thousands of screen pixels',
		+r.p.lw * 6478.7497871167825 > 4000, Math.round(+r.p.lw * 6478.7497871167825) + ' px');
	// The stale grab band is the COARSE one now: --lpn-hit carries the pipe's 3 px floor in world
	// units and --lpn-hit-coarse the 12, and either is thousands of screen pixels at this scale.
	ok('...and a grab band of tens of thousands',
		+r.p.hitCoarse * 6478.7497871167825 > 40000, Math.round(+r.p.hitCoarse * 6478.7497871167825) + ' px');
	ok('...while the world layer is at the geographic scale regardless', r.transform, worldTransform(M));
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
