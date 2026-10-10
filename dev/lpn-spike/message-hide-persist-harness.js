// HIDDEN MESSAGES SURVIVE A RELOAD, THE ENGINE NOTES HIDE TOO, AND THREE MESSAGES WAIT FOR THEIR
// CONDITION. Run:  node dev/lpn-spike/message-hide-persist-harness.js
//
// Tom, 2026-10-09: H09 "this should not be lost on reload." H10 the timed engine-difference notes get
// the x too, "so hidden means hidden." H11 storage full, storage unreadable and unit unknown stay
// hidden until the condition changes, not until the next edit or run.
//
// The reload is modelled the way the stub's own note says: a SECOND module over the same
// localStorage. The real-Chrome reload is in message-dismiss-x-harness.js.
const { setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet, byId } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\trunSolve: runSolve, getDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tlibrary: library, setStatus: setStatus, setStorageError: setStorageError,\n" +
	"\t\twireStatusHide: wireStatusHide, clearStatusHidden: clearStatusHidden, initLibrary: initLibrary,\n" +
	"\t\tsaveToStorage: saveToStorage, buildDom: buildDom, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tresetEngineNotes: resetEngineNotes, unhideEngineNotes: unhideEngineNotes, unhideStatus: unhideStatus,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tstatusHiddenText: statusHiddenText,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const text = () => byId.lpn_status_text.textContent || '';
const notes = () => byId.lpn_status_notes.textContent || '';
const xShown = () => byId.lpn_status_dismiss.style.display !== 'none';
const boxShown = () => byId.lpn_status.style.display === 'block';
function clickX() { (byId.lpn_status_dismiss._listeners.click || []).slice().forEach((f) => f({})); }
const PC = () => global.EngCalcs.pageConfig;
const stored = () => global.localStorage.getItem('lpn_msghidden');

function oneJunction(L) {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.nodes.push({ id: 'J1', type: 'junction', x: 0, y: 0, elev: 0, _demand: 10 });
}
function manningLine(L) {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	doc.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [], _diameter: 200, _roughness: 0.013, _length: 1000, _k: 5, _status: 'open' });
}

async function main() {
	setUnitSet('si');
	await warmEpanet();
	let L = loadLoopedNetwork(INJECT);
	L.buildLayers();
	L.seedDefaultInputs();
	L.wireStatusHide();
	L.library.openId = 'P1';
	oneJunction(L);
	L.buildDom();

	console.log('=== H09. a hidden diagnostic is remembered across a reload, as hashes ===');
	L.runSolve();
	const said = text();
	ok('a diagnostic is standing, with the x', said.length > 0 && xShown(), JSON.stringify(said));
	clickX();
	ok('the x hides it and the box goes', text() === '' && !boxShown());
	const raw = stored();
	ok('the browser holds it under lpn_msghidden', !!raw, String(raw));
	ok('...as the project id and a hash, never the words', raw && raw.indexOf('J1') < 0 && raw.toLowerCase().indexOf('reservoir') < 0 && /"diag"/.test(raw), String(raw));
	L.runSolve();
	ok('an edit or run that says it again leaves it hidden', text() === '' && L.statusHiddenText() === said);

	// A RELOAD: a second module over the same storage; opening the same project, then its first solve.
	L = loadLoopedNetwork(INJECT);
	L.buildLayers(); L.seedDefaultInputs(); L.wireStatusHide();
	L.library.openId = 'P1';
	oneJunction(L); L.buildDom();
	L.clearStatusHidden();       // the project opens
	L.setStatus('');             // ...and the page states nothing yet
	L.runSolve();                // ...and then solves
	ok('after the reload the same message is still hidden', text() === '' && !boxShown(), JSON.stringify(text()));
	ok('...and it is the top hidden row\'s text', L.statusHiddenText() === said);
	// The condition changes: a reservoir is added, then removed again.
	manningLine(L); L.runSolve();
	oneJunction(L); L.runSolve();
	ok('fixed and broken again, it shows again', text() === said && boxShown());
	ok('...and the browser forgot it meanwhile', stored() === null, String(stored()));

	console.log('\n=== H09. a different network clears it; a hidden run message is stored too (Tom, 2026-10-10) ===');
	clickX();
	L.library.openId = 'P2';
	L.clearStatusHidden();
	ok('opening another network ends the hiding, in storage too', stored() === null && L.statusHiddenText() === '');
	L.setStatus('Run finished in 3 s.');
	clickX();
	ok('a hidden run summary is hidden now', text() === '');
	ok('...and stored, as a hash with the kind run', /"run"/.test(String(stored())) && String(stored()).indexOf('Run finished') < 0, String(stored()));

	console.log('\n=== H10. the x hides the engine-difference note too ===');
	manningLine(L);
	L.library.openId = 'P2';
	L.settings().engine = 'epanet'; L.settings().method = 'manning';
	L.resetEngineNotes();
	L.runSolve(); await settleEpanet();
	ok('the note is standing', /Manning equation/i.test(notes()), notes());
	ok('...and the x is there', xShown());
	clickX();
	ok('the x hides the note: nothing of it on the map', notes() === '' && text() === '' && !boxShown(), JSON.stringify([notes(), text(), boxShown()]));
	ok('...and Show brings it back', (L.unhideEngineNotes(), /Manning equation/i.test(notes())));
	L.resetEngineNotes();

	console.log('\n=== H11. storage full waits for storage to free up ===');
	oneJunction(L); L.buildDom();
	// A FULL BROWSER: every write but the hidden-message record is refused until `freed`.
	const realSet = global.localStorage.setItem;
	let freed = false;
	global.localStorage.setItem = function (k, v) {
		if (!freed && k !== 'lpn_msghidden') { throw new Error('QuotaExceededError'); }
		return realSet.call(this, k, v);
	};
	L.setStorageError(true);
	const full = text();
	ok('the storage-full message is standing', full === PC().lpn_storage_full, full);
	clickX();
	ok('hidden', text() === '');
	L.runSolve();   // a run forgets run messages...
	L.setStatus(full, '', false, 'storage-full');   // ...and the failed save says it once more
	ok('a run or another failed save does not bring it back', text() === '', JSON.stringify(text()));
	ok('...it is remembered with its kind', /cond:storage-full/.test(String(stored())), String(stored()));
	freed = true; L.saveToStorage();   // a write took
	ok('storage freeing up forgets it', stored() === null);
	freed = false; L.saveToStorage();
	ok('full again after that: it shows again', text() === full && boxShown(), JSON.stringify(text()));

	console.log('\n=== H11. storage unreadable waits for the document to read ===');
	freed = true;
	L.library.openId = 'P4'; L.library.projects = [{ id: 'P4', name: 'Four' }]; L.saveToStorage();
	const good = global.localStorage.getItem('lpn_project_P4');
	global.localStorage.setItem('lpn_index', JSON.stringify({ projects: [{ id: 'P3', name: 'Three' }], openId: 'P3' }));
	global.localStorage.setItem('lpn_project_P3', '{garbage');
	L.initLibrary();
	L.setStorageError(true, 'unreadable');   // what init() does next
	const unread = text();
	ok('the storage-unreadable message is standing', unread === PC().lpn_storage_unreadable, unread);
	clickX();
	ok('hidden', text() === '');
	L.runSolve(); L.setStatus('');
	L.setStorageError(false); L.setStorageError(true, 'unreadable');
	ok('a sibling write and a repeat do not bring it back', text() === '' && L.statusHiddenText() === unread, JSON.stringify(text()));
	global.localStorage.setItem('lpn_project_P3', good);   // a good copy is now stored
	L.initLibrary();
	ok('the document reads: the hiding is forgotten', stored() === null, String(stored()));

	console.log('\n=== H11. unit unknown waits for the unit to be recognised ===');
	manningLine(L);
	L.settings().engine = 'builtin';
	const base = L.readUnitSelections();
	L.applyUnitSelections(Object.assign({}, base, { lpn_u_length: 'furlong_per_fortnight' }));
	L.runSolve();
	const unk = text();
	ok('"a unit this page does not offer" is standing', /furlong_per_fortnight/.test(unk), unk);
	clickX();
	ok('hidden', text() === '');
	L.runSolve(); L.runSolve();
	ok('further runs keep it hidden', text() === '' && L.statusHiddenText() === unk, JSON.stringify(text()));
	L.applyUnitSelections(base);
	L.runSolve(); await settleEpanet();
	ok('the unit is recognised: the hiding is forgotten', stored() === null, String(stored()));
	L.applyUnitSelections(Object.assign({}, base, { lpn_u_length: 'furlong_per_fortnight' }));
	L.runSolve();
	ok('the unit unknown again: it shows again', text() === unk && boxShown(), JSON.stringify(text()));

	console.log('\n' + checks + ' checks, ' + fails + ' failed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
