// Task 212 — headless check of what happens to a persisted file handle on the way back in.
//
//   node dev/lpn-spike/handle-restore-harness.js
//
// This deliberately does NOT fake IndexedDB. A fake store would mostly test the browser. What can
// actually be wrong here is the DECISION TABLE: for each handle we get back, do we reconnect it,
// hold it pending a click, or drop it — and does a project that no longer exists let go of its
// file. So the store is stubbed at the seam and the decisions are asserted.
//
// Written 2026-08-05 because Tom asked not to be handed browser passes he does not need to run.

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

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---------------------------------------------------------------------------
// A handle whose permission answer we control, and which records what was asked.
// ---------------------------------------------------------------------------
function fakeHandle(name, queryState, requestState) {
	return {
		name,
		asked: { query: 0, request: 0 },
		async queryPermission() { this.asked.query++; return queryState; },
		async requestPermission() { this.asked.request++; return requestState === undefined ? queryState : requestState; }
	};
}

async function scenario(label, rows, openProjects, stampsOnRecord = []) {
	// --- the seams restoreHandlesOnBoot() reaches through ---
	const forgotten = [];
	const stamped = [];
	const fileHandles = new Map();
	const pendingHandles = new Map();

	const recallHandles = async () => rows.map(r => r.handle);
	const recallHandleKeys = async () => rows.map(r => r.id);
	const forgetHandle = (id) => { forgotten.push(id); };
	const indexEntry = (id) => (openProjects.includes(id) ? { id, fileName: id + '.json' } : null);
	const stampFile = async (id) => { stamped.push(id); };
	let armed = 0;
	const armPendingReconnect = () => { armed++; };
	// The stamp a previous page left behind. A project listed in `stamped` here was re-stamped on
	// boot, which is the thing that must NOT happen where a baseline already exists.
	const knownStamp = (id) => (openProjects.includes(id) && stampsOnRecord.includes(id) ? '123:456' : '');

	const handlePermission = eval('(' + extract('handlePermission') + ')');
	const restoreHandlesOnBoot = eval('(' + extract('restoreHandlesOnBoot') + ')');

	await restoreHandlesOnBoot();
	return { forgotten, stamped, fileHandles, pendingHandles, armed, label };
}

(async function () {
	console.log('\n=== Task 212: restoring file handles after a reload ===\n');

	// 1. Permission already granted -> silently connected, no banner, no click.
	{
		const h = fakeHandle('granted.json', 'granted');
		const r = await scenario('granted', [{ id: 'p1', handle: h }], ['p1']);
		report(r.fileHandles.has('p1'), 'granted: reconnected without asking anything',
			`requestPermission called ${h.asked.request} time(s)`);
		report(h.asked.request === 0, 'granted: never prompts the user');
		report(r.stamped.includes('p1'), 'granted: file re-stamped, so the freshness check has a baseline');
		report(r.pendingHandles.size === 0, 'granted: nothing left pending');

		// …but NOT over a baseline the last page already left behind. Re-stamping there adopts
		// whatever a colleague wrote while we were away as "the file we last saw", and the next Save
		// goes straight over their work.
		const h2 = fakeHandle('granted.json', 'granted');
		const r2 = await scenario('granted, stamp on record', [{ id: 'p1', handle: h2 }], ['p1'], ['p1']);
		report(r2.fileHandles.has('p1'), 'granted with a stamp on record: still reconnected');
		report(!r2.stamped.includes('p1'), 'granted with a stamp on record: the OLD baseline is kept, not overwritten');
	}

	// 2. Permission needs a gesture -> held pending, NOT asked during boot.
	{
		const h = fakeHandle('prompt.json', 'prompt');
		const r = await scenario('prompt', [{ id: 'p1', handle: h }], ['p1']);
		report(!r.fileHandles.has('p1'), 'prompt: not treated as connected');
		report(r.pendingHandles.has('p1'), 'prompt: kept for the one-click reconnect');
		report(h.asked.request === 0, 'prompt: does NOT call requestPermission during boot',
			'no user gesture exists there; asking would fail and teach nothing');
		report(r.forgotten.length === 0, 'prompt: handle is not thrown away');
		report(r.armed === 1, 'prompt: the next user gesture is armed to revive it silently');
	}

	// 3. Denied -> dropped, so the store does not keep something unusable.
	{
		const h = fakeHandle('denied.json', 'denied');
		const r = await scenario('denied', [{ id: 'p1', handle: h }], ['p1']);
		report(!r.fileHandles.has('p1') && !r.pendingHandles.has('p1'), 'denied: not connected, not pending');
		report(r.forgotten.includes('p1'), 'denied: forgotten');
	}

	// 4. The API is not there at all (older browser) -> same as denied, no crash.
	{
		const h = { name: 'noapi.json' }; // no queryPermission
		const r = await scenario('no api', [{ id: 'p1', handle: h }], ['p1']);
		report(r.forgotten.includes('p1'), 'no permission API: forgotten rather than throwing');
	}

	// 5. A handle whose project has since been CLOSED must let go of the file.
	{
		const h = fakeHandle('orphan.json', 'granted');
		const r = await scenario('orphan', [{ id: 'gone', handle: h }], []);
		report(r.forgotten.includes('gone'), 'closed project: its handle is dropped');
		report(h.asked.query === 0, 'closed project: not even asked about — it is nobody\'s file now');
		report(!r.fileHandles.has('gone'), 'closed project: not resurrected into the session');
	}

	// 6. Mixed, because boot is never one project.
	{
		const rows = [
			{ id: 'a', handle: fakeHandle('a.json', 'granted') },
			{ id: 'b', handle: fakeHandle('b.json', 'prompt') },
			{ id: 'c', handle: fakeHandle('c.json', 'denied') },
			{ id: 'd', handle: fakeHandle('d.json', 'granted') }
		];
		const r = await scenario('mixed', rows, ['a', 'b', 'c']); // 'd' was closed
		report(r.fileHandles.has('a') && !r.fileHandles.has('d'), 'mixed: only live granted projects connect');
		report(r.pendingHandles.has('b'), 'mixed: the prompt one waits');
		report(r.forgotten.includes('c') && r.forgotten.includes('d'), 'mixed: denied and orphaned both dropped');
		report(r.fileHandles.size === 1 && r.pendingHandles.size === 1, 'mixed: no cross-talk between projects');
	}

	// 7. A store that returns nothing must be survivable — this is the private-browsing path.
	{
		const r = await scenario('empty store', [], ['p1']);
		report(r.fileHandles.size === 0 && r.forgotten.length === 0, 'empty store: no connections, no errors');
		report(r.armed === 0, 'empty store: nothing pending, so no gesture is ever spent on it');
	}

	// 8. The gesture itself. A dormant grant is revived by requestPermission() with a user
	//    activation and shows the user NOTHING — so the first pointerdown or keydown has to spend
	//    itself here, exactly once per project, and never on a project that has nothing pending.
	{
		const listeners = { pointerdown: [], keydown: [] };
		const document = { addEventListener: (t, fn) => { (listeners[t] || []).push(fn); } };
		const library = { openId: 'p1' };
		const pendingHandles = new Map([['p1', fakeHandle('p1.json', 'prompt')], ['p2', fakeHandle('p2.json', 'prompt')]]);
		const reconnectTried = new Set();
		const reconnected = [];
		const reconnectPendingFile = () => { reconnected.push(library.openId); };
		const armPendingReconnect = eval('(' + extract('armPendingReconnect') + ')');

		armPendingReconnect();
		armPendingReconnect(); // a second boot-path call must not double-wire the page
		report(listeners.pointerdown.length === 1 && listeners.keydown.length === 1,
			'gesture: armed once, for a pointer and for a key');

		const fire = () => { listeners.pointerdown.forEach(fn => fn()); };
		fire();
		report(reconnected.length === 1 && reconnected[0] === 'p1', 'gesture: the first one revives the open project');
		fire(); fire();
		report(reconnected.length === 1, 'gesture: asked once per project, never again on later clicks');

		library.openId = 'p2';
		fire();
		report(reconnected.length === 2 && reconnected[1] === 'p2',
			'gesture: a second reloaded tab gets its own attempt when you switch to it');

		library.openId = 'p3'; // a browser project — no file, nothing pending
		fire();
		report(reconnected.length === 2, 'gesture: a project with no pending handle is left alone');
	}

	// 9. The freshness check across a page load — Tom, 2026-08-05: "Still doesn't work with broker
	//    blocked. Save is apparently allowed as normal." The stamp is the ONLY thing standing between
	//    a colleague's file and our older copy when the lock broker is unreachable, so it has to
	//    survive the reload that Task 212 just made routine.
	{
		const index = { p1: { id: 'p1', fileName: 'Maricopa-Flex.json' } };
		let saves = 0;
		const indexEntry = (id) => index[id] || null;
		const saveIndex = () => { saves++; };
		let fileStamps = new Map();
		const fileAt = (lastModified, size) => ({ getFile: async () => ({ lastModified, size }) });

		const knownStamp = eval('(' + extract('knownStamp') + ')');
		const stampFile = eval('(' + extract('stampFile') + ')');
		const fileChangedUnderneath = eval('(' + extract('fileChangedUnderneath') + ')');

		await stampFile('p1', fileAt(1000, 50));
		report(index.p1.fileStamp === '1000:50', 'stamp: written through to the index, where a reload can find it');
		report(saves === 1, 'stamp: the index is actually saved, not just mutated in memory');

		report(await fileChangedUnderneath('p1', fileAt(1000, 50)) === false, 'stamp: an untouched file is not a change');
		report(await fileChangedUnderneath('p1', fileAt(2000, 50)) === true, 'stamp: a newer file IS a change');
		report(await fileChangedUnderneath('p1', fileAt(1000, 61)) === true, 'stamp: a same-time, different-size file IS a change');

		// The reload: the Map dies with the page, the index does not.
		fileStamps = new Map();
		report(knownStamp('p1') === '1000:50', 'reload: the baseline comes back out of the index');
		report(await fileChangedUnderneath('p1', fileAt(2000, 50)) === true,
			'reload: a colleague who saved while we were away is still caught',
			'this is the check that was failing with the broker blocked');
		report(await fileChangedUnderneath('p1', fileAt(1000, 50)) === false, 'reload: an untouched file still saves normally');

		// Fails OPEN, in both of its unanswerable cases: a project we have never stamped, and a file
		// we cannot read. Either one refusing would be a Save that stops working for no visible reason.
		report(await fileChangedUnderneath('p2', fileAt(1000, 50)) === false, 'no baseline: fails open rather than refusing a Save');
		const dead = { getFile: async () => { throw new Error('gone'); } };
		report(await fileChangedUnderneath('p1', dead) === false, 'unreadable file: fails open too');
		await stampFile('p1', dead);
		report(index.p1.fileStamp === undefined, 'unreadable file: leaves NO baseline rather than a stale one');
	}

	// 10. "Is this file already open here?" — §5's two-live-tabs defect. Identity is the docId INSIDE
	//     the document; a copy saved under a new name is a different document and gets its own tab.
	{
		const library = { projects: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }] };
		const docs = { p1: { project: { docId: 'dAAA' } }, p2: { project: {} }, p3: { project: { docId: 'dBBB' } } };
		const projectKey = (id) => id;
		const readJSON = (k) => docs[k] || null;
		const projectWithDocId = eval('(' + extract('projectWithDocId') + ')');

		report(projectWithDocId('dAAA') === 'p1', 'already open: the tab holding that docId is found');
		report(projectWithDocId('dBBB') === 'p3', 'already open: found wherever it sits in the strip');
		report(projectWithDocId('dCCC') === null, 'not open: a file we do not have opens as a new tab');
		report(projectWithDocId(null) === null, 'no docId at all: never matches the browser-only project p2',
			'a file with no docId is not "the same file" as every project that has none');
	}

	// 11. Save as, asked of the file actually chosen. This is the OTHER write path, and read-only
	//     routes Save straight into it — so "our own file" is exactly the file a colleague is most
	//     likely to have moved on. None of these four answers may depend on the broker.
	{
		const mk = async (fileDoc, fileStamp, baseline, openDocId, ro, lockAnswer) => {
			const project = { docId: openDocId };
			const readOnly = ro;
			const library = { projects: [{ id: 'p1' }] };
			const docs = { p1: { project: { docId: 'dMINE' } } };
			const projectKey = (id) => id, readJSON = (k) => docs[k] || null;
			const knownStamp = () => baseline;
			const postLock = async () => lockAnswer;
			const lockHolderName = (r) => r.lockedBy;
			const EngCalcs = { pageConfig: {} };
			const projectWithDocId = eval('(' + extract('projectWithDocId') + ')');
			const inspectSaveTarget = eval('(' + extract('inspectSaveTarget') + ')');
			const [lm, size] = fileStamp.split(':');
			const handle = { getFile: async () => ({ lastModified: +lm, size: +size, text: async () => JSON.stringify(fileDoc) }) };
			return inspectSaveTarget(handle);
		};
		const mine = { project: { docId: 'dMINE', name: 'Maricopa Flex' } };
		const theirs = { project: { docId: 'dOTHER', name: 'Elm Street' } };
		const free = { ok: true, locked: false };
		const held = { ok: true, locked: true, mine: false, lockedBy: 'ABC' };
		const noBroker = null;

		let t = await mk(mine, '1000:50', '1000:50', 'dMINE', false, free);
		report(!t.stale && !t.foreign && !t.heldBy, 'save as: our own file, untouched since we saw it → no question asked');

		t = await mk(mine, '2000:50', '1000:50', 'dMINE', false, free);
		report(t.stale && !t.foreign, 'save as: our own file that has MOVED ON → asked about, and not as "a different project"');

		t = await mk(mine, '2000:50', '1000:50', 'dMINE', false, noBroker);
		report(t.stale, 'save as: still asked with the broker unreachable',
			'this is the case Tom reported twice as "Save is apparently allowed as normal"');

		t = await mk(mine, '1000:50', '1000:50', 'dMINE', false, held);
		report(t.heldBy === 'ABC', 'save as: our own file that somebody has TAKEN → refused',
			'the old early return never even asked the broker about our own docId');

		t = await mk(theirs, '1000:50', '', 'dMINE', false, free);
		report(t.foreign && t.name === 'Elm Street', 'save as: a different project of ours → named in the confirm');

		t = await mk(mine, '2000:50', '', 'dMINE', false, free);
		report(!t.stale, 'save as: no baseline → fails open, as an unanswerable question must');
	}

	// 12. What the lock dialog says. The reader is being asked to judge a claim, and every branch of
	//     that judgment is about time — so each case says the most it truthfully can.
	{
		const now = Date.now();
		const EngCalcs = { pageConfig: {} };
		const agoText = eval('(' + extract('agoText') + ')');
		const lockHeadingText = eval('(' + extract('lockHeadingText') + ')');

		const unsavedWork = lockHeadingText('ABC', { editedAt: now - 600000, savedAt: now - 1800000 });
		report(/10 minutes ago, 20 minutes after/.test(unsavedWork), 'lock dialog: unsaved work names both numbers',
			unsavedWork);
		const neverSaved = lockHeadingText('ABC', { editedAt: now - 600000, savedAt: 0 });
		report(/10 minutes/.test(neverSaved) && /not been saved|none of it/.test(neverSaved),
			'lock dialog: edited but never saved says so', neverSaved);
		const allSaved = lockHeadingText('ABC', { editedAt: now - 600000, savedAt: now - 60000 });
		report(/10 minutes/.test(allSaved) && /saved to the file/.test(allSaved),
			'lock dialog: everything saved says so — this is the safe one to break', allSaved);
		const justOpen = lockHeadingText('ABC', { editedAt: 0, savedAt: 0, lastActivity: Math.floor((now - 300000) / 1000) });
		report(/5 minutes/.test(justOpen), 'lock dialog: nothing edited falls back to when we last heard from them',
			justOpen);
		report(!/hours|days/.test(justOpen), 'lock dialog: lastActivity is read as SECONDS, not milliseconds',
			'mixing the units turns 5 minutes into 7 weeks');
		report(lockHeadingText('ABC', {}) === 'ABC has this file open.',
			'lock dialog: with no numbers at all, the bare sentence — and only then');
	}

	console.log(`\n${checks - failures}/${checks} checks passed.\n`);
	process.exit(failures ? 1 : 0);
})();
