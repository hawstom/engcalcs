// TASK 747 — A FILE COPIED OUTSIDE THIS PAGE SHARES ITS ORIGINAL'S LOCK. ASK, THEN SPLIT IT.
//
//   node dev/lpn-spike/copy-lock-harness.js
//
// An Explorer copy keeps the document ID baked into the file, and the ID is the lock key, so the
// copy and the original fight over one lock. Tom, 2026-09-30, gave the question:
// *"Mark file as new copy? This file was originally created on {date}, but this browser doesn't
// remember it. Is this the Original file (keep same lock) or a Copy (make new lock)?"*
// and then the gate: *"We should be examining only the file itself and what we and this browser
// know about the file. The question should appear when the file is unknown to the browser. If we
// can't guarantee that it's the same file, we must ask... This is a whitelist exercise."*
//
// So nothing here looks at the lock server before the question, and no new storage exists. The
// whitelist (never asked), each door asserted silent below:
//   (a) opened from the recent list;
//   (b) isSameEntry() with a handle this browser already holds -- a recent-list row or a tab's;
//   (c) the browser already grants write permission on the file;
//   and a file with no document ID, which has no identity to share.
// Everything else is asked, including a KNOWN ID arriving in a file that is not provably the open
// tab's own -- the pre-review's reproduction (2026-09-30), where switching to the tab used to rebind
// it to the copy's file so Save overwrote the copy.
//
// Driven through the page's own openHandle(), with the broker faked at fetch and fake file handles
// whose identity is a PATH (isSameEntry compares paths, as Chrome's does) and which count writes.

const { setUnitSet, byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const posted = [];
const lockedIds = new Set();   // held by somebody else
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
	"\t\tdocIdCreatedAt: docIdCreatedAt,\n" +
	"\t\tregionalDateTime: regionalDateTime,\n" +
	"\t\tensureIdentity: function () { var i = ensureIdentity(); i.trained = true; return i; },\n" +
	"\t\topenRecentFile: openRecentFile,\n" +
	"\t\tserialize: function () { return serializeProject(); },\n" +
	"\t\tdocId: function () { return project.docId; },\n" +
	"\t\topenId: function () { return library.openId; },\n" +
	"\t\tentry: function () { return indexEntry(library.openId); },\n" +
	"\t\tprojectCount: function () { return library.projects.length; },\n" +
	"\t\thandleOf: function (id) { return handleFor(id); },\n" +
	"\t\tdropHandle: function (id) { fileHandles.delete(id); },\n" +
	"\t\tnoteRecent: noteRecentFile,\n" +
	"\t\tinRecent: function (h) { return recentFiles.some(function (r) { return r.handle === h; }); },\n" +
	"\t\tclose: function (id) { discardProject(id); },\n" +
	"\t\tsetSized: function () { mapSized = true; },\n" +
	// The drawing layers init() would build, so importProject() can land a project headless
	// (the same arrangement as example-view-harness.js).
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
// Every visitor-facing string is read from the page's own config, never retyped here, so a
// rewording is free (harness_wording_check.php).
const PC = global.EngCalcs.pageConfig;
const TITLE = PC.lpn_copy_title;
const ORIGINAL_BTN = PC.lpn_copy_original;
const COPY_BTN = PC.lpn_copy_copy;
const READ_ONLY_BTN = PC.lpn_lock_open_readonly;
const CANCEL_BTN = PC.lpn_cancel;
const asked = () => dialogOpen() && dialogText()[0] === TITLE;

// A project file at `path` carrying `docId` (or none), as a fake FileSystemFileHandle. Two handles
// with one path are one file, as isSameEntry() says in Chrome. `perm` is what queryPermission gives.
function fileAt(path, docId, perm) {
	const doc = L.serialize();
	doc.project = Object.assign({}, doc.project, { name: path.replace(/^.*\//, '').replace(/\.lwn$/, '') });
	if (docId) { doc.project.docId = docId; } else { delete doc.project.docId; }
	const text = JSON.stringify(doc);
	return {
		kind: 'file', name: path.replace(/^.*\//, ''), path: path, writes: 0,
		async getFile() { return { lastModified: 1, size: text.length, async text() { return text; } }; },
		async createWritable() { this.writes++; return { async write() {}, async close() {} }; },
		async queryPermission() { return perm || 'prompt'; },
		async requestPermission() { return 'granted'; },
		async isSameEntry(o) { return !!o && o.path === this.path; }
	};
}
const T0 = Date.UTC(2026, 8, 14, 15, 30);
let seq = 0;
const idAt = (ms) => 'd' + ms.toString(36) + ('Xy' + (++seq)).padEnd(8, '0');

(async function () {

console.log('\n--- 0. the creation time is read out of the ID itself ---');
{
	const id = idAt(T0);
	ok('an ID gives back the moment it was minted', L.docIdCreatedAt(id) === T0);
	ok('a malformed ID gives no date rather than a wrong one', L.docIdCreatedAt('dZZZZZZZZZZZZZZZZ') === null);
	ok('...and so does one dated in the future', L.docIdCreatedAt(idAt(Date.now() + 5 * 86400000)) === null);
}

console.log('\n--- 1. a file this browser cannot vouch for is asked about ---');
const COPIED = idAt(T0);
let copyHandle, before;
{
	copyHandle = fileAt('C:/Mail/Main Street.lwn', COPIED);
	before = L.projectCount();
	posted.length = 0;
	await L.openHandle(copyHandle);
	await settle();
	const text = dialogText();
	ok('Tom\'s question is asked', asked(), JSON.stringify(text));
	ok('its body is exactly his, with the ID\'s date in the regional format',
		text[1] === PC.lpn_copy_body.replace('{date}', L.regionalDateTime(T0)), text[1]);
	ok('...and nothing else is said: title and body only', text.length === 2, JSON.stringify(text));
	ok('his two answers, Original first so it takes the focus',
		JSON.stringify(dialogButtons()) === JSON.stringify([ORIGINAL_BTN, COPY_BTN]), JSON.stringify(dialogButtons()));
	ok('nothing has landed yet', L.projectCount() === before);
	ok('and the lock server was not consulted to decide it', posted.length === 0,
		JSON.stringify(posted.map(p => p.action)));
}

console.log('\n--- 2. the Copy answer ---');
{
	press(COPY_BTN);
	await settle();
	const newId = L.docId();
	ok('the project landed', L.projectCount() === before + 1);
	ok('...under a NEW docId', newId && newId !== COPIED, newId);
	ok('the new lock is taken under the new ID', posted.some(p => p.action === 'acquire' && p.id === newId),
		JSON.stringify(posted.map(p => p.action + ':' + p.id)));
	ok('the old ID is not touched at all', !posted.some(p => p.id === COPIED),
		JSON.stringify(posted.map(p => p.action + ':' + p.id)));
	ok('the file on disk was not written', copyHandle.writes === 0);
	ok('the tab says it is unsaved, because its identity now differs from the file', !!(L.entry() && L.entry().dirty));
	ok('the file is now in the recent list, so it is known next time', L.inRecent(copyHandle));
	L.close(L.openId());
}

console.log('\n--- 3. the Original answer ---');
{
	const ORIG = idAt(T0 + 60000);
	const h = fileAt('C:/Mail/Elm Street.lwn', ORIG);
	await L.openHandle(h);
	await settle();
	ok('the question is asked', asked());
	posted.length = 0;
	press(ORIGINAL_BTN);
	await settle();
	ok('it lands with the SAME ID', L.docId() === ORIG);
	ok('...having gone through the ordinary lock check', posted.some(p => p.action === 'check' && p.id === ORIG));
	ok('...and is now in the recent list', L.inRecent(h));
	L.close(L.openId());
	// A NEW handle to the same file, as a second trip through the picker gives.
	await L.openHandle(fileAt('C:/Mail/Elm Street.lwn', ORIG));
	await settle();
	ok('opened again through the picker, it is known (isSameEntry with the recent row): no question',
		!asked() && L.docId() === ORIG);
	L.close(L.openId());
	// Original, and the file is in use elsewhere: the lock question follows, unchanged.
	const LOCKED = idAt(T0 + 90000);
	lockedIds.add(LOCKED);
	await L.openHandle(fileAt('C:/Mail/Oak Street.lwn', LOCKED));
	await settle();
	press(ORIGINAL_BTN);
	await settle();
	ok('Original on a file somebody holds leads to the ordinary lock dialog',
		dialogOpen() && dialogButtons().indexOf(READ_ONLY_BTN) >= 0, JSON.stringify(dialogButtons()));
	press(CANCEL_BTN);
	await settle();
}

console.log('\n--- 4. every whitelist door is silent ---');
{
	let n = L.projectCount();
	// (a) the recent list
	await L.openHandle(fileAt('D:/a.lwn', idAt(T0 + 1)), true);
	await settle();
	ok('(a) opened from the recent list: no question', !asked() && L.projectCount() === ++n);
	L.close(L.openId()); n--;
	// ...and through the menu row's own route, which is what sets that flag. The row's handle is
	// deliberately NOT in the in-memory list, so only the route can be what whitelists it.
	await L.openRecentFile({ handle: fileAt('D:/a2.lwn', idAt(T0 + 5)), name: 'a2.lwn' });
	await settle();
	ok('(a) the recent-list menu route itself opens without a question', !asked() && L.projectCount() === ++n);
	L.close(L.openId()); n--;
	// (b) isSameEntry with a recent row
	const bId = idAt(T0 + 2);
	await L.noteRecent(fileAt('D:/b.lwn', bId));
	await L.openHandle(fileAt('D:/b.lwn', bId));
	await settle();
	ok('(b) a new handle to a file in the recent list: no question', !asked() && L.projectCount() === ++n);
	L.close(L.openId()); n--;
	// (c) write permission already granted
	await L.openHandle(fileAt('D:/c.lwn', idAt(T0 + 3), 'granted'));
	await settle();
	ok('(c) the browser already grants write permission: no question', !asked() && L.projectCount() === ++n);
	L.close(L.openId()); n--;
	// no docId at all
	await L.openHandle(fileAt('D:/d.lwn', null));
	await settle();
	ok('a file with no document ID has nothing to ask about', !asked() && L.projectCount() === ++n);
	L.close(L.openId()); n--;
	// a known file that somebody else holds: the lock dialog alone, as before this task
	const held = idAt(T0 + 4);
	lockedIds.add(held);
	await L.openHandle(fileAt('D:/e.lwn', held), true);
	await settle();
	ok('a known file in use elsewhere gets only the lock dialog, as before',
		dialogOpen() && !asked() && dialogButtons().indexOf(READ_ONLY_BTN) >= 0, JSON.stringify(dialogText()[0]));
	press(CANCEL_BTN);
	await settle();
}

console.log('\n--- 5. a known ID open in a tab, arriving in a different file ---');
// The pre-review's reproduction (2026-09-30): Main open in a tab, an Explorer copy of it opened.
{
	const SHARED = idAt(T0 + 180000);
	const main = fileAt('C:/Work/Main.lwn', SHARED);
	await L.openHandle(main, true);
	await settle();
	const mainTab = L.openId();
	ok('Main lands as a tab connected to its own file', L.handleOf(mainTab) === main && !dialogOpen());

	const tabs0 = L.projectCount();
	await L.openHandle(fileAt('C:/Work/Main.lwn', SHARED));
	await settle();
	ok('the same file again switches to its tab with no question', !dialogOpen() && L.projectCount() === tabs0 && L.openId() === mainTab);

	// Even with another door open (permission granted), a different file never rebinds the tab.
	const backup = fileAt('C:/Work/Backup.lwn', SHARED, 'granted');
	await L.openHandle(backup);
	await settle();
	ok('a different file with the same ID is asked about, whatever else is known of it', asked(), JSON.stringify(dialogText()));
	ok('Main\'s tab is still connected to Main while the question is open', L.handleOf(mainTab).path === main.path);
	posted.length = 0;
	press(COPY_BTN);
	await settle();
	ok('"A copy" opens a NEW tab under a new ID', L.projectCount() === tabs0 + 1 && L.openId() !== mainTab && L.docId() !== SHARED);
	ok('...connected to the copy\'s file', L.handleOf(L.openId()) === backup);
	ok('Main\'s tab is still connected to Main', L.handleOf(mainTab).path === main.path);
	ok('the shared ID got no lock traffic from the copy', !posted.some(p => p.id === SHARED));

	const sameName = fileAt('E:/Elsewhere/Main.lwn', SHARED);   // same name, another folder
	const tabs1 = L.projectCount();
	await L.openHandle(sameName);
	await settle();
	ok('a same-name file in another folder is asked about', asked());
	press(ORIGINAL_BTN);
	await settle();
	ok('"Original" switches to Main\'s tab and opens nothing new', L.openId() === mainTab && L.projectCount() === tabs1);
	ok('...and does NOT swap the tab\'s file connection', L.handleOf(mainTab).path === main.path);
	ok('...and nothing was written to either file', main.writes === 0 && sameName.writes === 0);

	// A tab with no connection left to compare.
	L.dropHandle(mainTab);
	const stranger = fileAt('F:/Unknown/Main.lwn', SHARED);
	await L.openHandle(stranger);
	await settle();
	ok('a tab with no connection, and a file this browser does not know: asked', asked());
	press(ORIGINAL_BTN);
	await settle();
	ok('..."Original" then reconnects the tab to the chosen file', L.openId() === mainTab && L.handleOf(mainTab) === stranger);
	L.dropHandle(mainTab);
	await L.openHandle(fileAt('C:/Work/Main.lwn', SHARED));
	await settle();
	ok('a tab with no connection, and its own file (known from the recent list): reconnected with no question',
		!asked() && L.openId() === mainTab && L.handleOf(mainTab).path === 'C:/Work/Main.lwn');
}

console.log('\n--- 6. no new storage ---');
{
	const keys = [];
	for (let i = 0; i < localStorage.length; i++) { keys.push(localStorage.key(i)); }
	ok('no key but the page\'s existing lpn_ ones', keys.every(k => !/^lpn_/.test(k) ||
		/^lpn_(index|identity|project_|document|pane|rpane|setbox|findbox|libbox)/.test(k)), keys.join(','));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
})().catch(e => { console.log(' FAIL  threw: ' + (e && e.stack || e)); process.exit(1); });
