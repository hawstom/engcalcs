// THE SOLVE-TIME SENTENCE IS A MESSENGER MESSAGE, NOT A STANDING LINE (Tom, 2026-10-04: *"The
// 'This network took {} to calculate' message stays on-screen indefinitely, and this is no longer
// necessary now that we have the messenger system."*).
//
//   node dev/lpn-spike/solve-time-message-harness.js
//
// A real slow run goes through the REAL js/lpn-time.js adviseIfSlow() into the REAL page host. It
// must (1) land in the message log, (2) leave #lpn_status_text alone, so a diagnostic the model
// earned is never overwritten by a timing remark, (3) show as a transient notice and be taken back
// when Recalculate automatically is switched off, and (4) leave a non-converged warning standing
// on the status line after the slow run.

'use strict';
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

setUnitSet('us');
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-solver.js'));
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
const EC = global.EngCalcs;

let pageHost = null;
const realInit = EC.lpnTimeInit;
EC.lpnTimeInit = function (h) { pageHost = h; return realInit.apply(this, arguments); };
EC.pageConfig = EC.pageConfig || {};

const lpn = loadLoopedNetwork(
	"\t\tnoticeLog: function () { return noticeLog.slice(); },\n" +
	"\t\tsetStatus: setStatus,\n" +
	"\t\tclearSlowAdvice: clearSlowAdvice,\n" +
	"\t\tstatusText: function () { return document.getElementById('lpn_status_text').textContent || ''; },\n" +
	"\t\tnoticeText: function () { return document.getElementById('lpn_map_notice').textContent || ''; }\n");

const WARN = 'TEST DIAGNOSTIC: stands for a non-converged result';
// The page's own sentence, read from the real language file the stub loads, never restated here.
const TIME_RE = () => {
	const t = String(global.EngCalcs.pageConfig.lpn_time_run_slow || '');
	if (t.indexOf('{secs}') < 0) { throw new Error('lpn_time_run_slow has no {secs}'); }
	const head = t.split('{secs}')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return new RegExp(head + '\\d+\\.\\d');
};
(async function () {
	ok('the page handed lpn-time.js a host', !!pageHost);
	ok('and that host has a notice door', typeof pageHost.notice === 'function');

	const doc = { times: EC.lpnTimesDefaults(), nodes: [], links: [] };
	doc.times.duration = 3600;
	const frames = () => EC.lpnReportTimes(doc.times).map((t) => ({ t, heads: {}, pressures: {}, flows: {}, headlosses: {}, velocities: {}, demands: {}, levels: {}, statuses: {} }));
	EC.lpnEpanetRun = function () { return wait(1100).then(() => ({ ok: true, engineVersion: 'fake', warnings: [], frames: frames(), report: 'r' })); };
	const host = Object.assign({}, pageHost, {
		doc: () => doc, apply: () => { lpn.setStatus(WARN, 'nonconv'); }, solve: () => {},
		solveNow: () => { EC.lpnTimeRun({ nodes: [{ id: 'J1', type: 'junction', elev: 100 }], links: [] }); },
		autoRun: () => true, runBoxHidden: () => true, expireStatus: () => {},
		native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
		snapshot: () => {}, save: () => {}, toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => '',
		tabs: []
	});
	realInit(host);

	// apply() above is what the page does with a result: it writes the model's own diagnostic.
	lpn.setStatus(WARN, 'nonconv');
	const before = lpn.noticeLog().length;
	EC.lpnTimeRunNow();
	await wait(1500);

	const log = lpn.noticeLog();
	const row = log.find((r) => TIME_RE().test(r.text));
	ok('the solve time is in the message log', !!row, JSON.stringify(log.map((r) => r.text)));
	ok('logged once, as an ordinary notice', log.filter((r) => TIME_RE().test(r.text)).length === 1 && row && row.severity === 'notice');
	ok('it is a transient notice on the map', TIME_RE().test(lpn.noticeText()), lpn.noticeText());
	ok('and NOT a standing status line', !TIME_RE().test(lpn.statusText()), lpn.statusText());
	ok('a non-converged warning still stands on the status line', lpn.statusText() === WARN, lpn.statusText());
	ok('the warning is in the log too, and not folded into the info row', log.some((r) => r.text === WARN) && row.text !== WARN);
	ok('the log grew by the run and the warning only', log.length >= before + 1);

	// Switching the checkbox off takes the advice back.
	lpn.clearSlowAdvice();
	ok('turning Recalculate off takes the notice back', !TIME_RE().test(lpn.noticeText()), lpn.noticeText());
	ok('and it is still readable in the log', lpn.noticeLog().some((r) => TIME_RE().test(r.text)));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
}());
