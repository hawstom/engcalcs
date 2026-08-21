// **DOES A FIRST VISIT OPEN WITHOUT AN ASTERISK?** (ROADMAP Task 418)
//
//   node dev/lpn-spike/boot-clean-harness.js
//
// Tom, 2026-08-21: "418: The initial project loads with an asterisk. My procedure: Erase
// everything, Gallery on initial project, [Esc]. Result: blank Project1 with asterisk."
//
// THE MECHANISM, which is not the one an earlier pass fixed. The asterisk is
// `docSignature() !== entry.savedSig`, and docSignature() includes `view` -- deliberately, and the
// note above it forbids dropping it. But `currentView()` returns NULL while the canvas has no
// height, and the canvas is authored at height 0 behind a curtain until applyMapHeight() runs on
// `window load`. So init() stamps the born-clean baseline over a document with NO VIEW, the canvas
// acquires a height a moment later, and the next autosave finds a document that now HAS one and
// calls the difference a user edit. It is permanent, because rebaseSignatureIfClean() rebases only
// a project that is still clean and this one no longer is.
//
// **THE STUB HAS TO MODEL THE CANVAS ACQUIRING A SIZE, or there is no bug to see.** The shared stub
// answers a constant 1000x500 rect for every element and has no clientWidth/clientHeight at all, so
// currentView() would answer null forever and this harness would pass on a page that never boots.
// Here the canvas reports width 1000 (CSS, present from the first frame) and a height read from its
// own `height` ATTRIBUTE -- absent to begin with, exactly as the markup's curtain leaves it, and a
// number only once applyMapHeight() writes one. That is the single physical relationship under
// test: no height at init, a real height later.

const { loadLoopedNetwork, byId, setUnitSet } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

setUnitSet('us');
// The gallery fetches examples/manifest.json the first time it is shown. There is no network here
// and none is wanted: what the wall DISPLAYS is examples-gallery-harness.js's subject, not this
// one's. A rejected promise is what an offline browser gets, and the page already handles it.
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.window.history = { replaceState: () => {} };
// **THE SIZING PATH IS DRIVEN BY HAND, so no frame callback may run it behind the test's back.**
// init() posts an applyMapHeight() on the next frame for the cached-page case; letting it fire
// would size the canvas at a moment this harness has not chosen and make the ordering below
// unreadable. armMapSizing() below is the same door `window load` goes through.
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// ---- the canvas, with a height it does not have yet ----------------------------------------
const canvas = byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1000; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return parseFloat(this.height) || 0; } });
canvas.getBoundingClientRect = function () {
	const h = parseFloat(this.height) || 0;
	return { left: 0, top: 0, right: 1000, bottom: h, width: 1000, height: h };
};
function unsizeCanvas() { delete canvas.height; }

const INJECT =
	"\t\tinit: init, armMapSizing: armMapSizing, saveToStorage: saveToStorage,\n" +
	"\t\tindexEntry: indexEntry, docSignature: docSignature, currentView: currentView,\n" +
	"\t\thideExamplesGallery: hideExamplesGallery, galleryDismissed: galleryDismissedHere,\n" +
	"\t\tgetLibrary: function () { return library; }\n";

function boot() {
	unsizeCanvas();
	const L = loadLoopedNetwork(INJECT);
	L.init();
	return L;
}
function openEntry(L) { return L.indexEntry(L.getLibrary().openId); }

// ---- 1. THE FIRST VISIT, exactly as Tom described it ---------------------------------------
console.log('--- a first-ever visit: gallery, Esc, autosave ---');
{
	const L = boot();
	const e = openEntry(L);
	check(!!e, 'a first visit registers exactly one open project', e && e.name);
	check(!!(e && e.savedSig), 'and it is born with a baseline signature');
	check(L.currentView() === null, 'the canvas has NO size at the end of init',
		'if this fails the stub has stopped modelling the bug and nothing below means anything');

	// The boot solve's autosave, on its 300 ms debounce. It can land either side of `window load`;
	// here it lands before, which is the ordering that used to poison the flag.
	L.saveToStorage();
	check(!openEntry(L).dirty, 'an autosave before the canvas is sized leaves the project clean');

	// `window load` -> armMapSizing() -> applyMapHeight() -> noteMapSized(). The canvas has a height
	// from here on, so currentView() starts answering.
	L.armMapSizing();
	check(L.currentView() !== null, 'the canvas has a size once the page has loaded',
		JSON.stringify(L.currentView()));
	check(canvas.clientHeight > 0, 'and a real height was written to it', String(canvas.clientHeight));

	// [Esc] on the examples wall.
	L.hideExamplesGallery();
	check(L.galleryDismissed(), 'Esc marks the gallery dismissed for good');

	// The autosave that put the asterisk on.
	L.saveToStorage();
	check(!openEntry(L).dirty,
		'THE FIRST PROJECT OF A FIRST VISIT WEARS NO ASTERISK (Task 418)',
		'dirty=' + openEntry(L).dirty);

	// A second one, because the first could have rebaselined and the second re-dirtied.
	L.saveToStorage();
	check(!openEntry(L).dirty, 'and it is still clean on the next autosave');
}

// ---- 2. THE RELOAD, where the saved signature already HAS a view ---------------------------
//
// The same storage, opened again. This is the harder half: the stored savedSig was computed on a
// sized canvas, so on the way back in the signature differs the OTHER way round -- a document with
// no view against a baseline that has one. Nothing rebases a project once it is dirty, so an
// autosave landing before `window load` would make the asterisk permanent here too.
console.log('--- a reload of that same browser project ---');
{
	const L = boot();
	check(L.currentView() === null, 'the reloaded page starts with no canvas size again');
	const before = openEntry(L);
	check(!!before && !before.dirty, 'the project comes back out of storage clean',
		'dirty=' + (before && before.dirty));

	L.saveToStorage();
	check(!openEntry(L).dirty, 'an autosave that beats `window load` does not dirty it');

	L.armMapSizing();
	L.saveToStorage();
	check(!openEntry(L).dirty, 'and it is still clean once the canvas has a height',
		'dirty=' + openEntry(L).dirty);
}

console.log('\n' + (failures ? failures + ' FAILED of ' : 'all ') + checks + ' checks');
process.exit(failures ? 1 : 0);
