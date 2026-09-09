// THE FOUR REPORT BOXES REMEMBER WHERE THEY WERE, HOW BIG, AND WHETHER THEY WERE OPEN -- Tom,
// 2026-09-08: *"Of our non-hog boxes (non-modal, resizeable, and draggable), only Settings and
// Libraries survive a reload. Fire flow analysis, Pump Energy report, Scenario Comparison, and
// EPANET run report do not survive. Fix this."* Run with:
//
//   node dev/lpn-spike/report-box-memory-harness.js
//
// WHY THIS EXISTS. dev/lpn-spike/box-open-memory-harness.js held the OPPOSITE for these four boxes
// -- that they must stay shut on a reload -- and held it on purpose, so that wiring one up was a
// decision made against a failing test. This is that decision, made: the four are now on the same
// memory as Find, Settings and the Library, and every way that memory can be wrong is silent and
// mostly visible only on the SECOND page load (the pass a person testing by hand does not do):
//
//   1. **The flag rides on a saver the user has not necessarily triggered.** A box that is opened
//      and never dragged or resized must still come back -- the shape Tom reported of Find on
//      2026-09-04 (*"It took a few reloads before Find started remembering"*).
//   2. **A corner remembered on a bigger monitor must be clamped back into this window**, by the
//      opener itself and not by a restore-time placement of its own.
//   3. **A run report with no run.** openRunReportBox() refuses with a notice when there is no .rpt
//      -- correct for a menu row, wrong for a restore, where a refusal would silently drop the box
//      the reader left open. Restored, it opens with its own "no report yet" sentence inside.
//   4. **Closing a box that was never opened must not create its key**: Escape and the closers run
//      whether or not the box is showing.
//   5. **A reload is a second loadLoopedNetwork(), not a reset of the variables** -- see the sibling
//      harness's note. A second instance over the same localStorage has no memory of the first.
//
// The report CONTENTS are stubbed out: rebuildFireFlowReport(), rebuildEnergyReport() and
// runScenarioCompare() each have a harness of their own, and this one is about the box, not what
// is in it. A function declaration is a mutable binding inside the page's closure, so the
// injection can point each at a no-op.

'use strict';

const { byId, ensure, loadLoopedNetwork, clearResizeObservers, flushResizeObservers } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\tstubReports: function () { rebuildFireFlowReport = function () {}; buildFireFlowControls = function () {};\n" +
	"\t\t\trebuildEnergyReport = function () {}; runScenarioCompare = function () { return null; }; },\n" +
	"\t\twireAll: function () { wireFireFlowBox(); wireEnergyBox(); wireScenarioCompareBox(); wireRunReportBox(); },\n" +
	"\t\topen: { ff: openFireFlowBox, energy: openEnergyBox, cmp: openScenarioCompareBox, rpt: openRunReportBox },\n" +
	"\t\tclose: { ff: closeFireFlowBox, energy: closeEnergyBox, cmp: closeScenarioCompareBox, rpt: closeRunReportBox },\n" +
	"\t\tisOpen: { ff: ffBoxIsOpen, energy: energyBoxIsOpen, cmp: scnCmpBoxIsOpen, rpt: rptBoxIsOpen },\n" +
	"\t\tlayout: { ff: function () { return ffboxLayout; }, energy: function () { return energyboxLayout; },\n" +
	"\t\t\tcmp: function () { return cmpboxLayout; }, rpt: function () { return rptboxLayout; } },\n" +
	"\t\tel: { ff: ffBoxEl, energy: energyBoxEl, cmp: scnCmpBoxEl, rpt: rptBoxEl },\n" +
	"\t\trestoreOpenBoxes: restoreOpenBoxes,\n" +
	"\t\twipeAllStorage: wipeAllStorage,\n" +
	"\t\tsmallScreen: smallScreen,\n";

const KEYS = { ff: 'lpn_ffbox', energy: 'lpn_energybox', cmp: 'lpn_cmpbox', rpt: 'lpn_reportbox' };
const IDS = { ff: 'lpn_ff_box', energy: 'lpn_energy_box', cmp: 'lpn_scncmp_box', rpt: 'lpn_rptbox' };
const NAMES = Object.keys(KEYS);

// The markup each opener reaches without a guard, and the notice line the run report writes to.
['lpn_ff_box', 'lpn_ff_close', 'lpn_ff_run_box', 'lpn_energy_box', 'lpn_energy_close',
	'lpn_scncmp_box', 'lpn_scncmp_close', 'lpn_rptbox', 'lpn_rptbox_pre', 'lpn_rptbox_close',
	'lpn_rptbox_copy', 'lpn_map_notice', 'lpn_menu_popup', 'lpn_menu_popup2'].forEach(ensure);
NAMES.forEach((n) => { byId[IDS[n]].style.display = 'none'; });

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function stored(k) {
	const raw = global.localStorage.getItem(k);
	return raw === null ? null : JSON.parse(raw);
}
function keyNames() {
	const out = [];
	for (let i = 0; i < global.localStorage.length; i++) { out.push(global.localStorage.key(i)); }
	return out.sort();
}
function wipe() { keyNames().forEach((k) => global.localStorage.removeItem(k)); }
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
// A fresh page over whatever storage holds: the inline display:none back on every box, the old
// page's observers retired, a module that has never seen any of this, wired the way init() wires.
function reload() {
	NAMES.forEach((n) => { byId[IDS[n]].style.display = 'none'; });
	clearResizeObservers();
	const P = loadLoopedNetwork(INJECT);
	P.stubReports();
	P.wireAll();
	return P;
}
// A drag of the box's own chrome, as makePanelDraggable() sees one.
function dragTo(box, left, top) {
	if (!box.setPointerCapture) { box.setPointerCapture = () => {}; box.releasePointerCapture = () => {}; box.hasPointerCapture = () => false; }
	const r = box.getBoundingClientRect();
	fire(box, 'pointerdown', { target: box, pointerId: 7, clientX: r.left + 20, clientY: r.top + 10, preventDefault() {} });
	fire(box, 'pointermove', { pointerId: 7, clientX: left + 20, clientY: top + 10 });
	fire(box, 'pointerup', { pointerId: 7 });
}

console.log('\n--- opened and never touched: the flag alone brings a box back ---');
{
	wipe();
	const A = reload();
	NAMES.forEach((n) => {
		A.open[n](n === 'rpt');   // the run report has no .rpt here, so it is opened as a restore would open it
		ok(n + ': opens', A.isOpen[n]() === true, byId[IDS[n]].style.display);
		const rec = stored(KEYS[n]);
		ok(n + ': the open flag is stored on open, with no drag and no resize', !!rec && rec.open === true, JSON.stringify(rec));
		ok(n + ': and no corner yet, because none was chosen', !!rec && rec.left === null && rec.top === null);
	});
	ok('four keys, one per box, and nothing else', keyNames().join(',') === Object.values(KEYS).sort().join(','), keyNames().join(','));
	const B = reload();
	B.restoreOpenBoxes();
	NAMES.forEach((n) => ok(n + ': came back after a reload', B.isOpen[n]() === true, byId[IDS[n]].style.display));
	ok('the run report came back with its own "no report yet" sentence inside, not empty',
		/no run report yet/i.test(byId.lpn_rptbox_pre.textContent), byId.lpn_rptbox_pre.textContent);
	NAMES.forEach((n) => {
		B.close[n]();
		ok(n + ': closing stores open:false', stored(KEYS[n]).open === false);
	});
	const C = reload();
	C.restoreOpenBoxes();
	NAMES.forEach((n) => ok(n + ': and a closed box stays closed on the next load', C.isOpen[n]() !== true, byId[IDS[n]].style.display));
}

console.log('\n--- a box first opens centred, and then where it was dragged to ---');
{
	wipe();
	const A = reload();
	A.open.ff();
	const box = A.el.ff();
	// The stub measures every element as 1000x500 in a 1200x900 window.
	ok('first open is centred', box.style.left === '100px', box.style.left);
	dragTo(box, 150, 200);
	const rec = stored(KEYS.ff);
	ok('a drag stores the corner', !!rec && rec.left === 150 && rec.top === 200, JSON.stringify(rec));
	const B = reload();
	B.restoreOpenBoxes();
	ok('and the reload opens the box at that corner', B.el.ff().style.left === '150px' && B.el.ff().style.top === '200px',
		B.el.ff().style.left + ',' + B.el.ff().style.top);
	// **A DRAGGED CORNER IS RESTORED WITH ITS OVERHANG, down to one grabbable sliver** (Tom,
	// 2026-09-08: *"Report boxes, Settings, and reload: They all preserve except that they jump
	// down, up, left, or right to fit inside the map. Overhangs are not preserved."*). This used to
	// assert the box came back WHOLLY inside the window, which is what he was reporting: a box he
	// had deliberately parked hanging off an edge was hauled back on every reload. placeBoxRemembered()
	// now uses restoreBounds() instead of clampPanel(), and the ONE thing it will not give up is
	// LPN_DRAG_SLIVER px of the box on screen -- enough of the full-width drag band to take hold of
	// and pull it back. Read out of js/looped-network.js, never retyped.
	const SLIVER = +(/var LPN_DRAG_SLIVER = (\d+);/.exec(
		require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8')
	) || [])[1];
	ok('LPN_DRAG_SLIVER is read out of the page', SLIVER > 0, String(SLIVER));
	global.localStorage.setItem(KEYS.energy, JSON.stringify({ left: 5000, top: 4000, w: null, h: null, open: true }));
	const C = reload();
	C.restoreOpenBoxes();
	const e = C.el.energy();
	const eL = parseFloat(e.style.left), eT = parseFloat(e.style.top);
	ok('a corner off a 32-inch monitor still leaves a sliver of the drag band on this one',
		C.isOpen.energy() && eL <= 1200 - SLIVER && eL + 1000 > 0 && eT <= 900 - SLIVER && eT >= 0,
		e.style.left + ',' + e.style.top);
	// And a corner that WAS on this screen is left exactly where it was, overhang and all: the box
	// dragged to (150, 200) above came back at (150, 200), which is the assertion two above this.
	global.localStorage.setItem(KEYS.cmp, JSON.stringify({ left: -300, top: 700, w: null, h: null, open: true }));
	const D = reload();
	D.restoreOpenBoxes();
	const d = D.el.cmp();
	ok('...and a deliberate overhang is kept rather than squared up',
		parseFloat(d.style.left) === -300 && parseFloat(d.style.top) === 700,
		d.style.left + ',' + d.style.top);
}

console.log('\n--- the resize observer stores the size, and only while the box is open ---');
{
	wipe();
	const A = reload();
	flushResizeObservers();
	ok('an observer firing over four closed boxes writes nothing', keyNames().length === 0, keyNames().join(','));
	A.open.cmp();
	flushResizeObservers();
	const rec = stored(KEYS.cmp);
	ok('open, the measured width is stored', !!rec && rec.w === 1000, JSON.stringify(rec));
	ok('...and the flag survived the observer\'s write', !!rec && rec.open === true);
}

console.log('\n--- closing a box that was never opened creates no key ---');
{
	wipe();
	const A = reload();
	NAMES.forEach((n) => A.close[n]());
	ok('four closes on four closed boxes wrote nothing', keyNames().length === 0, keyNames().join(','));
}

console.log('\n--- Clear everything takes the four keys with it ---');
{
	wipe();
	const A = reload();
	NAMES.forEach((n) => A.open[n](n === 'rpt'));
	ok('four keys before the wipe', keyNames().length === 4);
	A.wipeAllStorage();
	ok('none after it', Object.values(KEYS).every((k) => stored(k) === null), keyNames().join(','));
}

console.log('\n--- a phone stores the flag and not the geometry ---');
{
	wipe();
	global.window.innerWidth = 400;
	const A = reload();
	ok('the stub is a phone now', A.smallScreen() === true);
	A.open.ff();
	const box = A.el.ff();
	dragTo(box, 50, 60);
	flushResizeObservers();
	const rec = stored(KEYS.ff);
	ok('open is stored', !!rec && rec.open === true, JSON.stringify(rec));
	ok('but no corner and no size, which would only ever be felt on a desktop',
		!!rec && rec.left === null && rec.top === null && rec.w === null && rec.h === null, JSON.stringify(rec));
	global.window.innerWidth = 1200;
}

console.log('\n--- what the source has to keep saying ---');
{
	const fs = require('fs'), path = require('path');
	const src = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
	// Each key is written by a direct `localStorage.setItem(<CONST>` -- the shape
	// lpn_furniture_check.php derives the furniture list from. A computed key would pass every
	// harness here and be invisible to that check.
	['LPN_FFBOX_KEY', 'LPN_ENERGYBOX_KEY', 'LPN_CMPBOX_KEY', 'LPN_RPTBOX_KEY'].forEach((c) => {
		ok(c + ' is written directly, so the furniture check can see it',
			src.indexOf('localStorage.setItem(' + c + ',') > 0);
	});
	ok('serializeProject() knows none of the four',
		!/function serializeProject[\s\S]*?\n\t\}/.exec(src)[0].match(/ffboxLayout|energyboxLayout|cmpboxLayout|rptboxLayout|lpn_ffbox|lpn_energybox|lpn_cmpbox|lpn_reportbox/));
}

console.log(fails ? `\n${fails} report-box-memory check(s) FAILED.` : '\nAll report-box-memory checks passed.');
process.exit(fails ? 1 : 0);
