// RUNNING A COMMAND DISMISSES THE TIP THAT RAISED IT -- ROADMAP Task 670.
//
//   node dev/lpn-spike/command-tip-harness.js
//
// Tom, 2026-09-15: *"On phone, Map menu and toolbar, Zoom to fit leaves a tip showing."*
//
// **WHY THAT COMMAND AND NOT THE OTHERS IS THE WHOLE EXPLANATION.** Almost everything else on
// those two surfaces OPENS A PANEL, and opening one already calls hideOpenTips() -- so the sweep
// was riding on a side effect rather than being anybody's job. Zoom to fit opens nothing: it
// changes the view and returns. On a pointer the tip then leaves by itself because the mouse moves
// off the button; on TOUCH there is no such motion, so it stands over the map with the command
// already done.
//
// **THIS READS THE SOURCE, and that is deliberate.** The defect is the ABSENCE of a call on one
// path out of several, and a DOM test would assert the presence of one on the path it happened to
// drive -- which is exactly how the original gap survived, every neighbouring command being fine.
// So the claim held here is structural: both surfaces route through one dismissal, and the toolbar
// does it by DELEGATION rather than per button, because a per-button fix is the same fix written
// eleven times and the twelfth button ships without it.
'use strict';
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', '..', 'js', 'looped-network.js');
const src = fs.readFileSync(SRC, 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

console.log('--- there is ONE dismissal, and it does both halves ---');
const fn = /function dismissTipsAfterCommand\(\)\s*\{([\s\S]*?)\n\t\}/.exec(src);
ok('dismissTipsAfterCommand() exists', !!fn);
if (fn) {
	ok('...it hides the open tips', /hideOpenTips\(\)/.test(fn[1]));
	// A menu row is destroyed by closeMenu() a moment earlier, and its tooltip is rendered into
	// document.body -- so it outlives its trigger, and hideTipsIn() walks from a root DOWN to
	// triggers and cannot see one that has none. Without this the menu half stays broken.
	ok('...and sweeps the orphans a closed menu leaves behind', /sweepOrphanTips\(\)/.test(fn[1]));
}

console.log('\n--- every menu row calls it after the command runs ---');
const rows = src.match(/closeMenu\(\); r\.fn\(e\);[^\n]*/g) || [];
ok('both plain-row branches are wired', rows.length === 2, rows.length + ' found');
ok('...and each dismisses AFTER r.fn(), not before',
	rows.length > 0 && rows.every(r => /r\.fn\(e\);\s*dismissTipsAfterCommand\(\);/.test(r)),
	rows.join(' | '));

console.log('\n--- the toolbar is covered by DELEGATION, not per button ---');
const del = /toolbar\.addEventListener\('click',([\s\S]*?)\n\t\t\t\}\);/.exec(src);
ok('the strip itself carries a click listener', !!del);
if (del) {
	ok('...which fires for any button in it', /closest\('button'\)/.test(del[1]));
	ok('...and dismisses', /dismissTipsAfterCommand\(\)/.test(del[1]));
}
// Attached once, or a unit switch and a language relabel stack duplicates on the same element.
ok('it is wired once, not on every rebuild', /!toolbarTipsWired/.test(src)
	&& /toolbarTipsWired = true;/.test(src));

console.log('\n--- and the button that started it is still wired to the command ---');
// **THE BUTTON GAINED A SECOND MODE SINCE THIS WAS WRITTEN** (ROADMAP Task 682): its own click
// listener now decides Zoom to fit vs Zoom Window before calling either, so the direct
// `addEventListener('click', zoomExtent)` this once matched is gone by design -- see
// zoom-control-harness.js for that decision itself. What this still owes the ORIGINAL defect
// (a touch tip left standing after Zoom to fit) is that pressing the button, in its fit-shaped
// state, still reaches zoomExtent() -- through the SAME delegated listener asserted above, which
// dismisses the tip after ANY button's own handler returns, this one included.
const extentClick = /extentBtn\.addEventListener\('click', function \(\) \{([\s\S]*?)\n\t\t\}\);/.exec(src);
ok('Zoom to fit still has its own click handler', !!extentClick);
ok('...and it still runs zoomExtent()', !!extentClick && /\bzoomExtent\(false\);/.test(extentClick[1]));

console.log('\n' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
