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

async function scenario(label, rows, openProjects) {
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

	const handlePermission = eval('(' + extract('handlePermission') + ')');
	const restoreHandlesOnBoot = eval('(' + extract('restoreHandlesOnBoot') + ')');

	await restoreHandlesOnBoot();
	return { forgotten, stamped, fileHandles, pendingHandles, label };
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
	}

	console.log(`\n${checks - failures}/${checks} checks passed.\n`);
	process.exit(failures ? 1 : 0);
})();
