// THE EPANET RUN REPORT'S OWN BOX -- ROADMAP Task 570. Run with:
//
//   node dev/lpn-spike/run-report-box-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-02: *"EPANET report: How about we make that another draggable,
// sizeable, modal box?"*, corrected the same day to *"I meant non-modal."* Before this the .rpt
// lived in a `<details>` inside `#lpn_runbox` -- a PROGRESS dialog with a bar and a percentage --
// and the menu row reopened that dialog purely to hold it. So a report a reader wanted to keep on
// screen was living inside the thing that says how far a run has got.
//
// Three things can go silently wrong in a move like this, and each is a section below:
//
//   1. **The text arrives from the wrong place.** `lpnTimeRunReport()` is the copy the transient
//      run box was rendering and is empty the moment that box closes; `lpnTimeLastReport()` is the
//      document's answer to "what did the engine say last time". Reading the first would give an
//      empty box for every automatic run -- which is the common case, and the exact defect Task 467
//      existed to fix.
//   2. **An empty box.** This page's standing rule is SHOWN, OR EXPLAINED: the built-in solver
//      prints no report at all, so a network that has never reached EPANET has none and never will
//      until it does. A row that quietly does nothing teaches nobody that the report exists.
//   3. **A box that is not one of the family.** The other five are draggable and sizeable through
//      one set of seams. A sixth wired by hand would look identical on the day it shipped and
//      diverge from every one of them afterwards.
//
// **THE COPIER IS DELIBERATELY NOT RE-ASSERTED HERE.** It stayed in js/lpn-time.js, because it
// owns the report's two labels and because its off-screen-textarea route is the only clipboard
// that works on a plain-http deploy. Both of its routes are driven by
// dev/lpn-spike/run-box-harness.js; what this file asserts is that the button REACHES it.

'use strict';

const { byId, ensure, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\topenRunReportBox: openRunReportBox,\n" +
	"\t\tcloseRunReportBox: closeRunReportBox,\n" +
	"\t\twireRunReportBox: wireRunReportBox,\n" +
	"\t\trptBoxIsOpen: rptBoxIsOpen,\n" +
	"\t\trefreshRunReportBoxIfOpen: refreshRunReportBoxIfOpen,\n" +
	"\t\treportMenuRow: function () {\n" +
	"\t\t\tvar pc = EngCalcs.pageConfig || {};\n" +
	"\t\t\treturn reportMenuRows().filter(function (r) {\n" +
	"\t\t\t\treturn r && r.label === (pc.lpn_reports_epanet || 'EPANET run');\n" +
	"\t\t\t})[0] || null;\n" +
	"\t\t},\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const REPORT = 'Page 1  EPANET\n  Node Results:\n  J1   100.00   45.2\n  J2    98.31   43.9\n';
function withReport(text) { global.EngCalcs.lpnTimeLastReport = function () { return text; }; }

ensure('lpn_rptbox');
ensure('lpn_rptbox_pre');
ensure('lpn_rptbox_close');
ensure('lpn_rptbox_copy');
ensure('lpn_map_notice');
const box = byId.lpn_rptbox, pre = byId.lpn_rptbox_pre, notice = byId.lpn_map_notice;

// ------------------------------------------------------------------------------------------------
console.log('=== 1. it draws the LAST run\'s report, not the run box\'s copy ===');
// ------------------------------------------------------------------------------------------------
{
	// The trap in full: the transient box's own copy is empty, as it is after every automatic run
	// and after the box is closed. Reading THAT would give an empty box and this section would be
	// the only thing that ever noticed.
	global.EngCalcs.lpnTimeRunReport = function () { return ''; };
	withReport(REPORT);
	ok('the box opens', L.openRunReportBox() === true);
	ok('...and it is open by the same test restoreOpenBoxes() uses', L.rptBoxIsOpen() === true,
		box.style.display);
	ok('...carrying EPANET\'s own text, unedited', pre.textContent === REPORT,
		JSON.stringify(pre.textContent));
	ok('...and it said nothing on the map, because there was nothing to explain',
		!notice.textContent, JSON.stringify(notice.textContent));
}

// ------------------------------------------------------------------------------------------------
console.log('\n=== 2. a new run rewrites what the reader is looking at ===');
// ------------------------------------------------------------------------------------------------
{
	const SECOND = 'Page 1  EPANET  second run\n  Hydraulic Status: balanced\n';
	withReport(SECOND);
	L.refreshRunReportBoxIfOpen();
	ok('an open box follows the run', pre.textContent === SECOND, JSON.stringify(pre.textContent));

	// **AND A RUN THAT PRODUCED NOTHING LEAVES THE LAST ONE STANDING.** Blanking it would put an
	// empty <pre> under a title claiming a report -- the empty box section 3 refuses to open.
	withReport('');
	L.refreshRunReportBoxIfOpen();
	ok('...but a run with no report does not blank it', pre.textContent === SECOND,
		JSON.stringify(pre.textContent));

	// A CLOSED box is not written to at all, which is what keeps this off the solve path's cost.
	L.closeRunReportBox();
	ok('the X closes it', L.rptBoxIsOpen() === false, box.style.display);
	withReport(REPORT);
	L.refreshRunReportBoxIfOpen();
	ok('...and a closed box is left alone', pre.textContent === SECOND,
		JSON.stringify(pre.textContent));
}

// ------------------------------------------------------------------------------------------------
console.log('\n=== 3. SHOWN, OR EXPLAINED -- never an empty box ===');
// ------------------------------------------------------------------------------------------------
{
	withReport('');
	notice.textContent = '';
	const opened = L.openRunReportBox();
	ok('with no report the box refuses to open', opened === false);
	ok('...and it is not on screen', L.rptBoxIsOpen() === false, box.style.display);
	ok('...and the reader is told why, in a sentence naming the EPANET solver',
		/EPANET/.test(notice.textContent || ''), JSON.stringify(notice.textContent));
	// The menu ROW is unconditional for the same reason: a row that disappears teaches nobody that
	// the report exists. This is the row itself, read out of the menu it is built into.
	const row = L.reportMenuRow();
	ok('the menu row is there even with no report to show', !!row && typeof row.fn === 'function');
	notice.textContent = '';
	row.fn();
	ok('...and pressing it explains rather than opening a blank box',
		L.rptBoxIsOpen() === false && /EPANET/.test(notice.textContent || ''),
		JSON.stringify(notice.textContent));
	withReport(REPORT);
	row.fn();
	ok('...and with a report it opens the box', L.rptBoxIsOpen() === true, box.style.display);
	L.closeRunReportBox();
}

// ------------------------------------------------------------------------------------------------
console.log('\n=== 4. it is the SIXTH box, wired through the family\'s own seams ===');
// ------------------------------------------------------------------------------------------------
{
	// Read out of the source rather than by driving a pointer, because what is being asserted is
	// that this box went through `makePanelDraggable()` and `addPanelResizeGrip()` at all -- a box
	// wired by hand would drag and resize on the day it shipped and diverge from the other five
	// afterwards, which no gesture test would ever see.
	const fs = require('fs');
	const src = fs.readFileSync(require('path').join(__dirname, '../../js/looped-network.js'), 'utf8');
	const at = src.indexOf('function wireRunReportBox(');
	const body = src.substring(at, src.indexOf('\n\t}', at));
	ok('wireRunReportBox() calls makePanelDraggable()', at > 0 && body.indexOf('makePanelDraggable(') > 0);
	ok('...and addPanelResizeGrip()', body.indexOf('addPanelResizeGrip(') > 0);
	ok('...and the Copy button reaches js/lpn-time.js\'s copier, not a second one here',
		body.indexOf('lpnCopyText') > 0, body);
	const openAt = src.indexOf('function openRunReportBox(');
	const openBody = src.substring(openAt, src.indexOf('\n\t}', openAt));
	ok('openRunReportBox() places itself with placePanelForScreen()',
		openAt > 0 && openBody.indexOf('placePanelForScreen(') > 0);
	ok('...and closeRunReportBox() closes through hidePanel(), which also sweeps the tips',
		/function closeRunReportBox\(\) \{ hidePanel\(rptBoxEl\(\)\); \}/.test(src));
	// The run box offers a DOOR and draws nothing, which is the whole of the move.
	const timeSrc = fs.readFileSync(require('path').join(__dirname, '../../js/lpn-time.js'), 'utf8');
	ok('js/lpn-time.js no longer renders the report itself',
		timeSrc.indexOf('lpn-runbox-pre') < 0 && timeSrc.indexOf("el('details'") < 0);
	ok('...it opens this box instead', timeSrc.indexOf('lpnOpenRunReportBox') > 0);
	// The ASSIGNMENT, not the identifier: the note recording the removal names it, and that note is
	// the thing that stops it being re-added by habit.
	ok('...and lpnTimeShowReport() is gone with the <details> it existed to open',
		!/EC\.lpnTimeShowReport\s*=/.test(timeSrc));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall run-report-box checks passed');
process.exit(fails ? 1 : 0);
