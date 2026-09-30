// TASK 747 — A FILE COPIED OUTSIDE THIS PAGE SHARES ITS ORIGINAL'S LOCK. ASK, THEN SPLIT IT.
//
//   node dev/lpn-spike/copy-lock-harness.js
//
// An Explorer copy keeps the document ID baked into the file, and the ID is the lock key, so the
// copy and the original fight over one lock. Tom, 2026-09-30, proposed the question and its gate:
// *"On open under certain gated conditions: 'Mark file as new copy? This file was originally created
// on {date}, but this browser doesn't remember it. Is this the Original file (keep same lock) or a
// Copy (make new lock)?'"*
//
// The gate as built: the file's ID is LOCKED BY ANOTHER BROWSER right now, AND this browser has no
// memory of that ID (not an open tab, not in `lpn_known_docs`). Four things are asserted:
//
//   1. GATE FIRES   -- locked elsewhere, unknown here: Tom's question, with the ID's own minting
//                      time in the visitor's regional format, and nothing lands yet.
//   2. GATE SILENT  -- locked elsewhere but this browser knows the ID: straight to the ordinary
//                      Ask / Open read-only / Cancel / Break lock question. Also silent when nobody
//                      holds the lock.
//   3. "A COPY"     -- the project lands with a NEW docId, takes a lock under the new ID only, and
//                      the old ID gets nothing but the one open-time check: never acquired, stolen
//                      or released. The file is not written; the tab is marked unsaved.
//   4. "ORIGINAL"   -- the ID is remembered, the ordinary lock question follows, and opening the
//                      same file again goes straight to that question.
//
// Driven through the page's own openHandle(), with the broker faked at fetch and a fake file handle
// that counts writes.

const { setUnitSet, byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const posted = [];
// The broker: `lockedIds` are held by somebody else; everything else is free and acquirable.
const lockedIds = new Set();
global.fetch = async function (url, init) {
	const row = {};
	init.body.forEach((v, k) => { row[k] = v; });
	posted.push(row);
	if (row.action === 'check') {
		return { json: async () => (lockedIds.has(row.id)
			? { ok: true, locked: true, mine: false, lockedBy: '', acquiredAt: Math.floor(Date.now() / 1000) - 600 }
			: { ok: true, locked: false, mine: false }) };
	}
	if (row.action === 'acquire') {
		return { json: async () => (lockedIds.has(row.id)
			? { ok: true, held: false, lockedBy: '' }
			: { ok: true, held: true, acquiredAt: Math.floor(Date.now() / 1000) }) };
	}
	return { json: async () => ({ ok: true }) };
};
global.window.fetch = global.fetch;
global.window.alert = function () {};
global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\topenHandle: openHandle,\n" +
	"\t\tnewDocId: newDocId,\n" +
	"\t\tdocIdCreatedAt: docIdCreatedAt,\n" +
	"\t\tregionalDateTime: regionalDateTime,\n" +
	"\t\tensureIdentity: ensureIdentity,\n" +
	"\t\tserialize: function () { return serializeProject(); },\n" +
	"\t\tdocId: function () { return project.docId; },\n" +
	"\t\topenId: function () { return library.openId; },\n" +
	"\t\tentry: function () { return indexEntry(library.openId); },\n" +
	"\t\tprojectCount: function () { return library.projects.length; },\n" +
	"\t\tknownKey: LPN_KNOWN_DOCS_KEY,\n" +
	"\t\twipe: wipeAllStorage,\n" +
	"\t\thandleOf: function (id) { return handleFor(id); },\n" +
	"\t\tdropHandle: function (id) { fileHandles.delete(id); },\n" +
	// The drawing layers init() would build, so importProject() can land a project headless
	// (the same arrangement as example-view-harness.js).
	"\t\tsetSized: function () { mapSized = true; },\n" +
	"\t\tlayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tsvg.clientWidth = 1200; svg.clientHeight = 800;\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.layers();
L.setSized();

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log(' FAIL  ' + name + (extra === undefined ? '' : '   ' + extra));
}
setUnitSet('us');
L.ensureIdentity();

const settle = async () => { for (let i = 0; i < 20; i++) { await new Promise(r => setImmediate(r)); } };
function dialogOpen() { return byId.lpn_dialog.style.display === 'block'; }
function dialogText() { return byId.lpn_dialog_body.children.map(c => c.textContent); }
function dialogButtons() { return byId.lpn_dialog_buttons.children.map(c => c.textContent); }
function press(label) {
	const btn = byId.lpn_dialog_buttons.children.filter(c => c.textContent === label)[0];
	if (!btn) { throw new Error('no such button: ' + label + ' in ' + JSON.stringify(dialogButtons())); }
	(btn._listeners.click || []).forEach(fn => fn({}));
}
function known() {
	try { return JSON.parse(localStorage.getItem(L.knownKey) || '[]'); } catch (e) { return []; }
}
// A project file carrying `docId`, as a fake FileSystemFileHandle that counts writes.
function fileWith(docId, name) {
	const doc = L.serialize();
	doc.project = Object.assign({}, doc.project, { docId: docId, name: name || 'Copied' });
	const text = JSON.stringify(doc);
	return {
		kind: 'file', name: (name || 'Copied') + '.json', writes: 0,
		async getFile() { return { lastModified: 1, size: text.length, async text() { return text; } }; },
		async createWritable() { this.writes++; return { async write() {}, async close() {} }; },
		async queryPermission() { return 'granted'; },
		async requestPermission() { return 'granted'; },
		async isSameEntry(o) { return o === this; }
	};
}
// An ID minted at a known moment, in newDocId()'s own shape.
const T0 = Date.UTC(2026, 8, 14, 15, 30);
const idAt = (ms, tail) => 'd' + ms.toString(36) + (tail || 'AbCd1234');
// Every visitor-facing string is read from the page's own config, never retyped here, so a
// rewording is free (harness_wording_check.php).
const PC = global.EngCalcs.pageConfig;
const ORIGINAL_BTN = PC.lpn_copy_original;
const COPY_BTN = PC.lpn_copy_copy;
const TITLE = PC.lpn_copy_title;
const READ_ONLY_BTN = PC.lpn_lock_open_readonly;
const CANCEL_BTN = PC.lpn_cancel;

(async function () {

console.log('\n--- 0. the creation time is read out of the ID itself ---');
{
	ok('a minted ID gives back the moment it was minted', L.docIdCreatedAt(idAt(T0)) === T0);
	const fresh = L.newDocId();
	ok('...and newDocId() itself round-trips within a second', Math.abs(L.docIdCreatedAt(fresh) - Date.now()) < 1000);
	ok('...and newDocId() remembers what it minted', known()[0] === fresh);
	ok('a malformed ID gives no date rather than a wrong one', L.docIdCreatedAt('dZZZZZZZZZZZZZZZZ') === null);
	ok('...and so does one dated in the future', L.docIdCreatedAt(idAt(Date.now() + 5 * 86400000)) === null);
}

console.log('\n--- 1. the gate fires: locked elsewhere, and this browser does not know the ID ---');
const COPIED = idAt(T0, 'CoPy0001');
let copyHandle, landedBefore;
{
	lockedIds.add(COPIED);
	copyHandle = fileWith(COPIED, 'Main Street');
	landedBefore = L.projectCount();
	await L.openHandle(copyHandle);
	await settle();
	const text = dialogText();
	ok('a dialog is open', dialogOpen());
	ok('its title is Tom\'s question', text[0] === TITLE, JSON.stringify(text));
	ok('its body carries the ID\'s creation time in the regional format',
		text[1].indexOf(L.regionalDateTime(T0)) >= 0 && text[1].indexOf('{date}') < 0, text[1]);
	ok('...and is exactly the page\'s body string with the date filled in',
		text[1] === PC.lpn_copy_body.replace('{date}', L.regionalDateTime(T0)), text[1]);
	ok('the two answers, Original first so it takes the focus',
		JSON.stringify(dialogButtons()) === JSON.stringify([ORIGINAL_BTN, COPY_BTN]), JSON.stringify(dialogButtons()));
	ok('nothing has landed yet', L.projectCount() === landedBefore);
	ok('...and no em dash reaches the visitor', text.every(t => t.indexOf('—') < 0));
}

console.log('\n--- 3. the Copy answer ---');
{
	posted.length = 0;
	press(COPY_BTN);
	await settle();
	const newId = L.docId();
	ok('the project landed', L.projectCount() === landedBefore + 1);
	ok('...under a NEW docId', newId && newId !== COPIED, newId);
	ok('the new lock is taken under the new ID', posted.some(p => p.action === 'acquire' && p.id === newId),
		JSON.stringify(posted.map(p => p.action + ':' + p.id)));
	ok('the old ID is not touched at all: no acquire, steal, release or request',
		!posted.some(p => p.id === COPIED), JSON.stringify(posted.map(p => p.action + ':' + p.id)));
	ok('the file on disk was not written', copyHandle.writes === 0);
	ok('the tab says it is unsaved, because its identity now differs from the file', !!(L.entry() && L.entry().dirty));
	ok('the new ID is remembered here', known().indexOf(newId) >= 0);
	ok('the old ID is NOT remembered: this browser only ever met it as a copy', known().indexOf(COPIED) < 0);
}

console.log('\n--- 4. the Original answer ---');
const ORIG = idAt(T0 + 60000, 'OrIg0001');
{
	lockedIds.add(ORIG);
	await L.openHandle(fileWith(ORIG, 'Elm Street'));
	await settle();
	ok('the question is asked', dialogText()[0] === TITLE);
	posted.length = 0;
	press(ORIGINAL_BTN);
	await settle();
	ok('the ID is remembered', known().indexOf(ORIG) >= 0);
	ok('the ordinary lock question follows', dialogOpen() && dialogButtons().indexOf(READ_ONLY_BTN) >= 0,
		JSON.stringify(dialogButtons()));
	ok('...and nothing was sent about the lock in between', posted.length === 0);
	press(CANCEL_BTN);
	await settle();
}

console.log('\n--- 2. the gate is silent when this browser knows the ID ---');
{
	await L.openHandle(fileWith(ORIG, 'Elm Street'));
	await settle();
	ok('the same original, opened again, goes straight to the lock question',
		dialogOpen() && dialogText()[0] !== TITLE && dialogButtons().indexOf(READ_ONLY_BTN) >= 0,
		JSON.stringify(dialogText()[0]));
	press(CANCEL_BTN);
	await settle();
	// An ID this browser MINTED is known without anybody answering anything.
	const mine = L.newDocId();
	lockedIds.add(mine);
	await L.openHandle(fileWith(mine, 'Made here'));
	await settle();
	ok('an ID minted in this browser is never asked about', dialogOpen() && dialogText()[0] !== TITLE);
	press(CANCEL_BTN);
	await settle();
	// Nobody holds it: nothing to ask, whatever this browser remembers.
	const free = idAt(T0 + 120000, 'FrEe0001');
	const before = L.projectCount();
	await L.openHandle(fileWith(free, 'Nobody has it'));
	await settle();
	ok('an unknown ID that nobody holds opens without a question', L.projectCount() === before + 1 && !dialogOpen());
	ok('...and is remembered, having been opened here', known().indexOf(free) >= 0);
}

console.log('\n--- 6. an ID already open in a tab HERE, arriving in a different file ---');
// The pre-review's reproduction (2026-09-30): Main open in a tab, an Explorer copy of it opened.
// It used to switch to Main's tab AND rebind that tab to the copy's file, so Save overwrote the copy
// and Main stopped receiving saves.
{
	const SHARED = idAt(T0 + 180000, 'ShAr0001');
	const main = fileWith(SHARED, 'Main');
	await L.openHandle(main);
	await settle();
	const mainTab = L.openId();
	ok('Main lands as a tab connected to its own file', L.handleOf(mainTab) === main && !dialogOpen());

	// (a) The very same file again: the browser says it is the same entry, so today's switch stands.
	const tabs0 = L.projectCount();
	await L.openHandle(main);
	await settle();
	ok('the same file again switches to its tab with no question', !dialogOpen() && L.projectCount() === tabs0 && L.openId() === mainTab);

	// (b) A copy with the same ID, answered Copy.
	const backup = fileWith(SHARED, 'Backup');
	await L.openHandle(backup);
	await settle();
	ok('a different file with the same ID gets the question', dialogOpen() && dialogText()[0] === TITLE, JSON.stringify(dialogText()));
	ok('...with the open tab\'s wording, not "doesn\'t remember it"',
		dialogText()[1] === PC.lpn_copy_body_tab.replace('{name}', 'Main'), dialogText()[1]);
	ok('...and nothing about another browser', dialogText().indexOf(PC.lpn_copy_why) < 0);
	ok('Main\'s tab is still connected to Main while the question is open', L.handleOf(mainTab) === main);
	posted.length = 0;
	press(COPY_BTN);
	await settle();
	ok('"A copy" opens a NEW tab', L.projectCount() === tabs0 + 1 && L.openId() !== mainTab);
	ok('...under a new ID', L.docId() !== SHARED);
	ok('...connected to the copy\'s file', L.handleOf(L.openId()) === backup);
	ok('Main\'s tab is still connected to Main', L.handleOf(mainTab) === main);
	ok('the shared ID got no lock traffic from the copy', !posted.some(p => p.id === SHARED),
		JSON.stringify(posted.map(p => p.action + ':' + p.id)));

	// (c) Another copy, answered Original: switch, never rebind.
	const sameName = fileWith(SHARED, 'Main');   // a same-name file in another folder
	const tabs1 = L.projectCount();
	await L.openHandle(sameName);
	await settle();
	ok('a same-name file elsewhere gets the question too', dialogOpen() && dialogText()[0] === TITLE);
	press(ORIGINAL_BTN);
	await settle();
	ok('"Original" switches to Main\'s tab and opens nothing new', L.openId() === mainTab && L.projectCount() === tabs1);
	ok('...and does NOT swap the tab\'s file connection', L.handleOf(mainTab) === main);
	ok('...and nothing was written to either file', main.writes === 0 && sameName.writes === 0);

	// (d) A tab with no connection to compare: asked, and "Original" reconnects it (the documented
	// way to reconnect a tab is to open its file again).
	L.dropHandle(mainTab);
	const again = fileWith(SHARED, 'Main');
	await L.openHandle(again);
	await settle();
	ok('a tab with no file connection cannot be compared, so the question is asked', dialogOpen() && dialogText()[0] === TITLE);
	press(ORIGINAL_BTN);
	await settle();
	ok('..."Original" then reconnects that tab to the chosen file', L.openId() === mainTab && L.handleOf(mainTab) === again);
}

console.log('\n--- 5. Erase everything forgets the list ---');
{
	ok('the list is on the device before', localStorage.getItem(L.knownKey) !== null);
	L.wipe();
	ok('...and gone after wipeAllStorage()', localStorage.getItem(L.knownKey) === null);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
})().catch(e => { console.log(' FAIL  threw: ' + (e && e.stack || e)); process.exit(1); });
