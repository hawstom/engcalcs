// **A DOCUMENT THAT WILL NOT PARSE LEAVES A NAMED TAB OVER A BLANK MAP. THE PAGE MUST NOT THEN
// SAVE OVER IT.** (ROADMAP Task 627; incident in dev/lpn-blank-map-incidents.md, 2026-09-10)
//
//   node dev/lpn-spike/blank-map-harness.js
//
// Tom restarted his computer, opened the local lpn, and after a reload: "Net3 disappeared. The
// project tab name is the only thing left ... The project is still in storage. But the map is
// blank." No error of any kind in the console -- the whole failure was silent.
//
// THE MECHANISM, which was a gap BETWEEN two branches rather than a fault inside either:
//
//   var opening = initLibrary(), bornClean = false;
//   if (opening) { applySaved(opening); ... }
//   else if (!indexEntry(library.openId)) { ...register a fresh project... }
//
// initLibrary() returns null when the open project's stored document does not parse. But it has
// already guaranteed `library.openId` names a real index entry -- its last act before reading the
// document is `if (!indexEntry(library.openId)) { library.openId = library.projects[0].id; }`. So
// `opening` was null AND `indexEntry()` truthy, and NEITHER branch ran. Nothing applied, nothing
// created, nothing thrown. The tab strip rendered the name out of the index and the map drew an
// empty `doc`.
//
// **THE LOSS WAS THE AUTOSAVE, NOT THE CORRUPTION.** The bytes are still on disk at that moment and
// are the only copy of the work. saveToStorage() then wrote serializeProject() -- the empty doc --
// over that key on the solve debounce, and the recoverable state was gone.
//
// **THE FIX IS A THIRD STATE, WHICH IS WHAT SECTIONS 2 AND 3 NOW ASSERT.** Unreadable is not "first
// visit": creating a fresh project there overwrites the bytes just as surely. So initLibrary()
// records the id, init() takes its own branch, saveToStorage() REFUSES to write over that key, and
// setStorageError(true, 'unreadable') tells the reader in the status line and in a modal. Nothing
// is repaired and nothing is guessed at; the bytes are left for a person to deal with.
//
// Why the index entry survives to trigger it: adoptOrphans() drops an entry whose key is ABSENT
// (`getItem(...) !== null`), so a key that is PRESENT and unparseable passes the filter and then
// fails at JSON.parse. An unclean shutdown is one way to get a truncated value. That is deliberate
// and stays: dropping the entry would delete the tab that is the only sign the work exists.

const { loadLoopedNetwork, byId, setUnitSet, clearResizeObservers } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
// The stub's alert is a no-op, so the refusal's modal has nowhere to be seen. Capture it: "the user
// is told" is half of what this task closed, and an assertion that cannot see the telling is an
// assertion about the other half only.
let alerts = [];
global.alert = global.window.alert = (msg) => { alerts.push(String(msg)); };
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
// The deferred map sizing must not run behind the test's back; this harness never needs a sized
// canvas, only the storage decisions init() makes before one exists.
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

const INJECT =
	"\t\tinit: init, saveToStorage: saveToStorage, indexEntry: indexEntry,\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tgetLibrary: function () { return library; }\n";

function boot() {
	clearResizeObservers();
	const L = loadLoopedNetwork(INJECT);
	L.init();
	return L;
}
const PKEY = (id) => 'lpn_project_' + id;
const PC = global.EngCalcs.pageConfig;

// ---- 1. A REAL PROJECT, SAVED -------------------------------------------------------------
console.log('--- a project with a network in it, autosaved to storage ---');
const first = boot();
const openId = first.getLibrary().openId;
const savedName = first.indexEntry(openId).name;
{
	const a = first.addNode('junction', 100, 100);
	const b = first.addNode('junction', 300, 100);
	first.addLink('pipe', a.id, b.id);
	first.saveToStorage();

	const raw = localStorage.getItem(PKEY(openId));
	const parsed = JSON.parse(raw);
	check(parsed.nodes.length === 2, 'two nodes reached storage', 'nodes=' + parsed.nodes.length);
	check(parsed.links.length === 1, 'and one link', 'links=' + parsed.links.length);
	check(!!savedName, 'the project has a name in the index', savedName);
}

// ---- 2. THE CORRUPT DOCUMENT: a named tab over a blank map --------------------------------
//
// Truncated, which is what a partially-written value looks like. The key is PRESENT -- that is
// the whole point, and it is what walks past adoptOrphans().
console.log('--- reload, with the stored document truncated ---');
let corrupt;
{
	const raw = localStorage.getItem(PKEY(openId));
	corrupt = raw.slice(0, Math.floor(raw.length * 0.6));
	localStorage.setItem(PKEY(openId), corrupt);
	let parses = true;
	try { JSON.parse(corrupt); } catch (e) { parses = false; }
	check(!parses, 'the stored document no longer parses', corrupt.length + ' chars, was ' + raw.length);
	check(localStorage.getItem(PKEY(openId)) !== null,
		'but the KEY IS STILL PRESENT, so adoptOrphans() keeps the index entry');
}

const after = boot();
{
	const entry = after.indexEntry(after.getLibrary().openId);
	check(!!entry, 'THE TAB SURVIVES: the index still names the project', entry && entry.name);
	check(!!entry && entry.name === savedName, 'and it is the same name Tom would still see',
		entry && entry.name);
	check(after.getLibrary().openId === openId, 'still pointing at the same project id');

	const d = after.getDoc();
	check(d.nodes.length === 0 && d.links.length === 0,
		'the map is blank: there was nothing readable to apply',
		'nodes=' + d.nodes.length + ' links=' + d.links.length);

	// **AND THE READER IS TOLD, WHICH IS THE HALF THE ORIGINAL DEFECT HAD NONE OF.** Asserted
	// against pageConfig, never against the English: harness_wording_check.php is a ratchet, and a
	// pinned literal would tax the next rewording with a red build.
	const said = PC.lpn_storage_unreadable;
	check(!!said, 'the page supplies lpn_storage_unreadable');
	check(alerts.length === 1 && alerts[0] === said,
		'THE USER IS TOLD: one modal, carrying lpn_storage_unreadable',
		alerts.length + ' alert(s)');
	check(byId.lpn_status_text.textContent === said,
		'and the status line says the same thing');
}

// ---- 3. THE AUTOSAVE THAT USED TO TURN A BLANK MAP INTO A LOST PROJECT -------------------
//
// The user's bytes are still on disk here, and they are the only copy. This is the write that
// used to end that, and it must now do nothing at all.
console.log('--- the solve debounce fires one autosave ---');
{
	const before = localStorage.getItem(PKEY(openId));
	check(before === corrupt, 'before the autosave, the truncated original is still on disk',
		before.length + ' chars');

	after.saveToStorage();

	const now = localStorage.getItem(PKEY(openId));
	check(now === corrupt, 'THE BYTES SURVIVE: the autosave refused to write over them',
		now === null ? 'the key is gone' : now.length + ' chars');
	check(alerts.length === 1, 'and the reader is not told a second time per debounce',
		alerts.length + ' alert(s)');

	// Ten more, because the refusal has to hold for the whole session and not just the first frame.
	for (let n = 0; n < 10; n++) { after.saveToStorage(); }
	check(localStorage.getItem(PKEY(openId)) === corrupt,
		'and it still holds after ten more autosaves');

	// The index must not have been quietly emptied either -- the tab is the only sign the work
	// exists, and a project nobody can see is the same loss wearing a tidier face.
	const entry = after.indexEntry(openId);
	check(!!entry && entry.name === savedName, 'the tab is still there to be dealt with by a person',
		entry && entry.name);
}

// ---- 4. A SIBLING PROJECT IS UNAFFECTED ---------------------------------------------------
//
// The refusal is keyed on the id that could not be read, not on "something went wrong once".
console.log('--- a second project in the same library still saves ---');
{
	const good = 'pgood' + Date.now().toString(36);
	localStorage.setItem(PKEY(good), JSON.stringify({ v: 1, nodes: [], links: [] }));
	const lib = after.getLibrary();
	lib.projects.push({ id: good, name: 'Sibling', updated: 0 });
	lib.openId = good;
	after.addNode('junction', 50, 50);
	after.saveToStorage();
	let wrote = null;
	try { wrote = JSON.parse(localStorage.getItem(PKEY(good))); } catch (e) {}
	check(!!wrote && (wrote.nodes || []).length === 1,
		'the sibling project was written normally', wrote ? 'nodes=' + (wrote.nodes || []).length : 'unparseable');
	check(localStorage.getItem(PKEY(openId)) === corrupt,
		'and the unreadable document is STILL untouched');
}

console.log('\n' + (failures ? 'FAIL ' : 'ok   ') + (checks - failures) + '/' + checks + ' checks');
process.exit(failures ? 1 : 0);
