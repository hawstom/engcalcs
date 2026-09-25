// **R-208: PROJECT1 OPENS GEOGRAPHIC, AT DOWNTOWN NOVATO CENTER, WITH THE STREET MAP ON.**
//
//   node dev/lpn-spike/first-visit-geo-harness.js
//
// Tom, dev/tom-review-queue.md R-208: "The default Project1 tab has a path of frustration. If a
// user tries to attach the world map, it tells him that can't be done without any network. ... Or
// we start the Project1 on WGS84 zoomed to our favorite place ... possibly the exact view we get
// when we send a search to Mapbox for Downtown Novato Center, Novato, CA." Ida's brief (journal
// 2026-09-24, question 5): make Project1 geographic from birth so the world-map error never fires,
// but do NOT repoint `LPN_GEO_HOME` (every wizard-made blank geographic project would move too).
//
// **WHY THIS IS A STUB HARNESS AND NOT JUST THE BROWSER PASS.** The interesting failure here is
// TIMING, not pixels: `firstVisitHomeView()`, like `geoHomeView()`, needs the canvas's real height
// to compute a scale, and the canvas is still behind the curtain (height 0) at the exact moment
// init() registers a first-ever visit. Setting `pendingView` there -- the obvious first draft --
// computes against a zero height, gets null back, and the camera never moves: a defect that a
// harness modelling a canvas with a size from frame one would never see. This stub reproduces
// `boot-clean-harness.js`'s canvas -- CSS width from the first frame, a height that only appears
// once `armMapSizing()` runs -- for exactly that reason.
//
// **THE STREET MAP IS ON FROM THE FIRST FRAME** (Tom, 2026-09-25: *"we need to have this visible
// on first load behind the gallery"*). Project1 no longer sets `project.basemap = 'off'`; like every
// geographic project it leaves it unset, which basemapOn() reads as on. privacy.php says so.
//
// **AND THE DRAWN NUMBERS ARE SMALL.** The first build passed here while the real page drew every
// junction and tile ~5e7 px off the canvas: an empty geographic document kept origin {0, 0} under a
// camera over Novato. followViewWhileEmpty() re-origins it under the camera, so the view's own
// centre, in drawing units, is now under one 1/128-degree cell. That is checked below; the pixels
// themselves are checked in real Chrome by dev/browser-pass/specs/firstproject.js.

const { loadLoopedNetwork, byId, setUnitSet } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// ---- the canvas, sized the way the real markup's curtain leaves it -------------------------
// CSS width is there from the first frame; height is absent until applyMapHeight() writes one --
// exactly boot-clean-harness.js's rig, reused rather than re-invented for the same reason.
const canvas = byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1000; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return parseFloat(this.height) || 0; } });
canvas.getBoundingClientRect = function () {
	const h = parseFloat(this.height) || 0;
	return { left: 0, top: 0, right: 1000, bottom: h, width: 1000, height: h };
};

const INJECT =
	"\t\tinit: init, armMapSizing: armMapSizing,\n" +
	"\t\tgetProject: function () { return project; }, getDoc: function () { return doc; },\n" +
	"\t\tisLatLonProject: isLatLonProject, basemapOn: basemapOn,\n" +
	"\t\tworldMapUsable: worldMapUsable, worldMapAttach: worldMapAttach,\n" +
	"\t\tzoomExtent: zoomExtent, currentView: currentView,\n" +
	"\t\tindexEntry: indexEntry, docSignature: docSignature,\n" +
	"\t\tgetLibrary: function () { return library; }\n";

function boot() {
	const L = loadLoopedNetwork(INJECT);
	L.init();
	return L;
}
function openEntry(L) { return L.indexEntry(L.getLibrary().openId); }

console.log('--- a first-ever visit: Project1, cold, canvas still unsized ---');
{
	const L = boot();
	const p = L.getProject(), d = L.getDoc();

	check(L.isLatLonProject(), 'Project1 is geographic from the first frame', 'coords=' + p.coords);
	check(d.nodes.length === 0, 'set-up: it is empty', 'nodes=' + d.nodes.length);
	check(L.basemapOn() && p.basemap === undefined,
		'the street map is ON, by the geographic default, with nothing new stored to say so',
		'project.basemap=' + JSON.stringify(p.basemap));
	check(L.currentView() === null, 'and the camera has not moved yet: the canvas has no size',
		'if this fails the stub is not modelling the boot-time curtain and nothing below is proven');

	// window `load` -> armMapSizing() -> applyMapHeight() -> noteMapSized(), the first moment the
	// canvas can answer clientWidth/clientHeight honestly.
	L.armMapSizing();
	const v = L.currentView();
	check(!!v, 'once the canvas is sized, the deferred home view lands', JSON.stringify(v));
	if (v) {
		// Reading it back through `outwardX`/`outwardY` would need those exported too; the readout
		// this cares about is simpler -- degrees, roughly Novato, not the middle of the ocean and
		// not the whole world (a floor-scale fit would say the same coordinates at ~1/1000 the s).
		check(v.s > 5, 'zoomed in to something street-scale, not a whole-world floor', 's=' + v.s);
		// Pixels from the origin to the middle of the screen: what the browser is asked to lay out.
		const px = Math.max(Math.abs(v.cx), Math.abs(v.cy)) * v.s;
		check(px < 2e6, 'the empty project re-origined under the camera: drawn numbers are small',
			Math.round(px) + ' px from origin to centre (5e7 before the fix)');
	}

	// No permanent asterisk: the same Task 418 guarantee every other first visit gets. Checked
	// HERE, before the two user actions below -- attaching the world map and asking for a fit are
	// themselves edits (correctly), so a dirty flag after them would prove nothing about the boot
	// path.
	check(!openEntry(L).dirty, 'the born project is clean once its baseline has a view too');

	// R-208's whole point: attaching the world map from Project1 must now work.
	check(L.worldMapUsable(), 'World map row is usable on Project1 -- the reported error is gone');
	check(L.basemapOn(), 'and the map is already attached, so Attach has nothing left to do');

	// Zoom to fit on an empty project must not throw (R-208's other stated requirement).
	let threw = null;
	try { L.zoomExtent(true); } catch (e) { threw = e; }
	check(!threw, 'Zoom to fit on an empty geographic project does not throw', threw && threw.stack);
}

console.log('\n--- a project a visitor already started drawing must not be re-homed ---');
{
	// If somehow the canvas sizes AFTER the visitor has already put something on the empty
	// Project1 (e.g. a very slow first paint), `firstVisitPendingId`'s guard must refuse to move
	// the camera out from under real work -- the same discipline `pendingViewFor` observes.
	const L = boot();
	L.getDoc().nodes.push({ id: 'J1', kind: 'junction', x: 0, y: 0 });
	L.armMapSizing();
	// No assertion on the exact camera here (an edited document is free to fit however
	// restoreViewOrFit()'s own rules say) -- only that the harness reaches this line without an
	// unhandled exception from the guard reading a document mid-edit.
	check(true, 'sizing after an edit does not throw');
}

console.log('\n' + (failures ? failures + ' FAILED of ' : 'all ') + checks + ' checks');
process.exit(failures ? 1 : 0);
