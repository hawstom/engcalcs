// The one thing that cannot be automated, replaced by the smallest possible lie.
//
// `showSaveFilePicker()` / `showOpenFilePicker()` open native OS dialogs. Nothing in a browser can
// drive those, and that is the whole reason this pass was thought impossible. So the runner replaces
// exactly those two functions — and **nothing else** — with ones that return a handle to a file in
// the origin private file system (OPFS).
//
// **What makes this honest is that an OPFS handle is a real `FileSystemFileHandle`**: same class,
// same `getFile()` / `createWritable()` / `isSameEntry()`, structured-cloneable so IndexedDB really
// does keep it across a reload (Task 212's whole mechanism), and `queryPermission()` really answers
// `granted`. Every line of the page's file code below the picker is the production path. The lie
// stops at the dialog.
//
// It is injected with `addInitScript`, so **no test-only code ships in the page**. The page has no
// idea it is being tested and needs no flag, no build step and no seam.
//
// What this deliberately does NOT simulate: the native dialog's user-activation handshake (§1's
// riskiest guess), a user cancelling the dialog (available as `pickCancel()` but it is our own
// `AbortError`, not Chrome's), and a permission that is prompt-or-denied — OPFS is always granted.
// Those stay on the human list.

const INIT_SCRIPT = `
(function () {
	var pending = [];          // names the test has queued for the next picker call
	var log = [];              // what was asked for, so a spec can assert the picker opened at all
	async function root() { return await navigator.storage.getDirectory(); }
	function nextName(fallback) {
		var q = pending.shift();
		if (q === undefined) { return fallback; }
		return q;
	}
	window.__lpn = {
		queue: function (name) { pending.push(name); },
		calls: function () { return log.slice(); },
		// Read a file out of the shared drive's point of view — used by the runner to move bytes
		// between profiles, and by specs that want to look at what actually landed on disk.
		read: async function (name) {
			try {
				var h = await (await root()).getFileHandle(name);
				return await (await h.getFile()).text();
			} catch (err) { return null; }
		},
		write: async function (name, text) {
			var h = await (await root()).getFileHandle(name, { create: true });
			var w = await h.createWritable();
			await w.write(text);
			await w.close();
			return true;
		},
		remove: async function (name) {
			try { await (await root()).removeEntry(name); return true; } catch (err) { return false; }
		},
		list: async function () {
			var out = [];
			for await (var k of (await root()).keys()) { out.push(k); }
			return out;
		},
		// Stamp, for asserting that a write really did (or really did not) happen.
		stat: async function (name) {
			try {
				var f = await (await (await root()).getFileHandle(name)).getFile();
				return { size: f.size, lastModified: f.lastModified };
			} catch (err) { return null; }
		}
	};
	// **A write that goes nowhere.** Tom, 2026-08-06, on a file he had moved in Explorer: "It neither
	// complains nor creates a new file. It silently fails to save." A real folder can fail that way
	// -- a moved file, a revoked permission, a sync client holding the path -- and OPFS never can, so
	// the only way to test the page's answer to it is to hand it a handle whose writes are discarded.
	// Everything else about the handle stays real.
	//
	// The wrapper is NOT structured-cloneable, so a handle taken while this is on cannot be persisted
	// to IndexedDB. That is fine and deliberate: this switch exists for the save path, and any spec
	// using it says so.
	var sabotage = false;
	function sabotaged(h) {
		return {
			name: h.name,
			getFile: function () { return h.getFile(); },
			queryPermission: function () { return Promise.resolve('granted'); },
			requestPermission: function () { return Promise.resolve('granted'); },
			isSameEntry: function (o) { return h.isSameEntry(o); },
			createWritable: function () {
				return Promise.resolve({ write: function () { return Promise.resolve(); },
				                         close: function () { return Promise.resolve(); } });
			}
		};
	}
	window.__lpn.sabotageWrites = function (on) { sabotage = !!on; };
	// **A file that is not there but says it is.** Tom's Windows Chrome hands back a File object for a
	// path whose file has been deleted -- name, size and lastModified all from what the browser
	// already knew -- and only fails when something reads the bytes. Every guard that trusted
	// getFile() alone was therefore asking the browser's memory rather than the disk. OPFS never lies
	// this way, so the only way to test the page's answer is to build a handle that does.
	var phantom = false;
	// The METADATA is deliberately real and current — it mirrors the underlying file, so the size and
	// timestamp look exactly as they should and every metadata-based check passes. Only reading the
	// bytes fails. That is the whole point: a phantom whose metadata was obviously wrong would be
	// caught by the post-write size comparison, and would prove nothing about the guard being tested.
	function phantomed(h) {
		return {
			name: h.name,
			queryPermission: function () { return Promise.resolve('granted'); },
			requestPermission: function () { return Promise.resolve('granted'); },
			isSameEntry: function (o) { return h.isSameEntry(o); },
			getFile: async function () {
				var real = await h.getFile();
				return {
					name: real.name,
					size: real.size,
					lastModified: real.lastModified,
					slice: function () {
						return { arrayBuffer: function () { return Promise.reject(new DOMException('gone', 'NotFoundError')); } };
					},
					text: function () { return Promise.reject(new DOMException('gone', 'NotFoundError')); }
				};
			},
			createWritable: function () { return h.createWritable(); }
		};
	}
	window.__lpn.phantomNext = function (on) { phantom = !!on; };
	var cancelNext = false;
	window.__lpn.cancelNextPicker = function () { cancelNext = true; };
	function maybeCancel() {
		if (!cancelNext) { return false; }
		cancelNext = false;
		return true;
	}
	window.showSaveFilePicker = async function (opts) {
		opts = opts || {};
		log.push({ kind: 'save', suggestedName: opts.suggestedName || '' });
		if (maybeCancel()) { throw new DOMException('cancelled', 'AbortError'); }
		var name = nextName(opts.suggestedName || 'Untitled-lpn-hawsedc-engcalcs.json');
		var h = await (await root()).getFileHandle(name, { create: true });
		if (phantom) { return phantomed(h); }
		return sabotage ? sabotaged(h) : h;
	};
	window.showOpenFilePicker = async function (opts) {
		log.push({ kind: 'open' });
		if (maybeCancel()) { throw new DOMException('cancelled', 'AbortError'); }
		var name = nextName(null);
		if (!name) { throw new DOMException('nothing queued for showOpenFilePicker', 'AbortError'); }
		var oh = await (await root()).getFileHandle(name);
		return [sabotage ? sabotaged(oh) : oh];
	};
}());
`;

module.exports = { INIT_SCRIPT };
