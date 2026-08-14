// Behavioural test of the repeat-visit signal (ROADMAP Task 200).
//
//   node dev/calc-spike/repeat-visit-harness.js
//
// This one is not about a calculator's math. It is about what js/Calculators.lib.js does with the
// BROWSER -- which cookie and which localStorage keys it reads to decide that a visitor has been
// here before -- and it exists because that decision is invisible from the page and expensive to
// get wrong in a direction nobody would notice.
//
// THE FAILURE THIS GUARDS, stated plainly because it is subtle and it was the whole design
// question. On Looped-Network the tempting probe is `lpn_index`. It is wrong: a brand-new visitor
// gets an index entry the moment init() runs, because the blank project it opens on is registered
// immediately. Probing it would have marked every second page load a "return" and counted
// REOPENING the page as USING it -- destroying the one distinction the signal exists to draw, and
// destroying it silently, as a plausible number nobody could falsify from the report. The document
// key (`lpn_project_<id>`) is written only on a real edit, so it means what it says.
//
// Nothing here is a copy of the code under test: loadCalculator() runs the real
// js/Calculators.lib.js in the real load order of a real rendered page, and the assertions poke
// the sandbox's own browser globals. See dev/calc-spike/calc-page.js.

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('repeat-visit signal (Task 200)');

// Any calculator page will do -- it is loaded for its js/Calculators.lib.js, not its math.
const page = loadCalculator('Manning-Pipe-Flow.php');
const EngCalcs = page.EngCalcs;

// Capture instead of sending. The real _sendOrQueue would reach fetch(), which the sandbox stubs
// to a resolved promise -- so without this the harness would pass whatever logSignal decided.
let signals = [];
EngCalcs.logSignal = function (event, detail) { signals.push(event + '|' + (detail || '')); };

// A localStorage stub with only the two members _hasPriorLocalWork uses. Deliberately minimal: a
// fuller fake would let a future change start depending on something a browser does differently.
function fakeStorage(keys) {
	return { length: keys.length, key(i) { return keys[i]; } };
}
function withStorage(keys) {
	if (keys === null) { delete page.sandbox.localStorage; }
	else { page.sandbox.localStorage = fakeStorage(keys); }
}

r.section('Looped-Network: a saved DOCUMENT is the proof, not the index');

withStorage(['lpn_index']);
r.eq(EngCalcs._hasPriorLocalWork('Looped-Network'), false,
	'lpn_index alone is NOT prior work (a first visit writes one before any edit)');

withStorage(['lpn_index', 'lpn_project_a1b2']);
r.eq(EngCalcs._hasPriorLocalWork('Looped-Network'), true,
	'a saved project document IS prior work');

withStorage(['lpn_document']);
r.eq(EngCalcs._hasPriorLocalWork('Looped-Network'), true,
	'the legacy single-document key counts too (unmigrated long-standing user)');

withStorage([]);
r.eq(EngCalcs._hasPriorLocalWork('Looped-Network'), false, 'empty storage is not prior work');

r.section('the probe is per page, and never throws');

withStorage(['lpn_project_a1b2']);
r.eq(EngCalcs._hasPriorLocalWork('Manning-Pipe-Flow'), false,
	'lpn keys do not make a calculator page look revisited');

withStorage(null);
r.eq(EngCalcs._hasPriorLocalWork('Looped-Network'), false,
	'no localStorage at all (private mode) reads false rather than throwing');

r.section('maybeLogRepeatVisit: the input cookie, and the consent gate');

// The page's own input cookie is the probe everywhere except the map page. Set the sandbox's
// cookie jar directly -- this is the same string document.cookie would hand the real code.
function attempt({ cookie, consented, storage, cookieName }) {
	signals = [];
	page.document.cookie = cookie;
	withStorage(storage === undefined ? [] : storage);
	EngCalcs.cookieName = cookieName || 'Manning-Pipe-Flow';
	EngCalcs.analyticsConsented = function () { return consented; };
	EngCalcs.maybeLogRepeatVisit();
	return signals;
}

r.eq(attempt({ cookie: '', consented: true }).length, 0,
	'a first visit logs nothing (there is no "new" row by design)');

r.eq(attempt({ cookie: 'Manning-Pipe-Flow=v1|18|0.013', consented: true }).join(),
	'repeat|return',
	'a browser carrying this page\'s input cookie is a return');

r.eq(attempt({ cookie: 'ec_language=es; Manning-Pipe-Flow=v1|18', consented: true }).join(),
	'repeat|return',
	'…found among other cookies, anchored so a suffix match cannot fake it');

r.eq(attempt({ cookie: 'NotManning-Pipe-Flow=v1|18', consented: true }).length, 0,
	'a cookie whose name merely ENDS with the page name is not this page');

r.eq(attempt({ cookie: 'Manning-Pipe-Flow=v1|18', consented: false }).length, 0,
	'consent gates the ROW even though the storage it reads needs none');

r.eq(attempt({ cookie: '', consented: true, storage: ['lpn_project_a1b2'], cookieName: 'Looped-Network' }).join(),
	'repeat|return',
	'the map page reaches the same conclusion through localStorage instead');

r.finish();
