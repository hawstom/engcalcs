// **A DOCUMENT THAT WILL NOT PARSE LEAVES A NAMED TAB OVER A BLANK MAP -- AND THE NEXT AUTOSAVE
// DESTROYS IT.** (ROADMAP Task 627; incident in dev/lpn-blank-map-incidents.md, 2026-09-10)
//
//   node dev/lpn-spike/blank-map-harness.js
//
// Tom restarted his computer, opened the local lpn, and after a reload: "Net3 disappeared. The
// project tab name is the only thing left ... The project is still in storage. But the map is
// blank." No error of any kind in the console -- the whole failure is silent.
//
// THE MECHANISM, which is a gap BETWEEN two branches rather than a fault inside either:
//
//   var opening = initLibrary(), bornClean = false;
//   if (opening) { applySaved(opening); ... }
//   else if (!indexEntry(library.openId)) { ...register a fresh project... }
//
// initLibrary() returns null when the open project's stored document does not parse. But it has
// already guaranteed `library.openId` names a real index entry -- its last act before reading the
// document is `if (!indexEntry(library.openId)) { library.openId = library.projects[0].id; }`. So
// `opening` is null AND `indexEntry()` is truthy, and NEITHER branch runs. Nothing is applied,
// nothing is created, nothing throws. The tab strip renders the name out of the index and the map
// draws an empty `doc`.
//
// **THE LOSS IS THE AUTOSAVE, NOT THE CORRUPTION.** The bytes are still on disk at that moment and
// are the only copy of the work. saveToStorage() then writes serializeProject() -- the empty doc --
// over that key on the solve debounce, and the recoverable state is gone. Section 3 is that write.
//
// Why the index entry survives to trigger it: adoptOrphans() drops an entry whose key is ABSENT
// (`getItem(...) !== null`), so a key that is PRESENT and unparseable passes the filter and then
// fails at JSON.parse. An unclean shutdown is one way to get a truncated value.

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
		'THE MAP IS BLANK: nothing was applied and nothing was created',
		'nodes=' + d.nodes.length + ' links=' + d.links.length);
}

// ---- 3. THE AUTOSAVE THAT TURNS A BLANK MAP INTO A LOST PROJECT ---------------------------
//
// Up to here the user's bytes are still on disk. This is the write that ends that.
console.log('--- the solve debounce fires one autosave ---');
{
	const before = localStorage.getItem(PKEY(openId));
	check(before === corrupt, 'before the autosave, the truncated original is still on disk',
		before.length + ' chars');

	after.saveToStorage();

	const now = localStorage.getItem(PKEY(openId));
	let nowDoc = null;
	try { nowDoc = JSON.parse(now); } catch (e) {}
	check(now !== corrupt, 'THE AUTOSAVE OVERWROTE THE STORED DOCUMENT', 'now ' + now.length + ' chars');
	check(!!nowDoc && (nowDoc.nodes || []).length === 0 && (nowDoc.links || []).length === 0,
		'AND WHAT IT WROTE IS EMPTY -- the work is now unrecoverable',
		nowDoc ? 'nodes=' + (nowDoc.nodes || []).length + ' links=' + (nowDoc.links || []).length : 'unparseable');
	check(now.indexOf('"nodes":[]') >= 0 || (nowDoc && nowDoc.nodes.length === 0),
		'a valid, empty, freshly-serialized project stands where the network was');
}

console.log('\n' + (failures ? 'FAIL ' : 'ok   ') + (checks - failures) + '/' + checks + ' checks');
process.exit(failures ? 1 : 0);
