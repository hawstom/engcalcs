// Task 258 — headless check of the File > Recent files list.
//
//   node dev/lpn-spike/recent-files-harness.js
//
// Same seam-stubbing approach as handle-restore-harness.js, and for the same reason: IndexedDB and
// the File System Access API are the browser's job, and faking them would mostly test the fake.
// What can actually be wrong here is the BOOKKEEPING and the DECISION TABLE —
//
//   * does a file opened twice produce one row or two, and does it come back to the top;
//   * does isSameEntry (not the name) decide identity, so two folders' Main.json stay two rows;
//   * does the list stay capped, dropping the oldest;
//   * on a click: granted opens silently, prompt-then-granted opens, denied opens nothing and
//     KEEPS the row, and a file that has since vanished opens nothing and LOSES its row.
//
// Written 2026-08-10 so Tom is not handed a browser pass for arithmetic.

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

function extract(name) {
	const re = new RegExp('(?:async )?function ' + name + '\\s*\\(');
	const at = src.search(re);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return src.slice(at, end);
}

// LPN_RECENT_MAX is read from the source too — a harness that hard-codes 8 stops testing the cap
// the moment somebody changes it.
const capMatch = src.match(/var LPN_RECENT_MAX = (\d+);/);
if (!capMatch) { throw new Error('LPN_RECENT_MAX not found'); }
const CAP = Number(capMatch[1]);

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// A handle that answers isSameEntry from an explicit identity, so two handles may share a NAME and
// still be different files — the case a name-keyed list would have collapsed.
function fakeHandle(name, identity, opts = {}) {
	return {
		name,
		identity: identity === undefined ? name : identity,
		asked: { query: 0, request: 0 },
		gone: !!opts.gone,
		noIsSameEntry: !!opts.noIsSameEntry,
		async isSameEntry(other) {
			if (this.noIsSameEntry) { throw new Error('unsupported'); }
			return !!other && other.identity === this.identity;
		},
		async queryPermission() { this.asked.query++; return opts.query || 'granted'; },
		async requestPermission() { this.asked.request++; return opts.request || opts.query || 'granted'; },
		async getFile() { if (this.gone) { throw new Error('NotFoundError'); } return { async text() { return '{}'; } }; }
	};
}

// A handle with no isSameEntry AT ALL (rather than one that throws), which is the older-browser
// shape the name fallback exists for.
function nameOnlyHandle(name) {
	const h = fakeHandle(name, name);
	delete h.isSameEntry;
	return h;
}

// ---------------------------------------------------------------------------
// A scope carrying the module-level state these four functions close over.
// ---------------------------------------------------------------------------
function makeScope(opts = {}) {
	const saved = [];
	const opened = [];
	const notices = [];
	const scope = {
		recentFiles: [],
		LPN_RECENT_MAX: CAP,
		saveRecentFiles() { saved.push(scope.recentFiles.map(r => r.name)); },
		setNotice(t) { notices.push(t); },
		openHandle: async (h) => { opened.push(h.name); },
		requireFileIdentity: () => opts.identityOk !== false,
		// The real one narrows to '' when the API is missing; here the handle answers directly.
		handlePermission: async (h, ask) => (ask ? h.requestPermission() : h.queryPermission()),
		EngCalcs: { pageConfig: {} },
		dropRecentFile: null,
		_saved: saved, _opened: opened, _notices: notices
	};
	const body = [extract('sameFile'), extract('noteRecentFile'), extract('dropRecentFile'), extract('openRecentFile')].join('\n');
	const names = Object.keys(scope);
	const build = new Function(...names, body + '\nreturn { sameFile, noteRecentFile, dropRecentFile, openRecentFile, get list() { return recentFiles; } };');
	// The extracted bodies assign to `recentFiles`, so it has to be a real binding in their scope
	// rather than a property read — hence passing it as a parameter and reading it back through the
	// getter above.
	const api = build(...names.map(n => scope[n]));
	scope.api = api;
	return scope;
}

async function run() {
	// --- dedupe, ordering, cap -------------------------------------------------
	{
		const s = makeScope();
		const a = fakeHandle('Main.json'), b = fakeHandle('Loop.json');
		await s.api.noteRecentFile(a);
		await s.api.noteRecentFile(b);
		report(s.api.list.length === 2, 'two files make two rows', JSON.stringify(s.api.list.map(r => r.name)));
		report(s.api.list[0].name === 'Loop.json', 'most recent is first');

		await s.api.noteRecentFile(a);
		report(s.api.list.length === 2, 'reopening a file does not add a second row', 'len=' + s.api.list.length);
		report(s.api.list[0].name === 'Main.json', 'reopening moves it back to the top');
		report(s._saved.length === 3, 'every change is persisted', 'writes=' + s._saved.length);
	}
	{
		const s = makeScope();
		// Same NAME, different files. A name-keyed list would show one row here.
		await s.api.noteRecentFile(fakeHandle('Main.json', 'folderA/Main.json'));
		await s.api.noteRecentFile(fakeHandle('Main.json', 'folderB/Main.json'));
		report(s.api.list.length === 2, 'same name in two folders stays two rows', 'len=' + s.api.list.length);
	}
	{
		const s = makeScope();
		// No isSameEntry: the name is all that browser can offer, and it must still dedupe.
		await s.api.noteRecentFile(nameOnlyHandle('Main.json'));
		await s.api.noteRecentFile(nameOnlyHandle('Main.json'));
		report(s.api.list.length === 1, 'without isSameEntry the name dedupes', 'len=' + s.api.list.length);
	}
	{
		const s = makeScope();
		// isSameEntry present but throwing (a permission-ish failure) must fall back, not crash.
		await s.api.noteRecentFile(fakeHandle('Main.json', 'x', { noIsSameEntry: true }));
		await s.api.noteRecentFile(fakeHandle('Main.json', 'y', { noIsSameEntry: true }));
		report(s.api.list.length === 1, 'a throwing isSameEntry falls back to the name', 'len=' + s.api.list.length);
	}
	{
		const s = makeScope();
		for (let i = 0; i < CAP + 3; i++) { await s.api.noteRecentFile(fakeHandle('f' + i + '.json')); }
		report(s.api.list.length === CAP, `the list is capped at ${CAP}`, 'len=' + s.api.list.length);
		report(s.api.list[0].name === 'f' + (CAP + 2) + '.json', 'the newest survives');
		report(!s.api.list.some(r => r.name === 'f0.json'), 'the oldest is dropped');
	}
	{
		const s = makeScope();
		await s.api.noteRecentFile(null);
		await s.api.noteRecentFile({});          // landOpenedFile reaches rememberHandle with no handle
		report(s.api.list.length === 0, 'a missing handle adds nothing');
	}
	{
		const s = makeScope();
		const a = fakeHandle('Main.json'), b = fakeHandle('Loop.json');
		await s.api.noteRecentFile(a);
		await s.api.noteRecentFile(b);
		await s.api.dropRecentFile(a);
		report(s.api.list.length === 1 && s.api.list[0].name === 'Loop.json', 'drop removes exactly one row');
	}

	// --- clicking a row --------------------------------------------------------
	{
		const s = makeScope();
		const h = fakeHandle('Main.json', 'm', { query: 'granted' });
		await s.api.noteRecentFile(h);
		await s.api.openRecentFile(s.api.list[0]);
		report(s._opened.length === 1, 'a granted handle opens');
		report(h.asked.request === 0, 'a granted handle is never asked again', 'requests=' + h.asked.request);
	}
	{
		const s = makeScope();
		const h = fakeHandle('Main.json', 'm', { query: 'prompt', request: 'granted' });
		await s.api.noteRecentFile(h);
		await s.api.openRecentFile(s.api.list[0]);
		report(h.asked.request === 1, 'a dormant grant is asked for once (the click is the gesture)');
		report(s._opened.length === 1, 'and then it opens');
	}
	{
		const s = makeScope();
		const h = fakeHandle('Main.json', 'm', { query: 'denied', request: 'denied' });
		await s.api.noteRecentFile(h);
		await s.api.openRecentFile(s.api.list[0]);
		report(s._opened.length === 0, 'a denied handle opens nothing');
		report(s.api.list.length === 1, 'and KEEPS its row — the file is still there');
		report(s._notices.length === 1, 'and says why');
	}
	{
		const s = makeScope();
		const h = fakeHandle('Main.json', 'm', { gone: true });
		await s.api.noteRecentFile(h);
		await s.api.openRecentFile(s.api.list[0]);
		report(s._opened.length === 0, 'a vanished file opens nothing');
		report(s.api.list.length === 0, 'and LOSES its row — it can never work again');
		report(s._notices.length === 1 && /Main\.json/.test(s._notices[0]), 'and names the file it dropped', s._notices[0]);
	}
	{
		const s = makeScope({ identityOk: false });
		const h = fakeHandle('Main.json');
		await s.api.noteRecentFile(h);
		await s.api.openRecentFile(s.api.list[0]);
		report(s._opened.length === 0, 'no file identity yet means no open (same gate as Open…)');
		report(h.asked.query === 0, 'and no permission prompt before that gate');
	}
	{
		const s = makeScope();
		await s.api.openRecentFile(null);
		await s.api.openRecentFile({ name: 'x' });
		report(s._opened.length === 0, 'a row with no handle opens nothing');
	}

	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
}

run();
